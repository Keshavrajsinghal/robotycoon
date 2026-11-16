# Knowledge file format

Everything the site shows is generated from the markdown in `/knowledge` by
`node tools/build-content.mjs`, which writes `js/content.js`. The generator is strict: if a
file breaks these rules it prints the file, line, and problem, and exits non-zero.

Check one or more files while writing:

```
node tools/build-content.mjs --check knowledge/07-classical-software.md
node tools/build-content.mjs --check            # everything
node tools/build-content.mjs                    # check + write js/content.js and knowledge/dependency-graph.md
```

## Writing style (applies to every file)

- No emojis anywhere.
- Every concept is explained at two levels.
  - **Plain**: for a layperson. Two to four sentences, no jargon, built on one everyday
    analogy. The next section, "Where the analogy breaks", says in one or two sentences where
    the analogy stops being true.
  - **Precise**: use the real terms. Define each term in parentheses on first use, in plain
    words (never define jargon with more jargon). Say what breaks without the thing. Do not
    oversimplify.
- Every concept has two examples: one on the cheese plate line, one from a different familiar
  setting (car factory, warehouse, surgical robot, kitchen, airport, and so on).
- If you are unsure of a fact, say so in the text ("I could not confirm ...") instead of
  guessing. Mark any claim you could not support with a source using `[unverified]` or
  `[unverified: short reason]` right after it. The site shows these as visible flags.
- Numbers are given as ranges with a citation, for example "typically 0.02-0.1 mm [2]".
  Say what the range depends on.
- Name real products and tools only when you are confident they exist.

## The running example

A robotic line that assembles an airline cheese plate. Each plate is a fiber tray with a
grape bunch on the stem, about four apple slices, one or two wrapped cracker packs, three
cheese wedges, and a clear lid. Target is about 200 plates an hour, in a 36-40 F
(about 2-4 C) room, with food-safe, IP67 washdown equipment. Stations in order: tray
denester, grape pick, apple pick, cracker pick, cheese pick, inspection, lidding, outfeed.
One robot pick station per ingredient.

## Concept files (`NN-slug.md`)

```markdown
---
area: 7
slug: classical-software
title: Classical robot software
---

# Classical robot software

One or two intro paragraphs: what this area covers and where it shows up on the cheese
plate line.

## Coordinate frames and transforms
id: frames
requires: dof, encoder
aka: transform, pose, TF

### Plain
...
### Where the analogy breaks
...
### Precise
...
### On the cheese plate line
...
### Elsewhere
...
### Why it exists
...
### Connects to
- [[inverse-kinematics]] — why they connect
### Real products and tools
- **ROS 2 tf2** — what it is and does
### Common misconception
**Misconception:** ...

**Reality:** ...
### Key numbers
- Typical value: 1-3 ms per cycle, depending on ... [2]
### Code sketch
```text
pseudocode
```
### Sources
1. [Title of page](https://example.com/page) — publisher; what it supports
```

Rules:

- The metadata lines (`id:`, `requires:`, `aka:`) come immediately after the `##` heading,
  one per line, before any blank line. `id` must be listed in `knowledge/registry.md`.
  `requires:` lists concept ids a learner must understand first (may be empty:
  `requires: none`). Keep it to direct prerequisites only, and never create a cycle.
- Required `###` sections, in this order: Plain, Where the analogy breaks, Precise,
  On the cheese plate line, Elsewhere, Why it exists, Connects to, Real products and tools,
  Common misconception, Sources.
- Optional sections: Key numbers, Typical specs, Code sketch. Place them after Common
  misconception and before Sources.
- Area 12 concepts that describe a company type also require: Sells, Buys from, Sells to,
  Job functions, Example companies (place them before Sources).
- `[[id]]` links to another concept and must resolve to a registered id.
- `[n]` cites item n of that concept's Sources list. Every concept needs at least one
  source with a real URL you have actually seen.
- "Job functions" items use `- **Role name** — what this person does day to day`.
- "Typical specs" is a table (used by the showroom):

```markdown
| Spec | Typical range | Source |
|---|---|---|
| Payload | 3-20 kg | [1] |
| Reach | 500-1800 mm | [1] |
| Repeatability | 0.02-0.1 mm | [2] |
| Speed | ... | [2] |
| Example models | ... | [3] |
```

- "Code sketch" is one fenced code block of pseudocode or real code with comments, showing
  what the software actually does. Expected for most concepts in areas 7, 8, and 9.
- Plain stays 2-4 sentences. Precise is usually 1-4 short paragraphs.

## Glossary (`glossary.md`)

```markdown
# Glossary

## A
- **Absolute encoder** — A position sensor that knows the joint angle at power-up without
  moving. See [[encoder]].
```

Each entry is one line starting `- **Term** —`. Definitions bottom out in ordinary words.

## Dependency graph (`dependency-graph.md`)

Generated by the build script from `requires:` lines. Do not edit by hand.

## Simulation files (`sim/*.md`)

These hold the ride stops, questions, puzzles, workbench text and model data, town map, and
showroom. Every fact or number in them must also appear in a concept file (cite the concept
id); sim files only restate and stage reviewed knowledge. Numbers that are modeling
assumptions rather than facts are labeled as illustrative in the text or in a `note` field.

### Ride files (`sim/ride1-tray.md`, `sim/ride2-signal.md`, `sim/ride3-rescue.md`, `sim/ride4-lesson.md`)

```markdown
---
ride: ride1
title: The tray
order: 1
teaches: 6
---

# Ride 1: The tray

## Intro
### Plain
...
### Precise
...

## Stop: denester
title: Tray denester
cargo: Empty fiber tray
cargo_detail: One molded fiber tray, about 25 g
concepts: feeder, hygienic-design
workbench: wb6-line-balancing

### Plain
What happens to the cargo at this stop, 2-4 sentences.
### Precise
...
### Question
A question about this stop. The site shows it after the rider leaves the stop.
- [ ] A wrong option :: why it is wrong
- [x] The right option :: why it is right
- [ ] Another wrong option :: why it is wrong

## Puzzle
title: Pick a gripper for each ingredient
type: match

### Prompt
...
### Data
```json
{ ... }
```
### Debrief
Shown after the puzzle is solved.
```

Stop metadata:

- `cargo` (required, at most 40 characters): the tag shown above the cart.
- `cargo_detail` (optional): one short line shown under the tag.
- `concepts` (required): concept ids this stop teaches. The first is the main one.
- `workbench` (optional): a workbench id whose booth stands at this stop.
- `delay_ms` (required on ride 3, optional elsewhere): the delay this stop adds, as a number
  or a range like `5-15`. The site shows the midpoint and the range.
- `mode` (ride 2 only): `both` (default), `classical`, or `learned`.
- `replaces` (ride 2 learned stops only): the classical stop ids this learned stop collapses.

Every stop needs Plain, Precise, and Question. Questions have 3 or 4 options, exactly one
`[x]`, and every option has a `::` explanation. Do not start an explanation (here or in a puzzle's
`why`) with "Right." or "Wrong.": the site shows the verdict next to it.

Puzzle types and their `### Data` JSON:

- `choice`: `{"options": [{"text": "...", "correct": true, "why": "..."}]}` with exactly one
  correct option.
- `match`: assign one option to each row.
  `{"options": [{"id": "vacuum", "label": "Vacuum cup"}],
    "rows": [{"item": "Apple slice", "answer": "vacuum",
              "why": {"vacuum": "why right", "soft": "why wrong", "...": "..."}}]}`
  Every row has a `why` entry for every option id.
- `order`: `{"items": [{"id": "denester", "label": "Tray denester", "why": "why it is here"}]}`
  listed in the correct order; the site shuffles them.
- `budget`: choose improvements to reach a target within a budget.
  `{"start_ms": 420, "target_ms": 150, "budget": 10, "unit": "effort points",
    "options": [{"id": "...", "label": "...", "saves_ms": 60, "cost": 3, "why": "..."}]}`
  At least one combination must meet the target within budget, and at least one tempting
  option must save little or nothing.

### Workbench file (`sim/workbenches.md`)

```markdown
## Workbench: wb1-dof
title: Degrees of freedom
ride: ride2
stop: arm-motion
concepts: dof, six-axis
order: 1

### Goal
### Plain
### Precise
### How to use
### What to notice
### Data
```json
{"note": "Illustrative values. ...", "...": "..."}
```
```

Workbench ids: `wb1-dof`, `wb2-ik`, `wb3-control`, `wb4-calibration`, `wb5-teleop`,
`wb6-line-balancing`.

### Town file (`sim/town.md`)

```markdown
## District: parts
title: Parts Quarter
concept: component-makers
tagline: One line
supplies: robot-row, integrators

### Plain
### Sells
### Buys from
### Sells to

## Building: harmonic-works
title: Gear works
district: parts

### About
### Job functions
- **Role** — what they do
```

`supplies:` (optional) lists the district ids this district sells to, matching its "Sells to"
section. The town map draws one unlabeled flow (delivery trucks, data cables) per entry.

### Showroom file (`sim/showroom.md`)

```markdown
## Robot: scara
title: SCARA
concept: scara
payload_kg: 1-20
reach_mm: 200-1200
speed: Up to about ... (text)
height_mm: 600

### Notes
...
### Sources
1. [Title](https://...) — what it supports
```

`payload_kg` and `reach_mm` are numeric ranges; `height_mm` is a typical body height used to
draw every robot at the same scale. `reach_mm` is measured from the base outward, like an arm's
reach; when makers list a working diameter (a delta), store half of it and say so in
`reach_text`.
Optional `reach_text:` replaces the numeric reach in the caption when `reach_mm` is not a
reach (for a mobile base, `reach_mm` is the footprint length used for drawing, and
`reach_text` says that travel is limited only by the mapped area).
