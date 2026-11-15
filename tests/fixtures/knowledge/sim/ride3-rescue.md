---
ride: ride3
title: PLACEHOLDER The rescue
order: 3
teaches: 9
---

# Ride 3: PLACEHOLDER The rescue

## Intro
### Plain
PLACEHOLDER: intro for PLACEHOLDER The rescue. The cart follows one thing through the whole ride.
### Precise
PLACEHOLDER: precise intro for PLACEHOLDER The rescue, with real terms defined in plain words.

## Stop: pick-fails
title: PH Pick fails
cargo: PH Dropped bunch
concepts: teleop-modes
delay_ms: 0

### Plain
PLACEHOLDER: at ph pick fails, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for pick-fails uses real terms (defined in plain words) and links [[teleop-modes]].
### Question
PLACEHOLDER: which statement about pick-fails is true?
- [ ] PLACEHOLDER wrong option A for pick-fails :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for pick-fails :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for pick-fails :: PLACEHOLDER: why C is wrong.

## Stop: help-request
title: PH Help request
cargo: PH Help ticket
concepts: teleop-modes
delay_ms: 20-50

### Plain
PLACEHOLDER: at ph help request, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for help-request uses real terms (defined in plain words) and links [[teleop-modes]].
### Question
PLACEHOLDER: which statement about help-request is true?
- [ ] PLACEHOLDER wrong option A for help-request :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for help-request :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for help-request :: PLACEHOLDER: why C is wrong.

## Stop: capture
title: PH Capture
cargo: PH Video frame
concepts: webrtc
delay_ms: 16-33

### Plain
PLACEHOLDER: at ph capture, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for capture uses real terms (defined in plain words) and links [[webrtc]].
### Question
PLACEHOLDER: which statement about capture is true?
- [ ] PLACEHOLDER wrong option A for capture :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for capture :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for capture :: PLACEHOLDER: why C is wrong.

## Stop: encode
title: PH Encode
cargo: PH Compressed frame
concepts: webrtc
delay_ms: 5-15

### Plain
PLACEHOLDER: at ph encode, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for encode uses real terms (defined in plain words) and links [[webrtc]].
### Question
PLACEHOLDER: which statement about encode is true?
- [ ] PLACEHOLDER wrong option A for encode :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for encode :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for encode :: PLACEHOLDER: why C is wrong.

## Stop: send
title: PH Send
cargo: PH Packets
concepts: webrtc
delay_ms: 1-5

### Plain
PLACEHOLDER: at ph send, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for send uses real terms (defined in plain words) and links [[webrtc]].
### Question
PLACEHOLDER: which statement about send is true?
- [ ] PLACEHOLDER wrong option A for send :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for send :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for send :: PLACEHOLDER: why C is wrong.

## Stop: network-out
title: PH Network out
cargo: PH Packets in flight
concepts: latency-budget
delay_ms: 20-80

### Plain
PLACEHOLDER: at ph network out, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for network-out uses real terms (defined in plain words) and links [[latency-budget]].
### Question
PLACEHOLDER: which statement about network-out is true?
- [ ] PLACEHOLDER wrong option A for network-out :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for network-out :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for network-out :: PLACEHOLDER: why C is wrong.

## Stop: decode-display
title: PH Decode and display
cargo: PH Picture on screen
concepts: teleop-modes
delay_ms: 10-30

### Plain
PLACEHOLDER: at ph decode and display, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for decode-display uses real terms (defined in plain words) and links [[teleop-modes]].
### Question
PLACEHOLDER: which statement about decode-display is true?
- [ ] PLACEHOLDER wrong option A for decode-display :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for decode-display :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for decode-display :: PLACEHOLDER: why C is wrong.

## Stop: operator
title: PH Operator
cargo: PH Click on the bunch
concepts: teleop-modes, latency-budget
workbench: wb5-teleop
delay_ms: 300-800

### Plain
PLACEHOLDER: at ph operator, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for operator uses real terms (defined in plain words) and links [[teleop-modes]].
### Question
PLACEHOLDER: which statement about operator is true?
- [ ] PLACEHOLDER wrong option A for operator :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for operator :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for operator :: PLACEHOLDER: why C is wrong.

## Stop: network-back
title: PH Network back
cargo: PH Command packets
concepts: webrtc
delay_ms: 20-80

### Plain
PLACEHOLDER: at ph network back, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for network-back uses real terms (defined in plain words) and links [[webrtc]].
### Question
PLACEHOLDER: which statement about network-back is true?
- [ ] PLACEHOLDER wrong option A for network-back :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for network-back :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for network-back :: PLACEHOLDER: why C is wrong.

## Stop: robot-executes
title: PH Robot executes
cargo: PH Bunch on the tray
concepts: latency-budget
delay_ms: 200-400

### Plain
PLACEHOLDER: at ph robot executes, the cargo changes in a fake way. This is placeholder text for layout testing.
### Precise
PLACEHOLDER: the precise version for robot-executes uses real terms (defined in plain words) and links [[latency-budget]].
### Question
PLACEHOLDER: which statement about robot-executes is true?
- [ ] PLACEHOLDER wrong option A for robot-executes :: PLACEHOLDER: why A is wrong.
- [x] PLACEHOLDER right option for robot-executes :: PLACEHOLDER: why this one is right.
- [ ] PLACEHOLDER wrong option C for robot-executes :: PLACEHOLDER: why C is wrong.

## Puzzle
title: PH Put the delays in order
type: order

### Prompt
PLACEHOLDER: put the steps of the rescue in the order they happen.
### Data
```json
{
  "items": [
    {
      "id": "capture",
      "label": "PH Capture",
      "why": "PH: the camera grabs a frame first."
    },
    {
      "id": "encode",
      "label": "PH Encode",
      "why": "PH: then the frame is compressed."
    },
    {
      "id": "send",
      "label": "PH Send",
      "why": "PH: then the packets leave the robot."
    },
    {
      "id": "decode",
      "label": "PH Decode and display",
      "why": "PH: then the operator's screen shows it."
    },
    {
      "id": "operator",
      "label": "PH Operator acts",
      "why": "PH: only then can the operator click."
    }
  ]
}
```
### Debrief
PLACEHOLDER: debrief shown after the order puzzle is solved.
