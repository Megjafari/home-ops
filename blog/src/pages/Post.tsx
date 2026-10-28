import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { publicFetch } from "../lib/api";
import { handleCodeCopyClick } from "../lib/codeCopy";
import { formatDate, wasUpdatedAfterPublish } from "../lib/dates";
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
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!slug) return;

    // The Markdown renderer (with syntax highlighting) is loaded alongside the post.
    Promise.all([publicFetch(`/api/posts/${slug}`), import("../lib/markdown")])
      .then(([data, markdown]: [PostDetail, typeof import("../lib/markdown")]) => {
        const html = markdown.renderMarkdown(data.content);
        const { toc, htmlWithIds } = extractToc(html);
        setPost(data);
        setToc(toc);
        setContentHtml(DOMPurify.sanitize(htmlWithIds));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Highlight the heading that is currently being read in the table of contents:
  // the last one that has scrolled past the top of the viewport (or the last one at the page end).
  useEffect(() => {
    if (toc.length === 0) return;

    const update = () => {
      const headings = toc
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);
      if (headings.length === 0) return;

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = headings[0];
      for (const heading of headings) {
        if (atBottom || heading.getBoundingClientRect().top <= 120) current = heading;
        else break;
      }
      setActiveId(current.id);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [toc, contentHtml]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-16 text-sm text-fg-muted">Loading...</div>;
  }

  if (notFound || !post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-3 text-2xl font-semibold tracking-tight">Post not found</h1>
        <p className="mb-6 text-fg-muted">The post may have been moved or unpublished.</p>
        <Link to="/blog" className="btn">
          ← All posts
        </Link>
      </div>
    );
  }

  const { words, minutes } = estimateReadingStats(contentHtml);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_240px]">
      <article className="min-w-0 max-w-3xl">
        <Link to="/blog" className="text-sm text-fg-muted transition-colors hover:text-fg">
          ← All posts
        </Link>

        <h1 className="mt-8 mb-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        {post.excerpt && <p className="mb-5 text-lg text-fg-muted">{post.excerpt}</p>}

        <div className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-fg-muted">
          {post.publishedAt && (
            <time dateTime={post.publishedAt} className="tabular-nums">
              {formatDate(post.publishedAt)}
            </time>
          )}
          {wasUpdatedAfterPublish(post.publishedAt, post.updatedAt) && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Updated{" "}
                <time dateTime={post.updatedAt} className="tabular-nums">
                  {formatDate(post.updatedAt)}
                </time>
              </span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{minutes} min read</span>
          <span aria-hidden="true">·</span>
          <span>{words} words</span>
          {post.tags.map((t) => (
            <Link
              key={t}
              to={`/blog?tag=${encodeURIComponent(t)}`}
              className="pill transition-colors hover:border-fg-muted hover:text-fg"
            >
              {t}
            </Link>
          ))}
        </div>

        {post.heroImageUrl && (
          <img
            src={post.heroImageUrl}
            alt=""
            className="mb-10 w-full rounded-lg border border-line"
          />
        )}

        {/* Click is delegated to the "copy" buttons inside the rendered code blocks */}
        <div
          className="prose-content"
          onClick={handleCodeCopyClick}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <Link to="/blog" className="btn mt-16">
          ← All posts
        </Link>
      </article>

      {toc.length > 0 && (
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-20 text-sm">
            <p className="eyebrow mb-3">On this page</p>
            <ul className="flex flex-col gap-1 border-l border-line">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`-ml-px block border-l py-1 transition-colors ${
                      item.level === 3 ? "pl-6" : "pl-4"
                    } ${
                      activeId === item.id
                        ? "border-fg text-fg"
                        : "border-transparent text-fg-muted hover:text-fg"
                    }`}
                  >
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
