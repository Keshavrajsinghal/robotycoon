// Top HUD: ride menu, stops-seen counter, follow camera, route list, and view options
// (labels, Plain/Precise, reduce motion, town map, glossary). On phones the options fold into
// a "More" menu.

import { $, h } from "../core/dom.js";
import { systemReducedMotion } from "../core/state.js";
import { icon } from "./icons.js";

export function initHud(app) {
	const hud = $("#hud");
	const menuBtn = h("button", { class: "hud-btn", type: "button", id: "ride-menu-btn", "aria-haspopup": "true", "aria-expanded": "false", "aria-controls": "ride-menu", "aria-label": "Rides menu", html: `${icon("menu")}<span class="hud-btn-text">Rides</span>` });
	const menu = h("div", { class: "popover", id: "ride-menu", role: "menu", hidden: true });
	const brand = h("span", { class: "hud-brand" }, "RoboTycoon");
	const rideTitle = h("span", { class: "hud-ride-title" });
	const counter = h("div", { class: "hud-counter", id: "seen-counter", role: "status" }, h("span", { class: "counter-label" }, "Stops seen"), h("span", { class: "counter-value" }));
	const follow = h("button", { class: "hud-btn", type: "button", id: "toggle-follow", "aria-pressed": "false", "aria-label": "Follow camera", title: "Follow camera", html: icon("follow") });
	const route = h("button", { class: "hud-btn", type: "button", id: "route-btn", "aria-expanded": "false", "aria-controls": "route-drawer", "aria-label": "Route list", title: "Route list", html: `${icon("route")}<span class="hud-btn-text">Route</span>` });
	const more = h("button", { class: "hud-btn hud-more", type: "button", id: "more-btn", "aria-expanded": "false", "aria-controls": "hud-opts", "aria-label": "More options", html: icon("more") });
	const labels = h("button", { class: "hud-btn", type: "button", id: "toggle-labels", "aria-pressed": "false", "aria-label": "Labels", title: "Labels", html: `${icon("labels")}<span class="opt-label">Labels</span>` });
	const level = h("div", { class: "seg", role: "group", "aria-label": "Text level", id: "hud-level" });
	for (const [v, t] of [
		["plain", "Plain"],
		["precise", "Precise"],
	]) {
		const b = h("button", { type: "button", "data-level": v, "aria-pressed": "false" }, t);
		b.addEventListener("click", () => app.setLevel(v));
		level.append(b);
	}
	const motion = h("button", { class: "hud-btn", type: "button", id: "toggle-motion", "aria-pressed": "false", "aria-label": "Reduce motion", title: "Reduce motion", html: `${icon("motion")}<span class="opt-label">Reduce motion</span>` });
	const town = h("button", { class: "hud-btn", type: "button", id: "town-btn", "aria-label": "Town map", title: "Town map", html: `${icon("town")}<span class="opt-label">Town map</span>` });
	const gloss = h("button", { class: "hud-btn", type: "button", id: "glossary-btn", "aria-label": "Glossary", title: "Glossary", html: `${icon("book")}<span class="opt-label">Glossary</span>` });
	const opts = h("div", { class: "hud-opts", id: "hud-opts" }, labels, level, motion, town, gloss);
	hud.append(
		h("div", { class: "hud-group" }, h("div", { class: "menu-wrap" }, menuBtn, menu), brand, rideTitle),
		h("div", { class: "hud-spacer" }),
		counter,
		h("div", { class: "hud-group" }, follow, route, h("div", { class: "menu-wrap" }, more, opts)),
	);

	/** Close both menus. restoreFocus (Escape) moves focus from inside a menu back to its button. */
	const closeMenus = (restoreFocus = false) => {
		const a = document.activeElement;
		const back = !restoreFocus ? null : !menu.hidden && menu.contains(a) ? menuBtn : opts.classList.contains("open") && opts.contains(a) ? more : null;
		menu.hidden = true;
		menuBtn.setAttribute("aria-expanded", "false");
		opts.classList.remove("open");
		more.setAttribute("aria-expanded", "false");
		back?.focus();
	};
	// Arrow keys move between the ride menu's items (it is announced as a menu).
	menu.addEventListener("keydown", (e) => {
		if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		e.preventDefault();
		const items = [...menu.querySelectorAll(".menu-item:not(:disabled)")];
		const i = items.indexOf(document.activeElement);
		items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus();
	});

	function renderMenu() {
		menu.replaceChildren();
		const cur = app.currentRideId;
		const item = (label, onClick, opts2 = {}) => {
			const b = h("button", { class: "menu-item", type: "button", role: "menuitem", disabled: opts2.disabled, "aria-current": opts2.current ? "true" : "false", "data-ride": opts2.rideId ?? "" }, h("span", {}, label), opts2.soon ? h("span", { class: "soon" }, "Opening soon") : null);
			b.addEventListener("click", () => {
				// Hiding the menu would drop keyboard focus to the page: return it to the menu button.
				closeMenus(true);
				onClick();
			});
			menu.append(b);
		};
		item("Park overview", () => app.router.go({ name: "park" }), { current: !cur });
		for (const info of app.rideList)
			item(info.ride?.title ?? info.fallbackTitle, () => app.router.go({ name: "ride", rideId: info.id }), { disabled: !info.available, soon: !info.available, current: cur === info.id, rideId: info.id });
		item("Town map", () => app.router.go({ name: "town" }));
		item("Showroom", () => app.router.go({ name: "showroom" }));
	}

	menuBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		const open = menu.hidden;
		closeMenus();
		if (open) {
			renderMenu();
			menu.hidden = false;
			menuBtn.setAttribute("aria-expanded", "true");
			menu.querySelector(".menu-item:not(:disabled)")?.focus();
		}
	});
	more.addEventListener("click", (e) => {
		e.stopPropagation();
		const open = !opts.classList.contains("open");
		closeMenus();
		if (open) {
			opts.classList.add("open");
			more.setAttribute("aria-expanded", "true");
		}
	});
	document.addEventListener("pointerdown", (e) => {
		if (!hud.contains(e.target)) closeMenus();
	});
	follow.addEventListener("click", () => app.state.set("follow", !app.state.get("follow")));
	labels.addEventListener("click", () => app.state.set("labels", !app.state.get("labels")));
	motion.addEventListener("click", () => {
		// Store an override only when it differs from the system setting, so toggling back
		// returns to following the system (null) instead of pinning a value forever.
		const next = !app.reducedMotion();
		app.state.set("reduceMotion", next === systemReducedMotion() ? null : next);
	});
	// closeMenus(true): on narrow screens these sit in the folded "More" menu, which hides, so focus
	// goes back to its button (and the glossary dialog returns focus there when it closes).
	town.addEventListener("click", () => {
		closeMenus(true);
		app.router.go({ name: "town" });
	});
	gloss.addEventListener("click", () => {
		closeMenus(true);
		app.router.go({ name: "glossary" });
	});
	route.addEventListener("click", () => app.route.toggle());

	function update() {
		const seen = app.seenCount();
		counter.querySelector(".counter-value").textContent = `${seen.seen} / ${seen.total}`;
		counter.setAttribute("aria-label", `Stops seen: ${seen.seen} of ${seen.total}`);
		follow.setAttribute("aria-pressed", app.state.get("follow") ? "true" : "false");
		labels.setAttribute("aria-pressed", app.state.get("labels") ? "true" : "false");
		motion.setAttribute("aria-pressed", app.reducedMotion() ? "true" : "false");
		for (const b of level.querySelectorAll("button")) b.setAttribute("aria-pressed", b.dataset.level === app.level() ? "true" : "false");
		const info = app.currentRideId ? app.rides.get(app.currentRideId) : null;
		rideTitle.textContent = info?.ride?.title ?? "";
		// Follow and the route list only work on the park map, not in the town or showroom.
		const inPark = app.viewName === "park";
		route.disabled = !app.currentRideId || !inPark;
		follow.disabled = !inPark;
		route.setAttribute("aria-expanded", app.route.isOpen() ? "true" : "false");
	}

	return { update, closeMenus, menuOpen: () => !menu.hidden || opts.classList.contains("open") };
}
