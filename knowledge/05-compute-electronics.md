---
area: 5
slug: compute-electronics
title: Compute and electronics
---

# Compute and electronics

This area covers the electronics that make decisions on a robotic line: the robot controller beside each arm, the vision or AI computer that interprets cameras, the PLC that runs the whole line, the industrial networks that connect them, and the safety circuits and emergency stops that can override all of them. Most of this hardware lives in steel cabinets next to the cell or at the end of the line, not inside the robot.

On the cheese plate line, the thing to learn is who decides what. The vision PC finds the grape bunch and reports where it is. The grape station's robot controller turns that answer into arm motion. The line PLC decides when trays move, which station works next, and which plate gets rejected. The safety system is wired separately and can stop every one of them, whatever their software wants.

## Robot controller
id: robot-controller
requires: servo-drive
aka: robot control cabinet, teach pendant, motion controller, interpolation cycle

### Plain
A robot controller is the box that turns a robot program into actual joint movement. Think of a puppeteer: the script says "wave", and the puppeteer works out exactly how far to pull each string, correcting hundreds of times a second so the motion looks smooth. The controller does the same for each motor in the arm, and it comes with a handheld tablet, the teach pendant, that people use to program and jog the robot.

### Where the analogy breaks
A puppeteer watches the puppet and the room. The controller sees nothing except its own joint angles and whatever coordinates other computers send it, so it never decides where the grape is, only how to get the hand there.

### Precise
An industrial robot controller is usually a cabinet (a steel enclosure with its own cooling) cabled to one arm and placed outside the arm's guarded area. Inside are a main computer running the vendor's real-time operating system (an operating system that guarantees time-critical tasks run on schedule) and motion software, servo amplifiers (the power electronics that feed current to each joint motor, see [[servo-drive]]), a safety board, I/O cards (terminals for on/off signals to and from other machines), network cards, and power supplies. FANUC, for example, sells the R-30iB Plus in several cabinet sizes, the larger ones with extra room for amplifiers and I/O [3], and its newer R-50iA uses a new six-channel amplifier [8].

Each tick of its interpolation cycle (the fixed beat at which it sends a fresh position target to every joint), the controller steps through the robot program, works out where the tool should be next (see [[trajectory-generation]]), converts that into joint angles, sends those setpoints (target values) to the drives, and reads back joint positions from the encoders (the angle sensors on each motor, see [[encoder]]). Universal Robots e-Series and UR Series arms run this real-time loop at 500 Hz, every 2 ms [1]. KUKA's RobotSensorInterface lets an outside computer correct the path every 12 ms in normal mode or every 4 ms in fast mode on KR C4 and KR C5 controllers [2][9]. The drives then run their own faster feedback loops on motor current and speed between those setpoints.

The teach pendant is a handheld touchscreen with an emergency stop button and a three-position enabling switch (a grip switch that allows motion only while held in the middle; letting go or squeezing hard stops the robot) [5][10]. In manual (teach) mode the robot moves at reduced speed, which OSHA puts at 250 mm/s or less, and only while that switch is held [5]. Modern controllers also run certified safety functions in software, such as FANUC's Dual Check Safety, which monitors robot zones and speeds [3].

Without a controller, nothing coordinates six motors into one straight, smooth tool path, and nothing checks that the arm stays inside its allowed zone. The boundaries are blurring: the R-50iA can run Python scripts and software PLC logic [4], and controllers speak the same networks as PLCs, such as EtherNet/IP, PROFINET, and OPC UA [3].

### On the cheese plate line
Each of the four pick stations (grape, apple, cracker, cheese) has its own controller in a cabinet outside the guarding and away from the washdown spray. At the grape station, the vision PC sends one message per tray, roughly "stem at x, y, rotated this much", and the controller plans the approach and ticks out joint setpoints every few milliseconds [1][2]. When the grape is placed it sets a "pick done" signal that the line PLC reads. At 200 plates an hour the station has 18 seconds per plate, so the controller is rarely short of time; what matters is that it never moves somewhere unexpected.

### Elsewhere
On a car body line, every spot-welding robot has its own controller cabinet, and a programmer teaches each weld point with the pendant in reduced-speed manual mode [5]. Arc welding, where a torch lays a continuous bead along a seam, is the case for outside corrections: where part edges vary, a seam-tracking sensor feeds corrections to a KUKA controller through RSI every 4 ms so the torch follows the real seam rather than the taught one [2][9].

### Why it exists
Coordinating several motors along a precise path, with a new setpoint every few milliseconds and safety checks on every tick, is too timing-critical for an ordinary computer and too specialized for a PLC. Robot makers sell the controller with the arm so they can guarantee the accuracy, speed, and safety ratings of the pair as one tested system.

### Connects to
- [[servo-drive]] — the controller sends setpoints; the drive turns them into motor current.
- [[trajectory-generation]] — the math the controller runs on every interpolation cycle.
- [[vendor-languages]] — how the controller is programmed (KRL, RAPID, TP, URScript).
- [[plc]] — tells the controller when to start each job and hears back when it is done.
- [[safety-circuit]] — can remove motor power regardless of what the controller's program wants.

### Real products and tools
- **FANUC R-30iB Plus and R-50iA** — FANUC's controller families, in Mate, A, and B cabinet sizes, programmed through the iPendant; the R-50iA was announced in the US in August 2024 [3][4].
- **KUKA KR C5** — KUKA's current controller generation alongside the older KR C4, programmed with the smartPAD pendant; supports the RobotSensorInterface option [2][10].
- **ABB OmniCore** — ABB's controller family, programmed with the FlexPendant [11]. ABB agreed in October 2025 to sell its robotics business to SoftBank, with closing planned for mid-to-late 2026 [6]. As of November 2026 the sale had not closed: in a statement dated 5 November 2026, ABB confirmed that China's foreign-investment security review had prohibited the acquisition in China, and said it and SoftBank were still working on the deal [7].
- **Universal Robots control box and teach pendant** — runs the PolyScope software and exposes the 500 Hz RTDE data interface on TCP port 30004 [1].
- **Yaskawa YRC1000** — Yaskawa's controller for its MOTOMAN arms, successor to the DX200 [12].

### Common misconception
**Misconception:** The teach pendant is the robot's computer.

**Reality:** The pendant is mainly a screen, buttons, an emergency stop, and an enabling switch, usually on a cable. The program, the motion math, the motor power electronics, and the safety logic all live in the controller cabinet; the pendant is just how a person talks to it [5].

### Key numbers
- Real-time control loop on Universal Robots e-Series and UR Series: 500 Hz, one update every 2 ms [1].
- External path-correction cycle on KUKA KR C4 and KR C5 with RSI: 4 ms in fast mode to 12 ms in normal mode [2].
- Across these vendors, the motion cycle an outside computer can work with is about 2-12 ms, depending on vendor, controller generation, and interface mode [1][2].

### Sources
1. [Real-Time Data Exchange (RTDE) Guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) — Universal Robots; 500 Hz real-time control loop on e-Series and UR Series, TCP port 30004
2. [KUKA RSI block documentation](https://docs.quanser.com/quarc/documentation/kuka_rsi_block.html) — Quanser (third-party integration docs); RSI update cycle of 12 ms (normal) or 4 ms (fast), RSI versions for KR C4 and KR C5
3. [R-30iB Plus controller series](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) — FANUC America; cabinet types, iPendant, EtherNet/IP, PROFINET, OPC UA, Dual Check Safety
4. [FANUC's new R-50iA robot controller provides powerful performance](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) — FANUC America, 27 August 2024; cabinet sizes, new amplifier, Python, software PLC, IEC 62443 certification
5. [OSHA Technical Manual, Section IV, Chapter 4: industrial robot safety](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) — US OSHA; teach pendants, three-position enabling devices where release or compression stops motion, reduced speed of 250 mm/s or less
6. [Acquisition of ABB Ltd's Robotics Business](https://group.softbank/en/news/press/20251008) — SoftBank Group, October 2025; price, expected closing in mid-to-late 2026, regulatory conditions
7. [Update on divestment of ABB Robotics](https://resources.news.e.abb.com/attachments/published/140154/en-US/0A15DBC92198/20261105_Update_on_divestment_of_ABB_Robotics_EN.pdf) — ABB press release, 5 November 2026; China's foreign-investment security review prohibited the acquisition of the ABB Robotics business in China, ABB and SoftBank still working on the transaction
8. [R-50iA controller](https://www.fanucamerica.com/products/controller-series/r-50ia) — FANUC America; new six-channel amplifier, Mate, A, and B cabinets
9. [KUKA.RobotSensorInterface](https://www.kuka.com/en-de/products/robot-systems/software/hub-technologies/kuka_robotsensorinterface) — KUKA; real-time processing within 4 ms, seam tracking in welding
10. [KUKA smartPAD teach pendants](https://kuka.com/en-de/products/robot-systems/robot-controllers/kuka-smartpad-pro) — KUKA; pendant emergency stop, three-position enabling switch, smartPAD for KSS controllers
11. [OmniCore operating manual](https://www.manualslib.com/manual/2131954/Abb-Omnicore.html) — ABB, via the ManualsLib mirror; OmniCore controller, FlexPendant
12. [YRC1000 controller](https://motoman.com/products/controllers/yrc1000) — Yaskawa Motoman; controller for MOTOMAN robots, successor to DX200

## Onboard computer and GPU
id: onboard-compute
requires: robot-controller
aka: vision PC, industrial PC, IPC, edge computer, Jetson, GPU, PREEMPT_RT, real-time Linux

### Plain
Besides the controller, most modern robot cells have a second computer whose job is understanding the world: looking at camera images and deciding what to grab and where. It works like the signal person on a building site, who watches the spot where a load must land and tells the crane operator, who cannot see it, where to put it, while the operator works the levers. Often this computer is a rugged PC with a graphics chip (GPU), because graphics chips are very good at the kind of math that image recognition and AI use.

### Where the analogy breaks
A signal person talks the operator in continuously, and the operator can see when an instruction makes no sense. A vision computer usually sends one target per pick, its answers take a variable time and sometimes it finds nothing, and the controller cannot judge whether a target is sensible, only whether it is reachable and inside its allowed zones, so a wrong answer becomes a wrong pick.

### Precise
On a fixed arm this is usually an industrial PC (IPC: a PC built for factory cabinets rather than offices) fitted with a GPU (graphics processing unit: a chip with thousands of small cores that do the same arithmetic on many numbers at once, which is what neural networks need). On mobile robots and humanoids the computer rides on the robot and runs from a battery, so power-limited embedded modules (small, complete computer boards built into a product) are common. NVIDIA's Jetson line is one example: Orin Nano up to 67 TOPS at 7-25 W, AGX Orin up to 275 TOPS at 15-60 W, and AGX Thor up to 2070 FP4 TFLOPS at 40-130 W [1][2]. TOPS (trillions of operations per second) and FP4 TFLOPS (trillions of operations per second on 4-bit numbers) are peak figures under ideal conditions, so they are not directly comparable with each other or with what a real model achieves.

What runs here is [[perception]] (finding objects in images), [[grasp-planning]], sometimes [[motion-planning]], and increasingly [[learned-policy]] inference (running an already trained model on new camera frames to get its answer). These jobs take a variable time per frame. An ordinary operating system can also pause any program for several milliseconds to do other work. PREEMPT_RT, the real-time configuration of Linux, makes the kernel (the core of the operating system) almost fully preemptible, meaning a high-priority task can interrupt nearly anything, and it moves interrupt handling (the code that responds when hardware signals for attention) under the control of the scheduler (the part of the kernel that decides which task runs next); the result is a shorter delay between a time-critical task becoming ready and actually running [4]. After about 20 years as a separate patch set, it was merged into mainline Linux in version 6.12, released 17 November 2024 [3]. Real-time here means a bounded worst-case delay, not more speed.

The vision PC usually hands its result to the robot controller over plain Ethernet once per pick, which is acceptable because a late answer delays one pick rather than making the motion jerky. The same IPC hardware can also host control software: Beckhoff's TwinCAT 3 runs one or more PLCs on an industrial PC under Windows, TwinCAT/BSD, or Beckhoff RT Linux [5]. Without this computer, a robot can only repeat fixed motions, and every part must be presented in exactly the same place by a fixture.

### On the cheese plate line
The grape station is where this computer earns its place: no two grape bunches have the same shape, and they land anywhere on the tray. A camera above the conveyor feeds a vision PC (an IPC with a GPU, in the line's control cabinet), which runs a model that finds the stem, converts its pixel position into robot coordinates using [[hand-eye-calibration]], and sends one target per tray to the grape robot's controller. Cracker packs and cheese wedges are far more uniform, so a simpler 2D vision tool may be enough there, and one GPU PC can serve several stations. With 18 seconds per plate, even an illustrative 200 ms inference is a small slice of the budget; the harder requirement is that it is right nearly every time.

### Elsewhere
A warehouse autonomous mobile robot can carry a Jetson-class module on board, running localization (working out where it is on the map) and camera perception from its battery, which is why a 15-60 W power envelope matters [2]. The protective stop that keeps it from hitting people does not come from that AI computer. The MiR250, for example, watches for people with two SICK nanoScan3 safety laser scanners giving 360° coverage, and its 12 safety functions are designed to ISO 13849-1, the machinery safety standard; the robot stops whenever one of them trips [6].

### Why it exists
Robot controllers are built for timing guarantees, not heavy image math, and their vendors tightly control what software runs on them. A separate computer lets a team use GPUs, Linux, Python, and AI libraries and update them on its own schedule, without touching the certified motion and safety system.

### Connects to
- [[perception]] — the main workload: finding objects in images and point clouds.
- [[on-robot-inference]] — running learned models within the robot's power and latency budget.
- [[robot-controller]] — receives targets from this computer and owns the motion.
- [[camera-2d]] — the sensor whose images it processes.
- [[ros2]] — a common software framework on these computers.

### Real products and tools
- **NVIDIA Jetson AGX Thor (T5000, T4000)** — the top of NVIDIA's Jetson module line as of November 2026, up to 2070 FP4 TFLOPS at 40-130 W [1].
- **NVIDIA Jetson AGX Orin, Orin NX, and Orin Nano** — the previous Jetson generation, from up to 275 TOPS down to 67 TOPS [1].
- **Industrial PCs with GPU cards** — from IPC makers such as Beckhoff, Siemens (SIMATIC IPC), and Advantech, used as vision PCs in control cabinets.
- **Linux with PREEMPT_RT** — the real-time configuration of mainline Linux since 6.12 [3][4].
- **Beckhoff TwinCAT 3** — runs PLC and motion software on an industrial PC [5].

### Common misconception
**Misconception:** A faster GPU makes the robot respond in real time.

**Reality:** Real-time means a guaranteed worst-case deadline, not a high average speed. A GPU raises throughput, but inference time still varies from frame to frame and an ordinary operating system can delay any program. That is why deadline-critical loops stay in the robot controller and drives, and why PREEMPT_RT is about shortening scheduling delay rather than computing faster [4].

### Key numbers
- Jetson Orin Nano: up to 67 TOPS at 7-25 W on one NVIDIA page and 40 TOPS at 7-15 W on another, so check which power mode a figure assumes [1][2].
- Jetson AGX Orin: up to 275 TOPS at 15-60 W [1][2].
- Jetson AGX Thor: up to 2070 FP4 TFLOPS at 40-130 W [1].
- PREEMPT_RT in mainline Linux since 6.12, released 17 November 2024 [3].

### Sources
1. [Jetson Modules](https://developer.nvidia.com/embedded/jetson-modules) — NVIDIA; AI performance and power ranges for Jetson AGX Thor, AGX Orin, Orin NX, and Orin Nano
2. [NVIDIA Jetson Orin](https://www.nvidia.com/en-eu/autonomous-machines/embedded-systems/jetson-orin/) — NVIDIA; AGX Orin up to 275 TOPS at 15-60 W, earlier Orin Nano figures
3. [Linux 6.12](https://kernelnewbies.org/Linux_6.12) — Kernel Newbies; real-time patch set merged into mainline after 20 years, release date
4. [PREEMPT_RT theory of operation](https://docs.kernel.org/core-api/real-time/theory.html) — Linux kernel documentation; full preemptibility, threaded interrupts, reduced scheduling latency
5. [TC1200 TwinCAT 3 PLC](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) — Beckhoff; one or more PLCs on an industrial PC, supported operating systems (Windows, TwinCAT/BSD, TwinCAT/RTOS, Beckhoff RT Linux)
6. [MiR250 specifications](https://mobile-industrial-robots.com/products/robots/mir250/specifications) — Mobile Industrial Robots; two SICK nanoScan3 safety laser scanners front and rear for 360° protection, 12 safety functions according to ISO 13849-1, robot stops when one triggers

## PLC
id: plc
requires: photo-eye
aka: programmable logic controller, line controller, scan cycle, scan time, process image

### Plain
A PLC is a small, rugged computer that runs a machine or a whole production line by checking switches and sensors and switching motors, valves, and lights on and off. It works like the controller box for a traffic light: look at the sensors, decide, set the lights, and repeat. A PLC runs that loop many times per second, without stopping, and is built to keep doing so for years in a dusty, vibrating factory.

### Where the analogy breaks
A traffic light mostly follows a timer and a few sensors, while a line PLC reads hundreds of inputs and coordinates many machines and robots. It also does not wait for events: it re-reads every input on every loop, whether anything changed or not.

### Precise
A programmable logic controller (PLC) is an industrial computer that reads inputs (on/off signals and analog signals, which vary smoothly like a pressure reading, from sensors, switches, and other machines), runs a user program, and writes outputs (signals to motor starters, valves, lamps, and other machines). It was invented as an electronic replacement for hard-wired relay panels: General Motors' Hydramatic division asked for one in 1968, and the result, built in 1969, was the Modicon 084 [1]. Physically it is a CPU module plus I/O modules on a rail or rack in the line's control cabinet, with remote I/O blocks near the machines connected over an [[industrial-network]].

It runs a scan cycle: read every input into memory (the process image, a snapshot so the logic sees one consistent moment), execute the program from top to bottom, and write every output [1]; most controllers then handle communications and diagnostics before the next scan [unverified: vendor manuals that describe this step did not load]. The time for one loop is the scan time, or cycle time. It ranges from as little as 50 µs on fast PC-based controllers [2] to tens of milliseconds, which is often quoted as typical [1], depending on program size, processor speed, and how much I/O and network traffic each scan handles. Because an input that changes just after being read waits for the next scan, a sensor change can take up to about two scans to reach an output. PLCs are a classic hard real-time system: an output must follow an input within a bounded time [1]. Most PLCs also time their own scan with a watchdog (a timer that faults the controller and turns outputs off if a scan runs too long) [unverified: standard vendor feature; the vendor manuals I tried did not load].

PLCs are programmed in the IEC 61131-3 languages: Ladder Diagram (drawn like relay wiring), Function Block Diagram, Structured Text (a Pascal-like text language), and Sequential Function Chart (steps and transitions) [1][2]. Instruction List was deprecated in the 2013 third edition [1], and a fourth edition followed in May 2025 [4]. See [[plc-programming]]. Without a PLC, nothing coordinates which machine moves when, so trays collide or stations wait forever. The lines are blurring here too: PC-based runtimes put PLCs on industrial PCs [2], and FANUC's R-50iA robot controller runs software PLC logic itself [3].

### On the cheese plate line
The line PLC is the conductor: it tells the denester to drop a tray, indexes the conveyor one plate pitch at a time, and at each pick station trades handshake signals with the robot controller ("tray in place" out, "pick done" in). A [[photo-eye]] at each station tells it that a tray has arrived; if the vision PC finds no grape or the robot reports a failed pick, the PLC marks that tray so the [[inspection]] station rejects it. A new tray reaches each station every 18 seconds, so an illustrative 10 ms scan is far faster than the line needs; scan time matters for the quick events, such as firing the reject gate as the bad plate passes. The lidding machine probably arrives with its own PLC from its builder, and the line PLC coordinates with it over the network.

### Elsewhere
PLCs started in car plants: GM wanted to stop rewiring relay panels for every model change [1]. On a car body line today, the line PLC sequences clamps, turntables, and dozens of robots, telling each robot which body style is arriving and when to start its program [unverified: general industry practice, no plant source opened].

### Why it exists
Before PLCs, line logic was walls of hard-wired relays, and every change meant rewiring cabinets [1]. A PLC replaced the wiring with a program while keeping what factories valued about relays: predictable timing, ruggedness, and logic an electrician can read and troubleshoot.

### Connects to
- [[plc-programming]] — the languages and patterns used to write the scan logic.
- [[photo-eye]] — the most common PLC input on a conveyor line.
- [[industrial-network]] — how the PLC reaches remote I/O, drives, and robot controllers.
- [[hmi]] — the touchscreen operators use to see and command what the PLC is doing.
- [[state-machines]] — PLC programs for a line are mostly state machines, one per station.

### Real products and tools
- **Siemens SIMATIC S7-1500 and S7-1200** — Siemens PLC families, programmed in TIA Portal.
- **Rockwell Automation Allen-Bradley ControlLogix** — Rockwell's Logix PLC family, programmed in Studio 5000 Logix Designer [1].
- **Beckhoff TwinCAT 3 PLC** — a PLC runtime on an industrial PC with cycle times from 50 µs [2].
- **CODESYS** — an IEC 61131-3 development system and runtime that hardware makers license for their controllers; its maker says at least 400 device manufacturers offer it [5].
- **FANUC R-50iA software PLC** — an example of PLC logic moving into a robot controller [3].

### Common misconception
**Misconception:** A PLC reacts the instant a sensor changes, like an interrupt handler.

**Reality:** A normal PLC only looks at its inputs at the start of each scan, and writes its outputs at the end. A pulse shorter than one scan can be missed entirely, which is why very fast signals, such as encoder pulses, go to dedicated high-speed counter modules that count independently of the scan [1].

### Key numbers
- Scan time: from about 50 µs on fast PC-based PLCs [2] to tens of milliseconds, often quoted as typical [1], depending on program size, processor, and I/O and communication load.
- First PLC: the Modicon 084, built in 1969 for General Motors [1].

### Code sketch
```text
// One PLC scan, repeated forever. Cheese plate line, grape station only.
// Illustrative pseudocode; real code would be IEC 61131-3 ladder or Structured Text.
// Assumes an indexing conveyor that moves one plate pitch when every station is done.

loop forever:
    scan_start = now()

    // 1. READ INPUTS into the process image (a snapshot).
    //    The logic below sees these values even if a sensor flips mid-scan.
    tray_at_grape   = read_input(PHOTO_EYE_GRAPE)      // tray has arrived
    robot_done      = read_input(GRAPE_ROBOT_DONE)     // handshake from robot controller
    robot_failed    = read_input(GRAPE_ROBOT_FAIL)
    safety_ok       = read_input(SAFETY_PLC_STATUS)    // status only: the safety PLC
                                                       // stops machines by itself

    // 2. EXECUTE PROGRAM: plain logic on the snapshot, top to bottom.
    if not safety_ok:
        grape_state = STOPPED
    switch grape_state:
        case WAIT_TRAY:
            if tray_at_grape and conveyor_idle:
                robot_start = true
                grape_state = PICKING
        case PICKING:
            if robot_done:
                robot_start = false
                grape_station_done = true
                grape_state = WAIT_INDEX
            else if robot_failed:
                robot_start = false
                mark_for_reject(tray_id_at(GRAPE))      // inspection station will reject it
                grape_station_done = true
                grape_state = WAIT_INDEX
        case WAIT_INDEX:
            if conveyor_indexed:                        // set by the conveyor rung below
                grape_station_done = false
                grape_state = WAIT_TRAY
        case STOPPED:
            robot_start = false                         // operator must restart from the HMI

    // Conveyor rung: index one pitch only when every station is done.
    index_conveyor = all_stations_done() and safety_ok

    // 3. WRITE OUTPUTS: copy the output image to the physical outputs together.
    write_output(GRAPE_ROBOT_START, robot_start)
    write_output(CONVEYOR_INDEX, index_conveyor)

    // 4. HOUSEKEEPING: HMI, robot, and plant network traffic; diagnostics.
    service_communications()

    // Scan-time watchdog: a scan that runs too long is a fault, not a slow scan.
    if now() - scan_start > WATCHDOG_LIMIT:
        fault_and_turn_outputs_off()
```

### Sources
1. [Programmable logic controller](https://en.wikipedia.org/wiki/Programmable_logic_controller) — Wikipedia; read-execute-write scan, scan time typically tens of milliseconds, hard real-time, IEC 61131-3 languages and IL deprecation, Modicon 084 history, counter modules for encoders, ControlLogix and Studio 5000
2. [TC1200 TwinCAT 3 PLC](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) — Beckhoff; PLC on an industrial PC, IEC 61131-3 languages, cycle times from 50 µs
3. [FANUC's new R-50iA robot controller provides powerful performance](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) — FANUC America, August 2024; software PLC functions in ladder and structured text
4. [IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533) — IEC webstore; edition 4.0, published 22 May 2025
5. [CODESYS](https://en.wikipedia.org/wiki/CODESYS) — Wikipedia; IEC 61131-3 IDE and licensed runtime, manufacturer's count of at least 400 device makers

## Industrial networks
id: industrial-network
requires: plc, robot-controller
aka: fieldbus, industrial Ethernet, EtherCAT, PROFINET, EtherNet/IP, Modbus TCP, IO-Link, OPC UA, deterministic network

### Plain
Industrial networks are the cables and rules that let the PLC, robots, motor drives, and sensors talk to each other. The big difference from an office network is timing: it works like a train timetable rather than road traffic, with every device holding a reserved seat on a train that leaves at exactly the same moment every few milliseconds. On a road, cars usually arrive quickly but sometimes sit in a jam, and a machine cares far more about never being late than about being fast on average.

### Where the analogy breaks
Only some industrial networks truly reserve the track. PROFINET's normal class, RT, shares ordinary network switches with other traffic and only gets priority over it, so heavy traffic can push its frames up to about 100 µs off schedule; PROFINET IRT and EtherCAT exist to remove that wobble [2][7][1]. And a late message cannot be made up later the way a late passenger can, because the control loop has already moved on, so devices watch for missing data instead of waiting for it.

### Precise
A deterministic network is one whose worst-case delivery time is known and bounded, with little jitter (the cycle-to-cycle wobble in when data arrives). Office Ethernet with TCP is not deterministic: switches (the boxes that pass traffic between cables) queue frames (individual packets on the wire) behind other traffic, and TCP re-sends lost packets, so most messages are quick but a few are very late. Industrial protocols get determinism by exchanging the same small block of data with every device on a fixed cycle (cyclic I/O, which behaves like a shared memory refreshed on a clock) and, in the fastest systems, by special hardware and synchronized clocks.

The three big real-time families each have their own governing organization. EtherCAT (EtherCAT Technology Group) sends one frame that passes through every device in turn, each reading and inserting its data on the fly; it was designed for cycles of 100 µs or less, distributed clocks (a clock in every device, kept in step with one reference clock) keep jitter well under 1 µs, and one segment can hold up to 65,535 devices [1]. PROFINET (PROFIBUS and PROFINET International) has an RT class over ordinary switches, with cycles anywhere from 250 µs to 512 ms but typically 1-10 ms, and jitter of about 100 µs on a well-designed network [2][7], and an IRT class that reserves bandwidth and synchronizes clocks to within about 1 µs for cycles down to 31.25 µs, which needs certified Conformance Class C devices and switches [2][7][11]. EtherNet/IP (ODVA) carries the Common Industrial Protocol (CIP: a shared vocabulary of device types and messages) over standard TCP/IP, using UDP (which sends packets without waiting for acknowledgements) for its real-time cyclic I/O [3].

The others fill different roles. Modbus TCP, descended from a 1979 Modicon protocol, uses TCP port 502; the client polls each device's registers in turn, and the original protocol has no built-in security [4]. A separate Modbus/TCP Security protocol, published in 2018, wraps it in TLS (the encryption layer HTTPS uses) on port 802 [9]. IO-Link (IEC 61131-9) is a point-to-point link from a master port to one sensor or actuator over an unshielded cable up to 20 m, at 4.8, 38.4, or 230.4 kbaud (thousands of signal changes per second, roughly thousands of bits per second), and it carries parameters and diagnostics, such as a sensor reporting that its lens is getting dirty, as well as the basic signal [5][8]. OPC UA (OPC Foundation) is a platform-independent, secured way to publish structured machine data, with X.509 certificates (the same kind of digital identity certificate HTTPS uses), encryption, and client-server or publish-subscribe modes [6]; it is how line data reaches plant software, not how motors are driven.

Safety signals can share these cables through safety protocols such as PROFIsafe [2] and CIP Safety [3]. PROFIsafe, for example, adds its own sequence numbers, timeouts, and checksums so the network underneath does not have to be trusted [2] (see [[safety-circuit]]). Without determinism, coordinated motion stutters, timing-sensitive logic such as a reject gate fires at the wrong moment, and cycle times wander unpredictably.

### On the cheese plate line
The line PLC is the network controller on PROFINET (or EtherNet/IP, depending on the PLC brand chosen), and each robot controller, the conveyor drives, and remote I/O blocks exchange a few bytes with it every few milliseconds, such as "tray in place" and "pick done". The vision PC talks to the grape robot over an ordinary TCP connection once per tray, which is fine because a late answer delays one pick rather than disturbing motion. The vacuum switch on the cracker station's bellows cup is IO-Link, so the PLC sees the actual vacuum level, not just "vacuum yes or no", and can warn when it drifts as the cup wears [5]. Plate counts and fault codes go up to the plant's dashboards over OPC UA (see [[oee]]).

### Elsewhere
A packaging machine whose servo axes must move in step, such as a flow wrapper (which wraps each bar or biscuit pack in a tube of film and seals it), is the job EtherCAT's distributed clocks and PROFINET IRT were built for: every axis must take its new position at the same instant, and synchronized clocks keep devices within about 1 µs of each other. EtherCAT's makers name packaging machines and coordinated multi-axis servo motion among its uses [1], and PI says some drive and motion control applications need IRT [11]. The same machine then reports its speed, counts, and alarms to the factory over OPC UA [6].

### Why it exists
Wiring every sensor separately back to a cabinet means huge cable bundles and slow fault-finding, while office networks cannot promise when a message will arrive. Industrial networks put hundreds of devices on a few cables and keep the bounded timing that control loops and safety functions need.

### Connects to
- [[plc]] — usually the network's controller, exchanging data with every device each cycle.
- [[servo-drive]] — receives position or velocity setpoints over EtherCAT or PROFINET IRT.
- [[safety-circuit]] — safety protocols ride the same cables on top of the normal traffic.
- [[udp-vs-tcp]] — why cyclic real-time traffic avoids TCP's retransmission.
- [[telemetry-logs]] — OPC UA and similar protocols carry line data up to plant software.

### Real products and tools
- **EtherCAT** — protocol from the EtherCAT Technology Group [1]; a Beckhoff EK1100 coupler connects a rail of I/O terminals to an EtherCAT network.
- **PROFINET and PROFIsafe** — from PROFIBUS and PROFINET International [2]; PROFINET interfaces are standard on Siemens SIMATIC S7-1500 PLCs [12].
- **EtherNet/IP and CIP Safety** — from ODVA [3]; native to Rockwell Logix PLCs [unverified: Rockwell's pages blocked automated access].
- **IO-Link masters** — modules that bridge IO-Link sensors onto the PLC's network [5].
- **OPC UA servers** — built into many PLCs and robot controllers for plant-level data [6].
- **Wireshark** — open-source packet analyzer that can decode EtherCAT, PROFINET, EtherNet/IP, and Modbus TCP traffic for troubleshooting [10].

### Common misconception
**Misconception:** Deterministic means fast.

**Reality:** It means predictable: every message arrives within a known worst-case time. A Modbus TCP poll over a quiet network can be quick on average, yet nothing bounds its worst case [4]; a PROFINET RT cycle of several milliseconds may be slower on average, but it repeats every cycle with a wobble that PI puts at about 100 µs on a well-designed network [2][7]. Control loops need the guarantee more than the average.

### Key numbers
- EtherCAT: designed for cycles of 100 µs or less, jitter well under 1 µs, up to 65,535 devices per segment [1].
- PROFINET: RT 250 µs to 512 ms, typically 1-10 ms, jitter about 100 µs on a well-designed network; IRT 250 µs by default and down to 31.25 µs with jitter under about 1 µs, depending on conformance class and network hardware [2][7][11].
- IO-Link: 4.8, 38.4, or 230.4 kbaud on cables up to 20 m; minimum transmission time about 400 µs at 230.4 kbaud [5][8].
- Modbus TCP: TCP port 502; Modbus/TCP Security: port 802 [4][9].

### Sources
1. [EtherCAT technology](https://www.ethercat.org/en/technology.html) — EtherCAT Technology Group; on-the-fly processing, cycle-time target, distributed clocks for coordinated multi-axis servo motion, devices per segment, packaging machines as an application
2. [PROFINET](https://en.wikipedia.org/wiki/PROFINET) — Wikipedia; conformance classes, RT frames given top VLAN priority in ordinary switches, RT and IRT cycle times, clock synchronization, PROFIsafe
3. [EtherNet/IP](https://www.odva.org/technology-standards/key-technologies/ethernet-ip/) — ODVA; CIP over TCP/IP, UDP for real-time cyclic data, CIP Safety and CIP Motion
4. [Modbus](https://en.wikipedia.org/wiki/Modbus) — Wikipedia; 1979 Modicon origin, TCP port 502, client polling, data model, no built-in security
5. [IO-Link](https://en.wikipedia.org/wiki/IO-Link) — Wikipedia; point-to-point link, IEC 61131-9, cable length, baud rates, diagnostics
6. [OPC Unified Architecture](https://opcfoundation.org/about/opc-technologies/opc-ua/) — OPC Foundation; platform independence, information modeling, security, client-server and publish-subscribe
7. [Is PROFINET deterministic?](https://us.profinet.com/is-profinet-deterministic/) — PROFINET North America site; RT cycles of 512 ms down to 250 µs with about 100 µs jitter depending on network design, RT jitter under heavy traffic, IRT down to 31.25 µs with 1 µs jitter
8. [IO-Link wiring](https://www.ifm.com/us/en/shared/technologies/io-link/technology/io-link-wiring) — ifm; unshielded standard cables up to 20 m, three transmission rates
9. [Modbus Security: new protocol to improve control system security](https://www.modbus.org/news/modbus-security-new-protocol-to-improve-control-system-security) — Modbus Organization, October 2018; traditional Modbus on port 502, Modbus Security with TLS and X.509 certificates on port 802
10. [Wireshark display filter reference: EtherCAT](https://www.wireshark.org/docs/dfref/e/ecat.html) — Wireshark; EtherCAT dissector (sibling pages cover PROFINET IO, EtherNet/IP, and Modbus/TCP)
11. [PROFINET IRT, isochronous real time](https://us.profinet.com/?p=19941) — PROFINET North America site; some drive and motion control applications need IRT, IRT 250 µs by default, down to 31.25 µs with suitable hardware, jitter under 1 µs, every switch certified to Conformance Class C
12. [Simatic S7](https://en.wikipedia.org/wiki/Simatic_S7) — Wikipedia; PROFINET interfaces standard on S7-1500 CPUs

## Safety circuits
id: safety-circuit
requires: plc, servo-drive
aka: safety relay, safety PLC, dual-channel wiring, safe torque off, STO, performance level, PL, SIL, functional safety

### Plain
Safety circuits are a separate, deliberately simple set of wiring and electronics whose only job is to stop dangerous motion when a door opens, a light beam is broken, or a button is pressed. Like a car's brakes, which are split into two independent circuits so that one leak does not leave you with no brakes at all, safety circuits are doubled and constantly cross-check each other. If the two halves ever disagree, the system assumes the worst and stops.

### Where the analogy breaks
Car brakes need you to press the pedal to stop, whereas safety circuits work the other way round: they need a healthy signal to let the machine run, so a cut wire or a dead power supply also stops it. And a car with one failed brake circuit can still be driven, but a safety circuit tests itself continuously and, once it finds a fault in one channel, keeps the machine off until the fault is repaired and someone resets it.

### Precise
A safety function is one specific protective action, such as "stop the grape robot when its door opens". It has three parts: an input device (door switch, light curtain, emergency stop), a logic device (safety relay or safety PLC), and an output (contactors, which are heavy-duty, electrically operated switches for motor power, or the drive's safe torque off input). Dual-channel wiring runs two independent signals from the input device to the logic, which checks that they agree and treats any disagreement as a fault. ISO 13849-1 calls these redundant, self-checking structures categories 3 and 4. In category 3, no single component failure may cause loss of the safety function; category 4 must also catch every fault at the next self-test, so even several faults building up between tests cannot lose it [1].

A safety relay is a fixed-function module, usually for one safety function. It contains two internal relays with forced-guided contacts (contacts mechanically linked so that a welded contact cannot go unnoticed), takes two input channels, and uses a feedback loop to check that the external contactors really dropped out, so it refuses to restart after a fault [3]. A safety PLC does the same job programmably for many functions, with a restricted instruction set plus safety-specific instructions [7] and internally redundant, self-testing hardware [unverified: vendor safety manuals blocked automated access]. Safety I/O can sit on the ordinary network using a "black channel" protocol: the safety layer adds its own checks, so the network itself need not be trusted. Beckhoff's Safety over EtherCAT and PROFIsafe both reach SIL 3 (the top machinery rating, explained below) this way, PROFIsafe using sequence numbers, timeouts, address checks, and checksums [5][6].

The usual output is safe torque off (STO), a drive input that, when removed, guarantees no torque-producing energy reaches the motor and prevents an unexpected start [4]. The standard that defines STO and related drive safety functions is IEC 61800-5-2, and STO on its own is a stop category 0 [8]. STO alone removes torque at once, so an axis coasts or drops onto its holding [[brake]]; a controlled stop first ramps the motor down and only then removes torque (the stop categories are in [[estop]]).

Ratings come in two parallel systems. Performance level (PL, ISO 13849-1, fourth edition 2023) has five bands, a to e, of average probability of dangerous failure per hour, from just under 1 in 10,000 per hour at the top of PL a down to 1 in 100 million at the bottom of PL e [1]. Safety integrity level (SIL, defined in IEC 61508 and applied to machinery by IEC 62061) runs SIL 1 at 10⁻⁶ to 10⁻⁵ per hour, SIL 2 at 10⁻⁷ to 10⁻⁶, and SIL 3 at 10⁻⁸ to 10⁻⁷ [2]; PL c, d, and e line up roughly with SIL 1, 2, and 3, the pairing used for protective sensors in IEC 61496-1 [9]. The 2011 edition of the robot standard ISO 10218-1 set PL d as a blanket requirement for robot safety functions; the 2025 edition instead sets a PL for each safety function from the risk assessment [10]. Without safety circuits, a software bug, a welded relay, or a cut wire could leave a robot powered while someone reaches in.

### On the cheese plate line
Each pick cell has an interlocked door with a dual-channel switch, the open outfeed slot where an operator works has a light curtain (the tray tunnels are too small to reach through, see [[guarding]]), and every station has an emergency stop; all of them wire into one safety PLC for the line, and in this design each function targets PL d. Opening the grape cell door makes the safety PLC open both channels of the grape robot controller's safety input, so the controller brakes the arm along its path and then removes torque (a category 1 stop, see [[estop]]). At the same moment the safety PLC removes STO from the conveyor drive directly. The other robots then pause because the line PLC sees the safety status and stops sending trays, not because the safety PLC stopped them. The line PLC can read every safety signal but cannot override any of them.

### Elsewhere
In a car body shop, opening a cell gate makes the safety PLC stop every robot in that cell through each robot controller's safety input. Those safety signals can travel as PROFIsafe or CIP Safety on the same Ethernet cable as the normal I/O, so adding a robot does not mean pulling new safety wiring back to a central cabinet [6].

### Why it exists
Normal control electronics fail in ways nobody predicted: a software bug, a welded relay, a shorted cable. Safety circuits are kept simple, doubled, self-testing, and separate from normal control so that no single failure can leave a person exposed to moving machinery, and so their failure probability can be calculated and certified.

### Connects to
- [[estop]] — the most familiar input to a safety circuit.
- [[guarding]] — door switches, light curtains, and scanners that feed safety functions.
- [[safety-standards]] — ISO 13849, IEC 62061, and ISO 10218 set the required ratings.
- [[servo-drive]] — receives STO, the usual output of a safety function.
- [[industrial-network]] — carries safety protocols as a layer on top of ordinary traffic.

### Real products and tools
- **Pilz PNOZ** — a long-running family of safety relays; Pilz introduced the first PNOZ, an emergency-stop relay, in 1987 [11].
- **Siemens SIMATIC S7-1500F** — fail-safe ("F") versions of the S7-1500 PLC, rated up to SIL 3 and PL e [12].
- **Rockwell Automation GuardLogix** — safety PLCs built on the Logix family [7].
- **Beckhoff TwinSAFE** — safety logic in EtherCAT terminals using Safety over EtherCAT, up to SIL 3 [5].
- **FANUC Dual Check Safety and ABB SafeMove** — certified safety functions inside robot controllers that limit zones and speeds.

### Common misconception
**Misconception:** You can make a machine safe by adding a door check to the normal PLC program.

**Reality:** A standard PLC has single-channel I/O, no proof that its outputs actually switched off, and a program anyone with the software can change. A safety function needs rated hardware with redundancy and diagnostics sized to a required PL or SIL [1][2]; the normal PLC may read safety status, but it is not what stops the machine.

### Key numbers
- PL bands a to e: average probability of dangerous failure from just under 10⁻⁴ per hour (top of PL a) down to 10⁻⁸ per hour (bottom of PL e) [1].
- SIL 1 to 3 (continuous operation): 10⁻⁶ to 10⁻⁵, 10⁻⁷ to 10⁻⁶, and 10⁻⁸ to 10⁻⁷ dangerous failures per hour [2].
- Diagnostic coverage (the share of dangerous faults the self-tests catch): 60-99% for categories 2 and 3, 99% or more for category 4 [1].

### Code sketch
```text
// Inside a safety relay or safety PLC: monitoring one dual-channel door switch.
// Illustrative pseudocode; certified devices run tested, certified firmware.

every safety cycle:
    ch1 = read(DOOR_CH1)        // true = door closed (contact closed, current flows)
    ch2 = read(DOOR_CH2)        // second, independent contact on the same door

    if ch1 and ch2:                                  // both say closed
        disagree_time = 0
        if fault_latched:
            enable = false                           // stays off until repaired and reset
        else if reset_button_pressed_then_released:
            enable = true                            // never restarts by itself
    else if not ch1 and not ch2:                     // both say open
        disagree_time = 0
        enable = false                               // normal protective stop
    else:                                            // channels disagree
        enable = false
        disagree_time += cycle_time
        if disagree_time > DISCREPANCY_LIMIT:        // a short window, set during design
            fault_latched = true                     // welded contact or short suspected

    // Output side: two contactors, or the two STO inputs of each drive.
    write(OUTPUT_CH1, enable)
    write(OUTPUT_CH2, enable)

    // Feedback loop: confirm the outputs really dropped out when commanded.
    if not enable and feedback_says_contactor_closed:
        fault_latched = true
```

### Sources
1. [ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) — Wikipedia; performance level range (PL a below 10⁻⁴ to PL e at or above 10⁻⁸ per hour), categories B to 4, diagnostic coverage per category, fourth edition 2023
2. [Safety integrity level](https://en.wikipedia.org/wiki/Safety_integrity_level) — Wikipedia; SIL bands and failure rates per hour from IEC 61508, IEC 62061 for machinery
3. [Safety relay](https://en.wikipedia.org/wiki/Safety_relay) — Wikipedia; two-channel inputs, forced-guided contacts, feedback loop, restart prevention
4. [Safe Torque Off](https://en.wikipedia.org/wiki/Safe_Torque_Off) — Wikipedia; definition of STO, prevents unintended start
5. [TwinSAFE](https://www.beckhoff.com/en-us/products/automation/twinsafe/) — Beckhoff; safety logic in EtherCAT terminals, Safety over EtherCAT black channel, SIL 3 per IEC 61508
6. [PROFINET](https://en.wikipedia.org/wiki/PROFINET) — Wikipedia; PROFIsafe up to SIL 3 and PL e, consecutive numbering, timeout monitoring, source and destination authentication, CRC
7. [Programmable logic controller](https://en.wikipedia.org/wiki/Programmable_logic_controller) — Wikipedia; safety PLCs with a restricted instruction set plus safety instructions, GuardLogix and Siemens F-series examples
8. [STO, Safe Torque Off according to IEC 61800-5-2](https://download.sew-eurodrive.com/download/html/31960413/en-EN/28733575051.html) — SEW-EURODRIVE manual; inverter stops supplying torque-producing power, uncontrolled stop category 0
9. [Relationship between the type of an ESPE and the SIL/PL](https://dguv.de/medien/ifa/en/pra/bws/info_bws_sil_pl_en.pdf) — IFA (German Social Accident Insurance), January 2015; IEC 61496-1 pairs SIL 1 with PL c, SIL 2 with PL d, SIL 3 with PL e
10. [More safety for humans and machines](https://www.sick.com/br/en/more-safety-for-humans-and-machines/w/blog-robotic-norm-iso10218) — SICK, September 2025; blanket PL d in the previous ISO 10218, per-function PL in the 2025 edition
11. [Pilz GmbH & Co. KG](https://de.wikipedia.org/wiki/Pilz_GmbH_%26_Co._KG) — German Wikipedia; first PNOZ emergency-stop relay in 1987
12. [Simatic S7](https://en.wikipedia.org/wiki/Simatic_S7) — Wikipedia; fail-safe S7-1500F CPUs up to SIL 3 and PL e

## Emergency stop
id: estop
requires: safety-circuit
aka: e-stop, emergency stop button, mushroom button, stop category 0, stop category 1, stop category 2, Not-Halt

### Plain
An emergency stop is the big red button that anyone can hit to stop a machine when something is going wrong. It works like the emergency handle on a train: one pull from any passenger stops the train, and it stays stopped until a crew member resets things. Resetting it does not restart anything; it only allows someone to start the machine again on purpose.

### Where the analogy breaks
A train handle stops one train, but an e-stop on a line stops a zone that a designer has to define, from one machine to the whole line. And an e-stop is a backup to guards, not a substitute for them, so a pressed e-stop is not protection for climbing inside a machine [1][11].

### Precise
In the EU, the Machinery Directive requires e-stop controls to be clearly identifiable, visible, and quickly reachable, and to stop the hazard as quickly as possible without creating new risks. Once pressed, the stop command must stay latched until someone deliberately releases it, and releasing it must not restart the machine, only allow a restart. It must work in every operating mode [1]. Where machines work together, the e-stop must also stop related equipment whose continued running could be dangerous [1]. The Directive is replaced by Regulation (EU) 2023/1230, which applies from 20 January 2027; the original text said 14 January, and a 2023 corrigendum moved it [5][6]. ISO 13850 sets the design principles for the e-stop function, the usual colors are a red button on a yellow background, and the button is wired normally closed (current flows until it is pressed) so that a broken wire also stops the machine [2][4].

IEC 60204-1 defines three stop categories. Category 0 removes power from the motors at once, an uncontrolled stop in which axes coast or drop onto brakes. Category 1 is a controlled stop: the motors brake under power, then power is removed. Category 2 is a controlled stop with power left on, holding position, and should be used only where cutting power is technically impossible or would itself be dangerous [2]. OSHA describes a robot's safety-rated monitored stop, which keeps power to the motors, as a category 2 stop under the US standard NFPA 79 [3]. An emergency stop itself must be category 0 or 1 under IEC 60204-1 and NFPA 79 [7]. Which of the two a robot uses depends on the vendor and its settings: ABB's IRC5 controller, for example, ships with its emergency stop set to category 0 and can be reconfigured [8].

The hardware is a mushroom-head pushbutton with contacts that the button's mechanism forces open rather than relying on a spring (direct-opening contacts, required by the e-stop device standard IEC 60947-5-5) [9], usually two contacts wired as two channels into a safety relay or safety PLC (see [[safety-circuit]]). It latches when pressed and is released by turning, pulling, or a key [2]. Along conveyors, rope-pull switches let anyone stop the line from any point on a pull-wire. Without latching, a button could spring back and the machine restart; without normally closed wiring, a broken wire would silently disable the stop.

### On the cheese plate line
There is an e-stop at every station, one on each teach pendant, and a rope-pull along the conveyor. Because each station depends on the trays arriving from the one before, any e-stop stops the whole line, which also matches the rule that related equipment must stop together [1]. In this design the robots use a category 1 stop (brake along the path, then remove torque) and the light conveyor uses category 0. After someone releases and resets the e-stop, the line PLC requires a deliberate start from the HMI and sends any tray that was mid-pick to reject.

### Elsewhere
Escalators have red emergency stop buttons at the top and bottom that any rider can press. They show why "as quickly as possible" does not mean "as abruptly as possible" [1]: stopping a loaded escalator instantly could throw riders down the steps, so escalator codes cap braking deceleration at about 0.9-1 m/s², 0.91 m/s² in the US code ASME A17.1 and 1.0 m/s² in the European EN 115 [10].

### Why it exists
Guards and sensors handle the hazards someone foresaw, but something unexpected always happens: a jammed tray, a caught sleeve, a robot heading somewhere it should not. The e-stop gives any person one unmistakable action that stops the hazard without depending on software.

### Connects to
- [[safety-circuit]] — the dual-channel wiring and logic an e-stop feeds into.
- [[servo-drive]] — safe torque off and controlled braking carry out the stop categories.
- [[brake]] — holds vertical axes when power is removed in a category 0 or 1 stop.
- [[safety-standards]] — ISO 13850, IEC 60204-1, and machinery law set the requirements.
- [[guarding]] — the primary protection; the e-stop is the backup.

### Real products and tools
- **Mushroom-head e-stop pushbuttons** — such as Schneider Electric's trigger-action e-stops built to IEC 60947-5-5 [9]; red on yellow, latching, released by turning, pulling, or a key [2].
- **Rope-pull emergency stop switches** — pull-wire switches along conveyors, made by safety-switch vendors such as Schmersal.
- **Teach pendant e-stops** — every pendant carries one, so the person programming the robot can always stop it.
- **Safety relays and safety PLCs** — monitor the e-stop's two channels and remove power (see [[safety-circuit]]).

### Common misconception
**Misconception:** Hitting the e-stop cuts all power instantly, and that is always the safest way to stop.

**Reality:** Cutting power at once (category 0) lets motors coast or drop onto their brakes, which can take longer or throw a load. Many machines brake under control first and then cut power (category 1), and a few hazards require power to stay on [2]. The rule is to stop as quickly as possible without creating new risks [1]. A pressed e-stop also does not lock out energy: OSHA's lockout rule says push buttons and other control-circuit devices are not energy-isolating devices, so an e-stop is no substitute for lockout before reaching into a machine [11].

### Sources
1. [Directive 2006/42/EC on machinery](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) — EUR-Lex; Annex I 1.2.4.3 emergency stop and 1.2.4.4 assemblies of machinery
2. [Not-Halt](https://de.wikipedia.org/wiki/Not-Halt) — German Wikipedia; stop categories 0, 1, 2 per EN 60204-1:2018 and ISO 13850, red on yellow, latching and reset
3. [OSHA Technical Manual, Section IV, Chapter 4: industrial robot safety](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) — US OSHA; safety-rated monitored stop as a category 2 stop per NFPA 79
4. [Kill switch](https://en.wikipedia.org/wiki/Kill_switch) — Wikipedia; ISO 13850, normally closed wiring, turn-to-reset buttons
5. [Regulation (EU) 2023/1230 on machinery](https://eur-lex.europa.eu/eli/reg/2023/1230/oj) — EUR-Lex; repeals Directive 2006/42/EC (Article 51), date of application in Article 54 as originally published
6. [Corrigendum to Regulation (EU) 2023/1230](https://eur-lex.europa.eu/eli/reg/2023/1230/corrigendum/2023-07-04/oj/eng) — EUR-Lex, OJ L 169, 4 July 2023; corrects the application date from 14 to 20 January 2027
7. [Standards and options for e-stops](https://www.controldesign.com/articles/2021/standards-and-options-for-e-stops/) — Control Design, 2021 (trade press quoting Omron and Phoenix Contact); e-stop must be category 0 or 1 under IEC 60204-1 and NFPA 79, red on yellow, self-latching
8. [IRC5 robot stopping functions](https://www.manualslib.com/manual/2133741/Abb-Irc5.html?page=13) — ABB product manual, via the ManualsLib mirror; stop categories per IEC 60204-1, emergency stop defaults to category 0
9. [Emergency stop and emergency switching-off pushbuttons](https://www.se.com/ie/en/faqs/FA23719) — Schneider Electric FAQ; trigger action, mechanical latching, direct opening action, IEC 60947-5-5
10. [Innovative technologies that improve escalator passenger safety](https://liftescalatorlibrary.org/paper_indexing/papers/00000567.pdf) — R. S. Smith, University of Northampton, Lift and Escalator Library; maximum braking deceleration 1.0 m/s² (BS EN 115-1) and 0.91 m/s² (ASME A17.1), lower rates cause fewer falls
11. [29 CFR 1910.147, control of hazardous energy (lockout/tagout)](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147) — US OSHA; push buttons and control-circuit devices are not energy-isolating devices
