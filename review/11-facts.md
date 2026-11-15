## Area 11, Deployment lifecycle: fact check

Summary line: 99 claims checked: 81 verified, 15 corrected, 3 unverifiable (0 kept flagged, 3 removed). All 5 existing [unverified] flags were re-tried and resolved with sources. Validator: `node tools/build-content.mjs --check knowledge/11-deployment-lifecycle.md` shows 0 warnings, 0 errors, 0 unverified flags.

Status check as of November 2026: Formic is active (formic.co live, monthly Full Service offers). Locus Robotics is active (it acquired Nexera Robotics on May 19, 2026). One aggregator page said Locus had a "distressed acquisition"; it contradicts itself and nothing else supports it, so I ignored it. Rapid Robotics wound down in 2025, and RobCo bought its assets in September 2025. Visual Components is still a KUKA Group company. ISO 10218-2:2025 is current.

### scoping
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | 200 plates/h gives an 18 s takt: 4.5 s per apple slice, 6 s per wedge | verified | arithmetic (3600/200) | none |
| 2 | 2016 NIST study (RTI), 84 expert interviews | verified | [NIST GCR 16-005](https://nvlpubs.nist.gov/nistpubs/gcr/2016/NIST.GCR.16-005.pdf) | source note: August 2016, 84 interviewees |
| 3 | System cost "tends to be 3 to 4 times" the robot cost; ratio changing | verified | [NIST GCR 16-005](https://nvlpubs.nist.gov/nistpubs/gcr/2016/NIST.GCR.16-005.pdf), p. 3-5/3-6 | none |
| 4 | IFR: 16.5 bn USD of robots in 2018, about 50 bn with software, peripherals, systems engineering | verified | [IFR press release, Sep 18 2019](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) | none |
| 5 | McKinsey 2024: payback now 1-3 years vs 5-8 years from the 1980s to the 2020s | verified | [McKinsey, Jul 1 2024](https://karriere.mckinsey.de/capabilities/operations/our-insights/automation-and-the-talent-challenge-in-american-manufacturing) | none |
| 6 | Review found no dataset behind McKinsey's figure and "no government or industry body" publishes a measured average | corrected | [Reliable, upd. Nov 2026](https://reliamag.com/topics/guides/industrial-robot-roi-payback-integration-costs) (secondary) | narrowed to "no measured average from a government agency or robotics association among the sources it checked" |
| 7 | Two shifts pay back in roughly half the time of one | verified | [Reliable](https://reliamag.com/topics/guides/industrial-robot-roi-payback-integration-costs) (secondary): 15.5 vs 34 months | none |
| 8 | Worked example: 195,000 USD cell, about 15.5 months (two shifts) vs about 34 months (one) | verified | [Reliable](https://reliamag.com/topics/guides/industrial-robot-roi-payback-integration-costs) (secondary; hypothetical, 39.25 USD/h BLS labor rate) | source note says "hypothetical" |
| 9 | Cheese line payback 3.7 years (2.4/0.65) and 2.3 years (2.4/1.05) | verified | arithmetic; labeled illustrative | none |
| 10 | Car body shops run spot-welding robots on two or three shifts | unverifiable | no source checked | removed as a fact: reworded as a conditional ("a shop that runs ...") |
| 11 | Stäubli application engineers help refine and specify an application, then develop and optimize programming | verified | [Stäubli integrator services brochure, 01/2026](https://www.staubli.com/content/dam/robotics/products/robots/services/Services-for-St%C3%A4ubli-integrators-brochure-EN.pdf) | none |
| 12 | Robot is a quarter to a third of installed cost | verified | follows from NIST and IFR ratios | none |
| 13 | Key numbers: ratio from "2014-2015" interviews | corrected | [NIST GCR 16-005](https://nvlpubs.nist.gov/nistpubs/gcr/2016/NIST.GCR.16-005.pdf): Phase 1 interviews in 2014; no 2015 date found | changed to "expert interviews for a 2016 NIST study (which notes the ratio was changing) and a 2019 IFR estimate" |
| 14 | Key numbers: "simple cobot cells can be lower, complex cells higher" | unverifiable | not in either source | removed; replaced with "depends on how much peripheral equipment and engineering the cell needs" (NIST: integration costs are the ancillary products and services) |
| 15 | Stäubli brochure dated January 2026 | verified | brochure footer "© Stäubli 01/2026 - V5" | none |
| 16 | RoboDK can do early reach and cycle-time checks | verified | [RoboDK simulation](https://robodk.com/simulation) | none |

### cell-design
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | RoboDK library: over 1,400 arms from 80 manufacturers | verified | [RoboDK simulation](https://robodk.com/simulation) | none |
| 2 | RoboDK offers reachability analysis, cycle-time optimization, collision avoidance, offline programming | verified | [RoboDK simulation](https://robodk.com/simulation) | none |
| 3 | Visual Components covers layout planning, process simulation, offline programming, virtual commissioning | verified | [KUKA press release, Mar 12 2026](https://www.kuka.com/pl-pl/firma/prasa/news/2026/03/visual-components-5_0) | none |
| 4 | Visual Components is a KUKA Group company | verified | [KUKA press release](https://www.kuka.com/pl-pl/firma/prasa/news/2026/03/visual-components-5_0) | none |
| 5 | Visual Components 5.0 released March 2026 | verified | [KUKA press release](https://www.kuka.com/pl-pl/firma/prasa/news/2026/03/visual-components-5_0) | none |
| 6 | Process Simulate: robot motion, collision-free paths, cycle-time tuning, validation against real PLC logic before hardware is bought | verified | [Siemens Process Simulate X Standard](https://www.siemens.com/en-us/products/tecnomatix/offerings/process-simulate-x-standard/) | none |
| 7 | Process Simulate is part of Tecnomatix | verified | [Siemens page](https://www.siemens.com/en-us/products/tecnomatix/offerings/process-simulate-x-standard/) (URL path and Tecnomatix labels) | none |
| 8 | Sold in tiers such as X Standard | verified | [Siemens page](https://www.siemens.com/en-us/products/tecnomatix/offerings/process-simulate-x-standard/) | made precise: tiers X Essentials, Standard, Advanced |
| 9 | RoboDK "sells an add-in" that runs the maker's motion planner | corrected | [RoboDK RRS docs](https://eu.robodk.com/doc/en/RRS.html) | changed to "offers RRS add-ins ... (a controller module bought separately from the robot maker)" |
| 10 | ISO 10218-2:2025 replaced the 2011 edition | verified | [EVS listing](https://www.evs.ee/en/iso-10218-2-2025) (national standards body; iso.org returned 403) | source note: published February 2025 |
| 11 | ISO 10218-2 covers the cell from design through decommissioning | verified | [EVS listing](https://www.evs.ee/en/iso-10218-2-2025) | none |
| 12 | Task-based ISO 12100 assessment, all modes, design before guards before warnings | verified | [EVST summary, Jul 2026](https://www.evsint.com/iso-10218-2-2025-robot-system-cell-integration-safety-guide/) (secondary; standard text is paywalled) | none |
| 13 | ISO 12100 is the general machinery risk assessment method | verified | [EVS ISO 12100:2010 listing](https://www.evs.ee/en/iso-12100-2010) | none (text already cites [6]) |
| 14 | 6.5 s per wedge gives 19.5 s per plate | verified | arithmetic; illustrative | none |

### purchasing
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | URS: what the cell must do, under what conditions | verified | [EU GMP Annex 15, 2015](https://health.ec.europa.eu/system/files/2016-11/2015-10_annex15_0.pdf), glossary | source added [7] (DBR77 does not mention URS) |
| 2 | RFQ for a defined scope; RFP when the solution is open | verified | [DBR77](https://marketplace.dbr77.com/knowledge-base/what-to-include-in-an-automation-rfq-or-rfp) (secondary, vendor) | none |
| 3 | Package covers interfaces, scope split, legal manufacturer, FAT/SAT outline, payment milestones, warranty, spares, service response | verified | [DBR77](https://marketplace.dbr77.com/knowledge-base/what-to-include-in-an-automation-rfq-or-rfp) (secondary) | none |
| 4 | Bids compared "starting with" the deviations list | corrected | [DBR77](https://marketplace.dbr77.com/knowledge-base/what-to-include-in-an-automation-rfq-or-rfp) (secondary) | changed to side-by-side comparison in one required format; deviations list is the most revealing page |
| 5 | Capex depreciated over useful life; opex expensed when incurred; rent is opex | verified | [Wall Street Prep](https://www.wallstreetprep.com/knowledge/capex-vs-opex/) (secondary) | none |
| 6 | 2019: industrial robots 14-20 weeks | verified | [Assembly, Feb 6 2019](https://www.assemblymag.com/articles/94746-increasing-lead-times-for-automation-components-become-an-issue-for-systems-integrators) (trade press) | added "depending on size and complexity" |
| 7 | "Common models" in under six weeks | corrected | [Assembly](https://www.assemblymag.com/articles/94746-increasing-lead-times-for-automation-components-become-an-issue-for-systems-integrators) | changed to one integrator getting most stock models in under six weeks |
| 8 | Linear slides 20-26 weeks | verified | [Assembly](https://www.assemblymag.com/articles/94746-increasing-lead-times-for-automation-components-become-an-issue-for-systems-integrators) | none |
| 9 | Some linear bearings up to a year | verified | [Assembly](https://www.assemblymag.com/articles/94746-increasing-lead-times-for-automation-components-become-an-issue-for-systems-integrators) | range made precise: nine months to a year |
| 10 | Universal Robots could ship cobots in about two weeks (2022) | verified | [UR news, Sep 20 2022](https://universal-robots.com/about-universal-robots/news-centre/we-are-ready-when-you-are) | none |
| 11 | 2026 guide: industrial robots 8-12+ weeks | unverifiable | [iRecruit](https://www.irecruit.co/insights/brownfield-automation-retrofit-how-long-line-conversion-takes) (secondary, recruiting firm; figure has no citation on the page) | removed from Precise and Key numbers |
| 12 | Custom motor control centers 24-44 weeks | verified | [iRecruit](https://www.irecruit.co/insights/brownfield-automation-retrofit-how-long-line-conversion-takes) (secondary; table; body says about 34 average, up to 44) | term defined in plain words; source marked secondary |
| 13 | Robot "rarely" held projects up; integrators could order early and expect them on time | corrected | [Assembly](https://www.assemblymag.com/articles/94746-increasing-lead-times-for-automation-components-become-an-issue-for-systems-integrators) | changed to one integrator's statement |
| 14 | Weldments slipped by weeks | verified | [Assembly](https://www.assemblymag.com/articles/94746-increasing-lead-times-for-automation-components-become-an-issue-for-systems-integrators) (8 to 12-14 weeks) | none |
| 15 | DBR77 eight-section RFQ outline | verified | [DBR77](https://marketplace.dbr77.com/knowledge-base/what-to-include-in-an-automation-rfq-or-rfp) (secondary) | none |
| 16 | IEC 62381 supplies FAT/SAT checklists | verified | [IEC webstore](https://webstore.iec.ch/en/publication/67572) | none |

### acceptance-tests
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | FAT at integrator's shop before shipping; SAT at plant after installation | verified | [Unchained Robotics, Oct 2026](https://blog.unchainedrobotics.de/en/how-does-commissioning-work-for-turnkey-robot-solutions) (secondary); [IEC 62381](https://webstore.iec.ch/en/publication/67572) | none |
| 2 | IEC 62381 edition 3.0, July 2024, process-industry automation | verified | [IEC webstore](https://webstore.iec.ch/en/publication/67572) (published 2024-07-30) | none |
| 3 | IEC 62381 defines FAT, SAT, optional FIT, SIT; checklists; purpose is to show the system meets the specification | verified | [IEC webstore](https://webstore.iec.ch/en/publication/67572) | none |
| 4 | FAT checks parts, cycle time, safety, I/O, network communication, software versions | verified | [Unchained](https://blog.unchainedrobotics.de/en/how-does-commissioning-work-for-turnkey-robot-solutions) + [Industrial Monitor Direct](https://industrialmonitordirect.com/blogs/knowledgebase/acceptance-testing-phases-in-industrial-automation-projects-sat-fat-uat-and-usr) (both secondary) | none |
| 5 | SAT checks rate, availability, quality, safety, plant integration | verified | same two (secondary) | none |
| 6 | Criteria "signed before testing"; blocking items re-tested before shipping or handover | corrected | [iFactory, Mar 2026](https://ifactoryapp.com/greenfield-consulting/greenfield-factory-commissioning-fat-sat-startup-guide) (secondary) | changed to criteria agreed in the test plan beforehand; "hold" items re-tested before shipment; all items closed before handover |
| 7 | FAT pass releases 70-80%, SAT 20-30% | verified | [Industrial Monitor Direct, Jul 2026](https://industrialmonitordirect.com/blogs/knowledgebase/acceptance-testing-phases-in-industrial-automation-projects-sat-fat-uat-and-usr) (secondary) | none |
| 8 | Final payment usually held until SAT | verified | same (secondary) | none |
| 9 | Durations are for a "process-plant control system, such as a chemical plant's"; FAT "dominated by checking signals" | corrected | [iFactory](https://ifactoryapp.com/greenfield-consulting/greenfield-factory-commissioning-fat-sat-startup-guide) (secondary) | changed to "control system of a new factory"; "mostly signal and logic checking" (logic testing is the longest item) |
| 10 | FAT: I/O 1-3 days, every point individually; logic 2-5; performance 1-3 | verified | [iFactory](https://ifactoryapp.com/greenfield-consulting/greenfield-factory-commissioning-fat-sat-startup-guide) (secondary) | none |
| 11 | Stäubli FAT service checks the cell against Stäubli recommendations before it ships | verified | [Stäubli brochure, 01/2026](https://www.staubli.com/content/dam/robotics/products/robots/services/Services-for-St%C3%A4ubli-integrators-brochure-EN.pdf) | none |
| 12 | iFactory punch list: pass, conditional pass, hold; tracked in its CMMS | verified | [iFactory](https://ifactoryapp.com/greenfield-consulting/greenfield-factory-commissioning-fat-sat-startup-guide) (secondary) | none |
| 13 | Four-hour FAT run, 99% complete plates | verified | labeled illustrative; plausible | none |
| 14 | Source [2] title/date "How does commissioning work..., 2026" | corrected | [Unchained page](https://blog.unchainedrobotics.de/en/how-does-commissioning-work-for-turnkey-robot-solutions) | title updated to "Commissioning Production Systems in Five Phases", October 2026 |

### commissioning
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Phases: installation, cold commissioning, hot commissioning, SAT, handover | verified | [Unchained, Oct 29 2026](https://blog.unchainedrobotics.de/en/how-does-commissioning-work-for-turnkey-robot-solutions) (secondary) | none |
| 2 | Loop checks 2-5 days; safety validation 3-10 days | verified | [iRecruit, Aug 2026](https://www.irecruit.co/insights/brownfield-automation-retrofit-how-long-line-conversion-takes) (secondary, recruiting firm citing service-provider pages) | source marked secondary |
| 3 | Virtual commissioning "shortens this phase by debugging control logic" | corrected | [Siemens Process Simulate X Standard](https://www.siemens.com/en-us/products/tecnomatix/offerings/process-simulate-x-standard/) | reworded to what the source supports: tests real control logic against a simulated cell to catch integration issues before installation; source [3] added |
| 4 | Ramp-up to stable output 2-8 weeks or more | verified | [iRecruit](https://www.irecruit.co/insights/brownfield-automation-retrofit-how-long-line-conversion-takes) (secondary) | none |
| 5 | Regulated plants need 25-50% more commissioning time | corrected | [iRecruit](https://www.irecruit.co/insights/brownfield-automation-retrofit-how-long-line-conversion-takes) (secondary) | labeled as a planning allowance, not a measured figure |
| 6 | On-site durations: a few days to 1 week, 1-3 weeks, weeks to months | verified | [Unchained](https://blog.unchainedrobotics.de/en/how-does-commissioning-work-for-turnkey-robot-solutions) (secondary) | none |
| 7 | The on-site phase costs 10-20% of the system investment | corrected | [Unchained](https://blog.unchainedrobotics.de/en/how-does-commissioning-work-for-turnkey-robot-solutions) (secondary) | changed to: the commissioning share (assembly, run-in, FAT and SAT, training) is usually 10-20%, depending on complexity and travel distance |
| 8 | FAT, transport, training come on top of on-site durations | verified | [Unchained](https://blog.unchainedrobotics.de/en/how-does-commissioning-work-for-turnkey-robot-solutions) (secondary) | none |
| 9 | 100 plates/h reduced-speed run | verified | labeled illustrative; plausible (half rate) | none |
| 10 | Process Simulate and Visual Components run real PLC programs against a simulated cell | verified | [Siemens](https://www.siemens.com/en-us/products/tecnomatix/offerings/process-simulate-x-standard/), [KUKA](https://www.kuka.com/pl-pl/firma/prasa/news/2026/03/visual-components-5_0) | none |

### support
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | PM intervals set by the maker's manual per model, for gear grease, cables, "controller backup batteries", gripper cups [unverified] | corrected | [ABB IRB 120 manual](https://www.manualslib.com/manual/3070078/Abb-Irb-120.html?page=77), [ABB IRB 6650S manual](https://www.manualslib.com/manual/2575717/Abb-Irb-6650s.html?page=111) (OEM manuals via ManualsLib mirror; ABB's own PDF is over the fetch size limit) | flag removed; items corrected to gearbox oil or grease, cable harnesses, position-memory backup batteries; added that the interval depends on duty cycle and environment, with the 6,000 h then 24,000 h gearbox oil example; sources [5][6] added |
| 2 | FANUC ZDT looks for abnormal mechanical health in reducers and servo motors, alerts before failure | verified | [FANUC ZDT](https://www.fanucamerica.com/products/robots/zdt-zero-down-time) | none |
| 3 | ZDT web portal shows each robot's condition and maintenance status | verified | [FANUC ZDT](https://www.fanucamerica.com/products/robots/zdt-zero-down-time) | none |
| 4 | Robot makers run parts catalogs and portals | verified | [FANUC support](https://www.fanucamerica.com/support), [Stäubli brochure](https://www.staubli.com/content/dam/robotics/products/robots/services/Services-for-St%C3%A4ubli-integrators-brochure-EN.pdf) | none |
| 5 | MyStäubli: spare parts catalog, documents, incident reporting | verified | [Stäubli brochure](https://www.staubli.com/content/dam/robotics/products/robots/services/Services-for-St%C3%A4ubli-integrators-brochure-EN.pdf) | none |
| 6 | Welcome Pack with priority technician intervention | verified | same | none |
| 7 | Stäubli fleet monitoring software | verified | same ("a solution to monitor your fleet") | none |
| 8 | FANUC America 24/7 technical support call center | verified | [FANUC support](https://www.fanucamerica.com/support) | none |
| 9 | FANUC America lifetime product support | verified | same | none |
| 10 | 289 service locations, 108 countries | verified | same ("289 service locations supporting 108 countries") | none |
| 11 | Water getting into electronics is a known risk in washdown cells [unverified] | corrected | [US 12691596 B2, ABB patent](https://patents.google.com/patent/US12691596B2/en) | flag removed; reworded to "cleaning water forced past seals is a known risk: unsealed parts of a washdown robot can corrode from the inside" (electronics not mentioned by any source); source [7] added |
| 12 | Formic: SLAs, 24/7 support, managed spares, predictive maintenance, monthly | verified | [Formic Full Service](https://formic.co/full-service-automation) | none |
| 13 | SLA: remote login within an hour, technician next day | verified | labeled illustrative; plausible | none |

### raas
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | RaaS: provider owns equipment, handles scoping through maintenance, customer pays a recurring fee | verified | [PMM, Aug 2023](https://www.plasticsmachinerymanufacturing.com/injection-molding/article/53067225/startups-automation-takes-over-potentially-dangerous-job), [Formic](https://formic.co/full-service-automation), [Robotics 24/7](https://www.robotics247.com/article/formic_offers_robotics_as_a_service_and_financing_to_manufacturers) | none |
| 2 | Formic 2023: 8-40 USD per robot-hour, depending on contract length | verified | [PMM, Aug 17 2023](https://www.plasticsmachinerymanufacturing.com/injection-molding/article/53067225/startups-automation-takes-over-potentially-dangerous-job) (trade press) | none |
| 3 | Billing only for hours run that meet cycle-time goals | verified | same | none |
| 4 | Minimum terms typically 1-5 years | verified | same | none |
| 5 | Formic Nov 2026: one flat monthly rate including installation, SLAs, 24/7 support, spares, predictive maintenance | verified | [Formic Full Service](https://formic.co/full-service-automation) | none |
| 6 | Locus RaaS includes deployment, maintenance, "software updates" | corrected | [Locus home page](https://locusrobotics.com/) | changed to deployment, maintenance, 24/7 support, and continuing software improvements (the page's wording) |
| 7 | Rapid Robotics shut down; RobCo bought its assets in 2025 [unverified: secondary only] | verified | [Bee Partners portfolio](https://beepartners.vc/portfolio/rapid-robotics) ("wound down in 2025"); [MMH, Sep 10 2025](https://www.mmh.com/article/robco_launches_in_the_u.s_with_new_san_francisco_headquarters) (carries RobCo's release: "acquiring the assets of ... Rapid Robotics") | both flags removed; Grabarobot blog (AI-assisted desk research) replaced; wording "wound down", "September 2025" |
| 8 | Under ASC 842 / IFRS 16, controlling a specific machine can make the contract a lease that goes on the balance sheet [unverified] | verified | [IFRS 16 on EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32017R1986) para 9 and 22; [CPA Journal, Aug 2019](https://www.cpajournal.com/2019/08/28/the-challenge-of-embedded-leases/) (quotes ASC 842-10-15-3; FASB site returned 403) | flag removed; wording matched to the standards ("right to control the use of an identified asset"), "generally" added for short-term and low-value exemptions; sources [8][9] added |
| 9 | Formic palletizer: 4,750 USD/month for three months, 40% off, maintenance included | verified | [Formic offer page](https://land.formic.co/try-a-palletizer-100k) | none |
| 10 | Icon Injection Molding pays about 10 USD/h for a six-axis FANUC | verified | [PMM](https://www.plasticsmachinerymanufacturing.com/injection-molding/article/53067225/startups-automation-takes-over-potentially-dangerous-job) | none |
| 11 | Arizona minimum wage 13.85 USD at the time | verified | same | none |
| 12 | Formic programs, monitors, maintains | verified | same | none |
| 13 | Ulta Beauty about doubled its Locus fleet for peak | verified | [Locus home page](https://locusrobotics.com/) ("2x increased robot fleet during peak") | none |
| 14 | Formic's customers have roughly 300-400 employees (2021) | verified | [Robotics 24/7, Aug 30 2021](https://www.robotics247.com/article/formic_offers_robotics_as_a_service_and_financing_to_manufacturers) | none |
| 15 | Formic active as of November 2026 | verified | [Formic Full Service](https://formic.co/full-service-automation) (live year-end offers) | none |
| 16 | Locus Robotics active as of 2026 | verified | [Locus news, May 19 2026](https://locusrobotics.com/news/locus-robotics-nexera-robotics-acquisition) (acquired Nexera; 150+ brands, 350+ sites) | none |
