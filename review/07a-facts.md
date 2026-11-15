## Area 7, Classical robot software (part A): fact check

Summary line: 116 claims checked: 106 verified, 9 corrected, 1 unverifiable (0 kept flagged, 1 removed).

Scope: the area intro plus frames, forward-kinematics, inverse-kinematics, motion-planning, trajectory-generation, collision-checking, control-loops and conveyor-tracking. All 11 original `[unverified]` flags in these concepts are resolved: 6 are now verified and cited, and 5 are corrected and cited. No flag remains in scope. `node tools/build-content.mjs --check knowledge/07-classical-software.md` reports 0 errors and 0 warnings.

Source notes. Three sources stay secondary because I found no primary page that says the same thing in a form I could load: the Wikipedia DH article (cites Denavit and Hartenberg 1955 and Craig), the Wikipedia PID and integral windup articles (the windup article cites Åström and Rundqwist 1989), and a Motion Control Tips trade article for the 5-10x bandwidth rule. The Northwestern tf course notes are also secondary; the 10 s buffer now has a primary source too (the tf2 README on ROS Index). Two primary sources replaced secondary ones: the Diebel 2006 Stanford report replaced Wikipedia for gimbal lock, and the Buss IK report replaced a blog summary of it. "Primary, third-party host" means a maker's own document served from ManualsLib or a university mirror; I checked the text of the document itself. Company and product status as of November 2026: Drake's site still says Toyota Research Institute leads core development, and the Beckhoff AX5000/AX8000, KUKA.ConveyorTech, EL5101, FANUC CRX, MoveIt Pilz/STOMP/CHOMP and Ruckig pages are all live. None of these concepts states company ownership, so no ownership claims needed changing.

### intro
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Learned models that replace parts of this stack are covered in area 8 ([[learned-policy]]) | verified | [registry.md](../knowledge/registry.md), [08-robot-learning.md](../knowledge/08-robot-learning.md) (internal) | none |
| 2 | Each station runs the whole stack "every few seconds" | verified | Running example in [FORMAT.md](../knowledge/FORMAT.md): 200 plates/h is 18 s per plate, 4.5 s per apple pick (computed) | none |

### frames
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | tf2 keeps the frame tree "buffered in time" | verified | [ROS Index tf2](https://index.ros.org/p/tf2/) | none |
| 2 | Every frame in a TF tree has exactly one parent | verified | [NU MSR tf notes](https://nu-msr.github.io/ros_notes/ros1/lecture05_tf.html) (secondary) | marked source secondary |
| 3 | Fixed frames are published once as static transforms; moving ones are streamed with timestamps | verified | [NU MSR tf notes](https://nu-msr.github.io/ros_notes/ros1/lecture05_tf.html) (secondary) | none |
| 4 | REP 103: SI units (m, rad), right-handed, x forward y left z up | verified | [REP 103](https://reps.openrobotics.org/rep-0103/) | none |
| 5 | REP 103 lists quaternions first and discourages Euler angles | verified | [REP 103](https://reps.openrobotics.org/rep-0103/) | none |
| 6 | Eigen calls the quaternion "the representation of choice" | verified | [Eigen TutorialGeometry.dox](https://sources.debian.org/src/eigen3/3.4.0-5/doc/TutorialGeometry.dox) | none |
| 7 | Yaw-pitch-roll gimbal lock at pitch ±90° | verified | [Diebel 2006](https://www.astro.rug.nl/software/kapteyn-beta/_downloads/attitude.pdf) (singular at π/2 + nπ) | replaced Wikipedia [5] with Diebel |
| 8 | A rotation matrix drifts from a valid rotation under repeated rounding unless re-normalized | verified | General floating-point behavior; not cited | none |
| 9 | Quaternions have no such singularity | verified | [Diebel 2006](https://www.astro.rug.nl/software/kapteyn-beta/_downloads/attitude.pdf) | none |
| 10 | q and -q are the same rotation | verified | [Parwana and Kothari 2017](https://arxiv.org/abs/1708.08680) | citation [6] added |
| 11 | "Libraries disagree" on whether w is stored first or last | corrected | [Parwana and Kothari 2017](https://arxiv.org/abs/1708.08680) (Hamilton scalar-first vs JPL scalar-last) | corrected "libraries disagree ... stored" to "conventions disagree ... written"; cited [6] |
| 12 | tf history buffer about 10 s by default | verified | [ROS Index tf2 README](https://index.ros.org/p/tf2/), [NU MSR notes](https://nu-msr.github.io/ros_notes/ros1/lecture05_tf.html) | added primary [1] |
| 13 | 1° at 1 m is about 17 mm | verified | Computed: tan 1° = 0.01746 | none |
| 14 | Eigen Geometry has Quaternion, AngleAxis and Transform types | verified | [Eigen TutorialGeometry.dox](https://sources.debian.org/src/eigen3/3.4.0-5/doc/TutorialGeometry.dox) | none |
| 15 | Eigen is "used by most robotics C++ code" | unverifiable | No source quantifies this | removed |
| 16 | Vendor languages define named base, tool and user frames (was flagged) | corrected | [ABB RobotStudio API: RsWorkObject](https://developercenter.robotstudio.com/api/robotstudio/api/ABB.Robotics.RobotStudio.Stations.RsWorkObject.html) | rewrote as a checked ABB example (work object = user frame + object frame); flag removed; cited [7] |
| 17 | Surgical robot hand motion is applied in the endoscope camera frame | verified | [US 6364888 B1, Intuitive Surgical](https://patents.google.com/patent/US6364888B1/en) | citation [8] added |
| 18 | Car-body weld points defined in a body frame, so one correction moves all of them | verified | [ABB RsWorkObject](https://developercenter.robotstudio.com/api/robotstudio/api/ABB.Robotics.RobotStudio.Stations.RsWorkObject.html) (programmed positions relative to the object frame) | citation [7] added |
| 19 | Code sketch: quaternion-to-matrix formula and result x=0.42, y=0.05, z=0.05 | verified | Computed: R = diag(1,-1,-1), R·p + t | none |

### forward-kinematics
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | FK is the ordered product of per-joint transforms | verified | [Orocos KDL solvers](https://orocos.org/book/export/html/860) | none |
| 2 | Serial-arm FK always exists, is unique and is cheap | verified | Textbook result; consistent with [KDL](https://orocos.org/book/export/html/860) | none |
| 3 | DH uses four parameters d, theta, a (r), alpha | verified | [Wikipedia DH](https://en.wikipedia.org/wiki/Denavit-Hartenberg_parameters) (secondary) | marked source secondary |
| 4 | Classic DH order Trans_z(d) Rot_z(theta) Trans_x(a) Rot_x(alpha) | verified | [Wikipedia DH](https://en.wikipedia.org/wiki/Denavit-Hartenberg_parameters) (secondary) | none |
| 5 | Modified DH (Craig) places frames differently and multiplies in a different order | verified | [Wikipedia DH](https://en.wikipedia.org/wiki/Denavit-Hartenberg_parameters) (secondary) | none |
| 6 | URDF joint: parent, child, origin xyz (m) and rpy (rad), axis, limits on position, velocity, effort | verified | [URDF joint spec (ROS wiki mirror)](https://whiteoak.umd.edu/roswiki/urdf%282f%29XML%282f%29joint.html) | none |
| 7 | URDF origin xyz and rpy default to zero | verified | [URDF joint spec](https://whiteoak.umd.edu/roswiki/urdf%282f%29XML%282f%29joint.html) | none |
| 8 | KDL recursive solver adds segment poses and can return an intermediate segment | verified | [Orocos KDL solvers](https://orocos.org/book/export/html/860) | none |
| 9 | Pinocchio forwardKinematics updates every joint placement (data.oMi) | verified | [Pinocchio IK example](https://gepettoweb.laas.fr/doc/stack-of-tasks/pinocchio/master/doxygen-html/md_doc_b_examples_d_inverse_kinematics.html) | none |
| 10 | Drake core development led by Toyota Research Institute | verified | [drake.mit.edu](https://drake.mit.edu/) | none |
| 11 | Absolute accuracy is much worse than repeatability (was flagged) | verified | [ABB Absolute Accuracy brochure 2005](https://library.e.abb.com/public/0f879113235a0e1dc1257b130056d133/Absolute%20Accuracy%20EN_R4%20US%2002_05.pdf) | flag removed; range added: 8-15 mm real-vs-model gap, about 0.5 mm after calibration [6]; points to [[repeatability]] for repeatability values |
| 12 | DH table is 6x4 for a 6-axis arm | verified | [Wikipedia DH](https://en.wikipedia.org/wiki/Denavit-Hartenberg_parameters) (secondary) | none |
| 13 | Code sketch: classic DH matrix entries | verified | Computed product of the four elementary transforms | none |
| 14 | 80 mm to 140 mm tool swap gives a 60 mm error (labeled illustrative) | verified | Arithmetic | none |

### inverse-kinematics
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Up to 8 IK solutions for a spherical-wrist 6-axis arm | verified | [Elias and Wen 2025](https://arxiv.org/html/2501.18505v2) | none |
| 2 | FANUC CRX can have up to 16 | verified | [Elias and Wen 2025](https://arxiv.org/html/2501.18505v2) | none |
| 3 | A 7-axis arm has infinitely many solutions | verified | Textbook result (redundancy) | none |
| 4 | Vendor languages make you state the intended posture (was flagged) | verified | [ABB RobotStudio API: ConfigurationData](https://developercenter.robotstudio.com/api/robotstudio/api/ABB.Robotics.RobotStudio.Stations.ConfigurationData.html) | flag removed; ABB example added (quadrants of axes 1, 4, 6) [7]; "typically" softened to "often" |
| 5 | IKFast finds solutions "in a few microseconds" on recent processors | verified | [MoveIt IKFast tutorial](https://moveit.picknik.ai/main/doc/examples/ikfast/ikfast_tutorial.html) | none |
| 6 | IKFast comes from OpenRAVE, tested on 6 and 7 DOF arms | verified | [MoveIt IKFast tutorial](https://moveit.picknik.ai/main/doc/examples/ikfast/ikfast_tutorial.html) | none |
| 7 | DLS step dq = J^T (J J^T + lambda^2 I)^-1 e | verified | [Buss 2009 report](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf), eq. 11 | replaced blog source [5] with the Buss report |
| 8 | Plain pseudoinverse blows up near singularities | verified | [Buss 2009](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf), section 4 | none |
| 9 | Damping too large makes convergence slow | verified | [Buss 2009](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf), section 5 | none |
| 10 | Pinocchio example: eps 1e-4, 1000 iterations, DT 0.1, damping 1e-12 (Python) and 1e-6 (C++) | verified | [Pinocchio IK example](https://gepettoweb.laas.fr/doc/stack-of-tasks/pinocchio/master/doxygen-html/md_doc_b_examples_d_inverse_kinematics.html) | none |
| 11 | Numerical solvers return "the one solution nearest their starting guess" | corrected | Behavior of local iterative methods ([Buss 2009](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf)) | corrected to "one solution, usually one near their starting guess" (not guaranteed nearest) |
| 12 | TRAC-IK runs enhanced KDL and SQP concurrently; drop-in replacement for KDL | verified | [trac_ik ROS wiki mirror](https://mirror.umd.edu/roswiki/trac_ik.html) | none |
| 13 | Classic singularity cases (was flagged) | verified | [Doosan e-Series manual: Singularity](https://manual.doosanrobotics.com/en/user-manual/3.2.0/3-e-series/singularity) | flag removed; named elbow, shoulder and wrist cases to match the manual (axis 5 at 0 lines up axes 4 and 6); cited [6] |
| 14 | Near a singularity, linear moves need very fast joints, so the controller slows or stops | verified | [Doosan manual](https://manual.doosanrobotics.com/en/user-manual/3.2.0/3-e-series/singularity) (speed-limit violations), [Buss 2009](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf) | added [6]; "stops with an error" made "stops with a speed-limit error" |
| 15 | A standard 4-axis SCARA or delta controls only x, y, z and rotation about vertical | verified | Standard kinematics; covered in the scara and delta concepts | none |

### motion-planning
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Joint moves are unaffected by singularities | verified | [Doosan manual](https://manual.doosanrobotics.com/en/user-manual/3.2.0/3-e-series/singularity) (MoveJ not affected) | none |
| 2 | Pilz offers PTP, LIN, CIRC with trapezoidal profiles | verified | [MoveIt Pilz](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) | none |
| 3 | RRT grows toward random samples and is biased toward unexplored space | verified | [LaValle RRT page](https://lavalle.pl/rrt/about.html) | none |
| 4 | RRT-Connect "is a common default for arms" (was flagged) | corrected | [MoveIt 2 ompl_interface.cpp](https://github.com/moveit/moveit2/blob/main/moveit_planners/ompl/ompl_interface/src/ompl_interface.cpp) | corrected to "the planner MoveIt 2 falls back to when no default is configured"; flag removed; cited [9] |
| 5 | PRM builds a reusable roadmap for many queries | verified | [OMPL planners](https://ompl.kavrakilab.org/planners.html) | none |
| 6 | Sampling planners are probabilistically complete but cannot report that no path exists | verified | [MoveIt STOMP page](https://moveit.picknik.ai/main/doc/how_to_guides/stomp_planner/stomp_planner.html) | none |
| 7 | Raw sampling paths are jerky and need post-processing | verified | [CHOMP, ICRA 2009](https://publications.ri.cmu.edu/chomp-gradient-optimization-techniques-for-efficient-motion-planning/) | none |
| 8 | RRT* and PRM* converge toward the optimal path with more time | verified | [OMPL planners](https://ompl.kavrakilab.org/planners.html) | none |
| 9 | CHOMP uses covariant gradient descent (Ratliff, Zucker, Bagnell, Srinivasa, ICRA 2009) | verified | [CHOMP](https://publications.ri.cmu.edu/chomp-gradient-optimization-techniques-for-efficient-motion-planning/) | none |
| 10 | STOMP's noisy trajectories help it escape local minima that trap CHOMP | verified | [MoveIt STOMP page](https://moveit.picknik.ai/main/doc/how_to_guides/stomp_planner/stomp_planner.html) | none |
| 11 | TrajOpt: sequential convex optimization, continuous-time collision checks, faster and solved more problems than OMPL and CHOMP | verified | [Schulman et al., RSS 2013](https://www.roboticsproceedings.org/rss09/p31.html) | none |
| 12 | TrajOpt by Schulman, Abbeel and colleagues | verified | [RSS 2013](https://www.roboticsproceedings.org/rss09/p31.html) | none |
| 13 | OMPL has no collision checking by design and is MoveIt's default planning library | verified | [OMPL home](https://ompl.kavrakilab.org/) | none |
| 14 | OMPL lists more than 40 geometric planners | verified | [OMPL planners](https://ompl.kavrakilab.org/planners.html) (45 counted) | none |
| 15 | LaValle, Planning Algorithms, Cambridge University Press 2006, free online | verified | [lavalle.pl/planning](https://lavalle.pl/planning/) | none |
| 16 | "Optimizers return the best path near their starting guess" | corrected | [MoveIt STOMP page](https://moveit.picknik.ai/main/doc/how_to_guides/stomp_planner/stomp_planner.html) (CHOMP gets stuck in local minima; STOMP can avoid them) | corrected to "gradient optimizers such as CHOMP can get stuck in a local minimum near their starting guess" |
| 17 | Spot-welding paths are "typically generated offline in simulation and touched up on the line" (was flagged) | corrected | [Siemens Process Simulate](https://www.siemens.com/en-us/products/tecnomatix/process-simulate-software/) | narrowed to "often programmed offline in simulation tools" with Process Simulate as the example (spot welding, program download); removed the unsupported "touched up" and "typically"; flag removed; cited [10] |
| 18 | 18 s per plate per station, 4.5 s per apple pick | verified | Computed from the running example | none |

### trajectory-generation
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Short trapezoid moves become triangles; jerk is unbounded at profile corners | verified | Follows from the profile definition | none |
| 2 | Pilz synchronizes PTP joints to a lead axis | verified | [MoveIt Pilz](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) | none |
| 3 | TOTG (Kunz and Stilman, RSS 2012) uses circular blends and has open-source code | verified | [RSS 2012](https://www.roboticsproceedings.org/rss08/p27.html) | none |
| 4 | TOTG is the default time parameterization in MoveIt 2 | verified | [MoveIt time parameterization](https://moveit.picknik.ai/main/doc/examples/time_parameterization/time_parameterization_tutorial.html); also default `AddTimeOptimalParameterization` in [moveit_configs_utils ompl_planning.yaml](https://github.com/moveit/moveit2/blob/main/moveit_configs_utils/default_configs/ompl_planning.yaml) | none |
| 5 | MoveIt can follow TOTG with a Ruckig jerk-limiting pass | verified | [MoveIt time parameterization](https://moveit.picknik.ai/main/doc/examples/time_parameterization/time_parameterization_tutorial.html) | none |
| 6 | Ruckig: time-optimal, jerk-limited, to targets with nonzero velocity | verified | [Ruckig repo](https://github.com/pantor/ruckig), [Berscheid and Kroeger, RSS 2021](https://www.roboticsproceedings.org/rss17/p015.html) | none |
| 7 | Open-source Ruckig suits control cycles down to 500 µs | verified | [Ruckig repo](https://github.com/pantor/ruckig) (Community version benchmark) | none |
| 8 | Ruckig: MIT license, Pro version, used by MoveIt 2 | verified | [Ruckig repo](https://github.com/pantor/ruckig) | none |
| 9 | Tested on over 1 billion random trajectories | verified | [RSS 2021](https://www.roboticsproceedings.org/rss17/p015.html) | none |
| 10 | Pilz example limits: 1 m/s, 2.25 m/s², 1.57 rad/s | verified | [MoveIt Pilz](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) | none |
| 11 | v²/a = 0.9 rad, about 52° (labeled illustrative) | verified | Computed: 0.9 rad = 51.6° | none |
| 12 | Code sketch Ruckig Python API names | verified | [Ruckig examples/01_position.py](https://github.com/pantor/ruckig/blob/main/examples/01_position.py) | none |
| 13 | Code sketch trapezoid math | verified | Computed | none |

### collision-checking
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Simpler shapes for checking, detailed meshes for display (was flagged) | verified | [ROS 2 docs: URDF collision properties](https://github.com/ros2/ros2_documentation/blob/rolling/source/Capabilities/Simulation/URDF/Adding-Physical-and-Collision-Properties-to-a-URDF-Model.rst) | flag removed; "simplified convex shapes" dropped (not in source); reason added; cited [5] |
| 2 | FCL does overlap, distance, tolerance and continuous collision queries | verified | [FCL repo](https://github.com/flexible-collision-library/fcl) | none |
| 3 | FCL wraps meshes in a bounding volume hierarchy | verified | [FCL repo](https://github.com/flexible-collision-library/fcl) (BVHModel, OBBRSS) | none |
| 4 | FCL shapes include boxes, spheres, cylinders, capsules, meshes, octrees | verified | [FCL repo](https://github.com/flexible-collision-library/fcl) | none |
| 5 | Attached (held) objects are checked too | verified | [MoveIt Planning Scene ROS API](https://moveit.picknik.ai/main/doc/examples/planning_scene_ros_api/planning_scene_ros_api_tutorial.html) | citation [7] added |
| 6 | MoveIt can pass an OctoMap straight into FCL | verified | [MoveIt Planning Scene Monitor](https://moveit.picknik.ai/main/doc/concepts/planning_scene_monitor.html) | none |
| 7 | ACM skips neighboring links and the cup-item pair | verified | [MoveIt Planning Scene](https://moveit.picknik.ai/main/doc/examples/planning_scene/planning_scene_tutorial.html), [Setup Assistant](https://moveit.picknik.ai/main/doc/examples/setup_assistant/setup_assistant_tutorial.html), [Planning Scene ROS API](https://moveit.picknik.ai/main/doc/examples/planning_scene_ros_api/planning_scene_ros_api_tutorial.html) | citations [6] [7] added |
| 8 | MoveIt: environment checks padded, self-collision unpadded | verified | [MoveIt Planning Scene](https://moveit.picknik.ai/main/doc/examples/planning_scene/planning_scene_tutorial.html) | none |
| 9 | OMPL contains no collision checker | verified | [OMPL home](https://ompl.kavrakilab.org/) | none |
| 10 | Planner collision checking is not a certified safety function | verified | Reasoning: planning software like MoveIt is not safety-rated; certified protection is covered in guarding and safety-circuit | none |

### control-loops
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Raising P speeds response; too much oscillates, then goes unstable | verified | [NI PID Theory](https://www.ni.com/en/shop/labview/pid-theory-explained.html) | none |
| 2 | I removes steady-state error but adds overshoot | verified | [NI PID Theory](https://www.ni.com/en/shop/labview/pid-theory-explained.html) | none |
| 3 | Windup; anti-windup clamps or pauses the integral | verified | [Wikipedia integral windup](https://en.wikipedia.org/wiki/Integral_windup) (secondary); consistent with [Åström and Murray FBS wiki](https://www.cds.caltech.edu/~murray/amwiki/PID_Control.html) | marked source secondary |
| 4 | D reduces overshoot but is noise-sensitive | verified | [NI PID Theory](https://www.ni.com/en/shop/labview/pid-theory-explained.html) | none |
| 5 | D is usually filtered and often taken on the measurement | verified | [Wikipedia PID](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) (secondary); filtering also in [FBS wiki](https://www.cds.caltech.edu/~murray/amwiki/PID_Control.html) | marked source secondary |
| 6 | Cascade position, velocity, current; each inner loop much faster | verified | [Wikipedia PID](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) (secondary) | none |
| 7 | 62.5 µs loop cycles "(16 kHz)" | corrected | [Beckhoff AX5000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax5000-digital-compact-servo-drives/), [AX8000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax8000-multi-axis-servo-system/) | clarified "(16 kHz)" to "(a 16 kHz loop rate)", since AX8000 quotes 8 kHz switching; values unchanged |
| 8 | AX5000: current, speed and position control each down to 62.5 µs | verified | [Beckhoff AX5000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax5000-digital-compact-servo-drives/) | none |
| 9 | AX8000: 62.5 µs current control at 8 kHz switching, EtherCAT | verified | [Beckhoff AX8000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax8000-multi-axis-servo-system/) | none |
| 10 | UR real-time loop 500 Hz on e-Series and ur-Series | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 11 | Feedforward cannot make the loop oscillate | verified | [Wikipedia PID](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) (secondary) | none |
| 12 | Cold room: stiffer grease, higher friction, may need retuning (was flagged) | corrected | [ABB IRB 1200 product specification, p. 20](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=20) (primary, third-party host) | rewrote around what ABB states (warm-up below 10 °C; oil and grease viscosity can cause stops or lower performance); flag removed; cited [7] |
| 13 | Inner loops "run 5-10 times faster" (was flagged) | corrected | [Motion Control Tips](https://www.motioncontroltips.com/how-are-servo-system-velocity-control-loops-tuned/) (secondary) | corrected to inner-loop bandwidth 5-10 times the outer loop's; said what it depends on; flag removed; cited [8] |
| 14 | Beckhoff AX5000 and AX8000 are current products | verified | Both product pages live with no end-of-life notice | none |

### conveyor-tracking
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Encoder modules such as EL5101 have a latch input that stores the count | verified | [Beckhoff EL5101](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el5xxx-position-measurement/el5101.html) | none |
| 2 | Conveyor frame direction is calibrated by teaching two or more belt points (was flagged) | verified | [Doosan Conveyor Coordinate](https://manual.doosanrobotics.com/en/dart-bridge-manual/1.6/publish/conveyor-coordinate) | flag removed; added how Doosan does it (count and pose per taught point, counts per distance computed); cited [4] |
| 3 | KUKA.ConveyorTech syncs in the background, up to 5 linear or circular conveyors | verified | [KUKA.ConveyorTech](https://www.kuka.com/en-us/products/robotics-systems/software/application-software/kuka_conveyortech) | none |
| 4 | Up to 1024 components per conveyor | verified | [KUKA.ConveyorTech](https://www.kuka.com/en-us/products/robotics-systems/software/application-software/kuka_conveyortech) | none |
| 5 | KUKA says ConveyorTech suits assembly | verified | [KUKA.ConveyorTech](https://www.kuka.com/en-us/products/robotics-systems/software/application-software/kuka_conveyortech) | none |
| 6 | EL5101: up to 1 MHz, 4 million increments/s with 4-fold evaluation | verified | [Beckhoff EL5101](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el5xxx-position-measurement/el5101.html) | none |
| 7 | EL5101 latch input is 24 V | verified | [Beckhoff EL5101](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el5xxx-position-measurement/el5101.html) (encoder supply itself is 5 V) | none |
| 8 | Ruckig can target a moving state | verified | [Ruckig repo](https://github.com/pantor/ruckig) | none |
| 9 | 10 ms at 100 mm/s is 1 mm (labeled illustrative) | verified | Computed | none |
| 10 | Belt about 22 mm/s at 400 mm spacing and 200 plates/h | verified | Computed: 400 × 200 / 3600 = 22.2 mm/s | none |
| 11 | Other robot makers offer similar tracking packages (was flagged) | verified | [Doosan Conveyor Coordinate](https://manual.doosanrobotics.com/en/dart-bridge-manual/1.6/publish/conveyor-coordinate), [Mitsubishi CR800 manual p. 61](https://manualslib.com/manual/1851536/Mitsubishi-Electric-Cr800-Series.html?page=61) (primary, third-party host) | flag removed; two named examples added; cited [4] [5] |
