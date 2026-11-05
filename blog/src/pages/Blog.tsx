import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listPosts, listTags } from "../lib/content";
import PostRow from "../components/PostRow";

const PAGE_SIZE = 10;

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const q = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(q);
  const [shown, setShown] = useState({ key: "", count: PAGE_SIZE });

  const tags = useMemo(() => listTags().filter((t) => t.postCount > 0), []);
  const posts = useMemo(() => listPosts({ tag, q }), [tag, q]);

  // Showing more only applies to the filter it was clicked under.
  const key = `${tag}|${q}`;
  const count = shown.key === key ? shown.count : PAGE_SIZE;
  const visible = posts.slice(0, count);

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

  const chipClass = (active: boolean) => `chip ${active ? "chip-active" : ""}`;

  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 sm:pt-36">
      <h1 className="text-[clamp(52px,12vw,120px)] leading-[0.94] font-light tracking-[-0.055em]">All posts</h1>
      <p className="mt-8 mb-12 max-w-xl text-lg text-fg-muted">
        Notes on running Kubernetes, networking and self-hosting at home.
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

      {visible.length > 0 && (
        <div className="post-list">
          {visible.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
      )}

      {posts.length === 0 && (
        <p className="text-sm text-fg-muted">
          {q || tag ? "No posts match your search." : "No posts published yet."}
        </p>
      )}

      {posts.length > visible.length && (
        <button onClick={() => setShown({ key, count: count + PAGE_SIZE })} className="btn mt-10">
          Load more
        </button>
      )}
    </div>
  );
}
