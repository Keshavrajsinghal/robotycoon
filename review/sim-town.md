# Review: knowledge/sim/town.md

Reviewer pass against knowledge/12-industry-map.md and knowledge/11-deployment-lifecycle.md (both in
full), plus the linked sections of areas 1, 6 (ip-rating, cycle-time), 9 (teleop-modes), 10, and the
registry titles used when a bare `[[id]]` link renders.

Checked and correct as written: 7 districts with fixed ids, order, and concepts; every district's Sells,
Buys from, and Sells to matches area 12; 24 buildings, at most 4 per district (town.js draws 4 slots);
every area-12 job function appears in its own district (checked by script: 0 missing, 0 extra); all 7
area-11 concepts are linked from at least one building; every number (60% Nabtesco, 1 million FANUC,
18 s takt, about 4 s per slice after the 1-2 s belt step, 6.5 s per wedge and 19.5 s per plate, 3.7 and
9.6 year illustrative paybacks, 70-80% after FAT, 2-8 weeks ramp-up, 1,400 robots and 80 makers,
US$600 million at US$5.6 billion, 680 million passengers, 13,500 of 38,000, about 3,000 food, up 30%)
matches its concept file; station robot mapping is labeled a design judgment; no [unverified] claim is
restated; all building names are generic.

| Location | Problem | Fix |
|---|---|---|
| arm-hall, About | Bare `[[delta]]` renders the registry title, so the page read "food-grade Delta robot robot". | Aliased to `[[delta\|delta]]`. |
| controller-lab, About | Bare `[[safety-standards]]` rendered "against the main The main safety standards". The sentence also said the safety functions are certified; area 12 says the robot maker certifies the robot. | Aliased the link; reworded to "the robot maker then certifies the finished robot against the main safety standards". Also aliased `[[robot-controller]]`. |
| sensor-house, About s3 | "Much of the work is planning" has no source, and "steel" is odd for an electronics building. | Restated the area-12 role: planners turn build forecasts into production plans and manage long lead times on electronics. |
| service-center, About s1 | "much of its support comes from here" overstates the robot maker's part. Area 11 splits support three ways (robot maker, integrator, plant). | Changed to "the robot maker's share of its support comes from here (the integrator and the plant's own technicians handle the rest)". |
| build-hall, About s2 | "usually at room temperature" adds a claim that integrators usually lack a cold room. Area 11 says only "unless the integrator has a cold room". | Dropped "usually". |
| field-depot, About s3 | "often under a service level agreement": area 11 gives no frequency. | Reworded: a service level agreement "sets how fast they must respond". |
| ops-center, About s1 | "Application companies keep watching" generalizes; area 12 says "many". | Added "Many". |
| catering-plant, About s4 | "from then on, support comes from ..." placed support after stable output; support starts at handover. | Reordered: support comes from the three buildings after handover, and stable output can still take 2-8 weeks or more. |
| catering-plant, Quality and food safety manager | "IP69K ... on anything sprayed at close range" drifted from area 6, which says plants ask for jet ratings on anything sprayed directly and want chemical resistance confirmed. | Now "IP69K plus the spec's IP67, and resistance to the plant's cleaning chemicals, on anything sprayed directly during washdown". |
| applications, Plain | The dishwasher comparison leads a newcomer to predict the plant owns a box that runs without its maker; area 12's "Where the analogy breaks" says the opposite. | Added: "Unlike a dishwasher, the station is often leased rather than sold, and its maker often keeps watching and updating it remotely." (4 sentences.) |
| factory-district, Plain | The restaurant-oven comparison suggests plants buy standard equipment; area 12 says a plant usually buys a custom-built line. | Added "Unlike ovens, a robot line is usually custom-built for one plant." (4 sentences.) |
| docs-house, About s1 | "Tools only sell if people can learn them" is an unsourced claim. | Replaced with the building's tasks from area 12's job functions (docs, tutorials, forum help, trials, licenses). |
| sim-studio, About s1 | "offline programming" used without a definition. | Added "(writing robot programs on a PC instead of on the real robot)". |
| car-body-shop, About s2 | "IFR" not expanded. | "the IFR (the industry's statistics body)". |
| data-garage, About s2 | "The same robots measure how often a new model succeeds" (robots do not measure). | "are used to measure". |
| gripper-shop, About s2 | Area 12 says end-of-arm parts are "usually" bought separately; the text made it absolute. | Added "usually". |
| Several Abouts | Bare links mid-sentence rendered as title case concept titles ("through Commissioning and ramp-up (first testing ...", "with Scoping and ROI:", "mostly Vision-language-action models"). | Aliased to lowercase text in field-depot, catering-plant, caterer-office, service-center, sim-studio, training-hall. |

## Not changed, for other owners

- **Area 12 cheese gripper conflict** (knowledge/12-industry-map.md, component-makers "On the cheese
  plate line"): it puts an electric gripper with V-notched fingers on the cheese wedges. The brief, area 1's
  mapping, and area 11's support section use a vacuum cup at the cheese station. The town follows the
  brief and never names the cheese gripper type beyond "vacuum cups". Area 12 should be aligned.
- **Area 12 render bug**: robot-makers Precise says "certifies it against the main [[safety-standards]]",
  which renders "the main The main safety standards". Needs an alias there too.
- **Model Lab versus "Every other company on this map ultimately gets its money from them"** (factory
  Plain, verbatim from area 12): model companies run mostly on venture capital. "Ultimately" keeps it
  defensible, so it stays.

Format: `node tools/build-content.mjs --check knowledge/sim/town.md` and the whole-tree check both report
0 warnings, 0 errors after the fixes.
