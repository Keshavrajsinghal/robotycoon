// Line balancing model for wb6-line-balancing: data validation, the steady-state line model
// (cycle times, station availabilities, and buffers that split the line into parts that stop
// independently), a brute-force solver for the test hook, and an indexing-line simulation that
// drives the animation. No words a learner reads live here.

const EPS = 1e-6;
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const isStr = (v) => typeof v === "string" && v.trim() !== "";
const KINDS = new Set(["delta", "scara", "six-axis"]);

/**
 * Check ctx.wb.data against the schema documented in wb6-line-balancing.js.
 * Returns { data } (normalized) or { missing: "<field path>" } for the first bad field.
 */
export function validate(d) {
	if (!d || typeof d !== "object") return { missing: "data" };
	if (!isNum(d.target_per_hour) || d.target_per_hour <= 0) return { missing: "target_per_hour" };
	if (!isNum(d.budget) || d.budget < 0) return { missing: "budget" };
	if (d.cost_unit !== undefined && typeof d.cost_unit !== "string") return { missing: "cost_unit" };
	if (d.transfer_s !== undefined && (!isNum(d.transfer_s) || d.transfer_s < 0)) return { missing: "transfer_s" };
	if (d.parallel_overhead_s !== undefined && (!isNum(d.parallel_overhead_s) || d.parallel_overhead_s < 0)) return { missing: "parallel_overhead_s" };
	if (d.short_stop_s !== undefined && (!isNum(d.short_stop_s) || d.short_stop_s <= 0)) return { missing: "short_stop_s" };
	if (d.stop_s !== undefined && (!isNum(d.stop_s) || d.stop_s <= 0)) return { missing: "stop_s" };
	if (!d.buffer || typeof d.buffer !== "object") return { missing: "buffer" };
	if (!isNum(d.buffer.cost) || d.buffer.cost < 0) return { missing: "buffer.cost" };
	if (!Number.isInteger(d.buffer.capacity) || d.buffer.capacity < 1) return { missing: "buffer.capacity" };
	if (!Array.isArray(d.stations) || d.stations.length < 2) return { missing: "stations" };

	const types = new Map();
	if (d.robot_types !== undefined) {
		if (!Array.isArray(d.robot_types)) return { missing: "robot_types" };
		for (let k = 0; k < d.robot_types.length; k++) {
			const t = d.robot_types[k];
			const at = `robot_types[${k}]`;
			if (!t || typeof t !== "object") return { missing: at };
			if (!isStr(t.id) || types.has(t.id)) return { missing: `${at}.id` };
			if (!KINDS.has(t.kind)) return { missing: `${at}.kind` };
			if (!isStr(t.label)) return { missing: `${at}.label` };
			if (!isNum(t.motion_s) || t.motion_s < 0) return { missing: `${at}.motion_s` };
			if (!isNum(t.cost) || t.cost < 0) return { missing: `${at}.cost` };
			types.set(t.id, { id: t.id, kind: t.kind, label: t.label, motion: t.motion_s, cost: t.cost });
		}
	}

	const stations = [];
	const index = new Map();
	for (let i = 0; i < d.stations.length; i++) {
		const s = d.stations[i];
		const at = `stations[${i}]`;
		if (!s || typeof s !== "object") return { missing: at };
		if (!isStr(s.id) || index.has(s.id)) return { missing: `${at}.id` };
		if (!isNum(s.work_s) || s.work_s < 0) return { missing: `${at}.work_s` };
		if (s.picks !== undefined && (!Number.isInteger(s.picks) || s.picks < 1)) return { missing: `${at}.picks` };
		if (s.availability !== undefined && (!isNum(s.availability) || s.availability <= 0 || s.availability > 1)) return { missing: `${at}.availability` };
		const robot = s.robot ?? null;
		if (robot !== null && !types.has(robot)) return { missing: `${at}.robot` };
		let robotOptions = robot ? [robot] : [];
		if (s.robot_options !== undefined) {
			const ro = s.robot_options;
			if (!robot || !Array.isArray(ro) || !ro.includes(robot) || ro.some((id) => !types.has(id)) || new Set(ro).size !== ro.length) return { missing: `${at}.robot_options` };
			robotOptions = ro.slice();
		}
		if (s.max_robots !== undefined && (!robot || !Number.isInteger(s.max_robots) || s.max_robots < 1)) return { missing: `${at}.max_robots` };
		let tool = null;
		if (s.tool !== undefined && s.tool !== null) {
			if (typeof s.tool !== "object") return { missing: `${at}.tool` };
			if (!isNum(s.tool.saves_s) || s.tool.saves_s <= 0) return { missing: `${at}.tool.saves_s` };
			if (!isNum(s.tool.cost) || s.tool.cost < 0) return { missing: `${at}.tool.cost` };
			if (s.tool.label !== undefined && typeof s.tool.label !== "string") return { missing: `${at}.tool.label` };
			tool = { saves: s.tool.saves_s, cost: s.tool.cost, label: isStr(s.tool.label) ? s.tool.label : null };
		}
		index.set(s.id, i);
		stations.push({
			id: s.id,
			work: s.work_s,
			picks: s.picks ?? null,
			avail: s.availability ?? 1,
			robot,
			robotOptions,
			maxRobots: robot ? (s.max_robots ?? 1) : 1,
			tool,
		});
	}

	const moves = [];
	if (d.moves !== undefined) {
		if (!Array.isArray(d.moves)) return { missing: "moves" };
		for (let k = 0; k < d.moves.length; k++) {
			const mv = d.moves[k];
			const at = `moves[${k}]`;
			if (!mv || typeof mv !== "object") return { missing: at };
			const from = index.get(mv.from);
			const to = index.get(mv.to);
			if (from === undefined) return { missing: `${at}.from` };
			// A task can only move to the station right before or right after it.
			if (to === undefined || Math.abs(from - to) !== 1) return { missing: `${at}.to` };
			if (!isNum(mv.seconds) || mv.seconds <= 0) return { missing: `${at}.seconds` };
			if (!isNum(mv.cost) || mv.cost < 0) return { missing: `${at}.cost` };
			if (mv.label !== undefined && typeof mv.label !== "string") return { missing: `${at}.label` };
			moves.push({ from, to, seconds: mv.seconds, cost: mv.cost, label: isStr(mv.label) ? mv.label : null });
		}
	}

	return {
		data: {
			target: d.target_per_hour,
			takt: 3600 / d.target_per_hour,
			budget: d.budget,
			unit: typeof d.cost_unit === "string" ? d.cost_unit.trim() : "",
			transfer: d.transfer_s ?? 0,
			overhead: d.parallel_overhead_s ?? 0,
			shortStop: d.short_stop_s ?? 0,
			stopMean: d.stop_s ?? 0,
			buffer: { cost: d.buffer.cost, capacity: d.buffer.capacity },
			types,
			stations,
			moves,
		},
	};
}

/**
 * What a robot setup at station i adds to the spend: count robots of the chosen type, less the
 * price of the robot already installed there (it counts toward what is bought; no refunds).
 */
export function robotCost(m, i, type, count) {
	const s = m.stations[i];
	if (!s.robot) return 0;
	return Math.max(0, count * m.types.get(type).cost - m.types.get(s.robot).cost);
}

/** The installed setup: one robot of the installed type at every robot station, null elsewhere. */
export const defaultSetup = (m) => m.stations.map((s) => (s.robot ? { type: s.robot, count: 1 } : null));

/** Every robot setup station i offers, with its cost: [{ type, count, cost }]. */
export function robotChoices(m, i) {
	const s = m.stations[i];
	const out = [];
	for (const type of s.robotOptions) for (let count = 1; count <= s.maxRobots; count++) out.push({ type, count, cost: robotCost(m, i, type, count) });
	return out;
}

/** Seconds of work at station i with robots of the given type (picks x the motion-time change). */
export function typeWork(m, i, type) {
	const s = m.stations[i];
	if (!s.robot || !type) return s.work;
	return Math.max(0, s.work + (s.picks ?? 1) * (m.types.get(type).motion - m.types.get(s.robot).motion));
}

/**
 * Seconds a moved task takes at station i (its from or to station) with robots of the given type:
 * the task's seconds (with the installed robots) changed by the motion-time difference there.
 */
export function taskSeconds(m, seconds, i, type) {
	const s = m.stations[i];
	if (!s.robot || !type) return seconds;
	return Math.max(0, seconds + m.types.get(type).motion - m.types.get(s.robot).motion);
}

/** Every on/off change the learner can buy, with a stable key (robot setups are separate). */
export function buildOptions(m) {
	const opts = [];
	m.stations.forEach((s, i) => {
		if (s.tool) opts.push({ key: `tool:${s.id}`, type: "tool", station: i, cost: s.tool.cost, saves: s.tool.saves, label: s.tool.label });
	});
	m.moves.forEach((mv, k) => opts.push({ key: `move:${k}`, type: "move", station: mv.from, from: mv.from, to: mv.to, cost: mv.cost, seconds: mv.seconds, label: mv.label }));
	m.stations.forEach((s, i) => {
		if (i > 0) opts.push({ key: `buffer:${s.id}`, type: "buffer", station: i, cost: m.buffer.cost });
	});
	return opts;
}

/**
 * Steady-state line for a set of chosen option keys and robot setups (setup[i] = { type, count }
 * at robot stations; omitted or null means the installed robot).
 * - A robot type changes a station's work by picks x (its motion time - the installed type's).
 *   A moved task is one pick: it leaves and arrives at its seconds changed by the same
 *   difference at each end (taskSeconds).
 * - A station's work is that work plus work moved in, minus work moved out and tool savings.
 *   With more than one robot its picks are dealt out whole (largest first, each to the robot with
 *   the least so far) and the busiest robot's share, plus the overhead, is the station's work: its
 *   remaining own picks split its own work equally, moved-in tasks keep their seconds. The cycle
 *   is that work plus the belt transfer time.
 * - Every robot is one more machine that can stop: the station's availability counts once per
 *   robot.
 * - Without buffers the indexing line stops whenever any station stops, so it runs for the
 *   product of all availabilities. A buffer in front of a station splits the line there into
 *   parts that stop independently (treated as big enough to ride out every stop).
 * - Each part makes 3600 * (its availability) / (its slowest cycle) plates per hour; the line
 *   makes the smallest of these. Every station must therefore fit under
 *   limit = takt * (availability of its part).
 */
export function evaluate(m, opts, sel, setup = null) {
	const n = m.stations.length;
	const cfgs = m.stations.map((s, i) => (s.robot ? (setup?.[i] ?? { type: s.robot, count: 1 }) : null));
	const moved = new Array(n).fill(0);
	const out = new Array(n).fill(0); // seconds moved out
	const outCount = new Array(n).fill(0); // picks moved out
	const inTasks = Array.from({ length: n }, () => []); // seconds of each pick moved in
	const inFrom = Array.from({ length: n }, () => []);
	const tool = new Array(n).fill(0);
	const buffer = new Array(n).fill(false);
	let spent = 0;
	for (const o of opts) {
		if (!sel.has(o.key)) continue;
		spent += o.cost;
		if (o.type === "tool") tool[o.station] += o.saves;
		else if (o.type === "move") {
			const leaves = taskSeconds(m, o.seconds, o.from, cfgs[o.from]?.type);
			const arrives = taskSeconds(m, o.seconds, o.to, cfgs[o.to]?.type);
			moved[o.from] -= leaves;
			moved[o.to] += arrives;
			out[o.from] += leaves;
			outCount[o.from]++;
			inTasks[o.to].push(arrives);
			inFrom[o.to].push(m.stations[o.from].id);
		} else if (o.type === "buffer") buffer[o.station] = true;
	}
	const rows = m.stations.map((s, i) => {
		const cfg = cfgs[i];
		const count = cfg ? cfg.count : 1;
		const type = cfg ? m.types.get(cfg.type) : null;
		if (cfg) spent += robotCost(m, i, cfg.type, count);
		const tw = typeWork(m, i, cfg?.type);
		const own = Math.max(0, tw + moved[i] - tool[i]);
		// Deal whole picks to the robots: largest first, each to the robot with the least so far.
		const left = Math.max(1, (s.picks ?? 1) - outCount[i]);
		const each = Math.max(0, tw - out[i] - tool[i]) / left;
		const tasks = [...new Array(left).fill(each), ...inTasks[i]].sort((a, b) => b - a);
		const load = new Array(count).fill(0);
		const picks = new Array(count).fill(0);
		for (const t of tasks) {
			const k = load.indexOf(Math.min(...load));
			load[k] += t;
			picks[k]++;
		}
		const busiest = load.indexOf(Math.max(...load));
		const work = count > 1 ? load[busiest] + m.overhead : own;
		const avail = s.avail ** count;
		return {
			id: s.id,
			base: s.work,
			typeWork: tw,
			picks: s.picks,
			robot: cfg?.type ?? null,
			robotLabel: type?.label ?? null,
			kind: type?.kind ?? null,
			changed: Boolean(cfg && cfg.type !== s.robot),
			count,
			moved: moved[i],
			inFrom: inFrom[i],
			tool: tool[i],
			buffer: buffer[i],
			own,
			work,
			trips: picks[busiest], // picks the busiest robot makes per plate
			cycle: work + m.transfer,
			avail,
		};
	});

	const segs = [];
	rows.forEach((r, i) => {
		if (!segs.length || r.buffer) segs.push({ from: i, to: i, avail: 1, maxCycle: 0 });
		const sg = segs[segs.length - 1];
		sg.to = i;
		sg.avail *= r.avail;
		sg.maxCycle = Math.max(sg.maxCycle, r.cycle);
		r.seg = segs.length - 1;
	});
	for (const sg of segs) sg.rate = sg.maxCycle > EPS ? (3600 * sg.avail) / sg.maxCycle : Number.POSITIVE_INFINITY;
	const rate = Math.min(...segs.map((sg) => sg.rate));
	for (const r of rows) {
		const sg = segs[r.seg];
		r.segAvail = sg.avail;
		r.limit = m.takt * sg.avail;
		r.over = r.cycle > r.limit + EPS;
		r.bottleneck = sg.rate <= rate * (1 + 1e-9) && r.cycle >= sg.maxCycle - EPS;
	}
	const maxCycle = Math.max(...rows.map((r) => r.cycle));
	const meets = rate >= m.target * (1 - 1e-9);
	const within = spent <= m.budget + EPS;
	return { rows, segs, maxCycle, rate, spent, meets, within, solved: meets && within };
}

/** Highest cycle any station can reach (slowest robot type, all tasks moved onto it), for a fixed chart scale. */
export function worstCycle(m) {
	return Math.max(
		m.takt,
		...m.stations.map((s, i) => {
			const types = s.robotOptions.length ? s.robotOptions : [null];
			const work = Math.max(...types.map((t) => typeWork(m, i, t) + m.moves.filter((mv) => mv.to === i).reduce((a, mv) => a + taskSeconds(m, mv.seconds, i, t), 0)));
			return work + m.transfer;
		}),
	);
}

/** Cheapest on/off options that solve the line for a fixed robot setup, within `left`: { cost, count, sel } or null. */
function cheapestOptions(m, opts, setup, left) {
	if (opts.length <= 20) {
		let best = null;
		for (let mask = 0; mask < 1 << opts.length; mask++) {
			let cost = 0;
			let count = 0;
			for (let b = 0; b < opts.length; b++)
				if (mask & (1 << b)) {
					cost += opts[b].cost;
					count++;
				}
			if (cost > left + EPS) continue;
			if (best && (cost > best.cost + EPS || (Math.abs(cost - best.cost) <= EPS && count >= best.count))) continue;
			const sel = new Set(opts.filter((_, b) => mask & (1 << b)).map((o) => o.key));
			if (evaluate(m, opts, sel, setup).solved) best = { cost, count, sel };
		}
		return best;
	}
	// Greedy: keep buying whatever raises the line rate most per unit cost.
	const sel = new Set();
	let cost = 0;
	for (;;) {
		const ev = evaluate(m, opts, sel, setup);
		if (ev.solved) return { cost, count: sel.size, sel };
		let pick = null;
		let bestGain = 0;
		for (const o of opts) {
			if (sel.has(o.key) || cost + o.cost > left + EPS) continue;
			sel.add(o.key);
			const gain = (evaluate(m, opts, sel, setup).rate - ev.rate) / Math.max(o.cost, 0.01);
			sel.delete(o.key);
			if (gain > bestGain + EPS) {
				bestGain = gain;
				pick = o;
			}
		}
		if (!pick) return null;
		sel.add(pick.key);
		cost += pick.cost;
	}
}

/**
 * The cheapest robot setup plus on/off options that meets the target within budget (fewest
 * changes on a tie), as { setup, sel }, or null. Every affordable robot setup is tried; the
 * on/off options are exhaustive up to 20, greedy beyond that.
 */
export function cheapestSolution(m, opts) {
	const setup = defaultSetup(m);
	const robotStations = m.stations.map((s, i) => i).filter((i) => m.stations[i].robot);
	let best = null;
	const visit = (k, cost, changes) => {
		if (best && cost > best.cost + EPS) return; // costs only grow from here
		if (k === robotStations.length) {
			const res = cheapestOptions(m, opts, setup, Math.min(m.budget, best ? best.cost : Number.POSITIVE_INFINITY) - cost);
			if (!res) return;
			const total = cost + res.cost;
			const count = changes + res.count;
			if (best && (total > best.cost + EPS || (Math.abs(total - best.cost) <= EPS && count >= best.count))) return;
			best = { cost: total, count, sel: res.sel, setup: setup.map((c) => (c ? { ...c } : null)) };
			return;
		}
		const i = robotStations[k];
		const s = m.stations[i];
		for (const c of robotChoices(m, i)) {
			if (cost + c.cost > m.budget + EPS) continue;
			setup[i] = { type: c.type, count: c.count };
			visit(k + 1, cost + c.cost, changes + (c.type === s.robot && c.count === 1 ? 0 : 1));
		}
		setup[i] = { type: s.robot, count: 1 };
	};
	visit(0, 0, 0);
	return best ? { setup: best.setup, sel: best.sel } : null;
}

/** Small seeded random generator (mulberry32), so the animation's stops repeat run to run. */
function rng(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Discrete-time indexing line. Each station holds at most one tray. Within one part of the line
 * (the stretch between buffers) every station works on its own tray; when all of them are done,
 * the whole part indexes together (taking `transfer` seconds) and every tray moves one station
 * on. A stopped station halts its whole part, as in the steady-state model. A buffer in front of a
 * station is a queue of up to `cap` trays: the part before it drops trays into it and the part
 * after it takes them out, so the two parts stop waiting for each other until it is full or
 * empty. With stopMean > 0, each station also stops at random so that it is down about
 * (1 - avail) of the time, in stops of about stopMean seconds.
 */
export class LineSim {
	constructor(n, seed = 7) {
		this.n = n;
		this.seed = seed;
		this.reset();
	}

	reset() {
		this.t = 0;
		this.out = 0;
		this.nextId = 1;
		this.rand = rng(this.seed);
		this.st = Array.from({ length: this.n }, () => ({ plate: null, el: 0, stopUntil: -1 }));
		this.q = Array.from({ length: this.n }, () => []);
		this.parts = new Map(); // first station index -> { to, indexing, el }
		this.partOf = new Array(this.n).fill(0);
	}

	/** P = { work[], transfer, buffer[] (bool per station), cap, avail[], stopMean }. */
	step(dt, P) {
		this.t += dt;
		if (P.stopMean > 0) {
			for (let i = 0; i < this.n; i++) {
				const a = P.avail[i];
				if (a >= 1 || this.stopped(i)) continue;
				const perSecond = (1 - a) / (a * P.stopMean);
				if (this.rand() < perSecond * dt) this.st[i].stopUntil = this.t + P.stopMean * (0.5 + this.rand());
			}
		}
		const ranges = [];
		for (let i = 0; i < this.n; i++) {
			if (!P.buffer[i]) this.q[i].length = 0; // a removed buffer's trays leave the line
			if (i === 0 || P.buffer[i]) ranges.push([i, i]);
			ranges[ranges.length - 1][1] = i;
			this.partOf[i] = ranges[ranges.length - 1][0];
		}
		for (const key of [...this.parts.keys()]) if (!ranges.some(([a]) => a === key)) this.parts.delete(key);
		// Downstream parts first, so a tray they take from a buffer frees room in the same step.
		for (let k = ranges.length - 1; k >= 0; k--) this.stepPart(ranges[k][0], ranges[k][1], dt, P);
	}

	stepPart(a, b, dt, P) {
		let s = this.parts.get(a);
		if (!s || s.to !== b) {
			s = { to: b, indexing: false, el: 0 };
			this.parts.set(a, s);
		}
		// Any stopped station halts its whole part: no work and no belt movement until it restarts.
		for (let i = a; i <= b; i++) if (this.stopped(i)) return;
		if (!s.indexing) {
			let ready = true;
			let busy = false;
			for (let i = a; i <= b; i++) {
				const st = this.st[i];
				if (!st.plate) continue;
				busy = true;
				st.el = Math.min(P.work[i], st.el + dt);
				if (st.el >= P.work[i] - EPS) st.plate.stage = Math.max(st.plate.stage, i);
				else ready = false;
			}
			const input = a === 0 || this.q[a].length > 0;
			const room = !this.st[b].plate || b === this.n - 1 || this.q[b + 1].length < P.cap;
			if (ready && room && (busy || input)) {
				s.indexing = true;
				s.el = 0;
			}
			return;
		}
		s.el += dt;
		if (s.el < P.transfer - EPS) return;
		const last = this.st[b].plate;
		if (last) {
			if (b === this.n - 1) this.out++;
			else this.q[b + 1].push(last);
		}
		for (let i = b; i > a; i--) {
			this.st[i].plate = this.st[i - 1].plate;
			this.st[i].el = 0;
		}
		this.st[a].plate = a === 0 ? { id: this.nextId++, stage: -1 } : (this.q[a].shift() ?? null);
		this.st[a].el = 0;
		s.indexing = false;
		s.el = 0;
	}

	run(seconds, P, dt = 0.1) {
		for (let t = 0; t < seconds; t += dt) this.step(dt, P);
	}

	stop(i, seconds) {
		this.st[i].stopUntil = this.t + seconds;
	}

	stopped(i) {
		return this.t < this.st[i].stopUntil;
	}

	/** The part of the line station i belongs to: { from, to, indexing, f (index progress 0..1) }. */
	part(i, P) {
		const from = this.partOf[i];
		const s = this.parts.get(from);
		const f = s?.indexing ? (P.transfer > EPS ? Math.min(1, s.el / P.transfer) : 1) : 0;
		return { from, to: s?.to ?? from, indexing: Boolean(s?.indexing), f };
	}

	/**
	 * What station i is doing: stopped, held (another station in its part is stopped), index (belt
	 * moving), idle (no tray), work, or waiting (done, waiting for the slowest station).
	 */
	phase(i, P) {
		if (this.stopped(i)) return "stopped";
		const p = this.part(i, P);
		for (let k = p.from; k <= p.to; k++) if (this.stopped(k)) return "held";
		if (p.indexing) return "index";
		const s = this.st[i];
		if (!s.plate) return "idle";
		if (s.el < P.work[i] - EPS) return "work";
		return "waiting";
	}
}
