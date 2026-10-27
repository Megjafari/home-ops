# Homelab Journal (frontend)

React + TypeScript frontend for the Homelab Journal blog, built with Vite and Tailwind CSS 4. Posts are written in a Tiptap editor in the admin area.

API: [Megjafari/HomelabBlog-API](https://github.com/Megjafari/HomelabBlog-API)

## Features

- Public: home page, post list with tag filter, search and "load more", post page with table of contents and reading time, About page, RSS link
- Admin (`/admin`, JWT login): list, create, edit, delete, publish/unpublish posts, hero image and inline image upload
- Post HTML is sanitized with DOMPurify before it is rendered
- Admin pages and the editor are code-split, so visitors do not download them

## Run locally

```bash
npm install
npm run dev
```

The app expects the API on http://localhost:5062 in development. See [.env.example](.env.example).

## Configuration

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | API base URL. If unset, `http://localhost:5062` is used in development and the same origin in production builds. |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |

## Project structure

```
src/
  pages/        public pages (Home, Blog, Post, About)
  admin/        login, dashboard, post editor (lazy loaded)
  components/   Nav
  lib/          api client, auth, types, toc, reading time, slug helpers
```

## Docker

```bash
docker build --build-arg VITE_API_BASE_URL=https://blog-api.meghdadjafari.dev -t homelab-blog-web .
```

The image serves the build with nginx on port 80, with fallback to `index.html` for client-side routes and long-lived caching for hashed assets. `VITE_API_BASE_URL` is baked in at build time. Deployment steps (Coolify) are in the API repo: [docs/deploy.md](https://github.com/Megjafari/HomelabBlog-API/blob/main/docs/deploy.md).
