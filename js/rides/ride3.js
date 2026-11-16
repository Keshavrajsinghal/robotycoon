// Ride 3, The rescue: a grape-bunch pick fails at the grape station on the near shore and a
// remote operator on the island takes over. The station is the washdown six-axis arm with soft
// fingers that picks bunches lying in a tote (as in rides 1 and 2). The cart follows the request
// for help: from the robot cell, through the wrist camera, encoder, and the plant's LTE mast,
// across the lake (the network) to the operations center, and back to the robot, which finishes
// the pick. Drawing code only: every word and number on screen (stop titles, cargo tags, delays)
// comes from content.

import { loadCss } from "../core/dom.js";
import { drawPlate } from "../engine/food.js";
import { ISO, shade } from "../engine/iso.js";
import { drawBench, drawFlowers, drawLamp, drawTree, groundPoly, object, PAL } from "../engine/park.js";
import { dip, drawSixAxis, drawSoftFingers, shuttle } from "../engine/robots.js";
import { LAYER } from "../engine/scene.js";
import { Track } from "../engine/track.js";
import { closeup } from "./ride3-closeup.js";
import {
	BUNCH_LEN,
	delayModel,
	drawPicture,
	drawTicket,
	enableButton,
	fmtMs,
	framedPicture,
	hangingBunch,
	knotPoint,
	lyingBunches,
	packetBox,
	packetSlot,
	R3,
	roundRect,
	spaceMouse,
	stand,
	tangledBunches,
	TOTE_BLUE,
	upArrow,
	wristCamera,
} from "./ride3-parts.js";

const CSS = "css/modules/ride3.css";

// ---------------------------------------------------------------------------
// Layout (world meters). Near shore = the robot side; the lake = the network; the island = the
// remote operations center. See ARCHITECTURE.md: zone rescue [62,36,98,58], lake [74,38,97,56].

const W = 68.6; // west leg of the track, beside the boarding platform
const HEADING_Y = Math.PI / 2;

// The grape cell stands inside the loop, between the west leg and the lake: going north the cart
// sees it to the right of its cargo tag, and from the bend it lies in front of the cart.
const CELL = { x0: 69.6, y0: 40.9, x1: 73.8, y1: 47.6 };
const BELT = [69.95, 71.05]; // conveyor frame (x); the belt runs along +y
const BELT_X = 70.5;
const BELT_Y = [41.1, 47.4];
const BELT_Z = 0.85;
const ARM = { base: [71.65, 44.45], z: 0.32, scale: 1.45 };
const TOTE = { x0: 71.85, y0: 45.3, x1: 73.05, y1: 46.4, z: 0.42, wall: 0.17 };
const PICK = [72.45, 45.85]; // where the fingers reach into the tote
const PLACE = [BELT_X, 45.15]; // tray on the belt beside the arm (left of it on screen, not behind)
const CAB = { x0: 71.17, y0: 42.4, x1: 71.83, y1: 43.0, h: 1.4 };
const BEACON = [71.5, 42.7]; // stack light on the cell's control cabinet
const BUNCH_S = 1.25; // bunch scale at this station
const PLATE_S = 1.25; // tray scale on the belt
const TRAY_PITCH = 1.12;
const TOTE_SPOTS = [
	[72.17, 45.58, 0.5],
	[72.75, 45.62, 2.3],
	[72.21, 46.12, -0.8],
	[72.77, 46.15, 1.4],
];
// Where the arm stopped: lifted over the tote, the bunch half out of the fingers and knotted to a
// second one that still hangs down toward the tote.
const FAULT = [72.3, 45.6, 1.5];
// The encoder stands just past the encode stop (east of the cart), so on screen it sits beside the
// cart instead of behind it under the cargo tag; the LTE mast follows it toward the lake.
const ENCODER = { x0: 74.4, y0: 36.7, x1: 75.8, y1: 37.5, h: 1.3 };
const UPLINK = [77.0, 37.15]; // the plant's LTE mast (cellular uplink)
const ISLAND_HUB = [87.0, 42.75]; // network box on the operations center roof
const TX_ISLAND = [88.3, 50.0]; // the island's network cabinet for the return path
const RX_SHORE = [72.4, 51.2]; // the plant's LTE mast for the return path
const TX_Z = { uplink: 4.9, shore: 3.58, island: 1.32, hub: 3.2 }; // heights of their lights
const OPS = { x0: 86.2, y0: 42.0, xm: 88.9, x1: 91.9, y1: 45.6, h: 2.6 };
const DESK = { x0: 89.4, y0: 43.0, x1: 91.6, y1: 43.8, h: 0.74 };
const BOARD = { x: 80.6, y: 47.4, half: 1.9, z0: 1.55, z1: 3.55 };
const MOUSE = [90.98, 43.6]; // SpaceMouse on the operator's desk

const LAKE = [
	[77, 38],
	[97, 38],
	[97, 56],
	[76, 56],
	[74, 52],
	[74, 42],
];
const ISLAND = [
	[83.7, 45.8],
	[85.0, 42.2],
	[87.4, 40.9],
	[92.2, 40.8],
	[95.0, 42.0],
	[96.2, 45.2],
	[96.2, 50.8],
	[94.6, 53.9],
	[89.4, 54.8],
	[85.0, 54.5],
	[83.4, 51.4],
];

/**
 * Station label anchors for the stops at the grape cell (see buildScenery). Capture sits right of
 * the arm's wrist, clear of the cart's alert ticket at the help request; pick-fails sits right of
 * the tote at its rim height, so it stays above the bottom sheet on a 360 x 640 phone.
 */
const LABEL = {
	"pick-fails": [74.0, 45.4, 0.75], // beside the tote
	capture: [73.0, 44.4, 2.6], // right of the arm's wrist
	"robot-executes": [71.0, 47.3, 0.25], // where the filled trays leave the cell, clear of the tote
	"help-request": [BEACON[0] + 0.12, BEACON[1] - 0.06, 2.9], // over the stack light (dome at H + 0.74)
};

/**
 * Where the camera aims at each stop, as an offset [dx, dy, z] from the cart (see focus). At the
 * grape cell the offsets keep the cart's tag, the cell, and its labels on a 390 px phone and a
 * 360 x 640 phone (a higher z puts the cart lower, leaving room for its tag under the top bar); on
 * the network the old aim a little behind the cart (stations on the far side of the track) stays,
 * raised at send and operator so the mast and pavilion titles clear the top bar on a short phone.
 */
const AIM = {
	"pick-fails": [0.98, -0.52, 0.6],
	"help-request": [0.11, -0.25, 0.6],
	capture: [-0.13, 1.6, 1.15],
	"robot-executes": [0.73, -1.29, 0.6],
	send: [-1.0, -1.0, 2.0],
	operator: [-1.0, -1.0, 1.6],
};
const AIM_DEFAULT = [-1.0, -1.0, 0.8];

/** Track waypoints; the comment names the stop at that waypoint. */
const POINTS = [
	[W, 46.2], // start, beside the platform
	[W, 44.3], // pick-fails
	[W, 42.2], // help-request
	[W, 40.0],
	[69.05, 38.85],
	[69.75, 38.48],
	[70.3, 38.42], // capture
	[73.8, 38.4], // encode
	[76.6, 38.6], // send
	[78.4, 39.5],
	[80.6, 41.2], // network-out
	[82.8, 43.0],
	[84.8, 44.9],
	[86.3, 46.6],
	[87.6, 47.0], // decode-display
	[90.4, 47.0], // operator
	[93.3, 47.4],
	[94.3, 49.2],
	[93.3, 51.2],
	[91.0, 52.0],
	[87.0, 52.4],
	[84.4, 53.2],
	[79.6, 53.4], // network-back
	[75.4, 53.4],
	[72.0, 53.4],
	[69.9, 53.0],
	[W, 51.6],
	[W, 49.2],
	[W, 46.2], // robot-executes (back at the platform: the end of the track)
];
const STOP_INDEX = {
	"pick-fails": 1,
	"help-request": 2,
	capture: 6,
	encode: 7,
	send: 8,
	"network-out": 10,
	"decode-display": 14,
	operator: 15,
	"network-back": 22,
	"robot-executes": 28,
};

// ---------------------------------------------------------------------------
// Small helpers

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const ease = (v) => v * v * (3 - 2 * v);

function inPoly(x, y, poly) {
	let inside = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const [xi, yi] = poly[i];
		const [xj, yj] = poly[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}

/** Quadratic arc between two 3D points, raised by lift at the middle. */
function arcAt(a, b, lift, u) {
	const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2 + lift];
	const p = (k) => (1 - u) * (1 - u) * a[k] + 2 * (1 - u) * u * m[k] + u * u * b[k];
	return [p(0), p(1), p(2)];
}

/** Draw fn(c) in a vertical +y-facing face: u meters right along +x, v meters down along -z. */
function faceY(r, x0, y, zTop, fn) {
	const c = r.ctx;
	const [sx, sy] = r.toScreen(x0, y, zTop);
	c.save();
	c.translate(sx, sy);
	c.transform(ISO.X * r.zoom, ISO.Y * r.zoom, 0, ISO.Z * r.zoom, 0, 0);
	fn(c);
	c.restore();
}

/** Ride state as the world shows it. */
function rideState(ctx) {
	const active = ctx.isActive();
	const cur = ctx.currentStopId();
	const reached = (id) => active && ctx.stopReached(id);
	return {
		active,
		cur,
		fault: active && !reached("robot-executes"),
		helpOn: reached("help-request") && !reached("robot-executes"),
		rescued: reached("robot-executes"),
		reached,
	};
}

// ---------------------------------------------------------------------------
// Static pieces

function conveyorSegment(r, y0, y1) {
	const [x0, x1] = BELT;
	r.box(x0 + 0.05, y0 + 0.1, 0, 0.12, 0.12, BELT_Z - 0.12, PAL.dark);
	r.box(x1 - 0.17, y0 + 0.1, 0, 0.12, 0.12, BELT_Z - 0.12, PAL.dark);
	r.box(x0, y0, BELT_Z - 0.16, x1 - x0, y1 - y0, 0.14, PAL.metal);
	r.ground(x0 + 0.08, y0, x1 - x0 - 0.16, y1 - y0, "#3a3f47", BELT_Z - 0.01);
	r.box(x0 - 0.04, y0, BELT_Z - 0.06, 0.1, y1 - y0, 0.12, PAL.steel);
	r.box(x1 - 0.06, y0, BELT_Z - 0.06, 0.1, y1 - y0, 0.12, PAL.steel);
}

function guardPanel(r, a, b, h = 1.5) {
	r.quad(
		[
			[a[0], a[1], 0.12],
			[b[0], b[1], 0.12],
			[b[0], b[1], h],
			[a[0], a[1], h],
		],
		"#8d99a6",
		{ alpha: 0.26, flat: true },
	);
	r.line([a[0], a[1], h], [b[0], b[1], h], PAL.safety, 3);
	r.line([a[0], a[1], 0.12], [b[0], b[1], 0.12], PAL.safety, 3);
	for (const p of [a, b]) r.box(p[0] - 0.05, p[1] - 0.05, 0, 0.1, 0.1, h + 0.02, PAL.safety);
}

function buildGround(scene, g) {
	// Cell floor with a safety-yellow border.
	scene.add({
		group: g,
		layer: LAYER.GROUND,
		depth: -70,
		bounds: [CELL.x0, CELL.y0, 0, CELL.x1, CELL.y1, 0.02],
		draw: (r) => {
			r.ground(CELL.x0, CELL.y0, CELL.x1 - CELL.x0, CELL.y1 - CELL.y0, "#d3d8dd", 0.012);
			r.polyline(
				[
					[CELL.x0 + 0.15, CELL.y0 + 0.15, 0.014],
					[CELL.x1 - 0.15, CELL.y0 + 0.15, 0.014],
					[CELL.x1 - 0.15, CELL.y1 - 0.15, 0.014],
					[CELL.x0 + 0.15, CELL.y1 - 0.15, 0.014],
				],
				PAL.safety,
				2.4,
				true,
			);
		},
	});
	// Gravel pad under the network gear along the north edge.
	groundPoly(
		scene,
		[
			[69.6, 36.6],
			[77.7, 36.6],
			[77.4, 37.9],
			[69.6, 37.9],
		],
		"#d9cfb8",
		{ group: g, depth: -69, z: 0.012 },
	);
	// The island: a low slab whose beach sides show above the water.
	const xs = ISLAND.map((p) => p[0]);
	const ys = ISLAND.map((p) => p[1]);
	scene.add({
		group: g,
		layer: LAYER.GROUND,
		depth: -79,
		bounds: [Math.min(...xs), Math.min(...ys), -0.4, Math.max(...xs), Math.max(...ys), 0.03],
		draw: (r) => {
			r.prism(ISLAND, -0.42, 0.44, PAL.sand);
			const cx = 89.8;
			const cy = 47.8;
			const inner = ISLAND.map(([x, y]) => [cx + (x - cx) * 0.9, cy + (y - cy) * 0.9]);
			r.groundPoly(inner, PAL.grassZone, 0.026);
		},
	});
	// Plaza in front of the operations center.
	groundPoly(
		scene,
		[
			[85.8, 45.6],
			[92.4, 45.6],
			[92.4, 46.4],
			[85.8, 46.4],
		],
		PAL.plaza,
		{ group: g, depth: -78, z: 0.03 },
	);
}

/** Causeway pieces under the track wherever it crosses open water. */
function buildCauseways(scene, g) {
	const track = new Track({ points: POINTS.map(([x, y]) => [x, y, 0]), stops: { ...STOP_INDEX } });
	const S = track.samples;
	const wet = S.map(([x, y]) => inPoly(x, y, LAKE) && !inPoly(x, y, ISLAND));
	// Extend each wet run by a few samples so the deck meets the shore.
	const deck = wet.map((_, i) => wet.slice(Math.max(0, i - 4), i + 5).some(Boolean));
	const half = 0.78;
	for (let i = 0; i < S.length - 1; ) {
		if (!deck[i]) {
			i++;
			continue;
		}
		const j = Math.min(S.length - 1, i + 8);
		const chunk = S.slice(i, j + 1);
		const left = [];
		const right = [];
		chunk.forEach((p, k) => {
			const a = chunk[Math.max(0, k - 1)];
			const b = chunk[Math.min(chunk.length - 1, k + 1)];
			const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
			const nx = -(b[1] - a[1]) / l;
			const ny = (b[0] - a[0]) / l;
			left.push([p[0] + nx * half, p[1] + ny * half]);
			right.push([p[0] - nx * half, p[1] - ny * half]);
		});
		const poly = [...left, ...right.reverse()];
		const xs = poly.map((p) => p[0]);
		const ys = poly.map((p) => p[1]);
		const x0 = Math.min(...xs);
		const y0 = Math.min(...ys);
		scene.add({
			group: g,
			layer: LAYER.GROUND,
			depth: x0 + y0 - 1.6,
			bounds: [x0, y0, -0.4, Math.max(...xs), Math.max(...ys), 0.05],
			draw: (r) => {
				r.prism(poly, -0.38, 0.42, R3.stone);
				r.groundPoly(poly, R3.deck, 0.045);
			},
		});
		i = j;
	}
	return track;
}

function buildPlatform(scene, g) {
	const color = PAL.ride.ride3;
	// South of the cell, so its roof never covers the robot on screen.
	const [x0, y0, x1, y1] = [65.0, 45.8, 67.9, 50.0];
	object(
		scene,
		x0,
		y0,
		x1,
		y1,
		2.9,
		(r) => {
			r.box(x0, y0, 0, x1 - x0, y1 - y0, 0.26, "#cfc8bb", { top: "#ddd6c9" });
			r.box(x1 - 0.14, y0, 0.26, 0.12, y1 - y0, 0.01, PAL.safety);
			for (const [px, py] of [
				[x0 + 0.2, y0 + 0.2],
				[x1 - 0.35, y0 + 0.2],
				[x0 + 0.2, y1 - 0.35],
				[x1 - 0.35, y1 - 0.35],
			])
				r.box(px, py, 0.26, 0.14, 0.14, 2.1, PAL.dark);
			r.box(x0 - 0.1, y0 - 0.1, 2.36, x1 - x0 + 0.2, y1 - y0 + 0.2, 0.16, color, { top: shade(color, 1.15) });
			r.box(x0 + 0.4, y0 + 0.4, 2.52, x1 - x0 - 0.8, y1 - y0 - 0.8, 0.22, shade(color, 0.85), { top: shade(color, 1.05) });
		},
		{ group: g },
	);
}

function buildCell(scene, g) {
	for (let y = BELT_Y[0]; y < BELT_Y[1] - 0.01; y += 1.6) {
		const y1 = Math.min(BELT_Y[1], y + 1.6);
		object(scene, BELT[0], y, BELT[1], y1, BELT_Z, (r) => conveyorSegment(r, y, y1), { group: g });
	}
	// Tote of grape bunches on a low stand: legs, floor, back walls, and the bunches lying at
	// assorted angles. The front walls are a live item so the fingers and a dangling bunch go
	// inside the tote rather than in front of it.
	const t = TOTE;
	object(
		scene,
		t.x0,
		t.y0,
		t.x1,
		t.y1,
		t.z + t.wall,
		(r) => {
			for (const [x, y] of [
				[t.x0 + 0.05, t.y0 + 0.05],
				[t.x1 - 0.13, t.y0 + 0.05],
				[t.x0 + 0.05, t.y1 - 0.13],
				[t.x1 - 0.13, t.y1 - 0.13],
			])
				r.box(x, y, 0, 0.08, 0.08, t.z - 0.04, PAL.dark);
			r.box(t.x0, t.y0, t.z - 0.04, t.x1 - t.x0, t.y1 - t.y0, 0.05, TOTE_BLUE, { top: shade(TOTE_BLUE, 0.7) });
			r.box(t.x0, t.y0, t.z, t.x1 - t.x0, 0.05, t.wall, "#3f82c8");
			r.box(t.x0, t.y0, t.z, 0.05, t.y1 - t.y0, t.wall, "#3f82c8");
			lyingBunches(r, TOTE_SPOTS, t.z + 0.01, BUNCH_S * 0.95);
		},
		{ group: g },
	);
	scene.add({
		group: g,
		live: true,
		depth: t.x1 + t.y1 + 0.2,
		bounds: [t.x0, t.y0, 0, t.x1, t.y1, t.z + t.wall],
		draw: (r) => {
			r.box(t.x1 - 0.05, t.y0, t.z, 0.05, t.y1 - t.y0, t.wall, "#3f82c8");
			r.box(t.x0, t.y1 - 0.05, t.z, t.x1 - t.x0, 0.05, t.wall, "#3f82c8");
		},
	});
	// Robot pedestal: stainless, for washdown.
	const [ax, ay] = ARM.base;
	object(scene, ax - 0.5, ay - 0.5, ax + 0.5, ay + 0.5, ARM.z, (r) => {
		r.box(ax - 0.5, ay - 0.5, 0, 1.0, 1.0, ARM.z - 0.02, PAL.steel, { top: "#c3cbd4" });
		r.box(ax - 0.5, ay + 0.49, 0.06, 1.0, 0.02, 0.1, PAL.safety);
		r.box(ax + 0.49, ay - 0.5, 0.06, 0.02, 1.0, 0.1, PAL.safety);
	}, { group: g });
	// Guarding along the back (north) of the cell, and a light curtain on posts along the track
	// side so the cart's view stays open.
	for (let x = CELL.x0 + 0.1; x < CELL.x1 - 0.11; x += 2.1) {
		const xa = x;
		const xb = Math.min(CELL.x1 - 0.1, x + 2.1);
		object(scene, xa, CELL.y0 + 0.05, xb, CELL.y0 + 0.15, 1.5, (r) => guardPanel(r, [xa, CELL.y0 + 0.1], [xb, CELL.y0 + 0.1]), { group: g });
	}
	for (const y of [CELL.y0 + 0.1, CELL.y1 - 0.1])
		object(scene, CELL.x0 + 0.05, y - 0.06, CELL.x0 + 0.17, y + 0.06, 1.6, (r) => {
			r.box(CELL.x0 + 0.05, y - 0.06, 0, 0.12, 0.12, 1.6, PAL.safety);
			r.box(CELL.x0 + 0.07, y - 0.04, 0.2, 0.08, 0.08, 1.2, PAL.dark);
		}, { group: g });
	// Control cabinet with the stack light on top (the light is dynamic).
	const c = CAB;
	object(
		scene,
		c.x0,
		c.y0,
		c.x1,
		c.y1,
		c.h + 0.1,
		(r) => {
			r.box(c.x0, c.y0, 0, c.x1 - c.x0, c.y1 - c.y0, c.h, "#d7dce2", { top: "#e4e8ec" });
			r.box(c.x0 + 0.1, c.y1 - 0.01, 0.55, c.x1 - c.x0 - 0.2, 0.02, 0.6, "#c6ccd3");
			r.box(c.x0 + 0.22, c.y1 + 0.005, 1.0, 0.36, 0.02, 0.22, "#1f3a52");
		},
		{ group: g },
	);
	// Cables: cabinet (camera feed) to encoder, encoder to the LTE mast.
	scene.add({
		group: g,
		layer: LAYER.GROUND,
		depth: -68,
		bounds: [BEACON[0] - 0.1, 36.9, 0, UPLINK[0], CAB.y0 + 0.1, 0.05],
		draw: (r) => {
			r.polyline(
				[
					[BEACON[0], c.y0, 0.03],
					[BEACON[0], 37.1, 0.03],
					[ENCODER.x0, 37.1, 0.03],
				],
				R3.cable,
				2,
			);
			r.polyline(
				[
					[ENCODER.x1, 37.1, 0.03],
					[UPLINK[0] - 0.3, 37.1, 0.03],
				],
				R3.cable,
				2,
			);
		},
	});
}

function buildNetworkGear(scene, g) {
	// Encoder cabinet (its screen and lights are dynamic).
	const e = ENCODER;
	object(
		scene,
		e.x0,
		e.y0,
		e.x1,
		e.y1,
		e.h + 0.3,
		(r) => {
			r.box(e.x0 - 0.05, e.y0 - 0.05, 0, e.x1 - e.x0 + 0.1, e.y1 - e.y0 + 0.1, 0.1, PAL.dark);
			r.box(e.x0, e.y0, 0.1, e.x1 - e.x0, e.y1 - e.y0, e.h - 0.1, "#4b5d73", { top: "#5b6f86" });
			// Hopper on top where frames go in.
			r.prism(
				[
					[e.x0 + 0.2, e.y0 + 0.1],
					[e.x0 + 0.75, e.y0 + 0.1],
					[e.x0 + 0.75, e.y1 - 0.1],
					[e.x0 + 0.2, e.y1 - 0.1],
				],
				e.h,
				0.12,
				PAL.metal,
			);
			// Output chute on the right side.
			r.box(e.x1, e.y0 + 0.25, 0.55, 0.22, 0.3, 0.08, PAL.metal);
		},
		{ group: g },
	);
	// The plant's LTE uplink: a lattice mast with cellular panel antennas.
	const [ux, uy] = UPLINK;
	object(
		scene,
		ux - 0.4,
		uy - 0.4,
		ux + 0.4,
		uy + 0.4,
		4.6,
		(r) => {
			r.box(ux - 0.4, uy - 0.4, 0, 0.8, 0.8, 0.12, PAL.stone);
			const legs = [
				[-0.3, -0.3],
				[0.3, -0.3],
				[-0.3, 0.3],
				[0.3, 0.3],
			];
			const top = 4.0;
			for (const [dx, dy] of legs) r.line([ux + dx, uy + dy, 0.12], [ux + dx * 0.25, uy + dy * 0.25, top], "#9aa5b1", 2.2);
			for (let k = 0; k < 4; k++) {
				const z0 = 0.12 + k * 0.95;
				const z1 = z0 + 0.95;
				const s0 = 0.3 - (0.225 * (z0 - 0.12)) / (top - 0.12);
				const s1 = 0.3 - (0.225 * (z1 - 0.12)) / (top - 0.12);
				r.line([ux - s0, uy + s0, z0], [ux + s1, uy + s1, z1], "#b8c0ca", 1.2);
				r.line([ux + s0, uy + s0, z0], [ux + s1, uy - s1, z1], "#b8c0ca", 1.2);
			}
			r.box(ux - 0.12, uy - 0.12, top, 0.24, 0.24, 0.3, PAL.dark);
			lteHead(r, ux, uy, top + 0.12, 1);
		},
		{ group: g },
	);
	// The plant's LTE mast for the return link (a slimmer pole with the same panels).
	const [rx, ry] = RX_SHORE;
	object(
		scene,
		rx - 0.3,
		ry - 0.3,
		rx + 0.3,
		ry + 0.3,
		3.6,
		(r) => {
			r.box(rx - 0.3, ry - 0.3, 0, 0.6, 0.6, 0.12, PAL.stone);
			r.cylinder(rx, ry, 0.12, 0.06, 2.9, "#9aa5b1", 6);
			lteHead(r, rx, ry, 2.95, 0.8);
		},
		{ group: g },
	);
}

/** Three flat cellular panel antennas around a pole top (what an LTE site looks like). */
function lteHead(r, x, y, z, s) {
	r.cylinder(x, y, z - 0.05 * s, 0.05 * s, 0.75 * s, "#9aa5b1", 6);
	const panels = [0, 1, 2]
		.map((i) => {
			const a = Math.PI / 4 + (i / 3) * Math.PI * 2;
			return { a, cx: x + Math.cos(a) * 0.17 * s, cy: y + Math.sin(a) * 0.17 * s };
		})
		.sort((p, q) => p.cx + p.cy - (q.cx + q.cy));
	for (const p of panels) {
		r.line([x, y, z + 0.32 * s], [p.cx, p.cy, z + 0.32 * s], "#7f8b98", 1.4 * s);
		r.orientedBox(p.cx, p.cy, z, 0.07 * s, 0.2 * s, 0.62 * s, p.a, "#eef1f4");
	}
}

/** Relay masts beside the causeways (their lights are dynamic). */
function relayPoints(track) {
	const out = [];
	const S = track.samples;
	let lastS = -Infinity;
	for (let i = 2; i < S.length - 2; i++) {
		const [x, y] = S[i];
		if (!inPoly(x, y, LAKE) || inPoly(x, y, ISLAND)) continue;
		if (track.cum[i] - lastS < 3.2) continue;
		const a = S[i - 1];
		const b = S[i + 1];
		const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
		const nx = -(b[1] - a[1]) / l;
		const ny = (b[0] - a[0]) / l;
		// Masts stand on the far (north or west) side of the deck so they never hide the cart.
		const s = nx + ny < 0 ? 1 : -1;
		out.push([x + nx * 0.62 * s, y + ny * 0.62 * s, track.cum[i]]);
		lastS = track.cum[i];
	}
	return out;
}

function buildRelays(scene, g, track) {
	for (const [x, y] of relayPoints(track))
		object(
			scene,
			x - 0.12,
			y - 0.12,
			x + 0.12,
			y + 0.12,
			2.2,
			(r) => {
				r.cylinder(x, y, 0.04, 0.05, 1.75, "#9aa5b1", 6);
				r.box(x - 0.1, y - 0.1, 1.75, 0.2, 0.2, 0.16, PAL.dark);
				r.sphere(x, y, 2.0, 0.08, "#ffd76a", 0);
			},
			{ group: g },
		);
}

function buildOps(scene, g) {
	const o = OPS;
	// Display hall (west part): walls, a teal band, the video wall goes on the south face.
	object(
		scene,
		o.x0,
		o.y0,
		o.xm,
		o.y1,
		o.h + 1.2,
		(r) => {
			r.box(o.x0, o.y0, 0, o.xm - o.x0, o.y1 - o.y0, o.h, "#eef0f2", { top: "#dde2e7" });
			r.box(o.x0, o.y1, o.h - 0.3, o.xm - o.x0, 0.02, 0.3, PAL.ride.ride3);
			r.box(o.x0 - 0.05, o.y0 - 0.05, o.h, o.xm - o.x0 + 0.1, o.y1 - o.y0 + 0.1, 0.12, "#c8ced5");
			// Network box on the roof where the office's wired line comes in.
			const [hx, hy] = ISLAND_HUB;
			r.box(hx - 0.3, hy - 0.22, o.h + 0.12, 0.6, 0.44, 0.42, "#4b5d73", { top: "#5b6f86" });
			r.box(hx - 0.22, hy + 0.215, o.h + 0.36, 0.44, 0.01, 0.08, "#1f2b38");
		},
		{ group: g },
	);
	// Operator pavilion (east part): back wall, side wall, desk, roof over the back half.
	object(
		scene,
		o.xm,
		o.y0,
		o.x1,
		o.y1,
		o.h + 0.4,
		(r) => {
			r.box(o.xm, o.y0, 0, o.x1 - o.xm, 0.25, o.h, "#eef0f2", { top: "#dde2e7" });
			r.box(o.xm, o.y0, 0, 0.2, o.y1 - o.y0, o.h, "#e3e7eb");
			r.box(o.xm, o.y0, 0.02, o.x1 - o.xm, o.y1 - o.y0, 0.04, "#b9c2cc");
			// Desk.
			const d = DESK;
			r.box(d.x0, d.y0, 0, 0.08, d.y1 - d.y0, d.h, PAL.dark);
			r.box(d.x1 - 0.08, d.y0, 0, 0.08, d.y1 - d.y0, d.h, PAL.dark);
			r.box(d.x0, d.y0, d.h, d.x1 - d.x0, d.y1 - d.y0, 0.06, "#d8c3a0", { top: "#e6d3b2" });
			// Front post and roof over the back half.
			r.box(o.x1 - 0.2, 44.2, 0, 0.16, 0.16, o.h, PAL.dark);
			r.box(o.xm, o.y0 - 0.05, o.h, o.x1 - o.xm + 0.05, 2.45, 0.14, PAL.ride.ride3, { top: shade(PAL.ride.ride3, 1.15) });
		},
		{ group: g },
	);
	// Network cabinet in the island garden where commands leave for the return path.
	const [tx, ty] = TX_ISLAND;
	object(
		scene,
		tx - 0.35,
		ty - 0.35,
		tx + 0.35,
		ty + 0.35,
		1.6,
		(r) => {
			r.box(tx - 0.35, ty - 0.35, 0, 0.7, 0.7, 0.12, PAL.stone);
			r.box(tx - 0.26, ty - 0.22, 0.12, 0.52, 0.44, 1.1, "#4b5d73", { top: "#5b6f86" });
			r.box(tx - 0.18, ty + 0.215, 0.7, 0.36, 0.01, 0.3, "#1f2b38");
		},
		{ group: g },
	);
}

function buildBoardStructure(scene, g) {
	const b = BOARD;
	const d = b.half * Math.SQRT1_2;
	const L = [b.x - d, b.y + d];
	const R = [b.x + d, b.y - d];
	object(
		scene,
		b.x - d - 0.6,
		b.y - d - 0.6,
		b.x + d + 0.6,
		b.y + d + 0.6,
		b.z1 + 0.2,
		(r) => {
			r.orientedBox(b.x, b.y, -0.2, b.half * 2 + 1.0, 1.1, 0.32, -Math.PI / 4, "#e6e1d6", { top: "#f0ece4" });
			for (const p of [L, R]) r.box(p[0] - 0.08, p[1] - 0.08, 0.1, 0.16, 0.16, b.z0, PAL.dark);
			// Back plate of the sign (the display is drawn on top, dynamically).
			r.quad(
				[
					[L[0], L[1], b.z0 - 0.08],
					[R[0], R[1], b.z0 - 0.08],
					[R[0], R[1], b.z1 + 0.08],
					[L[0], L[1], b.z1 + 0.08],
				],
				"#2b3440",
				{ flat: true },
			);
		},
		{ group: g },
	);
}

function buildDecor(scene, g) {
	const trees = [
		// Near shore: the garden west of the track, and south of the cell and the path.
		[63.4, 38.4, 2, 0.95],
		[65.9, 37.7, "pine", 1.05],
		[64.1, 41.7, 0, 0.9],
		[66.7, 43.1, 3, 0.85],
		[63.5, 44.9, "pine", 0.9],
		[63.6, 51.2, 1, 1.0],
		[66.2, 55.6, "pine", 1.1],
		[63.4, 56.0, 2, 0.9],
		[73.2, 49.6, "pine", 1.0],
		[70.4, 50.0, 0, 0.85],
		// Island.
		[85.4, 49.6, 2, 0.9],
		[95.0, 48.0, "pine", 0.9],
		[91.6, 53.4, 1, 0.8],
		[94.2, 52.2, 3, 0.75],
	];
	for (const [x, y, kind, s] of trees) object(scene, x - 0.9 * s, y - 0.9 * s, x + 0.9 * s, y + 0.9 * s, 3 * s, (r) => drawTree(r, x, y, kind, s), { group: g });
	object(scene, 64.6, 52.4, 66.4, 53.6, 0.6, (r) => drawFlowers(r, 64.6, 52.4, 1.8, 1.2, 33), { group: g });
	object(scene, 89.6, 49.0, 91.4, 50.4, 0.6, (r) => drawFlowers(r, 89.6, 49.0, 1.8, 1.4, 34), { group: g });
	object(scene, 64.6, 39.4, 66.4, 40.6, 0.6, (r) => drawFlowers(r, 64.6, 39.4, 1.8, 1.2, 35), { group: g });
	object(scene, 66.4, 43.9, 67.8, 44.35, 0.8, (r) => drawBench(r, 66.4, 43.9, true), { group: g });
	object(scene, 64.8, 50.2, 66.2, 50.65, 0.8, (r) => drawBench(r, 64.8, 50.2, true), { group: g });
	for (const [x, y] of [
		[71.9, 48.6],
		[86.8, 48.0],
	])
		object(scene, x - 0.15, y - 0.15, x + 0.15, y + 0.15, 2.9, (r) => drawLamp(r, x, y), { group: g });
}

// ---------------------------------------------------------------------------
// Moving and state-dependent parts. The arm: one pick cycle (as at ride 2's station), the failed
// pick, and the rescue.

const ARM_PERIOD = 4.4;
const Z_PICK = TOTE.z + 0.1; // finger tips at the stem of a bunch lying in the tote
const Z_PLACE = BELT_Z + 0.05 + BUNCH_LEN * BUNCH_S + 0.03; // the hanging bunch touches the tray
const LIFT = 0.55;
// Angles in [0, 2pi), so every swing between the tote (about 60 degrees) and the belt (about 190)
// goes round the front of the arm, toward the track, never over the cabinet.
const polarOf = (p) => {
	const a = Math.atan2(p[1] - ARM.base[1], p[0] - ARM.base[0]);
	return [a < 0 ? a + Math.PI * 2 : a, Math.hypot(p[0] - ARM.base[0], p[1] - ARM.base[1])];
};
const P_PICK = polarOf(PICK);
const P_PLACE = polarOf(PLACE);
// After the operator eases the bunches apart the tool sits a little higher and toward the belt.
const FREED = [FAULT[0] - 0.22, FAULT[1] - 0.05, FAULT[2] + 0.1];
const P_FAULT = polarOf(FAULT);
const P_FREED = polarOf(FREED);
const DROPPED = [72.55, 45.9, 2.9]; // where the second bunch lands back in the tote
/** Rescue timeline (seconds after the cart reaches robot-executes). */
const RESCUE = { apart: 1.4, drop: 1.9, handBack: 2.3, carry: 3.7, lower: 4.1, open: 4.3 };

function toolAt(pa, pb, k, z) {
	const a = lerp(pa[0], pb[0], k);
	const rr = lerp(pa[1], pb[1], k);
	return [ARM.base[0] + Math.cos(a) * rr, ARM.base[1] + Math.sin(a) * rr, z];
}

/** Arm cycle state at time t (u in [0,1) over one pick). */
function cycle(t) {
	const u = (((t / ARM_PERIOD) % 1) + 1) % 1;
	const k = shuttle(t, ARM_PERIOD, 0);
	const down = dip(t, ARM_PERIOD, 0);
	return {
		u,
		tool: toolAt(P_PICK, P_PLACE, k, lerp(Z_PICK, Z_PLACE, k) + LIFT * (1 - down)),
		carrying: u > 0.12 && u < 0.6,
		placed: u >= 0.6,
		indexing: u > 0.74 ? Math.min(1, (u - 0.74) / 0.2) : 0,
	};
}

/** The pose the arm shows now: normal work, stuck with the tangle, or the rescue. */
function armPose(st, t, rescueK, rm) {
	if (st.fault) {
		const swing = rm ? 0.55 : 0.55 + 0.16 * Math.sin(t * 2.2);
		return { mode: "fault", tool: FAULT, grip: 0, swing, sep: 0, indexing: 0, placed: false };
	}
	if (st.rescued && rescueK < RESCUE.open) {
		const k = rescueK;
		const R = RESCUE;
		if (k < R.apart) {
			// Direct control: the operator eases the tool away, slowly; the knot gives.
			const u = ease(k / R.apart);
			const tool = toolAt(P_FAULT, P_FREED, u, lerp(FAULT[2], FREED[2], u));
			return { mode: "apart", tool, grip: 0, swing: lerp(0.55, 0.3, u), sep: clamp01((k - 0.4) / (R.apart - 0.4)), indexing: 0, placed: false };
		}
		if (k < R.handBack) {
			// The second bunch drops back into the tote; the operator hands control back.
			return { mode: "freed", tool: FREED, grip: 0, swing: lerp(0.3, 0, clamp01((k - R.apart) / 0.8)), drop: clamp01((k - R.apart) / (R.drop - R.apart)), indexing: 0, placed: false };
		}
		if (k < R.carry) {
			const u = ease((k - R.handBack) / (R.carry - R.handBack));
			return { mode: "carry", tool: toolAt(P_FREED, P_PLACE, u, lerp(FREED[2], Z_PLACE + 0.3, u)), grip: 0, swing: 0, indexing: 0, placed: false };
		}
		if (k < R.lower) {
			const u = ease((k - R.carry) / (R.lower - R.carry));
			return { mode: "carry", tool: toolAt(P_PLACE, P_PLACE, 1, Z_PLACE + 0.3 * (1 - u)), grip: 0, swing: 0, indexing: 0, placed: false };
		}
		return { mode: "open", tool: toolAt(P_PLACE, P_PLACE, 1, Z_PLACE), grip: ease((k - R.lower) / (R.open - R.lower)), swing: 0, indexing: 0, placed: true };
	}
	// Normal work. After a rescue the cycle picks up where the rescue left the arm (at the tray,
	// fingers open), so the hand-over has no jump.
	let tc;
	if (st.rescued) tc = rm ? ARM_PERIOD * 0.62 : rescueK - RESCUE.open + ARM_PERIOD * 0.6;
	else tc = rm ? ARM_PERIOD * 0.35 : t;
	const c = cycle(tc);
	return { mode: c.carrying ? "carry" : "idle", tool: c.tool, grip: c.carrying ? 0 : 1, swing: 0, indexing: c.indexing, placed: c.placed };
}

function addArm(scene, ctx) {
	const g = ctx.group;
	const S = ARM.scale;
	let rescueT0 = null;
	scene.addDynamic({
		group: g,
		depth: ARM.base[0] + ARM.base[1] + 0.3,
		bounds: [CELL.x0, 42.6, 0, CELL.x1, CELL.y1, 3.2],
		animated: () => true,
		draw: (r, t) => {
			const st = rideState(ctx);
			const rm = ctx.reducedMotion();
			if (!st.rescued) rescueT0 = null;
			else if (rescueT0 === null) rescueT0 = t;
			const rescueK = rm ? 1e3 : rescueT0 === null ? 0 : t - rescueT0;
			const pose = armPose(st, t, rescueK, rm);
			// Trays on the belt: indexed one pitch after each place; parked while the arm waits.
			const trays = [];
			for (let i = -5; i <= 3; i++) {
				const y = PLACE[1] + (i + pose.indexing) * TRAY_PITCH;
				if (y < BELT_Y[0] + 0.4 || y > BELT_Y[1] - 0.4) continue;
				trays.push({ y, full: i > 0 || (i === 0 && pose.placed) });
			}
			const drawTray = (tr) => drawPlate(r, BELT_X, tr.y, BELT_Z, HEADING_Y, tr.full ? { grapes: true } : {}, { scale: PLATE_S });
			for (const tr of trays) if (tr.y <= PLACE[1] + 0.5) drawTray(tr);
			// The second bunch, dropped back into the tote during the rescue.
			if (pose.mode === "freed" || (st.rescued && pose.mode !== "apart")) {
				const d = pose.mode === "freed" ? pose.drop : 1;
				if (d < 1) {
					const kp = knotPoint(FREED[0], FREED[1], FREED[2] + 0.01, 0.3, BUNCH_S, 1);
					const end = [DROPPED[0], DROPPED[1], TOTE.z + BUNCH_LEN * kp.scale * 0.55];
					hangingBunch(r, lerp(kp.second[0], end[0], d), lerp(kp.second[1], end[1], d), lerp(kp.second[2], end[2], d * d), lerp(kp.swing2, -1.2, d * d), kp.scale);
				} else lyingBunches(r, [DROPPED], TOTE.z + 0.03, BUNCH_S * 0.95);
			}
			const arm = drawSixAxis(r, ARM.base[0], ARM.base[1], pose.tool, { scale: S, z: ARM.z, tool: "fingers", grip: pose.grip });
			const lens = wristCamera(r, arm, S);
			const [tx, ty, tz] = pose.tool;
			if (pose.mode === "fault" || pose.mode === "apart") tangledBunches(r, tx, ty, tz + 0.01, pose.swing, BUNCH_S, pose.sep ?? 0);
			else if (pose.mode === "freed" || (pose.mode === "carry" && st.rescued && rescueK < RESCUE.open)) hangingBunch(r, tx, ty, tz + 0.01, pose.swing, BUNCH_S);
			else if (pose.mode === "carry") {
				if (tz - BUNCH_LEN * BUNCH_S > TOTE.z + 0.02) hangingBunch(r, tx, ty, tz + 0.01, 0, BUNCH_S);
				else lyingBunches(r, [[tx, ty, 2.6]], TOTE.z + 0.02, BUNCH_S * 0.95);
			}
			for (const tr of trays) if (tr.y > PLACE[1] + 0.5) drawTray(tr);
			// The wrist camera at work: the grip check's second picture at pick-fails, live video
			// at capture.
			const here = st.cur === "capture";
			if (here) {
				const zc = TOTE.z + TOTE.wall;
				const corners = [
					[tx - 0.62, ty - 0.5, zc],
					[tx + 0.62, ty - 0.5, zc],
					[tx + 0.62, ty + 0.5, zc],
					[tx - 0.62, ty + 0.5, zc],
				];
				for (let i = 0; i < 4; i++) r.quad([lens, corners[i], corners[(i + 1) % 4]], "#bfe6ff", { alpha: 0.2, flat: true });
				r.polyline(corners, "rgba(120,200,255,0.9)", 1.4, true);
			}
			const flash = here ? (rm ? 0.8 : 0.35 + 0.6 * Math.max(0, Math.sin(t * 9))) : st.cur === "pick-fails" ? (rm ? 0.8 : Math.max(0, 1 - ((t * 0.45) % 1) * 5)) : 0;
			if (flash > 0.02)
				r.billboard(lens[0], lens[1], lens[2], (c, zoom) => {
					const k = Math.max(0.6, zoom);
					const g2 = c.createRadialGradient(0, 0, 0, 0, 0, 22 * k);
					g2.addColorStop(0, `rgba(255,255,255,${(0.95 * flash).toFixed(2)})`);
					g2.addColorStop(1, "rgba(255,255,255,0)");
					c.fillStyle = g2;
					c.beginPath();
					c.arc(0, 0, 22 * k, 0, Math.PI * 2);
					c.fill();
				});
		},
	});
}

function addBeacon(scene, ctx) {
	const [bx, by] = BEACON;
	const H = 2.0;
	// At the help request the station's fleet agent sends its ticket out through the plant's
	// uplink (it dials out; nothing calls in through the firewall).
	const from = [bx, by, CAB.h + 0.2];
	const to = [UPLINK[0], UPLINK[1], 4.3];
	scene.addDynamic({
		group: ctx.group,
		depth: 1e5 - 2,
		bounds: [bx - 0.5, UPLINK[1] - 0.5, 0, UPLINK[0] + 0.5, by + 0.5, 6.5],
		animated: () => rideState(ctx).cur === "help-request",
		draw: (r, t) => {
			if (rideState(ctx).cur !== "help-request") return;
			const u = ctx.reducedMotion() ? 0.55 : (t * 0.42) % 1;
			const p = arcAt(from, to, 1.6, u);
			r.billboard(p[0], p[1], p[2], (c, zoom) => {
				const k = Math.max(0.6, Math.min(1.4, zoom));
				c.globalAlpha = u > 0.85 ? (1 - u) / 0.15 : 1;
				drawTicket(c, 0, 0, 24 * k, 30 * k, k);
				c.globalAlpha = 1;
			});
		},
	});
	scene.addDynamic({
		group: ctx.group,
		depth: bx + by + 0.4,
		bounds: [bx - 1.2, by - 1.2, 0, bx + 1.2, by + 1.2, H + 1.6],
		animated: () => rideState(ctx).helpOn,
		draw: (r, t) => {
			const st = rideState(ctx);
			const rm = ctx.reducedMotion();
			r.box(bx - 0.1, by - 0.1, CAB.h, 0.2, 0.2, 0.05, PAL.dark);
			r.cylinder(bx, by, CAB.h + 0.05, 0.04, H - CAB.h - 0.05, "#9aa5b1", 6);
			// Stack light: red (top), amber, green.
			const lit = { red: st.fault, amber: st.helpOn, green: !st.fault };
			const segs = [
				["green", R3.green],
				["amber", R3.alert],
				["red", R3.red],
			];
			segs.forEach(([k, col], i) => r.cylinder(bx, by, H + i * 0.2, 0.11, 0.19, lit[k] ? col : shade(col, 0.45), 8));
			r.cylinder(bx, by, H + 0.6, 0.12, 0.04, PAL.dark, 8);
			// Rotating beacon dome and its sweep of light once help was requested.
			const on = st.helpOn;
			r.sphere(bx, by, H + 0.74, 0.15, on ? "#ffcf5a" : "#b8a36a", 0, { sz: 0.9 });
			if (on) {
				const a = rm ? 0.6 : t * 3.2;
				r.billboard(bx, by, H + 0.74, (c, zoom) => {
					const k = Math.max(0.6, zoom);
					c.save();
					c.globalCompositeOperation = "lighter";
					for (const off of [0, Math.PI]) {
						const ang = a + off;
						const len = 46 * k;
						const grad = c.createLinearGradient(0, 0, Math.cos(ang) * len, Math.sin(ang) * len * 0.5);
						grad.addColorStop(0, "rgba(255,200,80,0.75)");
						grad.addColorStop(1, "rgba(255,200,80,0)");
						c.fillStyle = grad;
						c.beginPath();
						c.moveTo(0, 0);
						c.lineTo(Math.cos(ang - 0.28) * len, Math.sin(ang - 0.28) * len * 0.5);
						c.lineTo(Math.cos(ang + 0.28) * len, Math.sin(ang + 0.28) * len * 0.5);
						c.closePath();
						c.fill();
					}
					c.restore();
				});
				// Call rings rising while the cart is at the help request.
				if (st.cur === "help-request" && !rm)
					for (let i = 0; i < 3; i++) {
						const u = (t * 0.6 + i / 3) % 1;
						r.billboard(bx, by, H + 0.9 + u * 1.2, (c, zoom) => {
							const k = Math.max(0.6, zoom);
							c.beginPath();
							c.ellipse(0, 0, (8 + u * 26) * k, (3 + u * 10) * k, 0, 0, Math.PI * 2);
							c.strokeStyle = `rgba(242,165,65,${(1 - u).toFixed(2)})`;
							c.lineWidth = 2 * k;
							c.stroke();
						});
					}
			}
		},
	});
}

function addEncoder(scene, ctx) {
	const e = ENCODER;
	scene.addDynamic({
		group: ctx.group,
		depth: (e.x0 + e.x1) / 2 + (e.y0 + e.y1) / 2 + 0.2,
		bounds: [e.x0 - 0.6, e.y0 - 0.2, 0, e.x1 + 0.8, e.y1 + 0.2, e.h + 1.4],
		animated: () => true,
		draw: (r, t) => {
			const st = rideState(ctx);
			const rm = ctx.reducedMotion();
			const tt = rm ? 0.4 : t;
			// Front screen: the compressed frame, in blocks.
			faceY(r, e.x0 + 0.12, e.y1 + 0.005, e.h - 0.12, (c) => {
				c.fillStyle = R3.screen;
				c.fillRect(0, 0, 0.78, 0.5);
				drawPicture(c, 0.04, 0.04, 0.7, 0.42, { cols: 10, rows: 6, blocks: [5, 3], lw: 0.012 });
			});
			// Status lights.
			for (let i = 0; i < 3; i++) {
				const on = rm ? i === 0 : Math.sin(tt * (4 + i * 1.7) + i) > 0;
				r.box(e.x0 + 1.0 + i * 0.11, e.y1 + 0.001, e.h - 0.3, 0.07, 0.01, 0.07, on ? R3.green : "#1f3a2a");
			}
			// A big frame drops into the hopper, a small one slides out of the chute.
			const here = st.cur === "encode";
			if (here || !rm) {
				const u = rm ? 0.5 : (tt * 0.5) % 1;
				const inZ = e.h + 0.75 - clamp01(u * 2) * 0.6;
				if (u < 0.5) framedPicture(r, e.x0 + 0.48, (e.y0 + e.y1) / 2, inZ, 18, 11, { cols: 16, rows: 9 });
				else {
					const v = (u - 0.5) * 2;
					framedPicture(r, e.x1 + 0.25 + v * 0.5, e.y0 + 0.4, 0.66, 9, 6, { cols: 6, rows: 4, blocks: [3, 2] });
				}
			}
		},
	});
}

/**
 * Packets hopping along a path of points (the relay masts are the routers on the route); some
 * get lost in the water, some arrive out of order. Each hop is a low arc.
 */
function addPacketStream(scene, ctx, path, opts) {
	const g = ctx.group;
	const n = opts.n;
	const period = opts.period;
	const lost = new Set(opts.lost ?? []);
	const speeds = Array.from({ length: n }, (_, i) => 1 + ((i * 37) % 5) * 0.07 - (lost.has(i) ? 0 : i % 3 === 1 ? 0.18 : 0));
	const lens = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
	const total = lens.reduce((a, b) => a + b, 0);
	const at = (u) => {
		let d = u * total;
		for (let i = 0; i < lens.length; i++) {
			if (d <= lens[i] || i === lens.length - 1) return arcAt(path[i], path[i + 1], Math.max(0.5, lens[i] * 0.22), clamp01(d / lens[i]));
			d -= lens[i];
		}
		return path[path.length - 1];
	};
	const xs = path.map((p) => p[0]);
	const ys = path.map((p) => p[1]);
	const box = [Math.min(...xs) - 1, Math.min(...ys) - 1, 0, Math.max(...xs) + 1, Math.max(...ys) + 1, Math.max(...path.map((p) => p[2])) + 2];
	const splashes = [];
	// Packets in the air draw over everything; splash rings sit on the water under everything.
	scene.addDynamic({
		group: g,
		depth: 1e5,
		bounds: box,
		animated: () => true,
		draw: (r, t) => {
			if (ctx.reducedMotion()) {
				// Frozen: a few packets spread along the path.
				for (let i = 0; i < n; i += 2) {
					const p = at((i + 0.5) / n);
					packetBox(r, p[0], p[1], p[2], opts.size, R3.packet[i % R3.packet.length]);
				}
				return;
			}
			const st = rideState(ctx);
			const hot = st.cur === opts.stop;
			splashes.length = 0;
			for (let i = 0; i < n; i++) {
				const u = ((((t / period) * speeds[i] + i / n) % 1) + 1) % 1;
				if (lost.has(i) && u > opts.lostAt) {
					// Dropped: fall to the water, then a splash ring.
					const p0 = at(opts.lostAt);
					const f = (u - opts.lostAt) / (1 - opts.lostAt);
					if (f < 0.35) {
						const k = f / 0.35;
						packetBox(r, p0[0] + k * 0.5, p0[1] + k * 0.3, p0[2] * (1 - k * k), opts.size, R3.packet[i % R3.packet.length], { alpha: 1 - k * 0.3 });
					} else splashes.push([p0[0] + 0.5, p0[1] + 0.3, (f - 0.35) / 0.65]);
					continue;
				}
				const p = at(u);
				packetBox(r, p[0], p[1], p[2], opts.size * (hot ? 1.15 : 1), R3.packet[i % R3.packet.length]);
			}
		},
	});
	scene.addDynamic({
		group: g,
		depth: -1e5,
		bounds: [box[0], box[1], 0, box[3], box[4], 0.2],
		draw: (r) => {
			for (const [x, y, k] of splashes)
				r.billboard(x, y, 0.02, (c, zoom) => {
					const s = Math.max(0.5, zoom);
					c.beginPath();
					c.ellipse(0, 0, (4 + k * 18) * s, (2 + k * 9) * s, 0, 0, Math.PI * 2);
					c.strokeStyle = `rgba(255,255,255,${(0.9 * (1 - k)).toFixed(2)})`;
					c.lineWidth = 1.6 * s;
					c.stroke();
				});
		},
	});
}

function addBuoys(scene, ctx, track) {
	const S = track.samples;
	const spots = [];
	let last = -Infinity;
	for (let i = 2; i < S.length - 2; i++) {
		const [x, y] = S[i];
		if (!inPoly(x, y, LAKE) || inPoly(x, y, ISLAND) || track.cum[i] - last < 2.6) continue;
		const a = S[i - 1];
		const b = S[i + 1];
		const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
		const nx = -(b[1] - a[1]) / l;
		const ny = (b[0] - a[0]) / l;
		const s = nx + ny > 0 ? 1 : -1; // the near (south or east) side, low in the water
		spots.push([x + nx * 1.5 * s, y + ny * 1.5 * s, spots.length]);
		last = track.cum[i];
	}
	for (const [x, y, i] of spots)
		scene.addDynamic({
			group: ctx.group,
			depth: x + y,
			bounds: [x - 0.4, y - 0.4, 0, x + 0.4, y + 0.4, 1.2],
			animated: () => true,
			draw: (r, t) => {
				const bob = ctx.reducedMotion() ? 0 : Math.sin(t * 1.8 + i * 1.3) * 0.05;
				r.shadow(x, y, 0.35, 0.3, 0.12, 0.02);
				r.cylinder(x, y, -0.05 + bob, 0.22, 0.22, i % 2 ? "#e2483d" : "#f4f4f2", 8);
				r.cylinder(x, y, 0.17 + bob, 0.035, 0.42, PAL.dark, 5);
				const blink = ctx.reducedMotion() || Math.sin(t * 3 + i) > 0.2;
				r.sphere(x, y, 0.64 + bob, 0.07, blink ? "#ffd76a" : "#8a7a40", 0);
			},
		});
}

function addOpsDisplays(scene, ctx) {
	const o = OPS;
	// Video wall on the display hall: waiting until the frame arrives, then the picture.
	scene.addDynamic({
		group: ctx.group,
		depth: o.x0 + o.y1 + 0.5,
		bounds: [o.x0, o.y1 - 0.1, 0, o.xm, o.y1 + 0.1, o.h],
		animated: () => {
			const st = rideState(ctx);
			return st.active && !st.reached("decode-display");
		},
		draw: (r, t) => {
			const st = rideState(ctx);
			const ready = !st.active || st.reached("decode-display");
			faceY(r, o.x0 + 0.25, o.y1 + 0.03, o.h - 0.42, (c) => {
				const w = o.xm - o.x0 - 0.5;
				const h = 1.62;
				c.fillStyle = R3.bezel;
				c.fillRect(-0.06, -0.06, w + 0.12, h + 0.12);
				if (ready) {
					drawPicture(c, 0, 0, w, h, { cols: 48, rows: 30 });
					// Thin seams of a video wall made of four panels.
					c.fillStyle = R3.bezel;
					c.fillRect(w / 2 - 0.015, 0, 0.03, h);
					c.fillRect(0, h / 2 - 0.015, w, 0.03);
				} else {
					c.fillStyle = R3.screen;
					c.fillRect(0, 0, w, h);
					const k = ctx.reducedMotion() ? 0 : t;
					c.strokeStyle = "rgba(120,200,255,0.8)";
					c.lineWidth = 0.06;
					c.beginPath();
					c.arc(w / 2, h / 2, 0.3, k * 4, k * 4 + 4.2);
					c.stroke();
				}
			});
		},
	});
	// Operator at the desk: two monitors with the wrist camera's view, a SpaceMouse under the
	// right hand, and the enable button held down by the left (direct control).
	const d = DESK;
	scene.addDynamic({
		group: ctx.group,
		depth: (d.x0 + d.x1) / 2 + d.y1 + 1.2,
		bounds: [o.xm, o.y0, 0, o.x1, o.y1 + 0.6, 2],
		animated: () => true,
		draw: (r, t) => {
			const st = rideState(ctx);
			const rm = ctx.reducedMotion();
			const tt = rm ? 0 : t;
			const acting = st.reached("operator") && !st.reached("robot-executes");
			// Monitors facing the operator (and the viewer).
			for (const [mx, w] of [
				[89.55, 0.95],
				[90.62, 0.95],
			]) {
				r.box(mx + w / 2 - 0.05, d.y0 + 0.25, d.h + 0.06, 0.1, 0.1, 0.18, PAL.dark);
				r.box(mx, d.y0 + 0.2, d.h + 0.22, w, 0.06, 0.62, R3.bezel);
				faceY(r, mx + 0.04, d.y0 + 0.265, d.h + 0.8, (c) => {
					c.fillStyle = R3.screen;
					c.fillRect(0, 0, w - 0.08, 0.54);
					drawPicture(c, 0.02, 0.02, w - 0.12, 0.5, { cols: 24, rows: 14 });
					// The push the operator gives, drawn in the camera's view: away is up the screen.
					if (mx > 90 && acting) {
						const pulse = 0.75 + 0.25 * Math.sin(tt * 5);
						upArrow(c, 0.02 + (w - 0.12) * 0.3, 0.02 + 0.5 * (0.5 - 0.06 * pulse), 0.2, "#ffe066");
					}
				});
			}
			// SpaceMouse under the right hand; it moves only while the enable button is held.
			const push = acting ? (rm ? 0.8 : 0.55 + 0.45 * Math.sin(tt * 2.4)) : 0;
			const cap = spaceMouse(r, MOUSE[0], MOUSE[1], d.h + 0.06, 1.25, push, -Math.PI / 2);
			const btn = [89.95, 43.5];
			enableButton(r, btn[0], btn[1], d.h + 0.06, 1.2, acting);
			// Chair and operator (seen from behind).
			const ox = 90.55;
			const oy = 44.4;
			r.cylinder(ox, oy, 0, 0.05, 0.42, PAL.dark, 6);
			r.box(ox - 0.25, oy - 0.22, 0.42, 0.5, 0.44, 0.08, "#2f3a48");
			r.box(ox - 0.25, oy + 0.16, 0.5, 0.5, 0.08, 0.55, "#2f3a48");
			r.cylinder(ox, oy - 0.02, 0.5, 0.17, 0.5, "#3d7fd1", 8);
			r.sphere(ox, oy - 0.02, 1.13, 0.14, "#6b4a35", 1);
			// Right hand on the SpaceMouse cap, left hand on the enable button.
			const hand = [cap[0], cap[1] + 0.02, cap[2] + 0.04];
			r.tube([ox + 0.16, oy - 0.05, 0.92], hand, 0.045, "#3d7fd1", 6);
			r.sphere(hand[0], hand[1], hand[2], 0.055, "#f0c8a0", 0);
			const left = [btn[0], btn[1] + 0.02, d.h + 0.15];
			r.tube([ox - 0.16, oy - 0.05, 0.92], left, 0.045, "#3d7fd1", 6);
			r.sphere(left[0], left[1], left[2], 0.05, "#f0c8a0", 0);
		},
	});
}

function addTxLights(scene, ctx) {
	const lights = [
		[UPLINK[0], UPLINK[1], TX_Z.uplink, "send"],
		[TX_ISLAND[0], TX_ISLAND[1], TX_Z.island, "network-back"],
		[RX_SHORE[0], RX_SHORE[1], TX_Z.shore, "network-back"],
		[ISLAND_HUB[0], ISLAND_HUB[1], TX_Z.hub, "network-out"],
	];
	scene.addDynamic({
		group: ctx.group,
		depth: 1e5 - 1,
		bounds: [70, 36, 0, 90, 53, 5],
		animated: () => true,
		draw: (r, t) => {
			const rm = ctx.reducedMotion();
			const st = rideState(ctx);
			for (const [x, y, z, stop] of lights) {
				const on = rm || Math.sin(t * 2.4 + x) > 0;
				r.sphere(x, y, z, 0.08, on ? "#ff5a4a" : "#7a2a24", 0);
				if (st.cur === stop && !rm) {
					const u = (t * 0.8) % 1;
					r.billboard(x, y, z, (c, zoom) => {
						const k = Math.max(0.6, zoom);
						c.beginPath();
						c.arc(0, 0, (6 + u * 30) * k, 0, Math.PI * 2);
						c.strokeStyle = `rgba(79,179,191,${(1 - u).toFixed(2)})`;
						c.lineWidth = 2 * k;
						c.stroke();
					});
				}
			}
		},
	});
}

/** The delay board in the lake: running total and one bar segment per stop, sized by delay. */
function addBoard(scene, ctx) {
	const b = BOARD;
	const d = b.half * Math.SQRT1_2;
	const TL = [b.x - d, b.y + d, b.z1];
	let shown = null;
	let from = 0;
	let tween0 = 0;
	scene.addDynamic({
		group: ctx.group,
		depth: b.x + b.y + 1.0,
		bounds: [b.x - d, b.y - d, b.z0, b.x + d, b.y + d, b.z1],
		animated: () => shown !== null && tween0 !== null,
		draw: (r, t) => {
			const st = rideState(ctx);
			const m = delayModel(ctx.stops, st.cur);
			const target = st.active ? m.running : m.total;
			if (shown === null) shown = target;
			if (target !== shown) {
				from = shown;
				shown = target;
				tween0 = t;
			}
			let value = shown;
			if (tween0 !== null && !ctx.reducedMotion()) {
				const k = clamp01((t - tween0) / 0.9);
				value = lerp(from, shown, ease(k));
				if (k >= 1) tween0 = null;
			} else tween0 = null;
			const Wpx = b.half * 2 * ISO.X * Math.SQRT2;
			const Hpx = (b.z1 - b.z0) * ISO.Z;
			r.billboard(TL[0], TL[1], TL[2], (c, zoom) => {
				c.scale(zoom, zoom);
				c.fillStyle = "#1d2a36";
				roundRect(c, 0, 0, Wpx, Hpx, 5);
				c.fill();
				c.strokeStyle = PAL.ride.ride3;
				c.lineWidth = 2;
				c.stroke();
				// Stopwatch dial: one turn = the whole ride.
				const R = Hpx * 0.24;
				const cx = 12 + R;
				const cy = Hpx * 0.36;
				c.fillStyle = "#f4f4f2";
				c.beginPath();
				c.arc(cx, cy, R, 0, Math.PI * 2);
				c.fill();
				c.fillStyle = "#c9d1db";
				c.fillRect(cx - 2, cy - R - 4, 4, 4);
				const frac = m.total > 0 ? value / m.total : 0;
				if (st.active && frac > 0) {
					c.fillStyle = "rgba(31,158,143,0.35)";
					c.beginPath();
					c.moveTo(cx, cy);
					c.arc(cx, cy, R - 1, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
					c.closePath();
					c.fill();
				}
				const ang = -Math.PI / 2 + (st.active ? frac : 0) * Math.PI * 2;
				c.strokeStyle = "#e2483d";
				c.lineWidth = 2;
				c.beginPath();
				c.moveTo(cx, cy);
				c.lineTo(cx + Math.cos(ang) * (R - 2), cy + Math.sin(ang) * (R - 2));
				c.stroke();
				// Readout.
				c.fillStyle = st.active ? "#ffffff" : "#8fa0b2";
				const text = fmtMs(value);
				const room = Wpx - (cx + R + 10) - 10;
				let size = Math.round(Hpx * 0.34);
				c.font = `800 ${size}px system-ui, sans-serif`;
				const tw = c.measureText(text).width;
				if (tw > room) {
					size = Math.floor((size * room) / tw);
					c.font = `800 ${size}px system-ui, sans-serif`;
				}
				c.textBaseline = "middle";
				c.fillText(text, cx + R + 10, cy + 1);
				// Segment bar.
				const bx0 = 12;
				const bx1 = Wpx - 12;
				const by = Hpx * 0.72;
				const bh = Hpx * 0.16;
				c.fillStyle = "#33414f";
				c.fillRect(bx0, by, bx1 - bx0, bh);
				let x = bx0;
				const span = bx1 - bx0;
				m.mids.forEach((mid, i) => {
					const w = m.total > 0 ? (mid / m.total) * span : 0;
					const past = st.active && i < m.idx;
					const cur = st.active && i === m.idx;
					if (past || cur) {
						c.fillStyle = cur ? R3.alert : PAL.ride.ride3;
						c.fillRect(x, by, Math.max(cur ? 2 : 0, w), bh);
					}
					c.fillStyle = "#1d2a36";
					if (i > 0) c.fillRect(x - 0.5, by, 1, bh);
					x += w;
				});
			});
		},
	});
}

// ---------------------------------------------------------------------------
// Cargo on the cart

function drawCargo(r, stopId, pos, t, ctx) {
	const [x, y, z] = pos.anchor;
	const h = pos.heading;
	const rm = ctx.reducedMotion();
	const fwd = (f, s = 0) => [x + Math.cos(h) * f - Math.sin(h) * s, y + Math.sin(h) * f + Math.cos(h) * s];
	switch (stopId) {
		case "pick-fails": {
			// Soft fingers on a stub of arm, holding a bunch half out of the grip with a second
			// bunch knotted to it.
			const [px, py] = fwd(-0.18, 0);
			const tip = fwd(0.12, 0);
			const zf = z + 1.02;
			r.box(px - 0.04, py - 0.04, z, 0.08, 0.08, 1.32, PAL.steel);
			r.beam([px, py, z + 1.32], [tip[0], tip[1], z + 1.32], 0.08, 0.08, "#f2f2ee");
			r.cylinder(tip[0], tip[1], zf + 0.2, 0.03, 0.1, "#3b4552", 6);
			drawSoftFingers(r, tip[0], tip[1], zf, 0, 1.4, h);
			const sw = rm ? 0.5 : 0.5 + 0.16 * Math.sin(t * 2.4);
			tangledBunches(r, tip[0], tip[1], zf + 0.01, sw, 1.3, 0);
			break;
		}
		case "help-request":
			r.billboard(x, y, z, (c, zoom) => {
				const k = Math.max(0.6, zoom);
				drawTicket(c, 0, 0, 30 * k, 38 * k, k);
			});
			break;
		case "capture":
			stand(r, x, y, z, 0.25);
			framedPicture(r, x, y, z + 0.25, 46, 28, { cols: 28, rows: 17 });
			break;
		case "encode":
			stand(r, x, y, z, 0.18);
			framedPicture(r, x, y, z + 0.18, 26, 16, { cols: 12, rows: 8, blocks: [4, 3] });
			break;
		case "send": {
			// A stack of packets.
			const s = 0.24;
			const spots = [
				[-0.15, -0.14, 0],
				[0.15, -0.14, 0],
				[-0.15, 0.14, 0],
				[0.15, 0.14, 0],
				[0, 0, 1],
				[0.05, -0.05, 2],
			];
			spots.sort((a, b) => a[2] - b[2] || a[0] + a[1] - (b[0] + b[1]));
			spots.forEach(([f, sd, lvl], i) => {
				const p = fwd(f, sd);
				packetBox(r, p[0], p[1], z + lvl * s * 0.64, s, R3.packet[i % R3.packet.length]);
			});
			break;
		}
		case "network-out": {
			// Packets scattered across the deck, one slot empty, two out of place.
			const s = 0.22;
			const grid = [];
			for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) grid.push([(i - 1) * 0.28, (j - 0.5) * 0.3, i * 2 + j]);
			grid.sort((a, b) => fwdDepth(a) - fwdDepth(b));
			for (const [f, sd, k] of grid) {
				const p = fwd(f + (k === 1 ? 0.06 : 0), sd + (k === 4 ? 0.07 : 0));
				if (k === 3) packetSlot(r, p[0], p[1], z + 0.005, s);
				else packetBox(r, p[0], p[1], z, s, R3.packet[k === 2 ? 4 : k === 4 ? 2 : k % R3.packet.length]);
			}
			break;
		}
		case "decode-display":
			stand(r, x, y, z, 0.3);
			framedPicture(r, x, y, z + 0.3, 36, 22, { cols: 36, rows: 22, screen: true });
			break;
		case "operator": {
			// The SpaceMouse push (direct control) with the enable button held, and the direction
			// of the push as the camera shows it.
			const p = fwd(-0.08, 0.1);
			spaceMouse(r, p[0], p[1], z, 2.3, rm ? 0.8 : 0.5 + 0.5 * Math.sin(t * 2.4), h + Math.PI);
			const b = fwd(0.12, -0.24);
			enableButton(r, b[0], b[1], z, 2.0, true);
			r.billboard(p[0], p[1], z + 0.62, (c, zoom) => {
				const k = Math.max(0.6, zoom);
				upArrow(c, 0, rm ? 0 : -3 * k * Math.max(0, Math.sin(t * 2.4)), 18 * k, "#ffe066");
			});
			break;
		}
		case "network-back": {
			const p = fwd(0.05, 0);
			r.billboard(p[0], p[1], z + 0.24, (c, zoom) => {
				const k = Math.max(0.6, zoom);
				const g2 = c.createRadialGradient(0, 0, 0, 0, 0, 22 * k);
				g2.addColorStop(0, "rgba(255,230,120,0.65)");
				g2.addColorStop(1, "rgba(255,230,120,0)");
				c.fillStyle = g2;
				c.beginPath();
				c.arc(0, 0, 22 * k, 0, Math.PI * 2);
				c.fill();
			});
			packetBox(r, p[0], p[1], z, 0.3, "#e86a5c");
			r.billboard(p[0], p[1], z + 0.42, (c, zoom) => {
				const k = Math.max(0.6, zoom);
				c.fillStyle = "#ffffff";
				c.strokeStyle = "#1d2127";
				c.lineWidth = 1 * k;
				c.beginPath();
				c.moveTo(-7 * k, -3 * k);
				c.lineTo(2 * k, -3 * k);
				c.lineTo(2 * k, -7 * k);
				c.lineTo(9 * k, 0);
				c.lineTo(2 * k, 7 * k);
				c.lineTo(2 * k, 3 * k);
				c.lineTo(-7 * k, 3 * k);
				c.closePath();
				c.fill();
				c.stroke();
			});
			break;
		}
		case "robot-executes": {
			// Soft fingers lower the freed bunch into the tray, then open and lift away.
			const k = rm ? 1 : clamp01((t - (cargoArrive.get(ctx) ?? t)) / 2.2);
			const placed = k >= 0.7;
			const BS = 1.3;
			drawPlate(r, x, y, z, h, placed ? { grapes: true } : {}, { scale: 1.45 });
			const g0 = fwd(-0.2, -0.14);
			const drop = lerp(0.55, 0.02, ease(clamp01(k / 0.7)));
			const tipZ = z + 0.07 + drop + BUNCH_LEN * BS + (placed ? ease((k - 0.7) / 0.3) * 0.25 : 0);
			r.cylinder(g0[0], g0[1], tipZ + 0.22, 0.03, 0.75, "#3b4552", 6);
			if (!placed) hangingBunch(r, g0[0], g0[1], tipZ + 0.01, 0, BS);
			drawSoftFingers(r, g0[0], g0[1], tipZ, placed ? Math.min(1, (k - 0.7) * 6) : 0, 1.4, h);
			break;
		}
		default:
			break;
	}
	function fwdDepth([f, sd]) {
		const p = fwd(f, sd);
		return p[0] + p[1];
	}
}

/** When the cart reached its current stop (scene time), per ride context, for cargo animations. */
const cargoArrive = new WeakMap();
const cargoStop = new WeakMap();

// ---------------------------------------------------------------------------

export default {
	id: "ride3",
	zone: "rescue",

	trackFor() {
		return { points: POINTS.map(([x, y]) => [x, y, 0]), stops: { ...STOP_INDEX } };
	},

	buildScenery(scene, ctx) {
		loadCss(CSS);
		const g = ctx.group;
		buildGround(scene, g);
		const track = buildCauseways(scene, g);
		buildPlatform(scene, g);
		buildCell(scene, g);
		buildNetworkGear(scene, g);
		buildRelays(scene, g, track);
		buildOps(scene, g);
		buildBoardStructure(scene, g);
		buildDecor(scene, g);
		addArm(scene, ctx);
		addBeacon(scene, ctx);
		addEncoder(scene, ctx);
		addBuoys(scene, ctx, track);
		addOpsDisplays(scene, ctx);
		addTxLights(scene, ctx);
		addBoard(scene, ctx);
		// Video goes out over the plant's LTE mast and hops router to router (the relay masts on
		// the outbound causeway) to the operations center; commands come back the same way.
		const relays = relayPoints(track);
		const hop = ([x, y]) => [x, y, 2.1];
		const out = relays.filter((p) => p[2] > track.stopS.send && p[2] < track.stopS["decode-display"]).map(hop);
		const back = relays.filter((p) => p[2] > track.stopS.operator).map(hop);
		addPacketStream(scene, ctx, [[UPLINK[0], UPLINK[1], TX_Z.uplink], ...out, [ISLAND_HUB[0], ISLAND_HUB[1], TX_Z.hub]], {
			n: 9,
			period: 4.6,
			size: 0.3,
			lost: [4],
			lostAt: 0.5,
			stop: "network-out",
		});
		addPacketStream(scene, ctx, [[TX_ISLAND[0], TX_ISLAND[1], TX_Z.island + 0.1], ...back, [RX_SHORE[0], RX_SHORE[1], TX_Z.shore]], {
			n: 5,
			period: 5.2,
			size: 0.22,
			stop: "network-back",
		});
		ctx.booth("operator", 94.6, 45.0);
		// Hit targets and labels. Four stops share the grape cell, so their labels are spread out
		// (LABEL): pick-fails beside the tote, capture right of the wrist camera, robot-executes
		// low where the filled trays leave, help-request over the stack light.
		const T = (id, bounds, label) => ctx.stopTarget(id, bounds, label);
		T("pick-fails", [TOTE.x0, TOTE.y0, 0, TOTE.x1, TOTE.y1, 1.4], LABEL["pick-fails"]);
		T("help-request", [CAB.x0 - 0.1, CAB.y0 - 0.1, 0, CAB.x1 + 0.1, CAB.y1 + 0.1, 3.2], LABEL["help-request"]);
		T("capture", [71.9, 43.8, 1.4, 72.9, 44.9, 2.4], LABEL.capture);
		// Encode's title sits low at the encoder's front corner, right of the cart's tag at encode.
		// At send the encoder stands right behind the cart, so its title would sit on the cart's
		// rider: it hides there (the encoder's hit target stays).
		const encodeLabel = [ENCODER.x1 + 0.1, ENCODER.y1 + 0.1, 0.6];
		T("encode", [ENCODER.x0 - 0.2, ENCODER.y0 - 0.2, 0, ENCODER.x1 + 0.4, ENCODER.y1 + 0.2, 2.0], () => (rideState(ctx).cur === "send" ? null : encodeLabel));
		T("send", [UPLINK[0] - 0.5, UPLINK[1] - 0.5, 0, UPLINK[0] + 0.6, UPLINK[1] + 0.6, 4.9], [UPLINK[0], UPLINK[1], 5.4]);
		T("network-out", [79.4, 39.6, 0, 82.0, 42.6, 1.6], [83.2, 40.0, 2.0]);
		T("decode-display", [OPS.x0, OPS.y1 - 1.0, 0, OPS.xm, OPS.y1 + 0.2, OPS.h], [(OPS.x0 + OPS.xm) / 2, OPS.y1 - 0.4, OPS.h + 0.95]);
		T("operator", [OPS.xm, OPS.y0 + 0.8, 0, OPS.x1, OPS.y1 + 0.4, 2.2], [(OPS.xm + OPS.x1) / 2, OPS.y0 + 1.2, OPS.h + 1.1]);
		T("network-back", [78.4, 52.4, 0, 81.0, 54.4, 1.6], [78.4, 52.2, 3.35]);
		T("robot-executes", [BELT[0], 42.4, 0, 72.5, 44.7, 1.4], LABEL["robot-executes"]);
	},

	// Aim by the stop the cart is at or nearing (AIM), blending back to the default in between.
	focus(pos, ctx) {
		let best = null;
		let bestD = Infinity;
		for (const s of ctx.stops) {
			const p = POINTS[STOP_INDEX[s.id]];
			const d = p ? Math.hypot(p[0] - pos.x, p[1] - pos.y) : Infinity;
			if (d < bestD) {
				bestD = d;
				best = s.id;
			}
		}
		const aim = AIM[best] ?? AIM_DEFAULT;
		const w = clamp01(1.25 - bestD / 2.4);
		return [pos.x + lerp(AIM_DEFAULT[0], aim[0], w), pos.y + lerp(AIM_DEFAULT[1], aim[1], w), pos.z + lerp(AIM_DEFAULT[2], aim[2], w)];
	},

	drawCargo(r, stopId, pos, t, ctx) {
		if (cargoStop.get(ctx) !== stopId) {
			cargoStop.set(ctx, stopId);
			cargoArrive.set(ctx, t);
		}
		drawCargo(r, stopId, pos, t, ctx);
	},

	closeup(stopId, el, ctx) {
		loadCss(CSS);
		return closeup(stopId, el, ctx);
	},
};

