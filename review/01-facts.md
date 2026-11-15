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
