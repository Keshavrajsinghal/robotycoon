// Workbench wb5-teleop: teleoperation under delay (booth at ride 3, stop "operator").
//
// The learner is the remote operator of the grape station: a six-axis arm with soft fingers over a
// tote of grape bunches lying at random angles. The canvas is the operator's DELAYED video: a
// robot-side model runs in real time (wb5-sim.js), its camera frames reach the operator after the
// video delay, and the operator's commands reach the robot after the command delay. Sliders set
// both delays, jitter, and packet loss. Each plate gives the station data.plate_time_s; a rescue
// that has not gripped a bunch by then lets the plate pass without grapes.
// Two modes: Direct (a move pad streams velocity commands, like a SpaceMouse; Grip lowers and
// closes the fingers) and Assist (tap a stem; the robot picks it by itself with its own live
// camera, so the round trip is paid once instead of inside every correction). Around the video: a
// latency budget bar, a stale-frame warning, a live network view, and a watchdog that stops the
// arm when no command arrives for too long (it can be switched off to see why it exists).
// Solve: grip a bunch while the round trip stayed at or above data.target_rtt_ms for the whole
// plate (from the operator's first action on that plate).
//
// Every word on screen here is UI chrome (control names, units, short operating hints, status
// read-outs about the simulation). The card title of the budget bar is the latency-budget
// concept's title from content. Every number that stands for a real-world quantity comes from
// ctx.wb.data.
//
// Reduced motion: the task is time-based (the plate clock and the delays are real time), so the
// simulation still runs while the learner lets it. It always starts paused (nothing moves until
// Start or the first action); under reduced motion the tap ripple is a static ring and the budget
// bar does not animate. Results still update.
//
// DATA SCHEMA (ctx.wb.data: the Data JSON of "## Workbench: wb5-teleop" in
// knowledge/sim/workbenches.md). Every field is required unless marked optional.
//
//   note                  string  Says which values come from where and which are illustrative.
//   plate_time_s          number  s     Time the station has per plate. The rescue must end with a
//                                       bunch in the fingers within this time, or the plate passes
//                                       without grapes and the next plate starts.
//   tote_length_m         number  m     Inside length of the tote (0.3 to 1.2).
//   tote_width_m          number  m     Inside width of the tote (0.25 to 0.8, at most the length).
//   bunches_per_tote      integer       Bunches laid in a full tote (2 to 8; fewer fit if crowded).
//                                       The tote is topped up when fewer than 2 are left.
//   speed_cap_m_s         number  m/s   Top gripper speed in direct control (the operator's cap).
//   robot_speed_m_s       number  m/s   Gripper speed when the robot moves by itself (an assisted
//                                       pick, placing the bunch, parking).
//   grip_tolerance_m      number  m     Largest distance between the fingers' center and a stem at
//                                       which closing the fingers grips that bunch.
//   grip_time_ms          number  ms    One grip: lower the fingers, close them, lift (in all).
//   camera_fps            number  1/s   Video frames per second sent by the robot's camera.
//   command_rate_hz       number  1/s   Command packets per second sent by the operator's station.
//                                       Each one also counts as a heartbeat for the watchdog.
//   watchdog_ms           number  ms    In direct control, the arm makes a controlled stop and holds
//                                       position if no command packet arrives for this long.
//   heartbeat_timeout_ms  number  ms    After this long with no command packet the takeover ends,
//                                       the arm parks, and the plate passes. Above watchdog_ms.
//   target_rtt_ms         number  ms    Solve condition: grip a bunch while the round trip (video
//                                       delay + command delay, without jitter) stayed at least this
//                                       for the whole plate. Must be reachable with the sliders:
//                                       video_ms.max + command_ms.max >= this, and the defaults
//                                       must add up to less (so the bench does not start solved).
//   video_ms              range   ms    Video out: from the camera to the operator's screen (the
//                                       wait for the next camera frame included, on average).
//   command_ms            range   ms    Command back: from the operator's hand to the arm moving
//                                       (the wait for the next command slot included, on average).
//   jitter_ms             range   ms    Largest random extra delay added to any one packet, in
//                                       each direction (a uniform draw from 0 to this value).
//   loss_pct              range   %     Chance that any one packet is lost (max below 100).
//
//   range = { "min": number, "max": number, "default": number, "step"?: number }
//     One slider: its limits, its starting value, and optionally its step (default 5 for the
//     ms ranges, 1 for loss_pct). 0 <= min < max, min <= default <= max.

import { h, loadCss } from "../core/dom.js";
import { IsoRenderer } from "../engine/iso.js";
import { drawFrame, drawHud, drawLive, drawRipple, drawStem, drawToolPoint, drawWrist, makeView } from "./wb5-draw.js";
import { SIM_DT, TeleopSim } from "./wb5-sim.js";

const ID = "wb5-teleop";
const POSITIVE = [
	"plate_time_s",
	"tote_length_m",
	"tote_width_m",
	"speed_cap_m_s",
	"robot_speed_m_s",
	"grip_tolerance_m",
	"grip_time_ms",
	"camera_fps",
	"command_rate_hz",
	"watchdog_ms",
	"heartbeat_timeout_ms",
	"target_rtt_ms",
];
const RANGES = ["video_ms", "command_ms", "jitter_ms", "loss_pct"];
const DEAD_ZONE = 0.12; // move pad: deflections below this fraction of its radius count as zero

/** Returns the first missing or malformed field name, or null when the data is usable. */
function validate(d) {
	if (!d || typeof d !== "object") return "data";
	const isNum = (v) => typeof v === "number" && Number.isFinite(v);
	if (typeof d.note !== "string" || !d.note.trim()) return "note";
	for (const k of POSITIVE) if (!isNum(d[k]) || d[k] <= 0) return k;
	if (d.tote_length_m < 0.3 || d.tote_length_m > 1.2) return "tote_length_m";
	if (d.tote_width_m < 0.25 || d.tote_width_m > 0.8 || d.tote_width_m > d.tote_length_m) return "tote_width_m";
	if (!Number.isInteger(d.bunches_per_tote) || d.bunches_per_tote < 2 || d.bunches_per_tote > 8) return "bunches_per_tote";
	if (d.heartbeat_timeout_ms <= d.watchdog_ms) return "heartbeat_timeout_ms";
	for (const k of RANGES) {
		const r = d[k];
		if (!r || typeof r !== "object") return k;
		for (const f of ["min", "max", "default"]) if (!isNum(r[f])) return `${k}.${f}`;
		if (r.min < 0) return `${k}.min`;
		if (r.max <= r.min) return `${k}.max`;
		if (r.default < r.min || r.default > r.max) return `${k}.default`;
		if (r.step !== undefined && !(isNum(r.step) && r.step > 0)) return `${k}.step`;
	}
	if (d.loss_pct.max >= 100) return "loss_pct.max";
	if (d.video_ms.max + d.command_ms.max < d.target_rtt_ms) return "target_rtt_ms";
	if (d.video_ms.default + d.command_ms.default >= d.target_rtt_ms) return "target_rtt_ms";
	return null;
}

const HINTS = {
	direct: "Hold and drag the move pad (or hold the arrow keys on the video) to move the gripper; release to stop. Grip (or Space) lowers and closes the fingers.",
	assist: "Tap a marked stem to send it as the grasp point, or choose one with the arrow keys and press Enter. The robot does the pick itself.",
};

let uidCounter = 0;

export default {
	id: ID,
	mount(el, ctx) {
		const bad = validate(ctx.wb?.data);
		if (bad) {
			el.replaceChildren(h("div", { class: "wb-missing", "data-wb5-data-error": bad }, `Workbench data missing: ${bad}`));
			return {
				destroy() {
					el.replaceChildren();
				},
				test: { solve: () => false, state: () => ({ error: bad }) },
			};
		}
		return mountBench(el, ctx, ctx.wb.data);
	},
};

function mountBench(el, ctx, D) {
	const uid = ++uidCounter;
	const ac = new AbortController();
	const on = (target, type, fn, opts) => target.addEventListener(type, fn, { signal: ac.signal, ...opts });
	const tol = D.grip_tolerance_m;
	const target = D.target_rtt_ms;
	const sim = new TeleopSim(D);
	const geo = { hu: sim.hu, hv: sim.hv, base: sim.base, plateAt: sim.plateAt };
	const mm = (m) => `${Math.round(m * 1000)} mm`;

	let destroyed = false;
	let reduced = !!ctx.reducedMotion;
	let paused = true;
	let started = false;
	let liveView = false;
	let solvedHere = false;
	let solvedShown = false;
	try {
		solvedShown = !!ctx.state?.workbench?.(ID)?.solved;
	} catch {
		solvedShown = false;
	}
	let misses = 0;
	let best = 0;
	let hover = null;
	let selected = null;
	let ripples = [];
	let resets = 0;
	const pad = { x: 0, y: 0, keys: new Set(), pointer: null };

	// --------------------------------------------------------------------------------- DOM

	const root = h("div", { class: "wb5", "data-wb5-mode": "direct", style: { visibility: "hidden" } });
	loadCss("css/modules/wb5-teleop.css").then(() => {
		root.style.visibility = "";
		if (!destroyed) resize(true);
	});

	const modeBtns = [
		["direct", "Direct"],
		["assist", "Assist"],
	].map(([m, label]) => h("button", { type: "button", "data-wb5-mode-btn": m, "aria-pressed": m === "direct" ? "true" : "false", onclick: () => setMode(m) }, label));
	const playBtn = h("button", { type: "button", class: "btn", "data-wb5": "play", onclick: () => setPaused(!paused) }, "Start");
	const resetBtn = h("button", { type: "button", class: "btn", "data-wb5": "reset", onclick: () => reset() }, "Reset");
	const bar = h("div", { class: "wb5-bar" }, h("div", { class: "seg", role: "group", "aria-label": "Control mode" }, ...modeBtns), h("div", { class: "wb5-bar-end" }, playBtn, resetBtn));

	const hintId = `wb5-hint-${uid}`;
	const canvas = h("canvas", { class: "wb5-video", style: { width: "100%", display: "block" }, tabindex: "0", role: "application", "aria-label": "Delayed video of the grape station", "aria-describedby": hintId });
	const stage = h("div", { class: "wb5-stage" }, canvas);
	const hint = h("p", { class: "wb5-hint", id: hintId }, HINTS.direct);

	const knob = h("span", { class: "wb5-knob", "aria-hidden": "true" });
	const padEl = h(
		"div",
		{ class: "wb5-pad", "data-wb5": "pad", tabindex: "0", role: "application", "aria-label": "Move pad: drag to move the gripper, or hold the arrow keys", "aria-describedby": hintId },
		h("span", { class: "wb5-pad-cross", "aria-hidden": "true" }),
		knob,
	);
	const gripBtn = h("button", { type: "button", class: "btn primary wb5-grip", "data-wb5": "grip", onclick: () => grip() }, "Grip");
	// Cut link acts on pointer down, not click: the learner presses it while the arm is moving, so
	// the cut must land before the click moves focus off the move pad (which releases held arrow
	// keys and sends a stop), and a second finger's tap on a phone never becomes a click while the
	// first finger holds the pad. Keyboard and programmatic clicks (detail 0) still toggle it.
	const cutBtn = h("button", { type: "button", class: "btn wb5-cut", "data-wb5": "cut", "aria-pressed": "false", onclick: (e) => e.detail === 0 && setCut(!sim.net.cut) }, "Cut link");
	const wdBox = h("input", { type: "checkbox", id: `wb5-wd-${uid}`, "data-wb5": "watchdog", checked: true });
	const liveBox = h("input", { type: "checkbox", id: `wb5-live-${uid}`, "data-wb5": "live" });
	const score = h("span", { class: "wb5-score" });
	const solvedBadge = h("span", { class: "wb5-solved", hidden: !solvedShown }, "Solved");
	const actions = h(
		"div",
		{ class: "wb5-actions" },
		padEl,
		h("div", { class: "wb5-buttons" }, gripBtn, cutBtn),
		h("div", { class: "wb5-opts" }, h("label", { class: "wb5-check", for: wdBox.id }, wdBox, "Watchdog"), h("label", { class: "wb5-check", for: liveBox.id }, liveBox, "Show robot's live view")),
		h("span", { class: "wb5-score-wrap" }, score, solvedBadge),
	);
	const status = h("p", { class: "wb5-status", role: "status", "aria-live": "polite" });

	// Sliders
	const sliders = {};
	const sliderBox = h("div", { class: "wb5-sliders" });
	for (const [key, field, label, unit] of [
		["video", "video_ms", "Video delay", "ms"],
		["command", "command_ms", "Command delay", "ms"],
		["jitter", "jitter_ms", "Jitter", "ms"],
		["loss", "loss_pct", "Packet loss", "%"],
	]) {
		const r = D[field];
		const id = `wb5-${key}-${uid}`;
		const input = h("input", { type: "range", id, min: r.min, max: r.max, step: r.step ?? (unit === "%" ? 1 : 5), value: r.default, "data-wb5-slider": key });
		const out = h("output", { for: id, class: "wb5-val" });
		const sync = () => {
			const v = Number(input.value);
			sim.net[key] = v;
			out.textContent = unit === "%" ? `${v}%` : `${v} ms`;
		};
		on(input, "input", () => {
			sync();
			updateBudget();
			requestRender();
		});
		sync();
		sliders[key] = input;
		sliderBox.append(h("div", { class: "wb5-slider" }, h("div", { class: "wb5-slider-head" }, h("label", { for: id }, label), out), input));
	}

	// Latency budget bar: video out + command back = round trip, plus worst-case jitter.
	const scaleMax = D.video_ms.max + D.command_ms.max + 2 * D.jitter_ms.max;
	const seg = (cls) => h("span", { class: `wb5-seg ${cls}` });
	const segVideo = seg("wb5-c-video");
	const segCmd = seg("wb5-c-cmd");
	const segJit = seg("wb5-c-jit");
	const targetMark = h("span", { class: "wb5-target", style: { left: `${(target / scaleMax) * 100}%` } }, h("span", { class: "wb5-target-label" }, "target"));
	const track = h("div", { class: "wb5-track", role: "img" }, h("span", { class: "wb5-track-fill" }, segVideo, segCmd, segJit), targetMark);
	const rttVal = h("strong", { class: "wb5-rtt-val" });
	const rttGoal = h("span", { class: "wb5-rtt-goal" });
	const legend = (cls, label) => {
		const val = h("span", { class: "wb5-leg-val" });
		return [h("li", {}, h("span", { class: `wb5-sw ${cls}`, "aria-hidden": "true" }), h("span", {}, label), val), val];
	};
	const [liVideo, lvVideo] = legend("wb5-c-video", "Video out");
	const [liCmd, lvCmd] = legend("wb5-c-cmd", "Command back");
	const [liJit, lvJit] = legend("wb5-c-jit", "Jitter, worst case");
	const travel = h("p", { class: "wb5-travel" });
	const budgetTitle = ctx.content?.concepts?.["latency-budget"]?.title ?? null;
	const budget = h(
		"section",
		{ class: "card wb5-budget" },
		budgetTitle ? h("div", { class: "card-kicker" }, budgetTitle) : null,
		h("div", { class: "wb5-rtt" }, h("span", { class: "wb5-rtt-label" }, "Round trip"), rttVal, rttGoal),
		track,
		h("ul", { class: "wb5-legend" }, liVideo, liCmd, liJit),
		travel,
	);

	// Live network view: recent packets each way, and the robot's watchdog.
	const stripRow = (label) => {
		const cv = h("canvas", { class: "wb5-strip", style: { width: "100%", height: "14px", display: "block" }, "aria-hidden": "true" });
		const val = h("span", { class: "wb5-mon-val" });
		return { cells: [h("span", { class: "wb5-mon-label" }, label), cv, val], cv, val };
	};
	const vStrip = stripRow("Video");
	const cStrip = stripRow("Commands");
	const wdFill = h("span", { class: "wb5-wd-fill" });
	const wdMeter = h("span", { class: "wb5-wd", "aria-hidden": "true" }, wdFill, h("span", { class: "wb5-wd-mark" }));
	const wdVal = h("span", { class: "wb5-mon-val" });
	const monitor = h(
		"section",
		{ class: "card wb5-monitor" },
		h("div", { class: "card-kicker" }, "Live network view"),
		h("div", { class: "wb5-mon-grid" }, ...vStrip.cells, ...cStrip.cells, h("span", { class: "wb5-mon-label" }, "Watchdog"), wdMeter, wdVal),
		h(
			"ul",
			{ class: "wb5-mon-legend" },
			[
				["ok", "arrived"],
				["late", "late, dropped"],
				["lost", "lost"],
				["flight", "in flight"],
			].map(([k, t]) => h("li", {}, h("span", { class: `wb5-dot wb5-dot-${k}`, "aria-hidden": "true" }), t)),
		),
	);

	root.append(bar, stage, hint, actions, status, sliderBox, budget, monitor);
	el.replaceChildren(root);
	root.classList.toggle("wb5-reduced", reduced);
	root.dataset.paused = "true";
	if (solvedShown) root.dataset.solved = "true";

	// --------------------------------------------------------------------------------- state changes

	function say(msg) {
		status.textContent = msg;
	}

	function updateScore() {
		score.textContent = `Plates saved ${sim.saved} · passed ${sim.passed}`;
	}

	function updateBudget() {
		const { video, command, jitter } = sim.net;
		const pct = (ms) => `${(ms / scaleMax) * 100}%`;
		segVideo.style.width = pct(video);
		segCmd.style.width = pct(command);
		segJit.style.width = pct(2 * jitter);
		const rtt = sim.rtt;
		const ok = rtt >= target;
		rttVal.textContent = `${rtt} ms`;
		rttGoal.textContent = ok ? `at or above the ${target} ms target` : `target ${target} ms`;
		root.classList.toggle("wb5-at-target", ok);
		lvVideo.textContent = `${video} ms`;
		lvCmd.textContent = `${command} ms`;
		lvJit.textContent = `up to ${2 * jitter} ms`;
		travel.textContent = `Travel during one round trip at the speed cap: ${mm((D.speed_cap_m_s * rtt) / 1000)} · grip tolerance: ${mm(tol)}`;
		track.setAttribute("aria-label", `Round trip ${rtt} ms: video out ${video} ms, command back ${command} ms, plus up to ${2 * jitter} ms of jitter. Target ${target} ms.`);
	}

	function setMode(m) {
		if (sim.op.mode === m) return;
		releasePad();
		sim.setMode(m);
		root.dataset.wb5Mode = m;
		for (const b of modeBtns) b.setAttribute("aria-pressed", String(b.dataset.wb5ModeBtn === m));
		padEl.hidden = m !== "direct";
		gripBtn.hidden = m !== "direct";
		hint.textContent = HINTS[m];
		hover = null;
		selected = null;
		requestRender();
	}

	function setPaused(p) {
		paused = p;
		if (!p) started = true;
		if (p) releasePad();
		playBtn.textContent = p ? (started ? "Resume" : "Start") : "Pause";
		if (p) root.dataset.paused = "true";
		else delete root.dataset.paused;
		requestRender();
	}

	/** The first action on the bench starts the clock, as Start does. */
	function wake() {
		if (paused) setPaused(false);
	}

	function setCut(v) {
		sim.net.cut = v;
		cutBtn.setAttribute("aria-pressed", String(v));
		cutBtn.textContent = v ? "Restore link" : "Cut link";
		requestRender();
	}

	function reset() {
		const m = sim.op.mode;
		releasePad();
		sim.reset(11 + ++resets);
		sim.op.mode = m;
		sim.robot.mode = m;
		misses = 0;
		best = 0;
		hover = null;
		selected = null;
		ripples = [];
		updateScore();
		say("");
		requestRender();
	}

	function grip() {
		if (sim.op.mode !== "direct") return;
		wake();
		sim.gripNow();
		requestRender();
	}

	function chooseStem(id) {
		wake();
		const b = sim.op.frame.bunches.find((x) => x.id === id);
		if (!b || !sim.sendHint(id)) return;
		ripples.push({ u: b.su, v: b.sv, t0: performance.now() });
		selected = null;
		say("Grasp point sent.");
		requestRender();
	}

	function markSolved(rtt) {
		solvedHere = true;
		solvedShown = true;
		solvedBadge.hidden = false;
		root.dataset.solved = "true";
		say(`Solved: gripped a bunch with the round trip at ${rtt} ms or more for the whole plate.`);
		try {
			ctx.onSolved?.();
		} catch (err) {
			console.error(err);
		}
	}

	// Robot events reach the operator with the video frame that first shows them.
	sim.onEvent = (e) => {
		const clearHint = () => {
			sim.op.hint = null;
			sim.op.hintId = 0;
		};
		switch (e.type) {
			case "pick":
				clearHint();
				best = Math.max(best, e.rtt);
				if (e.rtt >= target && !solvedHere) markSolved(e.rtt);
				else if (e.rtt >= target) say(`Gripped in ${e.secs.toFixed(1)} s at ${e.rtt} ms round trip.`);
				else say(`Gripped in ${e.secs.toFixed(1)} s. Lowest round trip during this plate: ${e.rtt} ms. The target is ${target} ms or more.`);
				break;
			case "miss":
				misses++;
				say(e.dist <= 0.1 ? `Missed: the fingers closed ${mm(e.dist)} from the nearest stem.` : "Missed: no stem under the fingers.");
				break;
			case "timeout":
				clearHint();
				say(`Out of time: ${D.plate_time_s} s per plate. The plate passed without grapes.`);
				break;
			case "no-stem":
				clearHint();
				say("No stem there. Tap a marked stem.");
				break;
			default:
		}
		updateScore();
	};

	// Robot-side safety events are reported as they happen: when the link is down, no video comes
	// to carry them, and they are what the learner needs to see.
	sim.onLocal = (e) => {
		switch (e.type) {
			case "wd-stop":
				say(`At the robot: no command for ${D.watchdog_ms} ms, so the watchdog made a controlled stop. The arm moved ${mm(e.moved)} after the last command and holds position.`);
				break;
			case "wd-clear":
				say(`At the robot: commands arrive again after ${(e.gap / 1000).toFixed(1)} s without any. The arm follows them.`);
				break;
			case "drift":
				say(`At the robot: no command for ${D.watchdog_ms} ms and no watchdog, so the arm keeps moving on its last command.`);
				break;
			case "zone":
				say(`At the robot: with no watchdog the arm kept its last command for ${mm(e.moved)}, until its zone limit stopped it.`);
				break;
			case "hb-end":
				sim.op.hint = null;
				sim.op.hintId = 0;
				say(`At the robot: no command for ${D.heartbeat_timeout_ms / 1000} s, so the takeover ended. The arm parks and the plate passes without grapes.`);
				updateScore();
				break;
			default:
		}
	};

	// --------------------------------------------------------------------------------- input

	let view = null;
	let renderer = null;
	let dpr = 1;

	const localXY = (e) => {
		const r = canvas.getBoundingClientRect();
		return [e.clientX - r.left, e.clientY - r.top];
	};

	/** Nearest stem in the operator's frame within a finger's reach of a canvas point (CSS px). */
	function stemNear(sx, sy) {
		if (!view) return null;
		let found = null;
		let bd = 30;
		for (const b of sim.op.frame.bunches) {
			const [x, y] = view.toScreen(b.su, b.sv);
			const d = Math.hypot(x - sx, y - sy);
			if (d < bd) {
				bd = d;
				found = b.id;
			}
		}
		return found;
	}

	// Move pad: deflection (x, y in -1..1, screen axes) becomes a velocity in the camera's view.
	function applyPad() {
		let { x, y } = pad;
		if (!pad.pointer && pad.keys.size) {
			x = (pad.keys.has("ArrowRight") ? 1 : 0) - (pad.keys.has("ArrowLeft") ? 1 : 0);
			y = (pad.keys.has("ArrowDown") ? 1 : 0) - (pad.keys.has("ArrowUp") ? 1 : 0);
			const n = Math.hypot(x, y);
			if (n > 1) {
				x /= n;
				y /= n;
			}
		}
		const mag = Math.min(1, Math.hypot(x, y));
		knob.style.transform = `translate(${(x * 100).toFixed(1)}%, ${(y * 100).toFixed(1)}%)`;
		padEl.classList.toggle("wb5-pad-on", mag > DEAD_ZONE);
		if (!view || mag <= DEAD_ZONE || sim.op.mode !== "direct") {
			sim.setVelocity(0, 0);
			return;
		}
		const k = ((mag - DEAD_ZONE) / (1 - DEAD_ZONE)) * D.speed_cap_m_s;
		const [du, dv] = view.dirUV(x, y);
		sim.setVelocity(du * k, dv * k);
	}

	function releasePad() {
		pad.x = 0;
		pad.y = 0;
		pad.pointer = null;
		pad.keys.clear();
		applyPad();
	}

	function padFromPointer(e) {
		const r = padEl.getBoundingClientRect();
		const R = r.width / 2;
		let x = (e.clientX - (r.left + R)) / (R * 0.72);
		let y = (e.clientY - (r.top + r.height / 2)) / (R * 0.72);
		const n = Math.hypot(x, y);
		if (n > 1) {
			x /= n;
			y /= n;
		}
		pad.x = x;
		pad.y = y;
		applyPad();
	}

	on(padEl, "pointerdown", (e) => {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		e.preventDefault();
		padEl.focus({ preventScroll: true });
		pad.pointer = e.pointerId;
		try {
			padEl.setPointerCapture(e.pointerId);
		} catch {
			// Synthetic pointers cannot always be captured; the pad still works without it.
		}
		wake();
		padFromPointer(e);
	});
	on(padEl, "pointermove", (e) => {
		if (pad.pointer === e.pointerId) padFromPointer(e);
	});
	const padUp = (e) => {
		if (pad.pointer !== e.pointerId) return;
		pad.pointer = null;
		pad.x = 0;
		pad.y = 0;
		applyPad();
	};
	on(cutBtn, "pointerdown", (e) => {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		e.preventDefault();
		setCut(!sim.net.cut);
	});
	on(padEl, "pointerup", padUp);
	on(padEl, "pointercancel", padUp);
	on(padEl, "lostpointercapture", padUp);

	// In Direct, once running, the video lets a vertical swipe scroll the page on a phone (CSS
	// touch-action: pan-y), so the hint waits for a real tap: a swipe ends in pointercancel instead.
	let directTap = false;
	on(canvas, "pointerdown", (e) => {
		directTap = false;
		if (!view || (e.pointerType === "mouse" && e.button !== 0)) return;
		canvas.focus({ preventScroll: true });
		if (!started) {
			// The "Press Start" label is drawn on the video; a tap there starts the bench.
			e.preventDefault();
			wake();
			return;
		}
		if (sim.op.mode === "direct") {
			directTap = true;
			return;
		}
		e.preventDefault();
		const id = stemNear(...localXY(e));
		if (id) chooseStem(id);
		else say("Tap one of the marked stems.");
	});
	on(canvas, "pointerup", () => {
		if (directTap && sim.op.mode === "direct") say("In Direct, drive with the move pad or the arrow keys, then press Grip.");
		directTap = false;
	});
	on(canvas, "pointercancel", () => {
		directTap = false;
	});
	on(canvas, "pointermove", (e) => {
		if (!view || e.pointerType !== "mouse" || sim.op.mode !== "assist") return;
		const id = stemNear(...localXY(e));
		if (id !== hover) {
			hover = id;
			requestRender();
		}
	});
	on(canvas, "pointerleave", () => {
		if (hover) {
			hover = null;
			requestRender();
		}
	});

	function cycleSelection(dir) {
		const list = [...sim.op.frame.bunches].sort((a, b) => a.su - b.su || a.sv - b.sv);
		if (!list.length) {
			selected = null;
			return;
		}
		const i = list.findIndex((b) => b.id === selected);
		selected = i < 0 ? list[0].id : list[(i + dir + list.length) % list.length].id;
	}

	const ARROWS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);
	const keyDown = (e) => {
		const k = e.key;
		let handled = true;
		if (sim.op.mode === "direct") {
			if (ARROWS.has(k)) {
				if (!pad.keys.has(k)) {
					wake();
					pad.keys.add(k);
					applyPad();
				}
			} else if (k === " " || k === "Enter") {
				if (!e.repeat) grip();
			} else handled = false;
		} else if (k === "ArrowLeft" || k === "ArrowUp") cycleSelection(-1);
		else if (k === "ArrowRight" || k === "ArrowDown") cycleSelection(1);
		else if (k === " " || k === "Enter") {
			if (selected) chooseStem(selected);
		} else handled = false;
		if (handled) {
			e.preventDefault();
			e.stopPropagation();
			requestRender();
		}
	};
	const keyUp = (e) => {
		if (pad.keys.delete(e.key)) {
			applyPad();
			e.preventDefault();
		}
	};
	for (const t of [canvas, padEl]) {
		on(t, "keydown", keyDown);
		on(t, "keyup", keyUp);
		on(t, "blur", () => {
			if (pad.keys.size) {
				pad.keys.clear();
				applyPad();
			}
		});
	}

	on(liveBox, "change", () => {
		liveView = liveBox.checked;
		requestRender();
	});
	on(wdBox, "change", () => {
		sim.watchdogOn = wdBox.checked;
		root.classList.toggle("wb5-wd-off", !wdBox.checked);
		requestRender();
	});

	// --------------------------------------------------------------------------------- drawing

	let colors = {};
	const readColors = () => {
		const cs = getComputedStyle(root);
		const v = (name, fb) => cs.getPropertyValue(name).trim() || fb;
		colors = { ok: v("--good", "#1d7a4b"), late: v("--flag", "#8f5b00"), lost: v("--bad", "#b0362a"), flight: v("--muted", "#59616c") };
	};
	readColors();
	const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
	if (mq?.addEventListener)
		on(mq, "change", () => {
			readColors();
			requestRender();
		});

	let lastW = 0;
	let lastDpr = 0;
	function resize(force = false) {
		const d = Math.min(2, window.devicePixelRatio || 1);
		// Strip canvases keep their CSS width (100% of a grid cell); only the backing store follows it.
		for (const s of [vStrip, cStrip]) {
			const sw = Math.max(1, Math.floor(s.cv.clientWidth));
			if (sw !== s.cv._w || d !== lastDpr) {
				s.cv.width = Math.round(sw * d);
				s.cv.height = Math.round(14 * d);
				s.cv._w = sw;
				s.cv._h = 14;
			}
		}
		const w = Math.max(200, Math.floor(stage.clientWidth));
		if (force || w !== lastW || d !== lastDpr) {
			lastW = w;
			lastDpr = d;
			dpr = d;
			const hgt = Math.round(Math.max(260, Math.min(480, w * (w < 560 ? 0.9 : 0.62))));
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(hgt * dpr);
			canvas.style.height = `${hgt}px`;
			renderer = renderer ?? new IsoRenderer(canvas.getContext("2d"));
			view = makeView(w, hgt, geo);
			if (pad.pointer || pad.keys.size) applyPad();
		}
		readColors();
		requestRender();
	}
	const ro = new ResizeObserver(() => resize());
	ro.observe(stage);
	ro.observe(monitor);

	function render(now) {
		if (!renderer || !view) return;
		const c = renderer.ctx;
		c.setTransform(dpr, 0, 0, dpr, 0, 0);
		renderer.setTransform(view.zoom, view.ox, view.oy);
		const f = sim.op.frame;
		drawFrame(renderer, f, geo, view.w, view.h);
		const helping = f.phase === "help";
		if (sim.op.mode === "assist") {
			for (const b of f.bunches) {
				const kind = b.id === sim.op.hintId ? "goal" : b.id === selected ? "select" : b.id === hover ? "hover" : "offer";
				if (helping || kind === "goal") drawStem(c, view, b.su, b.sv, kind, tol);
			}
			if (selected && !f.bunches.some((b) => b.id === selected)) selected = null;
		} else {
			for (const b of f.bunches) drawStem(c, view, b.su, b.sv, "plain", tol);
			if (helping || f.phase === "grip") drawToolPoint(c, view, f.grip, tol);
		}
		for (const rp of ripples) drawRipple(c, view, rp.u, rp.v, Math.min(1, (now - rp.t0) / 450), reduced);
		if (liveView) drawLive(c, view, sim.grip, tol);
		// Direct mode adds the wrist camera, magnified, so a stem and the grip tolerance are visible.
		let insetW = 0;
		if (sim.op.mode === "direct") {
			insetW = Math.round(Math.max(110, Math.min(180, view.w * 0.26)));
			drawWrist(c, { x: 8, y: view.h - 8 - insetW, size: insetW }, f, geo, tol, liveView ? [sim.grip.u, sim.grip.v] : null);
		}
		const left = f.plateLeft;
		drawHud(c, view.w, view.h, {
			age: sim.frameAge,
			stale: sim.stale,
			plateLeft: left,
			insetW,
			plateLabel: left === null ? "Next plate" : `Plate ${(left / 1000).toFixed(1)} s left`,
			tripped: f.tripped,
			cut: sim.net.cut,
			paused,
			pausedLabel: started ? "Paused" : "Press Start",
			solved: solvedShown,
			live: liveView,
			liveTripped: sim.robot.tripped,
		});
	}

	function drawStrip(s, log) {
		const cv = s.cv;
		if (!cv._w) return { lost: 0, late: 0 };
		const c = cv.getContext("2d");
		c.setTransform(dpr, 0, 0, dpr, 0, 0);
		c.clearRect(0, 0, cv._w, cv._h);
		const cell = 7;
		const gap = 3;
		const n = Math.max(1, Math.floor((cv._w + gap) / (cell + gap)));
		const items = log.slice(-n);
		const x0 = cv._w - items.length * (cell + gap) + gap;
		let lost = 0;
		let late = 0;
		items.forEach((rec, i) => {
			if (rec.status === "lost") lost++;
			if (rec.status === "late") late++;
			c.globalAlpha = rec.status === "flight" ? 0.4 : 1;
			c.fillStyle = colors[rec.status] ?? colors.flight;
			c.fillRect(x0 + i * (cell + gap), 1, cell, cv._h - 2);
		});
		c.globalAlpha = 1;
		return { lost, late };
	}

	let lastUi = -1e9;
	function updateMonitor(now) {
		const v = drawStrip(vStrip, sim.frameLog);
		const k = drawStrip(cStrip, sim.cmdLog);
		if (now - lastUi < 125) return;
		lastUi = now;
		vStrip.val.textContent = `${v.lost} lost · ${v.late} late`;
		cStrip.val.textContent = `${k.lost} lost · ${k.late} late`;
		const since = Math.max(0, Math.round(sim.sinceCmd));
		const tripped = sim.robot.tripped;
		wdFill.style.width = `${Math.min(1, since / (D.watchdog_ms * 1.5)) * 100}%`;
		root.classList.toggle("wb5-tripped", tripped);
		wdVal.textContent = `${!sim.watchdogOn ? "Off" : tripped ? "Stop" : "OK"} · ${since} ms`;
	}

	// --------------------------------------------------------------------------------- loop

	let raf = 0;
	let last = 0;
	let acc = 0;
	function requestRender() {
		if (!raf && !destroyed) raf = requestAnimationFrame(tick);
	}
	function tick(now) {
		raf = 0;
		if (destroyed) return;
		const rm = !!ctx.reducedMotion; // live getter; onMotionChange also triggers a frame
		if (rm !== reduced) {
			reduced = rm;
			root.classList.toggle("wb5-reduced", reduced);
		}
		if (!paused) {
			acc += last ? Math.min(100, now - last) : 0;
			let n = 0;
			while (acc >= SIM_DT && n < 40) {
				sim.step(SIM_DT);
				acc -= SIM_DT;
				n++;
			}
			last = now;
		} else {
			last = 0;
			acc = 0;
		}
		ripples = ripples.filter((r) => now - r.t0 < 450);
		render(now);
		updateMonitor(now);
		if (!paused || ripples.length) requestRender();
	}

	ctx.onMotionChange = () => {
		reduced = !!ctx.reducedMotion;
		root.classList.toggle("wb5-reduced", reduced);
		requestRender();
	};

	updateScore();
	updateBudget();
	resize(true);

	// --------------------------------------------------------------------------------- test hook

	function setSlider(key, value) {
		const input = sliders[key];
		input.value = String(value);
		input.dispatchEvent(new Event("input", { bubbles: true }));
	}

	const test = {
		/** Drive the UI to a solving configuration (Assist, round trip at the target, a fresh plate
		 * through Reset) and run the model forward, tapping the nearest stem, until a grip at that
		 * round trip shows up in the video. */
		solve() {
			if (destroyed) return false;
			setMode("assist");
			setSlider("loss", D.loss_pct.min);
			setSlider("jitter", D.jitter_ms.min);
			setSlider("command", D.command_ms.default);
			setSlider("video", Math.min(D.video_ms.max, target - Number(sliders.command.value)));
			for (let i = 0; i < 1000 && sim.rtt < target; i++) {
				const key = Number(sliders.video.value) < D.video_ms.max ? "video" : "command";
				sliders[key].stepUp();
				sliders[key].dispatchEvent(new Event("input", { bubbles: true }));
			}
			if (sim.net.cut) setCut(false);
			reset();
			setPaused(false);
			const t0 = sim.t;
			while (!solvedHere && sim.t - t0 < 120000) {
				const f = sim.op.frame;
				if (!sim.op.hintId && f.phase === "help" && f.bunches.length) {
					const g = f.grip;
					const near = [...f.bunches].sort((a, b) => Math.hypot(a.su - g.u, a.sv - g.v) - Math.hypot(b.su - g.u, b.sv - g.v))[0];
					chooseStem(near.id);
				}
				sim.step(SIM_DT);
			}
			requestRender();
			return solvedHere;
		},
		/** Stems the operator's video shows, in canvas CSS px (for interaction tests). */
		targets() {
			if (!view) return [];
			return sim.op.frame.bunches.map((b) => {
				const [x, y] = view.toScreen(b.su, b.sv);
				return { id: b.id, x: Math.round(x), y: Math.round(y), u: b.su, v: b.sv };
			});
		},
		/** The gripper as the video shows it and as it really is, in canvas CSS px. */
		gripper() {
			if (!view) return null;
			const f = sim.op.frame.grip;
			const [x, y] = view.toScreen(f.u, f.v);
			const [lx, ly] = view.toScreen(sim.grip.u, sim.grip.v);
			return { shown: { x: Math.round(x), y: Math.round(y), u: f.u, v: f.v, z: f.z }, live: { x: Math.round(lx), y: Math.round(ly), u: sim.grip.u, v: sim.grip.v } };
		},
		state() {
			return {
				mode: sim.op.mode,
				paused,
				videoMs: sim.net.video,
				commandMs: sim.net.command,
				jitterMs: sim.net.jitter,
				lossPct: sim.net.loss,
				rttMs: sim.rtt,
				targetRttMs: target,
				linkCut: sim.net.cut,
				watchdogOn: sim.watchdogOn,
				watchdogTripped: sim.robot.tripped,
				frameAgeMs: Math.round(sim.frameAge),
				stale: sim.stale,
				phase: sim.robot.phase,
				plateLeftMs: sim.plateLeft === null ? null : Math.round(sim.plateLeft),
				saved: sim.saved,
				passed: sim.passed,
				misses,
				bestRttMs: best,
				solved: solvedHere,
				simTimeMs: Math.round(sim.t),
				bunches: sim.bunches.filter((b) => b.state === "tote").length,
				hintId: sim.op.hintId,
				velocity: sim.op.vel.map((x) => Math.round(x * 1000) / 1000),
				grip: [sim.grip.u, sim.grip.v].map((x) => Math.round(x * 1000) / 1000),
			};
		},
	};

	return {
		destroy() {
			destroyed = true;
			ac.abort();
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
			ro.disconnect();
			ctx.onMotionChange = null;
			sim.onEvent = null;
			sim.onLocal = null;
			el.replaceChildren();
		},
		test,
	};
}
