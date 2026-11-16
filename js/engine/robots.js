// Low-poly robot models shared by rides and the showroom. All sizes are meters times
// opts.scale (a ride can draw a building-sized robot by passing scale 6).
// Each function draws its parts back to front in a fixed order; put the whole robot in one
// dynamic scene item.

import { shade } from "./iso.js";

export const ROBOT_COLORS = {
	body: "#f1f3f5",
	accent: "#2f6fb3",
	joint: "#3b4552",
	metal: "#b8c0ca",
	rubber: "#2b2f35",
	orange: "#e8792f",
};

/**
 * Planar two-link inverse kinematics. Returns elbow and wrist points in the plane for a
 * target (tx, ty), clamping to reach. up=true picks the elbow-up (or elbow-left) solution.
 */
export function ik2(L1, L2, tx, ty, up = true) {
	let d = Math.hypot(tx, ty);
	const max = L1 + L2 - 1e-3;
	const min = Math.abs(L1 - L2) + 1e-3;
	let x = tx;
	let y = ty;
	if (d > max || d < min) {
		const k = (d > max ? max : min) / (d || 1);
		x *= k;
		y *= k;
		d = Math.hypot(x, y);
	}
	const c2 = Math.max(-1, Math.min(1, (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2)));
	const q2 = (up ? -1 : 1) * Math.acos(c2);
	const q1 = Math.atan2(y, x) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2));
	const e = [L1 * Math.cos(q1), L1 * Math.sin(q1)];
	return { q1, q2, elbow: e, wrist: [e[0] + L2 * Math.cos(q1 + q2), e[1] + L2 * Math.sin(q1 + q2)] };
}

/** Smooth back-and-forth between 0 and 1 with rests at both ends. Period in seconds. */
export function shuttle(t, period, phase = 0) {
	const u = (((t + phase) / period) % 1 + 1) % 1;
	// 0-0.2 rest at 0, 0.2-0.5 move to 1, 0.5-0.7 rest at 1, 0.7-1 move back.
	const ease = (v) => v * v * (3 - 2 * v);
	if (u < 0.2) return 0;
	if (u < 0.5) return ease((u - 0.2) / 0.3);
	if (u < 0.7) return 1;
	return 1 - ease((u - 0.7) / 0.3);
}

/** Dip: 1 while resting at either end (tool lowered), 0 while moving. */
export function dip(t, period, phase = 0) {
	const u = (((t + phase) / period) % 1 + 1) % 1;
	const bump = (a, b) => (u > a && u < b ? Math.sin(((u - a) / (b - a)) * Math.PI) : 0);
	return Math.max(bump(0.02, 0.2), bump(0.5, 0.68));
}

/**
 * SCARA robot standing at (bx, by). target: [x, y] the tool is over; toolZ: height of the
 * tool tip. grip: 0 closed .. 1 open.
 */
export function drawScara(r, bx, by, target, toolZ, opts = {}) {
	const s = opts.scale ?? 1;
	const C = { ...ROBOT_COLORS, ...opts.colors };
	const L1 = 0.62 * s;
	const L2 = 0.55 * s;
	const z1 = 1.15 * s;
	const k = ik2(L1, L2, target[0] - bx, target[1] - by, opts.elbowLeft !== false);
	const e = [bx + k.elbow[0], by + k.elbow[1]];
	const w = [bx + k.wrist[0], by + k.wrist[1]];
	r.box(bx - 0.36 * s, by - 0.36 * s, 0, 0.72 * s, 0.72 * s, 0.12 * s, C.joint);
	r.cylinder(bx, by, 0.12 * s, 0.24 * s, z1 - 0.12 * s, C.body, 10);
	r.cylinder(bx, by, z1, 0.2 * s, 0.18 * s, C.accent, 10);
	r.beam([bx, by, z1 + 0.09 * s], [e[0], e[1], z1 + 0.09 * s], 0.3 * s, 0.17 * s, C.body);
	r.cylinder(e[0], e[1], z1 + 0.02 * s, 0.16 * s, 0.24 * s, C.accent, 10);
	const qTop = z1 + 0.5 * s;
	const tip = Math.min(qTop - 0.1 * s, toolZ + 0.1 * s);
	r.cylinder(w[0], w[1], tip, 0.035 * s, qTop - tip, C.metal, 6);
	drawFingerGripper(r, w[0], w[1], toolZ, opts.grip ?? 0.5, s, C, k.q1 + k.q2);
	r.beam([e[0], e[1], z1 + 0.3 * s], [w[0], w[1], z1 + 0.3 * s], 0.24 * s, 0.15 * s, C.body);
	r.cylinder(w[0], w[1], z1 + 0.22 * s, 0.11 * s, 0.22 * s, C.accent, 8);
	return { tool: [w[0], w[1], toolZ] };
}

function drawFingerGripper(r, x, y, z, grip, s, C, angle = 0) {
	r.cylinder(x, y, z + 0.06 * s, 0.07 * s, 0.06 * s, C.joint, 8);
	const gap = (0.025 + grip * 0.04) * s;
	const ca = Math.cos(angle);
	const sa = Math.sin(angle);
	for (const sgn of [-1, 1]) {
		const fx = x + -sa * gap * sgn;
		const fy = y + ca * gap * sgn;
		r.box(fx - 0.012 * s, fy - 0.012 * s, z, 0.024 * s, 0.024 * s, 0.07 * s, C.orange);
	}
}

/**
 * Six-axis articulated arm at (bx, by), standing at height opts.z (default 0), reaching a tool
 * tip at target [x, y, z]. The tool hangs straight down from the wrist: a vacuum cup by default,
 * opts.tool "fingers" for soft fingers (opts.grip 0 closed .. 1 open), or "none".
 */
export function drawSixAxis(r, bx, by, target, opts = {}) {
	const s = opts.scale ?? 1;
	const bz = opts.z ?? 0;
	const C = { ...ROBOT_COLORS, body: "#f2f2ee", accent: "#2a9d8f", ...opts.colors };
	const L1 = 0.78 * s;
	const L2 = 0.72 * s;
	const toolLen = 0.26 * s;
	const S = [bx, by, bz + 0.72 * s];
	const W = [target[0], target[1], target[2] + toolLen];
	const yaw = Math.atan2(W[1] - S[1], W[0] - S[0]);
	const f = [Math.cos(yaw), Math.sin(yaw)];
	const side = [-f[1], f[0]];
	const k = ik2(L1, L2, Math.hypot(W[0] - S[0], W[1] - S[1]), W[2] - S[2], true);
	const E = [S[0] + f[0] * k.elbow[0], S[1] + f[1] * k.elbow[0], S[2] + k.elbow[1]];
	const Wp = [S[0] + f[0] * k.wrist[0], S[1] + f[1] * k.wrist[0], S[2] + k.wrist[1]];
	r.cylinder(bx, by, bz, 0.36 * s, 0.14 * s, C.joint, 10);
	r.cylinder(bx, by, bz + 0.14 * s, 0.3 * s, 0.34 * s, C.body, 10);
	r.orientedBox(bx, by, bz + 0.46 * s, 0.5 * s, 0.42 * s, 0.4 * s, yaw, C.body);
	const off = (p, d) => [p[0] + side[0] * d, p[1] + side[1] * d, p[2]];
	r.tube(off(S, -0.25 * s), off(S, 0.25 * s), 0.17 * s, C.accent, 10);
	r.beam(off(S, 0.06 * s), off(E, 0.06 * s), 0.24 * s, 0.28 * s, C.body);
	r.tube(off(E, -0.18 * s), off(E, 0.2 * s), 0.13 * s, C.accent, 10);
	r.beam(E, Wp, 0.18 * s, 0.2 * s, C.body);
	r.tube(off(Wp, -0.09 * s), off(Wp, 0.09 * s), 0.08 * s, C.joint, 8);
	const T = [Wp[0], Wp[1], Wp[2] - toolLen * 0.75];
	r.tube(Wp, T, 0.05 * s, C.metal, 6);
	if (opts.tool === "fingers") {
		r.cylinder(T[0], T[1], target[2] + 0.12 * s, 0.03 * s, T[2] - target[2] - 0.12 * s, C.joint, 6);
		drawSoftFingers(r, target[0], target[1], target[2], opts.grip ?? 0.5, s, yaw);
	} else if (opts.tool !== "none") {
		r.cylinder(T[0], T[1], T[2] - toolLen * 0.25, 0.03 * s, toolLen * 0.25, C.joint, 6);
		r.cylinder(target[0], target[1], target[2], 0.07 * s, 0.035 * s, C.rubber, 8);
	}
	return { shoulder: S, elbow: E, wrist: Wp, tool: target };
}

/**
 * Soft finger gripper: a hub with three curved silicone fingers whose tips meet at (x, y, z).
 * grip: 0 closed (tips together, holding a stem) .. 1 open. angle turns the finger set about z.
 */
export function drawSoftFingers(r, x, y, z, grip = 0.5, s = 1, angle = 0) {
	const hubZ = z + 0.12 * s;
	r.cylinder(x, y, hubZ, 0.075 * s, 0.05 * s, ROBOT_COLORS.joint, 10);
	const fingers = [0, 1, 2].map((i) => {
		const a = angle + Math.PI / 6 + (i / 3) * Math.PI * 2;
		const d = [Math.cos(a), Math.sin(a)];
		const at = (rad, zz) => [x + d[0] * rad * s, y + d[1] * rad * s, zz];
		return { root: at(0.055, hubZ), mid: at(0.075 + grip * 0.05, z + 0.06 * s), tip: at(0.012 + grip * 0.06, z) };
	});
	// Far fingers first.
	fingers.sort((a, b) => a.mid[0] + a.mid[1] - (b.mid[0] + b.mid[1]));
	for (const f of fingers) {
		r.tube(f.root, f.mid, 0.02 * s, ROBOT_COLORS.orange, 6);
		r.tube(f.mid, f.tip, 0.017 * s, ROBOT_COLORS.orange, 6);
	}
}

/**
 * Delta (parallel) robot hanging from a housing centered at (cx, cy) with its top at topZ.
 * plat: [x, y, z] of the moving platform.
 */
export function drawDelta(r, cx, cy, topZ, plat, opts = {}) {
	const s = opts.scale ?? 1;
	const C = { ...ROBOT_COLORS, accent: "#3d7fd1", ...opts.colors };
	const La = 0.42 * s;
	const Lb = 0.86 * s;
	const rootR = 0.3 * s;
	const platR = 0.11 * s;
	const arms = [0, 1, 2].map((i) => {
		const phi = (i / 3) * Math.PI * 2 + Math.PI / 6;
		const radial = [Math.cos(phi), Math.sin(phi)];
		const root = [cx + radial[0] * rootR, cy + radial[1] * rootR, topZ - 0.24 * s];
		const pj = [plat[0] + radial[0] * platR, plat[1] + radial[1] * platR, plat[2] + 0.06 * s];
		// Find the upper-arm angle whose elbow sits one rod length from the platform joint.
		let lo = -0.9;
		let hi = 1.5;
		const elbowAt = (g) => [root[0] + radial[0] * La * Math.cos(g), root[1] + radial[1] * La * Math.cos(g), root[2] - La * Math.sin(g)];
		for (let it = 0; it < 22; it++) {
			const mid = (lo + hi) / 2;
			const e = elbowAt(mid);
			const d = Math.hypot(e[0] - pj[0], e[1] - pj[1], e[2] - pj[2]);
			if (d > Lb) lo = mid;
			else hi = mid;
		}
		const elbow = elbowAt((lo + hi) / 2);
		return { phi, root, elbow, pj, tangent: [-radial[1], radial[0]] };
	});
	// Far arms first.
	arms.sort((a, b) => a.elbow[0] + a.elbow[1] - (b.elbow[0] + b.elbow[1]));
	const housing = Array.from({ length: 6 }, (_, i) => {
		const a = (i / 6) * Math.PI * 2;
		return [cx + Math.cos(a) * 0.38 * s, cy + Math.sin(a) * 0.38 * s];
	});
	r.prism(housing, topZ - 0.3 * s, 0.3 * s, C.body);
	for (const a of arms) {
		r.beam(a.root, a.elbow, 0.08 * s, 0.09 * s, C.accent);
		for (const sg of [-1, 1]) {
			const o = 0.045 * s * sg;
			r.line(
				[a.elbow[0] + a.tangent[0] * o, a.elbow[1] + a.tangent[1] * o, a.elbow[2]],
				[a.pj[0] + a.tangent[0] * o, a.pj[1] + a.tangent[1] * o, a.pj[2]],
				C.metal,
				2.2 * s,
			);
		}
	}
	const hex = Array.from({ length: 6 }, (_, i) => {
		const a = (i / 6) * Math.PI * 2;
		return [plat[0] + Math.cos(a) * 0.14 * s, plat[1] + Math.sin(a) * 0.14 * s];
	});
	r.prism(hex, plat[2], 0.06 * s, shade(C.body, 0.95));
	r.cylinder(plat[0], plat[1], plat[2] - 0.1 * s, 0.03 * s, 0.1 * s, C.joint, 6);
	if (opts.tool === "fingers") drawFingerGripper(r, plat[0], plat[1], plat[2] - 0.16 * s, opts.grip ?? 0.5, s, C);
	else r.cylinder(plat[0], plat[1], plat[2] - 0.14 * s, 0.055 * s, 0.04 * s, C.rubber, 8);
}

/** Simple gantry frame with a carriage at [x, y] and a tool at height toolZ. */
export function drawGantry(r, x0, y0, x1, y1, h, carriage, toolZ, opts = {}) {
	const s = opts.scale ?? 1;
	const C = { ...ROBOT_COLORS, ...opts.colors };
	const p = 0.12 * s;
	for (const [x, y] of [
		[x0, y0],
		[x1, y0],
		[x0, y1],
	])
		r.box(x - p / 2, y - p / 2, 0, p, p, h, C.metal);
	r.box(x0 - p / 2, y0 - p / 2, h, p, y1 - y0 + p, p, C.metal);
	r.box(x1 - p / 2, y0 - p / 2, h, p, y1 - y0 + p, p, C.metal);
	r.box(x0, carriage[1] - p, h + p, x1 - x0, p * 2, p, C.orange);
	r.box(carriage[0] - p, carriage[1] - p * 1.2, h, p * 2, p * 2.4, p * 1.6, C.accent);
	r.box(carriage[0] - p / 3, carriage[1] - p / 3, toolZ, (p * 2) / 3, (p * 2) / 3, h - toolZ, C.metal);
	r.box(x1 - p / 2, y1 - p / 2, 0, p, p, h, C.metal);
}
