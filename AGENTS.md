# AGENTS.md

Project guidance, architectural rules, and execution discipline live in [`CLAUDE.md`](CLAUDE.md).

## Architecture Summary

Three files make up the entire site:
- `index.html` -- all content, quiz data arrays, HTML structure
- `app.js` -- runtime logic only (tab switching, quiz engine, search, glossary)
- `style.css` -- all styling via CSS custom properties

## Development Guardrails

1. Do not put content in `app.js` or runtime logic inline in `index.html` (quiz data arrays are the exception).
2. Do not manually create `<span class="tt">` tags -- the tooltip system generates them automatically from `glossaryTerms`.
3. Do not hand-roll tab switching, quiz rendering, or glossary back-links -- use existing helpers in `app.js`.
4. Do not add build steps, npm dependencies, or server requirements. This is a zero-dependency static site.
5. Do not commit or push without explicit user permission.
