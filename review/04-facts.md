## Area 4, Sensors: fact check

Summary line: 197 claims checked: 169 verified, 24 corrected, 4 unverifiable (1 kept flagged, 3 removed).

Of the 17 original `[unverified]` flags, 16 were resolved (13 now cited, 3 removed with their claims) and 1 is kept (SICK scanners). Status checked as of November 2026: Basler ace 2, RealSense D400 (sold by RealSense, Inc. under license from Intel), Zivid 2+/3, Basler blaze-101, Keyence SZ-V and PR-G, Livox Mid-360, Ouster OS1 (product page now shows the Rev8 family), Bosch BMI088 (page live; distributors out of stock), moveit_calibration (not archived; has a ros2 branch). Arithmetic in worked examples was recomputed; illustrative numbers were checked for plausibility.

Secondary sources kept (no primary loaded): Quality Magazine trade article (Edmund Optics page returned 403), OpenCV forum thread, Pepperl+Fuchs vendor blog, Cornell LII copy of 16 CFR 1211.8 (eCFR redirects bots).

### camera-2d

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | a2A1920-160ucBAS 1920 x 1200 default, about 2.3 MP | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 2 | 3.45 µm pixels | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 3 | 1/2.3-inch sensor | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 4 | 25 mm lens sees twice as wide at 600 mm as at 300 mm | verified | [Quality Magazine, Imaging Lens](https://qualitymag.com/articles/91115-imaging-lens) (secondary, trade press) | marked trade press in Sources |
| 5 | FOV ≈ sensor width x WD / focal length (pinhole) | verified | derivation; consistent with [Quality Magazine](https://qualitymag.com/articles/91115-imaging-lens) (secondary) | none |
| 6 | 164 fps on USB 3.0 | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 7 | 51 fps for IP67 GigE version | verified | [Basler a2A1920-51gcIP67](https://docs.baslerweb.com/a2a1920-51gcip67) | none |
| 8 | GigE carries fewer bits per second (5 vs 1 Gbit/s) | verified | [Basler 160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas), [Basler 51gcIP67](https://docs.baslerweb.com/a2a1920-51gcip67) | none |
| 9 | Exposure 19 µs to 10 s | verified | [Basler Exposure Time](https://docs.baslerweb.com/exposure-time) | none |
| 10 | Ultra-short mode 1-14 µs | verified | [Basler Exposure Time](https://docs.baslerweb.com/exposure-time) | none |
| 11 | Rolling shutter distorts fast-moving objects | verified | [Basler Electronic Shutter Types](https://docs.baslerweb.com/electronic-shutter-types) | none |
| 12 | Rolling shutter has significantly lower noise | corrected | [Basler Electronic Shutter Types](https://docs.baslerweb.com/electronic-shutter-types) | "noise" to "ambient noise", matching Basler wording |
| 13 | Rolling shutter sensors usually cheaper | unverifiable | Basler learning pages returned 406; Basler white paper PDF unreadable; Balluff 403 | removed (concept reads fine without it) |
| 14 | Basler recommends flash lighting against rolling-shutter effect | verified | [Basler Electronic Shutter Types](https://docs.baslerweb.com/electronic-shutter-types) | none |
| 15 | Keyence: lighting one of the most important factors | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 16 | Dome light removes glare on shiny/curved parts | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 17 | Backlight gives silhouette for outline measurement | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 18 | Low-angle light shows scratches and texture | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 19 | Complementary color makes object nearly black on mono camera | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 20 | Sensor 6.68 mm wide (1936 x 3.45 µm) | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) + arithmetic | none |
| 21 | 334 mm FOV, 0.17 mm/px at 600 mm, 12 mm lens (illustrative) | verified | arithmetic | none |
| 22 | Exposure under about 0.85 ms at 100 mm/s for half-pixel smear (illustrative) | verified | arithmetic (0.86 ms) | none |
| 23 | USB model is IP30 | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 24 | IP67 body, -10 to 60 C housing range | verified | [Basler a2A1920-51gcIP67](https://docs.baslerweb.com/a2a1920-51gcip67) | none |
| 25 | 2 m/s belt, 0.2 mm/px needs under 100 µs (illustrative) | verified | arithmetic | none |
| 26 | Rolling shutter skews a moving barcode | verified | [Basler Electronic Shutter Types](https://docs.baslerweb.com/electronic-shutter-types) | none |
| 27 | ace 2 in USB 3.0, GigE, IP67 GigE; 160ucBAS is 2.3 MP global shutter color | verified | [Basler 160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas), [Basler 51gcIP67](https://docs.baslerweb.com/a2a1920-51gcip67) | none |
| 28 | Sony IMX392 inside both models | verified | [Basler 160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas), [Basler 51gcIP67](https://docs.baslerweb.com/a2a1920-51gcip67) | none |
| 29 | C-mount lens mount | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) | none |
| 30 | Keyence guide covers ring, bar, dome, backlight, coaxial, low-angle | verified | [Keyence lighting basics](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) | none |
| 31 | 1920 x 1200 x 8 bit x 164 fps ≈ 3 Gbit/s, under USB 3.0 5 Gbit/s, about 3x GigE | verified | [Basler a2A1920-160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas) + arithmetic | none |
| 32 | Products current (ace 2 models documented) | verified | [Basler docs](https://docs.baslerweb.com/a2a1920-160ucbas) | none |

### depth-camera

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | depth = focal length x baseline / disparity | verified | [librealsense Depth from Stereo](https://raw.githubusercontent.com/IntelRealSense/librealsense/master/doc/depth-from-stereo.md) | none |
| 2 | Stereo depth error grows with square of distance | corrected | [RealSense tuning guide](https://dev.realsenseai.com/docs/tuning-depth-cameras-for-best-performance) | was cited to librealsense doc [3], which does not say it; now cites new [6] |
| 3 | IR projector "sprays a dot pattern" on blank surfaces | corrected | [librealsense Depth from Stereo](https://raw.githubusercontent.com/IntelRealSense/librealsense/master/doc/depth-from-stereo.md) | reworded to "paints an invisible texture" (source says texture outside visible spectrum, not dots) |
| 4 | Minimum range exists; scales with resolution | verified | [RealSense tuning guide](https://dev.realsenseai.com/docs/tuning-depth-cameras-for-best-performance) | citation [6] added, "grows with image resolution" added |
| 5 | D435 min range about 28 cm at full resolution | verified | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | none |
| 6 | D405 min range 7 cm | verified | [RealSense D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) | none (page says 7 cm at 480p) |
| 7 | MR60 80 µm point precision "at a 350-900 mm optimal distance" | corrected | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | page lists precision and optimal distance separately; reworded to "80 µm ... and a 350-900 mm optimal working distance" |
| 8 | Structured light scene must hold still (capture time) | verified | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | flag removed; range added: 25-1500 ms typical capture time for 2+ models |
| 9 | blaze-101 ±5 mm over 0.5-5.5 m | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 10 | blaze-101 640 x 480 | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 11 | Accuracy test: 90% white target, no ambient light, 22 C, 20 min warm-up | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 12 | Dark, shiny, wet, transparent items measure worse | corrected | [Zivid shiny objects](https://support.zivid.com/academy/camera/capturing-high-quality-point-clouds/dealing-with-highlights-and-shiny-objects.html), [Zivid transparent objects](https://support.zivid.com/en/latest/camera/academy/camera/capturing-high-quality-point-clouds/dealing-with-transparent-objects.html) | flag removed; rewritten to what Zivid documents (shiny saturates pixels, transparent surfaces missed or measured behind); "dark" dropped (no source) |
| 13 | MR60 at 600 mm: 570 x 460 mm, 0.24 mm spacing | verified | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | none |
| 14 | D405 ±2% at 50 cm ≈ ±10 mm | verified | [RealSense D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) + arithmetic | none |
| 15 | Error at 20 cm several times smaller than at 50 cm | verified | arithmetic ((20/50)² = 0.16) | none |
| 16 | Zivid IP65 | verified | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | none |
| 17 | D405 page lists no IP rating | verified | [RealSense D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) | none |
| 18 | blaze-101 range 0.3-10 m | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 19 | blaze-101 IP67 | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 20 | D435 ideal range 0.3-3 m | verified | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | none |
| 21 | D435 global shutter depth sensors | verified | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | none |
| 22 | D435 under 2% at 2 m | verified | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | none |
| 23 | Sold by RealSense, Inc. under license from Intel (2026) | verified | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | none |
| 24 | D405 range 7-50 cm | verified | [RealSense D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) | none |
| 25 | Zivid models MR60, MR130, LR110 (2+), XL250 (3) | verified | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | none |
| 26 | librealsense is the open-source SDK; doc explains stereo | verified | [librealsense Depth from Stereo](https://raw.githubusercontent.com/IntelRealSense/librealsense/master/doc/depth-from-stereo.md) | none |
| 27 | Zivid 2+ precision 80-260 µm over 300-2700 mm | verified | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | none |
| 28 | blaze-101 under 1 mm temporal noise | verified | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | none |
| 29 | 942.8 px, 54.8 mm, 0.1 px gives about 2 mm at 1 m, 8 mm at 2 m | verified | [librealsense Depth from Stereo](https://raw.githubusercontent.com/IntelRealSense/librealsense/master/doc/depth-from-stereo.md) + arithmetic (1.9, 7.7 mm) | none |

### lidar

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Lidar fires pulses and times echoes | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs), [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | none (definitional) |
| 2 | Hundreds of thousands of measurements per second (Plain) | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) (200,000 points/s) | none |
| 3 | OS1 128 channels over 45° vertical FOV | verified | [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | none |
| 4 | OS1 has several beam-spacing layouts | verified | [OS1 manual overview](https://static.ouster.dev/sensor-docs/hw_user_manual_OS1/hw_common_sections_OS1/os1-overview.html) | none |
| 5 | Mid-360 40 m at 10%, 70 m at 80% | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 6 | OS1 90 m at 10% | verified | [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | none |
| 7 | 0.35° spacing lands about 120 mm apart at 20 m | verified | arithmetic (45/127 = 0.354°, 124 mm) | none |
| 8 | Mid-360 precision at most 2 cm at 10 m | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 9 | Mid-360 0.1 m blind zone | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 10 | Mid-360 typical 10 Hz | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 11 | SZ-V32N Type 3 AOPDDR under IEC 61496-3 | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none |
| 12 | SZ-V32N PL d, Category 3 under ISO 13849-1 | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none |
| 13 | Protective and warning fields | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none |
| 14 | 8.4 m for 70-150 mm objects, 1.6 m for 20 mm | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none (standard mode figures) |
| 15 | Response time "starts at 80 ms" | corrected | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | 80 ms is high-speed mode only (range drops to 5.7 m); 160 ms in standard mode; up to 1408 ms; range added in Key numbers (80-1408 ms) |
| 16 | Each millisecond of response time adds safety distance (ISO 13855) | verified | [Keyence safety distance](https://keyence.com/ss/products/safetyknowledge/caution/scanner) | flag removed; added 1600 mm/s approach speed, so 1.6 mm per ms; new source [5] |
| 17 | Cheese-line scanner zone about 1.2 m deep (illustrative) | corrected | [Keyence safety distance](https://keyence.com/ss/products/safetyknowledge/caution/scanner) | implausible under ISO 13855 (the C term alone is about 1.08 m at 300 mm beam height); changed to about 2 m, citing Keyence's 2.1 m worked example |
| 18 | SZ-V IP65 | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none |
| 19 | AMR carries a 2D safety scanner that both maps and stops | corrected | [Omron LD series](https://industrial.omron.eu/en/products/ld-series) | flag removed; reworded to what Omron states (natural-feature navigation, onboard lasers detect obstacles and trigger a stop by speed); new source [6] |
| 20 | OS1 up to 10.4 M points/s, 90 m on dark targets | verified | [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | none |
| 21 | SZ-V 190°, 905 nm Class 1 laser | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | none |
| 22 | Mid-360 360° x 59°, IP67, built-in IMU | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 23 | SICK microScan3 and nanoScan3 are widely used safety scanners | unverifiable | sick.com product pages render empty; datasheet PDFs 404 or unreadable | kept flagged, reason updated |
| 24 | Mid-360 lists no safety rating | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none (only laser eye-safety Class 1) |
| 25 | Key number: protective range 1.6-8.4 m | corrected | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | qualified as standard mode; added 1.1-5.7 m in high-speed mode |
| 26 | OS1 shot limiting at 52 C, up to 20% loss | verified | [OS1 manual overview](https://static.ouster.dev/sensor-docs/hw_user_manual_OS1/hw_common_sections_OS1/os1-overview.html) | none |
| 27 | 0.1° spacing gives about 17 mm gaps at 10 m | verified | arithmetic (17.5 mm) | none |
| 28 | Smaller objects detected only at shorter range because beams spread | verified | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) (range by object size) + geometry | none |
| 29 | Products current (OS1 page shows Rev8, Mid-360 and SZ-V listed) | verified | [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | none |

### photo-eye

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Emitter is usually an LED | corrected | [Keyence photoelectric basics](https://www.keyence.com/ss/products/sensor/sensorbasics/photoelectric/info/), [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | Keyence says visible or infrared light; reworded to that, with "on the PR-G a red LED" [2] |
| 2 | Through-beam: separate housings, object blocks beam | verified | [Keyence photoelectric basics](https://www.keyence.com/ss/products/sensor/sensorbasics/photoelectric/info/) | none |
| 3 | Through-beam reaches farthest and is hardest to fool | verified | [Banner Photoelectric Sensor Solutions](https://info.bannerengineering.com/cs/groups/public/documents/literature/b_51180814.pdf) | added reason (color and finish do not matter) with new source [7] |
| 4 | PR-G through-beam 30 m | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 5 | Retroreflective: one housing plus reflector | verified | [Keyence photoelectric basics](https://www.keyence.com/ss/products/sensor/sensorbasics/photoelectric/info/) | none |
| 6 | PR-G retroreflective 0.1-4.2 m (with R-2L) | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 7 | Diffuse is called "reflective" by Keyence | verified | [Keyence photoelectric basics](https://www.keyence.com/ss/products/sensor/sensorbasics/photoelectric/info/) | none |
| 8 | PR-G diffuse 500 mm | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 9 | Diffuse sees dark or steeply angled surfaces less reliably | corrected | [Banner Photoelectric Sensor Solutions](https://info.bannerengineering.com/cs/groups/public/documents/literature/b_51180814.pdf) | flag removed; now "range shrinks sharply on dark or low-reflectivity targets"; "angled" dropped (no source) |
| 10 | PR-G response 0.5-1 ms | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 11 | 1 ms at 200 mm/s is 0.2 mm | verified | arithmetic | none |
| 12 | PLC usually adds more delay than the sensor; reads inputs once per cycle | corrected | [Beckhoff TwinCAT 3 Real-Time](https://infosys.beckhoff.com/content/1033/tc3_grundlagen/6828869003.html) | flag removed; once-per-cycle input copy now cited [4]; "usually more than the sensor" dropped (no cycle-time source) |
| 13 | Inductive: coil, HF field, eddy currents weaken oscillation; detects metal | verified | [Keyence proximity basics](https://www.keyence.com/ss/products/sensor/sensorbasics/proximity/info/) | wording aligned to source (load the circuit, oscillation attenuates) |
| 14 | Inductive ignores water and food debris | unverifiable | Omron technical guides return 403; Keyence page silent | removed |
| 15 | Inductive works over a few millimeters | corrected | [Keyence EV specs](https://www.keyence.com/products/sensor/proximity/ev/specs/) | flag removed; range added: 1.5-27 mm across EV series depending on sensor size; new source [5] |
| 16 | PR-G IP68 and IP69K, 316L housings | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 17 | Clear plastic passes light with little loss; use a transparent-object sensor | verified | [Pepperl+Fuchs blog](https://blog.pepperl-fuchs.com/en/2025/reliable-object-and-transparency-detection-photoelectric-sensors-in-packaging-technology/) (secondary, vendor blog) | flag removed; added 5-10% attenuation and polarizing reflector; new source [8] |
| 18 | Garage door photo-eye reverses a closing door | verified | [16 CFR 1211.8 (Cornell LII)](https://www.law.cornell.edu/cfr/text/16/1211.8) (secondary copy of regulation) | flag removed; reworded to the regulation's wording; "near the floor" and "child or pet" dropped; new source [9] |
| 19 | Inductive sensors detect steel (welding fixture example) | verified | [Keyence proximity basics](https://www.keyence.com/ss/products/sensor/sensorbasics/proximity/info/) | none |
| 20 | Photo-eyes answer in about a millisecond | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 21 | R-2L is the reflector for PR-G retro range | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |
| 22 | Inductive sensors use HF oscillation, sold by Keyence | verified | [Keyence proximity basics](https://www.keyence.com/ss/products/sensor/sensorbasics/proximity/info/) | none |
| 23 | Precise-timing systems use inputs that record the moment of change | verified | [Beckhoff EL1252](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el1xxx-digital-input/el1252.html) | flag removed; named EL1252 with 1 ns timestamp resolution; new source [6] |
| 24 | "The sensor is usually the fastest link" | corrected | none supports a general ranking | softened to "often not the slowest link" |
| 25 | Input filters and network transfers add delay | corrected | [Beckhoff EL1252](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el1xxx-digital-input/el1252.html) | kept input filters (cited); removed network transfers (no source) |
| 26 | PR-G still listed (status) | verified | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | none |

### imu

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Accelerometer measures acceleration incl. gravity; gyro measures rotation rate | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/), [VectorNav IMU specs](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) | none (definitional) |
| 2 | Robot IMUs are MEMS parts | corrected | [TDK ICM-40609-D](https://invensense.tdk.com/products/motion-tracking/6-axis/icm-40609-d/) | softened to "usually"; cited TDK's "6-axis MEMS" description; new source [5] |
| 3 | BMI088 aimed at drones and robots | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none |
| 4 | BMI088 up to ±24 g and ±2000 °/s | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none |
| 5 | BMI088 ODR 12.5 Hz to 2 kHz | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none |
| 6 | Mid-360 carries an ICM40609 | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) | none |
| 7 | ICM-40609 is a 6-axis MEMS part (TDK) | verified | [TDK ICM-40609-D](https://invensense.tdk.com/products/motion-tracking/6-axis/icm-40609-d/) | added |
| 8 | D435i includes an IMU | verified | [RealSense D435i](https://realsenseai.com/products/depth-camera-d435i/) | none |
| 9 | Camera/lidar frames arrive 10-90 times a second | verified | [Livox Mid-360](https://www.livoxtech.com/mid-360/specs) (10 Hz), [RealSense D435i](https://realsenseai.com/products/depth-camera-d435i/) (up to 90 fps) | citations [3][4] added |
| 10 | Bias is a constant offset | verified | [VectorNav IMU specs](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) | none |
| 11 | Bias instability is drift at constant temperature | verified | [VectorNav IMU specs](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) | none |
| 12 | Angle random walk grows with square root of time | verified | [VectorNav IMU specs](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) | none |
| 13 | BMI088 lifetime gyro offset ±1 °/s, so 60° per minute uncorrected | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) + arithmetic | none |
| 14 | 1 mg bias gives about 0.5 m after 10 s | verified | arithmetic (0.49 m) | none |
| 15 | Mobile robots blend IMU with encoders, lidar, cameras | verified | [robot_localization docs](https://github.com/cra-ros-pkg/robot_localization/blob/rolling-devel/doc/index.rst) | flag removed; cited robot_localization fusion of IMUs and odometry; new source [6] |
| 16 | 0.2° at 600 mm moves aim about 2 mm (illustrative) | verified | arithmetic (2.09 mm) | none |
| 17 | ±20 mg accel offset equals about ±1.1° tilt | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) + arithmetic (1.15°) | none |
| 18 | AMR wheel slip: gyro corrects heading | verified | [robot_localization docs](https://github.com/cra-ros-pkg/robot_localization/blob/rolling-devel/doc/index.rst) | flag removed; tied to odometry-plus-IMU fusion |
| 19 | Humanoid uses torso IMU to sense tipping | corrected | [Ficht and Behnke, arXiv 2208.04757](https://arxiv.org/abs/2208.04757) | flag removed; now "a balance controller needs only a 6-axis IMU plus joint encoders"; "torso" dropped (not in abstract); new source [7] |
| 20 | IMU measures hundreds to thousands of times a second | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none |
| 21 | BMI088 is a "6-axis MEMS IMU" | corrected | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | Bosch page does not say MEMS; reworded to "accelerometer-plus-gyroscope IMU" |
| 22 | Gyro noise 0.014 °/s/√Hz = 0.014 °/√s ARW, about 0.14° after 100 s | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/), [VectorNav IMU specs](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) + arithmetic | none |
| 23 | Ranges ±3 to ±24 g and ±125 to ±2000 °/s selectable | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none |
| 24 | BMI088 status | verified | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | none (page live; listed distributors out of stock) |
| 25 | Drift from constant bias = ½ x bias x time² | verified | kinematics | none |

### camera-calibration

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | 3 x 3 matrix: fx, fy in pixels; cx, cy principal point near center | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 2 | Radial k1, k2, k3: barrel or pincushion, growing toward edges | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 3 | Tangential p1, p2: lens not parallel to sensor | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) names the terms; physical explanation is in OpenCV's Python calibration tutorial | none |
| 4 | Intrinsics valid while focal length fixed; scale with image | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 5 | Zhang 2000: planar target, at least two orientations | verified | [Zhang, Microsoft Research](https://www.microsoft.com/en-us/research/publication/a-flexible-new-technique-for-camera-calibration/) | none (TPAMI vol. 22, 2000) |
| 6 | Closed-form guess then nonlinear refinement | verified | [Zhang, Microsoft Research](https://www.microsoft.com/en-us/research/publication/a-flexible-new-technique-for-camera-calibration/) | none |
| 7 | calibrateCamera uses Levenberg-Marquardt on reprojection error | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 8 | Returns overall RMS reprojection error | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 9 | calibrateCamera also returns per-image error and parameter uncertainty | corrected | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | those outputs (perViewErrors, stdDeviationsIntrinsics) come from calibrateCameraExtended; fixed in Precise and Misconception |
| 10 | MathWorks example 0.19 px | verified | [MathWorks accuracy](https://www.mathworks.com/help/vision/ug/evaluating-the-accuracy-of-single-camera-calibration.html) | none |
| 11 | Forum case 112 px to about 0.31 px after fixing point order | verified | [OpenCV forum](https://forum.opencv.org/t/cannot-get-good-camera-calibration/1270) (secondary) | marked as user discussion in Sources |
| 12 | ChArUco corners identifiable with part of board out of view | verified | [OpenCV ChArUco tutorial](https://github.com/opencv/opencv/blob/4.x/doc/tutorials/objdetect/charuco_detection/charuco_detection.markdown) | old source (aruco_board.hpp) did not state it; replaced [3] with the OpenCV tutorial |
| 13 | ChArUco combines marker versatility with chessboard precision | verified | [OpenCV ChArUco tutorial](https://github.com/opencv/opencv/blob/4.x/doc/tutorials/objdetect/charuco_detection/charuco_detection.markdown) | none |
| 14 | OpenCV advises many tilted poses across working distances | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 15 | Board should reach image corners | verified | [OpenCV forum](https://forum.opencv.org/t/cannot-get-good-camera-calibration/1270) (secondary) | none |
| 16 | Board should be flat | corrected | [MathWorks Calibration Patterns](https://www.mathworks.com/help/vision/ug/calibration-patterns.html) | was cited to forum, which does not discuss flatness; now cites new [6] |
| 17 | Measure squares, do not trust the printer | verified | [OpenCV forum](https://forum.opencv.org/t/cannot-get-good-camera-calibration/1270) (secondary), [MathWorks Calibration Patterns](https://www.mathworks.com/help/vision/ug/calibration-patterns.html) | primary [6] added |
| 18 | 12 mm, 3.45 µm: fx ≈ 3478 px; 0.17 mm/px at 600 mm | verified | arithmetic | none |
| 19 | Principal point uncertainty about 5 px in MathWorks example | verified | [MathWorks accuracy](https://www.mathworks.com/help/vision/ug/evaluating-the-accuracy-of-single-camera-calibration.html) (±5.3, ±3.2 px) | none |
| 20 | 5 px shift gives about 0.9 mm at 600 mm | verified | arithmetic (0.86 mm) | none |
| 21 | Uncalibrated errors of "several millimeters" | unverifiable | no source for a general figure | number removed; now "errors that grow toward the edges" |
| 22 | 0.2-0.3 px RMS ≈ 0.05 mm on board (illustrative) | verified | arithmetic | none |
| 23 | Camera calibrated warm may shift when cold | verified | [Smith and Cope, ISPRS 2010](https://www.isprs.org/proceedings/XXXVIII/part5/papers/158.pdf) | flag removed; added about 0.03 mm focal length change over 30 C and largest principal point shifts below 5-10 C; new source [7] |
| 24 | Surgical stereo endoscope must be calibrated for 3D measurement | verified | [Hardner et al., ISPRS 2022](https://isprs-archives.copernicus.org/articles/XLIII-B2-2022/679/2022/) | flag removed; added self-heating drift finding; "surgical robot" generalized to keyhole surgery; new source [8] |
| 25 | Flat-on views at one distance let focal length and distortion trade off [1][5] | corrected | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp), [Zhang](https://www.microsoft.com/en-us/research/publication/a-flexible-new-technique-for-camera-calibration/) | neither cited source states the trade-off; reworded to what they do say (tilted views across range; differently oriented views) |
| 26 | Distortion terms: 5 common, up to 14 | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 27 | Minimum 2 orientations in theory | verified | [Zhang, Microsoft Research](https://www.microsoft.com/en-us/research/publication/a-flexible-new-technique-for-camera-calibration/) | none |
| 28 | calib3d has calibrateCamera, findChessboardCorners, solvePnP, projectPoints, undistort | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 29 | CharucoBoard, CharucoDetector, matchImagePoints in objdetect (4.x) | verified | [OpenCV ChArUco tutorial](https://github.com/opencv/opencv/blob/4.x/doc/tutorials/objdetect/charuco_detection/charuco_detection.markdown) | none |
| 30 | MATLAB toolbox gives reprojection plots and standard errors | verified | [MathWorks accuracy](https://www.mathworks.com/help/vision/ug/evaluating-the-accuracy-of-single-camera-calibration.html) | none |
| 31 | Code sketch API (CharucoBoard args, detectBoard 4 outputs, matchImagePoints with ChArUco corners, calibrateCamera tuple) | verified | [OpenCV aruco_board.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/objdetect/include/opencv2/objdetect/aruco_board.hpp), [charuco_detector.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/objdetect/include/opencv2/objdetect/charuco_detector.hpp), [aruco_board.cpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/objdetect/src/aruco/aruco_board.cpp) | none |
| 32 | mm per pixel ≈ WD x pixel / focal length | verified | arithmetic (pinhole model) | none |

### hand-eye-calibration

| # | Claim (short) | Verdict | Source | Action |
|---|---|---|---|---|
| 1 | Eye-in-hand and eye-to-hand setups | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 2 | Gripper pose from robot kinematics; board pose by PnP | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 3 | Problem is solving AX = XB | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 4 | Five solvers: Tsai, Park, Horaud separable; Andreff, Daniilidis simultaneous | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 5 | Tsai-Lenz 1989 built to be fully automatic | verified | [IBM Research record](https://research.ibm.com/publications/a-new-technique-for-fully-autonomous-and-efficient-3d-robotics-handeye-calibration) | none (IEEE Trans. Robotics and Automation, 1989) |
| 6 | Final computation takes a few milliseconds | verified | [IBM Research record](https://research.ibm.com/publications/a-new-technique-for-fully-autonomous-and-efficient-3d-robotics-handeye-calibration) | none |
| 7 | At least 2 motions with non-parallel axes, so 3 poses; many more recommended | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 8 | Zivid suggests 10-20 pose pairs | verified | [Zivid dataset guide](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-getting-good-dataset.html) | none |
| 9 | Eye-to-hand: pass inverted robot poses, get camera pose in base frame | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 10 | calibrateRobotWorldHandEye solves AX = ZB for camera-to-gripper and base-to-world | corrected | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | outputs are R/t_base2world and R/t_gripper2cam; "camera-to-gripper" changed to "gripper-to-camera" |
| 11 | Robots are repeatable but not inherently accurate | verified | [Zivid cautions](https://support.zivid.com/academy/applications/hand-eye/cautions-and-recommendations.html) | none |
| 12 | Temperature affects robot and camera | verified | [Zivid cautions](https://support.zivid.com/academy/applications/hand-eye/cautions-and-recommendations.html) | none |
| 13 | 0.1° at 600 mm ≈ 1 mm; 0.5° ≈ 5 mm | verified | arithmetic (1.05, 5.2 mm) | none |
| 14 | Residuals: sub-mm (smaller robots), mm (larger), sub-degree rotation | verified | [Zivid verification](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-verification.html) | none |
| 15 | Good residuals do not guarantee accuracy; touch test | verified | [Zivid verification](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-verification.html) | none |
| 16 | 0.3° at 600 mm uses about 3 mm (illustrative) | verified | arithmetic (3.1 mm) | none |
| 17 | Redo after camera remount or robot recalibration | corrected | [Zivid cautions](https://support.zivid.com/academy/applications/hand-eye/cautions-and-recommendations.html) | Zivid says "robot loses calibration"; wording aligned |
| 18 | 0.1° at 1.5 m ≈ 2.6 mm | verified | arithmetic | none |
| 19 | MoveIt Calibration developed and tested on Melodic and Noetic | corrected | [moveit_calibration](https://github.com/moveit/moveit_calibration) | status: both are ROS 1; repo also has a ros2 branch with colcon build instructions; added |
| 20 | MoveIt Calibration recommends ChArUco | verified | [moveit_calibration](https://github.com/moveit/moveit_calibration) | none |
| 21 | Zivid hand-eye workflow with dataset guidance and verification tools | verified | [Zivid dataset guide](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-getting-good-dataset.html), [Zivid verification](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-verification.html) | none |
| 22 | Warm up and calibrate under operating conditions | verified | [Zivid cautions](https://support.zivid.com/academy/applications/hand-eye/cautions-and-recommendations.html) | none |
| 23 | Code sketch: calibrateHandEye argument order, CALIB_HAND_EYE_* names | verified | [OpenCV calib3d.hpp](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) | none |
| 24 | moveit_calibration maintained (status) | verified | [moveit_calibration](https://github.com/moveit/moveit_calibration) | none (not archived; last push December 2025) |
