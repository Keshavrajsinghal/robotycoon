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
