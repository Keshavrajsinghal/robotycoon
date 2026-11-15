---
area: 11
slug: deployment-lifecycle
title: Deployment lifecycle
---

# Deployment lifecycle

A robot cell does not arrive in a box and start working. Between "we should automate this" and a
cell running at rate, a plant goes through a fixed sequence: scope the business case, design the
cell on a computer, buy it, test it at the builder's shop and again at the plant, start it up,
and then keep it running for years. Each phase has its own documents, tests, and people, and
each one is a place where a project can stall even when the robot itself is fine.

This area walks the cheese plate line through every phase, from the first question (is a
200-plates-an-hour robotic line worth the money?) to the last (who fixes the grape gripper in
the middle of the night shift?). It ends with the alternative to buying at all: paying a provider
by the hour or by the month to own and run the robots for you.

## Scoping and ROI
id: scoping
requires: cycle-time
aka: feasibility study, business case, ROI, payback period

### Plain
Scoping is deciding, before spending real money, whether a robot can do the job and whether it will pay for itself. It is like deciding whether to buy a dishwasher: first you check that your pots fit inside, then you compare its price with the hours of hand-washing it saves. If the pots do not fit, or you rarely cook, the answer is no, however clever the machine is.

### Where the analogy breaks
A dishwasher's full price is on the box, but a robot's sticker price is only a fraction of what the working cell costs. And nobody knows for sure that a robot can handle your particular item (a wet apple slice, a floppy grape bunch) until someone physically tests it.

### Precise
Scoping has two halves. **Technical feasibility** asks whether a robot can do the task reliably at the required rate. It is checked with real parts: samples go to a robot maker's or integrator's lab for a proof of concept (a short test rig that tries the grip and the motion), and the plant's throughput target is turned into a time budget per robot ([[cycle-time]]). **Economic feasibility** compares installed cost with savings. The two usual measures are payback period (installed cost divided by yearly net savings, which gives the number of years until the project has earned its money back) and ROI (return on investment: net gain divided by cost).

The most common mistake is pricing the robot instead of the cell. A 2016 study for NIST, based on 84 expert interviews, found that the total cost of a robotic system (robot plus integration) "tends to be 3 to 4 times" the robot's own cost, while noting the ratio was changing [2]. The International Federation of Robotics made a similar estimate: about 16.5 billion USD of robots sold in 2018 became roughly 50 billion USD once software, peripherals, and systems engineering were included [3]. Savings come mostly from labor hours replaced, plus scrap and quality gains, minus new costs: maintenance, spare parts, energy, and the technicians who keep the cell running.

Payback depends heavily on hours run. The cost is mostly fixed while the savings scale with hours, so the same cell on two shifts pays back in roughly half the time it takes on one. McKinsey wrote in 2024 that manufacturers can now expect payback in one to three years, compared with a typical five to eight years from the 1980s to the 2020s [1]; a review of published payback claims found no dataset behind that figure, and no government or industry body that publishes a measured average [4]. Skipping scoping produces cells that are technically impressive but never pay back, or projects that discover during testing that the hardest item cannot be gripped reliably.

### On the cheese plate line
At 200 plates an hour the takt (time budget per plate) is 18 seconds, so the apple station must place about four slices in 18 s (one every 4.5 s) and the cheese station three wedges (one every 6 s). Feasibility tests start with the riskiest ingredients, grape bunches and wet apple slices, and are run in a 2-4 C room, because a grip that works on a room-temperature slice proves nothing about a cold, wet one. The economics, as illustrative arithmetic rather than data: a line costing 2.4 million USD installed that saves 800,000 USD a year of labor on two shifts, minus 150,000 USD of upkeep, pays back in about 3.7 years (2.4 / 0.65); a third shift lifts net savings to about 1.05 million USD and cuts payback to about 2.3 years.

### Elsewhere
A car body shop runs its spot-welding robots two or three shifts a day, so each robot works many hours a year and payback is easier to justify. A job shop running the same kind of cell on one shift sees payback roughly double. One worked example (an illustration, not a survey) puts a 195,000 USD cell at about 15.5 months payback on two shifts versus about 34 months on one [4].

### Why it exists
Automation money is committed long before anyone sees the cell work, and most of it pays for engineering rather than hardware. Scoping is the cheap checkpoint where a bad project can be stopped for the cost of a few tests and a spreadsheet, instead of after the money is spent.

### Connects to
- [[cycle-time]] — the throughput target becomes a per-robot time budget during scoping
- [[oee]] — the savings estimate assumes an uptime and quality rate; overstating it inflates ROI
- [[grasp-planning]] — feasibility often hinges on whether a reliable grasp exists for the hardest item
- [[cell-design]] — the next phase, where a feasible concept becomes a layout and a simulation
- [[raas]] — paying per use turns the payback question into a monthly comparison with labor cost

### Real products and tools
- **Robot maker application support** — Stäubli, for example, offers application engineers who help refine and specify an application, then develop and optimize its programming [5]
- **Payback spreadsheet** — installed cost, yearly savings, and yearly upkeep; the formula is simple, and the inputs (hours run, uptime, labor cost) are where scoping effort goes
- **Early simulation** — a quick reach and cycle-time check in a tool such as RoboDK before any quote is requested (see [[cell-design]])

### Common misconception
**Misconception:** If the robot costs 50,000 USD and replaces a worker who costs 50,000 USD a year, it pays back in one year.

**Reality:** The robot is often only a quarter to a third of the installed cost [2][3], and the cell adds maintenance, spares, and skilled technicians. Uptime below 100% and a ramp-up period delay the savings further. The real payback can easily be three or more times the naive figure.

### Key numbers
- Expected payback for manufacturing automation today: 1-3 years, versus 5-8 years historically; no dataset published, and the figure depends mostly on shifts run and local labor cost [1]
- Total installed system cost: about 3-4 times the robot's price, from 2014-2015 expert interviews; simple cobot cells can be lower, complex cells higher [2][3]
- One worked example: a 195,000 USD cell pays back in about 15.5 months on two shifts versus about 34 months on one [4]

### Sources
1. [Automation and the talent challenge in American manufacturing](https://karriere.mckinsey.de/capabilities/operations/our-insights/automation-and-the-talent-challenge-in-american-manufacturing) — McKinsey, July 2024; payback of one to three years today versus five to eight years historically
2. [Economic Analysis of Technology Infrastructure Needs for Advanced Manufacturing: Advanced Robotics and Automation (NIST GCR 16-005)](https://nvlpubs.nist.gov/nistpubs/gcr/2016/NIST.GCR.16-005.pdf) — RTI International for NIST, 2016; 84 interviews; total system cost 3 to 4 times robot cost
3. [Robot investment reaches record 16.5 billion USD](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) — International Federation of Robotics, September 2019; robots alone versus about 50 billion USD with software, peripherals, and systems engineering
4. [Industrial Robot ROI: Payback Times and Integration Costs (2026 Data)](https://reliamag.com/topics/guides/industrial-robot-roi-payback-integration-costs) — review of published payback claims; worked one-shift versus two-shift example
5. [Services for Stäubli integrators](https://www.staubli.com/content/dam/robotics/products/robots/services/Services-for-Stäubli-integrators-brochure-EN.pdf) — Stäubli brochure, January 2026; application support offering

## Cell design and simulation
id: cell-design
requires: scoping, reach, safety-standards
aka: layout, reach study, robot simulation, offline programming, virtual commissioning, risk assessment

### Plain
Cell design is planning exactly where every robot, conveyor, fence, and bin will sit, and proving on a computer that it all works before anything is built. It is like planning a kitchen remodel with a floor-plan app: you check that the fridge door can open, that the cook can reach the stove from the sink, and that nobody gets hit by the oven door. Fixing a mistake on screen costs minutes, while fixing it after the cabinets are installed costs weeks.

### Where the analogy breaks
A kitchen plan only has to be roughly right, but a robot simulation must predict cycle times to fractions of a second and clearances to millimeters. Even then it cannot tell you whether a gripper will hold a slippery apple slice; only physical tests can.

### Precise
A cell (one or more robots plus the equipment around them, working as a unit) is laid out in 3D simulation software that holds accurate models of real robots. Three studies matter most. A **reach study** checks that the tool can get to every pick and place point, at the needed angle, without hitting a joint limit or a singularity (a pose where the arm loses the ability to move in some direction) ([[reach]]). A **cycle-time study** runs the planned motions to see whether the robot meets its time budget. A **collision study** checks the arm, gripper, and carried item against fences, conveyors, and other robots. The same model is often reused for offline programming (writing the robot program on a PC instead of teaching it on the real robot) and virtual commissioning (connecting the simulation to the real PLC program so the control logic is tested before hardware exists) [2][3].

Simulated cycle times are approximations. Each robot maker's controller plans its own motion, and RoboDK, for example, sells an add-in that runs the maker's own motion-planning software specifically to get accurate paths and cycle times [4]. Treat a simulated cycle time as a strong estimate with a margin, not a guarantee.

**Risk assessment** runs in parallel with layout. ISO 10218-2:2025 (the international safety standard for integrating industrial robots into cells, which replaced the 2011 edition) covers the cell from design through decommissioning [5]. A summary of the standard describes what it asks of the integrator: a task-based assessment of the finished cell using the ISO 12100 method, covering every mode (teaching, jam clearing, maintenance, cleaning), not just automatic running, with hazards reduced first by design, then by guards and safety devices, and only last by warnings and training [6]. Without this phase, layouts get fixed after installation, when moving a conveyor means cutting steel and repeating safety validation.

### On the cheese plate line
The cheese station's simulation must show the robot reaching both its wedge supply and every tray position as trays move past on the main conveyor ([[conveyor-tracking]]), placing three wedges inside the 18-second takt with margin. If the model shows 6.5 s per wedge (19.5 s per plate), the fixes (a second robot, a faster arm, or a gripper that picks two wedges at once) cost nothing to try on screen. The risk assessment lists what humans do in the cell: clearing a tray jam at the denester, swapping vacuum cups at the apple station, and the nightly washdown, when sanitation crews spray everything with hoses and chemicals ([[hygienic-design]], [[ip-rating]]).

### Elsewhere
In a car body shop, many welding robots work around one car body at the same time, and every weld point must be reachable without robots hitting each other or the fixtures. Tools such as Siemens Process Simulate target exactly this: the product page lists simulating robot motion and collision-free paths, optimizing cycle times, and validating the workcell against real PLC logic before hardware is bought [3].

### Why it exists
Steel, conveyors, and fences are expensive to move once bolted down, and every move reopens safety validation. Simulation and risk assessment push the discovery of reach problems, collisions, missed cycle times, and unsafe maintenance tasks to the cheapest possible moment: before purchase orders go out.

### Connects to
- [[reach]] — the reach study checks the robot's workspace against the real pick and place points
- [[collision-checking]] — the collision study runs the same kind of geometric check offline
- [[guarding]] — the risk assessment decides where fences, light curtains, and scanners go
- [[safety-standards]] — ISO 10218-2 and ISO 12100 define how the assessment is done
- [[simulators]] — physics simulators for robot learning are a different tool from layout simulators, though both are called simulation

### Real products and tools
- **RoboDK** — PC simulation and offline programming; library of over 1,400 robot arms from 80 manufacturers, with reachability analysis and cycle-time optimization [1]
- **Visual Components** — layout planning, process simulation, offline programming, and virtual commissioning; a KUKA Group company, version 5.0 released March 2026 [2]
- **Siemens Process Simulate** — part of the Tecnomatix line; robot motion, collision checks, cycle-time tuning, and virtual commissioning against real PLC logic (sold in tiers such as Process Simulate X Standard) [3]
- **ISO 10218-2:2025** — safety requirements for industrial robot applications and robot cells [5]
- **ISO 12100** — the general machinery risk assessment method that the robot cell standard builds on [6]

### Common misconception
**Misconception:** If the simulation runs clean, the cell will work.

**Reality:** Simulation proves geometry and approximate timing. It does not prove gripping, real part variation, or how a floppy grape bunch hangs from a gripper, and its cycle times can drift from reality unless the maker's own motion planner is used [4]. Simulation removes layout mistakes; physical tests and acceptance runs remove the rest.

### Key numbers
- RoboDK robot library: over 1,400 arms from 80 manufacturers, as of November 2026 [1]

### Sources
1. [Robot Simulation Software](https://robodk.com/simulation) — RoboDK; reachability analysis, cycle-time optimization, collision avoidance, robot library size
2. [Visual Components 5.0](https://www.kuka.com/pl-pl/firma/prasa/news/2026/03/visual-components-5_0) — KUKA press release, March 12, 2026; layout planning, offline programming, virtual commissioning
3. [Process Simulate X Standard](https://www.siemens.com/en-us/products/tecnomatix/offerings/process-simulate-x-standard/) — Siemens product page; cycle-time optimization, collision detection, validation with real PLC logic
4. [Realistic Robot Simulation (RRS)](https://eu.robodk.com/doc/en/RRS.html) — RoboDK documentation; accurate paths and cycle times via the manufacturer's motion-planning software
5. [ISO 10218-2:2025](https://www.evs.ee/en/iso-10218-2-2025) — Estonian Centre for Standardisation listing; scope and supersession of the 2011 edition
6. [ISO 10218-2:2025 Explained: Robot Cell Safety Guide](https://www.evsint.com/iso-10218-2-2025-robot-system-cell-integration-safety-guide/) — EVST engineering team, July 2026; vendor summary of the task-based, ISO 12100 risk assessment (not the standard's text)

## Purchasing
id: purchasing
requires: scoping
aka: procurement, RFQ, RFP, URS, capex, lead time

### Plain
Purchasing is turning the design into a signed contract: writing down exactly what you need, asking several builders for prices, and choosing one. It is like getting quotes for a house extension: you give each builder the same drawings and wish list, compare what each one includes and leaves out, and agree on a price, a schedule, and when you pay. The cheapest quote is no bargain if it quietly left things out.

### Where the analogy breaks
A house builder mostly uses parts from a local store, but a robot cell depends on parts that take months to arrive from many suppliers. And payments are usually tied to passing formal tests, not to a walkthrough.

### Precise
The buyer writes a **URS** (user requirements specification: what the cell must do, and under what conditions) and sends it with an **RFQ** (request for quotation: a request for binding prices on a defined scope). When the buyer knows the problem but not the solution, an **RFP** (request for proposal) invites different technical approaches instead [1]. A good package covers the process and products, rates and shifts, site conditions and utilities, interfaces to neighboring machines, a scope split saying who supplies each boundary item (fencing, conveyors, electrical hookup), safety duties including who acts as legal manufacturer of the cell, FAT and SAT outlines, and commercial terms such as payment milestones, warranty, spares, and service response [1]. Bids are compared line by line, starting with each bidder's list of deviations from the request [1].

The money is either **capex** (capital expenditure: buying a long-lived asset, which goes on the balance sheet and is expensed gradually as depreciation over its useful life) or **opex** (operating expense: a recurring cost, like rent, expensed in the period it is paid) [2]. A robot cell bought outright is capex; a pay-per-use deal is usually structured as opex ([[raas]]).

**Lead time** (time from order to delivery) sets the schedule. In 2019, integrators reported industrial robots at 14-20 weeks, with common models in under six weeks, while linear slides took 20-26 weeks and some linear bearings up to a year [3]. Universal Robots said in 2022 it could ship cobots within about two weeks [4], and a 2026 retrofit guide puts industrial robots at 8-12+ weeks and custom motor control centers at 24-44 weeks [5]. Without a precise URS, bids cannot be compared, gaps in scope come back as change orders (paid extras after signing), and acceptance becomes an argument about what was promised.

### On the cheese plate line
The URS states 200 plates an hour, a 2-4 C room, IP67 washdown with the plant's own sanitation chemicals, and the plate recipe, and it requires every ingredient to be run at FAT. Three integrators receive the identical package; reading the deviation lists shows that one bid leaves out the tray denester and another proposes a robot without a washdown rating at the cracker station. The plant then places orders for the longest-lead items first, because those, not the software, set the date the line can start.

### Elsewhere
In a 2019 Assembly Magazine report quoting US integrators, the robot was rarely what held a project up: integrators could order robots early and expect them on time, while linear slides, linear bearings, and custom weldments slipped by weeks or months [3]. The practical lesson for any factory project is to find the longest-lead item on the bill of materials, which is often a plain mechanical part, and order it first.

### Why it exists
A robot cell is custom engineering bought before it exists, so the contract is the only shared definition of "done." Purchasing turns scoping and design work into a fixed scope, price, schedule, and test plan that both sides can be held to.

### Connects to
- [[cell-design]] — the layout and simulation results go into the RFQ package
- [[acceptance-tests]] — the contract defines what FAT and SAT must show and ties payments to them
- [[raas]] — the alternative to buying: renting working capacity as an operating expense
- [[safety-standards]] — the RFQ must say which standards apply and who signs the declaration of conformity

### Real products and tools
- **RFQ checklist** — DBR77's eight-section automation RFQ outline: bid rules, technical brief, site, interfaces, scope split, safety, acceptance, commercial terms [1]
- **IEC 62381** — FAT and SAT checklists that a contract can reference for its acceptance section [6]
- **Robot financing and service contracts** — leasing or RaaS as an alternative to a capital purchase (see [[raas]])

### Common misconception
**Misconception:** The lowest bid is the cheapest cell.

**Reality:** Bids differ in scope as much as in price. One may exclude guarding, a feeder, or training, which then return as change orders after signing. Comparing bids fairly needs the same package and response format for every bidder and a careful read of each one's assumptions and deviations [1].

### Key numbers
- Robot lead time: about 2 weeks for stock cobots (2022) [4] to 14-20 weeks for industrial robots (2019) [3]; 8-12+ weeks in a 2026 guide [5]; depends on model, size, and supply conditions
- Other long-lead items: linear slides 20-26 weeks (2019) [3]; custom motor control centers 24-44 weeks (2026 guide) [5]

### Sources
1. [What to include in an automation RFQ or RFP](https://marketplace.dbr77.com/knowledge-base/what-to-include-in-an-automation-rfq-or-rfp) — DBR77; RFQ versus RFP, package contents, comparing bids
2. [CapEx vs. OpEx](https://www.wallstreetprep.com/knowledge/capex-vs-opex/) — Wall Street Prep; definitions, depreciation, statement treatment
3. [Increasing lead times for automation components become an issue for systems integrators](https://www.assemblymag.com/articles/94746-increasing-lead-times-for-automation-components-become-an-issue-for-systems-integrators) — Assembly Magazine, February 2019; robot and component lead times
4. [We're Ready When You Are](https://universal-robots.com/about-universal-robots/news-centre/we-are-ready-when-you-are) — Universal Robots, September 2022; two-week cobot shipping claim
5. [Brownfield automation retrofit: how long line conversion takes](https://www.irecruit.co/insights/brownfield-automation-retrofit-how-long-line-conversion-takes) — iRecruit, August 2026; lead times and project phase durations
6. [IEC 62381:2024](https://webstore.iec.ch/en/publication/67572) — IEC webstore; FAT, SAT, and SIT standard scope

## Acceptance tests (FAT and SAT)
id: acceptance-tests
requires: purchasing, cycle-time
aka: FAT, SAT, factory acceptance test, site acceptance test, buyoff, run-off

### Plain
Acceptance tests are the formal exams a robot cell must pass before the buyer accepts it and pays. The first exam happens at the builder's workshop, and the second after the cell is installed in the buyer's plant. It is like test-driving a car at the dealer, then checking it again on your own roads with your own loads, using a checklist you both signed before the first drive.

### Where the analogy breaks
A car is finished before the test drive, but a cell at its first test is missing much of its real world: the plant's conveyors, network, cold room, ingredients, and operators. So passing the first exam proves less than it seems.

### Precise
**FAT** (factory acceptance test) is run at the integrator's shop before the cell ships; **SAT** (site acceptance test) is run at the plant after installation [1][2]. IEC 62381 (an international standard for these tests, edition 3.0 from 2024, written for process-plant automation) defines FAT and SAT, adds an optional factory integration test and a site integration test, and supplies checklists for building project test plans; its stated purpose is to show the system meets the agreed specification [1].

What gets measured: at FAT, handling of representative parts, cycle time, safety functions, I/O (each signal between the controller and its devices), network communication, and the software versions shipped [2][3]. At SAT, the same targets under real conditions: rate (parts per hour or per shift), availability (time without unplanned stops), quality (good-part rate and scrap), safety devices, and integration with plant systems [2][3]. Criteria must be measurable pass/fail numbers signed before testing starts; failures go on a **punch list** (a list of open defects), rated by severity, and blocking items are fixed and re-tested before shipping or handover [4].

Payments are tied to these tests. One guide gives a FAT pass as typically releasing a 70-80% progress payment and SAT the remaining 20-30% [3], though real splits are negotiated per contract. Without formal acceptance, "finished" is a matter of opinion, and the builder loses its reason to fix the last few problems once it is fully paid.

### On the cheese plate line
At FAT, the integrator runs the full line with real grapes, apples, crackers, and cheese at 200 plates an hour for a set period (say four hours, an illustrative figure), counting mis-picks, plates rejected at inspection, and each station's measured time against the 18-second takt. Unless the integrator has a cold room, that test runs at room temperature, which is why SAT repeats the rate run in the plant's 2-4 C room, with the plant's own ingredient deliveries, and includes a full washdown followed by a clean restart. A contract might require, for example, a full shift at rate with at least 99% of plates complete and correct (illustrative terms, not an industry figure).

### Elsewhere
For a process-plant control system, such as a chemical plant's, FAT is dominated by checking signals: one guide budgets 1-3 days for I/O verification with every point checked individually, 2-5 days for control logic, and 1-3 days for performance testing [4]. Robot makers can take part too: Stäubli sells a FAT service in which its engineers check that an integrator's cell configures and uses the robot according to Stäubli's recommendations before it ships [5].

### Why it exists
The buyer is paying for performance it cannot see until the cell runs, and the builder needs a clear finish line to get paid. Two stages split the risk: FAT catches problems while the builder's engineers and tools are on hand, and SAT confirms the cell works in the real plant.

### Connects to
- [[purchasing]] — the contract defines the tests and ties payments to them
- [[commissioning]] — SAT happens inside commissioning, after installation and start-up
- [[cycle-time]] — the headline number is usually the measured rate against the takt target
- [[oee]] — availability and quality measured at SAT are two of OEE's three factors
- [[safety-circuit]] — every safety function is tested and documented before acceptance

### Real products and tools
- **IEC 62381:2024** — requirements and checklists for FAT, SAT, and integration tests [1]
- **Stäubli FAT service** — a robot maker's check of an integrator's cell before delivery [5]
- **Punch list tracking in a CMMS** (computerized maintenance management system: software that tracks equipment work orders) — for example iFactory, which rates items as pass, conditional pass, or hold [4]

### Common misconception
**Misconception:** Once the cell passes FAT, the hard part is over.

**Reality:** FAT proves the cell works in the builder's shop, under the builder's conditions, often with carefully chosen parts. Plant temperature, real part variation, plant networks, and real operators only show up at SAT and during ramp-up, which is why the final payment is usually held until SAT [3].

### Key numbers
- Payment split in one guide: 70-80% released on FAT pass, 20-30% on SAT pass; actual splits set by contract [3]
- FAT effort for a control system: I/O verification 1-3 days, logic testing 2-5 days, performance testing 1-3 days; scales with signal count and complexity [4]

### Sources
1. [IEC 62381:2024 Automation systems in the process industry - FAT, SAT, and SIT](https://webstore.iec.ch/en/publication/67572) — IEC webstore; edition 3.0, July 2024; scope and purpose
2. [How does commissioning work for turnkey robot solutions?](https://blog.unchainedrobotics.de/en/how-does-commissioning-work-for-turnkey-robot-solutions) — Unchained Robotics, 2026; what FAT and SAT test
3. [Acceptance Testing Phases in Industrial Automation Projects](https://industrialmonitordirect.com/blogs/knowledgebase/acceptance-testing-phases-in-industrial-automation-projects-sat-fat-uat-and-usr) — Industrial Monitor Direct, July 2026; FAT and SAT contents, payment milestones
4. [Greenfield Factory Commissioning: A Complete FAT/SAT and Startup Guide](https://ifactoryapp.com/greenfield-consulting/greenfield-factory-commissioning-fat-sat-startup-guide) — iFactory, March 2026; FAT task durations, punch list ratings (vendor guide)
5. [Services for Stäubli integrators](https://www.staubli.com/content/dam/robotics/products/robots/services/Services-for-Stäubli-integrators-brochure-EN.pdf) — Stäubli brochure, January 2026; robot-maker FAT service

## Commissioning and ramp-up
id: commissioning
requires: acceptance-tests
aka: start-up, cold commissioning, hot commissioning, ramp-up, handover

### Plain
Commissioning is installing the cell at the plant and bringing it to life step by step: first with nothing in it, then with real product, until it runs at full speed. Ramp-up is the following weeks, when output climbs from shaky to steady. It is like opening a new restaurant kitchen: you connect gas and water, test every burner, cook practice dinners, and only then open to a full house, and even then the first weeks are slower than later ones.

### Where the analogy breaks
In a new kitchen the equipment mostly works on day one and the cooks are the slow part. In a robot cell the machine itself is still being tuned during ramp-up, as grip settings, timing, and vision thresholds change based on what real production reveals.

### Precise
One integrator describes on-site commissioning in phases: installation (assembly, alignment, utility hookup), **cold commissioning** (testing axes, safety functions, and signals with no product), **hot commissioning** (running real material, tuning parameters, performance runs), SAT, and handover with training and documentation [1]. Before automatic running, loop checks (verifying each wire and signal end to end) and safety validation are done; a 2026 retrofit guide budgets 2-5 days and 3-10 days for these [2]. Virtual commissioning done earlier ([[cell-design]]) shortens this phase by debugging control logic before the hardware arrives.

**Ramp-up** follows. Output starts below target and rises as faults are fixed, operators learn recovery procedures, and parameters are tuned. The same guide puts ramp-up to stable output at 2-8 weeks or more, and says regulated plants may need 25-50% more commissioning time [2]. The on-site phase alone ranges from a few days for a simple pick-and-place cell to several weeks or months for a vision-heavy cell tied into plant software, and typically costs 10-20% of the system investment [1]. Skipping steps (running product before cold checks are complete) risks crashes and broken tooling; under-planning ramp-up means the savings in the business case arrive months late.

### On the cheese plate line
Cold commissioning: each robot moves through its taught positions over empty trays, every e-stop and light curtain is tripped and checked, and conveyor tracking is verified with marked dummy trays. Hot commissioning adds one ingredient at a time, then the full recipe at reduced speed, say 100 plates an hour (an illustrative figure), raising the rate as the grape and apple stations' mis-pick rates fall. Ramp-up also has to include the sanitation crew, because the first real washdowns are where water ingress or a restart sequence operators cannot follow would show up.

### Elsewhere
A palletizing cell at the end of a beverage line, handling several case sizes and pallet patterns, counts as a medium job in one integrator's guideline: 1-3 weeks on site. Add machine vision for many part variants and a link to the MES (manufacturing execution system: the plant software that tracks orders and production) and the same integrator expects several weeks to months [1].

### Why it exists
A cell that passed FAT has been taken apart, shipped, and rebuilt in a new building with new power, air, network, and people. Commissioning re-proves everything in order, safest steps first, and ramp-up gives the plant a planned path from "it runs" to "it runs at rate every shift."

### Connects to
- [[acceptance-tests]] — SAT happens inside commissioning, after hot commissioning
- [[plc-programming]] — much of commissioning is debugging the control logic that links robots, conveyors, and sensors
- [[safety-circuit]] — every safety function is validated before the cell runs automatically
- [[oee]] — ramp-up is tracked as OEE climbing toward its target
- [[support]] — handover moves responsibility from the integrator's engineers to the plant's maintenance team

### Real products and tools
- **Virtual commissioning tools** — Siemens Process Simulate and Visual Components can run the real PLC program against a simulated cell before installation (see [[cell-design]])
- **HMI** — the operator screens used during commissioning to run and step stations one at a time (see [[hmi]])
- **Commissioning checklists** — phase-by-phase lists from cold checks to handover, such as the ones integrators publish for turnkey cells [1]

### Common misconception
**Misconception:** When the integrator leaves, the line is running at full speed.

**Reality:** Handover usually follows SAT, but stable output can take 2-8 weeks or more beyond that [2]. A business case that assumes full savings from the first day overstates the first year's return.

### Key numbers
- On-site commissioning: a few days to 1 week (simple pick and place), 1-3 weeks (palletizing with variants), several weeks to months (vision with MES link); FAT, transport, and training extra [1]
- On-site commissioning cost: about 10-20% of the system investment [1]
- Ramp-up to stable output: 2-8 weeks or more; depends on staffing, late scope changes, and integration surprises [2]
- Regulated plants: 25-50% more commissioning time [2]

### Sources
1. [How does commissioning work for turnkey robot solutions?](https://blog.unchainedrobotics.de/en/how-does-commissioning-work-for-turnkey-robot-solutions) — Unchained Robotics, 2026; phases, on-site durations by complexity, commissioning cost share
2. [Brownfield automation retrofit: how long line conversion takes](https://www.irecruit.co/insights/brownfield-automation-retrofit-how-long-line-conversion-takes) — iRecruit, August 2026; loop checks, safety validation, ramp-up durations

## Support and maintenance
id: support
requires: commissioning, oee
aka: maintenance, preventive maintenance, predictive maintenance, spares, remote support, SLA

### Plain
Support is everything that keeps the cell running for the years after it starts: routine servicing, spare parts on the shelf, and someone to call when it breaks. It is like owning a delivery van: you change the oil on schedule, keep a spare tire, and use a garage that promises fast repairs, because every day the van sits idle costs you deliveries.

### Where the analogy breaks
A van mostly breaks mechanically and gets fixed at a garage, but a robot cell also fails through software, network, and settings, so much of its support happens remotely by logging in. And the "garage" is often split three ways, between the robot maker, the integrator, and the plant's own technicians.

### Precise
Maintenance comes in three kinds. **Corrective** maintenance fixes something after it fails. **Preventive** maintenance (PM) checks or replaces wear items on a schedule, such as gear grease, cables, controller backup batteries, and gripper cups, at intervals the robot maker's manual sets for each model [unverified: no specific manual opened]. **Predictive** maintenance watches the machine's own data for early signs of wear; FANUC's Zero Down Time (ZDT), for example, looks for abnormal mechanical health in reducers and servo motors and alerts users before a failure so the repair can be scheduled [1].

A **spares** plan decides which parts sit on the plant's own shelf (cheap fast-wearing items, and anything whose absence would stop the line) and which are ordered when needed; robot makers run parts catalogs and portals for this [2][3]. **Remote support** lets the integrator or robot maker log in to diagnose a fault without traveling, over a secure connection the plant's IT team approves. An **SLA** (service level agreement: a contract with measurable promises, such as how fast someone responds, how soon a technician is on site, or a minimum uptime) sets what the plant can expect. Without planned support, small failures become long stoppages: a worn vacuum cup is a minutes-long swap if it is on the shelf and a days-long outage if it is not.

### On the cheese plate line
The plant stocks spare vacuum cups for the apple and cheese stations, spare soft fingers for the grape gripper, and a spare motor and drive for the robot model it uses most, because one missing part stops all 200 plates an hour (an illustrative stocking plan). PM is scheduled into sanitation windows, and seals and cable entries are inspected after washdowns, since water getting into electronics is a known risk in washdown cells [unverified]. An SLA with the integrator might promise remote login within an hour and a technician on site the next day (illustrative terms).

### Elsewhere
A car plant with hundreds of robots cannot afford a gearbox failing mid-shift. With predictive monitoring such as FANUC ZDT, which tracks reducer and motor health and shows each robot's condition and maintenance status in a web portal, the replacement can be moved into a planned shutdown instead [1]. FANUC America also advertises a 24/7 technical support line and lifetime support for its products, through 289 service locations in 108 countries [2].

### Why it exists
A robot cell earns its payback by running many hours, and every unplanned stop erases part of it. Support turns random, expensive breakdowns into planned, cheap interventions, and service contracts make clear who fixes what, and how fast.

### Connects to
- [[oee]] — availability, the first factor of OEE, is what maintenance protects
- [[telemetry-logs]] — predictive maintenance depends on logged motor, joint, and fault data
- [[fleet-management]] — watching many robots across sites is the software side of support
- [[remote-updates]] — the remote access used for support is the same channel used to push software updates
- [[raas]] — in pay-per-use deals the provider carries the maintenance burden and the uptime risk

### Real products and tools
- **FANUC Zero Down Time (ZDT)** — predictive analytics on robot mechanical health, viewed through a web portal [1]
- **FANUC America technical support** — 24/7 call center, robot parts, field service, FANUC Academy training [2]
- **MyStäubli portal** — spare parts catalog, documents, and incident reporting; Stäubli also sells a "Welcome Pack" with priority technician intervention [3]
- **Formic managed service** — SLAs, 24/7 support, Formic-managed spares, and predictive maintenance bundled into a monthly agreement [4]

### Common misconception
**Misconception:** Robots barely need maintenance because they never get tired.

**Reality:** Robots wear. Gears, bearings, cables, and grippers degrade with every cycle, which is exactly what tools like FANUC ZDT exist to watch [1]. Plants that skip preventive maintenance and spares planning find that uptime is limited by their cheapest parts.

### Key numbers
- FANUC America service footprint: 289 service locations in 108 countries (company claim, as of November 2026) [2]

### Sources
1. [ZDT (Zero Down Time)](https://www.fanucamerica.com/products/robots/zdt-zero-down-time) — FANUC America; predictive monitoring of reducers and servo motors, web portal
2. [Support](https://www.fanucamerica.com/support) — FANUC America; 24/7 call center, lifetime support, service locations
3. [Services for Stäubli integrators](https://www.staubli.com/content/dam/robotics/products/robots/services/Services-for-Stäubli-integrators-brochure-EN.pdf) — Stäubli brochure, January 2026; spare parts portal, Welcome Pack, fleet monitoring software
4. [Full Service Automation](https://formic.co/full-service-automation) — Formic; SLAs, 24/7 support, managed spares, predictive maintenance

## Buying a robot versus paying per use
id: raas
requires: purchasing, support
aka: robots as a service, RaaS, pay per use, robot subscription

### Plain
Instead of buying a robot cell, a plant can pay a provider to install, own, and maintain it, and pay a fee by the hour or by the month. It is like the difference between buying a car and leasing one with servicing included: you skip the big upfront payment and repairs are someone else's problem, but you may pay more over a long period and you own nothing at the end.

### Where the analogy breaks
A leased car is a standard model the dealer can lease to someone else afterward, but a robot cell is usually engineered for one plant's task. So providers need a minimum term to recover that engineering, and leaving early is much harder than handing back a car.

### Precise
In **RaaS** (robots as a service), the provider owns the equipment and handles scoping, integration, monitoring, and maintenance, and the customer pays a recurring fee [1][2]. Formic, a US provider, was reported in 2023 to charge 8-40 USD per robot-hour, billing only for hours the robot ran and met agreed cycle-time goals, with minimum terms of typically one to five years [1]. By November 2026 its site describes one flat monthly rate that includes installation, SLAs, 24/7 support, managed spares, and predictive maintenance [2]. In warehouses, Locus Robotics sells its mobile picking robots as RaaS, paid as a predictable operating expense that includes deployment, maintenance, and software updates [4].

The trade is cash and risk against total cost and control. RaaS avoids a capital request, moves performance risk to the provider (who is paid only while the cell runs), and suits uncertain volumes or short product lives. Buying avoids paying the provider's margin and financing charges, which matters most over a long, stable life, and gives full control over changes. It also avoids depending on the provider's survival: Rapid Robotics, an early cobot RaaS startup, is reported to have shut down, with its assets bought by RobCo in 2025 [5] [unverified: secondary source only]. Accounting is not automatic either: under current lease rules (ASC 842 in the US, IFRS 16 elsewhere), a contract that gives the customer control of a specific machine can count as a lease and land on the balance sheet anyway [unverified: standards not opened].

### On the cheese plate line
If the airline catering contract that justifies the line runs only three years, a RaaS deal with a matching term pushes the risk of that contract ending onto the provider. A middle path is also possible: the plant buys the custom pick stations, where its own know-how lives, and rents commodity end-of-line equipment such as a palletizer. As one data point, Formic advertised a palletizer at 4,750 USD a month for a three-month trial, described as 40% off its regular price, with maintenance included [3].

### Elsewhere
Icon Injection Molding, a plastics molder, paid Formic about 10 USD an hour for a six-axis FANUC robot tending a molding machine, below Arizona's 13.85 USD minimum wage at the time, with Formic programming, monitoring, and maintaining it [1]. In warehouses, Ulta Beauty roughly doubled its Locus robot fleet for peak season, which is easy when extra robots are rented rather than bought [4].

### Why it exists
Many mid-sized manufacturers struggle to get a large capital budget approved, lack in-house robot technicians, or cannot predict their volumes years ahead; Formic, for example, built its business around customers with roughly 300-400 employees [6]. RaaS sells the outcome (hours of working automation) instead of the equipment, and the provider spreads engineering and maintenance skills across many customers.

### Connects to
- [[scoping]] — the ROI question becomes whether the fee is lower than the labor and risk it replaces
- [[purchasing]] — RaaS replaces a capital purchase with a service contract
- [[support]] — in RaaS the provider owns maintenance, spares, and uptime
- [[fleet-management]] — providers rely on monitoring every customer's robots remotely to keep service costs down
- [[mobile-robot]] — warehouse mobile robots, such as Locus's, are sold this way

### Real products and tools
- **Formic** — US provider of full-service automation (palletizing, machine tending) on monthly agreements; active as of November 2026 [2][3]
- **Locus Robotics** — warehouse mobile picking robots and LocusONE software offered as RaaS; active as of 2026 [4]
- **Rapid Robotics** — former cobot RaaS startup; reported shut down, with assets acquired by RobCo in 2025 [5] [unverified: secondary source only]

### Common misconception
**Misconception:** RaaS is always cheaper because there is no upfront cost.

**Reality:** The provider still pays for the robot and the engineering, and recovers that cost, plus financing and margin, through the fee and the minimum term. RaaS lowers upfront cash and shifts risk; whether it is cheaper over the cell's life depends on utilization, contract length, and how long the plant would have kept the cell.

### Key numbers
- Formic hourly rate (2023 report): 8-40 USD per robot-hour, depending on contract length [1]
- RaaS minimum terms: typically 1-5 years (2023 report) [1]
- Formic palletizer trial (seen November 2026): 4,750 USD per month for three months, stated as 40% off the regular price [3]

### Sources
1. [Startup's automation takes over potentially dangerous job](https://www.plasticsmachinerymanufacturing.com/injection-molding/article/53067225/startups-automation-takes-over-potentially-dangerous-job) — Plastics Machinery & Manufacturing, August 2023; Formic hourly pricing, billing only for running hours, 1-5 year terms
2. [Full Service Automation](https://formic.co/full-service-automation) — Formic, fetched November 2026; flat monthly rate and included services
3. [Try a palletizer](https://land.formic.co/try-a-palletizer-100k) — Formic offer page, fetched November 2026; 4,750 USD per month trial
4. [Locus Robotics](https://locusrobotics.com/) — Locus Robotics home page, fetched November 2026; RaaS model, peak scaling examples
5. [RaaS repricing: automation winners and losers 2026](https://grabarobot.com/blog/raas-repricing-automation-winners-losers-2026/) — Grabarobot blog, July 2026; Rapid Robotics shutdown and RobCo acquisition (secondary)
6. [Formic Offers Robotics as a Service and Financing to Manufacturers](https://www.robotics247.com/article/formic_offers_robotics_as_a_service_and_financing_to_manufacturers) — Robotics 24/7, August 2021; Formic's model and target customers
