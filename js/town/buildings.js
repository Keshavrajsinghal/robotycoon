// Town buildings: one family of low-poly styles per district, drawn inside a slot rectangle
// (x, y, w, d in world meters). Drawing code only; nothing here is shown as text.
//
// A style is (x, y, w, d, opts) => { top, roof, draw(r) }: top is the highest point (for hit
// boxes and labels), roof the point where data beams land, draw paints the building and its
// yard back to front. Visible faces are the +y face (lower left on screen) and the +x face
// (lower right).

import { circlePoints, shade } from "../engine/iso.js";
import { PAL } from "../engine/park.js";
import { drawDelta, drawScara, drawSixAxis } from "../engine/robots.js";

export const TC = {
	cream: "#f1ece2",
	sand: "#f3e3c3",
	grayWall: "#e2e7ec",
	white: "#f6f6f3",
	inner: "#b9b2a6",
	glass: "#a9d4ea",
	glassBlue: "#7fb6dc",
	glassDark: "#3f6d92",
	door: "#5b4636",
	roll: "#9aa3ad",
	concrete: "#cfd2d6",
	floor: "#c3c7cc",
	asphalt: "#8b9097",
	crate: "#c99a5b",
	pallet: "#a8763f",
	screen: "#1f2b3b",
	code: ["#49b39f", "#f2c230", "#7fb2ff", "#e8792f", "#e85d75"],
	fence: "#8d99a6",
	steel: "#9aa5b1",
	green: "#6db457",
	teal: "#1f9e8f",
	orange: "#e8792f",
	blue: "#3d7fd1",
	violet: "#8a5cc7",
	yellow: "#f2c230",
	red: "#d9583b",
};

// ---------------------------------------------------------------------------
// Small helpers

/** Quad in the plane y = const (a +y wall when y is the building's max y). */
const fy = (r, x0, x1, y, z0, z1, col, o) =>
	r.quad(
		[
			[x0, y, z0],
			[x1, y, z0],
			[x1, y, z1],
			[x0, y, z1],
		],
		col,
		o,
	);
/** Quad in the plane x = const. */
const fx = (r, x, y0, y1, z0, z1, col, o) =>
	r.quad(
		[
			[x, y0, z0],
			[x, y1, z0],
			[x, y1, z1],
			[x, y0, z1],
		],
		col,
		o,
	);

/** Evenly spaced positions along a length: calls fn(offset) for each window. */
function along(len, ww, pitch, fn) {
	const n = Math.max(0, Math.floor((len - 0.4) / pitch));
	if (!n) return;
	const start = (len - (n - 1) * pitch - ww) / 2;
	for (let i = 0; i < n; i++) fn(start + i * pitch, i);
}

/** One row of windows on both visible faces of a box. */
function windowRow(r, x, y, w, d, z, wh, o = {}) {
	const ww = o.ww ?? 0.6;
	const pitch = o.pitch ?? 1.2;
	const col = o.color ?? TC.glass;
	if (o.front !== false) along(w, ww, pitch, (u, i) => fy(r, x + u, x + u + ww, y + d + 0.01, z, z + wh, o.colors?.[i % o.colors.length] ?? col));
	if (o.side !== false) along(d, ww, pitch, (u, i) => fx(r, x + w + 0.01, y + u, y + u + ww, z, z + wh, o.colors?.[(i + 1) % o.colors.length] ?? col));
}

function doorY(r, cx, y, w, h, col = TC.door) {
	fy(r, cx - w / 2, cx + w / 2, y + 0.015, 0, h, col);
}

function doorX(r, x, cy, w, h, col = TC.door) {
	fx(r, x + 0.015, cy - w / 2, cy + w / 2, 0, h, col);
}

/** Roll-up door with slat lines on the +x face. */
function rollDoorX(r, x, cy, w, h) {
	fx(r, x + 0.015, cy - w / 2, cy + w / 2, 0, h, TC.roll);
	for (let z = 0.25; z < h; z += 0.25) r.line([x + 0.02, cy - w / 2, z], [x + 0.02, cy + w / 2, z], shade(TC.roll, 0.75), 0.8);
}

function rollDoorY(r, cx, y, w, h) {
	fy(r, cx - w / 2, cx + w / 2, y + 0.015, 0, h, TC.roll);
	for (let z = 0.25; z < h; z += 0.25) r.line([cx - w / 2, y + 0.02, z], [cx + w / 2, y + 0.02, z], shade(TC.roll, 0.75), 0.8);
}

/** Sawtooth roof: teeth along x, steep glazed faces toward +x. */
function sawRoof(r, x, y, w, d, z, color, toothH = 0.7) {
	const n = Math.max(1, Math.round(w / 1.6));
	const tw = w / n;
	for (let i = 0; i < n; i++) {
		const sx = x + i * tw;
		const e = sx + tw;
		r.mesh(
			[
				[
					[sx, y, z],
					[e, y, z + toothH],
					[e, y + d, z + toothH],
					[sx, y + d, z],
				],
				[
					[sx, y + d, z],
					[e, y + d, z + toothH],
					[e, y + d, z],
				],
			],
			color,
			{ twoSided: true },
		);
		fx(r, e, y, y + d, z, z + toothH, TC.glass);
	}
}

/** Gable roof with the ridge along x. */
function gableRoof(r, x, y, w, d, z, h, color) {
	const ym = y + d / 2;
	r.mesh(
		[
			[
				[x, y, z],
				[x + w, y, z],
				[x + w, ym, z + h],
				[x, ym, z + h],
			],
			[
				[x, ym, z + h],
				[x + w, ym, z + h],
				[x + w, y + d, z],
				[x, y + d, z],
			],
			[
				[x + w, y, z],
				[x + w, y + d, z],
				[x + w, ym, z + h],
			],
		],
		color,
		{ center: [x + w / 2, ym, z + h * 0.3] },
	);
}

function pallet(r, x, y, w, d) {
	r.box(x, y, 0, w, d, 0.12, TC.pallet);
}

function crate(r, x, y, z, s, col = TC.crate) {
	r.box(x, y, z, s, s, s, col, { top: shade(col, 1.08) });
	r.line([x, y + s + 0.01, z + s * 0.5], [x + s, y + s + 0.01, z + s * 0.5], shade(col, 0.7), 0.8);
	r.line([x + s + 0.01, y, z + s * 0.5], [x + s + 0.01, y + s, z + s * 0.5], shade(col, 0.7), 0.8);
}

/** Pallets of crates and motor drums in a yard strip. */
function yardGoods(r, x, y, w, d, seed = 0, motors = false) {
	const n = Math.max(1, Math.floor(Math.max(w, d) / 1.3));
	const alongX = w >= d;
	for (let i = 0; i < n; i++) {
		const px = alongX ? x + 0.2 + i * ((w - 0.4) / n) : x + w / 2 - 0.45;
		const py = alongX ? y + d / 2 - 0.45 : y + 0.2 + i * ((d - 0.4) / n);
		pallet(r, px, py, 0.9, 0.9);
		if (motors && (i + seed) % 2 === 0) {
			r.cylinder(px + 0.25, py + 0.25, 0.12, 0.18, 0.42, "#3d7fd1", 8);
			r.cylinder(px + 0.65, py + 0.62, 0.12, 0.18, 0.42, "#3d7fd1", 8);
			r.cylinder(px + 0.25, py + 0.65, 0.12, 0.18, 0.42, "#2f6fb3", 8);
		} else {
			crate(r, px + 0.05, py + 0.05, 0.12, 0.8);
			if ((i + seed) % 3 !== 1) crate(r, px + 0.15, py + 0.15, 0.92, 0.55, TC.orange);
		}
	}
}

/** Split a slot into a building body and a yard strip on a visible side. */
function splitYard(x, y, w, d, frac = 0.28, min = 1.3, max = 2.4) {
	const long = Math.max(w, d);
	if (long < 4.2) return { body: [x, y, w, d], yard: null };
	const yd = Math.max(min, Math.min(max, long * frac));
	if (w >= d) return { body: [x, y, w - yd, d], yard: [x + w - yd, y, yd, d], yardSide: "x" };
	return { body: [x, y, w, d - yd], yard: [x, y + d - yd, w, yd], yardSide: "y" };
}

/** Gear polygon in (u, v) around the origin. */
function gearOutline(R, teeth = 10) {
	const pts = [];
	const n = teeth * 4;
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2;
		const rr = i % 4 < 2 ? R : R * 0.8;
		pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
	}
	return pts;
}

/** A thick gear standing in the plane y = py, centered at (cx, cz). */
function gearSign(r, cx, py, cz, R, color) {
	const t = Math.max(0.1, R * 0.14);
	const pts = gearOutline(R);
	const front = pts.map(([u, v]) => [cx + u, py, cz + v]);
	const back = pts.map(([u, v]) => [cx + u, py - t, cz + v]);
	const faces = [front];
	for (let i = 0; i < pts.length; i++) {
		const j = (i + 1) % pts.length;
		faces.push([back[i], back[j], front[j], front[i]]);
	}
	r.mesh(faces, color, { center: [cx, py - t / 2, cz] });
	const hub = circlePoints(0, 0, R * 0.32, 10).map(([u, v]) => [cx + u, py + 0.01, cz + v]);
	r.quad(hub, shade(color, 0.7));
	const hole = circlePoints(0, 0, R * 0.12, 8).map(([u, v]) => [cx + u, py + 0.02, cz + v]);
	r.quad(hole, PAL.dark);
}

/** Polygon (u, v) mapped onto the plane y = py (u along x, v up). */
function onPlaneY(r, pts, x0, py, z0, col, o) {
	r.quad(
		pts.map(([u, v]) => [x0 + u, py, z0 + v]),
		col,
		o,
	);
}

/** Polygon (u, v) mapped onto the plane x = px (u along y, v up). */
function onPlaneX(r, pts, px, y0, z0, col, o) {
	r.quad(
		pts.map(([u, v]) => [px, y0 + u, z0 + v]),
		col,
		o,
	);
}

/** Sign board on two posts, facing +y, bottom edge at z0. */
function boardY(r, cx, py, z0, bw, bh, col = TC.white) {
	for (const sx of [-bw * 0.32, bw * 0.32]) r.box(cx + sx - 0.05, py - 0.08, z0 - 0.9, 0.1, 0.1, 0.9 + bh * 0.4, PAL.dark);
	r.box(cx - bw / 2, py - 0.1, z0, bw, 0.1, bh, col);
}

/** Fence panel (see-through mesh) between a and b ([x, y]). */
function fence(r, a, b, h, post = TC.yellow) {
	r.quad(
		[
			[a[0], a[1], 0.12],
			[b[0], b[1], 0.12],
			[b[0], b[1], h],
			[a[0], a[1], h],
		],
		TC.fence,
		{ alpha: 0.3, flat: true },
	);
	r.line([a[0], a[1], h], [b[0], b[1], h], post, 2.2);
}

function post(r, x, y, h, col = TC.yellow) {
	r.box(x - 0.05, y - 0.05, 0, 0.1, 0.1, h, col);
}

/**
 * A guarded robot cell: back fences, the robot (drawn by robotFn), then front fences. open lists
 * the sides left unbuilt ("front", "side") for half-finished cells.
 */
function robotCell(r, x, y, w, d, robotFn, o = {}) {
	const h = o.h ?? 1.3;
	const pc = o.post ?? TC.yellow;
	r.box(x, y, 0, w, d, 0.06, o.base ?? "#b8bec6");
	post(r, x, y, h, pc);
	fence(r, [x, y], [x + w, y], h, pc);
	fence(r, [x, y], [x, y + d], h, pc);
	post(r, x + w, y, h, pc);
	post(r, x, y + d, h, pc);
	robotFn(r);
	if (!o.open?.includes("side")) fence(r, [x + w, y], [x + w, y + d], h, pc);
	if (!o.open?.includes("front")) fence(r, [x, y + d], [x + w, y + d], h, pc);
	if (!o.open?.includes("corner")) post(r, x + w, y + d, h, pc);
}

function conveyorX(r, x, y, len, z = 0.5) {
	r.box(x + 0.1, y + 0.05, 0, 0.08, 0.3, z - 0.08, PAL.dark);
	r.box(x + len - 0.18, y + 0.05, 0, 0.08, 0.3, z - 0.08, PAL.dark);
	r.box(x, y, z - 0.1, len, 0.4, 0.1, PAL.metal, { top: "#3a3f47" });
}

function treeSmall(r, x, y, s = 0.7, col = PAL.leaf[1]) {
	r.shadow(x + 0.15, y + 0.15, 0.7 * s, 0.7 * s, 0.14);
	r.cylinder(x, y, 0, 0.1 * s, 0.8 * s, PAL.trunk, 6);
	r.sphere(x, y, 1.3 * s, 0.65 * s, col, 1, { sz: 0.9 });
}

/** Upper hemisphere (domes). */
function dome(r, cx, cy, z, R, color) {
	const lat = 3;
	const lon = 12;
	const pt = (i, j) => {
		const th = (i / lat) * (Math.PI / 2);
		const ph = (j / lon) * Math.PI * 2;
		return [cx + Math.sin(th) * Math.cos(ph) * R, cy + Math.sin(th) * Math.sin(ph) * R, z + Math.cos(th) * R];
	};
	const faces = [];
	for (let i = 0; i < lat; i++)
		for (let j = 0; j < lon; j++) {
			const a = pt(i, j);
			const b = pt(i, j + 1);
			const c = pt(i + 1, j + 1);
			const d = pt(i + 1, j);
			faces.push(i === 0 ? [a, d, c] : [a, d, c, b]);
		}
	r.mesh(faces, color, { center: [cx, cy, z] });
}

/** Tapered vertical cylinder. */
function frustum(r, cx, cy, z, r0, r1, h, color, seg = 12) {
	const A = circlePoints(cx, cy, r0, seg, Math.PI / seg);
	const B = circlePoints(cx, cy, r1, seg, Math.PI / seg);
	const faces = [];
	for (let i = 0; i < seg; i++) {
		const j = (i + 1) % seg;
		faces.push([
			[A[i][0], A[i][1], z],
			[A[j][0], A[j][1], z],
			[B[j][0], B[j][1], z + h],
			[B[i][0], B[i][1], z + h],
		]);
	}
	faces.push(B.map((p) => [p[0], p[1], z + h]));
	r.mesh(faces, color, { center: [cx, cy, z + h / 2] });
}

/** Satellite dish: a shaded bowl on a short post, aimed at the sky to the right. */
function dish(r, cx, cy, z, R, col = "#eef1f4") {
	r.cylinder(cx, cy, z, 0.06, 0.3, PAL.dark, 6);
	const n = [0.42, -0.18, 0.89];
	const ln = Math.hypot(...n);
	const N = n.map((v) => v / ln);
	const ux = [N[1], -N[0], 0];
	const lu = Math.hypot(...ux);
	const U = ux.map((v) => v / lu);
	const V = [N[1] * U[2] - N[2] * U[1], N[2] * U[0] - N[0] * U[2], N[0] * U[1] - N[1] * U[0]];
	const C = [cx, cy, z + 0.3 + R * 0.55];
	const B = [C[0] - N[0] * R * 0.4, C[1] - N[1] * R * 0.4, C[2] - N[2] * R * 0.4];
	const seg = 12;
	const ring = [];
	for (let i = 0; i < seg; i++) {
		const a = (i / seg) * Math.PI * 2;
		const c = Math.cos(a) * R;
		const sn = Math.sin(a) * R;
		ring.push([C[0] + U[0] * c + V[0] * sn, C[1] + U[1] * c + V[1] * sn, C[2] + U[2] * c + V[2] * sn]);
	}
	const faces = ring.map((p, i) => [p, ring[(i + 1) % seg], B]);
	r.mesh(faces, col, { twoSided: true });
	const F = [C[0] + N[0] * R * 0.6, C[1] + N[1] * R * 0.6, C[2] + N[2] * R * 0.6];
	r.line(B, F, PAL.dark, 1.2);
	r.sphere(F[0], F[1], F[2], R * 0.1, PAL.dark, 0);
}

/** A small low-poly delivery truck parked along x (cab toward +x). */
function parkedTruck(r, x, y, len, col, box = TC.white) {
	r.box(x, y, 0.15, len, 0.9, 0.1, PAL.dark);
	for (const wx of [x + 0.35, x + len - 0.45]) {
		r.tube([wx, y - 0.02, 0.15], [wx, y + 0.12, 0.15], 0.15, "#2b2f35", 8);
		r.tube([wx, y + 0.78, 0.15], [wx, y + 0.92, 0.15], 0.15, "#2b2f35", 8);
	}
	r.box(x, y, 0.25, len - 0.75, 0.9, 0.95, box);
	r.box(x + len - 0.7, y + 0.02, 0.25, 0.7, 0.86, 0.75, col);
	fy(r, x + len - 0.6, x + len - 0.1, y + 0.89, 0.6, 0.9, TC.glassDark);
	fx(r, x + len + 0.01, y + 0.1, y + 0.8, 0.6, 0.92, TC.glassDark);
}

// ---------------------------------------------------------------------------
// Parts quarter: small machine shops with giant roadside props on the roof.

function partsShop(x, y, w, d, o) {
	const { body, yard, yardSide } = splitYard(x, y, w, d);
	const [bx, by, bw, bd] = body;
	const h = 2.3;
	const prop = o.index % 3;
	const R = Math.min(1.15, 0.22 * Math.min(bw, bd) + 0.45);
	const propTop = prop === 0 ? 0.7 + 0.5 + R * 2 : prop === 1 ? 0.25 + R * 1.6 : 0.2 + R * 1.5;
	const wall = prop === 1 ? TC.grayWall : TC.cream;
	return {
		top: h + propTop,
		roof: [bx + bw / 2, by + bd / 2, h + 0.4],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.box(bx, by, 0, bw, bd, h, wall, { top: shade(o.accent, 1.05) });
			fy(r, bx, bx + bw, by + bd + 0.01, h - 0.3, h, o.accent);
			fx(r, bx + bw + 0.01, by, by + bd, h - 0.3, h, o.accent);
			windowRow(r, bx, by, bw, bd, 0.85, 0.7, { pitch: 1.3 });
			if (yardSide === "x" || !yard) rollDoorX(r, bx + bw, by + bd / 2, Math.min(1.4, bd * 0.4), 1.6);
			else rollDoorY(r, bx + bw / 2, by + bd, Math.min(1.4, bw * 0.4), 1.6);
			if (prop === 0) {
				sawRoof(r, bx, by, bw, bd, h, o.accent, 0.6);
				const gz = h + 0.7 + 0.35 + R;
				for (const sx of [-R * 0.5, R * 0.5]) r.box(bx + bw / 2 + sx - 0.06, by + bd / 2 - 0.06, h + 0.3, 0.12, 0.12, gz - h - 0.3, PAL.dark);
				gearSign(r, bx + bw / 2, by + bd / 2 + 0.1, gz, R, "#f2c230");
			} else if (prop === 1) {
				// Giant electric motor lying on the roof, shaft toward +x.
				const mz = h + 0.25 + R * 0.62;
				const x0 = bx + bw * 0.22;
				const x1 = bx + bw * 0.7;
				const my = by + bd / 2;
				r.box(x0 + 0.1, my - R * 0.5, h, 0.2, R, 0.3, PAL.dark);
				r.box(x1 - 0.3, my - R * 0.5, h, 0.2, R, 0.3, PAL.dark);
				r.tube([x0, my, mz], [x1, my, mz], R * 0.6, "#3d7fd1", 12);
				for (let k = 1; k < 4; k++) {
					const fxp = x0 + ((x1 - x0) * k) / 4;
					r.tube([fxp - 0.05, my, mz], [fxp + 0.05, my, mz], R * 0.66, "#2f6fb3", 12);
				}
				r.tube([x1, my, mz], [x1 + 0.12, my, mz], R * 0.45, PAL.steel, 10);
				r.tube([x1 + 0.12, my, mz], [x1 + R * 0.9, my, mz], R * 0.12, PAL.metal, 8);
				r.box(x0 + (x1 - x0) * 0.4, my - R * 0.18, mz + R * 0.55, R * 0.5, R * 0.36, R * 0.3, PAL.dark);
			} else {
				// Giant camera on the roof, lens toward +y.
				const cz = h + 0.2;
				const cx = bx + bw / 2;
				const cy = by + bd / 2;
				r.box(cx - 0.15, cy - 0.15, h, 0.3, 0.3, 0.25, PAL.dark);
				r.box(cx - R * 0.6, cy - R * 0.6, cz + 0.05, R * 1.2, R * 0.9, R * 0.9, "#f4f4f2");
				r.box(cx - R * 0.6, cy - R * 0.6, cz + 0.05 + R * 0.9, R * 1.2, R * 0.9, 0.08, TC.teal);
				r.tube([cx, cy + R * 0.3, cz + 0.05 + R * 0.45], [cx, cy + R * 0.95, cz + 0.05 + R * 0.45], R * 0.36, PAL.dark, 12);
				const lens = circlePoints(0, 0, R * 0.26, 12).map(([u, v]) => [cx + u, cy + R * 0.96, cz + 0.05 + R * 0.45 + v]);
				r.quad(lens, "#5aa9e6");
				const glint = circlePoints(0, 0, R * 0.08, 6).map(([u, v]) => [cx + u - R * 0.08, cy + R * 0.97, cz + 0.05 + R * 0.53 + v]);
				r.quad(glint, "#ffffff");
			}
			if (yard) {
				const [yx, yy, yw, yd] = yard;
				r.ground(yx, yy, yw, yd, "#d8cfbd", 0.02);
				yardGoods(r, yx + 0.15, yy + 0.15, yw - 0.3, yd - 0.3, o.index, prop === 1);
			}
		},
	};
}

// ---------------------------------------------------------------------------
// Robot Row: a big assembly plant with robot arms behind the windows, and a hall with a giant
// robot arm statue.

function assemblyPlant(x, y, w, d, o) {
	const bx = x + 0.2;
	const by = y + 0.2;
	const bw = w - 0.4;
	const bd = d - 0.4;
	const h = 3.4;
	const orange = { body: TC.orange, accent: "#3b4552" };
	return {
		top: h + 0.8,
		roof: [bx + bw / 2, by + bd / 2, h + 0.7],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.6, by + bd / 2 + 0.6, bw * 0.6, bd * 0.6, 0.12);
			r.ground(bx, by, bw, bd, TC.floor, 0.02);
			fy(r, bx, bx + bw, by, 0, h, TC.inner);
			fx(r, bx, by, by + bd, 0, h, shade(TC.inner, 0.95));
			// Interior: a conveyor along the hall with orange arms working over it.
			const cy = by + bd * 0.62;
			const n = Math.max(1, Math.floor((bw - 0.6) / 2));
			const pitch = (bw - 0.6) / n;
			for (let i = 0; i < n; i++) {
				const ax = bx + 0.3 + pitch * (i + 0.5);
				drawSixAxis(r, ax, cy - 1.0, [ax + 0.25, cy, 0.68], { scale: 0.85, colors: orange });
			}
			r.box(bx + 0.3, cy - 0.25, 0, bw - 0.6, 0.5, 0.55, PAL.dark, { top: "#3a3f47" });
			for (let i = 0; i < n * 2; i++) r.box(bx + 0.5 + i * (pitch / 2), cy - 0.15, 0.55, 0.3, 0.3, 0.18, i % 2 ? "#f4f4f2" : TC.orange);
			// Front walls with tall windows.
			const zb = 0.7;
			const zt = h - 0.6;
			const Y = by + bd;
			const X = bx + bw;
			fy(r, bx, X, Y, zb, zt, TC.glass, { alpha: 0.22 });
			fx(r, X, by, Y, zb, zt, TC.glass, { alpha: 0.22 });
			fy(r, bx, X, Y, 0, zb, TC.cream);
			fy(r, bx, X, Y, zt, h, TC.cream);
			fx(r, X, by, Y, 0, zb, TC.cream);
			fx(r, X, by, Y, zt, h, TC.cream);
			const np = Math.max(2, Math.round(bw / 1.8));
			for (let k = 0; k <= np; k++) {
				const px = bx + (k * bw) / np;
				fy(r, Math.max(bx, px - 0.12), Math.min(X, px + 0.12), Y + 0.005, zb, zt, TC.cream);
			}
			const nq = Math.max(1, Math.round(bd / 1.8));
			for (let k = 0; k <= nq; k++) {
				const py = by + (k * bd) / nq;
				fx(r, X + 0.005, Math.max(by, py - 0.12), Math.min(Y, py + 0.12), zb, zt, TC.cream);
			}
			fy(r, bx, X, Y + 0.01, zt, zt + 0.22, o.accent);
			fx(r, X + 0.01, by, Y, zt, zt + 0.22, o.accent);
			r.box(bx, by, h, bw, bd, 0.12, TC.grayWall, { top: "#d4d9de" });
			sawRoof(r, bx + 0.3, by + 0.3, bw - 0.6, bd - 0.6, h + 0.12, o.accent, 0.55);
		},
	};
}

function statueHall(x, y, w, d, o) {
	const { body, yard } = splitYard(x, y, w, d, 0.4, 2.2, 3.6);
	const [bx, by, bw, bd] = body;
	const h = 3.0;
	const S = 1.7;
	return {
		top: Math.max(h + 0.4, yard ? 0.4 + 1.5 * S : 0),
		roof: [bx + bw / 2, by + bd / 2, h + 0.3],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.box(bx, by, 0, bw, bd, h, TC.white, { top: "#d6dbe0" });
			fy(r, bx, bx + bw, by + bd + 0.01, 0.4, 0.75, o.accent);
			fx(r, bx + bw + 0.01, by, by + bd, 0.4, 0.75, o.accent);
			windowRow(r, bx, by, bw, bd, 1.2, 1.1, { ww: 0.9, pitch: 1.4, color: TC.glassBlue });
			doorY(r, bx + bw * 0.3, by + bd, 0.8, 1.0, TC.glassDark);
			// Round logo disc on the +y face.
			const lr = Math.min(0.55, bw * 0.12);
			onPlaneY(r, circlePoints(0, 0, lr, 12), bx + bw * 0.75, by + bd + 0.02, h - 0.95, o.accent);
			onPlaneY(r, gearOutline(lr * 0.6, 8), bx + bw * 0.75, by + bd + 0.03, h - 0.95, "#ffffff");
			r.box(bx + bw * 0.15, by + bd * 0.2, h, bw * 0.25, bd * 0.3, 0.4, PAL.steel);
			if (yard) {
				const [yx, yy, yw, yd] = yard;
				r.ground(yx, yy, yw, yd, "#d9d3c7", 0.02);
				const sx = yx + yw / 2 - 0.2;
				const sy = yy + yd / 2 - 0.2;
				r.cylinder(sx, sy, 0, 0.85, 0.06, "#c9c2b4", 12);
				r.cylinder(sx, sy, 0.06, 0.72, 0.03, o.accent, 12);
				drawSixAxis(r, sx, sy, [sx + 0.55 * S, sy + 0.35 * S, 0.2 + 0.85 * S], { scale: S, colors: { body: TC.orange, accent: "#3b4552" } });
			}
		},
	};
}

// ---------------------------------------------------------------------------
// Integrator yard: an open workshop with half-built cells, an outdoor test floor, and a design
// office.

function integratorShed(x, y, w, d, o) {
	// Roofed workshop along the back, open work yard in front (the view from above cannot see
	// under a deep roof).
	const alongX = w >= d;
	const sd = alongX ? Math.max(1.8, d * 0.42) : d;
	const sw = alongX ? w : Math.max(1.8, w * 0.42);
	const h = 2.7;
	const shed = [x + 0.15, y + 0.15, sw - 0.3, sd - 0.3];
	const yard = alongX ? [x + 0.15, y + sd, w - 0.3, d - sd - 0.15] : [x + sw, y + 0.15, w - sw - 0.15, d - 0.3];
	return {
		top: h + 0.4,
		roof: [shed[0] + shed[2] / 2, shed[1] + shed[3] / 2, h + 0.2],
		draw(r) {
			const [bx, by, bw, bd] = shed;
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.box(bx, by, 0, bw, bd, h, "#e9dfc6", { top: "#d9b23a" });
			for (let k = 1; k < Math.round(bw / 0.6); k++) r.line([bx + k * 0.6, by, h + 0.005], [bx + k * 0.6, by + bd, h + 0.005], shade("#d9b23a", 0.85), 0.8);
			fy(r, bx, bx + bw, by + bd + 0.01, h - 0.25, h, o.accent);
			fx(r, bx + bw + 0.01, by, by + bd, h - 0.25, h, o.accent);
			// Big doors open onto the yard.
			const nd = Math.max(1, Math.floor((alongX ? bw : bd) / 2.4));
			for (let k = 0; k < nd; k++) {
				if (alongX) {
					const cx = bx + ((k + 0.5) * bw) / nd;
					fy(r, cx - 0.8, cx + 0.8, by + bd + 0.012, 0, 1.9, "#4a4f57");
					fy(r, cx - 0.8, cx + 0.8, by + bd + 0.015, 1.6, 1.9, TC.roll);
				} else {
					const cy = by + ((k + 0.5) * bd) / nd;
					fx(r, bx + bw + 0.012, cy - 0.8, cy + 0.8, 0, 1.9, "#4a4f57");
					fx(r, bx + bw + 0.015, cy - 0.8, cy + 0.8, 1.6, 1.9, TC.roll);
				}
			}
			const [yx, yy, yw, yd] = yard;
			if (yw < 1.2 || yd < 1.2) return;
			r.ground(yx, yy, yw, yd, "#cfd2d6", 0.02);
			// Half-built cell: two fence sides missing, an arm being fitted.
			const cw = Math.min(2.8, yw * (alongX ? 0.48 : 0.9));
			const cd = Math.min(2.4, yd * (alongX ? 0.85 : 0.48));
			const cx0 = yx + 0.3;
			const cy0 = yy + 0.25;
			robotCell(
				r,
				cx0,
				cy0,
				cw,
				cd,
				(rr) => {
					conveyorX(rr, cx0 + 0.15, cy0 + cd - 0.65, cw * 0.6);
					drawSixAxis(rr, cx0 + cw * 0.4, cy0 + cd * 0.35, [cx0 + cw * 0.65, cy0 + cd - 0.45, 0.6], { scale: 0.7 });
				},
				{ open: ["front", "corner", "side"] },
			);
			// Fence panels waiting on a pallet, a crated robot, and a robot on a stand.
			const px = alongX ? cx0 + cw + 0.5 : yx + 0.3;
			const py = alongX ? yy + 0.3 : cy0 + cd + 0.5;
			if (px + 1 < yx + yw && py + 1 < yy + yd) {
				pallet(r, px, py, 1.0, 1.0);
				crate(r, px + 0.1, py + 0.1, 0.12, 0.8);
				for (let k = 0; k < 3; k++) r.box(px + 1.2 + k * 0.08, py, 0, 0.05, 1.0, 1.1, TC.yellow);
			}
			const sx = alongX ? yx + yw - 0.8 : yx + yw - 0.8;
			const sy = alongX ? yy + yd - 0.8 : yy + yd - 0.8;
			if (sx > px + 1.6 || sy > py + 1.6) {
				r.box(sx - 0.3, sy - 0.3, 0, 0.6, 0.6, 0.45, "#5d6670");
				drawScara(r, sx, sy, [sx + 0.3, sy + 0.4], 0.7, { scale: 0.55 });
			}
		},
	};
}

function testFloor(x, y, w, d, o) {
	const cab = Math.min(2, Math.min(w, d) * 0.4);
	return {
		top: 2.6,
		roof: [x + cab / 2, y + cab / 2, 2.2],
		draw(r) {
			r.ground(x, y, w, d, "#c7cbd0", 0.02);
			// Hazard stripes around the pad.
			const step = 0.5;
			for (let u = 0; u < w; u += step) {
				const c = Math.round(u / step) % 2 ? "#2b2f35" : TC.yellow;
				r.ground(x + u, y, Math.min(step, w - u), 0.2, c, 0.025);
				r.ground(x + u, y + d - 0.2, Math.min(step, w - u), 0.2, c, 0.025);
			}
			for (let v = 0; v < d; v += step) {
				const c = Math.round(v / step) % 2 ? "#2b2f35" : TC.yellow;
				r.ground(x, y + v, 0.2, Math.min(step, d - v), c, 0.025);
				r.ground(x + w - 0.2, y + v, 0.2, Math.min(step, d - v), c, 0.025);
			}
			// Site cabin in the back corner with a flag.
			r.box(x + 0.3, y + 0.3, 0, cab, cab * 0.8, 1.7, TC.white, { top: "#d6dbe0" });
			fy(r, x + 0.5, x + 0.5 + cab * 0.4, y + 0.3 + cab * 0.8 + 0.01, 0.9, 1.4, TC.glass);
			doorX(r, x + 0.3 + cab, y + 0.3 + cab * 0.4, 0.5, 1.2);
			r.cylinder(x + 0.3 + cab + 0.3, y + 0.35, 0, 0.04, 2.5, PAL.dark, 5);
			r.quad(
				[
					[x + 0.3 + cab + 0.32, y + 0.35, 2.45],
					[x + 0.3 + cab + 1.0, y + 0.35, 2.3],
					[x + 0.3 + cab + 0.32, y + 0.35, 2.05],
				],
				o.accent,
			);
			// Finished cells being tested.
			const free = [x + 0.5, y + 0.3 + cab * 0.8 + 0.5, w - 1.0, d - cab * 0.8 - 1.1];
			const wide = free[2] >= free[3];
			const count = Math.max(1, Math.min(2, Math.floor(Math.max(free[2], free[3]) / 2.6)));
			for (let i = 0; i < count; i++) {
				const cw = wide ? Math.min(2.6, free[2] / count - 0.4) : Math.min(2.6, free[2]);
				const cd = wide ? Math.min(2.4, free[3]) : Math.min(2.4, free[3] / count - 0.4);
				const cx0 = wide ? free[0] + i * (free[2] / count) : free[0];
				const cy0 = wide ? free[1] : free[1] + i * (free[3] / count);
				if (cw < 1.2 || cd < 1.2) continue;
				robotCell(r, cx0, cy0, cw, cd, (rr) => {
					conveyorX(rr, cx0 + 0.1, cy0 + cd - 0.75, cw - 0.2);
					if (i % 2 === 0) drawSixAxis(rr, cx0 + cw * 0.4, cy0 + cd * 0.3, [cx0 + cw * 0.6, cy0 + cd - 0.55, 0.55], { scale: 0.65 });
					else drawScara(rr, cx0 + cw * 0.4, cy0 + cd * 0.3, [cx0 + cw * 0.65, cy0 + cd - 0.55], 0.55, { scale: 0.65 });
				});
			}
		},
	};
}

function designOffice(x, y, w, d, o) {
	const bx = x + 0.3;
	const by = y + 0.3;
	const bw = w - 0.6;
	const bd = d - 0.6;
	const h = 3.4;
	const bwid = Math.min(2.6, bw * 0.7);
	return {
		top: h + 2.1,
		roof: [bx + bw / 2, by + bd / 2, h],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.box(bx, by, 0, bw, bd, h, TC.sand, { top: "#d9cdb1" });
			windowRow(r, bx, by, bw, bd, 0.6, 0.8, { pitch: 1.1 });
			windowRow(r, bx, by, bw, bd, 2.1, 0.8, { pitch: 1.1 });
			doorY(r, bx + bw / 2, by + bd, 0.8, 1.1, TC.glassDark);
			fy(r, bx, bx + bw, by + bd + 0.01, 1.6, 1.8, o.accent);
			fx(r, bx + bw + 0.01, by, by + bd, 1.6, 1.8, o.accent);
			// Blueprint board on the roof: a cell layout in white lines.
			const cx = bx + bw / 2;
			const py = by + bd / 2;
			const z0 = h + 0.7;
			const bh = 1.3;
			boardY(r, cx, py, z0, bwid, bh, "#2f5f9e");
			const x0 = cx - bwid / 2;
			const Y = py + 0.01;
			for (let k = 1; k < 6; k++) r.line([x0 + (k * bwid) / 6, Y, z0 + 0.1], [x0 + (k * bwid) / 6, Y, z0 + bh - 0.1], "rgba(255,255,255,0.35)", 0.6);
			for (let k = 1; k < 4; k++) r.line([x0 + 0.1, Y, z0 + (k * bh) / 4], [x0 + bwid - 0.1, Y, z0 + (k * bh) / 4], "rgba(255,255,255,0.35)", 0.6);
			r.polyline(
				[
					[x0 + bwid * 0.2, Y, z0 + bh * 0.25],
					[x0 + bwid * 0.55, Y, z0 + bh * 0.25],
					[x0 + bwid * 0.55, Y, z0 + bh * 0.75],
					[x0 + bwid * 0.2, Y, z0 + bh * 0.75],
				],
				"#ffffff",
				1.4,
				true,
			);
			r.line([x0 + bwid * 0.55, Y, z0 + bh * 0.5], [x0 + bwid * 0.85, Y, z0 + bh * 0.5], "#ffffff", 1.4);
			onPlaneY(r, circlePoints(0, 0, bh * 0.1, 8), x0 + bwid * 0.375, Y + 0.005, z0 + bh * 0.5, "#ffffff");
		},
	};
}

// ---------------------------------------------------------------------------
// Applications lane: glass offices with an outdoor demo cell, and a shopfront demo loft.

function glassOffice(x, y, w, d, o) {
	const { body, yard } = splitYard(x, y, w, d, 0.42, 2.2, 3.4);
	const [bx, by, bw, bd] = body;
	const h = 4.2;
	return {
		top: h + 0.5,
		roof: [bx + bw / 2, by + bd / 2, h + 0.4],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.6, by + bd / 2 + 0.6, bw * 0.6, bd * 0.6, 0.14);
			r.box(bx + 0.2, by + 0.2, 0, bw - 0.4, bd - 0.4, h, TC.glassBlue, { top: "#d9dee3" });
			const X = bx + bw - 0.2;
			const Y = by + bd - 0.2;
			for (let z = 0.95; z < h; z += 1.0) {
				fy(r, bx + 0.2, X, Y + 0.01, z, z + 0.12, "#f4f6f8");
				fx(r, X + 0.01, by + 0.2, Y, z, z + 0.12, "#f4f6f8");
			}
			for (let u = bx + 0.2 + 0.8; u < X; u += 0.8) r.line([u, Y + 0.02, 0], [u, Y + 0.02, h], "rgba(255,255,255,0.55)", 0.7);
			for (let v = by + 0.2 + 0.8; v < Y; v += 0.8) r.line([X + 0.02, v, 0], [X + 0.02, v, h], "rgba(255,255,255,0.55)", 0.7);
			doorY(r, bx + bw / 2, Y, 0.9, 0.9, TC.glassDark);
			// Roof garden.
			r.ground(bx + 0.4, by + 0.4, (bw - 0.8) * 0.55, bd - 0.8, TC.green, h + 0.01);
			r.box(bx + bw * 0.65, by + 0.5, h, (bw - 0.8) * 0.3, bd * 0.35, 0.4, PAL.steel);
			treeSmall(r, bx + 0.9, by + 0.9, 0.45);
			if (yard) {
				const [yx, yy, yw, yd] = yard;
				r.ground(yx, yy, yw, yd, "#dde3ea", 0.02);
				const cw = Math.min(2.6, yw - 0.5);
				const cd = Math.min(2.6, yd - 0.5);
				const cx0 = yx + (yw - cw) / 2;
				const cy0 = yy + (yd - cd) / 2;
				robotCell(
					r,
					cx0,
					cy0,
					cw,
					cd,
					(rr) => {
						conveyorX(rr, cx0 + 0.1, cy0 + cd - 0.7, cw - 0.2);
						drawScara(rr, cx0 + cw * 0.35, cy0 + cd * 0.3, [cx0 + cw * 0.7, cy0 + cd - 0.5], 0.55, { scale: 0.7 });
					},
					{ post: o.accent, h: 1.2 },
				);
			}
		},
	};
}

function demoLoft(x, y, w, d, o) {
	const bx = x + 0.25;
	const by = y + 0.25;
	const bw = w - 0.5;
	const bd = d - 0.5;
	const h = 3.4;
	return {
		top: h + 0.5,
		roof: [bx + bw / 2, by + bd / 2, h + 0.4],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.ground(bx, by, bw, bd, "#e8e4dc", 0.02);
			fy(r, bx, bx + bw, by, 0, h, "#d8cfc2");
			fx(r, bx, by, by + bd, 0, h, "#cfc5b6");
			// A delta robot picking on a table right behind the shop window (the view from above
			// only reaches about a meter into the room).
			const Y = by + bd;
			const X = bx + bw;
			const tx = bx + bw * 0.42;
			const ty = Y - 0.75;
			for (const px of [tx - 0.85, tx + 0.85]) r.box(px - 0.05, ty - 0.6, 0, 0.1, 0.1, 2.5, PAL.dark);
			r.box(tx - 0.9, ty - 0.65, 2.5, 1.8, 0.1, 0.1, PAL.dark);
			r.box(tx - 0.8, ty - 0.35, 0, 1.6, 0.7, 0.75, PAL.steel, { top: "#e4e7ea" });
			for (let i = 0; i < 4; i++) r.box(tx - 0.65 + i * 0.36, ty - 0.12, 0.75, 0.22, 0.22, 0.07, i % 2 ? TC.orange : TC.yellow);
			drawDelta(r, tx, ty, 2.55, [tx + 0.15, ty, 1.05], { scale: 0.9, colors: { accent: o.accent } });
			// A second exhibit: a cobot-sized arm on a pedestal.
			if (bw > 6) {
				const ax = bx + bw * 0.78;
				r.box(ax - 0.3, ty - 0.3, 0, 0.6, 0.6, 0.6, "#f4f4f2");
				drawSixAxis(r, ax, ty, [ax + 0.35, ty + 0.25, 0.75], { scale: 0.55, colors: { accent: o.accent } });
			}
			// Brick front with a tall shop window.
			fy(r, bx, X, Y, 0.45, h - 0.35, TC.glass, { alpha: 0.18 });
			fx(r, X, by, Y, 0.45, h - 0.35, TC.glass, { alpha: 0.18 });
			fy(r, bx, X, Y, 0, 0.45, "#b8664d");
			fy(r, bx, X, Y, h - 0.35, h, "#b8664d");
			fx(r, X, by, Y, 0, 0.45, "#a95c45");
			fx(r, X, by, Y, h - 0.35, h, "#a95c45");
			for (const px of [bx, bx + bw * 0.62, X - 0.2]) fy(r, px, px + 0.2, Y + 0.005, 0.45, h - 0.35, "#b8664d");
			fx(r, X + 0.005, by, by + 0.2, 0.45, h - 0.35, "#a95c45");
			// Door with a striped awning on the side face.
			doorX(r, X, by + bd * 0.5, 0.8, 1.3, TC.glassDark);
			for (let v = 0; v < 1.2; v += 0.3)
				r.quad(
					[
						[X, by + bd * 0.5 - 0.6 + v, 1.75],
						[X, by + bd * 0.5 - 0.3 + v, 1.75],
						[X + 0.5, by + bd * 0.5 - 0.3 + v, 1.5],
						[X + 0.5, by + bd * 0.5 - 0.6 + v, 1.5],
					],
					Math.round(v / 0.3) % 2 ? "#ffffff" : o.accent,
				);
			r.box(bx, by, h, bw, bd, 0.14, "#b8664d", { top: "#c97c62" });
			r.box(bx + bw * 0.12, by + bd * 0.2, h + 0.14, bw * 0.2, bd * 0.3, 0.35, PAL.steel);
		},
	};
}

// ---------------------------------------------------------------------------
// Model lab: a data center with cooling units, a research lab with a dome, cooling towers.

function dataCenter(x, y, w, d, o) {
	const { body, yard, yardSide } = splitYard(x, y, w, d, 0.24, 1.2, 1.8);
	const [bx, by, bw, bd] = body;
	const h = 2.6;
	return {
		top: h + 0.6,
		roof: [bx + bw / 2, by + bd / 2, h + 0.5],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.box(bx, by, 0, bw, bd, h, "#dfe3e8", { top: "#c9cfd6" });
			for (let u = bx + 0.4; u < bx + bw; u += 0.4) r.line([u, by + bd + 0.01, 0.3], [u, by + bd + 0.01, h - 0.15], "rgba(90,107,125,0.35)", 0.7);
			for (let v = by + 0.4; v < by + bd; v += 0.4) r.line([bx + bw + 0.01, v, 0.3], [bx + bw + 0.01, v, h - 0.15], "rgba(90,107,125,0.35)", 0.7);
			fy(r, bx, bx + bw, by + bd + 0.01, 0, 0.3, "#5b6c80");
			fx(r, bx + bw + 0.01, by, by + bd, 0, 0.3, "#5b6c80");
			doorY(r, bx + 0.9, by + bd, 0.7, 1.2, "#5b6c80");
			// Status lights beside the door.
			for (let k = 0; k < 4; k++) fy(r, bx + 1.4 + k * 0.18, bx + 1.5 + k * 0.18, by + bd + 0.02, 1.0, 1.08, k % 2 ? "#49e0c4" : "#7fb2ff");
			// Rooftop cooling units with fans.
			const nx = Math.max(1, Math.floor((bw - 0.4) / 1.1));
			const ny = Math.max(1, Math.floor((bd - 0.4) / 1.1));
			for (let i = 0; i < nx; i++)
				for (let j = 0; j < ny; j++) {
					const ux = bx + 0.3 + i * ((bw - 0.6) / nx);
					const uy = by + 0.3 + j * ((bd - 0.6) / ny);
					r.box(ux, uy, h, 0.8, 0.8, 0.35, "#eef1f4");
					r.cylinder(ux + 0.4, uy + 0.4, h + 0.35, 0.3, 0.03, "#5b6c80", 10);
					r.cylinder(ux + 0.4, uy + 0.4, h + 0.38, 0.06, 0.02, "#dfe3e8", 6);
				}
			if (yard) {
				const [yx, yy, yw, yd] = yard;
				r.ground(yx, yy, yw, yd, "#cfd4da", 0.02);
				const long = yardSide === "x" ? yd : yw;
				const n = Math.max(1, Math.floor(long / 1.4));
				for (let k = 0; k < n; k++) {
					const cx = yardSide === "x" ? yx + 0.2 : yx + 0.2 + k * (yw / n);
					const cy = yardSide === "x" ? yy + 0.2 + k * (yd / n) : yy + 0.2;
					r.box(cx, cy, 0, 1.0, 1.0, 0.9, "#c8d0d8");
					r.cylinder(cx + 0.5, cy + 0.5, 0.9, 0.38, 0.03, "#3b4552", 10);
				}
			}
		},
	};
}

function researchLab(x, y, w, d, o) {
	const bx = x + 0.3;
	const by = y + 0.3;
	const bw = w - 0.6;
	const bd = d - 0.6;
	const h = 2.8;
	const R = Math.min(1.4, Math.min(bw, bd) * 0.32);
	return {
		top: h + R + 0.2,
		roof: [bx + bw / 2, by + bd / 2, h + R],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.box(bx, by, 0, bw, bd, h, TC.white, { top: "#dde2e7" });
			windowRow(r, bx, by, bw, bd, 0.8, 1.2, { ww: 1.0, pitch: 1.5, color: TC.glassBlue });
			fy(r, bx, bx + bw, by + bd + 0.01, h - 0.35, h - 0.15, o.accent);
			fx(r, bx + bw + 0.01, by, by + bd, h - 0.35, h - 0.15, o.accent);
			doorY(r, bx + bw * 0.25, by + bd, 0.8, 1.1, TC.glassDark);
			r.cylinder(bx + bw / 2, by + bd / 2, h, R * 1.05, 0.25, "#c9cfd6", 14);
			dome(r, bx + bw / 2, by + bd / 2, h + 0.25, R, "#eef1f4");
			// Slit in the dome facing the viewer.
			r.quad(
				[
					[bx + bw / 2 + R * 0.62, by + bd / 2 + R * 0.62, h + 0.35],
					[bx + bw / 2 + R * 0.72, by + bd / 2 + R * 0.5, h + 0.35],
					[bx + bw / 2 + R * 0.12, by + bd / 2 + R * 0.05, h + 0.25 + R * 0.98],
					[bx + bw / 2 + R * 0.05, by + bd / 2 + R * 0.12, h + 0.25 + R * 0.98],
				],
				o.accent,
			);
		},
	};
}

function coolingPlant(x, y, w, d, o) {
	const R = Math.min(1.3, Math.min(w, d) * 0.22);
	const towers = w >= d ? [[x + w * 0.3, y + d * 0.42], [x + w * 0.7, y + d * 0.42]] : [[x + w * 0.42, y + d * 0.3], [x + w * 0.42, y + d * 0.7]];
	const H = 3.4;
	return {
		top: H + 0.8,
		roof: [towers[0][0], towers[0][1], H],
		draw(r) {
			r.ground(x, y, w, d, "#cfd4da", 0.02);
			// Substation: transformer boxes with insulators.
			const sx = x + 0.3;
			const sy = y + d - 1.3;
			r.box(sx, sy, 0, 1.0, 0.9, 1.0, "#9aa5b1");
			for (let k = 0; k < 3; k++) r.cylinder(sx + 0.2 + k * 0.3, sy + 0.45, 1.0, 0.06, 0.35, "#c9a46a", 6);
			for (const [tx, ty] of towers) {
				r.shadow(tx + 0.4, ty + 0.4, R * 1.3, R * 1.3, 0.14);
				frustum(r, tx, ty, 0, R * 1.15, R * 0.7, H * 0.6, "#e4e8ec");
				frustum(r, tx, ty, H * 0.6, R * 0.7, R * 0.85, H * 0.4, "#e4e8ec");
				r.cylinder(tx, ty, H - 0.02, R * 0.72, 0.04, "#5b6c80", 12);
				r.sphere(tx + 0.1, ty, H + 0.45, R * 0.55, "#ffffff", 1, { sz: 0.6 });
			}
			r.tube([towers[0][0], towers[0][1], 0.5], [towers[1][0], towers[1][1], 0.5], 0.15, o.accent, 8);
		},
	};
}

// ---------------------------------------------------------------------------
// Tool works: a software office with screens and a broadcast mast, and a simulation studio.

function codeScreen(r, x0, x1, Y, z0, z1, seed = 0) {
	fy(r, x0, x1, Y, z0, z1, TC.screen);
	const rows = Math.max(2, Math.floor((z1 - z0) / 0.16));
	for (let k = 0; k < rows; k++) {
		const z = z1 - 0.12 - k * ((z1 - z0 - 0.16) / rows);
		const indent = ((k + seed) % 3) * 0.12;
		const len = (x1 - x0 - 0.2 - indent) * (0.35 + (((k * 7 + seed * 3) % 5) / 5) * 0.6);
		fy(r, x0 + 0.1 + indent, x0 + 0.1 + indent + len, Y + 0.005, z - 0.035, z, TC.code[(k + seed) % TC.code.length]);
	}
}

function softwareOffice(x, y, w, d, o) {
	const bx = x + 0.3;
	const by = y + 0.3;
	const bw = w - 0.6;
	const bd = d - 0.6;
	const h = 3.0;
	const mast = [bx + 0.6, by + 0.6];
	const mastH = h + 3.6;
	return {
		top: mastH + 0.3,
		roof: [mast[0], mast[1], mastH],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			// Broadcast mast behind everything else on the roof.
			r.box(bx, by, 0, bw, bd, h, TC.grayWall, { top: "#cdd3da" });
			const [mx, my] = mast;
			const legs = [
				[mx - 0.35, my - 0.35],
				[mx + 0.35, my - 0.35],
				[mx + 0.35, my + 0.35],
				[mx - 0.35, my + 0.35],
			];
			for (const [lx, ly] of legs) r.line([lx, ly, h], [mx, my, mastH], PAL.dark, 1.3);
			for (let k = 1; k < 5; k++) {
				const t = k / 5;
				const ring = legs.map(([lx, ly]) => [lx + (mx - lx) * t, ly + (my - ly) * t, h + (mastH - h) * t]);
				r.polyline(ring, PAL.dark, 0.9, true);
			}
			r.sphere(mx, my, mastH + 0.08, 0.12, "#e85d75", 0);
			// Monitor windows: every pane shows code.
			const Y = by + bd;
			const X = bx + bw;
			along(bw, 0.9, 1.3, (u, i) => codeScreen(r, bx + u, bx + u + 0.9, Y + 0.01, 0.7, 1.4, i));
			along(bw, 0.9, 1.3, (u, i) => codeScreen(r, bx + u, bx + u + 0.9, Y + 0.01, 1.9, 2.6, i + 2));
			along(bd, 0.9, 1.3, (u) => {
				fx(r, X + 0.01, by + u, by + u + 0.9, 0.7, 1.4, TC.screen);
				fx(r, X + 0.02, by + u + 0.1, by + u + 0.6, 1.1, 1.15, TC.code[2]);
				fx(r, X + 0.02, by + u + 0.1, by + u + 0.8, 0.95, 1.0, TC.code[0]);
				fx(r, X + 0.01, by + u, by + u + 0.9, 1.9, 2.6, TC.screen);
				fx(r, X + 0.02, by + u + 0.1, by + u + 0.7, 2.3, 2.35, TC.code[1]);
			});
			fy(r, bx, X, Y + 0.01, h - 0.25, h, o.accent);
			fx(r, X + 0.01, by, Y, h - 0.25, h, o.accent);
			// Big rooftop screen.
			const sw = Math.min(2.4, bw * 0.55);
			const sx = bx + bw * 0.62;
			for (const px of [sx - sw * 0.35, sx + sw * 0.35]) r.box(px - 0.05, by + bd * 0.55 - 0.05, h, 0.1, 0.1, 0.6, PAL.dark);
			r.box(sx - sw / 2, by + bd * 0.55 - 0.1, h + 0.6, sw, 0.1, 1.2, PAL.dark);
			codeScreen(r, sx - sw / 2 + 0.06, sx + sw / 2 - 0.06, by + bd * 0.55 + 0.01, h + 0.66, h + 1.74, 4);
		},
	};
}

function simStudio(x, y, w, d, o) {
	const bx = x + 0.3;
	const by = y + 0.3;
	const bw = w - 0.6;
	const bd = d - 0.6;
	const h = 3.3;
	return {
		top: h + 1.0,
		roof: [bx + bw * 0.3, by + bd * 0.3, h + 0.8],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.box(bx, by, 0, bw, bd, h, "#ece6f4", { top: "#d6cfe2" });
			windowRow(r, bx, by, bw, bd, 0.7, 0.8, { side: false, color: TC.glassBlue });
			doorY(r, bx + bw * 0.2, by + bd, 0.8, 1.1, TC.glassDark);
			// Wall screen on the +x face: a wireframe arm in a simulated room.
			const X = bx + bw + 0.01;
			const y0 = by + 0.3;
			const y1 = by + bd - 0.3;
			const z0 = 0.5;
			const z1 = h - 0.4;
			fx(r, X, y0, y1, z0, z1, TC.screen);
			const W = y1 - y0;
			const Hs = z1 - z0;
			for (let k = 1; k < 6; k++) r.line([X + 0.005, y0 + (W * k) / 6, z0 + 0.1], [X + 0.005, y0 + (W * k) / 6, z0 + Hs * 0.3], "rgba(127,178,255,0.45)", 0.6);
			r.line([X + 0.005, y0 + 0.1, z0 + Hs * 0.3], [X + 0.005, y1 - 0.1, z0 + Hs * 0.3], "rgba(127,178,255,0.6)", 0.8);
			const base = [y0 + W * 0.35, z0 + Hs * 0.3];
			const el = [y0 + W * 0.45, z0 + Hs * 0.75];
			const wr = [y0 + W * 0.75, z0 + Hs * 0.6];
			r.polyline(
				[
					[X + 0.006, base[0], base[1]],
					[X + 0.006, el[0], el[1]],
					[X + 0.006, wr[0], wr[1]],
					[X + 0.006, wr[0], wr[1] - Hs * 0.15],
				],
				"#49e0c4",
				1.6,
			);
			for (const p of [base, el, wr]) onPlaneX(r, circlePoints(0, 0, 0.08, 6), X + 0.008, p[0], p[1], "#f2c230");
			fy(r, bx, bx + bw, by + bd + 0.01, h - 0.25, h, o.accent);
			fx(r, X + 0.005, by, by + bd, h - 0.25, h, o.accent);
			dish(r, bx + bw * 0.3, by + bd * 0.3, h, 0.55);
			dish(r, bx + bw * 0.65, by + bd * 0.35, h, 0.4);
		},
	};
}

// ---------------------------------------------------------------------------
// Factory district: the airline catering plant (sign and truck dock), a food plant with silos,
// a warehouse, and a car plant.

/** Cheese plate icon on a sign board in the plane y = Y (u from x0, v from z0). */
function cheesePlateIcon(r, x0, Y, z0, W, H) {
	const s = Math.min(W / 3.2, H / 1.6);
	const cu = W / 2;
	const cv = H / 2;
	const P = (u, v) => [cu + u * s, cv + v * s];
	const tray = [P(-1.4, -0.6), P(1.4, -0.6), P(1.5, -0.45), P(1.5, 0.45), P(1.4, 0.6), P(-1.4, 0.6), P(-1.5, 0.45), P(-1.5, -0.45)];
	onPlaneY(r, tray, x0, Y + 0.01, z0, "#d9c39a");
	onPlaneY(r, [P(-1.3, -0.48), P(1.3, -0.48), P(1.3, 0.48), P(-1.3, 0.48)], x0, Y + 0.012, z0, "#efe2c4");
	// Grapes.
	for (const [gu, gv] of [
		[-0.95, 0.2],
		[-0.75, 0.2],
		[-0.85, 0.03],
		[-1.05, 0.03],
		[-0.65, 0.03],
		[-0.95, -0.14],
		[-0.75, -0.14],
		[-0.85, -0.3],
	])
		onPlaneY(r, circlePoints(0, 0, 0.11 * s, 8).map(([u, v]) => [cu + gu * s + u, cv + gv * s + v]), x0, Y + 0.015, z0, "#7b3f8f");
	// Apple slices.
	for (let k = 0; k < 3; k++) {
		const au = -0.25 + k * 0.22;
		onPlaneY(r, [P(au - 0.1, -0.3), P(au + 0.08, -0.32), P(au + 0.12, 0.3), P(au - 0.04, 0.32)], x0, Y + 0.015, z0, "#f6edc9");
		onPlaneY(r, [P(au + 0.08, -0.32), P(au + 0.13, -0.3), P(au + 0.16, 0.28), P(au + 0.12, 0.3)], x0, Y + 0.016, z0, "#c0392b");
	}
	// Cheese wedges.
	for (let k = 0; k < 3; k++) {
		const cu0 = 0.45 + k * 0.28;
		onPlaneY(r, [P(cu0, -0.32), P(cu0 + 0.26, -0.32), P(cu0 + 0.13, 0.3)], x0, Y + 0.015, z0, "#f2c230");
	}
	// Cracker pack.
	onPlaneY(r, [P(0.5, 0.36), P(1.2, 0.36), P(1.2, 0.46), P(0.5, 0.46)], x0, Y + 0.016, z0, "#c98b4a");
}

/** Airline catering truck: a box body raised on a scissor lift, cab toward +x. */
function cateringTruck(r, x, y, lift = 1.2) {
	const len = 2.6;
	r.box(x, y, 0.15, len, 0.9, 0.12, PAL.dark);
	for (const wx of [x + 0.4, x + len - 0.45]) {
		r.tube([wx, y - 0.02, 0.15], [wx, y + 0.12, 0.15], 0.15, "#2b2f35", 8);
		r.tube([wx, y + 0.78, 0.15], [wx, y + 0.92, 0.15], 0.15, "#2b2f35", 8);
	}
	const bz = 0.3 + lift;
	for (const sy of [y + 0.1, y + 0.8]) {
		r.line([x + 0.1, sy, 0.3], [x + 1.75, sy, bz], PAL.steel, 1.6);
		r.line([x + 1.75, sy, 0.3], [x + 0.1, sy, bz], PAL.steel, 1.6);
	}
	r.box(x, y, bz, 1.85, 0.9, 0.95, TC.white);
	fy(r, x, x + 1.85, y + 0.91, bz + 0.55, bz + 0.68, TC.blue);
	fx(r, x + 1.86, y, y + 0.9, bz + 0.55, bz + 0.68, TC.blue);
	r.box(x + len - 0.7, y + 0.03, 0.27, 0.7, 0.84, 0.8, TC.blue);
	fy(r, x + len - 0.6, x + len - 0.1, y + 0.88, 0.65, 0.95, TC.glassDark);
	fx(r, x + len + 0.01, y + 0.12, y + 0.78, 0.65, 0.98, TC.glassDark);
}

function cateringPlant(x, y, w, d, o) {
	// Dock apron on the +x side of the plant.
	const apron = Math.min(3.2, Math.max(2.2, w * 0.3));
	const bx = x + 0.2;
	const by = y + 0.2;
	const bw = w - apron - 0.2;
	const bd = d - 0.4;
	const h = 2.9;
	const signW = Math.min(3.4, bw * 0.75);
	const signH = signW * 0.5;
	const nb = Math.max(1, Math.min(3, Math.floor(bd / 1.5)));
	return {
		top: h + 0.6 + signH + 0.2,
		roof: [bx + bw / 2, by + bd / 2, h + 0.6],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.6, by + bd / 2 + 0.6, bw * 0.6, bd * 0.6, 0.12);
			r.ground(bx + bw, y, apron, d, TC.asphalt, 0.02);
			for (let k = 0; k < nb; k++) {
				const cy = by + ((k + 0.5) * bd) / nb;
				r.ground(bx + bw + 0.2, cy - 0.6, apron - 0.4, 0.05, "#f4f4f2", 0.03);
				r.ground(bx + bw + 0.2, cy + 0.55, apron - 0.4, 0.05, "#f4f4f2", 0.03);
			}
			r.box(bx, by, 0, bw, bd, h, TC.white, { top: "#d6e4e1" });
			fy(r, bx, bx + bw, by + bd + 0.01, 0, 0.45, TC.teal);
			fy(r, bx, bx + bw, by + bd + 0.01, h - 0.3, h, o.accent);
			fx(r, bx + bw + 0.01, by, by + bd, h - 0.3, h, o.accent);
			windowRow(r, bx, by, bw, bd, 1.1, 0.7, { side: false });
			doorY(r, bx + 0.7, by + bd, 0.7, 1.1, TC.glassDark);
			// Dock doors with bumpers on the +x face.
			for (let k = 0; k < nb; k++) {
				const cy = by + ((k + 0.5) * bd) / nb;
				r.box(bx + bw, cy - 0.65, 0, 0.35, 1.3, 0.75, "#9aa3ad");
				rollDoorX(r, bx + bw + 0.0, cy, 1.0, 2.0);
				r.box(bx + bw + 0.35, cy - 0.55, 0.45, 0.08, 0.12, 0.25, "#2b2f35");
				r.box(bx + bw + 0.35, cy + 0.43, 0.45, 0.08, 0.12, 0.25, "#2b2f35");
				fx(r, bx + bw + 0.02, cy - 0.15, cy + 0.15, 2.15, 2.3, k === 0 ? "#49e0c4" : "#e85d75");
			}
			sawRoof(r, bx, by, bw, bd * 0.55, h, o.accent, 0.55);
			r.box(bx, by + bd * 0.55, h, bw, bd * 0.45, 0.12, "#d6e4e1");
			// Rooftop sign with the cheese plate icon.
			const scx = bx + bw / 2;
			const spy = by + bd * 0.78;
			boardY(r, scx, spy, h + 0.9, signW, signH, "#ffffff");
			r.box(scx - signW / 2 - 0.05, spy - 0.12, h + 0.85, signW + 0.1, 0.14, 0.08, TC.red);
			r.box(scx - signW / 2 - 0.05, spy - 0.12, h + 0.9 + signH, signW + 0.1, 0.14, 0.08, TC.red);
			cheesePlateIcon(r, scx - signW / 2, spy, h + 0.9, signW, signH);
			// Catering truck backed up to the first bay, box raised to aircraft door height.
			const ty = by + bd / (2 * nb) - 0.45;
			cateringTruck(r, bx + bw + 0.4, ty, 1.0);
		},
	};
}

function foodPlant(x, y, w, d, o) {
	const silo = Math.min(0.9, Math.min(w, d) * 0.16);
	const n = Math.max(1, Math.min(3, Math.floor(d / (silo * 2.4))));
	const bx = x + 0.2;
	const by = y + 0.2;
	const bw = w - silo * 2.6 - 0.4;
	const bd = d - 0.4;
	const h = 2.6;
	const sh = 4.0;
	return {
		top: sh + silo + 0.2,
		roof: [bx + bw / 2, by + bd / 2, h + 0.5],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.box(bx, by, 0, bw, bd, h, TC.cream, { top: "#ded6c4" });
			gableRoof(r, bx, by, bw, bd, h, 0.8, o.accent);
			windowRow(r, bx, by, bw, bd, 0.9, 0.7, { pitch: 1.4 });
			rollDoorY(r, bx + bw * 0.7, by + bd, Math.min(1.3, bw * 0.3), 1.6);
			r.box(bx + bw * 0.2, by + bd * 0.3, h + 0.2, 0.35, 0.35, 1.4, "#b5543c");
			const sx = bx + bw + silo * 1.3;
			for (let k = 0; k < n; k++) {
				const sy = by + ((k + 0.5) * bd) / n;
				r.shadow(sx + 0.3, sy + 0.3, silo * 1.2, silo * 1.2, 0.12);
				r.cylinder(sx, sy, 0, silo, sh, "#dfe4ea", 12);
				for (let z = 0.8; z < sh; z += 0.8) r.cylinder(sx, sy, z, silo * 1.02, 0.06, "#b8c0ca", 12);
				r.cone(sx, sy, sh, silo, silo * 0.8, "#c9cfd6", 12);
				r.tube([sx - silo, sy, sh - 0.4], [bx + bw, sy, h - 0.3], 0.08, PAL.steel, 6);
			}
		},
	};
}

function warehouse(x, y, w, d, o) {
	const apron = Math.min(2.6, Math.max(1.6, w * 0.25));
	const bx = x + 0.2;
	const by = y + 0.2;
	const bw = w - apron - 0.2;
	const bd = d - 0.4;
	const h = 2.4;
	const nb = Math.max(1, Math.floor(bd / 1.2));
	return {
		top: h + 0.3,
		roof: [bx + bw / 2, by + bd / 2, h + 0.2],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.ground(bx + bw, y, apron, d, TC.asphalt, 0.02);
			r.box(bx, by, 0, bw, bd, h, "#d9dde2", { top: "#c3c9d0" });
			for (let u = bx + 0.3; u < bx + bw; u += 0.3) r.line([u, by + bd + 0.01, 0.1], [u, by + bd + 0.01, h - 0.1], "rgba(80,90,100,0.25)", 0.6);
			fy(r, bx, bx + bw, by + bd + 0.01, h - 0.25, h, o.accent);
			fx(r, bx + bw + 0.01, by, by + bd, h - 0.25, h, o.accent);
			for (let k = 0; k < nb; k++) rollDoorX(r, bx + bw, by + ((k + 0.5) * bd) / nb, 0.8, 1.4);
			for (let k = 0; k < Math.min(2, nb); k++) {
				const cy = by + ((k * 2 + 0.5) * bd) / nb - 0.45;
				if (cy + 0.9 > y + d) continue;
				parkedTruck(r, bx + bw + 0.15, cy, Math.min(2.4, apron - 0.2), k ? TC.red : TC.blue);
			}
			for (let k = 0; k < Math.floor(bw / 1.6); k++) r.box(bx + 0.4 + k * 1.6, by + 0.4, h, 0.9, bd - 0.8, 0.06, "#e8ecf0");
		},
	};
}

function carPlant(x, y, w, d, o) {
	const bx = x + 0.2;
	const by = y + 0.2;
	const bw = w - 0.4;
	const bd = d - 0.4;
	const h = 2.8;
	return {
		top: h + 2.4,
		roof: [bx + bw / 2, by + bd / 2, h + 1.0],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			// Chimneys at the back, then the hall.
			for (let k = 0; k < 2; k++) {
				const cx = bx + 0.6 + k * 0.7;
				r.cylinder(cx, by + 0.6, 0, 0.22, h + 2.2, "#c9c2b4", 8);
				r.cylinder(cx, by + 0.6, h + 1.6, 0.23, 0.25, TC.red, 8);
			}
			r.box(bx, by, 0, bw, bd, h, "#e6e1d8", { top: "#d3cdc1" });
			gableRoof(r, bx, by, bw, bd, h, 1.0, "#6b7a8c");
			windowRow(r, bx, by, bw, bd, 1.5, 0.6, { pitch: 1.0 });
			fy(r, bx, bx + bw, by + bd + 0.01, 0, 0.35, o.accent);
			fx(r, bx + bw + 0.01, by, by + bd, 0, 0.35, o.accent);
			rollDoorX(r, bx + bw, by + bd * 0.5, Math.min(1.6, bd * 0.4), 1.8);
			// A finished car parked by the door.
			const cx = bx + bw - 1.7;
			const cy = by + bd + 0.05;
			if (cy + 0.8 <= y + d + 0.2) {
				r.box(cx, cy, 0.15, 1.4, 0.7, 0.35, TC.red);
				r.box(cx + 0.35, cy + 0.05, 0.5, 0.7, 0.6, 0.3, "#f4f4f2");
				fy(r, cx + 0.4, cx + 1.0, cy + 0.66, 0.55, 0.75, TC.glassDark);
			}
		},
	};
}

// ---------------------------------------------------------------------------
// Fallback for districts the drawing code does not know.

function genericOffice(x, y, w, d, o) {
	const bx = x + 0.3;
	const by = y + 0.3;
	const bw = w - 0.6;
	const bd = d - 0.6;
	const h = 2.6 + (o.index % 3) * 0.8;
	return {
		top: h + 0.5,
		roof: [bx + bw / 2, by + bd / 2, h],
		draw(r) {
			r.shadow(bx + bw / 2 + 0.5, by + bd / 2 + 0.5, bw * 0.6, bd * 0.6, 0.12);
			r.box(bx, by, 0, bw, bd, h, TC.cream, { top: shade(o.accent, 1.1) });
			for (let z = 0.6; z < h - 0.4; z += 1.1) windowRow(r, bx, by, bw, bd, z, 0.6);
			doorY(r, bx + bw / 2, by + bd, 0.7, 1.0);
			r.box(bx + bw * 0.3, by + bd * 0.3, h, bw * 0.3, bd * 0.3, 0.45, PAL.steel);
		},
	};
}

/** Styles per district id, used in order for the district's buildings. */
const STYLES = {
	parts: [partsShop],
	"robot-row": [assemblyPlant, statueHall],
	integrators: [integratorShed, testFloor, designOffice],
	applications: [glassOffice, demoLoft],
	"model-lab": [dataCenter, researchLab, coolingPlant],
	"tool-works": [softwareOffice, simStudio],
	"factory-district": [cateringPlant, foodPlant, warehouse, carPlant],
};

/**
 * Which building in the factory district is the catering plant: the first whose title says
 * catering, then whose id does, then any plate, cheese, airline, meal, or tray word, then any
 * "cater" word (a caterer's office is not the plant), else the first building.
 */
export function cateringIndex(buildings) {
	const tests = [(b) => /catering/i.test(b.title ?? ""), (b) => /catering/i.test(b.id), (b) => /plate|cheese|airline|meal|tray/i.test(`${b.id} ${b.title ?? ""}`), (b) => /cater/i.test(`${b.id} ${b.title ?? ""}`)];
	for (const t of tests) {
		const i = buildings.findIndex(t);
		if (i >= 0) return i;
	}
	return 0;
}

/**
 * Words in a building's id or title that pick its style before the district's order, so the
 * drawing matches the name (an office is not drawn as a silo plant, a depot gets loading docks).
 * Checked in order; the first match wins.
 */
const HINTS = {
	integrators: [
		[/build|workshop/i, integratorShed],
		[/depot|garage/i, warehouse],
		[/test|yard/i, testFloor],
		[/design|studio/i, designOffice],
		[/office|proposal/i, genericOffice],
	],
	"model-lab": [
		[/training|compute|cluster|farm/i, dataCenter],
		[/office|licen/i, genericOffice],
		[/lab|garage|research/i, researchLab],
		[/cool/i, coolingPlant],
	],
	"tool-works": [
		[/sim/i, simStudio],
		[/data|docs|log|code|soft|demo/i, softwareOffice],
	],
	"factory-district": [
		[/car|auto|vehicle/i, carPlant],
		[/office/i, genericOffice],
		[/maint|warehouse|depot|shop|store|hub/i, warehouse],
		[/food|bak|dairy|kitchen/i, foodPlant],
	],
};

/**
 * Geometry for one building: style chosen by district, then by words in its id or title (opts.id,
 * opts.title), then by index. The hero building of a district (index 0) gets the district's
 * signature style unless its name asks for another; in the factory district the hero is always
 * the catering plant (planTown puts it first, see cateringIndex).
 */
export function buildingGeometry(districtId, index, rect, opts) {
	const list = STYLES[districtId] ?? [genericOffice];
	const words = `${opts.id ?? ""} ${opts.title ?? ""}`;
	const hint = districtId === "factory-district" && index === 0 ? null : HINTS[districtId]?.find(([re]) => re.test(words));
	const style = hint ? hint[1] : list[index % list.length];
	const [x, y, w, d] = rect;
	return style(x, y, w, d, { ...opts, index });
}

export { crate, pallet, treeSmall };
