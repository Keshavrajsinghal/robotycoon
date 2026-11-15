# Concept registry

Every concept has a stable id. Cross-references (`[[id]]`), `requires:` lines, and the
simulation content all use these ids. The generator (`tools/build-content.mjs`) reads this
file to validate references even when only one knowledge file exists yet.

Rules: ids are lowercase kebab-case and globally unique. A writer may add a concept to their
own area by adding a line here under their file; never rename or remove an existing id.

## 01-robot-bodies.md
- `dof` — Degrees of freedom
- `payload` — Payload
- `reach` — Reach and workspace
- `repeatability` — Repeatability and accuracy
- `speed-specs` — Speed, acceleration, and cycle specs
- `six-axis` — 6-axis articulated arm
- `scara` — SCARA robot
- `delta` — Delta robot
- `gantry` — Gantry (Cartesian) robot
- `cobot` — Collaborative robot (cobot)
- `mobile-robot` — Mobile robots and mobile manipulators
- `humanoid` — Humanoid robots

## 02-inside-a-joint.md
- `joint-stack` — The joint as a stack of parts
- `servo-motor` — Electric servo motor
- `gearbox` — Gearbox (reducer) types
- `encoder` — Encoder
- `brake` — Holding brake
- `servo-drive` — Servo drive
- `torque-sensing` — Joint torque sensing
- `pneumatic-actuation` — Pneumatic actuation
- `hydraulic-actuation` — Hydraulic actuation

## 03-end-effectors.md
- `end-effector` — End effector and tool center point
- `vacuum-gripper` — Vacuum gripper
- `soft-gripper` — Soft gripper
- `rigid-gripper` — Rigid finger gripper
- `tool-changer` — Tool changer
- `ft-sensor` — Force-torque sensor

## 04-sensors.md
- `camera-2d` — 2D industrial camera
- `depth-camera` — Depth camera
- `lidar` — Lidar
- `photo-eye` — Photo-eyes and proximity sensors
- `imu` — IMU
- `camera-calibration` — Camera calibration
- `hand-eye-calibration` — Camera-to-robot (hand-eye) calibration

## 05-compute-electronics.md
- `robot-controller` — Robot controller
- `onboard-compute` — Onboard computer and GPU
- `plc` — PLC
- `industrial-network` — Industrial networks
- `safety-circuit` — Safety circuits
- `estop` — Emergency stop

## 06-cell-and-line.md
- `conveyor` — Conveyor
- `feeder` — Feeders and denesters
- `inspection` — Inspection and reject
- `packaging-machines` — Lidding and outfeed machines
- `guarding` — Guarding and presence sensing
- `hmi` — HMI
- `cycle-time` — Cycle time, takt time, and throughput
- `line-balancing` — Line balancing and bottlenecks
- `oee` — OEE
- `ip-rating` — IP ratings and washdown
- `hygienic-design` — Hygienic and food-safe design
- `safety-standards` — The main safety standards

## 07-classical-software.md
- `frames` — Coordinate frames and transforms
- `forward-kinematics` — Forward kinematics
- `inverse-kinematics` — Inverse kinematics
- `motion-planning` — Motion planning
- `trajectory-generation` — Trajectory generation
- `collision-checking` — Collision checking
- `control-loops` — Control loops
- `conveyor-tracking` — Conveyor tracking
- `state-machines` — State machines and behavior trees
- `perception` — Perception
- `grasp-planning` — Grasp planning
- `ros2` — ROS 2
- `moveit` — MoveIt
- `opencv` — OpenCV and point cloud libraries
- `vendor-languages` — Vendor robot languages
- `plc-programming` — PLC programming

## 08-robot-learning.md
- `learned-policy` — Learned policies and what they replace
- `imitation-learning` — Imitation learning
- `reinforcement-learning` — Reinforcement learning
- `simulators` — Simulators
- `sim-to-real` — Sim-to-real transfer
- `vla-models` — Vision-language-action models
- `robot-datasets` — Robot datasets and data collection
- `policy-evaluation` — Evaluating policies
- `on-robot-inference` — On-robot inference

## 09-teleoperation.md
- `teleop-modes` — Remote assist versus direct control
- `operator-interfaces` — Operator interfaces
- `latency-budget` — The latency budget
- `video-pipeline` — Video capture and encoding
- `webrtc` — WebRTC
- `udp-vs-tcp` — UDP versus TCP
- `network-impairments` — Jitter, packet loss, and bandwidth
- `watchdogs` — Watchdogs and safe failure

## 10-platform.md
- `fleet-management` — Fleet management
- `telemetry-logs` — Telemetry and log formats
- `visualization-tools` — Visualization tools
- `remote-updates` — Remote updates and model rollout
- `data-pipelines` — Data pipelines

## 11-deployment-lifecycle.md
- `scoping` — Scoping and ROI
- `cell-design` — Cell design and simulation
- `purchasing` — Purchasing
- `acceptance-tests` — Acceptance tests (FAT and SAT)
- `commissioning` — Commissioning and ramp-up
- `support` — Support and maintenance
- `raas` — Buying a robot versus paying per use

## 12-industry-map.md
- `value-chain` — Who buys from whom
- `component-makers` — Component makers
- `robot-makers` — Robot makers
- `integrators` — System integrators
- `application-companies` — Application companies
- `model-companies` — Robot model companies
- `tooling-companies` — Tooling and software companies
- `end-users` — End users: the plants that run robots
