// Question card for a ride stop: answer once (recorded), then every option shows why it is
// right or wrong. Later clicks only highlight; the first answer stays recorded.

import { h } from "../core/dom.js";

export function questionCard(app, ride, stop, opts = {}) {
	const q = stop?.question;
	if (!q) return null;
	const saved = app.state.answer(ride.id, stop.id);
	const optionsEl = h("div", { class: "q-options", role: "group", "aria-label": "Answers" });
	const result = h("p", { class: "q-result", role: "status" });
	const card = h(
		"section",
		{ class: "card question-card", "data-question": stop.id, "aria-label": `Quick check: ${stop.title}` },
		h("div", { class: "card-kicker" }, opts.kicker ?? "Quick check"),
		h("h3", {}, stop.title),
		h("div", { class: "prose q-prompt", html: q.prompt }),
		optionsEl,
		result,
	);
	const buttons = q.options.map((o, i) => {
		const b = h(
			"button",
			{ class: "q-option", type: "button", "data-index": String(i), "data-correct": o.correct ? "true" : "false" },
			h("span", { class: "q-verdict" }),
			h("span", { class: "q-text", html: o.text }),
			h("span", { class: "q-why", hidden: true, html: o.why }),
		);
		b.addEventListener("click", () => choose(i));
		optionsEl.append(b);
		return b;
	});

	function reveal(chosen, focus) {
		buttons.forEach((b, j) => {
			const o = q.options[j];
			b.classList.toggle("correct", o.correct);
			b.classList.toggle("wrong", !o.correct && j === chosen);
			b.classList.toggle("chosen", j === chosen);
			b.querySelector(".q-verdict").textContent = o.correct ? "Right" : "Not right";
			b.querySelector(".q-why").hidden = false;
			b.setAttribute("aria-pressed", j === chosen ? "true" : "false");
		});
		card.classList.add("answered");
		const ok = q.options[chosen]?.correct;
		result.textContent = ok ? "You got it." : "Not quite. The right answer is marked.";
		if (focus !== undefined) buttons[focus]?.focus({ preventScroll: true });
	}

	function choose(i) {
		const prev = app.state.answer(ride.id, stop.id);
		if (prev) {
			// Already answered: keep the record, just move focus to the clicked option.
			buttons[i].classList.add("looked");
			return;
		}
		app.state.setAnswer(ride.id, stop.id, { choice: i, correct: !!q.options[i].correct });
		reveal(i, i);
	}

	if (saved) reveal(saved.choice);
	return card;
}
