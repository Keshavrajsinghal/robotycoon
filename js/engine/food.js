// The cheese plate as low-poly models: fiber tray, grape bunch, apple slices, cracker packs,
// cheese wedges, inspection pass mark, and clear lid. Shared by every ride that shows the
// plate. Sizes are exaggerated (about 2.5x) so the cargo reads at park zoom.

import { depthOf } from "./iso.js";

export const FOOD = {
	tray: "#c9ae80",
	trayIn: "#b89b6c",
	grape: "#6f3f8f",
	grape2: "#83509f",
	stem: "#5d7b34",
	apple: "#f3e6b8",
	skin: "#c8352b",
	pack: "#d8dde3",
	packBand: "#c0392b",
	cheese: "#f2c14e",
	cheeseRind: "#e0a93a",
	lid: "#e9f5fb",
	pass: "#2e9e5b",
};

/** Which items are on the plate after each ride-1 stop. */
export const PLATE_AFTER = {
	denester: {},
	infeed: {},
	grapes: { grapes: true },
	apples: { grapes: true, apples: true },
	crackers: { grapes: true, apples: true, crackers: true },
	cheese: { grapes: true, apples: true, crackers: true, cheese: true },
	inspection: { grapes: true, apples: true, crackers: true, cheese: true, pass: true },
	lidding: { grapes: true, apples: true, crackers: true, cheese: true, pass: true, lid: true },
	outfeed: { grapes: true, apples: true, crackers: true, cheese: true, pass: true, lid: true },
};

function frame(cx, cy, z, heading, s) {
	const ca = Math.cos(heading);
	const sa = Math.sin(heading);
	return (f, sd, zz = 0) => [cx + (f * ca - sd * sa) * s, cy + (f * sa + sd * ca) * s, z + zz * s];
}

export function drawGrapes(r, at, s = 1, lw = 1) {
	const balls = [];
	const rows = [4, 3, 3, 2, 1];
	rows.forEach((n, row) => {
		for (let i = 0; i < n; i++) balls.push([row * 0.055 - 0.11, (i - (n - 1) / 2) * 0.06, row % 2 ? 0.05 : 0.04]);
	});
	balls.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
	const p0 = at(-0.16, 0, 0.06);
	const p1 = at(-0.21, 0.02, 0.1);
	r.line(p0, p1, FOOD.stem, 2.2 * s * lw);
	balls.forEach(([f, sd, zz], i) => {
		const p = at(f, sd, zz);
		r.sphere(p[0], p[1], p[2], 0.034 * s, i % 3 ? FOOD.grape : FOOD.grape2, 0);
	});
}

/**
 * A grape bunch hanging from its stem at (x, y, z) (held by a gripper). swing tilts it in the
 * x-z plane (radians), s scales it. Balls are sorted back to front.
 */
export function drawHangingBunch(r, x, y, z, swing = 0, s = 1) {
	const rows = [4, 4, 3, 2, 1];
	const sw = Math.sin(swing);
	const cw = Math.cos(swing);
	const balls = [];
	rows.forEach((n, row) => {
		const rad = (0.07 - row * 0.015) * s;
		const dz = -(0.08 + row * 0.055) * s;
		for (let i = 0; i < n; i++) {
			const a = (i / n) * Math.PI * 2 + row * 0.8;
			const bx = Math.cos(a) * rad;
			const by = Math.sin(a) * rad;
			balls.push({ p: [x + bx * cw - dz * sw, y + by, z + bx * sw + dz * cw], k: i + row });
		}
	});
	balls.sort((a, b) => depthOf(a.p[0], a.p[1], a.p[2]) - depthOf(b.p[0], b.p[1], b.p[2]));
	r.line([x, y, z + 0.03 * s], [x - 0.06 * s * sw, y, z - 0.06 * s * cw], FOOD.stem, 2.2 * s);
	for (const b of balls) r.sphere(b.p[0], b.p[1], b.p[2], 0.04 * s, b.k % 3 ? FOOD.grape : FOOD.grape2, 0);
}

export function drawAppleSlice(r, at, f, sd, rot, s = 1, lw = 1) {
	const pts = [];
	for (let i = 0; i <= 6; i++) {
		const a = rot + (i / 6) * Math.PI;
		const p = at(f + Math.cos(a) * 0.065, sd + Math.sin(a) * 0.065, 0);
		pts.push([p[0], p[1]]);
	}
	const base = at(f, sd, 0.055);
	r.prism(pts, base[2], 0.03 * s, FOOD.apple);
	const arc = pts.map((p) => [p[0], p[1], base[2] + 0.031 * s]);
	r.polyline(arc, FOOD.skin, 2.4 * s * lw);
}

export function drawCrackerPack(r, at, f, sd, heading, s = 1) {
	const p = at(f, sd, 0.055);
	r.orientedBox(p[0], p[1], p[2], 0.16 * s, 0.1 * s, 0.035 * s, heading, FOOD.pack);
	r.orientedBox(p[0], p[1], p[2] + 0.001, 0.04 * s, 0.102 * s, 0.037 * s, heading, FOOD.packBand);
}

export function drawCheeseWedge(r, at, f, sd, rot, s = 1) {
	const tri = [0, 1, 2].map((i) => {
		const a = rot + (i === 0 ? 0 : i === 1 ? 2.6 : -2.6);
		const len = i === 0 ? 0.085 : 0.06;
		const p = at(f + Math.cos(a) * len, sd + Math.sin(a) * len, 0);
		return [p[0], p[1]];
	});
	const base = at(f, sd, 0.055);
	r.prism(tri, base[2], 0.055 * s, FOOD.cheese);
}

/**
 * Draw the tray with its contents. (cx, cy, z) is the tray's bottom center, heading its long
 * axis. contents: { grapes, apples, crackers, cheese, pass, lid }.
 */
export function drawPlate(r, cx, cy, z, heading, contents = {}, opts = {}) {
	const s = opts.scale ?? 1;
	const lw = opts.lineScale ?? 1; // closeups drawn at high zoom pass a smaller line scale
	const at = frame(cx, cy, z, heading, s);
	r.orientedBox(cx, cy, z, 0.64 * s, 0.46 * s, 0.05 * s, heading, FOOD.tray);
	const inner = [at(-0.29, -0.2, 0.051), at(0.29, -0.2, 0.051), at(0.29, 0.2, 0.051), at(-0.29, 0.2, 0.051)];
	r.quad(inner, FOOD.trayIn, { flat: true });
	r.line(at(0, -0.2, 0.052), at(0, 0.2, 0.052), FOOD.tray, 2 * s * lw);
	r.line(at(-0.29, 0, 0.052), at(0.29, 0, 0.052), FOOD.tray, 2 * s * lw);
	const items = [];
	const push = (f, sd, fn) => {
		const p = at(f, sd, 0);
		items.push({ d: p[0] + p[1], fn });
	};
	if (contents.grapes) push(-0.15, -0.1, () => drawGrapes(r, (f, sd, zz) => at(f - 0.14, sd - 0.1, zz), s, lw));
	if (contents.apples)
		for (let i = 0; i < 4; i++) push(0.06 + i * 0.055, -0.1, () => drawAppleSlice(r, at, 0.06 + i * 0.055, -0.1, heading + 1.2, s, lw));
	if (contents.crackers)
		for (let i = 0; i < 2; i++) push(-0.15, 0.05 + i * 0.1, () => drawCrackerPack(r, at, -0.15, 0.05 + i * 0.1, heading, s));
	if (contents.cheese)
		for (let i = 0; i < 3; i++) push(0.08 + i * 0.07, 0.1, () => drawCheeseWedge(r, at, 0.08 + i * 0.07, 0.1, heading + i * 0.9, s));
	items.sort((a, b) => a.d - b.d);
	for (const it of items) it.fn();
	if (contents.lid) {
		r.orientedBox(cx, cy, z + 0.05 * s, 0.66 * s, 0.48 * s, 0.13 * s, heading, FOOD.lid, { alpha: 0.42, edge: "rgba(255,255,255,0.9)" });
	}
	if (contents.pass) {
		const p = at(0, 0, contents.lid ? 0.42 : 0.34);
		r.billboard(p[0], p[1], p[2], (ctx, zoom) => {
			const k = Math.min(2.2, Math.max(0.7, zoom)) * s;
			ctx.beginPath();
			ctx.arc(0, 0, 9 * k, 0, Math.PI * 2);
			ctx.fillStyle = FOOD.pass;
			ctx.fill();
			ctx.lineWidth = 1.5 * k;
			ctx.strokeStyle = "#ffffff";
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(-4.2 * k, 0.2 * k);
			ctx.lineTo(-1.2 * k, 3.2 * k);
			ctx.lineTo(4.4 * k, -3.4 * k);
			ctx.lineWidth = 2.2 * k;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.stroke();
		});
	}
}

/** A stack of empty trays (denester magazine, outfeed cart). */
export function drawTrayStack(r, cx, cy, z, heading, count, opts = {}) {
	const s = opts.scale ?? 1;
	for (let i = 0; i < count; i++) r.orientedBox(cx, cy, z + i * 0.035 * s, 0.64 * s, 0.46 * s, 0.03 * s, heading, i % 2 ? FOOD.tray : FOOD.trayIn);
}
