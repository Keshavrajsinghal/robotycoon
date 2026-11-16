// Ride 3 close-ups: one small illustration per stop at the top of the stop panel, plus a latency
// bar for the whole ride with each stop's segment sized by its delay midpoint from content. The
// illustrations have no words; the bar shows only numbers formatted from content delays and two
// status words about the meter itself.

import { h } from "../core/dom.js";
import { FOOD } from "../engine/food.js";
import { delayModel, drawPicture, drawTicket, fmtMs, R3, roundRect, TOTE_BLUE, upArrow, warnTriangle } from "./ride3-parts.js";

const INK = "#1d2127";
const PACKET_ORDER = R3.packet;
const ARM = { body: "#f2f2ee", accent: "#2a9d8f", joint: "#3b4552", finger: "#e8792f" };

// ---------------------------------------------------------------------------
// 2D parts (side views)

function belt(c, x0, x1, y, s) {
	c.fillStyle = "#8e98a4";
	c.fillRect(x0, y, x1 - x0, 6 * s);
	c.fillStyle = "#3a3f47";
	c.fillRect(x0, y - 3 * s, x1 - x0, 4 * s);
	c.fillStyle = "#5b6472";
	for (let x = x0 + 8 * s; x < x1; x += 18 * s) {
		c.beginPath();
		c.arc(x, y + 3 * s, 2 * s, 0, Math.PI * 2);
		c.fill();
	}
	c.fillStyle = "#3b4048";
	for (const x of [x0 + 6 * s, x1 - 10 * s]) c.fillRect(x, y + 6 * s, 4 * s, 26 * s);
}

function tray(c, cx, y, w, s) {
	c.fillStyle = FOOD.tray;
	c.beginPath();
	c.moveTo(cx - w / 2, y - 7 * s);
	c.lineTo(cx + w / 2, y - 7 * s);
	c.lineTo(cx + w / 2 - 4 * s, y);
	c.lineTo(cx - w / 2 + 4 * s, y);
	c.closePath();
	c.fill();
	c.strokeStyle = "rgba(90,60,30,0.45)";
	c.lineWidth = 1;
	c.stroke();
}

/** A tote seen from the side: blue box with bunches lying in it. (x, y) bottom-left. */
function tote(c, x, y, w, hh, s) {
	c.fillStyle = "#24578f";
	c.fillRect(x + 3 * s, y - hh, w - 6 * s, hh * 0.4);
	for (let i = 0; i < 4; i++) lyingBunch(c, x + w * (0.18 + i * 0.22), y - hh * 0.62 - (i % 2) * 2 * s, s * 0.7, i % 2 ? 0.5 : -0.4);
	c.fillStyle = TOTE_BLUE;
	roundRect(c, x, y - hh * 0.62, w, hh * 0.62, 3 * s);
	c.fill();
	c.fillStyle = "#3f82c8";
	c.fillRect(x, y - hh * 0.62, w, 3 * s);
}

/** A grape bunch lying on its side, centered at (x, y). */
function lyingBunch(c, x, y, s, rot = 0) {
	c.save();
	c.translate(x, y);
	c.rotate(rot);
	for (let i = 0; i < 7; i++) {
		const bx = (i - 3) * 4 * s;
		const by = (i % 2 ? -2.5 : 1.5) * s - Math.max(0, 3 - Math.abs(i - 3)) * 0.8 * s;
		c.beginPath();
		c.arc(bx, by, 3.6 * s, 0, Math.PI * 2);
		c.fillStyle = i % 3 ? FOOD.grape : FOOD.grape2;
		c.fill();
	}
	c.restore();
}

/** A grape bunch hanging from its stem at (x, y), tilted by tilt radians. */
function bunch(c, x, y, s, tilt = 0) {
	c.save();
	c.translate(x, y);
	c.rotate(tilt);
	c.strokeStyle = FOOD.stem;
	c.lineWidth = 2.4 * s;
	c.lineCap = "round";
	c.beginPath();
	c.moveTo(0, -4 * s);
	c.lineTo(0, 6 * s);
	c.stroke();
	const rows = [4, 4, 3, 3, 2, 1];
	rows.forEach((n, row) => {
		for (let i = 0; i < n; i++) {
			const bx = (i - (n - 1) / 2) * 7.2 * s + (row % 2 ? 1.5 * s : 0);
			const by = 10 * s + row * 6.4 * s;
			c.beginPath();
			c.arc(bx, by, 4.3 * s, 0, Math.PI * 2);
			c.fillStyle = (i + row) % 3 ? FOOD.grape : FOOD.grape2;
			c.fill();
			c.fillStyle = "rgba(255,255,255,0.28)";
			c.beginPath();
			c.arc(bx - 1.4 * s, by - 1.4 * s, 1.2 * s, 0, Math.PI * 2);
			c.fill();
		}
	});
	c.restore();
}

/** The held bunch, half out of the grip, with a second bunch knotted to its lower end. */
function tangle(c, x, y, s, tilt = 0.55) {
	const L = 44 * s;
	const tx = x + Math.sin(-tilt) * -L;
	const ty = y + Math.cos(tilt) * L;
	bunch(c, tx - 6 * s, ty - 4 * s, s * 0.95, -0.35);
	bunch(c, x, y, s, tilt);
	c.strokeStyle = FOOD.stem;
	c.lineWidth = 2.2 * s;
	c.lineCap = "round";
	c.beginPath();
	c.moveTo(tx - 10 * s, ty - 10 * s);
	c.bezierCurveTo(tx + 4 * s, ty - 14 * s, tx - 14 * s, ty - 2 * s, tx - 4 * s, ty - 6 * s);
	c.stroke();
}

/**
 * Soft fingers in side view: a hub and three curved silicone fingers whose tips meet at (x, y)
 * when closed (open 0) and spread when open (1). The middle finger is the far one.
 */
function softFingers(c, x, y, s, open = 0) {
	const hubY = y - 20 * s;
	const finger = (dx, spread, color) => {
		const tipX = x + dx * (1.5 + open * 7) * s;
		const midX = x + dx * (8 + open * 5) * s;
		c.strokeStyle = color;
		c.lineWidth = 4.6 * s;
		c.lineCap = "round";
		c.beginPath();
		c.moveTo(x + dx * 4.5 * s, hubY + 2 * s);
		c.quadraticCurveTo(midX + dx * spread * s, y - 9 * s, tipX, y);
		c.stroke();
		// Air-channel ribs.
		c.strokeStyle = "rgba(255,255,255,0.35)";
		c.lineWidth = 1;
		for (const k of [0.35, 0.6]) {
			const px = x + dx * 4.5 * s + (tipX - x - dx * 4.5 * s) * k + dx * 2.2 * s;
			const py = hubY + 2 * s + (y - hubY - 2 * s) * k;
			c.beginPath();
			c.moveTo(px - 2 * s, py);
			c.lineTo(px + 2 * s, py);
			c.stroke();
		}
	};
	finger(0.2, 0, "#c25f1f");
	finger(-1, 2, ARM.finger);
	finger(1, 2, ARM.finger);
	c.fillStyle = ARM.joint;
	roundRect(c, x - 9 * s, hubY - 5 * s, 18 * s, 8 * s, 2 * s);
	c.fill();
}

/**
 * The six-axis arm's forearm coming in from one side to a wrist above (x, y), a short tool
 * flange, and soft fingers with their tips at (x, y). opts: { from: -1 left | 1 right, open,
 * cam: draw the wrist camera, flash 0..1, len }. Returns the camera lens point.
 */
function armWrist(c, x, y, s, opts = {}) {
	const from = opts.from ?? -1;
	const len = (opts.len ?? 70) * s;
	const wx = x;
	const wy = y - 40 * s;
	const ex = wx + from * len;
	const ey = wy - len * 0.55;
	c.lineCap = "round";
	c.strokeStyle = "rgba(20,30,40,0.25)";
	c.lineWidth = 17 * s;
	c.beginPath();
	c.moveTo(ex, ey);
	c.lineTo(wx, wy);
	c.stroke();
	c.strokeStyle = ARM.body;
	c.lineWidth = 14 * s;
	c.stroke();
	c.fillStyle = ARM.accent;
	c.beginPath();
	c.arc(ex, ey, 11 * s, 0, Math.PI * 2);
	c.fill();
	c.fillStyle = ARM.joint;
	c.beginPath();
	c.arc(wx, wy, 8 * s, 0, Math.PI * 2);
	c.fill();
	c.fillStyle = "#b8c0ca";
	c.fillRect(wx - 3 * s, wy, 6 * s, 16 * s);
	softFingers(c, x, y, s, opts.open ?? 0);
	if (!opts.cam) return null;
	// The wrist camera, clamped beside the wrist and looking down.
	const cx = wx - from * 14 * s;
	const cy = wy + 2 * s;
	c.fillStyle = "#2b3440";
	roundRect(c, cx - 7 * s, cy - 5 * s, 14 * s, 11 * s, 2 * s);
	c.fill();
	c.fillStyle = "#6ec6ff";
	c.beginPath();
	c.arc(cx, cy + 6 * s, 3 * s, 0, Math.PI * 2);
	c.fill();
	const lens = [cx, cy + 7 * s];
	if (opts.flash) {
		const g = c.createRadialGradient(lens[0], lens[1], 0, lens[0], lens[1], 22 * s);
		g.addColorStop(0, `rgba(255,255,255,${0.95 * opts.flash})`);
		g.addColorStop(1, "rgba(255,255,255,0)");
		c.fillStyle = g;
		c.beginPath();
		c.arc(lens[0], lens[1], 22 * s, 0, Math.PI * 2);
		c.fill();
	}
	return lens;
}

function packet(c, x, y, s, color, opts = {}) {
	const w = 16 * s;
	c.save();
	if (opts.alpha !== undefined) c.globalAlpha = opts.alpha;
	if (opts.missing) {
		c.setLineDash([3 * s, 2.5 * s]);
		c.strokeStyle = R3.red;
		c.lineWidth = 1.6;
		roundRect(c, x - w / 2, y - w / 2, w, w, 3 * s);
		c.stroke();
		c.restore();
		return;
	}
	if (opts.glow) {
		const g = c.createRadialGradient(x, y, 0, x, y, w * 1.4);
		g.addColorStop(0, "rgba(255,230,120,0.7)");
		g.addColorStop(1, "rgba(255,230,120,0)");
		c.fillStyle = g;
		c.beginPath();
		c.arc(x, y, w * 1.4, 0, Math.PI * 2);
		c.fill();
	}
	c.fillStyle = color;
	c.strokeStyle = "rgba(20,30,40,0.45)";
	c.lineWidth = 1;
	roundRect(c, x - w / 2, y - w / 2, w, w, 3 * s);
	c.fill();
	c.stroke();
	c.fillStyle = "rgba(255,255,255,0.85)";
	c.fillRect(x - w / 2 + 1, y - 2 * s, w - 2, 3 * s);
	c.restore();
}

/** The plant's LTE mast: a lattice tower with three flat cellular panels at the top. */
function lteMast(c, x, y, s) {
	c.strokeStyle = "#7f8b98";
	c.lineWidth = 2 * s;
	c.beginPath();
	c.moveTo(x - 9 * s, y);
	c.lineTo(x - 2 * s, y - 52 * s);
	c.moveTo(x + 9 * s, y);
	c.lineTo(x + 2 * s, y - 52 * s);
	for (let k = 0; k < 4; k++) {
		const y0 = y - k * 13 * s;
		const y1 = y0 - 13 * s;
		const w0 = 9 - k * 1.75;
		const w1 = w0 - 1.75;
		c.moveTo(x - w0 * s, y0);
		c.lineTo(x + w1 * s, y1);
		c.moveTo(x + w0 * s, y0);
		c.lineTo(x - w1 * s, y1);
	}
	c.stroke();
	c.fillStyle = "#9aa5b1";
	c.fillRect(x - 1.5 * s, y - 70 * s, 3 * s, 20 * s);
	c.fillStyle = "#eef1f4";
	c.strokeStyle = "rgba(20,30,40,0.45)";
	c.lineWidth = 1;
	for (const dx of [-7, 0, 7]) {
		roundRect(c, x + dx * s - 2.5 * s, y - 72 * s, 5 * s, 17 * s, 1.5 * s);
		c.fill();
		c.stroke();
	}
	c.beginPath();
	c.arc(x, y - 75 * s, 2.2 * s, 0, Math.PI * 2);
	c.fillStyle = "#ff5a4a";
	c.fill();
}

/** The operations center: a small office building with a network box on the roof. */
function office(c, x, y, s) {
	c.fillStyle = "#eef0f2";
	c.strokeStyle = "rgba(20,30,40,0.35)";
	c.lineWidth = 1;
	c.fillRect(x - 24 * s, y - 40 * s, 48 * s, 40 * s);
	c.strokeRect(x - 24 * s, y - 40 * s, 48 * s, 40 * s);
	c.fillStyle = R3.ride;
	c.fillRect(x - 24 * s, y - 40 * s, 48 * s, 5 * s);
	c.fillStyle = "#9ec9e8";
	for (const dx of [-15, -3, 9]) c.fillRect(x + dx * s, y - 28 * s, 7 * s, 9 * s);
	c.fillStyle = "#4b5d73";
	c.fillRect(x - 6 * s, y - 50 * s, 14 * s, 10 * s);
	c.fillStyle = "#43c46b";
	c.fillRect(x - 3 * s, y - 46 * s, 3 * s, 2 * s);
}

/** A server rack (the fleet management server). */
function server(c, x, y, s) {
	c.fillStyle = "#2b3440";
	roundRect(c, x - 14 * s, y - 52 * s, 28 * s, 52 * s, 3 * s);
	c.fill();
	for (let i = 0; i < 4; i++) {
		c.fillStyle = "#3d4a5a";
		c.fillRect(x - 11 * s, y - (47 - i * 12) * s, 22 * s, 9 * s);
		c.fillStyle = i === 1 ? R3.alert : "#43c46b";
		c.fillRect(x + 6 * s, y - (44 - i * 12) * s, 3 * s, 3 * s);
	}
}

/** A stretch of firewall: a brick wall. */
function firewall(c, x, y, w, hh, s) {
	c.fillStyle = "#c8664a";
	c.fillRect(x, y - hh, w, hh);
	c.strokeStyle = "rgba(255,240,230,0.85)";
	c.lineWidth = 1;
	const bh = 7 * s;
	for (let row = 0; row * bh < hh; row++) {
		const yy = y - hh + row * bh;
		c.beginPath();
		c.moveTo(x, yy);
		c.lineTo(x + w, yy);
		for (let bx = x + (row % 2 ? 0 : w / 4); bx < x + w; bx += w / 2) {
			c.moveTo(bx, yy);
			c.lineTo(bx, Math.min(y, yy + bh));
		}
		c.stroke();
	}
}

/** A desk monitor showing an image (the operator's console). */
function consoleScreen(c, x, y, w, s, draw) {
	const hh = w * 0.62;
	c.fillStyle = "#5b6472";
	c.fillRect(x + w / 2 - 3 * s, y + hh, 6 * s, 9 * s);
	c.fillRect(x + w / 2 - 14 * s, y + hh + 8 * s, 28 * s, 3 * s);
	c.fillStyle = R3.bezel;
	roundRect(c, x - 3 * s, y - 3 * s, w + 6 * s, hh + 6 * s, 3 * s);
	c.fill();
	c.fillStyle = R3.screen;
	c.fillRect(x, y, w, hh);
	draw?.(x, y, w, hh);
}

function water(c, x0, x1, y, hgt, s) {
	c.fillStyle = R3.water;
	c.fillRect(x0, y, x1 - x0, hgt);
	c.strokeStyle = "#7cc2e8";
	c.lineWidth = 1.5 * s;
	for (let row = 0; row < 2; row++) {
		c.beginPath();
		for (let x = x0 + 6 * s + row * 9 * s; x < x1 - 10 * s; x += 26 * s) {
			c.moveTo(x, y + (5 + row * 7) * s);
			c.quadraticCurveTo(x + 4 * s, y + (3 + row * 7) * s, x + 8 * s, y + (5 + row * 7) * s);
		}
		c.stroke();
	}
}

function frame(c, x, y, w, hh, opts) {
	c.fillStyle = opts.screen ? R3.bezel : "#ffffff";
	c.strokeStyle = "rgba(20,30,40,0.5)";
	c.lineWidth = 1;
	const pad = opts.screen ? 5 : 3;
	roundRect(c, x - pad, y - pad, w + pad * 2, hh + pad * 2, 3);
	c.fill();
	c.stroke();
	drawPicture(c, x, y, w, hh, opts);
}

function arrow(c, x0, y0, x1, y1, color = "#5b6472", w = 2.4) {
	const a = Math.atan2(y1 - y0, x1 - x0);
	c.strokeStyle = color;
	c.fillStyle = color;
	c.lineWidth = w;
	c.lineCap = "round";
	c.beginPath();
	c.moveTo(x0, y0);
	c.lineTo(x1 - Math.cos(a) * w * 2, y1 - Math.sin(a) * w * 2);
	c.stroke();
	c.beginPath();
	c.moveTo(x1, y1);
	c.lineTo(x1 - Math.cos(a - 0.45) * w * 4, y1 - Math.sin(a - 0.45) * w * 4);
	c.lineTo(x1 - Math.cos(a + 0.45) * w * 4, y1 - Math.sin(a + 0.45) * w * 4);
	c.closePath();
	c.fill();
}

/** The cell's control cabinet with its stack light: red (fault) and amber (help asked) lit. */
function cabinet(c, x, y, s) {
	c.fillStyle = "#d7dce2";
	c.strokeStyle = "rgba(20,30,40,0.3)";
	c.lineWidth = 1;
	c.fillRect(x - 15 * s, y - 50 * s, 30 * s, 50 * s);
	c.strokeRect(x - 15 * s, y - 50 * s, 30 * s, 50 * s);
	c.fillStyle = "#1f3a52";
	c.fillRect(x - 9 * s, y - 42 * s, 18 * s, 9 * s);
	c.fillStyle = "#9aa5b1";
	c.fillRect(x - 1.5 * s, y - 62 * s, 3 * s, 12 * s);
	const segs = [
		[R3.red, true],
		[R3.alert, true],
		["#2f6b44", false],
	];
	segs.forEach(([col, on], i) => {
		c.fillStyle = col;
		roundRect(c, x - 6 * s, y - (92 - i * 10) * s, 12 * s, 9 * s, 2 * s);
		c.fill();
		if (on) {
			c.save();
			c.globalCompositeOperation = "lighter";
			const g = c.createRadialGradient(x, y - (88 - i * 10) * s, 0, x, y - (88 - i * 10) * s, 18 * s);
			g.addColorStop(0, i === 0 ? "rgba(255,90,70,0.45)" : "rgba(255,190,80,0.45)");
			g.addColorStop(1, "rgba(255,190,80,0)");
			c.fillStyle = g;
			c.beginPath();
			c.arc(x, y - (88 - i * 10) * s, 18 * s, 0, Math.PI * 2);
			c.fill();
			c.restore();
		}
	});
}

function checkBadge(c, x, y, s) {
	c.beginPath();
	c.arc(x, y, 11 * s, 0, Math.PI * 2);
	c.fillStyle = "#2e9e5b";
	c.fill();
	c.strokeStyle = "#ffffff";
	c.lineWidth = 2.4 * s;
	c.lineCap = "round";
	c.lineJoin = "round";
	c.beginPath();
	c.moveTo(x - 5 * s, y);
	c.lineTo(x - 1.5 * s, y + 4 * s);
	c.lineTo(x + 5.5 * s, y - 4 * s);
	c.stroke();
}

/** A tiny camera glyph centered at (x, y). */
function cameraGlyph(c, x, y, s, color = "#ffffff") {
	c.fillStyle = color;
	roundRect(c, x - 6 * s, y - 3.5 * s, 12 * s, 8 * s, 1.5 * s);
	c.fill();
	c.fillRect(x - 2.5 * s, y - 5.5 * s, 5 * s, 2.5 * s);
	c.fillStyle = R3.alert;
	c.beginPath();
	c.arc(x, y + 0.5 * s, 2.4 * s, 0, Math.PI * 2);
	c.fill();
}

/**
 * The station's state machine, without words: states as dots joined by arrows. The grip check
 * state (camera glyph) is current; its normal arrow on to the next state is crossed out, and its
 * failure arrow leads down to the help state (warning mark).
 */
function stateStrip(c, x, y, w, s) {
	const r = 4.5 * s;
	const R = 9 * s;
	const gap = (w - 2 * R - 6 * r) / 4.6;
	let cx = x + r;
	const done = [];
	for (let i = 0; i < 3; i++) {
		done.push(cx);
		cx += 2 * r + gap * 0.62;
	}
	const vx = cx + R - r;
	const nx = vx + R + gap * 1.5 + r;
	c.strokeStyle = "#7f8b98";
	c.lineWidth = 1.4 * s;
	for (let i = 0; i < done.length; i++) {
		const x0 = done[i] + r + 1.5 * s;
		const x1 = (i + 1 < done.length ? done[i + 1] - r : vx - R) - 1.5 * s;
		arrow(c, x0, y, x1, y, "#7f8b98", 1.3 * s);
	}
	for (const dx of done) {
		c.beginPath();
		c.arc(dx, y, r, 0, Math.PI * 2);
		c.fillStyle = R3.ride;
		c.fill();
	}
	// Grip check (current).
	c.beginPath();
	c.arc(vx, y, R, 0, Math.PI * 2);
	c.fillStyle = "#2b3440";
	c.fill();
	c.lineWidth = 2.4 * s;
	c.strokeStyle = R3.alert;
	c.stroke();
	cameraGlyph(c, vx, y, s * 0.95);
	// The normal arrow on to the next state, crossed out.
	arrow(c, vx + R + 2 * s, y, nx - r - 2 * s, y, "#b9bec6", 1.3 * s);
	c.beginPath();
	c.arc(nx, y, r, 0, Math.PI * 2);
	c.fillStyle = "#d4d8de";
	c.fill();
	const mx = (vx + R + nx - r) / 2;
	c.strokeStyle = R3.red;
	c.lineWidth = 2.2 * s;
	c.lineCap = "round";
	c.beginPath();
	c.moveTo(mx - 4 * s, y - 4 * s);
	c.lineTo(mx + 4 * s, y + 4 * s);
	c.moveTo(mx + 4 * s, y - 4 * s);
	c.lineTo(mx - 4 * s, y + 4 * s);
	c.stroke();
	// The failure arrow down to the help state.
	const hy = y + 34 * s;
	const hx = vx + 18 * s;
	c.strokeStyle = R3.alert;
	c.lineWidth = 2 * s;
	c.beginPath();
	c.moveTo(vx + 2 * s, y + R + 1 * s);
	c.quadraticCurveTo(vx + 2 * s, hy - 2 * s, hx - 11 * s, hy - 1 * s);
	c.stroke();
	arrow(c, hx - 15 * s, hy - 1.5 * s, hx - 10 * s, hy - 1 * s, R3.alert, 2 * s);
	c.beginPath();
	c.arc(hx, hy, R, 0, Math.PI * 2);
	c.fillStyle = "#fff3d6";
	c.fill();
	c.strokeStyle = R3.alert;
	c.lineWidth = 2.4 * s;
	c.stroke();
	warnTriangle(c, hx, hy - 0.5 * s, 11 * s);
}

/** A SpaceMouse in side view with a hand on it; push shifts the cap toward +x. */
function spaceMouse(c, x, y, s, push = 0) {
	c.fillStyle = "#2b3440";
	roundRect(c, x - 24 * s, y - 8 * s, 48 * s, 9 * s, 4 * s);
	c.fill();
	const cx = x + push * 5 * s;
	c.fillStyle = "#9aa5b1";
	roundRect(c, cx - 16 * s, y - 20 * s, 32 * s, 12 * s, 5 * s);
	c.fill();
	c.fillStyle = "#c3cad3";
	c.fillRect(cx - 14 * s, y - 20 * s, 28 * s, 2.5 * s);
	// The hand resting on the cap.
	c.fillStyle = "#f0c8a0";
	c.strokeStyle = "rgba(90,60,30,0.5)";
	c.lineWidth = 1;
	roundRect(c, cx - 15 * s, y - 31 * s, 26 * s, 13 * s, 6 * s);
	c.fill();
	c.stroke();
	c.fillStyle = "#3d7fd1";
	c.fillRect(cx + 9 * s, y - 31 * s, 26 * s, 10 * s);
}

/** The enable button, held down by a thumb. */
function enableBtn(c, x, y, s) {
	c.fillStyle = "#2b3440";
	roundRect(c, x - 11 * s, y - 8 * s, 22 * s, 9 * s, 2 * s);
	c.fill();
	c.fillStyle = "#43c46b";
	roundRect(c, x - 6 * s, y - 11 * s, 12 * s, 4 * s, 1.5 * s);
	c.fill();
	c.fillStyle = "#f0c8a0";
	c.strokeStyle = "rgba(90,60,30,0.5)";
	c.lineWidth = 1;
	roundRect(c, x - 9 * s, y - 20 * s, 15 * s, 10 * s, 5 * s);
	c.fill();
	c.stroke();
	c.fillStyle = "#3d7fd1";
	c.fillRect(x - 33 * s, y - 20 * s, 26 * s, 9 * s);
}

/** A watchdog dial: a timer face whose hand restarts at every fresh command. frac 0..1. */
function watchdog(c, x, y, s, frac) {
	const R = 15 * s;
	c.fillStyle = "#ffffff";
	c.strokeStyle = "#5b6472";
	c.lineWidth = 2 * s;
	c.beginPath();
	c.arc(x, y, R, 0, Math.PI * 2);
	c.fill();
	c.stroke();
	c.fillStyle = "rgba(226,72,61,0.18)";
	c.beginPath();
	c.moveTo(x, y);
	c.arc(x, y, R - 2 * s, -Math.PI / 2 + Math.PI * 1.6, -Math.PI / 2 + Math.PI * 2);
	c.closePath();
	c.fill();
	c.fillStyle = "rgba(31,158,143,0.3)";
	c.beginPath();
	c.moveTo(x, y);
	c.arc(x, y, R - 2 * s, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
	c.closePath();
	c.fill();
	const a = -Math.PI / 2 + frac * Math.PI * 2;
	c.strokeStyle = INK;
	c.lineWidth = 2 * s;
	c.lineCap = "round";
	c.beginPath();
	c.moveTo(x, y);
	c.lineTo(x + Math.cos(a) * (R - 4 * s), y + Math.sin(a) * (R - 4 * s));
	c.stroke();
	c.fillStyle = "#5b6472";
	c.fillRect(x - 3 * s, y - R - 5 * s, 6 * s, 4 * s);
}

// ---------------------------------------------------------------------------
// One illustration per stop. Each draws into a w x h box with scale s (1 at about 330 px wide).

const SCENES = {
	"pick-fails"(c, w, hh, s) {
		// The arm lifted the bunch over the tote; the grip check's second picture finds it half
		// out of the fingers and knotted to a second bunch.
		const tx = w * 0.06;
		const ty = hh * 0.96;
		tote(c, tx, ty, w * 0.42, 34 * s, s);
		const gx = w * 0.3;
		const gy = Math.max(hh * 0.36, 62 * s);
		armWrist(c, gx, gy, s, { from: 1, len: 64, cam: true, flash: 0.8 });
		tangle(c, gx + 2 * s, gy + 2 * s, s * 0.9, 0.6);
		// The state machine follows its failure arrow instead of placing.
		stateStrip(c, w * 0.56, hh * 0.3, w * 0.4, s);
	},
	"help-request"(c, w, hh, s) {
		// The station's agent sends one picture and a narrow question out through the firewall
		// (it dials out; nothing dials in) to the fleet server, which routes it to a console.
		const base = hh * 0.92;
		cabinet(c, w * 0.09, base, s * 0.95);
		firewall(c, w * 0.43, base, 14 * s, 74 * s, s);
		server(c, w * 0.62, base, s);
		consoleScreen(c, w * 0.78, base - 58 * s, 52 * s, s, (x, y, sw, sh) => {
			drawTicket(c, x + sw / 2, y + sh - 2 * s, sw * 0.5, sh * 0.86, s * 0.7);
		});
		c.save();
		c.setLineDash([4 * s, 4 * s]);
		c.strokeStyle = "rgba(242,165,65,0.95)";
		c.lineWidth = 2 * s;
		c.beginPath();
		c.moveTo(w * 0.15, base - 60 * s);
		c.quadraticCurveTo(w * 0.36, base - 98 * s, w * 0.6, base - 60 * s);
		c.stroke();
		c.beginPath();
		c.moveTo(w * 0.66, base - 44 * s);
		c.lineTo(w * 0.77, base - 44 * s);
		c.stroke();
		c.restore();
		arrow(c, w * 0.55, base - 64 * s, w * 0.6, base - 58 * s, R3.alert, 2 * s);
		drawTicket(c, w * 0.29, base - 66 * s, 44 * s, 56 * s, s);
	},
	capture(c, w, hh, s) {
		// The camera on the robot's wrist takes the video frame.
		const gx = w * 0.17;
		const gy = Math.max(hh * 0.6, 100 * s);
		const lens = armWrist(c, gx, gy, s * 0.95, { from: -1, len: 50, cam: true, flash: 0.6 });
		tangle(c, gx + 2 * s, gy + 2 * s, s * 0.6, 0.6);
		const fx = w * 0.4;
		const fy = hh * 0.1;
		const fw = w * 0.54;
		const fh = Math.min(hh * 0.8, fw * 0.56);
		// View cone from the lens to the frame.
		c.fillStyle = "rgba(110,198,255,0.22)";
		c.beginPath();
		c.moveTo(lens[0], lens[1]);
		c.lineTo(fx, fy);
		c.lineTo(fx, fy + fh);
		c.closePath();
		c.fill();
		frame(c, fx, fy, fw, fh, { cols: 48, rows: 27 });
		// Magnifier over the bunch: the frame is made of many separate pixels.
		const cols = 48;
		const rows = 27;
		const R = 21 * s;
		const mx = fx + fw * 0.47;
		const my = fy + fh * 0.42;
		const cell = 7 * s;
		const ox = mx - 0.47 * cols * cell;
		const oy = my - 0.42 * rows * cell;
		c.save();
		c.beginPath();
		c.arc(mx, my, R, 0, Math.PI * 2);
		c.clip();
		drawPicture(c, ox, oy, cols * cell, rows * cell, { cols, rows });
		c.strokeStyle = "rgba(255,255,255,0.55)";
		c.lineWidth = 1;
		c.beginPath();
		const i0 = Math.floor((mx - R - ox) / cell);
		const i1 = Math.ceil((mx + R - ox) / cell);
		const j0 = Math.floor((my - R - oy) / cell);
		const j1 = Math.ceil((my + R - oy) / cell);
		for (let i = i0; i <= i1; i++) {
			c.moveTo(ox + i * cell, my - R);
			c.lineTo(ox + i * cell, my + R);
		}
		for (let j = j0; j <= j1; j++) {
			c.moveTo(mx - R, oy + j * cell);
			c.lineTo(mx + R, oy + j * cell);
		}
		c.stroke();
		c.restore();
		c.strokeStyle = INK;
		c.lineWidth = 2.6 * s;
		c.beginPath();
		c.arc(mx, my, R, 0, Math.PI * 2);
		c.stroke();
		c.lineWidth = 4 * s;
		c.lineCap = "round";
		c.beginPath();
		c.moveTo(mx + R * 0.72, my + R * 0.72);
		c.lineTo(mx + R * 1.35, my + R * 1.35);
		c.stroke();
	},
	encode(c, w, hh, s) {
		const bigW = w * 0.36;
		const bigH = bigW * 0.56;
		frame(c, w * 0.05, (hh - bigH) / 2, bigW, bigH, { cols: 40, rows: 22 });
		// Encoder box.
		const ex = w * 0.47;
		const ey = hh * 0.5;
		c.fillStyle = "#4b5d73";
		roundRect(c, ex - 16 * s, ey - 22 * s, 32 * s, 44 * s, 5 * s);
		c.fill();
		c.strokeStyle = "#ffffff";
		c.lineWidth = 2.2 * s;
		c.lineCap = "round";
		for (const dx of [-5, 3]) {
			c.beginPath();
			c.moveTo(ex + dx * s, ey - 9 * s);
			c.lineTo(ex + (dx + 6) * s, ey);
			c.lineTo(ex + dx * s, ey + 9 * s);
			c.stroke();
		}
		arrow(c, w * 0.05 + bigW + 6 * s, ey, ex - 20 * s, ey);
		const smW = w * 0.2;
		const smH = smW * 0.56;
		arrow(c, ex + 20 * s, ey, w * 0.68, ey);
		frame(c, w * 0.72, (hh - smH) / 2, smW, smH, { cols: 12, rows: 7, blocks: [6, 4], lw: 1 });
		// Size bars under the frames: the compressed frame is much smaller.
		c.fillStyle = "#5b6472";
		c.fillRect(w * 0.05, hh * 0.86, bigW, 5 * s);
		c.fillRect(w * 0.72, hh * 0.86, smW * 0.45, 5 * s);
	},
	send(c, w, hh, s) {
		const fw = w * 0.24;
		const fh = fw * 0.56;
		const fx = w * 0.05;
		const fy = hh * 0.42 - fh / 2;
		frame(c, fx, fy, fw, fh, { cols: 12, rows: 7, blocks: [3, 2], lw: 1 });
		// Cut lines: the frame splits into pieces that each become a packet.
		c.strokeStyle = R3.red;
		c.setLineDash([3, 3]);
		c.lineWidth = 1.4;
		c.beginPath();
		c.moveTo(fx + fw / 3, fy - 4);
		c.lineTo(fx + fw / 3, fy + fh + 4);
		c.moveTo(fx + (fw * 2) / 3, fy - 4);
		c.lineTo(fx + (fw * 2) / 3, fy + fh + 4);
		c.moveTo(fx - 4, fy + fh / 2);
		c.lineTo(fx + fw + 4, fy + fh / 2);
		c.stroke();
		c.setLineDash([]);
		for (let i = 0; i < 6; i++) {
			const x = fx + fw + 22 * s + i * 22 * s;
			const y = hh * 0.42 - Math.sin(i * 0.5) * 10 * s;
			packet(c, x, y, s, PACKET_ORDER[i % PACKET_ORDER.length]);
		}
		lteMast(c, w * 0.9, hh * 0.95, s * 1.1);
	},
	"network-out"(c, w, hh, s) {
		water(c, 0, w, hh * 0.74, hh * 0.26, s);
		lteMast(c, w * 0.08, hh * 0.8, s);
		office(c, w * 0.9, hh * 0.8, s * 0.9);
		const a = [w * 0.12, hh * 0.3];
		const b = [w * 0.86, hh * 0.3];
		const at = (u) => [a[0] + (b[0] - a[0]) * u, a[1] - Math.sin(u * Math.PI) * 26 * s];
		// Packets in flight: the fourth is missing, the third and fifth swapped places.
		const order = [0, 1, 4, -1, 2, 5];
		order.forEach((k, i) => {
			const [x, y] = at(0.14 + i * 0.14);
			if (k < 0) packet(c, x, y, s, "#fff", { missing: true });
			else packet(c, x, y, s, PACKET_ORDER[k % PACKET_ORDER.length]);
		});
		// The lost one falls into the water.
		const [lx, ly] = at(0.56);
		packet(c, lx + 8 * s, hh * 0.64, s * 0.9, PACKET_ORDER[3], { alpha: 0.85 });
		c.strokeStyle = "rgba(20,30,40,0.35)";
		c.setLineDash([2, 3]);
		c.lineWidth = 1.2;
		c.beginPath();
		c.moveTo(lx, ly + 10 * s);
		c.quadraticCurveTo(lx + 8 * s, ly + 30 * s, lx + 8 * s, hh * 0.6);
		c.stroke();
		c.setLineDash([]);
		c.strokeStyle = "rgba(255,255,255,0.9)";
		c.lineWidth = 1.6;
		c.beginPath();
		c.ellipse(lx + 8 * s, hh * 0.76, 14 * s, 4 * s, 0, 0, Math.PI * 2);
		c.stroke();
	},
	"decode-display"(c, w, hh, s) {
		// Packets arrive in clumps, wait in the holding queue, leave at a steady pace, are
		// unpacked, and the screen shows the picture at its next redraw.
		// Positions are fractions of the width so the steady packets and the arrow always fit
		// between the queue and the monitor (packet sizes only scale with s).
		const y = hh * 0.5;
		const arrivals = [0.045, 0.085, 0.15, 0.19];
		arrivals.forEach((u, i) => packet(c, w * u, y + (i % 2 ? -7 : 7) * s, s * 0.85, PACKET_ORDER[i % PACKET_ORDER.length]));
		const bx = w * 0.25;
		const bw = w * 0.19;
		c.fillStyle = "rgba(79,179,191,0.14)";
		c.strokeStyle = "#5b6472";
		c.lineWidth = 1.6 * s;
		roundRect(c, bx, y - 16 * s, bw, 32 * s, 6 * s);
		c.fill();
		c.stroke();
		const slots = 4;
		for (let i = 0; i < slots; i++) {
			const px = bx + bw * ((i + 0.5) / slots);
			packet(c, px, y, s * 0.78, PACKET_ORDER[(i + 2) % PACKET_ORDER.length]);
		}
		arrow(c, w * 0.215, y, bx - 2 * s, y, "#5b6472", 1.6 * s);
		// Out at an even spacing.
		for (let i = 0; i < 2; i++) packet(c, bx + bw + w * (0.035 + i * 0.04), y, s * 0.7, PACKET_ORDER[i % PACKET_ORDER.length], { alpha: 0.75 });
		const mw = w * 0.37;
		const mh = mw * 0.58;
		const mx = w * 0.6;
		const my = (hh - mh) / 2 - 6 * s;
		arrow(c, bx + bw + w * 0.1, y, mx - 8 * s, y, "#5b6472", 1.6 * s);
		c.fillStyle = "#5b6472";
		c.fillRect(mx + mw / 2 - 5 * s, my + mh + 4 * s, 10 * s, 14 * s);
		roundRect(c, mx + mw / 2 - 26 * s, my + mh + 16 * s, 52 * s, 6 * s, 3 * s);
		c.fill();
		frame(c, mx, my, mw, mh, { cols: 40, rows: 24, screen: true });
	},
	operator(c, w, hh, s) {
		// Direct control: the operator watches the wrist camera's view and pushes the SpaceMouse
		// while holding the enable button; "away" is up the screen.
		const mw = w * 0.5;
		const mh = Math.min(mw * 0.58, hh * 0.62);
		const mx = w * 0.05;
		const my = hh * 0.08;
		frame(c, mx, my, mw, mh, { cols: 40, rows: 23, screen: true });
		upArrow(c, mx + mw * 0.24, my + mh * 0.5, Math.min(mh * 0.5, 34 * s), "#ffe066");
		spaceMouse(c, w * 0.8, hh * 0.9, s * 1.1, 0.8);
		enableBtn(c, w * 0.6, hh * 0.92, s);
		// The command leaves as a small packet.
		packet(c, w * 0.7, hh * 0.24, s, "#e86a5c", { glow: true });
		arrow(c, w * 0.76, hh * 0.24, w * 0.93, hh * 0.24, "#5b6472", 2);
	},
	"network-back"(c, w, hh, s) {
		// Small speed commands stream back at an even pace; one is lost and the next simply
		// replaces it.
		water(c, 0, w, hh * 0.74, hh * 0.26, s);
		office(c, w * 0.9, hh * 0.8, s * 0.9);
		lteMast(c, w * 0.27, hh * 0.8, s * 0.85);
		armWrist(c, w * 0.11, hh * 0.56, s * 0.62, { from: -1, len: 46, open: 0 });
		tangle(c, w * 0.11 + 1 * s, hh * 0.56 + 1 * s, s * 0.55, 0.55);
		const y = hh * 0.24;
		const n = 6;
		for (let i = 0; i < n; i++) {
			const x = w * 0.79 - i * ((w * 0.44) / (n - 1));
			if (i === 3) packet(c, x, y, s * 0.8, "#fff", { missing: true });
			else packet(c, x, y, s * 0.8, "#e86a5c", { glow: i === 4 });
		}
		arrow(c, w * 0.31, y, w * 0.25, y + 10 * s, "#5b6472", 2);
	},
	"robot-executes"(c, w, hh, s) {
		// The controller smooths each new target (dashed steps) into an even motion (solid), the
		// watchdog's timer restarts with every fresh command, and the arm places the freed bunch
		// in the tray by itself.
		const gx = w * 0.06;
		const gy = hh * 0.12;
		const gw = w * 0.34;
		const gh = hh * 0.4;
		c.fillStyle = "rgba(255,255,255,0.7)";
		c.strokeStyle = "rgba(20,30,40,0.25)";
		c.lineWidth = 1;
		roundRect(c, gx, gy, gw, gh, 4 * s);
		c.fill();
		c.stroke();
		c.save();
		c.setLineDash([3 * s, 3 * s]);
		c.strokeStyle = "#7f8b98";
		c.lineWidth = 1.6 * s;
		c.beginPath();
		const steps = 5;
		for (let i = 0; i <= steps; i++) {
			const x0 = gx + 6 * s + ((gw - 12 * s) * i) / steps;
			const x1 = gx + 6 * s + ((gw - 12 * s) * (i + 1)) / steps;
			const yy = gy + gh - 6 * s - ((gh - 12 * s) * Math.min(i, steps - 1)) / (steps - 1);
			if (i === 0) c.moveTo(x0, yy);
			else c.lineTo(x0, yy);
			if (i < steps) c.lineTo(x1, yy);
		}
		c.stroke();
		c.restore();
		c.strokeStyle = R3.ride;
		c.lineWidth = 2.4 * s;
		c.beginPath();
		for (let i = 0; i <= 40; i++) {
			const u = i / 40;
			const x = gx + 6 * s + (gw - 12 * s) * u;
			const target = Math.min(1, Math.floor(u * steps) / (steps - 1));
			const smooth = Math.max(0, Math.min(1, u * 1.18 - 0.08));
			const v = smooth * 0.75 + target * 0.25;
			const yy = gy + gh - 6 * s - (gh - 12 * s) * v * 0.97;
			if (i === 0) c.moveTo(x, yy);
			else c.lineTo(x, yy);
		}
		c.stroke();
		// Watchdog: commands keep arriving, so the timer stays near its start.
		const wx = gx + gw * 0.62;
		const wy = gy + gh + 30 * s;
		watchdog(c, wx, wy, s, 0.18);
		for (let i = 0; i < 3; i++) packet(c, wx - (24 + i * 15) * s, wy, s * 0.55, "#e86a5c", { alpha: 1 - i * 0.25 });
		// The arm places the freed bunch in the tray.
		const by = hh * 0.86;
		belt(c, w * 0.44, w * 0.97, by, s * 0.9);
		const tx = w * 0.68;
		tray(c, tx, by - 3 * s, 70 * s, s);
		const fy = Math.max(by - 58 * s, 50 * s);
		armWrist(c, tx, fy, s, { from: 1, len: 58, open: 0 });
		bunch(c, tx, fy + 2 * s, s * 0.95, 0);
		arrow(c, tx + 34 * s, fy + 6 * s, tx + 34 * s, by - 18 * s, "#5b6472", 2);
		checkBadge(c, w * 0.93, hh * 0.16, s);
	},
};

// ---------------------------------------------------------------------------

/** Mount the close-up for stopId into el. Returns a cleanup function. */
export function closeup(stopId, el, ctx) {
	const stops = ctx.stops;
	const m = delayModel(stops, stopId);
	const canvas = h("canvas", { class: "closeup-canvas r3-art", "aria-hidden": "true" });
	const bar = h("div", { class: "r3-lat-bar" });
	stops.forEach((stop, i) => {
		const state = i < m.idx ? "past" : i === m.idx ? "current" : "future";
		const zero = !(m.mids[i] > 0);
		const seg = h("span", { class: `r3-seg ${state}${zero ? " zero" : ""}`, "data-stop": stop.id, title: stop.title });
		seg.style.flexGrow = String(m.mids[i]);
		bar.append(seg);
	});
	const lat = h(
		"div",
		{ class: "r3-lat", "aria-hidden": "true", "data-running": String(m.running), "data-total": String(m.total) },
		bar,
		h(
			"div",
			{ class: "r3-lat-nums" },
			h("span", { class: "r3-lat-run" }, h("b", {}, fmtMs(m.running)), " so far"),
			h("span", { class: "r3-lat-total" }, "total ", h("b", {}, fmtMs(m.total))),
		),
	);
	const root = h("div", { class: "r3-closeup", "data-closeup": stopId }, canvas, lat);
	el.append(root);

	const draw = () => {
		const w = Math.max(200, root.clientWidth || el.clientWidth || 320);
		const hh = Math.round(Math.min(196, Math.max(140, w * 0.5)));
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(hh * dpr);
		canvas.style.height = `${hh}px`;
		const c = canvas.getContext("2d");
		c.setTransform(dpr, 0, 0, dpr, 0, 0);
		c.clearRect(0, 0, w, hh);
		const s = Math.min(w / 330, hh / 165);
		SCENES[stopId]?.(c, w, hh, s);
	};
	draw();
	let lastW = 0;
	const ro = new ResizeObserver(() => {
		const w = root.clientWidth;
		if (w === lastW) return;
		lastW = w;
		draw();
	});
	ro.observe(root);
	return () => {
		ro.disconnect();
		root.remove();
	};
}
