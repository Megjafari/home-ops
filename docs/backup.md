# Backup and recovery

Almost everything in the cluster is rebuilt from Git by ArgoCD. The one thing
Git cannot restore is the **Sealed Secrets private key**. Every
`sealed-secret.yaml` in `apps/` is encrypted to it; if the key is lost, none of
them can be decrypted and each secret has to be re-created and re-sealed.

RAID1 on `tank` protects against a single disk failing. It does not protect
against `tank` being lost, so the key must also be stored somewhere else.

## Back up the key

Run from a machine with `kubectl` access to the homelab cluster:

```bash
scripts/backup-sealed-secrets-key.sh <kube-context>
```

The script asks for confirmation, then writes an AES-256 encrypted file. Choose
a passphrase and keep it in a password manager.

Store the resulting `.enc` file in at least two places outside the cluster,
for example an encrypted USB stick and a private cloud drive. Never commit it;
`.gitignore` blocks the usual names.

The controller adds a new key every 30 days by default (old keys stay valid).
A backup only contains the keys that existed when it was taken, so repeat the
backup at least monthly and whenever you seal a new secret.

## Restore the key

On a rebuilt cluster, before ArgoCD syncs the apps:

```bash
openssl enc -d -aes-256-cbc -pbkdf2 -in sealed-secrets-key-YYYYMMDD.yaml.enc -out sealed-secrets-key.yaml
kubectl apply -f sealed-secrets-key.yaml
kubectl -n kube-system rollout restart deployment sealed-secrets-controller
shred -u sealed-secrets-key.yaml 2>/dev/null || rm -P sealed-secrets-key.yaml
```

Check the deployment name first with `kubectl -n kube-system get deploy`.
The existing SealedSecrets then decrypt without being re-sealed.

## What is not backed up

Application data on the `nfs-storage` PVCs (Vaultwarden, Nextcloud, Immich,
Home Assistant and so on) has no off-host backup yet. Add one before storing
anything you care about in those apps.
