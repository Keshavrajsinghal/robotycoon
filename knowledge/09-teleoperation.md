---
area: 9
slug: teleoperation
title: Teleoperation
---

# Teleoperation

Teleoperation is a person controlling or guiding a robot from somewhere else. This area covers
the two main styles (giving the robot a hint versus driving it directly), the controls an operator
holds, and the plumbing in between: how a camera frame becomes a compressed video stream, how
WebRTC carries it through firewalls, why live video and commands ride on UDP rather than TCP,
what jitter and packet loss do, and how watchdogs make the robot stop safely when the link dies.
The thread running through all of it is the latency budget: an itemized account of every
millisecond between something happening at the robot and the robot responding to the operator.

On the cheese plate line, teleoperation shows up when a pick fails. The grape pick station is the
usual culprit: a tangled bunch hides its stem, the vision system loses confidence, and the station
asks a remote operator for help. Most of the time the operator clicks one point on a still image
and the robot finishes the job itself. Occasionally the operator takes over the arm directly
through a live video feed, and then every stage of the latency budget matters.

## Remote assist versus direct control
id: teleop-modes
requires: grasp-planning
aka: teleoperation, remote assistance, direct teleoperation, shared autonomy, human in the loop, exception handling

### Plain
When a robot gets stuck, a person far away can help it in two very different ways. They can act like a coach on the phone who says "grab the one on the left" and lets the robot do the rest. Or they can act like a driver holding the steering wheel, moving the arm moment by moment while watching a video feed. Most real systems prefer the coach style because it tolerates a slow connection and lets one person help many robots.

### Where the analogy breaks
A phone coach can say anything, but a remote-assist operator can usually only answer the narrow question the robot's software asks (pick a point, choose an option), so problems outside that menu still need direct control or a person on site. And unlike a real driver, a remote operator feels nothing of the arm's weight or contact unless the system adds force feedback.

### Precise
**Teleoperation** (a person controlling a robot from a distance) is a spectrum, set by how often the human sends commands and how abstract those commands are.

**Direct control** (also called direct teleoperation, leader-follower, or historically master-slave control): the operator's device streams motion targets, such as joint angles or a gripper position, many times a second, and the robot tracks them. The human closes the feedback loop by watching video, so every millisecond of delay sits inside that loop (see [[latency-budget]]). ALOHA, a research rig, streams leader-arm joint angles to follower arms at 50 Hz [3]. Direct control needs one operator per robot for the whole takeover.

**Remote assist** (also supervisory control or exception handling): the robot runs on its own and, when its confidence drops below a threshold, sends a snapshot and a question. The operator answers with a high-level hint and the robot plans and executes the motion locally, with its own collision checks and limits. Plus One Robotics' Yonder sends a picture to a remote "Crew Chief," who selects an item to indicate the pick point; the answer is stored and used to improve the model [4]. Waymo's remote assistance answers requests the car initiates; Waymo says its service "does not rely on remote drivers" and the car can accept or reject the advice [1]. **Shared autonomy** sits in between: user input and robot autonomy are blended continuously. Javdani and colleagues infer the user's likely goal from their inputs and assist toward it; users finished faster with less input, though ratings were mixed because people traded control authority against speed [5].

The business record is mixed. Phantom Auto, which remotely drove forklifts, yard trucks, and sidewalk robots, shut down in March 2024 after raising about $95 million [2]. As of late 2025, 1X sells its NEO home humanoid with an "Expert Mode" in which remote operators in VR headsets pilot it during windows the owner schedules [6].

### On the cheese plate line
At the grape pick station, a bunch lands with its stem tucked under the fruit and the grasp planner's best candidate scores below threshold. The station posts a remote-assist request with one still image; the operator clicks the stem, and the robot computes the full grasp and picks. At 200 plates an hour the station has 18 seconds per plate, so an answer within a few seconds keeps the plate on schedule, and one operator can cover all four pick stations (illustrative staffing). If the bunch is wedged against the tray wall, the operator switches to direct control and nudges it free, which needs the low-latency video link described in the rest of this area.

### Elsewhere
Robotaxis sit at the remote-assist extreme. As of February 2026, Waymo reports about 70 remote assistance agents on duty worldwide, with a median one-way latency of about 150 ms to its U.S. centers and 250 ms to overseas ones, and says the agents do not continuously monitor vehicles [1]. That latency is fine for answering a question but would be poor for steering, which is why the agents advise rather than drive.

### Why it exists
An autonomous system that succeeds 99% of the time still stops the line on the remaining 1%. A remote human handles that 1% without someone standing at every station, and each answer becomes a labeled training example that can shrink the 1% over time [4].

### Connects to
- [[grasp-planning]] — remote assist usually supplies a grasp point that the grasp planner turns into a full grasp.
- [[operator-interfaces]] — the mode decides the controls: a click interface for assist, a leader arm or VR headset for direct control.
- [[latency-budget]] — direct control puts the whole round trip inside the human's control loop; remote assist only needs seconds.
- [[robot-datasets]] — operator corrections and teleoperated demonstrations become training data.
- [[watchdogs]] — direct control needs a heartbeat so the robot stops when the operator's link dies.

### Real products and tools
- **Plus One Robotics Yonder** — remote human-in-the-loop software for parcel-picking robots; the operator selects the pick point in an image [4].
- **Waymo remote assistance** — advice-only remote support for robotaxis; agents answer questions the car asks [1].
- **1X NEO Expert Mode** — VR teleoperation of a home humanoid during owner-scheduled windows, as of late 2025 [6].
- **ALOHA** — a research leader-follower rig for two-armed direct teleoperation, about $20k [3].
- **Phantom Auto** — remote driving of logistics vehicles; shut down in March 2024 [2].

### Common misconception
**Misconception:** A teleoperated robot is a puppet that a person drives the whole time.

**Reality:** In most deployed fleets the robot runs on its own and a person answers occasional questions; Waymo states that its remote agents do not drive [1]. Some products do rely on live piloting for part of the work (NEO's Expert Mode [6]), and companies rarely publish how often humans step in, so ask for the intervention rate before judging a system's autonomy.

### Key numbers
- Direct control command rate: 50 Hz in ALOHA [3].
- Waymo remote assistance: about 70 agents on duty; median one-way latency about 150 ms (U.S. centers) and 250 ms (overseas) [1].
- Phantom Auto raised about $95 million before shutting down in March 2024 [2].

### Code sketch
```python
# Remote assist at the grape pick station (runs on the station's cell computer).
CONFIDENCE_MIN = 0.85     # below this, ask a human (tuned per station; illustrative)
ASSIST_TIMEOUT_S = 8.0    # past this, skip the plate rather than stall the line

def pick_grapes(frame):
    grasps = grasp_planner.propose(frame)            # ranked candidate grasps
    best = grasps[0] if grasps else None
    if best and best.confidence >= CONFIDENCE_MIN:
        return execute(best)                          # normal autonomous path

    # Remote assist: send ONE still image and a narrow question, not a live stream.
    ticket = assist_queue.post(
        station="grape",
        image=jpeg(frame),
        question="Click the grape stem",
        suggestions=[g.pixel for g in grasps[:3]],    # operator can just confirm one
    )
    answer = ticket.wait(timeout=ASSIST_TIMEOUT_S)
    if answer is None:
        return skip_plate(reason="assist timeout")    # inspection will reject the plate

    grasp = grasp_planner.from_pixel(frame, answer.pixel)  # robot plans the motion itself
    dataset.log(frame, answer)                        # the click becomes a training label
    return execute(grasp)                             # collision checks and limits stay local
```

### Sources
1. [Advice, not control: the role of Remote Assistance](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) — Waymo blog, February 2026; agents advise, do not drive; about 70 agents; median one-way latency 150 ms (U.S.) and 250 ms (overseas)
2. [Remote driving startup Phantom Auto is shutting down](https://techcrunch.com/2024/03/12/remote-driving-startup-phantom-auto-is-shutting-down/amp/) — TechCrunch, March 2024; pivot to forklifts and yard trucks, about $95 million raised, shutdown
3. [Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware](https://ar5iv.labs.arxiv.org/html/2304.13705) — Zhao et al., RSS 2023; ALOHA leader-follower rig, 50 Hz teleoperation, about $20k
4. [Automated Induction](https://www.plusonerobotics.com/automated-parcel-induction) — Plus One Robotics; Yonder sends an image to a remote Crew Chief who selects the pick point; responses used for learning
5. [Shared Autonomy via Hindsight Optimization](https://arxiv.org/abs/1503.07619) — Javdani, Srinivasa, Bagnell, RSS 2015; definition of shared autonomy and user study results
6. [In-home Helper Robot NEO Uses Remote VR Operators to Help with Chores](https://roadtovr.com/helper-robot-neo-vr-telepresence/) — Road to VR, October 2025; Expert Mode with Quest 3 operators, price, 2026 U.S. shipping

## Operator interfaces
id: operator-interfaces
requires: teleop-modes, dof
aka: teleop UI, leader arm, master device, 3D mouse, SpaceMouse, VR teleoperation, haptic device, surgeon console

### Plain
The operator interface is the set of controls a remote person uses: a web page with a picture to click on, a joystick, a VR headset, or a small copy of the robot arm that they move by hand. Choosing one is like choosing between texting directions, using a game controller, or working a puppet: each fits a different job. The more closely the controls match the robot's body and the task, the faster people learn them and the fewer mistakes they make.

### Where the analogy breaks
A puppeteer sees the puppet instantly and feels the strings, while a remote operator sees a delayed, flattened camera picture and usually feels nothing, so depth and contact have to be added back through stereo video or force feedback.

### Precise
Interfaces differ in how many DOF (degrees of freedom: independent directions of motion) the operator commands at once, whether they command joint angles or the tool's position in space, and what feedback comes back.

- **Point-and-click page** (a browser view of a still image or video): the operator clicks a pixel and the robot turns it into a 3D grasp using its depth camera. It suits remote assist and tolerates seconds of delay.
- **6-DOF puck** (a 3D mouse such as the 3Dconnexion SpaceMouse: push, pull, or twist a knob to command motion along and around three axes): robosuite maps sideways pushes to horizontal arm motion, twists to rotation, and a held button to closing the gripper [1]; a Universal Robots add-on lets the tool follow the SpaceMouse in real time [2]. It commands velocity, so it needs a dead zone or the arm drifts when a hand rests on it.
- **VR headset with hand tracking**: the operator's hand pose becomes the gripper's target pose, computed through IK (inverse kinematics: working out joint angles that put the tool at a target pose), and stereo video returns to each eye. Open-TeleVision used an Apple Vision Pro, streamed 480x640 images per eye, ran its whole loop at 60 Hz, and controlled a robot in San Diego from MIT, about 3,000 miles away [3].
- **Leader arm** (a smaller arm with the same joint layout as the robot): its joint angles are sent straight to the robot as joint commands, so no IK is needed. ALOHA used WidowX leader arms ($3,300 each) driving larger ViperX followers at 50 Hz [4]. GELLO built such replicas for under $300 with low-cost Dynamixel servos and 3D-printed parts; in a 12-person study across 5 two-armed tasks it reached 0.92 success versus 0.72 for VR controllers and 0.63 for 3D mice, and was faster [5].
- **Surgeon console**: the da Vinci system reproduces the surgeon's hand motion "in scaled proportion" (motion scaling: big hand moves become small instrument moves), filters out the 8-10 Hz natural tremor of human hands, and has a clutch that lets the surgeon reposition their hands without moving the instruments, like lifting a computer mouse [6].

Without a fitting interface, operators tire quickly, move the wrong way when the camera view is rotated relative to the robot, and record poor demonstrations. Common fixes are an enable button that must be held for motion, speed caps, motion scaling, and expressing commands in the camera's frame so "push away" means away on screen.

### On the cheese plate line
For routine grape rescues the operator uses a browser page showing the overhead camera's still image and clicks the stem. For the rare direct takeover, the same page switches to the wrist camera's live video, and the operator uses a SpaceMouse with motion capped at 50 mm/s, the gripper on a button, and an enable button that must stay held (illustrative settings). A GELLO-style leader arm would be overkill for rescues but is a cheap way to record a few hundred grape-pick demonstrations for training a learned policy.

### Elsewhere
In surgery, the console is the whole product: the da Vinci surgeon sits at handles that map to wristed instruments, with motion scaling, tremor suppression, and a clutch [6]. In robot-learning labs, leader-follower rigs such as ALOHA and GELLO have become standard tools for collecting demonstrations because joint-for-joint mapping is intuitive and avoids IK failures [4][5].

### Why it exists
In teleoperation the human brain is the controller, and the interface decides how much information per second a person can push into the robot and how much context they get back. Better mappings mean faster rescues, fewer collisions, and cleaner training data.

### Connects to
- [[teleop-modes]] — remote assist needs a click interface; direct control needs a continuous input device.
- [[dof]] — a 6-DOF puck or VR controller commands all six tool directions; a leader arm commands every joint.
- [[inverse-kinematics]] — pose-based devices (SpaceMouse, VR) need IK; leader arms skip it.
- [[imitation-learning]] — leader-follower rigs are the main way demonstrations are recorded.
- [[watchdogs]] — the enable button on the interface is the first layer of stopping.

### Real products and tools
- **3Dconnexion SpaceMouse** — 6-DOF puck; supported in robosuite [1] and on Universal Robots arms through the 3D Mouse Move add-on by Radalytica [2].
- **Apple Vision Pro** — the headset Open-TeleVision used for stereo, hand-tracked teleoperation [3].
- **ALOHA** — open research rig with WidowX leader arms and ViperX follower arms [4].
- **GELLO** — open-source low-cost leader arms built as scaled replicas of commercial arms [5].
- **da Vinci surgeon console** — Intuitive's surgical teleoperation console with motion scaling and tremor filtering [6].

### Common misconception
**Misconception:** VR is the best teleoperation interface because it is the most immersive.

**Reality:** In GELLO's user study, a simple joint-matched leader arm beat VR controllers on success rate (0.92 versus 0.72) and speed [5]. Immersion helps with depth, but the best interface is the one whose mapping fits the task; for remote assist, a mouse click on an image beats all of them.

### Key numbers
- ALOHA: 50 Hz teleoperation and recording; whole rig about $20k [4].
- GELLO: under $300 per device; success 0.92 versus 0.72 (VR) and 0.63 (3D mouse) [5].
- Open-TeleVision: 60 Hz loop, 480x640 stereo per eye [3].
- Human hand tremor filtered by surgical consoles: about 8-10 Hz [6].

### Code sketch
```python
# SpaceMouse -> robot tool velocity, with the guards a real interface needs.
DEADZONE = 0.05            # ignore tiny deflections from a resting hand
MAX_LIN = 0.05             # m/s cap during a rescue (illustrative)
MAX_ANG = 0.5              # rad/s cap (illustrative)
R_view_to_base = calibrated_rotation()   # so "push away" means away in the camera view

def on_device_sample(s):   # called every USB poll, typically every 1-8 ms
    if not s.enable_held:                       # dead-man: no button, no motion
        send_twist(linear=(0, 0, 0), angular=(0, 0, 0))
        return
    lin = [0.0 if abs(a) < DEADZONE else a for a in s.translation]   # each in -1..1
    ang = [0.0 if abs(a) < DEADZONE else a for a in s.rotation]
    send_twist(
        linear=R_view_to_base @ (MAX_LIN * vec(lin)),   # operator frame -> robot base frame
        angular=R_view_to_base @ (MAX_ANG * vec(ang)),
        gripper_closed=s.button_left,
        seq=next_seq(), sent_at=now(),                  # lets the robot drop stale commands
    )
    # The robot side runs IK, joint limits, and collision checks; the interface never
    # sends joint torques or bypasses the robot's own safety limits.
```

### Sources
1. [I/O Devices](https://robosuite.ai/docs/modules/devices.html) — robosuite documentation; keyboard, SpaceMouse, and DualSense mappings to arm motion
2. [3D Mouse Move](https://universal-robots.com/marketplace/products/01tP40000071NYeIAM) — Universal Robots marketplace; SpaceMouse real-time tool control by Radalytica
3. [Open-TeleVision: Teleoperation with Immersive Active Visual Feedback](https://arxiv.org/html/2407.01512v2) — Cheng et al., CoRL 2024; Apple Vision Pro, 60 Hz loop, stereo streaming, MIT to UCSD teleoperation
4. [Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware](https://ar5iv.labs.arxiv.org/html/2304.13705) — Zhao et al., RSS 2023; WidowX leaders, ViperX followers, 50 Hz, about $20k
5. [GELLO: A General, Low-Cost, and Intuitive Teleoperation Framework for Robot Manipulators](https://arxiv.org/html/2309.13037v2) — Wu et al.; under $300, direct joint mapping, user study versus VR and 3D mice
6. [Robotic Applications in Cardiac Surgery](https://arxiv.org/pdf/cs/0412055) — Kypson and Chitwood, International Journal of Advanced Robotic Systems, 2004; motion scaling, tremor suppression, clutch on the da Vinci console

## The latency budget
id: latency-budget
requires: teleop-modes, camera-2d, control-loops
aka: glass-to-glass latency, motion-to-photon latency, end-to-end latency, motion-to-motion latency, round trip, delay budget

### Plain
A latency budget is an itemized receipt of where the time goes: from something happening at the robot to the operator seeing it, and from the operator moving to the robot responding. It works like a relay race in which the baton (first a video frame, then a command) passes through many runners, including the camera, the compressor, the network, the screen, the person, and the robot's controller. The total decides whether remote control feels crisp or like steering a ship. To make it faster you find the slowest runners, and they are often not the network.

### Where the analogy breaks
Relay runners hand off one baton at a time, but video is a stream of overlapping frames, so several stages are waits for the next slot (the next camera frame, the next screen refresh) that cost half a slot on average rather than a fixed time. And the operator is not a runner waiting for each baton: people predict and move continuously, so their reaction time shapes how they cope with delay rather than simply adding to it.

### Precise
**Glass-to-glass (G2G) latency** is the time from light of an event passing through the camera lens to the matching light leaving the display glass [1]. **Motion-to-photon latency** is a VR term for the time from a user's movement to the display showing the updated image; about 20 ms is the usual comfort threshold for headsets [2]. In teleoperation the full loop is the operator moving the input until they see the robot's resulting motion on screen. One teleoperated-driving study splits it into **motion-to-motion (M2M)** latency (operator input to the machine physically moving) plus G2G, calls the sum end-to-end latency, and measured about 500 ms over 5G, with M2M about 60% of it [3].

Several stages are waits, not work. Bachhuber and Steinbach model the camera's delay as spread evenly between zero and one frame interval and the display's as spread between zero and one refresh interval, so the average adds half of each [1]. That is why frame rate matters even when nothing else changes: with a 60 Hz monitor they measured a mean G2G of 50.4 ms with a 25 fps camera and 15.5 ms with a 300 fps camera [1].

The network has a physics floor: light in optical fiber travels about 31% slower than in vacuum (refractive index about 1.47), roughly 200 km per millisecond [4]. Real routes are longer than straight lines and add routers and queues: Verizon's backbone round trips in October 2026 were about 14 ms within Europe, 33 ms within North America, 70 ms across the Atlantic, and 112 ms across the Pacific [5], and an LTE cellular link added a median 36 ms over a wired LAN in one study [6].

Targets come from human studies. ITU-T G.114 says that if one-way delay stays below 150 ms, most applications "will experience essentially transparent interactivity," with 400 ms as the planning limit, while noting that highly interactive tasks can be affected by less [7]. In a telesurgery study, delays of 100 ms or less were judged acceptable, and task time rose significantly between 100 and 150 ms [8]. Above that, operators slow down and may fall back to moving a little, then waiting to see the result [unverified: classic move-and-wait finding; primary source not opened].

### On the cheese plate line
In Ride 3 the grape pick fails and an operator 1,000 km away takes over using the wrist camera. An untuned setup (30 fps camera, an encoder that waits for future frames, LTE at the plant, a large jitter buffer, a 60 Hz office monitor, a 100 Hz command bridge) adds up to about 400 ms before the operator even reacts (illustrative, built from the ranges below). Switching to 60 fps, low-latency encoder settings, a wired uplink, a small jitter buffer, a 120 Hz monitor, and a 500 Hz controller interface brings the machine part to about 110 ms, under the 150 ms target, as the code sketch shows. Notice that the 1,000 km of fiber itself costs only about 5 ms each way [4].

### Elsewhere
Waymo's remote assistance runs at a median one-way latency of about 150 ms to U.S. centers and 250 ms overseas, acceptable because agents give advice rather than steer [9]. A teleoperated-driving testbed measured G2G of about 193 ms over 5G, of which the camera contributed about 120 ms and the 60 Hz monitor about 8 ms, and an M2M of about 306 ms dominated by about 270 ms of steering-actuator response [3].

### Why it exists
Without per-stage accounting, teams optimize the wrong thing, such as paying for a faster network when the camera's buffering and the encoder's lookahead dominate. A budget turns "it feels laggy" into numbered stages that each have an owner and a fix.

### Connects to
- [[video-pipeline]] — capture, encoding, and decoding are the largest stages a team can tune.
- [[network-impairments]] — jitter forces a jitter buffer, a delay added on purpose.
- [[udp-vs-tcp]] — each retransmission wait adds at least one network round trip.
- [[control-loops]] — the robot's controller cycle and motion response are the last stages.
- [[teleop-modes]] — remote assist tolerates seconds; direct control wants the loop near 150 ms.

### Real products and tools
- **G2G delay measurement rig (TUM)** — open-source LED-and-light-sensor system for measuring glass-to-glass delay to about 0.5 ms precision [1].
- **Universal Robots RTDE** — a 500 Hz real-time data interface on e-Series and ur-Series arms, one way commands reach the controller [10].
- **NVIDIA NVENC low-latency tuning** — hardware encoder settings that cap encoder buffering at about one frame [11].

### Common misconception
**Misconception:** Teleoperation latency is the network ping.

**Reality:** On a 5G testbed, sending each video frame over the network took about 15 ms of a roughly 193 ms G2G, while the camera alone took about 120 ms [3]. A ping measures tiny packets, not frames waiting in camera buffers, encoders, jitter buffers, and screens.

### Key numbers
| Stage (frame out, then command back) | Typical range | What it depends on | Source |
|---|---|---|---|
| Camera: wait for the next frame | 0-33 ms at 30 fps (average 17); 0-17 ms at 60 fps (average 8) | Frame rate | [1] |
| Camera: exposure and sensor readout | about 1-30 ms | Lighting, shutter type, resolution | [unverified: sensor datasheets not opened] |
| Camera stage as measured end to end | whole G2G as low as 8 ms with a 300 fps lab camera; about 120 ms camera share in a vehicle teleoperation rig | Camera buffering and drivers | [1][3] |
| Image signal processing (color, denoise, scaling) | about 1-10 ms | Done on the camera chip or a GPU | [unverified: no vendor figure opened] |
| Encode | up to about one frame interval with low-latency settings (one rig: 30 ms frame period plus 9 ms processing) | B-frames, lookahead, buffer size; a single-frame encoder buffer equals bitrate divided by frame rate | [3][11] |
| Packetize and send (serialization) | about 1-15 ms (a 20.8 kb frame at 1.38 Mb/s takes 15 ms) | Frame size versus uplink rate | [3] |
| Network one way | fiber floor about 200 km per ms: 50 km 0.25 ms, 1,000 km 5 ms, MIT to San Diego (about 3,000 miles, 4,800 km) at least 24 ms; backbone one way about 7 ms (Europe) to 56 ms (trans-Pacific); LTE adds a median 36 ms | Distance, routing, last-mile link | [4][5][6][13] |
| Jitter buffer | about 0 ms (wired LAN) to tens of ms; must cover the arrival spread, and LTE latency in one study had a 29.5 ms standard deviation | Measured jitter | [6] |
| Decode | about 1-10 ms (one rig: 10.5 ms of receive-side processing including decode) | Hardware decoder, resolution | [3] |
| Display | average half the refresh interval: 8.3 ms at 60 Hz, 4.2 ms at 120 Hz, plus the panel's own processing | Refresh rate, monitor mode | [1][3] |
| Human perception and reaction | about 213-231 ms mean for a simple visual reaction; longer for decisions | Task, practice | [12] |
| Input device sampling | about 1-5 ms (measured about 2 ms, up to 5 ms) | USB polling interval | [3] |
| Command send (network one way) | same physics as above; one 5G rig measured 10.3 ms | Distance, link | [3] |
| Robot receive and controller cycle | 2 ms per cycle at 500 Hz to 10 ms at 100 Hz | Controller and bridge rates | [3][10] |
| Motion: command to visible movement | tens of ms for a small arm move; about 270 ms for a car's steering actuator | Acceleration limits, smoothing filters, servo tuning | [3] |

- Human-factors targets: about 20 ms motion-to-photon for VR comfort [2]; below 150 ms one way for transparent interactivity [7]; 100 ms or less for telesurgery [8].
- Measured totals: G2G about 193 ms and end-to-end about 500 ms on a 5G driving rig [3]; G2G 150-200 ms over LTE in another rig [6].

### Code sketch
```python
# Ride 3 latency budget: grape-station takeover, operator 1,000 km away.
# Values in ms are ILLUSTRATIVE, chosen inside the sourced ranges in Key numbers.
# (stage, untuned, tuned, what changed)
BUDGET = [
    # --- video frame out (glass-to-glass) ---
    ("camera: wait for next frame", 16.7,  8.3, "30 -> 60 fps"),
    ("camera: exposure + readout",  15.0,  5.0, "brighter light, shorter exposure"),
    ("image signal processing",      5.0,  3.0, "on-chip ISP, no extra GPU copy"),
    ("encode",                      70.0,  5.0, "no B-frames, no lookahead, 1-frame buffer"),
    ("packetize + send",            15.0,  4.0, "steady frame sizes (intra refresh, CBR)"),
    ("network one way",             48.0, 12.0, "LTE (+36 ms) -> wired; fiber floor is 5 ms"),
    ("jitter buffer",               80.0, 15.0, "wired link has little jitter"),
    ("decode",                       8.0,  4.0, "hardware decoder"),
    ("display",                     18.0,  9.0, "60 Hz -> 120 Hz, monitor game mode"),
    # --- operator (not counted: humans track continuously, ~213-231 ms simple reaction) ---
    # --- command back (motion-to-motion) ---
    ("input device sampling",        8.0,  1.0, "125 Hz -> 1000 Hz USB polling"),
    ("command network one way",     48.0, 12.0, "same link as video"),
    ("robot receive + control cycle", 10.0, 2.0, "100 Hz bridge -> 500 Hz interface"),
    ("motion starts",               60.0, 30.0, "lighter command smoothing filter"),
]

def total(col):
    return sum(row[col] for row in BUDGET)

print(f"untuned loop: {total(1):.0f} ms")   # ~402 ms
print(f"tuned loop:   {total(2):.0f} ms")   # ~110 ms, under the 150 ms target
for stage, before, after, why in sorted(BUDGET, key=lambda r: r[2] - r[1]):
    print(f"{stage:32s} saves {before - after:5.1f} ms  ({why})")
# Biggest savings: encoder settings and the jitter buffer, not raw distance.
```

### Sources
1. [A System for High Precision Glass-to-Glass Delay Measurements in Video Communication](https://ar5iv.labs.arxiv.org/html/1510.01134) — Bachhuber and Steinbach, ICIP 2016; G2G definition, frame-interval and refresh-interval model, measured G2G versus frame rate
2. [Latency](https://support.varjo.com/hc/en-us/latency) — Varjo support; motion-to-photon definition and the roughly 20 ms threshold
3. [End-to-End Latency Measurement Methodology for Connected and Autonomous Vehicle Teleoperation](https://arxiv.org/html/2602.17381v1) — arXiv 2026; G2G, M2M, and end-to-end definitions; per-stage breakdown on 5G
4. [The Speed of Light Never Changes, Except When It Does](https://resources.telegeography.com/the-speed-of-light-never-changes-except-when-it-does) — TeleGeography; refractive index about 1.467, about 31% slower than vacuum (about 200 km per ms)
5. [IP Latency Statistics](https://www.verizon.com/business/terms/latency/) — Verizon Business; monthly backbone round-trip latency by region, October 2026
6. [Driving Through the Network: Performance and Workload Under Latency and Video Impairments](https://arxiv.org/html/2605.15952) — Trautmannsheimer, Azab, Diermeyer (TUM), 2026; LTE adds a median 36 ms over LAN, G2G 150-200 ms, LTE latency standard deviation 29.5 ms
7. [ITU-T Recommendation G.114: One-way transmission time](https://www.cs.columbia.edu/%7Eandreaf/new/documents/other/T-REC-G.114-200305.pdf) — ITU-T, 05/2003 edition (copy hosted at Columbia University); 150 ms and 400 ms guidance
8. [Maximum acceptable communication delay for the realization of telesurgery](https://pmc.ncbi.nlm.nih.gov/articles/PMC9536636/) — Nankaku et al., PLoS ONE 2022; delays 0-300 ms tested, 100 ms or less acceptable
9. [Advice, not control: the role of Remote Assistance](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) — Waymo blog, February 2026; median one-way latency 150 ms (U.S.) and 250 ms (overseas)
10. [Real-Time Data Exchange (RTDE) Guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) — Universal Robots; 500 Hz output on e-Series and ur-Series controllers
11. [NVENC Video Encoder API Programming Guide](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) — NVIDIA Video Codec SDK 13.1; low-latency settings, single-frame buffer equals bitrate divided by frame rate
12. [Factors influencing the latency of simple reaction time](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2015.00131/full) — Woods et al., Frontiers in Human Neuroscience 2015; mean simple visual reaction 231 ms, 213 ms corrected for hardware delay
13. [Open-TeleVision: Teleoperation with Immersive Active Visual Feedback](https://arxiv.org/html/2407.01512v2) — Cheng et al., CoRL 2024; MIT to UC San Diego teleoperation, about 3,000 miles

## Video capture and encoding
id: video-pipeline
requires: camera-2d, latency-budget
aka: video encoding, codec, H.264, AVC, H.265, HEVC, AV1, hardware encoder, NVENC, GOP, B-frames, intra refresh, CBR

### Plain
A camera produces far more picture data than an internet link can carry, so the robot squeezes each frame before sending it, much like describing only what changed in a scene instead of redrawing the whole picture each time. The squeezing method is called a codec, and most of its savings come from each frame looking a lot like the one before. Some of its tricks also peek at future frames to squeeze harder, which is fine for movies but adds a delay a remote operator can feel.

### Where the analogy breaks
"Describe only what changed" suggests that losing one message loses just one change, but each compressed frame builds on earlier ones, so one lost packet can smear errors across every following frame until a fresh full picture or a refresh sweep repairs it.

### Precise
The pipeline is sensor, then ISP (image signal processor: the chip stage that turns raw sensor values into a color image by filling in colors, balancing white, and reducing noise), then scaling, then the encoder, then packetizing for the network. Raw 1280x720 color video at 60 fps is about 1.3 Gb/s (1280 x 720 pixels x 24 bits x 60), far beyond a typical uplink, so compression is not optional.

**Codecs** (compression standards): H.264, also called AVC, is the baseline every WebRTC browser must support, alongside VP8 [7]; its latest ITU-T edition is June 2026 [1]. H.265, also called HEVC, approved in 2013, achieves roughly 25-50% better compression than H.264 at the same quality [2][3]. AV1, released by the Alliance for Open Media in March 2018 under a royalty-free licensing model, shows savings that vary widely by test: about 50% versus the x264 encoder in Facebook's 2018 comparison but about 9.5% versus HEVC at 4K in a 2020 University of Waterloo study [4]. Hardware encoders (dedicated chip blocks that compress video without using the main processor) matter more than the codec name: NVIDIA GeForce RTX 40-series and later GPUs and Intel Arc GPUs encode AV1 in hardware, while RTX 30-series GPUs only decode it [4].

**Frame types**: an I-frame (intra frame) is a complete picture and is large; a P-frame (predicted) stores differences from earlier frames and is small; a B-frame (bidirectional) also references a later frame, so the encoder must wait for that later frame before it can send, adding at least one frame interval of delay per B-frame in the reordering. A GOP (group of pictures) is the run of frames from one I-frame to the next. NVIDIA's recommended settings for "low-latency use cases like game-streaming, video conferencing" are low or ultra-low latency tuning, CBR (constant bitrate: holding the data rate steady so the network is not hit by bursts), a "very low VBV buffer size (e.g. single frame = bitrate/framerate)" (the encoder's allowance for burstiness, which becomes delay downstream), infinite GOP with intra refresh (instead of periodic giant I-frames, refresh one stripe of the picture each frame), and unidirectional B-frames, an HEVC-only variant that avoids the reordering wait [5]. An intra refresh period of 30 frames repairs the full picture about once a second at 30 fps [5]. Compare YouTube's live-streaming advice of 2 B-frames and a 2-second keyframe interval [6]: right for viewers who accept seconds of delay, wrong for teleoperation.

Bitrate trades against quality: YouTube suggests 3-8 Mb/s for 720p at 30 fps and 5-14 Mb/s for 1080p at 30 fps in H.264, less for HEVC and AV1 [6]. Teleoperation links often cannot sustain that, so systems lower resolution or frame rate when bandwidth drops, keeping the stream live rather than sharp.

### On the cheese plate line
The grape station's wrist camera sends 1280x720 at 60 fps through the hardware encoder on the station's computer, in H.264 because WebRTC browsers are required to support it [7]. The encoder runs CBR at 4 Mb/s with no B-frames, no lookahead, infinite GOP, intra refresh every 30 frames, and a one-frame buffer of about 67 kbit (4 Mb/s divided by 60) (illustrative settings following [5]). In the cold room the operator mostly needs to see the stem's position, so when the plant uplink is congested the system drops to 640x360 rather than letting frames queue.

### Elsewhere
Cloud gaming and video conferencing use the same low-latency recipe NVIDIA lists for them [5], while a YouTube live stream deliberately uses B-frames and long keyframe intervals because a few seconds of delay costs nothing there [6]. The same codec can therefore be either fast or efficient depending on its settings.

### Why it exists
Raw video carries hundreds of times more data than a teleop stream can use (about 1.3 Gb/s raw versus a few Mb/s), so compression is required. Low-latency encoding exists because default encoder settings optimize bits per unit of quality, not milliseconds, and a teleoperation stream needs the opposite priority.

### Connects to
- [[camera-2d]] — exposure, frame rate, and resolution set what the encoder receives.
- [[latency-budget]] — encoder buffering and reordering are often the largest avoidable delays.
- [[network-impairments]] — lost packets corrupt dependent frames; intra refresh limits the damage.
- [[webrtc]] — carries the encoded frames and tells the encoder what bitrate the network can take.
- [[onboard-compute]] — whether the robot's computer has a hardware encoder decides what is practical.

### Real products and tools
- **NVIDIA NVENC** — hardware encoder block in NVIDIA GPUs, programmed through the Video Codec SDK, with low-latency tuning presets [5].
- **Intel Arc GPUs** — hardware AV1 encoding [4].
- **ITU-T H.264 and H.265** — the AVC and HEVC standards, both updated in 2026 [1][3].
- **AV1** — royalty-free codec from the Alliance for Open Media [4].

### Common misconception
**Misconception:** A newer codec such as AV1 means lower latency.

**Reality:** Codecs trade computation for bits; latency comes mostly from settings (B-frames, lookahead, buffer size) and from whether a hardware encoder exists [5]. AV1 saves bandwidth, which helps on a congested link, but without hardware support it can be slower to encode [4].

### Key numbers
- HEVC versus H.264: about 25-50% better compression at equal quality [2].
- AV1 savings: about 9.5% (versus HEVC at 4K) to about 50% (versus x264), depending on the test [4].
- Low-latency encoder buffer: one frame, equal to bitrate divided by frame rate; 4 Mb/s at 60 fps is about 67 kbit [5].
- Intra refresh period of 30 frames: full repair about once per second at 30 fps [5].
- H.264 live-stream bitrates: 720p30 3-8 Mb/s, 1080p30 5-14 Mb/s [6].

### Code sketch
```python
# Encoder setup for the grape-station teleop stream (NVENC-style knobs, illustrative values).
FPS = 60
BITRATE = 4_000_000                       # bits per second

enc = HardwareEncoder(codec="h264", width=1280, height=720, fps=FPS)
enc.tuning        = "ultra_low_latency"   # NVENC tuning info for interactive streams
enc.rate_control  = "CBR"                 # steady rate: no bursts that queue in routers
enc.vbv_bits      = BITRATE // FPS        # ~67 kbit: one frame of slack, so frames never queue
enc.b_frames      = 0                     # each B-frame waits for a future frame (+16.7 ms here)
enc.lookahead     = 0                     # lookahead buffers frames before encoding them
enc.gop_length    = INFINITE              # no periodic giant I-frames...
enc.intra_refresh_period = 30             # ...refresh a stripe per frame; full repair every 30 frames

for frame in camera.frames():             # one frame every 16.7 ms, already through the ISP
    packets = enc.encode(frame)           # returns this frame's bits now (no reordering wait)
    for p in packets:
        rtp.send(p, timestamp=frame.capture_time)

    if feedback.keyframe_requested():     # receiver lost too much to repair from references
        enc.force_intra_refresh()
    if feedback.bandwidth_estimate():     # from congestion control (see webrtc)
        enc.set_bitrate(min(BITRATE, feedback.bandwidth_estimate() * 0.9))
```

### Sources
1. [H.264: Advanced video coding for generic audiovisual services](https://www.itu.int/rec/T-REC-H.264) — ITU-T; standard listing, latest edition 06/2026
2. [High Efficiency Video Coding](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding) — Wikipedia; 25-50% better compression than AVC, approved 2013
3. [H.265: High efficiency video coding](https://www.itu.int/rec/T-REC-H.265) — ITU-T; standard listing, latest edition 01/2026
4. [AV1](https://en.wikipedia.org/wiki/AV1) — Wikipedia; March 2018 release, royalty-free model, reported savings, NVIDIA and Intel hardware support
5. [NVENC Video Encoder API Programming Guide](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) — NVIDIA Video Codec SDK 13.1; recommended low-latency settings, intra refresh, unidirectional B-frames
6. [Choose live encoder settings, bitrates, and resolutions](https://support.google.com/youtube/answer/2853702) — YouTube Help; live bitrates by resolution, 2 B-frames, 2-second keyframe interval
7. [RFC 7742: WebRTC Video Processing and Codec Requirements](https://www.rfc-editor.org/rfc/rfc7742) — IETF; WebRTC browsers must implement VP8 and H.264 Constrained Baseline

## WebRTC
id: webrtc
requires: video-pipeline, udp-vs-tcp, network-impairments
aka: Web Real-Time Communication, ICE, STUN, TURN, NAT traversal, DTLS-SRTP, SRTP, RTP, data channel, congestion control

### Plain
WebRTC is the technology behind browser video calls, and teleoperation systems borrow it to send robot video to an operator's browser and send commands back. It is like setting up a direct phone line between two houses that each sit behind an apartment building's front desk: first they work out how to reach each other, then they talk directly, and they use a relay operator only if no direct path works. Once connected, it keeps adjusting video quality to fit the line so the picture stays live instead of freezing.

### Where the analogy breaks
A phone line has a fixed capacity, but an internet path changes second by second, so WebRTC continuously guesses the available bandwidth from packet timing and loss, and a wrong guess briefly causes blur or stalls. And the relay operator (a TURN server) forwards encrypted packets it cannot read.

### Precise
WebRTC is a browser API standardized by the W3C (a Recommendation since March 2025) [1] on top of a suite of IETF protocols summarized in RFC 8825 [2]. Its pieces, in the order a connection uses them:

- **Signaling** (exchanging session descriptions: codecs, encryption fingerprints, and network addresses): the W3C spec says this travels over "a signaling channel which is provided by unspecified means," generally a script talking to the app's own server [1]; ICE exchanges its candidates through such a channel, for example as an SDP offer and answer [3].
- **ICE** (Interactive Connectivity Establishment: a procedure for finding a working network path when both sides sit behind NATs, routers that share one public address among many devices and block unsolicited incoming traffic): each side gathers candidates, namely host addresses on its own interfaces, server-reflexive addresses (its public address as reported by a STUN server), and relayed addresses on a TURN server. The two sides pair candidates, test pairs with STUN connectivity checks, and nominate a working pair [3].
- **TURN** (Traversal Using Relays around NAT: a server that forwards every packet when no direct path exists): relays are expensive to run, so the standard advises using one "only when a direct communication path cannot be found" [4].
- **DTLS-SRTP**: a DTLS handshake (TLS adapted for datagrams) on the media path establishes keys for SRTP (Secure RTP: encrypted, authenticated media packets) [5]; SRTP is required for all implementations [2].
- **Data channels**: SCTP messages carried in DTLS over ICE and UDP, for arbitrary application data. Reliability and ordering are chosen per channel: "Limiting the number of retransmissions to zero, combined with unordered delivery, provides a UDP-like service" [6]. The browser API exposes this as `ordered: false` with `maxRetransmits` or `maxPacketLifeTime` [7].
- **Congestion control** (estimating how fast the path can carry data and sending no faster): RFC 8825 requires the transport layer to include it [2]. Google Congestion Control, described in an IETF draft, combines a delay-based controller that watches whether packet spacing is stretching (a sign of queues building) and a loss-based controller; the sender uses the lower estimate and the encoder follows it [8].
- **Jitter buffer**: the receiver holds frames briefly to smooth uneven arrival (see [[network-impairments]]).

Without WebRTC a team would hand-build NAT traversal, encryption, congestion control, and bitrate adaptation, or use segment-based streaming built for seconds of delay [unverified: HLS and DASH latencies not sourced here].

### On the cheese plate line
The grape station runs a WebRTC peer on its cell computer and sends one H.264 video track from the wrist camera. Commands use two data channels: "cmd," unordered with zero retransmits, for 100 Hz velocity commands, because a late velocity command is worse than a lost one; and "events," reliable and ordered, for gripper close, mode switches, and heartbeats that must arrive. The plant firewall blocks incoming connections, so ICE usually settles on a server-reflexive path, and falls back to a TURN relay in the same region when the plant's network allows nothing else, at the cost of an extra hop in the [[latency-budget]].

### Elsewhere
Browser-based video calls use this same stack, and because the API ships in all major browsers, an operator needs no installed software [10]. Libraries outside the browser implement it for robots: Pion, a pure Go implementation, lists remotely controlling a robot and streaming its cameras as an example use and supports ordered or unordered, lossy or lossless data channels [9].

### Why it exists
Browsers needed plugin-free real-time audio and video that work through home and office firewalls. Robotics inherits a heavily tested stack, maintained as an open-source project supported by Apple, Google, Microsoft, and Mozilla among others, that handles NATs, encryption, and congestion control [10].

### Connects to
- [[udp-vs-tcp]] — WebRTC media and data channels run over UDP to avoid retransmission stalls.
- [[network-impairments]] — congestion control, retransmission, and jitter buffers respond to loss and jitter.
- [[video-pipeline]] — the encoder's bitrate follows WebRTC's bandwidth estimate.
- [[watchdogs]] — heartbeats on a data channel detect a dead link.
- [[fleet-management]] — fleet platforms run the signaling and TURN servers for many robots.

### Real products and tools
- **Browser WebRTC API** — available as JavaScript APIs in all major browsers [1][10].
- **libwebrtc (webrtc.org)** — the open-source implementation, with native libraries for Android and iOS [10].
- **Pion** — pure Go WebRTC implementation, version 4 as of its repository page [9].

### Common misconception
**Misconception:** WebRTC is peer-to-peer, so it needs no servers.

**Reality:** It needs a signaling server to exchange descriptions and candidates [3], usually a STUN server to learn public addresses, and a TURN relay whenever NATs or firewalls block a direct path [4]. Peer-to-peer describes where media flows when a direct path exists, not the absence of infrastructure.

### Key numbers
- Google Congestion Control loss rules: above 10% loss cut the estimate; 2-10% hold; below 2% raise it 5% per update [8].
- On detected overuse, the delay-based controller resets the rate to about 0.85 times the incoming bitrate [8].
- Data channel limits: set `maxRetransmits` or `maxPacketLifeTime` (milliseconds), never both [7].

### Code sketch
```js
// Operator side (browser). The robot side mirrors this with libwebrtc or Pion.
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:STUN_HOST:3478" },                          // learn our public address
    { urls: "turn:TURN_HOST:3478", username, credential },    // relay if no direct path
  ],
});

// Commands: unordered, never retransmitted. A stale velocity command is worse than none.
const cmd = pc.createDataChannel("cmd", { ordered: false, maxRetransmits: 0 });
// Discrete events and heartbeats: reliable and ordered (the defaults).
const events = pc.createDataChannel("events");

pc.addTransceiver("video", { direction: "recvonly" });       // robot's wrist camera
pc.ontrack = (e) => { videoEl.srcObject = e.streams[0]; };

// Signaling goes through our own WebSocket server; WebRTC does not define it.
pc.onicecandidate = (e) => e.candidate && ws.send(JSON.stringify({ candidate: e.candidate }));
ws.onmessage = async (m) => {
  const msg = JSON.parse(m.data);
  if (msg.sdp) await pc.setRemoteDescription(msg.sdp);
  if (msg.candidate) await pc.addIceCandidate(msg.candidate);
};
await pc.setLocalDescription(await pc.createOffer());
ws.send(JSON.stringify({ sdp: pc.localDescription }));

let seq = 0;
setInterval(() => {                                         // 100 Hz command stream
  if (cmd.readyState !== "open") return;
  cmd.send(JSON.stringify({ seq: seq++, sentAt: performance.now(), twist: readSpaceMouse() }));
}, 10);
setInterval(() => events.readyState === "open" && events.send('{"type":"heartbeat"}'), 50);
```

### Sources
1. [WebRTC: Real-Time Communication in Browsers](https://www.w3.org/TR/webrtc/) — W3C Recommendation, 13 March 2025; the browser API
2. [RFC 8825: Overview: Real-Time Protocols for Browser-Based Applications](https://www.rfc-editor.org/rfc/rfc8825) — IETF, 2021; protocol suite, SRTP required, data channel specs required
3. [RFC 8445: Interactive Connectivity Establishment (ICE)](https://www.rfc-editor.org/rfc/rfc8445) — IETF, 2018; candidates, connectivity checks, nomination, exchange via signaling
4. [RFC 8656: Traversal Using Relays around NAT (TURN)](https://www.rfc-editor.org/rfc/rfc8656) — IETF, 2020; relaying and the advice to use TURN only when needed
5. [RFC 5764: DTLS Extension to Establish Keys for SRTP](https://www.rfc-editor.org/rfc/rfc5764) — IETF, 2010; DTLS keying on the media path
6. [RFC 8831: WebRTC Data Channels](https://www.rfc-editor.org/rfc/rfc8831) — IETF, 2021; SCTP over DTLS over UDP, ordered or unordered, partial reliability
7. [RTCPeerConnection: createDataChannel() method](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel) — MDN; ordered, maxRetransmits, maxPacketLifeTime options
8. [A Google Congestion Control Algorithm for Real-Time Communication](https://datatracker.ietf.org/doc/html/draft-ietf-rmcat-gcc-02) — Holmer et al., IETF draft; delay-based and loss-based controllers and thresholds
9. [Pion WebRTC](https://github.com/pion/webrtc) — GitHub; pure Go implementation, robot control use case, data channel modes
10. [WebRTC](https://webrtc.org/) — webrtc.org; open-source project, browser and native availability, supporting companies

## UDP versus TCP
id: udp-vs-tcp
requires: latency-budget
aka: UDP, TCP, head-of-line blocking, retransmission, QUIC, WebTransport, datagram, Nagle

### Plain
TCP and UDP are two ways of sending data over the internet. TCP is like numbered registered letters that must be handed over in order: if letter 5 goes missing, letters 6 through 10 wait at the post office until 5 is resent. UDP is like mailing postcards: each arrives on its own or not at all, and nothing waits. For live video and robot motion commands, waiting for an old message is worse than skipping it, so they usually travel over UDP.

### Where the analogy breaks
Choosing postcards does not mean nothing is ever resent: protocols built on UDP, such as RTP retransmission or QUIC, decide per message whether resending is still worth it. And TCP's waiting happens invisibly inside the receiver's operating system, so the application just sees a pause followed by a burst.

### Precise
**TCP** (Transmission Control Protocol) provides "a reliable, in-order, byte-stream service" [1]. The cost is **head-of-line blocking** (one missing piece holds up everything behind it): bytes after a lost segment sit in the receiver's buffer until the resend arrives. The sender only learns of a loss from the receiver's feedback, so the stall is at least one round trip, and if the loss is detected by timer instead, RFC 6298 recommends a retransmission timeout of at least 1 second that doubles with each repeat [2]. TCP implementations should also use Nagle's algorithm, which holds back small writes to combine them, but must let applications turn it off per connection [1].

**UDP** (User Datagram Protocol) sends independent datagrams with no ordering and no retransmission; whatever runs on top decides what to do about loss. That is why real-time video rides on UDP (via RTP and SRTP inside [[webrtc]]): at 30 fps a frame is due every 33 ms, and a retransmission that takes one cross-country round trip arrives after the frame it belonged to was needed, while also stalling every later frame under TCP.

**QUIC** is a newer transport built on UDP [3] with multiple streams per connection; it guarantees order only within a stream, not between streams [3], so data that would otherwise suffer head-of-line blocking should go on separate streams [4]. Its unreliable DATAGRAM extension sends frames that are "not retransmitted upon loss detection," aimed at real-time media and gaming [5]. **WebTransport**, a W3C browser API (Candidate Recommendation, July 2026), exposes QUIC's reliable streams and unreliable datagrams over HTTP/3, falling back to reliable-only over HTTP/2 [6]. One practical limit: measurement studies found about 3-5% of networks block UDP entirely, so UDP-based systems need a TCP fallback [4].

TCP is still right for discrete messages that must arrive (configuration, logs, a "close gripper" event) and on a plant LAN, where round trips are well under a millisecond and a stall costs little.

### On the cheese plate line
During a grape takeover, suppose the operator's 100 Hz velocity commands travel over a TCP WebSocket and one packet is lost on the plant Wi-Fi with a 40 ms round trip. The next four or so commands arrive but are held back until the resend lands, then all are delivered together, and the arm lurches through stale motions; if the loss needs a timeout instead, dozens of commands pile up (illustrative arithmetic: 100 commands per second times the stall time). Over an unordered, no-retransmit channel the lost command is simply replaced 10 ms later by a newer one.

### Elsewhere
Online games and video calls send position updates and media over UDP for the same reason: the newest update makes the old one worthless. QUIC lets an application such as a browser put independent pieces of data on separate streams, so one lost packet no longer blocks unrelated data sharing the connection [4].

### Why it exists
The two transports encode two different promises: TCP promises completeness and order, UDP promises nothing and therefore never waits. Teleoperation needs timeliness for video and motion commands and completeness for state changes, so systems use both.

### Connects to
- [[webrtc]] — runs media and data channels over UDP, with per-channel reliability choices.
- [[network-impairments]] — loss becomes stalls under TCP and gaps under UDP.
- [[latency-budget]] — each retransmission wait adds at least one network round trip.
- [[industrial-network]] — on a plant LAN round trips are tiny, so TCP's penalty is small.

### Real products and tools
- **QUIC** — UDP-based, multiplexed, encrypted transport standardized in RFC 9000 [3].
- **QUIC DATAGRAM extension** — unreliable frames inside a QUIC connection [5].
- **WebTransport** — browser API for QUIC streams and datagrams [6].
- **Disabling Nagle** — the per-connection switch TCP must offer, commonly the TCP_NODELAY socket option [1] [unverified: option name not given in RFC 9293].

### Common misconception
**Misconception:** UDP is unreliable, so TCP is the safer choice for robot commands.

**Reality:** For a command that is replaced every 10 ms, reliable delivery means late delivery, and a burst of stale commands is the hazard. Safety comes from robot-side limits, staleness checks, and [[watchdogs]], not from the transport; reliable delivery belongs to discrete events.

### Key numbers
- TCP retransmission timeout (RFC 6298): initial 1 s, minimum 1 s, doubling on each timeout [2].
- Networks that block UDP entirely: about 3-5% in measurement studies [4].
- A TCP loss stalls later data for at least one round trip, because the sender learns of the loss from the receiver's feedback.

### Code sketch
```python
# Robot side: commands over an unordered, no-retransmit channel (UDP datagrams or a
# WebRTC data channel with maxRetransmits=0). Latest command wins.
MAX_AGE_S = 0.15          # drop commands older than this (illustrative)
COMMAND_TIMEOUT_S = 0.25  # no fresh command for this long -> stop (see watchdogs)

last_seq, latest = -1, None

def on_datagram(msg, received_at):
    global last_seq, latest
    if msg.seq <= last_seq:                 # late or duplicate: newer already applied
        return
    if received_at - msg.sent_at_robot_clock > MAX_AGE_S:   # needs clock sync or RTT estimate
        return
    last_seq, latest = msg.seq, (msg, received_at)

def control_tick(now):                      # robot-side loop, e.g. 500 Hz
    if latest is None or now - latest[1] > COMMAND_TIMEOUT_S:
        command_velocity(ZERO)
    else:
        command_velocity(clamp(latest[0].twist, LIMITS))

# The same loss over TCP, as the application sees it:
#   t=0 ms     cmd 41 lost on Wi-Fi
#   t=10-40    cmds 42-45 reach the kernel but are NOT handed to the app (waiting for 41)
#   t=~40 ms   41 resent; 41-45 delivered at once -> five commands in one burst
```

### Sources
1. [RFC 9293: Transmission Control Protocol (TCP)](https://www.rfc-editor.org/rfc/rfc9293) — IETF, 2022; reliable in-order byte stream, Nagle algorithm and the requirement to allow disabling it
2. [RFC 6298: Computing TCP's Retransmission Timer](https://www.rfc-editor.org/rfc/rfc6298) — IETF; initial and minimum RTO of 1 second, doubling backoff
3. [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000) — IETF, 2021; QUIC over UDP, no ordering across streams
4. [RFC 9308: Applicability of the QUIC Transport Protocol](https://www.rfc-editor.org/rfc/rfc9308) — IETF, 2022; separate streams to avoid head-of-line blocking, 3-5% of networks block UDP, TCP fallback
5. [RFC 9221: An Unreliable Datagram Extension to QUIC](https://www.rfc-editor.org/rfc/rfc9221) — IETF, 2022; DATAGRAM frames not retransmitted, real-time media and gaming use
6. [WebTransport](https://www.w3.org/TR/webtransport/) — W3C Candidate Recommendation Snapshot, July 2026; reliable streams, unreliable transport over HTTP/3, reliable-only over HTTP/2

## Jitter, packet loss, and bandwidth
id: network-impairments
requires: udp-vs-tcp, latency-budget
aka: jitter, packet loss, bandwidth, jitter buffer, playout delay, FEC, forward error correction, NACK, retransmission, congestion

### Plain
A network link can be slow, but it can also be uneven, leaky, and narrow. Jitter is packets arriving at irregular times, like buses scheduled every ten minutes that show up in clumps; packet loss is buses that never arrive; bandwidth is how many passengers the route can carry per hour. Each needs a different fix: waiting a little to smooth out the clumps, sending spare copies or asking again for missing ones, and carrying fewer passengers when the road is full.

### Where the analogy breaks
Buses that bunch up still deliver everyone, but on a network, sending more than the narrowest link can carry makes queues grow inside routers, which raises delay and jitter for everyone before any packet is dropped; trying to carry more passengers actively wrecks the timetable.

### Precise
**Jitter** (variation in packet delay) is measured in RTP by comparing the spacing of two packets on arrival with their spacing when sent, D(i,j) = (Rj - Ri) - (Sj - Si), and smoothing it as J = J + (|D| - J)/16 for each packet [1]. A receiver absorbs jitter with a **jitter buffer** (a short holding queue that releases frames on a steady schedule): a bigger buffer means fewer stutters and more delay, an explicit trade in the [[latency-budget]]. Cellular links make this expensive: one cited urban LTE measurement averaged 81.9 ms latency with a 29.5 ms standard deviation [5].

**Packet loss** has two fixes. Retransmission (the receiver asks for the missing packet, the sender resends it) only helps if the resend arrives before the frame is due; the RTP retransmission standard notes that conferencing's few-hundred-millisecond delay budget "usually excludes the use of retransmission" [2], though on short round trips it fits. FEC (forward error correction: sending extra recovery data up front so the receiver can rebuild a lost packet without asking) avoids the round trip but always uses bandwidth, even when nothing is lost; WebRTC guidance prefers retransmission when the round trip fits the latency budget and otherwise sends only enough FEC to cover observed loss [3]. For compressed video, an unrecovered loss damages every frame that references the lost one until intra refresh repairs it (see [[video-pipeline]]).

**Bandwidth** (the capacity of the narrowest link on the path) is unknown to the sender and changes constantly, so it must be estimated. Google Congestion Control lowers its rate when packet spacing stretches (queues forming) or loss exceeds 10% [4]. Sending above capacity does not just drop packets; it first fills router buffers and adds delay. Engineers rehearse all three problems with Linux netem, which can add delay with jitter, random loss, rate limits, and reordering to a network interface [6].

### On the cheese plate line
The grape station's uplink shares the plant network with bulk uploads of inspection images. At shift change, the uploads saturate the link, router queues grow, and the teleop stream's jitter climbs from a few ms to tens of ms; the jitter buffer grows to cover it, so the operator's view lags by an extra 50-80 ms right when they are nudging a wedged grape bunch (illustrative). The fixes are giving teleop traffic network priority, capping the bulk upload, and letting the encoder follow the congestion controller's lower estimate.

### Elsewhere
Teleoperated vehicles on cellular links face exactly this: the same LTE study cited above saw tens of milliseconds of delay variation, so remote-driving systems must budget a jitter buffer on top of the average latency [5]. Voice calls show the FEC trade clearly: the Opus audio codec's built-in FEC costs about 20-30% extra bandwidth depending on the protection level [3].

### Why it exists
Shared, best-effort networks (the internet, cellular, Wi-Fi) give no timing guarantees, and these three impairments are how that shows up. Every mitigation spends either delay (buffers, retransmission) or bandwidth (FEC, headroom), so a teleop system must choose deliberately.

### Connects to
- [[udp-vs-tcp]] — over TCP, loss turns into delay; over UDP, it is a gap the application handles.
- [[webrtc]] — bundles a jitter buffer, retransmission, FEC, and congestion control.
- [[latency-budget]] — the jitter buffer is a stage whose size you choose.
- [[video-pipeline]] — intra refresh and bitrate control limit damage from loss and narrow links.
- [[industrial-network]] — plant networks can reserve priority for time-critical traffic.

### Real products and tools
- **Linux tc netem** — network emulator for adding delay, jitter, loss, rate limits, and reordering in tests [6].
- **RTP retransmission (RFC 4588)** — the standard format for resending lost media packets [2].
- **Flexible FEC (RFC 8627)** — the FEC scheme WebRTC guidance recommends for video [3].
- **Google Congestion Control** — delay- and loss-based bandwidth estimation designed for real-time communication [4].

### Common misconception
**Misconception:** More bandwidth fixes laggy teleoperation.

**Reality:** Lag is usually delay and jitter, not capacity: a fast link with a long queue in front of it still lags. Extra bandwidth helps only if the stream was being squeezed, and the usual cures are smaller queues, priority for teleop traffic, and a sender that backs off before queues form [4].

### Key numbers
- RTP jitter estimate: smoothing gain of 1/16 per packet [1].
- Google Congestion Control: above 10% loss cut; 2-10% hold; below 2% raise 5% per update [4].
- Opus in-band FEC overhead: about 20-30% [3].
- Urban LTE latency in one cited study: mean 81.9 ms, standard deviation 29.5 ms [5].

### Code sketch
```python
# Receiver: estimate jitter (RFC 3550) and size the playout delay from it.
MAX_JITTER_BUFFER_MS = 60     # never hold frames longer than this (budget-driven, illustrative)
J = 0.0                        # smoothed jitter, ms
prev = None                    # (arrival_ms, send_ms) of the previous packet

def on_packet(pkt, arrival_ms):
    global J, prev
    if prev is not None:
        D = (arrival_ms - prev[0]) - (pkt.send_ms - prev[1])   # spacing stretched or squeezed
        J += (abs(D) - J) / 16                                  # RFC 3550 smoothing
    prev = (arrival_ms, pkt.send_ms)
    assembler.add(pkt)

def playout_delay_ms():
    return min(max(3 * J, 5), MAX_JITTER_BUFFER_MS)   # 3x jitter: illustrative safety factor

def on_frame_started(frame):
    due = frame.first_arrival_ms + playout_delay_ms()
    missing = assembler.missing_packets(frame)
    if missing and rtt_ms() < due - now_ms():
        send_nack(missing)               # a resend can still arrive in time
    schedule(due, release, frame)

def release(frame):
    if frame.complete():
        decoder.decode(frame)
    else:
        decoder.skip(frame)              # too late to wait; conceal and move on
        request_intra_refresh()          # repair the picture without a giant keyframe
```

### Sources
1. [RFC 3550: RTP: A Transport Protocol for Real-Time Applications](https://www.rfc-editor.org/rfc/rfc3550) — IETF; interarrival jitter definition and the 1/16 smoothing formula
2. [RFC 4588: RTP Retransmission Payload Format](https://www.rfc-editor.org/rfc/rfc4588) — IETF, 2006; retransmission suits relaxed delay bounds, usually excluded for conferencing
3. [RFC 8854: WebRTC Forward Error Correction Requirements](https://www.rfc-editor.org/rfc/rfc8854) — IETF, 2021; FEC versus retransmission, bandwidth cost, Flexible FEC for video, Opus overhead 20-30%
4. [A Google Congestion Control Algorithm for Real-Time Communication](https://datatracker.ietf.org/doc/html/draft-ietf-rmcat-gcc-02) — Holmer et al., IETF draft; delay-based and loss-based rate control and thresholds
5. [Driving Through the Network: Performance and Workload Under Latency and Video Impairments](https://arxiv.org/html/2605.15952) — Trautmannsheimer, Azab, Diermeyer (TUM), 2026; cites urban LTE latency mean 81.9 ms, standard deviation 29.5 ms
6. [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html) — Linux manual page; delay with jitter, loss, rate, and reordering emulation

## Watchdogs and safe failure
id: watchdogs
requires: estop, robot-controller, network-impairments
aka: watchdog timer, heartbeat, keepalive, timeout, dead-man switch, enabling device, lost-comms behavior, controlled stop

### Plain
A watchdog is a timer that expects to be reset regularly; if the resets stop, it assumes something has gone wrong and puts the machine into a safe state. It works like the dead-man's pedal on a train: the driver must keep pressing it, and if they let go or pass out, the train brakes by itself. In remote control, the robot keeps listening for an "I'm still here" signal from the operator, and when the signal stops, the robot stops instead of carrying on with the last command it heard.

### Where the analogy breaks
A train's pedal is one physical device, but a robot has layers: a software timeout that slows the arm smoothly, a controller-level stop, and wired safety circuits that can cut power, and the remote link can only request a stop, never guarantee one. And a remote "pedal" is really a stream of packets, so the robot cannot tell a fainted operator from a dead network and must treat both the same way.

### Precise
A **heartbeat** is a small periodic message that means "still alive"; a **timeout** is how long the receiver waits without one before acting. The timeout must be longer than normal jitter, or the robot stops for no reason, but short enough that the motion during the gap is safe: distance covered equals speed times timeout, so 100 mm/s with a 300 ms timeout means up to 30 mm of unattended motion. In hardware, a **watchdog timer** is a circuit that resets a computer when software stops sending keepalives, catching a hung program [1]. Boston Dynamics' Spot applies the idea to remote operators: registered E-Stop endpoints must keep checking in, a check-in with a wrong challenge-response does not reset the timer, and actuators may be powered only while every endpoint's last check-in is within its timeout; stop levels include CUT (actuator power cut immediately) and SETTLE_THEN_CUT (a controlled stop and sit before power is cut) [2]. The page I read does not spell out exactly which stop level a lapsed timeout triggers mid-motion.

How to stop matters. IEC 60204-1 distinguishes stop category 0 (remove power immediately), category 1 (controlled stop, then remove power), and category 2 (controlled stop, power stays on) [unverified: standard text not opened]. On link loss, teleop systems usually command a controlled stop and hold position rather than cutting power, because a powered-down arm can coast or drop its load, while a hardwired emergency stop remains available for real emergencies (see [[estop]] and [[safety-standards]]). Interfaces can hide a trap: Universal Robots' RTDE interface notes that "Inputs retain their last received value" [3], so a bridge that forwards operator commands must zero them itself when they go stale; nothing in the protocol does it automatically.

**Safety stays local.** Speed limits, force limits, protective zones, and emergency stops run on the robot's own controller and safety circuits, because only the local side can guarantee timing; a network link can be delayed, lost, or spoofed. The remote operator can always ask the robot to stop, but the guarantee that it does stop never depends on the network. A **dead-man switch** or enabling device (a control that permits motion only while held) carries the same idea into the operator's hand.

### On the cheese plate line
During a grape takeover, the operator holds an enable button on the SpaceMouse and the browser sends heartbeats 20 times a second. The station's computer brings the arm to a controlled stop if no fresh command arrives within 250 ms, keeping the gripper closed so the grape bunch is not dropped onto the tray, and after 2 seconds of silence it ends the takeover, parks the arm, and tells the line controller to let the next plate pass without grapes so inspection rejects it (illustrative values). The station's hardwired emergency stop and guarding work the same whether or not the remote link is up.

### Elsewhere
Spot's E-Stop service is a deployed example: an operator's controller is one endpoint among possibly several, and permission to power the actuators depends on fresh check-ins from every endpoint [2]. Data-center servers use the same pattern in hardware, with a watchdog that reboots a machine whose software has hung [1].

### Why it exists
Networks fail silently. Without a watchdog, "no news" looks the same as "keep doing the last thing," which for a moving arm means continuing into whatever is in front of it.

### Connects to
- [[estop]] — the hardwired emergency stop is the last layer, independent of any network link.
- [[safety-circuit]] — safety-rated circuits enforce stops even if software hangs.
- [[network-impairments]] — the timeout must exceed normal jitter yet stay short enough to be safe.
- [[robot-controller]] — the controller executes the controlled stop and holds position.
- [[safety-standards]] — define stop categories and enabling devices.

### Real products and tools
- **Boston Dynamics Spot E-Stop service** — heartbeat endpoints with challenge-response check-ins and CUT or SETTLE_THEN_CUT stop levels [2].
- **Linux watchdog API** — the `/dev/watchdog` interface to hardware watchdog timers, kept alive by periodic writes [1].
- **Universal Robots RTDE** — 500 Hz controller interface whose inputs keep their last value, so a teleop bridge must add its own timeout [3].

### Common misconception
**Misconception:** If the connection drops, the robot just stops.

**Reality:** Only if someone built it to. Many interfaces hold the last command or input value [3], so a dropped link can leave a velocity command running. And an emergency stop button sent over a network cannot guarantee timing; the guaranteed stop must live on the robot.

### Key numbers
- Unattended motion during a timeout equals speed times timeout: 100 mm/s with 300 ms is 30 mm; 250 mm/s with 500 ms is 125 mm (arithmetic).
- Universal Robots RTDE runs at 500 Hz on e-Series and ur-Series controllers, so a stale command can be applied 500 times per second unless something zeros it [3].

### Code sketch
```python
# Layered watchdog on the grape station's cell computer (illustrative timings).
CMD_TIMEOUT_S       = 0.25   # no fresh motion command -> controlled stop, hold position
HEARTBEAT_TIMEOUT_S = 2.0    # no heartbeat at all -> end takeover, park, hand back to the line

class TeleopBridge:
    def __init__(self, robot, line):
        self.robot, self.line = robot, line
        self.last_cmd_t = self.last_hb_t = monotonic()
        self.active = False

    def on_heartbeat(self, msg):
        if msg.enable_held:                       # dead-man: heartbeat only counts while held
            self.last_hb_t = monotonic()

    def on_command(self, cmd):
        self.last_cmd_t = monotonic()
        self.robot.set_target_velocity(clamp(cmd.twist, LIMITS))

    def tick(self):                               # runs every 2 ms (500 Hz) on the robot side
        t = monotonic()
        if not self.active:
            return
        if t - self.last_cmd_t > CMD_TIMEOUT_S:
            self.robot.set_target_velocity(ZERO)  # interface would otherwise keep the last value
            self.robot.controlled_stop(keep_gripper_closed=True)
        if t - self.last_hb_t > HEARTBEAT_TIMEOUT_S:
            self.active = False
            self.robot.park()
            self.line.skip_next_plate(station="grape")

# Underneath this software, the robot's safety controller enforces speed and force limits
# and the hardwired e-stop cuts power. Neither waits for, or depends on, the network.
```

### Sources
1. [The Linux Watchdog driver API](https://www.kernel.org/doc/html/latest/watchdog/watchdog-api.html) — Linux kernel documentation; hardware watchdog timer resets the system if keepalives stop
2. [E-Stop service](https://dev.bostondynamics.com/docs/concepts/estop_service) — Boston Dynamics Spot SDK; endpoints, check-ins, challenge-response, timeouts, CUT and SETTLE_THEN_CUT
3. [Real-Time Data Exchange (RTDE) Guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) — Universal Robots; 500 Hz interface, inputs retain their last received value
