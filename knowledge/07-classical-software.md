---
area: 7
slug: classical-software
title: Classical robot software
---

# Classical robot software

"Classical" robot software is the hand-written, mostly deterministic (the same inputs always give the same outputs) stack that turns a request like "put this cheese wedge in that compartment" into motor currents. It has four layers. The math layer is coordinate frames and kinematics. The search layer is motion planning and collision checking. The timing layer is trajectory generation, control loops and conveyor tracking. The logic and tooling layer is state machines, perception, grasp planning, ROS 2, MoveIt, OpenCV, vendor robot languages and PLC programming. Every step is engineered and inspectable: when a pick fails you can usually point to the step that went wrong (bad calibration, no IK solution, a planner timeout, an overshooting joint). [[learned-policy]] and the rest of area 8 cover learned models that replace parts of this pipeline.

On the cheese plate line, every pick station runs much of this stack every few seconds. The camera finds an apple slice on its infeed belt (perception) and its position is converted from camera coordinates to robot coordinates (frames). The software chooses how to hold the slice (grasp planning), solves for joint angles (inverse kinematics), gets a path that misses the tray walls, either taught or planned (motion planning and collision checking), times that path (trajectory generation) while keeping up with the slice as the belt carries it (conveyor tracking), and each joint's drive follows the result (control loops). A state machine sequences the steps, and the PLC coordinates the stations. This file covers the math-and-motion half first, then the logic, perception and tooling half.

## Coordinate frames and transforms
id: frames
requires: dof
aka: transform, pose, TF, tf2, homogeneous transform, quaternion, Euler angles

### Plain
Every position a robot uses is measured from some reference point: the camera says the apple slice is 30 cm in front of the camera, but the arm needs to know where it is relative to the arm's own base. A coordinate frame is like a street address system with its own starting point and its own idea of which way is north. A transform is the conversion rule between two such systems, and the robot chains these rules together to answer where something is from its own point of view.

### Where the analogy breaks
An address says where something is but not which way it faces, and a map turns about only one axis (which way is north), so the analogy hides that converting between frames means a full 3D rotation plus a shift, and that doing those steps in a different order gives a different answer. Frames can also move every millisecond (a frame glued to the moving gripper), which no street grid does.

### Precise
A **frame** (an origin point plus three perpendicular axes, x, y and z) is attached to everything that matters: the robot base, each link, the tool tip, the camera, the conveyor, each tray. The **pose** (position plus orientation) of frame B as seen from frame A is usually stored as a **homogeneous transform** (a 4x4 matrix whose top-left 3x3 block is a rotation and whose right-hand column is a translation, with a bottom row of 0 0 0 1 so that one matrix multiplication applies both). Transforms chain by multiplication: if `T_base_cam` says where the camera is relative to the base and `T_cam_slice` says where the slice is relative to the camera, then `T_base_slice = T_base_cam · T_cam_slice`. Order matters, and the inverse transform answers the question the other way round. ROS fixes the ground rules in REP 103: SI units (meters, radians), right-handed frames, and x forward, y left, z up on a robot body [3].

Rotation has several representations, and each has a trap. A **rotation matrix** (nine numbers describing three degrees of freedom) chains cleanly, but repeated multiplication with rounding error slowly makes it an invalid rotation unless it is re-normalized (nudged back into an exact rotation). **Euler angles** (three successive rotations about named axes, such as roll, pitch and yaw) are easy for people to read, but at certain angles two of the three axes line up and one degree of freedom disappears. For the common yaw-pitch-roll order this **gimbal lock** happens at pitch ±90° [5]. Near that pose a tiny real rotation can produce wildly different angle triples, which breaks interpolation (computing in-between orientations) and filtering (smoothing noisy readings). A **quaternion** (four numbers of unit length that encode a rotation axis and angle) has no such singularity, interpolates smoothly and is compact. Eigen calls it "the representation of choice" for most uses [4], and REP 103 lists quaternions first and discourages Euler angles [3]. Its own quirks: q and -q are the same rotation, and conventions disagree on whether the scalar part w is written first or last [6].

A real cell has dozens of frames arranged as a **TF tree** (a tree in which every frame has exactly one parent and stores its transform relative to that parent), so there is exactly one chain between any two frames [2]. ROS 2's **tf2** library keeps this tree "buffered in time" [1]: you can ask where a slice on a moving belt was relative to the base at the instant a camera image was taken, not just where things are now. Fixed frames (a camera bracket) are published once as static transforms, and moving ones (joints, a conveyor) are streamed with timestamps [2]. Without consistent frames, every later step computes the right answer in the wrong place. A 1° error in a camera mount's rotation moves a point 1 m away by about 17 mm (tan 1° is about 0.0175).

### On the cheese plate line
At the apple station the camera reports a slice's pose in the camera frame. The software chains camera to robot base (measured by [[hand-eye-calibration]]) and robot base to suction cup (computed by [[forward-kinematics]]) to know where to send the cup. The place target is written in a tray frame, for example "slot 2, 40 mm from the tray corner, turned 30° to line up with the compartment" (illustrative numbers), so it is a full pose: the 30° turn is an orientation the cup must reproduce, not just a point. The slice itself rides on the moving infeed belt, so its frame's parent is a belt frame that slides forward with every belt encoder count, and the pick end of the chain is re-evaluated every control cycle; the tray is stopped at the station, so its frame stays put during the place (see [[conveyor-tracking]]).

### Elsewhere
On a surgical robot, the surgeon's hand controllers are measured in the console's frame, but for the motion to feel natural it has to be applied in the endoscope camera's frame: moving a hand to the left should move the instrument to the left on screen [8]. When the camera is repositioned mid-procedure, that console-to-camera transform changes and the mapping has to update with it. On a car body line the same idea appears as weld points defined in a frame attached to the car body, so one measured correction of that frame moves every weld point at once; ABB's work objects, for example, store programmed positions relative to such a frame [7].

### Why it exists
Sensors, tools and parts each have a natural reference point of their own, and measuring everything from one global origin is impractical and fragile. Frames let each piece be described where it is natural and then combined by multiplication, and a time-stamped tree lets sensors and moving parts with different timing agree on where things were at a given instant.

### Connects to
- [[forward-kinematics]] — computes the frame of each link and the tool from joint angles.
- [[hand-eye-calibration]] — measures the camera-to-robot transform that the whole vision chain depends on.
- [[ros2]] — tf2 is the ROS 2 library that publishes and looks up the frame tree.
- [[conveyor-tracking]] — a moving belt frame is how a slice's pose on the infeed belt stays current.
- [[end-effector]] — the tool center point is a frame offset from the robot flange.

### Real products and tools
- **ROS 2 tf2** — keeps the time-buffered frame tree and answers lookups between any two frames at a given time [1].
- **Eigen (Geometry module)** — C++ linear algebra library with Quaternion, AngleAxis and Transform types [4].
- **REP 103** — the ROS convention document for units, handedness, axis directions and preferred rotation formats [3].
- **Vendor controller frames** — industrial robot languages name their own frames; ABB's, for example, places a workpiece with a work object made of a user frame and an object frame [7]; see [[vendor-languages]].

### Common misconception
**Misconception:** Orientation can be stored as three angles (roll, pitch, yaw) and averaged or interpolated like positions.

**Reality:** Angle triples wrap around at ±180° and become ambiguous near gimbal lock [5], so averaging two of them can give a rotation that is close to neither: yaw 179° and yaw -179° are only 2° apart, but their average, 0°, faces the opposite way. Robust code stores quaternions or matrices and converts to angles only for display, which is what REP 103 recommends [3].

### Key numbers
- tf history buffer: about 10 s by default, so lookups older than that fail [1] [2].
- Gimbal lock for yaw-pitch-roll angles: at pitch ±90° [5].
- Rotation error at a distance: 1° at 1 m is about 17 mm, and the error grows in proportion to distance (computed from tan 1°).

### Code sketch
```python
import numpy as np

def make_T(R, p):
    """4x4 homogeneous transform from a 3x3 rotation R and a 3-vector p (meters)."""
    T = np.eye(4)
    T[:3, :3] = R
    T[:3, 3] = p
    return T

def inv_T(T):
    """Inverse of a rigid transform: rotate back, then undo the shift."""
    R, p = T[:3, :3], T[:3, 3]
    return make_T(R.T, -R.T @ p)

def quat_to_R(w, x, y, z):
    """Unit quaternion (scalar w first) to rotation matrix."""
    return np.array([
        [1 - 2*(y*y + z*z), 2*(x*y - w*z),     2*(x*z + w*y)],
        [2*(x*y + w*z),     1 - 2*(x*x + z*z), 2*(y*z - w*x)],
        [2*(x*z - w*y),     2*(y*z + w*x),     1 - 2*(x*x + y*y)],
    ])

# Apple station: the camera sees a slice; the robot needs it in its base frame.
# Camera is 0.9 m up, looking straight down (180 degrees about x).
T_base_cam   = make_T(quat_to_R(0, 1, 0, 0), [0.40, 0.00, 0.90])   # from hand-eye calibration
T_cam_slice  = make_T(np.eye(3),             [0.02, -0.05, 0.85])  # from perception
T_base_slice = T_base_cam @ T_cam_slice    # chain: base <- camera <- slice
# -> slice at x=0.42, y=0.05, z=0.05 in the base frame

# With tf2 the same lookup is by frame name and timestamp, so a slice on the moving
# belt is evaluated at the instant the image was captured, not "now":
#   tf = buffer.lookup_transform("base_link", "apple_slice", image_stamp)
```

### Sources
1. [tf2 package summary](https://index.ros.org/p/tf2/) — ROS Index; tf2 "maintains the relationship between coordinate frames in a tree structure buffered in time"; README gives a 10 s default cache.
2. [Transforms in ROS](https://nu-msr.github.io/ros_notes/ros1/lecture05_tf.html) — Northwestern University MSR course notes (ROS 1 era, tf2-based; secondary); one parent per frame, about 10 s default buffer, static transforms, quaternion representation.
3. [REP 103: Standard Units of Measure and Coordinate Conventions](https://reps.openrobotics.org/rep-0103/) — Open Robotics; SI units, right-handed frames, x forward y left z up, quaternions preferred and Euler angles discouraged.
4. [Eigen geometry tutorial (TutorialGeometry.dox, Eigen 3.4)](https://sources.debian.org/src/eigen3/3.4.0-5/doc/TutorialGeometry.dox) — Eigen documentation source; quaternion as the representation of choice, Transform class.
5. [Representing Attitude: Euler Angles, Unit Quaternions, and Rotation Vectors](https://www.astro.rug.nl/software/kapteyn-beta/_downloads/attitude.pdf) — James Diebel, Stanford University technical report, 2006 (University of Groningen mirror); sequences without a repeated axis are singular at pitch π/2 + nπ (gimbal lock), quaternions avoid it.
6. [Quaternions and Attitude Representation](https://arxiv.org/abs/1708.08680) — Parwana and Kothari, arXiv 2017; q and -q give the same rotation, Hamilton (scalar first) vs JPL (scalar last) component order.
7. [RsWorkObject class](https://developercenter.robotstudio.com/api/robotstudio/api/ABB.Robotics.RobotStudio.Stations.RsWorkObject.html) — ABB RobotStudio API reference; a work object is a coordinate system for a workpiece, with a user frame and an object frame.
8. [US 6364888 B1: Alignment of master and slave in a minimally invasive surgical apparatus](https://patents.google.com/patent/US6364888B1/en) — Intuitive Surgical patent (granted 2002); end effector shown in the endoscope image follows the surgeon's hand, master pose in an eye frame compared with slave pose in the camera frame.

## Forward kinematics
id: forward-kinematics
requires: frames, encoder
aka: FK, DH parameters, Denavit-Hartenberg, kinematic chain, URDF

### Plain
Forward kinematics answers the question: if I know how far each joint is bent, where is the hand? It works like following walking directions: go 40 cm along the upper arm, turn by the elbow angle, go along the forearm, turn by the wrist angle, and you arrive at the hand. The robot does this arithmetic hundreds or thousands of times a second, using the joint angles its sensors report.

### Where the analogy breaks
Walking directions on a flat street have one kind of turn, but robot joints turn about axes pointing in different 3D directions, so each step is a full 3D rotation plus an offset. Real arms also differ slightly from their drawings, so the computed hand position is a model that is only as accurate as its lengths and angles.

### Precise
Forward kinematics (FK) maps joint values (angles for **revolute** joints, which rotate, and distances for **prismatic** joints, which slide) to the pose of every link and of the **tool center point** (TCP, the working point of the tool, such as the face of a suction cup). The arm is modeled as a **kinematic chain** (rigid links connected one after another by joints). Each joint contributes a homogeneous transform that depends on its current value, and FK is the ordered product: `T_base_tool = T1(q1) · T2(q2) · ... · T6(q6) · T_flange_tool`. For a serial arm (one chain of links from base to tool, unlike a [[delta]], whose several arms meet at one moving plate) the answer always exists, is unique, and is cheap to compute.

There are two common ways to write the per-joint transforms. **Denavit-Hartenberg (DH) parameters** describe each joint with four numbers: d (offset along the previous joint axis), theta (rotation about that axis, which is the joint variable for a revolute joint), a or r (length of the shortest line between the two joint axes) and alpha (the twist: the angle between the two joint axes, measured around that shortest line) [1]. Classic DH applies them as `Trans_z(d) · Rot_z(theta) · Trans_x(a) · Rot_x(alpha)`. The **modified DH** convention (used in Craig's textbook) attaches the frames to different places and multiplies in a different order [1], so feeding a table from one convention into code written for the other gives a confidently wrong pose. **URDF** (Unified Robot Description Format, the XML robot description used across ROS) does not use DH. Each joint names a parent link and a child link, an origin transform given as xyz in meters and roll-pitch-yaw in radians, a motion axis, and limits on position, velocity and effort [2].

Libraries parse the description into a chain and compute FK for you. KDL's recursive solver "recursively adds the poses" of successive segments and can return any intermediate link [3]. Pinocchio's forwardKinematics fills an array with the world pose of every joint [4]. FK is only as good as its numbers: nominal link lengths come from CAD, and the real arm differs slightly, which is why a robot can return to a taught point far better than it can reach a computed one (see [[repeatability]]). Without FK nothing in the stack knows where the tool is: no collision checking, no straight-line moves, no tool position on the teach pendant.

### On the cheese plate line
At the grape station, the six joint encoders of the 6-axis arm report angles every control cycle, and FK turns them into the pose of the soft gripper and of the bunch hanging under it. That pose feeds collision checking (is the lowest grape above the tray wall?) and any tool-speed limit the controller enforces. Suppose a technician fits longer fingers, moving the fingertips from 80 mm to 140 mm beyond the flange, and forgets to update the fixed flange-to-TCP transform (illustrative numbers). FK then places the virtual fingertips 60 mm from the real ones along the tool axis, so every grasp is off by that much, with the real fingers driving 60 mm deeper into the tote than planned.

### Elsewhere
On a car-factory robot, the tool position readout on the teach pendant while an operator jogs one joint at a time is FK running on the controller. In a humanoid or legged robot, FK from the hip, knee and ankle encoders is how the software knows where each foot is relative to the body, which balance control needs every cycle.

### Why it exists
Motors and encoders live in joint space (a list of angles), but tasks, parts and obstacles live in Cartesian space (positions and orientations in the room). FK is the exact, fast, one-way bridge from the first to the second, which makes it the base layer under inverse kinematics, motion planning and collision checking.

### Connects to
- [[frames]] — FK is a chain of frame transforms, one per joint.
- [[encoder]] — supplies the joint angles that FK consumes.
- [[inverse-kinematics]] — the harder reverse question, usually solved by calling FK repeatedly.
- [[collision-checking]] — places each link's shape using FK before testing for overlap.
- [[repeatability]] — FK model errors are why accuracy is worse than repeatability.

### Real products and tools
- **URDF** — the ROS XML robot description of links, joints, origins, axes and limits [2].
- **Orocos KDL** — C++ kinematics library with a generic recursive chain FK solver [3].
- **Pinocchio** — fast rigid-body kinematics and dynamics library for C++ and Python [4].
- **Drake** — model-based design toolbox with multibody kinematics and dynamics, with core development led by Toyota Research Institute [5].

### Common misconception
**Misconception:** If the joint encoders are very precise, the computed tool position is equally precise.

**Reality:** Encoders measure joint angles precisely, but FK multiplies those angles through a model of link lengths and offsets. Errors in that model, plus links and gears bending under load, show up directly as tool position error. ABB's Absolute Accuracy brochure (2005), for example, puts the typical gap between a real arm and its ideal model at 8-15 mm, caused by mechanical tolerances and deflection [6], far more than typical repeatability (see [[repeatability]]). Individual robots can be calibrated to shrink the model error, to about 0.5 mm with ABB's per-robot option [6].

### Key numbers
- DH: 4 parameters per joint, so a 6-axis arm is described by a 6x4 table [1].
- URDF joint origin: 6 numbers, xyz in meters and roll-pitch-yaw in radians, both defaulting to zero [2].

### Code sketch
```python
import numpy as np

def dh(theta, d, a, alpha):
    """Classic DH link transform: Trans_z(d) Rot_z(theta) Trans_x(a) Rot_x(alpha)."""
    ct, st = np.cos(theta), np.sin(theta)
    ca, sa = np.cos(alpha), np.sin(alpha)
    return np.array([
        [ct, -st * ca,  st * sa, a * ct],
        [st,  ct * ca, -ct * sa, a * st],
        [0.0, sa,       ca,      d     ],
        [0.0, 0.0,      0.0,     1.0   ],
    ])

# One row per joint: (d, a, alpha). theta comes from the encoder each cycle.
# Illustrative values with roughly the shape of a small 6-axis arm (meters, radians).
DH_TABLE = [(0.30, 0.00,  np.pi/2), (0.00, 0.40, 0.0),      (0.00, 0.05,  np.pi/2),
            (0.40, 0.00, -np.pi/2), (0.00, 0.00, np.pi/2),  (0.08, 0.00,  0.0)]
T_FLANGE_TOOL = np.eye(4)
T_FLANGE_TOOL[2, 3] = 0.080          # grape gripper: fingertips 80 mm out along the flange z axis

def forward_kinematics(q):
    T = np.eye(4)
    link_poses = []                   # every link's pose, reused by collision checking
    for qi, (d, a, alpha) in zip(q, DH_TABLE):
        T = T @ dh(qi, d, a, alpha)   # walk one link further out the chain
        link_poses.append(T.copy())
    return T @ T_FLANGE_TOOL, link_poses

tcp_pose, link_poses = forward_kinematics(read_encoders())   # 6 joint angles in radians
# URDF-based libraries (KDL, Pinocchio) do the same walk, but each step is
# "fixed origin from the XML (xyz, rpy)" followed by "rotation about the joint axis".
```

### Sources
1. [Denavit-Hartenberg parameters](https://en.wikipedia.org/wiki/Denavit-Hartenberg_parameters) — Wikipedia (secondary; cites Denavit and Hartenberg 1955 and Craig); definitions of d, theta, a (r), alpha; classic transform order; how modified DH differs.
2. [urdf/XML/joint](https://whiteoak.umd.edu/roswiki/urdf%282f%29XML%282f%29joint.html) — mirror of the ROS wiki URDF joint specification; joint types, origin xyz/rpy, axis, limits.
3. [Kinematic and Dynamic Solvers](https://orocos.org/book/export/html/860) — Orocos KDL documentation; ChainFkSolverPos_recursive, JntToCart and CartToJnt.
4. [Pinocchio inverse kinematics example](https://gepettoweb.laas.fr/doc/stack-of-tasks/pinocchio/master/doxygen-html/md_doc_b_examples_d_inverse_kinematics.html) — Pinocchio documentation; forwardKinematics updates every joint placement (data.oMi).
5. [Drake](https://drake.mit.edu/) — Drake project home; multibody kinematics and dynamics, core development led by Toyota Research Institute.
6. [Absolute Accuracy, Industrial Robot Option](https://library.e.abb.com/public/0f879113235a0e1dc1257b130056d133/Absolute%20Accuracy%20EN_R4%20US%2002_05.pdf) — ABB brochure (2005); real vs virtual robot typically 8-15 mm apart from mechanical tolerances and deflection, about 0.5 mm after per-robot compensation.

## Inverse kinematics
id: inverse-kinematics
requires: forward-kinematics, reach
aka: IK, Jacobian, damped least squares, singularity, elbow up, elbow down

### Plain
Inverse kinematics is the reverse question: I want the hand right here, tilted like this, so how should each joint bend? It is like reaching for a cup on a high shelf: your brain picks shoulder, elbow and wrist angles without effort, and there is usually more than one way to do it (elbow out to the side or elbow down). Sometimes the cup is simply too far away, and sometimes your arm is stretched so straight that a tiny hand movement needs a big, awkward joint movement.

### Where the analogy breaks
You find a comfortable reach by feel and correct as you go, while a robot must compute exact joint angles before it moves, and if the math finds no answer it simply cannot go there. Your arm also has more joints than the task strictly needs, while a typical industrial arm has exactly six, so its alternatives come as a small set of distinct postures rather than a smooth range.

### Precise
Given a target TCP pose, inverse kinematics (IK) finds joint values q such that FK(q) equals the target. Unlike FK, IK can have no answer (the target is outside the [[reach]] envelope or beyond joint limits), a handful of answers, or infinitely many. A typical 6-axis arm with a **spherical wrist** (the last three joint axes cross at one point) has up to eight solutions for one pose, the combinations of shoulder left or right, elbow up or down, and wrist flipped or not. Some 6-axis arms without that wrist layout, such as the FANUC CRX, can have up to sixteen [4]. A 7-axis arm, or a task that does not care about rotation around the tool axis, has infinitely many. Which solution you pick matters, because switching posture mid-motion means a large joint swing. Software usually picks the solution closest to the current joints, and vendor languages often make you state the intended posture explicitly: an ABB target, for example, carries configuration data recording which quadrant axes 1, 4 and 6 are in [7].

**Analytic IK** solves the equations in closed form from the arm's geometry and returns every solution at once. IKFast generates such solver code automatically and finds solutions "in a few microseconds" [2]. **Numerical IK** iterates instead. Each step computes the pose error e (a six-number vector: three for position, three for rotation) and the **Jacobian** J (a table with six rows and one column per joint, saying how far and which way the tool moves for a small move of each joint), solves for a small joint step, applies it, and repeats until the error is tiny. The plain **pseudoinverse** step (the matrix stand-in for "divide the error by J", which also works when J is not square) blows up near singularities, so practical solvers use **damped least squares** (the same step with a small damping term lambda added): `dq = J^T (J J^T + lambda^2 I)^-1 e`. The damping lambda gives up a little accuracy per step in exchange for never producing huge joint jumps; with lambda too large, convergence becomes slow [5]. Pinocchio's reference example uses this form with a tolerance of 1e-4 and at most 1000 iterations [1].

Numerical solvers return only one solution, usually one near their starting guess, and can stall against joint limits even when a solution exists. TRAC-IK runs two solvers side by side to escape these stalls: an improved version of KDL's Jacobian-step solver that detects when joint limits have trapped it, and an **SQP** optimizer (sequential quadratic programming, a general method for optimization with limits). It is a drop-in replacement for KDL's pseudoinverse solver [3].

A **singularity** is a posture where the Jacobian loses rank: some combination of joint motions stops moving the tool at all, so one direction of tool motion becomes impossible, however fast the joints turn. The classic cases are the fully stretched arm (elbow singularity), the wrist lined up with the first axis (shoulder singularity), and joint 5 at zero so that axes 4 and 6 line up (wrist singularity) [6]. Near one, a straight-line move demands joint speeds that grow without limit, so the controller slows down, stops with a speed-limit error, or (with damping) leaves the exact path slightly [5] [6].

### On the cheese plate line
At the grape station, bunches lie in a tote at random angles and the soft gripper may have to tilt to slide under a stem, so each grasp target is a full six-number pose: a position plus a tilt and a turn. That tilt is why this guide gives the grape station a 6-axis arm (a judgment call, made in [[six-axis]]), while the apple station, which only lifts, turns and sets down flat slices, can use a 4-axis delta: a standard 4-axis SCARA or delta controls only x, y, z and rotation about vertical, so it cannot tilt the gripper (see [[scara]], [[delta]]). IK typically returns several postures for each grasp pose, and the software keeps the one closest to the current joints so the gripper's air line does not wind around joint 6. A bunch lying against the far wall of the tote may need a tilt that puts a joint past its limit or the arm near a singularity; IK then returns nothing usable, and the software moves on to another grasp or another bunch instead of forcing the reach (illustrative scenario).

### Elsewhere
A robot sanding or painting a curved car bumper has to hold the tool perpendicular to the surface at every point. At some points that orientation may only be reachable in a different posture, and switching posture mid-stroke would drag the tool off the surface during the swing. So the whole path has to be checked for IK solutions in one consistent posture before the program runs.

### Why it exists
Tasks are stated where the work happens (put the slice here, at this angle), but motors are commanded in joint angles. IK is that translation, and because it can have no answer, several answers or an ill-conditioned answer, it is where much of a robot program's reachability and posture logic lives.

### Connects to
- [[forward-kinematics]] — numerical IK calls FK and its Jacobian every iteration.
- [[reach]] — the reach envelope is the set of poses for which IK has a solution.
- [[motion-planning]] — goal poses become goal joint configurations through IK, and straight-line moves call IK all along the path.
- [[grasp-planning]] — candidate grasps are discarded when IK cannot reach them.
- [[six-axis]] — six joints are the minimum to reach arbitrary positions and orientations.

### Real products and tools
- **IKFast** — generator (from the OpenRAVE project) of analytic C++ IK solvers, packaged as MoveIt plugins and tested on 6- and 7-axis arms [2].
- **TRAC-IK** — numerical IK combining an enhanced KDL Newton solver with SQP, a drop-in replacement for KDL's solver [3].
- **Pinocchio** — computes Jacobians; its documentation includes a damped least squares IK example [1].
- **Orocos KDL** — generic numerical IK solvers for any KDL chain, the baseline that TRAC-IK improves on [3].

### Common misconception
**Misconception:** If a point is inside the robot's reach envelope, the robot can get there.

**Reality:** A reach envelope drawn for position alone says nothing about which orientations are possible at each point. A point near the edge may be reachable with the tool pointing down and unreachable with it tilted, and a reachable pose may only be reachable in a posture that collides with something or sits near a singularity. IK has to succeed for the full pose, within joint limits, and the resulting posture still has to be checked.

### Key numbers
- Solutions per pose: up to 8 for 6-axis arms with a spherical wrist; up to 16 for some general 6-axis arms such as the FANUC CRX [4].
- Analytic IK (IKFast): a few microseconds per solve on recent processors [2].
- Numerical IK reference settings (Pinocchio example): tolerance 1e-4, at most 1000 iterations, step 0.1, damping 1e-12 in Python and 1e-6 in C++ [1]; good values depend on units, arm and required accuracy.

### Code sketch
```python
import numpy as np

def ik_dls(target_T, q_seed, fk, jacobian, lower, upper,
           tol=1e-4, max_iters=1000, lam=1e-3, step=0.5):
    """Numerical IK by damped least squares.
    Returns joint angles, or None (out of reach, blocked by limits, or a local minimum)."""
    q = q_seed.copy()                      # seed = current joints, so we usually land near this posture
    for _ in range(max_iters):
        e = pose_error(target_T, fk(q))    # 6-vector: 3 position + 3 rotation (axis times angle)
        if np.linalg.norm(e) < tol:
            return q
        J = jacobian(q)                    # 6 x N
        # Far from singularities this behaves like the pseudoinverse; near them,
        # lam keeps the step finite instead of exploding.
        dq = J.T @ np.linalg.solve(J @ J.T + lam**2 * np.eye(6), e)
        q = np.clip(q + step * dq, lower, upper)
    return None

def pick_posture(analytic_solutions, q_now, weights):
    """Analytic IK (IKFast-style) returns all postures; keep the closest one so the
    arm does not flip its elbow or wind the gripper's air line around joint 6."""
    valid = [q for q in analytic_solutions if within_limits(q)]
    if not valid:
        return None                        # this pose is out of reach in every posture
    return min(valid, key=lambda q: np.sum(weights * np.abs(q - q_now)))

# Singularity watch: the smallest singular value of J measures how close we are.
sigma_min = np.linalg.svd(jacobian(q_now), compute_uv=False)[-1]
if sigma_min < 1e-3:
    slow_down_or_replan()
```

### Sources
1. [Pinocchio inverse kinematics example](https://gepettoweb.laas.fr/doc/stack-of-tasks/pinocchio/master/doxygen-html/md_doc_b_examples_d_inverse_kinematics.html) — Pinocchio documentation; closed-loop IK with a damped pseudoinverse, eps 1e-4, IT_MAX 1000, DT 0.1, damping values.
2. [IKFast Kinematics Solver](https://moveit.picknik.ai/main/doc/examples/ikfast/ikfast_tutorial.html) — MoveIt documentation; analytic solutions in a few microseconds, tested on 6 and 7 DOF arms, more than 7 DOF not supported.
3. [trac_ik](https://mirror.umd.edu/roswiki/trac_ik.html) — mirror of the ROS wiki package page; concurrent enhanced-KDL and SQP solvers, drop-in replacement for KDL's pseudoinverse Jacobian solver.
4. [Path Planning and Optimization for Cuspidal 6R Manipulators](https://arxiv.org/html/2501.18505v2) — Elias and Wen, arXiv 2025; up to eight IK solutions for spherical-wrist arms, up to sixteen for the FANUC CRX.
5. [Introduction to Inverse Kinematics with Jacobian Transpose, Pseudoinverse and Damped Least Squares methods](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf) — Samuel R. Buss, UC San Diego report (2009 revision; CMU course mirror); pseudoinverse instability near singularities, DLS formula, damping too large slows convergence.
6. [Singularity](https://manual.doosanrobotics.com/en/user-manual/3.2.0/3-e-series/singularity) — Doosan Robotics e-Series user manual; wrist (axis 5 near 0), shoulder (axes 1 and 6 in line) and elbow (axis 3 near 0) singularities, joint speeds rising sharply in linear moves, joint moves unaffected.
7. [ConfigurationData struct](https://developercenter.robotstudio.com/api/robotstudio/api/ABB.Robotics.RobotStudio.Stations.ConfigurationData.html) — ABB RobotStudio API reference; arm configuration used when reaching a target, quadrants of axes 1, 4 and 6.

## Motion planning
id: motion-planning
requires: inverse-kinematics, collision-checking
aka: path planning, RRT, RRT-Connect, PRM, OMPL, CHOMP, STOMP, TrajOpt, joint move, linear move

### Plain
Motion planning finds a route for the whole arm from where it is to where it needs to be, without hitting anything. It is like carrying a long couch through a furnished apartment: you need a route not just for your feet but for every part of the couch, past every doorway and lamp. For simple jobs that repeat exactly, a person plans the route once; when the obstacles change from one cycle to the next, the software searches for a new route each time.

### Where the analogy breaks
You plan the couch move in the 3D apartment, but a robot planner usually searches an abstract space with one dimension per joint (six for a 6-axis arm), where a single point is a whole arm posture. The planner also only knows the obstacles it has been told about or has sensed, and it computes the whole route before the arm moves, so anything missing from its model, or anything that appears mid-motion, is invisible to it unless the plan is re-run.

### Precise
Start with the two basic move types. A **joint move** (point-to-point, PTP) interpolates every joint from its start angle to its goal angle. It is fast and singularities do not matter to it, because no IK is solved along the way, but the tool sweeps a curved path that is hard to predict by eye. A **linear move** (Cartesian, LIN) keeps the tool on a straight line, which means solving IK at every point along the line, so it can fail midway at a joint limit or near a singularity. MoveIt's Pilz industrial planner offers both, plus circular arcs (CIRC), with trapezoidal speed profiles [6]. Most industrial cells are programmed as sequences of such moves through taught waypoints. A planner is needed when free space changes from cycle to cycle.

**Sampling-based planners** search **configuration space** (C-space, the space of every possible combination of joint values) by drawing random configurations and keeping the collision-free ones. **RRT** (rapidly-exploring random tree) grows a tree from the start toward random samples, which pulls it toward unexplored space [3]. **RRT-Connect** grows trees from both the start and the goal and repeatedly tries to join them; it is the planner MoveIt 2 falls back to when no default is configured [9]. **PRM** (probabilistic roadmap) builds a reusable graph of collision-free configurations, which pays off when many queries are made in the same unchanging scene [2]. These planners are **probabilistically complete** (they find a path eventually if one exists) but cannot report that no path exists [5]. Their raw paths are jerky and need shortening and smoothing [4]. Variants such as RRT* and PRM* converge toward the shortest path as they are given more time [2].

**Trajectory optimizers** start from a guess (often a straight line in joint space) and bend it to lower a cost that combines smoothness and distance from obstacles. **CHOMP** does this by repeatedly nudging the whole path downhill on that cost in a way that keeps it smooth (covariant gradient descent) [4]. **STOMP** tries many randomly perturbed versions of the path and blends the better ones, which helps it escape the **local minima** (paths that no small change improves, even though a quite different path would be better) that trap CHOMP [5]. **TrajOpt** solves a series of simplified, bowl-shaped approximations of the problem (sequential convex optimization) and checks collisions continuously between waypoints; in its authors' benchmarks it was faster and solved more problems than OMPL planners and CHOMP [7]. Optimizers give smoother paths, but they can fail outright when the starting guess runs through a bad region. **OMPL** (Open Motion Planning Library) collects many sampling-based planners and deliberately contains no collision checking, so it plugs into whatever checker the host provides; it is MoveIt's default planning library [1].

### On the cheese plate line
Most of the line needs no planner. The cracker station's route from the cracker infeed to the tray is the same every cycle, so it is a taught joint move to a point 50 mm above the tray followed by a short linear move straight down; the tray belt stops each tray at the station, so the taught points stay valid. The grape station is different if bunches arrive piled at random in a tote (illustrative layout): the approach changes every pick and must avoid the tote walls, the camera bracket and the neighboring bunches, so a sampling planner plus smoothing runs for each pick. At 200 plates an hour each station has 18 s per plate. A planner that occasionally takes a large fraction of a second is affordable at the grape station, which makes one pick per plate, but would hurt the apple station, which must fit about four picks into the same 18 s.

### Elsewhere
Car-body spot-welding robots repeat the same paths thousands of times on identical bodies and fixtures, so their paths are often programmed offline in simulation tools such as Siemens Process Simulate, which covers spot welding and downloads finished programs to the robot controller [10]. A warehouse bin-picking robot faces a different scene every pick, so it plans online, and planning time becomes part of its cycle time.

### Why it exists
Hand-teaching works only when the world is identical every time. When obstacles, part positions or goals vary, the robot must find collision-free motion itself, and exhaustive search in a 6- or 7-dimensional joint space is far too slow, which is why randomized and optimization-based methods dominate.

### Connects to
- [[collision-checking]] — every sampled or optimized configuration is tested; it is the planner's inner loop.
- [[inverse-kinematics]] — turns goal poses into goal configurations and makes straight-line moves possible.
- [[trajectory-generation]] — a planner outputs a geometric path, and timing it is a separate step.
- [[moveit]] — wraps OMPL, Pilz, CHOMP and STOMP behind one interface.
- [[cycle-time]] — online planning time adds directly to each pick.

### Real products and tools
- **OMPL** — open-source library of sampling-based planners (RRT, RRT-Connect, PRM, RRT*, KPIECE and many more), with no collision checker of its own [1] [2].
- **MoveIt planners** — OMPL by default, plus the Pilz industrial planner (PTP, LIN, CIRC), CHOMP and STOMP [5] [6].
- **TrajOpt** — sequential convex trajectory optimizer by Schulman, Abbeel and colleagues [7].
- **Steven LaValle's Planning Algorithms** — free online textbook (Cambridge University Press, 2006) covering sampling-based planning [8].

### Common misconception
**Misconception:** A motion planner finds the best path.

**Reality:** Most sampling planners return the first feasible path they find, which is often long and zig-zagging, and it is then shortened and smoothed [4]. Asymptotically optimal variants only approach the best path as planning time grows [2], and gradient optimizers such as CHOMP can get stuck in a local minimum near their starting guess [5].

### Key numbers
- OMPL lists more than 40 geometric planners, from RRT and PRM to optimizing planners such as RRT*, BIT* and AIT* [2].
- Search dimension: one per joint, so 6 for a 6-axis arm and 7 for a 7-axis arm.
- Cheese plate time budget: 18 s per plate per station at 200 plates an hour (from the running example); at the apple station four slices share what is left after the tray belt's 1-2 s step, about 4 s per pick (see [[conveyor]]).

### Code sketch
```python
def rrt_connect(q_start, q_goal, is_valid, max_iters=5000, step=0.05):
    """Bidirectional RRT in joint space. is_valid(q): within limits and collision-free."""
    tree_a, tree_b = Tree(q_start), Tree(q_goal)
    for _ in range(max_iters):
        q_rand = sample_uniform_joint_space()            # a random arm posture
        q_new = extend(tree_a, q_rand, step, is_valid)   # one step toward it
        if q_new is not None and connect(tree_b, q_new, step, is_valid):
            path = join_paths(tree_a, tree_b, q_new)     # start ... q_new ... goal
            return shortcut(path, is_valid)
        tree_a, tree_b = tree_b, tree_a                  # alternate which tree grows
    return None   # nothing found within budget; this does NOT prove no path exists

def extend(tree, q_target, step, is_valid):
    q_near = tree.nearest(q_target)                      # nearest-neighbour search
    q_new = q_near + step * unit(q_target - q_near)
    if edge_is_valid(q_near, q_new, is_valid):           # check the segment, not just its end
        tree.add(q_new, parent=q_near)
        return q_new
    return None

def connect(tree, q_target, step, is_valid):
    """Greedily keep extending toward q_target until reached or blocked."""
    while True:
        q = extend(tree, q_target, step, is_valid)
        if q is None:
            return False
        if distance(q, q_target) < step:
            return True

def shortcut(path, is_valid, tries=200):
    """Raw RRT paths zig-zag: repeatedly replace a stretch with a straight segment."""
    for _ in range(tries):
        i, j = sorted(random_pair(len(path)))
        if edge_is_valid(path[i], path[j], is_valid):
            path = path[:i + 1] + path[j:]
    return path   # still untimed: trajectory generation adds speeds next
```

### Sources
1. [The Open Motion Planning Library](https://ompl.kavrakilab.org/) — OMPL project home (Kavraki Lab); sampling-based planners, no collision checking by design, default planning library in MoveIt.
2. [Available Planners](https://ompl.kavrakilab.org/planners.html) — OMPL documentation; planner list, PRM as multi-query, asymptotically optimal variants.
3. [Rapidly-exploring Random Trees: what are they?](https://lavalle.pl/rrt/about.html) — Steven LaValle's RRT pages; how an RRT grows and why it is biased toward unexplored space.
4. [CHOMP: Gradient Optimization Techniques for Efficient Motion Planning](https://publications.ri.cmu.edu/chomp-gradient-optimization-techniques-for-efficient-motion-planning/) — Ratliff, Zucker, Bagnell, Srinivasa, ICRA 2009; covariant gradient path optimization, sampling planner output needs post-processing.
5. [STOMP motion planner](https://moveit.picknik.ai/main/doc/how_to_guides/stomp_planner/stomp_planner.html) — MoveIt documentation; STOMP vs CHOMP local minima, OMPL probabilistic completeness.
6. [Pilz Industrial Motion Planner](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) — MoveIt documentation; PTP, LIN, CIRC with trapezoidal profiles, blending.
7. [Finding Locally Optimal, Collision-Free Trajectories with Sequential Convex Optimization](https://www.roboticsproceedings.org/rss09/p31.html) — Schulman et al., RSS 2013 (TrajOpt); benchmarks against OMPL and CHOMP.
8. [Planning Algorithms](https://lavalle.pl/planning/) — Steven M. LaValle, Cambridge University Press 2006, free online.
9. [ompl_interface.cpp](https://github.com/moveit/moveit2/blob/main/moveit_planners/ompl/ompl_interface/src/ompl_interface.cpp) — MoveIt 2 source; when no default_planner_config is set, the default planner type is geometric::RRTConnect.
10. [Process Simulate](https://www.siemens.com/en-us/products/tecnomatix/process-simulate-software/) — Siemens product page; offline robot programming, spot welding toolset, program download and upload to robot controllers, robot calibration.

## Trajectory generation
id: trajectory-generation
requires: motion-planning, speed-specs
aka: time parameterization, motion profile, trapezoidal profile, S-curve, jerk limit, Ruckig, TOTG

### Plain
A planned path says where the arm will go; trajectory generation decides how fast it moves at every moment along the way. It is like a good driver on a known route: speed up smoothly, cruise, and brake in time for each corner, never flooring the pedal or slamming the brakes. Doing this well makes the robot both quick and gentle on its load and its gears.

### Where the analogy breaks
A driver controls one car, while a robot must coordinate six joints so they all start and finish together, each within its own speed and torque limits. And unlike a driver reacting by feel, the robot computes the whole speed plan exactly, either in advance or afresh every millisecond.

### Precise
A **path** is geometry only (a sequence of joint configurations); a **trajectory** adds time, giving position, velocity and acceleration for every joint at every control tick. **Time parameterization** (assigning timing to a path) must respect each joint's limits on **velocity**, **acceleration** (how quickly velocity changes, bounded by motor torque) and often **jerk** (how quickly acceleration changes; abrupt jerk shakes the arm and its load and sets off vibrations). Without it, a controller handed bare waypoints would demand instant changes of speed at every corner, tripping drives or shaking the payload loose.

The classic single-joint profile is the **trapezoid**: accelerate at the limit, cruise at maximum velocity, decelerate at the limit. A short move never reaches cruise speed and becomes a triangle. Acceleration jumps instantly between values, so jerk is unlimited at the corners of the profile. The **S-curve** (jerk-limited) profile ramps acceleration up and down instead, trading a slightly longer move for much smoother motion. Multi-joint moves are **synchronized**: the slowest joint sets the duration and the others are slowed to finish with it, which is how MoveIt's Pilz planner uses a "lead axis" [5].

For whole paths, **TOTG** (time-optimal trajectory generation, from Kunz and Stilman) computes the fastest timing that follows a given joint-space path under velocity and acceleration limits, blending sharp corners with small circular arcs [3]. It is the default time parameterization in MoveIt 2 [4]. Because TOTG does not limit jerk, MoveIt can follow it with a **Ruckig** smoothing pass [4]. Ruckig itself is an **online** generator (it computes while the robot is moving instead of ahead of time): from any current state (position, velocity and acceleration) it computes a time-optimal, jerk-limited trajectory to a target state that may include a nonzero target velocity [1] [2]. Its open-source version is suited to recomputing every control cycle down to 500 µs [1], which lets a robot react to sensor input mid-motion, for example a target that is itself moving. Industrial robot controllers run their own built-in profile generators; tools like these matter when a PC streams motion to the robot.

### On the cheese plate line
At the apple station the limit is often not the motor but the grip. A vacuum cup holds a slice by suction, and a hard sideways acceleration can make the slice slide or peel off the cup, so the trajectory caps acceleration while carrying a slice more tightly than when the cup is empty (the right cap depends on cup size, vacuum level and how wet the cut surface is). The grape station adds a jerk limit for a different reason: the bunch hangs from its stem like a pendulum, leaning back while the arm speeds up, and any abrupt change in acceleration, above all the sudden end of braking at the slot, leaves it swinging, so it would arrive at the tray still moving and grapes could knock loose. One profile tuned for an empty arm would risk dropped slices and swinging bunches.

### Elsewhere
A palletizing robot carrying a heavy case of bottled drinks needs gentler acceleration than when it swings back empty, because the case's inertia and the gripper's hold limit how hard it can be pushed. With a trajectory generator that takes limits per move, the same path is simply timed two ways: aggressive on the empty return, gentle on the loaded stroke.

### Why it exists
Planners produce geometry, and motors need time-stamped setpoints that never exceed what the hardware and the payload can take. Separating "where" from "how fast" lets one path be retimed for a different payload, an operator's speed override or a moving target without planning again.

### Connects to
- [[motion-planning]] — supplies the untimed path.
- [[control-loops]] — follow the trajectory's position and velocity setpoints and use its acceleration for feedforward.
- [[speed-specs]] — datasheet joint speeds and accelerations are the limits the generator enforces.
- [[conveyor-tracking]] — online generators let the arm match a moving target's velocity.
- [[cycle-time]] — motion time is often the largest part of a pick cycle.

### Real products and tools
- **Ruckig** — open-source (MIT license) online jerk-limited trajectory generator, with a commercial Pro version; used by MoveIt 2 [1].
- **TOTG** — time-optimal path-following parameterization with open-source code from its authors [3], the default in MoveIt 2 [4].
- **MoveIt Pilz industrial motion planner** — PTP, LIN and CIRC moves with trapezoidal profiles and blending between moves [5].
- **Robot controllers** — every industrial controller generates its own motion profiles internally; see [[robot-controller]].

### Common misconception
**Misconception:** Raising a robot's speed limit, or buying a robot with a higher top speed, makes short pick-and-place moves proportionally faster.

**Reality:** For short moves, which most pick-and-place moves are, the arm spends most of its time accelerating and braking and may never reach top speed, so the acceleration and jerk limits set the cycle time more than the velocity limit does. With the illustrative limits under Key numbers, any joint move shorter than about 52° never reaches top speed at all. Raising the speed limit often changes nothing; raising acceleration, if the payload and grip allow it, does.

### Key numbers
- Ruckig open-source version: suited to control cycles down to 500 µs (2 kHz) [1]; tested on more than 1 billion random trajectories [2].
- Example Cartesian limits in a MoveIt Pilz configuration: 1 m/s translation, 2.25 m/s² translational acceleration, 1.57 rad/s rotation [5]; real values depend on robot and payload.
- Trapezoid arithmetic (illustrative limits): at 3 rad/s maximum velocity and 10 rad/s² acceleration, a move must be longer than v²/a = 0.9 rad (about 52°) to reach full speed at all.

### Code sketch
```python
import math

def trapezoid(distance, v_max, a_max):
    """Single-joint trapezoidal profile. Returns (t_accel, t_cruise, total_time)."""
    d_ramps = v_max**2 / a_max              # distance used by accelerating + braking at full speed
    if distance < d_ramps:                  # short move: a triangle, never reaches v_max
        t_acc = math.sqrt(distance / a_max)
        return t_acc, 0.0, 2 * t_acc
    t_acc = v_max / a_max
    t_cruise = (distance - d_ramps) / v_max
    return t_acc, t_cruise, 2 * t_acc + t_cruise

def synchronized_duration(start, goal, v_max, a_max):
    """Multi-joint PTP: the slowest joint (the lead axis) sets the duration;
    every other joint's profile is stretched to finish at the same moment."""
    return max(trapezoid(abs(g - s), v, a)[2]
               for s, g, v, a in zip(start, goal, v_max, a_max))

# Online and jerk-limited (Ruckig, Python bindings), recomputed every 1 ms tick
# from the actual current state toward a target that may itself be moving.
otg = Ruckig(6, 0.001)
inp, out = InputParameter(6), OutputParameter(6)
inp.current_position, inp.current_velocity, inp.current_acceleration = robot_state()
inp.target_position, inp.target_velocity = slice_joints, slice_joint_velocity
inp.max_velocity, inp.max_acceleration, inp.max_jerk = limits_for(payload="apple_slice")
while otg.update(inp, out) == Result.Working:
    send_setpoint(out.new_position, out.new_velocity, out.new_acceleration)
    out.pass_to_input(inp)                  # the new state becomes next tick's start
```

### Sources
1. [pantor/ruckig](https://github.com/pantor/ruckig) — Ruckig repository; inputs and limits, MIT license, Pro version, suited to control cycles down to 500 µs, used by MoveIt 2.
2. [Jerk-limited Real-time Trajectory Generation with Arbitrary Target States](https://www.roboticsproceedings.org/rss17/p015.html) — Berscheid and Kroeger, RSS 2021; time-optimal jerk-limited generation to full target states, tested on over 1 billion trajectories.
3. [Time-Optimal Trajectory Generation for Path Following with Bounded Acceleration and Velocity](https://www.roboticsproceedings.org/rss08/p27.html) — Kunz and Stilman, RSS 2012 (TOTG); circular blends, open-source implementation.
4. [Time Parameterization](https://moveit.picknik.ai/main/doc/examples/time_parameterization/time_parameterization_tutorial.html) — MoveIt documentation; TOTG is the default in MoveIt 2, Ruckig smoothing for jerk limits, velocity and acceleration scaling.
5. [Pilz Industrial Motion Planner](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) — MoveIt documentation; lead-axis synchronization, trapezoidal profiles, example Cartesian limits.

## Collision checking
id: collision-checking
requires: forward-kinematics
aka: collision detection, planning scene, FCL, padding, allowed collision matrix, ACM

### Plain
Collision checking answers one yes-or-no question extremely often: in this exact arm position, is any part of the robot, or anything it holds, touching something? It is like checking whether furniture fits by laying cardboard cutouts on a floor plan, one arrangement at a time: simple stand-in shapes tested against a drawing of the room. A planner asks this question thousands of times for a single plan, so the check has to be fast and has to err on the side of caution.

### Where the analogy breaks
The shapes are 3D and change with every joint angle, and a planned motion is checked as a series of snapshots, so a thin obstacle can slip between two snapshots unless continuous checking is used. The checker also only knows its drawing: a box left in the cell that nobody added to the model, and that no sensor sees, does not exist for it.

### Precise
Each robot link gets **collision geometry**: either a **mesh** (a surface made of many small triangles, accurate but slow to test) or **primitives** (boxes, spheres, cylinders and capsules, which are cylinders with rounded ends; fast and robust to test). A common practice is simpler shapes for checking and detailed meshes only for display, because mesh-against-mesh tests cost far more computation [5]. For each query, FK places every link shape at its pose, and a library such as **FCL** (Flexible Collision Library) tests pairs of shapes for overlap, minimum distance, or **continuous collision** (whether two shapes touch anywhere between two poses, which catches thin obstacles that step-by-step checks can jump over) [1]. To keep mesh checks fast, FCL wraps meshes in a bounding volume hierarchy (a tree of simple boxes around groups of triangles, so most triangle pairs are ruled out without being tested) [1].

The **planning scene** is the checker's model of the world: the robot's current state, fixed obstacles (conveyor, guards, camera bracket), objects added by perception, and objects **attached** to the robot (a held item moves with the gripper and is checked too) [7]. MoveIt can also feed a live **OctoMap** (a 3D grid of occupied cells built from depth cameras) straight into FCL [3]. An **allowed collision matrix** (ACM, a table of pairs whose contact is ignored) skips pairs that always touch or are supposed to touch, such as neighboring links or a suction cup and the item it holds [2] [6] [7]. **Padding** inflates the robot's shapes by a margin so that planned paths keep a gap from the environment; in MoveIt, environment checks use the padded robot while self-collision checks use the unpadded one [2].

Without collision checking, any change in the scene risks the arm driving into it at full speed; with too much padding, legitimate reaches into a tight tray get rejected as collisions. Collision checking in planning software is not a safety function: certified protection comes from [[guarding]] and [[safety-circuit]] hardware, not from the planner's model of the world.

### On the cheese plate line
The cheese station runs no planner, but its pick points follow wedges on the moving infeed belt and its place points shift with where the tray actually stopped, so each adjusted path is checked against a planning scene before it runs. That scene holds the tray as five thin boxes (base and four walls), the conveyor as one large box, the guard panels, the camera bracket, and the items already placed upstream: the grape bunch as a padded cylinder, the apple slices and cracker packs as small boxes. When the gripper closes on a wedge, the wedge is attached to the tool, and the ACM lets the fingers touch it while the wedge is still checked against the tray walls. Padding is a real trade-off here (illustrative numbers): a 2 cm margin that is sensible near the guards would make the last descent into a tight compartment look like a collision, so the cell can use a smaller margin near the tray, or treat the final taught 20 mm descent as a fixed move outside the planner.

### Elsewhere
In a car-body welding cell where two robots share space, each arm's planning scene has to include the other arm's current and planned positions, because there is no fixed wall between them. In a warehouse bin-picking cell, the scene is rebuilt from a depth camera every pick, and the gripper plus the item it will lift are checked against the point cloud of the bin's contents rather than a fixed CAD model.

### Why it exists
Robots move fast and carry hard tools, and every planned or adjusted path needs evidence that it stays clear before it runs. Because planners test thousands of candidate poses per plan, the check has to be cheap, which drives the use of simple shapes, bounding hierarchies and allowed-pair tables.

### Connects to
- [[motion-planning]] — calls the checker for every sampled configuration and path segment.
- [[forward-kinematics]] — places each link's shape before testing.
- [[perception]] — adds sensed objects and point clouds to the planning scene.
- [[moveit]] — maintains the planning scene and uses FCL underneath.
- [[guarding]] — certified physical protection that software collision checks do not replace.

### Real products and tools
- **FCL** — open-source library for collision, distance, tolerance and continuous collision queries on boxes, spheres, cylinders, capsules, meshes and octrees [1].
- **MoveIt planning scene** — world model with attached objects, an allowed collision matrix and padding, backed by FCL [2] [3].
- **OctoMap** — 3D occupancy map that MoveIt uses to bring depth-camera data into collision checking [3].
- **OMPL** — contains no collision checker; the host application supplies the validity check [4].

### Common misconception
**Misconception:** If the planner says a path is collision-free, the robot cannot hit anything.

**Reality:** The check is only as good as the model. Anything not in the planning scene, any camera-to-robot calibration error, and any difference between the real and the modeled tool are invisible to it. That is why cells keep padding [2], physical guarding and certified safety functions, and why collision checking is a planning aid rather than a safety device.

### Code sketch
```python
def is_state_valid(q, scene, padding=0.01):
    """The planner's inner loop: is joint configuration q collision-free?"""
    link_poses = forward_kinematics_all_links(q)               # one pose per link
    robot = [shape.inflated(padding).placed_at(link_poses[name])
             for name, shape in scene.robot_shapes.items()]
    held = [obj.shape.placed_at(link_poses["tool"] @ obj.grasp_offset)
            for obj in scene.attached_objects]                 # the cheese wedge rides along

    # 1) Robot and held objects against the world, using the padded robot.
    for a in robot + held:
        for b in scene.world_objects:                          # tray walls, conveyor, guards, octomap
            if scene.acm.allowed(a.name, b.name):
                continue                                       # e.g. fingers touching the wedge they hold
            if not boxes_overlap(a.aabb, b.aabb):              # cheap test rules out most pairs
                continue
            if fcl_collide(a, b):                              # exact test (primitives or mesh tree)
                return False

    # 2) Self-collision with the unpadded robot, skipping neighbouring links via the ACM.
    bare = {name: shape.placed_at(link_poses[name]) for name, shape in scene.robot_shapes.items()}
    for a, b in scene.self_pairs:
        if not scene.acm.allowed(a, b) and fcl_collide(bare[a], bare[b]):
            return False
    return True

def edge_is_valid(q1, q2, scene, resolution=0.01):
    """Discrete check along a segment. A thin obstacle can slip between samples,
    which is the gap that continuous collision checking closes."""
    n = max(2, int(max_joint_distance(q1, q2) / resolution))
    return all(is_state_valid(interpolate(q1, q2, i / n), scene) for i in range(n + 1))
```

### Sources
1. [flexible-collision-library/fcl](https://github.com/flexible-collision-library/fcl) — FCL repository; collision, distance, tolerance and continuous collision queries, supported shapes, OBBRSS mesh hierarchy, optional octree.
2. [Planning Scene](https://moveit.picknik.ai/main/doc/examples/planning_scene/planning_scene_tutorial.html) — MoveIt documentation; self-collision, allowed collision matrix, contacts, padded vs unpadded robot.
3. [Planning Scene Monitor](https://moveit.picknik.ai/main/doc/concepts/planning_scene_monitor.html) — MoveIt documentation; world geometry from sensors, OctoMap passed directly to FCL.
4. [The Open Motion Planning Library](https://ompl.kavrakilab.org/) — OMPL project home; contains no collision checking code by design.
5. [Adding physical and collision properties to a URDF model](https://github.com/ros2/ros2_documentation/blob/rolling/source/Capabilities/Simulation/URDF/Adding-Physical-and-Collision-Properties-to-a-URDF-Model.rst) — ROS 2 documentation source; mesh-to-mesh collision detection is far more expensive, so collision elements often use simpler geometry than visual ones.
6. [MoveIt Setup Assistant](https://moveit.picknik.ai/main/doc/examples/setup_assistant/setup_assistant_tutorial.html) — MoveIt documentation; self-collision matrix disables pairs that are adjacent, always in collision or never in collision, to cut planning time.
7. [Planning Scene ROS API](https://moveit.picknik.ai/main/doc/examples/planning_scene_ros_api/planning_scene_ros_api_tutorial.html) — MoveIt documentation; attaching an object so collision checking accounts for it, touch_links so the hand may touch it.

## Control loops
id: control-loops
requires: servo-drive, encoder
aka: PID, servo loop, cascaded control, feedforward, gain tuning, anti-windup

### Plain
A control loop is the reflex that keeps each joint where the plan says it should be: measure where the joint is, compare that with where it should be, and push harder or softer to close the gap, thousands of times a second. It is like steering to stay in a lane: drift right, steer a little left, check again. Steer too timidly and you drift out of the lane; steer too hard and you zig-zag across it.

### Where the analogy breaks
A driver looks ahead and anticipates curves, while a basic feedback loop only reacts to error that has already happened; anticipation is a separate feedforward term that must be added on purpose. A robot joint also stacks several loops inside each other (position, velocity, current), each running at a different speed, which has no counterpart in steering.

### Precise
The workhorse is the **PID controller**, which computes a command from the error (target minus measured). The **proportional** term (P: a gain times the current error) pushes back in proportion to the error; raising it speeds up the response, but too much causes **oscillation** (swinging back and forth past the target) and eventually instability (swings that grow instead of dying out) [1]. The **integral** term (I: a gain times the error accumulated over time) removes steady offsets, such as a joint sagging slightly under gravity or stuck short by friction, but adds **overshoot** (passing the target before settling back) [1]. It can also **wind up** (build a huge stored value while motion is blocked or the motor is at its limit, then lurch when released); the usual fix, **anti-windup**, clamps the integral or pauses it while the output is saturated (pinned at its limit) [6]. The **derivative** term (D: a gain times how fast the error is changing) damps motion and reduces overshoot, but amplifies sensor noise [1], so it is usually filtered and often computed from the measurement rather than the error to avoid a spike when the target jumps [2]. Tuning trades speed of response against overshoot and oscillation. The control-loop workbench on this site lets you change the three gains and watch these effects.

Servo drives run **cascaded loops**. An outer **position loop** turns position error into a velocity command, a middle **velocity loop** turns velocity error into a current command (current in the motor makes torque), and the innermost **current loop** sets the motor's current through the power electronics. Each inner loop must respond much faster than the loop around it [2], typically with 5-10 times the outer loop's bandwidth (how fast a change a loop can follow), or it cannot keep up with the commands the outer loop sends; that is also why tuning starts with the innermost loop [8]. Drive makers quote loop cycle times as short as 62.5 µs (a 16 kHz loop rate) [3] [4]. Above the drives, the robot controller updates setpoints more slowly, for example at 500 Hz on Universal Robots e-Series arms [5].

**Feedforward** adds the command you already know you will need, computed from the planned trajectory: velocity feedforward from the planned speed, torque feedforward from planned acceleration times the arm's inertia, and gravity compensation from the arm's model. Because it does not depend on the measured error, it cannot make the loop oscillate [2], so feedback gains can stay moderate while the tracking error stays small. Without good loops and feedforward, the arm lags behind its trajectory on fast moves, overshoots its stopping points, or buzzes while holding still.

### On the cheese plate line
At the cheese station, a poorly tuned joint that overshoots by 2 mm at the bottom of the place move pushes the wedge into the tray or squashes the cracker pack placed earlier; a loop tuned too soft lags behind, and the cycle slows because the arm must wait to settle before opening the gripper (illustrative numbers). Integral windup shows up if the wedge is pressed onto the tray base: the joint cannot reach a setpoint slightly below the base, so the integral term keeps growing and the gripper presses the wedge harder and harder; when the arm is told to rise, it first lingers and then overshoots upward while the stored value drains away, unless anti-windup clamps it [6]. Cold matters too. ABB's IRB 1200 specification, for example, recommends a warm-up run below 10 °C because temperature-dependent oil and grease viscosity can make the robot stop or run with lower performance, and it lists +5 °C as the lowest operating temperature, so that model is not rated for a 2-4 °C room at all [7]. Even on a cold-rated robot, friction compensation and gains tuned in a warm workshop may need retuning on site, because grease friction changes with temperature.

### Elsewhere
A car-factory robot carrying a heavy spot-welding gun feels very different loads at its shoulder depending on posture, because a stretched-out arm has far more inertia about the shoulder than a tucked-in one. Fixed feedback gains alone would be sluggish in one posture and oscillate in the other, so a dynamic model supplies feedforward torque for the predictable part and the feedback loop only corrects the leftover error.

### Why it exists
Motors do not move to a position by themselves; they produce torque, while the load, friction and gravity keep changing. Feedback turns "be at 32.5° now" into the right current and corrects disturbances the plan could not predict, while feedforward supplies the part that is predictable.

### Connects to
- [[servo-drive]] — runs the current, velocity and often position loops.
- [[encoder]] — supplies the measured position, and from it velocity, that the loops compare against.
- [[trajectory-generation]] — supplies the setpoints and the acceleration used for feedforward.
- [[torque-sensing]] — lets force and compliance loops be closed around measured joint torque.
- [[robot-controller]] — runs the slower outer loops and sends setpoints to the drives.

### Real products and tools
- **Beckhoff AX5000 servo drives** — current, speed and position control each down to 62.5 µs cycles [3].
- **Beckhoff AX8000 multi-axis servo system** — current control down to 62.5 µs, connected over EtherCAT (an industrial Ethernet network) [4].
- **Universal Robots RTDE** — interface that exchanges data with the arm at its 500 Hz real-time control rate [5].

### Common misconception
**Misconception:** Higher gains always mean tighter, more accurate control.

**Reality:** Raising P speeds the response only until the loop starts to oscillate, and beyond that it becomes unstable [1]. Raising I removes steady offset but adds overshoot, and raising D damps motion but amplifies sensor noise [1]. Good tuning is a balance, and much of the tracking accuracy on a fast robot comes from feedforward rather than aggressive gains [2].

### Key numbers
- Servo drive loop cycle times: down to 62.5 µs (a 16 kHz loop rate) for current, speed and position control on one drive family [3]; 62.5 µs current control at 8 kHz switching on another [4].
- Robot controller real-time loop: 500 Hz on UR e-Series and ur-Series arms [5].
- Cascade rule of thumb: the inner loop's bandwidth (how fast a change it can follow) is set 5-10 times that of the loop around it, per a trade-press tuning guide [8]; the right ratio depends on the drive and load.

### Code sketch
```python
class PID:
    def __init__(self, kp, ki, kd, dt, i_limit, out_limit, d_alpha=0.1):
        self.kp, self.ki, self.kd, self.dt = kp, ki, kd, dt
        self.i_limit, self.out_limit, self.d_alpha = i_limit, out_limit, d_alpha
        self.integral, self.prev_meas, self.d_filt = 0.0, None, 0.0

    def step(self, target, measured, feedforward=0.0):
        error = target - measured
        # I: accumulate, but clamp (anti-windup) so a blocked joint cannot store a lurch.
        self.integral = clamp(self.integral + error * self.dt, -self.i_limit, self.i_limit)
        # D on the measurement, not the error: no spike when the target jumps. Low-pass filtered.
        d_raw = 0.0 if self.prev_meas is None else -(measured - self.prev_meas) / self.dt
        self.d_filt += self.d_alpha * (d_raw - self.d_filt)
        self.prev_meas = measured
        u = feedforward + self.kp * error + self.ki * self.integral + self.kd * self.d_filt
        return clamp(u, -self.out_limit, self.out_limit)

# Cascade inside one joint's servo drive. Gains and rates are illustrative;
# in a real drive each loop runs on its own timer, the innermost fastest.
pos_loop = PID(kp=40.0, ki=0.0,   kd=0.0, dt=250e-6,  i_limit=0.0,  out_limit=V_MAX)
vel_loop = PID(kp=0.8,  ki=30.0,  kd=0.0, dt=125e-6,  i_limit=5.0,  out_limit=I_MAX)
cur_loop = PID(kp=12.0, ki=900.0, kd=0.0, dt=62.5e-6, i_limit=50.0, out_limit=V_BUS)

def control_tick(sp):                               # sp = setpoint from trajectory generation
    v_cmd = pos_loop.step(sp.pos, encoder.position(), feedforward=sp.vel)
    torque_ff = sp.acc * joint_inertia(q_now()) + gravity_torque(q_now())
    i_cmd = vel_loop.step(v_cmd, encoder.velocity(), feedforward=torque_ff / K_TORQUE)
    volts = cur_loop.step(i_cmd, current_sensor.read())
    pwm.set(volts)                                  # power stage turns volts into motor current
```

### Sources
1. [PID Theory Explained](https://www.ni.com/en/shop/labview/pid-theory-explained.html) — National Instruments; effect of P, I and D on speed, overshoot, oscillation, steady-state error and noise; tuning methods.
2. [Proportional-integral-derivative controller](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) — Wikipedia (secondary); cascade control with a faster inner loop, feedforward that cannot cause oscillation, derivative on measurement, windup.
3. [AX5000 digital compact servo drives](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax5000-digital-compact-servo-drives/) — Beckhoff; current, speed and position control each down to 62.5 µs.
4. [AX8000 multi-axis servo system](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax8000-multi-axis-servo-system/) — Beckhoff; shortest current controller cycle 62.5 µs at 8 kHz switching frequency.
5. [Real-Time Data Exchange (RTDE) Guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) — Universal Robots; real-time control loop at 500 Hz on e-Series and ur-Series.
6. [Integral windup](https://en.wikipedia.org/wiki/Integral_windup) — Wikipedia (secondary; cites Åström and Rundqwist 1989); causes (saturation, large setpoint changes) and fixes (clamping, conditional integration, back-calculation).
7. [IRB 1200 product specification, operating requirements](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=20) — ABB (document 3HAC046982-001), via ManualsLib; warm-up recommended below 10 °C because of temperature-dependent oil and grease viscosity; manipulator operating range +5 to +45 °C (+5 to +35 °C with food-grade lubrication).
8. [How are servo system velocity control loops tuned?](https://www.motioncontroltips.com/how-are-servo-system-velocity-control-loops-tuned/) — Motion Control Tips (Design World trade press; secondary); inner-loop bandwidth 5 to 10 times the outer loop's.

## Conveyor tracking
id: conveyor-tracking
requires: conveyor, photo-eye, trajectory-generation
aka: line tracking, belt tracking, moving frame, encoder latch, pick on the fly

### Plain
Conveyor tracking lets a robot work on things while they keep moving, instead of stopping the belt for every pick. It is like passing the baton in a relay race: you watch where the runner is, predict where they will be a moment later, run alongside at their speed, and make the handoff while both of you are moving. The robot does the same with a tray on a belt, using a sensor that counts exactly how far the belt has traveled.

### Where the analogy breaks
In a relay you watch the runner the whole time, but a robot usually sees the item once, at a sensor or camera, and from then on relies on a counter on the belt, trusting that the item does not slide. If the item slips or the count is miscalibrated, the robot keeps confidently tracking where the item should be, not where it is.

### Precise
The core part is a **belt encoder** (a sensor on a conveyor roller or motor that outputs a count for every small increment of belt travel), calibrated in counts per millimeter. When an item passes a trigger, such as a [[photo-eye]] beam or a camera image, the system **latches** the encoder count at that instant (hardware stores the counter value the moment the input switches, so software delays do not matter). Encoder interface modules such as Beckhoff's EL5101 provide a latch input for exactly this [2]. From then on the item's position along the belt is `x_at_trigger + (count_now - count_at_trigger) / counts_per_mm`, expressed in a **conveyor frame** whose direction is calibrated by teaching the robot two or more points on the belt; Doosan's setup, for example, records the encoder count and robot position at each taught point and computes counts per distance from them [4].

To work on the item, the controller attaches a moving work frame to the belt. Every control cycle the target pose is shifted by the latest belt travel, and the robot's own motion is layered on top of that moving frame. Working on a tracked item has three phases. **Intercept**: predict where the item will be when the arm arrives, using the belt velocity, and move to meet it there at matching speed. **Synchronized work**: pick, place or apply while moving with the belt. **Release**: leave before the item exits the **tracking window** (the stretch of belt the arm can reach). Online trajectory generators that accept a moving target state, such as Ruckig with a nonzero target velocity, fit the intercept phase [3]. Robot makers build this into the controller; KUKA.ConveyorTech, for example, synchronizes the robot to the conveyor in the background and can monitor up to five linear or circular conveyors [1].

Errors come from timing and calibration. Each millisecond of unaccounted delay between the item's real position and the robot's estimate becomes an offset equal to belt speed times delay: at 100 mm/s, 10 ms of latency is 1 mm. Item slip, belt stretch and a wrong counts-per-millimeter value grow with distance from the trigger, so the trigger belongs close to the robot.

### On the cheese plate line
At the apple station the tray belt indexes (moves one step, then stops), so the tray needs no tracking (see [[conveyor]]). The moving targets are the slices, which arrive in bulk on a continuously running infeed belt. A camera over that belt photographs the slices, and the belt encoder count is latched at the instant of each image, so the robot knows where every slice it saw is at any later moment from the latched count plus belt travel since. The delta intercepts a slice, picks it while moving with the belt, and carries it to the stopped tray, about four times in each 18 s cycle. At an illustrative infeed speed of 50 mm/s, 10 ms of unaccounted delay costs only 0.5 mm, small next to a slice, so belt slip and the counts-per-millimeter calibration matter more than latency here. A slice that leaves the tracking window unpicked runs off the end of the belt into a catch bin (illustrative).

### Elsewhere
Car assembly lines that move bodies continuously need robots that can work on a moving target, and KUKA describes ConveyorTech as synchronizing the robot to conveyor movement and as suited to assembly tasks [1]. The same latch-and-predict idea lets a fast picker take items off a moving belt after a camera locates them, without the belt ever stopping.

### Why it exists
Stopping a conveyor at every station means braking and restarting the whole line, and everything on it, for each robot action, which costs time and can shift loose items. Tracking lets the line run continuously while robots work on moving items, at the price of extra sensing, calibration and timing care.

### Connects to
- [[conveyor]] — the moving belt whose travel is measured.
- [[photo-eye]] — the trigger that tells the system an item has arrived.
- [[encoder]] — the same kind of sensor used in joints, here measuring belt travel.
- [[trajectory-generation]] — computes intercept motions toward a moving target.
- [[frames]] — a slice's pose lives in a belt frame that slides with the belt.

### Real products and tools
- **KUKA.ConveyorTech** — KUKA software option that synchronizes a robot with up to five linear or circular conveyors [1].
- **Beckhoff EL5101** — EtherCAT incremental encoder terminal with a 24 V latch input and up to 1 MHz input frequency [2].
- **Ruckig** — online trajectory generator that can target a moving state for intercept moves [3].
- **Other robot makers' tracking options** — other makers build in similar features, for example Doosan Robotics' conveyor coordinate setup [4] and Mitsubishi Electric's CR800 conveyor-to-robot calibration [5].

### Common misconception
**Misconception:** Conveyor tracking means the robot's camera watches the item continuously as it moves.

**Reality:** In the common latch-and-predict design the item is seen once, at a sensor or camera upstream, and after that its position is computed from the latched encoder count and the belt travel since [2]. The prediction is only as good as the encoder calibration and the assumption that the item does not slide on the belt.

### Key numbers
- KUKA.ConveyorTech: up to 5 conveyors monitored, up to 1024 components stored per conveyor [1].
- Encoder interface: input frequencies up to 1 MHz, 4 million increments per second with 4-fold evaluation (Beckhoff EL5101) [2].
- Latency error equals belt speed times delay: 1 mm at 100 mm/s with 10 ms of delay (computed, illustrative).
- Cheese line apple infeed: 10 ms of delay is 0.5 mm at an illustrative 50 mm/s belt speed (computed).

### Code sketch
```python
COUNTS_PER_MM = 40.0          # calibrated: run the belt a measured distance, divide the counts
BELT_DIR = taught_direction() # calibrated: unit vector from two points taught on the belt

def on_camera_image(latched_count, detections):
    """The camera trigger latched the infeed-belt encoder count at the exposure,
    so every slice found in this image is tied to that exact belt position."""
    for d in detections:                                   # slice poses in the belt frame
        slices.append(Slice(count_at_image=latched_count, T_conv_slice=d.pose))

def slice_pose_now(s, lookahead_s=0.0):
    travel_mm = (encoder.count() - s.count_at_image) / COUNTS_PER_MM
    travel_mm += belt_speed_mm_s() * lookahead_s           # predict ahead if asked
    shift = make_T(np.eye(3), BELT_DIR * travel_mm / 1000.0)
    return T_BASE_CONV @ shift @ s.T_conv_slice

def pick_slice(s):
    v_belt = BELT_DIR * belt_speed_mm_s() / 1000.0          # m/s, as a vector
    # 1) Intercept: guess the arrival time, predict the slice pose then, refine once or twice.
    t = 0.0
    for _ in range(3):
        goal = slice_pose_now(s, lookahead_s=t) @ T_SLICE_GRASP
        t = estimate_motion_time(robot.tcp_pose(), goal)
    if not inside_tracking_window(goal):
        return skip(s)                                     # it will leave reach first
    move_to_moving_target(goal, target_velocity=v_belt)    # e.g. Ruckig with a target velocity
    # 2) Synchronized: every control cycle, re-add the latest belt travel to the grasp pose.
    vacuum_on()
    while not vacuum_sealed():
        servo_to(slice_pose_now(s) @ T_SLICE_GRASP @ descend_step(),
                 velocity_feedforward=v_belt)
    # 3) Lift off while still moving with the belt, then carry it to the stopped tray.
    depart(start_velocity=v_belt)
    place_in_stopped_tray(next_free_slot())
```

### Sources
1. [KUKA.ConveyorTech](https://www.kuka.com/en-us/products/robotics-systems/software/application-software/kuka_conveyortech) — KUKA product page; background synchronization with conveyor motion, up to five linear or circular conveyors, up to 1024 components per conveyor.
2. [EL5101 incremental encoder interface](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el5xxx-position-measurement/el5101.html) — Beckhoff; incremental encoder input up to 1 MHz, 24 V gate/latch input that stores the counter value.
3. [pantor/ruckig](https://github.com/pantor/ruckig) — Ruckig repository; target state can include velocity and acceleration, so the generator can aim at a moving target.
4. [Conveyor Coordinate](https://manual.doosanrobotics.com/en/dart-bridge-manual/1.6/publish/conveyor-coordinate) — Doosan Robotics manual; taught points X1, X2 (optionally four) and Y set the conveyor axes, encoder count and robot pose saved at each point, count per distance computed automatically.
5. [CR800 series instruction manual, calibration of conveyor and robot coordinate systems](https://manualslib.com/manual/1851536/Mitsubishi-Electric-Cr800-Series.html?page=61) — Mitsubishi Electric, via ManualsLib; calibration finds the conveyor direction in robot coordinates and the robot travel per encoder pulse.

## State machines and behavior trees
id: state-machines
requires: none
aka: finite state machine, FSM, behavior tree, BT, task sequencing

### Plain
Every robot station needs a script that decides what to do next: wait for a tray, look, pick, check the grip, place, and what to do when a step fails. Think of a cook working from a recipe card: at any moment the cook is on one step, and the card says which step comes next and what to do if the sauce burns. A state machine writes that card as numbered steps with arrows between them. A behavior tree writes it as an outline of goals with backup plans, and a kitchen timer prompts the cook many times a second to say how the current step is going, re-checking from the top only the lines the author marked "check every time".

### Where the analogy breaks
A cook improvises when something unexpected happens; a state machine or behavior tree only handles the failures someone wrote down in advance, and anything else leaves the station stuck or faulted. The timer prompt is a mechanical signal, not judgment: a problem that appears in the middle of a step is noticed only if a check for it sits in a part of the tree that is re-read on every prompt.

### Precise
A **finite state machine** (FSM: a program that is always in exactly one of a fixed list of states, and moves to another state only along a defined transition when that transition's condition becomes true) is the oldest way to sequence a robot. A pick cycle might be WAIT_TRAY, DETECT, PLAN, APPROACH, GRIP, VERIFY, PLACE, RETREAT, each state running an entry action and then checking its exits. SMACH (a Python task framework from ROS 1 whose repository now has a ROS 2 branch) [5] and YASMIN (a ROS 2 state machine library in C++ and Python with a web viewer for monitoring) [6] add hierarchy: a state can contain a whole smaller state machine. On a PLC the same pattern is a step chain, see [[plc-programming]]. What breaks: every cross-cutting rule (pause for an operator, retry, abort when a guard door opens) must be added as arrows out of many states, so transitions multiply, and one forgotten arrow leaves the robot stuck.

A **behavior tree** (BT: a tree of small tasks in which each parent decides which of its children to run) is driven by a **tick** (a signal sent from the root down the tree that asks each visited node to do a little work and report back) [1]. Every node answers SUCCESS, FAILURE, or RUNNING (not finished yet) [1]. A **Sequence** runs its children left to right and stops at the first failure; a **Fallback** (also called a Selector) runs them left to right until one succeeds [1]. A **decorator** wraps one child and changes or repeats it; RetryUntilSuccessful re-ticks a failed child up to num_attempts times [10]. Leaves are **actions** (do something, may return RUNNING) and **conditions** (check something, never RUNNING) [1]. When conditions sit under a parent that re-ticks them on every tick, a tree can notice "tray no longer in place" while a motion is still RUNNING and switch branches; Colledanchise and Ogren argue this makes behavior trees both modular and reactive [7].

Three details bite in practice. An action that blocks (waits inside its own code until the work is done) instead of returning RUNNING freezes the whole tree, which is why BehaviorTree.CPP treats asynchronous (non-blocking) actions as first-class [2]. Some repeat decorators loop inside a single tick; MoveIt Pro even names one RepeatUnlessFailureWithinTick [9]. And "memory" changes behavior: in py_trees a Sequence with memory jumps straight back to the child that was RUNNING, skipping earlier children, while one without memory re-checks every earlier child on each tick, which is how guard conditions (checks that must stay true while later steps run) stay live [3]. BehaviorTree.CPP makes the same split with different names: its plain Sequence resumes at the RUNNING child without re-checking earlier ones, and only a ReactiveSequence restarts from the first child on every tick [11], so a guard placed in front of a long motion in a plain Sequence is checked once, not continuously.

### On the cheese plate line
At the cheese pick station (wedges assumed to arrive loose on an infeed belt beside the tray conveyor), three sequencers share the work: the line PLC runs a step chain that stops each tray, raises a "tray ready" bit, and releases the tray on "robot done"; the robot controller runs a short vendor program that executes moves and switches the vacuum; and a behavior tree on the cell PC asks perception for a wedge, plans the grasp, commands the moves, retries, and gives up when it must. At 200 plates an hour a tray arrives every 18 s, so each of the three wedges gets at most about 6 s including any retry, and less in practice, because part of the 18 s goes to moving the tray in and out (the PLC's 15 s robot timeout in [[plc-programming]] leaves about 3 s for that). The tree in the code sketch allows two attempts per wedge and then flags the tray for rework instead of stalling the line. E-stops and guard doors stay out of all three sequencers, in hardwired [[safety-circuit]] logic.

### Elsewhere
A delivery robot in a hospital or warehouse is the textbook case for a state machine that calls long-running ROS 2 actions: the high-level state machine sends "go to this waypoint" to the navigation system, receives progress feedback, and can cancel or replace the goal if plans change [8]. A behavior-tree version would wrap that navigation action in a Fallback, so a failed route triggers a recovery branch (back up, re-plan) before the robot calls for help.

### Why it exists
Most of the code in a working robot cell is not motion math but deciding what to do next and what to do when something fails. Writing that logic as an explicit state machine or tree makes it visible, testable one step at a time, and changeable without touching the motion code.

### Connects to
- [[plc-programming]] — PLC step chains and sequential function charts are the same idea running on the line controller
- [[ros2]] — tree and state-machine nodes usually call ROS 2 actions and services, and RUNNING maps onto an action that has not finished
- [[perception]] — a low-confidence detection is a normal FAILURE that the tree must route to a retry
- [[grasp-planning]] — the retry branch can ask for the next-best grasp instead of a new image
- [[watchdogs]] — a timeout on each step is what turns a hang into a handled failure

### Real products and tools
- **BehaviorTree.CPP** — C++ library; trees are XML files loaded at run time, edited in the Groot2 visual editor, with asynchronous actions built in; documentation is at version 4.11 [1][2]
- **py_trees** — Python behavior tree library with Sequences, Selectors, Parallels, and decorators [3]; release 2.6.0 came out in September 2026 [4]
- **SMACH (executive_smach)** — task-level Python state machine framework with ROS integration; its repository carries a ros2 branch [5]
- **YASMIN** — ROS 2 state machine library in C++ and Python with ready-made states and a web viewer [6]
- **MoveIt Pro** — PickNik's commercial manipulation platform, whose behaviors are built on BehaviorTree.CPP [9]

### Common misconception
**Misconception:** Behavior trees replaced state machines, so new robot code should always use a tree.

**Reality:** The main selling points of behavior trees are modularity and reactivity [7], and those only pay off when there are many conditions, retries, and fallbacks to recombine, or sub-behaviors to reuse across stations. For a fixed eight-step pick cycle with two failure exits, a state machine or a PLC step chain is shorter and easier for a maintenance technician to read. A sensible split is a PLC step chain for the line and a tree only on the PC that does vision and planning.

### Key numbers
- Time per wedge at the cheese station: at most about 6 s (18 s per tray at 200 plates an hour, divided by three wedges), minus a share of the time the tray spends moving in and out; this is arithmetic on the running example, not a measured value
- Node results in BehaviorTree.CPP: three, SUCCESS, FAILURE, and RUNNING [1]

### Code sketch
```xml
<!-- BehaviorTree.CPP v4 XML for the cheese station's cell-level logic.
     {curly} names are blackboard entries: variables shared between nodes. -->
<root BTCPP_format="4">
  <BehaviorTree ID="CheeseStation">
    <Sequence>
      <WaitForPlcBit bit="tray_ready"/>             <!-- RUNNING until the PLC says go -->
      <Repeat num_cycles="3">                        <!-- three wedges per tray -->
        <Fallback>
          <RetryUntilSuccessful num_attempts="2">
            <Sequence>
              <DetectWedge  target="{wedge}"/>       <!-- FAILURE if confidence below 0.8 -->
              <PlanSuction  wedge="{wedge}" grasp="{grasp}"/>
              <MoveTo       pose="{grasp}" offset_z="0.05"/>  <!-- async: RUNNING while moving -->
              <MoveTo       pose="{grasp}" offset_z="0.0"/>
              <SetVacuum    on="true"/>
              <VacuumOk/>                            <!-- condition: vacuum switch is made -->
              <PlaceInNextSlot/>
            </Sequence>
          </RetryUntilSuccessful>
          <FlagTrayForRework/>                       <!-- both attempts failed: mark the tray -->
        </Fallback>
      </Repeat>
      <SetPlcBit bit="robot_done"/>
    </Sequence>
  </BehaviorTree>
</root>
<!-- How a Fallback handles one tick (simplified):
       for child in children:
           status = child.tick()
           if status != FAILURE: return status   # SUCCESS or RUNNING ends this tick
       return FAILURE                            # every option failed            -->
```

### Sources
1. [The basics of Behavior Trees](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) — BehaviorTree.CPP documentation, version 4.11; ticks, node results, Sequence, Fallback, retry decorators
2. [BehaviorTree.CPP README](https://raw.githubusercontent.com/BehaviorTree/BehaviorTree.CPP/master/README.md) — project repository; XML trees loaded at run time, asynchronous actions, Groot2 editor
3. [py_trees composites](https://py-trees.readthedocs.io/en/release-2.4.x/composites.html) — py_trees documentation; Sequence and Selector behavior with and without memory
4. [py_trees release 2.6.0](https://github.com/splintered-reality/py_trees/releases/tag/2.6.0) — GitHub; release dated September 2026
5. [executive_smach](https://github.com/ros/executive_smach) — GitHub; SMACH description and ros2 branch
6. [YASMIN: Yet Another State MachINe library for ROS 2](https://arxiv.org/abs/2205.13284v1) — Gonzalez-Santamarta et al.; ROS 2 state machine library in C++ and Python
7. [Behavior Trees in Robotics and AI: An Introduction](https://arxiv.org/abs/1709.00084) — Colledanchise and Ogren; behavior trees as modular and reactive control structures
8. [Actions](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/About-Actions.rst) — ROS 2 documentation source; a high-level state machine sending a waypoint goal, with feedback and cancel
9. [repeat_unless_failure_within_tick.hpp](https://docs.picknik.ai/api/files/behavior/include/moveit-pro-behavior/behaviors/core/repeat-unless-failure-within-tick-hpp/) — MoveIt Pro API docs; a decorator built on BehaviorTree.CPP that repeats a child within one tick
10. [Decorators](https://www.behaviortree.dev/docs/nodes-library/DecoratorNode) — BehaviorTree.CPP documentation, version 4.11; RetryUntilSuccessful (num_attempts) and Repeat (num_cycles)
11. [Sequences](https://www.behaviortree.dev/docs/nodes-library/SequenceNode) — BehaviorTree.CPP documentation, version 4.11; Sequence resumes at a RUNNING child, ReactiveSequence restarts from the first child, SequenceWithMemory

## Perception
id: perception
requires: camera-2d, depth-camera, frames
aka: machine vision, computer vision, object detection, pose estimation

### Plain
Perception turns camera images into the few facts a robot needs before it reaches: which object, exactly where it is, which way it is turned, and how sure the software is. It works like someone sorting laundry from a heap: they do not study every thread, they decide "that is a sock, right there, lying sideways" and grab it. Older methods find objects with fixed rules about brightness and shape, while newer ones learn what objects look like from many example pictures.

### Where the analogy breaks
A person sorting laundry understands what a sock is and copes with one they have never seen; a vision system knows only what its rules or training pictures covered, and it can be confidently wrong about something new. It also needs calibrated cameras and measured depth to say "where" in millimeters, which a person judges by feel.

### Precise
**What a pick needs.** The output contract is small: a **6D pose** (three numbers for position and three for orientation, saying where the object is and which way it faces) in the robot's base frame (see [[frames]] and [[hand-eye-calibration]]), a **confidence** (a 0-1 score attached to each detection, used to decide whether to act on it), and often a **mask** (the exact pixels that belong to the object) and a class label [5]. [[grasp-planning]] turns the pose and mask into a gripper target, and the [[state-machines]] logic re-images or skips when confidence is below a threshold. Network confidence cannot be taken at face value: modern neural networks are often poorly calibrated, meaning their confidence does not match how often they are right [6], so thresholds are set from measured hit rates on images from the real line.

**Classical vision** uses hand-set rules. **Thresholding** marks each pixel as object or background by comparing its brightness or color to a cutoff. **Blob analysis** groups touching foreground pixels into regions and measures each region's area, center, and orientation. **Template matching** slides a small reference image across the camera image, scores the similarity at every position, and takes the best score as the match [1]; it compares at one size and angle, so rotated or rescaled parts need extra searches. These methods are fast, explainable, and need no training data, but they break when lighting, background, or the objects themselves vary.

**Deep learning** learns the rules from labeled examples. **Object detection** puts a box, a class name, and a confidence on each object; **instance segmentation** also outputs each object's mask. Mask R-CNN (2017) did this by adding a mask branch to a detector and ran at about 5 frames per second [2]; a small current model, Ultralytics YOLO26n-seg, takes about 2 ms per image on an NVIDIA T4 GPU and about 53 ms on a CPU [5]. **6D pose estimation** recovers full position and orientation: FoundationPose estimates and tracks the pose of objects it was never trained on, given either a CAD model or a few reference images [3]. In the BOP Challenge 2024, the most accurate unseen-object method came within about 4% of the best 2023 method for known objects but needed about 24.9 s per image, while a more practical entry took about 0.8 s [4].

**Depth and point clouds.** A depth camera returns a **point cloud** (a list of 3D points, each an x, y, z position, sometimes with color). A common pipeline crops to the work area, removes the belt or table plane, splits what is left into clusters (one per object), and fits a box or principal axes (the directions in which the cluster is longest and shortest) to each cluster to get a pose; the tools are covered in [[opencv]]. For flat items lying on a belt of known height, a 2D camera plus that height is often enough, and it is cheaper and faster.

### On the cheese plate line
At the cheese station a 2D camera looks down at the infeed belt, and because the wedges are pale yellow on a dark blue belt (an assumed, deliberately chosen belt color), a color threshold plus blob analysis finds them without any training data. Each blob's area screens out crumbs and two touching wedges, the tip direction comes from the triangle's shape (the tip is the blob pixel farthest from its center), and a calibrated pixel-to-plane mapping gives x, y, and yaw in the robot base frame, with z set to the known belt height plus the wedge's thickness. That mapping is calibrated at the height of the wedges' top faces, not the belt surface, because the camera sees the top face, and a mapping calibrated at belt level pushes targets outward, away from the spot under the camera (for example about 4.5 mm for a 20 mm thick wedge 200 mm off-center under a camera 0.9 m up, by similar triangles). Detections below a confidence of 0.8 (a starting value to tune) are dropped and the behavior tree takes a new image rather than guessing. The grape station is the opposite case: bunches tangle and vary, so it is the natural place for a trained instance-segmentation model and a depth camera.

### Elsewhere
In warehouse picking, a station facing a tote of hundreds of different products cannot keep a template or a trained class for every product, so it uses class-agnostic segmentation (outlining every distinct thing without naming it) plus depth, and leaves the choice of contact to the grasp planner. This is still the hard case: in the BOP Challenge 2024, 2D detection of unseen objects remained roughly 35% less accurate than detection of objects seen in training [4].

### Why it exists
Fixed taught positions only work when parts arrive in exactly the same place every time, which loose food on a belt never does. Perception closes the gap between where the robot assumes an object is and where it actually is, and its confidence score tells the rest of the system when not to trust it.

### Connects to
- [[camera-2d]] — most structured picking starts from a single overhead 2D image
- [[depth-camera]] — supplies the point clouds that 3D and 6D methods need
- [[hand-eye-calibration]] — converts a pose seen by the camera into robot coordinates; its error adds directly to the pick error
- [[grasp-planning]] — consumes the pose, mask, and confidence
- [[learned-policy]] — end-to-end learned policies fold perception into the policy instead of producing an explicit pose

### Real products and tools
- **OpenCV** — open-source library whose thresholding, blob, and template-matching functions are the parts of most classical pipelines [1]; see [[opencv]]
- **MVTec HALCON** — commercial machine vision software covering matching, 3D matching, measurement, calibration, and deep learning [7]
- **Ultralytics YOLO26** — detection and instance-segmentation models that output a mask, box, class, and confidence for each object [5]
- **FoundationPose** — research model for 6D pose estimation and tracking of novel objects from a CAD model or reference images [3]
- **BOP benchmark** — the standard public comparison of 6D pose methods, with a recurring public challenge; the 2024 edition was the sixth [4]

### Common misconception
**Misconception:** A detection with confidence 0.95 is right 95% of the time.

**Reality:** A network's confidence is a score, not a measured probability, and modern networks tend to be overconfident [6]. A team sets its accept threshold by running the model on images from the real line and counting hits and misses at each threshold, and repeats that after any change of lighting, camera, or product.

### Key numbers
- Mask R-CNN instance segmentation: about 5 frames per second on the authors' 2017 setup [2]
- YOLO26n-seg inference: about 2 ms on an NVIDIA T4 GPU with TensorRT and about 53 ms on a CPU with ONNX, averaged over COCO validation images; depends on model size, image size, and hardware [5]
- Unseen-object 6D pose, BOP 2024: about 0.8 s per image for a practical method and about 24.9 s for the most accurate one [4]
- Template matching output: a score map of (W - w + 1) by (H - h + 1) values for a W by H image and a w by h template [1]

### Code sketch
```python
import cv2 as cv
import numpy as np

def find_wedges(bgr, px_to_base, top_z, min_conf=0.8):
    """Classical pipeline. Returns (x, y, z, yaw, conf) in the robot base frame, best first.
    top_z: belt height plus wedge thickness; px_to_base is calibrated at that height."""
    hsv = cv.cvtColor(bgr, cv.COLOR_BGR2HSV)
    # 1. Threshold: pale yellow cheese on a dark blue belt (bounds tuned on site images)
    mask = cv.inRange(hsv, (15, 40, 120), (40, 255, 255))
    mask = cv.morphologyEx(mask, cv.MORPH_OPEN, np.ones((5, 5), np.uint8))  # remove specks
    # 2. Blobs: group touching foreground pixels and measure each group
    n, labels, stats, cents = cv.connectedComponentsWithStats(mask)
    targets = []
    for i in range(1, n):                            # label 0 is the background
        area = stats[i, cv.CC_STAT_AREA]
        if not 2500 <= area <= 9000:                 # crumbs, or two wedges touching
            continue
        pts = cv.findNonZero((labels == i).astype(np.uint8)).reshape(-1, 2)
        _, (w, h), _ = cv.minAreaRect(pts)
        cx, cy = cents[i]
        # The tip is the blob pixel farthest from the centroid (true for any wedge longer than it
        # is wide). The min-area box cannot give the direction: for a triangle, boxes flush with
        # each of its sides can have the same area, so the box orientation is ambiguous.
        tip = pts[np.argmax(((pts - (cx, cy)) ** 2).sum(axis=1))]
        yaw_img = np.arctan2(tip[1] - cy, tip[0] - cx)  # image-frame angle; convert with the calibration
        fill = area / max(w * h, 1.0)                # a lone triangle fills about half its box
        conf = float(np.clip(1.0 - abs(fill - 0.5) / 0.2, 0.0, 1.0))  # heuristic score, not a probability
        if conf < min_conf:
            continue                                 # the behavior tree re-images or skips
        # 3. Pixels -> top-face plane in the robot base frame (homography from camera calibration)
        x, y = cv.perspectiveTransform(np.float32([[[cx, cy]]]), px_to_base)[0, 0]
        targets.append((float(x), float(y), top_z, float(yaw_img), conf))
    return sorted(targets, key=lambda t: -t[4])
```

### Sources
1. [Template Matching tutorial (source)](https://raw.githubusercontent.com/opencv/opencv/4.x/doc/py_tutorials/py_imgproc/py_template_matching/py_template_matching.markdown) — OpenCV project; how matchTemplate slides and scores, output size, minMaxLoc
2. [Mask R-CNN](https://arxiv.org/abs/1703.06870) — He, Gkioxari, Dollar, Girshick, 2017; instance segmentation by adding a mask branch, about 5 fps
3. [FoundationPose (arXiv 2312.08344)](https://arxiv.org/abs/2312.08344) — Wen et al.; unified 6D pose estimation and tracking of novel objects, model-based or model-free
4. [BOP Challenge 2024 on Model-Based and Model-Free 6D Object Pose Estimation](https://arxiv.org/abs/2504.02812v3) — Nguyen et al.; accuracy and runtime of unseen-object methods, detection gap
5. [Instance Segmentation](https://docs.ultralytics.com/tasks/segment/) — Ultralytics documentation; outputs (mask, box, class, confidence) and YOLO26n-seg timings
6. [On Calibration of Modern Neural Networks](https://arxiv.org/abs/1706.04599) — Guo et al., ICML 2017; network confidence is poorly calibrated
7. [HALCON](https://www.mvtec.com/products/halcon) — MVTec product page; scope of the software

## Grasp planning
id: grasp-planning
requires: perception, vacuum-gripper, rigid-gripper
aka: grasp synthesis, grasp detection, grasp quality, pick point selection

### Plain
Knowing where an object is does not yet say where to touch it or from which direction. Picking up a sheet of glass with a suction cup and a pencil with tongs shows the two main cases: the cup wants a flat, clean spot near the middle, and the tongs want two opposite sides they can squeeze. Grasp planning scores many possible touch points and picks the best one that the arm can actually reach without bumping into anything on the way.

### Where the analogy breaks
A person feels the grip and adjusts in a split second; most robot grasps are planned once from a picture and then executed blind, with only a vacuum sensor or the finger position reporting afterward whether it worked. The score is a prediction, often learned from simulation, not a guarantee.

### Precise
**Inputs and outputs.** The planner takes the object's pose, mask, or point cloud from [[perception]], a model of the gripper, and the scene around the object. It returns a **grasp pose** (where the gripper's working point goes and how it is turned), an approach direction with a pre-grasp point a few centimeters back along it, a finger width or vacuum setting, and a **grasp quality score** (an estimate of the chance the grasp holds through the move). Candidates the arm cannot reach ([[inverse-kinematics]]) or whose approach collides ([[collision-checking]]) are discarded however well they score.

**Suction.** A vacuum cup must **seal**: its rim needs a surface that is flat and smooth across the cup's diameter. It should sit near the **center of mass** (the balance point) so the object's weight does not twist it off during fast moves, and approach along the surface **normal** (the direction pointing straight out of the surface). Dex-Net 3.0 made this explicit with a contact model that scores seal formation and resistance to the object's weight, trained a network on 2.8 million synthetic point clouds, and reported 98% success on simple shapes, 82% on typical ones, and 58% on adversarial ones [2].

**Fingers.** A parallel-jaw gripper wants an **antipodal** grasp: two contacts on opposite sides whose squeezing forces point straight at each other and cancel. The Grasp Pose Detection (GPD) paper defines a frictionless antipodal grasp this way and notes that any such grasp also achieves **force closure** (the fingers can resist pushes from every direction) once there is any friction [3]. With friction the squeeze may tilt from the surface normal by up to the friction angle (the steepest push that does not make the finger slide, wider for grippier surfaces; the code sketch checks it), the opening must fit the jaw stroke, and the fingers must not hit neighboring items; GPD samples thousands of candidate hand poses that pass simple geometric checks and classifies them with a small neural network [3].

**Learned grasping, status as of 2026.** Dex-Net 2.0 trained a Grasp Quality CNN (a neural network that predicts grasp success from a depth image) on 6.7 million synthetic examples and planned grasps in 0.8 s with 93% success on eight known objects chosen for awkward (adversarial) shapes [1]; Dex-Net 4.0 learned to choose between suction and parallel jaws, clearing bins of up to 25 novel objects with over 95% reliability at over 300 mean picks per hour [4]. Contact-GraspNet (2021) predicts 6-DoF parallel-jaw grasps (the hand may come from any position and tilt, not only straight down from above) directly from a depth image, trained on 17 million simulated grasps, with over 90% success in clutter [5], and AnyGrasp reports 93.3% success clearing bins of more than 300 unseen objects at over 900 mean picks per hour [6]. The Dex-Net GQ-CNN code was last updated in 2024 [7], while the AnyGrasp SDK was still being updated in 2026 [8]. These results come mostly from household and warehouse-style objects; soft, damp food would need its own testing.

### On the cheese plate line
A wedge lying flat presents a flat triangular top face, so in this area's version the cheese station uses suction (a judgment call; [[rigid-gripper]] describes a V-notched parallel gripper instead): the planner fits a plane to the points under a 20 mm cup at each candidate spot, rejects spots near the rind and the thin tip where the surface curves or flexes, and favors the face's centroid, which for a triangle sits one third of the way from the wide back edge toward the tip. The grape station is the opposite case: suction on a grape lifts one berry or bruises it, so a finger gripper takes an antipodal grasp across the main stem, and the planner looks for a stem segment visible on both sides and clear of berries for the jaw width. Cracker packs are flat and light, but the wrapper film can wrinkle and leak, so the cracker planner prefers the pack's center over its crimped ends.

### Elsewhere
In e-commerce order picking, Dex-Net 4.0 showed why a station may carry two tools: a learned policy chose, object by object, between a suction cup and parallel jaws, and the combination cleared bins of novel objects with over 95% reliability [4]. Grasp networks like AnyGrasp go further and re-detect grasps continuously, which the authors used to catch moving objects [6].

### Why it exists
Perfect perception and perfect motion still drop an item if the gripper touches it in the wrong place. Choosing the contact is a separate decision with its own physics (sealing, friction, balance), so it gets its own planner and its own score.

### Connects to
- [[perception]] — supplies the pose, mask, and point cloud that grasps are planned on
- [[vacuum-gripper]] — suction grasps depend on cup size, seal, and vacuum flow
- [[rigid-gripper]] — antipodal grasps depend on jaw stroke and finger shape
- [[moveit]] — reachability and collision filtering of grasp candidates use the planning stack
- [[learned-policy]] — learned grasp networks are an early, narrow case of learned manipulation

### Real products and tools
- **Dex-Net and GQ-CNN** — Berkeley AUTOLAB grasp datasets and grasp quality networks for parallel jaws and suction [4][7]
- **GPD (Grasp Pose Detection)** — open-source antipodal grasp detector for point clouds [3]
- **Contact-GraspNet** — 6-DoF parallel-jaw grasp network for cluttered scenes [5]
- **AnyGrasp SDK** — grasp perception SDK from the AnyGrasp authors [6][8]
- **Ambi Robotics** — sells AI-powered parcel sorting (AmbiSort) and stacking (AmbiStack) systems as of 2026 [9]

### Common misconception
**Misconception:** The highest-scoring grasp is the one to execute.

**Reality:** A quality score rates the contact, not the whole pick. A top-scoring grasp may be unreachable, collide on approach, or leave the item turned the wrong way for its tray slot, so planners rank candidates and walk down the list until one passes reachability, collision, and placement checks. A failed attempt can then fall back to the next candidate without taking a new image.

### Key numbers
- Dex-Net 2.0: 0.8 s planning time, 93% success on eight known objects with adversarial shapes [1]
- Dex-Net 3.0 suction: 98%, 82%, and 58% success on basic, typical, and adversarial novel objects [2]
- Dex-Net 4.0: over 95% reliability and over 300 mean picks per hour, bins of up to 25 novel objects [4]
- AnyGrasp: 93.3% success and over 900 mean picks per hour on 300+ unseen objects [6]
- Contact-GraspNet: over 90% success on unseen objects in structured clutter [5]
- These depend on object set, gripper, and test protocol, so they are not directly comparable with each other

### Code sketch
```python
import numpy as np

CUP_R = 0.010                                    # 20 mm suction cup

def suction_candidates(points, normals, centroid, neighbors, n=200):
    """points, normals: Nx3 arrays for ONE segmented object, robot base frame, meters."""
    rng = np.random.default_rng(0)
    scored = []
    for i in rng.choice(len(points), size=min(n, len(points)), replace=False):
        p, nrm = points[i], normals[i]
        disk = points[np.linalg.norm(points - p, axis=1) < CUP_R]
        if len(disk) < 30:
            continue                             # not enough surface under the cup to seal
        flat_rms = np.sqrt(np.mean(((disk - p) @ nrm) ** 2))   # how far points sit off the plane
        seal = np.exp(-flat_rms / 0.0005)        # near 1 when flatter than about 0.5 mm
        center = np.exp(-np.linalg.norm(p - centroid) / 0.015)  # prefer the balance point
        upright = max(0.0, nrm[2])               # cup comes from above
        clear = len(neighbors) == 0 or np.min(np.linalg.norm(neighbors - p, axis=1)) > 0.02
        scored.append((seal * center * upright * clear, p, -nrm))  # approach along -normal
    return sorted(scored, key=lambda c: -c[0])[:5]   # caller still checks IK and collisions

def antipodal_ok(p1, n1, p2, n2, mu=0.4):
    """Two finger contacts with outward surface normals n1, n2; mu = friction coefficient."""
    axis = (p2 - p1) / np.linalg.norm(p2 - p1)
    half_angle = np.arctan(mu)                   # friction cone half-angle
    a1 = np.arccos(np.clip(np.dot(-n1, axis), -1.0, 1.0))   # finger 1 pushes along +axis
    a2 = np.arccos(np.clip(np.dot(-n2, -axis), -1.0, 1.0))  # finger 2 pushes along -axis
    return a1 < half_angle and a2 < half_angle   # both squeezes stay inside their cones
```

### Sources
1. [Dex-Net 2.0 (arXiv 1703.09312)](https://arxiv.org/abs/1703.09312) — Mahler et al.; GQ-CNN trained on 6.7 million synthetic examples, 0.8 s planning, 93% success
2. [Dex-Net 3.0 (arXiv 1709.06670)](https://arxiv.org/abs/1709.06670) — Mahler et al.; compliant suction contact model, 2.8 million point clouds, success by object class
3. [Grasp Pose Detection in Point Clouds](https://ar5iv.labs.arxiv.org/html/1706.09911) — ten Pas, Gualtieri, Saenko, Platt; antipodal and force-closure definitions, candidate sampling, CNN classification
4. [Dex-Net project page](https://berkeleyautomation.github.io/dex-net/) — Berkeley AUTOLAB; versions 1.0 to 4.0 and Dex-Net 4.0 results
5. [Contact-GraspNet: Efficient 6-DoF Grasp Generation in Cluttered Scenes](https://arxiv.org/abs/2103.14127) — Sundermeyer, Mousavian, Triebel, Fox, ICRA 2021
6. [AnyGrasp: Robust and Efficient Grasp Perception in Spatial and Temporal Domains](https://arxiv.org/abs/2212.08333) — Fang et al.; 93.3% success, over 900 mean picks per hour
7. [gqcnn repository](https://github.com/BerkeleyAutomation/gqcnn) — GitHub; GQ-CNN code, last pushed April 2024
8. [anygrasp_sdk repository](https://github.com/graspnet/anygrasp_sdk) — GitHub; SDK repository, last pushed July 2026
9. [Ambi Robotics](https://www.ambirobotics.com/) — company site; AmbiSort and AmbiStack products

## ROS 2
id: ros2
requires: none
aka: Robot Operating System 2, rclcpp, rclpy, DDS, tf2

### Plain
ROS 2 is free software plumbing that lets the many programs on a robot (camera reader, object finder, arm planner, gripper driver) talk to each other in a standard way. It works like a building's walkie-talkie channels plus desk phones: anyone can speak on a named channel and everyone tuned to it hears it live, while a phone call goes to one desk and waits for an answer. Because the plumbing is standard, teams can reuse programs written by others instead of writing everything themselves.

### Where the analogy breaks
On a walkie-talkie channel everyone hears the same thing the same way; in ROS 2 each sender and receiver sets its own delivery rules (retry until received or drop late messages, keep the last message for someone who tunes in late), and if the two sides' rules do not match, nothing gets through at all and only a warning in the log says why. ROS 2 is also not an operating system and does not by itself guarantee timing; the hard-timed motor control usually runs somewhere else.

### Precise
**The graph.** A ROS 2 system is a set of **nodes** (each one a program, or part of one, that does a single job) exchanging typed messages defined in .msg, .srv, and .action files [1]. **Topics** carry continuous streams by publish/subscribe (senders post to a named topic without knowing who is listening): one-way, asynchronous (the sender does not wait for anyone to receive), any number of publishers and subscribers [1]. **Services** are request/response calls for short tasks [1]. **Actions** are for long tasks: the client sends a goal, gets feedback while it runs, and can cancel it [2], which is how a sequencer asks an arm to execute a trajectory. **Parameters** are per-node configuration values set from launch files, YAML files, or the command line, at startup or while running [3], and a **launch** file starts a whole station's nodes with their parameters in one command. **tf2** keeps a time-buffered tree of coordinate frames (world, robot base, tool, camera) and answers "where was frame A relative to frame B at time t" for any node on any computer [5]; a pose found in an image must be transformed with the camera-to-base transform at the instant the image was taken (see [[frames]]).

**Middleware and QoS.** Under the client libraries (rclcpp for C++, rclpy for Python), data moves through a swappable **RMW** layer (ROS middleware: the plug-in that actually sends bytes over the network and finds other nodes automatically). The default is eProsima Fast DDS (DDS, Data Distribution Service, is an industrial publish/subscribe standard); Cyclone DDS and RTI Connext are also Tier 1 (the support level that is tested frequently and whose bugs are fixed first), and Kilted added Zenoh [7]. Each publisher and subscriber carries a **QoS profile** (quality of service: its delivery rules) covering history depth, reliability (best effort may drop messages, reliable retries), durability (whether a late-joining subscriber gets the last message), deadline, lifespan, and liveliness [4]. The default is keep the last 10 messages, reliable, volatile (nothing is kept for late joiners), and even "reliable" is implemented over UDP (a basic network protocol that makes no delivery promise of its own, so the middleware adds the retries) [4]. Incompatible profiles prevent delivery [4]: a camera publishing best effort and a subscriber demanding reliable is a classic failure in which no images arrive and the only sign is an incompatible-QoS warning in the log [4][12].

**Real-time limits.** ROS 2 was designed with real-time use in mind, but meeting hard deadlines needs a real-time kernel (an operating system core that lets an urgent task interrupt everything else within a bounded time: Linux with PREEMPT_RT or Xenomai) and loop code that avoids page faults (stalls while the operating system fetches or sets up memory the program touches), dynamic memory allocation, and blocking locks [6]; a Python node on a stock kernel is not real-time. In industrial cells the vendor [[robot-controller]] therefore usually closes the servo loops, and ROS 2 sends it goals or streams setpoints through a driver. ros2_control is the standard framework for such drivers: a controller manager runs a read, update, write loop against hardware plug-ins [9]. FANUC's official open-source ROS 2 driver is a ros2_control driver whose main branch targets Jazzy and documents a 1 kHz mode [10][11].

**Distributions as of November 2026.** Humble (LTS, long-term support; end of life May 2027), Jazzy (LTS, May 2029), Kilted Kaiju (non-LTS, December 2026 in the ROS 2 documentation's distribution table; the older REP 2000 plan said November 2026) [7][13], and Lyrical Luth (LTS, released 22 May 2026, supported to May 2031, Tier 1 on Ubuntu 26.04 and Windows 11) [8]. Production cells pick an LTS release and stay on it for years.

### On the cheese plate line
On the cheese station's cell PC, a camera driver node publishes /cheese_cam/image_raw with the sensor-data QoS profile, a detector node subscribes and publishes each wedge's pose in base_link, a grasp node offers a plan_suction service, and the behavior tree executor sends trajectories to the robot driver as a FollowJointTrajectory action and waits for the result. tf2 holds the camera-to-base transform from [[hand-eye-calibration]] as a static transform, so the detector converts poses without hard-coding the calibration. The PLC handshake comes in through a bridge node that maps fieldbus bits onto topics, while the e-stop and guard circuits never pass through ROS at all.

### Elsewhere
A mobile delivery robot in a hospital or warehouse uses the same pieces at a larger scale: lidar and camera drivers publish topics, tf2 tracks where the robot base is in the map frame [5], and the mission logic sends "go to waypoint" as an action that reports progress and can be cancelled or replaced [2]. On the factory side, FANUC now documents an official ros2_control path for commanding its arms from ROS 2 [10].

### Why it exists
Without a shared framework, each team writes its own messaging, driver interfaces, and transform code, and none of it works with anyone else's. ROS 2 standardizes those pieces so a camera driver, a planner, and an arm driver from three different authors connect by configuration, and it adds what ROS 1 lacked: QoS control over delivery [4] and a design that considered real-time use from the start [6].

### Connects to
- [[moveit]] — the motion planning framework built on ROS 2
- [[frames]] — tf2 is ROS 2's implementation of frame bookkeeping
- [[state-machines]] — tree and state-machine nodes call ROS 2 actions and services
- [[telemetry-logs]] — recorded ROS 2 topics are a common raw format for replay and debugging
- [[robot-controller]] — ROS 2 drivers sit between the PC and the vendor controller

### Real products and tools
- **ROS 2 Lyrical Luth and Jazzy Jalisco** — the two newest LTS distributions as of November 2026; the older Humble Hawksbill LTS is supported until May 2027 [7][8]
- **Fast DDS, Cyclone DDS, RTI Connext, Zenoh** — Tier 1 middleware implementations [7]
- **tf2** — time-buffered coordinate frame library [5]
- **ros2_control** — hardware abstraction and controller manager for control loops [9]
- **FANUC ROS 2 driver** — official open-source (Apache-2.0) ros2_control driver for FANUC controllers [10][11]

### Common misconception
**Misconception:** ROS 2 is a real-time robot operating system, so any ROS 2 node can safely run the arm's control loop.

**Reality:** ROS 2 runs on an ordinary operating system and is real-time capable only with a real-time kernel and loop code written to avoid allocation, page faults, and blocking [6]. The usual split leaves servo loops and safety functions in the vendor controller and gives ROS 2 perception, planning, and orchestration, which is why drivers such as FANUC's connect to the controller instead of replacing it [10].

### Key numbers
- Default publisher and subscriber QoS: keep last 10 messages, reliable, volatile [4]
- Support windows: 5 years for an LTS (Lyrical Luth, May 2026 to May 2031) and about 1.5 years for a non-LTS (Kilted Kaiju, May 2025 to December 2026) [8][13]
- FANUC ROS 2 driver: a documented 1 kHz (1 ms) control mode [10]

### Code sketch
```python
import rclpy
from rclpy.node import Node
from rclpy.duration import Duration
from rclpy.qos import qos_profile_sensor_data
from sensor_msgs.msg import Image
from geometry_msgs.msg import PoseStamped
from tf2_ros import Buffer, TransformListener
import tf2_geometry_msgs  # noqa: F401  registers PoseStamped with tf2's transform()

class WedgeDetector(Node):
    def __init__(self):
        super().__init__("wedge_detector")
        self.declare_parameter("min_confidence", 0.8)      # set from the launch file or YAML
        self.tf_buffer = Buffer()
        self.tf_listener = TransformListener(self.tf_buffer, self)
        # The camera publishes best effort; a "reliable" subscription here would receive nothing.
        self.create_subscription(Image, "/cheese_cam/image_raw", self.on_image,
                                 qos_profile_sensor_data)
        self.pub = self.create_publisher(PoseStamped, "/cheese/pick_target", 10)

    def on_image(self, img):
        det = detect_wedge(img)                 # perception: pose in the camera frame + score
        if det is None or det.score < self.get_parameter("min_confidence").value:
            return
        pose_cam = PoseStamped()
        pose_cam.header = img.header            # camera frame name + capture time
        pose_cam.pose = det.pose
        # Where was the camera relative to the robot base AT capture time?
        pose_base = self.tf_buffer.transform(pose_cam, "base_link",
                                             timeout=Duration(seconds=0.05))
        self.pub.publish(pose_base)

def main():
    rclpy.init()
    rclpy.spin(WedgeDetector())
```

### Sources
1. [Interfaces (topics, services, actions)](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/Interfaces-Topics-Services-Actions.rst) — ROS 2 documentation source; nodes, topics, services, actions, interface files
2. [Actions](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/About-Actions.rst) — ROS 2 documentation source; goals, feedback, cancel, waypoint example
3. [Parameters](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/About-Parameters.rst) — ROS 2 documentation source; per-node configuration values
4. [Quality of Service settings](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/topics/About-Quality-of-Service-Settings.rst) — ROS 2 documentation source; QoS policies, defaults, compatibility, comparison with ROS 1
5. [Tf2](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/Working-with-interfaces/About-Tf2/About-Tf2.rst) — ROS 2 documentation source; time-buffered frame tree
6. [Understanding real-time programming](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/Capabilities/Motion-planning/Real-Time-Programming.rst) — ROS 2 documentation source; real-time requirements, PREEMPT_RT and Xenomai
7. [REP 2000: ROS 2 Releases and Target Platforms](https://reps.openrobotics.org/rep-2000/) — Open Robotics; distribution dates, LTS status, Tier 1 middleware
8. [ROS 2 Lyrical Luth Released](https://discourse.openrobotics.org/t/ros-2-lyrical-luth-released/55021) — Open Robotics Discourse, 22 May 2026; LTS to May 2031, platforms
9. [ros2_control getting started](https://control.ros.org/rolling/doc/getting_started/getting_started.html) — ros2_control documentation; controller manager, resource manager, read-update-write loop
10. [FANUC ROS 2 Driver Documentation](https://fanuc-corporation.github.io/fanuc_driver_doc/main/index.html) — FANUC; ros2_control driver, Jazzy main branch, 1 kHz mode guide
11. [fanuc_driver repository](https://github.com/FANUC-CORPORATION/fanuc_driver) — FANUC America and FANUC CORPORATION on GitHub; Apache-2.0 license, main branch targets Jazzy
12. [event_handler.py](https://raw.githubusercontent.com/ros2/rclpy/rolling/rclpy/rclpy/event_handler.py) — rclpy source; default callback logs a warning when a publisher offers incompatible QoS
13. [ROS 2 distributions (Releases.rst)](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/Releases.rst) — ROS 2 documentation source; release and end-of-life dates per distribution: Lyrical Luth May 2031, Kilted Kaiju December 2026, Jazzy May 2029, Humble May 2027

## MoveIt
id: moveit
requires: ros2, motion-planning, collision-checking
aka: MoveIt 2, move_group, MoveItPy, MoveIt Servo

### Plain
MoveIt is free software that works out how a robot arm should move from where it is to where it needs to be without hitting anything, then hands that motion to the arm. It is like a satnav for the arm: you give it a destination, it knows the map of obstacles, and it returns a route with speeds the arm can actually follow. It also has a live "joystick" mode for steering the arm directly.

### Where the analogy breaks
A satnav picks the best route on a flat road map and gives the same answer every time; MoveIt's default planner searches by trying random combinations of the arm's six or more joint angles, so it returns a workable path that is not guaranteed to be the shortest and can differ from one run to the next [10]. Its map also holds only what it has been told about: an obstacle missing from its planning scene does not exist for it.

### Precise
**Architecture.** MoveIt 2 is the ROS 2 version, led by PickNik, with stable branches for Humble, Jazzy, and Kilted and buildfarm binaries for Lyrical as of November 2026 [6]. Its **move_group** node combines the components and exposes them as ROS actions and services [1]. It reads the **URDF** (robot description: links, joints, shapes, limits) and the **SRDF** (semantic description: planning groups, named poses, which links may touch), the latter usually generated with the MoveIt Setup Assistant; it reads joint positions from /joint_states and transforms from tf2; and it executes plans as a client of the robot's FollowJointTrajectory action [1]. Programs call it through MoveGroupInterface in C++ or the RViz plugin [1], or through MoveItPy, a Python library built on generated bindings to MoveIt's C++ core [3][9].

**Planning pipeline.** A motion plan request names a goal (joint values, a tool pose, or constraints) and a start state. **Planning request adapters** clean it up first: they pull a start state that is slightly past a joint limit back inside, supply a default workspace, nudge a start state that is in collision, and resolve constraint frames [2]. A **planner plugin** then searches: OMPL (the default: a library of sampling-based planners, which try random arm configurations and link collision-free ones into a path, so the same request can return different paths, none guaranteed shortest, and the result is shortened and smoothed afterward) [10], the Pilz industrial motion planner (PTP, LIN, and CIRC: point-to-point, straight-line, and circular moves with trapezoidal velocity profiles, the standard motion types of industrial robot programs) [8], or CHOMP (trajectory optimization: it starts from a rough path and repeatedly bends it away from obstacles and toward smoothness) [2]. A response adapter, AddTimeParameterization, turns the geometric path into a timed trajectory that respects velocity and acceleration limits [2]. Collision checking, including self-collision and attached objects, is on by default [2]. Background: [[motion-planning]], [[trajectory-generation]], [[inverse-kinematics]].

**Planning scene.** The planning scene is MoveIt's world model: the robot's current state, static collision objects (conveyor, guards, camera mast), and objects **attached** to the robot, such as a part held in the gripper; the Planning Scene Monitor keeps it current [1]. If a held part is not attached, MoveIt plans as if the gripper were empty and can drag the part through an obstacle.

**MoveIt Servo** streams motion instead of planning it: it accepts joint jog, end-effector velocity (twist), or pose commands and continuously outputs joint position or velocity commands, slowing the arm near singularities (arm configurations where some directions of motion become impossible) and near collisions, enforcing joint limits, and optionally smoothing with Butterworth (a standard smoothing filter), acceleration-limited, or Ruckig filters [4]. The C++ class is Servo and the ROS wrapper is ServoNode [4]. It is the usual building block for teleoperation and visual servoing (correcting motion from live camera feedback) [4].

### On the cheese plate line
If the cheese station runs a ROS 2 stack, MoveIt's planning scene holds boxes for the infeed belt, tray conveyor, guard panels, and camera mast, and the picked wedge is attached to the tool as soon as the vacuum switch confirms the grip. The transfer between belt and tray uses OMPL, while the last 50 mm down onto the wedge and into the tray slot uses Pilz straight-line moves so the cup arrives square. Because the pick and place regions never change, the transfer between a fixed point above the belt and a fixed point above the tray can be planned once and reused, so the arm follows the same path every cycle (a fresh OMPL plan could take a different route each time) and planning time stays far inside the at most 6 s per wedge; only the short straight moves change with each wedge's position. A static cell like this one can also skip online planning entirely and run taught points in a [[vendor-languages]] program.

### Elsewhere
When a warehouse arm gets stuck on a snagged item, a remote operator can take over through MoveIt Servo, sending velocity commands from a 3D mouse or gamepad while Servo slows the arm automatically near singularities and obstacles [4]. The same Servo pipeline can be driven by a camera instead of a person, for visual servoing [4].

### Why it exists
Planning collision-free motion for an arbitrary arm needs kinematics, collision checking, a world model, a search algorithm, and trajectory timing to work together. MoveIt packages all of them for any robot described by a URDF and SRDF, so a team writes goals instead of planners.

### Connects to
- [[motion-planning]] — MoveIt runs planners such as OMPL inside its pipeline
- [[collision-checking]] — every candidate path is checked against the planning scene
- [[inverse-kinematics]] — pose goals are converted to joint goals by kinematics plugins
- [[ros2]] — move_group is a ROS 2 node built on actions, topics, and tf2
- [[teleop-modes]] — MoveIt Servo is a common entry point for streaming teleoperation

### Real products and tools
- **MoveIt 2** — open-source manipulation framework: move_group, MoveGroupInterface, MoveItPy, Setup Assistant [1][3][6]
- **MoveIt Servo** — streaming control for teleoperation and visual servoing [4]
- **MoveIt Task Constructor** — MoveIt component for multi-step tasks, listed in the MoveIt concepts documentation [5]
- **OMPL, Pilz industrial motion planner, CHOMP** — planner plugins available by default [2]
- **MoveIt Pro** — PickNik's commercially supported platform, with behaviors built on BehaviorTree.CPP [6][7]

### Common misconception
**Misconception:** MoveIt drives the robot's motors in real time.

**Reality:** MoveIt plans and hands a finished trajectory to a controller through a FollowJointTrajectory action [1]; the vendor controller or a ros2_control loop tracks it and closes the servo loops. Even Servo only publishes joint commands for a controller that accepts positions or velocities [4]; it does not replace that controller.

### Key numbers
- Default planning workspace when a request defines none: a 10 m cube [2]
- Time per wedge at the cheese station: at most about 6 s, which planning plus motion must fit inside (arithmetic on the running example)

### Code sketch
```python
from moveit.planning import MoveItPy

robot = MoveItPy(node_name="cheese_picker")
arm = robot.get_planning_component("manipulator")      # planning group from the SRDF
psm = robot.get_planning_scene_monitor()

with psm.read_write() as scene:                        # describe the static world once
    for obj in (infeed_belt_box, tray_conveyor_box, camera_mast_box):
        scene.apply_collision_object(obj)
    scene.current_state.update()

def go(pose_stamped):
    """Plan and execute to a tool pose; returns False if no plan was found.
    Uses the default (OMPL) pipeline and plans fresh on every call. The Pilz straight-line
    moves and the reused transfer described above need plan parameters that name the Pilz
    pipeline [3] and a stored trajectory; both are left out to keep the sketch short."""
    arm.set_start_state_to_current_state()
    arm.set_goal_state(pose_stamped_msg=pose_stamped, pose_link="tool0")
    plan_result = arm.plan()       # request adapters -> planner -> time parameterization
    if not plan_result:
        return False
    robot.execute(plan_result.trajectory, controllers=[])   # FollowJointTrajectory to the driver
    return True

target = wait_for_pick_target()    # PoseStamped in base_link from the perception node
above = offset_z(target, 0.05)     # 50 mm above the wedge
if go(above) and go(target):
    vacuum_on()
    attach_wedge_to_tool(psm)      # the held wedge is now part of the robot's collision model
    go(above)
    go(tray_slot_pose(slot=1))
```

### Sources
1. [The move_group node](https://moveit.picknik.ai/main/doc/concepts/move_group.html) — MoveIt documentation; URDF and SRDF inputs, joint states, TF, FollowJointTrajectory, Planning Scene Monitor
2. [Motion Planning](https://moveit.picknik.ai/main/doc/concepts/motion_planning.html) — MoveIt documentation; planner plugins, request adapters, AddTimeParameterization, default workspace
3. [Motion Planning Python API](https://moveit.picknik.ai/main/doc/examples/motion_planning_python_api/motion_planning_python_api_tutorial.html) — MoveIt tutorial; MoveItPy calls used in the sketch
4. [Realtime Arm Servoing](https://moveit.picknik.ai/main/doc/examples/realtime_servo/realtime_servo_tutorial.html) — MoveIt tutorial; Servo inputs, outputs, safety scaling, filters, Servo and ServoNode
5. [Concepts](https://moveit.picknik.ai/main/doc/concepts/concepts.html) — MoveIt documentation index; lists move_group, Planning Scene Monitor, Task Constructor
6. [moveit2 repository](https://github.com/moveit/moveit2) — GitHub; PickNik-led development, branch policy, MoveIt Pro mention
7. [repeat_unless_failure_within_tick.hpp](https://docs.picknik.ai/api/files/behavior/include/moveit-pro-behavior/behaviors/core/repeat-unless-failure-within-tick-hpp/) — MoveIt Pro API docs; behaviors built on BehaviorTree.CPP
8. [Pilz Industrial Motion Planner](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) — MoveIt how-to guide; PTP, LIN, and CIRC commands with trapezoidal velocity profiles
9. [moveit_py](https://github.com/moveit/moveit2/tree/main/moveit_py) — moveit2 repository README; Python library for MoveIt 2's core functions, built on pybind11 bindings
10. [OMPL Planner](https://moveit.picknik.ai/main/doc/examples/ompl_interface/ompl_interface_tutorial.html) — MoveIt tutorial; OMPL algorithms are probabilistic, with no guarantee of the same or a globally optimal solution each time, and paths are smoothed and shortened afterward

## OpenCV and point cloud libraries
id: opencv
requires: perception
aka: OpenCV, PCL, Point Cloud Library, Open3D, point cloud processing

### Plain
OpenCV and the point cloud libraries are free toolboxes of ready-made routines for working with pictures and 3D shapes, and most robot vision programs are assembled from them. They are like a well-stocked workshop wall: saws, drills, and clamps for images, so nobody has to forge their own hammer before building a shelf. OpenCV works mostly on flat camera images, while PCL and Open3D work on clouds of 3D dots from depth cameras.

### Where the analogy breaks
A drill behaves the same every time; vision routines have settings (cutoffs, sizes, tolerances) whose right values depend on lighting, camera, and product, so the same code can work at noon and fail after a lamp is replaced. Some routines are also random by design and give slightly different answers on each run.

### Precise
**OpenCV** (Open Source Computer Vision Library) is a C++ library with Python bindings. It covers image input and output, color conversion, filtering, thresholding, morphology (growing or shrinking shapes to remove specks), contours and connected components (blob analysis), template matching [1], and camera geometry such as solvePnP (computing an object's pose from known 3D points and where they appear in the image) [2]. It also has a deep neural network module for running trained models [3]. As of November 2026 the newest release is 5.1.0 [4]; the 5.x line reorganizes modules and adds a point cloud processing module with outlier removal, normal orientation (flipping surface directions so they all face the same way, for example toward the camera), and bounding boxes [5].

**Point Cloud Library (PCL)** is a BSD-licensed (a permissive open-source license that allows commercial use) C++ library with modules for filters, features, keypoints, registration (aligning two clouds), kd-trees and octrees (indexes for fast neighbor search), segmentation, sample consensus (RANSAC-style fitting, described below), surfaces, and recognition [6]; its latest release is 1.15.1, from August 2025 [7]. **Open3D** offers similar operations in C++ and Python with less code per step: voxel downsampling, normal estimation, plane segmentation, DBSCAN clustering, and oriented bounding boxes [8]; version 0.20.0 came out in September 2026 [9].

**The standard 3D steps.** **Voxel downsampling** divides space into small cubes and replaces the points in each cube with one average point, to cut the point count. **Normal estimation** finds the direction perpendicular to the surface at each point, which suction planning needs. **Plane segmentation** uses **RANSAC** (repeatedly fit a plane through three random points and keep the plane the most points lie near); Open3D's tutorial uses a 1 cm threshold, 3 points per sample, and 1000 iterations [8]. **Clustering** with DBSCAN groups points that have enough neighbors within a set distance, and a box or principal axes fitted to each cluster gives its pose. Because RANSAC samples at random, two runs on the same cloud can return slightly different planes, so robust code runs enough iterations that missing the true plane becomes unlikely, and checks how many points agreed with the winning plane before trusting it; a fixed iteration count bounds the time, but it does not make the answer repeatable.

**What they do and do not give you.** Without these libraries every team would reimplement and debug the same primitives. None of them decides what to pick, guarantees timing, or is built for safety functions; that is the job of the pipeline and the system around it.

### On the cheese plate line
The cheese station's 2D pipeline (threshold, connected components, minimum-area rectangle, pixel-to-plane mapping) is about a dozen OpenCV calls; the sketch is in [[perception]]. A depth camera adds a stacking check with Open3D: crop the cloud to the belt region, remove the belt plane with RANSAC at a 3 mm threshold, cluster with DBSCAN, and reject any cluster taller than one wedge, because two stacked wedges look like one from above. The settings here (2 mm voxels, 3 mm plane threshold, 8 mm cluster distance, 35 mm height limit) are illustrative starting points for wedges of a few centimeters, not published figures, and get re-tuned on the real line.

### Elsewhere
A depalletizing cell can find the top layer of boxes on a pallet with the same building blocks: downsample the cloud, segment the highest large horizontal plane, cluster it into individual box tops, and fit an oriented bounding box to each to get the pick pose and box size [8]. Shiny shrink-wrap and dark boxes leave holes in depth data, so the cluster settings must tolerate missing points.

### Why it exists
Image and point cloud primitives are hard to implement correctly and fast, and almost every vision application needs the same ones. Shared, well-tested libraries let teams spend their time on the pipeline and its tuning instead of on reimplementing filters.

### Connects to
- [[perception]] — these libraries are the parts list for classical perception pipelines
- [[camera-calibration]] — OpenCV's camera geometry functions estimate lens and camera parameters
- [[depth-camera]] — the source of the point clouds PCL and Open3D process
- [[grasp-planning]] — normals and plane fits from these libraries feed suction scoring
- [[visualization-tools]] — point clouds and overlays are checked visually during tuning

### Real products and tools
- **OpenCV 5.1** — open-source computer vision library with image processing, calibration, a dnn module, and in 5.x a point cloud module [3][4][5]
- **PCL 1.15** — Point Cloud Library, BSD-licensed C++ point cloud processing [6][7]
- **Open3D 0.20** — C++ and Python 3D data library [8][9]

### Common misconception
**Misconception:** OpenCV is an AI system that recognizes objects out of the box.

**Reality:** OpenCV is mostly a library of building blocks such as filters, matching, and camera geometry [1][2]. It can run trained neural networks through its dnn module [3], but the recognition comes from the model and the pipeline you build and tune, not from the library.

### Key numbers
- Open3D tutorial plane segmentation settings: 1 cm distance threshold, 3 points per sample, 1000 iterations; the right values scale with sensor noise and object size [8]
- Release status as of November 2026: OpenCV 5.1.0, PCL 1.15.1, Open3D 0.20.0 [4][7][9]

### Code sketch
```python
import numpy as np
import open3d as o3d

def wedge_clusters(pcd, belt_box, wedge_max_h=0.035):
    """pcd: point cloud already transformed into the robot base frame (meters)."""
    roi = pcd.crop(belt_box)                       # keep only the infeed belt region
    roi = roi.voxel_down_sample(voxel_size=0.002)  # one point per 2 mm cube
    # RANSAC: fit the belt plane; points within 3 mm of it count as belt
    plane, belt_idx = roi.segment_plane(distance_threshold=0.003,
                                        ransac_n=3, num_iterations=500)
    objects = roi.select_by_index(belt_idx, invert=True)
    labels = np.array(objects.cluster_dbscan(eps=0.008, min_points=30))
    normal, d = np.array(plane[:3]), plane[3]      # plane: normal . p + d = 0
    results = []
    for k in range(labels.max() + 1):              # label -1 means noise
        cluster = objects.select_by_index(np.where(labels == k)[0])
        pts = np.asarray(cluster.points)
        height = np.max(np.abs(pts @ normal + d)) / np.linalg.norm(normal)  # above the belt
        box = cluster.get_oriented_bounding_box()
        results.append({
            "center": box.center,                  # x, y, z in the base frame
            "R": box.R,                            # 3x3 orientation of the box axes
            "stacked": height > wedge_max_h,       # taller than one wedge: reject
        })
    return results
```

### Sources
1. [Template Matching tutorial (source)](https://raw.githubusercontent.com/opencv/opencv/4.x/doc/py_tutorials/py_imgproc/py_template_matching/py_template_matching.markdown) — OpenCV project; matchTemplate and minMaxLoc
2. [calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) — OpenCV source; solvePnP finds an object pose from 3D-2D correspondences
3. [dnn.hpp (5.x)](https://raw.githubusercontent.com/opencv/opencv/5.x/modules/dnn/include/opencv2/dnn.hpp) — OpenCV source; Deep Neural Network module
4. [OpenCV 5.1.0 release](https://github.com/opencv/opencv/releases/tag/5.1.0) — GitHub; release published November 2026
5. [ptcloud.hpp (5.x)](https://raw.githubusercontent.com/opencv/opencv/5.x/modules/ptcloud/include/opencv2/ptcloud.hpp) — OpenCV source; Point Cloud Processing module functions
6. [Point Cloud Library](https://pointclouds.org/) — PCL project site; BSD license and module list
7. [PCL 1.15.1 release](https://github.com/PointCloudLibrary/pcl/releases/tag/pcl-1.15.1) — GitHub; release published August 2025
8. [Point cloud tutorial](https://www.open3d.org/docs/release/tutorial/geometry/pointcloud.html) — Open3D documentation; voxel_down_sample, estimate_normals, segment_plane, cluster_dbscan, bounding boxes
9. [Open3D v0.20.0 release](https://github.com/isl-org/Open3D/releases/tag/v0.20.0) — GitHub; release published September 2026

## Vendor robot languages
id: vendor-languages
requires: robot-controller, frames
aka: FANUC TP, KAREL, ABB RAPID, KUKA KRL, Yaskawa INFORM, URScript, Epson SPEL+, teach pendant programming

### Plain
Each big robot maker ships its own programming language that runs only inside its own robot controller, the cabinet that drives the arm. It is like games for rival video game consoles: they all have the same basic moves (go here, go there, grab), but a game made for one console will not run on another until someone rewrites it, and the same goes for a robot program moved to another brand. Many factory robot programs are written this way, often by jogging the arm to each spot with a handheld pendant and pressing "record".

### Where the analogy breaks
A console game is a sealed, self-contained product; a robot program is edited on the factory floor by technicians and is only one part of the cell, trading signals with the PLC, taking pick positions from a vision PC, and handling timing and error recovery. And because its positions are usually recorded by moving the real arm, a program also belongs to one physical cell, not just to one brand.

### Precise
**What they are.** A vendor language runs on the vendor's [[robot-controller]], which owns the real-time work (kinematics, path interpolation, servo loops) and offers high-level motion instructions. Nearly all of them have a **joint move** (every joint travels at once: fastest, but the tool's path is curved and hard to predict), a **linear move** (the tool center point, the gripper's working spot such as the middle of a suction cup, travels in a straight line), and usually a circular move, each with a speed and a **blend** or **zone** setting (how close to pass a point before rounding the corner instead of stopping on it). Positions are stored relative to a **tool frame** (a coordinate system attached at the tool center point) and a **user frame** or work object (a coordinate system fixed to the fixture or conveyor), see [[frames]]. Points are taught by jogging the arm with the **teach pendant** (the handheld programming tablet) and recording them, or computed offline in the vendor's simulator.

**The main languages, as of 2026.** **FANUC** has two: **TP** (teach pendant language: numbered lines edited on the pendant, such as the joint move to a position register (a numbered memory slot on the controller that holds one position) in the sketch, taken from the ROS-Industrial FANUC driver) [1] and **KAREL** (a Pascal-like language for logic and communication; the same driver uses KAREL loops that read joint angles with CURJPOS) [2]. **ABB RAPID** is a structured language of modules and procedures whose move instructions take a target, a speed, a zone, and a tool, as in the MoveAbsJ line in the sketch [3]. **KUKA KRL** writes moves such as PTP with axis angles; the ROS-Industrial KUKA example moves home with PTP and then hands motion corrections to KUKA's RSI real-time sensor interface [4]. **Yaskawa INFORM** stores jobs as .JBI files with instructions such as DOUT, WAIT, and TIMER for signals [5], plus MOVJ and MOVL for motion [8]. **URScript** (Universal Robots) is Python-like, with movej, movel, and servoj, which streams a joint target every control step [6]. **Epson SPEL+** is BASIC-like [9], with Go (point to point), Move (straight line), and Jump (an up-over-down arch motion that Epson calls ideal for pick and place, available on its SCARA robots) [10][11].

**How they meet the rest of the cell.** The PLC selects programs and exchanges handshake bits with the robot over an [[industrial-network]], and a vision PC writes pick offsets into registers or sends them over a socket (a direct network connection between two programs). Even ROS drivers run a small vendor-language program on the controller: the ROS-Industrial FANUC TP program waits on flags and moves to a position register the PC fills [1], the ABB RAPID module loops waiting for a new trajectory [3], and UR's client library runs a URScript program that streams servoj commands [6]. FANUC documents its official ROS 2 driver alongside its ROBOGUIDE simulator [7]. What breaks without vendor languages: on most controllers nothing else has direct access to the motion and I/O, so even new software stacks usually end in a small program written in one of them.

### On the cheese plate line
In a vendor-language version of the cheese station, the robot program is a short loop: wait for the PLC's tray-ready input, read the wedge offset that the vision PC wrote into position registers, joint-move with blending to a point 50 mm above it, linear-move down and stop exactly (FINE on FANUC, fine on ABB), switch the vacuum output on, wait for the vacuum switch input with a timeout, then place into the next of the three tray slots and finally set the done output. Blending the transfer moves and stopping exactly only at pick and place is where much of the at most 6 s per wedge is won or lost. The program never sees the camera; perception and grasp planning stay on the PC, and the robot program only consumes their numbers.

### Elsewhere
In a car body shop, a spot-welding robot's program is mostly a long list of taught positions with weld commands between them, one program per car model, and the line PLC sends the model number so the robot runs the right one. Because those points are taught on the real fixture, a new car model means re-teaching them or generating them offline in the vendor's simulator [unverified: general industry practice, no source found].

### Why it exists
Each controller's motion engine and I/O are proprietary, and the language is the maker's interface to them, designed so technicians can teach and edit programs on the pendant without a PC. The large installed base of programs and trained technicians keeps these languages in daily use.

### Connects to
- [[robot-controller]] — the vendor language runs inside it
- [[plc-programming]] — the PLC selects robot programs and exchanges handshake signals
- [[ros2]] — ROS drivers run a small vendor program that receives targets from the PC
- [[frames]] — every taught point is relative to a tool frame and a user frame
- [[cell-design]] — offline programming in vendor simulators happens during cell design

### Real products and tools
- **FANUC TP, KAREL, and ROBOGUIDE** — FANUC's languages and simulator; FANUC also publishes an official ROS 2 driver [1][2][7]
- **ABB RAPID** — ABB's structured robot language [3]; ABB agreed in October 2025 to sell its robotics division to SoftBank Group for USD 5.375 billion [12], but as of early November 2026 the deal had not closed and China had prohibited the purchase of the business's China operations [13]
- **KUKA KRL and RSI** — KUKA's language and its real-time sensor interface, used by the ROS-Industrial driver [4]
- **Yaskawa INFORM** — Motoman job language in .JBI files [5]
- **URScript and the UR Client Library** — Universal Robots' script language and the open-source library that streams it [6]

### Common misconception
**Misconception:** Vendor languages are legacy; modern robots are programmed in Python and ROS.

**Reality:** The vendor controller still owns real-time motion and I/O, so ROS and Python stacks reach the arm through a program running on the controller: the ROS-Industrial drivers for FANUC, ABB, and Yaskawa and UR's client library all work this way [1][3][5][6]. What changed is where decisions are made, not the layer that finally moves the arm.

### Key numbers
- FANUC official ROS 2 driver: a documented 1 kHz control mode [7]
- ABB ROS-Industrial RAPID motion loop: waits 0.05 s between checks for a new trajectory [3]

### Code sketch
```text
The same "go above the wedge, go down, vacuum on" idea in six languages.
Lines marked REAL are copied from open-source driver files [1]-[6] in Sources;
lines marked (illustrative) follow each language's style but were not checked
against vendor manuals [unverified].

! ---- FANUC TP (REAL line from ROS-Industrial ros_movesm.ls) ----
  22:J PR[2:ROS-I p cache] R[1:ROS-I spd]% CNT R[2:ROS-I cnt]    ;
   1:J PR[11:ABOVE PICK] 100% CNT50 ;          ! (illustrative) joint move, blended
   2:L PR[12:PICK] 500mm/sec FINE ;            ! (illustrative) straight down, exact stop
   3:  DO[1:VACUUM]=ON ;                       ! (illustrative)

-- ---- FANUC KAREL (REAL line from ros_state.kl) ----
cur_j_pos_ = CURJPOS(0, 0)

! ---- ABB RAPID (REAL line from ROS-Industrial ROS_motion.mod) ----
MoveAbsJ target, move_speed, \T:=trajectory{current_index}.duration, stop_mode, tool0;
MoveL pPick, v200, fine, tGripper;             ! (illustrative)

; ---- KUKA KRL (REAL line from kuka_experimental ros_rsi.src) ----
PTP {A1 0, A2 -90, A3 90, A4 0, A5 90, A6 0}

' ---- Yaskawa INFORM (REAL lines from motoman_driver ROS_R1.JBI) ----
DOUT OT#(889) ON
WAIT OT#(890)=ON
TIMER T=0.05

# ---- URScript (REAL call from UR Client Library external_control.urscript) ----
movel(q)
movel(p_above, a=1.2, v=0.25)                  # (illustrative) accel m/s^2, speed m/s

' ---- Epson SPEL+ (illustrative) ----
Jump P1                                        ' arch up, across, and down onto P1
```

### Sources
1. [ros_movesm.ls](https://raw.githubusercontent.com/ros-industrial/fanuc/noetic-devel/fanuc_driver/tpe/ros_movesm.ls) — ROS-Industrial FANUC driver; TP program that waits on flags and moves to a position register
2. [ros_state.kl](https://raw.githubusercontent.com/ros-industrial/fanuc/noetic-devel/fanuc_driver/karel/ros_state.kl) — ROS-Industrial FANUC driver; KAREL program reading joint positions in a loop
3. [ROS_motion.mod](https://raw.githubusercontent.com/ros-industrial/abb_driver/melodic-devel/rapid/ROS_motion.mod) — ROS-Industrial ABB driver; RAPID motion loop with MoveAbsJ, zones, WaitTime 0.05
4. [ros_rsi.src](https://raw.githubusercontent.com/ros-industrial/kuka_experimental/melodic-devel/kuka_rsi_hw_interface/krl/KR_C4/ros_rsi.src) — ROS-Industrial KUKA experimental; KRL with PTP and RSI calls
5. [ROS_R1.JBI](https://raw.githubusercontent.com/ros-industrial/motoman/noetic-devel/motoman_driver/Inform/DX100/single_arm_with_ext_axis/ROS_R1.JBI) — ROS-Industrial Motoman driver; INFORM job with DOUT, WAIT, TIMER
6. [external_control.urscript](https://raw.githubusercontent.com/UniversalRobots/Universal_Robots_Client_Library/master/resources/external_control.urscript) — Universal Robots Client Library; URScript using movej, movel, servoj
7. [FANUC ROS 2 Driver Documentation](https://fanuc-corporation.github.io/fanuc_driver_doc/main/index.html) — FANUC; ros2_control driver, ROBOGUIDE, 1 kHz mode guide
8. [YRC1000: INFORM Language](https://knowledge.motoman.com/hc/en-us/articles/4407425435927-YRC1000-INFORM-LANGUAGE) — Yaskawa Motoman Knowledge Center; move instructions MOVJ, MOVL, MOVC, MOVS; I/O instructions DOUT, WAIT; control instruction TIMER
9. [The SPEL+ Language](https://download.epson.biz/robots/ww/data/html/UsersGuide/en/070/070-010/070-010-010.html) — Epson RC+ 8.0 User's Guide; SPEL+ described as a BASIC-like language running in the controller
10. [Summary of SPEL+ Commands](https://download.epson.biz/robots/ww/data/html/SPEL/en/020/020-010/020-010-010.html) — Epson RC+ 8.0 SPEL+ Language Reference; Go (point to point), Move (linear interpolation), Jump (gate motion)
11. [Jump Statement](https://download.epson.biz/robots/ww/data/html/SPEL/en/030/030-140/030-140-010/030-140-010-220.html) — Epson RC+ 8.0 SPEL+ Language Reference; arch motion, ideal for pick and place, SCARA only
12. [Acquisition of ABB Ltd's Robotics Business](https://group.softbank/en/news/press/20251008) — SoftBank Group press release, 8 October 2025; USD 5.375 billion, approvals needed in the EU, China, and the US
13. [Update on divestment of ABB Robotics](https://resources.news.e.abb.com/attachments/published/140154/en-US/0A15DBC92198/20261105_Update_on_divestment_of_ABB_Robotics_EN.pdf) — ABB press release, 5 November 2026; China prohibited the acquisition of the ABB Robotics business in China, deal not yet closed

## PLC programming
id: plc-programming
requires: plc, state-machines
aka: IEC 61131-3, ladder logic, structured text, sequential function chart, SFC, TwinCAT, TIA Portal, CODESYS

### Plain
A PLC is the rugged industrial computer that runs a line's conveyors, sensors, and signal lights, and PLC programming is writing the logic it repeats over and over, many times a second. It is like a tireless traffic controller who, on every pass, looks at every sensor at once, decides, and then sets every light at once. The languages were shaped so electricians and technicians, not only software engineers, can read and fix the program on the plant floor.

### Where the analogy breaks
A traffic controller can stop to think; a PLC must finish every pass quickly, because a slow pass delays every output, so the program must never sit and wait for something. And the PLC usually does not move the robot arm itself: it coordinates the robot controller, which does the motion.

### Precise
**The standard.** IEC 61131-3 (the international standard for PLC programming languages, first published in 1993 [9], fourth edition May 2025 [7]) defines three languages, **Ladder Diagram** (LD: graphical rungs of contacts, switch symbols that test a signal, and coils, symbols that set an output, drawn like the wiring diagrams of the relay panels, cabinets of electrically operated switches, that PLCs replaced), **Function Block Diagram** (FBD: boxes wired together like a signal-flow diagram), and **Structured Text** (ST: a Pascal-like text language, best for math, data, and step logic), plus **Sequential Function Chart** elements (SFC: graphical steps and transitions for sequences, which can run branches in parallel) that structure programs and are usually counted as a fourth language [7][3]. Instruction List, a text language still in the 2013 edition [8], was deprecated there [1] and is gone from the 2025 edition, whose only text language is ST [7]. Code is organized into **POUs** (program organization units): functions (no memory between calls), function blocks (with memory, such as timers and counters), and programs [1]; the third edition added object-oriented features (classes and object-oriented function blocks) [8].

**The scan.** A PLC runs a scan cycle: read all inputs into memory, execute the program, write all outputs, repeat [2]. A scan typically takes on the order of 10 ms to tens of milliseconds, depending on program size, CPU, and configured task time (Beckhoff TwinCAT's default PLC task cycle is 10 ms [11]; general references give tens of milliseconds [2]), and a PLC is treated as a hard real-time system whose outputs must follow its inputs within a bounded time [2]. Three habits follow. Never block: a loop that waits for a sensor would freeze every output, so waiting means staying in a step until a condition is true on some later scan. Detect edges: a button stays TRUE for many scans, so counting presses needs an edge-detection block that fires only on the scan where the signal changes. Write sequences as step chains: an SFC [3], or an integer step variable driving a CASE statement in ST, which is the PLC form of a [[state-machines]] FSM.

**Tools.** Siemens TIA Portal is the engineering platform whose STEP 7 tool configures, programs, and diagnoses SIMATIC controllers [4]. Beckhoff TwinCAT 3 turns a PC into a real-time controller, runs IEC 61131-3 code alongside C/C++ and MATLAB/Simulink inside Microsoft Visual Studio, and executes in its own real-time runtime [5]. PLCopen adds an XML exchange format for IEC 61131-3 projects and standard motion control function blocks for hardware-independent motion [6]. What breaks without this discipline: a PLC program that blocks, or a sequence with no timeout, stops the whole line rather than one station.

### On the cheese plate line
The cheese station's PLC program is the step chain in the sketch: run the tray conveyor until the photo-eye sees a tray, raise the stop pin, wait 200 ms for the tray to settle, set Tray Ready for the robot, and release the tray when Robot Done arrives. Because a tray arrives every 18 s at 200 plates an hour, step 30 has a 15 s timeout that diverts the tray for rework and raises an alarm on the [[hmi]] instead of stopping the line. The same PLC counts good and diverted trays for [[oee]], while e-stops and guard doors go to separate safety hardware, see [[safety-circuit]].

### Elsewhere
At an airport, PLCs run the baggage conveyors and diverters: each bag's scanned tag tells the PLC which diverter to fire as the bag passes a photo-eye, with the same never-block, step-and-timeout style as the cheese line. A bag that misses its diverter is not a reason to stop the system; the logic routes it around a recirculation loop or to a manual station, the same divert-instead-of-stop choice as the cheese station's timeout [unverified: general industry practice, no source opened].

### Why it exists
Production lines need control that runs for years, survives electrical noise and heat, behaves the same on every scan, and can be fixed in the middle of the night by an electrician with a laptop. PLCs replaced hard-wired relay panels in car plants in the late 1960s, and ladder logic was made to look like those relay diagrams so the same people could maintain it [2].

### Connects to
- [[plc]] — the hardware this code runs on
- [[state-machines]] — SFC and CASE step chains are state machines in PLC form
- [[industrial-network]] — carries the handshake bits between PLC, robot, and vision PC
- [[safety-circuit]] — safety logic runs in separate safety hardware, not in the ordinary PLC program
- [[hmi]] — operators see the PLC's alarms and step numbers on the HMI

### Real products and tools
- **Siemens TIA Portal (STEP 7)** — engineering platform for SIMATIC controllers [4]
- **Beckhoff TwinCAT 3** — PC-based control with IEC 61131-3 and C/C++ in Visual Studio [5]
- **CODESYS** — an IEC 61131-3 development system, also the core of ABB's Automation Builder, in which object-oriented programming is optional [10]
- **Rockwell Automation Studio 5000 Logix Designer** — programming software for Allen-Bradley ControlLogix and CompactLogix controllers [12]
- **PLCopen Motion Control** — standard function blocks for commanding motion from IEC 61131-3 code [6]

### Common misconception
**Misconception:** Ladder logic is obsolete and modern PLC code is all Structured Text.

**Reality:** Ladder Diagram is still one of the languages defined in the 2025 edition [7], and it stays popular partly because the PLC's fixed execution order makes timing problems easier to spot and because it reads like the relay diagrams electricians already know [2]. One project can mix languages: ST for calculations and data, LD for interlocks, SFC for sequences.

### Key numbers
- Typical scan or task cycle: about 10 ms (TwinCAT's default PLC task cycle [11]) to tens of milliseconds [2], depending on program size, CPU, and configured task time
- IEC 61131-3 editions: first in 1993 [9], third in 2013 [8], fourth in May 2025 [7]
- Tray spacing at the cheese station: 18 s (3600 s divided by 200 plates), which sets the 15 s robot timeout in the sketch (arithmetic on the running example)

### Code sketch
```text
PROGRAM CheeseStation              (* IEC 61131-3 Structured Text *)
VAR
    Step        : INT := 0;
    LineEnabled : BOOL;            (* from the HMI start button *)
    PE_Tray     : BOOL;            (* photo-eye input: tray at the station *)
    RobotDone   : BOOL;            (* from the robot controller over the fieldbus *)
    ConveyorRun, StopPinUp, TrayReady, Divert, Alarm : BOOL;
    SettleTimer : TON;             (* on-delay timer function block *)
    DoneTimer   : TON;
END_VAR

SettleTimer(IN := (Step = 20), PT := T#200MS);
DoneTimer(IN := (Step = 30), PT := T#15S);       (* must finish inside the 18 s tray spacing *)

CASE Step OF
  0:  IF LineEnabled THEN StopPinUp := TRUE; Step := 10; END_IF
  10: ConveyorRun := TRUE;                        (* bring the next tray to the stop pin *)
      IF PE_Tray THEN ConveyorRun := FALSE; Step := 20; END_IF
  20: IF SettleTimer.Q THEN TrayReady := TRUE; Step := 30; END_IF
  30: IF RobotDone THEN
          TrayReady := FALSE; Step := 40;
      ELSIF DoneTimer.Q THEN                      (* robot too slow: divert, do not stop *)
          TrayReady := FALSE; Divert := TRUE; Alarm := TRUE; Step := 40;
      END_IF
  40: StopPinUp := FALSE; ConveyorRun := TRUE;    (* release the tray downstream *)
      IF NOT PE_Tray THEN Divert := FALSE; StopPinUp := TRUE; Step := 10; END_IF
END_CASE
(* No loop ever waits: each scan runs this once, top to bottom, then writes outputs. *)
```

### Sources
1. [IEC 61131-3](https://en.wikipedia.org/wiki/IEC_61131-3) — Wikipedia (secondary); Instruction List deprecated in the 2013 edition, POU types
2. [Programmable logic controller](https://en.wikipedia.org/wiki/Programmable_logic_controller) — Wikipedia; scan cycle, tens-of-milliseconds scan times, hard real-time, relay-logic origin of ladder
3. [Sequential function chart](https://en.wikipedia.org/wiki/Sequential_function_chart) — Wikipedia; steps, transitions, actions, parallel execution
4. [TIA Portal](https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html) — Siemens; engineering platform, STEP 7 for all SIMATIC controllers
5. [TwinCAT](https://www.beckhoff.com/en-us/products/automation/twincat/) — Beckhoff; PC-based real-time control, Visual Studio integration, IEC 61131-3 plus C/C++ and MATLAB/Simulink
6. [IEC 61131-3 at PLCopen](https://plcopen.org/iec-61131-3) — PLCopen; XML exchange and Motion Control function blocks built on IEC 61131-3
7. [IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533) — IEC webstore; edition 4.0, published 2025-05-22; ST, LD, and FBD plus SFC elements
8. [IEC 61131-3:2013](https://webstore.iec.ch/en/publication/4552) — IEC webstore; edition 3.0, IL and ST as text languages, object-oriented features of classes and function blocks
9. [IEC 61131-3:1993](https://www.boutique.afnor.org/en-gb/standard/iec-6113131993/programmable-controllers-part-3-programming-languages/xs102769/433866) — AFNOR standards catalogue; first edition, March 1993, replaced by the 2003 edition
10. [CODESYS system overview](https://help.plc.abb.com/_cds_development_system.html) — ABB Automation Builder help; CODESYS-based IEC 61131-3 tool, object-oriented programming optional
11. [Recommended cycle time of the PLC task](https://infosys.beckhoff.com/content/1033/tf8020_bacnetrev14/14456740235.html) — Beckhoff Information System; default PLC task cycle time of 10 ms
12. [Studio 5000 Logix Designer](https://es.mathworks.com/products/connections/product_detail/rslogix-5000.html) — MathWorks partner listing (secondary); design software for Allen-Bradley ControlLogix and CompactLogix controllers
