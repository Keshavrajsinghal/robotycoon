// Model for wb5-teleop (teleoperation under delay). Pure logic, no DOM.
//
// The grape station: a six-axis arm with soft fingers over a tote of grape bunches that lie at
// random angles, and a plate waiting on the belt beside it. The tote does not move. What makes
// delay matter is the operator's own loop and the clock: each plate gives the station
// data.plate_time_s, and the rescue must end with a bunch in the fingers before that runs out, or
// the plate passes without grapes.
//
// Two clocks share one simulated time line:
// - The robot side runs in real time: the arm, the plate clock, the watchdog, and the camera.
// - The operator side only knows what the video shows: each frame reaches it after the video
//   delay, and each command it sends reaches the robot after the command delay. Both directions
//   add a random jitter per packet and lose packets at the loss rate. The slider values are
//   averages: the wait for the next camera frame or the next command slot (half an interval on
//   average) is part of them, so the transport delay is the slider value minus that half interval.
//
// Direct control streams velocity commands (a move pad, like a SpaceMouse): the arm moves while
// the pad is held and stops when it is released, both one command delay later. Remote assist
// sends one grasp point (a stem) and the robot picks by itself with its own live camera.
// The UI and the test hook step the same model with a fixed timestep, so solve() can fast-forward
// it and get the same result a learner would.
//
// Protocol: every command packet carries the operator's whole current intent (mode, velocity,
// grip counter, hint counter and hint point), so a lost packet is repaired by the next one. The
// robot applies only the newest packet (by sequence number) and drops late ones. The operator
// shows only the newest frame and drops frames that arrive after a newer one.

export const SIM_DT = 1000 / 120; // ms per fixed simulation step

/**
 * Station geometry in meters. The tote is centered on the origin: u runs along its length (world
 * x), v across it (world y, negative toward the robot), z is up from the floor. These are drawing
 * proportions; the tote size, speeds, tolerance, timing, and delays that set the difficulty come
 * from the data.
 */
export const GEO = {
	toteZ: 0.8, // height of the tote floor
	wallH: 0.15, // tote wall height
	raised: 0.22, // fingertips above the tote floor when raised (clear of the rim)
	stemZ: 0.045, // fingertips above the tote floor when closed on a stem
	edge: 0.025, // bunches stay this far inside the tote walls
	zone: 0.05, // the arm's allowed zone reaches this far past the tote's inner walls
	homeOut: 0.08, // home: this far outside the tote's robot-side wall, centered
	grapeS: 0.62, // drawn bunch scale (about 0.21 m from stem to tip)
	stemF: -0.175, // stem grasp point along the bunch axis, bunch-local units (times grapeS)
	minGap: 0.14, // smallest distance between two bunch centers
	plateDu: 0.24, // plate center: this far past the tote's +u wall
	plateDv: 0.05, // and this far along v from the tote's center
	beltZ: 0.62, // plate height on the belt
	baseDu: 0.12, // robot base: offset along u from the tote center
	baseDv: 0.5, // and this far behind the tote's robot-side wall
	baseZ: 0.36, // pedestal height
	armScale: 0.7, // arm size (the scale drawSixAxis uses; 1 is a 1.5 m reach)
	viewTop: 1.25, // the camera frames the arm up to this height above its pedestal (times armScale)
};

/** Small seeded random generator (mulberry32), so runs and solve() are repeatable. */
function rng32(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const LOG_LEN = 48; // packet records kept for the live network strips
const LOCAL = new Set(["wd-stop", "wd-clear", "drift", "zone", "hb-end"]);
const EVENT_LEN = 64;

/** Stem grasp point of a bunch lying at (u, v) with heading hd. */
export function stemOf(u, v, hd) {
	const d = GEO.stemF * GEO.grapeS;
	return [u + Math.cos(hd) * d, v + Math.sin(hd) * d];
}

export class TeleopSim {
	/** @param {object} data validated workbench data (see the DATA SCHEMA in wb5-teleop.js) */
	constructor(data, seed = 11) {
		this.D = data;
		this.hu = data.tote_length_m / 2;
		this.hv = data.tote_width_m / 2;
		this.frameEvery = 1000 / data.camera_fps;
		this.cmdEvery = 1000 / data.command_rate_hz;
		this.plateMs = data.plate_time_s * 1000;
		this.vRobot = data.robot_speed_m_s / 1000; // m per ms
		this.net = { video: data.video_ms.default, command: data.command_ms.default, jitter: data.jitter_ms.default, loss: data.loss_pct.default, cut: false };
		this.watchdogOn = true;
		/** Called with each robot event when the operator's video first shows it. */
		this.onEvent = null;
		/** Called at once with robot-side safety events (watchdog, drift, zone), which matter most
		 * exactly when the link is down and no video arrives. They are not repeated via onEvent. */
		this.onLocal = null;
		this.reset(seed);
	}

	/** Round trip of the loop without jitter: video out plus command back. */
	get rtt() {
		return this.net.video + this.net.command;
	}

	/** Where the arm waits at the start of each plate. */
	get home() {
		return [0, -this.hv - GEO.homeOut];
	}

	/** The arm's allowed zone in direct control (the robot's own limit, not the operator's). */
	get zone() {
		return { u0: -this.hu - GEO.zone, u1: this.hu + GEO.zone, v0: -this.hv - GEO.homeOut - 0.02, v1: this.hv + GEO.zone };
	}

	get plateAt() {
		return [this.hu + GEO.plateDu, GEO.plateDv];
	}

	get base() {
		return [GEO.baseDu, -this.hv - GEO.baseDv];
	}

	reset(seed = 11) {
		this.rand = rng32(seed);
		this.t = 0;
		this.nextId = 1;
		this.bunches = [];
		this.fill();
		const [hu0, hv0] = this.home;
		this.grip = { u: hu0, v: hv0, z: GEO.raised, open: 1, holding: null };
		this.robot = {
			mode: "direct",
			phase: "help",
			vel: [0, 0],
			lastRecv: 0,
			lastSeq: 0,
			lastCmdPos: [hu0, hv0],
			gripSeq: 0,
			hintSeq: 0,
			pendingGrip: false,
			pendingHint: null,
			act: null,
			tripped: false,
			drifting: false,
			stale: false,
		};
		this.plate = { grapes: false, shift: 0, n: 0 };
		this.slot = { start: 0, minRtt: this.rtt, engaged: false };
		this.saved = 0;
		this.passed = 0;
		this.events = [];
		this.evSeq = 0;
		this.up = []; // command packets in flight
		this.down = []; // video frames in flight
		this.cmdLog = []; // recent command packet records { seq, status }
		this.frameLog = []; // recent frame records { seq, status }
		this.cmdSeq = 0;
		this.frameSeq = 0;
		this.nextCmd = 0;
		this.nextFrame = this.frameEvery;
		this.newPlate();
		const first = this.snapshot();
		this.op = {
			mode: "direct",
			vel: [0, 0], // m/s, in tote coordinates
			gripSeq: 0,
			hintSeq: 0,
			hint: null, // [u, v] of the stem sent as the grasp point
			hintId: 0, // bunch id of that stem, as the operator chose it
			frame: first,
			frameAt: this.net.video, // no stale warning before the first frame is due
			shownSeq: first.seq,
			shownEv: this.evSeq,
			staleUntil: 0,
			lost: 0,
		};
	}

	/** Top up the tote: bunches at random angles, not overlapping, all inside the walls. */
	fill() {
		const S = GEO.grapeS;
		const lim = [this.hu - GEO.edge, this.hv - GEO.edge];
		// Bunch-local outline points (stem, fruit corners) that must stay inside the walls.
		const outline = [
			[-0.21, 0],
			[-0.15, -0.12],
			[-0.15, 0.12],
			[0.15, -0.12],
			[0.15, 0.12],
		];
		const keep = this.bunches.filter((b) => b.state === "tote");
		const want = this.D.bunches_per_tote;
		for (let tries = 0; keep.length < want && tries < 4000; tries++) {
			const u = (this.rand() * 2 - 1) * lim[0];
			const v = (this.rand() * 2 - 1) * lim[1];
			const hd = this.rand() * Math.PI * 2;
			const ca = Math.cos(hd);
			const sa = Math.sin(hd);
			const inside = outline.every(([f, sd]) => Math.abs(u + (f * ca - sd * sa) * S) <= lim[0] && Math.abs(v + (f * sa + sd * ca) * S) <= lim[1]);
			if (!inside) continue;
			const [su, sv] = stemOf(u, v, hd);
			const clear = keep.every((b) => Math.hypot(b.u - u, b.v - v) >= GEO.minGap && Math.hypot(b.u - su, b.v - sv) >= 0.09 && Math.hypot(b.su - u, b.sv - v) >= 0.09);
			if (!clear) continue;
			keep.push({ id: this.nextId++, u, v, hd, su, sv, state: "tote" });
		}
		this.bunches = keep;
	}

	find(id) {
		return this.bunches.find((b) => b.id === id) ?? null;
	}

	// -------------------------------------------------------------------------------------------
	// Operator actions (what the learner does; the UI and the test hook both call these)

	setMode(mode) {
		this.op.mode = mode;
		this.op.vel = [0, 0];
		this.op.hint = null;
		this.op.hintId = 0;
		this.sendCmd();
	}

	/** Direct mode: the move pad's velocity in m/s, in tote coordinates (capped at the speed cap). */
	setVelocity(vu, vv) {
		const s = Math.hypot(vu, vv);
		const k = s > this.D.speed_cap_m_s ? this.D.speed_cap_m_s / s : 1;
		this.op.vel = [vu * k, vv * k];
	}

	/** Direct mode: lower the fingers and close them wherever the arm is. */
	gripNow() {
		this.op.gripSeq++;
		this.sendCmd();
	}

	/** Assist mode: send this bunch's stem (as the operator's frame shows it) as the grasp point. */
	sendHint(id) {
		const b = this.op.frame.bunches.find((x) => x.id === id);
		if (!b) return false;
		this.op.hintSeq++;
		this.op.hint = [b.su, b.sv];
		this.op.hintId = id;
		this.sendCmd();
		return true;
	}

	// -------------------------------------------------------------------------------------------
	// Read-outs

	get frameAge() {
		return this.op.frame ? this.t - this.op.frame.capture : 0;
	}

	get stale() {
		return this.t < this.op.staleUntil;
	}

	get sinceCmd() {
		return this.t - this.robot.lastRecv;
	}

	/** True while the current plate's clock runs (the arm is waiting for, or doing, the rescue). */
	get working() {
		const p = this.robot.phase;
		return p === "help" || p === "grip" || p === "auto";
	}

	get plateLeft() {
		return this.working ? Math.max(0, this.plateMs - (this.t - this.slot.start)) : null;
	}

	// -------------------------------------------------------------------------------------------
	// Stepping

	step(dt = SIM_DT) {
		const t = (this.t += dt);
		while (t >= this.nextCmd) {
			this.sendCmd();
			this.nextCmd += this.cmdEvery;
		}
		this.deliver(this.up, t, (p, rec) => this.applyCmd(p, rec));
		this.robotStep(dt, t);
		while (t >= this.nextFrame) {
			this.send(this.down, this.frameLog, this.snapshot(), Math.max(0, this.net.video - this.frameEvery / 2));
			this.nextFrame += this.frameEvery;
		}
		this.deliver(this.down, t, (f, rec) => this.showFrame(f, rec));
		// Stale: no new frame for two frame intervals. Held 250 ms so the warning does not flicker.
		if (t - this.op.frameAt > 2 * this.frameEvery) this.op.staleUntil = t + 250;
	}

	send(queue, log, payload, delay) {
		const lost = this.rand() < this.net.loss / 100 || this.net.cut;
		const jitter = this.rand() * this.net.jitter;
		const rec = { seq: payload.seq, status: lost ? "lost" : "flight" };
		log.push(rec);
		if (log.length > LOG_LEN) log.shift();
		if (!lost) queue.push({ at: this.t + delay + jitter, p: payload, rec });
	}

	deliver(queue, t, fn) {
		if (!queue.length) return;
		const due = [];
		let keep = 0;
		for (const q of queue) {
			if (q.at <= t) due.push(q);
			else queue[keep++] = q;
		}
		queue.length = keep;
		due.sort((a, b) => a.at - b.at);
		for (const q of due) fn(q.p, q.rec);
	}

	sendCmd() {
		const op = this.op;
		const payload = {
			seq: ++this.cmdSeq,
			mode: op.mode,
			vel: op.mode === "direct" ? [op.vel[0] / 1000, op.vel[1] / 1000] : [0, 0], // m per ms
			gripSeq: op.gripSeq,
			hintSeq: op.hintSeq,
			hint: op.hint ? [op.hint[0], op.hint[1]] : null,
		};
		this.send(this.up, this.cmdLog, payload, Math.max(0, this.net.command - this.cmdEvery / 2));
	}

	applyCmd(p, rec) {
		const r = this.robot;
		if (p.seq <= r.lastSeq) {
			rec.status = "late";
			return;
		}
		rec.status = "ok";
		r.lastSeq = p.seq;
		r.lastCmdPos = [this.grip.u, this.grip.v];
		if (r.tripped || r.drifting) this.event({ type: "wd-clear", gap: this.t - r.lastRecv });
		r.tripped = false;
		r.drifting = false;
		r.stale = false;
		r.lastRecv = this.t;
		r.mode = p.mode;
		r.vel = p.vel;
		const helping = r.phase === "help";
		if (helping && (p.vel[0] || p.vel[1])) this.slot.engaged = true;
		if (p.gripSeq > r.gripSeq) {
			r.gripSeq = p.gripSeq;
			if (helping && p.mode === "direct") {
				r.pendingGrip = true;
				this.slot.engaged = true;
			}
		}
		if (p.hintSeq > r.hintSeq) {
			r.hintSeq = p.hintSeq;
			if (helping && p.mode === "assist" && p.hint) {
				r.pendingHint = p.hint;
				this.slot.engaged = true;
			}
		}
	}

	event(e) {
		if (LOCAL.has(e.type)) {
			this.onLocal?.({ ...e, t: this.t });
			return;
		}
		this.events.push({ ...e, seq: ++this.evSeq, t: this.t });
		if (this.events.length > EVENT_LEN) this.events.shift();
	}

	moveToward(p, step) {
		const g = this.grip;
		const du = p[0] - g.u;
		const dv = p[1] - g.v;
		const d = Math.hypot(du, dv);
		if (d <= step) {
			g.u = p[0];
			g.v = p[1];
			return true;
		}
		g.u += (du / d) * step;
		g.v += (dv / d) * step;
		return false;
	}

	raise(dt) {
		const g = this.grip;
		g.z = Math.min(GEO.raised, g.z + ((GEO.raised - GEO.stemZ) * dt) / (this.D.grip_time_ms * 0.4));
	}

	newPlate() {
		this.slot = { start: this.t, minRtt: this.rtt, engaged: false };
		const r = this.robot;
		r.phase = "help";
		r.act = null;
		r.vel = [0, 0];
		r.tripped = false;
		r.drifting = false;
		r.stale = false;
		r.pendingGrip = false;
		r.pendingHint = null;
		r.lastRecv = this.t; // a fresh takeover: the watchdog counts from here
		r.lastCmdPos = [this.grip.u, this.grip.v];
		this.plate.grapes = false;
		this.plate.shift = 0;
		this.plate.n++;
		if (this.bunches.filter((b) => b.state === "tote").length < 2) this.fill();
	}

	/** The plate passes without grapes; the arm parks and the next plate comes. */
	passPlate(type, extra = {}) {
		this.passed++;
		this.event({ type, ...extra });
		this.grip.open = 1;
		this.robot.act = { kind: "park", time: 0 };
		this.robot.phase = "park";
		this.robot.vel = [0, 0];
	}

	robotStep(dt, t) {
		const r = this.robot;
		const g = this.grip;
		const D = this.D;
		if (this.working) {
			this.slot.minRtt = this.slot.engaged ? Math.min(this.slot.minRtt, this.rtt) : this.rtt;
			if (t - this.slot.start >= this.plateMs) {
				this.passPlate("timeout");
				return;
			}
		}
		if (r.phase === "help" && r.mode === "direct") {
			const since = t - r.lastRecv;
			if (since > 3 * this.cmdEvery) r.stale = true;
			if (this.watchdogOn) {
				if (!r.tripped && since > D.watchdog_ms) {
					// Controlled stop: zero the velocity and hold position.
					r.tripped = true;
					r.vel = [0, 0];
					this.event({ type: "wd-stop", moved: Math.hypot(g.u - r.lastCmdPos[0], g.v - r.lastCmdPos[1]) });
				}
				if (since > D.heartbeat_timeout_ms) {
					this.passPlate("hb-end");
					return;
				}
			} else if (!r.drifting && since > D.watchdog_ms && (r.vel[0] || r.vel[1])) {
				// No watchdog: nothing zeroes the last velocity, so the arm keeps moving on it.
				r.drifting = true;
				this.event({ type: "drift" });
			}
		}
		const z = this.zone;
		switch (r.phase) {
			case "help": {
				this.raise(dt);
				if (r.mode === "direct") {
					if (!r.tripped && (r.vel[0] || r.vel[1])) {
						const nu = g.u + r.vel[0] * dt;
						const nv = g.v + r.vel[1] * dt;
						g.u = clamp(nu, z.u0, z.u1);
						g.v = clamp(nv, z.v0, z.v1);
						if ((g.u !== nu || g.v !== nv) && r.stale && !this.watchdogOn) {
							// No watchdog: the last velocity kept running until the zone limit stopped it.
							this.event({ type: "zone", moved: Math.hypot(g.u - r.lastCmdPos[0], g.v - r.lastCmdPos[1]) });
							r.vel = [0, 0];
						}
					}
					if (r.pendingGrip) {
						r.pendingGrip = false;
						r.act = { kind: "grip", time: 0, target: null };
						r.phase = "grip";
					}
				} else if (r.pendingHint) {
					const hint = r.pendingHint;
					r.pendingHint = null;
					// The robot's grasp planner turns the clicked point into a full grasp on the nearest stem.
					let best = null;
					let bd = Number.POSITIVE_INFINITY;
					for (const b of this.bunches) {
						if (b.state !== "tote") continue;
						const d = Math.hypot(b.su - hint[0], b.sv - hint[1]);
						if (d < bd) {
							bd = d;
							best = b;
						}
					}
					if (best && bd <= 2 * D.grip_tolerance_m) {
						r.act = { kind: "auto", time: 0, target: best.id, at: false };
						r.phase = "auto";
					} else this.event({ type: "no-stem" });
				}
				break;
			}
			case "grip":
				this.gripStep(dt);
				break;
			case "auto": {
				const a = r.act;
				if (!a.at) {
					const b = this.find(a.target);
					if (!b || b.state !== "tote") {
						r.phase = "help";
						r.act = null;
						this.event({ type: "no-stem" });
						break;
					}
					this.raise(dt);
					a.at = this.moveToward([b.su, b.sv], this.vRobot * dt) && g.z >= GEO.raised - 1e-9;
				} else this.gripStep(dt);
				break;
			}
			case "place": {
				this.raise(dt);
				if (g.z >= GEO.raised - 1e-9 && this.moveToward(this.plateAt, this.vRobot * dt)) {
					const b = this.find(g.holding);
					if (b) b.state = "gone";
					this.bunches = this.bunches.filter((x) => x.state !== "gone");
					g.holding = null;
					g.open = 1;
					this.plate.grapes = true;
					r.phase = "park";
					r.act = { kind: "park", time: 0 };
					this.event({ type: "placed" });
				}
				break;
			}
			case "park": {
				const a = r.act;
				a.time += dt;
				this.raise(dt);
				// The plate moves on along the belt and the next one comes in.
				this.plate.shift = Math.min(1, a.time / 1200);
				const home = this.moveToward(this.home, this.vRobot * dt);
				if (home && a.time >= 1200) this.newPlate();
				break;
			}
			default:
				r.phase = "help";
		}
	}

	/** Lower, close, and lift (grip_time_ms in all). Direct control grips wherever the arm is. */
	gripStep(dt) {
		const r = this.robot;
		const g = this.grip;
		const a = r.act;
		a.time += dt;
		const k = a.time / this.D.grip_time_ms;
		if (k < 0.45) {
			g.z = lerp(GEO.raised, GEO.stemZ, k / 0.45);
			g.open = 1;
		} else if (k < 0.6) {
			g.z = GEO.stemZ;
			g.open = 1 - (k - 0.45) / 0.15;
		} else {
			if (!a.closed) {
				a.closed = true;
				this.close(a);
			}
			g.z = lerp(GEO.stemZ, GEO.raised, Math.min(1, (k - 0.6) / 0.4));
		}
		if (k >= 1) {
			r.act = null;
			r.phase = g.holding ? "place" : "help";
		}
	}

	close(a) {
		const g = this.grip;
		let best = null;
		let bd = Number.POSITIVE_INFINITY;
		for (const b of this.bunches) {
			if (b.state !== "tote") continue;
			const d = Math.hypot(b.su - g.u, b.sv - g.v);
			if (d < bd) {
				bd = d;
				best = b;
			}
		}
		if (a.kind === "auto") best = this.find(a.target) ?? best;
		if (!best || (a.kind !== "auto" && bd > this.D.grip_tolerance_m)) {
			g.open = 1;
			this.event({ type: "miss", dist: bd });
			return;
		}
		best.state = "held";
		g.holding = best.id;
		g.open = 0;
		this.saved++;
		this.event({ type: "pick", id: best.id, mode: a.kind === "auto" ? "assist" : "direct", rtt: Math.round(Math.min(this.slot.minRtt, this.rtt)), secs: (this.t - this.slot.start) / 1000 });
	}

	snapshot() {
		const g = this.grip;
		const bunches = [];
		for (const b of this.bunches) if (b.state === "tote") bunches.push({ id: b.id, u: b.u, v: b.v, hd: b.hd, su: b.su, sv: b.sv });
		return {
			seq: ++this.frameSeq,
			capture: this.t,
			bunches,
			grip: { u: g.u, v: g.v, z: g.z, open: g.open, held: !!g.holding },
			tripped: this.robot.tripped,
			phase: this.robot.phase,
			plateLeft: this.plateLeft,
			plate: { grapes: this.plate.grapes, shift: this.plate.shift },
			ev: this.evSeq,
		};
	}

	showFrame(f, rec) {
		const op = this.op;
		if (f.seq <= op.shownSeq) {
			rec.status = "late";
			return;
		}
		rec.status = "ok";
		op.lost += f.seq - op.shownSeq - 1;
		op.frame = f;
		op.frameAt = this.t;
		op.shownSeq = f.seq;
		if (f.ev > op.shownEv) {
			for (const e of this.events) if (e.seq > op.shownEv && e.seq <= f.ev) this.onEvent?.(e);
			op.shownEv = f.ev;
		}
	}
}
