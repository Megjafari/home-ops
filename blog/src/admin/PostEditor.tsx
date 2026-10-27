import { useEffect, useRef, useState } from "react";
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
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const heroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;

    apiFetch(`/api/admin/posts/${id}`)
      .then((post) => {
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || "");
        setTags(post.tags.join(", "));
        setHeroImageUrl(post.heroImageUrl || "");
        setPublished(post.status === "Published");
      })
      .catch((e: Error) => {
        setErrorMessage(e.message);
        setStatus("error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditMode) {
      setSlug(slugify(value));
    }
  };

  const handleHeroUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiFetch("/api/admin/upload", { method: "POST", body: formData });
      setHeroImageUrl(res.url);
    } catch (e) {
      setErrorMessage((e as Error).message);
      setStatus("error");
    }
  };

  // publish: true/false changes publish state after saving, undefined leaves it as is.
  const handleSave = async (publish?: boolean) => {
    setStatus("saving");
    setErrorMessage("");
    try {
      const payload = {
        title,
        slug,
        content,
        excerpt,
        heroImageUrl: heroImageUrl || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      let postId = id;
      if (isEditMode) {
        await apiFetch(`/api/admin/posts/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        const created = await apiFetch("/api/admin/posts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        postId = created.id;
      }

      if (publish !== undefined && publish !== published) {
        await apiFetch(`/api/admin/posts/${postId}/${publish ? "publish" : "unpublish"}`, {
          method: "POST",
        });
        setPublished(publish);
      }

      setStatus("saved");
      setTimeout(() => navigate("/admin"), 600);
    } catch (e) {
      setErrorMessage((e as Error).message);
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
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Hero image URL (optional)"
            value={heroImageUrl}
            onChange={(e) => setHeroImageUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={() => heroInputRef.current?.click()}
            className="text-sm border px-3 py-1 rounded"
          >
            Upload
          </button>
          <input
            ref={heroInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleHeroUpload(file);
              e.target.value = "";
            }}
          />
        </div>
        {heroImageUrl && (
          <img src={heroImageUrl} alt="Hero preview" className="max-h-40 rounded self-start" />
        )}
      </div>

      <Editor content={content} onChange={setContent} />

      <div className="flex gap-3">
        <button
          onClick={() => handleSave()}
          disabled={status === "saving"}
          className="border px-4 py-2 rounded disabled:opacity-50"
        >
          {published ? "Save changes" : "Save draft"}
        </button>
        <button
          onClick={() => handleSave(!published)}
          disabled={status === "saving"}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {published ? "Save & unpublish" : "Save & publish"}
        </button>
      </div>

      {status === "saved" && <p className="text-green-600">Saved.</p>}
      {status === "error" && (
        <p className="text-red-600">{errorMessage || "Something went wrong."}</p>
      )}
    </div>
  );
}