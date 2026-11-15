# Progress

Live site: (not published yet)

## Setup (2026-11-15)
- Created repo, `knowledge/FORMAT.md` (file format and style rules), `knowledge/registry.md` (106 concept ids across 12 areas), and `tools/build-content.mjs` (validator and generator, tested on sample files).
- Tooling found: Node 22, GitHub CLI logged in, repo name `robotycoon` available, Google Chrome present for headless checks.

## Phase 1: knowledge base (done)
- 12 area files in `/knowledge` (105 concepts, about 900 KB of markdown), `glossary.md` (235 terms), and `dependency-graph.md` (generated from each concept's `requires:` line; no cycles).
- Generator check: 0 errors, 0 warnings. 600 sources cited; writers left 125 `[unverified]` flags where they could not open a supporting source.
- Blocker worked around: the shared web-search quota ran out partway through writing. Writers then cited only pages they fetched directly at known URLs (vendor sites, project docs, RFCs, Wikipedia as a last resort) and flagged the rest. Phase 2 re-checks all of it.
- Known conflict passed to Phase 2: the EU Machinery Regulation application date appears as 14 Jan 2027 in one file and 20 Jan 2027 in another.

## Phase 2: accuracy review (done)
- Every concept file got two independent passes: a fact check against primary sources (datasheets, manuals, standards bodies, official docs, papers), then a teaching review that tested each analogy for wrong predictions, tightened the Precise sections, and re-opened a sample of the fact checker's verdicts. A final pass reconciled facts shared across files and synced the glossary.
- Totals: 1,994 claims checked, 1,717 verified, 215 corrected, 34 flagged, 28 removed; 98 of the Phase 1 flags resolved; 15 of 105 analogies rewritten; 7 of 208 spot-checks failed and were corrected. 31 `[unverified]` flags remain and show on the site. Sources: 833.
- Reports: `REVIEW.md` (summary, most important corrections, rejected analogies, remaining flags) and per-area detail in `review/`.
- Follow-up: the area 6 fact check had left 11 product-name claims unflagged (vendor sites blocked, search quota out). A second pass verified 10 and corrected 1, so no unverifiable claim is left unflagged.
- Decision changed as a result: the drawn station robots now follow the reviewed knowledge (six-axis arm at grapes, deltas at apples and cheese, SCARA at crackers), and Ride 2 follows a grape pick. See DECISIONS.md.
- Generator check after review: 0 errors, 0 warnings.
