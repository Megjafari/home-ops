import { useState } from "react";
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
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
  };

  const handleSave = async (publish: boolean) => {
    setStatus("saving");
    try {
      const post = await apiFetch("/api/admin/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (publish) {
        await apiFetch(`/api/admin/posts/${post.id}/publish`, {
          method: "POST",
        });
      }

      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
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
          onClick={() => handleSave(false)}
          className="border px-4 py-2 rounded"
        >
          Save draft
        </button>
        <button
          onClick={() => handleSave(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Publish
        </button>
      </div>

      {status === "saved" && <p className="text-green-600">Saved.</p>}
      {status === "error" && <p className="text-red-600">Something went wrong.</p>}
    </div>
  );
}