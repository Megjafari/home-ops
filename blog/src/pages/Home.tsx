import { Link } from "react-router-dom";
import { listPosts } from "../lib/content";
import PostRow from "../components/PostRow";
import { PORTFOLIO_URL } from "../components/Nav";

export default function Home() {
  const posts = listPosts().slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 sm:pt-36">
      <h1 className="text-[clamp(64px,15vw,150px)] leading-[0.92] font-light tracking-[-0.055em]">Blog</h1>
      <p className="mt-9 max-w-xl text-lg leading-relaxed text-fg-muted">
        Notes from the Kubernetes cluster and self-hosted services I run at home. Every configuration shown
        here is the one actually running, including what broke along the way.
      </p>

      {posts.length > 0 && (
        <section aria-labelledby="latest" className="mt-20">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 id="latest" className="eyebrow">
              Latest
            </h2>
            <Link to="/blog" className="text-sm text-fg-muted transition-colors hover:text-fg">
              All posts →
            </Link>
          </div>
          <div className="post-list">
            {posts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-16 max-w-xl text-fg-muted">
        I'm Meghdad, a fullstack developer in Gothenburg.{" "}
        <a
          href={`${PORTFOLIO_URL}/#about`}
          className="text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
        >
          More about me ↗
        </a>
      </p>
    </div>
  );
}
