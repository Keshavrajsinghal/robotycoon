// Puzzle modal: choice, match, order, and budget (see knowledge/FORMAT.md for the data shapes).
// Every check explains why each answer is right or wrong.

import { h, textOf } from "../core/dom.js";
import { icon } from "./icons.js";
import { openModal } from "./modal.js";

function shuffleNotSorted(n, seed) {
	const idx = Array.from({ length: n }, (_, i) => i);
	let s = seed || 1;
	const rand = () => {
		s = (s * 16807) % 2147483647;
		return s / 2147483647;
	};
	for (let tries = 0; tries < 20; tries++) {
		for (let i = n - 1; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			[idx[i], idx[j]] = [idx[j], idx[i]];
		}
		if (idx.some((v, i) => v !== i)) return idx;
	}
	return idx.reverse();
}

const fmt = (n) => (Math.round(n * 10) / 10).toLocaleString("en-US");

function choicePuzzle(data) {
	let chosen = -1;
	const buttons = data.options.map((o, i) =>
		h("button", { class: "p-option", type: "button", "aria-pressed": "false", "data-index": String(i) }, h("span", { html: o.text }), h("span", { class: "p-why", hidden: true, html: o.why })),
	);
	buttons.forEach((b, i) =>
		b.addEventListener("click", () => {
			chosen = i;
			buttons.forEach((x, j) => {
				x.setAttribute("aria-pressed", j === i ? "true" : "false");
				x.classList.remove("correct", "wrong");
				x.querySelector(".p-why").hidden = true;
			});
		}),
	);
	return {
		el: h("div", { class: "p-choice", role: "group", "aria-label": "Options" }, buttons),
		check() {
			if (chosen < 0) return { solved: false, message: "Choose an option first." };
			const ok = data.options[chosen].correct;
			const b = buttons[chosen];
			b.classList.add(ok ? "correct" : "wrong");
			b.querySelector(".p-why").hidden = false;
			return { solved: ok, message: ok ? "Correct." : "Not this one. Read why, then try another." };
		},
	};
}

function matchPuzzle(data) {
	const rows = data.rows.map((row, i) => {
		const select = h(
			"select",
			{ "aria-label": `Choice for ${textOf(row.item)}`, "data-row": String(i) },
			h("option", { value: "" }, "Choose..."),
			data.options.map((o) => h("option", { value: o.id }, textOf(o.label))),
		);
		const why = h("span", { class: "p-why", hidden: true });
		const el = h("div", { class: "p-row", "data-row": String(i) }, h("div", { class: "p-item-label", html: row.item }), select, why);
		select.addEventListener("change", () => {
			el.classList.remove("correct", "wrong");
			why.hidden = true;
		});
		return { row, select, why, el };
	});
	return {
		el: h("div", { class: "p-rows" }, rows.map((r) => r.el)),
		check() {
			let right = 0;
			let missing = 0;
			for (const r of rows) {
				const v = r.select.value;
				r.el.classList.remove("correct", "wrong");
				if (!v) {
					missing++;
					r.why.hidden = true;
					continue;
				}
				const ok = v === r.row.answer;
				if (ok) right++;
				r.el.classList.add(ok ? "correct" : "wrong");
				r.why.innerHTML = `<strong>${ok ? "Right" : "Not right"}:</strong> ${r.row.why[v] ?? ""}`;
				r.why.hidden = false;
			}
			if (missing) return { solved: false, message: `Choose an option for every row (${missing} left).` };
			const solved = right === rows.length;
			return { solved, message: solved ? "All matched." : `${right} of ${rows.length} right. Read why for the others and try again.` };
		},
	};
}

function orderPuzzle(data, seed) {
	let order = shuffleNotSorted(data.items.length, seed);
	const list = h("ol", { class: "p-items", "aria-label": "Items in your order" });
	const status = new Map(); // item index -> "correct" | "wrong"
	const render = (focus) => {
		list.replaceChildren();
		order.forEach((itemIdx, pos) => {
			const it = data.items[itemIdx];
			const label = textOf(it.label);
			const up = h("button", { class: "icon-btn", type: "button", "aria-label": `Move ${label} up`, disabled: pos === 0, html: icon("up") });
			const down = h("button", { class: "icon-btn", type: "button", "aria-label": `Move ${label} down`, disabled: pos === order.length - 1, html: icon("down") });
			up.addEventListener("click", () => move(pos, -1, "up"));
			down.addEventListener("click", () => move(pos, 1, "down"));
			const st = status.get(itemIdx);
			const why = st === "wrong" ? h("span", { class: "p-why", html: `<strong>Belongs at position ${itemIdx + 1}:</strong> ${it.why}` }) : st === "correct" ? h("span", { class: "p-why", html: it.why }) : null;
			const li = h("li", { class: `p-item${st ? ` ${st}` : ""}`, "data-item": it.id }, h("span", { class: "p-pos" }, String(pos + 1)), h("span", { html: it.label }), h("span", { class: "p-item-btns" }, up, down), why);
			list.append(li);
			if (focus && focus.item === itemIdx) (focus.dir === "up" ? (pos === 0 ? down : up) : pos === order.length - 1 ? up : down).focus();
		});
	};
	const move = (pos, d, dir) => {
		const to = pos + d;
		if (to < 0 || to >= order.length) return;
		const item = order[pos];
		order = [...order];
		[order[pos], order[to]] = [order[to], order[pos]];
		status.clear();
		render({ item, dir });
	};
	render();
	return {
		el: list,
		check() {
			let right = 0;
			order.forEach((itemIdx, pos) => {
				const ok = itemIdx === pos;
				status.set(itemIdx, ok ? "correct" : "wrong");
				if (ok) right++;
			});
			render();
			const solved = right === order.length;
			return { solved, message: solved ? "That is the right order." : `${right} of ${order.length} in the right place. The misplaced ones say where they belong.` };
		},
		/** Test hook: put the items in the given order of indexes. */
		_set(o) {
			order = o;
			status.clear();
			render();
		},
	};
}

function budgetPuzzle(data) {
	const unit = data.unit ?? "points";
	const chosen = new Set();
	const stat = (k) => {
		const v = h("span", { class: "v" });
		const el = h("div", { class: "p-stat" }, h("span", { class: "k" }, k), v);
		return { el, v };
	};
	const sSaved = stat("Time saved");
	const sResult = stat("Result");
	const sCost = stat("Cost");
	const cards = data.options.map((o, i) => {
		const why = h("span", { class: "p-why", hidden: true, html: o.why });
		const b = h(
			"button",
			{ class: "p-budget-opt", type: "button", "aria-pressed": "false", "data-option": o.id },
			h("span", { class: "check", "aria-hidden": "true" }),
			h("span", { html: o.label }),
			h("span", { class: "nums" }, `saves ${fmt(o.saves_ms)} ms`, h("br"), `cost ${fmt(o.cost)} ${unit}`),
			why,
		);
		b.addEventListener("click", () => {
			if (chosen.has(i)) chosen.delete(i);
			else chosen.add(i);
			b.setAttribute("aria-pressed", chosen.has(i) ? "true" : "false");
			for (const c of cards) c.why.hidden = true;
			update();
		});
		return { b, why, o };
	});
	const totals = () => {
		let saved = 0;
		let cost = 0;
		for (const i of chosen) {
			saved += data.options[i].saves_ms;
			cost += data.options[i].cost;
		}
		return { saved, cost, result: data.start_ms - saved };
	};
	const update = () => {
		const t = totals();
		sSaved.v.textContent = `${fmt(t.saved)} ms`;
		sResult.v.textContent = `${fmt(t.result)} ms`;
		sResult.el.className = `p-stat ${t.result <= data.target_ms ? "ok" : ""}`;
		sResult.el.querySelector(".k").textContent = `Result (target ${fmt(data.target_ms)} ms)`;
		sCost.v.textContent = `${fmt(t.cost)} / ${fmt(data.budget)}`;
		sCost.el.className = `p-stat ${t.cost > data.budget ? "over" : "ok"}`;
		sCost.el.querySelector(".k").textContent = `Cost (${unit})`;
	};
	update();
	return {
		el: h(
			"div",
			{},
			h("p", { class: "meta-line" }, `Starting at ${fmt(data.start_ms)} ms.`),
			h("div", { class: "p-budget-stats", "aria-live": "polite" }, sSaved.el, sResult.el, sCost.el),
			h("div", { class: "p-budget-opts", style: { marginTop: "12px" } }, cards.map((c) => c.b)),
		),
		check() {
			const t = totals();
			if (!chosen.size) return { solved: false, message: "Choose at least one option first." };
			for (const c of cards) c.why.hidden = !chosen.has(cards.indexOf(c));
			const targetMet = t.result <= data.target_ms;
			const budgetMet = t.cost <= data.budget;
			const solved = targetMet && budgetMet;
			const parts = [targetMet ? `Target met (${fmt(t.result)} ms).` : `Target missed: ${fmt(t.result)} ms is above ${fmt(data.target_ms)} ms.`, budgetMet ? "Within budget." : `Over budget by ${fmt(t.cost - data.budget)} ${unit}.`];
			return { solved, message: parts.join(" ") };
		},
	};
}

/** Open the puzzle for a ride. Returns the modal. */
export function openPuzzle(app, rideId) {
	const ride = app.content.rides?.find((r) => r.id === rideId);
	const p = ride?.puzzle;
	const m = openModal({
		title: p?.title ?? "Puzzle",
		className: "puzzle-modal",
		kind: "puzzle",
		onClose: () => {
			// The ride-complete card behind says whether the puzzle is solved: redraw it, and keep
			// keyboard focus on its (new) puzzle button.
			if (m.el.dataset.solved !== "true" || app.panel?.view.type !== "finish") return;
			app.panel.refresh();
			document.querySelector(`#panel [data-open-puzzle="${rideId}"]`)?.focus({ preventScroll: true });
		},
	});
	m.el.dataset.puzzle = rideId;
	if (!p) {
		m.body.append(h("p", { class: "empty" }, "This puzzle has not been written yet."));
		return m;
	}
	m.el.dataset.type = p.type;
	const seed = [...rideId].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) % 2147483647;
	const impl = p.type === "choice" ? choicePuzzle(p.data) : p.type === "match" ? matchPuzzle(p.data) : p.type === "order" ? orderPuzzle(p.data, seed) : p.type === "budget" ? budgetPuzzle(p.data) : null;
	const status = h("p", { class: "puzzle-status", role: "status", "aria-live": "polite" });
	const debrief = h("div", { class: "card debrief", hidden: true }, h("div", { class: "card-kicker" }, "Debrief"), h("div", { class: "prose", html: p.debrief }));
	m.body.append(h("div", { class: "prose", html: p.prompt }), impl ? impl.el : h("p", { class: "empty" }, `Unknown puzzle type: ${p.type}`), status, debrief);
	const checkBtn = h("button", { class: "btn primary", type: "button", "data-action": "check" }, "Check");
	const closeBtn = h("button", { class: "btn", type: "button" }, "Close");
	closeBtn.addEventListener("click", () => m.close("button"));
	checkBtn.addEventListener("click", () => {
		if (!impl) return;
		const res = impl.check();
		const prev = app.state.puzzle(rideId);
		app.state.setPuzzle(rideId, { attempts: (prev?.attempts ?? 0) + 1, ...(res.solved ? { solved: true } : {}) });
		status.textContent = res.message;
		status.className = `puzzle-status ${res.solved ? "good" : "bad"}`;
		if (res.solved) {
			debrief.hidden = false;
			m.el.dataset.solved = "true";
			debrief.scrollIntoView?.({ block: "nearest" });
		} else {
			// The message sits under the options, often below the fold on a phone.
			status.scrollIntoView?.({ block: "nearest" });
		}
	});
	m.foot().append(closeBtn, checkBtn);
	m.impl = impl;
	return m;
}
