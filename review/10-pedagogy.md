## Area 10, Platform: analogy and precision review

Scope: all 5 concepts in `knowledge/10-platform.md`. `node tools/build-content.mjs --check knowledge/10-platform.md` passes with 0 warnings and 0 errors.

### Analogies

| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| fleet-management | kept (Plain); "Where the analogy breaks" rewritten | The old breaks text said the operations center "does not steer the planes" while the fleet manager does. A reader would then predict that the fleet manager drives the robots and keeps them safe. It does neither: each robot drives itself, a VDA 5050 robot that loses its link finishes the route it was already cleared for, and VDA 5050 and ISO 21423 both say they set no safety requirements. | Same airline operations center. The breaks text now separates the ops center from air traffic control: a fleet manager does both jobs, but it still does not steer and is not the safety system. |
| telemetry-logs | kept (one overclaim fixed) | "Keeps everything the robot sensed and every command it sent" suggests a recording captures everything automatically. A bag holds only the topics someone chose to record, and the breaks text now says so. | Same flight data recorder. |
| visualization-tools | kept | n/a. The breaks text (belief vs. reality) was already right. Added that viewers such as RViz2 are mostly used live, which the "replay" picture hides. | Same instant replay screen. |
| remote-updates | kept (extended) | n/a. Added the shadow stage to the analogy (cook the new dish next to the old one without serving it) because the cheese example opens with shadow mode. Rewrote the unclear "a robot cannot always reach home" as: nobody is on hand when the update gets cut off halfway. | Same restaurant recipe rollout, now with a shadow step. |
| data-pipelines | kept | n/a. The film editing room analogy and its breaks text (bloopers are the most valuable footage; most editing is automated) are accurate. | Same film studio editing room. |

### Other fixes

- intro: "keeps the last minute" became "the last few minutes", to match the corrected buffer below. "Tries a new model on one station before the rest" assumed more than one grape station, but the line has one. It now says the model runs alongside the old one before it drives the arm.
- telemetry-logs (cheese example): the 60-second snapshot buffer contradicted the line's own timing. On an indexing line with an 18 s takt, a tray needs at least four moves (about 72 s) to get from grapes past apples, crackers, and cheese to inspection, so the grape station's evidence would already be overwritten. The buffer is now 3 minutes, with the arithmetic shown. Also added that 3 minutes of raw frames is about 15 GB of memory, so stations buffer the compressed image stream.
- telemetry-logs (Precise): "index (an optional summary section)" defined one piece of jargon with another. It now reads: summary section holding an index (a table of contents saying which chunk covers which time range). Also defined SQLite, zstd/lz4, and the snapshot service. Noted that the ring buffer's size is set by a cache-size setting (rosbag2 README).
- fleet-management (Precise): defined telemetry intake, configuration as code, and fleet adapters, which were used without definitions.
- fleet-management (cheese example): tied the 10 wedges a minute to the 18 s takt (one wedge every 6 s), so it lines up with area 6 and area 11.
- fleet-management (Sources): descriptions of [4] and [11] now list the newly cited facts: the connection-loss rule in 4.1, "no safety requirements" in section 2, and ISO 21423 being "not safety-related".
- visualization-tools (Precise): defined plugins and transform tree.
- remote-updates (Precise): added the missing "what breaks without it" line. Defined weights file. Noted that Mender's retry-later hold only lasts up to a configured timeout. Moved the UN R156 sentence out of Precise, because the Elsewhere example said the same thing almost word for word.
- remote-updates (Elsewhere): kept UN R156 but made it add something new. It now cites 7.2.2.1.2 (enough power to finish or recover) and 7.2.2.1.3 (an update that could affect safety runs only in a safe vehicle state, the car version of waiting until the arm is stopped). Both were checked on EUR-Lex. The source [5] description was updated.
- remote-updates (cheese example): the canary had no control group. With one line, the comparison has to be the old model's miss rate on recent shifts. With more lines, the other lines' grape stations would be the control.
- data-pipelines (Precise): "Parquet (column-oriented tables)" was jargon defined with jargon. It now reads: a table file format that stores data column by column, so one field can be read across millions of rows quickly. HG-DAgger now explains the mechanism. In plain DAgger the robot keeps control while the expert labels its actions, which hurts both safety and label quality. In HG-DAgger the expert takes over, and only labels from the stretches when the expert is in control are added to the training data. Checked against the abstract and the method section on ar5iv. The source [2] description was updated.
- misconceptions: all 5 checked. Each is a belief people really hold, and each Reality is correct. No changes.

### Spot-checks of the fact check

| Claim | Source opened | Result |
|---|---|---|
| OpenRobOps released as open source under Apache 2.0, September 2026 (verified) | [The Robot Report, Sep 15 2026](https://www.therobotreport.com/inorbit-ai-releases-openrobops-iso-21423-reference-implementation/) | Pass. "Distributed under the Apache 2.0 license". This article never says "outbound", but [2] supports that. |
| Outbound-only connections (verified) | [InOrbit blog, Feb 3 2026](https://www.inorbit.ai/blog/openrobops-announcement) | Pass. "Outbound-only MQTTS or WebSockets". |
| InOrbit says teams spend months building infrastructure (verified) | [InOrbit blog](https://www.inorbit.ai/blog/openrobops-announcement) | Pass. The source combines two sentences: "waste months reinventing the wheel" and "forced to build custom cloud infrastructure, communication protocols, and database schemas". It is a vendor claim, and the text already frames it as "InOrbit describes". |
| Ground Control is the fully managed cloud tier (verified) | [The Robot Report, Feb 4 2026](https://www.therobotreport.com/inorbit-adds-steve-cousins-board-offers-openrobops-open-source-fleet-manager/) | Pass. "Fully-managed, cloud-based". |
| Amazon: 1 millionth robot, 300+ facilities, DeepFleet, 10% travel time, June 2025 (verified) | [Amazon, Jun 30 2025](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | Pass, all four figures. The "world's largest fleet of industrial mobile robots" wording is in the subtitle. |
| VDA 5050 state sent on events or at least every 30 s (verified) | [VDA 5050 v3.0.0 spec](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) | Pass. Exact sentence in 6.6. Also confirmed "fleet control" as the term (a fact-checker correction). |
| ISO 21423:2026 published October 2026 (corrected; re-checked) | [ISO/TC 299 page](https://committee.iso.org/standard/86749.html) | Pass. Stage 60.60, dated 2026-10-14. |
| Foxglove free tier: 3 seats, 10 GB, 5 devices; Pro from $20/month; Studio v1.87.0 in Feb 2024 (verified) | [Foxglove, May 25 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | Pass, all figures. |
| MCAP format, libraries, and CLI are Apache 2.0 (verified) | [Foxglove, May 25 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | Pass. |
| rosbag2 snapshot mode: in-memory circular buffer saved by calling the `~/snapshot` service; mcap is the default (verified) | [rosbag2 README (Jazzy)](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) | Pass. Buffer size is set by `--max-cache-size`. The README gives no duration option, which is why the cheese example now talks about sizing the buffer. |
| AWS RoboMaker discontinued, with AWS Batch as the replacement (verified) | [The Robot Report, Sep 10 2025](https://www.therobotreport.com/aws-robomaker-shuts-down-after-failing-to-gain-traction/) | Pass. "Officially discontinued", Batch named. The article gives no exact shutdown day, so "September 2025" matches its date. This is a secondary source. |
| Mender exit code 21 means "retry later" (verified) | [Mender state scripts](https://docs.mender.io/artifact-creation/state-scripts) | Pass. Retries are capped by StateScriptRetryTimeoutSeconds, and that limit is now in the text. |
| UN R156: restore the previous version or reach a safe state after a failed or interrupted OTA update (corrected; re-checked) | [EUR-Lex, Regulation 2021/388](https://eur-lex.europa.eu/eli/reg/2021/388/oj) | Pass. 7.2.2.1.1 matches the text. |
| Formant site live as of November 2026 (corrected; re-checked) | [formant.ai](https://formant.ai/) | Pass. Active product site, page metadata dated Nov 11 2026. |
| Foxglove Edge Sites queue data for cloud import as bandwidth allows (verified) | [Foxglove, Feb 16 2023](https://foxglove.dev/blog/announcing-foxglove-edge-sites) | Pass. Exact phrase. |
| HG-DAgger lets the expert decide when to take control (verified) | [arXiv 1810.02890](https://arxiv.org/abs/1810.02890); [ar5iv method section](https://ar5iv.labs.arxiv.org/html/1810.02890) | Pass. Labels are collected only while the expert is in control, a detail now added to the text. |
| RECAP more than doubles throughput and roughly halves failure rate on some of the hardest tasks; Nov 2025 (verified, scope corrected) | [arXiv 2511.14759](https://arxiv.org/abs/2511.14759) | Pass. "On some of the hardest tasks". Submitted 18 Nov 2025. |
| DROID: 76k trajectories, 350 h, 564 scenes, 50 collectors, 3 continents, 12 months (verified) | [arXiv 2403.12945](https://arxiv.org/abs/2403.12945) | Pass, all figures. The abstract also gives 84 tasks. |
