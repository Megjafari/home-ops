// Turns ../content/posts/*/post.md into the files the app imports at build time.
// Output (all git-ignored): src/generated/posts.json, src/generated/post/<slug>.json,
// public/posts/<slug>/* (the post's images) and public/rss.xml.
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildTags, readPosts, renderRss, toListItem } from "./content.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const posts = readPosts(resolve(root, "..", "content"));

const generated = join(root, "src", "generated");
const publicPosts = join(root, "public", "posts");
rmSync(generated, { recursive: true, force: true });
rmSync(publicPosts, { recursive: true, force: true });
mkdirSync(join(generated, "post"), { recursive: true });

const slugs = new Set();
for (const { folder, detail } of posts) {
  if (slugs.has(detail.slug)) throw new Error(`duplicate slug: ${detail.slug}`);
  slugs.add(detail.slug);

  writeFileSync(join(generated, "post", `${detail.slug}.json`), JSON.stringify(detail));
  const target = join(publicPosts, detail.slug);
  mkdirSync(target, { recursive: true });
  for (const name of readdirSync(folder)) {
    // Diagram sources and the post text are not served, only what the page can show.
    if (name !== "post.md" && !name.endsWith(".md") && !name.endsWith(".mmd")) cpSync(join(folder, name), join(target, name), { recursive: true });
  }
}

const index = posts.map(({ detail }) => toListItem(detail));
writeFileSync(join(generated, "posts.json"), JSON.stringify(index));
writeFileSync(join(generated, "tags.json"), JSON.stringify(buildTags(index)));
writeFileSync(join(root, "public", "rss.xml"), renderRss(index));

console.log(`content: ${posts.length} post(s) built`);
