// Tiny event emitter and the app-wide bus.

export class Emitter {
	constructor() {
		this.handlers = new Map();
	}

	/** Subscribe; returns an unsubscribe function. */
	on(type, fn) {
		if (!this.handlers.has(type)) this.handlers.set(type, new Set());
		this.handlers.get(type).add(fn);
		return () => this.off(type, fn);
	}

	off(type, fn) {
		this.handlers.get(type)?.delete(fn);
	}

	emit(type, ...args) {
		for (const fn of [...(this.handlers.get(type) ?? [])]) {
			try {
				fn(...args);
			} catch (e) {
				console.error(e);
			}
		}
	}
}

/** App-wide bus. Events: "prefs" (key, value), "progress", "route" (route). */
export const bus = new Emitter();
