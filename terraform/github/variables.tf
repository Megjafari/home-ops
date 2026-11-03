variable "github_owner" {
  description = "GitHub user or organisation that owns the repository"
  type        = string
  default     = "Megjafari"
}

variable "repository_name" {
  description = "Name of the repository managed by this configuration"
  type        = string
  default     = "homelab"
}

variable "required_checks" {
  description = "CI jobs that must pass before anything is merged to main. These are job names from .github/workflows/validate.yml and terraform.yml."
  type        = list(string)
  default = [
    "ansible-lint",
    "kube-linter",
    "kubeconform",
    "secret-scan",
    "terraform",
    "yaml-lint",
  ]
}
