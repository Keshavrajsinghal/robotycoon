---
area: 4
slug: sensors
title: Sensors
---

# Sensors

A robot arm with no sensors replays the same motion forever, so everything it handles must arrive in exactly the same place every time. Sensors are how a robot cell notices what actually arrived: cameras that see where a cheese wedge landed, depth cameras that measure how tall a grape bunch is, lidar and safety scanners that notice a person walking up, photo-eyes that report "a tray is here", and IMUs that sense tilt and motion. This area covers the hardware specs that decide whether a sensor can do its job, and then calibration: the measurements that turn a camera's pixels into millimeters in the robot's own coordinates.

On the cheese plate line, photo-eyes tell the PLC (the line's industrial controller) when a tray reaches each station; cameras above the grape, apple, and cheese pick stations find each ingredient; a color camera at inspection checks that every item is on the plate before lidding; and a safety scanner watches the spot where an operator walks up to pull rejects. None of the vision works until each camera is calibrated and its position relative to its robot is known to within a millimeter or two.

## 2D industrial camera
id: camera-2d
requires: none
aka: machine vision camera, area scan camera, industrial camera, global shutter, rolling shutter

### Plain
An industrial camera is like a passport photo booth: the camera, the distance, and the lights are fixed, so every picture comes out the same and any difference means something really changed. Software then looks at each picture and answers one narrow question, such as "where is the cheese wedge, and which way does it point?" The camera has to take that picture on cue, many times a second, sharp enough that a moving item is not a smear.

### Where the analogy breaks
A photo booth takes a flattering picture of a person sitting still; a machine vision camera photographs moving items, and the software needs pixel positions it can turn into millimeters, so looking good to a human does not matter. The picture is also flat: it carries no distance information, which is why depth cameras exist.

### Precise
A 2D camera is an image sensor (a chip covered in a grid of tiny light-measuring squares called pixels) behind a lens. Resolution is the pixel count: the Basler ace 2 a2A1920-160ucBAS has 1920 x 1200 pixels (about 2.3 megapixels, or million pixels), each 3.45 µm across, on a 1/2.3-inch sensor [1]. What matters to a robot is millimeters per pixel on the object, which is the field of view (the width of scene the camera sees) divided by the pixel count. The lens sets the field of view: for a lens of fixed focal length (the lens property that sets how zoomed-in the view is), the working distance (lens-to-object distance) decides the field of view, so the same 25 mm lens sees twice as wide at 600 mm as at 300 mm [6]. A good approximation, from the pinhole camera model (treating the lens as a tiny hole that light passes straight through), is field of view ≈ sensor width x working distance / focal length.

Frame rate is pictures per second: 164 fps at full resolution for that camera over USB 3.0 [1], but 51 fps for the same sensor in an IP67 (sealed against dust and immersion) GigE (gigabit Ethernet) housing [2], because that cable carries fewer bits per second. Exposure time is how long the pixels collect light for each picture, adjustable from 19 µs to 10 s on the a2A1920-160ucBAS [4]; a moving item smears by its speed times the exposure time. Most industrial cameras run in triggered acquisition: instead of filming continuously, the camera starts each picture when an electrical signal arrives on one of its input lines [7], for example from a photo-eye or the line's controller, so each picture belongs to a known moment and belt position. The shutter type decides when each row of pixels collects light. A global shutter exposes all pixels at the same moment; a rolling shutter exposes rows one after another with a small time offset, which distorts fast-moving objects but typically has significantly lower ambient noise (random grain in the picture) [3]. Basler recommends flash lighting to avoid the rolling-shutter effect [3].

Lighting is part of the camera system, not an accessory: Keyence calls it one of the most important factors in reliable inspection [5]. A dome light (a bowl of diffuse light around the part) removes glare on shiny or curved surfaces, a backlight (light behind the part) gives a crisp silhouette for outline measurement, and low-angle light makes scratches and texture stand out [5]. On a monochrome (grayscale) camera, colored light boosts contrast: light of the complementary color makes an object look nearly black [5]. Without a well-matched camera, lens, and light, the robot has to rely on fixtures that put every item in exactly the same spot, which is hard for food that varies in shape.

### On the cheese plate line
At the cheese pick station, a color camera looks straight down at the wedge infeed belt from 600 mm through a 12 mm lens. The image is about 6.6 mm wide on the sensor (1920 pixels x 3.45 µm [1]), so the field of view is about 330 mm wide at about 0.17 mm per pixel, plenty to find each wedge and its pointed end (illustrative design numbers). If the belt moves at 100 mm/s (illustrative), keeping smear under half a pixel needs an exposure under about 0.85 ms, so the station uses a global shutter camera and a bright diffuse light that flashes with each exposure, which also tames glare off cut cheese faces. Because the room is washed down, the station uses the IP67 body rather than the IP30 USB model [1][2], and the 2-4 C room sits inside its -10 to 60 C housing range [2]. IP67 proves the camera survives dust and a 30-minute dunk, not a hot pressure washer [8], so it is still shielded during sanitation (illustrative design choice; see [[ip-rating]]).

### Elsewhere
In a parcel warehouse, a camera above a sorting conveyor reads shipping labels as boxes pass. If the belt runs at 2 m/s and each pixel covers 0.2 mm (illustrative numbers), the exposure must be under 100 µs to keep smear to one pixel, which is why such reading stations pair global shutter cameras with very bright pulsed lights. A rolling shutter camera here would record the top of a label slightly earlier than the bottom, so the barcode would come out skewed [3].

### Why it exists
Most of what varies on a line, such as where an item landed, which way it faces, and whether it is the right item, is visible. A 2D camera captures all of it in one shot at modest cost, which lets one robot handle items that are not precisely fixtured.

### Connects to
- [[depth-camera]] — adds a distance to every pixel when a flat picture is not enough, such as for heaped or tilted items
- [[camera-calibration]] — turns the camera's pixels into accurate directions and, with distance, millimeters
- [[perception]] — the software that finds objects in the picture
- [[inspection]] — the station that uses a camera to accept or reject finished plates
- [[ip-rating]] — decides which camera housings survive washdown
- [[photo-eye]] — often supplies the trigger signal that starts each picture

### Real products and tools
- **Basler ace 2 (Basler AG)** — compact industrial cameras in USB 3.0, GigE, and sealed IP67 GigE versions; the a2A1920-160ucBAS is a 2.3 MP global shutter color model [1][2]
- **Sony IMX392** — the 2.3 MP global shutter sensor inside those two ace 2 models [1][2]
- **C-mount lenses** — the standard screw-in lens mount used by the ace 2 and many other industrial cameras [1]
- **Keyence lighting selection guide** — a vendor reference for choosing ring, bar, dome, backlight, coaxial, and low-angle lights [5]

### Common misconception
**Misconception:** A higher-resolution camera is the fix for an unreliable vision station.

**Reality:** Most failures come from glare, shadows, blur, or weak contrast, which more pixels do not fix; Keyence ranks lighting among the most important factors in reliable inspection [5]. More pixels also mean more data per picture, and a cable carries a fixed number of bits per second: this 2.3 MP camera already tops out at 51 fps on GigE [2], so a camera with twice the pixels on the same cable would manage only about half that, and processing slows too.

### Key numbers
- Frame rate: 51-164 fps for the same 2.3 MP sensor, depending on the interface (GigE or USB 3.0) [1][2]
- Exposure time: 19 µs to 10 s on the a2A1920-160ucBAS, or 1-14 µs in its ultra-short mode [4]
- Pixel size: 3.45 µm on the IMX392 [1]
- Data rate check: 1920 x 1200 pixels x 8 bits x 164 fps ≈ 3 Gbit/s, under USB 3.0's 5 Gbit/s nominal maximum [1] but about three times what gigabit Ethernet carries, which is why the GigE version stops near 51 fps [2]
- Motion blur in pixels = object speed x exposure time / millimeters per pixel

### Sources
1. [Basler a2A1920-160ucBAS documentation](https://docs.baslerweb.com/a2a1920-160ucbas) — Basler; resolution, frame rate, sensor, pixel size, global shutter, USB 3.0, C-mount, IP30, housing temperature range
2. [Basler a2A1920-51gcIP67 documentation](https://docs.baslerweb.com/a2a1920-51gcip67) — Basler; IP67 GigE camera with the same sensor, 51 fps, -10 to 60 C housing temperature
3. [Electronic Shutter Types](https://docs.baslerweb.com/electronic-shutter-types) — Basler; global, rolling, and global reset release shutters and their trade-offs
4. [Exposure Time](https://docs.baslerweb.com/exposure-time) — Basler; what exposure time is and per-model ranges
5. [Basics of Lighting Selection](https://www.keyence.com/products/vision/vision-sys/resources/vision-sys-resources/basics-of-lighting-selection.jsp) — Keyence; lighting types, what each is for, and color choice
6. [Imaging Lens (Vision and Sensors 101)](https://qualitymag.com/articles/91115-imaging-lens) — Quality Magazine (trade press, written by an Edmund Optics engineer, 2013); how working distance, focal length, and sensor size set the field of view
7. [Triggered Image Acquisition](https://docs.baslerweb.com/triggered-image-acquisition) — Basler; capturing images at chosen moments, hardware trigger signals on the camera's input lines
8. [IP code](https://en.wikipedia.org/wiki/IP_code) — Wikipedia (secondary); IPX7 is a 30-minute immersion test and does not imply the water-jet ratings; IPX9/IP69K is the hot high-pressure test

## Depth camera
id: depth-camera
requires: camera-2d
aka: 3D camera, RGB-D camera, stereo camera, structured light camera, time-of-flight camera, ToF, point cloud

### Plain
A depth camera is a camera where every pixel also says how far away that spot is. One common kind works like your two eyes: it compares two side-by-side views, and things that shift a lot between the views are close while things that barely shift are far. That lets a robot know not just where a grape bunch is on the belt but how tall it is and where its stem sits in space.

### Where the analogy breaks
Only stereo depth cameras work like eyes; structured light cameras project patterns and watch them bend, and time-of-flight cameras time how long their own light takes to come back. And unlike your brain, a depth camera does not understand what it sees, so on blank, shiny, wet, or see-through surfaces it often returns holes or wrong distances.

### Precise
A depth camera outputs a depth image (a picture whose pixel values are distances) or a point cloud (a list of 3D points), usually alongside a normal color image. Stereo cameras use two cameras a fixed baseline (distance between them) apart, find the same feature in both images, measure its disparity (how many pixels it shifts between left and right), and compute depth = focal length x baseline / disparity [3]. Far objects have small disparities, so a fixed matching error of a fraction of a pixel causes a depth error that grows with the square of distance [6] (from the formula: error ≈ depth² x disparity error / (focal length x baseline)). Stereo needs surface texture (spots, edges, grain) to match, so many units add an infrared projector that paints an invisible texture onto blank surfaces [3]. Stereo also has a minimum range, because very close objects shift more than the matcher searches, and it grows with image resolution [6]: about 28 cm for the RealSense D435 at full resolution, but 7 cm for the short-range D405 [1][2].

Structured light cameras pair a projector with a camera: the projector shows a sequence of known patterns and the camera measures how the surface bends them. They give the finest detail at short range; Zivid's 2+ MR60 lists 80 µm point precision (how much repeated measurements of one point scatter) and a 350-900 mm optimal working distance [4]. The catch is that the scene must hold still while the patterns are shown, which Zivid's 2+ models list as a typical capture time of 25-1500 ms depending on settings [4]. Time-of-flight (ToF) cameras flash modulated infrared light (light switched on and off in a fast, known rhythm) and measure, for every pixel, how long it takes to come back. Their error stays roughly flat with distance: the Basler blaze-101 lists ±5 mm over 0.5-5.5 m, at only 640 x 480 pixels [5]. So ToF suits big scenes like pallets, and structured light suits small parts up close.

Accuracy (how close the average reading is to the truth) and precision (how much repeated readings scatter) are separate specs, and both depend on test conditions. Basler measured its ±5 mm on a flat white target that reflects 90% of light, with no ambient light, at 22 C, after a 20-minute warm-up [5]. Shiny or wet surfaces can bounce the projector's light straight into the sensor and saturate pixels (overload them so they read pure white and carry no distance) [7], and transparent items such as clear lids let the light through, so the camera misses the surface or measures whatever is behind it [8]. Without depth, a robot must assume every item lies flat at a known height, which fails as soon as items pile up, tilt, or vary in thickness.

### On the cheese plate line
At the grape pick station, bunches arrive in heaps of different heights, and the gripper must close on the stem rather than crush fruit. A structured light camera like the Zivid 2+ MR60, mounted 600 mm above the grape infeed, sees about 570 x 460 mm with about 0.24 mm between points [4], enough to find a stem a few millimeters thick, but the belt pauses for each capture (illustrative design). At the apple station, a short-range stereo camera like the RealSense D405 rides on the robot wrist; its ±2% accuracy at 50 cm is about ±10 mm [2], so the robot moves in to about 20 cm for the final look, where stereo error, which shrinks with the square of distance, should be about six times smaller, roughly ±1.6 mm (an estimate from the square rule, not a datasheet figure). Neither is rated for direct high-pressure washdown (the Zivid lists IP65 [4]; the D405 page lists no rating [2]), so both get covered during sanitation (illustrative design choice).

### Elsewhere
In a warehouse, a robot unloading mixed boxes from a pallet can use a ToF camera mounted about 2.5 m above the pallet (illustrative). The blaze-101's 0.3-10 m range and ±5 mm accuracy [5] are coarse for small parts but fine for box tops tens of centimeters wide. Its IP67 housing [5] also suits dusty docks.

### Why it exists
A flat picture cannot tell a thin item from a thick one, or a near item from a far one that looks the same. Depth cameras let robots pick from heaps, bins, and pallets, where items do not sit at one known height.

### Connects to
- [[camera-2d]] — a depth camera is two or more 2D cameras, or one camera plus a light source
- [[camera-calibration]] — stereo depth depends on precisely known focal lengths and baseline
- [[grasp-planning]] — uses the point cloud to choose where the gripper should touch
- [[opencv]] — OpenCV and point cloud libraries process depth images and point clouds
- [[lidar]] — uses the same time-of-flight idea with a scanning laser beam over longer ranges

### Real products and tools
- **RealSense D435** — stereo depth camera, 0.3-3 m ideal range, global shutter depth sensors, under 2% error at 2 m; as of 2026 sold by RealSense, Inc. under license from Intel [1]
- **RealSense D405** — short-range stereo camera for 7-50 cm [2]
- **Zivid 2+ and Zivid 3** — structured light 3D cameras (MR60, MR130, LR110, XL250) used for bin picking and inspection [4]
- **Basler blaze-101** — IP67 time-of-flight camera, 640 x 480, up to 10 m [5]
- **librealsense** — the open-source SDK for RealSense cameras, whose documentation explains depth from stereo [3]

### Common misconception
**Misconception:** A depth camera's datasheet accuracy is what you will get on your items.

**Reality:** Datasheet figures come from friendly conditions, such as a flat 90%-reflective white target, no ambient light, 22 C, and a 20-minute warm-up for the blaze-101 [5]. Stereo error also grows with the square of distance [6], so a camera rated "under 2% at 2 m" [1] is far better at 0.5 m and far worse at 4 m. Test on the real items, at the real distance and temperature.

### Key numbers
- Stereo minimum range: 7 cm (D405) to about 28 cm (D435 at full resolution) [1][2]; depends on baseline and resolution [6]
- Stereo accuracy: under 2% at 2 m (D435), ±2% at 50 cm (D405) [1][2]
- Structured light point precision: 80-260 µm across Zivid 2+ models, over recommended working distances of 300-2700 mm depending on model [4]
- ToF accuracy: ±5 mm over 0.5-5.5 m, with under 1 mm temporal noise, on an ideal target (blaze-101) [5]
- Worked stereo example: with a 942.8-pixel focal length and 54.8 mm baseline [3] and an assumed 0.1-pixel matching error, depth error is about 2 mm at 1 m and about 8 mm at 2 m

### Sources
1. [Stereo Depth Camera D435](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d435/) — RealSense, Inc.; ideal range, minimum depth, accuracy, field of view, shutter types, Intel licensing note
2. [Stereo Depth Camera D405](https://realsenseai.com/stereo-depth-cameras/stereo-depth-camera-d405/) — RealSense, Inc.; short-range specs
3. [Depth from Stereo](https://raw.githubusercontent.com/IntelRealSense/librealsense/master/doc/depth-from-stereo.md) — librealsense documentation; depth from disparity formula, example focal length and baseline, role of the texture projector
4. [Compare and select 3D cameras](https://www.zivid.com/compare-and-select-3d-cameras) — Zivid; structured light model specs, working distances, point precision, IP65
5. [Basler blaze-101](https://docs.baslerweb.com/blaze-101) — Basler; time-of-flight specs, accuracy test conditions, IP67
6. [Tuning depth cameras for best performance](https://dev.realsenseai.com/docs/tuning-depth-cameras-for-best-performance) — RealSense, Inc.; depth error scales with the square of distance, minimum range scales with resolution
7. [Dealing with highlights and shiny objects](https://support.zivid.com/academy/camera/capturing-high-quality-point-clouds/dealing-with-highlights-and-shiny-objects.html) — Zivid; direct reflections from shiny surfaces saturate pixels
8. [Dealing with transparent objects](https://support.zivid.com/en/latest/camera/academy/camera/capturing-high-quality-point-clouds/dealing-with-transparent-objects.html) — Zivid; light passes through transparent surfaces, so points are missed or land on the background

## Lidar
id: lidar
requires: depth-camera
aka: LiDAR, laser scanner, safety laser scanner, 2D lidar, 3D lidar

### Plain
A lidar measures distance the way you might by shouting in a canyon and timing the echo, except it uses short laser pulses and repeats this hundreds of thousands of times a second while sweeping the beam around. The result is a map of dots showing where the walls, boxes, and people around it are. A special kind, the safety laser scanner, watches an invisible zone on the floor and tells the machine to stop when someone steps in.

### Where the analogy breaks
Light is so fast that the timing must resolve billionths of a second, and a lidar only measures the exact spots its beams hit, so a thin object can slip between beams at long range. An echo comes back from everything around you, but a lidar beam returns from one spot, and a dark or shiny spot may send back too little light to measure.

### Precise
Lidar (light detection and ranging) fires laser pulses, times each echo, and turns the time into distance; a spinning head or moving mirror sweeps the beam so the sensor builds a set of points around itself. A 2D lidar sweeps one flat plane, usually just above the floor. A 3D lidar sweeps many planes at once; each plane is a channel (one laser-and-receiver line), and the Ouster OS1 has 128 channels spread over a 45° vertical field of view [3], with several beam-spacing layouts to choose from [4].

Range depends heavily on how much light the target reflects, so it is quoted at a reflectivity: the Livox Mid-360 reaches 40 m on a 10%-reflective target and 70 m on an 80% one [2], and the OS1 90 m at 10% [3]. Angular resolution (the angle between neighboring beams) sets how far apart the points land: the gap equals range times the angle in radians, so beams 0.35° apart (128 evenly spaced channels across 45°) land about 120 mm apart at 20 m, and anything smaller can fall between them. Range precision (scatter of repeated distance readings) is centimeters for navigation lidar, at most 2 cm at 10 m for the Mid-360; it also has a 0.1 m blind zone (minimum range) and repeats its scan at a typical 10 Hz [2].

A safety laser scanner is a 2D lidar built and certified to stop machines. The Keyence SZ-V32N is certified as a Type 3 AOPDDR (the IEC 61496-3 standard's name for a safety scanner) and to PL d, Category 3 (a rating of how reliably the safety function works) under ISO 13849-1 [1]. You configure a protective field, where any intrusion stops the machine, and a warning field, where it slows or alarms [1]. Its guaranteed protective range depends on the smallest object it must catch: 8.4 m for 70-150 mm objects such as a leg or body, but only 1.6 m for 20 mm objects, because the beams spread apart with distance [1]. Its response time (from intrusion to outputs switching off) is 160 ms in standard mode, or 80 ms in a high-speed mode that cuts the 8.4 m range to 5.7 m, and grows to as much as 1408 ms with longer scan settings [1]. That delay sets the size of the protective field, through the ISO 13855 safety distance (how far the field's edge must sit from the hazard so the machine has stopped before a person can reach it). The formula assumes a person approaches at 1600 mm/s, so each millisecond of scanner response or machine stopping time adds 1.6 mm, and then adds a fixed allowance for how far a person can reach in before being detected: 1200 mm minus 0.4 times the scan plane's height above the floor, so 1080 mm for a plane 300 mm up [5]. Without lidar, mobile robots cannot see their surroundings reliably over long distances or in the dark, and open cell entrances would need doors or light curtains instead.

### On the cheese plate line
The pick stations sit inside fenced cells, but the inspection station has an open side where an operator pulls rejected plates. A safety laser scanner mounted low at that opening watches a floor zone about 2 m deep, set to detect a 70 mm leg (illustrative settings). The size comes from ISO 13855, not from the scanner: Keyence's worked example for this kind of scanner, with a scan plane 300 mm up, a 0.09 s scanner response, and a machine that takes 0.5 s to stop, adds 1600 mm/s x 0.59 s of total delay to the 1080 mm reach allowance and a 100 mm scanner tolerance, for about 2.1 m [5]. When someone steps in, the robot halts through the safety circuit and restarts only after the zone clears and the operator resets. The SZ-V is rated IP65 [1], below the IP69K washdown-grade sensors elsewhere on the line, so it sits behind a shield during sanitation (illustrative design choice). The line's stations use no 3D lidar; lidar for navigation appears only on the mobile robot that brings ingredient totes from the cold store (illustrative).

### Elsewhere
A warehouse AMR (autonomous mobile robot, a self-driving cart) such as Omron's LD series carries lasers near the floor: it navigates by the building's own walls and racks, and its onboard lasers and other sensors spot obstacles in its path and trigger a stop, depending on its speed [6]. Outdoor vehicles use 3D lidar such as the Ouster OS1, whose 128 channels and up to 10.4 million points per second build a dense 3D view out to 90 m even on dark targets [3].

### Why it exists
Cameras need ambient light and struggle to measure distance far away; lidar brings its own light and measures distance directly, to centimeters, out to tens of meters. Certified safety scanners let a machine guard an open floor area without a fence or door.

### Connects to
- [[guarding]] — safety scanners are one form of presence sensing for open cell entrances
- [[safety-circuit]] — a safety scanner's outputs feed the circuit that halts the robot
- [[mobile-robot]] — mobile robots rely on lidar to navigate and avoid people
- [[depth-camera]] — time-of-flight cameras use the same timing idea without a scanning beam
- [[safety-standards]] — IEC 61496-3 and ISO 13849-1 define what makes a scanner safety-rated

### Real products and tools
- **Keyence SZ-V series** — 2D safety laser scanners: 190° scan angle, 8.4 m protective range, IP65, 905 nm Class 1 laser [1]
- **Livox Mid-360** — compact 3D lidar for robots: 360° x 59° field of view, 40 m at 10% reflectivity, IP67, built-in IMU [2]
- **Ouster OS1** — 128-channel spinning 3D lidar with a 45° vertical field of view [3][4]
- **SICK microScan3 and nanoScan3** — widely used safety laser scanners; SICK's product pages and datasheets would not load for me, so I give no specs [unverified: SICK pages and PDFs unreadable]

### Common misconception
**Misconception:** Any lidar can be used to stop a robot when a person comes close.

**Reality:** Only scanners certified for safety, such as a Type 3 device under IEC 61496-3 with a performance level under ISO 13849-1 [1], may be wired into the safety circuit; they guarantee detection of a stated object size within a stated range. A navigation lidar like the Mid-360 lists range and precision, not a safety rating [2], so it can help plan paths but cannot be what keeps people safe.

### Key numbers
- Safety scanner protective range: 1.6-8.4 m in standard mode, depending on the smallest object it must detect (20-150 mm); 1.1-5.7 m in high-speed mode [1]
- Safety scanner response time: 80-1408 ms, depending on mode and scan settings; 160 ms is the fastest at full range [1]
- Safety distance grows 1.6 mm per millisecond of total response and stopping time (ISO 13855 approach speed of 1600 mm/s), on top of a fixed reach allowance of 1080 mm for a scan plane 300 mm above the floor [5]
- 3D lidar range: 40-90 m on 10%-reflective targets (Mid-360, OS1) [2][3]
- Range precision: at most 2 cm at 10 m (Mid-360) [2]
- Point gap = range x beam spacing in radians; 0.1° spacing gives about 17 mm gaps at 10 m
- Heat: the OS1 starts limiting laser shots at 52 C, and range and precision can drop by up to 20% [4]

### Sources
1. [Safety Laser Scanner SZ-V32N](https://www.keyence.com/products/safety/laser-scanner/sz-v/models/sz-v32n/) — Keyence; protection and warning ranges, detection sizes, response times, IEC 61496-3 Type 3 and ISO 13849-1 PLd ratings, IP65, laser class
2. [Livox Mid-360 specs](https://www.livoxtech.com/mid-360/specs) — Livox; range by reflectivity, blind zone, field of view, precision, point rate, frame rate, IP67, built-in IMU
3. [OS1 lidar sensor](https://ouster.com/products/hardware/os1-lidar-sensor) — Ouster; channels, range at 10% reflectivity, vertical field of view, point rate
4. [OS1 hardware user manual overview](https://static.ouster.dev/sensor-docs/hw_user_manual_OS1/hw_common_sections_OS1/os1-overview.html) — Ouster; beam spacing options and thermal shot limiting
5. [Laser Scanner Installation and Safety Distance](https://keyence.com/ss/products/safetyknowledge/caution/scanner) — Keyence Safety Knowledge; ISO 13855 safety distance formula, 1600 mm/s approach speed, worked scanner example
6. [LD series autonomous mobile robots](https://industrial.omron.eu/en/products/ld-series) — Omron; natural-feature navigation, onboard lasers that detect obstacles and trigger a stop

## Photo-eyes and proximity sensors
id: photo-eye
requires: none
aka: photoelectric sensor, photocell, through-beam, retroreflective, diffuse sensor, proximity sensor, inductive sensor

### Plain
A photo-eye is like the beam across a shop doorway that chimes when someone walks through: a small light shines at a receiver, and the sensor reports "something is here" the moment the light is blocked or bounced back. It answers only yes or no, but it answers within about a millisecond, and a conveyor line uses dozens of them to know where every tray is. A metal-detecting proximity sensor does the same job for metal parts, using a magnetic field instead of light.

### Where the analogy breaks
A doorway beam seems to catch anything that passes, but a photo-eye only notices a change in light: a clear lid dims the beam so little that it can pass unseen, and diffuse types, which sense light bouncing off the object itself with nothing on the far side, see dark items only at much shorter range. And a door chime just rings, while a photo-eye's signal is timed and counted by the line's controller, so when it switches matters as much as whether it switches.

### Precise
A photo-eye (photoelectric sensor) has an emitter of visible or infrared light, on the PR-G a red LED (a small light source) [2], and a receiver that measures how much light arrives [1]. Through-beam types put emitter and receiver in separate housings facing each other, and an object breaking the beam is detected [1]; they reach farthest and are hardest to fool, since the target's color and finish do not matter [7], with 30 m range on Keyence's PR-G through-beam models [2]. Retroreflective types put both in one housing and bounce the beam off a reflector on the far side, detecting the object when it blocks the return [1]; the PR-G version reaches 0.1-4.2 m [2]. Diffuse types (Keyence calls them reflective) detect light scattered back from the object itself [1], so they need nothing on the far side but have short range, 500 mm on the PR-G diffuse model [2], and their range shrinks sharply on dark or low-reflectivity targets [7].

The output is a digital on/off signal to the PLC (programmable logic controller, the line's industrial computer). Response time is how long the sensor takes to switch after the object arrives: 0.5-1 ms for the PR-G models [2]. On a moving conveyor, delay becomes position error: at 200 mm/s, 1 ms is 0.2 mm. The PLC adds delay of its own, because it copies its inputs only once per task cycle (one pass through its program) [4], so a change can wait up to a full cycle before the program sees it. An inductive proximity sensor uses a coil that makes a high-frequency magnetic field; a nearby metal object picks up eddy currents (small swirling currents induced in metal) that load the circuit and weaken the oscillation (the coil circuit's rapid back-and-forth current), and the sensor switches [3]. It detects metal targets [3] and works over short distances, 1.5-27 mm across Keyence's EV series depending on sensor size [5]. Without these simple sensors, the line would not know when to trigger cameras, start a robot pick, or stop for a jam.

### On the cheese plate line
At each pick station, a retroreflective photo-eye across the tray conveyor tells the PLC "tray in position"; the PLC stops the tray there and lets the robot place, so every ingredient lands on a tray that is actually there. At inspection, the same kind of signal triggers the camera, so each picture shows one whole plate. A diffuse photo-eye looking down at the outfeed spots plates backing up and stops the line before a jam. Because the room is washed down, the sensors are washdown-grade types like the Keyence PR-G, rated IP68 and IP69K in 316L stainless steel housings [2]. The clear lid is the hard case: a clear film weakens a standard retroreflective beam by only about 5-10%, too little to switch reliably [8], so the lidding station either uses a sensor built for transparent objects, such as one with a polarizing reflector [8], or detects the tray under the lid instead.

### Elsewhere
A home garage door opener in the US may use an external photoelectric sensor as its entrapment protection: if something breaks its beam across the opening while the door is closing, the door must reverse [9]. In a car body shop, inductive proximity sensors on welding fixtures can confirm that each steel panel is clamped in place before the robots weld, since steel is exactly what they detect [3].

### Why it exists
A camera is overkill for "is a tray here yet?": it costs more and needs image processing. Photo-eyes and proximity sensors answer that question in about a millisecond [2] with a single wire, so lines use them everywhere for timing, counting, and jam detection.

### Connects to
- [[plc]] — reads photo-eye and proximity sensor signals and decides what the line does next
- [[conveyor]] — photo-eyes track where each tray is along the belt
- [[conveyor-tracking]] — a photo-eye trigger often marks the moment a moving tray's position is captured for a robot picking on the fly
- [[guarding]] — safety light curtains are multi-beam, safety-rated relatives of the through-beam photo-eye
- [[ip-rating]] — washdown lines need IP69K-rated sensors

### Real products and tools
- **Keyence PR-G series** — compact photo-eyes in through-beam, retroreflective, and diffuse versions, IP68 and IP69K, 316L stainless steel housings [2]
- **Keyence R-2L reflector** — the reflector the PR-G retroreflective range is quoted with [2]
- **Inductive proximity sensors** — metal-only sensors based on high-frequency oscillation, sold by Keyence among many others [3]

### Common misconception
**Misconception:** A sensor with a 0.5 ms response time means the line knows when the tray arrived to within 0.5 ms.

**Reality:** The sensor is often not the slowest link. The PLC reads inputs only once per task cycle [4], and input filters add their own delay [6], so systems that need precise timing use inputs that timestamp the signal change, such as Beckhoff's EL1252 terminal with 1 ns timestamp resolution [6]. The position uncertainty is the total delay times the conveyor speed, not the sensor's number alone.

### Key numbers
- Sensing range: 500 mm (diffuse), 0.1-4.2 m (retroreflective), 30 m (through-beam) for the PR-G series [2]; depends on type, target color, and reflector
- Response time: 0.5-1 ms for the PR-G series [2]
- Position error from delay = conveyor speed x total delay; 1 ms at 200 mm/s is 0.2 mm
- Washdown ratings: IP68 and IP69K on the PR-G [2]

### Sources
1. [Photoelectric sensor basics: detection principle](https://www.keyence.com/ss/products/sensor/sensorbasics/photoelectric/info/) — Keyence; through-beam, retroreflective, and reflective types
2. [PR-G series specifications](https://www.keyence.com/products/sensor/photoelectric/pr-g/specs/) — Keyence; sensing distances, response times, light sources, IP ratings, housing material
3. [Proximity sensor basics](https://www.keyence.com/ss/products/sensor/sensorbasics/proximity/info/) — Keyence; how inductive proximity sensors detect metal
4. [Real-Time (TwinCAT 3 basics)](https://infosys.beckhoff.com/content/1033/tc3_grundlagen/6828869003.html) — Beckhoff Information System; each task cycle copies inputs, runs the program, then updates outputs
5. [EV series specifications](https://www.keyence.com/products/sensor/proximity/ev/specs/) — Keyence; inductive sensor detecting distances of 1.5-27 mm
6. [EL1252 digital input terminal with timestamp](https://www.beckhoff.com/en-us/products/i-o/ethercat-terminals/el1xxx-digital-input/el1252.html) — Beckhoff; 1 ns timestamp of input edges, input delay and filter
7. [Photoelectric Sensor Solutions](https://info.bannerengineering.com/cs/groups/public/documents/literature/b_51180814.pdf) — Banner Engineering catalog; opposed (through-beam) mode is impervious to target color and finish, diffuse mode range shrinks with target reflectivity
8. [Reliable object and transparency detection](https://blog.pepperl-fuchs.com/en/2025/reliable-object-and-transparency-detection-photoelectric-sensors-in-packaging-technology/) — Pepperl+Fuchs blog, 2025 (vendor blog); clear film attenuates a beam only 5-10%, polarizing reflectors
9. [16 CFR 1211.8, Requirements for protection against entrapment](https://www.law.cornell.edu/cfr/text/16/1211.8) — US Code of Federal Regulations (Cornell LII copy); photoelectric sensor that reverses a closing garage door

## IMU
id: imu
requires: none
aka: inertial measurement unit, accelerometer, gyroscope, gyro, MEMS IMU

### Plain
An IMU is like your inner ear: without looking at anything, it senses which way is down and when you are turning or speeding up. A robot uses it to know how it is tilted, how fast it is rotating, and when it has been bumped. But like walking with your eyes closed, it soon loses track of where it has gone unless something else corrects it.

### Where the analogy breaks
Your brain blends the inner ear with your eyes all the time; an IMU only outputs raw rates and accelerations, and software must add them up over time, so tiny errors grow into large ones. An IMU also cannot tell where something is, only how it is moving and which way gravity points.

### Precise
An IMU (inertial measurement unit) combines an accelerometer, which measures acceleration along three axes including the steady pull of gravity, and a gyroscope, which measures rotation rate (how fast it turns, in degrees per second) around three axes. Robot IMUs are usually MEMS parts (tiny mechanical structures etched into a silicon chip). The Bosch BMI088, aimed at drones and robots, measures up to ±24 g and ±2000 °/s, at a selectable output data rate (samples per second) of 12.5 Hz to 2 kHz [1]. IMUs are also built into other sensors: the Livox Mid-360 lidar carries an ICM40609 [3], which TDK describes as a 6-axis MEMS device [5], and the RealSense D435i depth camera includes one [4]. The high sample rate lets an IMU fill the gaps between camera or lidar frames that arrive only 10-90 times a second [3][4].

Drift is the main limit. Bias is a constant offset in the output [2]; bias instability is how much that offset wanders during operation at constant temperature [2]; and angle random walk is the angle error that noise builds up when rotation rate is added up over time, growing with the square root of time [2]. To get an angle, software integrates (adds up over time) the gyro's rate, so an uncorrected bias makes angle error grow steadily: the BMI088's typical lifetime gyro offset of ±1 °/s [1] would mean 60° of heading error per minute if it were never measured and subtracted. To get position, software integrates acceleration twice, so a bias error grows with time squared: a leftover accelerometer bias of just 1 mg (one thousandth of gravity) gives about 0.5 m of position error after 10 s. That is why mobile robots blend IMU readings with wheel odometry, lidar, or camera position estimates that do not drift, using state estimators (software that merges several imperfect sensors into one best guess of position and motion) such as ROS's robot_localization [6]. An IMU is trusted far more for tilt, because gravity is always there as a reference, but with a catch: the accelerometer cannot tell gravity from the robot's own acceleration, so any speeding up, braking, or turning shows up as false tilt [8]. Attitude estimators (software that tracks which way the sensor is tilted and facing) therefore lean on the gyro for fast changes and on the accelerometer's gravity reading to stop long-term drift, often with a Kalman filter (a standard recipe for weighting each sensor by how much it can be trusted) [8]. Without an IMU, a balancing or moving robot has no fast sense of its own tilt and rotation between slower camera or lidar updates.

### On the cheese plate line
The fixed pick robots do not need IMUs, because their joint encoders already know where the arm is. One practical use is in the overhead camera mounts (an illustrative design idea): a depth camera with a built-in IMU, such as the D435i [4], reports which way gravity points, so if that reading shifts by more than about 0.2° after a washdown, the bracket was probably knocked, and 0.2° at 600 mm moves the camera's aim by about 2 mm. The check must watch the change, not the absolute value, since a typical MEMS accelerometer offset (±20 mg over life for the BMI088 [1]) alone equals about ±1.1° of absolute tilt error. It should also compare readings taken at the same temperature: the BMI088's offset drifts by about ±0.2 mg per degree C [1], so a camera still about 17 C warmer after a hot-water wash could show a false 0.2° shift (illustrative). This works only because the camera is standing still; on a moving mount, acceleration would look like tilt [8]. The tote-delivery mobile robot uses its IMU to track turns between lidar updates.

### Elsewhere
A warehouse AMR turning on a freshly mopped floor may spin its wheels, so wheel encoders alone overestimate how far it turned; fusing wheel odometry with the IMU's gyro, as robot_localization does [6], lets the measured rotation correct the heading. A humanoid robot uses its IMU to sense that it is starting to tip and adjust its balance quickly; one balance controller needs only a 6-axis IMU plus the joint encoders [7].

### Why it exists
It is the only sensor that measures motion directly, hundreds to thousands of times a second [1], without needing to see anything. That makes it the fast, short-term sense that slower sensors like cameras and lidar correct.

### Connects to
- [[mobile-robot]] — mobile robots rely on IMUs for heading between slower position updates
- [[humanoid]] — balance depends on fast tilt and rotation sensing
- [[encoder]] — encoders measure joint or wheel rotation and are often combined with IMU readings
- [[lidar]] — some 3D lidars, like the Mid-360, carry a built-in IMU

### Real products and tools
- **Bosch BMI088** — accelerometer-plus-gyroscope IMU for drones and robots: ±24 g, ±2000 °/s, up to 2 kHz [1]
- **TDK InvenSense ICM-40609** — 6-axis MEMS IMU built into the Livox Mid-360 lidar [3][5]
- **RealSense D435i** — stereo depth camera with a built-in IMU [4]

### Common misconception
**Misconception:** An IMU tells a robot where it is.

**Reality:** It measures acceleration and rotation rate, not position. Position comes from adding acceleration up twice, which turns a bias of one thousandth of gravity into about half a meter of error in 10 seconds. IMUs are excellent for tilt, rotation, and short-term motion, and must be corrected by sensors that see the world.

### Key numbers
- Measurement range: ±3 to ±24 g and ±125 to ±2000 °/s, selectable (BMI088) [1]
- Sample rate: 12.5 Hz to 2 kHz (BMI088) [1]
- Gyro noise: 0.014 °/s/√Hz (BMI088), which equals an angle random walk of 0.014 °/√s [1][2], or about 0.14° of random angle error after 100 s
- Typical lifetime offset if never calibrated: ±1 °/s gyro and ±20 mg accelerometer (BMI088) [1]
- Offset temperature drift: ±0.015 °/s per degree C gyro and ±0.2 mg per degree C accelerometer (BMI088) [1]
- Position drift from a constant accelerometer bias = ½ x bias x time²

### Sources
1. [BMI088](https://www.bosch-sensortec.com/products/motion-sensors/imus/bmi088/) — Bosch Sensortec; ranges, output data rates, noise density, lifetime offsets, target applications
2. [IMU Specifications](https://www.vectornav.com/resources/inertial-navigation-primer/specifications--and--error-budgets/specs-imuspecs) — VectorNav inertial navigation primer; bias, bias instability, angle and velocity random walk
3. [Livox Mid-360 specs](https://www.livoxtech.com/mid-360/specs) — Livox; built-in ICM40609 IMU
4. [Depth Camera D435i](https://realsenseai.com/products/depth-camera-d435i/) — RealSense, Inc.; depth camera with built-in IMU, depth up to 90 fps
5. [ICM-40609-D](https://invensense.tdk.com/products/motion-tracking/6-axis/icm-40609-d/) — TDK InvenSense; 6-axis MEMS motion tracking device
6. [robot_localization documentation](https://github.com/cra-ros-pkg/robot_localization/blob/rolling-devel/doc/index.rst) — robot_localization (ROS package); state estimators that fuse any number of IMUs and odometry sources
7. [Direct Centroidal Control for Balanced Humanoid Locomotion](https://arxiv.org/abs/2208.04757) — Ficht and Behnke, CLAWAR 2022; humanoid balance control using only a 6-axis IMU and joint encoders
8. [Attitude and Heading Reference System (AHRS)](https://www.vectornav.com/resources/inertial-navigation-primer/theory-of-operation/theory-ahrs) — VectorNav inertial navigation primer; the accelerometer senses gravity plus motion, dynamic motion corrupts pitch and roll, gyro and accelerometer combined with a Kalman filter

## Camera calibration
id: camera-calibration
requires: camera-2d, frames
aka: intrinsic calibration, intrinsics, lens distortion, reprojection error, checkerboard, ChArUco

### Plain
Camera calibration is like checking a slightly warped window by holding graph paper behind it: you know the grid's lines are straight and evenly spaced, so the way they look bent and stretched tells you exactly how the glass distorts the view. For a camera, the graph paper is a printed checkerboard photographed from many angles, and the result is a handful of numbers describing the lens. Software then uses those numbers to turn any pixel into the exact direction the light came from.

### Where the analogy breaks
One straight-on look at a grid shows the bending but not the camera's exact zoom or where the lens's center falls on the sensor; those only come out of views of the board tilted at several different angles. And unlike replacing a warped window, calibration changes nothing in the camera: it only produces numbers that software applies to every measurement, and they become invalid the moment anyone touches the focus or zoom.

### Precise
Calibration estimates the intrinsics (the camera's internal geometry), which OpenCV packs into a 3 x 3 camera matrix: fx and fy are the focal length expressed in pixels, and (cx, cy) is the principal point (where the lens's central axis hits the sensor, usually near the image center) [1]. It also estimates lens distortion: radial terms k1, k2, k3 describe barrel or pincushion bending (straight lines bowing outward or inward) that grows toward the image edges, and tangential terms p1, p2 describe a lens sitting not quite parallel to the sensor [1]. Together these form the projection model (the math that predicts which pixel a 3D point lands on). The intrinsics stay valid only while the focal length is unchanged, and if images are resized, the matrix must be scaled by the same factor [1].

The standard method, from Zhang (2000), photographs a flat target of known geometry at several orientations, at least two in theory [2]. Software detects the target's corners, computes a closed-form first guess (a direct formula, no trial and error), then refines everything with nonlinear optimization (repeatedly nudging all the numbers together to shrink the mismatch) [2]. OpenCV's calibrateCamera uses Levenberg-Marquardt (a standard recipe for those repeated nudges that shrinks the sum of squared mismatches) to minimize the reprojection error: the distance in pixels between each detected corner and where the model predicts it should appear [1]. It returns the overall RMS (root mean square, a kind of average) reprojection error, and its variant calibrateCameraExtended also returns the error for each image and the uncertainty of each intrinsic parameter [1]. A clean setup lands well under one pixel: MathWorks' worked example reports 0.19 pixels [4], while one OpenCV forum user's 112-pixel result dropped to about 0.31 once the 3D board points and 2D image points were listed in the same order [5].

The target matters. A plain checkerboard gives precise corners but must be fully visible in every image. A ChArUco board is a checkerboard with ArUco markers (small square barcodes, each with its own ID) printed in the white squares, so each corner can be identified even when part of the board is hidden or out of view; it combines marker flexibility with checkerboard corner precision [3]. Data quality matters more than the solver: OpenCV advises many board poses with significant tilt, spread across the working distance range [1]; the board should reach into the image corners, where distortion is strongest [5], be mounted flat, and have its squares measured rather than trusted from the printer [5][6]. Small errors become millimeters: with a 12 mm lens and 3.45 µm pixels, fx is about 3478 pixels, so at 600 mm one pixel spans about 0.17 mm, and a principal point off by 5 pixels (about the uncertainty in MathWorks' example [4]) shifts every computed position by about 0.9 mm. Without calibration, straight edges bend near the image edges and pixel positions convert to millimeters with errors that grow toward the edges, which no robot programming can remove.

### On the cheese plate line
Each pick-station camera is calibrated at installation and again after any lens or focus change (a moved mount needs a new hand-eye calibration, not a new intrinsic one). A technician moves a rigid, washable ChArUco plate, about 7 x 5 squares of 30 mm (illustrative), through 20-30 positions under the camera, tilting it and covering the image corners. For the cheese station camera at about 0.17 mm per pixel, a result of 0.2-0.3 pixels RMS means the model agrees with the detected corners to about 0.05 mm on the board. Calibration is done in the 2-4 C room with the station's lights on, because temperature shifts focal length and principal point: one study of an SLR camera measured about 0.03 mm of focal length change over a 30 C swing, and saw its largest principal point shifts when the camera was colder than about 5-10 C [7], which is exactly this room's range.

### Elsewhere
A stereo endoscope (two tiny cameras in one tube) used in keyhole surgery must be calibrated before its images can be turned into 3D measurements of tissue; one study found that self-heating after startup shifts the calibration enough that regular recalibration may be needed [8]. In a parcel warehouse, a camera that measures box sizes for shipping charges is calibrated so a 400 mm box measures 400 mm everywhere in the image, not 396 mm near the edges where the lens bends the picture (illustrative numbers).

### Why it exists
Every real lens bends the image a little, and no camera is built exactly to its nominal numbers. Calibration measures those departures so software can turn pixels into accurate directions and, with distance, millimeters.

### Connects to
- [[hand-eye-calibration]] — needs good intrinsics first, because it relies on the camera's estimate of the board's pose
- [[depth-camera]] — stereo depth depends on calibrated focal lengths and the baseline between the two cameras
- [[opencv]] — provides calibrateCamera, ChArUco detection, and undistortion
- [[frames]] — calibration also yields each board pose in the camera's coordinate frame
- [[commissioning]] — calibrating cameras is part of bringing a vision station online

### Real products and tools
- **OpenCV calib3d module** — calibrateCamera, findChessboardCorners, solvePnP, projectPoints, and undistortion [1]
- **OpenCV ChArUco support** — CharucoBoard, CharucoDetector, and matchImagePoints in the objdetect module of OpenCV 4.x [3]
- **MATLAB Computer Vision Toolbox** — single-camera calibration with reprojection error plots and parameter standard errors [4]

### Common misconception
**Misconception:** A low reprojection error proves the calibration is accurate.

**Reality:** The error is measured on the same images used to fit the model, so it shows how well the model fits those views, not how well it predicts new ones. If every image shows the board flat-on at one distance, the data cannot separate the parameters well, which is why OpenCV asks for tilted views across the working range [1] and Zhang's method needs differently oriented views [2]. Check per-image errors and parameter uncertainties, which calibrateCameraExtended returns [1], and verify by measuring a known object at the working distance.

### Key numbers
- Reprojection error: 0.19 px in MathWorks' example and 0.31 px in a fixed OpenCV forum case, versus 112 px when point order was wrong [4][5]; depends on corner detection, blur, and lens quality
- Minimum views: 2 board orientations in theory [2]; many more, with varied tilt and distance, in practice [1]
- Distortion terms: 5 in the common model (k1, k2, p1, p2, k3), up to 14 in OpenCV's full model [1]
- Millimeters per pixel ≈ working distance x pixel size / focal length; 600 mm x 3.45 µm / 12 mm ≈ 0.17 mm

### Code sketch
```python
import cv2
import numpy as np

# Describe the physical board: 7 x 5 squares, 30 mm squares, 22 mm markers.
# Measure the printed board with calipers and use the measured sizes.
dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_5X5_100)
board = cv2.aruco.CharucoBoard((7, 5), 30.0, 22.0, dictionary)   # units: mm
detector = cv2.aruco.CharucoDetector(board)

obj_points, img_points = [], []
for path in calibration_image_paths:          # 20-30 photos: tilted, near and far, reaching the corners
    gray = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    ch_corners, ch_ids, _, _ = detector.detectBoard(gray)
    if ch_ids is None or len(ch_ids) < 6:     # too few corners found: skip this view
        continue
    obj, img = board.matchImagePoints(ch_corners, ch_ids)   # 3D board points <-> 2D pixels
    obj_points.append(obj)
    img_points.append(img)

image_size = gray.shape[::-1]                 # (width, height)
rms, K, dist, rvecs, tvecs = cv2.calibrateCamera(
    obj_points, img_points, image_size, None, None)
# K    = 3x3 camera matrix: fx, fy (focal length in pixels) and cx, cy (principal point)
# dist = k1, k2, p1, p2, k3 (radial and tangential lens distortion)
print("overall RMS reprojection error (px):", rms)

# Per-view check: reproject the board with the fitted model and find views that disagree.
for i, (obj, img) in enumerate(zip(obj_points, img_points)):
    projected, _ = cv2.projectPoints(obj, rvecs[i], tvecs[i], K, dist)
    err = np.sqrt(np.mean(np.sum((projected - img) ** 2, axis=-1)))
    if err > 2 * rms:
        print("view", i, "error", err, "px: blurred, moved, or misdetected; drop it and rerun")
```

### Sources
1. [OpenCV calib3d.hpp (4.x)](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) — OpenCV source and reference documentation; camera matrix, distortion model, calibrateCamera algorithm, return values, data collection advice
2. [A Flexible New Technique for Camera Calibration](https://www.microsoft.com/en-us/research/publication/a-flexible-new-technique-for-camera-calibration/) — Zhengyou Zhang, IEEE Transactions on Pattern Analysis and Machine Intelligence, 2000; the planar target method
3. [Detection of ChArUco Boards](https://github.com/opencv/opencv/blob/4.x/doc/tutorials/objdetect/charuco_detection/charuco_detection.markdown) — OpenCV tutorial (4.x); ChArUco benefits (partial views, corner accuracy), CharucoDetector::detectBoard, CharucoBoard::matchImagePoints
4. [Evaluating the Accuracy of Single Camera Calibration](https://www.mathworks.com/help/vision/ug/evaluating-the-accuracy-of-single-camera-calibration.html) — MathWorks; example reprojection error and parameter standard errors
5. [Cannot get good camera calibration](https://forum.opencv.org/t/cannot-get-good-camera-calibration/1270) — OpenCV forum (user discussion); common data collection mistakes and before-and-after reprojection errors
6. [Calibration Patterns](https://www.mathworks.com/help/vision/ug/calibration-patterns.html) — MathWorks; mount the board on a flat surface, measure the printed square size
7. [The effects of temperature variation on single-lens-reflex digital camera calibration parameters](https://www.isprs.org/proceedings/XXXVIII/part5/papers/158.pdf) — Smith and Cope, ISPRS Archives XXXVIII Part 5, 2010; focal length and principal point change with temperature
8. [Guided Calibration of Medical Stereo Endoscopes](https://isprs-archives.copernicus.org/articles/XLIII-B2-2022/679/2022/) — Hardner, Docea, and Schneider, ISPRS Archives, 2022; stereo endoscope calibration for 3D reconstruction, self-heating drift

## Camera-to-robot (hand-eye) calibration
id: hand-eye-calibration
requires: camera-calibration, frames, forward-kinematics
aka: hand-eye calibration, camera-to-robot calibration, eye-in-hand, eye-to-hand, AX=XB, extrinsic calibration

### Plain
Hand-eye calibration is like a friend on the phone guiding you to your keys: "they're 30 centimeters to my left" only helps if you know exactly where your friend is standing and which way they face. A camera reports where it sees a cheese wedge relative to itself, but the robot needs that position relative to its own base. Hand-eye calibration measures exactly where the camera sits relative to the robot, so "where the camera sees it" becomes "where the gripper should go."

### Where the analogy breaks
You would find your friend by asking; the robot finds the camera by moving to many poses, watching a fixed board, and solving an equation, because the camera's true optical center is inside the housing where no tape measure can reach. And when the camera rides on the robot's wrist, the "friend" moves with your hand, which changes the problem.

### Precise
There are two setups [1]. In eye-in-hand, the camera is mounted on the robot's gripper, and the unknown is the camera's pose (position and orientation) relative to the gripper. In eye-to-hand, the camera is fixed in the cell, the robot holds the board, and the unknown is the camera's pose relative to the robot base. Calibration collects pairs of measurements at many robot poses: the gripper's pose in the base frame, read from the controller's forward kinematics (joint angles turned into a gripper position), and the board's pose in the camera frame, found by PnP (perspective-n-point: computing the board's position from where its known corners appear in the image, using the intrinsics) [1].

Between any two poses, the robot's own motion A and the motion the camera observes, B, are tied together by the unknown transform X (a fixed shift plus rotation; for eye-in-hand, where the camera sits relative to the gripper), giving the equation AX = XB; hand-eye calibration is often called solving AX = XB [1]. OpenCV's calibrateHandEye offers five solvers [1]: Tsai-Lenz, Park-Martin, and Horaud-Dornaika find rotation first and then translation, while Andreff and Daniilidis solve both at once. Tsai and Lenz's 1989 method was built to be fully automatic, and the final computation takes only a few milliseconds [2]. At least two motions with non-parallel rotation axes, so at least three poses, are mathematically required, and many more are strongly recommended [1]; Zivid suggests 10-20 pose pairs [3]. Rotation between poses is what makes X solvable, so poses must tilt about different axes. For eye-to-hand, the same function works when given the inverted robot poses (base relative to gripper), and it then returns the camera's pose in the base frame [1]. A related function, calibrateRobotWorldHandEye, solves AX = ZB to find both the gripper-to-camera and base-to-world transforms [1].

Errors come from the robot as well as the camera. Robots are repeatable but not inherently accurate (they return to the same spot very consistently, but the position they report for a new spot can be off by more), so the poses the controller reports carry their own error, and temperature affects both robot and camera [5]. Rotation errors are the dangerous ones because they grow with distance: lateral miss ≈ angle error in radians x distance. A 0.1° error in the camera's orientation, 600 mm from the camera, moves the computed pick point by about 1 mm; 0.5° moves it by about 5 mm. Translation errors pass straight through, millimeter for millimeter. Calibration tools report residuals (how much the poses still disagree after the fit): Zivid expects sub-millimeter translation residuals on smaller robots, millimeter-level on larger ones, and sub-degree rotation residuals, but warns that good residuals do not guarantee accurate picking and recommends a touch test, where the robot points a sharp tool at a feature the camera located and you inspect the gap [4]. Without this calibration, every camera measurement lands in the wrong place by a fixed but unknown offset, and the robot misses consistently.

### On the cheese plate line
The cheese station's overhead camera is eye-to-hand: during commissioning the robot holds a ChArUco plate in place of its vacuum gripper and moves through about 15 poses, tilting it about different axes under the camera (illustrative). The budget is tight: a 20 mm vacuum cup on a wedge face about 35 mm wide can be off center by at most ±7.5 mm before its edge hangs off the wedge, or about ±5 mm keeping a margin for a good seal (illustrative sizes), and a 0.3° orientation error alone, at 600 mm, uses about 3 mm of that. The apple station's wrist camera is eye-in-hand and is calibrated the same way with the board fixed on the table. Both are redone after any camera remount or whenever the robot loses its calibration, since either invalidates the result [5], and rechecked with a touch test [4].

### Elsewhere
In a warehouse bin-picking cell with a 3D camera fixed about 1.5 m above the bin (eye-to-hand, illustrative), the camera's distance makes orientation error matter even more. A 0.1° error at 1.5 m becomes about 2.6 mm at the part, versus about 1 mm at 600 mm. That is one reason such cells mount the camera as close as the needed field of view allows (an illustrative design rule).

### Why it exists
Cameras and robots each measure in their own coordinate frames, and the camera's optical center cannot be measured with a ruler. Hand-eye calibration is the bridge that turns a camera's measurements into robot motions.

### Connects to
- [[camera-calibration]] — the board poses used here are only as good as the camera's intrinsics
- [[frames]] — the result is one more fixed transform in the robot's chain of coordinate frames
- [[forward-kinematics]] — supplies the gripper pose at each calibration pose
- [[repeatability]] — robot accuracy, not only repeatability, limits how good the calibration can be
- [[commissioning]] — hand-eye calibration and touch-test checks are commissioning steps for every vision-guided station

### Real products and tools
- **OpenCV calibrateHandEye and calibrateRobotWorldHandEye** — five hand-eye solvers and a robot-world solver in the calib3d module [1]
- **MoveIt Calibration** — hand-eye calibration tools for ROS robot arms, developed and tested on ROS 1 Melodic and Noetic, with a separate ros2 branch for ROS 2; recommends ChArUco boards [6]
- **Zivid hand-eye calibration** — a hand-eye workflow with dataset guidance and verification tools for Zivid 3D cameras [3][4]

### Common misconception
**Misconception:** Hand-eye calibration is done once at installation and then forgotten.

**Reality:** It must be redone whenever the camera is removed and remounted or the robot loses its own calibration [5], and a bracket knocked during cleaning can shift the camera without anyone noticing. Temperature matters too: Zivid recommends warming up and calibrating under the conditions the cell will run in [5]. A quick touch test [4] on a regular schedule catches drift before it shows up as missed picks.

### Key numbers
- Minimum data: 2 motions with non-parallel rotation axes, so 3 poses [1]; 10-20 pose pairs recommended [3]
- Residuals: sub-millimeter (smaller robots) to millimeter-level (larger robots) translation, sub-degree rotation [4]
- Lever-arm rule: miss ≈ rotation error in radians x distance; 0.1° at 600 mm ≈ 1 mm, 0.5° at 600 mm ≈ 5 mm
- Solvers in OpenCV: 5 (Tsai, Park, Horaud, Andreff, Daniilidis) [1]

### Code sketch
```python
import cv2
import numpy as np

# Eye-in-hand: camera on the wrist, ChArUco board fixed on the table.
# robot.* and camera.* stand in for your robot and camera SDKs.
# K, dist come from camera calibration; board and detector as in that sketch.
R_gripper2base, t_gripper2base = [], []
R_target2cam, t_target2cam = [], []

for pose in calibration_poses:                 # 10-20 poses, rotated about different axes
    robot.move_to(pose)
    robot.wait_until_settled()                 # never grab an image while the arm is moving
    T_bg = robot.get_flange_pose()             # 4x4 gripper pose in base frame (forward kinematics), mm
    gray = camera.grab_gray()
    ch_corners, ch_ids, _, _ = detector.detectBoard(gray)
    if ch_ids is None or len(ch_ids) < 6:
        continue
    obj, img = board.matchImagePoints(ch_corners, ch_ids)
    ok, rvec, tvec = cv2.solvePnP(obj, img, K, dist)    # board pose in camera frame (PnP)
    if not ok:
        continue
    R_gripper2base.append(T_bg[:3, :3])
    t_gripper2base.append(T_bg[:3, 3])
    R_target2cam.append(cv2.Rodrigues(rvec)[0])         # rotation vector -> 3x3 matrix
    t_target2cam.append(tvec)

# Solve A X = X B, where X is the camera pose in the gripper frame.
R_cam2gripper, t_cam2gripper = cv2.calibrateHandEye(
    R_gripper2base, t_gripper2base, R_target2cam, t_target2cam,
    method=cv2.CALIB_HAND_EYE_TSAI)           # also _PARK, _HORAUD, _ANDREFF, _DANIILIDIS

T_gc = np.eye(4)
T_gc[:3, :3] = R_cam2gripper
T_gc[:3, 3] = t_cam2gripper.ravel()

# Using it: the camera sees a wedge at p_cam (mm, camera frame) while the gripper
# is at T_bg_now. Chain the transforms to express the point in the base frame.
p_base = T_bg_now @ T_gc @ np.append(p_cam, 1.0)

# Eye-to-hand (fixed camera, board held by the gripper): pass the inverted robot
# poses (base pose in the gripper frame) as the first two arguments; the result is
# then the camera pose in the robot base frame.
```

### Sources
1. [OpenCV calib3d.hpp (4.x)](https://raw.githubusercontent.com/opencv/opencv/4.x/modules/calib3d/include/opencv2/calib3d.hpp) — OpenCV source and reference documentation; calibrateHandEye, its five methods, AX = XB, eye-in-hand and eye-to-hand equations, minimum motions, calibrateRobotWorldHandEye
2. [A new technique for fully autonomous and efficient 3D robotics hand/eye calibration](https://research.ibm.com/publications/a-new-technique-for-fully-autonomous-and-efficient-3d-robotics-handeye-calibration) — Tsai and Lenz, 1989; IBM Research publication record and abstract
3. [How to get good dataset for hand-eye calibration](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-getting-good-dataset.html) — Zivid; 10-20 pose pairs and pose variety
4. [How to verify hand-eye calibration](https://support.zivid.com/academy/applications/hand-eye/hand-eye-calibration-verification.html) — Zivid; expected residuals and the touch test
5. [Cautions and recommendations for hand-eye calibration](https://support.zivid.com/academy/applications/hand-eye/cautions-and-recommendations.html) — Zivid; robot accuracy, warm-up, when to recalibrate
6. [moveit_calibration](https://github.com/moveit/moveit_calibration) — MoveIt; hand-eye calibration tools for ROS, tested ROS versions, ros2 branch, ChArUco recommendation
