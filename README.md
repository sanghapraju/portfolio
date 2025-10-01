# Shreya Portfolio (Netlify-ready)

A single-page portfolio built with Vite + React + Tailwind.
Blue/green glow theme, typewriter hero, reveal-on-scroll, project filters + modals, Netlify form, LinkedIn/email icon buttons.

## Quick start (local)
```bash
npm i
npm run dev
```
Visit the URL Vite prints (usually http://localhost:5173).

## Deploy to Netlify
1. Push this folder to a new GitHub repo.
2. On Netlify: **New site from Git** → pick the repo.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. The contact form works out-of-the-box via `data-netlify="true"`.

## Add your photo
- Put your image at: `public/profile.png` (exact name).
- It is referenced in `src/App.jsx` with `src="/profile.png"`.
- To use a different file name or path, change that `src` accordingly.

## Customize
- Edit the hero text and skills in `src/App.jsx` (search for "Interaction Technology Graduate @ UTwente...").
- Update project cards in the `projects` array.
- Update LinkedIn/email links in the Contact section + footer.
- Colors/animations use Tailwind classes in the same file.
