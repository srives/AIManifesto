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

### Collaboration

When the user asks a question, answer it. Do not treat a question as a command to act. Wait for an explicit instruction before making changes.

### Deployment

Pushing to `master` auto-deploys via GitHub Pages. The live site reflects `index.html` at the repo root.

---

## Git Operations Require User Approval

**NEVER commit, push, amend, or force-push without explicit user permission.**

- `git commit` -- Ask first, always
- `git push` -- Ask first, always
- `git rebase`, `git reset`, `git checkout` -- Ask first, always
- `--force` or `--force-with-lease` -- Ask first, always
- Destructive operations -- Ask first, always

The user controls when code is committed. Your job is to build, test, and prepare code for the user to approve.

## Forward-Only Architecture Rule

- Never try to stay backward compatible
- Always forward, never backward
- Prioritize pure architecture over patches
- Prefer clean contracts and interfaces over function hacks, shims, and compatibility layers
- When a legacy pattern blocks a cleaner design, remove it instead of preserving it

## Search Before You Write

Before writing any new pattern, helper, or shared logic -- search the codebase first. If a function or pattern exists that does what you need, use it. Do not write new inline code until you have confirmed no existing code handles it.

In this repo specifically: check `app.js` for existing runtime helpers before adding new ones. Check `style.css` for existing custom properties before adding new ones.

## Context Compression Recovery

When the conversation context is compressed (messages are summarized to free up space):

1. **Re-read the active plan.** If a `RUN_PLAN.md`, `PLAN*.md`, or similar plan file is driving the current work, re-read it immediately after compression to restore awareness of remaining steps, current phase, and completion criteria.
2. **Re-read `CLAUDE.md`.** Architectural rules and guardrails may have been lost in compression. Re-read this file to restore them.
3. **Check task state.** If tasks were being tracked, review them to understand what has been completed and what remains.

Do not continue executing a plan from memory alone after compression -- always re-ground from the source files.

## Checkpoint Discipline

When working on multi-step tasks, create checkpoints so that work is not lost if the context is compressed or the session ends:

- **Before compression is likely** (long-running tasks, large diffs accumulating): ask the user if they want to commit current progress as a checkpoint.
- **At natural milestones** (a phase of a plan completes, a feature is working but not yet polished): surface the milestone and suggest a checkpoint commit.
- **When switching between plan phases**: suggest committing the completed phase before starting the next.

Checkpoints should be real git commits with descriptive messages, not just saved files. This ensures work can be recovered from any point.

## Session Continuity Memories

When working on a multi-session task (a plan that spans multiple conversations), proactively save progress memories so the next session can pick up where this one left off:

- **What was completed** -- which plan phases or steps are done
- **What is in progress** -- current step, any partial work, blockers encountered
- **Key decisions made** -- architectural choices, trade-offs decided during implementation
- **What to do next** -- the immediate next step when work resumes

Save these as memory files (e.g., `progress_planname.md`) in the memory directory. Update them as work progresses rather than only at the end.

## Long Session Context Management

Long AI sessions fill context windows. When that happens, the AI loses track of earlier decisions, earlier code changes, and earlier test results. This causes sloppy edits, repeated work, and silent regressions.

Rules for long sessions:

1. **Create numbered handoff files as context fills.**
   When context is getting long, write a `<N>.md` file (1.md, 2.md, 3.md, etc.) in the memory directory that captures:
   - what was done since the last handoff
   - what is still remaining
   - any files modified
   - any decisions made that a future context needs to know

2. **Do local commits at each handoff point.**
   Commit the current working state (with user approval) so there is a clean baseline to diff against. Use descriptive commit messages that summarize the work batch.

3. **Reference earlier handoff files when needed.**
   If a later decision depends on an earlier one, re-read the relevant handoff file instead of guessing from memory.

4. **Do not let context pressure cause shortcuts.**
   Running out of context is not an excuse to skip hard items, defer work to "help me" files, or stop validating. If context is full, checkpoint and continue -- do not silently downgrade the remaining work.

## Plan Obedience Rule

When the user gives you a plan, the plan controls the work.

- Do not change the scope of work because some items look harder, easier, slower, or less interesting.
- Do not reorder the plan for convenience or preference.
- You may change the order only when later work is a real prerequisite for an earlier planned item, and you must say so explicitly.
- You must do the whole plan: all phases, all sub-plans, all sections, and all named work unless the user explicitly narrows scope.
- You are not allowed to "bank progress" by doing the easy parts and leaving the hard parts for later while still presenting the plan as substantially done.
- You are not allowed to silently cut work because it feels too hard, too big, too risky, or too tedious. If something truly cannot be done, report it as a blocker against the plan; do not redefine the plan.

## Plan Execution Discipline

When executing a multi-file implementation plan:

### Preflight (Before Any Code Changes)

1. Restate the task: requested outcome, scope, non-goals, assumptions.
2. Read the actual source files the plan names. Confirm the code still matches the plan. If a function moved, changed shape, or was already partially fixed, say so before proceeding.
3. Identify the owner and seam -- name the canonical file or function that owns the behavior. In this repo: content in `index.html`, runtime in `app.js`, styling in `style.css`.
4. Identify the blast radius -- for every function you will modify, find every caller. If the contract changes, all callers are in scope for validation.
5. State the execution order before coding.

### Implementation (One Bounded Change At A Time)

For each change:
- Re-read the function or section you are about to modify before editing.
- Re-read its callers if you are changing its contract.
- Change the minimum necessary for this item.
- Do not duplicate helpers or create a second version of an existing utility.
- Do not refactor surrounding code unless directly required for correctness or safety.
- State what changed, in what file and function, and what the behavioral difference is.
- Do not move to the next item until this one is internally consistent.

### Validation

1. Verify the change works in a browser (or state what manual validation is needed).
2. Re-check callers and regressions -- grep for every modified function and confirm callers are still correct.
3. State manual validation truthfully -- what was and was not validated.

### Self-Review

Before declaring done, review your changes against these defect classes:
- Architecture and namespace drift -- did you put content in `app.js` or runtime logic in `index.html`?
- Data shape drift -- did you strip fields when mutating objects, or create fallback chains?
- Pipeline and error propagation -- can errors escape or cause secondary failures?
- Safety and destructive operations -- did any read path gain hidden cleanup?

## Architectural Work: Mandatory Constraint Extraction

For any architectural task involving RUN_PLAN.md, design docs, or authority changes:

1. You must write your constraint extraction to a file: `.constraint-extraction.md`
2. I review that file and confirm it's complete
3. I explicitly say "constraints approved, proceed to code"
4. Only then do you write code
5. If you attempt to write code without `.constraint-extraction.md` being reviewed and approved, I reject the commit and point you back to the file

This is not optional. No constraint file = no code.

The enforcement is on my end: I see the file, I review it, I only approve after checking it. That's sufficient because you can't skip it without me noticing, and I block the next step until it's done.

This works because the gate is structural, not behavioral. It doesn't rely on self-regulating. It relies on me refusing to proceed until the artifact exists and is correct.

## Refactor Completion Rules

These rules exist because AI sessions repeatedly accept "new path added" as progress while old code paths are still active.

1. **A refactor is not done when both paths still ship.** Adding the new path is only the first half. The old path must be removed from runtime, or the work remains incomplete.
2. **Every rewrite must include an excision inventory.** Before coding, list the old helpers, runtime paths, and docs that exist only because the old architecture still exists. For each: delete now, replace now, quarantine temporarily, or not in scope.
3. **Compatibility is opt-in, not the default.** Do not preserve backward compatibility unless the user explicitly asks. Prefer deletion over migration ballast.
4. **Done means grep-clean at the architectural seam.** Before declaring a refactor done, search for the retired names. If they still participate in live runtime behavior, the refactor is not done.

## Stop Conditions

Stop and surface the issue instead of improvising if:
- The plan no longer matches the code in a material way
- The correct owner or seam is unclear
- The change requires guessing about identity or ownership
- The only path forward is destructive cleanup on weak evidence
- Validation cannot establish that the change is safe
- The requested change conflicts with architectural rules in this file

When blocked, explain the minimum missing fact or decision. Do not hide uncertainty behind confident wording.

## Tough PR Review Framework

When reviewing changes (self-review or PR review), check these categories in priority order:

1. **Architecture and Namespace Drift (Critical)** -- Does new code violate the three-file architecture? Does content logic leak into `app.js`? Does runtime logic appear inline in `index.html` outside of quiz data arrays?
2. **Helper and Pattern Drift (High)** -- Does new code bypass existing helpers (e.g., hand-rolling tab switching instead of using `switchTab()`, manually creating tooltips instead of using `initTooltips()`)? Does it duplicate an existing CSS custom property?
3. **Safety and Destructive Operations (Medium)** -- Does any cleanup path silently delete artifacts when ownership is uncertain? Does any destructive operation lack a confirmation guard?
4. **Documentation and Comment Truthfulness (Medium)** -- Do docs or comments claim cleanup is finished when the code still violates the boundary?

### Output Format For Reviews

- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Category:** (from above)
- **File:Line:** exact location
- **What:** what is wrong
- **Why it matters:** what breaks
- **Fix:** the smallest credible fix

Rate the diff on a 1-5 architectural drift scale:
1. Actively makes architecture worse
2. Preserves old failure modes
3. Neutral or mixed
4. Respects intended boundaries
5. Actively moves toward target architecture

## Common AI Failure Modes To Watch For

AI sessions executing plans fail in repeatable ways. Be vigilant against:

1. The plan is stale and the AI patches the wrong seam.
2. The plan names the function but not the callers, so the blast radius is missed.
3. The AI creates a new helper instead of using the one that already exists.
4. The AI mutates an object by rebuilding a subset of fields and strips identity or metadata.
5. The AI updates the code but not the tests, or rewrites tests to rubber-stamp new behavior.
6. The AI fixes the symptom but not the root cause.
7. The AI says "done" without proving the change.
8. The AI counts "new path added" as completion while old runtime paths still ship.
9. The AI hides uncertainty behind confident wording instead of surfacing blockers.
