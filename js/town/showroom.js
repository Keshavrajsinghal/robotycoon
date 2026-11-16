// Showroom (#/showroom): every content.showroom robot drawn side by side at one height scale, each
// on a plinth with a small payload block. Under each robot, range bars on shared log scales show
// its payload and reach ranges, because those span several powers of ten (a gram-scale delta and a
// multi-tonne arm or gantry would not fit one linear drawing). Values come from content
// (payloadKg, reachMm, reachText, heightMm, speed, notes, sources); this file holds drawing code
// and UI chrome only.

import { $, h, loadCss } from "../core/dom.js";
import { circlePoints, IsoRenderer, project } from "../engine/iso.js";
import { drawDelta, drawScara, drawSixAxis, ik2 } from "../engine/robots.js";
import { conceptLink } from "../ui/concept.js";
import { icon } from "../ui/icons.js";
import { drawAmr, drawCobot, drawGantryAcross, drawHumanoid } from "./robots-extra.js";

const KINDS = new Set(["six-axis", "scara", "delta", "gantry", "cobot", "mobile-robot", "humanoid"]);
/** Drawing by concept id; the robot's own id is the fallback (placeholder content may differ). */
const kindOf = (rb) => (KINDS.has(rb.concept) ? rb.concept : KINDS.has(rb.id) ? rb.id : "six-axis");

const ACCENT = {
	"six-axis": "#e8792f",
	scara: "#2f6fb3",
	delta: "#3d7fd1",
	gantry: "#d9a400",
	cobot: "#2a9fd6",
	"mobile-robot": "#1f9e8f",
	humanoid: "#8a5cc7",
};
const PLINTH = "#e4dfd4";
const PLINTH_TOP = "#efebe3";

// Six-axis pose at unit scale (target relative to the base) and the height it reaches: upper arm
// raised, forearm reaching forward and down, so the arm reads as an arm rather than a folded lump.
const SIX_TARGET = [0.86, 0.28, 0.85];
const SIX_TOP = (() => {
	const W = [SIX_TARGET[0], SIX_TARGET[1], SIX_TARGET[2] + 0.26];
	const k = ik2(0.78, 0.72, Math.hypot(W[0], W[1]), W[2] - 0.72, true);
	return Math.max(0.72 + k.elbow[1], W[2]) + 0.15;
})();

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const ACROSS = [Math.SQRT1_2, -Math.SQRT1_2]; // world direction that runs left to right on screen
const DEPTH = [Math.SQRT1_2, Math.SQRT1_2]; // world direction toward the viewer
const GANTRY_MAX = 2.0; // longest gantry frame drawn, m; a longer stroke is drawn with break marks
const BLOCK_MAX = 0.24; // largest payload block side, m (the block is a cue; the bars carry the values)

/** Geometry for one robot in world meters around its base at the origin. */
function specFor(rb) {
	const kind = kindOf(rb);
	const H = clamp((rb.heightMm?.mid ?? 1000) / 1000, 0.2, 6);
	const reachMax = (rb.reachMm?.max ?? 0) / 1000;
	// Gantry: reach is a stroke along the frame. Mobile base: reach_mm is the footprint length.
	const stroke = kind === "gantry" ? reachMax : 0;
	const frame = kind === "gantry" ? clamp(stroke || 1.6, 0.6, GANTRY_MAX) : 0;
	const amr = kind === "mobile-robot" ? clamp(reachMax || 0.8, 0.3, 2) : 0;
	// Payload block: a steel-like weight sized from the middle of the range on a log scale, capped.
	const p = rb.payloadKg;
	const kg = p && p.max > 0 ? Math.sqrt(Math.max(p.min, p.max / 1e4) * p.max) : 0;
	const side = kg > 0 ? clamp(0.05 * Math.cbrt(kg), 0.05, BLOCK_MAX) : 0;
	const bodyR = kind === "gantry" ? frame / 2 : kind === "mobile-robot" ? amr * 0.55 : ({ "six-axis": 0.45, scara: 0.45, delta: 0.42, cobot: 0.35, humanoid: 0.2 }[kind] ?? 0.4) * H;
	const depth = kind === "gantry" ? clamp(H * 0.5, 0.6, 1.4) : 0;
	const top = kind === "mobile-robot" ? H + Math.min(0.26, amr * 0.24) : H + (kind === "gantry" ? 0.15 : 0);
	// Block in front of the robot, a little to the left on screen.
	const off = kind === "gantry" ? frame / 2 + 0.2 + side * 0.6 : bodyR * 0.8 + side * 0.7 + 0.12;
	const block = kind === "gantry" ? [-ACROSS[0] * off + DEPTH[0] * (depth / 2), -ACROSS[1] * off + DEPTH[1] * (depth / 2)] : [-0.05 - side * 0.35, off];
	return { rb, kind, H, top, frame, broken: stroke > GANTRY_MAX, amr, side, bodyR, depth, block, accent: ACCENT[kind] ?? "#59616c" };
}

/** Corners of a gantry's frame rectangle (length L across the screen, depth D). */
function frameRect(L, D) {
	const P = (a, b) => [ACROSS[0] * a + DEPTH[0] * b, ACROSS[1] * a + DEPTH[1] * b];
	return [P(-L / 2, -D / 2), P(L / 2, -D / 2), P(L / 2, D / 2), P(-L / 2, D / 2)];
}

/** World points that bound the drawing (for sizing the canvas). */
function boundPoints(s) {
	const pts = [[0, 0, 0]];
	if (s.kind === "gantry") {
		for (const [x, y] of frameRect(s.frame + 0.3, s.depth + 0.3)) {
			pts.push([x, y, 0]);
			pts.push([x, y, s.top]);
		}
	} else for (const x of [-s.bodyR, s.bodyR]) for (const y of [-s.bodyR, s.bodyR]) pts.push([x, y, s.top]);
	if (s.side) for (const dx of [-0.5, 0.5]) for (const dy of [-0.5, 0.5]) for (const z of [0, s.side]) pts.push([s.block[0] + dx * s.side, s.block[1] + dy * s.side, z]);
	return pts;
}

function extents(pts) {
	let x0 = Infinity;
	let x1 = -Infinity;
	let y0 = Infinity;
	let y1 = -Infinity;
	for (const p of pts) {
		const [px, py] = project(p[0], p[1], p[2]);
		x0 = Math.min(x0, px);
		x1 = Math.max(x1, px);
		y0 = Math.min(y0, py);
		y1 = Math.max(y1, py);
	}
	return { x0, x1, y0, y1 };
}

/** Two slanted strokes across a beam: the frame is longer than drawn. */
function breakMark(c, zoom) {
	const hh = Math.max(9, 7 * zoom);
	c.lineCap = "butt";
	for (const dx of [-2.5, 2.5]) {
		c.strokeStyle = "#f4f4f2";
		c.lineWidth = 3.4;
		c.beginPath();
		c.moveTo(dx - hh * 0.35, hh * 0.6);
		c.lineTo(dx + hh * 0.35, -hh * 0.6);
		c.stroke();
		c.strokeStyle = "#3b4048";
		c.lineWidth = 1;
		for (const e of [-1.7, 1.7]) {
			c.beginPath();
			c.moveTo(dx + e - hh * 0.35, hh * 0.6);
			c.lineTo(dx + e + hh * 0.35, -hh * 0.6);
			c.stroke();
		}
	}
}

function drawRobot(r, s) {
	const H = s.H;
	switch (s.kind) {
		case "scara": {
			const k = H / 1.65;
			drawScara(r, 0, 0, [0.5 * k, 0.55 * k], 0.35 * k, { scale: k });
			break;
		}
		case "delta": {
			const k = 0.615 * H;
			const f = 0.56 * k;
			const P = 0.06 * k;
			const postAt = (x, y) => r.box(x - P / 2, y - P / 2, 0, P, P, H, "#9aa5b1");
			postAt(-f, -f);
			postAt(f, -f);
			postAt(-f, f);
			r.box(-f - P / 2, -f - P / 2, H - P, 2 * f + P, P, P, "#9aa5b1");
			r.box(-f - P / 2, -f - P / 2, H - P, P, 2 * f + P, P, "#9aa5b1");
			// Small belt under the robot.
			r.box(-f * 0.9, -0.18 * k, 0, f * 1.8, 0.36 * k, 0.1 * H, "#3b4048", { top: "#2f343b" });
			drawDelta(r, 0, 0, H - P, [0.08 * k, 0.04 * k, H - P - 1.25 * k], { scale: k });
			r.box(f - P / 2, -f - P / 2, H - P, P, 2 * f + P, P, "#9aa5b1");
			r.box(-f - P / 2, f - P / 2, H - P, 2 * f + P, P, P, "#9aa5b1");
			postAt(f, f);
			break;
		}
		case "gantry": {
			drawGantryAcross(r, 0, 0, s.frame, s.depth, H, { toolZ: H * 0.28 });
			if (s.broken) {
				const p = Math.max(0.06, Math.min(0.14, H * 0.05));
				for (const b of [-s.depth / 2, s.depth / 2]) {
					const a = s.frame * 0.3;
					r.billboard(ACROSS[0] * a + DEPTH[0] * b, ACROSS[1] * a + DEPTH[1] * b, H + p / 2, breakMark);
				}
			}
			break;
		}
		case "cobot":
			drawCobot(r, 0, 0, H, { yaw: 0.35 });
			break;
		case "mobile-robot":
			drawAmr(r, 0, 0, s.amr, H, { yaw: 0.3 });
			break;
		case "humanoid":
			drawHumanoid(r, 0, 0, H);
			break;
		default: {
			const k = H / SIX_TOP;
			drawSixAxis(r, 0, 0, [SIX_TARGET[0] * k, SIX_TARGET[1] * k, SIX_TARGET[2] * k], { scale: k, colors: { body: "#f0a24a", accent: "#3b4552" } });
		}
	}
}

function pill(c, text, x, y, opts = {}) {
	c.font = `700 ${opts.size ?? 12}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
	const w = Math.ceil(c.measureText(text).width) + 12;
	const hgt = (opts.size ?? 12) + 8;
	const x0 = Math.round(opts.align === "right" ? x - w : opts.align === "left" ? x : x - w / 2);
	const y0 = Math.round(y - hgt);
	c.fillStyle = "rgba(255,255,255,0.96)";
	c.strokeStyle = opts.border ?? "#1d2127";
	c.lineWidth = 1.5;
	c.beginPath();
	if (c.roundRect) c.roundRect(x0 + 0.5, y0 + 0.5, w, hgt, hgt / 2);
	else c.rect(x0 + 0.5, y0 + 0.5, w, hgt);
	c.fill();
	c.stroke();
	c.fillStyle = "#1d2127";
	c.textBaseline = "middle";
	c.fillText(text, x0 + 6.5, y0 + hgt / 2 + 1);
	return { w, h: hgt };
}

/** Payload block (a steel weight with a handle); its values are on the payload bar below. */
function drawPayload(r, s) {
	if (!s.side) return;
	const [x, y] = s.block;
	const a = s.side;
	r.shadow(x + a * 0.2, y + a * 0.2, a * 0.8, a * 0.8, 0.2);
	r.box(x - a / 2, y - a / 2, 0, a, a, a * 0.82, "#5d6670", { top: "#7b848e" });
	r.tube([x - a * 0.22, y, a * 0.82], [x - a * 0.22, y, a * 1.0], a * 0.06, "#3b4048", 6);
	r.tube([x + a * 0.22, y, a * 0.82], [x + a * 0.22, y, a * 1.0], a * 0.06, "#3b4048", 6);
	r.tube([x - a * 0.26, y, a * 1.0], [x + a * 0.26, y, a * 1.0], a * 0.06, "#3b4048", 6);
}

/** A meter stick at the same scale, with labels every meter. */
function drawRuler(r, maxH) {
	const top = Math.max(1, Math.ceil(maxH * 2) / 2);
	r.cylinder(0, 0, -0.04, 0.16, 0.04, "#59616c", 10);
	for (let z = 0; z < top - 1e-6; z += 0.5) r.box(-0.05, -0.05, z, 0.1, 0.1, Math.min(0.5, top - z), Math.round(z * 2) % 2 ? "#f4f4f2" : "#d9583b", { top: "#ffffff" });
	for (let m = 0; m <= top + 1e-6; m += 1) r.billboard(0, 0, m, (c) => pill(c, `${m} m`, -9, 9, { align: "right", size: 11 }));
}

/** Floor band across the whole stage. */
function drawFloor(c, w, baseY, k, depth) {
	const y0 = baseY - depth * 16 * k;
	const y1 = baseY + depth * 16 * k;
	c.fillStyle = "rgba(160,150,135,0.14)";
	c.fillRect(0, y0, w, y1 - y0);
	c.fillStyle = "rgba(120,110,95,0.28)";
	c.fillRect(0, Math.round(y1), w, 2);
	c.fillStyle = "rgba(127,127,127,0.22)";
	c.fillRect(0, Math.round(baseY), w, 1);
}

// ---------------------------------------------------------------------------
// Range bars: one band per quantity, the same log scale in every column.

const BAND_TOP = 32; // room for the axis title in the scale column
const BAND_BOTTOM = 10;

/** Powers of ten that bracket every value; null when there is nothing to show. */
function logDomain(values) {
	const pos = values.filter((v) => v > 0);
	if (!pos.length) return null;
	const lo = Math.floor(Math.log10(Math.min(...pos)) + 1e-9);
	const hi = Math.max(lo + 1, Math.ceil(Math.log10(Math.max(...pos)) - 1e-9));
	const px = clamp(Math.round(120 / (hi - lo)), 18, 44);
	return { lo, hi, px, height: BAND_TOP + (hi - lo) * px + BAND_BOTTOM };
}

const bandY = (dom, v) => BAND_TOP + (dom.hi - Math.log10(v)) * dom.px;
const tickText = (e) => (e < 0 ? `0.${"0".repeat(-e - 1)}1` : `1${"0".repeat(e)}`);

function bandShell(name, dom) {
	const el = h("div", { class: "spec-band", "data-band": name, "aria-hidden": "true" });
	el.style.height = `${dom.height}px`;
	for (let e = dom.lo; e <= dom.hi; e++) {
		const g = h("div", { class: "spec-grid" });
		g.style.top = `${Math.round(bandY(dom, 10 ** e))}px`;
		el.append(g);
	}
	return el;
}

/** The scale column's band: title and tick labels. */
function axisBand(name, dom, title) {
	const el = bandShell(name, dom);
	el.classList.add("spec-axis");
	el.append(h("div", { class: "spec-axis-title" }, title));
	for (let e = dom.lo; e <= dom.hi; e++) {
		const t = h("div", { class: "spec-tick" }, tickText(e));
		t.style.top = `${Math.round(bandY(dom, 10 ** e))}px`;
		el.append(t);
	}
	return el;
}

/** One robot's bar from range.min to range.max, labeled with the content text. */
function rangeBand(name, dom, range, label) {
	const el = bandShell(name, dom);
	if (!range || !(range.max > 0)) return el;
	const y0 = bandY(dom, range.max);
	const y1 = bandY(dom, Math.max(range.min, 10 ** dom.lo));
	const hgt = Math.max(6, y1 - y0);
	const mid = (y0 + y1) / 2;
	const bar = h("div", { class: "spec-bar" });
	bar.style.top = `${Math.round(mid - hgt / 2)}px`;
	bar.style.height = `${Math.round(hgt)}px`;
	const tag = h("div", { class: "spec-label" }, label);
	tag.style.top = `${Math.round(clamp(mid, 12, dom.height - 12))}px`;
	el.append(bar, tag);
	return el;
}

export function initShowroom(app) {
	loadCss("css/modules/town.css");
	const view = $("#showroom-view");
	const robots = app.content.showroom ?? [];
	const area1 = app.content.areas?.find((a) => a.area === 1) ?? null;
	const back = h("button", { class: "btn", type: "button", html: `${icon("park")}<span>Back to park</span>` });
	const toTown = h("button", { class: "btn", type: "button", html: `${icon("town")}<span>Town map</span>` });
	back.addEventListener("click", () => app.router.go({ name: "park" }));
	toTown.addEventListener("click", () => app.router.go({ name: "town" }));
	const stage = h("div", { class: "showroom-stage", role: "region", "aria-label": "Robots drawn at the same scale", tabindex: "0" });
	const cards = h("div", { class: "showroom-cards" });
	view.classList.add("showroom-v2");
	view.append(
		h("div", { class: "view-bar" }, back, toTown),
		h(
			"header",
			{ class: "showroom-head" },
			area1 ? h("div", { class: "panel-kicker" }, area1.title) : null,
			h("h2", {}, "Showroom"),
			h(
				"ul",
				{ class: "showroom-legend", "aria-label": "How to read the drawing" },
				h("li", {}, h("span", { class: "lg lg-scale", "aria-hidden": "true" }), "Height: same scale"),
				h("li", {}, h("span", { class: "lg lg-bar", "aria-hidden": "true" }), "Payload and reach: range bars, log scale"),
				h("li", {}, h("span", { class: "lg lg-block", "aria-hidden": "true" }), "Payload block, not to scale"),
			),
		),
		stage,
		cards,
	);

	const specs = robots.map(specFor);
	// Bars: every payload range; every reach range except a mobile base's (its reach_mm is a
	// footprint, and its caption says travel is limited only by the mapped area).
	const hasReachBar = (s) => s.kind !== "mobile-robot" && !!s.rb.reachMm;
	const payDom = logDomain(robots.flatMap((rb) => (rb.payloadKg ? [rb.payloadKg.min, rb.payloadKg.max] : [])));
	const reachDom = logDomain(specs.filter(hasReachBar).flatMap((s) => [s.rb.reachMm.min, s.rb.reachMm.max]));
	const track = h("div", { class: "showroom-track" });
	const canvas = h("canvas", { class: "showroom-canvas", role: "img", "aria-label": `${robots.map((rb) => rb.title).join(", ")}: drawn to the same height scale` });
	// The meter stick lives in the scale column, which stays pinned while the robots scroll past.
	const ruler = h("canvas", { class: "showroom-ruler", "aria-hidden": "true" });
	const cols = h("div", { class: "showroom-cols" });
	const columns = [];
	let lastSize = "";

	const reachCaption = (rb) => (rb.reachText ? h("dd", { html: rb.reachText }) : h("dd", { class: "num" }, rb.reachMm ? `${rb.reachMm.text} mm` : "-"));
	const dl = (rb) =>
		h(
			"dl",
			{ class: "showroom-specs" },
			h("dt", {}, "Payload"),
			h("dd", { class: "num" }, rb.payloadKg ? `${rb.payloadKg.text} kg` : "-"),
			h("dt", {}, "Reach"),
			reachCaption(rb),
			h("dt", {}, "Speed"),
			h("dd", { html: rb.speed || "-" }),
		);

	function buildDom() {
		stage.replaceChildren();
		cards.replaceChildren();
		if (!robots.length) {
			stage.append(h("p", { class: "empty" }, "The showroom has not been written yet."));
			return;
		}
		track.replaceChildren(canvas, cols);
		stage.append(track);
		const scaleCol = h(
			"div",
			{ class: "robot-col robot-col-scale", "data-robot": "scale" },
			ruler,
			payDom ? axisBand("payload", payDom, "Payload, kg") : null,
			reachDom ? axisBand("reach", reachDom, "Reach, mm") : null,
			h("div", { class: "robot-caption" }, h("h3", {}, "Scale")),
		);
		cols.append(scaleCol);
		columns.push({ col: scaleCol, spec: null });
		for (const s of specs) {
			const rb = s.rb;
			const more = h("button", { class: "robot-more", type: "button", "aria-label": `Details: ${rb.title}` }, rb.title);
			more.addEventListener("click", () => {
				const card = cards.querySelector(`[data-robot-card="${CSS.escape(rb.id)}"]`);
				card?.scrollIntoView({ behavior: app.reducedMotion() ? "auto" : "smooth", block: "start" });
				card?.focus({ preventScroll: true });
			});
			const col = h(
				"div",
				{ class: "robot-col", "data-robot": rb.id },
				payDom ? rangeBand("payload", payDom, rb.payloadKg, rb.payloadKg ? `${rb.payloadKg.text} kg` : "") : null,
				reachDom ? rangeBand("reach", reachDom, hasReachBar(s) ? rb.reachMm : null, rb.reachMm ? `${rb.reachMm.text} mm` : "") : null,
				h("div", { class: "robot-caption" }, h("h3", {}, more), dl(rb)),
			);
			col.style.setProperty("--robot", s.accent);
			cols.append(col);
			columns.push({ col, spec: s });
			const sources = rb.sources?.length
				? h(
						"ol",
						{ class: "sources" },
						rb.sources.map((x) => h("li", { value: String(x.n ?? "") || undefined }, h("a", { href: x.url, target: "_blank", rel: "noopener" }, x.title), x.note ? h("span", { html: ` — ${x.note}` }) : null)),
					)
				: null;
			const card = cards.appendChild(
				h(
					"article",
					{ class: "card showroom-card", "data-robot-card": rb.id, tabindex: "-1" },
					h("h3", {}, rb.title),
					rb.concept ? h("p", { class: "meta-line" }, "Concept: ", conceptLink(app, rb.concept)) : null,
					dl(rb),
					rb.notes ? h("div", { class: "prose", html: rb.notes }) : null,
					sources ? h("div", { class: "section" }, h("h4", {}, "Sources"), sources) : null,
				),
			);
			card.style.setProperty("--robot", s.accent);
		}
	}

	/**
	 * Draw every robot on one canvas at one shared scale and floor line. Each robot gets a slot as
	 * wide as its body and payload block (and at least as wide as its caption and range bars).
	 */
	function layout() {
		if (view.hidden || !specs.length) return;
		const vw = view.clientWidth;
		const vh = window.innerHeight;
		if (vw < 10) return;
		const phone = app.isPhone();
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const sizeKey = `${vw}x${vh}@${dpr}`;
		if (sizeKey === lastSize) return;
		lastSize = sizeKey;
		const maxStage = Math.round(clamp(vh * (phone ? 0.34 : 0.44), 230, 400));
		const PAD_TOP = 36;
		const PAD_BOTTOM = 24;
		const own = specs.map((s) => extents(boundPoints(s)));
		const above = Math.max(...own.map((e) => -e.y0));
		const below = Math.max(...own.map((e) => e.y1));
		const minW = phone ? 168 : 170;
		const SCALE_W = 92;
		const slotsAt = (k) => {
			let x = SCALE_W;
			const out = specs.map((s, i) => {
				const ow = (own[i].x1 - own[i].x0) * k;
				const w = Math.ceil(Math.max(minW, ow + 40));
				const baseX = x + (w - ow) / 2 - own[i].x0 * k;
				const slot = { x, w, baseX };
				x += w;
				return slot;
			});
			return { slots: out, width: x };
		};
		// Largest scale that fits the stage height; on wider screens shrink it (down to a floor)
		// when that lets every robot fit side by side without scrolling.
		let k = (maxStage - PAD_TOP - PAD_BOTTOM) / (above + below);
		const avail = stage.clientWidth - 14;
		if (slotsAt(k).width > avail && slotsAt(k * 0.6).width <= avail) {
			let lo = k * 0.6;
			let hi = k;
			for (let i = 0; i < 18; i++) {
				const mid = (lo + hi) / 2;
				if (slotsAt(mid).width <= avail) lo = mid;
				else hi = mid;
			}
			k = lo;
		}
		const { slots, width } = slotsAt(k);
		const stageH = Math.round(PAD_TOP + PAD_BOTTOM + (above + below) * k);
		const baseY = PAD_TOP + above * k;
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(stageH * dpr);
		canvas.style.width = `${width}px`;
		canvas.style.height = `${stageH}px`;
		track.style.width = `${width}px`;
		track.style.setProperty("--stage-h", `${stageH}px`);
		columns[0].col.style.width = `${SCALE_W}px`;
		slots.forEach((sl, i) => {
			columns[i + 1].col.style.width = `${sl.w}px`;
		});
		const ctx = canvas.getContext("2d");
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		drawFloor(ctx, width, baseY, k, (below / 16) * 0.9);
		ruler.width = Math.round(SCALE_W * dpr);
		ruler.height = Math.round(stageH * dpr);
		ruler.style.width = `${SCALE_W}px`;
		ruler.style.height = `${stageH}px`;
		const rctx = ruler.getContext("2d");
		rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		rctx.clearRect(0, 0, SCALE_W, stageH);
		drawFloor(rctx, SCALE_W, baseY, k, (below / 16) * 0.9);
		const rr = new IsoRenderer(rctx);
		rr.setTransform(k, 62, baseY);
		drawRuler(rr, Math.max(...specs.map((s) => s.H)));
		const r = new IsoRenderer(ctx);
		specs.forEach((s, i) => {
			r.setTransform(k, slots[i].baseX, baseY);
			if (s.kind !== "gantry") {
				const pr = Math.max(0.18, s.bodyR * 0.55);
				r.cylinder(0, 0, -0.03, pr, 0.03, PLINTH, 20);
				r.groundPoly(circlePoints(0, 0, pr, 20, Math.PI / 20), PLINTH_TOP, 0.001);
			}
			try {
				drawRobot(r, s);
			} catch (e) {
				console.error(e);
			}
			drawPayload(r, s);
		});
	}

	buildDom();
	const ro = new ResizeObserver(() => layout());
	ro.observe(view);

	return {
		show() {
			view.hidden = false;
			lastSize = "";
			layout();
		},
		hide() {
			view.hidden = true;
		},
		destroy() {
			ro.disconnect();
			view.replaceChildren();
		},
	};
}
