// Workbench host: a large modal on desktop, full screen on phones. Shows the workbench text
// from content and mounts js/workbenches/<id>.js (default export { id, mount(el, ctx) }).
// A missing module shows "This workbench is being built" instead of failing.

import { h, isMissingModule } from "../core/dom.js";
import { openModal } from "../ui/modal.js";
import { levelSwitch } from "../ui/panel.js";

const KNOWN = new Set(["wb1-dof", "wb2-ik", "wb3-control", "wb4-calibration", "wb5-teleop", "wb6-line-balancing"]);

export function openWorkbench(app, id, onClose) {
	const wb = app.workbench(id);
	let instance = null;
	let unsubLevel = null;
	let unsubMotion = null;
	const m = openModal({
		title: wb?.title ?? "Workbench",
		className: "wide workbench-modal",
		kind: "route",
		onClose: (reason) => {
			try {
				instance?.destroy?.();
			} catch (e) {
				console.error(e);
			}
			unsubLevel?.();
			unsubMotion?.();
			onClose?.(reason);
		},
	});
	m.el.dataset.workbench = id;
	if (!wb) {
		m.body.append(h("p", { class: "empty" }, "This workbench has not been written yet."));
		return m;
	}
	const textEl = h("div", { class: "prose wb-level-text" });
	const renderText = () => {
		textEl.innerHTML = app.level() === "precise" ? wb.precise : wb.plain;
		for (const b of m.body.querySelectorAll(".level-switch button")) b.setAttribute("aria-pressed", b.dataset.level === app.level() ? "true" : "false");
	};
	const mount = h("div", { class: "wb-mount", "data-wb-mount": id }, h("div", { class: "wb-missing" }, "Loading..."));
	const card = (title, html) => h("section", { class: "card" }, h("div", { class: "card-kicker" }, title), h("div", { class: "prose", html }));
	m.body.append(
		h(
			"div",
			{ class: "wb-layout" },
			h("div", { class: "wb-text" }, card("Goal", wb.goal), h("div", { class: "panel-row" }, levelSwitch(app)), textEl, card("How to use", wb.howTo), card("What to notice", wb.notice)),
			mount,
		),
	);
	renderText();
	unsubLevel = app.bus.on("prefs", (key) => {
		if (key === "level") renderText();
	});

	const ctx = {
		wb,
		content: app.content,
		state: app.state,
		get reducedMotion() {
			return app.reducedMotion();
		},
		level: () => app.level(),
		onSolved: () => {
			app.state.setWorkbench(id, { solved: true });
			m.el.dataset.solved = "true";
		},
		onMotionChange: null,
	};
	unsubMotion = app.bus.on("motion", (v) => ctx.onMotionChange?.(v));

	const missing = () => mount.replaceChildren(h("div", { class: "wb-missing", "data-wb-missing": id }, "This workbench is being built."));
	if (!KNOWN.has(id)) {
		missing();
		return m;
	}
	import(`./${id}.js`).then(
		(mod) => {
			if (m.closed) return;
			try {
				const def = mod.default;
				if (!def?.mount) throw new Error(`workbench ${id} has no default export with mount()`);
				mount.replaceChildren();
				instance = def.mount(mount, ctx) ?? null;
				mount.dataset.loaded = "true";
			} catch (e) {
				// A bug in the module: log it and say so, rather than pretending the file is missing.
				console.error(e);
				mount.replaceChildren(h("div", { class: "wb-missing", "data-wb-error": id }, "This workbench could not start."));
			}
		},
		(e) => {
			if (!isMissingModule(e)) console.error(e);
			if (!m.closed) missing();
		},
	);
	return m;
}
