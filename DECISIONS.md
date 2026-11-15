# Decisions

One line of reasoning per choice made without asking.

- Project lives at `~/Desktop/robotycoon`, its own git repo, not inside the session's `pi` checkout: it is unrelated to pi and must publish as its own repository.
- Site is plain HTML, CSS, and ES modules served as static files, with no runtime dependencies and no build step: GitHub Pages serves it as-is and it keeps working offline once loaded.
- Rendering is a hand-written 2D canvas isometric engine (flat-shaded low-poly shapes) plus SVG for close-ups: no 3D library to vendor, small payload, works on phones.
- ES modules need an HTTP server (they do not load from `file://`): README tells you to run `python3 -m http.server`.
- All on-screen facts come from `/knowledge` markdown, compiled by `tools/build-content.mjs` (Node built-ins only) into the committed file `js/content.js`. Only UI chrome (button labels like "Play") lives in app code.
- Knowledge format is strict markdown (headings plus `key: value` lines), documented in `knowledge/FORMAT.md`, so the generator can validate it and fail loudly instead of rendering broken pages.
- Concept ids were fixed up front in `knowledge/registry.md` so twelve writers working in parallel can cross-reference each other's concepts.
- Simulation content (ride stops, questions, puzzles, workbench text, town, showroom) also lives in `/knowledge/sim/` so the "no facts in app code" rule holds for it too.
- The dependency graph is generated from each concept's `requires:` line rather than hand-drawn, so it cannot drift from the content.
- Plain-level text gets a separate "Where the analogy breaks" section rather than a sentence inside Plain, so the site can show it distinctly.
- Unverifiable claims are marked inline with `[unverified]`; the site renders these as visible flags.
- Headless checks use Playwright 1.64.1 (pinned, older than two weeks) driving the installed Google Chrome, in `tests/`, so no browser download is needed. Tests are not needed to run the site.
- Area 7 (classical robot software, 16 concepts) is written by two agents in parallel and merged, because it is the deepest area and one agent would run out of room.
- Agent counts exceed the default "under 10 per workflow" guideline in Phases 1-2 (one writer and two reviewers per area): the request asks for every claim in twelve areas to be checked against primary sources.
- The simulation engine (no facts, only drawing and UI code) is built in parallel with Phases 1-2 against placeholder fixture content in `tests/fixtures/`; all real ride, workbench, and town text is written after the Phase 2 review, from the reviewed knowledge files.
- Stop ids for every ride are fixed in `ARCHITECTURE.md` so content writers and drawing code can work in parallel.
- Ride 2 follows an apple-slice pick (so the degrees-of-freedom workbench, leaning a slice against the grapes, belongs to it); Ride 3 follows a failed grape-bunch pick; Ride 4 follows that takeover's recording back to the grape station.
- Robot types per station follow the reviewed knowledge (area 1's stated judgment call), superseding my earlier drawing choice: grapes = washdown six-axis arm with soft fingers at a tote (bunches lie at random angles and need wrist tilt), apples = delta with vacuum cup, crackers = SCARA with vacuum at the feeder, cheese = delta with vacuum, outfeed = gantry. Reason: the drawings must not contradict the text a learner reads.
- Ride 2 follows one grape-bunch pick (not an apple slice) on the grape station's six-axis arm. Reason: area 7 uses the grape grasp as its full six-number pose example, the arm then has six joints to show, and Rides 2, 3 and 4 share one station (a good pick, a failed pick, the lesson). Workbench 1 keeps the spec's task (lean an apple slice against the grapes) and uses it to show why the 4-axis apple delta cannot do it.
- The grape station runs the classical pipeline in Ride 3 (the failure is a classical grasp check), and Ride 4 assumes the station has moved to the learned mode Ride 2 shows; Ride 4's intro says so. Reason: it lets Ride 4 show learning from takeovers without rewriting Ride 3, and both modes are taught in Ride 2.
- Showroom entries may carry an optional `reach_text:` that replaces the numeric reach caption (used for the mobile base, whose `reach_mm` is a drawing footprint). Reason: an AMR has no arm reach, and the caption must not say "Reach 800 mm".
- Question options are not shuffled by the site; the content reviewers spread the correct answers across positions instead.
