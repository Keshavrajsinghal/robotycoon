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
