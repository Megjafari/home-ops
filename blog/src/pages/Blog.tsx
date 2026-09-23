import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicFetch } from "../lib/api";
import { estimateReadingStats } from "../lib/readingTime";
import type { PostListItem } from "../lib/types";

export default function Blog() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicFetch("/api/posts")
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-16 text-zinc-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">Homelab Journal</h1>
      <p className="text-zinc-400 mb-12">Notes on running Kubernetes, networking, and self-hosting at home.</p>

      <div className="flex flex-col gap-10">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="group">
            <h2 className="text-xl font-semibold group-hover:text-cyan-400 transition-colors">
              {post.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-zinc-500 font-mono mt-1 mb-2">
              {post.publishedAt && (
                <span>{new Date(post.publishedAt).toLocaleDateString("sv-SE")}</span>
              )}
              {post.tags.length > 0 && (
                <span>{post.tags.join(", ")}</span>
              )}
            </div>
            {post.excerpt && <p className="text-zinc-400">{post.excerpt}</p>}
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-zinc-500">No posts published yet.</p>
      )}
    </div>
  );
}