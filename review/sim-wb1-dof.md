# Review: workbench wb1-dof (fragment for knowledge/sim/workbenches.md)

Independent reviewer pass on the fragment
`scratchpad/wb/wb1-dof.md` (merge step adds it to `knowledge/sim/workbenches.md`) and on
`js/workbenches/wb1-{dof,kin,draw}.js` and `css/modules/wb1-dof.css`, against concepts `dof`,
`six-axis`, `delta` (area 1), `reach` (area 1), `end-effector` (area 3), `inverse-kinematics`
(area 7), and Ride 2's `arm-motion` stop.

Checked and correct as written:
- J1 range of ±230° matches the IRB 1100 axis 1 range (six-axis). 475-580 mm matches the IRB 1100
  reach (six-axis). The 120 mm cup TCP is already marked illustrative in end-effector, and the note
  says so.
- 6 DoF for a rigid body, 4 axes for a top-down place, the delta's parallel rods keeping the plate
  level plus a fourth motor for the turn, the six-axis joint split (base, shoulder, elbow place the
  wrist; roll, bend, turn point the tool), 5-axis variants, and "every extra joint adds a motor, a
  gearbox, mass, cost, and one more source of error" all match dof, delta, and six-axis.
- The station split (apple delta, grape six-axis) is called area 1's judgment call, matching
  DECISIONS.md and the ride 2 text. The booth arm carrying a vacuum cup (not soft fingers) is stated
  in the text ("fitted here with a vacuum cup like the apple station's"), which fits a slice task.
- Concept ids are registered; `[[inverse-kinematics]]` and the Jacobian definition match area 7 and
  the glossary.
- What to notice is true for this data (checked numerically with wb1-kin.js and in the browser):
  the 4-axis set bottoms out at 0 mm and 60.0°; roll and pitch read "no"; freeing J5 over the ghost
  makes pitch "yes" and rank 5; all six free gives rank 6; 5 axes (J1, J2, J3, J5, J6) solve it;
  5 axes without J5 (J1, J2, J3, J4, J6) reach only about 69 mm / 21°; the same target leaned
  sideways (heading 90°) cannot be solved with 5 axes but can with 6, so the J4 claim holds.
- No facts in module code: on-screen strings are UI chrome and status words; joint and preset names
  and every model number come from `ctx.wb.data`; the readout heading comes from
  `content.concepts.dof.title`.

| Location | Problem | Fix |
|---|---|---|
| Plain, s2 | "The apple station's delta" uses a robot-type name with no explanation in the jargon-free level. Ride 1's Plain calls it a spider-like robot over the belt. | "The apple station's robot, a spider-like delta hung over the belt, has four:" |
| Precise, p1 | "three motors move it in x, y, and z" reads as one motor per axis. In a delta the three arm motors act together, and dof's "Where the analogy breaks" warns against a one-joint-one-direction picture. | "three motors together move it in x, y, and z". |
| How to use, bullet 1 | Said J4 and J5 "turn by themselves". J4 is held at 0 in level mode (Precise says "J4 is held still"), so the two sections disagreed. | "J4 and J5 show Level because the arm sets them itself to keep the cup pointing straight down." |
| How to use / What to notice | "the ghost" first appears in What to notice; How to use never said what to match. | New first bullet: "Match the see-through ghost slice leaning on the grapes. The slice is placed when both meters turn green." (the meters-turn-green sentence moved here). |
| How to use, bullet 3 | Said the Free/Locked/Level button sits "beside each slider". It sits in the joint's header row, above the slider. The −/+ nudge buttons at each slider's ends were not mentioned. Pressing Level also frees the joint, which was unstated. | "Press the button on a joint's row to lock or free that joint (it reads Free, Locked, or Level; pressing Level frees it)", and "turn one joint with its slider or the − and + at the slider's ends". |
| Data, note | "580 mm, inside the 475-580 mm reach" is at the edge of the range, and the comparison only works if the IRB 1100's reach is measured at the wrist center. | "the top of the 475-580 mm reach listed for the IRB 1100 (six-axis); ABB draws its working ranges at the wrist center (reach)". |

Not changed, noted:
- Module: no real bugs found, so no module edits. Start is not solved (204 mm, 86°). A greedy
  learner run of 90 jog presses in the 4-axis set ends at 4.9 mm / 60.0° with pitch and roll
  disabled; forced taps on those buttons move nothing. Pressing J5's Level button and then 11 taps
  on pitch − solves it (4.5 mm / 5.0°). `wbTest().solve()` returns true from the start and the modal
  shows `data-solved`. Reset returns to the start pose in level mode. Checked at 390x844 (touch),
  360x640 (touch, dark), and 1440x900 (mouse) with no console errors and no horizontal overflow.
  The fixture build still loads and solves.
- Pressing J4's Level button (instead of J5's) ends level mode with J5 locked; that set cannot
  solve the task. This is consistent with the text, which points to J5.
- J2 ends near 90° (limit 120°) in the solved pose; fine, but leaves little room if the target
  moves farther out.
