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
