# The records already exist in Cloudflare. These import blocks tell Terraform to
# adopt them instead of creating them again. The ID of a record is
# "<zone id>/<record id>". The IDs are identifiers, not secrets. Once the first
# apply has written the state, this file can be deleted.

import {
  to = cloudflare_dns_record.apex
  id = "880cec61cc399b1a46186f08abcf1f73/669389d0f33b5fd6b6d9d70b6295f827"
}

import {
  to = cloudflare_dns_record.www
  id = "880cec61cc399b1a46186f08abcf1f73/6faca5036682233853f06e5a59758ab0"
}

import {
  to = cloudflare_dns_record.vercel["kaizen"]
  id = "880cec61cc399b1a46186f08abcf1f73/8c0c0f72b0c88da1801698a38138905b"
}

import {
  to = cloudflare_dns_record.vercel["liahub"]
  id = "880cec61cc399b1a46186f08abcf1f73/cdda23a7b92fdd1e9e4f4f54f830014b"
}

import {
  to = cloudflare_dns_record.vercel["megflix"]
  id = "880cec61cc399b1a46186f08abcf1f73/18df535bb2e90fee2fdfa1a006d824b2"
}

import {
  to = cloudflare_dns_record.vercel["shiptrack"]
  id = "880cec61cc399b1a46186f08abcf1f73/297eca8b0b365a0ea13a2f724ee58d40"
}

import {
  to = cloudflare_dns_record.mx["eforward1.registrar-servers.com"]
  id = "880cec61cc399b1a46186f08abcf1f73/98d97ea664bc5bcdbb67c7a8c11c71a1"
}

import {
  to = cloudflare_dns_record.mx["eforward2.registrar-servers.com"]
  id = "880cec61cc399b1a46186f08abcf1f73/a37e422864064c512c081944081df797"
}

import {
  to = cloudflare_dns_record.mx["eforward3.registrar-servers.com"]
  id = "880cec61cc399b1a46186f08abcf1f73/eb5e013c432756e600965dfc83efcc58"
}

import {
  to = cloudflare_dns_record.mx["eforward4.registrar-servers.com"]
  id = "880cec61cc399b1a46186f08abcf1f73/39cbf51d801e9559809a4aa1bc6da987"
}

import {
  to = cloudflare_dns_record.mx["eforward5.registrar-servers.com"]
  id = "880cec61cc399b1a46186f08abcf1f73/af6daab4ff9a68d8581542d021c6cee4"
}

import {
  to = cloudflare_dns_record.dmarc
  id = "880cec61cc399b1a46186f08abcf1f73/81599f923f179312cd22f876a8afeed5"
}
