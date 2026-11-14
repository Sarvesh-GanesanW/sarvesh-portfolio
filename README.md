# Sarvesh Ganesan — Portfolio

Personal portfolio site for Sarvesh Ganesan, Lead AI Architect.

Live: **https://sarvesh-ganesanw.github.io/sarvesh-portfolio/**

## Stack

Static site: hand-written HTML + CSS + vanilla JavaScript. No build step.

- `index.html` — landing page
- `style.css` — single stylesheet, CSS custom properties drive light/dark themes
- `script.js` — theme toggle, mobile navigation, animations, contact form, and date-based experience
  counter
- `Sarvesh_Resume.tex` — resume source; `Sarvesh_Resume.pdf` is built from it
- `Sarvesh_Resume_AI.pdf`, `_Data.pdf`, `_Infra.pdf` — the same resume with the most relevant
  bullets and projects first, served by the "Hiring for" switch
- `og-image.png`, `favicon.svg` — social preview and browser identity
- `sitemap.xml`, `robots.txt`, `404.html` — SEO and UX infrastructure

## Local dev

```bash
npm install
npm run serve        # http://localhost:8080
npm run lint         # html + css + js
npm run format       # prettier
```

## Resume

```bash
brew install tectonic
python3 scripts/build_resume.py   # rebuilds all four PDFs; fails if any runs past one page
```

The bullet and project order for each version lives in `scripts/build_resume.py` and matches the
`data-order` attributes in `index.html`.

## Hiring-for links

`?for=ai`, `?for=data` or `?for=infra` opens the page already filtered for that kind of role, with
the matching resume behind the download button, e.g.
`https://sarvesh-ganesanw.github.io/sarvesh-portfolio/?for=ai`.

## Deploy

Pushed to `main` → GitHub Pages publishes automatically at the repository's GitHub Pages URL.

## Accessibility & performance notes

- `prefers-reduced-motion` respected across animations, smooth scroll, fade-ins, custom cursor
- Custom cursor only initialized on fine-pointer non-touch devices
- Focus-visible rings on all interactive controls
- Semantic landmarks (`<main>`, `<nav aria-label>`, `<section aria-labelledby>`)
- Single `<h1>`, proper heading hierarchy
- JSON-LD `Person` schema, OpenGraph / Twitter Card metadata
- Fonts loaded via `preload` + async stylesheet swap
- Featured projects are static, verified case studies with no API-rate-limit dependency
- Contact form: honeypot, 15s fetch timeout, `role="status"` with `aria-live`

## Contact

- Email: sarveshganesan2002@gmail.com
- LinkedIn: [linkedin.com/in/sarvesh-ganesan09](https://linkedin.com/in/sarvesh-ganesan09)
- GitHub: [github.com/Sarvesh-GanesanW](https://github.com/Sarvesh-GanesanW)
