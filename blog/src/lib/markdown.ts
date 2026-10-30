import DOMPurify from "dompurify";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import csharp from "highlight.js/lib/languages/csharp";
import diff from "highlight.js/lib/languages/diff";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import ini from "highlight.js/lib/languages/ini";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import nginx from "highlight.js/lib/languages/nginx";
import plaintext from "highlight.js/lib/languages/plaintext";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("diff", diff);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("nginx", nginx);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

// Common fence names that differ from highlight.js language names.
hljs.registerAliases(["sh", "shell", "zsh", "console"], { languageName: "bash" });
hljs.registerAliases(["cs", "c#"], { languageName: "csharp" });
hljs.registerAliases(["js", "jsx"], { languageName: "javascript" });
hljs.registerAliases(["ts", "tsx"], { languageName: "typescript" });
hljs.registerAliases(["yml"], { languageName: "yaml" });
hljs.registerAliases(["html", "svg"], { languageName: "xml" });
hljs.registerAliases(["toml", "conf"], { languageName: "ini" });

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = lang.split(/\s+/)[0];
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language, ignoreIllegals: true }).value;
      }
      return escapeHtml(code);
    },
  }),
  { gfm: true }
);

/** Wraps code blocks in a frame with the language and a copy button (see lib/codeCopy.ts). */
function addCodeBlockChrome(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.querySelectorAll("pre > code").forEach((code) => {
    const pre = code.parentElement!;
    const language = /language-([^\s]+)/.exec(code.className)?.[1] ?? "text";

    // Mermaid diagrams are drawn in the browser (see lib/mermaid.ts). Until then,
    // and if drawing fails, the source stays visible as a code block.
    if (language === "mermaid") {
      const figure = doc.createElement("figure");
      figure.className = "mermaid-diagram";
      pre.replaceWith(figure);
      figure.append(pre);
      return;
    }

    const label = doc.createElement("span");
    label.textContent = language;

    const button = doc.createElement("button");
    button.type = "button";
    button.setAttribute("data-copy", "");
    button.setAttribute("aria-label", "Copy code");
    button.textContent = "copy";

    const head = doc.createElement("div");
    head.className = "code-head";
    head.append(label, button);

    const wrapper = doc.createElement("div");
    wrapper.className = "code-block";
    pre.replaceWith(wrapper);
    wrapper.append(head, pre);
  });

  return doc.body.innerHTML;
}

/**
 * Renders GitHub-flavoured Markdown to sanitized HTML. Older posts that were
 * saved as HTML still render, because Markdown passes HTML blocks through.
 */
export function renderMarkdown(source: string): string {
  const html = marked.parse(source, { async: false });
  return addCodeBlockChrome(DOMPurify.sanitize(html));
}
