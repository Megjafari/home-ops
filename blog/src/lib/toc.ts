export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugifyHeading(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

export function extractToc(html: string): { toc: TocItem[]; htmlWithIds: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const headings = doc.querySelectorAll("h2, h3");

  const toc: TocItem[] = [];
  headings.forEach((el) => {
    const text = el.textContent || "";
    const id = slugifyHeading(text);
    el.id = id;
    toc.push({ id, text, level: el.tagName === "H2" ? 2 : 3 });
  });

  return { toc, htmlWithIds: doc.body.innerHTML };
}