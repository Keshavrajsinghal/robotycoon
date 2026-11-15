// Modal dialogs: focus moves into the dialog, Tab stays inside, Escape closes the top dialog,
// and focus returns to whatever opened it.

import { focusables, h, trapFocus } from "../core/dom.js";
import { icon } from "./icons.js";

const stack = [];
let seq = 0;

/**
 * Open a modal. opts: { title, className, onClose(reason) }.
 * Returns { el, body, foot(), setTitle(text), close(reason), focusFirst() }.
 */
export function openModal({ title, className = "", onClose, kind = "" }) {
	const root = document.getElementById("modal-root");
	const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
	const titleId = `modal-title-${++seq}`;
	const titleEl = h("h2", { id: titleId }, title ?? "");
	const closeBtn = h("button", { class: "icon-btn", type: "button", "aria-label": "Close", html: icon("close") });
	const head = h("div", { class: "modal-head" }, titleEl, closeBtn);
	const body = h("div", { class: "modal-body" });
	const dialog = h("div", { class: `modal ${className}`, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, tabindex: "-1" }, head, body);
	const backdrop = h("div", { class: "modal-backdrop" }, dialog);
	let footEl = null;
	let closed = false;
	const untrap = trapFocus(dialog);
	const api = {
		kind,
		el: dialog,
		body,
		titleEl,
		foot() {
			if (!footEl) {
				footEl = h("div", { class: "modal-foot" });
				dialog.append(footEl);
			}
			return footEl;
		},
		setTitle(t) {
			titleEl.textContent = t;
		},
		close(reason = "button") {
			if (closed) return;
			closed = true;
			untrap();
			backdrop.remove();
			const i = stack.indexOf(api);
			if (i >= 0) stack.splice(i, 1);
			onClose?.(reason);
			if (!stack.length && opener && document.contains(opener)) opener.focus({ preventScroll: true });
		},
		focusFirst() {
			(focusables(body)[0] ?? closeBtn).focus({ preventScroll: true });
		},
		get closed() {
			return closed;
		},
	};
	closeBtn.addEventListener("click", () => api.close("button"));
	backdrop.addEventListener("pointerdown", (e) => {
		if (e.target === backdrop) api.close("backdrop");
	});
	root.append(backdrop);
	stack.push(api);
	closeBtn.focus({ preventScroll: true });
	return api;
}

export function topModal() {
	return stack[stack.length - 1] ?? null;
}

export function modalOpen() {
	return stack.length > 0;
}

/** Close modals of one kind (or all) without treating it as a user action. */
export function closeModals(kind, reason = "route") {
	for (const m of [...stack].reverse()) if (!kind || m.kind === kind) m.close(reason);
}
