import { describe, expect, it } from "vitest";
import { extractToc } from "./toc";

describe("extractToc", () => {
  it("collects h2 and h3 headings with levels and adds ids", () => {
    const { toc, htmlWithIds } = extractToc("<h2>Setup Cluster</h2><p>x</p><h3>Nodes & Roles</h3>");

    expect(toc).toEqual([
      { id: "setup-cluster", text: "Setup Cluster", level: 2 },
      { id: "nodes-roles", text: "Nodes & Roles", level: 3 },
    ]);
    expect(htmlWithIds).toContain('<h2 id="setup-cluster">');
  });

  it("returns an empty list when there are no headings", () => {
    expect(extractToc("<p>nothing</p>").toc).toEqual([]);
  });

  it("ignores h1 and h4 headings", () => {
    expect(extractToc("<h1>A</h1><h4>B</h4>").toc).toEqual([]);
  });
});
