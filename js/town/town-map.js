// Town map geometry and scene building. Districts sit on a grid of square cells with roads on
// the grid lines; buildings are laid out automatically inside each district's plot. Trucks drive
// the value chain along the roads; light beams carry data, models, and software over the roofs.
// Drawing code only: every word on the map comes from content (district and building titles,
// concept titles for the deployment trail).

import { depthOf, project } from "../engine/iso.js";
import { drawTree, PAL } from "../engine/park.js";
import { LAYER } from "../engine/scene.js";
import { buildingGeometry, cateringIndex } from "./buildings.js";
import { BEAM_STYLE, beamPoints, drawBeam, drawTruck, makeRoute, offsetRight, roundCorners, routeAt } from "./traffic.js";

export const PLOT = 13; // district plot side, m
export const ROAD = 3; // road width, m
export const PITCH = PLOT + ROAD; // grid cell side, m
const VERGE = 3.6; // grass ring outside the outer roads
const MARGIN = 0.8; // free strip between the plot edge and the buildings
const TRAIL_IN = 1.9; // deployment trail: distance inside the road centerline
const TRUCK_SPEED = 3.2; // m/s
const DWELL = 1.4; // s at each end of a delivery

/** Preferred cells: the hardware chain runs down the right side, data and models down the left. */
const PREFERRED = {
	parts: [0, 0],
	"robot-row": [1, 0],
	"model-lab": [0, 1],
	"tool-works": [1, 1],
	integrators: [2, 1],
	applications: [1, 2],
	"factory-district": [2, 2],
};

const DSTYLE = {
	parts: { accent: "#b5543c", ground: "#ecdfc4" },
	"robot-row": { accent: "#e8792f", ground: "#f1ddd0" },
	integrators: { accent: "#d9a400", ground: "#efe6c8" },
	applications: { accent: "#3d7fd1", ground: "#dbe6f1" },
	"model-lab": { accent: "#5b6c80", ground: "#dfe3e9" },
	"tool-works": { accent: "#8a5cc7", ground: "#e6dcf1" },
	"factory-district": { accent: "#1f9e8f", ground: "#d8ede6" },
};
const FALLBACK = [
	{ accent: "#c0567a", ground: "#f0dbe3" },
	{ accent: "#5f8f3a", ground: "#e1ecd5" },
	{ accent: "#b07a4a", ground: "#efe2d2" },
];

/**
 * Value-chain flows drawn on the map (unlabeled; the words live in content). Trucks carry
 * hardware (parts, robots, finished cells and stations); beams carry models, data, and software.
 * The content field district.supplies (a list of district ids) replaces the defaults when present.
 */
const PHYSICAL = new Set(["parts", "robot-row", "integrators", "applications"]);
const CARGO = { parts: "parts", "robot-row": "robot", integrators: "cell", applications: "cell" };
const BEAM_KIND = { "tool-works": "software", "factory-district": "data", "model-lab": "model" };
function defaultFlows(ids) {
	const has = (id) => ids.includes(id);
	const out = [];
	const add = (from, to, kind, style) => {
		if (has(from) && has(to) && from !== to) out.push({ from, to, kind, style });
	};
	add("parts", "robot-row", "truck", "parts");
	add("robot-row", "integrators", "truck", "robot");
	add("integrators", "factory-district", "truck", "cell");
	add("model-lab", "applications", "beam", "model");
	add("applications", "factory-district", "truck", "cell");
	add("factory-district", "model-lab", "beam", "data");
	for (const id of ids) add("tool-works", id, "beam", "software");
	return out;
}

function contentFlows(districts) {
	if (!districts.some((d) => Array.isArray(d.supplies))) return null;
	const out = [];
	for (const d of districts)
		for (const to of d.supplies ?? []) {
			if (PHYSICAL.has(d.id)) out.push({ from: d.id, to, kind: "truck", style: CARGO[d.id] ?? "goods" });
			else out.push({ from: d.id, to, kind: "beam", style: BEAM_KIND[d.id] ?? "model" });
		}
	return out;
}

const key = (a, b) => `${a},${b}`;

/** Building slots inside a plot: one or two rows, n buildings in all. */
function slots(n, [x0, y0, x1, y1], gap = 1.0) {
	if (n <= 0) return [];
	const W = x1 - x0;
	const D = y1 - y0;
	const rows = n === 1 ? 1 : n <= 6 ? 2 : Math.ceil(Math.sqrt(n));
	const per = [];
	let left = n;
	for (let r = 0; r < rows; r++) {
		const c = Math.ceil(left / (rows - r));
		per.push(c);
		left -= c;
	}
	const rowD = (D - gap * (rows - 1)) / rows;
	const out = [];
	per.forEach((cols, r) => {
		const colW = (W - gap * (cols - 1)) / cols;
		for (let c = 0; c < cols; c++) out.push([x0 + c * (colW + gap), y0 + r * (rowD + gap), colW, rowD]);
	});
	return out;
}

// ---------------------------------------------------------------------------
// Plan

/**
 * Lay out the town from content: cells, plots, buildings, roads, flows, and the deployment
 * trail. steps: area-11 concept ids in reading order (may be empty).
 */
export function planTown(town, steps = []) {
	const districts = town.districts ?? [];
	const taken = new Map();
	const placed = [];
	const place = (d, gx, gy) => {
		taken.set(key(gx, gy), d);
		placed.push({ d, gx, gy });
	};
	const rest = [];
	for (const d of districts) {
		const p = PREFERRED[d.id];
		if (p && !taken.has(key(p[0], p[1]))) place(d, p[0], p[1]);
		else rest.push(d);
	}
	if (rest.length) {
		const cand = [];
		for (let gx = -3; gx <= 6; gx++) for (let gy = -3; gy <= 6; gy++) cand.push([gx, gy]);
		cand.sort((a, b) => Math.max(Math.abs(a[0] - 1), Math.abs(a[1] - 1)) - Math.max(Math.abs(b[0] - 1), Math.abs(b[1] - 1)) || Math.abs(a[0] - 1) + Math.abs(a[1] - 1) - (Math.abs(b[0] - 1) + Math.abs(b[1] - 1)) || a[1] - b[1] || a[0] - b[0]);
		const touches = (gx, gy) => !placed.length || placed.some((p) => Math.abs(p.gx - gx) <= 1 && Math.abs(p.gy - gy) <= 1);
		for (const d of rest) {
			const c = cand.find(([gx, gy]) => !taken.has(key(gx, gy)) && touches(gx, gy));
			if (c) place(d, c[0], c[1]);
		}
	}
	// Shift so the smallest cell index is 0.
	const mx = Math.min(0, ...placed.map((p) => p.gx));
	const my = Math.min(0, ...placed.map((p) => p.gy));
	const byId = new Map();
	const list = placed.map((p, i) => {
		const gx = p.gx - mx;
		const gy = p.gy - my;
		const st = DSTYLE[p.d.id] ?? FALLBACK[i % FALLBACK.length];
		const cell = [gx * PITCH, gy * PITCH, (gx + 1) * PITCH, (gy + 1) * PITCH];
		const plot = [cell[0] + ROAD / 2, cell[1] + ROAD / 2, cell[2] - ROAD / 2, cell[3] - ROAD / 2];
		const inner = [plot[0] + MARGIN, plot[1] + MARGIN, plot[2] - MARGIN, plot[3] - MARGIN];
		let mine = (town.buildings ?? []).filter((b) => b.district === p.d.id);
		if (p.d.id === "factory-district" && mine.length) {
			const ci = cateringIndex(mine);
			mine = [mine[ci], ...mine.filter((_, k) => k !== ci)];
		}
		// The district's first building (its signature style) gets the largest slot.
		const rects = slots(mine.length, inner)
			.map((r, k) => ({ r, k }))
			.sort((a, b) => b.r[2] * b.r[3] - a.r[2] * a.r[3] || b.r[0] + b.r[1] - (a.r[0] + a.r[1]) || a.k - b.k)
			.map((x) => x.r);
		const buildings = mine.map((b, k) => {
			const rect = rects[k];
			const geom = buildingGeometry(p.d.id, k, rect, { accent: st.accent, id: b.id, title: b.title });
			return { b, rect, geom, catering: p.d.id === "factory-district" && k === 0 };
		});
		const top = Math.max(2, ...buildings.map((x) => x.geom.top));
		const center = [(plot[0] + plot[2]) / 2, (plot[1] + plot[3]) / 2];
		const hub = buildings[0]?.geom.roof ?? [center[0], center[1], 0.6];
		const info = { d: p.d, id: p.d.id, gx, gy, cell, plot, inner, accent: st.accent, ground: st.ground, buildings, top, center, hub };
		byId.set(p.d.id, info);
		return info;
	});
	const bounds = [
		Math.min(...list.map((c) => c.cell[0])) - VERGE,
		Math.min(...list.map((c) => c.cell[1])) - VERGE,
		Math.max(...list.map((c) => c.cell[2])) + VERGE,
		Math.max(...list.map((c) => c.cell[3])) + VERGE,
	];
	const plan = { districts: list, byId, bounds: list.length ? bounds : [0, 0, 20, 20] };
	plan.graph = roadGraph(list);
	const ids = list.map((c) => c.id);
	const flows = (contentFlows(districts) ?? defaultFlows(ids)).filter((f) => byId.has(f.from) && byId.has(f.to));
	plan.flows = flows.map((f, i) => {
		const A = byId.get(f.from);
		const B = byId.get(f.to);
		if (f.kind === "beam") return { ...f, i, pts: beamPoints(A.hub, B.hub) };
		const base = truckPath(plan.graph, A, B);
		if (!base) return null;
		const out = makeRoute(roundCorners(offsetRight(base, 0.72)));
		const back = makeRoute(roundCorners(offsetRight([...base].reverse(), 0.72)));
		return { ...f, i, out, back, color: A.accent, phase: i * 2.3 };
	}).filter(Boolean);
	plan.trail = trailLoop(plan, steps);
	return plan;
}

// ---------------------------------------------------------------------------
// Roads: graph nodes in half-cell units (corners and edge midpoints of every occupied cell).

function roadGraph(cells) {
	const adj = new Map();
	const link = (a, b) => {
		const ka = key(a[0], a[1]);
		const kb = key(b[0], b[1]);
		if (!adj.has(ka)) adj.set(ka, new Set());
		if (!adj.has(kb)) adj.set(kb, new Set());
		adj.get(ka).add(kb);
		adj.get(kb).add(ka);
	};
	for (const c of cells) {
		const ring = [
			[0, 0],
			[1, 0],
			[2, 0],
			[2, 1],
			[2, 2],
			[1, 2],
			[0, 2],
			[0, 1],
		].map(([i, j]) => [2 * c.gx + i, 2 * c.gy + j]);
		for (let k = 0; k < 8; k++) link(ring[k], ring[(k + 1) % 8]);
	}
	return adj;
}

function bfs(adj, from, to) {
	if (from === to) return [from];
	const prev = new Map([[from, null]]);
	const q = [from];
	while (q.length) {
		const n = q.shift();
		for (const m of adj.get(n) ?? []) {
			if (prev.has(m)) continue;
			prev.set(m, n);
			if (m === to) {
				const path = [to];
				let p = n;
				while (p) {
					path.push(p);
					p = prev.get(p);
				}
				return path.reverse();
			}
			q.push(m);
		}
	}
	return null;
}

const mids = (c) => [
	[2 * c.gx + 1, 2 * c.gy],
	[2 * c.gx + 2, 2 * c.gy + 1],
	[2 * c.gx + 1, 2 * c.gy + 2],
	[2 * c.gx, 2 * c.gy + 1],
];

/** Shortest road path between two districts' frontages (world points, corners only). */
function truckPath(adj, A, B) {
	let best = null;
	for (const a of mids(A))
		for (const b of mids(B)) {
			const ka = key(a[0], a[1]);
			const kb = key(b[0], b[1]);
			if (ka === kb) continue;
			const p = bfs(adj, ka, kb);
			if (p && (!best || p.length < best.length)) best = p;
		}
	if (!best) return null;
	const pts = best.map((k) => k.split(",").map((v) => (Number(v) * PITCH) / 2));
	// Keep only the corners.
	const out = [pts[0]];
	for (let i = 1; i < pts.length - 1; i++) {
		const a = out[out.length - 1];
		const b = pts[i];
		const c = pts[i + 1];
		if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) !== 0) out.push(b);
	}
	out.push(pts[pts.length - 1]);
	return out;
}

/**
 * Deployment trail: a loop just inside the roads around the integrators and the factory
 * district (or whichever exists), starting on the factory's far side. Flags mark the steps.
 */
function trailLoop(plan, steps) {
	if (!steps.length) return null;
	const I = plan.byId.get("integrators");
	const F = plan.byId.get("factory-district");
	const cells = [F, I].filter(Boolean);
	if (!cells.length) return null;
	let rect = cells[0].cell;
	let side = "bottom";
	if (I && F && Math.abs(I.gx - F.gx) + Math.abs(I.gy - F.gy) === 1) {
		rect = [Math.min(I.cell[0], F.cell[0]), Math.min(I.cell[1], F.cell[1]), Math.max(I.cell[2], F.cell[2]), Math.max(I.cell[3], F.cell[3])];
		side = F.gy > I.gy ? "bottom" : F.gy < I.gy ? "top" : F.gx > I.gx ? "right" : "left";
	}
	const [x0, y0, x1, y1] = [rect[0] + TRAIL_IN, rect[1] + TRAIL_IN, rect[2] - TRAIL_IN, rect[3] - TRAIL_IN];
	const mx = (x0 + x1) / 2;
	const my = (y0 + y1) / 2;
	// Counterclockwise on screen, starting at the middle of the factory's far edge.
	const loops = {
		bottom: [[mx, y1], [x1, y1], [x1, y0], [x0, y0], [x0, y1], [mx, y1]],
		top: [[mx, y0], [x0, y0], [x0, y1], [x1, y1], [x1, y0], [mx, y0]],
		right: [[x1, my], [x1, y0], [x0, y0], [x0, y1], [x1, y1], [x1, my]],
		left: [[x0, my], [x0, y1], [x1, y1], [x1, y0], [x0, y0], [x0, my]],
	};
	const route = makeRoute(loops[side]);
	const flags = steps.map((id, i) => {
		const p = routeAt(route, (route.len * (i + 0.5)) / steps.length);
		return { id, n: i + 1, x: p.x, y: p.y, heading: p.heading };
	});
	return { route, flags };
}

// ---------------------------------------------------------------------------
// Scene

const TRAIL_COLOR = "#e2557a";
const ROAD_COLOR = "#8e939a";
const CURB = "#d9d2c3";

function rectOfBounds(b) {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const x of [b[0], b[3]])
		for (const y of [b[1], b[4]])
			for (const z of [b[2], b[5]]) {
				const [px, py] = project(x, y, z);
				minX = Math.min(minX, px);
				minY = Math.min(minY, py);
				maxX = Math.max(maxX, px);
				maxY = Math.max(maxY, py);
			}
	return [minX, minY, maxX, maxY];
}
const overlaps = (a, b) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];

/** Projected-pixel rectangle of a world box (used for fitting the camera). */
export const projRect = rectOfBounds;

/** Projected-pixel rectangle of the occupied town (cells and their verge), up to height z. */
export function townProjRect(plan, z = 3) {
	const out = [Infinity, Infinity, -Infinity, -Infinity];
	for (const c of plan.districts) {
		const r = rectOfBounds([c.cell[0] - VERGE, c.cell[1] - VERGE, 0, c.cell[2] + VERGE, c.cell[3] + VERGE, z]);
		out[0] = Math.min(out[0], r[0]);
		out[1] = Math.min(out[1], r[1]);
		out[2] = Math.max(out[2], r[2]);
		out[3] = Math.max(out[3], r[3]);
	}
	return plan.districts.length ? out : rectOfBounds([0, 0, 0, 20, 20, z]);
}

/**
 * Build the town into a scene. h: { reducedMotion(), selected() -> districtId|null,
 * onDistrict(id), onBuilding(id), onStep(id), stepTitle(id) }.
 * Returns { labels: {districts, buildings, steps} (Maps id -> element), labelPos (Map element ->
 * world anchor [x, y, z]) }.
 */
export function buildTown(scene, plan, h) {
	buildTerrain(scene, plan);
	buildRoads(scene, plan);
	// Static objects that may hide a truck are redrawn over it (the static layer is cached, and
	// trucks are drawn after it).
	const occluders = [];
	const vehicles = [];
	const addObject = (b, draw) => {
		scene.add({ bounds: b, draw });
		const o = { b, rect: rectOfBounds(b), depth: depthOf((b[0] + b[3]) / 2, (b[1] + b[4]) / 2, 0), need: false };
		occluders.push(o);
		scene.addDynamic({ depth: o.depth, bounds: b, draw: (r) => o.need && draw(r) });
	};
	const labels = { districts: new Map(), buildings: new Map(), steps: new Map() };
	// World anchor of every label element (town.js keeps labels from covering each other).
	const labelPos = new Map();

	for (const c of plan.districts) {
		const [px0, py0, px1, py1] = c.plot;
		for (const bd of c.buildings) {
			const [x, y, w, d] = bd.rect;
			const g = bd.geom;
			addObject([x - 0.2, y - 0.2, 0, x + w + 0.2, y + d + 0.2, g.top], (r) => g.draw(r));
			const open = () => h.onBuilding(bd.b.id);
			scene.addHit({ id: `building-${bd.b.id}`, kind: "building", bounds: [x, y, 0, x + w, y + d, g.top], priority: 1, onActivate: open });
			// One label height per row of slots, so neighbors in a row never line up on screen.
			const rowTop = Math.max(...c.buildings.filter((o) => Math.abs(o.rect[1] - y) < 0.01).map((o) => o.geom.top));
			const pos = [x + w / 2, y + d / 2, rowTop + 0.4];
			const el = scene.addLabel({ id: `building-${bd.b.id}`, kind: "building", className: bd.catering ? "catering-plant" : undefined, pos, text: bd.b.title, onClick: open, ariaLabel: `Building: ${bd.b.title}` });
			labels.buildings.set(bd.b.id, el);
			labelPos.set(el, pos);
		}
		const go = () => h.onDistrict(c.id);
		scene.addHit({ id: `district-${c.id}`, kind: "district", bounds: [px0, py0, 0, px1, py1, 0.5], priority: 0, onActivate: go });
		const pos = [c.center[0], c.center[1], 4.2];
		const el = scene.addLabel({ id: `district-${c.id}`, kind: "district", pos, text: c.d.title, onClick: go, ariaLabel: `District: ${c.d.title}` });
		el.style.borderColor = c.accent;
		el.style.setProperty("--district", c.accent);
		labels.districts.set(c.id, el);
		labelPos.set(el, pos);
	}
	buildVerge(scene, plan, addObject);
	if (plan.trail) {
		buildTrail(scene, plan.trail);
		for (const f of plan.trail.flags) {
			const fx = f.x;
			const fy = f.y;
			addObject([fx - 0.4, fy - 0.4, 0, fx + 0.6, fy + 0.6, 2.2], (r) => drawFlag(r, fx, fy));
			const open = () => h.onStep(f.id);
			scene.addHit({ id: `step-${f.id}`, kind: "step", bounds: [fx - 0.5, fy - 0.5, 0, fx + 0.7, fy + 0.7, 2.2], priority: 2, onActivate: open });
			const title = h.stepTitle(f.id);
			const el = scene.addLabel({
				id: `step-${f.id}`,
				kind: "step",
				pos: [fx, fy, 2.3],
				html: `<span class="step-n" aria-hidden="true">${f.n}</span><span class="step-title"></span>`,
				onClick: open,
				ariaLabel: `Step ${f.n}: ${title}`,
			});
			el.querySelector(".step-title").textContent = title;
			labels.steps.set(f.id, el);
			labelPos.set(el, [fx, fy, 2.3]);
		}
	}

	// Trucks.
	for (const f of plan.flows.filter((x) => x.kind === "truck")) {
		const T = f.out.len / TRUCK_SPEED;
		const total = 2 * DWELL + 2 * T;
		const v = { f, x: 0, y: 0, heading: 0, loaded: true, rect: [0, 0, 0, 0], fp: [0, 0, 0, 0], sortDepth: 0 };
		v.update = (t) => {
			const ph = ((((h.reducedMotion() ? DWELL + T * 0.45 + f.phase * 0 : t + f.phase) % total) + total) % total);
			let p;
			if (ph < DWELL) p = routeAt(f.out, 0);
			else if (ph < DWELL + T) p = routeAt(f.out, (ph - DWELL) * TRUCK_SPEED);
			else if (ph < 2 * DWELL + T) p = routeAt(f.out, f.out.len);
			else p = routeAt(f.back, (ph - 2 * DWELL - T) * TRUCK_SPEED);
			v.loaded = ph < 2 * DWELL + T;
			v.x = p.x;
			v.y = p.y;
			v.heading = p.heading;
			v.fp = [p.x - 1.2, p.y - 1.2, p.x + 1.2, p.y + 1.2];
			v.rect = rectOfBounds([v.fp[0], v.fp[1], 0, v.fp[2], v.fp[3], 1.6]);
		};
		v.update(0);
		vehicles.push(v);
		scene.addDynamic({
			depth: () => v.sortDepth,
			bounds: () => [v.fp[0], v.fp[1], 0, v.fp[2], v.fp[3], 1.6],
			animated: () => true,
			draw: (r) => {
				const sel = h.selected();
				drawTruck(r, v.x, v.y, v.heading, f.style, v.loaded, f.color, !!sel && (sel === f.from || sel === f.to));
			},
		});
	}

	// Each frame: move trucks, then decide which static objects must be redrawn over them.
	occluders.sort((a, b) => a.depth - b.depth);
	scene.addTick((dt, t) => {
		for (const v of vehicles) v.update(t);
		for (const o of occluders) o.need = false;
		for (const v of vehicles) {
			let lo = -Infinity;
			let hi = Infinity;
			for (const o of occluders) {
				if (!overlaps(o.rect, v.rect)) continue;
				// A footprint entirely on the far side (smaller x or y) is behind the truck.
				const behind = o.b[3] <= v.fp[0] + 0.6 || o.b[4] <= v.fp[1] + 0.6;
				if (behind) lo = Math.max(lo, o.depth);
				else {
					hi = Math.min(hi, o.depth);
					o.need = true;
				}
			}
			const own = v.x + v.y;
			v.sortDepth = hi === Infinity ? Math.max(own, lo + 1e-3) : lo < hi ? Math.min(Math.max(own, lo + 1e-3), hi - 1e-3) : hi - 1e-3;
		}
		// An object redrawn over a truck must not paint over nearer objects: redraw those too.
		for (let i = 0; i < occluders.length; i++) {
			const o = occluders[i];
			if (!o.need) continue;
			for (let j = i + 1; j < occluders.length; j++) if (!occluders[j].need && overlaps(o.rect, occluders[j].rect)) occluders[j].need = true;
		}
		return false;
	});

	// Beams over the roofs.
	const [bx0, by0, bx1, by1] = plan.bounds;
	scene.addDynamic({
		depth: 1e6,
		bounds: [bx0, by0, 0, bx1, by1, 16],
		animated: () => plan.flows.some((f) => f.kind === "beam"),
		draw: (r, t) => {
			const sel = h.selected();
			const tt = h.reducedMotion() ? 0.8 : t;
			const beams = plan.flows.filter((f) => f.kind === "beam");
			const strong = (f) => sel && (f.from === sel || f.to === sel);
			for (const f of beams) if (!strong(f)) drawBeam(r, f.pts, BEAM_STYLE[f.style] ?? BEAM_STYLE.model, tt + f.i * 0.37, sel ? 0 : 1);
			for (const f of beams) if (strong(f)) drawBeam(r, f.pts, BEAM_STYLE[f.style] ?? BEAM_STYLE.model, tt + f.i * 0.37, 2);
		},
	});
	return { labels, labelPos };
}

function buildTerrain(scene, plan) {
	const cells = plan.districts;
	scene.add({
		layer: LAYER.TERRAIN,
		depth: -1e6,
		bounds: [plan.bounds[0], plan.bounds[1], -1.4, plan.bounds[2], plan.bounds[3], 0],
		draw: (r) => {
			// Cliff faces first, then every grass top over them (a cliff hidden by another cell's
			// grass is painted over, so the union of squares needs no clipping).
			for (const c of cells) {
				const [x0, y0, x1, y1] = [c.cell[0] - VERGE, c.cell[1] - VERGE, c.cell[2] + VERGE, c.cell[3] + VERGE];
				r.quad(
					[
						[x0, y1, -1.4],
						[x1, y1, -1.4],
						[x1, y1, 0],
						[x0, y1, 0],
					],
					PAL.earth,
				);
				r.quad(
					[
						[x1, y1, -1.4],
						[x1, y0, -1.4],
						[x1, y0, 0],
						[x1, y1, 0],
					],
					PAL.earth,
				);
			}
			for (const c of cells) {
				const [x0, y0, x1, y1] = [c.cell[0] - VERGE, c.cell[1] - VERGE, c.cell[2] + VERGE, c.cell[3] + VERGE];
				r.ground(x0, y0, x1 - x0, y1 - y0, PAL.sand, 0);
			}
			for (const c of cells) {
				const v = VERGE - 0.9;
				r.ground(c.cell[0] - v, c.cell[1] - v, PITCH + 2 * v, PITCH + 2 * v, PAL.grass, 0.004);
			}
		},
	});
}

function buildRoads(scene, plan) {
	const cells = plan.districts;
	const [bx0, by0, bx1, by1] = plan.bounds;
	scene.add({
		layer: LAYER.GROUND,
		depth: -5e5,
		bounds: [bx0, by0, 0, bx1, by1, 0.02],
		draw: (r) => {
			for (const c of cells) r.ground(c.cell[0] - ROAD / 2, c.cell[1] - ROAD / 2, PITCH + ROAD, PITCH + ROAD, ROAD_COLOR, 0.008);
			// Center dashes on every road segment, stopping short of the crossings.
			const segs = new Set();
			for (const c of cells) {
				const corners = [
					[c.gx, c.gy],
					[c.gx + 1, c.gy],
					[c.gx + 1, c.gy + 1],
					[c.gx, c.gy + 1],
				];
				for (let k = 0; k < 4; k++) {
					const a = corners[k];
					const b = corners[(k + 1) % 4];
					const s = a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? `${a}|${b}` : `${b}|${a}`;
					segs.add(s);
				}
			}
			for (const s of segs) {
				const [a, b] = s.split("|").map((p) => p.split(",").map((v) => Number(v) * PITCH));
				const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
				const ux = (b[0] - a[0]) / len;
				const uy = (b[1] - a[1]) / len;
				for (let u = ROAD / 2 + 0.8; u < len - ROAD / 2 - 0.8; u += 1.6) {
					const p = [a[0] + ux * u, a[1] + uy * u];
					const q = [a[0] + ux * (u + 0.8), a[1] + uy * (u + 0.8)];
					const nx = -uy * 0.07;
					const ny = ux * 0.07;
					r.groundPoly(
						[
							[p[0] + nx, p[1] + ny],
							[q[0] + nx, q[1] + ny],
							[q[0] - nx, q[1] - ny],
							[p[0] - nx, p[1] - ny],
						],
						"#f4f4f2",
						0.012,
					);
				}
				// Zebra crossings at both ends.
				for (const end of [ROAD / 2 + 0.15, len - ROAD / 2 - 0.65]) {
					for (let k = -3; k <= 3; k++) {
						const off = k * 0.38;
						const nx = -uy;
						const ny = ux;
						const p = [a[0] + ux * end + nx * (off - 0.12), a[1] + uy * end + ny * (off - 0.12)];
						r.groundPoly(
							[
								p,
								[p[0] + ux * 0.5, p[1] + uy * 0.5],
								[p[0] + ux * 0.5 + nx * 0.24, p[1] + uy * 0.5 + ny * 0.24],
								[p[0] + nx * 0.24, p[1] + ny * 0.24],
							],
							"rgba(244,244,242,0.75)",
							0.012,
						);
					}
				}
			}
		},
	});
	for (const c of cells) {
		const [x0, y0, x1, y1] = c.plot;
		scene.add({
			layer: LAYER.GROUND,
			depth: -4e5 + c.gx + c.gy,
			bounds: [x0, y0, 0, x1, y1, 0.03],
			draw: (r) => {
				r.ground(x0 - 0.25, y0 - 0.25, x1 - x0 + 0.5, y1 - y0 + 0.5, CURB, 0.014);
				r.ground(x0, y0, x1 - x0, y1 - y0, c.ground, 0.016);
				// Footpaths between the building slots.
				const [ix0, iy0, ix1, iy1] = c.inner;
				r.ground(ix0 - 0.4, (iy0 + iy1) / 2 - 0.35, ix1 - ix0 + 0.8, 0.7, "#e6e0d3", 0.018);
			},
		});
	}
}

/** Trees and lamps on the grass ring around the town (outside the outer roads). */
function buildVerge(scene, plan, addObject) {
	const cells = plan.districts;
	const occupied = new Set(cells.map((c) => key(c.gx, c.gy)));
	let seed = 11;
	const rnd = () => {
		seed = (seed * 16807) % 2147483647;
		return seed / 2147483647;
	};
	for (const c of cells) {
		const sides = [
			[0, -1],
			[1, 0],
			[0, 1],
			[-1, 0],
		];
		for (const [dx, dy] of sides) {
			if (occupied.has(key(c.gx + dx, c.gy + dy))) continue;
			const n = 4;
			for (let k = 0; k < n; k++) {
				const t = (k + 0.5 + (rnd() - 0.5) * 0.4) / n;
				const off = ROAD / 2 + 1.3;
				let x;
				let y;
				if (dx === 0) {
					x = c.cell[0] + t * PITCH;
					y = dy < 0 ? c.cell[1] - off : c.cell[3] + off;
				} else {
					y = c.cell[1] + t * PITCH;
					x = dx < 0 ? c.cell[0] - off : c.cell[2] + off;
				}
				// Skip spots inside a neighboring district's road ring.
				if (cells.some((o) => o !== c && x > o.cell[0] - ROAD && x < o.cell[2] + ROAD && y > o.cell[1] - ROAD && y < o.cell[3] + ROAD)) continue;
				const kind = rnd() < 0.3 ? "pine" : Math.floor(rnd() * 4);
				const s = 0.75 + rnd() * 0.25;
				addObject([x - 0.9, y - 0.9, 0, x + 0.9, y + 0.9, 3], (r) => drawTree(r, x, y, kind, s));
			}
		}
	}
}

function buildTrail(scene, trail) {
	const pts = trail.route.pts;
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	scene.add({
		layer: LAYER.GROUND,
		depth: -3e5,
		bounds: [Math.min(...xs) - 0.3, Math.min(...ys) - 0.3, 0, Math.max(...xs) + 0.3, Math.max(...ys) + 0.3, 0.03],
		draw: (r) => {
			for (let i = 1; i < pts.length; i++) {
				const a = pts[i - 1];
				const b = pts[i];
				const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
				const ux = (b[0] - a[0]) / len;
				const uy = (b[1] - a[1]) / len;
				const nx = -uy * 0.13;
				const ny = ux * 0.13;
				r.groundPoly(
					[
						[a[0] + nx - ux * 0.13, a[1] + ny - uy * 0.13],
						[b[0] + nx + ux * 0.13, b[1] + ny + uy * 0.13],
						[b[0] - nx + ux * 0.13, b[1] - ny + uy * 0.13],
						[a[0] - nx - ux * 0.13, a[1] - ny - uy * 0.13],
					],
					TRAIL_COLOR,
					0.022,
				);
				// Direction chevrons.
				for (let u = 1.6; u < len - 0.8; u += 3.2) {
					const c = [a[0] + ux * u, a[1] + uy * u];
					r.groundPoly(
						[
							[c[0] - ux * 0.25 + nx * 2.6, c[1] - uy * 0.25 + ny * 2.6],
							[c[0] + ux * 0.25, c[1] + uy * 0.25],
							[c[0] - ux * 0.25 - nx * 2.6, c[1] - uy * 0.25 - ny * 2.6],
						],
						"#ffffff",
						0.024,
					);
				}
			}
		},
	});
}

function drawFlag(r, x, y) {
	r.shadow(x + 0.1, y + 0.1, 0.35, 0.35, 0.18);
	r.cylinder(x, y, 0, 0.2, 0.12, "#3b4048", 8);
	r.cylinder(x, y, 0.12, 0.04, 1.95, "#3b4048", 6);
	r.quad(
		[
			[x, y + 0.02, 2.05],
			[x + 0.62, y + 0.32, 1.83],
			[x, y + 0.02, 1.58],
		],
		TRAIL_COLOR,
	);
	r.sphere(x, y, 2.1, 0.07, "#f2c230", 0);
}
