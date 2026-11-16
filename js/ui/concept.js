// Concept details: the "Read more" sections in the stop panel and the full concept view modal.

import { h } from "../core/dom.js";
import { openModal } from "./modal.js";

const prose = (html) => h("div", { class: "prose", html });

function section(title, child) {
	if (!child) return null;
	return h("div", { class: "section" }, h("h4", {}, title), child);
}

function specsTable(c) {
	return c.specs?.html ? h("div", { class: "table-wrap prose", html: c.specs.html }) : null;
}

function sourcesList(c) {
	if (!c.sources?.length) return null;
	const ol = h("ol", { class: "sources" });
	for (const s of c.sources)
		ol.append(h("li", { value: String(s.n) }, h("a", { href: s.url, target: "_blank", rel: "noopener" }, s.title), s.note ? h("span", { html: ` — ${s.note}` }) : null));
	return ol;
}

export function conceptLink(app, id, text) {
	return h("a", { class: "concept-link", href: `#/concept/${id}`, "data-concept": id }, text ?? app.conceptTitle(id));
}

/** The deeper sections shown under "Read more" and in the concept view. */
export function deepSections(app, c) {
	const connects = c.connects?.length
		? h(
				"ul",
				{ class: "prose" },
				c.connects.map((x) => h("li", {}, conceptLink(app, x.id), h("span", { html: ` — ${x.html}` }))),
			)
		: null;
	const myth = c.misconception
		? h("div", {}, h("div", { class: "myth prose", html: `<strong>Misconception:</strong> ${c.misconception.myth}` }), h("div", { class: "reality prose", html: `<strong>Reality:</strong> ${c.misconception.reality}` }))
		: null;
	return [
		section("On the cheese plate line", c.cheese && prose(c.cheese)),
		section("Another example", c.elsewhere && prose(c.elsewhere)),
		section("Why it exists", c.why && prose(c.why)),
		section("Connects to", connects),
		section("Real products and tools", c.products && prose(c.products)),
		section("Common misconception", myth),
		section("Key numbers", c.keyNumbers && prose(c.keyNumbers)),
		section("Typical specs", specsTable(c)),
		section("Code sketch", c.code?.html && prose(c.code.html)),
		section("Sources", sourcesList(c)),
	].filter(Boolean);
}

/** "N claims in this concept could not be confirmed", or null. Flags inside the text show inline too. */
function unverifiedNote(c) {
	if (!c.unverified) return null;
	return h("p", { class: "meta-line", "data-unverified": String(c.unverified) }, h("span", { class: "flag-unverified" }, "unverified"), ` ${c.unverified} claim${c.unverified === 1 ? "" : "s"} in this concept could not be confirmed.`);
}

/** One linked concept inside the stop panel's "Read more". */
export function readMoreConcept(app, c) {
	return h("article", { class: "concept-detail", "data-concept-detail": c.id }, h("h3", {}, conceptLink(app, c.id, c.title)), unverifiedNote(c), ...deepSections(app, c));
}

function industrySections(app, c) {
	const ind = c.industry;
	if (!ind) return [];
	const roles = ind.roles?.length ? h("ul", { class: "prose" }, ind.roles.map((r) => h("li", {}, h("strong", {}, r.name), h("span", { html: ` — ${r.html}` })))) : null;
	return [
		section("Sells", ind.sells && prose(ind.sells)),
		section("Buys from", ind.buysFrom && prose(ind.buysFrom)),
		section("Sells to", ind.sellsTo && prose(ind.sellsTo)),
		section("Job functions", roles),
		section("Example companies", ind.companies && prose(ind.companies)),
	].filter(Boolean);
}

/** Full concept view. Returns the modal. */
export function openConcept(app, id, onClose) {
	const c = app.content.concepts?.[id];
	const m = openModal({ title: c?.title ?? app.conceptTitle(id), className: "concept-modal", kind: "route", onClose });
	if (!c) {
		m.body.append(h("p", { class: "empty" }, "This concept has not been written yet."));
		return m;
	}
	const area = app.content.areas?.find((a) => a.area === c.area);
	m.body.append(
		h("p", { class: "meta-line" }, area ? `Area ${c.area}: ${area.title}` : `Area ${c.area}`, c.aka?.length ? ` · Also called: ${c.aka.join(", ")}` : ""),
	);
	if (c.requires?.length)
		m.body.append(
			h(
				"p",
				{ class: "meta-line" },
				"Builds on: ",
				...c.requires.flatMap((r, i) => [i ? ", " : "", conceptLink(app, r)]),
			),
		);
	const note = unverifiedNote(c);
	if (note) m.body.append(note);
	m.body.append(
		h("div", { class: "card" }, h("div", { class: "card-kicker" }, "Plain"), prose(c.plain), c.analogyLimit ? h("div", { class: "analogy-limit prose" }, h("strong", {}, "Where the analogy breaks"), h("div", { html: c.analogyLimit })) : null),
		h("div", { class: "card" }, h("div", { class: "card-kicker" }, "Precise"), prose(c.precise)),
		...deepSections(app, c),
		...industrySections(app, c),
	);
	return m;
}
