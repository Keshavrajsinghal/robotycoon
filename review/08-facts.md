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
