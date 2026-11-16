// Ride 1 machines outside the pick cage: the scroll denester with its photo-eye, the infeed, the
// inspection camera with its reject pusher and rework lane, the rigid-lid lidder (lid magazine,
// air-driven placer, press, stack light), the code printer, the outfeed gantry loading an open
// trolley drawer behind a light curtain, and the line HMI. Drawing code only.

import { drawTrayStack, FOOD } from "../engine/food.js";
import { object, PAL } from "../engine/park.js";
import {
	BELT,
	BELT_Z,
	clock,
	contents,
	CYCLE,
	drawTray,
	ease,
	EVENT,
	FULL,
	HEADING,
	isReject,
	LAST_SLOT,
	LINE_X,
	lerp,
	MOVE,
	onBelt,
	PRINT_SLOT,
	REJECT_SLOT,
	SLOT,
	slotY,
	STOP_Y,
	travel,
	trayIn,
} from "./ride1-line.js";
import { gantryCarriage, gantryPost, gantryRail } from "./ride1-robots.js";

const GUARD = { post: "#8f9ba7", rail: "#6f7b87", panel: "#cde7f4", h: 1.85 };
const seg = (u, a, b) => ease((u - a) / (b - a));

function guardPanel(r, a, b, opts = {}) {
	const h = opts.h ?? GUARD.h;
	const z0 = opts.z0 ?? 0;
	r.quad(
		[
			[a[0], a[1], z0 + 0.12],
			[b[0], b[1], z0 + 0.12],
			[b[0], b[1], h],
			[a[0], a[1], h],
		],
		GUARD.panel,
		{ alpha: 0.34, flat: true },
	);
	r.line([a[0], a[1], h], [b[0], b[1], h], GUARD.rail, 3);
	r.line([a[0], a[1], z0 + 0.12], [b[0], b[1], z0 + 0.12], GUARD.rail, 2.4);
	if (!opts.noPosts) for (const p of [a, b]) r.box(p[0] - 0.05, p[1] - 0.05, z0, 0.1, 0.1, h - z0 + 0.02, GUARD.post);
}

/** Tray in slot j now, or null when the slot is empty (rejected tray gone, or none yet). */
function trayAt(j, n, u) {
	const m = trayIn(j, n);
	return onBelt(m, j, u) ? m : null;
}

// ---------------------------------------------------------------------------
// Denester: a magazine of nested trays on a guarded frame; four scroll screws turn and drop the
// bottom tray onto the belt. A photo-eye just past it confirms each tray arrived.

const DEN = { x0: 22.75, x1: 25.25, y0: 30.95, y1: 33.05, deck: 1.3, stack: 18 };
const EYE_Y = 33.45;

function scrollScrew(r, x, y, z0, h, phase) {
	r.cylinder(x, y, z0, 0.05, h, "#c4ccd4", 8);
	const pts = [];
	for (let i = 0; i <= 14; i++) {
		const a = phase + (i / 14) * Math.PI * 4;
		pts.push([x + Math.cos(a) * 0.052, y + Math.sin(a) * 0.052, z0 + (i / 14) * h]);
	}
	r.polyline(pts, "#55616d", 1.3);
}

export function buildDenester(scene, ctx, T) {
	const g = ctx.group;
	const { x0, x1, y0, y1, deck } = DEN;
	const y = STOP_Y.denester;
	// Back leg and the back guard panel (static, behind the falling tray).
	object(
		scene,
		x0 - 0.1,
		y0 - 0.1,
		x0 + 0.1,
		y1 + 0.1,
		deck,
		(r) => {
			r.box(x0, y0, 0, 0.1, 0.1, deck, PAL.steel);
			guardPanel(r, [x0 + 0.05, y0 + 0.05], [x0 + 0.05, y1 - 0.05], { h: deck, noPosts: true });
		},
		{ group: g },
	);
	// Top frame, magazine, screws, front legs, and the front guard: drawn after the tray dropping
	// out underneath.
	scene.addDynamic({
		group: g,
		depth: LINE_X + y + 1.2,
		bounds: [x0, y0, 0, x1, y1, deck + 1.4],
		animated: () => true,
		draw: (r, t0) => {
			const { u } = clock(T(t0));
			const turning = seg(u, EVENT.drop[0], EVENT.drop[0] + 0.5);
			r.box(x1 - 0.1, y0, 0, 0.1, 0.1, deck, PAL.steel);
			// Top frame and a collar around the magazine; the trays drop through the collar.
			const ox = [LINE_X - 0.32, LINE_X + 0.32];
			const oy = [y - 0.42, y + 0.42];
			const blue = "#2f6fb3";
			r.box(x0, y0, deck, 0.1, y1 - y0, 0.1, PAL.steel);
			r.box(x0, oy[0] - 0.14, deck, x1 - x0, 0.12, 0.12, blue);
			r.box(ox[0] - 0.14, oy[0] - 0.02, deck, 0.12, oy[1] - oy[0] + 0.04, 0.12, blue);
			r.box(ox[1] + 0.02, oy[0] - 0.02, deck, 0.12, oy[1] - oy[0] + 0.04, 0.12, blue);
			r.box(x0, oy[1] + 0.02, deck, x1 - x0, 0.12, 0.12, blue);
			r.box(x1 - 0.1, y0, deck, 0.1, y1 - y0, 0.1, PAL.steel);
			// Scroll screws at the corners of the stack.
			const corners = [
				[-0.3, -0.4],
				[0.3, -0.4],
				[-0.3, 0.4],
				[0.3, 0.4],
			];
			for (const [dx, dy] of corners.slice(0, 2)) scrollScrew(r, LINE_X + dx, y + dy, deck - 0.12, 0.3, turning * Math.PI * 2 * (dx > 0 ? -1 : 1));
			drawTrayStack(r, LINE_X, y, deck + 0.12, HEADING, DEN.stack, { scale: 1.15 });
			for (const [dx, dy] of corners) r.box(LINE_X + dx * 1.08 - 0.03, y + dy * 1.08 - 0.03, deck + 0.12, 0.06, 0.06, 0.95, PAL.metal);
			for (const [dx, dy] of corners.slice(2)) scrollScrew(r, LINE_X + dx, y + dy, deck - 0.12, 0.3, turning * Math.PI * 2 * (dx > 0 ? -1 : 1));
			r.box(x0, y1 - 0.1, 0, 0.1, 0.1, deck, PAL.steel);
			r.box(x1 - 0.1, y1 - 0.1, 0, 0.1, 0.1, deck, PAL.steel);
			guardPanel(r, [x1 - 0.05, y0 + 0.05], [x1 - 0.05, y1 - 0.05], { h: deck, noPosts: true });
			// The magazine is refilled from outside the guard: a step at the front.
			r.box(x1 + 0.05, y - 0.45, 0, 0.45, 0.9, 0.22, "#c9ccd0", { top: "#d8dbde" });
		},
	});
	// Photo-eye: the beam stops at the tray while a tray is passing.
	scene.addDynamic({
		group: g,
		depth: LINE_X + EYE_Y + 0.6,
		bounds: [BELT[0] - 0.3, EYE_Y - 0.2, 0, BELT[1] + 0.3, EYE_Y + 0.2, 1.3],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			const yt = slotY(travel(u)); // the tray moving from slot 0 to slot 1
			const blocked = u < MOVE && Math.abs(yt - EYE_Y) < 0.32 && trayAt(1, n, u) !== null;
			const zb = BELT_Z + 0.11;
			for (const x of [BELT[0] - 0.2, BELT[1] + 0.1]) {
				r.box(x, EYE_Y - 0.05, 0, 0.1, 0.1, zb + 0.12, PAL.steel);
				r.box(x - 0.02, EYE_Y - 0.08, zb - 0.06, 0.14, 0.16, 0.14, "#2b2f36");
			}
			r.line([BELT[0] - 0.08, EYE_Y, zb], [blocked ? LINE_X - 0.24 : BELT[1] + 0.1, EYE_Y, zb], "rgba(235,60,50,0.9)", 1.4);
			r.sphere(BELT[1] + 0.15, EYE_Y, zb + 0.13, 0.04, blocked ? "#43c46b" : "#3e5a46", 0);
		},
	});
}

// ---------------------------------------------------------------------------
// Infeed: side guides square the tray up; a gearmotor drives the indexing belt.

export function buildInfeed(scene, ctx) {
	const y = STOP_Y.infeed;
	object(
		scene,
		23.3,
		y - 2.3,
		25.2,
		y + 2.3,
		1.1,
		(r) => {
			for (const yy of [y - 2.0, y + 1.9]) {
				r.box(23.42, yy, 0.55, 0.06, 0.08, 0.45, PAL.steel);
				r.box(24.52, yy, 0.55, 0.06, 0.08, 0.45, PAL.steel);
			}
			r.box(23.5, y - 2.2, 0.96, 0.05, 4.4, 0.08, PAL.metal);
			r.box(24.45, y - 2.2, 0.96, 0.05, 4.4, 0.08, PAL.metal);
			// Gearmotor that indexes the tray belt.
			r.box(24.62, y - 1.75, 0.38, 0.28, 0.4, 0.3, "#2f6fb3");
			r.tube([24.76, y - 1.35, 0.53], [24.76, y - 0.85, 0.53], 0.12, "#55616d", 10);
		},
		{ group: ctx.group },
	);
}

// ---------------------------------------------------------------------------
// Inspection: a camera in a lit tunnel decides pass or fail; the pusher one step further down
// pushes failed plates off the front of the belt onto a rework lane, where a person fixes them or
// throws them away.

const LANE = { x0: BELT[1], x1: 26.6, y: slotY(REJECT_SLOT), off: 25.1, rest: 26.0 };

/** Latest rejected tray already pushed by time (n, u), and seconds since its push began. */
function lastReject(n, u) {
	for (let m = n - (REJECT_SLOT - 1); m > n - REJECT_SLOT - 20; m--) {
		if (!isReject(m)) continue;
		const nPush = m + REJECT_SLOT - 1;
		if (nPush < n || u >= EVENT.push[0]) return { m, since: (n - nPush) * CYCLE + u - EVENT.push[0] };
	}
	return null;
}

/** Tray x while it is pushed off the belt and rolls down the lane. */
function rejectX(since) {
	if (since < 0.2) return LINE_X;
	if (since < 0.7) return lerp(LINE_X, LANE.off, ease((since - 0.2) / 0.5));
	return lerp(LANE.off, LANE.rest, ease((since - 0.7) / 0.8));
}

export function buildInspection(scene, ctx, T) {
	const y = STOP_Y.inspection;
	const g = ctx.group;
	const ly = LANE.y;
	const laneZ = BELT_Z - 0.04;
	// Rework lane: a short roller table in front of the belt, with a bin at its end.
	object(
		scene,
		LANE.x0,
		ly - 0.5,
		LANE.x1 + 0.6,
		ly + 0.5,
		1,
		(r) => {
			const z = laneZ;
			for (const x of [LANE.x0 + 0.15, LANE.x1 - 0.2]) {
				r.box(x, ly - 0.38, 0, 0.08, 0.08, z - 0.06, PAL.dark);
				r.box(x, ly + 0.3, 0, 0.08, 0.08, z - 0.06, PAL.dark);
			}
			r.box(LANE.x0, ly - 0.42, z - 0.1, LANE.x1 - LANE.x0, 0.06, 0.12, PAL.steel);
			for (let x = LANE.x0 + 0.1; x < LANE.x1; x += 0.18) r.line([x, ly - 0.36, z], [x, ly + 0.36, z], "#9aa5b1", 1.6);
			r.box(LANE.x0, ly + 0.36, z - 0.1, LANE.x1 - LANE.x0, 0.06, 0.12, PAL.steel);
			r.box(LANE.x1 - 0.06, ly - 0.42, z - 0.1, 0.06, 0.84, 0.25, "#d9483b");
			r.box(LANE.x1 + 0.05, ly - 0.28, 0, 0.5, 0.56, 0.55, "#55616d", { top: "#3b4048" });
		},
		{ group: g },
	);
	// The pusher behind the belt: drawn before the tray it pushes.
	scene.addDynamic({
		group: g,
		depth: 23 + ly,
		bounds: [22.2, ly - 0.5, 0, LANE.off, ly + 0.5, 1.3],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			const rj = lastReject(n, u);
			const s = rj ? rj.since : 99;
			// Paddle: approach, push the tray past the front edge of the belt, retract.
			const contact = LINE_X - 0.26 - (BELT[0] - 0.12);
			const stroke = contact + (LANE.off - LINE_X);
			const out = s < 0.2 ? contact * ease(s / 0.2) : s < 0.7 ? contact + (stroke - contact) * ease((s - 0.2) / 0.5) : s < 1.1 ? stroke * (1 - ease((s - 0.7) / 0.4)) : 0;
			const px = BELT[0] - 0.12 + out;
			r.box(22.45, ly - 0.08, 0, 0.12, 0.16, BELT_Z + 0.05, PAL.steel);
			r.box(22.35, ly - 0.12, BELT_Z + 0.04, 0.75, 0.24, 0.2, "#c4ccd4");
			r.box(23.1, ly - 0.03, BELT_Z + 0.1, px - 23.1, 0.06, 0.06, PAL.metal);
			r.box(px, ly - 0.36, BELT_Z + 0.03, 0.05, 0.72, 0.18, "#2f6fb3");
		},
	});
	// The rejected tray, from the push until the next reject replaces it.
	scene.addDynamic({
		group: g,
		depth: () => {
			const { n, u } = clock(T(scene.time));
			const rj = lastReject(n, u);
			return (rj ? rejectX(rj.since) : LANE.rest) + ly - 0.1;
		},
		bounds: [LINE_X - 0.5, ly - 0.5, 0, LANE.x1, ly + 0.5, 1.4],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			const rj = lastReject(n, u);
			if (!rj) return;
			const x = rejectX(rj.since);
			drawTray(r, x, ly, x < LANE.off ? BELT_Z : laneZ, contents(rj.m, REJECT_SLOT, CYCLE - 0.01));
		},
	});
	// Camera tunnel (covers trays riding through), lit from inside, with a result lamp.
	scene.addDynamic({
		group: g,
		depth: LINE_X + y + 1.4,
		bounds: [22.9, y - 0.8, 0, 25.4, y + 0.8, 2.4],
		animated: () => true,
		draw: (r, t0) => {
			const t = T(t0);
			const { n, u } = clock(t);
			const m = trayAt(SLOT.inspection, n, u);
			const decided = u >= EVENT.inspect && m !== null;
			r.box(22.95, y - 0.75, BELT_Z - 0.1, 0.14, 1.5, 1.05, "#d7dce2");
			r.box(24.91, y - 0.75, BELT_Z - 0.1, 0.14, 1.5, 1.05, "#d7dce2", { alpha: 0.85 });
			r.box(22.95, y - 0.75, 1.8, 2.1, 1.5, 0.14, "#2f6fb3");
			r.box(23.75, y - 0.2, 1.94, 0.5, 0.4, 0.3, PAL.dark);
			r.cylinder(24.0, y + 0.25, 1.98, 0.09, 0.12, "#111418", 8);
			const blink = ctx.reducedMotion() ? 1 : 0.6 + 0.4 * Math.sin(t * 3);
			r.box(25.06, y - 0.6, 1.1, 0.03, 1.2, 0.12, `rgba(255,248,200,${blink.toFixed(2)})`);
			const lamp = !decided ? "#5b6470" : isReject(m) ? "#e0473a" : "#3fbf68";
			r.sphere(24.95, y + 0.55, 2.04, 0.09, lamp, 0);
		},
	});
}

// ---------------------------------------------------------------------------
// Lidding: a lid magazine (its own denester), an air-driven placer that sets a rigid clear lid on
// the tray, and a press that snaps it over the rim. The stack light shows the lidder's own state.

const LID = { mag: [21.85, STOP_Y.lidding], magZ: 0.55, lids: 8, lidH: 0.06 };
const ARM_Z = 1.62; // underside of the placer's slide arm
const PRESS_Z = 1.95; // the press hangs from a cantilever at this height

function lidShape(r, x, y, z, alpha = 0.55) {
	r.orientedBox(x, y, z, 0.66, 0.48, 0.13, HEADING, FOOD.lid, { alpha, edge: "rgba(255,255,255,0.8)" });
}

export function buildLidding(scene, ctx, T) {
	const y = STOP_Y.lidding;
	const g = ctx.group;
	const [mx, my] = LID.mag;
	const magTop = (k) => LID.magZ + (k - 1) * LID.lidH + 0.13;
	const pose = (n, u) => {
		const present = trayAt(SLOT.lidding, n, u) !== null;
		const top = magTop(LID.lids);
		const up = top + 0.25;
		const seat = BELT_Z + 0.18; // cups on top of a seated lid
		// Take the top lid from the magazine while the belt moves.
		let z = u < 0.6 ? lerp(up, top, seg(u, 0, 0.6)) : u < 1.0 ? lerp(top, up, seg(u, 0.6, 1.0)) : up;
		// No tray arrived (the lidder is starved): hold the lid over the magazine and wait.
		if (!present) return { x: mx, z, hold: u >= 0.6, press: 0, present };
		const x = u < 1.0 ? mx : u < 1.7 ? lerp(mx, LINE_X, seg(u, 1.0, 1.7)) : u < 2.7 ? LINE_X : lerp(LINE_X, mx, seg(u, 2.7, 3.4));
		if (u >= 1.7 && u < EVENT.lid) z = lerp(up, seat, seg(u, 1.7, EVENT.lid));
		else if (u >= EVENT.lid && u < 2.7) z = lerp(seat, up, seg(u, EVENT.lid, 2.7));
		const press = u < 3.2 ? 0 : u < 3.6 ? seg(u, 3.2, 3.6) : 1 - seg(u, 3.6, 4.0);
		return { x, z, hold: u >= 0.6 && u < EVENT.lid, press, present };
	};
	// Lid magazine behind the belt: a lid leaves the top when the placer takes it.
	object(scene, mx - 0.4, my - 0.5, mx + 0.4, my + 0.5, 1, (r) => r.box(mx - 0.38, my - 0.45, 0, 0.76, 0.9, LID.magZ, PAL.steel), { group: g });
	scene.addDynamic({
		group: g,
		depth: mx + my + 0.2,
		bounds: [mx - 0.4, my - 0.5, LID.magZ, mx + 0.4, my + 0.5, 1.6],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			const p = pose(n, u);
			const count = LID.lids - (p.hold || (p.present && u >= 0.6) ? 1 : 0);
			for (const [dx, dy] of [
				[-0.27, -0.37],
				[0.27, -0.37],
			])
				r.box(mx + dx - 0.02, my + dy - 0.02, LID.magZ, 0.04, 0.04, 0.7, PAL.metal);
			for (let i = 0; i < count; i++) lidShape(r, mx, my, LID.magZ + i * LID.lidH);
			for (const [dx, dy] of [
				[-0.27, 0.37],
				[0.27, 0.37],
			])
				r.box(mx + dx - 0.02, my + dy - 0.02, LID.magZ, 0.04, 0.04, 0.7, PAL.metal);
		},
	});
	// Machine: the placer's slide and arm, the press on a cantilever from two front posts, the
	// lidder's own panel and stack light. Drawn after the tray.
	scene.addDynamic({
		group: g,
		depth: LINE_X + y + 1.5,
		bounds: [21.1, y - 0.8, 0, 25.4, y + 0.8, 2.9],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			const p = pose(n, u);
			// Placer: a fixed slide behind the belt and an arm that extends over the tray.
			r.box(21.2, y - 0.06, 0, 0.12, 0.12, ARM_Z, PAL.steel);
			r.box(21.2, y - 0.14, ARM_Z, 1.45, 0.28, 0.16, "#c4ccd4");
			r.box(21.4, y - 0.05, ARM_Z + 0.03, p.x - 21.4, 0.1, 0.1, PAL.metal);
			r.box(p.x - 0.07, y - 0.07, p.z + 0.05, 0.14, 0.14, ARM_Z - p.z - 0.05, PAL.steel);
			r.box(p.x - 0.2, y - 0.28, p.z + 0.02, 0.4, 0.56, 0.04, "#7f8b98");
			for (const dy of [-0.2, 0.2]) r.cylinder(p.x, y + dy, p.z, 0.04, 0.03, "#2f78c4", 6);
			if (p.hold) lidShape(r, p.x, y, p.z - 0.13, 0.6);
			// Press: a plate on an air cylinder that snaps the lid over the rim.
			const pz = lerp(PRESS_Z - 0.16, BELT_Z + 0.19, p.press);
			r.box(LINE_X - 0.04, y - 0.04, pz + 0.06, 0.08, 0.08, PRESS_Z - pz - 0.06, PAL.metal);
			r.box(LINE_X - 0.28, y - 0.38, pz, 0.56, 0.76, 0.06, "#7f8b98");
			r.box(LINE_X - 0.2, y - 0.1, PRESS_Z, 25.1 - LINE_X + 0.2, 0.2, 0.16, "#4b5d73");
			r.box(LINE_X - 0.15, y - 0.15, PRESS_Z + 0.16, 0.3, 0.3, 0.38, "#c4ccd4");
			for (const dy of [-0.6, 0.48]) r.box(25.02, y + dy, 0, 0.12, 0.12, PRESS_Z + 0.16, PAL.steel);
			r.box(25.0, y - 0.6, PRESS_Z, 0.16, 1.2, 0.16, "#4b5d73");
			// The lidder's own controller panel, facing the aisle.
			r.box(25.14, y - 0.3, 1.0, 0.1, 0.5, 0.42, "#d7dce2");
			r.box(25.245, y - 0.24, 1.07, 0.01, 0.38, 0.28, "#1f3a52");
			// Stack light: green running, amber starved (no tray arrived).
			const lx = 25.08;
			const ly = y + 0.54;
			r.cylinder(lx, ly, PRESS_Z + 0.16, 0.03, 0.12, PAL.dark, 6);
			const lamps = [
				["#43c46b", "#2e4a37", p.present],
				["#f2b630", "#5a4a24", !p.present],
				["#e0473a", "#4f2a27", false],
			];
			lamps.forEach(([on, off, lit], i) => r.cylinder(lx, ly, PRESS_Z + 0.28 + i * 0.1, 0.07, 0.09, lit ? on : off, 8));
		},
	});
}

// ---------------------------------------------------------------------------
// Code printer just before the outfeed.

export function buildPrinter(scene, ctx, T) {
	const y = slotY(PRINT_SLOT);
	scene.addDynamic({
		group: ctx.group,
		depth: LINE_X + y + 0.9,
		bounds: [23.6, y - 0.3, 0, 25.3, y + 0.3, 1.6],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			const printing = trayAt(PRINT_SLOT, n, u) !== null && u >= EVENT.print - 0.3 && u < EVENT.print + 0.2;
			r.box(24.95, y - 0.06, 0, 0.12, 0.12, 1.5, PAL.steel);
			r.box(23.85, y - 0.05, 1.42, 1.22, 0.1, 0.08, PAL.steel);
			const hz = printing ? 1.1 : 1.18;
			r.box(23.82, y - 0.12, hz, 0.36, 0.24, 1.42 - hz, "#3b4552");
			r.sphere(24.2, y + 0.13, hz + 0.18, 0.035, printing ? "#59b7ff" : "#2c3d4f", 0);
		},
	});
}

// ---------------------------------------------------------------------------
// Outfeed: a gantry lifts each lidded plate off the belt and lowers it from above into an open
// trolley drawer between the belt and the aisle. The trolley is swapped through an open slot on the
// aisle side, guarded by a light curtain set back from the gantry's reach.

/** A finished plate once it has left the belt (no inspection badge). */
const STORED = { ...FULL, mark: null };

const GAN = { x0: 23.05, x1: 26.45, y0: 66.75, y1: 69.25, h: 2.3 };
const TROLLEY = { x0: 24.95, x1: 26.1, y0: 67.1, y1: 68.9, floor: 0.3, top: 1.0, cols: [67.58, 68.42], high: 4, plate: 0.19 };
const OUT_CELL = { x0: 22.85, x1: 26.75, y0: 66.35, y1: 69.95, curtain: [66.85, 69.15] };
const TROLLEY_CX = (TROLLEY.x0 + TROLLEY.x1) / 2;

/** Plates already in the drawer at (n, u); the drawer holds cols x high, then the trolley is swapped. */
function drawerCount(n, u) {
	const cap = TROLLEY.cols.length * TROLLEY.high;
	const start = n - (((n % cap) + cap) % cap);
	let c = 0;
	for (let k = start; k <= n; k++) {
		const m = trayIn(LAST_SLOT, k);
		if (isReject(m)) continue;
		if (k < n || u >= EVENT.drawer) c++;
	}
	return Math.min(cap, c);
}

function gantryPose(n, u) {
	const present = trayAt(LAST_SLOT, n, u) !== null;
	const travelZ = 1.75;
	const pickZ = BELT_Z + 0.18;
	const slot = drawerCount(n, 0);
	const col = TROLLEY.cols[slot % TROLLEY.cols.length];
	const dropZ = TROLLEY.floor + Math.floor(slot / TROLLEY.cols.length) * TROLLEY.plate + 0.18;
	const y = STOP_Y.outfeed;
	if (!present) return { x: LINE_X, y, z: travelZ, hold: false };
	const M = MOVE;
	const frames = [
		[0, [LINE_X, y, travelZ]],
		[M, [LINE_X, y, travelZ]],
		[M + 0.5, [LINE_X, y, pickZ]],
		[EVENT.lift, [LINE_X, y, pickZ]],
		[M + 1.1, [LINE_X, y, travelZ]],
		[M + 2.2, [TROLLEY_CX, col, travelZ]],
		[EVENT.drawer, [TROLLEY_CX, col, dropZ]],
		[M + 3.5, [TROLLEY_CX, col, travelZ]],
		[M + 4.6, [LINE_X, y, travelZ]],
	];
	let v = frames[frames.length - 1][1];
	for (let i = 1; i < frames.length; i++) {
		if (u <= frames[i][0]) {
			const [u0, a] = frames[i - 1];
			const [u1, b] = frames[i];
			const k = ease((u - u0) / (u1 - u0 || 1));
			v = a.map((q, j) => lerp(q, b[j], k));
			break;
		}
	}
	return { x: v[0], y: v[1], z: v[2], hold: u >= EVENT.lift && u < EVENT.drawer };
}

export function buildOutfeed(scene, ctx, T) {
	const g = ctx.group;
	const { x0, x1, y0, y1, h } = GAN;
	const C = OUT_CELL;
	const T0 = TROLLEY;
	const tDepth = TROLLEY_CX + (T0.y0 + T0.y1) / 2;
	// Back guard panels (static, behind everything in the cell).
	object(
		scene,
		C.x0 - 0.1,
		C.y0 - 0.1,
		BELT[0],
		C.y1,
		GUARD.h,
		(r) => {
			guardPanel(r, [C.x0, C.y0], [C.x0, C.y1]);
			guardPanel(r, [C.x0, C.y0], [BELT[0] - 0.1, C.y0]);
		},
		{ group: g },
	);
	// Gantry back part: back post and rail, cross beam, carriage, and the plate it carries. Over the
	// trolley it sorts between the stacked plates and the trolley's front walls.
	scene.addDynamic({
		group: g,
		depth: () => {
			const { n, u } = clock(T(scene.time));
			const p = gantryPose(n, u);
			return p.x > BELT[1] + 0.2 ? tDepth : p.x + p.y + 0.5;
		},
		bounds: [x0 - 0.2, y0 - 0.2, 0, x1 + 0.2, y1 + 0.2, h + 0.5],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			const p = gantryPose(n, u);
			gantryPost(r, x0, y0, h);
			gantryRail(r, x0, y0, y1, h);
			gantryCarriage(r, x0, x1, p.y, h, p.x, p.z);
			if (p.hold) drawTray(r, p.x, p.y, p.z - 0.18, STORED);
		},
	});
	// Trolley with an open drawer: wheels, floor, back walls, and the stacked plates...
	scene.addDynamic({
		group: g,
		depth: tDepth - 0.3,
		bounds: [T0.x0, T0.y0, 0, T0.x1, T0.y1, T0.top + 0.4],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			const { x0: a, x1: b, y0: c, y1: d, floor, top } = T0;
			const metal = "#c9d0d7";
			for (const [wx, wy] of [
				[a + 0.12, c + 0.12],
				[b - 0.12, c + 0.12],
				[a + 0.12, d - 0.12],
				[b - 0.12, d - 0.12],
			])
				r.cylinder(wx, wy, 0, 0.06, 0.1, PAL.dark, 6);
			r.box(a, c, 0.1, b - a, d - c, floor - 0.1, metal);
			r.box(a, c, floor, 0.05, d - c, top - floor, metal);
			r.box(a, c, floor, b - a, 0.05, top - floor, metal);
			const count = drawerCount(n, u);
			for (let i = 0; i < count; i++) {
				const col = T0.cols[i % T0.cols.length];
				const z = floor + Math.floor(i / T0.cols.length) * T0.plate;
				drawTray(r, TROLLEY_CX, col, z, STORED);
			}
		},
	});
	// ...then its front walls and handle, after the gantry has lowered a plate in.
	scene.addDynamic({
		group: g,
		depth: tDepth + 0.3,
		bounds: [T0.x0, T0.y0, 0, T0.x1, T0.y1, T0.top],
		draw: (r) => {
			const { x0: a, x1: b, y0: c, y1: d, floor, top } = T0;
			const metal = "#c9d0d7";
			r.box(b - 0.05, c, floor, 0.05, d - c, top - floor, metal, { alpha: 0.9 });
			r.box(a, d - 0.05, floor, b - a, 0.05, top - floor, metal, { alpha: 0.9 });
			r.box(b - 0.01, c + 0.3, 0.55, 0.04, d - c - 0.6, 0.06, "#7f8b98");
		},
	});
	// Front gantry posts and the front rail.
	for (const [px, py] of [
		[x1, y0],
		[x0, y1],
	])
		scene.addDynamic({ group: g, depth: px + py + 0.3, bounds: [px - 0.1, py - 0.1, 0, px + 0.1, py + 0.1, h], draw: (r) => gantryPost(r, px, py, h) });
	scene.addDynamic({
		group: g,
		depth: x1 + y1 + 0.3,
		bounds: [x1 - 0.1, y0 - 0.1, 0, x1 + 0.1, y1 + 0.1, h + 0.2],
		draw: (r) => {
			gantryRail(r, x1, y0, y1, h);
			gantryPost(r, x1, y1, h);
		},
	});
	// Guarding in front: the upstream wall, the end wall, and the aisle side with the open slot
	// where the trolley is swapped, guarded by a light curtain.
	scene.add({ group: g, live: true, bounds: [BELT[1], C.y0 - 0.05, 0, C.x1, C.y0 + 0.05, GUARD.h], depth: (BELT[1] + C.x1) / 2 + C.y0, draw: (r) => guardPanel(r, [BELT[1] + 0.1, C.y0], [C.x1, C.y0]) });
	scene.add({ group: g, live: true, bounds: [C.x0, C.y1 - 0.05, 0, C.x1, C.y1 + 0.05, GUARD.h], depth: (C.x0 + C.x1) / 2 + C.y1 + 0.8, draw: (r) => guardPanel(r, [C.x0, C.y1], [C.x1, C.y1]) });
	scene.add({
		group: g,
		live: true,
		bounds: [C.x1 - 0.1, C.y0, 0, C.x1 + 0.7, C.y1, GUARD.h],
		depth: C.x1 + (C.y0 + C.y1) / 2 + 0.8,
		draw: (r) => {
			const [ca, cb] = C.curtain;
			r.ground(C.x1 + 0.1, ca, 0.55, cb - ca, "rgba(242,194,48,0.55)", 0.03);
			guardPanel(r, [C.x1, C.y0], [C.x1, ca - 0.08]);
			guardPanel(r, [C.x1, cb + 0.08], [C.x1, C.y1]);
			for (let i = 0; i < 6; i++) {
				const z = 0.3 + i * 0.24;
				r.line([C.x1, ca, z], [C.x1, cb, z], "rgba(235,60,50,0.22)", 1);
			}
			for (const y of [ca, cb]) {
				r.box(C.x1 - 0.06, y - 0.06, 0, 0.12, 0.12, 1.65, PAL.safety);
				r.box(C.x1 + 0.06, y - 0.025, 0.2, 0.02, 0.05, 1.35, PAL.dark);
			}
		},
	});
}

// ---------------------------------------------------------------------------
// Line HMI: one screen with a tile per station (green running, amber idle, red after a reject).

export function buildHmi(scene, ctx, T, stopIds) {
	const x = 26.35;
	const y = 57.4;
	scene.addDynamic({
		group: ctx.group,
		depth: x + y + 0.3,
		bounds: [x, y - 0.45, 0, x + 0.6, y + 0.45, 1.9],
		animated: () => true,
		draw: (r, t0) => {
			const { n, u } = clock(T(t0));
			r.box(x + 0.15, y - 0.12, 0, 0.3, 0.24, 0.9, "#9aa5b1");
			r.box(x, y - 0.42, 0.9, 0.6, 0.84, 0.75, "#d7dce2");
			const fx = x + 0.605;
			r.quad(
				[
					[fx, y - 0.36, 0.98],
					[fx, y + 0.36, 0.98],
					[fx, y + 0.36, 1.58],
					[fx, y - 0.36, 1.58],
				],
				"#1b2f42",
				{ flat: true },
			);
			// Most recent reject seen by the camera: the cheese tile stays red for two cycles.
			let recentReject = false;
			for (let k = n; k > n - 3; k--) {
				const m = trayIn(SLOT.inspection, k);
				if (isReject(m) && (k < n || u >= EVENT.inspect)) recentReject = true;
			}
			stopIds.forEach((id, i) => {
				const col = i % 3;
				const row = Math.floor(i / 3);
				const ya = y - 0.3 + col * 0.21;
				const za = 1.46 - row * 0.17;
				const j = SLOT[id];
				const idle = j !== undefined && j > 0 && u >= MOVE && trayAt(j, n, u) === null;
				const color = id === "cheese" && recentReject ? "#e0473a" : idle ? "#f2b630" : "#43c46b";
				r.quad(
					[
						[fx + 0.003, ya, za],
						[fx + 0.003, ya + 0.17, za],
						[fx + 0.003, ya + 0.17, za + 0.12],
						[fx + 0.003, ya, za + 0.12],
					],
					color,
					{ flat: true },
				);
			});
		},
	});
}

