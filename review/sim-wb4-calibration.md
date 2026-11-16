# Review: workbench wb4-calibration

Independent review of the wb4-calibration fragment (written to the scratch fragment, merged later into
`knowledge/sim/workbenches.md`) and of `js/workbenches/wb4-calibration.js`, `wb4-calibration-model.js`, and
`css/modules/wb4-calibration.css`. The fragment was checked against hand-eye-calibration, camera-calibration,
frames, depth-camera, and soft-gripper, and against ride 2's stop `position-3d`. It was tested in the browser
on real content plus the fragment, at phone 390x844 with touch, at 360x640, at desktop 1440x900 with a mouse,
and in dark mode.

Checked and correct as written:
- 600 mm, 570 x 460 mm, and 0.24 mm between points match depth-camera's grape camera. `image_px`
  [2375, 1917] is that view divided by 0.24.
- The lever-arm figures (0.1° about 1 mm, 0.5° about 5 mm at 600 mm), the 10-20 pose pairs, AX = XB, eye-to-hand,
  and "a moved mount needs hand-eye, not intrinsic, recalibration" all match their concept files.
- The note labels every value that has no source as illustrative: the 8 mm tolerance, the camera noise, the
  robot's pose error, the tote position, the 180° mount, k1, the bunch size and its noise, the knock, and the
  slider ranges.
- Lesson numbers, measured in the UI:
  - Before recalibrating, 60 of 60 picks miss, by 10.5-21.1 mm. The model puts every miss within 15° of one
    direction.
  - Undoing the knock with the sliders gives hits, but the bench does not count that as solved.
  - After recalibrating, 40 of 40 picks hit.
  - The note reads 1.1 mm at tilt 0.1°, 5.3 mm at 0.5°, and 10.5 mm at 1°. At 1° only 4 of 40 picks hit.
  - With lens correction off, the fit residual is 3.1 mm RMS, against 0.3-0.6 mm with it on.
  - Recalibrating moves the image center by 15 mm.
- `solve()` returns true at phone and desktop, the modal gets `data-solved`, and the solved state is saved.
  The bench starts unsolved.
- There is no horizontal overflow and no console errors.
- The module matches the agreed design: a six-axis arm with three soft fingers over a tote of bunches at
  random angles. Code holds no facts; every model number comes from `ctx.wb.data`.
- `node tests/smoke.mjs --fixture --only=ride2` was rerun: all checks passed.

| Location | Problem | Fix |
|---|---|---|
| What to notice, bullet 3 | Wrong claim: "at Turn 1 deg ... a bunch near the middle can still be hit while one near the wall is missed". At 1° the corner error is 5.5 mm, under the 8 mm allowance, and bunch centers stay within about 205 mm of the image center. Measured: 60 of 60 hits, the farthest bunch off by at most 6.7 mm. | Kept the 1° numbers and said they are still inside the allowance. Added that at Turn 3 deg the corners are about 16 mm off: near the middle, 13 of 13 picks hit; near the wall, 12 of 19 miss. |
| What to notice, bullet 2 | "now and then a pick misses" at 0.5°. Measured: 0 of 40 misses on tilt x and 4 of 40 on tilt y. A learner could try several picks and never see a miss. | Now: "so little margin is left and an occasional pick misses". |
| What to notice, bullet 1 | "misses by roughly the same amount": the misses actually range from 10.5 to 21.1 mm. | Now: "by roughly 10-20 mm and always in about the same direction". |
| Plain, sentence 3 | "the fingers close beside every bunch" overstates it. A 13-19 mm miss on a 90 mm wide bunch is off center, not beside it. | Now: "close off center on every bunch". |
| Precise, paragraph 1 | AX = XB was given without saying what A, X, and B are. | Added plain definitions: A is the robot's motion between two poses, B is the board's motion as the camera saw it, and X is the unknown fixed shift plus rotation that ties them together (hand-eye-calibration). |
| Precise, paragraph 3 | "Zivid expects sub-millimeter on smaller robots" dropped the other end of the source's range. "which is why cells add a touch test" claimed more than the source, which is Zivid's recommendation. | Now: sub-millimeter translation residuals on smaller robots and millimeter-level on larger ones; "Zivid recommends a touch test". |
| Precise, paragraph 3 | "radians" was not defined. | Added "(1 degree is about 0.017 radians)", from frames' tan 1°. |
| Precise, paragraph 2; What to notice, bullet 3 | "no flat map can undo" lens bending is too broad: some flat maps can bend. The claim holds only for the similarity this bench fits. | Now: "a map that only turns, scales, and shifts". |
| How to use, bullet 1 | "press its number under Pick": the number buttons sit beside the Pick label at every width. | Now: "in the Pick row". |
| Precise, paragraph 1 | "On the real cell" presents the course's example cell as a real one. | Now: "On a real cell". |
| Data note | Named the camera as "a Zivid 2+ MR60", but depth-camera says "a structured light camera like the Zivid 2+ MR60". | Reworded to match the concept. |

Not changed, noted:
- Dragging the sliders to undo the washdown knock gives hits without the Solved banner, because solving needs a
  recalibration. This matches the Goal. The UI does not explain it, which might puzzle a learner who finds
  that trick.
- The board is drawn tilted at each pose, but the fit uses only the board centers. Precise says so.
- Precise is long: three dense paragraphs. It is within FORMAT.md's 1-4 paragraphs and reads acceptably
  beside the bench at both widths.
- Module: no bugs found that needed a code change.
