// Ride 3 shared parts: delay math from content, the picture the wrist camera sees, and small
// low-poly props (tangled bunches, packets, frames, SpaceMouse, wrist camera) used by the world,
// the cargo, and the close-ups. Drawing code only: every number shown comes from content delays.

import { depthOf } from "../engine/iso.js";
import { drawGrapes, drawHangingBunch, FOOD } from "../engine/food.js";

export const R3 = {
	ride: "#1f9e8f",
	packet: ["#f2a541", "#4fb3bf", "#e86a5c", "#7bc96f", "#b07fd6"],
	alert: "#f2a541",
	red: "#e2483d",
	green: "#43c46b",
	screen: "#14222f",
	bezel: "#2b3440",
	cable: "#2f3640",
	water: "#4fa3d6",
	deck: "#c9b48a",
	stone: "#a9a196",
};

// ---------------------------------------------------------------------------
// Delays (all numbers come from content: stop.delay.mid)

/**
 * The delay model for the ride: per-stop midpoints, the whole-ride total, the index of the
 * current stop, and the running total up to and including it (as the panel's delay box counts).
 */
export function delayModel(stops, currentId) {
	const mids = stops.map((s) => (s.delay ? s.delay.mid : 0));
	const total = mids.reduce((a, b) => a + b, 0);
	const idx = currentId ? stops.findIndex((s) => s.id === currentId) : -1;
	let running = 0;
	for (let i = 0; i <= idx; i++) running += mids[i];
	return { stops, mids, total, idx, running };
}

export const fmtMs = (n) => `${Math.round(n).toLocaleString("en-US")} ms`;

export const TOTE_BLUE = "#2f6fb3";

// ---------------------------------------------------------------------------
// The camera picture: what the wrist camera sees, looking down past the soft fingers at the
// held bunch, the second bunch knotted to it, and the tote below. u, v in [0, 1], v down.

const inEllipse = (u, v, cx, cy, rx, ry) => ((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2 < 1;
const grapeTone = (u, v, n = 40) => ((Math.floor(u * n) + Math.floor(v * n)) % 3 ? FOOD.grape : FOOD.grape2);

function picColor(u, v) {
	// Three soft fingers converging from the top onto the stem.
	for (const [x0, x1] of [
		[0.36, 0.47],
		[0.64, 0.53],
	]) {
		const x = x0 + (x1 - x0) * Math.min(1, v / 0.24);
		if (v < 0.25 && Math.abs(u - x) < 0.035) return "#e8792f";
	}
	if (v < 0.2 && Math.abs(u - 0.5) < 0.03) return "#e8792f";
	if (v < 0.06 && Math.abs(u - 0.5) < 0.16) return "#3b4552";
	// The held bunch, half out of the grip, and the second bunch knotted under it.
	if (inEllipse(u, v, 0.47, 0.42, 0.12, 0.16)) return grapeTone(u, v);
	if (Math.abs(v - (0.5 + (u - 0.52) * 0.6)) < 0.018 && u > 0.5 && u < 0.62) return FOOD.stem;
	if (inEllipse(u, v, 0.62, 0.68, 0.11, 0.14)) return (Math.floor(u * 36) + Math.floor(v * 36)) % 3 ? FOOD.grape2 : FOOD.grape;
	if (u > 0.485 && u < 0.515 && v > 0.22 && v < 0.29) return FOOD.stem;
	// Other bunches lying in the tote, out of focus.
	for (const [cx, cy, rx, ry] of [
		[0.15, 0.72, 0.09, 0.07],
		[0.2, 0.26, 0.08, 0.1],
		[0.86, 0.32, 0.08, 0.07],
		[0.84, 0.86, 0.09, 0.06],
	])
		if (inEllipse(u, v, cx, cy, rx, ry)) return grapeTone(u, v, 18);
	// Tote rim and floor.
	if (u < 0.04 || u > 0.96 || v > 0.94) return "#3f82c8";
	return (Math.floor(u * 7) + Math.floor(v * 5)) % 2 ? "#24578f" : "#285f99";
}

/**
 * Draw the camera picture into a 2D context at (x, y) with size (w, h).
 * opts: { cols, rows } pixel grid; { blocks: [c, r] } average-color blocks with visible block
 * edges (a compressed frame); { missing: [[c, r], ...] } cells of the block grid left grey;
 * { smooth: true } draws at a fine grid without seams.
 */
export function drawPicture(c, x, y, w, h, opts = {}) {
	const cols = opts.cols ?? 32;
	const rows = opts.rows ?? 18;
	const cw = w / cols;
	const ch = h / rows;
	c.save();
	for (let j = 0; j < rows; j++)
		for (let i = 0; i < cols; i++) {
			c.fillStyle = picColor((i + 0.5) / cols, (j + 0.5) / rows);
			// Overdraw by a hair so the grid has no seams.
			c.fillRect(x + i * cw, y + j * ch, cw + 0.6, ch + 0.6);
		}
	if (opts.blocks) {
		const [bc, br] = opts.blocks;
		const bw = w / bc;
		const bh = h / br;
		for (let j = 0; j < br; j++)
			for (let i = 0; i < bc; i++) {
				const miss = opts.missing?.some(([mi, mj]) => mi === i && mj === j);
				c.fillStyle = miss ? "#7d858f" : picColor((i + 0.5) / bc, (j + 0.5) / br);
				c.globalAlpha = miss ? 1 : 0.62;
				c.fillRect(x + i * bw, y + j * bh, bw + 0.4, bh + 0.4);
			}
		c.globalAlpha = 1;
		c.strokeStyle = "rgba(20,30,40,0.35)";
		c.lineWidth = opts.lw ?? Math.max(0.5, Math.min(1.2, w / 120));
		c.beginPath();
		for (let i = 1; i < bc; i++) {
			c.moveTo(x + i * bw, y);
			c.lineTo(x + i * bw, y + h);
		}
		for (let j = 1; j < br; j++) {
			c.moveTo(x, y + j * bh);
			c.lineTo(x + w, y + j * bh);
		}
		c.stroke();
	} else if (opts.missing) {
		c.fillStyle = "#7d858f";
		for (const [mi, mj] of opts.missing) c.fillRect(x + mi * cw, y + mj * ch, cw, ch);
	}
	c.restore();
}

// ---------------------------------------------------------------------------
// 3D props

/** A grape bunch hanging from its stem (shared with ride 2 through engine/food.js). */
export const hangingBunch = drawHangingBunch;

/** Local frame on a surface: f along heading, sd to its left, zz up, all scaled by s. */
function frameAt(cx, cy, z, heading, s = 1) {
	const ca = Math.cos(heading);
	const sa = Math.sin(heading);
	return (f, sd, zz = 0) => [cx + (f * ca - sd * sa) * s, cy + (f * sa + sd * ca) * s, z + zz * s];
}

/** Grape bunches lying at assorted angles; spots are [x, y, heading]. Drawn back to front. */
export function lyingBunches(r, spots, z, s = 1) {
	const sorted = [...spots].sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
	for (const [x, y, hd] of sorted) drawGrapes(r, frameAt(x, y, z, hd, s), s);
}

/** Length of a hanging bunch below its stem point, per unit of scale (see drawHangingBunch). */
export const BUNCH_LEN = 0.34;

/** Where the knotted second bunch hangs from (see tangledBunches), and its tilt. */
export function knotPoint(x, y, z, swing, s = 1, sep = 0) {
	const L = BUNCH_LEN * s;
	const tail = [x + Math.sin(swing) * L * 0.82, y + 0.04 * s, z - Math.cos(swing) * L * 0.82];
	const second = [tail[0] - sep * 0.18 * s, tail[1] + 0.05 * s + sep * 0.1 * s, tail[2] + 0.02 * s - sep * 0.06 * s];
	return { tail, second, swing2: -swing * 0.7 - 0.25, scale: s * 0.92 };
}

/**
 * A bunch held by its stem at (x, y, z), tilted by swing, with a second bunch knotted to its
 * lower end. sep (0..1) eases the second bunch away: at 1 the knot is undone and the caller
 * draws it elsewhere. Returns the second bunch's stem point.
 */
export function tangledBunches(r, x, y, z, swing, s = 1, sep = 0) {
	const { tail, second, swing2 } = knotPoint(x, y, z, swing, s, sep);
	const L = BUNCH_LEN * s;
	const items = [
		{ d: depthOf(x, y, z - L / 2), draw: () => drawHangingBunch(r, x, y, z, swing, s) },
		{ d: depthOf(second[0], second[1], second[2] - L / 2), draw: () => drawHangingBunch(r, second[0], second[1], second[2], swing2, s * 0.92) },
	];
	items.sort((a, b) => a.d - b.d);
	for (const it of items) it.draw();
	// The knot: two stems wound round each other between the bunches.
	if (sep < 0.85) {
		const mid = [(tail[0] + second[0]) / 2 + 0.03 * s, (tail[1] + second[1]) / 2, (tail[2] + second[2]) / 2 + 0.03 * s];
		r.line(tail, mid, FOOD.stem, 2.4 * s);
		r.line(mid, second, FOOD.stem, 2.4 * s);
	}
	return second;
}

/**
 * The wrist camera: a small dark box clamped to the side of the arm's wrist, lens pointing down.
 * pose is drawSixAxis's return value. Returns the lens point.
 */
export function wristCamera(r, pose, s = 1) {
	const [sx, sy] = pose.shoulder;
	const [wx, wy, wz] = pose.wrist;
	const yaw = Math.atan2(wy - sy, wx - sx);
	const side = [-Math.sin(yaw), Math.cos(yaw)];
	const c = [wx + side[0] * 0.13 * s, wy + side[1] * 0.13 * s, wz - 0.07 * s];
	r.orientedBox(c[0], c[1], c[2], 0.13 * s, 0.09 * s, 0.09 * s, yaw, "#2b3440");
	const lens = [c[0], c[1], c[2] - 0.01 * s];
	r.cylinder(lens[0], lens[1], lens[2] - 0.035 * s, 0.03 * s, 0.035 * s, "#111418", 8);
	r.sphere(lens[0], lens[1], lens[2] - 0.04 * s, 0.022 * s, "#6ec6ff", 0);
	return [lens[0], lens[1], lens[2] - 0.05 * s];
}

/**
 * A SpaceMouse on a desk: a dark base and a round cap the hand pushes. (x, y, z) is the base
 * center; push 0..1 moves the cap toward dir (radians) and tips it. Returns the cap top.
 */
export function spaceMouse(r, x, y, z, s = 1, push = 0, dir = 0) {
	r.cylinder(x, y, z, 0.11 * s, 0.035 * s, "#2b3440", 12);
	r.cylinder(x, y, z + 0.035 * s, 0.085 * s, 0.012 * s, "#111418", 12);
	const off = push * 0.018 * s;
	const cx = x + Math.cos(dir) * off;
	const cy = y + Math.sin(dir) * off;
	r.cylinder(cx, cy, z + 0.047 * s, 0.07 * s, 0.045 * s, "#9aa5b1", 12);
	r.cylinder(cx, cy, z + 0.092 * s, 0.06 * s, 0.006 * s, "#c3cad3", 12);
	return [cx, cy, z + 0.1 * s];
}

/** The enable button the operator keeps held: a small box with a green cap. */
export function enableButton(r, x, y, z, s = 1, held = true) {
	r.box(x - 0.05 * s, y - 0.04 * s, z, 0.1 * s, 0.08 * s, 0.035 * s, "#2b3440");
	r.cylinder(x, y, z + 0.035 * s, 0.025 * s, held ? 0.008 * s : 0.02 * s, held ? "#43c46b" : "#2f6b44", 8);
}

/** A data packet: a small box with a light band on top. */
export function packetBox(r, x, y, z, size, color, opts = {}) {
	const h = size * 0.62;
	r.box(x - size / 2, y - size / 2, z, size, size, h, color, { alpha: opts.alpha });
	r.box(x - size / 2, y - size * 0.1, z + h, size, size * 0.2, size * 0.02, "#ffffff", { alpha: opts.alpha });
}

/** An empty packet slot: a dashed outline on a surface. */
export function packetSlot(r, x, y, z, size) {
	const s = size / 2;
	const pts = [
		[x - s, y - s, z],
		[x + s, y - s, z],
		[x + s, y + s, z],
		[x - s, y + s, z],
	];
	const c = r.ctx;
	c.save();
	c.setLineDash([3 * r.zoom, 2.5 * r.zoom]);
	r.polyline(pts, "rgba(226,72,61,0.95)", 1.6, true);
	c.restore();
}

/** Small stand of two posts and a foot, for frames and screens drawn as billboards. */
export function stand(r, x, y, z, h, color = "#5b6472") {
	r.box(x - 0.16, y - 0.12, z, 0.32, 0.24, 0.04, color);
	r.box(x - 0.03, y - 0.03, z + 0.04, 0.06, 0.06, h, color);
}

/**
 * A framed picture drawn as a billboard centered at a world point. w, h are CSS px at zoom 1;
 * opts as drawPicture plus { screen: true } for a dark monitor bezel.
 */
export function framedPicture(r, x, y, z, w, h, opts = {}) {
	r.billboard(x, y, z, (c, zoom) => {
		const k = Math.max(0.55, zoom);
		const W = w * k;
		const H = h * k;
		const pad = (opts.screen ? 3.2 : 2.2) * k;
		c.fillStyle = opts.screen ? R3.bezel : "#ffffff";
		c.strokeStyle = "rgba(20,30,40,0.55)";
		c.lineWidth = Math.max(0.6, 0.8 * k);
		roundRect(c, -W / 2 - pad, -H - pad * 2, W + pad * 2, H + pad * 2, 2.5 * k);
		c.fill();
		c.stroke();
		drawPicture(c, -W / 2, -H - pad, W, H, opts);
	});
}

export function roundRect(c, x, y, w, h, rad) {
	const rr = Math.min(rad, w / 2, h / 2);
	c.beginPath();
	c.moveTo(x + rr, y);
	c.arcTo(x + w, y, x + w, y + h, rr);
	c.arcTo(x + w, y + h, x, y + h, rr);
	c.arcTo(x, y + h, x, y, rr);
	c.arcTo(x, y, x + w, y, rr);
	c.closePath();
}

/**
 * An alert ticket (no words): an amber header with a warning triangle, one still image of the
 * tangled bunches, and a question mark for the narrow question. (cx, by) is its bottom center.
 */
export function drawTicket(c, cx, by, w, h, k = 1) {
	c.save();
	c.translate(cx, by);
	c.rotate(-0.06);
	c.fillStyle = "#fffdf6";
	c.strokeStyle = "rgba(20,30,40,0.5)";
	c.lineWidth = Math.max(0.6, 0.9 * k);
	roundRect(c, -w / 2, -h, w, h, 2.5 * k);
	c.fill();
	c.stroke();
	const head = h * 0.2;
	c.fillStyle = R3.alert;
	c.fillRect(-w / 2 + 0.5, -h + 0.5, w - 1, head);
	warnTriangle(c, -w / 2 + head * 0.75, -h + head * 0.55, head * 0.72, "#fff3d6");
	const pad = w * 0.09;
	const pw = w - pad * 2;
	const ph = Math.min(h * 0.44, pw * 0.62);
	const py = -h + head + pad * 0.7;
	drawPicture(c, -w / 2 + pad, py, pw, ph, { cols: 20, rows: 12 });
	c.strokeStyle = "rgba(20,30,40,0.35)";
	c.lineWidth = Math.max(0.5, 0.6 * k);
	c.strokeRect(-w / 2 + pad, py, pw, ph);
	const qy = py + ph + (h - head - pad * 0.7 - ph) * 0.48;
	questionMark(c, -w * 0.22, qy, Math.min(h * 0.2, w * 0.26), R3.ride);
	c.fillStyle = "#b9bec6";
	const lh = Math.max(1, h * 0.045);
	c.fillRect(-w * 0.04, qy - lh * 2.2, w * 0.34, lh);
	c.fillRect(-w * 0.04, qy + lh * 0.6, w * 0.22, lh);
	c.restore();
}

/** A question mark drawn as a path (no text), centered at (x, y), height s. */
function questionMark(c, x, y, s, color = "#1d2127") {
	c.save();
	c.translate(x, y);
	c.strokeStyle = color;
	c.fillStyle = color;
	c.lineWidth = Math.max(1, s * 0.16);
	c.lineCap = "round";
	c.beginPath();
	c.arc(0, -s * 0.2, s * 0.22, Math.PI * 1.05, Math.PI * 2.35);
	c.quadraticCurveTo(0, -s * 0.02, 0, s * 0.14);
	c.stroke();
	c.beginPath();
	c.arc(0, s * 0.36, s * 0.09, 0, Math.PI * 2);
	c.fill();
	c.restore();
}

/** A warning triangle with an exclamation mark, centered at (x, y), height s. */
export function warnTriangle(c, x, y, s, fill = R3.alert) {
	c.save();
	c.translate(x, y);
	c.beginPath();
	c.moveTo(0, -s / 2);
	c.lineTo(s * 0.58, s / 2);
	c.lineTo(-s * 0.58, s / 2);
	c.closePath();
	c.fillStyle = fill;
	c.fill();
	c.strokeStyle = "#7a4a00";
	c.lineWidth = Math.max(0.6, s * 0.06);
	c.lineJoin = "round";
	c.stroke();
	c.fillStyle = "#3b2a00";
	c.fillRect(-s * 0.05, -s * 0.18, s * 0.1, s * 0.4);
	c.fillRect(-s * 0.05, s * 0.28, s * 0.1, s * 0.1);
	c.restore();
}

/** A motion arrow (no words) pointing up the screen, centered at (x, y), length s. */
export function upArrow(c, x, y, s, color = "#ffe066") {
	c.save();
	c.translate(x, y);
	c.fillStyle = color;
	c.strokeStyle = "rgba(20,30,40,0.6)";
	c.lineWidth = Math.max(0.5, s * 0.04);
	c.beginPath();
	c.moveTo(0, -s / 2);
	c.lineTo(s * 0.32, -s * 0.12);
	c.lineTo(s * 0.12, -s * 0.12);
	c.lineTo(s * 0.12, s / 2);
	c.lineTo(-s * 0.12, s / 2);
	c.lineTo(-s * 0.12, -s * 0.12);
	c.lineTo(-s * 0.32, -s * 0.12);
	c.closePath();
	c.fill();
	c.stroke();
	c.restore();
}
