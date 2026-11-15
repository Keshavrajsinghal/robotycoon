## Area 9, Teleoperation: analogy and precision review

Scope: all 8 concepts in `knowledge/09-teleoperation.md`. Validation after edits: `node tools/build-content.mjs --check knowledge/09-teleoperation.md` gives 0 warnings, 0 errors, 0 unverified flags.

### Analogies
| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| teleop-modes | rewritten | "Coach on the phone" suggests a live, continuous call with a helper who is watching all the time. That is wrong for remote assist, whose defining traits are that the robot starts the request, sends one snapshot, and nobody watches between requests. Those traits are why one person can cover many robots and a slow link is fine. | The robot texts a helper a photo and a question ("which one do I grab?"), then finishes the job itself. The other mode is taking the wheel and driving through a camera. The "breaks" section now says replies must come in seconds, not hours, and the operator sees late and feels nothing. |
| operator-interfaces | kept | | |
| latency-budget | kept | | |
| video-pipeline | kept (one Plain sentence corrected) | | |
| webrtc | kept | | |
| udp-vs-tcp | kept | | |
| network-impairments | kept | | |
| watchdogs | kept | | |

### Other fixes
- teleop-modes: Defined "closes the feedback loop" in plain words.
- teleop-modes: Rewrote the 1X sentence to follow the order page exactly ("US Deliveries start 2026"; a 1X expert supervises "at scheduled times" on tasks NEO does not know). "User-scheduled" is now cited to Road to VR [6], because the order page does not say who books the sessions.
- operator-interfaces: Defined "dead zone".
- operator-interfaces: The GELLO study had "5 two-armed tasks". The paper says 5 tasks on a two-armed station, one of which (hanging a hat) used a single arm. Corrected.
- latency-budget: The cheese plate example said the untuned 400 ms comes "before the operator even reacts". But that 400 ms includes the command-back stages too, which happen after the reaction. Reworded to: machine delay around the whole loop, on top of the operator's reaction time.
- latency-budget: The tuned 110 ms covers both directions, and it was compared with a "150 ms target" that is ITU-T G.114's one-way guideline. The text now says this outright, in the cheese plate example and in the code-sketch comment. I also checked Nankaku et al.: their delay was applied to both commands and video, and the paper does not say whether its figure is one-way or round trip.
- latency-budget: Defined "refractive index" in plain words, and "jitter buffer" where the cheese plate example first uses it.
- video-pipeline: Plain said "most of its savings come from each frame looking like the one before". That is too strong: each picture is also squeezed on its own (intra coding), and that accounts for a large share of the shrinkage. Now it says the codec shrinks each picture and then makes the stream several times smaller still by sending changes.
- video-pipeline: "Lookahead" was used in the misconception, the latency table and the code, but never defined. Added a definition to Precise, citing the NVENC guide: lookahead buffers frames to judge how hard they are, and NVIDIA leaves it out of its low-latency settings. Updated the description of source [5] to match.
- video-pipeline: Expanded VBV (video buffering verifier).
- video-pipeline: The misconception's "over 500 times slower" AV1 figure now says it came from the 2018 aomenc reference encoder, which the authors noted was not yet optimized for multi-threading. Without that, a reader would think all AV1 encoders are this slow. Updated the description of source [9] to match.
- webrtc: Defined SDP, STUN and SCTP. Replaced "TLS adapted for datagrams" (jargon defined with jargon) with a plain description of DTLS.
- udp-vs-tcp: Defined "segment" and "datagram".
- udp-vs-tcp: The cheese plate example made "40 ms round trip" sound like a property of the plant Wi-Fi. It now says that is the round trip to the operator. "Four or so commands" became "at least four", because one round trip is the best case. The code-sketch timeline is now labeled as the best case.
- network-impairments: Elsewhere called the LTE study "teleoperated vehicles". The study actually measured connected-car round trips to a fog server, not teleoperation. Reworded, and the spread is now stated as the 29.5 ms standard deviation.
- watchdogs: "Distance covered equals speed times timeout" left out the braking distance. Precise and Key numbers now say it is the motion before the stop begins, plus braking distance.
- watchdogs: The cheese plate example said the gripper stays closed so grapes are "not dropped onto the tray", but the tray is where the grapes are supposed to go. It now says "not dropped mid-move onto the tray edge or conveyor".
- Examples and misconceptions: all 8 cheese plate examples match the line (200 plates/hour, 18 s takt, four pick stations, cold room). All 8 Elsewhere settings are real. All 8 misconceptions are beliefs people actually hold, and their Realities are correct after the edits above.

### Spot-checks of the fact check
| Claim | Source opened | Result |
|---|---|---|
| 1X: order page says "US Deliveries start 2026", lists Scheduled Expert Mode, owner books the sessions | [1X order page](https://www.1x.tech/order); [Road to VR](https://roadtovr.com/helper-robot-neo-vr-telepresence/) (secondary, news) | Partial fail. Dates and Expert Mode confirmed. The order page says only "at scheduled times"; "user-scheduled" comes from Road to VR, so the citation is fixed. Web search quota ran out, so I could not check whether deliveries had started by November 2026. The text claims only what the order page says. |
| Waymo: about 70 agents on duty; median one-way 150 ms (U.S.) and 250 ms (abroad); no continuous monitoring; car can reject advice | [Waymo blog, 17 Feb 2026](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | Pass |
| Provost et al.: G2G 193 ms, camera about 120 ms (estimated), monitor 8.3 ms, 20.8 kb at 1376 kb/s about 15 ms, M2M 306 ms, steering about 270 ms (estimated), TCP command packets 10.3 ms, 100 Hz interface, E2E about 500 ms with M2M about 60%, 5G NSA | [arXiv 2602.17381](https://arxiv.org/html/2602.17381v1) | Pass |
| GELLO: 12 participants, 5 two-armed tasks, success 0.92 / 0.72 / 0.63, faster, under $300, Dynamixel, 3D-printed | [arXiv 2309.13037](https://arxiv.org/html/2309.13037v2) | Partial fail: one of the 5 tasks used a single arm. Text corrected. Numbers pass. |
| Verizon Oct 2026 round trips 14 / 33 / 70 / 112 ms | [Verizon IP latency](https://www.verizon.com/business/terms/latency/) | Pass (14.263, 33.354, 70.440, 112.058) |
| Kerbl et al.: LTE G2G 150-200 ms, median 160 ms; LAN about 125 ms; about 35 ms added by network; H.264 over RTSP | [arXiv 2506.13933](https://arxiv.org/html/2506.13933) | Pass |
| Xiao et al.: LTE round trip from a moving car, mean about 82 ms (81.6), SD 29.5 ms | [SECON 2019 author PDF](https://wicon.arizona.edu/sites/default/files/2023-03/2019SECON_AdaptiveFog0.pdf) | Pass. The figure annotation reads "Mean: 81.61", "STD: 29.5x" (read from the PDF's text layer). |
| Waterloo: AV1 saves 9.5% versus HEVC at 2160p; AV1 over 500 times AVC's encoding time | [Li et al. PDF](https://ece.uwaterloo.ca/~z70wang/publications/iciar19_encoderCompare.pdf) | Pass (Table 2 shows -9.5%; text says "over 500 times"). Added the reference-encoder caveat. |
| WebTransport: W3C Candidate Recommendation Snapshot, 30 July 2026; reliable-only over HTTP/2 | [W3C WebTransport](https://www.w3.org/TR/webtransport/) | Pass |
| ITU-T H.264 latest edition 06/2026; H.265 first 04/2013, latest 01/2026 | [H.264 listing](https://www.itu.int/rec/T-REC-H.264); [H.265 listing](https://www.itu.int/rec/T-REC-H.265) | Pass |
| NVENC low-latency list (ultra-low/low tuning, CBR, single-frame VBV, unidirectional B, infinite GOP, intra refresh); unidirectional B "currently supported for HEVC" | [NVENC guide 13.1](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) | Pass. Also confirmed that lookahead buffers frames and is not in the low-latency list. |
| Nankaku et al.: 0-300 ms tested; 100 ms or less acceptable; significant rise from 100 to 150 ms | [PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0274328) (the PMC mirror was blocked by a CAPTCHA) | Pass. Delay was applied to both commands and endoscope video; the paper does not say whether it is one-way or round trip. |
