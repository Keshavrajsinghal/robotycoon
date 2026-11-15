#!/usr/bin/env node
// Headless smoke test for RoboTycoon. Uses Playwright from tests/node_modules with the
// installed Google Chrome (no browser download).
//
//   node tests/smoke.mjs [--fixture] [--only=ride1] [--headed]
//
// Starts tools/serve.mjs on a free port, then on a phone (390x844, touch) and a desktop
// (1440x900) viewport: loads the site, rides every available ride, visits every stop through
// the route list, answers every question (one wrong, then the right one), solves every puzzle
// (one wrong attempt first), opens workbenches, the town map, a district, a building, the
// showroom, the glossary, and a concept view, checks Plain/Precise persistence across a
// reload, and checks that reduced motion makes the cart jump. Then a 360 px no-overflow check and
// regression checks (top bar at 768 px, deep-link seen count, wheel-zoom cache). Screenshots go
// to tests/artifacts/. Exits non-zero with a list of problems.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import net from "node:net";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ART = join(ROOT, "tests", "artifacts");
const args = process.argv.slice(2);
const FIXTURE = args.includes("--fixture");
const HEADED = args.includes("--headed");
const ONLY = args.find((a) => a.startsWith("--only="))?.slice(7) ?? null;
mkdirSync(ART, { recursive: true });

const problems = [];
const log = (...a) => console.log(...a);

function freePort() {
	return new Promise((res, rej) => {
		const s = net.createServer();
		s.once("error", rej);
		s.listen(0, "127.0.0.1", () => {
			const { port } = s.address();
			s.close(() => res(port));
		});
	});
}

async function startServer() {
	const port = await freePort();
	const proc = spawn(process.execPath, [join(ROOT, "tools", "serve.mjs"), String(port)], { stdio: ["ignore", "pipe", "pipe"] });
	await new Promise((res, rej) => {
		const t = setTimeout(() => rej(new Error("server did not start")), 8000);
		proc.stdout.on("data", (d) => {
			if (String(d).includes("serving")) {
				clearTimeout(t);
				res();
			}
		});
		proc.once("exit", (code) => rej(new Error(`server exited with ${code}`)));
	});
	return { port, proc };
}

/** A 404 is expected only for ride and workbench modules that do not exist yet. */
function expected404(url) {
	try {
		const path = new URL(url).pathname;
		return /^\/js\/(rides|workbenches)\/[a-z0-9-]+\.js$/.test(path) && !existsSync(join(ROOT, path));
	} catch {
		return false;
	}
}

const VIEWPORTS = [
	{ name: "phone", opts: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
	{ name: "desktop", opts: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
];

async function run(browser, base, vp) {
	const P = (msg) => problems.push(`[${vp.name}] ${msg}`);
	const context = await browser.newContext({ ...vp.opts, reducedMotion: "no-preference" });
	const page = await context.newPage();
	page.setDefaultTimeout(10000);
	page.on("console", (m) => {
		if (m.type() !== "error") return;
		const url = m.location()?.url ?? "";
		if (/status of 404/.test(m.text()) && expected404(url)) return;
		P(`console error: ${m.text()} ${url}`);
	});
	page.on("pageerror", (e) => P(`page error: ${e.message}`));

	let shot = 0;
	const screenshot = async (name) => {
		shot++;
		await page.waitForTimeout(250);
		await page.screenshot({ path: join(ART, `${vp.name}-${String(shot).padStart(2, "0")}-${name}.png`) });
	};
	const step = async (name, fn) => {
		try {
			await fn();
		} catch (e) {
			P(`${name}: ${String(e.message ?? e).split("\n")[0]}`);
			await page.screenshot({ path: join(ART, `${vp.name}-FAIL-${name.replace(/[^a-z0-9]+/gi, "-")}.png`) }).catch(() => {});
		}
	};
	const noOverflow = async (where) => {
		const o = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, body: document.body.scrollWidth, w: window.innerWidth }));
		if (o.doc > o.w + 1 || o.body > o.w + 1) P(`horizontal overflow at ${where}: page is ${Math.max(o.doc, o.body)}px wide in a ${o.w}px window`);
	};
	const expect = (cond, msg) => {
		if (!cond) throw new Error(msg);
	};
	const rt = (fn, arg) => page.evaluate(fn, arg);
	const waitIdle = () => page.waitForFunction(() => !window.__rt.state().moving, null, { timeout: 20000 });
	const hudClick = async (sel) => {
		if (await page.locator("#more-btn").isVisible()) await page.click("#more-btn");
		await page.click(sel);
	};
	const closeModal = async () => {
		await page.keyboard.press("Escape");
		await page.waitForFunction(() => !document.querySelector(".modal-backdrop"));
	};
	const url = `${base}/${FIXTURE ? "?content=fixture" : ""}`;

	await page.goto(url);
	await page.waitForFunction(() => window.__rt?.ready, null, { timeout: 15000 });
	const content = await rt(() => window.__rt.content);
	const rides = await rt(() => window.__rt.rides());
	await noOverflow("park");
	await screenshot("park");

	await step("opening-soon gates", async () => {
		const soon = rides.filter((r) => ["ride1", "ride2", "ride3", "ride4"].includes(r.id) && !r.available).length;
		const n = await page.locator(".label-gate.gate-soon").count();
		expect(n === soon, `expected ${soon} "Opening soon" gates, found ${n}`);
	});

	const solved = new Set();
	const solvePuzzle = async (rideId) => {
		const ride = content.rides.find((r) => r.id === rideId);
		const p = ride?.puzzle;
		if (!p) return;
		const modal = page.locator(`.puzzle-modal[data-puzzle="${rideId}"]`);
		await modal.waitFor();
		const check = () => modal.locator('[data-action="check"]').click();
		const status = () => modal.locator(".puzzle-status").textContent();
		if (p.type === "choice") {
			const wrong = p.data.options.findIndex((o) => !o.correct);
			const right = p.data.options.findIndex((o) => o.correct);
			await modal.locator(`.p-option[data-index="${wrong}"]`).click();
			await check();
			expect(await modal.locator(`.p-option[data-index="${wrong}"].wrong .p-why`).isVisible(), "choice: wrong option did not explain why");
			await modal.locator(`.p-option[data-index="${right}"]`).click();
			await check();
		} else if (p.type === "match") {
			const ids = p.data.options.map((o) => o.id);
			for (let i = 0; i < p.data.rows.length; i++) await modal.locator(`select[data-row="${i}"]`).selectOption(ids.find((x) => x !== p.data.rows[i].answer));
			await check();
			expect((await modal.locator(".p-row.wrong .p-why:visible").count()) === p.data.rows.length, "match: wrong rows did not explain why");
			for (let i = 0; i < p.data.rows.length; i++) await modal.locator(`select[data-row="${i}"]`).selectOption(p.data.rows[i].answer);
			await check();
		} else if (p.type === "order") {
			await check();
			expect((await modal.locator(".p-item.wrong .p-why").count()) > 0, "order: misplaced items were not explained");
			const want = p.data.items.map((it) => it.id);
			for (let pos = 0; pos < want.length; pos++) {
				for (let guard = 0; guard < want.length; guard++) {
					const cur = await modal.locator(".p-item").evaluateAll((els) => els.map((e) => e.dataset.item));
					const k = cur.indexOf(want[pos]);
					if (k <= pos) break;
					await modal.locator(`.p-item[data-item="${want[pos]}"] button`).first().click();
				}
			}
			await check();
		} else if (p.type === "budget") {
			const d = p.data;
			const gap = d.start_ms - d.target_ms;
			const traps = d.options.filter((o) => o.saves_ms <= 0.1 * gap);
			for (const o of traps.length ? traps : [d.options[0]]) await modal.locator(`[data-option="${o.id}"]`).click();
			await check();
			expect(/missed|Over budget/.test(await status()), "budget: a weak choice was accepted");
			expect((await modal.locator(".p-budget-opt .p-why:visible").count()) > 0, "budget: chosen options did not explain why");
			for (const o of traps.length ? traps : [d.options[0]]) await modal.locator(`[data-option="${o.id}"]`).click();
			let best = null;
			for (let mask = 1; mask < 1 << d.options.length; mask++) {
				let cost = 0;
				let saved = 0;
				d.options.forEach((o, b) => {
					if (mask & (1 << b)) {
						cost += o.cost;
						saved += o.saves_ms;
					}
				});
				if (cost <= d.budget && d.start_ms - saved <= d.target_ms) {
					best = mask;
					break;
				}
			}
			expect(best !== null, "budget: no feasible combination in content");
			for (let b = 0; b < d.options.length; b++) if (best & (1 << b)) await modal.locator(`[data-option="${d.options[b].id}"]`).click();
			await check();
		}
		await modal.locator('.debrief:not([hidden])').waitFor({ timeout: 4000 });
		expect((await modal.getAttribute("data-solved")) === "true", `${rideId} puzzle not marked solved`);
		const st = await rt((id) => window.__rt.app.state.puzzle(id), rideId);
		expect(st?.solved && st.attempts >= 2, `${rideId} puzzle state not recorded (${JSON.stringify(st)})`);
		solved.add(rideId);
	};

	const answer = async (rideId, stopId) => {
		const card = page.locator(`.panel-body [data-question="${stopId}"]`);
		await card.waitFor();
		const prior = await rt(({ r, s }) => window.__rt.app.state.answer(r, s), { r: rideId, s: stopId });
		await card.locator('.q-option[data-correct="false"]').first().click();
		await card.locator('.q-option[data-correct="true"]').click();
		const whys = await card.locator(".q-why:visible").count();
		const total = await card.locator(".q-option").count();
		expect(whys === total, `question ${stopId}: ${whys} of ${total} options explain why`);
		const rec = await rt(({ r, s }) => window.__rt.app.state.answer(r, s), { r: rideId, s: stopId });
		expect(rec && (prior ? rec.choice === prior.choice : rec.correct === false), `question ${stopId}: first answer not recorded`);
	};

	for (const ride of rides.filter((r) => r.available && (!ONLY || r.id === ONLY))) {
		const rc = content.rides.find((r) => r.id === ride.id);
		await step(`${ride.id} start from menu`, async () => {
			await page.click("#ride-menu-btn");
			await page.click(`.menu-item[data-ride="${ride.id}"]`);
			await page.waitForFunction((id) => window.__rt.state().rideId === id, ride.id);
			await waitIdle();
			const title = await page.locator("#panel-title").textContent();
			expect(title === rc.stops[0].title, `panel shows "${title}", expected "${rc.stops[0].title}"`);
			await screenshot(`${ride.id}-start`);
		});
		await step(`${ride.id} panel leaves the controls uncovered`, async () => {
			const covered = async () =>
				page.evaluate(() => {
					const a = document.querySelector("#panel").getBoundingClientRect();
					const b = document.querySelector("#controls").getBoundingClientRect();
					return !(a.right <= b.left + 1 || a.left >= b.right - 1 || a.bottom <= b.top + 1 || a.top >= b.bottom - 1);
				});
			expect(!(await covered()), "the stop panel overlaps the control bar");
			if (await page.locator("#panel .sheet-toggle").isVisible()) {
				await page.click("#panel .sheet-toggle");
				expect((await page.getAttribute("#panel", "data-state")) === "expanded", "bottom sheet did not expand");
				await page.waitForTimeout(150);
				expect(!(await covered()), "the expanded bottom sheet overlaps the control bar");
				await screenshot(`${ride.id}-sheet-expanded`);
				await page.click("#panel .sheet-toggle");
				expect((await page.getAttribute("#panel", "data-state")) === "collapsed", "bottom sheet did not collapse");
			}
		});
		await step(`${ride.id} ride start to finish`, async () => {
			while ((await page.locator("#controls .speed").textContent()) !== "4x") await page.click("#controls .speed");
			const stops = await rt(() => window.__rt.app.runner.stops.map((s) => s.id));
			for (let i = 1; i <= stops.length; i++) {
				await page.click('#controls [data-act="forward"]');
				await waitIdle();
				const s = await rt(() => window.__rt.state());
				if (i < stops.length) {
					expect(s.index === i && !s.finished, `after step ${i} the cart is at ${s.index}`);
					const stop = rc.stops.find((x) => x.id === stops[i]);
					const title = await page.locator("#panel-title").textContent();
					expect(title === stop.title, `stop ${stop.id}: panel title "${title}"`);
					const tag = await page.locator(".label-cart .cargo").textContent();
					expect(tag === stop.cargo, `stop ${stop.id}: cart tag "${tag}", expected "${stop.cargo}"`);
					await answer(ride.id, stops[i - 1]);
					if (i === Math.floor(stops.length / 2)) await screenshot(`${ride.id}-mid`);
					if (stop.delay) {
						const total = Number(await page.locator(".delay-box").getAttribute("data-delay-total"));
						const want = rc.stops.filter((x) => stops.indexOf(x.id) >= 0 && stops.indexOf(x.id) <= i).reduce((a, x) => a + (x.delay?.mid ?? 0), 0);
						expect(Math.abs(total - want) < 0.01, `delay total ${total}, expected ${want}`);
					}
				} else {
					expect(s.finished, "ride did not finish after the last stop");
				}
			}
			await answer(ride.id, stops[stops.length - 1]);
			await page.locator(`[data-ride-complete="${ride.id}"]`).waitFor();
			await screenshot(`${ride.id}-complete`);
		});
		await step(`${ride.id} puzzle`, async () => {
			if (!rc.puzzle) return;
			await page.click(`[data-open-puzzle="${ride.id}"]`);
			await solvePuzzle(ride.id);
			await screenshot(`${ride.id}-puzzle`);
			await closeModal();
		});
		await step(`${ride.id} route list visits every stop`, async () => {
			const stops = await rt(() => window.__rt.app.runner.stops.map((s) => s.id));
			for (const id of [...stops].reverse()) {
				if (!(await page.locator("#route-drawer").isVisible())) await page.click("#route-btn");
				await page.click(`#route-drawer [data-stop="${id}"]`);
				await waitIdle();
				const s = await rt(() => window.__rt.state());
				expect(s.stopId === id && !s.finished, `route list click on ${id} ended at ${s.stopId}`);
			}
			if (!(await page.locator("#route-drawer").isVisible())) await page.click("#route-btn");
			const seen = await page.locator("#route-drawer .route-item.seen").count();
			expect(seen === stops.length, `route list marks ${seen} of ${stops.length} stops seen`);
			await screenshot(`${ride.id}-route`);
			await page.click('#route-drawer [aria-label="Close route list"]');
			const counter = await page.locator("#seen-counter .counter-value").textContent();
			const want = await rt(() => window.__rt.app.seenCount());
			expect(counter === `${want.seen} / ${want.total}`, `counter shows "${counter}"`);
		});
		if (ride.modes)
			await step(`${ride.id} learned mode`, async () => {
				await page.click('.panel-body .mode-switch [data-mode="learned"]');
				await page.waitForFunction(() => window.__rt.state().mode === "learned");
				const learned = await rt(() => window.__rt.app.runner.stops.map((s) => s.id));
				expect(learned.some((id) => rc.stops.find((s) => s.id === id)?.mode === "learned"), "learned mode has no learned stop");
				expect(!learned.some((id) => rc.stops.find((s) => s.id === id)?.mode === "classical"), "learned mode still shows classical stops");
				await page.click("#route-btn");
				const greyed = await page.locator("#route-drawer .route-item:disabled").count();
				expect(greyed === rc.stops.filter((s) => s.mode === "classical").length, `learned mode greys out ${greyed} stops`);
				await screenshot(`${ride.id}-learned`);
				await page.click('#route-drawer [aria-label="Close route list"]');
				await page.click('.panel-body .mode-switch [data-mode="classical"]');
				await page.waitForFunction(() => window.__rt.state().mode === "classical");
			});
		await step(`${ride.id} keyboard`, async () => {
			await page.locator("#park-canvas").focus().catch(() => {});
			await page.evaluate(() => document.activeElement?.blur());
			const before = await rt(() => window.__rt.state().index);
			await page.keyboard.press("ArrowRight");
			await waitIdle();
			const after = await rt(() => window.__rt.state());
			expect(after.index === before + 1 || after.finished, `ArrowRight moved from ${before} to ${after.index}`);
			await page.keyboard.press("ArrowLeft");
			await waitIdle();
			await page.keyboard.press(" ");
			expect((await rt(() => window.__rt.state().playing)) === true, "Space did not start playing");
			await page.keyboard.press(" ");
			expect((await rt(() => window.__rt.state().playing)) === false, "Space did not pause");
			await waitIdle();
		});
		await step(`${ride.id} workbench booths`, async () => {
			for (const stop of rc.stops.filter((s) => s.workbench)) {
				const ok = await rt((id) => window.__rt.app.runner.goToStopId(id, { jump: true }), stop.id);
				if (!ok) continue;
				await page.click(`.panel-body [data-workbench="${stop.workbench}"]`);
				const modal = page.locator(`.workbench-modal[data-workbench="${stop.workbench}"]`);
				await modal.waitFor();
				if (existsSync(join(ROOT, "js", "workbenches", `${stop.workbench}.js`))) await modal.locator('[data-loaded="true"]').waitFor();
				else await modal.locator("[data-wb-missing]").waitFor();
				await noOverflow(`workbench ${stop.workbench}`);
				await screenshot(`workbench-${stop.workbench}`);
				await closeModal();
			}
		});
		await step(`${ride.id} concept view`, async () => {
			const link = page.locator(".panel-body .concept-card a.concept-link").first();
			if (!(await link.count())) return;
			const id = await link.getAttribute("data-concept");
			await link.click();
			const modal = page.locator(".concept-modal");
			await modal.waitFor();
			const t = await modal.locator("h2").textContent();
			expect(t === content.concepts[id].title, `concept modal title "${t}"`);
			if (content.concepts[id].code) {
				const pre = modal.locator("pre.code").first();
				await pre.scrollIntoViewIfNeeded();
				const box = await pre.evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth, ox: getComputedStyle(el).overflowX }));
				expect(box.ox === "auto" || box.ox === "scroll", "code block does not scroll horizontally");
			}
			await noOverflow("concept view");
			await screenshot("concept");
			await closeModal();
		});
		await step(`${ride.id} plain/precise persists`, async () => {
			await page.click('.panel-body .level-switch [data-level="precise"]');
			const stopId = await rt(() => window.__rt.state().stopId);
			const stop = rc.stops.find((s) => s.id === stopId);
			const html = await page.locator(".panel-body .stop-text").innerHTML();
			expect(html === stop.precise, "Precise did not switch the stop text");
			await screenshot("precise");
			await page.reload();
			await page.waitForFunction(() => window.__rt?.ready);
			await page.waitForFunction((id) => window.__rt.state().stopId === id, stopId);
			const pressed = await page.locator('.panel-body .level-switch [data-level="precise"]').getAttribute("aria-pressed");
			expect(pressed === "true", "Precise did not persist across reload");
			await page.click('.panel-body .level-switch [data-level="plain"]');
		});
		await step(`${ride.id} reduced motion jumps`, async () => {
			await page.emulateMedia({ reducedMotion: "reduce" });
			await page.waitForFunction(() => window.__rt.reducedMotion());
			await rt(() => window.__rt.goToStop(0, true));
			await page.click('#controls [data-act="forward"]');
			const s = await rt(() => window.__rt.state());
			expect(!s.moving && s.index === 1, `with reduced motion the cart should jump (moving=${s.moving}, index=${s.index})`);
			await page.waitForTimeout(400);
			expect(await rt(() => window.__rt.idle()), "render loop keeps running under reduced motion");
			await page.emulateMedia({ reducedMotion: "no-preference" });
			await page.waitForFunction(() => !window.__rt.reducedMotion());
			await page.click('#controls [data-act="forward"]');
			expect((await rt(() => window.__rt.state().moving)) === true, "without reduced motion the cart should animate");
			await waitIdle();
		});
		await noOverflow(`${ride.id}`);
	}

	await step("all puzzles", async () => {
		for (const r of content.rides) {
			if (!r.puzzle || solved.has(r.id)) continue;
			await rt((id) => window.__rt.openPuzzle(id), r.id);
			await solvePuzzle(r.id);
			await screenshot(`puzzle-${r.id}-${r.puzzle.type}`);
			await closeModal();
		}
	});

	await step("workbenches", async () => {
		let missingShown = false;
		for (const wb of content.workbenches ?? []) {
			const exists = existsSync(join(ROOT, "js", "workbenches", `${wb.id}.js`));
			if (!exists && missingShown) continue;
			await page.evaluate((id) => {
				location.hash = `#/workbench/${id}`;
			}, wb.id);
			const modal = page.locator(`.workbench-modal[data-workbench="${wb.id}"]`);
			await modal.waitFor();
			if (exists) {
				await modal.locator('[data-loaded="true"]').waitFor();
				await screenshot(`workbench-${wb.id}`);
			} else {
				await modal.locator("[data-wb-missing]").waitFor();
				missingShown = true;
			}
			await closeModal();
		}
	});

	await step("glossary", async () => {
		await hudClick("#glossary-btn");
		const modal = page.locator(".glossary-modal");
		await modal.waitFor();
		const all = await modal.locator("dt:visible").count();
		expect(all === (content.glossary?.length ?? 0), `glossary shows ${all} terms`);
		if (all) {
			const term = content.glossary[0].term;
			await modal.locator("input.search").fill(term.slice(0, 5));
			const n = await modal.locator("dt:visible").count();
			expect(n >= 1 && n <= all, `search shows ${n} terms`);
		}
		await noOverflow("glossary");
		await screenshot("glossary");
		await closeModal();
		if (vp.name === "desktop") expect(await page.evaluate(() => document.activeElement?.id === "glossary-btn"), "focus did not return to the glossary button");
	});

	await step("town, district, building", async () => {
		await hudClick("#town-btn");
		await page.locator("#town-view:not([hidden])").waitFor();
		await page.waitForTimeout(300);
		await screenshot("town");
		const d = content.town?.districts?.[0];
		if (!d) return;
		const label = page.locator(".label-district", { hasText: d.title }).first();
		const viaLabel = (await label.isVisible()) && (await label.click({ timeout: 2500 }).then(() => true, () => false));
		if (!viaLabel) await page.click(`.town-panel [data-district="${d.id}"]`);
		await page.waitForFunction((t) => document.querySelector("#town-panel-title")?.textContent === t, d.title);
		await noOverflow("district");
		await screenshot("district");
		const b = content.town.buildings.find((x) => x.district === d.id);
		if (b) {
			await page.click(`.town-panel [data-building="${b.id}"]`);
			await page.locator(`.town-panel [data-roles="${b.id}"]`).waitFor();
			await screenshot("building");
		}
	});

	await step("showroom", async () => {
		await page.locator("#town-view .view-bar .btn", { hasText: "Showroom" }).click();
		await page.locator("#showroom-view:not([hidden])").waitFor();
		const n = await page.locator(".robot-col[data-robot]").count();
		expect(n === (content.showroom?.length ?? 0) + 1, `showroom draws ${n} columns for ${content.showroom?.length} robots`);
		await noOverflow("showroom");
		await screenshot("showroom");
		await page.locator("#showroom-view .view-bar .btn", { hasText: "Back to park" }).click();
		await page.locator("#park-view:not([hidden])").waitFor();
	});

	await noOverflow("end");
	await context.close();
}

async function narrowCheck(browser, base) {
	// No horizontal page scroll at 360 px wide, with the panel, a modal, and the town open.
	const context = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
	const page = await context.newPage();
	page.on("pageerror", (e) => problems.push(`[narrow] page error: ${e.message}`));
	const check = async (where) => {
		const o = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, w: window.innerWidth }));
		if (o.doc > o.w + 1) problems.push(`[narrow] horizontal overflow at ${where}: ${o.doc}px in ${o.w}px`);
	};
	const first = await (async () => {
		await page.goto(`${base}/${FIXTURE ? "?content=fixture" : ""}`);
		await page.waitForFunction(() => window.__rt?.ready);
		return (await page.evaluate(() => window.__rt.rides())).find((r) => r.available);
	})();
	await check("park");
	if (first) {
		await page.evaluate((id) => window.__rt.select(id), first.id);
		await page.waitForTimeout(600);
		await check("ride");
		await page.evaluate((id) => window.__rt.openPuzzle(id), first.id);
		await check("puzzle");
	}
	await page.evaluate(() => {
		location.hash = "#/town";
	});
	await page.waitForTimeout(400);
	await check("town");
	await page.screenshot({ path: join(ART, "narrow-360-town.png") });
	await context.close();
}

async function regressionChecks(browser, base) {
	// Bugs found in QA that the main run would not catch.
	const P = (msg) => problems.push(`[regression] ${msg}`);
	const q = FIXTURE ? "?content=fixture" : "";
	// 1. Tablet width: every top-bar button stays on screen while riding.
	let context = await browser.newContext({ viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true });
	let page = await context.newPage();
	page.on("pageerror", (e) => P(`page error: ${e.message}`));
	await page.goto(`${base}/${q}`);
	await page.waitForFunction(() => window.__rt?.ready);
	const first = (await page.evaluate(() => window.__rt.rides())).find((r) => r.available);
	if (!first) return context.close();
	await page.evaluate((id) => window.__rt.select(id), first.id);
	await page.waitForTimeout(500);
	const off = await page.evaluate(() =>
		[...document.querySelectorAll("#hud button, #hud .hud-counter")]
			.filter((el) => el.offsetParent !== null)
			.filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
			.map((el) => el.id || el.className),
	);
	if (off.length) P(`top bar items off screen at 768 px: ${off.join(", ")}`);
	await context.close();
	// 2. A deep link to a later stop marks only that stop seen. 3. A wheel zoom re-renders the
	// static map at the new zoom even while robots animate (the cache once stayed stretched).
	context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
	page = await context.newPage();
	page.on("pageerror", (e) => P(`page error: ${e.message}`));
	const last = first.stops[first.stops.length - 1];
	await page.goto(`${base}/${q}#/ride/${first.id}/${last}`);
	await page.waitForFunction(() => window.__rt?.ready);
	await page.waitForTimeout(300);
	const seen = await page.evaluate(() => Object.keys(window.__rt.app.state.get("seen")));
	if (seen.length !== 1 || seen[0] !== `${first.id}/${last}`) P(`deep link to ${last} marked ${seen.join(", ")} as seen`);
	await page.mouse.move(300, 400);
	for (let i = 0; i < 12; i++) await page.mouse.wheel(0, 300);
	await page.waitForTimeout(700);
	const z = await page.evaluate(() => ({ cache: window.__rt.app.scene.cache.zoom, cam: window.__rt.camera().zoom }));
	if (z.cache !== z.cam) P(`after a wheel zoom the map cache is at zoom ${z.cache}, camera at ${z.cam}`);
	await context.close();
}

async function main() {
	if (!FIXTURE && !existsSync(join(ROOT, "js", "content.js"))) {
		console.log("smoke: js/content.js does not exist. Build it with `node tools/build-content.mjs`, or run with --fixture.");
		process.exit(1);
	}
	const { port, proc } = await startServer();
	const base = `http://localhost:${port}`;
	let browser;
	try {
		browser = await chromium.launch({ channel: "chrome", headless: !HEADED });
		for (const vp of VIEWPORTS) {
			log(`smoke: ${vp.name}...`);
			await run(browser, base, vp);
		}
		await narrowCheck(browser, base);
		await regressionChecks(browser, base);
	} catch (e) {
		problems.push(`fatal: ${e.stack ?? e}`);
	} finally {
		await browser?.close();
		proc.kill();
	}
	if (problems.length) {
		console.log(`\nsmoke: ${problems.length} problem(s):`);
		for (const p of problems) console.log(`  - ${p}`);
		console.log(`screenshots: ${ART}`);
		process.exit(1);
	}
	console.log(`smoke: all checks passed (${FIXTURE ? "fixture" : "real"} content). Screenshots: ${ART}`);
}

main();
