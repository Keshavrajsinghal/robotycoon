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
- Robot types drawn at each station are a design judgment, not a fact from a source: grapes SCARA with a soft finger gripper, apples 6-axis arm with a vacuum cup (leaning a slice needs wrist tilt), crackers and cheese delta robots. Ride text is written to match and says these are judgment calls.
