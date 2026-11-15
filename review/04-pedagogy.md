## Area 4, Sensors: analogy and precision review

Scope: all 7 concepts in `knowledge/04-sensors.md`. WebSearch quota ran out partway through. All sources below were loaded directly with WebFetch. `build-content.mjs --check` passes with 0 warnings and 0 errors.

### Analogies

| Concept | Verdict (kept / rewritten) | Wrong prediction it would cause (if rewritten) | New analogy (short) |
|---|---|---|---|
| camera-2d | kept | — (photo booth teaches the core lesson: fix the geometry and lighting so any difference is real; the breaks section covers moving subjects and the lack of depth) | — |
| depth-camera | kept | — (two-eyes parallax correctly predicts that close things shift more and that depth gets worse with distance; the breaks section covers non-stereo types and holes on shiny or clear surfaces) | — |
| lidar | kept | — (canyon echo correctly predicts time-of-flight ranging and that it works in the dark; the breaks section covers narrow beams and gaps between beams) | — |
| photo-eye | kept (breaks rewritten) | The doorway beam suggests the sensor catches anything that passes. A clear lid barely dims the beam, and diffuse types lose range on dark items. The old breaks section skipped this, though it is the line's real failure mode. | — |
| imu | kept (one word changed) | "Slowly loses track" understated drift: position error grows with time squared, so the IMU is wrong within seconds. Now "soon loses track of where it has gone". | — |
| camera-calibration | rewritten | An eyeglass prescription is about blur. A reader would predict that calibration sharpens images or fixes a focus problem. It does neither: it measures where each point lands on the sensor. | Graph paper behind a warped window: known straight lines reveal how the glass bends the view. The breaks section says one straight-on look gives the bending but not the zoom or the image center, so the board must be tilted at several angles. |
| hand-eye-calibration | kept | — (friend on the phone correctly predicts that you need both position and facing, and that a facing error grows with distance, which is the lever-arm rule) | — |

### Other fixes

- camera-2d: Added triggered acquisition (a signal on an input line starts each picture) with a new Basler source [7]. The Plain promised "on cue", but the Precise never explained how.
- camera-2d: Defined "pinhole camera model" and glossed "ambient noise" in plain words.
- camera-2d: The cheese example used 1936 px while the Precise used 1920 px. Both now use 1920 px (field of view about 330 mm, still 0.17 mm/px).
- camera-2d: The cheese example implied IP67 is enough for washdown. Added that IP67 is a dunk test, not a pressure-washer test [8, Wikipedia IP code, secondary], so the camera is shielded during sanitation. This matches the depth-camera and lidar examples. Linked [[ip-rating]].
- camera-2d: The misconception illustrated "more pixels lower frame rate" with the same sensor on two cables, which shows cable bandwidth, not pixel count. Reworded to the 51 fps GigE limit and the halving you would get with twice the pixels.
- camera-2d: Added a connects-to entry for [[photo-eye]] as the usual trigger source.
- depth-camera: "Visible texture" became "surface texture (spots, edges, grain)". Defined "modulated" and "saturate".
- depth-camera: The apple-station error at 20 cm went from "several times smaller" to "about six times smaller, roughly ±1.6 mm", labeled as an estimate.
- lidar: The Precise explained only the 1.6 mm per ms term, which leaves the reader unable to see why the zone is 2 m. It now defines safety distance and gives the ISO 13855 reach allowance (C = 1200 - 0.4H, so 1080 mm at a 300 mm scan plane) from Keyence [5].
- lidar: The cheese example now breaks Keyence's 2.1 m worked example into its parts: 0.09 s scanner, 0.5 s machine stop, 1080 mm reach allowance, 100 mm tolerance. Key numbers updated to match.
- lidar and imu: The lidar section said a mobile robot "would" exist, while the IMU section said "the mobile robot" does. Both now describe the same illustrative tote-delivery mobile robot.
- photo-eye: The Plain said "a proximity sensor" detects metal. Capacitive proximity sensors detect non-metals too, so it now says "a metal-detecting proximity sensor".
- photo-eye: Defined "oscillation".
- photo-eye: The cheese example had the tray photo-eye triggering the pick-station camera. That camera images the ingredient infeed, not the tray. Now the photo-eye gates the robot's place, and the inspection camera is the one that is triggered.
- imu: Added that an accelerometer cannot tell gravity from the robot's own acceleration, so motion shows up as false tilt. Also added how gyro and accelerometer are blended (attitude estimator, Kalman filter), with a new VectorNav AHRS source [8]. Without this, "trusted for tilt" was oversimplified.
- imu: Defined "state estimators".
- imu: The cheese example implied that the D435i contains a BMI088. It now calls the BMI088 a typical MEMS part. Added a same-temperature caveat (±0.2 mg/C offset drift [1], so about 17 C of warming fakes a 0.2° shift) and the fact that the check works only because the camera is still. Added offset temperature drift to Key numbers.
- camera-calibration: Defined barrel/pincushion, "closed-form", and "nonlinear optimization". Levenberg-Marquardt was defined as "an iterative least-squares solver", which is jargon defined with jargon; it now has a plain gloss.
- camera-calibration: "Its largest principal point shifts below 5-10 C" was ambiguous. It now says the largest shifts came when the camera was colder than about 5-10 C, which is the room's range. Checked against the paper's text.
- hand-eye-calibration: Defined "transform" inline and glossed "repeatable but not accurate".
- hand-eye-calibration: The cup-on-wedge slack said ±5 mm, but (35 - 20) / 2 = 7.5 mm. Now says ±7.5 mm before the edge hangs off, about ±5 mm with a seal margin.

### Spot-checks of the fact check

| Claim | Source opened | Result |
|---|---|---|
| SZ-V32N: 8.4 m for 70-150 mm, 1.6 m for 20 mm; 160 ms standard, 80 ms high-speed, 1408 ms max; 190°; IP65; 905 nm Class 1; Type 3 AOPDDR; PLd Cat 3 | [Keyence SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) | confirmed (high-speed range 5.7 m; high-speed max is 704 ms) |
| Livox Mid-360: 40 m at 10%, 70 m at 80%, 0.1 m blind zone, ≤2 cm at 10 m, 10 Hz, IP67, ICM40609 IMU | [Livox Mid-360 specs](https://www.livoxtech.com/mid-360/specs) | confirmed |
| Ouster OS1: 128 channels, 45° vertical FOV, 90 m at 10%, 10.4 M points/s, Rev8 | [Ouster OS1](https://ouster.com/products/hardware/os1-lidar-sensor) | confirmed |
| RealSense D435: 0.3-3 m, about 28 cm Min-Z, under 2% at 2 m, global shutter, sold by RealSense, Inc. under Intel license | [RealSense D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) | confirmed |
| RealSense D405: 7-50 cm, 7 cm Min-Z (at 480p), ±2% at 50 cm, no IP rating listed | [RealSense D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) | confirmed |
| Zivid 2+ MR60: 80 µm, 350-900 mm, 570 x 460 mm and 0.24 mm at 600 mm, 25-1500 ms, IP65; 2+ range 80-260 µm | [Zivid compare](https://www.zivid.com/compare-and-select-3d-cameras) | confirmed |
| Basler blaze-101: 640 x 480, 0.3-10 m, ±5 mm over 0.5-5.5 m, <1 mm noise, 90% target / no ambient / 22 C / 20 min warm-up, IP67 | [Basler blaze-101](https://docs.baslerweb.com/blaze-101) | confirmed |
| BMI088: ±24 g, ±2000 °/s, 12.5 Hz-2 kHz, 0.014 °/s/√Hz, "up to" ±1 °/s and ±20 mg lifetime offset | [Bosch BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) | partly failed: numbers right, but Bosch lists the offsets as typical (typ.), not as maximums. "Up to" changed to "typical" in the Precise and Key numbers. |
| Keyence PR-G: 30 m through-beam, 0.1-4.2 m retro with R-2L, 500 mm diffuse, 0.5-1 ms, IP68/IP69K, SUS 316L | [Keyence PR-G specs](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) | confirmed (316L stated for rectangular models) |
| Beckhoff EL1252 1 ns timestamp resolution | [Beckhoff EL1252](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el1xxx-digital-input/el1252.html) | confirmed (accuracy 10 ns between channels) |
| a2A1920-160ucBAS: 1920 x 1200, 3.45 µm, 1/2.3", 164 fps, IMX392, C-mount, IP30; rolling shutter "ambient noise" wording | [Basler 160ucBAS](https://docs.baslerweb.com/a2a1920-160ucbas), [Basler shutter types](https://docs.baslerweb.com/electronic-shutter-types) | confirmed |
| MathWorks 0.19 px; principal point ±5.3 / ±3.2 px | [MathWorks accuracy](https://www.mathworks.com/help/vision/ug/evaluating-the-accuracy-of-single-camera-calibration.html) | confirmed |
| Zivid hand-eye 10-20 pose pairs | [Zivid dataset guide](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-getting-good-dataset.html) | confirmed |
| Smith and Cope: about 0.03 mm focal length change over 30 C; principal point shifts at low temperature | [ISPRS 2010 PDF](https://www.isprs.org/proceedings/XXXVIII/part5/papers/158.pdf) | confirmed (wording clarified, see Other fixes) |
| Keyence ISO 13855 example: K = 1600 mm/s, C = 1200 - 0.4H, S about 2124 mm | [Keyence safety distance](https://keyence.com/ss/products/safetyknowledge/caution/scanner) | confirmed |

New sources added: Basler Triggered Image Acquisition (camera-2d [7]), Wikipedia IP code (camera-2d [8], secondary), VectorNav AHRS primer (imu [8], vendor primer).
