// Ride 4 shared drawing helpers: layout, colors, small geometry utilities, and the episode card
// model used by several stations and cargos. Drawing code only; no words a learner reads.

import { PAL } from "../engine/park.js";

/** Track rows (world meters). Row 1 runs toward -x behind the boarding platform, row 2 toward +x. */
export const Y1 = 80.5;
export const Y2 = 94;
export const XL = 26; // left leg (toward +y)
export const XR = 56.5; // return leg (toward -y)

/** Where the cart parks at each stop (fixed stop ids from ARCHITECTURE.md). */
export const STOP_POS = {
	recording: [44, Y1],
	upload: [39.5, Y1],
	curation: [35, Y1],
	dataset: [30.5, Y1],
	training: [31, Y2],
	simulation: [35.6, Y2],
	"real-eval": [40.2, Y2],
	rollout: [44.8, Y2],
	fleet: [49.4, Y2],
	"next-pick": [54, Y2],
};

export const R4 = {
	purple: PAL.ride.ride4,
	purpleLight: "#b892e8",
	data: "#38bdd8",
	dataHi: "#a6ecf8",
	card: "#f7f5ef",
	keep: "#2e9e5b",
	reject: "#d9483b",
	slate: "#3f4b5e",
	pad: "#d5d9df",
	padTop: "#dfe3e8",
	lit: "#5fe08a",
	unlit: "#59626c",
	glass: "#bfe9f5",
};

/** Spine colors for episode cards and binders. */
export const STRIPES = ["#8a5cc7", "#3d7fd1", "#1f9e8f", "#e8792f", "#f2c230"];

/** Pale colors for the translucent "ghost" robots in simulation. */
export const GHOST = { body: "#e9f8ff", accent: "#7fd3f7", joint: "#9cc8e0", metal: "#d3eefa", rubber: "#9cc8e0", orange: "#a9e4ff" };

/**
 * Fixed illustrative patterns shared by the stations, cargo, and close-ups, so they agree with
 * each other and with the stop text. No numbers are drawn; only these counts are pictured.
 *
 * Real trials: the stop's own example, 20 trials per model in the same written-down conditions,
 * run in random order: the new model succeeds 16 times, the old one 13 times. 1 = pass, 0 = fail.
 */
export const TRIALS = (() => {
	const fresh = [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1];
	const old = [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0];
	// Interleave the two models in a fixed shuffled order (deterministic LCG shuffle).
	const order = [...fresh.map(() => 1), ...old.map(() => 0)];
	let n = 7;
	for (let i = order.length - 1; i > 0; i--) {
		n = (n * 9301 + 49297) % 233280;
		const j = Math.floor((n / 233280) * (i + 1));
		[order[i], order[j]] = [order[j], order[i]];
	}
	// runs[k] = { model: 1 new | 0 old, index within that model, pass }
	const seen = [0, 0];
	const runs = order.map((model) => {
		const index = seen[model]++;
		return { model, index, pass: (model ? fresh : old)[index] };
	});
	return { fresh, old, runs };
})();

/**
 * The company's grape stations for the rollout and fleet stops: area 10's illustrative ten lines
 * in three kitchens, one grape station per line. Stations per kitchen (the split is a drawing
 * choice). The first station of the first kitchen is the canary.
 */
export const KITCHENS = [4, 3, 3];

/** Wilson score interval [lo, hi] for k successes in n trials (95%), or null when n is 0. */
export function wilson(k, n) {
	if (!n) return null;
	const z = 1.96;
	const p = k / n;
	const d = 1 + (z * z) / n;
	const c = (p + (z * z) / (2 * n)) / d;
	const h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
	return [c - h, c + h];
}

/** Scene time, or a fixed pose time when motion is reduced. */
export const still = (ctx, t, at = 2.2) => (ctx.reducedMotion() ? at : t);

export const lerp = (a, b, k) => a + (b - a) * k;
export const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
export const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const smooth = (v) => {
	const u = clamp01(v);
	return u * u * (3 - 2 * u);
};
/** Fractional phase of t in a cycle of length period, in [0, 1). */
export const phase = (t, period, offset = 0) => ((((t + offset) / period) % 1) + 1) % 1;

/** Local frame on a heading: at(forward, side, up) -> world [x, y, z]. */
export function frameAt(cx, cy, z, heading, s = 1) {
	const ca = Math.cos(heading);
	const sa = Math.sin(heading);
	return (f, sd, zz = 0) => [cx + (f * ca - sd * sa) * s, cy + (f * sa + sd * ca) * s, z + zz * s];
}

/** Length of a 2D or 3D polyline. */
export function polyLen(pts) {
	let L = 0;
	for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], (pts[i][2] ?? 0) - (pts[i - 1][2] ?? 0));
	return L;
}

/** Point at arc length s along a polyline (2D or 3D; z defaults to 0). */
export function pointOn(pts, s) {
	let rest = Math.max(0, s);
	for (let i = 1; i < pts.length; i++) {
		const a = pts[i - 1];
		const b = pts[i];
		const d = Math.hypot(b[0] - a[0], b[1] - a[1], (b[2] ?? 0) - (a[2] ?? 0));
		if (rest <= d || i === pts.length - 1) {
			const k = d ? Math.min(1, rest / d) : 0;
			return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, (a[2] ?? 0) + ((b[2] ?? 0) - (a[2] ?? 0)) * k];
		}
		rest -= d;
	}
	const p = pts[pts.length - 1];
	return [p[0], p[1], p[2] ?? 0];
}

/** Flat rectangle in a local frame: forward f0..f1, side s0..s1, at height zz. */
export function flatRect(r, at, f0, f1, s0, s1, zz, color, opts = {}) {
	r.quad([at(f0, s0, zz), at(f1, s0, zz), at(f1, s1, zz), at(f0, s1, zz)], color, { flat: true, ...opts });
}

/**
 * Rectangle on a vertical wall. axis "x": the wall is the plane y = c, spanning u = x0..x1;
 * axis "y": the plane x = c, spanning u = y0..y1. z0..z1 is the height.
 */
export function wallRect(r, axis, c, u0, u1, z0, z1, color, opts = {}) {
	const p = axis === "x" ? (u, z) => [u, c, z] : (u, z) => [c, u, z];
	r.quad([p(u0, z0), p(u1, z0), p(u1, z1), p(u0, z1)], color, { flat: true, ...opts });
}

/**
 * One episode card lying flat: a white card with a colored spine at one end and two thin
 * timeline lines. (cx, cy, z) is the card's bottom center; angle its long axis.
 */
export function drawCard(r, cx, cy, z, angle, stripe, opts = {}) {
	const s = opts.scale ?? 1;
	const len = 0.42;
	const wid = 0.3;
	const th = 0.03 * s;
	r.orientedBox(cx, cy, z, len * s, wid * s, th, angle, opts.color ?? R4.card);
	const at = frameAt(cx, cy, z, angle, s);
	const top = th / s + 0.002;
	flatRect(r, at, -len / 2 + 0.02, -len / 2 + 0.11, -wid / 2 + 0.02, wid / 2 - 0.02, top, stripe);
	r.line(at(-0.06, -0.06, top), at(0.17, -0.06, top), opts.line1 ?? "#9aa5b1", 1.2 * s * (opts.lineScale ?? 1));
	r.line(at(-0.06, 0.04, top), at(0.12, 0.04, top), opts.line2 ?? "#c3cad2", 1.2 * s * (opts.lineScale ?? 1));
}

/**
 * Tape bands on a box drawn with orientedBox(cx, cy, z, len, wid, hgt, heading): thin strips just
 * outside its faces (back faces are culled), so they never show through the box. across: a band
 * around the middle across the long axis; along: one running the length of the box.
 */
export function tape(r, cx, cy, z, len, wid, hgt, heading, w, color, { across = true, along = true } = {}) {
	const at = frameAt(cx, cy, z, heading, 1);
	const e = 0.004;
	const L = len / 2 + e;
	const D = wid / 2 + e;
	const T = hgt + e;
	const faces = [];
	if (across)
		faces.push(
			[at(-w / 2, -D, T), at(w / 2, -D, T), at(w / 2, D, T), at(-w / 2, D, T)],
			[at(-w / 2, D, 0), at(w / 2, D, 0), at(w / 2, D, T), at(-w / 2, D, T)],
			[at(-w / 2, -D, 0), at(w / 2, -D, 0), at(w / 2, -D, T), at(-w / 2, -D, T)],
		);
	if (along)
		faces.push(
			[at(-L, -w / 2, T + e), at(L, -w / 2, T + e), at(L, w / 2, T + e), at(-L, w / 2, T + e)],
			[at(L, -w / 2, 0), at(L, w / 2, 0), at(L, w / 2, T), at(L, -w / 2, T)],
			[at(-L, -w / 2, 0), at(-L, w / 2, 0), at(-L, w / 2, T), at(-L, -w / 2, T)],
		);
	r.mesh(faces, color, { center: at(0, 0, hgt / 2) });
}

/** Glowing halo (screen space) at a world point, scaled with zoom. */
// Glow sprites, one per color, strength and whole-pixel radius: a radial gradient made for every
// lamp on every frame was one of ride 4's hotspots.
const glowSprites = new Map();
function glowSprite(rgb, alpha, rad) {
	const key = `${rgb}|${alpha}|${rad}`;
	let s = glowSprites.get(key);
	if (!s) {
		s = document.createElement("canvas");
		s.width = s.height = rad * 2;
		const c = s.getContext("2d");
		const g = c.createRadialGradient(rad, rad, 0, rad, rad, rad);
		g.addColorStop(0, `rgba(${rgb},${alpha})`);
		g.addColorStop(1, `rgba(${rgb},0)`);
		c.fillStyle = g;
		c.fillRect(0, 0, rad * 2, rad * 2);
		if (glowSprites.size > 96) glowSprites.clear();
		glowSprites.set(key, s);
	}
	return s;
}

export function glow(r, x, y, z, radius, rgb, alpha = 0.45) {
	r.billboard(x, y, z, (c, zoom) => {
		const rad = Math.max(2, Math.round(radius * zoom));
		c.drawImage(glowSprite(rgb, alpha, rad), -rad, -rad);
	});
}
