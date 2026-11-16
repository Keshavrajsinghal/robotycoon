# Workbenches

## Workbench: wb1-dof
title: PH Degrees of freedom
ride: ride2
stop: arm-motion
concepts: dof, six-axis
order: 1

### Goal
PLACEHOLDER: goal for wb1-dof.
### Plain
PLACEHOLDER: plain workbench text for wb1-dof.
### Precise
PLACEHOLDER: precise workbench text for wb1-dof.
### How to use
PLACEHOLDER: lock or unlock joints, jog the slice or turn the free joints with their sliders, and match the ghost slice.
### What to notice
PLACEHOLDER: notice which pose components the free joints can change.
### Data
```json
{
  "note": "Illustrative placeholder values.",
  "links_m": {"base": 0.3, "upper_arm": 0.34, "forearm": 0.32, "wrist": 0.07, "tool": 0.08},
  "joints": [
    {"label": "PH J1", "min_deg": -170, "max_deg": 170, "start_deg": 0},
    {"label": "PH J2", "min_deg": -90, "max_deg": 120, "start_deg": 35},
    {"label": "PH J3", "min_deg": -120, "max_deg": 150, "start_deg": -35},
    {"label": "PH J4", "min_deg": -180, "max_deg": 180, "start_deg": 0},
    {"label": "PH J5", "min_deg": -125, "max_deg": 125, "start_deg": 90},
    {"label": "PH J6", "min_deg": -180, "max_deg": 180, "start_deg": 0}
  ],
  "tray": {"x_m": 0.46, "y_m": -0.12, "z_m": -0.08, "length_m": 0.24, "width_m": 0.17},
  "slice": {"radius_m": 0.035, "thickness_m": 0.01},
  "grapes": {"radius_m": 0.04},
  "target": {"x_m": -0.02, "y_m": 0.03, "tilt_deg": 60, "heading_deg": -90},
  "tolerance": {"position_mm": 12, "angle_deg": 8},
  "start_unlocked": [1, 2, 3, 6],
  "start_level": true,
  "presets": [
    {"label": "PH Level four", "unlocked": [1, 2, 3, 6], "level": true},
    {"label": "PH Five", "unlocked": [1, 2, 3, 5, 6]},
    {"label": "PH All six", "unlocked": [1, 2, 3, 4, 5, 6]}
  ]
}
```

## Workbench: wb2-ik
title: PH Inverse kinematics
ride: ride2
stop: joint-targets
concepts: inverse-kinematics
order: 2

### Goal
PLACEHOLDER: goal for wb2-ik.
### Plain
PLACEHOLDER: plain workbench text for wb2-ik.
### Precise
PLACEHOLDER: precise workbench text for wb2-ik.
### How to use
PLACEHOLDER: drag the fake target, tilt the fake fingers, flip the fake posture switch.
### What to notice
PLACEHOLDER: notice the fake effect.
### Data
```json
{"note": "Illustrative placeholder values.", "upper_arm_mm": 425, "forearm_mm": 390, "tool_mm": 150, "shoulder_height_mm": 440, "tray_x_mm": 260, "tote": {"near_x_mm": 470, "far_x_mm": 760, "wall_mm": 110}, "tilt_max_deg": 60, "start_target_mm": [690, -60], "bunches": [{"x_mm": 540, "z_mm": -380, "tilt_deg": 15}, {"x_mm": 630, "z_mm": -380, "tilt_deg": 0}, {"x_mm": 710, "z_mm": -370, "tilt_deg": -45}], "joints": [{"name": "PH Base"}, {"name": "PH Shoulder", "min_deg": -45, "max_deg": 150}, {"name": "PH Elbow", "min_deg": -160, "max_deg": 150}, {"name": "PH Wrist roll"}, {"name": "PH Wrist bend", "min_deg": -135, "max_deg": 135}, {"name": "PH Wrist turn"}], "solutions": ["PH Elbow up", "PH Elbow down"]}
```

## Workbench: wb3-control
title: PH Control loop
ride: ride2
stop: drive
concepts: control-loops, servo-drive, servo-motor
order: 3

### Goal
PLACEHOLDER: goal for wb3-control. Meet the fake spec with the fake payload on.
### Plain
PLACEHOLDER: plain workbench text for wb3-control.
### Precise
PLACEHOLDER: precise workbench text for wb3-control.
### How to use
PLACEHOLDER: drag the three fake gain sliders and flip the fake payload toggle.
### What to notice
PLACEHOLDER: notice the fake effect of the payload on the same gains.
### Data
```json
{
  "note": "Illustrative placeholder values.",
  "drive_loop_hz": 4000,
  "setpoint_hz": 500,
  "duration_s": 1.0,
  "target_deg": 30,
  "load": {
    "empty": {"label": "PH Empty fingers", "inertia_kgm2": 0.04, "gravity_nm": 0},
    "loaded": {"label": "PH Holding a bunch", "inertia_kgm2": 0.085, "gravity_nm": 1.5}
  },
  "damping_nm_s_per_rad": 0.05,
  "friction_nm": 0.05,
  "torque_limit_nm": 6,
  "integral_limit_nm": 1.0,
  "gains": {
    "kp": {"min": 0, "max": 80, "start": 48},
    "ki": {"min": 0, "max": 400, "start": 0},
    "kd": {"min": 0, "max": 5, "start": 2}
  },
  "spec": {
    "max_overshoot_pct": 5,
    "max_settling_s": 0.4,
    "settle_band_pct": 2,
    "max_steady_state_error_deg": 0.1
  }
}
```

## Workbench: wb4-calibration
title: PH Calibration
ride: ride2
stop: position-3d
concepts: hand-eye-calibration, camera-calibration, frames
order: 4

### Goal
PLACEHOLDER: goal for wb4-calibration (the fake camera starts knocked; recalibrate, then land a pick within the allowed offset).
### Plain
PLACEHOLDER: plain workbench text for wb4-calibration.
### Precise
PLACEHOLDER: precise workbench text for wb4-calibration.
### How to use
PLACEHOLDER: tap a bunch in the fake camera image, knock the camera with the sliders, press Calibrate, pick again.
### What to notice
PLACEHOLDER: notice the fake footprints drift apart and the fake residual.
### Data
```json
{
  "note": "Illustrative placeholder values.",
  "image_px": [640, 480],
  "mm_per_px": 0.8,
  "camera_height_mm": 600,
  "camera_center_mm": [560, 0],
  "camera_yaw_deg": 180,
  "lens_k1": -0.1,
  "board_noise_px": 0.3,
  "robot_pose_error_mm": 0.3,
  "bunch_center_noise_mm": 1.5,
  "calibration_poses": 6,
  "bunch_mm": [140, 90],
  "tolerance_mm": 8,
  "washdown_knock": {"tilt_x_deg": -0.8, "tilt_y_deg": 1.2, "yaw_deg": 0.6},
  "bump_max": {"tilt_deg": 3, "yaw_deg": 5, "height_mm": 30}
}
```

## Workbench: wb5-teleop
title: PH Teleoperation under delay
ride: ride3
stop: operator
concepts: latency-budget, teleop-modes
order: 5

### Goal
PLACEHOLDER: grip a grape bunch from the tote before the plate time runs out, with the round trip at or above the target delay.
### Plain
PLACEHOLDER: plain workbench text for wb5-teleop. You are the remote operator and see the station a little late.
### Precise
PLACEHOLDER: precise workbench text for wb5-teleop, with real terms defined in plain words and a link to [[latency-budget]].
### How to use
PLACEHOLDER: In Direct, hold and drag the move pad to move the gripper, release to stop, and press Grip over a stem. In Assist, tap a marked stem. Raise the delay sliders until the round trip reaches the target, then grip a bunch. Cut link and the Watchdog box show what the watchdog does.
### What to notice
PLACEHOLDER: notice the fake effect of delay on direct control compared with assist.
### Data
```json
{"note": "Illustrative placeholder values.", "plate_time_s": 18, "tote_length_m": 0.6, "tote_width_m": 0.4, "bunches_per_tote": 4, "speed_cap_m_s": 0.05, "robot_speed_m_s": 0.25, "grip_tolerance_m": 0.01, "grip_time_ms": 1200, "camera_fps": 30, "command_rate_hz": 100, "watchdog_ms": 250, "heartbeat_timeout_ms": 2000, "target_rtt_ms": 400, "video_ms": {"min": 60, "max": 300, "default": 65}, "command_ms": {"min": 40, "max": 150, "default": 45}, "jitter_ms": {"min": 0, "max": 60, "default": 5}, "loss_pct": {"min": 0, "max": 20, "default": 0}}
```

## Workbench: wb6-line-balancing
title: PH Line balancing
ride: ride1
stop: apples
concepts: line-balancing, cycle-time
order: 6

### Goal
PLACEHOLDER: goal for wb6-line-balancing (make the target rate within the budget).
### Plain
PLACEHOLDER: plain workbench text for wb6-line-balancing.
### Precise
PLACEHOLDER: precise workbench text for wb6-line-balancing.
### How to use
PLACEHOLDER: pick a station column, then buy or undo its changes.
### What to notice
PLACEHOLDER: notice which changes move the line rate and which do not.
### Data
```json
{
  "note": "Illustrative placeholder values.",
  "target_per_hour": 200,
  "budget": 6,
  "cost_unit": "PH pts",
  "transfer_s": 1.5,
  "parallel_overhead_s": 0.5,
  "stop_s": 20,
  "short_stop_s": 30,
  "buffer": {"cost": 1, "capacity": 4},
  "robot_types": [
    {"id": "ph-delta", "kind": "delta", "label": "PH delta", "motion_s": 0.4, "cost": 5},
    {"id": "ph-scara", "kind": "scara", "label": "PH SCARA", "motion_s": 0.3, "cost": 6},
    {"id": "ph-arm", "kind": "six-axis", "label": "PH six-axis arm", "motion_s": 0.5, "cost": 7}
  ],
  "stations": [
    {"id": "denester", "work_s": 2.0, "picks": 1, "availability": 0.99},
    {"id": "grapes", "work_s": 9.0, "picks": 1, "availability": 0.95, "robot": "ph-arm", "tool": {"saves_s": 3.0, "cost": 2, "label": "PH softer gripper"}},
    {"id": "apples", "work_s": 17.0, "picks": 4, "availability": 0.98, "robot": "ph-delta", "robot_options": ["ph-delta", "ph-scara", "ph-arm"], "max_robots": 2, "tool": {"saves_s": 1.0, "cost": 2, "label": "PH faster robot"}},
    {"id": "crackers", "work_s": 6.0, "picks": 2, "availability": 0.99, "robot": "ph-scara"},
    {"id": "cheese", "work_s": 10.0, "picks": 3, "availability": 0.98, "robot": "ph-delta", "max_robots": 2, "tool": {"saves_s": 2.0, "cost": 2, "label": "PH wedge cup"}},
    {"id": "inspection", "work_s": 1.5, "availability": 1},
    {"id": "lidding", "work_s": 5.0, "availability": 0.98, "tool": {"saves_s": 1.5, "cost": 1, "label": "PH faster press"}},
    {"id": "outfeed", "work_s": 3.0, "availability": 0.99}
  ],
  "moves": [
    {"from": "apples", "to": "grapes", "seconds": 4.0, "cost": 1, "label": "PH one apple slice"},
    {"from": "apples", "to": "crackers", "seconds": 4.0, "cost": 2, "label": "PH one apple slice"}
  ]
}
```
