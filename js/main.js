// Boot: load content and ride modules, build the park scene and UI, wire the router, expose
// window.__rt for tests.

import { $, h, isMissingModule } from "./core/dom.js";
import { bus } from "./core/events.js";
import { Router } from "./core/router.js";
import { reducedMotion, state } from "./core/state.js";
import { drawCart } from "./engine/cart.js";
import { buildPark, drawBooth, object, PAL, PARK_LIMITS, RIDE_IDS, RIDE_ZONE, ZONES } from "./engine/park.js";
import { RideRunner, rideHasModes, SPEEDS, stopsForMode } from "./engine/ride-runner.js";
import { Scene } from "./engine/scene.js";
import { Track } from "./engine/track.js";
import { initShowroom, initTown } from "./town/town.js";
import { openConcept } from "./ui/concept.js";
import { initControls } from "./ui/controls.js";
import { openGlossary } from "./ui/glossary.js";
import { initHud } from "./ui/hud.js";
import { closeModals, modalOpen, topModal } from "./ui/modal.js";
import { initPanel } from "./ui/panel.js";
import { openPuzzle } from "./ui/puzzle.js";
import { initRoute } from "./ui/route.js";
import { openWorkbench } from "./workbenches/host.js";

const boot = $("#boot");

function bootMessage(title, ...lines) {
	boot.replaceChildren(h("div", { class: "boot-card" }, h("h1", {}, title), ...lines.map((l) => h("p", {}, l))));
	boot.hidden = false;
}

async function loadContent() {
	const fixture = new URLSearchParams(location.search).get("content") === "fixture";
	const url = fixture ? "../tests/fixtures/content.js" : "./content.js";
	try {
		const mod = await import(url);
		return { content: mod.CONTENT ?? mod.default ?? null, fixture };
	} catch (e) {
		if (!isMissingModule(e)) console.error(e);
		return { content: null, fixture };
	}
}

async function loadRideModule(id) {
	try {
		const mod = await import(`./rides/${id}.js`);
		return mod.default ?? null;
	} catch (e) {
		// A missing file is expected while a ride is being built; anything else is a real bug.
		if (!isMissingModule(e)) console.error(e);
		return null;
	}
}

/** Returns null if the module can run this ride, else the reason it cannot. */
function checkRideModule(ride, mod) {
	if (!ride) return "no content";
	if (!mod) return "no module";
	if (typeof mod.trackFor !== "function" || typeof mod.buildScenery !== "function") return "module is missing trackFor or buildScenery";
	const modes = rideHasModes(ride) ? ["classical", "learned"] : ["classical"];
	for (const mode of modes) {
		const t = new Track(mod.trackFor(mode));
		const missing = stopsForMode(ride.stops, mode).filter((s) => t.stopS[s.id] === undefined);
		if (missing.length) return `track has no point for stop(s) ${missing.map((s) => s.id).join(", ")} (${mode})`;
	}
	return null;
}

async function main() {
	const { content, fixture } = await loadContent();
	if (!content) {
		bootMessage(
			"Content is not built yet",
			"RoboTycoon could not load js/content.js, which holds every explanation, question, and puzzle on the site.",
			"Generate it from the knowledge folder with: node tools/build-content.mjs",
			"To try the site with placeholder content instead, open it with ?content=fixture at the end of the address.",
		);
		return;
	}
	document.documentElement.dataset.content = fixture ? "fixture" : "real";

	// Rides: content entries plus their modules. A ride without either is "opening soon".
	const contentRides = content.rides ?? [];
	const ids = [...RIDE_IDS, ...contentRides.map((r) => r.id).filter((id) => !RIDE_IDS.includes(id))];
	const modules = await Promise.all(ids.map((id) => (contentRides.some((r) => r.id === id) ? loadRideModule(id) : null)));
	const rides = new Map();
	ids.forEach((id, i) => {
		const ride = contentRides.find((r) => r.id === id) ?? null;
		const module = modules[i];
		let reason = null;
		try {
			reason = checkRideModule(ride, module);
			if (!reason && !ZONES[module.zone ?? RIDE_ZONE[id]]) reason = `unknown zone ${module.zone}`;
		} catch (e) {
			console.error(e);
			reason = String(e.message ?? e);
		}
		if (reason && ride && module) console.error(`${id} is unavailable: ${reason}`);
		rides.set(id, { id, ride, module, available: !reason, reason, color: PAL.ride[id] ?? "#7f8b98", fallbackTitle: `Ride ${i + 1}` });
	});

	const canvas = $("#park-canvas");
	const scene = new Scene({ canvas, overlay: $("#park-overlay"), background: PAL.sea, limits: PARK_LIMITS, minZoom: 0.18, maxZoom: 2.6 });
	scene.reducedMotion = reducedMotion;
	const app = {
		content,
		state,
		bus,
		scene,
		rides,
		rideList: [...rides.values()],
		currentRideId: null,
		viewName: "park",
		reducedMotion,
		level: () => (state.get("level") === "precise" ? "precise" : "plain"),
		setLevel: (v) => state.set("level", v === "precise" ? "precise" : "plain"),
		isPhone: () => window.matchMedia("(max-width: 759px)").matches,
		conceptTitle: (id) => content.concepts?.[id]?.title ?? id.replace(/-/g, " "),
		workbench: (id) => content.workbenches?.find((w) => w.id === id) ?? null,
		hudHeight: () => $("#hud").offsetHeight,
	};
	// Play waits at a stop while the rider is reading: mouse over the panel, keyboard focus inside
	// the panel body (focus-visible only, so a mouse click on a panel button does not freeze Play),
	// the phone sheet expanded, or any dialog (concept, glossary, puzzle, workbench) open.
	const sheetExpanded = () => app.isPhone() && !$("#panel").hidden && $("#panel").dataset.state === "expanded";
	const keyboardInPanel = () => {
		const a = document.activeElement;
		return !!a && $("#panel-body").contains(a) && a.matches(":focus-visible");
	};
	const runner = new RideRunner({ reducedMotion, holdDwell: () => (app.panel?.isHovered() ?? false) || keyboardInPanel() || sheetExpanded() || modalOpen() });
	runner.setSpeed(SPEEDS.includes(state.get("speed")) ? state.get("speed") : 1);
	app.runner = runner;
	const router = new Router((route, prev) => onRoute(route, prev));
	app.router = router;

	app.seenCount = () => {
		let total = 0;
		let seen = 0;
		for (const info of rides.values()) {
			if (!info.available) continue;
			for (const s of info.ride.stops) {
				total++;
				if (state.isSeen(info.id, s.id)) seen++;
			}
		}
		return { seen, total };
	};

	// ---------------------------------------------------------------- ride context
	const ctxCache = new Map();
	app.rideCtx = (rideId) => {
		if (ctxCache.has(rideId)) return ctxCache.get(rideId);
		const info = rides.get(rideId);
		const ride = info.ride;
		const ctx = {
			rideId,
			ride,
			content,
			zone: ZONES[info.module?.zone ?? RIDE_ZONE[rideId]],
			group: rideId,
			pal: PAL,
			get mode() {
				return runner.ride?.id === rideId ? runner.mode : (state.get("modes")?.[rideId] ?? "classical");
			},
			get stops() {
				return stopsForMode(ride.stops, ctx.mode);
			},
			reducedMotion,
			isActive: () => app.currentRideId === rideId,
			currentStopId: () => (app.currentRideId === rideId ? (runner.stop?.id ?? null) : null),
			stopReached: (id) => {
				if (app.currentRideId !== rideId) return false;
				const i = runner.stops.findIndex((s) => s.id === id);
				return i >= 0 && (runner.finished || i <= runner.index);
			},
			stopTitle: (id) => ride.stops.find((s) => s.id === id)?.title ?? "",
			goToStop: (id) => goToStop(rideId, id),
			openWorkbench: (id) => router.go({ name: "workbench", id }),
			label: (opts) => scene.addLabel({ kind: "station", group: rideId, ...opts }),
			stopTarget(stopId, bounds, labelPos) {
				const stop = ride.stops.find((s) => s.id === stopId);
				if (!stop) return;
				const visible = ctx.stops.some((s) => s.id === stopId);
				const go = () => goToStop(rideId, stopId);
				if (visible) scene.addHit({ id: `stop-${rideId}-${stopId}`, kind: "stop", group: rideId, bounds, priority: 1, onActivate: go });
				scene.addLabel({
					id: `stop-${rideId}-${stopId}`,
					group: rideId,
					kind: "station",
					className: visible ? "" : "bypassed",
					pos: labelPos,
					text: stop.title,
					onClick: visible ? go : undefined,
					ariaLabel: `Stop: ${stop.title}`,
				});
			},
			booth(stopId, x, y, opts = {}) {
				const stop = ride.stops.find((s) => s.id === stopId);
				const wid = opts.workbench ?? stop?.workbench;
				if (!wid) return;
				const title = app.workbench(wid)?.title ?? "Workbench";
				const open = () => router.go({ name: "workbench", id: wid });
				object(scene, x - 0.9, y - 0.9, x + 0.9, y + 0.9, 3, (r) => drawBooth(r, x, y, info.color), { group: rideId });
				scene.addHit({ id: `booth-${wid}`, kind: "booth", group: rideId, bounds: [x - 0.9, y - 0.9, 0, x + 0.9, y + 0.9, 2.9], priority: 3, onActivate: open });
				scene.addLabel({ id: `booth-${wid}`, group: rideId, kind: "booth", pos: [x, y, 3.2], text: title, onClick: open, ariaLabel: `Workbench: ${title}` });
			},
		};
		ctxCache.set(rideId, ctx);
		return ctx;
	};

	// ---------------------------------------------------------------- scene
	const builtModes = {};
	const cargoErrors = new Set();
	function rebuildPark() {
		scene.clear();
		buildPark(scene, {
			isAvailable: (id) => !!rides.get(id)?.available,
			rideTitle: (id) => rides.get(id)?.ride?.title ?? rides.get(id)?.fallbackTitle ?? id,
			onGate: (id) => {
				if (rides.get(id)?.available) router.go({ name: "ride", rideId: id });
				else toast("This ride is opening soon.");
			},
			onTown: () => router.go({ name: "town" }),
		});
		for (const info of rides.values()) {
			if (!info.available) continue;
			const ctx = app.rideCtx(info.id);
			try {
				builtModes[info.id] = ctx.mode;
				new Track(info.module.trackFor(ctx.mode)).draw(scene, { group: info.id });
				info.module.buildScenery(scene, ctx);
				if (info.module.drawDynamic) {
					const [x0, y0, x1, y1] = ctx.zone.rect;
					scene.addDynamic({ group: info.id, depth: 1e6, animated: () => true, bounds: [x0, y0, 0, x1, y1, 14], draw: (r, t) => info.module.drawDynamic(r, t, ctx) });
				}
			} catch (e) {
				console.error(`${info.id} scenery failed`, e);
			}
		}
		scene.addDynamic({
			group: "cart",
			depth: () => {
				const p = runner.pos();
				return p ? p.x + p.y + 0.6 : -1e9;
			},
			bounds: () => {
				const p = runner.pos();
				return p ? [p.x - 1.6, p.y - 1.6, p.z, p.x + 1.6, p.y + 1.6, p.z + 2.4] : [0, 0, 0, 0, 0, 0];
			},
			draw: (r, t) => {
				if (!runner.loaded) return;
				const p = runner.pos();
				const id = runner.ride.id;
				const anchor = drawCart(r, p, rides.get(id).color);
				try {
					rides.get(id).module.drawCargo?.(r, runner.stop?.id ?? null, { ...p, anchor }, t, app.rideCtx(id));
				} catch (e) {
					if (!cargoErrors.has(id)) console.error(e);
					cargoErrors.add(id);
				}
			},
		});
		scene.addLabel({
			id: "cart-tag",
			kind: "cart",
			pos: () => {
				const p = runner.loaded ? runner.pos() : null;
				return p ? [p.x, p.y, p.z + 2.0] : null;
			},
			html: '<span class="cargo"></span><span class="cargo-detail"></span>',
		});
		scene.setLabelsVisible(!!state.get("labels"));
		updateCartTag();
		updateStationHighlight();
	}

	function updateCartTag() {
		const l = scene.labels.get("cart-tag");
		if (!l) return;
		const stop = runner.loaded ? runner.stop : null;
		l.el.querySelector(".cargo").textContent = stop?.cargo ?? "";
		const d = l.el.querySelector(".cargo-detail");
		d.textContent = stop?.cargoDetail ?? "";
		d.hidden = !stop?.cargoDetail;
		l.el.dataset.stop = stop?.id ?? "";
	}

	function updateStationHighlight() {
		const cur = runner.loaded && !runner.finished ? `stop-${runner.ride.id}-${runner.stop?.id}` : null;
		for (const l of scene.labels.values()) if (l.kind === "station") l.el.classList.toggle("current", l.id === cur);
	}

	/** Where the camera looks at the cart: the ride module's optional focus(pos, ctx), else the cart. */
	const focusFailed = new WeakSet(); // modules whose focus() threw: log once, then use the cart
	function cameraTarget() {
		const p = runner.loaded ? runner.pos() : null;
		if (!p) return null;
		const fallback = [p.x, p.y, p.z + 0.6];
		const mod = runner.module;
		if (!mod.focus || focusFailed.has(mod)) return fallback;
		try {
			return mod.focus(p, app.rideCtx(runner.ride.id)) ?? fallback;
		} catch (e) {
			focusFailed.add(mod);
			console.error(e);
			return fallback;
		}
	}

	function applyFollow() {
		scene.follow = state.get("follow") && runner.loaded ? cameraTarget : null;
		scene.requestFrame();
	}

	scene.addTick((dt) => runner.update(dt));

	// While riding, station, booth, sign and gate labels that would sit on the cart's tag (or on the
	// cart under it) step aside, so the cargo stays readable; the current stop's label stays. A label
	// whose box would reach under the top bar drops below its point instead, and one whose point is
	// itself under the bar, or that only peeks out above the phone sheet, hides. Sizes are read
	// first, classes written after, so a frame forces at most one style pass.
	const GUARDED = new Set(["station", "booth", "sign", "gate"]);
	const phoneMq = window.matchMedia("(max-width: 759px)");
	scene.afterLabels = () => {
		const tag = scene.labels.get("cart-tag");
		const top = scene.insets.top;
		// On a phone the sheet spans the full width; a label crossing its top edge only peeks out.
		const sheetTop = phoneMq.matches && scene.insets.bottom > 0 ? scene.h - scene.insets.bottom : Infinity;
		let box = null;
		if (runner.loaded && tag && !tag.anchor.hidden && tag.sx !== undefined) {
			const p = runner.pos();
			const cartY = scene.worldToScreen(p.x, p.y, p.z)[1];
			const w = tag.el.offsetWidth;
			const h = tag.el.offsetHeight;
			if (w) box = [tag.sx - w / 2 - 4, tag.sy - h - 12, tag.sx + w / 2 + 4, Math.max(tag.sy, cartY + 6)];
		}
		const cur = runner.loaded && !runner.finished ? `stop-${runner.ride.id}-${runner.stop?.id}` : null;
		const checks = [];
		for (const l of scene.labels.values()) {
			if (!GUARDED.has(l.kind) || l.sx === undefined) continue;
			const nearTag = box && !l.anchor.hidden && l.id !== cur && Math.abs(l.sx - tag.sx) < 420 && l.sy > box[1] - 10 && l.sy < box[3] + 90;
			const nearTop = !l.anchor.hidden && l.sy < top + 70;
			const nearSheet = !l.anchor.hidden && l.id !== cur && l.sy > sheetTop + 2 && l.sy < sheetTop + 70;
			const read = nearTag || nearTop || nearSheet;
			checks.push({ l, nearTag, nearTop, nearSheet, w: read ? l.el.offsetWidth : 0, h: read ? l.el.offsetHeight : 0 });
		}
		for (const { l, nearTag, nearTop, nearSheet, w, h } of checks) {
			const below = nearTop && h > 0 && l.sy - h < top + 2;
			const y0 = below ? l.sy : l.sy - h;
			// Even hanging below its point it would peek out from under the bar: hide it (not the current stop's).
			const underBar = below && y0 < top - 2 && l.id !== cur;
			const onTag = nearTag && w > 0 && l.sx - w / 2 < box[2] && l.sx + w / 2 > box[0] && y0 < box[3] && y0 + h > box[1];
			const peeks = nearSheet && h > 0 && l.sy - h < sheetTop;
			const hide = underBar || onTag || peeks;
			// The current stop's label whose point is under the bar slides down until it clears it.
			const shift = below && l.id === cur && y0 < top + 2 ? `${Math.round(top + 2 - y0)}px` : "";
			if (l.el.style.top !== shift) l.el.style.top = shift;
			l.el.classList.toggle("label-below", below);
			l.el.classList.toggle("label-yield", hide);
		}
	};
	scene.onUserPan = (kind) => {
		if (kind === "zoom" || !state.get("follow") || !runner.loaded) return;
		state.set("follow", false);
		toast("Follow camera off. Turn it back on from the top bar.");
	};

	// ---------------------------------------------------------------- UI
	app.layoutChanged = () => requestAnimationFrame(syncLayout);
	let toastTimer = 0;
	function toast(msg) {
		const el = $("#toast");
		el.textContent = msg;
		el.classList.add("show");
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
	}
	app.toast = toast;
	app.route = initRoute(app);
	app.hud = initHud(app);
	app.panel = initPanel(app);
	app.controls = initControls(app);
	const town = initTown(app);
	const showroom = initShowroom(app);
	app.openPuzzle = (rideId) => openPuzzle(app, rideId);
	app.setMode = (mode) => runner.setMode(mode);

	function syncLayout() {
		const hudEl = $("#hud");
		const hudH = hudEl.offsetHeight;
		document.documentElement.style.setProperty("--hud-px", `${hudH}px`);
		const phone = app.isPhone();
		const panelEl = $("#panel");
		const controlsEl = $("#controls");
		const inPark = app.viewName === "park";
		const panelOn = inPark && !panelEl.hidden;
		const controlsOn = inPark && !controlsEl.hidden;
		const root = $("#app");
		root.classList.toggle("panel-open", panelOn && !phone);
		root.classList.toggle("controls-on", controlsOn);
		const drawer = $("#route-drawer");
		scene.setInsets({
			top: hudH,
			right: panelOn && !phone ? panelEl.offsetWidth : 0,
			bottom: phone ? (panelOn ? panelEl.offsetHeight : 0) + (controlsOn ? controlsEl.offsetHeight : 0) : controlsOn ? 84 : 0,
			left: !drawer.hidden && !phone ? drawer.offsetWidth : 0,
		});
	}
	const ro = new ResizeObserver(() => syncLayout());
	for (const sel of ["#hud", "#panel", "#controls", "#route-drawer"]) ro.observe($(sel));
	window.addEventListener("resize", () => app.layoutChanged());

	function setView(name) {
		app.viewName = name;
		$("#park-view").hidden = name !== "park";
		$("#panel").hidden = name !== "park" ? true : $("#panel").hidden;
		if (name !== "park") {
			$("#panel-reopen").hidden = true;
			app.route.close(false);
			runner.pause();
		}
		if (name === "town") town.show();
		else town.hide();
		if (name === "showroom") showroom.show();
		else showroom.hide();
		if (name === "park") {
			if (app.panel.view && $("#panel").hidden && $("#panel-reopen").hidden) app.panel.show();
			scene.resize();
			scene.invalidate();
		}
		app.controls.update();
		app.hud.update();
		syncLayout();
	}

	function overviewCamera(instant) {
		const phone = app.isPhone();
		// Phone: x - y = 0 centers the four ride gates around the plaza horizontally (x + y keeps
		// the vertical framing), so every gate label fits a 360 px screen.
		scene.lookAt(phone ? 46 : 40, phone ? 46 : 49, 0, { zoom: phone ? 0.3 : 0.6, instant });
	}

	function selectRide(rideId, { stopId = null, jump = false } = {}) {
		const info = rides.get(rideId);
		if (!info?.available) return false;
		// A link to a stop that only one approach shows (ride 2's "policy" is learned only) opens
		// the ride in that approach, instead of silently boarding at stop 1 of the other one.
		const linked = stopId ? info.ride.stops.find((s) => s.id === stopId) : null;
		const needMode = linked && rideHasModes(info.ride) && (linked.mode === "classical" || linked.mode === "learned") ? linked.mode : null;
		if (app.currentRideId !== rideId || !runner.loaded) {
			app.route.close(false);
			app.currentRideId = rideId;
			try {
				let mode = state.get("modes")?.[rideId];
				if (needMode && needMode !== mode) {
					mode = needMode;
					state.set("modes", { ...(state.get("modes") ?? {}), [rideId]: mode });
				}
				// Board directly at the requested stop, so a deep link does not also "visit" stop 1.
				runner.load(info.ride, info.module, mode, stopId);
			} catch (e) {
				console.error(e);
				info.available = false;
				app.currentRideId = null;
				rebuildPark();
				toast("This ride could not start.");
				return false;
			}
			if (builtModes[rideId] !== runner.mode) rebuildPark();
			applyFollow();
			const [fx, fy, fz] = cameraTarget();
			scene.lookAt(fx, fy, fz, { zoom: app.isPhone() ? 1.05 : 1.3 });
			app.hud.update();
			app.controls.update();
		}
		if (needMode && runner.mode !== needMode) runner.setMode(needMode);
		if (stopId && (runner.stop?.id !== stopId || runner.finished)) runner.goToStopId(stopId, { jump });
		return true;
	}

	function leaveRide() {
		if (!runner.loaded && !app.currentRideId) {
			if (app.panel.view.type !== "welcome") app.panel.showWelcome();
			return;
		}
		runner.unload();
		app.currentRideId = null;
		app.route.close(false);
		scene.follow = null;
		app.panel.showWelcome();
		updateCartTag();
		updateStationHighlight();
		app.controls.update();
		app.hud.update();
		overviewCamera(false);
	}

	function goToStop(rideId, stopId) {
		if (app.currentRideId === rideId && runner.loaded) {
			if (!runner.goToStopId(stopId)) toast("That stop is not on this route.");
		} else router.go({ name: "ride", rideId, stopId });
	}

	runner.on("stop", (i, stop) => {
		const rideId = runner.ride.id;
		state.markSeen(rideId, stop.id);
		app.panel.showStop(i);
		router.replaceSilently({ name: "ride", rideId, stopId: stop.id });
		updateCartTag();
		updateStationHighlight();
		if (app.route.isOpen()) app.route.render();
		app.hud.update();
	});
	runner.on("finish", () => {
		app.panel.showFinish();
		router.replaceSilently({ name: "ride", rideId: runner.ride.id });
		updateCartTag();
		updateStationHighlight();
		if (app.route.isOpen()) app.route.render();
	});
	runner.on("state", () => {
		app.controls.update();
		scene.requestFrame();
	});
	runner.on("mode", (mode) => {
		state.set("modes", { ...(state.get("modes") ?? {}), [runner.ride.id]: mode });
		rebuildPark();
		if (app.route.isOpen()) app.route.render();
	});

	bus.on("prefs", (key) => {
		if (key === "level") app.panel.refresh();
		if (key === "follow") applyFollow();
		if (key === "labels") scene.setLabelsVisible(!!state.get("labels"));
		app.hud.update();
	});
	bus.on("motion", (on) => {
		$("#app").classList.toggle("reduce-motion", on);
		if (on && runner.move) runner.finishMove();
		app.hud.update();
		scene.invalidate();
	});
	bus.on("progress", () => {
		app.hud.update();
		if (app.route.isOpen()) app.route.render();
	});
	$("#app").classList.toggle("reduce-motion", reducedMotion());

	// ---------------------------------------------------------------- routing
	function onRoute(route, prev) {
		if (route.overlay) {
			if (prev === null) showBase(router.base);
			closeModals("route");
			const back = (reason) => {
				if (reason !== "route") router.closeOverlay();
			};
			if (route.name === "concept") openConcept(app, route.id, back);
			else if (route.name === "glossary") openGlossary(app, back);
			else if (route.name === "workbench") openWorkbench(app, route.id, back);
			return;
		}
		closeModals(prev?.overlay ? "route" : undefined);
		if (prev?.overlay && route.name === app.viewName && (route.name !== "ride" || route.rideId === app.currentRideId)) return;
		showBase(route);
	}

	function showBase(route) {
		if (route.name === "town") {
			setView("town");
			town.show(route.districtId);
			return;
		}
		if (route.name === "showroom") {
			setView("showroom");
			return;
		}
		if (app.viewName !== "park") setView("park");
		if (route.name === "ride") {
			if (!selectRide(route.rideId, { stopId: route.stopId, jump: true })) {
				toast("This ride is opening soon.");
				leaveRide();
				router.replaceSilently({ name: "park" });
			}
		} else leaveRide();
	}

	// ---------------------------------------------------------------- global input
	document.addEventListener("click", (e) => {
		const a = e.target.closest?.("a.concept-link");
		if (!a) return;
		const id = a.dataset.concept ?? a.getAttribute("href")?.replace(/^#\/?concept\//, "");
		if (!id) return;
		e.preventDefault();
		router.go({ name: "concept", id });
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			const m = topModal();
			if (m) {
				e.preventDefault();
				m.close("escape");
				return;
			}
			if (app.hud.menuOpen()) {
				app.hud.closeMenus(true);
				return;
			}
			if (app.route.isOpen()) {
				app.route.close();
				return;
			}
			if (app.isPhone() && $("#panel").dataset.state === "expanded") app.panel.setExpanded(false);
			return;
		}
		if (modalOpen() || e.ctrlKey || e.metaKey || e.altKey) return;
		const t = e.target;
		const tag = t?.tagName ?? "";
		if (["INPUT", "SELECT", "TEXTAREA"].includes(tag) || t?.isContentEditable) return;
		if (app.viewName !== "park" || !runner.loaded) return;
		if (e.key === " " || e.code === "Space") {
			if (["BUTTON", "A", "SUMMARY"].includes(tag)) return;
			e.preventDefault();
			runner.toggle();
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			runner.stepForward();
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			runner.stepBack();
		}
	});

	// ---------------------------------------------------------------- start
	rebuildPark();
	app.panel.showWelcome();
	app.hud.update();
	app.controls.update();
	syncLayout();
	overviewCamera(true);
	boot.hidden = true;
	router.start();
	syncLayout();

	// Test API (used by tests/smoke.mjs). Not a public interface.
	window.__rt = {
		app,
		content,
		rides: () =>
			app.rideList.map((i) => ({
				id: i.id,
				title: i.ride?.title ?? null,
				available: i.available,
				reason: i.reason,
				stops: i.ride?.stops.map((s) => s.id) ?? [],
				modes: i.ride ? rideHasModes(i.ride) : false,
				puzzle: i.ride?.puzzle?.type ?? null,
			})),
		state: () => runner.state(),
		select: (rideId, stopId) => router.go({ name: "ride", rideId, stopId }),
		play: () => runner.play(),
		pause: () => runner.pause(),
		stepForward: () => runner.stepForward(),
		stepBack: () => runner.stepBack(),
		restart: () => runner.restart(),
		goToStop: (i, jump = false) => runner.goToStop(i, { jump }),
		finishMove: () => runner.finishMove(),
		setMode: (m) => runner.setMode(m),
		setSpeed: (x) => runner.setSpeed(x),
		cartScreen: () => {
			const p = runner.pos();
			return p ? scene.worldToScreen(p.x, p.y, p.z) : null;
		},
		cartWorld: () => runner.pos(),
		camera: () => ({ ...scene.camera, insets: { ...scene.insets } }),
		idle: () => scene.isIdle(),
		reducedMotion: () => reducedMotion(),
		openPuzzle: (rideId) => app.openPuzzle(rideId),
		topModal: () => topModal(),
		// The open workbench's test hook ({solve(), state(), ...}), or null.
		wbTest: () => topModal()?.wbInstance?.test ?? null,
		view: () => app.viewName,
		hits: () => scene.hits.map((x) => ({ id: x.id, kind: x.kind })),
		townScene: () => town.scene,
		ready: true,
	};
	document.documentElement.dataset.ready = "1";
}

main().catch((e) => {
	console.error(e);
	bootMessage("Something went wrong", String(e?.message ?? e));
});
