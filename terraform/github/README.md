# Terraform: GitHub

Describes this repository's settings and the protection of `main` as code. It is
the first Terraform root; Proxmox and Cloudflare are planned.

```text
terraform/github/
├── version.tf     # Terraform and provider versions
├── providers.tf   # The GitHub provider (token from the environment)
├── variables.tf   # Owner, repository name, required CI checks
├── main.tf        # The repository and the branch protection on main
└── outputs.tf
```

## What it manages

- Repository settings: description, topics, merge options, issues and wiki,
  deleting merged branches, and the security features (Dependabot alerts,
  secret scanning and push protection).
- Branch protection on `main`: the CI jobs that must pass, no force pushes, no
  deletion, and the rules apply to administrators too.

## Run it

Plans and applies run from your own machine. CI only checks formatting and
validity, because giving CI a token that can change repository settings would
be the larger risk.

1. Create a fine-grained token at GitHub, Settings, Developer settings, with
   access to this repository only and the permissions **Administration:
   read and write** and **Metadata: read**.
2. Export it (never write it into a file):

   ```bash
   export GITHUB_TOKEN=<token>
   ```

3. From this directory:

   ```bash
   terraform init
   terraform plan
   ```

   The first plan shows the repository and the branch protection as
   **imported**. Read it before applying. A small difference between the code
   and the live settings is normal on the first import; adjust `main.tf` until
   the plan shows no changes, then apply:

   ```bash
   terraform apply
   ```

4. Commit `.terraform.lock.hcl` after the first `init`. It pins the exact
   provider build.

## State

State is kept in a local `terraform.tfstate`, which is git-ignored. Nothing in
it is a secret, and it can be recreated by running the imports again, so
losing it is not a disaster. Move it to a remote backend when more roots exist.

## Things to try

- Set `required_linear_history = true` on the branch protection, run `plan`, read
  the diff, and decide whether you want it before applying.
