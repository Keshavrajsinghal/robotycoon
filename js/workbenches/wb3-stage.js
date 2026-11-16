// Control loop workbench (wb3-control): the little isometric stage. One wrist bend joint of the
// grape station's six-axis arm, seen from the side: the forearm comes in from the left, the joint
// housing turns about a horizontal axis pointing at the viewer, and the soft fingers (with a grape
// bunch when loaded) swing in the screen plane. A protractor behind the tool shows the commanded
// angle, the overshoot limit, and the peak. Drawing code only: every size here is a drawing size
// in stage units, not a model quantity.

import { FOOD } from "../engine/food.js";
import { depthOf, IsoRenderer, project } from "../engine/iso.js";
import { ROBOT_COLORS } from "../engine/robots.js";

const S2 = Math.SQRT1_2;
const DEG = Math.PI / 180;
const HW = 1; // wrist axis height
const LINK_END = 0.28; // wrist link, from the axis to the flange
const FLANGE = [0.28, 0.315];
const HUB = [0.315, 0.39];
const ARC_R = 0.9; // protractor radius
const ARC_C = -0.2; // protractor sits this far behind the swing plane
const BODY = "#f2f2ee"; // six-axis arm body color (as drawn by drawSixAxis)
const TEAL = "#2a9d8f"; // six-axis arm joint accent (as drawn by drawSixAxis)
const LINK = "#dfe2db"; // the wrist link, a shade darker so it reads against the protractor
const SAT = "#e8532f";
const TARGET = "#2e9e5b";
const LIMIT = "#d9483b";
const ARC = "#f2b632";

/** Size a canvas to its CSS box at the device pixel ratio and clear it. */
export function sizeCanvas(canvas) {
	const w = Math.max(1, canvas.clientWidth);
	const hgt = Math.max(1, canvas.clientHeight);
	const dpr = Math.min(2, window.devicePixelRatio || 1);
	const W = Math.round(w * dpr);
	const H = Math.round(hgt * dpr);
	if (canvas.width !== W) canvas.width = W;
	if (canvas.height !== H) canvas.height = H;
	const c = canvas.getContext("2d");
	c.setTransform(dpr, 0, 0, dpr, 0, 0);
	c.clearRect(0, 0, w, hgt);
	return { c, w, h: hgt };
}

// Stage axes: u runs to the screen's right, v toward the viewer, z up.
const world = (u, v, z) => [(u + v) * S2, (v - u) * S2, z];

/**
 * A point in the tool frame at angle th (radians, 0 = fingers hanging straight down, positive
 * swings to the right): a along the tool axis away from the joint, b across it in the swing
 * plane, c toward the viewer.
 */
function toolPt(th, a, b = 0, c = 0) {
	const s = Math.sin(th);
	const k = Math.cos(th);
	return world(a * s + b * k, c, HW - a * k + b * s);
}

/** A box in the tool frame from a0 to a1 along the tool axis, half-sizes hb (in plane), hc. */
function toolBox(r, th, a0, a1, hb, hc, color, opts) {
	const P = (a, b, c) => toolPt(th, a, b, c);
	const A = [P(a0, -hb, -hc), P(a0, hb, -hc), P(a0, hb, hc), P(a0, -hb, hc)];
	const B = [P(a1, -hb, -hc), P(a1, hb, -hc), P(a1, hb, hc), P(a1, -hb, hc)];
	const faces = [A, B];
	for (let i = 0; i < 4; i++) {
		const j = (i + 1) % 4;
		faces.push([A[i], A[j], B[j], B[i]]);
	}
	r.mesh(faces, color, { ...opts, center: P((a0 + a1) / 2, 0, 0) });
}

/** A round disc or short cylinder on the tool axis (built in the tool frame, so it never pops). */
function toolDisc(r, th, a0, a1, rad, color, opts, seg = 12) {
	const ring = (a) => Array.from({ length: seg }, (_, i) => toolPt(th, a, Math.cos((i / seg) * Math.PI * 2) * rad, Math.sin((i / seg) * Math.PI * 2) * rad));
	const A = ring(a0);
	const B = ring(a1);
	const faces = [[...A].reverse(), B];
	for (let i = 0; i < seg; i++) {
		const j = (i + 1) % seg;
		faces.push([A[i], A[j], B[j], B[i]]);
	}
	r.mesh(faces, color, { ...opts, center: toolPt(th, (a0 + a1) / 2) });
}

function drawFinger(r, th, phi, open, loaded, opts) {
	const cb = Math.cos(phi);
	const cc = Math.sin(phi);
	const at = (a, rad) => toolPt(th, a, cb * rad, cc * rad);
	const root = at(HUB[1] - 0.01, 0.06);
	const mid = at(0.49, loaded ? 0.115 : 0.09 + open * 0.03);
	const tip = at(0.6, loaded ? 0.075 : 0.035 + open * 0.03);
	r.tube(root, mid, 0.026, ROBOT_COLORS.orange, 6, opts);
	r.tube(mid, tip, 0.022, ROBOT_COLORS.orange, 6, opts);
}

function drawBunch(r, th) {
	r.line(toolPt(th, HUB[1] - 0.01), toolPt(th, 0.46, 0.008), FOOD.stem, 2.4);
	const rows = [
		[0.47, 0.05, 5],
		[0.52, 0.07, 7],
		[0.575, 0.068, 7],
		[0.63, 0.058, 6],
		[0.685, 0.042, 5],
		[0.735, 0.022, 3],
		[0.775, 0, 1],
	];
	const balls = [];
	rows.forEach(([a, rad, n], row) => {
		for (let i = 0; i < n; i++) {
			const ang = (i / n) * Math.PI * 2 + row * 0.7;
			balls.push({ p: toolPt(th, a, Math.cos(ang) * rad, Math.sin(ang) * rad), k: i + row });
		}
	});
	balls.sort((x, y) => depthOf(x.p[0], x.p[1], x.p[2]) - depthOf(y.p[0], y.p[1], y.p[2]));
	for (const b of balls) r.sphere(b.p[0], b.p[1], b.p[2], 0.038, b.k % 3 ? FOOD.grape : FOOD.grape2, 0);
}

/** The moving part of the joint: wrist link, flange, finger hub, fingers, and the bunch. */
function drawTool(r, th, loaded, alpha) {
	const opts = alpha === undefined ? {} : { alpha };
	toolBox(r, th, -0.02, LINK_END, 0.08, 0.085, LINK, { ...opts, edge: "rgba(40,50,60,0.25)" });
	toolDisc(r, th, FLANGE[0], FLANGE[1], 0.1, ROBOT_COLORS.metal, opts);
	toolDisc(r, th, HUB[0], HUB[1], 0.08, ROBOT_COLORS.joint, opts);
	// One finger faces the viewer, two sit behind the bunch.
	const fingers = [0, 1, 2].map((i) => Math.PI / 2 + (i * 2 * Math.PI) / 3);
	const back = fingers.filter((p) => Math.sin(p) < 0);
	const front = fingers.filter((p) => Math.sin(p) >= 0);
	for (const p of back) drawFinger(r, th, p, 0.6, loaded, opts);
	if (loaded && alpha === undefined) drawBunch(r, th);
	for (const p of front) drawFinger(r, th, p, 0.6, loaded, opts);
}

function drawForearm(r) {
	r.beam(world(-1.8, 0, HW), world(-0.05, 0, HW), 0.2, 0.2, BODY);
	r.tube(world(-0.52, 0, HW), world(-0.47, 0, HW), 0.13, TEAL, 12);
}

function drawHousing(r, th, saturated, color) {
	r.tube(world(0, -0.14, HW), world(0, 0.12, HW), 0.14, ROBOT_COLORS.joint, 14);
	r.tube(world(0, 0.12, HW), world(0, 0.155, HW), 0.11, saturated ? SAT : color, 14);
	// A mark on the cap turns with the joint.
	r.line(world(0, 0.157, HW), toolPt(th, 0.085, 0, 0.157), "#ffffff", 1.1);
}

function drawProtractor(r, view, zoom) {
	const { targetDeg, limitDeg, peakDeg } = view;
	const t = targetDeg * DEG;
	const lo = Math.min(0, t);
	const hi = Math.max(0, t);
	const arc = [];
	for (let i = 0; i <= 32; i++) arc.push(toolPt(lo + ((hi - lo) * i) / 32, ARC_R, 0, ARC_C));
	r.quad([toolPt(0, 0, 0, ARC_C), ...arc], ARC, { alpha: 0.16, flat: true });
	r.polyline(arc, ARC, 1.3);
	r.line(toolPt(0, 0.22, 0, ARC_C), toolPt(0, ARC_R + 0.08, 0, ARC_C), "#8e99a6", 0.8);
	r.line(toolPt(t, 0.22, 0, ARC_C), toolPt(t, ARC_R + 0.06, 0, ARC_C), TARGET, 1.2);
	const l = limitDeg * DEG;
	r.line(toolPt(l, ARC_R + 0.06, 0, ARC_C), toolPt(l, ARC_R + 0.2, 0, ARC_C), LIMIT, 1.5);
	if (Number.isFinite(peakDeg) && Math.abs(peakDeg) > Math.abs(targetDeg) * 1.002) {
		const p = toolPt(peakDeg * DEG, ARC_R + 0.04, 0, ARC_C);
		const over = Math.abs(peakDeg) > Math.abs(limitDeg);
		r.billboard(p[0], p[1], p[2], (cx) => {
			cx.beginPath();
			cx.arc(0, 0, Math.max(3, 1.5 * zoom), 0, Math.PI * 2);
			cx.fillStyle = over ? LIMIT : view.color;
			cx.fill();
		});
	}
}

/** Fit the stage to the canvas: the swing range and the joint, with the forearm free to run off. */
function fit(w, hgt, view) {
	const t = view.targetDeg * DEG;
	const lo = Math.min(0, t, view.limitDeg * DEG) - 0.12;
	const hi = Math.max(0, t, view.limitDeg * DEG) + 0.12;
	const pts = [world(-0.36, 0, HW + 0.15), world(0, -0.16, HW + 0.16), world(0, 0.17, HW - 0.16)];
	for (let i = 0; i <= 12; i++) {
		const th = lo + ((hi - lo) * i) / 12;
		pts.push(toolPt(th, 0.82, 0.08, 0.08), toolPt(th, 0.82, -0.08, -0.08), toolPt(th, ARC_R + 0.2, 0, ARC_C));
	}
	let x0 = Infinity;
	let x1 = -Infinity;
	let y0 = Infinity;
	let y1 = -Infinity;
	for (const p of pts) {
		const [px, py] = project(p[0], p[1], p[2]);
		x0 = Math.min(x0, px);
		x1 = Math.max(x1, px);
		y0 = Math.min(y0, py);
		y1 = Math.max(y1, py);
	}
	const m = 10;
	const zoom = Math.min((w - 2 * m) / (x1 - x0), (hgt - 2 * m - 18) / (y1 - y0));
	return { zoom, ox: w / 2 - ((x0 + x1) / 2) * zoom, oy: (hgt - 18) / 2 - ((y0 + y1) / 2) * zoom };
}

/**
 * Draw the stage. view: { angleDeg, targetDeg, limitDeg, peakDeg, ghostDeg, loaded, saturated,
 * color }. ghostDeg (NaN for none) draws a faint second tool, used to show the peak when motion is
 * reduced.
 */
export function drawStage(canvas, view) {
	const { c, w, h: hgt } = sizeCanvas(canvas);
	const r = new IsoRenderer(c);
	const f = fit(w, hgt, view);
	r.setTransform(f.zoom, f.ox, f.oy);
	drawProtractor(r, view, f.zoom);
	if (Number.isFinite(view.ghostDeg)) drawTool(r, view.ghostDeg * DEG, view.loaded, 0.3);
	drawForearm(r);
	drawTool(r, view.angleDeg * DEG, view.loaded);
	drawHousing(r, view.angleDeg * DEG, view.saturated, view.color);
}
