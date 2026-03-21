I did the header/comment review across src and normalized the stale top-of-file headers. The big change was replacing old Contains: mini-catalogs

&#x20; with stable contract-style headers that say what the file owns, what boundary it belongs to, and any critical invariant. The main review notes are

&#x20; in docs/SRC\_HEADER\_REVIEW1.md, and the proposed AI-friendly comment convention is in docs/AI\_COMMENT\_STYLE1.md.



&#x20; I updated the stale headers in the major drift areas, especially core/session/ui/wt files such as src/core/globals.ps1, src/core/registry.ps1, src/

&#x20; session/launch.ps1, src/session/mapping.ps1, src/ui/display.ps1, and src/wt/service.ps1. I rebuilt both stitched products afterward, and the build

&#x20; succeeded.



&#x20; On your question about “AI directed comments”: there is no real universal standard, but the best pattern is contract-oriented comments, not

&#x20; exhaustive inventories. For this repo, the best top-of-file format is:



&#x20; - File

&#x20; - Namespace

&#x20; - Purpose

&#x20; - optional Notes



&#x20; That is more searchable and more durable for both humans and AI than stale function lists. After the pass, only three non-testing source files

&#x20; still use Contains::

&#x20; - src/integration/tickets.ps1

&#x20; - src/session/session-link.ps1



&#x20; I left those because their richer descriptions are still accurate and materially useful.





› Does this change materially affect the product in any way?





• Yes, but indirectly.



&#x20; It does not change user-facing behavior or features. It changes how safely and quickly the code can be understood and changed.



&#x20; Material improvements:



&#x20; - fewer stale comments lying about what files do

&#x20; - clearer ownership boundaries in core/session/ui/wt files

&#x20; - better searchability for future AI and human work

&#x20; - lower chance of refactor drift because invariants are stated at the file boundary



&#x20; So:



&#x20; - runtime/product behavior: no

&#x20; - engineering quality and future feature velocity: yes



&#x20; That matters in this repo because a lot of past pain came from boundaries drifting while comments kept pretending old structures still existed.

&#x20; This reduces that tax.





› Was there a reason the drift was happening that can be prevents? Should I update the AGENT.md and the CLAUDE.md with rules?





• Yes.



&#x20; The drift happened for predictable reasons:



&#x20; - top-of-file comments were too detailed

&#x20; - refactors moved functions without updating the inventories

&#x20; - file headers were being used like mini changelogs

&#x20; - there was no repo rule for what a file header should contain

&#x20; - function-level docs and file-level docs were overlapping badly



&#x20; That is preventable.



&#x20; What prevents it:



&#x20; - keep file headers short and stable

&#x20; - document ownership and invariants, not full function lists

&#x20; - put detailed behavior on functions with .SYNOPSIS

&#x20; - treat header updates as part of any file split/refactor

&#x20; - reject comments that describe history instead of current responsibility



&#x20; Yes, I think you should update both AGENT.md and CLAUDE.md.



&#x20; I would add rules like:



&#x20; - File headers must describe File, Namespace, Purpose, and optional Notes.

&#x20; - File headers should describe ownership and invariants, not enumerate every function.

&#x20; - Function inventories in file headers should be avoided unless the file is tiny and stable.

&#x20; - When a refactor changes a file’s responsibility, update the file header in the same change.

&#x20; - Use function .SYNOPSIS blocks for detailed behavior; use file headers for boundaries.

&#x20; - Comments must describe current truth, not historical intent.



&#x20; Bluntly: the main bug was not “people forgot comments.” It was “the comment style encouraged drift.” So yes, a rule in both instruction files is

&#x20; worth it.

