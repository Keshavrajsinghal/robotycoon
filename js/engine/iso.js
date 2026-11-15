// Isometric projection and the IsoRenderer drawing primitives.
//
// World coordinates are meters: x grows toward the lower right of the screen, y toward the
// lower left, z up. Projected coordinates ("proj px") are pixels at zoom 1:
//   px = (x - y) * ISO.X,   py = (x + y) * ISO.Y - z * ISO.Z
// Screen pixels are proj px * zoom + offset. Every primitive is flat shaded: a face's color
// depends on its normal and a fixed sun direction, and faces turned away from the viewer are
// skipped.

export const ISO = { X: 32, Y: 16, Z: 36 };

const norm = (v) => {
	const l = Math.hypot(v[0], v[1], v[2]) || 1;
	return [v[0] / l, v[1] / l, v[2] / l];
};
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** Direction from the scene toward the viewer (the projection's null space). */
export const VIEW = norm([1, 1, (2 * ISO.Y) / ISO.Z]);
/** Direction toward the sun: upper left of the screen. */
export const LIGHT = norm([0.35, 0.75, 1.1]);
const LIGHT_TOP = LIGHT[2];

export function project(x, y, z = 0) {
	return [(x - y) * ISO.X, (x + y) * ISO.Y - z * ISO.Z];
}

/** Inverse projection onto the horizontal plane at height z. */
export function unproject(px, py, z = 0) {
	const a = px / ISO.X;
	const b = (py + z * ISO.Z) / ISO.Y;
	return [(a + b) / 2, (b - a) / 2];
}

/** Painter's depth of a world point: larger is closer to the viewer. */
export function depthOf(x, y, z = 0) {
	return x + y + z * ((2 * ISO.Y) / ISO.Z);
}

// ---------------------------------------------------------------------------
// Color helpers

const rgbCache = new Map();
export function parseColor(c) {
	let v = rgbCache.get(c);
	if (v) return v;
	if (c[0] === "#") {
		const h = c.length === 4 ? c.replace(/^#(.)(.)(.)$/, "#$1$1$2$2$3$3") : c;
		v = [Number.parseInt(h.slice(1, 3), 16), Number.parseInt(h.slice(3, 5), 16), Number.parseInt(h.slice(5, 7), 16)];
	} else {
		const m = c.match(/(\d+(?:\.\d+)?)/g) ?? ["0", "0", "0"];
		v = [Number(m[0]), Number(m[1]), Number(m[2])];
	}
	rgbCache.set(c, v);
	return v;
}

const shadeCache = new Map();
/** Multiply a color's brightness by f (f > 1 lightens toward white). */
export function shade(c, f) {
	const key = `${c}|${Math.round(f * 100)}`;
	let s = shadeCache.get(key);
	if (s) return s;
	const [r, g, b] = parseColor(c);
	const ch = (v) => {
		const out = f <= 1 ? v * f : v + (255 - v) * (f - 1);
		return Math.max(0, Math.min(255, Math.round(out)));
	};
	s = `rgb(${ch(r)},${ch(g)},${ch(b)})`;
	shadeCache.set(key, s);
	return s;
}

export function mix(a, b, t) {
	const A = parseColor(a);
	const B = parseColor(b);
	const ch = (i) => Math.round(A[i] + (B[i] - A[i]) * t);
	return `rgb(${ch(0)},${ch(1)},${ch(2)})`;
}

/** Brightness factor for a face with unit normal n: top faces are exactly 1. */
export function lightFactor(n) {
	const ndl = Math.max(0, dot(n, LIGHT));
	return 0.62 + (0.38 * ndl) / LIGHT_TOP;
}

// ---------------------------------------------------------------------------
// Shape builders (world-space face lists)

export function circlePoints(cx, cy, r, seg, phase = 0) {
	const out = [];
	for (let i = 0; i < seg; i++) {
		const a = phase + (i / seg) * Math.PI * 2;
		out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
	}
	return out;
}

function prismFaces(pts, z, h) {
	const faces = [];
	const n = pts.length;
	// Orient the polygon counter-clockwise (in x-right, y-down world terms) so side normals point out.
	let area = 0;
	for (let i = 0; i < n; i++) {
		const a = pts[i];
		const b = pts[(i + 1) % n];
		area += a[0] * b[1] - b[0] * a[1];
	}
	const p = area > 0 ? pts : [...pts].reverse();
	for (let i = 0; i < n; i++) {
		const a = p[i];
		const b = p[(i + 1) % n];
		faces.push([
			[a[0], a[1], z],
			[b[0], b[1], z],
			[b[0], b[1], z + h],
			[a[0], a[1], z + h],
		]);
	}
	faces.push(p.map((q) => [q[0], q[1], z + h]));
	return faces;
}

// ---------------------------------------------------------------------------
// Renderer

export class IsoRenderer {
	/** @param {CanvasRenderingContext2D} ctx */
	constructor(ctx) {
		this.ctx = ctx;
		this.zoom = 1;
		this.ox = 0;
		this.oy = 0;
		this.alpha = 1;
	}

	/** screen = proj * zoom + (ox, oy), in CSS pixels (the context already carries the DPR scale). */
	setTransform(zoom, ox, oy) {
		this.zoom = zoom;
		this.ox = ox;
		this.oy = oy;
	}

	toScreen(x, y, z = 0) {
		return [((x - y) * ISO.X) * this.zoom + this.ox, ((x + y) * ISO.Y - z * ISO.Z) * this.zoom + this.oy];
	}

	_path(pts) {
		const c = this.ctx;
		c.beginPath();
		for (let i = 0; i < pts.length; i++) {
			const p = pts[i];
			const sx = (p[0] - p[1]) * ISO.X * this.zoom + this.ox;
			const sy = ((p[0] + p[1]) * ISO.Y - p[2] * ISO.Z) * this.zoom + this.oy;
			if (i === 0) c.moveTo(sx, sy);
			else c.lineTo(sx, sy);
		}
		c.closePath();
	}

	_fill(color, stroke = true) {
		const c = this.ctx;
		c.fillStyle = color;
		c.fill();
		if (stroke) {
			// Stroking with the fill color hides the hairline seams between adjacent faces.
			c.strokeStyle = color;
			c.lineWidth = 0.6;
			c.stroke();
		}
	}

	/**
	 * Draw a list of planar faces (arrays of [x,y,z]) with flat shading.
	 * opts: { twoSided, center: [x,y,z] of a convex mesh (normals are turned to point away from it),
	 *         colors: per-face colors, edge: outline color, alpha, flat: no shading }
	 */
	mesh(faces, color, opts = {}) {
		const list = [];
		const ctr = opts.center;
		for (let i = 0; i < faces.length; i++) {
			const f = faces[i];
			if (f.length < 3) continue;
			let n = norm(cross(sub(f[1], f[0]), sub(f[2], f[0])));
			if (f.length > 3 && (!Number.isFinite(n[0]) || (n[0] === 0 && n[1] === 0 && n[2] === 0)))
				n = norm(cross(sub(f[2], f[0]), sub(f[3], f[0])));
			if (ctr) {
				const fc = f[0];
				if ((fc[0] - ctr[0]) * n[0] + (fc[1] - ctr[1]) * n[1] + (fc[2] - ctr[2]) * n[2] < 0) n = [-n[0], -n[1], -n[2]];
			}
			let facing = dot(n, VIEW);
			if (facing <= 1e-4) {
				if (!opts.twoSided) continue;
				n = [-n[0], -n[1], -n[2]];
				facing = -facing;
			}
			let cx = 0;
			let cy = 0;
			let cz = 0;
			for (const p of f) {
				cx += p[0];
				cy += p[1];
				cz += p[2];
			}
			list.push({ f, n, d: depthOf(cx / f.length, cy / f.length, cz / f.length), col: opts.colors?.[i] ?? color });
		}
		list.sort((a, b) => a.d - b.d);
		const c = this.ctx;
		const prevAlpha = c.globalAlpha;
		if (opts.alpha !== undefined) c.globalAlpha = prevAlpha * opts.alpha;
		for (const it of list) {
			this._path(it.f);
			const col = opts.flat ? it.col : shade(it.col, lightFactor(it.n));
			this._fill(col, opts.alpha === undefined || opts.alpha > 0.95);
			if (opts.edge) {
				c.strokeStyle = opts.edge;
				c.lineWidth = Math.max(0.5, 0.8 * this.zoom);
				c.stroke();
			}
		}
		c.globalAlpha = prevAlpha;
	}

	/** Axis-aligned box from (x,y,z) with size w (x), d (y), h (z). opts.top overrides the top color. */
	box(x, y, z, w, d, h, color, opts = {}) {
		const x1 = x + w;
		const y1 = y + d;
		const z1 = z + h;
		const c = this.ctx;
		const prevAlpha = c.globalAlpha;
		if (opts.alpha !== undefined) c.globalAlpha = prevAlpha * opts.alpha;
		const stroke = opts.alpha === undefined;
		// +y face (left front), +x face (right front), top.
		this._path([
			[x, y1, z],
			[x1, y1, z],
			[x1, y1, z1],
			[x, y1, z1],
		]);
		this._fill(shade(opts.side ?? color, lightFactor([0, 1, 0])), stroke);
		this._path([
			[x1, y1, z],
			[x1, y, z],
			[x1, y, z1],
			[x1, y1, z1],
		]);
		this._fill(shade(opts.side ?? color, lightFactor([1, 0, 0])), stroke);
		this._path([
			[x, y, z1],
			[x1, y, z1],
			[x1, y1, z1],
			[x, y1, z1],
		]);
		this._fill(opts.top ?? color, stroke);
		if (opts.edge) {
			c.strokeStyle = opts.edge;
			c.lineWidth = Math.max(0.5, 0.8 * this.zoom);
			this._path([
				[x, y1, z],
				[x1, y1, z],
				[x1, y, z],
				[x1, y, z1],
				[x, y, z1],
				[x, y1, z1],
			]);
			c.stroke();
		}
		c.globalAlpha = prevAlpha;
	}

	/** Extruded polygon: pts are [x,y] in world meters, from height z up by h. */
	prism(pts, z, h, color, opts = {}) {
		this.mesh(prismFaces(pts, z, h), color, opts);
	}

	/** Vertical low-poly cylinder. */
	cylinder(cx, cy, z, r, h, color, seg = 10, opts = {}) {
		this.mesh(prismFaces(circlePoints(cx, cy, r, seg, Math.PI / seg), z, h), color, opts);
	}

	/** Cylinder along an arbitrary axis from p1 to p2 (rollers, pipes). */
	tube(p1, p2, r, color, seg = 8, opts = {}) {
		const u = norm(sub(p2, p1));
		const ref = Math.abs(u[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
		const s = norm(cross(u, ref));
		const t = cross(s, u);
		const ring = (p) =>
			Array.from({ length: seg }, (_, i) => {
				const a = (i / seg) * Math.PI * 2;
				const ca = Math.cos(a) * r;
				const sa = Math.sin(a) * r;
				return [p[0] + s[0] * ca + t[0] * sa, p[1] + s[1] * ca + t[1] * sa, p[2] + s[2] * ca + t[2] * sa];
			});
		const A = ring(p1);
		const B = ring(p2);
		const faces = [];
		for (let i = 0; i < seg; i++) {
			const j = (i + 1) % seg;
			faces.push([A[i], A[j], B[j], B[i]]);
		}
		faces.push([...A].reverse());
		faces.push(B);
		this.mesh(faces, color, { ...opts, center: [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2] });
	}

	cone(cx, cy, z, r, h, color, seg = 9, opts = {}) {
		const ring = circlePoints(cx, cy, r, seg, Math.PI / seg);
		const apex = [cx, cy, z + h];
		const faces = [];
		for (let i = 0; i < seg; i++) {
			const a = ring[i];
			const b = ring[(i + 1) % seg];
			faces.push([[a[0], a[1], z], [b[0], b[1], z], apex]);
		}
		this.mesh(faces, color, { ...opts, center: [cx, cy, z + h / 3] });
	}

	/** Rough low-poly sphere (or ellipsoid with opts.sz vertical scale). */
	sphere(cx, cy, cz, r, color, detail = 1, opts = {}) {
		const lat = 3 + detail * 2;
		const lon = 6 + detail * 2;
		const sz = opts.sz ?? 1;
		const pt = (i, j) => {
			const th = (i / lat) * Math.PI;
			const ph = (j / lon) * Math.PI * 2 + (i % 2 ? Math.PI / lon : 0) * (opts.jitter ?? 0);
			return [cx + Math.sin(th) * Math.cos(ph) * r, cy + Math.sin(th) * Math.sin(ph) * r, cz + Math.cos(th) * r * sz];
		};
		const faces = [];
		for (let i = 0; i < lat; i++) {
			for (let j = 0; j < lon; j++) {
				const a = pt(i, j);
				const b = pt(i, j + 1);
				const c2 = pt(i + 1, j + 1);
				const d = pt(i + 1, j);
				if (i === 0) faces.push([a, d, c2]);
				else if (i === lat - 1) faces.push([a, d, b]);
				else faces.push([a, d, c2, b]);
			}
		}
		this.mesh(faces, color, { ...opts, center: [cx, cy, cz] });
	}

	/** Oriented box whose long axis runs from p1 to p2 (arm links, beams). w is width, h height. */
	beam(p1, p2, w, h, color, opts = {}) {
		const u = norm(sub(p2, p1));
		const ref = Math.abs(u[2]) > 0.95 ? [1, 0, 0] : [0, 0, 1];
		const s = norm(cross(u, ref));
		const t = norm(cross(s, u));
		const hw = w / 2;
		const hh = h / 2;
		const c = (p, a, b) => [p[0] + s[0] * a + t[0] * b, p[1] + s[1] * a + t[1] * b, p[2] + s[2] * a + t[2] * b];
		const A = [c(p1, -hw, -hh), c(p1, hw, -hh), c(p1, hw, hh), c(p1, -hw, hh)];
		const B = [c(p2, -hw, -hh), c(p2, hw, -hh), c(p2, hw, hh), c(p2, -hw, hh)];
		const faces = [[A[3], A[2], A[1], A[0]], B];
		for (let i = 0; i < 4; i++) {
			const j = (i + 1) % 4;
			faces.push([A[i], A[j], B[j], B[i]]);
		}
		this.mesh(faces, color, { ...opts, center: [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2] });
	}

	/** Box centered at (cx, cy), rotated by angle (radians, around z), length along the heading. */
	orientedBox(cx, cy, z, len, wid, h, angle, color, opts = {}) {
		const ca = Math.cos(angle);
		const sa = Math.sin(angle);
		const pts = [
			[-len / 2, -wid / 2],
			[len / 2, -wid / 2],
			[len / 2, wid / 2],
			[-len / 2, wid / 2],
		].map(([a, b]) => [cx + a * ca - b * sa, cy + a * sa + b * ca]);
		this.prism(pts, z, h, color, opts);
	}

	/** A single planar polygon in 3D (signs, panels, decals). */
	quad(points, color, opts = {}) {
		this.mesh([points], color, { twoSided: true, ...opts });
	}

	/** Flat ground rectangle at height z, unshaded. */
	ground(x, y, w, d, color, z = 0) {
		this._path([
			[x, y, z],
			[x + w, y, z],
			[x + w, y + d, z],
			[x, y + d, z],
		]);
		this._fill(color);
	}

	/** Flat ground polygon from [x,y] points, unshaded. */
	groundPoly(pts, color, z = 0) {
		this._path(pts.map((p) => [p[0], p[1], z]));
		this._fill(color);
	}

	line(a, b, color, width = 1) {
		const c = this.ctx;
		const [x1, y1] = this.toScreen(a[0], a[1], a[2] ?? 0);
		const [x2, y2] = this.toScreen(b[0], b[1], b[2] ?? 0);
		c.beginPath();
		c.moveTo(x1, y1);
		c.lineTo(x2, y2);
		c.strokeStyle = color;
		c.lineWidth = Math.max(0.5, width * this.zoom);
		c.lineCap = "round";
		c.stroke();
	}

	polyline(points, color, width = 1, closed = false) {
		const c = this.ctx;
		c.beginPath();
		points.forEach((p, i) => {
			const [sx, sy] = this.toScreen(p[0], p[1], p[2] ?? 0);
			if (i === 0) c.moveTo(sx, sy);
			else c.lineTo(sx, sy);
		});
		if (closed) c.closePath();
		c.strokeStyle = color;
		c.lineWidth = Math.max(0.5, width * this.zoom);
		c.lineCap = "round";
		c.lineJoin = "round";
		c.stroke();
	}

	/** Soft ground shadow ellipse. */
	shadow(x, y, rx, ry = rx, alpha = 0.18, z = 0) {
		const c = this.ctx;
		const [sx, sy] = this.toScreen(x, y, z);
		c.beginPath();
		c.ellipse(sx, sy, Math.max(0.5, rx * ISO.X * this.zoom), Math.max(0.5, ry * ISO.Y * this.zoom), 0, 0, Math.PI * 2);
		c.fillStyle = `rgba(20,40,20,${alpha})`;
		c.fill();
	}

	/**
	 * 2D drawing at a projected point. fn(ctx, scale) runs with the context translated to the
	 * point; scale is the current zoom, so drawings stay in proportion with the world.
	 */
	billboard(x, y, z, fn) {
		const c = this.ctx;
		const [sx, sy] = this.toScreen(x, y, z);
		c.save();
		c.translate(sx, sy);
		fn(c, this.zoom);
		c.restore();
	}
}
