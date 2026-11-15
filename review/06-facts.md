## Area 6, Cell and line: fact check

Summary line: 199 claims checked: 167 verified, 26 corrected, 6 unverifiable (5 kept flagged, 1 removed). 11 product-name rows were first left unverified and unflagged, because the vendor page blocked the fetch and the shared web-search quota ran out. A follow-up pass checked them against vendor documents, filings, and distributor-hosted vendor PDFs: 10 are now verified and 1 corrected, each with a source added.

Notes:
- Original file had 14 `[unverified]` flags. 9 are now sourced and the flag removed. 5 remain, with their reasons updated.
- Validator: `node tools/build-content.mjs --check knowledge/06-cell-and-line.md` gives 0 warnings, 0 errors (95 sources, 5 flags).
- Company status, November 2026: ABB Robotics still belongs to ABB. SoftBank's purchase (agreed 8 October 2025) has not closed. China blocked the China part on 4 November 2026 ([SoftBank update, 6 Nov 2026](https://group.softbank/en/news/press/20261106)). FlexSim belongs to Autodesk (announced October 2023). Proseal is a JBT Marel brand. Dorner is a Columbus McKinnon brand. Fortress Interlocks now trades as Fortress Safety. No ABB product names needed to change.
- Code sketch (line-balancing): I re-ran it. It prints exactly the values in its comments (14.3 s, 0.43, 0.80, 202; 17.5 s, 0.37, 165; 10.5 s, 0.59, 0.78, 267).
- Some pages blocked automated fetching (ISO main site, IEC ip-ratings, Leuze, Asyril home, Pilz, Rockwell, Mettler-Toledo, Cognex). Where possible I used an official mirror instead (committee.iso.org, the Asycube docs site). In the follow-up pass: Mettler-Toledo through its SEC 10-K, Cognex through docs.cognex.com, Pilz through PDFs on pilz.com plus one distributor copy, Rockwell through a distributor copy of its selection guide.

### conveyor
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Flat belts need tensioning and tracking | verified | [Intralox FoodSafe](https://www.intralox.com/solutions/foodsafe) | none |
| 2 | Modular plastic and thermoplastic positive-drive belts are driven by teeth/lugs and are easier to clean (was flagged) | verified | [Intralox ThermoDrive](https://www.intralox.com/products/thermodrive), [Intralox modular belting](https://www.intralox.com/products/modular-plastic-belting) | flag removed; added source [5]; dropped "strip" |
| 3 | ThermoDrive removes the tensioning, tracking, and cleanability problems of flat belts | verified | [Intralox FoodSafe](https://www.intralox.com/solutions/foodsafe) | added "tensionless" |
| 4 | Roller and chain conveyors carry cartons, pallets, car bodies | corrected | [Conveyor system](https://en.wikipedia.org/wiki/Conveyor_system) (secondary) | "car bodies" was not in the source; now "cartons and heavy items such as pallets" |
| 5 | Belt encoder lets the robot predict where an item is on a moving belt | verified | [ABB IRB 360 datasheet](https://library.e.abb.com/public/a3759d3f3e7141deba89d1caeb1dd4e4/IRB%20360%20FlexPicker_Datasheet_US%20Letter.pdf) | none |
| 6 | Delta robot makers sell fast-belt tracking plus indexing-belt control in their picking software | verified | ABB datasheet (as above) | none |
| 7 | 300 mm / 18 s is about 17 mm/s, or 1 m/min (illustrative) | verified | arithmetic | none |
| 8 | Index move takes 1-2 s (labeled illustrative) | verified | labeled illustrative | none |
| 9 | Food lines favor open stainless frames and lift-off belts [3] | corrected | [Intralox ThermoDrive](https://www.intralox.com/products/thermodrive) | cited page did not say this; rewritten to the ThermoDrive claim that it halves cleaning time and water use |
| 10 | Heavy-duty roller conveyors run up to 75 ft/min | unverifiable | [Conveyor system](https://en.wikipedia.org/wiki/Conveyor_system) (secondary; no citation there) | removed; replaced the key number with ABB's tracking repeatability range |
| 11 | Robots must know an item's position to within a few mm | verified | ABB datasheet: 1.0-5.0 mm tracking repeatability, depending on belt speed | range added as a key number |
| 12 | Intralox modular plastic belting and ThermoDrive products | verified | Intralox pages above | none |
| 13 | Dorner AquaPruf sanitary washdown line | verified | [Columbus McKinnon AquaPruf](https://www.cmco.com/en-us/corp-conveyors--accumulators/conveyors--accumulators/sanitary-conveyors/aquapruf-washdown/aquapruf-ultimate-belted/) | none (Dorner is a Columbus McKinnon brand) |
| 14 | Interroll sells rollers, motorized rollers, conveyor modules | verified | [Interroll](https://www.interroll.com/) | none |
| 15 | ABB PickMaster is named in the 2017 IRB 360 datasheet | verified | ABB datasheet; [SoftBank update](https://group.softbank/en/news/press/20261106) for ownership | none |

### feeder
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Bowl feeder: spiral track; tooling knocks wrongly oriented parts back into the bowl | verified | [Bowl feeder](https://en.wikipedia.org/wiki/Bowl_feeder) (secondary) | none |
| 2 | Bowl feeders are "fast and cheap per part" | corrected | Bowl feeder (secondary) | not in source; now "work well for parts with one heavy end, such as machine screws" |
| 3 | Each new part needs new tooling; cannot handle symmetric parts or parts that differ only by color | verified | Bowl feeder (secondary) | wording aligned to "fully symmetrical" |
| 4 | Flexible feeders: vibrating platform or disc, vision finds parts, robot picks (was flagged) | verified | [Asycube user guide](https://doc.asycube.asyril.com/en/2024.12/index.html), [FlexiBowl](https://flexibowl.com/) | flag removed; added sources [4][5] |
| 5 | Scroll denesters use rotating screws on the tray rim (was flagged) | corrected | [US 10,294,043 B2](https://patents.google.com/patent/US10294043) | "on the tray rim" not supported; now "rotating screws separate and drop trays one at a time"; flag removed |
| 6 | Pick-and-place denesters: servo, several trays at once, synced to the line | verified | [Sealpac denesting](https://www.sealpac-uk.com/denesting) | none |
| 7 | Rated speeds 70-400 trays/min | corrected | Sealpac denesting; [QUPAQ range](https://www.sealpac-uk.com/qupaq-tray-denesting-range) | the "70" came from text that contradicts its own spec list; now 120 (pneumatic), about 200 (electric, tray dependent), 400 (scroll, one or two outlets) |
| 8 | Changing tray size usually means swapping the magazine | verified | Sealpac denesting | none |
| 9 | 3.3 trays/min needed vs 120/min rated, so under 3% | verified | QUPAQ range; arithmetic | none |
| 10 | 250-tray magazine lasts 75 min (illustrative) | verified | arithmetic | none |
| 11 | Bowl feeder delivers screws to an automatic screwdriver | verified | Bowl feeder (secondary) | none |
| 12 | QUPAQ ANYTRAY/INTRAY are "pneumatic and servo" | corrected | QUPAQ range | INTRAY is electric (servo versions exist); split by model |
| 13 | Sealpac sells pick-and-place and scroll denesters | corrected | Sealpac denesting | scroll denesters are QUPAQ (partner brand) |
| 14 | "Asyril Asycube and FlexiBowl" | corrected | [FlexiBowl](https://flexibowl.com/) | FlexiBowl is made by ARS S.r.l., not Asyril; now "ARS FlexiBowl" |
| 15 | Pneumatic denesters: up to 120/min on 6 bar air | verified | QUPAQ range | none |
| 16 | Servo: 200/min on one lane, 400 on scroll or twin-lane | corrected | QUPAQ range; Sealpac denesting | "one lane" not in source; split into electric 200 (tray dependent) and scroll 400 (single or twin outlet) |
| 17 | Vibratory bowl feeders are built per part | verified | Bowl feeder (secondary) | none |

### inspection
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Checkweigher: short belt on a load cell, weighs packs as they move | verified | [Checkweigher](https://en.wikipedia.org/wiki/Checkweigher) (secondary) | none |
| 2 | X-ray finds glass, stone, bone, metal | verified | [Sealpac inspection](https://www.sealpac-uk.com/packaging-inspection-systems) | none |
| 3 | Reject by air blast, pusher, diverter arm, drop-away belt | verified | Checkweigher (secondary) | none |
| 4 | Controller tracks each item from decision point to reject point using encoder pulses | unverifiable | only PLC tutorial blogs found | kept flagged; reason updated |
| 5 | Quality = good count / total count | verified | [oee.com calculating OEE](https://oee.com/calculating-oee) | none |
| 6 | 18 s per plate; 2% rejects is about 4 plates/h | verified | arithmetic | none |
| 7 | Detection of gripper or belt fragments (X-ray finds plastics) | verified | Sealpac inspection | none |
| 8 | Airport baggage: scan, divert flagged bags, track bags in between (was flagged) | verified | [TSA technology fact sheet](https://www.tsa.gov/news/press/factsheets/technology) | flag removed; reworded to TSA's description; source [4] added |
| 9 | Mettler-Toledo and Cognex In-Sight products | verified | [Mettler-Toledo 10-K 2025](https://www.sec.gov/Archives/edgar/data/1037646/000103764626000011/mtd-20251231.htm), [Cognex In-Sight docs](https://docs.cognex.com/is_573/web/EN/is9000/Content/Topics/Hardware/Intro.htm) | sources [5][6] added (mt.com returned 406 and cognex.com 429, so used the SEC filing and Cognex's docs site) |
| 10 | Keyence vision systems | verified | [Keyence vision](https://www.keyence.com/products/vision/) | none |
| 11 | Sealpac combined metal/X-ray/checkweigh units, seal and label checks | verified | Sealpac inspection | none |
| 12 | Ishida checkweighers and X-ray | verified | [Ishida checkweighers](https://www.ishidaeurope.com/en/products/inspection-quality-control/checkweighers/), [Ishida X-ray](https://www.ishidaeurope.com/en/products/inspection-quality-control/) | sources [7][8] added |
| 13 | Checkweighers: over 500 items/min, depending on pack size and accuracy | verified | Checkweigher (secondary; no citation there) | none |
| 14 | Vision box check: up to 2,500 pieces/h | verified | Sealpac inspection (BoxCheck) | none |

### packaging-machines
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Traysealer: heated tool presses film onto flange and cuts it; MAP or vacuum first | corrected | [Sealpac traysealers](https://www.sealpac-uk.com/sealpac-traysealer-range); [Sigma Equipment](https://sigmaequipment.com/guide/automatic-tray-sealer) (secondary) | cited page gave only cut types and MAP/vacuum; reworded (film heat-sealed to flange, inside or outside cut); dealer source [4] added |
| 2 | 5-15 packs/min "small", 10-320 "large" | corrected | Sealpac traysealers | "small/large" was an inference; now tied to Sealpac M-series (5-15) and Amax, single and double lane (10-320), depending on model and pack |
| 3 | Sleevers: up to 100 trays/min, changeover under 5 min | verified | [Sealpac packaging](https://www.sealpac-uk.com/packaging) | none |
| 4 | Machine-to-line handshake signals (was flagged) | verified | [Automation World on PackML](https://www.automationworld.com/communication/article/22144522/packml-and-machine-to-machine-communication) (secondary) | flag removed; now running/faulted/blocked/starved states with a PackML mention; source [5] added |
| 5 | 3.3 lids/min, below even 5-15 packs/min | verified | arithmetic; Sealpac | none |
| 6 | Newrest: cobots assist trolley assembly | corrected | [Newrest, Jan 2021](https://media.newrest.eu/news/cobot-lines-at-the-heart-of-our-inflight-catering-production-units/) | source lists cobot lines and, separately, "technological assistance with the assembly of trolleys"; reworded, year added |
| 7 | Double-lane MAP meat lines near the top of 10-320/min | verified | Sealpac traysealers | none |
| 8 | Sealpac Amax and M-series with MAP, vacuum, skin | verified | Sealpac traysealers | none |
| 9 | Multivac traysealers | verified | [Multivac TX 6 news](https://multivac.com/cr/en/company/news/experience-the-new-compact-class-with-the-TX-6-series) | none |
| 10 | Proseal and Ishida traysealers | corrected | [JBT Marel, 26 Feb 2026](https://jbtmarel.com/en/news/jbt-marel-unveils-new-proseal-xt2-tray-sealing-machine/); [Ishida QX-800](https://www.ishidaeurope.com/en/products/packaging-equipment/tray-sealers-and-handling-equipment-for-food-packaging/qx-800-tray-sealer/) | status: added "(a JBT Marel brand)" |
| 11 | Sealpac UK sells sleevers and flowrappers | verified | Sealpac packaging | none |

### guarding
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Safeguard types: interlocked guards; presence sensing (light curtains, scanners, mats, safety vision); awareness devices | verified | [OSHA Technical Manual IV:4](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) | none |
| 2 | Fixed guards "need a tool to remove" | corrected | OSHA TM | not in cited source; now "fixed barrier guards (fences or panels that block access)" |
| 3 | Light curtain: pulsed infrared beams between a transmitter and receiver | verified | [Light curtain](https://en.wikipedia.org/wiki/Light_curtain) (secondary) | none |
| 4 | Type 4 tolerates accumulated faults; Type 2 suits lower risk | verified | Light curtain (secondary) | none |
| 5 | Minimum distance = approach speed × total stop time + reach-through allowance | verified | [29 CFR 1910.217](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.217); [ISO 13855](https://committee.iso.org/standard/80590.html) | none |
| 6 | 63 in/s (1.6 m/s) hand speed | verified | 29 CFR 1910.217(c)(3)(iii)(e) | none |
| 7 | ISO 13855:2024 covers light curtains, scanners, mats, two-hand controls, interlocks; walking and arm speeds; ages 14+ | verified | ISO 13855 (lists AOPD and AOPDDR, i.e. curtains and scanners) | none |
| 8 | ISO 14119:2024 covers trapped keys and defeat resistance | verified | [Standards Norway](https://online.standard.no/en/iso-14119-2024) | none |
| 9 | Muting definition | verified | OSHA TM glossary | none |
| 10 | Accidents happen during programming, maintenance, testing, setup | verified | OSHA TM V.4 | none |
| 11 | Tunnel openings sized so a hand cannot reach (was flagged) | verified | [ISO 13857:2019](https://committee.iso.org/standard/69569.html) | flag removed; source [6] added |
| 12 | 1.6 m/s × 0.35 s = 560 mm (illustrative) | verified | arithmetic | none |
| 13 | OSHA lists lockout/tagout failure and automatic-mode servicing as "common causes" | corrected | OSHA TM V.4 | these come from OSHA's accident examples; reworded |
| 14 | SICK light curtains and scanners | verified | [SICK deTec4, Nov 2018](https://www.sick.com/us/en/the-detec4-safety-light-curtains-for-reliable-safety-in-all-environments/w/press-detec4_iolink), [SICK microScan3 Core, Apr 2016](https://www.sick.com/us/en/sick-launches-microscan3-core-safety-laser-scanner-/w/press-microscan3-core) | sources [7][8] added (SICK press pages load; catalog pages do not) |
| 15 | Pilz light curtains, guard locking, relays | verified | [Pilz background information, 2021](https://www.pilz.com/mam/pilz/content/uploads/21_08_bi_light_curtains_en.pdf), [Pilz What's new 2024](https://www.pilz.com/mam/pilz/content/import/Company/Press_PR/leaflet_whats_new_2024_en_2024_03_low.pdf), [Pilz PSENopt catalogue, 2007](https://www.parmley-graham.co.uk/content/wp-content/uploads/2022/04/PSENopt_Techn_Catalogue_1001183-EN-02.pdf) (distributor copy) | sources [9][10][11] added; pilz.com product pages return 403, so used Pilz PDFs. The relay source is old (2007) but names PNOZ safety relays directly |
| 16 | Fortress Interlocks | corrected | [Fortress Safety](https://fortress-safety.com/) | status: now trades as Fortress Safety |
| 17 | Troax and Axelent guard fencing | verified | [Troax](https://www.troax.com/), [Axelent](https://www.axelent.com/) | none |
| 18 | ISO 13855 excludes running, jumping, falling | verified | ISO 13855 | none |

### hmi
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Teach pendant carries a three-position enabling device | verified | ABB IRB 360 datasheet | none |
| 2 | Middle position enables; release or panic squeeze stops (was flagged) | verified | [Banner ED1G](https://bannerengineering.com/us/en/products/machine-safety/emergency-stop-and-stop-controls/enabling-device-ed1g-series.html) | flag removed; source [4] added |
| 3 | ISA-101.01-2015; lifecycle; TR101.01-2022, TR101.02-2019 | verified | [ISA-101 series](https://www.isa.org/standards-and-publications/isa-standards/isa-101-standards) | none |
| 4 | High-performance HMI: gray screens, color only when abnormal | unverifiable | only trade and vendor articles found; ISA page silent | kept flagged; reason updated |
| 5 | OEE needs good and total counts | verified | oee.com | none |
| 6 | Andon cord or button lights the station number for a team leader (was flagged) | verified | [LEI lexicon: andon](https://www.lean.org/lexicon-terms/andon/) | flag removed; Toyota fixed-position stop added; source [5] added |
| 7 | Siemens SIMATIC HMI/WinCC, Rockwell PanelView/FactoryTalk View | verified | [Siemens HMI panels](https://www.siemens.com/en-gb/products/simatic-hmi/panels/), [Siemens WinCC](https://www.siemens.com/en-gb/products/simatic-wincc/), [Rockwell VIEW-SG002B, Nov 2022](https://my.goagilix.com/assets/87/be/87be8a53-3d27-4cb6-83fd-045db21721b7/view-sg001_-en-p.pdf) (distributor copy) | sources [6][7][8] added; rockwellautomation.com and its literature library return 403 |
| 8 | Ignition web-based HMI and SCADA | verified | [Inductive Automation](https://inductiveautomation.com/ignition/) | none |
| 9 | ISA-101 requires a philosophy, a style guide, and a lifecycle | corrected | ISA-101 page | "style guide" not in source; now "documented philosophy and a lifecycle" |

### cycle-time
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Takt = available time / customer demand | verified | [LEI lexicon: takt](https://www.lean.org/lexicon-terms/takt-time/) | none |
| 2 | Takt is German for a precise interval, like a musical beat | verified | LEI takt | none |
| 3 | Cycle time is measured per unit | verified | [LEI lexicon: cycle time](https://www.lean.org/lexicon-terms/cycle-time/) | none |
| 4 | Lead time is usually far longer than cycle time | verified | LEI cycle time | none |
| 5 | Little's law L = λW holds for any stable system | verified | [Little's law](https://en.wikipedia.org/wiki/Little%27s_law) (secondary; Little 1961) | none |
| 6 | 480 min shift minus 80 min = 400 min | verified | [Takt time](https://en.wikipedia.org/wiki/Takt_time) (secondary) | none |
| 7 | 3-5% downtime allowance | verified | Takt time (secondary; cites The Kaizen Blitz, 1999) | noted in source description |
| 8 | IRB 360: 0.30-0.60 s on the 25/305/25 mm cycle | verified | ABB datasheet | none |
| 9 | ABB says to verify real cycles by simulation or test | verified | ABB datasheet (RobotStudio or real cycle tests) | none |
| 10 | Takt 18 s; picks per minute per station | verified | arithmetic | none |
| 11 | 9-10 picks per plate, 30-33 per minute | verified | arithmetic | none |
| 12 | Delta catalog rate about 100-200 cycles/min | verified | ABB datasheet (60/0.60 to 60/0.30) | none |
| 13 | 14 trays / 200 per h = 4.2 min | verified | arithmetic | none |
| 14 | Car plant takt about 112 s (illustrative) | verified | arithmetic | none |
| 15 | Toyota reviews takt monthly | verified | LEI takt | none |
| 16 | ABB RobotStudio verifies cycle times | verified | ABB datasheet | none |
| 17 | Siemens Tecnomatix Plant Simulation | verified | [Siemens Plant Simulation fact sheet](https://resources.sw.siemens.com/en-US/fact-sheet-plant-simulation-and-throughout-optimization-to-improve-manufacturing) | source [7] added (discrete event simulation, plants down to specific lines) |
| 18 | FlexSim | corrected | [CIMdata, Oct 2023](https://www.cimdata.com/en/industry-summary-articles/item/23014-autodesk-signs-definitive-agreement-to-acquire-flexsim); flexsim.com now redirects to autodesk.com | status: now "Autodesk FlexSim"; source [6] added |
| 19 | Visual Components 3D simulation | verified | [Visual Components](https://www.visualcomponents.com/) | none |
| 20 | Takt is often confused with cycle time | verified | Takt time (secondary) | none |
| 21 | IRB 360: 0.44-0.92 s on the 90/400/90 mm cycle | verified | ABB datasheet | none |

### line-balancing
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Bottleneck definition; signs: longest queue, highest utilization | verified | [Bottleneck (production)](https://en.wikipedia.org/wiki/Bottleneck_%28production%29) (secondary) | none |
| 2 | Without buffers, line availability is about the product of station availabilities | verified | arithmetic | none |
| 3 | Goldratt, The Goal (1984) | verified | [Theory of constraints](https://en.wikipedia.org/wiki/Theory_of_constraints) (secondary) | none |
| 4 | Five focusing steps | verified | Theory of constraints (secondary); [TOC Institute](https://www.tocinstitute.org/five-focusing-steps.html) | none |
| 5 | Buffers before the constraint (never starves) and after it (never blocks) | verified | Theory of constraints (secondary) | none |
| 6 | Split the bottleneck's work, or run two stations in parallel | verified | Takt time (secondary) | none |
| 7 | Improving a non-bottleneck station adds only idle time | verified | Bottleneck (secondary) | none |
| 8 | Code sketch outputs (14.3 s, 43%, 80%, 202/h, 165/h, 267/h, 59%) | verified | re-ran the script | none |
| 9 | Every station alone exceeds 200 plates/h | verified | computed from the sketch | none |
| 10 | Siemens Tecnomatix Plant Simulation (lines, buffers, breakdowns) | verified | [Siemens Plant Simulation](https://www.siemens.com/en-gb/products/tecnomatix/plant-simulation-software/); [Mes, Plant Simulation tutorial, 2017](https://www.utwente.nl/en/bms/iebis/staff/mes/plantsimulation/tutorialplantsimulation13v20170726.pdf) (secondary) | sources [4][5] added; Siemens gives buffer utilization and bottleneck detection, the University of Twente tutorial gives discrete event and machine failures |
| 11 | FlexSim and AnyLogic | corrected | CIMdata; [AnyLogic](https://www.anylogic.com/) | "Autodesk FlexSim" |
| 12 | Yamazumi chart | corrected | [LEI lexicon: operator balance chart](https://www.lean.org/lexicon-terms/operator-balance-chart/); [Yamazumi chart](https://en.wikipedia.org/wiki/Yamazumi_chart) (secondary) | stacked bars against takt verified; "usually built in a spreadsheet" had no source and was removed; sources [6][7] added |

### oee
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | OEE = A × P × Q | verified | [oee.com calculating OEE](https://oee.com/calculating-oee) | none |
| 2 | Availability = run time / planned production time | verified | oee.com | none |
| 3 | Performance formula; ideal cycle time is the fastest possible; never above 100% | verified | oee.com | none |
| 4 | Quality = good / total | verified | oee.com | none |
| 5 | OEE = good count × ideal cycle / planned time | verified | follows algebraically from 1-4 | none |
| 6 | TEEP is measured against calendar hours | verified | [OEE](https://en.wikipedia.org/wiki/Overall_equipment_effectiveness) (secondary) | none |
| 7 | Wikipedia dates the term to TPM Tenkai (1982) | verified | OEE (secondary; cites OEE Academy) | none |
| 8 | Introduction to TPM, 1984 (English edition 1988) | verified | [oee.com world-class](https://oee.com/world-class-oee) | none |
| 9 | 90/95/99 gives 84.6%, rounded to 85% | verified | oee.com world-class | none |
| 10 | Minimums from experience; prize-winning plants exceeded 85% | verified | oee.com world-class | none |
| 11 | Origin: Japan, 1970s, automotive | verified | oee.com world-class | none |
| 12 | ISO 22400-2:2014 includes OEE; its two versions are inconsistent | verified | OEE (secondary) | none |
| 13 | ISO 22400-2:2014 is current | corrected | [ISO 22400-2](https://committee.iso.org/standard/54497.html) | status added: "to be revised", replacement at proof stage; source [5] |
| 14 | OEE matters most at the bottleneck | verified | Theory of constraints (secondary) | none |
| 15 | Cheese example: 90.0/91.3/97.0 = 79.7%; 74.4% if washdown counted as unplanned | verified | recomputed | none |
| 16 | oee.com worked example (88.8/86.1/97.8 = 74.8%) | verified | oee.com | none |
| 17 | Vorne XL | verified | [Vorne](https://www.vorne.com/) | none |
| 18 | Evocon cloud OEE | verified | [Evocon](https://evocon.com/) | none |
| 19 | Sepasoft OEE module for Ignition | verified | [Sepasoft](https://www.sepasoft.com/?p=3895) | none |
| 20 | Most plants are near 60%; below 45% is more common than above 85% | verified | oee.com world-class | none |
| 21 | 90% on every factor gives 73% | verified | oee.com world-class | none |

### ip-rating
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | IEC 60529; first digit 0-6, second 0-9 | verified | [IP code](https://en.wikipedia.org/wiki/IP_code) (secondary) | none |
| 2 | Digit 5 = dust-protected; 6 = dust-tight, vacuum test up to 8 h | verified | IP code (secondary) | none |
| 3 | IPX5 12.5 L/min at 30 kPa; IPX6 100 L/min at 100 kPa; both from 3 m, at least 3 min | verified | IP code (secondary) | none |
| 4 | IPX7: 30 min, lowest point 1 m down | verified | IP code (secondary) | none |
| 5 | IPX8: manufacturer-specified, generally up to 3 m | verified | IP code (secondary) | none |
| 6 | IPX9: 80 °C, 8-10 MPa, 14-16 L/min, 0.10-0.15 m, 4 angles, 30 s each | verified | IP code (secondary); [DigiKey](https://www.digikey.com/en/blog/ip-code) (secondary) | none |
| 7 | IPX9 added by Amendment 2 in 2013 | verified | [AFNOR NF EN 60529/A2](https://www.boutique.afnor.org/en-gb/standard/nf-en-60529-a2/degrees-of-protection-provided-by-enclosures-ip-code/fa181031/1434) (Oct 2013) | none |
| 8 | IP69K: from DIN 40050-9, now ISO 20653; same jet test as IPX9 | verified | IP code (secondary) | none |
| 9 | Not cumulative above X6; list every test passed | verified | IP code (secondary) | none (source's example is IPX5/IPX7; the file's IP66/IP67/IP69K uses the same slash convention) |
| 10 | Daily sanitation chemicals and hot water | unverifiable | no primary source found | kept flagged; reason updated |
| 11 | Warm sealed housing pulls in moisture as it cools | unverifiable | no primary source found | kept flagged; reason updated |
| 12 | IP67 alone does not prove 80 bar / 80 °C jet survival | verified | test definitions above | none |
| 13 | ABB stainless IRB 360 is IP69K validated | verified | ABB datasheet | none |
| 14 | QUPAQ denesters are IP67-rated | verified | QUPAQ range | none |
| 15 | Stäubli Stericlean and HE robots | verified | [Stäubli press release, May 2020](https://assets.staubli.com/Robotics/Local_content/Staeubli_Interpack_PR_EN_now_2021.pdf) | source [6] added (HE resists moisture and water-based cleaning; Stericlean is for aseptic environments) |
| 16 | ifm and SICK IP69K sensors | verified | [ifm photoelectric, 2019](https://www.ifm.com/dk/en/shared/productnews/2019/sps/measuring-photoelectric-sensor-for-the-food-industry), [ifm inductive, 2019](https://www.ifm.com/gb/en/shared/productnews/2019/updates/inductive-full-metal-sensors-robust-compact-accurate), [SICK inox photoelectric, 2012](https://www.sick.com/au/en/w/blog-food-safe-and-hygienically-designed-photoelectric-sensors-and-reflectors-made-of-inox-steel/) | sources [7][8][9] added |
| 17 | IEC 60529 and ISO 20653 are the test standards | verified | IP code (secondary); AFNOR | none |

### hygienic-design
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | 3-A and EHEDG: Ra at most 0.8 µm | verified | [Food Safety Magazine, Curiel 2003](https://www.food-safety.com/articles/4350-hygienic-design-of-equipment-in-food-processing) | none |
| 2 | Cold-rolled stainless: Ra 0.2-0.5 µm | verified | Curiel 2003 | none |
| 3 | Principles: no crevices or dead areas, no metal-to-metal joints, smooth welds, drainable, inert materials | verified | Curiel 2003 | none |
| 4 | EHEDG GL 8, 4th edition, Dec 2025; risk-based; basis for certification | verified | [EHEDG GL 8](https://ehedg.org/guidelines-working-groups/guidelines/guidelines/detail/hygienic-design-principles) | none |
| 5 | Listeria, "unlike most bacteria", grows at refrigeration temperatures | corrected | [CDC: how Listeria spreads](https://www.cdc.gov/listeria/causes/) | the comparison is not on current FDA or CDC pages and was dropped; source switched from FDA to CDC |
| 6 | Listeria lingers in hard-to-clean spots | verified | CDC: "difficult to fully remove" from processing facilities | reworded |
| 7 | EN 1672-2 zones; splash zone is where product "runs back" (was flagged) | corrected | [prEN 1672-2:2019 preview](https://cdn.standards.iteh.ai/samples/59736/028f6fb3ae8d4153a15ec2020e35d0d7/SIST-EN-1672-2-2021.pdf) | wrong: a splash area is where food does not return; draining back counts as food area. Uses the standard's term "area"; flag removed; source [6] |
| 8 | 3-A uses the same 0.8 µm limit | verified | Curiel 2003 | none |
| 9 | ABB stainless IRB 360: rinse-off surfaces, lubricant-free joints | verified | ABB datasheet | none |
| 10 | Detectable belt materials | verified | Intralox FoodSafe | none |
| 11 | Juice and crumbs get drawn into suction hoses | unverifiable | no primary source found | kept flagged; reason updated |
| 12 | Dead areas outside the main cleaning flow are harder to clean (CIP) | verified | Curiel 2003 | none |
| 13 | Shape matters as much as material | verified | Curiel 2003 principles | none |
| 14 | EHEDG certification, 3-A, Intralox FoodSafe products | verified | sources above | none |
| 15 | End effectors removable without tools | verified | prEN 1672-2 ("easily cleanable": dismantling without tools) | none |

### safety-standards
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | EU presumes conformity when harmonised standards are followed | verified | [EUR-Lex Decision (EU) 2026/2015](https://eur-lex.europa.eu/eli/dec_impl/2026/2015/oj/eng), recital 15 | source [14] replaced (was IBF) |
| 2 | ISO 12100 is type A, the basis for type B and C | verified | [ISO 12100](https://committee.iso.org/standard/51528.html) | none |
| 3 | 10218-1 covers the robot as partly completed machinery; 10218-2 covers integration | verified | [ISO 10218-1](https://committee.iso.org/standard/73933.html), [ISO 10218-2](https://committee.iso.org/standard/73934.html) | none |
| 4 | ISO 13849-1: PL a-e, any technology | verified | [ISO 13849-1](https://committee.iso.org/es/sites/isoorg/contents/data/standard/07/34/73481.html); [ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) (secondary) | technologies named; source [16] added for PL a-e |
| 5 | IEC 62061 is for electrical and programmable systems | corrected | [IEC 62061:2021+AMD1:2024](https://webstore.iec.ch/en/publication/59927) | outdated: the 2021 edition extended it to non-electrical technologies; source [7] replaced with IEC |
| 6 | 2025 edition replaced the blanket PL d with per-function PL | verified | [SICK](https://www.sick.com/br/en/more-safety-for-humans-and-machines/w/blog-robotic-norm-iso10218) | none |
| 7 | Two robot classes | verified | SICK | none |
| 8 | Cybersecurity added | verified | SICK | none |
| 9 | ISO/TS 15066 content, including force and pressure limits, absorbed | verified | SICK; [Robot Report](https://www.therobotreport.com/updated-ansi-a3-standards-address-industrial-robot-safety/) (secondary) | none |
| 10 | ISO 10218-1:2025, 3rd edition, 5 Feb 2025 | verified | ISO 10218-1 | none |
| 11 | ISO 10218-2:2025, 2nd edition, 5 Feb 2025 | verified | ISO 10218-2 | none |
| 12 | ISO/TS 15066:2016 still listed as valid | verified | [EVS](https://www.evs.ee/en/iso-ts-15066-2016) | none |
| 13 | R15.06-2025 adopts ISO 10218 parts 1-2 and revises R15.06-2012 | verified | Robot Report (secondary) | none |
| 14 | R15.06 Part 3 released January 2026 | verified | [Robotics 24/7, 14 Jan 2026](https://www.robotics247.com/article/a3-releases-part-3-of-ansi-a3-r15.06-2025-robot-safety-standard) (secondary) | source [5] replaced (Plant Automation piece had dubious extra claims) |
| 15 | ISO 12100:2010 confirmed 2022; revision in development | verified | ISO 12100 (ISO/DIS 12100.3) | none |
| 16 | ISO 13849-1:2023, 4th edition | verified | ISO 13849-1 | none |
| 17 | IEC 62061:2021 + Amd 1:2024 | verified | IEC webstore | none |
| 18 | ISO 13855:2024, 3rd edition, Nov 2024 | verified | ISO 13855 | none |
| 19 | ISO 13850:2015 is current | verified | [EVS](https://www.evs.ee/en/iso-13850-2015) | none |
| 20 | IEC 60204-1 edition 6.1 (2016 + Amd 1:2021) | verified | [IEC](https://webstore.iec.ch/en/publication/71256) | none |
| 21 | ISO 14119:2024 | verified | Standards Norway | none |
| 22 | Regulation (EU) 2023/1230 applies from 20 Jan 2027, replaces 2006/42/EC | verified | [EU-OSHA](https://osha.europa.eu/en/legislation/directive/regulation-20231230eu-machinery) | none |
| 23 | EN ISO 10218-1/-2:2025 harmonised in the OJ on 7 Sep 2026 | corrected | EUR-Lex Decision (EU) 2026/2015 | clarified: listed under Directive 2006/42/EC by Decision 2026/2015 (not the new Regulation) |
| 24 | Cobot force limits now in ISO 10218-2:2025 specifically | corrected | SICK (gives no part number) | now "ISO 10218:2025" in two places |
| 25 | SICK: treat 10218-2:2025 as state of the art for retrofits; new CE assessment after significant change | verified | SICK | none |
| 26 | SISTEMA is free software from IFA | verified | [DGUV/IFA](https://www.dguv.de/e89507) | none |
| 27 | Pilz PNOZmulti, Siemens S7-1500F | verified | [Pilz What's new 2024](https://www.pilz.com/mam/pilz/content/import/Company/Press_PR/leaflet_whats_new_2024_en_2024_03_low.pdf), [Siemens SIMATIC Safety Integrated](https://www.siemens.com/en-gb/products/simatic/simatic-safety-integrated/) | sources [17][18] added |
| 28 | A3 store sells R15.06-2025 | verified | Robot Report (secondary) | none |
| 29 | Since 2026, the US standard has a separate part for users | verified | Robotics 24/7 (secondary) | none |
