// Stop panel: a side panel on desktop, a bottom sheet on phones. Shows the welcome card, the
// current stop, or the ride-complete card.

import { $, h } from "../core/dom.js";
import { rideHasModes } from "../engine/ride-runner.js";
import { conceptLink, readMoreConcept } from "./concept.js";
import { icon } from "./icons.js";
import { questionCard } from "./question.js";

const fmtMs = (n) => `${Math.round(n).toLocaleString("en-US")} ms`;

export function levelSwitch(app) {
	const seg = h("div", { class: "seg level-switch", role: "group", "aria-label": "Text level" });
	for (const [v, label] of [
		["plain", "Plain"],
		["precise", "Precise"],
	]) {
		const b = h("button", { type: "button", "data-level": v, "aria-pressed": app.level() === v ? "true" : "false" }, label);
		b.addEventListener("click", () => app.setLevel(v));
		seg.append(b);
	}
	return seg;
}

export function initPanel(app) {
	const el = $("#panel");
	const reopen = $("#panel-reopen");
	const toggle = h("button", { class: "sheet-toggle", type: "button", "aria-expanded": "false", "aria-controls": "panel-body" }, h("span", { class: "grip" }), h("span", { class: "sr-only" }, "Expand or collapse the panel"));
	const kicker = h("div", { class: "panel-kicker" });
	const title = h("h2", { class: "panel-title", id: "panel-title", tabindex: "-1" });
	const cargo = h("div", { class: "cargo-tag", hidden: true });
	const close = h("button", { class: "icon-btn panel-close", type: "button", "aria-label": "Close panel", html: icon("close") });
	const head = h("div", { class: "panel-head" }, toggle, kicker, title, cargo, close);
	const body = h("div", { class: "panel-body", id: "panel-body" });
	el.append(head, body);
	el.setAttribute("aria-labelledby", "panel-title");
	el.dataset.state = "collapsed";

	let view = { type: "welcome" };
	let cleanup = null;
	let readMoreOpen = false;
	let hovering = false;

	el.addEventListener("pointerenter", (e) => {
		if (e.pointerType === "mouse") hovering = true;
	});
	el.addEventListener("pointerleave", () => {
		hovering = false;
	});

	const setExpanded = (v) => {
		el.dataset.state = v ? "expanded" : "collapsed";
		toggle.setAttribute("aria-expanded", v ? "true" : "false");
		app.layoutChanged();
	};
	toggle.addEventListener("click", (e) => {
		e.stopPropagation();
		setExpanded(el.dataset.state !== "expanded");
	});
	head.addEventListener("click", (e) => {
		if (!app.isPhone() || e.target.closest("button, a")) return;
		setExpanded(el.dataset.state !== "expanded");
	});
	close.addEventListener("click", () => hide(true));
	reopen.addEventListener("click", () => show());

	function show() {
		el.hidden = false;
		reopen.hidden = true;
		app.layoutChanged();
	}

	function hide(userClosed) {
		el.hidden = true;
		reopen.hidden = !userClosed;
		app.layoutChanged();
		if (userClosed) reopen.focus({ preventScroll: true });
	}

	function setHead(k, t, cargoText, detail) {
		kicker.textContent = k;
		title.textContent = t;
		cargo.replaceChildren();
		if (cargoText) {
			cargo.append(h("span", { class: "cargo" }, cargoText));
			if (detail) cargo.append(h("span", { class: "cargo-detail" }, detail));
		}
		cargo.hidden = !cargoText;
	}

	function delayBox(stops, uptoIndex) {
		if (!stops.some((s) => s.delay)) return null;
		let mid = 0;
		let min = 0;
		let max = 0;
		for (let i = 0; i <= uptoIndex && i < stops.length; i++) {
			const d = stops[i].delay;
			if (!d) continue;
			mid += d.mid;
			min += d.min;
			max += d.max;
		}
		const here = stops[uptoIndex]?.delay;
		return h(
			"div",
			{ class: "delay-box", "data-delay-total": String(mid), role: "status" },
			h("span", { class: "delay-label" }, "Delay so far"),
			h("span", { class: "delay-total" }, fmtMs(mid)),
			h("span", { class: "delay-range" }, `range ${fmtMs(min)} to ${fmtMs(max)}`),
			here && uptoIndex < stops.length ? h("span", { class: "delay-stop" }, `this stop adds ${here.min === here.max ? fmtMs(here.mid) : `${here.min}-${here.max} ms`}`) : null,
		);
	}

	function modeSwitch(ride) {
		if (!rideHasModes(ride)) return null;
		const seg = h("div", { class: "seg mode-switch", role: "group", "aria-label": "Software approach" });
		for (const [v, label] of [
			["classical", "Classical"],
			["learned", "Learned"],
		]) {
			const b = h("button", { type: "button", "data-mode": v, "aria-pressed": app.runner.mode === v ? "true" : "false" }, label);
			b.addEventListener("click", () => app.setMode(v));
			seg.append(b);
		}
		return h("div", { class: "panel-row" }, h("span", { class: "row-label" }, "Approach"), seg);
	}

	function conceptCard(id) {
		const c = app.content.concepts?.[id];
		if (!c) return null;
		const level = app.level();
		return h(
			"section",
			{ class: "card concept-card", "data-main-concept": id },
			h("div", { class: "card-kicker" }, "Concept"),
			h("h3", {}, conceptLink(app, id, c.title)),
			h("div", { class: "prose", html: level === "precise" ? c.precise : c.plain }),
			level === "plain" && c.analogyLimit ? h("div", { class: "analogy-limit prose" }, h("strong", {}, "Where the analogy breaks"), h("div", { html: c.analogyLimit })) : null,
		);
	}

	function readMore(stop) {
		const concepts = (stop.concepts ?? []).map((id) => app.content.concepts?.[id]).filter(Boolean);
		if (!concepts.length) return null;
		const d = h("details", { class: "read-more" }, h("summary", {}, "Read more"), h("div", { class: "read-more-body" }, concepts.map((c) => readMoreConcept(app, c))));
		d.open = readMoreOpen;
		d.addEventListener("toggle", () => {
			readMoreOpen = d.open;
		});
		return d;
	}

	function renderWelcome() {
		setHead("Welcome", "RoboTycoon");
		const cards = app.rideList.map((info) => {
			const ride = info.ride;
			const btn = info.available
				? h("button", { class: "btn primary", type: "button", "data-start-ride": info.id }, "Ride")
				: h("button", { class: "btn", type: "button", disabled: true }, "Opening soon");
			btn.addEventListener("click", () => app.router.go({ name: "ride", rideId: info.id }));
			return h(
				"section",
				{ class: "card ride-card" },
				h("h3", {}, h("span", { class: "ride-dot", style: { background: info.color } }), ride?.title ?? info.fallbackTitle),
				ride?.intro ? h("div", { class: "prose", html: app.level() === "precise" ? ride.intro.precise : ride.intro.plain }) : null,
				h("div", { style: { marginTop: "8px" } }, btn),
			);
		});
		const town = h("button", { class: "btn", type: "button" }, "Town map");
		town.addEventListener("click", () => app.router.go({ name: "town" }));
		const gloss = h("button", { class: "btn", type: "button" }, "Glossary");
		gloss.addEventListener("click", () => app.router.go({ name: "glossary" }));
		body.append(
			h("p", {}, "Ride carts through a robot factory park. Each ride follows one thing, and this panel explains what happens to it at every stop."),
			h("div", { class: "panel-row" }, levelSwitch(app)),
			h("div", { class: "ride-cards" }, cards),
			h("div", { class: "panel-row" }, town, gloss),
		);
	}

	function renderStop(i) {
		const r = app.runner;
		const ride = r.ride;
		const stop = r.stops[i];
		if (!ride || !stop) return renderWelcome();
		const level = app.level();
		setHead(`${ride.title} · Stop ${i + 1} of ${r.stops.length}`, stop.title, stop.cargo, stop.cargoDetail);
		body.dataset.stop = stop.id;
		const parts = [modeSwitch(ride), h("div", { class: "panel-row" }, levelSwitch(app))];
		if (i === 0 && ride.intro)
			parts.push(h("section", { class: "card ride-intro" }, h("div", { class: "card-kicker" }, "About this ride"), h("div", { class: "prose", html: level === "precise" ? ride.intro.precise : ride.intro.plain })));
		const mod = app.rides.get(ride.id)?.module;
		if (mod?.closeup) {
			const box = h("div", { class: "closeup" });
			parts.push(box);
			queueMicrotask(() => {
				// A second render in the same task already replaced this box: do not mount into it.
				if (!box.isConnected) return;
				try {
					cleanup = mod.closeup(stop.id, box, app.rideCtx(ride.id)) ?? null;
				} catch (e) {
					console.error(e);
					box.remove();
				}
			});
		}
		parts.push(h("div", { class: "prose stop-text", html: level === "precise" ? stop.precise : stop.plain }));
		parts.push(delayBox(r.stops, i));
		if (i > 0) parts.push(questionCard(app, ride, r.stops[i - 1], { kicker: "Quick check on the last stop" }));
		parts.push(conceptCard(stop.concepts?.[0]));
		if (stop.workbench) {
			const wb = app.workbench(stop.workbench);
			const b = h("button", { class: "btn block", type: "button", "data-workbench": stop.workbench, html: `${icon("tool")}<span></span>` });
			b.querySelector("span").textContent = `Open workbench: ${wb?.title ?? stop.workbench}`;
			b.addEventListener("click", () => app.router.go({ name: "workbench", id: stop.workbench }));
			parts.push(b);
		}
		parts.push(readMore(stop));
		body.append(...parts.filter(Boolean));
	}

	function renderFinish() {
		const r = app.runner;
		const ride = r.ride;
		if (!ride) return renderWelcome();
		const last = r.stops[r.stops.length - 1];
		setHead(ride.title, "Ride complete", last?.cargo, last?.cargoDetail);
		body.dataset.stop = "finish";
		const puzzleBtn = ride.puzzle ? h("button", { class: "btn primary", type: "button", "data-open-puzzle": ride.id }, `Open puzzle: ${ride.puzzle.title}`) : null;
		puzzleBtn?.addEventListener("click", () => app.openPuzzle(ride.id));
		const again = h("button", { class: "btn", type: "button" }, "Ride again");
		again.addEventListener("click", () => r.restart());
		const park = h("button", { class: "btn", type: "button" }, "Back to the park");
		park.addEventListener("click", () => app.router.go({ name: "park" }));
		const solved = app.state.puzzle(ride.id)?.solved;
		body.append(
			...[
				h("div", { class: "panel-row" }, levelSwitch(app)),
				delayBox(r.stops, r.stops.length - 1),
				questionCard(app, ride, last, { kicker: "Quick check on the last stop" }),
				h(
					"section",
					{ class: "card complete-card", "data-ride-complete": ride.id },
					h("div", { class: "card-kicker" }, "Ride complete"),
					h("h3", {}, ride.title),
					h("p", {}, solved ? "You finished this ride and solved its puzzle." : "You finished this ride. Try its puzzle to put the stops together."),
					h("div", { class: "btns" }, puzzleBtn, again, park),
				),
			].filter(Boolean),
		);
	}

	function render() {
		cleanup?.();
		cleanup = null;
		const keepScroll = body.scrollTop;
		const sameView = body.dataset.view === `${view.type}:${view.index ?? ""}`;
		body.replaceChildren();
		delete body.dataset.stop;
		if (view.type === "stop") renderStop(view.index);
		else if (view.type === "finish") renderFinish();
		else renderWelcome();
		body.dataset.view = `${view.type}:${view.index ?? ""}`;
		body.scrollTop = sameView ? keepScroll : 0;
	}

	function showView(v, { reveal = true } = {}) {
		view = v;
		render();
		if (reveal) show();
	}

	return {
		el,
		showWelcome: () => showView({ type: "welcome" }),
		showStop: (i) => showView({ type: "stop", index: i }),
		showFinish: () => showView({ type: "finish" }),
		refresh: render,
		show,
		hide,
		setExpanded,
		isHovered: () => hovering,
		get view() {
			return view;
		},
	};
}
