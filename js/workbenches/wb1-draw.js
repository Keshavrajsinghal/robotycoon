// Drawing for the wb1-dof workbench: the work cell (pedestal, conveyor, tray, grape bunch), the
// six-axis arm with one colored housing per joint, the held apple slice, and the ghost target.
// Drawing code only, no words. Everything is built as world-space faces in the cell frame, turned
// by the view angle, and drawn with the engine's IsoRenderer (flat shading, painter's order).

import { FOOD } from "../engine/food.js";
import { ISO, mix, shade } from "../engine/iso.js";
import { PAL } from "../engine/park.js";
import { add, cross, dot, len, normalize, scale, sub } from "./wb1-kin.js";

/** One color per joint, J1 to J6 (the slider rows use the same swatches). */
export const JOINT_COLORS = ["#d9583b", "#e09a22", "#3e9f58", "#1f9e8f", "#3d7fd1", "#8a5cc7"];
const LOCKED = "#99a2ad";
const ARM = { body: "#f2f2ee", trim: "#dfe3e8", dark: "#3b4552", metal: "#b8c0ca", rubber: "#2b2f35" };
const BELT = "#3a3f47";

// ---------------------------------------------------------------------------
// Face soup: faces in the cell frame, oriented outward, turned by the view.

function newell(pts) {
	let x = 0;
	let y = 0;
	let z = 0;
	for (let i = 0; i < pts.length; i++) {
		const a = pts[i];
		const b = pts[(i + 1) % pts.length];
		x += (a[1] - b[1]) * (a[2] + b[2]);
		y += (a[2] - b[2]) * (a[0] + b[0]);
		z += (a[0] - b[0]) * (a[1] + b[1]);
	}
	return [x, y, z];
}

function centroid(pts) {
	const c = [0, 0, 0];
	for (const p of pts) {
		c[0] += p[0];
		c[1] += p[1];
		c[2] += p[2];
	}
	return scale(c, 1 / pts.length);
}

/** A perpendicular unit vector to a. */
function perp(a) {
	const ref = Math.abs(a[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
	return normalize(cross(a, ref));
}

class Soup {
	constructor(view) {
		this.view = view;
		this.faces = [];
		this.colors = [];
	}

	face(pts, color, center) {
		let p = pts;
		if (center && dot(newell(p), sub(centroid(p), center)) < 0) p = [...p].reverse();
		this.faces.push(p.map(this.view));
		this.colors.push(color);
	}

	/** Oriented box: center c, unit axes a, b, n, half sizes ha, hb, hn. colors: {top} optional (+n face). */
	box(c, a, b, n, ha, hb, hn, color, colors = {}) {
		const P = (i, j, k) => add(add(add(c, scale(a, ha * i)), scale(b, hb * j)), scale(n, hn * k));
		const quads = [
			[[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], colors.top ?? color],
			[[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1], colors.bottom ?? color],
			[[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1], colors.end ?? color],
			[[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1], colors.end ?? color],
			[[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1], colors.side ?? color],
			[[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1], colors.side ?? color],
		];
		for (const q of quads) this.face(q.slice(0, 4).map((v) => P(...v)), q[4], c);
	}

	/** Axis-aligned box from (x0, y0, z0) to (x1, y1, z1). */
	aabb(x0, y0, z0, x1, y1, z1, color, colors) {
		this.box([(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], [1, 0, 0], [0, 1, 0], [0, 0, 1], (x1 - x0) / 2, (y1 - y0) / 2, (z1 - z0) / 2, color, colors);
	}

	/** Bar from p1 to p2 whose width runs along `side` (projected perpendicular to the bar). */
	beam(p1, p2, side, w, h, color) {
		const a = normalize(sub(p2, p1));
		let s = sub(side, scale(a, dot(side, a)));
		s = len(s) < 1e-6 ? perp(a) : normalize(s);
		const n = cross(a, s);
		this.box(scale(add(p1, p2), 0.5), a, s, n, len(sub(p2, p1)) / 2, w / 2, h / 2, color);
	}

	tube(p1, p2, r, color, seg = 10, capColor) {
		const a = normalize(sub(p2, p1));
		const s = perp(a);
		const t = cross(a, s);
		const ring = (p) =>
			Array.from({ length: seg }, (_, i) => {
				const ang = ((i + 0.5) / seg) * Math.PI * 2;
				return add(p, add(scale(s, Math.cos(ang) * r), scale(t, Math.sin(ang) * r)));
			});
		const A = ring(p1);
		const B = ring(p2);
		const c = scale(add(p1, p2), 0.5);
		for (let i = 0; i < seg; i++) {
			const j = (i + 1) % seg;
			this.face([A[i], A[j], B[j], B[i]], color, c);
		}
		this.face(A, capColor ?? color, c);
		this.face(B, capColor ?? color, c);
	}

	sphere(c, r, color, lat = 3, lon = 6) {
		const pt = (i, j) => {
			const th = (i / lat) * Math.PI;
			const ph = (j / lon) * Math.PI * 2;
			return [c[0] + Math.sin(th) * Math.cos(ph) * r, c[1] + Math.sin(th) * Math.sin(ph) * r, c[2] + Math.cos(th) * r];
		};
		for (let i = 0; i < lat; i++)
			for (let j = 0; j < lon; j++) {
				const a = pt(i, j);
				const b = pt(i, j + 1);
				const cc = pt(i + 1, j + 1);
				const d = pt(i + 1, j);
				if (i === 0) this.face([a, d, cc], color, c);
				else if (i === lat - 1) this.face([a, d, b], color, c);
				else this.face([a, d, cc, b], color, c);
			}
	}

	draw(r, opts = {}) {
		if (this.faces.length) r.mesh(this.faces, "#888888", { colors: this.colors, ...opts });
	}
}

// ---------------------------------------------------------------------------
// Pieces

/** Outline of the half-moon slice (mid-plane), from one end of the cut edge round the skin. */
export function sliceOutline(origin, R, radius, seg = 9) {
	const u = [R[0], R[3], R[6]];
	const v = [R[1], R[4], R[7]];
	const pts = [];
	for (let i = 0; i <= seg; i++) {
		const a = (i / seg) * Math.PI;
		pts.push(add(origin, add(scale(u, Math.cos(a) * radius), scale(v, Math.sin(a) * radius))));
	}
	return pts;
}

function addSlice(soup, origin, R, slice, colors = {}) {
	const n = [R[2], R[5], R[8]];
	const mid = sliceOutline(origin, R, slice.r);
	const front = mid.map((p) => add(p, scale(n, slice.t / 2)));
	const back = mid.map((p) => add(p, scale(n, -slice.t / 2)));
	const c = centroid(mid);
	const flesh = colors.flesh ?? FOOD.apple;
	const skin = colors.skin ?? FOOD.skin;
	const cf = centroid(front);
	const cb = centroid(back);
	// Faces split into fans so they sort well against grapes and the cup.
	for (let i = 0; i < front.length - 1; i++) {
		soup.face([cf, front[i], front[i + 1]], flesh, c);
		soup.face([cb, back[i + 1], back[i]], shade(flesh, 0.95), c);
	}
	soup.face([cf, front[front.length - 1], front[0]], flesh, c);
	soup.face([cb, back[0], back[back.length - 1]], shade(flesh, 0.95), c);
	for (let i = 0; i < mid.length - 1; i++) soup.face([front[i], front[i + 1], back[i + 1], back[i]], skin, c);
	soup.face([front[mid.length - 1], front[0], back[0], back[mid.length - 1]], shade(flesh, 0.9), c);
}

function grapePositions(model) {
	const t = model.target;
	const rg = model.grapesR;
	const dh = t.dh;
	const side = [-dh[1], dh[0], 0];
	// The bunch sits where the top of the leaning slice touches it.
	const center = add(t.edge, scale(dh, model.slice.r * Math.cos(t.tilt) + rg * 0.75));
	const floor = model.tray.z_m;
	const gr = rg * 0.34;
	const out = [];
	const ring = (k, rad, z, phase) => {
		for (let i = 0; i < k; i++) {
			const a = phase + (i / k) * Math.PI * 2;
			const p = add(center, add(scale(dh, Math.cos(a) * rad * 1.15), scale(side, Math.sin(a) * rad)));
			out.push([p[0], p[1], floor + z]);
		}
	};
	ring(7, rg * 0.66, gr, 0.2);
	out.push([center[0], center[1], floor + gr]);
	ring(4, rg * 0.38, gr * 2.4, 0.9);
	out.push([center[0], center[1], floor + gr * 3.6]);
	return { balls: out, gr, center, top: floor + gr * 4.4 };
}

// ---------------------------------------------------------------------------
// View

/**
 * Framing for the main view: points that must stay in view (cell frame). extra: more points,
 * for example the arm at its start pose and at a solving pose.
 */
export function mainFrame(model, extra = []) {
	const tray = model.tray;
	const L = model.L;
	const pts = [...extra, [0, 0, L.base + L.upper_arm * 0.9]];
	for (const x of [-0.16, 0.16]) for (const y of [-0.16, 0.16]) pts.push([x, y, -0.06]);
	for (const x of [tray.x_m - tray.length_m / 2 - 0.04, tray.x_m + tray.length_m / 2 + 0.04])
		for (const y of [tray.y_m - tray.width_m / 2 - 0.04, tray.y_m + tray.width_m / 2 + 0.04]) pts.push([x, y, tray.z_m - 0.06], [x, y, tray.z_m + 0.08]);
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	return { pivot: [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2, 0], points: pts };
}

/** Close-up framing: around the target, wide enough to show the slice, grapes, and cup. */
export function closeupFrame(model) {
	const t = model.target;
	const g = grapePositions(model);
	const center = scale(add(t.grip, [g.center[0], g.center[1], t.grip[2]]), 0.5);
	const rad = Math.max(0.05, model.slice.r * 1.5 + model.grapesR * 0.55);
	const points = [];
	for (let i = 0; i < 8; i++) {
		const a = (i / 8) * Math.PI * 2;
		points.push(add(center, [Math.cos(a) * rad, Math.sin(a) * rad, -rad * 0.55]), add(center, [Math.cos(a) * rad, Math.sin(a) * rad, rad * 0.55]));
	}
	return { pivot: center, points };
}

/**
 * Camera for a w x h canvas looking at a frame turned by yaw: { yaw, zoom, ox, oy, view(p) },
 * where view maps a cell point to the iso world. The zoom is the same at every view angle
 * (the smallest fit over a full turn), so turning the view does not pump the scale.
 */
export function makeCamera(frame, w, h, yaw, margin = 0.94) {
	const pivot = frame.pivot;
	const turn = (a) => {
		const c = Math.cos(a);
		const s = Math.sin(a);
		return (p) => {
			const x = p[0] - pivot[0];
			const y = p[1] - pivot[1];
			return [x * c - y * s, x * s + y * c, p[2]];
		};
	};
	const bounds = (v) => {
		let x0 = Infinity;
		let x1 = -Infinity;
		let y0 = Infinity;
		let y1 = -Infinity;
		for (const p of frame.points) {
			const q = v(p);
			const px = (q[0] - q[1]) * ISO.X;
			const py = (q[0] + q[1]) * ISO.Y - q[2] * ISO.Z;
			x0 = Math.min(x0, px);
			x1 = Math.max(x1, px);
			y0 = Math.min(y0, py);
			y1 = Math.max(y1, py);
		}
		return { x0, x1, y0, y1 };
	};
	// Largest projected width and height over a full turn (cached on the frame).
	if (!frame.span) {
		frame.span = [1e-6, 1e-6];
		for (let i = 0; i < 16; i++) {
			const b = bounds(turn((i / 16) * Math.PI * 2));
			frame.span = [Math.max(frame.span[0], b.x1 - b.x0), Math.max(frame.span[1], b.y1 - b.y0)];
		}
	}
	const zoom = Math.min(w / frame.span[0], h / frame.span[1]) * margin;
	const view = turn(yaw);
	const b = bounds(view);
	return { yaw, zoom, ox: w / 2 - ((b.x0 + b.x1) / 2) * zoom, oy: h / 2 - ((b.y0 + b.y1) / 2) * zoom, view };
}

// ---------------------------------------------------------------------------
// Scene

/**
 * Draw the whole cell. state: { pose (from fk), locked[6], driven[6] (joints turning by themselves
 * in level mode, drawn in a muted joint color), active (joint index or -1), ghostAlpha, solved,
 * inTol, badges (bool) }.
 */
export function drawCell(r, cam, model, state) {
	const { view } = cam;
	const c2 = r.ctx;
	r.setTransform(cam.zoom, cam.ox, cam.oy);
	const px = (n) => n / cam.zoom; // line widths in screen pixels
	const L = model.L;
	const tray = model.tray;
	const pose = state.pose;
	const fr = pose.frames;
	const jointColor = (i) => (state.driven?.[i] ? mix(JOINT_COLORS[i], LOCKED, 0.55) : state.locked[i] ? LOCKED : JOINT_COLORS[i]);

	// --- Base layer: supports drawn before anything that rests on them, far object first.
	const beltTop = tray.z_m - 0.008;
	const bx0 = tray.x_m - tray.length_m / 2 - 0.07;
	const bx1 = tray.x_m + tray.length_m / 2 + 0.07;
	const by0 = tray.y_m - 0.36;
	const by1 = tray.y_m + 0.36;
	const supports = [
		{
			at: [0, 0, -0.3],
			build: (s) => {
				s.aabb(-0.14, -0.14, -0.9, 0.14, 0.14, -0.02, PAL.steel, { top: shade(PAL.steel, 1.08) });
				s.aabb(-0.16, -0.16, -0.02, 0.16, 0.16, 0, PAL.dark);
			},
		},
		{
			at: [tray.x_m, tray.y_m, beltTop - 0.3],
			build: (s) => {
				// Legs first in their own pass: their tops hide under the belt.
				const legs = new Soup(view);
				for (const y of [by0 + 0.06, by1 - 0.09]) for (const x of [bx0 + 0.03, bx1 - 0.06]) legs.aabb(x, y, -0.9, x + 0.03, y + 0.03, beltTop - 0.05, PAL.dark);
				legs.draw(r);
				s.aabb(bx0, by0, beltTop - 0.05, bx1, by1, beltTop, PAL.metal, { top: BELT });
				s.aabb(bx0 - 0.015, by0, beltTop - 0.03, bx0, by1, beltTop + 0.02, PAL.steel);
				s.aabb(bx1, by0, beltTop - 0.03, bx1 + 0.015, by1, beltTop + 0.02, PAL.steel);
			},
		},
	];
	const depth = (p) => {
		const q = view(p);
		return q[0] + q[1];
	};
	supports.sort((a, b) => depth(a.at) - depth(b.at));
	for (const sp of supports) {
		const s = new Soup(view);
		sp.build(s);
		s.draw(r);
	}
	// Tray floor (rims go in the main pass so they sort against what is inside).
	const tx0 = tray.x_m - tray.length_m / 2;
	const tx1 = tray.x_m + tray.length_m / 2;
	const ty0 = tray.y_m - tray.width_m / 2;
	const ty1 = tray.y_m + tray.width_m / 2;
	{
		const s = new Soup(view);
		s.aabb(tx0, ty0, beltTop, tx1, ty1, tray.z_m, FOOD.tray, { top: FOOD.trayIn });
		s.draw(r);
	}

	// --- Shadows on the tray and belt: slice and tool straight down (a depth cue).
	{
		c2.save();
		const clip = [
			[bx0, by0, beltTop],
			[bx1, by0, beltTop],
			[bx1, by1, beltTop],
			[bx0, by1, beltTop],
		].map((p) => r.toScreen(...view(p)));
		c2.beginPath();
		clip.forEach((p, i) => (i ? c2.lineTo(p[0], p[1]) : c2.moveTo(p[0], p[1])));
		c2.closePath();
		c2.clip();
		const zFloor = (x, y) => (x >= tx0 && x <= tx1 && y >= ty0 && y <= ty1 ? tray.z_m : beltTop);
		const outline = sliceOutline(pose.slice.origin, pose.slice.R, model.slice.r);
		c2.beginPath();
		outline.forEach((p, i) => {
			const q = r.toScreen(...view([p[0], p[1], zFloor(p[0], p[1])]));
			if (i) c2.lineTo(q[0], q[1]);
			else c2.moveTo(q[0], q[1]);
		});
		c2.closePath();
		c2.fillStyle = "rgba(20,30,40,0.22)";
		c2.fill();
		const tip = pose.tip;
		const sp = r.toScreen(...view([tip[0], tip[1], zFloor(tip[0], tip[1])]));
		c2.beginPath();
		c2.ellipse(sp[0], sp[1], Math.max(2, 0.03 * ISO.X * cam.zoom), Math.max(1, 0.03 * ISO.Y * cam.zoom), 0, 0, Math.PI * 2);
		c2.fillStyle = "rgba(20,30,40,0.12)";
		c2.fill();
		c2.restore();
	}

	// --- Main pass: rims, grapes, slice, arm, all sorted together.
	const s = new Soup(view);
	const rimH = 0.022;
	const rimT = 0.006;
	s.aabb(tx0, ty0, tray.z_m, tx1, ty0 + rimT, tray.z_m + rimH, FOOD.tray);
	s.aabb(tx0, ty1 - rimT, tray.z_m, tx1, ty1, tray.z_m + rimH, FOOD.tray);
	s.aabb(tx0, ty0, tray.z_m, tx0 + rimT, ty1, tray.z_m + rimH, FOOD.tray);
	s.aabb(tx1 - rimT, ty0, tray.z_m, tx1, ty1, tray.z_m + rimH, FOOD.tray);
	const grapes = grapePositions(model);
	grapes.balls.forEach((b, i) => s.sphere(b, grapes.gr, i % 3 ? FOOD.grape : FOOD.grape2, 3, 6));
	const stemA = [grapes.center[0], grapes.center[1], grapes.top - 0.004];
	s.beam(stemA, add(stemA, add(scale(model.target.dh, -0.012), [0, 0, 0.022])), [0, 0, 1], 0.006, 0.006, FOOD.stem);

	addSlice(s, pose.slice.origin, pose.slice.R, model.slice);

	// Arm. Axes from the forward kinematics frames.
	const ax = (R, j) => [R[j], R[3 + j], R[6 + j]];
	const S = pose.S;
	const E = pose.E;
	const W = pose.W;
	const F = pose.F;
	const tip = pose.tip;
	const z1 = ax(fr.R1, 2);
	const a2 = ax(fr.R1, 1);
	const a3 = ax(fr.R2, 1);
	const fdir = ax(fr.R3, 0);
	const a5 = ax(fr.R4, 1);
	const tdir = ax(fr.R5, 0);
	const hz = (p, k) => add(p, scale(z1, k));
	// J1: base ring and turret.
	s.tube([0, 0, 0], [0, 0, 0.05], 0.105, ARM.dark, 12);
	s.tube([0, 0, 0.05], [0, 0, 0.085], 0.098, jointColor(0), 12);
	s.tube([0, 0, 0.085], hz([0, 0, 0], L.base - 0.06), 0.082, ARM.body, 12, ARM.trim);
	// Shoulder (J2) housing, upper arm, elbow (J3) housing.
	const shoulderOff = 0.075;
	const uS = add(S, scale(a2, shoulderOff));
	const uE = add(E, scale(a2, shoulderOff));
	s.tube(add(S, scale(a2, -0.06)), add(S, scale(a2, shoulderOff + 0.045)), 0.066, jointColor(1), 12);
	s.beam(uS, uE, a2, 0.06, 0.075, ARM.body);
	s.tube(add(E, scale(a2, 0.02)), add(E, scale(a2, shoulderOff + 0.04)), 0.052, jointColor(2), 12);
	// Forearm in two parts: the rear part, the J4 collar, then the front part that rolls.
	const collar0 = sub(W, scale(fdir, Math.min(0.13, L.forearm * 0.42)));
	const collar1 = add(collar0, scale(fdir, 0.032));
	s.beam(add(E, scale(fdir, 0.02)), collar0, a3, 0.06, 0.064, ARM.body);
	s.tube(collar0, collar1, 0.043, jointColor(3), 12);
	s.beam(collar1, sub(W, scale(fdir, 0.02)), a5, 0.05, 0.054, ARM.body);
	// Wrist (J5) housing, wrist link, flange (J6), tool, cup.
	s.tube(add(W, scale(a5, -0.036)), add(W, scale(a5, 0.036)), 0.034, jointColor(4), 10);
	s.beam(W, sub(F, scale(tdir, 0.006)), a5, 0.04, 0.042, ARM.body);
	s.tube(sub(F, scale(tdir, 0.008)), add(F, scale(tdir, 0.008)), 0.031, jointColor(5), 10);
	s.tube(add(F, scale(tdir, 0.008)), sub(tip, scale(tdir, 0.012)), 0.011, ARM.metal, 8);
	s.tube(sub(tip, scale(tdir, 0.014)), tip, 0.019, ARM.rubber, 10);
	s.draw(r);

	// --- Ghost target on top: translucent slice and a dashed outline.
	const t = model.target;
	const ghostColor = state.inTol ? "#2fa66a" : PAL.ride.ride2;
	{
		const g = new Soup(view);
		addSlice(g, t.origin, t.R, model.slice, { flesh: ghostColor, skin: shade(ghostColor, 0.8) });
		// Once the slice is on target the ghost fades so the real slice shows through.
		g.draw(r, { alpha: state.inTol ? 0.22 : state.ghostAlpha });
		const n = [t.R[2], t.R[5], t.R[8]];
		const out = sliceOutline(add(t.origin, scale(n, model.slice.t / 2)), t.R, model.slice.r);
		c2.save();
		c2.beginPath();
		out.forEach((p, i) => {
			const q = r.toScreen(...view(p));
			if (i) c2.lineTo(q[0], q[1]);
			else c2.moveTo(q[0], q[1]);
		});
		c2.closePath();
		c2.setLineDash([5, 3]);
		c2.lineWidth = 2;
		c2.strokeStyle = shade(ghostColor, 0.7);
		c2.stroke();
		c2.restore();
	}

	// --- Active joint: its axis as a line through the joint.
	if (state.active >= 0) {
		const a = pose.axes[state.active];
		const o = state.active === 0 ? [0, 0, 0.07] : state.active === 3 ? scale(add(collar0, collar1), 0.5) : a.o;
		const k = 0.16;
		r.line(view(add(o, scale(a.a, -k))), view(add(o, scale(a.a, k))), JOINT_COLORS[state.active], px(2.5));
	}

	// --- Joint number badges.
	if (state.badges || state.active >= 0) {
		const spots = [
			[0, 0, 0.068],
			add(S, scale(a2, shoulderOff + 0.05)),
			add(E, scale(a2, shoulderOff + 0.045)),
			scale(add(collar0, collar1), 0.5),
			add(W, scale(a5, 0.04)),
			F,
		];
		const offsets = [
			[-16, 10],
			[-14, -12],
			[12, -12],
			[0, -16],
			[14, -10],
			[14, 8],
		];
		c2.save();
		c2.font = "700 11px system-ui, sans-serif";
		c2.textAlign = "center";
		c2.textBaseline = "middle";
		for (let i = 0; i < 6; i++) {
			if (!state.badges && i !== state.active) continue;
			const p = r.toScreen(...view(spots[i]));
			const bx = p[0] + offsets[i][0];
			const by = p[1] + offsets[i][1];
			c2.beginPath();
			c2.arc(bx, by, 8.5, 0, Math.PI * 2);
			c2.fillStyle = state.driven?.[i] ? mix(JOINT_COLORS[i], "#6d7682", 0.55) : state.locked[i] ? "#6d7682" : JOINT_COLORS[i];
			c2.fill();
			c2.lineWidth = 1.5;
			c2.strokeStyle = "#ffffff";
			c2.stroke();
			c2.fillStyle = "#ffffff";
			c2.fillText(String(i + 1), bx, by + 0.5);
		}
		c2.restore();
	}
}

/** Small x / y / z arrows in the top-left corner of a w x h canvas, turned with the view. */
export function drawTriad(c2, cam, w) {
	const size = Math.max(14, Math.min(22, w * 0.05));
	const axes = [
		["x", [1, 0, 0], "#c0392b"],
		["y", [0, 1, 0], "#2e8b57"],
		["z", [0, 0, 1], "#2f6fb3"],
	];
	const c = Math.cos(cam.yaw);
	const s = Math.sin(cam.yaw);
	const dirs = axes.map(([, v]) => {
		const q = [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
		const dx = (q[0] - q[1]) * ISO.X;
		const dy = (q[0] + q[1]) * ISO.Y - q[2] * ISO.Z;
		const k = size / ISO.Z;
		return [dx * k, dy * k];
	});
	// Place the origin so every arrow and label stays inside the canvas.
	const pad = 12;
	const minX = Math.min(0, ...dirs.map((d) => d[0] * 1.45));
	const minY = Math.min(0, ...dirs.map((d) => d[1] * 1.45));
	const x = pad - minX;
	const y = pad - minY;
	c2.save();
	c2.font = "700 11px system-ui, sans-serif";
	c2.textAlign = "center";
	c2.textBaseline = "middle";
	axes.forEach(([name, , col], i) => {
		const d = dirs[i];
		c2.beginPath();
		c2.moveTo(x, y);
		c2.lineTo(x + d[0], y + d[1]);
		c2.lineWidth = 2;
		c2.strokeStyle = col;
		c2.lineCap = "round";
		c2.stroke();
		c2.fillStyle = col;
		c2.fillText(name, x + d[0] * 1.38, y + d[1] * 1.38);
	});
	c2.restore();
}
