# you-are-wrong.md

Independent fact-check of the AI Manifesto (`index.html`, plus `CLAUDE.md`, `AGENTS.md`, `RUN_PLAN.md`, `PR_TOUGH.md`) against the current state of Claude Code, AGENTS.md, and the broader agentic CLI ecosystem as of **May 2026**.

This file is organized by severity and category. Where I cite a source, I link it. Where I claim something is "current," I checked it against an official Anthropic doc, the AGENTS.md spec, or the AAIF/Linux Foundation announcement — not blog folklore.

Some of the findings below are problems **I created** when I rewrote your `CLAUDE.md` and `AGENTS.md` in the previous turn. I'm flagging those explicitly. The whole point of this audit is honesty, including about my own work.

---

## Category A — Factually Wrong or Outdated Claims in `index.html`

These are statements that are demonstrably incorrect against current public Anthropic documentation, official announcements, or the standard's published spec. **Fix these.**

### A1. Model lineup is outdated (Section: `tokenlife`, line ~1064)

> "It is **the same Opus 4.6 or Sonnet 4.6 you already use**, with a larger reading window enabled."

**Wrong.** The current flagship is **Opus 4.7**, released April 16, 2026 (per Anthropic's [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) and the [Claude Updates April & May 2026](https://tygartmedia.com/claude-updates-april-2026/) release notes). The current production lineup is:

- **Claude Opus 4.7** — flagship, requires Claude Code v2.1.111+
- **Claude Sonnet 4.6** — daily driver (Feb 17, 2026)
- **Claude Haiku 4.5** — budget option

**Fix:** Replace "Opus 4.6 or Sonnet 4.6" with "Opus 4.7 or Sonnet 4.6" (or "Opus 4.7, Sonnet 4.6, or Haiku 4.5" depending on context). Search index.html for "4.6" and audit every occurrence.

### A2. Internal contradiction about model switching (Section: `starthere`, line 133 vs `practitioner` 15.3, line 1346)

> Line 133: "Pick your model from the dropdown. Note: **you cannot change the model after the session starts.**"
> Line 1346–1347: "**Model Switching Mid-Session** (`/model`)" — "You don't have to pick one model for an entire session."

**Wrong / contradictory.** `/model` works mid-session in the CLI. The Desktop "Code" tab once had this UI limitation but the CLI does not. Per [Claude Code Model Configuration](https://support.claude.com/en/articles/11940350-claude-code-model-configuration), "During a session, you can use `/model <alias|name>` to switch immediately, or run `/model` with no argument to open the picker."

**Fix:** Reword line 133 to "Pick your starting model from the dropdown — you can switch later with `/model`." Make sure 15.3 cross-references this so first-time readers in `starthere` don't carry away the wrong belief.

### A3. AGENTS.md misrepresented in the comparison table (Section: `compare`, lines ~3877–3882)

> Row: "Project Instructions (CLAUDE.md equivalent)" → Codex CLI uses "AGENTS.md", OpenCode uses "AGENTS.md", Gemini CLI uses "GEMINI.md", Claude Code uses "CLAUDE.md".

**Outdated.** As of **December 9, 2025**, OpenAI and Anthropic donated AGENTS.md to the **Linux Foundation's [Agentic AI Foundation (AAIF)](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)**. AGENTS.md is now an open standard adopted by **60,000+ open-source projects** including Amp, Codex, **Cursor, Devin, Factory, Gemini CLI, GitHub Copilot, Jules, and VS Code** ([agents.md](https://agents.md/)). Gemini CLI no longer prefers `GEMINI.md`; it reads AGENTS.md.

Claude Code is the **outlier** — see [anthropics/claude-code issue #6235](https://github.com/anthropics/claude-code/issues/6235) ("Feature Request: Support AGENTS.md"). The community workaround is to add `See @AGENTS.md` inside `CLAUDE.md`.

**Fix:** Update the comparison table to show that AGENTS.md is the cross-tool standard, mark Claude Code's CLAUDE.md as the exception, and add a row noting that AGENTS.md is now a Linux Foundation standard with 60K+ adopters. The current table implies AGENTS.md is "the Codex thing" — that framing is a year out of date.

### A4. Skills column makes Claude Code look uniquely capable when Skills are now an open standard (Section: `compare`, line ~3886)

> "Skills / Instruction Files: Claude Code ✓ SKILL.md in .claude/, Codex CLI ✗, Copilot CLI ✗, OpenCode ✗, Gemini CLI ✗"

**Partially wrong / now stale.** Skills are increasingly an **open standard**. The [Agent Skills](https://agentskills.io) spec is adopted by Claude Code, **OpenAI Codex CLI, Cursor, Gemini CLI, and GitHub Copilot** (per multiple sources surfaced in [Skill Authoring Patterns](https://generativeprogrammer.com/p/skill-authoring-patterns-from-anthropics) and the [Best Open Source Claude Code Skills in 2026](https://blog.buildbetter.ai/best-open-source-skills-for-claude-code-in-2026-complete-guide/)). The format isn't fully identical across tools yet, but the "only Claude has skills" framing is wrong.

**Fix:** Replace the cross-marks with a note that the Skill format is converging across tools, with Claude Code as the most mature implementation. If you want to preserve the table's bite, change the row title to "Skills implementation maturity" and qualify the answer.

### A5. Cursor missing from the comparison table

The `compare` table lists Claude Code, Codex CLI, Copilot CLI, OpenCode, Gemini CLI — but **omits Cursor**, which is a top-2 commercial AI coding tool with its own CLI (`cursor agent`) introduced in 2025. Cursor migrated from `.cursorrules` to `.cursor/rules/*.mdc` and now [recommends migrating to AGENTS.md for cross-tool portability](https://thepromptshelf.dev/blog/cursorrules-to-agents-md-migration-2026/).

**Fix:** Add Cursor as a column (or replace OpenCode, which is much less widely used). Distinguish "IDE-native Cursor" from "`cursor agent` CLI" if you want to be precise.

### A6. "JSON-RPC over stdin/stdout" understates MCP transport options (Section: `mcpdev`)

> "MCP servers are the same: separate local processes exposing tools via the Model Context Protocol (**JSON-RPC over stdin/stdout**)."

**Incomplete.** MCP supports two transports: **stdio** (the original, JSON-RPC over stdin/stdout) and **HTTP+SSE / Streamable HTTP** (for remote servers). The HTTP transport is how hosted MCP servers (Linear, Sentry, Notion, etc.) work — they do not run as a local subprocess.

**Fix:** Note both transports. Something like: "MCP servers expose tools via JSON-RPC. Local MCP servers communicate over stdio; hosted/remote MCP servers communicate over HTTP."

### A7. "Cline" / "Roo" / OpenCode unclear distinction

If you keep OpenCode in the table, note that the community VS Code agent space split into [Cline](https://github.com/cline/cline) (the original) and [Roo Code](https://github.com/RooCodeInc/Roo-Code) (the fork that moves faster). "OpenCode" can mean a couple of different projects. Be specific or remove.

---

## Category B — Missing Major Content (the Tutorial Should Cover)

These are real Claude Code features and standards that are absent or thin in `index.html`. **A 2026 tutorial that does not cover these is incomplete.**

### B1. `CLAUDE.md` `@-imports` are absent

You teach CLAUDE.md but never mention the most important technique for managing it: **`@path/to/file.md` imports**. Per [Anthropic's best practices](https://code.claude.com/docs/en/best-practices) and the broadly-cited community guides:

- `@docs/style-guide.md` — relative path
- `@~/.claude/personal-prefs.md` — user-level absolute reference
- Recursive imports up to **5 levels deep**
- When you `@reference` a file in a prompt, Claude Code **auto-pulls adjacent CLAUDE.md files** from that file's directory and parents (dynamic context priming)

This is the official Anthropic-endorsed answer to "my CLAUDE.md got too long." Right now your tutorial's answer is "move it to a skill" — that's one option, but @-imports are the simpler first step.

**Fix:** Add a section to the `firstsession` or `practitioner` chapter on @-imports. Show concrete examples.

### B2. The 150–200 instruction budget is mentioned but should be louder

You touch on context cost but you do not state Anthropic's explicit guidance: **CLAUDE.md should be under 200 lines, ideally 80–120 lines, because frontier models follow ~150–200 instructions before compliance drops, and Claude Code's own system prompt already consumes ~50 of those.** ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices))

Past 200 lines, compliance measurably drops. Past 500 words of dense rules, adherence collapses.

**Fix:** Promote this finding to a prominent callout in the CLAUDE.md chapter, with a numeric rule of thumb and the citation. This is one of the highest-leverage things readers can learn.

### B3. Plan Mode (Shift+Tab × 2 / `/plan` / ExitPlanMode) is missing

Plan Mode is the default Anthropic-recommended workflow for non-trivial changes ([Plan mode docs](https://code.claude.com/docs/en/permission-modes)). Activate with **Shift+Tab twice** or `/plan`; Claude becomes read-only (Glob, Grep, Read) and produces a plan you approve via the `ExitPlanMode` tool.

Your tutorial covers `RUN_PLAN.md` extensively but never mentions the built-in Plan Mode. Readers will think they have to roll their own — they don't.

**Fix:** Add a `practitioner` section on Plan Mode. Pair it with your `RUN_PLAN.md` discussion (the official Plan Mode is good for quick changes; your RUN_PLAN.md methodology is good for architecturally significant work).

### B4. The 4-phase official workflow (Explore → Plan → Implement → Commit)

Anthropic explicitly recommends a four-phase workflow in their [best practices doc](https://code.claude.com/docs/en/best-practices): **Explore → Plan → Implement → Commit**. The principle: phases 1 and 2 are cheapest in tokens and most valuable in outcome.

Your case studies hint at this but never state it as Anthropic's named workflow.

**Fix:** Add a tab or a callout naming the official 4-phase workflow, then position your RUN_PLAN.md as a deeper version of the Plan phase.

### B5. Missing or under-covered Claude Code commands

| Command | What it does | Currently in tutorial? |
|---|---|---|
| `/init` | Generate starter CLAUDE.md from codebase analysis | Mentioned in passing |
| `/rewind` (or `Esc + Esc`) | Restore conversation OR code state from a checkpoint | **Missing** |
| `/goal` | Set objective-driven autonomous mode (2026) | **Missing** |
| `/sandbox` | OS-level isolation | **Missing** |
| `/batch` | Parallel work across 5–30 worktrees | **Missing** |
| `/btw` | Side question without bloating main context | **Missing** |
| `/doctor` | Diagnose Claude Code configuration | **Missing** |
| `/simplify` | Review code for reuse and quality | **Missing** |
| `/branch` | Fork a session into a new ID | **Missing** |
| `/agents` | List/manage subagents | Mentioned but thin |
| `/memory` | View and edit MEMORY.md / auto memory | Implied but not explicit |
| `/statusline` | Enable real-time context-usage status bar | **Missing** |
| `/keybindings` | Customize keyboard shortcuts | **Missing** |
| `/extra-usage` | Pro users opt into 1M context | Mentioned, correct |

**Fix:** Audit the "Commands Cheat Sheet" against [the official 2026 commands cheat sheet](https://www.scriptbyai.com/claude-code-commands-cheat-sheet/) and add the missing ones.

### B6. Hooks list is incomplete

Your `demystify` section mentions "PreToolUse, PostToolUse, SessionStart" hooks. The actual current list ([Hooks reference](https://code.claude.com/docs/en/hooks)) includes:

- **Session lifecycle:** `SessionStart`, `SessionEnd`
- **Tool execution:** `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`, `PostToolBatch`
- **User interaction:** `UserPromptSubmit`, `Notification`
- **Stopping:** `Stop`, `StopFailure`
- **Subagent lifecycle:** `SubagentStart`, `SubagentStop`
- **Maintenance:** `PreCompact`
- **Async:** `FileChanged`, `ConfigChange`, `CwdChanged`

That's 16 hook events. You currently cover 3. The community guides call this "Complete Guide to All 12 Lifecycle Events" — even the third-party tally is taller than yours.

**Fix:** Expand the hooks reference table.

### B7. Adaptive thinking (effort levels) replaces the old "extended thinking budget"

In February 2026, Anthropic introduced **adaptive thinking** ([Building with extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)). Instead of specifying a token budget (`budget_tokens: 50000`), you specify an **effort level**: `low`, `medium`, `high`, `xhigh`, or `max`. Opus 4.7 added an `xhigh` effort level.

Your `practitioner` chapter on "extended thinking" presents it as a fixed pause; reality is now operator-controlled effort.

**Fix:** Update the extended-thinking section. Add the effort scale.

### B8. AGENTS.md as a standard is barely mentioned

You mention AGENTS.md as a Codex artifact and the casestudy wizard produces one. You don't mention:

- It's now governed by the Linux Foundation's AAIF (Dec 2025)
- 60K+ open-source projects use it
- Anthropic itself is a Platinum AAIF member
- Cursor, Gemini CLI, Copilot, Cline, Aider, Jules, Factory, Devin all read it
- The recommended pattern for cross-tool projects is **AGENTS.md as primary** with **CLAUDE.md** as Claude-specific extensions, or `See @AGENTS.md` inside CLAUDE.md

**Fix:** Add a section on AGENTS.md as the cross-tool standard. Position CLAUDE.md as the Anthropic-specific layer that coexists with AGENTS.md.

### B9. Agent View and Agent Teams (May 2026 features)

[Agent View](https://claude.com/blog/agent-view-in-claude-code) is Anthropic's new dashboard for managing multiple Claude Code sessions in parallel. Agent Teams is an experimental feature where one session acts as a team lead coordinating worker sessions. Both shipped in May 2026.

**Fix:** Either add a "What's new in 2026" tab or fold these into the `remote` / advanced section.

### B10. `CLAUDE.local.md` (personal, gitignored) is missing

Per the official docs, there are THREE levels of CLAUDE.md:

1. `~/.claude/CLAUDE.md` — user-global
2. `./CLAUDE.md` — project, checked in
3. `./CLAUDE.local.md` — project-personal, **gitignored**

You cover (1) and (2); (3) is missing. The personal-overrides file is how individual team members customize without polluting the team file.

**Fix:** Add CLAUDE.local.md to the file-hierarchy table.

### B11. Computer Use / Claude in Chrome extension

[Claude in Chrome](https://claude.com/products/computer-use) extends Claude Code to drive a browser — visual verification, UI testing, web research that bypasses MCP-server setup. Worth a mention in `mcpdev` or `practitioner`.

### B12. "Give Claude a way to verify its work" is the #1 official best practice

Anthropic's official guidance lists "give Claude a way to verify its work" (tests, screenshots, expected outputs) as the **single highest-leverage practice**. Your tutorial covers TDD-with-AI in the case studies but never names this as Anthropic's top guidance.

**Fix:** Surface this as a numbered rule. It is more concrete than most of your discipline rules and it is the explicit advice from Anthropic.

---

## Category C — Things I (Claude) Got Wrong in Your `CLAUDE.md` and `AGENTS.md`

When I rewrote these in the previous turn, I created problems. Honesty requires me to flag them.

### C1. The new `CLAUDE.md` is **way over the recommended length limit**

The current `C:\repos\AIManifesto\CLAUDE.md` I wrote is **~600+ lines**. Anthropic's official guidance is **under 200 lines, ideally 80–120**. Past 200 lines, instruction adherence measurably drops. Past 500 dense words of rules, adherence collapses.

This means: the very file I built to make Claude follow rules better will make Claude follow rules **worse** than a short, focused file would.

**Why this happened:** I synthesized 31 source CLAUDE.md/AGENTS.md files into one "universal core + 12 platform addenda" document. The synthesis is comprehensive but the comprehensiveness is the bug.

**Fix:** Restructure the CLAUDE.md I wrote. Two viable approaches:

1. **Project-scoped CLAUDE.md** (recommended for THIS repo):
   - Keep only the AIManifesto-specific rules (current Section 0 + Section H content).
   - Move the universal core and platform addenda to separate files (e.g., `docs/claude-universal.md`, `docs/platform/wpf.md`).
   - Reference them via `@-imports` only when relevant.
   - Target: **80–120 lines** for CLAUDE.md.

2. **Multi-file with explicit imports**:
   - `CLAUDE.md` (root, short, ~100 lines): project overview + non-negotiable rules + `@docs/agents/universal.md` + `@docs/agents/static-web.md`.
   - `docs/agents/universal.md`: the universal core, ~200 lines.
   - `docs/agents/platforms/<name>.md`: each platform addendum as its own file.
   - When someone is working on, say, the static site, only the root + static-web addendum loads. The WPF addendum stays on disk, costing zero tokens.

Either approach respects the instruction-budget reality. The current monolith does not.

### C2. The new `CLAUDE.md` mixes "this repo's rules" with "rules for other repos"

The platform addenda (WPF, ASP.NET+Mongo, PowerShell, etc.) **do not apply to the AIManifesto repo**. AIManifesto is a static HTML site. The WPF guidance is irrelevant noise that consumes context every message.

This is a category error: CLAUDE.md is supposed to be project-specific. Universal cross-platform guidance belongs in a separately-imported file, or in a different repo that gets cross-referenced.

**Fix:** Either move the addenda out per C1, or accept that this CLAUDE.md is meant as a reference document for OTHER repos to crib from — in which case it shouldn't be the active CLAUDE.md for THIS repo.

### C3. The new `AGENTS.md` does not flag that Claude Code doesn't natively read AGENTS.md

I wrote a slick `AGENTS.md` pointer-style file but did not mention the most important caveat for Anthropic users: **Claude Code does not natively read AGENTS.md** (as of [issue #6235](https://github.com/anthropics/claude-code/issues/6235)). The two ways to bridge:

- Add `See @AGENTS.md` inside CLAUDE.md (community workaround).
- Wait for Anthropic to support it natively (open feature request).

**Fix:** Add a short caveat to AGENTS.md explaining this — and importantly, add `See @AGENTS.md` to the top of CLAUDE.md so Claude actually picks it up.

### C4. No `@-imports` anywhere

Both files I wrote are monolithic prose. Neither uses `@-imports`. This is the most easily-fixed structural issue.

**Fix:** When applying C1 + C2 + C3, replace inline prose with `@-imports` to the appropriate split files.

### C5. The "Refactor Completion" and "Forward-only" rules conflict with practical reality in some sections

Your forward-only and refactor-completion rules are good — but they conflict with section H (static web), where the AIManifesto site is intentionally backward-compatible (must serve old browsers, can't break existing anchors). The synthesized CLAUDE.md doesn't acknowledge that universal rules sometimes have to bend for a specific project.

**Fix:** Add a "When Universal Rules Don't Apply" caveat, or scope rules to the relevant platforms. The static-site addendum should say "forward-only architecture is relaxed for end-user URLs and anchors — those are part of an external contract."

---

## Category D — New 2026 Practices the Manifesto Should Adopt or Teach

These are practices that have emerged in late 2025 / early 2026 that are now consensus best-practice. Some are in your docs already; the ones below aren't.

### D1. Use the **Agent Skills open standard**, not Claude-only SKILL.md framing

[Agent Skills](https://agentskills.io) is now a cross-tool standard adopted by Claude Code, Codex CLI, Cursor, Gemini CLI, and Copilot. Your `makeplugin` chapter could note that the skill you write today probably works in other tools tomorrow.

### D2. Skills with **paths-scoped invocation** (`paths:` frontmatter)

Modern skills support `paths: ["src/api/**/*.ts"]` in frontmatter — the skill only loads when Claude is working on files matching that glob. This is the "loaded on demand" promise made fully literal.

### D3. **Dynamic context injection** in skills

Skills support `` !`command` `` (inline) and triple-backtick `!` code blocks to run a command at skill-load time and inject the output. Example: `` !`git status --short` `` injects the current git state. This is how skills like "release-notes" get real-time data without bloating CLAUDE.md.

### D4. **Subagent isolation as a context-management technique**

The 2026 consensus is: **use subagents not just for parallelism but for context hygiene.** A long-running research task in a subagent does NOT pollute the parent context. Your existing "subagents" chapter covers spawning but should explicitly position this as "the cleanest way to keep your main session uncompacted."

### D5. **Prompt caching breakpoints** (paid API users)

If a reader uses the SDK / API directly, prompt caching with explicit breakpoints can make 1M-context sessions cost-feasible. Workspace-level isolation as of Feb 5, 2026. Worth a paragraph in the `pricing` chapter.

### D6. **The control stack pattern**

Per multiple 2026 best-practice guides: "the coding-agent workflow is maturing past giant hand-written prompts. The winning pattern in 2026 is a **control stack**: project rules + reusable skills + bounded sub-agents + deterministic tools around the model." Your manifesto is teaching this implicitly; saying it explicitly is the framing readers need.

### D7. **Verify with tests, screenshots, or expected outputs** (Anthropic's #1 lever)

Already flagged in B12. Worth adopting as a manifesto rule with a name (something like "Verifiability Imperative").

### D8. **Plan editing with Ctrl+G**

In Plan Mode, **Ctrl+G** opens the proposed plan in your `$EDITOR` so you can rewrite it before executing. Mention in the Plan Mode coverage from B3.

---

## Category E — Ecosystem Drift Since the Site Was Last Updated

The casual references in the site are mostly accurate to late 2025 / early 2026, but a few items have moved.

### E1. **`.cursorrules` is officially deprecated**

Cursor's official position ([Rules docs](https://cursor.com/docs/rules)): `.cursorrules` is supported but deprecated. New work should use `.cursor/rules/*.mdc` (project-scoped, glob-scoped) or AGENTS.md. Agent mode in Cursor **does not load `.cursorrules` at all** ([dev.to article](https://dev.to/nedcodes/cursor-agent-mode-ignores-cursorrules-use-mdc-instead-5flb)).

If your comparison table mentions `.cursorrules`, update it.

### E2. **OpenAI Codex CLI** is a real product, not just a name from history

Codex CLI is currently `codex` on npm. It defaults to AGENTS.md. Worth its own row in the comparison.

### E3. **Gemini CLI** preferentially reads AGENTS.md now

The Gemini CLI in 2026 reads AGENTS.md first, falling back to GEMINI.md for backward compatibility. Update the comparison row.

### E4. **OpenHands** (formerly OpenDevin) is the open-source autonomous coding agent the comparison should probably reference

If you want one open-source agent in the comparison, OpenHands is the active project. OpenCode (the one in your table) is a less-active name; clarify or replace.

### E5. **Devin** is now a real commercial agent — the comparison ignores it

Devin (Cognition Labs) ships, has a Slack integration, and a Linux Foundation seat. If your comparison's pitch is "the major players," Devin should be on the list. **Note: Devin 2.0 dropped its price from $500/mo to $20/mo (priced ~$2.25 per ACU, ~15 min of work).** If the site mentions Devin pricing anywhere, it's almost certainly stale.

### E6. **Roo Code is shutting down on May 15, 2026**

The Cline fork that some 2025 tutorials still recommended is being wound down. Roo Code's products (Extension, Cloud, Router) all sunset May 15, 2026; users are being redirected to Cline or roomote.dev. **Do not recommend Roo Code as a going concern.** If it's mentioned in the comparison or case studies, mark it as discontinued.

### E7. **Cursor has its own frontier model now (Composer)**

Cursor shipped **Composer** in October 2025 — their own model, ~4× faster than peer models, trained for short-turn tool calls. The old framing "Cursor uses Claude/GPT under the hood" is now incomplete. They still allow BYO model, but the default is their own model.

### E8. **GitHub Copilot agent mode is GA in JetBrains as of March 2026**

If the manifesto's earlier draft was written when Copilot agent mode was VS Code–only, that's no longer true. Visual Studio is still preview but JetBrains is GA. **Copilot CLI agent** also shipped May 2026.

### E9. **OpenHands** is the open-source agent worth knowing about

72% on SWE-Bench Verified with Claude Sonnet 4.5 extended thinking — highest of any open-source agent framework in 2026. Every session runs in an isolated Docker container. v1.6.0 added Kubernetes support and Planning Mode beta. If you want one open-source agent in the comparison table, this is the one.

### E10. **A2A (Agent2Agent) protocol** is the second standardized agent protocol you should know about

Originated by Google, now open-source under the Linux Foundation. Three primitives: **Agent Cards** (capability advertisement), **Tasks** (work structure), transport over HTTP / SSE / JSON-RPC 2.0. **150+ organizations in production** as of April 2026 (Google, Microsoft, AWS, Salesforce, SAP, ServiceNow, Workday, IBM). Spec at [a2a-protocol.org](https://a2a-protocol.org/latest/specification/).

The manifesto teaches MCP (tool-call protocol). A2A is the agent-to-agent protocol that sits one level higher. Worth a short mention in `mcpdev` or the glossary.

### E11. **OpenAI Codex `/goal`** is a built-in Ralph Loop

Worth noting because your case studies discuss the Ralph Loop pattern as a hand-rolled technique. Codex shipped it as a first-class command in 2026. The pattern is going mainstream; your tutorial should acknowledge that.

### E12. **Spec-driven development (SDD) consolidation**

In 2026, every major tool has shipped some form of SDD: **GitHub Spec Kit** (93k+ stars, v0.8.7), **AWS Kiro** (VS Code/Code OSS fork), **OpenSpec**, **BMAD**, **Tessl**, **Google Antigravity**. Standard artifacts converging on: `spec.md`, `plan.md`, `tasks.md`, `constitution.md`, `contracts/`, `research.md`.

Your `RUN_PLAN.md` methodology is in the same neighborhood as SDD. Consider naming the SDD comparison so readers know where your methodology sits in the landscape.

### E13. **The "core trio" of 2026 Claude Code workflow**

The current consensus from multiple guides ([Plan Mode 2026 guide](https://www.anyonebuilds.com/guides/claude-code-plan-mode), [ClaudeLog](https://claudelog.com/mechanics/plan-mode/)): **Plan Mode + git worktrees + subagents** is the trio. If your `practitioner` section is a tour of "what to actually do," this trio should be the headline.

### E14. **Subagent best practice has converged**

Anthropic, OpenAI, Cognition, Microsoft Agent Framework, and LangChain have all converged on the same pattern: **single orchestrator owns the conversation; ephemeral isolated subagents return only compressed summaries**. The orchestrator manages dependencies manually — no peer messaging between subagents, no shared task list. Worth saying explicitly because it tells readers when subagents help (parallel read-heavy work) vs hurt (sequential, shared-state work).

If 60%+ of an agent's tokens go to search/retrieval, parallelizing search via subagents cuts total task time 30–40%.

---

## Category F — Small Polish (Worth a Pass)

Lower priority than A–E.

- **`tokenlife` chapter, KV-cache math:** Your "~0.5 MB per token" estimate is reasonable but should cite a public source (it's currently presented as authoritative). The H200 / GPU pricing table will date quickly — consider linking to an external reference instead.
- **The `compare` snapshot date says "March 2026"** but you cite Feb 25, 2026 features and the manifesto is being edited in May 2026. Bump the snapshot date.
- **`/extra-usage`** — correctly described; nothing to fix.
- **JSONL session storage** — correct.
- **"Memory files" framing** — accurate but slightly outdated. Now there's also auto-loaded `MEMORY.md` (top 200 lines / 25KB) at session start. Distinguish.
- **The `glossary` should add:** AAIF, Agent Skills, Plan Mode, Adaptive Thinking, Agent View, Agent Teams, AGENTS.md (as a Linux Foundation standard, not just "Codex's CLAUDE.md").
- **Hook event names in the glossary** are incomplete (see B6).

---

## Category G — Things You Got Right That Are Worth Keeping

To be balanced: these are things I went to verify expecting to find an error and didn't.

- **Pricing math** (`$3/$15` Sonnet, `$15/$75` Opus, `$1/$5` Haiku) is current as of May 2026.
- **"Lost in the middle" caveat at large contexts** — real, well-documented, fairly stated.
- **GPU VRAM / KV-cache explanation** — pedagogically right, even if specific MB-per-token numbers are estimates.
- **Plugin language polyglot framing** — correct; plugins are markdown + JSON + any executable.
- **Remote Control / `/rc`** — accurate to the Feb 2026 release.
- **`.jsonl` session storage at `~/.claude/projects/`** — correct.
- **`--resume` / `--continue`** — correct.
- **The makeplugin JIRA integration walk-through** — technically solid; tokens never leave the local machine, the meta-skill pattern is accurately described, plugin vs MCP distinction is right.
- **The `confession` chapter's narrative arc** — your strongest content; don't water it down trying to add features.

---

## Recommended Order of Fixes

If you only do five things:

1. **C1** — Split the giant CLAUDE.md I created into a short root file + `@-imports`. This is the highest-leverage fix because the file actively undermines its own purpose.
2. **A1** — Update model names to Opus 4.7 / Sonnet 4.6 / Haiku 4.5 everywhere in index.html.
3. **A3 + B8** — Reframe AGENTS.md as the Linux Foundation cross-tool standard, not "Codex's file." Update the comparison table.
4. **B1** — Add `@-imports` coverage to the CLAUDE.md chapter. This is the missing technique that unlocks everything else.
5. **B2** — Promote the 150–200 instruction budget to a prominent rule.

The rest is incremental improvement. Items in Category G show you've already done the hard reasoning right; the gaps are mostly "more features have shipped since this was written."

---

## Sources (in addition to those linked inline)

- [Best practices for Claude Code — Anthropic](https://code.claude.com/docs/en/best-practices)
- [How Claude Code works — Anthropic](https://code.claude.com/docs/en/how-claude-code-works)
- [Hooks reference — Anthropic](https://code.claude.com/docs/en/hooks)
- [Extend Claude with skills — Anthropic](https://code.claude.com/docs/en/skills)
- [Model configuration — Anthropic](https://code.claude.com/docs/en/model-config)
- [Choose a permission mode — Anthropic](https://code.claude.com/docs/en/permission-modes)
- [AGENTS.md spec](https://agents.md/)
- [Linux Foundation Agentic AI Foundation announcement](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
- [OpenAI and Anthropic Donate AGENTS.md and MCP to AAIF (InfoQ)](https://www.infoq.com/news/2025/12/agentic-ai-foundation/)
- [Claude Code issue #6235 — AGENTS.md feature request](https://github.com/anthropics/claude-code/issues/6235)
- [Cursor Rules documentation](https://cursor.com/docs/rules)
- [Claude Code Commands Cheat Sheet (2026)](https://www.scriptbyai.com/claude-code-commands-cheat-sheet/)
- [Claude Updates April & May 2026 — Tygart Media](https://tygartmedia.com/claude-updates-april-2026/)
- [How large is the context window on paid Claude plans? — Anthropic Help Center](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans)
- [Building with extended thinking — Anthropic API docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Prompt caching — Anthropic API docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Claude Code Plan Mode Complete Guide 2026](https://www.anyonebuilds.com/guides/claude-code-plan-mode)
