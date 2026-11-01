#!/bin/bash
# Export the Sealed Secrets private key(s) from the cluster to an encrypted file.
# Without this key the SealedSecrets in Git cannot be decrypted after a rebuild.
#
# Usage: scripts/backup-sealed-secrets-key.sh <kube-context> [output-file]
set -euo pipefail

CONTEXT="${1:-}"
OUT="${2:-sealed-secrets-key-$(date +%Y%m%d).yaml.enc}"

if [ -z "$CONTEXT" ]; then
    echo "Usage: $0 <kube-context> [output-file]" >&2
    echo "Available contexts:" >&2
    kubectl config get-contexts -o name >&2
    exit 1
fi

read -r -p "Export Sealed Secrets key from context '$CONTEXT'? [y/N] " answer
[ "$answer" = "y" ] || { echo "Aborted."; exit 1; }

umask 077
kubectl --context "$CONTEXT" -n kube-system get secret \
    -l sealedsecrets.bitnami.com/sealed-secrets-key \
    -o yaml \
  | openssl enc -aes-256-cbc -pbkdf2 -salt -out "$OUT"

echo "Wrote $OUT (encrypted). Store it outside the cluster and outside this repo."
echo "Decrypt with: openssl enc -d -aes-256-cbc -pbkdf2 -in $OUT -out sealed-secrets-key.yaml"
