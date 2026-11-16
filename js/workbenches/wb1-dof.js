// Workbench wb1-dof, "Degrees of freedom": lean an apple slice against the grape bunch. The
// learner locks and unlocks the six joints of a six-axis arm (like the grape station's, here
// holding the slice on a vacuum cup) and turns the free ones with sliders. A readout, computed
// from the arm's Jacobian at the current pose, shows which pose components (x, y, z, roll, pitch,
// yaw) the free joints can change, and each component has jog buttons that move or turn the
// slice with the free joints (disabled where the free joints cannot change it). A "level" joint
// set makes the arm move like the apple station's 4-axis delta: J4 and J5 are driven so the cup
// always points straight down, leaving x, y, z and a turn about vertical. Solved when the slice
// matches the ghost target in position and angle within tolerance.
//
// Words on screen are UI chrome only; joint names, preset names, and every model number come
// from ctx.wb.data (knowledge/sim/workbenches.md), concept names from content.
//
// DATA SCHEMA (ctx.wb.data). Lengths in meters, angles in degrees. The cell frame has its
// origin at the center of the robot's mounting plate, x pointing from the robot toward the
// tray, y to the robot's left, z up.
//   note            string   provenance note ("Illustrative placeholder values." until sourced)
//   links_m         object   link lengths of a compact six-axis arm with a spherical wrist:
//     base          number   mounting plate to the shoulder axis (J2), m
//     upper_arm     number   shoulder axis (J2) to elbow axis (J3), m
//     forearm       number   elbow axis (J3) to the wrist center (where J4, J5, J6 axes meet), m
//     wrist         number   wrist center to the tool flange, m
//     tool          number   tool flange to the face of the vacuum cup, m
//   joints          array    exactly 6 entries, J1 (base) to J6 (flange). Each:
//     label         string   short joint name shown next to its slider (for example "J1 base")
//     min_deg       number   lower joint limit, degrees
//     max_deg       number   upper joint limit, degrees (greater than min_deg)
//     start_deg     number   angle at start and on Reset, degrees (within the limits)
//                            Angle convention: J2 = J3 = 0 puts the upper arm vertical and the
//                            forearm horizontal; J4 = J5 = J6 = 0 points the tool along the
//                            forearm; J2 + J3 + J5 = 90 with J4 = 0 points the tool straight down.
//   tray            object   the meal tray on the conveyor:
//     x_m, y_m      number   tray center in the cell frame, m
//     z_m           number   height of the tray floor relative to the mounting plate, m
//     length_m      number   tray size along x, m
//     width_m       number   tray size along y, m
//   slice           object   the apple slice (a half-moon):
//     radius_m      number   slice radius, m
//     thickness_m   number   slice thickness, m
//   grapes          object   radius_m: rough radius of the grape bunch, m
//   target          object   the leaning slice to reproduce (it stands on its cut edge):
//     x_m, y_m      number   midpoint of the cut edge on the tray floor, relative to the tray center, m
//     tilt_deg      number   angle between the slice and the tray floor (0 flat, 90 upright)
//     heading_deg   number   direction the slice leans toward (where the grapes are), degrees
//                            counterclockwise from +x seen from above. The cup holds the slice's
//                            face; with J4 = J6 = 0 its curved edge points away from the robot when
//                            the cup points down, so a lean straight away from the robot (heading
//                            toward the target's own azimuth) needs no J4 and is reachable with 5 axes
//   tolerance       object   solve condition:
//     position_mm   number   max distance of the slice's center from the target's, mm
//     angle_deg     number   max angle between the slice's orientation and the target's, degrees
//   start_unlocked  array    joint numbers (1-6) unlocked at start and on Reset
//   start_level     boolean  optional (default false): start (and Reset) in level mode, where J4 is
//                            held at 0 and J5 at 90 - J2 - J3 so the cup points straight down and
//                            the free joints give only x, y, z and a turn about vertical (how a
//                            4-axis delta moves). Then start_unlocked must not contain 4 or 5, and
//                            the start angles must satisfy J4 = 0 and J2 + J3 + J5 = 90 (within 0.5).
//   presets         array    optional quick joint sets:
//                            [{ label: string, unlocked: [joint numbers], level?: boolean }].
//                            Applying one locks the others and returns them to start_deg; level
//                            (default false) turns on level mode (then unlocked must not contain 4
//                            or 5; J5 follows J2 and J3, adjusted into its limits if needed).
// The target must be reachable with all six joints free (the module warns if it is not).

import { h, loadCss } from "../core/dom.js";
import { ISO, IsoRenderer } from "../engine/iso.js";
import { closeupFrame, drawCell, drawTriad, JOINT_COLORS, mainFrame, makeCamera } from "./wb1-draw.js";
import * as K from "./wb1-kin.js";

const DEG = Math.PI / 180;
const STEP = 0.5; // slider step, degrees
const NUDGE = 1; // +/- button step, degrees
const SVG_NS = "http://www.w3.org/2000/svg";

// ---------------------------------------------------------------------------
// Data validation: the path of the first missing or malformed field, or null.

function validate(d) {
	if (!d || typeof d !== "object") return "data";
	const num = (v) => typeof v === "number" && Number.isFinite(v);
	const pos = (v) => num(v) && v > 0;
	const checks = [];
	const need = (path, ok) => checks.push([path, ok]);
	for (const k of ["base", "upper_arm", "forearm", "wrist", "tool"]) need(`links_m.${k}`, pos(d.links_m?.[k]));
	need("joints", Array.isArray(d.joints) && d.joints.length === 6);
	if (Array.isArray(d.joints) && d.joints.length === 6)
		d.joints.forEach((j, i) => {
			need(`joints[${i}].label`, typeof j?.label === "string" && j.label.trim().length > 0);
			need(`joints[${i}].min_deg`, num(j?.min_deg));
			need(`joints[${i}].max_deg`, num(j?.max_deg) && j.max_deg > j.min_deg);
			need(`joints[${i}].start_deg`, num(j?.start_deg) && j.start_deg >= j.min_deg && j.start_deg <= j.max_deg);
		});
	for (const k of ["x_m", "y_m", "z_m"]) need(`tray.${k}`, num(d.tray?.[k]));
	for (const k of ["length_m", "width_m"]) need(`tray.${k}`, pos(d.tray?.[k]));
	for (const k of ["radius_m", "thickness_m"]) need(`slice.${k}`, pos(d.slice?.[k]));
	need("grapes.radius_m", pos(d.grapes?.radius_m));
	for (const k of ["x_m", "y_m", "heading_deg"]) need(`target.${k}`, num(d.target?.[k]));
	need("target.tilt_deg", num(d.target?.tilt_deg) && d.target.tilt_deg >= 0 && d.target.tilt_deg <= 90);
	for (const k of ["position_mm", "angle_deg"]) need(`tolerance.${k}`, pos(d.tolerance?.[k]));
	const jointList = (v) => Array.isArray(v) && v.every((n) => Number.isInteger(n) && n >= 1 && n <= 6);
	const noWrist = (v) => !v.includes(4) && !v.includes(5);
	need("start_level", d.start_level === undefined || typeof d.start_level === "boolean");
	need("start_unlocked", jointList(d.start_unlocked) && (d.start_level !== true || noWrist(d.start_unlocked)));
	if (d.start_level === true && Array.isArray(d.joints) && d.joints.length === 6 && d.joints.every((j) => num(j?.start_deg))) {
		const j = d.joints;
		need("joints[3].start_deg", j[3].start_deg === 0);
		need("joints[4].start_deg", Math.abs(j[1].start_deg + j[2].start_deg + j[4].start_deg - 90) <= 0.5);
	}
	if (d.presets !== undefined) {
		need("presets", Array.isArray(d.presets));
		if (Array.isArray(d.presets))
			d.presets.forEach((p, i) => {
				need(`presets[${i}].label`, typeof p?.label === "string" && p.label.trim().length > 0);
				need(`presets[${i}].level`, p?.level === undefined || typeof p.level === "boolean");
				need(`presets[${i}].unlocked`, jointList(p?.unlocked) && (p.level !== true || noWrist(p.unlocked)));
			});
	}
	for (const [path, ok] of checks) if (!ok) return path;
	return null;
}

// ---------------------------------------------------------------------------

function lockIcon(locked) {
	const svg = document.createElementNS(SVG_NS, "svg");
	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("aria-hidden", "true");
	svg.setAttribute("class", "wb1-lock-icon");
	const path = document.createElementNS(SVG_NS, "path");
	path.setAttribute("d", locked ? "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" : "M7 11V8a5 5 0 0 1 9.6-2M5 11h14v10H5z");
	svg.append(path);
	return svg;
}

function levelIcon() {
	const svg = document.createElementNS(SVG_NS, "svg");
	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("aria-hidden", "true");
	svg.setAttribute("class", "wb1-lock-icon");
	const path = document.createElementNS(SVG_NS, "path");
	path.setAttribute("d", "M3 9h18v6H3zM10 9v6M14 9v6");
	svg.append(path);
	return svg;
}

function arrowIcon(dir) {
	const svg = document.createElementNS(SVG_NS, "svg");
	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("aria-hidden", "true");
	svg.setAttribute("class", "wb1-arrow-icon");
	const path = document.createElementNS(SVG_NS, "path");
	path.setAttribute("d", dir < 0 ? "M19 12a7 7 0 1 1-2.05-4.95M19 4v4h-4" : "M5 12a7 7 0 1 0 2.05-4.95M5 4v4h4");
	svg.append(path);
	return svg;
}

const STATUS_WORD = { free: "yes", tied: "tied", stuck: "no" };
const JOG_MM = 10; // jog step along x, y, z, millimeters
const JOG_DEG = 5; // jog step about x, y, z, degrees
const WRIST = [3, 4]; // J4, J5: driven in level mode
const fmtDeg = (rad) => `${(Math.round((rad / DEG) * 10) / 10).toFixed(1)}°`;

let uid = 0;

export default {
	id: "wb1-dof",

	mount(el, ctx) {
		const id = `wb1-${++uid}`;
		const data = ctx.wb?.data;
		const bad = validate(data);
		if (bad) {
			const msg = h("div", { class: "wb-missing", "data-wb1-error": bad }, `Workbench data missing: ${bad}`);
			el.append(msg);
			return {
				destroy() {
					msg.remove();
				},
				test: { solve: () => false, state: () => ({ error: bad }) },
			};
		}

		const model = K.makeModel(data);
		const N = 6;
		const startQ = model.joints.map((j) => j.start);
		const startLocked = Array.from({ length: N }, (_, i) => !data.start_unlocked.includes(i + 1));
		const startLevel = data.start_level === true;
		const presets = data.presets ?? [];
		const levelLink = K.levelLink(model);
		const j5 = model.joints[4];
		const dofTitle = ctx.content?.concepts?.dof?.title ?? "";
		// Solved on an earlier visit: the badge shows it, as in the other workbenches.
		let prevSolved = false;
		try {
			prevSolved = !!ctx.state?.workbench?.("wb1-dof")?.solved;
		} catch {
			prevSolved = false;
		}

		const st = {
			q: startQ.slice(),
			locked: startLocked.slice(),
			level: startLevel, // J4 and J5 driven so the cup points straight down
			anim: null, // { from, to, t0, dur }
			yaw: -1.05, // view angle: the arm from the side, the leaning slice's face toward the viewer
			active: -1,
			solved: false,
			inTol: false,
			visible: true,
			pose: null,
			err: null,
			info: null,
		};
		let destroyed = false;
		let raf = 0;
		const cleanups = [];
		const on = (target, type, fn, opts) => {
			target.addEventListener(type, fn, opts);
			cleanups.push(() => target.removeEventListener(type, fn, opts));
		};
		const reduced = () => !!ctx.reducedMotion;

		// --- DOM -----------------------------------------------------------------
		const root = h("div", { class: "wb1", "data-wb1": "" });
		root.style.visibility = "hidden";
		const mainCanvas = h("canvas", { class: "wb1-main", role: "img", "aria-label": "Arm, tray, and target view" });
		const insetCanvas = h("canvas", { class: "wb1-inset-canvas", "aria-hidden": "true" });
		const insetBtn = h("button", { type: "button", class: "wb1-inset-cap", "aria-expanded": "true" }, "Close-up");
		const inset = h("div", { class: "wb1-inset" }, insetCanvas, insetBtn);
		let insetCollapsed = false;
		// Turning the view left spins the scene counterclockwise seen from above, so that button
		// carries the counterclockwise arrow (arrowIcon(1)) and sits on the left.
		const turnLeft = h("button", { type: "button", class: "wb1-view-btn", "aria-label": "Turn view left" }, arrowIcon(1));
		const turnRight = h("button", { type: "button", class: "wb1-view-btn", "aria-label": "Turn view right" }, arrowIcon(-1));
		const solvedBadge = h("div", { class: "wb1-solved", hidden: true, "data-wb1-solved": "" }, "Solved");
		const stage = h("div", { class: "wb1-stage inset-left" }, mainCanvas, inset, h("div", { class: "wb1-view-btns" }, turnLeft, turnRight), solvedBadge);

		const meter = (name, unit) => {
			const fill = h("span", { class: "wb1-bar-fill" });
			const val = h("span", { class: "wb1-meter-val" });
			const goal = h("span", { class: "wb1-meter-goal" });
			const row = h("div", { class: "wb1-meter" }, h("span", { class: "wb1-meter-name" }, name), h("span", { class: "wb1-bar", "aria-hidden": "true" }, fill), val, goal);
			return { row, fill, val, goal, unit };
		};
		const mPos = meter("Position", "mm");
		const mAng = meter("Angle", "°");
		mPos.goal.textContent = `goal ≤ ${data.tolerance.position_mm} mm`;
		mAng.goal.textContent = `goal ≤ ${data.tolerance.angle_deg}°`;
		const meters = h("div", { class: "wb1-meters" }, mPos.row, mAng.row);

		const chip = (name, k) => {
			const word = h("span", { class: "wb1-chip-word" });
			const kind = k < 3 ? "move" : "turn";
			const axis = k % 3;
			const step = kind === "move" ? `${JOG_MM} mm` : `${JOG_DEG} degrees`;
			const verb = kind === "move" ? "Move along" : "Turn about";
			const btns = [-1, 1].map((sign) => {
				const b = h("button", { type: "button", class: "wb1-jog-btn", "data-jog": `${name}${sign < 0 ? "-" : "+"}`, "aria-label": `${verb} ${name}, ${sign < 0 ? "minus" : "plus"} ${step}` }, sign < 0 ? "−" : "+");
				holdRepeat(b, () => jogOnce(kind, axis, sign));
				return b;
			});
			const li = h(
				"li",
				{ class: "wb1-chip", "data-component": name },
				h("span", { class: "wb1-chip-top" }, h("span", { class: "wb1-chip-name" }, name), word),
				h("span", { class: "wb1-jog", role: "group", "aria-label": `${verb} ${name}` }, ...btns),
			);
			return { li, word, btns };
		};
		const chips = {};
		K.COMPONENTS.forEach((c, k) => {
			chips[c] = chip(c, k);
		});
		const note = h("p", { class: "wb1-note", "aria-live": "polite", "data-wb1-note": "" });
		const rankVal = h("span", { class: "wb1-rank-val" });
		const freeVal = h("span", { class: "wb1-free-val" });
		const readout = h(
			"section",
			{ class: "wb1-readout", "aria-label": "What the unlocked joints can change" },
			h(
				"div",
				{ class: "wb1-readout-head" },
				h("span", { class: "wb1-kicker" }, dofTitle || "Free joints"),
				h("span", { class: "wb1-counts" }, freeVal, rankVal),
			),
			h(
				"div",
				{ class: "wb1-groups" },
				h("div", { class: "wb1-group" }, h("span", { class: "wb1-group-name" }, "Move"), h("ul", { class: "wb1-chips" }, chips.x.li, chips.y.li, chips.z.li)),
				h("div", { class: "wb1-group" }, h("span", { class: "wb1-group-name" }, "Turn in place"), h("ul", { class: "wb1-chips" }, chips.roll.li, chips.pitch.li, chips.yaw.li)),
			),
			h(
				"p",
				{ class: "wb1-legend" },
				h("span", { class: "wb1-legend-item" }, h("span", { class: "wb1-dot", "data-status": "free" }), "yes: on its own"),
				h("span", { class: "wb1-legend-item" }, h("span", { class: "wb1-dot", "data-status": "tied" }), "tied: only with other changes"),
				h("span", { class: "wb1-legend-item" }, h("span", { class: "wb1-dot", "data-status": "stuck" }), "no: not at all"),
			),
			note,
		);

		const presetBtns = presets.map((p) => h("button", { type: "button", class: "wb1-preset", "aria-pressed": "false", onclick: () => applyPreset(p) }, p.label));
		const resetBtn = h("button", { type: "button", class: "wb1-preset wb1-reset", onclick: () => reset() }, "Reset");
		const presetRow = h("div", { class: "wb1-presets", role: "group", "aria-label": "Joint sets" }, ...presetBtns, resetBtn);

		const rows = model.joints.map((j, i) => {
			const sid = `${id}-j${i}`;
			const lid = `${sid}-label`;
			const val = h("output", { class: "wb1-jval", for: sid });
			const lockBtn = h("button", { type: "button", class: "wb1-lock", "aria-pressed": "false", "aria-describedby": lid });
			const lockText = h("span", { class: "wb1-lock-text" });
			const slider = h("input", {
				type: "range",
				id: sid,
				class: "wb1-slider",
				min: String(data.joints[i].min_deg),
				max: String(data.joints[i].max_deg),
				step: String(STEP),
				value: String(data.joints[i].start_deg),
			});
			const minus = h("button", { type: "button", class: "wb1-nudge", "aria-label": `${j.label} minus ${NUDGE} degree` }, "−");
			const plus = h("button", { type: "button", class: "wb1-nudge", "aria-label": `${j.label} plus ${NUDGE} degree` }, "+");
			const row = h(
				"div",
				{ class: "wb1-joint", "data-joint": String(i + 1) },
				h(
					"div",
					{ class: "wb1-jhead" },
					h("span", { class: "wb1-swatch", "aria-hidden": "true" }, String(i + 1)),
					h("label", { class: "wb1-jlabel", for: sid, id: lid }, j.label),
					val,
					lockBtn,
				),
				h("div", { class: "wb1-jslide" }, minus, slider, plus),
			);
			on(slider, "input", () => setJoint(i, Number(slider.value) * DEG));
			on(minus, "click", () => setJoint(i, st.q[i] - NUDGE * DEG));
			on(plus, "click", () => setJoint(i, st.q[i] + NUDGE * DEG));
			on(lockBtn, "click", () => toggleLock(i));
			for (const t of [slider, minus, plus]) {
				on(t, "focus", () => setActive(i));
				on(t, "blur", () => setActive(-1));
			}
			on(row, "pointerenter", () => setActive(i));
			on(row, "pointerleave", () => {
				if (!row.contains(document.activeElement)) setActive(-1);
			});
			row.style.setProperty("--wb1-joint", JOINT_COLORS[i]);
			const lockWrap = h("span", { class: "wb1-lock-wrap" });
			lockBtn.append(lockWrap, lockText);
			return { row, slider, val, lockBtn, lockText, lockWrap, minus, plus };
		});
		const jointsBox = h("div", { class: "wb1-joints" }, ...rows.map((r) => r.row));
		const live = h("div", { class: "sr-only", "aria-live": "polite" });
		const warn = h("p", { class: "wb1-warn", hidden: true, "data-wb1-warning": "" });

		// The view and the meters stay in sight (sticky) while the controls below scroll.
		const top = h("div", { class: "wb1-top" }, stage, meters);
		root.append(top, readout, presetRow, jointsBox, warn, live);
		el.append(root);
		loadCss("css/modules/wb1-dof.css").then(() => {
			if (destroyed) return;
			root.style.visibility = "";
			resize();
		});

		// --- State changes -------------------------------------------------------
		const clampJ = (i, v) => Math.max(model.joints[i].min, Math.min(model.joints[i].max, v));

		function settleAnim() {
			if (!st.anim) return;
			st.q = st.anim.to.slice();
			st.anim = null;
		}

		// Level mode: the J5 angle that keeps the cup pointing down, before clamping to its limits.
		const levelJ5 = (q) => Math.PI / 2 - q[1] - q[2];
		const levelOk = (q) => levelJ5(q) >= j5.min - 1e-9 && levelJ5(q) <= j5.max + 1e-9;

		/** Joint angles for level mode: J3 (then J2) moved just enough that J5 stays in its limits. */
		function levelize(q) {
			const out = q.slice();
			for (const i of [2, 1]) {
				const need = levelJ5(out);
				const ok = Math.max(j5.min, Math.min(j5.max, need));
				if (need !== ok) out[i] = clampJ(i, out[i] + (need - ok));
			}
			return levelLink(out);
		}

		function setJoint(i, v) {
			if (st.locked[i]) return;
			settleAnim();
			let val = clampJ(i, Math.round(v / DEG / STEP) * STEP * DEG);
			if (st.level && (i === 1 || i === 2)) {
				// J2 and J3 stop where J5 could no longer keep the cup level.
				const other = st.q[i === 1 ? 2 : 1];
				val = clampJ(i, Math.max(Math.PI / 2 - other - j5.max, Math.min(Math.PI / 2 - other - j5.min, val)));
			}
			st.q[i] = val;
			if (st.level) st.q = levelLink(st.q);
			update();
		}

		function toggleLock(i) {
			settleAnim();
			if (st.level && WRIST.includes(i)) {
				// Taking a driven wrist joint ends level mode; the other one stays locked where it is.
				st.level = false;
				st.locked[i] = false;
			} else st.locked[i] = !st.locked[i];
			update();
		}

		let noteTimer = 0;
		function setNote(text) {
			clearTimeout(noteTimer);
			note.textContent = text;
			if (text) noteTimer = setTimeout(() => (note.textContent = ""), 2600);
		}
		cleanups.push(() => clearTimeout(noteTimer));

		/** One jog step with the free joints; returns true if the slice moved. */
		function jogOnce(kind, axis, sign) {
			if (!st.free.length) return false;
			settleAnim();
			const amount = kind === "move" ? (sign * JOG_MM) / 1000 : sign * JOG_DEG * DEG;
			const r = K.jog(model, st.q, st.free, kind, axis, amount, st.level ? levelLink : undefined);
			const atLimit = (q) => st.free.some((i) => q[i] <= model.joints[i].min + 1e-6 || q[i] >= model.joints[i].max - 1e-6);
			if (st.level && !levelOk(r.q)) {
				setNote("Joint limit reached.");
				return false;
			}
			const moved = Math.abs(r.along) > Math.abs(amount) * 0.05;
			if (moved) st.q = r.q;
			setNote(Math.abs(r.along) < Math.abs(amount) * 0.5 && atLimit(r.q) ? "Joint limit reached." : "");
			update();
			return moved;
		}

		// Tap or click: one step on release. Press and hold: repeats. Keyboard: one step per press.
		// A touch that turns into a page scroll is cancelled and moves nothing.
		function holdRepeat(btn, fn) {
			let timer = 0;
			let repeated = false;
			let down = false;
			const stop = () => {
				clearTimeout(timer);
				timer = 0;
				down = false;
			};
			on(btn, "pointerdown", (e) => {
				if (e.button !== 0 || btn.disabled) return;
				down = true;
				repeated = false;
				const loop = (delay) => {
					timer = setTimeout(() => {
						if (btn.disabled || !down) return stop();
						repeated = true;
						fn();
						loop(70);
					}, delay);
				};
				loop(420);
			});
			on(btn, "pointerup", () => {
				if (down && !repeated && !btn.disabled) fn();
				stop();
			});
			on(btn, "pointercancel", stop);
			on(btn, "pointerleave", stop);
			on(btn, "click", (e) => {
				if (e.detail === 0) fn();
			});
			cleanups.push(stop);
		}

		function moveTo(target) {
			const to = target.map((v, i) => clampJ(i, v));
			if (reduced() || to.every((v, i) => Math.abs(v - st.q[i]) < 1e-9)) {
				st.anim = null;
				st.q = to;
			} else {
				settleAnim();
				st.anim = { from: st.q.slice(), to, t0: performance.now(), dur: 650 };
			}
			update();
		}

		function applyPreset(p) {
			const free = new Set(p.unlocked.map((n) => n - 1));
			st.locked = st.locked.map((_, i) => !free.has(i));
			st.level = p.level === true;
			// Locked joints return to their start angle, so each set behaves like that robot.
			const base = st.anim ? st.anim.to : st.q;
			const to = base.map((v, i) => (free.has(i) ? v : startQ[i]));
			moveTo(st.level ? levelize(to) : to);
		}

		function reset() {
			st.locked = startLocked.slice();
			st.level = startLevel;
			moveTo(startQ);
		}

		function setActive(i) {
			if (st.active === i) return;
			st.active = i;
			requestDraw();
		}

		function compute() {
			st.pose = K.fk(model, st.q);
			st.err = K.poseError(model, st.pose);
			st.inTol = st.err.pos <= model.tol.pos && st.err.ang <= model.tol.ang;
			const free = [];
			for (let i = 0; i < N; i++) if (!st.locked[i]) free.push(i);
			st.info = K.analyze(model, st.q, free, st.level ? levelLink : undefined);
			st.free = free;
		}

		function renderUI() {
			const { err, info } = st;
			const posMm = err.pos * 1000;
			const angDeg = err.ang / DEG;
			mPos.val.textContent = `${posMm < 100 ? posMm.toFixed(1) : Math.round(posMm)} mm`;
			mAng.val.textContent = `${angDeg.toFixed(1)}°`;
			const closeness = (e, tol) => Math.max(0, Math.min(1, 1 - Math.log10(Math.max(1, e / tol)) / 1.6));
			mPos.fill.style.width = `${(closeness(err.pos, model.tol.pos) * 100).toFixed(1)}%`;
			mAng.fill.style.width = `${(closeness(err.ang, model.tol.ang) * 100).toFixed(1)}%`;
			mPos.row.dataset.ok = String(err.pos <= model.tol.pos);
			mAng.row.dataset.ok = String(err.ang <= model.tol.ang);
			K.COMPONENTS.forEach((c, k) => {
				const status = k < 3 ? info.move[c] : info.turn[c];
				chips[c].li.dataset.status = status;
				chips[c].word.textContent = STATUS_WORD[status];
				for (const b of chips[c].btns) b.disabled = status === "stuck";
			});
			freeVal.textContent = `Unlocked joints: ${st.free.length}`;
			rankVal.textContent = `Independent directions: ${info.rank} of 6`;
			rows.forEach((r, i) => {
				const locked = st.locked[i];
				const driven = st.level && WRIST.includes(i);
				r.row.dataset.locked = String(locked);
				r.row.dataset.level = String(driven);
				r.slider.disabled = locked;
				r.minus.disabled = locked;
				r.plus.disabled = locked;
				const deg = Math.round((st.q[i] / DEG) * 10) / 10;
				if (Number(r.slider.value) !== deg) r.slider.value = String(deg);
				const lo = data.joints[i].min_deg;
				const hi = data.joints[i].max_deg;
				r.slider.style.setProperty("--fill", `${(((deg - lo) / (hi - lo)) * 100).toFixed(1)}%`);
				r.slider.setAttribute("aria-valuetext", `${deg} degrees${driven ? ", keeping the cup level" : locked ? ", locked" : ""}`);
				r.val.textContent = fmtDeg(st.q[i]);
				const mode = driven ? "level" : locked ? "locked" : "free";
				if (r.lockBtn.dataset.mode !== mode) {
					r.lockBtn.dataset.mode = mode;
					r.lockBtn.setAttribute("aria-pressed", String(locked));
					r.lockBtn.setAttribute("aria-label", driven ? `Unlock ${model.joints[i].label}, now turning by itself to keep the cup level` : `${locked ? "Unlock" : "Lock"} ${model.joints[i].label}`);
					r.lockText.textContent = driven ? "Level" : locked ? "Locked" : "Free";
					r.lockWrap.replaceChildren(driven ? levelIcon() : lockIcon(locked));
				}
			});
			const target = st.anim ? st.anim.to : st.q;
			presets.forEach((p, k) => {
				const free = new Set(p.unlocked.map((n) => n - 1));
				const level = p.level === true;
				const match =
					st.level === level &&
					st.locked.every((l, i) => l === !free.has(i)) &&
					target.every((v, i) => free.has(i) || (level && WRIST.includes(i)) || Math.abs(v - startQ[i]) < 1e-6);
				presetBtns[k].setAttribute("aria-pressed", String(match));
			});
			root.classList.toggle("wb1-rm", reduced());
			root.dataset.solved = String(st.solved || prevSolved);
			solvedBadge.hidden = !(st.solved || prevSolved);
		}

		let lastTol = false;
		function checkSolved() {
			if (st.inTol !== lastTol) {
				lastTol = st.inTol;
				if (st.inTol && st.solved) live.textContent = "On target.";
			}
			if (st.inTol && !st.solved) {
				st.solved = true;
				live.textContent = "Solved. The slice matches the target.";
				ctx.onSolved?.();
			}
		}

		function update() {
			compute();
			checkSolved();
			renderUI();
			requestDraw();
		}

		// --- Drawing -------------------------------------------------------------
		const mainR = new IsoRenderer(mainCanvas.getContext("2d"));
		const insetR = new IsoRenderer(insetCanvas.getContext("2d"));
		// Frame the main view on the cell plus the arm at its start pose and at a solving pose.
		const check = K.solveIK(model, startQ, [0, 1, 2, 3, 4, 5]);
		const armPts = (q) => {
			const p = K.fk(model, q);
			return [K.add(p.E, [0, 0, 0.08]), p.W, p.tip];
		};
		const mainFr = mainFrame(model, [...armPts(startQ), ...armPts(check.q)]);
		const insetFr = closeupFrame(model);
		let sizes = { mw: 0, mh: 0, iw: 0, ih: 0 };

		function sizeCanvas(canvas, w, h) {
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			const W = Math.max(1, Math.round(w * dpr));
			const H = Math.max(1, Math.round(h * dpr));
			if (canvas.width !== W) canvas.width = W;
			if (canvas.height !== H) canvas.height = H;
			return dpr;
		}

		function resize() {
			const mw = mainCanvas.clientWidth;
			const mh = mainCanvas.clientHeight;
			const iw = insetCanvas.clientWidth;
			const ih = insetCanvas.clientHeight;
			sizes = { mw, mh, iw, ih };
			// Focused controls scroll clear of the sticky view and meters.
			root.style.setProperty("--wb1-stage-h", `${top.offsetHeight}px`);
			requestDraw();
		}

		function paint(canvas, r, w, h, cam, opts) {
			if (w < 2 || h < 2) return;
			const dpr = sizeCanvas(canvas, w, h);
			const c2 = r.ctx;
			c2.setTransform(dpr, 0, 0, dpr, 0, 0);
			c2.clearRect(0, 0, w, h);
			const g = c2.createLinearGradient(0, 0, 0, h);
			g.addColorStop(0, opts.bg[0]);
			g.addColorStop(1, opts.bg[1]);
			c2.fillStyle = g;
			c2.fillRect(0, 0, w, h);
			drawCell(r, cam, model, {
				pose: st.pose,
				locked: st.locked,
				driven: st.locked.map((_, i) => st.level && WRIST.includes(i)),
				active: opts.inset ? -1 : st.active,
				ghostAlpha: opts.ghostAlpha,
				inTol: st.inTol,
				badges: !opts.inset && w >= 460,
			});
			if (!opts.inset) drawTriad(c2, cam, w);
		}

		// Put the close-up in the bottom corner that hides fewer of the parts that matter.
		const tray = model.tray;
		const trayCorners = [-1, 1].flatMap((a) => [-1, 1].map((b) => [tray.x_m + (a * tray.length_m) / 2, tray.y_m + (b * tray.width_m) / 2, tray.z_m]));
		function placeInset(cam) {
			if (insetCollapsed || sizes.iw < 2) return;
			const toS = (p) => {
				const q = cam.view(p);
				return [(q[0] - q[1]) * ISO.X * cam.zoom + cam.ox, ((q[0] + q[1]) * ISO.Y - q[2] * ISO.Z) * cam.zoom + cam.oy];
			};
			const p = st.pose;
			const pts = [p.S, p.E, p.W, p.F, p.tip, p.tip, p.slice.grip, model.target.grip, model.target.grip, ...trayCorners].map(toS);
			const w = sizes.iw + 16;
			const top = sizes.mh - sizes.ih - 16;
			const count = (x0) => pts.filter(([x, y]) => x >= x0 && x <= x0 + w && y >= top).length;
			const nl = count(0);
			const nr = count(sizes.mw - w);
			const left = nl === nr ? stage.classList.contains("inset-left") : nl < nr;
			if (stage.classList.contains("inset-left") !== left) stage.classList.toggle("inset-left", left);
		}

		function draw(now) {
			raf = 0;
			if (destroyed) return;
			let busy = false;
			if (st.anim) {
				const k = Math.min(1, (now - st.anim.t0) / st.anim.dur);
				const e = k * k * (3 - 2 * k);
				st.q = st.anim.from.map((a, i) => a + (st.anim.to[i] - a) * e);
				if (k >= 1) {
					st.q = st.anim.to.slice();
					st.anim = null;
				} else busy = true;
				compute();
				checkSolved();
				renderUI();
			}
			const pulse = !reduced() && st.visible;
			// The idle ghost pulse repaints at about 20 frames a second; real changes paint at once.
			if (!busy && !dirty && pulse && now - lastPaint < 48) {
				raf = requestAnimationFrame(draw);
				return;
			}
			dirty = false;
			lastPaint = now;
			const ghostAlpha = pulse ? 0.5 + 0.14 * Math.sin(now / 420) : 0.55;
			if (sizes.mw > 1) {
				const cam = makeCamera(mainFr, sizes.mw, sizes.mh, st.yaw);
				// On wide stages, slide the scene away from the close-up when there is room.
				if (!insetCollapsed) {
					const room = Math.max(0, (sizes.mw - mainFr.span[0] * cam.zoom) / 2);
					cam.ox += Math.min(room * 0.7, sizes.iw * 0.45) * (stage.classList.contains("inset-left") ? 1 : -1);
				}
				placeInset(cam);
				paint(mainCanvas, mainR, sizes.mw, sizes.mh, cam, { bg: ["#eaf3f7", "#d9e6ed"], ghostAlpha });
			}
			if (sizes.iw > 1) {
				const cam = makeCamera(insetFr, sizes.iw, sizes.ih, st.yaw, 1);
				paint(insetCanvas, insetR, sizes.iw, sizes.ih, cam, { bg: ["#f6f1e4", "#ebe2cd"], ghostAlpha, inset: true });
			}
			if ((busy || pulse) && st.visible) raf = requestAnimationFrame(draw);
		}

		let dirty = true;
		let lastPaint = 0;
		function requestDraw() {
			dirty = true;
			if (!raf && !destroyed) raf = requestAnimationFrame(draw);
		}

		// --- View rotation: horizontal drag on the view, or the two buttons. ---
		let drag = null;
		on(mainCanvas, "pointerdown", (e) => {
			if (e.button !== 0) return;
			drag = { id: e.pointerId, x: e.clientX, yaw: st.yaw };
			try {
				mainCanvas.setPointerCapture(e.pointerId);
			} catch {
				// Synthetic or already-released pointers cannot be captured; dragging still works.
			}
			mainCanvas.classList.add("dragging");
		});
		on(mainCanvas, "pointermove", (e) => {
			if (!drag || e.pointerId !== drag.id) return;
			// The near side of the scene follows the pointer, like turning a turntable by its front edge.
			st.yaw = drag.yaw - (e.clientX - drag.x) * 0.012;
			requestDraw();
		});
		const endDrag = (e) => {
			if (!drag || e.pointerId !== drag.id) return;
			drag = null;
			mainCanvas.classList.remove("dragging");
		};
		on(mainCanvas, "pointerup", endDrag);
		on(mainCanvas, "pointercancel", endDrag);
		const turn = (dir) => {
			st.yaw += dir * (Math.PI / 8);
			requestDraw();
		};
		on(insetBtn, "click", () => {
			insetCollapsed = !insetCollapsed;
			inset.classList.toggle("collapsed", insetCollapsed);
			insetBtn.setAttribute("aria-expanded", String(!insetCollapsed));
			resize();
		});
		on(turnLeft, "click", () => turn(-1));
		on(turnRight, "click", () => turn(1));

		const ro = new ResizeObserver(() => resize());
		ro.observe(stage);
		ro.observe(top);
		const io = new IntersectionObserver((entries) => {
			st.visible = entries.some((en) => en.isIntersecting);
			if (st.visible) requestDraw();
		});
		io.observe(stage);

		ctx.onMotionChange = () => {
			if (reduced()) settleAnim();
			update();
		};

		update();
		resize();

		// The target must be reachable with every joint free; say so if the data makes it impossible.
		if (!(check.err.pos <= model.tol.pos && check.err.ang <= model.tol.ang)) {
			warn.hidden = false;
			warn.textContent = "Workbench data: the target is out of the arm's reach.";
		}

		return {
			destroy() {
				destroyed = true;
				if (raf) cancelAnimationFrame(raf);
				raf = 0;
				ro.disconnect();
				io.disconnect();
				for (const fn of cleanups) fn();
				if (ctx.onMotionChange) ctx.onMotionChange = null;
				root.remove();
			},
			test: {
				/** Unlock every joint and set the sliders to a solving pose, as a learner would. */
				solve() {
					rows.forEach((r, i) => {
						if (st.locked[i]) r.lockBtn.click();
					});
					settleAnim();
					const sol = K.solveIK(model, st.q, [0, 1, 2, 3, 4, 5]);
					rows.forEach((r, i) => {
						r.slider.value = String(Math.round(sol.q[i] / DEG / STEP) * STEP);
						r.slider.dispatchEvent(new Event("input", { bubbles: true }));
					});
					return st.solved;
				},
				/**
				 * Press one jog button once, as a learner would: component is x, y, z, roll, pitch, or
				 * yaw, sign -1 or 1. Returns false if the button is disabled or nothing moved.
				 */
				jog(component, sign) {
					const b = chips[component]?.btns[sign < 0 ? 0 : 1];
					if (!b || b.disabled) return false;
					const before = st.q.slice();
					b.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 }));
					return st.q.some((v, i) => Math.abs(v - before[i]) > 1e-9);
				},
				state() {
					return {
						level: st.level,
						unlocked: st.free.map((i) => i + 1),
						angles_deg: st.q.map((v) => Math.round((v / DEG) * 10) / 10),
						position_error_mm: Math.round(st.err.pos * 10000) / 10,
						angle_error_deg: Math.round((st.err.ang / DEG) * 10) / 10,
						in_tolerance: st.inTol,
						rank: st.info.rank,
						move: { ...st.info.move },
						turn: { ...st.info.turn },
						jog_disabled: K.COMPONENTS.filter((c) => chips[c].btns[0].disabled),
						solved: st.solved,
						view_deg: Math.round((st.yaw / DEG) * 10) / 10,
					};
				},
			},
		};
	},
};
