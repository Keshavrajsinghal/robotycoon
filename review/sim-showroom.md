# Review: knowledge/sim/showroom.md

Reviewer pass against knowledge/01-robot-bodies.md (Typical specs, Precise, cheese-line sections),
knowledge/06-cell-and-line.md (ip-rating), and knowledge/glossary.md.

Checked and correct as written: all 7 entries present in the brief's order with id = concept; every
payload_kg, reach_mm, and speed value matches area 1's Typical specs (gantry reach lower bound from
the gantry Precise section); all 25 source URLs appear verbatim in area 1; station robots called a
design choice or judgment; no [unverified] claim restated; IP wording consistent with area 6 (ratings
above X6 are separate tests, IRB 360 stainless is IP69K validated); every height except the humanoid's
labeled illustrative.

| Location | Problem | Fix |
|---|---|---|
| six-axis, Notes s4 | Citation [1, 2] sat after the illustrative drawing height, so it read as if a source supported the height. A 1,100 mm body paired with the family's 4,683 mm top reach also draws a shape no real arm has. | Moved the citation to the range clause. Added "so the drawn proportions match no single model." |
| scara, Notes s2 | Said not fighting gravity "makes it fast and very repeatable". Area 1 links the flat joints to acceleration only. Repeatability is a separate fact. | Reworded: the motors "can spend their torque on acceleration"; repeatability is stated separately. |
| scara, Notes s3 | "would need a protective cover or a different robot" is marked as a judgment call in area 1, but the label was missing here. | Added "(also a judgment call)". Moved the [1, 5] citation to the IP65 claim it supports. |
| gantry, Notes s2 | "driven directly, so it ... carries heavy loads, and repeats within ±0.02-0.1 mm" read as if direct drive causes the payload and repeatability. Area 1 says only that direct drive removes the hard joint-angle conversion. | Reworded so direct drive explains only the simpler math; payload and repeatability are separate claims. |
| gantry, Notes s4 | Gave "y strokes 1.5-14 m and z strokes 1-3 m" as the FP series' strokes. Those are the Typical specs ranges for FP and CP combined. Area 1's Precise text says the FP has y up to 14 m (one heavy variant) and z 2-3 m. Also, the 2,000 mm drawing height is low next to that 2-3 m vertical axis, and the text did not say so. | Changed to "roughly 5-10 m (its y strokes go up to 14 m on one heavy variant and its z strokes are 2-3 m) [1]". Added that 2,000 mm "is low for an FP gantry, whose vertical axis alone travels 2-3 m". Kept 2,000 mm because a taller value rescales every robot on the page. |
| mobile-robot, Notes s3 | "must stay out of the washdown zone" is stronger than area 1 ("should stay out of the washdown zone or be parked during cleaning"). | Matched area 1's wording. |
| humanoid, Notes s1 | "Mostly in field tests ..." had no date. Area 1 dates this "as of late 2026". | Added "As of late 2026". |
| mobile-robot, reach_mm: 800 | Not a reach: it is the MiR250 footprint length. The caption will still say "Reach 800 mm". | Left as is: the parser requires a number and the Notes explain it. Flagged for the drawing owner (below). |

## For the drawing owner (js/town/town.js, not changed)

- `drawRobotSide` has no `mobile-robot` or `humanoid` branch. Both fall back to the articulated-arm
  drawing, so the AMR shows as a 300 mm-tall arm with an 800 mm reach line, and the humanoid as a
  1.9 m arm. The caption also labels the AMR's footprint "Reach".
- The drawn width uses `reachMm.max`, so six-axis (4,683 mm) and gantry (10,000 mm) columns are very
  wide. The stage has `overflow-x: auto`, so this works, but the arm drawing pairs one body height
  with the family's longest reach.

Format: `node tools/build-content.mjs --check knowledge/sim/showroom.md` and the whole-tree check
both report 0 warnings, 0 errors after the fixes.
