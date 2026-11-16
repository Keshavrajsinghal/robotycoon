// Ride 1 pick cells inside the guarded cage: grapes (washdown six-axis arm with soft fingers at a
// tote of bunches), apples (delta with a vacuum cup over a moving belt), crackers (SCARA with a
// bellows cup at a stack feeder), cheese (stainless delta with a vacuum cup over a moving belt).
// The cage is stainless posts with clear polycarbonate panels, an interlocked door per cell with
// an emergency stop and a lockout switch, and small tunnels where the tray belt enters and leaves.
// Drawing code only.

import { drawAppleSlice, drawCheeseWedge, drawCrackerPack, drawGrapes, drawHangingBunch } from "../engine/food.js";
import { shade } from "../engine/iso.js";
import { object, PAL } from "../engine/park.js";
import { drawDelta } from "../engine/robots.js";
import { BELT, BELT_Z, CYCLE, clock, EVENT, ease, HEADING, isReject, LINE_X, lerp, MOVE, SLOT, STOP_Y, SUB, trayIn } from "./ride1-line.js";
import { deltaShaft, drawCupScara, drawTiltArm } from "./ride1-robots.js";

export const CAGE = { x0: 18, x1: 26, y0: 39, y1: 56.75, dividers: [43.25, 47.75, 52.25] };
const GUARD = { post: "#8f9ba7", rail: "#6f7b87", panel: "#cde7f4", h: 1.85 };
const FEED_X0 = 15.3; // feed belts start behind the cage, in the prep area
const FEED_X1 = 22.95; // and end just short of the tray belt
const FEED_W = 0.55;
const FEED_V = 0.5; // m/s, ingredient belts never stop

/** Openings in the cage's back wall where feeds pass through: [y0, y1, top z]. */
const BACK_OPENINGS = [
	[39.35, 40.35, 1.0], // grape totes
	[46.2, 47.0, 1.15], // apple belt
	[55.2, 56.0, 1.15], // cheese belt
];

// Deterministic pseudo-random numbers for item placement.
const hash = (a, b) => {
	const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
	return x - Math.floor(x);
};

function frameAt(x, y, z, angle, s) {
	const ca = Math.cos(angle);
	const sa = Math.sin(angle);
	return (f, sd, zz = 0) => [x + (f * ca - sd * sa) * s, y + (f * sa + sd * ca) * s, z + zz * s];
}

/** Keyframed pose: frames [[u, [values...]], ...] eased between neighbors. */
function keyed(u, frames) {
	if (u <= frames[0][0]) return frames[0][1];
	for (let i = 1; i < frames.length; i++) {
		const [u1, v1] = frames[i];
		if (u <= u1) {
			const [u0, v0] = frames[i - 1];
			const k = ease((u - u0) / (u1 - u0 || 1));
			return v0.map((a, j) => lerp(a, v1[j], k));
		}
	}
	return frames[frames.length - 1][1];
}

// ---------------------------------------------------------------------------
// Guarding

function guardPanel(r, a, b, opts = {}) {
	const h = opts.h ?? GUARD.h;
	const z0 = opts.z0 ?? 0;
	r.quad(
		[
			[a[0], a[1], z0 + 0.12],
			[b[0], b[1], z0 + 0.12],
			[b[0], b[1], h],
			[a[0], a[1], h],
		],
		GUARD.panel,
		{ alpha: opts.alpha ?? 0.34, flat: true },
	);
	r.line([a[0], a[1], h], [b[0], b[1], h], GUARD.rail, 3);
	r.line([a[0], a[1], z0 + 0.12], [b[0], b[1], z0 + 0.12], GUARD.rail, 2.4);
	if (!opts.noPosts) for (const p of [a, b]) r.box(p[0] - 0.05, p[1] - 0.05, z0, 0.1, 0.1, h - z0 + 0.02, GUARD.post);
}

/** A wall across the line (y = const) with a small opening for the tray belt. */
function crossGuard(r, y, x0, x1) {
	guardPanel(r, [x0, y], [BELT[0] - 0.1, y]);
	guardPanel(r, [BELT[1] + 0.1, y], [x1, y]);
	guardPanel(r, [BELT[0] - 0.1, y], [BELT[1] + 0.1, y], { z0: 1.25, noPosts: true });
}

/** Short tunnel around the tray belt where it passes the cage wall, from y0 to y1. */
function beltTunnel(r, y0, y1) {
	const xa = BELT[0] - 0.14;
	const xb = BELT[1] + 0.04;
	const top = 1.3;
	r.box(xa, y0, BELT_Z - 0.12, 0.1, y1 - y0, top - BELT_Z + 0.12, "#c4ccd4", { alpha: 0.55 });
	r.box(xb, y0, BELT_Z - 0.12, 0.1, y1 - y0, top - BELT_Z + 0.12, GUARD.panel, { alpha: 0.4 });
	r.box(xa, y0, top, xb + 0.1 - xa, y1 - y0, 0.06, "#b8c0ca");
}

/** Cell door on the front wall, hinged at y0, with interlock switch, e-stop, and lockout switch. */
function cellDoor(r, x, y0, y1) {
	const h = GUARD.h;
	r.quad(
		[
			[x, y0, 0.12],
			[x, y1, 0.12],
			[x, y1, h - 0.04],
			[x, y0, h - 0.04],
		],
		GUARD.panel,
		{ alpha: 0.42, flat: true },
	);
	r.polyline(
		[
			[x, y0 + 0.04, 0.12],
			[x, y1 - 0.04, 0.12],
			[x, y1 - 0.04, h - 0.04],
			[x, y0 + 0.04, h - 0.04],
		],
		"#55616d",
		2.6,
		true,
	);
	r.box(x + 0.01, y1 - 0.2, 0.95, 0.06, 0.05, 0.22, "#55616d"); // handle
	r.box(x + 0.01, y1 + 0.02, 1.08, 0.08, 0.1, 0.14, PAL.safety); // interlock switch on the post
	// Emergency stop (yellow box, red mushroom) and lockout switch with its red handle.
	r.box(x + 0.02, y0 - 0.3, 1.18, 0.08, 0.18, 0.18, PAL.safety);
	r.cylinder(x + 0.13, y0 - 0.21, 1.25, 0.06, 0.05, "#d9483b", 8);
	r.box(x + 0.02, y0 - 0.62, 0.78, 0.1, 0.24, 0.3, "#8e98a4");
	r.box(x + 0.12, y0 - 0.52, 0.86, 0.06, 0.05, 0.14, "#d9483b");
}

export function buildCage(scene, ctx) {
	const g = ctx.group;
	const { x0, x1, y0, y1, dividers } = CAGE;
	// Back wall (behind the robots, static), with openings where the feeds come in.
	const cuts = [y0];
	for (const [a, b] of BACK_OPENINGS) cuts.push(a, b);
	cuts.push(y1);
	for (let i = 0; i < cuts.length - 1; i++) {
		const ya = cuts[i];
		const yb = cuts[i + 1];
		const opening = i % 2 === 1 ? BACK_OPENINGS[(i - 1) / 2] : null;
		if (opening) {
			object(scene, x0 - 0.05, ya, x0 + 0.05, yb, GUARD.h, (r) => guardPanel(r, [x0, ya], [x0, yb], { z0: opening[2], noPosts: true }), { group: g });
			continue;
		}
		for (let y = ya; y < yb - 0.01; y += 2.2) {
			const a = y;
			const b = Math.min(yb, y + 2.2);
			object(scene, x0 - 0.05, a, x0 + 0.05, b, GUARD.h, (r) => guardPanel(r, [x0, a], [x0, b]), { group: g });
		}
	}
	// Front wall with one interlocked door per cell, dividers, and end walls interleave with the
	// moving robots: live items.
	const ys = [y0, ...dividers, y1];
	for (let i = 0; i < ys.length - 1; i++) {
		const ya = ys[i];
		const yb = ys[i + 1];
		const mid = (ya + yb) / 2;
		const d0 = mid - 0.6;
		const d1 = mid + 0.6;
		for (const [a, b] of [
			[ya, d0],
			[d1, yb],
		])
			scene.add({ group: g, live: true, bounds: [x1 - 0.05, a, 0, x1 + 0.05, b, GUARD.h], depth: x1 + (a + b) / 2 + 0.6, draw: (r) => guardPanel(r, [x1, a], [x1, b]) });
		scene.add({ group: g, live: true, bounds: [x1 - 0.05, d0 - 0.7, 0, x1 + 0.2, d1 + 0.1, GUARD.h], depth: x1 + mid + 0.6, draw: (r) => cellDoor(r, x1, d0, d1) });
	}
	for (const y of ys)
		scene.add({ group: g, live: true, bounds: [x0, y - 0.05, 0, x1, y + 0.05, GUARD.h], depth: LINE_X + y + 0.3, draw: (r) => crossGuard(r, y, x0, x1) });
	// Tunnels where the tray belt enters and leaves the cage.
	scene.add({ group: g, live: true, bounds: [BELT[0] - 0.2, y0 - 0.7, 0, BELT[1] + 0.2, y0, 1.4], depth: LINE_X + y0 + 0.4, draw: (r) => beltTunnel(r, y0 - 0.7, y0) });
	scene.add({ group: g, live: true, bounds: [BELT[0] - 0.2, y1, 0, BELT[1] + 0.2, y1 + 0.7, 1.4], depth: LINE_X + y1 + 1.0, draw: (r) => beltTunnel(r, y1, y1 + 0.7) });
}

// ---------------------------------------------------------------------------
// Shared feed pieces

/** Flat belt along x from x0 to x1 at y, top at BELT_Z. */
function feedBelt(r, x0, x1, y) {
	const w = FEED_W;
	for (let x = x0 + 0.3; x < x1; x += 1.6) r.box(x, y - w / 2 + 0.05, 0, 0.1, 0.1, BELT_Z - 0.14, PAL.dark);
	r.box(x0, y - w / 2, BELT_Z - 0.14, x1 - x0, w, 0.12, PAL.metal);
	r.ground(x0, y - w / 2 + 0.05, x1 - x0, w - 0.1, "#3a3f47", BELT_Z - 0.015);
	r.box(x0, y - w / 2 - 0.05, BELT_Z - 0.05, x1 - x0, 0.06, 0.1, PAL.steel);
	r.box(x0, y + w / 2 - 0.01, BELT_Z - 0.05, x1 - x0, 0.06, 0.1, PAL.steel);
}

/** Camera hood over a feed belt, with a light bar: items are seen here before the robot picks. */
function cameraHood(r, x0, x1, y) {
	const w = FEED_W + 0.16;
	const top = BELT_Z + 0.42;
	r.box(x0, y - w / 2, BELT_Z - 0.08, 0.06, w, top - BELT_Z + 0.08, "#c4ccd4");
	r.box(x1 - 0.06, y - w / 2, BELT_Z - 0.08, 0.06, w, top - BELT_Z + 0.08, "#c4ccd4");
	r.box(x0, y - w / 2, top, x1 - x0, w, 0.12, "#2f6fb3", { top: "#3d7fd1" });
	r.box((x0 + x1) / 2 - 0.12, y - 0.12, top + 0.12, 0.24, 0.24, 0.16, PAL.dark);
	r.box(x1 - 0.02, y - w / 2 + 0.05, BELT_Z + 0.08, 0.02, w - 0.1, 0.06, "#fff6c8");
}

/** Encoder wheel riding on the belt edge: it counts belt travel for conveyor tracking. */
function encoder(r, x, y) {
	r.box(x - 0.04, y - 0.06, 0, 0.08, 0.08, BELT_Z + 0.12, PAL.steel);
	r.box(x - 0.08, y - 0.1, BELT_Z + 0.1, 0.16, 0.12, 0.1, PAL.dark);
	r.tube([x, y - 0.02, BELT_Z + 0.05], [x, y + 0.06, BELT_Z + 0.05], 0.06, "#55616d", 10);
}

// ---------------------------------------------------------------------------
// Grapes: six-axis arm, soft fingers, bunches lying at random angles in a tote

const GRAPE = {
	base: [22.6, 41.4],
	baseZ: 0.22,
	tote: { x0: 22.0, y0: 39.475, w: 0.9, d: 0.75, z: 0.45, h: 0.24 },
	queue: [15.55, 16.6],
	convY: 39.85,
	scale: 1.3,
};

/** Pickable bunch spots in the pick tote: offset from the tote center and lying angle. */
const BUNCH_SPOTS = [
	[-0.2, -0.14, 0.5],
	[0.18, -0.12, 2.4],
	[-0.16, 0.16, -0.7],
	[0.2, 0.17, 1.5],
];
/** Bunches underneath, never picked in the drawing (the tote is tangled, not tidy). */
const UNDER_SPOTS = [
	[0.0, 0.0, 1.1],
	[-0.05, -0.2, -2.2],
];

function toteBox(r, x0, y0, w, d, z, h, part) {
	const c = "#2f6fb3";
	const t = 0.04;
	if (part !== "front") {
		r.box(x0, y0, z, w, d, 0.03, shade(c, 0.7));
		r.box(x0, y0, z, t, d, h, c);
		r.box(x0, y0, z, w, t, h, c);
	}
	if (part !== "back") {
		r.box(x0 + w - t, y0, z, t, d, h, c);
		r.box(x0, y0 + d - t, z, w, t, h, c);
	}
}

function bunchAt(r, cx, cy, z, spot) {
	const [u, v, a] = spot;
	drawGrapes(r, frameAt(cx + u, cy + v, z, a, 1), 1, 0.8);
}

/** Where the fingers close on a lying bunch: its stem end. */
function stemOf(cx, cy, z, spot) {
	const [u, v, a] = spot;
	const at = frameAt(cx + u, cy + v, z, a, 1);
	return at(-0.19, 0.01, 0.08);
}

const CONV_X1 = 22.95;

function buildGrapeCell(scene, ctx, T) {
	const g = ctx.group;
	const { tote, convY } = GRAPE;
	const tc = [tote.x0 + tote.w / 2, tote.y0 + tote.d / 2];
	const floorZ = tote.z + 0.03;
	// Roller conveyor that brings full totes in from the prep area through the back wall.
	object(
		scene,
		FEED_X0,
		convY - 0.45,
		CONV_X1,
		convY + 0.45,
		0.6,
		(r) => {
			const y0 = convY - 0.45;
			for (let x = FEED_X0 + 0.2; x < CONV_X1 - 0.05; x += 1.5) {
				r.box(x, y0 + 0.04, 0, 0.08, 0.08, tote.z - 0.05, PAL.dark);
				r.box(x, y0 + 0.78, 0, 0.08, 0.08, tote.z - 0.05, PAL.dark);
			}
			r.box(FEED_X0, y0, tote.z - 0.1, CONV_X1 - FEED_X0, 0.06, 0.12, PAL.steel);
			for (let x = FEED_X0 + 0.1; x < CONV_X1 - 0.05; x += 0.22) r.line([x, y0 + 0.08, tote.z - 0.02], [x, y0 + 0.82, tote.z - 0.02], "#9aa5b1", 1.6);
			r.box(FEED_X0, y0 + 0.84, tote.z - 0.1, CONV_X1 - FEED_X0, 0.06, 0.12, PAL.steel);
			r.box(CONV_X1 - 0.05, y0, tote.z - 0.1, 0.06, 0.9, 0.3, PAL.steel); // end stop
			// Full totes waiting their turn outside the guard.
			for (const qx of GRAPE.queue) {
				toteBox(r, qx, tote.y0, tote.w, tote.d, tote.z, tote.h, "back");
				for (const s of UNDER_SPOTS) bunchAt(r, qx + tote.w / 2, tc[1], floorZ, s);
				for (const s of BUNCH_SPOTS) bunchAt(r, qx + tote.w / 2, tc[1], floorZ + 0.02, s);
				toteBox(r, qx, tote.y0, tote.w, tote.d, tote.z, tote.h, "front");
			}
		},
		{ group: g },
	);
	// Arm pedestal and the camera that finds a rough center point on a bunch.
	const mast = [21.45, 40.55];
	object(
		scene,
		21.3,
		39.6,
		23.1,
		41.9,
		2.4,
		(r) => {
			r.box(GRAPE.base[0] - 0.48, GRAPE.base[1] - 0.48, 0, 0.96, 0.96, GRAPE.baseZ, PAL.steel);
			r.box(mast[0] - 0.06, mast[1] - 0.06, 0, 0.12, 0.12, 2.2, PAL.steel);
			r.beam([mast[0], mast[1], 2.16], [tc[0], tc[1], 2.16], 0.08, 0.08, PAL.steel);
			r.box(tc[0] - 0.12, tc[1] - 0.1, 1.94, 0.24, 0.2, 0.18, PAL.dark);
			r.cylinder(tc[0], tc[1], 1.9, 0.07, 0.05, "#111418", 8);
		},
		{ group: g },
	);
	// The pick tote: a bunch leaves its spot when the fingers close on it.
	scene.addDynamic({
		group: g,
		depth: LINE_X + CAGE.y0 + 0.4,
		bounds: [tote.x0 - 0.1, tote.y0 - 0.1, 0, tote.x0 + tote.w + 0.1, tote.y0 + tote.d + 0.1, 1],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			const picked = u >= 1.1 ? ((n % 4) + 4) % 4 : -1;
			toteBox(r, tote.x0, tote.y0, tote.w, tote.d, tote.z, tote.h, "back");
			for (const s of UNDER_SPOTS) bunchAt(r, tc[0], tc[1], floorZ, s);
			BUNCH_SPOTS.forEach((s, i) => {
				if (i !== picked) bunchAt(r, tc[0], tc[1], floorZ + 0.02, s);
			});
			toteBox(r, tote.x0, tote.y0, tote.w, tote.d, tote.z, tote.h, "front");
		},
	});
	// The arm: reach in with the wrist tilted, close the fingers on the stem, lift, place in the
	// still tray, release, and go back over the next bunch.
	const yc = STOP_Y.grapes;
	const place = [LINE_X + 0.1, yc - 0.15, BELT_Z + 0.36];
	const spotKey = (n) => {
		const s = BUNCH_SPOTS[((n % 4) + 4) % 4];
		const p = stemOf(tc[0], tc[1], floorZ + 0.02, s);
		return { p, roll: s[2] };
	};
	scene.addDynamic({
		group: g,
		depth: LINE_X + yc + 0.2,
		bounds: [20.4, yc - 2, 0, 25, yc + 1.5, 2.6],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			const cur = spotKey(n);
			const next = spotKey(n + 1);
			// [x, y, z, tilt, grip, roll]
			const above = (k, z) => [k.p[0], k.p[1], z, 0, 1, k.roll];
			const pose = keyed(u, [
				[0, above(cur, 1.25)],
				[0.8, [cur.p[0], cur.p[1], cur.p[2], 0.5, 1, cur.roll]],
				[1.1, [cur.p[0], cur.p[1], cur.p[2], 0.5, 0, cur.roll]],
				[1.8, [cur.p[0], cur.p[1], 1.35, 0, 0, cur.roll]],
				[2.9, [place[0], place[1], 1.5, 0, 0, HEADING]],
				[3.4, [place[0], place[1], place[2], 0, 0, HEADING]],
				[EVENT.grapes, [place[0], place[1], place[2], 0, 1, HEADING]],
				[4.2, [place[0], place[1], 1.5, 0, 1, HEADING]],
				[5.3, above(next, 1.25)],
			]);
			const [x, y, z, tilt, grip, roll] = pose;
			const tip = drawTiltArm(r, GRAPE.base[0], GRAPE.base[1], [x, y, z], { scale: GRAPE.scale, z: GRAPE.baseZ, tilt, grip: 0.15 + grip * 0.85, roll });
			if (u >= 1.1 && u < EVENT.grapes) drawHangingBunch(r, tip[0], tip[1], tip[2] - 0.02, 0, 0.85);
		},
	});
}

// ---------------------------------------------------------------------------
// Apples and cheese: delta robots over belts that never stop (camera plus encoder tracking)

const DELTA = {
	apples: { beltY: 46.6, count: 4, colors: undefined, item: "apple" },
	cheese: { beltY: 55.6, count: 3, colors: { body: "#dfe5ea", accent: "#9fb0bf" }, item: "cheese" },
};
const DSCALE = 1.3;
const CUP = 0.14 * DSCALE; // platform to cup lip
const PICK_X = 22.3;
const HOVER = 1.5;

function drawItem(r, kind, x, y, z, rot) {
	if (kind === "apple") drawAppleSlice(r, frameAt(x, y, z - 0.055, 0, 1), 0, 0, rot, 1, 1);
	else drawCheeseWedge(r, frameAt(x, y, z - 0.055, 0, 1), 0, 0, rot, 1);
}
const itemH = (kind) => (kind === "apple" ? 0.03 : 0.055);

function buildDeltaCell(scene, ctx, T, id) {
	const g = ctx.group;
	const cfg = DELTA[id];
	const yc = STOP_Y[id];
	const by = cfg.beltY;
	const cx = 23.2;
	const cy = (yc + by) / 2;
	const top = 2.85;
	const posts = [
		[21.55, yc - 1.5],
		[24.95, yc - 1.5],
		[21.55, yc + 1.6],
		[24.95, yc + 1.6],
	];
	const H = itemH(cfg.item);
	// One pick per sub-cycle during the dwell; the cheese tray that will be rejected misses its last wedge.
	const pickOf = (n, i) => ({
		sd: (hash(n, i + (id === "cheese" ? 7 : 0)) - 0.5) * 0.28,
		rot: hash(i, n) * Math.PI * 2,
		miss: id === "cheese" && i === 2 && isReject(trayIn(SLOT.cheese, n)),
		tau: n * CYCLE + MOVE + i * SUB.delta + 0.15,
	});
	const placeOf = (i) => (id === "apples" ? [LINE_X + 0.1, yc + 0.06 + i * 0.055] : [LINE_X - 0.1, yc + 0.08 + i * 0.07]);
	const pickZ = BELT_Z + H + CUP;
	const placeZ = BELT_Z + 0.055 + H + CUP;

	object(
		scene,
		FEED_X0,
		by - 0.4,
		FEED_X1,
		by + 0.4,
		1,
		(r) => {
			feedBelt(r, FEED_X0, FEED_X1, by);
			encoder(r, 20.9, by - FEED_W / 2 - 0.1);
		},
		{ group: g },
	);
	// Items riding the belt toward the robot.
	scene.addDynamic({
		group: g,
		depth: (FEED_X0 + FEED_X1) / 2 + by,
		bounds: [FEED_X0, by - 0.4, BELT_Z, FEED_X1, by + 0.4, BELT_Z + 0.1],
		animated: () => true,
		draw: (r, t0) => {
			const t = T(t0);
			const { n } = clock(t);
			const span = (PICK_X - FEED_X0) / FEED_V;
			for (let k = n - 1; k <= n + Math.ceil(span / CYCLE) + 1; k++) {
				for (let i = 0; i < cfg.count; i++) {
					const p = pickOf(k, i);
					if (p.miss || t >= p.tau) continue;
					const x = PICK_X + FEED_V * (t - p.tau);
					if (x < FEED_X0 + 0.15) continue;
					drawItem(r, cfg.item, x, by + p.sd, BELT_Z, p.rot);
				}
			}
		},
	});
	scene.add({ group: g, live: true, bounds: [19.3, by - 0.4, 0, 20.1, by + 0.4, 1.6], depth: 20.1 + by + 0.4, draw: (r) => cameraHood(r, 19.3, 20.1, by) });
	scene.addDynamic({
		group: g,
		depth: LINE_X + yc + 0.2,
		bounds: [21.3, yc - 1.8, 0, 25.3, yc + 1.9, 3.2],
		animated: () => true,
		draw: (r, t0) => {
			const t = T(t0);
			const { n, u } = clock(t);
			// Which sub-cycle, and the next pick (for hovering).
			const i = Math.floor((u - MOVE) / SUB.delta);
			const active = u >= MOVE && i < cfg.count;
			const w = active ? u - MOVE - i * SUB.delta : 0;
			const nextPick = active ? (i + 1 < cfg.count ? pickOf(n, i + 1) : pickOf(n + 1, 0)) : u < MOVE ? pickOf(n, 0) : pickOf(n + 1, 0);
			const hover = (p) => [PICK_X - FEED_V * 0.15, by + p.sd, HOVER];
			let plat = hover(nextPick);
			let held = null;
			if (active) {
				const p = pickOf(n, i);
				const [px, py] = placeOf(i);
				const track = (ww) => [PICK_X + FEED_V * (ww - 0.15), by + p.sd];
				const frames = [
					[0, [...track(0), HOVER]],
					[0.15, [...track(0.15), pickZ]],
					[0.25, [...track(0.25), pickZ + 0.02]],
					[0.5, [px, py, placeZ + 0.25]],
					[0.75, [px, py, placeZ]],
					[1.25, hover(nextPick)],
				];
				// Tracking: while the cup is down it moves with the belt, so follow it exactly.
				plat = w <= 0.25 ? [...track(w), keyed(w, frames)[2]] : keyed(w, frames);
				if (!p.miss && w >= 0.15 && w < 0.75) held = p;
			}
			r.box(posts[0][0], posts[0][1], 0, 0.15, 0.15, top + 0.1, PAL.steel);
			r.box(posts[1][0], posts[1][1], 0, 0.15, 0.15, top + 0.1, PAL.steel);
			r.box(21.55, yc - 1.5, top, 3.55, 0.15, 0.15, PAL.steel);
			r.box(21.55, yc - 1.5, top, 0.15, 3.25, 0.15, PAL.steel);
			r.box(cx - 0.6, cy - 0.6, top - 0.02, 1.2, 1.2, 0.12, "#7f8b98");
			deltaShaft(r, cx, cy, top, plat, DSCALE);
			drawDelta(r, cx, cy, top, plat, { scale: DSCALE, colors: cfg.colors });
			if (held) drawItem(r, cfg.item, plat[0], plat[1], plat[2] - CUP - H, held.rot);
			r.box(posts[2][0], posts[2][1], 0, 0.15, 0.15, top + 0.1, PAL.steel);
			r.box(posts[3][0], posts[3][1], 0, 0.15, 0.15, top + 0.1, PAL.steel);
			r.box(24.95, yc - 1.5, top, 0.15, 3.25, 0.15, PAL.steel);
			r.box(21.55, yc + 1.6, top, 3.55, 0.15, 0.15, PAL.steel);
		},
	});
}

// ---------------------------------------------------------------------------
// Crackers: SCARA with a bellows vacuum cup taking flat packs off a stack feeder

const SCARA = { base: [22.75, 50.95], baseZ: 0.22, scale: 1.45, mag: [22.45, 49.45], magZ: 0.7, packs: 10 };
const PACK_H = 0.036;

function packStack(r, x, y, z0, count) {
	for (let i = 0; i < count; i++) drawCrackerPack(r, frameAt(x, y, z0 + i * PACK_H - 0.055, 0, 1), 0, 0, HEADING, 1);
}

function buildCrackerCell(scene, ctx, T) {
	const g = ctx.group;
	const yc = STOP_Y.crackers;
	const [mx, my] = SCARA.mag;
	const stackTop = SCARA.magZ + SCARA.packs * PACK_H;
	object(
		scene,
		mx - 0.4,
		my - 0.4,
		SCARA.base[0] + 0.5,
		SCARA.base[1] + 0.5,
		1.4,
		(r) => {
			r.box(SCARA.base[0] - 0.55, SCARA.base[1] - 0.55, 0, 1.1, 1.1, SCARA.baseZ, PAL.steel);
			// Feeder: a stainless cabinet with a magazine of packs and four guide rods.
			r.box(mx - 0.3, my - 0.3, 0, 0.6, 0.6, SCARA.magZ, "#c4ccd4", { top: "#d5dbe1" });
			r.box(mx + 0.3, my - 0.18, 0.35, 0.01, 0.36, 0.2, "#1f3a52");
		},
		{ group: g },
	);
	scene.addDynamic({
		group: g,
		depth: mx + my + 0.3,
		bounds: [mx - 0.2, my - 0.2, SCARA.magZ, mx + 0.2, my + 0.2, stackTop + 0.3],
		animated: () => true,
		draw: (r, t0) => {
			const { u } = clock(T(t0));
			const i = Math.floor((u - MOVE) / SUB.scara);
			const w = u - MOVE - i * SUB.scara;
			const holding = u >= MOVE && i < 2 && w >= 0.3 && w < 0.95;
			const rods = [
				[-0.06, -0.1],
				[0.06, -0.1],
			];
			for (const [dx, dy] of rods) r.box(mx + dx - 0.012, my + dy - 0.012, SCARA.magZ, 0.024, 0.024, 0.55, PAL.steel);
			packStack(r, mx, my, SCARA.magZ, SCARA.packs - (holding && w < 0.5 ? 1 : 0));
			for (const [dx, dy] of rods) r.box(mx + dx - 0.012, my - dy - 0.012, SCARA.magZ, 0.024, 0.024, 0.55, PAL.steel);
		},
	});
	scene.addDynamic({
		group: g,
		depth: LINE_X + yc + 0.2,
		bounds: [21.5, yc - 1.4, 0, 25, yc + 1.6, 2.6],
		animated: () => true,
		draw: (r, t0) => {
			const { u } = clock(T(t0));
			const i = Math.floor((u - MOVE) / SUB.scara);
			const active = u >= MOVE && i < 2;
			const w = active ? u - MOVE - i * SUB.scara : 0;
			const placeOf = (k) => [LINE_X - 0.06 - k * 0.075, yc - 0.15];
			const hoverZ = stackTop + 0.3;
			let pose = [mx, my, hoverZ];
			if (active) {
				const [px, py] = placeOf(i);
				pose = keyed(w, [
					[0, [mx, my, hoverZ]],
					[0.3, [mx, my, stackTop]],
					[0.5, [mx, my, hoverZ]],
					[0.8, [px, py, BELT_Z + 0.25]],
					[0.95, [px, py, BELT_Z + 0.09]],
					[1.1, [px, py, BELT_Z + 0.25]],
					[1.5, [mx, my, hoverZ]],
				]);
			}
			const tip = drawCupScara(r, SCARA.base[0], SCARA.base[1], [pose[0], pose[1]], pose[2], { scale: SCARA.scale, z: SCARA.baseZ });
			if (active && w >= 0.3 && w < 0.95) drawCrackerPack(r, frameAt(tip[0], tip[1], tip[2] - PACK_H - 0.055, 0, 1), 0, 0, HEADING, 1);
		},
	});
}

export function buildCells(scene, ctx, T) {
	buildGrapeCell(scene, ctx, T);
	buildDeltaCell(scene, ctx, T, "apples");
	buildCrackerCell(scene, ctx, T);
	buildDeltaCell(scene, ctx, T, "cheese");
}

