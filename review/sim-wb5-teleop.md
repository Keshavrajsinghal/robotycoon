# Review: workbench wb5-teleop (fragment for knowledge/sim/workbenches.md)

Independent reviewer pass on the fragment `scratchpad/wb/wb5-teleop.md` (the merge step adds it to
`knowledge/sim/workbenches.md`) and on `js/workbenches/wb5-{teleop,sim,draw}.js` and
`css/modules/wb5-teleop.css`. Checked against area 9's concepts `latency-budget`, `teleop-modes`,
`watchdogs`, `network-impairments`, `operator-interfaces` (plus `webrtc`, `udp-vs-tcp`,
`video-pipeline` for numbers the note cites) and Ride 3's `operator` and `robot-executes` stops.

Checked and correct as written:
- 18 s per plate at 200 plates an hour (teleop-modes). 50 mm/s rescue cap, illustrative
  (operator-interfaces). 250 ms command timeout and 2 s takeover end, illustrative (watchdogs).
  30 fps camera of the untuned setup and 100 Hz commands (latency-budget, webrtc).
- Slider defaults 65 + 45 ms are the tuned budget's video-out and command-back rows (65.3 and 45.0,
  sum 110.3). The 400 ms target is the untuned loop (275.7 + 126.0 = 401.7). 213-231 ms simple
  visual reaction. Glass-to-glass and motion-to-motion definitions. ITU-T G.114 below 150 ms one
  way. RTDE inputs keep their last value. A lost command replaced 10 ms later at 100 Hz.
  12.5 mm = 50 mm/s times 250 ms. Remote assist preferred in deployed fleets (teleop-modes).
- Concept ids are registered (main first). The fragment builds with 0 errors on real knowledge plus
  all six workbench fragments.
- Module matches the agreed design: six-axis arm with soft fingers over a static tote, bunches at
  random angles, stems as grasp points, plate on a belt beside it. No facts in code: on-screen
  strings are UI chrome or status words about the simulation, every model number comes from
  `ctx.wb.data`, and the budget card's kicker is `content.concepts["latency-budget"].title`.

| Location | Problem | Fix |
|---|---|---|
| Module, Cut link (`wb5-teleop.js`) | The button acted on `click`. On desktop, holding an arrow key and clicking it at human pace (100 ms press) moved focus off the pad on mousedown. That released the keys and sent a stop before the click cut the link. Result: watchdog "moved 0-1 mm", and with the watchdog off nothing drifted. In Chrome's touch emulation, a second finger's tap while the first holds the pad never became a click, so the link was never cut. Either way the cut-link item in What to notice could not happen. The author's check used Playwright's instant click, which hides the problem. | Cut link now toggles on `pointerdown` (with `preventDefault`, so focus stays on the pad). Keyboard and scripted clicks (`detail` 0) still toggle it. Verified: desktop arrow plus mouse gives a 12-13 mm stop, or with the watchdog off a 469 mm drift to the zone limit. Phone with two fingers gives a 13 mm stop, or a drift. Enter, Space and a plain click still toggle. |
| Module, zone message (`wb5-sim.js`) | "With no watchdog the arm kept its last command ... until its zone limit stopped it" fired whenever the arm was held at a zone edge with stale commands, even with the watchdog on (in the 30-250 ms before it trips). | Fires only when the watchdog is off. Verified that a link cut while pressing on a zone edge, with the watchdog on, now reports only the watchdog stop. |
| Precise, p1 | "The round trip on the meter" can be read as Ride 3's meter (624 ms with reaction). "The setup Ride 3's meter adds up" has the same problem. "Command bridge" was not defined. | "The round trip shown here". "The setup Ride 3 follows". Bridge defined as in Ride 3. |
| Precise, p2 | "A push held until you see the arm move has already carried it about 20 mm". When you see it move, the arm has moved only for the video delay. 20 mm (cap times round trip) is the distance by the time your release arrives. | "If you hold a push until you see the arm move and then let go, the arm has gone about 20 mm by the time your release reaches it (50 mm/s times 400 ms)". |
| Precise, p2 | "At long delays, operators fall back to moving, then waiting". The source (latency-budget, the 1970 MIT study at 3.5 s) says delays of seconds. Next to 400 ms, "long" implied it applies here. | "At delays of seconds". |
| Precise, p2 | The pad has a dead zone, and operator-interfaces says velocity devices need one, but the text never said so. | One sentence added (dead zone defined in plain words). |
| Precise, p3 | "A lost or late video frame leaves the picture frozen" overstated the model. It also left out real video, where a loss damages later frames until intra refresh (network-impairments). "Controlled stop" was not defined. | Says what the model does and what real compressed video adds. Controlled stop is defined as braking to a halt and holding position (watchdogs, Ride 3). |
| How to use | Did not say how to cut the link while the arm moves. It takes a held arrow key or a second finger. Arrow keys also work with the pad focused, not only "with the video selected". Live view was not flagged as something a real operator lacks. With it on, the video delay drops out of the task. | New bullet for the watchdog experiment. "Click the video or the pad and hold the arrow keys". Live view "which a real operator never sees". |
| What to notice, 1 | "At 110 ms ... with little trouble" and "uses up much of the 18 s" were not what the model does. Emulated learner on the real pad handlers, 3 tote layouts, 200 ms reaction where stated. An eager hand (gain 4/s) saves at 110 ms in 5-6 s (with a 200 ms reaction added, on 2 of 3 layouts) but fails every time at 400 ms. A patient hand (0.8-2/s) saves at 400 ms in 6-12 s, and at 110 ms in 6-7 s. | "A quick hand" overshoots at 400 ms. "Slowing down near the stem, or moving and then waiting to see the result, still works at 400 ms; it just takes longer." |
| What to notice, 3 | "Stops about 12.5 mm after the last command" holds only at full speed. The model stops instantly, but a real arm adds braking distance (Ride 3 robot-executes). "Zone limit" was not defined. | Added "at full speed", the braking caveat, and "the robot's own zone limit (the edge of the area its controller allows)". |
| What to notice, 4 | "Is far longer than that normal jitter, or it would stop the arm" read as a non sequitur. | "Is set far longer than this normal jitter; a timeout shorter than the jitter would stop the arm for no reason" (watchdogs). |
| Data, note | `camera_fps` stays at the untuned 30 fps while the defaults model the tuned (60 fps) budget, and the note did not say so. The 29.5 ms standard deviation is for round trips from a moving car. | Note calls the fixed 30 fps a simplification, says what the 29.5 ms is, and cites udp-vs-tcp too for the 100 Hz rate. |

Lesson check with real content plus the fragment (Playwright, Chrome):
- Start: paused, 110 ms round trip, not solved, modal has no `data-solved`.
- Naive attempt: grip at the default delay gives "lowest round trip 110 ms, target 400" and is not
  solved. Fast driving at 400 ms oscillates until the plate passes, on all 3 layouts tried.
- Assist at 400 ms: one stem tap grips in about 2.5-3 s, also at 450 ms with 60 ms jitter and 20%
  loss. The bench then shows solved and the modal gets `data-solved`. A patient direct pick at
  400 ms also solves.
- `wbTest().solve()` returns true, sets `data-solved` and stores the state, including under
  reduced motion.
- Watchdog on: a cut gives a controlled stop about 13 mm after the last command, then the takeover
  ends at 2 s. Watchdog off: the arm drifts 469 mm until the zone limit stops it. With 60 ms
  jitter and 20% loss there are no spurious watchdog stops, late packets show in the network view,
  and frame age varies from 33 to 150 ms.
- Desktop 1440x900 (mouse and keyboard), phone 390x844 (touch, CDP touch events), 360x640 dark:
  no horizontal overflow and no console errors. Screenshots looked at, including Precise beside
  the bench. `node tests/smoke.mjs --fixture --only=ride3` passed after the module edits.

Not changed, noted:
- `bunches_per_tote` is 4, but with a 0.6 x 0.4 m tote and the spacing rules only 3 fit for
  seeds 11 and 12 (4 for seed 13). The schema allows "fewer fit if crowded", and the text gives no
  count.
- With "Show robot's live view" on, direct control at 400 ms is easy: the real position shows
  without video delay, and a pick still counts as solved. Assist solves the bench anyway, so this
  opens no new shortcut. The text now says a real operator never sees this view.
- Once the sliders are at 400 ms or more, Assist solves the bench in seconds. That is the intended
  contrast (remote assist is robust to delay), so the bench is easy once understood.
- With the link still cut, the takeover-end message replaces the watchdog-stop message after 2 s.
  Both are true.
- Full real-content smoke not run: the real `js/content.js` has no workbenches until the merge.
