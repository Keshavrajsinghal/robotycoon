// The ride cart: a small open car with a rider in back and a cargo deck in front.

import { shade } from "./iso.js";

/**
 * Draw the cart at pos ({x, y, z, heading}). Returns the cargo anchor [x, y, z]: the center of
 * the deck surface where ride modules draw the cargo.
 */
export function drawCart(r, pos, color = "#d9583b") {
	const { x, y, z, heading: a } = pos;
	const ca = Math.cos(a);
	const sa = Math.sin(a);
	const at = (f, sd, zz = 0) => [x + f * ca - sd * sa, y + f * sa + sd * ca, z + zz];
	r.shadow(x, y, 1.0, 0.75, 0.22, z);
	for (const [f, sd] of [
		[0.55, 0.43],
		[0.55, -0.43],
		[-0.55, 0.43],
		[-0.55, -0.43],
	]) {
		const p = at(f, sd);
		r.cylinder(p[0], p[1], z + 0.02, 0.13, 0.2, "#2b2f36", 6);
	}
	r.orientedBox(x, y, z + 0.16, 1.7, 0.92, 0.24, a, color);
	const bump = at(0.86, 0);
	r.orientedBox(bump[0], bump[1], z + 0.18, 0.06, 0.96, 0.18, a, shade(color, 0.7));
	// Rider seat in back.
	const seat = at(-0.48, 0);
	r.orientedBox(seat[0], seat[1], z + 0.4, 0.55, 0.82, 0.14, a, "#2f3a48");
	const back = at(-0.74, 0);
	r.orientedBox(back[0], back[1], z + 0.4, 0.1, 0.84, 0.6, a, color);
	const body = at(-0.46, 0);
	r.cylinder(body[0], body[1], z + 0.52, 0.17, 0.42, "#3d6fb8", 8);
	r.sphere(body[0], body[1], z + 1.07, 0.14, "#f0c8a0", 1);
	r.cylinder(body[0], body[1], z + 1.14, 0.15, 0.06, "#e5b62f", 8);
	// Cargo deck in front, long enough for cargo drawn at about 1.5x so it reads at park zoom.
	const deck = at(0.36, 0);
	r.orientedBox(deck[0], deck[1], z + 0.4, 1.0, 0.86, 0.05, a, "#d8dde3");
	return [deck[0], deck[1], z + 0.45];
}
