// Ride 1, The tray: the cheese plate line inside the factory hall. One tray rides the cart from
// the denester to the outfeed, and its contents change at every stop. Drawing code only: every
// word on screen (stop titles, cargo tags) comes from content.

import { drawPlate, drawTrayStack, FOOD, PLATE_AFTER } from "../engine/food.js";
import { IsoRenderer, shade } from "../engine/iso.js";
import { object, PAL } from "../engine/park.js";
import { dip, drawDelta, drawScara, drawSixAxis, shuttle } from "../engine/robots.js";

const LINE_X = 24; // conveyor centerline
const BELT = [23.4, 24.6]; // conveyor frame, x
const BELT_Z = 0.85;
const TRACK_X = 28;
const RETURN_X = 32;
const LINE_Y0 = 30.6;
const LINE_Y1 = 69.4;
const HEADING = Math.PI / 2; // the line runs toward +y

/** Stop positions along the line (fixed stop ids from ARCHITECTURE.md). */
export const STOP_Y = {
	denester: 32,
	infeed: 36.5,
	grapes: 41,
	apples: 45.5,
	crackers: 50,
	cheese: 54.5,
	inspection: 59,
	lidding: 63.5,
	outfeed: 68,
};

const CAGE = { x0: 18, x1: 26, y0: 39, y1: 56.75, dividers: [43.25, 47.75, 52.25] };
const GUARD = { post: PAL.safety, mesh: "#8d99a6", h: 1.85 };
const SCALE = 1.3;

// ---------------------------------------------------------------------------
// Static pieces

function conveyorSegment(r, y0, y1, belt = "#3a3f47") {
	const [x0, x1] = BELT;
	r.box(x0 + 0.05, y0 + 0.1, 0, 0.12, 0.12, BELT_Z - 0.12, PAL.dark);
	r.box(x1 - 0.17, y0 + 0.1, 0, 0.12, 0.12, BELT_Z - 0.12, PAL.dark);
	r.box(x0, y0, BELT_Z - 0.16, x1 - x0, y1 - y0, 0.14, PAL.metal);
	r.ground(x0 + 0.08, y0, x1 - x0 - 0.16, y1 - y0, belt, BELT_Z - 0.01);
	r.box(x0 - 0.04, y0, BELT_Z - 0.06, 0.1, y1 - y0, 0.12, PAL.steel);
	r.box(x1 - 0.06, y0, BELT_Z - 0.06, 0.1, y1 - y0, 0.12, PAL.steel);
}

function feedConveyor(r, x0, x1, y, items) {
	const w = 0.55;
	r.box(x0, y - w / 2, BELT_Z - 0.14, x1 - x0, w, 0.12, PAL.metal);
	r.ground(x0, y - w / 2 + 0.05, x1 - x0, w - 0.1, "#3a3f47", BELT_Z - 0.015);
	for (let x = x0 + 0.3; x < x1; x += 1.6) r.box(x, y - w / 2 + 0.05, 0, 0.1, 0.1, BELT_Z - 0.14, PAL.dark);
	r.box(x0, y - w / 2 - 0.05, BELT_Z - 0.05, x1 - x0, 0.06, 0.1, PAL.steel);
	r.box(x0, y + w / 2 - 0.01, BELT_Z - 0.05, x1 - x0, 0.06, 0.1, PAL.steel);
	items?.(r, x0, x1, y);
}

function tote(r, x0, y0, w, d, h, color) {
	r.box(x0, y0, 0, w, d, 0.12, PAL.dark);
	r.box(x0, y0, 0.12, w, d, h - 0.12, color, { top: shade(color, 0.6) });
}

function guardPanel(r, a, b, opts = {}) {
	// A guarding panel from a to b ([x, y]) with posts, rails, and see-through mesh.
	const h = opts.h ?? GUARD.h;
	const z0 = opts.z0 ?? 0;
	r.quad(
		[
			[a[0], a[1], z0 + 0.15],
			[b[0], b[1], z0 + 0.15],
			[b[0], b[1], h],
			[a[0], a[1], h],
		],
		GUARD.mesh,
		{ alpha: 0.28, flat: true },
	);
	r.line([a[0], a[1], h], [b[0], b[1], h], GUARD.post, 3);
	r.line([a[0], a[1], z0 + 0.15], [b[0], b[1], z0 + 0.15], GUARD.post, 3);
	if (!opts.noPosts)
		for (const p of [a, b]) r.box(p[0] - 0.05, p[1] - 0.05, z0, 0.1, 0.1, h - z0 + 0.02, GUARD.post);
}

/** A guarding wall across the line (y = const) with an opening for the conveyor. */
function crossGuard(r, y, x0, x1) {
	guardPanel(r, [x0, y], [BELT[0] - 0.1, y]);
	guardPanel(r, [BELT[1] + 0.1, y], [x1, y]);
	guardPanel(r, [BELT[0] - 0.1, y], [BELT[1] + 0.1, y], { z0: 1.25, noPosts: true });
}

function buildConveyor(scene, ctx) {
	const g = ctx.group;
	for (let y = LINE_Y0; y < LINE_Y1; y += 1.6) {
		const y1 = Math.min(LINE_Y1, y + 1.6);
		const infeed = y >= 33.8 && y < 39;
		object(scene, BELT[0], y, BELT[1], y1, BELT_Z, (r) => conveyorSegment(r, y, y1, infeed ? "#3f5a4e" : "#3a3f47"), { group: g });
	}
	// End roller cap.
	object(scene, BELT[0], LINE_Y1, BELT[1], LINE_Y1 + 0.2, BELT_Z, (r) => r.tube([BELT[0], LINE_Y1 + 0.08, BELT_Z - 0.08], [BELT[1], LINE_Y1 + 0.08, BELT_Z - 0.08], 0.09, PAL.steel), {
		group: g,
	});
}

function buildDenester(scene, ctx) {
	const y = STOP_Y.denester;
	object(
		scene,
		22.8,
		y - 1.1,
		25.2,
		y + 1.1,
		2.4,
		(r) => {
			r.box(22.8, y - 1.0, 0, 0.45, 2.0, 1.3, "#dfe4ea");
			r.box(24.75, y - 1.0, 0, 0.45, 2.0, 1.3, "#dfe4ea");
			r.box(22.8, y - 1.0, 1.3, 2.4, 2.0, 0.16, "#2f6fb3");
			drawTrayStack(r, LINE_X, y, 1.46, HEADING, 18, { scale: 1.15 });
			for (const [dx, dy] of [
				[-0.32, -0.42],
				[0.32, -0.42],
				[-0.32, 0.42],
				[0.32, 0.42],
			])
				r.box(LINE_X + dx - 0.03, y + dy - 0.03, 1.46, 0.06, 0.06, 0.9, PAL.metal);
			r.box(25.0, y + 0.55, 1.0, 0.12, 0.3, 0.2, "#43c46b");
		},
		{ group: ctx.group },
	);
}

function buildInfeed(scene, ctx) {
	const y = STOP_Y.infeed;
	object(
		scene,
		23.1,
		y - 0.3,
		24.9,
		y + 0.3,
		1.4,
		(r) => {
			for (const x of [23.18, 24.72]) {
				r.box(x, y - 0.05, 0, 0.1, 0.1, 1.2, PAL.steel);
				r.box(x - 0.02, y - 0.09, 1.0, 0.14, 0.18, 0.16, "#2b2f36");
			}
			r.line([23.3, y, 1.08], [24.72, y, 1.08], "rgba(230,60,50,0.9)", 1.5);
			// Side guides that square the tray up.
			r.box(23.5, y - 2.2, 0.95, 0.05, 4.4, 0.08, PAL.metal);
			r.box(24.45, y - 2.2, 0.95, 0.05, 4.4, 0.08, PAL.metal);
		},
		{ group: ctx.group },
	);
	// Operator panel (HMI) between the guarding line and the track.
	object(
		scene,
		26.3,
		y - 1.3,
		26.9,
		y - 0.5,
		1.7,
		(r) => {
			r.box(26.3, y - 1.3, 0, 0.6, 0.8, 1.45, "#d7dce2");
			r.quad(
				[
					[26.91, y - 1.2, 0.95],
					[26.91, y - 0.6, 0.95],
					[26.91, y - 0.6, 1.35],
					[26.91, y - 1.2, 1.35],
				],
				"#1f3a52",
				{ flat: true },
			);
			r.box(26.5, y - 1.0, 1.45, 0.2, 0.2, 0.25, PAL.dark);
			r.sphere(26.6, y - 0.9, 1.75, 0.09, "#43c46b", 0);
		},
		{ group: ctx.group },
	);
}

function buildCage(scene, ctx) {
	const g = ctx.group;
	const { x0, x1, y0, y1, dividers } = CAGE;
	// Back wall of the cage (behind the robots): static.
	for (let y = y0; y < y1 - 0.01; y += 2.2) {
		const ya = y;
		const yb = Math.min(y1, y + 2.2);
		object(scene, x0 - 0.05, ya, x0 + 0.05, yb, GUARD.h, (r) => guardPanel(r, [x0, ya], [x0, yb]), { group: g });
	}
	// Front wall, dividers, and end walls interleave with moving robots: live items.
	const fronts = [];
	const ys = [y0, ...dividers, y1];
	for (let i = 0; i < ys.length - 1; i++) {
		const mid = (ys[i] + ys[i + 1]) / 2;
		fronts.push([ys[i], mid], [mid, ys[i + 1]]);
	}
	for (const [ya, yb] of fronts)
		scene.add({ group: g, live: true, bounds: [x1 - 0.05, ya, 0, x1 + 0.05, yb, GUARD.h], depth: x1 + (ya + yb) / 2 + 0.6, draw: (r) => guardPanel(r, [x1, ya], [x1, yb]) });
	for (const y of ys)
		scene.add({ group: g, live: true, bounds: [x0, y - 0.05, 0, x1, y + 0.05, GUARD.h], depth: LINE_X + y + 0.3, draw: (r) => crossGuard(r, y, x0, x1) });
}

function buildFeeds(scene, ctx) {
	const g = ctx.group;
	// Grapes: a tote of bunches next to the SCARA.
	object(
		scene,
		20.9,
		39.6,
		22.1,
		40.8,
		1,
		(r) => {
			tote(r, 20.9, 39.6, 1.2, 1.2, 0.72, "#2f6fb3");
			for (let i = 0; i < 6; i++) {
				const x = 21.15 + (i % 3) * 0.35;
				const y = 39.85 + Math.floor(i / 3) * 0.55;
				for (let k = 0; k < 4; k++) r.sphere(x + (k % 2) * 0.07, y + (k > 1 ? 0.08 : 0), 0.75 + (k > 1 ? 0.03 : 0), 0.06, k % 2 ? FOOD.grape : FOOD.grape2, 0);
			}
		},
		{ group: g },
	);
	// Apples: a feed conveyor of slices from behind the cage.
	object(
		scene,
		15.4,
		46.5,
		21.2,
		47.1,
		1,
		(r) =>
			feedConveyor(r, 15.4, 21.2, 46.8, (rr, a, b, y) => {
				for (let x = a + 0.4; x < b - 0.2; x += 0.45) {
					rr.prism(
						Array.from({ length: 7 }, (_, i) => {
							const t = (i / 6) * Math.PI;
							return [x + Math.cos(t) * 0.1, y + Math.sin(t) * 0.1 - 0.04];
						}),
						BELT_Z,
						0.04,
						FOOD.apple,
					);
				}
			}),
		{ group: g },
	);
	// Crackers: a tote of wrapped packs under the delta.
	object(
		scene,
		21.9,
		48.6,
		22.9,
		49.6,
		1,
		(r) => {
			tote(r, 21.9, 48.6, 1.0, 1.0, 0.72, "#c0392b");
			for (let i = 0; i < 4; i++) r.box(22.0 + (i % 2) * 0.42, 48.7 + Math.floor(i / 2) * 0.45, 0.72, 0.36, 0.2, 0.05, FOOD.pack);
		},
		{ group: g },
	);
	// Cheese: a feed conveyor of wedges.
	object(
		scene,
		15.4,
		53.3,
		22.8,
		53.9,
		1,
		(r) =>
			feedConveyor(r, 15.4, 22.8, 53.6, (rr, a, b, y) => {
				for (let x = a + 0.4; x < b - 0.3; x += 0.5)
					rr.prism(
						[
							[x, y - 0.1],
							[x + 0.2, y],
							[x, y + 0.1],
						],
						BELT_Z,
						0.08,
						FOOD.cheese,
					);
			}),
		{ group: g },
	);
	// Pedestals for the SCARA and 6-axis arm.
	object(scene, 22.1, 40.9, 23.1, 41.9, 0.25, (r) => r.box(22.1, 40.9, 0, 1.0, 1.0, 0.22, PAL.steel), { group: g });
	object(scene, 21.8, 45.5, 22.8, 46.5, 0.25, (r) => r.box(21.8, 45.5, 0, 1.0, 1.0, 0.22, PAL.steel), { group: g });
}

function buildInspection(scene, ctx) {
	const y = STOP_Y.inspection;
	const g = ctx.group;
	// Reject chute and bin at the back.
	object(
		scene,
		20,
		y + 0.9,
		23.3,
		y + 2.2,
		1,
		(r) => {
			r.quad(
				[
					[23.3, y + 1.0, BELT_Z - 0.02],
					[23.3, y + 1.8, BELT_Z - 0.02],
					[21.0, y + 1.8, 0.5],
					[21.0, y + 1.0, 0.5],
				],
				PAL.metal,
			);
			tote(r, 20.0, y + 0.9, 1.0, 1.3, 0.55, "#d9483b");
		},
		{ group: g },
	);
	// The tunnel covers trays riding through it: a live item drawn after them.
	scene.add({
		group: g,
		live: true,
		bounds: [22.9, y - 0.8, 0, 25.4, y + 0.8, 2.3],
		depth: LINE_X + y + 1.4,
		draw: (r, t = 0) => {
			r.box(22.95, y - 0.75, BELT_Z - 0.1, 0.14, 1.5, 1.05, "#d7dce2");
			r.box(24.91, y - 0.75, BELT_Z - 0.1, 0.14, 1.5, 1.05, "#d7dce2");
			r.box(22.95, y - 0.75, 1.8, 2.1, 1.5, 0.14, "#2f6fb3");
			r.box(23.75, y - 0.2, 1.94, 0.5, 0.4, 0.3, PAL.dark);
			r.cylinder(24.0, y + 0.25, 1.98, 0.09, 0.12, "#111418", 8);
			const blink = ctx.reducedMotion() ? 1 : 0.6 + 0.4 * Math.sin(t * 3);
			r.box(25.06, y - 0.6, 1.1, 0.03, 1.2, 0.12, `rgba(255,248,200,${blink.toFixed(2)})`);
			// Reject pusher on the front side.
			r.box(25.1, y + 1.05, BELT_Z - 0.05, 0.4, 0.5, 0.35, PAL.steel);
		},
	});
}

function buildLidding(scene, ctx) {
	const y = STOP_Y.lidding;
	const g = ctx.group;
	object(
		scene,
		20.9,
		y - 0.6,
		22.3,
		y + 0.6,
		1.6,
		(r) => {
			r.box(21.2, y - 0.4, 0, 0.8, 0.8, 0.9, PAL.steel);
			for (let i = 0; i < 9; i++) r.orientedBox(21.6, y, 0.9 + i * 0.06, 0.8, 0.58, 0.05, HEADING, FOOD.lid, { alpha: 0.55, edge: "rgba(255,255,255,0.7)" });
		},
		{ group: g },
	);
	scene.add({
		group: g,
		live: true,
		bounds: [22.5, y - 1.3, 0, 25.5, y + 1.3, 2.7],
		depth: LINE_X + y + 1.5,
		draw: (r, t = 0) => {
			for (const [x, yy] of [
				[22.55, y - 1.2],
				[22.55, y + 1.05],
				[25.3, y - 1.2],
				[25.3, y + 1.05],
			])
				r.box(x, yy, 0, 0.15, 0.15, 1.75, PAL.steel);
			const press = ctx.reducedMotion() ? 0 : dip(t, 3.2, 0.4);
			r.box(23.4, y - 0.45, 1.35 - press * 0.3, 1.2, 0.9, 0.4, PAL.metal);
			r.box(22.5, y - 1.25, 1.75, 3.0, 2.5, 0.8, "#4b5d73", { top: "#5b6f86" });
			r.box(25.51, y - 0.7, 2.0, 0.02, 0.5, 0.35, "#1f3a52");
			r.sphere(25.4, y + 0.7, 2.66, 0.1, "#f2c230", 0);
		},
	});
}

function buildOutfeed(scene, ctx) {
	const y = STOP_Y.outfeed;
	object(
		scene,
		19.8,
		y - 1.2,
		22.6,
		y + 1.4,
		2,
		(r) => {
			const x0 = 20.0;
			const y0 = y - 1.0;
			for (const [wx, wy] of [
				[x0 + 0.2, y0 + 0.2],
				[x0 + 2.2, y0 + 0.2],
				[x0 + 0.2, y0 + 2.1],
				[x0 + 2.2, y0 + 2.1],
			])
				r.cylinder(wx, wy, 0, 0.09, 0.15, PAL.dark, 6);
			r.box(x0, y0, 0.15, 2.4, 2.3, 0.1, "#9aa5b1");
			for (let i = 0; i < 6; i++) {
				const z = 0.3 + i * 0.25;
				r.box(x0 + 0.05, y0 + 0.05, z, 2.3, 2.2, 0.03, "#c4ccd4");
				if (i < 4) drawTrayStack(r, x0 + 1.2, y0 + 1.15, z + 0.03, HEADING, 2, { scale: 1.1 });
			}
			for (const [px, py] of [
				[x0, y0],
				[x0 + 2.3, y0],
				[x0, y0 + 2.2],
			])
				r.box(px, py, 0.15, 0.1, 0.1, 1.7, "#7f8b98");
			r.box(x0, y0, 1.85, 2.4, 2.3, 0.08, "#9aa5b1");
			r.box(x0 + 2.3, y0 + 2.2, 0.15, 0.1, 0.1, 1.7, "#7f8b98");
		},
		{ group: ctx.group },
	);
	// Transfer plate from the belt end toward the cart.
	object(scene, 22.4, y + 0.6, 23.5, y + 1.3, BELT_Z, (r) => r.box(22.4, y + 0.7, 0.6, 1.1, 0.5, 0.08, PAL.metal), { group: ctx.group });
}

function buildPlatform(scene, ctx) {
	const color = PAL.ride.ride1;
	object(
		scene,
		32.6,
		49.8,
		35.4,
		53.4,
		2.4,
		(r) => {
			r.box(32.6, 49.8, 0, 2.8, 3.6, 0.28, "#cfc8bb", { top: "#ddd6c9" });
			r.box(32.6, 49.8, 0.28, 0.12, 3.6, 0.01, PAL.safety);
			for (const y of [50.2, 52.8]) r.box(35.0, y, 0.28, 0.12, 0.12, 1.9, PAL.dark);
			r.box(34.98, 50.1, 1.7, 0.16, 2.9, 0.55, color, { top: shade(color, 1.12) });
		},
		{ group: ctx.group },
	);
}

// ---------------------------------------------------------------------------
// Moving parts

function addRobots(scene, ctx) {
	const g = ctx.group;
	const T = (t) => (ctx.reducedMotion() ? 0 : t);
	// Grapes: SCARA with a small finger gripper.
	{
		const yc = STOP_Y.grapes;
		const base = [22.6, 41.4];
		const pick = [21.5, 40.2];
		const place = [23.95, yc];
		scene.addDynamic({
			group: g,
			depth: LINE_X + yc + 0.2,
			bounds: [20.5, yc - 2, 0, 25, yc + 2, 2.4],
			animated: () => true,
			draw: (r, t) => {
				const tt = T(t);
				const k = shuttle(tt, 3.4, 0);
				const target = [pick[0] + (place[0] - pick[0]) * k, pick[1] + (place[1] - pick[1]) * k];
				const z = 1.12 - dip(tt, 3.4, 0) * 0.32;
				drawScara(r, base[0], base[1], target, z, { scale: SCALE, grip: k > 0.5 ? 0.2 : 0.8 });
			},
		});
	}
	// Apples: 6-axis arm with a vacuum cup.
	{
		const yc = STOP_Y.apples;
		const base = [22.3, 46.0];
		const pick = [20.9, 46.8];
		const place = [23.95, yc - 0.1];
		scene.addDynamic({
			group: g,
			depth: LINE_X + yc + 0.2,
			bounds: [20, yc - 2, 0, 25, yc + 2, 2.6],
			animated: () => true,
			draw: (r, t) => {
				const tt = T(t);
				const k = shuttle(tt, 3.8, 1.1);
				const lift = (1 - dip(tt, 3.8, 1.1)) * 0.35;
				const target = [pick[0] + (place[0] - pick[0]) * k, pick[1] + (place[1] - pick[1]) * k, 1.0 + lift];
				drawSixAxis(r, base[0], base[1], target, { scale: SCALE });
			},
		});
	}
	// Crackers and cheese: delta robots in overhead frames.
	for (const [id, pick, phase, tool] of [
		["crackers", [22.4, 49.1, 0.95], 0.5, "cup"],
		["cheese", [22.5, 53.6, 1.0], 1.7, "fingers"],
	]) {
		const yc = STOP_Y[id];
		const cx = 23.25;
		const top = 2.85;
		const place = [23.95, yc, 1.0];
		const posts = [
			[21.55, yc - 1.55],
			[25.05, yc - 1.55],
			[21.55, yc + 1.4],
			[25.05, yc + 1.4],
		];
		scene.addDynamic({
			group: g,
			depth: LINE_X + yc + 0.2,
			bounds: [21.3, yc - 1.8, 0, 25.4, yc + 1.8, 3.2],
			animated: () => true,
			draw: (r, t) => {
				const tt = T(t);
				for (const p of posts.slice(0, 2)) r.box(p[0], p[1], 0, 0.15, 0.15, top + 0.1, PAL.steel);
				r.box(21.55, yc - 1.55, top, 3.65, 0.15, 0.15, PAL.steel);
				r.box(21.55, yc - 1.55, top, 0.15, 3.1, 0.15, PAL.steel);
				const k = shuttle(tt, 2.2, phase);
				const lift = (1 - dip(tt, 2.2, phase)) * 0.45;
				const plat = [pick[0] + (place[0] - pick[0]) * k, pick[1] + (place[1] - pick[1]) * k, Math.max(pick[2], place[2]) + 0.2 + lift];
				r.box(cx - 0.6, yc - 0.6, top - 0.02, 1.2, 1.2, 0.12, "#7f8b98");
				drawDelta(r, cx, yc, top, plat, { scale: SCALE, tool, grip: k > 0.5 ? 0.2 : 0.8 });
				for (const p of posts.slice(2)) r.box(p[0], p[1], 0, 0.15, 0.15, top + 0.1, PAL.steel);
				r.box(25.05, yc - 1.55, top, 0.15, 3.1, 0.15, PAL.steel);
				r.box(21.55, yc + 1.4, top, 3.65, 0.15, 0.15, PAL.steel);
			},
		});
	}
}

/** Trays riding the main conveyor; each shows what the stations it passed have added. */
function addLineTrays(scene, ctx) {
	const ids = Object.keys(STOP_Y);
	const span = LINE_Y1 - 0.6 - STOP_Y.denester;
	const N = 8;
	for (let k = 0; k < N; k++) {
		const yAt = (t) => STOP_Y.denester + ((((ctx.reducedMotion() ? 0 : t) * 0.55 + (k * span) / N) % span) + span) % span;
		scene.addDynamic({
			group: ctx.group,
			depth: () => LINE_X + yAt(scene.time) - 0.1,
			bounds: () => {
				const y = yAt(scene.time);
				return [LINE_X - 0.5, y - 0.5, BELT_Z, LINE_X + 0.5, y + 0.5, BELT_Z + 0.4];
			},
			animated: () => true,
			draw: (r, t) => {
				const y = yAt(t);
				let last = "denester";
				for (const id of ids) if (y >= STOP_Y[id] + 0.25) last = id;
				drawPlate(r, LINE_X, y, BELT_Z, HEADING, PLATE_AFTER[last]);
			},
		});
	}
}

// ---------------------------------------------------------------------------

export default {
	id: "ride1",
	zone: "factory",

	trackFor() {
		const R = RETURN_X;
		const points = [
			[R, 50.6],
			[R, 44],
			[R, 36],
			[R, 31],
			[31.41, 29.59],
			[30, 29],
			[28.59, 29.59],
			[TRACK_X, 31],
		];
		const stops = {};
		for (const [id, y] of Object.entries(STOP_Y)) {
			stops[id] = points.length;
			points.push([TRACK_X, y]);
		}
		points.push([TRACK_X, 69.4], [28.59, 70.41], [30, 71], [31.41, 70.41], [R, 69.4], [R, 62], [R, 56], [R, 52.6]);
		return { points, stops };
	},

	buildScenery(scene, ctx) {
		buildConveyor(scene, ctx);
		buildDenester(scene, ctx);
		buildInfeed(scene, ctx);
		buildFeeds(scene, ctx);
		buildCage(scene, ctx);
		buildInspection(scene, ctx);
		buildLidding(scene, ctx);
		buildOutfeed(scene, ctx);
		buildPlatform(scene, ctx);
		addRobots(scene, ctx);
		addLineTrays(scene, ctx);
		ctx.booth("apples", 34.4, 45.5);
		for (const [id, y] of Object.entries(STOP_Y)) {
			const pick = y > CAGE.y0 && y < CAGE.y1;
			// Pick-station labels sit just behind the belt, above the robot's reach, so they stay on
			// screen next to the cart on a phone (further back they fall off the left edge).
			ctx.stopTarget(id, [pick ? CAGE.x0 : 22.5, y - 1.9, 0, 26.2, y + 1.9, pick ? 2.6 : 2.2], [pick ? 23 : LINE_X, y, pick ? 3.3 : 2.9]);
		}
	},

	// Aim the camera between the cart and the conveyor, so the station that changed the tray is in
	// view next to the cart (the line runs 4 m to the left of the track).
	focus(pos) {
		return [pos.x - 2, pos.y, pos.z + 0.6];
	},

	drawCargo(r, stopId, pos) {
		const [x, y, z] = pos.anchor;
		drawPlate(r, x, y, z, pos.heading, PLATE_AFTER[stopId] ?? {}, { scale: 1.45 });
	},

	closeup(stopId, el) {
		const canvas = document.createElement("canvas");
		canvas.className = "closeup-canvas";
		canvas.setAttribute("aria-hidden", "true");
		el.append(canvas);
		const draw = () => {
			const w = el.clientWidth || 320;
			const h = 130;
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			const c = canvas.getContext("2d");
			c.setTransform(dpr, 0, 0, dpr, 0, 0);
			const r = new IsoRenderer(c);
			const zoom = 5.2;
			// Center the plate (at the origin, heading along +y) in the canvas.
			r.setTransform(zoom, w / 2, h / 2 + 18);
			r.shadow(0, 0, 0.5, 0.4, 0.15);
			drawPlate(r, 0, 0, 0, HEADING, PLATE_AFTER[stopId] ?? {}, { lineScale: 0.3 });
		};
		draw();
		const ro = new ResizeObserver(draw);
		ro.observe(el);
		return () => {
			ro.disconnect();
			canvas.remove();
		};
	},
};
