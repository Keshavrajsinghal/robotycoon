---
area: 10
slug: platform
title: Platform
---

# Platform

This area covers the software around the robots rather than inside them: the services that watch a fleet, record what each robot sensed and did, show that data to engineers, push out new software and new models, and turn recordings into training data. If you have run a web platform, most of the shapes will look familiar. Three things change. The data is much bigger (cameras and depth sensors produce far more bytes than request logs). The network is worse (a robot on a factory floor may have a weak or intermittent link). And a bad deploy can move a metal arm, not just return an error page.

On the cheese plate line, this is the layer that tells the plant manager the cheese station has slowed down, keeps the last few minutes of camera and arm data when a grape bunch goes missing, lets an engineer replay that moment at a desk, tries a new grape-picking model alongside the old one before letting it drive the arm, and ships operators' corrections back to the training team. Ride 4 follows that loop: recording, cloud, training data, new model, fleet.

## Fleet management
id: fleet-management
requires: robot-controller, mobile-robot
aka: fleet manager, robot operations, RobOps, VDA 5050, Open-RMF

### Plain
Fleet management is the control room for many robots at once. Like an airline operations center that tracks every plane, it shows where each robot is, whether it is healthy, what job it is doing, and who should be called when something goes wrong. For robots that drive around, it also hands out jobs and keeps them from blocking each other in narrow aisles.

### Where the analogy breaks
An airline operations center plans flights but leaves keeping planes apart to air traffic control, while a mobile-robot fleet manager often does both: it assigns each robot a route and can pause one so two robots never meet in a narrow aisle. Neither one does the driving or the safety: each robot steers and stops for obstacles on its own, a robot that loses its VDA 5050 link keeps driving the route it already has up to the last point the fleet manager cleared, and both VDA 5050 and ISO 21423 say they set no safety requirements [4][11].

### Precise
A fleet management system is a server, in the cloud or on a plant computer, that talks to a small agent (a background program) on every robot. The agent sends heartbeats (small "I am alive" messages on a timer), status, faults, and metrics. The server keeps an inventory (which robot, hardware revision, software version, site), raises alerts, and offers remote commands. Vendors call this robot operations, or RobOps. InOrbit's OpenRobOps, released as open source in September 2026, lists telemetry intake (collecting the robots' regular streams of small measurements), incident detection, configuration as code (metrics and alert rules kept as text files in version control and changed like code), and outbound-only connections (the robot dials out, so the plant firewall never has to accept incoming connections) [1][2].

Mobile robots add orchestration (deciding which robot does which job and which path it takes). The hard case is a mixed fleet: several vendors' robots in one building. VDA 5050 (an open standard from the German VDA and VDMA industry associations) defines JSON messages over MQTT (a lightweight publish-and-subscribe messaging protocol) between a central fleet control and each vehicle: orders, instant actions such as pause, and a state report. Version 3.0 came out in March 2026 [3][4]. Open-RMF (an open-source ROS 2 framework) sits above vendor fleet managers through fleet adapters (small translator programs, one per vendor fleet, that pass commands and status between that fleet and Open-RMF), from full control down to "traffic light" mode, where it can only pause and resume robots to avoid conflicts [5]. ISO 21423:2026, an ISO standard for communication between industrial mobile robots, fleet managers, and other plant equipment such as doors and lifts, was published in October 2026; OpenRobOps ships a reference implementation of it [1][11].

What breaks without it: with one robot, an engineer can SSH in (log in remotely to its computer). With fifty robots across three plants, nobody knows which robot runs which version, faults are found when production stops, and two vendors' robots wait on each other forever at the same doorway. Fixed arms need the lighter half, health monitoring without traffic control. FANUC's ZDT, for example, watches reducer (gearbox) and servo motor health on connected robots and notifies the user before a failure [6].

### On the cheese plate line
With one line and four pick stations, fleet management here is mostly monitoring. The agent on each station's computer reports picks per minute, missed picks, gripper health (vacuum level at the three vacuum-cup stations, finger air pressure at the grape station), and software and model version. Each plate needs three cheese wedges, so at 200 plates an hour (one plate every 18 seconds) the cheese station must place 10 wedges a minute, one every 6 seconds. If it drops to 8 a minute, the dashboard flags it as the bottleneck before trays queue up in front of it. If the company later runs ten lines in three kitchens, the same inventory shows which lines run which grape model.

### Elsewhere
Amazon passed one million deployed robots in June 2025, across more than 300 facilities, and coordinates their movement with a fleet-level AI model called DeepFleet, which Amazon says improves fleet travel time by 10% [7]. At that scale the hard problem is traffic among thousands of drive units in one building, not watching any single robot.

### Why it exists
Robots fail in ways that need a person: a jammed gripper, a lost localization (the robot no longer knows where it is on its map), a blocked aisle. Once there are more robots than engineers, someone has to see all of them at once, know what each one runs, and route jobs and faults to the right person.

### Connects to
- [[telemetry-logs]] — the agent's status stream is the fleet manager's raw input.
- [[remote-updates]] — the version inventory is what a staged rollout is planned against.
- [[teleop-modes]] — the fleet console is usually where a remote operator gets called in to help a stuck robot.
- [[mobile-robot]] — job assignment and traffic control matter mostly for robots that drive.
- [[oee]] — uptime and pick-rate metrics from the fleet feed the plant's equipment effectiveness numbers.

### Real products and tools
- **InOrbit** — robot operations platform; its fleet manager OpenRobOps went open source (Apache 2.0) in September 2026, alongside a hosted commercial tier, Ground Control [1][10].
- **Formant** — cloud platform for monitoring, alerting, remote access, and data from robot fleets; its site was live and selling the platform as of November 2026 [8][9].
- **Open-RMF** — open-source ROS 2 framework for coordinating several vendor fleets in one building [5].
- **VDA 5050** — open interface standard between a fleet control and mobile robots, JSON over MQTT [3][4].
- **FANUC ZDT (Zero Down Time)** — FANUC's service that monitors its robots' mechanical health and sends alerts [6].

### Common misconception
**Misconception:** A fleet manager is a dashboard you add once the robots work.

**Reality:** The agent, the version inventory, and remote access are what make more than a handful of robots supportable at all, so teams that skip it end up building one in a hurry. InOrbit describes teams spending months building cloud infrastructure, protocols, and database schemas just to monitor basic robot health [2].

### Key numbers
- VDA 5050 vehicle state report: sent on every change and at least every 30 seconds [4].
- Amazon's fleet, which Amazon calls the world's largest fleet of industrial mobile robots: over 1 million robots across more than 300 facilities as of June 2025 [7].

### Sources
1. [InOrbit.AI releases OpenRobOps ISO 21423 reference implementation](https://www.therobotreport.com/inorbit-ai-releases-openrobops-iso-21423-reference-implementation/) — The Robot Report, September 2026; release, Apache 2.0 license, features, ISO 21423 as upcoming.
2. [OpenRobOps announcement](https://www.inorbit.ai/blog/openrobops-announcement) — InOrbit, February 2026; operations layer, outbound-only connections, months spent building monitoring.
3. [VDA 5050 3.0.0 release](https://github.com/VDA5050/VDA5050/releases/tag/3.0.0) — VDA, VDMA, and KIT IFL on GitHub; version 3.0.0, released March 2026.
4. [VDA 5050 specification, version 3.0.0](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) — VDA and VDMA; MQTT with JSON, fleet control, order, instant actions including startPause, state published on relevant events or at least every 30 seconds, a disconnected robot finishing its order up to the last released node (4.1), no safety requirements defined (section 2).
5. [Integration: fleets](https://osrf.github.io/ros2multirobotbook/integration_fleets.html) — Open-RMF project, Programming Multiple Robots with ROS 2; fleet adapters, full control and traffic light (pause and resume only) levels.
6. [FANUC ZDT Zero Down Time](https://www.fanucamerica.com/products/robots/zdt-zero-down-time) — FANUC America; reducer and servo motor health monitoring and alerts.
7. [Amazon launches a new AI foundation model to power its robotic fleet and deploys its 1 millionth robot](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) — Amazon, June 2025; fleet size, DeepFleet, 10% travel time claim.
8. [Formant rolls out cloud-based platform to manage robot fleets](https://www.verdict.co.uk/formant-rolls-out-cloud-based-platform-to-manage-robot-fleets/) — Verdict, January 2022; what the platform does.
9. [Formant](https://formant.ai/) — Formant; current product site (November 2026), monitoring, intervention, and fleet data.
10. [InOrbit adds Steve Cousins to board, offers OpenRobOps as open-source fleet manager](https://www.therobotreport.com/inorbit-adds-steve-cousins-board-offers-openrobops-open-source-fleet-manager/) — The Robot Report, February 2026; Ground Control as the fully managed, cloud-based commercial option.
11. [ISO 21423:2026 Robotics — Industrial mobile robots — Communications and interoperability](https://committee.iso.org/standard/86749.html) — ISO/TC 299; published October 2026, scope, not safety-related and no navigation requirements.

## Telemetry and log formats
id: telemetry-logs
requires: ros2
aka: rosbag, rosbag2, bag file, MCAP, robot logs, recording

### Plain
A robot log is like a flight data recorder. It keeps not just text notes about what the software did, but the sensor readings and commands passing through the robot, each stamped with the time, so a moment can be replayed exactly as the robot experienced it. Because cameras produce so much data, a robot usually keeps a rolling recording and saves only the moments that matter.

### Where the analogy breaks
A flight recorder always keeps the same small set of channels and is read mainly after an accident. A robot recording holds only the streams someone chose to record (often dozens of camera, depth, and joint streams of very different sizes and rates), so a stream left off the list is simply missing later, and engineers open these files daily to debug ordinary behavior, not only crashes.

### Precise
Robots produce three kinds of data. Telemetry (small numbers sent on a timer, such as battery level or picks per minute) and text logs look like their web equivalents. The third kind has no web equivalent: recordings of the robot's message bus (the internal channel where sensor, planning, and control programs exchange messages), including full camera frames and point clouds (sets of 3D points from a depth sensor). In ROS 2 the recorder is rosbag2 and a recording is called a bag. Since the ROS 2 Iron release (May 2023), the default bag storage format is MCAP [1][2][6].

MCAP (an open file format for timestamped messages) stores messages in chunks (blocks of messages compressed together, for example with zstd or lz4, two common compression methods), embeds the schemas (message definitions) so a file can be decoded without the code that wrote it, and usually ends with an optional summary section holding an index (a table of contents saying which chunk covers which time range) so a viewer can jump to any time range without reading the whole file [3]. It replaced SQLite (a small database kept in a single file) as the default partly because SQLite's fast write mode could corrupt a recording that was cut off, while its safe mode was slower [1]. One file can mix encodings, such as ROS messages, Protobuf, and JSON [1].

The difference from web logging is volume. One uncompressed 1280 x 720 color camera at 30 frames a second produces about 83 MB a second, roughly 300 GB an hour (arithmetic: 1280 x 720 pixels x 3 bytes x 30). So teams compress, split bags into files by size or duration, and often use rosbag2's snapshot mode: an in-memory ring buffer (a fixed-size buffer that keeps overwriting its oldest data), sized by a cache-size setting, that is written to disk only when another program calls the recorder's snapshot service (a request that means "save what you have now"), for example after a failed pick [2]. Without synchronized, replayable recordings you cannot tell whether a failure came from the camera, the model, or the arm, and you have nothing to train on.

### On the cheese plate line
The grape station records its overhead and wrist camera frames, the arm's joint positions, the joint targets its learned policy sends, and the soft gripper's state (open or closed, and the air pressure its fingers are set to); an end-to-end [[learned-policy|learned policy]] has no separate grasp choice to log. Recording one 1280 x 720 camera at each of the four pick stations for an eight-hour shift would be close to 10 TB uncompressed, so each station keeps only its last few minutes in a snapshot buffer. When inspection rejects a plate for a missing grape bunch, the line software calls the grape station's snapshot service and the buffer is saved as one MCAP file tagged with the plate number. The buffer must cover the time a tray takes to travel from the grape station to inspection, or the evidence is overwritten before anyone asks for it: on an indexing line that is at least four 18-second moves (past apples, crackers, and cheese), about 72 seconds, plus any time the tray spends queued, so a 60-second buffer would already be too short and 3 minutes is a safer size. Three minutes of raw frames is about 15 GB of memory per camera (83 MB a second x 180 s), so the stations buffer the cameras' compressed image streams instead.

### Elsewhere
A warehouse mobile robot stops unexpectedly in an aisle. Its agent saves the lidar scans, its estimated position on the map, and the path planner's decisions for the 20 seconds before the stop, and uploads them that night. An engineer replays the file and sees that a shrink-wrapped pallet edge was read as a wall.

### Why it exists
Robot bugs depend on the physical moment: lighting, an object's exact position, a timing hiccup between programs. A stack trace cannot reproduce them, so you record the inputs and replay them through the same software.

### Connects to
- [[ros2]] — rosbag2 records ROS 2 topics directly.
- [[visualization-tools]] — recordings are only useful once someone can see them.
- [[data-pipelines]] — saved episodes become training data.
- [[video-pipeline]] — the same compression trade-offs apply to recorded and live video.
- [[fleet-management]] — the fleet agent carries small telemetry live and full recordings later.

### Real products and tools
- **rosbag2** — the ROS 2 recorder and player; MCAP and SQLite storage, zstd compression, splitting by size or duration, snapshot mode [2].
- **MCAP** — open container format with libraries and a command-line tool, Apache 2.0 licensed, the ROS 2 default since Iron [1][3][4].
- **Rerun .rrd** — the recording format of the Rerun viewer and SDK, which can also import MCAP [5].

### Common misconception
**Misconception:** Robot logging is application logging with more fields, so a standard text-log stack (the search-and-dashboard systems used for server logs) can hold it.

**Reality:** Most of a robot recording, by bytes, is binary sensor data that must stay time-aligned across streams to be replayable. Text-log tools suit the small telemetry and event part, but camera and point cloud streams need a format like MCAP that indexes by time and carries its schemas with the data [3].

### Key numbers
- One uncompressed 1280 x 720 color camera at 30 frames a second: about 83 MB a second, about 300 GB an hour (arithmetic, not from a source; compression cuts this by a large factor that depends on codec and scene).

### Sources
1. [MCAP as the ROS 2 default bag format](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) — Foxglove, December 2022; default from Iron, why SQLite was replaced, mixed encodings, zstd and lz4.
2. [rosbag2 README (Jazzy)](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) — ROS 2 project; default mcap plugin, splitting, compression, snapshot mode.
3. [MCAP format specification](https://mcap.dev/spec) — MCAP project; chunks, per-chunk compression, message indexes, summary section.
4. [Foxglove vs Foxglove Studio, two years on](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) — Foxglove, May 2026; MCAP format, libraries, and CLI are Apache 2.0.
5. [Rerun repository](https://www.github.com/rerun-io/rerun) — Rerun; .rrd format, MCAP import.
6. [Iron Irwini release notes](https://github.com/ros2/ros2_documentation/blob/rolling/source/Releases/Release-Iron-Irwini.rst) — ROS 2 documentation; general availability May 23, 2023, mcap as the default bag format.

## Visualization tools
id: visualization-tools
requires: telemetry-logs, frames
aka: RViz, RViz2, Foxglove, Rerun, Lichtblick, log viewer, 3D viewer

### Plain
A robot visualization tool is like the instant replay screen in a sports broadcast. It lets an engineer scrub back and forth through a recording and see what the robot saw, where it thought things were, and what it decided, all lined up in time. Seeing the camera image next to the robot's 3D picture of the world is usually the fastest way to spot what went wrong.

### Where the analogy breaks
Instant replay shows what really happened, while a robot viewer mostly shows what the robot believed happened, such as where it thought the grape bunch was, so a wrong picture on screen can mean a wrong belief rather than wrong footage. Unlike a replay, many viewers, RViz2 especially, are also used live while the robot runs, not only on recordings.

### Precise
Robot viewers combine three things web dashboards rarely need: a 3D scene (robot model, point clouds, detected objects, planned paths), synchronized playback of many streams on one timeline, and frame transforms (the math that places each sensor's data relative to the robot and the world) so a camera's detections land in the right place in 3D. If the camera-to-arm transform is wrong, the viewer shows the detected cheese wedge floating beside where the arm reaches, which is often how calibration errors are found.

The main tools as of late 2026: RViz2, the standard ROS 2 viewer, shows live ROS data through plugins (add-on display types you switch on one by one) such as the robot model, the transform tree (the chain of frames from the world to the robot's base to each sensor and tool), camera images, and depth [1]. Foxglove is a commercial platform with a free tier that opens live connections and MCAP recordings in a browser or desktop app and now adds data search; its open-source predecessor, Foxglove Studio, had its last open-source release (v1.87.0) in February 2024 [2]. Lichtblick is an open-source browser and desktop viewer for ROS 1, ROS 2, and MCAP data [3] that began as a fork of the old open-source Foxglove Studio [7]. Rerun is an open-source SDK and viewer (Apache 2.0 and MIT) that you log to from Python, Rust, or C++ code, and it imports MCAP and LeRobot datasets [4].

What breaks without them: an engineer reading numbers in a terminal cannot easily tell a perception error from a planning error from a calibration error, because all three just look like "the arm missed".

### On the cheese plate line
After a missed apple slice, an engineer opens the saved MCAP file. One panel shows the overhead camera with the model's predicted suction point drawn on the slice; another shows the 3D view with the arm's planned path; a plot shows the vacuum reading. Scrubbing to the pick shows the suction point sat on the slice's curved edge and the vacuum never reached the level that means a seal, so the cup leaked rather than the arm missing.

### Elsewhere
A self-driving car team reviewing a hard brake loads the drive log and sees lidar points, detected cars as boxes, the planned path, and the front camera on one timeline. If the box for a parked car appears half a second after the car is visible in the camera, the problem is slow perception, not the planner.

### Why it exists
Robot data is spatial and time-aligned, and people understand it fastest by looking. A bug that takes hours to find in printed numbers can be obvious in seconds when the point cloud and the camera image disagree on screen.

### Connects to
- [[frames]] — the viewer relies on transforms to put each stream in the right place.
- [[telemetry-logs]] — viewers read bags and MCAP files.
- [[hand-eye-calibration]] — a misaligned overlay is the classic symptom of a bad camera-to-robot calibration.
- [[operator-interfaces]] — teleoperation consoles reuse the same 3D and video panels.
- [[perception]] — the viewer shows what the perception stack detected and where.

### Real products and tools
- **RViz2** — ROS 2's plugin-based 3D viewer; heavy on graphics, so Stereolabs, for one, advises running it on a separate computer rather than the robot's embedded board [1].
- **Foxglove** — commercial visualization and data platform; free tier, Pro from $20 a month as of May 2026 [2].
- **Lichtblick** — open-source viewer in the browser or as a desktop app [3].
- **Rerun** — open-source logging SDK and viewer with its own .rrd format [4].
- **PlotJuggler** — open-source time-series plotting tool, named in 2022 as able to read MCAP [5].
- **LeRobot dataset viewer** — opens a recorded training episode in Rerun, or serves it to Foxglove [6].

### Common misconception
**Misconception:** Visualization is a nice extra for demos.

**Reality:** For most robot bugs it is the main debugging tool, the way a debugger and distributed tracing are for services. If the viewer cannot show what the robot believed at the failing moment, the team is mostly guessing.

### Key numbers
- Foxglove Studio's last open-source release: v1.87.0, February 2024 [2].
- Foxglove free tier as of May 2026: 3 developer seats, 10 GB cloud storage, 5 connected devices [2].

### Sources
1. [ROS 2 - Data display with RViz2](https://docs.stereolabs.com/docs/ros2/rviz2) — Stereolabs; RViz2 plugins, fixed frame, robot model, TF, advice to run on a separate computer.
2. [Foxglove vs Foxglove Studio, two years on](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) — Foxglove, May 2026; last open-source release, current features, free tier, pricing.
3. [Lichtblick documentation](https://lichtblick-suite.github.io/docs) — Lichtblick Suite; browser and desktop viewer, ROS 1, ROS 2, MCAP support.
4. [Rerun repository](https://www.github.com/rerun-io/rerun) — Rerun; license, SDK languages, data types, MCAP and LeRobot import.
5. [MCAP as the ROS 2 default bag format](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) — Foxglove, December 2022; PlotJuggler and Foxglove reading MCAP.
6. [LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/en/lerobot-dataset-v3) — Hugging Face; dataset viewer in Rerun and Foxglove.
7. [Lichtblick repository](https://github.com/lichtblick-suite/lichtblick) — Lichtblick Suite; README states it began as a fork of Foxglove Studio.

## Remote updates and model rollout
id: remote-updates
requires: fleet-management, learned-policy
aka: OTA update, over-the-air update, model rollout, canary, shadow mode, staged rollout, rollback, A/B update

### Plain
Updating robots remotely is like a restaurant chain changing a recipe. One kitchen first cooks the new dish next to the old one without serving it, then serves it for a while as the only kitchen trying it, and only when the numbers hold up does every kitchen switch, with the old recipe card kept handy in case you need to switch back. For robots, the new recipe can be new software or a newly trained model, and the switch should happen only while the robot is safely stopped.

### Where the analogy breaks
A bad recipe produces a bad meal; a bad robot update can produce a dangerous motion. And a kitchen has a cook on hand to switch back, while a robot is often updated with nobody nearby: if the network or power drops halfway through, it must still end up running either the old version or the new one, never half of each, without anyone stepping in.

### Precise
Robot releases borrow web practice. A canary (a partial, time-limited deployment to a small slice, compared against the rest as a control) comes straight from site reliability engineering [1]. Shadow mode runs the new version on live sensor data next to the old one and logs what it would have done without letting it move anything; vehicle validation uses the same idea, recording human and automated commands side by side and flagging where they differ [2]. A staged rollout widens the canary in steps (one robot, one site, all sites), and rollback returns to the last known-good version.

The robot-specific part is making the switch itself safe. Update systems such as Mender write a full new operating system image to an inactive A/B partition (a second copy of the system disk), reboot into it, and fall back to the old copy if the new one fails to boot or is never confirmed healthy [3][4]. The robot's own software then decides when an install or reboot may happen, so it can wait until the arm is stopped and the cell is idle; Mender, for example, lets a script on the device answer "retry later" to hold an update step, for up to a configured time limit [7]. What breaks without this: an update pushed to every robot at once turns one bad build into a stopped plant, and an update cut off halfway can leave a robot that will not start, far from anyone who can fix it.

A new model is usually a separate artifact from the operating system: a weights file (the model's learned numbers), versioned and rolled out on its own schedule. A 3-billion-parameter model stored at 2 bytes per weight is about 6 GB, about 8 minutes at a steady 100 megabits a second (arithmetic), so teams copy the file ahead of time and switch later. Model regressions are statistical, not crashes, so a canary needs enough attempts to show a real difference.

### On the cheese plate line
A new grape model trained on last month's corrections first runs in shadow mode on the grape station for a shift: it sees every frame and computes the joint targets it would send, but the current model still drives the arm, and both sets of targets are logged. Engineers review the cases where the two disagree, then make the new model live on the grape station (the canary). With one line there is no second grape station to act as the control, so the comparison is against the old model's miss rate on recent shifts; with several lines, the other lines' grape stations would be the control. One eight-hour shift is about 1,600 grape picks, enough to see missed picks jump from 1% (16) to 3% (48), but not to tell 1% from 1.2% (illustrative numbers). If misses rise, the fleet manager points the station back at the previous model file, which is still on disk.

### Elsewhere
Carmakers that update vehicles over the air in UNECE markets must, under UN R156, run a certified update management system, identify the regulated software version in each vehicle, and be able to restore the previous version (or reach a safe state) when an over-the-air update fails or is interrupted [5]. The next paragraphs require that an update start only with enough power to finish or recover, and that an update which could affect safety run only once the vehicle is in a state where that is safe, the car version of waiting until the arm is stopped [5]. That is the version inventory, rollback, and safe switch a robot fleet needs, written into law.

### Why it exists
Robots stay in service for years while their software and models keep improving. Sending a technician to every site for every release does not scale, but a careless remote push can stop a production line or cause an unsafe motion, so updates need web-style release discipline plus a safe way to switch.

### Connects to
- [[fleet-management]] — knows which robot runs which version and targets each rollout stage.
- [[policy-evaluation]] — decides whether a canary model is actually better, not just different.
- [[on-robot-inference]] — the model file lands on the robot's onboard computer and must fit and run there.
- [[data-pipelines]] — new models come out of the training pipeline.
- [[safety-standards]] — a change that affects safety functions needs re-validation, not just a deploy.

### Real products and tools
- **Mender** — open-source over-the-air update system for embedded Linux from Northern.tech; A/B partitions with automatic rollback [3][4].
- **AWS RoboMaker** — discontinued: AWS shut down this cloud robotics service, including its simulation, in September 2025 and pointed users to AWS Batch [6].

### Common misconception
**Misconception:** Shipping a new model is just a file copy, so it is safer than a software update.

**Reality:** A model changes how the robot moves in situations nobody tested, and its failures show up as a slowly rising miss rate rather than an error message. Model releases need shadow runs, canaries with enough attempts, and an instant way back, just like code [1][2].

### Key numbers
- Canary duration: at least one full unit of work [1]; for a robot, at least one full job cycle or shift, so slow-to-appear failures have a chance to show.

### Sources
1. [Canarying releases](https://sre.google/workbook/canarying-releases/) — Google, The Site Reliability Workbook, chapter 16; definition of canary and control, duration of at least one work unit.
2. [Validation of vehicles with automated features through the detection of behavioral differences between humans and machines](https://research-portal.uws.ac.uk/en/publications/validation-of-vehicles-with-automated-features-through-the-detect/) — Schwarz, Rolland, Johnston, IEEE ICE/ITMC 2022; shadow system recording human and automated commands in parallel.
3. [Robust OTA updates with partitions for Linux devices](https://mender.io/blog/robust-ota-updates-with-partitions-for-linux-devices) — Mender (Northern.tech); A/B update flow and rollback.
4. [Integration checklist](https://docs.mender.io/client-installation/integration-checklist) — Mender docs; A/B partitions required for full updates, commit, automatic rollback after a failed boot.
5. [UN Regulation No 156, software update and software update management system](https://eur-lex.europa.eu/eli/reg/2021/388/oj) — UNECE, published in the EU Official Journal, March 2021; SUMS and its certificate of compliance (clause 6), RXSWIN software identification (7.2.1.2), restore previous version or safe state after a failed or interrupted over-the-air update (7.2.2.1.1), enough power to complete (7.2.2.1.2), safety-relevant updates only in a safe vehicle state (7.2.2.1.3).
6. [AWS RoboMaker shuts down after failing to gain traction](https://www.therobotreport.com/aws-robomaker-shuts-down-after-failing-to-gain-traction/) — The Robot Report, September 10, 2025; discontinuation and AWS Batch as alternative.
7. [State scripts](https://docs.mender.io/artifact-creation/state-scripts) — Mender docs; exit code 21 ("retry later") lets a device script postpone an update step, retries bounded by a configured timeout.

## Data pipelines
id: data-pipelines
requires: telemetry-logs, imitation-learning
aka: data flywheel, episode recording, data curation, labeling, intervention data, takeover data

### Plain
A robot data pipeline is like a film studio's editing room. The cameras record far more footage than anyone will use, so editors pick the takes worth keeping, label each scene, and send the cut on. For robots, the footage is recordings of the robot working, and the finished cut is training data for the next version of its model.

### Where the analogy breaks
A film editor throws the bloopers away, but for robots the failures and the moments a person had to step in are often the most valuable footage. Much of the editing is also automatic, with software searching thousands of hours for rare events no one could watch.

### Precise
The pipeline has five stages. Record: each robot saves episodes (one attempt at a task, start to finish, with every sensor stream and action). Upload: episodes wait on local disk and go to cloud storage as connectivity and bandwidth allow, because a plant's uplink cannot carry raw video from every station live; Foxglove's Edge Sites, for example, queue recordings on site for later cloud import [7]. Curate: search and filter for useful episodes (failures, rare objects, new sites) and drop near-duplicates of easy successes. Label: attach the task description, success or failure, and sometimes grasp points or boxes. Convert: write a training format such as LeRobotDataset v3, which packs many episodes into shared Parquet files (a table file format that stores data column by column, so one field can be read across millions of rows quickly) for the numbers and MP4 files per camera, with metadata marking where each episode starts and ends [1].

Takeovers are the special robot ingredient. When a remote operator takes control to rescue a stuck robot, the recording holds exactly the situation the model handled badly plus a person showing the fix. HG-DAgger, a variant of DAgger (dataset aggregation: repeatedly adding expert-corrected examples to the training set), changes who is driving. In the original method the learning robot stays in control while the expert says what it should have done, which is hard for a person to do well and can let the robot drift somewhere unsafe; in HG-DAgger the expert takes control when they judge it necessary, and the corrections made while they are in control become the new examples. Its authors argue this is safer and gives better labels on real systems [2]. Physical Intelligence's RECAP method (November 2025) trains on demonstrations, the robot's own autonomous attempts, and expert teleoperated interventions made during autonomous runs, and reports more than doubling throughput on some of its hardest tasks, by its own measurements [3].

What breaks without it: data piles up as unsearchable files on robot disks, the model is retrained on whatever was easiest to collect, and the rare failures that matter never reach training.

### On the cheese plate line
Every grape pick is an episode lasting several seconds: overhead and wrist camera frames, arm joint positions, the joint targets the policy sent, the gripper's open or closed state, and whether inspection later found the bunch on the tray. When the model hesitates on a tangled bunch and a remote operator takes over, the station flags the episode as a takeover. Overnight the line uploads every flagged episode plus 2% of normal picks, about 32 of a shift's 1,600 (illustrative numbers). Curation drops near-duplicates, a labeler confirms success or failure, and the takeovers become the core of next month's grape-model training run, whose output then goes into shadow mode (see [[remote-updates]]).

### Elsewhere
DROID, an academic manipulation dataset, shows what deliberate collection looks like: 76,000 demonstration trajectories, about 350 hours, gathered by 50 collectors across 564 scenes in North America, Asia, and Europe over 12 months [4]. That averages about 17 seconds per trajectory (arithmetic). A deployed fleet aims to produce data like this as a side effect of working.

### Why it exists
Learned robot models improve mainly by seeing more and better examples of the situations they get wrong. Without a pipeline those examples stay trapped on robot disks; with one, every deployed robot becomes a data collector, a loop often called a data flywheel.

### Connects to
- [[telemetry-logs]] — episodes start as recordings.
- [[robot-datasets]] — curated episodes become datasets.
- [[imitation-learning]] — the main consumer of demonstrations and takeover corrections.
- [[teleop-modes]] — takeovers come from remote assist and direct control sessions.
- [[remote-updates]] — the model trained on this data goes back out to the fleet.

### Real products and tools
- **LeRobot (Hugging Face)** — open-source recording, dataset format (v3: Parquet plus MP4, streaming from the Hub), and training tools [1].
- **Foxglove** — search across recordings, events (labeled time ranges), and sessions (grouped recordings) over MCAP data, as of May 2026 [5].
- **Rerun** — open-source SDK aimed at logging, querying, and streaming robot data for training [6].

### Common misconception
**Misconception:** More data is always better, so upload everything.

**Reality:** Bandwidth and storage make that impossible for camera-heavy fleets, and most hours of a working robot are near-identical successes that add little. The value is in selection: failures, takeovers, and new conditions. RECAP's gains come from training on interventions and the robot's own experience, not from more of the same demonstrations [3].

### Key numbers
- DROID: 76k trajectories, 350 hours, 564 scenes, 12 months of collection [4].
- RECAP: more than double the throughput and roughly half the failure rate on some of its hardest tasks, self-reported [3].

### Sources
1. [LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/en/lerobot-dataset-v3) — Hugging Face; Parquet and MP4 layout, episode metadata, streaming.
2. [HG-DAgger: Interactive Imitation Learning with Human Experts](https://arxiv.org/abs/1810.02890) — Kelly, Sidrane, Driggs-Campbell, Kochenderfer, ICRA 2019; human-gated variant of DAgger, why labeling without control hurts safety and label quality, labels collected only while the expert is in control.
3. [π*0.6: a VLA That Learns From Experience](https://arxiv.org/abs/2511.14759) — Physical Intelligence, November 2025; RECAP data sources and reported gains.
4. [DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset](https://arxiv.org/abs/2403.12945) — Khazatsky, Pertsch, et al.; dataset size and collection.
5. [Foxglove vs Foxglove Studio, two years on](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) — Foxglove, May 2026; data search, events, sessions.
6. [Rerun repository](https://www.github.com/rerun-io/rerun) — Rerun; log, query, and stream to train on robotics data.
7. [Announcing Foxglove Edge Sites](https://foxglove.dev/blog/announcing-foxglove-edge-sites) — Foxglove, February 2023; on-site storage that queues data for cloud import as connectivity and bandwidth become available.
