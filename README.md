# Sarvesh Ganesan — Portfolio

Personal portfolio site for Sarvesh Ganesan, Lead AI Architect.

Live: **https://sarvesh-ganesanw.github.io/sarvesh-portfolio/**

## The design

The site is a drawing set: six sheets on cyanotype-blue ground, with a title block on the right that
doubles as the navigation.

1. **Platform overview** — the name, four general notes (the headline numbers) and an elevation of
   the Groundzero platform that draws itself in once on load. Its circled callouts link to the
   detail drawings.
2. **Groundzero details** — six detail drawings (AI analyst, hybrid retrieval, Iceberg lakehouse,
   cost ledger, ontology and lineage, headroom-scaler), each a small schematic with a short note.
3. **Tea commerce platform** — a floor plan of the storefront, wholesale portal and back office over
   one backend.
4. **gz** — the data platform CLI in Rust.
5. **Notes** — a register of blog posts on the
   [blog](https://sarvesh-ganesanw.github.io/sarvesh-blog/).
6. **Contact**.

Rules the styles hold to: spacing on a 4 px grid, one 1 px UI border width (the 2 px focus ring is
the only other), Archivo as the only typeface, and signal yellow only for the current sheet,
keyboard focus and the one primary action. UI motion is transform or opacity, under 300 ms,
ease-out; the elevation's draw-in is the single first-run moment, and `prefers-reduced-motion` shows
the finished drawing.

## Stack

Static site: hand-written HTML + CSS + vanilla JavaScript. No build step.

- `index.html` — the drawing set
- `style.css` — single stylesheet; tokens for ground, lines, spacing and type sit on `:root`
- `script.js` — the draw-in, the current-sheet marker in the title block, and the "Issued for"
  switch
- `404.html` — a sheet that is not in the set, with a link home
- `Sarvesh_Resume.tex` — resume source; `Sarvesh_Resume.pdf` is built from it
- `Sarvesh_Resume_AI.pdf`, `_Data.pdf`, `_Infra.pdf` — the same resume with the most relevant
  bullets and projects first, served by the "Issued for" switch
- `og-image.png`, `favicon.svg` — social preview and browser identity
- `sitemap.xml`, `robots.txt` — search engine hints

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

The bullet and project order for each version lives in `scripts/build_resume.py`. The page follows
it through `data-order` attributes in `index.html`: each detail drawing on sheet 2 takes the rank of
its first resume bullet, and the tea and gz sheets take the rank of their first project.

## "Issued for" links

The title block's "Issued for" switch (Everything, AI engineering, Data platform, Infrastructure)
reorders the detail drawings and the project sheets, renumbers them, and swaps the resume behind the
download button. `?for=ai`, `?for=data` or `?for=infra` opens the page already issued for that kind
of role, e.g. `https://sarvesh-ganesanw.github.io/sarvesh-portfolio/?for=ai`.

## Deploy

Pushed to `main` → GitHub Pages publishes automatically at the repository's GitHub Pages URL.

## Accessibility

- Real links and buttons; the "Issued for" options are buttons with `aria-pressed`
- 44 px hit areas on the index, the switch, buttons and the drawing callouts
- Visible focus ring on every interactive element
- Every drawing has a text description (`role="img"` with a label or title and description)
- Semantic landmarks, one `<h1>`, sheets as `<section aria-labelledby>`
- Works at 390 px wide with no horizontal page scroll; the elevation pans inside its own frame
- JSON-LD `Person` schema, Open Graph and Twitter Card metadata

## Contact

- Email: sarveshganesan2002@gmail.com
- LinkedIn: [linkedin.com/in/sarvesh-ganesan09](https://linkedin.com/in/sarvesh-ganesan09)
- GitHub: [github.com/Sarvesh-GanesanW](https://github.com/Sarvesh-GanesanW)
