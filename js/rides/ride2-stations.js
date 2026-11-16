// Ride 2 set pieces: the neural-network pavilion on the learned branch and the giant cut-open
// joint. Drawing code only.

import { mix, shade, VIEW } from "../engine/iso.js";
import { groundPoly, object, PAL } from "../engine/park.js";

// ---------------------------------------------------------------------------
// Policy pavilion: four arches (network layers) the learned track runs through. The track runs
// along (-1, -1), which is straight up the screen, so each arch faces the viewer squarely.

const L = [Math.SQRT1_2, -Math.SQRT1_2]; // lateral unit (screen right)
const D = [-Math.SQRT1_2, -Math.SQRT1_2]; // along the track, toward the exit
const PAVILION = {
	arches: [0, 1, 2, 3].map((k) => [64.6 - 2 * k, 20.6 - 2 * k]),
	half: 1.8,
	top: 3.4,
	nodes: [5, 6, 6, 4],
};

/** Node positions of arch k: evenly spaced along its inverted-U outline. */
function archNodes(k) {
	const [cx, cy] = PAVILION.arches[k];
	const { half, top } = PAVILION;
	const n = PAVILION.nodes[k];
	const z0 = 0.9;
	const legH = top - z0;
	const total = legH * 2 + half * 2;
	const out = [];
	for (let i = 0; i < n; i++) {
		let s = (i / (n - 1)) * total;
		let lat;
		let z;
		if (s <= legH) {
			lat = -half;
			z = z0 + s;
		} else if ((s -= legH) <= half * 2) {
			lat = -half + s;
			z = top;
		} else {
			s -= half * 2;
			lat = half;
			z = top - s;
		}
		out.push([cx + L[0] * lat, cy + L[1] * lat, z]);
	}
	return out;
}

export function buildPavilion(scene, ctx, { on }) {
	const g = ctx.group;
	const A = PAVILION.arches;
	const { half, top } = PAVILION;
	const frame = on ? "#5f3790" : "#8a8590";
	const nodeBase = on ? "#b46be0" : "#a29daa";
	const edgeCol = on ? "rgba(178,98,240,0.6)" : "rgba(120,116,130,0.25)";
	// Floor plate under the arches.
	const s0 = [A[0][0] + 1.6 * -D[0], A[0][1] + 1.6 * -D[1]];
	const s1 = [A[3][0] + 0.9 * D[0], A[3][1] + 0.9 * D[1]];
	const w = half + 0.35;
	groundPoly(
		scene,
		[
			[s0[0] + L[0] * w, s0[1] + L[1] * w],
			[s1[0] + L[0] * w, s1[1] + L[1] * w],
			[s1[0] - L[0] * w, s1[1] - L[1] * w],
			[s0[0] - L[0] * w, s0[1] - L[1] * w],
		],
		on ? "#d9c3ec" : "#d3d0d6",
		{ group: g, depth: -58, z: 0.02 },
	);
	const nodes = A.map((_, k) => archNodes(k));
	const T = (t) => (ctx.reducedMotion() ? null : t);
	for (let k = 0; k < A.length; k++) {
		const [cx, cy] = A[k];
		const pl = [cx - L[0] * half, cy - L[1] * half];
		const pr = [cx + L[0] * half, cy + L[1] * half];
		scene.add({
			group: g,
			live: true,
			bounds: [Math.min(pl[0], pr[0]) - 0.3, Math.min(pl[1], pr[1]) - 0.3, 0, Math.max(pl[0], pr[0]) + 0.3 + 2, Math.max(pl[1], pr[1]) + 0.3 + 2, top + 1.4],
			depth: cx + cy + 0.05,
			draw: (r, t0) => {
				const t = T(t0);
				const wave = t === null ? null : ((t * 0.55) % 1) * 5 - 0.5;
				const bright = (layer) => (wave === null ? 0.45 : Math.max(0, 1 - Math.abs(wave - layer) * 1.3));
				// Edges toward the arch in front (k - 1), and the frame rails joining the two.
				if (k > 0) {
					const [fx, fy] = A[k - 1];
					for (const s of [-1, 1]) r.line([cx + L[0] * half * s, cy + L[1] * half * s, top + 0.12], [fx + L[0] * half * s, fy + L[1] * half * s, top + 0.12], frame, 2.2);
					const lit = on && wave !== null && wave > k - 1 && wave < k;
					for (const a of nodes[k - 1])
						for (const b of nodes[k]) r.line(a, b, lit ? "rgba(246,200,255,0.85)" : edgeCol, lit ? 1.4 : 0.95);
					if (lit) {
						const f = wave - (k - 1);
						nodes[k - 1].forEach((a, i) => {
							const b = nodes[k][(i * 2 + 1) % nodes[k].length];
							r.sphere(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, 0.07, "#fff0ff", 0);
						});
					}
				}
				// Posts and lintel.
				for (const p of [pl, pr]) {
					r.box(p[0] - 0.14, p[1] - 0.14, 0, 0.28, 0.28, 0.12, PAL.dark);
					r.box(p[0] - 0.11, p[1] - 0.11, 0.12, 0.22, 0.22, top, frame, { top: shade(frame, 1.2) });
				}
				r.beam([pl[0], pl[1], top + 0.12], [pr[0], pr[1], top + 0.12], 0.24, 0.24, frame);
				// Nodes.
				const b = on ? bright(k) : 0;
				for (const n of nodes[k]) {
					if (on) r.sphere(n[0], n[1], n[2], 0.36 + 0.08 * b, "#e7b3ff", 0, { alpha: 0.18 + 0.3 * b });
					r.sphere(n[0], n[1], n[2], 0.26, on ? mix(nodeBase, "#fff0ff", b) : nodeBase, 0);
				}
				// Facade sign on the entrance arch: a small network glyph.
				if (k === 0) drawSign(r, cx, cy, top, on);
			},
		});
	}
	// The arches are live static items; this keeps the frame loop running while the active
	// pavilion is on screen so its activation wave plays.
	if (on)
		scene.addDynamic({
			group: g,
			depth: -1e6,
			bounds: [A[3][0] - 2, A[3][1] - 2, 0, A[0][0] + 2, A[0][1] + 2, top + 1.4],
			animated: () => true,
			draw: () => {},
		});
	const [ax, ay] = A[0];
	ctx.stopTarget("policy", [ax - 2, ay - 2, 0, ax + 2.6, ay + 2.6, top + 1.2], [ax, ay, top + 1.65]);
}

function drawSign(r, cx, cy, top, on) {
	const z0 = top + 0.32;
	const z1 = top + 1.12;
	const hw = 1.05;
	const p = (lat, z) => [cx + L[0] * lat + 0.02, cy + L[1] * lat + 0.02, z];
	r.box(cx - 0.06, cy - 0.06, top + 0.2, 0.12, 0.12, 0.14, PAL.dark);
	r.quad([p(-hw, z0), p(hw, z0), p(hw, z1), p(-hw, z1)], on ? "#7b3fb0" : "#8f8a96", { flat: true });
	const cols = [
		[-0.65, [0.35, 0.65]],
		[0, [0.2, 0.5, 0.8]],
		[0.65, [0.35, 0.65]],
	];
	const pts = cols.map(([lat, vs]) => vs.map((v) => p(lat, z0 + (z1 - z0) * v)));
	for (let c = 0; c < 2; c++) for (const a of pts[c]) for (const b of pts[c + 1]) r.line(a, b, on ? "rgba(255,230,255,0.85)" : "rgba(235,235,240,0.7)", 0.9);
	for (const col of pts) for (const q of col) r.sphere(q[0], q[1], q[2], 0.07, on ? "#ffffff" : "#e4e2e8", 0);
}

// ---------------------------------------------------------------------------
// Giant joint, cut open along its axis so the cart rides past the inside. The axis runs along y;
// the half facing +x (toward the track) is removed, so the section faces the rider.

const JOINT = { cx: 42.6, cz: 2.05, R: 1.75, y0: 14.6, y1: 20.6 };

/** Parts along the axis, from the brake end to the output flange. */
const PARTS = [
	{ id: "brake", ya: 14.75, yb: 15.5, ri: 0.34, ro: 1.45, color: "#6b7480" },
	{ id: "encoder", ya: 15.62, yb: 15.8, ri: 0.32, ro: 1.25, color: "#8fc9df" },
	{ id: "stator", ya: 15.95, yb: 18.2, ri: 1.02, ro: 1.6, color: "#56606d" },
	{ id: "rotor", ya: 16.05, yb: 18.1, ri: 0.3, ro: 0.92, color: "#8e98a4" },
	{ id: "circular", ya: 18.38, yb: 19.75, ri: 1.14, ro: 1.56, color: "#7a8594" },
	{ id: "flex", ya: 18.42, yb: 19.75, ri: 0.9, ro: 1.12, color: "#c3cad2" },
	{ id: "wave", ya: 18.5, yb: 19.6, ri: 0.3, ro: 0.88, color: "#d9a441" },
	{ id: "torque", ya: 19.86, yb: 20.1, ri: 0.45, ro: 1.38, color: "#3d9970" },
	{ id: "flange", ya: 20.2, yb: 20.62, ri: 0, ro: 1.32, color: "#c9d0d8" },
];

const ang = (a, r) => [JOINT.cx + Math.cos(a) * r, JOINT.cz + Math.sin(a) * r];

/** Half annulus (x <= cx) in the plane y, radii ri..ro. */
function halfRing(y, ri, ro, seg = 12) {
	const pts = [];
	for (let i = 0; i <= seg; i++) {
		const a = Math.PI / 2 + (i / seg) * Math.PI;
		const [x, z] = ang(a, ro);
		pts.push([x, y, z]);
	}
	if (ri > 0)
		for (let i = seg; i >= 0; i--) {
			const a = Math.PI / 2 + (i / seg) * Math.PI;
			const [x, z] = ang(a, ri);
			pts.push([x, y, z]);
		}
	return pts;
}

/** Visible outer strips of a half cylinder of radius ro between ya and yb. */
function topStrips(r, ya, yb, ro, color, seg = 12) {
	for (let i = 0; i < seg; i++) {
		const a0 = Math.PI / 2 + (i / seg) * Math.PI;
		const a1 = Math.PI / 2 + ((i + 1) / seg) * Math.PI;
		const am = (a0 + a1) / 2;
		const facing = Math.cos(am) * VIEW[0] + Math.sin(am) * VIEW[2];
		if (facing <= 0) continue;
		const [x0, z0] = ang(a0, ro);
		const [x1, z1] = ang(a1, ro);
		r.quad(
			[
				[x0, ya, z0],
				[x1, ya, z1],
				[x1, yb, z1],
				[x0, yb, z0],
			],
			color,
		);
	}
}

/** The section face (plane x = cx) of a ring: a top band and a bottom band. */
function cutBands(r, ya, yb, ri, ro, color) {
	const { cx, cz } = JOINT;
	const x = cx + 0.003;
	for (const s of [1, -1]) {
		const za = cz + s * ri;
		const zb = cz + s * ro;
		r.quad(
			[
				[x, ya, za],
				[x, yb, za],
				[x, yb, zb],
				[x, ya, zb],
			],
			color,
		);
	}
}

/** A flat rectangle on the section face at radius ra..rb (both halves when mirror). */
function cutRect(r, ya, yb, ra, rb, color, mirror = true, dx = 0.006) {
	const { cx, cz } = JOINT;
	const x = cx + dx;
	for (const s of mirror ? [1, -1] : [1]) {
		r.quad(
			[
				[x, ya, cz + s * ra],
				[x, yb, cz + s * ra],
				[x, yb, cz + s * rb],
				[x, ya, cz + s * rb],
			],
			color,
			{ flat: true },
		);
	}
}

function drawPart(r, p) {
	topStrips(r, p.ya, p.yb, p.ro, p.color);
	r.quad(halfRing(p.yb, p.ri, p.ro), shade(p.color, 1.04));
	cutBands(r, p.ya, p.yb, p.ri, p.ro, shade(p.color, 1.1));
}

function drawJointStatic(r) {
	const { cx, cz, R, y0, y1 } = JOINT;
	// Plinth.
	r.box(cx - 2.15, y0 - 0.45, 0, 3.85, y1 - y0 + 0.85, 0.3, "#b9b2a5", { top: "#cbc4b7" });
	r.box(cx - 2.15, y1 + 0.39, 0.3, 3.85, 0.01, 0.01, PAL.safety);
	// Back end wall, seen from inside.
	r.quad(halfRing(y0, 0, R - 0.1), "#4a525d", { flat: true });
	// Housing shell: the half cylinder behind the cut. Faces turned away show the inner surface.
	const seg = 14;
	const faces = [];
	const colors = [];
	for (let i = 0; i < seg; i++) {
		const a0 = Math.PI / 2 + (i / seg) * Math.PI;
		const a1 = Math.PI / 2 + ((i + 1) / seg) * Math.PI;
		const am = (a0 + a1) / 2;
		const [xa, za] = ang(a0, R);
		const [xb, zb] = ang(a1, R);
		faces.push([
			[xa, y0, za],
			[xb, y0, zb],
			[xb, y1, zb],
			[xa, y1, za],
		]);
		const facing = Math.cos(am) * VIEW[0] + Math.sin(am) * VIEW[2];
		colors.push(facing > 0 ? "#eef0f2" : "#3e4650");
	}
	r.mesh(faces, "#eef0f2", { twoSided: true, colors });
	// Shaft along the axis.
	cutRect(r, y0 + 0.1, 20.2, 0, 0.27, "#b8c0ca", true, 0.002);
	r.quad(
		[
			[cx + 0.002, y0 + 0.1, cz - 0.27],
			[cx + 0.002, 20.2, cz - 0.27],
			[cx + 0.002, 20.2, cz + 0.27],
			[cx + 0.002, y0 + 0.1, cz + 0.27],
		],
		"#c6cdd4",
		{ flat: true },
	);
	for (const p of PARTS) {
		drawPart(r, p);
		if (p.id === "brake") {
			cutRect(r, p.ya + 0.08, p.ya + 0.5, 0.75, 1.2, "#c87533");
			cutRect(r, p.yb - 0.14, p.yb - 0.06, 0.36, 1.32, "#c9b28a");
		} else if (p.id === "encoder") {
			// Read head at the top of the disk.
			r.box(cx - 0.25, p.ya - 0.1, cz + p.ro + 0.02, 0.25, 0.4, 0.2, "#2b2f36");
		} else if (p.id === "stator") {
			for (let i = 0; i < 6; i++) {
				const ya = p.ya + 0.12 + i * 0.35;
				cutRect(r, ya, ya + 0.26, 1.08, 1.5, "#c87533");
			}
		} else if (p.id === "circular") {
			// Internal teeth meshing with the flexspline, as a zigzag on the section.
			for (const s of [1, -1]) {
				const pts = [];
				for (let i = 0; i <= 14; i++) {
					const y = p.ya + (i / 14) * (p.yb - p.ya);
					pts.push([cx + 0.008, y, cz + s * (i % 2 ? 1.08 : 1.18)]);
				}
				r.polyline(pts, "#2b2f36", 1.4);
			}
		} else if (p.id === "torque") {
			for (const rr of [0.7, 1.05]) cutRect(r, p.ya + 0.05, p.yb - 0.05, rr, rr + 0.12, "#f2c230", true, 0.008);
		}
	}
	// Cut edges of the shell, highlighted like a cutaway drawing.
	cutRect(r, y0, y1, R - 0.12, R, "#e8792f", true, 0.004);
	r.quad(halfRing(y1, R - 0.12, R), "#e8792f", { flat: true });
}

/** Moving parts: magnets flip as the rotor turns, encoder slits scroll, flange bolts turn. */
function drawJointLive(r, t) {
	const { cx, cz } = JOINT;
	const rotor = PARTS.find((p) => p.id === "rotor");
	const stator = PARTS.find((p) => p.id === "stator");
	const enc = PARTS.find((p) => p.id === "encoder");
	const flange = PARTS.find((p) => p.id === "flange");
	const flip = Math.floor(t * 2.5) % 2 === 0;
	cutRect(r, rotor.ya + 0.05, rotor.yb - 0.05, 0.72, 0.9, flip ? "#d9483b" : "#3d7fd1", false, 0.009);
	r.quad(
		[
			[cx + 0.009, rotor.ya + 0.05, cz - 0.72],
			[cx + 0.009, rotor.yb - 0.05, cz - 0.72],
			[cx + 0.009, rotor.yb - 0.05, cz - 0.9],
			[cx + 0.009, rotor.ya + 0.05, cz - 0.9],
		],
		flip ? "#3d7fd1" : "#d9483b",
		{ flat: true },
	);
	// Windings glow with the current.
	const glow = 0.25 + 0.25 * (Math.sin(t * 9) + 1);
	for (let i = 0; i < 6; i++) {
		const ya = stator.ya + 0.12 + i * 0.35;
		for (const s of [1, -1])
			r.quad(
				[
					[cx + 0.01, ya, cz + s * 1.08],
					[cx + 0.01, ya + 0.26, cz + s * 1.08],
					[cx + 0.01, ya + 0.26, cz + s * 1.5],
					[cx + 0.01, ya, cz + s * 1.5],
				],
				"#ffb56b",
				{ flat: true, alpha: glow * 0.6 },
			);
	}
	// Encoder disk slits scroll past the read head.
	const n = 7;
	const off = (t * 1.6) % 1;
	for (let i = 0; i < n; i++) {
		const f = (i + off) / n;
		const zz = cz + 0.35 + f * (enc.ro - 0.35);
		r.line([cx + 0.012, enc.ya + 0.02, zz], [cx + 0.012, enc.yb - 0.02, zz], "#1d2a33", 1.6);
		r.line([cx + 0.012, enc.ya + 0.02, 2 * cz - zz], [cx + 0.012, enc.yb - 0.02, 2 * cz - zz], "#1d2a33", 1.6);
	}
	r.sphere(cx - 0.12, enc.ya + 0.32, cz + enc.ro + 0.22, 0.05, Math.sin(t * 20) > 0 ? "#ff5a4f" : "#5b2a2a", 0);
	// Flange bolts and a rotation arrow on the output face.
	const y = flange.yb + 0.01;
	for (let i = 0; i < 8; i++) {
		const a = (i / 8) * Math.PI * 2 + t * 0.9;
		const x = cx + Math.cos(a) * 0.95;
		if (x > cx - 0.05) continue;
		r.sphere(x, y, cz + Math.sin(a) * 0.95, 0.08, "#3b4552", 0);
	}
	const arc = [];
	for (let i = 0; i <= 10; i++) {
		const a = Math.PI * 0.62 + (i / 10) * Math.PI * 0.8;
		arc.push([cx + Math.cos(a) * 1.55, y + 0.05, cz + Math.sin(a) * 1.55]);
	}
	r.polyline(arc, "#e8792f", 3);
	const e = arc[arc.length - 1];
	const pr = arc[arc.length - 2];
	r.polyline(
		[
			[e[0] + (pr[0] - e[0]) * 2 + 0.18, e[1], e[2] + (pr[2] - e[2]) * 2],
			e,
			[e[0] + (pr[0] - e[0]) * 2 - 0.18, e[1], e[2] + (pr[2] - e[2]) * 2 - 0.1],
		],
		"#e8792f",
		3,
	);
}

export function buildJointSculpture(scene, ctx) {
	const g = ctx.group;
	const { cx, R, y0, y1 } = JOINT;
	object(scene, cx - 2.2, y0 - 0.5, cx + 1.75, y1 + 0.45, JOINT.cz + R + 0.3, drawJointStatic, { group: g });
	const T = (t) => (ctx.reducedMotion() ? 0.3 : t);
	scene.addDynamic({
		group: g,
		depth: cx + y1 + 0.6,
		bounds: [cx - 2, y0, 0, cx + 0.2, y1 + 0.3, JOINT.cz + R + 0.3],
		animated: () => true,
		draw: (r, t) => drawJointLive(r, T(t)),
	});
	ctx.stopTarget("joint", [cx - 2.2, y0 - 0.4, 0, cx + 1.7, y1 + 0.4, JOINT.cz + R], [cx, (y0 + y1) / 2, JOINT.cz + R + 0.75]);
}
