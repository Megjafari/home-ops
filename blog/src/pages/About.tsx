import { PORTFOLIO_URL } from "../components/Nav";

const links = [
  { label: "Portfolio", href: PORTFOLIO_URL },
  { label: "GitHub", href: "https://github.com/Megjafari" },
  { label: "The homelab repository", href: "https://github.com/Megjafari/homelab" },
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
    <div className="mx-auto max-w-3xl px-6 pt-28 sm:pt-36">
      <h1 className="text-[clamp(52px,12vw,120px)] leading-[0.94] font-light tracking-[-0.055em]">About</h1>

      <div className="mt-10 flex flex-col gap-5 text-[1.0625rem] leading-[1.75] text-fg/90">
        <p>
          I'm Meghdad, a fullstack developer in Gothenburg with a backend focus in C# and .NET. This is where I
          write down what I build, learn and break.
        </p>
        <p>
          Much of it comes from my homelab: a self-hosted Kubernetes cluster, the networking around it and the
          services I run day to day. The configurations I show are the ones actually running, and when
          something breaks, that is in here too.
        </p>
        <p>
          The blog is part of the lab. It is a static site built from Markdown files in the homelab
          repository, served by nginx, deployed with Coolify on my Proxmox host and published through a
          Cloudflare Tunnel.
        </p>
      </div>

      <h2 className="eyebrow mt-14 mb-4">The homelab</h2>
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
