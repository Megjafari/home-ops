#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VENV_DIR="${VENV_DIR:-.ansible-venv}"
PLAYBOOK="${PLAYBOOK:-site.yml}"
INVENTORY="${INVENTORY:-inventory.yml}"

if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtualenv at $VENV_DIR..."
    python3 -m venv "$VENV_DIR"
fi

# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

pip install --quiet --upgrade pip
pip install --quiet ansible

if [ -f requirements.yml ]; then
    ansible-galaxy collection install -r requirements.yml
fi

echo "Running: ansible-playbook -i $INVENTORY $PLAYBOOK $*"
ansible-playbook -i "$INVENTORY" "$PLAYBOOK" "$@"