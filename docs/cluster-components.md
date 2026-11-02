# Cluster components

Everything the workloads in `apps/` depend on, with the versions that were
running on 2026-11-01. Only the NFS provisioner is described as an ArgoCD
Application so far (`argocd/applications/nfs-provisioner.yaml`). The rest were
installed by hand and are listed here so a rebuild does not depend on memory.

| Component | Namespace | Version | Installed with | In Git |
|---|---|---|---|---|
| NFS subdir provisioner | `default` | chart 4.0.18 (app 4.0.2) | Helm release `nfs-provisioner` | `argocd/applications/nfs-provisioner.yaml` |
| Reloader | `default` | v1.4.14 | not a live Helm release | docs only |
| ArgoCD | `argocd` | v3.5.2 | upstream manifest (assumed) | docs only |
| Sealed Secrets controller | `kube-system` | 0.39.1 | upstream manifest (assumed) | docs only |
| metrics-server | `kube-system` | v0.9.0 | upstream manifest (assumed) | docs only |
| Flannel | `kube-flannel` | v0.28.9 | upstream manifest (assumed) | docs only |
| NVIDIA device plugin | `kube-system` | v0.20.0 | upstream manifest (assumed) | docs only |

"Assumed" means no Helm release exists for it and the objects carry no
`managed-by` label, so it was applied from a plain manifest. The exact flags
that were used are not recorded here.

## NFS storage

`tank` exports `/mnt/storage/k8s-data` over NFS. The provisioner creates the
`nfs-storage` StorageClass (default class, `archiveOnDelete: "true"`) which
every PVC in `apps/` uses. The values live in the Application above.

Adopting the existing Helm release: the Application has no automated sync.
Open it in ArgoCD, check that the diff is empty or harmless, then sync it once.

## Rebuild order

1. Hosts: Ansible, then `kubeadm init` / `join` (see `ansible/README.md`).
2. CNI: Flannel.
3. ArgoCD, then the Sealed Secrets controller.
4. Restore the Sealed Secrets key ([`backup.md`](backup.md)).
5. `kubectl apply -f argocd/root.yaml`. This recreates every Application,
   including the NFS provisioner, which must be synced by hand the first time.
6. metrics-server, NVIDIA device plugin and Reloader.

## Still to do

Describe the hand-installed components as ArgoCD Applications pointing at their
upstream repositories at the pinned tag. That needs the arguments the live
objects were started with (for example metrics-server flags) so the result
matches what is running.
