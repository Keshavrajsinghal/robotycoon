// Ride state machine: where the cart is on the track, which stop it last reached, and the
// play / pause / step / speed / goToStop / restart controls. Rendering lives elsewhere.
//
// Events: "load", "stop" (index, stop), "finish", "move" (targetIndex), "state", "mode" (mode)

import { Emitter } from "../core/events.js";
import { Track } from "./track.js";

const VMAX = 2.6; // m/s at 1x
const ACCEL = 2.0; // m/s^2 at 1x
const DWELL = 7; // seconds parked at a stop while playing, at 1x
export const SPEEDS = [0.5, 1, 2, 4];

/** Stops visible in a mode: classical shows both|classical, learned shows both|learned. */
export function stopsForMode(stops, mode) {
	if (mode === "learned") return stops.filter((s) => s.mode !== "classical");
	return stops.filter((s) => s.mode !== "learned");
}

export function rideHasModes(ride) {
	return ride.stops.some((s) => s.mode === "learned") && ride.stops.some((s) => s.mode === "classical");
}

function plan(D, fast) {
	let v = fast ? Math.min(12, Math.max(VMAX, D / 4)) : VMAX;
	const a = fast ? Math.max(ACCEL, v / 1.2) : ACCEL;
	let ta = v / a;
	let cruise;
	if (a * ta * ta >= D) {
		ta = Math.sqrt(D / a);
		v = a * ta;
		cruise = 0;
	} else cruise = (D - a * ta * ta) / v;
	return { D, v, a, ta, cruise, dur: 2 * ta + cruise };
}

function travelled(m, t) {
	if (t <= m.ta) return 0.5 * m.a * t * t;
	if (t <= m.ta + m.cruise) return 0.5 * m.a * m.ta * m.ta + m.v * (t - m.ta);
	const r = Math.max(0, m.dur - t);
	return m.D - 0.5 * m.a * r * r;
}

export class RideRunner extends Emitter {
	/** @param {{reducedMotion: () => boolean, holdDwell?: () => boolean}} opts */
	constructor({ reducedMotion, holdDwell }) {
		super();
		this.reducedMotion = reducedMotion;
		this.holdDwell = holdDwell ?? (() => false);
		this.ride = null;
		this.module = null;
		this.track = null;
		this.stops = [];
		this.mode = "classical";
		this.index = 0;
		this.finished = false;
		this.s = 0;
		this.move = null;
		this.playing = false;
		this.speed = 1;
		this.dwell = 0;
	}

	/**
	 * Load a ride (content entry) with its module and board at startStopId (default: the first
	 * stop). Throws if the module's track misses a stop.
	 */
	load(ride, module, mode, startStopId = null) {
		this.ride = ride;
		this.module = module;
		this.modeReturn = null;
		this.mode = rideHasModes(ride) ? (mode === "learned" ? "learned" : "classical") : "classical";
		this.buildTrack();
		this.playing = false;
		this.move = null;
		this.emit("load");
		this.jumpTo(Math.max(0, this.stops.findIndex((s) => s.id === startStopId)));
	}

	buildTrack() {
		this.stops = stopsForMode(this.ride.stops, this.mode);
		const track = new Track(this.module.trackFor(this.mode));
		const missing = this.stops.filter((s) => track.stopS[s.id] === undefined).map((s) => s.id);
		if (missing.length) throw new Error(`${this.ride.id} track has no point for stop(s): ${missing.join(", ")}`);
		this.track = track;
	}

	unload() {
		this.ride = null;
		this.module = null;
		this.track = null;
		this.stops = [];
		this.move = null;
		this.playing = false;
		this.emit("state");
	}

	get loaded() {
		return !!this.track;
	}

	get stop() {
		return this.stops[this.index] ?? null;
	}

	sOf(i) {
		return i >= this.stops.length ? this.track.length : this.track.stopS[this.stops[i].id];
	}

	pos() {
		return this.track ? this.track.pointAt(this.s) : null;
	}

	state() {
		return {
			rideId: this.ride?.id ?? null,
			mode: this.mode,
			index: this.index,
			stopId: this.stop?.id ?? null,
			total: this.stops.length,
			finished: this.finished,
			playing: this.playing,
			// A move paused partway (Pause while riding) is not "moving" but is still in progress.
			moving: !!this.move && !this.move.held,
			held: !!this.move?.held,
			target: this.move?.target ?? null,
			speed: this.speed,
			s: this.s,
			length: this.track?.length ?? 0,
		};
	}

	// -------------------------------------------------------------------------
	// Controls

	play() {
		if (!this.track) return;
		if (this.finished) this.jumpTo(0);
		this.playing = true;
		if (this.move) this.move.held = false;
		else this.dwell = 0.35;
		this.emit("state");
	}

	/** Pause. A cart riding between stops stops where it is; Play resumes that move. */
	pause() {
		if (this.playing && this.move) this.move.held = true;
		this.playing = false;
		this.emit("state");
	}

	toggle() {
		if (this.playing) this.pause();
		else this.play();
	}

	stepForward() {
		if (!this.track) return;
		const wasPlaying = this.playing;
		this.playing = false;
		if (this.move) {
			// First press while riding: stop at the stop we are heading to. Second press: arrive now.
			if (!wasPlaying || this.move.target < this.index) this.finishMove();
			this.emit("state");
			return;
		}
		if (this.finished) {
			this.emit("state");
			return;
		}
		this.startMove(this.index + 1);
	}

	stepBack() {
		if (!this.track) return;
		this.playing = false;
		let target;
		if (this.move) target = this.move.target > this.index ? this.index : Math.max(0, this.move.target - 1);
		else target = this.finished ? this.stops.length - 1 : this.index - 1;
		if (target < 0) {
			this.emit("state");
			return;
		}
		this.startMove(target);
	}

	restart() {
		if (!this.track) return;
		this.playing = false;
		this.emit("restart");
		this.jumpTo(0);
	}

	setSpeed(x) {
		this.speed = SPEEDS.includes(x) ? x : 1;
		this.emit("state");
	}

	cycleSpeed() {
		this.setSpeed(SPEEDS[(SPEEDS.indexOf(this.speed) + 1) % SPEEDS.length]);
	}

	/** Ride to stop i (i === stops.length means the end of the track). Jumps under reduced motion. */
	goToStop(i, opts = {}) {
		if (!this.track) return;
		const idx = Math.max(0, Math.min(this.stops.length, i));
		this.playing = false;
		if (opts.jump || this.reducedMotion()) this.jumpTo(idx);
		else this.startMove(idx, true);
	}

	goToStopId(id, opts) {
		const i = this.stops.findIndex((s) => s.id === id);
		if (i >= 0) this.goToStop(i, opts);
		return i >= 0;
	}

	jumpTo(i) {
		this.move = null;
		this.s = this.sOf(i);
		this.arrive(i);
	}

	/** Switch ride-2 style modes, keeping the rider near the equivalent stop. */
	setMode(mode) {
		if (!this.ride || !rideHasModes(this.ride) || mode === this.mode) return;
		const order = this.ride.stops.map((s) => s.id);
		const cur = this.stop;
		const back = this.modeReturn;
		this.modeReturn = null;
		const left = this.mode;
		this.mode = mode;
		this.buildTrack();
		let idx = -1;
		if (cur) {
			// Switching straight back returns to the stop the rider switched from (grasp, not detection).
			if (back && back.at === cur.id && back.mode === mode) idx = this.stops.findIndex((s) => s.id === back.stop);
			if (idx < 0 && cur.replaces?.length) idx = this.stops.findIndex((s) => cur.replaces.includes(s.id));
			if (idx < 0) idx = this.stops.findIndex((s) => s.id === cur.id);
			if (idx < 0) idx = this.stops.findIndex((s) => s.replaces?.includes(cur.id));
			if (idx < 0) idx = this.stops.findIndex((s) => order.indexOf(s.id) >= order.indexOf(cur.id));
		}
		if (idx < 0) idx = 0;
		if (cur && this.stops[idx]) this.modeReturn = { at: this.stops[idx].id, mode: left, stop: cur.id };
		this.playing = false;
		this.emit("mode", mode);
		this.jumpTo(idx);
	}

	// -------------------------------------------------------------------------
	// Internals

	startMove(target, fast = false) {
		const to = this.sOf(target);
		const from = this.s;
		const D = Math.abs(to - from);
		if (this.reducedMotion() || D < 0.01) {
			this.s = to;
			this.move = null;
			this.arrive(target);
			return;
		}
		this.move = { from, to, target, t: 0, ...plan(D, fast) };
		this.emit("move", target);
		this.emit("state");
	}

	finishMove() {
		const m = this.move;
		if (!m) return;
		this.s = m.to;
		this.move = null;
		this.arrive(m.target);
	}

	arrive(target) {
		if (target >= this.stops.length) {
			this.index = this.stops.length - 1;
			this.finished = true;
			this.playing = false;
			this.emit("finish");
		} else {
			this.index = target;
			this.finished = false;
			this.dwell = DWELL;
			this.emit("stop", target, this.stops[target]);
		}
		this.emit("state");
	}

	/** Advance time. Returns true while something is moving or waiting. */
	update(dt) {
		if (!this.track) return false;
		const k = dt * this.speed;
		if (this.move) {
			const m = this.move;
			if (m.held) return false;
			m.t += k;
			if (m.t >= m.dur) this.finishMove();
			else this.s = m.from + Math.sign(m.to - m.from) * travelled(m, m.t);
			return true;
		}
		if (this.playing) {
			if (this.finished) {
				this.playing = false;
				this.emit("state");
				return false;
			}
			if (this.holdDwell()) return true;
			this.dwell -= k;
			if (this.dwell <= 0) this.startMove(this.index + 1);
			return true;
		}
		return false;
	}
}
