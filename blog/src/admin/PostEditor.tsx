import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { slugify } from "../lib/slug";
import MarkdownEditor from "./MarkdownEditor";

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
    return <div className="p-8 text-sm text-fg-muted">Loading...</div>;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-10">
      <button
        onClick={() => navigate("/admin")}
        className="self-start text-sm text-fg-muted transition-colors hover:text-fg"
      >
        ← All posts
      </button>

      <input
        className="input text-lg font-semibold"
        placeholder="Post title"
        aria-label="Post title"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />
      <p className="text-xs text-fg-muted">/blog/{slug}</p>
      <input
        className="input"
        placeholder="Short excerpt"
        aria-label="Short excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
      />
      <input
        className="input"
        placeholder="Tags, comma separated (kubernetes, opnsense)"
        aria-label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Hero image URL (optional)"
            aria-label="Hero image URL"
            value={heroImageUrl}
            onChange={(e) => setHeroImageUrl(e.target.value)}
          />
          <button type="button" onClick={() => heroInputRef.current?.click()} className="btn btn-sm">
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
          <img
            src={heroImageUrl}
            alt="Hero preview"
            className="max-h-40 self-start rounded border border-line"
          />
        )}
      </div>

      <MarkdownEditor value={content} onChange={setContent} />

      <div className="flex gap-3">
        <button onClick={() => handleSave()} disabled={status === "saving"} className="btn">
          {published ? "Save changes" : "Save draft"}
        </button>
        <button
          onClick={() => handleSave(!published)}
          disabled={status === "saving"}
          className="btn btn-primary"
        >
          {published ? "Save & unpublish" : "Save & publish"}
        </button>
      </div>

      {status === "saved" && <p className="text-sm text-emerald-400">Saved.</p>}
      {status === "error" && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage || "Something went wrong."}
        </p>
      )}
    </div>
  );
}
