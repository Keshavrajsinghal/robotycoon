// Drawing for wb6-line-balancing: a low-poly diorama of the line, one station per chart column.
// The belt runs almost left to right (slightly downhill) so each station sits right above its
// bar in the chart below. Station robots follow the line's agreed design: a six-axis arm with
// soft fingers at a grape tote, deltas with vacuum cups over moving apple and cheese belts, a
// SCARA with a vacuum cup at the cracker feeder, and a gantry at the outfeed. The belt indexes:
// every tray in one part of the line (between buffers) moves on together. Drawing code only;
// the words on screen live in the main module.

import { drawAppleSlice, drawCheeseWedge, drawCrackerPack, drawHangingBunch, drawPlate, drawTrayStack, FOOD, PLATE_AFTER } from "../engine/food.js";
import { ISO, IsoRenderer, shade } from "../engine/iso.js";
import { PAL } from "../engine/park.js";
import { dip, drawDelta, drawSixAxis, ik2, ROBOT_COLORS, shuttle } from "../engine/robots.js";

const A = -0.6; // belt heading in world radians (-pi/4 would be exactly horizontal on screen)
const U = [Math.cos(A), Math.sin(A)]; // along the belt
const V = [-Math.sin(A), Math.cos(A)]; // across the belt, toward the viewer
const KX = (U[0] - U[1]) * ISO.X; // screen px per meter along the belt at zoom 1
const KY = (U[0] + U[1]) * ISO.Y;
const TY = (V[0] + V[1]) * ISO.Y; // screen px per meter across the belt (vertical part)
const BZ = 0.55; // belt top
const BELT_W = 0.62;
const PS = 0.95; // plate scale
const RS = 0.7; // robot scale
const T_BACK = -1.6; // floor depth behind the belt
const T_FRONT = 0.95;
const COL_M = 1.55; // preferred column width in meters
const Z_TOP = 2.15;
const HI = "#f2c230"; // upgraded tool color (PAL.safety)
const GANTRY_H = 1.6;
const RACK_T = -1.4; // buffer racks stand behind every station's feeds
const GANTRY_S = [-0.45, 0.5]; // gantry posts along the belt, relative to the outfeed station

/** World point from belt coordinates: s along the belt, t across it (toward the viewer), z up. */
const W = (s, t, z = 0) => [s * U[0] + t * V[0], s * U[1] + t * V[1], z];
const W2 = (s, t) => [s * U[0] + t * V[0], s * U[1] + t * V[1]];
const lerp3 = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
const ease = (v) => v * v * (3 - 2 * v);

function obox(r, s, t, z, len, wid, h, color, opts) {
	const [x, y] = W2(s, t);
	r.orientedBox(x, y, z, len, wid, h, A, color, opts);
}

function floorRect(r, s0, s1, t0, t1, color, z = 0) {
	r.groundPoly([W2(s0, t0), W2(s1, t0), W2(s1, t1), W2(s0, t1)], color, z);
}

/** Local frame for the food models (same convention as food.js): f along the belt, sd across. */
function frameAt(x, y, z, heading, s) {
	const ca = Math.cos(heading);
	const sa = Math.sin(heading);
	return (f, sd, zz = 0) => [x + (f * ca - sd * sa) * s, y + (f * sa + sd * ca) * s, z + zz * s];
}

/** Lay the diorama out over a canvas of the given CSS width, one column per station. */
export function flowLayout(width, n) {
	const colPx = width / n;
	const zoom = Math.min(1.4, Math.max(0.28, colPx / (COL_M * KX)));
	const Wm = colPx / (zoom * KX);
	const S = Array.from({ length: n }, (_, i) => (i + 0.5 - n / 2) * Wm);
	const s0 = -(n / 2) * Wm;
	const s1 = (n / 2) * Wm;
	// Vertical extent: floor corners and the tallest machines.
	const py = (s, t, z) => (s * KY + t * TY - z * ISO.Z) * zoom;
	const ys = [];
	for (const s of [s0, s1]) for (const t of [T_BACK, T_FRONT]) ys.push(py(s, t, 0), py(s, t, t < 0 ? Z_TOP : 0));
	const top = Math.min(...ys);
	const bottom = Math.max(...ys);
	const h = Math.ceil(bottom - top + 14);
	return { w: width, h, zoom, Wm, S, s0, s1, ox: width / 2, oy: 8 - top, colPx };
}

/** Plate contents after each stage index, built from the ride-1 plate states. */
function contentsTable(ids) {
	const out = [];
	let acc = {};
	for (const id of ids) {
		acc = { ...acc, ...(PLATE_AFTER[id] ?? {}) };
		out.push(acc);
	}
	return out;
}

// Robot drawn at a station: the row's chosen robot type when the data gives one, else the agreed
// station design by id; unknown pick stations get a SCARA.
const ROBOT_KIND = { grapes: "six", apples: "delta", crackers: "scara", cheese: "delta" };
const TYPE_KIND = { delta: "delta", scara: "scara", "six-axis": "six" };
const MACHINE = new Set(["denester", "inspection", "lidding", "outfeed", "infeed"]);
const kindOf = (id, row) => (row?.kind ? TYPE_KIND[row.kind] : null) ?? ROBOT_KIND[id] ?? (MACHINE.has(id) ? null : "scara");
const robotsOf = (row) => Math.max(1, row?.count ?? 1);
/** Delta positions along the belt for n deltas sharing a station centered at S, and the frame's half width. */
const deltaSpots = (S, n) => (n <= 1 ? [S] : Array.from({ length: n }, (_, k) => S + (k - (n - 1) / 2) * (n === 2 ? 0.72 : 0.46)));
const deltaHalf = (n) => (n > 1 ? 0.74 : 0.56);

/** SCARA with a vacuum cup (robots.js draws its SCARA with fingers). Same geometry otherwise. */
function drawScaraCup(r, bx, by, target, toolZ, s, colors) {
	const C = { ...ROBOT_COLORS, ...colors };
	const L1 = 0.62 * s;
	const L2 = 0.55 * s;
	const z1 = 1.15 * s;
	const k = ik2(L1, L2, target[0] - bx, target[1] - by, true);
	const e = [bx + k.elbow[0], by + k.elbow[1]];
	const w = [bx + k.wrist[0], by + k.wrist[1]];
	r.box(bx - 0.36 * s, by - 0.36 * s, 0, 0.72 * s, 0.72 * s, 0.12 * s, C.joint);
	r.cylinder(bx, by, 0.12 * s, 0.24 * s, z1 - 0.12 * s, C.body, 10);
	r.cylinder(bx, by, z1, 0.2 * s, 0.18 * s, C.accent, 10);
	r.beam([bx, by, z1 + 0.09 * s], [e[0], e[1], z1 + 0.09 * s], 0.3 * s, 0.17 * s, C.body);
	r.cylinder(e[0], e[1], z1 + 0.02 * s, 0.16 * s, 0.24 * s, C.accent, 10);
	const qTop = z1 + 0.5 * s;
	const tip = Math.min(qTop - 0.1 * s, toolZ + 0.08 * s);
	r.cylinder(w[0], w[1], tip, 0.035 * s, qTop - tip, C.metal, 6);
	r.cylinder(w[0], w[1], toolZ + 0.03 * s, 0.03 * s, tip - toolZ - 0.03 * s, C.joint, 6);
	// Bellows cup: two stacked folds.
	r.cylinder(w[0], w[1], toolZ + 0.018 * s, 0.04 * s, 0.018 * s, C.rubber, 8);
	r.cylinder(w[0], w[1], toolZ, 0.05 * s, 0.018 * s, shade(C.rubber, 1.25), 8);
	r.beam([e[0], e[1], z1 + 0.3 * s], [w[0], w[1], z1 + 0.3 * s], 0.24 * s, 0.15 * s, C.body);
	r.cylinder(w[0], w[1], z1 + 0.22 * s, 0.11 * s, 0.22 * s, C.accent, 8);
	return [w[0], w[1]];
}

export class FlowView {
	constructor(canvas, ids) {
		this.canvas = canvas;
		this.ids = ids;
		this.n = ids.length;
		this.contents = contentsTable(ids);
		this.pos = new Map(); // plate id -> displayed [s, t, z]
		this.gpos = null; // displayed gantry tool [s, t, z]
		this.L = null;
		this.dpr = 1;
	}

	resize(width) {
		if (!(width > 0)) return false;
		this.L = flowLayout(width, this.n);
		this.dpr = Math.min(2, window.devicePixelRatio || 1);
		const c = this.canvas;
		c.width = Math.round(this.L.w * this.dpr);
		c.height = Math.round(this.L.h * this.dpr);
		c.style.height = `${this.L.h}px`;
		return true;
	}

	/** Column index under a canvas x (CSS px). */
	columnAt(x) {
		if (!this.L) return -1;
		return Math.max(0, Math.min(this.n - 1, Math.floor(x / this.L.colPx)));
	}

	/** Place k on the buffer rack in front of station i (at the back of the floor, between columns). */
	slot(i, k) {
		return [this.L.S[i] - 0.5 * this.L.Wm, RACK_T, 0.36 + k * 0.15];
	}

	cartTop() {
		const { S, Wm } = this.L;
		return [S[this.n - 1] + 0.12 * Wm, -1.12, 0.57];
	}

	cartDrop(sim) {
		const c = this.cartTop();
		return [c[0], c[1], c[2] + (sim.out % 5) * 0.1];
	}

	/** Where each plate in the simulation should be drawn right now. */
	targets(sim, P) {
		const { S } = this.L;
		const out = new Map();
		for (let i = 0; i < this.n; i++) {
			const part = sim.part(i, P);
			const f = ease(part.f);
			const takes = part.indexing && i === part.from && i > 0;
			sim.q[i].forEach((p, k) => {
				const at = this.slot(i, k);
				out.set(p.id, { p, at: k === 0 && takes ? lerp3(at, [S[i], 0, BZ], f) : at });
			});
			const st = sim.st[i];
			if (!st.plate) continue;
			let at = [S[i], 0, BZ];
			if (part.indexing) {
				let to;
				if (i < part.to) to = [S[i + 1], 0, BZ];
				else if (i === this.n - 1) to = this.cartDrop(sim);
				else to = this.slot(i + 1, sim.q[i + 1].length);
				at = lerp3(at, to, f);
				if (i === part.to) at[2] += Math.sin(part.f * Math.PI) * 0.35; // lifted off the belt
			}
			out.set(st.plate.id, { p: st.plate, at });
		}
		return out;
	}

	/** Ease displayed plate positions toward their targets (snap = jump straight there). */
	update(sim, P, dt, snap) {
		if (!this.L) return;
		const tg = this.targets(sim, P);
		const k = snap ? 1 : 1 - Math.exp(-dt * 20);
		for (const [id, { at }] of tg) {
			const cur = this.pos.get(id);
			if (!cur) this.pos.set(id, snap || at[0] > this.L.S[0] + 0.01 ? [...at] : [at[0], at[1], at[2] + 0.45]); // new trays drop from the denester stack
			else for (let j = 0; j < 3; j++) cur[j] += (at[j] - cur[j]) * k;
		}
		for (const id of [...this.pos.keys()]) if (!tg.has(id)) this.pos.delete(id);
		this.tg = tg;
		const g = this.gantryTarget(sim, P);
		if (!this.gpos || snap) this.gpos = g;
		else for (let j = 0; j < 3; j++) this.gpos[j] += (g[j] - this.gpos[j]) * (1 - Math.exp(-dt * 14));
	}

	/** The outfeed gantry's tool: over the belt, lowering onto the tray, then carrying it to the cart. */
	gantryTarget(sim, P) {
		const i = this.n - 1;
		const S = this.L.S[i];
		if (this.ids[i] !== "outfeed") return [S, 0, BZ + 0.6];
		const st = sim.st[i];
		const part = sim.part(i, P);
		if (st.plate && part.indexing) {
			const at = this.tg?.get(st.plate.id)?.at;
			if (at) return [at[0], at[1], at[2] + 0.2];
		}
		if (st.plate) {
			const u = P.work[i] > 0 ? Math.min(1, st.el / P.work[i]) : 1;
			return [S, 0, BZ + 0.2 + 0.4 * (1 - ease(u))];
		}
		return [S, 0, BZ + 0.6];
	}

	/**
	 * Draw one frame. o = { rows (evaluate rows), selected, time, reduced, sim, P, buffers[] }.
	 */
	draw(o) {
		const L = this.L;
		if (!L) return;
		const c = this.canvas.getContext("2d");
		c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
		c.clearRect(0, 0, L.w, L.h);
		const r = new IsoRenderer(c);
		r.setTransform(L.zoom, L.ox, L.oy);
		const { S, Wm, s0, s1 } = L;
		const t = o.reduced ? 0 : o.time;

		// Floor: one tile per column, tinted for the selected station and the bottleneck.
		for (let i = 0; i < this.n; i++) {
			const row = o.rows[i];
			let col = i % 2 ? PAL.floor : PAL.floor2;
			if (row.over) col = row.bottleneck ? "#e8b3a3" : "#ecd0c4";
			else if (row.bottleneck) col = "#f0dca0";
			if (i === o.selected) col = shade(col, 1.12);
			floorRect(r, S[i] - Wm / 2, S[i] + Wm / 2, T_BACK, T_FRONT, col);
		}
		floorRect(r, s0, s1, T_BACK, T_BACK + 0.06, PAL.wallBand, 0.001);
		const sel = o.selected;
		if (sel >= 0) {
			const e = 0.04;
			r.polyline(
				[W(S[sel] - Wm / 2 + e, T_BACK + e), W(S[sel] + Wm / 2 - e, T_BACK + e), W(S[sel] + Wm / 2 - e, T_FRONT - e), W(S[sel] - Wm / 2 + e, T_FRONT - e)],
				"rgba(31,111,209,0.85)",
				2.4,
				true,
			);
		}
		// Safety line along the front of the belt.
		r.line(W(s0, 0.62, 0.002), W(s1, 0.62, 0.002), PAL.safety, 2.2);

		// Behind the belt: buffers, feeds, pedestals, machine backs, the outfeed cart.
		for (let i = 0; i < this.n; i++) if (o.buffers[i]) this.drawRack(r, i);
		for (let i = 0; i < this.n; i++) this.drawBack(r, i, o, t);

		// The belt itself.
		const len = s1 - s0 + 0.1;
		for (let s = s0 + 0.35; s < s1; s += 1.1) {
			obox(r, s, -BELT_W / 2 + 0.06, 0, 0.08, 0.08, BZ - 0.1, PAL.dark);
			obox(r, s, BELT_W / 2 - 0.06, 0, 0.08, 0.08, BZ - 0.1, PAL.dark);
		}
		obox(r, 0, 0, BZ - 0.12, len, BELT_W, 0.11, PAL.metal);
		floorRect(r, s0, s1, -BELT_W / 2 + 0.06, BELT_W / 2 - 0.06, "#3a3f47", BZ - 0.005);
		r.line(W(s0, -BELT_W / 2, BZ + 0.01), W(s1, -BELT_W / 2, BZ + 0.01), PAL.steel, 2);
		r.line(W(s0, BELT_W / 2, BZ + 0.01), W(s1, BELT_W / 2, BZ + 0.01), PAL.steel, 2);

		// Plates, back to front.
		const plates = [];
		for (const [id, at] of this.pos) {
			const tg = this.tg?.get(id);
			if (tg) plates.push({ at, p: tg.p, d: at[0] * (U[0] + U[1]) + at[1] * (V[0] + V[1]) + at[2] * 0.3 });
		}
		plates.sort((a, b) => a.d - b.d);
		for (const { at, p } of plates) {
			const [x, y, z] = W(at[0], at[1], at[2]);
			drawPlate(r, x, y, z, A, p.stage >= 0 ? this.contents[p.stage] : {}, { scale: PS, lineScale: 0.8 });
		}

		// Robots and machine parts over the belt, then front posts and markers.
		for (let i = 0; i < this.n; i++) this.drawStation(r, i, o, t);
		for (let i = 0; i < this.n; i++) this.drawFront(r, i, o, t);
	}

	drawRack(r, i) {
		const s = this.L.S[i] - 0.5 * this.L.Wm;
		const tc = RACK_T;
		obox(r, s, tc, 0, 0.6, 0.36, 0.34, "#4f7fae", { top: "#5f90bf" });
		for (let k = 0; k < 4; k++) obox(r, s, tc - 0.17, 0.34 + k * 0.15, 0.6, 0.03, 0.02, PAL.steel);
		obox(r, s - 0.28, tc - 0.16, 0.34, 0.04, 0.04, 0.66, PAL.steel);
		obox(r, s + 0.28, tc - 0.16, 0.34, 0.04, 0.04, 0.66, PAL.steel);
	}

	/** Station parts that stand behind the belt (drawn before the belt and plates). */
	drawBack(r, i, o, t) {
		const id = this.ids[i];
		const S = this.L.S[i];
		const row = o.rows[i];
		const kind = kindOf(id, row);
		const n = robotsOf(row);
		if (kind === "six" || kind === "scara") {
			// Pedestals (robots stand at belt height so their arms clear the belt) and feeds.
			for (const b of this.robotBases(i, n)) {
				obox(r, b.s, b.t, 0, 0.42, 0.42, BZ, PAL.steel, { top: shade(PAL.steel, 1.1) });
				this.drawFeed(r, id, b.feed[0], b.feed[1]);
			}
			for (const from of row.inFrom) this.drawFeed(r, from, S - 0.4, -1.08, 0.7);
			return;
		}
		if (kind === "delta") {
			// The ingredient belt under the delta keeps moving; the delta picks from it.
			this.drawIngredientBelt(r, id, S, -0.7, n > 1 ? 0.7 : 0.5, t);
			for (const from of row.inFrom) this.drawFeed(r, from, S + 0.34, -1.14, 0.7);
			const half = deltaHalf(n);
			for (const ps of [S - half, S + half]) obox(r, ps, -1.02, 0, 0.07, 0.07, 1.82, PAL.steel);
			return;
		}
		if (id === "denester" || id === "lidding" || id === "inspection") {
			obox(r, S, -0.55, 0, 0.5, 0.14, id === "inspection" ? 1.2 : 1.32, "#d7dce2");
		}
		if (id === "lidding") {
			obox(r, S + 0.42, -1.0, 0, 0.42, 0.42, 0.55, PAL.steel);
			for (let k = 0; k < 6; k++) {
				const [x, y] = W2(S + 0.42, -1.0);
				r.orientedBox(x, y, 0.55 + k * 0.05, 0.44, 0.32, 0.04, A, FOOD.lid, { alpha: 0.6, edge: "rgba(255,255,255,0.7)" });
			}
		}
		if (id === "outfeed") {
			for (const ps of GANTRY_S) obox(r, S + ps, -1.55, 0, 0.08, 0.08, GANTRY_H, PAL.metal);
		}
		if (i === this.n - 1) {
			// Outfeed trolley; finished plates stack on it.
			const [cs, ct, cz] = this.cartTop();
			for (const [ds, dt] of [
				[-0.34, -0.26],
				[0.34, -0.26],
				[-0.34, 0.26],
				[0.34, 0.26],
			]) {
				const [x, y] = W2(cs + ds, ct + dt);
				r.cylinder(x, y, 0, 0.05, 0.1, PAL.dark, 6);
				obox(r, cs + ds, ct + dt, 0.1, 0.05, 0.05, cz - 0.16, "#7f8b98");
			}
			obox(r, cs, ct, 0.22, 0.78, 0.6, 0.04, "#9aa5b1");
			obox(r, cs, ct, cz - 0.06, 0.8, 0.62, 0.06, "#9aa5b1");
			obox(r, cs - 0.42, ct, cz - 0.06, 0.05, 0.62, 0.5, "#7f8b98");
			const done = this.contents[this.n - 1];
			const stack = o.sim.out % 5;
			const [x, y] = W2(cs, ct);
			for (let k = 0; k < stack; k++) drawPlate(r, x, y, cz + k * 0.1, A, done, { scale: PS, lineScale: 0.8 });
		}
	}

	/** The item an arm carries at station id, hanging under its tool at (x, y, z). */
	drawHeld(r, id, x, y, z) {
		const at = frameAt(x, y, z, A, 1);
		if (id === "grapes") drawHangingBunch(r, x, y, z + 0.11, 0, 0.75);
		else if (id === "apples") drawAppleSlice(r, at, 0, 0, 0.3, 0.85, 0.8);
		else if (id === "cheese") drawCheeseWedge(r, at, 0, 0, 0.3, 0.85);
		else drawCrackerPack(r, at, 0, 0, A, 0.85);
	}

	/** Pedestal spots for n arms (six-axis or SCARA) sharing station i, each with its feed. */
	robotBases(i, n) {
		const S = this.L.S[i];
		if (n <= 1) return [{ s: S - 0.14, t: -0.76, feed: [S + 0.26, -1.02], phase: 0 }];
		if (n === 2)
			return [
				{ s: S - 0.4, t: -0.76, feed: [S - 0.6, -1.06], phase: 0.5 },
				{ s: S + 0.34, t: -0.76, feed: [S + 0.56, -1.06], phase: 0 },
			];
		return Array.from({ length: n }, (_, k) => {
			const d = (k - (n - 1) / 2) * 0.5;
			return { s: S + d, t: -0.76, feed: [S + d * 1.3, -1.12], phase: (n - 1 - k) / n };
		});
	}

	/** A tote (grapes) or feeder stack (crackers, anything else) behind the belt. */
	drawFeed(r, id, s, t, k = 1) {
		const w = 0.34 * k;
		const color = id === "grapes" ? "#2f6fb3" : id === "crackers" ? "#c0392b" : id === "apples" ? "#5c6f86" : id === "cheese" ? "#2e8a6a" : "#5c6f86";
		obox(r, s, t, 0, w, w, 0.08, PAL.dark);
		obox(r, s, t, 0.08, w, w, 0.32, color, { top: shade(color, id === "grapes" ? 0.55 : 0.85) });
		const [x, y] = W2(s, t);
		if (id === "grapes") {
			// Bunches lying at random angles in the open tote.
			for (const [ds, dt, n] of [
				[-0.07, -0.05, 4],
				[0.06, 0.06, 3],
			]) {
				const [bx, by] = W2(s + ds * k, t + dt * k);
				for (let j = 0; j < n; j++) r.sphere(bx + (j % 2) * 0.04, by + (j > 1 ? 0.04 : 0), 0.4 + (j > 1 ? 0.02 : 0), 0.04, j % 2 ? FOOD.grape : FOOD.grape2, 0);
			}
		} else if (id === "crackers") {
			for (let j = 0; j < 3; j++) drawCrackerPack(r, frameAt(x, y, 0.38 + j * 0.035, A, 1), 0, 0, A, 0.95 * k);
		} else if (id === "apples") {
			drawAppleSlice(r, frameAt(x, y, 0.41, A, 1), 0, 0, 0.4, k, 0.8);
		} else if (id === "cheese") {
			drawCheeseWedge(r, frameAt(x, y, 0.41, A, 1), 0, 0, 0.4, k);
		}
	}

	/** A short continuously moving belt behind the main belt, carrying slices or wedges. */
	drawIngredientBelt(r, id, S, tc, half, t) {
		const z = 0.42;
		obox(r, S - half + 0.1, tc, 0, 0.06, 0.06, z - 0.05, PAL.dark);
		obox(r, S + half - 0.1, tc, 0, 0.06, 0.06, z - 0.05, PAL.dark);
		obox(r, S, tc, z - 0.08, half * 2, 0.34, 0.08, PAL.metal);
		floorRect(r, S - half, S + half, tc - 0.14, tc + 0.14, "#3a3f47", z + 0.002);
		const n = Math.max(3, Math.round(half * 6));
		for (let k = 0; k < n; k++) {
			const u = (((k / n + t * 0.06) % 1) + 1) % 1;
			const s = S - half + 0.06 + u * (half * 2 - 0.12);
			const [x, y] = W2(s, tc + (k % 2 ? 0.05 : -0.05));
			const at = frameAt(x, y, z + 0.004, A, 1);
			if (id === "cheese") drawCheeseWedge(r, at, 0, 0, k * 1.3, 0.85);
			else if (id === "crackers") drawCrackerPack(r, at, 0, 0, A, 0.8);
			else drawAppleSlice(r, at, 0, 0, k * 1.1, 0.85, 0.8);
		}
	}

	/**
	 * Robot pose from the station's progress: k = 0 at the feed, 1 over the tray; holding while it
	 * carries an item. A station frozen by a stop keeps its pose.
	 */
	pose(i, o, phase) {
		const st = o.sim.st[i];
		const ph = o.sim.phase(i, o.P);
		const work = o.P.work[i];
		const frozen = (ph === "held" || ph === "stopped") && st.plate && st.el < work;
		if (ph !== "work" && !frozen) return { k: 0, dip: 0, busy: false, holding: false };
		// The busiest robot's picks per plate, as the line model deals them (each robot keeps this pace).
		const trips = Math.max(1, o.rows[i].trips ?? 1);
		const period = Math.max(0.5, work / trips);
		const tt = st.el + phase * period;
		const u = (((tt / period) % 1) + 1) % 1;
		return { k: shuttle(tt, period, 0), dip: dip(tt, period, 0), busy: true, holding: u > 0.1 && u < 0.56 };
	}

	/** Draw with z measured from a raised base (robots stand on pedestals at belt height). */
	raised(r, dz, fn) {
		const L = this.L;
		r.setTransform(L.zoom, L.ox, L.oy - dz * ISO.Z * L.zoom);
		fn();
		r.setTransform(L.zoom, L.ox, L.oy);
	}

	drawStation(r, i, o, t) {
		const id = this.ids[i];
		const S = this.L.S[i];
		const row = o.rows[i];
		// A faster tool or a changed robot type shows in the safety-yellow accent.
		const colors = row.tool > 0 || row.changed ? { accent: HI } : undefined;
		const kind = kindOf(id, row);
		const n = robotsOf(row);
		if (kind === "six" || kind === "scara") {
			for (const b of this.robotBases(i, n)) {
				const ps = this.pose(i, o, b.phase);
				// Swing about the base (radius and angle blend), so the arm never folds over itself.
				const fr = [b.feed[0] - b.s, b.feed[1] - b.t];
				const tr = [S + (n > 1 ? Math.sign(b.s - S) * 0.12 : 0) - b.s, -b.t];
				const ra = Math.hypot(...fr) + (Math.hypot(...tr) - Math.hypot(...fr)) * ps.k;
				const a0 = Math.atan2(fr[1], fr[0]);
				const a1 = Math.atan2(tr[1], tr[0]);
				const an = a0 + (a1 - a0) * ps.k;
				const [x, y] = W2(b.s + Math.cos(an) * ra, b.t + Math.sin(an) * ra);
				const [bx, by] = W2(b.s, b.t);
				// Heights relative to the pedestal top: the tote is lower than the tray.
				const low = -0.12 + (0.22 - -0.12) * ps.k;
				const z = (ps.busy ? (1 - ps.dip) * 0.24 : 0.32) + low;
				this.raised(r, BZ, () => {
					if (kind === "six") {
						drawSixAxis(r, bx, by, [x, y, z], { scale: RS, tool: "fingers", grip: ps.holding ? 0.15 : 0.85, colors });
						if (ps.holding && id === "grapes") drawHangingBunch(r, x, y, z + 0.02, 0, 0.75);
						else if (ps.holding) this.drawHeld(r, id, x, y, z - 0.06);
					} else {
						const [wx, wy] = drawScaraCup(r, bx, by, [x, y], z, RS, colors);
						if (ps.holding) this.drawHeld(r, id, wx, wy, z - 0.09);
					}
				});
			}
			return;
		}
		if (kind === "delta") {
			const half = deltaHalf(n);
			const top = 1.82;
			r.line(W(S - half, -1.02, top), W(S + half, -1.02, top), PAL.steel, 3);
			for (const [k, ds] of deltaSpots(S, n).entries()) {
				const ps = this.pose(i, o, n === 1 ? 0.5 : (n - 1 - k) / n);
				const pz = 0.72 + (ps.busy ? (1 - ps.dip) * 0.22 : 0.3) + 0.18 * ps.k;
				const pt = -0.7 + 0.7 * ps.k;
				// Several deltas each reach in toward the tray at the station's center.
				const plat = W(ds - (ds - S) * 0.66 * ps.k, pt, pz);
				const [cx, cy] = W2(ds, -0.36);
				drawDelta(r, cx, cy, top, plat, { scale: RS, grip: ps.holding ? 0.2 : 0.8, colors });
				if (ps.holding) this.drawHeld(r, id, plat[0], plat[1], plat[2] - 0.14 * RS - 0.03);
			}
			r.line(W(S - half, 0.5, top), W(S + half, 0.5, top), PAL.steel, 3);
			r.line(W(S - half, -1.02, top), W(S - half, 0.5, top), PAL.steel, 3);
			r.line(W(S + half, -1.02, top), W(S + half, 0.5, top), PAL.steel, 3);
			return;
		}
		const ph = o.sim.phase(i, o.P);
		const busy = ph === "work";
		const u = busy ? Math.min(1, o.sim.st[i].el / Math.max(0.1, o.P.work[i])) : 0;
		if (id === "denester") {
			obox(r, S, -0.2, 1.0, 0.5, 0.75, 0.1, "#2f6fb3");
			const [x, y] = W2(S, 0);
			drawTrayStack(r, x, y, 1.1, A, 9, { scale: PS });
			for (const [ds, dt] of [
				[-0.28, -0.2],
				[0.28, -0.2],
			])
				obox(r, S + ds, dt, 1.1, 0.04, 0.04, 0.4, PAL.metal);
		} else if (id === "inspection") {
			obox(r, S, 0, 1.12, 0.62, 1.0, 0.12, "#2f6fb3");
			obox(r, S, -0.05, 1.24, 0.22, 0.22, 0.16, PAL.dark);
			const [x, y] = W2(S, 0.06);
			r.cylinder(x, y, 1.26, 0.05, 0.08, "#111418", 8);
			const glow = busy && !o.reduced ? 0.25 + 0.2 * Math.sin(t * 6) : 0.18;
			const g = (ds, dt, z) => W(S + ds, dt, z);
			r.quad([g(-0.22, -0.3, 1.11), g(0.22, -0.3, 1.11), g(0.22, 0.3, BZ + 0.02), g(-0.22, 0.3, BZ + 0.02)], "#fff6c4", { alpha: glow, flat: true });
		} else if (id === "lidding") {
			const press = busy ? Math.sin(u * Math.PI) : 0;
			obox(r, S, -0.3, 1.25, 0.56, 0.6, 0.12, PAL.steel);
			obox(r, S, -0.02, 1.25 - 0.3 - press * 0.22, 0.5, 0.42, 0.3, row.tool > 0 ? HI : "#4b5d73", { top: row.tool > 0 ? shade(HI, 1.1) : "#5b6f86" });
			obox(r, S, -0.02, 1.25 - press * 0.22, 0.08, 0.08, 0.02 + press * 0.22, PAL.metal);
		} else if (id === "outfeed") {
			this.drawGantry(r, S, row.tool > 0);
		}
	}

	/** Belt-aligned gantry over the outfeed: rails across the belt, a bridge, a carriage, a cup plate. */
	drawGantry(r, S, upgraded) {
		const H = GANTRY_H;
		const g = this.gpos ?? [S, 0, BZ + 0.6];
		const sA = S + GANTRY_S[0];
		const sB = S + GANTRY_S[1];
		for (const ps of [sA, sB]) obox(r, ps, -0.55, H, 0.09, 2.1, 0.09, PAL.metal);
		obox(r, (sA + sB) / 2, g[1], H + 0.09, sB - sA + 0.1, 0.12, 0.08, PAL.cone);
		obox(r, g[0], g[1], H - 0.06, 0.22, 0.26, 0.2, upgraded ? HI : ROBOT_COLORS.accent);
		obox(r, g[0], g[1], g[2] + 0.04, 0.05, 0.05, H - 0.06 - g[2] - 0.04, PAL.steel);
		obox(r, g[0], g[1], g[2], 0.36, 0.26, 0.04, ROBOT_COLORS.joint);
		for (const [ds, dt] of [
			[-0.12, -0.08],
			[0.12, -0.08],
			[-0.12, 0.08],
			[0.12, 0.08],
		]) {
			const [x, y] = W2(g[0] + ds, g[1] + dt);
			r.cylinder(x, y, g[2] - 0.03, 0.03, 0.03, ROBOT_COLORS.rubber, 6);
		}
	}

	drawFront(r, i, o, t) {
		const id = this.ids[i];
		const S = this.L.S[i];
		const row = o.rows[i];
		const zoom = this.L.zoom;
		if (id === "inspection") {
			obox(r, S - 0.28, 0.42, 0, 0.06, 0.06, 1.12, "#d7dce2");
			obox(r, S + 0.28, 0.42, 0, 0.06, 0.06, 1.12, "#d7dce2");
		}
		if (id === "outfeed") for (const ps of GANTRY_S) obox(r, S + ps, 0.45, 0, 0.08, 0.08, GANTRY_H, PAL.metal);
		if (kindOf(id, row) === "delta") {
			const half = deltaHalf(robotsOf(row));
			for (const ps of [S - half, S + half]) obox(r, ps, 0.5, 0, 0.07, 0.07, 1.82, PAL.steel);
		}
		// Stack light: green working or indexing, amber waiting, red stopped.
		const ph = o.sim.phase(i, o.P);
		const lamp = ph === "stopped" ? "#e5483b" : ph === "work" || ph === "index" ? "#43c46b" : "#f2b33a";
		obox(r, S + 0.42 * this.L.Wm, 0.78, 0, 0.04, 0.04, 0.52, PAL.dark);
		const [lx, ly] = W2(S + 0.42 * this.L.Wm, 0.78);
		r.cylinder(lx, ly, 0.52, 0.06, 0.12, lamp, 8);

		// Stop and bottleneck markers above the station.
		const bob = o.reduced ? 0 : Math.sin(t * 3 + i) * 2;
		const k = Math.max(0.7, Math.min(1.25, zoom * 1.05));
		if (ph === "stopped") {
			r.billboard(...W(S, -0.3, 2.0), (c) => {
				c.translate(0, bob);
				c.beginPath();
				for (let j = 0; j < 8; j++) {
					const a = Math.PI / 8 + (j * Math.PI) / 4;
					c.lineTo(Math.cos(a) * 9 * k, Math.sin(a) * 9 * k - 10 * k);
				}
				c.closePath();
				c.fillStyle = "#d63b2f";
				c.fill();
				c.fillStyle = "#ffffff";
				c.fillRect(-5 * k, -11.5 * k, 10 * k, 3 * k);
			});
		} else if (row.bottleneck) {
			r.billboard(...W(S, -0.3, 2.0), (c) => {
				c.translate(0, bob);
				c.beginPath();
				c.moveTo(0, 0);
				c.lineTo(-7 * k, -9 * k);
				c.arc(0, -13 * k, 9 * k, Math.PI * 0.8, Math.PI * 0.2);
				c.closePath();
				c.fillStyle = row.over ? PAL.ride.ride1 : "#e0a127";
				c.fill();
				c.lineWidth = 1.5;
				c.strokeStyle = "#ffffff";
				c.stroke();
				c.fillStyle = "#ffffff";
				c.fillRect(-1.4 * k, -19 * k, 2.8 * k, 7 * k);
				c.fillRect(-1.4 * k, -10.5 * k, 2.8 * k, 2.6 * k);
			});
		}
	}
}
