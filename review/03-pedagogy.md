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
