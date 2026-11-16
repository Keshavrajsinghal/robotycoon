---
ride: ride3
title: The rescue
order: 3
teaches: 9
---

# Ride 3: The rescue

## Intro
### Plain
A grape bunch tangles in the tote, the robot's grip fails, and a person 1,000 km away takes over the arm through live video. This ride is a stopwatch: each stop adds the time it costs to get a picture from the robot to the operator's screen, and a command from the operator's hand back to the arm. Like a relay race, the total depends on every runner, and the slowest ones are often not the network. The numbers are illustrative of one setup; real ones change with the network, the video compression, and the distance.

### Precise
The grape station is a washdown six-axis arm (an arm with six joints, built like a human arm from waist to wrist) with soft fingers that picks bunches from a tote. That pairing is a design judgment for this line, offered as a reasonable fit rather than the only workable choice.

When a pick fails, the station first asks for [[teleop-modes|remote assist]] (the robot asks a narrow question, a person answers with a hint, and the robot does the motion itself). Most of the time one click is enough. This bunch is knotted to a second one, which a click cannot fix, so the operator switches to direct control (the operator's device streams motion commands many times a second and the robot follows them). In direct control the person closes the loop: they see each result and correct the next move. Every delay sits inside that loop.

The meter follows area 9's illustrative [[latency-budget|latency budget]] (an itemized account of every millisecond from something happening at the robot to the robot responding to the operator) for an untuned setup: operator 1,000 km away, a 30 fps (frames per second) camera, an encoder that waits for future frames, LTE (a cellular data link, as phones use) at the plant, a large jitter buffer (a holding queue that smooths uneven packet arrival), a 60 Hz (times per second) office monitor, and a 100 Hz command bridge (the program that forwards the operator's commands to the arm's controller). That adds about 400 ms of machine delay around the loop, plus the operator's own reaction time. A range on a stop is either a wait for the next slot (the next camera frame, the next screen refresh) or a range area 9 gives; the meter adds the midpoints. Real numbers depend on the network, the codec (the video compression method), and the distance.

## Stop: pick-fails
title: Pick fails
cargo: Grape bunch dangling from the fingers
cargo_detail: Tangled with a second bunch; the grip check failed
concepts: state-machines, soft-gripper, perception, teleop-modes
delay_ms: 0

### Plain
The arm closes its soft fingers around a grape bunch and lifts, but the bunch is knotted to a second one and hangs half out of the grip. Like a cook whose recipe card says what to do if the sauce burns, the robot's program has a written step for this: stop and ask for help. The rescue stopwatch starts here, at zero.

### Precise
The station runs a [[state-machines|state machine]] (a program that is always in exactly one of a fixed list of states, and moves to another only along a defined arrow): WAIT_TRAY, DETECT, PLAN, APPROACH, GRIP, VERIFY, PLACE, RETREAT. Soft fingers (molded rubber fingers with air channels that curl them around the bunch when inflated) cope with odd shapes, but most feel nothing, and a bunch can shift inside the grip. So in this design the VERIFY state takes a second picture (an illustrative design choice). Perception (the software that turns images into an object, a position, and a confidence score) reports that the bunch is not seated. The tangle also hides the stem, which is what drags confidence down. The machine follows its failure arrow to a NEED_HELP state instead of PLACE.

What breaks without that arrow: a state machine handles only the failures someone wrote down in advance. One forgotten arrow leaves the station stuck, or carrying on and dropping a half-held bunch onto the tray edge or conveyor. The confidence threshold is set from measured hit rates on images from the real line, because a learned model's confidence score is not a measured probability.

### Question
The VERIFY step finds the bunch hanging half out of the soft fingers. What should the station's program do next?
- [ ] Place it anyway; the bunch will settle into the grip during the move :: Items shift and tilt inside a soft grip, so a half-held bunch can fall onto the tray edge or the conveyor.
- [ ] Nothing special; soft fingers sense the slip and regrip on their own :: Most soft grippers feel nothing and simply curl to a set air pressure. The check has to come from somewhere else, here a second picture.
- [x] Stop the pick and post a request for help, with a time limit :: This follows a written failure arrow. A state machine handles only the failures someone wrote down. A help state with a timeout keeps the line moving at 18 s per plate.
- [ ] Retry the same grasp until it works :: An open-ended retry can stall the station on a bunch it cannot pick, and the station has 18 s per plate. Real sequences cap retries: the cheese station's logic, for example, allows two attempts and then flags the tray.

## Stop: help-request
title: Help request
cargo: Alert ticket: grape station needs help
cargo_detail: One still image and a narrow question
concepts: teleop-modes, fleet-management
delay_ms: 0

### Plain
The station sends a help ticket with one photo and a short question, like texting a friend "which one do I grab?" Control room software finds a free remote operator and puts the ticket on their screen. The operator sees two bunches knotted together, which one click cannot fix, so they take the controls.

### Precise
[[fleet-management|Fleet management]] software (a server that watches many robots through a small agent program on each) raises the alert and routes it to an operator's console. The agent dials out to the server, so the plant firewall never has to accept incoming connections. The ticket is a remote-assist request (the robot asks a narrow question, such as "click the grape stem," then plans and executes the motion itself once answered).

Remote assist tolerates seconds. At 200 plates an hour the station has 18 s per plate, and area 9's sketch lets the plate pass after 8 s with no answer (an illustrative timeout). That slack is why one operator can cover all four pick stations (illustrative staffing). Here a click is not enough, so the operator switches to direct control (streaming motion commands that the arm follows), which ties up one operator for the whole takeover.

This stop adds 0 ms to the meter on purpose. Waiting for a free operator happens once, before the loop starts; the meter counts one trip around the live control loop, which repeats for every correction. What breaks without a fleet system: nobody sees which station is stuck or whom to call, and faults are found when production stops.

### Question
Most deployed fleets prefer remote assist to direct control when a robot gets stuck. Why?
- [ ] In remote assist the person still drives the arm the whole time, just with a simpler controller :: The robot runs on its own and the person answers a narrow question, such as where the stem is. Waymo, for example, states that its remote agents advise and do not drive.
- [x] A few seconds of delay is fine, and one operator can serve many robots :: An answer that takes a few seconds still works: the robot plans and executes the motion itself, so the person is outside the control loop. Direct control ties up one operator per robot for the whole takeover.
- [ ] Direct control needs more bandwidth, and bandwidth is the main cost of teleoperation :: The hard part of direct control is delay inside the loop, not capacity. A fast link with a long queue in front of it still lags.
- [ ] Remote assist needs no network connection, because the robot decides alone :: The robot still sends an image and waits for an answer. If none comes within its timeout (8 s in area 9's illustrative sketch), it lets the plate pass.

## Stop: capture
title: Capture
cargo: Raw video frame from the wrist camera
cargo_detail: 1280x720 color, about 22 Mbit before compression
concepts: latency-budget, camera-2d, video-pipeline
delay_ms: 20-53

### Plain
The camera on the robot's wrist takes 30 pictures a second. Like reaching a bus stop just after the bus left, the moment the operator needs to see may fall just after a picture, so it waits for the next one. Then the picture soaks up light, is read off the chip row by row, and is turned into color.

### Precise
Three costs, all before any compression or network. First, the wait for the next frame: at 30 fps (frames per second) a new frame starts every 33 ms, so an event waits 0-33 ms, about 17 ms on average. Second, exposure (how long the pixels collect light) plus readout (copying pixel values off the sensor one row at a time): 720 rows at 10 microseconds per row is about 7 ms, and dim light needs a longer exposure. Area 9's budget uses 15 ms for both (illustrative). Third, the ISP (image signal processor: the stage that turns raw sensor values into a color image): about 5 ms here (illustrative; one vendor measured about 4-8 ms per 1080p frame on an NVIDIA Jetson Orin accelerator).

In the stop's range, 20-53 ms, the 20 ms is fixed work and the spread is the frame wait. Frame rate matters even when nothing else changes: with a 60 Hz monitor, one lab measured a mean glass-to-glass delay (from light entering the lens to the matching image leaving the screen) of 50.4 ms with a 25 fps camera and 15.5 ms with a 300 fps camera. What breaks if you leave this stage out of the budget: you blame the network. In one teleoperated-driving rig the camera took an estimated 120 ms of about 193 ms glass-to-glass.

### Question
Why does raising the camera from 30 to 60 fps cut delay, even if nothing else in the system changes?
- [ ] It does not: delay comes from the network, and frame rate only makes motion look smoother :: The wait for the next frame is real delay. One lab measured a mean glass-to-glass of 50.4 ms at 25 fps and 15.5 ms at 300 fps with the same monitor.
- [ ] Each frame is read off the sensor faster at a higher frame rate :: Readout time is rows times row time, set by the sensor and how many rows are read, not by how often frames are taken.
- [ ] Frames taken at a higher rate travel over the network faster :: Network time depends on distance and the link, not on how often pictures are taken. At 60 fps there are more frames to send, not faster ones.
- [x] The wait for the next frame slot halves, about 17 to 8 ms :: An event waits for the next frame slot: about 17 ms on average at 30 fps, 8 ms at 60. This is a wait, not work: it costs half a frame interval on average, so a faster frame rate shrinks it directly.

## Stop: encode
title: Encode
cargo: Compressed H.264 frame
cargo_detail: Mostly just what changed since the last frame
concepts: video-pipeline, latency-budget
delay_ms: 70

### Plain
The raw picture is far too big for an internet link, so the robot squeezes it, mostly by describing only what changed since the last picture. This squeezer is set up like a live-streaming default: like a sports commentator who waits to see how a play ends before describing it, it holds pictures back so it can describe them more briefly. That saves data but costs time the operator can feel.

### Precise
A codec (a video compression standard) shrinks each frame. This station uses H.264, which every browser that implements WebRTC (the web standard for live video between two devices) must support. An I-frame (a complete picture) is large; a P-frame (only the differences from earlier frames) is small. Periodic I-frames, also called keyframes, arrive as big bursts.

Two settings meant for streaming add delay. A B-frame (a frame that also refers to a later frame) makes the encoder wait for that later frame: at least one frame interval each, 33 ms at 30 fps. Lookahead (holding several upcoming frames to judge how hard they are before sharing out bits) delays output until those frames arrive. Area 9's budget puts this untuned encoder at about 70 ms (illustrative). NVIDIA's low-latency recipe leaves out lookahead and avoids the B-frame wait (for H.264 in its SDK, that means no B-frames), uses CBR (constant bitrate: a steady data rate with no bursts), keeps the encoder buffer to one frame, and replaces keyframes with intra refresh (repairing one stripe of the picture each frame). In the budget that brings the stage to about 5 ms.

What breaks without compression: raw 1280x720 color video at 60 fps is about 1.3 Gb/s, and half that at 30 fps, far beyond a typical uplink. What breaks with streaming-style settings: YouTube's live advice of 2 B-frames and a 2-second keyframe interval suits viewers who accept seconds of delay, not an operator steering an arm.

### Question
The operator says the video lags. A teammate proposes switching the codec from H.264 to AV1. Which change would most likely cut the lag?
- [x] Keep H.264, but turn off B-frames and lookahead :: Encoder delay comes mostly from settings. With a one-frame encoder buffer as well, area 9's budget takes the stage from about 70 ms to about 5 ms.
- [ ] Switch to AV1, since newer codecs are faster :: Codecs trade computation for bits. AV1 saves bandwidth, but in software it can be far slower: over 500 times H.264's encoding time in one 4K study using its 2018 reference encoder.
- [ ] Raise the bitrate so each frame keeps more detail :: Bitrate trades against quality, not delay. The encoder still waits for future frames, and bigger frames take longer to push onto the link.
- [ ] Make every frame a keyframe, so no frame ever has to wait for or depend on another :: That does remove the wait for future frames, but complete pictures are large, so every frame takes longer to push onto the link, and lookahead can still hold frames back. Intra refresh repairs the picture without those bursts.

## Stop: send
title: Send
cargo: Stack of packets for one frame
cargo_detail: Encrypted RTP packets, sent over UDP
concepts: webrtc, udp-vs-tcp, video-pipeline, latency-budget
delay_ms: 15

### Plain
The squeezed picture is cut into small pieces called packets, like a long letter copied onto a stack of postcards, and pushed onto the plant's internet link. Postcards travel on their own: if one goes missing, the rest do not wait for it. A big picture means more postcards, so it takes longer to push out.

### Precise
[[webrtc|WebRTC]] (the browser standard for live video and data between two devices) carries the frame. Its RTP packets (the standard packet format for live media, each carrying a timestamp) travel as SRTP (encrypted, tamper-checked RTP) over UDP (User Datagram Protocol: independent packets with no ordering and no resending). Earlier, ICE (WebRTC's procedure for finding a working network path) found a way out through the plant firewall. If no direct path works, a TURN relay (a server that forwards every packet) adds an extra hop.

Pushing a frame onto the link takes its size divided by the uplink rate: a 20.8 kb frame at 1.38 Mb/s takes 15 ms. Area 9 gives about 1-15 ms for this stage. This budget uses 15 ms (illustrative) because the untuned encoder sends bursty frame sizes, such as keyframes (complete pictures, which are large). CBR (a steady data rate) and intra refresh (repairing one stripe of the picture each frame instead of sending whole keyframes) make frames steady, about 4 ms.

What breaks over TCP (Transmission Control Protocol: reliable, in-order delivery): one lost packet holds up everything behind it until it is resent, at least one round trip later. At 30 fps a frame is due every 33 ms, so the resend arrives after its frame was needed, and every later frame waits too.

### Question
Why does the live video ride on UDP rather than TCP, which guarantees every packet arrives?
- [ ] UDP packets travel through the cables faster :: Both travel at the same physical speed, about 200 km per millisecond in fiber. The difference is what happens after a loss.
- [x] Resends arrive too late, and under TCP later frames wait behind them :: A resent packet would arrive after its frame was needed: at 30 fps a frame is due every 33 ms, and a resend takes at least one round trip. Under TCP every later frame would wait for it. UDP lets the receiver skip the gap and move on.
- [ ] UDP never loses packets on a good network, so reliability is not needed :: UDP has no resending at all, and loss still happens, for example on plant Wi-Fi. WebRTC handles it with resends that fit the budget, extra recovery data, or intra refresh.
- [ ] TCP would work just as well once Nagle's algorithm is turned off :: Turning off Nagle stops TCP holding back small writes, but a lost packet still blocks everything behind it for at least one round trip.

## Stop: network-out
title: Network out
cargo: Scattered packets, one missing
cargo_detail: 1,000 km of fiber plus the plant's LTE link
concepts: network-impairments, latency-budget, udp-vs-tcp
delay_ms: 48

### Plain
The packets cross 1,000 km to the operator's office. Like buses on a busy route, they can arrive late, bunched together, or not at all. The distance itself costs only about five thousandths of a second; the plant's cellular link costs far more.

### Precise
Propagation (travel time through the cables): light in optical fiber covers about 200 km per millisecond, so 1,000 km costs about 5 ms one way. Real routes are longer than straight lines and add routers and queues. The plant uplink is LTE (a cellular data link, as phones use), which added about 35 ms (median) over a wired network in one teleoperated-driving rig. Area 9's budget uses 48 ms one way for this path (illustrative).

Two impairments ride along. Jitter (variation in delay from one packet to the next): round trips over LTE from a moving car varied with a 29.5 ms standard deviation in one study. Packet loss (packets that never arrive): a lost video packet damages every frame that refers to it until intra refresh (repairing one stripe of the picture each frame) repairs the picture. Resending helps only if the copy arrives before the frame is due.

What goes wrong if you judge this stage by a ping (a tiny test packet timed there and back): a ping measures tiny packets, not video frames. On a 5G testbed, sending each frame over the network took about 15 ms of a roughly 193 ms glass-to-glass delay (from light entering the lens to the image leaving the screen).

### Question
Which single change would shorten this stage the most for this setup?
- [ ] Move the operator from 1,000 km to 50 km away :: Fiber costs about 5 ms per 1,000 km, so this saves under 5 ms each way. Distance is rarely the big number.
- [ ] Buy ten times more bandwidth on the same LTE link :: If the link is not congested, capacity is not the problem. LTE's added delay and jitter stay; lag is usually delay and jitter, not capacity.
- [ ] Resend every lost packet until it arrives :: Each resend waits at least a round trip, so the copy arrives after its frame was needed. For live video, a late packet is as useless as a lost one.
- [x] Replace the plant's LTE uplink with a wired connection :: LTE added about 35 ms (median) in one rig. In area 9's budget the one-way time drops from 48 to 12 ms, and jitter falls too, which helps the next stop.

## Stop: decode-display
title: Decode and display
cargo: Picture on the operator's screen
cargo_detail: A 60 Hz office monitor, 1,000 km from the plant
concepts: latency-budget, network-impairments, video-pipeline
delay_ms: 98-114

### Plain
At the operator's desk the packets wait briefly in a holding line, like a theme park queue that lets riders on at a steady pace even though they arrive in clumps. Then the computer unpacks the picture, and the screen shows it at its next redraw. The holding line is the biggest wait in this part, because the cellular link delivers packets so unevenly.

### Precise
Three stages. The jitter buffer (a short holding queue that releases frames on a steady schedule) must cover the spread in arrival times: bigger means fewer stutters but more delay. For this LTE (cellular) link, area 9's budget uses a large 80 ms buffer (illustrative). A wired link has little jitter, and the buffer can shrink to about 15 ms. Decode (unpacking the compressed frame): up to about 10 ms; 8 ms here, and a hardware decoder halves it in the budget (illustrative). Display: the monitor redraws on a fixed beat, so a finished frame waits 0-16.7 ms for the next refresh at 60 Hz (times per second), 8.3 ms on average, plus the monitor's own processing. The budget uses 18 ms in all for the display (illustrative).

The spread in the range, 98-114 ms, is the refresh wait. The video half of the loop is now done: about 276 ms glass-to-glass (from light entering the camera lens to the matching image leaving the screen) in this budget. Measured rigs did better: 150-200 ms over LTE in one, and about 193 ms over 5G in another.

What breaks without a jitter buffer: frames that arrive in clumps play in jerks, and a frame that misses its slot is skipped, so the picture must be repaired.

### Question
At shift change, bulk uploads of inspection images fill the plant's link. What happens to the operator's view?
- [x] The view lags tens of ms more, as queues and jitter grow :: Router queues grow, jitter climbs, and the jitter buffer grows to cover it. Area 9's illustrative case adds 50-80 ms of lag. The fixes are network priority for teleop traffic, a cap on bulk uploads, and an encoder that follows the congestion controller's lower estimate.
- [ ] Nothing, as long as the link has spare capacity on average :: While the uploads fill the link there is no spare capacity at that moment, whatever the average says. Router buffers fill first, adding delay and jitter for everyone before any packet is dropped.
- [ ] Some frames drop, but the ones that arrive are as fresh as before :: Queues form before drops, so arriving frames are older too, and the jitter buffer holds them longer to smooth them out.
- [ ] A 120 Hz monitor would cancel out the extra lag :: Going from 60 to 120 Hz cuts the average refresh wait from 8.3 to 4.2 ms, about 4 ms, far less than tens of ms.

## Stop: operator
title: Operator
cargo: Operator command: ease bunches apart
cargo_detail: A SpaceMouse push, capped at 50 mm/s (illustrative)
concepts: teleop-modes, operator-interfaces, latency-budget
workbench: wb5-teleop
delay_ms: 213-239

### Plain
A person at a desk watches the video and pushes a hand controller to guide the arm. It is like steering a car by watching a slightly late video of the road: they always react to what happened a moment ago. A simple reaction takes about a fifth of a second, and working out how to untangle two bunches takes longer.

### Precise
This is direct control (the operator's device streams motion targets many times a second and the robot follows them). The device is a SpaceMouse (a 6-DOF puck, meaning six independent directions of motion: push, pull, or twist a knob to move the tool along and around three axes), set up with an enable button that must stay held for any motion, speed capped at 50 mm/s, and the gripper on a button (illustrative settings). It commands velocity, so it needs a dead zone (a small band around the resting position that counts as zero), or a resting hand makes the arm drift. Commands are expressed in the camera's view, so "push away" means away on screen.

The meter adds a simple visual reaction time, about 213-231 ms mean, plus a wait of 0-8 ms for the next device reading (the computer asks the puck for a reading 125 times a second over USB, so about 4 ms on average; illustrative). That is a rough stand-in. Decisions take longer, and people predict and move continuously, so delay changes how they work more than it adds one fixed step. Area 9's machine budget leaves the human out for that reason.

Targets come from human studies. Below 150 ms one way, most applications feel essentially transparent (ITU-T G.114, a telecom standards body's guideline on delay); in a telesurgery study, delays of 100 ms or less were acceptable. At delays of seconds, operators fall back to moving, then waiting to see the result. With about 400 ms of machine delay, this operator is far outside the comfortable zone.

### Question
With about 400 ms of machine delay around the loop, what happens when the operator tries to nudge the bunch quickly?
- [ ] It feels transparent, because 400 ms is within ITU-T's 400 ms planning limit :: 400 ms is the one-way planning limit, not a comfort level. Essentially transparent interactivity needs under 150 ms one way, and highly interactive tasks can suffer from less.
- [ ] The 50 mm/s speed cap removes the problem, because slow motion cannot overshoot :: The cap limits how far the arm moves during the delay, but the operator still acts on an old picture. It reduces the damage; it does not remove the lag.
- [x] Each result shows up late, so quick corrections overshoot :: Operators slow down, and at long delays they move and wait. If they hold a push until they see the arm move and then let go, the arm has gone about 20 mm by the time the release reaches it (50 mm/s times about 400 ms; arithmetic). At a 3.5 s delay, every subject in a 1970 MIT study moved, then waited to see the result.
- [ ] A VR headset would remove the lag by making the view immersive :: Immersion helps judge depth, not delay. In GELLO's study, VR controllers reached 0.72 success versus 0.92 for a simple leader arm.

## Stop: network-back
title: Network back
cargo: Small command packet heading back
cargo_detail: A speed target with a sequence number and send time
concepts: udp-vs-tcp, webrtc, watchdogs, latency-budget
delay_ms: 48

### Plain
The command travels back over the same 1,000 km and the same cellular link, so it pays the same toll as the video. It is tiny, so pushing it onto the link takes almost no time, unlike a video frame. If one gets lost, the next one arrives a hundredth of a second later and takes its place.

### Precise
Commands ride a WebRTC data channel (a message channel that shares the video's connection). The "cmd" channel is unordered with zero retransmits (a lost message is never resent) and carries velocity commands 100 times a second, because a late velocity command is worse than a lost one. A second channel, "events," is reliable and ordered, for things that must arrive: gripper close, mode switches, and heartbeats (small "still alive" messages sent on a timer, here 20 times a second; illustrative). The physics match the video's path: about 48 ms one way in this budget, of which LTE (a cellular data link) adds about 35 ms (illustrative).

Each command carries a sequence number and a send time, so the robot drops late or duplicate commands and keeps only the newest. What breaks over TCP (reliable, in-order delivery): one lost command holds back the next ones until the resend lands, at least one round trip later. Then they arrive in a burst, and the arm lurches through stale motions. If the loss is caught by a timer instead, the standard wait starts at 1 second.

### Question
One command packet is lost on the way back. Commands use an unordered, no-retransmit channel at 100 Hz. What does the robot do?
- [ ] Waits for the lost command to be resent, so motions stay in order :: That is TCP's behavior: later commands wait at least a round trip, then arrive in a burst, and the arm lurches through stale motions.
- [x] Uses the next command, about 10 ms later; the lost one is simply replaced :: For a velocity command refreshed every 10 ms, only the newest one matters.
- [ ] Stops at once, because any loss means the link is down :: The watchdog timeout (250 ms here, illustrative) must be longer than normal jitter, or the robot would stop for no reason.

## Stop: robot-executes
title: Robot executes
cargo: Bunch in the fingers, then in the tray
cargo_detail: Freed, gripped, and placed by the arm itself
concepts: watchdogs, latency-budget, teleop-modes
delay_ms: 70

### Plain
The arm's controller receives the command and starts to move, smoothing it so the arm does not jerk. Like a train's dead-man's pedal, the robot keeps checking that commands are still coming; if they stop, it stops by itself and keeps hold of the bunch. Once the bunch is free and gripped, the robot places it in the tray on its own.

### Precise
Two stages close the loop. The controller cycle (the fixed beat at which new commands are read) is 10 ms at 100 Hz through this setup's bridge, versus 2 ms at 500 Hz through an interface such as Universal Robots' RTDE (a real-time data link into the arm's controller). This stage counts a whole cycle, not the half-cycle average wait of a camera frame or a USB poll: a command waits about half a cycle for the next read, then the bridge needs time to receive it and pass it to the arm (illustrative). Then motion: a smoothing filter softens each new target. On one arm the smoothing setting alone spans 30-200 ms; a low value reacts fast, and a high value prevents overshoot. Area 9's budget uses 60 ms (illustrative), so 70 ms in all. In this ride's design, once the bunches are apart and one is gripped, the operator hands control back and the station's own program places it.

Around the whole loop that is about 398 ms of machine delay, plus the operator's reaction: about 620 ms on the meter. For scale, a measured 5G teleoperated-driving rig had about 500 ms end to end, not counting human reaction.

Safety stays local. A [[watchdogs|watchdog]] (a timer that triggers a safe action when an expected signal stops arriving) brings the arm to a controlled stop (braking smoothly to a halt and holding position, rather than cutting power) if no fresh command arrives within 250 ms, keeping the gripper closed so the bunch is not dropped. After 2 s without heartbeats it ends the takeover, parks the arm, and lets the next plate pass without grapes so inspection rejects it (illustrative values). At the 50 mm/s cap, a 250 ms timeout allows up to 12.5 mm of motion before the stop begins (arithmetic), plus braking distance. What breaks without the watchdog: interfaces such as RTDE keep their last input value, so a dropped link could leave a velocity command running. The hardwired emergency stop works whether or not the link is up.

### Question
Mid-move, the operator's link drops. What should happen, and where must that decision live?
- [ ] Nothing needs building: when a connection drops, the robot just stops :: Many interfaces keep the last value; Universal Robots' RTDE notes that its inputs retain their last received value, so a velocity command could keep running.
- [ ] Cut motor power immediately, the safest possible stop :: A powered-down arm can coast or drop its load. Teleop systems usually command a controlled stop and hold position, and keep the hardwired emergency stop for real emergencies.
- [ ] The operator's browser sends an emergency stop over the network :: The link is the thing that failed, and a stop sent over a network cannot guarantee timing. The guaranteed stop must live on the robot.
- [x] The robot's own computer notices the silence and makes a controlled stop :: It sees no fresh command within its timeout, stops, and keeps hold of the bunch. Only the local side can guarantee timing. The remote operator can ask for a stop, but the guarantee that it happens never depends on the network.

## Puzzle
title: Get direct control under 150 ms
type: budget

### Prompt
The meter ended near 620 ms. About 222 ms of that is the operator's own reaction, which no purchase removes. The other 398 ms is machine delay around the loop: video out plus command back. Direct control wants that loop near 150 ms. ITU-T's guideline for essentially transparent interactivity is below 150 ms one way, and this loop covers both directions.

The ride's meter showed where the machine delay sits: capture about 37 ms (including the wait for the next frame), encode 70 ms, send 15 ms, the network 48 ms each way, decode and display about 106 ms (80 ms of it the jitter buffer), the wait for the next device reading about 4 ms, and the arm 70 ms (a 10 ms controller cycle plus 60 ms of smoothing).

Choose improvements that bring the machine loop to 150 ms or less within 12 effort points. The model is illustrative: delays and savings come from area 9's budget for this one setup, costs are invented effort points, and savings simply add, which real systems only roughly do.

### Data
```json
{
  "start_ms": 398,
  "target_ms": 150,
  "budget": 12,
  "unit": "effort points",
  "options": [
    {
      "id": "encoder-settings",
      "label": "Low-latency encoder settings: no B-frames, no lookahead, one-frame buffer, CBR with intra refresh",
      "saves_ms": 76,
      "cost": 2,
      "why": "Removes the wait for future frames and the keyframe bursts: encode drops from about 70 to 5 ms and send from 15 to 4 ms in area 9's budget. Encoder delay comes from settings, not from a newer codec."
    },
    {
      "id": "wired-uplink",
      "label": "Wired uplink instead of LTE, with the jitter buffer shrunk to match",
      "saves_ms": 137,
      "cost": 6,
      "why": "LTE added about 35 ms (median) in one rig. Wired, the budget's one-way time drops from 48 to 12 ms in both directions, and steady arrival lets the jitter buffer shrink from 80 to 15 ms. A small buffer on the LTE link would just stutter."
    },
    {
      "id": "camera",
      "label": "Camera at 60 fps, brighter light, on-chip image processing",
      "saves_ms": 20.4,
      "cost": 2,
      "why": "60 fps halves the average wait for the next frame (about 17 to 8 ms), brighter light allows a shorter exposure (15 to 5 ms), and on-chip processing saves about 2 ms."
    },
    {
      "id": "operator-screen",
      "label": "120 Hz monitor in game mode and a hardware decoder at the operator's desk",
      "saves_ms": 13,
      "cost": 2,
      "why": "A 120 Hz monitor halves the average refresh wait and game mode trims processing (18 to 9 ms); a hardware decoder takes decode from 8 to 4 ms."
    },
    {
      "id": "input-polling",
      "label": "1000 Hz USB polling for the SpaceMouse",
      "saves_ms": 3.5,
      "cost": 1,
      "why": "125 Hz polling makes a push wait up to 8 ms, about 4 on average; 1000 Hz cuts that to about 0.5 ms. Small, but cheap."
    },
    {
      "id": "controller-rate",
      "label": "500 Hz controller interface instead of a 100 Hz bridge",
      "saves_ms": 8,
      "cost": 2,
      "why": "A 100 Hz bridge reads commands every 10 ms; a 500 Hz interface such as Universal Robots' RTDE reads them every 2 ms. Counting a whole cycle for receiving and acting on each command, that saves about 8 ms."
    },
    {
      "id": "smoothing",
      "label": "Lighter command smoothing on the arm",
      "saves_ms": 30,
      "cost": 1,
      "why": "Halving the smoothing (60 to 30 ms) makes the arm respond sooner. A low setting reacts fast but can overshoot, so it needs tuning on the real arm."
    },
    {
      "id": "more-bandwidth",
      "label": "Ten times more bandwidth on the same LTE link",
      "saves_ms": 13.5,
      "cost": 4,
      "why": "This link was not congested, so the only gain is the time to push each frame onto the link: at ten times the rate, the send stage drops from 15 to about 1.5 ms. LTE's added delay, its jitter, and the 80 ms buffer all stay. The gain also overlaps the encoder option, which already brings that stage to 4 ms, so together they save less than the sum. Lag here is delay and jitter, not capacity."
    },
    {
      "id": "av1",
      "label": "Switch the codec from H.264 to AV1",
      "saves_ms": 0,
      "cost": 3,
      "why": "Codecs trade computation for bits. AV1 saves bandwidth this link does not need, can be far slower to encode in software, and is not one of the codecs WebRTC browsers are required to support. Encoder delay comes from settings."
    },
    {
      "id": "closer-operator",
      "label": "Staff operators 50 km from the plant instead of 1,000 km",
      "saves_ms": 9.5,
      "cost": 5,
      "why": "Light in fiber covers about 200 km per ms, so 1,000 km costs about 5 ms each way and 50 km about 0.25 ms. That saves about 9.5 ms over both directions, at the price of staffing near the plant."
    }
  ]
}
```

### Debrief
Every solution includes low-latency encoder settings (about 76 ms, cheap in this model) and a wired uplink with a smaller jitter buffer (about 137 ms); together they cover most of the 248 ms. In this model lighter smoothing (30 ms) is also needed, plus one more saving of at least 5 ms to reach 150 ms: the 60 fps camera, the 120 Hz monitor, or the 500 Hz controller interface (faster USB polling alone falls just short). Distance, bandwidth, and a newer codec did little: the 1,000 km of fiber costs only about 5 ms each way, extra bandwidth only shortens the 15 ms send stage, and AV1 changes the bit count, not the wait. Every useful option together reaches about 110 ms, area 9's tuned loop, but costs more than the budget.

Switching to remote assist changes the problem instead of racing it. The operator clicks the stem on one still image, and the robot plans and executes the pick itself, with its own collision checks and limits. The person is no longer inside the control loop, so the answer has seconds, not 150 ms: at 18 s per plate, a reply within a few seconds keeps the plate on schedule, and one operator can cover several stations. Waymo's remote agents work at a median one-way latency of about 150 ms to its U.S. centers (so about 300 ms there and back, twice this puzzle's target), fine for advice but poor for steering, which is why they advise rather than drive. Direct control stays for the rare case a click cannot fix, with the watchdog standing by.
