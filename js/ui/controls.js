// Bottom control bar: restart, step back, play/pause, step forward, speed.

import { $, h } from "../core/dom.js";
import { icon } from "./icons.js";

export function initControls(app) {
	const bar = $("#controls");
	const mk = (act, label, html, cls = "") => {
		const b = h("button", { type: "button", class: cls, "data-act": act, "aria-label": label, title: label, html });
		bar.append(b);
		return b;
	};
	const restart = mk("restart", "Restart ride", icon("restart"));
	const back = mk("back", "Step back", icon("back"));
	const play = mk("play", "Play", icon("play"), "play");
	const fwd = mk("forward", "Step forward", icon("forward"));
	const speed = mk("speed", "Speed 1x", "1x", "speed");
	const r = app.runner;
	restart.addEventListener("click", () => r.restart());
	back.addEventListener("click", () => r.stepBack());
	play.addEventListener("click", () => {
		r.toggle();
		// Play waits while the phone sheet is expanded (the rider is reading), so pressing Play
		// collapses it to show the ride.
		if (r.playing && app.isPhone()) app.panel.setExpanded(false);
	});
	fwd.addEventListener("click", () => r.stepForward());
	speed.addEventListener("click", () => {
		r.cycleSpeed();
		app.state.set("speed", r.speed);
	});

	function update() {
		const s = r.state();
		bar.hidden = !r.loaded || app.viewName !== "park";
		play.innerHTML = icon(s.playing ? "pause" : "play");
		play.setAttribute("aria-label", s.playing ? "Pause" : "Play");
		play.title = s.playing ? "Pause" : "Play";
		const backOff = !s.moving && !s.held && !s.finished && s.index <= 0;
		const fwdOff = s.finished && !s.moving;
		// A focused button that becomes disabled drops keyboard focus to the page: keep it in the bar.
		if ((backOff && document.activeElement === back) || (fwdOff && document.activeElement === fwd)) play.focus({ preventScroll: true });
		back.disabled = backOff;
		fwd.disabled = fwdOff;
		speed.textContent = `${s.speed}x`;
		speed.setAttribute("aria-label", `Speed ${s.speed}x`);
		speed.title = `Speed ${s.speed}x`;
	}

	return { update, el: bar };
}
