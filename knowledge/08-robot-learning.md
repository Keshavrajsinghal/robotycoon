---
area: 8
slug: robot-learning
title: Robot learning
---

# Robot learning

Robot learning covers the methods that produce robot behavior from data instead of from hand-written rules. These include copying human demonstrations (imitation learning), trial and error against a score (reinforcement learning), practicing in simulation and moving the skill to hardware (sim-to-real), and large pretrained models that take camera images plus a text instruction and output arm motions (vision-language-action models). The area also covers the less glamorous work that decides whether any of it succeeds: collecting datasets, measuring success honestly, and running the network fast enough on the robot.

On the cheese plate line, robot learning is most useful where the objects change from plate to plate. That means the grape pick (tangled, soft bunches) and the apple pick (wet, irregular slices). The tray denester, cracker pick, and lidding handle rigid, repeatable items, where classical programming is usually cheaper and easier to validate. As of late 2026, most of the learned systems named here are research systems or pilots. Each product entry gives the deployment status where I could find it.

## Learned policies and what they replace
id: learned-policy
requires: perception, grasp-planning, trajectory-generation, control-loops
aka: policy, end-to-end policy, visuomotor policy

### Plain
A learned policy is the part of a robot's software that looks at what the robot sees and decides how to move next, except that nobody wrote its rules: it was trained from examples. Think of a line cook who learned plating by watching the head chef do it hundreds of times, instead of following a printed recipe card with one instruction per step. The cook glances at the plate and moves their hands, over and over, many times a second.

### Where the analogy breaks
A cook knows why each move works and can explain it. A learned policy is millions of numbers that turn camera pixels into motor targets: it cannot explain itself, and it can fail confidently on something that looks only slightly different from its training examples. Also, the policy only says where the joints should go; separate motor electronics still do the actual moving.

### Precise
A policy (a function from what the robot currently senses to the action it takes next) is "learned" when its behavior comes from training a neural network (a large function built from millions to billions of adjustable numbers, called parameters, that are tuned automatically to fit examples) on data. Its inputs, called observations, are usually a few camera images (2 or 3 per robot for pi0 [2]), proprioception (the robot's sense of its own body: joint angles read from encoders), and sometimes a text instruction. Its outputs, called actions, are usually target joint positions, or a target gripper pose, plus an open/close command. They are sent at a fixed rate: 3 Hz for Google's RT-1 [3], and 50 Hz for ACT on the ALOHA arms [1] and for pi0 on its faster robots [2]. Many current policies output an action chunk (a short list of future targets, for example 50 steps covering one second in pi0 [2]) instead of one target at a time.

The classical pipeline for a pick runs through named stops: image, then detection (find the object in the picture), then 3D position (where it is relative to the robot), then grasp (choose where and how to grip), then trajectory (a smooth path with timing), then joint targets. An end-to-end learned policy collapses all six stops into one network: pixels and joint angles in, joint targets out. This is what the site's classical/learned toggle shows. Inside the network there is no bounding box, 3D pose, or grasp score that an engineer can print and inspect, and losing those checkpoints is the main debugging cost. Partial versions are common: a learned grasp detector feeding a classical motion planner replaces only the detection and grasp stops, and a policy that outputs gripper poses still relies on the classical inverse kinematics step to turn poses into joint angles.

What stays is everything below the joint target and everything around it. The servo drive and motor still close their own current, velocity, and position loops. On a ROBOTIS Dynamixel servo, for example, the policy writes a Goal Position, and the servo's built-in profile generator (which turns a jump in target into a smooth speed ramp) and PID controller (a feedback rule that pushes harder the further the joint is from its target) turn it into motor power [4]. Joint limits, speed limits, the e-stop chain (the wired emergency-stop circuit), light curtains (light beams that stop the robot when someone reaches through), and safety-rated monitoring stay in certified hardware and the robot controller, outside the network [unverified: standard industry practice; I did not find a standard that addresses learned policies directly]. The cell's sequencing logic usually stays too, such as a PLC (an industrial controller) that waits for "tray present" before it allows a pick.

### On the cheese plate line
At the grape pick station, the classical chain would be: depth camera image, detect the bunch, estimate the 3D position of the stem, choose a grasp on the stem, plan a path, send joint targets. Every stop is fragile, because bunches tangle, droop, and hide their stems. A learned policy instead takes the overhead and wrist camera images plus the six joint angles, and outputs a chunk of joint targets at 50 Hz. The servo drives, the guarding and e-stop circuit, the PLC's tray-present interlock, and the inspection station downstream all stay exactly as they were.

### Elsewhere
On a dual-arm robot folding laundry, pi0 outputs 50-step chunks at 50 Hz, executes 25 of those steps without looking again, then plans a fresh chunk [2]. In a car body shop the trade-off goes the other way. Parts are clamped in fixtures and arrive in the same place every time, so a taught welding path does the job, and a learned policy would add cost and validation work without adding anything.

### Why it exists
The classical chain needs an explicit model for each object and a hand-written rule for each failure case. For soft, varied, or cluttered objects, writing those rules becomes the bottleneck. Learning moves the effort from writing code to collecting examples, which scales better when the variety is large.

### Connects to
- [[perception]] — the detection and 3D-position stops that an end-to-end policy absorbs
- [[grasp-planning]] — the grasp stop that disappears into the network
- [[trajectory-generation]] — the path-and-timing stop that the action chunk replaces
- [[control-loops]] — the drive's feedback loops keep running underneath the policy
- [[safety-circuit]] — stays outside the network and can always stop the arm

### Real products and tools
- **ACT (Action Chunking with Transformers)** — the policy design from the ALOHA project; predicts chunks of joint positions at 50 Hz [1]
- **pi0** — Physical Intelligence's 3.3B-parameter policy; predicts 50-step chunks at up to 50 Hz [2]. As of November 2026 the company has no generally available product: its policies run in partner trials such as laundry and box folding [6], and outside teams can apply for hosted fine-tuning and inference through an API beta opened in October 2026 [7]
- **Hugging Face LeRobot** — open-source library that implements ACT, Diffusion Policy, pi0, pi0.5, GR00T N1.7, SmolVLA, and others for low-cost arms [5]
- **ROBOTIS Dynamixel servos** — smart servos with a built-in position controller, used in many low-cost research arms; the layer that sits below the policy [4]

### Common misconception
**Misconception:** An end-to-end policy replaces the robot's whole software stack, so the network is "driving the motors."

**Reality:** It replaces the decision-making from pixels to joint targets. Motor feedback loops, joint limits, safety circuits, and cell sequencing remain conventional engineered systems, so a wild output from the network is still clamped by limits and can be stopped by the safety system.

### Key numbers
- Policy output rate: about 3-50 Hz, from RT-1's 3 Hz [3] to 50 Hz for ACT [1] and pi0 [2]; set mainly by model size and the robot's controller.
- Action chunk length: 50 steps (1 s) for pi0 [2]; the ALOHA page lists 90 steps for ACT [1].
- One inference call of a 3.3B-parameter policy: about 73 ms on an RTX 4090 GPU [2].

### Code sketch
```python
# A learned policy as an interface. The policy call is learned;
# everything around it is the same as in a classical cell.

class Policy:
    def __call__(self, obs):
        # obs = {"images": {"wrist": HxWx3, "overhead": HxWx3},
        #        "joint_pos": 6 floats in radians, read from encoders,
        #        "instruction": "pick one grape bunch"}      # optional
        # returns a chunk: 50 rows x 7 numbers (6 joint targets + gripper)
        ...

# Classical pipeline this replaces, stop by stop:
#   det   = detect(image)                      # where is the bunch in the picture?
#   pose  = pose_3d(det, depth, calibration)   # where is it relative to the robot?
#   grasp = choose_grasp(pose)                 # where and how to grip
#   traj  = plan_trajectory(grasp)             # smooth path with timing
#   joint_targets = sample(traj)
# Learned version:
#   joint_targets = policy(obs)                # one network, no named intermediates

def control_tick(chunk, i, robot, safety):
    target = clamp_to_joint_limits(chunk[i])   # stays: hand-written limits
    if not safety.ok():                        # stays: safety controller / e-stop chain
        robot.hold()                           # brakes and drive disable are handled in hardware
        return
    robot.send_joint_targets(target)           # stays: the drive's own feedback loops
```

### Sources
1. [ALOHA: Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware](https://tonyzhaozh.github.io/aloha/) — Zhao et al., project page; ACT predicts joint positions at 50 Hz, chunk size 90, 50 demonstrations per task
2. [pi0: A Vision-Language-Action Flow Model for General Robot Control](https://arxiv.org/html/2410.24164) — Black et al., Physical Intelligence, arXiv; 50 Hz control, 50-step chunks, open-loop execution of 25 steps, 73 ms latency on RTX 4090
3. [RT-1: Robotics Transformer for Real-World Control at Scale](https://robotics-transformer1.github.io/) — Google, project page; actions at 3 Hz
4. [DYNAMIXEL XM430-W350 e-Manual](https://emanual.robotis.com/docs/en/dxl/x/xm430-w350/) — ROBOTIS; position control mode, Goal Position, built-in profile and PID control
5. [huggingface/lerobot](https://github.com/huggingface/lerobot) — Hugging Face, GitHub; list of implemented policies and supported hardware
6. [Physical Intelligence Inc.](https://en.wikipedia.org/wiki/Physical_Intelligence_Inc.) — Wikipedia, secondary; company not yet selling commercially, trials in laundry and box folding
7. [Physical Intelligence Opens API Beta for Robot Model Training and Inference](https://www.humanoidsdaily.com/news/physical-intelligence-api-beta-robot-training-inference) — Humanoids Daily, October 14, 2026, secondary; API beta announced October 13, 2026, hosted fine-tuning and inference, waitlist with batch onboarding

## Imitation learning
id: imitation-learning
requires: learned-policy
aka: behavior cloning, BC, learning from demonstration, ACT, Diffusion Policy

### Plain
Imitation learning teaches a robot by showing it: a person guides the robot through a task dozens of times, and the robot learns to copy what it saw. It is like a learner driver who studies hours of dashcam video from an expert, noting what the road looked like and how the wheel turned at each moment. Later, when the learner sees a similar road, they turn the wheel the same way.

### Where the analogy breaks
The expert's footage never shows the car drifting toward the curb and being recovered, so the learner has no example of how to fix its own small mistakes. A human learner would reason their way back; the robot's small mistakes pile up into big ones.

### Precise
Behavior cloning (ordinary supervised learning where the "right answer" for each moment is the action a person took) trains the policy to output, for each recorded observation, the action the demonstrator took at that instant. The data are demonstrations (recorded runs of the task, each one called an episode). They are usually collected by teleoperation (a person driving the robot remotely), often with a lightweight "leader" arm that the real "follower" arm copies joint for joint. ACT on the ALOHA arms used 50 demonstrations per task, and reached 80-90% success on its hardest tasks from about 10 minutes of demonstrations [1][2]. LeRobot's ACT implementation has about 80M parameters and trains 100k steps in a few hours on one GPU [5].

Two problems shape the field. The first is compounding error. The policy makes a small mistake, lands in a situation the demonstrations never showed, makes a bigger mistake there, and drifts further; the ACT authors describe errors that compound over time and drift out of the training data [2]. The root cause is that the policy's own actions choose what it sees next, which breaks the usual supervised-learning assumption that every example is independent [3]. Remedies include DAgger (run the learner, have the expert label the situations it actually reaches, add those to the data, retrain) [3], deliberate recovery demonstrations, and action chunking. Action chunking means predicting several future actions at once, so the policy makes fewer separate decisions per task and has fewer chances to drift; it is ACT's central idea [1][2].

The second is multimodal demonstrations: people solve the same situation in different ways, such as grabbing a bunch from the left or from the right. A network trained to minimize average squared error learns the average of the two, which can be a grasp straight into the middle that no person would make. Generative action models fix this by learning the whole spread of choices and committing to one. ACT trains with a hidden "style" input that is learned during training and set to zero at run time (a conditional variational autoencoder) [5]. Diffusion Policy starts from random noise and refines it step by step into an action sequence; it reported an average 46.9% improvement over prior methods across 12 tasks from 4 benchmarks [4]. A hard limit remains: a cloned policy rarely beats its demonstrators, because it copies their speed and hesitations, and the ACT authors name human demonstrations that vary from run to run ("non-stationary" in their words) as a core difficulty [1].

### On the cheese plate line
Illustrative plan for the grape pick station: an operator drives the station with a leader arm for about 200 demonstrations over several shifts, varying grape variety, bunch size, and where the tray stops. About one in five demonstrations deliberately starts from a bad state, such as a half-grasped bunch or a bunch caught on the tray lip, so the policy sees recoveries. The trained policy will run no faster than the operator did. If demonstrations average 14 s per bunch, that fits the 18 s per plate the line allows at 200 plates an hour, but leaves only a few seconds for a retry.

### Elsewhere
The ALOHA work taught a low-cost bimanual rig, built on about a $20k budget, to open a translucent condiment cup and slot a battery, at 80-90% success from about 10 minutes of demonstrations [1][2]. Both tasks need millimeter-level coordination between two arms, which would be slow to program by hand. LeRobot's documentation now runs the same ACT policy on its low-cost SO-101 arm [5].

### Why it exists
Showing a task is much easier than writing a program or a reward for it, especially for soft or varied objects. Supervised learning is also stable and well understood, so a small team can get a working policy from a few hours of data.

### Connects to
- [[learned-policy]] — imitation learning is the most common way to train one
- [[robot-datasets]] — where the demonstrations are stored and shared
- [[teleop-modes]] — the remote-control setups used to record demonstrations
- [[reinforcement-learning]] — often used after imitation to exceed the demonstrator

### Real products and tools
- **ALOHA** — low-cost bimanual teleoperation rig, built on about a $20k budget [2]
- **ACT in LeRobot** — about 80M parameters, ResNet-18 vision backbone, recommended first policy for beginners [5]
- **Diffusion Policy** — open-source policy from Columbia and collaborators that generates actions by step-by-step denoising [4]
- **LeRobot SO-101 arm** — low-cost arm that LeRobot's docs use to run ACT policies [5]

### Common misconception
**Misconception:** More demonstrations always make a better policy.

**Reality:** Coverage and consistency matter as much as count. Demonstrations that vary from run to run are a named difficulty [1], and demonstrations that all start from the same tidy position teach nothing about recovering from mistakes, which is exactly where compounding error bites [3]. A controlled data-scaling study found that the variety of environments and objects mattered far more than the number of demonstrations, and that past a threshold, extra demonstrations per environment or object added little [6].

### Key numbers
- Demonstrations per task: about 50 for the ALOHA tasks, about 10 minutes of data for the hardest [1][2]; the LeRobot docs say ACT often succeeds with about 50 [5].
- Success on the hardest ALOHA tasks: 80-90% [1].
- ACT model and training: about 80M parameters; a few hours for 100k steps on one GPU [5].
- Diffusion Policy: 46.9% average improvement over prior methods across 12 tasks from 4 benchmarks [4].

### Code sketch
```python
# Behavior cloning with action chunking (ACT-style, simplified: the CVAE style term is left out).
# The loader yields windows cut from demonstration episodes:
#   images and joint_pos at time t, and the K actions the human took from t onward.
K = 50                                   # chunk length: 1 s of actions at 50 Hz
policy = ChunkPolicy(backbone="resnet18", chunk=K, action_dim=7)
opt = AdamW(policy.parameters(), lr=1e-5)

for step in range(100_000):
    batch = next(loader)                 # images, joint_pos, actions (B x K x 7), pad (B x K)
    pred = policy(batch.images, batch.joint_pos)        # B x K x 7
    err = (pred - batch.actions).abs()                  # L1 error: less "averaging" than squared error
    loss = (err * batch.pad.unsqueeze(-1)).mean()       # ignore steps past the episode's end
    opt.zero_grad()
    loss.backward()
    opt.step()

# At run time: call the policy, execute part of the chunk, call it again.
# Fewer calls per task means fewer chances for small errors to compound.
```

### Sources
1. [Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware](https://arxiv.org/abs/2304.13705) — Zhao, Kumar, Levine, Finn, arXiv 2023; ACT, compounding errors, non-stationary human demonstrations, 80-90% success from 10 minutes of demonstrations
2. [ALOHA project page](https://tonyzhaozh.github.io/aloha/) — Zhao et al.; $20k budget, 50 demonstrations per task, errors compounding out of the training distribution
3. [A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning](https://arxiv.org/abs/1011.0686) — Ross, Gordon, Bagnell, arXiv 2010; sequential predictions violate the independence assumption; iterative fix (DAgger)
4. [Diffusion Policy: Visuomotor Policy Learning via Action Diffusion](https://arxiv.org/abs/2303.04137v4) — Chi et al., RSS 2023; denoising action generation, multimodal actions, 46.9% average improvement on 12 tasks from 4 benchmarks
5. [ACT (Action Chunking with Transformers)](https://huggingface.co/docs/lerobot/act) — Hugging Face LeRobot docs; about 80M parameters, ResNet-18, latent style variable, 50 demonstrations, training time
6. [Data Scaling Laws in Imitation Learning for Robotic Manipulation](https://arxiv.org/abs/2410.18647) — Lin et al., arXiv 2024; diversity of environments and objects matters more than number of demonstrations

## Reinforcement learning
id: reinforcement-learning
requires: learned-policy
aka: RL, PPO, trial and error, real-world RL

### Plain
Reinforcement learning teaches a robot by trial and error with a score. It is like training a dog with treats: the dog tries things, gets a treat when it does the right thing, and gradually does more of whatever earned treats. The robot makes thousands or millions of attempts, mostly in a simulated world, and gets a number for each good outcome instead of a treat.

### Where the analogy breaks
A dog's attempts are cheap and mostly harmless, but a real robot's random early attempts can break grippers, crush product, or hit things, which is why most robot RL happens in simulation or with a person ready to take over. And the robot exploits any gap in the score with no sense of what you "meant," in ways a dog would not.

### Precise
Reinforcement learning (a family of methods that improve a policy by trial and error against a numeric score) frames a task as an environment (the simulated or real cell), observations, actions, and a reward (a number the engineer's code computes at every step, for example +1 when a pack is seated and a small penalty for every second spent). One attempt is an episode, and the goal is to maximize the return (total reward over an episode). Nobody shows the robot what to do. During training the policy adds random variation to its actions (exploration), and each update makes the actions that turned out better than expected a little more likely and the worse ones less likely. That is how it can find strategies faster or better than a human demonstrator, but only for what the reward actually measures.

PPO (Proximal Policy Optimization) is the common workhorse in simulation. It alternates between collecting a batch of attempts with the current policy and taking several gradient steps (small automatic adjustments to the network's numbers in the direction that improves the score) on that batch, using a stand-in "surrogate" objective that allows several updates per batch of data [1]. It keeps each update small, which is the "proximal" in its name; the clipped variant, which OpenAI's own documentation calls the primary one it uses, does this by capping how far each action's probability can change in one update [5]. PPO is on-policy (it learns only from attempts made by the current version of the policy, then throws them away) [5], which wastes data but trains stably. That waste is affordable only in simulation: Rudin et al. trained a four-legged robot to walk with thousands of simulated copies in parallel on one GPU, in under 4 minutes on flat ground and about 20 minutes on rough terrain [2].

On real hardware every attempt costs time and wear, so real-world RL uses off-policy methods (which keep and reuse every past attempt) plus help from people. HIL-SERL starts from a few demonstrations and lets a human take over and correct the robot during training. It learned precise assembly and dual-arm tasks in 1-2.5 hours to near-perfect success, with about twice the success of imitation baselines and 1.8x faster execution [3]. The hard parts are reward design, safe exploration, and resetting the scene between attempts. A reward paid only on final success gives almost no signal early on, while a richer one can be gamed: rewarding "pack near pocket" can teach the arm to hover there. RL is also now used to fine-tune large pretrained policies from their own deployment experience; Physical Intelligence's π*0.6 (November 2025) is a company-reported example [6].

### On the cheese plate line
Illustrative plan for the cracker pick, which places two wrapped packs into a tight tray pocket. Suppose a policy trained by imitation seats both packs on 92% of attempts. Engineers then run real-world RL in the style of HIL-SERL [3]: reward +1 when a camera over the cracker station confirms both packs lie flat in the pocket (the line's inspection station is two stations later, too late and too cluttered with cheese to score each attempt), a small penalty per second, and an operator with a 3D mouse who takes over when the arm heads somewhere bad. Because RL optimizes the actual score instead of copying the operator's pace, the aim is fewer misseated packs and a shorter cycle within the 18 s per plate.

### Elsewhere
Four-legged walking robots are the clearest RL success. Thousands of simulated copies of the ANYmal robot practiced walking over generated terrain with a curriculum (start easy, get harder), and the resulting policy was then run on the physical robot [2]. Walking is a good fit because humans cannot easily demonstrate it for a four-legged body, but "move forward at this speed without falling" is easy to score.

### Why it exists
Some behaviors are easy to score but hard to demonstrate: too fast, too precise, or for a body unlike a human's. RL finds those behaviors by itself, and can keep improving past the level of any demonstrations it started from.

### Connects to
- [[simulators]] — where almost all from-scratch RL training happens
- [[sim-to-real]] — the step that makes a simulation-trained policy work on hardware
- [[imitation-learning]] — the usual starting point that RL then improves
- [[inspection]] — an inspection camera's pass/fail is a natural reward signal on a line
- [[policy-evaluation]] — RL optimizes the reward, so you must check it optimized the right thing

### Real products and tools
- **PPO** — the standard policy-gradient algorithm for simulated robot training [1]
- **LeRobot** — includes HIL-SERL and TD-MPC implementations for real-world RL on low-cost arms [4]
- **Isaac Lab and MuJoCo** — common simulators for RL training, run in parallel on GPUs by Isaac Lab itself or by MuJoCo's MJX and Warp backends; see [[simulators]]
- **Physical Intelligence π*0.6** — a VLA improved with RL from deployment experience [6]; its weights are not in the company's open-source openpi repository as of November 2026 [7]

### Common misconception
**Misconception:** RL means the robot teaches itself from scratch on the real factory floor.

**Reality:** From-scratch RL needs far more attempts than real hardware can afford, so it runs in simulation [2]. Real-world RL that works in hours, like HIL-SERL, starts from demonstrations and relies on human corrections during training [3].

### Key numbers
- Simulated walking: under 4 minutes (flat) to about 20 minutes (rough terrain) of training on one GPU with thousands of parallel robots [2].
- Real-world RL: 1-2.5 hours per task, about 2x the success and 1.8x faster execution than imitation baselines, depending on task [3].

### Code sketch
```python
# PPO-style training loop, simplified. 4096 parallel simulated cracker stations.
envs = make_parallel_envs("CrackerPlace", n=4096)      # GPU simulator
policy, value = ActorNet(), CriticNet()                # value net: "how good is this situation?"
opt = Adam(policy.params() + value.params(), lr=3e-4)
CLIP = 0.2

obs = envs.reset()
for iteration in range(2000):
    rollout = []
    for t in range(24):                                # short burst of experience
        dist = policy(obs)                             # Gaussian over joint moves
        act = dist.sample()                            # random sampling = exploration
        nxt, rew, done = envs.step(act)                # rew: +1 seated, -0.01 per step, -1 dropped
        rollout.append((obs, act, dist.log_prob(act), rew, done, value(obs)))
        obs = nxt
    # advantage: did each action turn out better or worse than the value net expected?
    adv, ret = gae(rollout, value(obs), gamma=0.99, lam=0.95)

    for epoch in range(5):                             # reuse the same data a few times
        for mb in minibatches(rollout, adv, ret):
            ratio = exp(policy(mb.obs).log_prob(mb.act) - mb.old_logp)
            surrogate = minimum(ratio * mb.adv,
                                clip(ratio, 1 - CLIP, 1 + CLIP) * mb.adv)   # cap the step size
            loss = -surrogate.mean() + 0.5 * ((value(mb.obs) - mb.ret) ** 2).mean()
            opt.zero_grad()
            loss.backward()
            opt.step()
    # the rollout is now discarded: PPO is on-policy
```

### Sources
1. [Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347) — Schulman et al., arXiv 2017; alternates sampling and surrogate-objective optimization with multiple minibatch epochs
2. [Learning to Walk in Minutes Using Massively Parallel Deep Reinforcement Learning](https://arxiv.org/abs/2109.11978) — Rudin et al., arXiv 2021; thousands of parallel robots on one GPU, under 4 and about 20 minutes, transfer to ANYmal
3. [Precise and Dexterous Robotic Manipulation via Human-in-the-Loop Reinforcement Learning](https://arxiv.org/abs/2410.21845) — Luo et al. (HIL-SERL), arXiv 2024; 1-2.5 hours, near-perfect success, 2x success, 1.8x faster
4. [huggingface/lerobot](https://github.com/huggingface/lerobot) — Hugging Face, GitHub; HIL-SERL and TD-MPC listed as supported RL policies
5. [Proximal Policy Optimization](https://spinningup.openai.com/en/latest/algorithms/ppo.html) — OpenAI Spinning Up docs; PPO-Clip as the primary variant used at OpenAI, clipped probability ratio, on-policy
6. [π*0.6: a VLA That Learns From Experience](https://arxiv.org/abs/2511.14759) — Physical Intelligence, arXiv, November 2025; RL from real-world deployment data (RECAP)
7. [Physical-Intelligence/openpi](https://github.com/Physical-Intelligence/openpi) — Physical Intelligence, GitHub README; open checkpoints are π0, π0-FAST, and π0.5 only, Apache-2.0

## Simulators
id: simulators
requires: forward-kinematics, collision-checking
aka: physics engine, robot simulation, MuJoCo, Isaac Sim, Isaac Lab, Gazebo

### Plain
A robot simulator is a video-game version of the robot cell with real physics: gravity, friction, collisions, and virtual cameras. Like a flight simulator for pilots, it lets engineers and learning algorithms practice where a crash costs nothing. Unlike a pilot, the computer can run thousands of copies at once, faster than real time.

### Where the analogy breaks
A professional flight simulator is validated against one specific aircraft. Robot simulators only approximate contact, friction, and soft objects, and those approximations are exactly where grasps succeed or fail, so a policy can learn to rely on simulator quirks that do not exist in reality.

### Precise
A robot simulator combines three parts. The physics engine (software that advances the virtual world by a small time step, typically a few milliseconds, by computing forces, motion, and contacts; MuJoCo's default step is 2 ms [9]) moves things. The renderer draws what each virtual camera would see. The robot description (a text file such as URDF or MuJoCo's MJCF that lists links, joints, masses, motor limits, and collision shapes) tells both what the robot is. Engineers use simulators to test software without hardware; robot learning uses them to generate millions of attempts and synthetic camera images with perfect labels, such as the exact position of every object.

Every simulator trades accuracy against speed, and contact is where that trade bites. Rigid contact, such as a gripper closing on a cracker pack, is hard to compute because forces jump abruptly. MuJoCo, for example, poses contact as a convex optimization (a math problem with one best answer that solvers find reliably) and allows slightly soft contacts, which keeps it fast and stable at the cost of some realism [1]. Deformable and wet objects, such as grape stems, apple slices, or cheese that smears, are much less mature in most robot simulators [unverified: general assessment; I did not find a benchmark that measures it].

The second trade-off is CPU versus GPU. GPU-parallel simulators run thousands of copies of a scene at once; ManiSkill3 reports up to 30,000+ frames per second with rendering, depending on the task [5]. That parallelism is what makes large-scale reinforcement learning practical. Headline speed numbers need care, though, because they depend heavily on accuracy settings and whether cameras are rendered [6].

### On the cheese plate line
The cracker pick and the tray denester are rigid, box-like problems that MuJoCo or Isaac Lab model well. A team could train or test those stations in simulation, including thousands of jams and misfeeds that would be tedious to stage on the real line. The grape pick and apple pick are the opposite: tangled stems, wet slices, and suction on a curved surface are where simulated contact is least trustworthy, so those stations lean on real demonstrations. The same simulator can also check reach and cycle time during cell design, before any steel is cut.

### Elsewhere
A team training a walking controller for a humanoid runs thousands of copies of the robot in parallel on a GPU, each on slightly different terrain, using a GPU backend such as MuJoCo's MJX or MuJoCo Warp [1] or Isaac Lab [2]. A team integrating a warehouse mobile robot, by contrast, cares less about raw speed and more about running its full ROS 2 navigation software unchanged against a simulated building. That is what Gazebo is built for: it connects to ROS 2 through the ros_gz bridge, with a recommended Gazebo release for each ROS 2 release [8].

### Why it exists
Real robot time is slow, expensive, and sometimes dangerous, and every real attempt needs someone to reset the scene. Simulation is cheap, parallel, instantly resettable, and gives exact ground truth for free, so it is where risky tests and data-hungry training happen first.

### Connects to
- [[reinforcement-learning]] — needs the millions of attempts only simulation can supply
- [[sim-to-real]] — the gap between simulated and real physics, and how to close it
- [[collision-checking]] — simulators reuse the same collision geometry as planners
- [[cell-design]] — simulation checks layout, reach, and cycle time before building
- [[policy-evaluation]] — simulated benchmarks are a cheaper, partial stand-in for real trials

### Real products and tools
- **MuJoCo** — Google DeepMind's physics engine, open-sourced in May 2022; joint-space simulation with soft convex contact; GPU backends MJX (built on JAX) and MuJoCo Warp (built on NVIDIA Warp) [1]
- **NVIDIA Isaac Sim and Isaac Lab** — Isaac Sim is NVIDIA's photorealistic robot simulator, and Isaac Lab is the learning framework built with it. Isaac Lab 3.0, generally available since October 2026, can run on PhysX or on Newton (a GPU physics engine whose solvers include MuJoCo Warp), makes Isaac Sim optional, and targets Isaac Sim 6.2 when it is used [2]
- **Gazebo** — open-source robot simulator paired with ROS 2 through ros_gz [8]; current long-term support release is Jetty (September 2025, supported to May 2031) [3]
- **Drake** — C++ and Python toolbox led by Toyota Research Institute for multibody dynamics, contact, and optimization, used for planning and control research [4]
- **ManiSkill3** — GPU-parallel manipulation simulator and benchmark built on the PhysX-based SAPIEN engine [5][6]
- **PyBullet and Genesis** — PyBullet is the Python interface to the Bullet engine, common in older RL papers, and its issue tracker is closed per the README [7]; Genesis is a newer open-source simulator launched in late 2024 whose headline speed claims were disputed [6]

### Common misconception
**Misconception:** A simulator's headline speed, like "430,000 times faster than real time," tells you how fast you can train.

**Reality:** Genesis's launch benchmark used the least accurate solver setting, an arm that sat idle most of the time, and no cameras. A critic's corrected run measured about 0.29 million frames per second instead of 43 million, and about 10x real time with a robot camera turned on [6]. The critic builds a competing simulator, and Genesis has since published fixes, so treat both sides with care and benchmark your own task with contacts and cameras on [6].

### Key numbers
- Simulation plus rendering throughput: up to 30,000+ frames per second in ManiSkill3, depending on the task [5].
- Genesis Franka benchmark: 43 million frames per second claimed versus about 0.29 million when corrected, on one RTX 4090 [6].
- Gazebo Jetty support window: September 2025 to May 2031 [3].

### Code sketch
```python
import mujoco                                     # pip install mujoco

model = mujoco.MjModel.from_xml_path("cracker_station.xml")  # MJCF: links, joints, masses, collision shapes
data = mujoco.MjData(model)                       # the changing state: positions, velocities, contacts
model.opt.timestep = 0.002                        # physics step, here 2 ms (500 Hz)
renderer = mujoco.Renderer(model, height=224, width=224)

for step in range(5000):                          # 10 s of simulated time
    if step % 10 == 0:                            # policy at 50 Hz, physics at 500 Hz
        renderer.update_scene(data, camera="wrist")
        image = renderer.render()                 # what the virtual wrist camera sees
        target = policy(image, data.qpos.copy())  # joint angles in, joint targets out
    data.ctrl[:] = target                         # position actuators track targets, like servos
    mujoco.mj_step(model, data)                   # integrate motion, resolve contacts

    for contact in data.contact[: data.ncon]:     # ground truth for free: what touches what
        pass                                      # e.g. reward "pack touching pocket floor"
```

### Sources
1. [MuJoCo Overview](https://mujoco.readthedocs.io/en/stable/overview.html) — Google DeepMind docs; history, generalized coordinates, convex soft contact, MJX and MuJoCo Warp backends
2. [Isaac Lab v3.0.0 release](https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0) — NVIDIA, GitHub, October 20, 2026; general availability, targets Isaac Sim 6.2, Newton solvers (MuJoCo-Warp, VBD, MPM), PhysX via OV libraries, Isaac Sim optional
3. [Gazebo releases](https://gazebosim.org/docs/latest/releases/) — Open Robotics; release list with dates and end-of-life, Jetty LTS
4. [Drake](https://drake.mit.edu/) — MIT and Toyota Research Institute; multibody dynamics, contact, optimization, systems framework
5. [ManiSkill3: GPU Parallelized Robotics Simulation and Rendering for Generalizable Embodied AI](https://arxiv.org/abs/2410.00425) — Tao et al., arXiv 2024; up to 30,000+ FPS with rendering depending on task
6. [How fast is the new hyped Genesis simulator?](https://stoneztao.substack.com/p/the-new-hyped-genesis-simulator-is) — Stone Tao (ManiSkill author, discloses competing interest), December 2024, secondary; corrected Genesis benchmark numbers, camera-on speed, ManiSkill/SAPIEN is PhysX-based, later Genesis fixes noted
7. [bulletphysics/bullet3](https://github.com/bulletphysics/bullet3) — GitHub README; PyBullet recommended interface, issue tracker closed
8. [Installing Gazebo with ROS](https://gazebosim.org/docs/latest/ros_installation/) — Open Robotics; ros_gz bridge, recommended Gazebo release per ROS 2 release
9. [MuJoCo XML reference (source)](https://raw.githubusercontent.com/google-deepmind/mujoco/main/doc/XMLreference.rst) — Google DeepMind; option timestep default 0.002 s

## Sim-to-real transfer
id: sim-to-real
requires: simulators, reinforcement-learning
aka: sim2real, reality gap, domain randomization, system identification

### Plain
Sim-to-real is the work of taking a skill learned in simulation and making it work on the physical robot. It is like a basketball player who practiced only in an empty home gym and then plays an away game with a loud crowd, a slippery floor, and a slightly different ball. Coaches fix this by practicing with noise, different balls, and different floors, so that game day feels like one more variation.

### Where the analogy breaks
A human player adapts on the spot by understanding what changed; a policy transfers only if the real world falls inside the range it practiced. And practicing with too much variation can make a policy timid and slow, or stop it from learning at all.

### Precise
The reality gap (the systematic differences between a simulator and the real cell) has four main parts. The visual gap covers textures, lighting, reflections, and camera noise. The dynamics gap covers mass, friction, and how stiff contacts are. The actuation gap covers motor delay, gear slack, torque limits, and control rate. The sensing gap covers sensor latency and noise. Researchers evaluating policies in simulation name control and visual differences as the key obstacles [5].

Three families of fixes are used, often together. Domain randomization varies the simulator's parameters at random every episode, so the policy learns to handle a whole range and treats reality as one more sample. Tobin et al. trained an object detector only on images with random, deliberately unrealistic textures and got 1.5 cm accuracy on real images [1]. OpenAI's automatic domain randomization widens each range only once the policy copes with it, and was used to solve a Rubik's cube with a robot hand trained entirely in simulation [2]. System identification measures the real robot and sets the simulator to match. A hybrid learns only the part that is hard to model: for the ANYmal walking robot, a neural network trained on real motor data modeled the actuators, including software delays, inside the simulator [3][4]. The third family mixes in real data, for example by fine-tuning the policy on a small set of real episodes.

Without this work, a policy that is perfect in simulation shakes, slips, or misses on hardware. The usual reasons are that it learned to exploit a simulator shortcut, such as contacts that are slightly sticky, or that it never experienced the delay between command and motion that real motors and their software add, which is what the ANYmal actuator model had to capture [4].

### On the cheese plate line
Illustrative plan for training the apple pick in simulation with a vacuum cup. Each episode randomizes slice color (fresh to slightly browned), surface wetness (which changes friction and how well the cup seals), the cold room's LED lighting and a partly fogged lens, tray position by about 10 mm, and vacuum build-up time between 50 and 150 ms. Before go-live, the policy is still tested on a few hundred real slices, because wet-slice suction is exactly the kind of contact a simulator gets wrong.

### Elsewhere
The ANYmal four-legged robot is the standard example. Its walking policy was trained with RL in simulation, with the learned actuator model filling the gap between ideal and real motors [3][4]. On the real robot it tracked speed commands with lower error and lower energy use than the best existing model-based controller, ran up to 1.5 m/s (about 25% above the previous record), and recovered from falls [4].

### Why it exists
Simulation is where RL can afford millions of attempts, but that only pays off if the result works on the real machine. Closing the gap is usually cheaper than collecting the same amount of experience on hardware.

### Connects to
- [[simulators]] — the source of the gap and of the randomization knobs
- [[reinforcement-learning]] — the main producer of simulation-trained policies
- [[servo-drive]] — real drive delays and limits are a large part of the actuation gap
- [[policy-evaluation]] — transfer is only proven by trials on the real robot

### Real products and tools
- **NVIDIA Isaac Lab** — GPU training framework that runs randomized environments in parallel; version 3.0 adds a choice of physics engines [6]
- **Automatic domain randomization (ADR)** — OpenAI's technique of widening randomization ranges as the policy improves [2]
- **SIMPLER** — open-source simulated environments tuned to match real robot setups, with a workflow for building new ones [5]

### Common misconception
**Misconception:** A more photorealistic simulator solves sim-to-real.

**Reality:** Photorealism addresses only the visual gap, and even there deliberately unrealistic random textures can transfer well [1]. Many failures come from dynamics and actuation, such as delays, friction, and contact, which the ANYmal work handled by learning the actuator model from real data instead of rendering better [3][4].

### Key numbers
- Detector trained only on randomized synthetic images: 1.5 cm localization accuracy on real images [1].
- ANYmal after transfer: up to 1.5 m/s, about 25% above the previous record [4].

### Code sketch
```python
# Domain randomization: every episode is a different "plausible world".
# Illustrative ranges for the apple pick station.
import random

def randomize(sim):
    # visual gap
    sim.set_light(intensity=random.uniform(0.5, 1.5), color_temp_k=random.uniform(3000, 6500))
    sim.set_texture("tray", random.choice(texture_bank))
    sim.jitter_camera(pos_mm=random.gauss(0, 3), rot_deg=random.gauss(0, 1))
    sim.set_lens_fog(random.uniform(0.0, 0.3))
    # dynamics gap
    sim.set_friction("apple_slice", random.uniform(0.2, 0.9))     # wet vs dry
    sim.set_mass("apple_slice", random.uniform(0.008, 0.020))     # kg
    sim.set_tray_offset_mm(random.uniform(-10, 10))
    # actuation gap
    sim.set_action_delay_steps(random.randint(0, 3))              # 0-60 ms at 50 Hz
    sim.set_vacuum_rise_time(random.uniform(0.05, 0.15))          # seconds

for episode in range(1_000_000):
    randomize(sim)
    run_episode(sim, policy)            # RL update or data generation, as usual

# Automatic domain randomization: start with narrow ranges and widen one
# only when the policy succeeds often enough at its current edge.
```

### Sources
1. [Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World](https://arxiv.org/abs/1703.06907) — Tobin et al., arXiv 2017; random non-realistic textures, 1.5 cm real-world accuracy
2. [Solving Rubik's Cube with a Robot Hand](https://arxiv.org/abs/1910.07113) — OpenAI, arXiv 2019; automatic domain randomization, policy trained entirely in simulation
3. [Learning agile and dynamic motor skills for legged robots](https://arxiv.org/abs/1901.08652) — Hwangbo et al., Science Robotics 2019 preprint; simulation-trained policy transferred to ANYmal
4. [Learning agile and dynamic motor skills for legged robots (full text)](https://ar5iv.labs.arxiv.org/html/1901.08652) — Hwangbo et al., arXiv full text via ar5iv; actuator net learned on the real robot including control-signal delays, 1.5 m/s on hardware (25% above ANYmal's previous record), lower tracking error, torque, and power than the model-based controller, fall recovery
5. [Evaluating Real-World Robot Manipulation Policies in Simulation](https://arxiv.org/abs/2405.05941) — Li et al. (SIMPLER), arXiv 2024; control and visual gaps as key obstacles
6. [Isaac Lab v3.0.0 release](https://github.com/isaac-sim/IsaacLab/releases/tag/v3.0.0) — NVIDIA, GitHub, October 20, 2026; multiple physics backends (PhysX, Newton)

## Vision-language-action models
id: vla-models
requires: imitation-learning, robot-datasets
aka: VLA, robot foundation model, generalist policy, pi0, OpenVLA, GR00T, Gemini Robotics

### Plain
A vision-language-action model is a robot policy built on the same kind of AI that powers chatbots that can look at pictures. It is like hiring someone who has read much of the internet and seen millions of photos, then giving them an apprenticeship on the robot: they already know what "the green grapes" or "the left pocket" means, and the apprenticeship only has to teach them how to move the arm. You give it an instruction in words, and it moves the robot.

### Where the analogy breaks
The general knowledge helps with recognizing objects and following instructions, but it does not supply physical skill: the model still needs many hours of robot demonstrations, and it can fail in ways no well-read person would. It is also far heavier to run than a small task-specific policy.

### Precise
A VLA (vision-language-action model) is a learned policy made by taking a VLM (vision-language model: a large network pretrained on web images and text so it can answer questions about pictures) and training it further on robot demonstrations so it also outputs actions. Web pretraining is what lets it follow an instruction like "put the green grapes on the left" and recognize objects it never saw on a robot; the robot data teaches the motion.

There are two main ways to get actions out. RT-2 and OpenVLA write actions as tokens (the word pieces a language model emits one at a time): each action dimension is cut into 256 bins and emitted like text [1][2]. This reuses the language model as is, but it is slow at high control rates, and the pi0 authors note that OpenVLA's design does not support action chunks [4]. The other way adds an action head that outputs continuous numbers using diffusion or flow matching (generative methods that start from random noise and refine it over a handful of steps into a smooth chunk of actions). Octo uses a diffusion head [3]. pi0 adds a 300M-parameter "action expert" to a 3B VLM and produces 50-step chunks at up to 50 Hz [4]. NVIDIA's GR00T N1.7 uses a Cosmos-Reason2-2B vision-language backbone (the pretrained network the rest of the model is built on) with a separate action head [7]. Newer systems also plan: pi0.5 first predicts a short text subtask, then the actions for it, inside one model [5].

Size is the cost. The best-known open VLAs have 3-7B parameters, which needs a desktop- or server-class GPU at the robot or a network link to one [2][4][7]; see [[on-robot-inference]]. As of November 2026, the most capable models are not freely available. Google DeepMind's Gemini Robotics 2.5 is early access by waitlist [6], its on-device model goes only to trusted testers [9], and Physical Intelligence has released no weights for π0.7 (April 2026) [10][12], offering hosted fine-tuning and inference through a waitlisted API beta since October 2026 instead [13] [unverified: which model versions the API serves; the company's site returned errors and secondary reports disagree]. The deployments described so far are early partner uses, such as laundry folding and e-commerce order packing, rather than routine factory production [8].

### On the cheese plate line
A VLA fine-tuned on demonstrations from all four ingredient pick stations (grapes, apples, crackers, cheese) could take an instruction per station, such as "place two cracker packs in the left pocket." The bigger payoff is menu changes. If the airline swaps grapes for figs, the team records new demonstrations and fine-tunes instead of rewriting detection and grasp code; the pi0 paper fine-tuned on about 1-5 hours of data for simpler tasks and 100 or more hours for the most complex, depending on task difficulty [4]. For a fixed menu at 200 plates an hour, though, a small single-task policy such as ACT at the grape station is cheaper to run and easier to validate than a 3B-parameter model that needs a GPU per arm.

### Elsewhere
pi0.5 controlled two-armed mobile robots doing household tasks, such as tidying kitchens and bedrooms, in homes that were not in its training data [5]. Its mobile training data came from about 400 hours of robots working in about 100 homes, and the paper's scaling study shows performance improving as more distinct homes are added [5]. This is the clearest demonstration of what web knowledge plus diverse robot data buys: the robot recognizes "the dishes" in a kitchen it has never seen.

### Why it exists
Training each policy from scratch needs lots of data for every new task and robot. A pretrained VLA brings object and language knowledge from the web plus movement experience pooled across many robots, so a new task needs less data and can be requested in plain words.

### Connects to
- [[imitation-learning]] — VLAs are mostly trained by imitation on demonstrations
- [[robot-datasets]] — pooled multi-robot datasets are what make generalist models possible
- [[on-robot-inference]] — billion-parameter models make timing and compute the hard part
- [[model-companies]] — the companies building and licensing these models
- [[policy-evaluation]] — generalist claims are the hardest to evaluate fairly

### Real products and tools
- **Physical Intelligence pi0, pi0.5, π*0.6, π0.7** — pi0 (October 2024) [4] and pi0.5 (April 2025) [5] have open weights in the openpi repository, which carries an Apache-2.0 license and also ships Google's Gemma Terms of Use; π*0.6 (November 2025) [11] and π0.7 (April 2026) [12] do not [10]; the Pi API beta opened by waitlist in October 2026 [13]
- **Google DeepMind Gemini Robotics** — Gemini Robotics 2.5 is listed as DeepMind's most advanced VLA, early access by waitlist [6]; Gemini Robotics On-Device 2 (July 2026) is distributed only to trusted testers [9]
- **NVIDIA Isaac GR00T N1.7** — 3B-parameter open-weight model for humanoids under the NVIDIA Open Model License [7]; its successor GR00T 2, a model that predicts future video and robot actions together, was announced in November 2026 with code listed for December [14]
- **OpenVLA** — 7B open model from 2024, trained on about 970k real robot demonstrations [2]
- **Octo** — open generalist policy from 2024 in 27M and 93M sizes, pretrained on 800k Open X-Embodiment episodes [3]
- **RT-2** — Google DeepMind's 2023 research model that established the "actions as text tokens" approach [1]

### Common misconception
**Misconception:** A VLA understands the task like a person, so it works on any robot out of the box.

**Reality:** Language and object knowledge transfer from the web; motor skill does not come for free. The Gemini Robotics On-Device 2 model card itself lists limited generalization to out-of-distribution tasks and to robots with many degrees of freedom [9], and every published VLA result above involves robot-specific demonstrations or fine-tuning.

### Key numbers
- Model size: 27M-93M for Octo [3] up to 55B for the largest RT-2 [1]; the best-known open VLAs are 3-7B, such as pi0 3.3B [4], GR00T N1.7 3B [7], OpenVLA 7B [2].
- Control rate: 1-3 Hz for RT-2-55B served from a cloud TPU service [1]; up to 50 Hz for pi0 [4].
- OpenVLA versus RT-2-X: 16.5 percentage points higher absolute success across 29 tasks, with 7x fewer parameters [2].
- Pretraining data: 800k episodes for Octo [3], about 970k demonstrations for OpenVLA [2], over 10,000 hours for pi0 [4].
- pi0.5 mobile data: about 400 hours in about 100 homes [5].

### Code sketch
```python
# One VLA inference call, pi0-style: VLM backbone plus flow-matching action expert.
H, STEPS = 50, 10                          # 50-step chunk, 10 refinement steps

def vla_act(images, joint_state, instruction):
    tokens = vlm.embed(images=images, text=instruction)   # web-pretrained vision-language model
    cache = vlm.prefix(tokens)                            # run once per call, reuse below
    a = randn(H, ACTION_DIM)                              # start from pure noise
    for i in range(STEPS):                                # follow the learned "flow" toward real actions
        tau = i / STEPS
        v = action_expert(a, tau, joint_state, cache)     # predicted direction of change
        a = a + v / STEPS                                 # one small Euler step
    return unnormalize(a)                                 # 50 x ACTION_DIM joint targets

# RT-2 / OpenVLA-style alternative: actions as text tokens.
#   The model writes something like "1 128 91 241 5 101 127 217".
#   Each number is one of 256 bins for one action dimension, generated one token at a time
#   like words, then mapped back to a gripper movement and open/close command.
```

### Sources
1. [RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control](https://arxiv.org/html/2307.15818) — Brohan et al., Google DeepMind, arXiv 2023; actions as text tokens, 256 bins, 55B model at 1-3 Hz in a multi-TPU cloud service, 5B at about 5 Hz
2. [OpenVLA: An Open-Source Vision-Language-Action Model](https://arxiv.org/abs/2406.09246) — Kim et al., arXiv 2024; 7B, about 970k demonstrations, +16.5 points over RT-2-X on 29 tasks
3. [Octo: An Open-Source Generalist Robot Policy](https://octo-models.github.io/) — Octo Model Team, project page; 27M and 93M models, 800k OXE episodes, diffusion decoding
4. [pi0: A Vision-Language-Action Flow Model for General Robot Control](https://arxiv.org/html/2410.24164) — Black et al., Physical Intelligence, arXiv; 3.3B, 300M action expert, 50-step chunks, up to 50 Hz, over 10,000 hours, OpenVLA lacks chunks, fine-tuning sets from about 1-5 hours to 100+ hours
5. [pi0.5: a Vision-Language-Action Model with Open-World Generalization](https://arxiv.org/html/2504.16054v1) — Physical Intelligence, arXiv 2025; subtask then action prediction, about 400 hours in about 100 homes, unseen homes
6. [Gemini Robotics](https://deepmind.google/models/gemini-robotics/gemini-robotics/) — Google DeepMind; Gemini Robotics 2.5 as most advanced VLA, early access via waitlist
7. [NVIDIA/Isaac-GR00T](https://github.com/NVIDIA/Isaac-GR00T) — NVIDIA, GitHub README; GR00T N1.7 general availability, 3B, Cosmos-Reason2-2B backbone, NVIDIA Open Model License
8. [Physical Intelligence pi models: openpi, pi0.7 and Pi API](https://physicalailab.io/en/physical-intelligence-pi-models-openpi-api/) — Physical AI Lab, secondary summary as of November 2026; partner deployments (laundry folding, e-commerce order packing)
9. [Gemini Robotics On-Device 2 model card](https://deepmind.google/models/model-cards/gemini-robotics-on-device-2/) — Google DeepMind, July 2026; trusted testers only, stated limitations
10. [Physical-Intelligence/openpi](https://github.com/Physical-Intelligence/openpi) — Physical Intelligence, GitHub README; open checkpoints are π0, π0-FAST, and π0.5 only, Apache-2.0
11. [π*0.6: a VLA That Learns From Experience](https://arxiv.org/abs/2511.14759) — Physical Intelligence, arXiv, November 2025; model date, RL from deployment data
12. [π0.7: a Steerable Generalist Robotic Foundation Model with Emergent Capabilities](https://arxiv.org/abs/2604.15483) — Physical Intelligence, arXiv, April 16, 2026; model date
13. [Physical Intelligence Opens API Beta for Robot Model Training and Inference](https://www.humanoidsdaily.com/news/physical-intelligence-api-beta-robot-training-inference) — Humanoids Daily, October 14, 2026, secondary; API beta announced October 13, 2026, hosted fine-tuning and inference, waitlist
14. [GR00T 2](https://research.nvidia.com/labs/gear/gr00t-2/) — NVIDIA GEAR lab research page, November 2026; world-action model predicting video and actions together, code listed for December

## Robot datasets and data collection
id: robot-datasets
requires: imitation-learning
aka: demonstrations, episodes, teleoperation data, Open X-Embodiment, DROID, LeRobotDataset, RLDS

### Plain
A robot dataset is a library of recorded practice runs: for each attempt at a task, what every camera saw, where every joint was, and what command was sent, captured many times a second. It is like a driving school that films every lesson from inside the car and logs the steering wheel and pedals at each moment, so that future students can study them. Each hour of footage needs a car, an instructor, and a planned route, and most robot recordings are made the same way, with a person remotely steering the robot through the task.

### Where the analogy breaks
A student can reason about a road they never saw on film; a policy has a blind spot wherever the recordings are silent, such as rare failures, recoveries, or a new grape variety. And every driving-school car has the same wheel and pedals, but robots differ in cameras, joint counts, and recording rates, with no single standard format, so pooling datasets takes conversion work.

### Precise
An episode is one attempt at a task from start to end. A frame (or timestep) is one synchronized snapshot inside it, holding the observation (camera images plus proprioception, the robot's own joint readings) and the action (the command sent at that moment, usually the target joint positions). Each episode also carries metadata: the task described in words, the frame rate, the robot type, and ideally a success label. Most data are collected by teleoperation, for example a leader arm whose joint positions become the follower's commands, which is how LeRobot's recording tool works with its SO-101 arm pair [3].

Scale has grown quickly. Google's RT-1 used over 130k episodes collected with 13 robots over 17 months [5]. Open X-Embodiment pooled 60 existing datasets into over 1M real trajectories from 22 robot types, covering 527 skills [1]. DROID collected 76k trajectories (350 hours) in 564 scenes with one robot model across 13 institutions over 12 months [2]. Physical Intelligence trained pi0 on over 10,000 hours, of which its own data were 903M timesteps across 7 robot configurations, and open datasets were only 9.1% of the mix [4].

Formats matter more than they sound. LeRobotDataset v3.0 stores small, high-frequency numeric signals (states, actions, timestamps) in Parquet (a column-based table file format), camera frames as MP4 video split per camera, and metadata as JSON or Parquet: meta/info.json holds the schema, frame rate, and file path templates; meta/stats.json holds normalization statistics (the average, spread, minimum, and maximum of each signal, used to rescale inputs to similar sizes before training); meta/episodes/ records where each episode starts and ends inside shared files [3]. Many episodes share each file, which keeps millions of episodes manageable and lets training stream directly from the Hugging Face Hub [3]. DROID loads through TensorFlow Datasets [2]. Common ways data go wrong include cameras and joint readings recorded tens of milliseconds apart, missing success labels, and robots with different action layouts (different numbers of joints, joint angles versus gripper pose, absolute versus relative). pi0 handles the differing sizes by padding every robot's action vector to 18 numbers [4].

### On the cheese plate line
Illustrative collection plan for the grape pick: record about 200 episodes, the same demonstrations the imitation learning plan calls for, each one pick-and-place of a single bunch. Every frame, 50 times a second, stores the overhead and wrist camera images (saved as MP4 video), the six joint angles and gripper state (saved in Parquet), and the command from the operator's leader arm. Cameras and joints share that one rate because LeRobotDataset records a single frame rate in meta/info.json and each added frame holds the images and joint readings together [3]. Each episode is labeled with the task text and with pass or fail from the inspection camera. The plan covers red and green grapes, both shifts, and three operators, because a dataset recorded by one person on one morning teaches one person's habits under one light.

### Elsewhere
DROID sent the same robot setup, a Franka Panda arm with two adjustable ZED 2 stereo cameras and a wrist-mounted ZED Mini, to 564 scenes across 13 institutions over 12 months [2]. The point was scene diversity: kitchens, offices, and labs with different lighting and clutter, instead of one tidy lab bench. That diversity is what generalist policies need, and what a single-site collection cannot provide.

### Why it exists
A learned policy can only be as good as its data, and robots cannot scrape action data from the web: every hour needs a robot, an operator, and someone to reset the scene. Shared datasets and formats let many labs pool that expensive effort.

### Connects to
- [[imitation-learning]] — datasets are its training input
- [[vla-models]] — generalist models depend on pooled multi-robot data
- [[teleop-modes]] — how most demonstrations are recorded
- [[data-pipelines]] — moving, cleaning, and versioning recorded episodes at scale
- [[telemetry-logs]] — production logs can become training data if recorded in the right format

### Real products and tools
- **LeRobotDataset v3.0** — Hugging Face's open format: Parquet tables, MP4 video per camera, JSON and Parquet metadata, streaming from the Hub; included in lerobot 0.4.0 and later [3]
- **Open X-Embodiment** — pooled dataset of 60 datasets, 22 robot types, over 1M trajectories, from a collaboration of 21 institutions [1]
- **DROID** — 76k-trajectory Franka Panda dataset collected in 564 scenes [2]
- **lerobot-record and dataset viewers** — LeRobot's recording command and visualization tools, including a browser viewer and Rerun or Foxglove playback [3]

### Common misconception
**Misconception:** Robot data is like web data: just collect more and models will get better.

**Reality:** Every robot hour is physically expensive, and Open X-Embodiment, a landmark pooled dataset, holds about a million trajectories [1], which is why VLAs borrow knowledge from web-pretrained models instead. More hours of the same narrow scene add little; diversity of scenes, objects, and operators is what the DROID collection was built to provide [2].

### Key numbers
- Open X-Embodiment: over 1M trajectories, 22 robot types, 527 skills, 60 source datasets [1].
- DROID: 76k trajectories, 350 hours, 564 scenes, 86 tasks [2].
- RT-1: over 130k episodes, 13 robots, 17 months [5].
- pi0 training mix: over 10,000 hours, with open-source data 9.1% of it [4].

### Code sketch
```python
from lerobot.datasets import LeRobotDataset

# --- Recording: what a teleoperation session writes (simplified from the LeRobot docs) ---
ds = LeRobotDataset.create(...)            # repo id, fps=50, feature names, shapes, types
for episode in range(num_episodes):
    while not operator_pressed_done():
        ds.add_frame({
            "observation.images.wrist": wrist_cam.read(),      # goes into MP4 shards
            "observation.images.overhead": top_cam.read(),
            "observation.state": follower.joint_positions(),   # 6 joints + gripper, goes into Parquet
            "action": leader.joint_positions(),                # what the human commanded
            "task": "pick one grape bunch, place it front-left",
        })
    ds.save_episode()                      # records where this episode starts and ends
ds.finalize()                              # closes Parquet writers; skip it and files are corrupt
ds.push_to_hub()

# --- Training read: one sample = current observation + the next 1 s of actions ---
fps = 50
ds = LeRobotDataset("my-org/grape-pick",
                    delta_timestamps={"action": [i / fps for i in range(50)]})
sample = ds[1234]                          # sample["action"] has shape (50, 7): a ready-made chunk
```

### Sources
1. [Open X-Embodiment: Robotic Learning Datasets and RT-X Models](https://robotics-transformer-x.github.io/) — Open X-Embodiment Collaboration, project page; 22 embodiments, 1M+ trajectories, 527 skills, 60 datasets
2. [DROID: A Large-Scale In-the-Wild Robot Manipulation Dataset](https://droid-dataset.github.io/) — DROID team, project page; 76k trajectories, 350 hours, 564 scenes, 86 tasks, 13 institutions, cameras, TFDS loading
3. [LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/lerobot-dataset-v3) — Hugging Face LeRobot docs; file layout, Parquet and MP4, metadata files (one FPS per dataset in meta/info.json, mean/std/min/max in meta/stats.json), streaming, recording API, finalize
4. [pi0: A Vision-Language-Action Flow Model for General Robot Control](https://arxiv.org/html/2410.24164) — Black et al., Physical Intelligence, arXiv; over 10,000 hours, 903M timesteps, 9.1% open data, 18-number padding
5. [RT-1: Robotics Transformer for Real-World Control at Scale](https://robotics-transformer1.github.io/) — Google, project page; 130k+ episodes, 700+ tasks, 13 robots, 17 months

## Evaluating policies
id: policy-evaluation
requires: learned-policy
aka: success rate, benchmarks, confidence interval, real-world evaluation

### Plain
Evaluating a policy means measuring how often, and how well, it does the job, in a way you can trust. It is like an election poll: asking 20 people tells you very little, so pollsters ask many people, pick them to match the real population, and report a margin of error. Robot policies need the same treatment: many trials, under conditions that match real use, with an honest range around the result.

### Where the analogy breaks
A poll asks the same question every time; robot trials differ in object placement, lighting, and wear, and a single success percentage hides whether failures were harmless near-misses or crushed product. And unlike voters, a policy can change behavior after a model update in situations nobody re-tested.

### Precise
The basic metric is success rate over N trials, but the number means little without the success criteria, the starting conditions, the number of trials, a description of failures, and some statistics. Kress-Gazit et al. point out that robot learning papers often omit exactly these [1]. Statistics matter because N is small. A success rate is a binomial proportion (successes out of independent tries), and the Wilson score interval (a formula for the plausible range of the true rate that behaves well with small N) is preferred over the naive formula, which breaks down for small samples and rates near 0% or 100% [7][4]. By that formula, 16 successes out of 20 (80%) is consistent with a true rate anywhere from about 58% to 92%. With zero failures in n trials, the "rule of three" says the true failure rate is plausibly as high as 3/n, so 100 clean trials only show failures below about 3% [4].

Comparing two policies fairly means the same starting conditions for both, randomized order, and ideally an evaluator who does not know which policy is running. Useful extra metrics include partial-progress scores, cycle time, and interventions (how often a human must step in). Real-robot trials are the gold standard but slow, so cheaper stand-ins exist. SIMPLER builds simulated versions of real setups and reports a strong correlation between simulated and real results [2]. Fixed simulated benchmarks saturate: on LIBERO, OpenVLA-OFT raised average success from 76.5% to 97.1%, leaving little room to tell good policies apart [5]. For generalist policies, RoboArena replaces a fixed task list with crowdsourced, double-blind pairwise comparisons: over 600 real-robot episodes comparing 7 policies, run by evaluators at 7 institutions [3].

In production the question changes from "does it work?" to "what does it cost?" The relevant numbers are throughput, rework per hour, interventions per shift, product damage, and the effect on overall equipment effectiveness (a standard factory score that multiplies the share of time the line runs, its speed against the ideal, and the share of good output). Those numbers belong in the acceptance tests agreed before go-live.

### On the cheese plate line
At 200 plates an hour, a grape pick that succeeds 99% of the time leaves 2 plates an hour for rework, while 95% leaves 10. To claim at least 99% with reasonable confidence, the rule of three says about 300 consecutive successes are needed, since 3/300 is 1% [4]. The test plan spreads those trials across grape varieties, tray positions, and a fogged lens at start of shift. It also logs failures by type, because a missed grasp that retries costs seconds while a crushed bunch costs product. The whole suite reruns after every model update, before the update reaches the line.

### Elsewhere
Google's RT-1 shows why one headline number misleads. It succeeded on 97% of the 700+ instructions it was trained on, but on 76% of unseen instructions, 83% with distracting objects added, and 59% when only the background changed [6]. A buyer who saw only "97%" would badly misjudge how it handles a new warehouse with different walls.

### Why it exists
Robot trials are noisy, slow, and expensive, so small trial counts and unstated conditions routinely produce wrong conclusions. A model update can also make things worse in ways nobody notices without a fixed test suite.

### Connects to
- [[acceptance-tests]] — where agreed success criteria become contractual
- [[simulators]] — cheaper but only partly trustworthy evaluation
- [[inspection]] — an automatic judge of success on a production line
- [[remote-updates]] — every new model version needs re-evaluation before rollout
- [[oee]] — the production metric that policy reliability ultimately feeds

### Real products and tools
- **SIMPLER** — open-source simulated evaluation environments matched to common real robot setups [2]
- **RoboArena** — distributed, double-blind, pairwise real-world evaluation network built on the DROID platform [3]
- **LIBERO** — simulated manipulation benchmark widely used to report VLA results, now close to saturated [5]

### Common misconception
**Misconception:** A paper's 90% success rate means 90% on my line.

**Reality:** The number depends on how many trials were run, what counted as success, and how similar the test scenes were to the training scenes, and papers often omit these [1]. RT-1's own success rate drops from 97% to 59% when only the background changes [6].

### Key numbers
- 16 successes out of 20: 95% Wilson interval of about 58-92% [4].
- Zero failures in n trials: failure rate plausibly up to 3/n, so about 300 clean trials to support a 1% failure rate [4].
- RT-1: 97% seen, 76% unseen instructions, 83% with distractors, 59% with new backgrounds [6].
- LIBERO average: 76.5% (OpenVLA) to 97.1% (OpenVLA-OFT) [5].
- RoboArena: over 600 pairwise episodes, 7 policies, 7 institutions [3].

### Code sketch
```python
import math, random

def wilson(successes, n, z=1.96):              # 95% interval for a success rate
    p = successes / n
    denom = 1 + z * z / n
    center = (p + z * z / (2 * n)) / denom
    half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denom
    return center - half, center + half

# Written-down starting conditions, shared by every policy under test.
conditions = [(variety, spot, lens)
              for variety in ("red", "green")
              for spot in ("front-left", "front-right", "back")
              for lens in ("clear", "fogged")]                 # 12 combinations
results = {"policy_A": [], "policy_B": []}

for rnd in range(25):                          # 25 rounds x 12 conditions = 300 trials each
    for cond in conditions:
        for name in random.sample(list(results), k=2):         # random order; evaluator blind
            reset_station(cond)
            out = run_trial(name, timeout_s=18)                 # one plate's takt time
            results[name].append((cond, out.success, out.failure_type, out.cycle_s))

for name, rows in results.items():
    k = sum(1 for _, ok, _, _ in rows if ok)
    lo, hi = wilson(k, len(rows))
    print(name, f"{k}/{len(rows)}", f"95% interval {lo:.1%} to {hi:.1%}")
    # also report: success per condition, failure types, median cycle time
```

### Sources
1. [Robot Learning as an Empirical Science: Best Practices for Policy Evaluation](https://arxiv.org/abs/2409.09491) — Kress-Gazit et al., arXiv 2024; papers omit runs, conditions, criteria, failures, statistics
2. [Evaluating Real-World Robot Manipulation Policies in Simulation](https://arxiv.org/abs/2405.05941) — Li et al. (SIMPLER), arXiv 2024; simulated environments with strong sim-real correlation
3. [RoboArena: Distributed Real-World Evaluation of Generalist Robot Policies](https://arxiv.org/abs/2506.18123) — arXiv 2025; double-blind pairwise evaluation, 600+ episodes, 7 policies, 7 institutions
4. [Binomial proportion confidence interval](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval) — Wikipedia, secondary; Wilson score interval formula, weakness of the normal approximation near 0 or 1, rule of three
5. [Fine-Tuning Vision-Language-Action Models: Optimizing Speed and Success](https://arxiv.org/abs/2502.19645) — Kim et al. (OpenVLA-OFT), arXiv 2025; LIBERO 76.5% to 97.1%, 26x throughput
6. [RT-1: Robotics Transformer for Real-World Control at Scale](https://robotics-transformer1.github.io/) — Google, project page; 97% seen tasks, 76% unseen instructions, 83% distractors, 59% backgrounds
7. [Confidence intervals, section 7.2.4.1](https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm) — NIST/SEMATECH e-Handbook of Statistical Methods; Wilson method recommended, normal-approximation limits inaccurate for small samples

## On-robot inference
id: on-robot-inference
requires: learned-policy, onboard-compute
aka: edge inference, inference latency, control rate, asynchronous execution, real-time chunking

### Plain
On-robot inference means running the trained policy on a computer at the robot, fast enough to keep the arm moving smoothly. It is like reading a story aloud: your voice has to keep a steady pace, so your eyes run a few words ahead, and you speak words you read a moment ago while your eyes take in the next ones. A robot policy works the same way: the arm plays out movements that were already planned while the computer works out the next batch.

### Where the analogy breaks
A reader's eyes keep scanning, but a robot policy takes one snapshot, plans about a second of motion from it, and plays out part of that plan without looking again, so it notices a change only at its next snapshot. And a reader who loses their place can simply pause, but a robot whose next plan arrives late needs a defined, safe fallback, or the arm stops abruptly or jerks when the late plan lands.

### Precise
Two numbers must be kept apart. The control rate is how often new targets go to the drives: 20 Hz for pi0 on UR5e and Franka arms, 50 Hz on its other robots [1]. The inference latency is how long one pass through the network takes: about 73 ms for pi0 on an RTX 4090 GPU at the robot, or 86 ms when the GPU sits on another machine across the network [1]. Since 73 ms is longer than one 20 ms control tick on a 50 Hz robot, the network cannot run every tick. Action chunking solves this: on its 50 Hz robots pi0 runs inference every 0.5 s, after executing 25 of the 50 actions in a chunk, and executes the chunk open-loop (without looking at new camera images) in between [1].

Run naively, this chunk-then-wait cycle pauses the arm during each inference call, or jumps when a new chunk disagrees with the old one. Asynchronous execution computes the next chunk while the current one is still playing. Real-time chunking goes further: it freezes the actions that will execute during the inference delay and fills in the rest to match, which avoids jerky chunk boundaries and keeps success high under large delays, without retraining [2]. SmolVLA ships a similar asynchronous stack that separates action prediction from execution [7].

Where the network runs is an engineering choice. Running at the robot avoids network delay and dropouts; NVIDIA's Jetson AGX Thor module offers up to 2070 FP4 TFLOPS (trillions of low-precision math operations per second, the figure NVIDIA quotes with sparsity) and 128 GB of memory at 40-130 W [4]. On it, GR00T N1.7 runs at about 28 Hz, against about 40 Hz on an RTX PRO 6000 server GPU, both using NVIDIA's TensorRT inference optimizer on NVIDIA's single-request LIBERO benchmark setup [3]. NVIDIA's product page, which calls the model GR00T 1.7, quotes 25 Hz on Jetson Thor with NVFP4 quantization (4-bit numbers) instead [10]; the two figures come from different test setups, so neither is a guarantee for a new robot. Running in a data center allows bigger models but depends on the network: RT-2's 55B model ran in a multi-TPU cloud service at 1-3 Hz [6]. Google's Gemini Robotics On-Device exists specifically to run without a network connection [5]. Common speed-ups include quantization (storing the network's numbers with fewer bits), fewer refinement steps for diffusion or flow heads, and smaller models; OpenVLA-OFT's changes raised action throughput 26x over OpenVLA [8].

### On the cheese plate line
Illustrative setup for the grape pick: the policy sends joint targets at 50 Hz, plans a new 1 s chunk every 0.5 s, and runs on a GPU computer in a sealed enclosure next to the station, which must meet the line's IP67 washdown requirement and shed the heat of a module that can draw 40-130 W [4]. A watchdog checks that a fresh chunk always arrives before the current one runs out. If the GPU stalls, the arm decelerates to a hold, the PLC marks the station faulted, and the plate is flagged for manual completion rather than the whole line stopping.

### Elsewhere
A humanoid running GR00T N1.7 on its onboard Jetson AGX Thor gets about 28 inference calls per second with TensorRT, by NVIDIA's own benchmark [3], with no dependence on warehouse Wi-Fi. A robot in a building with poor connectivity is exactly the case Google cites for running Gemini Robotics On-Device locally [5]. The trade-off is that the largest models, like RT-2-55B, are out of reach on board [6].

### Why it exists
Robots move in real time, and a late command is a wrong command. Running at the robot makes timing predictable and keeps the robot working when the network drops, while chunking and asynchronous execution hide the remaining latency.

### Connects to
- [[onboard-compute]] — the GPU hardware the policy runs on
- [[latency-budget]] — inference delay is one line item in the end-to-end budget
- [[watchdogs]] — the fallback when a fresh chunk does not arrive in time
- [[control-loops]] — the faster drive loops that track each target between policy updates
- [[remote-updates]] — how new model versions reach robots in the field

### Real products and tools
- **NVIDIA Jetson AGX Thor** — Blackwell-based robot computer, up to 2070 FP4 TFLOPS (sparse), 128 GB, 40-130 W [4]
- **NVIDIA TensorRT** — inference optimizer used for GR00T N1.7's published speeds [3]
- **Gemini Robotics On-Device** — Google DeepMind's VLA that runs locally with no network; trusted testers only, including its July 2026 successor On-Device 2 [5][9]
- **LeRobot asynchronous inference (SmolVLA)** — open-source stack that predicts chunks while the robot executes, aimed at consumer GPUs and CPUs [7]

### Common misconception
**Misconception:** If a model takes 73 ms per call, the robot can only be commanded about 13 times a second, so it must move slowly.

**Reality:** Chunking separates the two. The drives receive targets at 50 Hz from the current chunk [1], asynchronous execution computes the next chunk while the current one plays [2], and the motor loops underneath run faster still. What latency limits is reaction time to new events, set by how often a fresh chunk replaces the old one (0.5 s in pi0's setup [1]). Real-time chunking lets that interval shrink, because new chunks can start more often without pauses or jerks at the boundaries [2].

### Key numbers
- pi0 inference: about 73 ms at the robot, 86 ms over the network, on an RTX 4090 [1].
- pi0 re-planning interval: 0.5 s on 50 Hz robots, 0.8 s on 20 Hz robots [1].
- GR00T N1.7: about 40 Hz on RTX PRO 6000, about 28 Hz on Jetson AGX Thor, with TensorRT [3]; 25 Hz on Jetson Thor with NVFP4 quantization on NVIDIA's product page [10].
- Jetson AGX Thor: 2070 FP4 TFLOPS (sparse), 128 GB, 40-130 W [4].
- RT-2 55B: 1-3 Hz from a cloud TPU service [6].

### Code sketch
```python
# Fixed-rate control loop fed by asynchronous chunk inference (pi0-style numbers, 50 Hz robot).
# Real systems put the fixed-rate loop on a real-time controller; Python sleep is for illustration.
import threading, time

CONTROL_HZ, CHUNK, REPLAN_EVERY = 50, 50, 25
DT = 1.0 / CONTROL_HZ
shared = {"chunk": None, "start_tick": 0}
lock = threading.Lock()
tick = 0

def inference_worker():                          # best effort on the GPU, about 70-100 ms per call
    while running:
        obs = robot.snapshot()                   # camera images + joint angles, stamped with the tick
        chunk = policy(obs)                      # 50 x 7 joint targets
        with lock:
            shared["chunk"], shared["start_tick"] = chunk, obs.tick
        wait_until(lambda: tick >= obs.tick + REPLAN_EVERY)

threading.Thread(target=inference_worker, daemon=True).start()

deadline = time.monotonic()
while running:                                   # this loop never waits on the GPU
    with lock:
        chunk, start = shared["chunk"], shared["start_tick"]
    i = tick - start                             # starts near 4, not 0: inference took about 4 ticks,
                                                 # the stale-start problem real-time chunking addresses
    if chunk is None or i >= CHUNK:              # watchdog: no fresh plan in time
        robot.decelerate_to_hold()               # defined fallback; PLC gets a fault bit
    else:
        robot.send_joint_targets(clamp(chunk[i]))  # drive loops track it between ticks
    tick += 1
    deadline += DT
    time.sleep(max(0.0, deadline - time.monotonic()))
```

### Sources
1. [pi0: A Vision-Language-Action Flow Model for General Robot Control](https://arxiv.org/html/2410.24164) — Black et al., Physical Intelligence, arXiv; latency table (73 ms on-board, 86 ms off-board, RTX 4090), control rates, re-planning every 0.5 s or 0.8 s
2. [Real-Time Execution of Action Chunking Flow Policies](https://arxiv.org/abs/2506.07339) — Black, Galliker, Levine, NeurIPS 2025; latency causes pauses or jerky chunk boundaries, real-time chunking generates the next chunk while executing the current one, robustness to inference delay, no retraining
3. [NVIDIA/Isaac-GR00T](https://github.com/NVIDIA/Isaac-GR00T) — NVIDIA, GitHub README; GR00T N1.7 about 40 Hz on RTX PRO 6000 and about 28 Hz on Jetson AGX Thor with TensorRT
4. [NVIDIA Jetson Thor](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/) — NVIDIA product page; 2070 FP4 TFLOPS sparse, 128 GB, 40-130 W
5. [Gemini Robotics On-Device brings AI to local robotic devices](https://deepmind.google/discover/blog/gemini-robotics-on-device-brings-ai-to-local-robotic-devices/) — Google DeepMind blog, June 2025; runs locally without a data connection, low-latency inference, trusted testers
6. [RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control](https://arxiv.org/html/2307.15818) — Brohan et al., arXiv 2023; multi-TPU cloud service, 55B at 1-3 Hz
7. [SmolVLA: A Vision-Language-Action Model for Affordable and Efficient Robotics](https://arxiv.org/abs/2506.01844) — Hugging Face, arXiv 2025; asynchronous inference stack, consumer GPUs or CPUs
8. [Fine-Tuning Vision-Language-Action Models: Optimizing Speed and Success](https://arxiv.org/abs/2502.19645) — Kim et al. (OpenVLA-OFT), arXiv 2025; 26x action generation throughput
9. [Gemini Robotics On-Device 2 model card](https://deepmind.google/models/model-cards/gemini-robotics-on-device-2/) — Google DeepMind, July 2026; runs on local devices, distributed only to trusted testers
10. [NVIDIA Isaac GR00T](https://www.nvidia.com/en-us/industries/robotics/isaac-groot/) — NVIDIA product page; calls the model GR00T 1.7 (model ID GR00T-N1.7-3B), 3B parameters, TensorRT NVFP4 quantization at 25 Hz on Jetson Thor
