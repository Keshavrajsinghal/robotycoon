# Review: workbench wb3-control (fragment for knowledge/sim/workbenches.md)

Independent reviewer pass. It covers the fragment
`scratchpad/wb/wb3-control.md`, checked against control-loops (area 7) and servo-drive,
servo-motor and gearbox (area 2), payload (area 1), trajectory-generation (area 7), and ride 2
stop `drive`. It also covers the module `js/workbenches/wb3-control.js`, `wb3-control-sim.js` and
`wb3-stage.js`.

Checked and correct as written:
- PID terms, derivative on the measurement, filtering, anti-windup (clamp and pause while
  saturated), cascaded position/velocity/current loops, and the 5-10x inner-loop rule all match
  control-loops. The 50-62.5 µs current loop matches servo-drive. The 500 Hz UR e-Series setpoint
  rate matches control-loops. Gravity compensation as feedforward matches control-loops, and
  entering load mass in the controller matches payload. The step being harsher than a planned
  move matches trajectory-generation.
- Data arithmetic: 0.04 + 0.5 x 0.3^2 = 0.085 kg·m². 0.5 x 9.81 x 0.3 = 1.47, about 1.5 N·m.
  0.25 ms x 8 = 2 ms. drive_loop_hz 4000 equals the position-loop dt in control-loops' code
  sketch (250 µs) and is slower than the quoted 62.5 µs cycles, as the note says.
- Every sim claim in How to use and What to notice was re-run in Node against the shipped sim:
  - The start gains (48, 0, 2) pass with empty fingers (2.5 %, 0.18 s, 0.04°).
  - With the bunch they fail all three cards (9.9 %, not settled, 0.85°).
  - Raising Kp makes overshoot worse (Kp 80: 24.5 %).
  - Raising Kd removes overshoot but the fingers stop 0.83-0.93° short.
  - Raising Ki before Kd makes overshoot worse (about 13.7 %).
  - With Ki = 0, no Kp/Kd setting on a 101 x 101 grid passes.
  - (48, 160, 3) passes with the bunch and settles late (0.50 s) with empty fingers.
  - About 20 % of a 21^3 slider grid passes with the bunch.
  - The search used by solve() finds (70, 50, 3.75) in about 50 ms. With empty fingers that
    setting sits about 0.46° past the target and does not settle, as notice 4 says.
- The module agrees with the agreed design. The stage draws the six-axis forearm, the wrist
  joint, three soft fingers and a hanging bunch. There is no apple slice. There are no facts in
  code: labels, units and status words only, and every number comes from `ctx.wb.data`. The DATA
  SCHEMA comment matches the data and the fixture section.

| Location | Problem | Fix |
|---|---|---|
| Plain, s1 | "The drive at this stop keeps each joint on target" reads as one drive for all joints. Ride 2 and servo-drive say one drive per motor. | Now "Each joint's drive keeps that joint on target". |
| Plain, s4 | "so settings that suit empty fingers stop working" states the bench's exaggerated payload effect as a general fact. | Now "can stop working". |
| Precise, p2 | "The innermost current loop runs every 50-62.5 µs" stated a universal value. servo-drive gives it only for the drives and reference designs checked (and ride 2 says "in the drives checked"). | Added "in the drives checked". |
| Precise, p3 | "At a wrist the payload is a large share of what the motor swings, which is why the bench models one" is an unsourced general claim, and the sentence was garbled ("models one"). | Removed. The bunch-inertia sentence before it already carries the point for the bench's numbers. |
| Precise, p3 and note | 0.5 kg for an airline-plate bunch invites "half a kilo of grapes?". No concept file gives a bunch mass. The text said only "illustrative". | Precise now says "an illustrative 0.5 kg, a round number chosen so the effect is easy to see". The note says the same. No unsourced claim about real bunch masses was added. |
| Data note | Said the 300 mm "to the bunch is gearbox's illustrative grape-station geometry". Gearbox puts the gripper, not the bunch, about 300 mm from the wrist joint. | Now says it reuses gearbox's illustrative geometry (gripper about 300 mm from the wrist joint), so it is illustrative too. |

Not changed, noted:
- Precise p1 says too much P causes "overshoot ... and oscillation". control-loops lists
  oscillation and instability for P, and overshoot under I. Oscillation already means passing
  the target repeatedly, and the sim shows it, so the wording was kept.
- The 6 N·m torque limit and 0.04 kg·m² joint inertia are small for an industrial wrist. They
  are labeled illustrative and the text does not present them as real.
- At start the status reads "Spec met" (empty fingers), which is by design. "Solve with:
  Holding a grape bunch" sits beside it, and the solved state requires the bunch.
- The Kd readout shows 2 decimals for a 0.025 step (3.825 shows as 3.83). This is cosmetic.
- ARCHITECTURE.md does not list the new helper `wb3-stage.js` (the author's note). It was left
  alone because other agents are editing that file.

Module: no real bugs found, and no module changes were made.

Verification:
- Real knowledge plus all six workbench fragments built clean (0 warnings, 0 errors).
- Playwright with the content route was run at:
  - 390x844 touch
  - 1440x900 mouse
  - 360x640 touch
  - dark mode, desktop and phone
- Results:
  - No console errors and no page overflow.
  - The initial state is not solved.
  - The naive Kp-to-max attempt fails.
  - Kd only (keyboard) leaves the fingers 0.83° short, visible with Zoom.
  - `wbTest().solve()` returns true and the modal gets `data-solved`.
  - On a phone, tapping Kd then Ki solves it by hand.
  - Stage, cards and both plots fit on one phone screen, so plot scrubbing shows the wrist.
- `node tests/smoke.mjs --fixture --only=ride2` passed (all checks, exit 0).
