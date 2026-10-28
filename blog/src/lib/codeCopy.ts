import type { MouseEvent } from "react";

/** Fallback for browsers or contexts where the async Clipboard API is unavailable or blocked. */
function copyWithSelection(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

/** Click handler for rendered posts: copies a code block when its "copy" button is clicked. */
export function handleCodeCopyClick(e: MouseEvent<HTMLElement>) {
  const button = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-copy]");
  if (!button) return;

  const code = button.closest(".code-block")?.querySelector("pre")?.textContent ?? "";
  const flash = (text: string) => {
    button.textContent = text;
    setTimeout(() => {
      button.textContent = "copy";
    }, 1500);
  };

  const fallback = () => flash(copyWithSelection(code) ? "copied" : "failed");

  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => flash("copied"), fallback);
  } else {
    fallback();
  }
}
