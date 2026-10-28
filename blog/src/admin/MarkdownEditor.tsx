import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { apiFetch } from "../lib/api";
import { insertBlock, prefixLines, wrapSelection, type Edit } from "../lib/markdownEdit";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MIN_HEIGHT = 384;

type ToolbarAction =
  | "heading"
  | "bold"
  | "italic"
  | "code"
  | "codeblock"
  | "link"
  | "list"
  | "quote"
  | "image";

const TOOLBAR: { action: ToolbarAction; label: string; title: string; className?: string }[] = [
  { action: "heading", label: "H", title: "Heading", className: "font-bold" },
  { action: "bold", label: "B", title: "Bold", className: "font-bold" },
  { action: "italic", label: "I", title: "Italic", className: "italic" },
  { action: "code", label: "`", title: "Inline code", className: "font-mono" },
  { action: "codeblock", label: "{ }", title: "Code block", className: "font-mono" },
  { action: "link", label: "Link", title: "Link" },
  { action: "list", label: "List", title: "Bulleted list" },
  { action: "quote", label: "Quote", title: "Quote" },
  { action: "image", label: "Image", title: "Upload an image at the cursor" },
];

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Uploads finish after the render that started them, so they read the latest text from here.
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // The renderer (Markdown + syntax highlighting) is only loaded when Preview is opened.
  useEffect(() => {
    if (tab !== "preview") return;
    let cancelled = false;
    import("../lib/markdown").then((m) => {
      if (!cancelled) setPreviewHtml(m.renderMarkdown(value));
    });
    return () => {
      cancelled = true;
    };
  }, [tab, value]);

  // Grow with the content instead of scrolling inside the box.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, MIN_HEIGHT)}px`;
  }, [value, tab]);

  const apply = (edit: Edit) => {
    valueRef.current = edit.value;
    onChange(edit.value);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(edit.selStart, edit.selEnd);
    });
  };

  const selection = () => {
    const el = textareaRef.current;
    const text = valueRef.current;
    return { text, start: el?.selectionStart ?? text.length, end: el?.selectionEnd ?? text.length };
  };

  const replaceInValue = (search: string, replacement: string) => {
    const current = valueRef.current;
    if (!current.includes(search)) return;
    const next = current.replace(search, () => replacement);
    valueRef.current = next;
    onChange(next);
  };

  const uploadImages = async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;
    setError("");

    for (const file of images) {
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[[\]]/g, "");
      const placeholder = `![Uploading ${alt}...]()`;

      const { text, start, end } = selection();
      apply(insertBlock(text, start, end, placeholder));

      setUploading((n) => n + 1);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiFetch("/api/admin/upload", { method: "POST", body: formData });
        replaceInValue(placeholder, `![${alt}](${res.url})`);
      } catch (e) {
        replaceInValue(placeholder, "");
        setError(`Could not upload ${file.name}: ${(e as Error).message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const run = (make: (text: string, start: number, end: number) => Edit) => {
    const { text, start, end } = selection();
    apply(make(text, start, end));
  };

  const runToolbar = (action: ToolbarAction) => {
    switch (action) {
      case "heading":
        return run((t, s, e) => prefixLines(t, s, e, "## "));
      case "bold":
        return run((t, s, e) => wrapSelection(t, s, e, "**", "**", "bold"));
      case "italic":
        return run((t, s, e) => wrapSelection(t, s, e, "_", "_", "italic"));
      case "code":
        return run((t, s, e) => wrapSelection(t, s, e, "`", "`", "code"));
      case "codeblock":
        return run((t, s, e) => {
          const selected = t.slice(s, e);
          return insertBlock(t, s, e, "```\n" + selected + "\n```", 4 + selected.length);
        });
      case "link":
        return run((t, s, e) => wrapSelection(t, s, e, "[", "](https://)", "link text"));
      case "list":
        return run((t, s, e) => prefixLines(t, s, e, "- "));
      case "quote":
        return run((t, s, e) => prefixLines(t, s, e, "> "));
      case "image":
        return fileInputRef.current?.click();
    }
  };

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm -mb-px border-b-2 ${
      active ? "border-cyan-400 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"
    }`;

  return (
    <div>
      <div className="flex items-end justify-between border-b border-zinc-800">
        <div className="flex">
          <button
            type="button"
            className={tabClass(tab === "write")}
            onClick={() => setTab("write")}
          >
            Write
          </button>
          <button
            type="button"
            className={tabClass(tab === "preview")}
            onClick={() => {
              setPreviewHtml(null);
              setTab("preview");
            }}
          >
            Preview
          </button>
        </div>
        {uploading > 0 && <span className="text-xs text-zinc-500 pb-2">Uploading...</span>}
      </div>

      {tab === "write" ? (
        <>
          <div className="flex flex-wrap gap-1 py-2">
            {TOOLBAR.map((item) => (
              <button
                key={item.action}
                type="button"
                title={item.title}
                onClick={() => runToolbar(item.action)}
                className={`text-sm border border-zinc-800 hover:border-zinc-600 px-2.5 py-1 rounded ${item.className ?? ""}`}
              >
                {item.label}
              </button>
            ))}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                void uploadImages(Array.from(e.target.files ?? []));
                e.target.value = "";
              }}
            />
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              valueRef.current = e.target.value;
              onChange(e.target.value);
            }}
            onPaste={(e) => {
              const files = Array.from(e.clipboardData.files);
              if (files.some((f) => f.type.startsWith("image/"))) {
                e.preventDefault();
                void uploadImages(files);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.files.length > 0) {
                e.preventDefault();
                void uploadImages(Array.from(e.dataTransfer.files));
              }
            }}
            spellCheck
            placeholder="Write in Markdown. Paste or drop images to upload them."
            style={{ minHeight: MIN_HEIGHT }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded p-4 font-mono text-sm leading-relaxed resize-y focus:outline-none focus:border-zinc-600"
          />
          <p className="text-xs text-zinc-500 mt-2">
            Markdown supported (tables, task lists, code blocks with syntax highlighting). Paste, drop or
            upload images; they are inserted where the cursor is.
          </p>
        </>
      ) : (
        <div
          className="border border-zinc-800 rounded p-6 mt-2"
          style={{ minHeight: MIN_HEIGHT }}
        >
          {previewHtml === null ? (
            <p className="text-zinc-500">Loading preview...</p>
          ) : value.trim() === "" ? (
            <p className="text-zinc-500">Nothing to preview.</p>
          ) : (
            <div className="prose-content" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
