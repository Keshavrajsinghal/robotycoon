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
You feel where the tips of your tongs are without thinking; a robot only knows the number it was told. If the tool center point is typed in 5 mm wrong, every target the robot calculates for the tip (from a camera, a drawing, or a grid) is missed by 5 mm, confidently and without noticing.

### Precise
The end effector (also called end-of-arm tooling, EOAT) is everything mounted after the arm's
last joint: the gripper or tool, plus adapter plates, sensors, hoses, and cables. It bolts to
the tool flange (the flat round plate on the last joint). On many industrial arms its
dimensions and bolt pattern follow ISO 9409-1, the standard for a round mounting plate that
lets tools be swapped and keep their orientation [4]; a UR5e flange, for example, is
ISO 9409-1-50-4-M6 [5]. Many arms also have a small electrical connector at the wrist.
Universal Robots arms, for example, provide an M8 tool connector (a small 8-pin round plug)
with up to 48 W peak power, 2 digital inputs, 2 digital outputs (on/off signal wires), and 2
analog inputs (wires that read a varying voltage) [1][5].

The tool center point (TCP) is the point on the tool that the robot moves and reports
positions for, such as the middle of a suction cup face or the spot between two fingertips.
It is stored as an offset from the flange: a translation (how far along X, Y, and Z) and a
rotation (which way the tool points) [1]. In other words, it is one more coordinate frame (a
set of X, Y, Z axes attached to something) on the chain from the robot base to the tool tip;
see [[frames|coordinate frames and transforms]]. Straight-line moves are executed for the TCP, so a wrong TCP makes them drift
or swing in unexpected ways [1]. Because the TCP is only a stored offset, a point taught by
jogging the real tool to the real spot still replays correctly with a wrong TCP (the robot
simply returns the flange to where it was). The error shows up in targets calculated from
elsewhere, such as camera coordinates or a tray layout, and in any move that turns the tool
about its tip.

The end effector also sets the payload (the mass the arm carries beyond itself): the tool's
mass, plus the workpiece, plus where their combined center of gravity sits [1]. Universal
Robots documents that a wrong payload setting can cause poor hand-guiding and unexpected
protective stops (automatic safety halts) [1]. Only one payload and center of gravity is
active at a time, so a program must update it each time the robot picks up or drops a part
[2].

### On the cheese plate line
At the apple pick station, the end effector is a stainless bracket carrying one bellows suction cup, a vacuum hose, and a vacuum switch. Its TCP is set at the center of the cup lip, about 120 mm out from the flange (illustrative). The place point in each tray pocket is calculated from the tray's position, so if that number is entered 5 mm too long, the robot thinks the cup reaches 5 mm further than it does, stops every slice 5 mm above the pocket, and lets go, so slices drop and slide; entered 5 mm too short, it pushes every slice 5 mm into the tray. The tool's mass plus one slice goes into the payload setting, and every surface below the flange that can touch apple must meet the line's food-contact and washdown rules; see [[hygienic-design|hygienic and food-safe design]].

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
- **OnRobot RG2** — a gripper whose software calculates its TCP and payload automatically, cutting manual setup [3].

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
4. [ISO 9409-1:2004 Manipulating industrial robots - Mechanical interfaces - Part 1: Plates](https://www.boutique.afnor.org/en-gb/standard/iso-940912004/manipulating-industrial-robots-mechanical-interfaces-part-1-plates/xs112104/110274) — AFNOR (French standards body) catalog entry; scope of the standard, current status
5. [UR5e technical specification](https://www.universal-robots.com/manuals/latest/en/datasheets/ur5e/) — Universal Robots datasheet, updated October 2026; EN ISO 9409-1-50-4-M6 flange, M8 8-pin tool connector, tool I/O

## Vacuum gripper
id: vacuum-gripper
requires: end-effector
aka: suction gripper, suction cup, vacuum cup, vacuum generator, venturi ejector, vacuum pump

### Plain
A vacuum gripper holds things the way you can lift a scrap of paper by sucking on a drinking straw. A soft cup presses on the item, air is pulled out from inside the cup, and the air around the item pushes it firmly onto the cup. Let air back in and the item drops.

### Where the analogy breaks
Sucking feels like pulling, but nothing pulls: the room's air pressure pushes, so the grip can never exceed atmospheric pressure (about 101 kPa at sea level [9]) times the cup's area, however strong the pump. And unlike your mouth, a robot cannot feel a leak, so it needs a vacuum sensor to know it is holding anything at all.

### Precise
A vacuum gripper has three parts: a vacuum generator (the device that removes air), suction
cups (soft rubber or silicone lips that seal against the part), and valves plus a vacuum
switch (a pressure sensor that reports "part held"). Vacuum level is how far below
atmospheric pressure the cup gets. It is written as a pressure (kPa or mbar below
atmosphere) or as a percentage of a perfect vacuum, and vendors use the percentage mainly to
compare generators [1]. As rough arithmetic, 60% vacuum is about -60 kPa.

Theoretical holding force is pressure difference times effective cup area, F = Δp × A [7][2].
Engineers then add a safety factor (deliberate extra margin). Schmalz recommends at least 2,
notes 1.5 as the German accident-prevention minimum, and 2.5 or more if the part is swung or
flipped [7]. Robotiq suggests 1.5 for smooth parts, 2 for porous or oily ones, and up to 4
when the cup face is vertical, because then only friction holds the part [3]. Friction (how
much two surfaces resist sliding) changes a lot with moisture: about 0.5 on dry plastic or
metal, but only 0.2-0.4 on wet surfaces, depending on the surface (Schmalz's current figure is
0.2-0.3) [2][8]. Friction matters whenever the load pulls along the cup face instead of straight
off it. Schmalz's sizing rules divide the acceleration by the friction coefficient when a level
cup moves the part sideways, and divide the whole load by it when the cup face is vertical, so
at a friction of 0.25 a vertical cup needs four times the force of a level one [8].

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
and general, polyurethane resists oil, and silicone handles heat and cold and comes in grades
approved for food contact [3]. When the seal is poor, flow (litres of air per minute the generator can
move) becomes the limit, so porous parts need a high-flow generator or several small cups
[3].

### On the cheese plate line
The cracker station picks a wrapped cracker pack with a bellows cup, whose folds follow the wrinkled film. Force is not the problem: a 20 mm cup at -60 kPa gives about 19 N in theory (my arithmetic from F = Δp × A [2]), while a pack of perhaps 10-30 g weighs far less than 1 N, which is the weight of about 100 g [unverified: pack mass depends on the product]. The apple station is harder. The slices are wet, so friction falls to about 0.2-0.4 [2] and a fast sideways move can slide a slice off the cup even when the straight-up hold is ample [8]. Juice can be sucked into the vacuum line (Piab fits filters on some food cups to stop clogging [6]), and the curved skin seals poorly, so the cup should land on the flat cut face. Cups touching unwrapped apple should be food-contact silicone, such as Piab cups whose silicone complies with US FDA 21 CFR 177.2600 and EU regulation 1935/2004 (the FDA rule covers the material; it does not certify products), often in a metal-detectable grade with a little iron mixed in so a torn piece is caught by the metal detector [6][10].

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
- **Piab B-BL bellows cups** — includes detectable silicone versions complying with FDA 21 CFR 177.2600 and EU 1935/2004 [10].
- **Robotiq AirPick and EPick** — compressed-air and electric vacuum grippers for cobots, about 85% and 80% vacuum [3].

### Common misconception
**Misconception:** A stronger vacuum pump means a stronger grip, so if parts drop, buy a pump that pulls a deeper vacuum.

**Reality:** Grip is capped by atmospheric pressure times cup area, and cobot generators already reach 75-85% vacuum [3][5], so going deeper adds little, while doubling the cup diameter quadruples the force [7]. Drops more often come from leaks, poor sealing, or low friction during fast or sideways moves [3][8], so a larger or better-shaped cup, more cups, or gentler moves usually help more. On porous parts the fix is more flow (air moved per minute), not deeper vacuum [3].

### Key numbers
- Holding force: F = Δp × A; at -60 kPa a 20 mm cup gives about 19 N before any safety factor (arithmetic from [7])
- Safety factor: 1.5-4, depending on surface (smooth or porous and oily) and cup orientation (horizontal or vertical) [3][7]
- Electric cobot generators: 12-46 l/min and 75-80% maximum vacuum, depending on model [5]
- Compressed-air cobot gripper: about 85% vacuum [3]
- Friction coefficient: about 0.5 dry, 0.2-0.4 wet, depending on surface and reference [2][8]

### Sources
1. [Measurement units for vacuum data](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/basic-knowledge/measurement-units-for-vacuum-data) — Schmalz; absolute and relative (percent) vacuum, unit conversions
2. [Suction cups lift almost anything](https://www.machinedesign.com/news/suction-cups-lift-almost-anything) — Machine Design, 2011, by a Schmalz applications engineer; force formulas, safety factors, friction coefficients, flat and bellows cups, materials
3. [Best practices for cup selection](https://blog.robotiq.com/best-practices-for-cup-selection) — Robotiq blog; safety factors, porous materials, cup materials, AirPick and EPick vacuum levels
4. [Vacuum ejectors](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/vacuum-generators/vacuum-ejectors) — Schmalz; venturi principle, eco-nozzle ejectors, air-saving regulation
5. [Electrically powered: how vacuum is becoming mobile](https://www.schmalz.com/en/career-company/latest/news/electrically-powered-how-vacuum-is-becoming-mobile) — Schmalz press release, April 2026; electric generator specs, energy claim, Bizerba meat-pack cell
6. [Food automation](https://www.piab.com/industries/food--beverage/food-automation) — Piab; FDA 21 CFR 177.2600 and EU 1935/2004 silicone, detectable cups with iron additive, filters, cleanable cup design
7. [Design of the suction cup](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/vacuum-suction-cups/design-of-the-suction-cup) — Schmalz; F = Δp × A, safety factor of at least 2, 1.5 German UVV minimum, 2.5 when swiveling
8. [Theoretical holding force of a suction cup](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/system-design-calculation-example/theoretical-holding-force-of-a-suction-cup) — Schmalz; friction reference values (0.5 dry wood, metal, glass, stone; 0.2-0.3 wet)
9. [Standard atmosphere](https://physics.nist.gov/cgi-bin/cuu/Value?stdatm) — NIST reference on constants; 101 325 Pa
10. [Suction cup B-BL30-2 Silicone, detectable, FCM](https://www.piab.com/suction-cups-and-soft-grippers/round-suction-cups/multibellows-suction-cups/0206373) — Piab product page; multibellows cup, Fe additive for detectability, silicone complying with FDA 21 CFR 177.2600 and EU 1935/2004

## Soft gripper
id: soft-gripper
requires: end-effector
aka: soft robotic gripper, compliant gripper, pneumatic finger gripper, soft fingers

### Plain
A soft gripper picks things up the way you cup a ripe peach in a relaxed hand: soft fingers curl around the item and press gently over a wide area instead of pinching at two hard points. Because the fingers bend to fit, the robot does not need to know the item's exact shape or size. That makes it good for food that bruises, rolls, or comes in odd shapes.

### Where the analogy breaks
Your hand feels the peach and adjusts; most soft grippers feel nothing and simply curl to a set air pressure. They are also weaker and sloppier than a hand, because the item can shift or tilt inside the soft grip, which matters when placing it into a small tray pocket.

### Precise
Soft grippers are built from compliant (easily bent) materials, mostly silicone elastomers
(rubbers that stretch and spring back), so the gripper adapts to the object instead of the control software
computing exact finger positions [1]. A widely cited review groups them into three
approaches: actuation (fingers that bend when driven), controlled stiffness (a gripper that
goes floppy to mold around a part, then stiffens), and controlled adhesion (holding by surface
sticking) [1]. A common factory type is the pneumatic finger: a molded rubber finger with a
network of small air channels inside that bends when the channels are inflated [6]. It bends
instead of just swelling because one side is a layer that flexes but barely stretches: air
pressure lengthens the channel side, the other side keeps its length, and the difference curls
the finger toward that layer [8]. Schmalz's
mGrip, for example, opens and closes its fingers with air pressure or vacuum through a closed
air circuit, with no extra drives [2][7].

The trade is gentleness and shape tolerance in exchange for force, speed, and placement
precision; the review lists robustness, speed, sensing, and control as open problems [1].
Payloads are modest: OnRobot rates its Soft Gripper (24 V, no air supply) at up to 2.2 kg with an 11-118
mm grip range, and notes that real capacity depends on the item's shape, softness, and
friction [3]. Schmalz lists mGrip at up to 10 kg, items up to 300 mm wide, and up to 120
picks per minute [4].

Food versions use FDA-compliant materials (POM plastic, silicone, stainless steel) [4] and
can be cleaned in place without dismantling [2]; mGrip's optional hygienic design is rated
IP69K (sealed against high-pressure, high-temperature washdown) [7]. "Food grade" can come with conditions: OnRobot's
silicone cups comply with FDA 21 CFR only for non-fatty foods, plus EU 1935/2004 [3].

### On the cheese plate line
The grape station is the natural fit. A bunch on its stem has no flat face for a suction cup, its shape is different every time, and a hard squeeze pops berries off the stem. Three or four soft fingers close around the bunch from above at low pressure, so the vision system only needs a rough center point, not a precise grasp. That is one approach and a judgment call: the [[grasp-planning|grasp planning]] concept pictures fingers closing across the main stem instead, which needs vision to find the stem first. The cheese station shows the material trap: cheese is fatty, so a finger or cup whose food-contact compliance covers only non-fatty foods, like OnRobot's silicone cups [3], cannot touch unwrapped cheese.

### Elsewhere
In food plants, mGrip fingers place baked goods, fruit and vegetables into trays or pull them for quality checks, and handle chicken drumsticks; outside food they pick nets or bags of small parts [2]. Schmalz bought the mGrip product family from Soft Robotics Inc. in August 2024 and kept the existing Boston, Massachusetts location [4], a reminder that product names in this field move between companies.

### Why it exists
Rigid fingers need the object's shape and position to be known and consistent, and they concentrate force at a few points, which bruises food. Soft grippers let one tool handle a range of irregular, delicate items with simple open-and-close control.

### Connects to
- [[vacuum-gripper]] — the cheaper choice whenever the item has a face that seals; some soft grippers use vacuum cavities to move their fingers [5].
- [[rigid-gripper]] — the choice when force, speed, or exact placement matter more than gentleness.
- [[grasp-planning]] — compliance relaxes how exact the planned grasp must be.
- [[hygienic-design]] — fingers are food-contact parts and must survive washdown.
- [[pneumatic-actuation]] — most industrial soft fingers run on compressed air.

### Real products and tools
- **Schmalz mGrip** — modular pneumatic finger gripper for direct food handling, from Soft Robotics Inc. since 2024; up to 10 kg, optional IP69K hygienic design [4][7].
- **OnRobot Soft Gripper** — runs on 24 V with no external air supply, three interchangeable silicone cups, up to 2.2 kg [3].
- **Piab piSOFTGRIP** — soft fingers driven by vacuum cavities, for fragile items such as chocolate and waffles [5].

### Common misconception
**Misconception:** Soft grippers are the safe universal choice for food, because they cannot damage anything.

**Reality:** Their squeeze still rises with air pressure, so set too high they can bruise soft items. They are also slower, weaker, and less exact at placement than vacuum or rigid grippers, and "food grade" can carry conditions such as non-fatty foods only [3]. They are the right tool for irregular, delicate items, not a default.

### Key numbers
- Payload: about 2.2 kg (OnRobot Soft Gripper) to 10 kg (mGrip), depending on design and on the item's shape and friction [3][4]
- Grip range: 11-118 mm for OnRobot's cups; items up to 300 mm wide for mGrip [3][4]
- Speed: up to 120 picks per minute for mGrip [4]

### Sources
1. [Soft Robotic Grippers (Shintake, Cacucciolo, Floreano, Shea), Advanced Materials 30(29), 2018](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1002/adma.201707035&format=json&resultType=core) — Europe PMC record with abstract (DOI 10.1002/adma.201707035); three soft gripping approaches, materials, open challenges
2. [Finger grip mGrip: flexible, hygienic, process safe](https://www.reinraum.de/en/news/finger-grip-mgrip-flexible-hygienic-process-safe.html) — reinraum.de, November 2024, Schmalz news item; pneumatic closed circuit, cleaning in place, applications
3. [OnRobot Soft Gripper](https://www.universal-robots.com/marketplace/products/01tP40000071NX9IAM) — Universal Robots marketplace listing; payload, grip range, cups, FDA (non-fatty foods) and EU 1935/2004 compliance
4. [Portfolio expanded: Schmalz takes over finger gripper from Soft Robotics Inc](https://www.schmalz.com/en/career-company/latest/news/portfolio-expanded-schmalz-takes-over-finger-gripper-from-soft-robotics-inc) — Schmalz press release, August 2024; acquisition, load capacity, speed, FDA-compliant materials, IP69K
5. [Food automation](https://www.piab.com/industries/food--beverage/food-automation) — Piab; piSOFTGRIP soft fingers with vacuum cavities
6. [Pneumatic networks for soft robotics that actuate rapidly (Mosadegh et al.), Advanced Functional Materials 24(15), 2014](https://asu.elsevierpure.com/en/publications/pneumatic-networks-for-soft-robotics-that-actuate-rapidly/) — ASU research repository record and abstract; bending actuators made of small inflatable channels in elastomer
7. [Finger grippers mGrip](https://schmalz.com/mgrip) — Schmalz product page; pressure or vacuum to open and close fingers, closed pneumatic circuit, optional IP69K hygienic design, applications
8. [A recipe for soft fluidic elastomer robots (Marchese, Katzschmann, Rus), Soft Robotics 2(1), 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4997626/) — peer-reviewed, open access (PubMed Central); pressurized channels strain one side while a flexible but nearly inextensible layer keeps the other side's length, and the length difference produces bending

## Rigid finger gripper
id: rigid-gripper
requires: end-effector
aka: parallel gripper, two-finger gripper, jaw gripper, mechanical gripper, finger gripper

### Plain
A rigid finger gripper is the robot's pair of kitchen tongs: two hard jaws close on the item and hold it by squeezing. The tips of the tongs are swapped for shapes that fit each job. It is strong, fast, and precise, but it presses on the item at only a few spots.

### Where the analogy breaks
Your hand on the tongs feels the food give and eases off; a basic pneumatic gripper squeezes with whatever force its air pressure sets, the same every time, whether it holds a steel shaft or a soft cheese. Electric grippers can limit force, but only to a number set in advance, not by feel.

### Precise
Most industrial finger grippers are parallel grippers (two jaws that slide straight toward
each other) [5]. Their main specs are stroke (how far each jaw travels), grip force (how hard
the jaws squeeze), repeatability (how closely the jaws return to the same position), closing
time, and maximum finger length (longer fingers act as levers and multiply the bending load on
the jaw guides, the rails the jaws slide on).

Pneumatic grippers are compact, fast, and strong, but their force is set by air pressure.
Schunk's PGN-plus-P 64-1 has 6 mm stroke per jaw, 350 N closing force, 0.01 mm
repeatability, and 0.02 s closing time at 0.27 kg, running at 2.5-8 bar [1]. Electric
grippers give up speed and force for programmable stroke and force: Schunk's EGK 25 has
26.5 mm stroke per jaw, 20-50 N adjustable force, 0.03 mm gripping repeatability, 0.37 s
closing time, and a brake that keeps 75-90% of grip force during standstill or power
failure [2][6]. OnRobot's RG2 opens 110 mm with 3-40 N [3], and Robotiq's 2F-85 has fingers
that can either grip in parallel or wrap around (encompass) a part, over an 85 mm stroke [4].

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
An alternative for the cheese station (this guide's main design is a delta with a suction cup on the wedge's flat top face; see [[vacuum-gripper|vacuum gripper]]) is to pick unwrapped wedges with an electric parallel gripper and food-grade plastic fingers cut with a V-notch matching the wedge angle, so the grip is mostly form-fit and the squeeze stays low. A pneumatic gripper at 350 N [1] would crush a wedge, and even the EGK 25's 20 N minimum [2] may dent a soft cheese, so a gripper whose force goes down to about 3 N, like the RG2 [3], fits better (the real limit needs a test on the actual cheese). The RG2's product page makes no food-contact or washdown claim [3], though, so this option would need a washdown-built gripper with similarly low force. The finger plastic must be approved for fatty-food contact, and washdown also rules out catalog parts like the PGN-plus-P (IP40) and the EGK 25, whose guides and jaws are IP20 [1][2].

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
- Closing time: 0.02 s pneumatic (Schunk PGN-plus-P 64-1) versus 0.37 s electric (Schunk EGK 25) [1][2]

### Sources
1. [PGN-plus-P 64-1](https://schunk.com/be/fr/uchopovaci-systemy/paralelni-chapadlo/pgn-plus-p/pgn-plus-p-64-1/p/000000000000318496) — Schunk product page; stroke, force, repeatability, timing, pressure range, IP40, finger length
2. [EGK 25-EI-M-B](https://schunk.com/us/en/sistemi-di-presa/pinza-parallela/egk/egk-25-ei-m-b/p/000000000001491754) — Schunk product page; stroke, force, repeatability, force retention, finger limits, IP ratings
3. [RG2 gripper](https://onrobot.com/en/products/rg2-gripper) — OnRobot product page; stroke, force, force-fit and form-fit payload, custom fingertips
4. [Robotiq 2F-85](https://www.universal-robots.com/plus/products/robotiq/robotiq-2f-85/) — Universal Robots UR+ listing; 85 mm stroke, parallel and encompassing grip
5. [The difference between robotic grippers with parallel, three-finger, and angled designs](https://www.machinedesign.com/markets/robotics/article/21833348/the-difference-between-robotic-grippers-with-parallel-three-finger-and-angled-designs) — Machine Design, September 2011, quoting a Schunk automation manager; two-jaw parallel grippers are the most commonly used design
6. [Gripper for small components EGK](https://d16vz4puxlsxm1.cloudfront.net/asset/076200133045-Prod/document_2i0t6dph093pp39ajfvnkvla0g/EGK_EN_144dpi-WEB.pdf) — Schunk EGK brochure (PDF); electromagnetic brake that holds gripping force and position during standstill or power failure

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
tool [5]. A piston in the master drives the lock: a cam (a shaped collar) on the piston pushes a
ring of steel balls outward into a hardened steel ring in the tool plate, pulling the plates
tightly together [5]. ATI says the piston also acts like a large dowel pin (an alignment peg)
that lines the plates up [1]. Repeatability (how exactly the tool
returns to the same place after each change) is listed at 0.0152 mm for each of the ATI QC
models cited here, from 70 kg to 700 kg payload [2][3][4].

Fail-safe locking means the tool cannot drop if lock air is lost: ATI's mechanism keeps the
tool plate attached if lock air pressure is accidentally removed [1]. In ATI's design, if lock
air is lost and the piston eases back, the balls land on a straight, untapered section of the
cam that their load cannot push aside, so the plates stay coupled [5]. Sensors report state:
lock and unlock sensing is built in [2], and larger models add ready-to-lock sensors that
detect the tool plate within 1.5 mm [4]. "No-touch" locking tolerates a gap of up to about
2-3 mm while locking, so the robot does not need to press the plates together perfectly
[2][3].

Utility pass-through (carrying the tool's services across the joint) is the other half of
the job. Modules on the plates pass compressed air through sealed ports, and electrical
signals through spring-loaded pins on the master that touch fixed pins on the tool; heavy
models add fluid, high-current power, and servo modules [1][4]. Without this, every tool
change would mean reconnecting hoses and cables by hand.

The costs are mass and length. ATI's QC-46, sized for payloads up to 70 kg, weighs 2.98 kg
coupled [2]. That mass comes straight out of the robot's rated payload; on a 5 kg arm such as
the UR5e [7] it would use more than half, so changers are sized to the arm. The extra length
also pushes the TCP further from the flange, raising wrist torque. Manual tool changers, locked by hand instead of by air (ATI's MC-16R
uses a twist knob with a ratchet), suit tools that a person swaps, such as for maintenance
[6].

### On the cheese plate line
With one robot per ingredient, no station swaps tools mid-cycle; at 200 plates an hour each robot has about 18 s per plate, and changing tools would waste it. The changer earns its place at sanitation and changeover: the grape station's soft fingers and the apple station's suction cups are food-contact parts that go to the wash room, so an operator unlocks the dirty tool and fits a clean spare in about a minute (illustrative). ATI names this use, quick tool change for food-handling washdown, and has built a washdown-capable changer, the custom QC-77, with stainless steel bodies and food-grade grease [5]. Because it repeats to about 0.015 mm [5], far tighter than placing a grape needs, the TCP does not need re-teaching after the swap. The changer sits in the splash zone, so it must meet the same washdown rating as the rest of the cell (see [[ip-rating]]).

### Elsewhere
In welding and heavy material handling, the jobs ATI names for its heavy-duty changers [1], a large robot sets one tool down in a tool stand (a rack that holds the tools not in use) and couples to the next with no person involved [5]. At that scale, ATI's QC-510 is rated for 700 kg payloads, with 62,000 N locking force at 5.5 bar, 28.1 kg of its own coupled mass, and servo and high-current modules [4].

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
- **ATI QC-77** — custom washdown-capable changer with stainless steel bodies, food-grade grease, and 0.015 mm repeatability [5].
- **ATI Industrial Automation** — the maker above is, as of 2026, "a Novanta company" [2].

### Common misconception
**Misconception:** Tool changers are only worth it for robots that do many different jobs.

**Reality:** On food lines they can serve a single-job robot, because the tool must come off for cleaning or replacement and come back in exactly the same place; ATI lists quick tool change for food-handling washdown as a use [5]. The value is fast, repeatable removal as much as variety.

### Key numbers
- Repeatability: 0.0152 mm, listed for the ATI QC-46, QC-160, and QC-510 (70 to 700 kg payload) [2][3][4]
- Locking force at 5.5 bar: 5800 N (QC-46) to 62,000 N (QC-510), scaling with size [2][4]
- Added mass: about 3 kg (QC-46) to 28 kg (QC-510) coupled [2][4]
- Gap tolerated while locking: about 2-3 mm, depending on model [2][3]

### Sources
1. [Tool changer features](https://ati-ia.com/products/toolchanger/tool_changer_features.aspx) — ATI Industrial Automation; piston as dowel pin, fail-safe on air loss, utility modules, spring-pin electrical contacts
2. [QC-46 tool changer](https://ati.novanta.com/product/qc-46/) — ATI (Novanta) product page; payload, repeatability, locking force, weight, lock and unlock sensing, no-touch locking gap
3. [QC-160 tool changer](https://ati.novanta.com/product/qc-160/) — ATI (Novanta) product page; payload, repeatability, locking force, air ports, plate separation
4. [QC-510 tool changer](https://ati.novanta.com/product/tool-changers-qc-510/) — ATI (Novanta) product page; payload, locking force, weight, ready sensors, module families
5. [QC-77 Custom Tool Changer installation and operation manual](https://www.ati-ia.com/app_content/Documents/9610-20-1669.pdf) — ATI (PDF); master plate mounts to the robot, tool plate carries the tool; cam-driven steel balls engage a bearing race, flat cam section as fail-safe on air loss; washdown-capable stainless build, food-grade grease, 0.015 mm repeatability; quick tool change for food-handling washdown; tool stand definition
6. [MC-16R Manual Tool Changer manual](https://www.ati-ia.com/app_content/Documents/9620-20-B-MC-16R%20Tool%20Changer%20Manual.pdf) — ATI (PDF); manually driven lock with ratchet knob, quick tool change for maintenance
7. [UR5e technical specification](https://www.universal-robots.com/manuals/latest/en/datasheets/ur5e/) — Universal Robots datasheet, updated October 2026; 5 kg payload

## Force-torque sensor
id: ft-sensor
requires: end-effector
aka: F/T sensor, six-axis force sensor, wrist force sensor, force sensor

### Plain
A force-torque sensor is like a bathroom scale fitted between the robot's wrist and its tool, except it measures pushes and twists in every direction, not just down. With it, the robot can tell how hard it is pressing, whether it has touched something, and how heavy the thing in its hand is. Without one, most robots are numb at the hand.

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
resolution move together, because a body stiff enough to carry large loads flexes less per
newton, so a small force makes a signal closer to the electrical noise. ATI's Mini58 comes in calibrations from 700 N to 2800 N of X/Y
force, with X/Y resolution coarsening from about 1/6 N to 3/4 N [1]. ATI's Delta has a 165 N
calibration with 1/32 N X/Y resolution [2]. Overload limits are 4.9-21 times rated capacity
for the Mini58 and 4.1-18.8 times for the Delta [1][2]. Loads must stay in range on all six
axes at once for readings to be valid, and quoted resolutions are typical values after
discounting four counts (the smallest steps of the digital reading) of electrical noise;
filtering can improve them further [1].

That trade drives sizing: a sensitive sensor has a small range and is easier to destroy in a
crash, so designers pick the coarsest sensor that still resolves what they need. Without any
force sensing, a robot can only follow positions: it cannot press with a set force, stop
gently on contact, or weigh what it holds. Some arms estimate force from their joints instead
(see [[torque-sensing|joint torque sensing]]).

### On the cheese plate line
This line can mostly do without one, which is a useful lesson in itself. One candidate is a double-pick check at the cracker station: a wrapped pack might weigh 10-30 g, about 0.1-0.3 N [unverified: depends on the pack]. The Mini58's smallest metric calibration resolves Fz only to about 7/24 N, roughly 30 g [1], so it cannot reliably tell one pack from two; the Delta's 165 N calibration resolves Fz to 1/16 N, about 6 g [2], which is closer, though readings taken while the arm moves are noisier. Cheaper checks already exist: the vacuum switch catches a missed pick (though not a second pack stuck under the first, since the cup still seals), and the inspection camera can count packs on the tray (see [[inspection|inspection and reject]]). Any sensor here would need a washdown option such as ATI's IP65 or IP68 versions [1].

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
- **ATI Delta** — six-axis sensor; 165-660 N X/Y force calibrations, overload 4.1-18.8 times rated [2].
- **ATI Axia80** — lower-cost sensor with built-in electronics and EtherCAT, Ethernet, or serial output, launched in 2017 [3][4].
- **Universal Robots e-Series** — arms with a force-torque sensor at the tool flange; the UR5e's reads ±50 N with ±3.5 N precision, far too coarse to weigh a cracker pack [5].

### Common misconception
**Misconception:** The most sensitive sensor is the best one.

**Reality:** Resolution trades against range and crash survival [1][2]. A sensor fine enough to weigh a cracker pack has a small range and can be ruined by a single collision, so the right sensor is the coarsest one that still resolves the forces the task needs.

### Key numbers
- Axes: 6 (Fx, Fy, Fz, Tx, Ty, Tz) [1]
- X/Y force range: 165-2800 N across the ATI Mini58 and Delta calibrations, by model and calibration [1][2]
- X/Y force resolution: about 1/32-3/4 N, coarser as range grows [1][2]
- Overload: 4.1-21 times rated capacity, by model and axis [1][2]

### Sources
1. [Mini58 F/T sensor](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58) — ATI Industrial Automation; ranges, resolutions, overload ratio, IP options, silicon strain gauges
2. [Delta F/T sensor](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Delta) — ATI Industrial Automation; ranges, resolutions, overload ratio, NIST-traceable calibration
3. [ATI Industrial Automation's low-cost force/torque sensor Axia80](https://www.newequipment.com/home/product/55103225/24461-ati-industrial-automations-low-cost-torque-sensor-axia80) — New Equipment Digest, October 2017 (trade press); size, weight, interfaces, applications
4. [Axia80-M20 F/T sensor](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Axia80-M20) — ATI Industrial Automation; Ethernet, EtherCAT, and serial interfaces, IP64, calibrations
5. [UR5e technical specification](https://www.universal-robots.com/manuals/latest/en/datasheets/ur5e/) — Universal Robots datasheet, updated October 2026; built-in tool flange force-torque sensor range, precision, and accuracy
