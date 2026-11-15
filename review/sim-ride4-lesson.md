# Review: knowledge/sim/ride4-lesson.md

Reviewer pass against knowledge/08-robot-learning.md (all), knowledge/10-platform.md (all),
knowledge/09-teleoperation.md (teleop-modes), area 1 (station robot judgment, 16-17 s per cycle),
area 6 (index time), and the now-written knowledge/sim/ride3-rescue.md and ride2-signal.md.

Checked and correct as written: all 10 fixed stop ids in order; every cargo tag at most 40
characters and matching the drawing list (longest: "Sealed update for the first cells", 33);
every number traced to a concept file (83 MB/s, close to 10 TB per shift, 2% / 32 of 1,600, MCAP
default since Iron May 2023, 2 ms MuJoCo step, ACT about 80M parameters / 100k steps / about 50
demonstrations, about 200 grape demonstrations, over 1M Open X-Embodiment trajectories, pi0 over
10,000 hours, 73 / 86 ms, 50 Hz and 0.5 s replanning, 16 of 20 = 58-92%, rule of three and 300
trials, 2 vs 10 plates per hour, 6 GB / 8 min, 1% vs 3% vs 1.2% over 1,600 picks, RT-1 97% / 59%,
16-17 s of each 18 s cycle); the area 8 [unverified] flag on deformable objects in simulators is
kept; station robot called a judgment call from area 1 (intro and next-pick); IP ratings and room
temperature not mentioned, so nothing conflicts with area 6. Puzzle numbers re-checked with the
Wilson formula: tangled 33/60 (43-67%) vs 51/60 (74-92%) and fogged 146/150 (93-99%) vs 131/150
(81-92%) do not overlap, clear lens 147 vs 148 does; the prompt's "larger than chance" holds.
Checks: `--check knowledge/sim/ride4-lesson.md` and `--check` on the whole tree both report
0 warnings, 0 errors.

| Location | Problem | Fix |
|---|---|---|
| Intro, Precise | Said the station "runs a small learned policy, as in ride 2's learned mode", but the now-written ride 3 draws the same station as a classical state machine (DETECT, PLAN, VERIFY) with a perception confidence score. A rider going 3 then 4 meets an unexplained switch. | Added: ride 3 drew a state machine with detect and plan steps; this ride assumes ride 2's learned mode, where one policy replaces image-to-joint-target steps and sequencing, safety circuit and PLC stay (area 8 learned-policy). |
| Intro, Precise | "worth more than an ordinary successful pick" is stronger than area 10 ("often the most valuable footage"). | "often makes it worth more". |
| recording, Question | Premise "The buffer holds 20 seconds" contradicts the stop's Plain ("its last few minutes") and area 10's buffer. | Reframed as a what-if: "Suppose someone had set the buffer to hold only 20 seconds". |
| recording, Question option 3 | Explanation "written out in one go when asked, so what it holds is valid" is a mechanism no concept file states. | Now: a ring buffer drops its oldest data and does not damage what remains; the file is a normal recording of the last 20 s, missing the start. |
| upload, Plain | "far too narrow to send live video" overstated area 10, which says the uplink cannot carry raw video from every station live. | "too narrow to send full camera video from every station live". |
| curation, Precise | "Common faults that get an episode rejected: ... a missing success label." Area 8 lists these as ways data go wrong, not rejection rules, and a missing label is fixed by labeling. "boxes" was undefined. | "Curation also checks for common faults: ..."; defined boxes (rectangles drawn around objects in an image). |
| curation, Question right option | Explanation said a few clean picks "keep ordinary bunches represented", but the ~200 original demonstrations already do that; no concept file gives this reason. | Explanation now rests on area 10: takeovers fill a blind spot; near-duplicates of easy successes add little, so most are dropped. |
| dataset, Plain | "a kind of bunch the library had no example of" is an unsupported absolute (area 8's plan already includes bad-state starts). | "little or no footage of". |
| dataset, Precise | "schema" and "trajectories" used without plain definitions. | Defined both in parentheses. |
| training, Plain | "for each recorded moment, it outputs the move the person made" conflicts with curation also keeping failures and clean autonomous picks (not human moves). | "for each recorded moment of a demonstration or rescue". |
| training, Precise | No "what breaks without this step"; "100k steps" undefined; area 8's vla-models concept was not covered anywhere in the ride. | Added what breaks without retraining; defined steps; added area 8's reason for choosing ACT over a VLA such as 3.3B pi0 (cheaper to run, easier to validate for a fixed menu, no GPU per arm). Added vla-models to concepts. |
| simulation, Precise | "a policy can learn to lean on simulator quirks" applies to policies trained in simulation; this model is trained on real data and only evaluated there. "links" undefined. | "a grasp can look fine in simulation only because of a simulator shortcut, such as contacts that are slightly sticky"; defined links. |
| simulation, Question option 4 | "Sim and real results correlate only when the simulator is matched" is stronger than area 8 (SIMPLER reports strong correlation for matched setups; no "only"). | "They can track real results when the simulator is tuned to match the setup, as SIMPLER reports, but transfer is proven only by real trials." |
| rollout, Precise | "shipped separately from the operating system" dropped area 10's "usually"; no "what breaks without" sentence. | Added "usually"; added area 10's "an update pushed to every station at once turns one bad build into a stopped plant". |
| fleet, Precise | "The viewer shows what the robot believed, such as where it thought the bunch was" contradicts area 8: an end-to-end policy has no detected position or grasp score to inspect. | Viewer now lines up camera images with the joint targets sent; added area 8's point that losing those checkpoints is the main debugging cost. Added learned-policy to concepts. |
| fleet, Question right option | "show what the robot believed" (same issue). | "what the robot saw and did at the failing moment". |
| next-pick, Precise | "drives" and "tick" used before definition (servo drives defined a paragraph later). | Defined servo drives at first use; replaced "one tick" with "those 20 ms". |
| next-pick, Question | Stated as fact that this policy's pass takes longer than 20 ms; no concept file gives inference time for an ACT-sized model. | "Suppose one pass ... takes longer than the 20 ms ..., as pi0's 73 ms does." |
| Puzzle, option 1 why | "Lens fog ... happens in normal running" is not in a concept file. | "one of the conditions the suite was written to cover, so shipping now would put a measured regression on every line." |
| Puzzle, option 2 why | Did not answer the option's own argument ("the simulator ran far more trials"). | Added: more simulated trials shrink luck in the simulated score, not the systematic gap (area 8's definition of the reality gap). |
| Puzzle, option 3 why | "so that gain is not lost" predicts the outcome of a retrain. | "the next run adds what this one lacked, and the rerun suite checks that both cases hold." |
| Puzzle, option 4 why | "A canary is for problems that testing could not find" is not in a concept file. | Now: the suite runs before an update reaches the line and a canary comes after a model passes it (areas 8, 10). |
| Debrief | "the Wilson interval ... is the way to check". | "one way". |

## Open points for the orchestrator (not changed)

- Ride 3 vs ride 4 station software: ride 3 is classical (state machine, perception confidence);
  ride 4 assumes learned mode. Now stated in ride 4's intro. If ride 3 should instead show the learned
  station failing, its pick-fails stop would need to change, not this file.
- Area 10's telemetry-logs cheese example records "the model's chosen grasp" and a vacuum reading at
  the soft-finger grape station. Ride 4 does not repeat either, but area 10 may want a look.
- Uploading 2% of normal picks has no stated purpose in any concept file; the ride states the plan
  without inventing one.
