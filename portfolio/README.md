# Nitro Portfolio — React

A React implementation of the Nitro Framer template.

## Setup

```bash
npm install
npm start
```

## Customize

All your content lives in **one file**: `src/data/index.js`

Edit that file to update:
- Your name, handle, email
- Your projects (title, category, tags, images, links)
- Your bio and about text
- Your social links
- Your blog notes

### Adding project images

1. Put your images in `public/images/`
2. In `src/data/index.js`, update the `image` field:
   ```js
   image: "/images/my-project.jpg"
   ```

### Adding your photo

Same process — put it in `public/images/` and update `about.image`:
```js
about: {
  image: "/images/profile.jpg",
  ...
}
```

## Pages

- `/` — Home with hero, projects, about preview, notes preview, CTA
- `/projects` — All projects
- `/about` — About page with skills, experience, contact
- `/notes` — Blog / notes grid
- `/contact` — Contact page

## Structure

```
src/
  data/index.js        ← EDIT THIS — all your content
  components/
    Nav.jsx
    Footer.jsx
    ProjectItem.jsx
  pages/
    Home.jsx
    Projects.jsx
    About.jsx
    Notes.jsx
    Contact.jsx
    NotFound.jsx
  styles.css           ← all CSS (dark theme, responsive)
  App.jsx              ← router setup
  index.js             ← entry point
```
