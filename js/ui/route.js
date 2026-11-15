// Route list drawer: the current ride's stops with seen marks; clicking a stop rides there.

import { $, h } from "../core/dom.js";
import { icon } from "./icons.js";

export function initRoute(app) {
	const el = $("#route-drawer");
	const title = h("h2", { id: "route-title" }, "Route");
	const close = h("button", { class: "icon-btn", type: "button", "aria-label": "Close route list", html: icon("close") });
	const list = h("ol", { class: "route-list", "aria-labelledby": "route-title" });
	const extra = h("div", {});
	el.append(h("div", { class: "drawer-head" }, title, close), h("div", { class: "drawer-body" }, extra, list));
	close.addEventListener("click", () => setOpen(false, true));

	let opener = null;
	function setOpen(v, restoreFocus) {
		if (v && !app.runner.loaded) return;
		if (v) opener = document.activeElement;
		el.hidden = !v;
		if (v) {
			render();
			(list.querySelector('[aria-current="step"]') ?? list.querySelector("button"))?.focus({ preventScroll: false });
		} else if (restoreFocus && opener instanceof HTMLElement) opener.focus({ preventScroll: true });
		app.hud?.update();
		app.layoutChanged();
	}

	function render() {
		const r = app.runner;
		list.replaceChildren();
		extra.replaceChildren();
		if (!r.loaded) return;
		title.textContent = r.ride.title;
		const visible = new Set(r.stops.map((s) => s.id));
		// Show every stop in content order; stops collapsed in this mode are greyed out.
		let n = 0;
		for (const stop of r.ride.stops) {
			const shown = visible.has(stop.id);
			const idx = r.stops.indexOf(stop);
			const seen = app.state.isSeen(r.ride.id, stop.id);
			const current = shown && idx === r.index && !r.finished;
			const btn = h(
				"button",
				{ class: `route-item${seen ? " seen" : ""}`, type: "button", disabled: !shown, "data-stop": stop.id, "aria-current": current ? "step" : "false" },
				h("span", { class: "route-num", "aria-hidden": "true" }, shown ? String(++n) : "-"),
				h("span", { class: "route-text" }, h("span", { class: "route-title" }, stop.title), h("span", { class: "route-cargo" }, stop.cargo)),
				seen ? h("span", { class: "route-seen" }, "Seen") : null,
			);
			btn.setAttribute("aria-label", `${stop.title}${seen ? ", seen" : ""}${shown ? "" : ", not on this route"}`);
			btn.addEventListener("click", () => {
				r.goToStop(idx);
				if (app.isPhone()) setOpen(false, false);
			});
			list.append(h("li", {}, btn));
		}
	}

	return {
		open: () => setOpen(true),
		close: (restore = true) => setOpen(false, restore),
		toggle: () => setOpen(el.hidden),
		isOpen: () => !el.hidden,
		render,
	};
}
