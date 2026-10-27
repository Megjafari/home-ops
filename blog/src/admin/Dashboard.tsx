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
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold">Admin</h1>
        <button onClick={logout} className="text-sm underline">
          Log out
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Posts</h2>
        <button
          onClick={() => navigate("/admin/new")}
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          New post
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="text-gray-500">No posts yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div key={post.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{post.title}</p>
              <p className="text-sm text-gray-500">
                {post.status} {post.tags.length > 0 && `· ${post.tags.join(", ")}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleTogglePublish(post)}
                className="text-sm border px-3 py-1 rounded"
              >
                {post.status === "Published" ? "Unpublish" : "Publish"}
              </button>
              <Link
                to={`/admin/edit/${post.id}`}
                className="text-sm border px-3 py-1 rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(post.id, post.title)}
                className="text-sm border border-red-600 text-red-600 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}