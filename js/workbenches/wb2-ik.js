// Workbench wb2-ik, inverse kinematics (booth at ride 2, stop joint-targets).
//
// The grape station's six-axis arm seen from the side: soft fingers over a tote of grape bunches,
// with the tray belt running past between the arm and the tote. Only the three joints that swing
// in this vertical plane move (shoulder, elbow, wrist bend); the base and the two wrist rotations
// stay at zero. The learner drags the finger-tip target and tilts the fingers; analytic inverse
// kinematics finds both arm postures that put the finger tips there at that tilt. Both are drawn
// at once: solid for the one the robot uses, a dashed outline for the other, with the reachable
// ring for the current tilt, joint limits, and all six joint angles. Each bunch has a grasp pose
// (a point plus a tilt); one of them is out of reach at its tilt although it lies inside the ring
// for straight-down fingers. Drawing code and UI chrome only: joint and posture names and every
// number come from ctx.wb.data; the table caption is the stop title.

/*
DATA SCHEMA (ctx.wb.data: the Data JSON of "## Workbench: wb2-ik" in knowledge/sim/workbenches.md)

The arm moves in one vertical plane, drawn from the side with the robot facing right. Positions
are millimeters in that plane, measured from the shoulder joint axis: x forward (toward the tote),
z up. Angles are degrees, counterclockwise positive in that view. A tilt is the tool's angle from
pointing straight down: 0 = fingers straight down, positive = finger tips swung forward (away from
the robot), negative = finger tips swung back toward the robot.

  note                string, optional. Says which values come from which concept and which are
                      illustrative.
  upper_arm_mm        number > 0. Upper arm length: shoulder axis to elbow axis.
  forearm_mm          number > 0. Forearm length: elbow axis to wrist axis.
  tool_mm             number >= 0. Wrist axis to the soft fingers' tips (drawn as wrist to flange
                      for the first half, fingers for the second).
  shoulder_height_mm  number > 0. Height of the shoulder axis above the work surface (the tray belt
                      top and the tote floor). The finger tips cannot go below that surface.
  tray_x_mm           number. Forward distance from the shoulder axis to where the tray belt
                      crosses the arm plane (center of the tray waiting there).
  tote                { "near_x_mm": number, "far_x_mm": number (> near), "wall_mm": number > 0 }:
                      where the arm plane meets the tote's near and far walls (inner faces), and
                      the wall height above the tote floor.
  tilt_max_deg        number, 0 < value < 90. The Tilt slider runs from -tilt_max_deg to +tilt_max_deg.
  start_target_mm     [x, z], two numbers. Where the finger-tip target starts (tilt 0), for example a
                      hover point where both postures are within the joint limits.
  bunches             array of 1-6 objects { "x_mm", "z_mm", "tilt_deg" }: each bunch's grasp pose
                      (finger-tip point and tilt, |tilt_deg| <= tilt_max_deg, z_mm >= -shoulder_height_mm).
                      The workbench works out which ones some posture can reach; the learner must grasp
                      every reachable one and visit every unreachable one.
  joints              array of exactly 6 objects in axis order 1-6, each { "name": string }. Axes 2, 3
                      and 5 (shoulder, elbow, wrist bend; indices 1, 2 and 4) move in this view and
                      also need "min_deg" and "max_deg" (min < max), their joint limits. Axes 1, 4
                      and 6 are held at 0. Zero points: shoulder 0 = upper arm pointing straight
                      forward; elbow 0 = forearm in line with the upper arm; wrist bend 0 = tool in
                      line with the forearm.
  solutions           array of exactly 2 strings, the labels of the two postures. First: elbow bent
                      clockwise in this view (the elbow sits above the shoulder-to-wrist line when
                      the target is in front of the robot). Second: elbow bent counterclockwise.
*/

import { h, loadCss } from "../core/dom.js";
import { IsoRenderer } from "../engine/iso.js";
import { cellLayout, drawArm, drawCellBack, drawCellFront, planeMap } from "./wb2-ik-draw.js";
import { clamp, DEG, fk, PLANE_JOINTS, readData, solveIK, toolDir } from "./wb2-ik-model.js";

const ID = "wb2-ik";
const KEY_STEP = 10; // mm per arrow key press (Shift: x5)
const MOVE_MS = 450;
const SNAP_PX = { mouse: 26, touch: 36 };
const KEY_SNAP_MM = 6;

const RGB_REACH = "61,127,209";
const RGB_BAD = "224,80,63";
const C_TARGET = "#ef8a17";
const C_GRASP = "#7a3f98";
const C_GOOD = "#1d7a4b";
const C_BADGE_BAD = "#c2412f";

let seq = 0;

const fmtDeg = (v) => `${v < -0.05 ? "−" : ""}${Math.abs(v).toFixed(1)}°`;
const fmtMm = (v) => `${Math.round(v) < 0 ? "−" : ""}${Math.abs(Math.round(v))}`;
const fmtTilt = (v) => `${Math.round(v) < 0 ? "−" : ""}${Math.abs(Math.round(v))}°`;
const ease = (k) => k * k * (3 - 2 * k);

function mount(el, ctx) {
	const parsed = readData(ctx.wb?.data);
	if (parsed.error) {
		el.append(h("div", { class: "wb-missing", "data-wb2ik-error": parsed.error }, `Workbench data missing: ${parsed.error}`));
		return { destroy() {}, test: { solve: () => false, state: () => ({ error: parsed.error }) } };
	}
	const m = parsed.model;
	const L = cellLayout(m);
	const uid = `wb2ik-${++seq}`;
	const cssReady = loadCss("css/modules/wb2-ik.css");
	const prevSolved = !!ctx.state?.workbench?.(ID)?.solved;
	// Which grasp poses some posture can reach within the limits (worked out from the data).
	const canReach = m.bunches.map((b) => solveIK(m, b.x, b.z, b.tilt).usable);
	const nReach = canReach.filter(Boolean).length;
	const nFar = m.bunches.length - nReach;

	const st = {
		target: [...m.start],
		tilt: 0,
		sol: 0,
		on: -1, // index of the bunch whose grasp pose the target sits on
		res: null,
		anim: null, // { from: [q1, q2, q3], t0 } while the arm moves to a new pose
		drag: null,
		hover: false,
		switched: false,
		grasped: new Set(),
		found: new Set(),
		solved: false,
	};
	st.res = solveIK(m, st.target[0], st.target[1], st.tilt);

	// ---------------------------------------------------------------- DOM
	const canvas = h("canvas", { class: "wb2ik-canvas", "aria-hidden": "true" });
	const statusId = `${uid}-status`;
	const stage = h(
		"div",
		{
			class: "wb2ik-stage",
			tabindex: "0",
			role: "application",
			"aria-label": "Finger-tip target. Arrow keys move it, Shift for bigger steps.",
			"aria-describedby": statusId,
		},
		canvas,
	);
	const chooseId = `${uid}-choose`;
	const solBtns = m.solutions.map((name, i) =>
		h("button", { type: "button", "data-sol": String(i), "aria-pressed": i === st.sol ? "true" : "false", onclick: () => choose(i, true) }, name),
	);
	const tiltId = `${uid}-tilt`;
	const tiltOut = h("output", { class: "wb2ik-tilt-val", for: tiltId });
	const tiltInput = h("input", {
		type: "range",
		id: tiltId,
		min: String(-Math.round(m.tiltMax)),
		max: String(Math.round(m.tiltMax)),
		step: "1",
		value: "0",
		oninput: () => setTilt(Number(tiltInput.value)),
	});
	const graspId = `${uid}-grasp`;
	const graspBtns = m.bunches.map((_, i) =>
		h("button", { type: "button", "data-bunch": String(i), "aria-label": `Bunch ${i + 1}`, "aria-pressed": "false", onclick: () => snapTo(i, true) }, String(i + 1)),
	);
	const chip = h("span", { class: "wb2ik-chip" });
	const onTag = h("span", { class: "wb2ik-on", hidden: true });
	const coords = h("span", { class: "wb2ik-coords" });
	const stopTitle = ctx.content?.rides?.find((r) => r.id === ctx.wb.ride)?.stops?.find((s) => s.id === ctx.wb.stop)?.title;
	const headCells = m.solutions.map((name, i) => h("th", { scope: "col", "data-sol": String(i) }, name));
	const cells = m.solutions.map(() => []);
	const rows = m.names.map((name, axis) => {
		const pj = PLANE_JOINTS.indexOf(axis);
		if (pj < 0) {
			const tds = m.solutions.map(() => h("td", { "data-held": "true" }, h("span", { class: "wb2ik-val" }, fmtDeg(0))));
			return h("tr", { "data-held": "true" }, h("th", { scope: "row" }, name), ...tds);
		}
		const j = m.joints[pj];
		const tds = m.solutions.map((_, si) => {
			const val = h("span", { class: "wb2ik-val" });
			const lo = Math.min(-180, j.min);
			const hi = Math.max(180, j.max);
			const pct = (v) => `${(((clamp(v, lo, hi) - lo) / (hi - lo)) * 100).toFixed(2)}%`;
			const band = h("span", { class: "wb2ik-band", style: { left: pct(j.min), width: `${(((j.max - j.min) / (hi - lo)) * 100).toFixed(2)}%` } });
			const mark = h("span", { class: "wb2ik-mark" });
			const gauge = h("span", { class: "wb2ik-gauge", "aria-hidden": "true" }, band, h("span", { class: "wb2ik-zero", style: { left: pct(0) } }), mark);
			const td = h("td", { "data-sol": String(si) }, val, gauge);
			cells[si][pj] = { td, val, mark, pct };
			return td;
		});
		return h("tr", {}, h("th", { scope: "row" }, name), ...tds);
	});
	const table = h(
		"table",
		{ class: "wb2ik-joints" },
		stopTitle ? h("caption", {}, stopTitle) : null,
		h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "Joint"), ...headCells)),
		h("tbody", {}, ...rows),
	);
	const task = (label) => {
		const count = h("span", { class: "wb2ik-count" });
		const li = h("li", { "data-done": "false" }, h("span", { class: "wb2ik-tick", "aria-hidden": "true" }), h("span", { class: "sr-only wb2ik-tick-sr" }, "To do: "), h("span", {}, label, count));
		li.count = count;
		return li;
	};
	const taskSwitch = task("Switch posture");
	const taskGrasp = task("Grasp each bunch the arm can reach");
	const taskFind = task(nFar > 1 ? "Find the bunches it cannot reach" : "Find the bunch it cannot reach");
	taskGrasp.hidden = nReach === 0;
	taskFind.hidden = nFar === 0;
	const solvedEl = h("div", { class: "wb2ik-solved", role: "status", hidden: true }, "Solved");
	const resetBtn = h("button", { type: "button", class: "btn", "data-act": "reset", onclick: () => reset() }, "Reset");

	const side = h(
		"div",
		{ class: "wb2ik-side" },
		h("div", { class: "wb2ik-row" }, h("span", { class: "wb2ik-label", id: chooseId }, "Robot uses"), h("div", { class: "seg", role: "group", "aria-labelledby": chooseId }, ...solBtns)),
		h("div", { class: "wb2ik-row wb2ik-tilt" }, h("label", { class: "wb2ik-label", for: tiltId }, "Tilt"), tiltOut, tiltInput),
		h("div", { class: "wb2ik-row" }, h("span", { class: "wb2ik-label", id: graspId }, "Go to bunch"), h("div", { class: "seg wb2ik-bunches", role: "group", "aria-labelledby": graspId }, ...graspBtns)),
		h("div", { class: "wb2ik-status" }, h("span", { id: statusId, class: "wb2ik-live", "aria-live": "polite" }, onTag, chip), coords),
		h("div", { class: "wb2ik-foot" }, h("ul", { class: "wb2ik-tasks" }, taskSwitch, taskGrasp, taskFind), resetBtn),
		solvedEl,
		table,
	);
	const root = h("div", { class: "wb2ik", "data-wb2ik": "" }, h("div", { class: "wb2ik-body" }, stage, side));
	el.append(root);

	// ---------------------------------------------------------------- model updates
	const reduced = () => !!ctx.reducedMotion;
	const pose = () => st.res.sols[st.sol].deg;

	function shownPose(now = performance.now()) {
		const to = pose();
		if (!st.anim) return to;
		const k = (now - st.anim.t0) / MOVE_MS;
		if (k >= 1) {
			st.anim = null;
			return to;
		}
		const e = ease(clamp(k, 0, 1));
		return [0, 1, 2].map((i) => st.anim.from[i] + (to[i] - st.anim.from[i]) * e);
	}

	/** Start a move from the pose on screen now to the current solution (skipped under reduced motion). */
	function moveFrom(from) {
		st.anim = reduced() ? null : { from, t0: performance.now() };
	}

	function clampTarget(a, z) {
		if (!view) return [a, Math.max(z, -m.sh)];
		const pad = 22 / view.S;
		return [clamp(a, view.aMin + pad, view.aMax - pad), clamp(z, -m.sh, view.zMax - pad)];
	}

	function solveNow() {
		st.res = solveIK(m, st.target[0], st.target[1], st.tilt);
	}

	function setTarget(a, z) {
		st.target = clampTarget(a, z);
		st.on = -1;
		solveNow();
		st.anim = null;
		evaluate();
	}

	function setTilt(v) {
		st.tilt = clamp(v, -m.tiltMax, m.tiltMax);
		if (st.on >= 0 && Math.abs(m.bunches[st.on].tilt - st.tilt) > 0.5) st.on = -1;
		solveNow();
		st.anim = null;
		evaluate();
	}

	function snapTo(i, animate) {
		const from = shownPose();
		const b = m.bunches[i];
		st.target = [b.x, b.z];
		st.tilt = b.tilt;
		st.on = i;
		solveNow();
		if (animate) moveFrom(from);
		else st.anim = null;
		evaluate();
	}

	function choose(i, learner) {
		if (i === st.sol) return;
		const from = shownPose();
		st.sol = i;
		if (learner && st.res.distinct) st.switched = true;
		if (st.res.distinct) moveFrom(from);
		else st.anim = null;
		evaluate();
	}

	function reset() {
		const from = shownPose();
		st.sol = 0;
		st.tilt = 0;
		st.target = clampTarget(m.start[0], m.start[1]);
		st.on = -1;
		solveNow();
		moveFrom(from);
		evaluate();
	}

	/** Record task progress for the current state, then redraw. */
	function evaluate() {
		const i = st.on;
		if (i >= 0) {
			if (canReach[i] && st.res.sols[st.sol].ok) st.grasped.add(i);
			if (!canReach[i] && !st.res.usable) st.found.add(i);
		}
		if (!st.solved && st.switched && st.grasped.size >= nReach && st.found.size >= nFar) {
			st.solved = true;
			ctx.onSolved?.();
		}
		update();
	}

	function update() {
		const res = st.res;
		solBtns.forEach((b, i) => b.setAttribute("aria-pressed", i === st.sol ? "true" : "false"));
		graspBtns.forEach((b, i) => {
			b.setAttribute("aria-pressed", i === st.on ? "true" : "false");
			b.dataset.state = st.grasped.has(i) ? "grasped" : st.found.has(i) ? "found" : "";
		});
		const tv = String(Math.round(st.tilt));
		if (tiltInput.value !== tv) tiltInput.value = tv;
		tiltOut.textContent = fmtTilt(st.tilt);
		const active = res.sols[st.sol];
		const state = !res.reachable ? "far" : active.ok ? "ok" : "limit";
		if (chip.dataset.state !== state) {
			chip.dataset.state = state;
			chip.textContent = state === "far" ? "Out of reach" : state === "limit" ? "Joint limit" : "Reachable";
		}
		onTag.hidden = st.on < 0;
		onTag.textContent = st.on >= 0 ? `Bunch ${st.on + 1}` : "";
		coords.textContent = `x ${fmtMm(st.target[0])} mm, z ${fmtMm(st.target[1])} mm`;
		table.dataset.far = res.reachable ? "false" : "true";
		headCells.forEach((th, i) => {
			th.dataset.active = i === st.sol ? "true" : "false";
		});
		for (let si = 0; si < 2; si++) {
			const sol = res.sols[si];
			for (let pj = 0; pj < 3; pj++) {
				const c = cells[si][pj];
				c.val.textContent = fmtDeg(sol.deg[pj]);
				c.td.dataset.bad = sol.okJ[pj] ? "false" : "true";
				c.td.dataset.active = si === st.sol ? "true" : "false";
				c.mark.style.left = c.pct(sol.deg[pj]);
			}
		}
		taskGrasp.count.textContent = ` (${st.grasped.size}/${nReach})`;
		for (const [li, done] of [
			[taskSwitch, st.switched],
			[taskGrasp, st.grasped.size >= nReach],
			[taskFind, st.found.size >= nFar],
		]) {
			li.dataset.done = done ? "true" : "false";
			li.querySelector(".wb2ik-tick-sr").textContent = done ? "Done: " : "To do: ";
		}
		solvedEl.hidden = !(st.solved || prevSolved);
		root.dataset.solved = st.solved || prevSolved ? "true" : "false";
		schedule();
	}

	// ---------------------------------------------------------------- layout and drawing
	let view = null;
	let dpr = 1;
	let raf = 0;
	let destroyed = false;
	let theme = null;

	function readTheme() {
		const cs = getComputedStyle(root);
		const v = (n, f) => cs.getPropertyValue(n).trim() || f;
		theme = {
			sky: v("--wb2ik-sky", "#e4f1f8"),
			sky2: v("--wb2ik-sky2", "#cfe5f0"),
			ink: v("--wb2ik-ink", "#1d2127"),
			halo: v("--wb2ik-halo", "rgba(255,255,255,0.9)"),
			font: cs.fontFamily || "system-ui, sans-serif",
		};
	}

	function layout() {
		if (destroyed) return;
		const w = Math.max(200, Math.round(stage.clientWidth));
		// The model window that must stay in view: the cell from just behind the robot to past the
		// tote, from below the work surface to most of the reach ring.
		const R = m.L1 + m.L2;
		const a0 = Math.min(-0.25 * R, m.start[0] - 0.1 * R);
		const a1 = Math.max(1.2 * R, m.tote.far + 0.22 * R, m.start[0] + 0.15 * R, ...m.bunches.map((b) => b.x + 0.2 * R));
		const z0 = -m.sh - 0.1 * R;
		const z1 = Math.max(0.5 * R, m.start[1] + 0.25 * R);
		// Tall enough to work in, short enough to leave room to scroll the dialog on a landscape phone.
		const H = Math.round(clamp((w * (z1 - z0)) / (a1 - a0), 260, Math.max(260, Math.min(520, window.innerHeight * 0.72))));
		const ratio = Math.min(2, window.devicePixelRatio || 1);
		if (view && view.w === w && view.h === H && ratio === dpr) return;
		dpr = ratio;
		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(H * dpr);
		canvas.style.height = `${H}px`;
		const S = Math.min(w / (a1 - a0), H / (z1 - z0));
		const ox = (w - (a1 - a0) * S) / 2 - a0 * S;
		const oy = (H - (z1 - z0) * S) / 2 + z1 * S;
		view = { w, h: H, S, ox, oy, aMin: -ox / S, aMax: (w - ox) / S, zMax: oy / S };
		if (st.on < 0) st.target = clampTarget(st.target[0], st.target[1]);
		solveNow();
		update();
		// Resizing cleared the canvas: draw now rather than show a blank frame.
		if (raf) cancelAnimationFrame(raf);
		render();
	}

	function schedule() {
		if (!raf && !destroyed) raf = requestAnimationFrame(render);
	}

	function render() {
		raf = 0;
		if (!view || destroyed) return;
		if (!theme) readTheme();
		const c = canvas.getContext("2d");
		const { w, h: H, S, ox, oy } = view;
		c.setTransform(dpr, 0, 0, dpr, 0, 0);
		const g = c.createLinearGradient(0, 0, 0, H);
		g.addColorStop(0, theme.sky);
		g.addColorStop(1, theme.sky2);
		c.fillStyle = g;
		c.fillRect(0, 0, w, H);

		const r = new IsoRenderer(c);
		const map = planeMap(S, ox, oy);
		r.setTransform(map.zoom, ox, oy);
		const P = map.P;
		const R = m.L1 + m.L2;
		const T = (f) => f * R; // part sizes scale with the arm
		const far = !st.res.reachable;
		const surfY = P([0, -m.sh])[1];

		drawCellBack(r, map, L, m, m.bunches);

		// Reachable ring for the finger tips at the current tilt: wrist positions the two links can
		// reach, shifted by the tool. Cut off at the work surface. The fill goes under the arm; the
		// outline is drawn again over the cell so it shows inside the tote too.
		const ring = (fill) => {
			const u = toolDir(st.tilt);
			const [cx, cy] = P([m.tool * u[0], m.tool * u[1]]);
			const Ro = S * R;
			const Ri = S * Math.abs(m.L1 - m.L2);
			c.save();
			c.beginPath();
			c.rect(0, 0, w, surfY);
			c.clip();
			if (fill) {
				c.beginPath();
				c.arc(cx, cy, Ro, 0, Math.PI * 2);
				if (Ri > 0.5) {
					c.moveTo(cx + Ri, cy);
					c.arc(cx, cy, Ri, 0, Math.PI * 2, true);
				}
				c.fillStyle = `rgba(${RGB_REACH},0.1)`;
				c.fill("evenodd");
			}
			c.setLineDash([7, 6]);
			c.lineWidth = 2;
			c.strokeStyle = far ? `rgba(${RGB_BAD},0.9)` : `rgba(${RGB_REACH},0.75)`;
			c.beginPath();
			c.arc(cx, cy, Ro, 0, Math.PI * 2);
			c.stroke();
			if (Ri > 2) {
				c.beginPath();
				c.arc(cx, cy, Ri, 0, Math.PI * 2);
				c.stroke();
			}
			c.restore();
		};
		ring(true);

		const shown = shownPose();
		const kin = fk(m, shown[0], shown[1], shown[2]);

		// Ghost: the other posture, as a dashed outline.
		const other = st.res.sols[1 - st.sol];
		if (st.res.distinct) {
			const gk = fk(m, other.deg[0], other.deg[1], other.deg[2]);
			const rgb = other.ok ? RGB_REACH : RGB_BAD;
			const pts = [gk.s, gk.e, gk.w].map(P);
			const tip = P(gk.t);
			c.save();
			c.lineCap = "round";
			c.lineJoin = "round";
			c.strokeStyle = `rgba(${rgb},0.16)`;
			c.lineWidth = Math.max(8, S * T(0.11));
			c.beginPath();
			pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
			c.stroke();
			c.lineWidth = Math.max(4, S * T(0.03));
			c.beginPath();
			c.moveTo(pts[2][0], pts[2][1]);
			c.lineTo(tip[0], tip[1]);
			c.stroke();
			c.setLineDash([6, 5]);
			c.lineWidth = 2;
			c.strokeStyle = `rgba(${rgb},0.9)`;
			c.beginPath();
			[...pts, tip].forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
			c.stroke();
			c.setLineDash([]);
			pts.forEach((p, i) => {
				c.beginPath();
				c.arc(p[0], p[1], Math.max(4, S * T(i ? 0.045 : 0.06)), 0, Math.PI * 2);
				c.fillStyle = "rgba(255,255,255,0.55)";
				c.fill();
				c.strokeStyle = other.okJ[i] ? `rgba(${rgb},0.9)` : `rgba(${RGB_BAD},0.95)`;
				c.lineWidth = 2;
				c.stroke();
			});
			c.restore();
		}

		// The robot, in the pose of the chosen posture (tinted when outside a joint limit). The fingers
		// close once they sit on a bunch they can reach.
		{
			const sol = st.res.sols[st.sol];
			const settled = !st.anim;
			const holding = settled && st.on >= 0 && sol.ok;
			drawArm(r, map, m, kin, {
				okJ: settled ? sol.okJ : [true, true, true],
				bad: settled && st.res.reachable && !sol.ok,
				grip: holding ? 0.15 : 1,
			});
		}

		drawCellFront(r, map, L, m);
		ring(false);

		// Grasp poses: a dashed approach line along the tilt the grasp needs, and a numbered badge just
		// below the grasp point.
		const badgeR = 10;
		const badges = m.bunches.map((b, i) => {
			const u = toolDir(b.tilt);
			const tip = P([b.x, b.z]);
			const len = Math.max(26, S * m.tool * 0.8);
			const end = [tip[0] - u[0] * len, tip[1] + u[1] * len];
			return { i, tip, end, at: [tip[0], tip[1] + 30] };
		});
		c.save();
		c.lineCap = "round";
		for (const bd of badges) {
			const on = bd.i === st.on;
			c.setLineDash([4, 4]);
			c.lineWidth = on ? 2.5 : 2;
			c.strokeStyle = C_GRASP;
			c.globalAlpha = on ? 1 : 0.85;
			c.beginPath();
			c.moveTo(bd.tip[0], bd.tip[1]);
			c.lineTo(bd.end[0], bd.end[1]);
			c.stroke();
			c.setLineDash([]);
			c.beginPath();
			c.arc(bd.tip[0], bd.tip[1], 5, 0, Math.PI * 2);
			c.fillStyle = "rgba(255,255,255,0.85)";
			c.fill();
			c.stroke();
			c.globalAlpha = 1;
		}
		c.font = `700 12px ${theme.font}`;
		c.textAlign = "center";
		c.textBaseline = "middle";
		for (const bd of badges) {
			const done = st.grasped.has(bd.i);
			const miss = st.found.has(bd.i);
			const [x, y] = bd.at;
			c.beginPath();
			c.arc(x, y, badgeR, 0, Math.PI * 2);
			c.fillStyle = done ? C_GOOD : miss ? C_BADGE_BAD : "#ffffff";
			c.fill();
			c.lineWidth = bd.i === st.on ? 3 : 2;
			c.strokeStyle = done ? C_GOOD : miss ? C_BADGE_BAD : C_GRASP;
			c.stroke();
			c.strokeStyle = "#ffffff";
			c.lineWidth = 2.2;
			if (done) {
				c.beginPath();
				c.moveTo(x - 4.5, y + 0.2);
				c.lineTo(x - 1.2, y + 3.5);
				c.lineTo(x + 4.6, y - 3.4);
				c.stroke();
			} else if (miss) {
				c.beginPath();
				c.moveTo(x - 3.8, y - 3.8);
				c.lineTo(x + 3.8, y + 3.8);
				c.moveTo(x + 3.8, y - 3.8);
				c.lineTo(x - 3.8, y + 3.8);
				c.stroke();
			} else {
				c.fillStyle = C_GRASP;
				c.fillText(String(bd.i + 1), x, y + 0.5);
			}
		}
		c.restore();

		// The finger-tip target.
		const tgt = P(st.target);
		{
			const [px, py] = tgt;
			const col = far ? "#e0503f" : C_TARGET;
			c.save();
			if (far) {
				const tip = P(kin.t);
				c.setLineDash([5, 5]);
				c.lineWidth = 2;
				c.strokeStyle = col;
				c.beginPath();
				c.moveTo(tip[0], tip[1]);
				c.lineTo(px, py);
				c.stroke();
				c.setLineDash([]);
			}
			const rad = st.drag || st.hover ? 15 : 12;
			c.beginPath();
			c.arc(px, py, rad + 6, 0, Math.PI * 2);
			c.fillStyle = far ? `rgba(${RGB_BAD},0.18)` : "rgba(239,138,23,0.18)";
			c.fill();
			c.beginPath();
			c.arc(px, py, rad, 0, Math.PI * 2);
			c.fillStyle = "rgba(255,255,255,0.55)";
			c.fill();
			c.lineWidth = 3;
			c.strokeStyle = col;
			c.stroke();
			c.lineWidth = 2;
			c.beginPath();
			c.moveTo(px - rad + 4, py);
			c.lineTo(px + rad - 4, py);
			c.moveTo(px, py - rad + 4);
			c.lineTo(px, py + rad - 4);
			c.stroke();
			c.restore();
		}

		// Joint angles of the chosen posture, each measured from its joint's zero line. Labels go to
		// the first spot around the joint that clears the target, the badges, the arm, the other
		// labels, and the canvas edge.
		if (!st.anim) {
			const sol = st.res.sols[st.sol];
			const [q1, q2, q3] = sol.deg;
			const font = Math.round(clamp(S * T(0.075) * 0.55 + 6, 11, 13));
			const marks = [
				{ p: kin.s, ref: 0, q: q1, rad: S * T(0.16), ok: sol.okJ[0] },
				{ p: kin.e, ref: q1, q: q2, rad: S * T(0.13), ok: sol.okJ[1] },
				{ p: kin.w, ref: q1 + q2, q: q3, rad: S * T(0.1), ok: sol.okJ[2] },
			];
			const segs = [
				[kin.s, kin.e],
				[kin.e, kin.w],
				[kin.w, kin.t],
			].map(([a, b]) => [P(a), P(b)]);
			const armHalf = (S * T(0.115)) / 2;
			const segDist = (p, a, b) => {
				const dx = b[0] - a[0];
				const dy = b[1] - a[1];
				const k = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1), 0, 1);
				return Math.hypot(p[0] - a[0] - k * dx, p[1] - a[1] - k * dy);
			};
			const avoid = [{ p: tgt, r: 22 }, ...badges.map((bd) => ({ p: bd.at, r: badgeR + 4 }))];
			const placed = [];
			c.save();
			c.font = `700 ${font}px ${theme.font}`;
			c.textAlign = "center";
			c.textBaseline = "middle";
			for (const mk of marks) {
				const [px, py] = P(mk.p);
				const a0 = -mk.ref / DEG;
				const a1 = -(mk.ref + mk.q) / DEG;
				const col = mk.ok ? theme.ink : "#e0503f";
				c.globalAlpha = 0.75;
				c.setLineDash([3, 3]);
				c.lineWidth = 1.5;
				c.strokeStyle = col;
				c.beginPath();
				c.moveTo(px, py);
				c.lineTo(px + Math.cos(a0) * mk.rad * 1.35, py + Math.sin(a0) * mk.rad * 1.35);
				c.stroke();
				c.setLineDash([]);
				c.lineWidth = 2;
				c.beginPath();
				c.arc(px, py, mk.rad, a0, a1, mk.q > 0);
				c.stroke();
				c.globalAlpha = 1;

				const text = fmtDeg(mk.q);
				const tw = c.measureText(text).width;
				const bis = (a0 + a1) / 2;
				// Candidates in order of preference: near the arc's middle first. The target, badges,
				// other labels, and the edge must stay clear; covering the arm is only avoided if
				// possible (the halo keeps the text readable over it).
				const cands = [];
				for (const step of [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6]) {
					for (const extra of [0, font * 1.2]) {
						const ang = bis + (step * Math.PI) / 6;
						const rr = mk.rad + font * 0.8 + extra;
						const lx = px + Math.cos(ang) * (rr + (tw / 2) * Math.abs(Math.cos(ang)));
						const ly = py + Math.sin(ang) * (rr + font * 0.3);
						const xs = [lx - tw / 2, lx, lx + tw / 2];
						const hard = Math.min(
							Math.min(...avoid.map((o) => Math.min(...xs.map((x) => Math.hypot(x - o.p[0], ly - o.p[1]))) - o.r)),
							Math.min(Number.POSITIVE_INFINITY, ...placed.map((q) => Math.max(Math.abs(lx - q.x) - (tw + q.w) / 2 - 4, Math.abs(ly - q.y) - font - 2))),
							Math.min(lx - tw / 2 - 3, w - lx - tw / 2 - 3, ly - font / 2 - 3, H - ly - font / 2 - 3),
						);
						const arm = Math.min(...segs.flatMap(([a, b]) => xs.map((x) => segDist([x, ly], a, b)))) - armHalf - font * 0.5;
						cands.push({ x: lx, y: ly, step: Math.abs(step), hard, arm });
					}
				}
				const best =
					cands.find((k) => k.step <= 3 && k.hard >= 0 && k.arm >= 0) ??
					cands.find((k) => k.step <= 2 && k.hard >= 0) ??
					cands.reduce((a, b) => (Math.min(b.hard, b.arm) > Math.min(a.hard, a.arm) ? b : a));
				placed.push({ x: best.x, y: best.y, w: tw });
				c.lineWidth = 4;
				c.lineJoin = "round";
				c.strokeStyle = theme.halo;
				c.strokeText(text, best.x, best.y);
				c.fillStyle = col;
				c.fillText(text, best.x, best.y);
			}
			c.restore();
		}

		if (st.anim) schedule();
	}

	// ---------------------------------------------------------------- input
	const toModel = (e) => {
		const rect = canvas.getBoundingClientRect();
		return [(e.clientX - rect.left - view.ox) / view.S, (view.oy - (e.clientY - rect.top)) / view.S];
	};
	const nearTarget = (p, touch) => Math.hypot(p[0] - st.target[0], p[1] - st.target[1]) * view.S <= (touch ? 32 : 22);
	/** The bunch whose grasp point is within px screen pixels of the target, or -1. */
	function nearBunch(px) {
		let best = -1;
		let bd = px;
		m.bunches.forEach((b, i) => {
			const d = Math.hypot(b.x - st.target[0], b.z - st.target[1]) * view.S;
			if (d <= bd) {
				bd = d;
				best = i;
			}
		});
		return best;
	}

	function onDown(e) {
		if (!view || (e.pointerType === "mouse" && e.button !== 0)) return;
		e.preventDefault();
		stage.focus({ preventScroll: true });
		const p = toModel(e);
		// A press closer to another bunch's grasp point than to the target is a tap on that bunch,
		// not a grab: on a phone the bunches sit closer together than the touch grab radius.
		const dTarget = Math.hypot(p[0] - st.target[0], p[1] - st.target[1]);
		const nearOther = m.bunches.some((b, i) => i !== st.on && Math.hypot(b.x - p[0], b.z - p[1]) < dTarget);
		const grab = nearTarget(p, e.pointerType !== "mouse") && !nearOther;
		st.drag = { id: e.pointerId, type: e.pointerType, off: grab ? [st.target[0] - p[0], st.target[1] - p[1]] : [0, 0] };
		try {
			canvas.setPointerCapture(e.pointerId);
		} catch {
			// Pointer already gone: the drag simply ends on the next up/cancel.
		}
		canvas.style.cursor = "grabbing";
		if (grab) schedule();
		else setTarget(p[0], p[1]);
	}
	function onMove(e) {
		if (!view) return;
		const p = toModel(e);
		if (!st.drag) {
			const over = e.pointerType === "mouse" && nearTarget(p, false);
			if (over !== st.hover) {
				st.hover = over;
				canvas.style.cursor = over ? "grab" : "";
				schedule();
			}
			return;
		}
		if (e.pointerId !== st.drag.id) return;
		setTarget(p[0] + st.drag.off[0], p[1] + st.drag.off[1]);
	}
	function onUp(e) {
		if (!st.drag || e.pointerId !== st.drag.id) return;
		const type = st.drag.type;
		st.drag = null;
		canvas.style.cursor = st.hover ? "grab" : "";
		// Letting go near a bunch snaps onto its grasp pose (point and tilt).
		const i = e.type === "pointerup" && view ? nearBunch(type === "mouse" ? SNAP_PX.mouse : SNAP_PX.touch) : -1;
		if (i >= 0 && i !== st.on) snapTo(i, true);
		else schedule();
	}
	function onLeave() {
		if (st.hover && !st.drag) {
			st.hover = false;
			canvas.style.cursor = "";
			schedule();
		}
	}
	function onKey(e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		const step = KEY_STEP * (e.shiftKey ? 5 : 1);
		const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
		if (!d) return;
		e.preventDefault();
		setTarget(st.target[0] + d[0], st.target[1] + d[1]);
		const i = m.bunches.findIndex((b) => Math.hypot(b.x - st.target[0], b.z - st.target[1]) <= KEY_SNAP_MM);
		if (i >= 0) snapTo(i, false);
	}

	canvas.addEventListener("pointerdown", onDown);
	canvas.addEventListener("pointermove", onMove);
	canvas.addEventListener("pointerup", onUp);
	canvas.addEventListener("pointercancel", onUp);
	canvas.addEventListener("pointerleave", onLeave);
	stage.addEventListener("keydown", onKey);

	const ro = new ResizeObserver(() => layout());
	ro.observe(stage);
	window.addEventListener("resize", layout);
	const darkQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
	const onTheme = () => {
		readTheme();
		schedule();
	};
	darkQuery?.addEventListener?.("change", onTheme);
	ctx.onMotionChange = (on) => {
		if (on && st.anim) {
			st.anim = null;
			schedule();
		}
	};
	cssReady.then(() => {
		if (destroyed) return;
		readTheme();
		layout();
		schedule();
	});
	update();

	return {
		destroy() {
			destroyed = true;
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
			ro.disconnect();
			window.removeEventListener("resize", layout);
			darkQuery?.removeEventListener?.("change", onTheme);
			canvas.removeEventListener("pointerdown", onDown);
			canvas.removeEventListener("pointermove", onMove);
			canvas.removeEventListener("pointerup", onUp);
			canvas.removeEventListener("pointercancel", onUp);
			canvas.removeEventListener("pointerleave", onLeave);
			stage.removeEventListener("keydown", onKey);
			ctx.onMotionChange = null;
			root.remove();
		},
		test: {
			/**
			 * Drive the UI as a learner would: switch posture where both exist, then go to each bunch
			 * with its button, switching to the other posture when the current one breaks a limit.
			 */
			solve() {
				const R = m.L1 + m.L2;
				if (!st.switched) {
					if (st.tilt !== 0) setTilt(0);
					const spots = [m.start, [0.85 * R, -0.1 * R], [0.6 * R, 0.3 * R], [0.4 * R, 0.5 * R]];
					for (const p of spots) {
						if (st.switched) break;
						setTarget(p[0], p[1]);
						if (st.res.distinct) solBtns[1 - st.sol].click();
					}
				}
				graspBtns.forEach((btn, i) => {
					btn.click();
					const res = st.res;
					if (canReach[i] && !res.sols[st.sol].ok && res.sols[1 - st.sol].ok) solBtns[1 - st.sol].click();
				});
				return st.solved;
			},
			state() {
				const r1 = (v) => Math.round(v * 10) / 10;
				return {
					target_mm: st.target.map(Math.round),
					tilt_deg: Math.round(st.tilt),
					onBunch: st.on,
					reachable: st.res.reachable,
					solution: st.sol,
					solutionName: m.solutions[st.sol],
					angles_deg: st.res.sols.map((s) => s.deg.map(r1)),
					withinLimits: st.res.sols.map((s) => s.ok),
					bunchReachable: canReach,
					switched: st.switched,
					grasped: [...st.grasped].sort(),
					found: [...st.found].sort(),
					solved: st.solved,
				};
			},
		},
	};
}

export default { id: ID, mount };
