# Workbenches

## Workbench: wb1-dof
title: Degrees of freedom
ride: ride2
stop: arm-motion
concepts: dof, six-axis, delta
order: 1

### Goal
Lean an apple slice against the grape bunch in the tray. Try it first with only the four motions of the apple station's delta, then free the wrist of a six-axis arm like the grape station's.

### Plain
A robot can make only the separate motions its joints give it. The apple station's robot, a spider-like delta hung over the belt, has four: it carries its suction cup left and right, forward and back, up and down, and twists it, but the cup always stays level, like a waiter's tray. A slice leaning against the grapes is tilted, so no amount of steering gets it there with those four. The wrist of an arm like the grape station's adds the tilt.

### Precise
A rigid object such as the slice has 6 [[dof|degrees of freedom]] (DoF: independent motions): three for position (x, y, z) and three for orientation (which way it faces; here roll, pitch, and yaw, turns about the x, y, and z axes). The apple station's [[delta|delta robot]] (area 1's judgment call) has 4 axes (motorized joints): pairs of parallel rods hold its gripper plate level, three motors together move it in x, y, and z, and a fourth turns the cup about vertical. That is all a top-down place needs: lift the slice, turn it to fit the compartment, set it down flat. A slice leaning at 60 degrees (an illustrative angle) needs pitch, and no combination of those four motions makes it.

The arm in this booth is a [[six-axis|six-axis arm]] (six rotating joints in a chain) like the grape station's, fitted here with a vacuum cup like the apple station's. Its first three joints (base, shoulder, elbow) mostly place the wrist, and the last three (wrist roll, bend, and turn) mostly set which way the cup points. In the Apple delta joint set it imitates the delta: J4 is held still and J5 turns by itself to keep the cup pointing straight down. The readout works out what the free joints can change from the Jacobian (a table saying how far and which way the slice moves for a small turn of each joint; see [[inverse-kinematics]]).

Without enough DoF, some tool poses are impossible, however good the software is. The trade runs the other way too: every extra joint adds a motor, a gearbox, mass, cost, and one more source of error, so a job that never tilts the tool is often better done with four axes.

### How to use
- Match the see-through ghost slice leaning on the grapes. The slice is placed when both meters turn green.
- The arm starts with the apple delta's four axes: J1, J2, J3, and J6 are free, and J4 and J5 show Level because the arm sets them itself to keep the cup pointing straight down.
- Move or turn the slice with the − and + buttons under x, y, z, roll, pitch, and yaw (hold a button to repeat), or turn one joint with its slider or the − and + at the slider's ends. A grey button means the free joints cannot make that motion.
- Press the button on a joint's row to lock or free that joint (it reads Free, Locked, or Level; pressing Level frees it), or pick a joint set: Apple delta: 4 axes, 5 axes: no wrist roll, or Grape arm: 6 axes. Reset starts over.
- Drag the view sideways or use the round arrow buttons to look from another side; the close-up shows the tray.

### What to notice
- With the apple delta's four axes you can bring the flat slice onto the ghost's spot and turn it to match, but the Angle meter stops at 60 degrees, the slice's lean: roll and pitch read "no".
- Free J5, the wrist bend, and pitch stops reading "no". With the slice over the ghost it reads "yes": the slice leans in place while the other joints shift to hold it still. Independent directions go from 4 to 5, and to 6 with every joint free.
- Five axes, like the 5-axis variants some arms come in, are enough here because the slice leans straight away from the robot; leaning it to one side at the same spot would also need J4, the wrist roll. Bunches in a tote lie at random angles, which is why this guide gives the grape station all six.
- The apple station keeps its 4-axis delta anyway: setting slices down flat never needs tilt, and two more joints would only add cost and sources of error.

### Data
```json
{
  "note": "Illustrative values unless named here. J1's range of plus or minus 230 degrees is the axis 1 range of ABB's IRB 1100 (six-axis). Upper arm plus forearm is 0.58 m, so the reach to the wrist center is 580 mm, the top of the 475-580 mm reach listed for the IRB 1100 (six-axis); ABB draws its working ranges at the wrist center (reach). The 0.12 m tool follows the apple station's illustrative 120 mm cup TCP (end-effector). The Apple delta set imitates a 4-axis delta: x, y, z and a turn about vertical, with the plate always level (dof, delta); giving the apple station a delta and the grape station a six-axis arm is area 1's judgment call. All other link lengths and joint limits, the tray, slice, and grape sizes, the 60 degree lean, the start pose, and the tolerances are illustrative modeling choices.",
  "links_m": {"base": 0.3, "upper_arm": 0.3, "forearm": 0.28, "wrist": 0.07, "tool": 0.12},
  "joints": [
    {"label": "J1 base", "min_deg": -230, "max_deg": 230, "start_deg": 25},
    {"label": "J2 shoulder", "min_deg": -90, "max_deg": 120, "start_deg": 50},
    {"label": "J3 elbow", "min_deg": -120, "max_deg": 150, "start_deg": 10},
    {"label": "J4 wrist roll", "min_deg": -180, "max_deg": 180, "start_deg": 0},
    {"label": "J5 wrist bend", "min_deg": -125, "max_deg": 125, "start_deg": 30},
    {"label": "J6 wrist turn", "min_deg": -180, "max_deg": 180, "start_deg": -40}
  ],
  "tray": {"x_m": 0.42, "y_m": 0, "z_m": -0.08, "length_m": 0.24, "width_m": 0.17},
  "slice": {"radius_m": 0.035, "thickness_m": 0.01},
  "grapes": {"radius_m": 0.04},
  "target": {"x_m": -0.04, "y_m": 0, "tilt_deg": 60, "heading_deg": 0},
  "tolerance": {"position_mm": 12, "angle_deg": 8},
  "start_unlocked": [1, 2, 3, 6],
  "start_level": true,
  "presets": [
    {"label": "Apple delta: 4 axes", "unlocked": [1, 2, 3, 6], "level": true},
    {"label": "5 axes: no wrist roll", "unlocked": [1, 2, 3, 5, 6]},
    {"label": "Grape arm: 6 axes", "unlocked": [1, 2, 3, 4, 5, 6]}
  ]
}
```

## Workbench: wb2-ik
title: Inverse kinematics
ride: ride2
stop: joint-targets
concepts: inverse-kinematics, reach, forward-kinematics, six-axis, robot-controller
order: 2

### Goal
Put the soft fingers on each grape bunch the arm can reach, at the tilt its grasp needs, try both elbow postures, and find the bunch it cannot reach.

### Plain
The motors can only be told how far to turn, so every spot you choose for the fingers has to become a set of joint angles, and this booth does that conversion as you drag. There is often more than one way to reach the same spot, like reaching for a cup on a high shelf with your elbow raised or dropped, and sometimes there is no way at all. A bunch can lie inside the arm's reach and still be impossible when the fingers must come in tilted.

### Precise
[[inverse-kinematics|Inverse kinematics]] (IK: finding the joint angles that put the tool at a target position and tilt) is the reverse of [[forward-kinematics|forward kinematics]] (computing where the tool is from the joint angles). This is the grape station's [[six-axis|six-axis arm]] seen from the side, so only the three joints that swing in that plane move: shoulder (axis 2), elbow (axis 3), and wrist bend (axis 5). The base and the two wrist rotations stay at zero. The booth solves the arm's geometry directly by formula (analytic IK), as solvers generated by IKFast do; those return every solution in a few microseconds.

A six-axis arm with a spherical wrist (its last three joint axes cross at one point) has up to eight solutions for one pose (position plus orientation): shoulder left or right, elbow up or down, wrist flipped or not. The side view shows the two that differ at the elbow. A solution can still be unusable because it puts a joint past its limit. Of the usable ones, software usually keeps the one closest to the current joints, so the arm does not swing its elbow over mid-move.

IK can also return nothing. If the wrist would have to sit farther from the shoulder than the upper arm plus the forearm can stretch, the target is out of [[reach|reach]]; the nearest the arm can come is stretched straight, which is itself a singularity (a posture where the tool cannot move in some direction at all, however fast the joints turn). A reach drawn for one tool direction says nothing about another: tilting the fingers moves the wrist, so the ring of reachable finger-tip positions moves with it. When IK fails, the software picks another grasp or another bunch.

The ride shows this stop after the path for simplicity; in practice IK ran earlier, turning the grasp pose into the goal posture the planner aimed for. What leaves the joint-targets stop is six joint setpoints (target values) along that path, sent on the [[robot-controller|robot controller's]] interpolation cycle (the fixed beat at which it gives every joint a fresh target), every 2 ms on Universal Robots e-Series and UR Series arms, for example. Without IK, a grasp chosen in the room cannot become motor commands.

### How to use
- Drag the orange target with a finger or the mouse (a tap or click moves it straight there), or use the arrow keys once the picture has focus (Shift for bigger steps). The arm follows in the posture chosen under Robot uses.
- To put the target on a bunch's grasp pose (its point and the tilt it needs), let go near its grasp point (the small circle just above its number) or press its number under Go to bunch.
- Tilt turns the fingers by hand. The dashed ring shows how far the finger tips can reach at the current tilt, before joint limits are checked.
- Elbow up and Elbow down switch posture; the dashed outline is the other one. Red joints, red table values, and the Joint limit tag mean a joint is past its limit. The Out of reach tag and a red ring mean no posture gets the finger tips there.

### What to notice
- At the start both postures stay inside the joint limits: one target, two real answers. At bunches 1 and 2, Elbow down would push the shoulder past its limit, so only Elbow up is usable there.
- Switching posture swings every joint a long way while the finger tips stay put, which is why software keeps the answer closest to the current joints.
- Bunch 3 lies inside the ring you see at the start, with the fingers straight down. Its grasp needs the fingers tilted back toward the robot, which moves the wrist out past the far wall and out of reach: the ring moves with the tilt.
- The table lists all six joint angles, one per joint, like the setpoints the joint-targets stop sends toward the motors; the three joints that do not move in this view stay at zero.

### Data
```json
{
  "note": "Upper arm and forearm (400 mm each) and the 160 mm from the wrist axis to the finger tips (80 mm wrist to flange plus 80 mm of fingers) follow the illustrative small six-axis arm in the forward-kinematics code sketch, leaving out its 50 mm elbow offset; that gives about 800 mm of reach at the wrist, inside the 370-4,683 mm six-axis range in reach. Joint names and axis numbers follow six-axis. The two postures shown, elbow up and elbow down, are two of the up to eight solutions in inverse-kinematics. Illustrative modeling choices: all joint limits, the shoulder height above the work surface, the tray and tote positions, the tote size and wall height, the three grasp poses and their tilts, the start target, and the tilt range.",
  "upper_arm_mm": 400,
  "forearm_mm": 400,
  "tool_mm": 160,
  "shoulder_height_mm": 450,
  "tray_x_mm": 260,
  "tote": { "near_x_mm": 470, "far_x_mm": 770, "wall_mm": 120 },
  "tilt_max_deg": 60,
  "start_target_mm": [700, -60],
  "bunches": [
    { "x_mm": 540, "z_mm": -390, "tilt_deg": 15 },
    { "x_mm": 630, "z_mm": -390, "tilt_deg": 0 },
    { "x_mm": 720, "z_mm": -380, "tilt_deg": -40 }
  ],
  "joints": [
    { "name": "Base (axis 1)" },
    { "name": "Shoulder (axis 2)", "min_deg": -45, "max_deg": 150 },
    { "name": "Elbow (axis 3)", "min_deg": -160, "max_deg": 150 },
    { "name": "Wrist roll (axis 4)" },
    { "name": "Wrist bend (axis 5)", "min_deg": -135, "max_deg": 135 },
    { "name": "Wrist turn (axis 6)" }
  ],
  "solutions": ["Elbow up", "Elbow down"]
}
```

## Workbench: wb3-control
title: Control loop
ride: ride2
stop: drive
concepts: control-loops, servo-drive, servo-motor
order: 3

### Goal
Tune the three gains of one wrist joint's control loop so the soft fingers swing 30 degrees and stop on target within the spec, while they hold a grape bunch.

### Plain
Each joint's drive keeps that joint on target: it measures where the joint is and pushes harder or softer to close the gap, thousands of times a second. Three settings decide how hard it pushes. It is like steering to stay in a lane: too timid and you drift, too hard and you zig-zag across it. A grape bunch in the fingers makes the wrist harder to swing and harder to hold up, so settings that suit empty fingers can stop working.

### Precise
This bench models one joint of the grape station's [[six-axis|six-axis arm]]: the wrist joint that tilts the soft fingers, turning about a horizontal axis. Its [[servo-drive|servo drive]] (the power electronics that feed one motor) runs a PID controller (a rule that sets the push from the error, the target angle minus the measured one). The proportional term (P: gain Kp times the error) pushes back in proportion to the error; raising it speeds the response, but too much causes overshoot (passing the target before settling back) and oscillation (swinging back and forth past it). The integral term (I: Ki times the error added up over time) removes steady offsets, such as a joint sagging under the weight it holds, but adds overshoot. The derivative term (D: Kd times how fast the angle is changing) damps motion and reduces overshoot. Here it is computed from the measured angle, so the jump in the target causes no spike. Real derivative terms also amplify sensor noise and are usually filtered; this bench has no noise.

A real drive runs cascaded loops (nested loops, each setting the target for the one inside it): position, then velocity, then current, each inner loop typically tuned to follow changes 5-10 times faster than the loop around it. The innermost current loop runs every 50-62.5 µs in the drives checked, and the current it sets makes the [[servo-motor|servo motor]]'s torque. This bench folds the position and velocity loops into one PID whose output is the torque it asks the current loop for, and treats the current loop as instant. The PID runs every 0.25 ms here (illustrative), so it updates 8 times between two targets from the robot controller, which arrive every 2 ms (500 Hz, the rate on Universal Robots e-Series arms, for example). The test is a step: the target jumps 30 degrees at once, a harsher test than a planned move that eases in. The motor's torque has a limit; while the PID asks for more, its output is saturated (pinned at that limit), and anti-windup caps the integral term and pauses it while saturated, so it cannot store up a lurch.

The bunch (an illustrative 0.5 kg, a round number chosen so the effect is easy to see, held about 300 mm from the joint axis) more than doubles the joint's inertia (how hard it is to speed up or slow down), and its weight pulls the fingers back toward hanging straight down. Feedforward (adding the command already known from the planned motion) covers only what the controller is told: the fingers' weight is cancelled by gravity compensation from the arm's model, but this bench leaves the bunch out of the controller's load data, so feedback alone must hold it up. Tuned too soft, the joint lags or stops short; tuned too aggressive, it overshoots or oscillates. Gains tuned with empty fingers overshoot once a bunch is held, and without the integral term the bunch's weight leaves the joint short of its target.

### How to use
- The bench starts with Empty soft fingers and gains that meet the spec, with Ki at zero. Switch the payload to Holding a grape bunch.
- Drag the Kp, Ki, and Kd sliders. Each change re-runs the 30 degree step, plots the angle and the motor torque against time, and replays the move on the wrist. The grey line is the other payload with the same gains.
- The three cards compare overshoot, settling time (when the angle enters the shaded band around the target and stays there), and steady-state error (the gap left at the end) with the spec. The dashed box on the angle plot is where the line must stay after the settling limit.
- Zoom on the angle plot shows the few degrees around the target, where overshoot and a short stop are easy to see. Touch or drag along a plot to see the wrist at that moment. Replay plays the move again; Reset restores the starting gains.
- Solved when all three cards pass while the fingers hold the bunch.

### What to notice
- The gains that pass with empty fingers overshoot with the bunch: the heavier load carries more momentum into the target than those gains can brake. Raising Kp makes it worse; raising Kd adds the damping it needs.
- With enough Kd the overshoot goes, but the fingers end short of the target. The bunch's weight pulls them back; Kp can push back only by leaving some error, and Kd pushes only while the joint moves, so only the integral term can build up a steady push that holds the bunch exactly on target. Raise Ki next; raising it before Kd makes the overshoot worse.
- At the start of the move the torque line runs thick at its limit: the motor is already giving all it can, so more Kp cannot make that part faster.
- Gains tuned for the bunch can miss with empty fingers (switch back and compare): the integral push the bunch needs carries the empty fingers past the target, and they settle late. Real controllers ask for the load's mass and balance point, so feedforward from the arm's model can carry the predictable part and feedback only corrects what is left.

### Data
```json
{
  "note": "From concept files: setpoint_hz 500 is the Universal Robots e-Series setpoint rate given in control-loops; the PID's place inside cascaded position, velocity, and current loops, and the 50-62.5 us current loop that the model treats as instant, are from control-loops and servo-drive; gravity compensation as feedforward is from control-loops, and entering the tool's mass in the controller is from payload. drive_loop_hz 4000 (every 0.25 ms) is illustrative: slower than the 62.5 us (16 kHz) loop cycles control-loops quotes, and the same as the position-loop period in control-loops' illustrative code sketch. The 300 mm from the joint axis to the bunch reuses gearbox's illustrative grape-station geometry (the gripper about 300 mm from the wrist joint), so it is illustrative too. Everything else is illustrative: the 0.5 kg bunch (no concept file gives a bunch mass; a round number chosen so the payload's effect is easy to see); the inertias (0.04 kg m2 for the empty joint, plus 0.5 kg x (0.3 m)^2 = 0.045 kg m2 for the bunch); the weight torque with the fingers pointing sideways (0 for the empty fingers, whose weight gravity compensation cancels; 0.5 kg x 9.81 m/s2 x 0.3 m, about 1.5 N m, for the uncompensated bunch); damping, friction, the torque limit, the integral limit, the 30 degree step, the gain ranges, and the spec.",
  "drive_loop_hz": 4000,
  "setpoint_hz": 500,
  "duration_s": 1.0,
  "target_deg": 30,
  "load": {
    "empty": {"label": "Empty soft fingers", "inertia_kgm2": 0.04, "gravity_nm": 0},
    "loaded": {"label": "Holding a grape bunch", "inertia_kgm2": 0.085, "gravity_nm": 1.5}
  },
  "damping_nm_s_per_rad": 0.05,
  "friction_nm": 0.05,
  "torque_limit_nm": 6,
  "integral_limit_nm": 1.0,
  "gains": {
    "kp": {"min": 0, "max": 80, "start": 48},
    "ki": {"min": 0, "max": 400, "start": 0},
    "kd": {"min": 0, "max": 5, "start": 2}
  },
  "spec": {
    "max_overshoot_pct": 5,
    "max_settling_s": 0.4,
    "settle_band_pct": 2,
    "max_steady_state_error_deg": 0.1
  }
}
```

## Workbench: wb4-calibration
title: Camera-to-robot calibration
ride: ride2
stop: position-3d
concepts: hand-eye-calibration, camera-calibration, frames
order: 4

### Goal
The grape camera's bracket was knocked during washdown and nobody noticed. Pick a bunch to see what that does, recalibrate the camera to the robot, and land a pick within the allowed offset.

### Plain
The camera reports where a bunch sits in its picture, but the arm can only reach for a spot measured from its own base, so a stored conversion rule turns one into the other. It is like a mall map with a "you are here" dot: if someone bumps the map stand so it turns a little, every direction you read off it is wrong in the same way, and you walk confidently to the wrong shop. Here the camera was knocked, so the fingers close off center on every bunch. Recalibrating means the arm holds a pattern at spots it knows, the camera finds the pattern, and the rule is worked out again.

### Precise
The grape camera is fixed above the tote, so this is [[hand-eye-calibration|hand-eye calibration]] in its eye-to-hand form: finding the camera's pose (its position plus orientation) relative to the robot base. On a real cell the six-axis arm holds a calibration board in place of its fingers and moves it through many poses (Zivid suggests 10-20), tilting it about different axes, because the rotation between poses is what makes the camera's pose solvable. The solver then finds all six numbers of that pose, three shifts and three turns, from the equation AX = XB (A is how the robot moved between two poses, B is how the camera saw the board move, and X is the unknown fixed shift plus rotation that ties the two together). This bench is a simplification of that. The board tilts in the picture, but the bench uses only where its center lands in the flat layer where the bunches lie, and fits a 2D similarity (a map that can only turn, scale, and shift the flat image) to those points by least squares (picking the map that makes the sum of squared misfits smallest). It treats a small camera tilt as a sideways slide of the view, ignoring the slight stretch a real tilt adds, and it ignores the depth reading a real cell uses to place each bunch in 3D.

The result is one link in a chain of [[frames|coordinate frames]] (each an origin plus axes that positions are measured from): the robot multiplies the base-to-camera transform (the conversion rule between two frames) by the bunch's position in the camera frame to get the bunch in its own frame. Before that, [[camera-calibration|camera calibration]] measures the lens itself, including radial distortion (bending that grows toward the image edges), which a map that only turns, scales, and shifts cannot undo. A knocked bracket needs a new hand-eye calibration, not a new lens calibration, because the lens did not change.

Rotation errors are the dangerous ones because they grow with distance: the miss is about the angle in radians (1 degree is about 0.017 radians) times the distance, so with the camera 600 mm up, a 0.1° tilt moves the computed point about 1 mm and 0.5° about 5 mm, while a sideways shift passes straight through, millimeter for millimeter. The arm is repeatable (it returns to a taught spot very consistently) but not inherently accurate (a new spot given as numbers can be off by more), so the board positions it reports carry their own error, and the fit keeps a residual (the misfit left over); Zivid expects sub-millimeter translation residuals on smaller robots and millimeter-level ones on larger robots. A good residual does not prove good picks, which is why Zivid recommends a touch test (the robot points a sharp tool at a feature the camera found). Without this calibration, every camera measurement lands off by a fixed but unknown amount, and the robot misses consistently.

### How to use
- Tap a bunch in the camera image, or press its number in the Pick row. The fingers go where the stored calibration puts that bunch's yellow center cross. The line under the Pick row shows that pixel and the robot coordinates it converts to, then where the bunch really was; the top view and its inset show the offset in millimeters. While the camera is out of calibration, a note under Calibrate says how far off the stored calibration is.
- Press Calibrate. The arm holds the board at 10 spots, the camera finds each one (green dots), and the new calibration replaces the old one. Pick again.
- Knock the camera with the sliders: Tilt x and Tilt y lean it so its view slides along the robot's x or y axis, Turn spins it about the vertical axis, and Height raises or lowers it. Pick after each knock. Reset sliders returns them to zero; it does not undo the washdown knock.
- Untick Lens correction, then press Calibrate, to fit the raw, bent image. Next tote brings new bunches.

### What to notice
- Before you recalibrate, every pick misses, by roughly 10-20 mm and always in about the same direction. In the top view, the dashed orange outline (where the robot believes the camera looks) sits off the solid blue one (where it really looks): a fixed offset, so the robot misses confidently every time.
- After calibrating, set Tilt x to 0.5 deg. The note under Calibrate reads about 5 mm, the lever-arm rule at 600 mm, and picks land about that far off, give or take the fuzzy bunch center. That uses most of the 8 mm allowance (illustrative; [[soft-gripper|soft fingers]] need only a rough center point, but no source gives a number), so little margin is left and an occasional pick misses. At 1 deg nearly every pick misses.
- A turn's error grows from the image center outward: at Turn 1 deg the note shows well under a millimeter at the center but about 5 mm at the tote corners, which is still inside the allowance. At Turn 3 deg it is about 16 mm at the corners: a bunch near the middle is still hit, while one near the wall often misses. Height behaves the same way. With Lens correction off, the fit residual jumps from a few tenths of a millimeter to about 3 mm, because a map that only turns, scales, and shifts cannot follow the lens's bending.
- The readout is the conversion rule itself: a turn of about 180 deg (the camera is mounted turned half a circle from the robot's axes, so the arm enters the camera image from the right), about 0.24 mm per pixel, and where the image center sits, in millimeters from the robot base. Recalibrating after the washdown knock moves that center by about 15 mm.

### Data
```json
{
  "note": "From concepts: the camera 600 mm above the tote, its view of about 570 x 460 mm, and about 0.24 mm between points (used here as millimeters per pixel) are area 4's grape example camera, a structured light camera like the Zivid 2+ MR60 (depth-camera); image_px is that view divided by 0.24 mm. 600 mm is also the distance in the lever-arm rule (hand-eye-calibration: 0.1 degree at 600 mm is about 1 mm, 0.5 degree about 5 mm). Ten calibration poses is the low end of the 10-20 pose pairs Zivid suggests (hand-eye-calibration). Illustrative: board_noise_px of 0.3, of the order of the 0.19-0.31 px reprojection errors in camera-calibration; robot_pose_error_mm of 0.3, chosen so the fit residual lands in the sub-millimeter range Zivid expects on smaller robots (hand-eye-calibration); the tote center 560 mm from the robot base; the camera turned 180 degrees from the robot's axes; lens_k1; the bunch size and its 1.5 mm center noise; the 8 mm tolerance (soft-gripper says soft fingers need only a rough center point but gives no number); the washdown knock; and the slider ranges. The model treats a small tilt as a sideways slide of the view (height times angle) and fits a flat 2D similarity, a simplification of the 3D eye-to-hand solve in hand-eye-calibration.",
  "image_px": [2375, 1917],
  "mm_per_px": 0.24,
  "camera_height_mm": 600,
  "camera_center_mm": [560, 0],
  "camera_yaw_deg": 180,
  "lens_k1": -0.12,
  "board_noise_px": 0.3,
  "robot_pose_error_mm": 0.3,
  "bunch_center_noise_mm": 1.5,
  "calibration_poses": 10,
  "bunch_mm": [140, 90],
  "tolerance_mm": 8,
  "washdown_knock": {"tilt_x_deg": -0.8, "tilt_y_deg": 1.2, "yaw_deg": 0.6},
  "bump_max": {"tilt_deg": 3, "yaw_deg": 5, "height_mm": 30}
}
```

## Workbench: wb5-teleop
title: Teleoperation under delay
ride: ride3
stop: operator
concepts: latency-budget, teleop-modes, watchdogs, network-impairments, operator-interfaces
order: 5

### Goal
Grip a grape bunch from the tote before the plate's 18 seconds run out, with the round trip at 400 ms or more, about the delay of Ride 3's untuned setup. Try it by driving the arm yourself, then by pointing at a stem and letting the robot pick.

### Plain
You are the remote operator from Ride 3, watching the grape station's arm and its tote of bunches through a camera far away. Everything you see is a little old, and everything you send arrives a little late, like steering a car by watching a delayed video of the road. You can drive the arm yourself, or just point at a stem and let the robot do the pick on its own. Each plate gives the station 18 seconds, so a slow rescue costs a plate.

### Precise
The round trip shown here is the machine delay around the loop: video out, the [[latency-budget|glass-to-glass latency]] (from light entering the robot's camera to the picture leaving your screen), plus command back, the motion-to-motion latency (from your hand moving to the arm moving). Your own reaction, about 213-231 ms for a simple visual reaction, comes on top. The sliders start near area 9's tuned budget, about 110 ms. The target is its untuned budget, about 400 ms, the setup Ride 3 follows: a camera at 30 frames per second, a cellular uplink, a large jitter buffer (a queue that smooths uneven packet arrival), and a 100 Hz command bridge (the program that forwards your commands to the arm's controller).

In [[teleop-modes|direct control]] (your device streams motion commands many times a second and the arm follows them), you close the loop: you see each result late and correct the next move. The move pad sends velocity commands (move this way at this speed), like Ride 3's SpaceMouse (a puck you push or twist), capped at 50 mm/s (an illustrative setting). Like any velocity device it has a dead zone (a small band around the center that counts as zero), or a resting finger would make the arm drift. If you hold a push until you see the arm move and then let go, the arm has gone about 20 mm by the time your release reaches it (50 mm/s times 400 ms), twice this bench's illustrative 10 mm grip tolerance. ITU-T G.114 (a telecom guideline on delay) says most applications feel essentially transparent below 150 ms one way; at delays of seconds, operators fall back to moving, then waiting to see the result. In remote assist (the robot asks a narrow question and does the motion itself once you answer), you tap one stem. The robot plans and executes the pick with its own camera and limits, so the round trip is paid once, not inside every correction.

[[network-impairments|Jitter]] (variation in delay from one packet to the next) and packet loss (packets that never arrive) ride along. At 100 commands a second, a lost command is replaced 10 ms later. In this model a lost or late video frame just leaves the previous picture on screen longer; in real compressed video a loss can also damage the frames after it until the picture is repaired. A [[watchdogs|watchdog]] (a timer that triggers a safe action when an expected signal stops arriving) makes a controlled stop (braking to a halt and holding position) if no command arrives within 250 ms, and after 2 s ends the takeover and lets the plate pass without grapes (illustrative values from area 9). Without it, an interface such as Universal Robots' RTDE (a real-time data link into the arm's controller) keeps its last input value, so a dropped link can leave a velocity command running.

### How to use
- Press Start, or just begin. In Direct, hold and drag the round move pad (or click the video or the pad and hold the arrow keys). The arm moves while you hold and stops when you let go, like the enable button in Ride 3. The wrist camera in the corner of the video magnifies the spot under the fingers: press Grip (or Space) when its white ring sits on a stem's dot.
- In Assist, tap a dashed ring on a stem, or choose one with the arrow keys and press Enter.
- Drag Video delay and Command delay until the round trip reaches the target. A plate counts only if the round trip stayed at the target from your first action on that plate; Reset starts a fresh plate.
- To see the watchdog, keep the arm moving (hold an arrow key, or hold the pad with one finger) and press Cut link (click it, or tap it with a second finger). Try it with Watchdog on, then off.
- Show robot's live view draws where the arm really is, which a real operator never sees. Jitter and Packet loss add uneven and missing packets; the live network view shows each one.

### What to notice
- At 110 ms a quick hand can drive to a stem and stop on it. At 400 ms the same quick hand overshoots: at the cap the arm travels about 20 mm during one round trip, twice the grip tolerance, and quick corrections swing back and forth until the plate runs out. Slowing down near the stem, or moving and then waiting to see the result, still works at 400 ms; it just takes longer.
- In Assist the round trip hardly matters: in this model the bunch is gripped within a few seconds even at the slowest settings, because the robot closes its own loop. That is why most deployed fleets prefer remote assist, and keep direct control for problems a click cannot fix, such as Ride 3's knotted bunches.
- Cut the link while the arm moves at full speed. With the watchdog on, the arm stops about 12.5 mm after the last command arrived (50 mm/s times 250 ms; a real arm then adds its braking distance). With it off, the arm keeps going on its last command until the robot's own zone limit (the edge of the area its controller allows) stops it.
- Jitter makes some packets arrive after newer ones; those are dropped, and the frame age jumps. The watchdog's 250 ms is set far longer than this normal jitter; a timeout shorter than the jitter would stop the arm for no reason.

### Data
```json
{
  "note": "From area 9: plate_time_s (18 s per plate at 200 plates an hour, teleop-modes); speed_cap_m_s (the 50 mm/s rescue cap, operator-interfaces, an illustrative setting there); watchdog_ms and heartbeat_timeout_ms (250 ms and 2 s, watchdogs, illustrative values there); camera_fps (the 30 fps camera of Ride 3's untuned setup, latency-budget; kept at every slider setting, a simplification); command_rate_hz (100 Hz velocity commands, webrtc and udp-vs-tcp); video_ms.default and command_ms.default (about 65 and 45 ms: the video-out and command-back rows of the tuned budget in latency-budget's code sketch, together about 110 ms); target_rtt_ms (about 400 ms, latency-budget's untuned loop: about 276 ms glass-to-glass plus about 122 ms command back). Illustrative modeling choices: tote_length_m, tote_width_m, bunches_per_tote, robot_speed_m_s, grip_tolerance_m, grip_time_ms, every slider limit, and the jitter and loss defaults; the jitter range is chosen to cover delay spreads of the size network-impairments reports for LTE (round trips from a moving car with a 29.5 ms standard deviation in one study), not measured.",
  "plate_time_s": 18,
  "tote_length_m": 0.6,
  "tote_width_m": 0.4,
  "bunches_per_tote": 4,
  "speed_cap_m_s": 0.05,
  "robot_speed_m_s": 0.25,
  "grip_tolerance_m": 0.01,
  "grip_time_ms": 1200,
  "camera_fps": 30,
  "command_rate_hz": 100,
  "watchdog_ms": 250,
  "heartbeat_timeout_ms": 2000,
  "target_rtt_ms": 400,
  "video_ms": { "min": 60, "max": 300, "default": 65, "step": 5 },
  "command_ms": { "min": 40, "max": 150, "default": 45, "step": 5 },
  "jitter_ms": { "min": 0, "max": 60, "default": 5, "step": 5 },
  "loss_pct": { "min": 0, "max": 20, "default": 0, "step": 1 }
}
```

## Workbench: wb6-line-balancing
title: Line balancing
ride: ride1
stop: apples
concepts: line-balancing, cycle-time, oee, speed-specs
order: 6

### Goal
Get the line back to 200 plates an hour, within the budget, after slow apple picks have dropped it to about 165. Every station still fits inside the 18 s takt, so first work out why the line falls short.

### Plain
Apple slices have started sticking together, so each apple pick takes longer and the line makes about 165 plates an hour instead of the 200 it needs. Every station still finishes its plate inside the 18 seconds it gets, yet the line falls short: a stop anywhere stops the whole belt, and the slowest station has too little spare time to make up for it. It is like hikers roped together: when any one of them stops, the whole rope stops, and the group moves only as fast as its slowest member. Win the time back at the station everyone waits for, not at the ones that already have time to spare.

### Precise
In this line's illustrative model (area 6's sketch, not measurements), apple picks have slowed from 3.2 s to 4.0 s because slices stick together. The apple station's cycle time (how long it takes per plate) is now 4 × 4.0 s plus the 1.5 s index (the belt moving every tray on by one station, shown as transfer in the chart) = 17.5 s, still inside the 18 s takt time (the time budget per plate that 200 plates an hour sets). The line misses anyway. With no buffers (small queues between stations), any station stopping stops the whole indexing line, so if stops are independent it runs for roughly the product of the stations' availabilities (each station's share of time not stopped). That is the availability factor of OEE (overall equipment effectiveness: one score for how much planned time turned into good product). The product is about 80%, so the slowest station must fit inside about 80% of takt, the solid limit line. The apple station does not, which makes it the bottleneck (the station whose capacity caps the whole line), and the line makes about 165 plates an hour.

The theory of constraints says: find the constraint (the bottleneck), get the most out of it, run everything else at its pace, then add capacity there. A second apple delta placing two slices each adds that capacity: it moves the bottleneck to cheese and lifts the line to about 267 plates an hour, even though one more robot slightly lowers line availability. Handing one slice to the cracker station's SCARA splits the work the same way, moving it to a neighbor with time to spare (an illustrative design change: that station would need its own slice feed and camera). A faster robot barely helps: on a benchmark loop a delta moves in roughly 0.3-0.6 s and a SCARA in 0.28-0.33 s, while most of a 4.0 s pick is camera, tracking, vacuum, and gentle placing. A small six-axis arm is slower (0.42 s on its benchmark loop, against about 0.3 s for a lightly loaded delta); its extra joints pay off only where the tool must tilt, as at the grape tote. Speeding up the grape station only adds idle time, because it is not the bottleneck.

A buffer splits the line into parts that stop independently, each with its own limit. The theory of constraints places one before the constraint so it never starves (sits idle for lack of input) and one after it so it never blocks (sits idle because the next station has no room). That wins back output lost to other stations' stops, but it cannot make the apple station faster or stop it stopping: protected on both sides, it still needs 17.5 s per plate and is down for its own 3% of the time, so its limit, 97% of takt, is about 17.46 s and the line stays just under 200. Time lost at the bottleneck is output lost for the whole line. What breaks without balancing: the line pays for robots that sit idle and still misses its target.

### How to use
Tap or click a column, or the station in the picture, to open its panel; the apple station starts open. Each bar is that station's cycle: solid for work, striped for the transfer (the belt index). The dashed line is takt and the solid line is the limit with stops counted; a red bar is over its limit, and the panel shows how the station's cycle and limit are worked out. At a robot station, choose its robot type (each shows its time per pick and its price) and how many robots share the picks; the robot already there counts toward what you buy. Tick a change to buy it and tick it again to undo it; the line rate, the budget, and the bars update at once, and Reset clears everything. Buffer in front adds a rack before the selected station and gives each part of the line its own limit line. Stop this station halts it for a moment so you can watch the rest of the line, with and without a buffer.

### What to notice
- At the start every bar is under the dashed 18 s takt line, yet the line makes about 165 plates an hour. In the picture, when any station stops (red sign), every other station waits with it, which is why the real limit sits below takt.
- Fewer vision retries at the grape station change nothing. Swapping the apple delta for a faster delta or a SCARA barely moves the line rate, and a six-axis arm lowers it: the arm moves for well under a second of each 4 s pick.
- Buffers help, but even with one on each side of the apple station the line stays just under 200: a buffer protects the bottleneck from other stations' stops, it does not speed it up.
- Sharing the apple work fixes it: two apple deltas, or one slice handed to the cracker station. With a second delta, the bottleneck moves on to the cheese station.

### Data
```json
{
  "note": "Station times, picks per plate, the 1.5 s index, and station availabilities are the illustrative values of the line-balancing code sketch (area 6), with apple picks slowed from 3.2 s to 4.0 s as in its slices-sticking case; work_s = picks x seconds per pick with each station's installed robot (apple 4 x 4.0, grape 1 x 7.0, cracker 2 x 2.5 worst case, cheese 3 x 3.0). The 200 plates/h target and its 18 s takt come from cycle-time. Robot types: motion_s is each type's benchmark-loop time from speed-specs (delta about 0.3 s on the 25/305/25 mm loop; faster delta 0.26 s, the Adept Quattro's time with 0.1 kg; SCARA 0.3 s, inside its 0.28-0.33 s; small six-axis arm 0.42 s). Changing a station's robot type changes each pick by the difference in motion time only; that the rest of each pick (camera, tracking, vacuum, gentle placing) stays the same for every type is an illustrative simplification, as are the types offered at each station (the grape station keeps its six-axis arm because bunches lying at random angles need wrist tilt, area 1). Extra robots share a station's picks and count its availability once each, as the sketch's second apple delta does; each pick is made whole by one robot, so the busiest robot sets the station's work (two deltas on three cheese wedges leave one of them two). That buffers decouple stations comes from line-balancing and conveyor; treating each buffer as big enough to ride out every stop is an illustrative simplification (the animation's rack holds buffer.capacity plates). The grape station's 2.0 s saving (the sketch blames grape time on vision retries on tangled bunches), the cracker station taking one apple slice at 4.0 s (with the installed robots at both stations; a different robot type at either end changes that pick by the motion-time difference, like any other pick), every robot price and cost, counting the installed robot's price toward a new setup, max_robots, the budget, the buffer capacity, the 20 s random stop length, and the 30 s stop button are illustrative modeling choices.",
  "target_per_hour": 200,
  "budget": 8,
  "cost_unit": "pts",
  "transfer_s": 1.5,
  "stop_s": 20,
  "short_stop_s": 30,
  "buffer": {"cost": 2, "capacity": 4},
  "robot_types": [
    {"id": "delta", "kind": "delta", "label": "Delta", "motion_s": 0.3, "cost": 6},
    {"id": "fast-delta", "kind": "delta", "label": "Faster delta (shorter catalog cycle)", "motion_s": 0.26, "cost": 9},
    {"id": "scara", "kind": "scara", "label": "SCARA", "motion_s": 0.3, "cost": 8},
    {"id": "six-axis", "kind": "six-axis", "label": "Six-axis arm", "motion_s": 0.42, "cost": 10}
  ],
  "stations": [
    {"id": "denester", "work_s": 2.0, "picks": 1, "availability": 0.98},
    {"id": "grapes", "work_s": 7.0, "picks": 1, "availability": 0.93, "robot": "six-axis", "max_robots": 2,
     "tool": {"saves_s": 2.0, "cost": 2, "label": "Fewer vision retries on tangled bunches"}},
    {"id": "apples", "work_s": 16.0, "picks": 4, "availability": 0.97, "robot": "delta",
     "robot_options": ["delta", "fast-delta", "scara", "six-axis"], "max_robots": 3},
    {"id": "crackers", "work_s": 5.0, "picks": 2, "availability": 0.98, "robot": "scara",
     "robot_options": ["scara", "delta", "six-axis"], "max_robots": 2},
    {"id": "cheese", "work_s": 9.0, "picks": 3, "availability": 0.97, "robot": "delta",
     "robot_options": ["delta", "fast-delta", "scara", "six-axis"], "max_robots": 3},
    {"id": "inspection", "work_s": 1.5, "picks": 1, "availability": 0.995},
    {"id": "lidding", "work_s": 4.0, "picks": 1, "availability": 0.97},
    {"id": "outfeed", "work_s": 3.0, "picks": 1, "availability": 0.99}
  ],
  "moves": [
    {"from": "apples", "to": "crackers", "seconds": 4.0, "cost": 3, "label": "one apple slice"}
  ]
}
```
