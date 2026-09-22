# Ansible

Configuration management for the homelab's bare-metal nodes, complementary to the Kubernetes-level GitOps managed by ArgoCD in `apps/`.

Where ArgoCD owns what runs *inside* the cluster, Ansible handles what needs to be configured on the *hosts themselves* before Kubernetes can run reliably.

## Why this exists

Every time a node has been rebuilt, rejoined, or renamed, the same handful of host-level fixes have had to be reapplied manually.

For example:

* Swap being enabled can cause kubelet to behave incorrectly.
* `containerd`'s CNI binary path can differ from where Flannel expects the plugins to be located.
* Kernel updates can leave the NVIDIA kernel module unavailable until DKMS rebuilds it.

These configurations are now documented and automated so the nodes can be reproduced without relying on manual steps or memory.

## Structure

```text
ansible/
├── ansible.cfg          # Ansible configuration and inventory path
├── inventory.yml        # Node definitions and group membership
├── group_vars/
│   └── all.yml          # Shared variables and package lists
├── requirements.yml     # Ansible Galaxy collections
├── run.sh               # Creates a venv, installs Ansible, and runs the playbook
├── site.yml             # Main entrypoint; assigns roles to host groups
└── roles/
    ├── common/            # Baseline packages on every node
    ├── k8s-node-prereqs/  # Kubernetes host prerequisites
    └── nvidia-gpu/        # NVIDIA driver and DKMS configuration
```

## Inventory

The inventory separates nodes by their role in the homelab:

| Group           | Members       | Purpose                             |
| --------------- | ------------- | ----------------------------------- |
| `control_plane` | `nuke`        | Kubernetes control plane            |
| `workers`       | `tank`, `ryu` | Kubernetes worker nodes             |
| `gpu_nodes`     | `tank`        | Nodes with a GPU used by Kubernetes |

`tank` belongs to both `workers` and `gpu_nodes`, so the NVIDIA role only targets the node that actually has a GPU.

`ryu` remains a regular Kubernetes worker and is not modified by the GPU-specific configuration.

## Roles

### `common`

Installs baseline packages on every managed node.

The package list is defined in `group_vars/all.yml` so it only needs to be maintained in one place.

Examples include:

* `curl`
* `git`
* `python3-pip`

### `k8s-node-prereqs`

Runs on `control_plane` and `workers`.

It currently handles:

* Disabling swap and commenting the swap entry out of `/etc/fstab`
* Ensuring `/usr/lib/cni` exists
* Mirroring CNI plugins from `/opt/cni/bin`
* Restarting `containerd` when the CNI configuration changes

These tasks address host-level configuration that can otherwise leave Kubernetes nodes in a `NotReady` state.

### `nvidia-gpu`

Runs on `gpu_nodes` only.

It handles the NVIDIA driver configuration required by the GPU worker.

The role:

* Checks whether `nvidia-smi` is already working
* Enables the required `contrib`/`non-free` package components
* Installs the NVIDIA driver when required
* Runs `dkms autoinstall` to rebuild the kernel module for the currently running kernel

This allows the GPU node to be recovered after a fresh installation or when the NVIDIA kernel module needs to be rebuilt after a kernel update.

## Usage

`run.sh` handles the Python/Ansible environment so Ansible does not need to be installed globally.

Run a dry run first:

```bash
./run.sh --check
```

Apply the configuration:

```bash
./run.sh
```

Ansible arguments are forwarded through `run.sh`, so hosts and tags can be targeted directly.

### Target specific configuration

Run only the Kubernetes prerequisite tasks:

```bash
./run.sh --tags k8s --check
```

Run only the NVIDIA configuration on `tank`:

```bash
./run.sh --tags gpu --limit tank
```

Check the complete configuration for `ryu`:

```bash
./run.sh --limit ryu --check
```

Available tags:

```text
common
k8s
swap
cni
gpu
```

## When to run this

Ansible is intended to be run when host-level configuration needs to be established or verified.

Typical situations include:

* After joining a node to the cluster for the first time
* After a `kubeadm reset` and rejoin
* After rebuilding a node
* After a fresh OS installation
* Before `kubeadm init` or `kubeadm join`
* After a kernel update if the NVIDIA module is no longer working
* When recovering or replacing a node

The goal is not to run Ansible constantly, but to make important host configuration reproducible when it is needed.

## Configuration boundary

Ansible intentionally stops at the host boundary.

```text
┌─────────────────────────────────────────────┐
│                 Bare-metal                  │
│                                             │
│  OS / packages / swap / CNI / NVIDIA / SSH │
│                    ▲                        │
│                    │                        │
│                  Ansible                    │
└────────────────────┼────────────────────────┘
                     │
                     ▼
              Kubernetes cluster
                     │
                   ArgoCD
                     │
                     ▼
              Kubernetes workloads
```

The responsibilities are therefore separated:

* **Ansible** → host configuration
* **kubeadm** → Kubernetes cluster bootstrap and membership
* **ArgoCD** → Kubernetes workloads and GitOps
* **Git** → source of truth for configuration
* **Backups** → recovery of persistent data

Ansible is not intended to replace ArgoCD or act as a backup system. Its purpose is to make the underlying nodes reproducible.

## Secrets

No secrets are stored or handled by this layer.

Kubernetes-level secrets are managed separately in `apps/` using Sealed Secrets.

The Ansible layer only manages host configuration such as packages, system settings, and kernel-level components.

## Dry runs

`--check` is used to preview changes without applying them:

```bash
./run.sh --check
```

Most configuration tasks support Ansible's check mode normally.

Tasks that rely on commands or shell operations may have limited check-mode support and can therefore be skipped or unable to accurately predict their result.

## Requirements

Ansible requires SSH access to each managed node.

The recommended setup is key-based authentication using either:

* a root SSH account, or
* a sudo-capable user with `become: true`

Example:

```bash
ssh-copy-id root@192.168.1.8
ssh-copy-id root@192.168.1.9
ssh-copy-id root@192.168.1.10
```

After SSH access is configured, verify connectivity with:

```bash
ansible all -m ping
```

Expected result:

```text
nuke      SUCCESS
tank      SUCCESS
ryu       SUCCESS
```

## Recovery workflow

The main benefit of this setup is reproducibility.

If a node needs to be rebuilt, the intended workflow is:

```text
Fresh OS
   │
   ▼
SSH access
   │
   ▼
Ansible
   │
   ├── Common configuration
   ├── Kubernetes prerequisites
   └── GPU configuration (tank)
   │
   ▼
kubeadm init / join
   │
   ▼
ArgoCD
   │
   ▼
Kubernetes workloads
   │
   ▼
Restore persistent data if required
```

This keeps the host configuration in version control instead of relying on undocumented manual fixes.
