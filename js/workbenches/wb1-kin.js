// Kinematics for the wb1-dof workbench: a six-axis arm with a spherical wrist holding an apple
// slice on a vacuum cup. Pure math, no DOM: forward kinematics, a numerical Jacobian, the
// "what can the free joints change here" analysis, and a damped least-squares solver used by
// the test hook. Lengths are meters, angles radians unless a name says _deg.
//
// Arm layout (cell frame: origin at the robot base center on its mounting plate, x toward the
// tray, y to the robot's left, z up):
//   J1 turns about the vertical axis at the base.
//   J2 and J3 tilt about horizontal axes (shoulder and elbow). At J2 = J3 = 0 the upper arm
//   points straight up and the forearm points straight forward.
//   J4 rolls about the forearm, J5 bends the wrist, J6 rolls about the tool. Their axes meet in
//   one point (the wrist center). At J4 = J5 = J6 = 0 the tool points along the forearm.
// The slice hangs on the cup: its face normal points back at the cup, and with J4 = J6 = 0 its
// curved edge points the same way as the tool's z axis (away from the robot when the tool points
// straight down).
//
// Level mode (the "kept level" presets) imitates a 4-axis delta with this arm: J4 is held at 0 and
// J5 at 90 deg - J2 - J3, so the cup always points straight down and the free joints give only
// x, y, z and a turn about vertical. levelLink() applies that coupling; the Jacobian, the analysis,
// and the solver take it as an optional `link` so they see J5 move with J2 and J3.

// ---------------------------------------------------------------------------
// Small vector and 3x3 matrix helpers (row-major arrays of 9).

export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = (a) => Math.hypot(a[0], a[1], a[2]);
export const normalize = (a) => scale(a, 1 / (len(a) || 1));

const mul = (A, B) => {
	const C = new Array(9);
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++) C[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j];
	return C;
};
const apply = (R, v) => [R[0] * v[0] + R[1] * v[1] + R[2] * v[2], R[3] * v[0] + R[4] * v[1] + R[5] * v[2], R[6] * v[0] + R[7] * v[1] + R[8] * v[2]];
const transpose = (R) => [R[0], R[3], R[6], R[1], R[4], R[7], R[2], R[5], R[8]];
const col = (R, j) => [R[j], R[3 + j], R[6 + j]];
const fromCols = (a, b, c) => [a[0], b[0], c[0], a[1], b[1], c[1], a[2], b[2], c[2]];
const rotX = (a) => {
	const c = Math.cos(a);
	const s = Math.sin(a);
	return [1, 0, 0, 0, c, -s, 0, s, c];
};
const rotY = (a) => {
	const c = Math.cos(a);
	const s = Math.sin(a);
	return [c, 0, s, 0, 1, 0, -s, 0, c];
};
const rotZ = (a) => {
	const c = Math.cos(a);
	const s = Math.sin(a);
	return [c, -s, 0, s, c, 0, 0, 0, 1];
};

/** Rotation vector (axis times angle) of R. */
function logRot(R) {
	const tr = R[0] + R[4] + R[8];
	const c = Math.max(-1, Math.min(1, (tr - 1) / 2));
	const ang = Math.acos(c);
	const v = [R[7] - R[5], R[2] - R[6], R[3] - R[1]];
	if (ang < 1e-6) return scale(v, 0.5);
	if (Math.PI - ang < 1e-4) {
		// Near a half turn: take the axis from the diagonal.
		const d = [R[0], R[4], R[8]];
		const k = d.indexOf(Math.max(...d));
		const axis = [0, 0, 0];
		axis[k] = Math.sqrt(Math.max(0, (d[k] + 1) / 2));
		for (let j = 0; j < 3; j++) if (j !== k) axis[j] = R[k * 3 + j] / (2 * axis[k] || 1);
		return scale(normalize(axis), ang);
	}
	return scale(v, ang / (2 * Math.sin(ang)));
}

/** Angle in radians of the rotation that takes A to B. */
export function rotAngle(A, B) {
	const M = mul(transpose(A), B);
	return Math.acos(Math.max(-1, Math.min(1, (M[0] + M[4] + M[8] - 1) / 2)));
}

// ---------------------------------------------------------------------------
// Model

const DEG = Math.PI / 180;
// Slice frame from the tool frame: u = -y_tool, v = z_tool, n = -x_tool (columns).
const TOOL_TO_SLICE = [0, 0, -1, -1, 0, 0, 0, 1, 0];

/**
 * Build the model from validated workbench data. Returns geometry, joint limits (radians), the
 * target pose, and tolerances.
 */
export function makeModel(data) {
	const L = data.links_m;
	const sr = data.slice.radius_m;
	const st = data.slice.thickness_m;
	const grip = (4 * sr) / (3 * Math.PI); // the cup holds the half-moon at its centroid
	const tray = data.tray;
	const t = data.target;
	const tilt = t.tilt_deg * DEG;
	const head = t.heading_deg * DEG;
	const dh = [Math.cos(head), Math.sin(head), 0]; // direction the slice leans toward
	const v = add(scale(dh, Math.cos(tilt)), [0, 0, Math.sin(tilt)]);
	const n = sub([0, 0, Math.cos(tilt)], scale(dh, Math.sin(tilt)));
	const u = cross(v, n);
	const edge = [tray.x_m + t.x_m, tray.y_m + t.y_m, tray.z_m + (st / 2) * Math.cos(tilt)];
	const R = fromCols(u, v, n);
	const origin = edge;
	const gripPoint = add(add(origin, scale(v, grip)), scale(n, st / 2));
	return {
		L,
		slice: { r: sr, t: st, grip },
		tray,
		grapesR: data.grapes.radius_m,
		joints: data.joints.map((j) => ({ label: j.label, min: j.min_deg * DEG, max: j.max_deg * DEG, start: j.start_deg * DEG })),
		target: { R, origin, grip: gripPoint, tilt, dh, edge },
		tol: { pos: data.tolerance.position_mm / 1000, ang: data.tolerance.angle_deg * DEG },
		// Length that makes meters and radians comparable in the rank test.
		Lc: (L.upper_arm + L.forearm) / 2,
	};
}

/**
 * Forward kinematics. q: six joint angles (radians). Returns joint frames for drawing and the
 * slice pose: { base, S, E, W, F, tip, frames: {R1..R6}, axes: [{o, a}] per joint,
 * slice: { R, origin, grip } }.
 */
export function fk(model, q) {
	const L = model.L;
	const R1 = rotZ(q[0]);
	const S = [0, 0, L.base];
	const R2 = mul(R1, rotY(q[1]));
	const E = add(S, apply(R2, [0, 0, L.upper_arm]));
	const R3 = mul(R2, rotY(q[2]));
	const W = add(E, apply(R3, [L.forearm, 0, 0]));
	const R4 = mul(R3, rotX(q[3]));
	const R5 = mul(R4, rotY(q[4]));
	const R6 = mul(R5, rotX(q[5]));
	const F = add(W, apply(R5, [L.wrist, 0, 0]));
	const tip = add(W, apply(R6, [L.wrist + L.tool, 0, 0]));
	const Rs = mul(R6, TOOL_TO_SLICE);
	const n = col(Rs, 2);
	const v = col(Rs, 1);
	const { grip, t } = model.slice;
	const origin = sub(sub(tip, scale(n, t / 2)), scale(v, grip));
	return {
		S,
		E,
		W,
		F,
		tip,
		frames: { R1, R2, R3, R4, R5, R6 },
		axes: [
			{ o: [0, 0, 0], a: [0, 0, 1] },
			{ o: S, a: col(R1, 1) },
			{ o: E, a: col(R2, 1) },
			{ o: W, a: col(R3, 0) },
			{ o: W, a: col(R4, 1) },
			{ o: W, a: col(R5, 0) },
		],
		slice: { R: Rs, origin, grip: tip },
	};
}

/**
 * Level-mode coupling: J4 held at 0, J5 = 90 deg - J2 - J3, so the tool points straight down.
 * J5 is clamped to its limits (callers keep J2 and J3 where no clamping is needed).
 */
export function levelLink(model) {
	const j5 = model.joints[4];
	return (q) => {
		const out = q.slice();
		out[3] = 0;
		out[4] = Math.max(j5.min, Math.min(j5.max, Math.PI / 2 - q[1] - q[2]));
		return out;
	};
}

const same = (q) => q;

/** Position error (m) and orientation error (rad) of the slice against the target. */
export function poseError(model, pose) {
	return { pos: len(sub(pose.slice.grip, model.target.grip)), ang: rotAngle(model.target.R, pose.slice.R) };
}

/** Tilt of the slice from flat (radians): angle between its face normal and straight up. */
export function tiltOf(R) {
	return Math.acos(Math.max(-1, Math.min(1, Math.abs(R[8]))));
}

/**
 * Numerical Jacobian of the slice pose (grip point position and orientation) with respect to
 * the given joints. Returns columns [[dx,dy,dz, wx,wy,wz], ...] per joint index in `which`.
 * link: optional coupling applied to the joint angles before forward kinematics (levelLink).
 */
export function jacobian(model, q, which, link = same) {
	const h = 1e-5;
	const p0 = fk(model, link(q)).slice;
	const RtT = transpose(p0.R);
	return which.map((i) => {
		const qq = q.slice();
		qq[i] += h;
		const p1 = fk(model, link(qq)).slice;
		const dp = scale(sub(p1.grip, p0.grip), 1 / h);
		const w = scale(logRot(mul(p1.R, RtT)), 1 / h);
		return [...dp, ...w];
	});
}

// Gram-Schmidt: orthonormal basis of the given vectors, keeping those whose remainder exceeds tol.
function basis(vectors, tol) {
	const out = [];
	for (const v0 of vectors) {
		const v = v0.slice();
		for (const b of out) {
			const k = b.reduce((s, bi, i) => s + bi * v[i], 0);
			for (let i = 0; i < v.length; i++) v[i] -= k * b[i];
		}
		const n = Math.hypot(...v);
		if (n > tol) out.push(v.map((x) => x / n));
	}
	return out;
}

// Length of the part of unit vector e that lies outside span(B).
function remainder(e, B) {
	let s = 0;
	for (const b of B) {
		const k = b.reduce((acc, bi, i) => acc + bi * e[i], 0);
		s += k * k;
	}
	return Math.sqrt(Math.max(0, 1 - s));
}

const unit = (n, i) => Array.from({ length: n }, (_, j) => (j === i ? 1 : 0));

export const COMPONENTS = ["x", "y", "z", "roll", "pitch", "yaw"];

/**
 * What the free joints can change at configuration q.
 *   move[x|y|z]:          'free'  the slice can move along this axis on its own, without turning
 *                         'tied'  it moves along this axis only together with other changes
 *                                 (another axis, or a turn)
 *                         'stuck' no free joint moves it along this axis
 *   turn[roll|pitch|yaw]: 'free'  it can turn about this axis while staying where it is
 *                         'tied'  it turns about this axis only while also moving
 *                         'stuck' no free joint turns it about this axis
 *   rank:                 independent directions of motion (of 6)
 * Thresholds tolerate small misalignment (about 15 degrees) so labels do not flicker.
 * link: optional joint coupling (levelLink) that the free joints drive.
 */
export function analyze(model, q, free, link = same) {
	const result = { rank: 0, move: {}, turn: {} };
	if (!free.length) {
		for (const c of COMPONENTS.slice(0, 3)) result.move[c] = "stuck";
		for (const c of COMPONENTS.slice(3)) result.turn[c] = "stuck";
		return result;
	}
	const J = jacobian(model, q, free, link);
	const Lc = model.Lc;
	const k = free.length;
	const scaled = J.map((c) => [c[0] / Lc, c[1] / Lc, c[2] / Lc, c[3], c[4], c[5]]);
	result.rank = basis(scaled, 0.05).length;
	const P = scaled.map((c) => c.slice(0, 3));
	const A = scaled.map((c) => c.slice(3));
	// Joint motions that leave block B (columns' rows) unchanged: its null space, as unit vectors.
	const nullOf = (B) => {
		const rowBasis = basis([0, 1, 2].map((i) => B.map((c) => c[i])), 0.05);
		return basis([...rowBasis, ...Array.from({ length: k }, (_, j) => unit(k, j))], 0.1).slice(rowBasis.length);
	};
	const image = (vs, B) => vs.map((nv) => [0, 1, 2].map((i) => nv.reduce((s, x, j) => s + x * B[j][i], 0)));
	// Moves: what the joint motions that keep the slice's orientation do to its position, so a
	// wrist that can only slide the slice by turning it does not count as moving it on its own.
	const Vb = basis(image(nullOf(A), P), 0.1);
	for (let i = 0; i < 3; i++) {
		const rowNorm = Math.hypot(...P.map((c) => c[i]));
		result.move[COMPONENTS[i]] = remainder(unit(3, i), Vb) < 0.26 ? "free" : rowNorm < 0.12 ? "stuck" : "tied";
	}
	// Turns: what the joint motions that keep the slice in place do to its orientation.
	const turns = image(nullOf(P), A);
	const Wb = basis(turns, 0.1);
	for (let i = 0; i < 3; i++) {
		const rowNorm = Math.hypot(...A.map((c) => c[i]));
		result.turn[COMPONENTS[3 + i]] = remainder(unit(3, i), Wb) < 0.26 ? "free" : rowNorm < 0.12 ? "stuck" : "tied";
	}
	return result;
}

// Solve the n x n system M x = b (Gaussian elimination with partial pivoting).
function solveLinear(M, b) {
	const n = b.length;
	const A = M.map((row, i) => [...row, b[i]]);
	for (let c = 0; c < n; c++) {
		let p = c;
		for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
		[A[c], A[p]] = [A[p], A[c]];
		const d = A[c][c] || 1e-12;
		for (let r = 0; r < n; r++) {
			if (r === c) continue;
			const f = A[r][c] / d;
			for (let j = c; j <= n; j++) A[r][j] -= f * A[c][j];
		}
	}
	return A.map((row, i) => row[n] / (row[i] || 1e-12));
}

const clampTo = (model, link) => (q) => link(q.map((v, i) => Math.max(model.joints[i].min, Math.min(model.joints[i].max, v))));

/**
 * One damped least-squares step from q toward goal { grip, R }, moving only the free joints.
 * Returns { q, e } where e is the remaining error size before the step (scaled units).
 */
function dlsStep(model, q, free, goal, link, clamp) {
	const Lc = model.Lc;
	const p = fk(model, q).slice;
	const ep = scale(sub(goal.grip, p.grip), 1 / Lc);
	const er = logRot(mul(goal.R, transpose(p.R)));
	const e = [...ep, ...er];
	const size = Math.hypot(...e);
	if (size < 1e-6) return { q, e: size };
	const J = jacobian(model, q, free, link).map((c) => [c[0] / Lc, c[1] / Lc, c[2] / Lc, c[3], c[4], c[5]]);
	// dq = J^T (J J^T + l^2 I)^-1 e
	const lam = 0.05;
	const JJt = [0, 1, 2, 3, 4, 5].map((a) => [0, 1, 2, 3, 4, 5].map((b) => J.reduce((acc, c) => acc + c[a] * c[b], 0) + (a === b ? lam * lam : 0)));
	const y = solveLinear(JJt, e);
	const dq = J.map((c) => c.reduce((acc, ci, a) => acc + ci * y[a], 0));
	const step = Math.min(1, 0.35 / (Math.hypot(...dq) || 1));
	const out = q.slice();
	free.forEach((i, j) => {
		out[i] += dq[j] * step;
	});
	return { q: clamp(out), e: size };
}

/**
 * One jog step with the free joints: kind 'move' shifts the slice's grip point along cell axis
 * `axis` (0 x, 1 y, 2 z) by `amount` meters; kind 'turn' turns the slice about that cell axis
 * through its grip point by `amount` radians, holding the rest of the pose if the joints allow.
 * Returns { q, along, drift }: how far the pose went along the request (m or rad) and how far it
 * strayed in the other five components (scaled units).
 */
export function jog(model, q0, free, kind, axis, amount, link = same) {
	const clamp = clampTo(model, link);
	const p0 = fk(model, q0).slice;
	const dir = [0, 0, 0];
	dir[axis] = 1;
	const goal = kind === "move" ? { grip: add(p0.grip, scale(dir, amount)), R: p0.R } : { grip: p0.grip, R: mul([rotX, rotY, rotZ][axis](amount), p0.R) };
	let q = q0.slice();
	for (let it = 0; it < 6; it++) {
		const r = dlsStep(model, q, free, goal, link, clamp);
		q = r.q;
		if (r.e < 1e-5) break;
	}
	const p1 = fk(model, q).slice;
	const dp = scale(sub(p1.grip, p0.grip), 1 / model.Lc);
	const w = logRot(mul(p1.R, transpose(p0.R)));
	const d = [...dp, ...w];
	const k = (kind === "move" ? 0 : 3) + axis;
	const along = kind === "move" ? d[k] * model.Lc : d[k];
	d[k] = 0;
	return { q, along, drift: Math.hypot(...d) };
}

/**
 * Damped least-squares search for joint angles that put the slice on the target, moving only
 * the joints in `free` (the others stay as in q0). Tries a few seeds. Returns { q, err }, with
 * q already passed through `link` (an optional joint coupling such as levelLink).
 */
export function solveIK(model, q0, free, { iters = 300, seeds = 12, link = same } = {}) {
	const lim = model.joints;
	const clamp = clampTo(model, link);
	let best = null;
	let rnd = 12345;
	const rand = () => {
		rnd = (rnd * 1103515245 + 12345) % 2147483648;
		return rnd / 2147483648;
	};
	for (let s = 0; s < seeds; s++) {
		let q = q0.slice();
		if (s > 0) for (const i of free) q[i] = lim[i].min + (lim[i].max - lim[i].min) * (0.15 + 0.7 * rand());
		q = clamp(q);
		for (let it = 0; it < iters; it++) {
			const r = dlsStep(model, q, free, model.target, link, clamp);
			if (r.e < 1e-6) break;
			q = r.q;
		}
		const err = poseError(model, fk(model, q));
		const score = err.pos / model.tol.pos + err.ang / model.tol.ang;
		if (!best || score < best.score) best = { q, err, score };
		if (err.pos < model.tol.pos * 0.2 && err.ang < model.tol.ang * 0.2) break;
	}
	return best;
}
