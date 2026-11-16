// Robot models the engine does not have: a cobot, a gantry drawn across the screen, an
// autonomous mobile robot, and a humanoid. Each is drawn at (bx, by) standing on z0 and sized
// from H, its height in meters. Drawing code only.

import { shade } from "../engine/iso.js";

const COBOT = { link: "#f4f6f8", cap: "#5fb4e6", base: "#3b4552", metal: "#b8c0ca" };

/** Cobot pose at unit scale: joint points in (forward, up) and the resulting top height. */
const POSE = { S: [0, 0.22], E: [0.07, 0.64], W: [0.44, 0.76], T: [0.44, 0.62] };
const COBOT_TOP = 0.84;

/**
 * Collaborative arm: slim round links with capped joints. yaw: direction it reaches (radians).
 * Returns the tool point.
 */
export function drawCobot(r, bx, by, H, opts = {}) {
	const k = H / COBOT_TOP;
	const z0 = opts.z0 ?? 0;
	const yaw = opts.yaw ?? 0.35;
	const C = { ...COBOT, ...opts.colors };
	const f = [Math.cos(yaw), Math.sin(yaw)];
	const s = [-f[1], f[0]];
	const P = ([u, v], side = 0) => [bx + f[0] * u * k + s[0] * side * k, by + f[1] * u * k + s[1] * side * k, z0 + v * k];
	r.cylinder(bx, by, z0, 0.11 * k, 0.04 * k, C.base, 12);
	r.cylinder(bx, by, z0 + 0.04 * k, 0.075 * k, 0.12 * k, C.link, 12);
	r.cylinder(bx, by, z0 + 0.13 * k, 0.078 * k, 0.03 * k, C.cap, 12);
	const S = P(POSE.S);
	const E = P(POSE.E, 0.09);
	const W = P(POSE.W, 0.09);
	const T = P(POSE.T, 0.09);
	// Shoulder joint across the arm, upper arm, elbow, forearm, wrist, tool.
	r.tube(P(POSE.S, -0.07), P(POSE.S, 0.16), 0.075 * k, C.link, 12);
	r.tube(P(POSE.S, 0.16), P(POSE.S, 0.175), 0.077 * k, C.cap, 12);
	r.tube([S[0] + s[0] * 0.09 * k, S[1] + s[1] * 0.09 * k, S[2]], E, 0.052 * k, C.link, 10);
	r.tube(P(POSE.E, 0.02), P(POSE.E, 0.16), 0.062 * k, C.link, 12);
	r.tube(P(POSE.E, 0.16), P(POSE.E, 0.172), 0.064 * k, C.cap, 12);
	r.tube(E, W, 0.042 * k, C.link, 10);
	r.cylinder(W[0], W[1], W[2] - 0.05 * k, 0.05 * k, 0.1 * k, C.link, 10);
	r.cylinder(W[0], W[1], W[2] + 0.04 * k, 0.052 * k, 0.015 * k, C.cap, 10);
	r.tube(W, T, 0.04 * k, C.link, 10);
	r.cylinder(T[0], T[1], T[2] - 0.05 * k, 0.045 * k, 0.05 * k, C.metal, 10);
	for (const sg of [-1, 1]) r.box(T[0] + s[0] * sg * 0.025 * k - 0.008 * k, T[1] + s[1] * sg * 0.025 * k - 0.008 * k, T[2] - 0.12 * k, 0.016 * k, 0.016 * k, 0.07 * k, "#2b2f35");
	return { tool: [T[0], T[1], T[2] - 0.12 * k] };
}

/**
 * Gantry whose long axis runs across the screen (world direction (1, -1)), so a long stroke
 * widens the drawing instead of making it taller. len: stroke length, dep: frame depth, H: height.
 */
export function drawGantryAcross(r, bx, by, len, dep, H, opts = {}) {
	const u = [Math.SQRT1_2, -Math.SQRT1_2];
	const v = [Math.SQRT1_2, Math.SQRT1_2];
	const P = (a, b, z = 0) => [bx + u[0] * a + v[0] * b, by + u[1] * a + v[1] * b, z];
	const p = Math.max(0.06, Math.min(0.14, H * 0.05));
	const steel = "#9aa5b1";
	const post = (a, b) => {
		const [x, y] = P(a, b);
		r.box(x - p / 2, y - p / 2, 0, p, p, H, steel);
	};
	const L = len / 2;
	const D = dep / 2;
	// Far posts and the far rail first.
	post(-L, -D);
	post(L, -D);
	r.beam(P(-L, -D, H + p / 2), P(L, -D, H + p / 2), p, p, steel);
	post(-L, D);
	const c = (opts.carriage ?? 0.25) * L;
	r.beam(P(c, -D - p, H + p * 1.5), P(c, D + p, H + p * 1.5), p * 1.6, p, opts.color ?? "#e8792f");
	const [cx, cy] = P(c, 0);
	r.box(cx - p, cy - p, H, p * 2, p * 2, p * 2.2, "#2f6fb3");
	const tz = opts.toolZ ?? H * 0.3;
	r.box(cx - p / 3, cy - p / 3, tz, (p * 2) / 3, (p * 2) / 3, H - tz, "#b8c0ca");
	r.box(cx - p / 2, cy - p / 2, tz - p, p, p, p, "#3b4552");
	r.beam(P(-L, D, H + p / 2), P(L, D, H + p / 2), p, p, steel);
	post(L, D);
}

/**
 * Autonomous mobile robot on its own: a low base len meters long and H meters tall (the deck),
 * with a tote riding on top. yaw: the direction it drives (radians).
 */
export function drawAmr(r, bx, by, len, H, opts = {}) {
	const yaw = opts.yaw ?? 0.35;
	const wid = len * 0.72;
	const f = [Math.cos(yaw), Math.sin(yaw)];
	const s = [-f[1], f[0]];
	const at = (u, v) => [bx + f[0] * u + s[0] * v, by + f[1] * u + s[1] * v];
	const clear = Math.min(0.05, H * 0.15);
	const bh = H - clear;
	r.shadow(bx, by, len * 0.6, wid * 0.6, 0.18);
	for (const u of [-0.32 * len, 0.32 * len])
		for (const v of [-0.4 * wid, 0.4 * wid]) {
			const [wx, wy] = at(u, v);
			r.orientedBox(wx, wy, 0, len * 0.16, wid * 0.08, clear + bh * 0.25, yaw, "#2b2f35");
		}
	r.orientedBox(bx, by, clear, len, wid, bh * 0.94, yaw, "#4a5562");
	r.orientedBox(bx, by, clear + bh * 0.94, len * 0.98, wid * 0.98, bh * 0.06, yaw, "#5d6977");
	// Yellow bumper at the front, a status light strip along the side, a lidar window.
	const [fx, fy] = at(len / 2 + 0.01, 0);
	r.orientedBox(fx, fy, clear + bh * 0.15, 0.03, wid * 0.9, bh * 0.3, yaw, "#f2c230");
	const [lx, ly] = at(0, wid / 2 + 0.004);
	r.orientedBox(lx, ly, clear + bh * 0.62, len * 0.8, 0.008, bh * 0.1, yaw, "#49e0c4");
	const [px, py] = at(len / 2 - 0.02, wid * 0.32);
	r.orientedBox(px, py, clear + bh * 0.45, 0.06, wid * 0.2, bh * 0.14, yaw, "#1f2b3b");
	// A tote on the deck.
	const [tx, ty] = at(-len * 0.05, 0);
	r.orientedBox(tx, ty, H, len * 0.5, wid * 0.62, Math.min(0.24, len * 0.22), yaw, "#2f6fb3");
	r.orientedBox(tx, ty, H + Math.min(0.24, len * 0.22), len * 0.52, wid * 0.64, 0.02, yaw, "#3d7fd1");
}

/** Humanoid facing the viewer, carrying a small tote. */
export function drawHumanoid(r, bx, by, H, opts = {}) {
	const yaw = opts.yaw ?? Math.PI / 4;
	const f = [Math.cos(yaw), Math.sin(yaw)];
	const s = [-f[1], f[0]];
	const P = (u, v, z) => [bx + (f[0] * u + s[0] * v) * H, by + (f[1] * u + s[1] * v) * H, z * H];
	const body = opts.color ?? "#eef1f4";
	const dark = "#3b4552";
	const accent = opts.accent ?? "#5fb4e6";
	const hipZ = 0.5;
	const kneeZ = 0.27;
	// Legs: far leg first (the one on the -s side is farther from the viewer when facing +x+y).
	for (const v of [0.075, -0.075]) {
		const ankle = P(0.0, v, 0.045);
		const knee = P(0.03, v, kneeZ);
		const hip = P(0, v, hipZ);
		r.orientedBox(...P(0.02, v, 0).slice(0, 2), 0, 0.13 * H, 0.06 * H, 0.04 * H, yaw, dark);
		r.beam(ankle, knee, 0.06 * H, 0.06 * H, body);
		r.sphere(knee[0], knee[1], knee[2], 0.036 * H, dark, 0);
		r.beam(knee, hip, 0.075 * H, 0.075 * H, body);
	}
	// Pelvis and torso.
	const pel = P(0, 0, hipZ - 0.02);
	r.orientedBox(pel[0], pel[1], pel[2], 0.12 * H, 0.2 * H, 0.07 * H, yaw, dark);
	const ch = P(0, 0, hipZ + 0.05);
	r.orientedBox(ch[0], ch[1], ch[2], 0.13 * H, 0.2 * H, 0.14 * H, yaw, shade(body, 0.95));
	r.orientedBox(ch[0], ch[1], ch[2] + 0.14 * H, 0.15 * H, 0.27 * H, 0.13 * H, yaw, body);
	const lamp = P(0.076, 0, hipZ + 0.24);
	r.sphere(lamp[0], lamp[1], lamp[2], 0.02 * H, accent, 0);
	// Neck and head with a dark visor.
	const neck = P(0, 0, hipZ + 0.32);
	r.cylinder(neck[0], neck[1], neck[2], 0.03 * H, 0.04 * H, dark, 8);
	const hd = P(0, 0, hipZ + 0.36);
	r.orientedBox(hd[0], hd[1], hd[2], 0.12 * H, 0.11 * H, 0.13 * H, yaw, body);
	const vz = hipZ + 0.39;
	const vp = (u, v, z) => P(0.061 + u, v, z);
	r.quad([vp(0, -0.045, vz), vp(0, 0.045, vz), vp(0, 0.045, vz + 0.06), vp(0, -0.045, vz + 0.06)], "#1f2b3b");
	r.quad([vp(0.001, -0.03, vz + 0.025), vp(0.001, 0.03, vz + 0.025), vp(0.001, 0.03, vz + 0.035), vp(0.001, -0.03, vz + 0.035)], accent);
	// Arms forward, holding a tote at waist height.
	const toteC = P(0.2, 0, hipZ + 0.05);
	const hands = [];
	for (const v of [0.155, -0.155]) {
		const sh = P(0, v, hipZ + 0.26);
		const el = P(0.07, v * 1.05, hipZ + 0.1);
		const hand = P(0.19, v * 0.75, hipZ + 0.09);
		r.sphere(sh[0], sh[1], sh[2], 0.045 * H, dark, 0);
		r.beam(sh, el, 0.05 * H, 0.05 * H, body);
		r.beam(el, hand, 0.045 * H, 0.045 * H, body);
		hands.push(hand);
	}
	r.orientedBox(toteC[0], toteC[1], toteC[2] - 0.04 * H, 0.14 * H, 0.22 * H, 0.08 * H, yaw, "#2f6fb3");
	for (const hand of hands) r.sphere(hand[0], hand[1], hand[2], 0.025 * H, dark, 0);
}
