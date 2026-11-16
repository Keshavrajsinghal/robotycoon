# Progress

Live site: https://keshavrajsinghal.github.io/robotycoon/

Repository: https://github.com/Keshavrajsinghal/robotycoon

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

## Phase 3: the simulation (done)
- Built: a low-poly isometric park (hand-written 2D canvas engine, no libraries), four rides (42 stops), six workbenches, the town map (7 districts, 24 buildings) and the showroom (7 robot types). Every stop has a quick check on the previous stop (42 in all), and each ride ends with a puzzle (match grippers, order the stations, cut a teleop delay under 150 ms, choose what to do with a weak model). Every word on screen comes from `/knowledge` through `js/content.js`.
- How it was built: the engine and UI were built against placeholder fixtures while Phases 1-2 ran. Rides, workbenches and the town were then built in parallel, each by its own builder with its own files, and aligned to the reviewed knowledge (for example, the station robots now match area 1). Because of that, the spec's build order shows up as commit order, not as the order the code was written:
  1. Ride 1, plus the shared engine, UI, tests and all generated content (`337b22e`)
  2. Ride 2 (`7fd35ab`)
  3. Workbenches 1, 5, 6 (`9cc663d`)
  4. Ride 3 (`6901b47`)
  5. Ride 4 (`4a50d1c`)
  6. Town map and showroom (`0b4bc3d`)
  7. Workbenches 2, 3, 4 (`534bceb`)
- QA before commit: five QA agents (rides 1-2, rides 3-4, town, workbenches, cross-cutting) checked every stop at 390x844 touch, 360x640 touch and 1440x900 mouse, in dark mode and with reduced motion. They looked at the screenshots and fixed what they found. A final integrator applied the out-of-scope fixes.
- Headless verification after each ride: `tests/smoke.mjs` was run against each of the seven commits, each in its own clean checkout, at a phone size (390x844, touch) and a desktop size (1440x900, mouse).
  - Commits 1-5 pass every ride, workbench and puzzle check they contain.
  - The only failures are expected ones. The town trail check fails until the town code lands in commit 6, and at commit 1 a Ride 2 deep link fails because Ride 2 is not there yet.
  - Commits 6 and 7 pass every check.
  - A first attempt ran three checkouts at once and got phone-only click timeouts from machine load. Run one at a time, they did not recur.
- Final audit against the spec, by independent agents: six lenses (rides and challenges, controls, town and workbenches, the content rule, GitHub Pages readiness, a first-time learner).
  - 21 findings: 18 confirmed by a skeptic and fixed, 3 rejected.
  - Main fixes: quick-check answers no longer give themselves away by length (the right answer was the longest in 34 of 42); Ride 2 answer positions spread out; the latency puzzle hides each option's saving until you check; workbench 6 now lets you choose robot type and count per station; workbench 4 shows the pixel-to-robot conversion; phone panel shows the stop text first; keyboard focus holds the cart.
  - A second review of those fixes found 6 more problems (workbench 6 arithmetic, one wording claim, Ride 3 timing convention). All 6 are fixed.
- Final verification: `node tests/smoke.mjs` and `node tests/smoke.mjs --fixture` both print "all checks passed". `node tools/build-content.mjs --check`: 0 warnings, 0 errors.
  - What the suite does, at phone and desktop sizes: rides every ride start to finish (classical and learned for Ride 2) and visits every stop from the route list. It answers every quick check, solves every puzzle, and opens and solves every workbench. It opens every town district and building, the showroom, the glossary and a concept page.
  - It also checks Plain/Precise persistence, reduced motion, keyboard control, console errors, and horizontal overflow at 360 px.
- Scope: nothing was cut. All four rides, the town map and all six workbenches shipped.
- Known remaining issues (minor):
  - On phones, Ride 1's cart tag covers part of the station just above the cart, most at the outfeed.
  - On a 390 px phone at Ride 3's lake stops, the lake delay board sits half off-screen. The panel's delay box shows the same running total.
  - Map labels at the screen edges can be cut off.
  - Rotating a phone re-orders the stop panel only at the next stop.
  - Workbench 6 robot prices are illustrative points within a budget of 8.
  - The cheese station's quick-release grippers, parts washer and washdown parking mode are described in the text but not drawn.
  - The showroom's humanoid reach uses the makers' own figure; QA flagged it as low confidence, and it was not re-sourced.

## Phase 4: publish (done)
- `README.md` covers what the site is, how to run it locally (`node tools/serve.mjs 8080` or `python3 -m http.server 8080`), how content is generated from `/knowledge`, and how to run the tests.
- Created the public repository `Keshavrajsinghal/robotycoon`, pushed `main`, and enabled GitHub Pages from the root of `main`.
- Live URL confirmed with headless Chrome at phone and desktop sizes: the site loads; each ride boards and steps to its next stop; workbenches 1 and 6 open; the town opens; no console errors and no failed requests. The very first load, seconds after the first Pages build, timed out while the CDN updated; every load after that worked.

