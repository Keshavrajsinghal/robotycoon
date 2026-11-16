// Camera-to-robot calibration model (wb4-calibration). Pure functions with no DOM, so the same
// code runs in the page and in Node checks.
//
// Frames. Robot frame: millimeters in the plane where the bunches lie in the tote, measured from
// the robot base, with y counterclockwise from x (seen from above). Image: pixels, u to the right
// and v down, origin at the top-left corner. "Centered" pixel coordinates q = (u - W/2, H/2 - v)
// put the origin at the image center with y up, so the map from q to the robot frame is a proper
// rotation (no mirror) plus scale and shift.
//
// True camera (what the lens and mounting really do), for a camera pose
// { tx, ty (tilt, deg), yaw (deg), dh (height change, mm) } away from where it was installed:
//   c  = center + (h + dh) * (tan tx, tan ty)    a small tilt slides the view sideways by the
//                                                 lever arm (height times angle); the slight
//                                                 keystone stretch a real tilt adds is ignored
//   s  = mmPerPx * (h + dh) / h                   a higher camera sees more millimeters per pixel
//   d  = R(-(yaw0 + yaw)) (P - c) / s             ideal pixel offset, centered, y up
//   d' = d * (1 + k1 * |d|^2 / Rn^2)              radial lens distortion, Rn = half image diagonal
//   (u, v) = (W/2 + d'x, H/2 - d'y)
// Stored calibration (what the robot believes): a 2D similarity P = t + sigma R(phi) q, applied
// to the raw centered pixel or, with lens correction, to the undistorted one (k1 is the camera's
// own lens parameter, known from an earlier camera calibration). This flat fit stands in for the
// real eye-to-hand solve, which finds the camera's full 3D pose from tilted board poses.

const DEG = Math.PI / 180;

/** Seeded random numbers in [0, 1) (mulberry32). */
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

/** Standard normal sample (Box-Muller) from a uniform source. */
export function gauss(rand) {
	const u = Math.max(1e-12, rand());
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const isPair = (v, pos) => Array.isArray(v) && v.length === 2 && v.every((x) => isNum(x) && (!pos || x > 0));

/**
 * Check the workbench data. Returns { ok: true, cfg } or { ok: false, field } naming the first
 * missing or malformed field.
 */
export function validate(data) {
	const d = data ?? {};
	const k = d.washdown_knock;
	const b = d.bump_max;
	const checks = [
		["image_px", isPair(d.image_px, true) && d.image_px.every((x) => x >= 64)],
		["mm_per_px", isNum(d.mm_per_px) && d.mm_per_px > 0],
		["camera_height_mm", isNum(d.camera_height_mm) && d.camera_height_mm > 0],
		["camera_center_mm", isPair(d.camera_center_mm)],
		["camera_yaw_deg", isNum(d.camera_yaw_deg) && Math.abs(d.camera_yaw_deg) <= 180],
		["lens_k1", isNum(d.lens_k1) && Math.abs(d.lens_k1) < 0.3],
		["board_noise_px", isNum(d.board_noise_px) && d.board_noise_px >= 0],
		["robot_pose_error_mm", isNum(d.robot_pose_error_mm) && d.robot_pose_error_mm >= 0],
		["bunch_center_noise_mm", isNum(d.bunch_center_noise_mm) && d.bunch_center_noise_mm >= 0],
		["calibration_poses", Number.isInteger(d.calibration_poses) && d.calibration_poses >= 3 && d.calibration_poses <= 20],
		["bunch_mm", isPair(d.bunch_mm, true)],
		["tolerance_mm", isNum(d.tolerance_mm) && d.tolerance_mm > 0],
		["washdown_knock", k && typeof k === "object"],
		["washdown_knock.tilt_x_deg", isNum(k?.tilt_x_deg) && Math.abs(k.tilt_x_deg) <= 10],
		["washdown_knock.tilt_y_deg", isNum(k?.tilt_y_deg) && Math.abs(k.tilt_y_deg) <= 10],
		["washdown_knock.yaw_deg", isNum(k?.yaw_deg) && Math.abs(k.yaw_deg) <= 45],
		["bump_max", b && typeof b === "object"],
		["bump_max.tilt_deg", isNum(b?.tilt_deg) && b.tilt_deg > 0 && b.tilt_deg <= 10],
		["bump_max.yaw_deg", isNum(b?.yaw_deg) && b.yaw_deg > 0 && b.yaw_deg <= 45],
		["bump_max.height_mm", isNum(b?.height_mm) && b.height_mm > 0 && b.height_mm < d.camera_height_mm / 2],
	];
	for (const [field, ok] of checks) if (!ok) return { ok: false, field };
	const [W, H] = d.image_px;
	return {
		ok: true,
		cfg: {
			W,
			H,
			Rn: Math.hypot(W / 2, H / 2),
			mmPerPx: d.mm_per_px,
			height: d.camera_height_mm,
			center: [...d.camera_center_mm],
			yaw: d.camera_yaw_deg * DEG,
			k1: d.lens_k1,
			boardNoise: d.board_noise_px,
			poseErr: d.robot_pose_error_mm,
			bunchNoise: d.bunch_center_noise_mm,
			poses: d.calibration_poses,
			bunch: [...d.bunch_mm],
			tol: d.tolerance_mm,
			knock: { tx: k.tilt_x_deg, ty: k.tilt_y_deg, yaw: k.yaw_deg, dh: 0 },
			bumpMax: { tilt: b.tilt_deg, yaw: b.yaw_deg, height: b.height_mm },
		},
	};
}

/** Component-wise sum of camera poses { tx, ty, yaw, dh }. */
export function addPose(a, b) {
	return { tx: (a?.tx ?? 0) + (b?.tx ?? 0), ty: (a?.ty ?? 0) + (b?.ty ?? 0), yaw: (a?.yaw ?? 0) + (b?.yaw ?? 0), dh: (a?.dh ?? 0) + (b?.dh ?? 0) };
}

/** The true camera at pose { tx, ty (deg), yaw (deg), dh (mm) } away from where it was installed. */
export function camera(cfg, pose) {
	const hh = cfg.height + (pose?.dh ?? 0);
	const th = cfg.yaw + (pose?.yaw ?? 0) * DEG;
	return {
		W: cfg.W,
		H: cfg.H,
		Rn: cfg.Rn,
		k1: cfg.k1,
		c: [cfg.center[0] + hh * Math.tan((pose?.tx ?? 0) * DEG), cfg.center[1] + hh * Math.tan((pose?.ty ?? 0) * DEG)],
		th,
		cos: Math.cos(th),
		sin: Math.sin(th),
		s: (cfg.mmPerPx * hh) / cfg.height,
	};
}

function distort(cam, d) {
	const f = 1 + (cam.k1 * (d[0] * d[0] + d[1] * d[1])) / (cam.Rn * cam.Rn);
	return [d[0] * f, d[1] * f];
}

/**
 * Remove radial distortion from a centered pixel: solve r (1 + k1 r^2 / Rn^2) = |q| for the
 * undistorted radius r by Newton's method, then scale q to that radius.
 */
export function undistort(cam, q) {
	const rd = Math.hypot(q[0], q[1]);
	if (rd === 0 || cam.k1 === 0) return [q[0], q[1]];
	const a = cam.k1 / (cam.Rn * cam.Rn);
	let r = rd;
	for (let i = 0; i < 8; i++) {
		const f = r + a * r * r * r - rd;
		const df = 1 + 3 * a * r * r;
		if (df <= 1e-6) break;
		r -= f / df;
	}
	return [(q[0] * r) / rd, (q[1] * r) / rd];
}

/** Robot-frame point (mm) to image pixel [u, v], through the true camera. */
export function project(cam, P) {
	const x = P[0] - cam.c[0];
	const y = P[1] - cam.c[1];
	const d = [(cam.cos * x + cam.sin * y) / cam.s, (-cam.sin * x + cam.cos * y) / cam.s];
	const q = distort(cam, d);
	return [cam.W / 2 + q[0], cam.H / 2 - q[1]];
}

/** Image pixel [u, v] to the robot-frame point (mm) it really shows. */
export function unproject(cam, uv) {
	const d = undistort(cam, centered(cam, uv));
	const x = d[0] * cam.s;
	const y = d[1] * cam.s;
	return [cam.c[0] + cam.cos * x - cam.sin * y, cam.c[1] + cam.sin * x + cam.cos * y];
}

/** Pixel [u, v] to centered coordinates (origin at the image center, y up). */
export function centered(cam, uv) {
	return [uv[0] - cam.W / 2, cam.H / 2 - uv[1]];
}

/**
 * Least-squares 2D similarity (rotation phi, scale sigma, shift t) mapping points q onto P:
 * minimize sum |t + sigma R(phi) q_i - P_i|^2. This is the closed form of the Umeyama /
 * Procrustes solution in 2D: center both sets, the best angle is atan2(b, a) with
 * a = sum(qx Px + qy Py) and b = sum(qx Py - qy Px), the best scale is sqrt(a^2 + b^2) / sum|q|^2,
 * and the shift moves the rotated, scaled centroid of q onto the centroid of P.
 */
export function fitSimilarity(qs, Ps) {
	const n = qs.length;
	let mqx = 0;
	let mqy = 0;
	let mpx = 0;
	let mpy = 0;
	for (let i = 0; i < n; i++) {
		mqx += qs[i][0] / n;
		mqy += qs[i][1] / n;
		mpx += Ps[i][0] / n;
		mpy += Ps[i][1] / n;
	}
	let a = 0;
	let b = 0;
	let qq = 0;
	for (let i = 0; i < n; i++) {
		const qx = qs[i][0] - mqx;
		const qy = qs[i][1] - mqy;
		const px = Ps[i][0] - mpx;
		const py = Ps[i][1] - mpy;
		a += qx * px + qy * py;
		b += qx * py - qy * px;
		qq += qx * qx + qy * qy;
	}
	const phi = Math.atan2(b, a);
	const sigma = qq > 0 ? Math.hypot(a, b) / qq : 1;
	const c = Math.cos(phi);
	const s = Math.sin(phi);
	return { phi, sigma, cos: c, sin: s, t: [mpx - sigma * (c * mqx - s * mqy), mpy - sigma * (s * mqx + c * mqy)] };
}

/** Apply a fitted similarity to a centered pixel. */
export function applyT(T, q) {
	return [T.t[0] + T.sigma * (T.cos * q[0] - T.sin * q[1]), T.t[1] + T.sigma * (T.sin * q[0] + T.cos * q[1])];
}

/** Where the robot believes a pixel is, using calibration { T, lens }. */
export function pixelToRobot(cam, calib, uv) {
	const q = centered(cam, uv);
	return applyT(calib.T, calib.lens ? undistort(cam, q) : q);
}

/**
 * Grid of image points (fractions of the image size) for placing the calibration board: n
 * points in a near-square grid that covers `span` of the image, row by row in a serpentine.
 */
export function poseGrid(cfg, n, span = 0.66) {
	const cols = Math.max(2, Math.ceil(Math.sqrt((n * cfg.W) / cfg.H)));
	const rows = Math.max(1, Math.ceil(n / cols));
	const pts = [];
	for (let r = 0; r < rows; r++) {
		const inRow = Math.min(cols, n - r * cols);
		for (let k = 0; k < inRow; k++) {
			const c = r % 2 ? inRow - 1 - k : k;
			const fx = inRow === 1 ? 0.5 : 0.5 - span / 2 + (span * c) / (inRow - 1);
			const fy = rows === 1 ? 0.5 : 0.5 - span / 2 + (span * r) / (rows - 1);
			pts.push([fx * cfg.W, fy * cfg.H]);
		}
	}
	return pts;
}

/**
 * Run a calibration: the robot is commanded to hold the board at whole-millimeter positions
 * spread over what the camera sees; it really lands a little off (its accuracy error), the
 * vision system finds the board center in each image (true projection plus detection noise),
 * and a similarity is fitted from the pixels to the commanded positions.
 * Returns { poses (commanded, mm), actual (mm), pixels, T, lens, rms, max, residuals (mm) }.
 */
export function calibrate(cfg, cam, lens, seed) {
	const rand = rng(seed);
	const poses = poseGrid(cfg, cfg.poses).map((uv) => unproject(cam, uv).map((v) => Math.round(v)));
	const actual = poses.map((P) => [P[0] + gauss(rand) * cfg.poseErr, P[1] + gauss(rand) * cfg.poseErr]);
	const pixels = actual.map((P) => {
		const uv = project(cam, P);
		return [uv[0] + gauss(rand) * cfg.boardNoise, uv[1] + gauss(rand) * cfg.boardNoise];
	});
	const qs = pixels.map((uv) => {
		const q = centered(cam, uv);
		return lens ? undistort(cam, q) : q;
	});
	const T = fitSimilarity(qs, poses);
	const residuals = qs.map((q, i) => {
		const p = applyT(T, q);
		return Math.hypot(p[0] - poses[i][0], p[1] - poses[i][1]);
	});
	const rms = Math.sqrt(residuals.reduce((s, e) => s + e * e, 0) / residuals.length);
	return { poses, actual, pixels, T, lens, rms, max: Math.max(...residuals), residuals };
}

/**
 * Largest gap (mm) between where the robot believes and where things really are, over the
 * central part of the image (center plus four points `frac` of the way to the edges).
 */
export function drift(cam, calib, frac = 0.3) {
	let worst = 0;
	for (const [fx, fy] of [
		[0, 0],
		[-frac, -frac],
		[frac, -frac],
		[-frac, frac],
		[frac, frac],
	]) {
		const uv = [cam.W * (0.5 + fx / 2), cam.H * (0.5 + fy / 2)];
		const a = pixelToRobot(cam, calib, uv);
		const b = unproject(cam, uv);
		worst = Math.max(worst, Math.hypot(a[0] - b[0], a[1] - b[1]));
	}
	return worst;
}

/**
 * Top view of a grape bunch lying on its side, length L along local x (stem end at +x), width
 * Wd. Returns { berries: [[x, y, r, shade]], stem: [[x, y], ...] } in mm, centered on the
 * berries' area centroid, which is the "center" the vision system reports and the gripper aims at.
 */
export function bunchShape(L, Wd, seed) {
	const rand = rng(seed);
	const rB = Wd * 0.14;
	const stemLen = L * 0.12;
	const x0 = -L / 2 + rB;
	const x1 = L / 2 - stemLen - rB * 0.6;
	const berries = [];
	const rows = Math.max(3, Math.round((x1 - x0) / (rB * 1.55)));
	for (let i = 0; i <= rows; i++) {
		const t = i / rows; // 0 at the tip, 1 at the shoulder by the stem
		const x = x0 + (x1 - x0) * t;
		const half = (Wd / 2 - rB) * (0.25 + 0.75 * Math.sqrt(t)) * (t > 0.85 ? 1 - (t - 0.85) * 1.6 : 1);
		const n = Math.max(1, Math.round((2 * half) / (rB * 1.6)) + 1);
		for (let j = 0; j < n; j++) {
			const y = n === 1 ? 0 : -half + (2 * half * j) / (n - 1);
			const r = rB * (0.85 + 0.3 * rand());
			berries.push([x + (rand() - 0.5) * rB * 0.5, y + (rand() - 0.5) * rB * 0.5, r, rand()]);
		}
	}
	let ax = 0;
	let ay = 0;
	let aa = 0;
	for (const [x, y, r] of berries) {
		ax += x * r * r;
		ay += y * r * r;
		aa += r * r;
	}
	ax /= aa;
	ay /= aa;
	const shoulder = x1 + rB * 0.4;
	const stem = [
		[shoulder - ax, -ay],
		[shoulder + stemLen * 0.55 - ax, rB * 0.35 - ay],
		[shoulder + stemLen + rB * 0.5 - ax, rB * 0.1 - ay],
	];
	return { berries: berries.map(([x, y, r, sh]) => [x - ax, y - ay, r, sh]), stem };
}
