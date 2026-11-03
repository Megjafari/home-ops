# Proxied records must carry ttl = 1 (automatic). The rest of the zone uses
# automatic TTL too, so every record here does.
#
# blog.meghdadjafari.dev is deliberately absent. It is created and owned by the
# tunnel's Public Hostname setting in Cloudflare Zero Trust (the dashboard shows
# its type as "Tunnel"), so managing it here would fight the tunnel.
#
# TXT content carries its own escaped quotes: the API returns TXT values quoted,
# and a bare value would plan as a change on every run.

locals {
  # Apps hosted on Vercel; Vercel needs the records unproxied.
  vercel_apps = {
    kaizen    = "113eb0af958da384.vercel-dns-017.com"
    liahub    = "dcb93273b3c86872.vercel-dns-017.com"
    megflix   = "4a6b13f8030056d8.vercel-dns-017.com"
    shiptrack = "15aa981516bbd8dd.vercel-dns-017.com"
  }

  # Namecheap email forwarding: hostname => priority.
  mx_records = {
    "eforward1.registrar-servers.com" = 10
    "eforward2.registrar-servers.com" = 10
    "eforward3.registrar-servers.com" = 10
    "eforward4.registrar-servers.com" = 15
    "eforward5.registrar-servers.com" = 20
  }
}

# --- Apex and www ---------------------------------------------------------

resource "cloudflare_dns_record" "apex" {
  zone_id = data.cloudflare_zone.this.zone_id
  name    = var.zone_name
  type    = "A"
  content = "216.198.79.1"
  proxied = true
  ttl     = 1
}

# The portfolio's primary domain on Vercel. Vercel redirects the apex to www
# (HTTP 308), so www must be the one that serves the site. Pointing it at the
# apex would loop. Vercel asks for an unproxied CNAME to its own target.
resource "cloudflare_dns_record" "www" {
  zone_id = data.cloudflare_zone.this.zone_id
  name    = "www.${var.zone_name}"
  type    = "CNAME"
  content = "43d7f6beab1c7e48.vercel-dns-017.com"
  proxied = false
  ttl     = 1
}

# --- Apps on Vercel -------------------------------------------------------

resource "cloudflare_dns_record" "vercel" {
  for_each = local.vercel_apps

  zone_id = data.cloudflare_zone.this.zone_id
  name    = "${each.key}.${var.zone_name}"
  type    = "CNAME"
  content = each.value
  proxied = false
  ttl     = 1
}

# --- Email ----------------------------------------------------------------

resource "cloudflare_dns_record" "mx" {
  for_each = local.mx_records

  zone_id  = data.cloudflare_zone.this.zone_id
  name     = var.zone_name
  type     = "MX"
  content  = each.key
  priority = each.value
  ttl      = 1
}

resource "cloudflare_dns_record" "dmarc" {
  zone_id = data.cloudflare_zone.this.zone_id
  name    = "_dmarc.${var.zone_name}"
  type    = "TXT"
  content = "\"v=DMARC1; p=none;\""
  ttl     = 1
}
