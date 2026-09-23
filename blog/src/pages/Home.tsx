import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicFetch } from "../lib/api";
import type { PostListItem } from "../lib/types";

export default function Home() {
  const [posts, setPosts] = useState<PostListItem[]>([]);

  useEffect(() => {
    publicFetch("/api/posts?pageSize=3")
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-semibold mb-4">Homelab Journal</h1>
      <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
        Notes on running a self-hosted Kubernetes cluster, networking, and the
        services I operate at home. The configurations shown here are the
        actual ones running in my cluster.
      </p>

      {posts.length > 0 && (
        <>
          <h2 className="text-sm font-mono uppercase tracking-wide text-zinc-500 mb-4">
            Latest posts
          </h2>
          <div className="flex flex-col gap-6 mb-8">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-zinc-400 text-sm mt-1">{post.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </>
      )}

      <Link to="/blog" className="text-cyan-400 underline text-sm">
        View all posts →
      </Link>
    </div>
  );
}