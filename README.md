# Sarvesh Ganesan — Portfolio

Personal portfolio site for Sarvesh Ganesan, Lead AI Architect.

Live: **https://sarveshganesan.in**

## Stack

Static site: hand-written HTML + CSS + vanilla JavaScript. No build step.

- `index.html` — landing page
- `style.css` — single stylesheet, CSS custom properties drive light/dark themes
- `script.js` — theme toggle, mobile nav, smooth scroll, GitHub activity dashboard, contact form
- `Sarvesh_Resume.pdf` — downloadable resume
- `sitemap.xml`, `robots.txt`, `404.html` — SEO / UX infra
- `CNAME` — GitHub Pages custom domain config

## Local dev

```bash
npm install
npm run serve        # http://localhost:8080
npm run lint         # html + css + js
npm run format       # prettier
```

## Deploy

Pushed to `main` → GitHub Pages publishes automatically. Custom domain `sarveshganesan.in` is bound via `CNAME` file + DNS ALIAS to `Sarvesh-GanesanW.github.io`.

## Accessibility & performance notes

- `prefers-reduced-motion` respected across animations, smooth scroll, fade-ins, custom cursor
- Custom cursor only initialized on fine-pointer non-touch devices
- Focus-visible rings on all interactive controls
- Semantic landmarks (`<main>`, `<nav aria-label>`, `<section aria-labelledby>`)
- Single `<h1>`, proper heading hierarchy
- JSON-LD `Person` schema, OpenGraph / Twitter Card metadata
- Fonts loaded via `preload` + async stylesheet swap
- GitHub dashboard lazy-loads via IntersectionObserver with rate-limit handling
- Contact form: honeypot, 15s fetch timeout, `role="status"` with `aria-live`

## Contact

- Email: sarveshganesan2002@gmail.com
- LinkedIn: [linkedin.com/in/sarvesh-ganesan09](https://linkedin.com/in/sarvesh-ganesan09)
- GitHub: [github.com/Sarvesh-GanesanW](https://github.com/Sarvesh-GanesanW)
