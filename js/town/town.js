// Town map (#/town, #/town/<districtId>): the industry map (area 12) as a small isometric town,
// with the deployment lifecycle (area 11) as a flagged trail. Showroom (#/showroom) lives in
// showroom.js. Drawing code and UI chrome only: every name, sentence, and number comes from
// content (district and building entries, area intros, concept titles and text).

import { $, h, loadCss } from "../core/dom.js";
import { bus } from "../core/events.js";
import { project, unproject } from "../engine/iso.js";
import { Scene } from "../engine/scene.js";
import { conceptLink } from "../ui/concept.js";
import { icon } from "../ui/icons.js";
import { topModal } from "../ui/modal.js";
import { levelSwitch } from "../ui/panel.js";
import { buildTown, planTown, projRect, townProjRect } from "./town-map.js";

export { initShowroom } from "./showroom.js";

const MAX_ZOOM = 2.4;
/** Below minZoom times this the whole town is in view: the open district's building labels yield. */
const WIDE = 1.35;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** Set a CSS custom property (h() style objects cannot) and return the element. */
function withVar(el, name, value) {
	if (value) el.style.setProperty(name, value);
	return el;
}

export function initTown(app) {
	loadCss("css/modules/town.css");
	const view = $("#town-view");
	const content = app.content;
	const town = content.town ?? { districts: [], buildings: [] };
	const area = (n) => content.areas?.find((a) => a.area === n) ?? null;
	const industry = area(12);
	const lifecycle = area(11);
	const steps = (lifecycle?.concepts ?? []).filter((id) => content.concepts?.[id]);

	const canvas = h("canvas", { class: "scene-canvas", role: "img", "aria-label": "Isometric town map. Use the district, building, and step labels, or the list in the panel, to explore." });
	const overlay = h("div", { class: "overlay town-overlay" });
	const backBtn = h("button", { class: "btn", type: "button", html: `${icon("park")}<span>Back to park</span>` });
	const showBtn = h("button", { class: "btn", type: "button", html: `${icon("showroom")}<span>Showroom</span>` });
	const fitBtn = h("button", { class: "btn town-fit", type: "button", "aria-label": "Show the whole town", title: "Show the whole town", html: `${icon("town")}<span class="town-fit-text">Whole town</span>` });
	const bar = h("div", { class: "view-bar" }, backBtn, showBtn, fitBtn);
	const panel = h("aside", { class: "panel town-panel", "aria-label": "Town details" });
	const pTitle = h("h2", { class: "panel-title", id: "town-panel-title", tabindex: "-1" });
	const pKicker = h("div", { class: "panel-kicker" });
	const pClose = h("button", { class: "icon-btn panel-close", type: "button", "aria-label": "Close panel", html: icon("close") });
	const pToggle = h("button", { class: "sheet-toggle", type: "button", "aria-expanded": "false", "aria-controls": "town-panel-body" }, h("span", { class: "grip" }), h("span", { class: "sr-only" }, "Expand or collapse the panel"));
	const pHead = h("div", { class: "panel-head" }, pToggle, pKicker, pTitle, pClose);
	const pBody = h("div", { class: "panel-body", id: "town-panel-body" });
	const reopen = h("button", { class: "panel-reopen town-reopen", type: "button", hidden: true }, "Details");
	panel.append(pHead, pBody);
	panel.setAttribute("aria-labelledby", "town-panel-title");
	panel.dataset.state = "collapsed";
	// Tab order matches the park: view buttons, the panel, then the map's labeled buttons.
	view.append(bar, panel, reopen, canvas, overlay);

	let scene = null;
	let plan = null;
	let labels = null;
	let labelPos = null;
	let labelEpoch = 0;
	let sel = { type: "intro" };
	let built = false;
	let ro = null;
	// Projected-pixel town rectangle and one diamond per district cell (plot plus half its roads),
	// used to keep the camera over the town.
	let townRect = null;
	let outline = [];
	// The view bar's box in overlay pixels: map labels that would peek out around it are hidden.
	let barBox = null;

	backBtn.addEventListener("click", () => app.router.go({ name: "park" }));
	showBtn.addEventListener("click", () => app.router.go({ name: "showroom" }));
	fitBtn.addEventListener("click", () => fitTown(false));

	// ------------------------------------------------------------ phone sheet (matches the park's)
	const setExpanded = (v) => {
		panel.dataset.state = v ? "expanded" : "collapsed";
		pToggle.setAttribute("aria-expanded", v ? "true" : "false");
		requestAnimationFrame(syncInsets);
	};
	pToggle.addEventListener("click", (e) => {
		e.stopPropagation();
		setExpanded(panel.dataset.state !== "expanded");
	});
	pHead.addEventListener("click", (e) => {
		if (!app.isPhone() || e.target.closest("button, a")) return;
		setExpanded(panel.dataset.state !== "expanded");
	});
	pClose.addEventListener("click", () => {
		panel.hidden = true;
		reopen.hidden = false;
		reopen.focus({ preventScroll: true });
		requestAnimationFrame(syncAndSettle);
	});
	reopen.addEventListener("click", () => showPanel());
	// Escape collapses the expanded phone sheet (after dialogs and menus, like the park's sheet).
	const onKey = (e) => {
		if (e.key !== "Escape" || view.hidden || topModal() || app.hud?.menuOpen()) return;
		if (app.isPhone() && !panel.hidden && panel.dataset.state === "expanded") {
			e.preventDefault();
			setExpanded(false);
			pToggle.focus({ preventScroll: true });
		}
	};
	document.addEventListener("keydown", onKey);

	function showPanel() {
		// Runs on every selection: its frame callback refreshes the insets before the camera aims.
		panel.hidden = false;
		reopen.hidden = true;
		requestAnimationFrame(syncAndSettle);
	}

	/** After the panel opens or closes, glide the camera back over the town (keepInView would jump). */
	function syncAndSettle() {
		syncInsets();
		if (!scene || scene.camAnim) return;
		const cam = scene.camera;
		const v = freeView(cam.zoom);
		if (!v) return;
		const [cx, cy] = clampCenter(cam.x + v.ux, cam.y + v.uy, cam.zoom);
		if (Math.hypot(cx - cam.x - v.ux, cy - cam.y - v.uy) * cam.zoom < 2) return;
		const [wx, wy] = unproject(cx, cy, 0);
		scene.lookAt(wx, wy, 0, { zoom: cam.zoom });
	}

	// ------------------------------------------------------------ layout and camera
	function insetsFor(forFit) {
		const phone = app.isPhone();
		const top = app.hudHeight() + bar.offsetHeight + 16;
		const open = !panel.hidden;
		let bottom = 0;
		if (phone && open) {
			// Fit against the collapsed sheet so expanding it does not change the zoom limit.
			const collapsed = Math.max(170, window.innerHeight * 0.36);
			bottom = forFit ? Math.min(panel.offsetHeight || collapsed, collapsed) : panel.offsetHeight;
		}
		return { top, right: open && !phone ? panel.offsetWidth : 0, bottom, left: 0 };
	}

	/** Zoom that fits a world box [x0,y0,x1,y1] (with height) into the free part of the view. */
	function zoomToFit(rect, height, pad = 0.94) {
		return zoomToFitProj(projRect([rect[0], rect[1], 0, rect[2], rect[3], height]), pad);
	}

	function zoomToFitProj(pr, pad = 0.94) {
		const ins = insetsFor(true);
		const w = Math.max(80, scene.w - ins.left - ins.right);
		const hh = Math.max(80, scene.h - ins.top - ins.bottom);
		return Math.min(w / (pr[2] - pr[0]), hh / (pr[3] - pr[1])) * pad;
	}

	function syncInsets() {
		if (!scene) return;
		scene.setInsets(insetsFor(false));
		updateZoomLimits();
		// The bar sits over the map; labels under it are hidden (see hideUnderBar).
		barBox = bar.offsetWidth ? [bar.offsetLeft - overlay.offsetLeft, bar.offsetTop - overlay.offsetTop, bar.offsetLeft - overlay.offsetLeft + bar.offsetWidth, bar.offsetTop - overlay.offsetTop + bar.offsetHeight] : null;
	}

	/** The minimum zoom always shows the whole town; the camera cannot leave the town. */
	function updateZoomLimits() {
		if (!scene || !plan || scene.w < 10) return;
		const pr = townProjRect(plan, 3);
		townRect = pr;
		scene.minZoom = Math.min(MAX_ZOOM, Math.max(0.05, zoomToFitProj(pr, 0.96)));
		scene.maxZoom = MAX_ZOOM;
		// A loose safety net only: keepInView holds the free part of the view over the town.
		const pw = pr[2] - pr[0];
		const ph = pr[3] - pr[1];
		scene.limits = [pr[0] - pw, pr[1] - ph, pr[2] + pw, pr[3] + ph];
		if (scene.camera.zoom < scene.minZoom) {
			scene.camera.zoom = scene.minZoom;
			scene.clampCamera();
			scene.invalidate();
		}
	}

	/** Half sizes and center offset (projected px) of the part of the view not under the bar or panel. */
	function freeView(zoom) {
		const ins = scene.insets;
		const fw = scene.w - ins.left - ins.right;
		const fh = scene.h - ins.top - ins.bottom;
		if (fw < 80 || fh < 80) return null; // the expanded phone sheet covers the map
		return { hw: fw / 2 / zoom, hh: fh / 2 / zoom, ux: (ins.left - ins.right) / 2 / zoom, uy: (ins.top - ins.bottom) / 2 / zoom };
	}

	/** Nearest point of the town outline to a projected point: [x, y, distance] (0 inside). */
	function nearestLand(px, py) {
		let best = null;
		for (const poly of outline) {
			let inside = true;
			for (let i = 0; i < poly.length; i++) {
				const a = poly[i];
				const b = poly[(i + 1) % poly.length];
				const dx = b[0] - a[0];
				const dy = b[1] - a[1];
				if (dx * (py - a[1]) - dy * (px - a[0]) < 0) inside = false;
				const t = clamp(((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy || 1), 0, 1);
				const qx = a[0] + dx * t;
				const qy = a[1] + dy * t;
				const d = Math.hypot(px - qx, py - qy);
				if (!best || d < best[2]) best = [qx, qy, d];
			}
			if (inside) return [px, py, 0];
		}
		return best;
	}

	/**
	 * Where the free part of the view may be centered at a zoom: on an axis where the town is
	 * smaller than the view it stays centered, otherwise the view stays inside the town's
	 * rectangle, and land always reaches within a quarter view of the middle (the rectangle's
	 * corners are empty sky, because the town is a diamond on screen).
	 */
	function clampCenter(cx, cy, zoom) {
		const v = freeView(zoom);
		if (!v || !townRect) return [cx, cy];
		const fit = (c, lo, hi, half) => (hi - lo <= 2 * half ? (lo + hi) / 2 : clamp(c, lo + half, hi - half));
		let x = fit(cx, townRect[0], townRect[2], v.hw);
		let y = fit(cy, townRect[1], townRect[3], v.hh);
		const n = nearestLand(x, y);
		const reach = 0.5 * Math.min(v.hw, v.hh);
		if (n && n[2] > reach) {
			const k = (n[2] - reach) / n[2];
			x += (n[0] - x) * k;
			y += (n[1] - y) * k;
		}
		return [x, y];
	}

	/** Per frame: pull the camera back over the town after a drag, pinch, wheel, or inset change. */
	function keepInView() {
		if (!scene || view.hidden || scene.camAnim) return false;
		const cam = scene.camera;
		const v = freeView(cam.zoom);
		if (!v) return false;
		const [cx, cy] = clampCenter(cam.x + v.ux, cam.y + v.uy, cam.zoom);
		const nx = cx - v.ux;
		const ny = cy - v.uy;
		if (Math.abs(nx - cam.x) < 0.01 && Math.abs(ny - cam.y) < 0.01) return false;
		cam.x = nx;
		cam.y = ny;
		return true;
	}

	/** Animate the camera to a world point, adjusted so the view stays over the town. */
	function look(x, y, z, zoom, instant = false) {
		const zz = clamp(zoom, scene.minZoom, scene.maxZoom);
		const [px, py] = project(x, y, z);
		const [cx, cy] = clampCenter(px, py, zz);
		const [wx, wy] = unproject(cx, cy, 0);
		scene.lookAt(wx, wy, 0, { zoom: zz, instant });
	}

	function fitTown(instant) {
		if (!scene) return;
		updateZoomLimits();
		// Center of the occupied area in projected pixels, as a world point on the ground.
		const pr = townProjRect(plan, 3);
		const [wx, wy] = unproject((pr[0] + pr[2]) / 2, (pr[1] + pr[3]) / 2, 0);
		look(wx, wy, 0, scene.minZoom, instant);
	}

	// ------------------------------------------------------------ build
	function build() {
		plan = planTown(town, steps);
		outline = plan.districts.map((c) =>
			[
				[c.cell[0], c.cell[1]],
				[c.cell[2], c.cell[1]],
				[c.cell[2], c.cell[3]],
				[c.cell[0], c.cell[3]],
			].map(([x, y]) => project(x, y, 0)),
		);
		scene = new Scene({ canvas, overlay, minZoom: 0.1, maxZoom: MAX_ZOOM });
		scene.reducedMotion = () => app.reducedMotion();
		({ labels, labelPos } = buildTown(scene, plan, {
			reducedMotion: () => app.reducedMotion(),
			selected: selectedDistrictId,
			onDistrict: (id) => app.router.go({ name: "town", districtId: id }),
			onBuilding: (id) => selectBuilding(id),
			onStep: (id) => selectStep(id),
			stepTitle: (id) => app.conceptTitle(id),
		}));
		scene.setLabelsVisible(!!app.state.get("labels"));
		scene.addTick(keepInView);
		scene.addTick(labelTick);
		// Label widths change once the web font arrives: check overlaps again.
		document.fonts?.ready.then(() => {
			labelEpoch++;
			scene?.requestFrame();
		});
		let viewSize = "";
		ro = new ResizeObserver(() => {
			syncInsets();
			// The view itself changed size (window resize, phone rotation): re-aim at the selection.
			const size = `${view.clientWidth}x${view.clientHeight}`;
			if (viewSize && size !== viewSize && !view.hidden) requestAnimationFrame(() => aim(true));
			if (view.clientWidth) viewSize = size;
		});
		ro.observe(panel);
		ro.observe(view);
		syncInsets();
		built = true;
	}

	const offs = [
		bus.on("prefs", (k) => {
			if (!scene) return;
			if (k === "labels") scene.setLabelsVisible(!!app.state.get("labels"));
			if (k === "level" && sel.type === "step") render();
		}),
		bus.on("motion", () => scene?.invalidate()),
	];

	function selectedDistrictId() {
		if (sel.type === "district") return sel.id;
		if (sel.type === "building") return town.buildings.find((b) => b.id === sel.id)?.district ?? null;
		return null;
	}

	/** Label states: the open district hides its own label and shows its buildings' labels. */
	function markLabels() {
		if (!labels) return;
		const dId = selectedDistrictId();
		for (const [id, el] of labels.districts) {
			el.classList.toggle("open", id === dId);
			el.classList.toggle("selected", false);
		}
		for (const [id, el] of labels.buildings) {
			const b = town.buildings.find((x) => x.id === id);
			el.classList.toggle("in-district", b?.district === dId);
			el.classList.toggle("selected", sel.type === "building" && sel.id === id);
		}
		for (const [id, el] of labels.steps) el.classList.toggle("selected", sel.type === "step" && sel.id === id);
		overlay.classList.toggle("trail-open", sel.type === "step");
		overlay.classList.toggle("district-open", !!dId);
		labelEpoch++;
		scene.invalidate();
	}

	/**
	 * Keep map labels from covering each other. Labels are fixed-size HTML boxes anchored at
	 * projected world points, so their relative screen positions depend only on the zoom: recheck
	 * when the zoom, the overlay's state classes, or the label states change. A selected step and
	 * the shown building labels always stay (building labels that would collide are stacked
	 * upward); a district label or an unselected step flag that would cover one of them is hidden
	 * (the panel lists every district and step either way). Labels whose anchor the scene hides
	 * (far off screen) cannot be measured, so the check also reruns when that set changes.
	 */
	let overlapKey = "";
	// Each displayed label's box at the last check, in projected pixels times the zoom.
	const labelBox = new Map();
	function resolveLabelOverlaps() {
		const zoom = scene.camera.zoom;
		let anchors = "";
		for (const el of labelPos.keys()) anchors += el.parentElement?.hidden ? "0" : "1";
		const key = `${zoom.toFixed(4)}|${overlay.className}|${labelEpoch}|${anchors}`;
		if (key === overlapKey) return false;
		overlapKey = key;
		labelBox.clear();
		const box = (el) => {
			const w = el.offsetWidth;
			if (!w) return null; // not displayed
			const p = labelPos.get(el);
			const [px, py] = project(p[0], p[1], p[2]);
			const x = px * zoom;
			const y = py * zoom;
			const pad = 3;
			const b = [x - w / 2 - pad, y - el.offsetHeight - pad, x + w / 2 + pad, y + pad];
			labelBox.set(el, b);
			return b;
		};
		const meets = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
		const hit = (a, list) => list.some((b) => meets(a, b));
		const fixed = [];
		const steps = [];
		for (const el of labels.steps.values()) {
			const b = box(el);
			if (!b || el.classList.contains("selected")) el.classList.remove("label-covered");
			if (!b) continue;
			if (el.classList.contains("selected")) fixed.push(b);
			else steps.push([el, b]);
		}
		// Building labels, lowest on screen (nearest the viewer) first; one that would overlap a
		// placed label moves up just above it.
		const blds = [];
		for (const el of labels.buildings.values()) {
			const b = box(el);
			if (b) blds.push([el, b]);
			else el.style.translate = "";
		}
		blds.sort((a, b) => b[1][3] - a[1][3]);
		for (const [el, b] of blds) {
			let dy = 0;
			for (let guard = 0; guard < 8; guard++) {
				const moved = [b[0], b[1] + dy, b[2], b[3] + dy];
				const o = fixed.find((f) => meets(moved, f));
				if (!o) break;
				dy = o[1] - b[3];
			}
			el.style.translate = dy ? `0 ${Math.round(dy)}px` : "";
			const placed = [b[0], b[1] + dy, b[2], b[3] + dy];
			fixed.push(placed);
			labelBox.set(el, placed);
		}
		const districts = [];
		for (const el of labels.districts.values()) {
			const b = box(el);
			if (!b) {
				el.classList.remove("label-covered");
				continue;
			}
			const covered = hit(b, fixed);
			el.classList.toggle("label-covered", covered);
			if (!covered) districts.push(b);
		}
		const shown = [...fixed, ...districts];
		for (const [el, b] of steps) {
			const covered = hit(b, shown);
			el.classList.toggle("label-covered", covered);
			if (!covered) shown.push(b);
		}
		for (const el of labelPos.keys()) if (!labelBox.has(el)) el.classList.remove("label-under-bar");
		// Run one more frame so the check also sees the final zoom of a camera move.
		return true;
	}

	/**
	 * Hide unselected labels that would peek out around the view bar, sit under the top bar, or
	 * sit behind the panel (the map runs under all three), so they neither show in pieces nor take
	 * keyboard focus while invisible. Uses the boxes from the last overlap check: no layout reads.
	 */
	function hideUnderBar() {
		const cam = scene.camera;
		const ox = scene.w / 2 - cam.x * cam.zoom;
		const oy = scene.h / 2 - cam.y * cam.zoom;
		const top = app.hudHeight();
		const right = scene.w - scene.insets.right;
		const bottom = scene.h - scene.insets.bottom;
		let changed = false;
		for (const [el, b] of labelBox) {
			let under = false;
			if (!el.classList.contains("selected")) {
				const [x0, y0, x1, y1] = [b[0] + ox, b[1] + oy, b[2] + ox, b[3] + oy];
				const behindPanel = (x0 + x1) / 2 > right || (y0 + y1) / 2 > bottom;
				under = behindPanel || y0 < top || (!!barBox && x0 < barBox[2] && x1 > barBox[0] && y0 < barBox[3] && y1 > barBox[1]);
			}
			if (el.classList.contains("label-under-bar") !== under) {
				el.classList.toggle("label-under-bar", under);
				changed = true;
			}
		}
		return changed;
	}

	/** Per frame: whole-town state, label overlaps (when something changed), labels under the bar. */
	function labelTick() {
		if (!labels || view.hidden) return false;
		overlay.classList.toggle("town-wide", scene.camera.zoom < scene.minZoom * WIDE);
		const a = resolveLabelOverlaps();
		const b = hideUnderBar();
		return a || b;
	}

	// ------------------------------------------------------------ panel views
	const section = (title, html, attrs = {}) => (html ? h("div", { class: "section", ...attrs }, h("h4", {}, title), h("div", { class: "prose", html })) : null);

	function districtButton(c) {
		const b = h(
			"button",
			{ class: "town-pick", type: "button", "data-district": c.d.id },
			h("span", { class: "town-dot", "aria-hidden": "true" }),
			h("span", { class: "town-pick-text" }, h("span", { class: "town-pick-title" }, c.d.title), c.d.tagline ? h("span", { class: "town-pick-sub" }, c.d.tagline) : null),
		);
		b.style.setProperty("--district", c.accent);
		b.addEventListener("click", () => app.router.go({ name: "town", districtId: c.d.id }));
		return b;
	}

	function stepList() {
		if (!steps.length) return null;
		return h(
			"ol",
			{ class: "town-steps" },
			steps.map((id, i) => {
				const current = sel.type === "step" && sel.id === id;
				const b = h("button", { class: "town-step-btn", type: "button", "data-step": id, "aria-current": current ? "step" : undefined }, h("span", { class: "town-step-n", "aria-hidden": "true" }, String(i + 1)), h("span", {}, app.conceptTitle(id)));
				b.addEventListener("click", () => selectStep(id));
				return h("li", {}, b);
			}),
		);
	}

	function renderIntro() {
		pKicker.textContent = "Town map";
		pTitle.textContent = industry?.title ?? "Town map";
		const parts = [];
		if (industry?.intro) parts.push(h("div", { class: "prose", html: industry.intro }));
		if (plan?.districts.length) parts.push(h("div", { class: "section" }, h("h4", {}, "Districts"), h("div", { class: "town-picks" }, plan.districts.map(districtButton))));
		else parts.push(h("p", { class: "empty" }, "The town has not been written yet."));
		if (steps.length) parts.push(h("div", { class: "section town-lifecycle" }, h("h4", {}, lifecycle.title), lifecycle.intro ? h("div", { class: "prose", html: lifecycle.intro }) : null, stepList()));
		pBody.replaceChildren(...parts);
	}

	function renderDistrict(d) {
		const c = plan.byId.get(d.id);
		pKicker.textContent = "District";
		pTitle.textContent = d.title;
		const buildings = c?.buildings.map((x) => x.b) ?? town.buildings.filter((b) => b.district === d.id);
		const all = h("button", { class: "btn", type: "button" }, "All districts");
		all.addEventListener("click", () => app.router.go({ name: "town" }));
		pBody.replaceChildren(
			...[
				d.tagline ? withVar(h("p", { class: "meta-line town-tagline" }, d.tagline), "--district", c?.accent) : null,
				h("div", { class: "prose", html: d.plain }),
				section("Sells", d.sells),
				section("Buys from", d.buysFrom),
				section("Sells to", d.sellsTo),
				d.concept ? h("p", {}, "Read more: ", conceptLink(app, d.concept)) : null,
				buildings.length
					? h(
							"div",
							{ class: "section" },
							h("h4", {}, "Buildings"),
							h(
								"div",
								{ class: "ride-cards" },
								buildings.map((b) => {
									const btn = h("button", { class: "btn block", type: "button", "data-building": b.id }, b.title);
									btn.addEventListener("click", () => selectBuilding(b.id));
									return btn;
								}),
							),
						)
					: null,
				h("div", { class: "panel-row" }, all),
			].filter(Boolean),
		);
	}

	function renderBuilding(b) {
		const d = town.districts.find((x) => x.id === b.district);
		pKicker.textContent = d ? d.title : "Building";
		pTitle.textContent = b.title;
		const back = d ? h("button", { class: "btn", type: "button" }, `Back to ${d.title}`) : null;
		back?.addEventListener("click", () => selectDistrict(d.id));
		pBody.replaceChildren(
			...[
				h("div", { class: "prose", html: b.about }),
				b.roles?.length
					? h(
							"div",
							{ class: "section", "data-roles": b.id },
							h("h4", {}, "Job functions"),
							h(
								"ul",
								{ class: "prose town-roles" },
								b.roles.map((r) => h("li", {}, h("strong", {}, r.name), h("span", { html: ` — ${r.html}` }))),
							),
						)
					: null,
				back ? h("div", { class: "panel-row" }, back) : null,
			].filter(Boolean),
		);
	}

	function renderStep(id) {
		const c = content.concepts[id];
		const i = steps.indexOf(id);
		pKicker.textContent = `${lifecycle?.title ?? ""} · Step ${i + 1} of ${steps.length}`;
		pTitle.textContent = c.title;
		const level = app.level();
		const nav = h("div", { class: "panel-row town-step-nav" });
		if (i > 0) {
			const prev = h("button", { class: "btn", type: "button", "data-step-nav": "prev" }, "Previous step");
			prev.addEventListener("click", () => selectStep(steps[i - 1]));
			nav.append(prev);
		}
		if (i < steps.length - 1) {
			const next = h("button", { class: "btn primary", type: "button", "data-step-nav": "next" }, "Next step");
			next.addEventListener("click", () => selectStep(steps[i + 1]));
			nav.append(next);
		}
		const all = h("button", { class: "btn", type: "button" }, "All districts");
		all.addEventListener("click", () => app.router.go({ name: "town" }));
		nav.append(all);
		pBody.replaceChildren(
			...[
				h("div", { class: "panel-row" }, levelSwitch(app)),
				h(
					"section",
					{ class: "card concept-card", "data-step-concept": id },
					h("div", { class: "prose", html: level === "precise" ? c.precise : c.plain }),
					level === "plain" && c.analogyLimit ? h("div", { class: "analogy-limit prose" }, h("strong", {}, "Where the analogy breaks"), h("div", { html: c.analogyLimit })) : null,
				),
				h("p", {}, "Read more: ", conceptLink(app, id, c.title)),
				nav,
				stepList(),
			].filter(Boolean),
		);
	}

	function render() {
		const keep = pBody.scrollTop;
		const same = pBody.dataset.view === `${sel.type}:${sel.id ?? ""}`;
		// A button inside the panel started this: keep keyboard focus in the panel, on the same
		// Next/Previous step button when it is still there (stepping through by keyboard).
		const hadFocus = pBody.contains(document.activeElement);
		const nav = hadFocus ? document.activeElement.dataset?.stepNav : undefined;
		if (sel.type === "district") renderDistrict(town.districts.find((d) => d.id === sel.id));
		else if (sel.type === "building") renderBuilding(town.buildings.find((b) => b.id === sel.id));
		else if (sel.type === "step") renderStep(sel.id);
		else renderIntro();
		pBody.dataset.view = `${sel.type}:${sel.id ?? ""}`;
		pBody.scrollTop = same ? keep : 0;
		if (hadFocus && !pBody.contains(document.activeElement)) {
			const again = nav ? pBody.querySelector(`[data-step-nav="${nav}"]`) : null;
			if (again) again.focus({ preventScroll: true });
			else pTitle.focus({ preventScroll: true });
		}
	}

	// ------------------------------------------------------------ selection
	function showIntro() {
		sel = { type: "intro" };
		render();
		markLabels();
	}

	function selectDistrict(id) {
		const d = town.districts.find((x) => x.id === id);
		if (!d) return showIntro();
		sel = { type: "district", id };
		render();
		markLabels();
		showPanel();
		requestAnimationFrame(() => aim(false));
	}

	function selectBuilding(id) {
		const b = town.buildings.find((x) => x.id === id);
		if (!b) return;
		sel = { type: "building", id };
		render();
		markLabels();
		showPanel();
		requestAnimationFrame(() => aim(false));
	}

	function selectStep(id) {
		if (!content.concepts?.[id]) return;
		sel = { type: "step", id };
		render();
		markLabels();
		showPanel();
		requestAnimationFrame(() => aim(false));
	}

	/**
	 * Point the camera at the current selection: the open district, the selected building, the
	 * selected step's flag, or the whole town. Also used when the view changes size (a phone
	 * turned sideways), so the selection does not drift under the panel.
	 */
	function aim(instant) {
		if (!scene || !plan) return;
		if (sel.type === "district") {
			const c = plan.byId.get(sel.id);
			if (c) look(c.center[0], c.center[1], c.top / 3, Math.min(1.5, Math.max(scene.minZoom, zoomToFit(c.cell, c.top, 0.92))), instant);
		} else if (sel.type === "building") {
			const b = town.buildings.find((x) => x.id === sel.id);
			const c = b && plan.byId.get(b.district);
			const bd = c?.buildings.find((x) => x.b.id === sel.id);
			if (!bd) return;
			const [x, y, w, d] = bd.rect;
			look(x + w / 2, y + d / 2, bd.geom.top / 3, Math.min(1.8, Math.max(scene.camera.zoom, zoomToFit(c.cell, c.top, 0.92))), instant);
		} else if (sel.type === "step") {
			const f = plan.trail?.flags.find((x) => x.id === sel.id);
			if (f) look(f.x, f.y, 1, Math.min(1.4, Math.max(scene.camera.zoom, scene.minZoom * 1.8)), instant);
		} else fitTown(instant);
	}

	// main.js calls show() from setView and then show(districtId) for the route in the same task;
	// apply the selection once, for the last call.
	let pending;
	let queued = false;
	function applyRoute() {
		queued = false;
		const districtId = pending;
		if (districtId) selectDistrict(districtId);
		else if (sel.type === "district" || sel.type === "building" || sel.type === "intro") {
			// The bare #/town route is the overview: leave an open district or building.
			const wasDistrict = sel.type !== "intro";
			showIntro();
			if (wasDistrict) fitTown(false);
		}
	}

	return {
		show(districtId) {
			view.hidden = false;
			const first = !built;
			if (first) build();
			else scene.resize();
			if (first) {
				// Fill the panel before fitting: the phone sheet's height sets the free area.
				render();
				markLabels();
			}
			syncInsets();
			if (first) fitTown(true);
			pending = districtId ?? null;
			if (!queued) {
				queued = true;
				queueMicrotask(applyRoute);
			}
			scene.requestFrame();
		},
		hide() {
			view.hidden = true;
		},
		/** Remove listeners, observers, and the scene (main.js keeps the town for the app's life). */
		destroy() {
			for (const off of offs) off();
			document.removeEventListener("keydown", onKey);
			ro?.disconnect();
			scene?.destroy();
			view.replaceChildren();
		},
		selectBuilding,
		selectStep,
		get scene() {
			return scene;
		},
	};
}
