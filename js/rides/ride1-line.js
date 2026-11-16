// Ride 1 line timing and tray drawing. The tray belt indexes: it moves every tray one pitch,
// stops, and every station works on a still tray before the next move. One drawing cycle is one
// plate (the drawing compresses the real cycle so the motion reads). Every so often a tray leaves
// the cheese station one wedge short; inspection marks it and the pusher sends it to the rework
// lane, so the stations after it see a gap. Drawing code only.

import { drawAppleSlice, drawCheeseWedge, drawCrackerPack, drawGrapes, drawPlate, FOOD } from "../engine/food.js";

export const LINE_X = 24; // conveyor centerline
export const BELT = [23.4, 24.6]; // conveyor frame, x
export const BELT_Z = 0.85;
export const HEADING = Math.PI / 2; // the line runs toward +y

export const CYCLE = 6; // seconds per index cycle in the drawing
export const MOVE = 1; // seconds of each cycle the belt is moving
export const PITCH = 2.25; // m between rest positions (drawing scale)
export const Y0 = 32; // rest position under the denester
export const LAST_SLOT = 16; // rest position at the outfeed

/** Rest position (slot) of each stop; stop ids are fixed in ARCHITECTURE.md. */
export const SLOT = { denester: 0, infeed: 2, grapes: 4, apples: 6, crackers: 8, cheese: 10, inspection: 12, lidding: 14, outfeed: 16 };
export const REJECT_SLOT = 13; // the pusher sits one step after the camera
export const PRINT_SLOT = 15; // the code printer sits one step before the outfeed

export const slotY = (j) => Y0 + j * PITCH;

/** Stop positions along the line. */
export const STOP_Y = Object.fromEntries(Object.entries(SLOT).map(([id, j]) => [id, slotY(j)]));

export const ease = (v) => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v));
export const lerp = (a, b, k) => a + (b - a) * k;

export function clock(t) {
	const n = Math.floor(t / CYCLE);
	return { n, u: t - n * CYCLE };
}

/** Belt travel within a cycle: 0 at the start of the move, 1 once stopped. */
export const travel = (u) => ease(u / MOVE);

/** Sub-cycle length of the delta and SCARA picks. */
export const SUB = { delta: 1.25, scara: 1.5 };

/** When each station finishes its part of the plate, in seconds after the belt starts moving. */
export const EVENT = {
	drop: [MOVE, MOVE + 0.7],
	grapes: 3.7,
	apples: [0, 1, 2, 3].map((i) => MOVE + i * SUB.delta + 0.75),
	crackers: [0, 1].map((i) => MOVE + i * SUB.scara + 0.95),
	cheese: [0, 1, 2].map((i) => MOVE + i * SUB.delta + 0.75),
	inspect: MOVE + 0.8,
	push: [MOVE + 0.5, MOVE + 1.3],
	lid: 2.4,
	print: MOVE + 0.9,
	lift: MOVE + 0.6,
	drawer: MOVE + 3.0,
};

/** Trays that leave the cheese station one wedge short (inspection rejects them). */
export const isReject = (m) => ((m % 7) + 7) % 7 === 3;

/** Id of the tray in slot j during cycle n (it moves from slot j - 1 into j during the move). */
export const trayIn = (j, n) => n - j + 1;

/** Whether the tray in slot j is still on the belt (rejected trays leave at the pusher). */
export function onBelt(m, j, u) {
	if (!isReject(m)) return true;
	return j < REJECT_SLOT || (j === REJECT_SLOT && u < EVENT.push[0]);
}

/** What tray m holds while it is in slot j at cycle phase u. */
export function contents(m, j, u) {
	const dwell = u >= MOVE;
	const passed = (id) => SLOT[id] < j;
	const here = (id) => dwell && SLOT[id] === j;
	const count = (id, times, max) => (passed(id) ? max : here(id) ? times.filter((x) => u >= x).length : 0);
	const reject = isReject(m);
	return {
		grapes: passed("grapes") || (here("grapes") && u >= EVENT.grapes) ? 1 : 0,
		apples: count("apples", EVENT.apples, 4),
		crackers: count("crackers", EVENT.crackers, 2),
		cheese: Math.min(reject ? 2 : 3, count("cheese", EVENT.cheese, 3)),
		mark: passed("inspection") || (here("inspection") && u >= EVENT.inspect) ? (reject ? "fail" : "pass") : null,
		lid: passed("lidding") || (here("lidding") && u >= EVENT.lid),
		code: j > PRINT_SLOT || (j === PRINT_SLOT && dwell && u >= EVENT.print),
	};
}

export const FULL = { grapes: 1, apples: 4, crackers: 2, cheese: 3, mark: "pass", lid: true, code: true };

// ---------------------------------------------------------------------------
// Tray drawing with partial contents (food.js draws whole sets; the line shows them arriving)

function frame(cx, cy, z, heading, s) {
	const ca = Math.cos(heading);
	const sa = Math.sin(heading);
	return (f, sd, zz = 0) => [cx + (f * ca - sd * sa) * s, cy + (f * sa + sd * ca) * s, z + zz * s];
}

/** Item layout matches drawPlate in food.js, so a set that completes does not jump. */
function drawItems(r, cx, cy, z, c, s, lw) {
	const at = frame(cx, cy, z, HEADING, s);
	const items = [];
	const push = (f, sd, fn) => {
		const p = at(f, sd, 0);
		items.push({ d: p[0] + p[1], fn });
	};
	if (c.grapes) push(-0.15, -0.1, () => drawGrapes(r, (f, sd, zz) => at(f - 0.14, sd - 0.1, zz), s, lw));
	for (let i = 0; i < c.apples; i++) push(0.06 + i * 0.055, -0.1, () => drawAppleSlice(r, at, 0.06 + i * 0.055, -0.1, HEADING + 1.2, s, lw));
	for (let i = 0; i < c.crackers; i++) push(-0.15, 0.05 + i * 0.1, () => drawCrackerPack(r, at, -0.15, 0.05 + i * 0.1, HEADING, s));
	for (let i = 0; i < c.cheese; i++) push(0.08 + i * 0.07, 0.1, () => drawCheeseWedge(r, at, 0.08 + i * 0.07, 0.1, HEADING + i * 0.9, s));
	items.sort((a, b) => a.d - b.d);
	for (const it of items) it.fn();
}

/** Round inspection badge at a projected point; glyph draws the mark in badge units. */
function badge(r, x, y, z, color, glyph) {
	r.billboard(x, y, z, (ctx, zoom) => {
		const k = Math.min(2.2, Math.max(0.7, zoom));
		ctx.beginPath();
		ctx.arc(0, 0, 9 * k, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.lineWidth = 1.5 * k;
		ctx.strokeStyle = "#ffffff";
		ctx.stroke();
		ctx.beginPath();
		glyph(ctx, k);
		ctx.lineWidth = 2.2 * k;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.stroke();
	});
}

/** Red badge with a cross: the camera failed this plate. */
function failMark(r, x, y, z) {
	badge(r, x, y, z, "#d9483b", (ctx, k) => {
		ctx.moveTo(-3.5 * k, -3.5 * k);
		ctx.lineTo(3.5 * k, 3.5 * k);
		ctx.moveTo(3.5 * k, -3.5 * k);
		ctx.lineTo(-3.5 * k, 3.5 * k);
	});
}

/** Green badge with a check: the camera passed this plate (same mark as drawPlate's). */
export function passMark(r, x, y, z) {
	badge(r, x, y, z, FOOD.pass, (ctx, k) => {
		ctx.moveTo(-4.2 * k, 0.2 * k);
		ctx.lineTo(-1.2 * k, 3.2 * k);
		ctx.lineTo(4.4 * k, -3.4 * k);
	});
}

/** Printed code label on the lid: a white patch with bars. */
export function codeMark(r, cx, cy, z, s = 1, lw = 1, heading = HEADING) {
	const at = frame(cx, cy, z, heading, s);
	const zz = 0.182;
	r.quad([at(0.13, -0.2, zz), at(0.29, -0.2, zz), at(0.29, -0.07, zz), at(0.13, -0.07, zz)], "#ffffff", { flat: true });
	for (let i = 0; i < 6; i++) {
		const f = 0.15 + i * 0.024 + (i % 2) * 0.006;
		r.line(at(f, -0.185, zz + 0.002), at(f, -0.085, zz + 0.002), "#1f2933", (i % 3 === 0 ? 1.4 : 0.8) * s * lw);
	}
}

/** A tray as the line shows it; c from contents(). */
export function drawTray(r, x, y, z, c, opts = {}) {
	const s = opts.scale ?? 1;
	const lw = opts.lineScale ?? 1;
	const whole = (n, max) => n === 0 || n === max;
	if (whole(c.apples, 4) && whole(c.crackers, 2) && whole(c.cheese, 3) && c.mark !== "fail") {
		drawPlate(r, x, y, z, HEADING, { grapes: c.grapes > 0, apples: c.apples > 0, crackers: c.crackers > 0, cheese: c.cheese > 0, pass: c.mark === "pass", lid: c.lid }, opts);
	} else {
		drawPlate(r, x, y, z, HEADING, {}, opts);
		drawItems(r, x, y, z, c, s, lw);
		if (c.mark === "fail") failMark(r, x, y, z + 0.34 * s);
	}
	if (c.code && c.lid) codeMark(r, x, y, z, s, lw);
}
