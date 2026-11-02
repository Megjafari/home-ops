import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { apiFetch } from "../lib/api";
import type { PostDetail } from "../lib/types";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = () => {
    setLoading(true);
    setError("");
    apiFetch("/api/admin/posts")
      .then(setPosts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
      loadPosts();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount is an accepted exception
    loadPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await run(() => apiFetch(`/api/admin/posts/${id}`, { method: "DELETE" }));
  };

  const handleTogglePublish = async (post: PostDetail) => {
    const action = post.status === "Published" ? "unpublish" : "publish";
    await run(() => apiFetch(`/api/admin/posts/${post.id}/${action}`, { method: "POST" }));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/new")} className="btn btn-primary btn-sm">
            New post
          </button>
          <button onClick={logout} className="btn btn-sm">
            Log out
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-danger">
          {error}
        </p>
      )}

      {loading && <p className="text-sm text-fg-muted">Loading...</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="text-sm text-fg-muted">No posts yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">{post.title}</p>
              <p className="mt-1 text-xs text-fg-muted">
                <span className={post.status === "Published" ? "text-emerald-400" : ""}>
                  {post.status === "Published" ? "● Published" : "○ Draft"}
                </span>
                {post.tags.length > 0 && ` · ${post.tags.join(", ")}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleTogglePublish(post)} className="btn btn-sm">
                {post.status === "Published" ? "Unpublish" : "Publish"}
              </button>
              <Link to={`/admin/edit/${post.id}`} className="btn btn-sm">
                Edit
              </Link>
              <button onClick={() => handleDelete(post.id, post.title)} className="btn btn-sm btn-danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
