---
ride: ride1
title: The tray
order: 1
teaches: 6
---

# Ride 1: The tray

## Intro
### Plain
You ride with one empty molded fiber tray as it travels the whole cheese plate line. Robots add grapes, apple slices, crackers, and cheese, a camera checks the plate, a machine puts the lid on, and the plate leaves for the airline trolleys. Like a kitchen that must send out a plate every 18 seconds, every machine on the line has to keep that beat.

### Precise
This ride teaches area 6: everything around the robots that turns a few arms into a production line. The target is about 200 plates an hour, which sets the takt time (the time budget per plate that demand sets): 3600 s / 200 = 18 s. The tray belt indexes (moves one fixed step, then stops) and spends 1-2 s of each 18 s moving; that figure is illustrative. The room runs at 36-40 F (about 2-4 C) and is washed down every day. The spec asks for IP67 (dust-tight, and tested for 30 minutes under 1 m of water) washdown equipment; the cracker stop explains what IP67 does and does not prove.

Which robot sits at each station is a design judgment, offered in area 1 as a judgment call rather than a rule. A washdown six-axis arm (an arm built like a human arm, with a wrist that bends and twists) with soft fingers picks grape bunches from a tote (an open bin). A delta robot (three light arms hung from a frame over a belt, meeting at one small plate) with a vacuum cup (a soft cup that holds by pumping air out from inside it) picks apple slices. A SCARA (an arm that swings flat, with a shaft that moves straight up and down) with a vacuum cup takes cracker packs from a feeder (a machine that hands items over one at a time). A second delta with a vacuum cup picks cheese wedges. A gantry (a frame of straight overhead rails that carries a tool) loads finished plates at the outfeed, where area 1 would also accept an arm.

Numbers marked illustrative come from a simple model of this line, not from measurements. In that model the apple station is the bottleneck (the station whose capacity caps the whole line's output).

## Stop: denester
title: Tray denester
cargo: Empty fiber tray
cargo_detail: One molded tray, just released from the stack
concepts: feeder, line-balancing

### Plain
The ride starts at a tall stack of empty trays. The denester lets go of exactly one tray each time the line asks, the way a gumball machine drops one gumball per turn. If two trays come out stuck together, or none comes out at all, everything after it waits.

### Precise
The first station on this line is a [[feeder|feeder]] (a machine that turns stacked or bulk items into single items at a known place and rate). A denester is the feeder for nested trays: it holds a stack in a magazine (a holder for the stack) and releases one tray onto the belt. Scroll denesters drop trays with rotating screws. Pick-and-place denesters pull trays with servo-driven motion (electric motors whose position is controlled precisely).

Speed is not the issue here. The line needs one tray every 18 s, about 3.3 trays a minute, while a pneumatic (compressed-air driven) denester sold for food lines is rated up to about 120 trays a minute. It runs at under 3% of its rated speed. What matters is reliability with molded fiber trays and how often someone refills the magazine: a 250-tray magazine (illustrative) lasts 75 minutes at 200 plates an hour. The magazine is refilled from outside the guard (the panels that fence off the machines), so nobody opens a door to do it.

What breaks: double feeds (two trays stuck together go down as one), missed feeds, and crushed rims. Each one stops the line or makes a bad plate. Because this is the first station, any stop here starves (leaves idle for lack of input) every station after it. A photo-eye (a light beam that a passing item breaks) confirms each tray actually arrived. The lid station later needs its own denester for the clear lids.

### Question
The line needs about 3.3 trays a minute, and its denester is rated for about 120. What should the engineers choosing it care about most?
- [ ] Its rated speed, since a faster denester makes a faster line :: Rated speed is not the limit: this one already runs at under 3% of its rating. A faster model adds nothing to line output.
- [x] How rarely it jams or double-feeds, and how long a magazine of trays lasts :: At this rate, output is lost to jams, double feeds of molded fiber trays, and refills, and every stop at the first station starves all the stations after it.
- [ ] Very little: at under 3% of its rating it will barely wear, so it will seldom fail :: Running slowly does not stop trays from clinging together or rims from being crushed. Those failures stop the line or make a bad plate at any speed.
- [ ] Its speed, because the denester sets the line's takt time :: Takt comes from demand, not from a machine: 200 plates an hour means one plate every 18 s, whatever the denester can do.

## Stop: infeed
title: Infeed conveyor
cargo: Empty tray, indexed into place
cargo_detail: Stopped one step along, ready for the first robot
concepts: conveyor, cycle-time

### Plain
The tray lands on a belt that carries it past each robot in turn, like the belt in a sushi restaurant. This belt does not crawl along nonstop: it jumps forward one tray position, stops so every robot can work on a still tray, then jumps again. The whole jump-and-stop has to fit inside 18 seconds, because the line must finish a plate at least that often.

### Precise
A [[conveyor|conveyor]] (a moving belt that carries items between fixed stations) runs either continuously or indexed (it moves one fixed step, called the pitch, then stops while work happens). With trays at a 300 mm pitch (illustrative) and a plate due every 18 s, a continuous tray belt would crawl at about 17 mm/s, or 1 m per minute. Indexing suits that crawl: the belt moves one pitch in 1-2 s (illustrative), stops, and each robot places onto a still tray, so the tray itself needs no tracking.

The ingredient belts are different. Apple slices and cheese wedges arrive in bulk on belts that keep moving, so those robots use conveyor tracking: an encoder (a sensor that counts how far the belt drive has turned) tells the robot how far each item has moved since a camera saw it.

Four timing words matter from here on. Takt time (the time budget per plate that demand sets) is 3600 s / 200 = 18 s. Cycle time (how long one station actually takes per plate) must fit inside takt, and the index move comes out of every station's 18 s. Throughput (plates per hour) is set by the slowest station. Lead time (how long one tray spends on the line) follows from Little's law (items on the line = throughput × time each spends there): with 8 trays at stations plus 6 on belt positions between them (illustrative), 14 trays / 200 per hour is about 4.2 minutes from denester to outfeed.

What breaks without a good conveyor: an item slips or shifts, so a robot's idea of where it is goes wrong and the pick misses; uneven spacing gives one station two trays at once and the next station none.

### Question
The tray belt indexes: it moves one step in 1-2 s (illustrative), then stops. Which robots still have to hit a moving target?
- [ ] None of them, because the belt stops before each robot works :: The tray belt stops, but the apple and cheese robots pick from their own ingredient belts, which keep moving.
- [ ] Every robot, because the tray is still moving while they place :: On an indexing belt each robot places onto a stationary tray, so placing needs no tracking for the tray.
- [x] The apple and cheese robots, which pick from moving belts :: Their ingredient belts run continuously. They place onto a still tray but pick slices and wedges on the move, using a camera plus conveyor tracking to predict where each one is now.
- [ ] Only the grape arm, because its bunches lie at random angles :: Random angles make the grape pick hard, but in this design the arm picks from a tote, not from a moving belt.

## Stop: grapes
title: Grape station
cargo: Tray with one grape bunch
cargo_detail: One bunch on the stem, set in by soft fingers
concepts: guarding, six-axis, soft-gripper, estop

### Plain
Inside a fenced cell, a robot arm shaped like a human arm reaches into a bin of tangled grape bunches. Soft rubber fingers close gently around one bunch and set it in the tray without popping grapes off the stem. The cell door works like a self-closing pool gate that is wired to the robot: open it and the arm stops.

### Precise
The robot here is a design judgment, not a rule: a washdown [[six-axis|six-axis]] arm (an arm built like a human arm, with a wrist that bends and twists) with a [[soft-gripper|soft gripper]] (rubber fingers that bend to wrap around an item). Bunches lie tangled in a tote (an open bin) at random angles, and the wrist lets the gripper tilt to get under the stem. A bunch has no flat face for a suction cup, and a hard squeeze pops berries off, so three or four soft fingers close around it at low pressure and the camera only needs a rough center point. At 18 s per bunch the arm's speed is no constraint, but its cold rating is. ABB's hygienic IRB 1200, for example, lists +5 C as its lowest operating temperature, so that model is not rated for this 2-4 C room, and the station needs an arm rated for the cold.

The cell is guarded (built so a person's body cannot reach the robot while it moves). Stainless and clear plastic (polycarbonate) panels block access. The door is interlocked: its switch tells the safety circuit (separate wiring and logic whose only job is stopping the machine) to stop the arm when the door opens. Trays pass through small tunnel openings sized with the ISO 13857 safety distances, so a hand cannot reach the arm.

An interlock only helps if nobody defeats it, for example by taping the switch shut; ISO 14119 covers interlocks designed to resist that. OSHA notes that many robot accidents happen during programming, maintenance, testing, and setup, when people are inside the robot's reach. So the door is backed by lockout/tagout (each worker locks the power off with a personal lock before going in). A pressed emergency stop is no substitute: it is a backup to the guards, and OSHA's lockout rule says push buttons do not isolate the power. What breaks without guarding: a person freeing a tangled bunch is within reach of a fast, forceful arm whose next motion they cannot predict.

### Question
Someone has to go into the grape cell to free a tangled bunch. Which setup actually keeps them safe?
- [ ] A flashing warning light over the door and a clear sign telling people to keep out :: Lights and signs are awareness devices: they only warn. Nothing stops the arm if someone walks in anyway.
- [ ] Pressing the cell's emergency stop button, then reaching in :: An emergency stop is a backup to the guards, not a lockout. OSHA's lockout rule says push buttons do not isolate the power, so it cannot replace each worker's personal lock.
- [ ] Waiting until the arm looks paused, then reaching in quickly :: An arm that looks paused may simply be waiting for its next tray. People cannot predict a robot's next motion, which is why guarding exists.
- [x] An interlocked door, plus locking out the power first :: The interlock stops the arm when the door opens and feeds the safety circuit, and lockout/tagout (each worker locks the power off before going in) covers the maintenance work during which many robot accidents happen.

## Stop: apples
title: Apple station
cargo: Grapes plus about four apple slices
cargo_detail: Set in one at a time by the delta's vacuum cup
concepts: line-balancing, cycle-time, delta, vacuum-gripper
workbench: wb6-line-balancing

### Plain
A spider-like robot hung over a belt picks apple slices with a suction cup and sets about four into the tray, one at a time. Every other robot makes one to three picks per plate, so in this line's model this is the station everyone waits on, like the one checkout lane every shopper has to pass. Speeding up any other station would not get a single extra plate out.

### Precise
The robot is a design judgment: a [[delta|delta]] robot (three light arms hung from a frame, meeting at one small plate) with a [[vacuum-gripper|vacuum gripper]] (a soft cup that holds by pumping air out from inside it). Slices are light, flat, and arrive on a moving belt, and placing one needs only x, y, z plus one turn, which a 4-axis delta (one with a fourth motor that turns the cup) provides. Wet slices are slippery: friction (how much two surfaces resist sliding) drops to about 0.2-0.4, so a fast sideways move can slide a slice off the cup. The cup should land on the flat cut face, because the curved skin seals poorly.

Four slices per plate means 13.3 picks a minute: at most 4.5 s per pick, and about 4 s once the 1-2 s index move is taken out. In the illustrative model each apple pick takes 3.2 s, so the station's cycle time (how long it takes per plate) is 4 × 3.2 s + 1.5 s index = 14.3 s, against an 18 s takt time (the time budget per plate set by demand). That is the longest on the line, which makes apples the bottleneck (the station whose capacity caps the whole line). Line balancing (dividing work so every station has about the same amount) scores this with balance efficiency (useful work divided by stations × the slowest station's work): only about 43% here, because the other stations spend much of each cycle waiting.

Every station alone can beat 200 plates an hour. But with no buffers (small queues between stations), any station stopping stops the line, so the availabilities (each station's share of time not stopped) multiply to about 80%, and the line makes about 202 plates an hour, barely on target. If apple picks slow to 4.0 s (slices sticking together), the line drops to about 165. A faster delta barely helps: its motion takes a fraction of a second per pick, and the rest is camera, tracking, vacuum, and gentle placing. Even with those slow 4.0 s picks, splitting apples between two robots, two slices each, moves the bottleneck to cheese and lifts the line to about 267 plates an hour. What breaks without balancing: the line pays for robots that sit idle and still misses its target, and money spent on a station that is not the bottleneck only buys more idle time.

### Question
In the illustrative model, apple picks slow from 3.2 s to 4.0 s because slices stick together, and the line falls to about 165 plates an hour. Which single change gets it back above 200?
- [ ] A faster delta with a shorter catalog cycle :: The delta moves for well under a second of each pick; most of the pick is camera, tracking, vacuum, and placing. Shaving its motion barely changes a 4.0 s pick.
- [ ] Speeding up the grape station, which has the slowest single pick at 7.0 s :: The grape robot makes one pick per plate, so its cycle is only 8.5 s. Improving a station that is not the bottleneck only adds idle time.
- [x] A second apple robot, so each one places two slices :: Apple work per plate halves, the bottleneck moves to cheese, and the line rises to about 267 plates an hour, even though one more robot slightly lowers line availability.
- [ ] Nothing: at 17.5 s the apple station still fits inside the 18 s takt, so it cannot be the problem :: It fits takt on paper, but with no buffers every station's stops multiply to about 80% availability, so the coupled line falls short. Balance has to be checked with failures included.

## Stop: crackers
title: Cracker station
cargo: Grapes, apples, and cracker packs
cargo_detail: One or two wrapped packs from the feeder stack
concepts: ip-rating, scara, vacuum-gripper

### Plain
A robot arm that swings flat, like your forearm sliding across a table, lowers a suction cup to lift one or two wrapped cracker packs off a stack. The pick is easy; the hard part is that the whole room is hosed down every day. A code on each machine says how well it keeps out dust and water, a bit like the water-resistance mark on a watch. Unlike a watch's mark, a higher water number is not simply better: each number is a different test.

### Precise
The robot is a design judgment: a [[scara]] (an arm that swings flat at the shoulder and elbow, with a shaft that moves straight up and down and twists) with a bellows vacuum cup (a suction cup with accordion folds that follow wrinkled film). Packs come flat and stacked from a feeder, so the job is purely top-down, with about 8-17 s per pack. Grip force is no issue: a 20 mm cup at -60 kPa (60 kPa below the room's air pressure) gives about 19 N in theory.

Washdown is the catch. The IP code (ingress protection rating, defined in IEC 60529) has a first digit for dust, where 6 means dust-tight, and a second digit for water. The water digits are different tests: 5 is jets of 12.5 L/min at 30 kPa from 3 m; 7 is 30 minutes with the lowest point 1 m under water; 9, and IP69K from the road-vehicle standards, is close-range jets of hot water at 80 C and 80-100 bar from 10-15 cm. Above 6 they are not a ladder: a device that passes the water-7 test has not necessarily passed the water-5 or water-6 jet tests. So IP67 proves dust-tightness and immersion, not survival of a hot high-pressure jet, and no IP test checks the plant's cleaning chemicals.

Epson's GX8 SCARA comes in an IP65 version, and FANUC sells food-grade SCARAs rated IP65. That is a jet test, not an immersion test, so they do not meet the line's IP67 spec, and the station would need a protective cover or a different robot (also a judgment call). For anything sprayed directly in the food zone, the useful spec is IP69K (whose water test matches water digit 9) plus IP67, with confirmed resistance to the cleaning chemicals. What breaks without it: water gets in at motors and cable entries, the usual leak points on a robot.

### Question
The spec says IP67. Suppose the daily washdown sprays the cracker robot with hot high-pressure jets. Which statement is true?
- [x] Ask for IP69K as well as IP67, since neither IP65 nor IP67 tests hot high-pressure jets :: Of these ratings, only IP69K's test (the same jet as water digit 9) sprays an 80 bar, 80 C jet from 10 cm. Each water digit is its own test, and none checks cleaning chemicals, so chemical resistance has to be confirmed separately.
- [ ] IP67 is a higher number than IP65, so an IP67 robot has also passed the IP65 jet test :: Above 6 the water digits are separate tests. Water digit 7 is immersion, and a device that passes it has not necessarily passed the 5 or 6 jet tests.
- [ ] IP69K is the top rating, so an IP69K robot is also proven against immersion :: IP69K proves resistance to hot high-pressure jets only. Immersion is the water-7 or water-8 test, so a device that needs both should list both.
- [ ] The rating hardly matters here, because the cracker packs are wrapped :: Wrapping protects the crackers, not the robot. The robot still stands in a room that is washed down every day.

## Stop: cheese
title: Cheese station
cargo: Filled plate, three cheese wedges added
cargo_detail: Set in by the second delta's vacuum cup
concepts: hygienic-design, delta, vacuum-gripper, hmi

### Plain
A second spider-like robot lifts three cheese wedges off a belt with a suction cup, and the plate is full. Anything hanging over the open tray could drip into the food, so it is built like a kitchen with smooth, rounded counters instead of cracked tiles. The cold room slows a dangerous germ called Listeria but does not stop it, so the station is washed down every day and the gripper comes off for cleaning.

### Precise
The robot is the same design judgment as at apples: a [[delta|delta]] robot (three light arms hung over the belt, meeting at one small plate) with a vacuum gripper (suction cups that hold by pumping air out). Three wedges per plate is 10 picks a minute: 5-6 s per wedge once the index move is taken out, and 3.0 s per pick in the illustrative model, for a 10.5 s station cycle. ABB's stainless IRB 360 delta, for example, is IP69K validated (proven against close-range hot high-pressure jets) for washdown with industrial detergents and hot high-pressure water, has smooth surfaces and lubricant-free joints, and is rated for 0-45 C, which covers the room.

[[hygienic-design]] (shaping equipment so cleaning reaches every surface and dirt has nowhere to hide) is the main lesson at this stop. Under the European food machinery standard EN 1672-2, a food area is any surface food touches or from which anything can drip into it, so the delta's arms over the open trays count, not just the cups. The 2-4 C room slows Listeria (a bacterium that causes a serious food-borne illness) but does not stop it, and once inside a plant it can be hard to remove, so the daily washdown matters more than the temperature.

The design principles: food-contact surfaces no rougher than Ra 0.8 µm (Ra is the average height of a surface's microscopic bumps); no crevices and no metal-to-metal joints, whose hairline gaps let soil in but not cleaning; and surfaces that drain. Practical choices on this line follow from them: grippers on quick-release mounts that go to a parts washer, and vacuum paths that can be flushed, since cheese crumbs get drawn into suction hoses [unverified: design concern, no primary source found]. Cheese is fatty, so a cup whose food-contact compliance covers only non-fatty foods cannot touch it.

The HMI (human-machine interface, the screen operators use) helps keep this station clean and running. An alarm such as "cheese pick: vacuum not reached after 3 retries" tells the operator which gripper to check, and a washdown mode parks every robot in a cleaning position. A recipe (a stored set of settings for one product variant) change to four wedges for a premium plate (illustrative) would raise this station's cycle from 10.5 s to 13.5 s, still inside the 18 s takt (the time budget per plate that demand sets), so every recipe change is checked against takt. What breaks without hygienic design: a machine can look spotless and still harbor bacteria in a gap, and in a food plant a machine that cannot be cleaned cannot be used.

### Question
The room is held at 2-4 C and the cheese delta is stainless steel. Which statement about keeping this station food-safe is true?
- [ ] At 2-4 C bacteria cannot grow, so the washdown is mostly for appearance :: Listeria can grow even in refrigerated food. The cold slows it but does not stop it.
- [ ] Only the suction cups touch cheese, so only they need to meet the food-area rules :: Under EN 1672-2, any surface over the open tray that could drip into the food counts as food area, including the robot's arms.
- [ ] A stainless robot is hygienic by default, whatever its shape :: Shape matters as much as material. Open tube ends, bolted metal-to-metal joints, and flat ledges trap water and food soil even in stainless steel.
- [x] The cold only slows Listeria, so the washdown matters more than the temperature :: Cold does not stop Listeria, so the daily washdown does the real work. Listeria can also be hard to remove once it is in a plant, which is why equipment is shaped so the washdown reaches every surface.

## Stop: inspection
title: Inspection
cargo: Full plate under the camera
cargo_detail: Counted, and checked for anything over the rim
concepts: inspection, oee, hmi

### Plain
A camera looks down at the finished plate and counts what is on it, like a teacher marking a test against an answer key. Unlike a teacher, it checks only the few things it was set up to look for. A plate that fails is pushed off into a side lane, where a person fixes it or throws it away. Every pass and every fail is also counted, which tells the plant how much of its work came out good.

### Precise
[[inspection|Inspection]] measures each plate against a specification and decides pass or fail. Here the camera checks for one grape bunch, four apple slices, one or two cracker packs, three cheese wedges, and nothing hanging over the rim where the lid would crush it. Reject is the mechanism that removes failures without stopping the line: here, a pusher into a rework lane. At 200 plates an hour the station has up to 18 s per plate, so even a slow, high-resolution check fits. Other common sensors are checkweighers (a short belt resting on a load cell, a sensor whose output changes with the force on it, so each pack is weighed while it moves), metal detectors, and X-ray systems that find glass, stone, bone, or metal. Foreign-body checks belong here because a chip of gripper or belt could land in open food.

Two errors trade against each other. A false reject throws out a good plate; an escape sends a bad plate on to the aircraft. Moving the threshold trades one for the other. The camera decides at one point and the pusher acts further down the belt, so the controller must keep track of which tray is which between them, usually by counting index steps or encoder pulses (counts from a sensor that measures belt travel) [unverified: only PLC tutorial blogs found, no vendor manual].

The reject reason is often worth more than the reject. "Cheese count 2" on the HMI (human-machine interface, the operators' screen) points at the station to fix; at a 2% reject rate that is about 4 plates an hour. The counts also feed OEE (overall equipment effectiveness, one score for how much planned time became good product): availability (share of planned time the line ran) × performance (how fast it ran against its ideal cycle, the fastest the process can run) × quality (good count / total count). In an illustrative shift, 1,339 good plates out of 1,380 made is 97.0% quality; with 90.0% availability and 87.0% performance, OEE is 76.0%. What breaks without inspection: the customer finds the defects, and nobody learns which station causes them.

### Question
Inspection rejects about 2% of plates, mostly with the reason "cheese count 2". Which change means fewer plates are made with a missing wedge in the first place?
- [x] Using the reject reason to find and fix what is failing at the cheese station :: Quality improves only when reject reasons are fed back to the station causing them, for example a gripper that drops wedges.
- [ ] Nothing more is needed: adding inspection has already raised quality :: Inspection only sorts. Plates leave the pick stations just as good or bad as before it was added.
- [ ] Loosening the camera's threshold so fewer plates fail :: That trades false rejects for escapes: the reject count falls, but the cheese station makes just as many short plates, and more of them reach the aircraft.
- [ ] A second camera to double-check every plate :: A second check still only sorts. The cheese station keeps missing wedges at the same rate.

## Stop: lidding
title: Lidding
cargo: Plate with its clear lid on
cargo_detail: Closed over the full plate, rim clear
concepts: packaging-machines, hmi, line-balancing

### Plain
The full plate gets its clear lid, like putting the lid on a takeaway box. This machine is usually bought from a packaging company rather than built from robots. It needs the tray in exactly the right spot and a clean rim, or the lid is crushed or does not seal.

### Precise
There are two common ways to close a tray ([[packaging-machines]]). A rigid clear lid (a plastic dome) is taken from a lid magazine and pressed until it snaps over the rim; that needs its own lid denester (a machine that releases one lid at a time from a stack), a placer (a simple air-driven pick-and-place or a robot with suction cups), and a press. A traysealer instead heat-seals plastic film onto the tray's flange (its flat rim), and many can first replace the air with a gas mix (modified atmosphere packaging, MAP) to slow spoilage. Speed is not the issue: the line needs one lid every 18 s, about 3.3 a minute, below even the 5-15 packs a minute of Sealpac's compact traysealers. Grape stems and cracker packs must sit below the rim, which is why inspection comes right before.

The lidder has its own controller, so the line and the machine must agree on signals: running, faulted, blocked (idle because there is no room downstream), and starved (idle because no product is arriving). PackML (an industry-agreed list of machine states and their names) gives packaging machines a shared set. The HMI (human-machine interface, the operators' screen) shows each station's state, so an operator can see where a stop started. Safety never runs through that screen: emergency stops are wired to the safety circuit (separate wiring and logic whose only job is stopping the machine), so a frozen screen cannot block a stop. Without agreed states, the line controller cannot tell a lidder waiting for trays from one that has jammed.

What breaks: a lid not seated spills or exposes food, a crumb on the flange can make a film seal leak, and a tray a few millimeters off position gets a crushed lid.

### Question
The lidder stops and the HMI marks it "blocked". Inspection and every pick station before it also stop. Where is the problem most likely?
- [ ] Inside the lidder itself, which has jammed on a crooked lid or tray :: A jam shows as faulted. Blocked means the lidder works but has nowhere to send plates.
- [x] Downstream at the outfeed: a full rack not yet swapped :: Blocked means no room downstream, and a full rack backs trays up through lidding and inspection until the pick stations stop.
- [ ] Upstream at the cheese station, which stopped sending plates :: A missing supply would leave the lidder starved, not blocked.
- [ ] The lidder is too slow for the 18 s beat :: The line needs about 3.3 lids a minute, below even small traysealers' 5-15 packs a minute. Speed is not the issue here.

## Stop: outfeed
title: Outfeed
cargo: Lidded plate, leaving for the carts
cargo_detail: Lowered by the gantry into a trolley drawer
concepts: safety-standards, packaging-machines, guarding, gantry

### Plain
The lidded plate gets a printed code, and an overhead robot that slides on straight rails, like an arcade claw machine, lowers it into a rack or trolley drawer bound for the airline. Where a worker swaps full racks, an invisible light beam guards the opening: break it and the robot stops. Safety standards, a shared rulebook a bit like a building code, give the method for working out how far away that beam must be: the slower the robot stops, the farther away the beam must sit.

### Precise
The outfeed prints a code and loads plates into racks or catering trolley drawers, still at 2-4 C. A [[gantry|gantry]] (a frame of straight overhead rails whose carriages move a tool left-right, forward-back, and up-down) is a design judgment that suits open-top containers: it lifts each plate off the line, lowers it in from above, and keeps the floor clear for carts and washdown. If plates had to slide sideways onto shelves inside a closed trolley, a gantry could not do it; that job needs an arm. If a full rack is not swapped, trays back up through lidding and inspection until the pick stations stop.

Where an operator works at an open slot instead of behind a door, a light curtain (a row of infrared beams that sends a stop signal when broken) guards it. It must sit far enough away that the robot finishes stopping before a hand arrives: minimum distance = hand speed × total stopping time, plus an allowance for reaching through. With the 1.6 m/s hand speed from US press rules and an illustrative 0.35 s total stop (curtain, safety controller, robot braking), that is 1.6 × 0.35 = 560 mm plus the reach-through allowance. If braking gets slower, from a heavier gripper or a worn brake, the old distance is no longer enough.

[[safety-standards]] (shared rulebooks that laws point to) set all this. A documented risk assessment following ISO 12100 lists the hazards. The cell is built to ISO 10218-2:2025, or ANSI/A3 R15.06-2025 in the US. Door interlocks follow ISO 14119, the light curtain is positioned per ISO 13855, each safety function (one protective job, such as stopping the robot when the beam is broken) gets the performance level (PL a to e, how unlikely a dangerous failure is) the risk assessment demands per ISO 13849-1, and emergency stops follow ISO 13850 and IEC 60204-1. What breaks if you rely on the robot alone: ISO 10218-1 covers only the robot, as partly completed machinery (a machine that cannot do its job until it is built into something larger), so the integrator (whoever builds the whole cell) must make all of it safe. None of these standards say anything about food hygiene; that comes from separate guidelines.

### Question
The outfeed light curtain was placed for a 0.35 s total stop: 560 mm plus the reach-through allowance. Later the gantry gets a heavier gripper and stops more slowly. What follows?
- [ ] Nothing changes, because the curtain itself is a top-grade safety device :: Even a Type 4 curtain, the kind that must not fail dangerously, says nothing about whether the robot stops before a hand arrives. Distance depends on stopping time.
- [ ] The cell stays safe, because the robot itself complies with ISO 10218-1 :: ISO 10218-1 covers only the robot, as partly completed machinery. The integrator is responsible for the whole cell, guard distances included.
- [ ] Adding a warning sign at the slot makes up for the difference :: Signs and lights are awareness devices: they warn but stop nothing, so they cannot make up for a curtain that is too close.
- [x] Measure the stopping time again, and move the curtain farther out if needed :: Minimum distance is hand speed × total stopping time, so a slower stop needs more distance.

## Puzzle
title: What fixes it?
type: match

### Prompt
Each row is a real problem on this line. Pick the machine or idea that fixes it. One option is a trap that fixes none of them.

### Data
```json
{
  "options": [
    {"id": "denester", "label": "A denester chosen for reliable single feeds"},
    {"id": "inspection", "label": "Camera inspection with a reject lane"},
    {"id": "interlock", "label": "Interlocked guard door, plus lockout"},
    {"id": "ip69k", "label": "IP69K plus IP67 rated equipment"},
    {"id": "second-robot", "label": "A second robot sharing the picks"},
    {"id": "faster-robot", "label": "A faster robot at that station"}
  ],
  "rows": [
    {
      "item": "Two molded fiber trays stick together and drop onto the belt as one",
      "answer": "denester",
      "why": {
        "denester": "Double feeds are the denester's classic failure. It runs at under 3% of its rated speed, so choose it for clean single feeds with molded fiber trays, not for speed.",
        "inspection": "Inspection might catch the bad plate at the end, but it only sorts. The double feed still happens at the first station, and each stop there starves every station after it.",
        "interlock": "Guarding keeps people away from moving robots. It does nothing about trays clinging to each other in the stack.",
        "ip69k": "A sealing rating keeps water out of a machine. It does not separate nested trays.",
        "second-robot": "The trays cling together in the stack, before any robot touches them. More pick capacity downstream does not change how the denester separates them.",
        "faster-robot": "Speed is not the problem here: the line needs about 3.3 trays a minute from a denester rated for about 120."
      }
    },
    {
      "item": "A plate leaves the cheese station with two wedges instead of three, and must not reach the aircraft",
      "answer": "inspection",
      "why": {
        "denester": "The denester only releases empty trays. It cannot know that a wedge goes missing later.",
        "inspection": "The camera counts the wedges, the pusher sends the plate to the rework lane, and the reason \"cheese count 2\" tells the operator which station to fix.",
        "interlock": "A door switch protects people. It has nothing to do with counting wedges.",
        "ip69k": "A sealed housing keeps water out. It does not notice a missing wedge.",
        "second-robot": "Another cheese robot adds capacity, but it can still miss a wedge, and nothing would stop that plate going on to the aircraft.",
        "faster-robot": "A faster robot can miss wedges just as often. Speed does nothing to catch the bad plate."
      }
    },
    {
      "item": "The grape arm could still move while a technician reaches in to free a tangled bunch",
      "answer": "interlock",
      "why": {
        "denester": "The denester has nothing to do with the grape cell. Refilling magazines from outside the guard cuts trips into cells, but freeing a bunch still means reaching in.",
        "inspection": "The inspection camera checks plates, not people. Stopping the robot when someone reaches in is the job of a guard wired to the safety circuit.",
        "interlock": "Opening the interlocked door tells the safety circuit to stop the arm, and locking the power off before going in covers the maintenance work during which many robot accidents happen.",
        "ip69k": "A rating keeps water and dust out. It does nothing to keep a person away from a moving arm.",
        "second-robot": "Another robot means more motion to guard, not less.",
        "faster-robot": "A faster arm only raises the stakes: a guard has to stop the robot before a hand can reach it, and faster motion makes that harder."
      }
    },
    {
      "item": "An IP67 sensor on the cheese belt will be sprayed with hot, high-pressure jets during the daily washdown",
      "answer": "ip69k",
      "why": {
        "denester": "A denester does not protect a sensor. The QUPAQ denesters are themselves marketed as IP67-rated and should be cleaned the way the vendor allows, not blasted.",
        "inspection": "Inspection can catch a broken fragment that falls into food, but it does not keep water out of a sensor.",
        "interlock": "Door switches in the washdown zone need a suitable rating too, but a guard door does not shield a sensor from jets.",
        "ip69k": "IP67 proves dust-tightness and 30 minutes under 1 m of water, not survival of an 80 bar, 80 C jet from 10 cm. That is the IP69K test, so the spec should list both, plus resistance to the cleaning chemicals.",
        "second-robot": "Adding a robot does not change what the sensor's seals were tested against.",
        "faster-robot": "Speed has nothing to do with whether a sensor survives the jets."
      }
    },
    {
      "item": "The apple station, with four picks per plate, holds up every other station",
      "answer": "second-robot",
      "why": {
        "denester": "The denester runs at under 3% of its rated speed. It is not what holds the line up.",
        "inspection": "Inspection sorts finished plates. It adds no picking capacity.",
        "interlock": "An interlock can only stop a robot. It never adds speed.",
        "ip69k": "A washdown rating does not make picks any faster.",
        "second-robot": "In the illustrative model, two robots placing two slices each move the bottleneck to cheese and lift the line from about 165 to about 267 plates an hour when apple picks are slow.",
        "faster-robot": "Tempting, but the delta moves for well under a second of each pick. Most of the pick is camera, tracking, vacuum, and gentle placing, so a faster arm saves little."
      }
    }
  ]
}
```

### Debrief
Most fixes sit where the problem starts. Double feeds are a denester reliability question, not a speed one. Inspection is the exception: it keeps the plate missing a wedge off the aircraft, but only feeding its reject reason back to the cheese station stops the next one. A guard door has to stop the robot, and lockout/tagout backs it during maintenance. IP67 does not prove survival of hot high-pressure jets, so anything sprayed directly in the food zone should be rated IP69K plus IP67. The faster robot fixes nothing on this line: even at the apple bottleneck the arm moves for well under a second of each pick, so the real fix is sharing the picks.
