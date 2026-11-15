// Town map (#/town): one block per district from content.town, with clickable districts and
// buildings. Showroom (#/showroom): every content.showroom robot drawn side by side at one
// scale next to a 1.7 m person. Drawing code only; all names and text come from content.

import { $, h } from "../core/dom.js";
import { shade } from "../engine/iso.js";
import { drawTree, groundRect, object, PAL, rng } from "../engine/park.js";
import { LAYER, Scene } from "../engine/scene.js";
import { conceptLink } from "../ui/concept.js";
import { icon } from "../ui/icons.js";

const BLOCK = 12;
const GAP = 3;
const DISTRICT_COLORS = ["#e9d8b4", "#d9e4c8", "#d6e2ee", "#efd7cf", "#e3d6ee", "#d4ebe4", "#efe3c4"];
const ROOFS = ["#b5543c", "#3d7fd1", "#1f9e8f", "#8a5cc7", "#d9583b", "#2f6f8f", "#6b8e23"];

function layout(districts) {
	const cols = Math.min(4, Math.max(1, Math.ceil(districts.length / 2)));
	return districts.map((d, i) => {
		const row = Math.floor(i / cols);
		const col = i % cols;
		const inRow = Math.min(cols, districts.length - row * cols);
		const offset = ((cols - inRow) * (BLOCK + GAP)) / 2;
		const x0 = GAP + col * (BLOCK + GAP) + offset;
		const y0 = GAP + row * (BLOCK + GAP);
		return { d, i, rect: [x0, y0, x0 + BLOCK, y0 + BLOCK] };
	});
}

function drawBuilding(r, x, y, w, d, hgt, roof, style) {
	r.shadow(x + w / 2 + 0.6, y + d / 2 + 0.6, w * 0.6, d * 0.6, 0.12);
	r.box(x, y, 0, w, d, hgt, "#f1ece2", { top: shade(roof, 1.05) });
	// Windows on the two visible faces.
	for (let k = 0; k < Math.floor(hgt / 1.2); k++) {
		const z0 = 0.6 + k * 1.2;
		for (let i = 0; i < Math.floor(w / 1.3); i++)
			r.quad(
				[
					[x + 0.4 + i * 1.3, y + d + 0.01, z0],
					[x + 1.1 + i * 1.3, y + d + 0.01, z0],
					[x + 1.1 + i * 1.3, y + d + 0.01, z0 + 0.6],
					[x + 0.4 + i * 1.3, y + d + 0.01, z0 + 0.6],
				],
				PAL.window,
				{ flat: true },
			);
		for (let i = 0; i < Math.floor(d / 1.3); i++)
			r.quad(
				[
					[x + w + 0.01, y + 0.4 + i * 1.3, z0],
					[x + w + 0.01, y + 1.1 + i * 1.3, z0],
					[x + w + 0.01, y + 1.1 + i * 1.3, z0 + 0.6],
					[x + w + 0.01, y + 0.4 + i * 1.3, z0 + 0.6],
				],
				shade(PAL.window, 0.9),
				{ flat: true },
			);
	}
	if (style % 3 === 0) {
		// Sawtooth factory roof.
		for (let i = 0; i < Math.floor(w / 1.5); i++) {
			const sx = x + i * 1.5;
			r.mesh(
				[
					[
						[sx, y, hgt],
						[sx + 1.5, y, hgt],
						[sx + 1.5, y, hgt + 0.9],
					],
					[
						[sx, y + d, hgt],
						[sx + 1.5, y + d, hgt + 0.9],
						[sx + 1.5, y + d, hgt],
					],
					[
						[sx, y, hgt],
						[sx + 1.5, y, hgt + 0.9],
						[sx + 1.5, y + d, hgt + 0.9],
						[sx, y + d, hgt],
					],
					[
						[sx + 1.5, y, hgt],
						[sx + 1.5, y + d, hgt],
						[sx + 1.5, y + d, hgt + 0.9],
						[sx + 1.5, y, hgt + 0.9],
					],
				],
				roof,
				{ twoSided: true },
			);
		}
	} else if (style % 3 === 1) {
		r.box(x + w * 0.2, y + d * 0.25, hgt, w * 0.3, d * 0.3, 0.6, PAL.steel);
		r.cylinder(x + w * 0.75, y + d * 0.7, hgt, 0.3, 1.6, "#9aa5b1", 8);
	} else {
		r.box(x + w * 0.35, y + d * 0.35, hgt, w * 0.3, d * 0.3, 1.4, shade(roof, 0.9));
		r.cylinder(x + w * 0.5, y + d * 0.5, hgt + 1.4, 0.05, 1.2, PAL.dark, 5);
	}
	r.quad(
		[
			[x + w / 2 - 0.4, y + d + 0.02, 0],
			[x + w / 2 + 0.4, y + d + 0.02, 0],
			[x + w / 2 + 0.4, y + d + 0.02, 1.0],
			[x + w / 2 - 0.4, y + d + 0.02, 1.0],
		],
		"#5b4636",
		{ flat: true },
	);
}

export function initTown(app) {
	const view = $("#town-view");
	const canvas = h("canvas", { class: "scene-canvas", role: "img", "aria-label": "Isometric town map. Use the district and building labels to explore." });
	const overlay = h("div", { class: "overlay" });
	const backBtn = h("button", { class: "btn", type: "button", html: `${icon("park")}<span>Back to park</span>` });
	const showBtn = h("button", { class: "btn", type: "button", html: `${icon("showroom")}<span>Showroom</span>` });
	const panel = h("aside", { class: "panel town-panel", "aria-label": "Town details" });
	const pTitle = h("h2", { class: "panel-title", id: "town-panel-title", tabindex: "-1" });
	const pKicker = h("div", { class: "panel-kicker" });
	const pClose = h("button", { class: "icon-btn panel-close", type: "button", "aria-label": "Close panel", html: icon("close") });
	const pToggle = h("button", { class: "sheet-toggle", type: "button", "aria-expanded": "false" }, h("span", { class: "grip" }), h("span", { class: "sr-only" }, "Expand or collapse the panel"));
	const pBody = h("div", { class: "panel-body" });
	panel.append(h("div", { class: "panel-head" }, pToggle, pKicker, pTitle, pClose), pBody);
	panel.setAttribute("aria-labelledby", "town-panel-title");
	panel.dataset.state = "collapsed";
	view.append(canvas, overlay, h("div", { class: "view-bar" }, backBtn, showBtn), panel);
	backBtn.addEventListener("click", () => app.router.go({ name: "park" }));
	showBtn.addEventListener("click", () => app.router.go({ name: "showroom" }));
	pToggle.addEventListener("click", () => {
		const v = panel.dataset.state !== "expanded";
		panel.dataset.state = v ? "expanded" : "collapsed";
		pToggle.setAttribute("aria-expanded", v ? "true" : "false");
		syncInsets();
	});
	pClose.addEventListener("click", () => {
		panel.hidden = true;
		syncInsets();
	});

	let scene = null;
	let blocks = [];
	let selected = null;
	const town = app.content.town ?? { districts: [], buildings: [] };

	function syncInsets() {
		if (!scene) return;
		const hud = app.hudHeight();
		const phone = app.isPhone();
		const bar = view.querySelector(".view-bar");
		scene.setInsets({
			top: hud + (bar ? bar.offsetHeight + 12 : 0),
			right: !panel.hidden && !phone ? panel.offsetWidth : 0,
			bottom: !panel.hidden && phone ? panel.offsetHeight : 0,
			left: 0,
		});
	}

	function build() {
		blocks = layout(town.districts);
		const W = Math.max(...blocks.map((b) => b.rect[2]), 20) + GAP;
		const H = Math.max(...blocks.map((b) => b.rect[3]), 20) + GAP;
		scene = new Scene({ canvas, overlay, limits: [-(H + 6) * 32, -200, (W + 6) * 32, (W + H) * 16 + 300], minZoom: 0.2, maxZoom: 2.4 });
		scene.reducedMotion = () => app.reducedMotion();
		scene.add({
			layer: LAYER.TERRAIN,
			depth: -1e6,
			bounds: [0, 0, -1.2, W, H, 0],
			draw: (r) => {
				r.quad(
					[
						[0, H, -1.2],
						[W, H, -1.2],
						[W, H, 0],
						[0, H, 0],
					],
					PAL.earth,
				);
				r.quad(
					[
						[W, H, -1.2],
						[W, 0, -1.2],
						[W, 0, 0],
						[W, H, 0],
					],
					PAL.earth,
				);
				r.ground(0, 0, W, H, PAL.path, 0);
			},
		});
		const R = rng(7);
		for (const b of blocks) {
			const [x0, y0, x1, y1] = b.rect;
			const color = DISTRICT_COLORS[b.i % DISTRICT_COLORS.length];
			groundRect(scene, x0 - 0.3, y0 - 0.3, x1 + 0.3, y1 + 0.3, PAL.pathEdge, { layer: LAYER.GROUND });
			groundRect(scene, x0, y0, x1, y1, PAL.grass, { layer: LAYER.GROUND, z: 0.015 });
			groundRect(scene, x0 + 1, y0 + 1, x1 - 1, y1 - 1, color, { layer: LAYER.GROUND, z: 0.02 });
			const roof = ROOFS[b.i % ROOFS.length];
			const mine = town.buildings.filter((bd) => bd.district === b.d.id);
			const slots = [
				[x0 + 1.4, y0 + 1.4],
				[x0 + 6.6, y0 + 1.4],
				[x0 + 1.4, y0 + 6.6],
				[x0 + 6.6, y0 + 6.6],
			];
			slots.forEach(([sx, sy], k) => {
				const bd = mine[k];
				const w = 4;
				const d = 4;
				if (bd) {
					const hgt = 2.4 + ((b.i + k) % 3) * 1.2;
					object(scene, sx, sy, sx + w, sy + d, hgt + 2, (r) => drawBuilding(r, sx, sy, w, d, hgt, roof, b.i + k));
					scene.addHit({ id: `building-${bd.id}`, kind: "building", bounds: [sx, sy, 0, sx + w, sy + d, hgt + 1], priority: 1, onActivate: () => selectBuilding(bd.id) });
					scene.addLabel({ id: `building-${bd.id}`, kind: "building", pos: [sx + w / 2, sy + d / 2, hgt + 1.6], text: bd.title, onClick: () => selectBuilding(bd.id), ariaLabel: `Building: ${bd.title}` });
				} else {
					for (let t = 0; t < 3; t++) {
						const tx = sx + 1 + R() * (w - 2);
						const ty = sy + 1 + R() * (d - 2);
						const kind = Math.floor(R() * 4);
						object(scene, tx - 0.9, ty - 0.9, tx + 0.9, ty + 0.9, 3, (r) => drawTree(r, tx, ty, kind, 0.9));
					}
				}
			});
			scene.addHit({ id: `district-${b.d.id}`, kind: "district", bounds: [x0, y0, 0, x1, y1, 0.5], priority: 0, onActivate: () => app.router.go({ name: "town", districtId: b.d.id }) });
			scene.addLabel({
				id: `district-${b.d.id}`,
				kind: "district",
				pos: [(x0 + x1) / 2, (y0 + y1) / 2, 6],
				text: b.d.title,
				onClick: () => app.router.go({ name: "town", districtId: b.d.id }),
				ariaLabel: `District: ${b.d.title}`,
			});
		}
		new ResizeObserver(syncInsets).observe(panel);
		syncInsets();
		scene.fitWorldRect([0, 0, W, H], { instant: true, height: 4 });
	}

	function section(title, html) {
		return html ? h("div", { class: "section" }, h("h4", {}, title), h("div", { class: "prose", html })) : null;
	}

	function showIntro() {
		selected = null;
		pKicker.textContent = "Town map";
		pTitle.textContent = "Who makes robots work";
		pBody.replaceChildren(
			h("p", {}, "Each block is one kind of company. Tap a district or a building to see what it does."),
			town.districts.length
				? h(
						"div",
						{ class: "ride-cards" },
						town.districts.map((d) => {
							const b = h("button", { class: "btn block", type: "button", "data-district": d.id }, d.title);
							b.addEventListener("click", () => app.router.go({ name: "town", districtId: d.id }));
							return b;
						}),
					)
				: h("p", { class: "empty" }, "The town has not been written yet."),
		);
	}

	/**
	 * Highlight one label. Inside the open district, show the building labels at any zoom and hide
	 * the district's own label, which would sit on top of them (the panel title names it).
	 */
	function markSelected(id, districtId = null) {
		for (const l of scene.labels.values()) {
			l.el.classList.toggle("selected", l.id === id);
			if (l.kind === "district") l.el.classList.toggle("open", l.id === `district-${districtId}`);
		}
		for (const bd of town.buildings) scene.labels.get(`building-${bd.id}`)?.el.classList.toggle("in-district", bd.district === districtId);
	}

	function selectDistrict(id) {
		const d = town.districts.find((x) => x.id === id);
		if (!d) return showIntro();
		selected = `district-${id}`;
		markSelected(selected, id);
		pKicker.textContent = "District";
		pTitle.textContent = d.title;
		const buildings = town.buildings.filter((b) => b.district === id);
		pBody.replaceChildren(
			...[
				d.tagline ? h("p", { class: "meta-line" }, d.tagline) : null,
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
			].filter(Boolean),
		);
		panel.hidden = false;
		pBody.scrollTop = 0;
		syncInsets();
		const blk = blocks.find((b) => b.d.id === id);
		if (blk) scene.lookAt((blk.rect[0] + blk.rect[2]) / 2, (blk.rect[1] + blk.rect[3]) / 2, 2, { zoom: Math.max(scene.camera.zoom, app.isPhone() ? 0.5 : 0.9) });
	}

	function selectBuilding(id) {
		const b = town.buildings.find((x) => x.id === id);
		if (!b) return;
		const d = town.districts.find((x) => x.id === b.district);
		selected = `building-${id}`;
		markSelected(selected, b.district);
		pKicker.textContent = d ? d.title : "Building";
		pTitle.textContent = b.title;
		const back = d ? h("button", { class: "btn", type: "button" }, `Back to ${d.title}`) : null;
		back?.addEventListener("click", () => selectDistrict(d.id));
		pBody.replaceChildren(
			...[
				h("div", { class: "prose", html: b.about }),
				b.roles?.length
					? h("div", { class: "section", "data-roles": b.id }, h("h4", {}, "Job functions"), h("ul", { class: "prose" }, b.roles.map((r) => h("li", {}, h("strong", {}, r.name), h("span", { html: ` — ${r.html}` })))))
					: null,
				back,
			].filter(Boolean),
		);
		panel.hidden = false;
		pBody.scrollTop = 0;
		syncInsets();
	}

	return {
		show(districtId) {
			view.hidden = false;
			if (!scene) build();
			else scene.resize();
			if (districtId) selectDistrict(districtId);
			else if (!selected) showIntro();
			scene.requestFrame();
		},
		hide() {
			view.hidden = true;
		},
		selectBuilding,
		get scene() {
			return scene;
		},
	};
}

// ---------------------------------------------------------------------------
// Showroom

function drawPerson(c, x, ground, s) {
	const H = 1700 * s;
	c.fillStyle = "#59616c";
	c.beginPath();
	c.arc(x, ground - H + H * 0.065, H * 0.065, 0, Math.PI * 2);
	c.fill();
	c.beginPath();
	c.roundRect?.(x - H * 0.11, ground - H * 0.86, H * 0.22, H * 0.4, H * 0.05);
	if (!c.roundRect) c.rect(x - H * 0.11, ground - H * 0.86, H * 0.22, H * 0.4);
	c.fill();
	c.fillRect(x - H * 0.09, ground - H * 0.47, H * 0.07, H * 0.47);
	c.fillRect(x + H * 0.02, ground - H * 0.47, H * 0.07, H * 0.47);
}

function drawRobotSide(c, robot, x, ground, s) {
	const H = (robot.heightMm?.mid ?? 1000) * s;
	const R = (robot.reachMm?.max ?? 1000) * s;
	const kind = robot.concept ?? robot.id;
	const body = "#e9edf1";
	const dark = "#3b4552";
	const accent = kind === "delta" ? "#3d7fd1" : kind === "scara" ? "#2f6fb3" : kind === "gantry" ? "#e8792f" : "#2a9d8f";
	c.lineCap = "round";
	c.lineJoin = "round";
	const seg = (x1, y1, x2, y2, w, col) => {
		c.strokeStyle = col;
		c.lineWidth = Math.max(2, w);
		c.beginPath();
		c.moveTo(x1, y1);
		c.lineTo(x2, y2);
		c.stroke();
	};
	const joint = (px, py, r) => {
		c.fillStyle = accent;
		c.beginPath();
		c.arc(px, py, Math.max(2.5, r), 0, Math.PI * 2);
		c.fill();
	};
	if (kind === "scara") {
		c.fillStyle = dark;
		c.fillRect(x - H * 0.18, ground - H * 0.06, H * 0.36, H * 0.06);
		seg(x, ground - H * 0.05, x, ground - H * 0.9, H * 0.16, body);
		seg(x, ground - H * 0.92, x + R * 0.52, ground - H * 0.92, H * 0.1, body);
		joint(x + R * 0.52, ground - H * 0.92, H * 0.06);
		seg(x + R * 0.52, ground - H, x + R, ground - H, H * 0.08, body);
		seg(x + R, ground - H, x + R, ground - H * 0.45, H * 0.025, "#9aa5b1");
		joint(x, ground - H * 0.92, H * 0.07);
	} else if (kind === "delta") {
		const top = ground - H;
		const plat = ground - H * 0.3;
		c.fillStyle = body;
		c.fillRect(x - H * 0.18, top, H * 0.36, H * 0.14);
		for (const sx of [-1, 0, 1]) {
			const ex = x + sx * R * 0.32 + (sx === 0 ? R * 0.12 : 0);
			const ey = top + H * 0.28;
			seg(x + sx * H * 0.12, top + H * 0.1, ex, ey, H * 0.04, accent);
			seg(ex, ey, x + sx * H * 0.04, plat, H * 0.015, "#9aa5b1");
		}
		c.fillStyle = dark;
		c.fillRect(x - H * 0.06, plat, H * 0.12, H * 0.04);
	} else if (kind === "gantry") {
		seg(x, ground, x, ground - H, H * 0.04, "#9aa5b1");
		seg(x + R, ground, x + R, ground - H, H * 0.04, "#9aa5b1");
		seg(x, ground - H, x + R, ground - H, H * 0.05, accent);
		seg(x + R * 0.55, ground - H, x + R * 0.55, ground - H * 0.4, H * 0.035, "#9aa5b1");
		c.fillStyle = dark;
		c.fillRect(x + R * 0.55 - H * 0.04, ground - H - H * 0.03, H * 0.08, H * 0.07);
	} else {
		// Articulated arm (6-axis, cobot, and anything else).
		c.fillStyle = dark;
		c.fillRect(x - H * 0.16, ground - H * 0.05, H * 0.32, H * 0.05);
		c.fillStyle = body;
		c.fillRect(x - H * 0.11, ground - H * 0.32, H * 0.22, H * 0.28);
		const sh = [x, ground - H * 0.36];
		const el = [x + R * 0.18, ground - H * 0.96];
		const wr = [x + R * 0.68, ground - H * 0.82];
		seg(sh[0], sh[1], el[0], el[1], H * 0.11, body);
		seg(el[0], el[1], wr[0], wr[1], H * 0.08, body);
		seg(wr[0], wr[1], wr[0], wr[1] + H * 0.12, H * 0.04, "#9aa5b1");
		joint(sh[0], sh[1], H * 0.07);
		joint(el[0], el[1], H * 0.055);
		joint(wr[0], wr[1], H * 0.04);
	}
	// Reach line.
	c.setLineDash([4, 4]);
	c.strokeStyle = "#8f5b00";
	c.lineWidth = 1.5;
	c.beginPath();
	const ry = ground - Math.min(H * 0.5, 18);
	const rx0 = kind === "delta" ? x - R / 2 : x;
	c.moveTo(rx0, ry);
	c.lineTo(rx0 + R, ry);
	c.stroke();
	c.setLineDash([]);
}

export function initShowroom(app) {
	const view = $("#showroom-view");
	const robots = app.content.showroom ?? [];
	const back = h("button", { class: "btn", type: "button", html: `${icon("park")}<span>Back to park</span>` });
	const toTown = h("button", { class: "btn", type: "button", html: `${icon("town")}<span>Town map</span>` });
	back.addEventListener("click", () => app.router.go({ name: "park" }));
	toTown.addEventListener("click", () => app.router.go({ name: "town" }));
	const stage = h("div", { class: "showroom-stage", "aria-label": "Robots drawn at the same scale" });
	const notes = h("div", {});
	view.append(
		h("div", { class: "view-bar" }, back, toTown),
		h("h2", {}, "Showroom"),
		h("p", { class: "meta-line" }, "Every robot is drawn at the same scale next to a 1.7 m person. The dashed line shows the maximum reach."),
		stage,
		notes,
	);

	function render() {
		stage.replaceChildren();
		notes.replaceChildren();
		if (!robots.length) {
			stage.append(h("p", { class: "empty" }, "The showroom has not been written yet."));
			return;
		}
		const stageH = app.isPhone() ? 210 : 280;
		const maxH = Math.max(1700, ...robots.map((r) => r.heightMm?.max ?? 0));
		const s = (stageH - 24) / maxH;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const column = (w, drawFn, caption, id) => {
			const cv = h("canvas", { width: String(Math.round(w * dpr)), height: String(Math.round(stageH * dpr)), style: { width: `${w}px`, height: `${stageH}px` }, "aria-hidden": "true" });
			const c = cv.getContext("2d");
			c.setTransform(dpr, 0, 0, dpr, 0, 0);
			drawFn(c);
			stage.append(h("div", { class: "robot-col", "data-robot": id ?? "person", style: { width: `${w}px` } }, cv, caption));
		};
		column(90, (c) => drawPerson(c, 45, stageH - 2, s), h("div", { class: "robot-caption" }, h("h3", {}, "Person"), h("dl", {}, h("dt", {}, "Height"), h("dd", {}, "1.7 m"))));
		for (const rb of robots) {
			const R = (rb.reachMm?.max ?? 1000) * s;
			const w = Math.max(140, Math.ceil(R + 50));
			const x = (rb.concept ?? rb.id) === "delta" ? w / 2 : 26;
			column(
				w,
				(c) => drawRobotSide(c, rb, x, stageH - 2, s),
				h(
					"div",
					{ class: "robot-caption" },
					h("h3", {}, rb.title),
					h(
						"dl",
						{},
						h("dt", {}, "Payload"),
						h("dd", {}, rb.payloadKg ? `${rb.payloadKg.text} kg` : "-"),
						h("dt", {}, "Reach"),
						h("dd", {}, rb.reachMm ? `${rb.reachMm.text} mm` : "-"),
						h("dt", {}, "Speed"),
						h("dd", { html: rb.speed || "-" }),
					),
				),
				rb.id,
			);
		}
		for (const rb of robots) {
			const src = rb.sources?.length ? h("ol", { class: "sources" }, rb.sources.map((x) => h("li", {}, h("a", { href: x.url, target: "_blank", rel: "noopener" }, x.title), x.note ? h("span", { html: ` — ${x.note}` }) : null))) : null;
			notes.append(
				h("section", { class: "card", style: { marginTop: "14px" } }, h("h3", {}, rb.title, " ", rb.concept ? conceptLink(app, rb.concept, "(concept)") : null), h("div", { class: "prose", html: rb.notes }), src),
			);
		}
	}

	let rendered = false;
	return {
		show() {
			view.hidden = false;
			if (!rendered) {
				render();
				rendered = true;
			}
		},
		hide() {
			view.hidden = true;
		},
	};
}
