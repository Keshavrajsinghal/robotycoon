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
