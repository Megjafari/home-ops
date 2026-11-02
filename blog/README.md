# Homelab Journal (blog)

React + TypeScript frontend for the Homelab Journal, built with Vite and Tailwind CSS 4. The site is static: the posts are Markdown files in [`../content/posts`](../content/posts) and are turned into JSON at build time. There is no API or database.

## How a post gets published

1. Add `content/posts/<name>/post.md` with a frontmatter block, plus any images next to it.
2. Open a pull request. CI lints, tests and builds the blog.
3. Merge to `main`. The site is rebuilt and deployed.

```markdown
---
title: "Post title"
slug: url-slug            # optional, defaults to the folder name
excerpt: "One sentence shown in lists and the feed"
date: 2026-10-28T09:19:12Z
updated: 2026-10-30       # optional
tags: [homelab, kubernetes]
hero: hero.jpg            # optional, a file in the same folder
draft: true               # optional, leaves the post out of the build
---

## Introduction
```

Relative image links (`![alt](diagram.png)`) are served from the post's folder. Fenced `mermaid` blocks are drawn in the browser.

## Features

- Home page, post list with tag filter, search and "load more", post page with table of contents and reading time, About page, RSS feed (`/rss.xml`)
- Rendered post HTML is sanitized with DOMPurify. Code blocks get syntax highlighting (highlight.js)
- Each post body is its own chunk, so list pages do not download every post

## Run locally

```bash
npm install
npm run dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run content` | Build `src/generated`, `public/posts` and `public/rss.xml` from `../content` (runs automatically before `dev`, `build` and `lint`) |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |

## Docker

The image is built from the repository root, because it needs `content/` as well as `blog/`:

```bash
docker build -f blog/Dockerfile .
```

It serves `dist/` with nginx.
