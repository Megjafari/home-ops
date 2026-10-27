import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { publicFetch } from "../lib/api";
import { estimateReadingStats } from "../lib/readingTime";
import { extractToc, type TocItem } from "../lib/toc";
import type { PostDetail } from "../lib/types";

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [contentHtml, setContentHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    publicFetch(`/api/posts/${slug}`)
      .then((data: PostDetail) => {
        setPost(data);
        const { toc, htmlWithIds } = extractToc(data.content);
        setToc(toc);
        setContentHtml(DOMPurify.sanitize(htmlWithIds));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-16 text-zinc-400">Loading...</div>;
  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-zinc-400">Post not found.</p>
        <Link to="/blog" className="text-cyan-400 underline">Back to blog</Link>
      </div>
    );
  }

  const { words, minutes } = estimateReadingStats(post.content);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
      <article>
        <Link to="/blog" className="text-sm text-zinc-500 hover:text-zinc-300 font-mono">
          ← Back to journal
        </Link>

        <h1 className="text-3xl font-semibold mt-4 mb-2">{post.title}</h1>
        {post.excerpt && <p className="text-lg text-zinc-400 mb-4">{post.excerpt}</p>}

        <div className="flex items-center gap-3 text-sm text-zinc-500 font-mono mb-10">
          {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString("sv-SE")}</span>}
          <span>·</span>
          <span>{minutes} min read</span>
          <span>·</span>
          <span>{words} words</span>
          {post.tags.length > 0 && (
            <>
              <span>·</span>
              <span>{post.tags.join(", ")}</span>
            </>
          )}
        </div>

        {post.heroImageUrl && (
          <img src={post.heroImageUrl} alt="" className="w-full rounded mb-10" />
        )}

        <div className="prose-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>

      {toc.length > 0 && (
        <aside className="hidden lg:block">
          <nav className="sticky top-16 text-sm">
            <p className="text-zinc-500 font-mono mb-3 uppercase tracking-wide text-xs">On this page</p>
            <ul className="flex flex-col gap-2">
              {toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
                  <a href={`#${item.id}`} className="text-zinc-400 hover:text-cyan-400 transition-colors">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}
    </div>
  );
}