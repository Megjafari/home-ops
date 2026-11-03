# Terraform: Cloudflare, meghdadjafari.dev

The DNS records of the `meghdadjafari.dev` zone as code. One Terraform root per
zone, so a mistake in one zone cannot touch another.

```text
terraform/cloudflare/meghdadjafari-dev/
├── version.tf     # Terraform and provider versions
├── providers.tf   # The Cloudflare provider (token from the environment)
├── variables.tf   # The zone name
├── main.tf        # Looks the zone up by name
├── dns.tf         # The records
└── outputs.tf
```

## What it manages, and what it does not

Managed: the apex A record, `www`, the four apps on Vercel, the Namecheap
email-forwarding MX records and the DMARC record.

Not managed:

- `blog.meghdadjafari.dev`. It is created by the tunnel's Public Hostname
  setting (the dashboard shows its type as "Tunnel"), so Terraform would fight
  the tunnel.
- The records that point at a tunnel, other than `blog`. They are left out on
  purpose.
- The zone's NS and SOA records, which Cloudflare owns.

## How the records got here

The records existed before the code did. They were adopted with `import` blocks,
using the record IDs from the Cloudflare API, and the first plan showed no
changes. A record added by hand in the dashboard now shows up as drift in
`terraform plan`.

## Run it

1. Create an API token at Cloudflare, My Profile, API Tokens, with
   **Zone: Zone: Read** and **Zone: DNS: Edit**, limited to this zone.
2. Export it (never write it into a file):

   ```bash
   export CLOUDFLARE_API_TOKEN=<token>
   ```

3. From this directory:

   ```bash
   terraform init
   terraform plan
   ```

   With nothing changed, the plan says `No changes`. If it shows a change, read
   it: either the code differs from the live record, or the record was edited
   in the dashboard.

4. `terraform apply` to make the live zone match the code.

## Things to try

- `www` still points at the registrar's parking page. Point it at the apex or
  redirect it, run `plan`, and read the diff before applying.
- Add an SPF record: the zone has DMARC but no SPF.
