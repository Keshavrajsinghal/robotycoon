## Area 7, Classical robot software (part B): fact check

Summary line: 173 claims checked: 155 verified, 12 corrected, 6 unverifiable (4 kept flagged, 2 removed).

Scope: state-machines, perception, grasp-planning, ros2, moveit, opencv, vendor-languages, plc-programming in `knowledge/07-classical-software.md`. Validator: `node tools/build-content.mjs --check knowledge/07-classical-software.md` reports 0 errors and 0 warnings after these edits.

Notes:
- Seven `[unverified]` flags were in scope at the start. Four are resolved: Yaskawa MOVJ/MOVL, Epson SPEL+, the ABB-SoftBank deal, and Rockwell Studio 5000. Three stay flagged: the spot-welding re-teach practice, the illustrative code-sketch lines, and the airport baggage practice. One new flag was added: "plants tend to standardize on one brand".
- The shared web-search quota ran out partway through the PLC checks. After that, claims were checked only by fetching known URLs, so the airport baggage claim could not be retried.
- These vendor pages blocked fetches: ABB's own news pages (timed out), rockwellautomation.com (403), codesys.com (429), and the ROS wiki and docs.ros.org (bot wall). Fallbacks used: the SoftBank press release plus Robotics 24/7 (secondary) for the ABB deal; MathWorks (secondary) for Studio 5000; ABB's Automation Builder help for CODESYS; and the GitHub sources of REP 2000 and ros2_documentation for ROS distributions.
- Secondary sources kept because no loadable primary was found: Wikipedia (the IEC 61131-3 IL deprecation and POU types, the PLC scan cycle and history, SFC parallelism), MathWorks (Studio 5000), and Robotics 24/7 (ABB deal status).
- Release dates without a year on GitHub pages (py_trees 2.6.0, OpenCV 5.1.0, Open3D 0.20.0, BehaviorTree.CPP 4.11.0) were confirmed through the GitHub API (`gh api repos/.../releases`).

### state-machines
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | SMACH is a Python task framework with ROS integration; its repo has a ros2 branch | verified | [executive_smach](https://github.com/ros/executive_smach) | none (ros2 is now the default branch) |
| 2 | YASMIN: ROS 2 state machine library in C++ and Python, with default states and a web viewer | verified | [arXiv 2205.13284](https://arxiv.org/abs/2205.13284v1) | none |
| 3 | A tick is sent from the root and propagates down to the leaves | verified | [BT basics, v4.11](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none |
| 4 | Node results are SUCCESS, FAILURE, RUNNING | verified | [BT basics](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none |
| 5 | A Sequence stops at the first failure | verified | [BT basics](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none |
| 6 | A Fallback runs children until one succeeds | verified | [BT basics](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none |
| 7 | RetryUntilSuccessful re-ticks a failed child up to num_attempts times | corrected | [BT.CPP Decorators](https://www.behaviortree.dev/docs/nodes-library/DecoratorNode) | cited source [1] only shows a node called "Retry"; citation moved to new source [10], which names RetryUntilSuccessful |
| 8 | Conditions never return RUNNING | verified | [BT basics](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none |
| 9 | Colledanchise and Ögren: BTs are modular and reactive | verified | [arXiv 1709.00084](https://arxiv.org/abs/1709.00084) | none |
| 10 | BehaviorTree.CPP treats asynchronous (non-blocking) actions as first-class | verified | [BT.CPP README](https://raw.githubusercontent.com/BehaviorTree/BehaviorTree.CPP/master/README.md) | none |
| 11 | MoveIt Pro has RepeatUnlessFailureWithinTick (repeats a child within one tick) | verified | [MoveIt Pro API](https://docs.picknik.ai/api/files/behavior/include/moveit-pro-behavior/behaviors/core/repeat-unless-failure-within-tick-hpp/) | none |
| 12 | py_trees: a Sequence with memory skips to the RUNNING child; one without memory re-checks earlier children | verified | [py_trees composites](https://py-trees.readthedocs.io/en/release-2.4.x/composites.html) | none (the no-memory behavior is implied by the page's guard-condition note) |
| 13 | BT.CPP trees are XML loaded at run time and edited in Groot2 | verified | [BT.CPP README](https://raw.githubusercontent.com/BehaviorTree/BehaviorTree.CPP/master/README.md) | none |
| 14 | BT.CPP documentation is at version 4.11 | verified | [BT basics](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none (release 4.11.0 tagged 8 Nov 2026; the README title still says 4.9) |
| 15 | py_trees 2.6.0 released September 2026 | verified | [py_trees 2.6.0](https://github.com/splintered-reality/py_trees/releases/tag/2.6.0) | none (10 Sep 2026, per GitHub API) |
| 16 | MoveIt Pro behaviors are built on BehaviorTree.CPP | verified | [MoveIt Pro API](https://docs.picknik.ai/api/files/behavior/include/moveit-pro-behavior/behaviors/core/repeat-unless-failure-within-tick-hpp/) | none (the header includes behaviortree_cpp's repeat node) |
| 17 | A high-level state machine sends a waypoint goal as an action, gets feedback, can cancel | verified | [ROS 2 Actions](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/About-Actions.rst) | none |
| 18 | 18 s per tray and about 6 s per wedge at 200 plates/h | verified | arithmetic (3600/200 = 18; 18/3 = 6) | none; labeled as arithmetic |
| 19 | Code sketch: Repeat num_cycles and RetryUntilSuccessful num_attempts are real BT.CPP v4 ports | verified | [BT.CPP Decorators](https://www.behaviortree.dev/docs/nodes-library/DecoratorNode) | none |

### perception
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Detections carry a mask, class label, and confidence | verified | [Ultralytics Segment](https://docs.ultralytics.com/tasks/segment/) | none |
| 2 | Modern neural networks are poorly calibrated | verified | [Guo et al. 2017](https://arxiv.org/abs/1706.04599) | none |
| 3 | Networks tend to be overconfident | verified | [Guo et al., full text](https://ar5iv.labs.arxiv.org/html/1706.04599) | none (the paper shows ResNet overconfidence, which grows with capacity) |
| 4 | Template matching slides the template, scores each position, and takes the best (minMaxLoc) | verified | [OpenCV template matching](https://raw.githubusercontent.com/opencv/opencv/4.x/doc/py_tutorials/py_imgproc/py_template_matching/py_template_matching.markdown) | none |
| 5 | It compares at one size and angle only | verified | same | none (follows from the translation-only sliding the page describes; the page does not say it outright) |
| 6 | The score map is (W-w+1) by (H-h+1) | verified | same | none |
| 7 | Mask R-CNN (2017) adds a mask branch to a detector | verified | [arXiv 1703.06870](https://arxiv.org/abs/1703.06870) | none |
| 8 | Mask R-CNN runs at about 5 fps | verified | same | none |
| 9 | YOLO26n-seg takes about 2 ms on a T4 with TensorRT | verified | [Ultralytics Segment](https://docs.ultralytics.com/tasks/segment/) | none (2.1 ms, COCO val, batch 1) |
| 10 | YOLO26n-seg takes about 53 ms on a CPU with ONNX | verified | same | none (53.3 ms) |
| 11 | FoundationPose estimates and tracks the pose of novel objects from a CAD model or reference images | verified | [arXiv 2312.08344](https://arxiv.org/abs/2312.08344) | none |
| 12 | BOP 2024: the best unseen-object method is within about 4% of the best 2023 seen-object method | verified | [arXiv 2504.02812](https://arxiv.org/abs/2504.02812v3) | none |
| 13 | That method needs 24.9 s per image | verified | same | none |
| 14 | A practical entry (Co-op) takes 0.8 s per image | verified | same | none |
| 15 | Unseen-object 2D detection is about 35% behind seen-object detection | verified | same | none |
| 16 | HALCON covers matching, 3D matching, measurement, calibration, and deep learning | verified | [MVTec HALCON](https://www.mvtec.com/products/halcon) | none (marketing page, light on detail) |
| 17 | BOP has an "annual" challenge | corrected | [arXiv 2504.02812](https://arxiv.org/abs/2504.02812v3) | "annual challenge" changed to "a recurring public challenge; the 2024 edition was the sixth" |
| 18 | Illustrative values (0.8 threshold, belt color, blob area band) are labeled | verified | file text | none |

### grasp-planning
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Dex-Net 3.0's contact model scores seal formation and resistance to the object's weight | verified | [arXiv 1709.06670](https://arxiv.org/abs/1709.06670) | none |
| 2 | Dex-Net 3.0 trained on 2.8 million synthetic point clouds | verified | same | none |
| 3 | Dex-Net 3.0: 98% / 82% / 58% on basic / typical / adversarial objects | verified | same | none |
| 4 | GPD: a frictionless antipodal grasp is force closure for any nonzero friction | verified | [GPD, ar5iv](https://ar5iv.labs.arxiv.org/html/1706.09911) | none |
| 5 | GPD samples thousands of geometric candidates and classifies them with a small CNN | verified | same | none ("several thousand"; 4-layer CNN) |
| 6 | Dex-Net 2.0 trained on 6.7 million synthetic examples | verified | [arXiv 1703.09312](https://arxiv.org/abs/1703.09312) | none |
| 7 | Dex-Net 2.0 plans in 0.8 s | verified | same | none |
| 8 | Dex-Net 2.0 reaches 93% success on known objects | verified | same | none (eight known objects with adversarial geometry) |
| 9 | Dex-Net 4.0 learned to choose between suction and parallel jaws | verified | [Dex-Net project page](https://berkeleyautomation.github.io/dex-net/) | none |
| 10 | Dex-Net 4.0 clears bins of up to 25 novel objects with over 95% reliability | verified | same | none |
| 11 | Dex-Net 4.0 exceeds 300 mean picks per hour | verified | same | none |
| 12 | Contact-GraspNet (ICRA 2021) trained on 17 million simulated grasps | verified | [arXiv 2103.14127](https://arxiv.org/abs/2103.14127) | none |
| 13 | Contact-GraspNet exceeds 90% success on unseen objects in structured clutter | verified | same | none |
| 14 | AnyGrasp: 93.3% success clearing bins of 300+ unseen objects | verified | [arXiv 2212.08333](https://arxiv.org/abs/2212.08333) | none |
| 15 | AnyGrasp exceeds 900 mean picks per hour | verified | same | none |
| 16 | AnyGrasp re-detects grasps continuously and caught moving objects | verified | same | none (it caught swimming robot fish) |
| 17 | GQ-CNN code last updated in 2024 | verified | [gqcnn](https://github.com/BerkeleyAutomation/gqcnn) | none (pushed 25 Apr 2024, per GitHub API) |
| 18 | AnyGrasp SDK still updated in 2026 | verified | [anygrasp_sdk](https://github.com/graspnet/anygrasp_sdk) | none (pushed 13 Jul 2026, per GitHub API) |
| 19 | Ambi Robotics sells AmbiSort and AmbiStack as of 2026 | verified | [Ambi Robotics](https://www.ambirobotics.com/) | none (no acquisition notice) |
| 20 | A triangle's centroid sits one third of the way from the base edge toward the tip | verified | geometry (centroid lies on each median, one third from the side) | none |
| 21 | Code sketch: the friction cone half-angle is arctan(mu) | verified | Coulomb friction definition | none |

### ros2
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Nodes exchange typed messages defined in .msg, .srv, and .action files | verified | [Interfaces](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/Interfaces-Topics-Services-Actions.rst) | none |
| 2 | Topics are publish/subscribe: one-way, asynchronous, many publishers and subscribers | verified | same | none |
| 3 | Services are request/response calls for short tasks | verified | same | none |
| 4 | Actions: goal, feedback, cancel | verified | [Actions](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/About-Actions.rst) | none |
| 5 | Parameters are per-node values set from launch files, YAML, or the CLI, at startup or at runtime | verified | [Parameters](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/About-Parameters.rst) | none |
| 6 | tf2 keeps a time-buffered frame tree that works across computers | verified | [Tf2](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/Working-with-interfaces/About-Tf2/About-Tf2.rst) | none |
| 7 | The default RMW is Fast DDS | verified | [REP 2000](https://reps.openrobotics.org/rep-2000/); [Lyrical supported platforms (source)](https://github.com/ros2/ros2_documentation/blob/rolling/source/Releases/lyrical/supported-platforms.rst) | none (default in both Kilted and Lyrical) |
| 8 | Cyclone DDS and RTI Connext are Tier 1 | verified | same | none |
| 9 | Kilted added Zenoh as Tier 1 | verified | [REP 2000 source](https://github.com/ros-infrastructure/rep/blob/master/rep-2000.rst) | none (Zenoh is absent from Jazzy's table; Tier 1 in Kilted and Lyrical) |
| 10 | QoS policies: history, depth, reliability, durability, deadline, lifespan, liveliness | verified | [QoS settings](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/topics/About-Quality-of-Service-Settings.rst) | none |
| 11 | Default QoS: keep last 10, reliable, volatile | verified | same | none |
| 12 | "Reliable" is implemented over UDP | verified | same | none |
| 13 | Incompatible profiles prevent delivery | verified | same | none |
| 14 | A best-effort camera with a reliable subscriber is a "silent" failure | corrected | [QoS settings](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/topics/About-Quality-of-Service-Settings.rst); [rclpy event_handler.py](https://raw.githubusercontent.com/ros2/rclpy/rolling/rclpy/rclpy/event_handler.py) | "silent failure" changed to "no images arrive and the only sign is an incompatible-QoS warning in the log"; added source [12] (rclpy logs this warning by default) |
| 15 | Real-time needs PREEMPT_RT or Xenomai and code that avoids page faults, allocation, and blocking | verified | [Real-time programming](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/Capabilities/Motion-planning/Real-Time-Programming.rst) | none |
| 16 | ros2_control: the controller manager runs a read, update, write loop against hardware plug-ins | verified | [ros2_control getting started](https://control.ros.org/rolling/doc/getting_started/getting_started.html) | none |
| 17 | FANUC's driver is official, ros2_control based, with Jazzy on main and a 1 kHz mode guide | verified | [FANUC driver docs](https://fanuc-corporation.github.io/fanuc_driver_doc/main/index.html) | none |
| 18 | The FANUC driver is open source | verified | [fanuc_driver repo](https://github.com/FANUC-CORPORATION/fanuc_driver) | added source [11] (Apache-2.0, copyright FANUC America and FANUC CORPORATION); the docs page does not state a license |
| 19 | Humble is LTS, end of life May 2027 | verified | [REP 2000](https://reps.openrobotics.org/rep-2000/) | none |
| 20 | Jazzy is LTS, end of life May 2029 | verified | same | none |
| 21 | Kilted is non-LTS, May 2025 to November 2026 | verified | same | none (reaches end of life this month) |
| 22 | Lyrical Luth: LTS, released 22 May 2026, supported to May 2031, Tier 1 on Ubuntu 26.04 and Windows 11 | verified | [Lyrical release post](https://discourse.openrobotics.org/t/ros-2-lyrical-luth-released/55021) | none |
| 23 | "Lyrical and Jazzy are the current LTS distributions" | corrected | [REP 2000](https://reps.openrobotics.org/rep-2000/) | changed to "the two newest LTS distributions; the older Humble Hawksbill LTS is supported until May 2027" |
| 24 | The sensor-data QoS profile is best effort | verified | [QoS settings](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/topics/About-Quality-of-Service-Settings.rst) | none |
| 25 | Support windows: 5 years for an LTS, about 1.5 years for a non-LTS | verified | [REP 2000](https://reps.openrobotics.org/rep-2000/); [Lyrical release post](https://discourse.openrobotics.org/t/ros-2-lyrical-luth-released/55021) | none |

### moveit
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | MoveIt 2 development is led by PickNik | verified | [moveit2 repo](https://github.com/moveit/moveit2) | none |
| 2 | Stable branches for Humble, Jazzy, and Kilted as of 2026 | verified | same | added "and buildfarm binaries for Lyrical as of November 2026" (README buildfarm table; no lyrical branch) |
| 3 | move_group pulls the components together behind ROS actions and services | verified | [move_group](https://moveit.picknik.ai/main/doc/concepts/move_group.html) | none |
| 4 | It reads the URDF and the SRDF; the SRDF is usually made with the Setup Assistant | verified | same | none |
| 5 | It reads /joint_states and listens to TF | verified | same | none |
| 6 | It executes plans as a FollowJointTrajectory client | verified | same | none |
| 7 | Interfaces: MoveGroupInterface (C++) and the RViz plugin | verified | same | none |
| 8 | MoveItPy is "Python bindings to a subset of the C++ API" | corrected | [moveit_py README](https://github.com/moveit/moveit2/tree/main/moveit_py) | "subset" is unsupported; changed to "a Python library built on generated bindings to MoveIt's C++ core"; added source [9] |
| 9 | OMPL is the default planner | verified | [Motion Planning](https://moveit.picknik.ai/main/doc/concepts/motion_planning.html) | none |
| 10 | Pilz and CHOMP are available by default | verified | same | none |
| 11 | Pilz makes point-to-point, straight-line, and circular moves "like an industrial controller" | corrected | [Pilz guide](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) | the cited concept page only names Pilz; reworded to PTP/LIN/CIRC with trapezoidal velocity profiles ("standard robot motions"), cited new source [8] |
| 12 | Request adapters: fix start bounds, default workspace, fix start collision, resolve constraint frames | verified | [Motion Planning](https://moveit.picknik.ai/main/doc/concepts/motion_planning.html) | none |
| 13 | AddTimeParameterization applies velocity and acceleration limits | verified | same | none |
| 14 | Collision checking is on by default, including self-collision and attached objects | verified | same | none |
| 15 | The Planning Scene Monitor maintains the scene; attached objects are rigid | verified | [move_group](https://moveit.picknik.ai/main/doc/concepts/move_group.html) | none |
| 16 | Servo inputs: joint jog, twist, pose | verified | [Realtime Servo](https://moveit.picknik.ai/main/doc/examples/realtime_servo/realtime_servo_tutorial.html) | none |
| 17 | Servo outputs joint position or velocity commands | verified | same | none (JointTrajectory or Float64MultiArray) |
| 18 | Servo slows near singularities and collisions and enforces joint limits | verified | same | none |
| 19 | Smoothing plug-ins: Butterworth, acceleration-limited, Ruckig | verified | same | none |
| 20 | The C++ class is Servo; the ROS wrapper is ServoNode | verified | same | none |
| 21 | Servo is used for teleoperation and visual servoing | verified | same | none |
| 22 | Servo needs a controller that accepts positions or velocities | verified | same | none |
| 23 | MoveIt Task Constructor is listed in Concepts | verified | [Concepts](https://moveit.picknik.ai/main/doc/concepts/concepts.html) | none |
| 24 | MoveIt Pro is the commercially supported version | verified | [moveit2 repo](https://github.com/moveit/moveit2) | none |
| 25 | The default workspace is a 10 m cube | verified | [Motion Planning](https://moveit.picknik.ai/main/doc/concepts/motion_planning.html) | none |
| 26 | Code sketch MoveItPy calls match the tutorial (execute(traj, controllers=[]), set_goal_state, read_write) | verified | [MoveItPy tutorial](https://moveit.picknik.ai/main/doc/examples/motion_planning_python_api/motion_planning_python_api_tutorial.html) | none |

### opencv
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | OpenCV is a C++ library with Python bindings | verified | [opencv repo](https://github.com/opencv/opencv); [Python tutorial](https://raw.githubusercontent.com/opencv/opencv/4.x/doc/py_tutorials/py_imgproc/py_template_matching/py_template_matching.markdown) | none |
| 2 | It has template matching and minMaxLoc | verified | same | none |
| 3 | solvePnP finds an object pose from 3D-2D correspondences | verified | [calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 4 | It has a Deep Neural Network module | verified | [dnn.hpp](https://raw.githubusercontent.com/opencv/opencv/5.x/modules/dnn/include/opencv2/dnn.hpp) | none |
| 5 | The newest release is 5.1.0 (November 2026) | verified | [OpenCV 5.1.0](https://github.com/opencv/opencv/releases/tag/5.1.0) | none (6 Nov 2026; the 4.x line continues, 4.14.0 in Jul 2026) |
| 6 | The 5.x point cloud module has outlier removal, "normal estimation", and bounding boxes | corrected | [ptcloud.hpp](https://raw.githubusercontent.com/opencv/opencv/5.x/modules/ptcloud/include/opencv2/ptcloud.hpp) | the header declares normal orientation functions; normalEstimate lives elsewhere; changed to "normal orientation" |
| 7 | PCL is BSD-licensed, with the listed modules | verified | [pointclouds.org](https://pointclouds.org/) | none |
| 8 | PCL is a C++ library | verified | [PCL repo](https://github.com/PointCloudLibrary/pcl) | none (repo language metadata; the site does not say) |
| 9 | PCL 1.15.1 released August 2025 | verified | [PCL 1.15.1](https://github.com/PointCloudLibrary/pcl/releases/tag/pcl-1.15.1) | none (26 Aug 2025) |
| 10 | Open3D: voxel downsampling, normals, plane segmentation, DBSCAN, oriented boxes | verified | [Open3D point cloud tutorial](https://www.open3d.org/docs/release/tutorial/geometry/pointcloud.html) | none (docs header shows 0.19.0) |
| 11 | Open3D has C++ and Python APIs | verified | [Open3D v0.20.0](https://github.com/isl-org/Open3D/releases/tag/v0.20.0) | none |
| 12 | Open3D 0.20.0 released September 2026 | verified | same | none (16 Sep 2026) |
| 13 | Tutorial RANSAC settings: 1 cm, 3 points, 1000 iterations | verified | [Open3D tutorial](https://www.open3d.org/docs/release/tutorial/geometry/pointcloud.html) | none |
| 14 | DBSCAN label -1 means noise | verified | same | none |
| 15 | RANSAC samples at random, so runs can differ | verified | same | none (the page says sampling is random; it does not discuss reproducibility) |
| 16 | Cheese-line settings (2 mm, 3 mm, 8 mm, 35 mm) are labeled illustrative | verified | file text | none |
| 17 | Depalletizing pipeline uses the same building blocks | verified | [Open3D tutorial](https://www.open3d.org/docs/release/tutorial/geometry/pointcloud.html) | none |

### vendor-languages
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Switching brands is one reason plants standardize on one brand | unverifiable | none found | flagged `[unverified: industry practice, no source found]` |
| 2 | Joint, linear, circular moves, each with a blend or zone setting | verified | [ros_movesm.ls](https://raw.githubusercontent.com/ros-industrial/fanuc/noetic-devel/fanuc_driver/tpe/ros_movesm.ls) (CNT); [ROS_motion.mod](https://raw.githubusercontent.com/ros-industrial/abb_driver/melodic-devel/rapid/ROS_motion.mod) (z10, fine) | none |
| 3 | FANUC TP: the quoted line 22, which waits on flags and moves to a position register | verified | [ros_movesm.ls](https://raw.githubusercontent.com/ros-industrial/fanuc/noetic-devel/fanuc_driver/tpe/ros_movesm.ls) | none (line matches exactly) |
| 4 | KAREL loop reads joints with CURJPOS | verified | [ros_state.kl](https://raw.githubusercontent.com/ros-industrial/fanuc/noetic-devel/fanuc_driver/karel/ros_state.kl) | none |
| 5 | KAREL is "compiled" | unverifiable | none loadable (ROS wiki blocked; search quota out) | removed "compiled" |
| 6 | KAREL is Pascal-like | verified | [ros_state.kl](https://raw.githubusercontent.com/ros-industrial/fanuc/noetic-devel/fanuc_driver/karel/ros_state.kl) | none (PROGRAM/VAR/CONST/BEGIN/END syntax) |
| 7 | RAPID: modules and procedures; MoveAbsJ takes a target, speed, zone, tool | verified | [ROS_motion.mod](https://raw.githubusercontent.com/ros-industrial/abb_driver/melodic-devel/rapid/ROS_motion.mod) | none |
| 8 | KRL: PTP with axis angles, then RSI corrections | verified | [ros_rsi.src](https://raw.githubusercontent.com/ros-industrial/kuka_experimental/melodic-devel/kuka_rsi_hw_interface/krl/KR_C4/ros_rsi.src) | none |
| 9 | INFORM .JBI jobs with DOUT, WAIT, TIMER | verified | [ROS_R1.JBI](https://raw.githubusercontent.com/ros-industrial/motoman/noetic-devel/motoman_driver/Inform/DX100/single_arm_with_ext_axis/ROS_R1.JBI) | none |
| 10 | INFORM has MOVJ and MOVL for motion | verified | [YRC1000 INFORM Language](https://knowledge.motoman.com/hc/en-us/articles/4407425435927-YRC1000-INFORM-LANGUAGE) | flag removed; cited new source [8] |
| 11 | URScript is Python-like | verified | [external_control.urscript](https://raw.githubusercontent.com/UniversalRobots/Universal_Robots_Client_Library/master/resources/external_control.urscript); [UR Script Manual 3.5.4](https://tools.pages.cba.mit.edu/Universal_Robotics_UR10_Robot_Arm/scriptManual-3.5.4.pdf) (university mirror, secondary hosting) | none (def/if/elif/while with colons, closed by `end`) |
| 12 | URScript movej, movel, servoj; servoj streams a target every control step | verified | [external_control.urscript](https://raw.githubusercontent.com/UniversalRobots/Universal_Robots_Client_Library/master/resources/external_control.urscript) | none (`servoj(q, t=steptime)`; `movel(q)` at line 1040) |
| 13 | SPEL+ is BASIC-like | verified | [Epson: The SPEL+ Language](https://download.epson.biz/robots/ww/data/html/UsersGuide/en/070/070-010/070-010-010.html) | flag removed; cited new source [9] |
| 14 | SPEL+ Go, Move, and Jump (an arch motion made for pick and place) | verified | [Epson command summary](https://download.epson.biz/robots/ww/data/html/SPEL/en/020/020-010/020-010-010.html); [Epson Jump](https://download.epson.biz/robots/ww/data/html/SPEL/en/030/030-140/030-140-010/030-140-010-220.html) | flag removed; added that Jump is for SCARA robots (6-axis arms use Jump3); cited new [10][11] |
| 15 | ABB RAPID loop waits 0.05 s between checks for a new trajectory | verified | [ROS_motion.mod](https://raw.githubusercontent.com/ros-industrial/abb_driver/melodic-devel/rapid/ROS_motion.mod) | none |
| 16 | UR's client library runs URScript that streams servoj | verified | [external_control.urscript](https://raw.githubusercontent.com/UniversalRobots/Universal_Robots_Client_Library/master/resources/external_control.urscript) | none |
| 17 | FANUC documents its ROS 2 driver alongside ROBOGUIDE | verified | [FANUC driver docs](https://fanuc-corporation.github.io/fanuc_driver_doc/main/index.html) | none |
| 18 | A new car model means re-teaching, "which is one reason a line stays with one brand" | unverifiable | none found | removed the brand clause (it repeats row 1) |
| 19 | A new car model means re-teaching or offline programming in the vendor simulator | unverifiable | none found (search quota out) | kept flagged |
| 20 | ABB agreed in 2025 to sell its robotics division to SoftBank (status unknown) | corrected | [SoftBank press release](https://group.softbank/en/news/press/20251008); [Robotics 24/7](https://www.robotics247.com/article/softbanks-proposed-5.4b-acquisition-of-abb-robotics-blocked-by-china) (secondary) | flag removed; now: agreed October 2025 for USD 5.375 billion; as of early November 2026 the deal had not closed, and China had prohibited the purchase of the China operations; new sources [12][13]. ABB's own update page (abb.com/news/140154) timed out |
| 21 | FANUC driver has a documented 1 kHz mode | verified | [FANUC driver docs](https://fanuc-corporation.github.io/fanuc_driver_doc/main/index.html) | none |
| 22 | Code sketch REAL lines (TP, KAREL, RAPID, KRL, INFORM, URScript) are copied from the driver files | verified | sources [1]-[6] | none (every quoted line found verbatim) |
| 23 | Code sketch illustrative lines | unverifiable | vendor manuals not opened | kept flagged; Epson `Jump P1` matches the manual's syntax `Jump destination [...]` |

### plc-programming
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | IEC 61131-3 first published in 1993 | verified | [AFNOR: IEC 61131-3:1993](https://www.boutique.afnor.org/en-gb/standard/iec-6113131993/programmable-controllers-part-3-programming-languages/xs102769/433866) | cited new source [9] (March 1993; Wikipedia says December 1993; the text gives only the year) |
| 2 | Fourth edition published May 2025 | verified | [IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533) | cited new source [7] (edition 4.0, 2025-05-22) |
| 3 | The standard "defines four languages" | corrected | [IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533) | the scope defines ST, LD, and FBD plus SFC elements for structuring programs; reworded to "three languages ... plus SFC elements ... usually counted as a fourth language" |
| 4 | LD looks like relay diagrams, so the same people could maintain it | verified | [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 5 | ST is a Pascal-like text language | verified | [Wikipedia: Structured text](https://en.wikipedia.org/wiki/Structured_text) (secondary) | none |
| 6 | SFC can run branches in parallel | verified | [Wikipedia: SFC](https://en.wikipedia.org/wiki/Sequential_function_chart) (secondary) | none |
| 7 | Instruction List was a language in the 2013 edition | verified | [IEC 61131-3:2013](https://webstore.iec.ch/en/publication/4552) | cited new source [8] |
| 8 | IL was deprecated in 2013 | verified | [Wikipedia: IEC 61131-3](https://en.wikipedia.org/wiki/IEC_61131-3) (secondary, unsourced there) | none; the 2013 preview's foreword does not list deprecations and Annex B was not visible |
| 9 | IL was removed in 2025 | verified | [IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533); IEC preview (scope and contents list only ST under textual languages) | reworded to "gone from the 2025 edition, whose only text language is ST" |
| 10 | POUs: functions, function blocks, programs | verified | [Wikipedia: IEC 61131-3](https://en.wikipedia.org/wiki/IEC_61131-3) (secondary) | none |
| 11 | The third edition added object-oriented features | verified | [IEC 61131-3:2013](https://webstore.iec.ch/en/publication/4552) | citation moved from Wikipedia to [8]; named "classes and object-oriented function blocks" |
| 12 | Scan cycle: read inputs, execute, write outputs | verified | [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 13 | A scan takes "on the order of tens of milliseconds" | corrected | [Beckhoff Infosys](https://infosys.beckhoff.com/content/1033/tf8020_bacnetrev14/14456740235.html); [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | range added: about 10 ms (TwinCAT's default PLC task cycle) to tens of milliseconds, depending on program size, CPU, and configured task time; Precise and Key numbers both updated |
| 14 | A PLC is a hard real-time system | verified | [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 15 | TIA Portal's STEP 7 configures, programs, and diagnoses SIMATIC controllers | verified | [Siemens TIA Portal](https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html) | none |
| 16 | TwinCAT 3: PC real-time control, IEC 61131-3 plus C/C++ and MATLAB/Simulink, Visual Studio, own runtime | verified | [Beckhoff TwinCAT](https://www.beckhoff.com/en-us/products/automation/twincat/) | none |
| 17 | PLCopen: XML exchange format and motion control function blocks | verified | [PLCopen](https://plcopen.org/iec-61131-3) | none |
| 18 | PLCs replaced relay panels in car plants in the late 1960s | verified | [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 19 | Ladder's fixed execution order makes timing problems easier to spot | verified | same (secondary) | none |
| 20 | CODESYS offers object-oriented programming as an option | verified | [ABB Automation Builder help: CODESYS](https://help.plc.abb.com/_cds_development_system.html) | citation changed from a Wikipedia external link to new source [10] ("Object-orientation is not a must") |
| 21 | Studio 5000 Logix Designer programs ControlLogix and CompactLogix | verified | [MathWorks listing](https://es.mathworks.com/products/connections/product_detail/rslogix-5000.html) (secondary) | flag removed; cited new source [12]; rockwellautomation.com returned 403 |
| 22 | Airport baggage logic recirculates a missed bag instead of stopping | unverifiable | none (search quota out) | kept flagged |
| 23 | Ladder is "one of the four languages" in the 2025 edition | corrected | [IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533) | changed to "one of the languages defined in the 2025 edition", cited [7] |
| 24 | 18 s tray spacing sets the 15 s timeout | verified | arithmetic | none; labeled as arithmetic |
