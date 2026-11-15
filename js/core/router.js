// Hash routes:
//   #/ride/<rideId>[/<stopId>]  #/workbench/<id>  #/town[/<districtId>]  #/showroom
//   #/concept/<id>  #/glossary   (and "#concept/<id>", the form generated content links use)
// Workbench, concept, and glossary are overlays: they open on top of the current base view.

export function parseHash(hash) {
	const parts = String(hash ?? "")
		.replace(/^#\/?/, "")
		.split("/")
		.filter(Boolean)
		.map((p) => {
			try {
				return decodeURIComponent(p);
			} catch {
				return p;
			}
		});
	switch (parts[0]) {
		case "ride":
			return parts[1] ? { name: "ride", rideId: parts[1], stopId: parts[2] ?? null } : { name: "park" };
		case "workbench":
			return { name: "workbench", id: parts[1] ?? "", overlay: true };
		case "concept":
			return { name: "concept", id: parts[1] ?? "", overlay: true };
		case "glossary":
			return { name: "glossary", overlay: true };
		case "town":
			return { name: "town", districtId: parts[1] ?? null };
		case "showroom":
			return { name: "showroom" };
		default:
			return { name: "park" };
	}
}

export function hashFor(route) {
	switch (route.name) {
		case "ride":
			return `#/ride/${route.rideId}${route.stopId ? `/${route.stopId}` : ""}`;
		case "workbench":
			return `#/workbench/${route.id}`;
		case "concept":
			return `#/concept/${route.id}`;
		case "glossary":
			return "#/glossary";
		case "town":
			return `#/town${route.districtId ? `/${route.districtId}` : ""}`;
		case "showroom":
			return "#/showroom";
		default:
			return "#/";
	}
}

export class Router {
	/** @param {(route: object, prev: object|null) => void} onRoute */
	constructor(onRoute) {
		this.onRoute = onRoute;
		this.current = null;
		this.base = { name: "park" };
		window.addEventListener("hashchange", () => this.handle());
	}

	start() {
		this.handle();
	}

	handle() {
		const route = parseHash(location.hash);
		const prev = this.current;
		this.current = route;
		if (!route.overlay) this.base = route;
		this.onRoute(route, prev);
	}

	/** Navigate (adds a history entry). */
	go(route) {
		const hash = typeof route === "string" ? route : hashFor(route);
		if (location.hash === hash) this.handle();
		else location.hash = hash;
	}

	/** Update the address bar without running route handlers (for example, the cart reached a stop). */
	replaceSilently(route) {
		const hash = hashFor(route);
		this.current = route;
		if (!route.overlay) this.base = route;
		try {
			history.replaceState(null, "", hash);
		} catch {
			// Some sandboxed frames refuse replaceState; the route still works in memory.
		}
	}

	/** Close the current overlay and return to the base view. */
	closeOverlay() {
		if (!this.current?.overlay) return;
		const prev = this.current;
		this.current = this.base;
		try {
			history.replaceState(null, "", hashFor(this.base));
		} catch {
			// ignore
		}
		this.onRoute(this.base, prev);
	}
}
