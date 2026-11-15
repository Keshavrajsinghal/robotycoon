// The park: terrain, named zones, scenery, ride gates, the town signpost, and the factory hall.
// Coordinates are world meters (one terrain tile = 1 m). See ARCHITECTURE.md for the zone map.

import { circlePoints, mix, shade } from "./iso.js";
import { LAYER } from "./scene.js";

export const MAP = { w: 100, h: 100 };

/** Daylight palette shared by the park and ride modules. */
export const PAL = {
	sea: "#5fb0d9",
	grass: "#7cc46a",
	grass2: "#76bd64",
	grassZone: "#86c972",
	earth: "#9a7650",
	sand: "#e9d9a6",
	path: "#e3cf9f",
	pathEdge: "#cdb682",
	plaza: "#ddd2bd",
	plaza2: "#d3c6ad",
	water: "#4fa3d6",
	waterHi: "#7cc2e8",
	hedge: "#4f9a4a",
	trunk: "#8a5a3b",
	leaf: ["#4e9a45", "#5aa84c", "#3f8a40", "#6db457"],
	pine: ["#2f7a45", "#3a8a50"],
	stone: "#c9c2b4",
	wood: "#b07a4a",
	metal: "#aeb6c0",
	steel: "#8e98a4",
	dark: "#3b4048",
	white: "#f4f4f2",
	floor: "#c9ccd0",
	floor2: "#c2c5ca",
	wall: "#e8e2d6",
	wallBand: "#b5543c",
	window: "#a9d4ea",
	ride: { ride1: "#d9583b", ride2: "#3d7fd1", ride3: "#1f9e8f", ride4: "#8a5cc7" },
	safety: "#f2c230",
	cone: "#ef7d2d",
};

/**
 * Named zones. rect is [x0, y0, x1, y1] in tiles. gate is where the ride's gate stands on the
 * plaza edge; entry is the end of the short path that leads from the gate into the zone, where
 * a ride's boarding station belongs. Rides 2-4 draw everything inside their rect themselves.
 */
export const ZONES = {
	plaza: { id: "plaza", rect: [40, 40, 60, 60], center: [50, 50] },
	factory: { id: "factory", rect: [2, 28, 38, 72], gate: [40, 50], entry: [36, 50], facing: [-1, 0], hall: [10, 28, 36, 72], door: [36, 48, 36, 52] },
	signal: { id: "signal", rect: [38, 2, 74, 36], gate: [50, 40], entry: [50, 34], facing: [0, -1] },
	rescue: { id: "rescue", rect: [62, 36, 98, 58], gate: [60, 47], entry: [65, 47], facing: [1, 0], water: [74, 38, 97, 56] },
	lesson: { id: "lesson", rect: [24, 74, 58, 98], gate: [48, 60], entry: [48, 76], facing: [0, 1] },
	town: { id: "town", rect: [62, 62, 98, 98], gate: [88, 88], signpost: [57.6, 57.6] },
};

/** Which zone each ride lives in (fixed by ARCHITECTURE.md). */
export const RIDE_ZONE = { ride1: "factory", ride2: "signal", ride3: "rescue", ride4: "lesson" };
export const RIDE_IDS = ["ride1", "ride2", "ride3", "ride4"];

/** Camera limits in projected pixels. */
export const PARK_LIMITS = [-3000, 150, 3000, 3150];

// ---------------------------------------------------------------------------
// Utilities

export function rng(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const inRect = (x, y, r, pad = 0) => x >= r[0] - pad && x <= r[2] + pad && y >= r[1] - pad && y <= r[3] + pad;

/** Add a flat ground polygon (layer GROUND). */
export function groundPoly(scene, pts, color, opts = {}) {
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	scene.add({
		group: opts.group,
		layer: opts.layer ?? LAYER.GROUND,
		depth: opts.depth,
		bounds: [Math.min(...xs), Math.min(...ys), 0, Math.max(...xs), Math.max(...ys), 0.02],
		draw: (r) => r.groundPoly(pts, color, opts.z ?? 0.01),
	});
}

export function groundRect(scene, x0, y0, x1, y1, color, opts = {}) {
	groundPoly(
		scene,
		[
			[x0, y0],
			[x1, y0],
			[x1, y1],
			[x0, y1],
		],
		color,
		opts,
	);
}

/** Add one depth-sorted object whose footprint is [x0,y0,x1,y1] and height h. */
export function object(scene, x0, y0, x1, y1, h, draw, opts = {}) {
	return scene.add({ group: opts.group, bounds: [x0, y0, 0, x1, y1, h], draw, depth: opts.depth, live: opts.live });
}

export function drawTree(r, x, y, kind, s, pal = PAL) {
	r.shadow(x + 0.25, y + 0.25, 1.0 * s, 1.0 * s, 0.16);
	if (kind === "pine") {
		r.cylinder(x, y, 0, 0.13 * s, 0.6 * s, pal.trunk, 6);
		r.cone(x, y, 0.45 * s, 0.95 * s, 1.5 * s, pal.pine[0], 7);
		r.cone(x, y, 1.3 * s, 0.7 * s, 1.3 * s, pal.pine[1], 7);
	} else {
		r.cylinder(x, y, 0, 0.14 * s, 1.0 * s, pal.trunk, 6);
		r.sphere(x, y, 1.65 * s, 0.85 * s, pal.leaf[kind % pal.leaf.length], 1, { sz: 0.9 });
	}
}

export function drawBench(r, x, y, alongX) {
	const w = alongX ? 1.4 : 0.45;
	const d = alongX ? 0.45 : 1.4;
	r.box(x, y, 0, alongX ? 0.1 : 0.08, alongX ? 0.08 : 0.1, 0.38, PAL.dark);
	r.box(x + w - (alongX ? 0.1 : 0.08), y + d - (alongX ? 0.08 : 0.1), 0, alongX ? 0.1 : 0.08, alongX ? 0.08 : 0.1, 0.38, PAL.dark);
	r.box(x, y, 0.38, w, d, 0.07, PAL.wood);
	if (alongX) r.box(x, y, 0.45, w, 0.07, 0.35, PAL.wood);
	else r.box(x, y, 0.45, 0.07, d, 0.35, PAL.wood);
}

export function drawLamp(r, x, y) {
	r.cylinder(x, y, 0, 0.12, 0.15, PAL.dark, 6);
	r.cylinder(x, y, 0, 0.05, 2.6, PAL.dark, 6);
	r.sphere(x, y, 2.7, 0.18, "#fff3c4", 0);
}

/** Flower bed: low planter with a few colored blooms. */
export function drawFlowers(r, x, y, w, d, seed = 1) {
	const R = rng(seed);
	r.box(x, y, 0, w, d, 0.25, PAL.stone);
	r.box(x + 0.1, y + 0.1, 0.25, w - 0.2, d - 0.2, 0.02, "#6a4a32");
	const colors = ["#e85d75", "#f2c230", "#f4f0e8", "#b45ad1", "#ff8a3d"];
	for (let i = 0; i < Math.round(w * d * 2.2); i++) {
		const fx = x + 0.25 + R() * (w - 0.5);
		const fy = y + 0.25 + R() * (d - 0.5);
		r.sphere(fx, fy, 0.38, 0.13, i % 3 === 0 ? PAL.leaf[1] : colors[i % colors.length], 0);
	}
}

/** Traffic cone. */
export function drawCone(r, x, y) {
	r.box(x - 0.2, y - 0.2, 0, 0.4, 0.4, 0.05, PAL.dark);
	r.cone(x, y, 0.05, 0.16, 0.55, PAL.cone, 7);
}

// ---------------------------------------------------------------------------
// Terrain

function buildTerrain(scene) {
	const { w, h } = MAP;
	// The park is a raised island slab; the sea is the canvas background.
	scene.add({
		layer: LAYER.TERRAIN,
		depth: -1e6,
		bounds: [0, 0, -1.4, w, h, 0],
		draw: (r) => {
			r.quad(
				[
					[0, h, -1.4],
					[w, h, -1.4],
					[w, h, 0],
					[0, h, 0],
				],
				PAL.earth,
			);
			r.quad(
				[
					[w, h, -1.4],
					[w, 0, -1.4],
					[w, 0, 0],
					[w, h, 0],
				],
				PAL.earth,
			);
			r.ground(0, 0, w, h, PAL.sand, 0);
			r.ground(1.2, 1.2, w - 2.4, h - 2.4, PAL.grass, 0);
			// Darker strata lines on the cliff.
			r.line([0, h, -0.5], [w, h, -0.5], shade(PAL.earth, 0.8), 1.5);
			r.line([w, h, -0.5], [w, 0, -0.5], shade(PAL.earth, 0.7), 1.5);
		},
	});
	// Subtle checkerboard of grass tiles, chunked for culling and skipped when zoomed far out.
	const C = 10;
	for (let cx = 0; cx < w; cx += C)
		for (let cy = 0; cy < h; cy += C) {
			scene.add({
				layer: LAYER.TERRAIN,
				depth: cx + cy,
				bounds: [cx, cy, 0, cx + C, cy + C, 0],
				draw: (r) => {
					if (r.zoom < 0.42) return;
					for (let x = Math.max(2, cx); x < Math.min(w - 2, cx + C); x++)
						for (let y = Math.max(2, cy); y < Math.min(h - 2, cy + C); y++) if ((x + y) % 2 === 0) r.ground(x, y, 1, 1, PAL.grass2, 0.002);
				},
			});
		}
}

function buildPaths(scene) {
	const z = ZONES;
	// Plaza paving.
	const [px0, py0, px1, py1] = z.plaza.rect;
	groundRect(scene, px0 - 0.3, py0 - 0.3, px1 + 0.3, py1 + 0.3, PAL.pathEdge, { depth: -100 });
	scene.add({
		layer: LAYER.GROUND,
		depth: -99,
		bounds: [px0, py0, 0, px1, py1, 0.02],
		draw: (r) => {
			r.ground(px0, py0, px1 - px0, py1 - py0, PAL.plaza, 0.015);
			if (r.zoom < 0.35) return;
			for (let x = px0; x < px1; x++) for (let y = py0; y < py1; y++) if ((x + y) % 2 === 0) r.ground(x, y, 1, 1, PAL.plaza2, 0.017);
		},
	});
	// Short paths from each gate into its zone.
	const pathRects = [
		[35, 48.4, 40, 51.6],
		[48.4, 32, 51.6, 40],
		[60, 45.4, 67, 48.6],
		[46.4, 60, 49.6, 78],
	];
	for (const [x0, y0, x1, y1] of pathRects) {
		groundRect(scene, x0 - 0.2, y0 - 0.2, x1 + 0.2, y1 + 0.2, PAL.pathEdge, { depth: -98 });
		groundRect(scene, x0, y0, x1, y1, PAL.path, { depth: -97, z: 0.014 });
	}
	// The town road runs diagonally from the plaza's corner to the island's edge.
	const road = (half) => [
		[59 + half, 59 - half],
		[99 + half, 99 - half],
		[99 - half, 99 + half],
		[59 - half, 59 + half],
	];
	groundPoly(scene, road(2.4), PAL.pathEdge, { depth: -96 });
	groundPoly(scene, road(2.1), PAL.path, { depth: -95, z: 0.014 });
	// Zone floors: a slightly different green so each zone reads as its own area.
	for (const id of ["signal", "rescue", "lesson"]) {
		const [x0, y0, x1, y1] = z[id].rect;
		groundRect(scene, x0, y0, x1, y1, PAL.grassZone, { depth: -200, z: 0.006 });
	}
	// Lake in the rescue zone (ride 3 draws its causeway and island on top).
	const [wx0, wy0, wx1, wy1] = z.rescue.water;
	const lake = [
		[wx0 + 3, wy0],
		[wx1, wy0],
		[wx1, wy1],
		[wx0 + 2, wy1],
		[wx0, wy1 - 4],
		[wx0, wy0 + 4],
	];
	groundPoly(scene, lake.map(([x, y]) => [x + (x < (wx0 + wx1) / 2 ? -0.5 : 0.5), y + (y < (wy0 + wy1) / 2 ? -0.5 : 0.5)]), PAL.sand, { depth: -90 });
	groundPoly(scene, lake, PAL.water, { depth: -89, z: 0.016 });
	scene.add({
		layer: LAYER.GROUND,
		depth: -88,
		bounds: [wx0, wy0, 0, wx1, wy1, 0.02],
		draw: (r) => {
			for (let i = 0; i < 9; i++) {
				const x = wx0 + 4 + ((i * 7.3) % (wx1 - wx0 - 6));
				const y = wy0 + 3 + ((i * 5.9) % (wy1 - wy0 - 5));
				r.line([x, y, 0.02], [x + 1.4, y - 0.2, 0.02], PAL.waterHi, 1.6);
			}
		},
	});
}

/** Low hedge along a zone's edge, with gaps around its entry path. */
function buildHedges(scene, id) {
	const [x0, y0, x1, y1] = ZONES[id].rect;
	const gate = ZONES[id].gate;
	const segs = [];
	const step = 2;
	for (let x = x0; x < x1; x += step) segs.push([x, y0, Math.min(step, x1 - x), 0.4]);
	for (let x = x0; x < x1; x += step) segs.push([x, y1 - 0.4, Math.min(step, x1 - x), 0.4]);
	for (let y = y0 + 0.4; y < y1 - 0.4; y += step) segs.push([x0, y, 0.4, Math.min(step, y1 - 0.4 - y)]);
	for (let y = y0 + 0.4; y < y1 - 0.4; y += step) segs.push([x1 - 0.4, y, 0.4, Math.min(step, y1 - 0.4 - y)]);
	for (const [x, y, w, d] of segs) {
		const cx = x + w / 2;
		const cy = y + d / 2;
		if (Math.hypot(cx - gate[0], cy - gate[1]) < 4.2) continue;
		object(scene, x, y, x + w, y + d, 0.55, (r) => r.box(x, y, 0, w, d, 0.55, PAL.hedge, { top: shade(PAL.hedge, 1.12) }));
	}
}

// ---------------------------------------------------------------------------
// Plaza, gates, signpost

function buildPlaza(scene) {
	const [cx, cy] = ZONES.plaza.center;
	object(scene, cx - 2.6, cy - 2.6, cx + 2.6, cy + 2.6, 2, (r) => {
		const oct = circlePoints(cx, cy, 2.6, 8, Math.PI / 8);
		r.prism(oct, 0, 0.5, PAL.stone);
		r.groundPoly(circlePoints(cx, cy, 2.25, 8, Math.PI / 8), PAL.water, 0.46);
		r.cylinder(cx, cy, 0.4, 0.32, 1.1, PAL.stone, 8);
		r.cylinder(cx, cy, 1.4, 0.9, 0.18, PAL.stone, 8);
		r.groundPoly(circlePoints(cx, cy, 0.75, 8), PAL.waterHi, 1.585);
		r.cylinder(cx, cy, 1.55, 0.12, 0.5, PAL.waterHi, 6);
		r.sphere(cx, cy, 2.1, 0.22, "#d6efff", 0);
	});
	const beds = [
		[41, 41],
		[56.5, 41],
		[41, 56.5],
	];
	beds.forEach(([x, y], i) => object(scene, x, y, x + 2.5, y + 2.5, 0.6, (r) => drawFlowers(r, x, y, 2.5, 2.5, 11 + i)));
	const benches = [
		[46.2, 44, true],
		[52.4, 44, true],
		[46.2, 55.5, true],
		[52.4, 55.5, true],
		[44, 46.2, false],
		[44, 52.4, false],
		[55.5, 46.2, false],
		[55.5, 52.4, false],
	];
	for (const [x, y, ax] of benches) object(scene, x, y, x + (ax ? 1.4 : 0.45), y + (ax ? 0.45 : 1.4), 0.8, (r) => drawBench(r, x, y, ax));
	for (const [x, y] of [
		[42.5, 47.5],
		[42.5, 52.5],
		[57.5, 47.5],
		[57.5, 52.5],
		[47.5, 42.5],
		[52.5, 42.5],
		[47.5, 57.5],
		[52.5, 57.5],
	])
		object(scene, x - 0.15, y - 0.15, x + 0.15, y + 0.15, 2.9, (r) => drawLamp(r, x, y));
}

/** Gate arch over a path. facing is the unit direction from the plaza into the zone. */
function drawGate(r, gx, gy, facing, color, open) {
	const along = facing[0] !== 0 ? "y" : "x"; // the arch spans across the path
	const span = 1.9;
	const p1 = along === "y" ? [gx, gy - span] : [gx - span, gy];
	const p2 = along === "y" ? [gx, gy + span] : [gx + span, gy];
	for (const [x, y] of [p1, p2]) {
		r.box(x - 0.3, y - 0.3, 0, 0.6, 0.6, 0.3, PAL.stone);
		r.box(x - 0.22, y - 0.22, 0.3, 0.44, 0.44, 2.5, color);
		r.box(x - 0.3, y - 0.3, 2.8, 0.6, 0.6, 0.18, shade(color, 0.85));
	}
	if (along === "y") {
		r.box(gx - 0.25, gy - span - 0.3, 2.98, 0.5, span * 2 + 0.6, 0.55, color, { top: shade(color, 1.15) });
		r.box(gx - 0.08, gy - 1.2, 3.53, 0.16, 2.4, 0.5, PAL.white);
	} else {
		r.box(gx - span - 0.3, gy - 0.25, 2.98, span * 2 + 0.6, 0.5, 0.55, color, { top: shade(color, 1.15) });
		r.box(gx - 1.2, gy - 0.08, 3.53, 2.4, 0.16, 0.5, PAL.white);
	}
	// Pennant on top.
	r.cylinder(gx, gy, 3.5, 0.04, 1.1, PAL.dark, 5);
	r.quad(
		[
			[gx, gy, 4.55],
			[gx + 0.55, gy - 0.55, 4.38],
			[gx, gy, 4.2],
		],
		color,
	);
	if (!open) {
		// Closed: a striped barrier across the path.
		const a = along === "y" ? [gx + 0.6, gy - span + 0.3, 0.8] : [gx - span + 0.3, gy + 0.6, 0.8];
		const b = along === "y" ? [gx + 0.6, gy + span - 0.3, 0.8] : [gx + span - 0.3, gy + 0.6, 0.8];
		for (let i = 0; i < 6; i++) {
			const t0 = i / 6;
			const t1 = (i + 1) / 6;
			const pa = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0, 0.8];
			const pb = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1, 0.8];
			r.beam(pa, pb, 0.14, 0.14, i % 2 ? PAL.white : "#d9483b");
		}
	}
}

function buildGates(scene, ctx) {
	for (const rideId of RIDE_IDS) {
		const zone = ZONES[RIDE_ZONE[rideId]];
		const [gx, gy] = zone.gate;
		const open = ctx.isAvailable(rideId);
		const color = PAL.ride[rideId];
		object(scene, gx - 2.3, gy - 2.3, gx + 2.3, gy + 2.3, 4.6, (r) => drawGate(r, gx, gy, zone.facing, color, open));
		const title = ctx.rideTitle(rideId);
		const activate = () => ctx.onGate(rideId);
		scene.addHit({ id: `gate-${rideId}`, kind: "gate", bounds: [gx - 1, gy - 2, 0, gx + 1, gy + 2, 4], onActivate: activate, priority: 2 });
		scene.addLabel({
			id: `gate-${rideId}`,
			kind: "gate",
			className: open ? `gate-open ride-${rideId}` : "gate-soon",
			pos: [gx, gy, 4.7],
			html: `<span class="label-title"></span>${open ? "" : '<span class="label-sub">Opening soon</span>'}`,
			ariaLabel: open ? `Ride: ${title}` : `${title}: opening soon`,
			onClick: activate,
		}).querySelector(".label-title").textContent = title;
		if (!open) buildConstruction(scene, rideId);
	}
}

/** Placeholder props for a ride that is not built yet. */
function buildConstruction(scene, rideId) {
	const zone = ZONES[RIDE_ZONE[rideId]];
	const [ex, ey] = zone.entry;
	const f = zone.facing;
	const side = [-f[1], f[0]];
	const R = rng(rideId.charCodeAt(4) * 97);
	for (let i = 0; i < 4; i++) {
		const x = ex + f[0] * (1 + i * 0.9) + side[0] * (2.4 + R() * 0.4);
		const y = ey + f[1] * (1 + i * 0.9) + side[1] * (2.4 + R() * 0.4);
		object(scene, x - 0.2, y - 0.2, x + 0.2, y + 0.2, 0.6, (r) => drawCone(r, x, y));
	}
	// A small crane next to the entry.
	const cx = ex + f[0] * 7 - side[0] * 4;
	const cy = ey + f[1] * 7 - side[1] * 4;
	object(scene, cx - 0.6, cy - 0.6, cx + 0.6, cy + 0.6, 8, (r) => {
		r.box(cx - 0.8, cy - 0.8, 0, 1.6, 1.6, 0.4, PAL.steel);
		r.box(cx - 0.25, cy - 0.25, 0.4, 0.5, 0.5, 7, PAL.safety);
		r.beam([cx - side[0] * 1.5, cy - side[1] * 1.5, 7.2], [cx + side[0] * 5, cy + side[1] * 5, 7.2], 0.35, 0.35, PAL.safety);
		r.box(cx - 0.45, cy - 0.45, 7.4, 0.9, 0.9, 0.7, shade(PAL.safety, 0.8));
		r.line([cx + side[0] * 4.5, cy + side[1] * 4.5, 7.1], [cx + side[0] * 4.5, cy + side[1] * 4.5, 3.4], PAL.dark, 1.2);
		r.box(cx + side[0] * 4.5 - 0.3, cy + side[1] * 4.5 - 0.3, 2.9, 0.6, 0.6, 0.5, PAL.steel);
	});
}

function buildTown(scene, ctx) {
	const [sx, sy] = ZONES.town.signpost;
	const open = () => ctx.onTown();
	object(scene, sx - 0.4, sy - 0.4, sx + 0.4, sy + 0.4, 3, (r) => {
		r.box(sx - 0.3, sy - 0.3, 0, 0.6, 0.6, 0.15, PAL.stone);
		r.cylinder(sx, sy, 0.15, 0.08, 2.7, PAL.wood, 6);
		r.quad(
			[
				[sx - 0.1, sy - 0.1, 2.5],
				[sx + 1.1, sy + 1.1, 2.5],
				[sx + 1.4, sy + 1.4, 2.25],
				[sx + 1.1, sy + 1.1, 2.0],
				[sx - 0.1, sy - 0.1, 2.0],
			],
			"#2f6f8f",
		);
		r.quad(
			[
				[sx - 0.1, sy + 0.1, 1.85],
				[sx - 1.1, sy + 0.7, 1.85],
				[sx - 1.35, sy + 0.85, 1.62],
				[sx - 1.1, sy + 0.7, 1.4],
				[sx - 0.1, sy + 0.1, 1.4],
			],
			PAL.wood,
		);
	});
	scene.addHit({ id: "town-signpost", kind: "sign", bounds: [sx - 1, sy - 1, 0, sx + 1.5, sy + 1.5, 3], onActivate: open, priority: 2 });
	scene.addLabel({ id: "town-signpost", kind: "sign", pos: [sx + 0.6, sy + 0.6, 3.1], text: "Town map", onClick: open, ariaLabel: "Open the town map" });
	// Arch over the town road (the road is diagonal, so the arch faces the viewer).
	const [gx, gy] = ZONES.town.gate;
	object(scene, gx - 2.6, gy - 2.6, gx + 2.6, gy + 2.6, 5, (r) => {
		const d = 2.5;
		for (const s of [-1, 1]) {
			const x = gx + s * d * 0.7071;
			const y = gy - s * d * 0.7071;
			r.box(x - 0.3, y - 0.3, 0, 0.6, 0.6, 3.4, "#2f6f8f");
		}
		r.beam([gx + d * 0.7071 + 0.4, gy - d * 0.7071 - 0.4, 3.6], [gx - d * 0.7071 - 0.4, gy + d * 0.7071 + 0.4, 3.6], 0.6, 0.7, "#2f6f8f");
	});
	scene.addHit({ id: "town-gate", kind: "sign", bounds: [gx - 2, gy - 2, 0, gx + 2, gy + 2, 4.2], onActivate: open, priority: 1 });
}

// ---------------------------------------------------------------------------
// Factory hall (the ride 1 module draws the line inside it)

function buildHall(scene) {
	const [x0, y0, x1, y1] = ZONES.factory.hall;
	const door = ZONES.factory.door;
	scene.add({
		layer: LAYER.GROUND,
		depth: -80,
		bounds: [x0, y0, 0, x1, y1, 0.05],
		draw: (r) => {
			r.ground(x0 - 0.4, y0 - 0.4, x1 - x0 + 0.8, y1 - y0 + 0.8, PAL.pathEdge, 0.012);
			r.ground(x0, y0, x1 - x0, y1 - y0, PAL.floor, 0.02);
			if (r.zoom >= 0.4)
				for (let x = x0; x < x1; x += 2) for (let y = y0; y < y1; y += 2) if (((x - x0) / 2 + (y - y0) / 2) % 2 === 0) r.ground(x, y, 2, 2, PAL.floor2, 0.022);
		},
	});
	const tall = 3.6;
	const low = 0.7;
	const t = 0.3;
	const seg = 2;
	// Back walls (tall, inner faces visible): along y at x = x0 and along x at y = y0.
	for (let y = y0; y < y1; y += seg) {
		const d = Math.min(seg, y1 - y);
		object(scene, x0 - t, y, x0, y + d, tall, (r) => {
			r.box(x0 - t, y, 0, t, d, tall, PAL.wall);
			r.quad(
				[
					[x0 + 0.01, y + 0.02, 2.5],
					[x0 + 0.01, y + d - 0.02, 2.5],
					[x0 + 0.01, y + d - 0.02, 2.9],
					[x0 + 0.01, y + 0.02, 2.9],
				],
				PAL.wallBand,
				{ flat: true },
			);
			if (Math.round(y) % 4 === 0)
				r.quad(
					[
						[x0 + 0.01, y + 0.4, 1.2],
						[x0 + 0.01, y + d - 0.4, 1.2],
						[x0 + 0.01, y + d - 0.4, 2.2],
						[x0 + 0.01, y + 0.4, 2.2],
					],
					PAL.window,
					{ flat: true },
				);
			else r.box(x0, y + d / 2 - 0.15, 0, 0.25, 0.3, tall, PAL.steel);
		});
	}
	for (let x = x0 - t; x < x1; x += seg) {
		const w = Math.min(seg, x1 - x);
		object(scene, x, y0 - t, x + w, y0, tall, (r) => {
			r.box(x, y0 - t, 0, w, t, tall, PAL.wall);
			r.quad(
				[
					[x + 0.02, y0 + 0.01, 2.5],
					[x + w - 0.02, y0 + 0.01, 2.5],
					[x + w - 0.02, y0 + 0.01, 2.9],
					[x + 0.02, y0 + 0.01, 2.9],
				],
				PAL.wallBand,
				{ flat: true },
			);
			if (Math.round(x - x0) % 4 === 2)
				r.quad(
					[
						[x + 0.4, y0 + 0.01, 1.2],
						[x + w - 0.4, y0 + 0.01, 1.2],
						[x + w - 0.4, y0 + 0.01, 2.2],
						[x + 0.4, y0 + 0.01, 2.2],
					],
					PAL.window,
					{ flat: true },
				);
		});
	}
	// Front walls (low cutaway): along y at x = x1 with a door, and along x at y = y1.
	for (let y = y0; y < y1; y += seg) {
		const d = Math.min(seg, y1 - y);
		if (y + d > door[1] && y < door[3]) continue;
		object(scene, x1, y, x1 + t, y + d, low, (r) => r.box(x1, y, 0, t, d, low, PAL.wall, { top: PAL.wallBand }));
	}
	for (let x = x0 - t; x < x1 + t; x += seg) {
		const w = Math.min(seg, x1 + t - x);
		object(scene, x, y1, x + w, y1 + t, low, (r) => r.box(x, y1, 0, w, t, low, PAL.wall, { top: PAL.wallBand }));
	}
	// Corner posts.
	for (const [x, y, hh] of [
		[x0 - t, y0 - t, tall + 0.2],
		[x1, y0 - t, tall + 0.2],
		[x0 - t, y1, tall + 0.2],
		[x1, y1, low + 0.15],
	])
		object(scene, x - 0.1, y - 0.1, x + t + 0.1, y + t + 0.1, hh, (r) => r.box(x - 0.1, y - 0.1, 0, t + 0.2, t + 0.2, hh, mix(PAL.wallBand, PAL.dark, 0.3)));
	// Outdoor yard behind the hall: pallets of trays and a truck.
	for (let i = 0; i < 4; i++) {
		const px = 4;
		const py = 34 + i * 3;
		object(scene, px, py, px + 1.2, py + 1.0, 1.1, (r) => {
			r.box(px, py, 0, 1.2, 1.0, 0.15, PAL.wood);
			r.box(px + 0.05, py + 0.05, 0.15, 1.1, 0.9, 0.8 - i * 0.1, "#d9c7a0", { top: "#e6d6b2" });
		});
	}
	object(scene, 3, 52, 7.5, 54.6, 3, (r) => {
		r.box(3, 52, 0.4, 3.2, 2.6, 2.4, "#eef1f4", { top: "#f8f9fa" });
		r.box(6.2, 52.2, 0.4, 1.3, 2.2, 1.6, "#3d7fd1");
		r.quad(
			[
				[7.51, 52.4, 1.3],
				[7.51, 54.2, 1.3],
				[7.51, 54.2, 1.85],
				[7.51, 52.4, 1.85],
			],
			PAL.window,
		);
		for (const [wx, wy] of [
			[3.6, 54.6],
			[6.6, 54.6],
		])
			r.box(wx - 0.3, wy - 0.1, 0, 0.6, 0.2, 0.5, PAL.dark);
	});
}

// ---------------------------------------------------------------------------
// Trees and scattered decor

function buildDecor(scene) {
	const R = rng(20261115);
	const avoid = [
		[ZONES.factory.rect, 0.5],
		[ZONES.signal.rect, 0.8],
		[ZONES.rescue.rect, 0.8],
		[ZONES.lesson.rect, 0.8],
		[ZONES.plaza.rect, 1.5],
		[[35, 48, 40, 52], 1],
		[[46, 60, 50, 78], 1.2],
		[[60, 45, 67, 49], 1.2],
	];
	const onRoad = (x, y) => Math.abs(x - y) < 3.4 && x > 57 && y > 57;
	const placed = [];
	let tries = 0;
	while (placed.length < 260 && tries < 6000) {
		tries++;
		const x = 2.5 + R() * (MAP.w - 5);
		const y = 2.5 + R() * (MAP.h - 5);
		if (avoid.some(([rect, pad]) => inRect(x, y, rect, pad)) || onRoad(x, y)) continue;
		if (placed.some((p) => Math.hypot(p[0] - x, p[1] - y) < 2.1)) continue;
		placed.push([x, y]);
	}
	for (const [x, y] of placed) {
		const kind = R() < 0.35 ? "pine" : Math.floor(R() * 4);
		const s = 0.8 + R() * 0.55;
		object(scene, x - 0.9 * s, y - 0.9 * s, x + 0.9 * s, y + 0.9 * s, 3 * s, (r) => drawTree(r, x, y, kind, s));
	}
	// Benches and lamps along the town road.
	for (let i = 0; i < 4; i++) {
		const t = 64 + i * 7;
		const bx = t + 2.6;
		const by = t - 3.4;
		object(scene, bx, by, bx + 0.45, by + 1.4, 0.8, (r) => drawBench(r, bx, by, false));
		const lx = t - 2.9;
		const ly = t + 2.9;
		object(scene, lx - 0.15, ly - 0.15, lx + 0.15, ly + 0.15, 2.9, (r) => drawLamp(r, lx, ly));
	}
}

// ---------------------------------------------------------------------------

/**
 * Build the park into a scene.
 * ctx: { isAvailable(rideId), rideTitle(rideId), onGate(rideId), onTown() }
 */
export function buildPark(scene, ctx) {
	buildTerrain(scene);
	buildPaths(scene);
	for (const id of ["signal", "rescue", "lesson"]) buildHedges(scene, id);
	buildPlaza(scene);
	buildHall(scene);
	buildGates(scene, ctx);
	buildTown(scene, ctx);
	buildDecor(scene);
	return { zones: ZONES, map: MAP };
}

/** Workbench booth: a kiosk with a striped canopy. Ride modules place it through ctx.booth(). */
export function drawBooth(r, x, y, color) {
	r.shadow(x + 0.2, y + 0.2, 1.1, 1.1, 0.16);
	r.box(x - 0.7, y - 0.7, 0, 1.4, 1.4, 0.95, PAL.white, { top: "#e9e4da" });
	r.box(x - 0.7, y + 0.69, 0.55, 1.4, 0.02, 0.18, color);
	r.box(x + 0.69, y - 0.7, 0.55, 0.02, 1.4, 0.18, color);
	r.quad(
		[
			[x - 0.4, y - 0.2, 0.96],
			[x + 0.3, y - 0.2, 0.96],
			[x + 0.3, y - 0.2, 1.45],
			[x - 0.4, y - 0.2, 1.45],
		],
		"#1f3a52",
	);
	for (const [px, py] of [
		[x - 0.66, y - 0.66],
		[x + 0.6, y - 0.66],
		[x - 0.66, y + 0.6],
		[x + 0.6, y + 0.6],
	])
		r.box(px, py, 0.95, 0.06, 0.06, 1.35, PAL.dark);
	const top = [x, y, 2.85];
	const c = [
		[x - 0.85, y - 0.85, 2.3],
		[x + 0.85, y - 0.85, 2.3],
		[x + 0.85, y + 0.85, 2.3],
		[x - 0.85, y + 0.85, 2.3],
	];
	const faces = [];
	const colors = [];
	for (let i = 0; i < 4; i++) {
		const a = c[i];
		const b = c[(i + 1) % 4];
		for (let k = 0; k < 4; k++) {
			const t0 = k / 4;
			const t1 = (k + 1) / 4;
			faces.push([[a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0, 2.3], [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1, 2.3], top]);
			colors.push(k % 2 ? PAL.white : PAL.safety);
		}
	}
	r.mesh(faces, PAL.safety, { colors, center: [x, y, 2.4] });
	r.sphere(x, y, 2.9, 0.08, color, 0);
}
