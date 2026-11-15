## Area 9, Teleoperation: fact check

Summary line: 150 claims checked: 129 verified, 19 corrected, 2 unverifiable (0 kept flagged, 2 removed).

All 6 pre-existing [unverified] flags were re-tried and resolved (move-and-wait, camera exposure/readout, ISP latency, HLS latency, TCP_NODELAY, IEC 60204-1 stop categories). The file now has 0 flags. Two secondary sources were replaced with primaries (the 2026 TUM driving study, which was citing other papers for every number used here, and Wikipedia's AV1 article). Validation: `node tools/build-content.mjs --check knowledge/09-teleoperation.md` gives 0 warnings, 0 errors.

### teleop-modes
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | ALOHA streams leader joint angles to followers at 50 Hz | verified | [Zhao et al. 2023](https://ar5iv.labs.arxiv.org/html/2304.13705) | none |
| 2 | ALOHA costs about $20k | verified | [Zhao et al. 2023](https://ar5iv.labs.arxiv.org/html/2304.13705) | none ($18k, $20k with add-ons) |
| 3 | ALOHA paper is RSS 2023 | verified | [RSS XIX proceedings](http://www.roboticsproceedings.org/rss19/p016.html) | none |
| 4 | Yonder sends a picture to a remote Crew Chief, who selects an item to set the pick point | verified | [Plus One Robotics](https://www.plusonerobotics.com/automated-parcel-induction) | none |
| 5 | Yonder stores the answer to improve the model | verified | [Plus One Robotics](https://www.plusonerobotics.com/automated-parcel-induction) | none |
| 6 | Plus One Robotics still active (Nov 2026) | verified | [Robotics 24/7 company listing, April 2026](https://www.robotics247.com/company/plus_one_robotics) (secondary, search result only) | none |
| 7 | Waymo service "does not rely on remote drivers" | verified | [Waymo blog, 17 Feb 2026](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 8 | Requests come from the car; car can use or reject advice | verified | [Waymo blog](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 9 | About 70 remote assistance agents on duty worldwide | verified | [Waymo blog](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 10 | Median one-way latency about 150 ms (U.S.) and 250 ms (overseas) | verified | [Waymo blog](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 11 | Agents do not continuously monitor vehicles | verified | [Waymo blog](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 12 | Shared autonomy combines user input and autonomy; goal inferred from input | verified | [Javdani et al.](https://arxiv.org/abs/1503.07619) | none |
| 13 | Users faster with less input; ratings mixed (control versus speed) | verified | [Javdani et al.](https://arxiv.org/abs/1503.07619) | none |
| 14 | Javdani paper is RSS 2015 | verified | [RSS XI proceedings](http://www.roboticsproceedings.org/rss11/p32.html) | none |
| 15 | Phantom Auto remotely drove forklifts, yard trucks, sidewalk robots | verified | [TechCrunch, 12 Mar 2024](https://techcrunch.com/2024/03/12/remote-driving-startup-phantom-auto-is-shutting-down/amp/) (secondary, news) | none |
| 16 | Phantom Auto shut down March 2024 | verified | [TechCrunch](https://techcrunch.com/2024/03/12/remote-driving-startup-phantom-auto-is-shutting-down/amp/) (secondary, news) | none (closure announced 12 Mar 2024) |
| 17 | Phantom Auto raised about $95 million | verified | [TechCrunch](https://techcrunch.com/2024/03/12/remote-driving-startup-phantom-auto-is-shutting-down/amp/) (secondary, news) | none |
| 18 | "As of late 2025, 1X sells NEO" with "Expert Mode" | corrected | [1X order page](https://www.1x.tech/order) | corrected to "as of November 2026, 1X takes orders, U.S. deliveries promised for 2026, Scheduled Expert Mode"; added source [7]; I could not confirm whether customer deliveries had started, so the text does not claim they had |
| 19 | NEO operators wear VR headsets (Quest 3) | verified | [Road to VR, 30 Oct 2025](https://roadtovr.com/helper-robot-neo-vr-telepresence/) (secondary, news) | reworded as "launch coverage described" |
| 20 | Owner schedules the remote sessions | verified | [1X order page](https://www.1x.tech/order) | none |
| 21 | 200 plates an hour gives 18 s per plate | verified | arithmetic (3600 / 200) | none |

### operator-interfaces
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | robosuite: lateral move to horizontal motion, twist to rotation, held left button closes gripper | verified | [robosuite docs](https://robosuite.ai/docs/modules/devices.html) | none |
| 2 | UR add-on "3D Mouse Move" by Radalytica lets tool follow SpaceMouse in real time | verified | [UR marketplace](https://universal-robots.com/marketplace/products/01tP40000071NYeIAM) | none |
| 3 | Open-TeleVision used Apple Vision Pro | verified | [Cheng et al.](https://arxiv.org/html/2407.01512v2) | none |
| 4 | Streamed 480x640 per eye | verified | [Cheng et al.](https://arxiv.org/html/2407.01512v2) | none |
| 5 | Whole loop at 60 Hz | verified | [Cheng et al.](https://arxiv.org/html/2407.01512v2) | none |
| 6 | MIT operator controlled robot in San Diego, about 3,000 miles | verified | [Cheng et al.](https://arxiv.org/html/2407.01512v2) | none |
| 7 | Open-TeleVision is CoRL 2024 | verified | [PMLR vol. 270, 8th CoRL](https://proceedings.mlr.press/v270/cheng25b.html) | none |
| 8 | ALOHA: WidowX leaders ($3,300 each), ViperX followers, 50 Hz | verified | [Zhao et al. 2023](https://ar5iv.labs.arxiv.org/html/2304.13705) | none |
| 9 | GELLO bill of materials under $300 | verified | [Wu et al.](https://arxiv.org/html/2309.13037v2) | none |
| 10 | GELLO uses Dynamixel servos and 3D-printed parts | verified | [Wu et al.](https://arxiv.org/html/2309.13037v2) | none |
| 11 | 12-person study, 5 two-armed tasks | verified | [Wu et al.](https://arxiv.org/html/2309.13037v2) | none |
| 12 | Success 0.92 (GELLO) versus 0.72 (VR) and 0.63 (3D mice) | verified | [Wu et al.](https://arxiv.org/html/2309.13037v2) | none |
| 13 | GELLO was faster | verified | [Wu et al.](https://arxiv.org/html/2309.13037v2) | none |
| 14 | Surgeon motion reproduced "in scaled proportion" | verified | [Kypson and Chitwood 2004](https://arxiv.org/pdf/cs/0412055) | none |
| 15 | Console filters 8-10 Hz hand tremor | verified | [Kypson and Chitwood 2004](https://arxiv.org/pdf/cs/0412055) | none |
| 16 | Clutch works like lifting a computer mouse | verified | [Kypson and Chitwood 2004](https://arxiv.org/pdf/cs/0412055) | none |
| 17 | Kypson and Chitwood, Int. J. Advanced Robotic Systems, 2004 | verified | [Kypson and Chitwood 2004](https://arxiv.org/pdf/cs/0412055) | none (vol. 1 no. 2) |
| 18 | Code comment: USB poll "typically every 1-8 ms" | unverifiable | none opened | removed the number from the comment |

### latency-budget
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | G2G definition (lens to display glass) | verified | [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | none |
| 2 | About 20 ms motion-to-photon is the "comfort threshold" | corrected | [Varjo](https://support.varjo.com/hc/en-us/latency) | corrected to "threshold below which users generally do not notice it" (source's wording) |
| 3 | E2E = M2M + G2G; about 500 ms over 5G; M2M about 60% | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none |
| 4 | Camera delay spread evenly "between zero and one frame interval" | corrected | [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | corrected to "fixed minimum plus a wait spread over one frame interval" |
| 5 | Display delay spread between zero and one refresh interval | verified | [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | none |
| 6 | Mean G2G 50.4 ms (25 fps) and 15.5 ms (300 fps), 60 Hz monitor | verified | [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | none |
| 7 | Fiber about 31% slower, index about 1.47, about 200 km per ms | verified | [TeleGeography](https://resources.telegeography.com/the-speed-of-light-never-changes-except-when-it-does) | none (200 km/ms derived from the page's 124,188 mi/s) |
| 8 | Verizon Oct 2026 round trips 14 / 33 / 70 / 112 ms | verified | [Verizon](https://www.verizon.com/business/terms/latency/) | none |
| 9 | LTE adds a median 36 ms over LAN | corrected | [Kerbl et al. 2025](https://arxiv.org/html/2506.13933) | corrected to about 35 ms (LTE median 160 ms versus about 125 ms LAN); replaced the 2026 citing paper with this primary |
| 10 | G.114: below 150 ms "essentially transparent interactivity"; 400 ms planning limit; interactive tasks affected by less | verified | [ITU-T G.114 (05/2003)](https://www.cs.columbia.edu/%7Eandreaf/new/documents/other/T-REC-G.114-200305.pdf) | none |
| 11 | G.114 edition 05/2003 | verified | [ITU-T listing](https://www.itu.int/rec/T-REC-G.114) | noted "still in force with later amendments" (2003, 2009) |
| 12 | Telesurgery: 0-300 ms tested; 100 ms or less acceptable; significant rise 100 to 150 ms | verified | [Nankaku et al. 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9536636/) | none |
| 13 | Operators fall back to move-and-wait "above that" (above 150 ms) [unverified] | corrected | [Black 1970, NASA NTRS](https://ntrs.nasa.gov/api/citations/19710009659/downloads/19710009659.pdf) | flag removed; scope corrected to "at delays of seconds" (all subjects, 3.5 s delay, confirming Ferrell); added source [15] |
| 14 | 1,000 km of fiber costs about 5 ms each way | verified | arithmetic from [TeleGeography](https://resources.telegeography.com/the-speed-of-light-never-changes-except-when-it-does) | none |
| 15 | Waymo median one-way 150 / 250 ms | verified | [Waymo blog](https://blog.waymo.com/blog/shorts/advice-not-control-the-role-of-remote-assistance) | none |
| 16 | Testbed: G2G 193 ms, camera 120 ms, monitor 8 ms, M2M 306 ms, steering 270 ms | corrected | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | marked camera and steering figures as estimates (remainders after measured stages); added "commercial 5G" (NSA) |
| 17 | TUM G2G rig is open source, 0.5 ms precision | verified | [G2GDelay on GitHub](https://github.com/cbachhuber/G2GDelay) | added source [18]; the paper itself does not say open source |
| 18 | UR RTDE 500 Hz on e-Series and ur-Series | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 19 | NVENC low-latency settings "cap encoder buffering at about one frame" | corrected | [NVENC guide 13.1](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) | corrected to "recommended settings include an encoder buffer of about one frame" |
| 20 | Frame transmission about 15 ms of about 193 ms G2G | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none |
| 21 | Camera frame wait 0-33 ms at 30 fps, 0-17 ms at 60 fps | verified | arithmetic from [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | none |
| 22 | Exposure and readout "about 1-30 ms" [unverified] | corrected | [Basler white paper](https://assets-ctf.baslerweb.com/dg51pdwahxgw/7ntd9P0LbEeEmxKj6Q6J1h/cb845234f745dddab95f3ee64994dd7d/BAS1401_White_Paper_Rolling_Shutter.pdf) | flag removed; replaced with rows x row time (about 30-100 ms full-frame on 12-14 MP sensors; about 7 ms for 720 rows at 10 microseconds); added source [16] |
| 23 | Whole G2G as low as 8 ms with 300 fps camera | verified | [Bachhuber and Steinbach](https://ar5iv.labs.arxiv.org/html/1510.01134) | none (8.1 ms minimum) |
| 24 | ISP "about 1-10 ms" [unverified] | corrected | [RidgeRun PVA ISP measurements](https://developer.ridgerun.com/wiki/index.php/PVA_ISP_for_NVIDIA_Jetson/Performance/Latency_and_Throughput) (vendor) | flag removed; range replaced with 4-8 ms at 1080p, about 27 ms at 4K on Jetson Orin; added source [19] |
| 25 | Encode: one rig "30 ms frame period plus 9 ms processing" | corrected | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | corrected to "frames published every 30 ms plus about 9 ms server processing, codec not stated"; one-frame buffer arithmetic kept with NVIDIA source |
| 26 | 20.8 kb frame at 1.38 Mb/s takes 15 ms | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none |
| 27 | Fiber floor: 50 km 0.25 ms; 1,000 km 5 ms; 4,800 km at least 24 ms | verified | arithmetic; distance from [Cheng et al.](https://arxiv.org/html/2407.01512v2) | none |
| 28 | Backbone one way about 7 ms (Europe) to 56 ms (trans-Pacific) | verified | half of [Verizon](https://www.verizon.com/business/terms/latency/) round trips | none |
| 29 | LTE latency 29.5 ms standard deviation | verified | [Xiao et al., SECON 2019](https://wicon.arizona.edu/sites/default/files/2023-03/2019SECON_AdaptiveFog0.pdf) | source replaced with this primary; clarified it is round trip from a moving car; added source [14] |
| 30 | Decode: rig's 10.5 ms "including decode" | corrected | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | corrected to "receive-side processing, decoding not broken out"; range changed from "1-10 ms" to "up to about 10 ms" |
| 31 | Display average 8.3 ms at 60 Hz, 4.2 ms at 120 Hz | verified | arithmetic; [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none |
| 32 | Simple visual reaction 213-231 ms mean | verified | [Woods et al. 2015](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2015.00131/full) | none |
| 33 | Input device polling about 2 ms, up to 5 ms | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none |
| 34 | Command send one way: 10.3 ms on 5G | corrected | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | corrected to "average 10.3 ms for TCP command packets (direction not stated)" |
| 35 | Controller cycle 2 ms at 500 Hz to 10 ms at 100 Hz | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) (100 Hz interface), [UR RTDE](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 36 | Motion: "tens of ms for a small arm move" (no source) | corrected | [UR servoj manual](https://www.universal-robots.com/manuals/EN/HTML/SW10_12/Content/prod-scriptmanual/all_scripts/servoj_qavt0-008lookahead_time.htm) | replaced with "smoothing alone can span 30-200 ms (servoj lookahead range)"; steering 270 ms marked as estimate; added source [17] |
| 37 | G2G 150-200 ms over LTE in another rig | verified | [Kerbl et al. 2025](https://arxiv.org/html/2506.13933) | citation moved to the primary |
| 38 | Code sketch totals about 402 ms and 110 ms | verified | arithmetic | changed comment "+36 ms" to "+35 ms" |
| 39 | Source [3]: arXiv 2602.17381, 2026 | verified | [Provost et al. 2026](https://arxiv.org/html/2602.17381v1) | none (19 Feb 2026, commercial 5G NSA, Luxembourg) |

### video-pipeline
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Raw 1280x720, 24-bit, 60 fps is about 1.3 Gb/s | verified | arithmetic | none |
| 2 | WebRTC browsers must implement H.264 and VP8 | verified | [RFC 7742](https://www.rfc-editor.org/rfc/rfc7742) | none |
| 3 | H.264 latest ITU-T edition June 2026 | verified | [ITU-T H.264 listing](https://www.itu.int/rec/T-REC-H.264) | none |
| 4 | H.265 approved 2013 | verified | [ITU-T H.265 listing](https://www.itu.int/rec/T-REC-H.265) | noted first edition 04/2013 |
| 5 | HEVC about 25-50% better than H.264 | verified | [Wikipedia HEVC](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding) (secondary); [ITU press release 2013](https://www.itu.int/net/pressoffice/press_releases/2013/01.aspx) | range kept, labeled secondary, said what it depends on; added ITU primary "about half the bit rate" as source [12] |
| 6 | AV1 released March 2018, royalty-free | verified | [AOMedia press release](https://aomedia.org/press%20releases/the-alliance-for-open-media-kickstarts-video-innovation-era-with-av1-release/) | replaced Wikipedia [4] with this primary |
| 7 | AV1 about 50% better than x264 (Facebook 2018) | verified | [Facebook Engineering](https://engineering.fb.com/video-engineering/av1-beats-x264-and-libvpx-vp9-in-practical-use-case/) | added primary [8] |
| 8 | AV1 about 9.5% better than HEVC at 4K, "2020" Waterloo study | corrected | [Li et al., Waterloo](https://ece.uwaterloo.ca/~z70wang/publications/iciar19_encoderCompare.pdf) | 9.5% at 2160p confirmed in the paper's table; removed "2020" (the PDF is an ICIAR 2019 paper by filename and the year is not printed in the text I could extract); added primary [9] |
| 9 | RTX 40 and later encode AV1; RTX 30 only decodes | verified | [NVIDIA support matrix](https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new) | added primary [10] |
| 10 | Intel Arc encodes AV1 in hardware | verified | [Intel support article](https://www.intel.com/content/www/us/en/support/articles/000098345/graphics.html) | added primary [11]; noted A-Series and B-Series |
| 11 | A B-frame must wait for a later frame | verified | follows from the definition (it references a later frame) | none |
| 12 | NVIDIA low-latency recipe: ultra-low/low tuning, CBR, single-frame VBV, infinite GOP, intra refresh, unidirectional B-frames | verified | [NVENC guide 13.1](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) | none |
| 13 | Unidirectional B-frames are "an HEVC-only variant" | corrected | [NVENC guide 13.1](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) | corrected to "this SDK supports only for HEVC" (guide says "currently supported for HEVC") |
| 14 | Intra refresh period 30 repairs about once a second at 30 fps | verified | [NVENC guide 13.1](https://docs.nvidia.com/video-technologies/video-codec-sdk/13.1/nvenc-video-encoder-api-prog-guide/index.html) | none |
| 15 | YouTube live: 2 B-frames, 2-second keyframe interval | verified | [YouTube Help](https://support.google.com/youtube/answer/2853702) | none |
| 16 | YouTube H.264: 720p30 3-8 Mb/s, 1080p30 5-14 Mb/s; less for HEVC/AV1 | verified | [YouTube Help](https://support.google.com/youtube/answer/2853702) | none |
| 17 | 4 Mb/s / 60 fps is about 67 kbit | verified | arithmetic | none |
| 18 | H.264 and H.265 both updated in 2026 | verified | [H.264](https://www.itu.int/rec/T-REC-H.264), [H.265](https://www.itu.int/rec/T-REC-H.265) | none (06/2026, 01/2026) |
| 19 | AV1 "can be slower to encode" without hardware | corrected | [Li et al., Waterloo](https://ece.uwaterloo.ca/~z70wang/publications/iciar19_encoderCompare.pdf) | made specific: over 500 times H.264's encoding time in software in that study; source moved off Wikipedia |

### webrtc
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | W3C Recommendation since 13 March 2025 | verified | [W3C WebRTC](https://www.w3.org/TR/webrtc/) | none |
| 2 | RFC 8825 summarizes the protocol suite (2021) | verified | [RFC 8825](https://www.rfc-editor.org/rfc/rfc8825) | none |
| 3 | Signaling channel "provided by unspecified means" | verified | [W3C WebRTC](https://www.w3.org/TR/webrtc/) | none |
| 4 | ICE: host, server-reflexive, relayed candidates; pairs tested with STUN checks; nomination | verified | [RFC 8445](https://www.rfc-editor.org/rfc/rfc8445) | none |
| 5 | Candidates exchanged over signaling, e.g. offer/answer | verified | [RFC 8445](https://www.rfc-editor.org/rfc/rfc8445) | none |
| 6 | Use TURN "only when a direct communication path cannot be found"; relays are costly | verified | [RFC 8656](https://www.rfc-editor.org/rfc/rfc8656) | none |
| 7 | DTLS handshake on media path keys SRTP | verified | [RFC 5764](https://www.rfc-editor.org/rfc/rfc5764) | none |
| 8 | SRTP required for all implementations | verified | [RFC 8825](https://www.rfc-editor.org/rfc/rfc8825) | none |
| 9 | Data channels: SCTP over DTLS over ICE/UDP; zero retransmits plus unordered is "UDP-like" | verified | [RFC 8831](https://www.rfc-editor.org/rfc/rfc8831) | none |
| 10 | Browser API: `ordered: false` with `maxRetransmits` or `maxPacketLifeTime` | verified | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel) (secondary, browser docs) | none |
| 11 | RFC 8825 "requires" congestion control in the transport | corrected | [RFC 8825](https://www.rfc-editor.org/rfc/rfc8825) | corrected to "lists it among the transport layer's necessary functions" (no MUST on that sentence) |
| 12 | GCC: delay-based plus loss-based; sender uses the lower estimate | verified | [GCC draft-02](https://datatracker.ietf.org/doc/html/draft-ietf-rmcat-gcc-02) | added that the draft is from July 2016 and expired |
| 13 | Segment streaming built for seconds of delay [unverified] | verified | [Apple HLS authoring spec](https://developer.apple.com/documentation/http-live-streaming/hls-authoring-specification-for-apple-devices) | flag removed; cited 6-second recommended segments; added source [11] |
| 14 | Pion: pure Go, robot-control use case, ordered/unordered and lossy/lossless channels | verified | [Pion GitHub](https://github.com/pion/webrtc) | none |
| 15 | Pion version 4 | verified | [Pion GitHub](https://github.com/pion/webrtc) | none |
| 16 | webrtc.org: open source, backed by Apple, Google, Microsoft, Mozilla; all major browsers; native Android/iOS | verified | [webrtc.org](https://webrtc.org/) | none |
| 17 | GCC loss rules: above 10% cut, 2-10% hold, below 2% raise 5% | verified | [GCC draft-02](https://datatracker.ietf.org/doc/html/draft-ietf-rmcat-gcc-02) | none |
| 18 | Overuse resets rate to about 0.85 x incoming bitrate | verified | [GCC draft-02](https://datatracker.ietf.org/doc/html/draft-ietf-rmcat-gcc-02) | none |
| 19 | Set `maxRetransmits` or `maxPacketLifeTime` (ms), never both | verified | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel) (secondary, browser docs) | none (both throws SyntaxError) |

### udp-vs-tcp
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | TCP is "a reliable, in-order, byte-stream service" | verified | [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293) | none |
| 2 | RTO initial 1 s, minimum 1 s, doubles on each timeout | verified | [RFC 6298](https://www.rfc-editor.org/rfc/rfc6298) | none |
| 3 | TCP SHOULD use Nagle and MUST let apps disable it per connection | verified | [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293) | none |
| 4 | Option is TCP_NODELAY [unverified] | verified | [tcp(7)](https://man7.org/linux/man-pages/man7/tcp.7.html) | flag removed; scoped to Linux; added source [7] |
| 5 | At 30 fps a frame is due every 33 ms | verified | arithmetic | none |
| 6 | QUIC runs over UDP; order only within a stream | verified | [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000) | none |
| 7 | Independent data should go on separate streams | verified | [RFC 9308](https://www.rfc-editor.org/rfc/rfc9308) | none |
| 8 | QUIC DATAGRAM frames not retransmitted; real-time media and gaming | verified | [RFC 9221](https://www.rfc-editor.org/rfc/rfc9221) | none |
| 9 | WebTransport: W3C CR Snapshot July 2026; streams and datagrams over HTTP/3; reliable-only over HTTP/2 | verified | [W3C WebTransport](https://www.w3.org/TR/webtransport/) | added exact date (30 July 2026) |
| 10 | 3-5% of networks block UDP; need TCP fallback | verified | [RFC 9308](https://www.rfc-editor.org/rfc/rfc9308) | added that these are 2016 measurements |
| 11 | Plant LAN round trips "well under a millisecond" | unverifiable | none opened | removed the number ("round trips are short") |
| 12 | 100 Hz commands with 40 ms RTT: about four commands held back | verified | arithmetic (labeled illustrative) | none |
| 13 | RFC dates: 9293 (2022), 9000 (2021), 9308 (2022), 9221 (2022), 6298 (2011) | verified | RFC pages above | none |

### network-impairments
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | RTP jitter D(i,j) and J += (abs(D) - J)/16 | verified | [RFC 3550](https://www.rfc-editor.org/rfc/rfc3550) | none |
| 2 | Urban LTE mean 81.9 ms, SD 29.5 ms (cited) | corrected | [Xiao et al., SECON 2019](https://wicon.arizona.edu/sites/default/files/2023-03/2019SECON_AdaptiveFog0.pdf) | primary figure shows mean 81.6 ms, SD 29.5 ms, round trip from a moving car to a fog server; rewritten as "about 82 ms" round trip; replaced the citing 2026 paper with the primary |
| 3 | RFC 4588: conferencing delay "usually excludes the use of retransmission" | verified | [RFC 4588](https://www.rfc-editor.org/rfc/rfc4588) | none |
| 4 | Prefer retransmission when RTT fits; otherwise FEC sized to observed loss | verified | [RFC 8854](https://www.rfc-editor.org/rfc/rfc8854) | none |
| 5 | FEC uses bandwidth even with no loss | verified | [RFC 8854](https://www.rfc-editor.org/rfc/rfc8854) | none |
| 6 | GCC lowers rate on spacing stretch or loss above 10% | verified | [GCC draft-02](https://datatracker.ietf.org/doc/html/draft-ietf-rmcat-gcc-02) | none |
| 7 | netem: delay with jitter, loss, rate, reordering | verified | [tc-netem(8)](https://man7.org/linux/man-pages/man8/tc-netem.8.html) | none |
| 8 | Opus in-band FEC about 20-30% depending on protection | verified | [RFC 8854](https://www.rfc-editor.org/rfc/rfc8854) | none |
| 9 | Flexible FEC (RFC 8627) recommended for video | verified | [RFC 8854](https://www.rfc-editor.org/rfc/rfc8854) | none |
| 10 | RFC dates: 3550 (2003), 4588 (2006), 8854 (2021) | verified | RFC pages above | none |

### watchdogs
| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Unattended motion = speed x timeout (30 mm, 125 mm examples) | verified | arithmetic | none |
| 2 | Hardware watchdog resets the computer when keepalives stop | verified | [Linux watchdog API](https://www.kernel.org/doc/html/latest/watchdog/watchdog-api.html) | none |
| 3 | Spot endpoints check in; wrong challenge-response does not reset timeout | verified | [Spot E-Stop docs](https://dev.bostondynamics.com/docs/concepts/estop_service) | none |
| 4 | Actuators powered only while every endpoint's check-in is within its timeout | verified | [Spot E-Stop docs](https://dev.bostondynamics.com/docs/concepts/estop_service) | none |
| 5 | CUT (immediate power cut) and SETTLE_THEN_CUT (stop and sit, then cut) | verified | [Spot E-Stop docs](https://dev.bostondynamics.com/docs/concepts/estop_service) | none |
| 6 | Page does not say which stop level a lapsed timeout triggers | verified | [Spot E-Stop docs](https://dev.bostondynamics.com/docs/concepts/estop_service) | none |
| 7 | IEC 60204-1 stop categories 0, 1, 2 [unverified] | verified | [UR manual, Stop Categories](https://www.universal-robots.com/manuals/EN/HTML/SW10_7/Content/prod-usr-man/complianceUR30/stop_categories_UR20_en.htm) (manufacturer summary; standard text not opened) | flag removed; attributed to UR's summary; added source [4] |
| 8 | RTDE: "Inputs retain their last received value" | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 9 | RTDE 500 Hz on e-Series and ur-Series | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 10 | "Data-center servers" reboot via hardware watchdog | corrected | [Linux watchdog API](https://www.kernel.org/doc/html/latest/watchdog/watchdog-api.html) | source does not mention data centers; reworded to Linux machines with `/dev/watchdog` |
| 11 | `/dev/watchdog` kept alive by periodic writes | verified | [Linux watchdog API](https://www.kernel.org/doc/html/latest/watchdog/watchdog-api.html) | none |

### Notes
- Every source URL in the file was loaded during this check except the 2605.15952 TUM paper, which was loaded and then removed because each number taken from it was a citation of another paper (Kerbl et al. 2025, Xiao et al. 2019); both primaries now replace it.
- Remaining secondary sources: Wikipedia HEVC (25-50% range, alongside the ITU primary), Road to VR and TechCrunch (news reports on company status), MDN (browser API docs).
- Illustrative numbers (cheese plate settings, code sketch budgets, timeouts) were checked for plausibility and labeling only; all are labeled illustrative and sit inside the sourced ranges.
