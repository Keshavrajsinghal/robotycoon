# Architecture

RoboTycoon is a static site: `index.html`, CSS, and native ES modules. No framework, no
bundler, no runtime dependencies. Serve the folder with any static server
(`node tools/serve.mjs` or `python3 -m http.server`).

## Content rule

Every fact, explanation, number, question, and puzzle shown on screen comes from
`js/content.js`, which `tools/build-content.mjs` generates from `/knowledge`. App code holds
only UI chrome (button labels such as "Play", control names such as "Gain") and drawing
code. Workbench model parameters that stand for real-world values come from the
workbench's `data` JSON in `knowledge/sim/workbenches.md`. Content HTML is pre-rendered by
the generator and inserted with `innerHTML` (it is trusted, generated at build time).

Development against placeholder content: `tests/fixtures/knowledge/` holds fake knowledge
files (clearly marked as placeholders). Build them with
`node tools/build-content.mjs --knowledge=tests/fixtures/knowledge --out=tests/fixtures/content.js`
and open the site with `?content=fixture` to load that file instead of `js/content.js`.

## Generated content shape (`CONTENT`)

```
areas[]          { area, slug, title, intro(html), concepts[ids] }
concepts{id}     { id, area, title, requires[], aka[], plain, analogyLimit, precise, cheese,
                   elsewhere, why, connects[{id, html}], products, misconception{myth, reality},
                   keyNumbers, specs{html, rows{payload|reach|repeatability|speed|example models:
                   {range, source}}}, code{lang, text, html}, sources[{n, title, url, note}],
                   unverified(count), industry?{sells, buysFrom, sellsTo, roles[{name, html}], companies} }
conceptOrder[]   ids in reading order
glossary[]       { term, html, refs[] }
rides[]          { id, title, order, teaches[], intro{plain, precise},
                   stops[{ id, title, cargo, cargoDetail, concepts[], workbench, delay{min,max,mid,text}|null,
                           mode: both|classical|learned, replaces[], plain, precise,
                           question{prompt, options[{text, correct, why}]} }],
                   puzzle{ title, type: choice|match|order|budget, prompt, data, debrief } }
workbenches[]    { id, title, ride, stop, order, concepts[], goal, plain, precise, howTo, notice, data }
town             { districts[{id, title, concept, tagline, plain, sells, buysFrom, sellsTo}],
                   buildings[{id, title, district, about, roles[{name, html}]}] }
showroom[]       { id, title, concept, payloadKg{min,max,mid,text}, reachMm, heightMm, speed(html),
                   notes, sources[] }
```

Fields named plain, precise, intro, etc. are HTML strings. `cargo` and `title` are plain text.

## Ride plan (stop ids are fixed; content and drawing code both key on them)

Ride 1, The tray (`ride1`, teaches area 6). One tray through the whole line.
`denester`, `infeed`, `grapes`, `apples`, `crackers`, `cheese`, `inspection`, `lidding`, `outfeed`.
Workbench booth: `wb6-line-balancing` at `apples`.

Ride 2, The signal (`ride2`, teaches areas 1-5 and 7). One apple-slice pick at the apple
station, from a photo-eye trigger to the gripper releasing. Classical mode stops:
`trigger`, `light`, `sensor`, `detection`*, `position-3d`*, `grasp`*, `trajectory`*,
`joint-targets`*, `drive`, `joint`, `arm-motion`, `gripper`. Learned mode replaces the starred
stops with one stop, `policy` (mode learned, replaces those five). `joint` shows a cutaway of
one joint. Booths: `wb4-calibration` at `position-3d`, `wb2-ik` at `joint-targets`,
`wb3-control` at `drive`, `wb1-dof` at `arm-motion`.

Ride 3, The rescue (`ride3`, teaches area 9). A grape-bunch pick fails and a remote operator
takes over. Every stop has `delay_ms`; the site shows the running total.
`pick-fails`, `help-request`, `capture`, `encode`, `send`, `network-out`, `decode-display`,
`operator`, `network-back`, `robot-executes`. Booth: `wb5-teleop` at `operator`.

Ride 4, The lesson (`ride4`, teaches areas 8 and 10). The recording of that takeover becomes
training data, then a new model, then ships back to the fleet.
`recording`, `upload`, `curation`, `dataset`, `training`, `simulation`, `real-eval`,
`rollout`, `fleet`, `next-pick`.

Town map (`#/town`, teaches areas 11 and 12): districts `parts` (component makers),
`robot-row` (robot makers), `integrators`, `applications`, `model-lab` (model companies),
`tool-works` (tooling companies), `factory-district` (end users). The showroom
(`#/showroom`) draws `content.showroom` robots side by side at the same scale.

## Files

```
index.html                 shell: canvas, overlay layer for labels, HUD, panel, modal root
css/app.css                layout, responsive rules, light and dark UI tokens
js/main.js                 boot: load content, create park, UI, router, test API
js/core/state.js           persisted preferences and progress (localStorage, always try/catch)
js/core/events.js          tiny event bus
js/core/router.js          hash routes
js/engine/iso.js           projection, camera, IsoRenderer drawing primitives
js/engine/scene.js         depth-sorted static scene, dynamic layer, hit targets, labels
js/engine/park.js          terrain, zones, scenery, ride gates
js/engine/track.js         track geometry (polyline with arc length), rail drawing
js/engine/ride-runner.js   ride state machine: play, pause, step, speed, goToStop, restart
js/rides/ride1.js ...      one module per ride: track, scenery, cargo drawing, close-ups
js/ui/*.js                 HUD, controls, route list, stop panel, questions, puzzles, modals,
                           concept view, glossary
js/workbenches/host.js     workbench modal; modules live in js/workbenches/<id>.js
js/town/town.js            town map and showroom views
tools/build-content.mjs    content generator and validator
tools/serve.mjs            zero-dependency static server for local use and tests
tests/smoke.mjs            headless checks (Playwright + installed Chrome), phone and desktop
```

## Module contracts

These are the signatures the core implements (engine agent, 2026-11-15). Rides 2-4, the
town polish, and workbenches build against them. Coordinates are world meters: x grows toward
the lower right of the screen, y toward the lower left, z up. One terrain tile is 1 m.

### Extra files beyond the list above

```
js/core/dom.js             h(tag, attrs, ...children), $, $$, textOf(html), focusables, trapFocus,
                           isMissingModule(err) (an import() 404, as opposed to a bug in the module)
js/engine/robots.js        drawScara, drawSixAxis, drawDelta, drawGantry, ik2, shuttle, dip
js/engine/food.js          drawPlate(tray + contents), drawTrayStack, PLATE_AFTER (ride-1 stop -> items)
js/engine/cart.js          drawCart(r, pos, color) -> cargo anchor [x,y,z]
js/ui/icons.js             icon(name, label?) inline SVG strings
js/ui/modal.js             openModal, topModal, modalOpen, closeModals(kind)
js/ui/question.js          questionCard(app, ride, stop, opts)
js/ui/concept.js           openConcept, deepSections, readMoreConcept, conceptLink
js/ui/glossary.js          openGlossary
js/ui/puzzle.js            openPuzzle(app, rideId)  (choice, match, order, budget)
js/ui/panel.js, hud.js, controls.js, route.js
tests/fixtures/knowledge/  placeholder knowledge (build with --knowledge/--out, see above)
```

Ride and workbench modules are discovered by trying `import()` on their file. A missing file
is expected while it is being built: the ride shows an "Opening soon" gate, the workbench shows
"This workbench is being built". The browser logs a 404 for each missing file; the smoke test
allows a 404 only for module files that do not exist on disk. No manifest to edit. A module that
exists but throws (on import or in `mount`) is logged with `console.error`; a workbench that
throws in `mount` shows "This workbench could not start" (`[data-wb-error]`).

### Projection and IsoRenderer (`js/engine/iso.js`)

```
ISO = { X: 32, Y: 16, Z: 36 }        // px at zoom 1: px = (x-y)*X, py = (x+y)*Y - z*Z
project(x, y, z) -> [px, py]         unproject(px, py, z) -> [x, y]
depthOf(x, y, z) -> number           // painter's depth, larger = closer to the viewer
shade(color, f), mix(a, b, t), parseColor(c), lightFactor(normal), circlePoints(cx, cy, r, seg)

class IsoRenderer(ctx2d)
  zoom, setTransform(zoom, ox, oy), toScreen(x, y, z) -> [sx, sy]
  box(x, y, z, w, d, h, color, {top, side, edge, alpha})      axis-aligned, from (x,y,z) by (w,d,h)
  prism(pts2d, z, h, color, opts)                             extruded polygon, pts [[x,y],...]
  cylinder(cx, cy, z, r, h, color, seg=10, opts)              vertical low-poly cylinder
  tube(p1, p2, r, color, seg=8, opts)                         cylinder along any axis
  cone(cx, cy, z, r, h, color, seg=9, opts)
  sphere(cx, cy, cz, r, color, detail=1, {sz})                rough sphere / ellipsoid
  beam(p1, p2, w, h, color, opts)                             oriented box from p1 to p2 (arm links)
  orientedBox(cx, cy, z, len, wid, h, angleRad, color, opts)  box rotated about z
  quad([p...], color, {flat, alpha, edge})                    planar polygon in 3D, two-sided
  mesh(faces, color, {center, twoSided, colors, alpha, edge, flat})
  ground(x, y, w, d, color, z=0), groundPoly(pts2d, color, z) flat, unshaded
  line(a, b, color, widthPx), polyline(points, color, widthPx, closed)   width scales with zoom
  shadow(x, y, rx, ry, alpha, z)
  billboard(x, y, z, fn(ctx2d, zoom))                         2D drawing at a projected point
```

Faces are flat shaded from a fixed sun (top faces keep the base color) and back faces are
culled. Inside one draw call, draw parts back to front yourself (the scene sorts items, not
the primitives inside an item).

### Scene (`js/engine/scene.js`)

```
LAYER = { TERRAIN: 0, GROUND: 1, OBJECT: 2 }   // static draw bands: grass, flat decals, objects
new Scene({ canvas, overlay, background, limits, minZoom, maxZoom })
scene.add({ bounds:[x0,y0,z0,x1,y1,z1], draw(r), depth?, layer?, live?, group? })
    static item, depth-sorted (default depth = footprint center x+y) and cached to an offscreen
    canvas (viewport + 20% margin; re-rendered on zoom, resize, or panning past the margin).
    live:true draws it every frame instead, sorted together with dynamic items: use it for
    occluders in front of moving parts (front guarding, tunnels). Split long objects (walls,
    conveyors) into ~2 m pieces so x+y sorting stays right.
scene.addDynamic({ depth: n | () => n, draw(r, t), bounds?: [..] | () => [..], animated?: () => bool, group? })
    drawn every frame. animated() keeps the rAF loop running while the item is on screen and
    motion is allowed; read ctx.reducedMotion() inside draw to freeze poses.
scene.addHit({ id, kind, bounds, onActivate(), priority?, group? })   taps and clicks
scene.addLabel({ id, pos: [x,y,z] | () => [x,y,z] | null, text | html, kind, className?,
                 onClick?, ariaLabel?, group? }) -> element    HTML label (button when onClick)
    kinds styled in css: gate, station, booth, sign, cart, district, building. The Labels toggle
    hides station/booth/sign/building; zoom < 0.55 hides station/booth. Building labels show at
    zoom >= 0.9, or at any zoom inside the open district (whose own label then hides).
scene.removeLabel(id), scene.clear(group?), scene.invalidate(), scene.requestFrame()
scene.addTick(fn(dt, t) -> busy) -> remove     per-frame update hook
scene.camera {x, y, zoom}, lookAt(x, y, z, {zoom, instant, duration}), fitWorldRect([x0,y0,x1,y1], opts)
scene.worldToScreen(x, y, z), screenToProj(sx, sy), setInsets({top, right, bottom, left})
scene.follow = () => [x,y,z] | null            follow camera target (smoothed, snaps under reduced motion)
scene.time, scene.isIdle(), scene.reducedMotion (fn), scene.onTap, scene.onUserPan(kind)
```

The whole park is rebuilt (`scene.clear()` then every builder) at start and when ride 2's
mode changes. Tag everything a ride adds with `group: ctx.group`.

### Park and zones (`js/engine/park.js`)

```
ZONES (rect = [x0, y0, x1, y1] in tiles; gate on the plaza edge; entry = end of the path from
the gate into the zone, where a boarding station belongs):
  plaza    rect [40,40,60,60]  fountain at [50,50]
  factory  rect [2,28,38,72]   gate [40,50]  entry [36,50]  hall [10,28,36,72]  door x=36, y 48-52
                               (park draws the hall walls and floor; ride1 draws the line inside)
  signal   rect [38,2,74,36]   gate [50,40]  entry [50,34]  facing -y   (ride 2, empty)
  rescue   rect [62,36,98,58]  gate [60,47]  entry [65,47]  facing +x   lake at [74,38,97,56]
                               (park draws the lake; ride 3 adds causeway and island)
  lesson   rect [24,74,58,98]  gate [48,60]  entry [48,76]  facing +y   (ride 4, empty)
  town     rect [62,62,98,98]  diagonal road from the plaza corner, arch [88,88], signpost [57.6,57.6]
RIDE_ZONE = { ride1: factory, ride2: signal, ride3: rescue, ride4: lesson }
PAL (daylight palette; PAL.ride[rideId] is each ride's color), rng(seed)
object(scene, x0, y0, x1, y1, h, draw, {group, depth, live})   one depth-sorted static object
groundRect(scene, x0, y0, x1, y1, color, opts), groundPoly(scene, pts, color, opts)
drawTree, drawBench, drawLamp, drawFlowers, drawCone, drawBooth(r, x, y, color)
```

Zones 2-4 are grass with a low hedge, plus cones and a crane while the ride is unavailable.
Everything inside a zone rect belongs to that ride; nothing in the park is drawn there.

### Ride module (`js/rides/<rideId>.js`, default export)

```
{
  id: 'ride1',
  zone: 'factory',                         // a key of ZONES
  trackFor(mode) -> { points: [[x,y,z?], ...], stops: { stopId: pointIndex } }
      // a smooth path is drawn through every point (centripetal Catmull-Rom); every stop the
      // mode shows needs an entry; points after the last stop are the run-out to the finish.
      // mode is 'classical' | 'learned' (only rides with both kinds of stops get 'learned').
  buildScenery(scene, ctx)                 // static and dynamic items, hits, labels, booths
  drawCargo(r, stopId, pos, t, ctx)        // pos = {x, y, z, heading, slope, anchor:[x,y,z]};
                                           // anchor is the cart deck center; stopId is the last stop reached
  drawDynamic(r, t, ctx)                   // optional; drawn on top of everything each frame and
                                           // animated while the zone is on screen (prefer
                                           // scene.addDynamic items with depth for correct overlap)
  closeup(stopId, el, ctx) -> cleanup      // optional; illustration at the top of the stop panel
  focus(pos, ctx) -> [x, y, z]             // optional; where the camera aims when boarding and
                                           // while following the cart at pos (default: the cart).
                                           // Ride 1 aims 2 m toward the conveyor so the station
                                           // that just changed the cargo is in view.
}
```

The module is only loaded if `content.rides` has the ride, and it is marked unavailable (with
a console error) if `trackFor` misses a stop. Ride 1 (`js/rides/ride1.js`) is the reference.

### Ride context (`ctx` passed to ride modules)

```
rideId, ride (content entry), content, zone (ZONES entry), group (= rideId), pal (PAL)
mode                       current mode (getter); stops: stops visible in that mode (getter)
reducedMotion()            live; freeze animation when true
isActive()                 this ride is the one being ridden
currentStopId()            last stop reached (null when not active)
stopReached(stopId)        true once the cart has reached that stop on this ride
stopTitle(stopId)          title from content
stopTarget(stopId, bounds, labelPos)  hit target + station label for a stop; a stop hidden in
                           the current mode gets a greyed "bypassed" label and no hit target
booth(stopId, x, y, {workbench?})     standard workbench kiosk + hit + label (opens #/workbench/<id>)
label(opts)                station-kind label (scene.addLabel options)
goToStop(stopId), openWorkbench(id)
```

### Ride runner (`js/engine/ride-runner.js`)

`RideRunner` events: `load`, `stop (index, stop)`, `finish`, `move (target)`, `state`,
`mode (mode)`, `restart`. Methods: `load(ride, module, mode, startStopId?)` (boards at that stop,
so a deep link does not also mark stop 1 seen), `play, pause, toggle, stepForward, stepBack,
restart, setSpeed(0.5|1|2|4), cycleSpeed, goToStop(i, {jump}), goToStopId(id, {jump}),
setMode(mode), finishMove, pos() -> {x,y,z,heading,slope}, state()`. Play dwells 7 s (at 1x) at
each stop and holds while the rider is reading: mouse over the panel, the phone sheet expanded,
or any dialog open (main.js passes this as `holdDwell`). Index `stops.length` means the finish.
Under reduced motion every move is a jump. Helpers: `stopsForMode(stops, mode)`,
`rideHasModes(ride)`, `SPEEDS`.

### Workbench module (`js/workbenches/<id>.js`, default export)

```
{ id, mount(el, ctx) -> { destroy() } }
ctx: {
  wb,                  // content entry: id, title, ride, stop, concepts, goal, plain, precise,
                       // howTo, notice, data (the JSON from knowledge/sim/workbenches.md)
  content, state,      // full CONTENT and the persisted state module
  reducedMotion,       // boolean getter, live
  level(),             // 'plain' | 'precise'
  onSolved(),          // records state.workbenches[id].solved and marks the modal
  onMotionChange,      // set to a function to hear reduced-motion changes
}
```

The host shows title, goal, the Plain/Precise text, how to use, and what to notice, and gives
the module a mount element of at least 320 px height (full width on phones, about 750 px on
desktop). Model numbers must come from `ctx.wb.data`. Open with `#/workbench/<id>`.

### Shared state (`js/core/state.js`)

`state.get/set(key)` for `level, follow, labels, reduceMotion (null = follow the system),
speed, modes`; `markSeen/isSeen(rideId, stopId)`, `answer/setAnswer(rideId, stopId, {choice,
correct})`, `puzzle/setPuzzle(rideId, {solved, attempts})`, `workbench/setWorkbench(id,
{solved})`. `reducedMotion()` gives the effective setting, `systemReducedMotion()` the system's.
The in-app toggle stores `null` when the new value equals the system setting, so toggling back
returns to following the system. Bus (`js/core/events.js`) events: `prefs (key, value)`,
`motion (on)`, `progress`.

### Test API (`window.__rt`, used by tests/smoke.mjs; not a public interface)

```
ready, app, content
rides() -> [{id, title, available, reason, stops:[ids], modes, puzzle}]
state() -> {rideId, mode, index, stopId, total, finished, playing, moving, target, speed, s, length}
select(rideId, stopId?)   play()  pause()  stepForward()  stepBack()  restart()
goToStop(i, jump?)  finishMove()  setMode(mode)  setSpeed(x)
cartScreen() -> [sx, sy]   cartWorld()   camera() -> {x, y, zoom, insets}
idle() -> bool (rAF loop stopped)   reducedMotion()   openPuzzle(rideId)   topModal()
view() -> 'park' | 'town' | 'showroom'   hits()   townScene()
```

DOM hooks the smoke test relies on: `#ride-menu-btn`, `.menu-item[data-ride]`,
`#controls [data-act=restart|back|play|forward]`, `#controls .speed`, `#route-btn`,
`#route-drawer [data-stop]`, `#panel-title`, `.panel-body [data-question=<stopId>]` with
`.q-option[data-correct]`, `.level-switch [data-level]`, `.mode-switch [data-mode]`,
`[data-workbench]`, `[data-open-puzzle]`, `.puzzle-modal [data-action=check]`,
`.workbench-modal [data-loaded] | [data-wb-missing]`, `.label-cart .cargo`,
`.delay-box[data-delay-total]`, `#town-btn`, `#glossary-btn`, `#more-btn` (phone).

## Interaction model

- Choose a ride at its gate or from the ride menu. The cart follows the track; at each stop
  the panel shows the stop's plain text first, with a Plain/Precise toggle that persists.
  "Read more" shows the linked concepts: both examples, why it exists, connections, products,
  misconception, key numbers, code sketch, and sources.
- Arriving at a stop shows the question for the previous stop. Finishing a ride offers its
  puzzle. Every answer shows why it is right or wrong.
- Controls: restart, step back, play/pause, step forward, speed. Route list: click any stop to
  ride there. Toggles: follow camera, labels. A stops-seen counter (unique stops visited across
  all rides) persists.
- Phone and desktop, touch and mouse: drag to pan, pinch or wheel to zoom, tap to select. Below
  760 px the panel is a bottom sheet; below 1100 px the top bar folds its view options (labels,
  Plain/Precise, reduce motion, town, glossary) into a "More" menu.
- Keyboard: `index.html` source order is the Tab order (top bar, ride controls, route, panel,
  then the map's labeled buttons). Space plays or pauses, arrow keys step, Escape closes the top
  dialog, then a menu (focus returns to its button), then the route list, then the phone sheet.
- `prefers-reduced-motion: reduce` (or the in-app toggle) makes the cart jump stop to stop,
  snaps the camera, and stops idle animation.
- Routes: `#/ride/<rideId>[/<stopId>]`, `#/workbench/<id>`, `#/town`, `#/town/<districtId>`,
  `#/showroom`, `#/concept/<id>`, `#/glossary`.
- `window.__rt` exposes a small test API used by `tests/smoke.mjs`.
