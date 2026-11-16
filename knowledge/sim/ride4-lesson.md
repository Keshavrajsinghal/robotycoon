---
ride: ride4
title: The lesson
order: 4
teaches: 8, 10
---

# Ride 4: The lesson

## Intro
### Plain
This ride follows the recording of ride 3's rescue after the operator lets go of the arm. The recording travels to the cloud, joins many other rescues, and becomes training data for a new model. The model is tested in a simulator and on real grapes, then shipped back to the grape station one step at a time. One rescue is one example: the model only changes once many like it have been collected.
### Precise
The loop is a data pipeline (the system that moves robot recordings from the station to storage, sorts and labels them, and turns them into training data) feeding a learned policy (the station software that turns camera images and joint angles into arm motions, trained from examples instead of hand-written rules). Teams often call this loop a data flywheel: every deployed robot becomes a data collector. Ride 3's takeover is the input. A takeover recording holds exactly the situation the model handled badly plus a person showing the fix, which often makes it worth more than an ordinary successful pick.

Assumptions on this ride. The grape station is a washdown six-axis arm with soft fingers picking bunches from a tote; that robot choice is this site's judgment call (see area 1), not a sourced rule. Ride 3 drew the station's steps as a state machine with separate detect and plan steps. This ride assumes ride 2's learned mode instead: one small learned policy replaces the steps from camera image to joint targets, while the sequencing around it, the safety circuit, and the PLC (the line's controller) stay the same. The rollout and fleet stops assume the company runs several lines, as in area 10's example of ten lines in three kitchens. Numbers marked illustrative are modeling assumptions, not measurements.

What breaks without the loop: the rare failures that matter stay on robot disks, the model never sees them, and operators keep rescuing the same kind of bunch.

## Stop: recording
title: Saving the rescue
cargo: Recorded takeover episode
cargo_detail: MCAP file: video, joint states, commands, timestamps
concepts: telemetry-logs, robot-datasets, data-pipelines, teleop-modes

### Plain
The station saves the rescue as one recording: what its cameras saw, where each joint was, and what the operator commanded, every item stamped with the time. It works like a flight data recorder, so the moment can be replayed exactly as the robot experienced it. The station had been keeping its last few minutes on a loop, and once the rescue ended it saved that loop to disk.
### Precise
The station records an episode (one attempt at a task, start to finish, with every sensor stream and action). This one holds the overhead and wrist camera video, the six joint angles and gripper state, the operator's commands, and a timestamp on every message. In a direct-control takeover (the operator's device streams arm targets many times a second and the robot follows them), those commands are the part that shows the fix.

On a station running ROS 2 (a common open-source robot software framework), the recorder is rosbag2. It can run in snapshot mode: a ring buffer (a fixed-size memory buffer that keeps overwriting its oldest data) that is written to disk only when another program calls the recorder's snapshot service (a request that means "save what you have now"). When the rescue ends, the station calls it and flags the episode as a takeover. The buffer must reach back past the failed pick, or the start is overwritten before anyone asks for it. The file is MCAP (an open file format for timestamped messages, the ROS 2 default since the Iron release in May 2023). MCAP carries its schemas (message definitions), so the file can be decoded without the code that wrote it.

Raw video is why the buffer exists. One uncompressed 1280 x 720 color camera at 30 frames a second is about 83 MB a second (arithmetic), so stations buffer the compressed image stream and save only the moments that matter. What breaks without a synchronized recording: nobody can tell whether a failure came from the camera, the model, or the arm, and there is nothing to train on. A stream left off the recording list is simply missing later.
### Question
The station saves its snapshot buffer when the rescued bunch lands in the tray. Suppose someone had set the buffer to hold only 20 seconds, and this rescue took longer than that (illustrative). What ends up in the saved file?
- [ ] The whole episode, because a ring buffer grows to fit an event in progress :: A ring buffer has a fixed size, set by its cache-size setting, and keeps overwriting its oldest data no matter what is happening.
- [x] The end of the rescue, but not the failed pick that started it :: The oldest seconds were overwritten before the save. The file shows the end of the fix without the situation that needed fixing, so it no longer explains what went wrong.
- [ ] Nothing usable, because a recording that misses its start is corrupted :: A ring buffer drops its oldest data; it does not damage what remains, so the file is a normal recording of the last 20 seconds. It is just missing the start, which is why the buffer has to reach back past the failed pick.

## Stop: upload
title: Upload
cargo: Data parcel bound for the cloud
cargo_detail: Every flagged takeover plus 2% of normal picks
concepts: data-pipelines, telemetry-logs, fleet-management

### Plain
The plant's internet link is too narrow to send full camera video from every station live, so recordings wait on the station's disk. Overnight the station sends every rescue it flagged plus a small sample of ordinary picks. It is like mailing a box of the interesting footage once a day instead of streaming every camera all day.
### Precise
Upload is the second stage of the data pipeline (the system that moves recordings from robots to training). Episodes (single recorded attempts at a task) wait on local disk and go to cloud storage as connectivity and bandwidth (how much data a link can carry per second) allow. A plant's uplink (its connection out to the internet) cannot carry raw video from every station live: one 1280 x 720 camera at each of the four pick stations would be close to 10 TB uncompressed per eight-hour shift. Tools exist for this pattern; Foxglove's Edge Sites, for example, queue recordings on site for later cloud import.

Selection starts here. In the illustrative plan the line uploads every flagged episode plus 2% of normal picks, about 32 of a shift's 1,600. Small telemetry (numbers sent on a timer, such as picks per minute) goes live through the fleet agent (a small background program on each robot); full recordings go later. Platforms such as InOrbit's OpenRobOps use outbound-only connections (the robot dials out), so the plant firewall never has to accept incoming connections.

What breaks without it: data piles up as unsearchable files on robot disks, and the failures that matter never reach training. Uploading everything is not an option either: for a camera-heavy fleet, bandwidth and storage cannot keep up, and most hours are near-identical successes.
### Question
The plant's internet link is down for a whole night. What happens to that day's takeover episodes?
- [ ] They are lost, because recordings stream straight to the cloud :: Episodes wait on the station's local disk until the link allows. That queue is what lets a plant with a weak link still feed training.
- [x] They queue on the station's disk and upload later :: The station keeps picking meanwhile, because recording and upload are separate steps. The disk queue absorbs the outage, and the backlog goes up when bandwidth returns.
- [ ] The grape station stops picking until the upload finishes :: The policy runs on a computer at the station, not in the cloud, so picking does not depend on the uplink.
- [ ] The fleet manager has each robot re-record the takeovers once the link is back :: A physical moment cannot be recorded twice. That is why stations save to disk first: once a recording is gone, so is the evidence.

## Stop: curation
title: Curation
cargo: Sorted episodes, some rejected
cargo_detail: Near-copies dropped, keepers labeled pass or fail
concepts: data-pipelines, robot-datasets, imitation-learning

### Plain
Uploaded recordings are sorted before anything is trained on them. Rescues, failures, and unusual bunches are kept; near-copies of easy picks and broken recordings are dropped. Each keeper is labeled with the task and whether it succeeded, like a film editor picking takes and labeling each scene.
### Precise
Curation (searching and filtering recordings for useful episodes) keeps failures, takeovers, rare objects, and new conditions, and drops near-duplicates of easy successes. Labeling attaches the task description, success or failure, and sometimes grasp points or boxes (rectangles drawn around objects in an image). On this line the inspection camera supplies a first pass-or-fail label and a person confirms it. Curation also checks for common faults: cameras and joint readings recorded tens of milliseconds apart, and a missing success label.

For a takeover, what counts as training material matters. In HG-DAgger (a version of dataset aggregation, the method of repeatedly adding expert-corrected examples to the training set), the expert takes control when they judge it necessary, and only the corrections made while the expert is in control become new examples. The stretch where the model was hesitating explains the failure but is not copied as the right answer.

Curation also guards variety. A dataset recorded by one person on one morning teaches one person's habits under one light, so the grape plan mixes grape colors, shifts, and operators. A controlled scaling study found that the variety of environments and objects mattered far more than the number of demonstrations. What breaks without curation: the model is retrained on whatever was easiest to collect.
### Question
Overnight curation finds 40 near-identical clean picks of large green bunches and 3 takeovers on tangled red bunches (illustrative). Which choice gives the next model the most useful data?
- [ ] Keep all 40 clean picks, because more data always makes a better model :: Near-identical successes add little. Variety, and the cases the model gets wrong, matter more than count.
- [ ] Drop the takeovers, because they contain the model's failure and would teach it to fail :: In HG-DAgger-style training only the operator's corrections become examples. The failed stretch shows where the model goes wrong; it is not copied as the right answer.
- [x] Keep the 3 takeovers and a few clean picks, and drop most of the near-duplicates :: The takeovers show the fix in a situation the model handles badly, and a policy has a blind spot wherever its data is silent. Near-duplicates of easy successes add little, so curation drops most of them.
- [ ] Keep everything and let training work out what matters :: Training does not know which episodes matter; it fits whatever it is given. Skipping curation means retraining on whatever was easiest to collect.

## Stop: dataset
title: The dataset
cargo: Crate of labeled episodes
cargo_detail: Parquet numbers plus MP4 video, one entry per episode
concepts: robot-datasets, data-pipelines, imitation-learning

### Plain
The kept recordings are packed into a standard dataset next to the station's original demonstrations. The rescue is now one entry among hundreds (illustrative), like one lesson filed in a driving school's video library. On its own it changes little; it matters because it covers a kind of bunch the library had little or no footage of.
### Precise
Conversion writes the episodes into a training format such as LeRobotDataset v3.0. Each frame (one synchronized snapshot inside an episode) holds the observation (camera images plus proprioception, the robot's own joint readings) and the action (the command sent at that moment, usually target joint positions). Small, high-rate numbers go into Parquet files (a table format that stores data column by column). Camera frames go into MP4 video, one stream per camera. Metadata files hold the schema (the list of recorded fields and their types) and the one frame rate for the whole dataset (meta/info.json), normalization statistics used to rescale inputs before training (meta/stats.json), and where each episode starts and ends inside shared files (meta/episodes/). Each episode also carries its task text and success label.

Scale, honestly. ACT (a small single-task learned policy) on the ALOHA research arms used about 50 demonstrations per task, and the illustrative grape plan calls for about 200. In area 10's illustrative plan, a month of takeovers becomes the core of the next training run. Generalist models (meant for many robots and tasks) need far more: Open X-Embodiment pooled over 1M trajectories (recorded runs of a task), and Physical Intelligence's pi0 trained on over 10,000 hours. One takeover is one episode. It adds a case the old data was silent about, but on its own it is easily outweighed, so the next run waits until a batch of such cases has built up.

What breaks without a shared format: pooling data takes conversion work for every source, because robots differ in cameras, joint counts, recording rates, and action layouts.
### Question
The grape dataset holds about 200 demonstrations, and now one takeover on a tangled bunch (illustrative). What should the team expect if they retrain today?
- [ ] The new model will now handle tangled bunches, because it has seen the fix once :: One episode among about 200 is a thin signal. That is why the illustrative plan waits for a month of takeovers before the next training run.
- [x] Little change on tangled bunches; it is worth collecting more takeovers like this one first :: A single example adds a case the data was silent about but is easily outweighed. Several similar takeovers give the model a pattern instead of an exception.
- [ ] Retraining is pointless until they have a million episodes, like Open X-Embodiment :: Million-episode datasets are for generalist models across many robots and tasks. A single-task policy like ACT often works with about 50 demonstrations.

## Stop: training
title: Training
cargo: Model weights being trained
cargo_detail: ACT-style policy, about 80M numbers (illustrative)
concepts: imitation-learning, learned-policy, reinforcement-learning, data-pipelines, vla-models

### Plain
Training adjusts the model's millions of internal numbers until, for each recorded moment of a demonstration or rescue, it outputs the move the person made. It is like a learner driver studying an expert's dashcam footage, including the clips where the expert recovered from a bad spot. This runs for hours on a powerful graphics chip, away from the robot.
### Precise
The method is imitation learning by behavior cloning (ordinary supervised learning where the right answer for each moment is the action a person took). The illustrative choice for the grape station is an ACT-style policy (Action Chunking with Transformers): about 80M parameters (the network's adjustable numbers), trained for 100k steps (rounds of small automatic adjustments) in a few hours on one GPU (a chip that does the same arithmetic on many numbers at once). It predicts an action chunk (a short list of future targets, here 50 steps covering one second at 50 Hz) instead of one target at a time. Area 8 prefers this over a vision-language-action model (a much larger policy built on a model first trained on web images and text) such as the 3.3B-parameter pi0: for a fixed menu at 200 plates an hour, a small single-task policy is cheaper to run and easier to validate than a model that needs a GPU per arm.

Takeovers attack compounding error (a small mistake leads the policy into a situation the demonstrations never showed, where it makes a bigger one and drifts further). The classic fix is DAgger: run the learner, have the expert label the situations it actually reaches, add those to the data, and retrain. A takeover is exactly that kind of example. Physical Intelligence's RECAP method trains on demonstrations, the robot's own attempts, and expert interventions, and reports more than doubling throughput on some of its hardest tasks, by its own measurements.

Limits stay. A cloned policy rarely beats its demonstrators: it copies their speed and hesitations. Reinforcement learning (improving a policy by trial and error against a numeric score) can go past the demonstrator, but from scratch it needs far more attempts than real hardware allows, so it runs mostly in simulation, and tangled grape stems are where simulated contact is least trustworthy. Real-world methods such as HIL-SERL start from demonstrations and rely on human corrections during training. This ride's model is trained by imitation. What breaks without retraining: the station keeps meeting tangled bunches with the same weights, and operators keep rescuing them. See [[imitation-learning]].
### Question
Most of the original grape demonstrations start from a bunch lying normally in the tote. Why does a takeover correction teach the policy something they cannot?
- [ ] It gives the policy a reward score to maximize on hard bunches :: That is reinforcement learning. Behavior cloning has no score; it copies the action the person took at each moment.
- [ ] It lets the policy reason about why its earlier grasp failed :: A learned policy is millions of numbers that map pixels and joint angles to targets. It cannot explain or reason; it only gets new examples to fit.
- [ ] It teaches the policy to pick faster than any operator, because corrections are efficient :: A cloned policy copies the pace of the people it learns from, hesitations included, and rarely beats them.
- [x] It shows a fix in a situation the policy really drifted into, not a planned one :: A person corrects the deployed policy where it actually went wrong. This is the DAgger idea: collect expert examples in the states the learner really reaches, which is where compounding error happens.

## Stop: simulation
title: Simulation
cargo: Ghost robot in a simulator
cargo_detail: A cheap filter, not proof: grape stems are hard to simulate
concepts: simulators, sim-to-real, policy-evaluation

### Plain
Before touching real grapes, the new model drives a virtual copy of the station: a video game with real physics. Thousands of copies can run at once, and a crash costs nothing. But simulated grape bunches are rough approximations, so passing here only earns the model a real test, the way a flight simulator check comes before a real flight.
### Precise
A simulator combines a physics engine (software that advances the virtual world in small time steps; MuJoCo's default step is 2 ms), a renderer (which draws what each virtual camera would see), and a robot description (a text file such as URDF or MJCF that lists links (the rigid parts), joints, masses, limits, and collision shapes). GPU-parallel simulators (ones that run on graphics chips) run thousands of copies of a scene at once.

Here it works as a cheap filter. It can check reach and cycle time (the time one pick takes), catch motions that would hit the tote, and vary lighting and lens fog at random in every episode (domain randomization) so the model meets many conditions. It cannot vouch for the grasp itself. Deformable, wet objects such as grape stems are much less mature in most robot simulators [unverified: general assessment; no benchmark found that measures it], and a grasp can look fine in simulation only because of a simulator shortcut, such as contacts that are slightly sticky.

The reality gap (the systematic differences between a simulator and the real cell) has four parts: visual, dynamics, actuation, and sensing. Simulated evaluation can track real results when the simulator is tuned to match a setup, as the SIMPLER project reports, but transfer is only proven by real trials. What breaks without this stop: obvious faults reach the real station and use up slow, expensive real trials.
### Question
Which check is the simulator most trustworthy for at the grape station?
- [x] Whether the arm can reach every part of the tote and finish inside the cycle time :: Reach and timing rest on rigid geometry and joint limits, which simulators model well. The same kind of check is used in cell design before any steel is cut.
- [ ] Whether the soft fingers hold a wet, tangled bunch without crushing it :: Soft, wet contact is where simulated physics is least trustworthy, which is why the grape station leans on real demonstrations and real trials.
- [ ] Whether the camera sees the scene correctly, as long as the renderer is photorealistic :: Photorealism addresses only the visual gap, and even there deliberately unrealistic random textures can transfer well. Many failures come from dynamics and actuation instead.
- [ ] Whether the new model beats the old one on real tangled bunches :: Simulated results are a cheaper, partial stand-in. They can track real results when the simulator is tuned to match the setup, as SIMPLER reports, but transfer is proven only by real trials.

## Stop: real-eval
title: Real trials
cargo: Scoreboard of real trials
cargo_detail: Old vs new model, 300 trials each (illustrative)
concepts: policy-evaluation

### Plain
Now the new model tries real grapes hundreds of times, under conditions written down in advance, and the old model runs the same trials. It is like an election poll: asking 20 people tells you little, so pollsters ask many and report a margin of error. The result is a range for each model, not one number.
### Precise
The basic metric is success rate over N trials. It means little without the success criteria, the starting conditions, the trial count, a description of failures, and some statistics. A success rate is a binomial proportion (successes out of independent tries). The Wilson score interval (a formula for the plausible range of the true rate that behaves well with few trials) turns it into a range. By that formula, 16 successes out of 20 (80%) is consistent with a true rate from about 58% to 92%. With zero failures in n trials, the rule of three says the true failure rate could still be as high as 3/n, so about 300 clean trials are needed to support a 1% failure rate.

The test plan spreads trials across grape varieties, tray positions, and a fogged lens at start of shift. Both models get the same starting conditions in random order, ideally with an evaluator who does not know which model is running. The illustrative suite runs 300 trials per model over 12 written-down conditions, plus extra tangled-bunch trials for the case that started this ride. Failures are logged by type, because a missed grasp that retries costs seconds while a crushed bunch costs product. Cycle time is logged too.

Why it matters on the line: at 200 plates an hour, 99% success leaves 2 plates an hour for rework, and 95% leaves 10. What breaks without a fixed suite: a model update can get worse in situations nobody re-tested. So the whole suite reruns after every model update, before the update reaches the line.
### Question
After 20 tangled-bunch trials each, the new model has 16 successes and the old one 13 (illustrative). What can the team conclude?
- [ ] The new model is better, because 80% beats 65% :: With 20 trials, 16 successes is consistent with a true rate anywhere from about 58% to 92%, a range that includes 65%. The gap could be luck.
- [x] It may be better, but 20 trials cannot show it yet :: Keep running trials under the same conditions. Small samples give wide ranges. More trials narrow them, and only then can a real difference be told apart from noise.
- [ ] The new model will succeed on 80% of tangled bunches on the production line :: 80% is one small sample under test conditions. RT-1's success fell from 97% to 59% when only the background changed, so a single number can badly mislead.
- [ ] Real trials are too noisy to compare models, so trust the simulator instead :: Real trials are the gold standard. The answer to noise is more trials, not a cheaper stand-in.

## Stop: rollout
title: Staged rollout
cargo: Sealed update for the first cells
cargo_detail: Versioned weights file; the old one stays on disk
concepts: remote-updates, fleet-management, policy-evaluation

### Plain
The new model does not go everywhere at once. First it watches alongside the old model without moving the arm, then it drives one grape station, and only if the numbers hold does it spread further. The old model stays on disk the whole time, like a restaurant chain keeping the old recipe card handy while one kitchen tries the new dish.
### Precise
The package is a weights file (the model's learned numbers), versioned and usually shipped separately from the operating system. It is copied ahead of time and switched later. For scale: a 3-billion-parameter model stored at 2 bytes per weight is about 6 GB, about 8 minutes at a steady 100 megabits a second (arithmetic); an ACT-sized model is far smaller.

The release follows web practice. Shadow mode runs the new model on live sensor data next to the old one and logs what it would have done, without letting it move anything; engineers review the cases where the two disagree. A canary (a partial, time-limited deployment to a small slice, compared against the rest as a control) then lets it drive one line's grape station, with the other lines' grape stations as the control. A staged rollout widens that in steps (one station, one site, all sites). Rollback (returning to the last known-good version) means pointing the station back at the previous model file, which is still on disk. What breaks without staging: an update pushed to every station at once turns one bad build into a stopped plant.

The robot-specific part is a safe switch. The station's own software decides when the change may happen, so it can wait until the arm is stopped and the cell is idle. If the network or power drops mid-update, the station must still end up running the old model or the new one, never half of each. Model regressions are statistical, not crashes: one eight-hour shift is about 1,600 grape picks, enough to see misses jump from 1% to 3% but not to tell 1% from 1.2% (illustrative). So a canary runs at least one full shift.
### Question
The new weights file is halfway copied to a grape station when the plant's network drops. What should happen?
- [ ] The station loads the half it has and fills in the rest when the network returns :: Half a weights file is not a smaller model; it is a broken one. A robot must never run a mix of two versions.
- [ ] The station stops and waits for a technician to restore it :: Updates are designed so an interruption leaves a working robot with nobody nearby. Sending a technician for every hiccup is what remote updates exist to avoid.
- [ ] An operator drives the arm by remote control until the network is back :: Remote control needs the same network that just dropped, and the old model is still on the station and working.
- [x] It keeps running the old model until the whole file is in :: It switches only then, and only when the cell is idle. Copying ahead and switching later means an interrupted copy changes nothing. The robot must end up on the old version or the new one, never half of each.

## Stop: fleet
title: The fleet
cargo: Update reaching many cells
cargo_detail: Dashboard: model version and misses per station
concepts: fleet-management, remote-updates, visualization-tools, telemetry-logs, learned-policy

### Plain
The fleet manager is the control room for every robot: it knows which station runs which model version and shows each one's picks and misses. As the update spreads line by line, the team watches those numbers. If a station gets worse, it is pointed back at the old model, and its saved failures go to an engineer to replay.
### Precise
A fleet management system is a server that talks to a small agent (a background program) on every robot. The agent sends heartbeats (small "I am alive" messages on a timer), status, faults, and metrics. The server keeps an inventory (which robot, hardware revision, software and model version, site), raises alerts, and offers remote commands. The staged rollout is planned against that inventory. Fixed arms need only the lighter half of fleet management: health monitoring, without the traffic control that mobile robots need.

Each grape station reports picks per minute, missed picks, and model version. With ten lines in three kitchens (illustrative), the same inventory shows which lines run which grape model. When a station's misses rise, an engineer opens its saved MCAP recordings (timestamped files of every recorded stream) in a visualization tool (a viewer that plays many recorded streams on one timeline) such as Foxglove, Lichtblick, or Rerun, and scrubs to the failed pick. The viewer lines up what the cameras saw with the joint targets the policy sent at each moment. An end-to-end policy has no detected bunch position or grasp score to draw on screen, and losing those checkpoints is the main debugging cost of a learned policy.

What breaks without it: nobody knows which robot runs which version, and faults are found when production stops. The loop also closes here. New takeovers on new kinds of failure get flagged, and the ride starts again (see [[data-pipelines|data pipelines]]).
### Question
Two weeks into the rollout, misses rise on the grape stations in one kitchen but not in the others (illustrative). What does the fleet manager let the team do first?
- [x] Compare that kitchen's inventory with healthy ones and replay failures :: The inventory shows what differs (model version, hardware revision, site), and opening the saved failure recordings in a viewer shows what the robot saw and did at the failing moment.
- [ ] Log in to each station one at a time to check what it runs :: That works for one robot, not dozens across three kitchens. The version inventory exists so nobody has to guess.
- [ ] Check where each robot is on the map, since fleet management is mainly traffic control :: Traffic control matters for robots that drive. For fixed arms the fleet manager is the lighter half: health, versions, and alerts.
- [ ] Wait for a line to stop, since fleet dashboards only report hard faults :: The agent streams metrics such as missed picks, so a slowly rising miss rate shows up before production stops. Model regressions rarely look like hard faults.

## Stop: next-pick
title: The next pick
cargo: Grape bunch in the tray
cargo_detail: A tangled bunch like ride 3's, picked without help
concepts: on-robot-inference, learned-policy, imitation-learning, teleop-modes

### Plain
Back at the grape station, a tangled bunch like the one from ride 3 sits in the tote. The new model, running on a computer beside the arm, plans about a second of motion at a time, and the arm sets the bunch in the tray without calling for help. It will still miss sometimes, and when it does, an operator steps in and the new recording starts this loop again.
### Precise
On-robot inference means running the trained policy (the learned software that turns camera images and joint angles into arm targets) on a computer at the robot. Two numbers must be kept apart. The control rate is how often new targets go to the servo drives (the motor electronics in each joint): 50 Hz here, one every 20 ms. The inference latency is how long one pass through the network takes, and it can be longer than those 20 ms: pi0, for example, takes about 73 ms on an RTX 4090 GPU (a graphics chip). Action chunking (outputting about a second of future targets at once) bridges the two. The illustrative setup plans a new 1 s chunk every 0.5 s and plays it open-loop (without looking at new camera images) in between, while asynchronous execution computes the next chunk as the current one plays. Running at the station avoids network delay and dropouts.

The policy replaces only the decision from pixels to joint targets. The servo drives, the guarding and emergency-stop circuit, the PLC's tray-present interlock (the line controller's check that a tray is in place before a pick), and the inspection station downstream stay exactly as they were. A watchdog (a timer that triggers a safe action when an expected signal is late) checks that a fresh chunk always arrives before the current one runs out. If the computer stalls, the arm decelerates to a hold, the PLC marks the station faulted, and the plate is flagged for manual completion rather than the whole line stopping.

Three limits. A cloned policy runs no faster than the operators it learned from, and the pick must still fit in the 16-17 s left of each 18 s cycle once the tray belt has moved. This success came from a batch of takeovers, not from ride 3's alone. And the station robot itself (a washdown six-axis arm with soft fingers at the tote) is a judgment call from area 1, not a sourced rule.
### Question
Suppose one pass through the policy takes longer than the 20 ms between drive targets at 50 Hz, as pi0's 73 ms does. How does the arm keep moving smoothly?
- [ ] It cannot: the arm has to slow down to the rate at which each pass finishes :: Chunking separates the two rates. What latency limits is reaction time to new events, set by how often a fresh chunk replaces the old one: every 0.5 s in this setup.
- [x] Each pass plans about a second of targets, played at 50 Hz while the next is computed :: The drives always have a target from the current chunk, and asynchronous execution hides the inference delay. A watchdog covers the case where a fresh chunk arrives late.
- [ ] Each camera frame goes to a bigger GPU in the cloud, which answers within one tick :: The network adds delay and can drop out; in pi0's tests the same GPU took about 86 ms across the network versus 73 ms at the robot. Running at the station keeps timing predictable.

## Puzzle
title: Ship the new grape model?
type: choice

### Prompt
The full real-world suite is done. Both models ran the same written-down conditions in random order (illustrative numbers):

| Condition | Old model | New model |
|---|---|---|
| Tangled bunches | 33 of 60 | 51 of 60 |
| Clear lens | 147 of 150 | 148 of 150 |
| Fogged lens, start of shift | 146 of 150 | 131 of 150 |

In simulation, the new model scored higher on every condition, including simulated fog. At these trial counts, both the tangled-bunch gain and the fogged-lens drop are larger than chance would explain. The takeovers fixed the case that started this ride, but something else got worse. What do you do?
### Data
```json
{
  "options": [
    {
      "text": "Ship it to every line: it fixes the case that caused the takeovers.",
      "correct": false,
      "why": "It trades one failure for another. A fogged lens at start of shift is one of the conditions the suite was written to cover, so shipping now would put a measured regression on every line. A model update can get worse in situations nobody re-tested, and this suite is what caught it."
    },
    {
      "text": "Ship it: the simulator says it is better everywhere, and the simulator ran far more trials.",
      "correct": false,
      "why": "The simulator is a cheaper, partial stand-in. Fog belongs to the visual gap, and simulated fog only approximates the real thing. More simulated trials shrink the luck in the simulated score, not the systematic gap between simulator and reality. Real trials are the gold standard, and here they disagree with the simulator."
    },
    {
      "text": "Keep the old model, add fogged-lens episodes, retrain, and rerun the suite.",
      "correct": true,
      "why": "The suite exists to catch exactly this before an update reaches the line. Replaying the fogged-lens failures in a viewer first shows whether the model, the camera, or something else is at fault. The tangled-bunch takeovers stay in the dataset, the next run adds what this one lacked, and the rerun suite checks that both cases hold."
    },
    {
      "text": "Try it on one line as a canary and see whether the fog misses show up there.",
      "correct": false,
      "why": "The suite runs before an update reaches the line, and a canary comes after a model passes it. This regression is already measured with enough trials; a canary would only repeat the finding at the cost of real plates on that line."
    }
  ]
}
```
### Debrief
The real suite caught a regression the simulator missed, before it reached any line. That is why the whole suite reruns after every model update, and why results are reported per condition instead of as one headline number: RT-1 succeeded on 97% of the instructions it was trained on but on 59% when only the background changed. A model can fix one failure and create another, so the answer is another trip around this ride's loop: record the new failure, curate, train, and evaluate again. The numbers here are illustrative; the Wilson interval from area 8 is one way to check whether a gap like this is bigger than chance.
