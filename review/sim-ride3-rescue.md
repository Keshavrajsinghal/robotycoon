# Review: knowledge/sim/ride3-rescue.md

Reviewer pass against knowledge/09-teleoperation.md (all 8 concepts, read in full),
03-end-effectors.md (soft-gripper), 04-sensors.md (camera-2d), 07-classical-software.md
(state-machines, perception), 10-platform.md (fleet-management), and glossary.md.

What already matched the concept files:
- **Delay model.** Every stop delay traces to area 9's untuned budget: 16.7/15/5 camera, 70 encode, 15 send, 48 network each way, 80 jitter buffer, 8 decode, 18 display, 8 input, 10 controller, 60 smoothing. The ranges are the 0-33 ms frame wait, the 0-16.7 ms refresh wait, and the 213-231 ms reaction time. The meter midpoint is 623.5 ms (range 590-657), and the machine part is 401.5 ms, against area 9's "~402".
- **Other numbers.** These all match: 200 km/ms, 5 ms per 1,000 km, LTE +35 ms (median), 29.5 ms standard deviation, 50.4/15.5 ms G2G, 193 ms/120 ms, 150-200 ms LTE G2G, about 500 ms end to end, 20.8 kb at 1.38 Mb/s, 1.3 Gb/s raw, ITU-T 150/400 ms, telesurgery 100 ms, 3.5 s move-and-wait, GELLO 0.92/0.72, AV1 over 500x, RFC 6298 1 s, 250 ms / 2 s watchdog, 20 Hz heartbeats, 50 mm/s cap, 8 s assist timeout, and Waymo's 150 ms.
- **Unverified claims.** No [unverified] claim is restated.
- **Station and room.** The grape station is named and called a design judgment. No IP rating or room temperature is claimed.
- **Cargo and coverage.** Cargo tags run 22-38 characters and match the drawing list. All 8 area-9 concepts appear.
- **Puzzle savings.** Every useful option's saving equals area 9's untuned value minus its tuned value. Together they reach 110.6 ms for 16 points.

| Location | Problem | Fix |
|---|---|---|
| Puzzle, `more-bandwidth` | Saved 3 ms. But the send stop tells the rider that send time = frame size / uplink rate, so ten times the rate takes 15 ms to about 1.5 ms. The trap contradicted the ride's own formula. | `saves_ms` 13.5. The why now says it only shortens the send stage, and that it overlaps the encoder option. A brute-force check over all 1,024 combinations finds no solution within 12 points that uses a trap. |
| Puzzle, Debrief | Said "Two changes were required". The brute-force check shows lighter smoothing is also in all 5 solutions. | Names encoder and wired uplink as in every solution, and adds that smoothing is also needed in this model. The bandwidth sentence now matches the 13.5 ms value. "Nearly free" became "cheap in this model", since the costs are invented. |
| Puzzle, Debrief | Waymo's "150 ms ... poor for steering" sat next to a 150 ms target. A rider could read that as a contradiction. | Added "(so about 300 ms there and back, twice this puzzle's target)". |
| All questions | The site does not shuffle question options (js/ui/question.js), and 7 of 10 right answers sat in position 1. | Reordered so right answers fall at positions 3, 2, 4, 1, 2, 4, 1, 3, 2, 4. |
| Intro, Precise | "A tangled bunch needs more". Area 9 says a tangled bunch usually needs only a click. | "Most of the time one click is enough. This bunch is knotted to a second one, which a click cannot fix". |
| Intro, Precise | "latency budget", "six-axis arm" and "command bridge" were not defined. | Added plain definitions. The bridge one comes from area 9's "a bridge that forwards operator commands". |
| pick-fails, Question | The right option said "abandon the pick", but the ride goes on to finish this same pick. The retry explanation's "the same tangle tends to fail the same way" is in no concept file. | Changed to "stop the pick". The retry explanation now says an open-ended retry can stall the station within the 18 s takt. |
| capture, Precise | "The stop's range, 20-53 ms, is almost all the frame wait". In fact the spread is all frame wait and the 20 ms is fixed. | Reworded to say exactly that. |
| encode, Precise | "NVIDIA's low-latency recipe drops both". Area 9 says NVIDIA recommends unidirectional B-frames, which the SDK supports only for HEVC. "Two default settings" was also not supported. | The recipe now "leaves out lookahead and avoids the B-frame wait (for H.264 in its SDK, that means no B-frames)". The settings are now "Two settings meant for streaming". WebRTC is now defined on first use. |
| encode, Question | It asked what would cut "the encode delay instead", then listed AV1 as an option. "Make every frame a keyframe" does remove the B-frame wait, so it was arguably right about encode delay alone. | The question now asks which change most likely cuts "the lag". The keyframe explanation admits it removes the future-frame wait, then says why it still loses. |
| send, Precise | "CBR", "intra refresh" and "keyframes" were used without definition in this stop. "Latency-budget" numbers were used but the concept was not listed. | Added definitions. Added `latency-budget` to concepts. |
| network-out, Precise | "intra refresh" and "ping" were not defined. | Added definitions. |
| decode-display, Precise | "LTE" was not defined in this stop. "The range ... is the refresh wait" when only the spread is. | Added "(cellular)" and "The spread in the range". |
| decode-display, Question | One explanation leaned on a claim no concept file makes: "an average hides the queues". | Rewritten from area 9: while uploads fill the link there is no spare capacity, and router buffers fill before any drop. |
| operator, Precise | "held enable button" and "ITU-T G.114" were not explained. | "an enable button that must stay held for any motion". Added a short gloss of G.114. |
| network-back, Plain | Said the command "does not wait behind big pictures". Video flows the other way, so this would mislead a newcomer. | Replaced with: being tiny, it takes almost no time to push onto the link. This follows from the size-over-rate rule at the send stop. |
| robot-executes, Precise | "controlled stop" was not defined. The robot placing the bunch "on its own" after a takeover is a story choice, and was not labeled as one. | Defined it, from area 9's wording. Added "In this ride's design, ... the operator hands control back and the station's own program places it." |

Accepted as written:
- **send uses 15 ms, not area 9's 1-15 ms range.** Area 9's untuned budget row is 15. The range describes different setups, not variation within this one. The stop explains the choice.
- **help-request adds 0 ms, with the reason given.** No concept file gives a queue time.
- **RTP's definition is inferred.** "Standard packet format for live media, each carrying a timestamp" is inferred from RFC 3550's role, the jitter formula, and the code sketch. It is accurate.
- **Wired uplink and the smaller jitter buffer are one option.** Area 9 ties the 15 ms buffer to the wired link.

Checks: `node tools/build-content.mjs --check knowledge/sim/ride3-rescue.md` and the whole-tree check both report 0 warnings, 0 errors.
