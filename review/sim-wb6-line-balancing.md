# Review: wb6-line-balancing (fragment and module)

Independent reviewer pass on the workbench fragment (scratch file `wb/wb6-line-balancing.md`, to be
merged into `knowledge/sim/workbenches.md`) and on `js/workbenches/wb6-*.js`. Checked against
knowledge/06-cell-and-line.md (cycle-time, line-balancing, oee, read in full, plus conveyor's
buffer lines), 01-robot-bodies.md (speed-specs, read in full), and the ride-1 `apples` stop, its
question, and the puzzle.

What already matched the concept files: every number in the text and the Data JSON. The station
times, picks, the 1.5 s index, and all eight availabilities are line-balancing's code sketch. Slowing
apple picks from 3.2 s to 4.0 s matches the sketch's slow case. The 200 plates/h target and 18 s
takt come from cycle-time, and the 0.3-0.6 s delta benchmark from speed-specs. Recomputed in the
browser: about 80.3% line availability, 165 plates/h at the start, 267 with a second delta (cheese
becomes the bottleneck), and 214 with one slice moved to the cracker SCARA. Costs, the budget, the
grape and faster-delta savings, the buffer capacity, and the stop lengths are labeled illustrative.
Concepts are all registered ids. The options match the ride question (faster delta, grape speed-up,
second robot) and the puzzle's "faster robot" trap.

The author's deviation is that a buffer helps somewhat instead of doing nothing. I agree with it:
line-balancing lists "protect it with buffers" as a way to fix a bottleneck, so a buffer that did
nothing would contradict area 6. With these numbers, buffers alone top out at 199.5 plates/h.

| Location | Problem | Fix |
|---|---|---|
| Module, panel formula and column aria-label | With a buffer on both sides of apples, the panel showed cycle "17.5 s" and limit "17.5 s" (18 × 0.97 = 17.46) but still marked the station "Over limit". That hides the point of the buffer lesson. | `fpair()` in wb6-line-balancing.js shows two decimals when one decimal would make a cycle and its limit look equal. The panel now reads 17.50 s against 17.46 s. |
| Plain | "instead of 200" suggested the line used to make exactly 200 (area 6 says 202). The cause given ("a stop anywhere stops the whole belt") left out why that matters. | "instead of the 200 it needs"; added "and the slowest station has too little spare time to make up for it". |
| Precise | "runs only for the product of the availabilities" was stated as exact. line-balancing says "roughly", and only if failures are independent. | "if stops are independent it runs for roughly the product". |
| Precise | OEE was expanded but never defined. "the same availability is the first factor of OEE" overstated the match. | "That is the availability factor of OEE (overall equipment effectiveness: one score for how much planned time turned into good product)". |
| Precise | "constraint" was used without saying it means the bottleneck. | "find the constraint (the bottleneck)". |
| Precise | "Sharing the apple work does that" did not say which theory-of-constraints step it is. | "A second apple delta ... adds that capacity"; the cracker move "splits the work the same way" (line-balancing: split its work across two stations). |
| Precise | The text called it the "index" but the chart calls it "transfer". | "(... shown as transfer in the chart)"; the buffer paragraph now gives the 17.46 s limit. |
| How to use | "striped for the belt index" did not match the legend ("transfer"). It did not mention the panel's two formula rows, or that buffers split the limit line. | Matched the legend, mentioned the panel, and said that a buffer gives each part of the line its own limit line. |
| What to notice | "The faster grape pick" did not match the option's label ("Fewer vision retries on tangled bunches"). | "Fewer vision retries at the grape station change nothing". |
| Data note | "big enough to ride out every stop" was cited to line-balancing and conveyor, but it is a modeling simplification. The 4.0 s for the moved slice was not called out. | The note now says that buffers decoupling stations is sourced, and that the ideal-buffer treatment and the slice's 4.0 s at crackers are illustrative. |

Checked and left alone:
- Station drawings match the agreed design: a six-axis arm with soft fingers at a grape tote (the bunch hangs from the fingers while carried), and apple and cheese deltas with cups over moving belts. A second delta appears when bought. The cracker SCARA has a cup at its feeder, and the outfeed has a gantry.
- No facts in code. Code strings are chrome or status words, and station names come from ride-1 stop titles.
- With both buffers, the apple part's limit line sits almost on the takt line under the red bar. Only the first part's line is labeled. The panel gives the number, so I did not change it.

Verification: real content plus the fragment, built into a scratch content.js and swapped in with
`page.route`. Tested at 390x844 with touch and at 1440x900 with a mouse.
- Start state: not solved, at 165 plates/h, with apples over its 14.45 s limit.
- Naive tries: the grape option gives no change, and the faster delta gives 171. One buffer before apples gives 181, and both buffers give 199.5. The second delta is disabled once 4 pts are spent.
- Stop button: stopping cheese with no buffer holds every station. The button reads "Station stopped", then comes back.
- Clicking or tapping each of the eight stations in the picture selects the right station.
- `solve()` returns true at 214/h for 3 pts, and the modal gets `data-solved`.
- Dark mode, 360x640, and reduced motion (the stop button is hidden, and it still solves) were also checked.
- No horizontal overflow and no console errors.
- `node tests/smoke.mjs --fixture --only=ride1` passes.
