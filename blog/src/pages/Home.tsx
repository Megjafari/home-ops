import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicFetch } from "../lib/api";
import PostRow from "../components/PostRow";
import type { PostListItem } from "../lib/types";

const running = [
  {
    title: "Kubernetes",
    text: "A self-hosted cluster managed with GitOps and Argo CD.",
  },
  {
    title: "Proxmox",
    text: "Virtual machines and containers for everything else, including this blog.",
  },
  {
    title: "Networking",
    text: "VLANs, Tailscale for private access and Cloudflare Tunnel for what is public.",
  },
  {
    title: "Storage",
    text: "Persistent volumes over NFS.",
  },
];

export default function Home() {
  const [posts, setPosts] = useState<PostListItem[]>([]);

  useEffect(() => {
    publicFetch("/api/posts?pageSize=3")
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(55%_70%_at_50%_0%,rgba(138,164,255,0.10),transparent)]"
      />

      <div className="relative mx-auto max-w-3xl px-6 pt-20 sm:pt-28">
        <p className="eyebrow mb-6">Homelab journal</p>
        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          Real infrastructure.
          <br />
          Real configs.
          <br />
          <span className="text-fg-muted">Real failures.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-fg-muted">
          Notes from the Kubernetes cluster and self-hosted services I run at home. Every configuration
          shown here is the one actually running, including what broke along the way.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/blog" className="btn btn-primary">
            Read the journal →
          </Link>
          <Link to="/about" className="btn">
            About the lab
          </Link>
        </div>

        <div className="mt-20 rounded-xl border border-line bg-surface/60 p-6 sm:p-7">
          <p className="eyebrow mb-3">Who's writing</p>
          <p className="leading-relaxed text-fg/90">
            I'm Meghdad, a backend developer in Gothenburg. I build with C# and .NET, and I run a homelab
            to learn how production infrastructure really behaves. This journal is where I write it down.
          </p>
          <p className="mt-4 text-sm">
            <Link to="/about" className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
              More about me
            </Link>
            <span className="mx-2 text-fg-muted">·</span>
            <a
              href="https://meghdadjafari.dev"
              className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
            >
              Portfolio ↗
            </a>
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-24 max-w-3xl px-6">
        <h2 className="eyebrow mb-5">What's running</h2>
        <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {running.map((item) => (
            <li key={item.title} className="bg-bg p-5">
              <p className="font-semibold tracking-tight">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {posts.length > 0 && (
        <section aria-labelledby="latest" className="relative mx-auto mt-24 max-w-3xl px-6">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 id="latest" className="eyebrow">
              Latest posts
            </h2>
            <Link to="/blog" className="text-sm text-fg-muted transition-colors hover:text-fg">
              All posts →
            </Link>
          </div>
          <div>
            {posts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
