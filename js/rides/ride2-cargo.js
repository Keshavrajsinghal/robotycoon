// Ride 2 cargo: what the signal looks like on the cart deck after each stop. Information-like
// cargo (pulses, images, waveforms) is drawn in the screen plane so it reads from any heading;
// physical cargo (shaft, arm, fingers, tray) follows the cart's heading.

import { drawGrapes, drawHangingBunch, drawPlate, FOOD } from "../engine/food.js";
import { drawSixAxis, drawSoftFingers, shuttle } from "../engine/robots.js";

const R2 = Math.SQRT1_2;
export const SIGNAL = "#ffd23f";
export const JOINT_COLORS = ["#ff6b5b", "#ffb347", "#ffd23f", "#4fd27a", "#5aa9ff", "#b388ff"];
const TARGETS = [0.55, 0.85, 0.35, 0.68, 0.45, 0.72];

/** Cargo is drawn a little larger than life so it reads at park zoom on a phone. */
const CS = 1.3;

/** Screen-plane frame at A: u to screen right, v up, w toward the viewer (meters x s). */
function sf(A, s = CS) {
	return (u, v, w = 0) => [A[0] + (u + w) * R2 * s, A[1] + (-u + w) * R2 * s, A[2] + v * s];
}

/** Heading frame: f forward, sd to the left of travel, z up (meters x s). */
function hf(A, h, s = 1) {
	const c = Math.cos(h);
	const sn = Math.sin(h);
	return (f, sd, z = 0) => [A[0] + (f * c - sd * sn) * s, A[1] + (f * sn + sd * c) * s, A[2] + z * s];
}

/**
 * Draw a 2D picture standing on the deck: fn(ctx) draws in centimeters of the screen plane
 * (times the cargo scale), origin at the picture center, y down.
 */
function picture(r, A, v, fn) {
	r.billboard(A[0], A[1], A[2] + v * CS, (c, zoom) => {
		const ppm = 45.25 * zoom * CS; // px per meter along the screen plane
		c.scale(ppm / 100, ppm / 100);
		fn(c);
	});
}

function easel(r, A, v) {
	const at = sf(A);
	r.line(at(-0.2, 0.02), at(-0.12, v - 0.1), "#5b4636", 2.2);
	r.line(at(0.2, 0.02), at(0.12, v - 0.1), "#5b4636", 2.2);
	r.line(at(0, 0.02, -0.12), at(0, v - 0.1), "#4a382b", 2);
}

// ---------------------------------------------------------------------------
// 2D pieces shared with the close-ups

/** A grape bunch lying on its side on a surface at z, centered near (x, y); S scales it. */
function lyingBunch(r, x, y, z, S, lw = 0.6) {
	drawGrapes(r, (f, sd, zz = 0) => [x + (f + 0.05) * S, y + sd * S, z + zz * S], S, lw);
}

// ---------------------------------------------------------------------------
// The tote as the overhead camera sees it: a few bunches lying at random angles. Bunch 0 is the
// one the detector outlines and the arm picks. Positions are in image heights (the image is 4:3).

const ASPECT = 4 / 3;
const TOTE_BUNCHES = [
	{ x: 0.6, y: 0.5, a: 0.55, len: 0.62, wid: 0.4 },
	{ x: 1.08, y: 0.3, a: 2.25, len: 0.48, wid: 0.32 },
	{ x: 0.34, y: 0.8, a: 3.05, len: 0.42, wid: 0.3 },
	{ x: 1.06, y: 0.78, a: -2.75, len: 0.4, wid: 0.28 },
	{ x: 0.26, y: 0.26, a: 1.35, len: 0.36, wid: 0.26 },
];
export const MASK_GREEN = "#3ee07a";
const GRID_CACHE = new Map();

/**
 * The tote image on a cols x rows grid (use a 4:3 grid such as 12 x 9): v (0 floor, 1 grape,
 * 2 shaded grape, 3 stem, 4 tote rim), id (bunch index or -1), d (height above the floor, 0..1,
 * which the depth camera turns into distance), box (bunch 0's bounds in cells).
 */
function toteGrid(cols, rows) {
	const key = `${cols}x${rows}`;
	if (GRID_CACHE.has(key)) return GRID_CACHE.get(key);
	const v = [];
	const id = [];
	const d = [];
	const box = [cols, rows, 0, 0];
	for (let j = 0; j < rows; j++) {
		v.push([]);
		id.push([]);
		d.push([]);
		for (let i = 0; i < cols; i++) {
			const x = ((i + 0.5) / cols) * ASPECT;
			const y = (j + 0.5) / rows;
			let val = 0;
			let who = -1;
			let hgt = 0.06 + 0.05 * (((i * 7 + j * 13) % 5) / 5);
			if (i === 0 || j === 0 || i === cols - 1 || j === rows - 1) {
				val = 4;
				hgt = 0.3;
			} else
				for (let k = 0; k < TOTE_BUNCHES.length && val === 0; k++) {
					const b = TOTE_BUNCHES[k];
					const dx = x - b.x;
					const dy = y - b.y;
					const ca = Math.cos(b.a);
					const sa = Math.sin(b.a);
					const s = (dx * ca + dy * sa) / b.len; // -0.5 at the shoulders, 0.5 at the tip
					const tt = -dx * sa + dy * ca;
					const half = (b.wid / 2) * (1 - 0.7 * (s + 0.5));
					if (s >= -0.5 && s <= 0.5 && Math.abs(tt) <= half) {
						val = (i + j) % 3 === 0 ? 2 : 1;
						who = k;
						hgt = 0.42 + 0.55 * (1 - (tt / half) ** 2) * (1 - 0.4 * (s + 0.5));
					} else if (s < -0.5 && s > -0.5 - 0.1 / b.len && Math.abs(tt) < 0.55 / rows) {
						val = 3;
						who = k;
						hgt = 0.5;
					}
				}
			if (who === 0 && val !== 3) {
				box[0] = Math.min(box[0], i);
				box[1] = Math.min(box[1], j);
				box[2] = Math.max(box[2], i + 1);
				box[3] = Math.max(box[3], j + 1);
			}
			v[j].push(val);
			id[j].push(who);
			d[j].push(hgt);
		}
	}
	const g = { v, id, d, box };
	GRID_CACHE.set(key, g);
	return g;
}

/** Height-map color for a depth image: far (tote floor) dark blue, near (bunch tops) yellow. */
function depthColor(hgt) {
	const stops = ["#1d2b53", "#2c7da0", "#7cc68a", "#f2e46f"];
	const f = Math.max(0, Math.min(0.999, hgt)) * (stops.length - 1);
	const i = Math.floor(f);
	return mixHex(stops[i], stops[i + 1], f - i);
}

function mixHex(a, b, t) {
	const pa = [1, 3, 5].map((k) => parseInt(a.slice(k, k + 2), 16));
	const pb = [1, 3, 5].map((k) => parseInt(b.slice(k, k + 2), 16));
	return `rgb(${pa.map((v, k) => Math.round(v + (pb[k] - v) * t)).join(",")})`;
}

function pixelColor(g, i, j) {
	const v = g.v[j][i];
	const noise = ((i * 7 + j * 13) % 5) / 5;
	if (v === 4) return "#24578f";
	if (v === 3) return FOOD.stem;
	if (v === 2) return "#4f2a66";
	if (v === 1) return noise > 0.6 ? FOOD.grape : FOOD.grape2;
	return noise > 0.7 ? "#3570ad" : "#2f6fb3";
}

/**
 * A framed pixel image of the tote. (x, y) top-left, w x h in the caller's units.
 * opts: { cols, rows, frame, depth: draw distance instead of color, maskOnly: only bunch 0's
 * mask (white on dark), mask: 0..1 how much of bunch 0's mask is tinted and outlined (rows from
 * the top), crop: [x, y, w, h] window to clip to (the image may extend past it) }
 */
export function drawPixelImage(c, x, y, w, h, opts = {}) {
	const cols = opts.cols ?? 12;
	const rows = opts.rows ?? 9;
	const fr = opts.frame ?? Math.max(1.5, w * 0.05);
	const g = toteGrid(cols, rows);
	const pw = w / cols;
	const ph = h / rows;
	const gap = Math.max(0.3, pw * 0.08);
	c.save();
	if (opts.crop) {
		c.beginPath();
		c.rect(...opts.crop);
		c.clip();
	}
	if (fr > 0) {
		c.fillStyle = "#1d2127";
		c.fillRect(x - fr, y - fr, w + fr * 2, h + fr * 2);
	}
	const shown = opts.mask ?? (opts.maskOnly ? 1 : 0);
	const upto = g.box[1] + (g.box[3] - g.box[1]) * shown;
	const inMask = (i, j) => i >= 0 && j >= 0 && i < cols && j < rows && g.id[j][i] === 0 && g.v[j][i] !== 3 && j < upto;
	for (let j = 0; j < rows; j++)
		for (let i = 0; i < cols; i++) {
			if (opts.maskOnly) c.fillStyle = inMask(i, j) ? "#ffffff" : "#2a3038";
			else c.fillStyle = opts.depth ? depthColor(g.d[j][i]) : pixelColor(g, i, j);
			c.fillRect(x + i * pw, y + j * ph, pw - gap, ph - gap);
		}
	if (shown > 0 && !opts.maskOnly) {
		c.fillStyle = "rgba(62,224,122,0.42)";
		for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (inMask(i, j)) c.fillRect(x + i * pw, y + j * ph, pw, ph);
		// The outline follows the mask's pixel edges.
		c.strokeStyle = MASK_GREEN;
		c.lineWidth = Math.max(1, pw * 0.2);
		c.lineCap = "round";
		c.beginPath();
		const edge = (x0, y0, x1, y1) => {
			c.moveTo(x0, y0);
			c.lineTo(x1, y1);
		};
		for (let j = 0; j < rows; j++)
			for (let i = 0; i < cols; i++) {
				if (!inMask(i, j)) continue;
				const X = x + i * pw;
				const Y = y + j * ph;
				if (!inMask(i, j - 1)) edge(X, Y, X + pw, Y);
				if (!inMask(i, j + 1)) edge(X, Y + ph, X + pw, Y + ph);
				if (!inMask(i - 1, j)) edge(X, Y, X, Y + ph);
				if (!inMask(i + 1, j)) edge(X + pw, Y, X + pw, Y + ph);
			}
		c.stroke();
	}
	c.restore();
	return { pw, ph, box: g.box };
}

/**
 * The wrist camera's view: bunch 0 up close with the soft finger tips at the top corners.
 * (x, y) top-left, w x h (4:3).
 */
export function drawWristImage(c, x, y, w, h, frame = 2) {
	c.fillStyle = "#1d2127";
	c.fillRect(x - frame, y - frame, w + frame * 2, h + frame * 2);
	const g = toteGrid(16, 12);
	const [b0, b1, b2, b3] = g.box;
	const cell = Math.min(w / ((b2 - b0) * 1.15), h / ((b3 - b1) * 1.15));
	const ox = x + w / 2 - ((b0 + b2) / 2) * cell;
	const oy = y + h / 2 - ((b1 + b3) / 2) * cell;
	drawPixelImage(c, ox, oy, 16 * cell, 12 * cell, { cols: 16, rows: 12, frame: 0, crop: [x, y, w, h] });
	c.save();
	c.beginPath();
	c.rect(x, y, w, h);
	c.clip();
	c.fillStyle = "#e8792f";
	for (const s of [-1, 1]) {
		const fx = x + w / 2 + s * w * 0.5;
		c.beginPath();
		c.moveTo(fx, y - 1);
		c.quadraticCurveTo(fx - s * w * 0.16, y + h * 0.18, fx - s * w * 0.3, y + h * 0.3);
		c.lineTo(fx - s * w * 0.18, y + h * 0.36);
		c.quadraticCurveTo(fx - s * w * 0.04, y + h * 0.22, fx, y + h * 0.16);
		c.closePath();
		c.fill();
	}
	c.restore();
}

export function arrow2d(c, x0, y0, x1, y1, color, width, head = width * 3) {
	const a = Math.atan2(y1 - y0, x1 - x0);
	c.strokeStyle = color;
	c.fillStyle = color;
	c.lineWidth = width;
	c.lineCap = "round";
	c.beginPath();
	c.moveTo(x0, y0);
	c.lineTo(x1 - Math.cos(a) * head * 0.6, y1 - Math.sin(a) * head * 0.6);
	c.stroke();
	c.beginPath();
	c.moveTo(x1, y1);
	c.lineTo(x1 - Math.cos(a - 0.45) * head, y1 - Math.sin(a - 0.45) * head);
	c.lineTo(x1 - Math.cos(a + 0.45) * head, y1 - Math.sin(a + 0.45) * head);
	c.closePath();
	c.fill();
}

/** Small neural-net glyph: columns of nodes joined by lines. lit: 0..1 per column or null. */
export function netGlyph(c, x, y, w, h, cols = [3, 4, 3], lit = null, colors = {}) {
	const pts = cols.map((n, ci) => {
		const cx = x + (ci / (cols.length - 1)) * w;
		return Array.from({ length: n }, (_, i) => [cx, y + ((i + 0.5) / n) * h]);
	});
	c.lineWidth = Math.max(0.6, w * 0.02);
	for (let ci = 0; ci < pts.length - 1; ci++) {
		c.strokeStyle = colors.edge ?? "rgba(138,92,199,0.55)";
		for (const a of pts[ci])
			for (const b of pts[ci + 1]) {
				c.beginPath();
				c.moveTo(a[0], a[1]);
				c.lineTo(b[0], b[1]);
				c.stroke();
			}
	}
	const rad = Math.max(1.2, Math.min(w, h) * 0.075);
	pts.forEach((col, ci) => {
		for (const [px, py] of col) {
			c.beginPath();
			c.arc(px, py, rad, 0, Math.PI * 2);
			const k = lit ? lit[ci] : 0.5;
			c.fillStyle = k > 0.6 ? (colors.hot ?? "#f6d2ff") : (colors.node ?? "#9b5de5");
			c.fill();
			c.strokeStyle = colors.ring ?? "#5b3a7a";
			c.lineWidth = Math.max(0.5, rad * 0.35);
			c.stroke();
		}
	});
	return pts;
}

// ---------------------------------------------------------------------------
// Cargo per stop

function cargoTrigger(r, A, t) {
	const at = sf(A);
	r.cylinder(A[0], A[1], A[2], 0.42, 0.03, SIGNAL, 12);
	r.cylinder(A[0], A[1], A[2] + 0.03, 0.37, 0.05, "#2b2f36", 12);
	const wave = [
		[-0.42, 0.22],
		[-0.15, 0.22],
		[-0.15, 0.7],
		[0.15, 0.7],
		[0.15, 0.22],
		[0.42, 0.22],
	];
	for (const u of [-0.42, 0.42]) r.line(at(u, 0.08), at(u, 0.22), "#5d6672", 2);
	r.polyline(
		wave.map(([u, v]) => at(u, v)),
		"rgba(255,210,63,0.35)",
		10,
	);
	for (let i = 0; i < wave.length - 1; i++) r.beam(at(...wave[i]), at(...wave[i + 1]), 0.09, 0.09, "#ffd23f");
	// A spark runs along the pulse.
	const lens = [];
	let total = 0;
	for (let i = 0; i < wave.length - 1; i++) {
		const l = Math.hypot(wave[i + 1][0] - wave[i][0], wave[i + 1][1] - wave[i][1]);
		lens.push(l);
		total += l;
	}
	let d = ((t * 0.9) % 1) * total;
	let i = 0;
	while (i < lens.length - 1 && d > lens[i]) d -= lens[i++];
	const f = d / lens[i];
	const p = at(wave[i][0] + (wave[i + 1][0] - wave[i][0]) * f, wave[i][1] + (wave[i + 1][1] - wave[i][1]) * f, 0.06);
	r.sphere(p[0], p[1], p[2], 0.07, "#fffbe6", 0);
}

function cargoLight(r, A, t) {
	const at = sf(A);
	// A bunch on the deck and the lamp above it.
	lyingBunch(r, A[0] - 0.14, A[1] + 0.14, A[2] - 0.02, 3.2);
	const src = at(-0.38, 0.95, 0);
	r.beam(at(-0.5, 0.98), at(-0.26, 0.98), 0.1, 0.08, "#3b4048");
	const hit = at(-0.15, 0.1, 0);
	for (const du of [-0.06, 0.06]) r.line([src[0] + du * R2, src[1] - du * R2, src[2] - 0.05], hit, "rgba(255,243,176,0.7)", 1.4);
	// The reflected bundle: five rays leaving the bunch toward the upper right.
	for (let i = 0; i < 5; i++) {
		const o = (i - 2) * 0.06;
		const a = at(-0.12 + o, 0.14 + o * 0.4);
		const b = at(0.45 + o * 0.5, 0.72 + o * 0.9);
		r.line(a, b, "rgba(255,220,110,0.5)", 8);
		r.line(a, b, "#fffbe0", 2.2);
		const k = ((t * 0.8 + i * 0.21) % 1);
		r.sphere(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, 0.035, "#ffffff", 0);
		// Arrowhead.
		const dx = b[0] - a[0];
		const dy = b[1] - a[1];
		const dz = b[2] - a[2];
		const l = Math.hypot(dx, dy, dz);
		const back = (s) => [b[0] - (dx / l) * 0.1 + s * R2 * 0.05, b[1] - (dy / l) * 0.1 - s * R2 * 0.05, b[2] - (dz / l) * 0.1 - 0.02 * s];
		r.polyline([back(1), b, back(-1)], "#fff6c9", 1.6);
	}
}

/** Sensor: the camera's picture and, behind it, the distance it measured for every pixel. */
function cargoImage(r, A) {
	easel(r, A, 0.42);
	picture(r, A, 0.66, (c) => {
		drawPixelImage(c, -22, -38, 60, 45, { depth: true, frame: 3.5 });
		drawPixelImage(c, -40, -16, 60, 45, { frame: 3.5 });
	});
}

/** Detection: the picture with one bunch's mask outlined, and its confidence score. */
function cargoDetection(r, A) {
	easel(r, A, 0.42);
	picture(r, A, 0.66, (c) => {
		drawPixelImage(c, -38, -32, 76, 57, { mask: 1, frame: 4 });
		c.fillStyle = "#1d2127";
		c.fillRect(-38, 29, 76, 9);
		c.fillStyle = MASK_GREEN;
		c.fillRect(-36.5, 30.5, 73 * 0.88, 6);
	});
}

function cargoPoint(r, A) {
	const O = [A[0] - 0.4, A[1] - 0.4, A[2] + 0.03];
	const axis = (d, color) => {
		const e = [O[0] + d[0], O[1] + d[1], O[2] + d[2]];
		r.beam(O, e, 0.05, 0.05, color);
		if (d[2] > 0) r.cone(e[0], e[1], e[2], 0.08, 0.15, color, 8);
		else {
			const side = d[0] ? [0, 0.08, 0] : [0.08, 0, 0];
			const tip = [e[0] + d[0] * 0.22, e[1] + d[1] * 0.22, e[2]];
			r.quad([[e[0] + side[0], e[1] + side[1], e[2]], tip, [e[0] - side[0], e[1] - side[1], e[2]], [e[0], e[1], e[2] + 0.09]], color);
		}
	};
	axis([0.8, 0, 0], "#e04a3c");
	axis([0, 0.8, 0], "#35b061");
	axis([0, 0, 0.9], "#3d7fd1");
	const P = [O[0] + 0.55, O[1] + 0.46, O[2] + 0.66];
	const foot = [P[0], P[1], O[2] + 0.005];
	const dash = (a, b, color) => {
		for (let i = 0; i < 8; i += 2) {
			const f0 = i / 8;
			const f1 = (i + 1) / 8;
			r.line([a[0] + (b[0] - a[0]) * f0, a[1] + (b[1] - a[1]) * f0, a[2] + (b[2] - a[2]) * f0], [a[0] + (b[0] - a[0]) * f1, a[1] + (b[1] - a[1]) * f1, a[2] + (b[2] - a[2]) * f1], color, 1.4);
		}
	};
	dash(P, foot, "#2b2f36");
	dash(foot, [P[0], O[1], O[2]], "#e04a3c");
	dash(foot, [O[0], P[1], O[2]], "#35b061");
	r.shadow(P[0], P[1], 0.11, 0.11, 0.25, O[2]);
	r.sphere(P[0], P[1], P[2], 0.16, "#ffffff", 0, { alpha: 0.35 });
	r.sphere(P[0], P[1], P[2], 0.115, "#ffd23f", 1);
}

/** Soft fingers on a short quill; z is the finger tips. */
function quillFingers(r, x, y, z, grip, s) {
	r.cylinder(x, y, z + 0.16 * s, 0.03 * s, 0.4 * s, "#b8c0ca", 6);
	drawSoftFingers(r, x, y, z, grip, s);
}

function cargoGrasp(r, A, t) {
	const at = sf(A, 1);
	// The bunch lying in its tote, stem toward -x; the fingers will close around the stem.
	const S = 3.0;
	lyingBunch(r, A[0] + 0.12, A[1], A[2] - 0.02, S);
	const stem = [A[0] + 0.12 + (-0.16 + 0.05) * S, A[1], A[2] + 0.06 * S];
	// Contact circle where the finger tips will meet.
	const ring = [];
	for (let i = 0; i <= 16; i++) {
		const a = (i / 16) * Math.PI * 2;
		ring.push([stem[0] + Math.cos(a) * 0.12, stem[1] + Math.sin(a) * 0.12, stem[2]]);
	}
	r.polyline(ring, "#2b2f36", 1.3);
	const bob = 0.04 * Math.sin(t * 2.4);
	const cz = stem[2] + 0.56 + bob;
	quillFingers(r, stem[0], stem[1], cz, 1, 1.6);
	// Tool frame at the fingers.
	r.line([stem[0], stem[1], cz + 0.3], [stem[0] + 0.3, stem[1], cz + 0.3], "#e04a3c", 2);
	r.line([stem[0], stem[1], cz + 0.3], [stem[0], stem[1] + 0.3, cz + 0.3], "#35b061", 2);
	// Approach arrow down to the stem.
	const so = [stem[0] - A[0], stem[1] - A[1]];
	const a = [at(0, cz - A[2] - 0.04)[0] + so[0], at(0, 0)[1] + so[1], cz - 0.04];
	const b = [a[0], a[1], stem[2] + 0.1];
	r.line(a, b, "rgba(255,210,63,0.4)", 11);
	r.line(a, [b[0], b[1], b[2] + 0.1], SIGNAL, 4.5);
	const head = (u, v) => {
		const p = at(u, v);
		return [p[0] + so[0], p[1] + so[1], stem[2] + v];
	};
	r.quad([head(-0.12, 0.25), head(0.12, 0.25), head(0, 0.09)], SIGNAL);
	// Pre-grasp point, a little way back along the approach.
	r.sphere(stem[0], stem[1], stem[2] + 0.36, 0.06, "#ffffff", 0);
	r.sphere(stem[0], stem[1], stem[2] + 0.36, 0.035, SIGNAL, 0);
}

function cargoTrajectory(r, A, t) {
	const at = sf(A);
	const N = 24;
	const pts = [];
	for (let i = 0; i <= N; i++) {
		const s = i / N;
		pts.push([-0.42 + 0.84 * s, 0.12 + Math.sin(Math.PI * s) * 0.58, 0.18 * Math.sin(2 * Math.PI * s)]);
	}
	r.polyline(
		pts.map(([u, , w]) => at(u, 0.01, w)),
		"rgba(30,60,60,0.25)",
		4,
	);
	r.polyline(
		pts.map((p) => at(...p)),
		"#1f8a7e",
		7,
	);
	r.polyline(
		pts.map((p) => at(...p)),
		"#7ff0e0",
		2,
	);
	for (const i of [0, 6, 12, 18]) {
		const p = at(...pts[i]);
		r.line(at(pts[i][0], 0.01, pts[i][2]), p, "rgba(40,60,60,0.35)", 1);
		r.sphere(p[0], p[1], p[2], 0.05, "#ffffff", 0);
	}
	const e = pts[N];
	const pe = pts[N - 2];
	const du = e[0] - pe[0];
	const dv = e[1] - pe[1];
	const l = Math.hypot(du, dv);
	const nu = -dv / l;
	const nv = du / l;
	r.quad([at(e[0] + nu * 0.07, e[1] + nv * 0.07, e[2]), at(e[0] + (du / l) * 0.14, e[1] + (dv / l) * 0.14, e[2]), at(e[0] - nu * 0.07, e[1] - nv * 0.07, e[2])], "#1f8a7e");
	const k = Math.floor(((t * 0.5) % 1) * N);
	const q = at(...pts[k]);
	r.sphere(q[0], q[1], q[2], 0.06, SIGNAL, 0);
}

function cargoTargets(r, A, t) {
	const k = CS;
	r.orientedBox(A[0], A[1], A[2], 0.98 * k, 0.24 * k, 0.05, -Math.PI / 4, "#2b2f36");
	const ease = 0.75 + 0.25 * Math.sin(t * 1.3);
	const bw = 0.11 * k;
	for (let i = 0; i < 6; i++) {
		const u = (-0.375 + i * 0.15) * k;
		const x = A[0] + u * R2 - bw / 2;
		const y = A[1] - u * R2 - bw / 2;
		const H = 0.62 * k;
		const lvl = H * TARGETS[i] * ease;
		r.box(x, y, A[2] + 0.05, bw, bw, lvl, JOINT_COLORS[i]);
		r.box(x, y, A[2] + 0.05 + lvl, bw, bw, H - lvl, "#3b4552", { top: "#56606d" });
		r.box(x - 0.02, y - 0.02, A[2] + 0.05 + H * TARGETS[i], bw + 0.04, bw + 0.04, 0.02, "#ffffff");
	}
}

function cargoPolicy(r, A, t) {
	const at = sf(A);
	r.line(at(-0.3, 0.02), at(-0.22, 0.32), "#4a382b", 2);
	r.line(at(0.3, 0.02), at(0.22, 0.32), "#4a382b", 2);
	const k = (t * 0.6) % 1;
	picture(r, A, 0.62, (c) => {
		c.fillStyle = "rgba(255,255,255,0.96)";
		c.strokeStyle = "#8a5cc7";
		c.lineWidth = 2.2;
		c.beginPath();
		c.roundRect(-56, -34, 112, 68, 7);
		c.fill();
		c.stroke();
		// Inputs: the overhead and wrist camera images, and the six joint angles.
		drawPixelImage(c, -51, -29, 20, 15, { frame: 1.2 });
		drawWristImage(c, -51, -9, 20, 15, 1.2);
		for (let i = 0; i < 6; i++) {
			const hgt = 3 + TARGETS[(i + 2) % 6] * 9;
			c.fillStyle = JOINT_COLORS[i];
			c.fillRect(-51 + i * 3.5, 29 - hgt, 2.7, hgt);
		}
		arrow2d(c, -28, -20, -21, -11, "#8a5cc7", 1.5, 4);
		arrow2d(c, -28, -1, -21, -1, "#8a5cc7", 1.5, 4);
		arrow2d(c, -28, 20, -21, 10, "#8a5cc7", 1.5, 4);
		const lit = [0, 1, 2].map((ci) => (t === 0 ? 0.5 : Math.max(0, 1 - Math.abs(k * 3.4 - ci - 0.2) * 1.5)));
		netGlyph(c, -16, -24, 22, 48, [3, 4, 3], lit);
		arrow2d(c, 10, 0, 17, 0, "#8a5cc7", 1.5, 4);
		// Output: an action chunk, the next stretch of all six joint targets.
		drawChunk(c, 20, -27, 32, 50, t);
	});
}

/**
 * An action chunk as a small chart: six joint-target curves over the chunk's time span. The
 * cursor sweeps the first half, then a fresh chunk (shifted by half) replaces it. t null: still.
 */
export function drawChunk(c, x, y, w, h, t, lw = 1.3) {
	const HALF = 1.6; // seconds of animation per half chunk
	const n = t === null ? 0 : Math.floor(t / HALF);
	const f = t === null ? 0.5 : (t % HALF) / HALF;
	c.fillStyle = "#fbf8ff";
	c.fillRect(x, y, w, h);
	c.strokeStyle = "#c9b6e4";
	c.lineWidth = Math.max(0.6, lw * 0.6);
	c.strokeRect(x, y, w, h);
	const cur = x + f * w * 0.5;
	for (let i = 0; i < 6; i++) {
		const base = y + h * ((i + 0.7) / 6.4);
		const val = (s) => base + h * 0.06 * Math.sin(s * 1.9 + i * 1.3) + h * 0.03 * Math.sin(s * 4.3 + i);
		c.strokeStyle = JOINT_COLORS[i];
		c.lineWidth = lw;
		c.beginPath();
		for (let k = 0; k <= 16; k++) {
			const u = k / 16;
			const s = (n + u * 2) * 0.9; // the chunk spans two halves of chunk time
			const px = x + 2 + u * (w - 4);
			if (k) c.lineTo(px, val(s));
			else c.moveTo(px, val(s));
		}
		c.stroke();
	}
	// The part already sent fades behind the cursor; the cursor marks "now".
	c.fillStyle = "rgba(251,248,255,0.55)";
	c.fillRect(x + 1, y + 1, cur - x - 1, h - 2);
	c.strokeStyle = "#e8792f";
	c.lineWidth = lw * 1.2;
	c.beginPath();
	c.moveTo(cur, y - 1);
	c.lineTo(cur, y + h + 1);
	c.stroke();
}

function cargoDrive(r, A, t) {
	const at = sf(A);
	for (const u of [-0.3, 0.3]) r.line(at(u, 0.02), at(u, 0.16), "#5d6672", 2.4);
	const q = (u0, v0, u1, v1, color) => r.quad([at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)], color, { flat: true });
	q(-0.5, 0.14, 0.5, 0.82, "#3b4552");
	q(-0.46, 0.18, 0.46, 0.78, "#0f2236");
	for (let i = 1; i < 4; i++) r.line(at(-0.46, 0.18 + i * 0.15), at(0.46, 0.18 + i * 0.15), "rgba(120,170,220,0.25)", 0.8);
	for (let i = 1; i < 6; i++) r.line(at(-0.46 + i * 0.153, 0.18), at(-0.46 + i * 0.153, 0.78), "rgba(120,170,220,0.2)", 0.8);
	const colors = ["#ff6b5b", "#ffd23f", "#5aa9ff"];
	for (let p = 0; p < 3; p++) {
		const pts = [];
		for (let i = 0; i <= 30; i++) {
			const u = -0.44 + (i / 30) * 0.88;
			pts.push(at(u, 0.48 + 0.2 * Math.sin(u * 14 - t * 5 + (p * 2 * Math.PI) / 3)));
		}
		r.polyline(pts, colors[p], 2);
	}
}

function cargoJoint(r, A, h, t) {
	const at = hf(A, h, 1.25);
	const z = 0.38;
	for (const f of [-0.28, 0.12]) {
		const p = at(f, 0);
		r.orientedBox(p[0], p[1], A[2], 0.15, 0.27, (z - 0.04) * 1.25, h, "#56606d");
	}
	r.tube(at(-0.46, 0, z), at(-0.2, 0, z), 0.25, "#56606d", 12);
	r.tube(at(-0.2, 0, z), at(0.36, 0, z), 0.09, "#b8c0ca", 8);
	r.tube(at(0.3, 0, z), at(0.38, 0, z), 0.28, "#c9d0d8", 14);
	// Marker on the output disk turns with the shaft.
	const a = t * 3;
	const m0 = at(0.385, Math.cos(a) * 0.05, z + Math.sin(a) * 0.05);
	const m1 = at(0.385, Math.cos(a) * 0.19, z + Math.sin(a) * 0.19);
	r.line(m0, m1, "#d9483b", 2.6);
	// Torque arrow around the shaft.
	const arc = [];
	for (let i = 0; i <= 18; i++) {
		const b = Math.PI * 0.25 + (i / 18) * Math.PI * 1.45;
		arc.push(at(0.08, Math.cos(b) * 0.3, z + Math.sin(b) * 0.3));
	}
	r.polyline(arc, "rgba(232,121,47,0.35)", 11);
	r.polyline(arc, "#e8792f", 4.5);
	const b = Math.PI * 0.25 + Math.PI * 1.45;
	const tip = at(0.08, Math.cos(b + 0.25) * 0.3, z + Math.sin(b + 0.25) * 0.3);
	const w1 = at(0.08, Math.cos(b - 0.05) * 0.4, z + Math.sin(b - 0.05) * 0.4);
	const w2 = at(0.08, Math.cos(b - 0.05) * 0.2, z + Math.sin(b - 0.05) * 0.2);
	r.quad([w1, tip, w2], "#e8792f");
}

function cargoArm(r, A, h, t) {
	const at = hf(A, h, 1.2);
	const base = at(-0.28, 0.08);
	const k = shuttle(t, 3.2, 0.4);
	const p0 = at(0.3, -0.26, 0.1);
	const p1 = at(0.2, 0.3, 0.3);
	const tgt = [p0[0] + (p1[0] - p0[0]) * k, p0[1] + (p1[1] - p0[1]) * k, p0[2] + (p1[2] - p0[2]) * k];
	r.shadow(base[0], base[1], 0.2, 0.2, 0.2, A[2]);
	drawSixAxis(r, base[0], base[1], tgt, { scale: 0.62, z: A[2], tool: "fingers", grip: 0 });
	drawHangingBunch(r, tgt[0], tgt[1], tgt[2] + 0.01, 0, 0.75);
}

function cargoGripper(r, A, h, t, reduced) {
	const at = hf(A, h);
	const PS = 1.4;
	// Still frame (reduced motion): the bunch still in the closed fingers, just above its spot, as
	// the cart tag says ("in soft fingers"), rather than already let go.
	const ph = reduced ? 0.42 : (t / 3.4) % 1;
	const placed = ph >= 0.45;
	// The tray; once placed, its grape spot holds the bunch.
	drawPlate(r, A[0], A[1], A[2], h, placed ? { grapes: true } : {}, { scale: PS });
	const spot = at(-0.14 * PS, -0.1 * PS, 0);
	const down = ph < 0.45 ? ph / 0.45 : ph < 0.6 ? 1 : 1 - (ph - 0.6) / 0.4;
	const tipZ = A[2] + 1.0 - 0.46 * down * down * (3 - 2 * down);
	// The grape station's six-axis arm (a small model beside the tray) lowers the bunch and opens.
	const base = at(-0.05, -0.62);
	r.shadow(base[0], base[1], 0.2, 0.2, 0.2, A[2]);
	drawSixAxis(r, base[0], base[1], [spot[0], spot[1], tipZ], { scale: 0.62, z: A[2], tool: "fingers", grip: placed ? Math.min(1, (ph - 0.45) * 6) : 0 });
	if (!placed) drawHangingBunch(r, spot[0], spot[1], tipZ + 0.01, 0, 1.3);
	if (placed && ph < 0.75) {
		const k = (ph - 0.45) / 0.3;
		const ring = [];
		for (let i = 0; i <= 14; i++) {
			const a = (i / 14) * Math.PI * 2;
			ring.push([spot[0] + Math.cos(a) * (0.1 + k * 0.15), spot[1] + Math.sin(a) * (0.1 + k * 0.15), A[2] + 0.12]);
		}
		r.polyline(ring, `rgba(255,255,255,${(0.8 * (1 - k)).toFixed(2)})`, 1.4);
	}
}

/** Entry point used by the ride module. t is 0 under reduced motion. */
export function drawCargo(r, stopId, pos, t, reduced = false) {
	const A = pos.anchor;
	const h = pos.heading;
	switch (stopId) {
		case "trigger":
			return cargoTrigger(r, A, t);
		case "light":
			return cargoLight(r, A, t);
		case "sensor":
			return cargoImage(r, A);
		case "detection":
			return cargoDetection(r, A);
		case "position-3d":
			return cargoPoint(r, A);
		case "grasp":
			return cargoGrasp(r, A, t);
		case "trajectory":
			return cargoTrajectory(r, A, t);
		case "joint-targets":
			return cargoTargets(r, A, t);
		case "policy":
			return cargoPolicy(r, A, t);
		case "drive":
			return cargoDrive(r, A, t);
		case "joint":
			return cargoJoint(r, A, h, t);
		case "arm-motion":
			return cargoArm(r, A, h, t);
		case "gripper":
			return cargoGripper(r, A, h, t, reduced);
		default:
			return undefined;
	}
}
