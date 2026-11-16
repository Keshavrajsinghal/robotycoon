# RoboTycoon

Live site: https://keshavrajsinghal.github.io/robotycoon/

A guided simulation for learning robotics, built as a low-poly isometric theme park. The park
is an airline cheese plate factory and its surroundings. Each ride follows one thing through
the robotics stack, and the cargo on the cart changes at every stop:

- **Ride 1, The tray**: one fiber tray through the whole line, from the denester to the
  outfeed (cells, conveyors, feeders, inspection, guarding, takt time, line balancing, OEE,
  washdown, safety standards).
- **Ride 2, The signal**: one grape-bunch pick, from a sensor trigger through light, image,
  detection, 3D position, grasp, trajectory, joint targets, motor current, the inside of a
  joint, and arm motion to the gripper. A toggle swaps the classical pipeline for a learned
  policy (robot bodies, joints, end effectors, sensors, compute, classical software).
- **Ride 3, The rescue**: a pick fails and a remote operator takes over, with the delay each
  stop adds and the running total (teleoperation).
- **Ride 4, The lesson**: the takeover recording becomes training data, then a new model,
  then an update rolled out to the fleet (robot learning, cloud and fleet platform).

The **town map** shows the industry: who makes parts, robots, cells, applications, models, and
tools, who buys from whom, the deployment lifecycle, and the job functions in each kind of
company. The **showroom** draws the main robot types side by side at the same scale with their
payload, reach, and speed. Six **workbenches** let you try things by hand: degrees of freedom,
inverse kinematics, control-loop tuning, camera-to-robot calibration, teleoperation under delay,
and line balancing.

Every stop has two levels of explanation (Plain, then Precise), a "Read more" panel with
examples, misconceptions, real products, code sketches, and sources, and a question about the
stop you just left. Each ride ends with a puzzle.

## Run it locally

The site is static: HTML, CSS, and native ES modules, with no build step and no dependencies.
ES modules do not load from `file://`, so serve the folder over HTTP:

```bash
node tools/serve.mjs 8080
```

or

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080/.

## How the content works

Everything a learner reads comes from the markdown in [`knowledge/`](knowledge/):

- `knowledge/01-*.md` to `12-*.md`: one file per area, one section per concept. Each concept
  has a plain explanation with an analogy and where the analogy breaks, a precise explanation,
  an example on the cheese plate line and one from elsewhere, why it exists, what it connects
  to, real products and tools, a common misconception, and sources.
- `knowledge/glossary.md` and the generated `knowledge/dependency-graph.md`.
- `knowledge/sim/*.md`: the ride stops, questions, puzzles, workbench text and model data, the
  town, and the showroom. These only restate the concept files.

The rules for these files are in [`knowledge/FORMAT.md`](knowledge/FORMAT.md). The generator
validates them and writes one content file, `js/content.js`, which the site loads:

```bash
node tools/build-content.mjs           # validate and write js/content.js
node tools/build-content.mjs --check   # validate only
```

App code holds no facts: only drawing code and UI labels. To change what the site says, edit
the markdown and rerun the generator.

The knowledge base was fact-checked against primary sources (datasheets, manuals, standards
bodies, official documentation, papers). The results are in [`REVIEW.md`](REVIEW.md), with
per-area detail in [`review/`](review/). Claims that could not be confirmed are marked
`[unverified]` in the text and shown with a visible flag on the site.

## Tests

`tests/smoke.mjs` loads the site headless at phone and desktop sizes, rides every ride, answers
every question, solves every puzzle and workbench, and checks layout and console errors. It uses
Playwright with an installed Google Chrome:

```bash
cd tests && npm install --ignore-scripts && cd ..
node tests/smoke.mjs
```

## More

- [`ARCHITECTURE.md`](ARCHITECTURE.md): file layout, module contracts, content shape.
- [`DECISIONS.md`](DECISIONS.md): choices made along the way and why.
- [`PROGRESS.md`](PROGRESS.md): build log and verification notes.
