const links = [
  { label: "Portfolio", href: "https://meghdadjafari.dev" },
  { label: "GitHub", href: "https://github.com/Megjafari" },
  { label: "home-ops (my cluster config)", href: "https://github.com/Megjafari/home-ops" },
  { label: "LinkedIn", href: "https://linkedin.com/in/meghdad-jafari" },
];

const homelab = [
  "Kubernetes with GitOps (Argo CD)",
  "Proxmox for virtual machines and containers",
  "containerd, Linux and NFS storage",
  "Networking with VLANs, Tailscale and Cloudflare Tunnel",
  "GPU-enabled workloads",
];

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-16">
      <p className="eyebrow mb-4">About</p>
      <h1 className="mb-8 text-4xl font-semibold tracking-tight">About the lab</h1>

      <div className="flex flex-col gap-5 text-[1.0625rem] leading-[1.75] text-fg/90">
        <p>
          I'm Meghdad, a fullstack developer with a backend focus in C# and .NET, currently studying
          Backend Development with a specialization in Cloud. I build with ASP.NET Core, React and
          PostgreSQL, and I like working across the whole path from code and databases to deployment.
        </p>
        <p>
          This is where I document my homelab: a self-hosted Kubernetes cluster, networking setup, and
          the services I run day to day. The configurations shown here are the actual ones running in my
          lab, not simplified examples. When something breaks, that's in here too.
        </p>
        <p>
          The blog itself is part of the lab: an ASP.NET Core API and a React frontend, deployed with
          Coolify on my Proxmox host, with PostgreSQL in its own LXC container and published through a
          Cloudflare Tunnel.
        </p>
      </div>

      <h2 className="eyebrow mt-14 mb-4">The lab</h2>
      <ul className="flex flex-col gap-2.5 text-fg/90">
        {homelab.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-fg-muted" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <h2 className="eyebrow mt-14 mb-4">Elsewhere</h2>
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer" className="btn">
              {link.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
