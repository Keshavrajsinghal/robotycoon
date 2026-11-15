## Area 10, Platform: fact check

Summary line: 84 claims checked: 76 verified, 8 corrected, 0 unverifiable (0 kept flagged, 0 removed). All 3 existing [unverified] flags were resolved with sources and removed. 4 sources were replaced with primary ones (FlowFuse blog, ROS Index page, CB Insights profile, UL white paper); 9 sources were added. `build-content.mjs --check` passes with 0 errors.

### fleet-management

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | OpenRobOps released as open source (Apache 2.0) in September 2026 | verified | [The Robot Report, Sep 15 2026](https://www.therobotreport.com/inorbit-ai-releases-openrobops-iso-21423-reference-implementation/) (secondary) | none |
| 2 | OpenRobOps features: telemetry intake, incident detection, configuration as code | verified | [The Robot Report, Sep 2026](https://www.therobotreport.com/inorbit-ai-releases-openrobops-iso-21423-reference-implementation/) (secondary) | none |
| 3 | OpenRobOps uses outbound-only connections | verified | [InOrbit blog, Feb 2026](https://www.inorbit.ai/blog/openrobops-announcement) | none |
| 4 | Vendors call this robot operations, or RobOps | verified | [InOrbit blog](https://www.inorbit.ai/blog/openrobops-announcement) | none |
| 5 | VDA 5050 comes from VDA and VDMA | verified | [VDA 5050 spec v3.0.0, Foreword](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) | source changed from FlowFuse blog to the spec |
| 6 | VDA 5050 is JSON over MQTT | verified | [VDA 5050 spec, section 4](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) | none |
| 7 | Messages pass between a "master control" and each vehicle | corrected | [VDA 5050 spec v3.0.0](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) | v3.0 uses "fleet control", and "master control" never appears; changed in Precise and in Real products |
| 8 | Message types: orders, instant actions such as pause, state report | verified | [VDA 5050 spec, 6.2.1 (startPause/stopPause), 6.6](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) | none |
| 9 | Version 3.0 came out in March 2026 | verified | [GitHub release 3.0.0](https://github.com/VDA5050/VDA5050/releases/tag/3.0.0) (posted 18 Mar 2026; notes say the VDA released it 19 Mar 2026) | source [3] now points at the release page |
| 10 | Open-RMF fleet adapters range from full control to traffic light (pause and resume only) | verified | [Open-RMF book, Integration: fleets](https://osrf.github.io/ros2multirobotbook/integration_fleets.html) | replaced the ROS Index page, which does not describe the levels |
| 11 | ISO 21423 "described as upcoming as of September 2026" | corrected | [ISO 21423:2026 (ISO committee site)](https://committee.iso.org/standard/86749.html) | now says it was published 14 Oct 2026 as ISO 21423:2026, gives its scope in plain words, and notes the OpenRobOps reference implementation; new source [11] |
| 12 | FANUC ZDT monitors reducer and servo motor health and alerts before failure | verified | [FANUC America ZDT](https://www.fanucamerica.com/products/robots/zdt-zero-down-time) | none |
| 13 | Amazon passed 1 million robots in June 2025 | verified | [Amazon, Jun 30 2025](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | none |
| 14 | More than 300 facilities | verified | [Amazon](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | none |
| 15 | DeepFleet coordinates fleet movement | verified | [Amazon](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | none |
| 16 | DeepFleet improves fleet travel time by 10% (Amazon's claim) | verified | [Amazon](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | none |
| 17 | 200 plates/h x 3 wedges = 10 wedges/min | verified | arithmetic | none |
| 18 | Ground Control is InOrbit's hosted commercial tier | verified | [The Robot Report, Feb 4 2026](https://www.therobotreport.com/inorbit-adds-steve-cousins-board-offers-openrobops-open-source-fleet-manager/) (secondary) | the old citations [1][2] did not support this; new source [10] added |
| 19 | Formant does monitoring, alerting, remote access, and fleet data | verified | [Verdict, Jan 2022](https://www.verdict.co.uk/formant-rolls-out-cloud-based-platform-to-manage-robot-fleets/) (secondary); [formant.ai](https://formant.ai/) | none |
| 20 | Formant "listed as operating as of early 2026, could not open its docs" | corrected | [formant.ai](https://formant.ai/) | now says its site was live and selling as of November 2026; the CB Insights profile (secondary) was replaced with formant.ai |
| 21 | Open-RMF is an open-source ROS 2 framework that coordinates several vendors' fleets | verified | [Open-RMF book](https://osrf.github.io/ros2multirobotbook/integration_fleets.html) | none |
| 22 | VDA 5050 state is sent on every change and at least every 30 s | verified | [VDA 5050 spec, 6.6](https://github.com/VDA5050/VDA5050/blob/main/VDA5050_EN.md) ("when relevant events occur or at least every 30 seconds") | source changed from FlowFuse blog to the spec |
| 23 | "Largest single fleet: Amazon" | corrected | [Amazon](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model) | stated as Amazon's own claim ("world's largest fleet of industrial mobile robots") |
| 24 | InOrbit says teams spend months building cloud infrastructure, protocols, and schemas to monitor robot health | verified | [InOrbit blog](https://www.inorbit.ai/blog/openrobops-announcement) | none |
| 25 | InOrbit announcement dated February 2026 | verified | [InOrbit blog](https://www.inorbit.ai/blog/openrobops-announcement) (Feb 3 2026) | none |

### telemetry-logs

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | The ROS 2 recorder is rosbag2, and a recording is a bag | verified | [rosbag2 README (Jazzy)](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) | none |
| 2 | MCAP has been the default bag format since Iron | verified | [Foxglove, Dec 2022](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format); [rosbag2 README](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) | none |
| 3 | Iron was released in May 2023 | verified | [ROS 2 Iron release notes](https://github.com/ros2/ros2_documentation/blob/rolling/source/Releases/Release-Iron-Irwini.rst) (general availability May 23, 2023) | added primary source [6]; the Foxglove post only said "planned for May 2023" |
| 4 | MCAP chunks are compressed, e.g. with zstd or lz4 | verified | [MCAP spec](https://mcap.dev/spec) | none |
| 5 | MCAP embeds schemas | verified | [MCAP spec](https://mcap.dev/spec) | none |
| 6 | MCAP usually ends with an optional index or summary section | verified | [MCAP spec](https://mcap.dev/spec) | none |
| 7 | SQLite's fast write mode risked corruption on interruption, and its safe mode was slower | verified | [Foxglove, Dec 2022](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) | none |
| 8 | One MCAP file can mix ROS, Protobuf, and JSON | verified | [Foxglove, Dec 2022](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) | none |
| 9 | 1280x720x3x30 is about 83 MB/s, about 300 GB/h | verified | arithmetic (82.9 MB/s, 298.6 GB/h), labeled as arithmetic | none |
| 10 | Snapshot mode keeps an in-memory ring buffer and writes it to disk when a trigger service is called | verified | [rosbag2 README](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) (`--snapshot-mode`, `~/snapshot`) | none |
| 11 | rosbag2 splits by size or duration and offers zstd compression | verified | [rosbag2 README](https://raw.githubusercontent.com/ros2/rosbag2/jazzy/README.md) | none |
| 12 | 4 stations x 8 h of one camera is close to 10 TB | verified | arithmetic (9.6 TB) | none |
| 13 | MCAP format, libraries, and CLI are Apache 2.0 | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 14 | Rerun uses .rrd and imports MCAP | verified | [Rerun repo](https://www.github.com/rerun-io/rerun) | none |
| 15 | Foxglove MCAP post dated December 2022 | verified | [Foxglove](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) (Dec 22 2022) | none |

### visualization-tools

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | RViz2 plugins include robot model, TF tree, camera, and depth | verified | [Stereolabs RViz2 docs](https://docs.stereolabs.com/docs/ros2/rviz2) | none |
| 2 | Stereolabs advises running RViz2 on a separate computer | verified | [Stereolabs](https://docs.stereolabs.com/docs/ros2/rviz2) (advice is about Jetson boards) | none |
| 3 | Foxglove is commercial with a free tier, runs in a browser or desktop app, and opens live and MCAP data | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 4 | Foxglove now adds data search | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 5 | Foxglove Studio's last open-source release was v1.87.0, Feb 2024 | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on); the foxglove/studio GitHub repo is archived | none |
| 6 | Lichtblick is an open-source browser and desktop viewer for ROS 1, ROS 2, and MCAP | verified | [Lichtblick docs](https://lichtblick-suite.github.io/docs) | none |
| 7 | Lichtblick is a fork of Foxglove Studio [unverified] | verified | [Lichtblick repo README](https://github.com/lichtblick-suite/lichtblick) ("originally began as a fork of Foxglove Studio") | flag removed; new source [7] added |
| 8 | Rerun is licensed Apache 2.0 and MIT | verified | [Rerun repo](https://www.github.com/rerun-io/rerun) | none |
| 9 | Rerun has Python, Rust, and C++ SDKs | verified | [Rerun repo](https://www.github.com/rerun-io/rerun) | none |
| 10 | Rerun imports MCAP and LeRobot datasets | verified | [Rerun repo](https://www.github.com/rerun-io/rerun) | none |
| 11 | Foxglove Pro starts at $20/month (May 2026) | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 12 | Free tier: 3 seats, 10 GB, 5 devices | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 13 | PlotJuggler was named in 2022 as able to read MCAP | verified | [Foxglove, Dec 2022](https://foxglove.dev/blog/mcap-as-the-ros2-default-bag-format) | none; the PlotJuggler repo was still active in Nov 2026 |
| 14 | The LeRobot dataset viewer opens episodes in Rerun or serves them to Foxglove | verified | [LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/en/lerobot-dataset-v3) | none |

### remote-updates

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | A canary is a partial, time-limited deployment compared against a control (SRE Workbook chapter 16) | verified | [Google SRE Workbook, Canarying releases](https://sre.google/workbook/canarying-releases/) | none |
| 2 | In shadow testing for vehicles, human and automated commands are recorded side by side and differences are flagged | verified | [Schwarz, Rolland, Johnston, ICE/ITMC 2022](https://research-portal.uws.ac.uk/en/publications/validation-of-vehicles-with-automated-features-through-the-detect/) | none |
| 3 | Mender writes to an inactive A/B partition, reboots, and rolls back on a failed boot or a missing commit | verified | [Mender blog](https://mender.io/blog/robust-ota-updates-with-partitions-for-linux-devices); [Mender integration checklist](https://docs.mender.io/client-installation/integration-checklist) | none |
| 4 | Robot software decides when an install or reboot may happen [unverified] | verified | [Mender state scripts](https://docs.mender.io/artifact-creation/state-scripts) (exit code 21, "retry later") | flag removed; reworded around Mender's retry-later hook; new source [7] |
| 5 | UN R156 requires a software update management system (SUMS) | verified | [UN R156 on EUR-Lex](https://eur-lex.europa.eu/eli/reg/2021/388/oj) | replaced UL white paper (secondary) with the regulation text |
| 6 | R156: carmakers must be able to restore the previous state when an update fails | corrected | [UN R156, 7.2.2.1.1](https://eur-lex.europa.eu/eli/reg/2021/388/oj) | now says: for over-the-air updates, restore the previous version or put the vehicle in a safe state |
| 7 | R156: an "audited" update management system | corrected | [UN R156, clause 6](https://eur-lex.europa.eu/eli/reg/2021/388/oj) | changed "audited" to "certified" (Certificate of Compliance for SUMS) |
| 8 | R156: identify the regulated software version in each vehicle | verified | [UN R156, 7.2.1.2 (RXSWIN)](https://eur-lex.europa.eu/eli/reg/2021/388/oj) | none |
| 9 | 3B params x 2 bytes is about 6 GB, about 8 min at 100 Mbit/s | verified | arithmetic (480 s) | none |
| 10 | 1,600 grape picks per shift; 1% = 16, 3% = 48 | verified | arithmetic (200/h x 8 h), labeled illustrative | none |
| 11 | Mender is open source, from Northern.tech | verified | [Mender blog](https://mender.io/blog/robust-ota-updates-with-partitions-for-linux-devices) | none |
| 12 | AWS RoboMaker was shut down in September 2025, and users were pointed to AWS Batch | verified | [The Robot Report, Sep 10 2025](https://www.therobotreport.com/aws-robomaker-shuts-down-after-failing-to-gain-traction/) (secondary; the AWS RoboMaker docs pages now return 404, which fits the shutdown) | none |
| 13 | A canary should run for at least one work unit | verified | [SRE Workbook](https://sre.google/workbook/canarying-releases/) | none |
| 14 | Source [2] authors and venue | verified | [UWS research portal](https://research-portal.uws.ac.uk/en/publications/validation-of-vehicles-with-automated-features-through-the-detect/) | none |

### data-pipelines

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | LeRobotDataset v3 packs many episodes into shared Parquet files plus MP4 per camera, with metadata marking episode boundaries | verified | [LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/en/lerobot-dataset-v3) | none |
| 2 | Episodes wait locally and upload when bandwidth allows [unverified] | verified | [Foxglove Edge Sites, Feb 2023](https://foxglove.dev/blog/announcing-foxglove-edge-sites) (queues data "as connectivity and bandwidth become available") | flag removed; new source [7] |
| 3 | HG-DAgger lets the human expert decide when to take control | verified | [HG-DAgger, arXiv 1810.02890](https://ar5iv.labs.arxiv.org/html/1810.02890) ("take control when they deem it necessary") | none |
| 4 | HG-DAgger is safer on real systems than DAgger | corrected | [HG-DAgger abstract](https://arxiv.org/abs/1810.02890) | reworded as the authors' argument, not a measured fact |
| 5 | HG-DAgger appeared at ICRA 2019 | verified | [Semantic Scholar record](https://api.semanticscholar.org/graph/v1/paper/arXiv:1810.02890?fields=title,venue,year,publicationVenue,externalIds) (DOI 10.1109/ICRA.2019.8793698) | none |
| 6 | RECAP is from November 2025 | verified | [arXiv 2511.14759](https://arxiv.org/abs/2511.14759) (v1 18 Nov 2025) | none |
| 7 | RECAP trains on demonstrations, autonomous attempts, and teleoperated interventions | verified | [arXiv 2511.14759](https://arxiv.org/abs/2511.14759) | none |
| 8 | RECAP more than doubles throughput "on its hardest tasks" | corrected | [arXiv 2511.14759](https://arxiv.org/abs/2511.14759) ("on some of the hardest tasks") | changed to "some of its hardest tasks" in Precise and in Key numbers |
| 9 | RECAP roughly halves the failure rate | verified | [arXiv 2511.14759](https://arxiv.org/abs/2511.14759) | same scope fix as row 8 |
| 10 | DROID has 76k trajectories and 350 hours | verified | [DROID, arXiv 2403.12945](https://arxiv.org/abs/2403.12945) | none |
| 11 | DROID: 50 collectors, 564 scenes, 3 continents, 12 months | verified | [DROID](https://arxiv.org/abs/2403.12945) | none |
| 12 | About 17 s per trajectory | verified | arithmetic (16.6 s) | none |
| 13 | 2% of 1,600 = 32 | verified | arithmetic, labeled illustrative | none |
| 14 | Foxglove offers search across recordings, events, and sessions | verified | [Foxglove, May 2026](https://foxglove.dev/blog/foxglove-vs-foxglove-studio-two-years-on) | none |
| 15 | Rerun is aimed at logging, querying, and streaming data for training | verified | [Rerun repo](https://www.github.com/rerun-io/rerun) | none |
| 16 | LeRobot v3 streams datasets from the Hub | verified | [LeRobotDataset v3.0](https://huggingface.co/docs/lerobot/en/lerobot-dataset-v3) | none |
