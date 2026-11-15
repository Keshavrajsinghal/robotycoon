# Glossary

## A
- **A/B update** — An update method that writes new software onto a second, inactive copy of the system disk and switches to it, so the old copy is still there to fall back to. See [[remote-updates]].
- **Absolute encoder** — A position sensor that gives a unique reading for each angle, so it knows the joint angle at power-up without moving. See [[encoder]].
- **Accuracy** — How close a robot lands to a point it has only been given as numbers, for example from a drawing or a camera. Robots are usually much better at repeatability than at accuracy. See [[repeatability]].
- **ACM (allowed collision matrix)** — A table of pairs of parts whose contact the collision checker ignores, such as neighboring links or a suction cup and the item it holds. See [[collision-checking]].
- **ACT (Action Chunking with Transformers)** — A learned-policy design from the ALOHA project that predicts a short run of future joint positions at once instead of one step at a time. See [[imitation-learning]].
- **Action chunk** — A short list of future targets that a learned policy outputs in one go, for example 50 steps covering one second. See [[learned-policy]].
- **Adept cycle** — A standard test move for comparing robot speed: up 25 mm, across 305 mm, down 25 mm, and back, with a stated load. Real tasks are usually slower. See [[speed-specs]].
- **AGV (automated guided vehicle)** — A driverless cart that follows a fixed route marked by tape, wires, or reflectors, and stops when something blocks it. See [[mobile-robot]].
- **AMR (autonomous mobile robot)** — A driverless robot that builds a map, works out where it is from its own sensors, and plans its own route around obstacles. See [[mobile-robot]].
- **Andon** — A shared signal board for a whole line, where a worker pulls a cord or presses a button to show that a station needs help. See [[hmi]].
- **Arcminute (arcmin)** — One sixtieth of a degree. Gearbox play and twist are measured in it. See [[gearbox]].
- **AV1** — A newer, royalty-free video compression standard. How much smaller it makes video than older standards varies a lot from test to test. See [[video-pipeline]].

## B
- **B-frame** — A compressed video frame that refers to a later frame as well as earlier ones, so the encoder must wait for that later frame, which adds delay. See [[video-pipeline]].
- **Backlash** — Free play in a gearbox: how far the output can turn while the input is held still, before the teeth touch. See [[gearbox]].
- **Behavior cloning** — Training a policy to copy a person: for each recorded moment, the right answer is the action the person took. See [[imitation-learning]].
- **Behavior tree (BT)** — A way to sequence robot tasks as a tree of small steps, where each parent decides which children to run, re-checked from the top many times a second. See [[state-machines]].
- **Belt encoder** — A sensor on a conveyor roller or motor that gives a count for every small step of belt travel, so the robot knows how far the belt has moved. See [[conveyor-tracking]].
- **Blend (zone)** — A robot program setting for how close the tool passes a point before rounding the corner instead of stopping on it. See [[vendor-languages]].
- **Bottleneck** — The step whose limited capacity caps the output of the whole line; also called the constraint. See [[line-balancing]].
- **Brake (holding brake)** — A brake in a robot joint that clamps whenever power is removed, so a power cut, broken cable, or emergency stop leaves the arm held in place. See [[brake]].

## C
- **C-space (configuration space)** — The space of every possible combination of joint values, with one dimension per joint. Motion planners search it for collision-free paths. See [[motion-planning]].
- **Canary** — A partial, time-limited release of new software to a small slice of the fleet, compared against the rest. See [[remote-updates]].
- **Capex (capital expenditure)** — Money spent buying a long-lived asset such as a robot cell. It goes on the balance sheet and is counted as a cost gradually over the asset's useful life. See [[purchasing]].
- **Cascaded control** — Nested feedback loops: a position loop feeds a speed loop, which feeds a current loop, each inner loop much faster than the one around it. See [[control-loops]].
- **CBR (constant bitrate)** — A video encoder setting that holds the data rate steady so the network is not hit by bursts. See [[video-pipeline]].
- **CMMS (computerized maintenance management system)** — Software that tracks work orders for equipment, such as repairs and scheduled servicing. See [[acceptance-tests]].
- **Cobot (collaborative robot)** — A robot arm designed to work in a space shared with people, usually by sensing contact and capping its speed and force. See [[cobot]].
- **Cold and hot commissioning** — Cold commissioning tests a new cell's axes, safety functions, and signals with no product running; hot commissioning then runs real product, tunes settings, and does performance runs. See [[commissioning]].
- **Compounding error** — In imitation learning, a small mistake leads the robot into a situation the demonstrations never showed, where it makes a bigger mistake and drifts further off. See [[imitation-learning]].
- **Congestion control** — Estimating how fast a network path can carry data and sending no faster. See [[webrtc]].
- **Contactor** — A heavy-duty relay (an electrically worked switch) that turns motor power on and off. See [[safety-circuit]].
- **Cycle time** — The measured time one station takes to finish one unit. See [[cycle-time]].
- **Cycloidal (RV) reducer** — A gearbox in which lobed discs roll around a ring of pins, so each input turn moves the output only a little. Used where heavy arms must hold loads steady. See [[gearbox]].

## D
- **DAgger (dataset aggregation)** — A fix for compounding error: run the learned policy, have an expert label the situations it actually reaches, add those to the training data, and retrain. See [[imitation-learning]].
- **Damped least squares** — A way of solving inverse kinematics step by step that gives up a little accuracy per step so it never makes huge joint jumps near awkward poses. See [[inverse-kinematics]].
- **DDS (Data Distribution Service)** — An industrial messaging standard, used by default in ROS 2, in which programs post messages to named channels and every program signed up to a channel receives them. See [[ros2]].
- **Dead-man switch** — A control that allows motion only while a person holds it, so letting go stops the robot. See [[watchdogs]].
- **Degrees of freedom (DoF)** — The number of independent motions you must set to say exactly where every part of a robot is. Six are needed to place a tool anywhere and point it any way. See [[dof]].
- **Delta robot** — A fast robot hung from a frame above a belt, with three or four light arms driven from the top that move a small gripper below. See [[delta]].
- **Denester** — A machine that holds a stack of trays or lids and releases one at a time onto the line when asked. See [[feeder]].
- **Depth camera** — A camera that measures distance at each pixel, giving a depth image or a point cloud. See [[depth-camera]].
- **DH parameters (Denavit-Hartenberg)** — A convention that describes each link of a robot arm with four numbers, so the arm's geometry can be written down and computed. See [[forward-kinematics]].
- **Diffusion policy** — A learned policy that makes actions by starting from random noise and refining it over several steps into a smooth run of motion. See [[imitation-learning]].
- **Direct control** — Teleoperation in which the operator's device streams motion targets many times a second and the robot follows them, so every bit of delay matters. See [[teleop-modes]].
- **Domain randomization** — Changing a simulator's settings at random in every episode, so the policy learns to cope with a whole range and treats reality as one more variation. See [[sim-to-real]].
- **Dual-channel wiring** — Running a safety signal as two independent circuits that are checked against each other. Any disagreement is treated as a fault, and the machine stops. See [[safety-circuit]].

## E
- **E-stop (emergency stop)** — A red mushroom-head button that stops dangerous motion when pressed and stays latched until someone deliberately releases it. See [[estop]].
- **EHEDG** — A European group that publishes hygienic design guidelines for food equipment and certifies equipment against them. See [[hygienic-design]].
- **Enabling switch** — A three-position grip switch on a teach pendant that allows motion only while held in the middle; letting go or squeezing hard stops the robot. See [[robot-controller]].
- **Encoder** — A sensor that measures how far a shaft has turned, used to know each joint's angle. See [[encoder]].
- **End effector (EOAT)** — Whatever is mounted on the end of the arm to do the work, such as a gripper or suction cup; also called end-of-arm tooling. See [[end-effector]].
- **Episode** — One attempt at a task, start to finish, recorded with every sensor stream and action. See [[robot-datasets]].
- **EtherCAT** — A fast industrial Ethernet network in which one data message passes through every device in turn, each reading and adding its data on the fly. See [[industrial-network]].
- **EtherNet/IP** — An industrial network that carries the Common Industrial Protocol (a shared vocabulary of device types and messages) over ordinary Ethernet. See [[industrial-network]].
- **Euler angles** — Describing which way something faces as three rotations in a row about named axes, such as roll, pitch, and yaw. Easy to read, but awkward to blend smoothly. See [[frames]].

## F
- **F/T sensor (force-torque sensor)** — A sensor, usually at the wrist, that measures pushes along and twists about three axes: six numbers in all. See [[ft-sensor]].
- **Fail-safe** — Designed so that losing power leaves the system in its safe state, like a brake that clamps when power is removed. See [[brake]].
- **FAT (factory acceptance test)** — A test at the builder's shop where the customer watches the system run against agreed criteria before it ships. See [[acceptance-tests]].
- **FEC (forward error correction)** — Sending extra recovery data up front so the receiver can rebuild a lost packet without asking for it again. See [[network-impairments]].
- **Feedforward** — Adding the command you already know you will need from the planned motion, instead of waiting for an error to appear. It cannot make the loop oscillate. See [[control-loops]].
- **Fieldbus** — A network that links controllers with drives, sensors, and other devices so data arrives on a fixed, predictable schedule. See [[industrial-network]].
- **Flow matching** — A method that starts from random noise and refines it over a handful of steps into a smooth run of actions; used in some VLA models. See [[vla-models]].
- **FOC (field-oriented control)** — Math in a servo drive that turns the motor's three changing currents into two steady values, so two simple controllers can set the motor's push precisely. See [[servo-drive]].
- **Forward kinematics (FK)** — Working out where the tool is in space from the joint angles. See [[forward-kinematics]].
- **Foundation model** — A large neural network trained on broad data and then adapted to specific uses. See [[model-companies]].
- **Frame (coordinate frame)** — An origin point plus three perpendicular axes, used to say where things are. The robot base, camera, tool, and each tray can have their own. See [[frames]].
- **FSM (finite state machine)** — A program that is always in exactly one of a fixed list of states and moves to another only along a defined arrow when that arrow's condition becomes true. See [[state-machines]].

## G
- **Gantry robot** — A robot built from a frame of straight rails with sliding carriages that move its tool in straight lines, like an arcade claw machine; also called a Cartesian robot. See [[gantry]].
- **Gear ratio** — How many times the motor turns for each turn of the joint. See [[gearbox]].
- **Glass-to-glass latency** — The time from light from an event entering the camera lens to the matching image leaving the display screen. See [[latency-budget]].
- **Global shutter and rolling shutter** — A global shutter sensor captures all pixels at the same moment; a rolling shutter captures rows one after another, which distorts fast-moving objects but usually has lower noise. See [[camera-2d]].
- **GOP (group of pictures)** — The run of video frames from one complete picture (I-frame) to the next. See [[video-pipeline]].
- **GPU (graphics processing unit)** — A chip with thousands of small cores that do the same arithmetic on many numbers at once, which is what neural networks need. See [[onboard-compute]].

## H
- **H.264 (AVC)** — A common video compression standard that every WebRTC browser must support. See [[video-pipeline]].
- **H.265 (HEVC)** — A video compression standard that makes video roughly 25-50% smaller than H.264 at the same quality. See [[video-pipeline]].
- **Hand-eye calibration** — Measuring exactly where a camera sits relative to the robot, so a position seen in an image can become a robot target. See [[hand-eye-calibration]].
- **Head-of-line blocking** — When one missing piece of data holds up everything behind it until it is resent, as happens in TCP. See [[udp-vs-tcp]].
- **Heartbeat** — A small message sent on a timer that means "still alive". If it stops arriving, the receiver acts. See [[watchdogs]].
- **HMI (human-machine interface)** — The screen and buttons that let a person see what a machine is doing and start, stop, or switch it. See [[hmi]].
- **Homing** — Moving a robot to a reference mark after power-up so a sensor that only counts movement can learn where it is. See [[encoder]].
- **Homogeneous transform** — A 4x4 table of numbers that holds both a rotation and a shift, so one multiplication moves a point from one frame into another. See [[frames]].

## I
- **I-frame and P-frame** — Two kinds of compressed video frame: an I-frame holds a complete picture and is large; a P-frame stores only the differences from earlier frames and is small. See [[video-pipeline]].
- **I/O (inputs and outputs)** — The on/off signals and continuous readings a controller reads from sensors and switches, and sends to motors, valves, and lamps. See [[plc]].
- **ICE (Interactive Connectivity Establishment)** — The procedure WebRTC uses to find a working network path between two devices that each sit behind a router sharing one public address. See [[webrtc]].
- **IMU (inertial measurement unit)** — A small sensor that measures acceleration and turning rate. Adding these up over time gives tilt and motion, which slowly drifts off unless corrected. See [[imu]].
- **Incremental encoder** — A position sensor that only gives pulses as the shaft moves, so after power-up the robot must move to a reference mark to learn where it is. See [[encoder]].
- **Industrial PC (IPC)** — A PC built for factory cabinets rather than offices. See [[onboard-compute]].
- **Integrator (system integrator)** — A company that designs, builds, and installs a working robot cell from parts made by others. See [[integrators]].
- **Interlock** — A switch on a guard door that tells the safety circuit to stop the robot when the door opens. See [[guarding]].
- **Interpolation cycle** — The fixed beat at which a robot controller sends a fresh position target to every joint. See [[robot-controller]].
- **Intra refresh** — A video setting that repairs one stripe of the picture each frame instead of sending large complete pictures now and then, keeping the data flow smooth. See [[video-pipeline]].
- **Inverse kinematics (IK)** — Working out the joint angles that put the tool at a target position and angle. There may be several answers, or none. See [[inverse-kinematics]].
- **IO-Link** — A cable link from one controller port to one sensor or actuator that carries detailed readings as well as the basic on/off signal. See [[industrial-network]].
- **IP code (IP rating)** — A two-digit rating of how well a device keeps out solids (first digit) and water (second digit). See [[ip-rating]].
- **IP67** — Dust-tight and able to survive 30 minutes under 1 m of water. It is an immersion test, not a spray test. See [[ip-rating]].
- **IP69K** — A rating, from road-vehicle standards, for surviving close-range jets of hot, high-pressure water; its water test matches IPX9. See [[ip-rating]].
- **ISO 10218** — The international safety standard for industrial robots: part 1 covers the robot itself, part 2 covers building it into a cell. See [[safety-standards]].
- **ISO/TS 15066** — A technical specification for collaborative robots that set force and pressure limits for parts of the body; its content has been folded into ISO 10218:2025. See [[safety-standards]].
- **ISP (image signal processor)** — The chip stage that turns raw sensor values into a color image by filling in colors, balancing white, and reducing noise. See [[video-pipeline]].

## J
- **Jacobian** — A table with one column per joint that says how far and which way the tool moves for a small move of each joint. See [[inverse-kinematics]].
- **Jerk** — How quickly acceleration changes. Sudden jerk shakes the arm and its load. See [[trajectory-generation]].
- **Jitter** — Variation in delay from one packet, or one cycle, to the next. See [[network-impairments]].
- **Jitter buffer** — A short holding queue at the receiver that releases video frames on a steady schedule. Bigger means fewer stutters but more delay. See [[network-impairments]].
- **Joint move and linear move** — In a joint move every joint travels at once, which is fastest but makes the tool's path curved and hard to predict; in a linear move the tool's working point travels in a straight line. See [[vendor-languages]].
- **Joint space and Cartesian space** — Two ways to describe where a robot is: as a list of joint angles, or as positions and orientations in the room. See [[forward-kinematics]].

## K
- **Kinematic chain** — A model of an arm as rigid links connected one after another by joints. See [[forward-kinematics]].

## L
- **Ladder Diagram (LD)** — A graphical PLC language of rungs of contacts and coils that look like the relay wiring diagrams PLCs replaced. See [[plc-programming]].
- **Latch (encoder latch)** — Hardware that stores a counter's value at the instant an input switches, so software delays do not affect the reading. See [[conveyor-tracking]].
- **Lead time** — On a line, how long one unit takes from entering to leaving. In purchasing, the time from order to delivery. See [[cycle-time]].
- **Leader arm** — A smaller arm with the same joint layout as the robot, which an operator moves by hand while the robot copies it. See [[operator-interfaces]].
- **Lidar** — A sensor that measures distance by timing short laser pulses while sweeping the beam, producing a map of dots around it. See [[lidar]].
- **Light curtain** — A transmitter and receiver pair whose infrared beams send a stop signal when something breaks them. See [[guarding]].
- **Little's law** — The average number of items in a system equals throughput times the average time each spends in it, for any stable system. See [[cycle-time]].
- **LTS (long-term support)** — A software release that is maintained for years, so production systems can stay on it. See [[ros2]].

## M
- **MAP (modified atmosphere packaging)** — Replacing the air in a pack with a gas mix before sealing, to slow spoilage. See [[packaging-machines]].
- **MCAP** — An open file format for timestamped robot messages, and the default format for ROS 2 recordings. See [[telemetry-logs]].
- **MES (manufacturing execution system)** — Plant software that tracks orders and production. See [[commissioning]].
- **Modbus TCP** — An old, simple industrial protocol in which a controller asks each device for its values in turn. It has no built-in security. See [[industrial-network]].
- **MoveIt** — Free ROS software that works out how an arm should move without hitting anything, then hands the motion to the arm. See [[moveit]].
- **MQTT** — A lightweight messaging protocol in which devices post messages to named channels on a server and every device signed up to a channel receives them; used for example by VDA 5050. See [[fleet-management]].
- **MuJoCo** — Google DeepMind's open-source physics engine, widely used to train robot policies in simulation. See [[simulators]].
- **Muting** — Switching off a presence sensor for part of the cycle so product can pass through a light curtain without stopping the line. See [[guarding]].

## N
- **Nagle's algorithm** — A TCP feature that holds back small writes to combine them, which adds delay; applications can turn it off. See [[udp-vs-tcp]].
- **NAT (network address translation)** — A router feature that shares one public address among many devices and blocks incoming traffic nobody asked for. See [[webrtc]].
- **Node (ROS 2)** — One program, or part of one, that does a single job in a ROS 2 system and exchanges messages with the others. See [[ros2]].
- **Normally closed** — Wired so current flows until the button is pressed, so a broken wire also triggers the stop. See [[estop]].

## O
- **OEE (overall equipment effectiveness)** — A single score for how well equipment is used: availability times performance times quality. See [[oee]].
- **Offline programming** — Writing the robot program on a PC instead of teaching it on the real robot. See [[cell-design]].
- **On-policy and off-policy** — On-policy reinforcement learning learns only from attempts made by the current version of the policy and then throws them away; off-policy methods keep and reuse every past attempt. See [[reinforcement-learning]].
- **OPC UA** — A secure, platform-independent way to publish structured machine data, using digital identity certificates. See [[industrial-network]].
- **Open weights** — Publishing a trained model's files so others can run it or train it further. See [[model-companies]].
- **Open-loop** — Carrying out commands without checking sensors along the way, such as playing a whole action chunk without looking at new camera images. See [[on-robot-inference]].
- **OpenCV** — A widely used free library of ready-made routines for working with camera images and camera geometry. See [[opencv]].
- **Opex (operating expense)** — A recurring cost, like rent, counted in the period it is paid. See [[purchasing]].
- **OTA update (over-the-air update)** — Sending new software to a robot over the network instead of installing it by hand. See [[remote-updates]].

## P
- **Payback period** — Installed cost divided by yearly net savings: the number of years until a project has earned its money back. See [[scoping]].
- **Payload** — The mass a robot can carry at its mounting plate, counting the gripper as well as the item. See [[payload]].
- **Performance level (PL)** — A rating from a to e of how unlikely a safety function is to fail dangerously, defined in ISO 13849-1. See [[safety-circuit]].
- **PFL (power and force limiting)** — A cobot feature that senses contact and caps speed and force so a collision stays below injury limits. See [[cobot]].
- **Photo-eye** — A sensor with a light emitter and receiver that reports "something is here" when an object blocks the beam or bounces it back. See [[photo-eye]].
- **PID controller** — A feedback rule that sets its command from the error now (P, which pushes back harder the bigger the error), the error added up over time (I, which removes steady offsets), and how fast the error is changing (D, which damps motion but amplifies sensor noise). See [[control-loops]].
- **PLC (programmable logic controller)** — A rugged industrial computer that runs a machine or line by reading sensors, running its logic, and switching outputs, over and over. See [[plc]].
- **PMSM (permanent-magnet synchronous motor)** — The brushless motor in most robot joints: magnets on the spinning part, copper windings in the stationary outer part, so nothing rubs to carry current. See [[servo-motor]].
- **Point cloud** — A list of 3D points, each an x, y, z position, sometimes with color. See [[depth-camera]].
- **Pose** — Position plus orientation. A 6D pose is three numbers for where something is and three for which way it faces. See [[frames]].
- **PPO (Proximal Policy Optimization)** — A common reinforcement learning method in simulation that collects a batch of attempts, then makes several small, careful updates from it. See [[reinforcement-learning]].
- **PREEMPT_RT** — The real-time setting of Linux, which lets a high-priority task interrupt nearly anything, so it starts with a shorter, more predictable delay. See [[onboard-compute]].
- **Preventive and predictive maintenance** — Preventive maintenance services parts on a schedule before they fail; predictive maintenance services them when logged data, such as motor and joint readings, shows they are wearing. See [[support]].
- **Process image** — A snapshot of every input that a PLC takes at the start of each scan, so its logic sees one consistent moment. See [[plc]].
- **PROFINET** — A major industrial Ethernet network, with a basic class that runs over ordinary network switches and a faster class that reserves network capacity and keeps device clocks in step. See [[industrial-network]].
- **Proprioception** — A robot's sense of its own body, such as joint angles read from its encoders. See [[learned-policy]].
- **Punch list** — A list of open defects to fix before a system is accepted. See [[acceptance-tests]].
- **PWM (pulse-width modulation)** — Switching a voltage on and off thousands of times a second and varying the on-time to set the average voltage. See [[servo-drive]].

## Q
- **QoS (quality of service)** — In ROS 2, the delivery rules for each sender and receiver, such as whether lost messages are retried. Mismatched rules silently block delivery. See [[ros2]].
- **Quantization** — Storing a neural network's numbers with fewer bits so it runs faster on the robot's computer. See [[on-robot-inference]].
- **Quaternion** — Four numbers that encode a rotation axis and angle. Unlike Euler angles it has no trouble spots and blends smoothly between orientations. See [[frames]].
- **QUIC** — A newer way of sending data over the internet, built on UDP, with several independent streams per connection so one lost piece does not hold up the others. See [[udp-vs-tcp]].

## R
- **Ra (surface roughness)** — The average height of a surface's microscopic bumps. Food-contact surfaces must stay under a set maximum. See [[hygienic-design]].
- **RaaS (robots as a service)** — Paying a recurring fee that covers the robot, software, updates, and support instead of buying the robot outright. See [[raas]].
- **RANSAC** — A way to find a shape such as a flat surface in noisy 3D data: repeatedly fit it through a few random points and keep the fit that most points lie near. See [[opencv]].
- **Real-time** — Guaranteed to respond within a bounded delay. It means predictable timing, not more speed. See [[onboard-compute]].
- **Reality gap** — The systematic differences between a simulator and the real cell, which make policies trained in simulation stumble on real hardware. See [[sim-to-real]].
- **Reinforcement learning (RL)** — Improving a policy by trial and error against a numeric score. See [[reinforcement-learning]].
- **Remote assist** — A teleoperation style in which the robot runs on its own and, when unsure, asks a remote person a narrow question such as where to pick. See [[teleop-modes]].
- **Repeatability** — How tightly a robot's landings cluster when it is sent to the same taught point again and again. See [[repeatability]].
- **Reprojection error** — The distance in pixels between where a calibration corner was found in an image and where the camera model says it should be. See [[camera-calibration]].
- **Revolute joint** — A joint that rotates about one axis, like a hinge. A prismatic joint slides along one axis instead. See [[dof]].
- **Reward** — A number the engineer's code computes at every step of reinforcement learning to score how well the policy is doing. The total over an episode is called the return. See [[reinforcement-learning]].
- **RFQ (request for quotation)** — A request for binding prices on a clearly defined scope of work. When the buyer knows the problem but not the solution, an RFP (request for proposal) invites different approaches instead. See [[purchasing]].
- **ROI (return on investment)** — Net gain divided by cost. See [[scoping]].
- **Rollback** — Returning a robot to the last known-good software version when an update goes wrong. See [[remote-updates]].
- **ROS 2 (Robot Operating System 2)** — An open-source software framework in which robot programs run as nodes that exchange messages. See [[ros2]].
- **Rosbag** — The ROS recorder and its recordings, called bags, which save every message with timestamps for exact replay. See [[telemetry-logs]].
- **RRT (rapidly-exploring random tree)** — A motion planner that grows a tree of collision-free moves from the start toward random sample points until it can reach the goal. See [[motion-planning]].
- **RViz** — The standard ROS viewer, which shows the robot model, frames, camera images, and depth data live. See [[visualization-tools]].

## S
- **S-curve profile** — A motion profile that ramps acceleration up and down smoothly, trading a slightly longer move for much smoother motion. See [[trajectory-generation]].
- **Safe Torque Off (STO)** — A drive safety input that, when removed, stops the drive from powering the motor to push. The motor coasts; STO does not brake. See [[servo-drive]].
- **Safety PLC** — A PLC built for safety jobs that handles many safety functions in one programmable unit, with a restricted, safety-specific instruction set. See [[safety-circuit]].
- **Safety relay** — A fixed-function module, usually for one safety function, that checks two input channels and refuses to restart after a fault. See [[safety-circuit]].
- **SAT (site acceptance test)** — The agreed acceptance check repeated in the customer's plant after installation. See [[acceptance-tests]].
- **Scan cycle** — A PLC's endless loop: read all inputs, run the program, write all outputs, repeat. See [[plc]].
- **SCADA (supervisory control and data acquisition)** — The HMI idea scaled up to watch and steer many machines or a whole plant. See [[hmi]].
- **SCARA** — A four-axis arm that swings flat at the shoulder and elbow and has a shaft that moves up, down, and twists; built for fast pick-and-place from above. See [[scara]].
- **Sequence and Fallback** — Two kinds of behavior tree step: a Sequence runs its children left to right and stops at the first failure; a Fallback (also called a Selector) tries them left to right until one succeeds. See [[state-machines]].
- **Sequential Function Chart (SFC)** — A graphical PLC language of steps and transitions for sequences, which can run branches in parallel. See [[plc-programming]].
- **Servo drive** — The power electronics that feed current to a motor and run fast control loops so it follows its commands. See [[servo-drive]].
- **Shadow mode** — Running new software on live data next to the old version and logging what it would have done, without letting it move anything. See [[remote-updates]].
- **Shared autonomy** — Teleoperation in which the person's input and the robot's own decisions are blended continuously. See [[teleop-modes]].
- **SIL (safety integrity level)** — A rating of how reliably a safety function works, defined in IEC 61508 and applied to machinery by IEC 62061. See [[safety-circuit]].
- **Singularity** — An arm pose where the arm loses the ability to move in some direction, often because two joint axes line up. See [[inverse-kinematics]].
- **Six-axis arm** — An arm built like a human arm, with a swiveling waist, shoulder, elbow, and a wrist that bends and twists; the default factory robot arm. See [[six-axis]].
- **SLA (service level agreement)** — A contract with measurable promises, such as how fast someone responds, how soon a technician arrives, or a minimum uptime. See [[support]].
- **SRTP (Secure RTP)** — Encrypted, tamper-checked packets that carry live video and audio; every WebRTC system must use it. See [[webrtc]].
- **SS1 (safe stop 1)** — A controlled stop: slow the motor down under power, then apply Safe Torque Off. See [[servo-drive]].
- **Starved and blocked stations** — A starved station is idle because it is waiting for input from upstream; a blocked station is idle because the next station has no room for its output. See [[line-balancing]].
- **Stop category** — The three kinds of stop in IEC 60204-1: 0 cuts power at once, 1 brakes under power and then cuts it, 2 stops under power and keeps it on. See [[estop]].
- **Strain gauge** — A thin resistor whose resistance changes when it is stretched, used to measure force or torque. See [[torque-sensing]].
- **Strain wave gear (harmonic drive)** — A compact gear with almost no play, built around a thin steel cup that flexes on every turn. See [[gearbox]].
- **Structured light** — A depth-sensing method that projects a pattern onto the scene and measures how it bends over surfaces. See [[depth-camera]].
- **Structured Text (ST)** — A Pascal-like text language for PLCs, best for math, data, and step logic. See [[plc-programming]].
- **STUN** — A server that tells a device what public address it appears to have, so WebRTC can try a direct path. See [[webrtc]].
- **System identification** — Measuring the real robot and adjusting the simulator to match it. See [[sim-to-real]].

## T
- **Takt time** — Available production time divided by customer demand: the time budget per unit that the line must meet. See [[cycle-time]].
- **TCP (tool center point)** — The working point of the tool, such as the face of a suction cup, which the robot steers to its targets. See [[end-effector]].
- **TCP (Transmission Control Protocol)** — The internet protocol that delivers data reliably and in order, at the cost of waiting whenever a lost piece must be resent. See [[udp-vs-tcp]].
- **Teach pendant** — The handheld touchscreen used to jog and program a robot, with an emergency stop button and an enabling switch. See [[robot-controller]].
- **Telemetry** — Small numbers a robot sends on a timer, such as battery level or picks per minute. See [[telemetry-logs]].
- **Teleoperation** — A person controlling a robot from a distance. See [[teleop-modes]].
- **tf2** — The ROS 2 library that keeps a time-stamped tree of coordinate frames and answers where one frame was relative to another at a given moment. See [[ros2]].
- **Throughput** — Units produced per unit of time. In a line it is set by the slowest station. See [[cycle-time]].
- **Tick** — In a behavior tree, a signal sent from the top down the tree that asks each visited step to do a little work and report back. See [[state-machines]].
- **Time-of-flight (ToF)** — A depth-sensing method that times how long the camera's own light takes to come back. See [[depth-camera]].
- **Topic (ROS 2)** — A named channel for continuous, one-way message streams between ROS 2 programs. Short request-and-response calls use services instead. See [[ros2]].
- **TOPS** — Trillions of operations per second: a best-case speed figure for AI chips that does not compare directly across chips or with real models. See [[onboard-compute]].
- **TOTG (time-optimal trajectory generation)** — A method that finds the fastest timing along a given path within speed and acceleration limits; MoveIt's default. See [[trajectory-generation]].
- **Trajectory** — A path plus timing: position, speed, and acceleration for every joint at every control tick. See [[trajectory-generation]].
- **Trapezoidal profile** — A motion profile that speeds up at the limit, cruises at top speed, then slows down at the limit. See [[trajectory-generation]].
- **Traysealer** — A machine that lays plastic film over a filled tray, presses a heated tool onto the tray's rim, and cuts the film. See [[packaging-machines]].
- **TURN** — A server that forwards every packet between two devices when no direct path can be found. It is costly, so it is a last resort. See [[webrtc]].

## U
- **UDP (User Datagram Protocol)** — An internet protocol that sends independent packets with no ordering and no resending, so nothing waits for a lost one. See [[udp-vs-tcp]].
- **URDF (Unified Robot Description Format)** — A text file used across ROS that describes a robot's links, joints, shapes, and limits. See [[forward-kinematics]].
- **URS (user requirements specification)** — The buyer's document saying what the cell must do and under what conditions. See [[purchasing]].

## V
- **Vacuum generator** — The device that removes air for a suction cup, such as a pump or a nozzle that uses a jet of compressed air. See [[vacuum-gripper]].
- **VDA 5050** — An open standard for how fleet software sends jobs to mobile robots from different makers, using messages over MQTT. See [[fleet-management]].
- **Vertical integration** — One company covering several layers of the value chain itself. See [[value-chain]].
- **Virtual commissioning** — Connecting a cell simulation to the real PLC program so the control logic is tested before the hardware exists. See [[cell-design]].
- **Vision PC** — An industrial PC with a GPU, in the line's control cabinet, that runs perception and hands results to the robot controller. See [[onboard-compute]].
- **VLA (vision-language-action model)** — A model that takes camera images and a text instruction and outputs robot motions, usually built on a vision-language model. See [[vla-models]].
- **VLM (vision-language model)** — A large neural network trained in advance on web images and text so it can answer questions about pictures. See [[vla-models]].

## W
- **Watchdog** — A timer that triggers a safe action, such as a stop or a reset, when an expected signal stops arriving in time. See [[watchdogs]].
- **WebRTC** — A browser standard and set of protocols for live, low-delay video, audio, and data between two devices. See [[webrtc]].
- **WebTransport** — A browser interface that gives web pages QUIC's reliable streams and its unreliable, no-resend messages. See [[udp-vs-tcp]].
- **Wilson score interval** — A formula for the plausible range of a true success rate that behaves well with small numbers of trials. See [[policy-evaluation]].
- **Wind-up and anti-windup** — Wind-up is when a controller's built-up correction grows huge while motion is blocked, then makes the arm lurch when it is freed. Anti-windup limits or pauses that build-up while the motor is at its limit. See [[control-loops]].
- **Workspace (work envelope)** — The whole 3D region a robot can touch, often a thick shell with a hollow near the base. See [[reach]].
