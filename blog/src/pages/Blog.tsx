import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { publicFetch } from "../lib/api";
import PostRow from "../components/PostRow";
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

  const chipClass = (active: boolean) => `chip ${active ? "chip-active" : ""}`;

  return (
    <div className="mx-auto max-w-3xl px-6 pt-16">
      <p className="eyebrow mb-4">Journal</p>
      <h1 className="mb-3 text-4xl font-semibold tracking-tight">All posts</h1>
      <p className="mb-10 text-fg-muted">
        Notes on running Kubernetes, networking, and self-hosting at home.
      </p>

      <div className="relative mb-4">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fg-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <circle cx="9" cy="9" r="5.5" />
          <path d="M13.5 13.5L17 17" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts"
          aria-label="Search posts"
          className="input pl-9"
        />
      </div>

      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button onClick={() => selectTag("")} className={chipClass(tag === "")}>
            all
          </button>
          {tags.map((t) => (
            <button key={t.id} onClick={() => selectTag(t.slug)} className={chipClass(tag === t.slug)}>
              {t.name} <span className="opacity-60">{t.postCount}</span>
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-sm text-fg-muted">Loading...</p>}

      {!loading && result?.error && (
        <p className="mb-6 text-sm text-danger">Could not load posts. Try again later.</p>
      )}

      {!loading && posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
      )}

      {!loading && !result?.error && posts.length === 0 && (
        <p className="text-sm text-fg-muted">
          {q || tag ? "No posts match your search." : "No posts published yet."}
        </p>
      )}

      {!loading && result?.hasMore && (
        <button onClick={loadMore} disabled={loadingMore} className="btn mt-10">
          {loadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
