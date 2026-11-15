---
area: 6
slug: cell-and-line
title: Cell and line
---

# Cell and line

A robot on its own does nothing useful. This area covers everything around the robots that turns a
few arms into a production line: the belts that carry trays, the machines that feed in trays and
ingredients, the camera that checks each plate, the machine that puts the lid on, the fences and
light beams that keep people safe, the screen operators use, and the numbers engineers use to judge
whether the whole line keeps up (cycle time, takt time, bottlenecks, OEE).

On the cheese plate line this is the whole journey of one tray: out of the denester, along the
conveyor past the grape, apple, cracker, and cheese robots, through inspection, under the lidder,
and off the outfeed, all inside a 2-4 C room that is washed down every day. The target of about
200 plates an hour sets the beat for every station: one plate every 18 seconds.

## Conveyor
id: conveyor
requires: none
aka: belt conveyor, modular plastic belt, indexing conveyor, accumulation conveyor

### Plain
A conveyor is a moving floor that carries things from one worker to the next, like the belt in a
sushi restaurant. On a robot line it brings each tray to each robot, so the robots never have to
move around the room. It also sets the pace, because it decides where each tray is and when it
arrives.

### Where the analogy breaks
A sushi belt runs at one steady speed and diners grab whatever passes. An automated line often moves
in exact steps and stops, and the robots must know where each item is to within a few millimeters,
which no diner needs.

### Precise
Industrial conveyors come in a few families [1]. Flat belts (a continuous loop of fabric or urethane
pulled around a drum by friction) are simple and gentle but need tensioning and tracking (keeping the
belt from wandering sideways). Modular plastic belts (many small plastic pieces hinged together like a
watch strap) and thermoplastic positive-drive belts are common in food because they are driven by
teeth rather than friction and are easier to strip and clean [unverified: construction details from
general knowledge, not the opened pages]; Intralox markets its ThermoDrive belt as removing the
tensioning, tracking, and cleanability problems of flat belts [3]. Roller and chain conveyors carry
cartons, pallets, and car bodies [1].

A conveyor runs either continuously or indexed (it moves one fixed step, called the pitch, then stops
while work happens). Continuous motion gives smoother flow but makes every robot hit a moving target.
That needs conveyor tracking: an encoder (a sensor that counts how far a shaft has turned) on the belt
drive tells the robot controller how far the belt has moved since a camera or photo-eye saw the item,
so the robot can predict where the item is now. Delta robot makers sell exactly this, tracking of fast
moving belts plus control of indexing belts, as part of their picking software [4].

What breaks without a good conveyor: items slip or shift on the belt, so the robot's predicted
position is wrong and picks miss; uneven spacing means one station gets two trays at once and the next
gets none. Accumulation sections (stretches of belt that let items queue) act as buffers so one
station's pause does not stop every other station.

### On the cheese plate line
If trays sit at a 300 mm pitch (an illustrative number) and the line makes 200 plates an hour, one tray
must leave each station every 18 s. A continuously moving tray belt would crawl at 300 mm / 18 s, about
17 mm/s or 1 m per minute. That is slow enough that indexing is attractive: the belt moves one pitch
in 1-2 s, stops, and each robot places onto a stationary tray. The ingredient belts are different:
apple slices and cheese wedges arrive in bulk on their own continuously moving belts, so those robots
pick from a moving belt using a camera plus conveyor tracking [4]. Everything is washed daily, which is
why food lines favor open stainless frames and plastic belts that lift off for cleaning [3].

### Elsewhere
In a parcel warehouse, a sorter belt carries boxes past a barcode scanner and then past a row of
chutes. Nothing re-scans the box at each chute: the controller counts belt movement since the scan
and fires the right diverter when that box arrives. It is the same tracking idea a picking robot uses,
and a slipping belt causes the same failure, a box sent down the wrong chute.

### Why it exists
Moving work to fixed stations is cheaper and more predictable than moving people or robots to the
work. The conveyor also gives every item a known position and timing, which is what lets a blind
machine downstream act on it.

### Connects to
- [[conveyor-tracking]] — the software that lets a robot pick from a moving belt
- [[encoder]] — the sensor that measures belt travel
- [[feeder]] — feeders put items onto the conveyor one at a time
- [[line-balancing]] — accumulation buffers on the conveyor decouple stations
- [[hygienic-design]] — belts are among the hardest food-zone parts to clean

### Real products and tools
- **Intralox modular plastic belting and ThermoDrive** — plastic belt systems widely used in food plants [2][3]
- **Dorner conveyors** — small and mid-size conveyors, including the AquaPruf sanitary line for washdown
- **Interroll** — conveyor rollers, motorized drive rollers, and conveyor modules for cartons
- **ABB PickMaster** — picking software that handles vision and conveyor tracking for ABB delta robots (named in the 2017 IRB 360 datasheet) [4]

### Common misconception
**Misconception:** The conveyor is just a dumb belt; the clever part is the robot.

**Reality:** The robot only knows where an item is because the conveyor and its encoder tell it. Belt
slip, stretch, and uneven spacing turn directly into missed picks, so belt choice, drive, and tracking
are part of the robot's accuracy budget.

### Key numbers
- Heavy-duty roller conveyors: up to about 75 ft/min (23 m/min) [1]
- Cheese line tray belt, if continuous: about 17 mm/s (illustrative: 300 mm pitch / 18 s takt)
- Cheese line index move: about 1-2 s per pitch (illustrative)

### Sources
1. [Conveyor system](https://en.wikipedia.org/wiki/Conveyor_system) — Wikipedia; conveyor types and roller conveyor speeds
2. [Modular plastic belting](https://www.intralox.com/products/modular-plastic-belting) — Intralox; product family overview
3. [Intralox FoodSafe](https://www.intralox.com/solutions/foodsafe) — Intralox; ThermoDrive claims on tensioning, tracking, and cleanability; detectable belt materials
4. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/a3759d3f3e7141deba89d1caeb1dd4e4/IRB%20360%20FlexPicker_Datasheet_US%20Letter.pdf) — ABB, 2017; conveyor tracking, indexing belt control, PickMaster software

## Feeders and denesters
id: feeder
requires: conveyor
aka: denester, tray denester, lid denester, bowl feeder, flexible feeder, magazine

### Plain
A feeder hands items to the line one at a time, the way a gumball machine drops exactly one gumball
per turn. A tray denester does this for stacked trays: it holds a tall stack and releases a single tray
onto the belt each time the line asks for one. Without feeders, a person would hand-place every item.

### Where the analogy breaks
A gumball can come out any way up, but most feeders must also deliver the item in a known position and
orientation, or the next machine cannot grab it. And gumballs do not stick together, while nested
trays that cling to each other are the classic jam.

### Precise
A feeder turns bulk or stacked material into a stream of single items at a known place, orientation
(which way up and which way round), and rate. Vibratory bowl feeders shake small parts up a spiral
track whose custom tooling knocks wrongly oriented parts back into the bowl; they are fast and cheap
per part, but each new part needs new tooling, and they cannot sort parts that look the same from every
side or differ only by color [3]. Flexible feeders replace the tooling with a camera: parts are spread
on a shaking surface, the camera finds ones lying well, and a robot picks them [unverified: flexible
feeder vendor documentation not opened].

A denester separates nested trays or lids from a stack held in a magazine (a holder for the stack) and
puts them on the conveyor. Scroll denesters use rotating screws on the tray rim to release trays one
at a time [unverified: mechanism not described on the opened page], and pick-and-place denesters pull
several trays at once with servo-driven motion synchronized to the line [1]. Rated speeds run from about
70 to 400 trays per minute, depending on the drive (pneumatic or servo), one lane or two, and the tray
shape [1][2]. Changing tray size usually means swapping the magazine [1].

What breaks: double feeds (two trays stuck together go down as one), missed feeds, and crushed rims.
Each one either stops the line or produces a bad plate. Soft food such as apple slices cannot go
through a bowl feeder at all, so it is usually spread on a belt and located by a camera; there the
"feeder" is really a conveyor plus perception.

### On the cheese plate line
The tray denester is the first station. At 200 plates/h it must release one tray every 18 s, about 3.3
trays per minute, while a pneumatic denester sold for food lines is rated up to about 120 trays per
minute [2]. It runs at under 3% of its rated speed, so the design questions are reliability with molded
fiber trays and how often someone refills the magazine, not speed. A magazine holding 250 trays
(illustrative) lasts 75 minutes at 200 plates/h. The lid station needs its own denester for clear lids.
Apple slices and cheese wedges arrive in bulk on belts and are found by a camera, and grape bunches,
which tangle, may be singulated by hand onto their belt (an illustrative design choice).

### Elsewhere
In engine or electronics assembly, a vibratory bowl feeder delivers screws head-up, one at a time, to
an automatic screwdriver [3]. When the product changes to a new screw size, the bowl usually needs new
tooling, which is why flexible, camera-based feeders are popular in plants with many product variants.

### Why it exists
Robots and fixed machines need items one at a time in a known pose. Material arrives in bulk, in
stacks, or tangled; the feeder restores order so the expensive machine downstream never waits or
guesses.

### Connects to
- [[conveyor]] — feeders place items onto the conveyor at a set pitch
- [[perception]] — camera-based feeding replaces mechanical orientation with vision
- [[vacuum-gripper]] — pick-and-place denesters and lid pickers often use suction cups
- [[photo-eye]] — confirms a tray actually arrived, catching missed feeds
- [[line-balancing]] — magazine refills and jams are availability losses at the first station

### Real products and tools
- **QUPAQ ANYTRAY and INTRAY denesters** — pneumatic and servo tray denesters, sold in the UK by Sealpac as of 2026 [2]
- **Sealpac pick-and-place and scroll denesters** — tray denesting for food packing lines [1]
- **Asyril Asycube and FlexiBowl** — flexible, camera-based feeders for small parts
- **Vibratory bowl feeders** — built per part by specialist tooling shops [3]

### Common misconception
**Misconception:** A faster denester makes a faster line.

**Reality:** On the cheese plate line the denester uses under 3% of its rated speed. What matters is
how rarely it double-feeds or jams and how long a magazine lasts, because each stop at the first
station starves every station after it.

### Key numbers
- Pneumatic tray denesters: up to about 120 trays/min, running on 6 bar air [2]
- Servo tray denesters: up to about 200 trays/min on one lane, up to 400 on scroll or twin-lane machines, tray dependent [1][2]
- Cheese line demand: about 3.3 trays/min (200 plates/h)

### Sources
1. [Denesting and tray handling](https://www.sealpac-uk.com/denesting) — Sealpac UK; scroll and pick-and-place denesters, speeds, magazine swap
2. [QUPAQ tray denesting range](https://www.sealpac-uk.com/qupaq-tray-denesting-range) — Sealpac UK; pneumatic and servo models, rated speeds, 6 bar air, IP67 claim
3. [Bowl feeder](https://en.wikipedia.org/wiki/Bowl_feeder) — Wikipedia; how vibratory bowl feeders orient parts and their limits

## Inspection and reject
id: inspection
requires: conveyor, camera-2d
aka: quality inspection, vision inspection, checkweigher, reject station, metal detector, X-ray inspection

### Plain
Inspection is the line checking its own work before anything leaves, like a teacher marking a test
against an answer key. Each plate is compared with what it should contain, and a plate that fails is
pushed off into a side lane. A person then fixes it or throws it away.

### Where the analogy breaks
A teacher can take time and use judgment on a borderline answer. The line decides in a fraction of a
second against a fixed threshold, and every threshold trades good plates wrongly thrown out against bad
plates that slip through.

### Precise
Inspection measures each item against a specification and makes a pass or fail decision; reject is the
mechanism that removes failures without stopping the line. Common sensors are cameras (presence,
count, position, color, labels), checkweighers (a short belt on a load cell, a sensor whose output
changes with force, that weighs each pack while it moves), metal detectors, and X-ray systems that
find dense foreign bodies such as glass, stone, bone, or metal [1][2]. Reject mechanisms include air
blasts or pneumatic pushers for light items, diverter arms, and belts that drop away so fragile items
slide gently into a bin [1].

Two errors matter. A false reject throws out a good item and costs product; an escape passes a bad item
to the customer. Moving the threshold trades one for the other. The decision is made at one point and
the reject happens further down the belt, so the controller must track each item between the two,
usually by counting encoder pulses or index steps [unverified: common practice, not from an opened
source]. Results also feed the quality factor of [[oee]] (good count divided by total count) [3].

What breaks without it: defects are found by the customer, and nobody learns which station is causing
them. A reject reason code is often more valuable than the reject itself, because it points at the
station to fix.

### On the cheese plate line
After the cheese pick, a camera above the tray checks for one grape bunch, four apple slices, one or two
cracker packs, three cheese wedges, and nothing hanging over the rim where the lid would crush it. At
200 plates/h the station has up to 18 s per plate, so even a slow, high-resolution check fits. Failed
plates are pushed into a rework lane, and the reason (for example "cheese count 2") tells the operator
which pick station is slipping; at a 2% reject rate that is about 4 plates an hour. Foreign-body
detection belongs here too, because a chip of gripper or belt could land in open food [2].

### Elsewhere
Airport baggage screening follows the same pattern: every bag passes a scanner, bags that raise an alarm
are diverted to a separate belt where a person checks them, and the system has to keep track of which
bag is which between the scanner and the diverter [unverified: general description, no source opened].

### Why it exists
No robot, gripper, or feeder is perfect. Catching a bad plate at the line costs one plate; catching it
on the aircraft costs a complaint, and a foreign body in food can mean a recall.

### Connects to
- [[camera-2d]] — the usual sensor for counting and placement checks
- [[perception]] — the software that turns images into counts and positions
- [[plc]] — tracks each tray from the inspection point to the reject point
- [[oee]] — inspection supplies the quality factor
- [[photo-eye]] — triggers the camera when a tray arrives and confirms rejects

### Real products and tools
- **Mettler-Toledo** — checkweighers, metal detectors, and X-ray inspection for food lines
- **Cognex In-Sight and Keyence vision systems** — smart cameras for presence, count, and label checks
- **Sealpac inspection range** — combined metal, X-ray, and checkweighing units plus seal and label checks [2]
- **Ishida** — checkweighers and X-ray inspection for packaged food

### Common misconception
**Misconception:** Adding inspection improves quality.

**Reality:** Inspection only sorts. The plates come out of the pick stations just as good or bad as
before; quality improves only when reject reasons are fed back and someone fixes the station causing
them.

### Key numbers
- Checkweighers: over 500 items per minute, depending on pack size and the accuracy needed [1]
- Example vision box check: up to 2,500 pieces per hour [2]
- Cheese line time budget: up to 18 s per plate at 200 plates/h

### Sources
1. [Checkweigher](https://en.wikipedia.org/wiki/Checkweigher) — Wikipedia; how checkweighers weigh and reject, speeds
2. [Packaging inspection systems](https://www.sealpac-uk.com/packaging-inspection-systems) — Sealpac UK; inspection types, foreign bodies detected, example speeds
3. [Calculating OEE](https://oee.com/calculating-oee) — oee.com; quality defined as good count over total count

## Lidding and outfeed machines
id: packaging-machines
requires: conveyor
aka: traysealer, tray sealer, lidder, lid press, outfeed, MAP, sleever

### Plain
The lidding machine closes the finished plate, like putting the lid on a takeaway box before handing it
over. The outfeed is the exit: it labels, stacks, and hands plates to whatever carries them away. These
are usually bought from packaging machine makers rather than built from robots.

### Where the analogy breaks
Snapping a lid on by hand is forgiving. A machine needs the tray to arrive within a few millimeters of
the right spot and a clean rim, and a film seal needs the right heat, pressure, and time; one crumb on
the rim can make a leaking seal.

### Precise
There are two common ways to close a tray. A rigid lid (such as a clear plastic dome) is taken from a
lid magazine and pressed until it snaps over the rim. A traysealer instead lays plastic film over the
tray, presses a heated tool onto the flange (the flat rim around the tray), and cuts the film; many can
first replace the air with a gas mix (modified atmosphere packaging, MAP) or pull a vacuum to slow
spoilage [1]. Traysealer speeds range from about 5-15 packs per minute for small machines to 10-320
packs per minute for large single and double lane machines [1].

The outfeed covers everything after closing: printing codes and labels, accumulating (a buffer table or
belt that lets the line keep running when the next step pauses), and loading cases, racks, or carts.
Sleevers that slide a cardboard band around a tray run up to 100 trays per minute with changeovers under
five minutes [2]. Each of these machines has its own controller, so integrating them means agreeing
handshake signals with the line (ready to accept, tray present, faulted) [unverified: common practice,
not from an opened source].

What breaks: a lid not seated spills or exposes food; a weak seal leaks; and a full outfeed blocks the
line, so trays back up until the robots stop.

### On the cheese plate line
Lidding needs one lid every 18 s, about 3.3 per minute, which is below even the small traysealer range
of 5-15 packs per minute [1], so speed is not the issue. The running example uses a clear lid; a snap-on
dome needs a lid denester, a placer (a simple pneumatic pick-and-place or a robot with suction cups),
and a press, and it needs grape stems and cracker packs to sit below the rim, which is why inspection
comes right before it. The outfeed prints a code and loads plates into racks or catering trolley
drawers, still at 2-4 C; Newrest describes collaborative robots assisting with trolley assembly in its
flight kitchens [3]. If a full rack is not swapped, trays back up through lidding and inspection until
the pick stations stop.

### Elsewhere
A supermarket meat-packing line uses the traysealer idea at high speed: trays of mince are gas-flushed
with MAP and sealed on a double lane machine, at rates toward the top of the 10-320 packs per minute
range [1]. Here the sealer is often the line's pacing machine, the opposite of the cheese plate line.

### Why it exists
Closing protects the food and marks it with what it is and when it expires. Fixed packaging machines do
these repetitive motions faster, cheaper, and more consistently than general-purpose robots.

### Connects to
- [[inspection]] — catches overhanging items before they jam the lidder
- [[conveyor]] — accumulation at the outfeed decides whether a pause downstream stops the line
- [[plc]] — exchanges ready and fault signals with the packaging machines
- [[hygienic-design]] — sealing tools and lid paths are food-zone surfaces
- [[cycle-time]] — the lidder must keep the 18 s beat

### Real products and tools
- **Sealpac Amax and M-series traysealers** — film sealing with MAP, vacuum, and skin options [1]
- **Multivac traysealers** — tray sealing machines for food packaging
- **Proseal and Ishida traysealers** — tray sealing for ready meals and fresh food
- **Sleevers and flowrappers** — sold by packaging lines such as Sealpac UK [2]

### Common misconception
**Misconception:** Lidding is a simple last step that cannot go wrong if the plate is right.

**Reality:** Closing is where small upstream errors become failures. A grape stem over the rim, a crumb
on the flange, or a tray a few millimeters off position turns into a crushed lid or a leaking seal, so
lidding depends on inspection and conveyor accuracy.

### Key numbers
- Traysealers: about 5-15 packs/min (small) up to 10-320 packs/min (large, single or double lane) [1]
- Sleevers: up to 100 trays/min, changeover under 5 minutes [2]
- Cheese line lidding demand: about 3.3 lids/min

### Sources
1. [SEALPAC traysealer range](https://www.sealpac-uk.com/sealpac-traysealer-range) — Sealpac UK; traysealer speed ranges and pack styles (MAP, vacuum, skin)
2. [Packaging machines](https://www.sealpac-uk.com/packaging) — Sealpac UK; sleever speed and changeover, other packaging machines
3. [Cobot lines at the heart of our inflight catering production units](https://media.newrest.eu/news/cobot-lines-at-the-heart-of-our-inflight-catering-production-units/) — Newrest; cobots and trolley assembly assistance in flight kitchens

## Guarding and presence sensing
id: guarding
requires: none
aka: safeguarding, fence, interlock, light curtain, safety laser scanner, safety mat, muting

### Plain
Guarding keeps people's bodies away from a robot while it moves, like the fence and self-closing gate
around a swimming pool. Where a fence would get in the way, invisible sensors such as light beams act as
the gate: break the beam and the robot stops. Either way, the robot may not move dangerously while
someone could reach it.

### Where the analogy breaks
A pool fence only blocks. A machine guard is wired into the control system, so opening a door actively
stops the machine, and a light beam must be far enough away that the robot has finished stopping before
a hand can reach it.

### Precise
Safeguards come in a few types [1]: fixed guards (fences or panels that need a tool to remove);
interlocked movable guards (doors with a switch that tells the safety circuit to stop the robot when
opened); presence-sensing devices (light curtains, safety laser scanners that watch a configured zone on
the floor, pressure-sensitive mats, safety vision systems); and awareness devices such as lights,
signs, and chains, which only warn [1]. A safety light curtain is a transmitter and receiver pair whose
pulsed infrared beams send a stop signal when interrupted; Type 4 devices must not fail dangerously even
with accumulated faults, while Type 2 devices suit lower risks [5].

Presence sensing only works if the sensor is far enough from the hazard. The rule is: minimum distance =
approach speed of the body × total stopping time (sensor response + safety logic + robot braking), plus
an allowance for how far a hand reaches through before it is detected. US mechanical press rules use 63
inches per second (1.6 m/s) for the hand [4]. Internationally, ISO 13855:2024 gives the method for light
curtains, laser scanners, mats, two-hand controls, and interlocking guards, based on walking and arm
speeds, for people aged 14 and over [2].

Interlocks only help if people do not defeat them (taping a switch, bridging a sensor). ISO 14119:2024
covers choosing interlocks, including trapped-key systems (a key that cannot leave the lock until the
machine is safe) and designs that resist foreseeable defeat [3]. Muting (switching off a presence
sensor for part of the cycle) lets product pass through a light curtain without stopping the line [1][5].
OSHA notes that many robot accidents happen not in normal running but during programming, maintenance,
testing, and setup, when people are inside the robot's reach [1].

### On the cheese plate line
Each pick station sits inside stainless and clear polycarbonate panels with interlocked doors, so
opening a door to clear a dropped cheese wedge stops that robot. Trays pass in and out through small
tunnel openings sized so a hand cannot reach the robot [unverified: reach-distance tables not opened],
and the tray and lid magazines are refilled from outside the guard. If an outfeed operator works at an
open slot instead of a door, a light curtain guards it: with an illustrative total stopping time of
0.35 s (curtain, safety controller, delta robot braking), the curtain must be at least 1.6 m/s × 0.35 s
= 560 mm from the nearest hazard, plus the reach-through allowance [4]. Safety devices in the washdown
zone need a suitable [[ip-rating]].

### Elsewhere
A car body welding cell is usually fully fenced with interlocked gates, because welding robots are fast,
heavy, and throw sparks. OSHA lists failure to apply lockout/tagout (each worker locking the energy off
with a personal lock before entering) and servicing during automatic mode among common causes of robot
accidents [1], which is why the gate interlock is backed by a procedure, not trusted alone.

### Why it exists
Industrial robots move fast and with great force, and a person cannot predict their next motion.
Guarding makes the dangerous space and the human space separate, or makes the robot stop before the two
can overlap.

### Connects to
- [[safety-circuit]] — door switches and light curtains feed the safety circuit that removes power
- [[estop]] — the manual stop that complements automatic guarding
- [[cobot]] — collaborative robots replace some guarding with force and speed limits
- [[safety-standards]] — ISO 13855 and ISO 14119 govern guard distances and interlocks
- [[ip-rating]] — light curtains and switches in washdown areas need sealed housings

### Real products and tools
- **SICK** — safety light curtains and safety laser scanners
- **Pilz** — safety light curtains, guard locking switches, and safety relays
- **Fortress Interlocks** — trapped-key and guard-locking systems
- **Troax and Axelent** — modular machine guard fencing

### Common misconception
**Misconception:** A light curtain makes it safe to stand right next to the robot.

**Reality:** It is only safe if it sits at the distance the stopping time demands. If the robot's
braking gets slower (a heavier gripper, a worn brake, a faster program), the old distance is no longer
enough, so stopping time has to be measured and rechecked.

### Key numbers
- US hand speed constant for press safety distance: 63 in/s, about 1.6 m/s [4]
- ISO 13855:2024 covers people aged 14 and over and excludes running, jumping, and falling [2]
- Example cheese line distance: about 560 mm plus reach-through allowance (illustrative 0.35 s stop)

### Sources
1. [OSHA Technical Manual, Section IV Chapter 4: Industrial Robot Systems and Industrial Robot System Safety](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) — OSHA; safeguard types, accident patterns, muting definition
2. [ISO 13855:2024](https://committee.iso.org/standard/80590.html) — ISO; positioning of safeguards, devices covered, scope limits
3. [ISO 14119:2024](https://online.standard.no/en/iso-14119-2024) — Standards Norway catalogue; interlocking devices, trapped keys, defeat
4. [29 CFR 1910.217 Mechanical power presses](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.217) — OSHA; safety distance Ds = 63 in/s × Ts
5. [Light curtain](https://en.wikipedia.org/wiki/Light_curtain) — Wikipedia; how safety light curtains work, Type 2 versus Type 4, muting

## HMI
id: hmi
requires: plc
aka: human-machine interface, operator panel, touch panel, SCADA, andon

### Plain
An HMI is the screen and buttons that let a person see and steer a machine, like the dashboard and
controls in a car. It shows what each station is doing, raises alarms when something goes wrong, and lets
the operator start, stop, or switch products. It does not do the controlling itself; it talks to the
computer that does.

### Where the analogy breaks
A car dashboard serves one driver. A line HMI serves operators, maintenance technicians, and supervisors
with different permissions, and the most important controls, such as emergency stops, must never depend
on the screen at all.

### Precise
An HMI (human-machine interface) is usually a touchscreen panel or PC program connected over an
industrial network to the PLC (programmable logic controller, the rugged computer that runs the line
logic). It reads and writes tags (named variables inside the PLC, such as a station's state or a good
plate count) and draws them as screens: an overview, alarms with time stamps and acknowledgment, recipes
(stored sets of settings for each product variant), manual modes for moving axes by hand, counters, and
maintenance pages. SCADA (supervisory control and data acquisition) is the same idea scaled to many
machines or a whole plant.

Safety does not run through the touchscreen. Emergency stops are wired to the safety circuit, and a
robot teach pendant (the handheld, robot-specific HMI) carries a three-position enabling device [2], a
grip switch that allows motion only while held in its middle position, so both letting go and
squeezing hard in panic stop the robot [unverified: mechanism description not in the opened datasheet].

HMI design is a discipline of its own. ISA-101.01-2015 covers HMIs for process automation systems across
a lifecycle of design, implementation, operation, and continuous improvement, with technical reports on HMI philosophy
(2022) and usability (2019) [1]. A common practice, often called high-performance HMI, keeps screens gray
and calm so color appears only when something is abnormal [unverified: not stated on the opened ISA
page]. Without good design, a jam produces a flood of alarms and the operator cannot tell which one
caused the rest.

### On the cheese plate line
The overview screen shows the eight stations left to right, each with a state: running, starved
(waiting for a tray), blocked (waiting for room downstream), or faulted. Beside it sit the current rate
against the 200 plates/h target and the shift's OEE, which needs good and total counts [3]. An alarm such
as "cheese pick: vacuum not reached after 3 retries" tells the operator which gripper to check, and
inspection's reject reasons appear next to it. A recipe change might switch the cheese station from three
wedges to four for a premium plate (illustrative), which changes the takt math for that station. A
washdown mode parks every robot in a cleaning position, and the panel itself must survive the daily
washdown.

### Elsewhere
In car assembly, an andon board is a shared HMI for a whole line: a worker pulls a cord or presses a
button when there is a problem, and the board lights the station number so a team leader can help before
the car leaves that zone [unverified: no source opened].

### Why it exists
Operators need to see and command machines without reading PLC code, and maintenance needs to find the
cause of a stop in seconds. The HMI turns hundreds of internal variables into a few decisions a person can
make.

### Connects to
- [[plc]] — the HMI reads and writes PLC tags
- [[oee]] — the HMI is where shift OEE and loss reasons are shown
- [[estop]] — emergency stops are hard-wired, never screen buttons
- [[state-machines]] — station states on the screen mirror the controller's state machine
- [[operator-interfaces]] — remote operator screens in teleoperation follow similar design rules

### Real products and tools
- **Siemens SIMATIC HMI panels and WinCC** — operator panels and HMI and SCADA software
- **Rockwell Automation PanelView and FactoryTalk View** — operator panels and HMI software
- **Inductive Automation Ignition** — web-based HMI and SCADA platform
- **ISA-101 series** — the HMI design standard and technical reports [1]

### Common misconception
**Misconception:** The HMI is just a user interface skin, so anyone can throw one together at the end.

**Reality:** Bad HMI design causes operator mistakes and slow recovery, and it is a common reason a line's
uptime is lower than its machines allow. ISA-101 treats it as an engineered artifact with a philosophy,
a style guide, and a lifecycle [1].

### Sources
1. [ISA-101 series of standards](https://www.isa.org/standards-and-publications/isa-standards/isa-101-standards) — ISA; ISA-101.01-2015, TR101.01-2022, TR101.02-2019, lifecycle approach
2. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/a3759d3f3e7141deba89d1caeb1dd4e4/IRB%20360%20FlexPicker_Datasheet_US%20Letter.pdf) — ABB, 2017; lists a three-position enabling device among safety features
3. [Calculating OEE](https://oee.com/calculating-oee) — oee.com; counts needed to compute OEE

## Cycle time, takt time, and throughput
id: cycle-time
requires: none
aka: takt time, throughput, lead time, picks per minute, Little's law

### Plain
Takt time is the beat a line must keep to meet demand, like the stroke rate a coxswain sets for a rowing
crew. Cycle time is how long each station actually takes for one item. If every station finishes inside
the beat, the line keeps up; if one is slower, the whole line slows to it.

### Where the analogy breaks
Rowers all pull at the same instant on the same boat. Stations work on different items at the same time,
and items can wait in buffers between them, so a station can briefly fall behind and catch up.

### Precise
Takt time is available production time divided by customer demand [1] (takt is German for a precise
interval, like a musical beat [1]). Cycle time is the measured time to complete one unit at a station [2].
Throughput is units per unit time; in a serial line at steady state it is set by the slowest station.
Lead time is how long one unit spends from entering to leaving, usually far longer than any cycle time
[2]. Little's law ties them together: average number of items in the system = throughput × average time
in the system, for any stable system regardless of the details [5].

Two cautions. First, available time is net time: a 480-minute shift with 80 minutes of breaks, briefings,
and maintenance leaves 400 minutes [3], and unplanned stops eat into it further, so stations are
designed to cycle faster than takt; one common guideline is a 3-5% allowance for downtime [3], and lines
with frequent jams need more. Second, a robot's catalog cycle time is a standardized test move, not your
task: ABB quotes 0.30-0.60 s for its IRB 360 delta on a cycle of 25 mm up, 305 mm across, 25 mm down,
depending on model and payload, and tells buyers to verify real cycles by simulation or test [4].

### On the cheese plate line
200 plates per hour gives a takt of 3600 s / 200 = 18 s per plate. Each station's required pick rate is
picks per plate × 60 / 18:

- Grape: 1 bunch, so 3.3 picks/min (18 s available per pick)
- Apple: 4 slices, so 13.3 picks/min (4.5 s per pick)
- Cracker: 1-2 packs, so 3.3-6.7 picks/min (9-18 s per pick)
- Cheese: 3 wedges, so 10 picks/min (6 s per pick)

That is 9-10 picks per plate, or 30-33 picks per minute for the whole plate, far below a delta robot's
catalog rate of roughly 100-200 standard cycles per minute [4]. The real limits are grasp reliability,
vision, and recovering from failed picks, not arm speed. With 8 stations holding one tray each plus, say,
6 trays waiting in buffers, Little's law gives a lead time of 14 trays / 200 per hour, about 4.2 minutes
from denester to outfeed [5].

### Elsewhere
A car plant that must build 480 cars across two shifts of 450 net minutes each has a takt of 900 / 480,
about 1.9 minutes or 112 s per car (illustrative numbers). Every station, from door fitting to windshield
install, is sized so its work fits that interval, and Toyota typically reviews the takt for a process
every month as demand changes [1].

### Why it exists
Takt converts a sales number (plates per day) into an engineering target (seconds per station), and cycle
time measures whether each station meets it. Together they give one unit for designing, comparing, and
fixing stations.

### Connects to
- [[line-balancing]] — spreading work so every station's cycle fits inside takt
- [[oee]] — ideal cycle time is the performance baseline
- [[speed-specs]] — catalog robot cycle times and what they leave out
- [[conveyor]] — index time adds to every station's cycle
- [[scoping]] — takt is the first number in sizing a robot project

### Real products and tools
- **ABB RobotStudio** — robot simulation used to verify cycle times before building [4]
- **Siemens Tecnomatix Plant Simulation** — discrete-event simulation of whole lines
- **FlexSim** — discrete-event simulation for throughput and buffer sizing
- **Visual Components** — 3D simulation of robot cells and lines

### Common misconception
**Misconception:** Takt time and cycle time are the same thing.

**Reality:** Takt comes from demand: how often the customer needs one. Cycle time comes from measurement:
how long a station actually takes. Takt is often confused with cycle time [3], but a healthy line has
every cycle time comfortably below takt.

### Key numbers
- Cheese line takt: 18 s per plate (3600 s / 200 plates)
- Required picks per minute: 3.3 (grape) to 13.3 (apple), from 1 to 4 picks per plate
- ABB IRB 360 catalog cycle: 0.30-0.60 s on 25/305/25 mm and 0.44-0.92 s on 90/400/90 mm, depending on model and payload [4]
- Downtime allowance on takt: about 3-5% as a starting guideline [3]

### Sources
1. [Takt time](https://www.lean.org/lexicon-terms/takt-time/) — Lean Enterprise Institute lexicon; definition, meaning of takt, Toyota review practice
2. [Cycle time](https://www.lean.org/lexicon-terms/cycle-time/) — Lean Enterprise Institute lexicon; cycle time and lead time
3. [Takt time](https://en.wikipedia.org/wiki/Takt_time) — Wikipedia; formula, net available time example, downtime buffer, confusion with cycle time
4. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/a3759d3f3e7141deba89d1caeb1dd4e4/IRB%20360%20FlexPicker_Datasheet_US%20Letter.pdf) — ABB, 2017; standard cycle times by model and payload
5. [Little's law](https://en.wikipedia.org/wiki/Little%27s_law) — Wikipedia; L = λW and its conditions

## Line balancing and bottlenecks
id: line-balancing
requires: cycle-time
aka: bottleneck, constraint, station capacity, balance efficiency, buffer, starved, blocked, theory of constraints

### Plain
Line balancing is dividing the work so every station has about the same amount to do, like splitting
house chores so nobody is stuck with everything while others wait. The station with the most work is the
bottleneck, and it sets the pace for the whole line. Speeding up any other station does not help.

### Where the analogy breaks
Chores can be split any way you like. On a line, some tasks must happen in a fixed order and some cannot
be split (one robot holds one gripper), and random jams mean a station that is fine on average can still
starve or block its neighbors.

### Precise
Line balancing assigns tasks to stations so each station's time fits within takt, while respecting
precedence (task A must finish before task B) and using as few stations as possible. Balance efficiency =
total work content / (number of stations × slowest station time); the remainder is paid-for idle time. A
bottleneck (also called the constraint) is the step whose limited capacity caps the output of the whole
chain; typical signs are the longest queue in front of it and the highest utilization [2].

A station is starved when it is idle waiting for input, and blocked when it is idle because the next
station has no room. Without buffers (small queues between stations), any station stopping stops the
whole line, so if failures are independent the line runs only the fraction of time that every station is
up, roughly the product of their availabilities. The theory of constraints, introduced by Eliyahu
Goldratt in The Goal (1984), says: identify the constraint, exploit it, subordinate everything else to
it, elevate it, then repeat; it places buffers before the constraint so it never starves and after it so
it never blocks [1].

Ways to fix a bottleneck: split its work across two stations or run two in parallel [3], shorten its task
(a better gripper, a shorter move), remove its failures, or protect it with buffers. Improving a station
that is not the bottleneck only adds idle time [2].

### On the cheese plate line
With one robot per ingredient, the work is uneven by design: the apple robot makes four picks per plate,
the grape robot one. With the illustrative times in the code sketch below (apple 3.2 s per pick, cheese
3.0 s, grape 7.0 s, plus 1.5 s to index the belt), the apple station needs 14.3 s per plate against an 18 s
takt and is the bottleneck, and balance efficiency is only about 43%. Every station alone can exceed 200
plates/h, but on an indexing line with no buffers the station availabilities multiply to about 80%, so the
line makes about 202 plates/h, barely on target. If apple picks slow to 4.0 s (slices sticking together),
the line drops to about 165 plates/h; splitting apples between two robots (two slices each) moves the
bottleneck to cheese and lifts the line to about 267 plates/h.

### Elsewhere
At an airport security lane, suppose the bag scanner is the slowest step. Adding more boarding-pass
checkers upstream only makes the queue at the scanner longer. Adding more places for travelers to unpack
bins in parallel does help, because it keeps the scanner from ever waiting: that is a buffer protecting
the constraint, exactly as the theory of constraints recommends [1].

### Why it exists
An unbalanced line pays for robots that sit idle and still misses its output target. Balancing decides
how many stations to buy and what each must do, which is most of a line's cost.

### Connects to
- [[cycle-time]] — takt is the limit every station must fit inside
- [[oee]] — availability losses at the bottleneck are lost output for the whole line
- [[conveyor]] — accumulation buffers decouple stations
- [[cell-design]] — simulation tests a balance before anything is built
- [[scoping]] — the number of stations drives the project cost

### Real products and tools
- **Siemens Tecnomatix Plant Simulation** — discrete-event simulation of lines, buffers, and breakdowns
- **FlexSim and AnyLogic** — simulation tools used to size buffers and find bottlenecks
- **Yamazumi chart** — a stacked bar chart of work per station against a takt line, usually built in a spreadsheet

### Common misconception
**Misconception:** If every station is faster than takt, the line will hit its target.

**Reality:** Stations are coupled. On the cheese plate line every station alone exceeds 200 plates/h, yet
without buffers the multiplied availabilities leave the line at about 202 plates/h, and one slow station
drops it well below target. Balance has to be checked for the coupled line, with failures included.

### Key numbers
- Example balance efficiency: about 43%, rising to about 59% after splitting the apple station (illustrative)
- Example line availability with 8 coupled stations at 93-99.5% each: about 80% (illustrative)

### Code sketch
```python
# Illustrative numbers for the cheese plate line, not measured values.
TAKT_S = 3600 / 200          # 18 s per plate at 200 plates/hour
INDEX_S = 1.5                # time for the indexing belt to move one tray pitch

# (station, units per plate, seconds per unit, availability = fraction of time not stopped)
stations = [
    ("denester",   1, 2.0, 0.98),
    ("grape",      1, 7.0, 0.93),   # soft gripper, vision retries on tangled bunches
    ("apple",      4, 3.2, 0.97),
    ("cracker",    2, 2.5, 0.98),   # worst case: 2 packs
    ("cheese",     3, 3.0, 0.97),
    ("inspection", 1, 1.5, 0.995),
    ("lidding",    1, 4.0, 0.97),
    ("outfeed",    1, 3.0, 0.99),
]

def analyse(stations):
    rows = []
    for name, units, t_unit, avail in stations:
        work = units * t_unit                  # robot or machine busy time per plate
        cycle = work + INDEX_S                 # every station also waits for the index move
        capacity = 3600 / (cycle / avail)      # plates/hour this station could do on its own
        rows.append((name, work, cycle, capacity))

    bottleneck = max(rows, key=lambda r: r[2])           # longest cycle sets the pace
    # Balance efficiency: useful work / (stations x slowest station's work)
    efficiency = sum(r[1] for r in rows) / (len(rows) * max(r[1] for r in rows))

    # Indexing line with no buffers: all trays move together, so the line
    # cycles at the slowest station and stops whenever ANY station stops.
    line_avail = 1.0
    for s in stations:
        line_avail *= s[3]
    line_rate = 3600 / bottleneck[2] * line_avail

    return bottleneck[0], bottleneck[2], efficiency, line_avail, line_rate

print(analyse(stations))
# ('apple', 14.3, 0.43, 0.80, 202)   apple is the bottleneck; line barely makes 200/h

slow = [(n, u, 4.0 if n == "apple" else t, a) for n, u, t, a in stations]
print(analyse(slow))
# ('apple', 17.5, 0.37, 0.80, 165)   apple alone still fits takt, the coupled line does not

split = []
for n, u, t, a in slow:
    if n == "apple":                       # two robots, two slices each
        split += [("apple-A", 2, t, a), ("apple-B", 2, t, a)]
    else:
        split.append((n, u, t, a))
print(analyse(split))
# ('cheese', 10.5, 0.59, 0.78, 267)  bottleneck moves to cheese; one more robot lowers availability
```

### Sources
1. [Theory of constraints](https://en.wikipedia.org/wiki/Theory_of_constraints) — Wikipedia; Goldratt, The Goal (1984), five focusing steps, buffers around the constraint
2. [Bottleneck (production)](https://en.wikipedia.org/wiki/Bottleneck_%28production%29) — Wikipedia; definition and ways to identify a bottleneck
3. [Takt time](https://en.wikipedia.org/wiki/Takt_time) — Wikipedia; stations that cannot meet takt and splitting tasks between stations

## OEE
id: oee
requires: cycle-time
aka: overall equipment effectiveness, availability, performance, quality, TEEP, TPM

### Plain
OEE is one score for how much of a line's planned time turned into good product, like a batting average
for a machine. It multiplies three things: how much of the time the line was running, how fast it ran
compared with its best speed, and how much of what it made was good. A perfect score is 100%, and real
lines are far below it.

### Where the analogy breaks
Batting averages follow shared rules, so players can be compared. OEE depends on choices each plant
makes, such as whether cleaning counts as planned time and what "best speed" is, so two plants' OEE
numbers are often not comparable.

### Precise
OEE = Availability × Performance × Quality [1]. Availability = run time / planned production time, where
planned time excludes scheduled breaks [1]. Performance = (ideal cycle time × total count) / run time,
where ideal cycle time is the fastest the process can achieve in optimal conditions; it should never
exceed 100% [1]. Quality = good count / total count [1]. Multiplied out, OEE = good count × ideal cycle
time / planned production time, the same number, but the three-factor form shows which loss to attack
[1]. TEEP (total effective equipment performance) measures against all calendar hours instead of planned
hours [3].

OEE comes from Seiichi Nakajima's work on total productive maintenance (TPM) in Japan. Wikipedia dates the
term to his 1982 book TPM Tenkai [3], while oee.com attributes the "world-class" figures to his 1984 book
Introduction to TPM (English edition 1988) [2]. Those figures are 90% availability, 95% performance, and
99% quality, which multiply to about 84.6%, rounded to the famous 85% [2]. Per oee.com, Nakajima set them
from practical experience as minimums and noted that Japanese TPM prize-winning plants exceeded 85%; the
figures come from a particular place, time, and industry (Japan, the 1970s, automotive) [2]. I could not
open the book itself, so I cannot confirm his exact wording. ISO 22400-2:2014 gives formal KPI
definitions that include OEE, though Wikipedia notes its two versions are not fully consistent [3].

What goes wrong: OEE is easy to game, by setting the ideal cycle time slow or by reclassifying stops as
planned. It is most useful measured at the bottleneck, because time lost there is output lost for the
whole line [4].

### On the cheese plate line
One 8-hour shift with 60 minutes of breaks and sanitation counted as planned leaves 420 minutes of
planned time. Jams and gripper faults stop the line for 42 minutes, so run time is 378 minutes and
availability is 90.0%. The ideal cycle is 15 s per plate (240 plates/h, the fastest the line can run), and
the line made 1,380 plates: performance = 15 × 1,380 / (378 × 60) = 91.3%. Inspection rejected 41, so
quality = 1,339 / 1,380 = 97.0%. OEE = 0.900 × 0.913 × 0.970 = 79.7%, matching 1,339 × 15 s / 25,200 s.
Two traps: using the 18 s takt as the ideal cycle would push performance above 100%, a sign the baseline
is wrong [1]; and counting 30 minutes of that washdown as unplanned stop time instead would drop OEE to
about 74.4% with no change on the floor.

### Elsewhere
oee.com's worked example is a machine with a 1.0 s ideal cycle, such as a small press or bottle capper:
a 480-minute shift, 60 minutes of breaks, 47 minutes of downtime, 19,271 parts made and 423 rejected,
giving 88.8% availability, 86.1% performance, 97.8% quality, and 74.8% OEE [1]. The same arithmetic
applies to a car body press or a bottling line; what changes is which losses dominate.

### Why it exists
Managers need one number to compare shifts and track improvement, and engineers need to know which kind
of loss to attack. OEE gives both: the headline score and the three factors behind it.

### Connects to
- [[cycle-time]] — ideal cycle time is the performance baseline
- [[line-balancing]] — OEE matters most at the bottleneck
- [[inspection]] — supplies the good and total counts for quality
- [[hmi]] — where OEE and loss reasons are shown to operators
- [[telemetry-logs]] — machine state logs are the raw data for availability

### Real products and tools
- **Vorne XL** — a line-side OEE display and data collection device
- **Evocon** — cloud OEE monitoring for production lines
- **Sepasoft OEE module for Ignition** — OEE and downtime tracking on the Ignition platform
- **ISO 22400-2:2014** — the standard's KPI definitions, including OEE [3]

### Common misconception
**Misconception:** 85% OEE is the world-class standard every line should hit.

**Reality:** The figure traces to Nakajima's experience-based minimums for Japanese TPM plants, mostly
automotive [2]. oee.com says most manufacturers are closer to 60%, and that scores below 45% are more
common than scores above 85% [2]; definitions also differ between plants. Compare a line against its own
baseline, measured the same way each time.

### Key numbers
- "World class": 90% × 95% × 99% ≈ 84.6%, quoted as 85% [2]
- 90% on all three factors gives only about 73% OEE [2]
- Typical manufacturers: closer to 60% [2]
- Worked example: 74.8% [1]; cheese plate example: 79.7% (illustrative)

### Sources
1. [Calculating OEE](https://oee.com/calculating-oee) — oee.com; formulas, definitions, worked example
2. [World-class OEE](https://oee.com/world-class-oee) — oee.com; origin of the 85% figure, typical scores
3. [Overall equipment effectiveness](https://en.wikipedia.org/wiki/Overall_equipment_effectiveness) — Wikipedia; Nakajima 1982, TEEP, ISO 22400-2:2014, caution on the 85% target
4. [Theory of constraints](https://en.wikipedia.org/wiki/Theory_of_constraints) — Wikipedia; output of a system is limited by its constraint

## IP ratings and washdown
id: ip-rating
requires: none
aka: IP code, ingress protection, IEC 60529, IP67, IP69K, IPX9, washdown

### Plain
An IP rating is a two-digit code that says how well a device keeps out dust and water, like the water
resistance mark on a watch. The first digit is for dust and dirt, the second for water. A higher water
number is not always "better": each number is a different test, such as being dunked or being hit by a
hot pressure washer.

### Where the analogy breaks
A watch rating is one scale of depth. IP water digits above 6 are separate tests that do not include each
other, so a device dunked for 30 minutes has not been proven against jets, and no IP test checks the
cleaning chemicals a food plant uses every day.

### Precise
The IP code (ingress protection, defined in IEC 60529) has a first digit for solids, 0-6, and a second for
water, 0-9 [1][2]. First digit 5 means dust-protected (some dust may enter, not enough to interfere); 6
means dust-tight, tested under vacuum for up to 8 hours [1]. The water digits that matter for washdown:
5 is jets of 12.5 L/min at 30 kPa from 3 m; 6 is jets of 100 L/min at 100 kPa from 3 m (both for at least
3 minutes); 7 is immersion for 30 minutes with the lowest point 1 m down; 8 is deeper or longer immersion
as agreed by the manufacturer; 9 is close-range high-pressure hot water: 80 °C, 8-10 MPa (80-100 bar),
14-16 L/min, from 0.10-0.15 m, at 0, 30, 60, and 90 degrees for 30 s each on a turntable [1]. IPX9 was
added to IEC 60529 by Amendment 2 in 2013 [3].

IP69K comes from the road-vehicle world: first German DIN 40050-9, now ISO 20653, which defines the "K"
tests; its water jet test is the same as IPX9 [1]. Ratings above X6 are not cumulative: an IPX7 device is
not necessarily IPX5 or IPX6 compliant, so a device that passes several tests is marked with all of them,
for example IP66/IP67/IP69K [1].

Washdown needs more than any IP digit. Daily sanitation combines jets, foamed detergents (often alkaline
or chlorinated), sanitizers, and hot water on cold equipment, repeated for years [unverified: typical
practice, no source opened]. IP tests use clean water on a new device, so they say nothing about chemical
resistance, seal aging, or corrosion, and a warm sealed housing cooled suddenly by water can draw moisture
past its seals as the air inside contracts [unverified: no source opened]. Food plants therefore ask for
the jet ratings on anything sprayed directly, plus resistant materials and a hygienic shape.

### On the cheese plate line
The running example specifies IP67 washdown equipment. IP67 alone proves dust-tightness and 30 minutes
at 1 m, not survival of an 80 bar, 80 °C jet from 10 cm [1]. For robots, grippers, conveyors, and sensors
in the food zone, the useful specification is IP69K (or IPX9) plus IP67, with confirmed resistance to the
plant's cleaning chemicals. ABB, for example, offers a stainless IRB 360 delta that is IP69K validated for
washdown with industrial detergents and high-pressure hot water [4]. Equipment marketed as IP67-rated,
such as the QUPAQ denesters [5], should be cleaned the way the vendor allows rather than blasted.

### Elsewhere
A smartphone marked IP68 has passed an immersion test whose depth and duration the manufacturer chooses,
generally up to about 3 m [1], which says nothing about pressure washing. Truck and construction-vehicle
parts are the natural home of IP69K instead: the K tests were developed for road vehicles, first in DIN
40050-9 and now in ISO 20653 "Road vehicles — Degrees of protection" [1], because vehicles get cleaned
with high-pressure washers.

### Why it exists
Buyers and makers need a shared, testable vocabulary for "sealed". The IP code turns vague claims like
"waterproof" into specific tests a lab can run.

### Connects to
- [[hygienic-design]] — sealing is necessary for washdown but not sufficient for hygiene
- [[servo-motor]] — motors and their cable entries are the usual leak points on a robot
- [[camera-2d]] — cameras in the washdown zone need sealed housings
- [[guarding]] — light curtains and door switches in washdown areas need ratings too
- [[cobot]] — few cobots are offered in washdown-rated versions, which limits them in food

### Real products and tools
- **ABB IRB 360 stainless variant** — delta robot IP69K validated for high-pressure hot washdown [4]
- **Stäubli Stericlean and HE robots** — arms built for wet and hygienic environments
- **ifm and SICK washdown sensors** — photo-eyes and proximity sensors offered with IP69K housings
- **IEC 60529 and ISO 20653** — the test standards behind the IP code and the K tests [1]

### Common misconception
**Misconception:** IP69K is the highest rating, so it covers everything below it.

**Reality:** IP69K proves resistance to hot high-pressure jets; it does not prove the device survives
immersion, which is the IPX7 or IPX8 test [1]. Each water digit above 6 is its own test, so check that all
the needed ratings are listed.

### Key numbers
- IPX9 and IP69K water test: 80 °C, 8-10 MPa, 14-16 L/min, nozzle 0.10-0.15 m away [1][2]
- IPX7: 30 minutes, lowest point 1 m below the surface [1]
- IP6X dust test: under vacuum for up to 8 hours, depending on airflow [1]
- IPX5 versus IPX6: 12.5 L/min at 30 kPa versus 100 L/min at 100 kPa, both from 3 m [1]

### Sources
1. [IP code](https://en.wikipedia.org/wiki/IP_code) — Wikipedia; digit definitions, test conditions, IP69K and ISO 20653, non-cumulative rule
2. [IP code](https://www.digikey.com/en/blog/ip-code) — DigiKey; summary of digits including the 9K test parameters
3. [NF EN 60529/A2](https://www.boutique.afnor.org/en-gb/standard/nf-en-60529-a2/degrees-of-protection-provided-by-enclosures-ip-code/fa181031/1434) — AFNOR; Amendment 2 adds IPX9
4. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/a3759d3f3e7141deba89d1caeb1dd4e4/IRB%20360%20FlexPicker_Datasheet_US%20Letter.pdf) — ABB, 2017; stainless variant IP69K validated, washdown with detergents and hot high-pressure water
5. [QUPAQ tray denesting range](https://www.sealpac-uk.com/qupaq-tray-denesting-range) — Sealpac UK; denesters described as IP67-rated

## Hygienic and food-safe design
id: hygienic-design
requires: ip-rating
aka: sanitary design, food-safe design, washdown design, EHEDG, 3-A, food contact

### Plain
Hygienic design means building machines so food scraps and germs have nowhere to hide and cleaning
reaches every surface, like a kitchen with smooth, rounded countertops instead of cracked tiles. A machine
can look spotless and still harbor bacteria in a gap or a screw thread. In a food plant, a machine that
cannot be cleaned cannot be used.

### Where the analogy breaks
A home kitchen is cleaned by someone who can see and scrub every corner. A production machine is cleaned
on a schedule by a crew with hoses and foam, so anything they cannot see or reach is never cleaned, and
the test of success is a lab swab, not the eye.

### Precise
Hygienic design shapes equipment so it can be cleaned to a microbiologically safe state quickly and
repeatably. Core principles [2]: smooth food-contact surfaces (3-A and EHEDG specify a maximum roughness
Ra, the average height of the surface's microscopic bumps, of 0.8 µm; cold-rolled stainless steel is
typically 0.2-0.5 µm); no crevices or dead areas where residue collects; no metal-to-metal joints; smooth,
continuous welds; surfaces and pipes that slope so they drain; and materials that do not react with food
or cleaning chemicals. EHEDG Guideline 8, Hygienic Design Principles, now in its fourth edition (December
2025), applies a risk-based approach to both equipment and the factory and is the basis for EHEDG
equipment certification [1].

The rules are strict because Listeria monocytogenes, unlike most bacteria, can grow at refrigeration
temperatures [3], so a cold room slows it but does not stop it, and it can settle into hard-to-clean spots
and keep recontaminating product. Equipment is commonly divided into a food zone (touches product), a
splash zone (product may splash on it and run back), and a non-food zone, with the strictest rules in the
food zone; the European machinery standard EN 1672-2 is organized around this split [unverified:
standard text not opened]. In the US, the 3-A Sanitary Standards set comparable rules, including the same
0.8 µm surface limit [2].

For robots this means stainless or sealed housings, no exposed fasteners or cable runs over open food,
lubricants that are food-safe or sealed away, and end effectors that come off without tools. ABB's
stainless IRB 360 variant, for example, has smooth rinse-off surfaces and lubricant-free joints [4].
Belts and plastic parts can be made metal- or X-ray-detectable so a broken fragment is caught at
inspection [5].

### On the cheese plate line
Every surface over the open trays is in the food or splash zone: the delta robots' arms, the grippers
touching apple slices and cheese wedges, and the belts. The room runs at 2-4 C, which slows Listeria but
does not stop it [3], so the daily washdown matters more than the temperature. Practical choices:
grippers on quick-release mounts that go to a parts washer; vacuum paths that can be flushed, since apple
juice and cheese crumbs get drawn into suction hoses [unverified: design concern, no source opened];
open-frame stainless conveyors whose belts lift off; no flat ledges where water pools; and detectable
plastic for any part that could chip [5].

### Elsewhere
In a dairy or brewery, pipes and tanks are cleaned in place (CIP: cleaning liquid is pumped through the
closed system without taking it apart). That only works if every line drains and there are no dead areas
outside the main flow of cleaning liquid, because those areas are harder to clean [2]: the same rules,
applied to plumbing.

### Why it exists
Contaminated food makes people sick and triggers recalls that can cost more than the line. Cleaning
cannot fix a design that hides dirt, so hygiene has to be built in.

### Connects to
- [[ip-rating]] — sealing keeps water out; hygienic design keeps dirt from hiding outside
- [[conveyor]] — belts and frames are the largest food-zone surfaces
- [[vacuum-gripper]] — suction paths can pull food residue inside
- [[soft-gripper]] — soft materials must survive cleaning chemicals and stay food-safe
- [[inspection]] — detectable materials let inspection catch broken fragments

### Real products and tools
- **EHEDG guidelines and certification** — European hygienic design guidance and equipment certification [1]
- **3-A Sanitary Standards** — US sanitary design standards, cited alongside EHEDG for food-contact surfaces [2]
- **ABB IRB 360 stainless variant** — washdown delta robot with lubricant-free joints [4]
- **Intralox FoodSafe** — hygienic belting with metal- or X-ray-detectable options [5]

### Common misconception
**Misconception:** A stainless steel machine is automatically hygienic.

**Reality:** Shape matters as much as material. A stainless frame of open-ended square tubes, bolted
metal-to-metal joints, and flat ledges traps water and food soil, while the principles above (no
crevices, no dead areas, drainable surfaces) decide whether it can be cleaned [2].

### Key numbers
- Food-contact surface roughness: Ra at most 0.8 µm per 3-A and EHEDG [2]
- Cold-rolled stainless steel: typically Ra 0.2-0.5 µm [2]
- EHEDG Guideline 8: fourth edition, December 2025 [1]

### Sources
1. [GL 8 Hygienic design principles](https://ehedg.org/guidelines-working-groups/guidelines/guidelines/detail/hygienic-design-principles) — EHEDG; fourth edition (December 2025), scope, link to certification
2. [Hygienic design of equipment in food processing](https://www.food-safety.com/articles/4350-hygienic-design-of-equipment-in-food-processing) — Food Safety Magazine, Roy Curiel (Unilever), 2003; principles and the Ra 0.8 µm figure
3. [Listeria (Listeriosis)](https://www.fda.gov/food/foodborne-pathogens/listeria-listeriosis) — US FDA; growth at refrigeration temperatures
4. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/a3759d3f3e7141deba89d1caeb1dd4e4/IRB%20360%20FlexPicker_Datasheet_US%20Letter.pdf) — ABB, 2017; stainless variant with rinse-off surfaces and lubricant-free joints
5. [Intralox FoodSafe](https://www.intralox.com/solutions/foodsafe) — Intralox; detectable belt materials, hygienic belting

## The main safety standards
id: safety-standards
requires: guarding
aka: ISO 10218, ANSI/A3 R15.06, ISO/TS 15066, ISO 13849-1, IEC 62061, ISO 12100, functional safety, CE marking

### Plain
Safety standards are the shared rulebook for building machines that do not hurt people, like a building
code for builders and electricians. One standard says how to find and rank hazards, others say how to
build guards, stop buttons, and safety electronics, and a robot standard pulls them together. They are
written by expert committees and become close to mandatory because laws point to them.

### Where the analogy breaks
A building code is usually law in its own right. Most machine safety standards are voluntary on paper and
gain force indirectly, for example through EU law, which presumes a machine is compliant if it follows
the standards listed as harmonised [14].

### Precise
ISO 12100 is the basic standard (type A): it sets the method for identifying hazards, estimating and
evaluating risk, and reducing it, and it is the basis for type-B standards (one safety aspect for any
machine, such as guard distances or emergency stops) and type-C standards (one machine type) [8]. For
industrial robots the type-C standard is ISO 10218: part 1 covers the robot itself, treated as partly
completed machinery, and part 2 covers integrating it into applications and cells [1][2].

Safety functions (for example, "stop the robot when the door opens") are built from safety-rated sensors,
logic, and actuators. ISO 13849-1 rates them by performance level, PL a to e (how unlikely a dangerous
failure is), for any technology [6]; IEC 62061 does the same job for electrical and programmable systems
using safety integrity levels (SIL) [7]. The 2025 robot standards replaced a blanket PL d requirement with
a PL chosen per safety function from a risk evaluation, defined two robot classes, added cybersecurity
where it affects safety, and absorbed the collaborative robot content of ISO/TS 15066, including the body
force and pressure limits [3][4].

Current editions as of November 2026:

| Standard | Current edition | What it covers |
|---|---|---|
| ISO 10218-1 | 2025 (3rd edition, February 2025) | The industrial robot: inherently safe design, protective measures, information for use [1] |
| ISO 10218-2 | 2025 (2nd edition, February 2025) | Robot applications and cells: integration, commissioning, operation, maintenance [2] |
| ISO/TS 15066 | 2016 | Collaborative applications; content now folded into ISO 10218-1/-2:2025, though catalogues still list the TS as valid [3][12] |
| ANSI/A3 R15.06 | 2025 | US adoption of ISO 10218 parts 1 and 2, replacing R15.06-2012; Part 3, for users of robot cells, released January 2026 [4][5] |
| ISO 12100 | 2010, confirmed 2022 | Risk assessment and risk reduction for all machinery; a revision (ISO/DIS 12100) is in development [8] |
| ISO 13849-1 | 2023 (4th edition) | Design of safety-related parts of control systems, performance levels [6] |
| IEC 62061 | 2021 plus Amendment 1:2024 | Functional safety of safety-related control systems for machinery [7] |
| ISO 13855 | 2024 (3rd edition, November 2024) | Positioning safeguards relative to the approach of the human body [9] |
| ISO 13850 | 2015 | Design principles for the emergency stop function [10] |
| IEC 60204-1 | 2016 plus Amendment 1:2021 (edition 6.1) | Electrical equipment of machines, including stop and emergency stop circuits [11] |
| ISO 14119 | 2024 | Interlocking devices on guards [15] |

In the EU, the Machinery Regulation (EU) 2023/1230 replaces the Machinery Directive 2006/42/EC and applies
from 20 January 2027 [13]. EN ISO 10218-1 and -2:2025 were listed in the EU Official Journal as harmonised
standards on 7 September 2026 [14].

### On the cheese plate line
The integrator builds each robot cell to ISO 10218-2:2025, or ANSI/A3 R15.06-2025 in the US. A documented
risk assessment following ISO 12100 lists hazards such as "operator reaches into the cheese station to
clear a dropped wedge" [8]. Door interlocks follow ISO 14119 [15], an outfeed light curtain is positioned
per ISO 13855 [9], each safety function is designed to the PL the risk assessment demands per ISO 13849-1
[6], and the emergency stop buttons follow ISO 13850 and IEC 60204-1 [10][11]. None of these say anything
about food hygiene; that comes from separate guidelines (see [[hygienic-design]]). If a cobot works beside
the outfeed operator, its contact force limits now come from ISO 10218-2:2025 rather than the standalone
TS [3].

### Elsewhere
A car plant extending a welding line built under the 2011 edition cannot simply copy the old design. SICK
advises treating ISO 10218-2:2025 as the state of the art when modifying or extending older systems, and
notes that significant changes may require a new CE conformity assessment once the EU Machinery Regulation
applies in January 2027 [3].

### Why it exists
Robot makers, integrators, and plants need one shared definition of "safe enough" so responsibility is
clear at each handoff. In the EU, following harmonised standards is also the practical route to legal
compliance [14].

### Connects to
- [[guarding]] — ISO 13855 and ISO 14119 govern guard distances and interlocks
- [[safety-circuit]] — ISO 13849-1 and IEC 62061 rate the safety circuits
- [[estop]] — ISO 13850 and IEC 60204-1 define how emergency stops work
- [[cobot]] — collaborative force and pressure limits now live in ISO 10218-2:2025
- [[acceptance-tests]] — safety functions are validated before the line is handed over

### Real products and tools
- **SISTEMA** — free software from the German IFA for calculating ISO 13849-1 performance levels
- **Pilz PNOZmulti and Siemens SIMATIC S7-1500F** — safety controllers that implement rated safety functions
- **A3 Standards Store** — sells ANSI/A3 R15.06-2025 in the US [4]
- **ISO and IEC webstores** — publish the standards listed above [1][11]

### Common misconception
**Misconception:** If the robot complies with ISO 10218, the robot cell is safe and legal.

**Reality:** ISO 10218-1 covers only the robot, as partly completed machinery [1]. The integrator must
assess and safeguard the whole cell (ISO 10218-2, ISO 12100), and since 2026 the US standard has a separate
part for the user's duties [5]. A compliant robot inside a badly designed cell is still dangerous.

### Key numbers
- ISO 10218-1 and -2 published 5 February 2025, replacing the 2011 editions [1][2]
- ANSI/A3 R15.06-2025 Parts 1 and 2 published September 2025; Part 3 released January 2026 [4][5]
- EU Machinery Regulation applies from 20 January 2027 [13]
- Performance levels PL a to e (ISO 13849-1) [6]

### Sources
1. [ISO 10218-1:2025](https://committee.iso.org/standard/73933.html) — ISO; edition, publication date, scope, replaced 2011 edition
2. [ISO 10218-2:2025](https://committee.iso.org/standard/73934.html) — ISO; edition, publication date, scope, replaced 2011 edition
3. [More safety for humans and machines](https://www.sick.com/br/en/more-safety-for-humans-and-machines/w/blog-robotic-norm-iso10218) — SICK; ISO/TS 15066 incorporated, robot classes, per-function PL, retrofit advice
4. [Updated ANSI/A3 standards address industrial robot safety](https://www.therobotreport.com/updated-ansi-a3-standards-address-industrial-robot-safety/) — The Robot Report, September 2025; R15.06-2025 parts, consolidation of TS 15066, monitored standstill
5. [ANSI/A3 releases Part 3 of R15.06-2025](https://www.plantautomation-technology.com/index.php/news/ansi-a3-releases-part-3-of-r15.06-2025-standard-focusing-on-industrial-robot-operational-safety-in-u.s.-factories) — Plant Automation Technology, January 2026; Part 3 for users
6. [ISO 13849-1:2023](https://committee.iso.org/es/sites/isoorg/contents/data/standard/07/34/73481.html) — ISO; fourth edition, scope, replaced 2015 edition
7. [IEC 62061:2021/AMD1:2024](https://www.evs.ee/en/iec-62061-2021-amd1-2024) — Estonian Centre for Standardisation; amendment valid from March 2024
8. [ISO 12100:2010](https://committee.iso.org/standard/51528.html) — ISO; scope, confirmed 2022, revision under development
9. [ISO 13855:2024](https://committee.iso.org/standard/80590.html) — ISO; third edition, scope
10. [ISO 13850:2015](https://www.evs.ee/en/iso-13850-2015) — Estonian Centre for Standardisation; emergency stop scope, valid edition
11. [IEC 60204-1:2016+AMD1:2021 CSV](https://webstore.iec.ch/en/publication/71256) — IEC; edition 6.1, scope
12. [ISO/TS 15066:2016](https://www.evs.ee/en/iso-ts-15066-2016) — Estonian Centre for Standardisation; TS still listed as valid
13. [Regulation (EU) 2023/1230 on machinery](https://osha.europa.eu/en/legislation/directive/regulation-20231230eu-machinery) — EU-OSHA; applies from 20 January 2027, replaces Directive 2006/42/EC
14. [New standards for industrial robots: EN ISO 10218-1 and -2](https://www.ibf-solutions.com/en/seminars-and-news/news/new-standards-for-industrial-robots-en-iso-10218-1-and-2) — IBF Solutions; harmonised listing in the Official Journal on 7 September 2026
15. [ISO 14119:2024](https://online.standard.no/en/iso-14119-2024) — Standards Norway catalogue; interlocking devices, published September 2024
