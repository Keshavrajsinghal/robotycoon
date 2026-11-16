// Workbench wb3-control, "Control loop": tune the PID loop a servo drive runs on one wrist joint.
// Every change re-runs a step response (0 -> target angle) with a fixed-step simulation, plots
// position and torque against time, measures overshoot, settling time, and steady-state error
// against the spec, and replays the response on a small isometric wrist with soft fingers (and a
// grape bunch when loaded). Solved when the spec is met with the payload on. Drawing code and UI
// chrome only: model numbers and load names come from ctx.wb.data, every explanation from the
// host's content text.
//
// DATA SCHEMA (ctx.wb.data, the Data JSON of "## Workbench: wb3-control" in
// knowledge/sim/workbenches.md). Every value is at the joint (after the gearbox). The joint is a
// wrist bend joint: it turns about a horizontal axis, angle 0 is the fingers hanging straight
// down, and any weight the controller's gravity compensation does not cancel pulls them back
// toward 0. Feedforward is otherwise off: the PID alone drives the joint.
//   note                          string        For authors: which values come from which concept
//                                               and which are illustrative.
//   drive_loop_hz                 number  Hz    How often the drive's PID runs (one PID update and
//                                               one simulation step per tick). Its output is the
//                                               torque asked of the current loop, treated as instant.
//   setpoint_hz                   number  Hz    How often the robot controller sends a new target
//                                               (shown in the UI; at most drive_loop_hz). The step is
//                                               one such target.
//   duration_s                    number  s     Length of the simulated step response.
//   target_deg                    number  deg   Size of the commanded step (the joint moves 0 -> this).
//   load.empty.label              string        Toggle label without the payload.
//   load.empty.inertia_kgm2       number  kg m2 Rotational inertia the motor drives, no payload.
//   load.empty.gravity_nm         number  N m   Weight torque left for feedback (not cancelled by
//                                               gravity compensation) with the fingers pointing
//                                               sideways; the model applies it times sin(angle).
//                                               0 = fully compensated.
//   load.loaded.label             string        Toggle label with the payload.
//   load.loaded.inertia_kgm2      number  kg m2 Rotational inertia with the payload.
//   load.loaded.gravity_nm        number  N m   Weight torque with the payload, as above.
//   damping_nm_s_per_rad          number  N m s/rad  Viscous friction: torque lost per rad/s of speed.
//   friction_nm                   number  N m   Dry (Coulomb) friction: torque needed to keep the
//                                               joint sliding, and to break it loose from rest.
//   torque_limit_nm               number  N m   Most torque motor and drive can deliver; the PID
//                                               command saturates (is clipped) here.
//   integral_limit_nm             number  N m   Anti-windup clamp: most torque the integral term
//                                               may contribute.
//   gains.kp {min, max, start}    number  N m/rad      Proportional gain slider range and start.
//   gains.ki {min, max, start}    number  N m/(rad s)  Integral gain slider range and start.
//   gains.kd {min, max, start}    number  N m s/rad    Derivative gain slider range and start.
//   spec.max_overshoot_pct        number  %     Largest allowed overshoot, percent of the step.
//   spec.max_settling_s           number  s     Latest allowed settling time (must be below
//                                               0.9 x duration_s).
//   spec.settle_band_pct          number  %     "Settled" = staying within this percent of the
//                                               step around the target until the end of the run.
//   spec.max_steady_state_error_deg  number deg Largest allowed final error (mean of the last 5%
//                                               of the run).
// Sliders have 200 steps between min and max. The start gains should miss the spec with the
// payload on and some slider setting must meet it (test.solve() searches for one).

import { h, loadCss } from "../core/dom.js";
import { PAL } from "../engine/park.js";
import { gainAt, indexOf, measure, params, searchGains, simulate, STEPS } from "./wb3-control-sim.js";
import { drawStage, sizeCanvas } from "./wb3-stage.js";

const ID = "wb3-control";
const GAINS = [
	{ key: "kp", label: "Kp", unit: "N·m/rad" },
	{ key: "ki", label: "Ki", unit: "N·m/(rad·s)" },
	{ key: "kd", label: "Kd", unit: "N·m·s/rad" },
];
const PLAY_S = 2.4; // wall-clock length of one replay (UI pacing, never faster than real time)
const MAX_STEPS = 200000;

// ---------------------------------------------------------------------------
// Data validation

const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const pos = (v) => isNum(v) && v > 0;
const nonneg = (v) => isNum(v) && v >= 0;
const str = (v) => typeof v === "string" && v.trim().length > 0;
const get = (o, path) => path.split(".").reduce((a, k) => (a && typeof a === "object" ? a[k] : undefined), o);

/** First missing or malformed field path, or null when the data is usable. */
function validate(d) {
	if (!d || typeof d !== "object") return "data";
	const rules = [
		["drive_loop_hz", pos],
		["setpoint_hz", pos],
		["duration_s", pos],
		["target_deg", (v) => isNum(v) && v !== 0],
		["load.empty.label", str],
		["load.empty.inertia_kgm2", pos],
		["load.empty.gravity_nm", nonneg],
		["load.loaded.label", str],
		["load.loaded.inertia_kgm2", pos],
		["load.loaded.gravity_nm", nonneg],
		["damping_nm_s_per_rad", nonneg],
		["friction_nm", nonneg],
		["torque_limit_nm", pos],
		["integral_limit_nm", nonneg],
	];
	for (const g of GAINS) rules.push([`gains.${g.key}.min`, nonneg], [`gains.${g.key}.max`, pos], [`gains.${g.key}.start`, isNum]);
	rules.push(["spec.max_overshoot_pct", nonneg], ["spec.max_settling_s", pos], ["spec.settle_band_pct", pos], ["spec.max_steady_state_error_deg", pos]);
	for (const [path, ok] of rules) if (!ok(get(d, path))) return path;
	for (const g of GAINS) {
		const r = d.gains[g.key];
		if (r.max <= r.min) return `gains.${g.key}.max`;
		if (r.start < r.min || r.start > r.max) return `gains.${g.key}.start`;
	}
	if (d.duration_s * d.drive_loop_hz > MAX_STEPS || d.duration_s * d.drive_loop_hz < 20) return "drive_loop_hz";
	if (d.setpoint_hz > d.drive_loop_hz) return "setpoint_hz";
	if (d.spec.max_settling_s >= d.duration_s * 0.9) return "spec.max_settling_s";
	return null;
}

// ---------------------------------------------------------------------------
// Formatting

function fmt(v, digits = 3) {
	if (!Number.isFinite(v)) return "-";
	if (v === 0) return "0";
	const d = Math.max(0, Math.min(4, digits - 1 - Math.floor(Math.log10(Math.abs(v)))));
	return String(Number(v.toFixed(d)));
}

function decimalsFor(range) {
	const step = (range.max - range.min) / STEPS;
	return Math.max(0, Math.min(4, Math.ceil(-Math.log10(step) - 1e-9)));
}

function niceTicks(lo, hi, count) {
	const span = hi - lo;
	if (!(span > 0)) return [lo];
	const raw = span / count;
	const mag = 10 ** Math.floor(Math.log10(raw));
	const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
	const out = [];
	for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
	return out;
}

const round = (v, d = 4) => (Number.isFinite(v) ? Number(v.toFixed(d)) : null);

// ---------------------------------------------------------------------------
// Canvas helpers

function themeColors(el) {
	const cs = getComputedStyle(el);
	const v = (name, fb) => cs.getPropertyValue(name).trim() || fb;
	return {
		text: v("--text", "#1d2127"),
		muted: v("--muted", "#59616c"),
		border: v("--border", "#dcd6ca"),
		good: v("--good", "#1d7a4b"),
		bad: v("--bad", "#b0362a"),
		line: v("--wb3-line", "#2f6fb3"),
		ghost: v("--wb3-ghost", "rgba(89,97,108,0.55)"),
		band: v("--wb3-band", "rgba(29,122,75,0.1)"),
		goal: v("--wb3-goal", "rgba(29,122,75,0.2)"),
		sat: v("--wb3-sat", "#d9583b"),
		font: v("--font", "system-ui, sans-serif"),
	};
}

/** Plot frame: margins, linear maps, grid, and tick labels. Returns {X, Y, x0, x1, y0, y1}. */
function frame(c, w, hgt, xr, yr, col, opts) {
	const m = { l: opts.left ?? 40, r: 10, t: opts.top ?? 16, b: opts.bottom ?? 20 };
	const x0 = m.l;
	const x1 = w - m.r;
	const y0 = m.t;
	const y1 = hgt - m.b;
	const X = (t) => x0 + ((t - xr[0]) / (xr[1] - xr[0])) * (x1 - x0);
	const Y = (v) => y1 - ((v - yr[0]) / (yr[1] - yr[0])) * (y1 - y0);
	c.font = `11px ${col.font}`;
	c.lineWidth = 1;
	c.strokeStyle = col.border;
	c.fillStyle = col.muted;
	c.textBaseline = "middle";
	c.textAlign = "right";
	for (const v of niceTicks(yr[0], yr[1], opts.yTicks ?? 4)) {
		const y = Math.round(Y(v)) + 0.5;
		c.beginPath();
		c.moveTo(x0, y);
		c.lineTo(x1, y);
		c.stroke();
		c.fillText(fmt(v), x0 - 5, y);
	}
	c.textAlign = "center";
	c.textBaseline = "top";
	const xt = niceTicks(xr[0], xr[1], Math.max(2, Math.floor((x1 - x0) / 70)));
	for (const t of xt) {
		const x = Math.round(X(t)) + 0.5;
		c.beginPath();
		c.moveTo(x, y1);
		c.lineTo(x, y1 + 4);
		c.stroke();
		if (opts.xLabels !== false) c.fillText(fmt(t), x, y1 + 5);
	}
	c.strokeStyle = col.muted;
	c.beginPath();
	c.moveTo(x0 + 0.5, y0);
	c.lineTo(x0 + 0.5, y1 + 0.5);
	c.lineTo(x1, y1 + 0.5);
	c.stroke();
	c.textAlign = "left";
	c.textBaseline = "top";
	c.fillStyle = col.muted;
	c.fillText(opts.caption, 4, 2);
	if (opts.xCaption && opts.xLabels !== false) {
		c.textAlign = "right";
		c.textBaseline = "bottom";
		c.fillText(opts.xCaption, x1, y1 - 2);
	}
	return { X, Y, x0, x1, y0, y1 };
}

function strokeSeries(c, arr, end, f, color, width, dash) {
	if (end < 2) return;
	const stride = Math.max(1, Math.floor(end / ((f.x1 - f.x0) * 2)));
	c.save();
	c.beginPath();
	c.rect(f.x0, f.y0 - 2, f.x1 - f.x0 + 2, f.y1 - f.y0 + 4);
	c.clip();
	c.beginPath();
	for (let k = 0; k < end; k += stride) {
		const x = f.X(k);
		const y = f.Y(arr[k]);
		if (k === 0) c.moveTo(x, y);
		else c.lineTo(x, y);
	}
	c.lineTo(f.X(end - 1), f.Y(arr[end - 1]));
	c.strokeStyle = color;
	c.lineWidth = width;
	c.lineJoin = "round";
	c.lineCap = "round";
	if (dash) c.setLineDash(dash);
	c.stroke();
	c.restore();
}

function hline(c, f, v, color, width, dash, label, align = "right") {
	const y = Math.round(f.Y(v)) + 0.5;
	if (y < f.y0 - 1 || y > f.y1 + 1) return;
	c.save();
	c.strokeStyle = color;
	c.lineWidth = width;
	if (dash) c.setLineDash(dash);
	c.beginPath();
	c.moveTo(f.x0, y);
	c.lineTo(f.x1, y);
	c.stroke();
	c.restore();
	if (label) {
		c.fillStyle = color;
		c.textAlign = align;
		c.textBaseline = "bottom";
		c.fillText(label, align === "right" ? f.x1 - 2 : f.x0 + 4, y - 2);
	}
}

// ---------------------------------------------------------------------------

export default {
	id: ID,
	mount(el, ctx) {
		const data = ctx.wb?.data;
		const bad = validate(data);
		if (bad) {
			loadCss(`css/modules/${ID}.css`);
			const msg = h("p", { class: "wb3-error", "data-wb3-error": bad }, `Workbench data missing: ${bad}`);
			el.append(msg);
			return {
				destroy: () => msg.remove(),
				test: { solve: () => false, state: () => ({ error: bad }) },
			};
		}
		const reduced = () => (typeof ctx.reducedMotion === "function" ? !!ctx.reducedMotion() : !!ctx.reducedMotion);
		const spec = data.spec;
		// Readout decimals: one digit finer than the spec limit they are compared with.
		const decs = (v) => Math.max(1, Math.min(4, 1 - Math.floor(Math.log10(v || 1))));
		const dOs = decs(spec.max_overshoot_pct);
		const dTs = decs(spec.max_settling_s);
		const dSs = decs(spec.max_steady_state_error_deg);
		const S = {
			load: "empty",
			idx: Object.fromEntries(GAINS.map((g) => [g.key, indexOf(data.gains[g.key], data.gains[g.key].start)])),
			solvedFired: false,
			prevSolved: !!ctx.state?.workbench?.(ID)?.solved,
			scrubT: null, // seconds, while the learner holds a time on the plots
			zoom: false, // position plot zoomed to the band around the target
		};
		let sim = null;
		let simOther = null;
		let m = null;
		let destroyed = false;
		let raf = 0;
		let playStart = 0;
		let playT = null; // simulation seconds of the replay, null when idle
		const rate = Math.min(1, data.duration_s / PLAY_S);
		const gains = () => Object.fromEntries(GAINS.map((g) => [g.key, gainAt(data.gains[g.key], S.idx[g.key])]));
		const otherLoad = () => (S.load === "empty" ? "loaded" : "empty");

		// ------------------------------------------------------------ DOM
		const root = h("div", { class: "wb3", "data-wb3": "", style: { visibility: "hidden" } });
		const solvedBadge = h("span", { class: "wb3-badge", hidden: true }, "Solved");
		const verdict = h("span", { class: "wb3-verdict" });
		const need = h("span", { class: "wb3-need" }, "Solve with: ", h("strong", {}, data.load.loaded.label));
		const status = h("div", { class: "wb3-status", role: "status", "aria-live": "polite" }, solvedBadge, verdict, need);

		const stageCanvas = h("canvas", { class: "wb3-stage-canvas", role: "img", "aria-label": "Wrist joint replay" });
		const timeEl = h("span", { class: "wb3-time", "aria-hidden": "true" });
		const stage = h("div", { class: "wb3-stage" }, stageCanvas, timeEl);

		const metricEl = (key, name) => {
			const value = h("span", { class: "wb3-metric-value" });
			const limit = h("span", { class: "wb3-metric-limit" });
			const mark = h("span", { class: "wb3-mark", "aria-hidden": "true" });
			const sr = h("span", { class: "sr-only" });
			const card = h("div", { class: "wb3-metric", "data-metric": key }, h("span", { class: "wb3-metric-name" }, name), mark, value, limit, sr);
			return { card, value, limit, mark, sr };
		};
		const metrics = {
			overshoot: metricEl("overshoot", "Overshoot"),
			settling: metricEl("settling", "Settling time"),
			sse: metricEl("sse", "Steady-state error"),
		};
		metrics.overshoot.limit.textContent = `max ${fmt(spec.max_overshoot_pct)} %`;
		metrics.settling.limit.textContent = `max ${fmt(spec.max_settling_s)} s`;
		metrics.sse.limit.textContent = `max ${fmt(spec.max_steady_state_error_deg)} deg`;
		const metricsBox = h("div", { class: "wb3-metrics" }, metrics.overshoot.card, metrics.settling.card, metrics.sse.card);

		const swatch = (cls) => h("span", { class: `wb3-swatch ${cls}`, "aria-hidden": "true" });
		const legendCurrent = h("span", {});
		const legendOther = h("span", {});
		const legend = h(
			"div",
			{ class: "wb3-legend" },
			h("span", { class: "wb3-legend-item" }, swatch("line"), legendCurrent),
			h("span", { class: "wb3-legend-item" }, swatch("ghost"), legendOther),
			h("span", { class: "wb3-legend-item" }, swatch("target"), "target"),
			h("span", { class: "wb3-legend-item" }, swatch("limit"), "overshoot limit"),
			h("span", { class: "wb3-legend-item" }, swatch("goal"), "settled by"),
		);
		const posCanvas = h("canvas", { role: "img" });
		const tauCanvas = h("canvas", { role: "img" });
		const posCursor = h("div", { class: "wb3-cursor", hidden: true });
		const tauCursor = h("div", { class: "wb3-cursor", hidden: true });
		const zoomBtn = h(
			"button",
			{
				type: "button",
				class: "wb3-zoom",
				"data-act": "zoom",
				"aria-pressed": "false",
				onpointerdown: (e) => e.stopPropagation(),
				onclick: () => {
					S.zoom = !S.zoom;
					zoomBtn.setAttribute("aria-pressed", S.zoom ? "true" : "false");
					drawPlots();
				},
			},
			"Zoom",
		);
		const posPlot = h("div", { class: "wb3-plot wb3-plot-pos" }, posCanvas, posCursor, zoomBtn);
		const tauPlot = h("div", { class: "wb3-plot wb3-plot-tau" }, tauCanvas, tauCursor);
		const plots = h("div", { class: "wb3-plots" }, legend, posPlot, tauPlot);

		const loadBtns = ["empty", "loaded"].map((id) =>
			h("button", { type: "button", "data-load": id, "aria-pressed": "false", onclick: () => setLoad(id, true) }, data.load[id].label),
		);
		const loadSeg = h("div", { class: "seg wb3-load", role: "group", "aria-label": "Payload" }, ...loadBtns);
		const fact = (name, value) => h("span", { class: "wb3-fact" }, h("span", { class: "wb3-fact-name" }, name), " ", value);
		const inertiaEl = h("span", { class: "wb3-fact-value" });
		const facts = h(
			"div",
			{ class: "wb3-facts" },
			fact("Inertia", inertiaEl),
			fact("Drive loop", h("span", { class: "wb3-fact-value" }, `every ${fmt(1000 / data.drive_loop_hz)} ms`)),
			fact("New target", h("span", { class: "wb3-fact-value" }, `every ${fmt(1000 / data.setpoint_hz)} ms`)),
		);
		const sliders = {};
		const sliderRows = GAINS.map((g) => {
			const range = data.gains[g.key];
			const inputId = `wb3-${g.key}-${Math.random().toString(36).slice(2, 8)}`;
			const out = h("output", { class: "wb3-gain-value", for: inputId });
			const input = h("input", {
				type: "range",
				id: inputId,
				min: 0,
				max: STEPS,
				step: 1,
				value: S.idx[g.key],
				"data-gain": g.key,
				oninput: () => {
					S.idx[g.key] = Number(input.value);
					update({ replay: false });
				},
				onchange: () => play(),
			});
			sliders[g.key] = { input, out, range, dec: decimalsFor(range), unit: g.unit };
			return h(
				"div",
				{ class: "wb3-slider" },
				h("label", { for: inputId }, h("span", { class: "wb3-gain-name" }, g.label), h("span", { class: "wb3-gain-unit" }, g.unit)),
				out,
				input,
			);
		});
		const replayBtn = h("button", { type: "button", class: "btn", "data-act": "replay", onclick: () => play() }, "Replay");
		const resetBtn = h(
			"button",
			{
				type: "button",
				class: "btn",
				"data-act": "reset",
				onclick: () => {
					for (const g of GAINS) S.idx[g.key] = indexOf(data.gains[g.key], data.gains[g.key].start);
					update({ replay: true });
				},
			},
			"Reset",
		);
		const controls = h(
			"div",
			{ class: "wb3-controls" },
			h("div", { class: "wb3-row" }, loadSeg, h("div", { class: "wb3-buttons" }, replayBtn, resetBtn)),
			facts,
			h("div", { class: "wb3-sliders" }, ...sliderRows),
		);
		root.append(h("div", { class: "wb3-head" }, status), h("div", { class: "wb3-main" }, stage, metricsBox, plots, controls));
		el.append(root);
		loadCss(`css/modules/${ID}.css`).then(() => {
			if (destroyed) return;
			root.style.visibility = "";
			drawAll();
		});

		// ------------------------------------------------------------ model
		function recompute() {
			const g = gains();
			sim = simulate(params(data, S.load, g));
			simOther = simulate(params(data, otherLoad(), g));
			m = measure(sim, spec, data.duration_s);
		}

		function setLoad(id, replay) {
			S.load = id;
			update({ replay });
		}

		function update({ replay }) {
			recompute();
			S.scrubT = null;
			renderReadouts();
			drawPlots();
			if (replay) play();
			else if (playT === null) drawArm(data.duration_s);
			if (S.load === "loaded" && m.met && !S.solvedFired) {
				S.solvedFired = true;
				root.dataset.solved = "true";
				try {
					ctx.onSolved?.();
				} catch (e) {
					console.error(e);
				}
			}
			renderStatus();
		}

		// ------------------------------------------------------------ readouts
		function renderReadouts() {
			for (const g of GAINS) {
				const s = sliders[g.key];
				const v = gainAt(s.range, S.idx[g.key]);
				const txt = v.toFixed(s.dec);
				s.out.textContent = txt;
				s.input.value = String(S.idx[g.key]);
				s.input.setAttribute("aria-valuetext", `${txt} ${s.unit}`);
			}
			for (const b of loadBtns) b.setAttribute("aria-pressed", b.dataset.load === S.load ? "true" : "false");
			legendCurrent.textContent = data.load[S.load].label;
			inertiaEl.textContent = `${fmt(data.load[S.load].inertia_kgm2)} kg·m²`;
			legendOther.textContent = data.load[otherLoad()].label;
			const set = (k, ok, text, srText) => {
				const mt = metrics[k];
				mt.card.dataset.ok = ok ? "true" : "false";
				mt.value.textContent = text;
				mt.sr.textContent = srText;
			};
			if (m.unstable) {
				for (const k of Object.keys(metrics)) set(k, false, "unstable", "outside the spec");
			} else {
				set("overshoot", m.ok.overshoot, `${m.overshootPct.toFixed(dOs)} %`, m.ok.overshoot ? "within the spec" : "outside the spec");
				set("settling", m.ok.settling, m.settlingS === null ? "not settled" : `${m.settlingS.toFixed(dTs)} s`, m.ok.settling ? "within the spec" : "outside the spec");
				set("sse", m.ok.sse, `${m.sseDeg.toFixed(dSs)} deg`, m.ok.sse ? "within the spec" : "outside the spec");
			}
			const summary = m.unstable
				? "unstable"
				: `overshoot ${m.overshootPct.toFixed(dOs)} %, settling time ${m.settlingS === null ? "not settled" : `${m.settlingS.toFixed(dTs)} s`}, steady-state error ${m.sseDeg.toFixed(dSs)} deg`;
			posCanvas.setAttribute("aria-label", `Position over time (${data.load[S.load].label}): ${summary}`);
			const satCount = sim.sat.reduce((a, b) => a + b, 0);
			tauCanvas.setAttribute("aria-label", `Torque over time: at the limit for ${fmt((satCount / (sim.n + 1)) * data.duration_s, 2)} s`);
		}

		function renderStatus() {
			const solved = S.solvedFired || S.prevSolved;
			solvedBadge.hidden = !solved;
			root.dataset.met = m.met ? "true" : "false";
			verdict.dataset.met = m.met ? "true" : "false";
			const word = m.unstable ? "Unstable" : m.met ? "Spec met" : "Spec not met";
			// Only touch the live region when the verdict changes, so dragging does not chatter.
			if (verdict.textContent !== word) verdict.textContent = word;
			need.hidden = S.load === "loaded";
		}

		// ------------------------------------------------------------ drawing
		function drawPlots() {
			if (!sim || root.style.visibility === "hidden") return;
			const col = themeColors(root);
			const T = data.duration_s;
			const target = data.target_deg;
			const band = (spec.settle_band_pct / 100) * Math.abs(target);
			const limitDeg = target * (1 + spec.max_overshoot_pct / 100);
			const cap = Math.abs(target) * 2.2;
			let lo = Math.min(0, target, limitDeg);
			let hi = Math.max(0, target, limitDeg);
			for (const s of [sim, simOther])
				for (let k = 0; k < s.end; k++) {
					const v = s.pos[k];
					if (v < lo) lo = v;
					if (v > hi) hi = v;
				}
			lo = Math.max(lo, -cap);
			hi = Math.min(hi, cap);
			const padY = (hi - lo) * 0.08;
			lo -= padY;
			hi += padY;
			if (S.zoom) {
				// Near the target: wide enough for the overshoot limit and a few settle bands.
				const zr = Math.max(4 * band, 2 * Math.abs(limitDeg - target), 0.05 * Math.abs(target));
				lo = target - zr;
				hi = target + zr;
			}
			const dtK = (k) => (k / sim.n) * T;
			{
				const { c, w, h: hgt } = sizeCanvas(posCanvas);
				const f0 = frame(c, w, hgt, [0, T], [lo, hi], col, { caption: S.zoom ? "position near target (deg)" : "position (deg)", xCaption: "time (s)", yTicks: 4 });
				const f = { ...f0, X: (k) => f0.X(dtK(k)) };
				// Settle band, and the box the response must stay in after the settling limit.
				const yb0 = f0.Y(target + band);
				const yb1 = f0.Y(target - band);
				c.fillStyle = col.band;
				c.fillRect(f0.x0, yb0, f0.x1 - f0.x0, Math.max(1, yb1 - yb0));
				const xs = f0.X(spec.max_settling_s);
				c.fillStyle = col.goal;
				c.fillRect(xs, yb0, f0.x1 - xs, Math.max(1, yb1 - yb0));
				c.save();
				c.strokeStyle = col.good;
				c.setLineDash([4, 3]);
				c.lineWidth = 1.5;
				c.strokeRect(xs + 0.5, yb0 - 3, f0.x1 - xs - 1, Math.max(1, yb1 - yb0) + 6);
				c.beginPath();
				c.moveTo(Math.round(xs) + 0.5, f0.y0);
				c.lineTo(Math.round(xs) + 0.5, f0.y1);
				c.stroke();
				c.restore();
				hline(c, f0, limitDeg, col.bad, 1.5, [2, 3], null);
				hline(c, f0, target, col.muted, 1.25, [6, 4], null);
				strokeSeries(c, simOther.pos, simOther.end, f, col.ghost, 1.75);
				strokeSeries(c, sim.pos, sim.end, f, col.line, 2.5);
				if (!m.unstable && m.overshootPct > 0.05 && f0.Y(m.peakDeg) >= f0.y0 - 1) {
					const px = f0.X(m.peakT);
					const py = f0.Y(m.peakDeg);
					c.beginPath();
					c.arc(px, py, 3.5, 0, Math.PI * 2);
					c.fillStyle = m.ok.overshoot ? col.line : col.bad;
					c.fill();
				}
				posPlot._f = f0;
			}
			{
				const { c, w, h: hgt } = sizeCanvas(tauCanvas);
				const L = data.torque_limit_nm;
				const f0 = frame(c, w, hgt, [0, T], [-L * 1.3, L * 1.3], col, { caption: "torque (N·m)", yTicks: 2, xLabels: false, bottom: 8 });
				const f = { ...f0, X: (k) => f0.X(dtK(k)) };
				hline(c, f0, L, col.sat, 1.25, [5, 3], `limit ${fmt(L)}`);
				hline(c, f0, -L, col.sat, 1.25, [5, 3], null);
				hline(c, f0, 0, col.muted, 1, null, null);
				// Unsaturated stretches in the line color, saturated stretches thicker in the warning color.
				const stride = Math.max(1, Math.floor(sim.end / ((f.x1 - f.x0) * 2)));
				let k = 0;
				while (k < sim.end) {
					const s0 = sim.sat[k];
					c.beginPath();
					c.moveTo(f.X(k), f.Y(sim.u[k]));
					let j = k;
					while (j + stride < sim.end && sim.sat[j + stride] === s0) {
						j += stride;
						c.lineTo(f.X(j), f.Y(sim.u[j]));
					}
					const next = Math.min(sim.end - 1, j + stride);
					c.lineTo(f.X(next), f.Y(sim.u[next]));
					c.strokeStyle = s0 ? col.sat : col.line;
					c.lineWidth = s0 ? 3.5 : 2;
					c.lineJoin = "round";
					c.lineCap = "round";
					c.stroke();
					if (next === j) break;
					k = next;
				}
				tauPlot._f = f0;
			}
			positionCursors();
		}

		function sampleAt(s, t) {
			const k = Math.max(0, Math.min(s.end - 1, Math.round((t / data.duration_s) * s.n)));
			return k;
		}

		function drawArm(t) {
			if (!sim || root.style.visibility === "hidden") return;
			const k = sampleAt(sim, t);
			const final = t >= data.duration_s - 1e-9;
			const showGhost = reduced() && final && !m.unstable && m.overshootPct > 0.05;
			drawStage(stageCanvas, {
				angleDeg: sim.pos[k],
				targetDeg: data.target_deg,
				limitDeg: data.target_deg * (1 + spec.max_overshoot_pct / 100),
				peakDeg: m.unstable ? NaN : m.peakDeg,
				ghostDeg: showGhost ? m.peakDeg : NaN,
				loaded: S.load === "loaded",
				saturated: !!sim.sat[k],
				color: PAL.ride.ride2,
			});
			timeEl.textContent = `t = ${(k * sim.dt).toFixed(2)} s · ${sim.pos[k].toFixed(1)}°`;
		}

		function positionCursors() {
			const t = S.scrubT ?? playT;
			for (const [plot, cur] of [
				[posPlot, posCursor],
				[tauPlot, tauCursor],
			]) {
				if (t === null || !plot._f) {
					cur.hidden = true;
					continue;
				}
				cur.hidden = false;
				cur.style.transform = `translateX(${plot._f.X(t) - 1}px)`;
				cur.style.top = `${plot._f.y0}px`;
				cur.style.height = `${plot._f.y1 - plot._f.y0}px`;
			}
		}

		function stop() {
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
			playT = null;
		}

		function play() {
			stop();
			S.scrubT = null;
			if (reduced() || destroyed) {
				drawArm(data.duration_s);
				positionCursors();
				return;
			}
			playStart = performance.now();
			const tick = (now) => {
				if (destroyed) return;
				const t = ((now - playStart) / 1000) * rate;
				if (t >= data.duration_s || reduced()) {
					stop();
					drawArm(data.duration_s);
					positionCursors();
					return;
				}
				playT = t;
				drawArm(t);
				positionCursors();
				raf = requestAnimationFrame(tick);
			};
			playT = 0;
			raf = requestAnimationFrame(tick);
		}

		function drawAll() {
			drawPlots();
			drawArm(S.scrubT ?? playT ?? data.duration_s);
			positionCursors();
		}

		// ------------------------------------------------------------ scrubbing on the plots
		let scrubbing = null;
		const scrubTo = (plot, e) => {
			const f = plot._f;
			if (!f) return;
			const rect = plot.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const t = Math.max(0, Math.min(data.duration_s, ((x - f.x0) / (f.x1 - f.x0)) * data.duration_s));
			S.scrubT = t;
			drawArm(t);
			positionCursors();
		};
		for (const plot of [posPlot, tauPlot]) {
			plot.addEventListener("pointerdown", (e) => {
				if (e.button !== undefined && e.button > 0) return;
				stop();
				scrubbing = e.pointerId;
				try {
					plot.setPointerCapture(e.pointerId);
				} catch {
					// Capture can fail for synthetic events; scrubbing still works without it.
				}
				scrubTo(plot, e);
			});
			plot.addEventListener("pointermove", (e) => {
				if (scrubbing === e.pointerId) scrubTo(plot, e);
			});
			const end = (e) => {
				if (scrubbing === e.pointerId) scrubbing = null;
			};
			plot.addEventListener("pointerup", end);
			plot.addEventListener("pointercancel", end);
		}

		// ------------------------------------------------------------ lifecycle
		const ro = new ResizeObserver(() => drawAll());
		ro.observe(root);
		const darkQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
		const onScheme = () => drawAll();
		darkQuery?.addEventListener?.("change", onScheme);
		ctx.onMotionChange = (on) => {
			if (on) {
				stop();
				drawArm(S.scrubT ?? data.duration_s);
				positionCursors();
			}
		};

		update({ replay: true });

		return {
			destroy() {
				destroyed = true;
				stop();
				ro.disconnect();
				darkQuery?.removeEventListener?.("change", onScheme);
				if (ctx.onMotionChange) ctx.onMotionChange = null;
				root.remove();
			},
			test: {
				/** Drive the UI to a slider setting that meets the spec with the payload on. */
				solve() {
					const best = searchGains(data, "loaded");
					S.load = "loaded";
					for (const g of GAINS) S.idx[g.key] = best.idx[g.key];
					update({ replay: true });
					return S.solvedFired;
				},
				state() {
					const g = gains();
					return {
						load: S.load,
						gains: { kp: round(g.kp), ki: round(g.ki), kd: round(g.kd) },
						overshootPct: round(m.overshootPct, 3),
						settlingS: m.settlingS === null ? null : round(m.settlingS, 4),
						steadyStateErrorDeg: round(m.sseDeg, 4),
						unstable: m.unstable,
						met: m.met,
						solved: S.solvedFired,
						zoom: S.zoom,
					};
				},
			},
		};
	},
};
