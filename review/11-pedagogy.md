## Area 11, Deployment lifecycle: analogy and precision review

Scope: all 7 concepts in `knowledge/11-deployment-lifecycle.md`. Validator after edits: `node tools/build-content.mjs --check knowledge/11-deployment-lifecycle.md` shows 0 warnings, 0 errors, 0 unverified flags.

### Analogies
| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| scoping | kept | - | - (dishwasher: do the pots fit, does it save enough hand-washing; the "rarely cook" line correctly predicts that hours run drive payback) |
| cell-design | kept | - | - (kitchen remodel in a floor-plan app; the breaks section correctly says the app cannot predict grip and the sim must be millimeter and sub-second accurate) |
| purchasing | kept | - | - (quotes for a house extension; "cheapest quote quietly left things out" matches the scope-gap mechanism) |
| acceptance-tests | rewritten | A test drive is an optional, informal try-before-you-buy. A reader would predict that a failed FAT means walking away and buying elsewhere, and that a short drive is enough to judge. In reality the cell is custom-built under a signed contract: failures go on a punch list, the builder fixes and retests, payment is held until it passes, and passing means hours at a measured rate. | Custom-built bookshelves: inspected at the carpenter's workshop against an agreed list, then again once fitted in your house; last payment waits; failures are fixed and rechecked, not walked away from. Breaks section now says shelves pass by looking for minutes while a cell passes by running at rate for hours (rare faults need long runs), and the workshop lacks the plant's real world. |
| commissioning | kept | - | - (opening a restaurant kitchen; breaks correctly says the machine, not the staff, is still being tuned) |
| support | kept | - | - (delivery van: scheduled oil changes, spare tire, fast garage; breaks covers software faults and three-way support split) |
| raas | kept | - | - (leasing a car with servicing included). Breaks section extended: a car lease is paid while the car sits in the garage, but some robot deals bill only for working hours, which puts breakdown cost on the provider. |

### Other fixes
- scoping: defined "integrator" in Precise on first use (the company that designs and builds the complete cell around the robots).
- scoping: "two shifts pay back in roughly half the time" now adds "and often faster", because fixed yearly upkeep eats a bigger share of one shift's savings (the cited 15.5 vs 34 months example is more than double).
- scoping (cheese line): added the one-shift case (net savings about 250,000 USD, payback about 9.6 years) so the illustrative numbers show the shift effect, not just the third-shift gain.
- cell-design: defined PLC in plain words on first use (it was used undefined in "real PLC program").
- cell-design: gave the mechanism for why simulated cycle times drift: each maker plans motion with its own proprietary software, so a generic simulator only approximates it (RoboDK RRS doc: "proprietary motion planning software").
- purchasing: defined "legal manufacturer of the cell" (party legally responsible for the finished cell meeting safety law, who signs the declaration of conformity; DBR77 supports this).
- purchasing: defined FAT and SAT at first use in this concept (they were used before the acceptance-tests concept defines them) and linked [[acceptance-tests]].
- purchasing: "pay-per-use deal is usually structured as opex" now notes lease rules can still put it on the balance sheet, so it no longer contradicts the raas concept.
- purchasing: defined "bill of materials" (the full parts list).
- acceptance-tests: availability was defined as "time without unplanned stops"; changed to "the share of scheduled time the cell is actually running", the OEE meaning the Connects-to line relies on.
- acceptance-tests: "an optional factory integration test and a site integration test" read as if both were optional; the IEC page labels only FIT optional, so reordered and defined integration tests in plain words.
- acceptance-tests: payment split "a 70-80% progress payment" could be read as 70-80% paid at FAT alone; the source's "remaining 20-30%" means cumulative, so Precise and Key numbers now say the total paid reaches 70-80% at FAT.
- commissioning: defined "safety validation" (proving each safety function, such as an emergency stop button or light curtain, works as designed), with a plain definition of light curtain.
- support: defined "duty cycle", "reducers" (gearboxes inside each joint), and "servo motors" (joint motors that report their position back) on first use.
- raas: "moves performance risk to the provider (who is paid only while the cell runs)" was true of Formic's 2023 per-hour billing but not its 2026 flat monthly rate; now names both mechanisms (billing only for working hours, or performance SLAs in a flat-rate deal), cited [1][2].
- raas: added a short reminder definition of SLA at first use in this concept.
- raas (cheese line): the line ends at outfeed and has no palletizer; the rented palletizer is now placed after the outfeed, stacking cases of finished plates for shipping.
- Examples and misconceptions: all seven misconceptions are beliefs people actually hold and their Reality sections are correct; no change. All cheese-line examples match 200 plates/h, 18 s takt, 2-4 C room, washdown, and the station list; all Elsewhere settings are real and correctly described.

### Spot-checks of the fact check
| Claim | Source opened | Result |
|---|---|---|
| RoboDK library: over 1,400 arms from 80 manufacturers; reachability analysis and cycle-time optimization | [robodk.com/simulation](https://robodk.com/simulation) | confirmed ("Over 1400 robot arms from 80 different robot manufacturers") |
| FANUC America: 289 service locations, 108 countries, 24/7 call center, lifetime support | [fanucamerica.com/support](https://www.fanucamerica.com/support) | confirmed ("289 service locations supporting 108 countries") |
| Formic palletizer trial: 4,750 USD/month, three months, 40% off, maintenance included | [land.formic.co/try-a-palletizer-100k](https://land.formic.co/try-a-palletizer-100k) | confirmed ("100% maintenance coverage included") |
| Formic 2023: 8-40 USD per robot-hour by contract length, billed only for hours meeting cycle-time goals, 1-5 year terms; Icon pays 10 USD/h for a six-axis FANUC; Arizona minimum wage 13.85 USD | [PMM, Aug 17 2023](https://www.plasticsmachinerymanufacturing.com/injection-molding/article/53067225/startups-automation-takes-over-potentially-dangerous-job) | confirmed (all figures and date) |
| IFR: 16.5 bn USD robot sales in 2018, about 50 bn with software, peripherals, systems engineering | [IFR press release, Sep 18 2019](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) | confirmed |
| McKinsey: payback 1-3 years today vs 5-8 years from the 1980s to the 2020s | [McKinsey, Jul 1 2024](https://karriere.mckinsey.de/capabilities/operations/our-insights/automation-and-the-talent-challenge-in-american-manufacturing) | confirmed |
| Visual Components 5.0, March 12 2026, KUKA Group company; layout, simulation, OLP, virtual commissioning | [KUKA press release](https://www.kuka.com/pl-pl/firma/prasa/news/2026/03/visual-components-5_0) | confirmed |
| Commissioning share 10-20% (assembly, run-in, FAT/SAT, training; depends on complexity and travel); on-site durations by complexity; October 2026 | [Unchained Robotics](https://blog.unchainedrobotics.de/en/how-does-commissioning-work-for-turnkey-robot-solutions) | confirmed (published Oct 29 2026) |
| ABB gearbox oil change at 6,000 h, then every 24,000 h; battery 36 months or low-battery alert | [ABB IRB 6650S manual (ManualsLib)](https://www.manualslib.com/manual/2575717/Abb-Irb-6650s.html?page=111) | confirmed; the duty-cycle dependence is not on this page but is on [ABB IRB 120 manual](https://www.manualslib.com/manual/3070078/Abb-Irb-120.html?page=77) ("operation cycle of the robot, its working environment and movement pattern"), which is cited alongside |
| FAT pass releases 70-80%, SAT the remaining 20-30%; final payment at SAT | [Industrial Monitor Direct](https://industrialmonitordirect.com/blogs/knowledgebase/acceptance-testing-phases-in-industrial-automation-projects-sat-fat-uat-and-usr) | confirmed; wording clarified to cumulative (source says "remaining 20-30%") |
| IEC 62381 edition 3.0, 2024-07-30; FAT, FIT, SAT, SIT with checklists | [IEC webstore](https://webstore.iec.ch/en/publication/67572) | confirmed; only FIT is labeled optional, text reworded to match |
| iFactory: I/O 1-3 days, logic 2-5, performance 1-3; hold items re-tested before shipment; all items closed at handover | [iFactory guide](https://ifactoryapp.com/greenfield-consulting/greenfield-factory-commissioning-fat-sat-startup-guide) | confirmed ("pass/fail criteria" agreed in approved protocols; "measurable" is implied by its numeric examples rather than stated) |
| Formic 2026: one flat monthly rate with installation, SLAs, 24/7 support, managed spares, predictive maintenance | [formic.co/full-service-automation](https://formic.co/full-service-automation) | confirmed ("Performance SLAs written into every Full Service agreement"; no uptime percentage stated) |
| RoboDK RRS add-ins use the maker's motion planner; module sold separately by the robot maker | [RoboDK RRS doc](https://eu.robodk.com/doc/en/RRS.html) | confirmed ("RoboDK does not provide the RCS module of any robot manufacturer") |

14 verified claims re-opened; 0 failed. Two needed wording fixes for precision (payment split, IEC optional test), noted above.
