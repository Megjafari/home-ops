import { describe, expect, it } from "vitest";
import { renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("renders headings, emphasis and links", () => {
    const html = renderMarkdown("## Title\n\nSome **bold** and [a link](https://example.com).");

    expect(html).toContain("<h2>Title</h2>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain('<a href="https://example.com">a link</a>');
  });

  it("renders images placed between paragraphs", () => {
    const html = renderMarkdown("First\n\n![diagram](https://api.test/uploads/a.png)\n\nSecond");

    expect(html).toContain('<img src="https://api.test/uploads/a.png" alt="diagram">');
    expect(html.indexOf("First")).toBeLessThan(html.indexOf("<img"));
    expect(html.indexOf("<img")).toBeLessThan(html.indexOf("Second"));
  });

  it("renders GitHub-style tables, task lists and strikethrough", () => {
    const html = renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |\n\n- [x] done\n- [ ] todo\n\n~~gone~~");

    expect(html).toContain("<table>");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain("<del>gone</del>");
  });

  it("highlights fenced code and understands aliases", () => {
    const html = renderMarkdown("```yaml\nname: blog\nreplicas: 2\n```");
    const shell = renderMarkdown("```sh\necho \"hi\" # greet\n```");

    expect(html).toContain('class="hljs language-yaml"');
    expect(html).toContain("hljs-attr");
    expect(shell).toContain("hljs-comment");
  });

  it("wraps code blocks with a language label and a copy button", () => {
    const html = renderMarkdown("```yaml\nname: blog\n```\n\n```\nplain\n```");

    expect(html).toContain('class="code-block"');
    expect(html).toContain("<span>yaml</span>");
    expect(html).toContain("<span>text</span>");
    expect(html.match(/data-copy/g)).toHaveLength(2);
  });

  it("escapes code in unknown languages instead of interpreting it", () => {
    const html = renderMarkdown('```madeup\n<script>alert(1)</script>\n```');

    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("strips scripts, event handlers and javascript: links", () => {
    const html = renderMarkdown(
      '<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n[click](javascript:alert(1))'
    );

    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("javascript:");
  });

  it("still renders posts that were saved as HTML", () => {
    const html = renderMarkdown("<h2>Old post</h2><p>Written in the old editor</p>");

    expect(html).toContain("<h2>Old post</h2>");
    expect(html).toContain("<p>Written in the old editor</p>");
  });
});
