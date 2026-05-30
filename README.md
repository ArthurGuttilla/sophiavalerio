# Sophia Valerio — Personal Website (Phase 1)

A minimalist, editorial personal-brand site built around the idea of authorship —
*your content needs your signature*. Phase 1 ships the landing / splash screen.

See [`PRD.md`](./PRD.md) for the full product requirements.

## Stack

Zero-dependency static site — plain HTML, CSS, and vanilla JS. No build step,
no framework, minimal payload. Chosen for fast load and turnkey GitHub Pages hosting.

## Structure

```
index.html          Landing / splash (name + Start)
home/index.html     /home placeholder route (future scope)
assets/styles.css   Design tokens + styles
assets/main.js      Composed fade-out transition (progressive enhancement)
.nojekyll           Serve files as-is on GitHub Pages
.github/workflows/  GitHub Pages deploy workflow
```

## Local preview

Any static server works, e.g.:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

All paths are **relative**, so the site works whether it's served from a user
domain or a project subpath (`https://<user>.github.io/sophiavalerio/`).

**Option A — GitHub Actions (recommended):** the included
`.github/workflows/deploy.yml` deploys on every push to `main`. In the repo,
go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.

**Option B — Deploy from a branch:** **Settings → Pages → Source: Deploy from a
branch**, pick the branch and `/ (root)`. The `.nojekyll` file ensures files are
served as-is.

## Accessibility & performance

- WCAG AA contrast, semantic `<h1>`, keyboard-focusable Start link with visible focus.
- Full `prefers-reduced-motion` support (animations reduce to opacity / none).
- Works without JavaScript — the Start link navigates directly.
