// Glossary modal with a search box.

import { h } from "../core/dom.js";
import { openModal } from "./modal.js";

export function openGlossary(app, onClose) {
	const m = openModal({ title: "Glossary", className: "glossary-modal", kind: "route", onClose });
	const entries = app.content.glossary ?? [];
	const input = h("input", { class: "search", type: "search", placeholder: "Search terms", "aria-label": "Search the glossary", autocomplete: "off" });
	const count = h("p", { class: "meta-line", role: "status" });
	const list = h("dl", { class: "glossary-list" });
	const items = entries.map((g) => {
		const dt = h("dt", {}, g.term);
		// g.refs are the [[id]] links already rendered inside g.html, so no extra links are added.
		const dd = h("dd", { class: "prose", html: g.html });
		list.append(dt, dd);
		return { g, dt, dd, text: `${g.term} ${dd.textContent}`.toLowerCase() };
	});
	const empty = h("p", { class: "empty", hidden: true }, "No matching terms.");
	const filter = () => {
		const q = input.value.trim().toLowerCase();
		let n = 0;
		for (const it of items) {
			const show = !q || it.text.includes(q);
			it.dt.hidden = !show;
			it.dd.hidden = !show;
			if (show) n++;
		}
		empty.hidden = n > 0 || !entries.length;
		count.textContent = `${n} of ${entries.length} terms`;
	};
	input.addEventListener("input", filter);
	m.body.append(input, count, list, empty);
	if (!entries.length) m.body.append(h("p", { class: "empty" }, "The glossary has not been written yet."));
	filter();
	input.focus({ preventScroll: true });
	return m;
}
