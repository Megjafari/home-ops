# The zone is looked up by name, so no zone or account ID is stored in the code.
data "cloudflare_zone" "this" {
  filter = {
    name = var.zone_name
  }
}
