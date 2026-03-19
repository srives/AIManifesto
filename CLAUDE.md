# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static single-page tutorial and quiz website about Claude Code, deployed to GitHub Pages at https://srives.github.io/AIManifesto/. No build step, no server, no npm, no dependencies.

## Running Locally

```
start index.html
```

Or open `index.html` directly in any browser. That's it.

## Architecture

Three files make up the entire site:

- **`index.html`** (~355KB) — All content lives here: every tab panel, all quiz questions as inline JS arrays, all HTML structure. This is the dominant file and where most edits happen.
- **`app.js`** — Runtime logic only: tab switching, quiz engine, search (highlight-in-page), hamburger nav, glossary back-links.
- **`style.css`** — All styling. Uses CSS custom properties (`--bg-primary`, `--accent-blue`, etc.) defined in `:root`.

### Tab System

Each tab is a `<section id="tabname" class="tab-panel">` in `index.html`. Tabs are activated via `.active` class toggled by `switchTab()` in `app.js`. The primary nav bar is hardcoded in the `<nav class="tab-bar">`, and secondary tabs are in the hamburger drawer.

### Quiz System

Quizzes are defined as JS arrays inside `index.html` (not in `app.js`). Each array entry has `{ question, choices[], answer, explanation }` where `answer` is the 0-based index of the correct choice. The `initQuiz(prefix, questions)` function in `app.js` renders and wires up each quiz by DOM id prefix (e.g., `initQuiz('shorter', shorterQuestions)` looks for `#shorter-questions`, `#shorter-score`, etc.).

To add a new quiz tab:
1. Add the question array in `index.html`
2. Add a `<section id="newtab" class="tab-panel">` with the required score/progress/questions elements
3. Add a `<button class="tab-btn" data-tab="newtab">` in the nav
4. Call `initQuiz('newtab', newQuestions)` in the `DOMContentLoaded` handler in `app.js`

### Tooltip / Hover-over System

Term hover-overs are **generated automatically at runtime** from the `glossaryTerms` object (near the bottom of `index.html`). You never manually add `<span class="tt">` tags — the JS `initTooltips()` function walks the DOM of every tab panel (skipping `CODE`, `PRE`, headers, `A`, `BUTTON`, and the glossary section itself) and wraps matching text nodes automatically.

The `.tt` style is a dashed underline (`border-bottom: 1px dashed`) with `cursor: help`. On hover, a floating popup shows the term name and its definition.

### Adding a Glossary Entry

When adding a new term to the glossary, do all three steps:

1. **Add to `glossaryTerms`** — find the `const glossaryTerms = {` object near the bottom of `index.html` and add:
   ```js
   'TermName': 'Short definition shown in the hover popup.',
   ```
   This alone causes hover-overs to appear on every occurrence of that term in the document body (except headers, code blocks, and the glossary section).

2. **Add a glossary table row** — in the `#glossary` section, add a `<tr>` following the existing pattern:
   ```html
   <tr><td>TermName</td><td>Full definition here. <a class="gloss-link" data-tab="tabid" data-anchor="anchorid" href="#">→ Chapter X</a></td></tr>
   ```
   The `.gloss-link` must point to a specific anchor where the term is **actually used** in the document body — not just a chapter heading. The CSS rule `#glossary tr:has(.gloss-link) td:first-child` automatically applies the same dashed-underline style to the term cell, making it visually consistent with `.tt` spans in the body.

3. **Find the link target** — search `index.html` for an existing `id=` anchor near a real usage of the term, and use that as `data-anchor`. If no suitable anchor exists, add one (`<span id="anchor-termname"></span>`) adjacent to a usage.

The visual convention is: dashed underline = "this term has a glossary entry." In the body, hovering shows the definition popup. In the glossary table, the term cell is a clickable link back to a usage in the document.

### Deployment

Pushing to `master` auto-deploys via GitHub Pages. The live site reflects `index.html` at the repo root.
