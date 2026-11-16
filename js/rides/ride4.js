// Ride 4, The lesson: the recording of ride 3's takeover becomes training data, then a new model,
// then ships back to the fleet, and the next grape pick succeeds. The cart follows that one
// recording; its cargo changes at every stop. Drawing code only: every word on screen (stop
// titles, cargo tags) comes from content.

import { drawRide4Cargo } from "./ride4-cargo.js";
import { mountCloseup } from "./ride4-closeups.js";
import { STOP_POS, XL, XR, Y1, Y2 } from "./ride4-common.js";
import { BOOTH_POS, buildStations, STATIONS } from "./ride4-stations.js";

const R = 2.5; // corner radius of the track
const C45 = R * (1 - Math.SQRT1_2);

export default {
	id: "ride4",
	zone: "lesson",

	trackFor() {
		const points = [];
		const stops = {};
		const add = (x, y, id) => {
			if (id) stops[id] = points.length;
			points.push([x, y]);
		};
		// Row 1 toward -x, starting just past the boarding platform.
		add(52.8, Y1);
		for (const id of ["recording", "upload", "curation", "dataset"]) add(...STOP_POS[id], id);
		add(XL + R, Y1);
		add(XL + C45, Y1 + C45);
		add(XL, Y1 + R);
		// Left leg toward +y, then row 2 toward +x.
		add(XL, Y2 - R);
		add(XL + C45, Y2 - C45);
		add(XL + R, Y2);
		for (const id of ["training", "simulation", "real-eval", "rollout", "fleet", "next-pick"]) add(...STOP_POS[id], id);
		// Return leg toward -y back to the start (run-out after the last stop).
		add(XR - C45, Y2 - C45);
		add(XR, Y2 - R);
		add(XR, Y1 + R);
		add(XR - C45, Y1 + C45);
		add(XR - R, Y1);
		add(53.0, Y1);
		return { points, stops };
	},

	buildScenery(scene, ctx) {
		const booths = [];
		for (const stop of ctx.ride.stops) {
			const p = BOOTH_POS[stop.id];
			if (stop.workbench && p) booths.push([stop.id, p]);
		}
		buildStations(
			scene,
			ctx,
			booths.map(([, [x, y]]) => [x - 1, y - 1, x + 1, y + 1]),
		);
		for (const [id, [x, y]] of booths) ctx.booth(id, x, y);
		for (const [id, s] of Object.entries(STATIONS)) ctx.stopTarget(id, s.bounds, s.label);
	},

	// Stations stand behind the track rows (toward -y): aim that way so the station that just
	// changed the cargo is in view next to the cart. Row 1 also aims a little toward the next
	// station (-x) so its title is on screen; row 2's stations are deeper, so it aims further
	// back, and a little toward -x so the cart and its tag stay clear of the left edge on a phone.
	// Aiming high puts the cart low in the view, leaving room above it for its tag and the
	// station titles on a short phone screen. On the two legs (no stations), aim at the cart.
	focus(pos) {
		const k = Math.abs(Math.cos(pos.heading));
		const row2 = pos.y > (Y1 + Y2) / 2;
		return [pos.x - (row2 ? 1.0 : 0.8) * k, pos.y - (row2 ? 3.0 : 2.2) * k, pos.z + 0.6 + 0.8 * k];
	},

	drawCargo(r, stopId, pos, t, ctx) {
		drawRide4Cargo(r, stopId, pos, t, ctx);
	},

	closeup(stopId, el, ctx) {
		return mountCloseup(stopId, el, ctx);
	},
};
