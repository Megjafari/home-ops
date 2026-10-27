import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { publicFetch } from "../lib/api";
import type { PostListItem, Tag } from "../lib/types";

const PAGE_SIZE = 10;

function postsPath(tag: string, q: string, page: number) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
  if (tag) params.set("tag", tag);
  if (q) params.set("q", q);
  return `/api/posts?${params}`;
}

interface Result {
  key: string;
  posts: PostListItem[];
  page: number;
  hasMore: boolean;
  error: boolean;
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const q = searchParams.get("q") ?? "";
  const key = `${tag}|${q}`;

  const [search, setSearch] = useState(q);
  const [tags, setTags] = useState<Tag[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    publicFetch("/api/tags")
      .then((all: Tag[]) =>
        setTags(all.filter((t) => t.postCount > 0).sort((a, b) => b.postCount - a.postCount))
      )
      .catch(() => setTags([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    publicFetch(postsPath(tag, q, 1))
      .then((posts: PostListItem[]) => {
        if (!cancelled) setResult({ key, posts, page: 1, hasMore: posts.length === PAGE_SIZE, error: false });
      })
      .catch(() => {
        if (!cancelled) setResult({ key, posts: [], page: 1, hasMore: false, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [tag, q, key]);

  // Debounce typing into the URL so the search is shareable and survives reloads.
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === q) return;
    const id = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      setSearchParams(next, { replace: true });
    }, 300);
    return () => clearTimeout(id);
  }, [search, q, searchParams, setSearchParams]);

  const selectTag = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set("tag", slug);
    else next.delete("tag");
    setSearchParams(next);
  };

  const loadMore = async () => {
    if (!result) return;
    setLoadingMore(true);
    try {
      const nextPage = result.page + 1;
      const more: PostListItem[] = await publicFetch(postsPath(tag, q, nextPage));
      setResult({
        ...result,
        posts: [...result.posts, ...more],
        page: nextPage,
        hasMore: more.length === PAGE_SIZE,
      });
    } catch {
      setResult({ ...result, error: true });
    } finally {
      setLoadingMore(false);
    }
  };

  const loading = result?.key !== key;
  const posts = result?.posts ?? [];

  const chipClass = (active: boolean) =>
    `text-sm font-mono px-3 py-1 rounded border transition-colors ${
      active
        ? "border-cyan-400 text-cyan-400"
        : "border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600"
    }`;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">Homelab Journal</h1>
      <p className="text-zinc-400 mb-8">Notes on running Kubernetes, networking, and self-hosting at home.</p>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search posts..."
        aria-label="Search posts"
        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 mb-4 text-sm focus:outline-none focus:border-zinc-600"
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12">
          <button onClick={() => selectTag("")} className={chipClass(tag === "")}>
            all
          </button>
          {tags.map((t) => (
            <button key={t.id} onClick={() => selectTag(t.slug)} className={chipClass(tag === t.slug)}>
              {t.name} <span className="text-zinc-500">{t.postCount}</span>
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-zinc-400">Loading...</p>}

      {!loading && result?.error && (
        <p className="text-red-400 mb-6">Could not load posts. Try again later.</p>
      )}

      <div className="flex flex-col gap-10">
        {!loading &&
          posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
              <h2 className="text-xl font-semibold group-hover:text-cyan-400 transition-colors">
                {post.title}
              </h2>
              <div className="flex items-center gap-3 text-sm text-zinc-500 font-mono mt-1 mb-2">
                {post.publishedAt && (
                  <span>{new Date(post.publishedAt).toLocaleDateString("sv-SE")}</span>
                )}
                {post.tags.length > 0 && <span>{post.tags.join(", ")}</span>}
              </div>
              {post.excerpt && <p className="text-zinc-400">{post.excerpt}</p>}
            </Link>
          ))}
      </div>

      {!loading && !result?.error && posts.length === 0 && (
        <p className="text-zinc-500">
          {q || tag ? "No posts match your search." : "No posts published yet."}
        </p>
      )}

      {!loading && result?.hasMore && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-10 text-sm font-mono border border-zinc-800 px-4 py-2 rounded hover:border-zinc-600 disabled:opacity-50"
        >
          {loadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
