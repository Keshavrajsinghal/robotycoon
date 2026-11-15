---
area: 12
slug: industry-map
title: Industry map
---

# Industry map

This area is a map of the companies that make up the robotics industry and of who pays whom. A working robot line is never the product of one company. Parts makers build gears, motors, grippers, and cameras. Robot makers turn some of those parts into arms with controllers. Integrators buy arms and everything around them and build one line for one plant. The plant, the end user, pays for all of it. Newer kinds of companies cut across these layers: application companies that sell a finished robot station for one job, model companies that train the learned "brains", and tooling companies that sell software to everyone else.

On the cheese plate line, this is the cast list. An airline caterer is the end user. A food-specialized integrator, or an application company that already sells food-assembly robots, builds the stations. A robot maker supplies the four pick arms. Component makers supply the gears inside those arms and the vacuum cups and soft fingers on the end of them. Tooling companies supply the simulation and data software used to design and debug the line. Each company-type concept below lists what that kind of company sells, who it buys from and sells to, the jobs inside it, and real examples checked as of November 2026.

## Who buys from whom
id: value-chain
requires: none
aka: robotics value chain, supply chain, industry structure, money flow, product flow

### Plain
Building a robot line is like building a house. Mills and factories make the lumber, windows, and furnace; a general contractor buys them, designs the house for one family, and builds it; the family pays for everything and then lives there. In robotics, parts makers sell to robot makers, robot makers sell to the companies that build whole lines, and the plant that runs the line pays the bill.

### Where the analogy breaks
A house mostly stops costing money once it is built, while a robot line keeps buying spare parts, service, and software updates for years, and sometimes pays a recurring fee for robots it never owns. Some newer companies also skip the contractor and sell a finished station straight to the plant; unlike a prefab house, the seller often keeps watching, servicing, and updating it after delivery.

### Precise
Product flows downstream (toward the plant that uses it) and money flows upstream (back toward the parts makers). The main layers:

1. **Component makers** sell joint parts (gearboxes, motors, encoders, brakes) to robot makers as OEM supply (parts built into another company's branded product), and sell end-of-arm parts (grippers, vacuum cups, cameras) through catalogs to integrators and plants.
2. **Robot makers** sell an arm, its controller (the computer cabinet that drives the motors), and its teach pendant (the handheld terminal used to program it). They sell directly to large plants and through networks of approved integrators: FANUC, for example, sends buyers to its Authorized System Integrators, who "design, build, and support" custom robot systems [3].
3. **Integrators** buy robots and all the surrounding equipment, add engineering, and sell a turnkey system (one delivered ready to run) to the plant, usually as a project with agreed acceptance tests (checks the system must pass before the buyer accepts and pays for it).
4. **End users** pay capex (a large one-time purchase recorded as an asset) for the system, then opex (ongoing running costs) for spare parts, service contracts, and software.

Three newer layers cut across this chain. Application companies sell a standard station for one task, often by subscription. Chef Robotics, for instance, leases food-assembly robots under robots-as-a-service (a recurring fee that covers the hardware, software, updates, and field service) [4]. Model companies train learned models and license or publish them to robot makers and application companies. Tooling companies sell simulation, programming, and data software to every layer.

The robot arm is a minority of the money. The International Federation of Robotics (IFR, the industry's statistics body) estimated 2018 worldwide robot sales at US$16.5 billion, but about US$50 billion for complete robot systems once software, peripherals (grippers, sensors, conveyors, guarding), and systems engineering are included, so the robot itself was about a third [2]. If you do not know this structure you call the wrong company: a robot maker sells you an arm, not a line. Volumes are large and concentrated: factories installed more than 600,000 industrial robots in 2025, and China took 59% of them [1].

### On the cheese plate line
Follow the money backward from a finished plate. The airline caterer (end user) wants 200 plates an hour (one every 18 s) and pays a food-specialized integrator for the line. The integrator buys four pick robots from a robot maker, vacuum cups for the apple slices and cracker packs, soft fingers for the grape bunches, cameras for each pick station, a PLC (the industrial computer that sequences the line), conveyors, and a tray denester and lidder from packaging-machine makers. The robot maker, in turn, has paid gear and motor suppliers for the parts inside each arm. Using the IFR ratio as a rough guide, for every dollar the four arms cost, about two more go to grippers, vision, conveyors, guarding, and engineering (illustrative arithmetic from [2], not a quote). A different path skips the integrator for the pick stations: Chef Robotics lists airline catering among its industries and leases its stations for a fee instead of selling them [4].

### Elsewhere
In grocery warehouses, Symbotic builds automated warehouse systems for customers such as Walmart, Target, Albertsons, and C&S Wholesale Grocers, and for some of them also runs the system [5]. It reported US$2.25 billion of revenue in fiscal 2025, the year to September 2025 [6]. It plays robot maker, integrator, and software company at once, which is called vertical integration (one company covering several layers of the chain). The warehouse operator still pays at the end, but to one company instead of four.

### Why it exists
Each layer needs a different kind of business. Grinding gears to micrometer tolerances needs a high-volume precision factory; designing a line for one plant needs local engineers who can visit the site; few companies are good at both. Splitting the work lets one gear maker sell to many robot makers, and lets one integrator use whichever robot brand fits the job.

### Connects to
- [[component-makers]] — the start of the product flow, and the last stop for the money.
- [[robot-makers]] — the layer most people picture as "the robotics industry".
- [[integrators]] — where most of the system money lands, as engineering plus the equipment chosen around the robot.
- [[application-companies]] — the newer path that sells a finished station instead of a project.
- [[end-users]] — the only layer whose money comes from outside the robotics industry.

### Real products and tools
- **IFR World Robotics** — the annual statistics report on robot installations by country and industry; its 2026 edition covers 2025 [1].
- **FANUC Authorized System Integrator network** — a directory that links buyers to independent integrators approved for FANUC robots [3].
- **Chef Robotics robots-as-a-service** — a lease that bundles robot hardware, software, AI updates, field service, and monitoring into one fee [4].

### Common misconception
**Misconception:** Buying automation means calling a robot company and receiving a working machine.

**Reality:** A robot maker ships an arm and a controller that do nothing useful until someone adds a gripper, sensors, safety equipment, programs, and connections to the rest of the line. In the IFR's 2018 estimate that surrounding work and equipment was about two thirds of total robot-system spending [2].

### Key numbers
- New industrial robots installed in 2025: more than 600,000; operational stock about 5 million [1].
- China's share of 2025 installations: 59%; Chinese robot makers held 55% of their home market [1].
- Robot versus complete-system spending, 2018: US$16.5 billion versus about US$50 billion [2]. The share depends on the job: a simple palletizer needs little around the robot, while a vision-guided food pick station needs much more.

### Sources
1. [Five Million Robots now Operate in Factories Globally](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) — International Federation of Robotics, September 2026; 2025 installations, operational stock, country shares, Chinese domestic share.
2. [Robot Investment reaches record 16.5 billion USD](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) — International Federation of Robotics, September 2019; 2018 robot sales (US$16.5 billion) and about US$50 billion once software, peripherals, and systems engineering are included.
3. [FANUC Authorized System Integrators: Robotics](https://www.fanucamerica.com/integrators/robotics) — FANUC America; integrators design, build, and support custom robot systems.
4. [Chef Robotics](https://www.chefrobotics.ai/) — Chef Robotics; industries served including airline catering, robots-as-a-service terms.
5. [Symbotic Form 10-K, fiscal year ended September 27, 2025](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) — Symbotic, filed with the US SEC; what it does, named customers, operation services.
6. [Symbotic Reports Fourth Quarter and Fiscal Year 2025 Results](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000277/q4258-k_ex991.htm) — Symbotic, November 24, 2025 (SEC Form 8-K exhibit); fiscal 2025 revenue of US$2,247 million.

## Component makers
id: component-makers
requires: value-chain, joint-stack
aka: parts suppliers, tier suppliers, reducer makers, end-of-arm tooling makers, EOAT

### Plain
Component makers are the parts suppliers of the robot world, like the companies that make gearboxes, brakes, and tires for car brands. They build the gears, motors, sensors, grippers, and cameras that go inside or onto a robot. Most people never see their names, but no robot works without them.

### Where the analogy breaks
Most car parts reach the driver already fitted by the car brand. Robot parts split in two: joint parts go to the robot maker, but grippers, cameras, and sensors are usually bought separately by the integrator or the plant and bolted onto any brand of robot, because the tool on the end changes with every job.

### Precise
The first group sits inside the arm: precision reducers (gearboxes that trade motor speed for turning force, or torque, with almost no play), servo motors (motors driven in a feedback loop so they can hold an exact angle), encoders (sensors that measure joint angle), brakes, bearings, and servo drives (the electronics that feed current to the motor). These are sold to robot makers under long supply contracts, and the market for reducers is concentrated. Nabtesco estimates it holds about 60% of the global market for the precision reduction gears used in the joints of medium and large industrial robots [1]. Harmonic Drive Systems makes strain wave gears (compact gears with zero backlash, meaning no slack between the teeth, built around a flexing steel cup), sold for collaborative robots (arms built to work safely next to people), 6-axis robots (the common jointed arm with six joints), and SCARA robots (fast arms that work mostly in a flat plane), and also sold as complete actuators with the motor built in [2][7]. Not every joint part is bought in, though: some robot makers are big motor makers themselves. FANUC sells servo systems alongside its CNC controls (the computers that run machine tools) [9], and Yaskawa lists servo motors next to industrial robots in its product range [10].

The second group goes on or around the arm: grippers, vacuum cups, tool changers (couplings that let a robot swap tools automatically), force-torque sensors (sensors that measure push and twist at the wrist), cameras, and onboard computers. These are sold through catalogs, distributors, and integrators, usually with mounting plates and software plug-ins for several robot brands. ATI Industrial Automation, now a Novanta brand, sells tool changers and force-torque sensors [3]. Robotiq sells grippers, sensors, and wrist cameras, and now also complete workcells for palletizing and machine tending [4]. NVIDIA sells Jetson Thor onboard computers for running learned models on the robot [6].

Component makers are moving up the chain (selling actuators and whole cells instead of parts), and they get bought and sold like any other business. In August 2024 Soft Robotics sold its gripper business, including its mGrip food-handling fingers, to the vacuum specialist Schmalz, and the remaining company became Oxipital AI, a vision-inspection firm [5].

### On the cheese plate line
Inside each of the four pick robots, reducers sit in every joint. On the end of each arm, the parts are chosen per ingredient: vacuum cups for the apple slices (about four per plate) and the cracker packs, soft fingers for the grape bunch, and an electric gripper with V-notched, food-grade plastic fingers for the three cheese wedges (a judgment call; a suction cup on the wedge's flat top is the other common choice, see [[vacuum-gripper]]). Everything at the end of the arm touches food and gets washed down in a 36-40 F room, so the integrator picks from food-grade catalog lines. The grape station's soft fingers make the ownership point concrete: an mGrip spare-parts order placed in 2023 went to Soft Robotics, but after August 2024 it goes to Schmalz [5].

### Elsewhere
In a car or metal-parts factory, one robot can switch between a gripper and a welding gun using an automatic tool changer, whose two halves lock together and pass air, electrical signals, and water across the joint [11]. A robot that grinds or polishes metal carries a force-torque sensor at the wrist so it can measure how hard it is pressing [12]. ATI sells both kinds of product [3]. The large robots doing that work typically have RV-type precision reducers in their main joints, the product Nabtesco claims most of the market for [1].

### Why it exists
Precision reducers, motors, and sensors need specialized factories and years of process know-how, and selling the same part to many robot makers spreads that cost. Grippers and cameras exist as a separate business because the tool on the end of the arm is specific to each product being handled, while the arm is generic.

### Connects to
- [[gearbox]] — the reducer is the most concentrated joint component.
- [[servo-motor]] — motors and drives are the other core joint purchase.
- [[end-effector]] — the gripper market is where most integrator-facing component sales happen.
- [[robot-makers]] — the main customer for joint components.
- [[on-robot-inference]] — onboard GPUs are a new component category driven by learned models.

### Real products and tools
- **Nabtesco RV reducers** — precision reduction gears for medium and large industrial robot joints [1].
- **Harmonic Drive strain wave gears and actuators** — compact zero-backlash gears, also sold with motors as integrated actuators [2][7].
- **ATI tool changers and force-torque sensors** — robot accessories sold to integrators and end users [3].
- **Robotiq grippers and workcells** — adaptive and vacuum grippers, force-torque sensor, wrist camera, and palletizing and machine-tending cells [4].
- **Schmalz mGrip** — soft fingers for food handling, acquired from Soft Robotics in 2024 [5].
- **NVIDIA Jetson Thor** — onboard computer used to run learned robot models [6].

### Common misconception
**Misconception:** A robot brand builds its robots from scratch.

**Reality:** Even the biggest brands buy key parts. If Nabtesco's own estimate is right, most medium and large industrial robots contain its reducers whatever the logo on the arm says [1].

### Key numbers
- Nabtesco's share of precision reduction gears for medium and large industrial robot joints: about 60%, by its own estimate [1].

### Sells
Precision reducers, servo motors, encoders, brakes, bearings, and drives; integrated actuators (gear, motor, and encoder in one unit); grippers, vacuum cups, tool changers, and force-torque sensors; industrial cameras and depth sensors; onboard computers; spare parts for all of these.

### Buys from
Steel, magnet, and electronics suppliers; machine-tool makers for grinding and machining equipment; chip makers for drives, sensors, and computers; contract manufacturers; tooling companies for CAD and engineering software.

### Sells to
Robot makers (long-term supply contracts for joint parts); integrators and distributors (catalog end-of-arm parts); end users (spares and retrofits); application companies that build their own robots or cells.

### Job functions
- **Mechanical design engineer** — designs gear teeth, bearings, and housings, and runs stiffness and lifetime calculations.
- **Application engineer** — helps a customer's engineers size the right gear, motor, or vacuum cup for their load and speed, and answers technical questions.
- **Manufacturing process engineer** — runs the grinding, heat-treating, and assembly lines that hold micrometer tolerances, and fixes yield problems.
- **Quality engineer** — measures backlash and stiffness on finished units, runs life tests, and investigates customer returns.
- **Firmware engineer** — writes the code inside smart sensors, drives, and encoders.
- **Supply chain planner** — turns robot makers' build forecasts into production plans and manages long lead times on steel and electronics.
- **Key account manager** — owns the relationship with a few large robot makers and negotiates annual volume and price.
- **Channel sales representative** — sells catalog grippers and sensors through distributors and to integrators, and runs product demos.
- **Field service technician** — visits plants to diagnose a failed gripper, sensor, or gear unit and replace it.
- **Product manager** — decides what to build next, such as a washdown-rated version of a gripper for food plants.

### Example companies
- **Nabtesco** (Japan) — RV precision reducers; claims about 60% of the medium-to-large robot reducer market [1].
- **Harmonic Drive Systems** (Japan) — strain wave gears, gear heads, and actuators; Harmonic Drive LLC serves North America [2][7].
- **ATI Industrial Automation** (US) — tool changers and force-torque sensors; listed as a brand of Novanta on Novanta's site [3][8].
- **Robotiq** — cobot grippers, sensors, cameras, and workcells [4].
- **Schmalz** (Germany) — vacuum gripping; bought Soft Robotics' gripper business, including mGrip, in August 2024; Soft Robotics is now Oxipital AI [5].
- **NVIDIA** (US) — Jetson Thor onboard compute for robots [6].

### Sources
1. [Precision Reduction Gears](https://www.nabtesco.com/en/products/robot/) — Nabtesco; RV product lines, about 60% share estimate for medium-to-large industrial robot joints.
2. [Harmonic Drive Systems Inc.](https://www.hds.co.jp/english/) — Harmonic Drive Systems; strain wave gearing, actuators, robot applications.
3. [ATI Industrial Automation](https://www.ati-ia.com/) — ATI; tool changers, force-torque sensors, and other robot accessories.
4. [Robotiq](https://robotiq.com/) — Robotiq; components, software, and workcells for cobots.
5. [Soft Robotics transforms into Oxipital AI](https://www.softroboticsinc.com/) — Oxipital AI; August 6, 2024 divestiture of the gripper business to the Schmalz Group, mGrip shown under Schmalz.
6. [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) — NVIDIA; Jetson Thor as onboard compute for robot models.
7. [Harmonic Drive LLC](https://www.harmonicdrive.net/) — Harmonic Drive LLC; North American products and service, zero-backlash strain wave gears, actuators with gearing, motors, and encoders.
8. [Novanta](https://www.novanta.com/) — Novanta; lists ATI among its product brands.
9. [FANUC America](https://www.fanucamerica.com/) — FANUC America; "Precision CNC controls and servo systems" alongside robots.
10. [Yaskawa company profile](https://www.yaskawa-global.com/company/profile) — Yaskawa Electric; servo motors, AC drives, and industrial robots listed as product lines.
11. [Robotic Tool Changers](https://www.ati-ia.com/products/toolchanger/robot_tool_changer.aspx) — ATI Industrial Automation; automatic change of grippers, welders, or deburring tools, with air, electrical signals, and water passed through.
12. [Multi-Axis Force/Torque Sensors](https://www.ati-ia.com/products/ft/sensors.aspx) — ATI Industrial Automation; six-axis force and torque measurement for robotic assembly, grinding, and polishing.

## Robot makers
id: robot-makers
requires: value-chain, robot-controller
aka: robot OEMs, robot manufacturers, robot brands, cobot makers

### Plain
A robot maker is like an engine maker that sells engines to boat builders. It designs and builds the arm and the control cabinet that drives it, but on its own the arm does nothing useful: someone still has to give it a hand, eyes, a job, and a place in a line. The big brands sell the same arm to thousands of different factories.

### Where the analogy breaks
An engine maker sells mostly through boat builders, but robot makers also sell straight to large plants and increasingly sell ready-made kits or complete solutions themselves. Each robot brand also has its own controller and programming language, so a plant that picks a brand is buying into a whole ecosystem of trained technicians and spare parts, which is a much stickier choice than an engine.

### Precise
A robot maker designs the mechanism (links, joints, cabling), writes the controller software (motion planning; servo control, the fast loop that keeps each motor at its commanded angle; and built-in safety functions), assembles and tests each unit, certifies it against the main [[safety-standards]], and sells arm, controller, and teach pendant (the handheld programming terminal) as one product. Each brand uses its own language: offline programming tools such as RoboDK need a separate translator for ABB RAPID, FANUC, KUKA KRC, Yaskawa Motoman Inform, and Universal Robots programs [9]. So moving a cell from one brand to another means rewriting its programs, not just swapping the arm.

Robot makers sell through several channels at once: direct sales teams for large automotive and electronics customers, approved integrator networks for everyone else [3], and partner marketplaces. Universal Robots' UR+ program, started in 2016, lets third parties build and sell grippers and software compatible with its cobots [4]. FANUC reports more than 1 million robots installed worldwide [10], and Universal Robots says it has sold more than 100,000 cobots [16].

Ownership has consolidated into larger groups, often outside robotics. Midea, an appliance maker, owns KUKA [6]; Teradyne, a Nasdaq-listed maker of chip-test equipment, owns Universal Robots and MiR [4][8][17]; Hyundai Motor Group controls Boston Dynamics [18]. In China, domestic makers supplied 55% of the 354,000 robots installed in 2025 [1]. Without robot makers, every integrator would have to design its own arm, controller, and safety certification, which takes years of engineering per product line.

### On the cheese plate line
The four pick stations need hygienic robots that survive washdown in a cold room. FANUC, for example, sells the DR-3iB/6 STAINLESS, which it calls its first stainless steel food-grade delta robot for picking and packing primary food, and a CRX-30iA Food Grade cobot with a 30 kg payload [2]. The cheese station needs only about 10 wedge placements a minute (3 wedges in each 18 s takt, the time budget per plate), well within either robot's speed. The CRX-30iA's 30 kg payload is far more than a wedge needs: here the deciding specs are hygiene, washdown survival, and reach, not strength. The robot maker supplies the arm, controller, food-grade lubricant option, documentation, and spare parts; it does not supply the grape fingers, the camera recipe, or the PLC logic that hands trays from station to station. Those come from the integrator.

### Elsewhere
Boston Dynamics shows an end user owning a robot maker. Hyundai Motor Group agreed in December 2020 to buy an 80% stake [7] and completed the deal in June 2021, with a SoftBank affiliate keeping the other 20% [18]. Boston Dynamics sells Spot for industrial inspection and Stretch for handling cases in warehouses, and describes its electric Atlas humanoid as the start of its journey to a commercial humanoid product [11]; it also announced an expanded manufacturing collaboration with Hyundai Motor Group [11].

### Why it exists
An arm and controller need years of mechanical, electrical, and software engineering, plus safety certification and a global service network. Only by selling the same design to thousands of customers in many industries can a company pay for that.

### Connects to
- [[component-makers]] — robot makers buy reducers, motors, and encoders rather than making all of them.
- [[integrators]] — the main sales channel for everyone except the largest plants.
- [[vendor-languages]] — each brand's own language is a large part of customer lock-in.
- [[robot-controller]] — the controller is as much the product as the arm.
- [[cobot]] — cobot makers changed the channel by selling to smaller plants and through marketplaces.

### Real products and tools
- **FANUC DR-3iB/6 STAINLESS** — stainless steel food-grade delta robot for primary food picking and packing [2].
- **FANUC CRX-30iA Food Grade** — food-grade collaborative robot, 30 kg payload [2].
- **Universal Robots cobots and UR+** — collaborative arms plus a platform for compatible third-party accessories and software [4].
- **Boston Dynamics Spot and Stretch** — a legged inspection robot and a warehouse case-handling robot [11].

### Common misconception
**Misconception:** Robot makers compete mainly on arm specs such as speed, reach, and payload.

**Reality:** Specs among the top brands overlap heavily for most jobs. Because each brand has its own controller and language [9], plants often pick the brand their integrators, technicians, and spare-parts shelves already support [unverified: common industry practice, no survey found].

### Key numbers
- FANUC robots installed worldwide: more than 1 million [10].
- Universal Robots cobots sold: more than 100,000 [16].
- Chinese makers' share of China's 2025 installations: 55%, of 354,000 units [1].
- Size of a large robot maker: ABB Robotics had about 7,000 employees and US$2.3 billion revenue in 2024 [5]; KUKA reports about 14,500 employees and EUR 3.9 billion sales across robotics and logistics automation [12].

### Sells
Robot arms with controllers and teach pendants; mobile robots and cobots; options such as food-grade or cleanroom versions; programming and simulation software; training courses; spare parts, repair, and service contracts; increasingly, standard kits and complete cells.

### Buys from
Component makers (reducers, motors, encoders, brakes, bearings, cables); electronics and chip suppliers for controllers; casting and machining suppliers for arm structures; tooling companies for CAD, simulation, and software tools.

### Sells to
Integrators (the main channel for most plants); large end users directly (automotive, electronics, logistics); distributors; application companies that build products on top of standard arms; universities and research labs.

### Job functions
- **Mechanical design engineer** — designs arm links, joints, and cable routing, and trades off weight, stiffness, and reach.
- **Motion control software engineer** — writes the trajectory and servo-control code that runs in the controller.
- **Safety engineer** — designs safety functions such as speed and force limits and documents compliance with robot safety standards.
- **Manufacturing technician** — assembles, calibrates, and tests each robot before it ships.
- **Application engineer** — runs reach and cycle-time studies and test picks to prove a robot can do a customer's job.
- **Channel manager** — recruits, trains, and supports the network of approved integrators.
- **Field service engineer** — travels to plants to repair robots, replace reducers or motors, and restore production.
- **Training instructor** — teaches customers and integrators to program and maintain the brand's robots.
- **Product manager** — decides which models and options to build, such as a stainless washdown version.
- **Regional sales manager** — owns sales to large accounts and integrators in a territory.

### Example companies
- **FANUC** (Japan) — independent and listed on the Tokyo Stock Exchange; robots, CNC controls, and machine tools; more than 1 million robots installed [10][13].
- **ABB Robotics** (part of ABB, Switzerland) — still part of ABB as of November 2026. ABB agreed in October 2025 to sell it to SoftBank Group for an enterprise value of US$5.375 billion [5]. In November 2026 ABB said China's foreign-investment security review had prohibited the acquisition of the ABB Robotics business in China, and that ABB and SoftBank were still working on the transaction [15].
- **KUKA** (Germany) — owned by Midea Group: control from January 2017 (a 94.55% stake), remaining shares squeezed out in November 2022; KUKA also owns Swisslog and Visual Components [6].
- **Universal Robots** (Denmark) — owned by Teradyne since 2015 (US$285 million); grouped with MiR as Teradyne Robotics [4][8].
- **Boston Dynamics** (US) — Hyundai Motor Group holds 80% and a SoftBank affiliate 20% [18]; Rohit Prasad, formerly an Amazon AI executive, became CEO in October 2026 [19].
- **Stäubli** (Switzerland) — robotics is one of four divisions, alongside electrical connectors, fluid connectors, and textile machinery [14].

### Sources
1. [Five Million Robots now Operate in Factories Globally](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) — International Federation of Robotics, September 2026; China installations and domestic share.
2. [Food and beverage](https://www.fanucamerica.com/industries/food-beverage) — FANUC America; DR-3iB/6 STAINLESS and CRX-30iA Food Grade descriptions.
3. [FANUC Authorized System Integrators: Robotics](https://www.fanucamerica.com/integrators/robotics) — FANUC America; integrator network.
4. [Universal Robots](https://en.wikipedia.org/wiki/Universal_Robots) — Wikipedia; Teradyne acquisition in 2015 for US$285 million, UR+ in 2016.
5. [ABB divests Robotics division to SoftBank Group for $5.375B](https://www.robotics247.com/article/abb_divests_robotics_division_to_softbank_group_for_5.375b/abb_group) — Robotics 24/7, October 8, 2025; enterprise value, about 7,000 employees, US$2.3 billion 2024 revenue.
6. [KUKA](https://en.wikipedia.org/wiki/KUKA) — Wikipedia; Midea takeover in 2017, squeeze-out in 2022, Swisslog and Visual Components.
7. [Boston Dynamics](https://en.wikipedia.org/wiki/Boston_Dynamics) — Wikipedia; December 2020 Hyundai agreement.
8. [Teradyne Robotics](https://www.teradyne.com/robotics/) — Teradyne; "the company behind Universal Robots and MiR".
9. [RoboDK](https://robodk.com/) — RoboDK; separate post processors for ABB RAPID, FANUC, KUKA KRC, Motoman Inform, and Universal Robots.
10. [FANUC America](https://www.fanucamerica.com/) — FANUC America; "1M+" FANUC robots installed worldwide.
11. [About Boston Dynamics](https://bostondynamics.com/about/) — Boston Dynamics; Spot, Stretch, and Atlas product descriptions.
12. [About KUKA](https://www.kuka.com/en-de/company/about-kuka) — KUKA; employees, sales, product areas.
13. [FANUC](https://en.wikipedia.org/wiki/Fanuc) — Wikipedia; independence from Fujitsu in 1972, Tokyo listing, product lines.
14. [Stäubli](https://en.wikipedia.org/wiki/St%C3%A4ubli) — Wikipedia; headquarters and four divisions.
15. [Update on divestment of ABB Robotics](https://resources.news.e.abb.com/attachments/published/140154/en-US/0A15DBC92198/20261105_Update_on_divestment_of_ABB_Robotics_EN.pdf) — ABB press release, November 5, 2026; China's foreign-investment security review prohibited the acquisition of the ABB Robotics business in China, ABB and SoftBank still working on the transaction.
16. [Universal Robots](https://www.universal-robots.com/) — Universal Robots; "Over 100,000 Sold Worldwide", UR+ marketplace.
17. [Teradyne Investor Relations](https://investors.teradyne.com/) — Teradyne; Nasdaq listing (TER), test equipment and robotics businesses.
18. [Hyundai Motor Group Completes Acquisition of Boston Dynamics from SoftBank](https://bostondynamics.com/news/hyundai-motor-group-completes-acquisition-of-boston-dynamics-from-softbank/) — Boston Dynamics, June 21, 2021; 80% Hyundai, 20% SoftBank affiliate.
19. [Boston Dynamics appoints former Amazon executive Rohit Prasad as new CEO](https://www.therobotreport.com/boston-dynamics-appoints-former-amazon-executive-rohit-prasad-new-ceo/) — The Robot Report, October 6, 2026; appointment effective the next day.

## System integrators
id: integrators
requires: robot-makers, plc
aka: SI, systems integrator, robot integrator, machine builder, automation integrator

### Plain
A system integrator is the general contractor of automation. Like a contractor who buys lumber, windows, and a furnace from different makers and builds one family's house to fit their lot, an integrator buys a robot, grippers, cameras, conveyors, and safety fencing and builds one working line for one plant. It also programs all the pieces to work together and stays on call when something breaks.

### Where the analogy breaks
A house builder works from mature building codes and familiar designs, while an integrator often builds something that has never been built exactly that way, so a big part of the job is proving it will work before the customer commits. The integrator usually also signs up to hit a promised rate, such as plates per hour, which a house builder never does.

### Precise
An integrator turns parts into a cell (a guarded work area where one or more robots do a job) or a whole line. A typical project runs through scoping and a feasibility test, then design (mechanical CAD, meaning computer models of every frame and part; electrical design; a safety risk assessment), building and debugging the system in the integrator's own shop, a FAT (factory acceptance test: the customer watches the system run at the integrator's shop against agreed criteria), shipping and installation, a SAT (site acceptance test: the same check in the customer's plant), and ramp-up and support (see [[acceptance-tests]]).

Its revenue mixes hardware bought and resold with engineering hours. The IFR's estimate that complete robot systems cost about three times as much as the robots in them [2] shows how much of a project lies outside the arm. FANUC describes its approved integrators as firms that "design, build, and support custom robotic systems" [1]. Most projects are priced as a fixed sum with payments tied to milestones such as design approval, FAT, and SAT, so the integrator carries the risk of overruns [unverified: common contract practice, no published survey found].

The industry is a long tail of small local firms plus a few large groups. Robot makers maintain approved networks: FANUC's directory lists firms such as CKC Automation in Oakland and Aslin Automation in Livermore, California [1]. At the large end, Toyota Automated Logistics combined Bastian Solutions, Vanderlande's warehousing business, and viastore under one brand on April 1, 2026 [3]. Specialization by industry matters as much as size: a food integrator knows washdown, hygienic design, and allergen changeovers, which an automotive welding integrator may not.

### On the cheese plate line
The caterer asks several integrators to quote the line. The winner first runs grasp tests on real grapes, apple slices, cracker packs, and cheese wedges at 36-40 F, because chilled food grips differently than room-temperature samples. It then designs all eight stations, chooses the robots and grippers, writes the PLC program that passes each tray from the denester through the four pick stations, inspection, and lidding, and builds the line in its own shop. At FAT the caterer's engineers might ask to see 200 plates an hour sustained for a full shift, with every reject logged; the same test is repeated at SAT in the caterer's cold room (illustrative acceptance criteria).

### Elsewhere
In a grocery distribution center, Toyota Automated Logistics integrates conveyors and sortation, automated storage and retrieval systems, mobile robots, palletizing robots, and the warehouse control software that ties them together [3]. The equipment comes from many makers, but the customer holds one integrator responsible for the whole system's throughput.

### Why it exists
Every plant differs in layout, products, rates, existing machines, and staff skills, so someone must do custom engineering for each one. Robot makers cannot afford to staff local engineers for every small project, and most plants do not employ their own automation teams, so a local, multi-brand engineering firm fills the gap and takes on the project risk.

### Connects to
- [[robot-makers]] — integrators are the main sales channel for most robot brands.
- [[end-users]] — the integrator's customer, who sets the acceptance criteria.
- [[cell-design]] — the integrator's core engineering work.
- [[acceptance-tests]] — FAT and SAT decide when the integrator gets paid.
- [[plc-programming]] — much of an integrator's software work is PLC code, not robot code.

### Real products and tools
- **FANUC Authorized System Integrator directory** — finds approved integrators near a plant [1].
- **RoboDK** — offline programming and simulation for more than 1,400 robots from over 80 makers, used to design and program a cell before the hardware arrives [5].
- **Visual Components** — manufacturing simulation and offline programming software, owned by KUKA since 2017 [6].

### Common misconception
**Misconception:** An integrator is a middleman that marks up robots.

**Reality:** An integrator sells engineering: grasp testing, safety design, PLC and robot programs, and on-site installation and commissioning, and it takes responsibility for the whole system working [1]. In the IFR's 2018 estimate, about two thirds of robot-system spending lay outside the robot itself, in software, peripherals the integrator chooses and buys, and systems engineering [2]; reselling the robot is the smaller part of the job.

### Key numbers
- Robot versus complete-system spending, 2018: US$16.5 billion versus about US$50 billion, leaving about two thirds for everything an integrator adds or buys [2].

### Sells
Turnkey robot cells and lines; feasibility studies and test picks; mechanical, electrical, and safety design; PLC, HMI (the operator touch screen), and robot programming; installation and commissioning; operator and maintenance training; service contracts and upgrades.

### Buys from
Robot makers (often as an approved integrator); component makers and distributors (grippers, cameras, sensors, safety devices); conveyor and packaging-machine makers; electrical and machining suppliers; tooling companies (simulation and offline programming software).

### Sells to
End users: plants in automotive, food, consumer goods, life sciences, and logistics. Sometimes application companies, which hire integrators to install their stations into a larger line.

### Job functions
- **Sales engineer** — visits the plant, understands the problem, and turns it into a scope and price.
- **Project manager** — runs schedule, budget, and customer communication from order to final acceptance.
- **Mechanical designer** — designs frames, guarding, grippers, and fixtures in CAD.
- **Controls engineer** — writes PLC and HMI programs and designs the electrical and safety circuits.
- **Robot programmer** — teaches robot paths, sets up vision, and tunes cycle time.
- **Vision engineer** — selects cameras and lighting and builds the inspection and guidance recipes.
- **Panel builder** — wires the electrical control cabinets in the shop.
- **Field commissioning technician** — installs the system at the plant and gets it running through the site acceptance test.
- **Service technician** — answers breakdown calls and does preventive maintenance after handover.
- **Business development manager** — finds new customers and keeps the relationship with robot makers.

### Example companies
- **Toyota Automated Logistics** — warehouse automation integrator formed April 1, 2026 from Bastian Solutions, Vanderlande's warehousing business, and viastore; a Toyota Industries business, judging by its site's link to Toyota Industries Corporation [3].
- **ATS Corporation** — automation company listed on the Toronto and New York stock exchanges, serving life sciences, food and beverage, transportation, consumer products, and energy [4].
- **JR Automation** — automated manufacturing and robotic system integrator, acquired by Hitachi in 2019 [7].
- **CKC Automation and Aslin Automation** (California) — examples of small local FANUC Authorized System Integrators [1].

### Sources
1. [FANUC Authorized System Integrators: Robotics](https://www.fanucamerica.com/integrators/robotics) — FANUC America; integrators design, build, and support systems; example integrator listings.
2. [Robot Investment reaches record 16.5 billion USD](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) — International Federation of Robotics, September 2019; 2018 robot sales versus about US$50 billion for complete systems.
3. [Toyota Automated Logistics](https://toyota-automated-logistics.com/) — Toyota Automated Logistics; April 2026 combination, services, technologies, industries.
4. [ATS Corporation](https://atsautomation.com/) — ATS; markets served and stock listings.
5. [RoboDK](https://robodk.com/) — RoboDK; offline programming, robot library size.
6. [About Visual Components](https://www.visualcomponents.com/company/about-us/) — Visual Components; acquired by KUKA in December 2017, manufacturing simulation and offline programming software.
7. [About JR Automation](https://www.jrautomation.com/about) — JR Automation; robotic system integration, acquired by Hitachi, Ltd. in 2019.

## Application companies
id: application-companies
requires: integrators
aka: solution companies, vertical robotics companies, RaaS companies, full-stack robotics startups

### Plain
An application company sells a finished robot station for one job instead of a custom project. It is like buying a dishwasher instead of hiring a contractor to build a custom washing station: the machine arrives designed for exactly one task, and the same design ships to many customers. In robotics, that job might be putting food into meal trays or moving cases in a warehouse.

### Where the analogy breaks
A dishwasher belongs to you, works without its maker, and washes any dishes with no setup. Many application companies keep owning the robot, tune it on site to each customer's ingredients and trays, charge a recurring fee, and watch and update it remotely, so the customer is buying an ongoing service with a remote team behind it rather than a box.

### Precise
An application company is vertically integrated (it covers several layers of the chain itself). It buys arms from robot makers or builds its own hardware, writes its own software and often its own learned models, and sells the result as a standard product for one application. Its advantage over an integrator is repetition: one design deployed at many sites spreads the engineering cost, where an integrator re-engineers for each customer.

Many charge through robots-as-a-service (RaaS: a recurring fee that covers hardware, software, updates, and support, so the customer avoids a large upfront purchase). Chef Robotics sells AI-driven food-assembly robots running its own software, ChefOS, under a RaaS lease that includes hardware, software, AI feature updates, hardware upgrades, field service, and 24/7 performance monitoring [1]. Its pitch is handling variation, working with the customer's own ingredients, portion sizes, and trays [1], which is where learned models help most. At the large end, Symbotic builds automated warehouse systems for grocery and retail customers and sells software support and, for some customers, operation services with them [4].

Without this layer, automation stays out of reach for operations whose products change often or whose volumes cannot justify a custom project. The risks move to the customer side: the station depends on one company's software, remote monitoring, and continued existence.

### On the cheese plate line
Chef Robotics lists airline catering among its industries and gategroup, the airline caterer, among its named customers [1]. On the cheese plate line, an application company could supply some or all of the four pick stations as leased units, each placing one ingredient (apple slices or cheese wedges, say) into trays moving past on the conveyor. An integrator, or the application company itself, still has to connect those stations to the tray denester, inspection, and lidder. Portion control matters for cost: in two published case studies Chef reports giveaway (food placed beyond the specified portion) reduced by 4% and 67% [1]. I could not confirm whether gategroup uses these robots on cheese plates specifically [unverified: public pages name gategroup only as a customer].

### Elsewhere
Symbotic works with Walmart, which piloted its system at a Florida distribution center in 2017 [2]. Their agreement was expanded in 2021 to cover 25 of Walmart's 42 regional distribution centers and in 2022 to all 42, and Walmart provided about 85% of Symbotic's fiscal 2025 revenue [4]. Symbotic designs the robots, the storage structure, and the software and installs them, so Walmart deals with one company for the whole warehouse system.

### Why it exists
Custom integration does not scale: every new site costs nearly as much engineering as the first. A standard product sold many times, ideally with recurring revenue, lets a company fund the research needed to handle messy, variable tasks, and lets customers pay from operating budgets instead of capital budgets [1].

### Connects to
- [[integrators]] — the alternative path, and sometimes a partner for connecting stations into a line.
- [[model-companies]] — application companies are the main customers for robot foundation models, when they do not train their own.
- [[raas]] — the subscription model many application companies use.
- [[fleet-management]] — remote monitoring of every deployed station is part of what the customer pays for.
- [[learned-policy]] — learned skills are what let one design handle many customers' products.

### Real products and tools
- **Chef Robotics robots and ChefOS** — food-assembly robots leased under RaaS for meal production [1].
- **Symbotic warehouse system** — autonomous case-handling robots, storage structure, and software, built for retailers and wholesalers [4].
- **Robotiq palletizing workcell** — a component maker's move into standard application cells [3].

### Common misconception
**Misconception:** An application company is an integrator with a product brochure.

**Reality:** The difference is who owns the design and the risk over time. An application company builds one design many times, keeps updating its software remotely, and under RaaS keeps carrying the robot's upkeep: Chef's lease includes field service, parts replacement, and 24/7 uptime monitoring [1].

### Key numbers
- Chef Robotics deployments: more than a dozen customer facilities across the US, Canada, and Europe, and nearly 100 million servings by its own counter, as of November 2026 [1].
- Chef case-study giveaway reductions: 4% to 67%, depending on the customer and product [1].
- Symbotic revenue in fiscal 2025 (year to September 2025): US$2.25 billion [5].

### Sells
Standard robot stations or systems for one application, usually with software, learned models, monitoring, and service bundled in; sold as a lease or subscription, per unit of output, or as a purchase with a service contract.

### Buys from
Robot makers (standard arms) or component makers (when building its own robot); gripper, camera, and compute suppliers; model companies, for some; tooling companies (simulation, data, and fleet software); cloud providers; sometimes integrators for installation.

### Sells to
End users in one industry: food manufacturers and caterers, warehouses and retailers, logistics companies.

### Job functions
- **Machine learning engineer** — trains and evaluates the models that decide where and how to pick.
- **Robotics software engineer** — writes the motion, perception, and station-control software.
- **Hardware engineer** — designs the station frame, grippers, and washdown enclosure.
- **Deployment engineer** — installs stations at a customer site and tunes them for that customer's products.
- **Remote operations specialist** — watches the deployed fleet and steps in remotely when a station gets stuck.
- **Field service technician** — visits sites for repairs and planned maintenance.
- **Customer success manager** — tracks each customer's results and plans new stations or product changes.
- **Solutions engineer** — assesses a prospect's line and shows how the station would fit.
- **Account executive** — closes contracts and negotiates lease terms.
- **Data operations specialist** — labels and curates recorded picks for training.
- **Finance analyst** — models lease pricing and how long each station takes to pay back its hardware cost.

### Example companies
- **Chef Robotics** (US) — food-assembly robots under RaaS; named customers include Taylor Farms, gategroup, Amy's Kitchen, and CookUnity [1].
- **Symbotic** (US) — warehouse automation for Walmart, Target, Albertsons, C&S Wholesale Grocers, and others [4]; went public through a merger, announced in December 2021, with a SoftBank-sponsored acquisition company [2].
- **Robotiq** — sells grippers and sensors, and also palletizing, machine-tending, and screwdriving workcells [3].

### Sources
1. [Chef Robotics](https://www.chefrobotics.ai/) — Chef Robotics; product, ChefOS, industries, named customers, RaaS terms, deployment and case-study numbers.
2. [Symbotic](https://en.wikipedia.org/wiki/Symbotic) — Wikipedia; 2017 Walmart pilot in Brooksville, Florida, SPAC merger.
3. [Robotiq](https://robotiq.com/) — Robotiq; grippers, sensors, and workcells for palletizing, machine tending, and screwdriving.
4. [Symbotic Form 10-K, fiscal year ended September 27, 2025](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) — Symbotic, filed with the US SEC; named customers, Walmart agreements and revenue share, operation services.
5. [Symbotic Reports Fourth Quarter and Fiscal Year 2025 Results](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000277/q4258-k_ex991.htm) — Symbotic, November 24, 2025 (SEC Form 8-K exhibit); fiscal 2025 revenue.

## Robot model companies
id: model-companies
requires: value-chain, vla-models
aka: robot foundation model companies, robot brain companies, physical AI companies

### Plain
A robot model company writes the "brain" software that lets robots learn skills from examples instead of being programmed step by step. It is like a company that makes a phone operating system: it does not build the phone, but hopes many phone makers will run its software. Its product is a trained model that robot makers or application companies adapt to their own robot and task.

### Where the analogy breaks
A phone operating system works on a new phone almost out of the box. A robot model usually needs new examples recorded on the target robot doing the target task before it works reliably, and as of 2026 most of these models are research releases or limited partner programs rather than products with proven factory reliability.

### Precise
Model companies train foundation models (large neural networks trained on broad data and then adapted to specific uses) for robots, mostly vision-language-action models (VLAs: models that take camera images and a text instruction and output robot motions). Their main costs are computing power and robot data, much of it recorded by people teleoperating (remotely driving) robots. Customers adapt a base model by fine-tuning (further training on their own smaller dataset).

Business models are still forming. Some publish open weights (the trained model files) to build an ecosystem: Physical Intelligence's openpi repository publishes π0, π0-FAST, and π0.5 checkpoints; the repository carries an Apache 2.0 license (a permissive license that allows commercial use) and also ships Google's Gemma Terms of Use, which come with their own use restrictions [2]. NVIDIA's product page calls GR00T N1.7 (shortened there to "GR00T 1.7") an open VLA with a commercial license [3]; the GitHub release puts the weights under the NVIDIA Open Model License [9]. Google DeepMind offers Gemini Robotics models to more than 100 trusted testers and partners such as Apptronik, Agile Robots, and Boston Dynamics [4]. Covariant sold its software to warehouse automation companies, then in August 2024 gave Amazon a non-exclusive license to its models while its three co-founders and about a quarter of its staff joined Amazon [8]. Much of this layer is funded by venture capital rather than revenue: Physical Intelligence raised US$600 million at about a US$5.6 billion valuation in 2025, and Wikipedia describes its technology as not yet commercially sold [1]; its first paid route to outside teams is a hosted fine-tuning and inference API that opened as an application-only beta in October 2026, per a secondary report [10].

What this layer is for: without it, every robot company would have to collect its own very large dataset and train from scratch. A shared base model spreads that cost across many robots, if it transfers well enough to new robots and tasks, which is still being tested.

### On the cheese plate line
No two grape bunches are alike, so the grape station is the natural place for a learned model. An application company could fine-tune an open base model such as π0.5 or GR00T on teleoperated grape picks recorded at the station, then run it on an onboard computer next to the arm. The caterer never deals with the model company directly; it sees only the station. The model's license still matters to everyone in the chain: openpi's repository is Apache 2.0 but also ships Google's Gemma Terms of Use [2], and NVIDIA states GR00T N1.7 has a commercial license under its NVIDIA Open Model License [3][9], so the application company must check which terms cover the checkpoint (the saved, trained model file) before using it in a paid product.

### Elsewhere
In warehouses, the Covariant Brain ran robot arms for goods-to-person picking, kitting, induction, and order sortation, with named users including the integrator Knapp, Radial, and Otto Group [5]. After the 2024 Amazon deal, Wikipedia reports that Covariant stopped posting public updates, and a whistleblower complaint alleged the deal was structured to avoid antitrust review [5]. That path, where a large end user licenses a model company's work and hires its founders, is one way this layer is consolidating.

### Why it exists
Training general robot models takes large compute budgets and data collection at a scale few robot makers or plants want to fund themselves. Specialist companies raise venture capital to do it once and then try to sell or license the result to many robot builders.

### Connects to
- [[vla-models]] — the main kind of model these companies train.
- [[robot-datasets]] — data collection is their largest ongoing effort.
- [[on-robot-inference]] — a model is only useful if it runs fast enough on the robot's own computer.
- [[application-companies]] — their most natural customers.
- [[robot-makers]] — partners that may ship a model with their robots.

### Real products and tools
- **openpi (π0, π0-FAST, π0.5)** — Physical Intelligence's open models and code, with base checkpoints pretrained on more than 10,000 hours of robot data [2].
- **NVIDIA Isaac GR00T N1.7** — open 3-billion-parameter VLA (called GR00T 1.7 on NVIDIA's product page) from a model family NVIDIA aims at humanoids, which it says applies across a wide range of robots, with fine-tuning scripts and Jetson Thor deployment guides [3][9].
- **Gemini Robotics 2.5, ER 2, and On-Device 2** — Google DeepMind's VLA, reasoning, and on-robot models [4].
- **Skild Brain** — Skild AI's model, which it describes as one brain to control any robot for any task [6].
- **Covariant RFM-1** — robotics foundation model announced in March 2024 [5].

### Common misconception
**Misconception:** You can already buy a general robot brain and install it on a factory robot like an app.

**Reality:** As of 2026 most robot models are research releases or partner programs. Physical Intelligence's technology is described as not yet commercially sold [1], with only an application-only API beta open since October 2026 [10], and putting any model on a line still needs task data, testing, and safety engineering around it.

### Key numbers
- Physical Intelligence funding: US$400 million at about US$2.4 billion (2024), US$600 million at about US$5.6 billion (2025), and a reported US$1 billion round at about US$11 billion (2026, reported, not confirmed) [1].
- GR00T N1.7 inference speed: 25 Hz (the model runs 25 times a second) on Jetson Thor with NVFP4 quantization (storing the model's numbers in a compact 4-bit format so it runs faster), per NVIDIA's product page [3]; the GitHub README reports about 28 Hz on Jetson AGX Thor with TensorRT in a different benchmark setup [9].
- openpi base checkpoints: pretrained on more than 10,000 hours of robot data [2].
- Gemini Robotics: more than 100 trusted testers [4].

### Sells
Trained models (open weights, licensed weights, or API access); fine-tuning and deployment support; data tools; sometimes reference hardware designs or evaluation services.

### Buys from
Cloud and GPU providers for training compute; robot makers and component makers for lab robots used in data collection; teleoperation labor and data vendors; venture investors (capital, not goods, but the main input today).

### Sells to
Application companies and robot makers that build products on the model; large end users with in-house robotics teams; researchers and universities (often free).

### Job functions
- **Research scientist** — designs model architectures and training methods and publishes results.
- **ML infrastructure engineer** — runs the GPU clusters and data pipelines that train models.
- **Teleoperator** — remotely drives lab robots through tasks to record training examples.
- **Robot lab technician** — keeps the fleet of data-collection robots and grippers running.
- **Evaluation engineer** — designs test suites and measures how often a model succeeds on real robots.
- **Solutions engineer** — helps a partner fine-tune and deploy the model on their robot.
- **Developer relations engineer** — writes docs and examples and supports the open-source community.
- **Partnerships manager** — signs and manages deals with robot makers and application companies.
- **Product manager** — decides which capabilities, robots, and licensing terms to support next.

### Example companies
- **Physical Intelligence** (US) — founded February 2024; open π0 and π0.5 models [2]; π0.7 paper released April 2026 [7]; reported to be raising at about US$11 billion in 2026 [1].
- **Skild AI** (US) — Skild Brain; investors shown on its site include SoftBank, Sequoia, and Amazon [6].
- **Google DeepMind** (UK/US, part of Alphabet) — Gemini Robotics models for testers and partners [4].
- **NVIDIA** (US) — open GR00T models alongside its Jetson Thor hardware and Isaac software [3].
- **Covariant** (US) — Covariant Brain and RFM-1 [5]; non-exclusive license to Amazon and founders hired by Amazon in August 2024 [8].

### Sources
1. [Physical Intelligence Inc.](https://en.wikipedia.org/wiki/Physical_Intelligence_Inc.) — Wikipedia; founding, funding rounds and valuations, models, not yet commercially sold.
2. [openpi](https://github.com/Physical-Intelligence/openpi) — Physical Intelligence on GitHub; π0, π0-FAST, π0.5 checkpoints, Apache 2.0 repository license plus an included LICENSE_GEMMA.txt (Gemma Terms of Use), 10,000+ hours of pretraining data.
3. [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) — NVIDIA; GR00T 1.7, commercial license, Jetson Thor deployment, 25 Hz.
4. [Gemini Robotics](https://deepmind.google/models/gemini-robotics/) — Google DeepMind; current models, trusted testers, research partners.
5. [Covariant](https://en.wikipedia.org/wiki/Covariant_%28company%29) — Wikipedia; Covariant Brain users, RFM-1, August 2024 Amazon deal, whistleblower allegations, current status.
6. [Skild AI](https://www.skild.ai/) — Skild AI; Skild Brain description, applications, investors.
7. [π0.7: a Steerable Generalist Robotic Foundation Model with Emergent Capabilities](https://arxiv.org/abs/2604.15483) — Physical Intelligence, arXiv, submitted April 16, 2026.
8. [An update on how we're accelerating the use of AI in robotics at scale](https://www.aboutamazon.com/news/company-news/amazon-covariant-ai-robots) — Amazon, August 30, 2024; non-exclusive license to Covariant's robotic foundation models, co-founders and about a quarter of employees joining Amazon.
9. [NVIDIA/Isaac-GR00T](https://github.com/NVIDIA/Isaac-GR00T) — NVIDIA, GitHub README; model name GR00T N1.7, 3B base model, weights under the NVIDIA Open Model License, about 28 Hz on Jetson AGX Thor with TensorRT (batch-1 LIBERO benchmark).
10. [Physical Intelligence Opens API Beta for Robot Model Training and Inference](https://www.humanoidsdaily.com/news/physical-intelligence-api-beta-robot-training-inference) — Humanoids Daily, October 14, 2026 (secondary; Physical Intelligence's own announcement page returned an error); beta announced October 13, 2026, application-based access, hosted fine-tuning and inference.

## Tooling and software companies
id: tooling-companies
requires: value-chain, simulators
aka: robotics software tools, simulation vendors, offline programming, developer tools, picks and shovels

### Plain
Tooling companies sell the tools that everyone else uses to design, program, and debug robots. They are like the companies that make design software and laser measuring tools for builders: they never build a house themselves, but nearly every builder pays them. In robotics that means simulation software, programming tools, and software for recording and replaying what robots did.

### Where the analogy breaks
A builder's tools mostly matter during design and construction. Robot tooling often keeps running after a line is built: data tools record every shift, and simulations get reused to test each new software or model version before it reaches the real robots.

### Precise
Three main kinds. Simulation and offline programming tools (for designing and programming a robot cell on a computer before the hardware exists): RoboDK supports more than 1,400 robots from over 80 makers and writes each brand's native program format, from ABB RAPID to FANUC and KUKA [1]; Visual Components, owned by KUKA since 2017, does manufacturing simulation and offline programming [5]; NVIDIA lists Isaac Sim and Isaac Lab in its robot software stack and uses Isaac Lab-Arena to evaluate learned policies (trained models that turn what the robot senses into what it does) [6]. Development platforms: Intrinsic's Flowstate is a developer environment with ready-made perception, motion planning, and sensor-based control capabilities, and Intrinsic Core is an open-source, ROS-compatible set of those capabilities [3] (ROS, the Robot Operating System, is a widely used free collection of robot software). Data and observability tools (for seeing afterward what a robot sensed and did, and why): Foxglove records robot logs in the open MCAP format (a file format for time-stamped streams of sensor readings and messages), uploads them from robots, and lets teams visualize, search, and annotate them [2].

Their selling point is usually brand neutrality: a plant or integrator with three robot brands wants one simulator and one log viewer. Open-source projects such as [[ros2]] and [[moveit]] sit in this layer too; companies earn money around them through support, hosted services, and paid features rather than licenses.

Without this layer, integrators would design cells by trial and error on real hardware, and every robotics team would build its own simulator and log viewer. Ownership matters here as well. KUKA owns Visual Components [5], and Intrinsic, an Alphabet company since 2021, joined Google in February 2026 as a distinct group working closely with Google DeepMind [4]. When a robot maker or a model company owns a tool, its neutrality becomes a fair question.

### On the cheese plate line
Before buying anything, the integrator models all eight stations in a simulator such as RoboDK or Visual Components to check that each robot reaches both the ingredient bin and the tray, and to estimate whether the cheese station can place 10 wedges a minute (3 wedges in each 18 s takt). It then generates the robot programs offline and corrects them on the real line, by calibrating the robot or touching up positions, because industrial arms are far more repeatable than they are accurate [7]: an arm returns very closely to a point it was taught by hand, but lands further off a point calculated from a drawing, and the real cell never matches the CAD model exactly. After go-live, each pick station records camera and arm data in MCAP, and engineers open those recordings in Foxglove when inspection rejects a plate for a missing grape bunch [2].

### Elsewhere
Foxglove lists autonomous-vehicle and robotics companies such as Wayve, Shield AI, Dexterity, and ANYbotics among its customers [2]. A self-driving car team and a warehouse robot team use the same tool to replay a recorded moment and see what the sensors saw, which is exactly the kind of shared need a tooling company exists to serve.

### Why it exists
Every robot team needs a simulator, a programming environment, and a way to see recorded data, and building those in-house is slow and rarely a team's core advantage. A tooling company builds them once, keeps them current across robot brands, and sells them to the whole industry.

### Connects to
- [[simulators]] — the largest single category of robotics tooling.
- [[visualization-tools]] — log viewers and dashboards are a fast-growing tooling market.
- [[telemetry-logs]] — tooling companies push shared formats such as MCAP.
- [[cell-design]] — integrators use simulation tools to design cells before buying hardware.
- [[ros2]] — the open-source base many commercial tools build on.

### Real products and tools
- **RoboDK** — offline programming and simulation, more than 1,400 robots from over 80 makers [1].
- **Foxglove** — data platform for recording, visualizing, searching, and annotating robot data in MCAP [2].
- **Intrinsic Flowstate and Intrinsic Core** — developer environment and open-source ROS-compatible capabilities for building robot applications [3].
- **Visual Components** — manufacturing simulation and offline programming, a KUKA business [5].
- **NVIDIA Isaac Sim and Isaac Lab** — physics simulation and robot-learning frameworks listed alongside GR00T [6].

### Common misconception
**Misconception:** With good simulation you can skip testing on real hardware.

**Reality:** Simulation narrows the design and catches reach and collision problems early, but real food, real lighting, and real part positions still differ from the model. The cheese plate line still needs grasp tests with chilled ingredients, offline programs still need touch-up, and learned policies still need real-robot evaluation (see [[policy-evaluation]]).

### Key numbers
- RoboDK robot library: more than 1,400 robots from over 80 manufacturers [1].

### Sells
Software licenses and subscriptions for simulation, offline programming, development platforms, data recording and visualization, fleet monitoring, and labeling; paid support around open-source tools; training and consulting.

### Buys from
Cloud providers for hosting; GPU makers for simulation and rendering hardware; robot makers for robot models, controllers, and partnership access to their programming interfaces; open-source communities whose code they build on.

### Sells to
Integrators (design and offline programming); robot makers and application companies (development, simulation, and data tools); model companies (simulation and data tools); end users with in-house engineering teams; universities.

### Job functions
- **Software engineer** — builds the product, such as the simulator, programming environment, or log viewer.
- **Physics and graphics engineer** — makes simulated robots, contact, and sensors behave and look like the real ones.
- **Robot integration engineer** — adds support for new robot brands and models and keeps their program translators correct.
- **Developer advocate** — writes tutorials and examples and helps users in forums and at events.
- **Solutions engineer** — shows prospects how the tool fits their workflow and helps run trials.
- **Support engineer** — answers customer tickets and reproduces and triages bugs.
- **Account executive** — sells licenses and enterprise contracts.
- **Product manager** — decides which features, robot brands, and integrations come next.
- **Technical writer** — writes and maintains the documentation.

### Example companies
- **RoboDK** — robot simulation and offline programming [1].
- **Foxglove** — robotics data platform built on MCAP [2].
- **Intrinsic** (US) — Flowstate and Intrinsic Core [3]; launched as an Alphabet "Other Bet" in 2021 and a distinct group within Google since February 2026 [4].
- **Visual Components** — simulation software, owned by KUKA [5], which is owned by Midea [8].
- **NVIDIA** (US) — Isaac Sim and Isaac Lab, alongside its compute hardware and GR00T models [6].

### Sources
1. [RoboDK](https://robodk.com/) — RoboDK; offline programming and simulation, robot library size, supported robot languages.
2. [Foxglove](https://foxglove.dev/) — Foxglove; data platform features, MCAP, named customers.
3. [Intrinsic](https://www.intrinsic.ai/) — Intrinsic; Flowstate, capabilities, Intrinsic Core.
4. [Intrinsic joins Google to accelerate the future of physical AI](https://www.intrinsic.ai/blog/posts/intrinsic-joins-google-to-accelerate-physical-ai) — Intrinsic, February 25, 2026; launched by Alphabet in 2021, now a distinct group within Google working closely with Google DeepMind.
5. [About Visual Components](https://www.visualcomponents.com/company/about-us/) — Visual Components; acquired by KUKA in December 2017, manufacturing simulation and offline programming software.
6. [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) — NVIDIA; Isaac Sim, Isaac Lab, and related tools listed in the GR00T ecosystem.
7. [Robot Calibration (Laser Tracker)](https://robodk.com/doc/en/Robot-Calibration-LaserTracker.html) — RoboDK documentation; industrial arms are highly repeatable but not accurate, calibration improves offline-programmed accuracy 2-10 times.
8. [Squeeze-out completed](https://kuka.com/en-ch/company/press/news/2022/11/squeeze-out-completed) — KUKA, November 8, 2022; minority shares transferred to the majority shareholder, a Midea company.

## End users: the plants that run robots
id: end-users
requires: value-chain, oee
aka: end customers, manufacturers, operators, asset owners, the plant

### Plain
End users are the factories, warehouses, and kitchens that buy robots and run them every day. They are like a restaurant owner who buys ovens and dishwashers: the owner does not build the equipment, but pays for it, decides whether it was worth it, and lives with every breakdown. Every other company on this map ultimately gets its money from them.

### Where the analogy breaks
A restaurant buys standard ovens off the shelf, while a plant usually buys a custom-built line and often has to change its own process, packaging, or product to suit the robots. Large end users also cross into other roles, building their own automation teams or even buying robot companies.

### Precise
The end user is the operating company whose product passes through the robot cell. It pays capex (a one-time purchase recorded as an asset) for purchased systems, or opex (ongoing running costs) under a lease or RaaS, plus maintenance, spare parts, energy, and staff time. Its decision rests on ROI (return on investment: how quickly savings repay the cost), labor availability, consistency, and safety, and it is judged afterward on throughput and uptime, usually summarized as [[oee]] (overall equipment effectiveness: the share of planned time the line spends making good product at full speed). Inside the end user, different groups want different things: operations wants rate, maintenance wants reliability and spare parts, quality and food safety want cleanability and traceability, and finance wants payback.

Demand is spread across industries more than people expect. In the US in 2025, automotive was the largest buyer at 13,500 of about 38,000 robots installed, while food, metal and machinery, and electrical and electronics each took about 3,000, with food up 30% over 2024 [1]. These are the IFR's preliminary June figures; its final total was almost 38,500 [2]. Worldwide, China accounted for 59% of 2025 installations [2].

The biggest end users reach up the chain. Hyundai Motor Group controls Boston Dynamics [3], Amazon licensed Covariant's technology and hired its founders [4], and Walmart extended its Symbotic agreement to 25 of its 42 regional distribution centers in 2021 and to all 42 in 2022 [5]. Without an engaged end user, a line that its own staff cannot clean, maintain, or recover from faults sits idle no matter how well it was built.

### On the cheese plate line
The end user is an airline caterer such as gategroup, which says it serves more than 680 million passengers a year in more than 68 countries through brands including gategourmet [6], and which Chef Robotics lists as a customer [7]. Inside the caterer, the kitchen operations manager wants 200 plates an hour; the food safety manager requires washdown-rated, food-safe equipment in a 36-40 F room; the sanitation crew must be able to clean every station between shifts; the maintenance technician needs to swap a worn vacuum cup in minutes; and finance compares the line's cost with the labor it replaces. Airline menus change, so how quickly the line can switch to a different plate layout matters as much as its top speed [unverified: general catering practice, no gategroup-specific source].

### Elsewhere
A car body shop is the classic end user. US automotive plants installed about 13,500 industrial robots in 2025, more than any other US industry and more than four times the roughly 3,000 that went into food plants [1]. The automaker's engineers write the requirements, integrators build the cells, and the plant's own maintenance technicians keep them running shift after shift. Hyundai goes further and controls a robot maker outright: Boston Dynamics [3].

### Why it exists
Treating end users as their own company type matters because their constraints set what every upstream company can sell: hygiene rules in food, uptime in automotive, peak season in warehouses, and annual capital budgets everywhere. A product that does not fit how a plant buys, cleans, staffs, and maintains equipment does not sell, however good the robot.

### Connects to
- [[integrators]] — the end user's main supplier for custom lines.
- [[application-companies]] — the alternative supplier for standard stations, often leased.
- [[oee]] — how the end user measures whether the line is earning its keep.
- [[support]] — after go-live, service and spare parts are the end user's ongoing cost.
- [[hygienic-design]] — in food plants, cleanability is a hard purchase requirement.

### Real products and tools
- **IFR World Robotics statistics** — the standard source for how many robots each country and industry buys [1][2].
- **Chef Robotics RaaS lease** — an option for food plants to pay a recurring lease fee instead of a large upfront purchase [7].
- **FANUC food-grade robots** — stainless and food-grade arms built for food plant hygiene [8].

### Common misconception
**Misconception:** Most robots go to car factories.

**Reality:** Automotive is still the largest single buyer in the US, but in 2025 it took about 13,500 of 38,000 US installations, roughly 35%, and food installations grew 30% [1].

### Key numbers
- US installations in 2025: about 38,000 in total (preliminary; final count almost 38,500 [2]); automotive 13,500; food, metal and machinery, and electrical and electronics about 3,000 each [1].
- China's share of 2025 worldwide installations: 59% [2].
- gategroup scale: more than 680 million passengers a year, more than 68 countries [6].

### Sells
Their own products and services, not robots: meals, cars, electronics, shipped orders. Some large end users also sell or license automation they built in-house, or own robot companies outright.

### Buys from
Integrators (custom lines); application companies (standard stations, often leased); robot makers directly (large plants with in-house engineering); component makers and distributors (spare parts); service providers (maintenance contracts); occasionally tooling companies (for in-house teams).

### Sells to
Their own customers: airlines, retailers, consumers, other manufacturers.

### Job functions
- **Plant manager** — owns output, cost, safety, and staffing for the whole site, and signs off on automation investments.
- **Manufacturing engineer** — designs and improves production processes and writes the requirements for new lines.
- **Controls engineer** — maintains PLC and robot programs in-house and makes small changes without calling the integrator.
- **Maintenance technician** — does preventive maintenance, swaps worn parts, and is first on scene when a robot faults.
- **Line operator** — runs the line each shift, clears jams, restocks ingredients, and restarts stations after stops.
- **Quality and food safety manager** — sets hygiene, allergen, and inspection rules, and approves equipment for food contact.
- **Sanitation lead** — runs the cleaning crew that washes down equipment between shifts.
- **Environmental health and safety manager** — checks guarding, lockout procedures, and risk assessments for new equipment.
- **Procurement buyer** — runs the quoting process and negotiates contracts with integrators and suppliers.
- **Finance analyst** — builds the payback case and tracks whether the line delivers the promised savings.

### Example companies
- **gategroup** (Switzerland) — airline caterer serving more than 680 million passengers a year; brands include gategourmet and servair; named by Chef Robotics as a customer [6][7].
- **Hyundai Motor Group** (South Korea) — automaker and robot end user that controls Boston Dynamics [3].
- **Walmart** (US) — retailer whose Symbotic agreement covers all 42 of its regional distribution centers [5].
- **Amazon** (US) — operator of large robot fleets that licensed Covariant's technology in 2024 [4].
- **Taylor Farms and Amy's Kitchen** (US) — food manufacturers named as Chef Robotics customers [7].

### Sources
1. [US Robot Industry Returns to Double Digit Growth](https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth) — International Federation of Robotics, June 2026; US installations by industry in 2025, preliminary.
2. [Five Million Robots now Operate in Factories Globally](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) — International Federation of Robotics, September 2026; worldwide installations, China share, final US total.
3. [Hyundai Motor Group Completes Acquisition of Boston Dynamics from SoftBank](https://bostondynamics.com/news/hyundai-motor-group-completes-acquisition-of-boston-dynamics-from-softbank/) — Boston Dynamics, June 21, 2021; Hyundai Motor Group holds 80%.
4. [An update on how we're accelerating the use of AI in robotics at scale](https://www.aboutamazon.com/news/company-news/amazon-covariant-ai-robots) — Amazon, August 30, 2024; Covariant license and hires.
5. [Symbotic Form 10-K, fiscal year ended September 27, 2025](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) — Symbotic, filed with the US SEC; Walmart agreement history.
6. [gategroup](https://www.gategroup.com/) — gategroup; passengers served, countries, brands, headquarters.
7. [Chef Robotics](https://www.chefrobotics.ai/) — Chef Robotics; named customers, RaaS terms.
8. [Food and beverage](https://www.fanucamerica.com/industries/food-beverage) — FANUC America; food-grade and stainless robots.
