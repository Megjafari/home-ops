# Meghdad Jafari — Portfolio

Personal portfolio built with React. Inspired by the Nitro Framer template.

**Live:** [meghdadjafari.dev](https://meghdadjafari.dev)

---

## Stack

- React 18
- React Router v6
- CSS (custom, no framework)
- Deployed on Vercel

---

## Run locally

```bash
npm install
npm start
```

---

## Content

All content lives in one file: `src/data/index.js`

Edit that file to update name, bio, projects, skills, social links and email.

---

## Pages

- `/` — Home
- `/projects` — Projects with backend architecture visuals
- `/about` — About + languages
- `/skills` — Skills grouped by category + logo loop
- `/contact` — Contact

---

## Project visuals

Each project uses a visual type instead of a screenshot — set in `src/data/index.js`:

```js
visual: "architecture"  // layered architecture diagram
visual: "flow"          // system flow (e.g. auth register/login)
visual: "code"          // code snippet preview
```

---

## CV files

Place your CV PDFs in `public/`:

```
public/cv-english.pdf
public/cv-swedish.pdf
```

They are linked in the navbar CV dropdown.

---

## Profile photo

Place your photo in `public/images/profile.jpg` and update `src/data/index.js`:

```js
about: {
  image: "/images/profile.jpg",
}
```

---

## Structure

```
src/
  data/index.js             ← all content lives here
  components/
    Nav.jsx                 ← navbar, icons, CV dropdown
    Footer.jsx
    ProjectItem.jsx
    ProjectVisuals.jsx      ← architecture / flow / code visuals
  pages/
    Home.jsx
    Projects.jsx
    About.jsx
    Skills.jsx
    Contact.jsx
    NotFound.jsx
  styles.css
  App.jsx
  index.js
public/
  cv-english.pdf
  cv-swedish.pdf
  images/
    profile.jpg
```
