# Showroom

## Robot: six-axis
title: Six-axis arm
concept: six-axis
payload_kg: 1.5-2300
reach_mm: 370-4683
speed: Cycle time 0.42 s on a 25 x 300 x 25 mm loop with 1 kg (small arm, ABB IRB 1100) [3]
height_mm: 1100

### Notes
The default factory arm: car plants use six-axis arms for spot welding and for lifting a whole car, and machine shops use mid-size ones to load parts into machine tools [2]. Its six joints let it reach around things and tilt the tool at almost any angle; the price is more motors, harder joint-angle math, and a slower standard pick loop than a SCARA or delta (0.42 s against about 0.3 s, see [[speed-specs|speed specs]]). On the cheese plate line it is the design choice for the grape station, because bunches lie at random angles in a tote, but the station needs an arm rated for the 2-4 °C room: ABB's hygienic IRB 1200, for example, is rated only down to +5 °C [4]. The ranges span the whole family, from 1.5 kg tabletop arms to 2,300 kg arms [1, 2]; the 1,100 mm drawing height is illustrative, not from a datasheet, so the drawn proportions match no single model.

### Sources
1. [ABB Robotics industrial robots product range](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) — ABB (2023), hosted by a distributor; payload and reach per model
2. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022); payload, reach, and applications per model, up to the 2,300 kg M-2000iA
3. [IRB 1100 datasheet](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) — ABB (Rev. D, December 2019), hosted by a third party; 0.42 s picking cycle with 1 kg
4. [IRB 1200 product specification, operating requirements](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=20) — ABB, via ManualsLib; lowest operating temperature +5 °C

## Robot: scara
title: SCARA
concept: scara
payload_kg: 1-20
reach_mm: 350-1100
speed: Cycle time 0.28-0.33 s on a 25/300/25 mm loop with 2-4 kg [1, 2]
height_mm: 650

### Notes
Common in electronics and battery assembly, where it inserts parts, drives screws, and moves small parts between fixtures; FANUC shows its SR-3iA assembling battery packs [2]. Its two arm joints swing flat, so their motors never hold the arm up against gravity and can spend their torque on acceleration; it is fast and repeats within ±0.01-0.02 mm for top-down work, but its tool always points straight down, so it cannot tilt a part or reach into the side of a machine [1, 2, 4]. On the cheese plate line it is the design choice for the cracker feeder, where packs come flat and stacked, but the IP65 versions Epson and FANUC offer do not carry the IP67 rating the line's spec asks for [1, 5], so it would need a protective cover or a different robot (also a judgment call). Payload is the rated load (some models list a higher maximum), and the 650 mm drawing height is illustrative, not from a datasheet.

### Sources
1. [Epson SCARA GX8 datasheet](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) — Epson Singapore; cycle time, repeatability, IP65 option
2. [FANUC SR-3iA/SR-6iA specifications](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) — FANUC America (2017), hosted by a distributor; cycle time with 2 kg, repeatability, battery-pack example
3. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022); SCARA range payload and reach
4. [ABB Robotics industrial robots product range](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) — ABB (2023), hosted by a distributor; IRB 910INV and IRB 920 payload, reach, repeatability
5. [FANUC SR Series SCARA product info sheet](https://www.fanucamerica.com/cmsmedia/datasheets/SR%20Series%20SCARA%20Robot%20Product%20Info%20Sheet_262.pdf) — FANUC America; food-grade models with IP65

## Robot: delta
title: Delta robot
concept: delta
payload_kg: 0.5-15
reach_mm: 280-1600
reach_text: 280-1,600 mm working diameter as listed [1, 2]
speed: Cycle time 0.26-0.60 s on the 25/305/25 mm loop, depending on payload and variant [1, 3]
height_mm: 1000

### Notes
Hung from a frame over a conveyor in food and packaging plants, picking light items such as confectionery off a moving belt [5]. Its motors sit in the fixed frame and only light arms move, so it accelerates very hard on short picks, but it carries little, works in a shallow zone (about 250-300 mm tall on the ABB IRB 360), and the common 3- and 4-axis versions keep the tool level, so they cannot tilt a part [1]. On the cheese plate line it is the design choice for the apple and cheese stations; the stainless IRB 360 is IP69K validated for washing with detergents and high-pressure hot water, and its 0-45 °C rating covers the 2-4 °C room [1]. Reach here is the working diameter as makers list it, and the 1,000 mm drawing height is illustrative, not from a datasheet.

### Sources
1. [IRB 360 FlexPicker datasheet](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) — ABB (2022); working diameter and height, cycle times, stainless IP69K version, ambient temperature
2. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022); delta range payload and reach
3. [Adept Quattro s650 Robot User's Guide, specifications page](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) — Adept; 0.26 s Adept cycle with 0.1 kg
4. [ABB Robotics industrial robots product range](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) — ABB (2023), hosted by a distributor; IRB 360 and IRB 390 payloads
5. [Robots for the packaging industry](https://library.e.abb.com/public/90cbaf37724492a4c1257b6700492591/Robots%20for%20packaging%20industry_robotics_Discrete%20automation%20and%20motion%20division_ABB.pdf) — ABB brochure (older edition); delta packing applications

## Robot: gantry
title: Gantry robot
concept: gantry
payload_kg: 30-3200
reach_mm: 5000-10000
speed: Travel speed 75-225 m/min per axis (1.25-3.75 m/s), acceleration 2-10 m/s² [1]
height_mm: 2000

### Notes
Spans whole machine bays and logistics areas, loading machine tools, palletizing, and packing; Güdel lists machine loading, palletizing, packaging, assembly, and battery handling among its FP gantry's uses [1]. Each motor drives one straight axis directly, so there is no hard joint-angle math; it carries heavy loads (quoted in newtons and traded against speed) and repeats within ±0.02-0.1 mm, but its frame fills the space above the work and its tool can only come down from above [1, 2]. On the cheese plate line it is the design choice for the outfeed if plates go into open-top racks or cases; sliding plates sideways onto shelves inside a closed trolley would need an arm instead. Reach here is the x-axis stroke of Güdel's FP series, roughly 5-10 m (its y strokes go up to 14 m on one heavy variant and its z strokes are 2-3 m) [1]; the 2,000 mm drawing height is illustrative, not from a datasheet, and is low for an FP gantry, whose vertical axis alone travels 2-3 m.

### Sources
1. [3-Axis Gantry FP](https://www.gudel.com/products/linearaxis/fp) — Güdel; payload in newtons, strokes, speed, acceleration, repeatability, applications
2. [3-Axis Gantry CP](https://www.gudel.com/products/linearaxis/cp) — Güdel; payload, stroke, repeatability

## Robot: cobot
title: Cobot
concept: cobot
payload_kg: 0.5-35
reach_mm: 500-1813
speed: Max TCP (tool tip) speed 3-5 m/s as listed; lower next to people [1, 2, 5]
height_mm: 1000

### Notes
Used where people work nearby or the job moves often, such as machine tending, where the arm is taught by pulling it by hand and moved between machines. Most cobots are six-axis arms that sense contact and cap their speed and force (power and force limiting), which can reduce fencing only if the risk assessment for the whole application allows it, because a blade or sharp part in the gripper can still injure someone [5]. Cobots trade some speed and payload for this, and the listed top speeds are not usable at full value next to people [5]. On the cheese plate line a cobot could fit a shared spot such as a manual rework table (a design judgment), but Universal Robots' g-Series is rated IP65 and ABB's GoFa IP54, not the IP67 the line's spec asks for [3, 6]; the 1,000 mm drawing height is illustrative, not from a datasheet.

### Sources
1. [e-Series](https://universal-robots.com/products/e-series/) — Universal Robots; payload, reach, TCP speed per model
2. [UR Series](https://universal-robots.com/products/ur-series/) — Universal Robots; payload, reach, TCP speed
3. [ABB Robotics industrial robots product range](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) — ABB (2023), hosted by a distributor; GoFa payload and IP54
4. [FANUC Robots Product Overview](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) — FANUC America brochure (2022); CRX payload and reach
5. [Evolution of Safety Requirements in Industrial Robotics: ISO 10218-1/2 (2011 vs. 2025) and Integration of ISO/TS 15066](https://arxiv.org/abs/2602.17822) — Hartmann et al., arXiv preprint (2026); safety judged on the whole application, speed limits set by risk assessment
6. [UR10g-1750 product page](https://universal-robots.com/products/ur10g-1750/) — Universal Robots; all g-Series robots rated IP65

## Robot: mobile-robot
title: Mobile robot (AMR)
concept: mobile-robot
payload_kg: 250-1200
reach_mm: 800
reach_text: Travel limited only by the mapped area; footprint 800 x 580 mm (MiR250) [1]
speed: Travel speed 1.5-2.0 m/s [1, 2, 3]
height_mm: 300

### Notes
Found in warehouses and plants carrying bins, carts, and pallets between fixed points; an AMR (autonomous mobile robot) maps the site and steers around obstacles, while an AGV (automated guided vehicle) follows a fixed route and stops when blocked [4]. It makes material routes reprogrammable without conveyors or forklift drivers, but it parks only to within millimeters (±3 mm at a marker for the MiR250), so an arm mounted on top must re-find its target at every stop [1]. On the cheese plate line AMRs suit moving totes and plate carts around the line (a design judgment), but the MiR250 is rated IP21 and 5-40 °C, so it should stay out of the washdown zone or be parked during cleaning, and it is not rated for the 2-4 °C room [1]. There is no arm reach: the 800 mm shown is the length of the MiR250's 800 x 580 mm footprint, its travel is limited only by the mapped area, and the 300 mm drawing height is illustrative, not from a datasheet [1].

### Sources
1. [MiR250 specifications](https://mobile-industrial-robots.com/products/robots/mir250/specifications) — Mobile Industrial Robots; payload, speed, footprint, docking accuracy, IP rating, operating temperature
2. [MiR1200 Pallet Jack](https://mobile-industrial-robots.com/products/robots/mir1200-pallet-jack) — Mobile Industrial Robots; 1,200 kg payload, 1.5 m/s
3. [Mobile Industrial Robots home page](https://mobile-industrial-robots.com/) — MiR; product range including MiR600 payload and speed
4. [AGV vs AMR: what's the difference?](https://mobile-industrial-robots.com/blog/agv-vs-amr-whats-the-difference) — Mobile Industrial Robots blog (a maker's explainer, not a standard); AGV and AMR definitions

## Robot: humanoid
title: Humanoid robot
concept: humanoid
payload_kg: 2-30
reach_mm: 2200-2300
speed: No pick-cycle figure published; battery runtime 2-4 h [1, 3, 4]
height_mm: 1900

### Notes
As of late 2026 mostly in field tests, early deployments, or development; Boston Dynamics describes Atlas re-sorting parts into the order a car line needs them in a field test at a Hyundai facility [1, 5]. The bet is that a human-shaped body can work in places built for people without changing them, but it needs 23-56 independent joint motions, must balance at all times, carries less than many industrial arms, and runs 2-4 hours per battery [1, 3, 4]. Payload runs from about 2-3 kg per arm (Unitree G1) to 30 kg sustained, 50 kg instantaneous (Atlas); reach is 2.2 m (Digit 5, preliminary) to 2.3 m (Atlas); and none of these makers publishes repeatability or a pick-cycle time, so a humanoid cannot yet be compared with an arm on those specs [1, 2, 3]. It has no station on the cheese plate line (a design judgment), since each station is a fixed top-down task in a washdown room and the sources checked show no humanoid rated for food washdown; it is drawn at Atlas's listed 1.9 m height [1].

### Sources
1. [Atlas](https://bostondynamics.com/products/atlas/) — Boston Dynamics; DoF, payload, reach, height, battery, Hyundai field test
2. [Digit 5](https://www.agilityrobotics.com/solutions/digit-5) — Agility Robotics; preliminary payload and reach
3. [Unitree G1](https://www.unitree.com/g1) — Unitree; height, DoF, arm payload, runtime
4. [Unitree H2](https://www.unitree.com/H2) — Unitree; DoF, arm payload, runtime
5. [Getting Real with Humanoids](https://bostondynamics.com/blog/getting-real-with-humanoids/) — Boston Dynamics blog (2025); what part sequencing involves
