# PLAN_RULES.md — Rules For Writing Plans That AI Can Execute Safely

These rules govern how implementation plans are written, in any repository, before any work begins. The execution counterpart is `RUN_PLAN.md`. The review counterpart is `PR_TOUGH.md`. They were distilled from real failures — most directly, a faithful execution of a thorough plan that still earned an F in hostile review, because the plan said *where to land changes* but never ordered the executor to *prove the landing was complete*.

## The Core Principle: Plans Must Be Self-Instructing

A plan is a contract between the planner and the executor. The executor you get — an AI session, a recipe-driven worker, a colleague six months from now — may read *only* the plan. Not the governance files. Not the conversation that produced the plan. Not the planner's intentions.

Therefore every discipline the work requires must be stated **inside the plan** as directives with evidence artifacts. A plan that depends on executor diligence is not a contract; it is a hope.

Corollary: **a plan's own enumerations are intent, not proof.** A consumer-sweep table, a landing map, a list of acceptance checks — these record what the planner found at planning time. The planner's sweep may be incomplete. The plan must order the executor to re-derive them, because an executor who merely satisfies the plan's enumerated checks will pass every check while the consumers the planner missed silently drift.

## Locate the Territory Before Planning

No planning begins until the plan names what professional territory the work lives in — which domain, which layers of concern, which expertise. A fluent plan in the wrong territory misses whole professional layers (security, observability, cost, recovery, compliance) while sounding complete.

- State the domain and the map of concerns the plan answers to (a taxonomy, a checklist of professional layers, an architecture document — whatever the project uses).
- For every concern on that map: **cover it or rule it out explicitly with a reason.** Silence about a layer is the defect the map exists to prevent.
- If no available map fits the work, that is a finding, not a failure: build or adopt the right map before planning. Never plan inside the wrong territory because it was the nearest one available.

(In AI-BASIC/bAsIc projects this is the stack taxonomy and the `STACK FROM wish` fitness gate; in other repos it is whatever concern-map the project recognizes. The rule is universal; the mechanism is local.)

## What a Plan Contains

1. **Problem statement.** One paragraph: what is broken or missing, and why it needs fixing.
2. **Authority references.** The spec, contract, or requirement the plan implements. If the plan changes a contract, it says so in those words.
3. **Consumer sweep (for contract changes).** Every consumer of the old contract, each marked *update* or *ruled out with a reason*: callers, writers and readers, parsers and validators, observers and diagnostics, cleanup paths, tests, docs, examples, sibling planning files. Passing tests are not enough; the sweep is the discipline.
4. **Slices.** Numbered units of focused work, each completable in one session, each leaving the system buildable and test-passing, each with a **falsifiable acceptance criterion** — something a test or focused check can prove, not "improved" or "cleaner."
5. **A walking spine.** A slicing plan must not consist only of horizontal layer slices. Before broad work begins, define the smallest honest end-to-end path through the real pipeline — real input, real phases, real output, end-to-end test, intentionally narrow, no shortcuts around the intended architecture. The spine is the trunk later slices attach to; it is the only early slice that can falsify the architecture.
6. **Forward-only confirmation.** No backward-compatibility shims, no dual paths, no "transitional" code. When a contract changes, every consumer changes in the same plan or is ruled out explicitly. Exceptions are named, scoped, justified.
7. **Executor directives.** See below. Mandatory.

## Executor Directives (Mandatory in Every Plan)

Every plan ends with an **Executor Directives** section: orders that make verification an *output of executing the plan*, not a hoped-for behavior of the executor. Five are mandatory; a planner may add more, never fewer.

1. **Pre-edit sweep artifact.** Before editing anything, produce a list of every file that mentions any contract this plan removes or changes; classify each hit (will edit / correct as-is / out of scope with reason); treat that list — not the plan's tables — as the edit checklist. The plan supplies seed search terms; the executor extends them with every changed form discovered during the work. When you find one instance of a defect class, immediately search for every sibling.
2. **Derived verification.** The plan's enumerated checks are a floor, not the definition of done. Derive additional checks from the plan's change inventory — for every removed or renamed form, search every authority surface (source, specs, docs, tests, examples, sibling plans) for it as a *positive expectation* — and report the results. "I ran the plan's checks" is not completion.
3. **Hostile self-review.** The final work item of every plan is reviewing the executor's own full diff under the project's review framework (`PR_TOUGH.md`) before reporting completion. Look for exactly what an adversarial reviewer would: consumers the sweep missed, stale version markers, positive expectations of removed behavior, untracked decision rationale.
4. **Batch hygiene.** Before starting, verify the working tree contains only this plan's work; flag unrelated tracked changes to the human for separation. A plan's diff is its review surface; unrelated content in the surface is an execution defect.
5. **Tracked deviations.** Any deviation from the plan — a judgment call, a conflict resolution, a correction of the plan itself — is recorded in a tracked file (the plan or an addendum), never only in gitignored working files or conversation. Untracked rationale does not exist.

## Done Means Evidence

A plan is complete when its executor hands the human **artifacts, not assurances**:

- the pre-edit sweep list and its dispositions;
- the derived-verification results, each search named and its hits classified;
- the self-review findings, including explicit "none found" per category;
- a review surface containing only this plan's work;
- deviations recorded in tracked text.

An executor's summary saying "done" carries no evidentiary weight on its own. The human owns the commit; the executor's job is to make the approval decision easy by making the evidence complete.

## The Cautionary Case

The plan that motivated these rules was good by every conventional standard: per-section landing instructions, a consumer-sweep table, slice routing, acceptance checks. The executor followed it faithfully and earned an F. Every High finding mapped to a missing directive, not a missing instruction:

- Sibling planning files still taught the syntax the plan had just removed — directive 1 would have listed them before any edit was made.
- A consumer absent from the plan's routing table still required the removed behavior — directive 2; the executor had treated the plan's table as the complete consumer list.
- Stale version markers survived in footers and headers no one enumerated — directive 3.
- Unrelated changes shared the review surface — directive 4.
- The executor's deviation rationale lived only in a gitignored working file — directive 5.

The discipline existed in the repo's governance files the whole time. The executor read the plan as the operative instruction set — which is exactly what executors do, and exactly why the plan is where the discipline must live.

## The One-Line Summary

Write every plan so a stranger could execute it correctly — territory named, every concern answered for, sweeps re-derived, evidence demanded — because the executor who reads it *is* a stranger, every time.
