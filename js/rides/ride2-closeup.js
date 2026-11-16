// Ride 2 close-ups: one illustration per stop at the top of the stop panel, showing the signal
// in more detail than the map can. Drawn on a canvas in a 360-wide design space scaled to the
// panel. The joint close-up is the labeled cutaway; its labels are concept titles from content
// and open the concept. No other words appear except axis captions.

import { h, loadCss } from "../core/dom.js";
import { bus } from "../core/events.js";
import { FOOD } from "../engine/food.js";
import { arrow2d, drawChunk, drawPixelImage, drawWristImage, JOINT_COLORS, MASK_GREEN, netGlyph, SIGNAL } from "./ride2-cargo.js";

const W = 360;
const CSS = "css/modules/ride2.css";
const INK = "#1d2127";
const STEEL = "#8e98a4";
const DARK = "#3b4048";
const BLUE = "#3d7fd1";
const VIOLET = "#8a5cc7";
const ORANGE = "#e8792f";
const TEAL = "#1f8a7e";

// ---------------------------------------------------------------------------
// 2D helpers (design units)

function bg(c, H, floorY = null) {
	const g = c.createLinearGradient(0, 0, 0, H);
	g.addColorStop(0, "#eef6fa");
	g.addColorStop(1, "#dbe7ee");
	c.fillStyle = g;
	c.fillRect(0, 0, W, H);
	if (floorY !== null) {
		c.fillStyle = "#cfdbe3";
		c.fillRect(0, floorY, W, H - floorY);
	}
}

function rr(c, x, y, w, hh, r, fill, stroke, lw = 1.5) {
	c.beginPath();
	c.roundRect(x, y, w, hh, r);
	if (fill) {
		c.fillStyle = fill;
		c.fill();
	}
	if (stroke) {
		c.strokeStyle = stroke;
		c.lineWidth = lw;
		c.stroke();
	}
}

function poly(c, pts, fill, stroke, lw = 1.5) {
	c.beginPath();
	pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
	c.closePath();
	if (fill) {
		c.fillStyle = fill;
		c.fill();
	}
	if (stroke) {
		c.strokeStyle = stroke;
		c.lineWidth = lw;
		c.stroke();
	}
}

function line(c, x0, y0, x1, y1, color, lw = 1.5, dash = null) {
	c.beginPath();
	c.moveTo(x0, y0);
	c.lineTo(x1, y1);
	c.strokeStyle = color;
	c.lineWidth = lw;
	c.lineCap = "round";
	if (dash) c.setLineDash(dash);
	c.stroke();
	if (dash) c.setLineDash([]);
}

/** The point at fraction f (0..1) of the way along a polyline. */
function along(pts, f) {
	const lens = [];
	let total = 0;
	for (let i = 0; i < pts.length - 1; i++) {
		const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
		lens.push(l);
		total += l;
	}
	let d = Math.max(0, Math.min(1, f)) * total;
	let i = 0;
	while (i < lens.length - 1 && d > lens[i]) d -= lens[i++];
	const k = lens[i] ? d / lens[i] : 0;
	return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
}

function dot(c, x, y, r, fill, stroke = null, lw = 1) {
	c.beginPath();
	c.arc(x, y, r, 0, Math.PI * 2);
	c.fillStyle = fill;
	c.fill();
	if (stroke) {
		c.strokeStyle = stroke;
		c.lineWidth = lw;
		c.stroke();
	}
}

function grape2d(c, x, y, g, k) {
	dot(c, x, y, g, k % 3 ? FOOD.grape : FOOD.grape2);
	dot(c, x - g * 0.32, y - g * 0.32, g * 0.28, "rgba(255,255,255,0.3)");
}

/**
 * Side view of a grape bunch lying on its side, base at y, about 2r long, stem to the left.
 * Returns the stem tip (where soft fingers close).
 */
function bunchLying2d(c, x, y, r) {
	const g = r * 0.2;
	const cols = [3, 3, 3, 2, 2, 1];
	const x0 = x - r + g;
	const step = (2 * r - 2 * g) / (cols.length - 1);
	const stem = [x0 - g * 1.4, y - g * 3.6];
	line(c, x0 + g * 0.4, y - g * 2.6, stem[0], stem[1], FOOD.stem, Math.max(1.6, g * 0.55));
	cols.forEach((n, i) => {
		for (let k = 0; k < n; k++) grape2d(c, x0 + i * step, y - g - k * g * 1.65 - (i % 2) * g * 0.3, g, i + k);
	});
	return stem;
}

/** bunchLying2d turned by ang (radians, clockwise on screen) about its base center. Returns the stem tip. */
function bunchAt(c, x, y, r, ang = 0) {
	c.save();
	c.translate(x, y);
	c.rotate(ang);
	const s = bunchLying2d(c, 0, 0, r);
	c.restore();
	const ca = Math.cos(ang);
	const sa = Math.sin(ang);
	return [x + s[0] * ca - s[1] * sa, y + s[0] * sa + s[1] * ca];
}

/**
 * The blue grape tote seen a little from above, from x0 to x1, standing on yb, hh tall, holding
 * bunches [[x, r, angle, lift]] on its floor (lift raises one onto the heap). The front wall hides
 * only the bottom of the bunches. Returns each bunch's stem tip.
 */
function tote2d(c, x0, x1, yb, hh, bunches = []) {
	const fh = Math.round(hh * 0.45);
	rr(c, x0, yb - hh, x1 - x0, hh, 3, "#24578f");
	rr(c, x0 + 4, yb - hh + 4, x1 - x0 - 8, hh - fh - 2, 2, "#1d4775");
	const stems = bunches.map(([x, r, ang = 0, lift = 0]) => bunchAt(c, x, yb - fh + r * 0.35 - lift, r, ang));
	rr(c, x0, yb - fh, x1 - x0, fh, 3, "#2f6fb3", "#1f4f86", 1.2);
	line(c, x0 + 3, yb - fh + 2.5, x1 - 3, yb - fh + 2.5, "#5b9ad6", 1.4);
	for (let x = x0 + 12; x < x1 - 8; x += 18) rr(c, x, yb - fh + 7, 8, Math.max(2, fh - 12), 2, "#2a64a1");
	return stems;
}

/** A fiber tray seen at an angle: cx, cy the center of its top face, L long, D deep, sk skew. */
function fiberTray(c, cx, cy, L, D, sk) {
	const p = (u, v) => [cx + u * L + v * sk, cy - v * D];
	poly(c, [p(-0.5, -0.5), p(0.5, -0.5), [p(0.5, -0.5)[0], p(0.5, -0.5)[1] + 5], [p(-0.5, -0.5)[0], p(-0.5, -0.5)[1] + 5]], "#a98d5e");
	poly(c, [p(-0.5, -0.5), p(0.5, -0.5), p(0.5, 0.5), p(-0.5, 0.5)], FOOD.tray, "#9c8458", 1);
	poly(c, [p(-0.44, -0.38), p(0.44, -0.38), p(0.44, 0.38), p(-0.44, 0.38)], FOOD.trayIn);
	line(c, ...p(0, -0.38), ...p(0, 0.38), FOOD.tray, 1.6);
	line(c, ...p(-0.44, 0), ...p(0.44, 0), FOOD.tray, 1.6);
}

/** The line PLC: a cabinet with an input lamp (tray in place) and an output lamp (may start). */
function plc2d(c, x, y, w, hh, input, output) {
	rr(c, x, y, w, hh, 4, "#d7dce2", "#9aa5b1", 1.5);
	rr(c, x + 6, y + 8, w - 12, hh * 0.42, 3, "#3b4552");
	for (let i = 0; i < 4; i++) {
		dot(c, x + 14, y + 16 + i * 9, 2.6, i === 0 && input ? "#ffe14d" : "#59616b");
		dot(c, x + w - 14, y + 16 + i * 9, 2.6, i === 0 && output ? "#3ee07a" : "#59616b");
	}
	rr(c, x + w / 2 - 4, y + 12, 8, hh * 0.42 - 8, 2, "#2b2f36");
}

/** A grape bunch hanging from its stem at (x, y), as held by soft fingers. */
function bunchHanging2d(c, x, y, s) {
	line(c, x, y - 4 * s, x, y + 6 * s, FOOD.stem, 2.4 * s);
	[4, 4, 3, 3, 2, 1].forEach((n, row) => {
		for (let i = 0; i < n; i++) grape2d(c, x + (i - (n - 1) / 2) * 7.2 * s + (row % 2 ? 1.5 * s : 0), y + 10 * s + row * 6.4 * s, 4.3 * s, i + row);
	});
}

function tray2d(c, x, y, w, hh = 10) {
	poly(
		c,
		[
			[x - w / 2, y - hh],
			[x + w / 2, y - hh],
			[x + w / 2 - 4, y],
			[x - w / 2 + 4, y],
		],
		FOOD.tray,
		"#9c8458",
		1.2,
	);
	line(c, x - w / 2 + 3, y - hh + 2, x + w / 2 - 3, y - hh + 2, FOOD.trayIn, 1.4);
}

/** Soft fingers hanging from a quill; (x, y) is between the finger tips. open 0..1. */
function fingers2d(c, x, y, s = 1, open = 0.3) {
	c.fillStyle = "#b8c0ca";
	c.fillRect(x - 3 * s, y - 44 * s, 6 * s, 26 * s);
	rr(c, x - 11 * s, y - 22 * s, 22 * s, 8 * s, 2 * s, "#3b4552");
	for (const sg of [-1, 1]) {
		c.save();
		c.translate(x + sg * 7 * s, y - 15 * s);
		c.rotate(-sg * (0.06 + open * 0.42));
		// A curled silicone finger: wider at the root, curving in at the tip.
		c.beginPath();
		c.moveTo(-3.4 * s, 0);
		c.quadraticCurveTo(-4 * s, 9 * s, -sg * 1.5 * s - 1.5 * s, 16 * s);
		c.lineTo(-sg * 1.5 * s + 1.5 * s, 16 * s);
		c.quadraticCurveTo(4 * s, 9 * s, 3.4 * s, 0);
		c.closePath();
		c.fillStyle = ORANGE;
		c.fill();
		c.strokeStyle = "rgba(120,50,10,0.45)";
		c.lineWidth = 1;
		c.stroke();
		c.restore();
	}
}

function camera2d(c, x, y, s = 1, lensDown = true) {
	rr(c, x - 22 * s, y - 16 * s, 44 * s, 30 * s, 5 * s, "#2b2f36");
	c.fillStyle = BLUE;
	c.fillRect(x - 22 * s, y - 16 * s, 44 * s, 6 * s);
	if (lensDown) {
		rr(c, x - 10 * s, y + 14 * s, 20 * s, 10 * s, 2 * s, "#1b1e22");
		c.fillStyle = "#5aa9e6";
		c.fillRect(x - 7 * s, y + 22 * s, 14 * s, 2 * s);
	}
}

/** Planar arm from base point with link angles (radians from +x, y up is negative). */
function arm2d(c, bx, by, q, s, opts = {}) {
	const L = [48 * s, 44 * s, 16 * s];
	const pts = [[bx, by - 26 * s]];
	let a = 0;
	for (let i = 0; i < 2; i++) {
		a += q[i];
		const p = pts[pts.length - 1];
		pts.push([p[0] + Math.cos(a) * L[i], p[1] - Math.sin(a) * L[i]]);
	}
	const wrist = pts[2];
	const tool = [wrist[0], wrist[1] + L[2]];
	c.globalAlpha = opts.alpha ?? 1;
	poly(
		c,
		[
			[bx - 18 * s, by],
			[bx + 18 * s, by],
			[bx + 12 * s, by - 10 * s],
			[bx - 12 * s, by - 10 * s],
		],
		"#3b4552",
	);
	rr(c, bx - 10 * s, by - 28 * s, 20 * s, 20 * s, 4 * s, "#f2f2ee", "#c9ccd0", 1);
	const link = (p0, p1, w, col) => {
		c.lineCap = "round";
		c.strokeStyle = "#c9ccd0";
		c.lineWidth = w + 2;
		c.beginPath();
		c.moveTo(p0[0], p0[1]);
		c.lineTo(p1[0], p1[1]);
		c.stroke();
		c.strokeStyle = col;
		c.lineWidth = w;
		c.stroke();
	};
	link(pts[0], pts[1], 13 * s, "#f2f2ee");
	link(pts[1], pts[2], 10 * s, "#f2f2ee");
	link(wrist, [tool[0], tool[1] - 6 * s], 4 * s, "#b8c0ca");
	const jc = opts.jointColors;
	dot(c, pts[0][0], pts[0][1], 8 * s, jc ? jc[1] : "#2a9d8f", "#1d2127", 1);
	dot(c, pts[1][0], pts[1][1], 6.5 * s, jc ? jc[2] : "#2a9d8f", "#1d2127", 1);
	dot(c, wrist[0], wrist[1], 5 * s, jc ? jc[4] : "#3b4552", "#1d2127", 1);
	if (jc) dot(c, bx, by - 14 * s, 4 * s, jc[0], "#1d2127", 1);
	// Soft fingers closed on a stem at the tool point.
	rr(c, tool[0] - 6 * s, tool[1] - 7 * s, 12 * s, 4 * s, 1.5 * s, "#3b4552");
	for (const sg of [-1, 1]) line(c, tool[0] + sg * 4 * s, tool[1] - 4 * s, tool[0] + sg * 1.2 * s, tool[1] + 2 * s, ORANGE, 2.6 * s);
	c.globalAlpha = 1;
	return { pts, tool };
}

/** Two-link IK in the plane for arm2d (returns q). */
function ik(bx, by, tx, ty, s) {
	const L1 = 48 * s;
	const L2 = 44 * s;
	const sx = bx;
	const sy = by - 26 * s;
	const wx = tx;
	const wy = ty - 16 * s;
	const dx = wx - sx;
	const dy = sy - wy;
	let d = Math.hypot(dx, dy);
	d = Math.min(d, L1 + L2 - 0.1);
	const c2 = Math.max(-1, Math.min(1, (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2)));
	const q2 = -Math.acos(c2);
	const q1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2));
	return [q1, q2];
}

const ease = (v) => v * v * (3 - 2 * v);
const clamp01 = (v) => Math.max(0, Math.min(1, v));

// ---------------------------------------------------------------------------
// Painters: (c, H, t, ctx) with t null under reduced motion

const PAINT = {
	trigger: {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H, 176);
			// The tray belt indexes: it moves for MOVE s of each CYC s cycle, then stops with a tray
			// in the photo-eye's beam. Still frame: a tray has just stopped in the beam.
			const CYC = 3.4;
			const MOVE = 1.4;
			const PITCH = 104;
			const T = t ?? MOVE + 1.2;
			const yF = 150;
			const yB = 114;
			const sk = 34;
			const x0 = 10;
			const x1 = 232;
			const ex = 118; // emitter on the front edge of the belt, reflector straight across
			const L = 66;
			const trayXs = (tau) => {
				const k = Math.floor(tau / CYC) + ease(clamp01((((tau % CYC) + CYC) % CYC) / MOVE));
				const f = k - Math.floor(k);
				const out = [];
				for (let m = -3; m <= 3; m++) out.push(ex + (m + f) * PITCH);
				return out;
			};
			const blockedAt = (tau) => trayXs(tau).some((x) => Math.abs(x - ex) < L / 2 - 4);
			let since = 0;
			while (since < 1.5 && blockedAt(T - since)) since += 0.05;
			const blocked = since > 0;
			// Belt: top face, front face, legs.
			poly(c, [[x0, yF], [x1, yF], [x1 + sk, yB], [x0 + sk, yB]], "#3a3f47");
			poly(c, [[x0, yF], [x1, yF], [x1, yF + 9], [x0, yF + 9]], STEEL);
			for (const x of [x0 + 24, x1 - 24]) {
				c.fillStyle = DARK;
				c.fillRect(x - 3, yF + 9, 6, 176 - yF - 9);
			}
			// Back post with the reflector.
			c.fillStyle = STEEL;
			c.fillRect(ex + sk - 3, yB - 24, 6, 24);
			rr(c, ex + sk - 7, yB - 18, 14, 13, 2, "#d9483b");
			// Beam from the emitter across the belt to the reflector, cut short by a tray.
			const e0 = [ex + 1, yF - 11];
			const e1 = [ex + sk, yB - 11];
			const cut = blocked ? 0.16 : 1;
			const e2 = [e0[0] + (e1[0] - e0[0]) * cut, e0[1] + (e1[1] - e0[1]) * cut];
			line(c, e0[0], e0[1], e2[0], e2[1], "rgba(255,90,70,0.35)", 7);
			line(c, e0[0], e0[1], e2[0], e2[1], "#e6281e", 2.4);
			// Empty fiber trays riding the belt (clipped where the belt ends).
			c.save();
			c.beginPath();
			c.moveTo(x0, yF + 8);
			c.lineTo(x1, yF + 8);
			c.lineTo(x1 + sk, yB - 14);
			c.lineTo(x0 + sk, yB - 14);
			c.closePath();
			c.clip();
			for (const x of trayXs(T)) fiberTray(c, x + sk / 2, (yF + yB) / 2, L, 26, 24);
			c.restore();
			// Front post with the emitter (its lamp lights while the beam is blocked).
			c.fillStyle = STEEL;
			c.fillRect(ex - 3, yF - 16, 6, 176 - yF + 16);
			rr(c, ex - 9, yF - 19, 18, 15, 3, "#2b2f36");
			dot(c, ex + 4, yF - 15, 2.6, blocked ? "#ffe14d" : "#5d6a3a");
			// One wire from the photo-eye to the line PLC.
			const wire = [
				[ex + 9, yF - 10],
				[ex + 16, yF - 10],
				[ex + 16, 188],
				[296, 188],
				[296, 168],
			];
			c.beginPath();
			wire.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
			c.strokeStyle = "#2b2f36";
			c.lineWidth = 2.2;
			c.lineJoin = "round";
			c.stroke();
			if (blocked && since < 0.4) {
				const [px, py] = along(wire, since / 0.4);
				dot(c, px, py, 4, SIGNAL, INK, 1);
			}
			// The PLC: a screen with the input as the program sees it, and an I/O module with the
			// input lamp (tray in place) and the output lamp (go-ahead to the robot controller).
			rr(c, 258, 22, 84, 146, 5, "#d7dce2", "#9aa5b1", 1.5);
			rr(c, 266, 32, 68, 50, 4, "#0f2236", "#3b4552", 1.5);
			for (let i = 1; i < 3; i++) line(c, 269, 32 + i * 16.7, 331, 32 + i * 16.7, "rgba(120,170,220,0.22)", 1);
			c.beginPath();
			for (let i = 0; i <= 60; i++) {
				const y = blockedAt(T - (60 - i) * 0.05) ? 44 : 71;
				if (i) c.lineTo(270 + i, y);
				else c.moveTo(270 + i, y);
			}
			c.strokeStyle = SIGNAL;
			c.lineWidth = 2.2;
			c.stroke();
			rr(c, 266, 94, 68, 62, 4, "#3b4552");
			const out = blocked && since >= 0.45;
			for (let i = 0; i < 4; i++) {
				dot(c, 280, 106 + i * 12, 3, i === 0 && blocked && since >= 0.4 ? "#ffe14d" : "#59616b");
				dot(c, 320, 106 + i * 12, 3, i === 0 && out ? "#3ee07a" : "#59616b");
			}
			rr(c, 296, 100, 8, 50, 2, "#2b2f36");
			// Network cable on to the robot controller.
			line(c, 342, 124, 360, 124, "#2a9d8f", 3);
			if (out && since < 0.8) dot(c, 342 + ((since - 0.45) / 0.35) * 18, 124, 3.4, SIGNAL, INK, 1);
		},
	},

	light: {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H, 178);
			// The tote on its stand, under a fixed, steady, diffuse light with the camera in its middle.
			c.fillStyle = "#b9b2a5";
			c.fillRect(70, 166, 220, 12);
			tote2d(c, 80, 280, 166, 40, [
				[124, 20, -0.25],
				[226, 19, 0.35],
				[176, 24, 0.12, 6],
			]);
			const tops = [
				[124, 140],
				[176, 132],
				[226, 140],
			];
			// Diffuse panels: light leaves every point of them, so it reaches the grapes from many
			// directions and leaves no hard glare or shadow.
			const glow = c.createLinearGradient(0, 34, 0, 132);
			glow.addColorStop(0, "rgba(255,240,180,0.42)");
			glow.addColorStop(1, "rgba(255,240,180,0.06)");
			poly(c, [[30, 36], [330, 36], [282, 132], [78, 132]], glow);
			for (const [px0, px1] of [
				[26, 158],
				[202, 334],
			]) {
				rr(c, px0, 18, px1 - px0, 16, 6, "#dfe3e8", "#9aa5b1", 1.2);
				rr(c, px0 + 4, 31, px1 - px0 - 8, 6, 3, "#ffe98a");
			}
			c.fillStyle = "#5d6672";
			c.fillRect(158, 22, 44, 6);
			const k = t === null ? 0.45 : (t * 0.7) % 1;
			const srcs = [44, 84, 124, 236, 276, 316];
			srcs.forEach((sx, i) => {
				const [tx, ty] = tops[i % 3];
				line(c, sx, 37, tx, ty, "rgba(255,226,120,0.4)", 4);
				line(c, sx, 37, tx, ty, "#fff6c9", 1.1);
				const f = (k + i * 0.17) % 1;
				dot(c, sx + (tx - sx) * f, 37 + (ty - 37) * f, 2.2, "#ffffff");
			});
			// Light bouncing off the bunches up into the camera lens.
			camera2d(c, 180, 34, 0.9, true);
			const lens = [180, 56];
			tops.forEach(([x, y], i) => {
				line(c, x, y, lens[0], lens[1], "rgba(255,255,255,0.55)", 4);
				line(c, x, y, lens[0], lens[1], "#fffbe0", 1.4);
				const f = (k * 1.3 + i * 0.3) % 1;
				dot(c, x + (lens[0] - x) * f, y + (lens[1] - y) * f, 2.6, "#ffffff", INK, 0.6);
			});
		},
	},

	sensor: {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H, 178);
			// A structured light depth camera, fixed above the tote on a bracket: its projector lights
			// the still tote with a sequence of known stripe patterns, its camera records how the
			// stripes fall on the bunches, and out come a color picture and a distance per pixel.
			c.fillStyle = "#b9b2a5";
			c.fillRect(10, 168, 190, 10);
			tote2d(c, 18, 192, 168, 36, [
				[58, 17, -0.2],
				[150, 17, -0.35],
				[104, 21, 0.22, 5],
			]);
			c.fillStyle = "#5d6672";
			c.fillRect(0, 8, 160, 7);
			c.fillRect(100, 15, 7, 10);
			const cam = { x0: 56, x1: 150, y0: 24, y1: 46 };
			const proj = [74, 48];
			const lens = [132, 48];
			const T = t ?? 0.3;
			const pattern = Math.floor(T * 2.2) % 4;
			const bands = [6, 10, 16, 8][pattern];
			// Stripe pattern from the projector down onto the tote and the bunches.
			const yb = 160;
			const xa = 18;
			const xb = 192;
			for (let i = 0; i < bands; i += 2) {
				const u0 = xa + ((xb - xa) * i) / bands;
				const u1 = xa + ((xb - xa) * (i + 1)) / bands;
				poly(c, [proj, [u0, yb], [u1, yb]], "rgba(240,246,255,0.32)");
			}
			line(c, proj[0], proj[1], xa, yb, "rgba(220,235,255,0.7)", 1);
			line(c, proj[0], proj[1], xb, yb, "rgba(220,235,255,0.7)", 1);
			// What the camera sees: lines from the scene into its lens.
			for (const x of [40, 104, 176]) line(c, x, 140, lens[0], lens[1], "rgba(29,33,39,0.45)", 1.2, [3, 3]);
			rr(c, cam.x0, cam.y0, cam.x1 - cam.x0, cam.y1 - cam.y0, 5, "#2b2f36");
			c.fillStyle = BLUE;
			c.fillRect(cam.x0, cam.y0, cam.x1 - cam.x0, 5);
			rr(c, proj[0] - 9, cam.y1 - 2, 18, 7, 2, "#1b1e22");
			dot(c, proj[0], cam.y1 + 3, 3.4, "#f4f6ff");
			rr(c, lens[0] - 8, cam.y1 - 2, 16, 7, 2, "#1b1e22");
			dot(c, lens[0], cam.y1 + 3, 3, "#5aa9e6");
			// Out: a color picture and a picture of distance (near bright, far dark).
			arrow2d(c, 196, 92, 218, 92, INK, 2.4, 8);
			drawPixelImage(c, 232, 14, 104, 78, { frame: 4 });
			drawPixelImage(c, 232, 108, 104, 78, { frame: 4, depth: true });
		},
	},

	detection: {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H);
			// The trained model marks the exact pixels of one bunch (its mask) and scores it.
			const k = t === null ? 1 : clamp01(((t * 0.4) % 1.35) / 0.85);
			drawPixelImage(c, 18, 24, 200, 150, { cols: 16, rows: 12, frame: 5, mask: k });
			arrow2d(c, 228, 96, 248, 96, INK, 2.4, 8);
			drawPixelImage(c, 256, 36, 92, 69, { cols: 16, rows: 12, frame: 4, maskOnly: true, mask: k });
			// Confidence score with the accept threshold marked.
			rr(c, 256, 128, 92, 14, 7, "#c9d3da");
			rr(c, 256, 128, Math.max(14, 92 * 0.9 * k), 14, 7, MASK_GREEN);
			line(c, 256 + 92 * 0.68, 121, 256 + 92 * 0.68, 149, INK, 2.2);
		},
	},

	"position-3d": {
		H: 200,
		draw(c, H) {
			bg(c, H, 176);
			// The camera is fixed above the tote. Calibration measured where it sits relative to the
			// robot base (orange); the camera reports the bunch relative to itself (dark); chaining the
			// two gives the bunch relative to the base (yellow), the target the robot can use.
			c.fillStyle = "#b9b2a5";
			c.fillRect(30, 166, 182, 10);
			tote2d(c, 38, 204, 166, 34, [
				[78, 15, -0.2],
				[170, 15, 0.3],
				[124, 18, 0.15, 5],
			]);
			c.fillStyle = "#5d6672";
			c.fillRect(0, 10, 80, 6);
			c.fillRect(67, 16, 6, 8);
			camera2d(c, 70, 38, 1);
			const P = [126, 134];
			rr(c, 88, 52, 34, 22, 2, "rgba(255,255,255,0.8)", "#3b4552", 1);
			dot(c, 110, 66, 2.6, FOOD.grape2);
			// Robot base and its frame.
			const O = [304, 160];
			poly(
				c,
				[
					[O[0] - 26, O[1] + 12],
					[O[0] + 26, O[1] + 12],
					[O[0] + 18, O[1] - 4],
					[O[0] - 18, O[1] - 4],
				],
				"#3b4552",
			);
			rr(c, O[0] - 12, O[1] - 26, 24, 22, 4, "#f2f2ee", "#c9ccd0", 1);
			arrow2d(c, O[0], O[1] - 4, O[0] + 44, O[1] + 14, "#e04a3c", 3, 9);
			arrow2d(c, O[0], O[1] - 4, O[0] - 40, O[1] + 14, "#35b061", 3, 9);
			arrow2d(c, O[0], O[1] - 4, O[0], O[1] - 64, "#3d7fd1", 3, 9);
			// Base to camera (calibration), camera to bunch (measurement), base to bunch (result).
			c.setLineDash([6, 4]);
			arrow2d(c, O[0] - 6, O[1] - 30, 96, 40, ORANGE, 2.4, 9);
			c.setLineDash([4, 4]);
			arrow2d(c, 76, 62, P[0] - 4, P[1] - 7, INK, 1.8, 8);
			c.setLineDash([]);
			arrow2d(c, O[0] - 14, O[1] - 12, P[0] + 9, P[1] + 1, "#d4a400", 3, 10);
			dot(c, P[0], P[1], 6, SIGNAL, INK, 1.4);
		},
	},

	grasp: {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H, 180);
			// The chosen grasp: a point on the bunch, the fingers tilted to match how it lies, an
			// approach line with a pre-grasp point back along it, and a score. A candidate whose
			// approach would hit the tote wall is dropped.
			c.fillStyle = "#b9b2a5";
			c.fillRect(30, 170, 300, 10);
			const tilt = -0.42;
			const [stem] = tote2d(c, 40, 320, 170, 42, [
				[170, 32, tilt, 22],
				[96, 20, 0.1],
				[268, 22, 0.25],
			]);
			const up = [Math.sin(tilt), -Math.cos(tilt)];
			const pre = [stem[0] + up[0] * 92, stem[1] + up[1] * 92];
			// Rejected candidate near the right wall (faded, crossed out).
			c.save();
			c.globalAlpha = 0.3;
			c.translate(306, 120);
			c.rotate(0.7);
			fingers2d(c, 0, 0, 1.0, 1);
			c.restore();
			line(c, 292, 84, 316, 108, "#d9483b", 3);
			line(c, 316, 84, 292, 108, "#d9483b", 3);
			// Approach line from the pre-grasp point to the grasp point.
			line(c, pre[0], pre[1], stem[0], stem[1], SIGNAL, 3, [6, 4]);
			// Fingers sliding in along the approach, tilted with the bunch.
			const k = t === null ? 1 : (Math.sin(t * 1.5) + 1) / 2;
			const d = 92 - 78 * ease(k);
			c.save();
			c.translate(stem[0], stem[1]);
			c.rotate(tilt);
			fingers2d(c, 0, -d, 1.25, 1 - 0.7 * k);
			// Tool frame beside the gripper: x across, z along the approach, y out of the page.
			const fy = -d - 30;
			arrow2d(c, 24, fy, 54, fy, "#e04a3c", 2.4, 7);
			arrow2d(c, 24, fy, 24, fy + 28, "#3d7fd1", 2.4, 7);
			dot(c, 24, fy, 4.5, "#ffffff", "#35b061", 2);
			dot(c, 24, fy, 1.6, "#35b061");
			c.restore();
			// Pre-grasp point (ring) and grasp point (dot), drawn over the fingers.
			dot(c, pre[0], pre[1], 6, "rgba(255,255,255,0.85)", INK, 2);
			dot(c, stem[0], stem[1], 4.5, SIGNAL, INK, 1.4);
			// Grasp quality score.
			rr(c, 252, 16, 92, 14, 7, "#c9d3da");
			rr(c, 252, 16, 92 * 0.78, 14, 7, MASK_GREEN);
		},
	},

	trajectory: {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H, 132);
			// A route up out of the tote, clear of the camera on its bracket, and down into the
			// tray, timed to ease in and out so the hanging bunch does not swing.
			c.fillStyle = "#b9b2a5";
			c.fillRect(10, 124, 96, 8);
			tote2d(c, 14, 102, 124, 30, [
				[38, 11, 0.2],
				[80, 11, -0.25],
				[58, 13, 0.1, 4],
			]);
			c.fillStyle = "#5d6672";
			c.fillRect(0, 6, 66, 5);
			c.fillRect(54, 11, 5, 6);
			camera2d(c, 56, 24, 0.55);
			c.fillStyle = "#b9b2a5";
			c.fillRect(250, 112, 96, 14);
			tray2d(c, 298, 112, 64);
			const A = [58, 100];
			const B = [76, 40];
			const C2 = [236, 14];
			const D = [298, 98];
			const P = (s) => {
				const u = 1 - s;
				return [u * u * u * A[0] + 3 * u * u * s * B[0] + 3 * u * s * s * C2[0] + s * s * s * D[0], u * u * u * A[1] + 3 * u * u * s * B[1] + 3 * u * s * s * C2[1] + s * s * s * D[1]];
			};
			c.beginPath();
			for (let i = 0; i <= 40; i++) {
				const [x, y] = P(i / 40);
				if (i) c.lineTo(x, y);
				else c.moveTo(x, y);
			}
			c.strokeStyle = TEAL;
			c.lineWidth = 7;
			c.lineCap = "round";
			c.stroke();
			c.strokeStyle = "#7ff0e0";
			c.lineWidth = 2;
			c.stroke();
			// Ticks at equal time steps: close at the ends (slow), far apart mid-path (fast).
			for (let i = 0; i <= 10; i++) {
				const [x, y] = P(ease(i / 10));
				dot(c, x, y, 3, "#ffffff", TEAL, 1.2);
			}
			const k = t === null ? 0.5 : (t * 0.35) % 1;
			const [mx, my] = P(ease(k));
			dot(c, mx, my, 6, SIGNAL, INK, 1.2);
			// Speed over time below.
			const gx = 40;
			const gy = 188;
			const gw = 280;
			line(c, gx, gy, gx + gw, gy, INK, 1.2);
			line(c, gx, gy, gx, gy - 46, INK, 1.2);
			c.beginPath();
			for (let i = 0; i <= 60; i++) {
				const s = i / 60;
				const v = 6 * s * (1 - s);
				const x = gx + s * gw;
				const y = gy - v * 26;
				if (i) c.lineTo(x, y);
				else c.moveTo(x, y);
			}
			c.strokeStyle = TEAL;
			c.lineWidth = 2.4;
			c.stroke();
			dot(c, gx + k * gw, gy - 6 * k * (1 - k) * 26, 4, SIGNAL, INK, 1);
			c.fillStyle = "#59616c";
			c.font = "600 10px system-ui, sans-serif";
			c.textAlign = "right";
			c.fillText("time", gx + gw, gy + 11);
			c.textAlign = "left";
			c.fillText("speed", gx + 4, gy - 40);
		},
	},
	"joint-targets": {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H);
			const k = t === null ? 1 : ease(clamp01(((t * 0.4) % 1.4) / 0.9));
			const targets = [0.55, 0.85, 0.35, 0.68, 0.45, 0.72];
			// Mini arm with colored joints.
			c.fillStyle = "#cfdbe3";
			c.fillRect(0, 168, 120, 32);
			arm2d(c, 50, 168, [1.1, -1.6], 1.05, { jointColors: JOINT_COLORS });
			// Six dials.
			for (let i = 0; i < 6; i++) {
				const cx = 160 + (i % 3) * 72;
				const cy = 58 + Math.floor(i / 3) * 84;
				const rad = 27;
				dot(c, cx, cy, rad + 3, "#ffffff", "#c9d3da", 2);
				c.beginPath();
				c.arc(cx, cy, rad - 4, Math.PI * 0.75, Math.PI * 2.25);
				c.strokeStyle = "#e4eaee";
				c.lineWidth = 6;
				c.stroke();
				const a1 = Math.PI * 0.75 + Math.PI * 1.5 * targets[i] * k;
				c.beginPath();
				c.arc(cx, cy, rad - 4, Math.PI * 0.75, a1);
				c.strokeStyle = JOINT_COLORS[i];
				c.stroke();
				const at = Math.PI * 0.75 + Math.PI * 1.5 * targets[i];
				line(c, cx + Math.cos(at) * (rad - 10), cy + Math.sin(at) * (rad - 10), cx + Math.cos(at) * (rad + 2), cy + Math.sin(at) * (rad + 2), INK, 2);
				line(c, cx, cy, cx + Math.cos(a1) * (rad - 8), cy + Math.sin(a1) * (rad - 8), INK, 2.4);
				dot(c, cx, cy, 3.5, INK);
				c.fillStyle = INK;
				c.font = "700 11px system-ui, sans-serif";
				c.textAlign = "center";
				c.fillText(String(i + 1), cx, cy + rad + 15);
			}
		},
	},

	policy: {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H);
			// One trained network. In: the overhead and wrist camera images and the six joint
			// angles. Out: an action chunk, the next stretch of all six joint targets, replaced by a
			// fresh chunk before the current one runs out.
			const k = t === null ? null : (t * 0.5) % 1;
			drawPixelImage(c, 14, 14, 68, 51, { frame: 3 });
			drawWristImage(c, 14, 78, 68, 51, 3);
			const targets = [0.55, 0.85, 0.35, 0.68, 0.45, 0.72];
			rr(c, 11, 140, 74, 52, 5, "#ffffff", "#c9d3da", 1.5);
			for (let i = 0; i < 6; i++) {
				const hh = 6 + targets[i] * 36;
				c.fillStyle = JOINT_COLORS[i];
				c.fillRect(17 + i * 10.8, 187 - hh, 8, hh);
			}
			arrow2d(c, 90, 40, 112, 74, VIOLET, 2.4, 8);
			arrow2d(c, 90, 104, 112, 100, VIOLET, 2.4, 8);
			arrow2d(c, 90, 166, 112, 126, VIOLET, 2.4, 8);
			const lit = [0, 1, 2, 3].map((ci) => (k === null ? 0.5 : Math.max(0, 1 - Math.abs(k * 4.6 - ci - 0.3) * 1.2)));
			rr(c, 116, 22, 112, 156, 12, "rgba(217,195,236,0.55)", VIOLET, 2);
			netGlyph(c, 130, 34, 84, 132, [4, 6, 6, 4], lit, { edge: "rgba(138,92,199,0.4)" });
			arrow2d(c, 234, 100, 254, 100, VIOLET, 2.4, 8);
			drawChunk(c, 260, 30, 88, 132, t, 2.2);
			c.fillStyle = "#59616c";
			c.font = "600 10px system-ui, sans-serif";
			c.textAlign = "right";
			c.fillText("time", 348, 176);
		},
	},
	drive: {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H, 176);
			const T = t ?? 0.4;
			// Controller cabinet with a target trace.
			rr(c, 12, 44, 62, 120, 4, "#d7dce2", "#9aa5b1", 1.5);
			rr(c, 20, 56, 46, 30, 3, "#1f3a52");
			c.beginPath();
			for (let i = 0; i <= 20; i++) {
				const x = 22 + i * 2.1;
				const y = 80 - Math.min(1, i / 12) * 18;
				if (i) c.lineTo(x, y);
				else c.moveTo(x, y);
			}
			c.strokeStyle = "#5fe0a0";
			c.lineWidth = 1.8;
			c.stroke();
			arrow2d(c, 78, 70, 104, 70, INK, 2.4, 8);
			// Drive cabinet with six modules.
			rr(c, 108, 36, 82, 128, 4, "#c9d0d8", "#9aa5b1", 1.5);
			for (let i = 0; i < 6; i++) {
				rr(c, 114 + i * 12.4, 50, 10, 70, 2, "#3b4552");
				const lvl = 0.5 + 0.45 * Math.sin(T * 6 + i);
				c.fillStyle = "#ffb347";
				c.fillRect(116 + i * 12.4, 116 - 40 * lvl, 6, 40 * lvl);
				dot(c, 119 + i * 12.4, 56, 2, "#3ee07a");
			}
			// Three-phase current out to the motor.
			const colors = ["#ff6b5b", "#e0a800", "#3d7fd1"];
			for (let p = 0; p < 3; p++) {
				c.beginPath();
				for (let i = 0; i <= 80; i++) {
					const x = 196 + i * 1.1;
					const y = 88 + p * 1 + 22 * Math.sin(i * 0.16 - T * 5 + (p * 2 * Math.PI) / 3);
					if (i) c.lineTo(x, y);
					else c.moveTo(x, y);
				}
				c.strokeStyle = colors[p];
				c.lineWidth = 2.4;
				c.stroke();
			}
			// Motor with windings.
			dot(c, 316, 92, 34, "#56606d", INK, 1.5);
			for (let i = 0; i < 6; i++) {
				const a = (i / 6) * Math.PI * 2;
				c.save();
				c.translate(316 + Math.cos(a) * 22, 92 + Math.sin(a) * 22);
				c.rotate(a);
				rr(c, -5, -7, 10, 14, 2, "#c87533");
				c.restore();
			}
			dot(c, 316, 92, 12, "#8e98a4", INK, 1);
			const ra = T * 4;
			line(c, 316, 92, 316 + Math.cos(ra) * 11, 92 + Math.sin(ra) * 11, "#d9483b", 2.4);
			// Encoder feedback from the motor back up into the drive.
			c.beginPath();
			c.moveTo(316, 128);
			c.lineTo(316, 188);
			c.lineTo(170, 188);
			c.lineTo(170, 176);
			c.strokeStyle = TEAL;
			c.setLineDash([5, 4]);
			c.lineWidth = 2;
			c.stroke();
			c.setLineDash([]);
			arrow2d(c, 170, 180, 170, 166, TEAL, 2, 7);
			// Safety is wired separately: an e-stop on its own two-channel wire into the drive.
			c.beginPath();
			c.moveTo(100, 160);
			c.lineTo(100, 174);
			c.lineTo(128, 174);
			c.lineTo(128, 165);
			c.strokeStyle = "#f2c230";
			c.lineWidth = 3.6;
			c.lineJoin = "round";
			c.stroke();
			c.strokeStyle = INK;
			c.setLineDash([4, 4]);
			c.stroke();
			c.setLineDash([]);
			rr(c, 80, 146, 22, 22, 3, "#f2c230", "#b8901a", 1.2);
			rr(c, 84, 140, 14, 6, 2, "#3b4552");
			dot(c, 91, 138, 7.5, "#d9483b", "#8f2a22", 1.2);
		},
	},

	"arm-motion": {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H, 172);
			tote2d(c, 10, 104, 172, 30, [
				[34, 12, 0.2],
				[82, 12, -0.3],
				[58, 13, 0.1, 3],
			]);
			c.fillStyle = "#b9b2a5";
			c.fillRect(250, 150, 100, 22);
			tray2d(c, 300, 150, 70);
			const base = [176, 172];
			const s = 1.65;
			// Tool points high enough that the hanging bunch just clears the tote and meets the tray.
			const pick = [56, 108];
			const place = [300, 116];
			const pose = (k) => {
				const x = pick[0] + (place[0] - pick[0]) * k;
				const y = pick[1] - Math.sin(Math.PI * k) * 40;
				return [x, y];
			};
			for (const k of [0, 0.5, 1]) {
				const [x, y] = pose(k);
				arm2d(c, base[0], base[1], ik(base[0], base[1], x, y, s), s, { alpha: 0.18 });
			}
			const k = t === null ? 0.3 : (Math.sin(t * 1.1) + 1) / 2;
			const [x, y] = pose(ease(k));
			const q = ik(base[0], base[1], x, y, s);
			const { pts } = arm2d(c, base[0], base[1], q, s, { jointColors: JOINT_COLORS });
			bunchHanging2d(c, x, y + 2, 0.7);
			// Rotation arcs at the shoulder and elbow.
			for (const [p, col] of [
				[pts[0], JOINT_COLORS[1]],
				[pts[1], JOINT_COLORS[2]],
			]) {
				c.beginPath();
				c.arc(p[0], p[1], 20, -2.4, -0.7);
				c.strokeStyle = col;
				c.lineWidth = 2.4;
				c.stroke();
				arrow2d(c, p[0] + Math.cos(-0.9) * 20, p[1] + Math.sin(-0.9) * 20, p[0] + Math.cos(-0.7) * 20, p[1] + Math.sin(-0.7) * 20, col, 2.4, 7);
			}
			c.beginPath();
			c.ellipse(base[0], base[1] - 4, 30, 7, 0, 0.2, Math.PI - 0.2);
			c.strokeStyle = JOINT_COLORS[0];
			c.lineWidth = 2.4;
			c.stroke();
		},
	},

	gripper: {
		H: 200,
		anim: true,
		draw(c, H, t) {
			bg(c, H, 172);
			c.fillStyle = "#b9b2a5";
			c.fillRect(40, 150, 240, 22);
			const tx = 170;
			tray2d(c, tx, 150, 120, 14);
			// Air supply for the soft fingers, with a pressure gauge, on the left.
			rr(c, 20, 96, 46, 54, 4, "#d7dce2", "#9aa5b1", 1.5);
			const ph = t === null ? null : (t / 3.4) % 1;
			// The line PLC on the right: its "pick done" lamp lights once the bunch is down.
			const last = ph ?? 0.72;
			const done = last >= 0.62;
			line(c, 324, 0, 324, 92, TEAL, 2, [5, 4]);
			if (last >= 0.5 && last < 0.62) dot(c, 324, ((last - 0.5) / 0.12) * 92, 3.6, SIGNAL, INK, 1);
			plc2d(c, 300, 92, 48, 80, done, false);
			const draw = (phase, ox, alpha) => {
				c.globalAlpha = alpha;
				const down = phase < 0.45 ? phase / 0.45 : phase < 0.6 ? 1 : 1 - (phase - 0.6) / 0.4;
				const cy = 56 + 44 * ease(down);
				const x = tx + ox;
				const placed = phase >= 0.45;
				if (placed) bunchLying2d(c, x, 139, 20);
				// The arm's forearm and wrist above the fingers.
				const w = [x, cy - 60];
				c.lineCap = "round";
				c.strokeStyle = "#c9ccd0";
				c.lineWidth = 16;
				c.beginPath();
				c.moveTo(x + 80, cy - 112);
				c.lineTo(w[0], w[1]);
				c.stroke();
				c.strokeStyle = "#f2f2ee";
				c.lineWidth = 13;
				c.stroke();
				dot(c, w[0], w[1], 7, "#3b4552", INK, 1);
				// Air hose to the fingers.
				c.strokeStyle = "#5d6672";
				c.lineWidth = 3;
				c.beginPath();
				c.moveTo(66, 110);
				c.bezierCurveTo(120, 110, x - 40, cy - 60, x - 4, cy - 40);
				c.stroke();
				if (!placed) bunchHanging2d(c, x, cy - 2, 0.9);
				fingers2d(c, x, cy, 1.3, placed ? Math.min(1, (phase - 0.45) * 5) : 0);
				if (placed && phase < 0.8) {
					const k = (phase - 0.45) / 0.35;
					for (const s of [-1, 1]) line(c, x + s * (18 + k * 16), cy + 2 - k * 6, x + s * (26 + k * 22), cy - 6 - k * 10, `rgba(80,100,120,${(1 - k).toFixed(2)})`, 1.6);
				}
				// Gauge needle: finger air pressure high while holding, vented to open.
				const press = placed ? Math.max(0, 1 - (phase - 0.45) * 5) : 1;
				dot(c, 43, 116, 13, "#ffffff", INK, 1.2);
				const a = Math.PI * 0.8 + Math.PI * 1.4 * press;
				line(c, 43, 116, 43 + Math.cos(a) * 10, 116 + Math.sin(a) * 10, "#d9483b", 2);
				c.globalAlpha = 1;
			};
			if (ph === null) {
				// Still frame: held above the tray (faded) and then resting in the tray.
				draw(0.3, -52, 0.45);
				arrow2d(c, tx - 24, 74, tx + 16, 74, INK, 2, 7);
				draw(0.72, 30, 1);
			} else draw(ph, 0, 1);
		},
	},
};

// ---------------------------------------------------------------------------
// The joint cutaway (labeled)

/** Parts along the axis in design units, and the concept each label opens. */
const CUT = { x0: 76, x1: 318, cy: 132, R: 52 };
const JOINT_LABELS = [
	{ id: "servo-drive", row: "top", anchor: [36, 86] },
	{ id: "brake", row: "bottom", anchor: [101, 156] },
	{ id: "encoder", row: "top", anchor: [124, 92] },
	{ id: "servo-motor", row: "bottom", anchor: [176, 165] },
	{ id: "gearbox", row: "top", anchor: [244, 93] },
	{ id: "torque-sensing", row: "bottom", anchor: [282, 162] },
];

function paintJoint(c, H, t) {
	bg(c, H);
	const { x0, x1, cy, R } = CUT;
	const T = t ?? 0.3;
	// Servo drive outside, with the cable into the joint.
	rr(c, 14, 92, 44, 70, 4, "#c9d0d8", "#9aa5b1", 1.5);
	for (let i = 0; i < 3; i++) rr(c, 19 + i * 12.5, 102, 9, 40, 2, "#3b4552");
	dot(c, 36, 150, 3, "#3ee07a");
	c.beginPath();
	c.moveTo(58, 140);
	c.bezierCurveTo(70, 140, 66, cy + 10, x0 + 6, cy + 10);
	c.strokeStyle = ORANGE;
	c.lineWidth = 5;
	c.stroke();
	// Housing walls, cut (hatched bands top and bottom).
	const wall = 9;
	for (const s of [-1, 1]) {
		const y = s < 0 ? cy - R : cy + R - wall;
		rr(c, x0, y, x1 - x0 - 20, wall, 2, "#eef0f2", "#9aa5b1", 1);
		c.save();
		c.beginPath();
		c.rect(x0, y, x1 - x0 - 20, wall);
		c.clip();
		c.strokeStyle = "rgba(232,121,47,0.7)";
		c.lineWidth = 1.2;
		for (let x = x0 - 20; x < x1; x += 7) line(c, x, y + wall, x + wall, y, "rgba(232,121,47,0.7)", 1.2);
		c.restore();
	}
	rr(c, x0 - 4, cy - R, 8, R * 2, 2, "#d9dde1", "#9aa5b1", 1);
	// Shaft.
	rr(c, x0 + 4, cy - 6, 228, 12, 3, "#c6cdd4", "#8e98a4", 1);
	// Brake: coil and friction disk.
	const bx = 92;
	rr(c, bx, cy - 40, 20, 80, 3, "#6b7480");
	for (const s of [-1, 1]) rr(c, bx + 3, cy + s * 24 - 8, 12, 16, 2, "#c87533");
	rr(c, bx + 21, cy - 36, 4, 72, 1, "#c9b28a");
	// Encoder disk with slits and read head.
	const ex = 124;
	rr(c, ex - 2.5, cy - 34, 5, 68, 1, "#8fc9df");
	const off = (T * 1.6) % 1;
	for (let i = 0; i < 6; i++) {
		const f = (i + off) / 6;
		line(c, ex - 2.5, cy - 34 + f * 30, ex + 2.5, cy - 34 + f * 30, "#1d2a33", 1.3);
		line(c, ex - 2.5, cy + 4 + f * 30, ex + 2.5, cy + 4 + f * 30, "#1d2a33", 1.3);
	}
	rr(c, ex - 6, cy - 46, 12, 9, 2, "#2b2f36");
	dot(c, ex, cy - 41, 1.8, Math.sin(T * 20) > 0 ? "#ff5a4f" : "#5b2a2a");
	// The encoder's reading goes back to the drive.
	c.beginPath();
	c.moveTo(ex - 6, cy - 42);
	c.lineTo(64, cy - 42);
	c.lineTo(64, 104);
	c.lineTo(58, 104);
	c.strokeStyle = TEAL;
	c.setLineDash([4, 3]);
	c.lineWidth = 1.8;
	c.stroke();
	c.setLineDash([]);
	// Motor: stator with windings, rotor with magnets.
	const mx0 = 140;
	const mx1 = 212;
	for (const s of [-1, 1]) {
		const y = s < 0 ? cy - R + wall : cy + 18;
		rr(c, mx0, y, mx1 - mx0, R - wall - 18, 2, "#56606d");
		const glow = 0.5 + 0.25 * (Math.sin(T * 9) + 1);
		for (let i = 0; i < 5; i++) {
			c.globalAlpha = 0.6 + 0.4 * glow;
			rr(c, mx0 + 4 + i * 13.6, y + 4, 10, R - wall - 26, 2, "#c87533");
			c.globalAlpha = 1;
		}
	}
	const flip = Math.floor(T * 2.5) % 2 === 0;
	rr(c, mx0 + 4, cy - 16, mx1 - mx0 - 8, 10, 2, flip ? "#d9483b" : BLUE);
	rr(c, mx0 + 4, cy + 6, mx1 - mx0 - 8, 10, 2, flip ? BLUE : "#d9483b");
	// Gearbox: circular spline, teeth, flexspline, wave generator.
	const gx0 = 220;
	const gx1 = 268;
	for (const s of [-1, 1]) {
		const y = s < 0 ? cy - R + wall : cy + 32;
		rr(c, gx0, y, gx1 - gx0, R - wall - 32, 2, "#7a8594");
		c.beginPath();
		const yt = s < 0 ? cy - 32 : cy + 32;
		for (let i = 0; i <= 12; i++) {
			const x = gx0 + (i / 12) * (gx1 - gx0);
			const yy = yt + (i % 2 ? -s * 4 : 0);
			if (i) c.lineTo(x, yy);
			else c.moveTo(x, yy);
		}
		c.strokeStyle = "#2b2f36";
		c.lineWidth = 1.5;
		c.stroke();
		rr(c, gx0 + 2, s < 0 ? cy - 30 : cy + 22, gx1 - gx0 - 4, 8, 2, "#c3cad2");
	}
	rr(c, gx0 + 6, cy - 20, gx1 - gx0 - 12, 40, 6, "#d9a441");
	rr(c, gx0 + 6, cy - 6, gx1 - gx0 - 12, 12, 3, "#c6cdd4", "#8e98a4", 1);
	// Torque sensor ring with strain gauges.
	const tx = 276;
	rr(c, tx, cy - 40, 10, 80, 2, "#3d9970");
	for (const yy of [cy - 28, cy - 14, cy + 6, cy + 20]) rr(c, tx + 2, yy, 6, 7, 1, SIGNAL);
	// Output flange turning, and the next link.
	const fx = 292;
	rr(c, fx, cy - 44, 12, 88, 3, "#c9d0d8", "#8e98a4", 1);
	const ra = T * 0.9;
	for (let i = 0; i < 4; i++) {
		const yy = cy + Math.sin(ra + (i * Math.PI) / 2) * 32;
		const vis = Math.cos(ra + (i * Math.PI) / 2) > 0;
		if (vis) dot(c, fx + 6, yy, 3, "#3b4552");
	}
	rr(c, fx + 12, cy - 30, 40, 60, 6, "#f2f2ee", "#c9ccd0", 1.5);
	c.beginPath();
	c.arc(fx + 6, cy, 54, -0.5, 0.5);
	c.strokeStyle = ORANGE;
	c.lineWidth = 2.6;
	c.stroke();
	arrow2d(c, fx + 6 + Math.cos(0.3) * 54, cy + Math.sin(0.3) * 54, fx + 6 + Math.cos(0.5) * 54, cy + Math.sin(0.5) * 54, ORANGE, 2.6, 8);
}

/** Lay out one row of labels: centered on their anchors where possible, never overlapping. */
function layoutRow(items, width, gap = 6, pad = 4) {
	items.sort((a, b) => a.ax - b.ax);
	for (const it of items) it.x = it.ax - it.w / 2;
	for (let i = 0; i < items.length; i++) {
		const min = i === 0 ? pad : items[i - 1].x + items[i - 1].w + gap;
		items[i].x = Math.max(items[i].x, min);
	}
	for (let i = items.length - 1; i >= 0; i--) {
		const max = i === items.length - 1 ? width - pad - items[i].w : items[i + 1].x - gap - items[i].w;
		items[i].x = Math.min(items[i].x, max);
	}
	if (items.length && items[0].x < pad) {
		// Too wide for one line of labels: spread evenly instead.
		const total = items.reduce((s, it) => s + it.w, 0);
		const g = Math.max(2, (width - pad * 2 - total) / Math.max(1, items.length - 1));
		let x = pad;
		for (const it of items) {
			it.x = x;
			x += it.w + g;
		}
	}
}

function mountJointLabels(wrap, ctx) {
	const layer = h("div", { class: "r2-cut-labels" });
	const svgNS = "http://www.w3.org/2000/svg";
	const svg = document.createElementNS(svgNS, "svg");
	svg.setAttribute("class", "r2-cut-lines");
	svg.setAttribute("aria-hidden", "true");
	layer.append(svg);
	const labels = [];
	for (const def of JOINT_LABELS) {
		const concept = ctx.content.concepts?.[def.id];
		if (!concept) continue;
		const b = h("button", { type: "button", class: `r2-cut-label r2-${def.row}`, "data-concept-label": def.id }, concept.title);
		b.addEventListener("click", (e) => {
			e.stopPropagation();
			location.hash = `#/concept/${def.id}`;
		});
		layer.append(b);
		labels.push({ def, el: b });
	}
	wrap.append(layer);
	return {
		count: labels.length,
		layout(cssW, cssH, H) {
			const k = cssW / W;
			svg.setAttribute("viewBox", `0 0 ${cssW} ${cssH}`);
			svg.setAttribute("width", String(cssW));
			svg.setAttribute("height", String(cssH));
			for (const row of ["top", "bottom"]) {
				const inRow = labels.filter((l) => l.def.row === row);
				// Share the row's width: short labels keep one line, long ones wrap within what is left.
				const natural = inRow.map((l) => {
					l.el.style.left = "0px";
					l.el.style.maxWidth = "none";
					l.el.style.whiteSpace = "nowrap";
					const w = Math.ceil(l.el.getBoundingClientRect().width) + 1;
					l.el.style.whiteSpace = "";
					return w;
				});
				let remaining = cssW - 8 - 6 * Math.max(0, inRow.length - 1);
				const order = natural.map((_, i) => i).sort((a, b) => natural[a] - natural[b]);
				const cap = [];
				order.forEach((i, n) => {
					cap[i] = Math.min(natural[i], Math.max(70, Math.floor(remaining / (order.length - n))));
					remaining -= cap[i];
				});
				const items = inRow.map((l, i) => {
					l.el.style.maxWidth = `${cap[i]}px`;
					return { l, ax: l.def.anchor[0] * k, w: Math.ceil(l.el.offsetWidth), hgt: l.el.offsetHeight };
				});
				layoutRow(items, cssW);
				for (const it of items) {
					it.l.el.style.left = `${Math.round(it.x)}px`;
					if (row === "top") it.l.el.style.top = "6px";
					else it.l.el.style.top = `${Math.round(cssH - it.hgt - 6)}px`;
					it.l.box = { x: it.x, w: it.w, y: row === "top" ? 6 : cssH - it.hgt - 6, hgt: it.hgt };
				}
			}
			svg.replaceChildren();
			for (const l of labels) {
				if (!l.box) continue;
				const [axd, ayd] = l.def.anchor;
				const ax = axd * k;
				const ay = ayd * (cssH / H);
				const top = l.def.row === "top";
				const sx = Math.min(Math.max(ax, l.box.x + 8), l.box.x + l.box.w - 8);
				const sy = top ? l.box.y + l.box.hgt : l.box.y;
				const elbowY = top ? sy + 8 : sy - 8;
				const path = document.createElementNS(svgNS, "polyline");
				path.setAttribute("points", `${sx},${sy} ${sx},${elbowY} ${ax},${ay}`);
				path.setAttribute("class", "r2-cut-line");
				svg.append(path);
				const d = document.createElementNS(svgNS, "circle");
				d.setAttribute("cx", String(ax));
				d.setAttribute("cy", String(ay));
				d.setAttribute("r", "3");
				d.setAttribute("class", "r2-cut-dot");
				svg.append(d);
			}
		},
	};
}

// ---------------------------------------------------------------------------

export function mountCloseup(stopId, el, ctx) {
	const isJoint = stopId === "joint";
	const painter = isJoint ? { H: 240, anim: true, draw: paintJoint } : PAINT[stopId];
	if (!painter) return () => {};
	const H = painter.H;
	const wrap = h("div", { class: `r2-closeup${isJoint ? " r2-cutaway" : ""}`, "data-r2-closeup": stopId });
	const canvas = h("canvas", { class: "closeup-canvas", "aria-hidden": "true" });
	wrap.append(canvas);
	el.append(wrap);
	const labels = isJoint ? mountJointLabels(wrap, ctx) : null;
	let cssW = 0;
	let cssH = 0;
	let dpr = 1;
	const size = () => {
		const w = Math.max(240, Math.round(el.clientWidth || 320));
		const hh = Math.round((w * H) / W);
		const d = Math.min(2, window.devicePixelRatio || 1);
		if (w === cssW && hh === cssH && d === dpr) return false;
		cssW = w;
		cssH = hh;
		dpr = d;
		canvas.width = Math.round(w * d);
		canvas.height = Math.round(hh * d);
		canvas.style.width = `${w}px`;
		canvas.style.height = `${hh}px`;
		wrap.style.height = `${hh}px`;
		return true;
	};
	const paint = (time) => {
		const c = canvas.getContext("2d");
		const k = cssW / W;
		c.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
		c.clearRect(0, 0, W, H);
		painter.draw(c, H, time, ctx);
	};
	let raf = 0;
	let last = 0;
	let onScreen = true;
	const t0 = performance.now();
	const frame = (now) => {
		raf = 0;
		if (!wrap.isConnected || !onScreen || document.hidden) return;
		if (ctx.reducedMotion()) {
			paint(null);
			return;
		}
		if (now - last > 32) {
			last = now;
			paint((now - t0) / 1000);
		}
		raf = requestAnimationFrame(frame);
	};
	const start = () => {
		if (!raf && onScreen && painter.anim && !ctx.reducedMotion() && !document.hidden) raf = requestAnimationFrame(frame);
	};
	const redraw = () => {
		const changed = size();
		if (changed && labels) labels.layout(cssW, cssH, H);
		paint(painter.anim && !ctx.reducedMotion() ? (performance.now() - t0) / 1000 : null);
		start();
	};
	redraw();
	const ro = new ResizeObserver(redraw);
	ro.observe(el);
	// Label sizes depend on this module's stylesheet (which may still be loading on a deep link)
	// and on fonts: lay them out again whenever a label changes size.
	let relayout = 0;
	const labelRo = labels
		? new ResizeObserver(() => {
				if (relayout) return;
				relayout = requestAnimationFrame(() => {
					relayout = 0;
					if (wrap.isConnected) labels.layout(cssW, cssH, H);
				});
			})
		: null;
	if (labels) {
		for (const b of wrap.querySelectorAll(".r2-cut-label")) labelRo.observe(b);
		loadCss(CSS).then(() => wrap.isConnected && labels.layout(cssW, cssH, H));
	}
	const onVis = () => {
		if (!document.hidden) start();
	};
	document.addEventListener("visibilitychange", onVis);
	// Animate only while the close-up is on screen (scrolled out or under the collapsed sheet: stop).
	const io = new IntersectionObserver((entries) => {
		onScreen = entries.some((e) => e.isIntersecting);
		start();
	});
	io.observe(wrap);
	// The reduced-motion setting (system or in-app toggle) can change while the panel is open.
	const offMotion = bus.on("motion", () => {
		cancelAnimationFrame(raf);
		raf = 0;
		redraw();
	});
	return () => {
		cancelAnimationFrame(raf);
		raf = 0;
		offMotion();
		cancelAnimationFrame(relayout);
		ro.disconnect();
		labelRo?.disconnect();
		io.disconnect();
		document.removeEventListener("visibilitychange", onVis);
		wrap.remove();
	};
}
