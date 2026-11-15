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
