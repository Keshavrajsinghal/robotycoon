# Review: workbench wb2-ik (Inverse kinematics)

Independent reviewer pass on the fragment `scratchpad/wb/wb2-ik.md` (to be merged into
`knowledge/sim/workbenches.md`) and on `js/workbenches/wb2-ik.js`, `wb2-ik-model.js`, `wb2-ik-draw.js`, and
`css/modules/wb2-ik.css`. Checked against inverse-kinematics, forward-kinematics, reach, six-axis,
robot-controller, and the ride 2 stop `joint-targets`.

Checked and correct as written:
- Up to eight solutions with a spherical wrist (shoulder, elbow, wrist), keeping the solution closest to the
  current joints, IKFast "a few microseconds", the stretched-arm singularity, the reach-envelope
  misconception, and "pick another grasp or bunch" all match inverse-kinematics.
- 400/400 mm links and 80 + 80 mm wrist-to-tip come from the illustrative arm in the forward-kinematics code
  sketch (a2, d4, d6, flange-to-tool). 370-4,683 mm matches reach. Axis names and order (base, shoulder, elbow,
  wrist roll, bend, turn) match six-axis.
- The Precise text's "IK ran before the path" caveat and the setpoints on the interpolation cycle match the
  joint-targets stop.
- Data checked against the module's own solver (`kin.mjs`). At the start, both postures are inside the limits.
  At bunches 1 and 2, Elbow down breaks the shoulder limit (-71.7 and -53.1 deg against -45). Bunch 3 needs the
  wrist 862 mm out at -40 deg tilt, against 800 mm available, but only 753 mm at tilt 0. So the start is not
  solved, the naive attempts (Elbow down; trusting the straight-down ring) fail, and the lesson happens.
- Module: drawing and UI chrome only. Every number and name comes from `ctx.wb.data`, and the table caption is
  the stop title. It matches the agreed design: a six-axis arm with soft fingers at a tote. `test.solve()`
  returns true, the modal gets `data-solved`, and the start state is unsolved.

| Location | Problem | Fix |
|---|---|---|
| What to notice, bullet 1 | "Down in the tote, Elbow down would push the shoulder past its limit, so only Elbow up is usable there." False as a general claim. At tilt 0, Elbow down is within limits across x 670-760 mm in the tote (106 of 377 grid points), including (700, -400), which I confirmed in the UI by keyboard ("Reachable"), and bunch 3's own point at tilt 0. | Now: "At bunches 1 and 2, Elbow down would push the shoulder past its limit, so only Elbow up is usable there." |
| How to use, bullet 3 | "The dashed ring shows where the finger tips can reach at the current tilt." The ring ignores joint limits. 13-26% of the ring area has no usable posture, depending on tilt. | Now: "shows how far the finger tips can reach at the current tilt, before joint limits are checked." |
| How to use, bullet 2 | "let go near its numbered marker". Snapping is measured from the grasp point (26 px mouse, 36 px touch). The number badge is drawn 30 px below that point. With a mouse at container widths of about 600-640 px, letting go on the badge's center does not snap. | Now: "let go near its grasp point (the small circle just above its number)". |
| How to use, bullet 4 | The Out of reach tag and the ring turning red were not explained, though the learner meets them at bunch 3. | Added: "The Out of reach tag and a red ring mean no posture gets the finger tips there." |
| Precise p4 | "every 2 ms on Universal Robots arms" overgeneralizes. robot-controller scopes the 500 Hz loop to e-Series and UR Series. | Now: "every 2 ms on Universal Robots e-Series and UR Series arms, for example" (matching the ride stop's "for example"). |
| Precise p3 | "farther away than the upper arm plus the forearm" did not say farther from what. | Now: "farther from the shoulder than the upper arm plus the forearm can stretch". |
| Plain s2 | "There are often two ways". A real six-axis arm has up to eight. Two is only what the side view shows. | Now: "There is often more than one way" (as in the concept and stop Plain). |
| Plain s3 | "well inside the arm's reach". Bunch 3 is 47 mm inside the 800 mm ring. | Now: "inside the arm's reach". |
| Goal | "Put the soft fingers on each grape bunch ... and find the bunch the arm cannot reach" contradicted itself. | Now: "on each grape bunch the arm can reach, ... and find the bunch it cannot reach", matching the task list. |
| What to notice, bullet 4 | "the same six numbers the joint-targets stop sends". The stop sends a stream of setpoints along the path, and the table shows one pose. | Now: "one per joint, like the setpoints the joint-targets stop sends toward the motors". |
| Data note | "follow the illustrative small six-axis arm" without saying that the sketch's 50 mm elbow offset (a3) is dropped. | Added "leaving out its 50 mm elbow offset". |

Not changed, noted:
- The module has no real bugs; I left it unchanged.
- Keyboard snap: within 6 mm, with 10 mm steps. After a tap that is off the 10 mm grid, arrow keys can step past a
  grasp point (worst case 7 mm). The Go to bunch buttons cover keyboard users.
- The "find" and "grasp" tasks can be completed by pressing the bunch and posture buttons. The lesson comes from
  the feedback (Joint limit, Out of reach, red ring), not from a hard search.
- At bunch 1 in Elbow up, the wrist bend is -3.3 deg, close to the wrist singularity (axes 4 and 6 in line). This
  is not shown or claimed in a planar model, so it is harmless.
- ARCHITECTURE.md's helper list does not yet name `wb2-ik-{model,draw}.js`.

Verified with real knowledge plus the fragment (and the fixture placeholders for the other five workbenches,
so the generator's booth cross-checks pass). The build had 0 errors. Playwright checks:
- Phone 390x844 with touch: drag release on the grasp marker snaps.
- Desktop 1440x900 with mouse and keyboard: posture switch, mouse drag snap, tilt by keyboard, and keyboard path
  into the tote.
- 360x640 in dark mode: no horizontal overflow.
- No console errors. `solve()` returns true at phone and desktop.
