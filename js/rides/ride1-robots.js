// Ride 1 robot pieces the shared engine does not have: a six-axis arm whose soft-finger tool can
// tilt (the grape arm leans its wrist to get under a stem), a SCARA with a bellows vacuum cup,
// a vacuum cup for the deltas' telescoping fourth axis, and a three-axis gantry split into pieces
// so the scene can sort them around the trays. Proportions follow js/engine/robots.js.

import { depthOf } from "../engine/iso.js";
import { ik2, ROBOT_COLORS } from "../engine/robots.js";

const add = (p, d, k = 1) => [p[0] + d[0] * k, p[1] + d[1] * k, p[2] + d[2] * k];

function cross(a, b) {
	return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function unit(v) {
	const l = Math.hypot(v[0], v[1], v[2]) || 1;
	return [v[0] / l, v[1] / l, v[2] / l];
}

/** Two unit vectors perpendicular to axis d (and to each other). */
function basis(d) {
	const ref = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
	const a = unit(cross(d, ref));
	return [a, cross(d, a)];
}

/**
 * Soft fingers along tool axis d (unit vector from the wrist toward the tips), tips meeting at
 * tip. grip 0 closed .. 1 open; roll turns the finger set about the axis.
 */
export function softFingers(r, tip, d, grip = 0.5, s = 1, roll = 0) {
	const [a, b] = basis(d);
	const hub = add(tip, d, -0.12 * s);
	r.tube(add(hub, d, -0.05 * s), hub, 0.075 * s, ROBOT_COLORS.joint, 10);
	const fingers = [0, 1, 2].map((i) => {
		const ang = roll + Math.PI / 6 + (i / 3) * Math.PI * 2;
		const rad = [a[0] * Math.cos(ang) + b[0] * Math.sin(ang), a[1] * Math.cos(ang) + b[1] * Math.sin(ang), a[2] * Math.cos(ang) + b[2] * Math.sin(ang)];
		return {
			root: add(hub, rad, 0.055 * s),
			mid: add(add(tip, d, -0.06 * s), rad, (0.075 + grip * 0.05) * s),
			tip: add(tip, rad, (0.012 + grip * 0.06) * s),
		};
	});
	fingers.sort((p, q) => depthOf(...p.mid) - depthOf(...q.mid));
	for (const f of fingers) {
		r.tube(f.root, f.mid, 0.02 * s, ROBOT_COLORS.orange, 6);
		r.tube(f.mid, f.tip, 0.017 * s, ROBOT_COLORS.orange, 6);
	}
}

/**
 * Washdown six-axis arm with soft fingers, like drawSixAxis, but the tool leans opts.tilt radians
 * from vertical (tips away from the base) and the fingers turn by opts.roll. Returns the tool tip.
 */
export function drawTiltArm(r, bx, by, target, opts = {}) {
	const s = opts.scale ?? 1;
	const bz = opts.z ?? 0;
	const C = { ...ROBOT_COLORS, body: "#f2f2ee", accent: "#2a9d8f", ...opts.colors };
	const L1 = 0.78 * s;
	const L2 = 0.72 * s;
	const toolLen = 0.26 * s;
	const tilt = opts.tilt ?? 0;
	const S = [bx, by, bz + 0.72 * s];
	const h0 = Math.hypot(target[0] - S[0], target[1] - S[1]) || 1;
	const out = [(target[0] - S[0]) / h0, (target[1] - S[1]) / h0];
	const d = [out[0] * Math.sin(tilt), out[1] * Math.sin(tilt), -Math.cos(tilt)];
	const W = add(target, d, -toolLen);
	const yaw = Math.atan2(W[1] - S[1], W[0] - S[0]);
	const f = [Math.cos(yaw), Math.sin(yaw)];
	const side = [-f[1], f[0]];
	const k = ik2(L1, L2, Math.hypot(W[0] - S[0], W[1] - S[1]), W[2] - S[2], true);
	const E = [S[0] + f[0] * k.elbow[0], S[1] + f[1] * k.elbow[0], S[2] + k.elbow[1]];
	const Wp = [S[0] + f[0] * k.wrist[0], S[1] + f[1] * k.wrist[0], S[2] + k.wrist[1]];
	r.cylinder(bx, by, bz, 0.36 * s, 0.14 * s, C.joint, 10);
	r.cylinder(bx, by, bz + 0.14 * s, 0.3 * s, 0.34 * s, C.body, 10);
	r.orientedBox(bx, by, bz + 0.46 * s, 0.5 * s, 0.42 * s, 0.4 * s, yaw, C.body);
	const off = (p, dd) => [p[0] + side[0] * dd, p[1] + side[1] * dd, p[2]];
	r.tube(off(S, -0.25 * s), off(S, 0.25 * s), 0.17 * s, C.accent, 10);
	r.beam(off(S, 0.06 * s), off(E, 0.06 * s), 0.24 * s, 0.28 * s, C.body);
	r.tube(off(E, -0.18 * s), off(E, 0.2 * s), 0.13 * s, C.accent, 10);
	r.beam(E, Wp, 0.18 * s, 0.2 * s, C.body);
	r.tube(off(Wp, -0.09 * s), off(Wp, 0.09 * s), 0.08 * s, C.joint, 8);
	const tip = add(Wp, d, toolLen);
	const T1 = add(Wp, d, toolLen * 0.4);
	r.tube(Wp, T1, 0.05 * s, C.metal, 6);
	r.tube(T1, add(tip, d, -0.12 * s), 0.03 * s, C.joint, 6);
	softFingers(r, tip, d, opts.grip ?? 0.5, s, opts.roll ?? yaw);
	return tip;
}

/** Food-grade vacuum cup whose lip bottom is at z. bellows: accordion folds above the lip. */
export function vacuumCup(r, x, y, z, s = 1, bellows = false) {
	const blue = "#2f78c4";
	if (bellows) {
		r.cylinder(x, y, z + 0.075 * s, 0.022 * s, 0.05 * s, ROBOT_COLORS.joint, 6);
		for (let i = 2; i >= 0; i--) r.cylinder(x, y, z + 0.018 * s + i * 0.019 * s, (i % 2 ? 0.03 : 0.038) * s, 0.019 * s, blue, 8);
		r.cylinder(x, y, z, 0.046 * s, 0.018 * s, blue, 8);
	} else {
		r.cylinder(x, y, z + 0.03 * s, 0.022 * s, 0.05 * s, ROBOT_COLORS.joint, 6);
		r.cone(x, y, z, 0.055 * s, 0.035 * s, blue, 8);
	}
}

/**
 * SCARA standing at (bx, by) (base at height opts.z) with a bellows vacuum cup whose lip is at
 * cupZ under the point target [x, y]. Same proportions as drawScara.
 */
export function drawCupScara(r, bx, by, target, cupZ, opts = {}) {
	const s = opts.scale ?? 1;
	const bz = opts.z ?? 0;
	const C = { ...ROBOT_COLORS, ...opts.colors };
	const L1 = 0.62 * s;
	const L2 = 0.55 * s;
	const z1 = bz + 1.15 * s;
	const k = ik2(L1, L2, target[0] - bx, target[1] - by, opts.elbowLeft !== false);
	const e = [bx + k.elbow[0], by + k.elbow[1]];
	const w = [bx + k.wrist[0], by + k.wrist[1]];
	r.box(bx - 0.36 * s, by - 0.36 * s, bz, 0.72 * s, 0.72 * s, 0.12 * s, C.joint);
	r.cylinder(bx, by, bz + 0.12 * s, 0.24 * s, z1 - bz - 0.12 * s, C.body, 10);
	r.cylinder(bx, by, z1, 0.2 * s, 0.18 * s, C.accent, 10);
	r.beam([bx, by, z1 + 0.09 * s], [e[0], e[1], z1 + 0.09 * s], 0.3 * s, 0.17 * s, C.body);
	r.cylinder(e[0], e[1], z1 + 0.02 * s, 0.16 * s, 0.24 * s, C.accent, 10);
	const qTop = z1 + 0.5 * s;
	const qBot = Math.min(qTop - 0.1 * s, cupZ + 0.12 * s);
	r.cylinder(w[0], w[1], qBot, 0.035 * s, qTop - qBot, C.metal, 6);
	vacuumCup(r, w[0], w[1], cupZ, s, true);
	r.beam([e[0], e[1], z1 + 0.3 * s], [w[0], w[1], z1 + 0.3 * s], 0.24 * s, 0.15 * s, C.body);
	r.cylinder(w[0], w[1], z1 + 0.22 * s, 0.11 * s, 0.22 * s, C.accent, 8);
	return [w[0], w[1], cupZ];
}

/** The delta's fourth axis: a telescoping shaft from the housing to the cup. Draw before drawDelta. */
export function deltaShaft(r, cx, cy, topZ, plat, s = 1) {
	r.line([cx, cy, topZ - 0.3 * s], [plat[0], plat[1], plat[2] + 0.06 * s], "#7f8b98", 2.6 * s);
}

// ---------------------------------------------------------------------------
// Gantry: frame posts, two long rails along y, a cross beam that travels along y, and a carriage
// that travels along the beam (x) with a vertical axis (z) and a vacuum pad.

export const GANTRY_COLORS = { frame: "#aeb6c0", beam: "#e8792f", carriage: "#2f6fb3", rod: "#b8c0ca" };

export function gantryPost(r, x, y, h, s = 1) {
	const p = 0.14 * s;
	r.box(x - p / 2, y - p / 2, 0, p, p, h, GANTRY_COLORS.frame);
	r.box(x - p, y - p, 0, p * 2, p * 2, 0.04, "#7f8b98");
}

export function gantryRail(r, x, y0, y1, h, s = 1) {
	const p = 0.14 * s;
	r.box(x - p / 2, y0 - p / 2, h, p, y1 - y0 + p, p, GANTRY_COLORS.frame);
}

/** Cross beam at y (spanning x0..x1), carriage at cx, pad bottom at padZ. */
export function gantryCarriage(r, x0, x1, y, h, cx, padZ, s = 1) {
	const p = 0.14 * s;
	r.box(x0 - p / 2, y - p, h + p, x1 - x0 + p, p * 2, p, GANTRY_COLORS.beam);
	r.box(cx - p, y - p * 1.2, h + p * 0.2, p * 2, p * 2.4, p * 1.8, GANTRY_COLORS.carriage);
	r.box(cx - p / 3, y - p / 3, padZ + 0.06, (p * 2) / 3, (p * 2) / 3, h + p * 0.2 - padZ - 0.06, GANTRY_COLORS.rod);
	// Vacuum pad: a plate with four cups that holds a lidded tray by its lid.
	r.box(cx - 0.22, y - 0.3, padZ + 0.03, 0.44, 0.6, 0.04, "#7f8b98");
	for (const [dx, dy] of [
		[-0.13, -0.2],
		[0.13, -0.2],
		[-0.13, 0.2],
		[0.13, 0.2],
	])
		r.cylinder(cx + dx, y + dy, padZ, 0.04, 0.03, "#2f78c4", 6);
}
