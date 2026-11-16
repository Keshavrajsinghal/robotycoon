// Drawing for workbench wb2-ik: the grape pick station seen from the side, inside the iso engine.
// The arm's vertical plane runs along the screen's x axis (world direction (1, -1, 0) / sqrt 2),
// so the iso view shows it without skew. Model positions are millimeters in that plane: a forward
// from the shoulder axis, v toward the viewer, z up from the shoulder axis. Drawing code only.
//
// Layout (drawing choices, not data): the tray belt and the tote infeed belt both run along world
// y, crossing the arm plane at tray_x_mm and at the middle of the tote. The tote is a world-aligned
// box whose walls the plane meets at tote.near_x_mm and tote.far_x_mm.

import { drawGrapes, drawPlate } from "../engine/food.js";
import { depthOf, ISO, mix } from "../engine/iso.js";
import { PAL } from "../engine/park.js";
import { ROBOT_COLORS } from "../engine/robots.js";

const SQ = Math.SQRT1_2;
/** Screen px per meter along the arm plane at zoom 1. */
export const PLANE_PX = ISO.X * Math.SQRT2;
/** Heights are stretched so a meter up is as long on screen as a meter across (a true side view). */
export const Z_STRETCH = PLANE_PX / ISO.Z;

export const COL = {
	body: "#f2f2ee",
	accent: PAL.ride.ride2,
	joint: ROBOT_COLORS.joint,
	metal: ROBOT_COLORS.metal,
	finger: ROBOT_COLORS.orange,
	bad: "#e0503f",
	frame: PAL.steel,
	belt: "#3a3f47",
	leg: "#5d6672",
	tote: "#3f82c8",
	toteIn: "#2f6fb3",
};

const TRAY_SCALE = 0.42;
const TRAY_PITCH = 0.36; // m between trays on the belt
const TOTE_WALL = 0.012; // m
const TOTE_HALF_LEN = 0.24; // m along the belt
const BUNCH_SCALE = 0.62;
// How each bunch lies in the tote, turned about vertical (radians in the world x-y plane): bunches
// lie at random angles, mostly across the arm plane (world angle pi/4 points toward the viewer) so
// neighbors do not hide each other. Index i uses BUNCH_TURN[i % length].
const Q = Math.PI / 4;
const BUNCH_TURN = [Q + 0.45, Q + Math.PI - 0.35, Q + 0.15, Q - 0.5, Q + Math.PI + 0.3, Q + 0.6];

/** Maps between model millimeters, world meters, and canvas px for one view. */
export function planeMap(S, ox, oy) {
	const K = Z_STRETCH / 1000;
	return {
		S,
		K,
		zoom: (S * 1000) / PLANE_PX,
		/** model (a, v, z) mm -> world [x, y, z] */
		W: (a, v, z) => [((a + v) * SQ) / 1000, ((v - a) * SQ) / 1000, z * K],
		/** model [a, z] mm in the plane -> canvas px */
		P: (p) => [ox + S * p[0], oy - S * p[1]],
	};
}

/** World-space layout of the cell for model m. */
export function cellLayout(m) {
	const surfZ = -m.sh; // mm
	const toteMid = (m.tote.near + m.tote.far) / 2;
	const hxIn = ((m.tote.far - m.tote.near) / 2) * (SQ / 1000);
	const tray = { x: (m.trayX * SQ) / 1000, half: 0.095 };
	tray.y = -tray.x;
	const tote = { x: (toteMid * SQ) / 1000, hxIn, hxOut: hxIn + TOTE_WALL, hy: TOTE_HALF_LEN };
	tote.y = -tote.x;
	tote.belt = tote.hxOut + 0.03;
	return { surfZ, tray, tote };
}

function belt(r, map, L, xc, half, y0, y1) {
	const z = L.surfZ * map.K;
	const x0 = xc - half;
	const w = half * 2;
	for (let yy = y0 + 0.12; yy < y1 - 0.05; yy += 0.9) {
		r.box(x0 + 0.02, yy, z - 3, 0.05, 0.05, 3 - 0.12, COL.leg);
	}
	r.box(x0, y0, z - 0.12, w, y1 - y0, 0.11, COL.frame);
	r.ground(x0 + 0.018, y0, w - 0.036, y1 - y0, COL.belt, z - 0.008);
	for (let yy = y0 + 0.12; yy < y1 - 0.05; yy += 0.9) {
		r.box(x0 + w - 0.07, yy, z - 3, 0.05, 0.05, 3 - 0.12, COL.leg);
	}
}

const trayAt = (r, map, L, y, contents) =>
	drawPlate(r, L.tray.x, y, L.surfZ * map.K + 0.002, Math.PI / 2, contents, { scale: TRAY_SCALE, lineScale: 0.18 });

/** Behind the arm: both belts, the trays waiting upstream, the pedestal, the tray at the arm, the
 * tote's floor and back walls, and the bunches. */
export function drawCellBack(r, map, L, m, bunches) {
	const { tray, tote } = L;
	const zS = L.surfZ * map.K;
	// Upstream halves of both belts (behind the pedestal), then the trays waiting there.
	belt(r, map, L, tote.x, tote.belt, tote.y - 1.8, tote.y);
	belt(r, map, L, tray.x, tray.half, tray.y - 1.8, tray.y);
	for (let k = 4; k >= 1; k--) trayAt(r, map, L, tray.y - k * TRAY_PITCH, {});
	// The robot's pedestal, from the floor below the picture up to the turret.
	{
		const [bx, by] = map.W(0, 0, 0);
		const zBase = -0.2 * m.sh * map.K;
		r.cylinder(bx, by, zS - 3, 0.075, zBase - zS + 3, COL.body, 12);
		r.cylinder(bx, by, zBase, 0.095, 0.035 * Z_STRETCH, COL.accent, 12);
	}
	// Downstream halves of the belts (low, so the arm always draws over them).
	belt(r, map, L, tray.x, tray.half, tray.y, tray.y + 1.6);
	belt(r, map, L, tote.x, tote.belt, tote.y, tote.y + 1.6);
	trayAt(r, map, L, tray.y, {});
	// The tote: floor, then the two walls facing away from the viewer (the near wall in the arm
	// plane, and the upstream end).
	const x0 = tote.x - tote.hxOut;
	const y0 = tote.y - tote.hy - TOTE_WALL;
	const wx = tote.hxOut * 2;
	const wy = (tote.hy + TOTE_WALL) * 2;
	const hWall = m.tote.wall * map.K;
	r.box(x0, y0, zS, wx, wy, 0.006, COL.toteIn, { top: mix(COL.toteIn, "#ffffff", 0.12) });
	r.box(x0, y0, zS, wx, TOTE_WALL, hWall, COL.tote);
	r.box(x0, y0, zS, TOTE_WALL, wy, hWall, COL.tote);
	// Bunches lying at random angles; each grasp point is on top of its bunch.
	bunches.forEach((b, i) => {
		const turn = BUNCH_TURN[i % BUNCH_TURN.length];
		const [cx, cy] = map.W(b.x, 0, 0);
		const ch = Math.cos(turn);
		const sh = Math.sin(turn);
		const sc = BUNCH_SCALE;
		const zf = zS + 0.006;
		// drawGrapes' berries span f = -0.11..0.11 with the stem behind them; shift so the berries
		// sit around the grasp point.
		drawGrapes(r, (f, sd, zz = 0) => [cx + ((f + 0.02) * ch - sd * sh) * sc, cy + ((f + 0.02) * sh + sd * ch) * sc, zf + zz * sc * Z_STRETCH], sc, 0.3);
	});
}

/** In front of the arm: the tote's two near walls (see-through) and the filled trays downstream. */
export function drawCellFront(r, map, L, m) {
	const { tray, tote } = L;
	const zS = L.surfZ * map.K;
	const x1 = tote.x + tote.hxIn;
	const y0 = tote.y - tote.hy - TOTE_WALL;
	const y1 = tote.y + tote.hy;
	const hWall = m.tote.wall * map.K;
	const opts = { alpha: 0.42 };
	r.box(x1, y0, zS, TOTE_WALL, y1 - y0 + TOTE_WALL, hWall, COL.tote, opts);
	r.box(tote.x - tote.hxOut, y1, zS, tote.hxOut * 2, TOTE_WALL, hWall, COL.tote, opts);
	for (let k = 1; k <= 4; k++) trayAt(r, map, L, tray.y + k * TRAY_PITCH, { grapes: true });
}

/** A link box between two plane points (centered on v = 0). */
function link(r, map, p1, p2, thick, depth, color) {
	const dx = p2[0] - p1[0];
	const dz = p2[1] - p1[1];
	const len = Math.hypot(dx, dz) || 1;
	const n = [(-dz / len) * (thick / 2), (dx / len) * (thick / 2)];
	const hd = depth / 2;
	const at = (p, sn, sv) => map.W(p[0] + n[0] * sn, sv * hd, p[1] + n[1] * sn);
	const A = [at(p1, -1, -1), at(p1, 1, -1), at(p1, 1, 1), at(p1, -1, 1)];
	const B = [at(p2, -1, -1), at(p2, 1, -1), at(p2, 1, 1), at(p2, -1, 1)];
	const faces = [[A[3], A[2], A[1], A[0]], B];
	for (let i = 0; i < 4; i++) faces.push([A[i], A[(i + 1) % 4], B[(i + 1) % 4], B[i]]);
	r.mesh(faces, color, { center: map.W((p1[0] + p2[0]) / 2, 0, (p1[1] + p2[1]) / 2) });
}

/** A joint disc whose axis points toward the viewer (perpendicular to the arm plane). */
function disc(r, map, p, rad, depth, color, seg = 14) {
	const ring = (sv) =>
		Array.from({ length: seg }, (_, i) => {
			const t = (i / seg) * Math.PI * 2 + Math.PI / seg;
			return map.W(p[0] + Math.cos(t) * rad, (sv * depth) / 2, p[1] + Math.sin(t) * rad);
		});
	const A = ring(-1);
	const B = ring(1);
	const faces = [[...A].reverse(), B];
	for (let i = 0; i < seg; i++) faces.push([A[i], A[(i + 1) % seg], B[(i + 1) % seg], B[i]]);
	r.mesh(faces, color, { center: map.W(p[0], 0, p[1]) });
}

/**
 * Soft finger gripper on the tool axis: quill and flange from the wrist, a hub, and three curved
 * silicone fingers whose tips meet at the tool tip. u = tool direction (wrist toward tips) in the
 * plane, grip 0 closed .. 1 open. Sizes scale with the tool length.
 */
function softFingers(r, map, w, u, tool, grip) {
	const n = [-u[1], u[0]];
	const tip = [w[0] + u[0] * tool, w[1] + u[1] * tool];
	const k = tool / 240; // mm per unit of drawSoftFingers' 1 m model (fingers half the tool)
	// A point h mm back from the tip along the axis, at radius rho and angle th around it.
	const at = (h, rho, th) => {
		const c = Math.cos(th) * rho;
		return map.W(tip[0] - u[0] * h + n[0] * c, Math.sin(th) * rho, tip[1] - u[1] * h + n[1] * c);
	};
	const mm = (v) => (v * k) / 1000; // tube radii are world meters
	const flangeH = tool * 0.5; // the flange sits halfway: wrist to flange, then the fingers
	const hubH = 120 * k;
	r.tube(at(tool, 0, 0), at(flangeH, 0, 0), mm(33), COL.metal, 8);
	r.tube(at(flangeH + 9 * k, 0, 0), at(flangeH - 9 * k, 0, 0), mm(54), COL.joint, 10);
	r.tube(at(flangeH, 0, 0), at(hubH + 50 * k, 0, 0), mm(30), COL.joint, 8);
	r.tube(at(hubH + 50 * k, 0, 0), at(hubH, 0, 0), mm(75), COL.joint, 10);
	const fingers = [0, 1, 2].map((i) => {
		const th = Math.PI / 6 + (i / 3) * Math.PI * 2;
		const root = at(hubH, 55 * k, th);
		const mid = at(60 * k, (75 + grip * 50) * k, th);
		const end = at(0, (12 + grip * 60) * k, th);
		return { root, mid, end, d: depthOf(mid[0], mid[1], mid[2]) };
	});
	fingers.sort((a, b) => a.d - b.d);
	for (const f of fingers) {
		r.tube(f.root, f.mid, mm(20), COL.finger, 6);
		r.tube(f.mid, f.end, mm(17), COL.finger, 6);
	}
}

/**
 * The arm in a pose: kin = fk() result (mm). okJ = per-joint within-limit flags, bad = tint the
 * body (pose outside a limit), R = upper arm plus forearm (part sizes scale with it).
 */
export function drawArm(r, map, m, kin, { okJ = [true, true, true], bad = false, grip = 1 } = {}) {
	const R = m.L1 + m.L2;
	const T = (f) => f * R;
	const body = bad ? mix(COL.body, COL.bad, 0.4) : COL.body;
	const jointCol = (i, base) => (okJ[i] ? base : COL.bad);
	link(r, map, [0, -0.2 * m.sh], [0, T(0.02)], T(0.17), T(0.11), body);
	link(r, map, kin.s, kin.e, T(0.115), T(0.085), body);
	disc(r, map, kin.s, T(0.085), T(0.11), jointCol(0, COL.accent));
	link(r, map, kin.e, kin.w, T(0.09), T(0.07), body);
	disc(r, map, kin.e, T(0.07), T(0.095), jointCol(1, COL.accent));
	softFingers(r, map, kin.w, kin.u, m.tool, grip);
	disc(r, map, kin.w, T(0.05), T(0.08), jointCol(2, COL.joint));
}
