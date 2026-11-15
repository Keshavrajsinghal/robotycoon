# Review: knowledge/sim/ride1-tray.md

Reviewer pass against knowledge/06-cell-and-line.md (all 12 concepts), 01-robot-bodies.md (intro,
dof, speed-specs, six-axis, scara, delta, gantry), 03-end-effectors.md (vacuum-gripper,
soft-gripper), 05-compute-electronics.md (estop), and 11-deployment-lifecycle.md (intro, washdown
mentions).

What already matched the concept files: every number (18 s takt, 1-2 s index, 300 mm pitch and
17 mm/s, 3.3 trays/min against 120, 250-tray magazine and 75 min, 14 trays and 4.2 min, 3.2/3.0/7.0 s
picks, 14.3/10.5/8.5/17.5 s cycles, 43%, 80%, 202/165/267 plates/h, 0.2-0.4 friction, 19 N, IP test
values, Ra 0.8 µm, IRB 1200 +5 C, IRB 360 0-45 C and IP69K, 2% = 4 plates/h, OEE 97.0/90.0/87.0/76.0%,
5-15 packs/min, 1.6 m/s x 0.35 s = 560 mm, standards and editions). Station robots match the brief
and are called a judgment call. Room temperature and the IP67 spec are consistent with area 6. Both
[unverified] flags are kept. Cargo tags are 16-39 characters and match the drawing list. All 12
area-6 concepts are main or secondary at some stop. The puzzle has a why for every option in every
row, and the trap option answers no row.

| Location | Problem | Fix |
|---|---|---|
| All questions | The site does not shuffle question options (js/ui/question.js), and 7 of 9 right answers sat in position 2. | Reordered so right answers fall at positions 2, 3, 4, 3, 1, 4, 1, 2, 4. |
| Intro, Precise | "IP67 (dust-tight and able to survive immersion)" was broader than the test. | "dust-tight, and tested for 30 minutes under 1 m of water". |
| Intro, Precise | Said the outfeed robot is a gantry, but area 1 offers "a gantry or arm at the outfeed". | Added "where area 1 would also accept an arm". |
| denester, Precise | "A feeder ... starts every automated line": a generalization no concept file makes. | "The first station on this line is a feeder ...". |
| denester, Precise | "guard" not defined. | Added "(the panels that fence off the machines)". |
| denester, Question | Option "a machine at 3% of its rating cannot fail" tempted nobody. | Reworded: "at under 3% of its rating it will barely wear, so it will seldom fail". |
| infeed, Plain | "jumps one tray-length forward": the step is the pitch (one tray position), not the tray's length. | "jumps forward one tray position". |
| infeed, Precise | "Three timing words", then four were defined. | "Four timing words". |
| infeed, Question | The 1-2 s index time had no illustrative label. | Added "(illustrative)". |
| grapes, Question | Distractor "taping the door switch shut" is not a tempting answer to "which setup keeps them safe". | Replaced with "pressing the cell's emergency stop, then reaching in". Area 5 says an e-stop is a backup to guards, and OSHA says push buttons do not isolate power. Added one sentence on this to Precise and `estop` to concepts, so the question can be answered from the stop. |
| apples, Plain | Said apples is the station everyone waits on purely from pick counts. That depends on the illustrative per-pick times: grape takes 7.0 s per pick. | Added "in this line's model". |
| apples, Precise | "the other robots spend much of each cycle waiting": four of the eight stations are not robots. | "the other stations". |
| apples, Precise | The 267 plates/h figure comes from the slow 4.0 s case (area 6 code sketch). The text did not say so. | "Even with those slow 4.0 s picks, splitting apples ...". |
| crackers, Plain | The watch comparison, with no caveat, predicts "higher number = better", which is the misconception the question tests. Also "only swings flat" ignored the up-down shaft. | Added area 6's caveat: a higher water number is not simply better, because each number is a different test. Now "lowers a suction cup". |
| crackers, Precise | "-60 kPa" not explained. | Added "(60 kPa below the room's air pressure)". |
| crackers, Question; puzzle row 4 | Stated as fact that this line is washed with hot high-pressure jets every day. Area 6 marks that kind of sanitation "typical practice" [unverified], and area 11 says only "hoses and chemicals". | Made both a premise: "Suppose the daily washdown sprays ..." and "will be sprayed with ...". |
| cheese, Plain | "The cold room slows germs but does not stop them" generalized the CDC Listeria fact to all germs. | "slows a dangerous germ called Listeria but does not stop it". |
| cheese, Precise | "Hygienic design matters most here" ranked stations without support. "The rules:" mixed the sourced design principles with area 6's practical choices (quick-release grippers, flushable vacuum paths). | "is the main lesson at this stop". Split into "The design principles: ..." and "Practical choices on this line follow from them: ...". |
| cheese, Precise | "recipe" and "takt" not defined in this text. | Defined both in parentheses. |
| inspection, Plain | The teacher comparison implies the camera catches anything wrong. Area 6's limit is that it checks only what it was set up to measure. | Added "Unlike a teacher, it checks only the few things it was set up to look for." |
| inspection, Precise | The [unverified] tracking claim was narrowed from "encoder pulses or index steps" to "index steps", which changes a flagged claim. "ideal cycle" not defined. | Restored both methods (encoder pulses defined) and kept the flag. Defined ideal cycle. |
| inspection, Question | "What actually brings that number down?" Loosening the threshold literally lowers the reject count, so a wrong option was arguably right. | Stem now asks which change means "fewer plates are made with a missing wedge in the first place". The threshold explanation now says the reject count falls but short plates do not. |
| lidding, Precise | "safety circuit" and "lid denester" not defined. | Defined both. |
| outfeed, Plain | "a building code ... sets how far from the robot that beam must be" predicts a fixed number. The distance comes from the stopping time. | The standards "give the method for working out how far away that beam must be: the slower the robot stops, the farther away the beam must sit." |
| outfeed, Precise | "safety function" not defined. | Defined it, with a light-curtain example. |
| Puzzle row 2 | "What fixes it?" with inspection as the answer goes against area 6's misconception (inspection only sorts). | Item now adds "and must not reach the aircraft", so inspection is the right answer as a sorter. |
| Puzzle debrief | "Each fix sits where its problem starts" is false for inspection. "food-zone equipment needs IP69K" was stronger than area 6. | "Most fixes ... Inspection is the exception". IP wording now matches area 6: anything sprayed directly in the food zone should be rated IP69K plus IP67. |

Checked and left as is: the IP65 wording at crackers ("a jet test, not an immersion test, so they do
not meet the IP67 spec"). It matches area 6's rule that tests above 6 do not include each other,
better than area 1's "below". Also left: "in this design the arm picks from a tote" (follows the
brief and area 1), and both reasoning-based wrong-option explanations the author flagged. Each one
follows from facts in the concept files.

## For other owners (not changed here)

- 06-cell-and-line.md, guarding, "On the cheese plate line": the 0.35 s example says "delta robot
  braking" at the outfeed. Area 1 and this ride put a gantry (or arm) there. Suggest "robot braking".
- 06 feeder (grapes "laid one by one onto their belt") and 04 depth-camera ("grape infeed", belt
  pauses) still describe a belt at the grape station. Area 1, DECISIONS.md and this ride use a tote.
- 01 scara: "IP65 ... below the line's IP67 target" suggests a ladder. Area 6 says tests above 6 are
  separate. Suggest "IP65, which does not include the IP67 immersion test".
- `wb6-line-balancing` is referenced at `apples` but sim/workbenches.md does not exist yet. The build
  only checks this once that file exists.
