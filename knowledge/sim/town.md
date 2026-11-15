# Town

## District: parts
title: Parts Quarter
concept: component-makers
tagline: The gears, motors, grippers, and cameras inside and on every robot.

### Plain
Component makers are the parts suppliers of the robot world, like the companies that make brakes and tires for car brands. They build the gears, motors, sensors, grippers, and cameras that go inside or onto a robot. Most people never see their names, but no robot works without them. On the cheese plate line, the gears in the arms' joints and the suction cups and soft fingers on the ends of the arms come from here.

### Sells
Precision reducers (gearboxes that trade motor speed for turning force, with almost no play), servo motors, encoders, brakes, bearings, and drives. Integrated actuators (gear, motor, and encoder in one unit). Grippers, vacuum cups, tool changers, and force-torque sensors. Industrial cameras and depth sensors. Onboard computers. Spare parts for all of these.

### Buys from
Steel, magnet, and electronics suppliers; machine-tool makers, for grinding and machining equipment; chip makers, for drives, sensors, and computers; contract manufacturers; and tooling companies, for CAD (computer design) and engineering software.

### Sells to
Robot makers, on long-term supply contracts for joint parts. Integrators and distributors, who buy end-of-arm parts from catalogs. End users, for spares and retrofits. Application companies that build their own robots or cells.

## Building: gear-works
title: Gear Works
district: parts

### About
This factory makes precision reducers: the [[gearbox|gearboxes]] in robot joints that make each joint turn slower than its motor but with more force, with almost no play. It sells them to robot makers on long supply contracts, so the logo on the finished arm is never its own ([[component-makers]]). Real examples of this business: Nabtesco (Japan) estimates it holds about 60% of the market for precision reduction gears in the joints of medium and large industrial robots, and Harmonic Drive Systems (Japan) makes compact strain wave gears with zero backlash (no slack between the teeth).

### Job functions
- **Mechanical design engineer** — designs gear teeth, bearings, and housings, and runs stiffness and lifetime calculations.
- **Manufacturing process engineer** — runs the grinding, heat-treating, and assembly lines that hold micrometer tolerances, and fixes yield problems (too few units coming out good).
- **Quality engineer** — measures backlash and stiffness on finished units, runs life tests, and investigates customer returns.
- **Key account manager** — owns the relationship with a few large robot makers and negotiates annual volume and price.

## Building: gripper-shop
title: Gripper Shop
district: parts

### About
This shop sells what goes on the end of the arm: [[vacuum-gripper|vacuum cups]], [[soft-gripper|soft fingers]], [[tool-changer|tool changers]], and [[ft-sensor|force-torque sensors]]. Unlike joint parts, these are usually sold through catalogs to integrators and plants and bolted onto any brand of robot, because the tool changes with every job. The cheese plate line's cups and the grape station's soft fingers come from food-grade lines like these, and the plant keeps spares of both on its own shelf ([[support]]). Owners change too: in August 2024 Soft Robotics sold its gripper business, including its mGrip food-handling fingers, to the vacuum specialist Schmalz (Germany), so a spare-parts order for those fingers now goes to a different company.

### Job functions
- **Application engineer** — helps a customer's engineers size the right gripper or vacuum cup for their load and speed, and answers technical questions.
- **Channel sales representative** — sells catalog grippers and sensors through distributors and to integrators, and runs product demos.
- **Product manager** — decides what to build next, such as a washdown-rated version of a gripper for food plants.
- **Field service technician** — visits plants to diagnose a failed gripper, sensor, or gear unit and replace it.

## Building: sensor-house
title: Sensor House
district: parts

### About
This building makes the electronics that go into and onto robots: [[encoder|encoders]] (sensors that measure joint angle), [[servo-drive|servo drives]] (the electronics that feed current to each motor), industrial cameras, depth sensors, and onboard computers. Onboard computers that run learned models on the robot are a newer category: NVIDIA (US), for example, sells Jetson Thor for this ([[on-robot-inference]]). Supply chain planners here turn robot makers' build forecasts into production plans and manage long lead times on electronics.

### Job functions
- **Firmware engineer** — writes the code inside smart sensors, drives, and encoders.
- **Supply chain planner** — turns robot makers' build forecasts into production plans and manages long lead times on steel and electronics.

## District: robot-row
title: Robot Row
concept: robot-makers
tagline: Arms and the control cabinets that drive them, sold to thousands of factories.

### Plain
A robot maker is like an engine maker that sells engines to boat builders. It designs and builds the arm and the cabinet that drives it, but on its own the arm does nothing useful: someone still has to give it a hand, eyes, a job, and a place in a line. The big brands sell the same arm to thousands of different factories.

### Sells
Robot arms with their controllers (the computer cabinet that drives the motors) and teach pendants (the handheld terminal used to program them). Mobile robots and cobots (arms built to work safely next to people). Options such as food-grade or cleanroom versions. Programming and simulation software, training courses, spare parts, repair, and service contracts. Increasingly, standard kits and complete cells.

### Buys from
Component makers, for reducers, motors, encoders, brakes, bearings, and cables; electronics and chip suppliers, for controllers; casting and machining suppliers, for arm structures; and tooling companies, for CAD, simulation, and software tools.

### Sells to
Integrators, the main channel for most plants. Large end users directly, in automotive, electronics, and logistics. Distributors. Application companies that build products on top of standard arms. Universities and research labs.

## Building: arm-hall
title: Arm Assembly Hall
district: robot-row

### About
Here the robot maker designs each arm's links, joints, and cable routing, then assembles, calibrates, and tests every unit before it ships ([[robot-makers]]). It buys key parts such as reducers from the Parts Quarter, though some robot makers build their own motors. For food plants it offers hygienic versions: FANUC (Japan), for example, sells the DR-3iB/6 STAINLESS, which it calls its first stainless steel food-grade [[delta|delta]] robot for picking and packing primary food. FANUC reports more than 1 million of its robots installed worldwide.

### Job functions
- **Mechanical design engineer** — designs arm links, joints, and cable routing, and trades off weight, stiffness, and reach.
- **Manufacturing technician** — assembles, calibrates, and tests each robot before it ships.
- **Product manager** — decides which models and options to build, such as a stainless washdown version.

## Building: controller-lab
title: Controller Lab
district: robot-row

### About
This lab writes the software inside the [[robot-controller|robot controller]]: motion planning, servo control (the fast loop that keeps each motor at its commanded angle), and built-in safety functions such as speed and force limits; the robot maker then certifies the finished robot against the main [[safety-standards|safety standards]]. Each brand has its own programming language ([[vendor-languages]]), so moving a cell from one brand to another means rewriting its programs, not just swapping the arm. That is a large part of why a plant's choice of robot brand is hard to undo.

### Job functions
- **Motion control software engineer** — writes the trajectory and servo-control code that runs in the controller.
- **Safety engineer** — designs safety functions such as speed and force limits and documents compliance with robot safety standards.

## Building: test-lab
title: Test Pick Lab
district: robot-row

### About
Before a plant spends real money, samples of its product come to a lab like this for a proof of concept: a short test rig that tries the grip and the motion ([[scoping]]). For the cheese plate line, the riskiest items, grape bunches and wet apple slices, go first, in a 2-4 C room, because a grip that works on a room-temperature slice proves nothing about a cold, wet one. The lab also runs reach and cycle-time studies to show a robot fits the customer's time budget ([[cycle-time]]). Integrators run the same kind of tests in their own labs.

### Job functions
- **Application engineer** — runs reach and cycle-time studies and test picks to prove a robot can do a customer's job.
- **Regional sales manager** — owns sales to large accounts and integrators in a territory.

## Building: service-center
title: Service Center
district: robot-row

### About
After a cell starts running, the robot maker's share of its [[support|support]] comes from here (the integrator and the plant's own technicians handle the rest): field service engineers, spare parts catalogs, remote diagnosis, and predictive maintenance (watching each robot's own data for early signs of wear). FANUC's Zero Down Time, for example, watches the health of reducers and servo motors on connected robots and warns before a failure, so the repair can be planned. The center also trains customers and approved integrators to program and maintain the brand's robots, because [[integrators|integrators]] are the main channel through which most plants buy robots.

### Job functions
- **Field service engineer** — travels to plants to repair robots, replace reducers or motors, and restore production.
- **Training instructor** — teaches customers and integrators to program and maintain the brand's robots.
- **Channel manager** — recruits, trains, and supports the network of approved integrators.

## District: integrators
title: Integrator Yard
concept: integrators
tagline: The general contractors who turn parts into one working line for one plant.

### Plain
A system integrator is the general contractor of automation. Like a builder who buys lumber, windows, and a furnace from different makers and builds one family's house to fit their lot, it buys robots, grippers, cameras, conveyors, and fencing and builds one working line for one plant. It also programs all the pieces to work together and stays on call when something breaks.

### Sells
Turnkey robot cells and lines (delivered ready to run). Feasibility studies and test picks. Mechanical, electrical, and safety design. PLC programming (the PLC is the industrial computer that sequences the line), HMI programming (the HMI is the operator touch screen), and robot programming. Installation and commissioning, operator and maintenance training, service contracts, and upgrades.

### Buys from
Robot makers, often as an approved integrator; component makers and distributors, for grippers, cameras, sensors, and safety devices; conveyor and packaging-machine makers; electrical and machining suppliers; and tooling companies, for simulation and offline programming software.

### Sells to
End users: plants in automotive, food, consumer goods, life sciences, and logistics. Sometimes application companies, which hire integrators to install their stations into a larger line.

## Building: proposal-office
title: Proposal Office
district: integrators

### About
A plant's request for quotation (a request for binding prices on a defined scope) lands here, and sales engineers turn it into a scope and a price ([[purchasing]]). Every project starts with [[scoping|feasibility]]: can a robot grip each item reliably, and can each station meet its time budget? For the cheese plate line, 200 plates an hour gives an 18 s takt (time budget per plate), so the apple station must place about four slices in 18 s, or about 4 s per slice once the tray belt's 1-2 s step is taken out. Each bid lists its assumptions and its deviations from the request, and that list is often the page the buyer learns most from.

### Job functions
- **Sales engineer** — visits the plant, understands the problem, and turns it into a scope and price.
- **Business development manager** — finds new customers and keeps the relationship with robot makers.

## Building: design-studio
title: Cell Design Studio
district: integrators

### About
Designers lay out the whole line in 3D simulation and run three checks before purchase orders go out: every robot reaches its pick and place points, each station meets its time budget, and nothing collides ([[cell-design]]). If the model shows the cheese station at 6.5 s per wedge (19.5 s per plate, over the 18 s time budget per plate), fixes such as a second robot, a faster arm, or a gripper that picks two wedges at once cost nothing to try on screen. A risk assessment runs alongside and covers every task people do in the cell, such as clearing a tray jam, swapping vacuum cups, and the nightly washdown ([[safety-standards]]). A simulated cycle time is a strong estimate, not a guarantee, and no simulation proves that a gripper will hold a cold apple slice.

### Job functions
- **Mechanical designer** — designs frames, guarding, grippers, and fixtures in CAD (computer models of every part).
- **Controls engineer** — writes PLC and HMI programs, designs the electrical and safety circuits, and can test the PLC logic against the simulation before the hardware exists (virtual commissioning).
- **Vision engineer** — selects cameras and lighting and builds the inspection and guidance recipes.

## Building: build-hall
title: Build Hall
district: integrators

### About
The integrator builds and debugs the whole line in its own shop, then runs the factory acceptance test, or FAT ([[acceptance-tests|Acceptance tests]]): the customer's engineers watch it run against criteria agreed in the contract. For the cheese plate line, that means real grapes, apples, crackers, and cheese at 200 plates an hour for a set period, counting mis-picks, rejected plates, and each station's time against the 18 s takt (time budget per plate), at room temperature unless the integrator has a cold room. Failures go on a punch list (a list of open defects), and blocking items are fixed and re-tested before the line may ship. One guide says passing FAT typically brings the total paid to 70-80% of the price, with the rest held for the site test; real splits are set per contract.

### Job functions
- **Project manager** — runs schedule, budget, and customer communication from order to final acceptance.
- **Panel builder** — wires the electrical control cabinets in the shop.
- **Robot programmer** — teaches robot paths, sets up vision, and tunes cycle time.

## Building: field-depot
title: Field Crew Depot
district: integrators

### About
The crews based here spend most days at customers' plants. They install the line, take it through [[commissioning|commissioning]] (first testing every axis, signal, and safety function with no product, then running real product) and the site acceptance test, then train the plant's staff and hand over. After handover they answer breakdown calls and do preventive maintenance ([[support]]); a service level agreement (a contract with measurable promises, such as response time) sets how fast they must respond.

### Job functions
- **Field commissioning technician** — installs the system at the plant and gets it running through the site acceptance test.
- **Service technician** — answers breakdown calls and does preventive maintenance after handover.

## District: applications
title: Applications Lane
concept: application-companies
tagline: One standard robot station for one job, often leased instead of sold.

### Plain
An application company sells a finished robot station for one job instead of a custom project. It is like buying a dishwasher instead of hiring a contractor to build a custom washing station: the machine is designed for exactly one task, and the same design ships to many customers. In robotics, that job might be putting food into meal trays or moving cases in a warehouse. Unlike a dishwasher, the station is often leased rather than sold, and its maker often keeps watching and updating it remotely.

### Sells
Standard robot stations or systems for one application, usually with software, learned models, monitoring, and service bundled in. They are sold as a lease or subscription, per unit of output, or as a purchase with a service contract.

### Buys from
Robot makers, for standard arms, or component makers, when it builds its own robot; gripper, camera, and compute suppliers; model companies, for some; tooling companies, for simulation, data, and fleet software; cloud providers; and sometimes integrators, for installation.

### Sells to
End users in one industry: food manufacturers and caterers, warehouses and retailers, and logistics companies.

## Building: station-works
title: Station Works
district: applications

### About
Engineers here design one standard station and build it many times: the frame, grippers, and washdown enclosure, plus the motion, perception, and control software and the [[learned-policy|learned models]] that let one design handle many customers' products ([[application-companies]]). Repetition is the advantage over an integrator, which re-engineers for each customer. Chef Robotics (US), for example, sells food-assembly robots running its own software, ChefOS, and lists airline catering among its industries.

### Job functions
- **Hardware engineer** — designs the station frame, grippers, and washdown enclosure.
- **Robotics software engineer** — writes the motion, perception, and station-control software.
- **Machine learning engineer** — trains and evaluates the models that decide where and how to pick.
- **Data operations specialist** — labels and curates recorded picks for training.

## Building: lease-office
title: Lease Office
district: applications

### About
Here a plant can rent working robots instead of buying them ([[raas]]). Under robots-as-a-service (RaaS), the provider owns the station and the plant pays a recurring fee covering hardware, software, updates, and service; Chef Robotics, for example, leases its food-assembly robots this way. If the catering contract that justifies the cheese plate line runs only three years, a lease with a matching term pushes the risk of that contract ending onto the provider. RaaS is not automatically cheaper: the provider still recovers the robot and engineering cost, plus financing and margin, through the fee and a minimum term.

### Job functions
- **Account executive** — closes contracts and negotiates lease terms.
- **Finance analyst** — models lease pricing and how long each station takes to pay back its hardware cost.
- **Solutions engineer** — assesses a prospect's line and shows how the station would fit.
- **Customer success manager** — tracks each customer's results and plans new stations or product changes.

## Building: ops-center
title: Remote Operations Center
district: applications

### About
Many application companies keep watching their stations after delivery: Chef Robotics' lease, for example, includes 24/7 performance monitoring. Specialists here watch the deployed fleet ([[fleet-management]]) and step in remotely when a station gets stuck ([[teleop-modes]]), while deployment engineers and field technicians install and repair stations on site. Under a lease the upkeep is the provider's cost, so watching every customer's robots remotely is how it keeps service costs down ([[support]]).

### Job functions
- **Remote operations specialist** — watches the deployed fleet and steps in remotely when a station gets stuck.
- **Deployment engineer** — installs stations at a customer site and tunes them for that customer's products.
- **Field service technician** — visits sites for repairs and planned maintenance.

## District: model-lab
title: Model Lab
concept: model-companies
tagline: The learned robot "brains" that other companies adapt to their own robots.

### Plain
A robot model company writes "brain" software that lets robots learn skills from examples instead of being programmed step by step. It is like a company that makes a phone operating system: it does not build the phone, but hopes many phone makers will run its software. Unlike a phone system, a robot model usually needs new examples recorded on the target robot doing the target task before it works reliably.

### Sells
Trained models: open weights (the trained model files, published for anyone), licensed weights, or API access. Fine-tuning (further training on a customer's own data) and deployment support. Data tools. Sometimes reference hardware designs or evaluation services.

### Buys from
Cloud and GPU providers, for training compute; robot makers and component makers, for lab robots used in data collection; teleoperation labor and data vendors; and venture investors, whose capital, not goods, is the main input today.

### Sells to
Application companies and robot makers that build products on the model; large end users with in-house robotics teams; and researchers and universities, often for free.

## Building: training-hall
title: Model Training Hall
district: model-lab

### About
Researchers here train foundation models (large neural networks trained on broad data, then adapted to specific uses) for robots, mostly [[vla-models|vision-language-action models]], which take camera images and a text instruction and output robot motions. Computing power and robot data are the main costs. Much of this layer runs on venture capital rather than revenue: Physical Intelligence (US) raised US$600 million at about a US$5.6 billion valuation in 2025, and its technology is described as not yet commercially sold, apart from an application-only API beta that opened in October 2026, per a secondary report.

### Job functions
- **Research scientist** — designs model architectures and training methods and publishes results.
- **ML infrastructure engineer** — runs the GPU clusters and data pipelines that train models.

## Building: data-garage
title: Teleop Data Garage
district: model-lab

### About
People here drive a fleet of lab robots remotely through tasks to record training examples ([[robot-datasets]]), because data collection is this layer's largest ongoing effort. The same robots are used to measure how often a new model actually succeeds on real hardware ([[policy-evaluation]]). On the cheese plate line, the grape station is the natural place for a learned model, since no two bunches are alike: an application company could fine-tune an open base model on teleoperated grape picks recorded at that station.

### Job functions
- **Teleoperator** — remotely drives lab robots through tasks to record training examples.
- **Robot lab technician** — keeps the fleet of data-collection robots and grippers running.
- **Evaluation engineer** — designs test suites and measures how often a model succeeds on real robots.

## Building: license-office
title: License Office
district: model-lab

### About
This office decides how models reach customers ([[model-companies]]): open weights, licensed weights, API access, or partner programs. Physical Intelligence's openpi repository publishes its π0, π0-FAST, and π0.5 checkpoints (saved, trained model files) and carries an Apache 2.0 license, but also ships Google's Gemma Terms of Use, which add their own use restrictions; NVIDIA says its GR00T N1.7 model has a commercial license, with the weights under the NVIDIA Open Model License. Google DeepMind instead offers its Gemini Robotics models to more than 100 trusted testers and partners. Anyone building a paid product on a checkpoint has to check which terms cover it.

### Job functions
- **Partnerships manager** — signs and manages deals with robot makers and application companies.
- **Solutions engineer** — helps a partner fine-tune and deploy the model on their robot.
- **Developer relations engineer** — writes docs and examples and supports the open-source community.
- **Product manager** — decides which capabilities, robots, and licensing terms to support next.

## District: tool-works
title: Tool Works
concept: tooling-companies
tagline: Simulation, programming, and data software sold to everyone else on the map.

### Plain
Tooling companies sell the tools everyone else uses to design, program, and debug robots. They are like the companies that make design software and laser measuring tools for builders: they never build a house themselves, but nearly every builder pays them. In robotics that means simulation software, programming tools, and software for recording and replaying what robots did.

### Sells
Software licenses and subscriptions for simulation, offline programming (writing robot programs on a PC instead of on the real robot), development platforms, data recording and visualization, fleet monitoring, and labeling. Paid support around open-source tools. Training and consulting.

### Buys from
Cloud providers, for hosting; GPU makers, for simulation and rendering hardware; robot makers, for robot models, controllers, and partnership access to their programming interfaces; and the open-source communities whose code they build on.

### Sells to
Integrators, for design and offline programming; robot makers and application companies, for development, simulation, and data tools; model companies, for simulation and data tools; end users with in-house engineering teams; and universities.

## Building: sim-studio
title: Simulation Studio
district: tool-works

### About
This studio makes the software integrators use for [[cell-design|cell design]]: accurate models of real robots, reach and collision checks, cycle-time estimates, and offline programming (writing robot programs on a PC instead of on the real robot) in each brand's own program format. RoboDK, for example, supports more than 1,400 robots from over 80 makers, while Visual Components is owned by KUKA, which is owned by Midea; when a robot maker owns a tool, its neutrality across brands is a fair question. Physics simulators for training learned robot skills ([[simulators]]) are a different tool, though both are called simulation.

### Job functions
- **Physics and graphics engineer** — makes simulated robots, contact, and sensors behave and look like the real ones.
- **Robot integration engineer** — adds support for new robot brands and models and keeps their program translators correct.
- **Product manager** — decides which features, robot brands, and integrations come next.

## Building: data-tools
title: Data Tools Lab
district: tool-works

### About
Robots keep recording after go-live, and this lab builds the software that stores and replays those recordings ([[telemetry-logs]], [[visualization-tools]]). On the cheese plate line, each pick station saves camera and arm data in MCAP, an open file format for time-stamped streams of sensor readings and messages. When inspection rejects a plate for a missing grape bunch, engineers open that moment in a log viewer to see what the robot saw and did. Foxglove, for example, records robot logs in MCAP and lets teams visualize, search, and annotate them.

### Job functions
- **Software engineer** — builds the product, such as the simulator, programming environment, or log viewer.
- **Support engineer** — answers customer tickets and reproduces and triages bugs.

## Building: docs-house
title: Docs and Demo House
district: tool-works

### About
This building writes the documentation and tutorials, helps users in forums and at events, runs trials for prospects, and sells licenses ([[tooling-companies]]). Brand neutrality is the usual pitch: a plant or integrator with three robot brands wants one simulator and one log viewer. Open-source projects such as [[ros2]] and [[moveit]] belong to this layer too; companies earn money around them through support, hosted services, and paid features rather than licenses.

### Job functions
- **Developer advocate** — writes tutorials and examples and helps users in forums and at events.
- **Technical writer** — writes and maintains the documentation.
- **Solutions engineer** — shows prospects how the tool fits their workflow and helps run trials.
- **Account executive** — sells licenses and enterprise contracts.

## District: factory-district
title: Factory District
concept: end-users
tagline: The plants that pay for every robot on the map and run them every day.

### Plain
End users are the factories, warehouses, and kitchens that buy robots and run them every day. They are like a restaurant owner who buys ovens and dishwashers: the owner does not build the equipment, but pays for it, decides whether it was worth it, and lives with every breakdown. Unlike ovens, a robot line is usually custom-built for one plant. Every other company on this map ultimately gets its money from them ([[value-chain]]).

### Sells
Their own products and services, not robots: meals, cars, electronics, shipped orders. Some large end users also sell or license automation they built in-house, or own robot companies outright.

### Buys from
Integrators, for custom lines; application companies, for standard stations, often leased; robot makers directly, when a large plant has its own engineers; component makers and distributors, for spare parts; service providers, for maintenance contracts; and occasionally tooling companies, for in-house teams.

### Sells to
Their own customers: airlines, retailers, consumers, and other manufacturers. An airline caterer such as gategroup (Switzerland), which says it serves more than 680 million passengers a year, sells its meals to airlines.

## Building: caterer-office
title: Caterer Front Office
district: factory-district

### About
The cheese plate project starts here, with [[scoping|scoping]]: will a 200-plates-an-hour line pay for itself? Payback depends on hours run: in illustrative numbers, a 2.4 million USD line that nets about 650,000 USD a year on two shifts pays back in about 3.7 years, but on one shift it nets about 250,000 USD and takes about 9.6 years. Then comes [[purchasing|purchasing]]: the office sends the same requirements (200 plates an hour, a 2-4 C room, IP67 plus IP69K for anything sprayed directly, the plate recipe) to several integrators and reads each bid's deviations, where one bid might quietly leave out the tray denester. From here the project trail runs through the integrator's Proposal Office, Cell Design Studio, and Build Hall, then back to the Airline Catering Plant.

### Job functions
- **Plant manager** — owns output, cost, safety, and staffing for the whole site, and signs off on automation investments.
- **Finance analyst** — builds the payback case and tracks whether the line delivers the promised savings.
- **Manufacturing engineer** — designs and improves production processes and writes the requirements for new lines.
- **Procurement buyer** — runs the quoting process and negotiates contracts with integrators and suppliers.

## Building: catering-plant
title: Airline Catering Plant
district: factory-district

### About
This plant runs the cheese plate line: 200 plates an hour (one every 18 s) in a 2-4 C room. The robot at each station is a design judgment, not a rule: a washdown [[six-axis|six-axis arm]] with soft fingers picks grape bunches from a tote, [[delta|deltas]] with vacuum cups place apple slices and cheese wedges, a [[scara|SCARA]] with a vacuum cup takes cracker packs from the feeder, and a [[gantry|gantry]] works the outfeed. The line came to life here through [[commissioning|commissioning]], first with no product, then one ingredient at a time, and passed its site acceptance test ([[acceptance-tests|Acceptance tests]]) in the real cold room, including a full washdown and a clean restart. After handover, [[support|support]] comes from the Maintenance Shop, the integrator's Field Crew Depot, and the robot maker's Service Center, and reaching stable output can still take 2-8 weeks or more.

### Job functions
- **Line operator** — runs the line each shift, clears jams, restocks ingredients, and restarts stations after stops.
- **Sanitation lead** — runs the cleaning crew that washes down every station between shifts.
- **Quality and food safety manager** — sets hygiene, allergen, and inspection rules, and approves equipment for food contact, asking for IP69K plus the spec's IP67, and resistance to the plant's cleaning chemicals, on anything sprayed directly during washdown ([[ip-rating]]).
- **Environmental health and safety manager** — checks guarding, lockout procedures, and risk assessments for new equipment.

## Building: maintenance-shop
title: Maintenance Shop
district: factory-district

### About
The plant's own team keeps the line running after handover ([[support]]). It stocks spare vacuum cups for the apple, cracker, and cheese stations, spare soft fingers for the grape gripper, and a spare motor and drive for the most-used robot model, because one missing part stops all 200 plates an hour (an illustrative stocking plan). Preventive maintenance is fitted into sanitation windows, and seals and cable entries are checked after washdowns, since one robot maker's patent notes that unsealed parts of a washdown robot can corrode from the inside. A service agreement with the integrator might promise remote login within an hour and a technician on site the next day (illustrative terms).

### Job functions
- **Maintenance technician** — does preventive maintenance, swaps worn parts such as a vacuum cup in minutes, and is first on scene when a robot faults.
- **Controls engineer** — maintains PLC and robot programs in-house and makes small changes without calling the integrator.

## Building: car-body-shop
title: Car Body Shop
district: factory-district

### About
A car body shop is the classic end user: many welding robots work around each car body, and running them on two or three shifts a day gives each robot many working hours a year, so payback is easier to justify ([[scoping]]). Automotive is still the largest US buyer, with about 13,500 of roughly 38,000 robots installed in the US in 2025 by the preliminary count of the IFR (the industry's statistics body), while food plants took about 3,000, up 30% on 2024. Large end users can also reach up the chain: Hyundai Motor Group (South Korea) controls the robot maker Boston Dynamics.

### Job functions
- **Manufacturing engineer** — writes the requirements for new robot cells, which integrators then build.
- **Maintenance technician** — keeps the welding robots running shift after shift and is first on scene when one faults.
- **Controls engineer** — maintains PLC and robot programs in-house and makes small changes without calling the integrator.
