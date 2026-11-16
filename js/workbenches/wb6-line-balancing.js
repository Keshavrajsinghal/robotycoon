// Workbench wb6-line-balancing: balance the cheese plate line so it makes the target rate within a
// budget. Each station is a column: a low-poly diorama on top (an indexing line whose stations
// wait for the slowest one, and stop together when one stops) and its cycle time as a bar below,
// against the takt line and the stricter limit once stops are counted. Every number comes from
// ctx.wb.data; station names come from the ride-1 stop titles in content. Code holds UI chrome only.

/*
DATA SCHEMA (ctx.wb.data: the ```json block under "### Data" in the wb6-line-balancing section of
knowledge/sim/workbenches.md). Times are seconds per plate. Unknown fields are ignored.

  note                  string    Says which values come from which concept and which are
                                  illustrative modeling assumptions.
  target_per_hour       number    > 0. Plates per hour the line must make. The site computes the
                                  takt time (seconds available per plate) as 3600 / target_per_hour.
  budget                number    >= 0. Total the learner may spend on changes.
  cost_unit             string    Optional. What budget and costs are counted in (for example
                                  "pts"); shown after every cost.
  transfer_s            number    Optional, default 0. Seconds per plate the indexing belt spends
                                  moving trays on by one station. Every station pays it on top of
                                  its own work (the lower segment of each bar).
  parallel_overhead_s   number    Optional, default 0. Seconds added to a station's work when more
                                  than one robot shares it (on top of the busiest robot's picks).
  robot_types           array     Optional. Robot types the robot stations can choose from:
    id                  string    Unique; stations name types by it.
    kind                string    "delta", "scara", or "six-axis": which robot the picture draws.
    label               string    Name shown on the option.
    motion_s            number    >= 0. Arm motion time per pick (a benchmark-loop time). Changing
                                  a station's type changes each pick by the difference.
    cost                number    >= 0. Price of one robot of this type.
  buffer                object    { cost: number >= 0, capacity: integer >= 1 }. Price of one
                                  accumulation buffer in front of a station, and how many plates it
                                  holds in the animation. In the line model a buffer splits the line
                                  into two parts that stop independently (treated as big enough to
                                  ride out every stop).
  stop_s                number    Optional, > 0. Typical length in seconds of the random stops the
                                  animation plays (each station is stopped about 1 - availability of
                                  the time). Omit for an animation without random stops.
  short_stop_s          number    Optional, > 0. Length in seconds of the stop the learner can
                                  trigger at the selected station. Omit to hide that button.
  stations              array     At least 2, in line order. Each station:
    id                  string    A ride-1 stop id (denester, grapes, apples, crackers, cheese,
                                  inspection, lidding, outfeed). The column label is that stop's
                                  title from content; the drawing is chosen by id.
    work_s              number    >= 0. Seconds the station's robot or machine is busy per plate
                                  (with its installed robot type, at a robot station).
    picks               integer   Optional, >= 1. Picks (or machine operations) per plate; shown
                                  next to the work and sets how many trips the robot animates.
    availability        number    Optional, 0 < a <= 1, default 1. Share of time the station is
                                  not stopped. Without buffers the line runs for the product of
                                  all availabilities. Each robot counts the station once.
    robot               string    Optional. A robot_types id: the robot installed here. Stations
                                  without one are machines and the drawing is chosen by id.
    robot_options       array     Optional. robot_types ids the learner may choose here, including
                                  robot (default: robot only).
    max_robots          integer   Optional, >= 1, default 1. Most robots that may share the
                                  station. A setup of N robots of type T costs N * T.cost less the
                                  installed robot's cost (never below 0).
    tool                object    Optional. A faster gripper, robot, or method for this station:
                                  { saves_s: number > 0 (seconds removed from work_s),
                                    cost: number >= 0, label: string (optional, its name) }.
  moves                 array     Optional. Tasks that can be handed to a neighbouring station:
    from, to            string    Station ids right next to each other in the line.
    seconds             number    > 0. One pick that leaves "from" and is added to "to": its time
                                  with the installed robots at both stations. A changed robot type
                                  at either end changes it there by the motion-time difference.
    cost                number    >= 0.
    label               string    Optional. What the task is (for example "one apple slice").

Line model: a station's work with robot type T = work_s + picks * (T.motion_s - installed motion_s);
its own work = that work + seconds moved in - seconds moved out - tool saves_s (a moved pick's
seconds changed at each end by that end's motion-time difference). With N > 1 robots the picks are
dealt out whole, largest first to the least-loaded robot (remaining own picks split the station's
own work equally; moved-in picks keep their seconds), and the work is the busiest robot's share plus
parallel_overhead_s. Its cycle = work + transfer_s; its availability is availability^N.
Buffers split the line into
parts; a part's availability is the product of its stations' availabilities. A part makes
3600 * availability / (its slowest cycle) plates per hour and the line makes the smallest of these,
so every station must fit under limit = takt * (availability of its part). Solved when the line
rate >= target_per_hour and the total cost <= budget.
*/

import { h, loadCss } from "../core/dom.js";
import { PAL } from "../engine/park.js";
import { FlowView } from "./wb6-draw.js";
import { buildOptions, cheapestSolution, defaultSetup, evaluate, LineSim, robotCost, taskSeconds, typeWork, validate, worstCycle } from "./wb6-model.js";

const ID = "wb6-line-balancing";
const SIM_SPEED = 8; // simulated seconds per real second in the animation
const STEP = 0.05; // simulation step in seconds
const MINUS = "−";

const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1);
const fnum = (x) => (Number.isInteger(x) ? String(x) : f1(x));
const pct = (x) => `${f1(x * 100)}%`;
const ratePh = (x) => (Number.isFinite(x) ? Math.floor(x + 1e-9) : 0);
/** A cycle and its limit to one decimal, or to two when one decimal would show them equal (17.5 over 17.46). */
const fpair = (a, b) => (f1(a) === f1(b) && Math.abs(a - b) > 1e-6 ? [a.toFixed(2), b.toFixed(2)] : [f1(a), f1(b)]);

function mount(el, ctx) {
	loadCss(`css/modules/${ID}.css`);
	const reduced = () => (typeof ctx.reducedMotion === "function" ? ctx.reducedMotion() : Boolean(ctx.reducedMotion));

	const v = validate(ctx.wb?.data);
	if (v.missing) {
		const msg = h("div", { class: "wb6-error", "data-wb6-error": v.missing }, `Workbench data missing: ${v.missing}`);
		el.append(msg);
		return { destroy: () => msg.remove(), test: { solve: () => false, state: () => ({ error: v.missing }) } };
	}

	const m = v.data;
	const n = m.stations.length;
	const opts = buildOptions(m);
	const ride = ctx.content?.rides?.find((r) => r.id === (ctx.wb.ride || "ride1"));
	const title = (i) => ride?.stops?.find((s) => s.id === m.stations[i].id)?.title ?? m.stations[i].id;
	const unit = m.unit ? ` ${m.unit}` : "";
	const money = (x) => `${fnum(x)}${unit}`;
	const yMax = worstCycle(m) * 1.2;

	const sel = new Set();
	const setup = defaultSetup(m); // robot type and count per robot station
	let ev = evaluate(m, opts, sel, setup);
	let P = null;
	let selected = Math.max(0, ev.rows.findIndex((r) => r.bottleneck));
	let solvedFired = false;
	let destroyed = false;
	let prevSolved = false;
	try {
		prevSolved = !!ctx.state?.workbench?.(ID)?.solved;
	} catch {
		prevSolved = false;
	}

	// ------------------------------------------------------------------ DOM
	const root = h("div", { class: "wb6", "data-wb6": "" });
	root.style.setProperty("--wb6-ride", PAL.ride[ctx.wb.ride] ?? PAL.ride.ride1);

	const taktV = h("strong", { class: "wb6-big" });
	const rateV = h("strong", { class: "wb6-big" });
	const rateOf = h("span", { class: "wb6-of" });
	const rateFill = h("span", { class: "wb6-meter-fill" });
	const rateDelta = h("span", { class: "wb6-delta", "aria-live": "polite" });
	const bnV = h("span", { class: "wb6-sub" });
	const budV = h("strong", { class: "wb6-big" });
	const budOf = h("span", { class: "wb6-of" });
	const budFill = h("span", { class: "wb6-meter-fill" });
	const rateStat = h(
		"div",
		{ class: "wb6-stat wb6-rate" },
		h("span", { class: "wb6-k" }, "Line rate", rateDelta),
		h("span", { class: "wb6-v" }, rateV, rateOf),
		h("span", { class: "wb6-meter", "aria-hidden": "true" }, h("span", { class: "wb6-meter-target" }), rateFill),
		bnV,
	);
	const budStat = h(
		"div",
		{ class: "wb6-stat wb6-budget" },
		h("span", { class: "wb6-k" }, "Budget"),
		h("span", { class: "wb6-v" }, budV, budOf),
		h("span", { class: "wb6-meter", "aria-hidden": "true" }, budFill),
	);
	const stats = h(
		"div",
		{ class: "wb6-stats" },
		h("div", { class: "wb6-stat" }, h("span", { class: "wb6-k" }, "Takt"), h("span", { class: "wb6-v" }, taktV, h("span", { class: "wb6-of" }, " s per plate"))),
		rateStat,
		budStat,
	);
	const banner = h("div", { class: "wb6-banner", role: "status", hidden: true });

	const canvas = h("canvas", { class: "wb6-flow", "aria-hidden": "true" });
	const taktLine = h("div", { class: "wb6-takt", "aria-hidden": "true" }, h("span", { class: "wb6-takt-label" }));
	const limitsEl = h("div", { class: "wb6-limits", "aria-hidden": "true" });
	const cols = m.stations.map((s, i) => {
		const val = h("span", { class: "wb6-val" });
		const work = h("span", { class: "wb6-seg wb6-seg-work" });
		const xfer = h("span", { class: "wb6-seg wb6-seg-xfer" });
		const bar = h("span", { class: "wb6-bar" }, work, xfer);
		const btn = h(
			"button",
			{ type: "button", class: "wb6-col", "data-station": s.id, "aria-pressed": "false", onclick: () => select(i) },
			h("span", { class: "wb6-plot" }, val, bar),
			h("span", { class: "wb6-name" }, h("span", {}, title(i))),
		);
		btn.addEventListener("keydown", (e) => {
			const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
			if (to === undefined || to < 0 || to >= n) return;
			e.preventDefault();
			select(to);
			cols[to].btn.focus();
		});
		return { btn, val, work, xfer, bar };
	});
	const colsEl = h("div", { class: "wb6-cols", style: { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` } }, cols.map((c) => c.btn));
	const chart = h("div", { class: "wb6-chart", role: "group", "aria-label": "Seconds per plate at each station" }, taktLine, limitsEl, colsEl);
	const legend = h(
		"div",
		{ class: "wb6-legend", "aria-hidden": "true" },
		h("span", { class: "wb6-lg wb6-lg-work" }, "work"),
		m.transfer > 0 ? h("span", { class: "wb6-lg wb6-lg-xfer" }, "transfer") : null,
		h("span", { class: "wb6-lg wb6-lg-over" }, "over limit"),
		h("span", { class: "wb6-lg wb6-lg-takt" }, "takt"),
		h("span", { class: "wb6-lg wb6-lg-limit" }, "limit = takt × availability"),
	);
	const viz = h("div", { class: "wb6-viz" }, h("div", { class: "wb6-flow-wrap" }, canvas), chart, legend);

	const panelTitle = h("h3", { class: "wb6-panel-title" });
	const panelChips = h("span", { class: "wb6-chips" });
	const formula = h("div", { class: "wb6-formula" });
	const formulaLimit = h("div", { class: "wb6-formula" });
	const robotBox = h("div", { class: "wb6-robots" });
	const optList = h("div", { class: "wb6-opts" });
	const stopBtn = h(
		"button",
		{
			type: "button",
			class: "btn wb6-stop",
			onclick: () => {
				liveSim.stop(selected, m.shortStop);
				showStopped(true);
				// Bring the line into view: the stop is there to be watched, and the animation
				// (and with it the stop's clock) only runs while the picture is on screen.
				canvas.scrollIntoView({ block: "nearest", behavior: reduced() ? "auto" : "smooth" });
			},
		},
		`Stop this station (${fnum(m.shortStop)} s)`,
	);
	/** The stop button is off (and says so) while the selected station is stopped. */
	function showStopped(on) {
		if (stopBtn.disabled === on) return;
		stopBtn.disabled = on;
		stopBtn.textContent = on ? "Station stopped" : `Stop this station (${fnum(m.shortStop)} s)`;
	}
	// Under reduced motion the line does not move, so a stop would show nothing: say so instead.
	const stopNote = h("span", { class: "wb6-stop-note", hidden: true }, "Stopping a station needs motion, and reduced motion is on.");
	const resetBtn = h("button", { type: "button", class: "btn wb6-reset", onclick: () => reset() }, "Reset");
	const panel = h(
		"section",
		{ class: "wb6-panel", "aria-label": "Selected station" },
		h("div", { class: "wb6-panel-head" }, panelTitle, panelChips),
		h("div", { class: "wb6-formulas" }, formula, formulaLimit),
		robotBox,
		optList,
		h("div", { class: "wb6-actions" }, m.shortStop > 0 ? [stopBtn, stopNote] : null, resetBtn),
	);

	root.append(stats, banner, viz, panel);
	el.append(root);

	// ------------------------------------------------------------------ rendering
	const view = new FlowView(
		canvas,
		m.stations.map((s) => s.id),
	);
	const liveSim = new LineSim(n);
	let shownSim = liveSim;
	let optButtons = [];
	let typeButtons = [];
	let countUi = null;

	function renderStats() {
		taktV.textContent = f1(m.takt);
		rateV.textContent = String(ratePh(ev.rate));
		rateOf.textContent = ` / ${fnum(m.target)} plates/h`;
		rateFill.style.width = `${Math.min(100, (ev.rate / m.target) * 100 * 0.8)}%`;
		rateStat.classList.toggle("is-good", ev.meets);
		const bn = ev.rows.map((r, i) => (r.bottleneck ? title(i) : null)).filter(Boolean);
		bnV.textContent = `Bottleneck: ${bn.join(", ")}`;
		budV.textContent = fnum(ev.spent);
		budOf.textContent = ` / ${money(m.budget)}`;
		budFill.style.width = `${m.budget > 0 ? Math.min(100, (ev.spent / m.budget) * 100) : 0}%`;
		budStat.classList.toggle("is-over", !ev.within);
	}

	function renderChart() {
		chart.style.setProperty("--wb6-takt", String(m.takt / yMax));
		taktLine.firstChild.textContent = `takt ${f1(m.takt)} s`;
		limitsEl.replaceChildren(
			...ev.segs.map((sg, k) =>
				h(
					"span",
					{
						class: `wb6-limit${ev.rows.slice(sg.from, sg.to + 1).some((r) => r.over) ? " is-over" : ""}`,
						style: { left: `${(sg.from / n) * 100}%`, width: `${((sg.to - sg.from + 1) / n) * 100}%`, bottom: `${((m.takt * sg.avail) / yMax) * 100}%` },
					},
					k === 0 ? h("span", { class: "wb6-limit-label" }, `limit ${f1(m.takt * sg.avail)} s`) : null,
				),
			),
		);
		ev.rows.forEach((row, i) => {
			const c = cols[i];
			c.val.textContent = f1(row.cycle);
			c.bar.style.height = `${(row.cycle / yMax) * 100}%`;
			c.work.style.flexGrow = String(row.work);
			c.xfer.style.flexGrow = String(m.transfer);
			c.xfer.hidden = !(m.transfer > 0);
			c.btn.classList.toggle("is-over", row.over);
			c.btn.classList.toggle("is-bn", row.bottleneck);
			c.btn.classList.toggle("has-buffer", row.buffer);
			c.btn.setAttribute("aria-pressed", i === selected ? "true" : "false");
			const [cy, li] = fpair(row.cycle, row.limit);
			c.btn.setAttribute("aria-label", `${title(i)}: ${cy} s per plate, limit ${li} s${row.bottleneck ? ", bottleneck" : ""}${row.over ? ", over limit" : ""}`);
		});
	}

	const chip = (text, kind) => h("span", { class: `wb6-chip ${kind}` }, text);
	const term = (value, caption, cls = "") => h("span", { class: `wb6-term ${cls}` }, h("span", { class: "wb6-term-v" }, value), h("span", { class: "wb6-term-k" }, caption));
	const op = (s) => h("span", { class: "wb6-op", "aria-hidden": "true" }, s);

	function renderFormula() {
		const row = ev.rows[selected];
		const [cy, li] = fpair(row.cycle, row.limit);
		const what = [row.picks ? `${row.picks} ${row.picks === 1 ? "pick" : "picks"}` : null, row.robotLabel].filter(Boolean).join(", ");
		const own = [term(`${f1(row.typeWork)} s`, `work${what ? ` (${what})` : ""}`)];
		if (row.moved > 1e-9) own.push(op("+"), term(`${f1(row.moved)} s`, "moved in"));
		if (row.moved < -1e-9) own.push(op(MINUS), term(`${f1(-row.moved)} s`, "moved out"));
		if (row.tool > 0) own.push(op(MINUS), term(`${f1(row.tool)} s`, "faster"));
		const parts = [];
		if (row.count > 1) {
			// Picks are dealt out whole, so the station waits for its busiest robot.
			if (own.length > 1) parts.push(op("("), ...own, op(")"));
			else parts.push(...own);
			parts.push(op("→"), term(`${f1(row.work - m.overhead)} s`, `busiest of ${row.count} robots (${row.trips} ${row.trips === 1 ? "pick" : "picks"})`));
			if (m.overhead > 0) parts.push(op("+"), term(`${f1(m.overhead)} s`, "overhead"));
		} else parts.push(...own);
		if (m.transfer > 0) parts.push(op("+"), term(`${f1(m.transfer)} s`, "transfer"));
		parts.push(op("="), term(`${cy} s`, "cycle", row.over ? "is-total is-bad" : "is-total is-good"));
		formula.replaceChildren(...parts);
		const seg = ev.segs[row.seg];
		const whole = ev.segs.length === 1;
		formulaLimit.replaceChildren(
			term(`${f1(m.takt)} s`, "takt"),
			op("×"),
			term(pct(seg.avail), whole ? "line availability" : "availability of this part"),
			op("="),
			term(`${li} s`, "limit", "is-total"),
			h("span", { class: "wb6-note" }, `station availability ${pct(row.avail)}${row.count > 1 ? ` (${row.count} robots)` : ""}`),
		);
	}

	function optInfo(o) {
		const i = selected;
		if (o.type === "tool") return { name: o.label ?? "Faster tool", effect: `${MINUS}${f1(o.saves)} s` };
		if (o.type === "buffer") return { name: "Buffer in front", effect: `holds ${m.buffer.capacity}` };
		const what = o.label ?? "a task";
		// The task's seconds here, with the robot type chosen at this station.
		const here = f1(taskSeconds(m, o.seconds, i, setup[i]?.type));
		if (o.from === i) return { name: `Move ${what} to ${title(o.to)}`, effect: `${MINUS}${here} s here` };
		return { name: `Take ${what} from ${title(o.from)}`, effect: `+${here} s here` };
	}

	/** Robot type buttons and the robot count stepper for a robot station. */
	function renderRobots() {
		const s = m.stations[selected];
		typeButtons = [];
		countUi = null;
		robotBox.replaceChildren();
		robotBox.hidden = !s.robot;
		if (!s.robot) return;
		if (s.robotOptions.length > 1) {
			typeButtons = s.robotOptions.map((id) => {
				const t = m.types.get(id);
				const effect = h("span", { class: "wb6-opt-effect" });
				const cost = h("span", { class: "wb6-opt-cost" });
				const btn = h(
					"button",
					{ type: "button", class: "wb6-opt wb6-opt-type", "data-robot-type": id, "aria-pressed": "false", onclick: () => setRobot({ type: id }) },
					h("span", { class: "wb6-opt-check", "aria-hidden": "true" }),
					h("span", { class: "wb6-opt-name" }, t.label),
					h("span", { class: "wb6-opt-meta" }, effect, cost),
				);
				return { id, btn, effect, cost };
			});
			robotBox.append(h("div", { class: "wb6-robots-k" }, "Robot type"), h("div", { class: "wb6-opts", role: "group", "aria-label": "Robot type" }, typeButtons.map((b) => b.btn)));
		}
		if (s.maxRobots > 1) {
			const val = h("output", { class: "wb6-count-v", "aria-live": "polite" });
			const minus = h("button", { type: "button", class: "btn wb6-step", "data-robot-count": "less", "aria-label": "One robot fewer", onclick: () => setRobot({ count: setup[selected].count - 1 }) }, MINUS);
			const plus = h("button", { type: "button", class: "btn wb6-step", "data-robot-count": "more", "aria-label": "One robot more", onclick: () => setRobot({ count: setup[selected].count + 1 }) }, "+");
			const note = h("span", { class: "wb6-count-note" });
			countUi = { val, minus, plus, note };
			robotBox.append(h("div", { class: "wb6-count" }, h("span", { class: "wb6-robots-k" }, "Robots"), minus, val, plus, note));
		}
	}

	function refreshRobots() {
		const s = m.stations[selected];
		if (!s.robot) return;
		const cur = setup[selected];
		const curCost = robotCost(m, selected, cur.type, cur.count);
		const fits = (type, count) => ev.spent - curCost + robotCost(m, selected, type, count) <= m.budget + 1e-9;
		for (const { id, btn, effect, cost } of typeButtons) {
			const on = cur.type === id;
			const afford = on || fits(id, cur.count);
			const perPick = typeWork(m, selected, id) / (s.picks ?? 1);
			btn.setAttribute("aria-pressed", on ? "true" : "false");
			btn.disabled = !afford;
			effect.textContent = `${perPick.toFixed(2)} s per pick`;
			cost.textContent = `${money(m.types.get(id).cost)} each`;
		}
		if (countUi) {
			const { val, minus, plus, note } = countUi;
			val.textContent = String(cur.count);
			minus.disabled = cur.count <= 1;
			const more = cur.count < s.maxRobots;
			plus.disabled = !more || !fits(cur.type, cur.count + 1);
			const left = m.budget - ev.spent;
			const next = more ? robotCost(m, selected, cur.type, cur.count + 1) - curCost : 0;
			note.textContent = !more ? `at most ${s.maxRobots}` : plus.disabled ? `one more: ${money(next)} (${fnum(Math.max(0, left))} left)` : `one more: ${money(next)}`;
		}
	}

	function renderPanel() {
		panelTitle.textContent = title(selected);
		renderRobots();
		const rank = { tool: 1, move: 2, buffer: 3 };
		const mine = opts.filter((o) => (o.type === "move" ? o.from === selected || o.to === selected : o.station === selected)).sort((a, b) => rank[a.type] - rank[b.type]);
		optButtons = mine.map((o) => {
			const info = optInfo(o);
			const effect = h("span", { class: "wb6-opt-effect" }, info.effect);
			const cost = h("span", { class: "wb6-opt-cost" });
			const btn = h(
				"button",
				{ type: "button", class: `wb6-opt wb6-opt-${o.type}`, "data-opt": o.key, "aria-pressed": "false", onclick: () => toggle(o.key) },
				h("span", { class: "wb6-opt-check", "aria-hidden": "true" }),
				h("span", { class: "wb6-opt-name" }, info.name),
				h("span", { class: "wb6-opt-meta" }, effect, cost),
			);
			return { o, btn, effect, cost };
		});
		const robotsOffered = typeButtons.length > 0 || countUi !== null;
		optList.replaceChildren(...(optButtons.length ? optButtons.map((b) => b.btn) : robotsOffered ? [] : [h("p", { class: "wb6-none" }, "No changes on offer at this station.")]));
		refreshPanel();
	}

	function refreshPanel() {
		const row = ev.rows[selected];
		panelChips.replaceChildren(...[row.bottleneck ? chip("Bottleneck", "bn") : null, row.over ? chip("Over limit", "bad") : chip("Fits limit", "good")].filter(Boolean));
		renderFormula();
		refreshRobots();
		const left = m.budget - ev.spent;
		for (const { o, btn, effect, cost } of optButtons) {
			const on = sel.has(o.key);
			effect.textContent = optInfo(o).effect; // a moved task's seconds follow the robot type
			const afford = on || o.cost <= left + 1e-9;
			btn.setAttribute("aria-pressed", on ? "true" : "false");
			btn.disabled = !afford;
			cost.textContent = afford ? money(o.cost) : `${money(o.cost)} (${fnum(Math.max(0, left))} left)`;
		}
		stopBtn.hidden = reduced();
		stopNote.hidden = !reduced();
		showStopped(liveSim.stopped(selected));
	}

	function params(stops = true) {
		return {
			work: ev.rows.map((r) => r.work),
			transfer: m.transfer,
			buffer: ev.rows.map((r) => r.buffer),
			cap: m.buffer.capacity,
			avail: ev.rows.map((r) => r.avail),
			stopMean: stops ? m.stopMean : 0,
		};
	}

	function drawFrame(time) {
		view.draw({ rows: ev.rows, selected, time, reduced: reduced(), sim: shownSim, P: shownSim === liveSim ? P : params(false), buffers: ev.rows.map((r) => r.buffer) });
	}

	/** Reduced motion: show the line's steady state (no random stops), not moving. */
	function renderStatic() {
		const sim = new LineSim(n);
		const Ps = params(false);
		sim.run(Math.min(3000, 30 * ev.maxCycle + 60), Ps, 0.1);
		shownSim = sim;
		if (!view.L) return; // drawn on the first resize
		view.update(sim, Ps, 0, true);
		drawFrame(0);
	}

	function update() {
		ev = evaluate(m, opts, sel, setup);
		P = params();
		renderStats();
		renderChart();
		refreshPanel();
		root.classList.toggle("is-solved", ev.solved);
		if (ev.solved && !solvedFired) {
			solvedFired = true;
			ctx.onSolved?.();
		}
		// The banner keeps the solved record (this visit or an earlier one); the numbers show only
		// while the current choice solves it, so undoing a change never leaves an old rate on screen.
		if (solvedFired || prevSolved) {
			banner.hidden = false;
			banner.replaceChildren(h("strong", {}, "Solved"), ev.solved ? ` ${ratePh(ev.rate)} plates/h for ${fnum(ev.spent)} of ${money(m.budget)}.` : "");
		}
		if (reduced()) renderStatic();
		else schedule();
	}

	let deltaTimer = 0;
	function toggle(key) {
		withDelta(() => {
			if (sel.has(key)) sel.delete(key);
			else sel.add(key);
		});
	}

	/** Change the selected station's robot type or count (clamped to 1..max_robots). */
	function setRobot(patch) {
		const s = m.stations[selected];
		const cur = setup[selected];
		const next = { type: patch.type ?? cur.type, count: Math.max(1, Math.min(s.maxRobots, patch.count ?? cur.count)) };
		if (next.type === cur.type && next.count === cur.count) return;
		const pressed = patch.count === undefined || !countUi ? null : patch.count > cur.count ? countUi.plus : countUi.minus;
		withDelta(() => {
			setup[selected] = next;
		});
		// A stepper button that just reached its end is disabled: keep keyboard focus on the other one.
		if (pressed?.disabled && document.activeElement === pressed) (pressed === countUi.plus ? countUi.minus : countUi.plus).focus();
	}

	/** Apply a change, then show how much it moved the line rate. */
	function withDelta(change) {
		const before = ratePh(ev.rate);
		change();
		update();
		const d = ratePh(ev.rate) - before;
		rateDelta.textContent = d > 0 ? `+${d} plates/h` : d < 0 ? `${MINUS}${-d} plates/h` : "no change";
		rateDelta.className = `wb6-delta ${d > 0 ? "up" : d < 0 ? "down" : "same"}`;
		clearTimeout(deltaTimer);
		deltaTimer = setTimeout(() => {
			rateDelta.textContent = "";
		}, 3500);
	}

	function select(i) {
		if (i === selected) return;
		selected = i;
		renderChart();
		renderPanel();
		if (reduced()) drawFrame(0);
		else schedule();
	}

	function reset() {
		sel.clear();
		setup.splice(0, setup.length, ...defaultSetup(m));
		update();
		rateDelta.textContent = "";
	}

	// ------------------------------------------------------------------ animation
	let raf = 0;
	let last = 0;
	let onScreen = true;

	function frame(now) {
		raf = 0;
		if (destroyed) return;
		if (reduced()) {
			applyMotion(); // the motion event may not have reached us yet
			return;
		}
		const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
		last = now;
		let simDt = dt * SIM_SPEED;
		while (simDt > 1e-9) {
			const d = Math.min(STEP, simDt);
			liveSim.step(d, P);
			simDt -= d;
		}
		view.update(liveSim, P, dt, false);
		drawFrame(now / 1000);
		showStopped(liveSim.stopped(selected));
		schedule();
	}

	function schedule() {
		if (!raf && !destroyed && onScreen && !reduced() && view.L) raf = requestAnimationFrame(frame);
	}

	function stopLoop() {
		if (raf) cancelAnimationFrame(raf);
		raf = 0;
		last = 0;
	}

	function resize() {
		if (!view.resize(colsEl.clientWidth)) return;
		if (reduced()) {
			view.update(shownSim, params(false), 0, true);
			drawFrame(0);
		} else {
			view.update(liveSim, P, 0, true);
			drawFrame(performance.now() / 1000);
			schedule();
		}
	}

	// Tap or click the diorama to pick a station (touch can still scroll the page vertically).
	let down = null;
	canvas.addEventListener("pointerdown", (e) => {
		down = { x: e.clientX, y: e.clientY, id: e.pointerId };
	});
	canvas.addEventListener("pointerup", (e) => {
		if (!down || down.id !== e.pointerId) return;
		const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
		down = null;
		if (moved > 10) return;
		const rect = canvas.getBoundingClientRect();
		select(view.columnAt(e.clientX - rect.left));
	});
	canvas.addEventListener("pointercancel", () => {
		down = null;
	});

	const ro = new ResizeObserver(() => resize());
	ro.observe(colsEl);
	const io = new IntersectionObserver((entries) => {
		onScreen = entries.some((e) => e.isIntersecting);
		if (onScreen) {
			last = 0;
			schedule();
		} else stopLoop();
	});
	io.observe(canvas);

	function applyMotion() {
		if (destroyed) return;
		const rm = reduced();
		root.classList.toggle("wb6-rm", rm);
		stopBtn.hidden = rm;
		stopNote.hidden = !rm;
		if (rm) {
			stopLoop();
			renderStatic();
		} else {
			shownSim = liveSim;
			view.update(liveSim, P, 0, true);
			schedule();
		}
	}
	ctx.onMotionChange = applyMotion;

	// ------------------------------------------------------------------ start
	root.classList.toggle("wb6-rm", reduced());
	P = params();
	liveSim.run(Math.min(600, 6 * ev.maxCycle), params(false), 0.1);
	renderPanel();
	update();
	resize();

	return {
		destroy() {
			destroyed = true;
			stopLoop();
			ro.disconnect();
			io.disconnect();
			clearTimeout(deltaTimer);
			if (ctx.onMotionChange) ctx.onMotionChange = null;
			root.remove();
		},
		test: {
			/** Choose the cheapest set of changes that meets the target, as a learner would. */
			solve() {
				const best = cheapestSolution(m, opts);
				if (!best) return false;
				sel.clear();
				for (const k of best.sel) sel.add(k);
				setup.splice(0, setup.length, ...best.setup);
				update();
				return solvedFired;
			},
			state() {
				return {
					target: m.target,
					takt: m.takt,
					rate: Math.round(ev.rate * 10) / 10,
					spent: ev.spent,
					budget: m.budget,
					bottleneck: ev.rows.filter((r) => r.bottleneck).map((r) => r.id),
					cycles: Object.fromEntries(ev.rows.map((r) => [r.id, Math.round(r.cycle * 100) / 100])),
					limits: ev.segs.map((sg) => ({ from: m.stations[sg.from].id, to: m.stations[sg.to].id, limit: Math.round(m.takt * sg.avail * 100) / 100 })),
					over: ev.rows.filter((r) => r.over).map((r) => r.id),
					chosen: [...sel],
					robots: Object.fromEntries(m.stations.flatMap((s, i) => (setup[i] ? [[s.id, { ...setup[i] }]] : []))),
					selected: m.stations[selected].id,
					simTime: Math.round(liveSim.t * 10) / 10,
					stopped: m.stations.filter((_, i) => liveSim.stopped(i)).map((s) => s.id),
					solved: ev.solved,
					solvedFired,
				};
			},
		},
	};
}

export default { id: ID, mount };
