import { Link } from "react-router-dom";
import type { PostListItem } from "../lib/types";

export default function PostRow({ post }: { post: PostListItem }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid gap-2 border-b border-line/70 py-7 first:border-t sm:grid-cols-[8rem_1fr] sm:gap-8"
    >
      {post.publishedAt ? (
        <time dateTime={post.publishedAt} className="pt-1 text-sm tabular-nums text-fg-muted">
          {new Date(post.publishedAt).toLocaleDateString("sv-SE")}
        </time>
      ) : (
        <span />
      )}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-fg transition-colors group-hover:text-accent">
          {post.title}
        </h2>
        {post.excerpt && <p className="mt-1.5 leading-relaxed text-fg-muted">{post.excerpt}</p>}
        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <li key={t} className="pill">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
