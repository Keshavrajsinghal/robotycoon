## Area 7, Classical robot software (part A): analogy and precision review

Scope: the area intro plus frames, forward-kinematics, inverse-kinematics, motion-planning, trajectory-generation, collision-checking, control-loops and conveyor-tracking. `node tools/build-content.mjs --check knowledge/07-classical-software.md` reports 0 errors and 0 warnings after these edits. No `[unverified]` flag is in scope.

The biggest problem was not the analogies. Several cheese plate examples did not match the line as the rest of the knowledge base designs it:
- The tray belt indexes: it moves one step, then stops (06 conveyor, 04 photo-eye).
- The apple and cheese stations are 4-axis deltas, and the grape station is a 6-axis arm (01 robot bodies).
- The cheese station uses a V-notch parallel gripper, not a suction cup (03 end effectors).

In this file, trays moved continuously and were tracked. Apple slices were leaned at 35° by a 6-axis arm. A 6-joint serial chain and a suction cup ran the cheese station. The examples below were moved or rewritten to match the line.

### Analogies
| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| frames | kept | — | — |
| forward-kinematics | kept | — | — |
| inverse-kinematics | kept | — | — |
| motion-planning | kept | — | — |
| trajectory-generation | kept | — | — |
| collision-checking | rewritten (same picture, corrected motion) | "Sliding cardboard cutouts around" suggests the whole sweep of a motion gets checked continuously. Planners actually check separate snapshots, and a thin obstacle can fall between two of them. That is the gap continuous collision checking closes. | Laying cardboard cutouts on a floor plan, one arrangement at a time. Break: the shapes are 3D, they change with every joint angle, and a motion is checked as snapshots. |
| control-loops | kept | — | — |
| conveyor-tracking | kept | — | — |

Notes on kept analogies:
- frames (street address system with its own north): the analogy holds. Its break was rewritten. The old break said addresses "only describe position", but Plain already gives each system its own north. The real gaps are a full 3D rotation and order dependence: rotating then shifting differs from shifting then rotating. The new break names both.
- forward-kinematics (walking directions with relative turns): this correctly predicts that each turn is relative to the current heading, and that an early error grows further out the chain. The break covers 3D axes and model error.
- inverse-kinematics (reaching for a cup on a shelf): this predicts several postures, unreachable targets and awkward stretched postures, all correct. The break covers exact computation and the discrete postures of a 6-axis arm.
- motion-planning (moving a couch through an apartment): this is the classic piano-movers picture. The break now also says the route is computed before the arm moves. Without that, a reader would expect the planner to dodge something that appears mid-motion, the way a person carrying a couch would.
- trajectory-generation (driver on a known route): this correctly predicts slowing for corners and never reaching cruise speed on a short trip (the triangle profile).
- control-loops (lane keeping): this correctly predicts lag with too little gain and zig-zag with too much. The break names feedforward and nested loops.
- conveyor-tracking (relay baton pass): this correctly predicts intercepting the runner and matching speed. The break names the key gap: the item is seen once and then dead-reckoned (tracked by counting belt travel instead of looking again).

### Other fixes
- intro: defined "deterministic". "Runs this whole stack" became "much of this stack", since most stations use taught paths, not a planner.
- intro: conveyor tracking now follows the slice on its infeed belt, not a moving tray, because the tray belt indexes.
- frames: defined re-normalized, interpolation and filtering in plain words.
- frames: the misconception Reality now has a concrete case. Yaw 179° and -179° are 2° apart, but their average, 0°, faces the opposite way.
- frames (cheese plate): "leaning 35° against the divider wall" became "turned 30° to line up with the compartment". The apple station is a 4-axis delta, which cannot tilt.
- frames (cheese plate): the slice now rides a moving belt frame and the tray frame stays put while stopped. The tf2 time-lookup example, the Connects to line and a code comment were updated to match.
- forward-kinematics: defined "serial arm" against a delta. Alpha is now defined as an angle measured around the common normal (the shortest line between the two joint axes), not just "twist". Removed "where the tool actually is", because FK gives the modeled position, not the true one.
- forward-kinematics (cheese plate): moved from the cheese station to the grape station's 6-axis arm. A 6-encoder serial chain and a suction cup do not fit the cheese delta and its parallel gripper. The tool swap is now a longer finger set (80 to 140 mm). The code comment was updated.
- forward-kinematics (cheese plate): dropped "TCP speed limits enforced near people", because the pick cells are fenced (04 sensors).
- forward-kinematics: the ABB 8-15 mm figure is now dated in the text as a 2005 brochure.
- inverse-kinematics: defined pseudoinverse and damped least squares in plain words.
- inverse-kinematics: TRAC-IK's "improved Newton-style solver" (undefined) became what the source says: an improved KDL solver that detects when joint limits have trapped it.
- inverse-kinematics (cheese plate): rewritten around the grape station. Bunches lie in a tote at random angles and the gripper must tilt under the stem, which is why that station needs 6 axes and the apple station does not. The old "late tray drifts out of reach" scenario was impossible with an indexing tray belt. It became a bunch against the far tote wall, where IK finds no usable posture. "Vacuum hose" became the soft gripper's air line.
- inverse-kinematics: a code comment still said the seed gives "the nearest posture", which contradicted the fact checker's correction to "usually one near the seed". Fixed.
- motion-planning: defined local minima.
- motion-planning (cheese plate): the cracker station's taught points are valid because the tray stops at the station. The grape bin became a tote, matching 01.
- motion-planning: the time budget is now about 4 s per apple pick after the 1-2 s tray step, matching 01 and 06. It was 4.5 s.
- trajectory-generation: defined "online" generator.
- trajectory-generation (cheese plate): the grip-limited example moved from a suction-held cheese wedge to a vacuum-held apple slice, because cheese uses a parallel gripper. The code's payload and target names changed to match.
- trajectory-generation (cheese plate): the grape pendulum mechanism is now accurate. The bunch leans back while the arm speeds up, and abrupt acceleration changes, above all the sudden end of braking, leave it swinging. The old text said only that "abrupt changes in acceleration set it swinging".
- trajectory-generation: the misconception was close to a tautology ("the fastest motion is the one at maximum speed"). It is now a belief people actually hold: that a higher speed limit makes short moves proportionally faster. Reality is tied to the 52° key number.
- collision-checking: defined capsules.
- collision-checking (cheese plate): the example now says the station runs no planner but checks each adjusted pick and place path. Before, it read as if the cheese station planned, which contradicted "most of the line needs no planner". The ACM now lets the gripper fingers touch the wedge, not a cup. The code comment was updated.
- control-loops: oscillation, instability, overshoot and saturated are now defined at first use. Overshoot and oscillation used to be defined only at the end of the paragraph.
- control-loops: added why inner loops must be faster (5-10x the outer loop's bandwidth, or they cannot keep up with its commands) and why tuning starts innermost, cited to [8].
- control-loops (cheese plate): the windup story said the arm "jumps when the cup lifts off". It now says the gripper presses the wedge harder and harder, then lingers and overshoots upward as the stored value drains away, per [6]. "Releasing the vacuum" became "opening the gripper".
- control-loops (cheese plate): the IRB 1200 cold-room claim was incomplete (see spot-checks). The text now says that model is not rated for a 2-4 °C room, and the source [7] line lists the operating range.
- conveyor-tracking (cheese plate): rewritten. The tray belt indexes, so tracking is applied to apple slices on the continuous infeed belt. The encoder count is latched at each camera image, and the delta picks while moving with the belt and places into the stopped tray. Latency at an illustrative 50 mm/s is 0.5 mm per 10 ms, so slip and calibration dominate. An unpicked slice leaves the tracking window into a catch bin.
- conveyor-tracking: the "22 mm/s continuous tray belt" key number was replaced with the infeed latency figure. The code sketch now tracks slices on the infeed belt (camera latch, intercept, pick while synchronized, place in the stopped tray). The Connects to line for frames was updated.

Flag for another owner (not edited, outside my file): 01-robot-bodies.md suggests a hygienic ABB IRB 1200 for the grape station. The IRB 1200 product specification lists +5 °C as its lowest operating ambient (+5 to +35 °C with food-grade lubrication), so it is not rated for the 2-4 °C room.

### Spot-checks of the fact check
| Claim | Source opened | Result |
|---|---|---|
| Real arm vs ideal model typically 8-15 mm from tolerances and deflection; about 0.5 mm after Absolute Accuracy | [ABB Absolute Accuracy brochure](https://library.e.abb.com/public/0f879113235a0e1dc1257b130056d133/Absolute%20Accuracy%20EN_R4%20US%2002_05.pdf) (PDF text extracted locally) | Confirmed. The text says "typically 8-15mm, resulting from mechanical tolerances and deflection" and "approx 0.5 mm". The brochure is from 2005, so the text now dates it. |
| Up to 8 IK solutions for spherical-wrist arms; FANUC CRX up to 16 | [Elias and Wen 2025, arXiv 2501.18505v2](https://arxiv.org/html/2501.18505v2) | Confirmed |
| UR real-time loop 500 Hz on e-Series and ur-Series | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | Confirmed |
| AX5000 current, speed and position control each down to 62.5 µs | [Beckhoff AX5000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax5000-digital-compact-servo-drives/) | Confirmed ("minimum 62.5 µs" for all three) |
| KUKA.ConveyorTech: up to 5 conveyors, linear and circular, 1024 components per conveyor, background sync, assembly use | [KUKA.ConveyorTech](https://www.kuka.com/en-us/products/robotics-systems/software/application-software/kuka_conveyortech) | Confirmed |
| Ruckig Community version suits cycles down to 500 µs; MIT license; Pro version; used by MoveIt 2 | [pantor/ruckig](https://github.com/pantor/ruckig) | Confirmed |
| Pilz example limits 1 m/s, 2.25 m/s², 1.57 rad/s; lead-axis synchronization; trapezoidal profiles | [MoveIt Pilz planner](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) | Confirmed |
| IRB 1200: warm-up recommended below 10 °C because of oil and grease viscosity (used to say gains may need retuning in the 2-4 °C room) | [IRB 1200 product specification p. 20, 3HAC046982-001, via ManualsLib](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=20) | Failed in context. The warm-up statement is accurate, but the same page lists manipulator operation at +5 to +45 °C (+5 to +35 °C with food-grade lubrication). The example implied the robot could run in a 2-4 °C room with only retuning. Fixed in text and in the source line. |
| Inner-loop bandwidth 5-10x the outer loop's | [Motion Control Tips](https://www.motioncontroltips.com/how-are-servo-system-velocity-control-loops-tuned/) (secondary) | Confirmed. The page also says the fastest loop is tuned first, which is now used in Precise. |
| Each inner loop must respond much faster (cited to Wikipedia PID [2]) | [Wikipedia PID controller](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) (secondary) | Partly. The cascade section describes the inner loop as faster but states no rule. The "must" is now also cited to [8], which states it. |
| EL5101: up to 1 MHz, 4 million increments/s with 4-fold evaluation, 24 V latch input | [Beckhoff EL5101](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el5xxx-position-measurement/el5101.html) | Confirmed |
| Doosan singularities: wrist (axis 5 near 0), shoulder (axes 1 and 6 in line), elbow (axis 3 near 0); joint speeds spike in linear moves, joint moves unaffected | [Doosan e-Series manual: Singularity](https://manual.doosanrobotics.com/en/user-manual/3.2.0/3-e-series/singularity) | Confirmed |
| MoveIt 2 falls back to RRTConnect when no default planner config is set | [moveit2 ompl_interface.cpp](https://github.com/moveit/moveit2/blob/main/moveit_planners/ompl/ompl_interface/src/ompl_interface.cpp) (read via gh api) | Confirmed (`default_pc.config["type"] = "geometric::RRTConnect"`) |
