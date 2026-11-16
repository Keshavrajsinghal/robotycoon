// Small DOM helpers.

/**
 * h("button", { class: "x", onclick: fn, "aria-label": "Close" }, "text", childNode)
 * Attributes starting with "on" become listeners; html sets innerHTML (trusted generated content).
 */
export function h(tag, attrs = {}, ...children) {
	const el = document.createElement(tag);
	for (const [k, v] of Object.entries(attrs ?? {})) {
		if (v === undefined || v === null || v === false) continue;
		if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
		else if (k === "class") el.className = v;
		else if (k === "html") el.innerHTML = v;
		else if (k === "dataset") Object.assign(el.dataset, v);
		else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
		else if (v === true) el.setAttribute(k, "");
		else el.setAttribute(k, String(v));
	}
	for (const c of children.flat()) {
		if (c === undefined || c === null || c === false) continue;
		el.append(c instanceof Node ? c : document.createTextNode(String(c)));
	}
	return el;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/**
 * True when a dynamic import() failed because the file could not be fetched (an expected 404
 * for a ride or workbench still being built). A TypeError thrown by the module's own code
 * returns false, so real bugs still reach the console. Messages: Chrome, Firefox, Safari.
 */
export function isMissingModule(e) {
	return e instanceof TypeError && /dynamically imported module|Importing a module script failed|Failed to fetch/i.test(String(e.message));
}

/**
 * Add a stylesheet once (ride, workbench, and town modules keep their own CSS in
 * css/modules/<name>.css). Resolves when loaded; repeated calls reuse the same link.
 */
export function loadCss(href) {
	const url = new URL(href, document.baseURI).href;
	const existing = [...document.querySelectorAll('link[rel="stylesheet"]')].find((l) => l.href === url);
	if (existing) return existing._loaded ?? Promise.resolve();
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = url;
	link._loaded = new Promise((res) => {
		link.onload = res;
		link.onerror = res;
	});
	document.head.append(link);
	return link._loaded;
}

/** Plain text from an HTML string (for aria labels and titles). */
export function textOf(html) {
	const d = document.createElement("div");
	d.innerHTML = html ?? "";
	return d.textContent ?? "";
}

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

export function focusables(root) {
	return [...root.querySelectorAll(FOCUSABLE)].filter((el) => !el.closest("[hidden]") && el.offsetParent !== null);
}

/** Keep Tab focus inside root. Returns a cleanup function. */
export function trapFocus(root) {
	const onKey = (e) => {
		if (e.key !== "Tab") return;
		const f = focusables(root);
		if (!f.length) {
			e.preventDefault();
			return;
		}
		const first = f[0];
		const last = f[f.length - 1];
		if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) {
			e.preventDefault();
			first.focus();
		}
	};
	root.addEventListener("keydown", onKey);
	return () => root.removeEventListener("keydown", onKey);
}
