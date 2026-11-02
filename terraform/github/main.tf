# The repository already exists. These import blocks tell Terraform to adopt it
# instead of trying to create it. They can be removed once the first apply has
# written the state.
import {
  to = github_repository.homelab
  id = var.repository_name
}

import {
  to = github_branch_protection.main
  id = "${var.repository_name}:main"
}

resource "github_repository" "homelab" {
  name        = var.repository_name
  description = "A self-hosted Kubernetes homelab focused on GitOps, automation, cloud-native infrastructure, and reproducible operations."
  visibility  = "public"

  topics = [
    "ansible",
    "argocd",
    "cloud-native",
    "devops",
    "gitops",
    "infrastructure-as-code",
    "k8s",
    "kubernetes",
    "linux",
    "self-hosted",
  ]

  has_issues      = true
  has_projects    = true
  has_wiki        = false
  has_discussions = false

  allow_merge_commit = true
  allow_squash_merge = true
  allow_rebase_merge = true
  allow_auto_merge   = false

  # Deletes a branch once its pull request is merged, which avoids pushing to a
  # branch that is already merged.
  delete_branch_on_merge = true

  # Free for public repositories. Secret scanning reports a leaked token or key
  # after the fact; push protection refuses the push before it reaches the repo.
  security_and_analysis {
    secret_scanning {
      status = "enabled"
    }
    secret_scanning_push_protection {
      status = "enabled"
    }
  }
}

# Dependabot alerts: GitHub warns about known vulnerabilities in dependencies,
# for example the npm packages of the blog. This is its own resource because the
# argument on github_repository is deprecated.
resource "github_repository_vulnerability_alerts" "homelab" {
  repository = github_repository.homelab.name
  enabled    = true
}

resource "github_branch_protection" "main" {
  repository_id = github_repository.homelab.node_id
  pattern       = "main"

  enforce_admins      = true
  allows_deletions    = false
  allows_force_pushes = false

  required_status_checks {
    strict   = false
    contexts = var.required_checks
  }
}
