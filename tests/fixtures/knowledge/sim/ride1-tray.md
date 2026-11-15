---
ride: ride1
title: PLACEHOLDER The tray
order: 1
teaches: 6
---

# Ride 1: PLACEHOLDER The tray

## Intro
### Plain
PLACEHOLDER: intro for PLACEHOLDER The tray. The cart follows one thing through the whole ride.
### Precise
PLACEHOLDER: precise intro for PLACEHOLDER The tray, with real terms defined in plain words.

## Stop: denester
title: PH Tray denester
cargo: PH Empty fiber tray
cargo_detail: PH one molded tray
concepts: feeder, hygienic-design

### Plain
PLACEHOLDER: at ph tray denester, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for denester uses real terms (defined in plain words) and links [[feeder]].
### Question
PLACEHOLDER: which statement about denester is true?
- [ ] PLACEHOLDER wrong option A for denester :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for denester :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for denester :: PLACEHOLDER: why C is wrong.

## Stop: infeed
title: PH Infeed conveyor
cargo: PH Tray on the belt
cargo_detail: PH spaced and timed
concepts: conveyor, cycle-time

### Plain
PLACEHOLDER: at ph infeed conveyor, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for infeed uses real terms (defined in plain words) and links [[conveyor]].
### Question
PLACEHOLDER: which statement about infeed is true?
- [ ] PLACEHOLDER wrong option A for infeed :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for infeed :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for infeed :: PLACEHOLDER: why C is wrong.

## Stop: grapes
title: PH Grape station
cargo: PH Tray with grapes
cargo_detail: PH one bunch on the stem
concepts: scara, guarding

### Plain
PLACEHOLDER: at ph grape station, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for grapes uses real terms (defined in plain words) and links [[scara]].
### Question
PLACEHOLDER: which statement about grapes is true?
- [ ] PLACEHOLDER wrong option A for grapes :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for grapes :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for grapes :: PLACEHOLDER: why C is wrong.

## Stop: apples
title: PH Apple station
cargo: PH Plus apple slices
cargo_detail: PH about four slices
concepts: six-axis, line-balancing, dof
workbench: wb6-line-balancing

### Plain
PLACEHOLDER: at ph apple station, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for apples uses real terms (defined in plain words) and links [[six-axis]].
### Question
PLACEHOLDER: which statement about apples is true?
- [ ] PLACEHOLDER wrong option A for apples :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for apples :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for apples :: PLACEHOLDER: why C is wrong.

## Stop: crackers
title: PH Cracker station
cargo: PH Plus cracker packs
cargo_detail: PH two wrapped packs
concepts: delta

### Plain
PLACEHOLDER: at ph cracker station, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for crackers uses real terms (defined in plain words) and links [[delta]].
### Question
PLACEHOLDER: which statement about crackers is true?
- [ ] PLACEHOLDER wrong option A for crackers :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for crackers :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for crackers :: PLACEHOLDER: why C is wrong.

## Stop: cheese
title: PH Cheese station
cargo: PH Plus cheese wedges
cargo_detail: PH three wedges
concepts: delta, cycle-time

### Plain
PLACEHOLDER: at ph cheese station, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for cheese uses real terms (defined in plain words) and links [[delta]].
### Question
PLACEHOLDER: which statement about cheese is true?
- [ ] PLACEHOLDER wrong option A for cheese :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for cheese :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for cheese :: PLACEHOLDER: why C is wrong.

## Stop: inspection
title: PH Inspection
cargo: PH Inspected plate
cargo_detail: PH passed the camera check
concepts: inspection

### Plain
PLACEHOLDER: at ph inspection, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for inspection uses real terms (defined in plain words) and links [[inspection]].
### Question
PLACEHOLDER: which statement about inspection is true?
- [ ] PLACEHOLDER wrong option A for inspection :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for inspection :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for inspection :: PLACEHOLDER: why C is wrong.

## Stop: lidding
title: PH Lidding machine
cargo: PH Lidded plate
cargo_detail: PH clear lid sealed
concepts: packaging-machines

### Plain
PLACEHOLDER: at ph lidding machine, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for lidding uses real terms (defined in plain words) and links [[packaging-machines]].
### Question
PLACEHOLDER: which statement about lidding is true?
- [ ] PLACEHOLDER wrong option A for lidding :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for lidding :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for lidding :: PLACEHOLDER: why C is wrong.

## Stop: outfeed
title: PH Outfeed
cargo: PH Plate in the cart
cargo_detail: PH stacked for the galley
concepts: packaging-machines, cycle-time

### Plain
PLACEHOLDER: at ph outfeed, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for outfeed uses real terms (defined in plain words) and links [[packaging-machines]].
### Question
PLACEHOLDER: which statement about outfeed is true?
- [ ] PLACEHOLDER wrong option A for outfeed :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for outfeed :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for outfeed :: PLACEHOLDER: why C is wrong.

## Puzzle
title: PH Balance the line
type: budget

### Prompt
PLACEHOLDER: pick upgrades to bring the slowest station under the target.
### Data
```json
{
  "start_ms": 420,
  "target_ms": 300,
  "budget": 10,
  "unit": "effort points",
  "options": [
    {
      "id": "second-arm",
      "label": "PH Add a second arm",
      "saves_ms": 90,
      "cost": 6,
      "why": "PH: halves the work at the slow station."
    },
    {
      "id": "faster-gripper",
      "label": "PH Faster gripper",
      "saves_ms": 40,
      "cost": 3,
      "why": "PH: shaves time off each pick."
    },
    {
      "id": "paint",
      "label": "PH Repaint the guarding",
      "saves_ms": 0,
      "cost": 2,
      "why": "PH: looks nice, saves nothing (a trap)."
    },
    {
      "id": "faster-belt",
      "label": "PH Faster belt",
      "saves_ms": 5,
      "cost": 4,
      "why": "PH: the belt was not the bottleneck (a trap)."
    }
  ]
}
```
### Debrief
PLACEHOLDER: debrief shown after the budget puzzle is solved.
