# Kubernetes Workloads

Declarative Kubernetes workload definitions for the HomeOps cluster.

This directory represents the desired state of the workloads running in Kubernetes. ArgoCD continuously reconciles this configuration into the cluster, making Git the source of truth for application deployment and configuration.

Workloads should be changed through Git rather than by manually applying manifests with `kubectl`. Emergency changes may be made directly in the cluster when necessary, but persistent changes should always be reflected back in Git.

## Architecture

```text
                         Git Repository
                               │
                               ▼
                            apps/
                               │
                               ▼
                            ArgoCD
                               │
                    reconciliation / sync
                               │
                               ▼
                     Kubernetes Cluster
                               │
              ┌────────────────┼────────────────┐
              │                │                │
          Deployments      Services           PVCs
              │                │                │
              └────────────────┼────────────────┘
                               │
                         Running workloads
```

ArgoCD is responsible for reconciling the Kubernetes layer. Host-level configuration is deliberately managed separately through Ansible.

```text
Network
   │
   ▼
Ansible ───────────► Bare-metal host configuration
   │
   ▼
Kubernetes
   │
   ▼
ArgoCD ────────────► apps/
   │
   ▼
Workloads
```

## Design Principles

### Git as the source of truth

The repository describes the desired state of the cluster.

Changes to workloads should be made through Git so that infrastructure changes are:

* Version controlled
* Reviewable
* Auditable
* Reproducible
* Reversible

ArgoCD continuously compares the desired state in Git with the live cluster state and reconciles differences.

### Namespace-oriented organization

Each application directory represents a Kubernetes namespace and its corresponding ArgoCD Application.

Manifests are intentionally kept relatively flat within each namespace rather than introducing another directory hierarchy for individual components.

This keeps related resources close together and makes the ownership of each manifest immediately apparent.

For example, the `media/` namespace contains the components that collectively provide the media stack, even though they are deployed as separate Kubernetes workloads.

Shared infrastructure is kept separate where appropriate. For example, `postgres/` is independent from `immich/` because the database is infrastructure that can potentially serve workloads beyond a single application.

## Structure

```text
apps/
├── default/             # Homepage dashboard
├── postgres/            # Shared PostgreSQL instance
├── immich/              # Photo management and backup
├── media/               # Media stack and related services
├── observability/       # Monitoring and service availability
├── network/             # Network management and external connectivity
├── vaultwarden/         # Password manager
├── nextcloud/           # File sync and collaboration
├── homeassistant/       # Home automation
└── homelable/            # Network topology visualization
```

The exact contents of each namespace vary, but commonly include:

```text
namespace.yaml
*-deployment.yaml
*-pvc.yaml
sealed-secret.yaml
```

A deployment manifest may also contain the corresponding `Service` when keeping the resources together improves readability and ownership.

## Workload Categories

The namespaces are organized around functional boundaries rather than deployment technology.

### Media

The media namespace contains the components that make up the self-hosted media stack, including Jellyfin, the ARR applications, Jellyseerr, Navidrome and qBittorrent with Gluetun.

### Storage and Applications

Stateful workloads such as Immich, Nextcloud and PostgreSQL use persistent storage rather than relying on ephemeral container filesystems.

### Observability

The observability namespace contains monitoring and availability-related workloads such as Grafana, Prometheus, node-exporter and Uptime Kuma.

### Network Infrastructure

The network namespace contains infrastructure required for managing and connecting the homelab, including the UniFi Network Application, its database dependency and Cloudflare Tunnel.

### Home Automation

Home Assistant provides the Kubernetes-hosted home automation layer and requires special network handling for local device discovery.

## Storage

Persistent application data is provided through the storage infrastructure on `tank`.

The node exports storage over NFS, which is consumed by Kubernetes through the `nfs-subdir-external-provisioner`.

The resulting `StorageClass` is used by workloads through standard `PersistentVolumeClaim` resources.

```text
                    Kubernetes
                         │
                         ▼
                 PersistentVolumeClaim
                         │
                         ▼
                   nfs-storage
                         │
                         ▼
              NFS provisioner
                         │
                         ▼
                      tank
                         │
                         ▼
                     RAID1
```

Applications request storage through PVCs rather than directly referencing a node-local `hostPath`.

This keeps workload storage decoupled from a specific Kubernetes node and allows pods to be rescheduled without losing access to their persistent data.

The NFS-backed storage itself is a separate infrastructure and backup concern; a PVC does not constitute a backup.

## GPU Workloads

Jellyfin uses the NVIDIA GPU on `tank` for hardware-accelerated transcoding.

The workload requests:

```yaml
resources:
  limits:
    nvidia.com/gpu: 1
```

The workload is scheduled to `tank`, where the physical GPU is available.

The Kubernetes GPU integration depends on the NVIDIA device plugin being available in the cluster and the host correctly exposing the GPU.

Host-level NVIDIA configuration is managed by the Ansible `nvidia-gpu` role.

```text
Ansible
   │
   ├── NVIDIA driver
   ├── DKMS
   └── Host GPU configuration
            │
            ▼
        Kubernetes
            │
      NVIDIA device plugin
            │
            ▼
         Jellyfin
```

A rebuilt GPU node therefore requires both the host-level Ansible configuration and the Kubernetes-level GPU integration before GPU workloads can be scheduled successfully.

## Special Networking

Most workloads use normal Kubernetes networking through Services.

A small number of workloads use `hostNetwork: true` where host-level network access is required for functionality that does not work reliably through the normal pod network.

### UniFi Network Application

The UniFi controller requires host-level network reachability for device adoption and management.

The workload therefore uses `hostNetwork` and is scheduled to `tank` to provide a predictable network endpoint for the infrastructure it manages.

### Home Assistant

Home Assistant also uses `hostNetwork` because local device discovery protocols such as mDNS and SSDP do not reliably cross the Kubernetes pod network.

It is similarly scheduled to `tank`.

These are intentional exceptions rather than the default networking model for workloads.

If the node identity or scheduling requirements change, the corresponding `nodeSelector` configuration must be updated as part of the same Git change.

## Secrets

Secrets are never committed to Git as plaintext Kubernetes `Secret` resources.

Sensitive values are encrypted using [Bitnami Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) and only the resulting `SealedSecret` resources are stored in the repository.

This allows the repository to remain public without exposing the underlying secret values.

Generate a sealed secret with:

```bash
kubectl create secret generic <name> \
  --namespace <namespace> \
  --dry-run=client \
  --from-literal=KEY='value' \
  -o yaml | kubeseal --format yaml > sealed-secret.yaml
```

### Cluster rebuilds

Sealed Secrets are encrypted against the certificate and key material of the Sealed Secrets controller.

A completely new controller with different keys cannot decrypt existing sealed secrets.

Therefore, a full cluster rebuild requires the original Sealed Secrets key material to be restored, or affected secrets to be regenerated against the new controller.

This makes the Sealed Secrets controller keys part of the cluster's disaster-recovery considerations.

## Remote and Public Access

The cluster uses separate mechanisms for private remote access and selected public services.

### Tailscale

A Tailscale subnet router running on `nuke` advertises the homelab LAN to the tailnet.

This allows authorized tailnet devices to reach services using their normal internal network addresses without requiring a separate public endpoint for each application.

### Cloudflare Tunnel

Selected applications are exposed through Cloudflare Tunnel.

The tunnel configuration is used only for services intended to be reachable externally. Applications that do not require public access remain accessible through the LAN or Tailscale.

Public routing is managed through Cloudflare rather than exposing individual workloads directly through public node ports.

## CI Validation

Kubernetes configuration is validated automatically through GitHub Actions.

The current validation pipeline includes:

### yamllint

Checks YAML formatting and common YAML errors.

### kubeconform

Validates manifests against Kubernetes resource schemas before they reach the cluster.

### gitleaks

Scans repository changes for patterns that may indicate accidentally committed secrets.

The purpose of CI is to catch configuration and security issues before ArgoCD attempts to reconcile them.

```text
Pull Request / Push
        │
        ▼
GitHub Actions
        │
   ┌────┼─────────┐
   │    │         │
YAML  Kubernetes  Secrets
lint  validation  scanning
   │    │         │
   └────┼─────────┘
        ▼
   Git repository
        │
        ▼
      ArgoCD
```

## Adding a New Workload

A new workload should follow the existing namespace-oriented structure.

### 1. Create the namespace directory

```text
apps/<namespace>/
```

### 2. Define the namespace

Add a `namespace.yaml` where the namespace is not already managed elsewhere.

### 3. Define the workload

Add the required Kubernetes resources, typically:

* Deployment or StatefulSet
* Service
* PersistentVolumeClaim
* ConfigMap
* SealedSecret

Only add resources that are actually required by the workload.

### 4. Register the namespace with ArgoCD

Create the corresponding ArgoCD Application and point it at the new directory.

Automated synchronization should remain enabled so the namespace follows the repository's GitOps workflow.

### 5. Add the application to the dashboard

If the service should appear on the Homepage dashboard, add it to:

```text
default/homepage/configmap.yaml
```

### 6. Validate before merging

Run the same validation locally where possible and verify the GitHub Actions checks before merging.

After the change reaches Git, ArgoCD should reconcile the new desired state automatically.

## Operational Workflow

The intended operational workflow is:

```text
Change required
      │
      ▼
Modify Git configuration
      │
      ▼
Validate
      │
      ▼
Commit / Pull Request
      │
      ▼
GitHub Actions
      │
      ▼
Merge
      │
      ▼
ArgoCD
      │
      ▼
Kubernetes reconciliation
      │
      ▼
Running workload
```

Direct changes with `kubectl` should be treated as operational intervention rather than the normal deployment workflow.

If a live change is required for troubleshooting or incident response, the resulting desired state should be reconciled back into Git afterwards.

## Troubleshooting

Troubleshooting follows the same layered model as the architecture.

```text
Git
 │
 ├── Is the desired configuration correct?
 │
 ▼
ArgoCD
 │
 ├── Synced?
 ├── Healthy?
 └── Sync errors?
 │
 ▼
Kubernetes
 │
 ├── Pods
 ├── Events
 ├── Services
 ├── PVCs
 └── Network configuration
 │
 ▼
Node
 │
 ├── CPU / memory
 ├── storage
 ├── GPU
 └── host configuration
```

Useful starting points:

```bash
kubectl get nodes
kubectl get pods -A
kubectl get events -A --sort-by=.lastTimestamp
```

Host-level issues should be investigated through the node configuration and Ansible layer rather than compensating for them with application-specific Kubernetes changes.

## Relationship to the Rest of HomeOps

The Kubernetes workloads are one layer of the larger HomeOps infrastructure:

```text
┌───────────────────────────────────────────┐
│                 Network                   │
│        OPNsense / VLANs / Firewall        │
└─────────────────────┬─────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│                  Hosts                    │
│             Ansible / Linux               │
└─────────────────────┬─────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│                Kubernetes                 │
│          kubeadm / container runtime      │
└─────────────────────┬─────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│                  ArgoCD                   │
│              GitOps reconciliation        │
└─────────────────────┬─────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│                  apps/                    │
│          Kubernetes workloads             │
└───────────────────────────────────────────┘
```

The separation is intentional:

* **Network** manages connectivity and trust boundaries.
* **Ansible** manages the hosts.
* **Kubernetes** manages the cluster.
* **ArgoCD** manages reconciliation.
* **`apps/`** defines the workloads.
* **Backups** protect persistent data and recovery-critical state.

This keeps each layer independently understandable and reduces the amount of infrastructure that depends on undocumented manual configuration.

## Known Issues

The homelab is an active environment and some known issues are intentionally documented here rather than hidden.

### Kubernetes APT repository

The Debian Trixie Kubernetes APT repository currently requires a GPG-signing workaround with an expiration date of `2027-02-01`.

This should be revisited before the workaround expires.

### Gluetun / qBittorrent tracker resolution

Some torrent trackers occasionally experience DNS or connectivity failures from within the Gluetun/qBittorrent workload.

The underlying cause is not yet fully confirmed and remains under investigation.
