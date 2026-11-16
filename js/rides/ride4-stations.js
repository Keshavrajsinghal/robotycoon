// Ride 4 stations in the lesson zone: static buildings plus their moving parts. Row 1 (behind the
// first track row) holds recording, upload, curation, and dataset; row 2 holds training through
// next-pick. The grape station (recording, real trials, the next pick, and the simulator's
// virtual copies) is a washdown six-axis arm with soft fingers picking bunches that lie at random
// angles in a tote, as the knowledge files state. Drawing code only.

import { drawGrapes, drawHangingBunch, drawPlate } from "../engine/food.js";
import { circlePoints, shade } from "../engine/iso.js";
import { drawBench, drawFlowers, drawTree, object, PAL } from "../engine/park.js";
import { dip, drawSixAxis, shuttle } from "../engine/robots.js";
import { LAYER } from "../engine/scene.js";
import { drawCard, frameAt, GHOST, glow, KITCHENS, lerp, lerp2, phase, pointOn, polyLen, R4, smooth, still, STRIPES, TRIALS, wallRect } from "./ride4-common.js";

// ---------------------------------------------------------------------------
// Small shared pieces

function tote(r, x0, y0, w, d, h, color) {
	r.box(x0, y0, 0, w, d, h, color, { top: shade(color, 0.55) });
}

/** Where the bunches lie in a tote (fractions of its size) and at what angle: random angles. */
const TOTE_SPOTS = [
	[0.28, 0.3, 0.6],
	[0.68, 0.3, 2.3],
	[0.3, 0.7, -0.9],
	[0.7, 0.7, 1.3],
];
/** The bunch the arm picks: the back one nearest the tray. */
const PICK_SPOT = 1;
const TOTE_SCALE = 0.9;

function toteBunch(r, tt, i) {
	const [x0, y0, w, d, top] = tt;
	const [u, v, a] = TOTE_SPOTS[i];
	drawGrapes(r, frameAt(x0 + u * w, y0 + v * d, top - 0.04, a, TOTE_SCALE), TOTE_SCALE);
}

/** Bunches lying in a tote tt = [x0, y0, w, d, top], back to front, leaving out one spot. */
function toteGrapes(r, tt, skip = -1) {
	const order = TOTE_SPOTS.map((s, i) => i).sort((a, b) => TOTE_SPOTS[a][0] * tt[2] + TOTE_SPOTS[a][1] * tt[3] - (TOTE_SPOTS[b][0] * tt[2] + TOTE_SPOTS[b][1] * tt[3]));
	for (const i of order) if (i !== skip) toteBunch(r, tt, i);
}

/** Conveyor running along x (ride 1 has the same along y). */
function convX(r, x0, x1, yc, w, zt) {
	const y0 = yc - w / 2;
	const y1 = yc + w / 2;
	for (const x of [x0 + 0.08, x1 - 0.18]) {
		r.box(x, y0 + 0.05, 0, 0.1, 0.1, zt - 0.12, PAL.dark);
		r.box(x, y1 - 0.15, 0, 0.1, 0.1, zt - 0.12, PAL.dark);
	}
	r.box(x0, y0, zt - 0.14, x1 - x0, w, 0.12, PAL.metal);
	r.ground(x0, y0 + 0.06, x1 - x0, w - 0.12, "#3a3f47", zt - 0.01);
	r.box(x0, y0 - 0.04, zt - 0.05, x1 - x0, 0.06, 0.08, PAL.steel);
	r.box(x0, y1 - 0.02, zt - 0.05, x1 - x0, 0.06, 0.08, PAL.steel);
}

/** Stack light (pole with a lamp housing); the lamp itself is drawn by a dynamic item. */
function stackPole(r, x, y, h) {
	r.box(x - 0.1, y - 0.1, 0.08, 0.2, 0.2, 0.06, PAL.dark);
	r.cylinder(x, y, 0.14, 0.035, h - 0.14, PAL.steel, 6);
	r.cylinder(x, y, h, 0.08, 0.06, PAL.dark, 8);
}

function lamp(r, x, y, z, on, color = R4.lit, radius = 0.08) {
	r.sphere(x, y, z, radius, on ? color : R4.unlit, 0);
	if (on) glow(r, x, y, z, 14, color === R4.reject ? "255,90,70" : color === R4.data ? "90,200,240" : "120,255,160", 0.5);
}

// ---------------------------------------------------------------------------
// The grape pick: a six-axis arm with soft fingers takes a bunch from the tote by its stem and
// sets it in the tray.

const BS = 0.8; // hanging bunch scale at these stations
const HANG = 0.34 * BS; // its length below the stem

/**
 * Pose of a grape pick at time t. c: { tote: [x0, y0, w, d, top], tray: [x, y, z] (tray bottom),
 * trayScale, period, lift, fail (the bunch slips back into the tote) }.
 */
function grapePose(t, c) {
	const ts = c.trayScale ?? 1;
	const u = phase(t, c.period);
	const k = shuttle(t, c.period);
	const down = dip(t, c.period);
	const [x0, y0, w, d, top] = c.tote;
	const [su, sv, sa] = TOTE_SPOTS[PICK_SPOT];
	const stem = frameAt(x0 + su * w, y0 + sv * d, top - 0.04, sa, TOTE_SCALE)(-0.17, 0.01, 0.1);
	// drawPlate puts its grapes at (-0.14, -0.1) of the tray (heading 0).
	const place = [c.tray[0] - 0.14 * ts, c.tray[1] - 0.1 * ts];
	const trayTop = c.tray[2] + 0.05 * ts;
	const z = lerp(stem[2], trayTop + HANG + 0.02, k) + (c.lift ?? 0.3) * (1 - down);
	const carrying = u > 0.1 && u < (c.fail ? 0.26 : 0.6);
	return { u, x: lerp(stem[0], place[0], k), y: lerp(stem[1], place[1], k), z, carrying, placed: !c.fail && u >= 0.6 && u < 0.96, hangs: carrying && z - HANG > top + 0.02 };
}

/** Draw the pick: the bunch (in the tote, held, or in the tray) and the arm. Returns the pose. */
function drawGrapePick(r, t, c) {
	const p = grapePose(t, c);
	const ts = c.trayScale ?? 1;
	if (!p.hangs && !p.placed) toteBunch(r, c.tote, PICK_SPOT);
	if (p.placed && !c.trayDrawsGrapes) {
		const at = frameAt(c.tray[0], c.tray[1], c.tray[2], 0, ts);
		drawGrapes(r, (f, sd, zz = 0) => at(f - 0.14, sd - 0.1, zz), ts);
	}
	const arm = drawSixAxis(r, c.base[0], c.base[1], [p.x, p.y, p.z], { scale: c.scale, z: c.bz ?? 0, tool: "fingers", grip: p.carrying ? 0 : 1, colors: c.colors });
	if (p.hangs) drawHangingBunch(r, p.x, p.y, p.z, 0, BS);
	return { ...p, wrist: arm.wrist };
}

// ---------------------------------------------------------------------------
// Row 1: recording

const REC = { base: [44.6, 76.3], tote: [43.65, 77.25, 0.7, 0.6, 0.32], tray: [45.25, 77.55, 0.34], recorder: [42.35, 78.65], cam: [45.9, 75.35] };
const CABLES = [
	{ color: "#2fb5d6", pts: [[45.9, 75.35], [43.05, 75.35], [43.05, 78.82], [42.72, 78.82]] },
	{ color: "#e8792f", pts: [[44.15, 76.45], [43.3, 76.45], [43.3, 78.6], [42.72, 78.6]] },
	{ color: R4.purple, pts: [[42.35, 76.0], [42.35, 78.3]] },
];
const CAM_HEAD = [45.45, 75.8, 2.0];
const REC_PICK = { base: REC.base, bz: 0.18, scale: 1.1, tote: REC.tote, tray: REC.tray, trayScale: 0.95, period: 4.6, lift: 0.32 };

function buildRecording(scene, ctx) {
	const g = ctx.group;
	object(
		scene,
		41.6,
		75.0,
		46.3,
		79.5,
		2.4,
		(r) => {
			r.box(41.6, 75.0, 0, 4.7, 4.45, 0.08, R4.pad, { top: R4.padTop });
			r.ground(41.6, 79.32, 4.7, 0.13, R4.purple, 0.082);
			for (const c of CABLES)
				r.polyline(
					c.pts.map(([x, y]) => [x, y, 0.09]),
					shade(c.color, 0.85),
					2.6,
				);
			// Command link: the remote operator's commands arrive from the plant network (a conduit
			// at the pad edge) into a cabinet with a joystick sign.
			r.polyline(
				[
					[41.6, 75.72, 0.09],
					[42.06, 75.72, 0.09],
				],
				shade(R4.purple, 0.85),
				2.6,
			);
			r.box(41.6, 75.62, 0, 0.12, 0.2, 0.12, PAL.dark);
			r.box(42.06, 75.45, 0.08, 0.58, 0.5, 0.82, "#d7dce2", { top: "#e6e9ed" });
			const fy = 75.955;
			wallRect(r, "x", fy, 42.13, 42.57, 0.34, 0.82, "#1f3a52");
			wallRect(r, "x", fy + 0.002, 42.22, 42.46, 0.4, 0.47, "#e6e9ed");
			r.line([42.34, fy + 0.004, 0.47], [42.4, fy + 0.004, 0.66], "#e6e9ed", 2.4);
			r.quad(
				circlePoints(42.41, 0.69, 0.045, 8).map(([u, z]) => [u, fy + 0.006, z]),
				R4.reject,
				{ flat: true },
			);
			// Recorder: a dark box with a tape window; the ring buffer on top is dynamic.
			r.box(42.0, 78.3, 0.08, 0.7, 0.7, 0.08, PAL.dark);
			r.box(42.02, 78.32, 0.16, 0.66, 0.66, 0.5, "#2b3038", { top: "#3a414b" });
			wallRect(r, "x", 78.985, 42.1, 42.6, 0.3, 0.56, "#4a525d");
			for (const x of [42.22, 42.48]) r.quad(circlePoints(x, 0.43, 0.075, 8).map(([u, z]) => [u, 78.99, z]), "#d9dee4", { flat: true });
			wallRect(r, "y", 42.685, 78.42, 78.9, 0.5, 0.56, "#2fb5d6");
			// Disk queue beside the recorder: episodes wait here until the overnight upload.
			r.box(41.66, 78.38, 0.08, 0.32, 0.54, 0.4, "#59626c", { top: "#6b7480" });
			for (const z of [0.18, 0.3]) wallRect(r, "x", 78.925, 41.7, 41.94, z, z + 0.05, "#2fb5d6");
			// Overhead camera on a pole, looking at the pick.
			r.box(45.75, 75.2, 0.08, 0.3, 0.3, 0.08, PAL.dark);
			r.cylinder(45.9, 75.35, 0.16, 0.045, 1.95, PAL.steel, 6);
			r.beam([45.9, 75.35, 2.08], [CAM_HEAD[0], CAM_HEAD[1], 2.08], 0.06, 0.06, PAL.steel);
			const aim = Math.atan2(77.5 - CAM_HEAD[1], 44.6 - CAM_HEAD[0]);
			r.orientedBox(CAM_HEAD[0], CAM_HEAD[1], CAM_HEAD[2] - 0.08, 0.34, 0.2, 0.2, aim, PAL.dark);
			const lx = CAM_HEAD[0] + Math.cos(aim) * 0.2;
			const ly = CAM_HEAD[1] + Math.sin(aim) * 0.2;
			r.tube([lx, ly, CAM_HEAD[2] + 0.02], [lx + Math.cos(aim) * 0.12, ly + Math.sin(aim) * 0.12, CAM_HEAD[2] - 0.03], 0.06, "#111418", 8);
			// Robot pedestal, grape tote, tray on a stand.
			r.box(44.1, 75.8, 0.08, 1.0, 1.0, 0.1, PAL.steel);
			tote(r, REC.tote[0], REC.tote[1], REC.tote[2], REC.tote[3], REC.tote[4], "#2f6fb3");
			toteGrapes(r, REC.tote, PICK_SPOT);
			r.box(44.97, 77.32, 0.08, 0.56, 0.46, 0.26, PAL.steel);
			drawPlate(r, REC.tray[0], REC.tray[1], REC.tray[2], 0, {}, { scale: 0.95 });
		},
		{ group: g },
	);
	// The rescued pick being replayed by the arm, with its wrist camera.
	scene.addDynamic({
		group: g,
		depth: REC.base[0] + REC.base[1] + 0.5,
		bounds: [43.3, 75.4, 0, 46.2, 78.2, 2.4],
		animated: () => true,
		draw: (r, t) => {
			const p = drawGrapePick(r, still(ctx, t, 1.6), REC_PICK);
			wristCam(r, p.wrist, Math.atan2(p.y - REC.base[1], p.x - REC.base[0]), REC_PICK.scale);
		},
	});
	// Data flowing along the three cables into the recorder, its blinking light, and the ring
	// buffer on top: a fixed loop that keeps overwriting its oldest segment.
	const lens = CABLES.map((c) => polyLen(c.pts));
	scene.addDynamic({
		group: g,
		depth: 119.5,
		bounds: [41.9, 75.2, 0, 46.1, 79.1, 2.3],
		animated: () => true,
		draw: (r, t) => {
			const rm = ctx.reducedMotion();
			CABLES.forEach((c, ci) => {
				for (let k = 0; k < 3; k++) {
					const u = phase(rm ? 0.4 : t * 0.35, 1, k / 3 + ci * 0.11);
					const p = pointOn(c.pts, u * lens[ci]);
					r.sphere(p[0], p[1], 0.12, 0.055, c.color, 0);
				}
			});
			const [cx, cy] = REC.recorder;
			const head = rm ? 5 : Math.floor(t * 3) % 8;
			for (let i = 0; i < 8; i++) {
				const a0 = (i * Math.PI) / 4 + 0.07;
				const a1 = ((i + 1) * Math.PI) / 4 - 0.07;
				const pts = [];
				for (let j = 0; j <= 3; j++) {
					const a = lerp(a0, a1, j / 3);
					pts.push([cx + Math.cos(a) * 0.29, cy + Math.sin(a) * 0.29, 0.665]);
				}
				for (let j = 3; j >= 0; j--) {
					const a = lerp(a0, a1, j / 3);
					pts.push([cx + Math.cos(a) * 0.19, cy + Math.sin(a) * 0.19, 0.665]);
				}
				const age = (head - i + 8) % 8;
				r.quad(pts, age === 0 ? "#ff3b30" : age < 3 ? R4.purpleLight : R4.purple, { flat: true });
			}
			const on = rm || Math.floor(t * 1.6) % 2 === 0;
			lamp(r, CAM_HEAD[0] - 0.05, CAM_HEAD[1] - 0.05, CAM_HEAD[2] + 0.17, on, "#ff3b30", 0.045);
		},
	});
}

/** A small camera on the arm's wrist, looking down past the fingers. */
function wristCam(r, wrist, yaw, s) {
	const x = wrist[0] + Math.cos(yaw) * 0.09 * s;
	const y = wrist[1] + Math.sin(yaw) * 0.09 * s;
	r.orientedBox(x, y, wrist[2] - 0.05 * s, 0.1 * s, 0.09 * s, 0.07 * s, yaw, PAL.dark);
	r.sphere(x + Math.cos(yaw) * 0.05 * s, y + Math.sin(yaw) * 0.05 * s, wrist[2] - 0.03 * s, 0.025 * s, "#2fb5d6", 0);
}

// ---------------------------------------------------------------------------
// Row 1: upload. The plant's link is narrow: small telemetry trickles up the glass pipe all day,
// episodes wait in the disk queue, and at night the flagged ones (plus a sample) go up.

const PIPE = [
	[42.35, 78.65, 0.66],
	[42.35, 78.65, 1.72],
	[40.62, 77.7, 1.72],
];
const QUEUE = [41.82, 78.65, 0.48];
const NIGHT_PATH = [[QUEUE[0], QUEUE[1], QUEUE[2] + 0.1], [QUEUE[0], QUEUE[1], 0.86], [42.35, 78.65, 0.86], ...PIPE.slice(1)];
const DAY_LEN = 12;
const NIGHT_AT = 0.55;
/** Parcels queued during the day: flagged takeovers (purple) and one sampled normal pick (blue). */
const PARCELS = [R4.purpleLight, R4.purpleLight, R4.data];

function buildUpload(scene, ctx) {
	const g = ctx.group;
	object(
		scene,
		37.0,
		75.0,
		40.8,
		78.4,
		3.9,
		(r) => {
			r.box(37.0, 75.0, 0, 3.8, 3.4, 0.15, PAL.stone);
			r.box(37.2, 75.2, 0.15, 3.4, 3.0, 2.0, "#e4ebf3", { top: "#eef3f8" });
			// Front (+y) face: up-arrow emblem, door, day/night panel. Side (+x): windows, pipe inlet.
			r.quad(
				[
					[37.68, 78.205, 0.45],
					[37.86, 78.205, 0.45],
					[37.86, 78.205, 1.0],
					[38.08, 78.205, 1.0],
					[37.77, 78.205, 1.48],
					[37.46, 78.205, 1.0],
					[37.68, 78.205, 1.0],
				],
				R4.purple,
				{ flat: true },
			);
			wallRect(r, "x", 78.205, 38.5, 39.2, 0.15, 1.15, "#2f4d6b");
			wallRect(r, "x", 78.205, 39.5, 40.4, 0.86, 1.56, "#1d2633");
			wallRect(r, "y", 40.605, 75.5, 76.1, 0.9, 1.5, PAL.window);
			wallRect(r, "y", 40.605, 76.5, 77.1, 0.9, 1.5, PAL.window);
			wallRect(r, "x", 78.206, 37.2, 40.6, 1.78, 1.98, R4.purple);
			wallRect(r, "y", 40.606, 75.2, 78.2, 1.78, 1.98, R4.purple);
			// The cloud on the roof.
			r.box(37.5, 75.5, 2.15, 2.8, 2.4, 0.12, "#cfd9e6");
			const puffs = [
				[38.1, 76.0, 2.65, 0.62],
				[39.6, 76.0, 2.6, 0.58],
				[38.9, 76.35, 3.05, 0.78],
				[37.85, 77.0, 2.55, 0.55],
				[39.95, 77.0, 2.5, 0.5],
				[38.9, 77.35, 2.6, 0.62],
			].sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
			for (const [x, y, z, rad] of puffs) r.sphere(x, y, z, rad, "#ffffff", 1, { sz: 0.82 });
		},
		{ group: g },
	);
	// The narrow glass pipe: live, so it sorts with the recorder's ring buffer and the parcels.
	scene.add({
		group: g,
		live: true,
		depth: 122,
		bounds: [40.55, 77.6, 0.6, 42.5, 78.8, 1.9],
		draw: (r) => {
			r.cylinder(PIPE[0][0], PIPE[0][1], 0.64, 0.13, 0.08, PAL.steel, 8);
			r.tube(PIPE[0], PIPE[1], 0.1, R4.glass, 8, { alpha: 0.6 });
			r.tube(PIPE[1], PIPE[2], 0.1, R4.glass, 8, { alpha: 0.6 });
			r.sphere(PIPE[1][0], PIPE[1][1], PIPE[1][2], 0.11, R4.glass, 0, { alpha: 0.6 });
			r.tube([40.62, 77.7, 1.72], [40.78, 77.788, 1.72], 0.12, PAL.steel, 8);
		},
	});
	const L = polyLen(PIPE);
	const LN = polyLen(NIGHT_PATH);
	const dayPhase = (t) => (ctx.reducedMotion() ? 0.66 : phase(t, DAY_LEN));
	scene.addDynamic({
		group: g,
		depth: 122.1,
		bounds: [40.5, 77.5, 0, 42.6, 79.0, 1.95],
		animated: () => true,
		draw: (r, t) => {
			const u = dayPhase(t);
			// Telemetry: tiny dots, live, day and night.
			for (let k = 0; k < 4; k++) {
				const p = pointOn(PIPE, phase(ctx.reducedMotion() ? 0.1 : t * 0.35, 1, k / 4) * L);
				r.sphere(p[0], p[1], p[2], 0.035, R4.dataHi, 0);
			}
			// Parcels: queued one by one during the day, sent one by one at night.
			let stacked = 0;
			PARCELS.forEach((color, j) => {
				const queuedAt = 0.12 + j * 0.13;
				const leaves = NIGHT_AT + 0.03 + j * 0.12;
				if (u < queuedAt) return;
				if (u < leaves) {
					const z = QUEUE[2] + stacked * 0.16;
					stacked++;
					r.box(QUEUE[0] - 0.07, QUEUE[1] - 0.07, z, 0.14, 0.14, 0.14, color);
					return;
				}
				const k = (u - leaves) / 0.16;
				if (k >= 1) return;
				const p = pointOn(NIGHT_PATH, smooth(k) * LN);
				r.box(p[0] - 0.065, p[1] - 0.065, p[2] - 0.065, 0.13, 0.13, 0.13, color);
			});
		},
	});
	// The day/night panel on the front wall: the sun is lit by day, the moon at night.
	scene.addDynamic({
		group: g,
		depth: 118.3,
		bounds: [39.5, 78.2, 0.8, 40.4, 78.3, 1.6],
		animated: () => true,
		draw: (r, t) => {
			const night = dayPhase(t) >= NIGHT_AT;
			const y = 78.208;
			r.quad(
				circlePoints(39.73, 1.21, 0.15, 10).map(([u, z]) => [u, y, z]),
				night ? "#3a4250" : "#f6c945",
				{ flat: true },
			);
			const cu = 40.17;
			const cz = 1.21;
			const R = 0.16;
			const pts = [];
			for (let i = 0; i <= 8; i++) {
				const a = Math.PI / 2 + (i / 8) * Math.PI;
				pts.push([cu + Math.cos(a) * R, y, cz + Math.sin(a) * R]);
			}
			for (let i = 0; i <= 8; i++) {
				const s = (i / 8) * Math.PI;
				pts.push([cu - 0.45 * R * Math.sin(s), y, cz - R * Math.cos(s)]);
			}
			r.quad(pts, night ? "#eef2fb" : "#3a4250", { flat: true });
		},
	});
}

// ---------------------------------------------------------------------------
// Row 1: curation. A sorting conveyor keeps takeovers, failures, and unusual bunches (different
// spine colors) and pushes off near-copies of easy picks (identical teal spines) and a broken
// recording (grey spine).

const CUR = { y: 77.6, x0: 36.8, x1: 33.5, zt: 0.8, pusher: 34.6, arch: 35.9, rejectBin: [34.2, 75.3, 0.9, 1.0, 0.55], keepBin: [32.7, 77.15, 0.8, 0.9, 0.6] };
const COPY = STRIPES[2];
const BROKEN = "#9aa5b1";
/** The cards on the belt: spine color and whether curation keeps it. */
const CUR_CARDS = [
	{ stripe: COPY, keep: true },
	{ stripe: COPY, keep: false },
	{ stripe: STRIPES[0], keep: true },
	{ stripe: COPY, keep: false },
	{ stripe: STRIPES[3], keep: true },
	{ stripe: BROKEN, keep: false },
];
const CARD_GAP = 0.7;
const CARD_V = 0.42;

/** Where curation card i is at time t: null when it is hidden (inside a bin). */
function curationCard(i, t) {
	const n = CUR_CARDS.length;
	const cycle = n * CARD_GAP;
	const u = (((t * CARD_V + i * CARD_GAP) % cycle) + cycle) % cycle;
	const reject = !CUR_CARDS[i].keep;
	const uPush = CUR.x0 - CUR.pusher;
	const uEnd = CUR.x0 - CUR.x1;
	const z = CUR.zt + 0.03;
	if (reject && u >= uPush) {
		const k = (u - uPush) / 0.55;
		if (k > 1) return null;
		const e = smooth(k);
		return { x: CUR.pusher, y: CUR.y - 1.55 * e, z: z - 0.2 * e, a: 0.6 * e, reject, push: u - uPush };
	}
	if (u <= uEnd) return { x: CUR.x0 - u, y: CUR.y, z, a: 0, reject };
	const k = (u - uEnd) / 0.35;
	if (k > 1) return null;
	return { x: CUR.x1 - 0.4 * k, y: CUR.y, z: z - 0.25 * k, a: 0.3 * k, reject };
}

function buildCuration(scene, ctx) {
	const g = ctx.group;
	const [bx, by, bw, bd, bh] = CUR.rejectBin;
	const binGrey = "#8e98a4";
	// Behind the belt: the drop bin, chute, and the back post of the scanner arch.
	object(
		scene,
		34.1,
		75.2,
		36.0,
		77.3,
		1.5,
		(r) => {
			r.quad(
				[
					[34.3, 77.25, CUR.zt - 0.05],
					[34.9, 77.25, CUR.zt - 0.05],
					[34.9, by + bd, bh],
					[34.3, by + bd, bh],
				],
				PAL.metal,
			);
			r.box(bx, by, 0, bw, bd, bh, binGrey, { top: shade(binGrey, 0.55) });
			for (let k = 0; k < 2; k++) drawCard(r, bx + 0.45 - k * 0.1, by + 0.5, bh - 0.08 + k * 0.035, 0.5 + k * 0.7, COPY, { scale: 0.9 });
			r.line([bx + 0.27, by + bd + 0.01, 0.14], [bx + 0.63, by + bd + 0.01, 0.42], "#ffffff", 2.4);
			r.line([bx + 0.27, by + bd + 0.01, 0.42], [bx + 0.63, by + bd + 0.01, 0.14], "#ffffff", 2.4);
			r.box(CUR.arch - 0.05, 77.0, 0, 0.1, 0.1, 1.45, PAL.dark);
		},
		{ group: g },
	);
	for (const [x0, x1] of [
		[CUR.x1, 35.15],
		[35.15, CUR.x0 + 0.1],
	])
		object(scene, x0, CUR.y - 0.35, x1, CUR.y + 0.35, CUR.zt + 0.05, (r) => convX(r, x0, x1, CUR.y, 0.7, CUR.zt), { group: g });
	const [kx, ky, kw, kd, kh] = CUR.keepBin;
	object(
		scene,
		kx,
		ky,
		kx + kw,
		ky + kd,
		kh,
		(r) => {
			r.box(kx, ky, 0, kw, kd, kh, R4.keep, { top: shade(R4.keep, 0.55) });
			const kept = [STRIPES[0], STRIPES[3], COPY];
			for (let k = 0; k < 3; k++) drawCard(r, kx + 0.4, ky + 0.45, kh - 0.12 + k * 0.035, 0.2 + k * 0.5, kept[k], { scale: 0.85 });
		},
		{ group: g },
	);
	// Cards: one dynamic item each, so they sort against the scanner arch and the pusher.
	CUR_CARDS.forEach((card, i) => {
		const pos = () => curationCard(i, still(ctx, scene.time, 3.1));
		scene.addDynamic({
			group: g,
			depth: () => {
				const p = pos();
				return p ? p.x + p.y : 0;
			},
			bounds: () => {
				const p = pos();
				return p ? [p.x - 0.3, p.y - 0.3, p.z, p.x + 0.3, p.y + 0.3, p.z + 0.1] : [CUR.x1 - 0.5, CUR.y - 0.3, 0.6, CUR.x1, CUR.y + 0.3, 0.9];
			},
			animated: () => true,
			draw: (r) => {
				const p = pos();
				if (p) drawCard(r, p.x, p.y, p.z, p.a, card.stripe);
			},
		});
	});
	// The pusher on the front side of the belt (in front of the cards it pushes).
	scene.addDynamic({
		group: g,
		depth: CUR.pusher + 78.3,
		bounds: [CUR.pusher - 0.4, 77.2, 0, CUR.pusher + 0.4, 78.6, 1.1],
		animated: () => true,
		draw: (r) => {
			const tt = still(ctx, scene.time, 3.1);
			let ext = 0;
			CUR_CARDS.forEach((card, i) => {
				if (card.keep) return;
				const p = curationCard(i, tt);
				if (p?.push !== undefined) ext = Math.max(ext, Math.sin(Math.min(1, p.push / 0.55) * Math.PI));
			});
			const x = CUR.pusher;
			r.box(x - 0.08, 78.05, 0, 0.16, 0.16, CUR.zt, PAL.dark);
			const rodY = 78.05 - 0.7 * ext;
			r.box(x - 0.03, rodY, CUR.zt + 0.06, 0.06, 78.1 - rodY, 0.06, PAL.metal);
			r.box(x - 0.18, rodY - 0.04, CUR.zt + 0.02, 0.36, 0.06, 0.14, R4.purple);
			r.box(x - 0.2, 78.05, CUR.zt - 0.02, 0.4, 0.4, 0.2, PAL.steel);
		},
	});
	// Scanner arch front post, top bar, and light curtain: live, in front of the cards.
	scene.add({
		group: g,
		live: true,
		bounds: [CUR.arch - 0.15, 76.9, 0, CUR.arch + 0.15, 78.2, 1.65],
		depth: CUR.arch + CUR.y + 0.42,
		draw: (r, t = 0) => {
			const a = ctx.reducedMotion() ? 0.22 : 0.16 + 0.08 * Math.sin(t * 5);
			r.quad(
				[
					[CUR.arch, 77.1, CUR.zt + 0.05],
					[CUR.arch, 78.0, CUR.zt + 0.05],
					[CUR.arch, 78.0, 1.38],
					[CUR.arch, 77.1, 1.38],
				],
				`rgba(150,232,248,${a.toFixed(2)})`,
				{ flat: true },
			);
			r.box(CUR.arch - 0.05, 77.95, 0, 0.1, 0.1, 1.45, PAL.dark);
			r.box(CUR.arch - 0.12, 76.95, 1.4, 0.24, 1.15, 0.18, R4.purple, { top: shade(R4.purple, 1.15) });
			r.box(CUR.arch - 0.08, 77.42, 1.3, 0.16, 0.36, 0.1, PAL.dark);
		},
	});
}

// ---------------------------------------------------------------------------
// Row 1: dataset (a library of shelved episodes)

function shelfRow(r, x0, x1, y0, d, seed) {
	const levels = [0.12, 0.66, 1.2, 1.74, 2.28];
	r.box(x0, y0, 0.12, 0.06, d, 2.2, PAL.wood);
	levels.forEach((z, li) => {
		r.box(x0, y0, z, x1 - x0, d, 0.04, shade(PAL.wood, 1.08));
		if (li === levels.length - 1) return;
		let x = x0 + 0.1;
		let n = seed + li * 7;
		while (x < x1 - 0.16) {
			n = (n * 9301 + 49297) % 233280;
			const v = n / 233280;
			if (v < 0.08) {
				x += 0.16;
				continue;
			}
			const color = STRIPES[Math.floor(v * 97) % STRIPES.length];
			const hh = 0.34 + v * 0.1;
			r.box(x, y0 + 0.06, z + 0.04, 0.11, d - 0.12, hh, color, { top: shade(color, 1.2) });
			x += 0.135;
		}
	});
	r.box(x1 - 0.06, y0, 0.12, 0.06, d, 2.2, PAL.wood);
}

function buildDataset(scene, ctx) {
	object(
		scene,
		27.85,
		74.85,
		32.35,
		79.2,
		3.1,
		(r) => {
			r.box(28.0, 75.0, 0, 4.2, 4.1, 0.12, "#cfc8bb", { top: "#ddd6c9" });
			r.box(28.0, 75.0, 0.12, 4.2, 0.22, 2.75, PAL.wall);
			r.box(28.0, 75.22, 0.12, 0.22, 3.6, 2.75, PAL.wall);
			shelfRow(r, 28.45, 31.75, 75.55, 0.5, 11);
			shelfRow(r, 28.45, 31.75, 77.05, 0.5, 23);
			r.box(31.98, 75.22, 0.12, 0.22, 3.6, 2.75, PAL.wall);
			wallRect(r, "y", 32.205, 75.6, 78.4, 2.25, 2.55, R4.purple);
			r.box(28.0, 78.62, 0.12, 0.26, 0.26, 2.75, PAL.wall);
			r.box(27.85, 74.85, 2.87, 4.5, 4.35, 0.2, R4.purple, { top: shade(R4.purple, 1.15) });
			r.box(28.6, 75.6, 3.07, 3.2, 3.0, 0.08, shade(R4.purple, 0.9));
		},
		{ group: ctx.group },
	);
}

// The dataset feeds the training building: a cable trench across the first track row.
const TRENCH = [
	[30.5, 79.25],
	[30.5, 81.6],
	[31.3, 82.5],
	[31.3, 86.1],
];

function buildTrench(scene, ctx) {
	const pts = TRENCH.map(([x, y]) => [x, y, 0.012]);
	scene.add({
		group: ctx.group,
		layer: LAYER.GROUND,
		depth: -60,
		bounds: [30.2, 79.2, 0, 31.6, 86.2, 0.02],
		draw: (r) => {
			r.polyline(pts, "#6d5a8c", 7);
			r.polyline(pts, R4.data, 1.6);
		},
	});
	const L = polyLen(TRENCH);
	scene.addDynamic({
		group: ctx.group,
		depth: 0,
		bounds: [30.2, 79.2, 0, 31.6, 86.2, 0.2],
		animated: () => true,
		draw: (r, t) => {
			const rm = ctx.reducedMotion();
			for (let k = 0; k < 4; k++) {
				const u = phase(rm ? 0.2 : t * 0.25, 1, k / 4);
				const p = pointOn(TRENCH, u * L);
				if (p[1] > 84.3) continue; // past here the training building hides the trench
				r.sphere(p[0], p[1], 0.05, 0.06, R4.dataHi, 0);
			}
		},
	});
}

// ---------------------------------------------------------------------------
// Row 2: training. Training runs for hours on one powerful graphics chip, away from the robot:
// the building's front is one giant graphics card, and a progress meter fills on its side.

const GPU_FANS = [30.55, 31.45, 32.35];
const GPU = { y: 91.41, z: 1.12, r: 0.36 };
const ROOF_VENTS = [
	[30.55, 87.6],
	[32.25, 87.6],
	[30.55, 89.5],
	[32.25, 89.5],
];

function buildTraining(scene, ctx) {
	const g = ctx.group;
	object(
		scene,
		29.5,
		86.0,
		33.3,
		91.6,
		2.7,
		(r) => {
			r.box(29.5, 86.0, 0, 3.8, 5.6, 0.12, PAL.stone);
			r.box(29.7, 86.2, 0.12, 3.4, 5.2, 2.3, R4.slate, { top: "#4f5d72" });
			// The graphics card: shroud, three fan wells, gold edge connector, metal bracket.
			const y = 91.405;
			wallRect(r, "x", y, 29.92, 32.86, 0.62, 1.66, "#252d38");
			wallRect(r, "x", y + 0.002, 29.98, 32.8, 1.56, 1.62, R4.purple);
			for (const fx of GPU_FANS) r.quad(circlePoints(fx, GPU.z, GPU.r + 0.04, 14).map(([u, z]) => [u, y + 0.003, z]), "#151a21", { flat: true });
			wallRect(r, "x", y, 30.25, 32.3, 0.48, 0.62, "#d9b44a");
			for (let x = 30.33; x < 32.25; x += 0.13) wallRect(r, "x", y + 0.002, x, x + 0.05, 0.5, 0.6, "#b8902f");
			wallRect(r, "x", y, 32.88, 33.02, 0.42, 1.86, "#b8c0ca");
			for (let k = 0; k < 4; k++) wallRect(r, "y", 33.105, 86.6, 91.0, 0.35 + k * 0.18, 0.43 + k * 0.18, "#2b3442");
			wallRect(r, "y", 33.105, 86.8, 90.85, 1.28, 1.86, R4.purple);
			wallRect(r, "y", 33.11, 86.88, 90.77, 1.34, 1.8, "#1d2633");
			wallRect(r, "x", 91.406, 29.7, 33.1, 2.25, 2.42, R4.purple);
			for (const [fx, fy] of ROOF_VENTS) {
				r.cylinder(fx, fy, 2.42, 0.42, 0.12, "#2b3442", 10);
				r.groundPoly(circlePoints(fx, fy, 0.34, 10), "#151a21", 2.545);
			}
		},
		{ group: g },
	);
	scene.addDynamic({
		group: g,
		depth: 121,
		bounds: [29.6, 86.1, 0, 33.2, 91.5, 2.7],
		animated: () => true,
		draw: (r, t) => {
			const rm = ctx.reducedMotion();
			const tt = still(ctx, t, 9.5);
			// Roof vent blades.
			for (const [fx, fy] of ROOF_VENTS) {
				const a0 = rm ? 0.4 : t * 4 + fx;
				for (let b = 0; b < 3; b++) {
					const a = a0 + (b * Math.PI * 2) / 3;
					const P = (rad, da) => [fx + Math.cos(a + da) * rad, fy + Math.sin(a + da) * rad, 2.56];
					r.quad([P(0.05, -1.1), P(0.3, -0.32), P(0.3, 0.32), P(0.05, 1.1)], "#9aa5b1", { flat: true });
				}
			}
			// The graphics card's fans spin in the wall plane.
			const y = GPU.y + 0.01;
			for (const fx of GPU_FANS) {
				const a0 = rm ? 0.3 : -t * 7 + fx * 3;
				for (let b = 0; b < 5; b++) {
					const a = a0 + (b * Math.PI * 2) / 5;
					const P = (rad, da) => [fx + Math.cos(a + da) * rad, y, GPU.z + Math.sin(a + da) * rad];
					r.quad([P(0.07, -0.5), P(GPU.r - 0.02, -0.2), P(GPU.r - 0.02, 0.22), P(0.07, 0.4)], "#8a96a6", { flat: true });
				}
				r.quad(
					circlePoints(fx, GPU.z, 0.08, 8).map(([u, z]) => [u, y + 0.002, z]),
					R4.purple,
					{ flat: true },
				);
			}
			// Progress meter fills from the front end toward the back (left to right on screen).
			const f = smooth(phase(tt, 14, 6) * 1.1);
			const yEnd = 90.77;
			wallRect(r, "y", 33.115, yEnd - f * (90.77 - 86.88), yEnd, 1.38, 1.76, R4.lit);
		},
	});
}

// ---------------------------------------------------------------------------
// Row 2: simulation. Translucent copies of the grape station practice inside a dome; every
// episode gets random lighting and sometimes a fogged lens, and the bunches are rough shapes.

const SIM = { c: [35.9, 88.7], r: 1.95, z: 0.2 };
const SIM_CELLS = [
	[35.3, 88.15],
	[36.5, 88.15],
	[35.3, 89.3],
	[36.5, 89.3],
];
const SIM_LIGHTS = ["rgba(255,214,120,0.32)", "rgba(120,190,255,0.3)", "rgba(255,140,170,0.26)", "rgba(150,255,190,0.26)", "rgba(200,160,255,0.3)"];
const DOME = (() => {
	const lat = 4;
	const lon = 14;
	const [cx, cy] = SIM.c;
	const pt = (i, j) => {
		const th = (i / lat) * (Math.PI / 2);
		const ph = (j / lon) * Math.PI * 2;
		return [cx + Math.sin(th) * Math.cos(ph) * SIM.r, cy + Math.sin(th) * Math.sin(ph) * SIM.r, SIM.z + Math.cos(th) * SIM.r];
	};
	const faces = [];
	for (let i = 0; i < lat; i++)
		for (let j = 0; j < lon; j++) {
			if (i === 0) faces.push([pt(0, 0), pt(1, j), pt(1, j + 1)]);
			else faces.push([pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)]);
		}
	return faces;
})();

/** A rough stand-in bunch: three blobs, as a simulator approximates grapes. */
function roughBunch(r, x, y, z) {
	r.sphere(x, y, z - 0.07, 0.05, "#b98ad6", 0);
	r.sphere(x - 0.035, y + 0.02, z - 0.02, 0.045, "#c79ce0", 0);
	r.sphere(x + 0.035, y - 0.01, z - 0.02, 0.045, "#b98ad6", 0);
}

function buildSimulation(scene, ctx) {
	const g = ctx.group;
	const [cx, cy] = SIM.c;
	object(
		scene,
		cx - 2.1,
		cy - 2.1,
		cx + 2.1,
		cy + 2.1,
		0.25,
		(r) => {
			r.cylinder(cx, cy, 0, SIM.r + 0.13, SIM.z, "#cfd6de", 18);
			r.groundPoly(circlePoints(cx, cy, SIM.r - 0.05, 18), "#1f2b44", SIM.z + 0.005);
			for (let k = -3; k <= 3; k++) {
				const d = k * 0.5;
				const hh = Math.sqrt(Math.max(0, (SIM.r - 0.1) ** 2 - d * d));
				r.line([cx + d, cy - hh, SIM.z + 0.01], [cx + d, cy + hh, SIM.z + 0.01], "rgba(90,200,240,0.5)", 1);
				r.line([cx - hh, cy + d, SIM.z + 0.01], [cx + hh, cy + d, SIM.z + 0.01], "rgba(90,200,240,0.5)", 1);
			}
			r.polyline(
				circlePoints(cx, cy, SIM.r - 0.05, 24).map(([x, y]) => [x, y, SIM.z + 0.01]),
				R4.data,
				1.8,
			);
		},
		{ group: g },
	);
	scene.addDynamic({
		group: g,
		depth: cx + cy + 0.4,
		bounds: [cx - 2, cy - 2, 0, cx + 2, cy + 2, 1.3],
		animated: () => true,
		draw: (r, t) => {
			const tt = still(ctx, t, 1.4);
			const c2d = r.ctx;
			SIM_CELLS.forEach(([sx, sy], i) => {
				const period = 3.0 + i * 0.25;
				const episode = Math.floor((tt + i * 0.9) / period);
				const base = [sx - 0.22, sy - 0.32];
				const from = [sx - 0.3, sy + 0.28];
				const to = [sx + 0.34, sy + 0.14];
				// Random lighting per episode (domain randomization).
				r.groundPoly(circlePoints(sx, sy, 0.56, 12), SIM_LIGHTS[(episode * 3 + i) % SIM_LIGHTS.length], SIM.z + 0.012);
				const k = shuttle(tt + i * 0.9, period);
				const u = phase(tt + i * 0.9, period);
				const down = dip(tt + i * 0.9, period);
				const carrying = u > 0.1 && u < 0.6;
				const [x, y] = lerp2(from, to, k);
				const z = SIM.z + 0.22 + 0.2 * (1 - down);
				c2d.save();
				c2d.globalAlpha = 0.6;
				r.box(from[0] - 0.14, from[1] - 0.12, SIM.z, 0.28, 0.24, 0.08, GHOST.accent, { alpha: 0.5 });
				r.box(to[0] - 0.12, to[1] - 0.09, SIM.z, 0.24, 0.18, 0.04, "#e8d7b4", { alpha: 0.6 });
				if (!carrying) roughBunch(r, u >= 0.6 ? to[0] : from[0], u >= 0.6 ? to[1] : from[1], SIM.z + 0.16);
				drawSixAxis(r, base[0], base[1], [x, y, z], { scale: 0.6, z: SIM.z, tool: "fingers", grip: carrying ? 0 : 1, colors: GHOST });
				if (carrying) roughBunch(r, x, y, z - 0.02);
				c2d.restore();
				// A fogged lens in some episodes: a milky veil over the cell.
				if ((episode + i) % 3 === 0) r.groundPoly(circlePoints(sx, sy, 0.5, 12), "rgba(240,248,255,0.4)", SIM.z + 0.95);
			});
		},
	});
	// The glass dome: live, drawn after the ghosts it covers.
	scene.add({
		group: g,
		live: true,
		bounds: [cx - SIM.r, cy - SIM.r, 0, cx + SIM.r, cy + SIM.r, SIM.z + SIM.r],
		depth: cx + cy + 1.2,
		draw: (r) => r.mesh(DOME, "rgba(214,243,255,0.2)", { center: [cx, cy, SIM.z], flat: true, edge: "rgba(255,255,255,0.75)" }),
	});
}

// ---------------------------------------------------------------------------
// Row 2: real-eval. The real grape station runs trials; both models run the same trials in
// random order, and the scoreboard keeps one row per model (TRIALS in ride4-common.js).

const EVAL = { base: [40.5, 87.8], tote: [39.5, 88.6, 0.7, 0.6, 0.3], tray: [41.15, 88.9, 0.32], board: { x0: 39.0, x1: 42.0, y: 86.34, z0: 1.33, z1: 2.47 }, period: 3.6 };
const EVAL_PICK = { base: EVAL.base, bz: 0.2, scale: 1.0, tote: EVAL.tote, tray: EVAL.tray, trayScale: 0.95, period: EVAL.period, lift: 0.3 };
const EVAL_ROWS = { 0: 2.05, 1: 1.6 }; // mark-center height per model: old on top, new below
const MODEL_COLOR = { 0: "#9aa3ad", 1: R4.purple };

function markRect(model, index) {
	const b = EVAL.board;
	const x0 = b.x0 + 0.42;
	const pitch = (b.x1 - 0.12 - x0) / 20;
	const x = x0 + pitch * (index + 0.5);
	return [x - pitch * 0.34, x + pitch * 0.34, EVAL_ROWS[model] - 0.14, EVAL_ROWS[model] + 0.14];
}

function buildRealEval(scene, ctx) {
	const g = ctx.group;
	const b = EVAL.board;
	object(
		scene,
		38.7,
		86.0,
		42.3,
		91.4,
		2.7,
		(r) => {
			r.box(38.7, 86.0, 0, 3.6, 5.4, 0.08, R4.pad, { top: R4.padTop });
			r.polyline(
				[
					[38.9, 86.9, 0.085],
					[42.1, 86.9, 0.085],
					[42.1, 91.2, 0.085],
					[38.9, 91.2, 0.085],
				],
				PAL.safety,
				2.6,
				true,
			);
			r.box(38.95, 86.15, 0.08, 0.12, 0.12, 2.5, PAL.dark);
			r.box(41.93, 86.15, 0.08, 0.12, 0.12, 2.5, PAL.dark);
			r.box(38.9, 86.2, 1.25, 3.2, 0.12, 1.3, R4.purple, { top: shade(R4.purple, 1.15) });
			wallRect(r, "x", b.y - 0.01, b.x0, b.x1, b.z0, b.z1, "#1d2633");
			for (const m of [0, 1]) {
				// A model chip at the start of each row: grey for the old model, purple for the new.
				wallRect(r, "x", b.y, b.x0 + 0.1, b.x0 + 0.32, EVAL_ROWS[m] - 0.14, EVAL_ROWS[m] + 0.14, MODEL_COLOR[m]);
				for (let i = 0; i < 20; i++) {
					const [u0, u1, z0, z1] = markRect(m, i);
					wallRect(r, "x", b.y, u0, u1, z0, z1, "#2a3647");
				}
			}
			stackPole(r, 42.15, 86.75, 1.6);
			r.box(40.2, 87.5, 0.08, 0.6, 0.6, 0.12, PAL.steel);
			tote(r, EVAL.tote[0], EVAL.tote[1], EVAL.tote[2], EVAL.tote[3], EVAL.tote[4], "#2f6fb3");
			toteGrapes(r, EVAL.tote, PICK_SPOT);
			r.box(40.87, 88.67, 0.08, 0.56, 0.46, 0.24, PAL.steel);
			drawPlate(r, EVAL.tray[0], EVAL.tray[1], EVAL.tray[2], 0, {}, { scale: 0.95 });
		},
		{ group: g },
	);
	const runs = TRIALS.runs;
	const cycle = runs.length + 3; // all trials, then a short pause with the full board
	const trialAt = (t) => (ctx.reducedMotion() ? cycle - 1 : Math.floor(t / EVAL.period + 6) % cycle);
	// Marks appear one per finished trial (behind the robot, in front of the board).
	scene.addDynamic({
		group: g,
		depth: 40.5 + 86.4,
		bounds: [38.8, 86.1, 0, 42.4, 87.0, 2.6],
		animated: () => true,
		draw: (r, t) => {
			const done = Math.min(trialAt(t), runs.length);
			const y = b.y + 0.01;
			for (let j = 0; j < done; j++) {
				const run = runs[j];
				const [u0, u1, z0, z1] = markRect(run.model, run.index);
				wallRect(r, "x", y, u0, u1, z0, z1, run.pass ? R4.lit : "#ff6a5c");
			}
			const last = done > 0 ? runs[done - 1].pass : 1;
			lamp(r, 42.15, 86.75, 1.72, done > 0, last ? R4.lit : R4.reject, 0.09);
		},
	});
	scene.addDynamic({
		group: g,
		depth: EVAL.base[0] + EVAL.base[1] + 0.5,
		bounds: [39.3, 86.9, 0, 42.0, 89.6, 2.2],
		animated: () => true,
		draw: (r, t) => {
			const j = trialAt(t);
			const run = runs[j < runs.length ? j : 0];
			drawGrapePick(r, ctx.reducedMotion() ? 1.4 : t + 6 * EVAL.period, { ...EVAL_PICK, fail: j < runs.length && !run.pass });
		},
	});
}

// ---------------------------------------------------------------------------
// Row 2: rollout. The update leaves the release gate for the company's grape stations (ten lines
// in three kitchens): first the canary station watches in shadow mode (blue), then it drives
// (green), then its whole kitchen, then every kitchen. The old model stays on every station.

const ROLL_PADS = [
	{ c: [44.45, 88.05], w: 1.3, d: 1.05, cells: [[0.3, -0.25], [-0.3, -0.25], [0.3, 0.25], [-0.3, 0.25]] },
	{ c: [46.15, 89.4], w: 0.8, d: 1.35, cells: [[0, -0.42], [0, 0], [0, 0.42]] },
	{ c: [44.6, 90.55], w: 1.4, d: 0.8, cells: [[-0.42, 0], [0, 0], [0.42, 0]] },
];
const ROLL_CELLS = ROLL_PADS.flatMap((p, k) => p.cells.slice(0, KITCHENS[k] ?? p.cells.length).map(([dx, dy], i) => ({ x: p.c[0] + dx, y: p.c[1] + dy, kitchen: k, canary: k === 0 && i === 0 })));
const ROLL_DRAW = [...ROLL_CELLS].sort((a, b) => a.x + a.y - (b.x + b.y));
const GATE_LAMPS = [44.3, 44.8, 45.3, 45.8];
const PLINTH = [45.1, 86.1];

/** Rollout stage at time t: 0 none, 1 shadow, 2 canary, 3 one kitchen, 4 every kitchen. */
function rolloutStage(ctx, t) {
	if (ctx.reducedMotion()) return 3;
	const u = phase(t, 12);
	return u < 0.06 ? 0 : u < 0.28 ? 1 : u < 0.5 ? 2 : u < 0.72 ? 3 : 4;
}

function cellState(cell, stage) {
	if (stage >= 4 || (stage >= 3 && cell.kitchen === 0) || (stage >= 2 && cell.canary)) return "new";
	if (stage === 1 && cell.canary) return "shadow";
	return "old";
}

function buildRollout(scene, ctx) {
	const g = ctx.group;
	object(
		scene,
		43.1,
		85.6,
		47.1,
		91.5,
		2.4,
		(r) => {
			r.box(43.3, 86.95, 0, 3.6, 4.35, 0.06, "#d5d9df", { top: "#e2e5e9" });
			for (const p of ROLL_PADS) {
				r.polyline(
					[
						[PLINTH[0], PLINTH[1] + 0.4, 0.065],
						[p.c[0], p.c[1], 0.065],
					],
					shade(R4.purple, 1.25),
					2,
				);
			}
			for (const p of ROLL_PADS) r.box(p.c[0] - p.w / 2, p.c[1] - p.d / 2, 0.06, p.w, p.d, 0.04, "#f3efe6", { top: "#f8f5ee" });
			// Release gate with the sealed update on a plinth.
			r.box(44.75, 85.75, 0, 0.7, 0.7, 0.5, PAL.stone);
			r.box(44.86, 85.86, 0.5, 0.48, 0.48, 0.36, R4.purple);
			wallRect(r, "x", 86.345, 45.06, 45.14, 0.5, 0.86, "#f4f0e8");
			r.quad(
				[
					[45.06, 85.86, 0.862],
					[45.14, 85.86, 0.862],
					[45.14, 86.34, 0.862],
					[45.06, 86.34, 0.862],
				],
				"#f4f0e8",
				{ flat: true },
			);
			for (const x of [43.85, 46.25]) r.box(x - 0.1, 85.9, 0, 0.2, 0.2, 1.9, R4.purple);
			r.box(43.7, 85.85, 1.9, 2.75, 0.3, 0.3, R4.purple, { top: shade(R4.purple, 1.15) });
			for (const x of GATE_LAMPS) wallRect(r, "x", 86.152, x - 0.13, x + 0.13, 1.94, 2.16, "#2b3038");
			// Grape stations: a white block each, with a small grey block beside it for the old model
			// file that stays on disk.
			for (const c of ROLL_DRAW) {
				r.box(c.x - 0.11, c.y - 0.11, 0.1, 0.22, 0.22, 0.18, "#eef1f4", { top: "#f8f9fa" });
				r.box(c.x + 0.11, c.y - 0.06, 0.1, 0.07, 0.12, 0.09, "#9aa3ad");
				r.cylinder(c.x, c.y, 0.28, 0.022, 0.07, PAL.dark, 5);
			}
		},
		{ group: g },
	);
	scene.addDynamic({
		group: g,
		depth: 45.1 + 89.5 + 0.3,
		bounds: [43.1, 85.8, 0, 47.1, 91.5, 2.3],
		animated: () => true,
		draw: (r, t) => {
			const stage = rolloutStage(ctx, t);
			GATE_LAMPS.forEach((x, i) => lamp(r, x, 86.17, 2.05, i < stage, i === 0 ? R4.data : R4.lit, 0.08));
			for (const c of ROLL_DRAW) {
				const s = cellState(c, stage);
				lamp(r, c.x, c.y, 0.39, s !== "old", s === "shadow" ? R4.data : R4.lit, 0.065);
			}
		},
	});
}

// ---------------------------------------------------------------------------
// Row 2: fleet. A tabletop map of the three kitchens, each with one lamp per line's grape
// station (grey: old model, green: new model). Heartbeats run to the fleet manager's tower, and
// the dashboard screen behind shows each station's misses. As the update spreads line by line,
// one station's misses rise; it turns red and is pointed back at the old model.

const FLEET = { hub: [50.9, 90.05], top: 0.8, screen: { x0: 48.25, x1: 51.15, y: 86.8, z0: 0.95, z1: 1.75 } };
const FLEET_KITCHENS = [
	[48.75, 87.65],
	[50.55, 88.2],
	[49.3, 89.75],
];
const FLEET_STATIONS = FLEET_KITCHENS.flatMap(([kx, ky], k) => {
	const n = KITCHENS[k] ?? 3;
	return Array.from({ length: n }, (_, j) => ({ x: kx + (j - (n - 1) / 2) * 0.17, y: ky + 0.36, kitchen: k }));
});
const FLEET_PERIOD = 14;
const FLEET_REGRESS = 5; // the station whose misses rise (second line of the second kitchen)

/** State of fleet station i at time u in [0, FLEET_PERIOD): "old" | "new" | "worse", and its misses. */
function fleetStation(i, u) {
	const on = 0.5 + i * 0.85;
	if (i === FLEET_REGRESS && u >= 9) {
		const rise = smooth((u - 9) / 1.5);
		if (u < 10.8) return { state: u >= 9.8 ? "worse" : "new", misses: 0.1 + 0.4 * rise };
		return { state: "old", misses: 0.1 + 0.4 * (1 - smooth((u - 10.8) / 1.2)) };
	}
	return { state: u >= on ? "new" : "old", misses: 0.08 + 0.05 * ((i * 7) % 3) / 2 };
}

const FLEET_COLOR = { old: "#9aa3ad", new: R4.lit, worse: R4.reject };

function buildFleet(scene, ctx) {
	const z = FLEET.top;
	const S = FLEET.screen;
	const n = FLEET_STATIONS.length;
	const barX = (i) => {
		const k = FLEET_STATIONS[i].kitchen;
		return S.x0 + 0.22 + i * 0.21 + k * 0.22;
	};
	object(
		scene,
		47.9,
		86.5,
		51.5,
		90.9,
		1.8,
		(r) => {
			for (const [x, y] of [
				[48.1, 86.7],
				[51.2, 86.7],
				[48.1, 90.6],
				[51.2, 90.6],
			])
				r.box(x - 0.05, y - 0.05, 0, 0.1, 0.1, 0.72, PAL.dark);
			r.box(48.0, 86.6, 0.72, 3.4, 4.2, 0.08, PAL.wood, { top: "#c48d58" });
			r.ground(48.1, 86.7, 3.2, 4.0, "#9bd37f", z + 0.005);
			r.groundPoly(
				[
					[48.1, 88.85],
					[48.9, 88.9],
					[49.9, 89.1],
					[51.3, 88.95],
					[51.3, 89.17],
					[49.9, 89.32],
					[48.9, 89.12],
					[48.1, 89.07],
				],
				PAL.water,
				z + 0.007,
			);
			// Dashboard screen at the back of the table.
			for (const x of [S.x0 + 0.1, S.x1 - 0.1]) r.box(x - 0.04, S.y - 0.04, z, 0.08, 0.08, S.z0 - z, PAL.dark);
			r.box(S.x0, S.y - 0.06, S.z0, S.x1 - S.x0, 0.06, S.z1 - S.z0, PAL.dark);
			wallRect(r, "x", S.y + 0.001, S.x0 + 0.05, S.x1 - 0.05, S.z0 + 0.05, S.z1 - 0.05, "#1d2633");
			// Heartbeat lines from each kitchen to the tower.
			for (const [kx, ky] of FLEET_KITCHENS) r.line([FLEET.hub[0], FLEET.hub[1], z + 0.009], [kx, ky, z + 0.009], "#f1ead9", 1.8);
			const kitchens = [...FLEET_KITCHENS].sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
			for (const [px, py] of kitchens) {
				r.box(px - 0.32, py - 0.2, z, 0.64, 0.4, 0.22, "#eef1f4", { top: "#dfe4ea" });
				for (let k = 0; k < 3; k++)
					r.prism(
						[
							[px - 0.32 + k * 0.213, py - 0.2],
							[px - 0.32 + (k + 1) * 0.213, py - 0.2],
							[px - 0.32 + (k + 1) * 0.213, py + 0.2],
							[px - 0.32 + k * 0.213, py + 0.2],
						],
						z + 0.22,
						0.001,
						"#c9ced6",
					);
				r.cylinder(px + 0.2, py - 0.1, z + 0.22, 0.035, 0.2, "#b5543c", 6);
			}
			for (const s of FLEET_STATIONS) r.cylinder(s.x, s.y, z, 0.012, 0.16, PAL.dark, 4);
			r.box(FLEET.hub[0] - 0.12, FLEET.hub[1] - 0.12, z, 0.24, 0.24, 0.1, PAL.dark);
			r.cylinder(FLEET.hub[0], FLEET.hub[1], z + 0.1, 0.03, 0.5, R4.purple, 6);
			r.sphere(FLEET.hub[0], FLEET.hub[1], z + 0.63, 0.06, R4.purpleLight, 0);
		},
		{ group: ctx.group },
	);
	scene.addDynamic({
		group: ctx.group,
		depth: 49.7 + 88.7 + 0.2,
		bounds: [47.9, 86.5, 0, 51.5, 90.9, 1.8],
		animated: () => true,
		draw: (r, t) => {
			const rm = ctx.reducedMotion();
			const u = rm ? 10.3 : ((t % FLEET_PERIOD) + FLEET_PERIOD) % FLEET_PERIOD;
			const states = FLEET_STATIONS.map((s, i) => fleetStation(i, u));
			// Dashboard: one bar per station (misses), and its version chip below.
			for (let i = 0; i < n; i++) {
				const x = barX(i);
				const st = states[i];
				wallRect(r, "x", S.y + 0.004, x - 0.06, x + 0.06, S.z0 + 0.09, S.z0 + 0.15, FLEET_COLOR[st.state]);
				wallRect(r, "x", S.y + 0.004, x - 0.05, x + 0.05, S.z0 + 0.2, S.z0 + 0.2 + st.misses, st.state === "worse" || st.misses > 0.2 ? "#ff6a5c" : R4.dataHi);
			}
			// Lamps on the map and heartbeats to the tower.
			const order = FLEET_STATIONS.map((s, i) => i).sort((a, b) => FLEET_STATIONS[a].x + FLEET_STATIONS[a].y - (FLEET_STATIONS[b].x + FLEET_STATIONS[b].y));
			for (const i of order) {
				const s = FLEET_STATIONS[i];
				const st = states[i].state;
				lamp(r, s.x, s.y, z + 0.2, st !== "old", FLEET_COLOR[st], 0.05);
			}
			if (!rm)
				FLEET_KITCHENS.forEach(([kx, ky], k) => {
					const p = phase(t, 1.6, k * 0.37);
					if (p > 0.6) return;
					const [x, y] = lerp2([kx, ky], FLEET.hub, p / 0.6);
					r.sphere(x, y, z + 0.05, 0.035, R4.dataHi, 0);
				});
		},
	});
}

// ---------------------------------------------------------------------------
// Row 2: next-pick. The grape pick now succeeds on its own. The policy runs on a computer beside
// the arm and plans about a second of motion at a time: the dots ahead of the fingers are the
// current chunk of targets, replanned every half second.

const NEXT = { base: [53.65, 87.9], tote: [52.55, 88.7, 0.7, 0.6, 0.32], tray: [54.45, 89.0, 0.46], computer: [54.2, 86.45, 0.5, 0.45, 0.95] };
const NEXT_PICK = { base: NEXT.base, bz: 0.2, scale: 1.05, tote: NEXT.tote, tray: NEXT.tray, period: 3.8, lift: 0.34, trayDrawsGrapes: true };
const CHUNK = { len: 0.95, every: 0.475, n: 8 };

function buildNextPick(scene, ctx) {
	const g = ctx.group;
	const [ex, ey, ew, ed, eh] = NEXT.computer;
	object(
		scene,
		52.3,
		85.9,
		55.6,
		91.5,
		2.2,
		(r) => {
			r.box(52.3, 86.0, 0, 3.3, 5.4, 0.08, R4.pad, { top: R4.padTop });
			r.ground(52.3, 91.27, 3.3, 0.13, R4.purple, 0.082);
			// A green sign with a check mark.
			for (const x of [52.55, 53.45]) r.box(x - 0.05, 86.2, 0.08, 0.1, 0.1, 1.85, PAL.dark);
			r.box(52.45, 86.26, 1.2, 1.1, 0.08, 0.7, R4.keep, { top: shade(R4.keep, 1.2) });
			r.polyline(
				[
					[52.72, 86.345, 1.56],
					[52.92, 86.345, 1.38],
					[53.3, 86.345, 1.76],
				],
				"#ffffff",
				3,
			);
			// The computer beside the arm that runs the policy, cabled to the robot base.
			r.polyline(
				[
					[ex + ew / 2, ey + ed, 0.09],
					[ex + ew / 2, 87.7, 0.09],
					[NEXT.base[0] + 0.3, 87.7, 0.09],
				],
				shade(R4.purple, 0.85),
				2.6,
			);
			r.box(ex, ey, 0.08, ew, ed, eh, R4.slate, { top: "#4f5d72" });
			wallRect(r, "x", ey + ed + 0.003, ex + 0.06, ex + ew - 0.06, 0.62, 0.72, R4.purple);
			for (let k = 0; k < 3; k++) wallRect(r, "x", ey + ed + 0.003, ex + 0.08, ex + ew - 0.08, 0.25 + k * 0.1, 0.29 + k * 0.1, "#2b3442");
			stackPole(r, 55.25, 86.45, 1.5);
			r.box(53.35, 87.6, 0.08, 0.6, 0.6, 0.12, PAL.steel);
			tote(r, NEXT.tote[0], NEXT.tote[1], NEXT.tote[2], NEXT.tote[3], NEXT.tote[4], "#2f6fb3");
			toteGrapes(r, NEXT.tote, PICK_SPOT);
			convX(r, 53.95, 55.45, NEXT.tray[1], 0.62, 0.45);
		},
		{ group: g },
	);
	scene.addDynamic({
		group: g,
		depth: NEXT.base[0] + NEXT.base[1] + 0.5,
		bounds: [52.4, 86.2, 0, 55.6, 89.8, 2.2],
		animated: () => true,
		draw: (r, t0) => {
			const rm = ctx.reducedMotion();
			const t = still(ctx, t0, 1.2);
			const p = grapePose(t, NEXT_PICK);
			drawPlate(r, NEXT.tray[0], NEXT.tray[1], NEXT.tray[2], 0, p.placed ? { grapes: true } : {}, { scale: 1.0 });
			// The current action chunk: future tool targets from the last plan, not yet played.
			const planned = Math.floor(t / CHUNK.every) * CHUNK.every;
			for (let j = 1; j <= CHUNK.n; j++) {
				const tj = planned + (j / CHUNK.n) * CHUNK.len;
				if (tj <= t) continue;
				const q = grapePose(tj, NEXT_PICK);
				r.sphere(q.x, q.y, q.z + 0.02, 0.028, R4.data, 0);
			}
			drawGrapePick(r, t, NEXT_PICK);
			lamp(r, 55.25, 86.45, 1.6, p.placed || rm, R4.lit, 0.09);
			// The computer's activity light blinks with each new plan.
			const fresh = rm || t - planned < 0.12;
			r.sphere(ex + ew - 0.1, ey + ed + 0.01, 0.84, 0.03, fresh ? R4.lit : R4.unlit, 0);
		},
	});
}

// ---------------------------------------------------------------------------
// Boarding platform, sign, and decor

function buildPlatform(scene, ctx) {
	const color = R4.purple;
	object(
		scene,
		46.4,
		77.9,
		49.6,
		79.9,
		2.5,
		(r) => {
			r.box(46.5, 78.05, 0, 3.0, 1.8, 0.28, "#cfc8bb", { top: "#ddd6c9" });
			r.box(46.5, 79.73, 0.28, 3.0, 0.12, 0.01, PAL.safety);
			for (const x of [46.7, 49.18]) r.box(x, 78.2, 0.28, 0.12, 0.12, 1.95, PAL.dark);
			r.box(46.4, 77.95, 2.2, 3.2, 1.25, 0.14, color, { top: shade(color, 1.12) });
		},
		// Live, so the roof covers the recording arm behind it instead of the arm painting over it.
		{ group: ctx.group, live: true },
	);
}

/** A sign with a loop of two arrows: the ride's emblem (data goes out, the lesson comes back). */
function buildSign(scene, ctx) {
	const y = 83.2;
	object(
		scene,
		51.8,
		y - 0.1,
		53.8,
		y + 0.1,
		2.4,
		(r) => {
			for (const x of [52.05, 53.55]) r.box(x - 0.05, y - 0.05, 0, 0.1, 0.1, 2.1, PAL.dark);
			r.box(51.9, y - 0.05, 1.15, 1.8, 0.1, 1.0, R4.purple, { top: shade(R4.purple, 1.15) });
			wallRect(r, "x", y + 0.055, 51.98, 53.62, 1.22, 2.08, "#ffffff");
			const cx = 52.8;
			const cz = 1.65;
			for (const k of [0, 1]) {
				const a0 = k * Math.PI + 0.35;
				const pts = [];
				for (let i = 0; i <= 8; i++) {
					const a = a0 + (i / 8) * (Math.PI - 0.7);
					pts.push([cx + Math.cos(a) * 0.5, y + 0.06, cz + Math.sin(a) * 0.3]);
				}
				r.polyline(pts, k ? R4.data : R4.purple, 3.2);
				const end = pts[pts.length - 1];
				const a = a0 + Math.PI - 0.7;
				const tx = -Math.sin(a);
				const tz = Math.cos(a) * 0.6;
				r.quad(
					[
						[end[0] + tx * 0.16, y + 0.061, end[2] + tz * 0.16],
						[end[0] - tz * 0.1, y + 0.061, end[2] + tx * 0.1],
						[end[0] + tz * 0.1, y + 0.061, end[2] - tx * 0.1],
					],
					k ? R4.data : R4.purple,
					{ flat: true },
				);
			}
		},
		{ group: ctx.group },
	);
}

function buildDecor(scene, ctx, avoid) {
	const g = ctx.group;
	const clear = (x0, y0, x1, y1) => !avoid.some((a) => x0 < a[2] && x1 > a[0] && y0 < a[3] && y1 > a[1]);
	for (const [x, y, s, kind] of [
		[51.6, 76.0, 1.0, 1],
		[54.3, 75.5, 0.85, "pine"],
		[56.2, 77.6, 1.0, 2],
		[25.7, 75.9, 0.85, 3],
	])
		if (clear(x - 0.9 * s, y - 0.9 * s, x + 0.9 * s, y + 0.9 * s)) object(scene, x - 0.9 * s, y - 0.9 * s, x + 0.9 * s, y + 0.9 * s, 3 * s, (r) => drawTree(r, x, y, kind, s), { group: g });
	for (const [x, y, w, d, seed] of [
		[36.2, 82.0, 2.2, 1.3, 41],
		[45.6, 82.0, 2.6, 1.3, 42],
		[37.0, 95.8, 2.4, 1.2, 43],
		[46.8, 95.8, 2.4, 1.2, 44],
		[24.8, 95.4, 1.5, 1.5, 45],
	])
		if (clear(x, y, x + w, y + d)) object(scene, x, y, x + w, y + d, 0.6, (r) => drawFlowers(r, x, y, w, d, seed), { group: g });
	for (const [x, y] of [
		[32.6, 96.2],
		[42.4, 96.2],
		[51.6, 96.2],
	])
		object(scene, x, y, x + 1.4, y + 0.45, 0.8, (r) => drawBench(r, x, y, true), { group: g });
}

// ---------------------------------------------------------------------------

/** Workbench booth spots, used only for stops that have a workbench in content. */
export const BOOTH_POS = {
	recording: [45.7, 84],
	upload: [41.2, 84],
	curation: [36.7, 84],
	dataset: [32.2, 84],
	training: [29.7, 84],
	simulation: [34.3, 84],
	"real-eval": [38.9, 84],
	rollout: [43.5, 84],
	fleet: [48.1, 84],
	"next-pick": [52.7, 84],
};

/**
 * Station footprints for hit targets, and label anchors (the label's bottom center). Neighbours
 * are about 4.5 m apart, so a right-hand neighbour's anchor is never much higher than its left
 * neighbour's (or sits far enough back): titles then stay apart down to zoom 0.55, the smallest
 * that shows station labels. With ride4.js's focus, each stop's title clears the cart tag and
 * the next row-1 station's title stays below the top bar on a phone.
 */
export const STATIONS = {
	recording: { bounds: [41.6, 75.0, 0, 46.3, 79.5, 2.4], label: [43.8, 76.6, 2.3] },
	upload: { bounds: [37.0, 75.0, 0, 41.2, 78.6, 3.9], label: [39.6, 76.2, 2.0] },
	curation: { bounds: [32.6, 75.2, 0, 37.0, 78.6, 1.7], label: [35.6, 76.4, 2.6] },
	dataset: { bounds: [27.85, 74.85, 0, 32.35, 79.2, 3.1], label: [30.6, 77.6, 3.2] },
	training: { bounds: [29.5, 86.0, 0, 33.3, 91.6, 2.7], label: [31.4, 88.8, 3.3] },
	simulation: { bounds: [33.8, 86.6, 0, 38.0, 90.8, 2.2], label: [35.9, 88.7, 2.75] },
	"real-eval": { bounds: [38.7, 86.0, 0, 42.3, 91.4, 2.6], label: [40.1, 87.8, 3.1] },
	rollout: { bounds: [43.1, 85.6, 0, 47.1, 91.5, 2.3], label: [44.8, 88.4, 2.8] },
	fleet: { bounds: [47.9, 86.5, 0, 51.5, 90.9, 1.8], label: [49.4, 89.3, 2.0] },
	"next-pick": { bounds: [52.3, 85.9, 0, 55.6, 91.5, 2.2], label: [53.6, 88.0, 2.6] },
};

export function buildStations(scene, ctx, boothRects) {
	buildPlatform(scene, ctx);
	buildRecording(scene, ctx);
	buildUpload(scene, ctx);
	buildCuration(scene, ctx);
	buildDataset(scene, ctx);
	buildTrench(scene, ctx);
	buildTraining(scene, ctx);
	buildSimulation(scene, ctx);
	buildRealEval(scene, ctx);
	buildRollout(scene, ctx);
	buildFleet(scene, ctx);
	buildNextPick(scene, ctx);
	const signRect = [51.8, 82.9, 53.8, 83.5];
	if (!boothRects.some((a) => signRect[0] < a[2] && signRect[2] > a[0] && signRect[1] < a[3] && signRect[3] > a[1])) buildSign(scene, ctx);
	buildDecor(scene, ctx, boothRects);
}
