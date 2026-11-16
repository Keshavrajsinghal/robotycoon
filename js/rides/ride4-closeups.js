// Ride 4 close-ups: one small 2D illustration per stop showing what happens there, drawn to
// agree with the stop text in knowledge/sim/ride4-lesson.md. Everything is drawn in a 360 x 202
// design space and scaled to the panel. The only words are the axis caption "time" (UI chrome);
// no numbers are drawn. Fixed illustrative patterns (trials, kitchens) come from
// ride4-common.js so the close-ups, stations, and cargo agree.

import { bus } from "../core/events.js";
import { loadCss } from "../core/dom.js";
import { mix } from "../engine/iso.js";
import { ik2, shuttle } from "../engine/robots.js";
import { KITCHENS, phase, R4, smooth, STRIPES, TRIALS, wilson } from "./ride4-common.js";

const W = 360;
const H = 202;
const INK = "#2b3340";
const MUTED = "#7d8a97";
const PANEL = "rgba(255,255,255,0.6)";
const GRAPE = "#6f3f8f";
const GRAPE2 = "#8a55a8";
const TRAY = "#c9ae80";
const TOTE = "#2f6fb3";
const ORANGE = "#e8792f";
const OLD = "#9aa3ad";

// ---------------------------------------------------------------------------
// 2D kit

function rrect(c, x, y, w, h, rad, fill, stroke, lw = 1.5) {
	c.beginPath();
	c.roundRect(x, y, w, h, rad);
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

function dot(c, x, y, rad, fill) {
	c.beginPath();
	c.arc(x, y, rad, 0, Math.PI * 2);
	c.fillStyle = fill;
	c.fill();
}

function ring(c, x, y, rad, color, lw) {
	c.beginPath();
	c.arc(x, y, rad, 0, Math.PI * 2);
	c.strokeStyle = color;
	c.lineWidth = lw;
	c.stroke();
}

function stroke(c, pts, color, lw, close = false) {
	c.beginPath();
	pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
	if (close) c.closePath();
	c.strokeStyle = color;
	c.lineWidth = lw;
	c.lineCap = "round";
	c.lineJoin = "round";
	c.stroke();
}

function checkMark(c, x, y, s, color, lw) {
	stroke(
		c,
		[
			[x - 0.45 * s, y],
			[x - 0.12 * s, y + 0.32 * s],
			[x + 0.48 * s, y - 0.36 * s],
		],
		color,
		lw,
	);
}

function crossMark(c, x, y, s, color, lw) {
	stroke(
		c,
		[
			[x - 0.36 * s, y - 0.36 * s],
			[x + 0.36 * s, y + 0.36 * s],
		],
		color,
		lw,
	);
	stroke(
		c,
		[
			[x - 0.36 * s, y + 0.36 * s],
			[x + 0.36 * s, y - 0.36 * s],
		],
		color,
		lw,
	);
}

function badge(c, x, y, rad, kind) {
	dot(c, x, y, rad, kind === "cross" ? R4.reject : R4.keep);
	ring(c, x, y, rad, "#ffffff", Math.max(1.5, rad * 0.14));
	if (kind === "cross") crossMark(c, x, y, rad, "#ffffff", rad * 0.24);
	else checkMark(c, x, y, rad, "#ffffff", rad * 0.24);
}

function arrow(c, x0, x1, y, color = MUTED) {
	stroke(
		c,
		[
			[x0, y],
			[x1, y],
		],
		color,
		2.2,
	);
	stroke(
		c,
		[
			[x1 - 6, y - 6],
			[x1, y],
			[x1 - 6, y + 6],
		],
		color,
		2.2,
	);
}

/** A grape bunch hanging from its stem; the stem top is at (x, y - 14s). */
function grapes(c, x, y, s = 1, alpha = 1, tilt = 0) {
	c.save();
	c.globalAlpha *= alpha;
	c.translate(x, y - 14 * s);
	c.rotate(tilt);
	c.translate(-x, -(y - 14 * s));
	stroke(
		c,
		[
			[x, y - 9 * s],
			[x + 2 * s, y - 14 * s],
		],
		"#5d7b34",
		2.2 * s,
	);
	const rows = [4, 3, 2, 1];
	rows.forEach((n, row) => {
		for (let i = 0; i < n; i++) dot(c, x + (i - (n - 1) / 2) * 5.4 * s, y - 5 * s + row * 4.6 * s, 3.1 * s, (i + row) % 2 ? GRAPE : GRAPE2);
	});
	c.restore();
}

/** A bunch lying in a tote or tray (on its side). */
function lyingGrapes(c, x, y, s = 1, alpha = 1) {
	c.save();
	c.globalAlpha *= alpha;
	for (let i = 0; i < 4; i++) dot(c, x - 6 * s + i * 4.2 * s, y - 3 * s, 3.1 * s, i % 2 ? GRAPE : GRAPE2);
	for (let i = 0; i < 3; i++) dot(c, x - 4 * s + i * 4.2 * s, y - 7 * s, 3 * s, i % 2 ? GRAPE2 : GRAPE);
	stroke(
		c,
		[
			[x - 9 * s, y - 5 * s],
			[x - 13 * s, y - 7 * s],
		],
		"#5d7b34",
		2 * s,
	);
	c.restore();
}

function tray(c, x, y, w, h) {
	rrect(c, x, y, w, h, 3, TRAY, "#a88d60", 1.2);
	rrect(c, x + 3, y + 3, w - 6, h - 6, 2, "#b89b6c");
}

function tote(c, x, y, w, h, color = TOTE) {
	rrect(c, x, y, w, h, 3, color, "#24578f", 1.2);
	c.fillStyle = "rgba(0,0,0,0.18)";
	c.fillRect(x + 3, y + 3, w - 6, 4);
}

/** Soft fingers: a hub with two curled silicone fingers; (x, y) is between the finger tips. */
function softFingers(c, x, y, s = 1, open = 0.3, color = ORANGE) {
	rrect(c, x - 9 * s, y - 18 * s, 18 * s, 6 * s, 2 * s, "#3b4552");
	for (const sg of [-1, 1]) {
		c.save();
		c.translate(x + sg * 5.5 * s, y - 12 * s);
		c.rotate(-sg * (0.05 + open * 0.45));
		c.beginPath();
		c.moveTo(-2.8 * s, 0);
		c.quadraticCurveTo(-3.3 * s, 7 * s, -sg * 1.2 * s - 1.2 * s, 13 * s);
		c.lineTo(-sg * 1.2 * s + 1.2 * s, 13 * s);
		c.quadraticCurveTo(3.3 * s, 7 * s, 2.8 * s, 0);
		c.closePath();
		c.fillStyle = color;
		c.fill();
		c.strokeStyle = "rgba(120,50,10,0.45)";
		c.lineWidth = 0.8;
		c.stroke();
		c.restore();
	}
}

const ARM = { link: "#f2f2ee", outline: "#8e98a4", joint: "#2a9d8f", base: "#3b4552", flange: "#b8c0ca", fingers: ORANGE };
const GHOST_ARM = { link: "rgba(200,240,255,0.55)", outline: "rgba(150,225,255,0.95)", joint: "rgba(127,211,247,0.95)", base: "rgba(150,225,255,0.5)", flange: "rgba(200,240,255,0.9)", fingers: "rgba(255,190,140,0.75)" };

/**
 * A six-axis arm in side view: base, turret, shoulder, upper arm, elbow, forearm, wrist, a short
 * flange pointing down, and soft fingers whose tips are at tip [x, y]. (bx, by) is the floor
 * point under the base. Returns the wrist point.
 */
function sixAxis(c, bx, by, tip, o = {}) {
	const s = o.s ?? 1;
	const C = o.colors ?? ARM;
	const L1 = (o.L1 ?? 46) * s;
	const L2 = (o.L2 ?? 42) * s;
	const sh = [bx, by - 24 * s];
	const wr = [tip[0], tip[1] - 26 * s];
	const k = ik2(L1, L2, wr[0] - sh[0], sh[1] - wr[1], true);
	const e = [sh[0] + k.elbow[0], sh[1] - k.elbow[1]];
	const w = [sh[0] + k.wrist[0], sh[1] - k.wrist[1]];
	c.beginPath();
	c.moveTo(bx - 16 * s, by);
	c.lineTo(bx + 16 * s, by);
	c.lineTo(bx + 11 * s, by - 8 * s);
	c.lineTo(bx - 11 * s, by - 8 * s);
	c.closePath();
	c.fillStyle = C.base;
	c.fill();
	rrect(c, bx - 10 * s, by - 28 * s, 20 * s, 21 * s, 4 * s, C.link, C.outline, 1);
	const lw1 = 10 * s;
	const lw2 = 8 * s;
	stroke(c, [sh, e], C.outline, lw1 + 2.2);
	stroke(c, [sh, e], C.link, lw1);
	stroke(c, [e, w], C.outline, lw2 + 2.2);
	stroke(c, [e, w], C.link, lw2);
	stroke(
		c,
		[
			[w[0], w[1]],
			[w[0], w[1] + 9 * s],
		],
		C.flange,
		4 * s,
	);
	dot(c, sh[0], sh[1], 7 * s, C.joint);
	dot(c, e[0], e[1], 5.6 * s, C.joint);
	dot(c, w[0], w[1], 4.4 * s, C.joint);
	softFingers(c, w[0], w[1] + 26 * s, s * 0.95, o.open ?? 0.3, C.fingers);
	return w;
}

function factory(c, x, y, s, lit, color = "#eef1f4") {
	c.fillStyle = color;
	c.strokeStyle = "#8e98a4";
	c.lineWidth = 1.2;
	c.beginPath();
	c.moveTo(x - 15 * s, y + 9 * s);
	c.lineTo(x - 15 * s, y - 3 * s);
	c.lineTo(x - 7 * s, y - 9 * s);
	c.lineTo(x - 7 * s, y - 3 * s);
	c.lineTo(x + 1 * s, y - 9 * s);
	c.lineTo(x + 1 * s, y - 3 * s);
	c.lineTo(x + 15 * s, y - 3 * s);
	c.lineTo(x + 15 * s, y + 9 * s);
	c.closePath();
	c.fill();
	c.stroke();
	c.fillStyle = "#b5543c";
	c.fillRect(x + 7 * s, y - 13 * s, 4 * s, 10 * s);
	if (lit !== undefined) dot(c, x + 11 * s, y - 17 * s, 3 * s, lit ? R4.lit : "#9aa3ad");
}

/** A model file chip: a page with a folded corner. dashed: only watching (shadow mode). */
function chip(c, x, y, s, color, { dashed = false, faded = false } = {}) {
	c.save();
	if (faded) c.globalAlpha *= 0.4;
	c.beginPath();
	c.moveTo(x - 5 * s, y - 7 * s);
	c.lineTo(x + 2 * s, y - 7 * s);
	c.lineTo(x + 5 * s, y - 4 * s);
	c.lineTo(x + 5 * s, y + 7 * s);
	c.lineTo(x - 5 * s, y + 7 * s);
	c.closePath();
	if (dashed) {
		c.setLineDash([2.5 * s, 2 * s]);
		c.strokeStyle = color;
		c.lineWidth = 1.6;
		c.stroke();
		c.setLineDash([]);
	} else {
		c.fillStyle = color;
		c.fill();
		c.fillStyle = "rgba(255,255,255,0.55)";
		c.fillRect(x - 3 * s, y - 1 * s, 6 * s, 1.4 * s);
		c.fillRect(x - 3 * s, y + 2.5 * s, 6 * s, 1.4 * s);
	}
	c.restore();
}

function joystick(c, x, y, s = 1, color = INK) {
	rrect(c, x - 9 * s, y + 2 * s, 18 * s, 6 * s, 2 * s, color);
	stroke(
		c,
		[
			[x, y + 2 * s],
			[x + 3 * s, y - 9 * s],
		],
		color,
		2.6 * s,
	);
	dot(c, x + 3 * s, y - 10 * s, 3.6 * s, R4.reject);
}

function camera(c, x, y, s = 1) {
	rrect(c, x - 11 * s, y - 7 * s, 22 * s, 15 * s, 3 * s, INK);
	dot(c, x, y + 0.5 * s, 5 * s, "#cfe8f5");
	dot(c, x, y + 0.5 * s, 2.6 * s, INK);
	c.fillStyle = INK;
	c.fillRect(x - 7 * s, y - 10 * s, 7 * s, 4 * s);
}

function timeAxis(c, x0, x1, y) {
	stroke(
		c,
		[
			[x0, y],
			[x1, y],
		],
		MUTED,
		1.5,
	);
	stroke(
		c,
		[
			[x1 - 6, y - 4],
			[x1, y],
			[x1 - 6, y + 4],
		],
		MUTED,
		1.5,
	);
	c.fillStyle = MUTED;
	c.font = "12px system-ui, -apple-system, sans-serif";
	c.textAlign = "right";
	c.textBaseline = "top";
	c.fillText("time", x1, y + 5);
}

function bez(p0, p1, p2, p3, u) {
	const v = 1 - u;
	return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]];
}

// ---------------------------------------------------------------------------
// One illustration per stop

const REC_TAKEOVER = 0.42; // where the operator takes over, as a fraction of the episode

/** One overhead-camera frame of the rescue episode (i = 0..5). */
function overheadFrame(c, fx, fy, w, h, i) {
	rrect(c, fx, fy, w, h, 4, "#cfe8f5", "#9cc3d6", 1);
	c.fillStyle = "#a9bccb";
	c.fillRect(fx + 1, fy + h - 9, w - 2, 8);
	tote(c, fx + 3, fy + h - 13, 16, 10);
	tray(c, fx + w - 19, fy + h - 8, 16, 6);
	const s = 0.5;
	if (i === 0) {
		lyingGrapes(c, fx + 11, fy + h - 6, 0.45);
		softFingers(c, fx + 11, fy + 10, s, 1, ORANGE);
	} else if (i <= 2) {
		// Lifted, the bunch hangs half out of the grip, knotted to a second bunch.
		softFingers(c, fx + 14, fy + 12, s, 0.15, ORANGE);
		grapes(c, fx + 15, fy + 19, 0.42, 1, 0.7);
		grapes(c, fx + 10, fy + 26, 0.38, 1, -0.3);
		if (i === 2) dot(c, fx + w - 6, fy + 6, 3, "#f2c230");
	} else if (i === 3) {
		softFingers(c, fx + 11, fy + h - 12, s, 0.6, ORANGE);
		lyingGrapes(c, fx + 11, fy + h - 6, 0.45);
	} else if (i === 4) {
		softFingers(c, fx + 24, fy + 10, s, 0.05, ORANGE);
		grapes(c, fx + 24, fy + 17, 0.42);
	} else {
		lyingGrapes(c, fx + w - 10, fy + h - 8, 0.4);
		softFingers(c, fx + w - 12, fy + 8, s, 1, ORANGE);
	}
}

/** One wrist-camera frame: the stem between the fingers, slipping before the takeover. */
function wristFrame(c, fx, fy, w, h, i) {
	rrect(c, fx, fy, w, h, 4, "#e2edf2", "#9cc3d6", 1);
	c.save();
	c.beginPath();
	c.roundRect(fx, fy, w, h, 4);
	c.clip();
	const cx = fx + w / 2;
	if (i === 5) {
		c.fillStyle = "#d8c49c";
		c.fillRect(fx, fy + h - 8, w, 8);
	}
	const open = i === 0 || i === 5;
	const slip = i >= 1 && i <= 2;
	const tilt = slip ? 0.65 : 0;
	if (i > 0 && i < 5) grapes(c, cx + (slip ? 3 : 0), fy + h - 4, 0.6, 1, tilt);
	if (slip) grapes(c, cx - 9, fy + h + 6, 0.55, 1, -0.2);
	for (const sg of [-1, 1]) {
		c.beginPath();
		const x0 = cx + sg * (open ? 17 : 9);
		c.moveTo(x0 - 4, fy - 1);
		c.quadraticCurveTo(x0 + sg * 3, fy + h * 0.5, x0 - sg * 3, fy + h * 0.85);
		c.lineTo(x0 + sg * 2, fy + h * 0.85);
		c.quadraticCurveTo(x0 + sg * 8, fy + h * 0.45, x0 + 4, fy - 1);
		c.closePath();
		c.fillStyle = ORANGE;
		c.fill();
	}
	c.restore();
}

/**
 * recording: the saved episode as synchronized tracks: overhead and wrist camera video, the six
 * joint angles, the gripper state, and the operator's commands (streaming only once the operator
 * takes over), all on one time axis with a timestamp on every message.
 */
function recording(c, t, still) {
	const X0 = 46;
	const X1 = 348;
	const span = X1 - X0;
	const play = still ? 0.72 : Math.min(1, phase(t, 12, 4) * 1.15);
	const px = X0 + play * span;
	rrect(c, X0 - 4, 4, span + 8, 74, 7, PANEL);
	rrect(c, X0 - 4, 82, span + 8, 60, 7, PANEL);
	rrect(c, X0 - 4, 146, span + 8, 18, 7, PANEL);
	// Track icons: overhead camera, wrist camera (on a finger), joints, gripper, joystick.
	camera(c, 20, 25, 1);
	camera(c, 16, 60, 0.75);
	softFingers(c, 29, 70, 0.45, 0.4);
	stroke(
		c,
		[
			[12, 112],
			[20, 96],
			[29, 104],
		],
		ORANGE,
		4,
	);
	dot(c, 20, 96, 3.6, INK);
	dot(c, 12, 112, 3.6, INK);
	softFingers(c, 20, 140, 0.55, 0.5);
	joystick(c, 20, 155, 0.75);
	const JOINTS = ["#e8792f", "#f2c230", "#1f9e8f", "#3d7fd1", "#8a5cc7", "#d9483b"];
	const content = () => {
		for (let i = 0; i < 6; i++) overheadFrame(c, X0 + i * 51, 7, 47, 40, i);
		for (let i = 0; i < 6; i++) wristFrame(c, X0 + i * 51, 50, 47, 25, i);
		// Six joint angles; flat while the station holds still waiting for help.
		JOINTS.forEach((color, j) => {
			const pts = [];
			for (let x = X0; x <= X1; x += 3) {
				const v = (x - X0) / span;
				const u = v < 0.3 ? v : v < REC_TAKEOVER ? 0.3 : v - (REC_TAKEOVER - 0.3);
				pts.push([x, 88 + j * 7.4 + 2.6 * Math.sin(u * (5 + j * 1.3) + j * 1.7)]);
			}
			stroke(c, pts, color, 1.6);
		});
		// Gripper state: closed (up) or open (down).
		const gx = (u) => X0 + u * span;
		stroke(
			c,
			[
				[gx(0), 138],
				[gx(0.12), 138],
				[gx(0.12), 133],
				[gx(0.34), 133],
				[gx(0.34), 138],
				[gx(0.5), 138],
				[gx(0.5), 133],
				[gx(0.86), 133],
				[gx(0.86), 138],
				[gx(1), 138],
			],
			INK,
			1.6,
		);
		// Operator commands: a dense stream, many times a second, only during the takeover.
		for (let x = gx(REC_TAKEOVER) + 2; x < gx(0.9); x += 3.2) {
			const hh = 4 + 2.5 * Math.sin(x * 0.7);
			stroke(
				c,
				[
					[x, 155 - hh],
					[x, 155 + hh],
				],
				R4.purple,
				1.4,
			);
		}
	};
	c.save();
	c.globalAlpha = 0.22;
	content();
	c.restore();
	c.save();
	c.beginPath();
	c.rect(0, 0, px, H);
	c.clip();
	content();
	c.restore();
	// The takeover moment, across every track.
	c.setLineDash([3, 3]);
	stroke(
		c,
		[
			[X0 + REC_TAKEOVER * span, 4],
			[X0 + REC_TAKEOVER * span, 164],
		],
		R4.purple,
		1.4,
	);
	c.setLineDash([]);
	// Playhead.
	stroke(
		c,
		[
			[px, 3],
			[px, 165],
		],
		R4.reject,
		2,
	);
	const blink = still || Math.floor(t * 1.6) % 2 === 0;
	dot(c, px, 4, 4.5, blink ? "#ff3b30" : "#a7322b");
	// Time axis with a tick for every timestamp.
	timeAxis(c, X0, X1, 180);
	for (let x = X0 + 4; x < X1 - 8; x += 6)
		stroke(
			c,
			[
				[x, 176],
				[x, 180],
			],
			MUTED,
			1,
		);
}

/**
 * upload: the link is narrow. By day, small telemetry trickles up live and recordings queue on
 * the station's disk; at night the flagged takeovers (purple) and a small sample of ordinary
 * picks (grey) go up to the cloud one by one.
 */
const UP_QUEUE = [0, 1, 0, 0, 1, 0, 0, 0]; // 1 = flagged takeover; the rest are ordinary picks
const UP_SAMPLE = 6; // the one ordinary pick sampled for upload
function upload(c, t, still) {
	const u = still ? 0.7 : phase(t, 11);
	const night = u >= 0.5;
	const dusk = smooth((u - 0.42) / 0.1) * (1 - smooth((u - 0.92) / 0.08));
	const g = c.createLinearGradient(0, 0, 0, 178);
	g.addColorStop(0, mix("#bfe3f7", "#1c2a46", dusk));
	g.addColorStop(1, mix("#eaf6fc", "#33456b", dusk));
	rrect(c, 0, 0, W, 178, 0, g);
	if (night) {
		dot(c, 34, 30, 12, "#eef2fb");
		dot(c, 40, 26, 11, mix("#bfe3f7", "#1c2a46", dusk));
		for (const [x, y] of [
			[80, 20],
			[150, 34],
			[205, 16],
			[120, 60],
		])
			dot(c, x, y, 1.4, "#ffffff");
	} else {
		dot(c, 34, 30, 12, "#f6c945");
		for (let k = 0; k < 8; k++) {
			const a = (k * Math.PI) / 4;
			stroke(
				c,
				[
					[34 + Math.cos(a) * 16, 30 + Math.sin(a) * 16],
					[34 + Math.cos(a) * 21, 30 + Math.sin(a) * 21],
				],
				"#f6c945",
				2,
			);
		}
	}
	c.fillStyle = "#bfdcae";
	c.fillRect(0, 178, W, H - 178);
	stroke(
		c,
		[
			[0, 178],
			[W, 178],
		],
		"#9cc38a",
		2,
	);
	// The station: a small six-axis arm over its tote, and the recorder with its disk queue.
	rrect(c, 10, 166, 118, 12, 4, "#d5d9df", "#aeb6c0", 1.2);
	tote(c, 52, 152, 26, 14);
	sixAxis(c, 26, 166, [64, 150], { s: 0.62, open: 0.5 });
	rrect(c, 92, 128, 32, 38, 4, "#2b3038");
	dot(c, 100, 158, 3, still || Math.floor(t * 1.6) % 2 === 0 ? "#ff3b30" : "#7a2a25");
	// The cloud building.
	rrect(c, 246, 116, 96, 62, 4, "#e4ebf3", "#9aa5b1", 1.2);
	c.fillStyle = R4.purple;
	c.fillRect(246, 116, 96, 6);
	c.fillStyle = night ? "#f6d77a" : "#a9d4ea";
	for (const x of [256, 280, 304, 326]) c.fillRect(x, 132, 12, 12);
	c.fillStyle = "#2f4d6b";
	c.fillRect(288, 156, 14, 22);
	for (const [x, y, rad] of [
		[262, 98, 17],
		[286, 82, 24],
		[314, 92, 19],
		[298, 104, 16],
		[274, 106, 14],
		[328, 104, 12],
	]) {
		dot(c, x, y + 2, rad, night ? "#aab6c8" : "#d6e2ee");
		dot(c, x, y, rad, night ? "#cfd8e6" : "#ffffff");
	}
	// The narrow pipe.
	const P = [
		[108, 120],
		[126, 54],
		[196, 40],
		[252, 90],
	];
	c.beginPath();
	c.moveTo(...P[0]);
	c.bezierCurveTo(...P[1], ...P[2], ...P[3]);
	c.strokeStyle = "#8cc9db";
	c.lineWidth = 8;
	c.lineCap = "round";
	c.stroke();
	c.strokeStyle = "#dff5fb";
	c.lineWidth = 5;
	c.stroke();
	// Live telemetry: tiny dots, day and night.
	for (let k = 0; k < 6; k++) {
		const [x, y] = bez(...P, phase(still ? 0.3 : t * 0.22, 1, k / 6));
		dot(c, x, y, 1.6, "#2fb5d6");
	}
	// The queue on the recorder: cards pile up by day; at night the flagged ones and the sampled
	// one leave in turn.
	const sent = [];
	UP_QUEUE.forEach((flag, i) => {
		if (flag || i === UP_SAMPLE) sent.push(i);
	});
	const shown = night ? UP_QUEUE.length : Math.min(UP_QUEUE.length, Math.floor((u / 0.48) * UP_QUEUE.length) + 1);
	let slot = 0;
	for (let i = 0; i < shown; i++) {
		const order = sent.indexOf(i);
		const leaves = 0.53 + order * 0.13;
		const color = UP_QUEUE[i] ? R4.purpleLight : "#c3cad2";
		if (night && order >= 0 && u >= leaves) {
			const k = (u - leaves) / 0.13;
			if (k < 1) {
				const [x, y] = bez(...P, smooth(k));
				rrect(c, x - 5, y - 4, 10, 8, 1.5, color, "#ffffff", 1);
			}
			continue;
		}
		const y = 122 - slot * 7;
		slot++;
		rrect(c, 95, y, 26, 6, 1.5, color, "rgba(0,0,0,0.25)", 0.8);
		if (UP_QUEUE[i]) {
			stroke(
				c,
				[
					[118, y + 1],
					[118, y - 4],
				],
				INK,
				1,
			);
			c.fillStyle = R4.reject;
			c.fillRect(118, y - 4, 4, 3);
		}
	}
}

const CARD_STRIPE = { copy: STRIPES[2], take: STRIPES[0], fail: STRIPES[3], rare: STRIPES[4], broken: "#9aa5b1" };

/** One episode card. Copies are identical; a takeover shows a joystick; a broken one a gap. */
function card(c, x, y, type, tag) {
	rrect(c, x - 15, y - 10, 30, 20, 3, type === "broken" ? "#f1ece6" : "#ffffff", "#9aa5b1", 1);
	c.fillStyle = CARD_STRIPE[type];
	c.fillRect(x - 14, y - 9, 6, 18);
	if (type === "broken") {
		stroke(
			c,
			[
				[x - 5, y - 3],
				[x - 1, y - 3],
			],
			"#9aa5b1",
			1.6,
		);
		stroke(
			c,
			[
				[x + 5, y - 3],
				[x + 11, y - 3],
			],
			"#9aa5b1",
			1.6,
		);
		c.fillStyle = "rgba(120,130,140,0.45)";
		c.fillRect(x - 5, y + 2, 15, 5);
	} else {
		stroke(
			c,
			[
				[x - 5, y - 3],
				[x + 11, y - 3],
			],
			"#9aa5b1",
			1.6,
		);
		stroke(
			c,
			[
				[x - 5, y + 3],
				[x + 6, y + 3],
			],
			"#c3cad2",
			1.6,
		);
		if (type === "take") joystick(c, x + 9, y + 3, 0.4);
		if (type === "rare") dot(c, x + 9, y + 3, 3, "#c8352b");
		if (type === "fail") lyingGrapes(c, x + 9, y + 7, 0.3);
	}
	if (tag) {
		rrect(c, x + 8, y - 15, 11, 11, 2.5, tag === "pass" ? R4.keep : R4.reject, "#ffffff", 1.2);
		if (tag === "pass") checkMark(c, x + 13.5, y - 9.5, 8, "#ffffff", 1.8);
		else crossMark(c, x + 13.5, y - 9.5, 8, "#ffffff", 1.8);
	}
}

/**
 * curation: episodes pass a scanner. Takeovers, failures, and unusual bunches are kept and
 * labeled pass or fail; near-copies of an easy pick and broken recordings are dropped.
 */
const CUR_PATTERN = [
	{ type: "copy", keep: true, tag: "pass" },
	{ type: "copy", keep: false },
	{ type: "take", keep: true, tag: "pass" },
	{ type: "copy", keep: false },
	{ type: "broken", keep: false },
	{ type: "fail", keep: true, tag: "fail" },
	{ type: "copy", keep: false },
	{ type: "rare", keep: true, tag: "pass" },
];
function curation(c, t, still) {
	// The keep bin: an open green folder with kept, labeled episodes.
	rrect(c, 250, 22, 34, 10, 3, "#25854c");
	rrect(c, 250, 28, 96, 58, 7, R4.keep);
	card(c, 276, 62, "take", "pass");
	card(c, 300, 58, "fail", "fail");
	card(c, 324, 62, "rare", "pass");
	// The trash can for dropped ones.
	const tx = 262;
	const ty = 122;
	rrect(c, tx - 4, ty - 8, 80, 8, 3, "#6f7a86");
	rrect(c, tx + 28, ty - 13, 16, 6, 2, "#6f7a86");
	c.beginPath();
	c.moveTo(tx, ty);
	c.lineTo(tx + 72, ty);
	c.lineTo(tx + 66, ty + 62);
	c.lineTo(tx + 6, ty + 62);
	c.closePath();
	c.fillStyle = "#8e98a4";
	c.fill();
	for (const x of [tx + 20, tx + 36, tx + 52])
		stroke(
			c,
			[
				[x, ty + 12],
				[x, ty + 52],
			],
			"#6f7a86",
			3,
		);
	// Fork guides.
	c.setLineDash([4, 5]);
	stroke(
		c,
		[
			[176, 98],
			[214, 98],
			[244, 62],
		],
		"#aeb6c0",
		2,
	);
	stroke(
		c,
		[
			[176, 98],
			[214, 98],
			[250, 130],
		],
		"#aeb6c0",
		2,
	);
	c.setLineDash([]);
	// Belt.
	rrect(c, 8, 104, 170, 14, 5, "#3a3f47");
	for (let x = 16; x < 176; x += 14) dot(c, x, 111, 2.4, "#5b6472");
	// Cards ride the belt, are labeled at the scanner if kept, then fork.
	const tt = still ? 2.6 : t;
	CUR_PATTERN.forEach((cd, i) => {
		const s = phase(tt * 0.11, 1, i / CUR_PATTERN.length);
		let x;
		let y;
		if (s < 0.6) {
			x = -16 + (s / 0.6) * 214;
			y = 96;
		} else if (s < 0.86) {
			const k = smooth((s - 0.6) / 0.26);
			x = 198 + k * (cd.keep ? 80 : 98);
			y = 96 + (cd.keep ? -32 : 56) * k;
		} else return;
		card(c, x, y, cd.type, cd.keep && x > 140 ? cd.tag : null);
	});
	// Scanner arch over the belt.
	c.fillStyle = `rgba(150,232,248,${still ? 0.35 : (0.25 + 0.12 * Math.sin(t * 5)).toFixed(2)})`;
	c.fillRect(126, 60, 22, 44);
	rrect(c, 118, 52, 38, 10, 3, R4.purple);
	c.fillStyle = "#3b4048";
	c.fillRect(120, 62, 5, 56);
	c.fillRect(149, 62, 5, 56);
	dot(c, 137, 66, 4, "#111418");
}

/** dataset: episodes shelved like a library next to the original demonstrations; the newest glows. */
function dataset(c, t, still) {
	const shelves = [58, 112, 166];
	const bays = [
		[28, 175],
		[185, 334],
	];
	let n = 7;
	shelves.forEach((sy, row) => {
		bays.forEach(([b0, b1], bay) => {
			const last = row === 1 && bay === 1;
			let x = b0 + 2;
			for (;;) {
				n = (n * 9301 + 49297) % 233280;
				const v = n / 233280;
				const w = 9 + Math.round(v * 4);
				const hh = 32 + Math.round(v * 11);
				const room = b1 - x;
				const isNew = last && room < 2 * w + 10;
				if (room < w + 1) break;
				if (v < 0.07 && !isNew) {
					x += w + 3;
					continue;
				}
				const color = isNew ? R4.purple : STRIPES[Math.floor(v * 97) % STRIPES.length];
				if (isNew) {
					const pulse = still ? 0.7 : 0.5 + 0.35 * Math.sin(t * 3);
					const g = c.createRadialGradient(x + w / 2, sy - hh / 2, 0, x + w / 2, sy - hh / 2, 30);
					g.addColorStop(0, `rgba(184,146,232,${pulse.toFixed(2)})`);
					g.addColorStop(1, "rgba(184,146,232,0)");
					c.fillStyle = g;
					c.fillRect(x - 30, sy - hh - 30, w + 60, hh + 60);
				}
				rrect(c, x, sy - hh, w, hh, 1.5, color, "rgba(0,0,0,0.18)", 1);
				c.fillStyle = "rgba(255,255,255,0.75)";
				c.fillRect(x + 2, sy - hh + 6, w - 4, 6);
				if (isNew) {
					c.fillStyle = "#f2c230";
					c.beginPath();
					for (let k = 0; k < 10; k++) {
						const a = -Math.PI / 2 + (k * Math.PI) / 5;
						const rad = k % 2 ? 3 : 7;
						c.lineTo(x + w / 2 + Math.cos(a) * rad, sy - hh - 10 + Math.sin(a) * rad);
					}
					c.closePath();
					c.fill();
					break;
				}
				x += w + 3;
			}
		});
		c.fillStyle = "#b07a4a";
		c.fillRect(22, sy, 316, 6);
	});
	c.fillStyle = "#8a5a3b";
	for (const x of [20, 177, 336]) c.fillRect(x, 10, 6, 168);
}

/**
 * training: for a recorded moment (a camera image plus the joint readings), the model's numbers
 * are adjusted until its output, a short chunk of future targets, matches the move the person
 * made (dashed).
 */
function training(c, t, still) {
	const p = still ? 1 : smooth(Math.min(1, phase(t, 9) * 1.25));
	// The recorded moment: camera image and joint readings.
	rrect(c, 10, 34, 86, 64, 6, "#cfe8f5", "#9cc3d6", 1.2);
	c.fillStyle = "#a9bccb";
	c.fillRect(11, 84, 84, 13);
	tote(c, 20, 74, 30, 16);
	lyingGrapes(c, 34, 84, 0.7);
	tray(c, 62, 84, 26, 8);
	softFingers(c, 36, 66, 0.7, 0.9);
	rrect(c, 10, 104, 86, 34, 6, PANEL, "#c3cad2", 1);
	const JOINTS = ["#e8792f", "#f2c230", "#1f9e8f", "#3d7fd1", "#8a5cc7", "#d9483b"];
	JOINTS.forEach((color, j) => {
		const h = 8 + 14 * (0.5 + 0.5 * Math.sin(j * 1.9 + 0.6));
		rrect(c, 17 + j * 13, 132 - h, 9, h, 2, color);
	});
	arrow(c, 102, 120, 86);
	// The model's adjustable numbers settling as training runs.
	const g0 = [128, 38];
	for (let i = 0; i < 6; i++)
		for (let j = 0; j < 6; j++) {
			const noise = 0.5 + 0.5 * Math.sin((still ? 1.3 : t) * 2.1 + i * 1.7 + j * 2.3);
			const target = 0.5 + 0.5 * Math.sin(i * 0.9 + 0.4) * Math.cos(j * 0.8 - 0.3);
			const v = noise + (target - noise) * p;
			const color = v < 0.5 ? mix("#5b3fa8", "#38bdd8", v * 2) : mix("#38bdd8", "#f6e27a", (v - 0.5) * 2);
			rrect(c, g0[0] + i * 15, g0[1] + j * 15, 12, 12, 2.5, color);
		}
	rrect(c, g0[0] - 5, g0[1] - 5, 6 * 15 + 7, 6 * 15 + 7, 6, null, "rgba(43,51,64,0.25)", 1.2);
	arrow(c, 230, 248, 86);
	// The output: a chunk of future targets, pulled onto the person's move.
	rrect(c, 254, 22, 100, 128, 8, PANEL, "#c3cad2", 1);
	tote(c, 262, 124, 28, 16);
	tray(c, 318, 132, 28, 8);
	const P = (u) => [276 + 56 * u, 112 - 64 * Math.sin(Math.PI * u) + 10 * u];
	const pts = [];
	for (let i = 0; i <= 24; i++) pts.push(P(i / 24));
	c.setLineDash([4, 4]);
	stroke(c, pts, INK, 1.8);
	c.setLineDash([]);
	for (let j = 0; j < 10; j++) {
		const u = j / 9;
		const [x, y] = P(u);
		const off = 1 - p;
		dot(c, x + off * (14 * Math.sin(u * 5 + 1) - 6), y + off * (26 + 12 * Math.cos(u * 4)), 3.6, R4.purple);
	}
	// Training progress.
	rrect(c, 128, 160, 226, 8, 4, "rgba(43,51,64,0.12)");
	rrect(c, 128, 160, Math.max(8, 226 * p), 8, 4, R4.lit);
}

/** A rough stand-in bunch: three blobs, as a simulator approximates grapes. */
function roughBunch(c, x, y, alpha = 0.85) {
	c.save();
	c.globalAlpha *= alpha;
	dot(c, x - 4, y - 4, 4.5, "#c79ce0");
	dot(c, x + 4, y - 4, 4.5, "#b98ad6");
	dot(c, x, y + 3, 4.5, "#b98ad6");
	c.restore();
}

const SIM_TINTS = ["rgba(255,214,120,0.22)", "rgba(120,190,255,0.2)", "rgba(255,140,170,0.18)", "rgba(150,255,190,0.16)", "rgba(200,160,255,0.2)"];

/**
 * simulation: translucent copies of the grape station practice in parallel. Every episode gets
 * random lighting and sometimes a fogged lens; the bunches are rough shapes. It checks reach and
 * timing; one copy's motion would hit the tote.
 */
function simulation(c, t, still) {
	const g = c.createLinearGradient(0, 6, 0, 196);
	g.addColorStop(0, "#1c2a46");
	g.addColorStop(1, "#28406a");
	rrect(c, 6, 6, 348, 190, 10, g);
	c.save();
	c.beginPath();
	c.roundRect(6, 6, 348, 190, 10);
	c.clip();
	c.strokeStyle = "rgba(90,200,240,0.22)";
	c.lineWidth = 1;
	for (let k = -8; k <= 8; k++) {
		c.beginPath();
		c.moveTo(180 + k * 8, 40);
		c.lineTo(180 + k * 60, 200);
		c.stroke();
	}
	for (let k = 0; k < 7; k++) {
		const y = 44 + k * k * 3.6;
		c.beginPath();
		c.moveTo(6, y);
		c.lineTo(354, y);
		c.stroke();
	}
	const cells = [
		[64, 92],
		[180, 92],
		[296, 92],
		[64, 184],
		[180, 184],
		[296, 184],
	];
	cells.forEach(([cx, fy], i) => {
		const tt = (still ? 1.2 : t) + i * 0.7;
		const period = 3 + (i % 3) * 0.4;
		const episode = Math.floor(tt / period);
		const k = shuttle(tt, period);
		const u = phase(tt, period);
		const pick = [cx - 4, fy - 6];
		const place = [cx + 34, fy - 6];
		const hits = (episode + i) % 5 === 3;
		// Random lighting for this episode.
		c.fillStyle = SIM_TINTS[(episode * 3 + i) % SIM_TINTS.length];
		c.fillRect(cx - 54, fy - 80, 108, 82);
		const tx = pick[0] + (place[0] - pick[0]) * k;
		const ty = fy - 18 - (hits ? 4 : 24) * Math.sin(k * Math.PI);
		c.save();
		c.shadowColor = "rgba(120,220,255,0.8)";
		c.shadowBlur = 6;
		rrect(c, pick[0] - 13, fy - 10, 26, 10, 2, "rgba(170,230,255,0.3)", hits && k > 0.2 && k < 0.5 ? "#ff6a5c" : "rgba(170,230,255,0.9)", 1.4);
		rrect(c, place[0] - 13, fy - 4, 26, 4, 2, "rgba(201,174,128,0.4)", "rgba(220,200,160,0.9)", 1);
		sixAxis(c, cx - 36, fy, [tx, ty], { s: 0.62, L1: 50, L2: 46, colors: GHOST_ARM, open: u > 0.1 && u < 0.6 ? 0.05 : 0.8 });
		c.restore();
		const carrying = u > 0.1 && u < 0.6;
		if (carrying) roughBunch(c, tx, ty + 6);
		else if (u >= 0.6) roughBunch(c, place[0], fy - 8);
		else roughBunch(c, pick[0], fy - 8);
		// A fogged lens on some episodes: a milky veil over the copy.
		if ((episode + i) % 3 === 0) {
			c.fillStyle = "rgba(235,245,255,0.28)";
			c.fillRect(cx - 54, fy - 80, 108, 82);
		}
		if (u > 0.62 && u < 0.95) badge(c, cx + 44, fy - 66, 7, hits ? "cross" : "check");
	});
	c.restore();
}

/**
 * real-eval: the real grape station runs trials, and both models run the same trials in random
 * order (TRIALS). The scoreboard keeps a row per model (grey old, purple new), and below it each
 * model's result is a range, not one number: the ranges narrow as trials add up.
 */
function realEval(c, t, still) {
	const runs = TRIALS.runs;
	const period = 2.4;
	const cycle = runs.length + 3;
	// Start part-way through the suite so the rows and ranges are already filling.
	const j = still ? cycle - 1 : Math.floor(t / period + 14) % cycle;
	const done = Math.min(j, runs.length);
	const run = j < runs.length ? runs[j] : null;
	// The station: floor, tote, tray, the arm.
	c.fillStyle = "#c9ccd0";
	c.fillRect(8, 178, 166, 6);
	tote(c, 70, 150, 40, 28);
	lyingGrapes(c, 84, 172, 0.7);
	lyingGrapes(c, 100, 174, 0.7);
	tray(c, 128, 166, 42, 12);
	const tt = still ? 0.9 : t;
	const u = phase(tt, period);
	const fail = run && !run.pass;
	const k = shuttle(tt, period);
	const holding = u > 0.1 && u < (fail ? 0.26 : 0.6);
	const tip = [90 + k * 58, 150 - Math.sin(k * Math.PI) * 30];
	if (u >= 0.6 && u < 0.96 && !fail) lyingGrapes(c, 150, 172, 0.7);
	sixAxis(c, 34, 178, tip, { s: 1, L1: 56, L2: 52, open: holding ? 0.05 : 0.8 });
	if (holding) grapes(c, tip[0], tip[1] + 14 * 0.7 + 2, 0.7);
	if (fail && u >= 0.26 && u < 0.4) grapes(c, 92, 150 + (u - 0.26) * 120, 0.7, 1, 0.5);
	// The scoreboard for the tangled-bunch trials (the knotted pair at the top): one row of trial
	// marks per model.
	rrect(c, 180, 8, 172, 188, 10, "#1d2633", R4.purple, 3);
	grapes(c, 202, 32, 0.42, 1, 0.5);
	grapes(c, 196, 38, 0.38, 1, -0.4);
	const rows = { 0: 44, 1: 84 };
	for (const m of [0, 1]) chip(c, 194, rows[m] + 9, 1.2, m ? R4.purpleLight : OLD);
	const cell = (m, i) => [208 + (i % 10) * 13.6, rows[m] + Math.floor(i / 10) * 13];
	for (const m of [0, 1]) for (let i = 0; i < 20; i++) rrect(c, ...cell(m, i), 10, 10, 2, "#2a3647");
	const wins = [0, 0];
	const tries = [0, 0];
	for (let q = 0; q < done; q++) {
		const r = runs[q];
		const [x, y] = cell(r.model, r.index);
		rrect(c, x, y, 10, 10, 2, r.pass ? R4.lit : "#ff6a5c");
		tries[r.model]++;
		wins[r.model] += r.pass;
	}
	// The ranges: where each model's true success rate plausibly lies, on one shared scale.
	const ax0 = 196;
	const ax1 = 340;
	stroke(
		c,
		[
			[ax0, 176],
			[ax1, 176],
		],
		"#55657c",
		1.5,
	);
	for (const x of [ax0, ax1])
		stroke(
			c,
			[
				[x, 172],
				[x, 180],
			],
			"#55657c",
			1.5,
		);
	for (const m of [0, 1]) {
		const y = m ? 156 : 134;
		chip(c, 194, y, 0.9, m ? R4.purpleLight : OLD);
		const iv = wilson(wins[m], tries[m]);
		if (!iv) continue;
		const color = m ? R4.purpleLight : OLD;
		const x0 = ax0 + 12 + iv[0] * (ax1 - ax0 - 12);
		const x1 = ax0 + 12 + iv[1] * (ax1 - ax0 - 12);
		rrect(c, x0, y - 4, Math.max(2, x1 - x0), 8, 4, color);
		dot(c, ax0 + 12 + (wins[m] / tries[m]) * (ax1 - ax0 - 12), y, 3.4, "#ffffff");
	}
}

/** Station block in the rollout picture: the old model chip, and the new one once copied. */
function rollStation(c, x, y, state) {
	const border = state === "new" ? "#2e9e5b" : state === "shadow" ? R4.data : "#9aa5b1";
	rrect(c, x - 18, y - 11, 36, 22, 4, state === "new" ? "rgba(95,224,138,0.22)" : "#ffffff", border, 1.6);
	chip(c, x - 7, y, 1, OLD, { faded: state === "new" });
	if (state === "shadow") chip(c, x + 7, y, 1, R4.purple, { dashed: true });
	if (state === "new") chip(c, x + 7, y, 1, R4.purple);
}

function eye(c, x, y, s, color) {
	c.beginPath();
	c.moveTo(x - 8 * s, y);
	c.quadraticCurveTo(x, y - 7 * s, x + 8 * s, y);
	c.quadraticCurveTo(x, y + 7 * s, x - 8 * s, y);
	c.closePath();
	c.strokeStyle = color;
	c.lineWidth = 1.6;
	c.stroke();
	dot(c, x, y, 2.4 * s, color);
}

/**
 * rollout: the company's grape stations (ten lines in three kitchens). The update first watches
 * in shadow mode on one station (dashed: it moves nothing), then drives that one station, then
 * its whole kitchen, then every kitchen; each step waits behind a barrier until the numbers hold.
 * The old model file stays on every station (faded once the new one drives).
 */
function rollout(c, t, still) {
	const u = still ? 0.6 : phase(t, 12);
	const stage = u < 0.06 ? 0 : u < 0.28 ? 1 : u < 0.5 ? 2 : u < 0.72 ? 3 : 4;
	const cols = [14, 92, 170];
	KITCHENS.forEach((n, k) => {
		const x0 = cols[k];
		rrect(c, x0, 10, 70, 186, 8, "rgba(255,255,255,0.55)", "#c3cad2", 1.2);
		factory(c, x0 + 35, 26, 0.7, undefined, "#f4f6f8");
		for (let i = 0; i < n; i++) {
			const canary = k === 0 && i === 0;
			const st = stage >= 4 || (stage >= 3 && k === 0) || (stage >= 2 && canary) ? "new" : stage === 1 && canary ? "shadow" : "old";
			rollStation(c, x0 + 35, 58 + i * 36, st);
		}
	});
	// The stage ladder: shadow, one station, one kitchen, every kitchen.
	const sx = 284;
	stroke(
		c,
		[
			[sx, 28],
			[sx, 172],
		],
		"#c3cad2",
		4,
	);
	for (let i = 0; i < 4; i++) {
		const y = 28 + i * 48;
		const lit = i < stage;
		const col = lit ? "#ffffff" : R4.purple;
		dot(c, sx, y, 16, lit ? (i === 0 ? R4.data : R4.lit) : "#ffffff");
		ring(c, sx, y, 16, lit ? (i === 0 ? "#2a8fb0" : "#2e9e5b") : R4.purple, 2);
		if (i === 0) eye(c, sx, y, 1, col);
		else if (i === 1) rrect(c, sx - 5, y - 5, 10, 10, 2, null, col, 2);
		else if (i === 2) factory(c, sx, y + 2, 0.45, undefined, lit ? "rgba(255,255,255,0.9)" : "#ffffff");
		else for (const dx of [-8, 0, 8]) factory(c, sx + dx, y + 2, 0.24, undefined, lit ? "rgba(255,255,255,0.9)" : "#ffffff");
		if (i === 0) continue;
		// A barrier before each later step lifts once the step before it has held.
		const bx = sx + 24;
		const by = y - 24;
		c.save();
		c.translate(bx, by);
		c.rotate(-(lit ? 1 : 0) * 1.2);
		for (let s = 0; s < 4; s++) {
			c.fillStyle = s % 2 ? "#ffffff" : R4.reject;
			c.fillRect(s * 8, -2.5, 8, 5);
		}
		c.restore();
		dot(c, bx, by, 3.5, "#3b4048");
	}
}

/**
 * fleet: the fleet manager's dashboard. Each grape station (ten lines in three kitchens) shows a
 * heartbeat, its model version (grey old, purple new), and its misses. The update spreads line by
 * line; one station's misses rise, it is pointed back at the old model, and its saved failure
 * goes to an engineer's viewer to replay on one timeline.
 */
function fleet(c, t, still) {
	const P = 14;
	const u = still ? 11.2 : ((t % P) + P) % P;
	const REG = 5;
	rrect(c, 6, 6, 258, 190, 10, "#1d2633");
	const rows = [];
	let y = 22;
	KITCHENS.forEach((n, k) => {
		factory(c, 24, y + 4 + ((n - 1) * 16) / 2, 0.55, undefined, "#c9d3de");
		for (let i = 0; i < n; i++) {
			rows.push(y);
			y += 16;
		}
		y += 10;
	});
	rows.forEach((ry, i) => {
		const on = 0.5 + i * 0.85;
		let ver = u >= on ? "new" : "old";
		let misses = 0.12 + 0.06 * ((i * 7) % 3);
		if (i === REG && u >= 9) {
			misses = u < 10.8 ? 0.12 + 0.68 * smooth((u - 9) / 1.5) : 0.8 - 0.68 * smooth((u - 10.8) / 1.2);
			if (u >= 10.8) ver = "old";
		}
		const beat = still || phase(t, 1.2, i * 0.13) < 0.25;
		dot(c, 48, ry, 3, beat ? R4.lit : "#2f6b4a");
		chip(c, 62, ry, 0.85, ver === "new" ? R4.purpleLight : OLD);
		rrect(c, 74, ry - 3, 180, 6, 3, "#2a3647");
		rrect(c, 74, ry - 3, Math.max(6, 180 * misses), 6, 3, misses > 0.4 ? "#ff6a5c" : R4.dataHi);
	});
	// The engineer's viewer: camera picture and streams on one timeline.
	const vx = 272;
	rrect(c, vx, 40, 82, 92, 6, "#2b3038");
	rrect(c, vx + 5, 45, 72, 44, 3, "#cfe8f5");
	c.fillStyle = "#a9bccb";
	c.fillRect(vx + 6, 78, 70, 10);
	tote(c, vx + 12, 70, 22, 12);
	softFingers(c, vx + 26, 62, 0.5, 0.15);
	grapes(c, vx + 27, 70, 0.4, 1, 0.7);
	const scrub = u >= 11.8 ? smooth((u - 11.8) / 2) : 0;
	for (const [k, color] of [
		[0, ORANGE],
		[1, "#3d7fd1"],
	])
		stroke(
			c,
			[
				[vx + 6, 100 + k * 9],
				[vx + 76, 100 + k * 9 + (k ? -2 : 2)],
			],
			color,
			1.6,
		);
	stroke(
		c,
		[
			[vx + 6 + scrub * 70, 92],
			[vx + 6 + scrub * 70, 124],
		],
		R4.reject,
		1.8,
	);
	rrect(c, vx + 28, 132, 26, 8, 2, "#2b3038");
	// The saved failure travels to the viewer after the rollback.
	if (u >= 10.8 && u < 11.8) {
		const k = smooth((u - 10.8) / 1);
		const fx = 254 + (vx + 41 - 254) * k;
		const fy = rows[REG] + (66 - rows[REG]) * k - Math.sin(k * Math.PI) * 20;
		rrect(c, fx - 8, fy - 6, 16, 12, 2, "#2b3038", "#ffffff", 1);
		for (let s = 0; s < 3; s++) c.fillRect(fx - 6 + s * 5, fy - 5, 2, 2);
	}
}

/**
 * next-pick: last time the tangled bunch hung half out of the fingers and needed help. Now a
 * tangled pair like it lies in the tote, and the new model, on a computer beside the arm, plans
 * about a second of targets at a time (the dots ahead of the fingers, replanned every half
 * second): the arm frees one bunch and sets it in the tray without help.
 */
function nextPick(c, t, still) {
	// The earlier attempt, faded.
	c.save();
	c.globalAlpha = 0.5;
	rrect(c, 8, 22, 116, 160, 10, PANEL);
	c.fillStyle = "#c9ccd0";
	c.fillRect(14, 166, 104, 5);
	tote(c, 66, 140, 40, 26);
	sixAxis(c, 30, 166, [80, 108], { s: 0.8, open: 0.1 });
	grapes(c, 82, 118, 0.7, 1, 0.75);
	grapes(c, 74, 132, 0.62, 1, -0.3);
	c.restore();
	badge(c, 110, 36, 11, "cross");
	joystick(c, 26, 46, 0.9, "rgba(43,51,64,0.7)");
	arrow(c, 132, 152, 101);
	// The new pick.
	c.fillStyle = "#c9ccd0";
	c.fillRect(160, 178, 192, 6);
	const period = 4.2;
	const pose = (tt) => {
		const u = phase(tt, period);
		const k = shuttle(tt, period);
		return { u, x: 252 + (316 - 252) * k, y: 146 - Math.sin(k * Math.PI) * 44 };
	};
	const tt = still ? 1.6 : t;
	const p = pose(tt);
	// The computer beside the arm, cabled to the base.
	rrect(c, 162, 120, 30, 58, 4, R4.slate);
	c.fillStyle = R4.purple;
	c.fillRect(166, 128, 22, 4);
	for (let k = 0; k < 3; k++) {
		c.fillStyle = "#2b3442";
		c.fillRect(167, 140 + k * 7, 20, 3);
	}
	stroke(
		c,
		[
			[192, 172],
			[214, 172],
		],
		R4.purple,
		2.4,
	);
	tote(c, 234, 150, 40, 28);
	// The tote holds a tangled pair like the earlier one (stems knotted). From the grasp until
	// the next cycle the policy has freed one on its own and the other stays behind.
	const picked = p.u >= 0.1 && p.u < 0.97;
	lyingGrapes(c, 263, 171, 0.7);
	if (!picked) {
		lyingGrapes(c, 249, 173, 0.7);
		c.beginPath();
		c.moveTo(252, 168);
		c.bezierCurveTo(258, 160, 252, 172, 259, 166);
		c.strokeStyle = "#5d7b34";
		c.lineWidth = 2;
		c.lineCap = "round";
		c.stroke();
	}
	tray(c, 292, 166, 56, 12);
	// The current chunk: future targets from the last plan that have not been played yet.
	const every = period * 0.12;
	const len = period * 0.24;
	const planned = Math.floor(tt / every) * every;
	for (let j = 1; j <= 8; j++) {
		const tj = planned + (j / 8) * len;
		if (tj <= tt) continue;
		const q = pose(tj);
		dot(c, q.x, q.y + 2, 2.4, R4.data);
	}
	dot(c, 184, 160, 2.6, still || tt - planned < 0.15 ? R4.lit : "#59626c");
	const holding = p.u > 0.1 && p.u < 0.6;
	if (p.u >= 0.6 && p.u < 0.97) lyingGrapes(c, 318, 174, 0.75);
	sixAxis(c, 214, 178, [p.x, p.y], { s: 1, L1: 54, L2: 50, open: holding ? 0.05 : 0.8 });
	if (holding) grapes(c, p.x, p.y + 12, 0.75);
	if (p.u >= 0.6 && p.u < 0.97) badge(c, 334, 40, 14, "check");
}

const SCENES = {
	recording,
	upload,
	curation,
	dataset,
	training,
	simulation,
	"real-eval": realEval,
	rollout,
	fleet,
	"next-pick": nextPick,
};

// ---------------------------------------------------------------------------

/** Mount the close-up for a stop into el. Returns a cleanup function. */
export function mountCloseup(stopId, el, ctx) {
	const scene = SCENES[stopId];
	if (!scene) return () => {};
	loadCss("css/modules/ride4.css");
	el.classList.add("closeup-r4");
	const canvas = document.createElement("canvas");
	canvas.className = "closeup-canvas";
	canvas.setAttribute("aria-hidden", "true");
	el.append(canvas);
	const c = canvas.getContext("2d");
	let w = 0;
	let h = 0;
	let dpr = 1;
	let raf = 0;
	let alive = true;
	const t0 = performance.now();

	const size = () => {
		w = Math.max(200, el.clientWidth || 320);
		h = Math.round(Math.min(230, Math.max(150, (w * 9) / 16)));
		dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(h * dpr);
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
	};
	const draw = (now) => {
		raf = 0;
		if (!alive) return;
		const still = ctx.reducedMotion();
		const t = (now - t0) / 1000;
		const s = Math.min(w / W, h / H);
		c.setTransform(dpr, 0, 0, dpr, 0, 0);
		c.clearRect(0, 0, w, h);
		c.setTransform(dpr * s, 0, 0, dpr * s, dpr * ((w - W * s) / 2), dpr * ((h - H * s) / 2));
		scene(c, t, still);
		if (!still) raf = requestAnimationFrame(draw);
	};
	const redraw = () => {
		if (!raf) raf = requestAnimationFrame(draw);
	};
	size();
	draw(performance.now());
	const ro = new ResizeObserver(() => {
		const before = w;
		size();
		if (before !== w || ctx.reducedMotion()) {
			cancelAnimationFrame(raf);
			raf = 0;
			draw(performance.now());
		}
	});
	ro.observe(el);
	const offMotion = bus.on("motion", () => {
		cancelAnimationFrame(raf);
		raf = 0;
		redraw();
	});
	return () => {
		alive = false;
		cancelAnimationFrame(raf);
		ro.disconnect();
		offMotion();
		canvas.remove();
		el.classList.remove("closeup-r4");
	};
}
