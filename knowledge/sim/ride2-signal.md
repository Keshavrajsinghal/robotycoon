---
ride: ride2
title: The signal
order: 2
teaches: 1, 2, 3, 4, 5, 7
---

# Ride 2: The signal

## Intro
### Plain
This ride follows one grape-bunch pick at the grape station, from the moment a tray arrives to the moment soft fingers let go of the bunch in the tray. The whole pick takes several seconds; the line gives this station 18 seconds per plate. Your cart carries the signal as it changes form: a pulse of electricity, light, a picture, numbers, current in a motor, and finally motion. A switch lets you watch the thinking part done two ways: classical, as a chain of hand-written steps, or learned, as one trained network.

### Precise
The grape station's robot is a washdown six-axis arm (six rotating joints, built like a human arm) with soft fingers, picking bunches that lie at random angles in a tote. That choice is a design judgment from area 1, not a sourced rule. The same judgment gives the apple and cheese stations deltas (fast overhead robots whose gripper plate stays level) with vacuum cups, the cracker station a SCARA (a four-axis arm that works only from above) with a vacuum cup at the feeder, and the outfeed a gantry (a robot that slides on straight rails). The room is 36-40 F (about 2-4 C). The line spec asks for IP67 washdown equipment; area 6 notes that IP67 proves dust-tightness and 30 minutes under 1 m of water, not survival of hot high-pressure jets, which is what IP69K tests.

Timing: 200 plates per hour is an 18 s takt (the time budget per plate). The tray belt indexes (moves one step, then stops) for 1-2 s of each cycle. The grape station makes one pick per plate; area 6's illustrative model gives that pick 7.0 s, retries on tangled bunches included, so it has time to spare. In the same model the apple station, with four picks per plate, is the bottleneck (the slowest station, which sets the pace of the whole line).

Several machines share the work. The line PLC (programmable logic controller, the line's industrial computer) decides when trays move. A vision PC (a computer that runs the camera software) finds the bunch and reports where it is. The robot controller (the cabinet computer that runs the arm) turns that answer into arm motion. A separate safety system can stop all of them, whatever their software wants.

The classical/learned toggle changes only the middle of the ride. Classical mode shows five software stops, each producing something an engineer can print and check: an outline, a 3D point, a grasp pose, a timed path, and six joint angles. Learned mode replaces those five with one policy stop. The sensing before it, and the drive, joint, arm, and gripper after it, are the same in both modes.

## Stop: trigger
title: Tray arrives
cargo: Tray-in-place pulse
cargo_detail: One on/off signal from a photo-eye to the PLC
concepts: photo-eye, plc, industrial-network, plc-programming

### Plain
A fiber tray slides into the grape station and blocks a beam of light, like the beam across a shop doorway that chimes when someone walks through. The sensor sends one yes-or-no signal: a tray is here. The line's controller stops the tray and tells the grape robot it may start.

### Precise
A retroreflective [[photo-eye|photo-eye]] (a sensor that shines light at a reflector and switches when an object blocks the return beam) spans the tray conveyor. A washdown model such as Keyence's PR-G switches in 0.5-1 ms and is rated IP68 and IP69K (sealed against immersion and against hot high-pressure jets). Its output is one on/off wire into the [[plc|PLC]] (programmable logic controller, the line's rugged industrial computer).

The PLC reads its inputs once per scan (one pass of read inputs, run program, write outputs), so the change can wait up to a full scan before the program sees it. That costs nothing here: the tray belt indexes (moves one step in 1-2 s, then stops), and the next tray is 18 s away.

The PLC program is a step chain (numbered steps, each waiting for a condition before moving on). It holds the tray and trades handshake bits with the robot controller over the industrial network (cables that exchange a few bytes with each device every few milliseconds): "tray in place" out, "pick done" back later. Without this signal, nothing tells the robot that a tray is actually there to receive the bunch.

### Question
The photo-eye switches in under 1 ms, and the PLC scans every 10 ms (an illustrative figure). Which statement is right?
- [ ] The PLC program sees the tray within 1 ms, because the sensor is the only delay :: The PLC copies its inputs only once per scan, so the change can wait up to a full scan before the program sees it.
- [ ] The PLC reacts the instant the beam is blocked, like an interrupt handler :: A normal PLC looks at its inputs only at the start of each scan; signals too fast for that go to dedicated counter modules.
- [x] Up to about 11 ms, which is harmless because the tray is stopped :: Total delay is sensor time plus up to one scan, and delay only turns into position error when something is moving. Here the tray is stopped and the next one is 18 s away.
- [ ] A faster photo-eye would bring the delay close to zero :: The scan is the larger delay; systems that need exact timing use inputs that timestamp the change, such as Beckhoff's EL1252 with 1 ns resolution.

## Stop: light
title: Light on the tote
cargo: Light bouncing off the tote
cargo_detail: Station lighting reflected from the bunches toward the camera
concepts: camera-2d, depth-camera

### Plain
Before there can be a picture, light has to land on the grapes and bounce back toward the camera. Like a passport photo booth, the station keeps its lights fixed, so every picture comes out the same and any difference means the grapes really changed. Glare and deep shadows ruin a picture no matter how good the camera is.

### Precise
Machine vision treats lighting as part of the [[camera-2d|camera]] system, not an accessory; Keyence ranks it among the most important factors for reliable inspection. A dome light (a bowl of diffuse light around the scene) removes glare on shiny or curved surfaces. Low-angle light makes texture stand out, and a backlight (light from behind) gives a crisp outline.

Depth cameras bring light of their own. A structured light camera (one that projects known patterns and measures how surfaces bend them) lights the tote with its patterns. Many stereo cameras (two cameras a fixed distance apart) add an infrared projector that paints an invisible texture onto blank surfaces, so the two views can be matched. Wet or shiny spots can bounce that light straight into the sensor and saturate pixels (overload them to pure white, so they carry no distance).

Without controlled light, glare, shadows, and weak contrast cause most vision failures, and more pixels do not fix them.

### Question
The detector keeps missing bunches that sit in glare from the overhead lamp. Which change is most likely to fix it?
- [x] Different lighting, such as a diffuse dome light :: Diffuse light removes glare on shiny or curved surfaces, and lighting is among the most important factors in reliable vision.
- [ ] A camera with twice the pixels :: More pixels do not remove glare, and on the same cable twice the pixels roughly halves the frame rate.
- [ ] Recalibrating the camera's lens :: Calibration produces numbers that correct where each pixel points; it changes nothing in the picture, glare included.
- [ ] Switching to a depth camera, which does not depend on lighting :: Depth cameras use light too, and shiny or wet spots can saturate their pixels and leave holes in the depth.

## Stop: sensor
title: Camera
cargo: Camera image of the tote
cargo_detail: A color picture plus a distance for every pixel
concepts: depth-camera, camera-2d

### Plain
The camera turns the light into a picture: a grid of tiny squares, each recording how bright one spot was. The grape station's camera also measures how far away each spot is. That is like a map that shows the height of every hill, not just its outline, so the software knows how tall each heap of grapes is.

### Precise
A camera's image sensor is a chip covered in a grid of light-measuring squares called pixels. Exposure time (how long the pixels collect light for each picture) sets blur: a moving item smears by its speed times the exposure, and a tote of bunches sits still. Most industrial cameras use triggered acquisition (each picture starts when a signal arrives on an input wire), so every picture belongs to a known moment.

A [[depth-camera|depth camera]] adds a distance to each pixel, giving a point cloud (a list of 3D points). Area 4's grape example uses a structured light camera (it projects known patterns and measures how surfaces bend them), such as the Zivid 2+ MR60. From 600 mm it sees about 570 x 460 mm with about 0.24 mm between points, enough to find a stem a few millimeters thick (illustrative design). The catch: the scene must hold still for each capture, which takes 25-1500 ms depending on settings. Stereo cameras, the other common kind, have a different weakness: their depth error grows with the square of distance, so mounting height matters. The Zivid lists IP65 (proof against low-pressure water jets), so it is covered during sanitation rather than sprayed (illustrative design choice).

Without depth, the robot must assume every bunch lies at one known height, which fails as soon as bunches heap up or tilt.

### Question
To see more of the tote, someone proposes mounting a stereo depth camera twice as high. Area 4's worked example puts its depth error at about 2 mm at 1 m. What should they expect at 2 m?
- [ ] About 1 mm, since a wider view averages out the error :: Distance makes stereo depth worse, not better, which is why area 4's apple example moves its plate-mounted camera in close for the final look.
- [ ] About 2 mm, since datasheet accuracy holds at any distance :: Datasheet figures come from friendly test conditions, and stereo error changes a lot with distance.
- [ ] About 4 mm, since error doubles when distance doubles :: Doubling is the rule for a small angle error at a distance; stereo depth error grows faster than that.
- [x] About 8 mm, since stereo error grows with the square of distance :: Far objects shift fewer pixels between the two views, so the same fraction-of-a-pixel matching error costs four times the depth at twice the distance.

## Stop: detection
title: Find a bunch
cargo: Image with one bunch outlined
cargo_detail: An outline (mask) plus a confidence score
concepts: perception, onboard-compute, opencv, state-machines
mode: classical

### Plain
Software looks at the picture and draws an outline around one bunch it thinks it can pick. It works like someone sorting laundry from a heap: they do not study every thread, they decide "that one, right there" and reach. The software also says how sure it is, and if it is not sure enough, it asks for a new picture instead of guessing.

### Precise
[[perception|Perception]] (turning images into the few facts a pick needs) runs on the vision PC: an industrial PC with a GPU (a chip that does the same arithmetic on many numbers at once, which neural networks need) in the line's control cabinet.

Classical rules such as thresholding (marking each pixel as object or background by comparing it to a cutoff) work for uniform items like cheese wedges on a dark belt, but they break when objects vary. Bunches tangle and vary, so the grape station is the natural place for a trained instance-segmentation model (a network that outputs the exact pixels of each object, called a mask, plus a class and a score). A small current model, Ultralytics YOLO26n-seg, takes about 2 ms per image on an NVIDIA T4 GPU. Pipelines are assembled from libraries such as OpenCV, but the recognition comes from the model, not the library.

Each detection carries a confidence (a 0-1 score). It is not a measured probability, because modern networks tend to be overconfident, so the accept threshold is set by counting hits and misses on images from the real line. Below it, the cell's sequencing logic (a state machine or behavior tree that decides the next step) takes a new picture or skips. Without this stop, the robot does not know where the bunch actually is.

### Question
The grape model marks a bunch with confidence 0.95. What does that number tell you?
- [ ] The pick will succeed 95% of the time, so about 1 pick in 20 will fail :: It scores the detection, not the whole pick, and even as a detection score it is not a measured probability.
- [x] A score: how often 0.95 is right must be measured on the line :: The count has to come from images from the real line. Networks are often overconfident, so teams set thresholds from counted hits and misses, and recount after any change of lighting, camera, or product.
- [ ] 95% of the pixels inside the outline belong to the bunch, not the background :: The mask lists the pixels; the confidence is a separate score for the detection as a whole.
- [ ] Nothing useful, so every detection should be used whatever its score :: A low-confidence detection is a normal failure that the sequencing logic routes to a new picture or a skip.

## Stop: position-3d
title: Where is it, in robot terms
cargo: 3D point in the robot's frame
cargo_detail: x, y, z of the bunch, measured from the robot base
concepts: hand-eye-calibration, camera-calibration, frames, repeatability
workbench: wb4-calibration
mode: classical

### Plain
The camera knows where the bunch is relative to the camera, but the robot needs to know where it is relative to its own base. It is like a friend on the phone saying your keys are 30 centimeters to their left: that only helps if you know exactly where your friend stands and which way they face. Calibration measures exactly where the camera sits, so the camera's answer can become a target the robot understands.

### Precise
Camera calibration first measures the intrinsics (the camera's internal geometry: focal length in pixels and where the lens's central axis hits the sensor) and its lens distortion. With those and the depth reading, a pixel becomes a 3D point in the camera frame (an origin plus three axes fixed to the camera).

The grape camera is fixed above the tote, so the next link is [[hand-eye-calibration|hand-eye calibration]] in its eye-to-hand form (measuring the camera's pose, its position plus orientation, relative to the robot base). It is solved from many robot poses (Zivid suggests 10-20), tilted about different axes, with the robot holding a calibration board under the camera. The software then chains transforms (conversion rules between frames) by multiplication, base-to-camera times camera-to-bunch, and the order matters.

Rotation errors are the dangerous ones, because they grow with distance: 0.1° of camera tilt 600 mm away moves the point about 1 mm, and 0.5° about 5 mm. This is why camera-guided picks depend on accuracy (landing on a point given only as numbers), not just repeatability (returning to a taught point). Without this step, every measurement lands off by a fixed but unknown offset, and the robot misses consistently. A bracket knocked during washdown shifts the camera unnoticed, so a regular touch test (the robot points a sharp tool at a feature the camera located) catches drift.

### Question
During washdown, someone bumps the camera bracket and the camera tilts by 0.5°. It sits 600 mm above the bunches. What happens to the picks?
- [ ] Nothing, because the arm's repeatability of a few hundredths of a millimeter absorbs it :: Repeatability only promises a return to a taught point; camera-guided targets depend on calibration and accuracy.
- [ ] They scatter randomly by about 0.5 mm :: A moved camera gives a consistent offset, not scatter, and at 600 mm half a degree is about 5 mm.
- [ ] Recalibrating the lens intrinsics fixes it :: The lens did not change; a moved mount needs a new hand-eye calibration.
- [x] They land about 5 mm off, consistently, until hand-eye calibration is redone :: The miss is about the angle in radians times the distance, and because the error is fixed, the robot misses confidently every time.

## Stop: grasp
title: Choose the grip
cargo: Gripper pose above the stem
cargo_detail: Six numbers: position plus tilt and turn
concepts: grasp-planning, soft-gripper, inverse-kinematics, collision-checking
mode: classical

### Plain
Knowing where the bunch is does not yet say where to grab it or from which direction. The software picks a spot, often near the stem, and a direction for the fingers to come in, tilted if the bunch lies at an angle. It is like reaching into a fruit bowl: you choose your grip before your hand moves.

### Precise
[[grasp-planning|Grasp planning]] outputs a grasp pose (where the gripper's working point goes and how it is turned), an approach direction with a pre-grasp point a few centimeters back along it, and a grasp quality score (an estimate of the chance the grasp holds through the move). Bunches lie at random angles, so the pose is a full six numbers: three for position, three for tilt and turn.

This guide offers two designs, both judgment calls. Area 7 pictures fingers closing across the main stem, which needs vision to find a stem segment visible on both sides and clear of berries. Area 3 pictures three or four soft fingers closing around the bunch from above at low pressure, so vision only needs a rough center point.

Candidates the arm cannot reach (inverse kinematics finds no joint angles that put the gripper there) or whose approach would hit the tote wall (collision checking, which tests the arm's shapes against a model of the cell) are dropped, however well they score. Published learned-grasp results come mostly from household and warehouse objects, so soft, damp food needs its own testing. Without this step, perfect perception and perfect motion can still drop the bunch, because the fingers touch it in the wrong place.

### Question
The planner's top-scoring grasp needs a wrist tilt that would push a joint past its limit. What should happen?
- [x] Drop it and try the next-best candidate, without taking a new picture :: Planners rank candidates and walk down the list until one passes reach, collision, and placement checks.
- [ ] Run it anyway, since the score already accounts for everything :: The score rates the contact on the bunch, not whether the arm can get there.
- [ ] Stop the line and call a technician :: An unreachable grasp is a normal case; the software moves on to another grasp or another bunch.
- [ ] Run inverse kinematics longer until it finds an answer :: Past a joint limit there is no answer to find, and more iterations cannot create one.

## Stop: trajectory
title: Plan the path
cargo: Timed path through waypoints
cargo_detail: A collision-free route with a speed for every moment
concepts: motion-planning, collision-checking, trajectory-generation, moveit
mode: classical

### Plain
The software finds a route for the whole arm, to the bunch and on to the tray, that misses the tote walls, the camera bracket, and the other bunches. It is like carrying a couch through a furnished apartment: every part of it needs a clear route, not just your feet. Then it decides how fast to move at each moment, easing in and out so the hanging bunch does not swing.

### Precise
[[motion-planning|Motion planning]] (finding a collision-free route for the whole arm) searches configuration space (every combination of the six joint angles, where one point is a whole arm posture). The bunch's position changes from pick to pick, so the grape station runs a sampling planner such as RRT-Connect (it grows trees of random collision-free postures from the start and the goal until they join) for every pick.

Each candidate posture goes through collision checking (testing simple stand-in shapes of the arm, and of the bunch once held, against a model of the cell called the planning scene). The raw path zig-zags, so it is shortened and smoothed. Trajectory generation then adds time (position, speed, and acceleration for every joint at every tick), within limits on speed, acceleration, and jerk (how quickly acceleration changes). The jerk limit matters here: the bunch hangs from its stem like a pendulum, and an abrupt end to braking leaves it swinging, so grapes can knock loose.

MoveIt, an open-source planning framework, packages these steps; by default it uses OMPL (a library of sampling planners) and TOTG (a method that finds the fastest timing within speed and acceleration limits). A planner that sometimes takes a large fraction of a second is affordable at one pick per 18 s plate. Without planning, a taught path works only if every bunch sits in the same place, which in a tote they never do. Collision checking is a planning aid, not a safety function; certified guarding and safety circuits do that job.

### Question
Someone leaves a cleaning brush in a corner of the tote. Nobody adds it to the planning scene, and no sensor sees it. The planner reports a collision-free path. What follows?
- [ ] The arm cannot hit the brush, because the planner checked the whole path for collisions :: The checker knows only its model; an object missing from the planning scene does not exist for it.
- [ ] The planner refuses to plan because something seems wrong :: A planner senses nothing; it tests postures against the scene it was given.
- [x] The arm may hit it, because collision checking is only as good as its model :: That is why cells keep padding, physical guarding, and certified safety functions; the planner's check is a planning aid.
- [ ] Trajectory generation slows the arm near the brush :: Timing respects joint and payload limits along the path it is handed; it knows nothing about obstacles.

## Stop: joint-targets
title: Solve for the joints
cargo: Six joint angles
cargo_detail: One target per joint, resent every few milliseconds
concepts: inverse-kinematics, forward-kinematics, robot-controller
workbench: wb2-ik
mode: classical

### Plain
Motors only understand how far each joint should turn, so any gripper target in the room has to become six joint angles, one per joint. That conversion is what let the planner aim at the grasp in the first place; at this stop the angles go out toward the motors, refreshed every few thousandths of a second as the arm moves. It is like reaching for a cup on a high shelf: you pick shoulder, elbow, and wrist angles without thinking, and there is often more than one way to do it.

### Precise
[[inverse-kinematics|Inverse kinematics]] (IK: finding the joint angles that put the tool at a target position and tilt) is the reverse of forward kinematics (FK: computing where the tool is from the joint angles). A six-axis arm with a spherical wrist (its last three joint axes cross at one point) has up to eight IK solutions for one pose (position plus orientation), such as elbow up or elbow down. The software keeps the one closest to the current joints, so the arm does not flip its elbow mid-move or wind the gripper's air line around joint 6. Analytic solvers (ones that solve the arm's geometry directly by formula), such as IKFast, return every solution in a few microseconds.

IK can also return nothing. A bunch against the far tote wall may need a tilt past a joint limit, or near a singularity (a posture where the tool cannot move in some direction at all, however fast the joints turn). The software then picks another grasp or another bunch.

The ride shows IK as one stop after the path, which is a simplification. In practice IK ran earlier, when the planner turned the grasp pose into a goal posture to plan toward, and it runs again on any straight-line move (the tool kept on a straight line), where it must be solved at every point along the line. Either way, what leaves this stop is joint setpoints (target values), sent on the robot controller's interpolation cycle (the fixed beat at which it gives every joint a fresh target), every 2 ms on Universal Robots arms, for example. Without IK, a target chosen in the room cannot become motor commands.

### Question
A bunch lies inside the arm's listed reach, but against the far tote wall, and the grasp needs a steep wrist tilt. Can the arm do it?
- [ ] Yes, because any point inside the listed reach envelope is reachable :: Listed reach describes position alone; the needed tilt may be impossible at that spot.
- [ ] Yes, if the solver iterates long enough, since every pose has a solution :: IK can have no answer at all; a numerical solver can only find a solution that exists.
- [ ] No, because six-axis arms cannot tilt the gripper :: Tilting is what the three wrist joints are for, which is why this station gets a six-axis arm.
- [x] Not necessarily: IK must solve the full six-number pose within joint limits :: The answer must also stay away from singularities. Position and tilt decide together; when IK fails, the software tries another grasp or another bunch.

## Stop: policy
title: Learned policy
cargo: Action chunk: 1 s of joint targets
cargo_detail: Made from camera images plus the six joint angles
concepts: learned-policy, on-robot-inference, vla-models, onboard-compute
mode: learned
replaces: detection, position-3d, grasp, trajectory, joint-targets

### Plain
In learned mode, one trained network replaces five classical software stops. It looks at the camera pictures and the arm's own joint angles and directly outputs the next second of joint movements. Think of a line cook who learned plating by watching the head chef hundreds of times, instead of following a recipe card. The motors, the safety wiring, and the line's controller stay exactly the same.

### Precise
A [[learned-policy|learned policy]] (a neural network, millions to billions of automatically tuned numbers, that maps what the robot senses to what it does next) takes observations: the overhead and wrist camera images plus proprioception (the robot's sense of its own body, here the six joint angles from its encoders). It outputs an action chunk (a short list of future targets). In the illustrative grape setup it sends joint targets at 50 Hz and plans a fresh 1 s chunk every 0.5 s. Chunking is needed because one pass of a large network is slow: pi0, a 3.3-billion-parameter policy, takes about 73 ms on an RTX 4090 GPU (graphics processing unit, the chip that runs the network), longer than one 20 ms tick at 50 Hz.

The cost is inspectability. There is no outline, 3D point, or grasp score to print when a pick fails. Partial versions exist too, such as a learned grasp detector feeding a classical planner.

What stays outside the network: the servo drives keep closing their own feedback loops, and the line PLC usually keeps its tray-present interlock. Joint and speed limits and the e-stop (emergency stop) and guarding circuit stay in certified hardware and the robot controller [unverified: standard industry practice; no standard found that addresses learned policies directly]. A watchdog (a timer that acts when an expected signal is late) checks that each new chunk arrives in time. If the GPU stalls, the arm decelerates to a hold, the PLC marks the station faulted, and the plate is flagged for manual completion. In the illustrative setup the GPU computer sits in a sealed enclosure that must meet the line's IP67 rating, plus IP69K if sanitation crews spray it directly, and shed the heat of a module that can draw 40-130 W.

As of late 2026, most of the learned systems in this guide are research systems or pilots. For a fixed menu, a small single-task policy such as ACT (Action Chunking with Transformers) is cheaper to run and easier to validate than a VLA (vision-language-action model: a policy built on a large model pretrained on web images and text).

### Question
The policy outputs a wild joint target, far outside the arm's range. What happens next?
- [x] Hand-written joint limits clamp it, and the safety system can still stop the arm :: Learned mode replaces the decisions from pixels to joint targets; limits, safety circuits, and cell sequencing stay conventional.
- [ ] The arm follows it, because the network drives the motors directly :: The policy only outputs targets; the drives and their feedback loops do the moving.
- [ ] Nothing can catch it, because learned mode removed the robot controller's checks :: Only the five decision stops collapse into the network; limits and safety hardware stay where they were.
- [ ] The policy logs why it chose that target :: A policy is millions of numbers with no named intermediate steps, and losing those checkpoints is the main debugging cost.

## Stop: drive
title: Servo drive
cargo: Motor current waveform
cargo_detail: Current in the motor's three windings, corrected every few tens of microseconds
concepts: servo-drive, control-loops, robot-controller, industrial-network, safety-circuit, estop
workbench: wb3-control

### Plain
The target angle reaches a box of power electronics, one per motor, that meters electric current into the motor. It works like a dimmer switch that readjusts itself many thousands of times a second: it checks where the motor actually is and pushes harder or softer to keep it on plan. If a guard door opens, the arm is braked to a stop first, and then a separate safety wire takes away the motor's push.

### Precise
The robot controller sends each joint's setpoint (target value) to its [[servo-drive|servo drive]] (the power electronics that feed one motor) over an industrial network built for fixed, predictable timing, such as EtherCAT. The drive runs cascaded loops (nested feedback loops, each setting the target for the one inside it): position, then velocity, then current. Each inner loop is typically tuned to follow changes 5-10 times faster than the loop around it.

The innermost current loop runs every 50-62.5 µs in the drives checked. It uses PWM (switching the voltage on and off thousands of times a second and varying the on-time) to set the current in the motor's three windings, and that current sets torque. Each loop is a feedback rule such as PID (push back in proportion to the error, to its build-up over time, and to how fast it is changing), plus feedforward (the command already known from the planned motion). Tuned too soft, the joint lags; tuned too aggressive, it overshoots or oscillates.

Safety is wired separately. STO (Safe Torque Off: a two-channel safety input that removes the motor's ability to make torque) lets the motor coast. So when the grape cell's guard door opens, the controller first brakes the arm along its path, then torque is removed and the brakes clamp (a category 1 stop). Every station also has an e-stop (a latching red button) feeding the same safety circuit. Without the drive, nothing turns a target angle into the right current at the right instant.

### Question
The grape cell's guard door opens in the middle of a move. Which sequence is right?
- [ ] The drives apply Safe Torque Off at once, and that stops the arm on its path :: STO only removes torque; the motor coasts, and a gravity-loaded axis drops onto its brake.
- [ ] The line PLC's program stops the arm :: The line PLC can read safety signals but cannot override them; rated safety hardware does the stopping.
- [x] The arm is braked on its path under power, then torque is cut and the brakes clamp :: The controller does the braking while the motors still have power. This is a category 1 stop, the kind this design uses for its robots.
- [ ] The motors' holding brakes clamp at once and stop the moving arm, as they do every time :: Brakes are built to hold; stopping a moving arm uses up a limited budget, such as 2,000 stops on one Beckhoff motor brake.

## Stop: joint
title: Inside a joint
cargo: Torque on a turning shaft
cargo_detail: Motor twist, multiplied by the gearbox
concepts: joint-stack, servo-motor, gearbox, encoder, brake, torque-sensing

### Plain
Inside each joint, current spins a small motor very fast, and gears in front of it slow the spin and multiply its twisting force, like the barrel of a cordless drill. A sensor counts exactly how far the shaft has turned, and a parking brake clamps whenever the power goes off. The arm has six of these stacks, one per joint.

### Precise
Each [[joint-stack|joint]] is a stack of parts on one axis. The servo motor (a permanent-magnet motor whose torque is proportional to the current the drive sends) spins fast with little torque. Its peak torque, about 3.8-4.9 times its standstill torque (what it can make continuously near zero speed) on two industrial motors, is a short burst limited by heat. A gearbox (also called a reducer) with a ratio of dozens to hundreds to one trades that speed for torque; behind a 100:1 strain wave gear (a compact gear built around a thin, flexing steel cup), the motor turns 100 times per joint turn.

An encoder (a sensor that turns a shaft angle into a number) on the motor shaft feeds the drive. A multi-turn absolute encoder knows every angle at power-up after the nightly washdown, with no homing moves (moving to a reference mark to learn where the joint is). A fail-safe holding brake (it clamps whenever power is removed) sits on the motor shaft, so the gear ratio multiplies its hold: 2 Nm behind 100:1 holds roughly 200 Nm at the joint.

Gear play matters little here: about 300 mm from the wrist joint (illustrative), one arcminute (a sixtieth of a degree) moves the fingers about 0.09 mm, so the plant cares most that the joint is sealed for daily washdown. Some robots, mostly cobots (arms built to work near people), add a torque sensor after the gearbox; others estimate joint torque from motor current. Without the gearbox, a motor small enough to fit cannot lift the arm; without the encoder, the controller does not know where the joint is; without the brake, the arm sags when power is cut.

### Question
The power fails while the arm holds the bunch above the tray. What keeps the arm from folding down?
- [ ] The servo motors keep holding their last position on their own :: A servo motor holds only while it is powered and controlled.
- [ ] The encoders lock each joint at its last measured angle :: An encoder only measures the angle; it cannot hold anything.
- [ ] The gearbox's lack of play keeps each joint still without power :: Without a brake, gravity turns an unpowered joint backward through its gearbox.
- [x] Each joint's holding brake, which clamps as power drops :: The brake clamps the motor shaft, and the gear ratio multiplies its hold. It is fail-safe: a power cut, a broken cable, or an emergency stop all leave it clamped.

## Stop: arm-motion
title: The arm moves
cargo: Arm swinging into a new pose
cargo_detail: Six joints turning together
concepts: dof, six-axis, reach, payload, repeatability, speed-specs
workbench: wb1-dof

### Plain
All six joints turn together: the arm reaches into the tote, the fingers close on the bunch, and the arm swings it over to the tray. Like a human arm, it has a waist, a shoulder, an elbow, and a wrist that bends and twists, so it can reach the bunch and tilt the fingers to match how it lies. Those six separate motions are why this guide gives the grape station this kind of arm, a judgment call rather than a rule.

### Precise
[[dof|Degrees of freedom]] (DoF: the number of independent motions needed to say where every part of the robot is) decide which tool poses (position plus orientation) are possible. Placing a tool anywhere and pointing it any way takes six: three for position, three for orientation. In a six-axis arm the first three joints (base, shoulder, elbow) mostly place the wrist, and the last three mostly set which way the fingers point. The apple station only lifts, turns, and sets down flat slices, which a 4-axis delta (an overhead robot whose gripper plate stays level) can do; it cannot tilt its gripper.

Spec sheets add reach (the farthest the wrist gets, often only with the tool pointing one way), payload (the most mass allowed at the flange, the arm's mounting plate, gripper included), and repeatability (how tightly it returns to a taught point: 0.02-0.025 mm on ABB's hygienic IRB 1200). Accuracy (landing on a point given only as numbers) is far weaker: ABB puts the typical gap on an uncalibrated arm at 8-15 mm, and about 0.5 mm with its per-robot calibration.

Speed is no constraint at 18 s per bunch; reaching into the tote is. Temperature can be: the IRB 1200 lists +5 °C as its lowest operating temperature, so it is not rated for the 2-4 °C room, and the station needs an arm rated for the cold. Without six DoF, some grasp poses are impossible, however good the software is.

### Question
Why not give the apple station a six-axis arm too, since it can do everything a delta can?
- [x] Apple picks are top-down, so a 4-axis delta covers them :: Two more joints would add motors, mass, cost, and error sources the job never uses. A six-axis arm earns its cost only when the tool must tilt or reach around things, as at the grape tote. The delta also runs the standard pick loop faster (about 0.3 s against 0.42 s), though at 18 s per plate that speed matters little.
- [ ] It should, because more degrees of freedom are always better :: Extra DoF help only when the task uses them, and a top-down pick never tilts the gripper.
- [ ] A six-axis arm cannot reach far enough across the apple belt :: Six-axis arms span 370-4,683 mm of reach; reach is not the reason.
- [ ] A delta is more precise than a six-axis arm of similar size :: Small six-axis arms repeat within 0.01-0.025 mm and deltas within 0.03-0.1 mm, so precision is not the reason.

## Stop: gripper
title: Soft fingers
cargo: Grape bunch in soft fingers
cargo_detail: Held gently, then set down in the tray
concepts: soft-gripper, end-effector, tool-changer, pneumatic-actuation

### Plain
Soft rubber fingers curl around the bunch and hold it gently, the way you cup a ripe peach in a relaxed hand. The arm lowers the bunch into its place in the tray, the fingers open, and the pick is done. The robot tells the line's controller, which moves the tray on once every station has finished.

### Precise
The end effector (the tool on the end of the arm) is a [[soft-gripper|soft gripper]]: silicone fingers with small air channels inside. Inflating the channels lengthens one side of each finger while a layer that bends but barely stretches holds the other side, so the finger curls. A bunch has no flat face for a suction cup to seal on, and a hard squeeze pops berries off the stem, so the fingers close at low pressure and adapt to its shape. If the fingers run on compressed air (an illustrative choice), the air must be dried to a pressure dew point (the temperature at which water condenses out of it) at least 10 °C below the coldest spot it reaches, or water condenses in the cold lines near the food.

The robot steers the TCP (tool center point: the tool's working point, stored as a six-number offset from the arm's mounting plate). If longer fingers are fitted without updating that offset, every grasp computed from camera coordinates is off by the difference. Soft fingers trade force, speed, and placement precision for gentleness: the bunch can shift inside the grip, which matters when setting it into a small tray pocket.

Food versions use food-contact materials and can be cleaned in place; Schmalz's mGrip offers an optional IP69K hygienic design (proof against hot high-pressure jets). At sanitation, a tool changer (a coupling that locks a tool to the arm and releases it on command) lets an operator swap in clean fingers. ATI's washdown-capable QC-77 repeats to about 0.015 mm, so the TCP needs no re-teaching after the swap. Once the bunch is down, the controller sets "pick done" for the line PLC. Without a gripper matched to the item, a perfect arm motion still drops or damages it.

### Question
Bunches sometimes shift in the soft grip on the way to the tray. A technician proposes doubling the finger air pressure. What is the main risk?
- [ ] None, because soft fingers cannot damage anything :: Their squeeze rises with air pressure, and set too high they bruise soft items.
- [x] A harder squeeze can pop berries off or bruise them :: Soft fingers trade grip force for gentleness. That trade-off is built in, which is why soft fingers suit delicate, irregular items rather than every job.
- [ ] The fingers stop bending, because bending comes from the rubber, not the air :: The fingers bend because inflating their channels lengthens one side while the other keeps its length.
- [ ] Better to switch to a suction cup, which holds more firmly :: A bunch has no flat face for a cup to seal on, and suction on a grape lifts one berry or bruises it.

## Puzzle
title: Put one pick in signal order
type: order

### Prompt
Here are the pieces of one classical grape pick, shuffled. Put them in the order the signal travels, from the tray arriving to the bunch set down in the tray.

### Data
```json
{
  "items": [
    {
      "id": "trigger",
      "label": "Photo-eye sends a tray-in-place pulse",
      "why": "Nothing starts until the PLC knows a tray is there to receive the bunch; only then does it give the robot cell the go-ahead."
    },
    {
      "id": "image",
      "label": "Camera captures the lit tote",
      "why": "Software can only find what the camera has recorded, and the camera can only record light that has bounced off the bunches."
    },
    {
      "id": "detect",
      "label": "Detector outlines one bunch",
      "why": "The 3D step has to know which pixels belong to the bunch before it can turn them into a point."
    },
    {
      "id": "position",
      "label": "Calibration turns it into a 3D point in the robot's frame",
      "why": "Grasp planning needs the bunch's position relative to the robot base, not relative to the camera."
    },
    {
      "id": "grasp",
      "label": "Planner picks a grasp pose with tilt",
      "why": "The route planner needs a destination, and the grasp pose with its pre-grasp point is that destination."
    },
    {
      "id": "trajectory",
      "label": "Planner finds and times a collision-free path",
      "why": "The timed path fixes where every joint must be at each moment, and those values are what get sent out tick by tick as joint targets."
    },
    {
      "id": "joints",
      "label": "Six joint angles go out every few milliseconds",
      "why": "Drives work in joint angles, not room positions, so each drive needs its joint's target before it can push any current; inverse kinematics is what turned the room targets into these angles."
    },
    {
      "id": "current",
      "label": "Each drive pushes current into its motor",
      "why": "A drive needs a target angle to know how much current to send, and current is what makes a motor push."
    },
    {
      "id": "torque",
      "label": "Motors and gearboxes turn the joints, and the arm swings over",
      "why": "Torque appears only once current flows, and the gearbox multiplies it into enough twist to move the arm."
    },
    {
      "id": "release",
      "label": "Soft fingers close, carry, and open over the tray",
      "why": "The fingers can close on the bunch only after the arm has carried them there, and can let go only over the bunch's spot in the tray."
    }
  ]
}
```
### Debrief
Each step consumes what the step before produced, which is why a classical pick can be debugged stop by stop: print the outline, the 3D point, the grasp pose, or the path, and see which one is wrong. In learned mode, one policy replaces the five steps from "detector outlines one bunch" to "six joint angles go out"; the trigger, the camera, the drive, the joints, and the fingers keep their places. The order is a simplification: inverse kinematics already ran before planning, to turn the grasp pose into a goal posture, and the fingers close partway through the arm's motion, not after all of it.
