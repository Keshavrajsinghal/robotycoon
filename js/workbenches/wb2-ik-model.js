// Model for workbench wb2-ik: data checks, analytic inverse kinematics for the three joints that
// swing in the arm's vertical plane (shoulder, elbow, wrist bend), and forward kinematics for
// drawing. Pure functions, no DOM. Units: millimeters and degrees (see the DATA SCHEMA comment in
// wb2-ik.js for the conventions).

export const DEG = 180 / Math.PI;

/** Indices into data.joints (axis order 1-6) of the joints that move in the side view. */
export const PLANE_JOINTS = [1, 2, 4];

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const num = (v) => typeof v === "number" && Number.isFinite(v);
const str = (v) => typeof v === "string" && v.trim() !== "";

/** Check ctx.wb.data against the schema. Returns { model } or { error: fieldName }. */
export function readData(d) {
	if (!d || typeof d !== "object") return { error: "data" };
	for (const k of ["upper_arm_mm", "forearm_mm", "shoulder_height_mm"]) if (!num(d[k]) || d[k] <= 0) return { error: k };
	if (!num(d.tool_mm) || d.tool_mm < 0) return { error: "tool_mm" };
	if (!num(d.tray_x_mm)) return { error: "tray_x_mm" };
	const tote = d.tote;
	if (!tote || typeof tote !== "object") return { error: "tote" };
	if (!num(tote.near_x_mm) || !num(tote.far_x_mm) || tote.near_x_mm >= tote.far_x_mm) return { error: "tote.near_x_mm/far_x_mm" };
	if (!num(tote.wall_mm) || tote.wall_mm <= 0) return { error: "tote.wall_mm" };
	if (!num(d.tilt_max_deg) || d.tilt_max_deg <= 0 || d.tilt_max_deg >= 90) return { error: "tilt_max_deg" };
	const st = d.start_target_mm;
	if (!Array.isArray(st) || st.length !== 2 || !st.every(num)) return { error: "start_target_mm" };
	const b = d.bunches;
	if (!Array.isArray(b) || b.length < 1 || b.length > 6) return { error: "bunches" };
	for (let i = 0; i < b.length; i++) {
		const q = b[i];
		if (!q || typeof q !== "object" || !num(q.x_mm) || !num(q.z_mm)) return { error: `bunches[${i}].x_mm/z_mm` };
		if (!num(q.tilt_deg) || Math.abs(q.tilt_deg) > d.tilt_max_deg) return { error: `bunches[${i}].tilt_deg` };
		if (q.z_mm < -d.shoulder_height_mm) return { error: `bunches[${i}].z_mm` };
	}
	const j = d.joints;
	if (!Array.isArray(j) || j.length !== 6) return { error: "joints" };
	for (let i = 0; i < 6; i++) {
		const q = j[i];
		if (!q || typeof q !== "object" || !str(q.name)) return { error: `joints[${i}].name` };
		if (PLANE_JOINTS.includes(i) && (!num(q.min_deg) || !num(q.max_deg) || q.min_deg >= q.max_deg)) return { error: `joints[${i}].min_deg/max_deg` };
	}
	const s = d.solutions;
	if (!Array.isArray(s) || s.length !== 2 || !s.every(str)) return { error: "solutions" };
	return {
		model: {
			L1: d.upper_arm_mm,
			L2: d.forearm_mm,
			tool: d.tool_mm,
			sh: d.shoulder_height_mm,
			trayX: d.tray_x_mm,
			tote: { near: tote.near_x_mm, far: tote.far_x_mm, wall: tote.wall_mm },
			tiltMax: d.tilt_max_deg,
			start: [st[0], Math.max(st[1], -d.shoulder_height_mm)],
			bunches: b.map((q) => ({ x: q.x_mm, z: q.z_mm, tilt: q.tilt_deg })),
			names: j.map((q) => q.name.trim()),
			joints: PLANE_JOINTS.map((i) => ({ name: j[i].name.trim(), min: j[i].min_deg, max: j[i].max_deg })),
			solutions: s.map((x) => x.trim()),
		},
	};
}

/**
 * A revolute joint reaches deg + 360k for any k its limits allow. Pick the representation inside
 * [min, max] (closest to zero), else the one nearest the range, flagged as outside the limits.
 */
export function fitAngle(deg, min, max) {
	let best = null;
	let near = deg;
	let gap = Number.POSITIVE_INFINITY;
	for (let k = -2; k <= 2; k++) {
		const v = deg + 360 * k;
		if (v >= min - 1e-6 && v <= max + 1e-6) {
			if (best === null || Math.abs(v) < Math.abs(best)) best = v;
		} else {
			const g = v < min ? min - v : v - max;
			if (g < gap) {
				gap = g;
				near = v;
			}
		}
	}
	return best === null ? { deg: near, ok: false } : { deg: best, ok: true };
}

/** Direction of the tool (wrist axis toward the finger tips) for a tilt in degrees. */
export const toolDir = (tiltDeg) => {
	const a = (tiltDeg - 90) / DEG;
	return [Math.cos(a), Math.sin(a)];
};

/**
 * Analytic IK for the finger tips at (tx, tz) mm with the tool at tiltDeg (0 = straight down).
 * Solves the two-link triangle to the wrist axis, tool_mm back along the tool. Out of reach,
 * both solutions are the arm stretched (or folded) toward the wrist point.
 */
export function solveIK(m, tx, tz, tiltDeg) {
	const { L1, L2 } = m;
	const u = toolDir(tiltDeg);
	const wx = tx - m.tool * u[0];
	const wz = tz - m.tool * u[1];
	const d = Math.hypot(wx, wz);
	const max = L1 + L2;
	const min = Math.abs(L1 - L2);
	const reachable = d <= max + 1e-6 && d >= min - 1e-6;
	const dd = clamp(d, min, max);
	const phi = d > 1e-9 ? Math.atan2(wz, wx) : 0;
	const c2 = clamp((dd * dd - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1);
	const bend = Math.acos(c2);
	const a = (tiltDeg - 90) / DEG;
	const sols = [-bend, bend].map((q2) => {
		const q1 = phi - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2));
		const raw = [q1, q2, a - q1 - q2].map((v) => v * DEG);
		const fit = raw.map((v, i) => fitAngle(v, m.joints[i].min, m.joints[i].max));
		return { deg: fit.map((f) => f.deg), okJ: fit.map((f) => f.ok), ok: reachable && fit.every((f) => f.ok) };
	});
	return { reachable, wristDist: d, distinct: reachable && bend > 1 / DEG && bend < Math.PI - 1 / DEG, sols, usable: sols.some((s) => s.ok) };
}

/** Forward kinematics in mm from shoulder, elbow and wrist angles (degrees). */
export function fk(m, q1d, q2d, q3d) {
	const q1 = q1d / DEG;
	const q12 = (q1d + q2d) / DEG;
	const q123 = (q1d + q2d + q3d) / DEG;
	const e = [m.L1 * Math.cos(q1), m.L1 * Math.sin(q1)];
	const w = [e[0] + m.L2 * Math.cos(q12), e[1] + m.L2 * Math.sin(q12)];
	const u = [Math.cos(q123), Math.sin(q123)];
	return { s: [0, 0], e, w, u, t: [w[0] + m.tool * u[0], w[1] + m.tool * u[1]] };
}
