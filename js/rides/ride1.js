// Ride 1, The tray: the cheese plate line inside the factory hall. One tray rides the cart from
// the denester to the outfeed, and its contents change at every stop. Beside the track the line
// runs as the knowledge describes it: an indexing tray belt; a scroll denester; a guarded cage
// with a washdown six-axis arm picking grape bunches from a tote, a delta picking apple slices off
// a moving belt, a SCARA taking cracker packs from a stack feeder, and a stainless delta picking
// cheese wedges; camera inspection with a reject pusher and rework lane; a rigid-lid lidder; a
// code printer; and an outfeed gantry loading trolley drawers behind a light curtain.
// Drawing code only: every word on screen (stop titles, cargo tags) comes from content.
//
// Helpers: ride1-line.js (indexing timing, tray contents), ride1-cells.js (cage and pick cells),
// ride1-machines.js (denester, inspection, lidding, printer, outfeed, HMI), ride1-robots.js.

import { drawPlate, PLATE_AFTER } from "../engine/food.js";
import { IsoRenderer, shade } from "../engine/iso.js";
import { object, PAL } from "../engine/park.js";
import { buildCage, buildCells, CAGE } from "./ride1-cells.js";
import {
	BELT,
	BELT_Z,
	CYCLE,
	clock,
	codeMark,
	contents,
	drawTray,
	EVENT,
	ease,
	HEADING,
	LAST_SLOT,
	LINE_X,
	lerp,
	MOVE,
	onBelt,
	PITCH,
	passMark,
	slotY,
	STOP_Y,
	travel,
	trayIn,
} from "./ride1-line.js";
import { buildDenester, buildHmi, buildInfeed, buildInspection, buildLidding, buildOutfeed, buildPrinter } from "./ride1-machines.js";

export { STOP_Y };

const TRACK_X = 28;
const RETURN_X = 32;
const LINE_Y0 = 30.6;
const LINE_Y1 = 69.4;
/** Pose shown when motion is reduced: mid-cycle, robots busy, plates on still trays. */
const FROZEN = CYCLE * 40 + 3.2;

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

function buildConveyor(scene, ctx) {
	const g = ctx.group;
	for (let y = LINE_Y0; y < LINE_Y1; y += 1.6) {
		const y1 = Math.min(LINE_Y1, y + 1.6);
		const infeed = y >= 33.8 && y < 39;
		object(scene, BELT[0], y, BELT[1], y1, BELT_Z, (r) => conveyorSegment(r, y, y1, infeed ? "#3f5a4e" : "#3a3f47"), { group: g });
	}
	object(scene, BELT[0], LINE_Y1, BELT[1], LINE_Y1 + 0.2, BELT_Z, (r) => r.tube([BELT[0], LINE_Y1 + 0.08, BELT_Z - 0.08], [BELT[1], LINE_Y1 + 0.08, BELT_Z - 0.08], 0.09, PAL.steel), {
		group: g,
	});
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
// Trays on the indexing belt: one item per rest position (slot), each with its belt flight.

function addLineTrays(scene, ctx, T) {
	for (let j = 0; j <= LAST_SLOT; j++) {
		const yNow = () => slotY(j - 1 + travel(clock(T(scene.time)).u));
		scene.addDynamic({
			group: ctx.group,
			depth: () => LINE_X + yNow() - 0.1,
			bounds: () => {
				const y = yNow();
				return [LINE_X - 0.55, y - 0.5, BELT_Z, LINE_X + 0.55, y + 0.5, BELT_Z + 0.5];
			},
			animated: () => true,
			draw: (r, t0) => {
				const { n, u } = clock(T(t0));
				const y = slotY(j - 1 + travel(u));
				const fy = y - 0.4;
				if (fy > LINE_Y0 + 0.05 && fy < LINE_Y1 - 0.05) r.box(BELT[0] + 0.1, fy - 0.03, BELT_Z - 0.01, BELT[1] - BELT[0] - 0.2, 0.06, 0.035, "#262a30");
				const m = trayIn(j, n);
				if (j === 0 && u < MOVE) return; // still in the denester's magazine
				if (j === LAST_SLOT && u >= EVENT.lift) return; // the gantry has it
				if (!onBelt(m, j, u)) return; // pushed off to the rework lane
				const z = j === 0 ? lerp(1.28, BELT_Z, ease((u - EVENT.drop[0]) / (EVENT.drop[1] - EVENT.drop[0]))) : BELT_Z;
				drawTray(r, LINE_X, y, z, contents(m, j, u));
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
		const T = (t) => (ctx.reducedMotion() ? FROZEN : t);
		buildConveyor(scene, ctx);
		buildDenester(scene, ctx, T);
		buildInfeed(scene, ctx);
		buildCage(scene, ctx);
		buildCells(scene, ctx, T);
		buildInspection(scene, ctx, T);
		buildLidding(scene, ctx, T);
		buildPrinter(scene, ctx, T);
		buildOutfeed(scene, ctx, T);
		buildHmi(scene, ctx, T, Object.keys(STOP_Y));
		buildPlatform(scene, ctx);
		addLineTrays(scene, ctx, T);
		ctx.booth("apples", 34.4, 45.5);
		for (const [id, y] of Object.entries(STOP_Y)) {
			const pick = y > CAGE.y0 && y < CAGE.y1;
			// Pick-station labels sit just behind the belt, above the robot's reach, so they stay on
			// screen next to the cart on a phone (further back they fall off the left edge).
			ctx.stopTarget(id, [pick ? CAGE.x0 : 22.5, y - PITCH + 0.35, 0, 26.2, y + PITCH - 0.35, pick ? 2.6 : 2.2], [pick ? 23 : LINE_X, y, pick ? 3.3 : 2.9]);
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
		if (stopId === "outfeed") codeMark(r, x, y, z, 1.45, 1, pos.heading);
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
			const items = PLATE_AFTER[stopId] ?? {};
			// drawPlate's inspection badge floats too high for this zoom (it was cut off at the top of
			// the canvas), so the close-up draws the same badge just above the food or the lid.
			drawPlate(r, 0, 0, 0, HEADING, { ...items, pass: false }, { lineScale: 0.3 });
			if (stopId === "outfeed") codeMark(r, 0, 0, 0, 1, 0.3);
			if (items.pass) passMark(r, 0, 0, 0.31);
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
