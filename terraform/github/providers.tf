# The token is read from the GITHUB_TOKEN environment variable, never from a file.
provider "github" {
  owner = var.github_owner
}
