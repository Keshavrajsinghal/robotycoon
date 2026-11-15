// Track geometry: a smooth path through waypoints (centripetal Catmull-Rom), sampled into a
// polyline with cumulative arc length, plus rail drawing for the scene.

const ALPHA = 0.5;
const STEP = 0.2; // meters between samples

const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const dist3 = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);

function catmull(p0, p1, p2, p3, n) {
	const tj = (ti, a, b) => ti + Math.max(1e-4, dist3(a, b)) ** ALPHA;
	const t0 = 0;
	const t1 = tj(t0, p0, p1);
	const t2 = tj(t1, p1, p2);
	const t3 = tj(t2, p2, p3);
	const out = [];
	for (let i = 0; i < n; i++) {
		const t = t1 + ((t2 - t1) * i) / n;
		const a1 = lerp3(p0, p1, (t - t0) / (t1 - t0));
		const a2 = lerp3(p1, p2, (t - t1) / (t2 - t1));
		const a3 = lerp3(p2, p3, (t - t2) / (t3 - t2));
		const b1 = lerp3(a1, a2, (t - t0) / (t2 - t0));
		const b2 = lerp3(a2, a3, (t - t1) / (t3 - t1));
		out.push(lerp3(b1, b2, (t - t1) / (t2 - t1)));
	}
	return out;
}

export class Track {
	/**
	 * @param {{points: number[][], stops: Record<string, number>}} def  points are [x,y,z]
	 *   waypoints (z defaults to 0); stops maps a stop id to a waypoint index.
	 */
	constructor(def) {
		const pts = def.points.map((p) => [p[0], p[1], p[2] ?? 0]);
		if (pts.length < 2) throw new Error("a track needs at least two points");
		this.points = pts;
		const samples = [];
		const wpSample = [];
		for (let i = 0; i < pts.length - 1; i++) {
			const p1 = pts[i];
			const p2 = pts[i + 1];
			const p0 = i > 0 ? pts[i - 1] : lerp3(p1, p2, -1);
			const p3 = i + 2 < pts.length ? pts[i + 2] : lerp3(p2, p1, -1);
			wpSample[i] = samples.length;
			const n = Math.max(2, Math.ceil(dist3(p1, p2) / STEP));
			samples.push(...catmull(p0, p1, p2, p3, n));
		}
		wpSample[pts.length - 1] = samples.length;
		samples.push(pts[pts.length - 1]);
		const cum = new Float64Array(samples.length);
		for (let i = 1; i < samples.length; i++) cum[i] = cum[i - 1] + dist3(samples[i - 1], samples[i]);
		this.samples = samples;
		this.cum = cum;
		this.length = cum[cum.length - 1];
		this.stopS = {};
		for (const [id, idx] of Object.entries(def.stops ?? {})) {
			if (idx < 0 || idx >= pts.length) throw new Error(`stop ${id} points at waypoint ${idx}, which does not exist`);
			this.stopS[id] = cum[wpSample[idx]];
		}
	}

	/** Position and heading at arc length s. heading is the angle of travel in the x-y plane. */
	pointAt(s) {
		const { cum, samples } = this;
		const L = this.length;
		const v = Math.max(0, Math.min(L, s));
		let lo = 0;
		let hi = cum.length - 1;
		while (hi - lo > 1) {
			const mid = (lo + hi) >> 1;
			if (cum[mid] <= v) lo = mid;
			else hi = mid;
		}
		const seg = cum[hi] - cum[lo] || 1;
		const t = (v - cum[lo]) / seg;
		const a = samples[lo];
		const b = samples[hi];
		const p = lerp3(a, b, t);
		const dx = b[0] - a[0];
		const dy = b[1] - a[1];
		return { x: p[0], y: p[1], z: p[2], heading: Math.atan2(dy, dx), slope: Math.atan2(b[2] - a[2], Math.hypot(dx, dy) || 1) };
	}

	/**
	 * Add rail drawing to a scene as short depth-sorted chunks.
	 * opts: { group, rail, tie, spine, column, gauge }
	 */
	draw(scene, opts = {}) {
		const rail = opts.rail ?? "#5b6472";
		const railHi = opts.railHi ?? "#c9d1db";
		const tie = opts.tie ?? "#8a6a4b";
		const spine = opts.spine ?? "#7a8594";
		const column = opts.column ?? "#9aa5b1";
		const g = (opts.gauge ?? 0.62) / 2;
		const S = this.samples;
		const CH = 6;
		for (let i0 = 0; i0 < S.length - 1; i0 += CH) {
			const i1 = Math.min(S.length - 1, i0 + CH);
			const chunk = S.slice(i0, i1 + 1);
			const left = [];
			const right = [];
			const ties = [];
			let x0 = Infinity;
			let y0 = Infinity;
			let x1 = -Infinity;
			let y1 = -Infinity;
			let zMax = 0;
			chunk.forEach((p, k) => {
				const a = chunk[Math.max(0, k - 1)];
				const b = chunk[Math.min(chunk.length - 1, k + 1)];
				let dx = b[0] - a[0];
				let dy = b[1] - a[1];
				const l = Math.hypot(dx, dy) || 1;
				dx /= l;
				dy /= l;
				const nx = -dy;
				const ny = dx;
				left.push([p[0] + nx * g, p[1] + ny * g, p[2] + 0.1]);
				right.push([p[0] - nx * g, p[1] - ny * g, p[2] + 0.1]);
				if ((i0 + k) % 3 === 0 && k < chunk.length - 1) {
					const w = g + 0.16;
					const d = 0.08;
					ties.push([
						[p[0] + nx * w - dx * d, p[1] + ny * w - dy * d, p[2] + 0.03],
						[p[0] + nx * w + dx * d, p[1] + ny * w + dy * d, p[2] + 0.03],
						[p[0] - nx * w + dx * d, p[1] - ny * w + dy * d, p[2] + 0.03],
						[p[0] - nx * w - dx * d, p[1] - ny * w - dy * d, p[2] + 0.03],
					]);
				}
				x0 = Math.min(x0, p[0] - 0.6);
				y0 = Math.min(y0, p[1] - 0.6);
				x1 = Math.max(x1, p[0] + 0.6);
				y1 = Math.max(y1, p[1] + 0.6);
				zMax = Math.max(zMax, p[2] + 0.2);
			});
			const elevated = zMax > 0.5;
			const columns = elevated ? chunk.filter((_, k) => (i0 + k) % 15 === 0 && chunk[k][2] > 0.5) : [];
			scene.add({
				group: opts.group,
				layer: elevated ? 2 : 1,
				bounds: [x0, y0, 0, x1, y1, zMax],
				draw: (r) => {
					for (const c of columns) r.box(c[0] - 0.14, c[1] - 0.14, 0, 0.28, 0.28, c[2] - 0.12, column);
					if (elevated)
						for (let k = 0; k < chunk.length - 1; k++) {
							const a = chunk[k];
							const b = chunk[k + 1];
							r.beam([a[0], a[1], a[2] - 0.08], [b[0], b[1], b[2] - 0.08], 0.5, 0.16, spine);
						}
					for (const q of ties) r.quad(q, tie, { flat: true });
					r.polyline(left, rail, 3.2);
					r.polyline(right, rail, 3.2);
					r.polyline(left, railHi, 1.2);
					r.polyline(right, railHi, 1.2);
				},
			});
		}
	}
}
