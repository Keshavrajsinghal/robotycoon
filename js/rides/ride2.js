// Ride 2, The signal: one grape-bunch pick, followed as a signal from the photo-eye to the soft
// fingers. The zone is an oversized model of the grape pick station spread out like a park: the
// tray conveyor with its photo-eye and the line PLC, then the grape tote under fixed lights and a
// structured light camera, along the front; the vision computer
// pods on the classical branch, the neural-network pavilion on the learned branch (a diagonal
// shortcut across the loop), the controller and drive cabinets, a giant cut-open joint, and the
// big six-axis arm placing a bunch in a tray. Drawing code only: every word on screen comes
// from content.

import { loadCss } from "../core/dom.js";
import { drawGrapes, drawHangingBunch, drawPlate, FOOD } from "../engine/food.js";
import { shade } from "../engine/iso.js";
import { drawBench, drawFlowers, drawLamp, drawTree, groundPoly, object, PAL } from "../engine/park.js";
import { dip, drawSixAxis, shuttle } from "../engine/robots.js";
import { Track } from "../engine/track.js";
import { drawCargo, SIGNAL } from "./ride2-cargo.js";
import { mountCloseup } from "./ride2-closeup.js";
import { buildJointSculpture, buildPavilion } from "./ride2-stations.js";

const COLOR = PAL.ride.ride2;
const BELT_Z = 0.85;

/**
 * Track positions of the stops (fixed ids from ARCHITECTURE.md). The cart tag sits centered
 * above the cart, so at the pods and at the tray the cart stops just past the station: the pod's
 * screen, or the bunch going into the tray, then shows beside the tag instead of under it.
 */
export const STOP_AT = {
	trigger: [57.5, 31],
	light: [61.3, 31],
	sensor: [68.2, 31],
	detection: [71, 14.7],
	"position-3d": [71, 9.8],
	grasp: [64.5, 7],
	trajectory: [60, 7],
	"joint-targets": [55.5, 7],
	policy: [66, 22],
	drive: [46, 11.5],
	joint: [46, 17.5],
	"arm-motion": [46, 24],
	gripper: [46, 26.2],
};

const FORK = [71, 28.5];
const MERGE = [50.5, 7];
const PREFIX = [[51.8, 31], [54.2, 31], "trigger", "light", "sensor", [69.3, 30.95], [70.45, 30.25], FORK];
const CLASSICAL = [[71, 25.5], "detection", "position-3d", [71, 8.8], [70.47, 7.53], [69.2, 7], "grasp", "trajectory", "joint-targets", [54, 7]];
const LEARNED = [[70.7, 26.6], [69.6, 25.1], [68, 24], "policy", [63.6, 19.6], [61.2, 17.2], [58.8, 14.8], [56.4, 12.4], [54.4, 10.2], [52.8, 8.2]];
const SUFFIX = [MERGE, [48, 7], [46.6, 7.6], [46, 9], "drive", "joint", "arm-motion", "gripper", [46, 29.6], [46.6, 30.6], [47.9, 31], [49.2, 31]];

const pt = (p) => (typeof p === "string" ? STOP_AT[p] : p);

// Tray conveyor at the trigger. The belt indexes: it moves for TRAY_MOVE s of every TRAY_CYCLE s,
// then holds a tray in the photo-eye's beam (animation timing, much faster than the real line).
const TRAYC = { x0: 54.4, x1: 59.6, y: 28, w: 0.9 };
const TRAY_PITCH = 1.5;
const TRAY_CYCLE = 3.6;
const TRAY_MOVE = 1.2;

/** Vision computer pods (classical). face: which side carries the screen (toward the track). */
const PODS = {
	detection: { x: 66.6, y: 15.3, w: 2.4, d: 2.4, face: "x" },
	"position-3d": { x: 66.6, y: 10.3, w: 2.4, d: 2.4, face: "x" },
	grasp: { x: 65.3, y: 3.1, w: 2.4, d: 2.4, face: "y" },
	trajectory: { x: 60.8, y: 3.1, w: 2.4, d: 2.4, face: "y" },
	"joint-targets": { x: 56.3, y: 3.1, w: 2.4, d: 2.4, face: "y" },
};
const POD_H = 2.3;

// Arm station on the west side.
const ARM = { base: [40.6, 25.6], scale: 3.0, pick: [41.6, 21.85], place: [44.3, 27.6], period: 4.4 };
const TRAYS = { x: 44.3, y0: 25.3, y1: 30.4, pitch: 1.2 };
const PICK_TOTE = [40.5, 20.8, 42.7, 22.9];
const PICK_BUNCHES = [
	[41.0, 21.25, 0.8],
	[42.2, 21.3, 2.2],
	[41.0, 22.45, -0.5],
	[42.2, 22.45, 1.1],
];
const PICK_CAM = { post: [40.1, 20.4], cam: [41.6, 21.85, 3.6] };
const BUNCH = 1.8; // hanging bunch scale at the arm
const HANG = 0.34; // a hanging bunch's length below its stem, per unit of scale

/** Where the camera looks next to each stop: the station that changes the cargo there. */
const FOCUS = {
	trigger: [57.5, 27.4],
	light: [62.9, 28.4],
	sensor: [64.7, 28.4],
	detection: [68.6, 16.5],
	"position-3d": [68.6, 11.5],
	grasp: [66.5, 5.2],
	trajectory: [62, 5.2],
	"joint-targets": [57.5, 5.2],
	policy: [64.4, 20.4],
	drive: [42.6, 11.3],
	joint: [43, 17.6],
	"arm-motion": [42.6, 24.6],
	gripper: [44.5, 27.6],
};

// ---------------------------------------------------------------------------
// Track

function buildPoints(mode) {
	const seq = [...PREFIX, ...(mode === "learned" ? LEARNED : CLASSICAL), ...SUFFIX];
	const points = [];
	const stops = {};
	for (const p of seq) {
		if (typeof p === "string") stops[p] = points.length;
		points.push(pt(p));
	}
	return { points, stops };
}

/** Rails of the branch the current mode does not ride, drawn greyed so the fork reads. */
function drawSpur(scene, ctx, learned) {
	const branch = (learned ? CLASSICAL : LEARNED).map(pt);
	new Track({ points: [FORK, ...branch, MERGE], stops: {} }).draw(scene, { group: ctx.group, rail: "#9aa2ac", railHi: "#dfe3e7", tie: "#b3a998" });
}

/** A flat colored bed under a branch (classical steel blue, learned violet), in ~2 m pieces. */
function branchBed(scene, ctx, pts, color, half) {
	const t = new Track({ points: pts, stops: {} });
	const S = t.samples;
	const CH = 10;
	for (let i0 = 0; i0 < S.length - 1; i0 += CH) {
		const i1 = Math.min(S.length - 1, i0 + CH);
		const left = [];
		const right = [];
		for (let k = i0; k <= i1; k++) {
			const a = S[Math.max(0, k - 1)];
			const b = S[Math.min(S.length - 1, k + 1)];
			const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
			const nx = -(b[1] - a[1]) / l;
			const ny = (b[0] - a[0]) / l;
			left.push([S[k][0] + nx * half, S[k][1] + ny * half]);
			right.push([S[k][0] - nx * half, S[k][1] - ny * half]);
		}
		groundPoly(scene, [...left, ...right.reverse()], color, { group: ctx.group, depth: -60, z: 0.018 });
	}
}

// ---------------------------------------------------------------------------
// Station: boarding platform near the entry

function buildPlatform(scene, ctx) {
	groundPoly(
		scene,
		[
			[48.2, 31.6],
			[52.8, 31.6],
			[52.8, 34.2],
			[48.2, 34.2],
		],
		PAL.plaza,
		{ group: ctx.group, depth: -55, z: 0.02 },
	);
	// The cart finishes right behind this platform, so everything next to the track stays low
	// (a roof here would sit in front of the parked cart). The tall sign stands off to the west.
	object(
		scene,
		48.6,
		31.65,
		52.0,
		33.5,
		1.0,
		(r) => {
			r.box(48.6, 31.65, 0, 3.4, 1.8, 0.28, "#cfc8bb", { top: "#ddd6c9" });
			r.box(48.6, 31.65, 0.28, 3.4, 0.1, 0.01, PAL.safety);
			for (const x of [48.7, 50.25, 51.8]) r.box(x, 33.28, 0.28, 0.08, 0.08, 0.7, PAL.dark);
			r.box(48.7, 33.28, 0.95, 3.18, 0.08, 0.07, COLOR);
		},
		{ group: ctx.group },
	);
	scene.add({
		group: ctx.group,
		live: true,
		bounds: [47.2, 32.6, 0, 48.0, 33.4, 3.4],
		draw: (r) => {
			r.box(47.3, 32.7, 0, 0.6, 0.6, 0.18, PAL.stone);
			r.cylinder(47.6, 33.0, 0.18, 0.09, 2.3, PAL.dark, 8);
			r.cylinder(47.6, 33.0, 2.45, 0.42, 0.16, COLOR, 14);
			r.cylinder(47.6, 33.0, 2.61, 0.3, 0.06, PAL.white, 14);
			r.sphere(47.6, 33.0, 2.95, 0.16, PAL.safety, 1);
		},
	});
	// Benches and lamps along the front strip (low, so they never hide the cart).
	for (const [x, y] of [
		[55.4, 33.4],
		[63.2, 33.4],
	])
		object(scene, x, y, x + 1.4, y + 0.45, 0.8, (r) => drawBench(r, x, y, true), { group: ctx.group });
	for (const [x, y] of [
		[59.4, 34.7],
		[67.2, 34.7],
	])
		object(scene, x - 0.15, y - 0.15, x + 0.15, y + 0.15, 2.9, (r) => drawLamp(r, x, y), { group: ctx.group });
	object(scene, 69.4, 32.4, 71.9, 34.6, 0.6, (r) => drawFlowers(r, 69.4, 32.4, 2.5, 2.2, 202), { group: ctx.group });
}

// ---------------------------------------------------------------------------
// Front stretch: the tray conveyor with its photo-eye and the line PLC (trigger), then the grape
// tote under fixed lights (light) and a structured light camera fixed above it (sensor)

function conveyorPiece(r, x0, x1) {
	const { y, w } = TRAYC;
	const y0 = y - w / 2;
	for (const x of [x0 + 0.15, x1 - 0.27]) {
		r.box(x, y0 + 0.06, 0, 0.12, 0.1, BELT_Z - 0.12, PAL.dark);
		r.box(x, y0 + w - 0.16, 0, 0.12, 0.1, BELT_Z - 0.12, PAL.dark);
	}
	r.box(x0, y0, BELT_Z - 0.16, x1 - x0, w, 0.14, PAL.metal);
	r.ground(x0, y0 + 0.07, x1 - x0, w - 0.14, "#3a3f47", BELT_Z - 0.01);
	r.box(x0, y0 - 0.04, BELT_Z - 0.06, x1 - x0, 0.09, 0.12, PAL.steel);
	r.box(x0, y0 + w - 0.05, BELT_Z - 0.06, x1 - x0, 0.09, 0.12, PAL.steel);
}

/** A thin cable lying on the ground along an axis-aligned polyline. */
function cable(scene, group, pts, color = "#59616b", half = 0.035) {
	for (let i = 0; i < pts.length - 1; i++) {
		const [ax, ay] = pts[i];
		const [bx, by] = pts[i + 1];
		groundPoly(
			scene,
			[
				[Math.min(ax, bx) - half, Math.min(ay, by) - half],
				[Math.max(ax, bx) + half, Math.min(ay, by) - half],
				[Math.max(ax, bx) + half, Math.max(ay, by) + half],
				[Math.min(ax, bx) - half, Math.max(ay, by) + half],
			],
			color,
			{ group, depth: -50, z: 0.022 },
		);
	}
}

/** Seconds into the current tray cycle (the belt indexes: it moves, then stops for the pick). */
const cyclePhase = (t) => ((t % TRAY_CYCLE) + TRAY_CYCLE) % TRAY_CYCLE;

/** Tray centers on the tray conveyor at time t: at rest one tray sits in the photo-eye's beam. */
function trayXs(t) {
	const k = Math.floor(t / TRAY_CYCLE) + smooth(Math.min(1, cyclePhase(t) / TRAY_MOVE));
	const f = k - Math.floor(k);
	const out = [];
	for (let m = -4; m <= 3; m++) {
		const x = STOP_AT.trigger[0] + (m + f) * TRAY_PITCH;
		if (x > TRAYC.x0 - 0.3 && x < TRAYC.x1) out.push(x);
	}
	return out;
}

/** Seconds since a tray last blocked the beam (0 while the beam is clear). */
function trayInPlaceFor(t) {
	const x = STOP_AT.trigger[0];
	const blocked = (tt) => trayXs(tt).some((cx) => Math.abs(cx - x) < 0.4);
	if (!blocked(t)) return 0;
	let s = 0.05;
	while (s < TRAY_CYCLE && blocked(t - s)) s += 0.05;
	return s;
}

const smooth = (v) => v * v * (3 - 2 * v);

/** A grape bunch lying on its side, centered near (x, y) on a surface at z; S scales it. */
export function lyingBunch(r, x, y, z, S, lw = 0.6) {
	drawGrapes(r, (f, sd, zz = 0) => [x + (f + 0.05) * S, y + sd * S, z + zz * S], S, lw);
}

/** A grape bunch lying at angle a (radians about z) centered near (x, y) on a surface at z. */
function bunchAt(r, x, y, z, a, S, lw = 0.6) {
	const c = Math.cos(a);
	const s = Math.sin(a);
	drawGrapes(r, (f, sd, zz = 0) => [x + ((f + 0.05) * c - sd * s) * S, y + ((f + 0.05) * s + sd * c) * S, z + zz * S], S, lw);
}

/** A blue grape tote heaped with bunches lying at random angles; bunches = [[x, y, angle]]. */
function drawTote(r, x0, y0, w, d, h, bunches, S) {
	r.box(x0, y0, 0, w, d, 0.12, PAL.dark);
	r.box(x0, y0, 0.12, w, d, h - 0.12, "#2f6fb3", { top: "#1f4f86" });
	// Hand holds on the two faces the viewer sees.
	const z0 = h * 0.6;
	const z1 = h * 0.78;
	const fy = y0 + d + 0.005;
	const fx = x0 + w + 0.005;
	r.quad(
		[
			[x0 + w * 0.36, fy, z0],
			[x0 + w * 0.64, fy, z0],
			[x0 + w * 0.64, fy, z1],
			[x0 + w * 0.36, fy, z1],
		],
		"#1f4f86",
		{ flat: true },
	);
	r.quad(
		[
			[fx, y0 + d * 0.36, z0],
			[fx, y0 + d * 0.64, z0],
			[fx, y0 + d * 0.64, z1],
			[fx, y0 + d * 0.36, z1],
		],
		"#1f4f86",
		{ flat: true },
	);
	const sorted = [...bunches].sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
	for (const [x, y, a] of sorted) bunchAt(r, x, y, h - 0.03, a, S, 0.55);
}

function buildConveyor(scene, ctx) {
	const g = ctx.group;
	const { x0, x1, y, w } = TRAYC;
	for (let x = x0; x < x1 - 0.01; x += 1.85) {
		const xb = Math.min(x1, x + 1.85);
		object(scene, x, y - w / 2 - 0.05, xb, y + w / 2 + 0.05, BELT_Z, (r) => conveyorPiece(r, x, xb), { group: g });
	}
	// Empty fiber trays on the belt (the grape station is the first food station on the line).
	const T = (t) => (ctx.reducedMotion() ? TRAY_MOVE + 0.9 : t);
	scene.addDynamic({
		group: g,
		depth: x0 + y + 0.4,
		bounds: [x0 - 0.5, y - 0.5, 0, x1 + 0.5, y + 0.5, 1.2],
		animated: () => true,
		draw: (r, t) => {
			for (const cx of trayXs(T(t))) drawPlate(r, cx, y, BELT_Z, 0, {}, { scale: 1.45 });
		},
	});
	// End hoods cover the trays where the belt starts and ends: live items drawn after them.
	scene.add({
		group: g,
		live: true,
		bounds: [x0 - 0.9, y - 0.65, 0, x0 + 0.5, y + 0.65, 1.6],
		depth: x0 + y + 1.2,
		draw: (r) => {
			r.box(x0 - 0.9, y - 0.6, 0, 1.3, 1.2, 1.35, "#dfe4ea", { top: "#eef1f4" });
			r.box(x0 - 0.9, y - 0.6, 1.35, 1.3, 1.2, 0.12, COLOR);
			r.box(x0 + 0.41, y - 0.42, BELT_Z - 0.05, 0.02, 0.84, 0.4, "#1f2933");
		},
	});
	scene.add({
		group: g,
		live: true,
		bounds: [x1 - 0.45, y - 0.55, 0, x1 + 0.35, y + 0.55, 1.15],
		depth: x1 + y + 1.0,
		draw: (r) => {
			r.box(x1 - 0.45, y - 0.55, 0, 0.8, 1.1, 1.02, "#dfe4ea", { top: "#eef1f4" });
			r.box(x1 - 0.45, y - 0.55, 1.02, 0.8, 1.1, 0.08, COLOR);
			r.box(x1 - 0.46, y - 0.4, BELT_Z - 0.05, 0.02, 0.8, 0.15, "#1f2933");
		},
	});
}

/** The line PLC behind the conveyor; its stack light shows the go-ahead it gives the robot. */
const PLC = { x: 57.0, y: 24.9, w: 1.0, d: 0.6, h: 1.5 };

function buildTrigger(scene, ctx) {
	const g = ctx.group;
	const x = STOP_AT.trigger[0];
	const { y } = TRAYC;
	const T = (t) => (ctx.reducedMotion() ? TRAY_MOVE + 0.9 : t);
	// Back post with the photo-eye (emitter and receiver in one housing, facing the reflector),
	// the PLC, and the one wire between them: static.
	object(
		scene,
		x - 0.1,
		y - 0.8,
		x + 0.1,
		y - 0.5,
		1.3,
		(r) => {
			r.box(x - 0.06, y - 0.78, 0, 0.12, 0.12, 1.2, PAL.steel);
			r.box(x - 0.1, y - 0.72, 0.9, 0.2, 0.18, 0.22, "#2b2f36");
		},
		{ group: g },
	);
	cable(scene, g, [
		[x, y - 0.68],
		[x, PLC.y + PLC.d],
	]);
	object(
		scene,
		PLC.x - 0.05,
		PLC.y - 0.05,
		PLC.x + PLC.w + 0.05,
		PLC.y + PLC.d + 0.05,
		PLC.h + 0.7,
		(r) => {
			r.box(PLC.x - 0.05, PLC.y - 0.05, 0, PLC.w + 0.1, PLC.d + 0.1, 0.1, PAL.dark);
			r.box(PLC.x, PLC.y, 0.1, PLC.w, PLC.d, PLC.h - 0.1, "#d7dce2", { top: "#e6e9ed" });
			const fy = PLC.y + PLC.d + 0.01;
			r.quad(
				[
					[PLC.x + 0.15, fy, 0.75],
					[PLC.x + PLC.w - 0.15, fy, 0.75],
					[PLC.x + PLC.w - 0.15, fy, 1.3],
					[PLC.x + 0.15, fy, 1.3],
				],
				"#3b4552",
				{ flat: true },
			);
			r.cylinder(PLC.x + PLC.w - 0.2, PLC.y + 0.3, PLC.h, 0.05, 0.3, PAL.dark, 6);
		},
		{ group: g },
	);
	// Per frame: the beam (cut short by a tray), the front post with the reflector, the emitter's
	// lamp, a pulse on the wire to the PLC, and the PLC's lamps.
	scene.addDynamic({
		group: g,
		depth: x + y + 0.9,
		bounds: [PLC.x - 0.1, PLC.y - 0.1, 0, x + 0.3, y + 0.8, 2.3],
		animated: () => true,
		draw: (r, t0) => {
			const t = T(t0);
			const since = trayInPlaceFor(t);
			const blocked = since > 0;
			const z = 1.01;
			r.line([x, y - 0.55, z], [x, blocked ? y - 0.36 : y + 0.56, z], "rgba(255,70,60,0.85)", 1.6);
			if (blocked) r.sphere(x, y - 0.36, z, 0.05, "#ff8a7a", 0);
			r.sphere(x + 0.11, y - 0.53, 1.08, 0.045, blocked ? "#ffe14d" : "#5d6a3a", 0);
			r.box(x - 0.06, y + 0.6, 0, 0.12, 0.12, 1.2, PAL.steel);
			r.box(x - 0.09, y + 0.56, 0.92, 0.18, 0.08, 0.18, "#d9483b");
			if (blocked && since < 0.5) {
				const yy = y - 0.68 - (since / 0.5) * (y - 0.68 - PLC.y - PLC.d);
				if (yy < 26.55) r.sphere(x, yy, 0.08, 0.07, SIGNAL, 0);
			}
			const fy = PLC.y + PLC.d + 0.02;
			r.sphere(PLC.x + 0.3, fy, 1.15, 0.05, blocked && since >= 0.5 ? "#ffe14d" : "#4b525b", 0);
			r.sphere(PLC.x + 0.7, fy, 1.15, 0.05, blocked && since >= 0.7 ? "#3ee07a" : "#4b525b", 0);
			const sx = PLC.x + PLC.w - 0.2;
			r.cylinder(sx, PLC.y + 0.3, PLC.h + 0.3, 0.09, 0.14, blocked && since >= 0.7 ? "#3ee07a" : "#3f5a46", 8);
			r.cylinder(sx, PLC.y + 0.3, PLC.h + 0.44, 0.09, 0.14, "#8a6a2a", 8);
		},
	});
	ctx.stopTarget("trigger", [x - 0.8, PLC.y - 0.2, 0, x + 0.8, y + 1.1, 1.8], [x, y, 2.6]);
}

// The grape tote under its fixed lights and camera, on a back-mounted frame (nothing stands in
// front of the tote, so the rider sees straight in).
const TOTE = { x0: 62.7, y0: 27.3, w: 2.4, d: 1.4, h: 0.84 };
const TOTE_BUNCHES = [
	[63.15, 27.7, 0.7],
	[63.95, 27.62, 2.6],
	[64.7, 27.75, 1.9],
	[63.25, 28.35, -0.4],
	[64.05, 28.25, 0.25],
	[64.75, 28.38, -2.3],
];
const RIG = { postY: 26.75, posts: [61.6, 66.2], top: 2.8, panelZ: 2.36, panels: [[61.9, 63.3], [64.5, 65.9]], py: [27.15, 28.85] };
const CAM = { x: 63.9, y: 28.0, z: 2.18 };

/** Capture state at time t: the camera fires once per tray cycle, soon after a tray stops. */
function capture(t) {
	const p = cyclePhase(t) - TRAY_MOVE - 0.5;
	return { on: p >= 0 && p < 0.8, pattern: Math.max(0, Math.floor(p / 0.2)) % 4 };
}

function buildToteRig(scene, ctx) {
	const g = ctx.group;
	const { x0, y0, w, d, h } = TOTE;
	const [pa, pb] = RIG.posts;
	// Static: the two back posts, the tote, and its bunches.
	object(
		scene,
		pa - 0.15,
		RIG.postY - 0.15,
		pb + 0.15,
		y0 + d,
		RIG.top + 0.1,
		(r) => {
			for (const px of [pa, pb]) {
				r.box(px - 0.2, RIG.postY - 0.2, 0, 0.4, 0.4, 0.12, PAL.stone);
				r.box(px - 0.07, RIG.postY - 0.07, 0.12, 0.14, 0.14, RIG.top - 0.12, PAL.steel);
			}
			r.box(x0 - 0.15, y0 - 0.15, 0, w + 0.3, d + 0.3, 0.1, "#b9b2a5", { top: "#cbc4b7" });
			drawTote(r, x0, y0, w, d, h, TOTE_BUNCHES, 2.0);
		},
		{ group: g },
	);
	// Per frame, everything above the tote: steady light from the two diffuse panels, the
	// camera's stripe patterns while it captures, then the panels, camera, and frame on top.
	const T = (t) => (ctx.reducedMotion() ? TRAY_MOVE + 0.9 : t);
	const topZ = h + 0.1;
	scene.addDynamic({
		group: g,
		depth: x0 + y0 + w + d + 0.2,
		bounds: [pa - 0.2, RIG.postY - 0.2, 0, pb + 0.2, RIG.py[1] + 0.1, RIG.top + 0.3],
		animated: () => true,
		draw: (r, t0) => {
			const t = T(t0);
			r.box(pa - 0.07, RIG.postY - 0.07, RIG.top - 0.14, pb - pa + 0.14, 0.14, 0.14, PAL.steel);
			// Light falling from each panel onto the tote (steady: the station keeps its lights fixed).
			const yA = RIG.py[0];
			const yB = RIG.py[1];
			RIG.panels.forEach(([a, b], k) => {
				const ba = k ? x0 + w * 0.4 : x0;
				const bb = k ? x0 + w : x0 + w * 0.6;
				r.quad(
					[
						[a, yB, RIG.panelZ],
						[b, yB, RIG.panelZ],
						[bb, y0 + d, topZ],
						[ba, y0 + d, topZ],
					],
					"#fff2b0",
					{ flat: true, alpha: 0.24 },
				);
				r.quad(
					[
						[b, yA, RIG.panelZ],
						[b, yB, RIG.panelZ],
						[bb, y0 + d, topZ],
						[bb, y0, topZ],
					],
					"#fff2b0",
					{ flat: true, alpha: 0.15 },
				);
			});
			r.quad(
				[
					[x0, y0, topZ],
					[x0 + w, y0, topZ],
					[x0 + w, y0 + d, topZ],
					[x0, y0 + d, topZ],
				],
				"#fff6cc",
				{ flat: true, alpha: 0.14 },
			);
			// Structured light: known stripe patterns projected over the still tote.
			const cap = ctx.reducedMotion() ? { on: true, pattern: 1 } : capture(t);
			const proj = [CAM.x - 0.25, CAM.y, CAM.z - 0.04];
			if (cap.on) {
				const n = [4, 6, 8, 12][cap.pattern];
				for (let i = 0; i < n; i += 2) {
					const xa = x0 + (w * i) / n;
					const xb = x0 + (w * (i + 1)) / n;
					r.quad(
						[
							[xa, y0, topZ + 0.02],
							[xb, y0, topZ + 0.02],
							[xb, y0 + d, topZ + 0.02],
							[xa, y0 + d, topZ + 0.02],
						],
						"#f4f8ff",
						{ flat: true, alpha: 0.55 },
					);
				}
				for (const [cx, cy] of [
					[x0, y0],
					[x0 + w, y0],
					[x0 + w, y0 + d],
					[x0, y0 + d],
				])
					r.line(proj, [cx, cy, topZ], "rgba(225,238,255,0.8)", 1);
			}
			// Panels (their undersides glow), hangers, and the arms back to the frame.
			for (const [a, b] of RIG.panels) {
				r.box(a, yA, RIG.panelZ, b - a, yB - yA, 0.1, "#dfe3e8", { top: "#f1f3f5" });
				r.box(a + 0.02, yB + 0.005, RIG.panelZ - 0.005, b - a - 0.04, 0.01, 0.05, "#ffe98a");
				r.box(b + 0.005, yA + 0.02, RIG.panelZ - 0.005, 0.01, yB - yA - 0.04, 0.05, "#ffe98a");
				const ax = (a + b) / 2;
				r.box(ax - 0.03, (yA + yB) / 2 - 0.03, RIG.panelZ + 0.1, 0.06, 0.06, RIG.top - RIG.panelZ - 0.1, PAL.steel);
				r.box(ax - 0.06, RIG.postY - 0.06, RIG.top, 0.12, (yA + yB) / 2 - RIG.postY + 0.1, 0.1, PAL.steel);
			}
			// The camera: a projector at one end, the lens at the other, hung from its own arm.
			r.box(CAM.x - 0.03, CAM.y - 0.03, CAM.z + 0.24, 0.06, 0.06, RIG.top - CAM.z - 0.24, PAL.steel);
			r.box(CAM.x - 0.06, RIG.postY - 0.06, RIG.top, 0.12, CAM.y - RIG.postY + 0.1, 0.1, PAL.steel);
			r.box(CAM.x - 0.42, CAM.y - 0.15, CAM.z, 0.84, 0.3, 0.24, "#2b2f36");
			r.box(CAM.x - 0.421, CAM.y - 0.15, CAM.z + 0.18, 0.842, 0.3, 0.06, COLOR);
			r.cylinder(proj[0], CAM.y, CAM.z - 0.06, 0.07, 0.06, "#1b1e22", 10);
			r.cylinder(proj[0], CAM.y, CAM.z - 0.065, 0.045, 0.01, cap.on ? "#ffffff" : "#c9d3e0", 10);
			r.cylinder(CAM.x + 0.25, CAM.y, CAM.z - 0.06, 0.07, 0.06, "#1b1e22", 10);
			r.cylinder(CAM.x + 0.25, CAM.y, CAM.z - 0.065, 0.045, 0.01, "#5aa9e6", 10);
			r.sphere(CAM.x + 0.36, CAM.y + 0.16, CAM.z + 0.12, 0.03, cap.on ? "#ff5a4f" : "#5b2a2a", 0);
		},
	});
	const [la, lb] = RIG.panels[0];
	// Labels kept far enough apart that they do not touch at phone zoom, and high enough to clear
	// the cart tag at the light stop.
	ctx.stopTarget("light", [la - 0.3, y0 - 0.2, 0, x0 + w / 2, y0 + d + 0.2, RIG.top], [(la + lb) / 2 - 0.3, RIG.py[1], RIG.top + 0.9]);
	ctx.stopTarget("sensor", [x0 + w / 2, y0 - 0.2, 0, RIG.panels[1][1] + 0.3, y0 + d + 0.2, RIG.top], [CAM.x + 1.2, CAM.y + 0.6, RIG.top + 0.95]);
}

// ---------------------------------------------------------------------------
// Vision computer pods (classical branch)

/** Map (u, v) in [0,1] on a pod's screen to world coordinates. u runs left to right on screen. */
function podScreen(p) {
	const zs0 = 0.95;
	const zs1 = 1.95;
	if (p.face === "x") {
		const x = p.x + p.w + 0.012;
		const ys0 = p.y + 0.3;
		const ys1 = p.y + p.d - 0.3;
		return (u, v) => [x, ys1 - u * (ys1 - ys0), zs0 + v * (zs1 - zs0)];
	}
	const y = p.y + p.d + 0.012;
	const xs0 = p.x + 0.3;
	const xs1 = p.x + p.w - 0.3;
	return (u, v) => [xs0 + u * (xs1 - xs0), y, zs0 + v * (zs1 - zs0)];
}

function drawPod(r, p, on) {
	const body = on ? "#4d6f95" : "#8f979f";
	const top = on ? "#6488b0" : "#a3aab1";
	r.box(p.x - 0.1, p.y - 0.1, 0, p.w + 0.2, p.d + 0.2, 0.15, PAL.dark);
	r.box(p.x, p.y, 0.15, p.w, p.d, POD_H - 0.15, body, { top });
	r.box(p.x + 0.15, p.y + 0.15, POD_H, p.w - 0.3, p.d - 0.3, 0.18, on ? "#3b5878" : "#80878e");
	// Roof fan and antenna.
	r.cylinder(p.x + p.w * 0.35, p.y + p.d * 0.4, POD_H + 0.18, 0.32, 0.08, on ? "#2b3a4c" : "#6b7279", 10);
	r.cylinder(p.x + p.w * 0.75, p.y + p.d * 0.7, POD_H + 0.18, 0.03, 0.55, PAL.dark, 5);
	r.sphere(p.x + p.w * 0.75, p.y + p.d * 0.7, POD_H + 0.76, 0.06, on ? "#7fd3ff" : "#9aa0a6", 0);
	// Screen frame and glass.
	const s = podScreen(p);
	const quad = (u0, v0, u1, v1, color, opts) => r.quad([s(u0, v0), s(u1, v0), s(u1, v1), s(u0, v1)], color, { flat: true, ...opts });
	quad(-0.06, -0.08, 1.06, 1.08, on ? "#1d2a38" : "#4a5057");
	quad(0, 0, 1, 1, on ? "#0e2236" : "#2d3338");
	// Vents on the side face.
	const vent = p.face === "x" ? (k) => [[p.x + 0.4, p.y + p.d + 0.01, 0.5 + k * 0.18], [p.x + p.w - 0.4, p.y + p.d + 0.01, 0.5 + k * 0.18]] : (k) => [[p.x + p.w + 0.01, p.y + 0.4, 0.5 + k * 0.18], [p.x + p.w + 0.01, p.y + p.d - 0.4, 0.5 + k * 0.18]];
	for (let k = 0; k < 5; k++) r.line(...vent(k), on ? "#2f4560" : "#6f767d", 1.4);
	// Cable trench toward the track.
	if (p.face === "x") r.ground(p.x + p.w, p.y + p.d / 2 - 0.08, 71 - 0.5 - p.x - p.w, 0.16, "#2b2f36", 0.021);
	else r.ground(p.x + p.w / 2 - 0.08, p.y + p.d, 0.16, 7 - 0.5 - p.y - p.d, "#2b2f36", 0.021);
}

/** Animated screen content for each pod: what that step does to the signal. */
function drawPodScreen(r, id, p, t) {
	const s = podScreen(p);
	const L = (pts, color, w = 1.4) => r.polyline(pts.map(([u, v]) => s(u, v)), color, w);
	const Q = (pts, color, alpha) => r.quad(pts.map(([u, v]) => s(u, v)), color, { flat: true, alpha });
	// A grape bunch hanging from its stem: rows of grapes narrowing downward (v is up).
	const bunch = (cu, cv, rad) => {
		const g = rad * 0.2;
		L([[cu, cv + rad * 0.95], [cu, cv + rad * 0.55]], FOOD.stem, 2);
		[4, 3, 3, 2, 1].forEach((n, row) => {
			for (let i = 0; i < n; i++) {
				const gu = cu + (i - (n - 1) / 2) * g * 2.05;
				const gv = cv + rad * 0.45 - row * g * 1.9;
				const pts = [];
				for (let k = 0; k < 6; k++) pts.push([gu + Math.cos((k / 6) * Math.PI * 2) * g, gv + Math.sin((k / 6) * Math.PI * 2) * g * 1.25]);
				Q(pts, (i + row) % 3 ? FOOD.grape2 : FOOD.grape);
			}
		});
	};
	const ph = (t * 0.5) % 1;
	if (id === "detection") {
		// The bunch's mask outline is traced around its shape, then its score fills in.
		bunch(0.5, 0.48, 0.22);
		const g = 0.22 * 0.2;
		const rowsN = [4, 3, 3, 2, 1];
		const right = [];
		rowsN.forEach((n, row) => right.push([0.5 + ((n - 1) / 2) * g * 2.05 + g * 1.35, 0.48 + 0.22 * 0.45 - row * g * 1.9]));
		const top = 0.48 + 0.22 * 0.45 + g * 1.5;
		const bottom = 0.48 + 0.22 * 0.45 - 4 * g * 1.9 - g * 1.5;
		const outline = [[0.5, top], [right[0][0], top], ...right, [0.5, bottom], ...right.map(([u, v]) => [1 - u, v]).reverse(), [1 - right[0][0], top], [0.5, top]];
		const k = Math.min(1, ph * 2.2);
		const lens = outline.slice(1).map((p, i) => Math.hypot(p[0] - outline[i][0], p[1] - outline[i][1]));
		let left = k * lens.reduce((a, b) => a + b, 0);
		const pts = [outline[0]];
		for (let i = 0; i < lens.length && left > 0; i++) {
			const f = Math.min(1, left / lens[i]);
			pts.push([outline[i][0] + (outline[i + 1][0] - outline[i][0]) * f, outline[i][1] + (outline[i + 1][1] - outline[i][1]) * f]);
			left -= lens[i];
		}
		if (pts.length > 1) L(pts, "#3ee07a", 1.8);
		Q(
			[
				[0.18, 0.05],
				[0.82, 0.05],
				[0.82, 0.11],
				[0.18, 0.11],
			],
			"#2d3a47",
		);
		const f = 0.18 + 0.64 * 0.9 * Math.max(0, Math.min(1, (ph - 0.45) * 2.5));
		Q(
			[
				[0.18, 0.05],
				[f, 0.05],
				[f, 0.11],
				[0.18, 0.11],
			],
			"#3ee07a",
		);
	} else if (id === "position-3d") {
		const o = [0.22, 0.2];
		L([o, [0.82, 0.2]], "#ff6b5b", 1.6);
		L([o, [0.22, 0.88]], "#5aa9ff", 1.6);
		L([o, [0.52, 0.48]], "#4fd27a", 1.6);
		const k = 0.5 + 0.5 * Math.sin(t * 1.4);
		const P = [0.55 + 0.15 * k, 0.6 + 0.08 * k];
		L([P, [P[0], 0.2 + (P[0] - 0.22) * 0.3]], "rgba(255,255,255,0.55)", 0.9);
		L([P, [0.22, P[1]]], "rgba(255,255,255,0.55)", 0.9);
		Q(
			[
				[P[0] - 0.05, P[1] - 0.06],
				[P[0] + 0.05, P[1] - 0.06],
				[P[0] + 0.05, P[1] + 0.06],
				[P[0] - 0.05, P[1] + 0.06],
			],
			"#ffd23f",
		);
	} else if (id === "grasp") {
		// Soft fingers above the bunch's stem, coming in along the approach arrow.
		bunch(0.5, 0.26, 0.17);
		const k = (Math.sin(t * 2) + 1) / 2;
		const cv = 0.66 + 0.12 * k;
		L([[0.5, cv + 0.06], [0.5, 0.98]], "#b8c0ca", 2);
		Q(
			[
				[0.43, cv + 0.06],
				[0.57, cv + 0.06],
				[0.57, cv],
				[0.43, cv],
			],
			"#3b4552",
		);
		for (const sg of [-1, 1])
			L(
				[
					[0.5 + sg * 0.05, cv],
					[0.5 + sg * 0.08, cv - 0.06],
					[0.5 + sg * 0.03, cv - 0.12],
				],
				"#e8792f",
				2.6,
			);
		L([[0.5, cv - 0.16], [0.5, 0.42]], "#ffd23f", 1.8);
		L([[0.44, 0.49], [0.5, 0.42], [0.56, 0.49]], "#ffd23f", 1.8);
	} else if (id === "trajectory") {
		const curve = [];
		for (let i = 0; i <= 16; i++) {
			const u = i / 16;
			curve.push([0.12 + u * 0.76, 0.2 + Math.sin(u * Math.PI) * 0.58]);
		}
		L(curve, "#3fd1c1", 1.8);
		for (const i of [0, 4, 8, 12, 16]) {
			const [u, v] = curve[i];
			Q(
				[
					[u - 0.035, v - 0.045],
					[u + 0.035, v - 0.045],
					[u + 0.035, v + 0.045],
					[u - 0.035, v + 0.045],
				],
				"#ffffff",
			);
		}
		const j = Math.min(16, Math.floor(ph * 17));
		const [u, v] = curve[j];
		Q(
			[
				[u - 0.05, v - 0.06],
				[u + 0.05, v - 0.06],
				[u + 0.05, v + 0.06],
				[u - 0.05, v + 0.06],
			],
			"#ffd23f",
		);
	} else if (id === "joint-targets") {
		for (let i = 0; i < 6; i++) {
			const u0 = 0.1 + i * 0.14;
			const target = [0.55, 0.8, 0.35, 0.65, 0.45, 0.7][i];
			const lvl = 0.12 + target * (0.6 + 0.4 * Math.min(1, ph * 1.6));
			Q(
				[
					[u0, 0.12],
					[u0 + 0.09, 0.12],
					[u0 + 0.09, Math.min(0.92, lvl)],
					[u0, Math.min(0.92, lvl)],
				],
				["#ff6b5b", "#ffb347", "#ffd23f", "#4fd27a", "#5aa9ff", "#b388ff"][i],
			);
			L([[u0 - 0.01, 0.12 + target * 1.0], [u0 + 0.1, 0.12 + target * 1.0]], "#ffffff", 1.2);
		}
	}
}

function buildPods(scene, ctx) {
	const g = ctx.group;
	const on = ctx.mode !== "learned";
	for (const [id, p] of Object.entries(PODS)) {
		object(scene, p.x - 0.1, p.y - 0.1, p.x + p.w + 0.1, p.y + p.d + 0.1, POD_H + 0.9, (r) => drawPod(r, p, on), { group: g });
		if (on) {
			const T = (t) => (ctx.reducedMotion() ? 1.2 : t);
			scene.addDynamic({
				group: g,
				depth: p.x + p.y + p.w + p.d + 0.3,
				bounds: [p.x, p.y, 0, p.x + p.w, p.y + p.d, POD_H + 0.9],
				animated: () => true,
				draw: (r, t0) => {
					const t = T(t0);
					drawPodScreen(r, id, p, t + p.x * 0.37);
					// Status lights under the screen.
					const s = podScreen(p);
					for (let i = 0; i < 4; i++) {
						const blink = ctx.reducedMotion() ? i % 2 === 0 : Math.sin(t * 5 + i * 1.7 + p.y) > 0;
						const q = s(0.1 + i * 0.12, -0.2);
						r.sphere(q[0], q[1], q[2], 0.035, blink ? ["#3ee07a", "#ffd23f", "#3ee07a", "#7fd3ff"][i] : "#24313d", 0);
					}
				},
			});
		}
		const center = [p.x + p.w / 2, p.y + p.d / 2];
		ctx.stopTarget(id, [p.x - 0.2, p.y - 0.2, 0, p.x + p.w + 0.2, p.y + p.d + 0.2, POD_H + 0.6], [center[0], center[1], POD_H + 1.0]);
	}
}

/** Fork signpost: two arrow boards, the active branch lit. */
function buildForkSign(scene, ctx) {
	const learned = ctx.mode === "learned";
	const x = 72.6;
	const y = 27.4;
	object(
		scene,
		x - 0.3,
		y - 0.3,
		x + 0.3,
		y + 0.3,
		2.6,
		(r) => {
			r.box(x - 0.2, y - 0.2, 0, 0.4, 0.4, 0.12, PAL.stone);
			r.cylinder(x, y, 0.12, 0.05, 1.5, PAL.dark, 6);
			// A board facing the viewer. Arrows point the way each branch goes on screen: the
			// classical leg (-y) runs up and to the right, the learned diagonal straight up.
			const R2 = Math.SQRT1_2;
			const p = (u, v) => [x + u * R2 + 0.02, y - u * R2 + 0.02, 1.55 + v];
			r.quad([p(-0.62, 0), p(0.62, 0), p(0.62, 0.95), p(-0.62, 0.95)], "#f4f4f2", { flat: true, edge: "#3b4048" });
			const arrow = (u0, v0, du, dv, color, lit) => {
				const l = Math.hypot(du, dv);
				const [ex, ey] = [du / l, dv / l];
				const [nx, ny] = [-ey, ex];
				const len = 0.62;
				const sh = 0.07;
				const hw = 0.17;
				const tip = [u0 + ex * len, v0 + ey * len];
				const neck = [u0 + ex * (len - 0.24), v0 + ey * (len - 0.24)];
				const c = lit ? color : "#b9bec4";
				r.quad([p(u0 + nx * sh, v0 + ny * sh), p(neck[0] + nx * sh, neck[1] + ny * sh), p(neck[0] - nx * sh, neck[1] - ny * sh), p(u0 - nx * sh, v0 - ny * sh)], c, { flat: true });
				r.quad([p(neck[0] + nx * hw, neck[1] + ny * hw), p(...tip), p(neck[0] - nx * hw, neck[1] - ny * hw)], c, { flat: true });
			};
			arrow(-0.38, 0.14, 0, 1, "#a75ad6", learned);
			arrow(0.0, 0.16, 0.707, 0.444, "#4d6f95", !learned);
		},
		{ group: ctx.group },
	);
}

// ---------------------------------------------------------------------------
// Controller and servo drive cabinets (drive)

const CAB = { x: 40.7, ctrl: [8.9, 10.9], drive: [11.6, 13.7], w: 1.9, h: 2.15 };

function drawCabinet(r, y0, y1, color, door) {
	const { x, w, h } = CAB;
	r.box(x - 0.05, y0 - 0.05, 0, w + 0.1, y1 - y0 + 0.1, 0.12, PAL.dark);
	r.box(x, y0, 0.12, w, y1 - y0, h - 0.12, color, { top: shade(color, 1.1) });
	r.box(x + 0.1, y0 + 0.1, h, w - 0.2, y1 - y0 - 0.2, 0.08, shade(color, 0.85));
	// Door seam and handle on the +x face.
	const fx = x + w + 0.01;
	r.line([fx, (y0 + y1) / 2, 0.25], [fx, (y0 + y1) / 2, h - 0.1], shade(color, 0.7), 1);
	r.box(fx, (y0 + y1) / 2 + 0.1, 1.0, 0.04, 0.05, 0.3, PAL.dark);
	door?.(fx);
}

function buildDrive(scene, ctx) {
	const g = ctx.group;
	const { x, w, h, ctrl, drive } = CAB;
	object(
		scene,
		x - 0.1,
		ctrl[0] - 0.1,
		x + w + 0.1,
		drive[1] + 0.1,
		h + 0.7,
		(r) => {
			drawCabinet(r, ctrl[0], ctrl[1], "#d7dce2", (fx) => {
				r.quad(
					[
						[fx + 0.005, ctrl[1] - 0.25, 1.35],
						[fx + 0.005, ctrl[0] + 0.35, 1.35],
						[fx + 0.005, ctrl[0] + 0.35, 1.85],
						[fx + 0.005, ctrl[1] - 0.25, 1.85],
					],
					"#1f3a52",
					{ flat: true },
				);
			});
			drawCabinet(r, drive[0], drive[1], "#c9d0d8", (fx) => {
				// Window onto six drive modules.
				r.quad(
					[
						[fx + 0.005, drive[1] - 0.15, 0.55],
						[fx + 0.005, drive[0] + 0.15, 0.55],
						[fx + 0.005, drive[0] + 0.15, 1.95],
						[fx + 0.005, drive[1] - 0.15, 1.95],
					],
					"#26323e",
					{ flat: true },
				);
				for (let i = 0; i < 6; i++) {
					const yy = drive[1] - 0.25 - i * 0.29;
					r.quad(
						[
							[fx + 0.01, yy, 0.65],
							[fx + 0.01, yy - 0.2, 0.65],
							[fx + 0.01, yy - 0.2, 1.4],
							[fx + 0.01, yy, 1.4],
						],
						"#3b4552",
						{ flat: true },
					);
				}
			});
			// Overhead cable tray between the cabinets on two posts.
			for (const yy of [ctrl[0] + 0.3, drive[1] - 0.3]) r.box(x + w / 2 - 0.05, yy - 0.05, h, 0.1, 0.1, 0.45, PAL.steel);
			r.box(x + w / 2 - 0.3, ctrl[0] + 0.2, h + 0.45, 0.6, drive[1] - ctrl[0] - 0.4, 0.06, PAL.metal);
			for (const s of [-0.3, 0.26]) r.box(x + w / 2 + s, ctrl[0] + 0.2, h + 0.51, 0.04, drive[1] - ctrl[0] - 0.4, 0.1, PAL.steel);
			r.box(x + w / 2 - 0.22, ctrl[0] + 0.3, h + 0.51, 0.44, drive[1] - ctrl[0] - 0.6, 0.08, "#e8792f");
		},
		{ group: g },
	);
	// Power cable from the drive cabinet along the ground to the joint sculpture and the arm.
	cable(
		scene,
		g,
		[
			[x + w, drive[1] - 0.25],
			[44.75, drive[1] - 0.25],
			[44.75, 24.3],
			[42.2, 24.3],
		],
		"#d9692a",
		0.06,
	);
	const T = (t) => (ctx.reducedMotion() ? 0.8 : t);
	scene.addDynamic({
		group: g,
		depth: x + w + drive[1] + 0.2,
		bounds: [x, ctrl[0], 0, 45, 24.3, h + 0.7],
		animated: () => true,
		draw: (r, t0) => {
			const t = T(t0);
			const fx = x + w + 0.02;
			// Controller HMI: a moving command trace.
			const pts = [];
			for (let i = 0; i <= 10; i++) {
				const u = i / 10;
				pts.push([fx, ctrl[1] - 0.3 - u * (ctrl[1] - ctrl[0] - 0.7), 1.6 + 0.16 * Math.sin(u * 7 + t * 3)]);
			}
			r.polyline(pts, "#5fe0a0", 1.2);
			// Drive module LEDs and current bars.
			for (let i = 0; i < 6; i++) {
				const yy = drive[1] - 0.35 - i * 0.29;
				const lvl = 0.5 + 0.45 * Math.sin(t * 6 + i * 1.05);
				r.box(fx - 0.005, yy - 0.04, 0.75, 0.01, 0.08, 0.55 * lvl, "#ffb347");
				r.sphere(fx + 0.01, yy, 1.3, 0.03, Math.sin(t * 7 + i) > -0.3 ? "#3ee07a" : "#1d3a28", 0);
			}
			// Pulses in the overhead tray (controller to drive) and along the power cable.
			const k = (t * 0.7) % 1;
			r.sphere(x + w / 2, ctrl[0] + 0.4 + k * (drive[1] - ctrl[0] - 0.8), h + 0.62, 0.07, "#ffd23f", 0);
			for (let i = 0; i < 3; i++) {
				const s = ((t * 0.45 + i / 3) % 1) * 11.5;
				const yy = drive[1] - 0.2 + s;
				if (yy < 24.1) r.sphere(44.75, yy, 0.06, 0.07, "#ffe9a8", 0);
			}
		},
	});
	ctx.stopTarget("drive", [x - 0.2, ctrl[0] - 0.2, 0, x + w + 0.2, drive[1] + 0.2, h + 0.6], [x + w / 2, (ctrl[0] + drive[1]) / 2, h + 1.0]);
}

// ---------------------------------------------------------------------------
// The big arm and the tray it fills (arm-motion, gripper)

/** Arm cycle state at time t (u in [0,1) over one pick). */
function armState(t) {
	const { period } = ARM;
	const u = (((t / period) % 1) + 1) % 1;
	const k = shuttle(t, period, 0);
	const down = dip(t, period, 0);
	return { u, k, down, carrying: u > 0.12 && u < 0.6, indexing: u > 0.74 ? Math.min(1, (u - 0.74) / 0.2) : 0 };
}

function buildArm(scene, ctx) {
	const g = ctx.group;
	const [bx, by] = ARM.base;
	const s = ARM.scale;
	// Pedestal, the grape tote with its camera overhead, tray conveyor frame: static.
	object(scene, bx - 1.2, by - 1.2, bx + 1.2, by + 1.2, 0.3, (r) => {
		r.box(bx - 1.2, by - 1.2, 0, 2.4, 2.4, 0.28, PAL.steel, { top: "#a3adb8" });
		r.box(bx - 1.2, by + 1.19, 0.08, 2.4, 0.02, 0.12, PAL.safety);
		r.box(bx + 1.19, by - 1.2, 0.08, 0.02, 2.4, 0.12, PAL.safety);
	}, { group: g });
	const [tx0, ty0, tx1, ty1] = PICK_TOTE;
	object(scene, tx0, ty0, tx1, ty1, BELT_Z, (r) => drawTote(r, tx0, ty0, tx1 - tx0, ty1 - ty0, BELT_Z, PICK_BUNCHES, 2.3), { group: g });
	// The camera is fixed above the tote on a bracket (the arm reaches in underneath it).
	const [px, py] = PICK_CAM.post;
	const [cx, cy, cz] = PICK_CAM.cam;
	object(scene, px - 0.25, py - 0.25, cx + 0.45, cy + 0.2, cz + 0.45, (r) => {
		r.box(px - 0.25, py - 0.25, 0, 0.5, 0.5, 0.12, PAL.stone);
		r.box(px - 0.07, py - 0.07, 0.12, 0.14, 0.14, cz + 0.3, "#5d6672");
		r.beam([px, py, cz + 0.36], [cx, cy, cz + 0.36], 0.12, 0.12, "#5d6672");
		r.box(cx - 0.03, cy - 0.03, cz + 0.24, 0.06, 0.06, 0.12, PAL.steel);
		r.box(cx - 0.4, cy - 0.14, cz, 0.8, 0.28, 0.24, "#2b2f36");
		r.box(cx - 0.401, cy - 0.14, cz + 0.18, 0.802, 0.28, 0.06, COLOR);
	}, { group: g });
	object(scene, TRAYS.x - 0.55, TRAYS.y0, TRAYS.x + 0.55, TRAYS.y1, BELT_Z, (r) => {
		const x0 = TRAYS.x - 0.5;
		r.box(x0, TRAYS.y0, BELT_Z - 0.15, 1.0, TRAYS.y1 - TRAYS.y0, 0.13, PAL.metal);
		r.ground(x0 + 0.06, TRAYS.y0, 0.88, TRAYS.y1 - TRAYS.y0, "#3a3f47", BELT_Z - 0.01);
		for (let yy = TRAYS.y0 + 0.2; yy < TRAYS.y1; yy += 1.6) {
			r.box(x0 + 0.05, yy, 0, 0.1, 0.1, BELT_Z - 0.15, PAL.dark);
			r.box(x0 + 0.85, yy, 0, 0.1, 0.1, BELT_Z - 0.15, PAL.dark);
		}
		// Air supply for the soft fingers, with a pressure gauge.
		r.box(x0 - 0.9, TRAYS.y0 + 0.1, 0, 0.6, 0.7, 0.75, "#d7dce2");
		r.cylinder(x0 - 0.6, TRAYS.y0 + 0.81, 0.45, 0.13, 0.02, "#ffffff", 10);
	}, { group: g });
	const T = (t) => (ctx.reducedMotion() ? ARM.period * 0.55 : t);
	const feedZ = BELT_Z + 0.01;
	scene.addDynamic({
		group: g,
		depth: ARM.place[0] + ARM.place[1] + 0.3,
		bounds: [38.5, 20.5, 0, 45.2, 30.6, 6.5],
		animated: () => true,
		draw: (r, t0) => {
			const t = T(t0);
			const st = armState(t);
			const S = 2.3; // bunch scale at this station
			// The bunch to pick, lying in the tote; the next one is there by the time the arm is back.
			if (!st.carrying && (st.u < 0.12 || st.u > 0.9)) lyingBunch(r, ARM.pick[0], ARM.pick[1], feedZ, S, 0.5);
			// Trays behind the place point.
			const shift = st.indexing * TRAYS.pitch;
			const trays = [];
			for (let i = -2; i <= 3; i++) trays.push(ARM.place[1] + i * TRAYS.pitch + shift);
			const drawTray = (y, i) => {
				if (y < TRAYS.y0 + 0.3 || y > TRAYS.y1 - 0.3) return;
				const filled = i > 0 || (i === 0 && st.u >= 0.6);
				drawPlate(r, TRAYS.x, y, BELT_Z, Math.PI / 2, filled ? { grapes: true } : {}, { scale: 1.45 });
			};
			trays.forEach((y, j) => {
				if (j <= 2) drawTray(y, j - 2);
			});
			// The arm reaches between the pick point and the place point.
			const k = st.k;
			const lift = (1 - st.down) * 0.9;
			// The fingers close on the stem low at the pick point and hold the bunch hanging high
			// enough over the tray that it touches down as they reach the place point.
			const zPick = BELT_Z + 0.2;
			const zPlace = BELT_Z + 0.72;
			const target = [ARM.pick[0] + (ARM.place[0] - ARM.pick[0]) * k, ARM.pick[1] + (ARM.place[1] - ARM.pick[1]) * k, zPick + (zPlace - zPick) * k + lift];
			drawSixAxis(r, bx, by, target, { scale: s, tool: "fingers", grip: st.carrying ? 0 : 1 });
			if (st.carrying) {
				const hz = target[2] + 0.02;
				if (hz - HANG * BUNCH > feedZ) drawHangingBunch(r, target[0], target[1], hz, 0, BUNCH);
				else lyingBunch(r, target[0], target[1], feedZ, S, 0.5);
			}
			trays.forEach((y, j) => {
				if (j > 2) drawTray(y, j - 2);
			});
		},
	});
	// Label on the arm's track side, so it stays on a phone screen while the cart is at the stop.
	ctx.stopTarget("arm-motion", [bx - 1.3, by - 1.3, 0, bx + 1.3, by + 1.3, 4.6], [bx + 0.6, by - 0.8, 4.4]);
	// The label stands over the filled trays downstream, clear of the fingers at the place point.
	ctx.stopTarget("gripper", [TRAYS.x - 0.6, 26.4, 0, TRAYS.x + 0.6, 28.8, 1.6], [TRAYS.x, TRAYS.y1 - 0.8, 1.5]);
}

// ---------------------------------------------------------------------------
// Decor

function buildDecor(scene, ctx) {
	const g = ctx.group;
	const trees = [
		[40.3, 4.3, 0, 1.0],
		[43.7, 3.9, "pine", 0.95],
		[47.4, 4.0, 2, 0.9],
		[72.4, 4.0, 1, 0.9],
		[49.3, 18.6, 3, 0.95],
		[54.6, 24.3, 0, 1.0],
		[54.3, 17.2, "pine", 0.9],
		[40.0, 32.6, 1, 1.0],
		[43.4, 33.4, "pine", 0.85],
	];
	for (const [x, y, kind, s] of trees) object(scene, x - 0.9 * s, y - 0.9 * s, x + 0.9 * s, y + 0.9 * s, 3 * s, (r) => drawTree(r, x, y, kind, s), { group: g });
	object(scene, 48.4, 26.2, 50.9, 28.4, 0.6, (r) => drawFlowers(r, 48.4, 26.2, 2.5, 2.2, 201), { group: g });
}

// ---------------------------------------------------------------------------

export default {
	id: "ride2",
	zone: "signal",

	trackFor(mode) {
		return buildPoints(mode === "learned" ? "learned" : "classical");
	},

	buildScenery(scene, ctx) {
		loadCss("css/modules/ride2.css");
		const learned = ctx.mode === "learned";
		branchBed(scene, ctx, [FORK, ...CLASSICAL.map(pt), MERGE], learned ? "#b7bec6" : "#9fb4cc", 0.75);
		branchBed(scene, ctx, [FORK, ...LEARNED.map(pt), MERGE], learned ? "#c9a3e6" : "#c4bccb", 0.75);
		drawSpur(scene, ctx, learned);
		buildPlatform(scene, ctx);
		buildConveyor(scene, ctx);
		buildTrigger(scene, ctx);
		buildToteRig(scene, ctx);
		buildForkSign(scene, ctx);
		buildPods(scene, ctx);
		buildPavilion(scene, ctx, { on: learned });
		buildDrive(scene, ctx);
		buildJointSculpture(scene, ctx);
		buildArm(scene, ctx);
		buildDecor(scene, ctx);
		ctx.booth("position-3d", 64.4, 11.7);
		ctx.booth("joint-targets", 53.6, 4.4);
		ctx.booth("drive", 51.6, 12.6);
		ctx.booth("arm-motion", 51.6, 22.4);
	},

	// Aim between the cart and the station next to it, so the thing that just changed the
	// cargo is in view beside the cart.
	focus(pos) {
		let best = null;
		let bd = 8;
		for (const p of Object.values(FOCUS)) {
			const d = Math.hypot(p[0] - pos.x, p[1] - pos.y);
			if (d < bd) {
				bd = d;
				best = p;
			}
		}
		if (!best) return [pos.x, pos.y, pos.z + 0.6];
		const k = Math.min(0.5, 2.2 / Math.max(bd, 0.01));
		return [pos.x + (best[0] - pos.x) * k, pos.y + (best[1] - pos.y) * k, pos.z + 0.8];
	},

	drawCargo(r, stopId, pos, t, ctx) {
		drawCargo(r, stopId, pos, ctx.reducedMotion() ? 0 : t, ctx.reducedMotion());
	},

	closeup(stopId, el, ctx) {
		return mountCloseup(stopId, el, ctx);
	},
};
