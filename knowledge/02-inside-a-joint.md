---
area: 2
slug: inside-a-joint
title: Inside a joint
---

# Inside a joint

Every rotating joint of an electric robot arm is a small machine of its own: a motor that makes
torque, a gearbox that trades the motor's speed for force, an encoder that measures the angle, a
brake that holds the arm when power is off, and an electronic drive that meters current into the
motor many thousands of times a second. Some robots, mostly collaborative ones, add a torque
sensor that lets the joint feel pushes from outside. This area opens one joint and names each
part, where it sits, and the spec words people use when they buy or compare them. It ends with
the two non-electric ways to move things, compressed air and pressurized oil.

On the cheese plate line, every pick station arm (grape, apple, cracker, cheese) carries one of
these joint stacks per axis, so a six-axis arm has six motors, six gearboxes, six brakes, and at
least six encoders. The simpler motions, such as separating trays at the denester or working the
grippers that hold each ingredient, are mostly done with compressed air instead.

## The joint as a stack of parts
id: joint-stack
requires: dof
aka: joint module, rotary actuator, integrated joint, actuator

### Plain
A robot joint is like a bicycle's drivetrain packed into a short tube: a fast, light motor plays the part of your legs, a gear set trades that speed for force, and the slow, strong output turns the next arm segment. Around that core sit a sensor that counts exactly how far the shaft has turned, a parking brake that clamps when the power goes off, and in some robots a sensor that feels how hard the joint is being twisted. An arm has one of these stacks for each joint, so a six-axis arm carries six.

### Where the analogy breaks
A bicycle has gears you shift and slack you can feel in the pedals, while a robot joint has one fixed ratio and is built with almost no slack, because a fraction of a degree at the joint becomes millimeters at the gripper. And no rider adjusts their push thousands of times a second; an electronic drive does exactly that to the motor.

### Precise
An electric robot joint is a set of parts stacked on one rotation axis. A common physical order, from the motor end to the joint output, is:

1. **Holding brake** — clamps the motor shaft when unpowered; usually at the motor's rear end. Present on nearly every gravity-loaded axis.
2. **Motor-side encoder** — measures the motor shaft angle; also at the rear of the motor shaft. Always present.
3. **Servo motor** — copper coils (stator) fixed in the housing, magnets (rotor) on the shaft. Always present.
4. **Gearbox (reducer) input** — the part the motor shaft drives directly (the elliptical wave generator of a strain wave gear, a sun gear, or a crank). Present in almost all arm joints.
5. **Gearbox output and main output bearing** — the slow, strong output and the large bearing that carries the arm's weight and bending loads.
6. **Joint torque sensor** — a stiff, slightly springy ring between the gearbox output and the next link. Only in some robots, mostly cobots: Franka Research 3 has a link-side (after the gearbox) torque sensor in all 7 axes [2].
7. **Output-side encoder** — reads the joint angle directly, past the gearbox's slack and twist. Only in some robots [unverified: no datasheet I opened confirms a specific model].
8. **Output flange** — bolts to the next link.

The **servo drive** (the power electronics that feed the motor) is not on the axis: in traditional industrial arms it sits in the controller cabinet, while some cobot designs put it inside the joint housing [unverified]. Cables for joints further out often pass through a hollow center bore in the motor and gearbox [3]. The order is not fixed: mayr's cobot brake, for example, can mount on a hollow shaft, on the free shaft end, or inside a hollow-shaft motor [4]. Robots without a joint torque sensor estimate joint torque from motor current instead [5], and some with one skip the output encoder: KUKA's LBR iiwa senses motor position and joint torque, and derives joint position from both [1].

Remove any layer and the joint fails in a specific way. Without the gearbox, a motor small enough to fit cannot lift the arm. Without the encoder, the controller does not know where the joint is. Without the brake, the arm sags or drops when power is cut.

### On the cheese plate line
At the cheese pick station, picture the wrist roll joint (joint 6) of the arm that turns each wedge to match its spot on the tray. From back to front it is brake, motor encoder, a small servo motor, a strain wave gear, and the output flange the gripper bolts onto. With three wedges per plate at 200 plates an hour, that joint makes about 600 placement rotations an hour. If the plant chose a cobot for this station, the same joint would also carry a torque sensor between gear and flange, so the arm can feel an operator's hand.

### Elsewhere
In a KUKA LBR iiwa, a seven-joint industrial arm built to work beside people, each joint drives its link through a motor, a harmonic (strain wave) gear reducer, and a deliberately springy element whose twist is measured as joint torque [1]. Researchers studying it found a repeatable wobble between motor angle and joint angle caused by the gearing, which is exactly the kind of error a motor-side encoder alone cannot see [1].

### Why it exists
Electric motors deliver the most power for their size when they spin fast at low torque, but arm joints need to be slow and strong, so a gearbox sits between them. Everything else in the stack exists to make that pairing controllable and safe: the encoder to measure it, the brake to hold it unpowered, and, in robots that work near people, a torque sensor to feel contact.

### Connects to
- [[servo-motor]] — the part at the back of the stack that makes torque
- [[gearbox]] — the part in the middle that multiplies torque and sets most of the joint's stiffness and play
- [[torque-sensing]] — the optional layer that distinguishes many cobots
- [[dof]] — each joint stack provides one degree of freedom
- [[repeatability]] — how well the whole stack returns to the same angle sets the arm's repeatability

### Real products and tools
- **Harmonic Drive CSG and CSF gear units** — strain wave reducers sold as the gearbox layer of many joints.
- **Kollmorgen TBM2G** — frameless motors designed for cobot joints, with a large center bore for cables [3].
- **mayr ROBA-servostop Cobot** — hollow-shaft spring-applied brake made for lightweight robot joints [4].
- **RLS AksIM-2** — off-axis magnetic absolute encoder that reads a thin ring around the shaft, leaving the center free.
- **Franka Research 3** — a research cobot (Franka Robotics, formerly Franka Emika) whose joints include link-side torque sensors [2].

### Common misconception
**Misconception:** A robot joint is basically a motor turning the next arm segment.

**Reality:** The motor is one of five to eight stacked parts, and it usually spins dozens to hundreds of times for each turn of the joint. Most of what a joint spec sheet describes, such as stiffness, play, holding torque, and position resolution, comes from the gearbox, encoder, and brake rather than the motor.

### Sources
1. [Toward Torque Control of a KUKA LBR IIWA for Physical Human-Robot Interaction](https://la.disneyresearch.com/wp-content/uploads/Toward-Torque-Control-of-a-KUKA-LBR-IIWA-for-Physical-Human-Robot-Interaction-Paper.pdf) — Chawda and Niemeyer, Disney Research; iiwa joint layout (motor, harmonic gear, series elastic element), sensed quantities, motor-to-joint wobble
2. [Franka Research 3 datasheet v1.1 (August 2022)](https://www.wiredworkers.io/wp-content/uploads/2022/09/Franka-Research-3_Datasheet_v1.1_August2022.pdf) — Franka Emika, reseller copy; "link-side torque sensor in all 7 axes"
3. [New frameless servo motors increase performance and reduce size for robot control](https://usa-automation.net/news/62315-new-frameless-servo-motors-increase-performance-and-reduce-size-for-robot-control) — trade press on Kollmorgen TBM2G; cobot joint use, center bore, fit with harmonic gearing
4. [ROBA-servostop Cobot](https://www.mayr.com/en/products/safety-brakes/industrial-brakes/roba-servostop-cobot~40645) — mayr; brake mounting options inside robot joints
5. [Improving safety performance in cobots with torque sensors](https://www.te.com/usa-en/whitepapers/sensors/improving-safety-performance-in-cobots-with-torque-sensors.html) — TE Connectivity whitepaper; joint unit contents, torque sensors versus motor-current calculations

## Electric servo motor
id: servo-motor
requires: joint-stack
aka: servomotor, PMSM, brushless motor, frameless motor, BLDC

### Plain
A servo motor is like a ceiling fan motor that takes precise orders: instead of spinning at one fixed speed, it can be told to push with an exact amount of twist, hold still against a load, or reverse in an instant. Magnets on the spinning part are pulled around by coils of wire that an electronic drive switches on and off in sequence. The more current the drive sends through the coils, the harder the motor twists.

### Where the analogy breaks
A ceiling fan has no idea where its blades are pointing; a servo motor always works with a sensor and a drive that measure its angle and correct it thousands of times a second. It can also deliver several times its all-day force for a moment, as long as it gets time to cool afterward, which a fan never needs to do.

### Precise
Electric robot joints typically use a permanent-magnet synchronous motor (PMSM, also sold as brushless AC or brushless DC: magnets on the spinning rotor, copper windings in the stationary outer part called the stator, so nothing rubs to carry current). The drive must steer current through the three windings in step with the rotor's angle, which is why the motor needs an encoder or an estimate of the rotor angle [4]. Torque is proportional to current. The torque constant Kt (newton-meters of torque per amp) is that ratio, and the same number, in different units, sets the back-EMF (the voltage the spinning motor generates against its own supply) [3]. So a winding with high Kt gets more torque per amp but runs out of supply voltage at a lower speed; a motor wound for a 48 V cobot needs more current for the same torque than one wound for 400 V.

Datasheets give several torque figures. Standstill (continuous stall) torque is what the motor can produce indefinitely near zero speed without overheating, and rated torque is what it produces at rated current and rated speed; both are heat limits [1][2]. Peak torque is the short burst allowed during acceleration, typically 3.8-4.9 times standstill torque on the two industrial motors checked here [1][2]. Running above the continuous rating for too long overheats the winding insulation, so motors are sized so that average heating over a repeating motion stays within the continuous rating while each burst stays under peak.

Robot makers often buy frameless motors (only the rotor and stator, with no housing, shaft, or bearings of their own, so they can be built directly into the joint) [unverified: definition from general knowledge; the article I opened does not define the term]. Kollmorgen's TBM2G line, for example, targets cobot joints for 3-15 kg payloads, runs at 48 VDC or below, and is sized to match off-the-shelf strain wave gears [5].

### On the cheese plate line
At the apple pick station, a slice weighs only tens of grams, so the arm's wrist motors are small, on the order of the smaller cobot frameless motors (0.27 Nm continuous at 8,000 rpm for the smallest TBM2G) [5]. The hard part is acceleration, not weight: about four slices per plate at 200 plates an hour is 800 picks an hour, one every 4.5 seconds. Each move spends a fraction of a second near peak torque and then coasts, so sizing checks the average heating over that 4.5-second cycle against the continuous rating (illustrative reasoning, not a sizing for a specific robot).

### Elsewhere
On a car factory body line, large six-axis arms need motors of a different class. A 400 V industrial servo such as Beckhoff's AM8063 makes 29 Nm at standstill and 111 Nm peak, at a rated 1,500 rpm and 3.33 Nm/A [1]. I could not find published motor specs for a specific large robot, so treat this as the right order of magnitude rather than what any particular arm uses. Behind a 100:1 gearbox, 29 Nm becomes roughly 2,900 Nm at the joint before losses.

### Why it exists
Robot joints need precise, fast-changing torque in both directions, including holding still under load. A permanent-magnet servo motor gives torque in direct proportion to current, so a drive can control force exactly, and it packs a lot of torque into a small volume compared with other electric motor types.

### Connects to
- [[gearbox]] — multiplies the motor's small, fast torque into the joint's large, slow torque
- [[servo-drive]] — supplies and controls the current that becomes torque
- [[encoder]] — tells the drive where the rotor is, which it needs to switch the windings
- [[brake]] — usually mounted on the same shaft, at the back of the motor
- [[payload]] — motor torque and gear ratio together set how much the arm can carry

### Real products and tools
- **Beckhoff AM8000 series** — 400 V class servomotors with optional permanent-magnet holding brake and single-cable encoder feedback [1][2].
- **Kollmorgen TBM2G** — frameless 48 V class motors made for cobot joints [5].
- **Yaskawa Sigma-7 rotary servomotors** — an industrial servomotor family; product pages still listed on Yaskawa Europe's site in 2026 (I could not read their spec tables).
- **maxon EC motors** — small brushless motors; maxon's motor-data document explains the torque constant and back-EMF relationship used here [3].

### Common misconception
**Misconception:** A motor's peak torque is what it can deliver whenever it is needed.

**Reality:** Peak torque is a short burst limited by heat; the motor can only sustain its standstill or rated torque, which on the industrial motors above is roughly a fifth to a quarter of peak [1][2]. A robot that asks for near-peak torque on every move, without enough coasting time, will overheat and fault even though no single move exceeded the peak.

### Key numbers
- Peak torque versus standstill torque: about 3.8-4.9 times on two 400 V industrial servomotors, depending on frame size [1][2]
- Rated speed: 1,500-3,000 rpm for 400 V industrial servomotors [1][2]; up to 8,000 rpm for small cobot frameless motors [5]
- Torque constant: 1.40-3.33 Nm/A on 400 V motors, depending on size and winding [1][2]
- Continuous torque of cobot-joint frameless motors: 0.27-6.03 Nm across frame sizes [5]

### Sources
1. [AM8063-wKyz servomotor](https://www.beckhoff.com/en-en/products/motion/rotary-servomotors/am8000-servomotors/am8063-wkyz.html) — Beckhoff; standstill, rated, and peak torque, rated speed, torque constant, brake and encoder options
2. [AM8032-wDyz servomotor](https://www.beckhoff.com/da-dk/products/motion/rotary-servomotors/am8000-servomotors/am8032-wdyz.html) — Beckhoff; a smaller motor's torque, speed, and torque constant
3. [Motor data and simulation (knowledge document)](https://support.maxongroup.com/hc/de/article_attachments/4413473498130) — maxon; torque constant definition, back-EMF constant identical to torque constant in SI units
4. [Field oriented control (FOC) of permanent magnet synchronous machine](https://imperix.com/doc/TN111) — imperix; rotor angle needed to control PMSM current
5. [New frameless servo motors increase performance and reduce size for robot control](https://usa-automation.net/news/62315-new-frameless-servo-motors-increase-performance-and-reduce-size-for-robot-control) — trade press on Kollmorgen TBM2G; 48 VDC, payload class, torque and speed range

## Gearbox (reducer) types
id: gearbox
requires: servo-motor
aka: reducer, speed reducer, harmonic drive, strain wave gear, cycloidal gear, RV reducer, planetary gear

### Plain
A robot gearbox is like the lowest gear on a bicycle when climbing a steep hill: your legs spin fast and easily while the wheel turns slowly with great force. A joint's motor spins thousands of times a minute but is far too weak to lift an arm directly, so the gearbox slows it down by dozens to hundreds of times and multiplies its push by about the same amount. Robot gearboxes are special because they are built to have almost no wiggle between the motor side and the arm side.

### Where the analogy breaks
A bicycle shifts between ratios and its chain has visible slack; a robot reducer has one fixed ratio, and its slack is measured in arcminutes (sixtieths of a degree). The most common cobot gearbox also works by flexing a thin steel cup on every turn, which no bicycle gear does.

### Precise
The gear ratio (motor turns per joint turn) multiplies torque and divides speed, minus friction losses. The spec terms are: rated torque (the output torque the gear can carry for its rated life), repeated peak torque (allowed during normal accelerations), and momentary peak torque (allowed only in rare events such as a collision or emergency stop) [1]; backlash (free play: how far the output can turn while the input is held, before teeth touch), lost motion and hysteresis loss (related measures of play under small loads), all in arcminutes [3]; and torsional stiffness (how much torque it takes to twist the output by a given angle, in Nm/rad or Nm/arcmin) [1][2]. Stiffness is not constant: a strain wave gear gets stiffer as load increases, so it is quoted in two or three load regions [1].

Three gear families dominate robot joints:

- **Strain wave (harmonic) gear.** An elliptical cam with a thin bearing (the wave generator, the input) flexes a thin toothed steel cup (the flexspline, usually the output) inside a rigid ring with internal teeth (the circular spline), which has two more teeth. Each input turn walks the flexspline back two teeth, so the ratio is the flexspline's tooth count divided by two; 200 teeth give 100:1 in one compact stage [4]. Harmonic Drive markets it as zero backlash because teeth are always engaged along the ellipse's long axis [4]. It is light and compact, which suits cobots and wrists, but the flexing cup also lets it twist under load more than "zero backlash" suggests (see the misconception below).
- **Cycloidal (RV) gear.** Discs with lobed edges are driven in a small off-center circle and roll around a ring of pins, so each input turn advances the output a little; RV is Nabtesco's name for its version. Nabtesco lists ratios from about 41 to 317 [2], mechanical backlash of 0.1-0.3 arcmin, lost motion of 0.3-0.6 arcmin [3], and markets high rigidity from many teeth sharing the load [3]. It is the usual choice for the heavy base and shoulder axes of large industrial arms [unverified: common industry pattern, not stated in a source I opened].
- **Planetary gear.** A central sun gear drives several planet gears inside a ring gear. One stage reaches about 10:1, with more stages for higher ratios [4]. Precision planetary lines have 1-4 arcmin of backlash and economy lines up to 8-12 arcmin [5], so they appear where cost matters more than the last arcminute.

Play and springiness at the joint are multiplied by the arm's length at the tool: 1 arcmin is 0.29 mm of tool movement at 1 m of reach.

### On the cheese plate line
At the grape pick station, suppose the gripper sits about 300 mm from the wrist joint that lowers each bunch into its corner of the tray (illustrative geometry). One arcminute of lost motion moves the gripper about 0.09 mm there; eight arcminutes, typical of an economy planetary gear [5], moves it about 0.7 mm. Either is harmless for placing grapes in a tray, so the plant does not pick the gearbox for precision: the robot maker already chose it, and the plant cares mostly that it is sealed for daily washdown.

### Elsewhere
In a car factory, a heavy six-axis arm must hold a welding gun steady at the end of a long reach. Cycloidal gears for this kind of duty come in sizes from 245 Nm to 28,000 Nm rated torque, with torsional stiffness from 61 to 15,600 Nm per arcminute, and Nabtesco names six-axis, SCARA, and delta robots among their applications [2]. Big, stiff gears keep the gun from sagging or vibrating as the arm stops at each weld spot.

### Why it exists
An electric motor of a given size and weight delivers the most power when it spins fast at low torque, while arm joints need high torque at low speed. A reducer converts one into the other, so the motor, the brake, and the motor-side encoder can all be small, light, and placed on the fast side.

### Connects to
- [[servo-motor]] — the fast, low-torque input the gearbox multiplies
- [[repeatability]] — gearbox play and wind-up are a large part of how far the tool strays
- [[torque-sensing]] — gearbox friction hides small external forces, which is why some cobots measure torque after the gear
- [[encoder]] — a motor-side encoder sees the motor through the gearbox, not the joint itself
- [[cobot]] — compact strain wave gears are the common choice in cobot joints

### Real products and tools
- **Harmonic Drive CSG and CSF** — strain wave gear units; for example the CSG-20-50 at 50:1 [1].
- **Nabtesco RV-N series** — cycloidal reducers for robot axes [2].
- **WITTENSTEIN alpha (SP+, TP+, NP)** — precision and economy planetary gearboxes [5].

### Common misconception
**Misconception:** A zero-backlash gear means the joint does not move at all when the motor holds still.

**Reality:** Zero backlash removes free play, but the gear still twists like a stiff spring. A CSG-20 strain wave gear at 50:1 has a low-load stiffness of 1.3 × 10^4 Nm/rad, so 7 Nm of load winds it up by about 0.54 milliradians, close to 2 arcminutes [1]. That wind-up is why some robots measure the joint angle after the gearbox.

### Key numbers
- Strain wave torsional stiffness: 1.3-2.3 × 10^4 Nm/rad for a CSG-20 at 50:1, rising with load [1]
- Strain wave torque ratings (same unit): 33 Nm rated, 73 Nm repeated peak, 127 Nm momentary peak [1]
- Cycloidal RV-N: ratios about 41-317, rated torque 245-28,000 Nm, stiffness 61-15,600 Nm/arcmin, all depending on size [2]
- Cycloidal play: backlash 0.1-0.3, lost motion 0.3-0.6, hysteresis loss 0.2-1 arcmin, varying gear to gear [3]
- Planetary backlash: up to 1-4 arcmin on precision lines, up to 5-12 arcmin on economy lines [5]

### Sources
1. [CSG-20-50-GH gear unit](https://www.harmonicdrive.net/products/servo-mount-gearheads/harmonic-drive/csg-gh/20/csg-20-50-gh) — Harmonic Drive LLC; ratio, rated and peak torques, accuracy, torsional stiffness by load region
2. [RV-N series](https://www.nabtesco.de/en/products/series/rv-n) — Nabtesco; ratio range, rated torque, hysteresis loss, torsional stiffness, robot applications
3. [Backlash FAQ](https://www.nabtesco.de/en/faq/backlash) — Nabtesco; definitions and typical values of backlash, lost motion, hysteresis loss for cycloidal gears
4. [Harmonic Drive technology](https://www.harmonicdrive.net/technology/harmonicdrive) — Harmonic Drive LLC; wave generator, flexspline, circular spline, two-tooth difference, planetary single-stage ratio
5. [Servo gearboxes](https://www.wittenstein-group.com/en-uk/products/servo-gearboxes) — WITTENSTEIN; ratio ranges and backlash by product line

## Encoder
id: encoder
requires: joint-stack
aka: rotary encoder, position sensor, feedback device, absolute encoder, incremental encoder

### Plain
An encoder works like the hands of a clock fixed to the motor shaft: one hand says exactly where the shaft points within a single turn, and some encoders add a second hand that counts how many full turns have passed. The robot reads it thousands of times a second to know where every joint is. A good one divides a single turn into about a million readable steps.

### Where the analogy breaks
Clock hands are driven forward by the clock, while an encoder reads the shaft with light or magnets and never pushes on it. A stopped clock is wrong when you restart it, but an absolute encoder reads the true angle at power-up even if the shaft moved while it was off; only its turn counter needs a battery or a self-powered trick to keep counting.

### Precise
An encoder turns a shaft angle into a number. Optical encoders read a patterned disc or ring with light; magnetic ones read a magnetized ring with field sensors. RLS's AksIM-2, for example, is an off-axis magnetic module (it reads a thin ring around the shaft, leaving the center free for cables) [2]. Resolution is given in bits: an n-bit encoder splits one turn into 2^n steps, so 20 bits is 1,048,576 steps of about 1.24 arcseconds each. Beckhoff's servomotors offer 18-, 19-, and 24-bit options [1]; AksIM-2 reaches 20 bits [2]. The angle travels to the drive over a serial link such as BiSS C, SSI, or EnDat [1][2].

Incremental encoders only output pulses as the shaft moves, so after power-up the robot must move to a reference mark (homing) to learn where it is. Absolute encoders output a unique code for each angle and report position at start-up without any motion [3]. Single-turn absolute encoders repeat every revolution; multi-turn ones also count revolutions, using a battery-backed counter, a small gear train, or a self-powered Wiegand sensor (a special wire that releases a pulse of energy as a magnet passes, enough to record the turn) [4][5][7]. A battery-backed counter cannot count turns made while it is unpowered, so it relies on the brake keeping the shaft still [5].

Where it sits matters. A motor-side encoder before a 100:1 gearbox must be multi-turn to know the joint angle, because one joint turn is 100 motor turns, and it sees the joint only through the gearbox's play and twist. Some joints add a second, output-side encoder to measure the joint directly [unverified: no datasheet I opened confirms a specific model].

### On the cheese plate line
After the nightly washdown, the arms on the cheese plate line power up and, because their motor encoders are multi-turn absolute, know every joint angle immediately, with no homing moves that could swing a gripper into a freshly washed conveyor. A 20-bit motor encoder behind a 100:1 gear gives about 105 million counts per joint turn; at 300 mm from the joint that is a step of roughly 18 nanometers, thousands of times finer than the gearbox's play (about 0.09 mm per arcminute at that radius). On this line the encoder is never the precision limit.

### Elsewhere
In a robotics lab, researchers measured the joint-side position step of a KUKA LBR iiwa at about 6 × 10^-8 rad, yet still found a repeatable wobble between motor angle and joint angle, with a period of about 0.02 rad, caused by the gearing [6]. Very fine resolution did not mean the joint angle was known that accurately, because the encoder was on the motor side.

### Why it exists
A servo motor cannot be driven at all without knowing its rotor angle, and the robot controller cannot place the tool without knowing every joint angle. Absolute multi-turn encoders also remove the homing step, so a line can restart after a power cut without moving blind.

### Connects to
- [[servo-drive]] — reads the encoder every control cycle to switch the windings and close its loops
- [[forward-kinematics]] — turns the set of joint angles into the tool's position
- [[gearbox]] — sits between a motor-side encoder and the joint, adding play the encoder cannot see
- [[brake]] — keeps the shaft still while a battery-backed turn counter is unpowered
- [[repeatability]] — encoder resolution is rarely the limit; gearbox play and stiffness usually are

### Real products and tools
- **RLS AksIM-2** — off-axis absolute magnetic encoder module, up to 20 bits, BiSS C, SSI, or asynchronous serial [2].
- **Renishaw RESOLUTE** — absolute optical encoder for rotary rings, with serial protocols for several drive makers [3].
- **Beckhoff AM8000 feedback options** — 18-, 19-, or 24-bit single- or multi-turn absolute encoders carried on the motor's power cable [1].
- **POSITAL multi-turn encoders** — count revolutions with Wiegand-effect energy harvesting, with no battery or gears [7].

### Common misconception
**Misconception:** More encoder bits means a more accurate robot.

**Reality:** Bits set resolution, the size of the smallest step the encoder can report, not accuracy, how close that reading is to the true angle. AksIM-2 resolves 20 bits, about 1.24 arcseconds, but its accuracy after self-calibration is about 14-72 arcseconds [2]. And a motor-side encoder's accuracy at the joint is further limited by the gearbox [6].

### Key numbers
- Resolution: 18-24 bits per turn on industrial servomotor encoders, about 1.24 arcseconds per step at 20 bits [1][2]
- Accuracy of an off-axis magnetic module: about 14-72 arcseconds after self-calibration, depending on ring size [2]
- Multi-turn battery life: up to several years, depending on conditions [5]

### Sources
1. [AM8063-wKyz servomotor](https://www.beckhoff.com/en-en/products/motion/rotary-servomotors/am8000-servomotors/am8063-wkyz.html) — Beckhoff; feedback options with bit counts and single-turn or multi-turn versions
2. [AksIM-2](https://www.rls.si/eng/aksim-2) — RLS; off-axis absolute magnetic encoder, 20-bit resolution, accuracy, interfaces
3. [RESOLUTE rotary absolute encoder options](https://www.renishaw.com/en/resolute-rotary-angle-absolute-encoder-options--10939) — Renishaw; position acquired at start-up without motion, serial interfaces
4. [Singleturn vs. multiturn](https://www.rls.si/eng/encoder-handbook/singleturn-vs-multiturn) — RLS encoder handbook; battery, geared, and Wiegand turn counting
5. [Multiturn encoder](https://novanta.com/robotics-automation/multiturn-encoder/) — Novanta; battery-backed counters, battery life, behavior when moved unpowered
6. [Toward Torque Control of a KUKA LBR IIWA for Physical Human-Robot Interaction](https://la.disneyresearch.com/wp-content/uploads/Toward-Torque-Control-of-a-KUKA-LBR-IIWA-for-Physical-Human-Robot-Interaction-Paper.pdf) — Chawda and Niemeyer, Disney Research; encoder quantization and motor-to-joint deflection
7. [Singleturn and multiturn measurement principles](https://www.posital.com/en/singleturn-and-multiturn-measurement-principles) — POSITAL; Wiegand energy harvesting revolution counter that needs no batteries or gears

## Holding brake
id: brake
requires: servo-motor
aka: holding brake, parking brake, fail-safe brake, spring-applied brake, permanent magnet brake

### Plain
A robot's holding brake works like the magnets that hold fire doors open in a school hallway: electricity holds it open, and when the power goes away it snaps shut by itself. Shut, it clamps the motor shaft so the arm cannot sag or fall. It is a parking brake for when the motors are off, not the way the robot normally slows down.

### Where the analogy breaks
A fire door only has to swing shut, while a brake must hold a heavy arm against gravity and has a torque limit beyond which it slips. And a robot brake clamps the small, fast motor shaft rather than the joint itself, so it only holds as long as the gearbox between them is intact.

### Precise
The holding brake sits on the motor shaft, the fast, low-torque side of the gearbox, usually at the motor's rear; Beckhoff mounts it on the motor's non-output bearing side [1]. Because it is on the fast side, the gear ratio multiplies it: a 2 Nm brake behind a 100:1 gear holds roughly 200 Nm at the joint. It is fail-safe (it engages whenever power is removed, so a power cut, broken cable, or emergency stop all leave it clamped). Two designs are common. In a spring-applied electromagnetic brake, springs press a friction disc and a coil pulls it free; mayr's cobot version is a hollow-shaft brake of 0.23-9 Nm that releases at 24 V and then holds open at 8 V [2]. In a permanent-magnet brake, magnets clamp and a coil cancels their field; Beckhoff's servomotor option releases at 24 VDC and is rated for more than 10 million switching cycles [1].

The key spec is holding torque (the torque it can hold without slipping while stationary). A holding brake is not a service brake: Beckhoff's permanent-magnet brake allows at most 2,000 emergency stops from up to 3,000 rpm with load inertia up to three times the motor's own, and is not approved on its own for protecting people [1]. Mayr rates its cobot brake as suitable for emergency stop braking [2]. Vertical axes need extra measures such as redundant brakes, mechanical supports, or counterweights [1].

Without a brake, gravity turns an unpowered joint backward through its gearbox, and the arm folds down onto whatever is beneath it.

### On the cheese plate line
Suppose the power blips at the cheese pick station while the vertical axis of the arm is lowering a wedge toward a tray. The drives lose control, the brake on that axis clamps, and the gripper stays hanging above the tray instead of dropping onto the wedge and the 25 g fiber tray. When power returns, the drive must first produce holding torque and only then open the brake, so the arm does not drop a few millimeters as it releases (typical sequencing; details vary by controller) [unverified].

### Elsewhere
On a car factory line, a large arm holding a heavy tool stops on an emergency stop and its brakes clamp to hold the load. A brake rated for about 2,000 full-energy emergency stops [1] would last years in a cell that stops a few times a week but much less in a cell where operators trigger stops many times a day, so maintenance plans include periodic brake checks, which Beckhoff suggests doing with a torque wrench or its scope software [1].

### Why it exists
A servo motor can only hold position while powered and controlled, but robots are switched off every night, lose power, and are stopped by safety circuits. The brake keeps the arm where it is in all of those cases without any power at all.

### Connects to
- [[servo-motor]] — the brake is mounted on the motor shaft, usually at its rear
- [[servo-drive]] — the drive or controller switches the brake and must hold torque before releasing it
- [[estop]] — an emergency stop removes power, which engages every brake
- [[safety-circuit]] — safety logic decides when to cut torque and set brakes
- [[cobot]] — cobot joints use thin hollow-shaft brakes so cables can pass through

### Real products and tools
- **mayr ROBA-servostop Cobot** — spring-applied, hollow-shaft brake for lightweight robot joints, 0.23-9 Nm [2].
- **Beckhoff AM8000 holding brake option** — backlash-free permanent-magnet brake built into the motor; adds 40 mm of length on an AM8032 [3].
- **Kendrion High Torque Line** — permanent-magnet holding brakes for servomotors in robotics and medical devices, 0.1-280 Nm, rated for up to 2,000 emergency stops [4].

### Common misconception
**Misconception:** The brake is what stops the robot in an emergency.

**Reality:** In a normal emergency stop the drives slow the arm or the motor coasts after torque is cut, and the brake mostly holds what has already stopped. Brakes have a limited budget of full-speed stops, such as 2,000 for Beckhoff's servomotor brake, and are not on their own approved to protect people [1].

### Key numbers
- Holding torque of cobot joint brakes: 0.23-9 Nm across sizes, depending on diameter [2]
- Release voltage: 24 VDC, with mayr dropping to 8 V to hold the brake open [1][2]
- Emergency stop budget: at most 2,000 stops from up to 3,000 rpm with load inertia up to 3 times the motor's [1]
- Switching life: more than 10 million cycles [1]

### Sources
1. [Holding brake (AM8100 documentation)](https://infosys.beckhoff.com/content/1033/am8100/1333496971.html) — Beckhoff Information System; permanent-magnet principle, 24 VDC, emergency stop limits, personnel protection, vertical axes
2. [ROBA-servostop Cobot](https://www.mayr.com/en/products/safety-brakes/industrial-brakes/roba-servostop-cobot~40645) — mayr; spring-applied fail-safe brake for robot joints, torque range, voltages, emergency stop suitability
3. [AM8032-wDyz servomotor](https://www.beckhoff.com/da-dk/products/motion/rotary-servomotors/am8000-servomotors/am8032-wdyz.html) — Beckhoff; holding brake option and added motor length
4. [High-Torque Permanent Magnet Brake](https://www.kendrion.com/en/products/industrial-brakes/permanent-magnet-brakes/high-torque-line) — Kendrion; permanent-magnet principle, applications, torque range, emergency stop rating

## Servo drive
id: servo-drive
requires: servo-motor, encoder
aka: servo amplifier, inverter, motor drive, amplifier

### Plain
A servo drive is like a dimmer switch for a motor that readjusts itself many thousands of times a second: it takes power from the wall or a battery and meters exactly how much current goes into each of the motor's three coils. The robot's main computer tells it how hard to push or where to go, and the drive reads the motor's encoder and corrects the current to make that happen. It also has a wired safety input that removes the motor's force the instant it is triggered.

### Where the analogy breaks
A dimmer only turns power down, while a drive also reverses current and takes energy back when the motor is slowed and acts as a generator. And a dimmer does not check the result; a drive measures the current and the motor angle every cycle and corrects itself.

### Precise
A servo drive has a power stage and a control stage. The power stage turns mains AC (100-480 V for Beckhoff's AX8000 [2]) into a DC bus (an internal high-voltage DC supply; up to 848 V on an AX8108 axis module [2]), and six transistors (fast electronic switches) chop that DC into three-phase pulses using PWM (pulse-width modulation: switching thousands of times a second and varying the on-time to set the average voltage). Cobot joints often run on a much lower bus, such as 48 VDC [5]. When an axis slows down, the motor pushes energy back into the bus, which a braking resistor or other axes must absorb [unverified: standard practice, not detailed in a source I opened].

The control stage runs nested loops. The innermost current loop makes the measured winding current match the requested current, which sets torque. Around it run the velocity loop and the position loop, and in robots the position loop often runs in the robot controller instead, which sends setpoints over the network [unverified]. Beckhoff's AX8000 can run its current controller as often as every 62.5 µs at 8 kHz switching, with hardware that reacts to current deviations within 1 µs [3]; imperix's reference example samples and controls at 20 kHz, every 50 µs [1]. Many drives use FOC (field-oriented control: math that rotates the three phase currents into a frame that turns with the rotor, so the torque-making current, iq, and the magnetizing current, id, look like steady values that two simple controllers can track). The id target is usually zero to get the most torque per amp [1].

STO (Safe Torque Off, defined in IEC 61800-5-2: the drive stops delivering power that can make the motor produce torque) is a dedicated safety input, wired directly or sent over a safety network [3][4]. Wired STO is typically two identical 24 V channels that must both be energized for the motor to make torque; removing either one enters the safe state [6]. When STO triggers, the motor coasts to a stop, an uncontrolled stop called category 0, and STO does not brake [4]. That is why vertical axes still need a holding brake, why a controlled stop function, SS1 (decelerate under power, then STO), is used when coasting is unacceptable [3], and why STO by itself does not prevent an automatic restart once its inputs return [4].

### On the cheese plate line
The cheese pick station's guard door is wired into a safety circuit. If it opens mid-pick, the controller decelerates the arm and then the drives apply STO (SS1 behavior), so the wedge is not flung; the motors then cannot make torque and the brakes clamp the gravity-loaded axes. In normal running, a 0.5-second wedge placement involves about 8,000-10,000 current-loop corrections per axis at 50-62.5 µs per cycle [1][3].

### Elsewhere
In a car factory, a large six-axis arm's drives sit in the robot controller cabinet, fed from 400-480 V three-phase mains with a DC bus of several hundred volts; an AX8000-class axis module tolerates up to 848 V DC and supplies 8 A continuously and 20 A peak per axis [2]. A cobot beside a worker runs 48 V class motors instead [5], which need more current for the same power but keep voltages lower.

### Why it exists
Torque in a servo motor is set by current, and current through the windings has to be switched in step with the rotor's angle more than ten thousand times a second, faster than a robot controller's main computer can manage over a network. The drive does that fast, local job and offers a certified way to remove torque for safety.

### Connects to
- [[control-loops]] — the drive runs the innermost loops of the robot's control stack
- [[robot-controller]] — sends position, velocity, or torque setpoints to every drive
- [[safety-circuit]] — wires guard doors, light curtains, and e-stops to the drives' STO inputs
- [[industrial-network]] — carries setpoints and feedback between controller and drives, for example over EtherCAT
- [[brake]] — needed on vertical axes because STO alone lets the motor coast

### Real products and tools
- **Beckhoff AX8000** — multi-axis servo system with STO, SS1, SS2, and SOS safety functions [2][3].
- **SEW-EURODRIVE inverters** — industrial drives with STO to IEC 61800-5-2 [4].
- **Aerotech Automation1 iHXA4 and HXA4 drives** — drives with a two-channel STO input [6].
- **imperix B-Box** — a rapid-prototyping controller used in imperix's FOC reference design, the kind of tool engineers use to develop drive control code [1].

### Common misconception
**Misconception:** Safe Torque Off stops the robot.

**Reality:** STO only removes the motor's ability to make torque; the motor coasts, and a vertical axis will fall unless its brake holds it [4]. Stopping the arm on its path takes a controlled stop first, such as SS1, and then STO [3].

### Key numbers
- Current-loop cycle: 50-62.5 µs in the drives and reference designs checked, with hardware current reaction within 1 µs [1][3]
- Switching frequency: 8-20 kHz in those examples, depending on drive and power level [1][3]
- DC bus: up to 848 V on a 400-480 V AC industrial axis module [2]; 48 V class for cobot joint motors [5]
- Output current: 8 A continuous and 20 A peak per channel on a two-axis industrial module [2]

### Code sketch
```text
// What the drive firmware does once per PWM period (every 50-62.5 us in the examples above).
// Field-oriented current control of one 3-phase permanent-magnet motor.
// Inputs set by slower loops: iq_ref (torque request) and id_ref (usually 0).

on_pwm_interrupt():
    // STO itself is enforced by safety hardware that cuts the transistor gate drive;
    // firmware only notices it, stops integrating, and reports the state.
    if sto_active():
        pi_d.reset(); pi_q.reset()
        return

    ia, ib = adc.sample_phase_currents()     // sampled mid-PWM to avoid switching noise
    ic = -(ia + ib)                          // the three phase currents sum to zero
    theta_e = pole_pairs * encoder.angle()   // electrical angle of the rotor magnets
    vbus = adc.sample_dc_bus()

    // Clarke: three phase currents -> two axes fixed to the stator
    i_alpha = ia
    i_beta  = (ia + 2*ib) / sqrt(3)

    // Park: rotate into the rotor's frame, where currents look like steady values
    id =  i_alpha*cos(theta_e) + i_beta*sin(theta_e)   // magnetizing current
    iq = -i_alpha*sin(theta_e) + i_beta*cos(theta_e)   // torque-making current

    // Two PI controllers, one per axis
    vd = pi_d.update(id_ref - id)
    vq = pi_q.update(iq_ref - iq)
    // (Optional decoupling: vd -= w_e*Lq*iq; vq += w_e*(Ld*id + flux_magnet))

    // The DC bus limits the voltage the drive can apply
    vd, vq = limit_to_circle(vd, vq, vbus / sqrt(3))

    // Inverse Park: back to stator axes
    v_alpha = vd*cos(theta_e) - vq*sin(theta_e)
    v_beta  = vd*sin(theta_e) + vq*cos(theta_e)

    // Modulation: voltage vector -> on-time of each of the three transistor pairs
    pwm.set_duty(space_vector_modulation(v_alpha, v_beta, vbus))

    // Protection (a hardware comparator also trips within about 1 us)
    if max(abs(ia), abs(ib), abs(ic)) > I_TRIP: fault("overcurrent")
    if vbus > VBUS_MAX: switch_on_braking_resistor()

// Slower task, e.g. every few current cycles:
//   torque_ref = velocity_pi.update(vel_ref - measured_velocity)
//   iq_ref     = torque_ref / Kt      // Kt in the drive's current convention
```

### Sources
1. [Field oriented control (FOC) of permanent magnet synchronous machine](https://imperix.com/doc/TN111) — imperix; PI current control in the rotating frame, id reference zero, 20 kHz sampling example
2. [AX8108-0220-0000 axis module](https://www.beckhoff.com/ar-eg/products/motion/servo-drives/ax8000-multi-axis-servo-system/ax8108-0220-0000.html) — Beckhoff; mains range, maximum DC link voltage, rated and peak current, STO and safe stop functions
3. [AX8000 multi-axis servo system](https://www.beckhoff.com/en-us/products/motion/servo-drives/ax8000-multi-axis-servo-system/) — Beckhoff; 62.5 µs current controller cycle at 8 kHz, 1 µs hardware reaction, TwinSAFE stop functions
4. [Safe Torque Off function](https://download.sew-eurodrive.com/download/html/31550207/en-EN/13178472843.html) — SEW-EURODRIVE manual; STO per IEC 61800-5-2, motor coasts, category 0 stop, no brake, restart behavior
5. [New frameless servo motors increase performance and reduce size for robot control](https://usa-automation.net/news/62315-new-frameless-servo-motors-increase-performance-and-reduce-size-for-robot-control) — trade press on Kollmorgen TBM2G; 48 VDC operation for cobot joint motors
6. [Safe Torque Off Input (STO)](https://help.aerotech.com/automation1/hardware-manuals/Automation1-iHXA4-and-HXA4-web/Chapter-2-Installation-and-Configuration/Safe-Torque-Off-Input-STO.htm) — Aerotech hardware manual; two identical 24 V STO channels, either one removed enters the safe state

## Joint torque sensing
id: torque-sensing
requires: gearbox
aka: joint torque sensor, torque sensor, series elastic actuator, link-side torque sensing, current-based torque estimation

### Plain
Joint torque sensing gives a robot a sense of touch in its shoulders and elbows, the way you can feel through your arm when someone pushes against your hand. A stiff metal ring inside each joint bends a tiny amount under load, and thin stickers that change their electrical resistance when stretched measure that bend. The robot can then notice an unexpected push and stop, or let a person guide it by hand.

### Where the analogy breaks
Your arm feels pressure across its whole surface, but a joint torque sensor only feels twist around its own axis, so the robot has to combine every joint with a model of the arm's own weight and motion to work out that it was touched. A very light touch can hide inside the forces the arm makes just to move itself.

### Precise
A joint torque sensor measures the twisting load on the joint after the gearbox, on the link side, so gearbox friction does not pollute it. The usual design is a one-piece flexure (a metal part with thin spokes, shaped to bend measurably and predictably under torque) carrying strain gauges (thin resistors whose resistance changes when stretched) wired as a Wheatstone bridge (four resistors arranged so tiny changes produce a measurable voltage); safety-rated versions use two electrically separate channels [1]. KUKA's LBR iiwa and Franka Research 3 have torque sensors in all seven joints [2][3]. In the iiwa, each joint drives its link through a series elastic element (a deliberately springy part whose twist is the torque measurement), measured at about 18,500 Nm/rad on one joint [4].

Robots without joint torque sensors instead estimate joint torque from motor current, which TE contrasts with direct sensing as a calculation-heavy approach [1]; the core of it is current times the torque constant, corrected through a model of the arm. That estimate includes gearbox friction and the motor's own inertia, so small external forces are harder to separate. A forum reply on Universal Robots' site says UR's safety functions rely on joint current measurements, and that its e-Series tool-flange force sensor is not safety rated [5] [unverified: forum reply, not official UR documentation].

Joint torque sensing enables fast collision detection [1][2], hand-guided teaching [1], and torque control (commanding joint torque rather than position; Franka's interface streams link-side torque and accepts torque commands at 1 kHz [3]). It costs stiffness, because the sensing element must flex to measure, and it is sensitive to gearing ripple: in the iiwa, ripple from the gears appears at speed as a false external torque [4].

### On the cheese plate line
If the cheese pick station used a cobot, so an operator could reach in and straighten a tray without stopping the line (an illustrative layout choice), joint torque sensing is what would make that tolerable: a push on the elbow shows up as torque the arm's model did not predict, and the arm stops. The same sensing can detect the moment a wedge touches the tray bottom, so the gripper releases on contact rather than pressing to a fixed height that might squash a soft wedge or miss a slightly warped tray by a few millimeters.

### Elsewhere
On a car factory's final assembly line, a technician teaches a cobot a new screw-driving path by grabbing its arm and walking it through the motion. The joint torque sensors read the push and the controller moves the joints to follow, which is called lead-through or hand-guided teaching [1].

### Why it exists
Robots that share space with people must notice contact quickly and with little force, and robots doing delicate assembly must control how hard they press. Measuring torque directly after the gearbox gives a cleaner signal than estimating it from motor current through gearbox friction.

### Connects to
- [[cobot]] — joint torque sensing is one of the main ways cobots detect contact
- [[ft-sensor]] — a wrist force-torque sensor measures forces at the tool only, not contact along the arm
- [[gearbox]] — its friction is what makes current-based torque estimates noisy
- [[control-loops]] — torque control wraps a loop around the measured joint torque
- [[safety-standards]] — safety-rated torque sensing must meet functional safety requirements

### Real products and tools
- **KUKA LBR iiwa** — seven-axis cobot with joint torque sensors in all axes, in 7 kg and 14 kg versions as of 2026 [2].
- **Franka Research 3** — seven-axis research cobot with link-side torque sensors and a 1 kHz torque control interface [3].
- **TE Connectivity cobot torque sensor** — dual-channel strain-gauge joint torque sensor for cobot makers [1].
- **Universal Robots e-Series** — uses a force-torque sensor at the tool flange rather than in every joint [5] [unverified: forum source].

### Common misconception
**Misconception:** All cobots feel contact with sensors in their joints.

**Reality:** Some, such as the LBR iiwa and Franka Research 3, measure torque in every joint [2][3], while many others estimate it from motor current [1][5]. Both can be made safe for a given task, but they differ in how small a contact force they can detect, and either way the application still needs its own risk assessment.

### Key numbers
- Series elastic stiffness of one LBR iiwa joint: about 18,500 Nm/rad [4]
- Torque data and command rate: 1 kHz on Franka's interface [3] and on KUKA's Fast Robot Interface [4]
- Joints with torque sensors: 7 of 7 on the LBR iiwa and Franka Research 3 [2][3]

### Sources
1. [Improving safety performance in cobots with torque sensors](https://www.te.com/usa-en/whitepapers/sensors/improving-safety-performance-in-cobots-with-torque-sensors.html) — TE Connectivity whitepaper; flexure, strain gauges, Wheatstone bridge, dual channel, why direct sensing beats current estimation
2. [LBR iiwa](https://www.kuka.com/en-ch/products/robotics-systems/industrial-robots/lbr-iiwa) — KUKA; joint torque sensors in all seven axes, contact detection, payload versions
3. [Franka Research 3](https://franka.de/products/franka-research-3) — Franka Robotics; seven integrated joint torque sensors, link-side torque signals, 1 kHz interface
4. [Toward Torque Control of a KUKA LBR IIWA for Physical Human-Robot Interaction](https://la.disneyresearch.com/wp-content/uploads/Toward-Torque-Control-of-a-KUKA-LBR-IIWA-for-Physical-Human-Robot-Interaction-Paper.pdf) — Chawda and Niemeyer, Disney Research; series elastic joint, measured stiffness, gearing ripple, 1 kHz FRI
5. [Force sensor in UR5 e-Series](https://forum.universal-robots.com/t/force-sensor-in-ur5-eseries/4083) — Universal Robots forum reply (poster's role not stated); flange sensor not safety rated, safety relies on joint currents

## Pneumatic actuation
id: pneumatic-actuation
requires: none
aka: pneumatics, compressed air, air cylinder, pneumatic gripper

### Plain
Pneumatic actuation moves things with compressed air: picture a syringe where, instead of your thumb pushing the plunger, air pumped in behind it shoves the plunger out. A valve sends factory air to one side of the piston or the other, so the rod snaps out or back. It is cheap, fast, and simple, but because air squashes like a spring, it is good at going end to end and poor at stopping precisely in the middle.

### Where the analogy breaks
A syringe full of liquid stops dead when you stop pushing; air compresses, so a pneumatic piston bounces and drifts and is hard to hold at an exact middle point. Real cylinders also need a way back, either a second air port or a return spring.

### Precise
A pneumatic system runs from a compressor, through drying and filtering, to a regulated supply typically around 550-690 kPa (80-100 psi) [1], then through solenoid valves (valves switched by an electric signal) to actuators. Actuators include cylinders (a piston in a tube; single-acting with one port and a spring or air return, or double-acting with a port for each direction) [2], rotary actuators, grippers, and vacuum generators (nozzles that use a jet of compressed air to create suction for vacuum cups). Force is pressure times piston area: a 20 mm bore at 600 kPa pushes about 190 N outward, and less on the return stroke because the rod takes up part of the area [2].

Pneumatics are simple to control, tolerate shocks, can stall against a load without overheating, and can finish a cycle from stored air after a power loss [1]. The weakness is compressibility: motion is springy, so cylinders usually travel end to end against hard stops, with cushioning to soften the impact [1][2]. In robot cells, air mostly powers end effectors and simple machine motions, while the arm's joints are electric.

### On the cheese plate line
Air does many small jobs on the cheese plate line: cylinders at the tray denester separate one 25 g fiber tray from the stack, the cracker pick station's vacuum cup gets its suction from an air-powered vacuum generator, and the apple pick's soft fingers may be inflated with air (illustrative equipment choices). A 20 mm cylinder at 600 kPa gives about 190 N, hundreds of times the weight of a 25 g tray, so cylinders here are chosen for speed and stroke rather than force. In a 2-4 C room, the air must be dried so water does not condense in the cold lines and drip toward food [unverified: standard practice, no source opened].

### Elsewhere
Trucks, buses, and trains use air brakes: compressed air stored in tanks works the brakes [1]. The stored reservoir is the same property that lets a factory cylinder finish its stroke after the compressor stops [1].

### Why it exists
Most factories already pipe compressed air everywhere, and a cylinder plus a valve is the cheapest way to make a strong, fast, two-position motion. For grippers, pushers, and clamps that only need open and closed, nothing electric is as simple.

### Connects to
- [[vacuum-gripper]] — many vacuum cups get their suction from compressed air
- [[soft-gripper]] — soft fingers are often inflated with air
- [[rigid-gripper]] — parallel finger grippers are commonly pneumatic
- [[feeder]] — denesters and pushers often use pneumatic cylinders
- [[hydraulic-actuation]] — the same piston idea with oil at far higher pressure

### Real products and tools
- **Festo** — pneumatic cylinders, valves, grippers, and vacuum components.
- **SMC** — pneumatic cylinders, valves, and air preparation equipment.

### Common misconception
**Misconception:** A pneumatic cylinder is just a cheaper version of an electric servo.

**Reality:** A servo can stop at any commanded position and hold it against changing loads, while a basic cylinder is a two-position device whose air acts like a spring [1]. Pneumatics win on cost and simplicity for open-or-closed jobs and lose wherever motion has to be precise in between.

### Key numbers
- Industrial supply pressure: about 550-690 kPa (80-100 psi) [1]
- Cylinder force: pressure times piston area; a 20 mm bore at 600 kPa gives about 190 N, calculated from [2]
- Bore sizes: about 2.5 mm to 400 mm, some up to 1,000 mm [2]

### Sources
1. [Pneumatics](https://en.wikipedia.org/wiki/Pneumatics) — Wikipedia; typical industrial pressures, compressibility, advantages, stored air, uses including air brakes and soft robotics
2. [Pneumatic cylinder](https://en.wikipedia.org/wiki/Pneumatic_cylinder) — Wikipedia; force formula, single- and double-acting types, bore sizes, cushioning, materials

## Hydraulic actuation
id: hydraulic-actuation
requires: pneumatic-actuation
aka: hydraulics, hydraulic cylinder, servo valve, fluid power

### Plain
Hydraulic actuation pushes with oil under very high pressure, like a car jack that lets you lift a car by pumping a small handle. Because oil barely squeezes, the push is stiff and direct, and a small cylinder can make an enormous force. That is why excavators and some early walking robots used it, and why light factory robots almost never do.

### Where the analogy breaks
A car jack is pumped by hand and moves slowly, while robot hydraulics use a motor-driven pump and fast electrically controlled valves that meter oil into each joint continuously. The oil also has to be kept clean, cool, and inside its hoses, which a jack barely needs to worry about.

### Precise
A hydraulic system has a pump (gear, vane, or piston type) driven by an electric motor or engine, valves (directional, pressure relief, check, and others), actuators (cylinders and hydraulic motors), a reservoir, accumulators (tanks that store energy in pressurized gas), filters, and hoses [2]. Robots and other precise machines meter oil with servo or proportional valves, which open in proportion to an electric signal [unverified: not covered in the sources I opened]. Common working pressures are 6.9-34.5 MPa (1,000-5,000 psi) [1], roughly ten to sixty times typical factory air pressure. Hydraulic pumps have about ten times the power density of an electric motor by volume [2], and because oil barely compresses, motion is stiff and precise and position locks when flow stops [1].

The costs are leaks, hoses that typically need replacement every five to seven years, the danger of a bursting hose, heat build-up, and energy lost to flow through pipes [2]. In robotics, Boston Dynamics' Atlas humanoid was hydraulically actuated through its 2021 version; the company retired hydraulic Atlas on April 16, 2024 and announced a fully electric Atlas the next day, with a production version shown at CES 2026 and deployment planned at a Hyundai plant in 2028 [3]. Robot arms started out hydraulic too: Unimate, called the first industrial robot, was hydraulically powered and first installed at a General Motors plant in New Jersey in 1961 [4]. Today hydraulics remain standard where force density matters most, such as excavators [2].

### On the cheese plate line
There is no hydraulic actuation on the cheese plate line, and that is a deliberate choice. Payloads are grams to a few hundred grams, the room is washed down every day, and a weeping seal or burst hose would put oil near open food. If the plant has hydraulics at all, they would sit outside the food zone, for example in a scissor lift used to load pallets, a machine type that commonly uses hydraulic valves and cylinders [2].

### Elsewhere
An excavator is the familiar hydraulic machine: its boom cylinders, swing drive, and track drive are all hydraulically powered from engine-driven pumps [2]. Its arm is in effect a large, extremely strong, operator-driven robot arm, and the reason it is not electric is hydraulics' power density, which lets small tubes and flexible hoses carry large amounts of power to each joint [2].

### Why it exists
When a machine needs very large forces in a compact, lightweight actuator, high-pressure oil delivers more force per kilogram of actuator than an electric motor and gearbox. Oil's stiffness also makes heavy loads easy to hold still.

### Connects to
- [[pneumatic-actuation]] — the same piston principle with air at far lower pressure and much springier motion
- [[humanoid]] — Atlas moved from hydraulic to electric actuation in 2024
- [[mobile-robot]] — heavy outdoor and legged machines are where hydraulics still appear
- [[hygienic-design]] — oil leaks are one reason food lines avoid hydraulics
- [[servo-motor]] — electric motors have replaced hydraulics in nearly all factory robot arms

### Real products and tools
- **Boston Dynamics hydraulic Atlas** — hydraulic humanoid, retired in April 2024 in favor of an all-electric Atlas [3].
- **Unimate** — the hydraulic arm installed at General Motors in 1961, often called the first industrial robot; historical, no longer sold [4].
- **Caterpillar and Komatsu excavators** — everyday examples of large hydraulic arms.

### Common misconception
**Misconception:** Hydraulics are obsolete in robotics now that Atlas went electric.

**Reality:** Electric motors took over factory arms and, in 2024, the best-known humanoid [3], but hydraulics still dominate where force per kilogram matters most, such as excavators and other heavy machines [2]. The choice tracks payload and environment, not fashion.

### Key numbers
- Working pressure: commonly 6.9-34.5 MPa (1,000-5,000 psi), with special uses far higher [1]
- Power density: hydraulic pumps about 10 times an electric motor by volume [2]
- Hose replacement: typically every 5-7 years, depending on use [2]
- Filtration: particles down to about 7-15 microns removed [2]

### Sources
1. [Pneumatics](https://en.wikipedia.org/wiki/Pneumatics) — Wikipedia; typical hydraulic pressure range and stiffness compared with pneumatics
2. [Hydraulic machinery](https://en.wikipedia.org/wiki/Hydraulic_machinery) — Wikipedia; components, power density, disadvantages, hose life, filtration, excavator example
3. [Atlas (robot)](https://en.wikipedia.org/wiki/Atlas_%28robot%29) — Wikipedia; hydraulic Atlas versions, retirement April 16, 2024, electric Atlas, production plans
4. [Unimate](https://en.wikipedia.org/wiki/Unimate) — Wikipedia; hydraulically powered, first installed at General Motors in 1961, called the first industrial robot
