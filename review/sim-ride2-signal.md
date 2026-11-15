# Review: knowledge/sim/ride2-signal.md

Reviewer pass against areas 1, 2, 3, 4, 5, 7, the learned-policy, vla-models and on-robot-inference
concepts of area 8, and area 6 (ip-rating, cycle-time, line-balancing, conveyor) for the timing model
and IP wording.

Checked and correct as written:
- Station robot mapping is stated as a design judgment.
- 2-4 C room, and IP67 versus IP69K wording, match area 6.
- 18 s takt, 1-2 s index, and apple as the illustrative bottleneck match areas 1 and 6.
- Every other number matches its concept file: PR-G, scan, Zivid, YOLO26n-seg, hand-eye lever arm, IK
  solutions, IKFast, 2 ms UR cycle, 50-62.5 us current loop, cascade ratio, 3.8-4.9x peak torque,
  brake ratio, 0.09 mm per arcminute, IRB 1200 repeatability and +5 C limit, 8-15 mm and 0.5 mm
  accuracy, pi0 73 ms, 40-130 W, dew point, QC-77, and mGrip IP69K.
- The area 8 [unverified] flag is kept. Area 2's unverified claim about drives in the cabinet is not
  restated.
- Cargo tags are 16-34 characters and match the drawing list. Modes, `replaces:` and workbenches are
  as specified.
- Every question has one defensible answer.

| Location | Problem | Fix |
|---|---|---|
| joint-targets, Plain and Precise; puzzle items `trajectory` and `joints` | Internal contradiction. The trajectory stop says the planner searches joint space, and that trajectory generation gives a position for every joint at every tick. The joint-targets Plain then said "the plan so far says where the gripper should be" and that this stop converts it. The puzzle said IK "turns the path into six joint angles" and that the timed path "says where the tool must be". A learner would come away thinking IK runs on a finished joint-space path. | Plain now says IK is what let the planner aim at the grasp, and that this stop is where six angles go out to the motors. Precise now says IK ran before planning (to get the goal posture) and runs per point on straight-line moves (area 7). It keeps the 2 ms setpoint cycle. Puzzle `trajectory` why: the timed path fixes every joint's position at each moment. `joints` label: "Six joint angles go out every few milliseconds". This matches area 8's `sample(traj)`. The debrief is updated to match. |
| drive, Plain s3 | "can take away the motor's push the instant a guard door opens". This contradicts the Precise text and the question's right answer (a category 1 stop: brake first, then remove torque). It would steer learners to the wrong option A. | Now: "If a guard door opens, the arm is braked to a stop first, and then a separate safety wire takes away the motor's push." |
| policy, Precise p3 | One [unverified] flag covered the whole list: servo drives and their loops, limits, the e-stop and guarding circuit, and the PLC interlock. Area 8 flags only the limits and e-stop/guarding claim. The drives' loops are sourced (Dynamixel), and the PLC interlock is "usually" in area 8. | Split the sentence. The drives keep their loops, and the PLC "usually" keeps its interlock. Limits and the e-stop/guarding circuit stay in certified hardware and the controller, with the [unverified] flag attached to that sentence only. |
| arm-motion, Question | The right option rested on the delta "runs the standard pick loop faster". Area 1 says the delta's speed barely matters at 200 plates/h (the delta section, and speed-specs on the apple station). The answer was correct but taught the wrong reason. | The right option now leads with the DoF fit: top-down is fully covered, and the extra joints add motors, mass, cost and error sources. The explanation keeps 0.3 s versus 0.42 s but says that speed matters little at 18 s per plate. Option A's explanation was reworded so the two do not repeat each other. |
| intro, Plain s2 and Precise (Timing) | "The whole pick takes a few seconds". Area 6's illustrative model puts the grape pick at 7.0 s, including vision retries, which is more than "a few". | Plain now says "several seconds". Precise now cites area 6's illustrative 7.0 s grape pick, then the apple bottleneck. |
| sensor, Precise p2 / Question | The question is about the stereo square law, but the stop text never mentions stereo error growth, only area 4 does. Learners could answer only from the concept page. | Added one sentence: stereo depth error grows with the square of distance, so mounting height matters. The question still needs the 2 mm to 8 mm computation. |

Not changed, noted:
- Area 4's grape camera sits over a "grape infeed", while the brief, area 1 and area 7 use a tote. The
  sim attributes the Zivid numbers to "area 4's grape example" and labels them illustrative. That is
  fine here, but areas 4 and 5 should be reconciled upstream.
- Grasp: two designs are shown (area 3 fingers around the bunch, area 7 across the stem), both as
  judgment calls. This is consistent with both files.
- Area 7 coverage: 13 of its 16 concepts appear. conveyor-tracking (the tote is static), ros2 and
  vendor-languages are absent, which is reasonable for this pick.
- The grasp and joint-targets questions both test the "inside reach does not mean reachable" idea from
  different angles. This is acceptable, but slightly redundant.

Format: `node tools/build-content.mjs --check knowledge/sim/ride2-signal.md` and the whole-tree check
(4 rides, 42 stops) both report 0 warnings, 0 errors after the fixes.
