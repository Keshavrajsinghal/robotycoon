// Drawing for wb5-teleop: one video frame of the grape station as the operator's camera shows it
// (the six-axis arm with soft fingers, the tote of bunches, the plate on the belt), the operator's
// own overlays (tool point, stem markers, tap ripple), the optional live robot view, and the video
// HUD. Low-poly, flat-shaded isometric in the park's daylight palette.
//
// Tote coordinates (see GEO in wb5-sim.js) are world meters: u runs along world x (toward the
// lower right of the screen), v along world y (negative v is the robot's side, toward the upper
// right), z is up.

import { drawGrapes, drawHangingBunch, drawPlate } from "../engine/food.js";
import { ISO, shade, unproject } from "../engine/iso.js";
import { PAL } from "../engine/park.js";
import { drawSoftFingers, ik2, ROBOT_COLORS } from "../engine/robots.js";
import { GEO } from "./wb5-sim.js";

const COL = {
	tote: "#2f6fb3",
	toteFloor: "#a9c3e2",
	belt: "#3a3f47",
	live: "#5fe3ff",
	goal: "#8ff2df",
	stem: "#3f5f1c",
};

const PLATE_S = 0.5; // drawn plate scale (about 0.32 m long)
const WALL_T = 0.018; // tote wall thickness

/**
 * Camera framing for a canvas of w x h CSS px: fit the tote, the plate, and the robot's base and
 * shoulder, with a small margin. g: { hu, hv, base, plateAt } from the model.
 */
export function makeView(w, h, g) {
	const Z = GEO.toteZ;
	const s = GEO.armScale;
	const [bx, by] = g.base;
	const [px0, py0] = g.plateAt;
	const pts = [
		[-g.hu - 0.06, -g.hv - 0.06, Z + GEO.wallH],
		[g.hu + 0.06, -g.hv - 0.06, Z + GEO.wallH],
		[-g.hu - 0.06, g.hv + 0.06, Z - 0.12],
		[g.hu + 0.06, g.hv + 0.06, Z - 0.12],
		[px0 + 0.14, py0 + 0.32, GEO.beltZ - 0.1],
		[px0 + 0.14, py0 - 0.32, GEO.beltZ + 0.1],
		[bx - 0.3 * s, by + 0.3 * s, GEO.baseZ],
		[bx, by, GEO.baseZ + GEO.viewTop * s],
	];
	const sx = pts.map((p) => (p[0] - p[1]) * ISO.X);
	const sy = pts.map((p) => (p[0] + p[1]) * ISO.Y - p[2] * ISO.Z);
	const [x0, x1, y0, y1] = [Math.min(...sx), Math.max(...sx), Math.min(...sy), Math.max(...sy)];
	const m = 8;
	const zoom = Math.min((w - 2 * m) / (x1 - x0), (h - 2 * m) / (y1 - y0));
	const ox = w / 2 - ((x0 + x1) / 2) * zoom;
	const oy = h / 2 - ((y0 + y1) / 2) * zoom;
	const K = Math.SQRT2;
	return {
		w,
		h,
		zoom,
		ox,
		oy,
		/** Screen point (CSS px in the canvas) to tote coordinates on the plane at height z. */
		toUV(sxp, syp, z = Z + GEO.stemZ) {
			return unproject((sxp - ox) / zoom, (syp - oy) / zoom, z);
		},
		toScreen(u, v, z = Z + GEO.stemZ) {
			return [ox + (u - v) * ISO.X * zoom, oy + ((u + v) * ISO.Y - z * ISO.Z) * zoom];
		},
		/** Screen radii of a circle of radius m meters lying on a horizontal plane. */
		radii(r) {
			return [r * K * ISO.X * zoom, r * K * ISO.Y * zoom];
		},
		/** Screen direction (dx, dy) to a unit direction in tote coordinates ("push up" = away). */
		dirUV(dx, dy) {
			const a = dx / ISO.X;
			const b = dy / ISO.Y;
			const du = (a + b) / 2;
			const dv = (b - a) / 2;
			const n = Math.hypot(du, dv) || 1;
			return [du / n, dv / n];
		},
	};
}

function bunchFrame(cu, cv, z, hd) {
	const ca = Math.cos(hd);
	const sa = Math.sin(hd);
	const S = GEO.grapeS;
	return (f, sd, zz = 0) => [cu + (f * ca - sd * sa) * S, cv + (f * sa + sd * ca) * S, z + zz * S];
}

/** A bunch lying in the tote, with its stem drawn a little bolder so it reads in the video. */
function drawBunch(r, b) {
	const at = bunchFrame(b.u, b.v, GEO.toteZ, b.hd);
	const S = GEO.grapeS;
	r.shadow(b.u, b.v, 0.08, 0.08, 0.28, GEO.toteZ + 0.002);
	// drawGrapes sizes its stem line in projected px; keep it about 3 px wide at any zoom.
	drawGrapes(r, at, S, 3 / (2.2 * S * r.zoom));
	const p0 = at(-0.155, 0, 0.06);
	const p1 = at(GEO.stemF / 1, 0.005, 0.075);
	r.line(p0, p1, COL.stem, 3.2 / r.zoom);
}

function drawFloor(r, w, h) {
	const c = r.ctx;
	c.fillStyle = PAL.floor;
	c.fillRect(0, 0, w, h);
	const pts = [
		[0, 0],
		[w, 0],
		[0, h],
		[w, h],
	].map(([sx, sy]) => unproject((sx - r.ox) / r.zoom, (sy - r.oy) / r.zoom, 0));
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
	const step = 0.5;
	for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) r.line([x, y0, 0], [x, y1, 0], PAL.floor2, 0.08);
	for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) r.line([x0, y, 0], [x1, y, 0], PAL.floor2, 0.08);
}

/** Short belt with the plate on it. shift 0..1 slides the plate out (+v) and the next one in. */
function drawBelt(r, o, f) {
	const [pu, pv] = o.plateAt;
	const Z = GEO.beltZ;
	const half = 0.2;
	const v0 = pv - 0.7;
	const v1 = pv + 0.55;
	for (const v of [v0 + 0.15, pv, v1 - 0.15]) for (const u of [pu - half + 0.02, pu + half - 0.06]) r.box(u, v - 0.02, 0, 0.04, 0.04, Z - 0.08, PAL.dark);
	r.box(pu - half, v0, Z - 0.08, 2 * half, v1 - v0, 0.07, PAL.metal);
	r.ground(pu - half + 0.02, v0, 2 * half - 0.04, v1 - v0, COL.belt, Z - 0.009);
	const k = f.plate.shift;
	const span = 0.62;
	const plates = [[pv + k * span, f.plate.grapes]];
	if (k > 0) plates.unshift([pv - (1 - k) * span, false]);
	for (const [v, grapes] of plates) if (v > v0 - 0.1 && v < v1 + 0.1) drawPlate(r, pu, v, Z - 0.01, Math.PI / 2, { grapes }, { scale: PLATE_S, lineScale: 1 / Math.max(1, r.zoom / 3) });
	r.box(pu - half - 0.025, v0, Z - 0.05, 0.025, v1 - v0, 0.06, PAL.steel);
	r.box(pu + half, v0, Z - 0.05, 0.025, v1 - v0, 0.06, PAL.steel);
}

// The six-axis arm with soft fingers, drawn in two passes so the tote can sit between them: the
// base and turret are behind the tote, the links, wrist, and fingers reach over it. Same model and
// proportions as drawSixAxis in engine/robots.js (which draws everything in one pass).
const ARM_C = { ...ROBOT_COLORS, body: "#f2f2ee", accent: "#2a9d8f" };

function armPose(base, target) {
	const s = GEO.armScale;
	const [bx, by] = base;
	const L1 = 0.78 * s;
	const L2 = 0.72 * s;
	const toolLen = 0.26 * s;
	const S = [bx, by, GEO.baseZ + 0.72 * s];
	const W = [target[0], target[1], target[2] + toolLen];
	const yaw = Math.atan2(W[1] - S[1], W[0] - S[0]);
	const f = [Math.cos(yaw), Math.sin(yaw)];
	const k = ik2(L1, L2, Math.hypot(W[0] - S[0], W[1] - S[1]), W[2] - S[2], true);
	const E = [S[0] + f[0] * k.elbow[0], S[1] + f[1] * k.elbow[0], S[2] + k.elbow[1]];
	const Wp = [S[0] + f[0] * k.wrist[0], S[1] + f[1] * k.wrist[0], S[2] + k.wrist[1]];
	return { s, bx, by, S, E, Wp, yaw, side: [-f[1], f[0]], toolLen, target };
}

function drawArmBase(r, P) {
	const { s, bx, by, yaw } = P;
	const bz = GEO.baseZ;
	r.cylinder(bx, by, bz, 0.36 * s, 0.14 * s, ARM_C.joint, 10);
	r.cylinder(bx, by, bz + 0.14 * s, 0.3 * s, 0.34 * s, ARM_C.body, 10);
	r.orientedBox(bx, by, bz + 0.46 * s, 0.5 * s, 0.42 * s, 0.4 * s, yaw, ARM_C.body);
}

function drawArmLinks(r, P, grip) {
	const { s, S, E, Wp, side, toolLen, target, yaw } = P;
	const off = (p, d) => [p[0] + side[0] * d, p[1] + side[1] * d, p[2]];
	r.tube(off(S, -0.25 * s), off(S, 0.25 * s), 0.17 * s, ARM_C.accent, 10);
	r.beam(off(S, 0.06 * s), off(E, 0.06 * s), 0.24 * s, 0.28 * s, ARM_C.body);
	r.tube(off(E, -0.18 * s), off(E, 0.2 * s), 0.13 * s, ARM_C.accent, 10);
	r.beam(E, Wp, 0.18 * s, 0.2 * s, ARM_C.body);
	r.tube(off(Wp, -0.09 * s), off(Wp, 0.09 * s), 0.08 * s, ARM_C.joint, 8);
	const T = [Wp[0], Wp[1], Wp[2] - toolLen * 0.75];
	r.tube(Wp, T, 0.05 * s, ARM_C.metal, 6);
	r.cylinder(T[0], T[1], target[2] + 0.12 * s, 0.03 * s, T[2] - target[2] - 0.12 * s, ARM_C.joint, 6);
	drawSoftFingers(r, target[0], target[1], target[2], grip, s, yaw);
}

function drawPedestal(r, o) {
	const [bx, by] = o.base;
	r.ground(bx - 0.42, by - 0.42, 0.84, 0.84, PAL.safety, 0.002);
	r.ground(bx - 0.38, by - 0.38, 0.76, 0.76, PAL.floor, 0.003);
	r.box(bx - 0.22, by - 0.22, 0, 0.44, 0.44, GEO.baseZ, PAL.steel);
}

function drawToteBack(r, o) {
	const { hu, hv } = o;
	const Z = GEO.toteZ;
	const t = WALL_T;
	// Stand, floor, and the two far walls (their inner faces show).
	for (const [u, v] of [
		[-hu + 0.04, -hv + 0.04],
		[hu - 0.08, -hv + 0.04],
		[-hu + 0.04, hv - 0.08],
		[hu - 0.08, hv - 0.08],
	])
		r.box(u, v, 0, 0.04, 0.04, Z - 0.05, PAL.dark);
	r.box(-hu - t, -hv - t, Z - 0.05, 2 * hu + 2 * t, 2 * hv + 2 * t, 0.05, shade(COL.tote, 0.85));
	r.ground(-hu, -hv, 2 * hu, 2 * hv, COL.toteFloor, Z + 0.001);
	r.box(-hu - t, -hv - t, Z, 2 * hu + 2 * t, t, GEO.wallH, COL.tote, { top: shade(COL.tote, 1.15) });
	r.box(-hu - t, -hv, Z, t, 2 * hv, GEO.wallH, COL.tote, { top: shade(COL.tote, 1.15) });
}

function drawToteFront(r, o) {
	const { hu, hv } = o;
	const Z = GEO.toteZ;
	const t = WALL_T;
	// Near walls drawn see-through, so the bunches behind them stay visible to the operator.
	const opts = { alpha: 0.32, top: shade(COL.tote, 1.15), edge: "rgba(255,255,255,0.6)" };
	r.box(-hu - t, hv, Z, 2 * hu + 2 * t, t, GEO.wallH, COL.tote, opts);
	r.box(hu, -hv, Z, t, 2 * hv, GEO.wallH, COL.tote, opts);
}

/**
 * Draw one video frame (a snapshot from the model). o: { hu, hv, base, plateAt } from the model.
 */
export function drawFrame(r, f, o, w, h) {
	const g = f.grip;
	const tipZ = GEO.toteZ + g.z;
	const pose = armPose(o.base, [g.u, g.v, tipZ]);
	drawFloor(r, w, h);
	drawPedestal(r, o);
	drawArmBase(r, pose);
	drawToteBack(r, o);
	const list = [...f.bunches].sort((a, b) => a.u + a.v - (b.u + b.v));
	for (const b of list) drawBunch(r, b);
	if (Math.abs(g.u) < o.hu && Math.abs(g.v) < o.hv) r.shadow(g.u, g.v, 0.06, 0.06, 0.22, GEO.toteZ + 0.003);
	drawToteFront(r, o);
	drawBelt(r, o, f);
	drawArmLinks(r, pose, g.open);
	if (g.held) drawHangingBunch(r, g.u, g.v, tipZ + 0.01, 0, 0.5);
}

// ---------------------------------------------------------------------------------------------
// Operator overlays (drawn in screen space on top of the frame)

function ellipse(c, view, u, v, m, z) {
	const [sx, sy] = view.toScreen(u, v, z);
	const [rx, ry] = view.radii(m);
	c.beginPath();
	c.ellipse(sx, sy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
	return [sx, sy, rx, ry];
}

function strokeTwice(c, w, color, dark = "rgba(10,20,30,0.55)") {
	c.lineWidth = w + 2;
	c.strokeStyle = dark;
	c.stroke();
	c.lineWidth = w;
	c.strokeStyle = color;
	c.stroke();
}

/**
 * Direct mode: where the fingers would close, as the frame shows them. A ring the size of the grip
 * tolerance at stem height, and a dashed drop line from the fingertips.
 */
export function drawToolPoint(c, view, g, tol) {
	const zStem = GEO.toteZ + GEO.stemZ;
	const [tx, ty] = view.toScreen(g.u, g.v, GEO.toteZ + g.z);
	const [sx, sy, rx, ry] = ellipse(c, view, g.u, g.v, tol, zStem);
	strokeTwice(c, 2, "#ffffff");
	if (ty < sy - ry - 2) {
		c.save();
		c.setLineDash([3, 3]);
		c.beginPath();
		c.moveTo(tx, ty);
		c.lineTo(sx, sy - ry);
		strokeTwice(c, 1.2, "#ffffff", "rgba(10,20,30,0.35)");
		c.restore();
	}
	c.beginPath();
	const a = rx + 6;
	const b = ry + 5;
	c.moveTo(sx - a, sy);
	c.lineTo(sx - rx + 1, sy);
	c.moveTo(sx + rx - 1, sy);
	c.lineTo(sx + a, sy);
	c.moveTo(sx, sy + ry - 1);
	c.lineTo(sx, sy + b);
	strokeTwice(c, 1.5, "#ffffff");
}

/**
 * A marker on a stem (a grasp candidate). kind: "plain" (direct mode), "offer" (assist: tap me),
 * "hover", "select", or "goal" (sent as the grasp point).
 */
export function drawStem(c, view, u, v, kind, tol) {
	const zStem = GEO.toteZ + GEO.stemZ + 0.02;
	if (kind === "plain") {
		const [sx, sy] = view.toScreen(u, v, zStem);
		c.beginPath();
		c.arc(sx, sy, 3.5, 0, Math.PI * 2);
		c.fillStyle = "rgba(255,255,255,0.85)";
		c.fill();
		c.lineWidth = 1.5;
		c.strokeStyle = "rgba(10,20,30,0.6)";
		c.stroke();
		return;
	}
	const m = kind === "goal" ? 0.032 : 0.028;
	ellipse(c, view, u, v, m, zStem);
	c.save();
	{
		if (kind !== "goal") c.setLineDash([4, 3]);
		const col = kind === "goal" ? COL.goal : kind === "select" ? "#ffe27a" : kind === "hover" ? "#ffffff" : "#d9fff6";
		strokeTwice(c, kind === "goal" ? 2.5 : 2, col);
	}
	c.restore();
}

/** A ripple where the operator tapped (k: 0..1 through its life; a static ring when reduced). */
export function drawRipple(c, view, u, v, k, reduced) {
	ellipse(c, view, u, v, 0.03 * (reduced ? 1.3 : 1 + k * 1.4), GEO.toteZ + GEO.stemZ);
	c.lineWidth = 2;
	c.strokeStyle = `rgba(255,226,122,${reduced ? 0.9 : (1 - k).toFixed(2)})`;
	c.stroke();
}

// ---------------------------------------------------------------------------------------------
// Wrist camera inset (direct mode): a magnified top-down view under the fingers, from the same
// delayed frame. Its axes are turned like the main view, so "push right" on the move pad is right
// here too.

const WRIST_FOV = 0.22; // meters across the inset

/** Bunch-local grape centers (as drawGrapes lays them out) and the stem line, top-down. */
const BALLS = (() => {
	const out = [];
	[4, 3, 3, 2, 1].forEach((n, row) => {
		for (let i = 0; i < n; i++) out.push([row * 0.055 - 0.11, (i - (n - 1) / 2) * 0.06]);
	});
	return out;
})();

/**
 * rect: { x, y, size } in CSS px. f: the frame. o: { hu, hv }. live: the robot's real gripper
 * [u, v] or null. Returns nothing; draws the inset with its own clip.
 */
export function drawWrist(c, rect, f, o, tol, live) {
	const { x, y, size } = rect;
	const k = size / WRIST_FOV;
	const g = f.grip;
	const cx = x + size / 2;
	const cy = y + size / 2;
	const K = Math.SQRT1_2;
	const to = (u, v) => {
		const du = u - g.u;
		const dv = v - g.v;
		return [cx + (du - dv) * K * k, cy + (du + dv) * K * k];
	};
	c.save();
	c.beginPath();
	if (c.roundRect) c.roundRect(x, y, size, size, 10);
	else c.rect(x, y, size, size);
	c.fillStyle = PAL.floor;
	c.fill();
	c.clip();
	// Tote floor and walls.
	const corners = [
		[-o.hu, -o.hv],
		[o.hu, -o.hv],
		[o.hu, o.hv],
		[-o.hu, o.hv],
	].map(([u, v]) => to(u, v));
	c.beginPath();
	corners.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py)));
	c.closePath();
	c.fillStyle = COL.toteFloor;
	c.fill();
	c.lineWidth = Math.max(2, WALL_T * k);
	c.strokeStyle = COL.tote;
	c.stroke();
	// Bunches: grapes as circles, stem as a line with a dot at the grasp point.
	const S = GEO.grapeS;
	const rBall = 0.034 * S * k;
	for (const b of f.bunches) {
		const ca = Math.cos(b.hd);
		const sa = Math.sin(b.hd);
		const at = (fl, sd) => to(b.u + (fl * ca - sd * sa) * S, b.v + (fl * sa + sd * ca) * S);
		const [s0x, s0y] = at(-0.16, 0);
		const [s1x, s1y] = at(-0.21, 0.02);
		c.beginPath();
		c.moveTo(s0x, s0y);
		c.lineTo(s1x, s1y);
		c.lineWidth = Math.max(2, 0.008 * k);
		c.lineCap = "round";
		c.strokeStyle = COL.stem;
		c.stroke();
		BALLS.forEach(([fl, sd], i) => {
			const [bx, by] = at(fl, sd);
			c.beginPath();
			c.arc(bx, by, rBall, 0, Math.PI * 2);
			c.fillStyle = i % 3 ? "#6f3f8f" : "#83509f";
			c.fill();
			c.lineWidth = 1;
			c.strokeStyle = "rgba(40,20,60,0.5)";
			c.stroke();
		});
		const [sx, sy] = to(b.su, b.sv);
		c.beginPath();
		c.arc(sx, sy, 3.5, 0, Math.PI * 2);
		c.fillStyle = "rgba(255,255,255,0.9)";
		c.fill();
		c.lineWidth = 1.5;
		c.strokeStyle = "rgba(10,20,30,0.6)";
		c.stroke();
	}
	// The robot's real gripper, when the live view is on.
	if (live) {
		const [lx, ly] = to(live[0], live[1]);
		c.save();
		c.setLineDash([4, 4]);
		c.beginPath();
		c.arc(lx, ly, tol * k, 0, Math.PI * 2);
		c.lineWidth = 2;
		c.strokeStyle = COL.live;
		c.stroke();
		c.restore();
	}
	// Fingers' center: the grip tolerance circle and a crosshair. Fingertips drawn as three dots
	// that close with the grip.
	c.beginPath();
	c.arc(cx, cy, tol * k, 0, Math.PI * 2);
	strokeTwice(c, 2, "#ffffff");
	c.beginPath();
	const a = tol * k + 8;
	c.moveTo(cx - a, cy);
	c.lineTo(cx - tol * k + 2, cy);
	c.moveTo(cx + tol * k - 2, cy);
	c.lineTo(cx + a, cy);
	c.moveTo(cx, cy - a);
	c.lineTo(cx, cy - tol * k + 2);
	c.moveTo(cx, cy + tol * k - 2);
	c.lineTo(cx, cy + a);
	strokeTwice(c, 1.5, "#ffffff");
	const spread = (0.012 + g.open * 0.06) * GEO.armScale * k;
	for (let i = 0; i < 3; i++) {
		const ang = Math.PI / 6 + (i / 3) * Math.PI * 2;
		c.beginPath();
		c.arc(cx + Math.cos(ang) * spread, cy + Math.sin(ang) * spread, 4, 0, Math.PI * 2);
		c.fillStyle = ROBOT_COLORS.orange;
		c.fill();
	}
	c.restore();
	c.beginPath();
	if (c.roundRect) c.roundRect(x, y, size, size, 10);
	else c.rect(x, y, size, size);
	c.lineWidth = 2;
	c.strokeStyle = "rgba(16,22,30,0.85)";
	c.stroke();
	pill(c, x + 6, y + 6, "Wrist camera", "rgba(16,22,30,0.8)", "#ffffff");
}

/** The robot's live gripper (no network in between), as a dashed outline and its own drop line. */
export function drawLive(c, view, g, tol) {
	const zStem = GEO.toteZ + GEO.stemZ;
	c.save();
	c.setLineDash([4, 4]);
	c.lineWidth = 1.8;
	c.strokeStyle = COL.live;
	const [sx, sy, , ry] = ellipse(c, view, g.u, g.v, tol, zStem);
	c.stroke();
	const [tx, ty] = view.toScreen(g.u, g.v, GEO.toteZ + g.z);
	c.beginPath();
	c.moveTo(tx, ty);
	c.lineTo(sx, sy - ry);
	c.stroke();
	c.setLineDash([]);
	c.lineWidth = 2;
	c.beginPath();
	c.arc(tx, ty, 6, 0, Math.PI * 2);
	c.stroke();
	c.restore();
}

// ---------------------------------------------------------------------------------------------
// Video HUD

function pill(c, x, y, text, bg, fg, alignRight = false, dashed = false) {
	c.font = "600 12px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
	const w = Math.ceil(c.measureText(text).width) + 16;
	const h = 22;
	const left = alignRight ? x - w : x;
	c.beginPath();
	if (c.roundRect) c.roundRect(left, y, w, h, 11);
	else c.rect(left, y, w, h);
	c.fillStyle = bg;
	c.fill();
	if (dashed) {
		c.save();
		c.setLineDash([3, 3]);
		c.strokeStyle = fg;
		c.lineWidth = 1.5;
		c.stroke();
		c.restore();
	}
	c.fillStyle = fg;
	c.textBaseline = "middle";
	c.fillText(text, left + 8, y + h / 2 + 0.5);
	return w;
}

/**
 * info: { age (ms), stale, plateLeft (ms, as the frame shows it, or null between plates), insetW
 *         (width of the wrist inset at the bottom left, or 0),
 *         plateLabel, tripped (as the video shows it), cut, paused, pausedLabel, solved, live,
 *         liveTripped (the robot's watchdog right now, shown only with the live view) }
 * All words here are UI chrome.
 */
export function drawHud(c, w, h, info) {
	const pad = 8;
	pill(c, pad, pad, `Frame age ${Math.round(info.age)} ms`, "rgba(16,22,30,0.8)", "#ffffff");
	if (info.stale) pill(c, pad, pad + 28, "Stale frame", "#f2c230", "#1d2127");
	let ry = pad;
	const low = info.plateLeft !== null && info.plateLeft < 5000;
	for (const [on, text, bg, fg] of [
		[true, info.plateLabel, low ? "#f2c230" : "rgba(16,22,30,0.8)", low ? "#1d2127" : "#ffffff"],
		[info.tripped, "Watchdog stop", "#d23c2f", "#ffffff"],
		[info.cut, "Link cut", "rgba(16,22,30,0.85)", "#ffb4ab"],
		[info.solved, "Solved", "#1d7a4b", "#ffffff"],
	]) {
		if (!on) continue;
		pill(c, w - pad, ry, text, bg, fg, true);
		ry += 28;
	}
	if (info.live) {
		const lx = pad + (info.insetW ? info.insetW + 8 : 0);
		const lw = pill(c, lx, h - pad - 22, "Live robot view", "rgba(16,22,30,0.8)", COL.live, false, true);
		if (info.liveTripped) pill(c, lx + lw + 6, h - pad - 22, "Watchdog stop", "#d23c2f", "#ffffff", false, true);
	}
	if (info.paused) {
		c.fillStyle = "rgba(16,22,30,0.28)";
		c.fillRect(0, 0, w, h);
		// Low in the frame, so the tote and the bunches stay visible while paused.
		c.font = "700 16px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
		const tw = c.measureText(info.pausedLabel).width + 28;
		const cy = h - 48;
		const cx = info.insetW ? (info.insetW + 8 + w) / 2 : w / 2;
		c.beginPath();
		if (c.roundRect) c.roundRect(cx - tw / 2, cy - 18, tw, 36, 18);
		else c.rect(cx - tw / 2, cy - 18, tw, 36);
		c.fillStyle = "rgba(16,22,30,0.85)";
		c.fill();
		c.fillStyle = "#ffffff";
		c.textBaseline = "middle";
		c.textAlign = "center";
		c.fillText(info.pausedLabel, cx, cy + 1);
		c.textAlign = "start";
	}
}
