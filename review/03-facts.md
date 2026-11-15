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
