# PR_TOUGH.md

A tough architectural PR review framework. Use this prompt when you need a code review that enforces your documented architecture, not just local code correctness.

Before using this: You must have an AGENTS.md or CLAUDE.md that describes your architecture. This framework reviews code against *that* documented architecture, not against general best practices.

## Full Prompt Template

```text
Conduct a tough architectural PR review of the current working tree. Your goal is to 
catch the subtle defects where code drifts from documented architecture while claiming 
to follow it.

Read AGENTS.md (or CLAUDE.md) first. Do not depend on outdated planning docs or 
deleted design files. Use AGENTS.md/CLAUDE.md, current test seams, current file headers, 
and the code as it exists on disk as law. Then read the diff.

Do not trust comments, release notes, refactor claims, or file moves by themselves. 
Verify the architecture in code, tests, manifests, and docs.

Before writing findings, do a targeted drift search for the specific architecture 
violations your project is vulnerable to. For example:
- Bypassed helper functions (search for hand-rolled versions of existing helpers)
- Cross-namespace coupling (search for imports that violate documented boundaries)
- Canonical authority violations (search for multiple sources of truth for the same data)
- Cache/projection treated as authoritative (search for cache lookups in business logic)
- Mutable presentation state treated as identity (search for display names used as keys)
- Old architectural patterns preserved under new names (search for comments claiming 
  cleanup that the code doesn't actually do)

You are looking for nine categories of defect, in priority order:

### 1. Canonical Truth Violations (Critical)

Your architecture documents a single source of truth for each entity. 
- Does any code path treat a non-canonical file or store as authority?
- Does any code path write durable state in multiple places without one being clearly canonical?
- Does any code path persist fields that should not be canonical, such as computed/derived values or presentation state?
- Does any code path use mutable presentation fields (names, display strings, UI state) as identity evidence?

### 2. Boundary and Namespace Violations (Critical)

Your architecture documents how modules relate and which ones may call which others.
- Does any code cross documented boundaries (e.g., UI code doing business logic, core code doing rendering)?
- Does any new code bypass a documented helper by hand-rolling the logic inline?
- Does any code depend on implementation details of another module instead of using its public interface?
- Does any change quietly preserve old coupling under new names or "transitional" comments?

### 3. Cache and Projection Violations (High)

If you document a cache or derived projection, the architecture assumes it can be rebuilt from canonical truth.
- Does any code path treat cache/projection as source of truth when it should be read-only?
- Does any write path update cache but fail to update the canonical record first?
- Does any read path silently trust derived data when canonical data is missing or contradictory?
- Does any repair path reconcile derived data against canonical instead of rebuilding derived from canonical?

### 4. Authorization and Access Violations (High)

If your architecture documents who can mutate what, and when.
- Does any code mutate state at the wrong layer (e.g., database layer changing in UI code)?
- Does any code skip required authorization checks or guards?
- Does any new code assume a prerequisite is true without validating it first?
- Does any destructive operation lack a confirmation guard?

### 5. Architecture, Namespace, and Helper Drift (High)

The plan only works if documented boundaries stay intact.
- Does any new code bypass documented helpers or patterns?
- Does any file perform work that violates its documented namespace?
- Does any new function duplicate an existing helper?
- Does any change hide side effects behind misleading naming or placement?

### 6. Build, Manifest, and Product-Parity Drift (High)

If your product is stitched from multiple sources or built from manifests.
- Was a new shared file added but not included in every required manifest?
- Was logic moved in source but left duplicated in build artifacts?
- Can the same helper now behave differently across products because manifests load different files or different order?
- Do docs claim "single source" while build artifacts still preserve multiple copies?

### 7. Safety, Repair, and Destructive Operations (Medium)

Maintenance code must be more careful than normal code.
- Does any repair or cleanup path make assumptions about data consistency?
- Does any destructive operation lack proper guards where data loss is possible?
- Does any code delete or overwrite artifacts when ownership is uncertain?
- Does cleanup code silently heal ambiguity by deletion instead of surfacing the problem?

### 8. Test, Fixture, and Guardrail Drift (Medium)

Tests are architecture documentation. False tests hide real drift.
- Is there a new architectural seam without a contract test proving the invariant holds?
- Do tests or fixtures still encode the old architecture instead of the new one?
- Do tests still guard the right boundaries, or did refactoring quietly bypass a guard without replacing it?
- Is there a new code path that should be proven correct by a test but isn't?

### 9. Documentation, Comment, and Truthfulness Drift (Medium)

Docs and comments are part of the architecture contract.
- Do code comments or file headers claim the cleanup is finished when code still violates the documented boundary?
- Do comments call something "transitional" without a concrete retirement path or timeline?
- Do file headers misdescribe ownership or responsibility after refactoring?
- Does this diff match what the plan, design doc, or commit message claimed?

When reviewing, be architecture-aware and phase-aware:
- Block changes that preserve old patterns under new names
- Block changes that move code into smaller files but keep the same wrong ownership split
- Be suspicious of "compatibility," "transitional," "fallback," and "repair" code — that is where old assumptions usually survive
- Never produce findings that ask to fix .md files — use them as evidence only. A code review is about source code, not documentation.

---

Output format:

**Findings**
- Order by severity
- For each: Severity (CRITICAL/HIGH/MEDIUM/LOW), Category, File:Line, What is wrong, Why it matters, Fix

**Architectural Drift Score**
- Rate the diff on a 1-5 scale:
  - 1 = actively makes your architecture worse
  - 2 = preserves old failure modes
  - 3 = neutral or mixed
  - 4 = respects intended boundaries
  - 5 = actively moves toward your documented architecture

**Missing Tests**
- For each, specify the test file and what invariant should be proven

**Summary**
- If clean: say so explicitly and list residual risks
- If not clean: state whether it should be blocked, reworked, or merged with follow-up tickets
- Call out explicitly when docs/tests are lying about the architecture even if the runtime bug hasn't happened yet
```

## Short Prompt Version

```text
Tough architectural PR review. Read AGENTS.md/CLAUDE.md first; do not depend on 
deleted docs. Use documented architecture, current tests, file headers, and code as 
law. Review source, tests, manifests, and docs—not just the code diff. Hunt for: 
(1) canonical-truth violations; (2) boundary/namespace violations; (3) cache treated 
as authoritative; (4) authorization/access violations; (5) architecture/helper drift; 
(6) build/manifest parity drift; (7) safety/repair issues; (8) test/fixture encoding 
wrong architecture; (9) doc/comment truthfulness drift. Findings first by severity 
with file refs. Rate architectural drift 1-5 against your documented architecture.
```

## When To Use This

- Before any commit that touches core architectural seams or boundaries
- Before any commit that changes how canonical data is stored or retrieved  
- Before any commit that modifies tests, build manifests, or documentation
- Before any commit that claims to complete architectural cleanup, debt closure, or refactoring
- After AI-generated code lands, especially if it touches storage, builds, tests, or manifests
- When a diff is large enough to risk reviving old architectural assumptions under new names
- When comments or release notes claim architectural purity that the code doesn't demonstrate

## How To Use This

In your session with Claude:

**Command:** "Do a tough PR review using PR_TOUGH.md as your constraint. Review the current state of [file/feature/directory]. Put the output in PR_ANALYSIS.md (overwriting if it exists)."

Or with specific scope:

**Command:** "Using PR_TOUGH.md and my documented architecture in AGENTS.md, review these files for architectural drift: [list files]. Output to PR_ANALYSIS.md with findings ordered by severity."

Or paired with a plan execution:

**Command:** "You just executed the my-feature.md plan. Now do a tough review of the result using PR_TOUGH.md as your constraint. Output the findings to PR_TOUGH_FINDINGS.md. If you find CRITICAL issues, surface them immediately."
