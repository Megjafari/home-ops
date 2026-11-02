# ArgoCD

The ArgoCD `Application` definitions for this cluster. Until now they only
existed inside the cluster; these files are an export of what was running
(status and runtime metadata removed) so the setup can be rebuilt from Git.

```text
argocd/
├── root.yaml          # app-of-apps: watches argocd/applications/
└── applications/      # one Application per directory in apps/
```

Each Application syncs `apps/<name>` into the namespace of the same name
(`default` syncs `apps/default` recursively). All use automated sync with
`prune: false` and `selfHeal: false`, exactly as they were running.

## One-time adoption

Applying the root Application makes ArgoCD manage the Application resources
themselves from Git. Nothing in the workloads changes, because the manifests
match what is already running.

```bash
kubectl apply -f argocd/root.yaml
```

From then on, adding a file to `argocd/applications/` creates a new
Application, and editing one updates it.

## Rebuilding the cluster

1. Bootstrap the cluster (Ansible, then `kubeadm`).
2. Install ArgoCD and the Sealed Secrets controller.
3. Restore the Sealed Secrets key (see [`docs/backup.md`](../docs/backup.md)).
4. `kubectl apply -f argocd/root.yaml`

## Not in Git yet

The NFS provisioner, Flannel, metrics-server and the NVIDIA device plugin are
Applications here, without automated sync. ArgoCD itself, Sealed Secrets and
Reloader were installed by hand; see
[`docs/cluster-components.md`](../docs/cluster-components.md).
