import { describe, expect, it } from "vitest";
// @ts-expect-error plain .mjs build script without type declarations
import { buildTags, parseFrontmatter, renderRss, rewriteRelativeImages } from "./content.mjs";

describe("parseFrontmatter", () => {
  it("reads strings, quoted strings and lists", () => {
    const { data, body } = parseFrontmatter(
      '---\ntitle: Hello\nexcerpt: "A: b, c"\ntags: [homelab, proxmox]\n---\n## Body\n'
    );
    expect(data).toEqual({ title: "Hello", excerpt: "A: b, c", tags: ["homelab", "proxmox"] });
    expect(body).toBe("## Body\n");
  });

  it("throws without a frontmatter block", () => {
    expect(() => parseFrontmatter("no frontmatter")).toThrow();
  });
});

describe("rewriteRelativeImages", () => {
  it("rewrites relative images and leaves absolute ones alone", () => {
    const md = "![a](diagram.png) ![b](https://x.test/b.png) ![c](/c.png)";
    expect(rewriteRelativeImages(md, "post")).toBe(
      "![a](/posts/post/diagram.png) ![b](https://x.test/b.png) ![c](/c.png)"
    );
  });
});

describe("buildTags", () => {
  it("counts posts per tag", () => {
    const tags = buildTags([{ tags: ["a", "b"] }, { tags: ["a"] }]);
    expect(tags.find((t: { name: string }) => t.name === "a").postCount).toBe(2);
  });
});

describe("renderRss", () => {
  it("escapes markup in titles", () => {
    const rss = renderRss([{ title: "A & B", slug: "s", publishedAt: "2026-01-01T00:00:00Z", excerpt: "x", tags: [] }]);
    expect(rss).toContain("<title>A &amp; B</title>");
  });
});
