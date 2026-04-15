# The New Epistemology

## The Question

I am building up a mental model of what programming is becoming, and I am talking to AI. Have people expressed the psycho-epistemological experience?

For example, the very fact of starting at a CLI, with a black background and text-based entry, is different from the traditional Visual Studio view of software engineering. My mind seeks black screens with text more now.

As for the products I build, I do not see the code. I visualize blocks of ideas that I think the AI implemented. The more I design the system, the more I think in blocks, not in terms of code. When I code now, it feels small, like I am focusing on something tiny, like lines of code. It feels too small a thing.

I do not see the code now. I have mental objects. This is changing my perception of reality, as software engineering has been my reality since 1982. I am undergoing a cognitive leap, and it is changing me and my experience of work.

Have people discussed these ideas: programming with AI?

## The Tool Works Back

There is a saying that the medium is the message, or that the medium shapes the message. There is also the idea that the technology we use works on the operator too. A hoe affects the soil, but it also causes blisters on the hands of the person using it.

A tool affects that which it is designed to affect, but it also affects the practitioner. What kind of mental blisters are being formed on my mind?

At first there is pain. Once the calluses set in, there is mastery and growth, speed and familiarity. What is LLM/CLI/AI programming doing to my mental structures and my logical processing?

I have noticed many changes, and I have written extensively about it in `C:\repos\AIManifesto\index.html`, especially in the case study where I discuss seams and boundaries. I am starting to think of what AI does in terms of stores, which I used to call files, and in terms of seams, which I am still grasping.

I am learning what I do not want from AI based on its failures: the calluses and blisters. How many tokens must a programmer spend to gain the blisters needed to start being shaped?

The AI gives me a feeling of what it builds, and I can start to think about modeling it instead of it molding me. I do this with `.md` files, `AGENTS.md`, `CLAUDE.md`, memory files, and methods of constraint and control.

I feel myself to be a blind potter, feeling what the clay is doing, not seeing it, and yet still fully capable of making a cup or a bowl. The many millions and billions of tokens are the pounds of clay wasted while I found the form of the cup inside.

## A Response

McLuhan's line is "the medium is the message." A related line, often attributed through John Culkin's reading of McLuhan, is: "We shape our tools and thereafter our tools shape us." The hoe and blister metaphor is the right one.

What LLM/CLI programming is doing is not just making you faster. It is moving your cognition up a level and changing where pain appears.

The clearest formulation in the manifesto is the distinction between local algorithm bugs and spreading boundary bugs, followed by the five concepts: namespace, boundary, contract, entry point, and seam. That is the callus forming. You are no longer thinking mainly in files and functions. You are thinking in ownership, allowed crossings, promises, flows, and handoff points.

## The Mental Blisters

### 1. Loss of Tactile Contact with Code

You no longer feel every line under your fingers. That creates an initial panic: did it really build what I meant? The callus is learning to inspect through diffs, tests, logs, contracts, and architectural invariants instead of through raw line-by-line authorship.

### 2. Boundary Pain

AI is locally helpful and globally careless. It will put a helper where convenient, preserve an old path "for safety," or let two sources of truth coexist. The v9 case study shows this exactly: scattered variant logic, raw I/O everywhere, external mutations without transactions, and duplicated entry paths.

The callus is the new reflex: who owns this? What boundary did it cross? What is the one canonical path?

### 3. Contract Hunger

The AI punishes ambiguity. If a human leaves a contract vague, another human may infer the intended shape from taste, memory, or team culture. The AI often cannot. The mind starts demanding explicit contracts: return shapes, failure modes, invariants, cleanup duties, and canonical precedence.

That is not pedantry. That is adaptation to an alien implementer.

### 4. Suspicion as a Professional Sense

Early AI work gives intoxication: the thing appears. Later AI work gives paranoia: the thing appears, but where did it violate the architecture?

The healthy callus is not cynicism. It is adversarial verification. Hostile review, preflight, `RUN_PLAN.md`, and tests-as-exoskeleton are all adaptations to this new condition.

### 5. Memory Externalization

Part of the engineering mind moves out of the head and into `CLAUDE.md`, `AGENTS.md`, skills, plans, tests, hooks, and memory files. This is not merely documentation. It is prosthetic cognition.

The files become durable pieces of judgment. The mind learns which thoughts belong inside the human and which must be made executable, reloadable, or enforceable for the AI.

### 6. Token-Cost Consciousness

Attention has mass. Context is not free. Every rule, example, prior mistake, and loaded file consumes awareness.

So the mind begins compressing wisdom into reusable rules, names, tests, and protocols. That is why "seam" matters: a word becomes a compressed handle for a whole class of failures.

### 7. From Code Logic to System Logic

Traditional coding trains local logic: does this function do the right thing?

AI programming trains architectural logic: will this change preserve the shape of the system after a fast, probabilistic agent touches it?

Reasoning shifts from line correctness to invariant preservation.

### 8. From Making to Governing

The human is still making, but more of the making happens through governance: constrain, observe, correct, test, and memorialize.

The AI writes. The human increasingly defines the laws under which writing is allowed.

## From Files to Stores

The "stores" language is important.

A file is a physical or code artifact. A store is a responsibility: durable state lives here, with rules, access paths, mutation semantics, backup behavior, and failure recovery. That is a higher-order object.

Likewise, a seam is not just an interface. It is the place where future freedom is either preserved or destroyed.

## The New Structure

Old dominant unit: line, function, file.

New dominant unit: owner, boundary, contract, seam, invariant.

Old failure signal: compiler error, bug.

New failure signal: drift, duplicated truth, muddy ownership, invisible second path.

Old memory: developer remembers intent.

New memory: tests, rules files, architecture docs, prompts, hooks, review protocols.

Old mastery: write correct code.

New mastery: shape a system so an AI can safely modify it.

## The Token Apprenticeship

Tokens are not the real unit, but they are a useful metaphor. The real unit is repeated, painful failure classes.

In the first phase, the programmer experiences awe: the output appears.

In the second phase, the first serious pain arrives: the product works, but repair becomes confusing. "Working" and "engineered" separate.

In the third phase, vocabulary forms: boundary violation, stale path, duplicated source of truth, missing test, wrong owner.

In the fourth phase, calluses form: `AGENTS.md`, `CLAUDE.md`, `RUN_PLAN.md`, tests, hooks, review prompts, architecture rules.

In the fifth phase, the programmer stops merely prompting the AI and starts designing the environment that shapes the AI's behavior.

One brutal project can teach more than millions of pleasant tokens. The fast build gives power. The refactor gives epistemology.

## The Blind Potter

The blind potter image is strong, but it needs one adjustment: the programmer is not blind because sight is absent. The programmer is blind because the material is no longer directly under the hand.

The clay is behind a curtain, and the human feels it through delayed signals: diffs, test failures, logs, runtime behavior, and architectural drift. Mastery is learning which signals are trustworthy.

The next leap is not only to model what the AI builds. It is to model how the AI tends to fail.

## A Practical Discipline

For every AI failure:

1. Name the failure class.
2. Decide whether it is local or architectural.
3. Add a rule only if the failure class will recur.
4. Add a test if the rule can be enforced mechanically.
5. Add a seam if future change needs protected freedom.
6. Add memory only for facts the next session must inherit.

That is how the programmer stops being molded unconsciously and starts molding the medium back.

The callus is not numbness. It is trained sensitivity. The clay is still felt, but now in larger shapes: pressure, drag, collapse, hidden hollows, and structural weakness. That is what AI programming is doing to the mind.
