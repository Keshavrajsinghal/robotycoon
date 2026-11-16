// Workbench wb4-calibration: camera-to-robot calibration at the grape station. Two views: the
// overhead camera's image of a tote of grape bunches, and a top view of the cell in the robot's
// frame (millimeters from the robot base), with the six-axis arm and its soft fingers. Picking a
// bunch in the camera image converts its detected center pixel to a robot-frame point through the
// stored calibration, and the fingers go there; the top view and a magnified inset show the hit or
// miss in millimeters. The camera starts knocked out of calibration (data washdown_knock); sliders
// knock it further (tilt, turn, height). "Calibrate" has the arm hold a board at known positions,
// collects pixel/robot point pairs, and fits a 2D similarity by least squares
// (wb4-calibration-model.js), a flat stand-in for the real 3D eye-to-hand solve. Drawing and UI
// chrome only: every model number comes from ctx.wb.data.
//
// DATA SCHEMA (the JSON in the wb4-calibration section of knowledge/sim/workbenches.md)
//   note                   string            say which values come from which concept and which are
//                                            illustrative
//   image_px               [int, int]        camera image width and height, pixels
//   mm_per_px              number            image scale at the height where the bunches lie, millimeters
//                                            per pixel, with the camera where it was installed
//   camera_height_mm       number            camera height above the bunches, mm (the lever arm that turns a
//                                            tilt into a sideways slide of the view)
//   camera_center_mm       [number, number]  robot-frame point (x, y in mm from the robot base) seen at the
//                                            image center with the camera where it was installed
//   camera_yaw_deg         number (-180..180) rotation of the image axes from the robot's x axis at install
//   lens_k1                number            radial lens distortion coefficient, unitless: a pixel's offset
//                                            from the image center grows by (1 + k1 * r^2), r = that offset
//                                            divided by half the image diagonal; negative = barrel
//   board_noise_px         number            standard deviation of the error when the vision system finds the
//                                            calibration board's center, pixels
//   robot_pose_error_mm    number            standard deviation of how far the arm really lands from each
//                                            commanded calibration position (its accuracy error), mm
//   bunch_center_noise_mm  number            standard deviation of the vision system's estimate of a bunch's
//                                            center, mm (per axis)
//   calibration_poses      int (3-20)        number of board positions in one calibration
//   bunch_mm               [number, number]  grape bunch length and width as it lies in the tote, mm
//   tolerance_mm           number            largest offset between the fingers' center and the bunch's center
//                                            that still gives a good grip, mm
//   washdown_knock         object            how far the camera was knocked before the bench opens (the stored
//                                            calibration predates it):
//     tilt_x_deg           number              tilt that slides the view along the robot's x axis, degrees
//     tilt_y_deg           number              tilt that slides the view along the robot's y axis, degrees
//     yaw_deg              number              turn about the vertical axis, degrees
//   bump_max               object            slider ranges for knocking the camera further:
//     tilt_deg             number              largest tilt either way, degrees
//     yaw_deg              number              largest turn, degrees
//     height_mm            number              largest height change, mm

import { h, loadCss } from "../core/dom.js";
import { FOOD } from "../engine/food.js";
import { PAL } from "../engine/park.js";
import { ik2, ROBOT_COLORS } from "../engine/robots.js";
import * as M from "./wb4-calibration-model.js";

const ID = "wb4-calibration";
const BUNCHES = 4;
const COL = {
	floor: "#aab2bb",
	rail: PAL.steel,
	table: "#d9dde2",
	tableGrid: "#c7cdd4",
	tableTick: "#5f6874",
	toteRim: "#f5f7f9",
	toteWall: "#c2cbd5",
	toteFloor: "#e2e7ed",
	toteEdge: "#8c99a7",
	lane: "#3a3f47",
	tray: FOOD.tray,
	trayIn: FOOD.trayIn,
	grape: FOOD.grape,
	grape2: FOOD.grape2,
	stem: FOOD.stem,
	actual: "#2f6fb3",
	believed: PAL.cone,
	armBody: "#f2f2ee",
	armEdge: "#9aa3ad",
	armAccent: "#2a9d8f",
	joint: ROBOT_COLORS.joint,
	finger: ROBOT_COLORS.orange,
	hit: FOOD.pass,
	miss: "#d9483b",
	detect: "#ffd84a",
	collected: "#43c46b",
	ink: "#1d2127",
};
// Drawing sizes of the arm and gripper in the top view, mm (shapes only, not facts).
const ARM = { L1: 480, L2: 440, shoulderZ: 420, wristZ: 320, baseR: 100, upperW: 100, foreW: 76, elbowR: 52, wristR: 44, hubR: 34, fingerW: 22 };
const BOARD = { w: 140, d: 100, nx: 7, ny: 5 };

const ease = (v) => v * v * (3 - 2 * v);
const lerp = (a, b, t) => a + (b - a) * t;
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const signed = (v, digits) => `${v > 0 ? "+" : v < 0 ? "-" : ""}${Math.abs(v).toFixed(digits)}`;
const angLerp = (a, b, t) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t;
const DEG = Math.PI / 180;

// ---------------------------------------------------------------------------
// Geometry helpers for drawing through the lens

/** Clip a polygon (ideal camera coordinates) to |x| <= hx, |y| <= hy (Sutherland-Hodgman). */
function clipPoly(pts, hx, hy, closed = true) {
	const edges = [(p) => p[0] >= -hx, (p) => p[0] <= hx, (p) => p[1] >= -hy, (p) => p[1] <= hy];
	const cross = [
		(a, b) => (-hx - a[0]) / (b[0] - a[0]),
		(a, b) => (hx - a[0]) / (b[0] - a[0]),
		(a, b) => (-hy - a[1]) / (b[1] - a[1]),
		(a, b) => (hy - a[1]) / (b[1] - a[1]),
	];
	let out = pts;
	for (let e = 0; e < 4 && out.length; e++) {
		const inp = out;
		out = [];
		const n = inp.length;
		for (let i = 0; i < n; i++) {
			const cur = inp[i];
			const prev = inp[(i + n - 1) % n];
			if (!closed && i === 0) {
				if (edges[e](cur)) out.push(cur);
				continue;
			}
			const ci = edges[e](cur);
			const pi = edges[e](prev);
			if (ci) {
				if (!pi) out.push(lerp2(prev, cur, cross[e](prev, cur)));
				out.push(cur);
			} else if (pi) out.push(lerp2(prev, cur, cross[e](prev, cur)));
		}
	}
	return out;
}

/** Insert points so no edge is longer than step (keeps straight world lines curving through the lens). */
function subdivide(pts, step, closed = true) {
	const out = [];
	const n = pts.length;
	const last = closed ? n : n - 1;
	for (let i = 0; i < last; i++) {
		const a = pts[i];
		const b = pts[(i + 1) % n];
		const k = Math.max(1, Math.ceil(dist(a, b) / step));
		for (let j = 0; j < k; j++) out.push(lerp2(a, b, j / k));
	}
	if (!closed && n) out.push(pts[n - 1]);
	return out;
}

const rect = (cx, cy, hw, hh) => [
	[cx - hw, cy - hh],
	[cx + hw, cy - hh],
	[cx + hw, cy + hh],
	[cx - hw, cy + hh],
];

// ---------------------------------------------------------------------------

function mount(el, ctx) {
	loadCss("css/modules/wb4-calibration.css");
	const v = M.validate(ctx.wb?.data);
	if (!v.ok) {
		el.append(h("div", { class: "wb-missing wb4-error", "data-wb4-error": v.field }, `Workbench data missing: ${v.field}`));
		return { destroy() {}, test: { solve: () => false, state: () => ({ error: v.field }) } };
	}
	const cfg = v.cfg;
	const ZERO = { tx: 0, ty: 0, yaw: 0, dh: 0 };

	// ----- model state
	const bump = { ...ZERO }; // the learner's knocks, on top of the washdown knock
	const pose = () => M.addPose(cfg.knock, bump);
	let cam = M.camera(cfg, pose());
	let seed = 1;
	let batch = 0;
	let lensOn = true;
	// The stored calibration was made with the camera where it was installed, before the knock.
	let calib = { ...M.calibrate(cfg, M.camera(cfg, ZERO), true, seed++), fixes: false, at: { ...ZERO } };
	let bunches = [];
	let missSinceCal = false;
	let last = null; // last pick result
	let aimed = null; // the bunch being picked: its pixel and where the calibration puts it
	let solved = false;
	let solvedFired = false;
	let busy = false; // calibrating
	// Solved on an earlier visit: the banner shows it, as in the other workbenches.
	let prevSolved = false;
	try {
		prevSolved = !!ctx.state?.workbench?.(ID)?.solved;
	} catch {
		prevSolved = false;
	}

	// ----- cell layout (robot frame, mm), derived from what the camera sees at install
	const s0 = cfg.mmPerPx;
	const [cx, cy] = cfg.center;
	const viewHw = (cfg.W / 2) * s0;
	const viewHh = (cfg.H / 2) * s0;
	const [bunchL, bunchW] = cfg.bunch;
	const tote = { hw: viewHw * 0.84, hh: viewHh * 0.8, wall: Math.max(14, viewHw * 0.075) };
	tote.inset = tote.wall * 0.6;
	const railY = tote.hh + tote.wall + Math.max(20, viewHh * 0.12);
	const laneY = cy + viewHh + Math.max(90, viewHh * 0.5); // tray lane, outside the camera's view
	const laneHw = Math.max(60, bunchW * 0.85);
	const dropAt = [Math.max(bunchL, cx - viewHw * 0.55), laneY];
	// Rest pose beside the tote's near corner, so the arm stays out of the camera's view between picks.
	const home = [Math.max(ARM.baseR + 60, cx - viewHw - 100), cy + viewHh + 70];

	// Table window: the robot base, the camera's view with some room for knocks, and the tray lane,
	// at the image's aspect ratio.
	const win = (() => {
		const m = Math.max(40, cfg.height * Math.tan((cfg.bumpMax.tilt * DEG) / 2) + Math.hypot(viewHw, viewHh) * Math.sin((cfg.bumpMax.yaw * DEG) / 2));
		let x0 = Math.min(-ARM.baseR - 40, cx - viewHw - m);
		const x1 = cx + viewHw + m;
		let y0 = Math.min(-ARM.baseR - 40, cy - viewHh - m);
		let y1 = Math.max(ARM.baseR + 40, laneY + laneHw + 20);
		let w = x1 - x0;
		let d = y1 - y0;
		const aspect = cfg.W / cfg.H;
		if (w / d < aspect) {
			const nw = d * aspect;
			x0 -= (nw - w) / 2;
			w = nw;
		} else {
			const nd = w / aspect;
			y0 -= (nd - d) / 2;
			y1 += (nd - d) / 2;
			d = nd;
		}
		return { x0, y0, w, d };
	})();

	// ----- bunches
	function placeBunches() {
		batch++;
		const rand = M.rng(1000 + batch * 7919);
		const out = [];
		const mx = tote.hw - tote.inset - bunchL * 0.42;
		const my = tote.hh - tote.inset - bunchL * 0.42;
		for (const gap of [0.92, 0.7, 0.45]) {
			for (let tries = 0; out.length < BUNCHES && tries < 500; tries++) {
				const P = [cx + (rand() * 2 - 1) * Math.max(0, mx), cy + (rand() * 2 - 1) * Math.max(0, my)];
				if (out.some((b) => dist(b.P, P) < bunchL * gap)) continue;
				const noisePx = cfg.bunchNoise / s0;
				out.push({
					P,
					ang: rand() * Math.PI * 2,
					shape: M.bunchShape(bunchL, bunchW, 17 + batch * 31 + out.length * 7),
					noise: [M.gauss(rand) * noisePx, M.gauss(rand) * noisePx],
					picked: false,
				});
			}
			if (out.length >= BUNCHES) break;
		}
		// Number them left to right in the image so the Pick buttons read in order.
		out.sort((a, b) => M.project(cam, a.P)[0] - M.project(cam, b.P)[0]);
		bunches = out;
		updateDetections();
	}
	function updateDetections() {
		for (const b of bunches) {
			const uv = M.project(cam, b.P);
			b.det = [uv[0] + b.noise[0], uv[1] + b.noise[1]];
			const m = cfg.W * 0.01;
			b.visible = b.det[0] > m && b.det[0] < cfg.W - m && b.det[1] > m && b.det[1] < cfg.H - m;
		}
	}

	// ----- visual state
	const view = {
		tool: home, // gripper center, robot frame
		toolAng: Math.atan2(home[1], home[0]),
		grip: 1, // 0 closed .. 1 open
		carry: null, // bunch held after a hit
		inTray: null, // last bunch set in the tray
		board: false, // the arm holds the calibration board instead of the fingers
		boardTilt: null, // { axis, amount, yaw } of the board at the current pose
		run: null, // calibration being shown: { res, collected }
		flash: -1,
		hover: -1,
	};

	// ----- DOM
	const camCanvas = h("canvas", { class: "wb4-canvas wb4-cam", role: "img", "aria-label": "Camera image of the tote" });
	const tableCanvas = h("canvas", { class: "wb4-canvas", role: "img", "aria-label": "Cell top view in the robot's frame" });
	const swatch = (cls) => h("span", { class: `wb4-sw ${cls}`, "aria-hidden": "true" });
	const solvedEl = h("div", { class: "wb4-solved", role: "status", hidden: true }, "Solved");
	const resultEl = h("p", { class: "wb4-result", "aria-live": "polite" });
	const aimEl = h("p", { class: "wb4-readout wb4-aim", "aria-live": "polite", hidden: true });
	const pickBtns = [];
	const pickRow = h("div", { class: "wb4-picks", role: "group", "aria-label": "Pick a bunch" });
	const nextBtn = h("button", { type: "button", class: "btn wb4-next", onclick: () => act(nextTote) }, "Next tote");
	const sliders = {};
	const outputs = {};
	const sliderRow = (key, label, max, step, unit, digits) => {
		const id = `wb4-${key}`;
		const input = h("input", { type: "range", id, min: -max, max, step, value: 0 });
		const out = h("output", { for: id, class: "wb4-val" });
		input.addEventListener("input", () => {
			bump[key] = Number(input.value);
			onBump();
		});
		sliders[key] = input;
		outputs[key] = () => setText(out, `${signed(bump[key], digits)} ${unit}`);
		return h("div", { class: "wb4-slider" }, h("label", { for: id }, label), input, out);
	};
	const bm = cfg.bumpMax;
	const resetBtn = h("button", { type: "button", class: "btn", onclick: () => setBump(ZERO) }, "Reset sliders");
	const lensBox = h("input", { type: "checkbox", id: "wb4-lens", checked: true });
	lensBox.addEventListener("change", () => {
		lensOn = lensBox.checked;
	});
	const calBtn = h("button", { type: "button", class: "btn primary", onclick: () => act(runCalibration) }, "Calibrate");
	const mapReadout = h("p", { class: "wb4-readout", "aria-live": "polite" });
	const fitReadout = h("p", { class: "wb4-readout" });
	const movedTitle = h("strong", {}, "Camera moved since calibration.");
	const movedDetail = h("span", {});
	const movedChip = h("p", { class: "wb4-chip warn", hidden: true, "aria-live": "polite" }, movedTitle, " ", movedDetail);

	const root = h(
		"div",
		{ class: "wb4" },
		solvedEl,
		h(
			"div",
			{ class: "wb4-views" },
			h(
				"figure",
				{ class: "wb4-view" },
				h("figcaption", {}, "Camera image"),
				camCanvas,
				h("div", { class: "wb4-legend" }, h("span", {}, swatch("detect"), "Detected center"), h("span", {}, swatch("collected"), "Board found")),
			),
			h(
				"figure",
				{ class: "wb4-view" },
				h("figcaption", {}, "Robot frame, top view (mm from the base)"),
				tableCanvas,
				h(
					"div",
					{ class: "wb4-legend" },
					h("span", {}, swatch("actual"), "Camera view, actual"),
					h("span", {}, swatch("believed"), "Camera view, as calibrated"),
					h("span", {}, swatch("tol"), "Allowed offset"),
				),
			),
		),
		h("div", { class: "wb4-pickbar" }, h("span", { class: "wb4-kicker" }, "Pick"), pickRow, nextBtn),
		aimEl,
		resultEl,
		h(
			"div",
			{ class: "wb4-controls" },
			h(
				"fieldset",
				{ class: "wb4-box" },
				h("legend", {}, "Knock the camera"),
				sliderRow("tx", "Tilt x", bm.tilt, 0.1, "deg", 1),
				sliderRow("ty", "Tilt y", bm.tilt, 0.1, "deg", 1),
				sliderRow("yaw", "Turn", bm.yaw, 0.1, "deg", 1),
				sliderRow("dh", "Height", bm.height, 1, "mm", 0),
				h("div", { class: "wb4-row" }, resetBtn),
			),
			h(
				"fieldset",
				{ class: "wb4-box" },
				h("legend", {}, "Calibration"),
				h("label", { class: "wb4-check", for: "wb4-lens" }, lensBox, "Lens correction"),
				h("div", { class: "wb4-row" }, calBtn),
				mapReadout,
				fitReadout,
				movedChip,
			),
		),
	);
	el.append(root);

	for (let i = 0; i < BUNCHES; i++) {
		const b = h("button", { type: "button", class: "btn wb4-pick", "aria-label": `Pick bunch ${i + 1}`, onclick: () => act(() => pick(i)) }, String(i + 1));
		pickBtns.push(b);
		pickRow.append(b);
	}

	// ----- animation runner (steps run back to back; instant under reduced motion and in tests)
	let instantMode = false;
	let seq = null;
	let raf = 0;
	const instant = () => instantMode || ctx.reducedMotion;
	function run(steps) {
		finish();
		if (instant()) {
			for (const s of steps) {
				s.start?.();
				s.frame?.(1);
				s.done?.();
			}
			render();
			return;
		}
		seq = { steps, i: 0, t0: performance.now() };
		steps[0].start?.();
		raf = requestAnimationFrame(tick);
	}
	function tick(now) {
		raf = 0;
		if (!seq) return;
		if (ctx.reducedMotion) {
			// Motion was switched off mid-animation: jump to the end state.
			finish();
			return;
		}
		const s = seq.steps[seq.i];
		const p = Math.min(1, (now - seq.t0) / s.dur);
		s.frame?.(p);
		if (p >= 1) {
			s.done?.();
			seq.i++;
			seq.t0 = now;
			if (seq.i >= seq.steps.length) {
				seq = null;
				render();
				return;
			}
			seq.steps[seq.i].start?.();
		}
		render();
		raf = requestAnimationFrame(tick);
	}
	function finish() {
		if (!seq) return;
		if (raf) cancelAnimationFrame(raf);
		raf = 0;
		const st = seq;
		seq = null;
		for (let i = st.i; i < st.steps.length; i++) {
			if (i > st.i) st.steps[i].start?.();
			st.steps[i].frame?.(1);
			st.steps[i].done?.();
		}
		render();
	}
	/** Move the gripper to `to`, turning the wrist to `ang`; extra.start/frame/done run alongside. */
	const moveStep = (to, ang, dur, extra = {}) => {
		let from;
		let a0;
		return {
			dur,
			start: () => {
				from = view.tool;
				a0 = view.toolAng;
				extra.start?.();
			},
			frame: (p) => {
				view.tool = lerp2(from, to, ease(p));
				if (ang != null) view.toolAng = angLerp(a0, ang, ease(p));
				extra.frame?.(p);
			},
			done: extra.done,
		};
	};
	const gripStep = (to, dur, done) => {
		let from;
		return {
			dur,
			start: () => {
				from = view.grip;
			},
			frame: (p) => {
				view.grip = lerp(from, to, ease(p));
			},
			done,
		};
	};
	const travel = (to) => Math.min(800, 280 + dist(view.tool, to) * 0.7);

	// ----- actions
	function act(fn) {
		if (busy) return;
		fn();
	}

	function clearShown() {
		view.run = null;
		view.carry = null;
		view.flash = -1;
	}

	function pick(i) {
		finish();
		const b = bunches[i];
		if (!b || b.picked || !b.visible) return;
		clearShown();
		const est = M.pixelToRobot(cam, calib, b.det);
		const err = dist(est, b.P);
		const res = { bunch: b, est, err, hit: err <= cfg.tol };
		last = null;
		aimed = { bunch: b, n: i + 1, px: b.det, est };
		updateUi();
		const homeAng = Math.atan2(home[1], home[0]);
		const steps = [
			moveStep(est, b.ang + Math.PI / 2, travel(est)),
			gripStep(0.12, 280, () => {
				last = res;
				if (res.hit) {
					b.picked = true;
					view.carry = b;
					if (calib.fixes) solved = true;
				} else missSinceCal = true;
				updateUi();
				if (solved && !solvedFired) {
					solvedFired = true;
					ctx.onSolved?.();
				}
			}),
		];
		if (res.hit) {
			steps.push(moveStep(dropAt, b.ang + Math.PI / 2, 620));
			steps.push(
				gripStep(1, 220, () => {
					view.inTray = view.carry;
					view.carry = null;
				}),
			);
		} else {
			steps.push(gripStep(1, 220));
		}
		steps.push(moveStep(home, homeAng, 520));
		view.grip = 1;
		run(steps);
	}

	function nextTote() {
		finish();
		clearShown();
		last = null;
		aimed = null;
		placeBunches();
		updateUi();
		render();
	}

	function runCalibration() {
		finish();
		clearShown();
		last = null;
		aimed = null;
		// Counts once the learner has recalibrated a camera that was out of calibration; a later
		// calibration of an unmoved camera keeps that, so calibrating twice does not lose it.
		const fixes = calib.fixes || missSinceCal || M.drift(cam, calib) > cfg.tol;
		const res = M.calibrate(cfg, cam, lensOn, seed++);
		busy = true;
		view.run = { res, collected: 0 };
		view.board = true;
		view.grip = 1;
		updateUi();
		const steps = [];
		res.actual.forEach((P, i) => {
			// Tilt the board about a different axis at each pose, as on a real cell (drawn only; this
			// bench's fit uses just the board's center).
			const tilt = { axis: i * 2.39996, amount: 28 * DEG, yaw: 0.35 * Math.sin(i * 1.7) };
			steps.push(
				moveStep(P, Math.atan2(P[1], P[0]) + tilt.yaw, 360, {
					frame: (p) => {
						view.boardTilt = { ...tilt, amount: tilt.amount * ease(p) };
					},
				}),
			);
			steps.push({
				dur: 160,
				start: () => {
					view.flash = i;
				},
				done: () => {
					view.flash = -1;
					view.run.collected = i + 1;
					updateUi();
				},
			});
		});
		steps.push(
			moveStep(home, Math.atan2(home[1], home[0]), 460, {
				start: () => {
					view.boardTilt = null;
				},
				done: () => {
					view.board = false;
					calib = { ...res, fixes, at: pose() };
					missSinceCal = false;
					busy = false;
					updateUi();
				},
			}),
		);
		run(steps);
	}

	function setBump(b) {
		for (const k of Object.keys(bump)) {
			bump[k] = b[k];
			sliders[k].value = String(b[k]);
		}
		onBump();
	}

	function onBump() {
		finish();
		aimed = null;
		if (view.run && !busy) view.run = null;
		cam = M.camera(cfg, pose());
		updateDetections();
		updateUi();
		render();
	}

	// ----- UI text and state
	const setText = (node, text) => {
		if (node.textContent !== text) node.textContent = text;
	};
	function updateUi() {
		for (const k of Object.keys(outputs)) outputs[k]();
		for (const [i, btn] of pickBtns.entries()) {
			const b = bunches[i];
			btn.disabled = busy || !b || b.picked || !b.visible;
			btn.hidden = !b;
		}
		for (const inp of Object.values(sliders)) inp.disabled = busy;
		resetBtn.disabled = busy;
		calBtn.disabled = busy;
		nextBtn.disabled = busy;
		lensBox.disabled = busy;
		// The pixel the learner picked, where the stored calibration puts it in the robot frame, and
		// after the pick, where the bunch really was.
		aimEl.hidden = !aimed || busy;
		if (aimed && !busy) {
			const { n, px, est, bunch } = aimed;
			const truth = last?.bunch === bunch ? `; actually at x ${bunch.P[0].toFixed(1)}, y ${bunch.P[1].toFixed(1)} mm` : "";
			setText(aimEl, `Bunch ${n}: pixel (${Math.round(px[0])}, ${Math.round(px[1])}) maps to robot x ${est[0].toFixed(1)}, y ${est[1].toFixed(1)} mm${truth}`);
		}
		if (busy) {
			setText(resultEl, `Calibrating: ${view.run?.collected ?? 0} of ${cfg.poses} point pairs`);
			resultEl.dataset.state = "";
		} else if (last) {
			// A hit through the old calibration (sliders cancelling the knock) does not finish the goal.
			const oldCal = last.hit && !calib.fixes && !solved && !prevSolved ? ". Still the old calibration: press Calibrate to finish" : "";
			setText(resultEl, `${last.hit ? "Hit" : "Miss"}: ${last.err.toFixed(1)} mm off (allowed ${cfg.tol} mm)${oldCal}`);
			resultEl.dataset.state = last.hit ? "hit" : "miss";
		} else {
			setText(resultEl, bunches.some((b) => !b.picked && b.visible) ? "Tap a bunch in the camera image, or use a Pick button." : "No bunches left in view. Press Next tote.");
			resultEl.dataset.state = "";
		}
		const T = calib.T;
		let turn = (T.phi * 180) / Math.PI;
		if (turn < 0) turn += 360;
		setText(mapReadout, `Stored calibration: turn ${turn.toFixed(1)} deg, ${T.sigma.toFixed(3)} mm per px, image center at x ${T.t[0].toFixed(1)}, y ${T.t[1].toFixed(1)} mm`);
		setText(fitReadout, `${calib.poses.length} point pairs, fit residual ${calib.rms.toFixed(1)} mm RMS (worst ${calib.max.toFixed(1)} mm), lens correction ${calib.lens ? "on" : "off"}`);
		const now = pose();
		const moved = Object.keys(now).some((k) => Math.abs(now[k] - calib.at[k]) > 1e-9);
		movedChip.hidden = !moved || busy;
		if (moved && !busy) {
			const off = calibOffset();
			setText(movedDetail, `The stored calibration is now ${off.center.toFixed(1)} mm off at the image center, up to ${off.corners.toFixed(1)} mm at the tote corners.`);
		}
		solvedEl.hidden = !(solved || prevSolved);
		root.dataset.solved = solved || prevSolved ? "true" : "false";
		root.dataset.busy = busy ? "true" : "false";
	}

	/** How far the stored calibration is from the truth (mm) at the image center and at the tote's inner corners. */
	function calibOffset() {
		const gap = (P) => dist(M.pixelToRobot(cam, calib, M.project(cam, P)), P);
		return {
			center: gap(M.unproject(cam, [cfg.W / 2, cfg.H / 2])),
			corners: Math.max(...rect(cx, cy, tote.hw, tote.hh).map(gap)),
		};
	}

	// ----- canvases
	let sizes = { cw: 0, ch: 0, dpr: 1 };
	function resize() {
		const cw = Math.max(1, Math.round(camCanvas.parentElement.clientWidth));
		const ch = Math.round((cw * cfg.H) / cfg.W);
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		if (cw === sizes.cw && dpr === sizes.dpr) return;
		sizes = { cw, ch, dpr };
		for (const c of [camCanvas, tableCanvas]) {
			c.width = Math.round(cw * dpr);
			c.height = Math.round(ch * dpr);
			c.style.width = "100%";
			c.style.height = `${ch}px`;
		}
		render();
	}

	function render() {
		if (!sizes.cw) return;
		drawCamera();
		drawTable();
	}

	const path = (c, pts, closed = true) => {
		c.beginPath();
		pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
		if (closed) c.closePath();
	};

	function dot(c, p, r, fill, stroke = "#ffffff") {
		c.beginPath();
		c.arc(p[0], p[1], r, 0, Math.PI * 2);
		c.fillStyle = fill;
		c.fill();
		c.strokeStyle = stroke;
		c.lineWidth = 1.5;
		c.stroke();
	}

	/** Canvas pixels per millimeter near world point P under the mapping toCss. */
	const localScale = (toCss, P) => dist(toCss(P), toCss([P[0] + 1, P[1]]));

	/** A grape bunch lying in the tote at b.P, turned by b.ang. */
	function drawBunch(c, b, toCss, opts = {}) {
		const P = opts.at ?? b.P;
		const sc = opts.scale ?? 1;
		const ca = Math.cos(b.ang);
		const sa = Math.sin(b.ang);
		const W = ([x, y]) => [P[0] + (ca * x - sa * y) * sc, P[1] + (sa * x + ca * y) * sc];
		const k = localScale(toCss, P) * sc;
		c.save();
		if (opts.alpha != null) c.globalAlpha = opts.alpha;
		// Shadow, then stem, then berries.
		if (opts.shadow !== false) {
			c.fillStyle = "rgba(20,24,30,0.22)";
			for (const [x, y, r] of b.shape.berries) {
				const p = toCss(W([x, y]));
				c.beginPath();
				c.arc(p[0] + 1.5, p[1] + 2, r * k, 0, Math.PI * 2);
				c.fill();
			}
		}
		const stem = b.shape.stem.map((p) => toCss(W(p)));
		c.strokeStyle = COL.stem;
		c.lineCap = "round";
		c.lineJoin = "round";
		c.lineWidth = Math.max(1.5, bunchW * 0.06 * k);
		path(c, stem, false);
		c.stroke();
		for (const [x, y, r, shd] of b.shape.berries) {
			const p = toCss(W([x, y]));
			const rr = r * k;
			c.beginPath();
			c.arc(p[0], p[1], rr, 0, Math.PI * 2);
			c.fillStyle = shd > 0.6 ? COL.grape2 : COL.grape;
			c.fill();
			c.strokeStyle = "rgba(40,18,56,0.55)";
			c.lineWidth = Math.max(0.6, rr * 0.12);
			c.stroke();
			if (rr > 2.5) {
				c.beginPath();
				c.arc(p[0] - rr * 0.32, p[1] - rr * 0.32, rr * 0.28, 0, Math.PI * 2);
				c.fillStyle = "rgba(255,255,255,0.28)";
				c.fill();
			}
		}
		c.restore();
	}

	/** Arm links from the robot base (the origin) to the gripper, in the robot frame, mm. */
	function armGeometry(tool) {
		const d = Math.hypot(tool[0], tool[1]) || 1;
		const u = [tool[0] / d, tool[1] / d];
		const k = ik2(ARM.L1, ARM.L2, d, ARM.wristZ - ARM.shoulderZ, true);
		return { elbow: [u[0] * k.elbow[0], u[1] * k.elbow[0]], wrist: tool };
	}

	/** Thick world-space segment chain, drawn with round caps through `line(pts, widthMm, color)`. */
	function drawArm(line, circle, opts = {}) {
		const g = armGeometry(view.tool);
		const O = [0, 0];
		if (opts.base) {
			circle(O, ARM.baseR, COL.joint, null);
			circle(O, ARM.baseR * 0.78, COL.armBody, COL.armEdge);
		}
		line([O, g.elbow], ARM.upperW, COL.armBody, COL.armEdge);
		circle(g.elbow, ARM.elbowR, COL.armAccent, null);
		line([g.elbow, g.wrist], ARM.foreW, COL.armBody, COL.armEdge);
		circle(O, ARM.baseR * 0.5, COL.armAccent, null);
		circle(g.wrist, ARM.wristR, COL.joint, null);
	}

	/** Soft fingers seen from above: a hub and three fingers, spread by view.grip. */
	function drawFingers(c, toCss, P, ang, grip, alpha = 1) {
		const k = localScale(toCss, P);
		c.save();
		c.globalAlpha = alpha;
		c.lineCap = "round";
		for (let i = 0; i < 3; i++) {
			const a = ang + Math.PI / 2 + (i / 3) * Math.PI * 2;
			const u = [Math.cos(a), Math.sin(a)];
			const r0 = ARM.hubR * 0.6;
			const r1 = ARM.hubR * 0.9 + grip * bunchW * 0.42 + (1 - grip) * bunchW * 0.12;
			const p0 = toCss([P[0] + u[0] * r0, P[1] + u[1] * r0]);
			const p1 = toCss([P[0] + u[0] * r1, P[1] + u[1] * r1]);
			for (const [w, col] of [
				[ARM.fingerW * k + 2, "rgba(90,40,10,0.55)"],
				[ARM.fingerW * k, COL.finger],
			]) {
				c.strokeStyle = col;
				c.lineWidth = Math.max(2, w);
				c.beginPath();
				c.moveTo(p0[0], p0[1]);
				c.lineTo(p1[0], p1[1]);
				c.stroke();
			}
		}
		const hp = toCss(P);
		c.beginPath();
		c.arc(hp[0], hp[1], Math.max(3, ARM.hubR * k), 0, Math.PI * 2);
		c.fillStyle = COL.joint;
		c.fill();
		c.beginPath();
		c.moveTo(hp[0] - 4, hp[1]);
		c.lineTo(hp[0] + 4, hp[1]);
		c.moveTo(hp[0], hp[1] - 4);
		c.lineTo(hp[0], hp[1] + 4);
		c.strokeStyle = "#ffffff";
		c.lineWidth = 1.5;
		c.stroke();
		c.restore();
	}

	/** Calibration board held by the arm at P: a checkerboard with small square markers, tilted by view.boardTilt. */
	function drawBoard(c, toCss, P, ang) {
		const t = view.boardTilt ?? { axis: 0, amount: 0, yaw: 0 };
		const ca = Math.cos(ang);
		const sa = Math.sin(ang);
		const ax = [Math.cos(t.axis), Math.sin(t.axis)];
		const f = Math.cos(t.amount);
		// Board-local point -> world: turn with the wrist, then squash across the tilt axis.
		const W = ([x, y]) => {
			const wx = ca * x - sa * y;
			const wy = sa * x + ca * y;
			const along = wx * ax[0] + wy * ax[1];
			const across = (-wx * ax[1] + wy * ax[0]) * f;
			return toCss([P[0] + along * ax[0] - across * ax[1], P[1] + along * ax[1] + across * ax[0]]);
		};
		const quad = (x0, y0, x1, y1, fill) => {
			path(c, [W([x0, y0]), W([x1, y0]), W([x1, y1]), W([x0, y1])]);
			c.fillStyle = fill;
			c.fill();
		};
		const hw = BOARD.w / 2;
		const hd = BOARD.d / 2;
		c.save();
		quad(-hw - 6, -hd - 6, hw + 6, hd + 6, "#fbfbf8");
		const qx = BOARD.w / BOARD.nx;
		const qy = BOARD.d / BOARD.ny;
		for (let i = 0; i < BOARD.nx; i++)
			for (let j = 0; j < BOARD.ny; j++) {
				const x0 = -hw + i * qx;
				const y0 = -hd + j * qy;
				if ((i + j) % 2) quad(x0, y0, x0 + qx, y0 + qy, "#22262c");
				else quad(x0 + qx * 0.3, y0 + qy * 0.3, x0 + qx * 0.7, y0 + qy * 0.7, "#5a616b");
			}
		path(c, [W([-hw - 6, -hd - 6]), W([hw + 6, -hd - 6]), W([hw + 6, hd + 6]), W([-hw - 6, hd + 6])]);
		c.strokeStyle = "rgba(0,0,0,0.35)";
		c.lineWidth = 1;
		c.stroke();
		dot(c, toCss(P), 3, "#e5483a", "#ffffff");
		c.restore();
	}

	// Camera image: the world drawn through the true camera, lens distortion included.
	function drawCamera() {
		const { cw, ch, dpr } = sizes;
		const c = camCanvas.getContext("2d");
		c.setTransform(dpr, 0, 0, dpr, 0, 0);
		const k = cw / cfg.W;
		const hx = (cfg.W / 2) * 1.2;
		const hy = (cfg.H / 2) * 1.2;
		const ideal = (P) => {
			const x = P[0] - cam.c[0];
			const y = P[1] - cam.c[1];
			return [(cam.cos * x + cam.sin * y) / cam.s, (-cam.sin * x + cam.cos * y) / cam.s];
		};
		const toCss = (d) => {
			const f = 1 + (cam.k1 * (d[0] * d[0] + d[1] * d[1])) / (cam.Rn * cam.Rn);
			return [(cfg.W / 2 + d[0] * f) * k, (cfg.H / 2 - d[1] * f) * k];
		};
		const P2c = (P) => toCss(ideal(P));
		const inView = (P, pad = 1.25) => {
			const d = ideal(P);
			return Math.abs(d[0]) < (cfg.W / 2) * pad && Math.abs(d[1]) < (cfg.H / 2) * pad;
		};
		const step = cfg.W / 120;
		const worldPoly = (pts, closed = true) => {
			const cl = clipPoly(pts.map(ideal), hx, hy, closed);
			if (cl.length < 2) return null;
			return subdivide(cl, step, closed).map(toCss);
		};
		const fillWorld = (pts, fill, stroke, lw) => {
			const p = worldPoly(pts);
			if (!p) return;
			path(c, p);
			c.fillStyle = fill;
			c.fill();
			if (stroke) {
				c.strokeStyle = stroke;
				c.lineWidth = lw;
				c.stroke();
			}
		};
		const mmPx = k / cam.s; // canvas px per mm at the bunches' height

		c.fillStyle = COL.floor;
		c.fillRect(0, 0, cw, ch);
		// Conveyor rails under the tote: long straight lines that show the lens bending them.
		const far = (cfg.W + cfg.H) * cam.s * 2;
		c.lineCap = "butt";
		for (const y of [cy - railY, cy + railY]) {
			const seg = worldPoly(
				[
					[cx - far, y],
					[cx + far, y],
				],
				false,
			);
			if (seg) {
				path(c, seg, false);
				c.strokeStyle = COL.rail;
				c.lineWidth = Math.max(2, 18 * mmPx);
				c.stroke();
			}
		}
		// The tote: rim, inner walls, floor.
		fillWorld(rect(cx, cy, tote.hw + tote.wall, tote.hh + tote.wall), COL.toteRim, COL.toteEdge, 1.5);
		fillWorld(rect(cx, cy, tote.hw, tote.hh), COL.toteWall, COL.toteEdge, 1);
		fillWorld(rect(cx, cy, tote.hw - tote.inset, tote.hh - tote.inset), COL.toteFloor);

		for (const b of bunches) if (!b.picked && inView(b.P)) drawBunch(c, b, P2c);

		// The arm, when it reaches into the view (the camera looks down on it).
		{
			const g = armGeometry(view.tool);
			const line = (pts, wMm, fill, edge) => {
				const p = worldPoly(pts, false);
				if (!p) return;
				c.lineCap = "round";
				c.lineJoin = "round";
				if (edge) {
					path(c, p, false);
					c.strokeStyle = edge;
					c.lineWidth = wMm * mmPx + 2;
					c.stroke();
				}
				path(c, p, false);
				c.strokeStyle = fill;
				c.lineWidth = wMm * mmPx;
				c.stroke();
			};
			const circle = (P, rMm, fill) => {
				if (!inView(P, 1.15)) return;
				const p = P2c(P);
				c.beginPath();
				c.arc(p[0], p[1], rMm * mmPx, 0, Math.PI * 2);
				c.fillStyle = fill;
				c.fill();
			};
			if (inView(g.wrist, 1.6) || inView(g.elbow, 1.4)) {
				drawArm(line, circle);
				if (inView(view.tool, 1.3)) {
					if (view.carry) drawBunch(c, view.carry, P2c, { at: view.tool, scale: 0.94, shadow: false });
					if (view.board) drawBoard(c, P2c, view.tool, view.toolAng);
					else drawFingers(c, P2c, view.tool, view.toolAng, view.grip);
				}
			}
		}

		// Vision overlay: detected centers and their numbers.
		const cross = (p, color, size) => {
			c.lineCap = "round";
			for (const [w, col] of [
				[4, "rgba(0,0,0,0.55)"],
				[2, color],
			]) {
				c.strokeStyle = col;
				c.lineWidth = w;
				c.beginPath();
				c.moveTo(p[0] - size, p[1]);
				c.lineTo(p[0] + size, p[1]);
				c.moveTo(p[0], p[1] - size);
				c.lineTo(p[0], p[1] + size);
				c.stroke();
			}
		};
		c.font = "700 12px system-ui, sans-serif";
		c.textAlign = "center";
		c.textBaseline = "middle";
		if (!busy && !view.carry) {
			bunches.forEach((b, i) => {
				if (b.picked || !b.visible) return;
				const p = [b.det[0] * k, b.det[1] * k];
				if (i === view.hover) {
					c.beginPath();
					c.arc(p[0], p[1], Math.max(16, bunchL * 0.55 * mmPx), 0, Math.PI * 2);
					c.strokeStyle = "rgba(255,216,74,0.95)";
					c.lineWidth = 2.5;
					c.stroke();
				}
				cross(p, COL.detect, 6);
				const bp = [p[0] + 13, p[1] - 13];
				c.beginPath();
				c.arc(bp[0], bp[1], 9, 0, Math.PI * 2);
				c.fillStyle = "#ffffff";
				c.fill();
				c.strokeStyle = COL.ink;
				c.lineWidth = 1.5;
				c.stroke();
				c.fillStyle = COL.ink;
				c.fillText(String(i + 1), bp[0], bp[1] + 0.5);
			});
		}
		if (view.run) {
			const n = view.run.collected;
			for (let j = 0; j < n; j++) {
				const uv = view.run.res.pixels[j];
				dot(c, [uv[0] * k, uv[1] * k], 4.5, COL.collected);
			}
			if (view.flash >= 0) {
				c.fillStyle = "rgba(255,255,255,0.22)";
				c.fillRect(0, 0, cw, ch);
			}
		}

		// Lens vignette and viewfinder corners.
		const g = c.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.35, cw / 2, ch / 2, Math.hypot(cw, ch) / 2);
		g.addColorStop(0, "rgba(0,0,0,0)");
		g.addColorStop(1, "rgba(0,0,0,0.3)");
		c.fillStyle = g;
		c.fillRect(0, 0, cw, ch);
		c.strokeStyle = "rgba(255,255,255,0.85)";
		c.lineWidth = 2;
		const L = Math.min(cw, ch) * 0.08;
		const m = 8;
		c.beginPath();
		for (const [x, y, sx, sy] of [
			[m, m, 1, 1],
			[cw - m, m, -1, 1],
			[m, ch - m, 1, -1],
			[cw - m, ch - m, -1, -1],
		]) {
			c.moveTo(x, y + sy * L);
			c.lineTo(x, y);
			c.lineTo(x + sx * L, y);
		}
		c.stroke();
		dot(c, [m + 10, m + 10], 3.5, "#e5483a", "rgba(255,255,255,0.7)");
	}

	// Cell top view: robot frame in millimeters, x to the right and y up, origin at the robot base.
	function drawTable() {
		const { cw, ch, dpr } = sizes;
		const c = tableCanvas.getContext("2d");
		c.setTransform(dpr, 0, 0, dpr, 0, 0);
		const k = cw / win.w;
		const T = (P) => [(P[0] - win.x0) * k, (win.y0 + win.d - P[1]) * k];
		const fillRect = (pts, fill, stroke, lw = 1) => {
			path(c, pts.map(T));
			c.fillStyle = fill;
			c.fill();
			if (stroke) {
				c.strokeStyle = stroke;
				c.lineWidth = lw;
				c.stroke();
			}
		};

		c.fillStyle = COL.table;
		c.fillRect(0, 0, cw, ch);
		// Grid (robot frame, mm).
		const stepMm = [50, 100, 200, 250, 500].find((s) => s * k >= 42) ?? 500;
		c.lineWidth = 1;
		c.strokeStyle = COL.tableGrid;
		c.beginPath();
		for (let x = Math.ceil(win.x0 / stepMm) * stepMm; x < win.x0 + win.w; x += stepMm) {
			const [sx] = T([x, 0]);
			c.moveTo(Math.round(sx) + 0.5, 0);
			c.lineTo(Math.round(sx) + 0.5, ch);
		}
		for (let y = Math.ceil(win.y0 / stepMm) * stepMm; y < win.y0 + win.d; y += stepMm) {
			const [, sy] = T([0, y]);
			c.moveTo(0, Math.round(sy) + 0.5);
			c.lineTo(cw, Math.round(sy) + 0.5);
		}
		c.stroke();

		// Tray lane (outside the camera's view) with one fiber tray where the bunch is set.
		{
			const a = T([win.x0 - 10, laneY + laneHw]);
			const b = T([win.x0 + win.w + 10, laneY - laneHw]);
			c.fillStyle = COL.lane;
			c.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
			const tw = bunchL * 1.25;
			const td = laneHw * 1.5;
			fillRect(rect(dropAt[0], dropAt[1], tw / 2, td / 2), COL.tray, "rgba(80,60,30,0.6)", 1.5);
			fillRect(rect(dropAt[0], dropAt[1], tw / 2 - 10, td / 2 - 10), COL.trayIn);
			if (view.inTray) drawBunch(c, view.inTray, T, { at: dropAt, scale: 0.9 });
		}
		// Conveyor rails and the tote.
		c.fillStyle = COL.rail;
		for (const y of [cy - railY, cy + railY]) {
			const a = T([win.x0 - 10, y + 9]);
			const b = T([win.x0 + win.w + 10, y - 9]);
			c.fillRect(a[0], a[1], b[0] - a[0], Math.max(2, b[1] - a[1]));
		}
		fillRect(rect(cx, cy, tote.hw + tote.wall, tote.hh + tote.wall), COL.toteRim, COL.toteEdge, 1.5);
		fillRect(rect(cx, cy, tote.hw, tote.hh), COL.toteWall, COL.toteEdge, 1);
		fillRect(rect(cx, cy, tote.hw - tote.inset, tote.hh - tote.inset), COL.toteFloor);

		// Camera footprints: where the camera really looks, and where the robot believes it looks.
		const border = [];
		const nb = 12;
		for (let i = 0; i < nb; i++) border.push([(cfg.W * i) / nb, 0]);
		for (let i = 0; i < nb; i++) border.push([cfg.W, (cfg.H * i) / nb]);
		for (let i = 0; i < nb; i++) border.push([cfg.W - (cfg.W * i) / nb, cfg.H]);
		for (let i = 0; i < nb; i++) border.push([0, cfg.H - (cfg.H * i) / nb]);
		const actual = border.map((uv) => T(M.unproject(cam, uv)));
		const believed = border.map((uv) => T(M.pixelToRobot(cam, calib, uv)));
		path(c, actual);
		c.fillStyle = "rgba(47,111,179,0.08)";
		c.fill();

		// Bunches at their true positions.
		for (const b of bunches) if (!b.picked) drawBunch(c, b, T);

		// Calibration poses visited so far.
		if (view.run) for (let j = 0; j < view.run.collected; j++) dot(c, T(view.run.res.actual[j]), 3.5, COL.collected);

		path(c, actual);
		c.strokeStyle = COL.actual;
		c.lineWidth = 2;
		c.setLineDash([]);
		c.stroke();
		path(c, believed);
		c.strokeStyle = COL.believed;
		c.lineWidth = 2;
		c.setLineDash([7, 5]);
		c.stroke();
		c.setLineDash([]);
		// Camera body beside the top edge of its image, turned with the camera.
		{
			const top = T(M.unproject(cam, [cfg.W / 2, 0]));
			const ctr = T(M.unproject(cam, [cfg.W / 2, cfg.H / 2]));
			const ang = Math.atan2(top[1] - ctr[1], top[0] - ctr[0]);
			c.save();
			c.translate(top[0], top[1]);
			c.rotate(ang + Math.PI / 2);
			c.translate(0, -12);
			c.fillStyle = COL.actual;
			c.strokeStyle = "#ffffff";
			c.lineWidth = 1.5;
			c.beginPath();
			c.roundRect(-13, -8, 26, 16, 4);
			c.fill();
			c.stroke();
			c.beginPath();
			c.arc(0, 0, 4.5, 0, Math.PI * 2);
			c.fillStyle = "#cfe3f7";
			c.fill();
			c.restore();
		}

		// Last pick: error line from where the fingers went to where the bunch really was.
		if (last && !busy) {
			const a = T(last.est);
			const b = T(last.bunch.P);
			c.strokeStyle = last.hit ? COL.hit : COL.miss;
			c.lineWidth = 2;
			c.beginPath();
			c.moveTo(a[0], a[1]);
			c.lineTo(b[0], b[1]);
			c.stroke();
			dot(c, b, 3, last.hit ? COL.hit : COL.miss);
		}

		// The six-axis arm from above, with a soft shadow.
		{
			const line = (off, alpha) => (pts, wMm, fill, edge) => {
				const p = pts.map((P) => {
					const q = T(P);
					return [q[0] + off, q[1] + off];
				});
				c.lineCap = "round";
				if (alpha) {
					path(c, p, false);
					c.strokeStyle = `rgba(20,24,30,${alpha})`;
					c.lineWidth = wMm * k;
					c.stroke();
					return;
				}
				if (edge) {
					path(c, p, false);
					c.strokeStyle = edge;
					c.lineWidth = wMm * k + 2;
					c.stroke();
				}
				path(c, p, false);
				c.strokeStyle = fill;
				c.lineWidth = wMm * k;
				c.stroke();
			};
			const circle = (off, alpha) => (P, rMm, fill, edge) => {
				const p = T(P);
				c.beginPath();
				c.arc(p[0] + off, p[1] + off, Math.max(2, rMm * k), 0, Math.PI * 2);
				c.fillStyle = alpha ? `rgba(20,24,30,${alpha})` : fill;
				c.fill();
				if (edge && !alpha) {
					c.strokeStyle = edge;
					c.lineWidth = 1;
					c.stroke();
				}
			};
			drawArm(line(5, 0.16), circle(5, 0.16), { base: true });
			drawArm(line(0, 0), circle(0, 0), { base: true });
			if (view.carry) drawBunch(c, view.carry, T, { at: view.tool, scale: 0.94 });
			if (view.board) drawBoard(c, T, view.tool, view.toolAng);
			else drawFingers(c, T, view.tool, view.toolAng, view.grip);
		}

		// Error label for the last pick.
		if (last && !busy) {
			const a = T(last.est);
			c.font = "700 12px system-ui, sans-serif";
			c.textAlign = "left";
			c.textBaseline = "middle";
			const txt = `${last.err.toFixed(1)} mm`;
			const tw = c.measureText(txt).width;
			const off = Math.max(14, bunchW * 0.55 * k);
			let lx = a[0] + off;
			if (lx + tw + 12 > cw) lx = a[0] - off - 6 - tw;
			let ly = Math.max(14, a[1] - off);
			const ins = insetRect(cw);
			if (lx < ins.x + ins.size && lx + tw + 5 > ins.x && ly - 10 < ins.y + ins.size + 4) ly = a[1] + off + 6;
			c.fillStyle = last.hit ? COL.hit : COL.miss;
			c.beginPath();
			c.roundRect(lx - 5, ly - 10, tw + 10, 20, 6);
			c.fill();
			c.fillStyle = "#ffffff";
			c.fillText(txt, lx, ly + 0.5);
		}

		// Tick labels, and the robot frame's axes drawn at its origin (the base).
		c.font = "600 10px system-ui, sans-serif";
		c.fillStyle = COL.tableTick;
		c.textAlign = "center";
		c.textBaseline = "bottom";
		for (let x = Math.ceil(win.x0 / stepMm) * stepMm; x < win.x0 + win.w; x += stepMm) {
			const [sx] = T([x, 0]);
			if (sx < 30 || sx > cw - 14) continue;
			c.fillText(String(Math.round(x)), sx, ch - 3);
		}
		c.textAlign = "left";
		c.textBaseline = "middle";
		for (let y = Math.ceil(win.y0 / stepMm) * stepMm; y < win.y0 + win.d; y += stepMm) {
			const [, sy] = T([0, y]);
			if (sy < 10 || sy > ch - 20) continue;
			c.fillText(String(Math.round(y)), 4, sy);
		}
		{
			const o = T([0, 0]);
			const ax = Math.max(26, ARM.baseR * 1.6 * k);
			c.strokeStyle = COL.ink;
			c.fillStyle = COL.ink;
			c.lineWidth = 2;
			for (const [dx, dy, lab] of [
				[ax, 0, "x"],
				[0, -ax, "y"],
			]) {
				c.beginPath();
				c.moveTo(o[0], o[1]);
				c.lineTo(o[0] + dx, o[1] + dy);
				c.stroke();
				const ux = Math.sign(dx);
				const uy = Math.sign(dy);
				c.beginPath();
				c.moveTo(o[0] + dx + ux * 4, o[1] + dy + uy * 4);
				c.lineTo(o[0] + dx - uy * 4 - ux * 2, o[1] + dy + ux * 4 - uy * 2);
				c.lineTo(o[0] + dx + uy * 4 - ux * 2, o[1] + dy - ux * 4 - uy * 2);
				c.closePath();
				c.fill();
				c.font = "700 11px system-ui, sans-serif";
				c.fillText(lab, o[0] + dx + (ux ? 6 : -3), o[1] + dy + (uy ? -8 : 0));
			}
			dot(c, o, 3, COL.ink, "#ffffff");
		}

		if (last && !busy) drawInset(c, cw);
	}

	/** Magnified view around the last pick: the bunch, the allowed offset, and where the fingers' center went. */
	function insetRect(cw) {
		const size = Math.round(Math.min(150, Math.max(96, cw * 0.3)));
		return { x: cw - size - 8, y: 8, size };
	}

	function drawInset(c, cw) {
		const { x: x0, y: y0, size } = insetRect(cw);
		const R = Math.max(cfg.tol * 2.6, last.err * 1.4, bunchW * 0.3);
		const k = size / (2 * R);
		const P = last.bunch.P;
		const T = (Q) => [x0 + size / 2 + (Q[0] - P[0]) * k, y0 + size / 2 - (Q[1] - P[1]) * k];
		c.save();
		c.beginPath();
		c.roundRect(x0, y0, size, size, 10);
		c.fillStyle = COL.toteFloor;
		c.fill();
		c.clip();
		drawBunch(c, last.bunch, T, { shadow: false, alpha: 0.5 });
		c.beginPath();
		c.arc(...T(P), cfg.tol * k, 0, Math.PI * 2);
		c.fillStyle = "rgba(67,196,107,0.3)";
		c.fill();
		c.setLineDash([5, 4]);
		c.strokeStyle = "#ffffff";
		c.lineWidth = 3;
		c.stroke();
		c.strokeStyle = COL.hit;
		c.lineWidth = 2;
		c.stroke();
		c.setLineDash([]);
		const e = T(last.est);
		c.strokeStyle = "#ffffff";
		c.lineWidth = 4;
		c.beginPath();
		c.moveTo(...T(P));
		c.lineTo(...e);
		c.stroke();
		c.strokeStyle = last.hit ? COL.hit : COL.miss;
		c.lineWidth = 2;
		c.stroke();
		dot(c, T(P), 3.5, COL.hit);
		// Where the fingers' center went: a ring with a cross.
		c.beginPath();
		c.arc(e[0], e[1], 7, 0, Math.PI * 2);
		c.fillStyle = COL.joint;
		c.fill();
		c.strokeStyle = "#ffffff";
		c.lineWidth = 2;
		c.stroke();
		c.beginPath();
		c.moveTo(e[0] - 4, e[1]);
		c.lineTo(e[0] + 4, e[1]);
		c.moveTo(e[0], e[1] - 4);
		c.lineTo(e[0], e[1] + 4);
		c.lineWidth = 1.5;
		c.stroke();
		// Scale bar on a dark pill so it reads over anything.
		const bar = [1, 2, 5, 10, 20, 50].find((mm) => mm * k >= size * 0.18) ?? 50;
		c.font = "700 10px system-ui, sans-serif";
		const lab = `${bar} mm`;
		const pillW = Math.max(bar * k, c.measureText(lab).width) + 12;
		c.fillStyle = "rgba(20,24,30,0.72)";
		c.beginPath();
		c.roundRect(x0 + 4, y0 + size - 30, pillW, 26, 6);
		c.fill();
		c.fillStyle = "#ffffff";
		c.fillRect(x0 + 10, y0 + size - 11, bar * k, 3);
		c.textAlign = "left";
		c.textBaseline = "bottom";
		c.fillText(lab, x0 + 10, y0 + size - 13);
		c.restore();
		c.beginPath();
		c.roundRect(x0, y0, size, size, 10);
		c.strokeStyle = "#ffffff";
		c.lineWidth = 2;
		c.stroke();
	}

	// ----- pointer input on the camera image
	const nearest = (e) => {
		const r = camCanvas.getBoundingClientRect();
		const k = r.width / cfg.W;
		const px = (e.clientX - r.left) / k;
		const py = (e.clientY - r.top) / k;
		let best = -1;
		let bestD = Math.max(((bunchL / cam.s) * 0.6), 30 / k);
		bunches.forEach((b, i) => {
			if (b.picked || !b.visible) return;
			const d = Math.hypot(b.det[0] - px, b.det[1] - py);
			if (d < bestD) {
				bestD = d;
				best = i;
			}
		});
		return best;
	};
	let down = null;
	const onDown = (e) => {
		down = { x: e.clientX, y: e.clientY, id: e.pointerId };
	};
	const onUp = (e) => {
		if (!down || e.pointerId !== down.id) return;
		const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
		down = null;
		if (moved > 14) return;
		const i = nearest(e);
		if (i >= 0) act(() => pick(i));
	};
	const onMove = (e) => {
		if (e.pointerType !== "mouse") return;
		const i = nearest(e);
		camCanvas.style.cursor = i >= 0 && !busy ? "pointer" : "default";
		if (i !== view.hover) {
			view.hover = i;
			if (!seq) render();
		}
	};
	const onLeave = () => {
		down = null;
		if (view.hover !== -1) {
			view.hover = -1;
			if (!seq) render();
		}
	};
	camCanvas.addEventListener("pointerdown", onDown);
	camCanvas.addEventListener("pointerup", onUp);
	camCanvas.addEventListener("pointercancel", onLeave);
	camCanvas.addEventListener("pointermove", onMove);
	camCanvas.addEventListener("pointerleave", onLeave);

	const ro = new ResizeObserver(() => resize());
	ro.observe(camCanvas.parentElement);
	ctx.onMotionChange = (on) => {
		if (on) finish();
	};

	placeBunches();
	updateUi();
	resize();

	return {
		destroy() {
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
			seq = null;
			ro.disconnect();
			camCanvas.removeEventListener("pointerdown", onDown);
			camCanvas.removeEventListener("pointerup", onUp);
			camCanvas.removeEventListener("pointercancel", onLeave);
			camCanvas.removeEventListener("pointermove", onMove);
			camCanvas.removeEventListener("pointerleave", onLeave);
			ctx.onMotionChange = null;
			root.remove();
		},
		test: {
			/** Make sure the camera is out of calibration, recalibrate, and pick a bunch, through the UI controls. */
			solve() {
				finish();
				instantMode = true;
				try {
					// 1. The washdown knock normally does this; if the camera is in calibration, knock it.
					const away = (key, max) => {
						const inp = sliders[key];
						inp.value = String(bump[key] > 0 ? -max : max);
						inp.dispatchEvent(new Event("input", { bubbles: true }));
					};
					const miscal = () => missSinceCal || M.drift(cam, calib) > cfg.tol;
					if (!miscal()) away("tx", cfg.bumpMax.tilt);
					if (!miscal()) away("ty", cfg.bumpMax.tilt);
					if (!miscal()) away("yaw", cfg.bumpMax.yaw);
					if (!miscal()) away("dh", cfg.bumpMax.height);
					// 2. Recalibrate, then 3. pick bunches until one is a hit.
					for (let attempt = 0; attempt < 3 && !solvedFired; attempt++) {
						if (attempt > 0 && !lensBox.checked) {
							lensBox.checked = true;
							lensBox.dispatchEvent(new Event("change", { bubbles: true }));
						}
						if (!calib.fixes || attempt > 0) calBtn.click();
						if (!pickBtns.some((b) => !b.disabled && !b.hidden)) nextBtn.click();
						for (const b of pickBtns) {
							if (solvedFired) break;
							if (!b.disabled && !b.hidden) b.click();
						}
						if (!solvedFired) nextBtn.click();
					}
				} finally {
					instantMode = false;
				}
				return solvedFired;
			},
			state() {
				const p = pose();
				return {
					bump: { ...bump },
					cameraPose: { tiltXDeg: +p.tx.toFixed(3), tiltYDeg: +p.ty.toFixed(3), turnDeg: +p.yaw.toFixed(3), heightMm: +p.dh.toFixed(3) },
					calibration: {
						points: calib.poses.length,
						rmsMm: +calib.rms.toFixed(3),
						maxMm: +calib.max.toFixed(3),
						lens: calib.lens,
						afterMiscalibration: calib.fixes,
						turnDeg: +((calib.T.phi * 180) / Math.PI).toFixed(3),
						mmPerPx: +calib.T.sigma.toFixed(5),
						centerMm: calib.T.t.map((x) => +x.toFixed(2)),
					},
					driftMm: +M.drift(cam, calib).toFixed(3),
					offsetMm: (() => {
						const o = calibOffset();
						return { center: +o.center.toFixed(3), corners: +o.corners.toFixed(3) };
					})(),
					items: bunches.map((b, i) => ({ n: i + 1, visible: b.visible, picked: b.picked, px: [+b.det[0].toFixed(1), +b.det[1].toFixed(1)] })),
					imagePx: [cfg.W, cfg.H],
					last: last ? { hit: last.hit, errorMm: +last.err.toFixed(3) } : null,
					missSinceCalibration: missSinceCal,
					busy,
					solved,
				};
			},
		},
	};
}

export default { id: ID, mount };
