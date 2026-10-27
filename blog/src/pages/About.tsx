const links = [
  { label: "Portfolio", href: "https://meghdadjafari.dev" },
  { label: "GitHub", href: "https://github.com/Megjafari" },
  { label: "home-ops (my cluster config)", href: "https://github.com/Megjafari/home-ops" },
  { label: "LinkedIn", href: "https://linkedin.com/in/meghdad-jafari" },
];

const homelab = [
  "Kubernetes with GitOps (Argo CD)",
  "containerd, Linux and NFS storage",
  "Networking with VLANs",
  "GPU-enabled workloads",
];

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-6">About</h1>

      <div className="text-zinc-300 leading-relaxed flex flex-col gap-4">
        <p>
          I'm Meghdad, a fullstack developer with a backend focus in C# and .NET,
          currently studying Backend Development with a specialization in Cloud.
          I build with ASP.NET Core, React and PostgreSQL, and I like working
          across the whole path from code and databases to deployment.
        </p>
        <p>
          This is where I document my homelab: a self-hosted Kubernetes cluster,
          networking setup, and the services I run day to day. The configurations
          shown here are the actual ones running in my cluster, not simplified
          examples. When something breaks, that's in here too.
        </p>
        <p>
          The blog itself is part of the lab: an ASP.NET Core API and a React
          frontend, running in the same cluster.
        </p>
      </div>

      <h2 className="text-sm font-mono uppercase tracking-wide text-zinc-500 mt-12 mb-4">
        The lab
      </h2>
      <ul className="text-zinc-300 flex flex-col gap-2">
        {homelab.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="text-sm font-mono uppercase tracking-wide text-zinc-500 mt-12 mb-4">
        Elsewhere
      </h2>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline"
            >
              {link.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
