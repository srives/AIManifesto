# new-knowledge.md

Lessons learned in practice — things that turned out to matter more than expected. Updated as understanding deepens.

---

## 1. The Importance of a Naming Convention (and Making It Yours)

AI coding requires naming conventions. That is the big realization. Not just "be organized" — a conscious, deliberate, personal naming system that an AI can be told about and follow consistently.

### The convention I use

**UPPERCASE files are permanent.** `CLAUDE.md`, `AGENTS.md`, `PR_TOUGH.md`, `RUN_PLAN.md`, `PLAN_RULES.md`. These stay. They are governance. I can look at a project root and immediately know: any uppercase file is a keeper.

**Lowercase files in the root are probably temp.** After a planning session I accumulate many lowercase files. When it's time to clean up, I delete lowercase root files without having to read every one to figure out if it matters. This saves real time after a long multi-agent planning run.

**Lowercase files in sub-folders stay.** `docs/agents/style.md`, `.claude/skills/deploy/SKILL.md` — sub-folder placement signals intent, so case alone doesn't tell the whole story. The cleanup heuristic only applies at the root level.

**Plan files follow a naming pattern:** `name_platform[N].md`

- `name` describes the feature or work
- `platform` is the AI system that produced it: `claude`, `gemini`, `codex`, `copilot`, etc.
- `N` is the iteration number: 1, 2, 3...

I often run many rounds of planning with the same AI, or the same task across multiple AIs. So I end up with files like:

```
auth-refactor_claude1.md
auth-refactor_claude2.md
auth-refactor_gemini1.md
auth-refactor_codex1.md
```

When I settle on the plan I'm going with, I rename the winner:

```
auth-refactor-final.md
```

The `-final` suffix is the signal to AI tools: this is the canonical plan to execute. Everything else is drafts.

**I prefer `-` over `_` in filenames.** Aesthetic, mostly. Though I admit I don't follow my own rule consistently — the plan naming above uses `_` to separate the platform token because it reads more clearly. Pick one and lean toward it; the AI will follow whatever you tell it to use.

### The five governance files

I keep five permanent governance files per project:

| File | When it gets used |
|---|---|
| `CLAUDE.md` | Every session, automatically. Claude reads it first. |
| `AGENTS.md` | Every session, across all AI tools. The cross-tool primary. |
| `RUN_PLAN.md` | When executing a plan. "Use RUN_PLAN.md discipline." |
| `PR_TOUGH.md` | When reviewing code. "Use PR_TOUGH.md as your review standard." |
| `PLAN_RULES.md` | When planning. Rules and constraints that should govern the plan. |

The names are the protocol. You never have to explain to an AI which file to use — the name makes it obvious. And you can write prompts that compose them naturally:

> "Check claude's implementation of `feature-final.md` using `PR_TOUGH.md` as your coding rule, and write the review to `PRx.md` — overwrite it if it exists."

`PRx.md` is the output file for the current code review pass. The `x` signals "the current one, replace it." When the review is good enough to keep, rename it `PR-feature.md`.

### The deeper principle

The naming convention is not for you. You already know what the files mean. It is for the AI — so that it can navigate, reference, produce output to, and clean up files without you having to explain the system every session.

Once your convention exists, you can say: "Follow my naming convention for any new files you produce." The AI will name plan drafts `name_platform1.md`, output reviews to `PRx.md`, and know that `CLAUDE.md` is law. The convention becomes infrastructure.

Every person should consciously design their own. The specific choices matter less than the consistency. Pick your rules, write them in `CLAUDE.md`, and hold to them.

---

## 2. Planning vs. Coding — The Over-Engineering Trap

Many AI systems do better when you tell them specifically what to build, not just what to plan.

Here is the trap: you ask an AI to "plan how to implement file reading with text search" and it comes back with:

- An interface definition
- A concrete implementation class
- A factory or registration pattern
- Dependency injection wiring
- Structured logging throughout
- A full unit test suite
- Error handling strategy
- Async considerations

When all you wanted was one function that opens a file and finds a line containing a string.

### Why this happens

"Planning" triggers the AI's pattern-matching for architecture. Architecture implies extensibility. Extensibility implies interfaces, registrations, factories, and all the scaffolding that enterprise patterns bring. The AI is not wrong — in a large codebase those things may eventually matter — but it produced far more than the task required, and now you have to read through and reject most of it.

### The fix

**Be specific about the unit of work.** Instead of "plan how to implement X," say:

> "Write a function called `FindLineContaining(filePath, searchText)` that opens the file at `filePath`, reads it line by line, and returns the first line containing `searchText`, or null if not found."

You get the function. Not the interface, not the test suite, not the logging strategy — unless you ask for those explicitly.

**Planning is valuable at the right scope.** The rule is:
- Use the AI's planning mode for architecture decisions that genuinely need design: "How should the session identity model work across these three services?"
- Use direct specification for implementation tasks that have a clear unit: "Write a function named X that does Y."

**The over-engineering signal.** If the AI's plan includes more than two concepts you didn't ask about, it has over-scoped. Stop it. Say: "Just the function. No interface, no factory, no logging. One function." Good AI tools respond well to this correction on the first try.

### The practical implication for your governance files

Add this to your `CLAUDE.md` or `PLAN_RULES.md`:

> Before proposing an implementation, confirm the scope. The default is the smallest function or method that satisfies the request. Do not add interfaces, registrations, factories, or logging unless explicitly asked. Ask if unclear.

One rule prevents the over-engineering pattern without having to push back every time.

---
