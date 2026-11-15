// Persisted preferences and progress. Every localStorage access is wrapped in try/catch:
// private windows and blocked storage must never break the site.

import { bus } from "./events.js";

const KEY = "robotycoon.v1";

const DEFAULTS = {
	level: "plain", // "plain" | "precise"
	follow: true,
	labels: true,
	reduceMotion: null, // null follows the system setting; true/false is the in-app override
	speed: 1,
	seen: {}, // "rideId/stopId" -> true
	answers: {}, // "rideId/stopId" -> { choice, correct }
	puzzles: {}, // rideId -> { solved, attempts }
	workbenches: {}, // workbench id -> { solved }
	modes: {}, // rideId -> "classical" | "learned"
};

function load() {
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return {};
		const v = JSON.parse(raw);
		return v && typeof v === "object" ? v : {};
	} catch {
		return {};
	}
}

const data = { ...structuredClone(DEFAULTS), ...load() };

function save() {
	try {
		window.localStorage.setItem(KEY, JSON.stringify(data));
	} catch {
		// Storage unavailable or full: keep working in memory.
	}
}

const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
motionQuery?.addEventListener?.("change", () => bus.emit("motion", reducedMotion()));

/** The system prefers-reduced-motion setting, ignoring the in-app override. */
export function systemReducedMotion() {
	return !!motionQuery?.matches;
}

/** Effective reduced-motion setting: the in-app override, else the system preference. */
export function reducedMotion() {
	if (data.reduceMotion === true || data.reduceMotion === false) return data.reduceMotion;
	return systemReducedMotion();
}

export const state = {
	get(key) {
		return data[key];
	},
	set(key, value) {
		data[key] = value;
		save();
		bus.emit("prefs", key, value);
		if (key === "reduceMotion") bus.emit("motion", reducedMotion());
	},
	markSeen(rideId, stopId) {
		const k = `${rideId}/${stopId}`;
		if (data.seen[k]) return false;
		data.seen[k] = true;
		save();
		bus.emit("progress");
		return true;
	},
	isSeen(rideId, stopId) {
		return !!data.seen[`${rideId}/${stopId}`];
	},
	answer(rideId, stopId) {
		return data.answers[`${rideId}/${stopId}`] ?? null;
	},
	setAnswer(rideId, stopId, value) {
		data.answers[`${rideId}/${stopId}`] = value;
		save();
		bus.emit("progress");
	},
	puzzle(rideId) {
		return data.puzzles[rideId] ?? null;
	},
	setPuzzle(rideId, value) {
		data.puzzles[rideId] = { ...(data.puzzles[rideId] ?? {}), ...value };
		save();
		bus.emit("progress");
	},
	workbench(id) {
		return data.workbenches[id] ?? null;
	},
	setWorkbench(id, value) {
		data.workbenches[id] = { ...(data.workbenches[id] ?? {}), ...value };
		save();
		bus.emit("progress");
	},
	reset() {
		Object.assign(data, structuredClone(DEFAULTS));
		save();
		bus.emit("progress");
	},
};
