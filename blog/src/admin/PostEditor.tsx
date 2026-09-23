import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import Editor from "./Editor";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function PostEditor() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!id) return;

    apiFetch(`/api/admin/posts/${id}`)
      .then((post) => {
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || "");
        setTags(post.tags.join(", "));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditMode) {
      setSlug(slugify(value));
    }
  };

  const handleSave = async () => {
    setStatus("saving");
    try {
      const payload = {
        title,
        slug,
        content,
        excerpt,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (isEditMode) {
        await apiFetch(`/api/admin/posts/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/api/admin/posts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setStatus("saved");
      setTimeout(() => navigate("/admin"), 600);
    } catch {
      setStatus("error");
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-4">
      <button
        onClick={() => navigate("/admin")}
        className="text-sm text-gray-500 self-start"
      >
        ← Back to posts
      </button>

      <input
        className="border p-2 rounded text-lg font-semibold"
        placeholder="Post title"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />
      <p className="text-sm text-gray-500">/{slug}</p>
      <input
        className="border p-2 rounded"
        placeholder="Short excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        placeholder="Tags, comma separated (kubernetes, opnsense)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <Editor content={content} onChange={setContent} />

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {isEditMode ? "Save changes" : "Save draft"}
        </button>
      </div>

      {status === "saved" && <p className="text-green-600">Saved.</p>}
      {status === "error" && <p className="text-red-600">Something went wrong.</p>}
    </div>
  );
}