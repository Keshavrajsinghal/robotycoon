// Control loop workbench model (wb3-control): one wrist joint, a PID loop in its servo drive, a
// fixed-step simulation. Pure functions with no DOM, so the same code runs in the page and in Node
// checks.
//
// Plant: the wrist bend joint of a six-axis arm. It turns about a horizontal axis, with the
// fingers hanging straight down at angle 0. Inertia J, viscous damping b, Coulomb friction fc, a
// motor torque limit, and the weight that gravity compensation leaves uncancelled pulling the
// fingers back toward hanging: gravity torque = g * sin(angle), where g is that torque with the
// fingers pointing sideways.
// Controller: PID on position error, run once per drive tick (dt = 1 / drive loop rate); its
// output is the torque the drive's current loop is asked for, and that loop is treated as
// instant. The derivative acts on the measured position (no kick when the target jumps), and the
// integral pauses while the output is saturated in the direction the error pushes (anti-windup
// by conditional integration) and is clamped to a torque limit. The plant is integrated with
// semi-implicit Euler at the same dt, so every run is deterministic.

const DEG = Math.PI / 180;

/**
 * Run one step response from 0 to targetDeg.
 * p: { dt, steps, targetDeg, J, b, fc, g, tauMax, iMax, kp, ki, kd }
 * Returns { n, dt, pos (deg), u (N m), sat (1 when the command hit the limit), unstable, end }
 * where end is the number of valid samples (shorter than n when the loop diverged).
 */
export function simulate(p) {
	const n = p.steps;
	const dt = p.dt;
	const target = p.targetDeg * DEG;
	const pos = new Float32Array(n + 1);
	const u = new Float32Array(n + 1);
	const sat = new Uint8Array(n + 1);
	const limitAbs = Math.max(Math.abs(target) * 20, 4 * Math.PI);
	let th = 0;
	let w = 0;
	let prev = 0;
	let integ = 0;
	let unstable = false;
	let end = n + 1;
	for (let k = 0; k <= n; k++) {
		pos[k] = th / DEG;
		const e = target - th;
		const vel = (th - prev) / dt; // measured velocity: encoder difference over one tick
		prev = th;
		let iNext = integ + e * dt;
		// Anti-windup, part 1: the integral term may contribute at most iMax of torque.
		if (p.ki > 0) iNext = Math.max(-p.iMax / p.ki, Math.min(p.iMax / p.ki, iNext));
		let cmd = p.kp * e + p.ki * iNext - p.kd * vel;
		if (Math.abs(cmd) > p.tauMax && Math.sign(cmd) === Math.sign(e)) {
			// Anti-windup, part 2: saturated and the error pushes further in, so hold the integral.
			iNext = integ;
			cmd = p.kp * e + p.ki * iNext - p.kd * vel;
		}
		integ = iNext;
		const tau = Math.max(-p.tauMax, Math.min(p.tauMax, cmd));
		u[k] = tau;
		sat[k] = Math.abs(cmd) >= p.tauMax ? 1 : 0;
		if (k === n) break;
		// Plant step (semi-implicit Euler): motor torque minus the weight's pull, with stick-slip
		// Coulomb friction.
		const net = tau - p.g * Math.sin(th);
		let acc;
		if (w === 0) acc = Math.abs(net) <= p.fc ? 0 : (net - Math.sign(net) * p.fc) / p.J;
		else acc = (net - p.b * w - Math.sign(w) * p.fc) / p.J;
		let wn = w + acc * dt;
		if (w !== 0 && Math.sign(wn) !== Math.sign(w) && Math.abs(net) <= p.fc) wn = 0;
		w = wn;
		th += w * dt;
		if (!Number.isFinite(th) || Math.abs(th) > limitAbs) {
			unstable = true;
			end = k + 1;
			break;
		}
	}
	return { n, dt, pos, u, sat, unstable, end, targetDeg: p.targetDeg };
}

/**
 * Step-response measurements against a spec.
 * spec: { max_overshoot_pct, max_settling_s, settle_band_pct, max_steady_state_error_deg }
 * Returns { overshootPct, settlingS (null = did not settle), sseDeg, unstable, peakDeg, peakT,
 *           ok: {overshoot, settling, sse}, met, score } where score <= 1 means the spec is met
 *           (the worst of the three measured / allowed ratios).
 */
export function measure(sim, spec, durationS) {
	const { pos, dt, end, targetDeg } = sim;
	const sgn = targetDeg >= 0 ? 1 : -1;
	const step = Math.abs(targetDeg);
	if (sim.unstable || !step) {
		return { overshootPct: Infinity, settlingS: null, sseDeg: Infinity, unstable: true, peakDeg: NaN, peakT: NaN, ok: { overshoot: false, settling: false, sse: false }, met: false, score: Infinity };
	}
	let peak = -Infinity;
	let peakK = 0;
	for (let k = 0; k < end; k++) {
		const v = pos[k] * sgn;
		if (v > peak) {
			peak = v;
			peakK = k;
		}
	}
	const overshootPct = Math.max(0, ((peak - step) / step) * 100);
	const band = (spec.settle_band_pct / 100) * step;
	let last = -1;
	for (let k = end - 1; k >= 0; k--) {
		if (Math.abs(pos[k] * sgn - step) > band) {
			last = k;
			break;
		}
	}
	let settlingS = (last + 1) * dt;
	// Entering the band in the last tenth of the window is not trusted as settled.
	if (last >= end - 1 || settlingS > durationS * 0.9) settlingS = null;
	const tail = Math.max(1, Math.round(end * 0.05));
	let sum = 0;
	for (let k = end - tail; k < end; k++) sum += pos[k] * sgn;
	const sseDeg = Math.abs(step - sum / tail);
	const ok = {
		overshoot: overshootPct <= spec.max_overshoot_pct + 1e-9,
		settling: settlingS !== null && settlingS <= spec.max_settling_s + 1e-9,
		sse: sseDeg <= spec.max_steady_state_error_deg + 1e-9,
	};
	const rOs = spec.max_overshoot_pct > 0 ? overshootPct / spec.max_overshoot_pct : overshootPct > 0 ? Infinity : 0;
	const rTs = settlingS === null ? 2 + (Math.abs(sum / tail - step) / Math.max(band, 1e-9)) * 0.01 : settlingS / spec.max_settling_s;
	const rSs = sseDeg / spec.max_steady_state_error_deg;
	const score = Math.max(rOs, rTs, rSs);
	return { overshootPct, settlingS, sseDeg, unstable: false, peakDeg: peak * sgn, peakT: peakK * dt, ok, met: ok.overshoot && ok.settling && ok.sse, score };
}

/** Plant and controller parameters for one load ('empty' | 'loaded') and a set of gains. */
export function params(data, loadId, gains) {
	const dt = 1 / data.drive_loop_hz;
	return {
		dt,
		steps: Math.round(data.duration_s * data.drive_loop_hz),
		targetDeg: data.target_deg,
		J: data.load[loadId].inertia_kgm2,
		g: data.load[loadId].gravity_nm,
		b: data.damping_nm_s_per_rad,
		fc: data.friction_nm,
		tauMax: data.torque_limit_nm,
		iMax: data.integral_limit_nm,
		kp: gains.kp,
		ki: gains.ki,
		kd: gains.kd,
	};
}

/** Slider grid for one gain: value at index i of 0..STEPS. */
export const STEPS = 200;
export const gainAt = (range, i) => range.min + ((range.max - range.min) * i) / STEPS;
export const indexOf = (range, v) => Math.max(0, Math.min(STEPS, Math.round(((v - range.min) / (range.max - range.min || 1)) * STEPS)));

/**
 * Find slider positions that meet the spec with the given load: a coarse grid over the slider
 * range, then coordinate descent on slider steps. Returns { idx: {kp, ki, kd}, m } of the best
 * found (m.met says whether it meets the spec).
 */
export function searchGains(data, loadId) {
	const g = data.gains;
	const cache = new Map();
	const evalIdx = (a, b, c) => {
		const key = `${a},${b},${c}`;
		let m = cache.get(key);
		if (!m) {
			const sim = simulate(params(data, loadId, { kp: gainAt(g.kp, a), ki: gainAt(g.ki, b), kd: gainAt(g.kd, c) }));
			m = measure(sim, data.spec, data.duration_s);
			cache.set(key, m);
		}
		return m;
	};
	let best = null;
	const coarse = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => Math.round((i * STEPS) / 8));
	for (const a of coarse.slice(1))
		for (const b of coarse)
			for (const c of coarse) {
				const m = evalIdx(a, b, c);
				if (!best || m.score < best.m.score) best = { idx: { kp: a, ki: b, kd: c }, m };
			}
	for (const stepSize of [16, 8, 4, 2, 1]) {
		let improved = true;
		let guard = 0;
		while (improved && guard++ < 60) {
			improved = false;
			for (const key of ["kp", "ki", "kd"])
				for (const d of [-stepSize, stepSize]) {
					const cand = { ...best.idx, [key]: Math.max(0, Math.min(STEPS, best.idx[key] + d)) };
					const m = evalIdx(cand.kp, cand.ki, cand.kd);
					if (m.score < best.m.score - 1e-12) {
						best = { idx: cand, m };
						improved = true;
					}
				}
			if (best.m.met && best.m.score < 0.9) return best;
		}
	}
	return best;
}
