import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useRef } from "react";
import { apiFetch } from "../lib/api";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!editor) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await apiFetch("/api/admin/upload", {
      method: "POST",
      body: formData,
      headers: {}, // let the browser set multipart content-type
    });

    editor.chain().focus().setImage({ src: res.url }).run();
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm border px-3 py-1 rounded"
        >
          Insert image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
            e.target.value = "";
          }}
        />
      </div>
      <div className="border rounded p-3 min-h-75">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}