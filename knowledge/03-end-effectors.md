---
area: 3
slug: end-effectors
title: End effectors
---

# End effectors

A robot arm on its own can only carry its wrist to a point in space. The part that actually
touches the product is the end effector bolted to that wrist. This area covers how that tool
is described to the robot (the tool center point), the three main ways to hold things (vacuum,
soft fingers, rigid fingers), the tool changer that lets one arm swap tools, and the
force-torque sensor that gives the wrist a sense of touch.

On the cheese plate line, each of the four pick stations needs a different end effector,
because each ingredient fails in its own way. A grape bunch rolls and sheds berries. Apple
slices are wet. Cracker packs are floppy film. Cheese is fatty and dents. Everything that
touches unwrapped food must be made of food-contact material and must survive washdown in a
36-40 F (2-4 C) room.

## End effector and tool center point
id: end-effector
requires: dof, frames
aka: end-of-arm tooling, EOAT, gripper, tool center point, TCP, tool flange

### Plain
An end effector is the hand of a robot: the arm works like your arm and shoulder, and the end effector is whatever is on the end of it, like a pair of kitchen tongs you are holding. The arm on its own only knows how to bring its wrist to a spot. The tool center point tells the robot where the useful tip of the tongs is, so it can aim the tip instead of the wrist.

### Where the analogy breaks
You feel where the tips of your tongs are without thinking; a robot only knows what it was told. If the tool center point is typed in 5 mm wrong, the robot will miss by 5 mm on every move, confidently and without noticing.

### Precise
The end effector (also called end-of-arm tooling, EOAT) is everything mounted after the arm's
last joint: the gripper or tool, plus adapter plates, sensors, hoses, and cables. It bolts to
the tool flange (the flat round plate on the last joint), whose hole pattern on most
industrial arms follows ISO 9409-1 [unverified: standard named from memory; I did not open the
ISO document]. Many arms also have a small electrical connector at the wrist. Universal Robots
arms, for example, provide an M8 tool connector with up to 48 W peak power, 2 digital inputs,
2 digital outputs, and 2 analog inputs [1].

The tool center point (TCP) is the point on the tool that the robot moves and reports
positions for, such as the middle of a suction cup face or the spot between two fingertips.
It is stored as an offset from the flange: a translation (how far along X, Y, and Z) and a
rotation (which way the tool points) [1]. In other words, it is one more coordinate frame (a
set of X, Y, Z axes attached to something) on the chain from the robot base to the tool tip;
see [[frames]]. Straight-line moves are executed for the TCP, so a wrong TCP makes them drift
or swing in unexpected ways [1].

The end effector also sets the payload (the mass the arm carries beyond itself): the tool's
mass, plus the workpiece, plus where their combined center of gravity sits [1]. Universal
Robots documents that a wrong payload setting can cause poor hand-guiding and unexpected
protective stops (automatic safety halts) [1]. Only one payload and center of gravity is
active at a time, so a program must update it each time the robot picks up or drops a part
[2].

### On the cheese plate line
At the apple pick station, the end effector is a stainless bracket carrying one bellows suction cup, a vacuum hose, and a vacuum switch. Its TCP is set at the center of the cup lip, about 120 mm out from the flange (illustrative). If that number is entered 5 mm short, the robot "places" every apple slice 5 mm above the tray and lets go, so slices land scattered. The tool's mass plus one slice goes into the payload setting, and every surface below the flange that can touch apple must meet the line's food-contact and washdown rules; see [[hygienic-design]].

### Elsewhere
A cobot stacking 1 kg cardboard boxes (the example Universal Robots itself uses [1]) onto a pallet at the end of a packing line carries a vacuum pad, with the TCP on the pad face. Its payload changes from "tool only" to "tool plus box" at every pick and back at every drop, and Universal Robots programs handle this with a payload command (set_target_payload, which replaces the older set_payload functions) at each step [2]. Skipping that update leaves the controller with the wrong mass, which can cause unexpected protective stops [1].

### Why it exists
Robot arms are sold as general-purpose motion machines without hands, because no single hand suits every product. Separating arm from tool lets the same arm weld, pick, or drive screws, and the TCP is the link that lets the arm's software aim the tool rather than the wrist.

### Connects to
- [[frames]] — the TCP is one more frame on the chain from robot base to tool tip.
- [[payload]] — the end effector's mass comes out of the arm's rated payload before any product is lifted.
- [[vacuum-gripper]] — the most common end effector for packaged and smooth items.
- [[tool-changer]] — lets one arm swap end effectors, and shifts the TCP outward.
- [[hygienic-design]] — food-contact rules apply to everything below the flange.

### Real products and tools
- **Universal Robots tool connector and TCP setup** — M8 wrist connector with up to 48 W, with TCP, payload, and center of gravity entered on the teach pendant [1].
- **URScript set_target_payload()** — the current command for changing payload mid-program; set_payload_mass() and set_payload() are deprecated [2].
- **OnRobot RG2** — a gripper that calculates and sends its own TCP and payload to the robot as its fingers move [3].

### Common misconception
**Misconception:** The robot knows where its tool is, because it knows where all its joints are.

**Reality:** Joint sensors tell the robot where its flange is. Where the useful point of the tool sits, and how heavy the tool is, are numbers a person (or a smart gripper) enters. Errors in them are invisible to the robot until parts are dropped, crushed, or missed.

### Key numbers
- UR tool connector: up to 48 W peak, 2 digital inputs, 2 digital outputs, 2 analog inputs [1]
- TCP definition: 6 numbers, 3 translations plus 3 rotations [1]
- Payload inertia: 6 more numbers (Ixx, Iyy, Izz, Ixy, Ixz, Iyz) when a tool's mass is spread out [1]

### Sources
1. [Integrating end-of-arm tools](https://universal-robots.com/developer/integrating-end-of-arm-tools) — Universal Robots developer docs (Fuglsang and Rytter); TCP definition, tool connector, payload and center of gravity, effects of a wrong payload, 1 kg box example
2. [Setting payload and center of gravity when using multiple TCPs](https://www.universal-robots.com/articles/ur/programming/setting-payload-and-center-of-gravity-when-using-multiple-tcps/) — Universal Robots support article; one global payload, updating payload in programs, deprecated functions
3. [RG2 gripper](https://onrobot.com/en/products/rg2-gripper) — OnRobot product page; automatic TCP and payload calculation

## Vacuum gripper
id: vacuum-gripper
requires: end-effector
aka: suction gripper, suction cup, vacuum cup, vacuum generator, venturi ejector, vacuum pump

### Plain
A vacuum gripper holds things the way you can lift a scrap of paper by sucking on a drinking straw. A soft cup presses on the item, air is pulled out from inside the cup, and the air around the item pushes it firmly onto the cup. Let air back in and the item drops.

### Where the analogy breaks
Sucking feels like pulling, but nothing pulls: the room's air pressure pushes, so the grip can never exceed atmospheric pressure (about 101 kPa at sea level) times the cup's area, however strong the pump. And unlike your mouth, a robot cannot feel a leak, so it needs a vacuum sensor to know it is holding anything at all.

### Precise
A vacuum gripper has three parts: a vacuum generator (the device that removes air), suction
cups (soft rubber or silicone lips that seal against the part), and valves plus a vacuum
switch (a pressure sensor that reports "part held"). Vacuum level is how far below
atmospheric pressure the cup gets. It is written as a pressure (kPa or mbar below
atmosphere) or as a percentage of a perfect vacuum, and vendors use the percentage mainly to
compare generators [1]. As rough arithmetic, 60% vacuum is about -60 kPa.

Theoretical holding force is pressure difference times effective cup area, F = Δp × A [2].
Engineers then add a safety factor (deliberate extra margin). Schmalz recommends at least 2,
notes 1.5 as the German accident-prevention minimum, and 2.5 or more if the part is swung or
flipped [2]. Robotiq suggests 1.5 for smooth parts, 2 for porous or oily ones, and up to 4
when the cup face is vertical, because then only friction holds the part [3]. Friction (how
much two surfaces resist sliding) changes a lot with moisture: about 0.5 on dry plastic or
metal, but 0.2-0.4 on wet surfaces [2].

Generators come in two families. A venturi ejector blows compressed air through a narrow
nozzle; the fast jet drags air out of the vacuum port, with no moving parts, low weight, and
fast response [4]. Many have an air-saving mode that stops blowing once vacuum is high enough
and restarts if it leaks down [4]. The cost is energy, since compressed air is expensive to
make: Schmalz claims its electric generators can save up to 95% of the energy of ejectors,
depending on cycle frequency, load profile, and operating time [5]. Electric pumps (small
motor-driven pumps) need only 24 V power, which suits mobile robots and cells without plant
air, but the cobot-sized ones move less air and reach shallower vacuum: 46 l/min and 80% for
Schmalz's GCPi, 12 l/min and 75% for its ECBPi [5]. Robotiq quotes about 85% for its
compressed-air gripper and about 80% for its electric one [3].

Cups come in two basic shapes [2]. Flat cups are stable and evacuate fast, for flat or gently
curved parts. Bellows cups have accordion folds (1.5 to 4.5 folds) that let them tilt onto
uneven surfaces; the 4.5-fold version is aimed at flexible packaging [2]. Nitrile is cheap
and general, polyurethane resists oil, and silicone handles heat and cold and is approved for
food contact [3]. When the seal is poor, flow (litres of air per minute the generator can
move) becomes the limit, so porous parts need a high-flow generator or several small cups
[3].

### On the cheese plate line
The cracker station picks a wrapped cracker pack with a bellows cup, whose folds follow the wrinkled film. Force is not the problem: a 20 mm cup at -60 kPa gives about 19 N in theory (my arithmetic from F = Δp × A [2]), while a pack weighs far less than 1 N (about 100 g). The apple station is harder. The slices are wet, so friction falls to about 0.2-0.4 [2], juice can be sucked into the vacuum line (Piab fits filters on some food cups to stop clogging [6]), and the curved skin seals poorly, so the cup should land on the flat cut face. Cups touching unwrapped apple should be food-contact silicone, such as Piab cups certified to US FDA 21 CFR 177.2600 and EU regulation 1935/2004, often in a metal-detectable grade with a little iron mixed in so a torn piece is caught by the metal detector [6].

### Elsewhere
Schmalz describes a Bizerba cell where two cobots with electric GCPi pumps pick foil-wrapped meat packages at up to 96 picks per minute, with no compressed air at the cell [5]. In a warehouse, corrugated cardboard is porous, so air leaks through the box wall; Robotiq's advice is several small cups rather than a few large ones, or a high-flow generator, instead of chasing a deeper vacuum [3].

### Why it exists
Most manufactured and packaged items have at least one smooth face, and vacuum can grab that face from above without needing room for fingers at the sides. It is simple, light, fast, and cheap, which makes it the default for boxes, sheets, bags, and trays.

### Connects to
- [[pneumatic-actuation]] — ejectors run on the same plant compressed air as pneumatic cylinders.
- [[soft-gripper]] — the alternative when an item has no surface that seals.
- [[hygienic-design]] — food-contact materials and cleanable cup designs.
- [[cycle-time]] — building vacuum and releasing the part adds time to every pick.
- [[payload]] — generators, valves, and manifolds on the wrist add to tool mass.

### Real products and tools
- **Schmalz compact ejectors** — venturi ejectors with built-in valves and air-saving control [4].
- **Schmalz GCPi and ECBPi** — 24 V electric vacuum generators for cobots; 46 l/min at up to 80% and 12 l/min at up to 75% vacuum (as of April 2026) [5].
- **Piab B-BL bellows cups** — includes detectable silicone versions certified to FDA 21 CFR 177.2600 and EU 1935/2004 [6].
- **Robotiq AirPick and EPick** — compressed-air and electric vacuum grippers for cobots, about 85% and 80% vacuum [3].

### Common misconception
**Misconception:** A stronger vacuum pump means a stronger grip, so if parts drop, buy a bigger pump.

**Reality:** Grip is capped by atmospheric pressure times cup area, and most drops come from leaks, poor sealing, or low friction during sideways acceleration. A larger or better-shaped cup, several cups, or gentler moves usually help more, and on porous parts what you need is flow, not deeper vacuum [3].

### Key numbers
- Holding force: F = Δp × A; at -60 kPa a 20 mm cup gives about 19 N before any safety factor (arithmetic from [2])
- Safety factor: 1.5-4, depending on surface (smooth or porous and oily) and cup orientation (horizontal or vertical) [2][3]
- Electric cobot generators: 12-46 l/min and 75-80% maximum vacuum, depending on model [5]
- Compressed-air cobot gripper: about 85% vacuum [3]
- Friction coefficient: about 0.5 dry, 0.2-0.4 wet [2]

### Sources
1. [Measurement units for vacuum data](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/basic-knowledge/measurement-units-for-vacuum-data) — Schmalz; absolute and relative (percent) vacuum, unit conversions
2. [Suction cups lift almost anything](https://www.machinedesign.com/news/suction-cups-lift-almost-anything) — Machine Design, 2011, by a Schmalz applications engineer; force formulas, safety factors, friction coefficients, flat and bellows cups, materials
3. [Best practices for cup selection](https://blog.robotiq.com/best-practices-for-cup-selection) — Robotiq blog; safety factors, porous materials, cup materials, AirPick and EPick vacuum levels
4. [Vacuum ejectors](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/vacuum-generators/vacuum-ejectors) — Schmalz; venturi principle, eco-nozzle ejectors, air-saving regulation
5. [Electrically powered: how vacuum is becoming mobile](https://www.schmalz.com/en/career-company/latest/news/electrically-powered-how-vacuum-is-becoming-mobile) — Schmalz press release, April 2026; electric generator specs, energy claim, Bizerba meat-pack cell
6. [Food automation](https://www.piab.com/industries/food--beverage/food-automation) — Piab; FDA 21 CFR 177.2600 and EU 1935/2004 silicone, detectable cups with iron additive, filters, cleanable cup design

## Soft gripper
id: soft-gripper
requires: end-effector
aka: soft robotic gripper, compliant gripper, pneumatic finger gripper, soft fingers

### Plain
A soft gripper picks things up the way you cup a ripe peach in a relaxed hand: soft fingers curl around the item and press gently over a wide area instead of pinching at two hard points. Because the fingers bend to fit, the robot does not need to know the item's exact shape or size. That makes it good for food that bruises, rolls, or comes in odd shapes.

### Where the analogy breaks
Your hand feels the peach and adjusts; most soft grippers feel nothing and simply curl to a set air pressure. They are also weaker and sloppier than a hand, because the item can shift a few millimeters inside the soft grip, which matters when placing it into a small tray pocket.

### Precise
Soft grippers are built from compliant (easily bent) materials, mostly silicone elastomers
(rubber-like plastics), so the gripper adapts to the object instead of the control software
computing exact finger positions [1]. A widely cited review groups them into three
approaches: actuation (fingers that bend when driven), controlled stiffness (a gripper that
goes floppy to mold around a part, then stiffens), and controlled adhesion (holding by surface
sticking) [1]. In factories the common type is the pneumatic finger: a molded rubber finger
with air channels inside that curls when air pressure changes [unverified: mechanism detail
from a search snippet of the review, not its opened text]. Schmalz's mGrip, for example, is
pneumatically controlled with a closed air circuit and no extra drives [2].

The trade is gentleness and shape tolerance in exchange for force, speed, and placement
precision; the review lists robustness, speed, sensing, and control as open problems [1].
Payloads are modest: OnRobot rates its Soft Gripper (24 V, no air supply) at up to 2.2 kg with an 11-118
mm grip range, and notes that real capacity depends on the item's shape, softness, and
friction [3]. Schmalz lists mGrip at up to 10 kg, items up to 300 mm wide, and up to 120
picks per minute [4].

Food versions use FDA-compliant materials (POM plastic, silicone, stainless steel) and an
optional IP69K rating (sealed against high-pressure, high-temperature washdown) [4], and can be
cleaned in place without dismantling [2]. "Food grade" can come with conditions: OnRobot's
silicone cups comply with FDA 21 CFR only for non-fatty foods, plus EU 1935/2004 [3].

### On the cheese plate line
The grape station is the natural fit. A bunch on its stem has no flat face for a suction cup, its shape is different every time, and a hard squeeze pops berries off the stem. Three or four soft fingers close around the bunch from above at low pressure, so the vision system only needs a rough center point, not a precise grasp (see [[grasp-planning]]). The cheese station shows the material trap: cheese is fatty, so a finger or cup certified only for non-fatty foods, like OnRobot's silicone cups [3], cannot touch unwrapped cheese.

### Elsewhere
In bakeries and meat and poultry plants, mGrip fingers move baked goods, fruit and vegetables, and chicken drumsticks into trays, and outside food they pick nets or bags of small parts [2]. Schmalz bought the mGrip product family from Soft Robotics Inc. in August 2024 and kept its Boston production site [4], a reminder that product names in this field move between companies.

### Why it exists
Rigid fingers need the object's shape and position to be known and consistent, and they concentrate force at a few points, which bruises food. Soft grippers let one tool handle a range of irregular, delicate items with simple open-and-close control.

### Connects to
- [[vacuum-gripper]] — the cheaper choice whenever the item has a face that seals; some soft grippers use vacuum cavities to move their fingers [5].
- [[rigid-gripper]] — the choice when force, speed, or exact placement matter more than gentleness.
- [[grasp-planning]] — compliance relaxes how exact the planned grasp must be.
- [[hygienic-design]] — fingers are food-contact parts and must survive washdown.
- [[pneumatic-actuation]] — most industrial soft fingers run on compressed air.

### Real products and tools
- **Schmalz mGrip** — modular pneumatic finger gripper for direct food handling, from Soft Robotics Inc. since 2024; up to 10 kg, optional IP69K [4][2].
- **OnRobot Soft Gripper** — runs on 24 V with no external air supply, three interchangeable silicone cups, up to 2.2 kg [3].
- **Piab piSOFTGRIP** — soft fingers driven by vacuum cavities, for fragile items such as chocolate and waffles [5].

### Common misconception
**Misconception:** Soft grippers are the safe universal choice for food, because they cannot damage anything.

**Reality:** They are slower, weaker, and less exact at placement than vacuum or rigid grippers, and "food grade" can carry conditions such as non-fatty foods only [3]. They are the right tool for irregular, delicate items, not a default.

### Key numbers
- Payload: about 2.2 kg (OnRobot Soft Gripper) to 10 kg (mGrip), depending on design and on the item's shape and friction [3][4]
- Grip range: 11-118 mm for OnRobot's cups; items up to 300 mm wide for mGrip [3][4]
- Speed: up to 120 picks per minute for mGrip [4]

### Sources
1. [Soft Robotic Grippers (Shintake, Cacucciolo, Floreano, Shea), Advanced Materials 30(29), 2018](https://infoscience.epfl.ch/record/234519/export/xm?ln=en) — EPFL repository record and abstract; three soft gripping approaches, materials, open challenges
2. [Finger grip mGrip: flexible, hygienic, process safe](https://www.reinraum.de/en/news/finger-grip-mgrip-flexible-hygienic-process-safe.html) — reinraum.de, November 2024, Schmalz news item; pneumatic closed circuit, cleaning in place, applications
3. [OnRobot Soft Gripper](https://www.universal-robots.com/marketplace/products/01tP40000071NX9IAM) — Universal Robots marketplace listing; payload, grip range, cups, FDA (non-fatty foods) and EU 1935/2004 compliance
4. [Portfolio expanded: Schmalz takes over finger gripper from Soft Robotics Inc](https://www.schmalz.com/en/career-company/latest/news/portfolio-expanded-schmalz-takes-over-finger-gripper-from-soft-robotics-inc) — Schmalz press release, August 2024; acquisition, load capacity, speed, FDA-compliant materials, IP69K
5. [Food automation](https://www.piab.com/industries/food--beverage/food-automation) — Piab; piSOFTGRIP soft fingers with vacuum cavities

## Rigid finger gripper
id: rigid-gripper
requires: end-effector
aka: parallel gripper, two-finger gripper, jaw gripper, mechanical gripper, finger gripper

### Plain
A rigid finger gripper is the robot's pair of kitchen tongs: two hard jaws close on the item and hold it by squeezing. The tips of the tongs are swapped for shapes that fit each job. It is strong, fast, and precise, but it presses on the item at only a few spots.

### Where the analogy breaks
Your hand on the tongs feels the food give and eases off; a basic pneumatic gripper squeezes with the same full force every time, whether it holds a steel shaft or a soft cheese. Electric grippers can limit force, but only to a number set in advance, not by feel.

### Precise
Most industrial finger grippers are parallel grippers (two jaws that slide straight toward
each other). Their main specs are stroke (how far each jaw travels), grip force (how hard
the jaws squeeze), repeatability (how closely the jaws return to the same position), closing
time, and maximum finger length (longer fingers multiply the bending load on the jaw guides).

Pneumatic grippers are compact, fast, and strong, but their force is set by air pressure.
Schunk's PGN-plus-P 64-1 has 6 mm stroke per jaw, 350 N closing force, 0.01 mm
repeatability, and 0.02 s closing time at 0.27 kg, running at 2.5-8 bar [1]. Electric
grippers give up speed and force for programmable stroke and force: Schunk's EGK 25 has
26.5 mm stroke per jaw, 20-50 N adjustable force, 0.03 mm gripping repeatability, 0.37 s
closing time, and a brake that keeps 75-90% of grip force if power drops [2]. OnRobot's RG2
opens 110 mm with 3-40 N [3], and Robotiq's 2F-85 has linked fingers that either grip in
parallel at the tips or wrap around a part, over an 85 mm stroke [4].

A part can be held two ways. In a force-fit (friction) grip, only squeeze times friction
holds the part up, so the needed force grows with weight, acceleration, and safety factor,
and shrinks with friction. In a form-fit grip, the finger shape cradles the part so it cannot
fall out even with a light squeeze. The difference is large: OnRobot rates the RG2 at 2 kg
force-fit but 5 kg form-fit [3]. Fingers are usually custom-made per product, within the
maker's limits, such as 70 mm and 0.13 kg per finger for the EGK 25 [2].

Catalog grippers are often not washdown-rated: the EGK 25 is IP67 on its electronics but IP20
on its guides and jaws [2], and the PGN-plus-P is IP40 [1]. A food line needs a gripper built
for washdown, or a sealed cover, instead.

### On the cheese plate line
The cheese station picks unwrapped wedges with an electric parallel gripper and food-grade plastic fingers cut with a V-notch matching the wedge angle, so the grip is mostly form-fit and the squeeze stays low. A pneumatic gripper at 350 N [1] would crush a wedge, and even the EGK 25's 20 N minimum [2] may dent a soft cheese, so a gripper whose force goes down to about 3 N [3] fits better (the real limit needs a test on the actual cheese). The finger plastic must be approved for fatty-food contact, and the gripper must survive washdown, which rules out the IP20 and IP40 catalog parts above [1][2].

### Elsewhere
In machine tending (a robot loading raw parts into a machine tool and unloading finished ones), a pneumatic parallel gripper with hardened steel fingers grabs machined shafts. There 350 N of grip and 0.01 mm repeatability [1] are exactly the point, and nothing is fragile.

### Why it exists
Squeezing between hard jaws is the most direct way to hold a part firmly and know exactly where it sits in the hand, which precise placement and assembly need. It works on parts with no smooth face for vacuum and tolerates high accelerations.

### Connects to
- [[soft-gripper]] — the gentler alternative when items bruise or vary in shape.
- [[grasp-planning]] — rigid fingers need a well-chosen grasp point and approach.
- [[pneumatic-actuation]] — most fast, high-force grippers are air-driven.
- [[servo-motor]] — electric grippers use a small motor for programmable stroke and force.
- [[ip-rating]] — catalog grippers are often only IP20-IP40 on their moving parts.

### Real products and tools
- **Schunk PGN-plus-P** — pneumatic parallel gripper series; size 64-1: 6 mm per jaw, 350 N, 0.01 mm [1].
- **Schunk EGK** — electric parallel gripper series; size 25: 26.5 mm per jaw, 20-50 N [2].
- **OnRobot RG2** — electric two-finger cobot gripper; 110 mm stroke, 3-40 N [3].
- **Robotiq 2F-85** — adaptive two-finger gripper with parallel and wrap-around grip, 85 mm stroke [4].

### Common misconception
**Misconception:** Pick the gripper with the most force so nothing slips.

**Reality:** Grip force must be high enough to hold through acceleration but low enough not to damage the part, and finger shape usually matters more: form-fit fingers raise the RG2's rated payload from 2 kg to 5 kg [3]. Excess force also strains long fingers and jaw guides.

### Key numbers
- Stroke: 6 mm per jaw (compact pneumatic) to 26.5 mm per jaw (small electric); 110 mm total for a wide-opening cobot gripper [1][2][3]
- Grip force: 3-50 N for small electric grippers, about 350 N for a 64-size pneumatic one, depending on size and drive [1][2][3]
- Repeatability: 0.01-0.03 mm [1][2]
- Closing time: 0.02 s pneumatic versus 0.37 s electric for the models above [1][2]

### Sources
1. [PGN-plus-P 64-1](https://schunk.com/be/fr/uchopovaci-systemy/paralelni-chapadlo/pgn-plus-p/pgn-plus-p-64-1/p/000000000000318496) — Schunk product page; stroke, force, repeatability, timing, pressure range, IP40, finger length
2. [EGK 25-EI-M-B](https://schunk.com/us/en/sistemi-di-presa/pinza-parallela/egk/egk-25-ei-m-b/p/000000000001491754) — Schunk product page; stroke, force, repeatability, force retention, finger limits, IP ratings
3. [RG2 gripper](https://onrobot.com/en/products/rg2-gripper) — OnRobot product page; stroke, force, force-fit and form-fit payload, custom fingertips
4. [Robotiq 2F-85](https://www.universal-robots.com/plus/products/robotiq/robotiq-2f-85/) — Universal Robots UR+ listing; 85 mm stroke, parallel and encompassing grip

## Tool changer
id: tool-changer
requires: end-effector
aka: quick changer, automatic tool changer, robotic tool changer, master plate, tool plate

### Plain
A tool changer works like the mount between a camera and its lenses: one half stays on the robot's wrist, the other half sits on each tool, and they lock together firmly and release on command. Air and electrical signals pass through the joint too, the way a lens mount passes signals to the lens. That lets one robot swap tools in seconds instead of a person unbolting them.

### Where the analogy breaks
A lens is light and you hold it while changing it; a robot tool can weigh tens or hundreds of kilograms, swings at speed, and is changed with nobody holding it, so the lock must stay shut even if the air that drives it fails. A tool changer also has to put the tool back within a few hundredths of a millimeter every time.

### Precise
An automatic tool changer has a master plate on the robot flange and a tool plate on each
tool [unverified: the ATI pages I opened name both plates but do not say which side is
which]. A piston in the master drives the lock; ATI describes it as acting like a large dowel
pin (an alignment peg) that also lines the plates up [1]. Repeatability (how exactly the tool
returns to the same place after each change) is listed at 0.0152 mm for ATI's QC changers from
70 kg to 700 kg payload [2][4].

Fail-safe locking means the tool cannot drop if lock air is lost: ATI's mechanism keeps the
tool plate attached if lock air pressure is accidentally removed [1]. Sensors report state:
lock and unlock sensing is built in [2], and larger models add ready-to-lock sensors that
detect the tool plate within 1.5 mm [4]. "No-touch" locking tolerates a gap of up to about
2-3 mm while locking, so the robot does not need to press the plates together perfectly
[2][3].

Utility pass-through (carrying the tool's services across the joint) is the other half of
the job. Modules on the plates pass compressed air through sealed ports, and electrical
signals through spring-loaded pins on the master that touch fixed pins on the tool; heavy
models add fluid, high-current power, and servo modules [1][4]. Without this, every tool
change would mean reconnecting hoses and cables by hand.

The costs are mass and length. ATI's QC-46 weighs 2.98 kg coupled [2], which comes straight
out of a cobot's rated payload, and the extra length pushes the TCP further from the flange,
raising wrist torque. Manual quick-change plates, locked by a lever instead of air, are a
lighter and cheaper option when changes are rare [unverified: no manual changer datasheet
opened].

### On the cheese plate line
With one robot per ingredient, no station swaps tools mid-cycle; at 200 plates an hour each robot has about 18 s per plate, and changing tools would waste it. The changer earns its place at sanitation and changeover: the grape station's soft fingers and the apple station's suction cups are food-contact parts that go to the wash room, so an operator pulls the dirty tool and fits a clean spare in a minute. Because a good changer repeats to about 0.015 mm [2], far tighter than placing a grape needs, the TCP does not need re-teaching. The changer sits in the splash zone, so it must meet the same washdown rating as the rest of the cell (see [[ip-rating]]).

### Elsewhere
ATI's QC-510 is rated for 700 kg payloads, with 62,000 N locking force at 5.5 bar, 28.1 kg of its own coupled mass, and servo and high-current modules [4]. That scale suits large robots that switch between heavy tools such as welding guns and big grippers [unverified: ATI's QC-510 page I opened lists no applications].

### Why it exists
A robot costs far more than a tool, so letting one arm use several tools raises its use, and fast removal shortens cleaning, repair, and product changeover. The fail-safe lock and utility pass-through make that swap safe and automatic.

### Connects to
- [[end-effector]] — the changer sits between flange and tool and moves the TCP outward.
- [[payload]] — the changer's mass comes out of the rated payload.
- [[repeatability]] — changer repeatability should be much tighter than the robot's own.
- [[pneumatic-actuation]] — the lock is usually air-driven.
- [[safety-circuit]] — lock and presence signals feed interlocks so the robot never leaves with a half-locked tool.

### Real products and tools
- **ATI QC-46** — compact changer; 70 kg suggested payload, 0.0152 mm repeatability, 5800 N locking force at 5.5 bar, 2.98 kg coupled [2].
- **ATI QC-160** — 300 kg payload, 31,000 N locking force, integrated air ports [3].
- **ATI QC-510** — 700 kg payload, ready-to-lock sensors, servo and high-current modules [4].
- **ATI Industrial Automation** — the maker above is, as of 2026, "a Novanta company" [2].

### Common misconception
**Misconception:** Tool changers are only worth it for robots that do many different jobs.

**Reality:** On food lines they often serve a single-job robot, because the tool must come off for cleaning or replacement and come back in exactly the same place. The value is fast, repeatable removal as much as variety.

### Key numbers
- Repeatability: 0.0152 mm, listed for ATI QC sizes from 70 to 700 kg payload [2][4]
- Locking force at 5.5 bar: 5800 N (QC-46) to 62,000 N (QC-510), scaling with size [2][4]
- Added mass: about 3 kg (QC-46) to 28 kg (QC-510) coupled [2][4]
- Gap tolerated while locking: about 2-3 mm, depending on model [2][3]

### Sources
1. [Tool changer features](https://ati-ia.com/products/toolchanger/tool_changer_features.aspx) — ATI Industrial Automation; piston as dowel pin, fail-safe on air loss, utility modules, spring-pin electrical contacts
2. [QC-46 tool changer](https://ati.novanta.com/product/qc-46/) — ATI (Novanta) product page; payload, repeatability, locking force, weight, lock and unlock sensing, no-touch locking gap
3. [QC-160 tool changer](https://ati.novanta.com/product/qc-160/) — ATI (Novanta) product page; payload, locking force, air ports, plate separation
4. [QC-510 tool changer](https://ati.novanta.com/product/tool-changers-qc-510/) — ATI (Novanta) product page; payload, locking force, weight, ready sensors, module families

## Force-torque sensor
id: ft-sensor
requires: end-effector
aka: F/T sensor, six-axis force sensor, wrist force sensor, force sensor

### Plain
A force-torque sensor is like a very precise bathroom scale fitted between the robot's wrist and its tool, except it measures pushes and twists in every direction, not just down. With it, the robot can tell how hard it is pressing, whether it has touched something, and how heavy the thing in its hand is. Without one, most robots are numb at the hand.

### Where the analogy breaks
A bathroom scale waits for you to stand still; a wrist sensor reads continuously while the arm moves, so the tool's own weight and the forces from speeding up and slowing down show up in the reading and must be subtracted. It also reports six numbers at once, three pushes and three twists.

### Precise
A six-axis F/T sensor reports three forces, Fx, Fy, Fz (pushes along each axis), and three
torques, Tx, Ty, Tz (twists about each axis) [1]. Inside, a stiff metal body flexes very
slightly under load, and strain gauges (thin sensors whose electrical resistance changes as
they stretch) measure that flex. ATI machines its sensor bodies from high-strength stainless
steel and uses silicon strain gauges, which it says give a signal about 75 times stronger than
foil gauges [1][2]. Each unit is factory-calibrated to turn gauge readings into forces and
torques, traceable to NIST (the US national measurement lab) [2].

The key specs are range (the largest load per axis it measures correctly), resolution (the
smallest change it can detect), and overload (the load it survives without damage). Range and
resolution move together: ATI's Mini58 comes in calibrations from 700 N to 2800 N of X/Y
force, with X/Y resolution coarsening from about 1/6 N to 3/4 N [1]. ATI's Delta has a 165 N
calibration with 1/32 N X/Y resolution [2]. Overload limits are 4.9-21 times rated capacity
for the Mini58 and 4.1-18.8 times for the Delta [1][2]. Loads must stay in range on all six
axes at once for readings to be valid, and quoted resolutions assume some noise filtering
[1].

That trade drives sizing: a sensitive sensor has a small range and is easier to destroy in a
crash, so designers pick the coarsest sensor that still resolves what they need. Without any
force sensing, a robot can only follow positions: it cannot press with a set force, stop
gently on contact, or weigh what it holds. Some arms estimate force from their joints instead
(see [[torque-sensing]]).

### On the cheese plate line
This line can mostly do without one, which is a useful lesson in itself. One candidate is a double-pick check at the cracker station: a wrapped pack might weigh 10-30 g, about 0.1-0.3 N [unverified: depends on the pack]. The Mini58's smallest metric calibration resolves Fz only to about 7/24 N, roughly 30 g [1], so it cannot reliably tell one pack from two; the Delta's 165 N calibration resolves Fz to 1/16 N, about 6 g [2], which is closer, though readings taken while the arm moves are noisier. A vacuum switch or the inspection camera is a cheaper check (see [[inspection]]), and any sensor here would need a washdown option such as ATI's IP65 or IP68 versions [1].

### Elsewhere
In robotic grinding and polishing, the sensor lets the robot hold a steady pressing force on a curved part even when the part sits slightly off its expected position. ATI markets its Axia80 for assembly, grinding, and polishing: it is 82 mm across, weighs 0.3 kg, and connects straight to the robot controller over EtherCAT or Ethernet (industrial network links) [3].

### Why it exists
Position control alone fails whenever the world is not exactly where the robot thinks it is, and contact tasks like pressing, inserting, and polishing are about force, not position. The F/T sensor gives the robot's control loop a direct measurement of contact so it can push, stop, or give way.

### Connects to
- [[control-loops]] — force control closes a loop on the sensor reading instead of on position.
- [[torque-sensing]] — the alternative of sensing force inside the joints.
- [[cobot]] — many cobots already sense contact; a wrist sensor adds fine force control at the tool.
- [[payload]] — the sensor adds mass and length between flange and tool.
- [[inspection]] — often the cheaper way to catch the errors a sensor could detect.

### Real products and tools
- **ATI Mini58** — compact six-axis sensor; 700-2800 N X/Y force calibrations, IP60, IP65, or IP68 options [1].
- **ATI Delta** — larger six-axis sensor; 165-660 N X/Y force calibrations, overload 4.1-18.8 times rated [2].
- **ATI Axia80** — lower-cost sensor with built-in electronics and EtherCAT or Ethernet output, launched in 2017 [3].
- **Universal Robots e-Series** — arms with a force-torque sensor built into the tool flange [unverified: not checked against a UR datasheet in this pass].

### Common misconception
**Misconception:** The most sensitive sensor is the best one.

**Reality:** Resolution trades against range and crash survival [1][2]. A sensor fine enough to weigh a cracker pack has a small range and can be ruined by a single collision, so the right sensor is the coarsest one that still resolves the forces the task needs.

### Key numbers
- Axes: 6 (Fx, Fy, Fz, Tx, Ty, Tz) [1]
- X/Y force range: 165-2800 N across the calibrations above, by model and calibration [1][2]
- X/Y force resolution: about 1/32-3/4 N, coarser as range grows [1][2]
- Overload: 4.1-21 times rated capacity, by model and axis [1][2]

### Sources
1. [Mini58 F/T sensor](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58) — ATI Industrial Automation; ranges, resolutions, overload ratio, IP options, silicon strain gauges
2. [Delta F/T sensor](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Delta) — ATI Industrial Automation; ranges, resolutions, overload ratio, NIST-traceable calibration
3. [ATI Industrial Automation's low-cost force/torque sensor Axia80](https://www.newequipment.com/home/product/55103225/24461-ati-industrial-automations-low-cost-torque-sensor-axia80) — New Equipment Digest, October 2017; size, weight, interfaces, applications
