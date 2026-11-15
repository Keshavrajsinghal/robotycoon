---
area: 1
slug: robot-bodies
title: Robot bodies
---

# Robot bodies

This area covers the physical shapes robots come in and the handful of spec-sheet numbers used
to compare them: degrees of freedom, payload, reach, repeatability, and speed. Each body type
(six-axis arm, SCARA, delta, gantry, cobot, mobile robot, humanoid) is a different trade
between how far it reaches, how much it carries, how fast it moves, and how precisely it
returns to a point.

On the cheese plate line the body is chosen station by station. The rate is gentle: 200 plates
an hour gives each station 18 seconds per plate, so washdown rating, gripper fit, and how the
ingredient arrives decide more than raw speed. A reasonable fit, offered as a judgment call
rather than a rule: deltas over the apple and cheese belts, a SCARA at the cracker feeder, a
washdown six-axis arm at the grape tote, a gantry or arm at the outfeed, mobile robots for
moving totes and carts, and no humanoid on the line for now.

## Degrees of freedom
id: dof
requires: none
aka: DoF, axes, joints, configuration space

### Plain
An Etch A Sketch has two knobs, so you can steer its pen in two independent ways: left-right and up-down. A robot's degrees of freedom are its independent "knobs", the number of separate motions you must set to describe exactly where every part of it is. To put a tool anywhere in a room and also point it any way you like, you need six: three for position and three for which way it faces. Robots with fewer can still do useful work, as long as the job never needs the missing motions.

### Where the analogy breaks
Each Etch A Sketch knob maps straight to one direction, but most robot joints rotate, so turning one joint swings the tool along a curve and the joints' effects mix together. Counting motors or joints also does not always give the DoF: a delta robot has many unpowered hinges but only three or four independent motions.

### Precise
A robot's degrees of freedom (DoF) are the smallest number of real-valued coordinates needed to describe its configuration (the position of every point on the robot) [1]. A rigid object floating in space has 6 DoF, three for position and three for orientation (which way it points); a rigid object sliding on a table has 3 [2]. The two common robot joints each add 1 DoF: a revolute joint (a hinge that rotates about one axis) and a prismatic joint (a slide that moves along one axis) [2]. The set of all possible configurations is called the configuration space, a space with one dimension per DoF [2].

In an open chain (links connected one after another with no loops, like a typical arm), each motorized joint adds one DoF, so a 6-joint arm has 6 DoF. In a closed chain (links that form loops, like the three arms of a delta robot that all meet at one plate), you count with Grübler's formula, which subtracts the constraints each loop adds; it assumes those constraints are independent, so it can give the wrong answer for mechanisms where they are not [2]. Spec sheets usually say "axes" instead of DoF and count the motorized ones.

The task decides how many DoF are needed. Placing a part from above onto a flat belt needs only x, y, z, and a turn about vertical: 4 DoF, which is why SCARAs and many delta robots are 4-axis machines [3, 5]. Reaching around obstacles at any angle needs 6. A seventh makes an arm redundant (more joints than the task needs), so it can move its elbow out of the way while the tool stays still [6]. Without enough DoF, some tool poses are simply impossible, however good the software is.

### On the cheese plate line
The apple station only lifts a slice off the infeed belt, carries it across, turns it to match the tray compartment, and sets it down: x, y, z plus one rotation, which a 4-axis delta or SCARA provides. The grape station is different, because bunches lie in a tote at random angles and the gripper may need to tilt to slide under a stem, which takes the wrist motions of a 6-axis arm. This split is a judgment call, not a sourced rule.

### Elsewhere
In a car plant, FANUC's catalog shows the DoF count being picked per job: its R-1000iA family, whose /100F model FANUC pitches for high-speed spot welding, comes as 6-axis models, a 5-axis /80H variant, and a 7-axis /120F-7B variant, and its small M-1iA delta comes in 3-, 4-, and 6-axis versions [3]. At the far end, Boston Dynamics lists 56 DoF for its electric Atlas humanoid [4], because legs, torso, arms, and hands each need their own motions.

### Why it exists
DoF is the first filter when matching a robot to a task: count the independent motions the tool must make, and any body with fewer cannot do the job. It also sets the size of the math problem the controller must solve to turn a desired tool pose into joint angles.

### Connects to
- [[forward-kinematics]] — turns the joint values into a tool position
- [[inverse-kinematics]] — solves the reverse problem; redundant arms have many answers
- [[joint-stack]] — each DoF is usually one stack of motor, gearbox, encoder, and brake
- [[six-axis]] — the standard 6-DoF body
- [[scara]] — a 4-DoF body built for top-down work

### Real products and tools
- **FANUC R-1000iA family** — the same arm sold in 5-, 6-, and 7-axis variants [3]
- **FANUC M-1iA** — small delta in 3-, 4-, and 6-axis versions [3]
- **ABB IRB 360 FlexPicker** — delta sold in 3- and 4-axis versions [5]
- **Boston Dynamics Atlas** — humanoid listed with 56 DoF [4]

### Common misconception
**Misconception:** More DoF is always better, so a 6-axis arm beats a 4-axis one.

**Reality:** Every extra joint adds a motor, a gearbox, mass, cost, and one more source of error. If the task only ever needs top-down motion, a 4-axis SCARA or delta often beats a 6-axis arm on the standard pick benchmark (see [[speed-specs]]); that trade is why those bodies exist.

### Key numbers
- Rigid body in space: 6 DoF; rigid body on a plane: 3 DoF [2]
- SCARA and most deltas: 3-4 axes; industrial arms: 5-7 axes, depending on the task [3, 5]
- Humanoid: 56 DoF for Atlas [4]

### Sources
1. [Modern Robotics, Chapter 2: Configuration Space](https://www.cambridge.org/core/books/modern-robotics/configuration-space/2C603CC767D055FDD57F947CE2AB0812) — Lynch and Park, Cambridge University Press; definition of degrees of freedom
2. [Configuration Space, CS 6341 Robotics lecture slides](https://yuxng.github.io/Courses/CS6341Fall2025/lecture_02_configuration_space.pdf) — Yu Xiang, UT Dallas (2025); joint DoF, 6-DoF rigid body, Grübler's formula and its independence assumption, open and closed chains, 7-joint arms
3. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022), hosted by a distributor; axis counts per model
4. [Atlas](https://bostondynamics.com/products/atlas/) — Boston Dynamics product page; 56 DoF
5. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) — ABB (2022); 3- and 4-axis variants
6. [Modern Robotics: Mechanics, Planning, and Control (preprint)](http://hades.mech.northwestern.edu/images/7/7f/MR.pdf) — Lynch and Park, Cambridge University Press (May 2017 preprint); a seventh joint makes an arm redundant, and the spare freedom can be used to avoid obstacles

## Payload
id: payload
requires: none
aka: rated payload, maximum payload, load capacity, handling capacity, payload at reach, load diagram

### Plain
A bag of flour held in your fist is easy to keep level; the same bag hung from the far end of a broom handle is hard, because the farther the weight sits from your hand, the harder it twists your wrist, and waving it around quickly is harder still. A robot's payload rating works the same way: it is the most weight the robot may carry at its wrist, but only when that weight sits close to the wrist and moves at the speeds the maker tested. The gripper counts as part of the load, like the broom's own weight, so the item you actually pick is always lighter than the headline number.

### Where the analogy breaks
You feel a heavy load and adjust without thinking. A robot plans each move using the load mass and balance point set in its controller, not what it feels, so if those numbers are wrong it keeps going with no warning while the overload damages its motors and gears [1, 9].

### Precise
Payload (also "load capacity" or "handling capacity") is the maximum mass the maker allows at the tool flange (the mounting plate at the end of the arm), counting the end effector (gripper or tool) as well as the part. FANUC's sheets call it "max. load capacity at wrist" [6]. One number hides three conditions:

- **Rated versus maximum.** Epson's GX8 SCARA lists a rated payload of 4 kg and a maximum of 8 kg, and quotes its cycle time at the rated setting [1], so loads up to 8 kg are allowed but should not be expected to hit that cycle time. Humanoids follow the same pattern: Atlas is listed at 50 kg instantaneous and 30 kg sustained [7].
- **Offset (where the center of mass sits).** The farther the load's center of gravity (its balance point) is from the flange, the larger the twisting load on the wrist, so the allowed mass drops. Universal Robots lists its UR10g-1750 cobot at 8 kg standard and 10 kg extended [4], and its chart of allowed payload against center-of-gravity offset shows what that means: 10 kg only when the balance point is within about 50 mm of the flange, 8 kg out to about 200 mm, and about 6 kg at 800 mm [3].
- **Inertia (how spread out the mass is).** A long, wide gripper is harder to spin than a compact one of the same mass. Sheets list an allowable moment of inertia at the wrist, for example 0.06-0.12 kg·m² on FANUC's SR-3iA and SR-6iA [6], and controllers ask you to enter the tool's mass and inertia; Epson's sheet tells users to set these for their load and end effector [1].

Some models add a fourth condition tied to how far the arm is stretched out: FANUC's LR Mate 200iD/14L is rated 14 kg, but its full 911 mm reach is available only below 12 kg; at full load it reaches 820 mm [2]. This is what "payload at reach" means; not every model has such a limit, so check each sheet's notes.

Gantries quote payload as force and trade it against speed: Güdel's smallest FP gantry allows 300 N (about 31 kg of weight) in its "high dynamic" setting, 500 N "optimal", and 800 N "high load" [5]. Ignoring these limits is costly: ABB warns that wrong load data, or loads outside the load diagram, can overload the robot and damage its motors, gearboxes, and structure, that the robot gives no warning when the arm load limit is exceeded, and that such robots are not covered by warranty [9].

### On the cheese plate line
At the cheese station, a gripper with three small vacuum cups might weigh a few hundred grams and each wedge a few tens of grams [unverified: illustrative masses, not measured]. On paper ABB's 1 kg IRB 360-1 could carry that, but the 3 kg IRB 360-3 leaves headroom for a heavier washdown gripper and an off-center wedge, at the cost of a slower benchmark cycle: 0.40 s versus 0.30 s with 0.1 kg [8]. With about 5-6 seconds per wedge (three wedges in each 18-second plate, less the 1-2 s the tray belt spends moving one step; see [[conveyor]]), that 0.1 s does not matter.

### Elsewhere
In a car plant, FANUC's M-2000iA/2300 is rated for 2,300 kg and FANUC describes it lifting and positioning an entire car or loading heavy castings onto machine fixtures [2]. The robot itself weighs about 11,000 kg [2], which shows how payload drives the size of everything else.

### Why it exists
Payload is the quickest filter for whether a robot can do a job at all. It also predicts size and cost, because motors, gears, and structure scale with it: FANUC's 4 kg LR Mate weighs 20 kg while its 2,300 kg M-2000iA weighs 11,000 kg [2].

### Connects to
- [[end-effector]] — the gripper's mass and size eat into payload
- [[reach]] — some models allow less load when the arm is fully stretched out
- [[gearbox]] — payload and wrist inertia limits come from gear and motor torque
- [[speed-specs]] — heavier loads lengthen cycle times
- [[servo-motor]] — the motors that must accelerate the load

### Real products and tools
- **Epson GX8 SCARA** — rated 4 kg, maximum 8 kg [1]
- **FANUC LR Mate 200iD/14L** — 14 kg, with reach reduced from 911 to 820 mm at full load [2]
- **Universal Robots UR10g-1750** — 8 kg standard, 10 kg extended, with a published payload-versus-offset chart [3, 4]
- **Güdel FP gantry** — payloads in newtons for high-dynamic, optimal, and high-load settings [5]
- **FANUC M-2000iA/2300** — 2,300 kg, the highest payload in FANUC's 2022 overview [2]

### Common misconception
**Misconception:** A robot rated for 6 kg can pick a 6 kg part.

**Reality:** The 6 kg includes the gripper, assumes the load sits close to the flange, and assumes the rated speed. A 1.5 kg gripper leaves at most 4.5 kg for the part, and less if the part hangs off-center.

### Key numbers
- Rated versus maximum on one SCARA: 4 kg rated, 8 kg maximum (Epson GX8) [1]
- Payload across body types: 0.5 kg (small deltas) to 2,300 kg (largest 6-axis arms), depending on body type and size [2]
- Wrist inertia limit on small SCARAs: 0.06-0.12 kg·m² [6]
- Payload against offset on one cobot: 10 kg within about 50 mm of the flange, about 6 kg at 800 mm (UR10g-1750) [3]
- Humanoid: 30 kg sustained, 50 kg instantaneous (Atlas) [7]

### Sources
1. [Epson SCARA GX8 datasheet](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) — Epson Singapore; rated and maximum payload, inertia settings, cycle-time conditions
2. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022); payload, reach, and mass per model, LR Mate 14L reach note, M-2000iA description
3. [UR10g-1750 Technical Data Sheet](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) — Universal Robots (updated October 2026); maximum payload and payload-versus-offset chart (10 kg up to about 50 mm, 8 kg at about 200 mm, about 6 kg at 800 mm)
4. [UR10g-1750 product page](https://universal-robots.com/products/ur10g-1750/) — Universal Robots; standard and extended payload
5. [3-Axis Gantry FP](https://www.gudel.com/products/linearaxis/fp) — Güdel; payload settings in newtons
6. [FANUC SR-3iA/SR-6iA specifications](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) — FANUC America sheet (2017), hosted by a distributor; load capacity at wrist and allowable wrist inertia
7. [Atlas](https://bostondynamics.com/products/atlas/) — Boston Dynamics; instantaneous and sustained weight capacity
8. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) — ABB (2022); cycle times per variant and payload
9. [ABB IRB 1200 product specification, load diagrams](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=24) — ABB, via ManualsLib; effects of incorrect load data, no warning on arm-load overload, warranty exclusion

## Reach and workspace
id: reach
requires: dof
aka: workspace, work envelope, working range, footprint, mounting

### Plain
Sit in an office chair without rolling it and sweep your hand around: the space you can touch is your reach. A robot's reach is the farthest its wrist can stretch from its base, and its workspace is the whole 3D shape it can touch, often a thick shell with a hollow near the base. Where you bolt the robot (floor, wall, or ceiling) decides where that shape lands in the room.

### Where the analogy breaks
You can lean and twist your body to touch more; a bolted-down robot cannot. At the edge of its reach it may touch a point only with its tool pointing one way, so the space where it can work at any tool angle is much smaller than the headline reach.

### Precise
Reach is usually the maximum horizontal distance from the robot's base axis (the vertical line it swivels around) to a reference point at the end of the arm. Makers differ on which point: FANUC footnotes that its CRX cobot reach is measured "from faceplate" (the tool mounting plate) [1], while ABB draws its working ranges at the wrist center [6], so two robots with the same listed reach can differ once a tool is attached. The gripper also moves the tool center point (TCP, the working tip of the tool) farther out.

The workspace or work envelope (every point the reference point can reach) has a shape set by the body type: a thick shell for 6-axis arms, a flat ring for SCARAs, a short cylinder under a delta (ABB quotes its IRB 360 as 1,130 or 1,600 mm across and about 250-300 mm tall) [2], and a box for gantries. The dexterous workspace (points reachable with any tool orientation) is smaller. Without checking both, a layout can look fine on paper and fail when the robot must tilt its tool at a far corner.

Two related spec terms: footprint (floor or mounting area the base needs; the UR10g-1750 base is 204 mm across [4], while the frame of an Adept Quattro delta is about 883 x 883 mm [5]) and mounting (the orientations the maker allows). ABB lists many small arms as "any angle", heavy ones as floor only, deltas as inverted (hung from above), and some arms as shelf-mounted [3]. Mounting moves the workspace in the room and can free the floor under the robot.

### On the cheese plate line
A delta hung above the apple station must cover both the infeed belt carrying slices and the tray conveyor next to it. An IRB 360 with a 1,130 mm working diameter [2] can span two belts side by side if each is a few hundred millimeters wide [unverified: belt widths are illustrative]. Its 250 mm working height is ample, since slices only rise a few centimeters. Ceiling-mounting the grape station's arm would keep the floor beneath it clear for washdown (a judgment call).

### Elsewhere
In a warehouse palletizing cell, reach is often the deciding spec: FANUC's 4-axis M-410iC palletizers reach 2,403-3,143 mm so they can build a full pallet without moving [1]. FANUC's longest-reaching M-2000iA models reach 4,683 mm [1].

### Why it exists
Reach and workspace decide whether a robot can touch every pick and place point in a cell without moving. They also drive layout: where the robot stands, how far apart the conveyors sit, and where guarding goes all follow from them.

### Connects to
- [[dof]] — the joint layout sets the workspace shape
- [[payload]] — on some models the allowed load drops near full reach
- [[inverse-kinematics]] — tells you whether a given pose is actually reachable
- [[cell-design]] — layouts are built around workspace drawings
- [[gantry]] — its box-shaped workspace grows with rail length

### Real products and tools
- **ABB IRB 360 FlexPicker** — working range quoted as a cylinder 1,130 or 1,600 mm across [2]
- **FANUC CRX-10iA and CRX-10iA/L** — 1,249 and 1,418 mm reach, measured from the faceplate [1]
- **FANUC M-2000iA/1700L** — 4,683 mm reach [1]
- **ABB IRB 1010** — 370 mm reach, ABB's smallest industrial arm [3]

### Common misconception
**Misconception:** If a point is within the listed reach, the robot can work there.

**Reality:** The listed number is the farthest single point, often reached only with the arm stretched out and the tool pointing one way. There may be a zone near the base it cannot reach at all, and the allowed payload can drop at full stretch [1].

### Key numbers
- 6-axis reach: 370-4,683 mm, depending on model size [1, 3]
- SCARA reach: 350-1,100 mm [1, 3]
- Delta working diameter: 280-1,600 mm as listed; Adept instead quotes a 650 mm radius for its Quattro, so check which one a sheet means [1, 2, 5]
- Cobot base footprint: 204 mm diameter (UR10g-1750) [4]

### Sources
1. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022); reach per model, faceplate footnote, LR Mate reach-at-payload note
2. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) — ABB (2022); working range diameter and height, inverted mounting
3. [ABB Robotics industrial robots product range](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) — ABB (2023), hosted by a distributor; reach and mounting options per model
4. [UR10g-1750 Technical Data Sheet](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) — Universal Robots (October 2026); footprint and mounting
5. [Adept Quattro s650 Robot User's Guide, specifications page](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) — Adept; reach as cylinder radius and frame footprint
6. [ABB IRB 1200 product manual, working range](https://www.manualslib.com/manual/2532790/Abb-Irb-1200.html?page=59) — ABB, via ManualsLib; working range drawn as positions at the wrist center

## Repeatability and accuracy
id: repeatability
requires: none
aka: pose repeatability, RP, pose accuracy, AP, absolute accuracy, ISO 9283

### Plain
A darts player who always hits the same spot just left of the bullseye is repeatable but not accurate. A robot's repeatability is how tightly it clusters when sent to the same taught point again and again, while its accuracy is how close it lands to a point it has only been given as numbers. Industrial robots are usually far better at the first than at the second.

### Where the analogy breaks
The player's miss is one fixed offset, so aiming a little to the right would fix every throw. A robot's accuracy error is different at every spot in its workspace and shifts with load, speed, and as the arm warms up [1, 3], so no single offset fixes it; because the error is consistent at each spot, it can instead be measured robot by robot and corrected with a calibrated model [4].

### Precise
ISO 9283 (the standard test method for industrial robot performance, 1998 edition) defines how makers measure both [2]. In the pose test, the robot visits five points on a diagonal plane inside a test cube, typically 30 times, under set load and speed conditions, while an external instrument records where it really lands [1]. Pose repeatability (RP) is the radius of a sphere around the average landing point (the barycenter) that contains nearly all landings: the mean distance from the barycenter plus three standard deviations, about a 99.7% band [1]. Pose accuracy (AP) is the distance between the commanded position and that average landing point [3]. ABB's IRB 1200 manual, for example, quotes RP measured at rated maximum load, maximum offset, and 1.6 m/s, and warns that results vary with workspace position, speed, arm configuration, approach direction, and gearbox backlash (play between gear teeth) [3].

Datasheets lead with repeatability because it is small: about 0.01-0.1 mm on most robots, rising to about 0.1-0.3 mm on the largest arms [5, 6]. Accuracy is the harder number. ABB's Absolute Accuracy brochure says a real robot typically differs from its ideal CAD model by 8-15 mm because of manufacturing tolerances and arm deflection, and that its per-robot calibration brings this to about 0.5 mm [4]. Teaching by hand (jogging the robot to a point and saving it) relies only on repeatability; programming from CAD or from a camera's coordinates relies on accuracy. Without repeatability, a taught program drifts cycle to cycle; without accuracy, an offline-programmed or vision-guided program misses until the robot and camera are calibrated.

### On the cheese plate line
A delta with 0.1 mm static repeatability [7] is far more precise than a plate needs; a cheese wedge only has to land inside its tray compartment, plausibly within a few millimeters [unverified: placement tolerance is illustrative]. The number that matters more here is repeatability while tracking a moving belt, which ABB quotes for the IRB 360 at 1.0 mm with the belt at 200 mm/s and 1.5 mm at 350-750 mm/s [7]. Accuracy matters at every vision-guided station, because the camera reports each slice's position as coordinates, so camera-to-robot calibration has to be done well.

### Elsewhere
In a car plant or any cell programmed offline in CAD, accuracy is what makes the program work on the real robot. ABB pitches its Absolute Accuracy option for this case: each robot is measured at the factory and given its own correction parameters, so a program written against the virtual robot lands within about 0.5 mm, and a replacement robot can run the same program without reteaching [4].

### Why it exists
Repeatability tells you whether a taught robot will keep doing the same thing all shift. Accuracy tells you whether you can program it from coordinates (CAD, simulation, a camera) without hand-teaching each point.

### Connects to
- [[encoder]] — joint position sensing sets a floor on repeatability
- [[gearbox]] — backlash and flex in the gears add error
- [[hand-eye-calibration]] — vision-guided picks depend on accuracy, not repeatability
- [[frames]] — accuracy errors show up as frames that do not match reality
- [[conveyor-tracking]] — moving targets have their own, larger repeatability figures

### Real products and tools
- **ISO 9283** — test method for pose accuracy and repeatability, path accuracy, and related measures [2]
- **ABB Absolute Accuracy** — per-robot calibration option; typical 8-15 mm error reduced to about 0.5 mm, per an older ABB brochure [4]
- **Laser trackers and iGPS** — external measuring systems used to run these tests; the cited study used iGPS on an ABB IRB 120 [1]
- **ABB IRB 1200** — example datasheet quoting RP of 0.02-0.025 mm under ISO 9283 conditions [3]

### Common misconception
**Misconception:** A robot with 0.02 mm repeatability will put a part within 0.02 mm of any coordinate you give it.

**Reality:** Repeatability only promises it returns to the same taught spot. Sent to a new coordinate from CAD or a camera, an uncalibrated arm can be off by millimeters; ABB puts the typical raw gap at 8-15 mm [4].

### Key numbers
- Small 6-axis arms and SCARAs: 0.01-0.025 mm [3, 5]
- Deltas: 0.03-0.1 mm; ABB cobots: 0.01-0.05 mm [5, 7]
- Largest 6-axis arms: up to about 0.27 mm (ABB IRB 7600) and ±0.18 mm (FANUC M-2000iA/2300) [5, 6]
- Uncalibrated absolute accuracy: typically 8-15 mm; calibrated about 0.5 mm [4]
- Delta conveyor tracking: 1.0-5.0 mm as belt speed rises from 200 to 1,400 mm/s [7]
- ISO 9283 pose test: 5 points, 30 cycles [1]

### Sources
1. [Experimental repeatability assessment of a metrology assisted robotic assembly system using iGPS tracking](https://espace2.etsmtl.ca/32361/1/124%20-%20Experimental%20repeatability%20assessm.pdf) — Babin, Joubair, Tahan, CSME/CFDSC/CSR 2025 congress; ISO 9283 RP definition, test points and cycles, thermal drift
2. [ISO 9283:1998 Manipulating industrial robots: performance criteria and related test methods](https://standict.eu/standards-repository/manipulating-industrial-robots-performance-criteria-and-related-test-methods) — StandICT.eu repository entry; edition and scope
3. [ABB IRB 1200 product specification, performance according to ISO 9283](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=47) — ABB, via ManualsLib; RP and AP definitions, test conditions, sources of variation
4. [Absolute Accuracy, Industrial Robot Option](https://library.e.abb.com/public/0f879113235a0e1dc1257b130056d133/Absolute%20Accuracy%20EN_R4%20US%2002_05.pdf) — ABB brochure (2005); 8-15 mm typical gap, about 0.5 mm with compensation
5. [ABB Robotics industrial robots product range](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) — ABB (2023); pose repeatability per model
6. [FANUC M-2000iA/2300](https://www.fanucamerica.com/products/robot/m-2000ia-2300) — FANUC America; ±0.18 mm repeatability
7. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) — ABB (2022); static and conveyor-tracking repeatability

## Speed, acceleration, and cycle specs
id: speed-specs
requires: payload, reach
aka: max TCP speed, cycle time, Adept cycle, 25/305/25, pick cycle, joint speed, acceleration, settling time

### Plain
A car's top speed tells you little about how quickly it gets across town, where it is always stopping and starting. Robots are the same: the top speed on the sheet is rarely reached, because most moves are short hops where speeding up and braking take most of the time. So makers also publish the time for a standard short pick-and-place loop, which is a better guide as long as you compare robots on the same loop.

### Where the analogy breaks
A car's 0-60 time is measured one standard way, but each robot maker picks its own loop, payload, and settings, so two "cycle times" may describe different trips. A robot also has to settle (stop vibrating) at each end before it lets go of a part, which a car never does.

### Precise
Spec sheets give speed in three ways. Joint speed is how fast each axis can turn, in degrees per second; ABB's small IRB 1100 lists 280-750°/s depending on the axis [5]. Maximum TCP speed (the top speed of the tool's working tip) is the fastest the tool can travel, for example 5 m/s on Universal Robots' UR10g-1750 [6]. Neither tells you how long a real move takes, because short moves never reach top speed: the time is set by acceleration (how fast speed builds), how gently the controller ramps that acceleration up and down to avoid shaking the arm, and settling time (time to come to rest within a tolerance; ABB lists 0.08-0.19 s to settle within 0.1 mm on the IRB 1100) [5].

The common benchmark is the Adept cycle, published by Adept Technology: the tool moves 25 mm up, 305 mm across, 25 mm down, then back along the same path, with a stated payload [1]. Other makers use near-copies. ABB quotes 25/305/25 mm for its deltas and 25 x 300 x 25 mm with 1 kg for the IRB 1100 [2, 5]; FANUC quotes 25-300-25 mm with 2 kg for its SCARAs [3]; Epson quotes a 300 mm across, 25 mm up round trip at rated payload in its "boost mode" [4]. The result moves a lot with payload and path: an ABB IRB 360 takes 0.30-0.60 s on the 25/305/25 loop and 0.44-0.92 s on a longer 90/400/90 loop, across variants and payloads [2]. ABB itself tells buyers to confirm real cycle times in simulation or with tests [2].

A cell designed from top speed alone will miss its rate, and one designed from a benchmark measured with 0.1 kg will miss it once a real gripper and part are attached.

### On the cheese plate line
At 200 plates an hour each station gets 18 seconds per plate, and the tray belt uses 1-2 s of that to move one step (see [[conveyor]]), so the apple station, placing four slices, has about 4 seconds per pick. A delta's benchmark loop of roughly 0.3-0.6 s [2] is a small part of that. The rest of a real pick is overhead the benchmark leaves out: the camera finding the slice, following it on the moving infeed belt, building vacuum, placing gently, and releasing. With the illustrative 3.2 s per apple pick used in [[line-balancing]], the apple station is the busiest on the line even though the delta is moving for well under a second of each pick, so the fix for a slow apple station is less overhead or a second robot, not a faster delta.

### Elsewhere
In an electronics plant assembling battery packs, where a SCARA repeats short moves all shift, small benchmark gaps add up. FANUC lists 0.29 s for its SR-6iA and 0.33 s for the smaller SR-3iA on the same 25-300-25 mm loop with 2 kg [3], so at a steady pace the SR-6iA completes about 14% more loops per hour.

### Why it exists
Cycle time decides how many robots a line needs, which is usually the biggest lever on cost. These specs let buyers estimate it before building anything, then confirm in simulation.

### Connects to
- [[cycle-time]] — robot cycle specs feed the line's cycle and takt time math
- [[trajectory-generation]] — acceleration and smoothing limits shape every move
- [[payload]] — heavier loads lengthen the benchmark cycle
- [[conveyor-tracking]] — picking from a moving belt adds tracking time and error
- [[line-balancing]] — the slowest station sets the line's pace

### Real products and tools
- **Adept cycle (25/305/25 mm)** — benchmark defined in Adept robot manuals [1]
- **ABB RobotStudio** — simulation tool ABB recommends for verifying cycle times [2]
- **Epson GX8** — 0.28-0.33 s standard cycle and 7,450-9,460 mm/s combined joint 1 and 2 speed [4]
- **Universal Robots UR10g-1750** — 5 m/s maximum TCP speed [6]

### Common misconception
**Misconception:** A higher maximum TCP speed means a faster cycle.

**Reality:** Short picks rarely reach top speed; acceleration, settling, and the gripper's grip and release times dominate. Compare benchmark cycles measured on the same loop with the same payload, then confirm in simulation [2].

### Key numbers
- Delta, 25/305/25 mm: 0.26 s with 0.1 kg (Adept Quattro) up to about 0.6 s with heavier loads (ABB IRB 360), depending on payload and variant [1, 2]
- SCARA, 25/300/25 mm: 0.28-0.33 s with 2-4 kg [3, 4]
- Small 6-axis arm, 25 x 300 x 25 mm with 1 kg: 0.42 s (ABB IRB 1100) [5]
- Cobot maximum TCP speed: 5 m/s (UR10g-1750) [6]
- Settling within 0.1 mm: 0.08-0.19 s (ABB IRB 1100) [5]

### Sources
1. [Adept Quattro s650 Robot User's Guide, specifications page](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) — Adept; Adept cycle definition and cycle times by payload
2. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) — ABB (2022); 25/305/25 and 90/400/90 cycle times, advice to verify in RobotStudio
3. [FANUC SR-3iA/SR-6iA specifications](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) — FANUC America (2017); 25-300-25 mm cycle with 2 kg, axis speeds, battery-pack assembly example
4. [Epson SCARA GX8 datasheet](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) — Epson Singapore; standard cycle time conditions and maximum operating speed
5. [IRB 1100 datasheet](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) — ABB (Rev. D, December 2019), hosted by a third party; 1 kg picking cycle, axis speeds, settling time
6. [UR10g-1750 Technical Data Sheet](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) — Universal Robots (October 2026); maximum TCP speed

## 6-axis articulated arm
id: six-axis
requires: payload, reach, repeatability
aka: articulated robot, industrial arm, 6-DoF arm, serial manipulator

### Plain
A six-axis robot is built like a human arm: a waist that swivels, a shoulder, an elbow, and a wrist that can bend and twist. With those six motions it can put a tool at almost any point within reach and point it in almost any direction, which is why it is the default "robot arm" in factories. The price of that flexibility is more motors and harder control than simpler shapes need.

### Where the analogy breaks
Your arm has seven independent motions and soft joints that give when you bump something; a standard industrial arm has six stiff joints and is bolted down. It also does nothing a program does not tell it, so it cannot improvise around a misplaced part the way you would.

### Precise
A six-axis articulated arm is a serial chain (one link after another) of six revolute joints (joints that rotate). The first three (base rotation, shoulder, elbow) mostly place the wrist in space; the last three (wrist roll, bend, and turn) mostly set which way the tool points. ABB's IRB 1100 datasheet shows the typical layout: axis 1 rotates the base through ±230°, axes 2 and 3 move the arm, and axes 4-6 are the wrist [4]. Six joints give the 6 DoF needed for any position plus any orientation, so the arm can reach into a machine, approach at an angle, or work on the side of a part.

The cost is complexity. Converting a desired tool pose into joint angles can have several solutions or none, and at singular poses (for example, where two joint axes line up) the tool cannot move in some directions at all, so near them small tool motions demand very fast joint motions [6]. Each joint carries every joint after it, which limits acceleration and adds flex on long arms; repeatability ranges from 0.01 mm on small arms to 0.1-0.27 mm on the largest [1, 3].

The family spans a huge range, from 1.5 kg tabletop arms for electronics to 2,300 kg arms that lift a car body [1, 2]. Variants include 5-axis models (one wrist motion dropped, for simpler handling), 7-axis models (an extra joint for redundancy), and versions sealed for cleanrooms, foundries, or food washdown [1, 2].

### On the cheese plate line
A washdown six-axis arm suits the grape station best in my judgment: bunches arrive tangled in a tote at random angles, and the wrist lets the gripper tilt to get under the stem. ABB, for example, offers a hygienic IRB 1200 designed for wipe-down, and for washdown with a cover, carrying 5-7 kg with 0.02-0.025 mm repeatability [1]. Check the temperature rating, though: the IRB 1200's specification lists +5 °C as its lowest operating temperature (+5 to +35 °C with food-grade lubrication), so that model is not rated for the 2-4 °C room, and the grape station would need an arm rated for the cold [7]. At 18 seconds per bunch the arm's speed is no constraint; reaching into the tote is.

### Elsewhere
In a car body shop, six-axis arms weld and handle panels: FANUC sells its R-1000iA/100F specifically for high-speed spot welding, and its M-2000iA/2300 can lift and place an entire car [2]. In machine tending, a mid-size arm such as FANUC's 25 kg M-20iD/25 reaches 1,831 mm into a machine tool to load parts [2].

### Why it exists
It is the general-purpose answer: one body that can be reprogrammed for welding, machine tending, assembly, painting, or packing. The catalogs of both ABB and FANUC are mostly six-axis models [1, 2].

### Connects to
- [[inverse-kinematics]] — needed to turn tool poses into six joint angles
- [[joint-stack]] — each of the six joints is a motor, gearbox, encoder, and brake stack
- [[cobot]] — most cobots are six-axis arms with added sensing and safety features
- [[scara]] — the simpler, faster choice when the tool only works from above
- [[motion-planning]] — six joints give many ways to reach a point, and planning picks one that avoids collisions

### Real products and tools
- **ABB IRB 1100** — 4 kg, 475-580 mm, 0.01 mm, IP40 standard with an IP67 option [4]
- **FANUC LR Mate 200iD** — 4-14 kg tabletop-size family [2]
- **FANUC M-20iD/25** — 25 kg, 1,831 mm mid-size handler [2]
- **ABB IRB 6700** — 150-300 kg, 2.6-3.2 m, IP67 standard [1]; ABB agreed in October 2025 to sell its robotics business to SoftBank, and as of November 2026 the sale had not closed and China had prohibited the purchase of the business there [5]
- **FANUC M-2000iA/2300** — 2,300 kg, 3,734 mm, ±0.18 mm [3]

### Common misconception
**Misconception:** Because a six-axis arm can do anything, it is the right choice for any pick.

**Reality:** For top-down picks from one belt to another, a SCARA or delta usually completes the standard benchmark loop faster (about 0.3 s against 0.42 s for a small six-axis arm, see [[speed-specs]]). The six-axis arm earns its cost only when the tool must tilt or reach around things.

### Key numbers
- IP rating: IP40 standard on small arms to IP67 standard on many larger ones, with hygienic and foundry options [1]
- Mounting: small arms often "any angle"; the heaviest are floor only [1, 2]
- Robot self-mass: 20 kg (4 kg LR Mate) to 12,500 kg (M-2000iA/1700L) [2]

### Typical specs
| Spec | Typical range | Source |
|---|---|---|
| Payload | 1.5-2,300 kg (tabletop 1.5-14 kg, mid-size 10-70 kg, heavy 100-2,300 kg) | [1, 2] |
| Reach | 370-4,683 mm | [1, 2] |
| Repeatability | 0.01-0.27 mm (0.01-0.03 mm on small arms) | [1, 3] |
| Speed | 0.42 s on a 25 x 300 x 25 mm loop with 1 kg (small arm); axis speeds 280-750°/s on small arms | [4] |
| Example models | ABB IRB 1100, ABB IRB 6700, FANUC LR Mate 200iD, FANUC M-20iD/25, FANUC M-2000iA/2300 | [1, 2, 3, 4] |

### Sources
1. [ABB Robotics industrial robots product range](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) — ABB (2023); payload, reach, repeatability, mounting, and protection per model
2. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022); payload, reach, mass, axes, and applications per model
3. [FANUC M-2000iA/2300](https://www.fanucamerica.com/products/robot/m-2000ia-2300) — FANUC America; payload, reach, repeatability
4. [IRB 1100 datasheet](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) — ABB (Rev. D, December 2019); axis layout, speeds, ISO 9283 performance, IP rating
5. [Update on divestment of ABB Robotics](https://resources.news.e.abb.com/attachments/published/140154/en-US/0A15DBC92198/20261105_Update_on_divestment_of_ABB_Robotics_EN.pdf) — ABB press release (November 5, 2026); October 2025 sale agreement with SoftBank, China prohibition, deal still pending
6. [Modern Robotics: Mechanics, Planning, and Control (preprint)](http://hades.mech.northwestern.edu/images/7/7f/MR.pdf) — Lynch and Park, Cambridge University Press (May 2017 preprint); multiple or no inverse kinematics solutions, kinematic singularities
7. [IRB 1200 product specification, operating requirements](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=20) — ABB (document 3HAC046982-001), via ManualsLib; manipulator ambient temperature +5 to +45 °C, +5 to +35 °C with food-grade lubrication, warm-up recommended below 10 °C

## SCARA robot
id: scara
requires: speed-specs
aka: selective compliance arm, 4-axis robot, horizontal articulated robot

### Plain
Rest your forearm flat on a table and swing it from the shoulder and elbow: your hand sweeps across the table but never leaves it. A SCARA robot moves like that, with a plunger at the "hand" that slides straight up and down and twists. It is built to pick things up and put them down from above, quickly and precisely, and little else.

### Where the analogy breaks
Your arm can lift off the table and your wrist can tilt; a SCARA's tool always points straight down. It cannot reach into the side of a machine or place a part at an angle.

### Precise
SCARA stands for Selective Compliance Assembly Robot Arm [6]. It has two rotary joints with vertical axes that swing the arm in a horizontal plane, plus a vertical slide (the shaft, which moves up and down) and a rotation of that shaft: 4 DoF in total, giving x, y, z and a turn about vertical [2, 3]. Because both arm joints swing horizontally, their motors never hold the arm up against gravity, so they can spend their torque on acceleration. FANUC's SR-6iA moves its shaft at up to 2,000 mm/s and spins it at 2,500°/s, and Epson's GX8 reaches 7,450-9,460 mm/s combined speed on its two arm joints [2, 1]. "Selective compliance" refers to the arm being stiff vertically, so it can press a part down, while allowing slight give sideways, which helps a peg find its hole [7].

SCARAs complete the 25/300/25 mm benchmark in about 0.3 s and repeat within ±0.01-0.02 mm [1, 2]. The workspace is a flat ring-shaped area with a short vertical stroke, about 200-210 mm on small FANUC models [2]. Epson offers table-top, wall, and ceiling mounting [1], and ABB sells a ceiling-mounted IRB 910INV [4]. If the task ever needs a tilted tool, a SCARA cannot be fixed in software; the motion does not exist.

### On the cheese plate line
The cracker station suits a SCARA in my judgment: wrapped packs come flat and stacked from a feeder, so the job is purely top-down, with about 8-17 seconds per pack: one or two packs per plate, in the 16-17 s left of each 18 s cycle once the tray belt has moved. The washdown room is the catch. Epson offers the GX8 in an IP65 version [1] and FANUC sells food-grade SCARA models rated IP65 [5], below the line's IP67 target, so it would need a protective cover or a different robot (also a judgment call).

### Elsewhere
In electronics and battery assembly, SCARAs insert parts, drive screws, and move small components between fixtures. FANUC shows its SR-3iA assembling battery packs [2], and Epson offers cleanroom versions that comply with ISO Class 3 (ISO 14644-1) for particle-sensitive work [1].

### Why it exists
Most assembly and packing moves are top-down, and a SCARA does exactly those with fewer joints, none of them fighting gravity. The result is a fast, very precise machine for a narrower job than a six-axis arm.

### Connects to
- [[six-axis]] — chosen instead when the tool must tilt
- [[delta]] — the other fast top-down option, hung overhead
- [[speed-specs]] — SCARAs are rated on the 25/300/25 mm benchmark
- [[dof]] — a SCARA's four DoF match the motions of a top-down pick
- [[ip-rating]] — standard SCARAs need a protected version for wet rooms

### Real products and tools
- **Epson GX8** — 450-650 mm arms, 4 kg rated and 8 kg maximum, ±0.015 mm, 0.28-0.33 s, IP65 and cleanroom options [1]
- **FANUC SR-3iA and SR-6iA** — 3 and 6 kg, 400 and 650 mm, ±0.01 mm, 0.33 and 0.29 s with 2 kg [2]
- **FANUC SR-12iA and SR-20iA** — 12 and 20 kg, 900 and 1,100 mm [3]
- **ABB IRB 920** — 6 kg, 450-650 mm, 0.01-0.02 mm [4]
- **ABB IRB 910INV** — ceiling-mounted SCARA, 1-3 kg rated [4]

### Common misconception
**Misconception:** A SCARA is just a cheaper, weaker six-axis arm.

**Reality:** It is a different design with its own strengths: on the standard pick loop it beats a small six-axis arm (about 0.3 s against 0.42 s, see [[speed-specs]]), and its repeatability is as good or better at ±0.01 mm [2]. What it gives up is any ability to tilt the tool.

### Key numbers
- Vertical stroke on small SCARAs: 200-210 mm [2]
- Wrist inertia limit: 0.06-0.12 kg·m² (FANUC SR-3iA and SR-6iA) [2]
- Protection: IP65 options (Epson GX8, select FANUC food-grade models); ISO Class 3 cleanroom option (Epson GX8) [1, 5]
- Robot mass: 17-64 kg across FANUC's SR range, counting the 3-axis /H versions [3]

### Typical specs
| Spec | Typical range | Source |
|---|---|---|
| Payload | 1-20 kg rated (some list a higher maximum) | [3, 4] |
| Reach | 350-1,100 mm | [3, 4] |
| Repeatability | ±0.01-0.02 mm | [1, 2, 4] |
| Speed | 0.28-0.33 s on a 25/300/25 mm loop with 2-4 kg | [1, 2] |
| Example models | Epson GX8, FANUC SR-6iA, FANUC SR-20iA, ABB IRB 920 | [1, 2, 3, 4] |

### Sources
1. [Epson SCARA GX8 datasheet](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) — Epson Singapore; payload, repeatability, cycle time, speeds, mounting and environment options
2. [FANUC SR-3iA/SR-6iA specifications](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) — FANUC America (2017); axes, speeds, stroke, cycle time, repeatability, wrist inertia
3. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022); SCARA range payload, reach, mass
4. [ABB Robotics industrial robots product range](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) — ABB (2023); IRB 910INV and IRB 920
5. [FANUC SR Series SCARA product info sheet](https://www.fanucamerica.com/cmsmedia/datasheets/SR%20Series%20SCARA%20Robot%20Product%20Info%20Sheet_262.pdf) — FANUC America; food-grade models with IP65
6. [Development of the SCARA](https://www.jstage.jst.go.jp/article/jrobomech/26/1/26_5/_article) — Hiroshi Makino, Journal of Robotics and Mechatronics 26(1), 2014; expansion of the acronym
7. [SCARA robot, 1978](https://robogaku.jp/en/history/business/K-1978-1.html) — The Robotics Society of Japan, robotics history archive; high vertical and low horizontal stiffness

## Delta robot
id: delta
requires: speed-specs
aka: parallel robot, spider robot, FlexPicker, parallel-link robot

### Plain
Picture three people on a balcony, each holding one end of a stiff stick, with the other three ends all joined to one small plate below. By swinging their sticks, together they can push and pull the plate anywhere underneath them, and because the people stay put and only the light sticks move, the plate can dart around very fast. A delta robot works the same way: three motors fixed in a frame over a conveyor swing three light arms that all meet at one small gripper plate. It is the classic machine for picking chocolates, cookies, and other small items off a belt.

### Where the analogy breaks
Three single sticks joined at the plate would let it tip and wobble. In a delta, each arm reaches the plate through a pair of parallel rods, like the paired arms of a desk lamp, and those pairs hold the plate level at all times, so it can slide in any direction but never tilt; turning the gripper takes a fourth motor and a telescoping shaft [7].

### Precise
A delta is a parallel robot: several arms connect the fixed base to the same moving plate, forming closed loops, instead of one arm chained joint to joint [6]. Three motors on the base each swing an upper arm, and each upper arm reaches the plate through a pair of light parallel rods that keep the plate level, so it can only move in x, y, and z. A fourth motor usually spins the tool through a telescoping shaft to add a turn about vertical [7]. ABB sells its IRB 360 in 3- and 4-axis versions, FANUC sells deltas in 3-, 4-, and 6-axis versions, and ABB's IRB 365 adds a fifth axis [1, 2, 4].

With the motors on the base, the moving mass is small, so the plate can accelerate very hard: an IRB 360 completes the 25/305/25 mm loop in 0.30 s with 0.1 kg, and an Adept Quattro in 0.26 s [1, 3]. The trade-offs are low payload (0.5-15 kg across ABB and FANUC parallel robots), a shallow working zone (about 250-300 mm tall on the IRB 360), and a large overhead frame [1, 2, 4]. Deltas are mounted inverted (hung from above) [1, 4], which keeps the belt below clear. Static repeatability is 0.03-0.1 mm, but while tracking a moving belt ABB quotes 1.0-5.0 mm depending on belt speed [1, 4].

### On the cheese plate line
The apple and cheese stations suit deltas in my judgment: slices and wedges are light, flat, arrive on a belt, and need only top-down placement plus a turn to fit the compartment, which a 4-axis delta provides. The stainless washdown IRB 360 is IP69K validated for washing with industrial detergents and high-pressure hot water, with smooth surfaces and lubricant-free joints [1], which matters more on this line than its speed. Its 0-45 °C ambient rating covers the 2-4 °C room [1]. At 200 plates an hour a delta is far faster than the line needs: its motion takes a fraction of a second per pick, and most of each pick is camera, vacuum, and waiting (see [[speed-specs]]). That unused speed is a cost to weigh, not a technical problem.

### Elsewhere
ABB lists confectionery, ice cream, meat and fish, pet food, and medical products among its delta packing applications, with stainless versions for meat and dairy washdown [5]. A typical setup has a camera over the infeed belt finding each item and the delta picking it on the move, which ABB supports with its PickMaster vision software and conveyor-tracking controllers [1].

### Why it exists
High-speed, light pick-and-place from moving belts is one of the most common packaging jobs, and serial arms are slower on that loop (see [[speed-specs]]). The delta trades payload and working height for speed.

### Connects to
- [[conveyor-tracking]] — deltas usually pick from moving belts
- [[camera-2d]] — a camera over the infeed belt tells the delta where each item is
- [[vacuum-gripper]] — the most common delta end effector
- [[hygienic-design]] — stainless washdown deltas exist for food
- [[scara]] — the table-mounted alternative for top-down work

### Real products and tools
- **ABB IRB 360 FlexPicker** — 1-8 kg, 1,130 or 1,600 mm working diameter, 0.1 mm, IP54, IP67, and IP69K versions [1, 4]
- **ABB IRB 390 FlexPacker** — parallel robot for heavier packing: 15 kg with 4 axes or 10 kg with 5 axes [4]
- **FANUC M-1iA, M-2iA, M-3iA, and DR-3iB** — 0.5-12 kg deltas in 3-, 4-, and 6-axis versions [2]
- **Adept Quattro s650** — 2 kg parallel robot with a 0.26 s Adept cycle at 0.1 kg [3]; Omron bought Adept in 2015 [8] and now sells the Quattro 650H/HS: up to 15 kg on its fixed, non-rotating platform but 6 kg (650H) or 3 kg (650HS) with a rotating one, and a 0.30 s Adept cycle at 0.1 kg on the 650H [9]

### Common misconception
**Misconception:** Deltas are fast, so they are the right choice for any high-speed pick.

**Reality:** They are fast only for light loads in a shallow zone: the IRB 360's working height is about 250-300 mm and its heaviest version carries 8 kg [1]. Tall stacks, heavy cases, or tilted placements need a different body.

### Key numbers
- Mounting: inverted, hung from a frame [1]
- Frame footprint: about 883 x 883 mm (Adept Quattro s650) [3]
- Robot mass: 120 kg standard, 145 kg stainless (IRB 360) [1]
- Conveyor tracking repeatability: 1.0 mm at 200 mm/s up to 5.0 mm at 800-1,400 mm/s [1]

### Typical specs
| Spec | Typical range | Source |
|---|---|---|
| Payload | 0.5-15 kg | [2, 4] |
| Reach | 280-1,600 mm working diameter as listed; working height about 250-300 mm (IRB 360) | [1, 2] |
| Repeatability | 0.03-0.1 mm static | [1, 4] |
| Speed | 0.26-0.60 s on the 25/305/25 mm loop, depending on payload and variant | [1, 3] |
| Example models | ABB IRB 360 FlexPicker, ABB IRB 390 FlexPacker, FANUC M-2iA, FANUC DR-3iB/8L, Adept Quattro s650 | [1, 2, 3, 4] |

### Sources
1. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) — ABB (2022); variants, cycle times, repeatability, tracking, stainless IP69K option, mounting, environment, mass
2. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022); delta range payload, reach, axes
3. [Adept Quattro s650 Robot User's Guide, specifications page](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) — Adept; payload, footprint, Adept cycle times
4. [ABB Robotics industrial robots product range](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) — ABB (2023); IRB 360, IRB 365, and IRB 390 specs
5. [Robots for the packaging industry](https://library.e.abb.com/public/90cbaf37724492a4c1257b6700492591/Robots%20for%20packaging%20industry_robotics_Discrete%20automation%20and%20motion%20division_ABB.pdf) — ABB brochure (older edition); delta applications and stainless washdown versions
6. [Configuration Space, CS 6341 Robotics lecture slides](https://yuxng.github.io/Courses/CS6341Fall2025/lecture_02_configuration_space.pdf) — Yu Xiang, UT Dallas (2025); open versus closed chains
7. [US 4976582: Device for the movement and positioning of an element in space](https://patents.google.com/patent/US4976582A/en) — Reymond Clavel, US patent (1990); three base-driven arms, parallel linking bars that keep the plate's orientation fixed, telescopic arm for tool rotation
8. [OMRON completes acquisition of Adept Technology](https://www.sec.gov/Archives/edgar/data/0000865415/000110465915072496/a15-21600_1ex99da1h.htm) — OMRON press release filed with the SEC (October 23, 2015)
9. [Quattro 650H/HS datasheet](https://assets.omron.com/m/7010d1b816f4776f/original/Quattro-650H-650HS-Datasheet.pdf) — Omron; current Quattro payload per platform type (15/12 kg fixed, 6/3 kg rotating), Adept cycle times, repeatability

## Gantry (Cartesian) robot
id: gantry
requires: dof, payload
aka: Cartesian robot, linear robot, XYZ robot, portal robot, linear axis

### Plain
An arcade claw machine moves its claw left-right and forward-back on rails overhead, then drops it straight down. A gantry robot is the industrial version: a frame of straight rails with carriages that slide in each direction, carrying a tool that moves up and down. Make the rails longer and the robot covers more ground, which is why gantries can span whole machine bays.

### Where the analogy breaks
A claw machine is deliberately loose and imprecise. An industrial gantry is stiff and servo-driven, and can return to the same point within a few hundredths of a millimeter while carrying hundreds of kilograms [1].

### Precise
A gantry or Cartesian robot moves on three prismatic axes (linear slides), one each for x, y, and z [4], sometimes with a rotation added at the tool. Each motor drives one coordinate directly, so there is no hard conversion from tool position to joint positions. The workspace is a box whose size is set by rail length rather than arm length: Güdel's FP series offers strokes of roughly 5-10 m in x, up to 14 m in y on one heavy variant, and 2-3 m in z [1].

Payload is quoted as force and traded against speed. Güdel's FP ranges from 300 N (about 31 kg) on the smallest size in its high-dynamic setting to 31,250 N (about 3.2 tonnes) on the largest in its high-load setting [1]. Per-axis top speeds are 75-225 m/min (1.25-3.75 m/s), accelerations 2-10 m/s², and repeatability ±0.02 mm on most sizes, ±0.1 mm on the heavy FP-5-HP [1]. Güdel's CP specs show the fine print: the load may sit at most ±50 mm off the z-axis center, and payload is derated once the z-stroke passes 1.0-1.6 m, because a long vertical axis hangs out like a lever [2].

Gantries come as 1-axis, 2-axis, and 3-axis systems [3]. Their limits are physical: the frame occupies the whole space above the work, and the tool can only come down from above.

### On the cheese plate line
A gantry suits the outfeed in my judgment if the plates go into open-top containers, such as racks, trolley drawers pulled out for loading, or cases laid out across a wide area: it lifts each lidded plate off the line and lowers it in from above, and the frame overhead keeps the floor clear for carts and washdown. If plates must slide sideways onto shelves inside a closed trolley, a gantry cannot do it, because its tool only comes down from above; that job needs an arm. For the light ingredient picks, a delta does the same top-down job in a much smaller frame.

### Elsewhere
In machining plants, gantries load and unload machine tools spread along a line, and in logistics they palletize and move crates; Güdel lists machine loading, palletizing, packaging, assembly, and battery handling among FP uses [1]. Güdel also sells floor tracks that carry a six-axis arm along a line, effectively adding one long linear axis to the arm [3].

### Why it exists
Some jobs need a work area far larger than any arm can reach, or heavy loads moved precisely in straight lines. Adding rail length grows a gantry's workspace almost without limit, while an arm's reach is fixed by its link lengths.

### Connects to
- [[dof]] — each prismatic axis adds one DoF
- [[payload]] — gantry payloads are quoted in newtons and traded against speed
- [[reach]] — the workspace is a box set by stroke lengths
- [[servo-motor]] — each axis is a servo-driven linear drive
- [[packaging-machines]] — gantries often sit at the outfeed, loading cases

### Real products and tools
- **Güdel FP** — 3-axis gantry, 300-31,250 N, strokes up to about 10 m in x, ±0.02 mm [1]
- **Güdel CP** — compact 3-axis gantry for machine loading, 300-5,000 N, ±0.02 mm [2]
- **Güdel ZP and EP** — 2-axis and 1-axis gantries [3]
- **Güdel TrackMotion Floor (TMF)** — floor track that carries a six-axis robot along a line [3]

### Common misconception
**Misconception:** Gantries are crude and imprecise compared with robot arms.

**Reality:** Güdel quotes ±0.02 mm repeatability on most FP and CP sizes [1, 2], in the same range as many small six-axis arms. They look simple because each axis does one thing, which is the point.

### Key numbers
- Load offset limit: ±50 mm from the z-axis center (Güdel CP) [2]
- Payload derating above 1.0-1.6 m of z-stroke, depending on size (Güdel CP) [2]

### Typical specs
| Spec | Typical range | Source |
|---|---|---|
| Payload | about 30-3,200 kg (300-31,250 N), depending on size and speed setting | [1] |
| Reach | strokes up to about 10 m in x, 1.5-14 m in y, 1-3 m in z | [1, 2] |
| Repeatability | ±0.02-0.1 mm | [1, 2] |
| Speed | 75-225 m/min per axis (1.25-3.75 m/s), 2-10 m/s² | [1] |
| Example models | Güdel CP, Güdel FP, Güdel ZP | [1, 2, 3] |

### Sources
1. [3-Axis Gantry FP](https://www.gudel.com/products/linearaxis/fp) — Güdel; payload, stroke, speed, acceleration, repeatability, applications
2. [3-Axis Gantry CP](https://www.gudel.com/products/linearaxis/cp) — Güdel; payload, stroke, speed, repeatability, eccentricity and derating limits
3. [Güdel home page](https://www.gudel.com/) — Güdel; 1-, 2-, and 3-axis gantry families and robot floor tracks
4. [Configuration Space, CS 6341 Robotics lecture slides](https://yuxng.github.io/Courses/CS6341Fall2025/lecture_02_configuration_space.pdf) — Yu Xiang, UT Dallas (2025); prismatic joints add 1 DoF

## Collaborative robot (cobot)
id: cobot
requires: six-axis
aka: cobot, collaborative robot, power and force limiting, PFL

### Plain
A car's power window stops and reverses when it feels your hand in the way. A collaborative robot, or cobot, is a robot arm built on the same idea: it senses when it bumps into something and stops, so it can work near people with less fencing or none. Cobots are also made easy to set up, often by pulling the arm by hand to show it a motion.

### Where the analogy breaks
A power window only has to be safe in one way, closing on a hand. A cobot carries tools and parts, and a blade, a hot glue gun, or a sharp part in its gripper can hurt someone before any bump detection reacts.

### Precise
A cobot is a robot designed for collaborative applications, where a person and the robot share a workspace; the 2025 edition of the robot safety standard ISO 10218 drops the term "collaborative robot" and judges safety by the risk assessment of the whole application [7]. The feature that defines most cobots is power and force limiting (PFL): the robot senses contact through joint torque or motor current, or a force-torque sensor at the wrist, and caps its speed and force so a collision stays below body-region pain thresholds, first published in ISO/TS 15066 and now carried for 29 body regions in ISO 10218-2:2025 [7]. Universal Robots' UR10g-1750 shows what this looks like on a datasheet: 23 configurable safety functions certified to EN ISO 13849-1 and EN ISO 10218-1, and a built-in force-torque sensor at the tool flange with a ±150 N range [3].

Physically, most cobots are six-axis arms with rounded covers, low mass, and joint sensing; ABB's YuMi IRB 14000, listed with 14 axes, is a two-armed exception [4]. Across the Universal Robots, ABB, and FANUC ranges, payloads run 0.5-35 kg, reaches 500-1,813 mm, and repeatability ±0.01-0.1 mm [1, 2, 4, 5]. Listed maximum TCP speeds of 3-5 m/s [1, 2] are not usable at full value next to people; the application's risk assessment and biomechanical limits set lower ones [7]. PFL is not the only way the standard lets a person and a robot share space: it also describes hand guiding (a person steers the arm by hand) and speed and separation monitoring (sensors track how close a person is, and the robot slows, then stops, as they approach). For faster applications, speed and separation monitoring or plain fencing often remains a better choice than PFL [7]. Without PFL and the safety functions, the same arm would need fences or light curtains like any industrial robot.

### On the cheese plate line
A cobot could fit a spot where a person also works, such as a manual rework table after inspection, if the risk assessment allows (a judgment call). Check protection before choosing one for the washdown room: Universal Robots' g-Series is rated IP65 [9] and ABB's GoFa IP54 [4], both below the line's IP67 target. At 18 seconds per plate, a cobot's speed limits are not a problem.

### Elsewhere
Machine tending is a typical cobot job, because the arm can be taught by hand and moved between machines. Enabled Robotics, for example, mounts a cobot arm on a MiR250 mobile base to tend machines and restock supplies [6].

### Why it exists
Fencing a robot costs floor space and money and makes small, changing jobs hard to automate. Cobots trade some speed and payload for the ability to work near people and be redeployed quickly.

### Connects to
- [[six-axis]] — most cobots are six-axis arms underneath
- [[torque-sensing]] — joint torque sensing is how many cobots feel contact
- [[ft-sensor]] — Universal Robots' g-Series has one built into the flange
- [[safety-standards]] — ISO 10218 governs collaborative applications
- [[guarding]] — what a cobot application may be able to remove, after risk assessment

### Real products and tools
- **Universal Robots e-Series** — UR3e to UR16e, 3-16 kg, 500-1,300 mm, ±0.03-0.05 mm [1]
- **Universal Robots UR Series** — models including UR15, UR20, and UR30, 8-30 kg, up to 1,750 mm, IP65 [2]
- **Universal Robots g-Series** — UR10g-1750, UR17g-1300, and UR18g-950, successors to the UR8 Long, UR15, and UR18, all IP65; the October 2026 datasheet lists Teradyne Robotics as headquarters [3, 8, 9]
- **FANUC CRX-10iA** — 10 kg, 1,249 mm, taught by hand-guiding and a tablet interface [5]
- **ABB GoFa CRB 15000** — 5 kg, 950 mm, 0.05 mm, IP54 [4]

### Common misconception
**Misconception:** A cobot is safe to put next to people out of the box.

**Reality:** The standards treat the application, not the arm alone, as collaborative: a cobot swinging a blade or a heavy sharp part can still injure someone, so each installation needs its own risk assessment [7].

### Key numbers
- Force-torque sensing at the flange: ±150 N and ±10 Nm range (UR10g-1750) [3]
- Safety functions: 23 configurable (UR10g-1750) [3]
- Ambient temperature: 0-50 °C, with reduced performance above 35 °C (UR10g-1750) [3]
- Protection: IP54 (ABB GoFa) to IP65 (Universal Robots g-Series) [3, 4]
- Base footprint: 204 mm diameter (UR10g-1750) [3]

### Typical specs
| Spec | Typical range | Source |
|---|---|---|
| Payload | 0.5-35 kg | [1, 2, 4, 5] |
| Reach | 500-1,813 mm | [1, 2, 5] |
| Repeatability | ±0.01-0.1 mm | [1, 2, 4] |
| Speed | maximum TCP speed 3-5 m/s as listed | [1, 2] |
| Example models | Universal Robots UR3e, UR12e, UR20, UR10g-1750; FANUC CRX-10iA; ABB GoFa CRB 15000 | [1, 2, 3, 4, 5] |

### Sources
1. [e-Series](https://universal-robots.com/products/e-series/) — Universal Robots; payload, reach, repeatability, TCP speed per model
2. [UR Series](https://universal-robots.com/products/ur-series/) — Universal Robots; payload, reach, repeatability, TCP speed, IP65
3. [UR10g-1750 Technical Data Sheet](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) — Universal Robots (October 2026); safety functions and certifications, force-torque sensor, IP rating, environment, footprint
4. [ABB Robotics industrial robots product range](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) — ABB (2023); GoFa, SWIFTI, and YuMi specs
5. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022); CR and CRX specs and lead-through teaching
6. [Enabled Robotics MC250](https://mobile-industrial-robots.com/products/mir-go/enabled-robotics-MC250) — MiR Go partner page; mobile cobot for machine tending
7. [Evolution of Safety Requirements in Industrial Robotics: ISO 10218-1/2 (2011 vs. 2025) and Integration of ISO/TS 15066](https://arxiv.org/abs/2602.17822) — Hartmann et al., arXiv preprint (2026), a clause-by-clause analysis of the standard; "collaborative application" replaces "collaborative robot", risk assessment of the application, body-region limits in ISO 10218-2:2025 Annex M, hand guiding and SSM alongside PFL, and SSM or fencing as the better fit for higher speeds
8. [Universal Robots FAQ](https://www.universal-robots.com/products/faq) — Universal Robots; g-Series model names and the models they succeed
9. [UR10g-1750 product page](https://universal-robots.com/products/ur10g-1750/) — Universal Robots; all g-Series robots rated IP65

## Mobile robots and mobile manipulators
id: mobile-robot
requires: dof
aka: AMR, AGV, autonomous mobile robot, automated guided vehicle, mobile manipulator, pallet jack robot

### Plain
A robot vacuum wanders your house, maps it, and steers around chairs and feet on its own. Factory and warehouse mobile robots are the heavy-duty version: wheeled carts that carry bins, carts, or whole pallets from place to place, finding their way with laser scanners and a map. Put a robot arm on top and you get a mobile manipulator, which can drive to a shelf or machine and then pick something up.

### Where the analogy breaks
A vacuum bumping your foot is harmless; a robot carrying 250-1,200 kg must meet safety standards for driverless trucks, slow or stop for people using certified safety scanners, and dock within millimeters [1, 2]. And only one family steers around things like a vacuum: an AGV follows a fixed route and simply stops when something blocks it [6].

### Precise
Two families matter. An AGV (automated guided vehicle) follows fixed routes, typically marked by wires or magnetic strips, and stops when blocked until the obstacle is removed; an AMR (autonomous mobile robot) builds a map, localizes itself in it (works out where it is from its sensors), and plans its own route around obstacles [6]. MiR's MiR250 is a typical AMR: 250 kg payload, 2 m/s top speed, an 800 x 580 mm footprint, two SICK nanoScan3 safety laser scanners for 360° protection, two 3D cameras, and up to 13 hours of runtime at full load [1]. Docked against a marker it is accurate to ±3 mm and ±0.5° [1].

Safety is the defining constraint. MiR lists ISO 3691-4 (safety of driverless industrial trucks), RIA R15.08-1 (industrial mobile robots), and ISO 13849-1 for the MiR250 [1]. Its IP21 rating [1] suits a dry warehouse, not a washdown room.

A mobile manipulator (an arm mounted on a mobile base) adds the arm's DoF to the base's, but because the base parks only to within millimeters, the arm must re-find its target at every stop. Enabled Robotics' MC250, a cobot arm on a MiR250, uses marker-based calibration to reach about 1 mm at fixed spots such as shelves [4]. Boston Dynamics' Stretch is a purpose-built mobile manipulator that handles boxes up to 50 lb (about 23 kg) [5].

### On the cheese plate line
AMRs suit the moves around the line in my judgment: bringing totes of grapes and apple slices from the cold store to the stations and taking full carts of plates away. The MiR250's IP21 rating [1] means it should stay out of the washdown zone or be parked during cleaning. Its rated ambient range is 5-40 °C [1], so it is not rated for the 2-4 °C room either; it would need to work from a warmer zone or be replaced by a cold-rated model.

### Elsewhere
In warehouses, AMRs move carts and pallets between fixed points. MiR's MiR1200 Pallet Jack lifts EU pallets up to 1,200 kg, travels at up to 1.5 m/s, and uses AI-based perception to find pallets, including shrink-wrapped ones [2]. At the loading dock, Stretch unloads trucks at what Boston Dynamics describes as hundreds of cases an hour [5].

### Why it exists
Conveyors are fixed once built, and forklifts need drivers. Mobile robots make material routes reprogrammable without either.

### Connects to
- [[lidar]] — safety laser scanners and navigation both rely on lidar
- [[fleet-management]] — software that assigns jobs to many robots and manages traffic
- [[safety-standards]] — ISO 3691-4 and R15.08 govern mobile robots
- [[humanoid]] — legged mobile robots aimed at spaces built for people
- [[hand-eye-calibration]] — mobile manipulators re-measure their target at each stop

### Real products and tools
- **MiR250** — 250 kg, 2 m/s, ±3 mm marker docking, IP21 [1]
- **MiR600 and MiR1200 Pallet Jack** — pallet movers for up to 600 kg and 1,200 kg [3, 2]
- **Enabled Robotics MC250** — cobot arm on a MiR250 for machine tending and restocking [4]
- **Boston Dynamics Stretch** — mobile box-handling robot for boxes up to 50 lb [5]

### Common misconception
**Misconception:** An AMR knows exactly where it is, so an arm on top can pick as precisely as a fixed robot.

**Reality:** The base parks within a few millimeters at best (±3 mm at a marker for the MiR250), while a fixed arm repeats within hundredths of a millimeter. Mobile manipulators close the gap by re-measuring at each stop with markers or cameras [1, 4].

### Key numbers
- Runtime: up to 13 h at maximum payload, 17.5 h empty (MiR250) [1]
- Charging: a 10-minute charge gives about 2 h 40 min at maximum payload (MiR250) [1]
- Protection: IP21 (MiR250) [1]

### Typical specs
| Spec | Typical range | Source |
|---|---|---|
| Payload | 250-1,200 kg for AMR carts and pallet movers; on a mobile manipulator the arm sets the pick payload | [1, 2, 3] |
| Reach | travel limited only by the mapped area; footprint 800 x 580 mm (MiR250) | [1] |
| Repeatability | ±3 mm and ±0.5° docking at a marker; about 1 mm at marked spots with a mobile manipulator | [1, 4] |
| Speed | 1.5-2.0 m/s | [1, 2, 3] |
| Example models | MiR250, MiR600, MiR1200 Pallet Jack, Enabled Robotics MC250, Boston Dynamics Stretch | [1, 2, 3, 4, 5] |

### Sources
1. [MiR250 specifications](https://mobile-industrial-robots.com/products/robots/mir250/specifications) — Mobile Industrial Robots; payload, speed, footprint, docking accuracy, sensors, runtime, IP rating, operating temperature, safety standards
2. [MiR1200 Pallet Jack](https://mobile-industrial-robots.com/products/robots/mir1200-pallet-jack) — Mobile Industrial Robots; payload, speed, AI pallet detection, ISO 3691-4
3. [Mobile Industrial Robots home page](https://mobile-industrial-robots.com/) — MiR; product range including MiR600 payload and speed
4. [Enabled Robotics MC250](https://mobile-industrial-robots.com/products/mir-go/enabled-robotics-MC250) — MiR Go partner page; mobile cobot tasks and 1 mm marker calibration
5. [Stretch](https://bostondynamics.com/products/stretch/) — Boston Dynamics; box weight limit and throughput claim
6. [AGV vs AMR: what's the difference?](https://mobile-industrial-robots.com/blog/agv-vs-amr-whats-the-difference) — Mobile Industrial Robots blog (a maker's explainer, not a standard); AGV and AMR definitions

## Humanoid robots
id: humanoid
requires: mobile-robot
aka: humanoid, bipedal robot, legged robot, general-purpose robot

### Plain
When you hire a temp worker, you do not rebuild the warehouse for them: they use the same stairs, shelves, carts, and tools as everyone else. Humanoid robots are built on that bet, shaped like a person so they can work in places designed for people without changing those places. They walk on two legs and use two arms, and most are still in trials or early deployments rather than everyday production.

### Where the analogy breaks
A temp worker can be shown a task once and copes with odd cases alone, while a humanoid's behavior for each task has to be built by engineers or trained into learned models, and recovering from failures and odd cases is the hard part [6]. Today's humanoids also carry less than many industrial arms and run 2-4 hours per battery [1, 3, 4].

### Precise
A humanoid is a mobile robot with a human-like body: legs for walking, a torso, two arms, and usually hands. That body needs many DoF: Unitree lists 23-43 for its G1 depending on version and 31 for its H2, and Boston Dynamics lists 56 for Atlas [3, 4, 1]. Every DoF is another motor, gearbox, and sensor stack, so a humanoid is far more complex than an arm of similar payload, and walking means it must actively balance at all times, which a bolted-down arm never does.

Published specs are thin and not comparable across makers. Payload ranges from about 2-3 kg per arm on the Unitree G1 and about 7 kg rated (15 kg peak) per arm on the H2, to 23 kg (preliminary) for Agility's Digit 5 and 30 kg sustained (50 kg instantaneous) for Atlas [3, 4, 2, 1]. Runtimes are 2-4 hours; Atlas swaps its own battery and Agility quotes a 10:1 run-to-charge ratio for Digit 5 [1, 2, 3, 4]. None of these pages publishes an ISO 9283 repeatability or a pick-cycle benchmark, so a humanoid cannot yet be compared with an arm on those specs.

Safety is unsettled. Agility describes Digit 5 as its first humanoid designed to be safe working near people, while warning that some safety features are still in development [2].

### On the cheese plate line
A humanoid does not fit any pick station on this line in my judgment: each station is a fixed, repetitive, top-down task in a washdown room, which a delta, SCARA, or arm handles with published, tested specs. A plausible future role is the flexible work around the line, such as restocking ingredient totes or clearing jams, though an AMR already covers the transport part. Atlas's IP67 rating and -20 to 40 °C range [1] show the hardware moving toward harsh rooms, but I found no humanoid rated for food washdown.

### Elsewhere
In car manufacturing, Boston Dynamics describes Atlas in a field test at a Hyundai facility doing sequencing work: re-sorting parts from supplier containers onto a dolly in the order the line needs them [1, 6]. In logistics and manufacturing, Agility shows GXO, Schaeffler, and Toyota Motor Manufacturing Canada as customers and claims 65,000 hours of production experience for Digit [5].

### Why it exists
Most workplaces are built around human bodies, and automating them with fixed robots means rebuilding the workspace. A humanoid is a bet that one general body plus learned software can fill many such jobs without redesign.

### Connects to
- [[mobile-robot]] — humanoids are legged mobile manipulators
- [[vla-models]] — learned models that map camera images and instructions to motions, the software humanoid makers hope will generalize across tasks
- [[torque-sensing]] — balance and safe contact depend on sensing joint torques
- [[dof]] — humanoid bodies carry 23-56 DoF
- [[robot-datasets]] — new humanoid skills are trained from collected demonstration data

### Real products and tools
- **Boston Dynamics Atlas** — electric humanoid, 56 DoF, 1.9 m, 90 kg, 30 kg sustained payload, IP67, 4 h battery with self swap [1]
- **Agility Robotics Digit 5** — in development as of 2026; preliminary 23 kg payload and 2.2 m reach [2]
- **Unitree G1** — 1.32 m, about 35 kg, 23-43 DoF, about 2-3 kg per arm, listed at US$13,500 [3]
- **Unitree H2** — 1.82 m, about 70 kg, 31 DoF, about 7 kg rated per arm, listed at US$29,900 [4]
- **Others** — Figure markets Figure 03 for household tasks and Apptronik markets Apollo for manufacturing and logistics; neither home page gives availability or deployment details [7, 8]

### Common misconception
**Misconception:** Humanoids are general-purpose workers that can replace people on any line today.

**Reality:** As of late 2026 the leading products are in field tests, early deployments, or development, with sustained payloads of about 2-30 kg and 2-4 hour batteries [1, 2, 3, 4]. On a fixed, repetitive station, a purpose-built arm comes with published, tested speed and repeatability; a humanoid does not yet.

### Key numbers
- DoF: 23-56 [1, 3, 4]
- Robot mass: about 35-90 kg [1, 3, 4]
- Listed prices: US$13,500 (G1) and US$29,900 (H2), tax and shipping excluded [3, 4]
- Atlas operating range: -20 to 40 °C, IP67 [1]

### Typical specs
| Spec | Typical range | Source |
|---|---|---|
| Payload | about 2-3 kg per arm (Unitree G1) to 30 kg sustained, 50 kg instantaneous (Atlas) | [1, 3] |
| Reach | 2.2-2.3 m (Digit 5 preliminary, Atlas); standing height 1.32-1.9 m | [1, 2, 3] |
| Repeatability | not published by these makers | [1, 2, 3, 4] |
| Speed | no pick-cycle figure published; battery runtime 2-4 h | [1, 3, 4] |
| Example models | Boston Dynamics Atlas, Agility Digit 5, Unitree G1, Unitree H2 | [1, 2, 3, 4] |

### Sources
1. [Atlas](https://bostondynamics.com/products/atlas/) — Boston Dynamics; DoF, payload, reach, height, mass, IP rating, battery, Hyundai field test
2. [Digit 5](https://www.agilityrobotics.com/solutions/digit-5) — Agility Robotics; preliminary payload, reach, run-to-charge ratio, safety statements
3. [Unitree G1](https://www.unitree.com/g1) — Unitree; height, mass, DoF, arm payload, runtime, price
4. [Unitree H2](https://www.unitree.com/H2) — Unitree; height, mass, DoF, arm payload, runtime, price
5. [Agility Robotics home page](https://agilityrobotics.com/) — Agility Robotics; customer logos and production-hours claim
6. [Getting Real with Humanoids](https://bostondynamics.com/blog/getting-real-with-humanoids/) — Boston Dynamics blog (2025); what part sequencing involves, behavior authoring with reinforcement learning and foundation models, failure recovery and edge cases as the hard part
7. [Figure](https://www.figure.ai/) — Figure AI home page; Figure 03 marketed for household tasks
8. [Apptronik](https://apptronik.com/) — Apptronik home page; Apollo marketed for manufacturing, warehousing, and logistics
