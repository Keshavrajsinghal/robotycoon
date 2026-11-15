# Accuracy review

Every concept file in `/knowledge` (12 areas, 105 concepts; area 7 was split into two parts for review) went through two independent review passes, followed by a cross-file consistency pass. In the first pass, a fact checker took each factual claim and checked it against primary sources: manufacturer datasheets and manuals, official project documentation, standards bodies (ISO, IEC, IETF, W3C, and EUR-Lex for EU law), textbooks, and peer-reviewed papers. Wikipedia and blog sources were replaced wherever a primary source could be found, and are labeled secondary where they were kept. Each claim was marked verified, corrected, or unverifiable, and unverifiable claims were either flagged in the text with `[unverified]` or removed. In the second pass, a different reviewer tested every Plain-section analogy for the wrong predictions it would lead a newcomer to make, rewrote the ones that failed, tightened the Precise sections (plain definitions at first use, what breaks without the thing), and re-opened a sample of the first pass's verified and corrected claims as spot-checks. A final pass compared overlapping facts and the running cheese plate example across all files, and the glossary was then brought into line with the corrected files. The review was done in November 2026, and time-sensitive statements (company ownership, standard editions, software releases) are dated to then. Limits: paywalled standards, ISO and IEC documents in particular, could only be checked through official abstracts, publisher previews, or standards-body summaries; some vendor sites blocked automated access; and the shared web-search quota ran out at times, so some checks used directly fetched pages instead (official docs at known URLs, arXiv abstract pages, GitHub repositories, PDFs read locally, and the Wikipedia API used only to find the primary references).

## Summary table

| Area | Claims checked | Verified | Corrected | Unverifiable (flagged / removed) | Analogies rewritten | Spot-check failures |
|---|---|---|---|---|---|---|
| Area 1, Robot bodies | 229 | 205 | 19 | 4 / 1 | 2 of 12 | 0 of 16 |
| Area 2, Inside a joint | 190 | 145 | 34 | 5 / 6 | 1 of 9 | 0 of 13 |
| Area 3, End effectors | 115 | 102 | 11 | 1 / 1 | 0 of 6 | 0 of 17 |
| Area 4, Sensors | 197 | 169 | 24 | 1 / 3 | 1 of 7 | 1 of 15 |
| Area 5, Compute and electronics | 129 | 104 | 13 | 7 / 5 | 1 of 6 | 0 of 16 |
| Area 6, Cell and line | 199 | 167 | 26 | 5 / 1 | 1 of 12 | 1 of 23 |
| Area 7, Classical robot software (part A) | 116 | 106 | 9 | 0 / 1 | 1 of 8 | 1 of 13 |
| Area 7, Classical robot software (part B) | 173 | 155 | 12 | 4 / 2 | 3 of 8 | 0 of 16 |
| Area 8, Robot learning | 163 | 150 | 10 | 3 / 0 | 2 of 9 | 1 of 14 |
| Area 9, Teleoperation | 150 | 129 | 19 | 0 / 2 | 1 of 8 | 2 of 12 |
| Area 10, Platform | 84 | 76 | 8 | 0 / 0 | 0 of 5 | 0 of 18 |
| Area 11, Deployment lifecycle | 99 | 81 | 15 | 0 / 3 | 1 of 7 | 0 of 14 |
| Area 12, Industry map | 150 | 128 | 15 | 4 / 3 | 1 of 8 | 1 of 21 |
| **Total** | **1,994** | **1,717** | **215** | **34 / 28** | **15 of 105** | **7 of 208** |

Notes on the table:

- "Analogies rewritten" is out of the analogies reviewed (one per concept). "Spot-check failures" is out of the first-pass claims the second reviewer re-opened. Every spot-check failure was corrected in the text.
- Area 6 first left 11 product-name claims (Mettler-Toledo, Cognex, Ishida, SICK, Pilz, Siemens, Rockwell, Stäubli, ifm, Yamazumi) unverified and unflagged, because vendor pages blocked the fetch and the search quota ran out mid-review. A follow-up pass sourced all 11 from vendor pages and PDFs, an SEC filing, and distributor-hosted vendor documents: 10 are verified and 1 corrected (the Yamazumi chart entry lost an unsourced "usually built in a spreadsheet"). No flags were added.
- The flagged column is the count after the first pass. The second passes and the consistency pass removed 4 flags (with new sources, or by dropping the claim) and added 1, so 31 flags remain (see Remaining unverified claims).
- The first pass also resolved 98 of the `[unverified]` flags the original writers had left, either with a source or by removing the claim.

## Most important corrections

- **ABB Robotics sale (areas 1, 5, 6, 7, 12).** ABB agreed in October 2025 to sell ABB Robotics to SoftBank for US$5.375 billion, but the sale had not closed by November 2026, and China's foreign-investment security review prohibited the purchase of the China business (ABB statement of 5 November 2026). Several files had an unsourced or trade-press version; all now agree and cite ABB directly.
- **Encoders (area 2).** The file had multi-turn encoders backwards. A battery-backed counter keeps counting while the robot is unpowered; only the type that saves its count at power-down needs a brake to hold the shaft still (Novanta).
- **Brakes (area 2).** The misconception said the brake "mostly holds what has already stopped" in an e-stop. When power is cut at once, the brake does the stopping, which is exactly what Beckhoff's budget of 2,000 such stops counts.
- **Cobot safety (areas 1, 6).** ISO 10218:2025 replaces "collaborative robot" with "collaborative application". Its force limits are body-region pain thresholds (29 regions, now in ISO 10218-2:2025 Annex M), not injury thresholds, and the standard also allows hand guiding and speed and separation monitoring, not only force limiting. ISO/TS 15066 is folded in but still published, with ISO 15066-1 in development.
- **Cold-room ratings (areas 1, 7).** The MiR250 AMR is rated for 5-40 C and the ABB IRB 1200 from +5 C, so neither is rated for the 2-4 C cheese room. The grape station, which had proposed an IRB 1200, now says it needs a cold-rated arm.
- **Safety scanner zone (area 4).** The Keyence SZ-V32N's 80 ms response applies only in its high-speed mode, which cuts the range from 8.4 m to 5.7 m; standard mode is 160 ms. Under ISO 13855 the cheese line's 1.2 m protective zone was not plausible, because the reach allowance alone is about 1.08 m. It is now about 2 m, following Keyence's 2.1 m worked example.
- **EU Machinery Regulation (area 5).** Regulation (EU) 2023/1230 applies from 20 January 2027, not 14 January; a July 2023 corrigendum moved the date.
- **Stop categories and safety ratings (area 5).** "Industrial robots commonly use stop category 1" was wrong as a general claim: ABB's IRC5 ships with its e-stop set to category 0, so it depends on vendor and settings. ISO 10218-1:2011 required PL d, but no source supports "with category 3"; the 2025 edition sets a performance level for each safety function.
- **Hygienic zones (area 6).** EN 1672-2's splash area was defined backwards. A splash area is one where food does not return to the product, and anything that can drip into food is food area, so every surface over the open trays is food area.
- **Line timing (areas 1, 6, 7, 11).** The examples now share one timing model: an 18 s takt, a tray belt that indexes for 1-2 s of each cycle, and the apple station as the bottleneck. OEE was recomputed from the 14.3 s bottleneck cycle (76.0%), and "a recipe change changes the takt math" was corrected, because takt is set by demand.
- **Feeders (area 6).** Denester speeds were corrected from "70-400 trays/min" to about 120 (pneumatic), about 200 (electric), and 400 (scroll). FlexiBowl is made by ARS, not Asyril.
- **PLC languages (area 7).** IEC 61131-3:2025 defines Ladder Diagram, Function Block Diagram, and Structured Text, plus Sequential Function Chart elements; Instruction List is gone, leaving ST as the only text language. A single "tens of ms" scan time became a range that starts around TwinCAT's 10 ms default task cycle.
- **ROS 2, planning, and behavior trees (area 7).** A QoS mismatch is not silent (rclpy logs an incompatible-QoS warning). Humble is still a supported LTS until May 2027, and Kilted's end of life is December 2026 per the current ROS 2 docs. RRT-Connect is the planner MoveIt 2 falls back to when none is configured, not "a common default for arms". A plain BehaviorTree.CPP Sequence resumes at the running child; only ReactiveSequence re-checks from the top.
- **Calibration APIs (area 4).** OpenCV's calibrateCamera returns only the overall error; per-image errors and parameter uncertainties come from calibrateCameraExtended. calibrateRobotWorldHandEye outputs gripper-to-camera, not camera-to-gripper.
- **Robot learning (areas 8, 12).** Diffusion Policy's 46.9% average improvement was measured on 12 tasks from 4 benchmarks, not 15 tasks. The pi0 paper gives about 1-5 hours of fine-tuning data for simpler tasks and 100+ hours for the hardest, replacing a secondary "1-20 hours". Isaac Lab 3.0 is generally available and targets Isaac Sim 6.2. The openpi repository ships Google's Gemma Terms of Use alongside its Apache 2.0 license.
- **Teleoperation latency (area 9).** The urban LTE figure is an 81.6 ms mean round trip from a moving car to a nearby server (Xiao et al., SECON 2019), now cited to the primary paper. Several latency-budget rows attributed delays to encoding and decoding, or called a measurement one-way, which the Provost et al. 2026 paper does not say.
- **Platform standards (area 10).** ISO 21423:2026 was published on 14 October 2026, not "upcoming". UN R156 requires restoring the previous version or reaching a safe state after a failed over-the-air update, and a certified (not "audited") update management system.
- **Deployment and industry (areas 11, 12).** The 10-20% commissioning cost share covers the whole commissioning portion, not only on-site work. Rapid Robotics wound down in 2025 and RobCo bought its assets. IFR's 2018 robot-system value is about US$50 billion (IFR's own release), not US$48.0 billion from Wikipedia. A JR Automation source turned out to be an unrelated cryptography press release and was replaced.
- **Hydraulics (area 2).** "Ten to fifty times factory air" was an arithmetic error (35 MPa / 550 kPa is about 64), now 10-60 with the working shown. Uncited numbers (10x power density, 5-7 year hose life, filtration grades, 1,000 mm bores) were removed, and every Wikipedia source was replaced with primary ones.
- **End effectors (area 3).** A tool center point entered 5 mm short pushes slices 5 mm into the tray, not above it. A vacuum switch cannot catch a double pick, because the cup still seals on the top pack. Piab's silicone cups "comply with" FDA 21 CFR 177.2600 rather than being "certified", since the FDA does not certify products.

## Analogies rejected

| Concept (area) | Old analogy | Wrong prediction it would cause | Replacement |
|---|---|---|---|
| delta (1) | A puppet on strings | A floppy, pull-only plate held up by gravity, which would swing when moved fast. A real delta is rigid closed loops, kept level by paired parallel rods. | Three people on a balcony swinging stiff sticks that all meet at one plate; the breaks text adds the paired rods and the fourth motor that turns the gripper. |
| payload (1) | Holding a bag at arm's length | That a robot's allowed load drops whenever it reaches far. Datasheets actually chart how far the load's balance point sits from the wrist flange; reach limits exist only on some models. | A bag of flour held in your fist versus hung from the end of a broom handle (the broom stands for the gripper). |
| joint-stack (2) | A bicycle, with the motor as "your legs" | A gear ratio near 1:1 to 4:1, or a joint that trades force for speed, since most bike gears speed the wheel up. Robot joints slow the motor 50-160 times. | The barrel of a cordless drill: a small fast motor at the back, gears in front that slow the spin and multiply the twist. |
| camera-calibration (4) | An eyeglass prescription | That calibration sharpens images or fixes focus. It measures where each point lands on the sensor. | Graph paper behind a warped window: known straight lines reveal how the glass bends the view. |
| onboard-compute (5) | A rally co-driver calling out the road | A vision PC that works from a map prepared in advance (co-drivers read pace notes) and feeds the motion loop continuously. It interprets live images and sends one target per pick. | A building-site signal person who watches where a load must land and talks in a crane operator who cannot see that spot. |
| cycle-time (6) | A coxswain setting the stroke rate | That takt is a pace the line chooses to suit its own ability, so a slow station could be "fixed" by lowering takt. Takt comes only from demand and available time. | A sandwich counter expecting 120 lunch orders an hour, which must hand over one every 30 s however fast its staff are. |
| collision-checking (7A) | Sliding cardboard cutouts around a floor plan | That the whole sweep of a motion is checked continuously. Planners check separate snapshots, and a thin obstacle can fall between two of them. | Laying cutouts on a floor plan one arrangement at a time; the break says shapes are 3D, change with every joint angle, and are checked as snapshots. |
| state-machines (7B) | Behavior tree "re-read from the top many times a second" | That every check re-runs on every tick, so a guard placed before a long motion would catch a problem mid-motion. A plain Sequence resumes at the running child. | A kitchen timer asks the cook how the current step is going; only lines marked "check every time" are re-read from the top. |
| ros2 (7B) | A mailbox | That a node starting late finds earlier messages waiting. With the default QoS nothing is kept for late joiners. | Walkie-talkie channels (live, missed if you were not tuned in) plus desk phones for request-and-reply services. |
| vendor-languages (7B) | Each car brand has its own dashboard | That brand differences are surface layout a trained person adapts to in an afternoon. Programs do not port between brands and must be rewritten. | Games for rival consoles: the same basic moves, but a game runs only on its own console until someone rewrites it. |
| robot-datasets (8) | A black-box flight recorder | That training data piles up for free as a by-product of normal operation, which is the concept's own misconception. Most data is staged teleoperation that costs operator and robot time. | A driving school that films every lesson: each hour of footage needs a car, an instructor, and a planned route. |
| on-robot-inference (8) | A simultaneous interpreter working a phrase ahead | Interpreters actually lag behind the speaker, and the picture implies continuous listening, hiding that a chunk plays out without looking. | Reading a story aloud: the voice keeps a steady pace while the eyes run a few words ahead; the break says a late plan needs a safe fallback. |
| teleop-modes (9) | A coach on the phone | A live, continuous call with a helper watching all the time. In remote assist the robot starts the request, sends one snapshot, and nobody watches between requests. | The robot texts a helper a photo and a question, then finishes the job itself. |
| acceptance-tests (11) | A car test drive | That a failed FAT means walking away and buying elsewhere, and that a short try is enough. The cell is custom-built under contract: failures are fixed and retested, payment is held, and passing means hours at rate. | Custom-built bookshelves, inspected at the workshop and again once fitted, with the last payment held until failures are fixed. |
| component-makers (12) | Companies that make "engines" for car brands | That robot makers buy their motors from outside. Car brands mostly build their own engines, and FANUC and Yaskawa make their own servo motors. | Companies that make gearboxes, brakes, and tires for car brands (the gearbox maps onto the precision reducer, the most outsourced joint part). |

## Cross-file consistency

From `review/consistency.md`. The pass compared every fact that appears in more than one file, and the running cheese plate example, across all 12 areas. It found and resolved 15 conflicts:

- **ROS 2 Kilted Kaiju end of life:** now December 2026, per the current ROS 2 docs table (the older REP 2000 plan said November 2026).
- **NVIDIA GR00T:** areas 8 and 12 now use the same name (GR00T N1.7), give both published speeds with their test setups (about 28 Hz on GitHub, 25 Hz on NVIDIA's product page), and agree on the license (NVIDIA Open Model License).
- **Physical Intelligence:** area 12 now mentions the waitlisted API beta (October 2026) that area 8 described, and area 8 now matches area 12 on the openpi license (Apache 2.0 plus Gemma Terms of Use).
- **ABB IRB 1200 in a 2-4 C room:** area 1 now carries area 7's temperature caveat.
- **ISO/TS 15066 status:** area 6 now cites ISO's own page (still published, marked for revision, ISO 15066-1 in development) instead of a national catalogue.
- **Time per pick:** areas disagreed on 4.5 s versus about 4 s per apple slice. The arithmetic was right everywhere; the assumptions differed. Area 6 now says its figures are upper bounds and gives the after-belt-step values (about 4 s per apple slice, 5-6 s per wedge, 8-17 s per cracker pack), and areas 2 and 11 match.
- **Robot type per station, cheese gripper, grape grasp:** the files legitimately make different design choices (six-axis versus delta, V-notch gripper versus suction cup, whole-bunch versus stem grasp). Each choice is now labeled a judgment call and links the alternative.
- **Gripper at the apple station:** area 2 said soft fingers; every other file says suction cup. Fixed.
- **Cracker pack mass:** area 3 read as 100 g in one concept and 10-30 g in another; both now say 10-30 g, flagged as unverified.
- **ABB sale sources:** trade-press citations in areas 5, 7, and 12 were replaced with ABB's own 5 November 2026 statement.

Checked and already consistent: the EU Machinery Regulation date, safety standard editions, Gemini Robotics access, GR00T 2, Gazebo Jetty support, company ownership facts, robot specs repeated across areas, latency and network figures, and dataset figures (ALOHA, DROID, Open X-Embodiment).

Glossary sync (after the consistency pass): all 235 glossary entries were checked against the corrected area files. 17 entries were revised to match them: behavior tree and Sequence (re-checking happens only in reactive steps), QoS (a mismatch logs a warning), Modbus TCP (the original protocol has no security; a 2018 secure version exists), PFL (body-region pain thresholds), cobot and ISO 10218 (collaborative application, 2025 editions), ISO/TS 15066 (still published, successor in development), delta robot (three arms plus a gripper-turning motor), payload (the offset of the load's balance point), cascaded control (5-10 times faster inner loops), fieldbus, IMU, integrator, AGV, SFC, and Structured Text. 35 entries were added for terms the reviewers introduced, such as collaborative application, hand guiding, speed and separation monitoring, safety distance, safety laser scanner, multi-turn encoder, food area and splash area, harmonised standard, partly completed machinery, HG-DAgger, real-time chunking, and lookahead. The glossary now has 270 terms, and the full validator reports 0 errors.

## Remaining unverified claims

31 `[unverified]` flags remain across the 12 area files (counted with grep). The site shows each one as a visible flag next to the claim, so a reader always knows which statements could not be backed by a source.

| Area | Flags after fact check | Flags remaining | What they are |
|---|---|---|---|
| Area 1, Robot bodies | 4 | 3 | Illustrative cheese-line values: gripper and wedge masses, belt widths, placement tolerance |
| Area 2, Inside a joint | 5 | 5 | Drives sitting in the controller cabinet (two concepts), motor thermal sizing practice, brake-release sequencing, a forum reply about UR's flange sensor |
| Area 3, End effectors | 1 | 2 | Cracker pack mass (10-30 g), in two concepts; the consistency pass added the second flag |
| Area 4, Sensors | 1 | 1 | SICK scanner specs (SICK pages and PDFs would not load) |
| Area 5, Compute and electronics | 7 | 5 | PLC communications step and scan watchdog, car-plant PLC practice, Rockwell's EtherNet/IP pages, safety-PLC internal redundancy |
| Area 6, Cell and line | 5 | 5 | Inspection tracking method, HMI color practice, washdown chemical exposure, seals drawing in water on cold equipment, juice drawn into vacuum hoses |
| Area 7, Classical robot software (part A) | 0 | 0 | None |
| Area 7, Classical robot software (part B) | 4 | 3 | Spot-weld re-teaching practice, illustrative code-sketch lines, airport baggage divert practice |
| Area 8, Robot learning | 3 | 3 | Safety layers kept outside learned policies, deformable-object simulation maturity, which models Physical Intelligence's API serves |
| Area 9, Teleoperation | 0 | 0 | None |
| Area 10, Platform | 0 | 0 | None |
| Area 11, Deployment lifecycle | 0 | 0 | None |
| Area 12, Industry map | 4 | 4 | Brand choice following the support base, fixed-price integrator contracts, gategroup cheese-plate use, menu changeover importance |
| **Total** | **34** | **31** | |

Most remaining flags are either illustrative numbers for the cheese plate line or general industry practice that no primary source states outright. A few are vendor pages that blocked automated access.

## Detailed results

The full review files follow, in order: for each area the fact check, then the analogy and precision review, then the cross-file consistency review.

## Area 1, Robot bodies: fact check

Summary line: 229 claims checked: 205 verified, 19 corrected, 5 unverifiable (4 kept flagged, 1 removed).

Of the 16 original `[unverified]` flags, 12 are resolved: 7 are now verified and cited, 4 are corrected, and 1 (other humanoids) is split between a correction and a removal. The 4 kept flags mark numbers the writer chose for illustration (gripper and wedge masses, belt widths, placement tolerance, vision and gripper overhead); each is plausible and labeled as illustrative. The writer's note that the MiR250's cold-room rating was unchecked is now resolved too. `node tools/build-content.mjs --check knowledge/01-robot-bodies.md` reports 0 errors and 0 warnings.

Source notes. "Primary, third-party host" means a maker's own document served from a distributor or manual site (productivity.com, hartfiel.com, rg-group.com, komachine.com, ManualsLib, manualsdir); I checked the text against the document itself. Two sources are secondary: the StandICT entry for ISO 9283 (a repository listing), and Hartmann et al. 2026 (an arXiv preprint that compares the ISO 10218 2011 and 2025 texts clause by clause). ISO's own pages returned HTTP 403, so I could not open the standards themselves. The MiR AGV/AMR blog is the maker's explainer, not a standard.

Short names for links used below:
[FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) (primary, third-party host) ·
[ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) (primary, third-party host) ·
[IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) ·
[GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) ·
[FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) (primary, third-party host) ·
[FANUC-SR-info](https://www.fanucamerica.com/cmsmedia/datasheets/SR%20Series%20SCARA%20Robot%20Product%20Info%20Sheet_262.pdf) ·
[IRB1100](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) (primary, third-party host) ·
[AbsAcc](https://library.e.abb.com/public/0f879113235a0e1dc1257b130056d133/Absolute%20Accuracy%20EN_R4%20US%2002_05.pdf) ·
[ABB-pack](https://library.e.abb.com/public/90cbaf37724492a4c1257b6700492591/Robots%20for%20packaging%20industry_robotics_Discrete%20automation%20and%20motion%20division_ABB.pdf) ·
[Xiang](https://yuxng.github.io/Courses/CS6341Fall2025/lecture_02_configuration_space.pdf) ·
[MR-ch2](https://www.cambridge.org/core/books/modern-robotics/configuration-space/2C603CC767D055FDD57F947CE2AB0812) ·
[MR](http://hades.mech.northwestern.edu/images/7/7f/MR.pdf) ·
[Babin25](https://espace2.etsmtl.ca/32361/1/124%20-%20Experimental%20repeatability%20assessm.pdf) ·
[StandICT](https://standict.eu/standards-repository/manipulating-industrial-robots-performance-criteria-and-related-test-methods) (secondary) ·
[IRB1200-p47](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=47) ·
[IRB1200-p24](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=24) ·
[IRB1200-wr](https://www.manualslib.com/manual/2532790/Abb-Irb-1200.html?page=59) (all three: primary, third-party host) ·
[M2000](https://www.fanucamerica.com/products/robot/m-2000ia-2300) ·
[Quattro-UG](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) (primary, third-party host) ·
[Atlas](https://bostondynamics.com/products/atlas/) ·
[UR10g-DS](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) ·
[UR10g](https://universal-robots.com/products/ur10g-1750/) ·
[UR-e](https://universal-robots.com/products/e-series/) ·
[UR-Series](https://universal-robots.com/products/ur-series/) ·
[UR-FAQ](https://www.universal-robots.com/products/faq) ·
[Gudel-FP](https://www.gudel.com/products/linearaxis/fp) ·
[Gudel-CP](https://www.gudel.com/products/linearaxis/cp) ·
[Gudel](https://www.gudel.com/) ·
[MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications) ·
[MiR1200](https://mobile-industrial-robots.com/products/robots/mir1200-pallet-jack) ·
[MiR](https://mobile-industrial-robots.com/) ·
[MC250](https://mobile-industrial-robots.com/products/mir-go/enabled-robotics-MC250) ·
[MiR-blog](https://mobile-industrial-robots.com/blog/agv-vs-amr-whats-the-difference) (maker explainer) ·
[Stretch](https://bostondynamics.com/products/stretch/) ·
[Digit5](https://www.agilityrobotics.com/solutions/digit-5) ·
[Agility](https://agilityrobotics.com/) ·
[G1](https://www.unitree.com/g1) ·
[H2](https://www.unitree.com/H2) ·
[BD-blog](https://bostondynamics.com/blog/getting-real-with-humanoids/) ·
[Figure](https://www.figure.ai/) ·
[Apptronik](https://apptronik.com/) ·
[ABB-Nov26](https://resources.news.e.abb.com/attachments/published/140154/en-US/0A15DBC92198/20261105_Update_on_divestment_of_ABB_Robotics_EN.pdf) ·
[SoftBank-Oct25](https://group.softbank/en/news/press/20251008) ·
[Omron-SEC](https://www.sec.gov/Archives/edgar/data/0000865415/000110465915072496/a15-21600_1ex99da1h.htm) ·
[Omron-Quattro](https://assets.omron.com/m/7010d1b816f4776f/original/Quattro-650H-650HS-Datasheet.pdf) ·
[Makino14](https://www.jstage.jst.go.jp/article/jrobomech/26/1/26_5/_article) ·
[RSJ](https://robogaku.jp/en/history/business/K-1978-1.html) ·
[Clavel](https://patents.google.com/patent/US4976582A/en) ·
[Hartmann26](https://arxiv.org/abs/2602.17822) (secondary)

### dof
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | DoF = smallest number of real coordinates that describe the configuration | verified | [MR-ch2](https://www.cambridge.org/core/books/modern-robotics/configuration-space/2C603CC767D055FDD57F947CE2AB0812) | none |
| 2 | Rigid body: 6 DoF in space, 3 on a plane | verified | [Xiang](https://yuxng.github.io/Courses/CS6341Fall2025/lecture_02_configuration_space.pdf) | none |
| 3 | Revolute and prismatic joints each add 1 DoF | verified | [Xiang](https://yuxng.github.io/Courses/CS6341Fall2025/lecture_02_configuration_space.pdf) | none |
| 4 | Configuration space has one dimension per DoF | verified | [Xiang](https://yuxng.github.io/Courses/CS6341Fall2025/lecture_02_configuration_space.pdf) | none |
| 5 | Open vs closed chains; Grübler assumes independent constraints | verified | [Xiang](https://yuxng.github.io/Courses/CS6341Fall2025/lecture_02_configuration_space.pdf) | none |
| 6 | Spec sheets say "axes" and count motorized ones | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf), [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 7 | "SCARA and most delta robots are 4-axis" | corrected | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | "most" to "many": only 6 of FANUC's 15 delta models are 4-axis |
| 8 | A seventh joint makes an arm redundant and frees the elbow | verified | [MR](http://hades.mech.northwestern.edu/images/7/7f/MR.pdf) | re-cited: the slides show a 7-joint arm but do not say "redundant"; added MR as source 6 |
| 9 | R-1000iA: 6-axis models, 5-axis /80H, 7-axis /120F-7B | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 10 | R-1000iA family "aimed at spot welding" | corrected | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | FANUC pitches the /100F model, not the whole family, for high-speed spot welding |
| 11 | M-1iA delta in 3-, 4-, and 6-axis versions | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 12 | Atlas: 56 DoF | verified | [Atlas](https://bostondynamics.com/products/atlas/) | none |
| 13 | IRB 360 in 3- and 4-axis versions | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 14 | SCARAs and most deltas have 3-4 axes; industrial arms 5-7 | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf), [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none (10 of 15 FANUC deltas have 3-4 axes) |

### payload
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | FANUC sheets say "max. load capacity at wrist" | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none |
| 2 | Payload includes the gripper | verified | [Gudel-CP](https://www.gudel.com/products/linearaxis/cp) | none |
| 3 | Epson GX8: 4 kg rated, 8 kg max; cycle time quoted at rated payload | verified | [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | none |
| 4 | UR10g-1750: 8 kg standard, 10 kg extended | verified | [UR10g](https://universal-robots.com/products/ur10g-1750/), [UR10g-DS](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) | none |
| 5 | Atlas: 50 kg instantaneous, 30 kg sustained | verified | [Atlas](https://bostondynamics.com/products/atlas/) | none |
| 6 | UR publishes a payload vs center-of-gravity offset chart | verified | [UR10g-DS](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) | none |
| 7 | LR Mate 200iD/14L: 14 kg; 911 mm only below 12 kg; 820 mm at full load | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 8 | SR-3iA/SR-6iA allowable wrist inertia 0.06-0.12 kg·m² | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none |
| 9 | Epson says to set inertia for load and end effector | verified | [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | none |
| 10 | Smallest Güdel FP: 300/500/800 N; 300 N is about 31 kg | verified | [Gudel-FP](https://www.gudel.com/products/linearaxis/fp) | none |
| 11 | Ignoring limits causes overshoot, slow settling, faults, wear (was flagged) | corrected | [IRB1200-p24](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=24) | replaced with ABB's stated effects: overload damage to motors, gearboxes, and structure, no warning on arm-load overload, no warranty; flag removed; source 9 added |
| 12 | Gripper a few hundred grams, wedge tens of grams | unverifiable | none (illustrative) | kept flagged; plausible |
| 13 | IRB 360-1 1 kg, IRB 360-3 3 kg; 0.40 s vs 0.30 s at 0.1 kg | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 14 | About 6 s per wedge (3 wedges in 18 s) | verified | arithmetic from FORMAT.md rate | none |
| 15 | M-2000iA/2300: 2,300 kg; lifts a whole car or loads castings | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 16 | M-2000iA/2300 robot mass 11,000 kg | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf), [M2000](https://www.fanucamerica.com/products/robot/m-2000ia-2300) | none |
| 17 | 4 kg LR Mate weighs 20 kg | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 18 | M-2000iA/2300 is the highest payload in the 2022 overview | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 19 | Payload range 0.5 kg (small deltas) to 2,300 kg | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |

### reach
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | FANUC CRX reach measured "from faceplate" | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 2 | "others measure to the wrist center" (no source) | corrected | [IRB1200-wr](https://www.manualslib.com/manual/2532790/Abb-Irb-1200.html?page=59) | now says ABB draws its working ranges at the wrist center; source 6 added |
| 3 | IRB 360: 1,130 or 1,600 mm across, about 250-300 mm tall | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none (drawing shows 250-305 mm) |
| 4 | UR10g-1750 base 204 mm | verified | [UR10g-DS](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) | none |
| 5 | Adept Quattro frame about 883 x 883 mm | verified | [Quattro-UG](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) | none |
| 6 | ABB mounting: any angle, floor only, inverted, shelf | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 7 | Belts a few hundred mm wide | unverifiable | none (illustrative) | kept flagged |
| 8 | IRB 360/1130 working height 250 mm | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 9 | M-410iC: 4-axis, 2,403-3,143 mm | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 10 | Longest-reaching M-2000iA models reach 4,683 mm | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none (900L and 1700L) |
| 11 | CRX-10iA 1,249 mm, /L 1,418 mm | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 12 | IRB 1010: 370 mm, ABB's smallest industrial robot | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 13 | Allowed payload drops at full stretch | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 14 | 6-axis reach 370-4,683 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 15 | SCARA reach 350-1,100 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 16 | Delta working diameter 280-1,600 mm; Adept quotes 650 mm radius | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf), [Quattro-UG](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) | none |

### repeatability
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | ISO 9283, 1998 edition | verified | [StandICT](https://standict.eu/standards-repository/manipulating-industrial-robots-performance-criteria-and-related-test-methods) (secondary) | none; iso.org blocked (403); no newer edition found |
| 2 | Pose test: 5 points on a plane in a cube, 30 cycles | verified | [Babin25](https://espace2.etsmtl.ca/32361/1/124%20-%20Experimental%20repeatability%20assessm.pdf) | none |
| 3 | RP = mean distance from barycenter + 3 standard deviations | verified | [Babin25](https://espace2.etsmtl.ca/32361/1/124%20-%20Experimental%20repeatability%20assessm.pdf) | none |
| 4 | About a 99.7% band | verified | [Babin25](https://espace2.etsmtl.ca/32361/1/124%20-%20Experimental%20repeatability%20assessm.pdf) | none |
| 5 | AP = distance from commanded position to the mean landing point | verified | [IRB1200-p47](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=47) | none |
| 6 | IRB 1200 RP measured at rated load, max offset, 1.6 m/s | verified | [IRB1200-p47](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=47) | none |
| 7 | Results vary with position, speed, configuration, approach, backlash | verified | [IRB1200-p47](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=47) | none |
| 8 | Accuracy error varies with workspace, load, warm-up | verified | [Babin25](https://espace2.etsmtl.ca/32361/1/124%20-%20Experimental%20repeatability%20assessm.pdf), [IRB1200-p47](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=47) | citation widened from [1] to [1, 3] |
| 9 | Repeatability 0.01-0.1 mm on most robots, 0.1-0.3 mm on the largest | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [M2000](https://www.fanucamerica.com/products/robot/m-2000ia-2300) | none |
| 10 | Real robot vs CAD 8-15 mm; about 0.5 mm with Absolute Accuracy | verified | [AbsAcc](https://library.e.abb.com/public/0f879113235a0e1dc1257b130056d133/Absolute%20Accuracy%20EN_R4%20US%2002_05.pdf) | source date set to 2005 |
| 11 | IRB 360 static repeatability 0.1 mm | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 12 | Wedge placement within a few mm | unverifiable | none (illustrative) | kept flagged |
| 13 | IRB 360 tracking 1.0 mm at 200 mm/s, 1.5 mm at 350-750 mm/s | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 14 | Absolute Accuracy: per-robot parameters; robots exchangeable | verified | [AbsAcc](https://library.e.abb.com/public/0f879113235a0e1dc1257b130056d133/Absolute%20Accuracy%20EN_R4%20US%2002_05.pdf) | none |
| 15 | Cited study used iGPS on an ABB IRB 120; laser trackers also used | verified | [Babin25](https://espace2.etsmtl.ca/32361/1/124%20-%20Experimental%20repeatability%20assessm.pdf) | none |
| 16 | IRB 1200 RP 0.02-0.025 mm | verified | [IRB1200-p47](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=47) | none |
| 17 | Small arms and SCARAs 0.01-0.025 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [IRB1200-p47](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=47) | none |
| 18 | "Deltas and cobots: 0.03-0.1 mm" | corrected | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | split: deltas 0.03-0.1 mm; ABB cobots 0.01-0.05 mm (SWIFTI 0.01-0.03, YuMi 0.02, GoFa 0.05) |
| 19 | Largest arms: IRB 7600 up to 0.27 mm, M-2000iA/2300 ±0.18 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [M2000](https://www.fanucamerica.com/products/robot/m-2000ia-2300) | none |
| 20 | Delta tracking 1.0-5.0 mm from 200 to 1,400 mm/s | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |

### speed-specs
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | IRB 1100 joint speeds 280-750°/s | verified | [IRB1100](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) | none |
| 2 | UR10g-1750 max TCP speed 5 m/s | verified | [UR10g-DS](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) | none |
| 3 | IRB 1100 settles within 0.1 mm in 0.08-0.19 s | verified | [IRB1100](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) | none |
| 4 | Adept cycle: 25 up, 305 across, 25 down, and back | verified | [Quattro-UG](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) | none |
| 5 | ABB: 25/305/25 for deltas; 25 x 300 x 25 with 1 kg for IRB 1100 | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf), [IRB1100](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) | none |
| 6 | FANUC SCARA: 25-300-25 mm with 2 kg | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none |
| 7 | Epson: 300 mm across, 25 mm up, rated payload, boost mode | verified | [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | none |
| 8 | IRB 360: 0.30-0.60 s (25/305/25), 0.44-0.92 s (90/400/90) | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 9 | ABB says to verify cycle times in RobotStudio or with tests | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 10 | 18 s per plate, 4.5 s per apple pick | verified | arithmetic from FORMAT.md rate | none |
| 11 | Robot speed limits the line only if it ran several times faster | unverifiable | none (writer's estimate) | kept flagged; plausible (about 1.5 s per pick vs 4.5 s available) |
| 12 | SR-6iA 0.29 s, SR-3iA 0.33 s; about 14% more loops | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none (0.33/0.29 = 1.14) |
| 13 | GX8 0.28-0.33 s; 7,450-9,460 mm/s | verified | [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | none |
| 14 | Delta 0.26 s (Quattro, 0.1 kg) to about 0.6 s (IRB 360) | verified | [Quattro-UG](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91), [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 15 | SCARA 0.28-0.33 s with 2-4 kg | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf), [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | none |
| 16 | IRB 1100: 0.42 s, 25 x 300 x 25 mm, 1 kg | verified | [IRB1100](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) | none |
| 17 | IRB 1100 datasheet "Rev. E, 2020" | corrected | [IRB1100](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) | footer reads Rev. D, December 2019; source description fixed |

### six-axis
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | IRB 1100: axis 1 ±230°, axes 4-6 wrist | verified | [IRB1100](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) | none |
| 2 | Multiple IK solutions; joint speeds blow up near singularities (was flagged) | verified | [MR](http://hades.mech.northwestern.edu/images/7/7f/MR.pdf) | flag removed; added "or none" and source 6 |
| 3 | Repeatability from 0.01 mm to "about 0.2 mm" on the largest | corrected | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [M2000](https://www.fanucamerica.com/products/robot/m-2000ia-2300) | now 0.1-0.27 mm, matching the Typical specs table |
| 4 | Payload 1.5 kg tabletop to 2,300 kg | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 5 | 5-axis, 7-axis, cleanroom, foundry, washdown variants | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf), [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 6 | Hygienic IRB 1200: wipe-down, washdown with cover, 5-7 kg, 0.02-0.025 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 7 | R-1000iA/100F for high-speed spot welding | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 8 | M-2000iA/2300 lifts a whole car | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 9 | M-20iD/25: 25 kg, 1,831 mm | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 10 | ABB and FANUC catalogs are mostly six-axis | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 11 | IRB 1100: 4 kg, 475-580 mm, 0.01 mm, IP40 standard, IP67 option | verified | [IRB1100](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) | none |
| 12 | LR Mate 200iD family 4-14 kg | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 13 | IRB 6700: 150-300 kg, 2.6-3.2 m, IP67 standard | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 14 | ABB agreed in 2025 to sell robotics to SoftBank (was flagged) | corrected | [ABB-Nov26](https://resources.news.e.abb.com/attachments/published/140154/en-US/0A15DBC92198/20261105_Update_on_divestment_of_ABB_Robotics_EN.pdf), [SoftBank-Oct25](https://group.softbank/en/news/press/20251008) | updated: agreed October 2025; as of November 2026 not closed, and China prohibited the purchase of the China business; flag removed; source 5 added |
| 15 | M-2000iA/2300: 2,300 kg, 3,734 mm, ±0.18 mm | verified | [M2000](https://www.fanucamerica.com/products/robot/m-2000ia-2300) | none |
| 16 | SCARA/delta about 0.3 s vs 0.42 s for a small six-axis arm | verified | [IRB1100](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf), [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none |
| 17 | IP40 standard on small arms to IP67 on larger ones | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 18 | Small arms "any angle"; the heaviest floor only | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 19 | Robot self-mass 20 kg to 11,000 kg | corrected | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | upper end 11,000 kg (M-2000iA/2300) to 12,500 kg (M-2000iA/1700L) |
| 20 | Payload tiers: tabletop 1.5-14, mid 10-70, heavy 100-2,300 kg | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf), [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none (tier boundaries are the writer's grouping) |
| 21 | Reach 370-4,683 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 22 | Repeatability 0.01-0.27 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 23 | IRB 1100 source "Rev. E, 2020" | corrected | [IRB1100](https://cdn.komachine.com/media/product-catalog/IRB_1100_datasheet.pdf) | changed to Rev. D, December 2019 |

### scara
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | SCARA = Selective Compliance Assembly (or Articulated) Robot Arm (was flagged) | verified | [Makino14](https://www.jstage.jst.go.jp/article/jrobomech/26/1/26_5/_article) | flag removed; source 6 added; dropped the unsupported "(or Articulated)" |
| 2 | Two vertical-axis rotary joints + vertical slide + shaft rotation = 4 DoF | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf), [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | none |
| 3 | SR-6iA shaft 2,000 mm/s and 2,500°/s | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none |
| 4 | GX8 joints 1+2: 7,450-9,460 mm/s | verified | [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | none |
| 5 | Selective compliance = stiff vertically, slight give sideways (was flagged) | verified | [RSJ](https://robogaku.jp/en/history/business/K-1978-1.html) | flag removed; source 7 added |
| 6 | About 0.3 s benchmark, ±0.01-0.02 mm | verified | [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10), [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none |
| 7 | Vertical stroke 200-210 mm on small FANUC models | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none |
| 8 | Epson table-top, wall, ceiling mounting | verified | [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | none |
| 9 | ABB IRB 910INV is ceiling-mounted | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 10 | 9-18 s per cracker pack | verified | arithmetic | none |
| 11 | GX8 IP65 version | verified | [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | none |
| 12 | FANUC food-grade SCARAs rated IP65 | verified | [FANUC-SR-info](https://www.fanucamerica.com/cmsmedia/datasheets/SR%20Series%20SCARA%20Robot%20Product%20Info%20Sheet_262.pdf) | none |
| 13 | SR-3iA shown assembling battery packs | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none |
| 14 | Epson cleanroom versions "certified to ISO Class 3" | corrected | [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | sheet says "complies with" ISO Class 3 (ISO 14644-1); wording changed |
| 15 | GX8: 450-650 mm, 4/8 kg, ±0.015 mm, 0.28-0.33 s | verified | [GX8](https://download.epson.com.sg/product_brochures/industrial_robot/ESD/Epson%20SCARA%20GX8.pdf?t=10) | none |
| 16 | SR-3iA/6iA: 3/6 kg, 400/650 mm, ±0.01 mm, 0.33/0.29 s | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none |
| 17 | SR-12iA/20iA: 12/20 kg, 900/1,100 mm | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 18 | IRB 920: 6 kg, 450-650 mm, 0.01-0.02 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 19 | IRB 910INV 1-3 kg rated | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 20 | Wrist inertia 0.06-0.12 kg·m² | verified | [FANUC-SR](https://www.rg-group.com/store/images/document/FANUC/SR%20SCARA%20Series.pdf) | none |
| 21 | Robot mass 19-64 kg across FANUC SR range | corrected | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | 17-64 kg (SR-3iA/H is 17 kg) |
| 22 | Payload 1-20 kg rated | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 23 | Reach 350-1,100 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |

### delta
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Delta is a parallel robot with closed loops | verified | [Xiang](https://yuxng.github.io/Courses/CS6341Fall2025/lecture_02_configuration_space.pdf) | none |
| 2 | Three base motors; paired parallel rods keep plate level; telescoping fourth axis (was flagged) | verified | [Clavel](https://patents.google.com/patent/US4976582A/en) | flag removed; Clavel patent added as source 7 |
| 3 | IRB 360 3/4-axis; FANUC 3/4/6-axis; IRB 365 adds a fifth axis | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf), [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 4 | IRB 360 0.30 s with 0.1 kg; Quattro 0.26 s | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf), [Quattro-UG](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) | none |
| 5 | Payload 0.5-15 kg across ABB and FANUC | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 6 | IRB 360 working zone about 250-300 mm tall | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 7 | Deltas mounted inverted | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf), [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 8 | Static 0.03-0.1 mm; tracking 1.0-5.0 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 9 | Stainless IRB 360 IP69K; detergent, hot water; lubricant-free joints | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 10 | Ambient 0-45 °C | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 11 | Applications list; stainless versions for meat and dairy | verified | [ABB-pack](https://library.e.abb.com/public/90cbaf37724492a4c1257b6700492591/Robots%20for%20packaging%20industry_robotics_Discrete%20automation%20and%20motion%20division_ABB.pdf) | none |
| 12 | PickMaster vision software; conveyor-tracking controllers | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 13 | IRB 360: 1-8 kg, 1,130/1,600 mm, 0.1 mm, IP54/67/69K | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf), [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 14 | IRB 390: "4-axis, 10-15 kg" | corrected | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | 15 kg with 4 axes or 10 kg with 5 axes |
| 15 | FANUC M-1iA/M-2iA/M-3iA/DR-3iB: 0.5-12 kg, 3/4/6-axis | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 16 | Adept Quattro s650: 2 kg, 0.26 s at 0.1 kg | verified | [Quattro-UG](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) | none |
| 17 | Adept now part of Omron; lineup unknown (was flagged) | corrected | [Omron-SEC](https://www.sec.gov/Archives/edgar/data/0000865415/000110465915072496/a15-21600_1ex99da1h.htm), [Omron-Quattro](https://assets.omron.com/m/7010d1b816f4776f/original/Quattro-650H-650HS-Datasheet.pdf) | Omron bought Adept in October 2015 and now sells the Quattro 650H/HS (up to 15 kg, 0.30 s Adept cycle at 0.1 kg); flag removed; sources 8-9 added |
| 18 | Heaviest IRB 360 carries 8 kg | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 19 | Quattro frame about 883 x 883 mm | verified | [Quattro-UG](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) | none |
| 20 | IRB 360 mass 120 kg standard, 145 kg stainless | verified | [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 21 | Working diameter 280-1,600 mm | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf), [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |
| 22 | 0.26-0.60 s on the 25/305/25 loop | verified | [Quattro-UG](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91), [IRB360](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | none |

### gantry
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Repeats within hundredths of a mm while carrying hundreds of kg | verified | [Gudel-FP](https://www.gudel.com/products/linearaxis/fp) | none (FP-5: ±0.02 mm at 2,000-5,000 N) |
| 2 | Three prismatic axes, x, y, z | verified | [Gudel](https://www.gudel.com/), [Xiang](https://yuxng.github.io/Courses/CS6341Fall2025/lecture_02_configuration_space.pdf) | none |
| 3 | FP strokes about 5-10 m x, up to 14 m y (FP-5-HP), 2-3 m z | verified | [Gudel-FP](https://www.gudel.com/products/linearaxis/fp) | none |
| 4 | FP payload 300 N (about 31 kg) to 31,250 N (about 3.2 t) | verified | [Gudel-FP](https://www.gudel.com/products/linearaxis/fp) | none |
| 5 | Top speeds 75-225 m/min; accelerations 2-10 m/s² | verified | [Gudel-FP](https://www.gudel.com/products/linearaxis/fp) | none (high-dynamic setting values) |
| 6 | ±0.02 mm on most sizes, ±0.1 mm on FP-5-HP | verified | [Gudel-FP](https://www.gudel.com/products/linearaxis/fp) | none |
| 7 | CP load at most ±50 mm off the z-axis center | verified | [Gudel-CP](https://www.gudel.com/products/linearaxis/cp) | none |
| 8 | CP derated above 1.0-1.6 m z-stroke | verified | [Gudel-CP](https://www.gudel.com/products/linearaxis/cp) | none |
| 9 | 1-, 2-, and 3-axis gantries | verified | [Gudel](https://www.gudel.com/) | none |
| 10 | FP uses: machine loading, palletizing, packaging, assembly, battery handling | verified | [Gudel-FP](https://www.gudel.com/products/linearaxis/fp) | none |
| 11 | Floor tracks carry a six-axis arm (TMF) | verified | [Gudel](https://www.gudel.com/) | none |
| 12 | CP: compact, machine loading, 300-5,000 N, ±0.02 mm | verified | [Gudel-CP](https://www.gudel.com/products/linearaxis/cp) | none |
| 13 | ZP 2-axis, EP 1-axis | verified | [Gudel](https://www.gudel.com/) | none |
| 14 | ±0.02 mm on most FP and CP sizes | verified | [Gudel-FP](https://www.gudel.com/products/linearaxis/fp), [Gudel-CP](https://www.gudel.com/products/linearaxis/cp) | none |
| 15 | Strokes up to 10 m x, 1.5-14 m y, 1-3 m z | verified | [Gudel-FP](https://www.gudel.com/products/linearaxis/fp), [Gudel-CP](https://www.gudel.com/products/linearaxis/cp) | none |

### cobot
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Cobot = robot designed for "collaborative operation" | corrected | [Hartmann26](https://arxiv.org/abs/2602.17822) (secondary) | ISO 10218:2025 drops "collaborative robot" and "collaborative operation" in favor of "collaborative application"; text updated |
| 2 | PFL keeps contact below "injury thresholds" from ISO 10218 / ISO/TS 15066 (was flagged) | corrected | [Hartmann26](https://arxiv.org/abs/2602.17822) (secondary) | now "body-region pain thresholds", first in ISO/TS 15066 and now carried for 29 body regions in ISO 10218-2:2025 (Annex M); flag removed; source 7 added |
| 3 | UR10g-1750: 23 safety functions; EN ISO 13849-1 and EN ISO 10218-1 | verified | [UR10g-DS](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) | none |
| 4 | Flange F/T sensor ±150 N, ±10 Nm | verified | [UR10g-DS](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) | none |
| 5 | YuMi IRB 14000 has 14 axes, two arms | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 6 | Payload 0.5-35 kg | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none (YuMi 0.5, CR-35iA 35) |
| 7 | Reach 500-1,813 mm | verified | [UR-e](https://universal-robots.com/products/e-series/), [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 8 | Repeatability ±0.01-0.1 mm | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf), [UR-Series](https://universal-robots.com/products/ur-series/) | none |
| 9 | Max TCP speed 3-5 m/s | verified | [UR-e](https://universal-robots.com/products/e-series/), [UR-Series](https://universal-robots.com/products/ur-series/) | none |
| 10 | Full TCP speed not usable near people; risk assessment sets lower limits (was flagged) | verified | [Hartmann26](https://arxiv.org/abs/2602.17822) (secondary) | flag removed; cited |
| 11 | g-Series IP65; GoFa IP54 | verified | [UR10g](https://universal-robots.com/products/ur10g-1750/), [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | re-cited the series-wide IP65 to the product page (source 9) |
| 12 | MC250: cobot on a MiR250 for machine tending and restocking | verified | [MC250](https://mobile-industrial-robots.com/products/mir-go/enabled-robotics-MC250) | none |
| 13 | e-Series UR3e-UR16e: 3-16 kg, 500-1,300 mm, ±0.03-0.05 mm | verified | [UR-e](https://universal-robots.com/products/e-series/) | none |
| 14 | UR Series UR15/UR20/UR30: 8-30 kg, up to 1,750 mm, IP65 | verified | [UR-Series](https://universal-robots.com/products/ur-series/) | none |
| 15 | g-Series UR10g-1750, UR17g-1300, UR18g-950; Teradyne Robotics HQ; October 2026 | verified | [UR10g-DS](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/), [UR-FAQ](https://www.universal-robots.com/products/faq) | added that they succeed the UR8 Long, UR15, and UR18; sources 8-9 added |
| 16 | CRX-10iA: 10 kg, 1,249 mm, hand-guiding and tablet | verified | [FANUC22](https://www.productivity.com/wp-content/uploads/2022/04/fanuc-america-robot-product-line-brochure.pdf) | none |
| 17 | GoFa CRB 15000: 5 kg, 950 mm, 0.05 mm, IP54 | verified | [ABB23](https://hartfiel.com/wp-content/uploads/2023/05/ABB-Robotics-ProductRange_2023.pdf) | none |
| 18 | Application, not arm, is collaborative; each install needs a risk assessment (was flagged) | verified | [Hartmann26](https://arxiv.org/abs/2602.17822) (secondary) | flag removed; cited |
| 19 | Ambient 0-50 °C, reduced above 35 °C | verified | [UR10g-DS](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) | none |
| 20 | Base footprint 204 mm | verified | [UR10g-DS](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) | none |

### mobile-robot
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | 250-1,200 kg robots meet truck standards, use safety scanners, dock within mm | verified | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications), [MiR1200](https://mobile-industrial-robots.com/products/robots/mir1200-pallet-jack) | none |
| 2 | AGV follows fixed routes and stops; AMR maps and plans around obstacles (was flagged) | verified | [MiR-blog](https://mobile-industrial-robots.com/blog/agv-vs-amr-whats-the-difference) (maker explainer) | flag removed; "tape, wires, or reflectors" changed to the source's "wires or magnetic strips"; source 6 added |
| 3 | MiR250: 250 kg, 2 m/s, 800 x 580 mm | verified | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications) | none |
| 4 | Two SICK nanoScan3 (360°), two 3D cameras | verified | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications) | none |
| 5 | Up to 13 h at full load | verified | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications) | none |
| 6 | Marker docking ±3 mm, ±0.5° | verified | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications) | none |
| 7 | ISO 3691-4, RIA R15.08-1, ISO 13849-1 | verified | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications) | none |
| 8 | IP21 | verified | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications) | none |
| 9 | MC250 marker calibration to about 1 mm at fixed spots | verified | [MC250](https://mobile-industrial-robots.com/products/mir-go/enabled-robotics-MC250) | none |
| 10 | Stretch: boxes up to 50 lb (about 23 kg) | verified | [Stretch](https://bostondynamics.com/products/stretch/) | none |
| 11 | MiR250 cold-room rating "not checked" | corrected | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications) | rated 5-40 °C ambient, so not rated for the 2-4 °C room; text now says so |
| 12 | MiR1200: 1,200 kg EU pallets, 1.5 m/s, AI detection incl. shrink-wrapped | verified | [MiR1200](https://mobile-industrial-robots.com/products/robots/mir1200-pallet-jack) | none |
| 13 | Stretch: "hundreds of cases an hour" | verified | [Stretch](https://bostondynamics.com/products/stretch/) | none (maker's claim, labeled as such) |
| 14 | MiR600: 600 kg | verified | [MiR](https://mobile-industrial-robots.com/) | none |
| 15 | 17.5 h empty | verified | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications) | none |
| 16 | 10 min charge gives 2 h 40 min at max payload | verified | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications) | none |
| 17 | Speed 1.5-2.0 m/s | verified | [MiR250](https://mobile-industrial-robots.com/products/robots/mir250/specifications), [MiR1200](https://mobile-industrial-robots.com/products/robots/mir1200-pallet-jack), [MiR](https://mobile-industrial-robots.com/) | none |

### humanoid
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Humanoids carry less than many arms; 2-4 h per battery | verified | [Atlas](https://bostondynamics.com/products/atlas/), [G1](https://www.unitree.com/g1), [H2](https://www.unitree.com/H2) | none |
| 2 | G1 23-43 DoF, H2 31, Atlas 56 | verified | [G1](https://www.unitree.com/g1), [H2](https://www.unitree.com/H2), [Atlas](https://bostondynamics.com/products/atlas/) | none |
| 3 | G1 about 2-3 kg per arm; H2 about 7 kg rated, 15 kg peak | verified | [G1](https://www.unitree.com/g1), [H2](https://www.unitree.com/H2) | none |
| 4 | Digit 5: 23 kg, preliminary | verified | [Digit5](https://www.agilityrobotics.com/solutions/digit-5) | none |
| 5 | Atlas 30 kg sustained, 50 kg instantaneous | verified | [Atlas](https://bostondynamics.com/products/atlas/) | none |
| 6 | Runtimes 2-4 h | verified | [G1](https://www.unitree.com/g1), [H2](https://www.unitree.com/H2), [Atlas](https://bostondynamics.com/products/atlas/) | none |
| 7 | Atlas swaps its own battery | verified | [Atlas](https://bostondynamics.com/products/atlas/) | none |
| 8 | Digit 5 run-to-charge ratio 10:1 | verified | [Digit5](https://www.agilityrobotics.com/solutions/digit-5) | none |
| 9 | No ISO 9283 repeatability or pick-cycle figure published | verified | [Atlas](https://bostondynamics.com/products/atlas/), [Digit5](https://www.agilityrobotics.com/solutions/digit-5), [G1](https://www.unitree.com/g1), [H2](https://www.unitree.com/H2) | none |
| 10 | Digit 5: first humanoid designed to be safe near people; some safety features in development | verified | [Digit5](https://www.agilityrobotics.com/solutions/digit-5) | none |
| 11 | Atlas IP67, -20 to 40 °C | verified | [Atlas](https://bostondynamics.com/products/atlas/) | none |
| 12 | Atlas field test at a Hyundai facility on sequencing | verified | [Atlas](https://bostondynamics.com/products/atlas/) | none |
| 13 | Sequencing "means delivering parts to the line in build order" | corrected | [BD-blog](https://bostondynamics.com/blog/getting-real-with-humanoids/) | now "re-sorting parts from supplier containers onto a dolly in the order the line needs them"; source 6 added |
| 14 | Agility customers GXO, Schaeffler, TMMC; 65,000 production hours | verified | [Agility](https://agilityrobotics.com/) | none |
| 15 | Atlas 1.9 m, 90 kg, 4 h | verified | [Atlas](https://bostondynamics.com/products/atlas/) | none |
| 16 | Digit 5 in development in 2026; 2.2 m reach | verified | [Digit5](https://www.agilityrobotics.com/solutions/digit-5) | none |
| 17 | G1: 1.32 m, about 35 kg, US$13,500 | verified | [G1](https://www.unitree.com/g1) | none |
| 18 | H2: 1.82 m, about 70 kg, US$29,900 | verified | [H2](https://www.unitree.com/H2) | none |
| 19 | Prices exclude tax and shipping | verified | [G1](https://www.unitree.com/g1), [H2](https://www.unitree.com/H2) | none |
| 20 | Figure and Apptronik Apollo "in development" (was flagged) | corrected | [Figure](https://www.figure.ai/), [Apptronik](https://apptronik.com/) | now names Figure 03 (household) and Apollo (manufacturing, logistics) and says neither home page gives availability or deployments; sources 7-8 added |
| 21 | Tesla Optimus "in development" (was flagged) | unverifiable | none loaded | removed; no primary source loaded for its 2026 status |
| 22 | Reach 2.2-2.3 m; height 1.32-1.9 m | verified | [Atlas](https://bostondynamics.com/products/atlas/), [Digit5](https://www.agilityrobotics.com/solutions/digit-5), [G1](https://www.unitree.com/g1) | none |
| 23 | Late 2026: field tests or early deployments; sustained payload 2-30 kg | verified | [Atlas](https://bostondynamics.com/products/atlas/), [Digit5](https://www.agilityrobotics.com/solutions/digit-5), [G1](https://www.unitree.com/g1), [H2](https://www.unitree.com/H2) | none |

## Area 1, Robot bodies: analogy and precision review

Scope: all 12 concepts in `knowledge/01-robot-bodies.md`. `node tools/build-content.mjs --check knowledge/01-robot-bodies.md` passes with 0 warnings and 0 errors (3 `[unverified]` flags remain, all labeled illustrative numbers).

### Analogies

| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| dof | kept | n/a. The Etch A Sketch knobs map well to independent coordinates. The breaks text already covers the two real traps: rotary joints mix their effects, and counting joints is not counting DoF (deltas). | Same Etch A Sketch. |
| payload | rewritten (Plain and breaks) | "Holding a bag at arm's length" maps to the robot stretching its own arm out. A reader would predict that a robot's allowed load drops whenever it reaches far. The limit that sheets actually chart is how far the load's balance point sits from the wrist flange (UR's payload-versus-offset curve). Reach-dependent limits exist only on some models, such as the LR Mate 200iD/14L. The old breaks text said only that the robot "gives no warning". It now says why: the robot plans each move from the load data set in its controller, not from what it feels (Epson and ABB both say this). | A bag of flour held in your fist versus hung from the end of a broom handle; the broom's own weight stands for the gripper. |
| reach | kept | n/a. Sitting in a swivel chair and sweeping your hand gives the right picture of base rotation, the outer reach, and the hollow near the body. The breaks text names the dexterous-workspace trap. | Same office chair. |
| repeatability | kept (Plain); breaks rewritten | The old breaks text said the player's miss "varies randomly". That contradicts the Plain, where the player always hits the same wrong spot. It also left the impression that one fixed offset would correct a robot. The new text says a robot's error is different at every spot in its workspace and shifts with load, speed, and temperature, so it needs a per-robot calibration model (ABB Absolute Accuracy), not one offset. | Same darts player. |
| speed-specs | kept | n/a. Car top speed versus a trip across town predicts correctly that short moves are dominated by speeding up and braking. The breaks text covers non-standard benchmarks and settling. | Same car across town. |
| six-axis | kept | n/a. The human arm (waist, shoulder, elbow, wrist) matches the joint layout. The breaks text covers 7 versus 6 joints, stiffness, and no improvisation. | Same human arm. |
| scara | kept | n/a. A forearm flat on a table predicts the key mechanism correctly: the joints swing horizontally, so the motors do not hold the arm up against gravity. The breaks text covers the tool that can never tilt. | Same forearm on a table. |
| delta | rewritten (Plain and breaks) | A puppet on strings predicts a floppy, pull-only plate held up by gravity, which would swing when moved fast and stay level only by hanging. That is the opposite of the real machine. A delta is rigid closed loops, fast because the motors are fixed in the frame, and level because of the parallel rod pairs. | Three people on a balcony swinging stiff sticks that all meet at one plate. The breaks text adds the paired parallel rods (like a desk lamp's arms) that keep it level, and the fourth motor for turning. |
| gantry | kept | n/a. A claw machine predicts the Cartesian motion, the box-shaped workspace, top-down-only access, and coverage that grows with rail length. The breaks text corrects the one wrong impression, that it is loose and imprecise. | Same claw machine. |
| cobot | kept | n/a. A power window that stops on contact matches power and force limiting, which caps speed and force so that contact is tolerable. The breaks text names the main trap: the tool or part, not the arm, can hurt someone. | Same car power window. |
| mobile-robot | kept (Plain); breaks extended | The vacuum analogy predicts that every factory mobile robot maps the room and steers around obstacles. AGVs do not: they follow a fixed route and stop until the path is clear. The breaks text now says so (MiR source [6]). | Same robot vacuum. |
| humanoid | kept (Plain); breaks rewritten | The old breaks text said a temp "picks up a new task in minutes", but it compared only payload and battery life. It never said that a humanoid cannot. The new text says each task's behavior has to be built or trained, and that failure recovery and odd cases are the hard part (Boston Dynamics blog [6]). | Same temp worker. |

### Other fixes

- payload (Precise): the "Offset" bullet mixed two different limits: the load's balance point relative to the flange, and the LR Mate's limit tied to arm extension. These are now separate. Offset now uses the UR10g-1750 chart read from the datasheet, which also explains what "10 kg extended" means: 10 kg only within about 50 mm of the flange, 8 kg out to about 200 mm, and about 6 kg at 800 mm. Payload at reach is a separate model-specific condition. Added the chart numbers to Key numbers and to the source [3] description.
- payload and reach (Connects to): "the allowed load often drops near full reach" became "on some models". The sources show a reach limit for one FANUC model. UR's chart is about offset, not about arm position.
- payload (cheese example): per-wedge time changed from 6 s to 5-6 s. Area 6 has the tray belt indexing for 1-2 s of every 18 s, so the time left is 16-17 s for three wedges. Linked [[conveyor]].
- speed-specs (Precise): "the controller's smoothing limits" was hand-waving. It now says how gently the controller ramps acceleration up and down to avoid shaking the arm.
- speed-specs (cheese example): rewritten. The old text gave 4.5 s per apple pick and said speed would limit the line only if it ran "several times faster" (flagged). That contradicted [[line-balancing]] in area 6, where the illustrative apple pick takes 3.2 s and the apple station is the bottleneck. It also ignored the 1-2 s index move. The text now says about 4 s per pick, of which the 0.3-0.6 s benchmark move is a small part. The rest is camera, tracking, vacuum, placing, and release. The fix for a slow apple station is less overhead or a second robot, not a faster delta. The flag was removed because the claim it marked is gone.
- scara (cheese example): 9-18 s per pack became about 8-17 s, for the same index-time reason.
- delta (cheese example): "a delta sits idle most of each 18-second cycle" contradicted area 6 (the apple station is busy about 14 of 18 s). It now says the delta's motion is a fraction of a second per pick and the rest is camera, vacuum, and waiting.
- delta (Real products): Omron's "up to 15 kg" applies only to the fixed, non-rotating P30 platform. With a rotating platform the limit is 6 kg (650H) or 3 kg (650HS), and the 0.30 s cycle is for the 650H. Both points were added, which also ties back to DoF (turning the gripper costs payload).
- gantry (cheese example): "stacked into airline carts" conflicted with the concept's own point that a gantry's tool only comes down from above, so it cannot slide plates sideways onto trolley shelves. It now says a gantry works if plates go into open-top racks, pulled-out trolley drawers, or cases, which matches area 6's outfeed ("racks or catering trolley drawers"). Sideways loading needs an arm.
- cobot (Precise): added that ISO 10218:2025 also describes hand guiding and speed and separation monitoring alongside PFL, both defined in plain words. Hartmann et al. [7] also note that SSM or fencing is often the better choice for faster applications. Without this, a reader would think PFL is the only way a robot can work near people. Updated the source [7] description.
- mobile-robot (breaks): added the AGV point (see table). "Its design is far more constrained" was dropped as filler.
- humanoid (breaks): see table. Updated the source [6] description to cover behavior authoring and edge cases.
- Examples: every "Elsewhere" example is a real, correctly described setting. Every cheese example now agrees with the 18 s takt, the 2-4 C room, washdown, the station order, and area 6's indexing tray belt.
- Misconceptions: all 12 checked. Each is a belief people actually hold, and each Reality is correct. No changes.

### Spot-checks of the fact check

| Claim | Source opened | Result |
|---|---|---|
| IRB 360-1/1130 0.30 s and IRB 360-3/1130 0.40 s at 0.1 kg on 25/305/25 (payload 13, verified) | [ABB IRB 360 datasheet 2022](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | Pass. The cycle-time table matches. The 90/400/90 figures (0.44-0.92 s) also match. |
| IRB 360 conveyor tracking 1.0 mm at 200 mm/s, 1.5 mm at 350-750, 5.0 mm at 800-1,400; ambient 0-45 C; mass 120/145 kg (repeatability 13 and 20, delta 10 and 20, verified) | [ABB IRB 360 datasheet 2022](https://library.e.abb.com/public/f03878770fef4c2c93757953373aed9b/IRB%20360_datasheet_20220829.pdf) | Pass, all figures. The datasheet also gives 2.0 mm on an indexing conveyor, which matches area 6. |
| MiR250: 250 kg, 2 m/s, 800 x 580 mm, 13 h / 17.5 h, 10 min charge gives 2 h 40 min, ±3 mm and ±0.5° docking, IP21, ISO 3691-4 / R15.08-1 / ISO 13849-1 (mobile 3-8, 15-16, verified) | [MiR250 specifications](https://mobile-industrial-robots.com/products/robots/mir250/specifications) | Pass, all figures. The 5-40 C range (a fact-checker correction) is also confirmed, with the upper limit allowed for 1 h only. |
| Atlas: 56 DoF, 50 kg instant / 30 kg sustained, 2.3 m reach, 1.9 m, 90 kg, IP67, -20 to 40 C, 4 h, self battery swap, Hyundai field test (dof 12, payload 5, humanoid 11, 12, 15, verified) | [Boston Dynamics Atlas](https://bostondynamics.com/products/atlas/) | Pass, all figures. |
| Unitree G1: 1.32 m, about 35 kg, 23-43 DoF, about 2-3 kg per arm, US$13,500; H2: 1.82 m, about 70 kg, 31 DoF, about 7 kg rated / 15 kg peak, US$29,900; tax and shipping excluded (humanoid 2, 3, 17-19, verified) | [Unitree G1](https://www.unitree.com/g1), [Unitree H2](https://www.unitree.com/H2) | Pass. Detail: about 2 kg per arm on the G1 and about 3 kg on the G1 EDU. Runtime is about 2 h (G1) and about 3 h (H2), so the 2-4 h range holds with Atlas. |
| Digit 5: 23 kg and 2.2 m preliminary, 10:1 run-to-charge, in development, some safety features still in development (humanoid 4, 8, 10, 16, verified) | [Agility Digit 5](https://www.agilityrobotics.com/solutions/digit-5) | Pass. All three figures are marked preliminary estimates from pre-production hardware. "First cooperatively safe humanoid" is Agility's own claim. |
| Digit has 65,000 production hours; customers GXO, Schaeffler, Toyota Motor Manufacturing Canada (humanoid 14, verified) | [Agility home page](https://agilityrobotics.com/) | Pass. |
| UR10g-1750: 10 kg max, 23 safety functions (EN ISO 13849-1 and 10218-1), ±150 N / ±10 Nm, 5 m/s, 0-50 C with reduced performance from 35 C, IP65, 204 mm base, Teradyne Robotics HQ, October 2026 (cobot 3, 4, 19, 20; speed 2; reach 4, verified) | [UR10g-1750 datasheet](https://www.universal-robots.com/manuals/latest/en/datasheets/ur10g-1750/) | Pass, all figures. The datasheet's payload chart was used for the new offset numbers in the payload concept. |
| g-Series models succeed the UR8 Long, UR15, and UR18; IP65 (cobot 11, 15, verified) | [UR FAQ](https://www.universal-robots.com/products/faq), [UR10g-1750 product page](https://universal-robots.com/products/ur10g-1750/) | Pass. The product page also confirms "8 kg" standard and "10 kg" extended, with no footnote explaining "extended" (the datasheet chart does). |
| FANUC M-2000iA/2300: 2,300 kg, 3,734 mm, ±0.18 mm, 11,000 kg, floor mount (six-axis 15, payload 16, verified) | [FANUC M-2000iA/2300](https://www.fanucamerica.com/products/robot/m-2000ia-2300) | Pass. |
| Güdel FP: smallest size 300/500/800 N; up to 31,250 N; 75-225 m/min and 2-10 m/s² in high-dynamic; ±0.02 mm, ±0.1 mm on FP-5-HP (payload 10, gantry 4-6, verified) | [Güdel FP](https://www.gudel.com/products/linearaxis/fp) | Pass. The smallest listed size is FP-3 (300/500/800 N) and the largest is FP-7 (31,250 N high-load). High-dynamic speeds run from 75 m/min (FP-7 z) to 225 m/min (FP-5-HP y). |
| Adept Quattro s650: 2 kg, 0.26 s Adept cycle at 0.1 kg, 650 mm radius, 883 x 883 mm frame (delta 16, 19; speed 4, verified) | [Adept Quattro s650 user's guide p. 91](https://www.manualsdir.com/manuals/753805/adept-s650h-quattro.html?page=91) | Pass. The page also says the Adept cycle is "not achievable over all paths". |
| ABB agreed to sell Robotics to SoftBank in Oct 2025; as of Nov 2026 not closed; China prohibited the acquisition of the China business (six-axis 14, corrected; re-checked) | [ABB release, Nov 5 2026](https://resources.news.e.abb.com/attachments/published/140154/en-US/0A15DBC92198/20261105_Update_on_divestment_of_ABB_Robotics_EN.pdf) | Pass. China's foreign investment security review office prohibited the acquisition of ABB Robotics' China business. The deal is still subject to approvals. |
| ISO 10218:2025 drops "collaborative robot" for "collaborative application"; ISO/TS 15066 limits for 29 body regions now in ISO 10218-2:2025 Annex M (cobot 1, 2, corrected; re-checked) | [Hartmann et al., arXiv 2602.17822](https://arxiv.org/abs/2602.17822) (full PDF; secondary) | Pass. The paper says the 2025 edition "deprecates" "collaborative robot" and "collaborative operation", and that TS 15066 Annex A (29 body regions) became Annex M, which is informative. Secondary source: ISO's own pages could not be opened. |
| Omron Quattro 650H/HS up to 15 kg, 0.30 s Adept cycle at 0.1 kg (delta 17, corrected; re-checked) | [Omron Quattro 650H/HS datasheet](https://assets.omron.com/m/7010d1b816f4776f/original/Quattro-650H-650HS-Datasheet.pdf) | Pass with a nuance. The 15 kg (H) and 12 kg (HS) figures apply only to the non-rotating P30 platform. With rotating platforms the limits are 6 kg and 3 kg. The 0.30 s figure is the 650H (the HS is 0.39 s). The text now says this. |
| ABB: wrong load data overloads motors, gearboxes, and structure; no warning when arm load is exceeded; no warranty (payload 11, corrected; re-checked) | [ABB IRB 1200 product specification p. 24](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=24) | Pass, all three statements. This page does not say whether the load diagram depends on arm position, so it is not cited for that. |

## Area 2, Inside a joint: fact check
Summary line: 190 claims checked: 145 verified, 34 corrected, 11 unverifiable (5 kept flagged, 6 removed).

Notes:
- Of the 12 `[unverified]` flags the file had before this pass, 10 are now resolved with a primary source; 2 remain (brake release sequencing, UR forum claim). Three new flags were added where a claim is plausible but no opened source states it (2 on drive location in the controller cabinet, 1 on the thermal basis of motor torque ratings). The file now has 5 flags.
- All Wikipedia sources were removed: the pneumatic and hydraulic concepts now cite NFPA, U.S. DOE, SMC, Schmalz, BEKO, Oregon DMV, Moog, Parker, Boston Dynamics, Hyundai, and Caterpillar.
- The remaining secondary sources are kept and marked "secondary" below: the usa-automation.net trade article on Kollmorgen TBM2G (kollmorgen.com returns 403 to bots), IEEE Spectrum on Unimate (the Robot Hall of Fame site failed TLS verification), and the UR forum reply. The Franka datasheet and Parker safety guide are manufacturer documents hosted by distributors.
- Status as of November 2026: KUKA LBR iiwa (7 and 14 kg) is still sold; Franka Research 3 is sold by Franka Robotics GmbH; UR still offers the e-Series alongside the g-Series and UR Series; Yaskawa lists both Sigma-7 and Sigma-X; Boston Dynamics' July 2026 Hyundai statement (SoftBank put option on its stake) leaves the Atlas plans unchanged. None of these needed a status correction beyond the Yaskawa line.
- The shared WebSearch quota ran out late in the pass. After that I checked sources by fetching them directly.

### joint-stack
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Brake "present on nearly every gravity-loaded axis" | corrected | [Beckhoff AM8100 holding brake](https://infosys.beckhoff.com/content/1033/am8100/1333496971.html) | The quantifier has no source; reworded to "needed on any axis gravity could turn" with a link to [[brake]] |
| 2 | Motor-side encoder "always present" | corrected | [imperix TN111](https://imperix.com/doc/TN111), [Beckhoff AM8063](https://www.beckhoff.com/en-en/products/motion/rotary-servomotors/am8000-servomotors/am8063-wkyz.html) | The rotor angle can come from a sensorless estimator, and Beckhoff sells a sensorless option; "always present" replaced with "the drive needs it to switch the windings" |
| 3 | Gearbox input is a wave generator, sun gear, or crank | verified | [Harmonic Drive technology](https://www.harmonicdrive.net/technology/harmonicdrive) | none |
| 4 | Gearbox "present in almost all arm joints" | unverifiable | none found | removed |
| 5 | FR3 has a link-side torque sensor in all 7 axes | verified | [FR3 datasheet v1.1](https://www.wiredworkers.io/wp-content/uploads/2022/09/Franka-Research-3_Datasheet_v1.1_August2022.pdf) (manufacturer doc, reseller copy) | none |
| 6 | Output-side encoder only in some robots | verified | [HD FHA-Mini dual encoder](https://www.harmonicdrive.net/products/rotary-actuators/solid-shaft-actuators/fha-mini-dual-absolute) | flag removed; example and source [6] added |
| 7 | Servo drive sits in the controller cabinet in traditional arms | unverifiable | none found (KUKA KR C5 page does not say) | flagged |
| 8 | Some cobot designs put the drive inside the joint | verified | [Synapticon SOMANET Circulo](https://www.synapticon.com/en/products/somanet-circulo) | flag removed; source [7] added |
| 9 | Cables pass through a hollow center bore | verified | [usa-automation.net TBM2G](https://usa-automation.net/news/62315-new-frameless-servo-motors-increase-performance-and-reduce-size-for-robot-control) (secondary) | none |
| 10 | mayr brake mounts on hollow shaft, free shaft end, or inside a hollow-shaft motor | verified | [mayr ROBA-servostop Cobot](https://www.mayr.com/en/products/safety-brakes/industrial-brakes/roba-servostop-cobot~40645) | none |
| 11 | Robots without a torque sensor estimate torque from motor current | verified | [TE whitepaper](https://www.te.com/usa-en/whitepapers/sensors/improving-safety-performance-in-cobots-with-torque-sensors.html) | none |
| 12 | The iiwa "skips the output encoder" and derives joint position | corrected | [Chawda and Niemeyer](https://la.disneyresearch.com/wp-content/uploads/Toward-Torque-Control-of-a-KUKA-LBR-IIWA-for-Physical-Human-Robot-Interaction-Paper.pdf) | The paper says the iiwa senses motor position and joint torque, and that the researchers computed link position from them. It does not say the iiwa has no output encoder; reworded |
| 13 | iiwa joint: motor, harmonic gear, series elastic element | verified | same paper | none |
| 14 | The wobble is "caused by the gearing" | corrected | same paper | The authors say the mechanical cause is unclear but consistent with the gearing; changed to "traced to the gearing" |
| 15 | 3 wedges x 200 plates = 600 rotations per hour | verified | arithmetic | none |
| 16 | The motor turns dozens to hundreds of times per joint turn | verified | [HD CSG-20-50](https://www.harmonicdrive.net/products/servo-mount-gearheads/harmonic-drive/csg-gh/20/csg-20-50-gh), [Nabtesco RV-N](https://www.nabtesco.de/en/products/series/rv-n) | none |
| 17 | TBM2G is made for cobot joints and has a large center bore | verified | usa-automation.net (secondary) | none |
| 18 | mayr ROBA-servostop Cobot is a hollow-shaft brake for lightweight robots | verified | mayr page | none |
| 19 | AksIM-2 is an off-axis ring encoder | verified | [RLS AksIM-2](https://www.rls.si/eng/aksim-2) | none |
| 20 | Franka Robotics, formerly Franka Emika, makes FR3 | verified | [franka.de FR3](https://franka.de/products/franka-research-3) | none (Franka Robotics GmbH, Nov 2026) |
| 21 | HD CSG/CSF strain wave units exist | verified | [HD CSF/CSG catalog](https://www.harmonicdrive.net/_hd/content/documents/csf-csg.pdf) | none |
| 22 | Source 2 supports the sensor claim | verified | FR3 datasheet | none |

### servo-motor
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | PMSM is also sold as brushless AC or DC | verified | [maxon motor data](https://support.maxongroup.com/hc/de/article_attachments/4413473498130) | none |
| 2 | The drive needs the rotor angle from an encoder or an estimate | verified | [imperix TN111](https://imperix.com/doc/TN111) | none |
| 3 | Torque is proportional to current | verified | maxon | none |
| 4 | Back-EMF constant equals Kt in other units | verified | maxon ("identical to the torque constant") | none |
| 5 | A 48 V winding needs more current than a 400 V one for the same torque | verified | derived from maxon Kt/back-EMF | none |
| 6 | Standstill and rated torque values on the datasheets | verified | [AM8063](https://www.beckhoff.com/en-en/products/motion/rotary-servomotors/am8000-servomotors/am8063-wkyz.html), [AM8032](https://www.beckhoff.com/da-dk/products/motion/rotary-servomotors/am8000-servomotors/am8032-wdyz.html) | Wording tightened; "at rated current" dropped (the page lists no rated current) |
| 7 | Continuous ratings are heat limits; size motors by average heating | unverifiable | Beckhoff pages list values, not definitions | flagged |
| 8 | Peak torque is 3.8-4.9 times standstill | verified | AM8063 111/29.0 = 3.83, AM8032 11.66/2.38 = 4.90 | Added "depending on frame size" |
| 9 | Frameless means rotor and stator only, with no housing, bearings, or shaft | verified | [TQ-RoboDrive robotics](https://www.tq-group.com/en/products/tq-robodrive/applications-industries/robotics/) | flag removed; source [6] added |
| 10 | TBM2G targets 3-15 kg cobots | verified | usa-automation.net (secondary) | none |
| 11 | TBM2G runs at 48 VDC or below | verified | usa-automation.net (secondary) | none |
| 12 | TBM2G "sized to match strain wave gears" | corrected | usa-automation.net (secondary) | Source says "designed to fit off-the-shelf harmonic gearing"; reworded |
| 13 | Smallest TBM2G: 0.27 Nm at 8,000 rpm | verified | usa-automation.net (secondary) | none |
| 14 | 800 picks per hour is one every 4.5 s | verified | arithmetic | none |
| 15 | AM8063: 29 Nm standstill, 111 Nm peak, 1,500 rpm, 3.33 Nm/A | verified | AM8063 | none |
| 16 | 29 Nm x 100:1 is about 2,900 Nm | verified | arithmetic | none |
| 17 | AM8000: 400 V class, permanent-magnet brake option, one-cable feedback | verified | AM8063 (100-480 V AC, OCT) | none |
| 18 | TBM2G is a 48 V class cobot motor | verified | usa-automation.net (secondary) | none |
| 19 | Yaskawa Sigma-7 is "still listed on Yaskawa Europe" (spec tables unreadable) | corrected | [Yaskawa Sigma-7](https://www.yaskawa.com/products/motion/sigma-7-servo-products) | Sigma-7 and Sigma-X are both current lines (Nov 2026); source [7] added |
| 20 | maxon EC motors and the motor-data document | verified | maxon | none |
| 21 | Standstill torque is a fifth to a quarter of peak | verified | 0.20-0.26 from AM8032/AM8063 | none |
| 22 | Rated speed 1,500-3,000 rpm; up to 8,000 rpm on small TBM2G | verified | Beckhoff; usa-automation.net (secondary) | none |
| 23 | Kt 1.40-3.33 Nm/A | verified | AM8032, AM8063 | none |
| 24 | TBM2G continuous torque 0.27-6.03 Nm | verified | usa-automation.net (secondary; endpoints only) | none |

### gearbox
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Rated torque is what the gear carries "for its rated life" | corrected | [HD CSF/CSG catalog](https://www.harmonicdrive.net/_hd/content/documents/csf-csg.pdf) | Changed to "allowable continuous load torque at 2,000 rpm input"; source [6] added (the product page [1] gives no definitions) |
| 2 | Repeated peak applies to accel/decel; momentary peak to collisions and e-stops | verified | HD catalog | citation moved [1] to [6] |
| 3 | Definitions of backlash, lost motion, hysteresis loss | verified | [Nabtesco backlash FAQ](https://www.nabtesco.de/en/faq/backlash) | none |
| 4 | Stiffness is quoted in Nm/rad and Nm/arcmin | verified | HD CSG-20-50, Nabtesco RV-N | none |
| 5 | Strain wave stiffness rises with load (2-3 regions) | verified | [HD CSG-20-50](https://www.harmonicdrive.net/products/servo-mount-gearheads/harmonic-drive/csg-gh/20/csg-20-50-gh) K1<K2<K3 | none |
| 6 | Wave generator, flexspline, circular spline; two-tooth difference | verified | [HD technology](https://www.harmonicdrive.net/technology/harmonicdrive) | none |
| 7 | Ratio = flexspline teeth / 2 (200 teeth gives 100:1) | verified | derived from HD technology | none |
| 8 | "Zero backlash" because teeth stay engaged on the major axis | verified | HD technology | none |
| 9 | RV ratios about 41-317 | verified | [Nabtesco RV-N](https://www.nabtesco.de/en/products/series/rv-n) (41-316.71) | none |
| 10 | Cycloidal backlash 0.1-0.3, lost motion 0.3-0.6 arcmin | verified | Nabtesco FAQ | none |
| 11 | Rigidity comes from "many teeth sharing the load" | corrected | Nabtesco FAQ | Page says "virtually full contact and even distribution of forces" plus a robust main bearing; reworded |
| 12 | RV is the usual choice for base and shoulder axes | unverifiable | none found | Removed; replaced with Nabtesco's own estimate of about 60% share for medium and large robot joints ([Nabtesco](https://www.nabtesco.com/en/products/robot/)); flag removed |
| 13 | One planetary stage reaches about 10:1 | verified | HD technology | none |
| 14 | Planetary backlash: precision 1-4, economy 8-12 arcmin | corrected | [WITTENSTEIN](https://www.wittenstein-group.com/en-uk/products/servo-gearboxes) | Economy is up to 5-12 (NTP ≤5, NP ≤8, CP ≤12); now matches Key numbers |
| 15 | 1 arcmin is 0.29 mm at 1 m | verified | arithmetic | none |
| 16 | 8 arcmin is "typical of an economy planetary" | corrected | WITTENSTEIN | Changed to "rated limit of several economy lines"; 0.09 mm and 0.7 mm arithmetic checked |
| 17 | RV-N 245-28,000 Nm, 61-15,600 Nm/arcmin; six-axis, SCARA, delta robots | verified | Nabtesco RV-N | none |
| 18 | CSG-20-50 is 50:1 | verified | HD CSG-20-50 | none |
| 19 | RV-N is used on robot axes | verified | Nabtesco RV-N | none |
| 20 | WITTENSTEIN alpha SP+, TP+, NP | verified | WITTENSTEIN | none |
| 21 | CSG-20 at 1.3e4 Nm/rad: 7 Nm gives 0.54 mrad, about 2 arcmin | verified | HD CSG-20-50 (T1 = 7 Nm; 1.85 arcmin) | none |
| 22 | Stiffness 1.3-2.3e4 Nm/rad | verified | HD CSG-20-50 | none |
| 23 | 33 / 73 / 127 Nm torque ratings | verified | HD CSG-20-50 (33 Nm is the L10 rating) | none |
| 24 | Hysteresis loss 0.2-1 arcmin | verified | Nabtesco FAQ | none |

### encoder
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | A good encoder gives about a million steps per turn | verified | [RLS AksIM-2](https://www.rls.si/eng/aksim-2) (20 bit) | none |
| 2 | AksIM-2 is an off-axis magnetic encoder | verified | RLS AksIM-2 | none |
| 3 | 20 bits = 1,048,576 steps of 1.24 arcsec | verified | arithmetic | none |
| 4 | Beckhoff offers 18-, 19-, and 24-bit options | verified | [AM8063](https://www.beckhoff.com/en-en/products/motion/rotary-servomotors/am8000-servomotors/am8063-wkyz.html) | none |
| 5 | AksIM-2 reaches 20 bits | verified | RLS AksIM-2 | none |
| 6 | Serial links: BiSS C, SSI, EnDat | verified | RLS (BiSS C, SSI); Beckhoff (EnDat 3) | none |
| 7 | Incremental encoders need homing after power-up | verified | [RLS incremental vs absolute](https://www.rls.si/eng/encoder-handbook/incremental-vs-absolute) | source [8] added |
| 8 | Absolute encoders give position at start-up without motion | verified | [Renishaw RESOLUTE](https://www.renishaw.com/en/resolute-rotary-angle-absolute-encoder-options--10939) | none |
| 9 | Single-turn codes repeat every revolution | verified | [RLS singleturn vs multiturn](https://www.rls.si/eng/encoder-handbook/singleturn-vs-multiturn) | none |
| 10 | Multi-turn methods: battery, gears, Wiegand | verified | RLS handbook, [Novanta](https://novanta.com/robotics-automation/multiturn-encoder/), [POSITAL](https://www.posital.com/en/singleturn-and-multiturn-measurement-principles) | none |
| 11 | Wiegand is "a special wire that releases a pulse as a magnet passes" | corrected | POSITAL | Source describes short, strong voltage pulses harvested from rotation, even at low speed, and does not describe the wire; reworded |
| 12 | A battery-backed counter cannot count while unpowered and relies on the brake | corrected | Novanta | Wrong. A battery-backed counter keeps counting from its battery. The non-volatile-storage type is the one that needs a power-off brake. Rewrote the sentence and the [[brake]] connection |
| 13 | A motor-side encoder before 100:1 must be multi-turn | verified | logic (100 motor turns per joint turn) | none |
| 14 | Some joints add an output-side encoder | verified | [HD FHA-Mini dual encoder](https://www.harmonicdrive.net/products/rotary-actuators/solid-shaft-actuators/fha-mini-dual-absolute) | flag removed; source [9] added |
| 15 | 20 bit x 100:1 gives about 105 M counts; 18 nm at 300 mm | verified | arithmetic | none |
| 16 | iiwa "joint-side position step" of about 6e-8 rad | corrected | [Chawda and Niemeyer](https://la.disneyresearch.com/wp-content/uploads/Toward-Torque-Control-of-a-KUKA-LBR-IIWA-for-Physical-Human-Robot-Interaction-Paper.pdf) | It is the motor encoder's quantization (5.989e-8 rad) expressed on the joint side; reworded |
| 17 | Wobble period "about 0.02 rad" | corrected | same paper | Made precise: 0.01963 rad |
| 18 | AksIM-2 interfaces: BiSS C, SSI, asynchronous serial | verified | RLS AksIM-2 | none |
| 19 | RESOLUTE: absolute optical, many drive protocols | verified | Renishaw | none |
| 20 | Beckhoff feedback runs over the power cable (OCT) | verified | AM8063 | none |
| 21 | POSITAL Wiegand counter needs no battery or gears | verified | POSITAL | none |
| 22 | AksIM-2 accuracy 14-72 arcsec after self-calibration | verified | RLS AksIM-2 | none |
| 23 | Accuracy range varies "depending on ring size" | corrected | RLS AksIM-2 | The page does not map accuracy to ring size; changed to "across the ring sizes offered" |
| 24 | Battery life up to several years | verified | Novanta | none |
| 25 | Connects to [[brake]]: holds the shaft for a battery-backed counter | corrected | Novanta | Changed to encoders that only save their count at power-down |

### brake
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Brake sits on the motor shaft, B bearing side | verified | [Beckhoff AM8100 brake](https://infosys.beckhoff.com/content/1033/am8100/1333496971.html) | none |
| 2 | 2 Nm behind 100:1 holds about 200 Nm | verified | arithmetic | none |
| 3 | The brake is fail-safe | verified | [mayr](https://www.mayr.com/en/products/safety-brakes/industrial-brakes/roba-servostop-cobot~40645), Beckhoff | none |
| 4 | mayr: spring-applied, 0.23-9 Nm, 24 V release, 8 V hold | verified | mayr | none |
| 5 | Permanent-magnet brake: magnets clamp, coil cancels | verified | [Kendrion High Torque Line](https://www.kendrion.com/en/products/industrial-brakes/permanent-magnet-brakes/high-torque-line) | added [4] citation |
| 6 | Beckhoff brake: 24 VDC, more than 10 M cycles | verified | Beckhoff AM8100 | none |
| 7 | At most 2,000 e-stops from 3,000 rpm, inertia up to 3x | verified | Beckhoff AM8100 | none |
| 8 | Not approved alone for personnel protection | verified | Beckhoff AM8100 | none |
| 9 | mayr is suitable for e-stop braking | verified | mayr | none |
| 10 | Vertical axes need redundant brakes, supports, or counterweights | verified | Beckhoff AM8100 | none |
| 11 | Drive builds torque before releasing the brake | unverifiable | none found (Aerotech and Beckhoff pages do not state it) | kept flagged with a reason |
| 12 | Brake checks by torque wrench or scope software | verified | Beckhoff AM8100 (TwinCAT Scope) | none |
| 13 | Beckhoff brake adds 40 mm on an AM8032 | verified | [AM8032](https://www.beckhoff.com/da-dk/products/motion/rotary-servomotors/am8000-servomotors/am8032-wdyz.html) (154 to 194 mm) | none |
| 14 | Kendrion: 0.1-280 Nm, robotics and medical, up to 2,000 e-stops | verified | Kendrion | none |
| 15 | "In a normal e-stop the brake mostly holds what has already stopped" | corrected | Beckhoff AM8100; [SEW STO](https://download.sew-eurodrive.com/download/html/31550207/en-EN/13178472843.html) | When power is cut, the brake does the stopping (that is what the 2,000-stop budget counts). Only a controlled stop leaves the brake just holding; rewrote |
| 16 | Key numbers (0.23-9 Nm, 24/8 V, 2,000, 10 M) | verified | mayr, Beckhoff | none |

### servo-drive
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | AX8000 mains 100-480 V AC | verified | [AX8108](https://www.beckhoff.com/ar-eg/products/motion/servo-drives/ax8000-multi-axis-servo-system/ax8108-0220-0000.html) | none |
| 2 | DC bus up to 848 V | verified | AX8108 | none |
| 3 | Six transistors and PWM | verified | [imperix TN111](https://imperix.com/doc/TN111) (three phase legs), [Aerotech STO](https://help.aerotech.com/automation1/hardware-manuals/Automation1-iHXA4-and-HXA4-web/Chapter-2-Installation-and-Configuration/Safe-Torque-Off-Input-STO.htm) (high and low side) | none |
| 4 | Cobot joints run at 48 VDC | verified | usa-automation.net (secondary) | none |
| 5 | Regenerated energy goes to a braking resistor | verified | imperix TN111 (braking chopper leg) | flag removed |
| 6 | The position loop "often runs in the robot controller" | corrected | [Beckhoff AX8000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax8000-multi-axis-servo-system/) | Not supported; replaced with "the controller streams setpoints, as often as every 62.5 µs over EtherCAT"; flag removed |
| 7 | 62.5 µs current loop at 8 kHz; 1 µs hardware reaction | verified | Beckhoff AX8000 | none |
| 8 | imperix runs at 20 kHz (50 µs) | verified | imperix | none |
| 9 | FOC; id target usually zero | verified | imperix | none |
| 10 | STO is defined in IEC 61800-5-2 | verified | SEW (IEC 61800-5-2:2016) | none |
| 11 | Two identical 24 V channels; removing either one is safe | verified | Aerotech | none |
| 12 | STO coasts the motor, category 0, does not brake | verified | SEW | none |
| 13 | SS1 is decelerate, then STO | verified | Beckhoff (lists SS1), Aerotech (controlled stop in the 450-550 ms before STO) | Added Aerotech example; no opened page defines SS1 verbatim |
| 14 | STO does not prevent automatic restart | verified | SEW | none |
| 15 | 0.5 s at 50-62.5 µs is 8,000-10,000 cycles | verified | arithmetic | none |
| 16 | A large arm's drives sit in the controller cabinet | unverifiable | none found | flagged |
| 17 | 848 V, 8 A continuous, 20 A peak | verified | AX8108 | Added 100-480 V AC and "single-axis" |
| 18 | Key numbers: "per channel on a two-axis module" | corrected | AX8108 | It is a single-axis module |
| 19 | AX8000 has STO, SS1, SS2, SOS | verified | AX8108, AX8000 | none |
| 20 | SEW inverters have STO to IEC 61800-5-2 | verified | SEW MOVITRAC LTP-B manual (ed. 10/23) | none |
| 21 | Aerotech iHXA4/HXA4 two-channel STO | verified | Aerotech (page notes STO certification pending) | none |
| 22 | imperix B-Box used in the FOC reference design | verified | imperix (notes that a newer drive bundle has replaced this setup) | none |
| 23 | Code sketch: Clarke, Park, inverse Park, Vbus/√3 limit | verified | standard FOC math (imperix gives no formulas) | none |
| 24 | Current switched more than 10,000 times a second | verified | 62.5 µs is 16 kHz; 50 µs is 20 kHz | none |

### torque-sensing
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Flexure, strain gauges, Wheatstone bridge | verified | [TE whitepaper](https://www.te.com/usa-en/whitepapers/sensors/improving-safety-performance-in-cobots-with-torque-sensors.html) | none |
| 2 | Safety-rated versions use two electrically separate channels | verified | TE (Cat 4 PL e promo; the body text says Cat 3 PL d) | none |
| 3 | iiwa and FR3 have sensors in all 7 joints | verified | [KUKA LBR iiwa](https://www.kuka.com/en-ch/products/robotics-systems/industrial-robots/lbr-iiwa), [franka.de](https://franka.de/products/franka-research-3) | none |
| 4 | iiwa series elastic stiffness 18,500 Nm/rad "on one joint" | corrected | [Chawda and Niemeyer](https://la.disneyresearch.com/wp-content/uploads/Toward-Torque-Control-of-a-KUKA-LBR-IIWA-for-Physical-Human-Robot-Interaction-Paper.pdf) | Changed to "identified on the base joint" |
| 5 | TE calls current estimation calculation-heavy | verified | TE | none |
| 6 | UR forum: safety uses joint currents; flange sensor not safety rated | unverifiable | [UR forum](https://forum.universal-robots.com/t/force-sensor-in-ur5-eseries/4083) (secondary) | Kept flagged; added [UR5e datasheet](https://www.universal-robots.com/media/1807465/ur5e_e-series_datasheets_web.pdf) (flange sensing) and [UR functional safety](https://s3-eu-west-1.amazonaws.com/ur-support-site/50998/UR%20e-Series%20Functional%20Safety%202022%200819.pdf) (force limit by capping joint torque) |
| 7 | Enables collision detection and hand guiding | verified | TE, KUKA | none |
| 8 | Franka streams link-side torque and takes torque commands at 1 kHz | verified | franka.de | none |
| 9 | iiwa gear ripple appears as false external torque | verified | Chawda and Niemeyer (Fig. 2) | none |
| 10 | Lead-through teaching | verified | TE | none |
| 11 | iiwa comes in 7 and 14 kg versions in 2026 | verified | KUKA | none |
| 12 | TE dual-channel cobot torque sensor | verified | TE | none |
| 13 | UR e-Series: flange sensor "rather than in every joint" | corrected | UR5e datasheet, [UR products](https://www.universal-robots.com/products/) | Replaced the forum citation with the datasheet (±50 N, ±10 Nm); added that the e-Series is still offered; flag removed |
| 14 | Key numbers: 18,500 Nm/rad, 1 kHz, 7 of 7 | verified | Chawda and Niemeyer, franka.de, KUKA | none |
| 15 | Misconception cites [5] for current estimation | corrected | TE | Citation changed to [1] only |

### pneumatic-actuation
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Supply about 550-690 kPa (80-100 psi) | verified | [U.S. DOE compressed air sourcebook](https://www.energy.gov/sites/prod/files/2016/03/f30/Improving%20Compressed%20Air%20Sourcebook%20version%203.pdf) | Wikipedia (which cited a vendor blog) replaced; range now says what it spans |
| 2 | System: compressor, dryers, filters, valves | verified | [NFPA](https://www.nfpa.com/what-is-fluid-power-0) | none |
| 3 | Single-acting (spring return) and double-acting cylinders | verified | [SMC round cylinders](https://www.smcworld.com/webcatalog/en-jp/categoryID/458?ca_id=458) | Wikipedia replaced |
| 4 | Vacuum generators use a jet of compressed air | verified | [Schmalz ejectors](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/vacuum-generators/vacuum-ejectors) | source added |
| 5 | 20 mm bore at 600 kPa is about 190 N | verified | calculated (188.5 N) | labeled "calculated" |
| 6 | Return stroke force is lower because of the rod | verified | geometry | none |
| 7 | Simple to control | verified | NFPA | none |
| 8 | Tolerates shocks | verified | NFPA ("cushioning or give") | merged into the compressibility sentence |
| 9 | Stalls "without overheating" | corrected | NFPA | Source says only that it "simply stalls"; reworded |
| 10 | Stored air finishes the cycle "after a power loss" | corrected | DOE | DOE says receivers supply air while the compressor is stopped; reworded |
| 11 | Runs end to end against hard stops with cushioning | verified | SMC (rubber bumper, air cushion) | none |
| 12 | Air must be dried for the cold room | verified | [BEKO FS 11](https://www.beko-technologies.com/fileadmin/beko-technologies.com/EN/factsheets/fs-11-humidity-and-water-en.pdf) | Flag removed; added "pressure dew point at least 10 C below the coldest point" |
| 13 | 190 N is hundreds of times a 25 g tray's weight | verified | arithmetic (about 775x) | none |
| 14 | Air brakes on trucks, buses, and trains | corrected | [Oregon CDL manual](https://www.oregon.gov/odot/DMV/Pages/Online_CDL_Manual_2/Section_5.aspx) | Changed to trucks, buses, trailers; trains dropped (not in the source) |
| 15 | The tank reserve keeps brakes working after the compressor stops | verified | Oregon CDL manual | none |
| 16 | Bore sizes 2.5-400 mm, some up to 1,000 mm | corrected | SMC | Wikipedia gave no source for this; changed to 2.5-100 mm across SMC round-body series |
| 17 | Air acts like a spring | verified | NFPA | none |
| 18 | Festo and SMC make pneumatic components | verified | SMC catalog loaded; festo.com blocks bots (403), but its cylinder catalog pages appear in search | none |

### hydraulic-actuation
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Detailed component list (pump types, valve types, accumulators, filters) | corrected | [NFPA](https://www.nfpa.com/what-is-fluid-power-0), [Parker 4400-B.1](https://www.jamiesonequipment.com/wp-content/uploads/Parker-Hose-Tubing-and-Fitting-Use-Safety-Guide-JEC.pdf) (manufacturer doc, distributor copy) | Trimmed to the parts NFPA lists, plus hoses |
| 2 | Servo and proportional valves follow an electric signal | verified | [Moog](https://www.moog.com/products/servovalves-servo-proportional-valves.html) | flag removed |
| 3 | Pressures 6.9-34.5 MPa | corrected | NFPA; [Cat 320](https://h-cpc.cat.com/cmms/v2?cid=406&f=product&gid=329&it=product&lid=en&nc=1&pid=126532&sc=US); [IEEE Spectrum](https://spectrum.ieee.org/unimation-robot) (secondary) | Wikipedia (a vendor blog) replaced; now "thousands of psi", 6.9 MPa (Unimate) to 35 MPa (Cat 320) |
| 4 | 10-60 times factory air pressure | corrected | arithmetic | Changed to 10-50x |
| 5 | Pumps have 10x the power density of an electric motor | unverifiable | Wikipedia gives no source | Removed; replaced with NFPA's qualitative "much smaller space" |
| 6 | "Position locks when flow stops" | corrected | NFPA | Changed to NFPA's "rigid" |
| 7 | Hoses are replaced every 5-7 years | corrected | Parker 4400-B.1 | Parker: hoses have a finite life, and severity and risk set the replacement interval; no fixed years given |
| 8 | Burst-hose danger, heat, energy loss | verified | Parker (fluid injection, whipping hose, heat from pressure losses) | none |
| 9 | Atlas was hydraulic "through its 2021 version" | unverifiable | none | removed |
| 10 | Hydraulic Atlas retired April 16, 2024 | corrected | [Boston Dynamics, Apr 17 2024](https://bostondynamics.com/blog/electric-new-era-for-atlas/) | The primary source says only "this week"; changed to April 2024 |
| 11 | Electric Atlas announced the next day | verified | Boston Dynamics (published 2024-04-17) | dated explicitly |
| 12 | Production Atlas shown at CES 2026 | verified | [Boston Dynamics, Jan 5 2026](https://bostondynamics.com/blog/boston-dynamics-unveils-new-atlas-robot-to-revolutionize-industry/) | none |
| 13 | Deployment at a Hyundai plant in 2028 | verified | [Hyundai Motor Group, Jan 5 2026](https://www.hyundaimotorgroup.com/en/news/hyundai-motor-group-announces-ai-robotics-strategy--to-lead-human-centered-robotics-era-at-ces-2026) | Named the task (parts sequencing) and the plant (Metaplant America); the July 2026 HMG statement keeps the plan |
| 14 | Unimate was hydraulic, at GM in New Jersey, 1961 | verified | IEEE Spectrum (secondary; robothalloffame.org failed TLS) | none |
| 15 | Unimate is "called the first industrial robot" | corrected | IEEE Spectrum | Changed to "first successful use of an industrial robot" |
| 16 | Hydraulics remain standard where force density matters | verified | NFPA (off-highway is the most common use) | none |
| 17 | Scissor lifts commonly use hydraulic valves | unverifiable | Wikipedia image caption only | Removed the claim and its citation |
| 18 | Excavator boom, swing, and tracks are hydraulic | verified | Cat 320 (equipment, travel, swing pressures) | none |
| 19 | The excavator is "not electric" because of power density | corrected | NFPA | Reframed: its joints are hydraulic because fluid power fits large force in a small space |
| 20 | Filtration down to 7-15 microns | unverifiable | Wikipedia gives no source | removed |
| 21 | Atlas retired April 2024; Unimate historical | verified | Boston Dynamics, IEEE Spectrum | citations renumbered |
| 22 | Caterpillar and Komatsu make excavators | verified | Cat 320 page (Komatsu not checked; common knowledge) | none |

## Area 2, Inside a joint: analogy and precision review

### Analogies
| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| joint-stack | rewritten | The bicycle cast the motor as "your legs", which are the slow side of a bike. In most bike gears the wheel turns faster than the pedals. A reader would expect a ratio near 1:1 to 4:1, or a joint that trades force for speed, when the joint actually reduces speed 50-160 times. The old break text did not mention ratio size. | The barrel of a cordless drill: a small fast motor at the back, gears in front that slow the spin and multiply the twist at the output, plus parts a drill lacks (angle sensor, parking brake, torque sensor). Break: a drill spins on and on with slop at the chuck, while a joint turns to an exact angle and holds it under load with almost no slop, which needs a drive correcting current thousands of times a second. |
| servo-motor | kept | — | — |
| gearbox | kept (break rewritten) | — | — |
| encoder | kept (break rewritten) | — | — |
| brake | kept | — | — |
| servo-drive | kept | — | — |
| torque-sensing | kept | — | — |
| pneumatic-actuation | kept | — | — |
| hydraulic-actuation | kept (wording fixed) | — | — |

Notes on kept analogies:
- servo-motor (ceiling fan that takes precise orders): it gets the core behaviors right: torque follows current, and the motor holds and reverses. The break names the two traps that matter, no angle sense and a peak that is thermally limited. One weakness: ceiling fans spin slowly, but the joint-stack and gearbox concepts set up the fast-motor idea.
- gearbox (lowest bicycle gear): the trade of speed for force is the right principle, and Plain states "dozens to hundreds". The old break covered shifting and slack but not the 10-100x gap in ratio, and not wind-up. Wind-up is what the misconception is about. The break now covers both.
- encoder (clock hands): the hands model fits absolute encoders, and geared multi-turn encoders really do have a second hand driven by gears. The old break spent a sentence on "the clock drives its hands", which nobody would predict wrongly. It left out incremental encoders, which read like a trip odometer and need homing. The break now leads with that and keeps the point about the turn counter while power is off.
- brake (fire-door magnets): the fail-safe mapping is exact (powered open, closes on power loss). The break correctly names the slip limit and the fact that the brake sits on the motor side of the gearbox.
- servo-drive (self-adjusting dimmer): the break covers regeneration and feedback.
- torque-sensing (feeling a push through your arm): the break names the key limit. The sensor feels only twist about its own axis, and a light touch can hide in model error.
- pneumatic-actuation (air-driven syringe): the break names compressibility and the need for a return stroke.
- hydraulic-actuation (jack): "car jack" makes most readers picture the scissor screw jack in the trunk, which is not hydraulic. Changed to "hydraulic floor jack" in Plain and the break.

### Other fixes
- joint-stack: defined windings, link, cobot, and center bore. Pointed the gear-input terms (wave generator, sun gear, crank) to [[gearbox]].
- servo-motor: Precise did not say what breaks without the thing. Added the open-loop stepper comparison: it slips a step under too much load and nothing notices. Source is Oriental Motor (new [8]).
- servo-motor (cheese plate): "near peak torque and then coasts" was wrong. Braking also needs near-peak torque, and a robot motor does not freewheel. Reworded to accelerate and brake, then low torque while cruising or waiting. Added the 18 s plate cycle. In the misconception, "coasting time" became "low-torque time".
- gearbox: defined arcminute and radian inside Precise. Added what breaks without a reducer: a far heavier motor at every joint, which loads the joints nearer the base.
- encoder: defined arcsecond and serial link. Added what breaks without an encoder. "Must be multi-turn to know the joint angle" became "...on its own", because dual-encoder joints can combine two single-turn readings.
- brake: defined service brake and load inertia.
- brake (cheese plate): "the vertical axis" is not a thing on a six-axis arm. Now every brake clamps, with the shoulder and elbow mattering most. "Dropping onto the wedge" made no sense, because the gripper is holding the wedge. Now the arm would fold down and crush the wedge and the tray.
- brake (Elsewhere): the old text said the brakes "clamp to hold the load" in an e-stop, then charged every e-stop against the 2,000-stop budget. That contradicts the misconception: a controlled stop does not use the budget. Now the cell is set up so that e-stop cuts power at once, which makes the budget logic consistent.
- servo-drive: Precise now opens with why a motor needs a drive at all, which was missing. Defined AC, DC bus, three-phase, nested loops, setpoints, and EtherCAT.
- servo-drive: the Aerotech STO delay is fixed. The ramp-down during it happens only if configured, and the source says that ramp is not safety-rated. Added both points, and updated the source [6] note to match.
- torque-sensing (cheese plate): "without stopping the line ... and the arm stops" read as a contradiction. It now says the rest of the line keeps running. The wedge-contact claim now says detection only works once the push exceeds the arm's modeling error. This matches the concept's own break text about light touches hiding.
- pneumatic-actuation: defined "regulated" and "bore".
- hydraulic-actuation: "ten to fifty times factory air" was an arithmetic error. 35 MPa / 550 kPa is about 64, and the Key numbers line itself uses 550-690 kPa. Changed to 10-60 in Precise and Key numbers, with the arithmetic shown. The fact check had changed 10-60 to 10-50.
- hydraulic-actuation: defined spool. "Some walking robots use it" became "have used it", because the best-known hydraulic humanoid is retired.
- hydraulic-actuation (misconception): the Reality answered "obsolete in robotics?" with construction machines, which are not robots. Added Brokk's remote-controlled demolition robots, which use an electric motor driving a hydraulic system (new source [9], plus a Real products entry).
- hydraulic-actuation: Hyundai's release says Atlas starts in 2028 on processes such as parts sequencing, across a network that includes Metaplant America. The file had tied the 2028 start to Metaplant specifically. Reworded the text and the source [6] note.

### Spot-checks of the fact check
| Claim | Source opened | Result |
|---|---|---|
| AM8063: 29 Nm standstill, 111 Nm peak, 1,500 rpm, 3.33 Nm/A, 100-480 V AC; 18/19/24-bit feedback | [Beckhoff AM8063](https://www.beckhoff.com/en-en/products/motion/rotary-servomotors/am8000-servomotors/am8063-wkyz.html) | pass |
| Beckhoff brake: B side, 24 VDC, >10 M cycles, max 2,000 e-stops from 3,000 rpm at up to 3x inertia, not for personnel protection alone | [Beckhoff AM8100 holding brake](https://infosys.beckhoff.com/content/1033/am8100/1333496971.html) | pass. The page also confirms it says nothing about brake-release sequencing, so that flag stays. |
| mayr ROBA-servostop Cobot: 0.23-9 Nm, 24 V then 8 V hold, spring-applied, fail-safe, suitable for e-stop, mounting options | [mayr](https://www.mayr.com/en/products/safety-brakes/industrial-brakes/roba-servostop-cobot~40645) | pass |
| AksIM-2: 20 bit, ±14 to ±72 arcsec after self-calibration, BiSS C / SSI / async serial, off-axis | [RLS AksIM-2](https://www.rls.si/eng/aksim-2) | pass |
| Nabtesco: about 60% (own estimate) of precision reducers for medium and large industrial robot joints | [Nabtesco robot products](https://www.nabtesco.com/en/products/robot/) | pass |
| Planetary backlash: precision 1-4, economy up to 5-12 arcmin; 8 arcmin is the limit of "several economy lines" | [WITTENSTEIN servo gearboxes](https://www.wittenstein-group.com/en-uk/products/servo-gearboxes) | pass (NP, LPB+, NPR, NPS, NPL are all ≤8; NTP ≤5; CP ≤12) |
| CSG-20-50: 33 Nm rated (L10), 73 / 127 Nm peaks, K1-K3 = 1.3 / 1.8 / 2.3 × 10^4 Nm/rad, T1 = 7 Nm | [HD CSG-20-50-GH](https://www.harmonicdrive.net/products/servo-mount-gearheads/harmonic-drive/csg-gh/20/csg-20-50-gh) | pass |
| AX8000: 62.5 µs current loop at 8 kHz, 1 µs reaction, 62.5 µs EtherCAT, STO/SS1/SS2/SOS | [Beckhoff AX8000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax8000-multi-axis-servo-system/) | pass |
| Aerotech STO: two identical 24 V channels, either removed means safe state, 450-550 ms delay for a controlled stop | [Aerotech STO](https://help.aerotech.com/automation1/hardware-manuals/Automation1-iHXA4-and-HXA4-web/Chapter-2-Installation-and-Configuration/Safe-Torque-Off-Input-STO.htm) | pass with nuance. The delay is fixed, the ramp happens only if configured, and the ramp is not safety-rated. Text updated. |
| LBR iiwa: torque sensors in all seven axes, 7 and 14 kg versions, still offered | [KUKA LBR iiwa](https://www.kuka.com/en-ch/products/robotics-systems/industrial-robots/lbr-iiwa) | pass |
| Production Atlas unveiled at CES, January 5, 2026, fully electric | [Boston Dynamics](https://bostondynamics.com/blog/boston-dynamics-unveils-new-atlas-robot-to-revolutionize-industry/) | pass |
| Hyundai: Atlas on parts sequencing at Metaplant America from 2028 | [Hyundai Motor Group](https://www.hyundaimotorgroup.com/en/news/hyundai-motor-group-announces-ai-robotics-strategy--to-lead-human-centered-robotics-era-at-ces-2026) | pass with nuance. The release names 2028 and parts sequencing, and names HMGMA as part of the network, but does not tie the 2028 start to that plant. Reworded. |
| Unimate: GM Ternstedt plant, Trenton NJ, 1961, hydraulic at 6.9 MPa (1,000 psi), "first successful application" | [IEEE Spectrum](https://spectrum.ieee.org/unimation-robot) (secondary) | pass |

Notes:
- The shared WebSearch quota was used up during this pass. Every new source was checked by fetching it directly.
- New sources: Oriental Motor stepper overview (servo-motor [8]) and Brokk 200+ (hydraulic [9]). Both are manufacturer pages and both were loaded.
- The 5 `[unverified]` flags are unchanged: drive in the controller cabinet (x2), thermal basis of torque ratings, brake release sequencing, and the UR forum reply. The maxon motor-data PDF was opened and does not cover the thermal basis. Oriental Motor's sizing page covers effective torque but does not call it thermal.

## Area 3, End effectors: fact check

Summary line: 115 claims checked: 102 verified, 11 corrected, 2 unverifiable (1 kept flagged, 1 removed).

Notes:
- Seven `[unverified]` flags were in the file at the start. Six are resolved (ISO 9409-1 flange, pneumatic finger mechanism, master vs tool plate, manual changers, QC-510 applications, UR e-Series built-in sensor). One stays flagged: the cracker pack weight. The only figures I found were reseller listings (a Club 2-cracker pack listed at 0.25 oz, about 7 g) that returned HTTP 429 or 503, so I did not cite them.
- The EPFL Infoscience record for the Shintake review returned HTTP 429 on every try, and the Wiley DOI page returned 403. The citation is now the Europe PMC record; Crossref confirms volume 30, issue 29.
- iso.org returned 403. ISO 9409-1 is cited through the AFNOR catalog entry (AFNOR is the French national standards body), backed by the UR5e datasheet, which lists an EN ISO 9409-1-50-4-M6 flange.
- I added primary Schmalz pages for the suction formula, safety factors, and friction. Machine Design (2011, trade press, written with a Schmalz engineer) is kept only for cup shapes and fold counts. It and Schmalz's current page disagree slightly on wet friction (0.2-0.4 vs 0.2-0.3), and the text now gives both.
- Secondary sources kept, with no primary I could load: New Equipment Digest (Axia80 size, weight, 2017 launch), Machine Design 2011 (cup folds; parallel grippers being the most common type), reinraum.de (mGrip news item), the Robotiq blog (manufacturer blog, used for Robotiq's own products).
- Status as of November 2026: ATI still brands itself "a Novanta company". The UR5e datasheet is dated October 2026. mGrip has been sold by Schmalz since August 2024. All product pages cited loaded and show the products as current.

### end-effector
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Flange hole pattern on "most" arms follows ISO 9409-1 | corrected | [AFNOR ISO 9409-1:2004](https://www.boutique.afnor.org/en-gb/standard/iso-940912004/manipulating-industrial-robots-mechanical-interfaces-part-1-plates/xs112104/110274); [UR5e datasheet](https://www.universal-robots.com/manuals/latest/en/datasheets/ur5e/) | Flag removed. "most" changed to "many". Added the standard's purpose and the UR5e's ISO 9409-1-50-4-M6 flange. New sources [4][5] |
| 2 | UR arms have an M8 tool connector | verified | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools); [UR5e datasheet](https://www.universal-robots.com/manuals/latest/en/datasheets/ur5e/) | [5] added |
| 3 | Up to 48 W peak tool power | verified | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools) | none |
| 4 | 2 digital in, 2 digital out, 2 analog in at the wrist | verified | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools); [UR5e datasheet](https://www.universal-robots.com/manuals/latest/en/datasheets/ur5e/) | none |
| 5 | TCP stored as a translation and rotation offset from the flange | verified | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools) | none |
| 6 | Wrong TCP spoils straight-line (MoveL) moves | verified | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools) | none |
| 7 | Payload = tool mass + workpiece + combined center of gravity | verified | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools) | none |
| 8 | Wrong payload causes poor hand-guiding (free drive) and unexpected protective stops | verified | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools) | none |
| 9 | Only one payload/CoG active at a time; the program must update it | verified | [UR multiple TCPs article](https://www.universal-robots.com/articles/ur/programming/setting-payload-and-center-of-gravity-when-using-multiple-tcps/) | none (article covers CB3 3.3 / e-Series 5.1 and warns newer versions may differ) |
| 10 | UR uses a 1 kg box example | verified | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools) | none |
| 11 | set_target_payload replaces the deprecated set_payload and set_payload_mass | verified | [UR multiple TCPs article](https://www.universal-robots.com/articles/ur/programming/setting-payload-and-center-of-gravity-when-using-multiple-tcps/) | none |
| 12 | RG2 "sends" its TCP and payload to the robot "as its fingers move" | corrected | [OnRobot RG2](https://onrobot.com/en/products/rg2-gripper) | Page says only "automatic tool center point and payload calculations". Reworded to match |
| 13 | TCP is 6 numbers (3 translations, 3 rotations) | verified | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools) | none |
| 14 | Inertia given as 6 values (Ixx ... Iyz) | verified | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools) | none |
| 15 | TCP about 120 mm from the flange | verified | labeled illustrative; plausible for a bracket plus bellows cup | none |

### vacuum-gripper
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Atmospheric pressure about 101 kPa at sea level | verified | [NIST standard atmosphere](https://physics.nist.gov/cgi-bin/cuu/Value?stdatm) | Citation added [9] |
| 2 | Vacuum given in kPa/mbar or as a percentage; percentage used to compare generators | verified | [Schmalz measurement units](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/basic-knowledge/measurement-units-for-vacuum-data) | none |
| 3 | 60% vacuum is about -60 kPa | verified | arithmetic (0.6 x 101 kPa) | none |
| 4 | F = Δp × A | verified | [Schmalz design of the suction cup](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/vacuum-suction-cups/design-of-the-suction-cup); [Machine Design 2011](https://www.machinedesign.com/news/suction-cups-lift-almost-anything) (secondary) | Primary source added [7] |
| 5 | Schmalz: safety factor at least 2, 1.5 German UVV minimum, 2.5+ when swiveling | verified | [Schmalz design of the suction cup](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/vacuum-suction-cups/design-of-the-suction-cup) | Re-cited to primary [7] |
| 6 | Robotiq: 1.5 smooth, 2 porous/oily, up to 4 vertical | verified | [Robotiq cup selection](https://blog.robotiq.com/best-practices-for-cup-selection) | none |
| 7 | Friction about 0.5 dry plastic or metal | verified | [Schmalz theoretical holding force](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/system-design-calculation-example/theoretical-holding-force-of-a-suction-cup); [Machine Design 2011](https://www.machinedesign.com/news/suction-cups-lift-almost-anything) (secondary) | [8] added |
| 8 | Friction 0.2-0.4 on wet surfaces | verified | [Machine Design 2011](https://www.machinedesign.com/news/suction-cups-lift-almost-anything) (secondary); [Schmalz theoretical holding force](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/system-design-calculation-example/theoretical-holding-force-of-a-suction-cup) | Range kept; noted that Schmalz's current page gives 0.2-0.3 |
| 9 | Venturi ejector: no moving parts, low weight, fast response | verified | [Schmalz vacuum ejectors](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/vacuum-generators/vacuum-ejectors) | none |
| 10 | Air-saving mode stops at set vacuum, restarts when it falls | verified | [Schmalz vacuum ejectors](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/vacuum-generators/vacuum-ejectors) | none |
| 11 | Electric generators save up to 95% energy, depending on cycle frequency, load profile, operating time | verified | [Schmalz press release Apr 2026](https://www.schmalz.com/en/career-company/latest/news/electrically-powered-how-vacuum-is-becoming-mobile) | none |
| 12 | GCPi: 46 l/min, 80% | verified | [Schmalz press release Apr 2026](https://www.schmalz.com/en/career-company/latest/news/electrically-powered-how-vacuum-is-becoming-mobile) | none |
| 13 | ECBPi: 12 l/min, 75% | verified | [Schmalz press release Apr 2026](https://www.schmalz.com/en/career-company/latest/news/electrically-powered-how-vacuum-is-becoming-mobile) | none |
| 14 | Electric pumps run on 24 V | verified | [Schmalz press release Apr 2026](https://www.schmalz.com/en/career-company/latest/news/electrically-powered-how-vacuum-is-becoming-mobile) | none (24 V-DC stated for GCPi) |
| 15 | AirPick up to 85%, EPick up to 80% vacuum | verified | [Robotiq cup selection](https://blog.robotiq.com/best-practices-for-cup-selection) | none |
| 16 | Flat cups are stable and evacuate fast | verified | [Machine Design 2011](https://www.machinedesign.com/news/suction-cups-lift-almost-anything) (secondary) | none |
| 17 | Bellows cups have 1.5-4.5 folds; the 4.5-fold one is for flexible packaging | verified | [Machine Design 2011](https://www.machinedesign.com/news/suction-cups-lift-almost-anything) (secondary) | none (typical 1.5/2.5/3.5; 4.5-fold SPB4 for soft packaging) |
| 18 | Nitrile cheap/general, PU oil resistant, silicone heat-resistant and food-approved | verified | [Robotiq cup selection](https://blog.robotiq.com/best-practices-for-cup-selection) | none |
| 19 | Porous parts need high flow or several smaller cups | verified | [Robotiq cup selection](https://blog.robotiq.com/best-practices-for-cup-selection) | none |
| 20 | 20 mm cup at -60 kPa gives about 19 N | verified | arithmetic (π × 0.01² × 60,000 = 18.8 N) | Key number now cites [7] for the formula |
| 21 | 1 N is about 100 g | verified | arithmetic (1/9.81 kg = 102 g) | none |
| 22 | Piab fits filters on some food cups to stop clogging | verified | [Piab food automation](https://www.piab.com/industries/food--beverage/food-automation) | none |
| 23 | Piab cups "certified to" FDA 21 CFR 177.2600 and EU 1935/2004 | corrected | [Piab food automation](https://www.piab.com/industries/food--beverage/food-automation); [Piab B-BL30-2](https://www.piab.com/suction-cups-and-soft-grippers/round-suction-cups/multibellows-suction-cups/0206373) | Changed to "silicone complies with". Noted that the FDA rule covers materials and the FDA does not certify products. [10] added |
| 24 | Metal-detectable grade with iron mixed in | verified | [Piab food automation](https://www.piab.com/industries/food--beverage/food-automation); [Piab B-BL30-2](https://www.piab.com/suction-cups-and-soft-grippers/round-suction-cups/multibellows-suction-cups/0206373) | none |
| 25 | Bizerba cell: two cobots, GCPi, foil-wrapped meat, up to 96 picks/min, no compressed air | verified | [Schmalz press release Apr 2026](https://www.schmalz.com/en/career-company/latest/news/electrically-powered-how-vacuum-is-becoming-mobile) | none |
| 26 | Piab B-BL bellows cups include detectable silicone versions "certified to" FDA/EU rules | corrected | [Piab B-BL30-2](https://www.piab.com/suction-cups-and-soft-grippers/round-suction-cups/multibellows-suction-cups/0206373) | "certified to" changed to "complying with"; re-cited to the product page [10] |
| 27 | Source dates: Schmalz release April 2026; Machine Design 2011 with a Schmalz engineer | verified | [Schmalz press release](https://www.schmalz.com/en/career-company/latest/news/electrically-powered-how-vacuum-is-becoming-mobile); [Machine Design 2011](https://www.machinedesign.com/news/suction-cups-lift-almost-anything) (secondary) | none |

### soft-gripper
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Soft grippers are mostly silicone elastomers and adapt to the object | verified | [Shintake et al. 2018, Europe PMC](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1002/adma.201707035&format=json&resultType=core) | Source URL replaced (EPFL record returned 429) |
| 2 | The review's three approaches: actuation, controlled stiffness, controlled adhesion | verified | [Shintake et al. 2018, Europe PMC](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1002/adma.201707035&format=json&resultType=core) | none |
| 3 | Pneumatic finger: rubber with internal air channels that bends when inflated | verified | [Mosadegh et al. 2014](https://asu.elsevierpure.com/en/publications/pneumatic-networks-for-soft-robotics-that-actuate-rapidly/); [Schmalz mGrip](https://schmalz.com/mgrip) | Flag removed; peer-reviewed source added [6]. "the common type" softened to "a common type" |
| 4 | mGrip: pneumatic, closed air circuit, no extra drives | verified | [reinraum.de Nov 2024](https://www.reinraum.de/en/news/finger-grip-mgrip-flexible-hygienic-process-safe.html) (secondary); [Schmalz mGrip](https://schmalz.com/mgrip) | Added the product page's "pressure or vacuum to open or close" [7] |
| 5 | Open problems: robustness, speed, sensing, control | verified | [Shintake et al. 2018, Europe PMC](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1002/adma.201707035&format=json&resultType=core) | none (the review also lists miniaturization) |
| 6 | OnRobot Soft Gripper: 24 V, no air, 2.2 kg max, 11-118 mm, depends on shape, softness, friction | verified | [UR marketplace: OnRobot Soft Gripper](https://www.universal-robots.com/marketplace/products/01tP40000071NX9IAM) | none |
| 7 | mGrip: up to 10 kg, 300 mm wide, 120 picks/min | verified | [Schmalz release Aug 2024](https://www.schmalz.com/en/career-company/latest/news/portfolio-expanded-schmalz-takes-over-finger-gripper-from-soft-robotics-inc) | none |
| 8 | FDA-compliant POM, silicone, stainless steel | verified | [Schmalz release Aug 2024](https://www.schmalz.com/en/career-company/latest/news/portfolio-expanded-schmalz-takes-over-finger-gripper-from-soft-robotics-inc) | none |
| 9 | IP69K is optional | verified | [Schmalz mGrip](https://schmalz.com/mgrip) | Re-cited. The 2024 release lists IP69K without saying "optional"; the current product page says "optional hygienic design" |
| 10 | Can be cleaned in place without dismantling | verified | [reinraum.de Nov 2024](https://www.reinraum.de/en/news/finger-grip-mgrip-flexible-hygienic-process-safe.html) (secondary) | none |
| 11 | OnRobot cups meet FDA 21 CFR for non-fatty foods only, plus EU 1935/2004 | verified | [UR marketplace: OnRobot Soft Gripper](https://www.universal-robots.com/marketplace/products/01tP40000071NX9IAM) | none |
| 12 | Used "in bakeries and meat and poultry plants" | corrected | [reinraum.de Nov 2024](https://www.reinraum.de/en/news/finger-grip-mgrip-flexible-hygienic-process-safe.html) (secondary) | Source names products (baked goods, fruit, vegetables, drumsticks, nets/bags), not plant types. Reworded to match |
| 13 | Schmalz bought the mGrip family from Soft Robotics Inc. in August 2024 | verified | [Schmalz release Aug 2024](https://www.schmalz.com/en/career-company/latest/news/portfolio-expanded-schmalz-takes-over-finger-gripper-from-soft-robotics-inc) | none |
| 14 | Kept the Boston "production site" | corrected | [Schmalz release Aug 2024](https://www.schmalz.com/en/career-company/latest/news/portfolio-expanded-schmalz-takes-over-finger-gripper-from-soft-robotics-inc) | Changed to "existing Boston, Massachusetts location" (the source does not say production) |
| 15 | Three interchangeable silicone cups | verified | [UR marketplace: OnRobot Soft Gripper](https://www.universal-robots.com/marketplace/products/01tP40000071NX9IAM) | none |
| 16 | piSOFTGRIP: vacuum cavities, fragile items like chocolate and waffles | verified | [Piab food automation](https://www.piab.com/industries/food--beverage/food-automation) | none |
| 17 | Citation: Advanced Materials 30(29), 2018 | verified | [Crossref record](https://api.crossref.org/works/10.1002/adma.201707035) | none |
| 18 | Source dates: reinraum.de November 2024; Schmalz release August 2024 | verified | [reinraum.de](https://www.reinraum.de/en/news/finger-grip-mgrip-flexible-hygienic-process-safe.html) (secondary); [Schmalz release](https://www.schmalz.com/en/career-company/latest/news/portfolio-expanded-schmalz-takes-over-finger-gripper-from-soft-robotics-inc) | none |

### rigid-gripper
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Most industrial finger grippers are parallel grippers | verified | [Machine Design 2011, grippers](https://www.machinedesign.com/markets/robotics/article/21833348/the-difference-between-robotic-grippers-with-parallel-three-finger-and-angled-designs) (secondary, quotes Schunk) | Citation added [5] |
| 2 | PGN-plus-P 64-1: 6 mm stroke per jaw | verified | [Schunk PGN-plus-P 64-1](https://schunk.com/be/fr/uchopovaci-systemy/paralelni-chapadlo/pgn-plus-p/pgn-plus-p-64-1/p/000000000000318496) | none (also confirmed on the Schunk US page) |
| 3 | 350 N closing force | verified | [Schunk PGN-plus-P 64-1](https://schunk.com/be/fr/uchopovaci-systemy/paralelni-chapadlo/pgn-plus-p/pgn-plus-p-64-1/p/000000000000318496) | none |
| 4 | 0.01 mm repeatability | verified | same | none |
| 5 | 0.02 s closing time | verified | same | none |
| 6 | 0.27 kg | verified | same | none |
| 7 | 2.5-8 bar | verified | same | none |
| 8 | EGK 25: 26.5 mm per jaw | verified | [Schunk EGK 25](https://schunk.com/us/en/sistemi-di-presa/pinza-parallela/egk/egk-25-ei-m-b/p/000000000001491754) | none |
| 9 | 20-50 N adjustable force | verified | same | none |
| 10 | 0.03 mm gripping repeatability | verified | same | none |
| 11 | 0.37 s closing time | verified | same | none |
| 12 | Brake keeps 75-90% of grip force if power drops | verified | [Schunk EGK 25](https://schunk.com/us/en/sistemi-di-presa/pinza-parallela/egk/egk-25-ei-m-b/p/000000000001491754); [Schunk EGK brochure](https://d16vz4puxlsxm1.cloudfront.net/asset/076200133045-Prod/document_2i0t6dph093pp39ajfvnkvla0g/EGK_EN_144dpi-WEB.pdf) | Product page gives the 75-90% but not when it applies; the brochure supports "standstill or power failure". Wording matched, [6] added |
| 13 | RG2 opens 110 mm, 3-40 N | verified | [OnRobot RG2](https://onrobot.com/en/products/rg2-gripper) | none |
| 14 | 2F-85 has "linked fingers", parallel or wrap-around grip, 85 mm stroke | corrected | [UR+ Robotiq 2F-85](https://www.universal-robots.com/plus/products/robotiq/robotiq-2f-85/) | "linked" removed (not stated). Kept parallel and encompassing grip and 85 mm |
| 15 | RG2 rated 2 kg force-fit, 5 kg form-fit | verified | [OnRobot RG2](https://onrobot.com/en/products/rg2-gripper) | none |
| 16 | EGK 25 finger limits: 70 mm, 0.13 kg | verified | [Schunk EGK 25](https://schunk.com/us/en/sistemi-di-presa/pinza-parallela/egk/egk-25-ei-m-b/p/000000000001491754) | none |
| 17 | EGK 25: IP67 electronics, IP20 guides and jaws | verified | same | none |
| 18 | PGN-plus-P is IP40; max finger length (100 mm) | verified | [Schunk PGN-plus-P 64-1](https://schunk.com/be/fr/uchopovaci-systemy/paralelni-chapadlo/pgn-plus-p/pgn-plus-p-64-1/p/000000000000318496) | none |

### tool-changer
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Master plate on the robot flange, tool plate on each tool | verified | [ATI QC-77 manual](https://www.ati-ia.com/app_content/Documents/9610-20-1669.pdf); [ATI MC-16R manual](https://www.ati-ia.com/app_content/Documents/9620-20-B-MC-16R%20Tool%20Changer%20Manual.pdf) | Flag removed; [5] added |
| 2 | Lock piston acts like a large dowel pin that aligns the plates | verified | [ATI tool changer features](https://ati-ia.com/products/toolchanger/tool_changer_features.aspx) | none |
| 3 | Repeatability 0.0152 mm "for ATI's QC changers from 70 to 700 kg" | corrected | [QC-46](https://ati.novanta.com/product/qc-46/); [QC-160](https://ati.novanta.com/product/qc-160/); [QC-510](https://ati.novanta.com/product/tool-changers-qc-510/) | Narrowed to the three models checked (QC-46, QC-160, QC-510); [3] added |
| 4 | Fail-safe: tool stays on if lock air is lost | verified | [ATI tool changer features](https://ati-ia.com/products/toolchanger/tool_changer_features.aspx) | none |
| 5 | Lock/unlock sensing built in | verified | [QC-46](https://ati.novanta.com/product/qc-46/) | none |
| 6 | Ready-to-lock sensors detect the tool plate within 1.5 mm | verified | [QC-510](https://ati.novanta.com/product/tool-changers-qc-510/) | none |
| 7 | No-touch locking tolerates about 2-3 mm gap | verified | [QC-46](https://ati.novanta.com/product/qc-46/); [QC-160](https://ati.novanta.com/product/qc-160/) | none (QC-46: 2.5 mm; QC-160 page says 3.0 mm in features but 2 mm in its table) |
| 8 | Air through sealed ports; spring pins on master touch fixed pins on tool | verified | [ATI tool changer features](https://ati-ia.com/products/toolchanger/tool_changer_features.aspx) | none |
| 9 | Heavy models add fluid, high-current, servo modules | verified | [ATI tool changer features](https://ati-ia.com/products/toolchanger/tool_changer_features.aspx); [QC-510](https://ati.novanta.com/product/tool-changers-qc-510/) | none |
| 10 | QC-46 weighs 2.98 kg coupled | verified | [QC-46](https://ati.novanta.com/product/qc-46/) | none |
| 11 | Manual plates are lever-locked and "lighter and cheaper" | corrected | [ATI MC-16R manual](https://www.ati-ia.com/app_content/Documents/9620-20-B-MC-16R%20Tool%20Changer%20Manual.pdf) | Flag removed. MC-16R locks with a twist ratchet knob and is meant for manual and maintenance changes. The "lighter and cheaper" claim had no source and was removed. [6] added |
| 12 | At 200 plates/h each robot has about 18 s per plate | verified | arithmetic (3600/200) | none |
| 13 | Swap a tool in a minute | verified | plausible operator task; now labeled | Added "(illustrative)" |
| 14 | QC-510: 700 kg, 62,000 N at 5.5 bar, 28.1 kg, servo and high-current modules | verified | [QC-510](https://ati.novanta.com/product/tool-changers-qc-510/) | none |
| 15 | QC-510 scale suits welding guns and big grippers | corrected | [ATI tool changer features](https://ati-ia.com/products/toolchanger/tool_changer_features.aspx) | Flag removed. Replaced with ATI's own statement that heavy-duty changers are commonly used for heavy material handling and welding |
| 16 | QC-46: 70 kg payload, 5800 N at 5.5 bar | verified | [QC-46](https://ati.novanta.com/product/qc-46/) | none |
| 17 | QC-160: 300 kg, 31,000 N, integrated air ports | verified | [QC-160](https://ati.novanta.com/product/qc-160/) | none |
| 18 | ATI is "a Novanta company" as of 2026 | verified | [QC-46](https://ati.novanta.com/product/qc-46/) | none |

### ft-sensor
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Six axes: Fx, Fy, Fz, Tx, Ty, Tz | verified | [ATI Mini58](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58) | none |
| 2 | Bodies of high-strength stainless steel | verified | [ATI Mini58](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58); [ATI Delta](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Delta) | none |
| 3 | Silicon gauges give a signal 75 times stronger than foil | verified | same | none |
| 4 | Calibration traceable to NIST | verified | [ATI Delta](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Delta) | none |
| 5 | Mini58 calibrations 700-2800 N X/Y | verified | [ATI Mini58](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58) | none |
| 6 | Mini58 X/Y resolution 1/6 to 3/4 N | verified | same | none |
| 7 | Delta 165 N calibration with 1/32 N X/Y resolution | verified | [ATI Delta](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Delta) | none |
| 8 | Overload 4.9-21x (Mini58), 4.1-18.8x (Delta) | verified | [ATI Mini58](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58); [ATI Delta](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Delta) | none |
| 9 | Loads must be in range on all six axes at once | verified | [ATI Mini58](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58) | none |
| 10 | Quoted resolutions "assume some noise filtering" | corrected | [ATI Mini58](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58) | ATI quotes typical effective resolution after dropping four counts of noise, and says filtering can improve it. Reworded |
| 11 | A wrapped cracker pack weighs 10-30 g | unverifiable | none loaded (reseller listings returned 429/503) | kept flagged |
| 12 | Mini58 smallest metric Fz resolution 7/24 N, about 30 g | verified | [ATI Mini58](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58) | none (0.29 N / 9.81 = 30 g) |
| 13 | Delta 165 N calibration Fz resolution 1/16 N, about 6 g | verified | [ATI Delta](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Delta) | none |
| 14 | ATI offers IP65 and IP68 versions | verified | [ATI Mini58](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58) | none |
| 15 | Axia80: 82 mm, 0.3 kg, EtherCAT or Ethernet, for assembly, grinding, polishing | verified | [New Equipment Digest 2017](https://www.newequipment.com/home/product/55103225/24461-ati-industrial-automations-low-cost-torque-sensor-axia80) (secondary); [ATI Axia80-M20](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Axia80-M20) | ATI page [4] added; interfaces now include serial |
| 16 | Axia80 launched in 2017 | verified | [New Equipment Digest 2017](https://www.newequipment.com/home/product/55103225/24461-ati-industrial-automations-low-cost-torque-sensor-axia80) (secondary) | none |
| 17 | Delta is a "larger" sensor than Mini58 | unverifiable | ATI pages give no dimensions | removed "larger" |
| 18 | Delta calibrations 165-660 N X/Y | verified | [ATI Delta](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Delta) | none |
| 19 | UR e-Series arms have a force-torque sensor built into the tool flange | verified | [UR5e datasheet](https://www.universal-robots.com/manuals/latest/en/datasheets/ur5e/) | Flag removed. Added UR5e ±50 N range and ±3.5 N precision. [5] added |

## Area 3, End effectors: analogy and precision review

Validator after edits: `node tools/build-content.mjs --check knowledge/03-end-effectors.md` reports 0 warnings, 0 errors (1 unverified flag remains: the cracker pack weight, left as the fact checker flagged it).

WebSearch ran out partway through. The new sources came from pages loaded directly: the ATI QC-77 and MC-16R manual PDFs (text pulled out locally), the UR5e datasheet PDF (text pulled out locally), and the open-access PubMed Central version of Marchese et al. 2015.

### Analogies
| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| end-effector | kept | none at the core. Kitchen tongs plus "tell the robot where the tip is" correctly predicts that the TCP is a number someone has to enter. The "Where the analogy breaks" text was wrong and is fixed (see Other fixes) | n/a |
| vacuum-gripper | kept | none. The straw analogy already says the outside air pushes. "Where the analogy breaks" covers the limit set by atmospheric pressure and the need for a vacuum sensor | n/a |
| soft-gripper | kept | none. A relaxed hand cupping a peach predicts the shape tolerance and gentleness correctly. "Where the analogy breaks" covers no sensing and imprecise placement. Removed the unsourced "a few millimeters" | n/a |
| rigid-gripper | kept | none. Tongs predict a squeeze at a few points and swappable tips. The break said a pneumatic gripper uses "the same full force". It actually uses the force its air pressure sets, which can be adjusted. Fixed | n/a |
| tool-changer | kept | none. A lens mount predicts two halves, lock and release, utilities passed through, and a repeatable position. "Where the analogy breaks" covers weight and air-loss fail-safe | n/a |
| ft-sensor | kept (one word cut) | "very precise bathroom scale" invited the reader to expect fine resolution. The core lesson is the opposite: sensors sized for robot loads cannot weigh a 10-30 g pack. Dropped "very precise" | n/a (same analogy, minus "very precise") |

### Other fixes
- end-effector (cheese example): sign error. A TCP entered "5 mm short" makes the robot push 5 mm into the tray, not stop 5 mm above it. Rewritten: 5 mm too long stops slices above the pocket, 5 mm too short pushes them into the tray. It now also says the place point is calculated from the tray position.
- end-effector ("Where the analogy breaks" and Precise): the old text said "will miss by 5 mm on every move", which is wrong. A point taught by jogging the real tool to the real spot replays correctly even with a wrong TCP. Both sections now say the error hits calculated targets (camera, drawing, grid, tray layout) and rotations about the tool tip.
- end-effector (Precise): defined M8 connector, digital outputs, and analog inputs in plain words.
- vacuum-gripper (Precise): added the mechanism for why friction matters. Schmalz's load cases divide the sideways acceleration by μ for a level cup and the whole load by μ for a vertical cup, so at μ = 0.25 a vertical cup needs 4x the force [8].
- vacuum-gripper (Precise): changed "silicone ... is approved for food contact" to "comes in grades approved for food contact". Not all silicone is food grade, and the soft-gripper section teaches that food-grade claims come with conditions.
- vacuum-gripper (cheese example): the wet apple slice now gets its consequence. A fast sideways move can slide it off even when the straight-up hold is ample [8]. Also split a run-on sentence.
- vacuum-gripper (misconception): "most drops come from leaks" had no source (Robotiq does not say it), and "on porous parts you need flow" contradicted "don't buy a bigger pump", since a higher-flow pump is the fix there. The misconception now names deeper vacuum specifically. The Reality now says generators already reach 75-85%, doubling cup diameter quadruples force, drops "more often" come from leaks, sealing, or friction, and porous parts need more flow.
- soft-gripper (Precise): "elastomers (rubber-like plastics)" defined rubber as plastic. Now "rubbers that stretch and spring back".
- soft-gripper (Precise): "bends when the channels are inflated" skipped the mechanism. Added that the finger bends because a layer on one side flexes but barely stretches. New peer-reviewed open-access source [8] (Marchese, Katzschmann, Rus 2015, Soft Robotics). The Mosadegh abstract does not describe this.
- soft-gripper (cheese example): "certified only for non-fatty foods" changed to "food-contact compliance covers only non-fatty foods". This matches the source wording and the fact checker's point that the FDA does not certify products.
- soft-gripper (misconception): the Reality never refuted "cannot damage anything". Added that grip force rises with air pressure, so set too high it can bruise.
- rigid-gripper (Precise): defined "jaw guides" (the rails the jaws slide on) and explained that long fingers act as levers.
- rigid-gripper (cheese example): the text recommended the RG2's 3 N low end without noting that its product page makes no food-contact or washdown claim [3]. It now says the station needs a washdown-built gripper with similarly low force.
- tool-changer (Precise): "a piston drives the lock" had no mechanism. Added ATI's ball lock: a cam on the piston pushes steel balls into a hardened ring in the tool plate. The fail-safe works because, on air loss, the balls land on a straight cam section that their load cannot push aside (QC-77 manual [5]).
- tool-changer (Precise): the old text said the QC-46's 2.98 kg "comes straight out of a cobot's rated payload". But the QC-46 is sized for 70 kg payloads, and on a 5 kg UR5e it would use more than half. Reworded to say changers are sized to the arm. Added the UR5e datasheet as [7].
- tool-changer (cheese example): the example described an operator swapping tools, but cited the repeatability of the QC-46, an industrial-robot changer. It now uses ATI's custom QC-77: washdown-capable, stainless, food-grade grease, 0.015 mm repeatability. ATI's manual names quick tool change for food-handling washdown as a use [5].
- tool-changer (Elsewhere): it was a list of specs, not a setting. It now describes welding and heavy-material-handling cells where the robot sets a tool in a tool stand and couples to the next with no person involved [1][5], then gives the QC-510 specs.
- tool-changer (misconception): "often serve a single-job robot" had no source. Now "can serve", backed by ATI's food-washdown statement [5]. Added a QC-77 product line.
- ft-sensor (Precise): added why range and resolution move together: a stiffer body flexes less per newton, so the signal sits closer to the noise. Defined "counts" and made "a few" exact as four, per ATI.
- ft-sensor (cheese example): the text called a vacuum switch a cheaper double-pick check. It cannot catch a double pick, because the cup still seals on the top pack. It now says the switch catches missed picks and the inspection camera counts packs.

### Spot-checks of the fact check
| Claim | Source opened | Result |
|---|---|---|
| UR5e built-in F/T sensor ±50 N range, ±3.5 N precision; datasheet updated October 2026 | [UR5e datasheet PDF](https://www.universal-robots.com/manuals/latest/en/datasheets/ur5e/) (text extracted locally) | confirmed (Range 50.0 N, Precision 3.5 N, Accuracy 4.0 N; "Updated October 2026") |
| UR5e flange EN ISO 9409-1-50-4-M6, M8 8-pin connector, 2 DI / 2 DO / 2 AI at the tool | same | confirmed |
| UR tool connector up to 48 W peak; TCP is translation plus rotation; 6 inertia values; wrong payload causes free-drive issues and protective stops | [UR integrating EOAT](https://universal-robots.com/developer/integrating-end-of-arm-tools) | confirmed |
| Schmalz April 2026: GCPi 46 l/min, 80%; ECBPi 12 l/min, 75%; up to 95% energy saving; Bizerba cell with two cobots, GCPi, up to 96 picks/min, no compressed air | [Schmalz press release](https://www.schmalz.com/en/career-company/latest/news/electrically-powered-how-vacuum-is-becoming-mobile) | confirmed (dated 04/14/2026; GCPi named for Bizerba) |
| Friction 0.5 dry (plastic, metal), 0.2-0.4 wet; 4.5-fold bellows for soft packaging | [Machine Design 2011](https://www.machinedesign.com/news/suction-cups-lift-almost-anything) (secondary); [Schmalz holding force](https://www.schmalz.com/en/support/know-how/vacuum-knowledge/the-vacuum-system-and-its-components/system-design-calculation-example/theoretical-holding-force-of-a-suction-cup) | confirmed (Machine Design lists plastic at 0.5; Schmalz gives 0.2-0.3 wet) |
| Robotiq safety factors 1.5 / 2 / 4; AirPick 85%, EPick 80% | [Robotiq blog](https://blog.robotiq.com/best-practices-for-cup-selection) | confirmed |
| Schmalz took over mGrip from Soft Robotics Inc., August 2024; 10 kg, 300 mm, 120 picks/min; FDA-compliant POM, silicone, stainless; IP69K; Boston kept | [Schmalz release Aug 2024](https://www.schmalz.com/en/career-company/latest/news/portfolio-expanded-schmalz-takes-over-finger-gripper-from-soft-robotics-inc) | confirmed (announced 08/06/2024, effective August 5, 2024) |
| OnRobot Soft Gripper 2.2 kg, 11-118 mm, 24 V, no air, three cups, FDA for non-fatty foods, EC 1935/2004 | [UR marketplace listing](https://www.universal-robots.com/marketplace/products/01tP40000071NX9IAM) | confirmed |
| Schunk EGK 25: 26.5 mm per jaw, 20-50 N, 0.03 mm, 0.37 s, 75-90% force retention, 70 mm / 0.13 kg fingers, IP67 electronics / IP20 guides | [Schunk EGK 25](https://schunk.com/us/en/sistemi-di-presa/pinza-parallela/egk/egk-25-ei-m-b/p/000000000001491754) | confirmed |
| OnRobot RG2 110 mm, 3-40 N, 2 kg force-fit / 5 kg form-fit, automatic TCP and payload calculation | [OnRobot RG2](https://onrobot.com/en/products/rg2-gripper) | confirmed (page makes no food or washdown claim; used in a new fix) |
| Two-jaw parallel grippers are the most common; Machine Design September 2011, quoting a Schunk automation manager | [Machine Design 2011 grippers](https://www.machinedesign.com/markets/robotics/article/21833348/the-difference-between-robotic-grippers-with-parallel-three-finger-and-angled-designs) (secondary) | confirmed (Sept. 1, 2011; Jesse Hayes, Schunk automation group manager) |
| ATI QC-46: 70 kg, 0.0152 mm, 5800 N at 5.5 bar, 2.98 kg coupled, 2.5 mm no-touch gap, lock/unlock sensing, "a Novanta company" | [ATI QC-46](https://ati.novanta.com/product/qc-46/) | confirmed |
| ATI QC-510: 700 kg, 62,000 N at 5.5 bar, 28.1 kg, 0.0152 mm, ready sensors within 1.5 mm | [ATI QC-510](https://ati.novanta.com/product/tool-changers-qc-510/) | confirmed |
| ATI QC-160: 300 kg, 31,000 N, 0.0152 mm; no-touch gap 3.0 mm (features) vs 2 mm (table) | [ATI QC-160](https://ati.novanta.com/product/qc-160/) | confirmed, including the page's own inconsistency the fact checker noted |
| ATI Delta SI-165: 1/32 N X/Y, 1/16 N Fz; overload 4.1-18.8x; NIST-traceable; silicon gauges 75x foil; resolution after dropping four counts | [ATI Delta](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Delta) | confirmed |
| ATI Mini58: 700-2800 N X/Y, 1/6-3/4 N, smallest Fz resolution 7/24 N, overload 4.9-21x, IP60/65/68 | [ATI Mini58](https://www.ati-ia.com/products/ft/ft_models.aspx?id=Mini58) | confirmed |
| Master plate on robot, tool plate on tool; MC-16R uses a ratchet-knob manual lock for maintenance changes | [ATI QC-77 manual](https://www.ati-ia.com/app_content/Documents/9610-20-1669.pdf); [ATI MC-16R manual](https://www.ati-ia.com/app_content/Documents/9620-20-B-MC-16R%20Tool%20Changer%20Manual.pdf) (text extracted locally) | confirmed |

No spot-check failed. One caveat: the UR EOAT page uses its 1 kg box only as an example of fitting a tool to one task, not as a palletizing case. The Elsewhere text only says UR "uses" a 1 kg box example, so it was left as is.

## Area 4, Sensors: fact check

Summary line: 197 claims checked: 169 verified, 24 corrected, 4 unverifiable (1 kept flagged, 3 removed).

Of the 17 original `[unverified]` flags, 16 were resolved (13 now cited, 3 removed with their claims) and 1 is kept (SICK scanners). Status checked as of November 2026: Basler ace 2, RealSense D400 (sold by RealSense, Inc. under license from Intel), Zivid 2+/3, Basler blaze-101, Keyence SZ-V and PR-G, Livox Mid-360, Ouster OS1 (product page now shows the Rev8 family), Bosch BMI088 (page live; distributors out of stock), moveit_calibration (not archived; has a ros2 branch). Arithmetic in worked examples was recomputed; illustrative numbers were checked for plausibility.

Secondary sources kept (no primary loaded): Quality Magazine trade article (Edmund Optics page returned 403), OpenCV forum thread, Pepperl+Fuchs vendor blog, Cornell LII copy of 16 CFR 1211.8 (eCFR redirects bots).

### camera-2d

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | a2A1920-160ucBAS 1920 x 1200 default, about 2.3 MP | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 2 | 3.45 µm pixels | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 3 | 1/2.3-inch sensor | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 4 | 25 mm lens sees twice as wide at 600 mm as at 300 mm | verified | [Quality Magazine, Imaging Lens](https://qualitymag.com/articles/91115-imaging-lens) (secondary, trade press) | marked trade press in Sources |
| 5 | FOV ≈ sensor width x WD / focal length (pinhole) | verified | derivation; consistent with [Quality Magazine](https://qualitymag.com/articles/91115-imaging-lens) (secondary) | none |
| 6 | 164 fps on USB 3.0 | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 7 | 51 fps for IP67 GigE version | verified | [Basler a2A1920-51gcIP67](https://docs.baslerweb.com/a2a1920-51gcip67) | none |
| 8 | GigE carries fewer bits per second (5 vs 1 Gbit/s) | verified | [Basler 160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas), [Basler 51gcIP67](https://docs.baslerweb.com/a2a1920-51gcip67) | none |
| 9 | Exposure 19 µs to 10 s | verified | [Basler Exposure Time](https://docs.baslerweb.com/exposure-time) | none |
| 10 | Ultra-short mode 1-14 µs | verified | [Basler Exposure Time](https://docs.baslerweb.com/exposure-time) | none |
| 11 | Rolling shutter distorts fast-moving objects | verified | [Basler Electronic Shutter Types](https://docs.baslerweb.com/electronic-shutter-types) | none |
| 12 | Rolling shutter has significantly lower noise | corrected | [Basler Electronic Shutter Types](https://docs.baslerweb.com/electronic-shutter-types) | "noise" to "ambient noise", matching Basler wording |
| 13 | Rolling shutter sensors usually cheaper | unverifiable | Basler learning pages returned 406; Basler white paper PDF unreadable; Balluff 403 | removed (concept reads fine without it) |
| 14 | Basler recommends flash lighting against rolling-shutter effect | verified | [Basler Electronic Shutter Types](https://docs.baslerweb.com/electronic-shutter-types) | none |
| 15 | Keyence: lighting one of the most important factors | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 16 | Dome light removes glare on shiny/curved parts | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 17 | Backlight gives silhouette for outline measurement | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 18 | Low-angle light shows scratches and texture | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 19 | Complementary color makes object nearly black on mono camera | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 20 | Sensor 6.68 mm wide (1936 x 3.45 µm) | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) + arithmetic | none |
| 21 | 334 mm FOV, 0.17 mm/px at 600 mm, 12 mm lens (illustrative) | verified | arithmetic | none |
| 22 | Exposure under about 0.85 ms at 100 mm/s for half-pixel smear (illustrative) | verified | arithmetic (0.86 ms) | none |
| 23 | USB model is IP30 | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 24 | IP67 body, -10 to 60 C housing range | verified | [Basler a2A1920-51gcIP67](https://docs.baslerweb.com/a2a1920-51gcip67) | none |
| 25 | 2 m/s belt, 0.2 mm/px needs under 100 µs (illustrative) | verified | arithmetic | none |
| 26 | Rolling shutter skews a moving barcode | verified | [Basler Electronic Shutter Types](https://docs.baslerweb.com/electronic-shutter-types) | none |
| 27 | ace 2 in USB 3.0, GigE, IP67 GigE; 160ucBAS is 2.3 MP global shutter color | verified | [Basler 160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas), [Basler 51gcIP67](https://docs.baslerweb.com/a2a1920-51gcip67) | none |
| 28 | Sony IMX392 inside both models | verified | [Basler 160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas), [Basler 51gcIP67](https://docs.baslerweb.com/a2a1920-51gcip67) | none |
| 29 | C-mount lens mount | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 30 | Keyence guide covers ring, bar, dome, backlight, coaxial, low-angle | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 31 | 1920 x 1200 x 8 bit x 164 fps ≈ 3 Gbit/s, under USB 3.0 5 Gbit/s, about 3x GigE | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) + arithmetic | none |
| 32 | Products current (ace 2 models documented) | verified | [Basler docs](https://docs.baslerweb.com/a2a1920-160ucbas) | none |

### depth-camera

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | depth = focal length x baseline / disparity | verified | [librealsense Depth from Stereo](https://raw.githubusercontent.com/IntelRealSense/librealsense/master/doc/depth-from-stereo.md) | none |
| 2 | Stereo depth error grows with square of distance | corrected | [RealSense tuning guide](https://dev.realsenseai.com/docs/tuning-depth-cameras-for-best-performance) | was cited to librealsense doc [3], which does not say it; now cites new [6] |
| 3 | IR projector "sprays a dot pattern" on blank surfaces | corrected | [librealsense Depth from Stereo](https://raw.githubusercontent.com/IntelRealSense/librealsense/master/doc/depth-from-stereo.md) | reworded to "paints an invisible texture" (source says texture outside visible spectrum, not dots) |
| 4 | Minimum range exists; scales with resolution | verified | [RealSense tuning guide](https://dev.realsenseai.com/docs/tuning-depth-cameras-for-best-performance) | citation [6] added, "grows with image resolution" added |
| 5 | D435 min range about 28 cm at full resolution | verified | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | none |
| 6 | D405 min range 7 cm | verified | [RealSense D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) | none (page says 7 cm at 480p) |
| 7 | MR60 80 µm point precision "at a 350-900 mm optimal distance" | corrected | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | page lists precision and optimal distance separately; reworded to "80 µm ... and a 350-900 mm optimal working distance" |
| 8 | Structured light scene must hold still (capture time) | verified | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | flag removed; range added: 25-1500 ms typical capture time for 2+ models |
| 9 | blaze-101 ±5 mm over 0.5-5.5 m | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 10 | blaze-101 640 x 480 | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 11 | Accuracy test: 90% white target, no ambient light, 22 C, 20 min warm-up | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 12 | Dark, shiny, wet, transparent items measure worse | corrected | [Zivid shiny objects](https://support.zivid.com/academy/camera/capturing-high-quality-point-clouds/dealing-with-highlights-and-shiny-objects.html), [Zivid transparent objects](https://support.zivid.com/en/latest/camera/academy/camera/capturing-high-quality-point-clouds/dealing-with-transparent-objects.html) | flag removed; rewritten to what Zivid documents (shiny saturates pixels, transparent surfaces missed or measured behind); "dark" dropped (no source) |
| 13 | MR60 at 600 mm: 570 x 460 mm, 0.24 mm spacing | verified | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | none |
| 14 | D405 ±2% at 50 cm ≈ ±10 mm | verified | [RealSense D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) + arithmetic | none |
| 15 | Error at 20 cm several times smaller than at 50 cm | verified | arithmetic ((20/50)² = 0.16) | none |
| 16 | Zivid IP65 | verified | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | none |
| 17 | D405 page lists no IP rating | verified | [RealSense D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) | none |
| 18 | blaze-101 range 0.3-10 m | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 19 | blaze-101 IP67 | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 20 | D435 ideal range 0.3-3 m | verified | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | none |
| 21 | D435 global shutter depth sensors | verified | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | none |
| 22 | D435 under 2% at 2 m | verified | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | none |
| 23 | Sold by RealSense, Inc. under license from Intel (2026) | verified | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | none |
| 24 | D405 range 7-50 cm | verified | [RealSense D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) | none |
| 25 | Zivid models MR60, MR130, LR110 (2+), XL250 (3) | verified | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | none |
| 26 | librealsense is the open-source SDK; doc explains stereo | verified | [librealsense Depth from Stereo](https://raw.githubusercontent.com/IntelRealSense/librealsense/master/doc/depth-from-stereo.md) | none |
| 27 | Zivid 2+ precision 80-260 µm over 300-2700 mm | verified | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | none |
| 28 | blaze-101 under 1 mm temporal noise | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 29 | 942.8 px, 54.8 mm, 0.1 px gives about 2 mm at 1 m, 8 mm at 2 m | verified | [librealsense Depth from Stereo](https://raw.githubusercontent.com/IntelRealSense/librealsense/master/doc/depth-from-stereo.md) + arithmetic (1.9, 7.7 mm) | none |

### lidar

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Lidar fires pulses and times echoes | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs), [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | none (definitional) |
| 2 | Hundreds of thousands of measurements per second (Plain) | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) (200,000 points/s) | none |
| 3 | OS1 128 channels over 45° vertical FOV | verified | [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | none |
| 4 | OS1 has several beam-spacing layouts | verified | [OS1 manual overview](https://static.ouster.dev/sensor-docs/hw_user_manual_OS1/hw_common_sections_OS1/os1-overview.html) | none |
| 5 | Mid-360 40 m at 10%, 70 m at 80% | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 6 | OS1 90 m at 10% | verified | [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | none |
| 7 | 0.35° spacing lands about 120 mm apart at 20 m | verified | arithmetic (45/127 = 0.354°, 124 mm) | none |
| 8 | Mid-360 precision at most 2 cm at 10 m | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 9 | Mid-360 0.1 m blind zone | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 10 | Mid-360 typical 10 Hz | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 11 | SZ-V32N Type 3 AOPDDR under IEC 61496-3 | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none |
| 12 | SZ-V32N PL d, Category 3 under ISO 13849-1 | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none |
| 13 | Protective and warning fields | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none |
| 14 | 8.4 m for 70-150 mm objects, 1.6 m for 20 mm | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none (standard mode figures) |
| 15 | Response time "starts at 80 ms" | corrected | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | 80 ms is high-speed mode only (range drops to 5.7 m); 160 ms in standard mode; up to 1408 ms; range added in Key numbers (80-1408 ms) |
| 16 | Each millisecond of response time adds safety distance (ISO 13855) | verified | [Keyence safety distance](https://keyence.com/ss/products/safetyknowledge/caution/scanner) | flag removed; added 1600 mm/s approach speed, so 1.6 mm per ms; new source [5] |
| 17 | Cheese-line scanner zone about 1.2 m deep (illustrative) | corrected | [Keyence safety distance](https://keyence.com/ss/products/safetyknowledge/caution/scanner) | implausible under ISO 13855 (the C term alone is about 1.08 m at 300 mm beam height); changed to about 2 m, citing Keyence's 2.1 m worked example |
| 18 | SZ-V IP65 | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none |
| 19 | AMR carries a 2D safety scanner that both maps and stops | corrected | [Omron LD series](https://industrial.omron.eu/en/products/ld-series) | flag removed; reworded to what Omron states (natural-feature navigation, onboard lasers detect obstacles and trigger a stop by speed); new source [6] |
| 20 | OS1 up to 10.4 M points/s, 90 m on dark targets | verified | [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | none |
| 21 | SZ-V 190°, 905 nm Class 1 laser | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none |
| 22 | Mid-360 360° x 59°, IP67, built-in IMU | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 23 | SICK microScan3 and nanoScan3 are widely used safety scanners | unverifiable | sick.com product pages render empty; datasheet PDFs 404 or unreadable | kept flagged, reason updated |
| 24 | Mid-360 lists no safety rating | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none (only laser eye-safety Class 1) |
| 25 | Key number: protective range 1.6-8.4 m | corrected | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | qualified as standard mode; added 1.1-5.7 m in high-speed mode |
| 26 | OS1 shot limiting at 52 C, up to 20% loss | verified | [OS1 manual overview](https://static.ouster.dev/sensor-docs/hw_user_manual_OS1/hw_common_sections_OS1/os1-overview.html) | none |
| 27 | 0.1° spacing gives about 17 mm gaps at 10 m | verified | arithmetic (17.5 mm) | none |
| 28 | Smaller objects detected only at shorter range because beams spread | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) (range by object size) + geometry | none |
| 29 | Products current (OS1 page shows Rev8, Mid-360 and SZ-V listed) | verified | [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | none |

### photo-eye

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Emitter is usually an LED | corrected | [Keyence photoelectric basics](https://www.keyence.com/ss/products/sensor/sensorbasics/photoelectric/info/), [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | Keyence says visible or infrared light; reworded to that, with "on the PR-G a red LED" [2] |
| 2 | Through-beam: separate housings, object blocks beam | verified | [Keyence photoelectric basics](https://www.keyence.com/ss/products/sensor/sensorbasics/photoelectric/info/) | none |
| 3 | Through-beam reaches farthest and is hardest to fool | verified | [Banner Photoelectric Sensor Solutions](https://info.bannerengineering.com/cs/groups/public/documents/literature/b_51180814.pdf) | added reason (color and finish do not matter) with new source [7] |
| 4 | PR-G through-beam 30 m | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 5 | Retroreflective: one housing plus reflector | verified | [Keyence photoelectric basics](https://www.keyence.com/ss/products/sensor/sensorbasics/photoelectric/info/) | none |
| 6 | PR-G retroreflective 0.1-4.2 m (with R-2L) | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 7 | Diffuse is called "reflective" by Keyence | verified | [Keyence photoelectric basics](https://www.keyence.com/ss/products/sensor/sensorbasics/photoelectric/info/) | none |
| 8 | PR-G diffuse 500 mm | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 9 | Diffuse sees dark or steeply angled surfaces less reliably | corrected | [Banner Photoelectric Sensor Solutions](https://info.bannerengineering.com/cs/groups/public/documents/literature/b_51180814.pdf) | flag removed; now "range shrinks sharply on dark or low-reflectivity targets"; "angled" dropped (no source) |
| 10 | PR-G response 0.5-1 ms | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 11 | 1 ms at 200 mm/s is 0.2 mm | verified | arithmetic | none |
| 12 | PLC usually adds more delay than the sensor; reads inputs once per cycle | corrected | [Beckhoff TwinCAT 3 Real-Time](https://infosys.beckhoff.com/content/1033/tc3_grundlagen/6828869003.html) | flag removed; once-per-cycle input copy now cited [4]; "usually more than the sensor" dropped (no cycle-time source) |
| 13 | Inductive: coil, HF field, eddy currents weaken oscillation; detects metal | verified | [Keyence proximity basics](https://www.keyence.com/ss/products/sensor/sensorbasics/proximity/info/) | wording aligned to source (load the circuit, oscillation attenuates) |
| 14 | Inductive ignores water and food debris | unverifiable | Omron technical guides return 403; Keyence page silent | removed |
| 15 | Inductive works over a few millimeters | corrected | [Keyence EV specs](https://www.keyence.com/products/sensor/proximity/ev/specs/) | flag removed; range added: 1.5-27 mm across EV series depending on sensor size; new source [5] |
| 16 | PR-G IP68 and IP69K, 316L housings | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 17 | Clear plastic passes light with little loss; use a transparent-object sensor | verified | [Pepperl+Fuchs blog](https://blog.pepperl-fuchs.com/en/2025/reliable-object-and-transparency-detection-photoelectric-sensors-in-packaging-technology/) (secondary, vendor blog) | flag removed; added 5-10% attenuation and polarizing reflector; new source [8] |
| 18 | Garage door photo-eye reverses a closing door | verified | [16 CFR 1211.8 (Cornell LII)](https://www.law.cornell.edu/cfr/text/16/1211.8) (secondary copy of regulation) | flag removed; reworded to the regulation's wording; "near the floor" and "child or pet" dropped; new source [9] |
| 19 | Inductive sensors detect steel (welding fixture example) | verified | [Keyence proximity basics](https://www.keyence.com/ss/products/sensor/sensorbasics/proximity/info/) | none |
| 20 | Photo-eyes answer in about a millisecond | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 21 | R-2L is the reflector for PR-G retro range | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 22 | Inductive sensors use HF oscillation, sold by Keyence | verified | [Keyence proximity basics](https://www.keyence.com/ss/products/sensor/sensorbasics/proximity/info/) | none |
| 23 | Precise-timing systems use inputs that record the moment of change | verified | [Beckhoff EL1252](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el1xxx-digital-input/el1252.html) | flag removed; named EL1252 with 1 ns timestamp resolution; new source [6] |
| 24 | "The sensor is usually the fastest link" | corrected | none supports a general ranking | softened to "often not the slowest link" |
| 25 | Input filters and network transfers add delay | corrected | [Beckhoff EL1252](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el1xxx-digital-input/el1252.html) | kept input filters (cited); removed network transfers (no source) |
| 26 | PR-G still listed (status) | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |

### imu

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Accelerometer measures acceleration incl. gravity; gyro measures rotation rate | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/), [VectorNav IMU specs](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) | none (definitional) |
| 2 | Robot IMUs are MEMS parts | corrected | [TDK ICM-40609-D](https://invensense.tdk.com/products/motion-tracking/6-axis/icm-40609-d/) | softened to "usually"; cited TDK's "6-axis MEMS" description; new source [5] |
| 3 | BMI088 aimed at drones and robots | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none |
| 4 | BMI088 up to ±24 g and ±2000 °/s | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none |
| 5 | BMI088 ODR 12.5 Hz to 2 kHz | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none |
| 6 | Mid-360 carries an ICM40609 | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 7 | ICM-40609 is a 6-axis MEMS part (TDK) | verified | [TDK ICM-40609-D](https://invensense.tdk.com/products/motion-tracking/6-axis/icm-40609-d/) | added |
| 8 | D435i includes an IMU | verified | [RealSense D435i](https://realsenseai.com/products/depth-camera-d435i/) | none |
| 9 | Camera/lidar frames arrive 10-90 times a second | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) (10 Hz), [RealSense D435i](https://realsenseai.com/products/depth-camera-d435i/) (up to 90 fps) | citations [3][4] added |
| 10 | Bias is a constant offset | verified | [VectorNav IMU specs](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) | none |
| 11 | Bias instability is drift at constant temperature | verified | [VectorNav IMU specs](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) | none |
| 12 | Angle random walk grows with square root of time | verified | [VectorNav IMU specs](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) | none |
| 13 | BMI088 lifetime gyro offset ±1 °/s, so 60° per minute uncorrected | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) + arithmetic | none |
| 14 | 1 mg bias gives about 0.5 m after 10 s | verified | arithmetic (0.49 m) | none |
| 15 | Mobile robots blend IMU with encoders, lidar, cameras | verified | [robot_localization docs](https://github.com/cra-ros-pkg/robot_localization/blob/rolling-devel/doc/index.rst) | flag removed; cited robot_localization fusion of IMUs and odometry; new source [6] |
| 16 | 0.2° at 600 mm moves aim about 2 mm (illustrative) | verified | arithmetic (2.09 mm) | none |
| 17 | ±20 mg accel offset equals about ±1.1° tilt | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) + arithmetic (1.15°) | none |
| 18 | AMR wheel slip: gyro corrects heading | verified | [robot_localization docs](https://github.com/cra-ros-pkg/robot_localization/blob/rolling-devel/doc/index.rst) | flag removed; tied to odometry-plus-IMU fusion |
| 19 | Humanoid uses torso IMU to sense tipping | corrected | [Ficht and Behnke, arXiv 2208.04757](https://arxiv.org/abs/2208.04757) | flag removed; now "a balance controller needs only a 6-axis IMU plus joint encoders"; "torso" dropped (not in abstract); new source [7] |
| 20 | IMU measures hundreds to thousands of times a second | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none |
| 21 | BMI088 is a "6-axis MEMS IMU" | corrected | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | Bosch page does not say MEMS; reworded to "accelerometer-plus-gyroscope IMU" |
| 22 | Gyro noise 0.014 °/s/√Hz = 0.014 °/√s ARW, about 0.14° after 100 s | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/), [VectorNav IMU specs](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) + arithmetic | none |
| 23 | Ranges ±3 to ±24 g and ±125 to ±2000 °/s selectable | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none |
| 24 | BMI088 status | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none (page live; listed distributors out of stock) |
| 25 | Drift from constant bias = ½ x bias x time² | verified | kinematics | none |

### camera-calibration

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | 3 x 3 matrix: fx, fy in pixels; cx, cy principal point near center | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 2 | Radial k1, k2, k3: barrel or pincushion, growing toward edges | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 3 | Tangential p1, p2: lens not parallel to sensor | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) names the terms; physical explanation is in OpenCV's Python calibration tutorial | none |
| 4 | Intrinsics valid while focal length fixed; scale with image | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 5 | Zhang 2000: planar target, at least two orientations | verified | [Zhang, Microsoft Research](https://www.microsoft.com/en-us/research/publication/a-flexible-new-technique-for-camera-calibration/) | none (TPAMI vol. 22, 2000) |
| 6 | Closed-form guess then nonlinear refinement | verified | [Zhang, Microsoft Research](https://www.microsoft.com/en-us/research/publication/a-flexible-new-technique-for-camera-calibration/) | none |
| 7 | calibrateCamera uses Levenberg-Marquardt on reprojection error | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 8 | Returns overall RMS reprojection error | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 9 | calibrateCamera also returns per-image error and parameter uncertainty | corrected | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | those outputs (perViewErrors, stdDeviationsIntrinsics) come from calibrateCameraExtended; fixed in Precise and Misconception |
| 10 | MathWorks example 0.19 px | verified | [MathWorks accuracy](https://www.mathworks.com/help/vision/ug/evaluating-the-accuracy-of-single-camera-calibration.html) | none |
| 11 | Forum case 112 px to about 0.31 px after fixing point order | verified | [OpenCV forum](https://forum.opencv.org/t/cannot-get-good-camera-calibration/1270) (secondary) | marked as user discussion in Sources |
| 12 | ChArUco corners identifiable with part of board out of view | verified | [OpenCV ChArUco tutorial](https://github.com/opencv/opencv/blob/4.x/doc/tutorials/objdetect/charuco_detection/charuco_detection.markdown) | old source (aruco_board.hpp) did not state it; replaced [3] with the OpenCV tutorial |
| 13 | ChArUco combines marker versatility with chessboard precision | verified | [OpenCV ChArUco tutorial](https://github.com/opencv/opencv/blob/4.x/doc/tutorials/objdetect/charuco_detection/charuco_detection.markdown) | none |
| 14 | OpenCV advises many tilted poses across working distances | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 15 | Board should reach image corners | verified | [OpenCV forum](https://forum.opencv.org/t/cannot-get-good-camera-calibration/1270) (secondary) | none |
| 16 | Board should be flat | corrected | [MathWorks Calibration Patterns](https://www.mathworks.com/help/vision/ug/calibration-patterns.html) | was cited to forum, which does not discuss flatness; now cites new [6] |
| 17 | Measure squares, do not trust the printer | verified | [OpenCV forum](https://forum.opencv.org/t/cannot-get-good-camera-calibration/1270) (secondary), [MathWorks Calibration Patterns](https://www.mathworks.com/help/vision/ug/calibration-patterns.html) | primary [6] added |
| 18 | 12 mm, 3.45 µm: fx ≈ 3478 px; 0.17 mm/px at 600 mm | verified | arithmetic | none |
| 19 | Principal point uncertainty about 5 px in MathWorks example | verified | [MathWorks accuracy](https://www.mathworks.com/help/vision/ug/evaluating-the-accuracy-of-single-camera-calibration.html) (±5.3, ±3.2 px) | none |
| 20 | 5 px shift gives about 0.9 mm at 600 mm | verified | arithmetic (0.86 mm) | none |
| 21 | Uncalibrated errors of "several millimeters" | unverifiable | no source for a general figure | number removed; now "errors that grow toward the edges" |
| 22 | 0.2-0.3 px RMS ≈ 0.05 mm on board (illustrative) | verified | arithmetic | none |
| 23 | Camera calibrated warm may shift when cold | verified | [Smith and Cope, ISPRS 2010](https://www.isprs.org/proceedings/XXXVIII/part5/papers/158.pdf) | flag removed; added about 0.03 mm focal length change over 30 C and largest principal point shifts below 5-10 C; new source [7] |
| 24 | Surgical stereo endoscope must be calibrated for 3D measurement | verified | [Hardner et al., ISPRS 2022](https://isprs-archives.copernicus.org/articles/XLIII-B2-2022/679/2022/) | flag removed; added self-heating drift finding; "surgical robot" generalized to keyhole surgery; new source [8] |
| 25 | Flat-on views at one distance let focal length and distortion trade off [1][5] | corrected | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp), [Zhang](https://www.microsoft.com/en-us/research/publication/a-flexible-new-technique-for-camera-calibration/) | neither cited source states the trade-off; reworded to what they do say (tilted views across range; differently oriented views) |
| 26 | Distortion terms: 5 common, up to 14 | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 27 | Minimum 2 orientations in theory | verified | [Zhang, Microsoft Research](https://www.microsoft.com/en-us/research/publication/a-flexible-new-technique-for-camera-calibration/) | none |
| 28 | calib3d has calibrateCamera, findChessboardCorners, solvePnP, projectPoints, undistort | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 29 | CharucoBoard, CharucoDetector, matchImagePoints in objdetect (4.x) | verified | [OpenCV ChArUco tutorial](https://github.com/opencv/opencv/blob/4.x/doc/tutorials/objdetect/charuco_detection/charuco_detection.markdown) | none |
| 30 | MATLAB toolbox gives reprojection plots and standard errors | verified | [MathWorks accuracy](https://www.mathworks.com/help/vision/ug/evaluating-the-accuracy-of-single-camera-calibration.html) | none |
| 31 | Code sketch API (CharucoBoard args, detectBoard 4 outputs, matchImagePoints with ChArUco corners, calibrateCamera tuple) | verified | [OpenCV aruco_board.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/objdetect/include/opencv2/objdetect/aruco_board.hpp), [charuco_detector.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/objdetect/include/opencv2/objdetect/charuco_detector.hpp), [aruco_board.cpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/objdetect/src/aruco/aruco_board.cpp) | none |
| 32 | mm per pixel ≈ WD x pixel / focal length | verified | arithmetic (pinhole model) | none |

### hand-eye-calibration

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Eye-in-hand and eye-to-hand setups | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 2 | Gripper pose from robot kinematics; board pose by PnP | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 3 | Problem is solving AX = XB | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 4 | Five solvers: Tsai, Park, Horaud separable; Andreff, Daniilidis simultaneous | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 5 | Tsai-Lenz 1989 built to be fully automatic | verified | [IBM Research record](https://research.ibm.com/publications/a-new-technique-for-fully-autonomous-and-efficient-3d-robotics-handeye-calibration) | none (IEEE Trans. Robotics and Automation, 1989) |
| 6 | Final computation takes a few milliseconds | verified | [IBM Research record](https://research.ibm.com/publications/a-new-technique-for-fully-autonomous-and-efficient-3d-robotics-handeye-calibration) | none |
| 7 | At least 2 motions with non-parallel axes, so 3 poses; many more recommended | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 8 | Zivid suggests 10-20 pose pairs | verified | [Zivid dataset guide](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-getting-good-dataset.html) | none |
| 9 | Eye-to-hand: pass inverted robot poses, get camera pose in base frame | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 10 | calibrateRobotWorldHandEye solves AX = ZB for camera-to-gripper and base-to-world | corrected | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | outputs are R/t_base2world and R/t_gripper2cam; "camera-to-gripper" changed to "gripper-to-camera" |
| 11 | Robots are repeatable but not inherently accurate | verified | [Zivid cautions](https://support.zivid.com/academy/applications/hand-eye/cautions-and-recommendations.html) | none |
| 12 | Temperature affects robot and camera | verified | [Zivid cautions](https://support.zivid.com/academy/applications/hand-eye/cautions-and-recommendations.html) | none |
| 13 | 0.1° at 600 mm ≈ 1 mm; 0.5° ≈ 5 mm | verified | arithmetic (1.05, 5.2 mm) | none |
| 14 | Residuals: sub-mm (smaller robots), mm (larger), sub-degree rotation | verified | [Zivid verification](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-verification.html) | none |
| 15 | Good residuals do not guarantee accuracy; touch test | verified | [Zivid verification](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-verification.html) | none |
| 16 | 0.3° at 600 mm uses about 3 mm (illustrative) | verified | arithmetic (3.1 mm) | none |
| 17 | Redo after camera remount or robot recalibration | corrected | [Zivid cautions](https://support.zivid.com/academy/applications/hand-eye/cautions-and-recommendations.html) | Zivid says "robot loses calibration"; wording aligned |
| 18 | 0.1° at 1.5 m ≈ 2.6 mm | verified | arithmetic | none |
| 19 | MoveIt Calibration developed and tested on Melodic and Noetic | corrected | [moveit_calibration](https://github.com/moveit/moveit_calibration) | status: both are ROS 1; repo also has a ros2 branch with colcon build instructions; added |
| 20 | MoveIt Calibration recommends ChArUco | verified | [moveit_calibration](https://github.com/moveit/moveit_calibration) | none |
| 21 | Zivid hand-eye workflow with dataset guidance and verification tools | verified | [Zivid dataset guide](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-getting-good-dataset.html), [Zivid verification](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-verification.html) | none |
| 22 | Warm up and calibrate under operating conditions | verified | [Zivid cautions](https://support.zivid.com/academy/applications/hand-eye/cautions-and-recommendations.html) | none |
| 23 | Code sketch: calibrateHandEye argument order, CALIB_HAND_EYE_* names | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 24 | moveit_calibration maintained (status) | verified | [moveit_calibration](https://github.com/moveit/moveit_calibration) | none (not archived; last push December 2025) |

## Area 4, Sensors: analogy and precision review

Scope: all 7 concepts in `knowledge/04-sensors.md`. WebSearch quota ran out partway through. All sources below were loaded directly with WebFetch. `build-content.mjs --check` passes with 0 warnings and 0 errors.

### Analogies

| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| camera-2d | kept | — (photo booth teaches the core lesson: fix the geometry and lighting so any difference is real; the breaks section covers moving subjects and the lack of depth) | — |
| depth-camera | kept | — (two-eyes parallax correctly predicts that close things shift more and that depth gets worse with distance; the breaks section covers non-stereo types and holes on shiny or clear surfaces) | — |
| lidar | kept | — (canyon echo correctly predicts time-of-flight ranging and that it works in the dark; the breaks section covers narrow beams and gaps between beams) | — |
| photo-eye | kept (breaks rewritten) | The doorway beam suggests the sensor catches anything that passes. A clear lid barely dims the beam, and diffuse types lose range on dark items. The old breaks section skipped this, though it is the line's real failure mode. | — |
| imu | kept (one word changed) | "Slowly loses track" understated drift: position error grows with time squared, so the IMU is wrong within seconds. Now "soon loses track of where it has gone". | — |
| camera-calibration | rewritten | An eyeglass prescription is about blur. A reader would predict that calibration sharpens images or fixes a focus problem. It does neither: it measures where each point lands on the sensor. | Graph paper behind a warped window: known straight lines reveal how the glass bends the view. The breaks section says one straight-on look gives the bending but not the zoom or the image center, so the board must be tilted at several angles. |
| hand-eye-calibration | kept | — (friend on the phone correctly predicts that you need both position and facing, and that a facing error grows with distance, which is the lever-arm rule) | — |

### Other fixes

- camera-2d: Added triggered acquisition (a signal on an input line starts each picture) with a new Basler source [7]. The Plain promised "on cue", but the Precise never explained how.
- camera-2d: Defined "pinhole camera model" and glossed "ambient noise" in plain words.
- camera-2d: The cheese example used 1936 px while the Precise used 1920 px. Both now use 1920 px (field of view about 330 mm, still 0.17 mm/px).
- camera-2d: The cheese example implied IP67 is enough for washdown. Added that IP67 is a dunk test, not a pressure-washer test [8, Wikipedia IP code, secondary], so the camera is shielded during sanitation. This matches the depth-camera and lidar examples. Linked [[ip-rating]].
- camera-2d: The misconception illustrated "more pixels lower frame rate" with the same sensor on two cables, which shows cable bandwidth, not pixel count. Reworded to the 51 fps GigE limit and the halving you would get with twice the pixels.
- camera-2d: Added a connects-to entry for [[photo-eye]] as the usual trigger source.
- depth-camera: "Visible texture" became "surface texture (spots, edges, grain)". Defined "modulated" and "saturate".
- depth-camera: The apple-station error at 20 cm went from "several times smaller" to "about six times smaller, roughly ±1.6 mm", labeled as an estimate.
- lidar: The Precise explained only the 1.6 mm per ms term, which leaves the reader unable to see why the zone is 2 m. It now defines safety distance and gives the ISO 13855 reach allowance (C = 1200 - 0.4H, so 1080 mm at a 300 mm scan plane) from Keyence [5].
- lidar: The cheese example now breaks Keyence's 2.1 m worked example into its parts: 0.09 s scanner, 0.5 s machine stop, 1080 mm reach allowance, 100 mm tolerance. Key numbers updated to match.
- lidar and imu: The lidar section said a mobile robot "would" exist, while the IMU section said "the mobile robot" does. Both now describe the same illustrative tote-delivery mobile robot.
- photo-eye: The Plain said "a proximity sensor" detects metal. Capacitive proximity sensors detect non-metals too, so it now says "a metal-detecting proximity sensor".
- photo-eye: Defined "oscillation".
- photo-eye: The cheese example had the tray photo-eye triggering the pick-station camera. That camera images the ingredient infeed, not the tray. Now the photo-eye gates the robot's place, and the inspection camera is the one that is triggered.
- imu: Added that an accelerometer cannot tell gravity from the robot's own acceleration, so motion shows up as false tilt. Also added how gyro and accelerometer are blended (attitude estimator, Kalman filter), with a new VectorNav AHRS source [8]. Without this, "trusted for tilt" was oversimplified.
- imu: Defined "state estimators".
- imu: The cheese example implied that the D435i contains a BMI088. It now calls the BMI088 a typical MEMS part. Added a same-temperature caveat (±0.2 mg/C offset drift [1], so about 17 C of warming fakes a 0.2° shift) and the fact that the check works only because the camera is still. Added offset temperature drift to Key numbers.
- camera-calibration: Defined barrel/pincushion, "closed-form", and "nonlinear optimization". Levenberg-Marquardt was defined as "an iterative least-squares solver", which is jargon defined with jargon; it now has a plain gloss.
- camera-calibration: "Its largest principal point shifts below 5-10 C" was ambiguous. It now says the largest shifts came when the camera was colder than about 5-10 C, which is the room's range. Checked against the paper's text.
- hand-eye-calibration: Defined "transform" inline and glossed "repeatable but not accurate".
- hand-eye-calibration: The cup-on-wedge slack said ±5 mm, but (35 - 20) / 2 = 7.5 mm. Now says ±7.5 mm before the edge hangs off, about ±5 mm with a seal margin.

### Spot-checks of the fact check

| Claim | Source opened | Result |
|---|---|---|
| SZ-V32N: 8.4 m for 70-150 mm, 1.6 m for 20 mm; 160 ms standard, 80 ms high-speed, 1408 ms max; 190°; IP65; 905 nm Class 1; Type 3 AOPDDR; PLd Cat 3 | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | confirmed (high-speed range 5.7 m; high-speed max is 704 ms) |
| Livox Mid-360: 40 m at 10%, 70 m at 80%, 0.1 m blind zone, ≤2 cm at 10 m, 10 Hz, IP67, ICM40609 IMU | [Livox Mid-360 specs](https://www.livoxtech.com/mid-360/specs) | confirmed |
| Ouster OS1: 128 channels, 45° vertical FOV, 90 m at 10%, 10.4 M points/s, Rev8 | [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | confirmed |
| RealSense D435: 0.3-3 m, about 28 cm Min-Z, under 2% at 2 m, global shutter, sold by RealSense, Inc. under Intel license | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | confirmed |
| RealSense D405: 7-50 cm, 7 cm Min-Z (at 480p), ±2% at 50 cm, no IP rating listed | [RealSense D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) | confirmed |
| Zivid 2+ MR60: 80 µm, 350-900 mm, 570 x 460 mm and 0.24 mm at 600 mm, 25-1500 ms, IP65; 2+ range 80-260 µm | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | confirmed |
| Basler blaze-101: 640 x 480, 0.3-10 m, ±5 mm over 0.5-5.5 m, <1 mm noise, 90% target / no ambient / 22 C / 20 min warm-up, IP67 | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | confirmed |
| BMI088: ±24 g, ±2000 °/s, 12.5 Hz-2 kHz, 0.014 °/s/√Hz, "up to" ±1 °/s and ±20 mg lifetime offset | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | partly failed: numbers right, but Bosch lists the offsets as typical (typ.), not as maximums. "Up to" changed to "typical" in the Precise and Key numbers. |
| Keyence PR-G: 30 m through-beam, 0.1-4.2 m retro with R-2L, 500 mm diffuse, 0.5-1 ms, IP68/IP69K, SUS 316L | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | confirmed (316L stated for rectangular models) |
| Beckhoff EL1252 1 ns timestamp resolution | [Beckhoff EL1252](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el1xxx-digital-input/el1252.html) | confirmed (accuracy 10 ns between channels) |
| a2A1920-160ucBAS: 1920 x 1200, 3.45 µm, 1/2.3", 164 fps, IMX392, C-mount, IP30; rolling shutter "ambient noise" wording | [Basler 160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas), [Basler shutter types](https://docs.baslerweb.com/electronic-shutter-types) | confirmed |
| MathWorks 0.19 px; principal point ±5.3 / ±3.2 px | [MathWorks accuracy](https://www.mathworks.com/help/vision/ug/evaluating-the-accuracy-of-single-camera-calibration.html) | confirmed |
| Zivid hand-eye 10-20 pose pairs | [Zivid dataset guide](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-getting-good-dataset.html) | confirmed |
| Smith and Cope: about 0.03 mm focal length change over 30 C; principal point shifts at low temperature | [ISPRS 2010 PDF](https://www.isprs.org/proceedings/XXXVIII/part5/papers/158.pdf) | confirmed (wording clarified, see Other fixes) |
| Keyence ISO 13855 example: K = 1600 mm/s, C = 1200 - 0.4H, S about 2124 mm | [Keyence safety distance](https://keyence.com/ss/products/safetyknowledge/caution/scanner) | confirmed |

New sources added: Basler Triggered Image Acquisition (camera-2d [7]), Wikipedia IP code (camera-2d [8], secondary), VectorNav AHRS primer (imu [8], vendor primer).

## Area 5, Compute and electronics: fact check

Summary line: 129 claims checked: 104 verified, 13 corrected, 12 unverifiable (7 kept flagged, 5 removed).

Notes on method. Every cited URL in the file was loaded and checked against the sentence that cites it. Generic explanations of how something works (for example "drives run faster current loops between setpoints") are not itemized; specific facts, numbers, dates, product names, standard clauses and company status are. Of the 14 `[unverified]` flags in the file before this pass, 9 were resolved (verified or corrected) and 5 are still flagged; 2 new flags were added where a cited source did not support a claim and no other source loaded. The web-search quota ran out partway through; later checks used direct fetches of known URLs and the Wikipedia API. Several vendor sites (Rockwell, Pilz, Siemens support, CODESYS, ABB product pages) returned 403, 429 or timeouts to automated fetches, which drives most of the remaining unverifiable rows. "secondary" marks Wikipedia, trade press, mirrors and third-party documentation.

### robot-controller

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Controller cabinet holds amplifiers and I/O; larger FANUC cabinets give more room | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) | none |
| 2 | R-30iB Plus comes in several cabinet sizes (Mate, A, B) | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) | none |
| 3 | R-50iA uses a new six-channel amplifier | corrected | [FANUC R-50iA product page](https://www.fanucamerica.com/products/controller-series/r-50ia) | press release [4] says "new amplifier" but not six-channel; re-cited to the product page, added as source 8 |
| 4 | UR e-Series and UR Series real-time loop 500 Hz (2 ms) | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 5 | RTDE on TCP port 30004 | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 6 | KUKA RSI: 12 ms normal, 4 ms fast | verified | [Quanser RSI docs](https://docs.quanser.com/quarc/documentation/kuka_rsi_block.html) (secondary); [KUKA RSI page](https://www.kuka.com/en-de/products/robot-systems/software/hub-technologies/kuka_robotsensorinterface) | added KUKA primary (4 ms) as source 9; Quanser labeled third-party |
| 7 | RSI available on KR C4 and KR C5 | verified | [Quanser RSI docs](https://docs.quanser.com/quarc/documentation/kuka_rsi_block.html) (secondary) | none |
| 8 | Pendant has an e-stop and a three-position enabling switch | verified | [KUKA smartPAD](https://kuka.com/en-de/products/robot-systems/robot-controllers/kuka-smartpad-pro); [OSHA OTM IV-4](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) | OSHA does not mention the pendant e-stop; added KUKA smartPAD as source 10 |
| 9 | Releasing or squeezing the enabling switch stops motion | verified | [OSHA OTM IV-4](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) | none (OSHA cites ANSI/RIA R15.06-2012) |
| 10 | Manual mode runs at reduced speed | verified | [OSHA OTM IV-4](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) | range added: 250 mm/s or less |
| 11 | FANUC Dual Check Safety monitors zones and speeds | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) | none |
| 12 | R-50iA runs Python scripts and software PLC logic | verified | [FANUC R-50iA press release](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) | none |
| 13 | Controllers speak EtherNet/IP, PROFINET, OPC UA | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) | none |
| 14 | 200 plates/h gives 18 s per plate | verified | arithmetic (3600 / 200) | none |
| 15 | R-50iA announced in the US in August 2024 | verified | [FANUC R-50iA press release](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) | source date made exact (27 August 2024) |
| 16 | R-50iA certified to IEC 62443 (source annotation) | verified | [FANUC R-50iA press release](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) | none (IEC 62443-4-1 and 4-2) |
| 17 | Both FANUC families use the iPendant and Mate, A, B cabinets | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus); [FANUC R-50iA](https://www.fanucamerica.com/products/controller-series/r-50ia) | none |
| 18 | KR C5 is current, KR C4 older, both use smartPAD | verified | [KUKA smartPAD](https://kuka.com/en-de/products/robot-systems/robot-controllers/kuka-smartpad-pro); [Quanser](https://docs.quanser.com/quarc/documentation/kuka_rsi_block.html) (secondary) | citation added |
| 19 | ABB OmniCore programmed with the FlexPendant | verified | [ABB OmniCore operating manual](https://www.manualslib.com/manual/2131954/Abb-Omnicore.html) (secondary mirror) | source 11 added; abb.com timed out |
| 20 | ABB agreed Oct 2025 to sell robotics to SoftBank, close mid-to-late 2026 | verified | [SoftBank press release](https://group.softbank/en/news/press/20251008) | none |
| 21 | Deal status as of Nov 2026 | corrected | [The Robot Report, 5 Nov 2026](https://www.therobotreport.com/chinese-regulators-block-softbanks-5-4b-acquisition-of-abb-robotics/) (secondary) | "could not confirm" replaced: not closed; China's security review prohibited the acquisition in China; talks continue |
| 22 | UR control box runs PolyScope | verified | [UR PolyScope](https://www.universal-robots.com/products/polyscope/) | none |
| 23 | Yaskawa YRC1000 is the controller for Motoman arms | verified | [Motoman YRC1000](https://motoman.com/products/controllers/yrc1000) | source 12 added; added "successor to DX200" |
| 24 | RSI used for seam tracking on welding robots | verified | [KUKA RSI page](https://www.kuka.com/en-de/products/robot-systems/software/hub-technologies/kuka_robotsensorinterface) | citation added |
| 25 | External motion cycle about 2-12 ms across vendors | verified | derived from rows 4 and 6 | none |

### onboard-compute

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Orin Nano up to 67 TOPS at 7-25 W | verified | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | none |
| 2 | Orin Nano 40 TOPS at 7-15 W on another NVIDIA page | verified | [NVIDIA Jetson Orin](https://www.nvidia.com/en-eu/autonomous-machines/embedded-systems/jetson-orin/) | none |
| 3 | AGX Orin up to 275 TOPS at 15-60 W | verified | [NVIDIA Jetson Orin](https://www.nvidia.com/en-eu/autonomous-machines/embedded-systems/jetson-orin/); [modules](https://developer.nvidia.com/embedded/jetson-modules) | none (watts only on the Orin page) |
| 4 | AGX Thor up to 2070 FP4 TFLOPS at 40-130 W | verified | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | none |
| 5 | Thor modules are T5000 and T4000 | verified | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | none |
| 6 | Thor is "NVIDIA's highest-performance embedded module as of 2026" | corrected | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | reworded to what the page supports: top of the Jetson line as of November 2026 |
| 7 | Orin generation spans 275 down to 67 TOPS | verified | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | none |
| 8 | PREEMPT_RT: near-full preemption, threaded interrupts, lower scheduling latency | verified | [kernel.org PREEMPT_RT theory](https://docs.kernel.org/core-api/real-time/theory.html) | none |
| 9 | Merged into mainline after about 20 years | verified | [Kernel Newbies Linux 6.12](https://kernelnewbies.org/Linux_6.12) (secondary) | none |
| 10 | Linux 6.12 released 17 November 2024 | verified | [Kernel Newbies Linux 6.12](https://kernelnewbies.org/Linux_6.12) (secondary) | none |
| 11 | TwinCAT 3 runs PLCs "under its own real-time OS or Beckhoff RT Linux" | corrected | [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) | corrected to Windows, TwinCAT/BSD, or Beckhoff RT Linux |
| 12 | AMR protective stop runs on separate certified hardware such as a safety scanner | unverifiable | none loaded (SICK pages did not render) | flagged (reason updated) |
| 13 | IPCs from Beckhoff, Siemens SIMATIC IPC, Advantech | verified | [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html); [Siemens PC-based automation](https://www.siemens.com/global/en/products/automation/pc-based.html); [Advantech](https://en.wikipedia.org/wiki/Advantech) (secondary) | none |
| 14 | AMR Jetson power envelope 15-60 W | verified | [NVIDIA Jetson Orin](https://www.nvidia.com/en-eu/autonomous-machines/embedded-systems/jetson-orin/) | none |

### plc

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | GM Hydramatic asked for a relay replacement in 1968 | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none; no primary history page loaded |
| 2 | Result was the Modicon 084, built 1969 | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 3 | Scan cycle: read inputs, execute, write outputs | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 4 | Scan then handles communications and diagnostics | unverifiable | cited [1] lists only three steps; vendor manuals blocked | flagged (new flag) |
| 5 | Scan time from 50 µs on PC-based PLCs | verified | [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) | none |
| 6 | "Tens of milliseconds for a large program" | corrected | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | source says typically tens of ms, not "large program"; reworded |
| 7 | PLC is a hard real-time system | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 8 | Most PLCs time their scan with a watchdog | unverifiable | Siemens and CODESYS manuals did not load | flagged (reason updated) |
| 9 | IEC 61131-3 languages LD, FBD, ST, SFC | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary); [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) | none |
| 10 | Instruction List deprecated in the third edition, cited [1][2] | corrected | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | Beckhoff [2] lists IL with no deprecation; citation narrowed to [1]; added year 2013 |
| 11 | Current edition of IEC 61131-3 | corrected | [IEC webstore](https://webstore.iec.ch/en/publication/68533) | text implied the 2013 edition was current; added fourth edition, May 2025 (source 4); IL removal in ed. 4 not stated since Annex B was not readable |
| 12 | PC-based runtimes put PLCs on industrial PCs | verified | [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) | none |
| 13 | FANUC R-50iA runs software PLC logic | verified | [FANUC R-50iA press release](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) | none |
| 14 | Car body line PLC sequences dozens of robots | unverifiable | no plant source found | flagged (unchanged) |
| 15 | Siemens S7-1500 and S7-1200, programmed in TIA Portal | verified | [Siemens S7-1500](https://www.siemens.com/global/en/products/automation/systems/industrial/plc/s7-1500.html); [Simatic S7](https://en.wikipedia.org/wiki/Simatic_S7) (secondary) | none |
| 16 | Rockwell ControlLogix, programmed in Studio 5000 Logix Designer | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | citation added; Rockwell site returned 403 |
| 17 | Rockwell CompactLogix | unverifiable | Rockwell site returned 403; not in loaded sources | removed |
| 18 | CODESYS is licensed by many hardware makers | verified | [CODESYS](https://en.wikipedia.org/wiki/CODESYS) (secondary) | added manufacturer's "at least 400 device makers" with attribution (source 5); codesys.com returned 429 |
| 19 | Fast pulses go to high-speed counter or interrupt inputs | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | flag removed and cited; "interrupt inputs" dropped (source covers counter modules only) |

### industrial-network

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | EtherCAT devices read and write the frame on the fly | verified | [ETG technology](https://www.ethercat.org/en/technology.html) | none |
| 2 | EtherCAT designed for cycles of 100 µs or less | verified | [ETG technology](https://www.ethercat.org/en/technology.html) | none |
| 3 | Distributed clocks give jitter well under 1 µs | verified | [ETG technology](https://www.ethercat.org/en/technology.html) | none |
| 4 | Up to 65,535 devices per segment | verified | [ETG technology](https://www.ethercat.org/en/technology.html) | none |
| 5 | PROFINET RT typically 1-10 ms | verified | [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) (secondary); [PI North America](https://us.profinet.com/is-profinet-deterministic/) | range added: RT spans 250 µs to 512 ms (source 7) |
| 6 | IRT down to 31.25 µs, clocks within 1 µs | verified | [PI North America IRT](https://us.profinet.com/?p=19941); [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) (secondary) | added 250 µs default and Conformance Class C requirement (source 11) |
| 7 | EtherNet/IP carries CIP over TCP/IP, UDP for cyclic I/O | verified | [ODVA EtherNet/IP](https://www.odva.org/technology-standards/key-technologies/ethernet-ip/) | none |
| 8 | Modbus descends from a 1979 Modicon protocol | verified | [Wikipedia Modbus](https://en.wikipedia.org/wiki/Modbus) (secondary) | none |
| 9 | Modbus TCP uses port 502 | verified | [Modbus Organization](https://www.modbus.org/news/modbus-security-new-protocol-to-improve-control-system-security) | primary added (source 9) |
| 10 | Client polls each device in turn | verified | [Wikipedia Modbus](https://en.wikipedia.org/wiki/Modbus) (secondary) | none |
| 11 | Modbus "has no built-in security" | corrected | [Modbus Organization](https://www.modbus.org/news/modbus-security-new-protocol-to-improve-control-system-security) | narrowed to the original protocol; added Modbus/TCP Security (2018, TLS, port 802) |
| 12 | IO-Link is IEC 61131-9, point-to-point | verified | [Wikipedia IO-Link](https://en.wikipedia.org/wiki/IO-Link) (secondary); [Beckhoff IO-Link](https://www.beckhoff.com/en-gb/products/i-o/overview-fieldbus-systems/io-link/) | none |
| 13 | Unshielded cable up to 20 m | verified | [ifm IO-Link wiring](https://www.ifm.com/us/en/shared/technologies/io-link/technology/io-link-wiring) | primary added (source 8) |
| 14 | 4.8, 38.4, 230.4 kbaud | verified | [ifm IO-Link wiring](https://www.ifm.com/us/en/shared/technologies/io-link/technology/io-link-wiring); [Wikipedia IO-Link](https://en.wikipedia.org/wiki/IO-Link) (secondary) | none |
| 15 | Minimum transmission time about 400 µs at COM3 | verified | [Wikipedia IO-Link](https://en.wikipedia.org/wiki/IO-Link) (secondary) | none; no primary loaded |
| 16 | IO-Link carries diagnostics such as a dirty lens warning | verified | [Wikipedia IO-Link](https://en.wikipedia.org/wiki/IO-Link) (secondary) | none |
| 17 | OPC UA: X.509 certificates, encryption, client-server and PubSub | verified | [OPC Foundation](https://opcfoundation.org/about/opc-technologies/opc-ua/) | none |
| 18 | PROFIsafe adds sequence numbers, timeouts, checksums | verified | [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) (secondary) | none; profibus.com PROFIsafe pages returned 404/401 |
| 19 | CIP Safety is an ODVA technology | verified | [ODVA EtherNet/IP](https://www.odva.org/technology-standards/key-technologies/ethernet-ip/) | none |
| 20 | Flow wrappers typically use EtherCAT or PROFINET IRT | unverifiable | PI says only that drives and motion control may need IRT | flagged (reason updated) |
| 21 | Beckhoff EK1100 couples I/O terminals to EtherCAT | verified | [Beckhoff EK1100](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/ek1xxx-bk1xx0-ethercat-coupler/ek1100.html) | none |
| 22 | PROFINET built into Siemens SIMATIC PLCs | verified | [Simatic S7](https://en.wikipedia.org/wiki/Simatic_S7) (secondary) | reworded to "standard on S7-1500" and cited (source 12) |
| 23 | EtherNet/IP and CIP Safety native to Rockwell Logix PLCs | unverifiable | Rockwell site returned 403 | flagged (new flag) |
| 24 | OPC UA servers built into robot controllers and PLCs | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) | none (one robot example confirmed) |
| 25 | Wireshark decodes EtherCAT, PROFINET, EtherNet/IP, Modbus TCP | verified | [Wireshark dfref ecat](https://www.wireshark.org/docs/dfref/e/ecat.html), [pn_io](https://www.wireshark.org/docs/dfref/p/pn_io.html), [enip](https://www.wireshark.org/docs/dfref/e/enip.html), [mbtcp](https://www.wireshark.org/docs/dfref/m/mbtcp.html) | citation added (source 10) |

### safety-circuit

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | ISO 13849-1 categories 3 and 4 are redundant; in cat 3 no single fault loses the function | verified | [Wikipedia ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) (secondary) | none; iso.org returned 403 |
| 2 | Safety relay: two relays with forced-guided contacts, two channels, feedback loop, no restart after fault | verified | [Wikipedia Safety relay](https://en.wikipedia.org/wiki/Safety_relay) (secondary) | none |
| 3 | Safety PLC has a restricted instruction set plus safety instructions | corrected | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | cited ISO 13849 page [1] does not say this; re-cited to PLC article (source 7) |
| 4 | Safety PLC hardware is internally redundant and self-testing | unverifiable | Rockwell manuals returned 403 | flagged (reason updated) |
| 5 | Safety over EtherCAT is black channel, SIL 3 | verified | [Beckhoff TwinSAFE](https://www.beckhoff.com/en-us/products/automation/twinsafe/) | none |
| 6 | PROFIsafe reaches SIL 3 with sequence numbers, timeouts, address checks, checksums | verified | [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) (secondary) | none |
| 7 | STO removes torque-producing energy and prevents unexpected start | verified | [Wikipedia STO](https://en.wikipedia.org/wiki/Safe_Torque_Off) (secondary); [SEW-EURODRIVE STO](https://download.sew-eurodrive.com/download/html/31960413/en-EN/28733575051.html) | none |
| 8 | IEC 61800-5-2 defines STO | verified | [SEW-EURODRIVE STO](https://download.sew-eurodrive.com/download/html/31960413/en-EN/28733575051.html) | flag removed; added "STO alone is stop category 0" (source 8) |
| 9 | PL a to e from just under 10⁻⁴ to 10⁻⁸ per hour | verified | [Wikipedia ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) (secondary) | none |
| 10 | ISO 13849-1 fourth edition 2023 | verified | [Wikipedia ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) (secondary) | none |
| 11 | SIL 1-3 bands per hour (10⁻⁵ to 10⁻⁸) | verified | [Wikipedia SIL](https://en.wikipedia.org/wiki/Safety_integrity_level) (secondary) | none |
| 12 | SIL from IEC 61508, applied to machinery by IEC 62061 | verified | [Wikipedia SIL](https://en.wikipedia.org/wiki/Safety_integrity_level) (secondary) | none |
| 13 | PL d about SIL 2, PL e about SIL 3 | verified | [IFA, ESPE type vs SIL/PL](https://dguv.de/medien/ifa/en/pra/bws/info_bws_sil_pl_en.pdf) | flag removed; reworded as the pairing IEC 61496-1 uses, added PL c to SIL 1 (source 9) |
| 14 | ISO 10218-1:2011 set PL d with category 3 as default | corrected | [SICK on ISO 10218](https://www.sick.com/br/en/more-safety-for-humans-and-machines/w/blog-robotic-norm-iso10218) | flag removed; blanket PL d confirmed, "category 3" not confirmed and dropped; added that the 2025 edition sets PL per function (source 10) |
| 15 | DC 60-99% for cat 2 and 3, 99% or more for cat 4 | verified | [Wikipedia ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) (secondary); [Keyence DC bands](https://www.keyence.com/ss/products/safetyknowledge/performance/parameter/) | none |
| 16 | Pilz PNOZ: long-running family for e-stops, doors, light curtains | corrected | [Pilz, German Wikipedia](https://de.wikipedia.org/wiki/Pilz_GmbH_%26_Co._KG) (secondary) | pilz.com returned 403; reduced to what loads: first PNOZ e-stop relay in 1987 (source 11) |
| 17 | Siemens S7-1500F are fail-safe versions of the S7-1500 | verified | [Simatic S7](https://en.wikipedia.org/wiki/Simatic_S7) (secondary) | added "up to SIL 3 and PL e" with citation (source 12) |
| 18 | S7-1500F uses PROFIsafe | unverifiable | Siemens pages did not state it; Wikipedia silent | removed (PROFIsafe still covered under industrial networks) |
| 19 | GuardLogix are safety PLCs in the Logix family | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | citation added |
| 20 | GuardLogix uses CIP Safety | unverifiable | Rockwell site returned 403 | removed |
| 21 | TwinSAFE logic in EtherCAT terminals, up to SIL 3 | verified | [Beckhoff TwinSAFE](https://www.beckhoff.com/en-us/products/automation/twinsafe/) | none |
| 22 | FANUC DCS and ABB SafeMove limit zones and speeds | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus); [ABB OmniCore manual](https://www.manualslib.com/manual/2131954/Abb-Omnicore.html) (secondary mirror, names SafeMove2) | none |
| 23 | Safety protocols can share the normal Ethernet cable | verified | [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) (secondary); [ODVA](https://www.odva.org/technology-standards/key-technologies/ethernet-ip/) | none |

### estop

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Directive: e-stop clearly identifiable, visible, quickly accessible | verified | [Directive 2006/42/EC Annex I 1.2.4.3](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 2 | Stop as quickly as possible without new risks | verified | [Directive 2006/42/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 3 | Stop command latches; release must not restart | verified | [Directive 2006/42/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 4 | Works in every operating mode | verified | [Directive 2006/42/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 5 | E-stop is a backup to guards, not a substitute | verified | [Directive 2006/42/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 6 | Assemblies: e-stop must also stop related equipment (1.2.4.4) | verified | [Directive 2006/42/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 7 | Regulation (EU) 2023/1230 replaces the Directive | verified | [Regulation 2023/1230, Art. 51](https://eur-lex.europa.eu/eli/reg/2023/1230/oj) | none |
| 8 | Regulation applies from 14 January 2027 | corrected | [Corrigendum, OJ L 169, 4.7.2023](https://eur-lex.europa.eu/eli/reg/2023/1230/corrigendum/2023-07-04/oj/eng); [EU-OSHA](https://osha.europa.eu/en/legislation/directive/regulation-20231230eu-machinery) | 14 January corrected to 20 January 2027; corrigendum added (source 6) |
| 9 | ISO 13850 sets design principles for the e-stop function | verified | [Not-Halt, German Wikipedia](https://de.wikipedia.org/wiki/Not-Halt) (secondary) | none |
| 10 | Red actuator on yellow background | verified | [Not-Halt](https://de.wikipedia.org/wiki/Not-Halt) (secondary); [Control Design](https://www.controldesign.com/articles/2021/standards-and-options-for-e-stops/) (secondary) | none |
| 11 | Wired normally closed so a broken wire stops the machine | verified | [Wikipedia Kill switch](https://en.wikipedia.org/wiki/Kill_switch) (secondary) | none |
| 12 | IEC 60204-1 stop categories 0, 1, 2; cat 2 only where cutting power is impossible or dangerous | verified | [Not-Halt](https://de.wikipedia.org/wiki/Not-Halt) (secondary); [ABB IRC5 manual](https://www.manualslib.com/manual/2133741/Abb-Irc5.html?page=13) (secondary mirror) | none |
| 13 | OSHA: safety-rated monitored stop is a category 2 stop per NFPA 79 | verified | [OSHA OTM IV-4](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) | none (NFPA 79-2017) |
| 14 | E-stop must be category 0 or 1 | verified | [Control Design](https://www.controldesign.com/articles/2021/standards-and-options-for-e-stops/) (secondary, quoting Omron and Phoenix Contact) | flag removed; cited IEC 60204-1 and NFPA 79 (source 7) |
| 15 | Industrial robots commonly use category 1 | corrected | [ABB IRC5 manual](https://www.manualslib.com/manual/2133741/Abb-Irc5.html?page=13) (secondary mirror) | flag removed; ABB IRC5 defaults to category 0, so rewritten as "depends on vendor and settings" (source 8) |
| 16 | Direct-opening contacts, IEC 60947-5-5 | verified | [Schneider Electric FAQ](https://www.se.com/ie/en/faqs/FA23719) | flag removed; cited (source 9) |
| 17 | Latches; released by turning, pulling, or key | verified | [Not-Halt](https://de.wikipedia.org/wiki/Not-Halt) (secondary) | none |
| 18 | Rope-pull switches along conveyors | verified | [Schmersal](https://www.schmersal.com/en/) | none |
| 19 | Escalator rules limit braking | verified | [Smith, escalator safety paper](https://liftescalatorlibrary.org/paper_indexing/papers/00000567.pdf) | flag removed; range added: 0.91 m/s² (ASME A17.1) to 1.0 m/s² (EN 115) (source 10) |
| 20 | E-stop is not lockout | verified | [29 CFR 1910.147(b)](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147) | flag removed; added that push buttons are not energy-isolating devices (source 11) |
| 21 | E-stop examples: Siemens SIRIUS ACT, Schneider Harmony | unverifiable | Siemens and se.com range pages returned 404/403 | removed; replaced with Schneider trigger-action e-stops to IEC 60947-5-5, which loaded |
| 22 | Rope-pull vendors include Pilz | unverifiable | pilz.com returned 403 | removed (Schmersal kept) |
| 23 | Teach pendants carry an e-stop | verified | [KUKA smartPAD](https://kuka.com/en-de/products/robot-systems/robot-controllers/kuka-smartpad-pro) | none (confirmed for one vendor) |

## Area 5, Compute and electronics: analogy and precision review

Scope: all 6 concepts in `knowledge/05-compute-electronics.md`. `node tools/build-content.mjs --check knowledge/05-compute-electronics.md` passes with 0 warnings and 0 errors. Unverified flags went from 7 to 5: two flagged Elsewhere examples now have loaded sources. The web-search quota ran out at the start of this pass, so all new checks used direct fetches of known URLs and the Wikipedia API.

### Analogies

| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| robot-controller | kept | n/a. The puppeteer correctly puts "what" in the script and "how far to pull each string" in the controller. The breaks text names the main gap: the controller is blind and never decides where the grape is. | Same puppeteer. |
| onboard-compute | rewritten (Plain and breaks) | "A rally co-driver who reads the road ahead and calls out instructions." Real co-drivers read pace notes written on an earlier drive, so a reader who knows rallying would expect the vision PC to work from a prepared map. Its whole job is the opposite: interpreting live, unpredictable images. The steady stream of calls also suggests a continuous feed into the motion loop, but the vision PC usually sends one target per pick. And the driver can see the road, which hides that the controller is blind. | A building-site signal person who watches where a load must land and tells a crane operator who cannot see that spot. The breaks text says the signal person talks the operator in continuously and the operator can spot a nonsense instruction. The vision PC sends one target per pick with variable timing, and the controller only checks that a target is reachable and inside its zones, so a wrong answer becomes a wrong pick. |
| plc | kept | n/a. The traffic-light controller matches the read-decide-write loop. The breaks text already covers the two main gaps: hundreds of inputs, and polling every input on every scan rather than reacting to events. | Same traffic-light controller. |
| industrial-network | kept (Plain); breaks rewritten | The old breaks text spent its first sentence on EtherCAT's on-the-fly frame, which is a curiosity. It left the bigger trap standing: the timetable suggests every industrial network reserves the track. PROFINET RT, the normal class, shares ordinary switches and only gets priority over other traffic, and PI says heavy traffic can add jitter (about 100 µs). | Same train timetable. The breaks text now says only IRT and EtherCAT truly reserve the track. It keeps the point that a late message cannot be made up later. |
| safety-circuit | kept (Plain); breaks extended | The dual-circuit brake picture leaves one wrong prediction: a car with one failed circuit can still be driven, so a reader would expect the machine to keep running on the healthy channel. In fact, a detected single-channel fault keeps the machine off until it is repaired and reset. The breaks text now says this next to the existing fail-safe point (a healthy signal is needed to run). | Same dual-circuit car brakes. |
| estop | kept | n/a. The train emergency handle matches latching and "reset allows a restart, it does not restart". The breaks text covers zones and the backup-to-guards role. That second point now also cites the OSHA lockout source [11], which is what actually supports "not protection for climbing inside". | Same train emergency handle. |

### Other fixes

- robot-controller (Precise): defined I/O cards and encoders, which were used without definitions. "Current and velocity loops" became plain words (feedback loops on motor current and speed).
- robot-controller (Elsewhere): the example mixed spot welding with a seam-tracking "torch", but spot welders have no torch and do not seam-track. It now says arc welding (a torch laying a continuous bead) is the case that uses RSI seam-tracking corrections.
- robot-controller (Products): the ABB/SoftBank status said "on 5 November 2026 ABB confirmed ... the two companies said". The Robot Report article is dated 5 November and quotes only ABB, so the text now says "in a report dated 5 November 2026" and "said it and SoftBank were still working on the deal".
- robot-controller (misconception): "the pendant is a screen ... on a cable" became "mainly a screen ... usually on a cable". Some pendants draw their own interface or are wireless. The Reality (program, motion, and safety live in the cabinet) is unchanged.
- onboard-compute (Precise): defined embedded module and inference.
- onboard-compute (Elsewhere): removed the `[unverified]` flag. The claim that the AMR protective stop runs on separate certified hardware is now sourced to the MiR250 specification page, which lists two SICK nanoScan3 safety laser scanners (360° coverage) and 12 safety functions to ISO 13849-1. Added as source 6. Also softened "carries a Jetson-class module" to "can carry", and defined localization.
- plc (Precise): defined analog signals.
- industrial-network (Precise): defined switches, frames, and distributed clocks. Added PROFINET RT's about 100 µs jitter (PI) so RT and IRT (1 µs) can be compared. Added the same to Key numbers.
- industrial-network (misconception): "a PROFINET RT cycle ... arrives on schedule every cycle" overstated RT. PI's own page says RT gains jitter under heavy traffic. It now says RT repeats every cycle with about 100 µs of wobble on a well-designed network, cited [2][7].
- industrial-network (Elsewhere): removed the `[unverified]` flag on flow wrappers and EtherCAT/IRT. The text now states only what loaded sources support. ETG names packaging machines and coordinated multi-axis servo motion as EtherCAT uses [1], and PI says some drive and motion control applications need IRT [11]. Dropped the unsupported "a dozen servo axes" and said what a flow wrapper does.
- industrial-network (cheese example): "vacuum switches on the cracker gripper" became the single vacuum switch on the cracker station's bellows cup, matching area 3. It also now says what IO-Link adds: the actual vacuum level, not just yes or no.
- industrial-network (Sources): updated the descriptions of [1], [2], [7], and [11] to list the newly cited facts.
- safety-circuit (Precise): "contactors, which are heavy-duty relays" defined jargon with jargon, so it now says electrically operated switches. Added what category 4 adds over category 3 (every fault caught at the next self-test, so faults building up cannot lose the function), checked against the cited ISO 13849 article. SIL 3 now has a forward pointer at first use.
- safety-circuit (cheese example): two consistency fixes. (1) "Infeed and outfeed openings have light curtains" contradicted area 6 (guarding). There, trays pass through tunnels too small to reach through, and a light curtain guards only an open outfeed operator slot. (2) "The safety PLC removes STO from the grape robot's drives" would be a category 0 coast. Area 2 (servo-drive) and this file's estop design both say the robots stop in category 1. The safety PLC now opens the robot controller's dual-channel safety input, the controller brakes along its path and then removes torque, and the conveyor drive gets STO directly.
- safety-circuit (Elsewhere): car body shop changed the same way: robots are stopped through each controller's safety input, not by a safety PLC cutting their drives' STO.
- misconceptions: all 6 checked. Each is a belief newcomers really hold (pendant is the computer, faster GPU means real-time, PLC reacts like an interrupt, deterministic means fast, a door check in the normal PLC is enough, e-stop cuts all power and that is always safest). Each Reality is correct. The only edits were the pendant hedge and the PROFINET RT wording above.
- Not changed, noted: the PLC process-image description fits classic scan controllers. Some Logix-family controllers update I/O in the background instead. That nuance was not added because Rockwell's manual (1756-PM004) returned 403.

### Spot-checks of the fact check

| Claim | Source opened | Result |
|---|---|---|
| ABB agreed in Oct 2025 to sell robotics to SoftBank; closing planned for mid-to-late 2026 (verified) | [SoftBank press release, 8 Oct 2025](https://group.softbank/en/news/press/20251008) | Pass. "SBG expects the Acquisition to close in mid-to-late 2026." USD 5.375 billion. |
| Deal not closed as of Nov 2026; China's security review prohibited it in China; talks continue (corrected; re-checked) | [The Robot Report, 5 Nov 2026](https://www.therobotreport.com/chinese-regulators-block-softbanks-5-4b-acquisition-of-abb-robotics/) | Pass with a wording fix. The prohibition applies in China only. The "close dialogue" quote is ABB's, not a joint statement, and no separate confirmation date is given. Text adjusted. |
| Jetson AGX Thor (T5000, T4000) up to 2070 FP4 TFLOPS at 40-130 W; Orin Nano 67 TOPS at 7-25 W; AGX Orin 275 TOPS (verified) | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | Pass, all figures. |
| UR e-Series and UR Series real-time loop 500 Hz; RTDE on TCP port 30004 (verified) | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | Pass. "500 Hz on e-Series and ur-Series robots"; "by default available on TCP port 30004". |
| KUKA RSI 12 ms normal, 4 ms fast; KR C4 and KR C5 (verified) | [Quanser RSI block docs](https://docs.quanser.com/quarc/documentation/kuka_rsi_block.html) | Pass. RSI 4.1+ on KR C4, 5.0+ on KR C5. Secondary source, as the fact checker labeled it. |
| R-50iA announced 27 Aug 2024; Python, software PLC, IEC 62443-4-1/4-2, three cabinets, new amplifier (verified) | [FANUC America press release](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) | Pass, all points. |
| EtherCAT: cycles of 100 µs or less, jitter well under 1 µs, 65,535 devices per segment (verified) | [ETG technology page](https://www.ethercat.org/en/technology.html) | Pass. The page also names packaging machines and coordinated multi-axis servo motion, now used to remove a flag. |
| PROFINET RT 250 µs to 512 ms, typically 1-10 ms (verified) | [PI North America](https://us.profinet.com/is-profinet-deterministic/); [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) | Pass. The same PI page gives RT jitter of about 100 µs that grows under heavy traffic. That undercut the misconception's "arrives on schedule every cycle", which is now fixed. |
| Linux 6.12 released 17 November 2024; RT patch set merged after 20 years (verified) | [Kernel Newbies Linux 6.12](https://kernelnewbies.org/Linux_6.12) | Pass. "After 20 years of work, the real-time patchset has been merged". |
| TwinCAT 3 cycle times from 50 µs; one or more PLCs on an IPC; OS list (verified) | [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) | Pass. |
| OSHA reduced teach speed 250 mm/s or less; three-position enabling device (verified) | [OSHA OTM IV-4](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) | Pass, partly. 250 mm/s confirmed. OSHA says the worker "must hold it in the center-ON position" or motion is inhibited. It never says "squeezing hard stops", but that follows from center-ON with three positions, which the KUKA page [10] confirms. |
| Escalator braking capped at 1.0 m/s² (EN 115) and 0.91 m/s² (ASME A17.1) (verified) | [Smith, Lift and Escalator Library PDF](https://liftescalatorlibrary.org/paper_indexing/papers/00000567.pdf) | Pass. Text extracted from the PDF: "defined by BS EN 115 as 1.0 m/s² and 0.91 m/s² by ASME A17.1". Author is Rory S. Smith, University of Northampton. |
| Regulation (EU) 2023/1230 applies from 20 January 2027 per corrigendum (corrected; re-checked) | [EUR-Lex corrigendum, OJ L 169](https://eur-lex.europa.eu/eli/reg/2023/1230/corrigendum/2023-07-04/oj/eng) | Pass. Changes 14 to 20 January 2027 in Articles 51(2), 52(1), and 54. |
| ISO 10218-1:2011 blanket PL d; 2025 edition sets PL per function (corrected; re-checked) | [SICK, 8 Sep 2025](https://www.sick.com/br/en/more-safety-for-humans-and-machines/w/blog-robotic-norm-iso10218) | Pass. "Blanket requirement for a performance level d"; "application-specific PL value based on the risk evaluation". |
| ISO 13849 category 3 single-fault rule; DC 60-99% for cat 2-3, 99% or more for cat 4 (verified) | [Wikipedia ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) | Pass. The cat 4 fault-accumulation rule is also there, now added to the text. Secondary source. |
| IEC 61131-3 fourth edition, 22 May 2025 (corrected; re-checked) | [IEC webstore](https://webstore.iec.ch/en/publication/68533) | Pass. The abstract does not say whether IL was removed (it points to Annex B), so the text's silence on that is right. |

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

## Area 6, Cell and line: analogy and precision review

Scope: all 12 concepts in `knowledge/06-cell-and-line.md`. `node tools/build-content.mjs --check knowledge/06-cell-and-line.md` passes with 0 warnings and 0 errors (72 sources, 5 unverified flags, the same as after the fact check). The shared WebSearch quota was used up on the first search attempt, so every check below comes from fetching the cited pages directly.

### Analogies

| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| conveyor | kept (one Plain sentence fixed; breaks text rewritten) | n/a for the analogy. The Plain said the conveyor "sets the pace". A reader would predict that a faster belt makes a faster line, but the slowest station sets the pace ([[line-balancing]]), so the sentence now says the conveyor decides where each tray is and when it arrives. The old breaks text said robots must know positions to a few mm but not how. It now names the real gap: a diner watches the plate, while a robot usually does not see the item when it grabs, and knows where it is only from measured belt travel since an upstream camera saw it. | Same sushi belt. |
| feeder | kept | n/a. Gumball machine (one item per turn, from a gravity-fed stack) matches a denester. The breaks text (orientation, nested trays sticking) is accurate. | Same gumball machine. |
| inspection | kept (breaks text rewritten) | n/a for the analogy. The old breaks text said the line decides "in a fraction of a second", which contradicts the cheese example (up to 18 s per plate). It now names the real gap: a teacher can judge a borderline case and spot an error nobody listed, while the line applies fixed thresholds to the few things it measures. | Same teacher marking against an answer key. |
| packaging-machines | kept | n/a. Takeaway-box lid, plus breaks text on position accuracy and seal conditions, is accurate. | Same takeaway lid. |
| guarding | kept | n/a. Pool fence and self-closing gate. The breaks text correctly names the two key differences: the guard is wired to stop the hazard, and a sensor must be far enough away for the robot to finish stopping. | Same pool fence. |
| hmi | kept | n/a. Car dashboard. The Plain already says the HMI does not do the controlling. The breaks text (many roles, e-stops never on the screen) is accurate. | Same dashboard. |
| cycle-time | rewritten | A coxswain picks a stroke rate the crew can hold. A reader would predict that takt is a pace the line picks to suit its own ability, the very takt/cycle-time confusion the misconception warns about. They would then expect a slow station to be "fixed" by lowering takt. Takt comes only from demand and available time. | A sandwich counter expecting 120 lunch orders an hour must hand over one every 30 s, however fast its staff are; each person's step time is cycle time. The breaks text covers bursts versus a shift average, a robot not being able to borrow a neighbor's arm, and buffers. |
| line-balancing | kept | n/a. Splitting house chores. The breaks text covers fixed order, tasks that cannot be split, and starving or blocking neighbors. | Same chores. |
| oee | kept | n/a. A batting average, with the breaks text on plant-specific definitions, is accurate and leads to the right caution. | Same batting average. |
| ip-rating | kept | n/a. A watch water-resistance mark. The Plain already warns that each number is a separate test, and the breaks text correctly says digits above 6 are not cumulative and no test covers chemicals. | Same watch mark. |
| hygienic-design | kept | n/a. Smooth countertops versus cracked tiles. The breaks text (crews with hoses cannot see every corner, and a lab swab, not the eye, is the test) is accurate. | Same kitchen. |
| safety-standards | kept (breaks text extended) | n/a for the analogy. The building code picture also suggests a fixed checklist an inspector ticks off. The breaks text now adds the bigger difference: these standards center on a risk assessment the builder performs, which decides how strong each safeguard must be (per-function PL in the 2025 robot standards). | Same building code. |

### Other fixes

- conveyor (cheese example): "slow enough that indexing is attractive" did not follow. It now says the belt moves for only a small part of each 18 s beat, so a robot places onto a stationary tray and the tray needs no tracking.
- conveyor (Precise): defined sprockets and photo-eye.
- feeder (Precise): "cannot orient fully symmetrical parts" was muddled. A fully symmetrical part needs no orienting. It now gives the mechanism: the tooling sorts by shape and weight, so it cannot orient a part whose right way up is shown only by something like color (matches the Wikipedia wording). Also defined tooling, servo, and pneumatic, and replaced "singulated" with plain words.
- inspection (Precise): untangled the nested definition of checkweigher and load cell.
- packaging-machines (Precise): defined PackML and added what breaks without shared states: the line controller cannot tell a lidder waiting for trays from a jammed one.
- guarding (Precise): defined safety circuit on first use.
- hmi (cheese example): "a recipe change ... changes the takt math" was wrong, and it taught the takt/cycle-time confusion. Takt stays 18 s because demand is unchanged. The cheese station's cycle grows from 10.5 s to 13.5 s (using the line-balancing sketch's times), still inside takt.
- hmi (Precise): defined industrial network and safety circuit, and said why e-stops bypass the screen: a frozen panel or a bug in the ordinary PLC program cannot block a stop.
- hmi (misconception): "a common reason a line's uptime is lower" was an unsourced frequency claim. It now says bad HMI slows recovery from every stop, which costs uptime.
- cycle-time (cheese example): "6 trays waiting in buffers" contradicted line-balancing's indexing line with no buffers. It is now "6 trays sitting on belt positions between stations". Little's law and the 4.2 min result are unchanged.
- line-balancing (Precise): defined utilization and availability, and the theory-of-constraints steps exploit, subordinate, and elevate, which had been bare jargon.
- oee (cheese example): the ideal cycle was 15 s, but line-balancing makes the line's fastest cycle 14.3 s (the apple station). The text itself says a slow ideal cycle is how OEE gets gamed. The ideal cycle is now 14.3 s, which gives performance 87.0%, OEE 76.0%, and 70.9% for the washdown trap (all recomputed). The old 15 s figure is kept as a third trap: it would lift OEE to 79.7% with no change on the floor. The key number is updated.
- hygienic-design (cheese example): "every surface over the open trays is in the food or splash zone" no longer matched the corrected EN 1672-2 definitions. Anything that can drip into food is food area, so the arms, grippers, and ingredient belts are now called food area, cited to [6].
- hygienic-design (Precise): defined dead areas and Listeria monocytogenes, and said why metal-to-metal joints are banned: they leave narrow, deep crevices that cleaning cannot reach (checked against Curiel 2003, source [2]).
- safety-standards (Precise): defined partly completed machinery, SIL, and CE conformity assessment.
- safety-standards (Elsewhere): corrected the SICK retrofit claim (see the spot-checks).
- misconceptions: all 12 checked. Each is a belief people really hold (for example "you can inspect quality in", "85% OEE is world class", "IP69K covers everything below it"), and each Reality is correct. Only the hmi Reality changed (above).

### Spot-checks of the fact check

| Claim | Source opened | Result |
|---|---|---|
| IRB 360 tracking repeatability: 1.0 mm at 200 mm/s, 5.0 mm at 800-1400 mm/s, 2.0 mm on an indexing conveyor (verified) | [ABB IRB 360 datasheet](https://library.e.abb.com/public/a3759d3f3e7141deba89d1caeb1dd4e4/IRB%20360%20FlexPicker_Datasheet_US%20Letter.pdf) (decoded the PDF text locally) | Pass. The table also gives 1.5 mm at 350-750 mm/s and 3.5 mm for start/stop belts. All were measured with the IRB 360-1/1130 and PickMaster. |
| IRB 360 cycle times 0.30-0.60 s (25/305/25 mm) and 0.44-0.92 s (90/400/90 mm); verify with RobotStudio or tests (verified) | ABB datasheet | Pass. The range runs from the 0.1 kg payload on the -1/1130 model to 8 kg on the -8/1130 model. |
| Stainless IRB 360 is IP69K validated for detergents and hot high-pressure water, with rinse-off surfaces and lubricant-free joints; 3-position enabling device (verified) | ABB datasheet | Pass, quoted word for word. |
| QUPAQ: pneumatic up to 120 trays/min on 6 bar; INTRAY up to 200, tray dependent; IP67 (verified) | [Sealpac UK QUPAQ range](https://www.sealpac-uk.com/qupaq-tray-denesting-range) | Pass. As the fact checker noted, the page's "70 trays/min" text contradicts its own spec list. The 400/min figure is not tied to a model on this page; the file cites it to [1]. |
| Sealpac traysealers: M-series 5-15 packs/min, Amax 10-320 single and double lane (corrected, re-checked) | [Sealpac UK traysealers](https://www.sealpac-uk.com/sealpac-traysealer-range) | Pass. |
| Sleevers up to 100 trays/min, changeover under 5 min (verified) | [Sealpac UK packaging](https://www.sealpac-uk.com/packaging) | Pass. Flowrappers are listed too. |
| BoxCheck up to 2,500 per hour; X-ray finds glass, stone, bone, metal (verified) | [Sealpac UK inspection](https://www.sealpac-uk.com/packaging-inspection-systems) | Pass. The page says "containers" (E1 and E2 crates); the file's "pieces" is close enough. Plastics are listed too. |
| ThermoDrive halves cleaning time and water use; tensionless, positive drive (verified) | [Intralox ThermoDrive](https://www.intralox.com/products/thermodrive) | Pass. A vendor claim with no test data, and the file already frames it as "Intralox claims". |
| EHEDG GL 8, fourth edition, December 2025, risk-based, basis for certification (verified) | [EHEDG GL 8](https://ehedg.org/guidelines-working-groups/guidelines/guidelines/detail/hygienic-design-principles) | Pass. |
| oee.com: most plants near 60%; below 45% more common than above 85%; 90% on all three gives 73%; Introduction to TPM 1984, English 1988 (verified) | [oee.com world-class OEE](https://oee.com/world-class-oee) | Pass. The page gives 90/95/99 and "85%" but not "84.6%"; that number is the file's own correct arithmetic. |
| Toyota reviews takt monthly (verified) | [LEI lexicon: takt time](https://www.lean.org/lexicon-terms/takt-time/) | Pass. The page adds a tweaking review every 10 days. |
| ISO 13855:2024, 3rd edition, November 2024; ages 14 and over; excludes running, jumping, falling (verified) | [ISO 13855:2024](https://committee.iso.org/standard/80590.html) | Pass. Published 2024-11-22. |
| EN ISO 10218-1/-2:2025 harmonised under Directive 2006/42/EC by Decision (EU) 2026/2015, OJ 7 September 2026; presumption of conformity (corrected, re-checked) | [EUR-Lex 2026/2015](https://eur-lex.europa.eu/eli/dec_impl/2026/2015/oj/eng) | Pass. The decision is dated 4 September 2026 and was published 7 September. Recital 15 gives the presumption. |
| ISO 22400-2:2014 to be revised, replacement at proof stage (corrected, re-checked) | [ISO 22400-2](https://committee.iso.org/standard/54497.html) | Pass. Stage 90.92 (2023-08-07). The replacement is ISO/PRF 22400-2. |
| ANSI/A3 R15.06-2025 Parts 1 and 2 published September 2025; TS 15066 consolidated; sold in the A3 store (verified) | [The Robot Report, 12 Sep 2025](https://www.therobotreport.com/updated-ansi-a3-standards-address-industrial-robot-safety/) | Pass. The article does not name the ISO edition adopted. It expected Part 3 "later in 2025". |
| R15.06 Part 3 released January 2026, for users of robot cells (verified) | [Robotics 24/7, 14 Jan 2026](https://www.robotics247.com/article/a3-releases-part-3-of-ansi-a3-r15.06-2025-robot-safety-standard) | Pass. Secondary (trade press). |
| 2025 robot standards: per-function PL replaces blanket PL d; two robot classes; cybersecurity; TS 15066 force and pressure limits absorbed (verified) | [SICK blog](https://www.sick.com/br/en/more-safety-for-humans-and-machines/w/blog-robotic-norm-iso10218) | Pass. No part number is given for the force limits, matching the fact checker's correction. |
| SICK: a significant change needs a new CE assessment "once the EU Machinery Regulation applies in January 2027" (verified, row 25) | SICK blog | **Fail (framing).** SICK says a significant change needs a new CE conformity assessment "based on the requirements of the MD and future machinery directive", that is, under the current Directive as well, not only from 2027. What is new is that the Regulation now writes "significant change" into EU law. Text corrected. |
| Newrest, January 2021: cobot lines and help with trolley assembly (corrected, re-checked) | [Newrest, 20 Jan 2021](https://media.newrest.eu/news/cobot-lines-at-the-heart-of-our-inflight-catering-production-units/) | Pass. The article names no specific kitchens. |
| Listeria grows in refrigerated food and is hard to fully remove from processing facilities (corrected, re-checked) | [CDC: how Listeria spreads](https://www.cdc.gov/listeria/causes/) | Pass. |
| 3-A and EHEDG Ra 0.8 µm; no metal-to-metal joints; dead areas harder to clean (verified) | [Food Safety Magazine, Curiel 2003](https://www.food-safety.com/articles/4350-hygienic-design-of-equipment-in-food-processing) | Pass. It also gives the reason now in the text: metal-to-metal contacts "leave very narrow and deep crevices". |
| Bowl feeders cannot handle symmetrical parts or parts told apart by color (verified) | [Bowl feeder](https://en.wikipedia.org/wiki/Bowl_feeder) (secondary) | Pass on substance. The source's own wording is muddled, and the file now states the shape-and-weight mechanism. |
| Line-balancing code sketch prints 14.3 s, 0.43, 0.80, 202; 17.5 s, 165; 10.5 s, 0.59, 0.78, 267 (verified) | Re-ran the sketch locally | Pass. 202.15, 165.19, and 267.05 plates/h, unrounded. |

## Area 7, Classical robot software (part A): fact check

Summary line: 116 claims checked: 106 verified, 9 corrected, 1 unverifiable (0 kept flagged, 1 removed).

Scope: the area intro plus frames, forward-kinematics, inverse-kinematics, motion-planning, trajectory-generation, collision-checking, control-loops and conveyor-tracking. All 11 original `[unverified]` flags in these concepts are resolved: 6 are now verified and cited, and 5 are corrected and cited. No flag remains in scope. `node tools/build-content.mjs --check knowledge/07-classical-software.md` reports 0 errors and 0 warnings.

Source notes. Three sources stay secondary because I found no primary page that says the same thing in a form I could load: the Wikipedia DH article (cites Denavit and Hartenberg 1955 and Craig), the Wikipedia PID and integral windup articles (the windup article cites Åström and Rundqwist 1989), and a Motion Control Tips trade article for the 5-10x bandwidth rule. The Northwestern tf course notes are also secondary; the 10 s buffer now has a primary source too (the tf2 README on ROS Index). Two primary sources replaced secondary ones: the Diebel 2006 Stanford report replaced Wikipedia for gimbal lock, and the Buss IK report replaced a blog summary of it. "Primary, third-party host" means a maker's own document served from ManualsLib or a university mirror; I checked the text of the document itself. Company and product status as of November 2026: Drake's site still says Toyota Research Institute leads core development, and the Beckhoff AX5000/AX8000, KUKA.ConveyorTech, EL5101, FANUC CRX, MoveIt Pilz/STOMP/CHOMP and Ruckig pages are all live. None of these concepts states company ownership, so no ownership claims needed changing.

### intro
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Learned models that replace parts of this stack are covered in area 8 ([[learned-policy]]) | verified | [registry.md](../knowledge/registry.md), [08-robot-learning.md](../knowledge/08-robot-learning.md) (internal) | none |
| 2 | Each station runs the whole stack "every few seconds" | verified | Running example in [FORMAT.md](../knowledge/FORMAT.md): 200 plates/h is 18 s per plate, 4.5 s per apple pick (computed) | none |

### frames
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | tf2 keeps the frame tree "buffered in time" | verified | [ROS Index tf2](https://index.ros.org/p/tf2/) | none |
| 2 | Every frame in a TF tree has exactly one parent | verified | [NU MSR tf notes](https://nu-msr.github.io/ros_notes/ros1/lecture05_tf.html) (secondary) | marked source secondary |
| 3 | Fixed frames are published once as static transforms; moving ones are streamed with timestamps | verified | [NU MSR tf notes](https://nu-msr.github.io/ros_notes/ros1/lecture05_tf.html) (secondary) | none |
| 4 | REP 103: SI units (m, rad), right-handed, x forward y left z up | verified | [REP 103](https://reps.openrobotics.org/rep-0103/) | none |
| 5 | REP 103 lists quaternions first and discourages Euler angles | verified | [REP 103](https://reps.openrobotics.org/rep-0103/) | none |
| 6 | Eigen calls the quaternion "the representation of choice" | verified | [Eigen TutorialGeometry.dox](https://sources.debian.org/src/eigen3/3.4.0-5/doc/TutorialGeometry.dox) | none |
| 7 | Yaw-pitch-roll gimbal lock at pitch ±90° | verified | [Diebel 2006](https://www.astro.rug.nl/software/kapteyn-beta/_downloads/attitude.pdf) (singular at π/2 + nπ) | replaced Wikipedia [5] with Diebel |
| 8 | A rotation matrix drifts from a valid rotation under repeated rounding unless re-normalized | verified | General floating-point behavior; not cited | none |
| 9 | Quaternions have no such singularity | verified | [Diebel 2006](https://www.astro.rug.nl/software/kapteyn-beta/_downloads/attitude.pdf) | none |
| 10 | q and -q are the same rotation | verified | [Parwana and Kothari 2017](https://arxiv.org/abs/1708.08680) | citation [6] added |
| 11 | "Libraries disagree" on whether w is stored first or last | corrected | [Parwana and Kothari 2017](https://arxiv.org/abs/1708.08680) (Hamilton scalar-first vs JPL scalar-last) | corrected "libraries disagree ... stored" to "conventions disagree ... written"; cited [6] |
| 12 | tf history buffer about 10 s by default | verified | [ROS Index tf2 README](https://index.ros.org/p/tf2/), [NU MSR notes](https://nu-msr.github.io/ros_notes/ros1/lecture05_tf.html) | added primary [1] |
| 13 | 1° at 1 m is about 17 mm | verified | Computed: tan 1° = 0.01746 | none |
| 14 | Eigen Geometry has Quaternion, AngleAxis and Transform types | verified | [Eigen TutorialGeometry.dox](https://sources.debian.org/src/eigen3/3.4.0-5/doc/TutorialGeometry.dox) | none |
| 15 | Eigen is "used by most robotics C++ code" | unverifiable | No source quantifies this | removed |
| 16 | Vendor languages define named base, tool and user frames (was flagged) | corrected | [ABB RobotStudio API: RsWorkObject](https://developercenter.robotstudio.com/api/robotstudio/api/ABB.Robotics.RobotStudio.Stations.RsWorkObject.html) | rewrote as a checked ABB example (work object = user frame + object frame); flag removed; cited [7] |
| 17 | Surgical robot hand motion is applied in the endoscope camera frame | verified | [US 6364888 B1, Intuitive Surgical](https://patents.google.com/patent/US6364888B1/en) | citation [8] added |
| 18 | Car-body weld points defined in a body frame, so one correction moves all of them | verified | [ABB RsWorkObject](https://developercenter.robotstudio.com/api/robotstudio/api/ABB.Robotics.RobotStudio.Stations.RsWorkObject.html) (programmed positions relative to the object frame) | citation [7] added |
| 19 | Code sketch: quaternion-to-matrix formula and result x=0.42, y=0.05, z=0.05 | verified | Computed: R = diag(1,-1,-1), R·p + t | none |

### forward-kinematics
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | FK is the ordered product of per-joint transforms | verified | [Orocos KDL solvers](https://orocos.org/book/export/html/860) | none |
| 2 | Serial-arm FK always exists, is unique and is cheap | verified | Textbook result; consistent with [KDL](https://orocos.org/book/export/html/860) | none |
| 3 | DH uses four parameters d, theta, a (r), alpha | verified | [Wikipedia DH](https://en.wikipedia.org/wiki/Denavit-Hartenberg_parameters) (secondary) | marked source secondary |
| 4 | Classic DH order Trans_z(d) Rot_z(theta) Trans_x(a) Rot_x(alpha) | verified | [Wikipedia DH](https://en.wikipedia.org/wiki/Denavit-Hartenberg_parameters) (secondary) | none |
| 5 | Modified DH (Craig) places frames differently and multiplies in a different order | verified | [Wikipedia DH](https://en.wikipedia.org/wiki/Denavit-Hartenberg_parameters) (secondary) | none |
| 6 | URDF joint: parent, child, origin xyz (m) and rpy (rad), axis, limits on position, velocity, effort | verified | [URDF joint spec (ROS wiki mirror)](https://whiteoak.umd.edu/roswiki/urdf%282f%29XML%282f%29joint.html) | none |
| 7 | URDF origin xyz and rpy default to zero | verified | [URDF joint spec](https://whiteoak.umd.edu/roswiki/urdf%282f%29XML%282f%29joint.html) | none |
| 8 | KDL recursive solver adds segment poses and can return an intermediate segment | verified | [Orocos KDL solvers](https://orocos.org/book/export/html/860) | none |
| 9 | Pinocchio forwardKinematics updates every joint placement (data.oMi) | verified | [Pinocchio IK example](https://gepettoweb.laas.fr/doc/stack-of-tasks/pinocchio/master/doxygen-html/md_doc_b_examples_d_inverse_kinematics.html) | none |
| 10 | Drake core development led by Toyota Research Institute | verified | [drake.mit.edu](https://drake.mit.edu/) | none |
| 11 | Absolute accuracy is much worse than repeatability (was flagged) | verified | [ABB Absolute Accuracy brochure 2005](https://library.e.abb.com/public/0f879113235a0e1dc1257b130056d133/Absolute%20Accuracy%20EN_R4%20US%2002_05.pdf) | flag removed; range added: 8-15 mm real-vs-model gap, about 0.5 mm after calibration [6]; points to [[repeatability]] for repeatability values |
| 12 | DH table is 6x4 for a 6-axis arm | verified | [Wikipedia DH](https://en.wikipedia.org/wiki/Denavit-Hartenberg_parameters) (secondary) | none |
| 13 | Code sketch: classic DH matrix entries | verified | Computed product of the four elementary transforms | none |
| 14 | 80 mm to 140 mm tool swap gives a 60 mm error (labeled illustrative) | verified | Arithmetic | none |

### inverse-kinematics
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Up to 8 IK solutions for a spherical-wrist 6-axis arm | verified | [Elias and Wen 2025](https://arxiv.org/html/2501.18505v2) | none |
| 2 | FANUC CRX can have up to 16 | verified | [Elias and Wen 2025](https://arxiv.org/html/2501.18505v2) | none |
| 3 | A 7-axis arm has infinitely many solutions | verified | Textbook result (redundancy) | none |
| 4 | Vendor languages make you state the intended posture (was flagged) | verified | [ABB RobotStudio API: ConfigurationData](https://developercenter.robotstudio.com/api/robotstudio/api/ABB.Robotics.RobotStudio.Stations.ConfigurationData.html) | flag removed; ABB example added (quadrants of axes 1, 4, 6) [7]; "typically" softened to "often" |
| 5 | IKFast finds solutions "in a few microseconds" on recent processors | verified | [MoveIt IKFast tutorial](https://moveit.picknik.ai/main/doc/examples/ikfast/ikfast_tutorial.html) | none |
| 6 | IKFast comes from OpenRAVE, tested on 6 and 7 DOF arms | verified | [MoveIt IKFast tutorial](https://moveit.picknik.ai/main/doc/examples/ikfast/ikfast_tutorial.html) | none |
| 7 | DLS step dq = J^T (J J^T + lambda^2 I)^-1 e | verified | [Buss 2009 report](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf), eq. 11 | replaced blog source [5] with the Buss report |
| 8 | Plain pseudoinverse blows up near singularities | verified | [Buss 2009](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf), section 4 | none |
| 9 | Damping too large makes convergence slow | verified | [Buss 2009](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf), section 5 | none |
| 10 | Pinocchio example: eps 1e-4, 1000 iterations, DT 0.1, damping 1e-12 (Python) and 1e-6 (C++) | verified | [Pinocchio IK example](https://gepettoweb.laas.fr/doc/stack-of-tasks/pinocchio/master/doxygen-html/md_doc_b_examples_d_inverse_kinematics.html) | none |
| 11 | Numerical solvers return "the one solution nearest their starting guess" | corrected | Behavior of local iterative methods ([Buss 2009](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf)) | corrected to "one solution, usually one near their starting guess" (not guaranteed nearest) |
| 12 | TRAC-IK runs enhanced KDL and SQP concurrently; drop-in replacement for KDL | verified | [trac_ik ROS wiki mirror](https://mirror.umd.edu/roswiki/trac_ik.html) | none |
| 13 | Classic singularity cases (was flagged) | verified | [Doosan e-Series manual: Singularity](https://manual.doosanrobotics.com/en/user-manual/3.2.0/3-e-series/singularity) | flag removed; named elbow, shoulder and wrist cases to match the manual (axis 5 at 0 lines up axes 4 and 6); cited [6] |
| 14 | Near a singularity, linear moves need very fast joints, so the controller slows or stops | verified | [Doosan manual](https://manual.doosanrobotics.com/en/user-manual/3.2.0/3-e-series/singularity) (speed-limit violations), [Buss 2009](https://www.cs.cmu.edu/~15464-s13/lectures/lecture6/iksurvey.pdf) | added [6]; "stops with an error" made "stops with a speed-limit error" |
| 15 | A standard 4-axis SCARA or delta controls only x, y, z and rotation about vertical | verified | Standard kinematics; covered in the scara and delta concepts | none |

### motion-planning
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Joint moves are unaffected by singularities | verified | [Doosan manual](https://manual.doosanrobotics.com/en/user-manual/3.2.0/3-e-series/singularity) (MoveJ not affected) | none |
| 2 | Pilz offers PTP, LIN, CIRC with trapezoidal profiles | verified | [MoveIt Pilz](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) | none |
| 3 | RRT grows toward random samples and is biased toward unexplored space | verified | [LaValle RRT page](https://lavalle.pl/rrt/about.html) | none |
| 4 | RRT-Connect "is a common default for arms" (was flagged) | corrected | [MoveIt 2 ompl_interface.cpp](https://github.com/moveit/moveit2/blob/main/moveit_planners/ompl/ompl_interface/src/ompl_interface.cpp) | corrected to "the planner MoveIt 2 falls back to when no default is configured"; flag removed; cited [9] |
| 5 | PRM builds a reusable roadmap for many queries | verified | [OMPL planners](https://ompl.kavrakilab.org/planners.html) | none |
| 6 | Sampling planners are probabilistically complete but cannot report that no path exists | verified | [MoveIt STOMP page](https://moveit.picknik.ai/main/doc/how_to_guides/stomp_planner/stomp_planner.html) | none |
| 7 | Raw sampling paths are jerky and need post-processing | verified | [CHOMP, ICRA 2009](https://publications.ri.cmu.edu/chomp-gradient-optimization-techniques-for-efficient-motion-planning/) | none |
| 8 | RRT* and PRM* converge toward the optimal path with more time | verified | [OMPL planners](https://ompl.kavrakilab.org/planners.html) | none |
| 9 | CHOMP uses covariant gradient descent (Ratliff, Zucker, Bagnell, Srinivasa, ICRA 2009) | verified | [CHOMP](https://publications.ri.cmu.edu/chomp-gradient-optimization-techniques-for-efficient-motion-planning/) | none |
| 10 | STOMP's noisy trajectories help it escape local minima that trap CHOMP | verified | [MoveIt STOMP page](https://moveit.picknik.ai/main/doc/how_to_guides/stomp_planner/stomp_planner.html) | none |
| 11 | TrajOpt: sequential convex optimization, continuous-time collision checks, faster and solved more problems than OMPL and CHOMP | verified | [Schulman et al., RSS 2013](https://www.roboticsproceedings.org/rss09/p31.html) | none |
| 12 | TrajOpt by Schulman, Abbeel and colleagues | verified | [RSS 2013](https://www.roboticsproceedings.org/rss09/p31.html) | none |
| 13 | OMPL has no collision checking by design and is MoveIt's default planning library | verified | [OMPL home](https://ompl.kavrakilab.org/) | none |
| 14 | OMPL lists more than 40 geometric planners | verified | [OMPL planners](https://ompl.kavrakilab.org/planners.html) (45 counted) | none |
| 15 | LaValle, Planning Algorithms, Cambridge University Press 2006, free online | verified | [lavalle.pl/planning](https://lavalle.pl/planning/) | none |
| 16 | "Optimizers return the best path near their starting guess" | corrected | [MoveIt STOMP page](https://moveit.picknik.ai/main/doc/how_to_guides/stomp_planner/stomp_planner.html) (CHOMP gets stuck in local minima; STOMP can avoid them) | corrected to "gradient optimizers such as CHOMP can get stuck in a local minimum near their starting guess" |
| 17 | Spot-welding paths are "typically generated offline in simulation and touched up on the line" (was flagged) | corrected | [Siemens Process Simulate](https://www.siemens.com/en-us/products/tecnomatix/process-simulate-software/) | narrowed to "often programmed offline in simulation tools" with Process Simulate as the example (spot welding, program download); removed the unsupported "touched up" and "typically"; flag removed; cited [10] |
| 18 | 18 s per plate per station, 4.5 s per apple pick | verified | Computed from the running example | none |

### trajectory-generation
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Short trapezoid moves become triangles; jerk is unbounded at profile corners | verified | Follows from the profile definition | none |
| 2 | Pilz synchronizes PTP joints to a lead axis | verified | [MoveIt Pilz](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) | none |
| 3 | TOTG (Kunz and Stilman, RSS 2012) uses circular blends and has open-source code | verified | [RSS 2012](https://www.roboticsproceedings.org/rss08/p27.html) | none |
| 4 | TOTG is the default time parameterization in MoveIt 2 | verified | [MoveIt time parameterization](https://moveit.picknik.ai/main/doc/examples/time_parameterization/time_parameterization_tutorial.html); also default `AddTimeOptimalParameterization` in [moveit_configs_utils ompl_planning.yaml](https://github.com/moveit/moveit2/blob/main/moveit_configs_utils/default_configs/ompl_planning.yaml) | none |
| 5 | MoveIt can follow TOTG with a Ruckig jerk-limiting pass | verified | [MoveIt time parameterization](https://moveit.picknik.ai/main/doc/examples/time_parameterization/time_parameterization_tutorial.html) | none |
| 6 | Ruckig: time-optimal, jerk-limited, to targets with nonzero velocity | verified | [Ruckig repo](https://github.com/pantor/ruckig), [Berscheid and Kroeger, RSS 2021](https://www.roboticsproceedings.org/rss17/p015.html) | none |
| 7 | Open-source Ruckig suits control cycles down to 500 µs | verified | [Ruckig repo](https://github.com/pantor/ruckig) (Community version benchmark) | none |
| 8 | Ruckig: MIT license, Pro version, used by MoveIt 2 | verified | [Ruckig repo](https://github.com/pantor/ruckig) | none |
| 9 | Tested on over 1 billion random trajectories | verified | [RSS 2021](https://www.roboticsproceedings.org/rss17/p015.html) | none |
| 10 | Pilz example limits: 1 m/s, 2.25 m/s², 1.57 rad/s | verified | [MoveIt Pilz](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) | none |
| 11 | v²/a = 0.9 rad, about 52° (labeled illustrative) | verified | Computed: 0.9 rad = 51.6° | none |
| 12 | Code sketch Ruckig Python API names | verified | [Ruckig examples/01_position.py](https://github.com/pantor/ruckig/blob/main/examples/01_position.py) | none |
| 13 | Code sketch trapezoid math | verified | Computed | none |

### collision-checking
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Simpler shapes for checking, detailed meshes for display (was flagged) | verified | [ROS 2 docs: URDF collision properties](https://github.com/ros2/ros2_documentation/blob/rolling/source/Capabilities/Simulation/URDF/Adding-Physical-and-Collision-Properties-to-a-URDF-Model.rst) | flag removed; "simplified convex shapes" dropped (not in source); reason added; cited [5] |
| 2 | FCL does overlap, distance, tolerance and continuous collision queries | verified | [FCL repo](https://github.com/flexible-collision-library/fcl) | none |
| 3 | FCL wraps meshes in a bounding volume hierarchy | verified | [FCL repo](https://github.com/flexible-collision-library/fcl) (BVHModel, OBBRSS) | none |
| 4 | FCL shapes include boxes, spheres, cylinders, capsules, meshes, octrees | verified | [FCL repo](https://github.com/flexible-collision-library/fcl) | none |
| 5 | Attached (held) objects are checked too | verified | [MoveIt Planning Scene ROS API](https://moveit.picknik.ai/main/doc/examples/planning_scene_ros_api/planning_scene_ros_api_tutorial.html) | citation [7] added |
| 6 | MoveIt can pass an OctoMap straight into FCL | verified | [MoveIt Planning Scene Monitor](https://moveit.picknik.ai/main/doc/concepts/planning_scene_monitor.html) | none |
| 7 | ACM skips neighboring links and the cup-item pair | verified | [MoveIt Planning Scene](https://moveit.picknik.ai/main/doc/examples/planning_scene/planning_scene_tutorial.html), [Setup Assistant](https://moveit.picknik.ai/main/doc/examples/setup_assistant/setup_assistant_tutorial.html), [Planning Scene ROS API](https://moveit.picknik.ai/main/doc/examples/planning_scene_ros_api/planning_scene_ros_api_tutorial.html) | citations [6] [7] added |
| 8 | MoveIt: environment checks padded, self-collision unpadded | verified | [MoveIt Planning Scene](https://moveit.picknik.ai/main/doc/examples/planning_scene/planning_scene_tutorial.html) | none |
| 9 | OMPL contains no collision checker | verified | [OMPL home](https://ompl.kavrakilab.org/) | none |
| 10 | Planner collision checking is not a certified safety function | verified | Reasoning: planning software like MoveIt is not safety-rated; certified protection is covered in guarding and safety-circuit | none |

### control-loops
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Raising P speeds response; too much oscillates, then goes unstable | verified | [NI PID Theory](https://www.ni.com/en/shop/labview/pid-theory-explained.html) | none |
| 2 | I removes steady-state error but adds overshoot | verified | [NI PID Theory](https://www.ni.com/en/shop/labview/pid-theory-explained.html) | none |
| 3 | Windup; anti-windup clamps or pauses the integral | verified | [Wikipedia integral windup](https://en.wikipedia.org/wiki/Integral_windup) (secondary); consistent with [Åström and Murray FBS wiki](https://www.cds.caltech.edu/~murray/amwiki/PID_Control.html) | marked source secondary |
| 4 | D reduces overshoot but is noise-sensitive | verified | [NI PID Theory](https://www.ni.com/en/shop/labview/pid-theory-explained.html) | none |
| 5 | D is usually filtered and often taken on the measurement | verified | [Wikipedia PID](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) (secondary); filtering also in [FBS wiki](https://www.cds.caltech.edu/~murray/amwiki/PID_Control.html) | marked source secondary |
| 6 | Cascade position, velocity, current; each inner loop much faster | verified | [Wikipedia PID](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) (secondary) | none |
| 7 | 62.5 µs loop cycles "(16 kHz)" | corrected | [Beckhoff AX5000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax5000-digital-compact-servo-drives/), [AX8000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax8000-multi-axis-servo-system/) | clarified "(16 kHz)" to "(a 16 kHz loop rate)", since AX8000 quotes 8 kHz switching; values unchanged |
| 8 | AX5000: current, speed and position control each down to 62.5 µs | verified | [Beckhoff AX5000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax5000-digital-compact-servo-drives/) | none |
| 9 | AX8000: 62.5 µs current control at 8 kHz switching, EtherCAT | verified | [Beckhoff AX8000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax8000-multi-axis-servo-system/) | none |
| 10 | UR real-time loop 500 Hz on e-Series and ur-Series | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 11 | Feedforward cannot make the loop oscillate | verified | [Wikipedia PID](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) (secondary) | none |
| 12 | Cold room: stiffer grease, higher friction, may need retuning (was flagged) | corrected | [ABB IRB 1200 product specification, p. 20](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=20) (primary, third-party host) | rewrote around what ABB states (warm-up below 10 °C; oil and grease viscosity can cause stops or lower performance); flag removed; cited [7] |
| 13 | Inner loops "run 5-10 times faster" (was flagged) | corrected | [Motion Control Tips](https://www.motioncontroltips.com/how-are-servo-system-velocity-control-loops-tuned/) (secondary) | corrected to inner-loop bandwidth 5-10 times the outer loop's; said what it depends on; flag removed; cited [8] |
| 14 | Beckhoff AX5000 and AX8000 are current products | verified | Both product pages live with no end-of-life notice | none |

### conveyor-tracking
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Encoder modules such as EL5101 have a latch input that stores the count | verified | [Beckhoff EL5101](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el5xxx-position-measurement/el5101.html) | none |
| 2 | Conveyor frame direction is calibrated by teaching two or more belt points (was flagged) | verified | [Doosan Conveyor Coordinate](https://manual.doosanrobotics.com/en/dart-bridge-manual/1.6/publish/conveyor-coordinate) | flag removed; added how Doosan does it (count and pose per taught point, counts per distance computed); cited [4] |
| 3 | KUKA.ConveyorTech syncs in the background, up to 5 linear or circular conveyors | verified | [KUKA.ConveyorTech](https://www.kuka.com/en-us/products/robotics-systems/software/application-software/kuka_conveyortech) | none |
| 4 | Up to 1024 components per conveyor | verified | [KUKA.ConveyorTech](https://www.kuka.com/en-us/products/robotics-systems/software/application-software/kuka_conveyortech) | none |
| 5 | KUKA says ConveyorTech suits assembly | verified | [KUKA.ConveyorTech](https://www.kuka.com/en-us/products/robotics-systems/software/application-software/kuka_conveyortech) | none |
| 6 | EL5101: up to 1 MHz, 4 million increments/s with 4-fold evaluation | verified | [Beckhoff EL5101](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el5xxx-position-measurement/el5101.html) | none |
| 7 | EL5101 latch input is 24 V | verified | [Beckhoff EL5101](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el5xxx-position-measurement/el5101.html) (encoder supply itself is 5 V) | none |
| 8 | Ruckig can target a moving state | verified | [Ruckig repo](https://github.com/pantor/ruckig) | none |
| 9 | 10 ms at 100 mm/s is 1 mm (labeled illustrative) | verified | Computed | none |
| 10 | Belt about 22 mm/s at 400 mm spacing and 200 plates/h | verified | Computed: 400 × 200 / 3600 = 22.2 mm/s | none |
| 11 | Other robot makers offer similar tracking packages (was flagged) | verified | [Doosan Conveyor Coordinate](https://manual.doosanrobotics.com/en/dart-bridge-manual/1.6/publish/conveyor-coordinate), [Mitsubishi CR800 manual p. 61](https://manualslib.com/manual/1851536/Mitsubishi-Electric-Cr800-Series.html?page=61) (primary, third-party host) | flag removed; two named examples added; cited [4] [5] |

## Area 7, Classical robot software (part A): analogy and precision review

Scope: the area intro plus frames, forward-kinematics, inverse-kinematics, motion-planning, trajectory-generation, collision-checking, control-loops and conveyor-tracking. `node tools/build-content.mjs --check knowledge/07-classical-software.md` reports 0 errors and 0 warnings after these edits. No `[unverified]` flag is in scope.

The biggest problem was not the analogies. Several cheese plate examples did not match the line as the rest of the knowledge base designs it:
- The tray belt indexes: it moves one step, then stops (06 conveyor, 04 photo-eye).
- The apple and cheese stations are 4-axis deltas, and the grape station is a 6-axis arm (01 robot bodies).
- The cheese station uses a V-notch parallel gripper, not a suction cup (03 end effectors).

In this file, trays moved continuously and were tracked. Apple slices were leaned at 35° by a 6-axis arm. A 6-joint serial chain and a suction cup ran the cheese station. The examples below were moved or rewritten to match the line.

### Analogies
| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| frames | kept | — | — |
| forward-kinematics | kept | — | — |
| inverse-kinematics | kept | — | — |
| motion-planning | kept | — | — |
| trajectory-generation | kept | — | — |
| collision-checking | rewritten (same picture, corrected motion) | "Sliding cardboard cutouts around" suggests the whole sweep of a motion gets checked continuously. Planners actually check separate snapshots, and a thin obstacle can fall between two of them. That is the gap continuous collision checking closes. | Laying cardboard cutouts on a floor plan, one arrangement at a time. Break: the shapes are 3D, they change with every joint angle, and a motion is checked as snapshots. |
| control-loops | kept | — | — |
| conveyor-tracking | kept | — | — |

Notes on kept analogies:
- frames (street address system with its own north): the analogy holds. Its break was rewritten. The old break said addresses "only describe position", but Plain already gives each system its own north. The real gaps are a full 3D rotation and order dependence: rotating then shifting differs from shifting then rotating. The new break names both.
- forward-kinematics (walking directions with relative turns): this correctly predicts that each turn is relative to the current heading, and that an early error grows further out the chain. The break covers 3D axes and model error.
- inverse-kinematics (reaching for a cup on a shelf): this predicts several postures, unreachable targets and awkward stretched postures, all correct. The break covers exact computation and the discrete postures of a 6-axis arm.
- motion-planning (moving a couch through an apartment): this is the classic piano-movers picture. The break now also says the route is computed before the arm moves. Without that, a reader would expect the planner to dodge something that appears mid-motion, the way a person carrying a couch would.
- trajectory-generation (driver on a known route): this correctly predicts slowing for corners and never reaching cruise speed on a short trip (the triangle profile).
- control-loops (lane keeping): this correctly predicts lag with too little gain and zig-zag with too much. The break names feedforward and nested loops.
- conveyor-tracking (relay baton pass): this correctly predicts intercepting the runner and matching speed. The break names the key gap: the item is seen once and then dead-reckoned (tracked by counting belt travel instead of looking again).

### Other fixes
- intro: defined "deterministic". "Runs this whole stack" became "much of this stack", since most stations use taught paths, not a planner.
- intro: conveyor tracking now follows the slice on its infeed belt, not a moving tray, because the tray belt indexes.
- frames: defined re-normalized, interpolation and filtering in plain words.
- frames: the misconception Reality now has a concrete case. Yaw 179° and -179° are 2° apart, but their average, 0°, faces the opposite way.
- frames (cheese plate): "leaning 35° against the divider wall" became "turned 30° to line up with the compartment". The apple station is a 4-axis delta, which cannot tilt.
- frames (cheese plate): the slice now rides a moving belt frame and the tray frame stays put while stopped. The tf2 time-lookup example, the Connects to line and a code comment were updated to match.
- forward-kinematics: defined "serial arm" against a delta. Alpha is now defined as an angle measured around the common normal (the shortest line between the two joint axes), not just "twist". Removed "where the tool actually is", because FK gives the modeled position, not the true one.
- forward-kinematics (cheese plate): moved from the cheese station to the grape station's 6-axis arm. A 6-encoder serial chain and a suction cup do not fit the cheese delta and its parallel gripper. The tool swap is now a longer finger set (80 to 140 mm). The code comment was updated.
- forward-kinematics (cheese plate): dropped "TCP speed limits enforced near people", because the pick cells are fenced (04 sensors).
- forward-kinematics: the ABB 8-15 mm figure is now dated in the text as a 2005 brochure.
- inverse-kinematics: defined pseudoinverse and damped least squares in plain words.
- inverse-kinematics: TRAC-IK's "improved Newton-style solver" (undefined) became what the source says: an improved KDL solver that detects when joint limits have trapped it.
- inverse-kinematics (cheese plate): rewritten around the grape station. Bunches lie in a tote at random angles and the gripper must tilt under the stem, which is why that station needs 6 axes and the apple station does not. The old "late tray drifts out of reach" scenario was impossible with an indexing tray belt. It became a bunch against the far tote wall, where IK finds no usable posture. "Vacuum hose" became the soft gripper's air line.
- inverse-kinematics: a code comment still said the seed gives "the nearest posture", which contradicted the fact checker's correction to "usually one near the seed". Fixed.
- motion-planning: defined local minima.
- motion-planning (cheese plate): the cracker station's taught points are valid because the tray stops at the station. The grape bin became a tote, matching 01.
- motion-planning: the time budget is now about 4 s per apple pick after the 1-2 s tray step, matching 01 and 06. It was 4.5 s.
- trajectory-generation: defined "online" generator.
- trajectory-generation (cheese plate): the grip-limited example moved from a suction-held cheese wedge to a vacuum-held apple slice, because cheese uses a parallel gripper. The code's payload and target names changed to match.
- trajectory-generation (cheese plate): the grape pendulum mechanism is now accurate. The bunch leans back while the arm speeds up, and abrupt acceleration changes, above all the sudden end of braking, leave it swinging. The old text said only that "abrupt changes in acceleration set it swinging".
- trajectory-generation: the misconception was close to a tautology ("the fastest motion is the one at maximum speed"). It is now a belief people actually hold: that a higher speed limit makes short moves proportionally faster. Reality is tied to the 52° key number.
- collision-checking: defined capsules.
- collision-checking (cheese plate): the example now says the station runs no planner but checks each adjusted pick and place path. Before, it read as if the cheese station planned, which contradicted "most of the line needs no planner". The ACM now lets the gripper fingers touch the wedge, not a cup. The code comment was updated.
- control-loops: oscillation, instability, overshoot and saturated are now defined at first use. Overshoot and oscillation used to be defined only at the end of the paragraph.
- control-loops: added why inner loops must be faster (5-10x the outer loop's bandwidth, or they cannot keep up with its commands) and why tuning starts innermost, cited to [8].
- control-loops (cheese plate): the windup story said the arm "jumps when the cup lifts off". It now says the gripper presses the wedge harder and harder, then lingers and overshoots upward as the stored value drains away, per [6]. "Releasing the vacuum" became "opening the gripper".
- control-loops (cheese plate): the IRB 1200 cold-room claim was incomplete (see spot-checks). The text now says that model is not rated for a 2-4 °C room, and the source [7] line lists the operating range.
- conveyor-tracking (cheese plate): rewritten. The tray belt indexes, so tracking is applied to apple slices on the continuous infeed belt. The encoder count is latched at each camera image, and the delta picks while moving with the belt and places into the stopped tray. Latency at an illustrative 50 mm/s is 0.5 mm per 10 ms, so slip and calibration dominate. An unpicked slice leaves the tracking window into a catch bin.
- conveyor-tracking: the "22 mm/s continuous tray belt" key number was replaced with the infeed latency figure. The code sketch now tracks slices on the infeed belt (camera latch, intercept, pick while synchronized, place in the stopped tray). The Connects to line for frames was updated.

Flag for another owner (not edited, outside my file): 01-robot-bodies.md suggests a hygienic ABB IRB 1200 for the grape station. The IRB 1200 product specification lists +5 °C as its lowest operating ambient (+5 to +35 °C with food-grade lubrication), so it is not rated for the 2-4 °C room.

### Spot-checks of the fact check
| Claim | Source opened | Result |
|---|---|---|
| Real arm vs ideal model typically 8-15 mm from tolerances and deflection; about 0.5 mm after Absolute Accuracy | [ABB Absolute Accuracy brochure](https://library.e.abb.com/public/0f879113235a0e1dc1257b130056d133/Absolute%20Accuracy%20EN_R4%20US%2002_05.pdf) (PDF text extracted locally) | Confirmed. The text says "typically 8-15mm, resulting from mechanical tolerances and deflection" and "approx 0.5 mm". The brochure is from 2005, so the text now dates it. |
| Up to 8 IK solutions for spherical-wrist arms; FANUC CRX up to 16 | [Elias and Wen 2025, arXiv 2501.18505v2](https://arxiv.org/html/2501.18505v2) | Confirmed |
| UR real-time loop 500 Hz on e-Series and ur-Series | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | Confirmed |
| AX5000 current, speed and position control each down to 62.5 µs | [Beckhoff AX5000](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax5000-digital-compact-servo-drives/) | Confirmed ("minimum 62.5 µs" for all three) |
| KUKA.ConveyorTech: up to 5 conveyors, linear and circular, 1024 components per conveyor, background sync, assembly use | [KUKA.ConveyorTech](https://www.kuka.com/en-us/products/robotics-systems/software/application-software/kuka_conveyortech) | Confirmed |
| Ruckig Community version suits cycles down to 500 µs; MIT license; Pro version; used by MoveIt 2 | [pantor/ruckig](https://github.com/pantor/ruckig) | Confirmed |
| Pilz example limits 1 m/s, 2.25 m/s², 1.57 rad/s; lead-axis synchronization; trapezoidal profiles | [MoveIt Pilz planner](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) | Confirmed |
| IRB 1200: warm-up recommended below 10 °C because of oil and grease viscosity (used to say gains may need retuning in the 2-4 °C room) | [IRB 1200 product specification p. 20, 3HAC046982-001, via ManualsLib](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=20) | Failed in context. The warm-up statement is accurate, but the same page lists manipulator operation at +5 to +45 °C (+5 to +35 °C with food-grade lubrication). The example implied the robot could run in a 2-4 °C room with only retuning. Fixed in text and in the source line. |
| Inner-loop bandwidth 5-10x the outer loop's | [Motion Control Tips](https://www.motioncontroltips.com/how-are-servo-system-velocity-control-loops-tuned/) (secondary) | Confirmed. The page also says the fastest loop is tuned first, which is now used in Precise. |
| Each inner loop must respond much faster (cited to Wikipedia PID [2]) | [Wikipedia PID controller](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) (secondary) | Partly. The cascade section describes the inner loop as faster but states no rule. The "must" is now also cited to [8], which states it. |
| EL5101: up to 1 MHz, 4 million increments/s with 4-fold evaluation, 24 V latch input | [Beckhoff EL5101](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el5xxx-position-measurement/el5101.html) | Confirmed |
| Doosan singularities: wrist (axis 5 near 0), shoulder (axes 1 and 6 in line), elbow (axis 3 near 0); joint speeds spike in linear moves, joint moves unaffected | [Doosan e-Series manual: Singularity](https://manual.doosanrobotics.com/en/user-manual/3.2.0/3-e-series/singularity) | Confirmed |
| MoveIt 2 falls back to RRTConnect when no default planner config is set | [moveit2 ompl_interface.cpp](https://github.com/moveit/moveit2/blob/main/moveit_planners/ompl/ompl_interface/src/ompl_interface.cpp) (read via gh api) | Confirmed (`default_pc.config["type"] = "geometric::RRTConnect"`) |

## Area 7, Classical robot software (part B): fact check

Summary line: 173 claims checked: 155 verified, 12 corrected, 6 unverifiable (4 kept flagged, 2 removed).

Scope: state-machines, perception, grasp-planning, ros2, moveit, opencv, vendor-languages, plc-programming in `knowledge/07-classical-software.md`. Validator: `node tools/build-content.mjs --check knowledge/07-classical-software.md` reports 0 errors and 0 warnings after these edits.

Notes:
- Seven `[unverified]` flags were in scope at the start. Four are resolved: Yaskawa MOVJ/MOVL, Epson SPEL+, the ABB-SoftBank deal, and Rockwell Studio 5000. Three stay flagged: the spot-welding re-teach practice, the illustrative code-sketch lines, and the airport baggage practice. One new flag was added: "plants tend to standardize on one brand".
- The shared web-search quota ran out partway through the PLC checks. After that, claims were checked only by fetching known URLs, so the airport baggage claim could not be retried.
- These vendor pages blocked fetches: ABB's own news pages (timed out), rockwellautomation.com (403), codesys.com (429), and the ROS wiki and docs.ros.org (bot wall). Fallbacks used: the SoftBank press release plus Robotics 24/7 (secondary) for the ABB deal; MathWorks (secondary) for Studio 5000; ABB's Automation Builder help for CODESYS; and the GitHub sources of REP 2000 and ros2_documentation for ROS distributions.
- Secondary sources kept because no loadable primary was found: Wikipedia (the IEC 61131-3 IL deprecation and POU types, the PLC scan cycle and history, SFC parallelism), MathWorks (Studio 5000), and Robotics 24/7 (ABB deal status).
- Release dates without a year on GitHub pages (py_trees 2.6.0, OpenCV 5.1.0, Open3D 0.20.0, BehaviorTree.CPP 4.11.0) were confirmed through the GitHub API (`gh api repos/.../releases`).

### state-machines
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | SMACH is a Python task framework with ROS integration; its repo has a ros2 branch | verified | [executive_smach](https://github.com/ros/executive_smach) | none (ros2 is now the default branch) |
| 2 | YASMIN: ROS 2 state machine library in C++ and Python, with default states and a web viewer | verified | [arXiv 2205.13284](https://arxiv.org/abs/2205.13284v1) | none |
| 3 | A tick is sent from the root and propagates down to the leaves | verified | [BT basics, v4.11](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none |
| 4 | Node results are SUCCESS, FAILURE, RUNNING | verified | [BT basics](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none |
| 5 | A Sequence stops at the first failure | verified | [BT basics](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none |
| 6 | A Fallback runs children until one succeeds | verified | [BT basics](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none |
| 7 | RetryUntilSuccessful re-ticks a failed child up to num_attempts times | corrected | [BT.CPP Decorators](https://www.behaviortree.dev/docs/nodes-library/DecoratorNode) | cited source [1] only shows a node called "Retry"; citation moved to new source [10], which names RetryUntilSuccessful |
| 8 | Conditions never return RUNNING | verified | [BT basics](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none |
| 9 | Colledanchise and Ögren: BTs are modular and reactive | verified | [arXiv 1709.00084](https://arxiv.org/abs/1709.00084) | none |
| 10 | BehaviorTree.CPP treats asynchronous (non-blocking) actions as first-class | verified | [BT.CPP README](https://raw.githubusercontent.com/BehaviorTree/BehaviorTree.CPP/master/README.md) | none |
| 11 | MoveIt Pro has RepeatUnlessFailureWithinTick (repeats a child within one tick) | verified | [MoveIt Pro API](https://docs.picknik.ai/api/files/behavior/include/moveit-pro-behavior/behaviors/core/repeat-unless-failure-within-tick-hpp/) | none |
| 12 | py_trees: a Sequence with memory skips to the RUNNING child; one without memory re-checks earlier children | verified | [py_trees composites](https://py-trees.readthedocs.io/en/release-2.4.x/composites.html) | none (the no-memory behavior is implied by the page's guard-condition note) |
| 13 | BT.CPP trees are XML loaded at run time and edited in Groot2 | verified | [BT.CPP README](https://raw.githubusercontent.com/BehaviorTree/BehaviorTree.CPP/master/README.md) | none |
| 14 | BT.CPP documentation is at version 4.11 | verified | [BT basics](https://www.behaviortree.dev/docs/learn-the-basics/BT_basics/) | none (release 4.11.0 tagged 8 Nov 2026; the README title still says 4.9) |
| 15 | py_trees 2.6.0 released September 2026 | verified | [py_trees 2.6.0](https://github.com/splintered-reality/py_trees/releases/tag/2.6.0) | none (10 Sep 2026, per GitHub API) |
| 16 | MoveIt Pro behaviors are built on BehaviorTree.CPP | verified | [MoveIt Pro API](https://docs.picknik.ai/api/files/behavior/include/moveit-pro-behavior/behaviors/core/repeat-unless-failure-within-tick-hpp/) | none (the header includes behaviortree_cpp's repeat node) |
| 17 | A high-level state machine sends a waypoint goal as an action, gets feedback, can cancel | verified | [ROS 2 Actions](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/About-Actions.rst) | none |
| 18 | 18 s per tray and about 6 s per wedge at 200 plates/h | verified | arithmetic (3600/200 = 18; 18/3 = 6) | none; labeled as arithmetic |
| 19 | Code sketch: Repeat num_cycles and RetryUntilSuccessful num_attempts are real BT.CPP v4 ports | verified | [BT.CPP Decorators](https://www.behaviortree.dev/docs/nodes-library/DecoratorNode) | none |

### perception
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Detections carry a mask, class label, and confidence | verified | [Ultralytics Segment](https://docs.ultralytics.com/tasks/segment/) | none |
| 2 | Modern neural networks are poorly calibrated | verified | [Guo et al. 2017](https://arxiv.org/abs/1706.04599) | none |
| 3 | Networks tend to be overconfident | verified | [Guo et al., full text](https://ar5iv.labs.arxiv.org/html/1706.04599) | none (the paper shows ResNet overconfidence, which grows with capacity) |
| 4 | Template matching slides the template, scores each position, and takes the best (minMaxLoc) | verified | [OpenCV template matching](https://raw.githubusercontent.com/opencv/opencv/4.x/doc/py_tutorials/py_imgproc/py_template_matching/py_template_matching.markdown) | none |
| 5 | It compares at one size and angle only | verified | same | none (follows from the translation-only sliding the page describes; the page does not say it outright) |
| 6 | The score map is (W-w+1) by (H-h+1) | verified | same | none |
| 7 | Mask R-CNN (2017) adds a mask branch to a detector | verified | [arXiv 1703.06870](https://arxiv.org/abs/1703.06870) | none |
| 8 | Mask R-CNN runs at about 5 fps | verified | same | none |
| 9 | YOLO26n-seg takes about 2 ms on a T4 with TensorRT | verified | [Ultralytics Segment](https://docs.ultralytics.com/tasks/segment/) | none (2.1 ms, COCO val, batch 1) |
| 10 | YOLO26n-seg takes about 53 ms on a CPU with ONNX | verified | same | none (53.3 ms) |
| 11 | FoundationPose estimates and tracks the pose of novel objects from a CAD model or reference images | verified | [arXiv 2312.08344](https://arxiv.org/abs/2312.08344) | none |
| 12 | BOP 2024: the best unseen-object method is within about 4% of the best 2023 seen-object method | verified | [arXiv 2504.02812](https://arxiv.org/abs/2504.02812v3) | none |
| 13 | That method needs 24.9 s per image | verified | same | none |
| 14 | A practical entry (Co-op) takes 0.8 s per image | verified | same | none |
| 15 | Unseen-object 2D detection is about 35% behind seen-object detection | verified | same | none |
| 16 | HALCON covers matching, 3D matching, measurement, calibration, and deep learning | verified | [MVTec HALCON](https://www.mvtec.com/products/halcon) | none (marketing page, light on detail) |
| 17 | BOP has an "annual" challenge | corrected | [arXiv 2504.02812](https://arxiv.org/abs/2504.02812v3) | "annual challenge" changed to "a recurring public challenge; the 2024 edition was the sixth" |
| 18 | Illustrative values (0.8 threshold, belt color, blob area band) are labeled | verified | file text | none |

### grasp-planning
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Dex-Net 3.0's contact model scores seal formation and resistance to the object's weight | verified | [arXiv 1709.06670](https://arxiv.org/abs/1709.06670) | none |
| 2 | Dex-Net 3.0 trained on 2.8 million synthetic point clouds | verified | same | none |
| 3 | Dex-Net 3.0: 98% / 82% / 58% on basic / typical / adversarial objects | verified | same | none |
| 4 | GPD: a frictionless antipodal grasp is force closure for any nonzero friction | verified | [GPD, ar5iv](https://ar5iv.labs.arxiv.org/html/1706.09911) | none |
| 5 | GPD samples thousands of geometric candidates and classifies them with a small CNN | verified | same | none ("several thousand"; 4-layer CNN) |
| 6 | Dex-Net 2.0 trained on 6.7 million synthetic examples | verified | [arXiv 1703.09312](https://arxiv.org/abs/1703.09312) | none |
| 7 | Dex-Net 2.0 plans in 0.8 s | verified | same | none |
| 8 | Dex-Net 2.0 reaches 93% success on known objects | verified | same | none (eight known objects with adversarial geometry) |
| 9 | Dex-Net 4.0 learned to choose between suction and parallel jaws | verified | [Dex-Net project page](https://berkeleyautomation.github.io/dex-net/) | none |
| 10 | Dex-Net 4.0 clears bins of up to 25 novel objects with over 95% reliability | verified | same | none |
| 11 | Dex-Net 4.0 exceeds 300 mean picks per hour | verified | same | none |
| 12 | Contact-GraspNet (ICRA 2021) trained on 17 million simulated grasps | verified | [arXiv 2103.14127](https://arxiv.org/abs/2103.14127) | none |
| 13 | Contact-GraspNet exceeds 90% success on unseen objects in structured clutter | verified | same | none |
| 14 | AnyGrasp: 93.3% success clearing bins of 300+ unseen objects | verified | [arXiv 2212.08333](https://arxiv.org/abs/2212.08333) | none |
| 15 | AnyGrasp exceeds 900 mean picks per hour | verified | same | none |
| 16 | AnyGrasp re-detects grasps continuously and caught moving objects | verified | same | none (it caught swimming robot fish) |
| 17 | GQ-CNN code last updated in 2024 | verified | [gqcnn](https://github.com/BerkeleyAutomation/gqcnn) | none (pushed 25 Apr 2024, per GitHub API) |
| 18 | AnyGrasp SDK still updated in 2026 | verified | [anygrasp_sdk](https://github.com/graspnet/anygrasp_sdk) | none (pushed 13 Jul 2026, per GitHub API) |
| 19 | Ambi Robotics sells AmbiSort and AmbiStack as of 2026 | verified | [Ambi Robotics](https://www.ambirobotics.com/) | none (no acquisition notice) |
| 20 | A triangle's centroid sits one third of the way from the base edge toward the tip | verified | geometry (centroid lies on each median, one third from the side) | none |
| 21 | Code sketch: the friction cone half-angle is arctan(mu) | verified | Coulomb friction definition | none |

### ros2
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Nodes exchange typed messages defined in .msg, .srv, and .action files | verified | [Interfaces](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/Interfaces-Topics-Services-Actions.rst) | none |
| 2 | Topics are publish/subscribe: one-way, asynchronous, many publishers and subscribers | verified | same | none |
| 3 | Services are request/response calls for short tasks | verified | same | none |
| 4 | Actions: goal, feedback, cancel | verified | [Actions](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/About-Actions.rst) | none |
| 5 | Parameters are per-node values set from launch files, YAML, or the CLI, at startup or at runtime | verified | [Parameters](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/About-Parameters.rst) | none |
| 6 | tf2 keeps a time-buffered frame tree that works across computers | verified | [Tf2](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/Working-with-interfaces/About-Tf2/About-Tf2.rst) | none |
| 7 | The default RMW is Fast DDS | verified | [REP 2000](https://reps.openrobotics.org/rep-2000/); [Lyrical supported platforms (source)](https://github.com/ros2/ros2_documentation/blob/rolling/source/Releases/lyrical/supported-platforms.rst) | none (default in both Kilted and Lyrical) |
| 8 | Cyclone DDS and RTI Connext are Tier 1 | verified | same | none |
| 9 | Kilted added Zenoh as Tier 1 | verified | [REP 2000 source](https://github.com/ros-infrastructure/rep/blob/master/rep-2000.rst) | none (Zenoh is absent from Jazzy's table; Tier 1 in Kilted and Lyrical) |
| 10 | QoS policies: history, depth, reliability, durability, deadline, lifespan, liveliness | verified | [QoS settings](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/topics/About-Quality-of-Service-Settings.rst) | none |
| 11 | Default QoS: keep last 10, reliable, volatile | verified | same | none |
| 12 | "Reliable" is implemented over UDP | verified | same | none |
| 13 | Incompatible profiles prevent delivery | verified | same | none |
| 14 | A best-effort camera with a reliable subscriber is a "silent" failure | corrected | [QoS settings](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/topics/About-Quality-of-Service-Settings.rst); [rclpy event_handler.py](https://raw.githubusercontent.com/ros2/rclpy/rolling/rclpy/rclpy/event_handler.py) | "silent failure" changed to "no images arrive and the only sign is an incompatible-QoS warning in the log"; added source [12] (rclpy logs this warning by default) |
| 15 | Real-time needs PREEMPT_RT or Xenomai and code that avoids page faults, allocation, and blocking | verified | [Real-time programming](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/Capabilities/Motion-planning/Real-Time-Programming.rst) | none |
| 16 | ros2_control: the controller manager runs a read, update, write loop against hardware plug-ins | verified | [ros2_control getting started](https://control.ros.org/rolling/doc/getting_started/getting_started.html) | none |
| 17 | FANUC's driver is official, ros2_control based, with Jazzy on main and a 1 kHz mode guide | verified | [FANUC driver docs](https://fanuc-corporation.github.io/fanuc_driver_doc/main/index.html) | none |
| 18 | The FANUC driver is open source | verified | [fanuc_driver repo](https://github.com/FANUC-CORPORATION/fanuc_driver) | added source [11] (Apache-2.0, copyright FANUC America and FANUC CORPORATION); the docs page does not state a license |
| 19 | Humble is LTS, end of life May 2027 | verified | [REP 2000](https://reps.openrobotics.org/rep-2000/) | none |
| 20 | Jazzy is LTS, end of life May 2029 | verified | same | none |
| 21 | Kilted is non-LTS, May 2025 to November 2026 | verified | same | none (reaches end of life this month) |
| 22 | Lyrical Luth: LTS, released 22 May 2026, supported to May 2031, Tier 1 on Ubuntu 26.04 and Windows 11 | verified | [Lyrical release post](https://discourse.openrobotics.org/t/ros-2-lyrical-luth-released/55021) | none |
| 23 | "Lyrical and Jazzy are the current LTS distributions" | corrected | [REP 2000](https://reps.openrobotics.org/rep-2000/) | changed to "the two newest LTS distributions; the older Humble Hawksbill LTS is supported until May 2027" |
| 24 | The sensor-data QoS profile is best effort | verified | [QoS settings](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/topics/About-Quality-of-Service-Settings.rst) | none |
| 25 | Support windows: 5 years for an LTS, about 1.5 years for a non-LTS | verified | [REP 2000](https://reps.openrobotics.org/rep-2000/); [Lyrical release post](https://discourse.openrobotics.org/t/ros-2-lyrical-luth-released/55021) | none |

### moveit
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | MoveIt 2 development is led by PickNik | verified | [moveit2 repo](https://github.com/moveit/moveit2) | none |
| 2 | Stable branches for Humble, Jazzy, and Kilted as of 2026 | verified | same | added "and buildfarm binaries for Lyrical as of November 2026" (README buildfarm table; no lyrical branch) |
| 3 | move_group pulls the components together behind ROS actions and services | verified | [move_group](https://moveit.picknik.ai/main/doc/concepts/move_group.html) | none |
| 4 | It reads the URDF and the SRDF; the SRDF is usually made with the Setup Assistant | verified | same | none |
| 5 | It reads /joint_states and listens to TF | verified | same | none |
| 6 | It executes plans as a FollowJointTrajectory client | verified | same | none |
| 7 | Interfaces: MoveGroupInterface (C++) and the RViz plugin | verified | same | none |
| 8 | MoveItPy is "Python bindings to a subset of the C++ API" | corrected | [moveit_py README](https://github.com/moveit/moveit2/tree/main/moveit_py) | "subset" is unsupported; changed to "a Python library built on generated bindings to MoveIt's C++ core"; added source [9] |
| 9 | OMPL is the default planner | verified | [Motion Planning](https://moveit.picknik.ai/main/doc/concepts/motion_planning.html) | none |
| 10 | Pilz and CHOMP are available by default | verified | same | none |
| 11 | Pilz makes point-to-point, straight-line, and circular moves "like an industrial controller" | corrected | [Pilz guide](https://moveit.picknik.ai/main/doc/how_to_guides/pilz_industrial_motion_planner/pilz_industrial_motion_planner.html) | the cited concept page only names Pilz; reworded to PTP/LIN/CIRC with trapezoidal velocity profiles ("standard robot motions"), cited new source [8] |
| 12 | Request adapters: fix start bounds, default workspace, fix start collision, resolve constraint frames | verified | [Motion Planning](https://moveit.picknik.ai/main/doc/concepts/motion_planning.html) | none |
| 13 | AddTimeParameterization applies velocity and acceleration limits | verified | same | none |
| 14 | Collision checking is on by default, including self-collision and attached objects | verified | same | none |
| 15 | The Planning Scene Monitor maintains the scene; attached objects are rigid | verified | [move_group](https://moveit.picknik.ai/main/doc/concepts/move_group.html) | none |
| 16 | Servo inputs: joint jog, twist, pose | verified | [Realtime Servo](https://moveit.picknik.ai/main/doc/examples/realtime_servo/realtime_servo_tutorial.html) | none |
| 17 | Servo outputs joint position or velocity commands | verified | same | none (JointTrajectory or Float64MultiArray) |
| 18 | Servo slows near singularities and collisions and enforces joint limits | verified | same | none |
| 19 | Smoothing plug-ins: Butterworth, acceleration-limited, Ruckig | verified | same | none |
| 20 | The C++ class is Servo; the ROS wrapper is ServoNode | verified | same | none |
| 21 | Servo is used for teleoperation and visual servoing | verified | same | none |
| 22 | Servo needs a controller that accepts positions or velocities | verified | same | none |
| 23 | MoveIt Task Constructor is listed in Concepts | verified | [Concepts](https://moveit.picknik.ai/main/doc/concepts/concepts.html) | none |
| 24 | MoveIt Pro is the commercially supported version | verified | [moveit2 repo](https://github.com/moveit/moveit2) | none |
| 25 | The default workspace is a 10 m cube | verified | [Motion Planning](https://moveit.picknik.ai/main/doc/concepts/motion_planning.html) | none |
| 26 | Code sketch MoveItPy calls match the tutorial (execute(traj, controllers=[]), set_goal_state, read_write) | verified | [MoveItPy tutorial](https://moveit.picknik.ai/main/doc/examples/motion_planning_python_api/motion_planning_python_api_tutorial.html) | none |

### opencv
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | OpenCV is a C++ library with Python bindings | verified | [opencv repo](https://github.com/opencv/opencv); [Python tutorial](https://raw.githubusercontent.com/opencv/opencv/4.x/doc/py_tutorials/py_imgproc/py_template_matching/py_template_matching.markdown) | none |
| 2 | It has template matching and minMaxLoc | verified | same | none |
| 3 | solvePnP finds an object pose from 3D-2D correspondences | verified | [calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 4 | It has a Deep Neural Network module | verified | [dnn.hpp](https://raw.githubusercontent.com/opencv/opencv/5.x/modules/dnn/include/opencv2/dnn.hpp) | none |
| 5 | The newest release is 5.1.0 (November 2026) | verified | [OpenCV 5.1.0](https://github.com/opencv/opencv/releases/tag/5.1.0) | none (6 Nov 2026; the 4.x line continues, 4.14.0 in Jul 2026) |
| 6 | The 5.x point cloud module has outlier removal, "normal estimation", and bounding boxes | corrected | [ptcloud.hpp](https://raw.githubusercontent.com/opencv/opencv/5.x/modules/ptcloud/include/opencv2/ptcloud.hpp) | the header declares normal orientation functions; normalEstimate lives elsewhere; changed to "normal orientation" |
| 7 | PCL is BSD-licensed, with the listed modules | verified | [pointclouds.org](https://pointclouds.org/) | none |
| 8 | PCL is a C++ library | verified | [PCL repo](https://github.com/PointCloudLibrary/pcl) | none (repo language metadata; the site does not say) |
| 9 | PCL 1.15.1 released August 2025 | verified | [PCL 1.15.1](https://github.com/PointCloudLibrary/pcl/releases/tag/pcl-1.15.1) | none (26 Aug 2025) |
| 10 | Open3D: voxel downsampling, normals, plane segmentation, DBSCAN, oriented boxes | verified | [Open3D point cloud tutorial](https://www.open3d.org/docs/release/tutorial/geometry/pointcloud.html) | none (docs header shows 0.19.0) |
| 11 | Open3D has C++ and Python APIs | verified | [Open3D v0.20.0](https://github.com/isl-org/Open3D/releases/tag/v0.20.0) | none |
| 12 | Open3D 0.20.0 released September 2026 | verified | same | none (16 Sep 2026) |
| 13 | Tutorial RANSAC settings: 1 cm, 3 points, 1000 iterations | verified | [Open3D tutorial](https://www.open3d.org/docs/release/tutorial/geometry/pointcloud.html) | none |
| 14 | DBSCAN label -1 means noise | verified | same | none |
| 15 | RANSAC samples at random, so runs can differ | verified | same | none (the page says sampling is random; it does not discuss reproducibility) |
| 16 | Cheese-line settings (2 mm, 3 mm, 8 mm, 35 mm) are labeled illustrative | verified | file text | none |
| 17 | Depalletizing pipeline uses the same building blocks | verified | [Open3D tutorial](https://www.open3d.org/docs/release/tutorial/geometry/pointcloud.html) | none |

### vendor-languages
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Switching brands is one reason plants standardize on one brand | unverifiable | none found | flagged `[unverified: industry practice, no source found]` |
| 2 | Joint, linear, circular moves, each with a blend or zone setting | verified | [ros_movesm.ls](https://raw.githubusercontent.com/ros-industrial/fanuc/noetic-devel/fanuc_driver/tpe/ros_movesm.ls) (CNT); [ROS_motion.mod](https://raw.githubusercontent.com/ros-industrial/abb_driver/melodic-devel/rapid/ROS_motion.mod) (z10, fine) | none |
| 3 | FANUC TP: the quoted line 22, which waits on flags and moves to a position register | verified | [ros_movesm.ls](https://raw.githubusercontent.com/ros-industrial/fanuc/noetic-devel/fanuc_driver/tpe/ros_movesm.ls) | none (line matches exactly) |
| 4 | KAREL loop reads joints with CURJPOS | verified | [ros_state.kl](https://raw.githubusercontent.com/ros-industrial/fanuc/noetic-devel/fanuc_driver/karel/ros_state.kl) | none |
| 5 | KAREL is "compiled" | unverifiable | none loadable (ROS wiki blocked; search quota out) | removed "compiled" |
| 6 | KAREL is Pascal-like | verified | [ros_state.kl](https://raw.githubusercontent.com/ros-industrial/fanuc/noetic-devel/fanuc_driver/karel/ros_state.kl) | none (PROGRAM/VAR/CONST/BEGIN/END syntax) |
| 7 | RAPID: modules and procedures; MoveAbsJ takes a target, speed, zone, tool | verified | [ROS_motion.mod](https://raw.githubusercontent.com/ros-industrial/abb_driver/melodic-devel/rapid/ROS_motion.mod) | none |
| 8 | KRL: PTP with axis angles, then RSI corrections | verified | [ros_rsi.src](https://raw.githubusercontent.com/ros-industrial/kuka_experimental/melodic-devel/kuka_rsi_hw_interface/krl/KR_C4/ros_rsi.src) | none |
| 9 | INFORM .JBI jobs with DOUT, WAIT, TIMER | verified | [ROS_R1.JBI](https://raw.githubusercontent.com/ros-industrial/motoman/noetic-devel/motoman_driver/Inform/DX100/single_arm_with_ext_axis/ROS_R1.JBI) | none |
| 10 | INFORM has MOVJ and MOVL for motion | verified | [YRC1000 INFORM Language](https://knowledge.motoman.com/hc/en-us/articles/4407425435927-YRC1000-INFORM-LANGUAGE) | flag removed; cited new source [8] |
| 11 | URScript is Python-like | verified | [external_control.urscript](https://raw.githubusercontent.com/UniversalRobots/Universal_Robots_Client_Library/master/resources/external_control.urscript); [UR Script Manual 3.5.4](https://tools.pages.cba.mit.edu/Universal_Robotics_UR10_Robot_Arm/scriptManual-3.5.4.pdf) (university mirror, secondary hosting) | none (def/if/elif/while with colons, closed by `end`) |
| 12 | URScript movej, movel, servoj; servoj streams a target every control step | verified | [external_control.urscript](https://raw.githubusercontent.com/UniversalRobots/Universal_Robots_Client_Library/master/resources/external_control.urscript) | none (`servoj(q, t=steptime)`; `movel(q)` at line 1040) |
| 13 | SPEL+ is BASIC-like | verified | [Epson: The SPEL+ Language](https://download.epson.biz/robots/ww/data/html/UsersGuide/en/070/070-010/070-010-010.html) | flag removed; cited new source [9] |
| 14 | SPEL+ Go, Move, and Jump (an arch motion made for pick and place) | verified | [Epson command summary](https://download.epson.biz/robots/ww/data/html/SPEL/en/020/020-010/020-010-010.html); [Epson Jump](https://download.epson.biz/robots/ww/data/html/SPEL/en/030/030-140/030-140-010/030-140-010-220.html) | flag removed; added that Jump is for SCARA robots (6-axis arms use Jump3); cited new [10][11] |
| 15 | ABB RAPID loop waits 0.05 s between checks for a new trajectory | verified | [ROS_motion.mod](https://raw.githubusercontent.com/ros-industrial/abb_driver/melodic-devel/rapid/ROS_motion.mod) | none |
| 16 | UR's client library runs URScript that streams servoj | verified | [external_control.urscript](https://raw.githubusercontent.com/UniversalRobots/Universal_Robots_Client_Library/master/resources/external_control.urscript) | none |
| 17 | FANUC documents its ROS 2 driver alongside ROBOGUIDE | verified | [FANUC driver docs](https://fanuc-corporation.github.io/fanuc_driver_doc/main/index.html) | none |
| 18 | A new car model means re-teaching, "which is one reason a line stays with one brand" | unverifiable | none found | removed the brand clause (it repeats row 1) |
| 19 | A new car model means re-teaching or offline programming in the vendor simulator | unverifiable | none found (search quota out) | kept flagged |
| 20 | ABB agreed in 2025 to sell its robotics division to SoftBank (status unknown) | corrected | [SoftBank press release](https://group.softbank/en/news/press/20251008); [Robotics 24/7](https://www.robotics247.com/article/softbanks-proposed-5.4b-acquisition-of-abb-robotics-blocked-by-china) (secondary) | flag removed; now: agreed October 2025 for USD 5.375 billion; as of early November 2026 the deal had not closed, and China had prohibited the purchase of the China operations; new sources [12][13]. ABB's own update page (abb.com/news/140154) timed out |
| 21 | FANUC driver has a documented 1 kHz mode | verified | [FANUC driver docs](https://fanuc-corporation.github.io/fanuc_driver_doc/main/index.html) | none |
| 22 | Code sketch REAL lines (TP, KAREL, RAPID, KRL, INFORM, URScript) are copied from the driver files | verified | sources [1]-[6] | none (every quoted line found verbatim) |
| 23 | Code sketch illustrative lines | unverifiable | vendor manuals not opened | kept flagged; Epson `Jump P1` matches the manual's syntax `Jump destination [...]` |

### plc-programming
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | IEC 61131-3 first published in 1993 | verified | [AFNOR: IEC 61131-3:1993](https://www.boutique.afnor.org/en-gb/standard/iec-6113131993/programmable-controllers-part-3-programming-languages/xs102769/433866) | cited new source [9] (March 1993; Wikipedia says December 1993; the text gives only the year) |
| 2 | Fourth edition published May 2025 | verified | [IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533) | cited new source [7] (edition 4.0, 2025-05-22) |
| 3 | The standard "defines four languages" | corrected | [IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533) | the scope defines ST, LD, and FBD plus SFC elements for structuring programs; reworded to "three languages ... plus SFC elements ... usually counted as a fourth language" |
| 4 | LD looks like relay diagrams, so the same people could maintain it | verified | [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 5 | ST is a Pascal-like text language | verified | [Wikipedia: Structured text](https://en.wikipedia.org/wiki/Structured_text) (secondary) | none |
| 6 | SFC can run branches in parallel | verified | [Wikipedia: SFC](https://en.wikipedia.org/wiki/Sequential_function_chart) (secondary) | none |
| 7 | Instruction List was a language in the 2013 edition | verified | [IEC 61131-3:2013](https://webstore.iec.ch/en/publication/4552) | cited new source [8] |
| 8 | IL was deprecated in 2013 | verified | [Wikipedia: IEC 61131-3](https://en.wikipedia.org/wiki/IEC_61131-3) (secondary, unsourced there) | none; the 2013 preview's foreword does not list deprecations and Annex B was not visible |
| 9 | IL was removed in 2025 | verified | [IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533); IEC preview (scope and contents list only ST under textual languages) | reworded to "gone from the 2025 edition, whose only text language is ST" |
| 10 | POUs: functions, function blocks, programs | verified | [Wikipedia: IEC 61131-3](https://en.wikipedia.org/wiki/IEC_61131-3) (secondary) | none |
| 11 | The third edition added object-oriented features | verified | [IEC 61131-3:2013](https://webstore.iec.ch/en/publication/4552) | citation moved from Wikipedia to [8]; named "classes and object-oriented function blocks" |
| 12 | Scan cycle: read inputs, execute, write outputs | verified | [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 13 | A scan takes "on the order of tens of milliseconds" | corrected | [Beckhoff Infosys](https://infosys.beckhoff.com/content/1033/tf8020_bacnetrev14/14456740235.html); [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | range added: about 10 ms (TwinCAT's default PLC task cycle) to tens of milliseconds, depending on program size, CPU, and configured task time; Precise and Key numbers both updated |
| 14 | A PLC is a hard real-time system | verified | [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 15 | TIA Portal's STEP 7 configures, programs, and diagnoses SIMATIC controllers | verified | [Siemens TIA Portal](https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html) | none |
| 16 | TwinCAT 3: PC real-time control, IEC 61131-3 plus C/C++ and MATLAB/Simulink, Visual Studio, own runtime | verified | [Beckhoff TwinCAT](https://www.beckhoff.com/en-us/products/automation/twincat/) | none |
| 17 | PLCopen: XML exchange format and motion control function blocks | verified | [PLCopen](https://plcopen.org/iec-61131-3) | none |
| 18 | PLCs replaced relay panels in car plants in the late 1960s | verified | [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 19 | Ladder's fixed execution order makes timing problems easier to spot | verified | same (secondary) | none |
| 20 | CODESYS offers object-oriented programming as an option | verified | [ABB Automation Builder help: CODESYS](https://help.plc.abb.com/_cds_development_system.html) | citation changed from a Wikipedia external link to new source [10] ("Object-orientation is not a must") |
| 21 | Studio 5000 Logix Designer programs ControlLogix and CompactLogix | verified | [MathWorks listing](https://es.mathworks.com/products/connections/product_detail/rslogix-5000.html) (secondary) | flag removed; cited new source [12]; rockwellautomation.com returned 403 |
| 22 | Airport baggage logic recirculates a missed bag instead of stopping | unverifiable | none (search quota out) | kept flagged |
| 23 | Ladder is "one of the four languages" in the 2025 edition | corrected | [IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533) | changed to "one of the languages defined in the 2025 edition", cited [7] |
| 24 | 18 s tray spacing sets the 15 s timeout | verified | arithmetic | none; labeled as arithmetic |

## Area 7, Classical robot software (part B): analogy and precision review

Scope: state-machines, perception, grasp-planning, ros2, moveit, opencv, vendor-languages, plc-programming in `knowledge/07-classical-software.md`. Validator after edits: `node tools/build-content.mjs --check knowledge/07-classical-software.md` reports 0 warnings, 0 errors (3 unverified flags remain in the file).

The shared web-search quota was exhausted, so no WebSearch calls ran. Everything below was checked by fetching known URLs, using the GitHub API (`gh api`), and doing arithmetic.

### Analogies
| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| state-machines | rewritten (behavior-tree half only; the cook and recipe card stay) | "Re-read from the top many times a second" makes a reader expect every check to re-run on every tick, so a guard placed before a long motion would catch a problem mid-motion. In BehaviorTree.CPP the plain Sequence resumes at the RUNNING child, and only ReactiveSequence re-checks from the top | A kitchen timer asks the cook how the current step is going; only lines marked "check every time" get re-read from the top |
| perception | kept | - | Laundry sorter deciding "sock, right there, sideways" |
| grasp-planning | kept (last Plain sentence reworded, see Other fixes) | - | Suction cup on glass and tongs on a pencil |
| ros2 | rewritten | A mailbox holds mail until someone collects it, so a reader expects a node that starts late to find earlier messages waiting. With the default QoS (volatile), nothing is kept for late joiners | Walkie-talkie channels (live, missed if you were not tuned in) plus desk phones (services) |
| moveit | kept (Where the analogy breaks rewritten) | - | Satnav for the arm. The break now names the most important mismatch: the default OMPL planners are random and not optimal, so paths can differ between runs, unlike a satnav's repeatable best route |
| opencv | kept | - | Well-stocked workshop wall |
| vendor-languages | rewritten | "Each car brand has its own dashboard" makes the differences look like surface layout that a trained person adapts to quickly. The core fact is that programs do not port between brands and must be rewritten. The old break section had to contradict its own analogy ("switching cars takes an afternoon") | Games for rival consoles: same basic moves, but a game only runs on its own console until someone rewrites it |
| plc-programming | kept | - | Tireless traffic controller who reads every sensor, decides, then sets every light, on each pass |

### Other fixes
- state-machines: Precise now says BehaviorTree.CPP's plain Sequence resumes at the RUNNING child and only ReactiveSequence re-ticks earlier children (new source [11], BT.CPP docs v4.11). It also says a guard placed before a long motion in a plain Sequence is checked once.
- state-machines: the reactive-condition example changed from "light curtain broken" to "tray no longer in place", because the same section keeps safety devices in hardwired logic, outside the tree.
- state-machines: defined "blocks" and "guard conditions" in plain words.
- state-machines: per-wedge time changed from "about 6 s" to "at most about 6 s, less tray movement". This matches the PLC section's 15 s robot timeout inside the 18 s takt. Updated in the cheese example and Key numbers; moveit and vendor-languages now also say "at most about 6 s".
- perception: code sketch bug fixed. The yaw came from centroid to min-area-box center, but for an acute triangle the boxes flush with each side all have the same area (2x the triangle), so the box OpenCV returns is arbitrary. The code now takes the tip as the blob pixel farthest from the centroid, which holds for any wedge longer than it is wide. I tested this with numpy on rasterized triangles at 0, 30, 135 and -100 degrees.
- perception: z is now belt height plus wedge thickness, not belt height. The pixel-to-plane mapping is calibrated at the top-face height. The text gives a similar-triangles parallax example: about 4.5 mm for a 20 mm wedge 200 mm off-center under a camera 0.9 m up.
- perception: defined "principal axes".
- grasp-planning: the last Plain sentence ("picks the one most likely to hold") contradicted the concept's own misconception. It now says it picks the best grasp the arm can reach without collisions.
- grasp-planning: defined the friction angle (the code sketch's friction cone) and "6-DoF" grasps in plain words.
- grasp-planning: Dex-Net 2.0's 93% is now qualified as "eight known objects with adversarial shapes", as the Dex-Net project page states. Fixed in both Precise and Key numbers.
- ros2: defined publish/subscribe, asynchronous, Tier 1 (using REP 2000's wording: tested frequently, bugs fixed first), volatile, UDP, real-time kernel, page faults and LTS. These are infrastructure terms that were previously undefined.
- moveit: OMPL is now defined (random sampling, the same request can give different paths, none guaranteed shortest, smoothed afterward), with new source [10], the MoveIt OMPL tutorial. CHOMP and Butterworth are defined too.
- moveit: the cheese example now says only the fixed transfer (above belt to above tray) is planned once and reused, so the path is the same every cycle; the short straight moves change per wedge. The old text said the pick and place "regions never change", which read as if the whole motion repeated.
- moveit: the code-sketch docstring now says the sketch uses the default OMPL pipeline and plans fresh on every call. Before, it silently disagreed with the text's Pilz LIN moves and reused transfer.
- opencv: the RANSAC advice was wrong. "Fixes the iteration count" was offered as the answer to randomness; a fixed count bounds the time but does not make results repeatable. It now says to run enough iterations and check the inlier count.
- opencv: defined BSD license, normal orientation (from the ptcloud.hpp functions orientNormals and orientNormalsConsistent) and sample consensus. "pixel-to-belt" became "pixel-to-plane", to match perception.
- vendor-languages: the analogy rewrite dropped the `[unverified]` claim that plants standardize on one brand. Defined tool center point, position register and socket. Changed "nothing else has direct access" to "on most controllers", since some controllers also accept streamed external commands.
- plc-programming: defined contacts, coils and relay panels in the Ladder Diagram definition.

### Spot-checks of the fact check
| Claim | Source opened | Result |
|---|---|---|
| ABB agreed in October 2025 to sell robotics to SoftBank for USD 5.375 billion | [SoftBank press release](https://group.softbank/en/news/press/20251008) | confirmed (signed 8 Oct 2025; EU, China, US approvals; expected close "mid-to-late 2026") |
| Deal not closed as of early November 2026; China prohibited the purchase of the China business | [Robotics 24/7, 5 Nov 2026](https://www.robotics247.com/article/softbanks-proposed-5.4b-acquisition-of-abb-robotics-blocked-by-china) (secondary) | confirmed ("has not been finalized"; China's foreign investment security review "has prohibited the acquisition of the ABB Robotics business in China", quoting ABB) |
| Lyrical Luth released 22 May 2026, LTS to May 2031, Tier 1 on Ubuntu 26.04 and Windows 11 | [Open Robotics Discourse](https://discourse.openrobotics.org/t/ros-2-lyrical-luth-released/55021) | confirmed |
| YOLO26n-seg about 2 ms on a T4 (TensorRT) and about 53 ms on a CPU (ONNX) | [Ultralytics Segment docs](https://docs.ultralytics.com/tasks/segment/) | confirmed (2.1 and 53.3 ms, 640 px, COCO val) |
| BOP 2024: best unseen method 4% behind best 2023 seen method, 24.9 s/image; Co-op 0.8 s; unseen 2D detection about 35% behind | [arXiv 2504.02812v3](https://arxiv.org/abs/2504.02812v3) | confirmed (all four numbers in the abstract) |
| OpenCV 5.1.0 released November 2026 | `gh api repos/opencv/opencv/releases/tags/5.1.0` | confirmed (6 Nov 2026) |
| py_trees 2.6.0 released September 2026 | `gh api .../py_trees/releases/tags/2.6.0` | confirmed (10 Sep 2026) |
| Open3D 0.20.0 released September 2026; PCL 1.15.1 is the latest release | `gh api` for both repos | confirmed (16 Sep 2026; PCL latest is still 1.15.1, 26 Aug 2025) |
| OpenCV 5.x ptcloud module has outlier removal, normal orientation and bounding boxes, but no normal estimation in that header | [ptcloud.hpp](https://raw.githubusercontent.com/opencv/opencv/5.x/modules/ptcloud/include/opencv2/ptcloud.hpp) | confirmed (removeStatisticalOutliers, removeRadiusOutliers, orientNormals, boundingBox3D, orientedBoundingBox3D) |
| TwinCAT's default PLC task cycle is 10 ms | [Beckhoff Infosys](https://infosys.beckhoff.com/content/1033/tf8020_bacnetrev14/14456740235.html) | confirmed. Note: the page is in the TF8020 BACnet docs and recommends 40-50 ms for BACnet work; the 10 ms default statement is general |
| PLC scans take tens of milliseconds; a PLC is a hard real-time system | [Wikipedia: PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | confirmed |
| AnyGrasp: 93.3% success on 300+ unseen objects, over 900 mean picks per hour, caught moving objects | [arXiv 2212.08333](https://arxiv.org/abs/2212.08333) | confirmed (robot fish) |
| Dex-Net 4.0: over 95% reliability, bins of up to 25 objects, over 300 MPPH; Dex-Net 2.0: 6.7 M examples, 0.8 s, 93% | [Dex-Net project page](https://berkeleyautomation.github.io/dex-net/) | confirmed; the 93% applies to "eight known objects with adversarial geometry", so the text is now qualified (precision fix, not a factual error) |
| MoveIt 2 has stable branches for Humble, Jazzy and Kilted, Lyrical binaries, and PickNik leads development | `gh api repos/moveit/moveit2/readme` | confirmed |
| Default QoS is keep last 10, reliable, volatile; "reliable" runs over UDP | [ROS 2 QoS docs source](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/ROS-Framework/interfaces/topics/About-Quality-of-Service-Settings.rst) | confirmed |
| GQ-CNN last pushed 2024; AnyGrasp SDK last pushed July 2026 | `gh api` for both repos | confirmed (25 Apr 2024; 13 Jul 2026) |

Spot-checks: 16, failures: 0.

New sources added: state-machines [11] [BehaviorTree.CPP Sequences](https://www.behaviortree.dev/docs/nodes-library/SequenceNode) (primary, loaded); moveit [10] [MoveIt OMPL Planner tutorial](https://moveit.picknik.ai/main/doc/examples/ompl_interface/ompl_interface_tutorial.html) (primary, loaded). I also loaded the [OMPL planners list](https://ompl.kavrakilab.org/planners.html), which confirms RRTConnect is not among OMPL's optimizing planners; I did not cite it.

Still open (search quota exhausted): the `[unverified]` flags on the spot-welding re-teach practice (vendor-languages Elsewhere), the illustrative code-sketch lines (vendor-languages), and airport baggage recirculation (plc-programming Elsewhere).

## Area 8, Robot learning: fact check

Summary line: 163 claims checked: 150 verified, 10 corrected, 3 unverifiable (3 kept flagged, 0 removed).

Notes:
- Six `[unverified]` flags were in the file at the start. Four are resolved (imitation misconception, PPO clipping, Isaac Lab 3.0 status, GR00T 2). Two stay flagged (safety outside the network, deformable simulation maturity). One new flag was added: which model versions the Pi API serves.
- pi.website and physicalintelligence.company returned HTTP 429 on every request, so Physical Intelligence claims rest on arXiv papers, the openpi GitHub README, and labeled secondary reports.
- NVIDIA's Isaac Lab docs release-notes page still lists only 3.0 betas. The GitHub v3.0.0 release (October 20, 2026) is newer, so it replaces the docs page as the source.
- Secondary sources kept, with no loadable primary: Wikipedia (Physical Intelligence status; rule of three), Humanoids Daily (Pi API beta), Physical AI Lab (PI partner deployments), Stone Tao's Substack (Genesis benchmark critique).

### learned-policy
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Observations usually "one to three" camera images | corrected | [pi0 paper](https://arxiv.org/html/2410.24164); [ACT full text](https://ar5iv.labs.arxiv.org/html/2304.13705) | Changed to "a few camera images (2 or 3 per robot for pi0)". ACT on ALOHA uses 4, so the old range was wrong |
| 2 | RT-1 outputs actions at 3 Hz | verified | [RT-1 project page](https://robotics-transformer1.github.io/) | none |
| 3 | ACT predicts joint positions at 50 Hz on ALOHA | verified | [ALOHA project page](https://tonyzhaozh.github.io/aloha/) | none |
| 4 | pi0 runs at 50 Hz on its faster robots | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 5 | pi0 chunk is 50 steps (1 s) | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 6 | Dynamixel: Goal Position goes through a built-in profile generator and PID | verified | [XM430-W350 e-Manual](https://emanual.robotis.com/docs/en/dxl/x/xm430-w350/) | none |
| 7 | Limits, e-stop, and safety monitoring stay in certified hardware, outside the network | unverifiable | none found (retried: ISO 10218-1:2025 summaries found, but nothing on learned policies) | kept flagged |
| 8 | pi0 laundry: 50-step chunks, 25 steps open-loop, then replan | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 9 | pi0 has 3.3B parameters | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 10 | LeRobot implements ACT, Diffusion Policy, pi0, pi0.5, GR00T N1.7, SmolVLA | verified | [huggingface/lerobot](https://github.com/huggingface/lerobot) | none |
| 11 | Dynamixel servos are used in low-cost research arms | verified | [huggingface/lerobot](https://github.com/huggingface/lerobot) (dynamixel motor driver, Koch arm docs, via gh) | none |
| 12 | Physical Intelligence "not yet selling commercially, policies in trials" (status as of Nov 2026) | corrected | [Wikipedia](https://en.wikipedia.org/wiki/Physical_Intelligence_Inc.) (secondary); [Humanoids Daily](https://www.humanoidsdaily.com/news/physical-intelligence-api-beta-robot-training-inference) (secondary) | Updated: no generally available product; partner trials; waitlisted API beta for hosted fine-tuning and inference since October 2026. New source [7] |
| 13 | ALOHA page lists a chunk size of 90 for ACT | verified | [ALOHA project page](https://tonyzhaozh.github.io/aloha/) | none |
| 14 | One pi0 inference takes about 73 ms on an RTX 4090 | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 15 | ALOHA uses 50 demonstrations per task (source line) | verified | [ALOHA project page](https://tonyzhaozh.github.io/aloha/) | none |

### imitation-learning
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Demonstrations recorded with a leader arm that the follower copies | verified | [LeRobotDataset v3 docs](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) (so101_leader / so101_follower) | none |
| 2 | ACT on ALOHA used 50 demonstrations per task | verified | [ALOHA project page](https://tonyzhaozh.github.io/aloha/) | none |
| 3 | 80-90% success on the hardest tasks from about 10 min of demonstrations | verified | [ACT paper](https://arxiv.org/abs/2304.13705) | none |
| 4 | LeRobot ACT has about 80M parameters | verified | [LeRobot ACT docs](https://huggingface.co/docs/lerobot/act) | none |
| 5 | 100k training steps take a few hours on one GPU | verified | [LeRobot ACT docs](https://huggingface.co/docs/lerobot/act) | none |
| 6 | ACT authors: errors compound and drift out of the training data | verified | [ALOHA project page](https://tonyzhaozh.github.io/aloha/); [ACT paper](https://arxiv.org/abs/2304.13705) | none |
| 7 | Sequential decisions break the i.i.d. assumption | verified | [Ross et al.](https://arxiv.org/abs/1011.0686) | none |
| 8 | DAgger: run the learner, expert labels visited states, aggregate, retrain | verified | [Ross et al. full text](https://ar5iv.labs.arxiv.org/html/1011.0686) | none |
| 9 | Action chunking is ACT's central idea | verified | [ACT paper](https://arxiv.org/abs/2304.13705) | none |
| 10 | ACT is a CVAE whose style variable is set to zero at run time | verified | [LeRobot ACT docs](https://huggingface.co/docs/lerobot/act); [ACT full text](https://ar5iv.labs.arxiv.org/html/2304.13705) | none |
| 11 | Diffusion Policy: 46.9% average improvement across 15 tasks | corrected | [Diffusion Policy abstract](https://arxiv.org/abs/2303.04137v4); [project page](https://diffusion-policy.cs.columbia.edu/) | Corrected "15 tasks" to "12 tasks from 4 benchmarks" (Precise, Key numbers, source line) |
| 12 | ACT authors name "inconsistent" human demonstrations as a core difficulty | corrected | [ACT paper](https://arxiv.org/abs/2304.13705) | Reworded to "demonstrations that vary from run to run ('non-stationary' in their words)", the paper's own term, in Precise, Misconception, and the source line |
| 13 | ALOHA rig built on about a $20k budget | verified | [ALOHA project page](https://tonyzhaozh.github.io/aloha/) | none |
| 14 | Tasks include opening a translucent condiment cup and slotting a battery | verified | [ALOHA project page](https://tonyzhaozh.github.io/aloha/) | none |
| 15 | LeRobot docs run ACT on the SO-101 arm | verified | [LeRobot ACT docs](https://huggingface.co/docs/lerobot/act) | none |
| 16 | ACT uses a ResNet-18 vision backbone | verified | [LeRobot ACT docs](https://huggingface.co/docs/lerobot/act) | none |
| 17 | ACT is LeRobot's recommended first policy | verified | [LeRobot ACT docs](https://huggingface.co/docs/lerobot/act) | none |
| 18 | Diffusion Policy is open source, from Columbia and collaborators, RSS 2023 | verified | [Diffusion Policy project page](https://diffusion-policy.cs.columbia.edu/) | none |
| 19 | LeRobot docs: ACT often succeeds with about 50 demonstrations | verified | [LeRobot ACT docs](https://huggingface.co/docs/lerobot/act) | none |
| 20 | A smaller, varied set beats a larger set of near-identical runs (was flagged) | verified | [Lin et al., Data Scaling Laws](https://arxiv.org/abs/2410.18647) | Removed the flag and restated what the study shows: variety of environments and objects matters more than demonstration count. New source [6] |
| 21 | Illustrative plan: 14 s demos fit the 18 s per plate | verified | arithmetic (3600 s / 200 plates = 18 s) | none; labeled illustrative |

### reinforcement-learning
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | PPO alternates collecting data with several epochs on a surrogate objective | verified | [PPO paper](https://arxiv.org/abs/1707.06347) | none |
| 2 | PPO's main variant clips how far action probabilities can change (was flagged) | verified | [OpenAI Spinning Up: PPO](https://spinningup.openai.com/en/latest/algorithms/ppo.html) | Removed the flag and cited Spinning Up (PPO-Clip is the primary variant used at OpenAI). The paper PDF could not be read as text. New source [5] |
| 3 | PPO is on-policy | verified | [OpenAI Spinning Up: PPO](https://spinningup.openai.com/en/latest/algorithms/ppo.html) | citation added |
| 4 | Rudin et al.: thousands of simulated robots on one GPU | verified | [Rudin et al.](https://arxiv.org/abs/2109.11978) | none |
| 5 | Under 4 min on flat ground, about 20 min on rough terrain | verified | [Rudin et al.](https://arxiv.org/abs/2109.11978) | none |
| 6 | Real-world RL uses off-policy methods (HIL-SERL builds on RLPD) | verified | [HIL-SERL full text](https://arxiv.org/html/2410.21845) | none |
| 7 | HIL-SERL starts from demonstrations and uses human corrections | verified | [HIL-SERL](https://arxiv.org/abs/2410.21845) | none |
| 8 | 1-2.5 hours of training, near-perfect success | verified | [HIL-SERL](https://arxiv.org/abs/2410.21845) | none |
| 9 | About 2x the success and 1.8x faster than imitation baselines | verified | [HIL-SERL](https://arxiv.org/abs/2410.21845) | none |
| 10 | π*0.6 (November 2025) uses RL on deployment experience | verified | [π*0.6 paper](https://arxiv.org/abs/2511.14759) | Replaced the secondary Physical AI Lab source with the arXiv paper |
| 11 | ANYmal: curriculum over generated terrain, then run on the physical robot | verified | [Rudin et al.](https://arxiv.org/abs/2109.11978) | none |
| 12 | LeRobot includes HIL-SERL and TD-MPC | verified | [huggingface/lerobot](https://github.com/huggingface/lerobot) | none |
| 13 | "Isaac Lab and MuJoCo: common GPU simulators" | corrected | [MuJoCo overview](https://mujoco.readthedocs.io/en/stable/overview.html) | MuJoCo's core runs on the CPU; reworded so its GPU use comes through the MJX and Warp backends |
| 14 | π*0.6 weights are not public | verified | [openpi README](https://github.com/Physical-Intelligence/openpi) (via gh) | Replaced the secondary source with openpi, which lists only π0, π0-FAST, and π0.5 |
| 15 | Operator with a 3D mouse takes over (HIL-SERL style) | verified | [HIL-SERL full text](https://arxiv.org/html/2410.21845) (SpaceMouse) | none |
| 16 | Code sketch: clip 0.2, 4096 envs, 24-step rollouts | verified | [OpenAI Spinning Up: PPO](https://spinningup.openai.com/en/latest/algorithms/ppo.html) (default clip 0.2) | none; illustrative and plausible |

### simulators
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Physics step is "a millisecond or a few" | verified | [MuJoCo XML reference source](https://raw.githubusercontent.com/google-deepmind/mujoco/main/doc/XMLreference.rst) | Added a cited anchor (MuJoCo default 2 ms). New source [9] |
| 2 | MuJoCo poses contact as a convex optimization and allows soft contacts | verified | [MuJoCo overview](https://mujoco.readthedocs.io/en/stable/overview.html) | none |
| 3 | Deformable and wet objects are much less mature in most simulators | unverifiable | retried; deformable-manipulation surveys (for example arXiv 2105.01767) do not state it in their abstracts | kept flagged |
| 4 | ManiSkill3 reaches 30,000+ FPS with rendering, depending on task | verified | [ManiSkill3](https://arxiv.org/abs/2410.00425) | none |
| 5 | Headline speeds depend on accuracy settings and cameras | verified | [Stone Tao](https://stoneztao.substack.com/p/the-new-hyped-genesis-simulator-is) (secondary) | none |
| 6 | MuJoCo GPU backends MJX (JAX) and MuJoCo Warp | verified | [MuJoCo overview](https://mujoco.readthedocs.io/en/stable/overview.html) | none |
| 7 | Gazebo connects to ROS 2 through ros_gz; one recommended Gazebo per ROS 2 release | verified | [Installing Gazebo with ROS](https://gazebosim.org/docs/latest/ros_installation/) | none |
| 8 | MuJoCo open-sourced by Google DeepMind in May 2022 | verified | [MuJoCo overview](https://mujoco.readthedocs.io/en/stable/overview.html) | none |
| 9 | Isaac Lab 3.0 is beta; GA in late Oct 2026 flagged as a single news report | corrected | [Isaac Lab v3.0.0 release](https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0) | Removed the flag: GA release published October 20, 2026. Source [2] replaced, since the docs release-notes page is stale |
| 10 | Isaac Lab 3.0 targets Isaac Sim 6.0 | corrected | [Isaac Lab v3.0.0 release](https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0) | Corrected 6.0 to 6.2 (6.0 was the beta target); added that Isaac Sim is now optional |
| 11 | Newton is "built on MuJoCo Warp" | corrected | [Isaac Lab v3.0.0 release](https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0) | Corrected: Newton is a GPU physics engine with several solvers, MuJoCo Warp among them (also VBD, MPM) |
| 12 | Gazebo Jetty is the current LTS: Sept 2025 to May 2031 | verified | [Gazebo releases](https://gazebosim.org/docs/latest/releases/) | none |
| 13 | Drake: C++/Python toolbox for multibody dynamics, contact, and optimization, led by TRI | verified | [Drake](https://drake.mit.edu/) | none |
| 14 | ManiSkill3 is built on the PhysX-based SAPIEN engine | verified | [Stone Tao](https://stoneztao.substack.com/p/the-new-hyped-genesis-simulator-is) (secondary); [SAPIEN README](https://github.com/haosulab/SAPIEN) (PhysX 5 GPU, via gh) | none |
| 15 | PyBullet's issue tracker is closed per the README | verified | [bullet3 README](https://github.com/bulletphysics/bullet3) | none |
| 16 | Genesis launched in late 2024; its speed claims were disputed | verified | [Stone Tao](https://stoneztao.substack.com/p/the-new-hyped-genesis-simulator-is) (secondary) | none |
| 17 | Genesis claimed 43M FPS, 430,000x real time | verified | [Stone Tao](https://stoneztao.substack.com/p/the-new-hyped-genesis-simulator-is) (secondary) | none |
| 18 | Launch benchmark used the least accurate solver, an idle arm, and no cameras | verified | [Stone Tao](https://stoneztao.substack.com/p/the-new-hyped-genesis-simulator-is) (secondary) | none |
| 19 | Corrected run: about 0.29M FPS, about 10x real time with a camera, on an RTX 4090 | verified | [Stone Tao](https://stoneztao.substack.com/p/the-new-hyped-genesis-simulator-is) (secondary) | none |
| 20 | Genesis has since published fixes | verified | [Stone Tao](https://stoneztao.substack.com/p/the-new-hyped-genesis-simulator-is) (update note) | added a clause to the misconception for fairness |
| 21 | Code sketch: timestep 0.002 s (500 Hz) | verified | [MuJoCo XML reference source](https://raw.githubusercontent.com/google-deepmind/mujoco/main/doc/XMLreference.rst) | none |

### sim-to-real
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | SIMPLER names control and visual gaps as the key obstacles | verified | [SIMPLER](https://arxiv.org/abs/2405.05941) | none |
| 2 | Tobin et al.: random non-realistic textures, 1.5 cm accuracy on real images | verified | [Tobin et al.](https://arxiv.org/abs/1703.06907) | none |
| 3 | ADR widens randomization ranges as the policy copes | verified | [OpenAI Rubik's Cube](https://arxiv.org/abs/1910.07113) | none |
| 4 | Rubik's cube solved with a robot hand trained only in simulation | verified | [OpenAI Rubik's Cube](https://arxiv.org/abs/1910.07113) | none |
| 5 | ANYmal actuator network learned from real data, including delays | verified | [Hwangbo et al. full text](https://ar5iv.labs.arxiv.org/html/1901.08652) | Replaced the secondary Emergent Mind summary with the paper's full text |
| 6 | Lower tracking error and energy use than the best model-based controller | verified | [Hwangbo et al. full text](https://ar5iv.labs.arxiv.org/html/1901.08652) | none |
| 7 | Up to 1.5 m/s, about 25% above the previous record | verified | [Hwangbo et al. full text](https://ar5iv.labs.arxiv.org/html/1901.08652) | none |
| 8 | Recovered from falls | verified | [Hwangbo et al.](https://arxiv.org/abs/1901.08652) | none |
| 9 | Isaac Lab 3.0 adds a choice of physics engines | verified | [Isaac Lab v3.0.0 release](https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0) | Source [6] replaced with the GA release |
| 10 | SIMPLER provides open-source environments plus a workflow for new ones | verified | [SIMPLER](https://arxiv.org/abs/2405.05941) | none |
| 11 | Code sketch: 0-3 steps of delay is 0-60 ms at 50 Hz | verified | arithmetic | none; ranges labeled illustrative |

### vla-models
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | RT-2 cuts each action dimension into 256 bins | verified | [RT-2](https://arxiv.org/html/2307.15818) | none |
| 2 | OpenVLA uses 256 bins emitted as tokens | verified | [OpenVLA full text](https://arxiv.org/html/2406.09246) | none |
| 3 | pi0 authors: OpenVLA does not support action chunks | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 4 | Octo uses a diffusion head | verified | [Octo](https://octo-models.github.io/) | none |
| 5 | pi0 adds a 300M action expert to a 3B VLM | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 6 | pi0 makes 50-step chunks at up to 50 Hz | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 7 | GR00T N1.7: Cosmos-Reason2-2B backbone plus a separate action head | verified | [Isaac-GR00T README](https://github.com/NVIDIA/Isaac-GR00T) | none |
| 8 | pi0.5 predicts a text subtask, then actions, in one model | verified | [pi0.5](https://arxiv.org/html/2504.16054v1) | none |
| 9 | Best-known open VLAs have 3-7B parameters | verified | [OpenVLA](https://arxiv.org/abs/2406.09246); [pi0](https://arxiv.org/html/2410.24164); [GR00T](https://github.com/NVIDIA/Isaac-GR00T) | none |
| 10 | Gemini Robotics 2.5: most advanced VLA, early access by waitlist | verified | [Gemini Robotics](https://deepmind.google/models/gemini-robotics/gemini-robotics/) | none |
| 11 | On-device model goes only to trusted testers | verified | [On-Device 2 model card](https://deepmind.google/models/model-cards/gemini-robotics-on-device-2/) | none |
| 12 | π0.7 "offered through a waitlisted API instead of open weights" | corrected | [openpi README](https://github.com/Physical-Intelligence/openpi); [π0.7 paper](https://arxiv.org/abs/2604.15483); [Humanoids Daily](https://www.humanoidsdaily.com/news/physical-intelligence-api-beta-robot-training-inference) (secondary) | Split into what is supported: no π0.7 weights, and a waitlisted API beta for hosted fine-tuning and inference since October 2026. New sources [10][12][13] |
| 13 | Which model versions the Pi API serves | unverifiable | Physical AI Lab (secondary) says π0.7; another report says π0 and π0.5; pi.website returned 429 | flagged (new flag) |
| 14 | Deployments are early partner uses: laundry folding, e-commerce packing | verified | [Physical AI Lab](https://physicalailab.io/en/physical-intelligence-pi-models-openpi-api/) (secondary) | source line narrowed to this claim |
| 15 | PI reports fine-tuning on 1-20 hours of task data | corrected | [pi0 paper](https://arxiv.org/html/2410.24164) | Corrected to the primary source: about 1-5 hours for simpler tasks up to 100+ hours for the most complex |
| 16 | pi0.5 runs two-armed mobile robots tidying kitchens and bedrooms in unseen homes | verified | [pi0.5](https://arxiv.org/html/2504.16054v1) | none |
| 17 | About 400 hours of mobile data in about 100 homes | verified | [pi0.5](https://arxiv.org/html/2504.16054v1) | none |
| 18 | Performance improves with more distinct homes | verified | [pi0.5](https://arxiv.org/html/2504.16054v1) | none |
| 19 | pi0 (Oct 2024) and pi0.5 (Apr 2025) have open weights in openpi under Apache-2.0 | verified | [openpi README](https://github.com/Physical-Intelligence/openpi); [pi0](https://arxiv.org/html/2410.24164); [pi0.5](https://arxiv.org/html/2504.16054v1) | Replaced the secondary source with openpi and the arXiv papers |
| 20 | π*0.6 (Nov 2025) and π0.7 (Apr 2026) have no open weights | verified | [π*0.6](https://arxiv.org/abs/2511.14759); [π0.7](https://arxiv.org/abs/2604.15483); [openpi README](https://github.com/Physical-Intelligence/openpi) | new sources [11][12] |
| 21 | Pi API beta opened by waitlist in October 2026 | verified | [Humanoids Daily](https://www.humanoidsdaily.com/news/physical-intelligence-api-beta-robot-training-inference) (secondary) | new source [13] |
| 22 | Gemini Robotics On-Device 2 (July 2026) goes only to trusted testers | verified | [On-Device 2 model card](https://deepmind.google/models/model-cards/gemini-robotics-on-device-2/) | none |
| 23 | GR00T N1.7: 3B, open weights, humanoids, NVIDIA Open Model License | verified | [Isaac-GR00T README](https://github.com/NVIDIA/Isaac-GR00T) | none |
| 24 | GR00T 2 announced in November 2026 (was flagged) | verified | [NVIDIA GR00T 2 research page](https://research.nvidia.com/labs/gear/gr00t-2/) | Removed the flag; added that it is a world-action model with code listed for December. New source [14] |
| 25 | OpenVLA: 7B, 2024, about 970k demonstrations | verified | [OpenVLA](https://arxiv.org/abs/2406.09246) | none |
| 26 | Octo: 2024, 27M and 93M, 800k OXE episodes | verified | [Octo](https://octo-models.github.io/) | none |
| 27 | RT-2 (Google DeepMind, 2023) established actions as text tokens | verified | [RT-2](https://arxiv.org/html/2307.15818) | none |
| 28 | On-Device 2 card: limited generalization to OOD tasks and high-DoF robots | verified | [On-Device 2 model card](https://deepmind.google/models/model-cards/gemini-robotics-on-device-2/) | none |
| 29 | Largest RT-2 is 55B | verified | [RT-2](https://arxiv.org/html/2307.15818) | none |
| 30 | RT-2-55B runs at 1-3 Hz in a multi-TPU cloud service; 5B at about 5 Hz | verified | [RT-2](https://arxiv.org/html/2307.15818) | none |
| 31 | OpenVLA beats RT-2-X by 16.5 points on 29 tasks with 7x fewer parameters | verified | [OpenVLA](https://arxiv.org/abs/2406.09246) | none |
| 32 | pi0 pretrained on over 10,000 hours | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 33 | Code sketch: 10 flow-matching refinement steps | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |

### robot-datasets
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | LeRobot records with an SO-101 leader/follower pair | verified | [LeRobotDataset v3](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) | none |
| 2 | RT-1: 130k+ episodes, 13 robots, 17 months | verified | [RT-1](https://robotics-transformer1.github.io/) | none |
| 3 | OXE: 60 datasets, 1M+ trajectories, 22 robot types, 527 skills | verified | [Open X-Embodiment](https://robotics-transformer-x.github.io/) | none |
| 4 | DROID: 76k trajectories, 350 h, 564 scenes, one robot model, 13 institutions, 12 months | verified | [DROID](https://droid-dataset.github.io/) | none |
| 5 | pi0: >10,000 h; 903M own timesteps; 7 robot configurations; open data 9.1% | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 6 | LeRobotDataset v3: Parquet tables, MP4 per camera, JSON/Parquet metadata | verified | [LeRobotDataset v3](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) | none |
| 7 | Contents of meta/info.json, meta/stats.json, meta/episodes/ | verified | [LeRobotDataset v3](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) | none |
| 8 | Many episodes per file; streaming from the Hub | verified | [LeRobotDataset v3](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) | none |
| 9 | DROID loads through TFDS | verified | [DROID](https://droid-dataset.github.io/) | none |
| 10 | pi0 pads action vectors to 18 numbers | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 11 | v3.0 ships in lerobot 0.4.0 and later | verified | [LeRobotDataset v3](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) | none |
| 12 | OXE is a collaboration of 21 institutions | verified | [Open X-Embodiment](https://robotics-transformer-x.github.io/) | none (the site also cites 34 labs) |
| 13 | DROID: Franka Panda, two adjustable ZED 2 cameras, wrist ZED Mini | verified | [DROID](https://droid-dataset.github.io/) | none |
| 14 | DROID covers 86 tasks | verified | [DROID](https://droid-dataset.github.io/) | none |
| 15 | Viewers: browser visualizer, Rerun, Foxglove | verified | [LeRobotDataset v3](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) | none |
| 16 | Code API: create, add_frame, save_episode, finalize, push_to_hub, delta_timestamps, import path | verified | [LeRobotDataset v3](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) | none |
| 17 | Skipping finalize() leaves corrupt Parquet files | verified | [LeRobotDataset v3](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) | none |
| 18 | RT-1 covers 700+ tasks (source line) | verified | [RT-1](https://robotics-transformer1.github.io/) | none |
| 19 | Illustrative plan: MP4 at 30 fps, Parquet at 50 Hz | verified | [LeRobotDataset v3](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) (formats) | none; labeled illustrative |

### policy-evaluation
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Papers often omit runs, conditions, criteria, failures, statistics | verified | [Kress-Gazit et al.](https://arxiv.org/abs/2409.09491) | none |
| 2 | Wilson interval preferred; the naive formula fails for small N and rates near 0% or 100% | verified | [NIST e-Handbook 7.2.4.1](https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm); [Wikipedia](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval) (secondary) | Added NIST as the primary source [7] |
| 3 | 16 of 20 gives a 95% Wilson interval of about 58-92% | verified | computed with the formula in the code sketch: 58.4%-91.9% | none |
| 4 | Rule of three: zero failures in n trials bounds the failure rate at 3/n | verified | [Wikipedia](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval) (secondary; BMJ, JAMA, and PubMed copies would not load) | marked secondary |
| 5 | SIMPLER shows strong sim-real correlation | verified | [SIMPLER](https://arxiv.org/abs/2405.05941) | none |
| 6 | LIBERO: OpenVLA-OFT raised average success from 76.5% to 97.1% | verified | [OpenVLA-OFT](https://arxiv.org/abs/2502.19645) | none |
| 7 | RoboArena: crowdsourced double-blind pairwise; 600+ episodes, 7 policies, 7 institutions | verified | [RoboArena](https://arxiv.org/abs/2506.18123) | none |
| 8 | RoboArena runs on the DROID platform | verified | [RoboArena](https://arxiv.org/abs/2506.18123) | none |
| 9 | At 200 plates/h: 99% leaves 2 plates/h for rework, 95% leaves 10 | verified | arithmetic | none |
| 10 | About 300 clean trials support a 1% failure rate | verified | rule of three (3/300) | none |
| 11 | RT-1: 97% seen, 76% unseen, 83% distractors, 59% backgrounds | verified | [RT-1](https://robotics-transformer1.github.io/) | none |
| 12 | OpenVLA-OFT: 26x throughput (source line) | verified | [OpenVLA-OFT](https://arxiv.org/abs/2502.19645) | none |
| 13 | Code sketch: 12 conditions x 25 rounds = 300 trials | verified | arithmetic | none |

### on-robot-inference
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | pi0 runs at 20 Hz on UR5e and Franka, 50 Hz on the others | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 2 | 73 ms at the robot, 86 ms over the network, on an RTX 4090 | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 3 | Inference every 0.5 s after 25 of 50 actions, run open-loop | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 4 | Every 0.8 s on the 20 Hz robots | verified | [pi0 paper](https://arxiv.org/html/2410.24164) | none |
| 5 | RTC freezes committed actions, fills in the rest, needs no retraining; NeurIPS 2025 | verified | [RTC](https://arxiv.org/abs/2506.07339) | none |
| 6 | SmolVLA async stack separates prediction from execution; consumer GPUs or CPUs | verified | [SmolVLA](https://arxiv.org/abs/2506.01844) | none |
| 7 | Jetson AGX Thor: 2070 FP4 TFLOPS (sparse), 128 GB, 40-130 W, Blackwell | verified | [NVIDIA Jetson Thor](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/) | none |
| 8 | GR00T N1.7: about 28 Hz on Thor and 40 Hz on RTX PRO 6000, TensorRT, batch-1 LIBERO | verified | [Isaac-GR00T README](https://github.com/NVIDIA/Isaac-GR00T) | none |
| 9 | RT-2-55B runs at 1-3 Hz in a multi-TPU cloud service | verified | [RT-2](https://arxiv.org/html/2307.15818) | none |
| 10 | Gemini Robotics On-Device runs without a network; built for poor connectivity | verified | [DeepMind blog](https://deepmind.google/discover/blog/gemini-robotics-on-device-brings-ai-to-local-robotic-devices/) | none |
| 11 | On-Device is trusted testers only (status as of Nov 2026) | verified | [On-Device 2 model card](https://deepmind.google/models/model-cards/gemini-robotics-on-device-2/) | Added the July 2026 On-Device 2 status. New source [9] |
| 12 | OpenVLA-OFT raised action throughput 26x | verified | [OpenVLA-OFT](https://arxiv.org/abs/2502.19645) | none |
| 13 | 73 ms is longer than one 20 ms tick, so the chunk starts about 4 ticks stale | verified | arithmetic | none |
| 14 | DeepMind On-Device blog dated June 2025 (source line) | verified | [DeepMind blog](https://deepmind.google/discover/blog/gemini-robotics-on-device-brings-ai-to-local-robotic-devices/) | none |

## Area 8, Robot learning: analogy and precision review

### Analogies
| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| learned-policy | kept | — | — |
| imitation-learning | kept | — | — |
| reinforcement-learning | kept | — | — |
| simulators | kept | — | — |
| sim-to-real | kept | — | — |
| vla-models | kept | — | — |
| robot-datasets | rewritten | A black-box flight recorder runs on every flight at no extra cost, so a reader would expect robot training data to pile up for free as a by-product of normal operation. That is the exact misconception the concept argues against: most data is staged teleoperation that costs operator and robot time per hour. The old break text covered crash analysis and formats but not cost. | A driving school that films every lesson from inside the car and logs wheel and pedals. Each hour of footage needs a car, an instructor, and a planned route. Break: a student can reason past what was filmed but a policy cannot, and robots, unlike cars, have no standard controls or format. |
| policy-evaluation | kept | — | — |
| on-robot-inference | rewritten | Simultaneous interpreters lag behind the speaker, so "work a phrase ahead" was wrong about interpreters themselves. The analogy also implies continuous listening, which hides that a chunk plays out without looking. And "the audience just waits" is wrong too, because the speaker keeps going. | Reading a story aloud: the voice keeps a steady pace while the eyes run a few words ahead (planned motion plays while the next chunk is computed). Break: a reader keeps scanning, but the policy acts on one snapshot until the next, and a late plan needs a safe fallback, not a pause. |

Notes on kept analogies:
- learned-policy (cook who learned by watching): it suggests every policy comes from demonstrations, which is wrong for RL-trained ones. This is minor, and the Plain text says "trained from examples". The break correctly covers lack of explanation, confident failure, and the motor layer below.
- imitation-learning (dashcam learner driver): this leads straight to the core failure (no recovery footage, so errors compound), and the break names it.
- reinforcement-learning (dog and treats): the break covers the real gaps, which are costly early attempts and gaming the score.
- simulators (flight simulator): the break names the key gap, which is that contact and soft objects are only approximated.
- sim-to-real (away game, practice with variation): this maps cleanly to domain randomization, and the break covers the timid-policy risk.
- vla-models (well-read apprentice): the break correctly says web knowledge does not supply motor skill.
- policy-evaluation (election poll with margin of error): this maps well to binomial intervals, and the break covers varied conditions and failure severity.

### Other fixes
- learned-policy: defined neural network and parameters in Precise. These terms were used throughout the file and never defined.
- learned-policy: defined profile generator, e-stop chain, and light curtains in plain words.
- learned-policy: moved the Physical Intelligence November 2026 status out of the misconception Reality and into the pi0 product entry. It had nothing to do with the misconception (network driving the motors).
- imitation-learning: "minimize average error learns the average" became "average squared error". Averaging the two modes is a squared-error effect. ACT's L1 loss behaves differently, which the code sketch already notes.
- reinforcement-learning: added the missing mechanism. The policy adds random variation (exploration), and updates make better-than-expected actions more likely. Without this, "discovers actions that score well" was hand-waving.
- reinforcement-learning: defined gradient steps.
- reinforcement-learning (cheese plate): the reward came from "the inspection camera". Inspection is two stations after the cracker pick, behind the cheese station. Changed it to a camera over the cracker station and said why.
- vla-models (cheese plate): "all five pick stations" became "all four ingredient pick stations (grapes, apples, crackers, cheese)". The line has one pick station per ingredient, and there are four ingredients.
- vla-models: defined "backbone".
- robot-datasets: defined normalization statistics.
- robot-datasets (cheese plate): 300 episodes became 200, to match the imitation-learning plan for the same station.
- robot-datasets (cheese plate): the plan recorded MP4 at 30 fps and Parquet at 50 Hz. This contradicted LeRobotDataset's single dataset FPS and the concept's own code sketch (fps=50, images and state in one add_frame). It now records everything at 50 frames per second, with the reason stated and cited. Source [3] line updated.
- policy-evaluation: defined overall equipment effectiveness.
- on-robot-inference: misconception Reality cited the pi0 paper [1] for "the next chunk is computed while the current one plays". The pi0 paper does not say inference runs in parallel; it only gives the 0.5 s, 25-action open-loop schedule. The parallel-computation claim is now attributed to the real-time chunking paper [2], whose abstract says it "generates the next action chunk while executing the current one". Source [2] line updated.
- on-robot-inference: "73 ms is longer than one 20 ms control tick" now says "on a 50 Hz robot". The previous sentence names 20 Hz robots, whose tick is 50 ms.

### Spot-checks of the fact check
| Claim | Source opened | Result |
|---|---|---|
| GR00T N1.7: 3B, Cosmos-Reason2-2B backbone, NVIDIA Open Model License, GA | [NVIDIA/Isaac-GR00T README](https://github.com/NVIDIA/Isaac-GR00T) | pass |
| GR00T N1.7: about 28 Hz on Jetson AGX Thor, about 40 Hz on RTX PRO 6000, TensorRT, batch-1 LIBERO | [NVIDIA/Isaac-GR00T README](https://github.com/NVIDIA/Isaac-GR00T) | pass |
| GR00T 2 announced November 2026, predicts video and actions together, code listed for December | [GR00T 2 research page](https://research.nvidia.com/labs/gear/gr00t-2/) | pass (page dated November 2026, "Code Available in December") |
| Jetson AGX Thor: 2070 FP4 TFLOPS sparse, 128 GB, 40-130 W, Blackwell | [NVIDIA Jetson Thor](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/) | pass |
| Gemini Robotics On-Device 2 (July 2026): trusted testers only; limited out-of-distribution and high-DoF generalization | [On-Device 2 model card](https://deepmind.google/models/model-cards/gemini-robotics-on-device-2/) | pass (published 30 July 2026) |
| Isaac Lab 3.0 GA, targets Isaac Sim 6.2, Newton with MuJoCo-Warp/VBD/MPM solvers, Isaac Sim optional | [Isaac Lab v3.0.0 release](https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0) | pass (page shows "20 Oct" without a year; the year comes from the tag context) |
| Gazebo Jetty LTS, September 2025 to May 2031 | [Gazebo releases](https://gazebosim.org/docs/latest/releases/) | pass (a later "M" release is listed for March 2027, not yet out) |
| pi0 fine-tuning: about 1-5 hours for simpler tasks, 100+ hours for the most complex | [pi0 paper](https://arxiv.org/html/2410.24164) | pass with nuance. Section V-A says the simplest tasks need "only 5 hours" and the most complex "100 or more". The 1-hour figure comes from the Tupperware fine-tuning comparison in VI-C |
| pi0: 2 or 3 cameras per robot; 73 ms on-board, 86 ms off-board, RTX 4090 | [pi0 paper](https://arxiv.org/html/2410.24164) | pass |
| LeRobot ACT: about 80M parameters, ResNet-18, a few hours for 100k steps, about 50 demonstrations, recommended first policy | [LeRobot ACT docs](https://huggingface.co/docs/lerobot/act) | pass |
| HIL-SERL: 1-2.5 hours, near-perfect success, 2x success, 1.8x faster | [HIL-SERL abstract](https://arxiv.org/abs/2410.21845) | pass |
| ALOHA page: ACT chunk size 90, 50 Hz, 50 demonstrations per task, $20k budget | [ALOHA project page](https://tonyzhaozh.github.io/aloha/) | pass |
| LeRobot implements ACT, Diffusion, pi0, pi0.5, GR00T N1.7, SmolVLA, HIL-SERL, TDMPC | [huggingface/lerobot README](https://github.com/huggingface/lerobot) (via gh) | pass |
| robot-datasets #19: illustrative plan "MP4 at 30 fps, Parquet at 50 Hz" marked verified | [LeRobotDataset v3 docs](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) | fail. info.json holds one FPS for the dataset, and add_frame writes images and state together, so the two rates contradict the format and the file's own code sketch. Fixed to a single 50 Hz rate |

## Area 9, Teleoperation: fact check

Summary line: 150 claims checked: 129 verified, 19 corrected, 2 unverifiable (0 kept flagged, 2 removed).

All 6 pre-existing [unverified] flags were re-tried and resolved (move-and-wait, camera exposure/readout, ISP latency, HLS latency, TCP_NODELAY, IEC 60204-1 stop categories). The file now has 0 flags. Two secondary sources were replaced with primaries (the 2026 TUM driving study, which was citing other papers for every number used here, and Wikipedia's AV1 article). Validation: `node tools/build-content.mjs --check knowledge/09-teleoperation.md` gives 0 warnings, 0 errors.

### teleop-modes
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | ALOHA streams leader joint angles to followers at 50 Hz | verified | [Zhao et al. 2023](https://ar5iv.labs.arxiv.org/html/2304.13705) | none |
| 2 | ALOHA costs about $20k | verified | [Zhao et al. 2023](https://ar5iv.labs.arxiv.org/html/2304.13705) | none ($18k, $20k with add-ons) |
| 3 | ALOHA paper is RSS 2023 | verified | [RSS XIX proceedings](http://www.roboticsproceedings.org/rss19/p016.html) | none |
| 4 | Yonder sends a picture to a remote Crew Chief, who selects an item to set the pick point | verified | [Plus One Robotics](https://www.plusonerobotics.com/automated-parcel-induction) | none |
| 5 | Yonder stores the answer to improve the model | verified | [Plus One Robotics](https://www.plusonerobotics.com/automated-parcel-induction) | none |
| 6 | Plus One Robotics still active (Nov 2026) | verified | [Robotics 24/7 company listing, April 2026](https://www.robotics247.com/company/plus_one_robotics) (secondary, search result only) | none |
| 7 | Waymo service "does not rely on remote drivers" | verified | [Waymo blog, 17 Feb 2026](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 8 | Requests come from the car; car can use or reject advice | verified | [Waymo blog](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 9 | About 70 remote assistance agents on duty worldwide | verified | [Waymo blog](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 10 | Median one-way latency about 150 ms (U.S.) and 250 ms (overseas) | verified | [Waymo blog](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 11 | Agents do not continuously monitor vehicles | verified | [Waymo blog](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 12 | Shared autonomy combines user input and autonomy; goal inferred from input | verified | [Javdani et al.](https://arxiv.org/abs/1503.07619) | none |
| 13 | Users faster with less input; ratings mixed (control versus speed) | verified | [Javdani et al.](https://arxiv.org/abs/1503.07619) | none |
| 14 | Javdani paper is RSS 2015 | verified | [RSS XI proceedings](http://www.roboticsproceedings.org/rss11/p32.html) | none |
| 15 | Phantom Auto remotely drove forklifts, yard trucks, sidewalk robots | verified | [TechCrunch, 12 Mar 2024](https://techcrunch.com/2024/03/12/remote-driving-startup-phantom-auto-is-shutting-down/amp/) (secondary, news) | none |
| 16 | Phantom Auto shut down March 2024 | verified | [TechCrunch](https://techcrunch.com/2024/03/12/remote-driving-startup-phantom-auto-is-shutting-down/amp/) (secondary, news) | none (closure announced 12 Mar 2024) |
| 17 | Phantom Auto raised about $95 million | verified | [TechCrunch](https://techcrunch.com/2024/03/12/remote-driving-startup-phantom-auto-is-shutting-down/amp/) (secondary, news) | none |
| 18 | "As of late 2025, 1X sells NEO" with "Expert Mode" | corrected | [1X order page](https://www.1x.tech/order) | corrected to "as of November 2026, 1X takes orders, U.S. deliveries promised for 2026, Scheduled Expert Mode"; added source [7]; I could not confirm whether customer deliveries had started, so the text does not claim they had |
| 19 | NEO operators wear VR headsets (Quest 3) | verified | [Road to VR, 30 Oct 2025](https://roadtovr.com/helper-robot-neo-vr-telepresence/) (secondary, news) | reworded as "launch coverage described" |
| 20 | Owner schedules the remote sessions | verified | [1X order page](https://www.1x.tech/order) | none |
| 21 | 200 plates an hour gives 18 s per plate | verified | arithmetic (3600 / 200) | none |

### operator-interfaces
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | robosuite: lateral move to horizontal motion, twist to rotation, held left button closes gripper | verified | [robosuite docs](https://robosuite.ai/docs/modules/devices.html) | none |
| 2 | UR add-on "3D Mouse Move" by Radalytica lets tool follow SpaceMouse in real time | verified | [UR marketplace](https://universal-robots.com/marketplace/products/01tP40000071NYeIAM) | none |
| 3 | Open-TeleVision used Apple Vision Pro | verified | [Cheng et al.](https://arxiv.org/html/2407.01512v2) | none |
| 4 | Streamed 480x640 per eye | verified | [Cheng et al.](https://arxiv.org/html/2407.01512v2) | none |
| 5 | Whole loop at 60 Hz | verified | [Cheng et al.](https://arxiv.org/html/2407.01512v2) | none |
| 6 | MIT operator controlled robot in San Diego, about 3,000 miles | verified | [Cheng et al.](https://arxiv.org/html/2407.01512v2) | none |
| 7 | Open-TeleVision is CoRL 2024 | verified | [PMLR vol. 270, 8th CoRL](https://proceedings.mlr.press/v270/cheng25b.html) | none |
| 8 | ALOHA: WidowX leaders ($3,300 each), ViperX followers, 50 Hz | verified | [Zhao et al. 2023](https://ar5iv.labs.arxiv.org/html/2304.13705) | none |
| 9 | GELLO bill of materials under $300 | verified | [Wu et al.](https://arxiv.org/html/2309.13037v2) | none |
| 10 | GELLO uses Dynamixel servos and 3D-printed parts | verified | [Wu et al.](https://arxiv.org/html/2309.13037v2) | none |
| 11 | 12-person study, 5 two-armed tasks | verified | [Wu et al.](https://arxiv.org/html/2309.13037v2) | none |
| 12 | Success 0.92 (GELLO) versus 0.72 (VR) and 0.63 (3D mice) | verified | [Wu et al.](https://arxiv.org/html/2309.13037v2) | none |
| 13 | GELLO was faster | verified | [Wu et al.](https://arxiv.org/html/2309.13037v2) | none |
| 14 | Surgeon motion reproduced "in scaled proportion" | verified | [Kypson and Chitwood 2004](https://arxiv.org/pdf/cs/0412055) | none |
| 15 | Console filters 8-10 Hz hand tremor | verified | [Kypson and Chitwood 2004](https://arxiv.org/pdf/cs/0412055) | none |
| 16 | Clutch works like lifting a computer mouse | verified | [Kypson and Chitwood 2004](https://arxiv.org/pdf/cs/0412055) | none |
| 17 | Kypson and Chitwood, Int. J. Advanced Robotic Systems, 2004 | verified | [Kypson and Chitwood 2004](https://arxiv.org/pdf/cs/0412055) | none (vol. 1 no. 2) |
| 18 | Code comment: USB poll "typically every 1-8 ms" | unverifiable | none opened | removed the number from the comment |

### latency-budget
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | G2G definition (lens to display glass) | verified | [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | none |
| 2 | About 20 ms motion-to-photon is the "comfort threshold" | corrected | [Varjo](https://support.varjo.com/hc/en-us/latency) | corrected to "threshold below which users generally do not notice it" (source's wording) |
| 3 | E2E = M2M + G2G; about 500 ms over 5G; M2M about 60% | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none |
| 4 | Camera delay spread evenly "between zero and one frame interval" | corrected | [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | corrected to "fixed minimum plus a wait spread over one frame interval" |
| 5 | Display delay spread between zero and one refresh interval | verified | [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | none |
| 6 | Mean G2G 50.4 ms (25 fps) and 15.5 ms (300 fps), 60 Hz monitor | verified | [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | none |
| 7 | Fiber about 31% slower, index about 1.47, about 200 km per ms | verified | [TeleGeography](https://resources.telegeography.com/the-speed-of-light-never-changes-except-when-it-does) | none (200 km/ms derived from the page's 124,188 mi/s) |
| 8 | Verizon Oct 2026 round trips 14 / 33 / 70 / 112 ms | verified | [Verizon](https://www.verizon.com/business/terms/latency/) | none |
| 9 | LTE adds a median 36 ms over LAN | corrected | [Kerbl et al. 2025](https://arxiv.org/html/2506.13933) | corrected to about 35 ms (LTE median 160 ms versus about 125 ms LAN); replaced the 2026 citing paper with this primary |
| 10 | G.114: below 150 ms "essentially transparent interactivity"; 400 ms planning limit; interactive tasks affected by less | verified | [ITU-T G.114 (05/2003)](https://www.cs.columbia.edu/%7Eandreaf/new/documents/other/T-REC-G.114-200305.pdf) | none |
| 11 | G.114 edition 05/2003 | verified | [ITU-T listing](https://www.itu.int/rec/T-REC-G.114) | noted "still in force with later amendments" (2003, 2009) |
| 12 | Telesurgery: 0-300 ms tested; 100 ms or less acceptable; significant rise 100 to 150 ms | verified | [Nankaku et al. 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9536636/) | none |
| 13 | Operators fall back to move-and-wait "above that" (above 150 ms) [unverified] | corrected | [Black 1970, NASA NTRS](https://ntrs.nasa.gov/api/citations/19710009659/downloads/19710009659.pdf) | flag removed; scope corrected to "at delays of seconds" (all subjects, 3.5 s delay, confirming Ferrell); added source [15] |
| 14 | 1,000 km of fiber costs about 5 ms each way | verified | arithmetic from [TeleGeography](https://resources.telegeography.com/the-speed-of-light-never-changes-except-when-it-does) | none |
| 15 | Waymo median one-way 150 / 250 ms | verified | [Waymo blog](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 16 | Testbed: G2G 193 ms, camera 120 ms, monitor 8 ms, M2M 306 ms, steering 270 ms | corrected | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | marked camera and steering figures as estimates (remainders after measured stages); added "commercial 5G" (NSA) |
| 17 | TUM G2G rig is open source, 0.5 ms precision | verified | [G2GDelay on GitHub](https://github.com/cbachhuber/G2GDelay) | added source [18]; the paper itself does not say open source |
| 18 | UR RTDE 500 Hz on e-Series and ur-Series | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 19 | NVENC low-latency settings "cap encoder buffering at about one frame" | corrected | [NVENC guide 13.1](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) | corrected to "recommended settings include an encoder buffer of about one frame" |
| 20 | Frame transmission about 15 ms of about 193 ms G2G | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none |
| 21 | Camera frame wait 0-33 ms at 30 fps, 0-17 ms at 60 fps | verified | arithmetic from [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | none |
| 22 | Exposure and readout "about 1-30 ms" [unverified] | corrected | [Basler white paper](https://assets-ctf.baslerweb.com/dg51pdwahxgw/7ntd9P0LbEeEmxKj6Q6J1h/cb845234f745dddab95f3ee64994dd7d/BAS1401_White_Paper_Rolling_Shutter.pdf) | flag removed; replaced with rows x row time (about 30-100 ms full-frame on 12-14 MP sensors; about 7 ms for 720 rows at 10 microseconds); added source [16] |
| 23 | Whole G2G as low as 8 ms with 300 fps camera | verified | [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | none (8.1 ms minimum) |
| 24 | ISP "about 1-10 ms" [unverified] | corrected | [RidgeRun PVA ISP measurements](https://developer.ridgerun.com/wiki/index.php/PVA_ISP_for_NVIDIA_Jetson/Performance/Latency_and_Throughput) (vendor) | flag removed; range replaced with 4-8 ms at 1080p, about 27 ms at 4K on Jetson Orin; added source [19] |
| 25 | Encode: one rig "30 ms frame period plus 9 ms processing" | corrected | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | corrected to "frames published every 30 ms plus about 9 ms server processing, codec not stated"; one-frame buffer arithmetic kept with NVIDIA source |
| 26 | 20.8 kb frame at 1.38 Mb/s takes 15 ms | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none |
| 27 | Fiber floor: 50 km 0.25 ms; 1,000 km 5 ms; 4,800 km at least 24 ms | verified | arithmetic; distance from [Cheng et al.](https://arxiv.org/html/2407.01512v2) | none |
| 28 | Backbone one way about 7 ms (Europe) to 56 ms (trans-Pacific) | verified | half of [Verizon](https://www.verizon.com/business/terms/latency/) round trips | none |
| 29 | LTE latency 29.5 ms standard deviation | verified | [Xiao et al., SECON 2019](https://wicon.arizona.edu/sites/default/files/2023-03/2019SECON_AdaptiveFog0.pdf) | source replaced with this primary; clarified it is round trip from a moving car; added source [14] |
| 30 | Decode: rig's 10.5 ms "including decode" | corrected | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | corrected to "receive-side processing, decoding not broken out"; range changed from "1-10 ms" to "up to about 10 ms" |
| 31 | Display average 8.3 ms at 60 Hz, 4.2 ms at 120 Hz | verified | arithmetic; [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none |
| 32 | Simple visual reaction 213-231 ms mean | verified | [Woods et al. 2015](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2015.00131/full) | none |
| 33 | Input device polling about 2 ms, up to 5 ms | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none |
| 34 | Command send one way: 10.3 ms on 5G | corrected | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | corrected to "average 10.3 ms for TCP command packets (direction not stated)" |
| 35 | Controller cycle 2 ms at 500 Hz to 10 ms at 100 Hz | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) (100 Hz interface), [UR RTDE](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 36 | Motion: "tens of ms for a small arm move" (no source) | corrected | [UR servoj manual](https://www.universal-robots.com/manuals/EN/HTML/SW10_12/Content/prod-scriptmanual/all_scripts/servoj_qavt0-008lookahead_time.htm) | replaced with "smoothing alone can span 30-200 ms (servoj lookahead range)"; steering 270 ms marked as estimate; added source [17] |
| 37 | G2G 150-200 ms over LTE in another rig | verified | [Kerbl et al. 2025](https://arxiv.org/html/2506.13933) | citation moved to the primary |
| 38 | Code sketch totals about 402 ms and 110 ms | verified | arithmetic | changed comment "+36 ms" to "+35 ms" |
| 39 | Source [3]: arXiv 2602.17381, 2026 | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none (19 Feb 2026, commercial 5G NSA, Luxembourg) |

### video-pipeline
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Raw 1280x720, 24-bit, 60 fps is about 1.3 Gb/s | verified | arithmetic | none |
| 2 | WebRTC browsers must implement H.264 and VP8 | verified | [RFC 7742](https://www.rfc-editor.org/rfc/rfc7742) | none |
| 3 | H.264 latest ITU-T edition June 2026 | verified | [ITU-T H.264 listing](https://www.itu.int/rec/T-REC-H.264) | none |
| 4 | H.265 approved 2013 | verified | [ITU-T H.265 listing](https://www.itu.int/rec/T-REC-H.265) | noted first edition 04/2013 |
| 5 | HEVC about 25-50% better than H.264 | verified | [Wikipedia HEVC](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding) (secondary); [ITU press release 2013](https://www.itu.int/net/pressoffice/press_releases/2013/01.aspx) | range kept, labeled secondary, said what it depends on; added ITU primary "about half the bit rate" as source [12] |
| 6 | AV1 released March 2018, royalty-free | verified | [AOMedia press release](https://aomedia.org/press%20releases/the-alliance-for-open-media-kickstarts-video-innovation-era-with-av1-release/) | replaced Wikipedia [4] with this primary |
| 7 | AV1 about 50% better than x264 (Facebook 2018) | verified | [Facebook Engineering](https://engineering.fb.com/video-engineering/av1-beats-x264-and-libvpx-vp9-in-practical-use-case/) | added primary [8] |
| 8 | AV1 about 9.5% better than HEVC at 4K, "2020" Waterloo study | corrected | [Li et al., Waterloo](https://ece.uwaterloo.ca/~z70wang/publications/iciar19_encoderCompare.pdf) | 9.5% at 2160p confirmed in the paper's table; removed "2020" (the PDF is an ICIAR 2019 paper by filename and the year is not printed in the text I could extract); added primary [9] |
| 9 | RTX 40 and later encode AV1; RTX 30 only decodes | verified | [NVIDIA support matrix](https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new) | added primary [10] |
| 10 | Intel Arc encodes AV1 in hardware | verified | [Intel support article](https://www.intel.com/content/www/us/en/support/articles/000098345/graphics.html) | added primary [11]; noted A-Series and B-Series |
| 11 | A B-frame must wait for a later frame | verified | follows from the definition (it references a later frame) | none |
| 12 | NVIDIA low-latency recipe: ultra-low/low tuning, CBR, single-frame VBV, infinite GOP, intra refresh, unidirectional B-frames | verified | [NVENC guide 13.1](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) | none |
| 13 | Unidirectional B-frames are "an HEVC-only variant" | corrected | [NVENC guide 13.1](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) | corrected to "this SDK supports only for HEVC" (guide says "currently supported for HEVC") |
| 14 | Intra refresh period 30 repairs about once a second at 30 fps | verified | [NVENC guide 13.1](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) | none |
| 15 | YouTube live: 2 B-frames, 2-second keyframe interval | verified | [YouTube Help](https://support.google.com/youtube/answer/2853702) | none |
| 16 | YouTube H.264: 720p30 3-8 Mb/s, 1080p30 5-14 Mb/s; less for HEVC/AV1 | verified | [YouTube Help](https://support.google.com/youtube/answer/2853702) | none |
| 17 | 4 Mb/s / 60 fps is about 67 kbit | verified | arithmetic | none |
| 18 | H.264 and H.265 both updated in 2026 | verified | [H.264](https://www.itu.int/rec/T-REC-H.264), [H.265](https://www.itu.int/rec/T-REC-H.265) | none (06/2026, 01/2026) |
| 19 | AV1 "can be slower to encode" without hardware | corrected | [Li et al., Waterloo](https://ece.uwaterloo.ca/~z70wang/publications/iciar19_encoderCompare.pdf) | made specific: over 500 times H.264's encoding time in software in that study; source moved off Wikipedia |

### webrtc
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | W3C Recommendation since 13 March 2025 | verified | [W3C WebRTC](https://www.w3.org/TR/webrtc/) | none |
| 2 | RFC 8825 summarizes the protocol suite (2021) | verified | [RFC 8825](https://www.rfc-editor.org/rfc/rfc8825) | none |
| 3 | Signaling channel "provided by unspecified means" | verified | [W3C WebRTC](https://www.w3.org/TR/webrtc/) | none |
| 4 | ICE: host, server-reflexive, relayed candidates; pairs tested with STUN checks; nomination | verified | [RFC 8445](https://www.rfc-editor.org/rfc/rfc8445) | none |
| 5 | Candidates exchanged over signaling, e.g. offer/answer | verified | [RFC 8445](https://www.rfc-editor.org/rfc/rfc8445) | none |
| 6 | Use TURN "only when a direct communication path cannot be found"; relays are costly | verified | [RFC 8656](https://www.rfc-editor.org/rfc/rfc8656) | none |
| 7 | DTLS handshake on media path keys SRTP | verified | [RFC 5764](https://www.rfc-editor.org/rfc/rfc5764) | none |
| 8 | SRTP required for all implementations | verified | [RFC 8825](https://www.rfc-editor.org/rfc/rfc8825) | none |
| 9 | Data channels: SCTP over DTLS over ICE/UDP; zero retransmits plus unordered is "UDP-like" | verified | [RFC 8831](https://www.rfc-editor.org/rfc/rfc8831) | none |
| 10 | Browser API: `ordered: false` with `maxRetransmits` or `maxPacketLifeTime` | verified | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel) (secondary, browser docs) | none |
| 11 | RFC 8825 "requires" congestion control in the transport | corrected | [RFC 8825](https://www.rfc-editor.org/rfc/rfc8825) | corrected to "lists it among the transport layer's necessary functions" (no MUST on that sentence) |
| 12 | GCC: delay-based plus loss-based; sender uses the lower estimate | verified | [GCC draft-02](https://datatracker.ietf.org/doc/html/draft-ietf-rmcat-gcc-02) | added that the draft is from July 2016 and expired |
| 13 | Segment streaming built for seconds of delay [unverified] | verified | [Apple HLS authoring spec](https://developer.apple.com/documentation/http-live-streaming/hls-authoring-specification-for-apple-devices) | flag removed; cited 6-second recommended segments; added source [11] |
| 14 | Pion: pure Go, robot-control use case, ordered/unordered and lossy/lossless channels | verified | [Pion GitHub](https://github.com/pion/webrtc) | none |
| 15 | Pion version 4 | verified | [Pion GitHub](https://github.com/pion/webrtc) | none |
| 16 | webrtc.org: open source, backed by Apple, Google, Microsoft, Mozilla; all major browsers; native Android/iOS | verified | [webrtc.org](https://webrtc.org/) | none |
| 17 | GCC loss rules: above 10% cut, 2-10% hold, below 2% raise 5% | verified | [GCC draft-02](https://datatracker.ietf.org/doc/html/draft-ietf-rmcat-gcc-02) | none |
| 18 | Overuse resets rate to about 0.85 x incoming bitrate | verified | [GCC draft-02](https://datatracker.ietf.org/doc/html/draft-ietf-rmcat-gcc-02) | none |
| 19 | Set `maxRetransmits` or `maxPacketLifeTime` (ms), never both | verified | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel) (secondary, browser docs) | none (both throws SyntaxError) |

### udp-vs-tcp
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | TCP is "a reliable, in-order, byte-stream service" | verified | [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293) | none |
| 2 | RTO initial 1 s, minimum 1 s, doubles on each timeout | verified | [RFC 6298](https://www.rfc-editor.org/rfc/rfc6298) | none |
| 3 | TCP SHOULD use Nagle and MUST let apps disable it per connection | verified | [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293) | none |
| 4 | Option is TCP_NODELAY [unverified] | verified | [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html) | flag removed; scoped to Linux; added source [7] |
| 5 | At 30 fps a frame is due every 33 ms | verified | arithmetic | none |
| 6 | QUIC runs over UDP; order only within a stream | verified | [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000) | none |
| 7 | Independent data should go on separate streams | verified | [RFC 9308](https://www.rfc-editor.org/rfc/rfc9308) | none |
| 8 | QUIC DATAGRAM frames not retransmitted; real-time media and gaming | verified | [RFC 9221](https://www.rfc-editor.org/rfc/rfc9221) | none |
| 9 | WebTransport: W3C CR Snapshot July 2026; streams and datagrams over HTTP/3; reliable-only over HTTP/2 | verified | [W3C WebTransport](https://www.w3.org/TR/webtransport/) | added exact date (30 July 2026) |
| 10 | 3-5% of networks block UDP; need TCP fallback | verified | [RFC 9308](https://www.rfc-editor.org/rfc/rfc9308) | added that these are 2016 measurements |
| 11 | Plant LAN round trips "well under a millisecond" | unverifiable | none opened | removed the number ("round trips are short") |
| 12 | 100 Hz commands with 40 ms RTT: about four commands held back | verified | arithmetic (labeled illustrative) | none |
| 13 | RFC dates: 9293 (2022), 9000 (2021), 9308 (2022), 9221 (2022), 6298 (2011) | verified | RFC pages above | none |

### network-impairments
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | RTP jitter D(i,j) and J += (abs(D) - J)/16 | verified | [RFC 3550](https://www.rfc-editor.org/rfc/rfc3550) | none |
| 2 | Urban LTE mean 81.9 ms, SD 29.5 ms (cited) | corrected | [Xiao et al., SECON 2019](https://wicon.arizona.edu/sites/default/files/2023-03/2019SECON_AdaptiveFog0.pdf) | primary figure shows mean 81.6 ms, SD 29.5 ms, round trip from a moving car to a fog server; rewritten as "about 82 ms" round trip; replaced the citing 2026 paper with the primary |
| 3 | RFC 4588: conferencing delay "usually excludes the use of retransmission" | verified | [RFC 4588](https://www.rfc-editor.org/rfc/rfc4588) | none |
| 4 | Prefer retransmission when RTT fits; otherwise FEC sized to observed loss | verified | [RFC 8854](https://www.rfc-editor.org/rfc/rfc8854) | none |
| 5 | FEC uses bandwidth even with no loss | verified | [RFC 8854](https://www.rfc-editor.org/rfc/rfc8854) | none |
| 6 | GCC lowers rate on spacing stretch or loss above 10% | verified | [GCC draft-02](https://datatracker.ietf.org/doc/html/draft-ietf-rmcat-gcc-02) | none |
| 7 | netem: delay with jitter, loss, rate, reordering | verified | [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html) | none |
| 8 | Opus in-band FEC about 20-30% depending on protection | verified | [RFC 8854](https://www.rfc-editor.org/rfc/rfc8854) | none |
| 9 | Flexible FEC (RFC 8627) recommended for video | verified | [RFC 8854](https://www.rfc-editor.org/rfc/rfc8854) | none |
| 10 | RFC dates: 3550 (2003), 4588 (2006), 8854 (2021) | verified | RFC pages above | none |

### watchdogs
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Unattended motion = speed x timeout (30 mm, 125 mm examples) | verified | arithmetic | none |
| 2 | Hardware watchdog resets the computer when keepalives stop | verified | [Linux watchdog API](https://www.kernel.org/doc/html/latest/watchdog/watchdog-api.html) | none |
| 3 | Spot endpoints check in; wrong challenge-response does not reset timeout | verified | [Spot E-Stop docs](https://dev.bostondynamics.com/docs/concepts/estop_service) | none |
| 4 | Actuators powered only while every endpoint's check-in is within its timeout | verified | [Spot E-Stop docs](https://dev.bostondynamics.com/docs/concepts/estop_service) | none |
| 5 | CUT (immediate power cut) and SETTLE_THEN_CUT (stop and sit, then cut) | verified | [Spot E-Stop docs](https://dev.bostondynamics.com/docs/concepts/estop_service) | none |
| 6 | Page does not say which stop level a lapsed timeout triggers | verified | [Spot E-Stop docs](https://dev.bostondynamics.com/docs/concepts/estop_service) | none |
| 7 | IEC 60204-1 stop categories 0, 1, 2 [unverified] | verified | [UR manual, Stop Categories](https://www.universal-robots.com/manuals/EN/HTML/SW10_7/Content/prod-usr-man/complianceUR30/stop_categories_UR20_en.htm) (manufacturer summary; standard text not opened) | flag removed; attributed to UR's summary; added source [4] |
| 8 | RTDE: "Inputs retain their last received value" | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 9 | RTDE 500 Hz on e-Series and ur-Series | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 10 | "Data-center servers" reboot via hardware watchdog | corrected | [Linux watchdog API](https://www.kernel.org/doc/html/latest/watchdog/watchdog-api.html) | source does not mention data centers; reworded to Linux machines with `/dev/watchdog` |
| 11 | `/dev/watchdog` kept alive by periodic writes | verified | [Linux watchdog API](https://www.kernel.org/doc/html/latest/watchdog/watchdog-api.html) | none |

### Notes
- Every source URL in the file was loaded during this check except the 2605.15952 TUM paper, which was loaded and then removed because each number taken from it was a citation of another paper (Kerbl et al. 2025, Xiao et al. 2019); both primaries now replace it.
- Remaining secondary sources: Wikipedia HEVC (25-50% range, alongside the ITU primary), Road to VR and TechCrunch (news reports on company status), MDN (browser API docs).
- Illustrative numbers (cheese plate settings, code sketch budgets, timeouts) were checked for plausibility and labeling only; all are labeled illustrative and sit inside the sourced ranges.

## Area 9, Teleoperation: analogy and precision review

Scope: all 8 concepts in `knowledge/09-teleoperation.md`. Validation after edits: `node tools/build-content.mjs --check knowledge/09-teleoperation.md` gives 0 warnings, 0 errors, 0 unverified flags.

### Analogies
| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| teleop-modes | rewritten | "Coach on the phone" suggests a live, continuous call with a helper who is watching all the time. That is wrong for remote assist, whose defining traits are that the robot starts the request, sends one snapshot, and nobody watches between requests. Those traits are why one person can cover many robots and a slow link is fine. | The robot texts a helper a photo and a question ("which one do I grab?"), then finishes the job itself. The other mode is taking the wheel and driving through a camera. The "breaks" section now says replies must come in seconds, not hours, and the operator sees late and feels nothing. |
| operator-interfaces | kept | | |
| latency-budget | kept | | |
| video-pipeline | kept (one Plain sentence corrected) | | |
| webrtc | kept | | |
| udp-vs-tcp | kept | | |
| network-impairments | kept | | |
| watchdogs | kept | | |

### Other fixes
- teleop-modes: Defined "closes the feedback loop" in plain words.
- teleop-modes: Rewrote the 1X sentence to follow the order page exactly ("US Deliveries start 2026"; a 1X expert supervises "at scheduled times" on tasks NEO does not know). "User-scheduled" is now cited to Road to VR [6], because the order page does not say who books the sessions.
- operator-interfaces: Defined "dead zone".
- operator-interfaces: The GELLO study had "5 two-armed tasks". The paper says 5 tasks on a two-armed station, one of which (hanging a hat) used a single arm. Corrected.
- latency-budget: The cheese plate example said the untuned 400 ms comes "before the operator even reacts". But that 400 ms includes the command-back stages too, which happen after the reaction. Reworded to: machine delay around the whole loop, on top of the operator's reaction time.
- latency-budget: The tuned 110 ms covers both directions, and it was compared with a "150 ms target" that is ITU-T G.114's one-way guideline. The text now says this outright, in the cheese plate example and in the code-sketch comment. I also checked Nankaku et al.: their delay was applied to both commands and video, and the paper does not say whether its figure is one-way or round trip.
- latency-budget: Defined "refractive index" in plain words, and "jitter buffer" where the cheese plate example first uses it.
- video-pipeline: Plain said "most of its savings come from each frame looking like the one before". That is too strong: each picture is also squeezed on its own (intra coding), and that accounts for a large share of the shrinkage. Now it says the codec shrinks each picture and then makes the stream several times smaller still by sending changes.
- video-pipeline: "Lookahead" was used in the misconception, the latency table and the code, but never defined. Added a definition to Precise, citing the NVENC guide: lookahead buffers frames to judge how hard they are, and NVIDIA leaves it out of its low-latency settings. Updated the description of source [5] to match.
- video-pipeline: Expanded VBV (video buffering verifier).
- video-pipeline: The misconception's "over 500 times slower" AV1 figure now says it came from the 2018 aomenc reference encoder, which the authors noted was not yet optimized for multi-threading. Without that, a reader would think all AV1 encoders are this slow. Updated the description of source [9] to match.
- webrtc: Defined SDP, STUN and SCTP. Replaced "TLS adapted for datagrams" (jargon defined with jargon) with a plain description of DTLS.
- udp-vs-tcp: Defined "segment" and "datagram".
- udp-vs-tcp: The cheese plate example made "40 ms round trip" sound like a property of the plant Wi-Fi. It now says that is the round trip to the operator. "Four or so commands" became "at least four", because one round trip is the best case. The code-sketch timeline is now labeled as the best case.
- network-impairments: Elsewhere called the LTE study "teleoperated vehicles". The study actually measured connected-car round trips to a fog server, not teleoperation. Reworded, and the spread is now stated as the 29.5 ms standard deviation.
- watchdogs: "Distance covered equals speed times timeout" left out the braking distance. Precise and Key numbers now say it is the motion before the stop begins, plus braking distance.
- watchdogs: The cheese plate example said the gripper stays closed so grapes are "not dropped onto the tray", but the tray is where the grapes are supposed to go. It now says "not dropped mid-move onto the tray edge or conveyor".
- Examples and misconceptions: all 8 cheese plate examples match the line (200 plates/hour, 18 s takt, four pick stations, cold room). All 8 Elsewhere settings are real. All 8 misconceptions are beliefs people actually hold, and their Realities are correct after the edits above.

### Spot-checks of the fact check
| Claim | Source opened | Result |
|---|---|---|
| 1X: order page says "US Deliveries start 2026", lists Scheduled Expert Mode, owner books the sessions | [1X order page](https://www.1x.tech/order); [Road to VR](https://roadtovr.com/helper-robot-neo-vr-telepresence/) (secondary, news) | Partial fail. Dates and Expert Mode confirmed. The order page says only "at scheduled times"; "user-scheduled" comes from Road to VR, so the citation is fixed. Web search quota ran out, so I could not check whether deliveries had started by November 2026. The text claims only what the order page says. |
| Waymo: about 70 agents on duty; median one-way 150 ms (U.S.) and 250 ms (abroad); no continuous monitoring; car can reject advice | [Waymo blog, 17 Feb 2026](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | Pass |
| Provost et al.: G2G 193 ms, camera about 120 ms (estimated), monitor 8.3 ms, 20.8 kb at 1376 kb/s about 15 ms, M2M 306 ms, steering about 270 ms (estimated), TCP command packets 10.3 ms, 100 Hz interface, E2E about 500 ms with M2M about 60%, 5G NSA | [arXiv 2602.17381](https://arxiv.org/html/2602.17381v1) | Pass |
| GELLO: 12 participants, 5 two-armed tasks, success 0.92 / 0.72 / 0.63, faster, under $300, Dynamixel, 3D-printed | [arXiv 2309.13037](https://arxiv.org/html/2309.13037v2) | Partial fail: one of the 5 tasks used a single arm. Text corrected. Numbers pass. |
| Verizon Oct 2026 round trips 14 / 33 / 70 / 112 ms | [Verizon IP latency](https://www.verizon.com/business/terms/latency/) | Pass (14.263, 33.354, 70.440, 112.058) |
| Kerbl et al.: LTE G2G 150-200 ms, median 160 ms; LAN about 125 ms; about 35 ms added by network; H.264 over RTSP | [arXiv 2506.13933](https://arxiv.org/html/2506.13933) | Pass |
| Xiao et al.: LTE round trip from a moving car, mean about 82 ms (81.6), SD 29.5 ms | [SECON 2019 author PDF](https://wicon.arizona.edu/sites/default/files/2023-03/2019SECON_AdaptiveFog0.pdf) | Pass. The figure annotation reads "Mean: 81.61", "STD: 29.5x" (read from the PDF's text layer). |
| Waterloo: AV1 saves 9.5% versus HEVC at 2160p; AV1 over 500 times AVC's encoding time | [Li et al. PDF](https://ece.uwaterloo.ca/~z70wang/publications/iciar19_encoderCompare.pdf) | Pass (Table 2 shows -9.5%; text says "over 500 times"). Added the reference-encoder caveat. |
| WebTransport: W3C Candidate Recommendation Snapshot, 30 July 2026; reliable-only over HTTP/2 | [W3C WebTransport](https://www.w3.org/TR/webtransport/) | Pass |
| ITU-T H.264 latest edition 06/2026; H.265 first 04/2013, latest 01/2026 | [H.264 listing](https://www.itu.int/rec/T-REC-H.264); [H.265 listing](https://www.itu.int/rec/T-REC-H.265) | Pass |
| NVENC low-latency list (ultra-low/low tuning, CBR, single-frame VBV, unidirectional B, infinite GOP, intra refresh); unidirectional B "currently supported for HEVC" | [NVENC guide 13.1](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) | Pass. Also confirmed that lookahead buffers frames and is not in the low-latency list. |
| Nankaku et al.: 0-300 ms tested; 100 ms or less acceptable; significant rise from 100 to 150 ms | [PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0274328) (the PMC mirror was blocked by a CAPTCHA) | Pass. Delay was applied to both commands and endoscope video; the paper does not say whether it is one-way or round trip. |

## Area 10, Platform: fact check

Summary line: 84 claims checked: 76 verified, 8 corrected, 0 unverifiable (0 kept flagged, 0 removed). All 3 existing [unverified] flags were resolved with sources and removed. 4 sources were replaced with primary ones (FlowFuse blog, ROS Index page, CB Insights profile, UL white paper); 9 sources were added. `build-content.mjs --check` passes with 0 errors.

### fleet-management

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | OpenRobOps released as open source (Apache 2.0) in September 2026 | verified | [The Robot Report, Sep 15 2026](https://www.therobotreport.com/inorbit-ai-releases-openrobops-iso-21423-reference-implementation/) (secondary) | none |
| 2 | OpenRobOps features: telemetry intake, incident detection, configuration as code | verified | [The Robot Report, Sep 2026](https://www.therobotreport.com/inorbit-ai-releases-openrobops-iso-21423-reference-implementation/) (secondary) | none |
| 3 | OpenRobOps uses outbound-only connections | verified | [InOrbit blog, Feb 2026](https://www.inorbit.ai/blog/openrobops-announcement) | none |
| 4 | Vendors call this robot operations, or RobOps | verified | [InOrbit blog](https://www.inorbit.ai/blog/openrobops-announcement) | none |
| 5 | VDA 5050 comes from VDA and VDMA | verified | [VDA 5050 spec v3.0.0, Foreword](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) | source changed from FlowFuse blog to the spec |
| 6 | VDA 5050 is JSON over MQTT | verified | [VDA 5050 spec, section 4](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) | none |
| 7 | Messages pass between a "master control" and each vehicle | corrected | [VDA 5050 spec v3.0.0](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) | v3.0 uses "fleet control", and "master control" never appears; changed in Precise and in Real products |
| 8 | Message types: orders, instant actions such as pause, state report | verified | [VDA 5050 spec, 6.2.1 (startPause/stopPause), 6.6](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) | none |
| 9 | Version 3.0 came out in March 2026 | verified | [GitHub release 3.0.0](https://github.com/VDA5050/VDA5050/releases/tag/3.0.0) (posted 18 Mar 2026; notes say the VDA released it 19 Mar 2026) | source [3] now points at the release page |
| 10 | Open-RMF fleet adapters range from full control to traffic light (pause and resume only) | verified | [Open-RMF book, Integration: fleets](https://osrf.github.io/ros2multirobotbook/integration_fleets.html) | replaced the ROS Index page, which does not describe the levels |
| 11 | ISO 21423 "described as upcoming as of September 2026" | corrected | [ISO 21423:2026 (ISO committee site)](https://committee.iso.org/standard/86749.html) | now says it was published 14 Oct 2026 as ISO 21423:2026, gives its scope in plain words, and notes the OpenRobOps reference implementation; new source [11] |
| 12 | FANUC ZDT monitors reducer and servo motor health and alerts before failure | verified | [FANUC America ZDT](https://www.fanucamerica.com/products/robots/zdt-zero-down-time) | none |
| 13 | Amazon passed 1 million robots in June 2025 | verified | [Amazon, Jun 30 2025](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | none |
| 14 | More than 300 facilities | verified | [Amazon](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | none |
| 15 | DeepFleet coordinates fleet movement | verified | [Amazon](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | none |
| 16 | DeepFleet improves fleet travel time by 10% (Amazon's claim) | verified | [Amazon](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | none |
| 17 | 200 plates/h x 3 wedges = 10 wedges/min | verified | arithmetic | none |
| 18 | Ground Control is InOrbit's hosted commercial tier | verified | [The Robot Report, Feb 4 2026](https://www.therobotreport.com/inorbit-adds-steve-cousins-board-offers-openrobops-open-source-fleet-manager/) (secondary) | the old citations [1][2] did not support this; new source [10] added |
| 19 | Formant does monitoring, alerting, remote access, and fleet data | verified | [Verdict, Jan 2022](https://www.verdict.co.uk/formant-rolls-out-cloud-based-platform-to-manage-robot-fleets/) (secondary); [formant.ai](https://formant.ai/) | none |
| 20 | Formant "listed as operating as of early 2026, could not open its docs" | corrected | [formant.ai](https://formant.ai/) | now says its site was live and selling as of November 2026; the CB Insights profile (secondary) was replaced with formant.ai |
| 21 | Open-RMF is an open-source ROS 2 framework that coordinates several vendors' fleets | verified | [Open-RMF book](https://osrf.github.io/ros2multirobotbook/integration_fleets.html) | none |
| 22 | VDA 5050 state is sent on every change and at least every 30 s | verified | [VDA 5050 spec, 6.6](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) ("when relevant events occur or at least every 30 seconds") | source changed from FlowFuse blog to the spec |
| 23 | "Largest single fleet: Amazon" | corrected | [Amazon](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | stated as Amazon's own claim ("world's largest fleet of industrial mobile robots") |
| 24 | InOrbit says teams spend months building cloud infrastructure, protocols, and schemas to monitor robot health | verified | [InOrbit blog](https://www.inorbit.ai/blog/openrobops-announcement) | none |
| 25 | InOrbit announcement dated February 2026 | verified | [InOrbit blog](https://www.inorbit.ai/blog/openrobops-announcement) (Feb 3 2026) | none |

### telemetry-logs

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | The ROS 2 recorder is rosbag2, and a recording is a bag | verified | [rosbag2 README (Jazzy)](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) | none |
| 2 | MCAP has been the default bag format since Iron | verified | [Foxglove, Dec 2022](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format); [rosbag2 README](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) | none |
| 3 | Iron was released in May 2023 | verified | [ROS 2 Iron release notes](https://github.com/ros2/ros2_documentation/blob/rolling/source/Releases/Release-Iron-Irwini.rst) (general availability May 23, 2023) | added primary source [6]; the Foxglove post only said "planned for May 2023" |
| 4 | MCAP chunks are compressed, e.g. with zstd or lz4 | verified | [MCAP spec](https://mcap.dev/spec) | none |
| 5 | MCAP embeds schemas | verified | [MCAP spec](https://mcap.dev/spec) | none |
| 6 | MCAP usually ends with an optional index or summary section | verified | [MCAP spec](https://mcap.dev/spec) | none |
| 7 | SQLite's fast write mode risked corruption on interruption, and its safe mode was slower | verified | [Foxglove, Dec 2022](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) | none |
| 8 | One MCAP file can mix ROS, Protobuf, and JSON | verified | [Foxglove, Dec 2022](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) | none |
| 9 | 1280x720x3x30 is about 83 MB/s, about 300 GB/h | verified | arithmetic (82.9 MB/s, 298.6 GB/h), labeled as arithmetic | none |
| 10 | Snapshot mode keeps an in-memory ring buffer and writes it to disk when a trigger service is called | verified | [rosbag2 README](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) (`--snapshot-mode`, `~/snapshot`) | none |
| 11 | rosbag2 splits by size or duration and offers zstd compression | verified | [rosbag2 README](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) | none |
| 12 | 4 stations x 8 h of one camera is close to 10 TB | verified | arithmetic (9.6 TB) | none |
| 13 | MCAP format, libraries, and CLI are Apache 2.0 | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 14 | Rerun uses .rrd and imports MCAP | verified | [Rerun repo](https://www.github.com/rerun-io/rerun) | none |
| 15 | Foxglove MCAP post dated December 2022 | verified | [Foxglove](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) (Dec 22 2022) | none |

### visualization-tools

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | RViz2 plugins include robot model, TF tree, camera, and depth | verified | [Stereolabs RViz2 docs](https://docs.stereolabs.com/docs/ros2/rviz2) | none |
| 2 | Stereolabs advises running RViz2 on a separate computer | verified | [Stereolabs](https://docs.stereolabs.com/docs/ros2/rviz2) (advice is about Jetson boards) | none |
| 3 | Foxglove is commercial with a free tier, runs in a browser or desktop app, and opens live and MCAP data | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 4 | Foxglove now adds data search | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 5 | Foxglove Studio's last open-source release was v1.87.0, Feb 2024 | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on); the foxglove/studio GitHub repo is archived | none |
| 6 | Lichtblick is an open-source browser and desktop viewer for ROS 1, ROS 2, and MCAP | verified | [Lichtblick docs](https://lichtblick-suite.github.io/docs) | none |
| 7 | Lichtblick is a fork of Foxglove Studio [unverified] | verified | [Lichtblick repo README](https://github.com/lichtblick-suite/lichtblick) ("originally began as a fork of Foxglove Studio") | flag removed; new source [7] added |
| 8 | Rerun is licensed Apache 2.0 and MIT | verified | [Rerun repo](https://www.github.com/rerun-io/rerun) | none |
| 9 | Rerun has Python, Rust, and C++ SDKs | verified | [Rerun repo](https://www.github.com/rerun-io/rerun) | none |
| 10 | Rerun imports MCAP and LeRobot datasets | verified | [Rerun repo](https://www.github.com/rerun-io/rerun) | none |
| 11 | Foxglove Pro starts at $20/month (May 2026) | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 12 | Free tier: 3 seats, 10 GB, 5 devices | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 13 | PlotJuggler was named in 2022 as able to read MCAP | verified | [Foxglove, Dec 2022](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) | none; the PlotJuggler repo was still active in Nov 2026 |
| 14 | The LeRobot dataset viewer opens episodes in Rerun or serves them to Foxglove | verified | [LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/en/lerobot-dataset-v3) | none |

### remote-updates

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | A canary is a partial, time-limited deployment compared against a control (SRE Workbook chapter 16) | verified | [Google SRE Workbook, Canarying releases](https://sre.google/workbook/canarying-releases/) | none |
| 2 | In shadow testing for vehicles, human and automated commands are recorded side by side and differences are flagged | verified | [Schwarz, Rolland, Johnston, ICE/ITMC 2022](https://research-portal.uws.ac.uk/en/publications/validation-of-vehicles-with-automated-features-through-the-detect/) | none |
| 3 | Mender writes to an inactive A/B partition, reboots, and rolls back on a failed boot or a missing commit | verified | [Mender blog](https://mender.io/blog/robust-ota-updates-with-partitions-for-linux-devices); [Mender integration checklist](https://docs.mender.io/client-installation/integration-checklist) | none |
| 4 | Robot software decides when an install or reboot may happen [unverified] | verified | [Mender state scripts](https://docs.mender.io/artifact-creation/state-scripts) (exit code 21, "retry later") | flag removed; reworded around Mender's retry-later hook; new source [7] |
| 5 | UN R156 requires a software update management system (SUMS) | verified | [UN R156 on EUR-Lex](https://eur-lex.europa.eu/eli/reg/2021/388/oj) | replaced UL white paper (secondary) with the regulation text |
| 6 | R156: carmakers must be able to restore the previous state when an update fails | corrected | [UN R156, 7.2.2.1.1](https://eur-lex.europa.eu/eli/reg/2021/388/oj) | now says: for over-the-air updates, restore the previous version or put the vehicle in a safe state |
| 7 | R156: an "audited" update management system | corrected | [UN R156, clause 6](https://eur-lex.europa.eu/eli/reg/2021/388/oj) | changed "audited" to "certified" (Certificate of Compliance for SUMS) |
| 8 | R156: identify the regulated software version in each vehicle | verified | [UN R156, 7.2.1.2 (RXSWIN)](https://eur-lex.europa.eu/eli/reg/2021/388/oj) | none |
| 9 | 3B params x 2 bytes is about 6 GB, about 8 min at 100 Mbit/s | verified | arithmetic (480 s) | none |
| 10 | 1,600 grape picks per shift; 1% = 16, 3% = 48 | verified | arithmetic (200/h x 8 h), labeled illustrative | none |
| 11 | Mender is open source, from Northern.tech | verified | [Mender blog](https://mender.io/blog/robust-ota-updates-with-partitions-for-linux-devices) | none |
| 12 | AWS RoboMaker was shut down in September 2025, and users were pointed to AWS Batch | verified | [The Robot Report, Sep 10 2025](https://www.therobotreport.com/aws-robomaker-shuts-down-after-failing-to-gain-traction/) (secondary; the AWS RoboMaker docs pages now return 404, which fits the shutdown) | none |
| 13 | A canary should run for at least one work unit | verified | [SRE Workbook](https://sre.google/workbook/canarying-releases/) | none |
| 14 | Source [2] authors and venue | verified | [UWS research portal](https://research-portal.uws.ac.uk/en/publications/validation-of-vehicles-with-automated-features-through-the-detect/) | none |

### data-pipelines

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | LeRobotDataset v3 packs many episodes into shared Parquet files plus MP4 per camera, with metadata marking episode boundaries | verified | [LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/en/lerobot-dataset-v3) | none |
| 2 | Episodes wait locally and upload when bandwidth allows [unverified] | verified | [Foxglove Edge Sites, Feb 2023](https://foxglove.dev/blog/announcing-foxglove-edge-sites) (queues data "as connectivity and bandwidth become available") | flag removed; new source [7] |
| 3 | HG-DAgger lets the human expert decide when to take control | verified | [HG-DAgger, arXiv 1810.02890](https://ar5iv.labs.arxiv.org/html/1810.02890) ("take control when they deem it necessary") | none |
| 4 | HG-DAgger is safer on real systems than DAgger | corrected | [HG-DAgger abstract](https://arxiv.org/abs/1810.02890) | reworded as the authors' argument, not a measured fact |
| 5 | HG-DAgger appeared at ICRA 2019 | verified | [Semantic Scholar record](https://api.semanticscholar.org/graph/v1/paper/arXiv:1810.02890?fields=title,venue,year,publicationVenue,externalIds) (DOI 10.1109/ICRA.2019.8793698) | none |
| 6 | RECAP is from November 2025 | verified | [arXiv 2511.14759](https://arxiv.org/abs/2511.14759) (v1 18 Nov 2025) | none |
| 7 | RECAP trains on demonstrations, autonomous attempts, and teleoperated interventions | verified | [arXiv 2511.14759](https://arxiv.org/abs/2511.14759) | none |
| 8 | RECAP more than doubles throughput "on its hardest tasks" | corrected | [arXiv 2511.14759](https://arxiv.org/abs/2511.14759) ("on some of the hardest tasks") | changed to "some of its hardest tasks" in Precise and in Key numbers |
| 9 | RECAP roughly halves the failure rate | verified | [arXiv 2511.14759](https://arxiv.org/abs/2511.14759) | same scope fix as row 8 |
| 10 | DROID has 76k trajectories and 350 hours | verified | [DROID, arXiv 2403.12945](https://arxiv.org/abs/2403.12945) | none |
| 11 | DROID: 50 collectors, 564 scenes, 3 continents, 12 months | verified | [DROID](https://arxiv.org/abs/2403.12945) | none |
| 12 | About 17 s per trajectory | verified | arithmetic (16.6 s) | none |
| 13 | 2% of 1,600 = 32 | verified | arithmetic, labeled illustrative | none |
| 14 | Foxglove offers search across recordings, events, and sessions | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 15 | Rerun is aimed at logging, querying, and streaming data for training | verified | [Rerun repo](https://www.github.com/rerun-io/rerun) | none |
| 16 | LeRobot v3 streams datasets from the Hub | verified | [LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/en/lerobot-dataset-v3) | none |

## Area 10, Platform: analogy and precision review

Scope: all 5 concepts in `knowledge/10-platform.md`. `node tools/build-content.mjs --check knowledge/10-platform.md` passes with 0 warnings and 0 errors.

### Analogies

| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| fleet-management | kept (Plain); "Where the analogy breaks" rewritten | The old breaks text said the operations center "does not steer the planes" while the fleet manager does. A reader would then predict that the fleet manager drives the robots and keeps them safe. It does neither: each robot drives itself, a VDA 5050 robot that loses its link finishes the route it was already cleared for, and VDA 5050 and ISO 21423 both say they set no safety requirements. | Same airline operations center. The breaks text now separates the ops center from air traffic control: a fleet manager does both jobs, but it still does not steer and is not the safety system. |
| telemetry-logs | kept (one overclaim fixed) | "Keeps everything the robot sensed and every command it sent" suggests a recording captures everything automatically. A bag holds only the topics someone chose to record, and the breaks text now says so. | Same flight data recorder. |
| visualization-tools | kept | n/a. The breaks text (belief vs. reality) was already right. Added that viewers such as RViz2 are mostly used live, which the "replay" picture hides. | Same instant replay screen. |
| remote-updates | kept (extended) | n/a. Added the shadow stage to the analogy (cook the new dish next to the old one without serving it) because the cheese example opens with shadow mode. Rewrote the unclear "a robot cannot always reach home" as: nobody is on hand when the update gets cut off halfway. | Same restaurant recipe rollout, now with a shadow step. |
| data-pipelines | kept | n/a. The film editing room analogy and its breaks text (bloopers are the most valuable footage; most editing is automated) are accurate. | Same film studio editing room. |

### Other fixes

- intro: "keeps the last minute" became "the last few minutes", to match the corrected buffer below. "Tries a new model on one station before the rest" assumed more than one grape station, but the line has one. It now says the model runs alongside the old one before it drives the arm.
- telemetry-logs (cheese example): the 60-second snapshot buffer contradicted the line's own timing. On an indexing line with an 18 s takt, a tray needs at least four moves (about 72 s) to get from grapes past apples, crackers, and cheese to inspection, so the grape station's evidence would already be overwritten. The buffer is now 3 minutes, with the arithmetic shown. Also added that 3 minutes of raw frames is about 15 GB of memory, so stations buffer the compressed image stream.
- telemetry-logs (Precise): "index (an optional summary section)" defined one piece of jargon with another. It now reads: summary section holding an index (a table of contents saying which chunk covers which time range). Also defined SQLite, zstd/lz4, and the snapshot service. Noted that the ring buffer's size is set by a cache-size setting (rosbag2 README).
- fleet-management (Precise): defined telemetry intake, configuration as code, and fleet adapters, which were used without definitions.
- fleet-management (cheese example): tied the 10 wedges a minute to the 18 s takt (one wedge every 6 s), so it lines up with area 6 and area 11.
- fleet-management (Sources): descriptions of [4] and [11] now list the newly cited facts: the connection-loss rule in 4.1, "no safety requirements" in section 2, and ISO 21423 being "not safety-related".
- visualization-tools (Precise): defined plugins and transform tree.
- remote-updates (Precise): added the missing "what breaks without it" line. Defined weights file. Noted that Mender's retry-later hold only lasts up to a configured timeout. Moved the UN R156 sentence out of Precise, because the Elsewhere example said the same thing almost word for word.
- remote-updates (Elsewhere): kept UN R156 but made it add something new. It now cites 7.2.2.1.2 (enough power to finish or recover) and 7.2.2.1.3 (an update that could affect safety runs only in a safe vehicle state, the car version of waiting until the arm is stopped). Both were checked on EUR-Lex. The source [5] description was updated.
- remote-updates (cheese example): the canary had no control group. With one line, the comparison has to be the old model's miss rate on recent shifts. With more lines, the other lines' grape stations would be the control.
- data-pipelines (Precise): "Parquet (column-oriented tables)" was jargon defined with jargon. It now reads: a table file format that stores data column by column, so one field can be read across millions of rows quickly. HG-DAgger now explains the mechanism. In plain DAgger the robot keeps control while the expert labels its actions, which hurts both safety and label quality. In HG-DAgger the expert takes over, and only labels from the stretches when the expert is in control are added to the training data. Checked against the abstract and the method section on ar5iv. The source [2] description was updated.
- misconceptions: all 5 checked. Each is a belief people really hold, and each Reality is correct. No changes.

### Spot-checks of the fact check

| Claim | Source opened | Result |
|---|---|---|
| OpenRobOps released as open source under Apache 2.0, September 2026 (verified) | [The Robot Report, Sep 15 2026](https://www.therobotreport.com/inorbit-ai-releases-openrobops-iso-21423-reference-implementation/) | Pass. "Distributed under the Apache 2.0 license". This article never says "outbound", but [2] supports that. |
| Outbound-only connections (verified) | [InOrbit blog, Feb 3 2026](https://www.inorbit.ai/blog/openrobops-announcement) | Pass. "Outbound-only MQTTS or WebSockets". |
| InOrbit says teams spend months building infrastructure (verified) | [InOrbit blog](https://www.inorbit.ai/blog/openrobops-announcement) | Pass. The source combines two sentences: "waste months reinventing the wheel" and "forced to build custom cloud infrastructure, communication protocols, and database schemas". It is a vendor claim, and the text already frames it as "InOrbit describes". |
| Ground Control is the fully managed cloud tier (verified) | [The Robot Report, Feb 4 2026](https://www.therobotreport.com/inorbit-adds-steve-cousins-board-offers-openrobops-open-source-fleet-manager/) | Pass. "Fully-managed, cloud-based". |
| Amazon: 1 millionth robot, 300+ facilities, DeepFleet, 10% travel time, June 2025 (verified) | [Amazon, Jun 30 2025](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | Pass, all four figures. The "world's largest fleet of industrial mobile robots" wording is in the subtitle. |
| VDA 5050 state sent on events or at least every 30 s (verified) | [VDA 5050 v3.0.0 spec](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) | Pass. Exact sentence in 6.6. Also confirmed "fleet control" as the term (a fact-checker correction). |
| ISO 21423:2026 published October 2026 (corrected; re-checked) | [ISO/TC 299 page](https://committee.iso.org/standard/86749.html) | Pass. Stage 60.60, dated 2026-10-14. |
| Foxglove free tier: 3 seats, 10 GB, 5 devices; Pro from $20/month; Studio v1.87.0 in Feb 2024 (verified) | [Foxglove, May 25 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | Pass, all figures. |
| MCAP format, libraries, and CLI are Apache 2.0 (verified) | [Foxglove, May 25 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | Pass. |
| rosbag2 snapshot mode: in-memory circular buffer saved by calling the `~/snapshot` service; mcap is the default (verified) | [rosbag2 README (Jazzy)](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) | Pass. Buffer size is set by `--max-cache-size`. The README gives no duration option, which is why the cheese example now talks about sizing the buffer. |
| AWS RoboMaker discontinued, with AWS Batch as the replacement (verified) | [The Robot Report, Sep 10 2025](https://www.therobotreport.com/aws-robomaker-shuts-down-after-failing-to-gain-traction/) | Pass. "Officially discontinued", Batch named. The article gives no exact shutdown day, so "September 2025" matches its date. This is a secondary source. |
| Mender exit code 21 means "retry later" (verified) | [Mender state scripts](https://docs.mender.io/artifact-creation/state-scripts) | Pass. Retries are capped by StateScriptRetryTimeoutSeconds, and that limit is now in the text. |
| UN R156: restore the previous version or reach a safe state after a failed or interrupted OTA update (corrected; re-checked) | [EUR-Lex, Regulation 2021/388](https://eur-lex.europa.eu/eli/reg/2021/388/oj) | Pass. 7.2.2.1.1 matches the text. |
| Formant site live as of November 2026 (corrected; re-checked) | [formant.ai](https://formant.ai/) | Pass. Active product site, page metadata dated Nov 11 2026. |
| Foxglove Edge Sites queue data for cloud import as bandwidth allows (verified) | [Foxglove, Feb 16 2023](https://foxglove.dev/blog/announcing-foxglove-edge-sites) | Pass. Exact phrase. |
| HG-DAgger lets the expert decide when to take control (verified) | [arXiv 1810.02890](https://arxiv.org/abs/1810.02890); [ar5iv method section](https://ar5iv.labs.arxiv.org/html/1810.02890) | Pass. Labels are collected only while the expert is in control, a detail now added to the text. |
| RECAP more than doubles throughput and roughly halves failure rate on some of the hardest tasks; Nov 2025 (verified, scope corrected) | [arXiv 2511.14759](https://arxiv.org/abs/2511.14759) | Pass. "On some of the hardest tasks". Submitted 18 Nov 2025. |
| DROID: 76k trajectories, 350 h, 564 scenes, 50 collectors, 3 continents, 12 months (verified) | [arXiv 2403.12945](https://arxiv.org/abs/2403.12945) | Pass, all figures. The abstract also gives 84 tasks. |

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

## Area 12, Industry map: fact check

Summary line: 150 claims checked: 128 verified, 15 corrected, 7 unverifiable (4 kept flagged, 3 removed). Of the 7 original [unverified] flags, 3 are resolved: one corrected (Intrinsic), one verified with a new source (offline-program touch-up), one removed (reducer swap). The other 4 were retried and stay flagged. Sources replaced with primary ones: both Wikipedia "Industrial robot" citations (now the IFR 2019 release), the Symbotic Wikipedia citations for revenue, customers, and Walmart (now the SEC 10-K and 8-K), the Intrinsic Wikipedia citation (now Intrinsic's own post), the Hitachi page (an unrelated Chaskey crypto release; now JR Automation's About page), KUKA Wikipedia for Visual Components (now Visual Components' About page), and Wikipedia for the Hyundai and Amazon deals (now the Boston Dynamics and Amazon releases). The "Systems integrator" Wikipedia source was removed because its cited reference is about security-system integrators. `build-content.mjs --check` passes with 0 errors and 0 warnings. The shared WebSearch quota ran out partway through. Later checks used direct fetches, the arXiv API, and Wikipedia's external-link API.

### value-chain

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | FANUC ASIs "design, build, and support" custom robot systems | verified | [FANUC America ASI directory](https://www.fanucamerica.com/integrators/robotics) | none |
| 2 | Chef leases robots under RaaS covering hardware, software, updates, field service | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none |
| 3 | IFR: 2018 robot sales US$16.5 billion | verified | [IFR press release, Sep 18 2019](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) | source changed from Wikipedia to the IFR release |
| 4 | Complete robot systems US$48.0 billion in 2018 | corrected | [IFR press release, Sep 2019](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) | corrected US$48.0 billion to about US$50 billion. IFR's own release says "approximately 50 billion USD". The US$48.0 billion figure, which Wikipedia attributes to the executive summary, could not be found in that PDF's text layer |
| 5 | Robot itself about a third of system spending | verified | IFR 2019 (16.5 / 50 = 33%) | none |
| 6 | More than 600,000 industrial robots installed in 2025 | verified | [IFR, Sep 24 2026](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) | none |
| 7 | China took 59% of 2025 installations | verified | [IFR, Sep 2026](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) | none |
| 8 | About two more dollars around every arm dollar (illustrative) | verified | IFR 2019 ratio (50 / 16.5 = 3.0) | none; labeled illustrative |
| 9 | Chef lists airline catering among its industries | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none |
| 10 | Symbotic "builds and operates" warehouse systems | corrected | [Symbotic 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) | now "builds ... and for some of them also runs the system". The 10-K shows operation services for some customers (C&S), not for all |
| 11 | Symbotic customers include Walmart, Target, Albertsons | verified | [Symbotic 10-K](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) | added C&S Wholesale Grocers; source changed from Wikipedia |
| 12 | Symbotic revenue US$2.25 billion "in 2025" | corrected | [Symbotic FY2025 results, SEC 8-K exhibit, Nov 24 2025](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000277/q4258-k_ex991.htm) | now "fiscal 2025, the year to September 2025" (US$2,247 million); new source [6] |
| 13 | World Robotics 2026 edition covers 2025 | verified | [IFR, Sep 2026](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) | none |
| 14 | Chef RaaS bundles hardware, software, AI updates, field service, monitoring | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none |
| 15 | About two thirds of system spending lies outside the robot | verified | IFR 2019 (33.5 / 50 = 67%) | none |
| 16 | Operational stock about 5 million | verified | [IFR, Sep 2026](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) | none |
| 17 | Chinese makers held 55% of their home market | verified | [IFR, Sep 2026](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) | none |
| 18 | Key numbers: US$16.5 billion vs US$48.0 billion | corrected | [IFR, Sep 2019](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) | corrected to "about US$50 billion" |

### component-makers

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Nabtesco about 60% of precision reducers for medium/large robot joints (own estimate) | verified | [Nabtesco](https://www.nabtesco.com/en/products/robot/) | none |
| 2 | Harmonic Drive Systems makes strain wave gears | verified | [HDS](https://www.hds.co.jp/english/) | none |
| 3 | Strain wave gears are zero-backlash | verified | [Harmonic Drive LLC](https://www.harmonicdrive.net/) | added citation [7]; HDS page itself does not say it |
| 4 | Sold for cobots, 6-axis, and SCARA robots | verified | [HDS](https://www.hds.co.jp/english/) (application list) | none |
| 5 | Also sold as actuators with motor built in | verified | [HDS](https://www.hds.co.jp/english/); [Harmonic Drive LLC](https://www.harmonicdrive.net/) | none |
| 6 | Changing reducer supplier is closer to a redesign [unverified] | unverifiable | none found | removed (sentence was engineering judgment; concept reads fine without it) |
| 7 | ATI is now a Novanta brand | verified | [Novanta](https://www.novanta.com/) (brand menu lists ATI, links ati.novanta.com) | none |
| 8 | ATI sells tool changers and force-torque sensors (also material removal tools) | verified | [ATI](https://www.ati-ia.com/) | none |
| 9 | Robotiq sells grippers, sensors, wrist cameras, palletizing and machine-tending cells | verified | [Robotiq](https://robotiq.com/) | none |
| 10 | NVIDIA sells Jetson Thor onboard computers for learned models | verified | [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) | none |
| 11 | Soft Robotics sold its gripper business to Schmalz, August 2024 | verified | [Oxipital AI / Soft Robotics](https://www.softroboticsinc.com/) (August 6, 2024) | none |
| 12 | The sale included mGrip | verified | [Soft Robotics page](https://www.softroboticsinc.com/) shows mGrip under Schmalz Group; [Oxipital press release](https://www.oxipitalai.com/oxipital-ai-press-release/) links to a Schmalz mGrip page | source note updated |
| 13 | Remaining company became Oxipital AI, a vision-inspection firm | verified | [Oxipital press release](https://www.oxipitalai.com/oxipital-ai-press-release/) | none |
| 14 | Schmalz is a German vacuum specialist | verified | [Schmalz](https://www.schmalz.com/en-us); [Schmalz imprint](https://www.schmalz.com/en/imprint) (Glatten, Germany) | none |
| 15 | Large robots typically have RV-type reducers in main joints | verified | [Nabtesco](https://www.nabtesco.com/en/products/robot/) (own share estimate) | none |
| 16 | Harmonic Drive LLC serves North America | verified | [Harmonic Drive LLC](https://www.harmonicdrive.net/) | none |
| 17 | Connects to: reducer is the "hardest-to-replace" component | unverifiable | none found | removed; now "the most concentrated joint component" |

### robot-makers

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | RoboDK needs separate post processors for ABB RAPID, FANUC, KUKA KRC, Yaskawa Inform, UR | verified | [RoboDK](https://robodk.com/) | renamed "Yaskawa Motoman Inform" to match the source |
| 2 | FANUC sends buyers to its Authorized System Integrators | verified | [FANUC America](https://www.fanucamerica.com/integrators/robotics) | none |
| 3 | UR+ started 2016 | verified | [Universal Robots, Wikipedia](https://en.wikipedia.org/wiki/Universal_Robots) (secondary) | none |
| 4 | FANUC: more than 1 million robots installed | verified | [FANUC America](https://www.fanucamerica.com/) ("1M+") | none |
| 5 | Universal Robots: more than 100,000 cobots sold | verified | [Universal Robots](https://www.universal-robots.com/) ("Over 100,000 Sold Worldwide") | source changed from Wikipedia, which gave no source for it, to UR's site (new [16]) |
| 6 | Midea, an appliance maker, owns KUKA | verified | [KUKA squeeze-out release, Nov 8 2022](https://kuka.com/en-ch/company/press/news/2022/11/squeeze-out-completed); [KUKA, Wikipedia](https://en.wikipedia.org/wiki/KUKA) (secondary) | none |
| 7 | Teradyne is Nasdaq-listed | verified | [Teradyne IR](https://investors.teradyne.com/) (NASDAQ:TER) | reworded to "maker of chip-test equipment"; new source [17] |
| 8 | Teradyne owns Universal Robots and MiR | verified | [Teradyne Robotics](https://www.teradyne.com/robotics/) | none |
| 9 | Hyundai Motor Group controls Boston Dynamics | verified | [Boston Dynamics release, Jun 21 2021](https://bostondynamics.com/news/hyundai-motor-group-completes-acquisition-of-boston-dynamics-from-softbank/) | source changed to primary (new [18]) |
| 10 | Chinese makers supplied 55% of 354,000 China installs in 2025 | verified | [IFR, Sep 2026](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) | none |
| 11 | DR-3iB/6 STAINLESS: FANUC's first stainless food-grade delta for primary food | verified | [FANUC food and beverage](https://www.fanucamerica.com/industries/food-beverage) | none |
| 12 | CRX-30iA Food Grade, 30 kg payload | verified | [FANUC food and beverage](https://www.fanucamerica.com/industries/food-beverage) | none |
| 13 | Cheese station about 10 placements/min (3 x 200 / 60) | verified | arithmetic | none |
| 14 | Hyundai agreed December 2020 to buy 80% | verified | [Boston Dynamics, Wikipedia](https://en.wikipedia.org/wiki/Boston_Dynamics) (secondary) | none |
| 15 | Completed June 2021; SoftBank affiliate keeps about 20% | verified | [Boston Dynamics release, Jun 2021](https://bostondynamics.com/news/hyundai-motor-group-completes-acquisition-of-boston-dynamics-from-softbank/) | "about 20%" made exact (20%) |
| 16 | Spot for industrial inspection, Stretch for warehouse cases | verified | [Boston Dynamics About](https://bostondynamics.com/about/) | none |
| 17 | Boston Dynamics "is developing" electric Atlas | verified | [Boston Dynamics About](https://bostondynamics.com/about/) | reworded to BD's own framing (start of its journey to a commercial humanoid product); dropped Wikipedia cite |
| 18 | Announced expanded manufacturing collaboration with Hyundai | verified | [Boston Dynamics About](https://bostondynamics.com/about/) (news headline) | none |
| 19 | ABB Robotics about 7,000 employees, US$2.3 billion revenue 2024 | verified | [Robotics 24/7, Oct 8 2025](https://www.robotics247.com/article/abb_divests_robotics_division_to_softbank_group_for_5.375b/abb_group) (secondary; ABB's own release timed out) | source changed from Wikipedia |
| 20 | KUKA about 14,500 employees, EUR 3.9 billion sales | verified | [About KUKA](https://www.kuka.com/en-de/company/about-kuka) | none (page also says "more than 15,000 colleagues" elsewhere and gives no fiscal year) |
| 21 | FANUC independent, Tokyo-listed; robots, CNC, machine tools | verified | [FANUC, Wikipedia](https://en.wikipedia.org/wiki/Fanuc) (secondary; fanuc.co.jp profile URL 404) | none |
| 22 | ABB agreed October 2025 to sell to SoftBank for about US$5.4 billion | verified | [Robotics 24/7, Oct 2025](https://www.robotics247.com/article/abb_divests_robotics_division_to_softbank_group_for_5.375b/abb_group) (secondary) | made exact: enterprise value US$5.375 billion |
| 23 | China's NDRC "reported" to have blocked the deal, November 2026 | corrected | [Robotics 24/7, Nov 5 2026](https://www.robotics247.com/article/softbanks-proposed-5.4b-acquisition-of-abb-robotics-blocked-by-china) (secondary); [The Robot Report, Nov 5 2026](https://www.therobotreport.com/chinese-regulators-block-softbanks-5-4b-acquisition-of-abb-robotics/) (secondary) | ABB said China's foreign-investment security review prohibited the acquisition of the ABB Robotics business in China. The NDRC was only the FT's account of who told SoftBank. ABB and SoftBank are still working on the deal. New [15] |
| 24 | ABB Robotics still part of ABB as of November 2026 | verified | [Robotics 24/7, Nov 2026](https://www.robotics247.com/article/softbanks-proposed-5.4b-acquisition-of-abb-robotics-blocked-by-china) (deal not closed) | none |
| 25 | Midea control from January 2017 (94.55%) | verified | [KUKA, Wikipedia](https://en.wikipedia.org/wiki/KUKA) (secondary) | none |
| 26 | Remaining KUKA shares squeezed out November 2022 | verified | [KUKA release, Nov 8 2022](https://kuka.com/en-ch/company/press/news/2022/11/squeeze-out-completed) | none |
| 27 | KUKA owns Swisslog and Visual Components | verified | [KUKA, Wikipedia](https://en.wikipedia.org/wiki/KUKA) (secondary); [Visual Components About](https://www.visualcomponents.com/company/about-us/) | none |
| 28 | UR owned by Teradyne since 2015, US$285 million | verified | [Universal Robots, Wikipedia](https://en.wikipedia.org/wiki/Universal_Robots) (secondary; Teradyne 2015 release URL 404) | none |
| 29 | Rohit Prasad named Boston Dynamics CEO, October 2026 | verified | [The Robot Report, Oct 6 2026](https://www.therobotreport.com/boston-dynamics-appoints-former-amazon-executive-rohit-prasad-new-ceo/) (secondary) | stated directly, not "Wikipedia reports"; new [19] |
| 30 | Stäubli has four divisions incl. robotics | verified | [Stäubli, Wikipedia](https://en.wikipedia.org/wiki/St%C3%A4ubli) (secondary; staubli.com returned 403) | none |
| 31 | Plants pick the brand their integrators and spares support [unverified] | unverifiable | no survey found on retry | flagged (kept) |

### integrators

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Complete systems cost about 3x the robots in them | verified | [IFR, Sep 2019](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) | source changed from Wikipedia |
| 2 | Integrators described as "engineering departments for small manufacturers" incl. security | corrected | [FANUC America ASI directory](https://www.fanucamerica.com/integrators/robotics) | replaced with FANUC's "design, build, and support custom robotic systems". The Wikipedia line cites a security-systems integrator article, so it does not apply here. Source removed |
| 3 | Most projects fixed-price with milestone payments [unverified] | unverifiable | no published survey found on retry | flagged (kept) |
| 4 | FANUC directory lists CKC Automation (Oakland) and Aslin Automation (Livermore) | verified | [FANUC America](https://www.fanucamerica.com/integrators/robotics) | none |
| 5 | Toyota Automated Logistics combined Bastian, Vanderlande warehousing, viastore on April 1, 2026 | verified | [Toyota Automated Logistics](https://toyota-automated-logistics.com/) | none |
| 6 | TAL integrates conveyors, sortation, AS/RS, mobile robots, palletizing, WCS | verified | [Toyota Automated Logistics](https://toyota-automated-logistics.com/) | none |
| 7 | RoboDK: 1,400+ robots from 80+ makers | verified | [RoboDK](https://robodk.com/) | none |
| 8 | Visual Components is "cell and line simulation", owned by KUKA | corrected | [Visual Components About](https://www.visualcomponents.com/company/about-us/) | now "manufacturing simulation and offline programming, owned by KUKA since 2017"; source changed from KUKA Wikipedia |
| 9 | About two thirds of system spend outside the robot | verified | IFR 2019 | none |
| 10 | Key numbers: US$48.0 billion | corrected | [IFR, Sep 2019](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) | corrected to about US$50 billion |
| 11 | TAL is a Toyota Industries business (hedged) | verified | [Toyota Automated Logistics](https://toyota-automated-logistics.com/) (footer link) | none |
| 12 | ATS listed on TSX and NYSE; five markets | verified | [ATS](https://atsautomation.com/) | none |
| 13 | JR Automation is a Hitachi business | verified | [JR Automation About](https://www.jrautomation.com/about) ("acquired by Hitachi, Ltd. in 2019") | the old source was an unrelated Hitachi press release (Chaskey cryptography). Replaced, and the claim now says it was acquired in 2019 |
| 14 | FAT criteria labeled illustrative | verified | n/a | none |
| 15 | Robot makers keep approved integrator networks | verified | [FANUC America](https://www.fanucamerica.com/integrators/robotics) | none |

### application-companies

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Chef sells AI-driven food-assembly robots running ChefOS | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none |
| 2 | RaaS includes hardware, software, AI updates, hardware upgrades, field service, 24/7 monitoring | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none |
| 3 | Works with customer's own ingredients, portion sizes, trays | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none |
| 4 | Symbotic "builds and operates" systems | corrected | [Symbotic 10-K](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) | now "builds ... and sells software support and, for some customers, operation services"; new source [4] |
| 5 | Chef lists airline catering, and gategroup as a customer | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none |
| 6 | Giveaway reduced 4% and 67% in two case studies | verified | [Chef Robotics](https://www.chefrobotics.ai/) (Amy's Kitchen 4%, Cafe Spice 67%) | none |
| 7 | Whether gategroup uses Chef on cheese plates [unverified] | unverifiable | Chef site still names gategroup only as a logo | flagged (kept) |
| 8 | Walmart began using Symbotic at a Florida DC in 2017 | verified | [Symbotic, Wikipedia](https://en.wikipedia.org/wiki/Symbotic) citing [TechCrunch, Jul 2021](https://techcrunch.com/2021/07/13/walmart-will-be-bringing-symbotic-robots-to-25-distribution-centers/) (secondary) | reworded "began using" to "piloted" (TechCrunch calls it a pilot) |
| 9 | July 2021: robots to 25 more regional DCs | verified | [Symbotic 10-K](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) | updated: 25 of 42 RDCs in 2021, all 42 in 2022 |
| 10 | Symbotic "operates the system" for Walmart | corrected | [Symbotic 10-K](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) | removed "operates"; 10-K confirms operation services only for C&S |
| 11 | Walmart about 85% of Symbotic fiscal 2025 revenue | verified | [Symbotic 10-K](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) | added (shows the single-customer dependence) |
| 12 | RaaS lets customers avoid capital budgets | verified | [Chef Robotics](https://www.chefrobotics.ai/) ("without a large upfront capital expense") | none |
| 13 | Under RaaS the company "is paid only while its robots keep working" | corrected | [Chef Robotics](https://www.chefrobotics.ai/) | Chef does not say this. Now says the lease includes field service, parts replacement, and 24/7 uptime monitoring |
| 14 | Chef in more than a dozen facilities across US, Canada, Europe | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none |
| 15 | Nearly 100 million servings | verified | [Chef Robotics](https://www.chefrobotics.ai/) (counter at 98,578,982) | none |
| 16 | Giveaway reductions 4% to 67% depending on customer | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none (homepage also cites an untied 88% figure) |
| 17 | Symbotic revenue "in 2025" US$2.25 billion | corrected | [Symbotic 8-K exhibit](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000277/q4258-k_ex991.htm) | labeled fiscal 2025 (year to September 2025); new source [5] |
| 18 | Chef customers incl. Taylor Farms, gategroup, Amy's Kitchen, CookUnity | verified | [Chef Robotics](https://www.chefrobotics.ai/) (logos) | none |
| 19 | Symbotic customers Walmart, Target, Albertsons | verified | [Symbotic 10-K](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) | added C&S Wholesale Grocers |
| 20 | Symbotic SPAC merger with SoftBank-sponsored company announced December 2021 | verified | [Symbotic, Wikipedia](https://en.wikipedia.org/wiki/Symbotic) (secondary) | none |
| 21 | Robotiq was "originally a gripper maker" | unverifiable | [Robotiq About](https://robotiq.com/about) says nothing about origins | removed "originally" |
| 22 | Robotiq sells palletizing, machine-tending, screwdriving workcells | verified | [Robotiq](https://robotiq.com/) | none |

### model-companies

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | openpi releases π0, π0-FAST, π0.5 under Apache 2.0 | verified | [openpi on GitHub](https://github.com/Physical-Intelligence/openpi) | none |
| 2 | NVIDIA calls GR00T 1.7 an open VLA with a commercial license | verified | [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) | none |
| 3 | Gemini Robotics: 100+ trusted testers; partners Apptronik, Agile Robots, Boston Dynamics | verified | [Google DeepMind](https://deepmind.google/models/gemini-robotics/) | none |
| 4 | Covariant gave Amazon a non-exclusive license; co-founders and about a quarter of staff joined, August 2024 | verified | [Amazon, Aug 30 2024](https://www.aboutamazon.com/news/company-news/amazon-covariant-ai-robots) | source changed from Wikipedia to Amazon (new [8]); "three co-founders" made explicit |
| 5 | PI raised US$600 million at about US$5.6 billion in 2025 | verified | [PI, Wikipedia](https://en.wikipedia.org/wiki/Physical_Intelligence_Inc.) (secondary); [The Robot Report, Nov 25 2025](https://www.therobotreport.com/physical-intelligence-raises-600m-advance-robot-foundation-models/) (secondary) | none (PI's own site blocks bots) |
| 6 | Wikipedia describes PI's technology as not yet commercially sold | verified | [PI, Wikipedia](https://en.wikipedia.org/wiki/Physical_Intelligence_Inc.) (secondary) | none; already attributed |
| 7 | Covariant Brain: goods-to-person, kitting, induction, sortation; users Knapp, Radial, Otto Group | verified | [Covariant, Wikipedia](https://en.wikipedia.org/wiki/Covariant_%28company%29) (secondary) | none |
| 8 | Covariant stopped public updates; whistleblower alleged antitrust avoidance | verified | [Covariant, Wikipedia](https://en.wikipedia.org/wiki/Covariant_%28company%29) (secondary) | none (allegation already framed as such) |
| 9 | openpi base checkpoints pretrained on 10,000+ hours | verified | [openpi](https://github.com/Physical-Intelligence/openpi) | none |
| 10 | GR00T 1.7: 3B parameters, humanoids, fine-tuning scripts, Jetson Thor guides | verified | [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) | none |
| 11 | Gemini Robotics 2.5, ER 2, On-Device 2 | verified | [Google DeepMind](https://deepmind.google/models/gemini-robotics/) | none |
| 12 | Skild Brain: one brain for any robot, any task | verified | [Skild AI](https://www.skild.ai/) ("unified, omni-bodied brain to control any robot for any task") | none |
| 13 | Covariant RFM-1 announced March 2024 | verified | [Covariant, Wikipedia](https://en.wikipedia.org/wiki/Covariant_%28company%29) (secondary; March 11, 2024) | none |
| 14 | PI raised US$400 million at about US$2.4 billion (2024) | verified | [PI, Wikipedia](https://en.wikipedia.org/wiki/Physical_Intelligence_Inc.) (secondary); Robot Report confirms the US$400 million, not the valuation | none |
| 15 | Reported US$1 billion round at about US$11 billion (2026, not confirmed) | verified | [PI, Wikipedia](https://en.wikipedia.org/wiki/Physical_Intelligence_Inc.) citing Bloomberg, Mar 27 2026, "in talks" (secondary) | none; already hedged |
| 16 | GR00T 1.7 at 25 Hz on Jetson Thor with NVFP4 | verified | [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) | none |
| 17 | PI founded February 2024 | verified | [PI, Wikipedia](https://en.wikipedia.org/wiki/Physical_Intelligence_Inc.) (secondary) | none |
| 18 | π0.7 introduced April 2026 | verified | [arXiv 2604.15483](https://arxiv.org/abs/2604.15483) (submitted April 16, 2026) | added the arXiv paper as primary source [7] (Wikipedia only cited a blog) |
| 19 | Skild investors include SoftBank, Sequoia, Amazon | verified | [Skild AI](https://www.skild.ai/) | none |

### tooling-companies

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | RoboDK: 1,400+ robots, 80+ makers, native formats (ABB RAPID, FANUC, KUKA) | verified | [RoboDK](https://robodk.com/) | none |
| 2 | Visual Components "does cell and line simulation", owned by KUKA | corrected | [Visual Components About](https://www.visualcomponents.com/company/about-us/) | now "manufacturing simulation and offline programming", KUKA since 2017 (also in Real products); source changed from KUKA Wikipedia |
| 3 | NVIDIA lists Isaac Sim and Isaac Lab; Isaac Lab-Arena evaluates policies | verified | [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) | none |
| 4 | Flowstate: developer environment with perception, motion planning, sensor-based control | verified | [Intrinsic](https://www.intrinsic.ai/) | none |
| 5 | Intrinsic Core is open-source and ROS-compatible | verified | [Intrinsic](https://www.intrinsic.ai/) | none |
| 6 | Foxglove records MCAP, uploads from robots, visualizes, searches, annotates | verified | [Foxglove](https://foxglove.dev/) | none |
| 7 | Intrinsic became part of Google DeepMind Robotics, February 2026 [unverified] | corrected | [Intrinsic, Feb 25 2026](https://www.intrinsic.ai/blog/posts/intrinsic-joins-google-to-accelerate-physical-ai) | Intrinsic joined Google as "a distinct group within Google" that works "closely with Google DeepMind"; it is not inside DeepMind. Flag removed; Wikipedia source replaced |
| 8 | Intrinsic spun out of Alphabet's X in 2021 | verified | [Intrinsic, Feb 2026](https://www.intrinsic.ai/blog/posts/intrinsic-joins-google-to-accelerate-physical-ai) (launched as an Alphabet "Other Bet" in 2021) | reworded to match source |
| 9 | Offline programs get touched up on the real line [unverified] | verified | [RoboDK robot calibration docs](https://robodk.com/doc/en/Robot-Calibration-LaserTracker.html) (arms "highly repeatable but not accurate"; calibration improves offline-programmed accuracy 2-10x) | flag removed; claim reworded (calibrate or touch up); new source [7] |
| 10 | Foxglove customers include Wayve, Shield AI, Dexterity, ANYbotics | verified | [Foxglove](https://foxglove.dev/) | none |
| 11 | KUKA is owned by Midea | verified | [KUKA, Nov 8 2022](https://kuka.com/en-ch/company/press/news/2022/11/squeeze-out-completed) | new source [8] |
| 12 | Cheese station 10 wedges a minute | verified | arithmetic | none |

### end-users

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | US 2025: automotive 13,500 of about 38,000 | verified | [IFR, Jun 18 2026](https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth) (preliminary) | added note: preliminary; IFR's September final total was almost 38,500 [2] |
| 2 | Food, metal and machinery, electrical/electronics about 3,000 each | verified | [IFR, Jun 2026](https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth) | none |
| 3 | US food installations up 30% | verified | [IFR, Jun 2026](https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth) | none |
| 4 | China 59% of 2025 installations | verified | [IFR, Sep 2026](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) | none |
| 5 | Hyundai Motor Group controls Boston Dynamics | verified | [Boston Dynamics release, Jun 2021](https://bostondynamics.com/news/hyundai-motor-group-completes-acquisition-of-boston-dynamics-from-softbank/) | source changed from Wikipedia |
| 6 | Amazon licensed Covariant and hired its founders | verified | [Amazon, Aug 2024](https://www.aboutamazon.com/news/company-news/amazon-covariant-ai-robots) | source changed from Wikipedia |
| 7 | Walmart began adding Symbotic to 25 more RDCs in 2021 | verified | [Symbotic 10-K](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm) | updated: 25 of 42 in 2021, all 42 in 2022 (also in Example companies); source changed from Wikipedia |
| 8 | gategroup: 680M+ passengers, 68+ countries, gategourmet | verified | [gategroup](https://www.gategroup.com/) | none |
| 9 | Chef lists gategroup as a customer | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none |
| 10 | Menu changeover speed matters as much as top speed [unverified] | unverifiable | no gategroup-specific source on retry | flagged (kept) |
| 11 | Automotive is the largest single US robot buyer | verified | [IFR, Jun 2026](https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth) | none |
| 12 | Automotive roughly 35% of US installs | verified | arithmetic (13,500 / 38,000 = 35.5%) | none |
| 13 | gategroup is Swiss; brands include servair | verified | [gategroup](https://www.gategroup.com/) (HQ Glattbrugg, Switzerland) | none |
| 14 | Taylor Farms and Amy's Kitchen are Chef customers | verified | [Chef Robotics](https://www.chefrobotics.ai/) | none |
| 15 | Chef RaaS lets plants "pay per month" | corrected | [Chef Robotics](https://www.chefrobotics.ai/) | Chef does not state a monthly fee. Now "a recurring lease fee instead of a large upfront purchase" |
| 16 | FANUC sells stainless and food-grade arms | verified | [FANUC food and beverage](https://www.fanucamerica.com/industries/food-beverage) | none |

## Area 12, Industry map: analogy and precision review

Scope: all 8 concepts in `knowledge/12-industry-map.md`. `node tools/build-content.mjs --check knowledge/12-industry-map.md` passes with 0 errors and 0 warnings after the edits. The 4 existing [unverified] flags are unchanged.

### Analogies

| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| value-chain | kept | n/a. House building predicts the right flows: product goes down to the buyer and money goes up to the suppliers. "Where the analogy breaks" was fixed: it said direct-sold stations have "no good equivalent" in housing, but prefab homes are one. It now names the real difference, that the seller keeps servicing and updating the station after delivery. "Monthly fee" became "recurring fee". | n/a |
| component-makers | rewritten (one phrase) | "Like the companies that make engines ... for car brands." Car brands mostly build their own engines, so the comparison was wrong to begin with. It also leads a reader to predict that robot makers buy their motors from outside, which is wrong for FANUC and Yaskawa: both sell their own servo systems. | Like the companies that make gearboxes, brakes, and tires for car brands. The gearbox maps onto the precision reducer, which really is the most outsourced joint part. "Where the analogy breaks" now says most car parts come already fitted by the car brand, so it no longer claims that all car parts go to the brand, which aftermarket tires contradict. |
| robot-makers | kept | n/a. An engine sold to boat builders correctly predicts that the arm does nothing until someone integrates it. "Where the analogy breaks" said engine makers sell "only" to boat builders, but outboard engine makers also sell to boat owners, so it now says "mostly through". The lock-in point stays. | n/a |
| integrators | kept | n/a. The general contractor maps well. "Where the analogy breaks" correctly names the two differences that matter: the build is novel and has to be proven first, and the integrator promises a rate. | n/a |
| application-companies | kept | n/a. Dishwasher versus a custom-built station correctly predicts one standard design sold many times. "Where the analogy breaks" now also says the station is tuned on site to each customer's ingredients and trays. Without that, the analogy implies zero setup. | n/a |
| model-companies | kept | n/a. A phone OS correctly predicts a software layer licensed to many hardware makers. "Where the analogy breaks" names the key failure: the model needs data recorded on the target robot and is not yet a proven product. | n/a |
| tooling-companies | kept | n/a. Builders' design software and measuring tools correctly predict a supplier sold to every layer. "Where the analogy breaks" correctly notes that the tools keep running after go-live. | n/a |
| end-users | kept | n/a. A restaurant owner buying equipment correctly predicts who pays and who lives with breakdowns. "Where the analogy breaks" covers custom lines and end users reaching up the chain. | n/a |

### Other fixes

- value-chain: defined "teach pendant", which replaces the undefined "programming pendant", and "acceptance tests". Added the 18 s per-plate pace to the cheese example.
- value-chain: the Connects to line for integrators said "most of the system money lands as engineering". The IFR figure also includes peripherals the integrator buys, so the line now says engineering plus the equipment chosen around the robot.
- component-makers: defined torque, servo motor, backlash, cobot, 6-axis robot, SCARA, and CNC on first use. "The market is concentrated" is now scoped to reducers.
- component-makers: added the missing nuance that some robot makers make their own motors: FANUC sells servo systems [9] and Yaskawa sells servo motors [10]. Without it, Precise implied that every joint part is bought in. Both are new primary sources.
- component-makers: the cheese example said "a gripper suited to" the wedges. It now names the actual choice from 03-end-effectors: an electric gripper with V-notched, food-grade plastic fingers. Also fixed the grammar of "the about four apple slices".
- component-makers: Elsewhere claimed a robot swaps between a spot-welding gun and a gripper "several times per car body", and that a force-torque sensor makes it "press with a steady force". Neither appears on ATI's pages, and the fact check did not cover them. The section now uses only what ATI says: the tool changer swaps grippers and welders and passes air, signals, and water [11]; the force-torque sensors are used for grinding and polishing [12]. Both are new primary sources.
- robot-makers: defined "servo control". The cheese example now shows the 18 s takt arithmetic and says that the CRX-30iA's 30 kg payload is far more than a wedge needs, so hygiene and reach decide the choice. Without that, a reader could take payload to be the deciding spec.
- integrators: defined CAD, and changed the bare "[[acceptance-tests]]" to "(see ...)". In the misconception's Reality, "Most of the value is engineering" was cited to FANUC, which does not say that, and was backed by the IFR two-thirds figure, which includes peripherals. The Reality now says the integrator sells engineering and takes responsibility for the whole system, and that the two thirds is software, peripherals, and systems engineering.
- model-companies: Precise said openpi "releases π0 and π0.5 under the Apache 2.0 license". The repository has an Apache 2.0 license but also ships LICENSE_GEMMA.txt (Google's Gemma Terms of Use, which carry use restrictions). Precise, the cheese example, and the source note now say this. Apache 2.0 and "checkpoint" are now defined, and the cheese example tells the application company to check which terms cover the checkpoint.
- model-companies: "GR00T 1.7 ... for humanoids" now matches NVIDIA's page, which describes a family aimed at humanoids that 1.7 "applies across a wide range of robots". This matters because the cheese example uses it on a single arm. Also defined 25 Hz and NVFP4 quantization in ordinary words.
- tooling-companies: defined learned policy, ROS, observability, and MCAP on first use. The cheese example now explains the difference between repeatable and accurate: an arm returns closely to a point taught by hand but misses a point calculated from a drawing by more. That is the reason offline programs need touch-up. Added the takt arithmetic, and changed the bare "[[policy-evaluation]]" to "(see ...)".
- end-users: gave capex, opex, and OEE short in-place definitions, since this concept may be read on its own. Elsewhere was one thin line, so it now has IFR numbers (US automotive about 13,500 versus food about 3,000) and says who does what at the automaker.

### Spot-checks of the fact check

| Claim | Source opened | Result |
|---|---|---|
| More than 600,000 robots installed in 2025; operational stock about 5 million | [IFR, Sep 24 2026](https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally) | pass ("more than 600,000"; "a record 5 million units") |
| China installed 354,000 robots in 2025, 59% of the world total; Chinese makers held 55% of their home market | same IFR release | pass |
| Final US 2025 total: almost 38,500 | same IFR release | pass ("almost 38,500 units") |
| US 2025 preliminary figures: 38,000 total, automotive 13,500, food / metal / electronics about 3,000 each, food up 30% | [IFR, Jun 18 2026](https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth) | pass |
| 2018 robot sales US$16.5 billion; about US$50 billion with software, peripherals, and systems engineering | [IFR, Sep 2019](https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd) | pass (exact wording "approximately 50 billion USD") |
| ABB: China's foreign-investment security review prohibited the acquisition of ABB Robotics in China; the two companies are still working on the deal | [Robotics 24/7, Nov 5 2026](https://www.robotics247.com/article/softbanks-proposed-5.4b-acquisition-of-abb-robotics-blocked-by-china) (secondary) | pass (ABB statement quoted; NDRC attributed to the FT only) |
| ABB Robotics: enterprise value US$5.375 billion, about 7,000 staff, US$2.3 billion revenue in 2024 | [Robotics 24/7, Oct 8 2025](https://www.robotics247.com/article/abb_divests_robotics_division_to_softbank_group_for_5.375b/abb_group) (secondary) | pass |
| Rohit Prasad named Boston Dynamics CEO in October 2026, a former Amazon AI executive | [The Robot Report, Oct 6 2026](https://www.therobotreport.com/boston-dynamics-appoints-former-amazon-executive-rohit-prasad-new-ceo/) (secondary) | pass (effective Oct 7; previously SVP leading Alexa and AGI science) |
| Chef Robotics: more than a dozen facilities in the US, Canada, and Europe; nearly 100 million servings | [Chef Robotics](https://www.chefrobotics.ai/) | pass (counter at 98,578,982) |
| Chef: giveaway down 4% and 67%; airline catering listed; gategroup a named customer; contents of the RaaS lease | [Chef Robotics](https://www.chefrobotics.ai/) | pass (Amy's Kitchen 4%, Cafe Spice 67%) |
| gategroup: more than 680 million passengers, more than 68 countries, servair brand, Swiss headquarters | [gategroup](https://www.gategroup.com/) | pass (Glattbrugg) |
| Symbotic fiscal 2025 revenue US$2,247 million, year ending Sep 27 2025 | [Symbotic 8-K exhibit](https://www.sec.gov/Archives/edgar/data/1837240/000183724025000277/q4258-k_ex991.htm) | pass |
| GR00T 1.7: 3 billion parameters, open with a commercial license, 25 Hz on Jetson Thor with NVFP4 | [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) | pass. The page says 1.7 applies "across a wide range of robots", so "for humanoids" was narrowed |
| openpi releases π0, π0-FAST, and π0.5 under Apache 2.0 | [openpi on GitHub](https://github.com/Physical-Intelligence/openpi), plus its LICENSE_GEMMA.txt read via the gh API | partial fail: the repository license is Apache 2.0, but it also ships Google's Gemma Terms of Use, and the README states no license for the checkpoints. Fixed in Precise, the cheese example, and the source note |
| openpi base checkpoints pretrained on 10,000+ hours of robot data | [openpi README](https://github.com/Physical-Intelligence/openpi) | pass ("10k+ hours of robot data") |
| FANUC DR-3iB/6 STAINLESS is its first stainless food-grade delta; CRX-30iA Food Grade has a 30 kg payload | [FANUC food and beverage](https://www.fanucamerica.com/industries/food-beverage) | pass |
| FANUC: more than 1 million robots installed | [FANUC America](https://www.fanucamerica.com/) | pass ("1M+") |
| RoboDK: 1,400+ robots, 80+ makers, separate post processors for ABB RAPID, FANUC, KUKA KRC, Motoman Inform, and UR | [RoboDK](https://robodk.com/) | pass |
| Arms are "highly repeatable but not accurate"; calibration improves accuracy 2-10 times | [RoboDK calibration docs](https://robodk.com/doc/en/Robot-Calibration-LaserTracker.html) | pass |
| Intrinsic joined Google on Feb 25 2026 as a distinct group working closely with Google DeepMind; Alphabet launched it in 2021 as an Other Bet | [Intrinsic blog](https://www.intrinsic.ai/blog/posts/intrinsic-joins-google-to-accelerate-physical-ai) | pass |
| Foxglove: Wayve, Shield AI, Dexterity, and ANYbotics named; records, uploads, visualizes, searches, and annotates MCAP | [Foxglove](https://foxglove.dev/) | pass (ANYbotics appears only in the "Trusted by" logos, not in a customer story; acceptable for "lists among its customers") |

# Cross-file consistency review

Scope: all 12 area files in `/knowledge` (registry, FORMAT, dependency graph, and glossary not edited).
Final check: `node tools/build-content.mjs --check` -> 12 areas, 105 concepts, 810 sources, 31 unverified flags, 235 glossary terms | 0 warnings, 0 errors.

## Conflicts found and resolved

| Topic | Files | Conflict | Resolution | Source |
|---|---|---|---|---|
| ROS 2 Kilted Kaiju end of life | 07 (ros2) | Said November 2026 (from REP 2000). The current ROS 2 docs distribution table has said December 2026 since Kilted's release on 23 May 2025. | Text now gives December 2026 per the docs table and says the older REP 2000 plan said November 2026. Key numbers changed to May 2025 to December 2026. New source [13]. Humble May 2027, Jazzy May 2029, and Lyrical May 2031 confirmed unchanged. | [ROS 2 Releases.rst](https://raw.githubusercontent.com/ros2/ros2_documentation/rolling/source/Releases.rst) (primary; git history shows "December 2026" since commit "Release Kilted Kaiju", 2025-05-23); [REP 2000](https://reps.openrobotics.org/rep-2000/) (primary) |
| NVIDIA GR00T model name | 08 (vla-models, on-robot-inference), 12 (model-companies) | 08 said "GR00T N1.7" and 12 said "GR00T 1.7" for the same model. | Both files now use GR00T N1.7, the name in the GitHub README and in the model ID GR00T-N1.7-3B. Each notes that NVIDIA's product page shortens it to "GR00T 1.7". | [NVIDIA/Isaac-GR00T](https://github.com/NVIDIA/Isaac-GR00T) (primary); [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) (primary) |
| GR00T N1.7 speed on Jetson Thor | 08, 12 | 08 said about 28 Hz (GitHub, TensorRT, MAXN, batch-1 LIBERO). 12 said 25 Hz (product page, TensorRT NVFP4). | Both figures are real but come from different test setups. Both files now give both numbers with their setups. Added source 08 [10] and 12 [9]. | Same two NVIDIA pages (primary) |
| GR00T license | 08, 12 | 08 said "NVIDIA Open Model License"; 12 said "commercial license". | 12 now says the weights are under the NVIDIA Open Model License, which NVIDIA's product page describes as a commercial license. | Same two NVIDIA pages (primary) |
| Physical Intelligence commercial status | 08 (learned-policy, vla-models), 12 (model-companies) | 08 said a waitlisted API beta for hosted fine-tuning and inference opened in October 2026. 12 said only "not yet commercially sold" (Wikipedia). | 12 now adds the application-only API beta from October 2026, in the Precise section and the misconception. It keeps the Wikipedia wording. Added source [10]. | [Humanoids Daily, 14 Oct 2026](https://www.humanoidsdaily.com/news/physical-intelligence-api-beta-robot-training-inference) (secondary; pi.website/blog/api-beta returned HTTP 429); [Wikipedia](https://en.wikipedia.org/wiki/Physical_Intelligence_Inc.) (secondary) |
| openpi license | 08, 12 | 08 said the open weights were "under Apache-2.0". 12 said the repository is Apache 2.0 but also ships Google's Gemma Terms of Use. | 08 now matches 12. Checked against the repo: the GitHub license is Apache-2.0, and LICENSE_GEMMA.txt sits in the repo root. | [Physical-Intelligence/openpi](https://github.com/Physical-Intelligence/openpi) (primary, via gh API) |
| ABB IRB 1200 in a 2-4 C room | 01 (six-axis), 07 (control-loops) | 01 proposed a hygienic IRB 1200 for the grape station. 07 says the IRB 1200 is rated only from +5 C, so it is not rated for the 2-4 C room. | 01 now carries the temperature caveat and says the grape station needs a cold-rated arm. New source 01 six-axis [7]. | [IRB 1200 product specification p.20](https://www.manualslib.com/manual/2144839/Abb-Irb-1200.html?page=20) (ABB document via ManualsLib; +5 to +45 C, +5 to +35 C with food-grade lubrication) |
| ISO/TS 15066 status | 06 (safety-standards), 01 (cobot), glossary | All files say the TS content was folded into ISO 10218:2025. 06 backed "still valid" only with a national catalogue. | 06 table now gives ISO's own status: still published (confirmed 2022), stage 90.92 (to be revised), and to be replaced by ISO/AWI 15066-1, which is under development. Source [12] is now the ISO page, replacing the national catalogue. 01 and the glossary already agree. | [ISO/TS 15066:2016](https://committee.iso.org/standard/62996.html) (primary) |
| Time per pick, cheese plate line | 01, 02, 06, 07, 11 | 02 and 11 said 4.5 s per apple slice (18 s / 4). 01 and 07 said about 4 s, because they subtract the 1-2 s tray-belt step. 06 listed 4.5 s, and its cracker figure was 9-18 s where 01 said 8-17 s. | The arithmetic was right in every file; the assumptions differed. 06 cycle-time now states that its per-pick times are upper bounds, and that after the belt step they become about 4 s per apple slice, 5-6 s per cheese wedge, and 8-17 s per cracker pack. 02 and 11 now say the same. I rechecked the rest: takt 18 s; 3.3/13.3/3.3-6.7/10 picks/min; 9-10 picks per plate; 30-33 picks/min; line-balance sketch 14.3 s, 43%, 202, 165, and 267 plates/h; OEE 76.0%; payback 3.7, 9.6, and 2.3 years. | Arithmetic on the running example (FORMAT.md); 06 [[conveyor]] index time 1-2 s (illustrative) |
| Robot type per station | 01 (six-axis, scara, delta), 02 (intro, joint-stack, servo-motor, brake), 07 (inverse-kinematics) | 01 suggests (judgment): six-axis arm for grapes, SCARA for crackers, deltas for apples and cheese. 02 pictured a six-axis arm at the cheese station (joint 6, shoulder and elbow) and an arm at the apple station, unlabeled. 07 said "this station uses a 6-axis arm" as fact. | Choices left as they are, since the files need not agree. Each is now labeled a judgment call and points to [[delta]] or [[six-axis]]. The 02 intro states the per-station suggestions and that area 2 pictures six-axis arms only for its joint examples. | Labeling fix (no external fact) |
| Cheese gripper | 03 (rigid-gripper), 12 (component-makers) vs 01, 04, 06, 07 (grasp-planning), 11 | 03 and 12 used an electric V-notch parallel gripper. 01, 04, 06, 07, and 11 used a suction cup on the wedge's flat top. | Both kept as design options. 03, 07, and 12 now label their choice a judgment call and link the alternative. The 01, 04, 06, and 11 mentions were already labeled illustrative. | Labeling fix |
| Grape grasp strategy | 03 (soft-gripper) vs 04, 05, 07 (grasp-planning) | 03 had soft fingers close around the whole bunch, with only a rough center point needed. 07 had fingers grasp across the stem, and 04 and 05 find the stem. | 03 now says its approach is one judgment call and points to [[grasp-planning]] for the stem grasp. | Labeling fix |
| Gripper at apple station | 02 (pneumatic-actuation) vs 03, 07, 08, 12 | 02 said "the apple pick's soft fingers may be inflated with air". Every other file puts a suction cup at the apple station and soft fingers at the grape station. | 02 now says the grape pick's soft fingers, and notes that the apple station uses a suction cup. | Consistency fix |
| Cracker pack mass | 03 (vacuum-gripper vs ft-sensor) | vacuum-gripper said a pack "weighs far less than 1 N (about 100 g)", which reads as a 100 g pack. ft-sensor said 10-30 g. | vacuum-gripper now says a pack of perhaps 10-30 g weighs far less than 1 N, which is the weight of about 100 g. It is flagged [unverified], as in ft-sensor. | Arithmetic; same unverified basis as ft-sensor |
| ABB Robotics sale to SoftBank, sources | 01, 05, 07, 12 | All four agree: agreement in October 2025, not closed as of November 2026, China prohibited the China part. 05, 07, and 12 cited trade press for the November 2026 status. | Replaced the trade-press citations in 05 [7], 07 [13], and 12 [15] with ABB's own 5 November 2026 statement, which 01 already cited. 05 now says "statement" instead of "report". | [ABB, Update on divestment of ABB Robotics, 5 Nov 2026](https://resources.news.e.abb.com/attachments/published/140154/en-US/0A15DBC92198/20261105_Update_on_divestment_of_ABB_Robotics_EN.pdf) (primary; PDF text read) |

## Checked and already consistent (no edit)

| Topic | Files | Conflict | Resolution | Source |
|---|---|---|---|---|
| EU Machinery Regulation (EU) 2023/1230 application date | 05, 06 | Known issue (14 vs 20 January 2027) was already fixed before this pass: both say 20 January 2027, and 05 explains the corrigendum. No 14 January left in any file, glossary included. | None needed | [EUR-Lex corrigendum, OJ L 169, 4 July 2023](https://eur-lex.europa.eu/eli/reg/2023/1230/corrigendum/2023-07-04/oj/eng) (primary: "for: '14 January 2027', read: '20 January 2027'") |
| Safety standard editions | 01, 04, 05, 06, 11 | ISO 10218-1/-2:2025, ISO 13849-1:2023, IEC 62061:2021+A1:2024, IEC 60204-1 stop categories, ISO 13855 approach speed 1.6 m/s: no disagreements. | None needed | 06 sources [1]-[11] (ISO and IEC pages, primary) |
| Gemini Robotics models and access | 08, 12 | Both list Gemini Robotics 2.5 (waitlist), ER 2, On-Device 2 (trusted testers), and 100+ testers. | None needed | [Gemini Robotics](https://deepmind.google/models/gemini-robotics/) (primary) |
| GR00T 2 | 08 | Announced November 2026, code listed for December. | None needed | [GR00T 2](https://research.nvidia.com/labs/gear/gr00t-2/) (primary) |
| Gazebo Jetty support window | 08 | September 2025 to May 2031 | None needed | [Gazebo releases](https://gazebosim.org/docs/latest/releases/) (primary) |
| Company ownership | 01, 03, 11, 12 | Teradyne owns UR and MiR; Midea owns KUKA; KUKA owns Visual Components; Hyundai 80% and SoftBank affiliate 20% of Boston Dynamics; Intrinsic part of Google since February 2026; Schmalz bought mGrip in August 2024; Phantom Auto shut down March 2024; Rapid Robotics wound down 2025. Each fact appears in one file or agrees across files. | None needed | Per-file sources (12 [4] Wikipedia on UR is secondary; the others are company pages) |
| Robot specs repeated across areas | 01, 06, 12 | IRB 360 cycle 0.30-0.60 s (25/305/25), tracking 1.0 mm at 200 mm/s, stainless IP69K variant, 0-45 C rating; FANUC DR-3iB stainless; UR g-Series IP65. These agree. | None needed | ABB IRB 360 datasheets 2017 and 2022 (primary) |
| Latency and network numbers | 04, 05, 08, 09, 10 | No overlapping figures disagree. UR RTDE 500 Hz in 05, 07, and 09; Jetson Thor 2070 FP4 TFLOPS at 40-130 W in 05 and 08; PROFINET and EtherCAT figures only in 05; teleop budgets only in 09. | None needed | Per-file primary sources |
| ALOHA, DROID, Open X-Embodiment figures | 08, 09, 10 | About $20k and 50 Hz for ALOHA; DROID 76k trajectories, 350 h, 564 scenes, 12 months. These agree. | None needed | Project pages and arXiv (primary) |

## Not edited (outside scope this pass)

- glossary.md: no entries contradict the changes above. The ISO/TS 15066 entry ("folded into ISO 10218:2025") is still accurate. It could add "not withdrawn; successor ISO 15066-1 in development".
