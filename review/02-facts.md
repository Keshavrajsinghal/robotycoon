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
