// Ride 4 cargo: what rides on the cart deck after each stop. The cart follows one recording as it
// becomes data, a model, and finally a better pick. Drawing code only.

import { drawGrapes, drawPlate } from "../engine/food.js";
import { depthOf, mix } from "../engine/iso.js";
import { PAL } from "../engine/park.js";
import { drawSixAxis } from "../engine/robots.js";
import { drawCard, flatRect, frameAt, GHOST, glow, R4, STRIPES, TRIALS, tape, wilson } from "./ride4-common.js";

/** Draw a list of {p: [x,y,z], fn} back to front. */
function sorted(items) {
	items.sort((a, b) => depthOf(...a.p) - depthOf(...b.p));
	for (const it of items) it.fn();
}

/** A round badge drawn in screen space (check or cross), scaled with zoom. */
function badge(r, x, y, z, kind, opts = {}) {
	r.billboard(x, y, z, (c, zoom) => {
		const k = Math.min(2.2, Math.max(0.7, zoom)) * (opts.scale ?? 1);
		c.beginPath();
		c.arc(0, 0, 9 * k, 0, Math.PI * 2);
		c.fillStyle = kind === "cross" ? (opts.fill ?? R4.reject) : R4.keep;
		c.fill();
		c.lineWidth = 1.6 * k;
		c.strokeStyle = "#ffffff";
		c.stroke();
		c.lineCap = "round";
		c.lineJoin = "round";
		c.lineWidth = 2.2 * k;
		c.beginPath();
		if (kind === "check") {
			c.moveTo(-4.2 * k, 0.2 * k);
			c.lineTo(-1.2 * k, 3.2 * k);
			c.lineTo(4.4 * k, -3.4 * k);
		} else {
			c.moveTo(-3.6 * k, -3.6 * k);
			c.lineTo(3.6 * k, 3.6 * k);
			c.moveTo(-3.6 * k, 3.6 * k);
			c.lineTo(3.6 * k, -3.6 * k);
		}
		c.stroke();
	});
}

function cassette(r, ax, ay, az, h, t, rm) {
	const at = frameAt(ax, ay, az, h, 1.4);
	r.orientedBox(ax, ay, az, 0.46 * 1.4, 0.3 * 1.4, 0.08 * 1.4, h, "#2b3038");
	flatRect(r, at, -0.2, 0.2, -0.11, 0.05, 0.081, "#4a525d");
	flatRect(r, at, -0.21, 0.21, 0.07, 0.13, 0.081, "#f2c230");
	for (const f of [-0.1, 0.1]) {
		const p = at(f, -0.03, 0.081);
		r.cylinder(p[0], p[1], p[2], 0.065 * 1.4, 0.012, "#e9edf1", 10);
		r.cylinder(p[0], p[1], p[2] + 0.012, 0.025 * 1.4, 0.006, PAL.dark, 6);
	}
	const on = rm || Math.floor(t * 1.6) % 2 === 0;
	const dot = at(0.18, -0.08, 0.12);
	r.sphere(dot[0], dot[1], dot[2], 0.04, on ? "#ff3b30" : "#6b2a26", 0);
}

function parcel(r, ax, ay, az, h, t, rm) {
	r.orientedBox(ax, ay, az, 0.66, 0.6, 0.42, h, "#5b7fd9");
	tape(r, ax, ay, az, 0.66, 0.6, 0.42, h, 0.1, "#c9d6f5", { along: false });
	const bob = rm ? 0 : Math.sin(t * 3) * 0.05;
	r.cylinder(ax, ay, az + 0.5 + bob, 0.07, 0.26, R4.data, 8);
	r.cone(ax, ay, az + 0.76 + bob, 0.2, 0.26, R4.data, 10);
}

/** Curation's output: kept episodes of every kind, and dropped near-copies of one easy pick. */
function sortedCards(r, ax, ay, az, h) {
	const at = frameAt(ax, ay, az, h, 1);
	const items = [];
	const kept = [STRIPES[0], STRIPES[3], STRIPES[2]];
	for (let i = 0; i < 3; i++) {
		const p = at(-0.2, -0.02 + i * 0.012, i * 0.045);
		items.push({ p: [p[0], p[1], az], fn: () => drawCard(r, p[0], p[1], p[2], h + 0.08 * i, kept[i], { scale: 1.4 }) });
	}
	const dropped = [
		[0.26, -0.18, 0.6],
		[0.3, 0.16, -0.5],
	];
	dropped.forEach(([f, sd, a], i) => {
		const p = at(f, sd, i * 0.01);
		items.push({ p: [p[0], p[1], az], fn: () => drawCard(r, p[0], p[1], p[2], h + a, STRIPES[2], { scale: 1.05, color: "#ece6dc" }) });
	});
	sorted(items);
	const k = at(-0.24, 0, 0.5);
	badge(r, k[0], k[1], k[2], "check", { scale: 0.75 });
	const x = at(0.34, 0, 0.3);
	badge(r, x[0], x[1], x[2], "cross", { scale: 0.65, fill: "#7d8a97" });
}

function crate(r, ax, ay, az, h) {
	const at = frameAt(ax, ay, az, h, 1.3);
	const wood = PAL.wood;
	r.orientedBox(ax, ay, az, 0.66 * 1.3, 0.48 * 1.3, 0.04, h, wood);
	const walls = [
		{ f: 0, sd: -0.22, len: 0.66, wid: 0.04 },
		{ f: 0, sd: 0.22, len: 0.66, wid: 0.04 },
		{ f: -0.31, sd: 0, len: 0.04, wid: 0.48 },
		{ f: 0.31, sd: 0, len: 0.04, wid: 0.48 },
	].map((w) => ({ ...w, p: at(w.f, w.sd, 0) }));
	const byDepth = [...walls].sort((a, b) => a.p[0] + a.p[1] - (b.p[0] + b.p[1]));
	const wall = (w) => r.orientedBox(w.p[0], w.p[1], az, w.len * 1.3, w.wid * 1.3, 0.26 * 1.3, h, mix(wood, "#ffffff", 0.08));
	wall(byDepth[0]);
	wall(byDepth[1]);
	const cards = [];
	for (let i = 0; i < 6; i++) {
		const f = -0.22 + i * 0.088;
		const p = at(f, 0, 0.04);
		cards.push({
			p,
			fn: () => {
				r.orientedBox(p[0], p[1], az + 0.04, 0.03 * 1.3, 0.36 * 1.3, 0.3 * 1.3, h, R4.card);
				const tab = at(f, 0.12, 0.04 + 0.3);
				r.orientedBox(tab[0], tab[1], tab[2], 0.034 * 1.3, 0.1 * 1.3, 0.06 * 1.3, h, STRIPES[i % STRIPES.length]);
			},
		});
	}
	sorted(cards);
	wall(byDepth[2]);
	wall(byDepth[3]);
}

function weights(r, ax, ay, az, h, t, rm) {
	const at = frameAt(ax, ay, az, h, 1);
	glow(r, ax, ay, az + 0.25, 34, "120,220,255", 0.4);
	const n = 3;
	const pitch = 0.17;
	const size = 0.14;
	const items = [];
	const tt = rm ? 1.2 : t;
	for (let i = 0; i < n; i++)
		for (let j = 0; j < n; j++)
			for (let k = 0; k < n; k++) {
				const p = at((i - 1) * pitch, (j - 1) * pitch, 0.02 + k * pitch);
				const v = 0.5 + 0.5 * Math.sin(tt * 1.7 + i * 1.3 + j * 2.1 + k * 0.9);
				const color = v < 0.5 ? mix("#5b3fa8", "#38bdd8", v * 2) : mix("#38bdd8", "#f6e27a", (v - 0.5) * 2);
				items.push({ p: [p[0], p[1], p[2] + size / 2], fn: () => r.orientedBox(p[0], p[1], p[2], size, size, size, h, color) });
			}
	sorted(items);
}

/** A translucent copy of the grape station's six-axis arm with soft fingers on a small stage. */
function ghostFigure(r, ax, ay, az, h, t, rm) {
	r.cylinder(ax, ay, az, 0.32, 0.06, "#cfd6de", 12);
	r.cylinder(ax, ay, az + 0.06, 0.28, 0.01, R4.data, 12);
	const a = h + (rm ? 0.5 : 0.7 * Math.sin(t * 0.9));
	const bx = ax - Math.cos(h) * 0.12;
	const by = ay - Math.sin(h) * 0.12;
	const target = [bx + Math.cos(a) * 0.36, by + Math.sin(a) * 0.36, az + 0.2 + (rm ? 0.05 : 0.06 * Math.sin(t * 1.8))];
	const c = r.ctx;
	c.save();
	c.globalAlpha = 0.65;
	drawSixAxis(r, bx, by, target, { scale: 0.36, z: az + 0.07, tool: "fingers", grip: 0.6, colors: GHOST });
	c.restore();
	glow(r, ax, ay, az + 0.45, 30, "150,225,255", 0.3);
}

/**
 * A small scoreboard: one row per model (grey old, purple new), each a range bar for its success
 * rate after the stop's illustrative trials (TRIALS), on a shared scale with no numbers.
 */
function scoreboard(r, ax, ay, az, h) {
	const at = frameAt(ax, ay, az, h, 1);
	for (const sd of [-0.18, 0.18]) {
		const p = at(0, sd, 0);
		r.box(p[0] - 0.03, p[1] - 0.03, az, 0.06, 0.06, 0.32, PAL.dark);
	}
	r.orientedBox(ax, ay, az, 0.34, 0.5, 0.06, h, PAL.steel);
	const rows = [
		[TRIALS.old, "#9aa3ad"],
		[TRIALS.fresh, R4.purpleLight],
	];
	r.billboard(ax, ay, az + 0.55, (c, zoom) => {
		const k = Math.min(2.4, Math.max(0.7, zoom));
		const w = 38 * k;
		const hh = 24 * k;
		c.fillStyle = R4.purple;
		c.beginPath();
		c.roundRect(-w / 2 - 2 * k, -hh / 2 - 2 * k, w + 4 * k, hh + 4 * k, 3 * k);
		c.fill();
		c.fillStyle = "#1d2633";
		c.fillRect(-w / 2, -hh / 2, w, hh);
		const x0 = -w / 2 + 4 * k;
		const span = w - 8 * k;
		rows.forEach(([res, color], i) => {
			const n = res.length;
			const wins = res.reduce((s, v) => s + v, 0);
			const [lo, hi] = wilson(wins, n);
			const y = -hh / 2 + hh * (i ? 0.7 : 0.3);
			c.fillStyle = color;
			c.fillRect(x0 + lo * span, y - 2 * k, (hi - lo) * span, 4 * k);
			c.beginPath();
			c.arc(x0 + (wins / n) * span, y, 2.6 * k, 0, Math.PI * 2);
			c.fillStyle = "#ffffff";
			c.fill();
		});
	});
}

/** The sealed, versioned update, with the old model file (grey) kept beside it. */
function sealedPackage(r, ax, ay, az, h) {
	const at = frameAt(ax, ay, az, h, 1);
	const o = at(-0.33, 0.2, 0);
	const p = at(0.13, -0.06, 0);
	const old = () => {
		r.orientedBox(o[0], o[1], az, 0.24, 0.24, 0.22, h, "#9aa3ad");
		tape(r, o[0], o[1], az, 0.24, 0.24, 0.22, h, 0.04, "#d5d9df", { along: false });
	};
	const fresh = () => {
		r.orientedBox(p[0], p[1], az, 0.52, 0.46, 0.4, h, R4.purple);
		tape(r, p[0], p[1], az, 0.52, 0.46, 0.4, h, 0.08, "#f4f0e8");
	};
	sorted([
		{ p: [o[0], o[1], az], fn: old },
		{ p: [p[0], p[1], az], fn: fresh },
	]);
}

function packageCopies(r, ax, ay, az, h) {
	const at = frameAt(ax, ay, az, h, 1);
	const items = [];
	for (const f of [-0.27, 0, 0.27])
		for (const sd of [-0.15, 0.15]) {
			const p = at(f, sd, 0);
			items.push({
				p,
				fn: () => {
					r.orientedBox(p[0], p[1], az, 0.22, 0.22, 0.18, h, R4.purple);
					tape(r, p[0], p[1], az, 0.22, 0.22, 0.18, h, 0.04, "#f4f0e8", { along: false });
					r.sphere(p[0], p[1], az + 0.23, 0.035, R4.lit, 0);
				},
			});
		}
	sorted(items);
}

function pickedTray(r, ax, ay, az, h) {
	drawPlate(r, ax, ay, az, h, {}, { scale: 1.45 });
	drawGrapes(r, frameAt(ax, ay, az + 0.07, h + 0.4, 1.9), 1.9);
	const b = frameAt(ax, ay, az, h, 1)(0.28, 0.12, 0.62);
	badge(r, b[0], b[1], b[2], "check", { scale: 0.8 });
}

/** Draw the cargo for the last stop reached. */
export function drawRide4Cargo(r, stopId, pos, t, ctx) {
	const [ax, ay, az] = pos.anchor;
	const h = pos.heading;
	const rm = ctx.reducedMotion();
	switch (stopId) {
		case "recording":
			return cassette(r, ax, ay, az, h, t, rm);
		case "upload":
			return parcel(r, ax, ay, az, h, t, rm);
		case "curation":
			return sortedCards(r, ax, ay, az, h);
		case "dataset":
			return crate(r, ax, ay, az, h);
		case "training":
			return weights(r, ax, ay, az, h, t, rm);
		case "simulation":
			return ghostFigure(r, ax, ay, az, h, t, rm);
		case "real-eval":
			return scoreboard(r, ax, ay, az, h);
		case "rollout":
			return sealedPackage(r, ax, ay, az, h);
		case "fleet":
			return packageCopies(r, ax, ay, az, h);
		case "next-pick":
			return pickedTray(r, ax, ay, az, h);
		default:
			return undefined;
	}
}
