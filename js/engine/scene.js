// Scene: a depth-sorted static layer cached to an offscreen canvas, a per-frame layer
// (dynamic items plus "live" static items that must interleave with them), hit targets,
// HTML labels, the camera, pointer input, and a requestAnimationFrame loop that idles.

import { depthOf, IsoRenderer, project } from "./iso.js";

const MARGIN = 0.2; // the static cache covers the viewport plus this fraction on each side
/** Draw order bands for static items: terrain first, then flat ground decals, then objects. */
export const LAYER = { TERRAIN: 0, GROUND: 1, OBJECT: 2 };
const TAP_SLOP = 8; // px a pointer may move and still count as a tap

function rectOfBounds(b) {
	const [x0, y0, z0, x1, y1, z1] = b;
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const x of [x0, x1])
		for (const y of [y0, y1])
			for (const z of [z0, z1]) {
				const [px, py] = project(x, y, z);
				if (px < minX) minX = px;
				if (py < minY) minY = py;
				if (px > maxX) maxX = px;
				if (py > maxY) maxY = py;
			}
	return [minX, minY, maxX, maxY];
}

const overlaps = (a, b) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];

export class Scene {
	/**
	 * @param {{canvas: HTMLCanvasElement, overlay: HTMLElement, background?: string,
	 *          limits?: number[], minZoom?: number, maxZoom?: number}} opts
	 */
	constructor({ canvas, overlay, background = "#5fb0d9", limits = null, minZoom = 0.2, maxZoom = 2.6 }) {
		this.canvas = canvas;
		this.overlay = overlay;
		this.ctx = canvas.getContext("2d");
		this.r = new IsoRenderer(this.ctx);
		this.background = background;
		this.limits = limits; // [minPx, minPy, maxPx, maxPy] the camera center may visit
		this.minZoom = minZoom;
		this.maxZoom = maxZoom;
		this.camera = { x: 0, y: 0, zoom: 1 };
		this.insets = { top: 0, right: 0, bottom: 0, left: 0 };
		this.w = 1;
		this.h = 1;
		this.dpr = 1;

		this.items = []; // static items
		this.sorted = true;
		this.dynamic = [];
		this.hits = [];
		this.labels = new Map();
		this.ticks = new Set();
		this.seq = 0;

		this.cache = { canvas: document.createElement("canvas"), zoom: 0, cx: 0, cy: 0, w: 0, h: 0, valid: false };
		this.cache.ctx = this.cache.canvas.getContext("2d");
		this.cacheR = new IsoRenderer(this.cache.ctx);
		this.settleTimer = 0;

		this.raf = 0;
		this.lastTs = 0;
		this.time = 0;
		this.follow = null; // () => [x,y,z] | null
		this.camAnim = null;
		this.reducedMotion = () => false;
		this.onTap = null; // (hit|null, sx, sy) => void
		this.onUserPan = null; // () => void, called when the user starts dragging or zooming
		this.labelsVisible = true;

		this.pointers = new Map();
		this.gesture = null;
		this._loop = (ts) => this.loop(ts);
		this.bindInput();
		this.resizeObserver = new ResizeObserver(() => this.resize());
		this.resizeObserver.observe(canvas);
		this.resize();
	}

	// -------------------------------------------------------------------------
	// Content

	/**
	 * Add a static item.
	 * item: { bounds: [x0,y0,z0,x1,y1,z1], draw(r), depth?, layer?: LAYER.* (default OBJECT),
	 *         live?: true to draw every frame interleaved with dynamic items, group? }
	 */
	add(item) {
		item.rect = rectOfBounds(item.bounds);
		if (item.depth === undefined) {
			const b = item.bounds;
			item.depth = depthOf((b[0] + b[3]) / 2, (b[1] + b[4]) / 2, 0);
		}
		item.layer ??= LAYER.OBJECT;
		item.seq = this.seq++;
		this.items.push(item);
		this.sorted = false;
		this.invalidate();
		return item;
	}

	/**
	 * Add an item drawn every frame. item: { depth: number | () => number, draw(r, t),
	 * bounds?: [..] | () => [..] (for culling), animated?: () => boolean (keeps the loop running
	 * while true, visible, and motion is allowed), group? }
	 */
	addDynamic(item) {
		item.seq = this.seq++;
		this.dynamic.push(item);
		this.requestFrame();
		return item;
	}

	/**
	 * Add a tap/click target. hit: { id, kind, bounds: [x0,y0,z0,x1,y1,z1], onActivate(), title?,
	 * priority?: higher wins, group? }
	 */
	addHit(hit) {
		hit.rect = rectOfBounds(hit.bounds);
		hit.area = (hit.rect[2] - hit.rect[0]) * (hit.rect[3] - hit.rect[1]);
		hit.priority ??= 0;
		this.hits.push(hit);
		return hit;
	}

	/**
	 * Add an HTML label positioned at a world point each frame.
	 * label: { id, pos: [x,y,z] | () => [x,y,z] | null, html?, text?, kind?, className?,
	 *          onClick?, ariaLabel?, group? }  Returns the element.
	 */
	addLabel(label) {
		this.removeLabel(label.id);
		const anchor = document.createElement("div");
		anchor.className = "label-anchor";
		const el = document.createElement(label.onClick ? "button" : "div");
		el.className = `label label-${label.kind ?? "info"}${label.className ? ` ${label.className}` : ""}`;
		if (label.onClick) {
			el.type = "button";
			el.addEventListener("click", (e) => {
				e.stopPropagation();
				label.onClick();
			});
		}
		if (label.ariaLabel) el.setAttribute("aria-label", label.ariaLabel);
		if (label.html !== undefined) el.innerHTML = label.html;
		else el.textContent = label.text ?? "";
		anchor.append(el);
		label.el = el;
		label.anchor = anchor;
		this.overlay.appendChild(anchor);
		this.labels.set(label.id, label);
		this.requestFrame();
		return el;
	}

	removeLabel(id) {
		const l = this.labels.get(id);
		if (l) {
			l.anchor.remove();
			this.labels.delete(id);
		}
	}

	/** Remove everything (or everything in one group). */
	clear(group) {
		const keep = (x) => group !== undefined && x.group !== group;
		this.items = this.items.filter(keep);
		this.dynamic = this.dynamic.filter(keep);
		this.hits = this.hits.filter(keep);
		for (const [id, l] of [...this.labels]) if (!keep(l)) this.removeLabel(id);
		this.sorted = false;
		this.invalidate();
	}

	invalidate() {
		this.cache.valid = false;
		this.requestFrame();
	}

	addTick(fn) {
		this.ticks.add(fn);
		this.requestFrame();
		return () => this.ticks.delete(fn);
	}

	setLabelsVisible(on) {
		this.labelsVisible = on;
		this.overlay.classList.toggle("labels-off", !on);
	}

	setInsets(insets) {
		Object.assign(this.insets, insets);
		this.requestFrame();
	}

	// -------------------------------------------------------------------------
	// Camera

	worldToScreen(x, y, z = 0) {
		const [px, py] = project(x, y, z);
		return [(px - this.camera.x) * this.camera.zoom + this.w / 2, (py - this.camera.y) * this.camera.zoom + this.h / 2];
	}

	screenToProj(sx, sy) {
		return [this.camera.x + (sx - this.w / 2) / this.camera.zoom, this.camera.y + (sy - this.h / 2) / this.camera.zoom];
	}

	/** Camera center that puts proj point (px, py) in the middle of the unoccluded area. */
	camFor(px, py, zoom = this.camera.zoom) {
		const ux = (this.insets.left - this.insets.right) / 2;
		const uy = (this.insets.top - this.insets.bottom) / 2;
		return [px - ux / zoom, py - uy / zoom];
	}

	clampCamera() {
		const c = this.camera;
		c.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, c.zoom));
		if (this.limits) {
			c.x = Math.max(this.limits[0], Math.min(this.limits[2], c.x));
			c.y = Math.max(this.limits[1], Math.min(this.limits[3], c.y));
		}
	}

	/** Look at a world point. opts: { zoom, instant } (instant is forced under reduced motion). */
	lookAt(x, y, z = 0, opts = {}) {
		const zoom = Math.max(this.minZoom, Math.min(this.maxZoom, opts.zoom ?? this.camera.zoom));
		const [px, py] = project(x, y, z);
		const [cx, cy] = this.camFor(px, py, zoom);
		if (opts.instant || this.reducedMotion()) {
			this.camAnim = null;
			Object.assign(this.camera, { x: cx, y: cy, zoom });
			this.clampCamera();
			this.invalidate();
			return;
		}
		this.camAnim = { from: { ...this.camera }, to: { x: cx, y: cy, zoom }, t: 0, dur: opts.duration ?? 0.9 };
		this.requestFrame();
	}

	/** Zoom to fit a world rectangle [x0,y0,x1,y1] into the unoccluded area. */
	fitWorldRect(rect, opts = {}) {
		const r = rectOfBounds([rect[0], rect[1], 0, rect[2], rect[3], opts.height ?? 0]);
		const availW = Math.max(100, this.w - this.insets.left - this.insets.right);
		const availH = Math.max(100, this.h - this.insets.top - this.insets.bottom);
		const zoom = Math.min(availW / (r[2] - r[0]), availH / (r[3] - r[1])) * (opts.pad ?? 0.92);
		const [wx, wy] = [(rect[0] + rect[2]) / 2, (rect[1] + rect[3]) / 2];
		this.lookAt(wx, wy, (opts.height ?? 0) / 2, { ...opts, zoom });
	}

	zoomAt(factor, sx, sy) {
		const before = this.screenToProj(sx, sy);
		this.camera.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.camera.zoom * factor));
		const after = this.screenToProj(sx, sy);
		this.camera.x += before[0] - after[0];
		this.camera.y += before[1] - after[1];
		this.clampCamera();
		this.camAnim = null;
		this.scheduleSettle();
		this.requestFrame();
	}

	/** Re-render the static cache at the current zoom 140 ms after the last zoom change. */
	scheduleSettle() {
		clearTimeout(this.settleTimer);
		this.settleTimer = setTimeout(() => {
			this.settleTimer = 0;
			this.invalidate();
		}, 140);
	}

	stepCamera(dt) {
		let busy = false;
		if (this.camAnim) {
			const a = this.camAnim;
			a.t = this.reducedMotion() ? 1 : a.t + dt / a.dur;
			const k = a.t >= 1 ? 1 : 1 - (1 - a.t) ** 3;
			this.camera.x = a.from.x + (a.to.x - a.from.x) * k;
			this.camera.y = a.from.y + (a.to.y - a.from.y) * k;
			const zoomChanged = a.from.zoom !== a.to.zoom;
			this.camera.zoom = a.from.zoom * (a.to.zoom / a.from.zoom) ** k;
			if (a.t >= 1) {
				// Land exactly on the target: the interpolation leaves float error (0.8999 for 0.9),
				// which would break zoom thresholds such as the one that shows building labels.
				Object.assign(this.camera, a.to);
				this.camAnim = null;
				if (zoomChanged) this.invalidate();
			} else if (zoomChanged) this.scheduleSettle();
			busy = true;
		} else if (this.follow && !this.gesture) {
			const p = this.follow();
			if (p) {
				const [px, py] = project(p[0], p[1], p[2]);
				let [tx, ty] = this.camFor(px, py);
				if (this.limits) {
					tx = Math.max(this.limits[0], Math.min(this.limits[2], tx));
					ty = Math.max(this.limits[1], Math.min(this.limits[3], ty));
				}
				const dx = tx - this.camera.x;
				const dy = ty - this.camera.y;
				const distPx = Math.hypot(dx, dy) * this.camera.zoom;
				if (distPx > 0.3) {
					const k = this.reducedMotion() ? 1 : 1 - Math.exp(-dt * 5);
					this.camera.x += dx * k;
					this.camera.y += dy * k;
					busy = distPx > 0.6 && !this.reducedMotion();
				}
			}
		}
		this.clampCamera();
		return busy;
	}

	// -------------------------------------------------------------------------
	// Loop and rendering

	requestFrame() {
		if (!this.raf) this.raf = requestAnimationFrame(this._loop);
	}

	isIdle() {
		return this.raf === 0 && !this.camAnim;
	}

	viewRect(pad = 0) {
		const z = this.camera.zoom;
		const hw = this.w / 2 / z + pad;
		const hh = this.h / 2 / z + pad;
		return [this.camera.x - hw, this.camera.y - hh, this.camera.x + hw, this.camera.y + hh];
	}

	isRectVisible(bounds) {
		return overlaps(rectOfBounds(bounds), this.viewRect());
	}

	loop(ts) {
		this.raf = 0;
		const t = ts / 1000;
		const dt = this.lastTs ? Math.min(0.1, Math.max(0, t - this.lastTs)) : 1 / 60;
		this.lastTs = t;
		this.time = t;
		let busy = false;
		for (const fn of this.ticks) if (fn(dt, t)) busy = true;
		if (this.stepCamera(dt)) busy = true;
		if (!this.reducedMotion() && !document.hidden) {
			const view = this.viewRect(80);
			for (const d of this.dynamic) {
				if (!d.animated?.()) continue;
				const b = typeof d.bounds === "function" ? d.bounds() : d.bounds;
				if (!b || overlaps(rectOfBounds(b), view)) {
					busy = true;
					break;
				}
			}
		}
		if (this.canvas.clientWidth === 0) {
			// Hidden view: stop until resize() or requestFrame() wakes the loop again.
			this.lastTs = 0;
			return;
		}
		this.render(t);
		if (busy || this.gesture) this.raf = requestAnimationFrame(this._loop);
		else this.lastTs = 0;
	}

	resize() {
		const w = Math.max(1, this.canvas.clientWidth);
		const h = Math.max(1, this.canvas.clientHeight);
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		if (w === this.w && h === this.h && dpr === this.dpr) return;
		this.w = w;
		this.h = h;
		this.dpr = dpr;
		this.canvas.width = Math.round(w * dpr);
		this.canvas.height = Math.round(h * dpr);
		this.invalidate();
	}

	sortItems() {
		if (this.sorted) return;
		this.items.sort((a, b) => a.layer - b.layer || a.depth - b.depth || a.seq - b.seq);
		this.sorted = true;
	}

	renderCache() {
		this.sortItems();
		const c = this.cache;
		const w = Math.ceil(this.w * (1 + 2 * MARGIN));
		const h = Math.ceil(this.h * (1 + 2 * MARGIN));
		const W = Math.round(w * this.dpr);
		const H = Math.round(h * this.dpr);
		if (c.canvas.width !== W || c.canvas.height !== H) {
			c.canvas.width = W;
			c.canvas.height = H;
		}
		const ctx = c.ctx;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, W, H);
		ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
		const z = this.camera.zoom;
		this.cacheR.setTransform(z, w / 2 - this.camera.x * z, h / 2 - this.camera.y * z);
		const vis = [this.camera.x - w / 2 / z, this.camera.y - h / 2 / z, this.camera.x + w / 2 / z, this.camera.y + h / 2 / z];
		for (const it of this.items) {
			if (it.live || !overlaps(it.rect, vis)) continue;
			it.draw(this.cacheR);
		}
		Object.assign(c, { zoom: z, cx: this.camera.x, cy: this.camera.y, w, h, valid: true });
	}

	render(t = this.time) {
		const ctx = this.ctx;
		const { w, h, dpr } = this;
		const cam = this.camera;
		const c = this.cache;
		if (!c.valid && !(this.gesture && c.zoom && c.zoom !== cam.zoom)) this.renderCache();
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.fillStyle = this.background;
		ctx.fillRect(0, 0, w, h);
		if (c.zoom === cam.zoom) {
			let dx = (c.cx - cam.x) * cam.zoom;
			let dy = (c.cy - cam.y) * cam.zoom;
			if (Math.abs(dx) > MARGIN * w - 1 || Math.abs(dy) > MARGIN * h - 1) {
				this.renderCache();
				dx = 0;
				dy = 0;
			}
			const x = Math.round(((w - c.w) / 2 + dx) * dpr) / dpr;
			const y = Math.round(((h - c.h) / 2 + dy) * dpr) / dpr;
			ctx.drawImage(c.canvas, x, y, c.w, c.h);
		} else if (c.zoom) {
			const s = cam.zoom / c.zoom;
			const x = w / 2 + (c.cx - cam.x) * cam.zoom - (c.w / 2) * s;
			const y = h / 2 + (c.cy - cam.y) * cam.zoom - (c.h / 2) * s;
			ctx.drawImage(c.canvas, x, y, c.w * s, c.h * s);
			// Only start a timer if none is pending: re-arming it every frame meant it never fired
			// while animated robots kept the loop busy, leaving a stretched cache after a wheel zoom.
			if (!this.settleTimer) this.scheduleSettle();
		}

		// Per-frame layer: live static items and dynamic items, depth sorted together.
		const view = this.viewRect(40);
		const list = [];
		for (const it of this.items) if (it.live && overlaps(it.rect, view)) list.push({ d: it.depth, s: it.seq, it, dyn: false });
		for (const d of this.dynamic) {
			const b = typeof d.bounds === "function" ? d.bounds() : d.bounds;
			if (b && !overlaps(rectOfBounds(b), view)) continue;
			list.push({ d: typeof d.depth === "function" ? d.depth() : (d.depth ?? 0), s: d.seq, it: d, dyn: true });
		}
		list.sort((a, b) => a.d - b.d || a.s - b.s);
		this.r.setTransform(cam.zoom, w / 2 - cam.x * cam.zoom, h / 2 - cam.y * cam.zoom);
		for (const e of list) e.it.draw(this.r, t);

		this.updateLabels();
	}

	updateLabels() {
		this.overlay.classList.toggle("zoom-far", this.camera.zoom < 0.55);
		this.overlay.classList.toggle("zoom-near", this.camera.zoom >= 0.9);
		for (const l of this.labels.values()) {
			const p = typeof l.pos === "function" ? l.pos() : l.pos;
			if (!p) {
				l.anchor.hidden = true;
				continue;
			}
			const [sx, sy] = this.worldToScreen(p[0], p[1], p[2] ?? 0);
			const off = sx < -150 || sy < -80 || sx > this.w + 150 || sy > this.h + 150;
			if (l.anchor.hidden !== off) l.anchor.hidden = off;
			if (!off) l.anchor.style.transform = `translate(${Math.round(sx)}px, ${Math.round(sy)}px)`;
		}
	}

	// -------------------------------------------------------------------------
	// Input

	hitTest(sx, sy) {
		const [px, py] = this.screenToProj(sx, sy);
		const pad = 6 / this.camera.zoom;
		let best = null;
		for (const h of this.hits) {
			const r = h.rect;
			if (px < r[0] - pad || px > r[2] + pad || py < r[1] - pad || py > r[3] + pad) continue;
			if (!best || h.priority > best.priority || (h.priority === best.priority && h.area < best.area)) best = h;
		}
		return best;
	}

	bindInput() {
		const cv = this.canvas;
		const pos = (e) => {
			const r = cv.getBoundingClientRect();
			return [e.clientX - r.left, e.clientY - r.top];
		};
		cv.addEventListener("pointerdown", (e) => {
			if (e.button !== undefined && e.button > 0) return;
			cv.setPointerCapture?.(e.pointerId);
			const [x, y] = pos(e);
			this.pointers.set(e.pointerId, { x, y });
			if (this.pointers.size === 1) {
				this.gesture = { type: "tap", x0: x, y0: y, t0: performance.now(), cam0: { ...this.camera } };
			} else if (this.pointers.size === 2) {
				const [a, b] = [...this.pointers.values()];
				this.gesture = {
					type: "pinch",
					d0: Math.hypot(a.x - b.x, a.y - b.y) || 1,
					zoom0: this.camera.zoom,
					mid0: [(a.x + b.x) / 2, (a.y + b.y) / 2],
					anchor: this.screenToProj((a.x + b.x) / 2, (a.y + b.y) / 2),
				};
				this.onUserPan?.("zoom");
				this.camAnim = null;
			}
			this.requestFrame();
		});
		cv.addEventListener("pointermove", (e) => {
			const [x, y] = pos(e);
			if (!this.pointers.has(e.pointerId)) {
				if (e.pointerType === "mouse") cv.style.cursor = this.hitTest(x, y) ? "pointer" : "grab";
				return;
			}
			this.pointers.set(e.pointerId, { x, y });
			const g = this.gesture;
			if (!g) return;
			if (g.type === "tap" && Math.hypot(x - g.x0, y - g.y0) > TAP_SLOP) {
				g.type = "pan";
				this.onUserPan?.();
				this.camAnim = null;
				cv.style.cursor = "grabbing";
			}
			if (g.type === "pan") {
				this.camera.x = g.cam0.x - (x - g.x0) / this.camera.zoom;
				this.camera.y = g.cam0.y - (y - g.y0) / this.camera.zoom;
				this.clampCamera();
				this.requestFrame();
			} else if (g.type === "pinch" && this.pointers.size >= 2) {
				const [a, b] = [...this.pointers.values()];
				const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
				const mid = [(a.x + b.x) / 2, (a.y + b.y) / 2];
				this.camera.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, g.zoom0 * (d / g.d0)));
				// Keep the world point that started under the fingers' midpoint under it.
				this.camera.x = g.anchor[0] - (mid[0] - this.w / 2) / this.camera.zoom;
				this.camera.y = g.anchor[1] - (mid[1] - this.h / 2) / this.camera.zoom;
				this.clampCamera();
				this.requestFrame();
			}
		});
		const end = (e) => {
			if (!this.pointers.has(e.pointerId)) return;
			const [x, y] = pos(e);
			const g = this.gesture;
			this.pointers.delete(e.pointerId);
			if (g?.type === "tap" && e.type === "pointerup" && performance.now() - g.t0 < 700) {
				const hit = this.hitTest(x, y);
				this.onTap?.(hit, x, y);
				if (hit) hit.onActivate?.();
			}
			if (this.pointers.size === 1 && g?.type === "pinch") {
				const [p] = [...this.pointers.values()];
				this.gesture = { type: "pan", x0: p.x, y0: p.y, t0: performance.now(), cam0: { ...this.camera } };
			} else if (this.pointers.size === 0) {
				this.gesture = null;
				if (g?.type === "pinch" || this.cache.zoom !== this.camera.zoom) this.invalidate();
				if (e.pointerType === "mouse") cv.style.cursor = "grab";
			}
			this.requestFrame();
		};
		cv.addEventListener("pointerup", end);
		cv.addEventListener("pointercancel", end);
		const wheel = (e) => {
			e.preventDefault();
			const [x, y] = pos(e);
			const k = e.ctrlKey ? 0.01 : 0.0016;
			this.onUserPan?.("zoom");
			this.zoomAt(Math.exp(-e.deltaY * k), x, y);
		};
		cv.addEventListener("wheel", wheel, { passive: false });
		// Labels are buttons in the overlay above the canvas; zoom when the wheel turns over them too.
		this.overlay?.addEventListener("wheel", wheel, { passive: false });
	}

	destroy() {
		this.resizeObserver.disconnect();
		cancelAnimationFrame(this.raf);
		this.clear();
	}
}
