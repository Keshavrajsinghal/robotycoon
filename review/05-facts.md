## Area 5, Compute and electronics: fact check

Summary line: 129 claims checked: 104 verified, 13 corrected, 12 unverifiable (7 kept flagged, 5 removed).

Notes on method. Every cited URL in the file was loaded and checked against the sentence that cites it. Generic explanations of how something works (for example "drives run faster current loops between setpoints") are not itemized; specific facts, numbers, dates, product names, standard clauses and company status are. Of the 14 `[unverified]` flags in the file before this pass, 9 were resolved (verified or corrected) and 5 are still flagged; 2 new flags were added where a cited source did not support a claim and no other source loaded. The web-search quota ran out partway through; later checks used direct fetches of known URLs and the Wikipedia API. Several vendor sites (Rockwell, Pilz, Siemens support, CODESYS, ABB product pages) returned 403, 429 or timeouts to automated fetches, which drives most of the remaining unverifiable rows. "secondary" marks Wikipedia, trade press, mirrors and third-party documentation.

### robot-controller

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Controller cabinet holds amplifiers and I/O; larger FANUC cabinets give more room | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) | none |
| 2 | R-30iB Plus comes in several cabinet sizes (Mate, A, B) | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) | none |
| 3 | R-50iA uses a new six-channel amplifier | corrected | [FANUC R-50iA product page](https://www.fanucamerica.com/products/controller-series/r-50ia) | press release [4] says "new amplifier" but not six-channel; re-cited to the product page, added as source 8 |
| 4 | UR e-Series and UR Series real-time loop 500 Hz (2 ms) | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 5 | RTDE on TCP port 30004 | verified | [UR RTDE guide](https://docs.universal-robots.com/tutorials/communication-protocol-tutorials/rtde-guide.html) | none |
| 6 | KUKA RSI: 12 ms normal, 4 ms fast | verified | [Quanser RSI docs](https://docs.quanser.com/quarc/documentation/kuka_rsi_block.html) (secondary); [KUKA RSI page](https://www.kuka.com/en-de/products/robot-systems/software/hub-technologies/kuka_robotsensorinterface) | added KUKA primary (4 ms) as source 9; Quanser labeled third-party |
| 7 | RSI available on KR C4 and KR C5 | verified | [Quanser RSI docs](https://docs.quanser.com/quarc/documentation/kuka_rsi_block.html) (secondary) | none |
| 8 | Pendant has an e-stop and a three-position enabling switch | verified | [KUKA smartPAD](https://kuka.com/en-de/products/robot-systems/robot-controllers/kuka-smartpad-pro); [OSHA OTM IV-4](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) | OSHA does not mention the pendant e-stop; added KUKA smartPAD as source 10 |
| 9 | Releasing or squeezing the enabling switch stops motion | verified | [OSHA OTM IV-4](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) | none (OSHA cites ANSI/RIA R15.06-2012) |
| 10 | Manual mode runs at reduced speed | verified | [OSHA OTM IV-4](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) | range added: 250 mm/s or less |
| 11 | FANUC Dual Check Safety monitors zones and speeds | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) | none |
| 12 | R-50iA runs Python scripts and software PLC logic | verified | [FANUC R-50iA press release](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) | none |
| 13 | Controllers speak EtherNet/IP, PROFINET, OPC UA | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) | none |
| 14 | 200 plates/h gives 18 s per plate | verified | arithmetic (3600 / 200) | none |
| 15 | R-50iA announced in the US in August 2024 | verified | [FANUC R-50iA press release](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) | source date made exact (27 August 2024) |
| 16 | R-50iA certified to IEC 62443 (source annotation) | verified | [FANUC R-50iA press release](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) | none (IEC 62443-4-1 and 4-2) |
| 17 | Both FANUC families use the iPendant and Mate, A, B cabinets | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus); [FANUC R-50iA](https://www.fanucamerica.com/products/controller-series/r-50ia) | none |
| 18 | KR C5 is current, KR C4 older, both use smartPAD | verified | [KUKA smartPAD](https://kuka.com/en-de/products/robot-systems/robot-controllers/kuka-smartpad-pro); [Quanser](https://docs.quanser.com/quarc/documentation/kuka_rsi_block.html) (secondary) | citation added |
| 19 | ABB OmniCore programmed with the FlexPendant | verified | [ABB OmniCore operating manual](https://www.manualslib.com/manual/2131954/Abb-Omnicore.html) (secondary mirror) | source 11 added; abb.com timed out |
| 20 | ABB agreed Oct 2025 to sell robotics to SoftBank, close mid-to-late 2026 | verified | [SoftBank press release](https://group.softbank/en/news/press/20251008) | none |
| 21 | Deal status as of Nov 2026 | corrected | [The Robot Report, 5 Nov 2026](https://www.therobotreport.com/chinese-regulators-block-softbanks-5-4b-acquisition-of-abb-robotics/) (secondary) | "could not confirm" replaced: not closed; China's security review prohibited the acquisition in China; talks continue |
| 22 | UR control box runs PolyScope | verified | [UR PolyScope](https://www.universal-robots.com/products/polyscope/) | none |
| 23 | Yaskawa YRC1000 is the controller for Motoman arms | verified | [Motoman YRC1000](https://motoman.com/products/controllers/yrc1000) | source 12 added; added "successor to DX200" |
| 24 | RSI used for seam tracking on welding robots | verified | [KUKA RSI page](https://www.kuka.com/en-de/products/robot-systems/software/hub-technologies/kuka_robotsensorinterface) | citation added |
| 25 | External motion cycle about 2-12 ms across vendors | verified | derived from rows 4 and 6 | none |

### onboard-compute

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Orin Nano up to 67 TOPS at 7-25 W | verified | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | none |
| 2 | Orin Nano 40 TOPS at 7-15 W on another NVIDIA page | verified | [NVIDIA Jetson Orin](https://www.nvidia.com/en-eu/autonomous-machines/embedded-systems/jetson-orin/) | none |
| 3 | AGX Orin up to 275 TOPS at 15-60 W | verified | [NVIDIA Jetson Orin](https://www.nvidia.com/en-eu/autonomous-machines/embedded-systems/jetson-orin/); [modules](https://developer.nvidia.com/embedded/jetson-modules) | none (watts only on the Orin page) |
| 4 | AGX Thor up to 2070 FP4 TFLOPS at 40-130 W | verified | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | none |
| 5 | Thor modules are T5000 and T4000 | verified | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | none |
| 6 | Thor is "NVIDIA's highest-performance embedded module as of 2026" | corrected | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | reworded to what the page supports: top of the Jetson line as of November 2026 |
| 7 | Orin generation spans 275 down to 67 TOPS | verified | [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/jetson-modules) | none |
| 8 | PREEMPT_RT: near-full preemption, threaded interrupts, lower scheduling latency | verified | [kernel.org PREEMPT_RT theory](https://docs.kernel.org/core-api/real-time/theory.html) | none |
| 9 | Merged into mainline after about 20 years | verified | [Kernel Newbies Linux 6.12](https://kernelnewbies.org/Linux_6.12) (secondary) | none |
| 10 | Linux 6.12 released 17 November 2024 | verified | [Kernel Newbies Linux 6.12](https://kernelnewbies.org/Linux_6.12) (secondary) | none |
| 11 | TwinCAT 3 runs PLCs "under its own real-time OS or Beckhoff RT Linux" | corrected | [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) | corrected to Windows, TwinCAT/BSD, or Beckhoff RT Linux |
| 12 | AMR protective stop runs on separate certified hardware such as a safety scanner | unverifiable | none loaded (SICK pages did not render) | flagged (reason updated) |
| 13 | IPCs from Beckhoff, Siemens SIMATIC IPC, Advantech | verified | [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html); [Siemens PC-based automation](https://www.siemens.com/global/en/products/automation/pc-based.html); [Advantech](https://en.wikipedia.org/wiki/Advantech) (secondary) | none |
| 14 | AMR Jetson power envelope 15-60 W | verified | [NVIDIA Jetson Orin](https://www.nvidia.com/en-eu/autonomous-machines/embedded-systems/jetson-orin/) | none |

### plc

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | GM Hydramatic asked for a relay replacement in 1968 | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none; no primary history page loaded |
| 2 | Result was the Modicon 084, built 1969 | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 3 | Scan cycle: read inputs, execute, write outputs | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 4 | Scan then handles communications and diagnostics | unverifiable | cited [1] lists only three steps; vendor manuals blocked | flagged (new flag) |
| 5 | Scan time from 50 µs on PC-based PLCs | verified | [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) | none |
| 6 | "Tens of milliseconds for a large program" | corrected | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | source says typically tens of ms, not "large program"; reworded |
| 7 | PLC is a hard real-time system | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | none |
| 8 | Most PLCs time their scan with a watchdog | unverifiable | Siemens and CODESYS manuals did not load | flagged (reason updated) |
| 9 | IEC 61131-3 languages LD, FBD, ST, SFC | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary); [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) | none |
| 10 | Instruction List deprecated in the third edition, cited [1][2] | corrected | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | Beckhoff [2] lists IL with no deprecation; citation narrowed to [1]; added year 2013 |
| 11 | Current edition of IEC 61131-3 | corrected | [IEC webstore](https://webstore.iec.ch/en/publication/68533) | text implied the 2013 edition was current; added fourth edition, May 2025 (source 4); IL removal in ed. 4 not stated since Annex B was not readable |
| 12 | PC-based runtimes put PLCs on industrial PCs | verified | [Beckhoff TC1200](https://www.beckhoff.com/en-us/products/automation/twincat/tc1xxx-twincat-3-base/tc1200.html) | none |
| 13 | FANUC R-50iA runs software PLC logic | verified | [FANUC R-50iA press release](https://www.fanucamerica.com/press-releases/fanucs-new-r-50ia-robot-controller-provides-powerful-performance) | none |
| 14 | Car body line PLC sequences dozens of robots | unverifiable | no plant source found | flagged (unchanged) |
| 15 | Siemens S7-1500 and S7-1200, programmed in TIA Portal | verified | [Siemens S7-1500](https://www.siemens.com/global/en/products/automation/systems/industrial/plc/s7-1500.html); [Simatic S7](https://en.wikipedia.org/wiki/Simatic_S7) (secondary) | none |
| 16 | Rockwell ControlLogix, programmed in Studio 5000 Logix Designer | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | citation added; Rockwell site returned 403 |
| 17 | Rockwell CompactLogix | unverifiable | Rockwell site returned 403; not in loaded sources | removed |
| 18 | CODESYS is licensed by many hardware makers | verified | [CODESYS](https://en.wikipedia.org/wiki/CODESYS) (secondary) | added manufacturer's "at least 400 device makers" with attribution (source 5); codesys.com returned 429 |
| 19 | Fast pulses go to high-speed counter or interrupt inputs | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | flag removed and cited; "interrupt inputs" dropped (source covers counter modules only) |

### industrial-network

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | EtherCAT devices read and write the frame on the fly | verified | [ETG technology](https://www.ethercat.org/en/technology.html) | none |
| 2 | EtherCAT designed for cycles of 100 µs or less | verified | [ETG technology](https://www.ethercat.org/en/technology.html) | none |
| 3 | Distributed clocks give jitter well under 1 µs | verified | [ETG technology](https://www.ethercat.org/en/technology.html) | none |
| 4 | Up to 65,535 devices per segment | verified | [ETG technology](https://www.ethercat.org/en/technology.html) | none |
| 5 | PROFINET RT typically 1-10 ms | verified | [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) (secondary); [PI North America](https://us.profinet.com/is-profinet-deterministic/) | range added: RT spans 250 µs to 512 ms (source 7) |
| 6 | IRT down to 31.25 µs, clocks within 1 µs | verified | [PI North America IRT](https://us.profinet.com/?p=19941); [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) (secondary) | added 250 µs default and Conformance Class C requirement (source 11) |
| 7 | EtherNet/IP carries CIP over TCP/IP, UDP for cyclic I/O | verified | [ODVA EtherNet/IP](https://www.odva.org/technology-standards/key-technologies/ethernet-ip/) | none |
| 8 | Modbus descends from a 1979 Modicon protocol | verified | [Wikipedia Modbus](https://en.wikipedia.org/wiki/Modbus) (secondary) | none |
| 9 | Modbus TCP uses port 502 | verified | [Modbus Organization](https://www.modbus.org/news/modbus-security-new-protocol-to-improve-control-system-security) | primary added (source 9) |
| 10 | Client polls each device in turn | verified | [Wikipedia Modbus](https://en.wikipedia.org/wiki/Modbus) (secondary) | none |
| 11 | Modbus "has no built-in security" | corrected | [Modbus Organization](https://www.modbus.org/news/modbus-security-new-protocol-to-improve-control-system-security) | narrowed to the original protocol; added Modbus/TCP Security (2018, TLS, port 802) |
| 12 | IO-Link is IEC 61131-9, point-to-point | verified | [Wikipedia IO-Link](https://en.wikipedia.org/wiki/IO-Link) (secondary); [Beckhoff IO-Link](https://www.beckhoff.com/en-gb/products/i-o/overview-fieldbus-systems/io-link/) | none |
| 13 | Unshielded cable up to 20 m | verified | [ifm IO-Link wiring](https://www.ifm.com/us/en/shared/technologies/io-link/technology/io-link-wiring) | primary added (source 8) |
| 14 | 4.8, 38.4, 230.4 kbaud | verified | [ifm IO-Link wiring](https://www.ifm.com/us/en/shared/technologies/io-link/technology/io-link-wiring); [Wikipedia IO-Link](https://en.wikipedia.org/wiki/IO-Link) (secondary) | none |
| 15 | Minimum transmission time about 400 µs at COM3 | verified | [Wikipedia IO-Link](https://en.wikipedia.org/wiki/IO-Link) (secondary) | none; no primary loaded |
| 16 | IO-Link carries diagnostics such as a dirty lens warning | verified | [Wikipedia IO-Link](https://en.wikipedia.org/wiki/IO-Link) (secondary) | none |
| 17 | OPC UA: X.509 certificates, encryption, client-server and PubSub | verified | [OPC Foundation](https://opcfoundation.org/about/opc-technologies/opc-ua/) | none |
| 18 | PROFIsafe adds sequence numbers, timeouts, checksums | verified | [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) (secondary) | none; profibus.com PROFIsafe pages returned 404/401 |
| 19 | CIP Safety is an ODVA technology | verified | [ODVA EtherNet/IP](https://www.odva.org/technology-standards/key-technologies/ethernet-ip/) | none |
| 20 | Flow wrappers typically use EtherCAT or PROFINET IRT | unverifiable | PI says only that drives and motion control may need IRT | flagged (reason updated) |
| 21 | Beckhoff EK1100 couples I/O terminals to EtherCAT | verified | [Beckhoff EK1100](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/ek1xxx-bk1xx0-ethercat-coupler/ek1100.html) | none |
| 22 | PROFINET built into Siemens SIMATIC PLCs | verified | [Simatic S7](https://en.wikipedia.org/wiki/Simatic_S7) (secondary) | reworded to "standard on S7-1500" and cited (source 12) |
| 23 | EtherNet/IP and CIP Safety native to Rockwell Logix PLCs | unverifiable | Rockwell site returned 403 | flagged (new flag) |
| 24 | OPC UA servers built into robot controllers and PLCs | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus) | none (one robot example confirmed) |
| 25 | Wireshark decodes EtherCAT, PROFINET, EtherNet/IP, Modbus TCP | verified | [Wireshark dfref ecat](https://www.wireshark.org/docs/dfref/e/ecat.html), [pn_io](https://www.wireshark.org/docs/dfref/p/pn_io.html), [enip](https://www.wireshark.org/docs/dfref/e/enip.html), [mbtcp](https://www.wireshark.org/docs/dfref/m/mbtcp.html) | citation added (source 10) |

### safety-circuit

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | ISO 13849-1 categories 3 and 4 are redundant; in cat 3 no single fault loses the function | verified | [Wikipedia ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) (secondary) | none; iso.org returned 403 |
| 2 | Safety relay: two relays with forced-guided contacts, two channels, feedback loop, no restart after fault | verified | [Wikipedia Safety relay](https://en.wikipedia.org/wiki/Safety_relay) (secondary) | none |
| 3 | Safety PLC has a restricted instruction set plus safety instructions | corrected | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | cited ISO 13849 page [1] does not say this; re-cited to PLC article (source 7) |
| 4 | Safety PLC hardware is internally redundant and self-testing | unverifiable | Rockwell manuals returned 403 | flagged (reason updated) |
| 5 | Safety over EtherCAT is black channel, SIL 3 | verified | [Beckhoff TwinSAFE](https://www.beckhoff.com/en-us/products/automation/twinsafe/) | none |
| 6 | PROFIsafe reaches SIL 3 with sequence numbers, timeouts, address checks, checksums | verified | [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) (secondary) | none |
| 7 | STO removes torque-producing energy and prevents unexpected start | verified | [Wikipedia STO](https://en.wikipedia.org/wiki/Safe_Torque_Off) (secondary); [SEW-EURODRIVE STO](https://download.sew-eurodrive.com/download/html/31960413/en-EN/28733575051.html) | none |
| 8 | IEC 61800-5-2 defines STO | verified | [SEW-EURODRIVE STO](https://download.sew-eurodrive.com/download/html/31960413/en-EN/28733575051.html) | flag removed; added "STO alone is stop category 0" (source 8) |
| 9 | PL a to e from just under 10⁻⁴ to 10⁻⁸ per hour | verified | [Wikipedia ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) (secondary) | none |
| 10 | ISO 13849-1 fourth edition 2023 | verified | [Wikipedia ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) (secondary) | none |
| 11 | SIL 1-3 bands per hour (10⁻⁵ to 10⁻⁸) | verified | [Wikipedia SIL](https://en.wikipedia.org/wiki/Safety_integrity_level) (secondary) | none |
| 12 | SIL from IEC 61508, applied to machinery by IEC 62061 | verified | [Wikipedia SIL](https://en.wikipedia.org/wiki/Safety_integrity_level) (secondary) | none |
| 13 | PL d about SIL 2, PL e about SIL 3 | verified | [IFA, ESPE type vs SIL/PL](https://dguv.de/medien/ifa/en/pra/bws/info_bws_sil_pl_en.pdf) | flag removed; reworded as the pairing IEC 61496-1 uses, added PL c to SIL 1 (source 9) |
| 14 | ISO 10218-1:2011 set PL d with category 3 as default | corrected | [SICK on ISO 10218](https://www.sick.com/br/en/more-safety-for-humans-and-machines/w/blog-robotic-norm-iso10218) | flag removed; blanket PL d confirmed, "category 3" not confirmed and dropped; added that the 2025 edition sets PL per function (source 10) |
| 15 | DC 60-99% for cat 2 and 3, 99% or more for cat 4 | verified | [Wikipedia ISO 13849](https://en.wikipedia.org/wiki/ISO_13849) (secondary); [Keyence DC bands](https://www.keyence.com/ss/products/safetyknowledge/performance/parameter/) | none |
| 16 | Pilz PNOZ: long-running family for e-stops, doors, light curtains | corrected | [Pilz, German Wikipedia](https://de.wikipedia.org/wiki/Pilz_GmbH_%26_Co._KG) (secondary) | pilz.com returned 403; reduced to what loads: first PNOZ e-stop relay in 1987 (source 11) |
| 17 | Siemens S7-1500F are fail-safe versions of the S7-1500 | verified | [Simatic S7](https://en.wikipedia.org/wiki/Simatic_S7) (secondary) | added "up to SIL 3 and PL e" with citation (source 12) |
| 18 | S7-1500F uses PROFIsafe | unverifiable | Siemens pages did not state it; Wikipedia silent | removed (PROFIsafe still covered under industrial networks) |
| 19 | GuardLogix are safety PLCs in the Logix family | verified | [Wikipedia PLC](https://en.wikipedia.org/wiki/Programmable_logic_controller) (secondary) | citation added |
| 20 | GuardLogix uses CIP Safety | unverifiable | Rockwell site returned 403 | removed |
| 21 | TwinSAFE logic in EtherCAT terminals, up to SIL 3 | verified | [Beckhoff TwinSAFE](https://www.beckhoff.com/en-us/products/automation/twinsafe/) | none |
| 22 | FANUC DCS and ABB SafeMove limit zones and speeds | verified | [FANUC R-30iB Plus](https://www.fanucamerica.com/products/robots/series/r-30ib-plus); [ABB OmniCore manual](https://www.manualslib.com/manual/2131954/Abb-Omnicore.html) (secondary mirror, names SafeMove2) | none |
| 23 | Safety protocols can share the normal Ethernet cable | verified | [Wikipedia PROFINET](https://en.wikipedia.org/wiki/PROFINET) (secondary); [ODVA](https://www.odva.org/technology-standards/key-technologies/ethernet-ip/) | none |

### estop

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Directive: e-stop clearly identifiable, visible, quickly accessible | verified | [Directive 2006/42/EC Annex I 1.2.4.3](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 2 | Stop as quickly as possible without new risks | verified | [Directive 2006/42/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 3 | Stop command latches; release must not restart | verified | [Directive 2006/42/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 4 | Works in every operating mode | verified | [Directive 2006/42/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 5 | E-stop is a backup to guards, not a substitute | verified | [Directive 2006/42/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 6 | Assemblies: e-stop must also stop related equipment (1.2.4.4) | verified | [Directive 2006/42/EC](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006L0042) | none |
| 7 | Regulation (EU) 2023/1230 replaces the Directive | verified | [Regulation 2023/1230, Art. 51](https://eur-lex.europa.eu/eli/reg/2023/1230/oj) | none |
| 8 | Regulation applies from 14 January 2027 | corrected | [Corrigendum, OJ L 169, 4.7.2023](https://eur-lex.europa.eu/eli/reg/2023/1230/corrigendum/2023-07-04/oj/eng); [EU-OSHA](https://osha.europa.eu/en/legislation/directive/regulation-20231230eu-machinery) | 14 January corrected to 20 January 2027; corrigendum added (source 6) |
| 9 | ISO 13850 sets design principles for the e-stop function | verified | [Not-Halt, German Wikipedia](https://de.wikipedia.org/wiki/Not-Halt) (secondary) | none |
| 10 | Red actuator on yellow background | verified | [Not-Halt](https://de.wikipedia.org/wiki/Not-Halt) (secondary); [Control Design](https://www.controldesign.com/articles/2021/standards-and-options-for-e-stops/) (secondary) | none |
| 11 | Wired normally closed so a broken wire stops the machine | verified | [Wikipedia Kill switch](https://en.wikipedia.org/wiki/Kill_switch) (secondary) | none |
| 12 | IEC 60204-1 stop categories 0, 1, 2; cat 2 only where cutting power is impossible or dangerous | verified | [Not-Halt](https://de.wikipedia.org/wiki/Not-Halt) (secondary); [ABB IRC5 manual](https://www.manualslib.com/manual/2133741/Abb-Irc5.html?page=13) (secondary mirror) | none |
| 13 | OSHA: safety-rated monitored stop is a category 2 stop per NFPA 79 | verified | [OSHA OTM IV-4](https://www.osha.gov/otm/section-4-safety-hazards/chapter-4) | none (NFPA 79-2017) |
| 14 | E-stop must be category 0 or 1 | verified | [Control Design](https://www.controldesign.com/articles/2021/standards-and-options-for-e-stops/) (secondary, quoting Omron and Phoenix Contact) | flag removed; cited IEC 60204-1 and NFPA 79 (source 7) |
| 15 | Industrial robots commonly use category 1 | corrected | [ABB IRC5 manual](https://www.manualslib.com/manual/2133741/Abb-Irc5.html?page=13) (secondary mirror) | flag removed; ABB IRC5 defaults to category 0, so rewritten as "depends on vendor and settings" (source 8) |
| 16 | Direct-opening contacts, IEC 60947-5-5 | verified | [Schneider Electric FAQ](https://www.se.com/ie/en/faqs/FA23719) | flag removed; cited (source 9) |
| 17 | Latches; released by turning, pulling, or key | verified | [Not-Halt](https://de.wikipedia.org/wiki/Not-Halt) (secondary) | none |
| 18 | Rope-pull switches along conveyors | verified | [Schmersal](https://www.schmersal.com/en/) | none |
| 19 | Escalator rules limit braking | verified | [Smith, escalator safety paper](https://liftescalatorlibrary.org/paper_indexing/papers/00000567.pdf) | flag removed; range added: 0.91 m/s² (ASME A17.1) to 1.0 m/s² (EN 115) (source 10) |
| 20 | E-stop is not lockout | verified | [29 CFR 1910.147(b)](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147) | flag removed; added that push buttons are not energy-isolating devices (source 11) |
| 21 | E-stop examples: Siemens SIRIUS ACT, Schneider Harmony | unverifiable | Siemens and se.com range pages returned 404/403 | removed; replaced with Schneider trigger-action e-stops to IEC 60947-5-5, which loaded |
| 22 | Rope-pull vendors include Pilz | unverifiable | pilz.com returned 403 | removed (Schmersal kept) |
| 23 | Teach pendants carry an e-stop | verified | [KUKA smartPAD](https://kuka.com/en-de/products/robot-systems/robot-controllers/kuka-smartpad-pro) | none (confirmed for one vendor) |
