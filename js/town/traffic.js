// Town traffic: delivery trucks that drive the road network between districts, and arcing
// light beams for data, models, and software. Drawing and motion only, no text.

import { shade } from "../engine/iso.js";
import { PAL } from "../engine/park.js";

// ---------------------------------------------------------------------------
// Routes: a polyline in world meters with cumulative length.

export function makeRoute(pts) {
	const cum = [0];
	for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
	return { pts, cum, len: cum[cum.length - 1] };
}

/** Point and heading at distance s along a route (clamped). */
export function routeAt(route, s) {
	const { pts, cum, len } = route;
	const d = Math.max(0, Math.min(len, s));
	let i = 1;
	while (i < pts.length - 1 && cum[i] < d) i++;
	const a = pts[i - 1];
	const b = pts[i];
	const seg = cum[i] - cum[i - 1] || 1;
	const k = (d - cum[i - 1]) / seg;
	return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, heading: Math.atan2(b[1] - a[1], b[0] - a[0]) };
}

/** Offset a right-angled polyline to the right of travel by o meters (driving lane). */
export function offsetRight(pts, o) {
	const n = (a, b) => {
		const dx = b[0] - a[0];
		const dy = b[1] - a[1];
		const l = Math.hypot(dx, dy) || 1;
		return [-dy / l, dx / l];
	};
	return pts.map((p, i) => {
		if (i === 0) {
			const m = n(p, pts[1]);
			return [p[0] + m[0] * o, p[1] + m[1] * o];
		}
		if (i === pts.length - 1) {
			const m = n(pts[i - 1], p);
			return [p[0] + m[0] * o, p[1] + m[1] * o];
		}
		const a = n(pts[i - 1], p);
		const b = n(p, pts[i + 1]);
		return [p[0] + (a[0] + b[0]) * o, p[1] + (a[1] + b[1]) * o];
	});
}

/** Replace sharp corners with short curves so trucks turn smoothly. */
export function roundCorners(pts, radius = 1.1) {
	if (pts.length < 3) return pts;
	const out = [pts[0]];
	for (let i = 1; i < pts.length - 1; i++) {
		const p = pts[i];
		const a = pts[i - 1];
		const b = pts[i + 1];
		const la = Math.hypot(p[0] - a[0], p[1] - a[1]);
		const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
		const rr = Math.min(radius, la / 2, lb / 2);
		if (rr < 0.05) {
			out.push(p);
			continue;
		}
		const s = [p[0] + ((a[0] - p[0]) / la) * rr, p[1] + ((a[1] - p[1]) / la) * rr];
		const e = [p[0] + ((b[0] - p[0]) / lb) * rr, p[1] + ((b[1] - p[1]) / lb) * rr];
		for (let k = 0; k <= 4; k++) {
			const t = k / 4;
			const u = 1 - t;
			out.push([u * u * s[0] + 2 * u * t * p[0] + t * t * e[0], u * u * s[1] + 2 * u * t * p[1] + t * t * e[1]]);
		}
	}
	out.push(pts[pts.length - 1]);
	return out;
}

// ---------------------------------------------------------------------------
// Trucks

/**
 * One delivery truck at (x, y) facing heading. cargo: "parts" | "robot" | "cell" | "goods";
 * loaded false draws an empty bed. color: the cab color (the sending district's accent).
 */
export function drawTruck(r, x, y, heading, cargo, loaded, color, highlight = false) {
	const ca = Math.cos(heading);
	const sa = Math.sin(heading);
	const W = (u, v) => [x + ca * u - sa * v, y + sa * u + ca * v];
	if (highlight) r.shadow(x, y, 1.5, 1.5, 0.22);
	r.shadow(x + 0.15, y + 0.15, 1.15, 0.75, 0.16);
	const parts = [];
	const add = (u, v, fn) => {
		const [px, py] = W(u, v);
		parts.push({ d: px + py, fn });
	};
	const obox = (u, v, z, len, wid, h, col) => {
		const [cx, cy] = W(u, v);
		r.orientedBox(cx, cy, z, len, wid, h, heading, col);
	};
	for (const u of [-0.7, 0.7]) for (const v of [-0.42, 0.42]) add(u, v * 1.02, () => obox(u, v, 0, 0.36, 0.14, 0.32, "#2b2f35"));
	add(0, 0, () => obox(0, 0, 0.2, 2.2, 0.9, 0.14, PAL.dark));
	// Cab at the front (+u).
	add(0.78, 0, () => {
		obox(0.78, 0, 0.34, 0.62, 0.92, 0.78, color);
		obox(0.86, 0, 0.82, 0.42, 0.94, 0.26, "#3f6d92");
		obox(0.78, 0, 1.12, 0.62, 0.92, 0.04, shade(color, 1.1));
	});
	add(-0.35, 0, () => obox(-0.35, 0, 0.34, 1.5, 0.92, 0.08, shade(color, 0.7)));
	if (loaded) {
		if (cargo === "parts") {
			add(-0.72, -0.18, () => obox(-0.72, -0.2, 0.42, 0.5, 0.46, 0.46, "#c99a5b"));
			add(-0.18, -0.2, () => obox(-0.18, -0.2, 0.42, 0.5, 0.46, 0.46, "#c99a5b"));
			add(-0.45, 0.25, () => {
				const [cx, cy] = W(-0.6, 0.24);
				r.cylinder(cx, cy, 0.42, 0.17, 0.4, "#3d7fd1", 8);
				const [dx, dy] = W(-0.2, 0.24);
				r.cylinder(dx, dy, 0.42, 0.17, 0.4, "#3d7fd1", 8);
			});
			add(-0.45, -0.2, () => obox(-0.45, -0.2, 0.88, 0.4, 0.4, 0.3, "#e8792f"));
		} else if (cargo === "robot") {
			add(-0.35, 0, () => {
				obox(-0.35, 0, 0.42, 1.36, 0.86, 0.78, "#c99a5b");
				obox(-0.35, 0, 0.9, 1.38, 0.88, 0.14, "#e8792f");
				obox(-0.35, 0, 1.2, 1.4, 0.9, 0.03, "#b8864d");
			});
		} else if (cargo === "cell") {
			add(-0.35, 0, () => {
				obox(-0.35, 0, 0.42, 1.4, 0.88, 0.06, "#b8bec6");
				const cs = [
					[-1.0, -0.4],
					[0.3, -0.4],
					[-1.0, 0.4],
					[0.3, 0.4],
				].map(([u, v]) => W(u, v));
				const [a, b, c, d] = cs;
				for (const p of [a, b, c]) r.box(p[0] - 0.04, p[1] - 0.04, 0.48, 0.08, 0.08, 0.75, "#f2c230");
				const [bx, by] = W(-0.45, 0);
				r.cylinder(bx, by, 0.48, 0.14, 0.12, "#3b4552", 8);
				const [ex, ey] = W(-0.25, 0.1);
				r.beam([bx, by, 0.6], [ex, ey, 1.0], 0.1, 0.1, "#f2f2ee");
				r.beam([ex, ey, 1.0], [ex + ca * 0.3, ey + sa * 0.3, 0.75], 0.08, 0.08, "#f2f2ee");
				for (const [p, q] of [
					[a, b],
					[b, d],
					[c, d],
					[a, c],
				])
					r.quad(
						[
							[p[0], p[1], 0.5],
							[q[0], q[1], 0.5],
							[q[0], q[1], 1.2],
							[p[0], p[1], 1.2],
						],
						"#8d99a6",
						{ alpha: 0.3, flat: true },
					);
				r.box(d[0] - 0.04, d[1] - 0.04, 0.48, 0.08, 0.08, 0.75, "#f2c230");
				r.polyline(
					[
						[a[0], a[1], 1.22],
						[b[0], b[1], 1.22],
						[d[0], d[1], 1.22],
						[c[0], c[1], 1.22],
					],
					"#f2c230",
					1.6,
					true,
				);
			});
		} else {
			add(-0.35, 0, () => obox(-0.35, 0, 0.42, 1.4, 0.88, 0.7, "#f4f4f2"));
		}
	}
	parts.sort((a, b) => a.d - b.d);
	for (const p of parts) p.fn();
}

// ---------------------------------------------------------------------------
// Beams

export const BEAM_STYLE = {
	model: { color: "#9b6fe0", dash: [10, 5], width: 2.2 },
	data: { color: "#1fae9c", dash: [3, 5], width: 2.2 },
	software: { color: "#3aa0e8", dash: [2, 6], width: 1.6 },
};

/** Points of a beam arc from a to b ([x, y, z]). */
export function beamPoints(a, b, n = 28) {
	const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
	const H = 1.5 + dist * 0.22;
	const out = [];
	for (let i = 0; i <= n; i++) {
		const s = i / n;
		out.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s + H * 4 * s * (1 - s)]);
	}
	return out;
}

/**
 * Draw a beam: soft glow, dashed core, an arrowhead near the end, and pulses traveling from a
 * to b (t is seconds; frozen when the caller passes a fixed t). emphasis: 0 dim .. 1 normal .. 2 strong.
 */
export function drawBeam(r, pts, style, t, emphasis = 1) {
	const c = r.ctx;
	const S = pts.map((p) => r.toScreen(p[0], p[1], p[2]));
	const alpha = emphasis === 0 ? 0.22 : emphasis === 2 ? 1 : 0.75;
	const lw = Math.max(1.1, Math.min(3.2, style.width * (0.55 + r.zoom * 0.6))) * (emphasis === 2 ? 1.35 : 1);
	c.save();
	c.lineCap = "round";
	c.lineJoin = "round";
	const path = () => {
		c.beginPath();
		S.forEach(([sx, sy], i) => (i ? c.lineTo(sx, sy) : c.moveTo(sx, sy)));
	};
	c.globalAlpha = alpha * 0.25;
	c.strokeStyle = style.color;
	c.lineWidth = lw * 3.4;
	path();
	c.stroke();
	c.globalAlpha = alpha;
	c.lineWidth = lw;
	c.setLineDash(style.dash);
	path();
	c.stroke();
	c.setLineDash([]);
	// Arrowhead at 85 % of the way.
	const k = Math.floor(S.length * 0.85);
	const [ax, ay] = S[k];
	const [px, py] = S[k - 1];
	const ang = Math.atan2(ay - py, ax - px);
	const ah = lw * 3.2;
	c.fillStyle = style.color;
	c.beginPath();
	c.moveTo(ax + Math.cos(ang) * ah, ay + Math.sin(ang) * ah);
	c.lineTo(ax + Math.cos(ang + 2.5) * ah, ay + Math.sin(ang + 2.5) * ah);
	c.lineTo(ax + Math.cos(ang - 2.5) * ah, ay + Math.sin(ang - 2.5) * ah);
	c.closePath();
	c.fill();
	// Landing glow on the receiving roof.
	const [ex, ey] = S[S.length - 1];
	c.globalAlpha = alpha * 0.5;
	c.beginPath();
	c.ellipse(ex, ey, lw * 3, lw * 1.5, 0, 0, Math.PI * 2);
	c.fill();
	// Pulses.
	c.globalAlpha = Math.min(1, alpha + 0.15);
	for (let q = 0; q < 3; q++) {
		const s = (((t / 2.6 + q / 3) % 1) + 1) % 1;
		const f = s * (S.length - 1);
		const i = Math.min(S.length - 2, Math.floor(f));
		const u = f - i;
		const qx = S[i][0] + (S[i + 1][0] - S[i][0]) * u;
		const qy = S[i][1] + (S[i + 1][1] - S[i][1]) * u;
		c.fillStyle = style.color;
		c.beginPath();
		c.arc(qx, qy, lw * 1.7, 0, Math.PI * 2);
		c.fill();
		c.fillStyle = "#ffffff";
		c.beginPath();
		c.arc(qx, qy, lw * 0.7, 0, Math.PI * 2);
		c.fill();
	}
	c.restore();
}
