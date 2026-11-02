# Cluster components

Everything the workloads in `apps/` depend on, with the versions that were
running on 2026-11-01 and how each one is (re)installed.

| Component | Namespace | Version | Described in Git as |
|---|---|---|---|
| NFS subdir provisioner | `default` | chart 4.0.18 (app 4.0.2) | `argocd/applications/nfs-provisioner.yaml` |
| Flannel | `kube-flannel` | v0.28.9 | `argocd/applications/flannel.yaml` |
| metrics-server | `kube-system` | v0.9.0 | `argocd/applications/metrics-server.yaml` |
| NVIDIA device plugin | `kube-system` | v0.20.0 | `argocd/applications/nvidia-device-plugin.yaml` |
| ArgoCD | `argocd` | v3.5.2 | install command below |
| Sealed Secrets controller | `kube-system` | 0.39.1 | install command below |
| Reloader | `default` | v1.4.14 (chart 2.2.9) | install command below, best guess |

## Applications with manual sync

The four Applications above have no automated sync on purpose, because they
adopt components that were installed by hand. After `root` creates them, open
each in ArgoCD, check the diff is empty or harmless, and sync it once. Nothing
changes in the cluster until then.

What each one reproduces from the running cluster:

- **NFS provisioner**: values from `helm get values`; server `192.168.1.9`,
  path `/mnt/storage/k8s-data`, default StorageClass `nfs-storage`.
- **Flannel**: the upstream manifest at the tag. The running config is the
  default (`10.244.0.0/16`, vxlan), matching `--cluster-cidr`.
- **metrics-server**: upstream `manifests/base` plus `--kubelet-insecure-tls`,
  the only flag that differs from the upstream arguments.
- **NVIDIA device plugin**: the upstream static manifest at the tag. The
  running DaemonSet has no extra arguments.

## Installed with a command

ArgoCD, Sealed Secrets and Reloader are not managed by ArgoCD. The live
ConfigMaps of ArgoCD are stock, so a plain install reproduces it.

```bash
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.5.2/manifests/install.yaml
```

```bash
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.39.1/controller.yaml
```

Reloader has no live Helm release, so how it was installed is a guess. The
chart that carries v1.4.14 is 2.2.9:

```bash
helm repo add stakater https://stakater.github.io/stakater-charts
helm install reloader stakater/reloader --version 2.2.9 -n default
```

Check `kubectl get deploy reloader-reloader -n default` first; if it still
exists, do not reinstall over it.

## Rebuild order

1. Hosts: Ansible, then `kubeadm init` / `join` (see `ansible/README.md`).
2. Flannel (apply the same manifest the Application points at).
3. ArgoCD, then the Sealed Secrets controller.
4. Restore the Sealed Secrets key ([`backup.md`](backup.md)).
5. `kubectl apply -f argocd/root.yaml`, then sync the four manual
   Applications once.
6. Reloader.
