#!/usr/bin/env node
// Builds js/content.js and knowledge/dependency-graph.md from the markdown in /knowledge.
// Uses only Node built-ins. See knowledge/FORMAT.md for the file format.
//
//   node tools/build-content.mjs                 validate everything, then write outputs
//   node tools/build-content.mjs --check         validate everything, write nothing
//   node tools/build-content.mjs --check FILE..  validate only the given files
//
// Exits non-zero on any error. Warnings never block.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
// --knowledge=DIR reads another knowledge folder (used for test fixtures); --out=FILE writes elsewhere.
const optValue = (name) => argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const K = resolve(optValue("knowledge") ?? join(ROOT, "knowledge"));
const SIM = join(K, "sim");
const OUT = resolve(optValue("out") ?? join(ROOT, "js", "content.js"));

const checkOnly = argv.includes("--check");
const quiet = argv.includes("--quiet");
const fileArgs = argv.filter((a) => !a.startsWith("--")).map((a) => resolve(a));
const fullMode = fileArgs.length === 0;

const errors = [];
const warnings = [];
const rel = (f) => relative(ROOT, f);
const err = (file, line, msg) => errors.push(`${rel(file)}:${line ?? 0}: ${msg}`);
const warn = (file, line, msg) => warnings.push(`${rel(file)}:${line ?? 0}: ${msg}`);

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/u;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const WORKBENCH_IDS = ["wb1-dof", "wb2-ik", "wb3-control", "wb4-calibration", "wb5-teleop", "wb6-line-balancing"];
const COMPANY_IDS = new Set([
	"component-makers",
	"robot-makers",
	"integrators",
	"application-companies",
	"model-companies",
	"tooling-companies",
	"end-users",
]);

// ---------------------------------------------------------------------------
// Registry

function parseRegistry() {
	const file = join(K, "registry.md");
	const reg = new Map();
	if (!existsSync(file)) {
		err(file, 0, "registry.md is missing");
		return reg;
	}
	let cur = null;
	readFileSync(file, "utf8")
		.split("\n")
		.forEach((line, i) => {
			const h = line.match(/^## (\d\d-[a-z0-9-]+\.md)\s*$/);
			if (h) {
				cur = h[1];
				return;
			}
			const m = line.match(/^- `([a-z0-9-]+)` — (.+)$/);
			if (m && cur) {
				if (reg.has(m[1])) err(file, i + 1, `duplicate id ${m[1]}`);
				reg.set(m[1], { title: m[2].trim(), file: cur, area: Number.parseInt(cur, 10) });
			}
		});
	return reg;
}

const REG = parseRegistry();

// ---------------------------------------------------------------------------
// Markdown rendering (small, predictable subset)

const esc = (s) =>
	String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(src) {
	if (!src) return "";
	const codes = [];
	let s = String(src).replace(/`([^`]+)`/g, (_, c) => {
		codes.push(c);
		return `\u0000${codes.length - 1}\u0000`;
	});
	s = esc(s);
	s = s.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_, id, label) => {
		const text = label ?? esc(REG.get(id)?.title ?? id);
		return `<a class="concept-link" href="#concept/${id}" data-concept="${id}">${text}</a>`;
	});
	s = s.replace(
		/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
		(_, t, u) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`,
	);
	s = s.replace(/\[unverified(?::\s*([^\]]*))?\]/gi, (_, note) => {
		const n = note?.trim();
		return `<span class="flag-unverified"${n ? ` title="${n}"` : ""}>unverified${n ? `: ${n}` : ""}</span>`;
	});
	s = s.replace(/\[(\d+(?:\s*[,–-]\s*\d+)*)\]/g, (_, n) => `<sup class="cite">[${n}]</sup>`);
	s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
	s = s.replace(/(^|[^*\w])\*(?!\s)([^*]+?)\*(?!\w)/g, "$1<em>$2</em>");
	s = s.replace(/\u0000(\d+)\u0000/g, (_, k) => `<code>${esc(codes[Number(k)])}</code>`);
	return s;
}

const LIST_ITEM = /^\s*([-*]|\d+\.)\s+/;

function renderTable(rows) {
	const cells = (r) =>
		r
			.trim()
			.replace(/^\|/, "")
			.replace(/\|$/, "")
			.split("|")
			.map((c) => c.trim());
	const body = rows.filter((r) => !/^\s*\|?\s*:?-{2,}/.test(r));
	if (!body.length) return "";
	const [head, ...rest] = body;
	const th = cells(head)
		.map((c) => `<th>${inline(c)}</th>`)
		.join("");
	const trs = rest.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("");
	return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
}

function md(src) {
	if (!src) return "";
	const lines = String(src).replace(/\r/g, "").split("\n");
	const out = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) {
			i++;
			continue;
		}
		let m = line.match(/^\s*```\s*([\w+-]*)\s*$/);
		if (m) {
			const lang = m[1];
			const buf = [];
			i++;
			while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) buf.push(lines[i++]);
			i++;
			out.push(`<pre class="code"><code${lang ? ` data-lang="${esc(lang)}"` : ""}>${esc(buf.join("\n"))}</code></pre>`);
			continue;
		}
		if (/^\s*\|/.test(line)) {
			const rows = [];
			while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
			out.push(renderTable(rows));
			continue;
		}
		if (LIST_ITEM.test(line)) {
			const ordered = /^\s*\d+\./.test(line);
			const items = [];
			while (i < lines.length && lines[i].trim() && !/^\s*```/.test(lines[i])) {
				if (LIST_ITEM.test(lines[i])) items.push(lines[i].replace(LIST_ITEM, ""));
				else items[items.length - 1] += ` ${lines[i].trim()}`;
				i++;
			}
			const tag = ordered ? "ol" : "ul";
			out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</${tag}>`);
			continue;
		}
		m = line.match(/^#{4,6}\s+(.+)$/);
		if (m) {
			out.push(`<h5>${inline(m[1])}</h5>`);
			i++;
			continue;
		}
		const buf = [];
		while (
			i < lines.length &&
			lines[i].trim() &&
			!/^\s*```/.test(lines[i]) &&
			!/^\s*\|/.test(lines[i]) &&
			!LIST_ITEM.test(lines[i])
		) {
			buf.push(lines[i++].trim());
		}
		out.push(`<p>${inline(buf.join(" "))}</p>`);
	}
	return out.join("");
}

function plain(src) {
	return String(src ?? "")
		.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_, id, label) => label ?? REG.get(id)?.title ?? id)
		.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1")
		.replace(/\[unverified(?::[^\]]*)?\]/gi, "")
		.replace(/\[(\d+(?:\s*[,–-]\s*\d+)*)\]/g, "")
		.replace(/\*\*|`/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

// ---------------------------------------------------------------------------
// Generic document parser: frontmatter, H1, H2 sections with metadata lines, H3 subsections.

function parseDoc(file) {
	const text = readFileSync(file, "utf8").replace(/\r/g, "");
	const lines = text.split("\n");
	const doc = { file, text, fm: {}, h1: null, intro: [], h2: [] };
	const em = text.match(EMOJI);
	if (em) {
		const lineNo = text.slice(0, em.index).split("\n").length;
		err(file, lineNo, `emoji or pictograph character "${em[0]}" is not allowed`);
	}
	let i = 0;
	if (lines[0] === "---") {
		let j = 1;
		for (; j < lines.length && lines[j] !== "---"; j++) {
			const m = lines[j].match(/^([a-z_]+):\s*(.*)$/);
			if (m) doc.fm[m[1]] = m[2].trim();
		}
		if (j >= lines.length) err(file, 1, "frontmatter is not closed with ---");
		i = j + 1;
	}
	let inFence = false;
	let fenceLine = 0;
	let h2 = null;
	let h3 = null;
	for (; i < lines.length; i++) {
		const line = lines[i];
		const ln = i + 1;
		const isFence = /^\s*```/.test(line);
		if (!inFence && !isFence) {
			let m = line.match(/^# (.+)$/);
			if (m) {
				doc.h1 = m[1].trim();
				continue;
			}
			m = line.match(/^## (.+)$/);
			if (m) {
				h2 = { title: m[1].trim(), line: ln, meta: {}, metaLine: {}, body: [], h3: [] };
				doc.h2.push(h2);
				h3 = null;
				let j = i + 1;
				while (j < lines.length && /^[a-z_]+:(\s.*)?$/.test(lines[j])) {
					const mm = lines[j].match(/^([a-z_]+):\s?(.*)$/);
					h2.meta[mm[1]] = mm[2].trim();
					h2.metaLine[mm[1]] = j + 1;
					j++;
				}
				i = j - 1;
				continue;
			}
			m = line.match(/^### (.+)$/);
			if (m) {
				if (!h2) {
					err(file, ln, "### heading before any ## heading");
					continue;
				}
				h3 = { title: m[1].trim(), line: ln, body: [] };
				h2.h3.push(h3);
				continue;
			}
		}
		if (isFence) {
			inFence = !inFence;
			if (inFence) fenceLine = ln;
		}
		(h3 ? h3.body : h2 ? h2.body : doc.intro).push(line);
	}
	if (inFence) err(file, fenceLine, "code fence opened here is never closed");
	return doc;
}

const bodyText = (node) => (node ? node.body.join("\n").trim() : "");
const findH3 = (h2, name) => h2.h3.find((s) => s.title.toLowerCase() === name.toLowerCase());
const secText = (h2, name) => bodyText(findH3(h2, name));

function csv(v) {
	if (!v || v.toLowerCase() === "none") return [];
	return v
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

const INLINE_REFS = [];
function checkRefs(file, line, text) {
	for (const m of text.matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)) {
		if (!REG.has(m[1])) err(file, line, `[[${m[1]}]] is not a registered concept id`);
		else INLINE_REFS.push({ file, line, id: m[1] });
	}
}

function fencedJson(file, line, text) {
	const m = text.match(/```(?:json)?\s*\n([\s\S]*?)\n\s*```/);
	if (!m) {
		err(file, line, "expected a ```json fenced block");
		return null;
	}
	try {
		return JSON.parse(m[1]);
	} catch (e) {
		err(file, line, `invalid JSON: ${e.message}`);
		return null;
	}
}

function parseRange(v) {
	if (v === undefined || v === "") return null;
	const m = String(v).match(/^\s*(\d+(?:\.\d+)?)\s*(?:[-–]\s*(\d+(?:\.\d+)?))?\s*$/);
	if (!m) return undefined;
	const min = Number(m[1]);
	const max = m[2] === undefined ? min : Number(m[2]);
	return { min, max, mid: (min + max) / 2, text: String(v).trim() };
}

// ---------------------------------------------------------------------------
// Concept files

const CONCEPT_SECTIONS = [
	["plain", "plain", true],
	["where the analogy breaks", "analogyLimit", true],
	["precise", "precise", true],
	["on the cheese plate line", "cheese", true],
	["elsewhere", "elsewhere", true],
	["why it exists", "why", true],
	["connects to", "connects", true],
	["real products and tools", "products", true],
	["common misconception", "misconception", true],
	["key numbers", "keyNumbers", false],
	["typical specs", "specs", false],
	["code sketch", "code", false],
	["sells", "sells", false],
	["buys from", "buysFrom", false],
	["sells to", "sellsTo", false],
	["job functions", "roles", false],
	["example companies", "companies", false],
	["sources", "sources", true],
];
const SECTION_INDEX = new Map(CONCEPT_SECTIONS.map(([name], i) => [name, i]));

function parseSources(file, line, text) {
	const out = [];
	for (const raw of text.split("\n")) {
		if (!raw.trim()) continue;
		const m = raw.match(/^\s*(\d+)\.\s+\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)\s*(?:[—–-]+\s*(.*))?$/);
		if (m) out.push({ n: Number(m[1]), title: m[2].trim(), url: m[3], note: inline(m[4] ?? "") });
		else if (/^\s*\d+\./.test(raw)) err(file, line, `source line needs the form "N. [Title](https://url) — note": ${raw.trim()}`);
		else if (out.length) out[out.length - 1].note += ` ${inline(raw.trim())}`;
	}
	out.forEach((s, idx) => {
		if (s.n !== idx + 1) warn(file, line, `sources should be numbered 1..n in order (found ${s.n} at position ${idx + 1})`);
	});
	return out;
}

function parseConceptFile(file, ctx) {
	const doc = parseDoc(file);
	const area = Number.parseInt(doc.fm.area, 10);
	if (!area) err(file, 1, "frontmatter needs area: <number>");
	if (!doc.fm.slug) err(file, 1, "frontmatter needs slug:");
	if (!doc.fm.title) err(file, 1, "frontmatter needs title:");
	const areaInfo = {
		area,
		slug: doc.fm.slug,
		title: doc.fm.title ?? doc.h1,
		file: rel(file),
		intro: md(doc.intro.join("\n")),
		concepts: [],
	};
	if (!doc.intro.join("").trim()) warn(file, 1, "area intro paragraph is empty");
	for (const h2 of doc.h2) {
		const c = parseConcept(file, h2, area, ctx);
		if (c) areaInfo.concepts.push(c.id);
	}
	if (!areaInfo.concepts.length) err(file, 1, "no concepts found");
	return areaInfo;
}

function parseConcept(file, h2, area, ctx) {
	const id = h2.meta.id;
	if (!id) {
		err(file, h2.line, `concept "${h2.title}" has no id: line directly under the heading`);
		return null;
	}
	if (!REG.has(id)) err(file, h2.line, `id ${id} is not in knowledge/registry.md`);
	else if (REG.get(id).area !== area) err(file, h2.line, `id ${id} is registered to ${REG.get(id).file}`);
	if (ctx.concepts[id]) err(file, h2.line, `duplicate concept id ${id}`);

	const requires = csv(h2.meta.requires);
	if (h2.meta.requires === undefined) warn(file, h2.line, `${id}: add a requires: line (use "requires: none")`);
	for (const r of requires) {
		if (!REG.has(r)) err(file, h2.metaLine.requires, `${id}: requires unknown id ${r}`);
		if (r === id) err(file, h2.metaLine.requires, `${id}: requires itself`);
	}

	const seen = new Set();
	let lastIdx = -1;
	for (const s of h2.h3) {
		const key = s.title.toLowerCase();
		if (!SECTION_INDEX.has(key)) {
			warn(file, s.line, `${id}: unknown section "### ${s.title}"`);
			continue;
		}
		if (seen.has(key)) err(file, s.line, `${id}: duplicate section "### ${s.title}"`);
		seen.add(key);
		const idx = SECTION_INDEX.get(key);
		if (idx < lastIdx) warn(file, s.line, `${id}: section "${s.title}" is out of the standard order`);
		lastIdx = Math.max(lastIdx, idx);
	}
	for (const [name, , required] of CONCEPT_SECTIONS) {
		const isCompanyExtra = ["sells", "buys from", "sells to", "job functions", "example companies"].includes(name);
		const need = required || (isCompanyExtra && COMPANY_IDS.has(id));
		if (need && !secText(h2, name)) err(file, h2.line, `${id}: missing or empty section "### ${name}"`);
	}

	const c = {
		id,
		area,
		title: h2.title,
		requires,
		aka: csv(h2.meta.aka),
		file: rel(file),
		plain: md(secText(h2, "plain")),
		analogyLimit: md(secText(h2, "where the analogy breaks")),
		precise: md(secText(h2, "precise")),
		cheese: md(secText(h2, "on the cheese plate line")),
		elsewhere: md(secText(h2, "elsewhere")),
		why: md(secText(h2, "why it exists")),
		connects: [],
		products: md(secText(h2, "real products and tools")),
		misconception: null,
		keyNumbers: md(secText(h2, "key numbers")),
		specs: null,
		code: null,
		sources: [],
		unverified: 0,
	};

	const plainText = secText(h2, "plain");
	const sentences = (plainText.match(/[.!?](\s|$)/g) ?? []).length;
	if (plainText && (sentences < 2 || sentences > 5)) {
		warn(file, findH3(h2, "plain")?.line, `${id}: Plain should be 2-4 sentences (found about ${sentences})`);
	}

	for (const raw of secText(h2, "connects to").split("\n")) {
		if (!raw.trim()) continue;
		const m = raw.match(/^\s*[-*]\s+\[\[([a-z0-9-]+)\]\]\s*[—–-]+\s*(.+)$/);
		if (m) c.connects.push({ id: m[1], html: inline(m[2]) });
		else if (LIST_ITEM.test(raw)) warn(file, findH3(h2, "connects to").line, `${id}: connects line should be "- [[id]] — reason": ${raw.trim()}`);
	}

	const mis = secText(h2, "common misconception");
	if (mis) {
		const mm = mis.match(/\*\*Misconception:\*\*\s*([\s\S]*?)\s*\*\*Reality:\*\*\s*([\s\S]*)$/);
		if (mm) c.misconception = { myth: md(mm[1]), reality: md(mm[2]) };
		else err(file, findH3(h2, "common misconception").line, `${id}: misconception needs "**Misconception:** ..." then "**Reality:** ..."`);
	}

	const specText = secText(h2, "typical specs");
	if (specText) {
		c.specs = { html: md(specText), rows: {} };
		for (const row of specText.split("\n").filter((r) => /^\s*\|/.test(r) && !/^\s*\|?\s*:?-{2,}/.test(r)).slice(1)) {
			const cells = row
				.trim()
				.replace(/^\|/, "")
				.replace(/\|$/, "")
				.split("|")
				.map((x) => x.trim());
			c.specs.rows[cells[0].toLowerCase()] = { range: plain(cells[1] ?? ""), source: cells[2] ?? "" };
		}
	}

	const codeText = secText(h2, "code sketch");
	if (codeText) {
		const m = codeText.match(/```\s*([\w+-]*)\s*\n([\s\S]*?)\n\s*```/);
		if (m) c.code = { lang: m[1] || "text", text: m[2], html: md(codeText) };
		else err(file, findH3(h2, "code sketch").line, `${id}: Code sketch needs a fenced code block`);
	}

	const srcNode = findH3(h2, "sources");
	c.sources = parseSources(file, srcNode?.line ?? h2.line, bodyText(srcNode));
	if (srcNode && !c.sources.length) err(file, srcNode.line, `${id}: needs at least one source with a URL`);

	if (COMPANY_IDS.has(id) || secText(h2, "job functions")) {
		const roles = [];
		for (const raw of secText(h2, "job functions").split("\n")) {
			const m = raw.match(/^\s*[-*]\s+\*\*(.+?)\*\*\s*[—–-]+\s*(.+)$/);
			if (m) roles.push({ name: m[1].trim(), html: inline(m[2]) });
		}
		if (COMPANY_IDS.has(id) && !roles.length)
			err(file, findH3(h2, "job functions")?.line ?? h2.line, `${id}: Job functions needs "- **Role** — what they do" lines`);
		c.industry = {
			sells: md(secText(h2, "sells")),
			buysFrom: md(secText(h2, "buys from")),
			sellsTo: md(secText(h2, "sells to")),
			roles,
			companies: md(secText(h2, "example companies")),
		};
	}

	// Cross-checks over the raw text of the whole concept.
	const raw = [h2.body.join("\n"), ...h2.h3.map((s) => s.body.join("\n"))].join("\n");
	checkRefs(file, h2.line, raw);
	const nonSource = h2.h3.filter((s) => s.title.toLowerCase() !== "sources").map((s) => s.body.join("\n")).join("\n");
	const nonCode = nonSource.replace(/```[\s\S]*?```/g, "");
	for (const m of nonCode.matchAll(/\[(\d+(?:\s*[,–-]\s*\d+)*)\](?!\()/g)) {
		for (const n of m[1].split(/[,–-]/).map((x) => Number(x.trim()))) {
			if (n < 1 || n > c.sources.length) warn(file, h2.line, `${id}: citation [${n}] has no matching source`);
		}
	}
	c.unverified = (raw.match(/\[unverified(?::[^\]]*)?\]/gi) ?? []).length;
	ctx.concepts[id] = c;
	return c;
}

// ---------------------------------------------------------------------------
// Glossary

function parseGlossary(file, ctx) {
	const doc = parseDoc(file);
	const out = [];
	doc.text.split("\n").forEach((line, i) => {
		const m = line.match(/^- \*\*(.+?)\*\*\s*[—–]\s*(.+)$/);
		if (m) {
			checkRefs(file, i + 1, m[2]);
			out.push({
				term: m[1].trim(),
				html: inline(m[2].trim()),
				refs: [...m[2].matchAll(/\[\[([a-z0-9-]+)/g)].map((x) => x[1]),
			});
		} else if (/^- /.test(line)) warn(file, i + 1, `glossary line should be "- **Term** — definition": ${line.slice(0, 60)}`);
	});
	if (out.length < 20) warn(file, 1, `glossary has only ${out.length} entries`);
	const terms = new Set();
	for (const g of out) {
		const k = g.term.toLowerCase();
		if (terms.has(k)) warn(file, 0, `duplicate glossary term ${g.term}`);
		terms.add(k);
	}
	return out.sort((a, b) => a.term.localeCompare(b.term));
}

// ---------------------------------------------------------------------------
// Simulation: rides

function parseQuestion(file, line, text, where) {
	const prompt = [];
	const options = [];
	for (const l of text.split("\n")) {
		const m = l.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.+?)\s+::\s+(.+)$/);
		if (m) options.push({ text: m[2].trim(), correct: m[1].toLowerCase() === "x", why: m[3].trim() });
		else if (/^\s*[-*]\s+\[/.test(l)) err(file, line, `${where}: option must be "- [ ] text :: why" — got: ${l.trim()}`);
		else if (l.trim() && options.length) options[options.length - 1].why += ` ${l.trim()}`;
		else if (l.trim()) prompt.push(l);
	}
	if (!prompt.join("").trim()) err(file, line, `${where}: question has no prompt text`);
	if (options.length < 3 || options.length > 4) err(file, line, `${where}: question needs 3 or 4 options (has ${options.length})`);
	const nCorrect = options.filter((o) => o.correct).length;
	if (nCorrect !== 1) err(file, line, `${where}: question needs exactly one [x] option (has ${nCorrect})`);
	return {
		prompt: md(prompt.join("\n")),
		options: options.map((o) => ({ text: inline(o.text), correct: o.correct, why: inline(o.why) })),
	};
}

function validatePuzzle(file, line, type, data, where) {
	const bad = (msg) => err(file, line, `${where}: ${msg}`);
	if (!data || typeof data !== "object") return bad("puzzle Data is missing");
	const str = (v) => typeof v === "string" && v.trim().length > 0;
	if (type === "choice") {
		if (!Array.isArray(data.options) || data.options.length < 3) return bad("choice needs at least 3 options");
		if (data.options.filter((o) => o.correct === true).length !== 1) bad("choice needs exactly one correct option");
		data.options.forEach((o, i) => {
			if (!str(o.text) || !str(o.why)) bad(`option ${i + 1} needs text and why`);
			o.text = inline(o.text);
			o.why = inline(o.why);
		});
	} else if (type === "match") {
		if (!Array.isArray(data.options) || data.options.length < 2) return bad("match needs at least 2 options");
		if (!Array.isArray(data.rows) || data.rows.length < 2) return bad("match needs at least 2 rows");
		const ids = data.options.map((o) => o.id);
		data.options.forEach((o) => {
			if (!str(o.id) || !str(o.label)) bad("each match option needs id and label");
			o.label = inline(o.label);
		});
		data.rows.forEach((r, i) => {
			if (!str(r.item)) bad(`row ${i + 1} needs item`);
			if (!ids.includes(r.answer)) bad(`row ${i + 1} answer "${r.answer}" is not an option id`);
			if (!r.why || typeof r.why !== "object") return bad(`row ${i + 1} needs a why object`);
			for (const id of ids) {
				if (!str(r.why[id])) bad(`row ${i + 1} ("${r.item}") needs why.${id}`);
				else r.why[id] = inline(r.why[id]);
			}
			r.item = inline(r.item);
		});
	} else if (type === "order") {
		if (!Array.isArray(data.items) || data.items.length < 3) return bad("order needs at least 3 items");
		data.items.forEach((it, i) => {
			if (!str(it.id) || !str(it.label) || !str(it.why)) bad(`item ${i + 1} needs id, label, why`);
			it.label = inline(it.label);
			it.why = inline(it.why);
		});
	} else if (type === "budget") {
		for (const k of ["start_ms", "target_ms", "budget"]) if (typeof data[k] !== "number") bad(`budget needs numeric ${k}`);
		if (!Array.isArray(data.options) || data.options.length < 3) return bad("budget needs at least 3 options");
		data.options.forEach((o, i) => {
			if (!str(o.id) || !str(o.label) || !str(o.why)) bad(`option ${i + 1} needs id, label, why`);
			if (typeof o.saves_ms !== "number" || typeof o.cost !== "number") bad(`option ${i + 1} needs numeric saves_ms and cost`);
			o.label = inline(o.label);
			o.why = inline(o.why);
		});
		const n = data.options.length;
		if (n <= 18) {
			let feasible = false;
			for (let mask = 0; mask < 1 << n && !feasible; mask++) {
				let cost = 0;
				let saved = 0;
				for (let b = 0; b < n; b++)
					if (mask & (1 << b)) {
						cost += data.options[b].cost;
						saved += data.options[b].saves_ms;
					}
				if (cost <= data.budget && data.start_ms - saved <= data.target_ms) feasible = true;
			}
			if (!feasible) bad("no combination of options meets target_ms within budget");
		}
		const totalCost = data.options.reduce((a, o) => a + o.cost, 0);
		if (totalCost <= data.budget) warn(file, line, `${where}: budget lets the rider buy every option, so there is no trade-off`);
		if (!data.options.some((o) => o.saves_ms <= 0.1 * (data.start_ms - data.target_ms)))
			warn(file, line, `${where}: add at least one tempting option that saves little or nothing`);
	} else {
		bad(`unknown puzzle type "${type}" (choice, match, order, budget)`);
	}
	return data;
}

function parseRideFile(file, ctx) {
	const doc = parseDoc(file);
	const fm = doc.fm;
	for (const k of ["ride", "title", "order", "teaches"]) if (!fm[k]) err(file, 1, `frontmatter needs ${k}:`);
	const ride = {
		id: fm.ride,
		title: fm.title,
		order: Number(fm.order),
		teaches: csv(fm.teaches).map(Number),
		file: rel(file),
		intro: null,
		stops: [],
		puzzle: null,
	};
	const stopIds = new Set();
	for (const h2 of doc.h2) {
		if (h2.title === "Intro") {
			ride.intro = { plain: md(secText(h2, "plain")), precise: md(secText(h2, "precise")) };
			if (!secText(h2, "plain") || !secText(h2, "precise")) err(file, h2.line, "Intro needs Plain and Precise");
		} else if (h2.title.startsWith("Stop:")) {
			const id = h2.title.slice(5).trim();
			const where = `stop ${id}`;
			if (!KEBAB.test(id)) err(file, h2.line, `stop id "${id}" must be kebab-case`);
			if (stopIds.has(id)) err(file, h2.line, `duplicate stop id ${id}`);
			stopIds.add(id);
			const meta = h2.meta;
			if (!meta.title) err(file, h2.line, `${where}: needs title:`);
			if (!meta.cargo) err(file, h2.line, `${where}: needs cargo:`);
			else if (meta.cargo.length > 40) err(file, h2.metaLine.cargo, `${where}: cargo tag is ${meta.cargo.length} chars (max 40)`);
			const concepts = csv(meta.concepts);
			if (!concepts.length) err(file, h2.line, `${where}: needs concepts:`);
			for (const c of concepts) if (!REG.has(c)) err(file, h2.metaLine.concepts, `${where}: unknown concept ${c}`);
			ctx.stopConceptRefs.push(...concepts.map((c) => ({ file, line: h2.line, id: c })));
			if (meta.workbench && !WORKBENCH_IDS.includes(meta.workbench)) err(file, h2.metaLine.workbench, `${where}: unknown workbench ${meta.workbench}`);
			let delay = null;
			if (meta.delay_ms !== undefined) {
				delay = parseRange(meta.delay_ms);
				if (delay === undefined) {
					err(file, h2.metaLine.delay_ms, `${where}: delay_ms must be a number or range like 5-15`);
					delay = null;
				}
			}
			if (ride.id === "ride3" && !delay) err(file, h2.line, `${where}: ride 3 stops need delay_ms`);
			const mode = meta.mode ?? "both";
			if (!["both", "classical", "learned"].includes(mode)) err(file, h2.metaLine.mode, `${where}: mode must be both, classical, or learned`);
			for (const s of ["plain", "precise", "question"]) if (!secText(h2, s)) err(file, h2.line, `${where}: missing ### ${s}`);
			checkRefs(file, h2.line, h2.h3.map((s) => s.body.join("\n")).join("\n"));
			ride.stops.push({
				id,
				title: meta.title ?? id,
				cargo: meta.cargo ?? "",
				cargoDetail: meta.cargo_detail ?? "",
				concepts,
				workbench: meta.workbench ?? null,
				delay,
				mode,
				replaces: csv(meta.replaces),
				plain: md(secText(h2, "plain")),
				precise: md(secText(h2, "precise")),
				question: secText(h2, "question") ? parseQuestion(file, findH3(h2, "question").line, secText(h2, "question"), where) : null,
				_line: h2.line,
			});
		} else if (h2.title === "Puzzle") {
			const type = h2.meta.type;
			if (!h2.meta.title) err(file, h2.line, "Puzzle needs title:");
			for (const s of ["prompt", "data", "debrief"]) if (!secText(h2, s)) err(file, h2.line, `Puzzle missing ### ${s}`);
			const dataNode = findH3(h2, "data");
			const data = dataNode ? fencedJson(file, dataNode.line, bodyText(dataNode)) : null;
			ride.puzzle = {
				title: h2.meta.title ?? "",
				type,
				prompt: md(secText(h2, "prompt")),
				data: validatePuzzle(file, dataNode?.line ?? h2.line, type, data, `${ride.id} puzzle`),
				debrief: md(secText(h2, "debrief")),
			};
		} else {
			warn(file, h2.line, `unexpected section "## ${h2.title}"`);
		}
	}
	if (!ride.intro) err(file, 1, "ride needs ## Intro");
	if (ride.stops.length < 4) err(file, 1, `ride has ${ride.stops.length} stops (need at least 4)`);
	if (!ride.puzzle) err(file, 1, "ride needs ## Puzzle");
	const classical = new Set(ride.stops.filter((s) => s.mode === "classical").map((s) => s.id));
	for (const s of ride.stops) {
		if (s.replaces.length && s.mode !== "learned") err(file, s._line, `stop ${s.id}: only learned stops may use replaces:`);
		for (const r of s.replaces) if (!classical.has(r)) err(file, s._line, `stop ${s.id}: replaces ${r}, which is not a classical stop in this ride`);
		delete s._line;
	}
	if (ride.id === "ride2") {
		if (!ride.stops.some((s) => s.mode === "learned")) err(file, 1, "ride2 needs at least one mode: learned stop");
		if (!ride.stops.some((s) => s.mode === "classical")) err(file, 1, "ride2 needs mode: classical stops");
	}
	return ride;
}

// ---------------------------------------------------------------------------
// Simulation: workbenches, town, showroom

function parseWorkbenches(file, ctx) {
	const doc = parseDoc(file);
	const out = [];
	for (const h2 of doc.h2) {
		if (!h2.title.startsWith("Workbench:")) {
			warn(file, h2.line, `unexpected section "## ${h2.title}"`);
			continue;
		}
		const id = h2.title.slice(10).trim();
		if (!WORKBENCH_IDS.includes(id)) err(file, h2.line, `unknown workbench id ${id}`);
		const m = h2.meta;
		for (const k of ["title", "ride", "stop", "concepts", "order"]) if (!m[k]) err(file, h2.line, `${id}: needs ${k}:`);
		const concepts = csv(m.concepts);
		for (const c of concepts) if (!REG.has(c)) err(file, h2.metaLine.concepts, `${id}: unknown concept ${c}`);
		ctx.stopConceptRefs.push(...concepts.map((c) => ({ file, line: h2.line, id: c })));
		for (const s of ["goal", "plain", "precise", "how to use", "what to notice", "data"]) if (!secText(h2, s)) err(file, h2.line, `${id}: missing ### ${s}`);
		checkRefs(file, h2.line, h2.h3.map((s) => s.body.join("\n")).join("\n"));
		const dataNode = findH3(h2, "data");
		out.push({
			id,
			title: m.title ?? id,
			ride: m.ride,
			stop: m.stop,
			order: Number(m.order),
			concepts,
			goal: md(secText(h2, "goal")),
			plain: md(secText(h2, "plain")),
			precise: md(secText(h2, "precise")),
			howTo: md(secText(h2, "how to use")),
			notice: md(secText(h2, "what to notice")),
			data: dataNode ? fencedJson(file, dataNode.line, bodyText(dataNode)) : null,
		});
	}
	return out.sort((a, b) => a.order - b.order);
}

function parseTown(file, ctx) {
	const doc = parseDoc(file);
	const districts = [];
	const buildings = [];
	for (const h2 of doc.h2) {
		checkRefs(file, h2.line, h2.h3.map((s) => s.body.join("\n")).join("\n"));
		if (h2.title.startsWith("District:")) {
			const id = h2.title.slice(9).trim();
			const m = h2.meta;
			if (!m.title || !m.concept) err(file, h2.line, `district ${id}: needs title: and concept:`);
			if (m.concept && !REG.has(m.concept)) err(file, h2.metaLine.concept, `district ${id}: unknown concept ${m.concept}`);
			if (m.concept) ctx.stopConceptRefs.push({ file, line: h2.line, id: m.concept });
			for (const s of ["plain", "sells", "buys from", "sells to"]) if (!secText(h2, s)) err(file, h2.line, `district ${id}: missing ### ${s}`);
			districts.push({
				id,
				title: m.title ?? id,
				concept: m.concept,
				tagline: m.tagline ?? "",
				plain: md(secText(h2, "plain")),
				sells: md(secText(h2, "sells")),
				buysFrom: md(secText(h2, "buys from")),
				sellsTo: md(secText(h2, "sells to")),
			});
		} else if (h2.title.startsWith("Building:")) {
			const id = h2.title.slice(9).trim();
			const m = h2.meta;
			if (!m.title || !m.district) err(file, h2.line, `building ${id}: needs title: and district:`);
			const roles = [];
			for (const raw of secText(h2, "job functions").split("\n")) {
				const mm = raw.match(/^\s*[-*]\s+\*\*(.+?)\*\*\s*[—–-]+\s*(.+)$/);
				if (mm) roles.push({ name: mm[1].trim(), html: inline(mm[2]) });
			}
			if (!roles.length) err(file, h2.line, `building ${id}: Job functions needs "- **Role** — what they do" lines`);
			if (!secText(h2, "about")) err(file, h2.line, `building ${id}: missing ### About`);
			buildings.push({ id, title: m.title ?? id, district: m.district, about: md(secText(h2, "about")), roles, _line: h2.line });
		} else {
			warn(file, h2.line, `unexpected section "## ${h2.title}"`);
		}
	}
	const dIds = new Set(districts.map((d) => d.id));
	for (const b of buildings) {
		if (!dIds.has(b.district)) err(file, b._line, `building ${b.id}: unknown district ${b.district}`);
		delete b._line;
	}
	return { districts, buildings };
}

function parseShowroom(file, ctx) {
	const doc = parseDoc(file);
	const out = [];
	for (const h2 of doc.h2) {
		if (!h2.title.startsWith("Robot:")) {
			warn(file, h2.line, `unexpected section "## ${h2.title}"`);
			continue;
		}
		const id = h2.title.slice(6).trim();
		const m = h2.meta;
		for (const k of ["title", "concept", "payload_kg", "reach_mm", "speed", "height_mm"]) if (!m[k]) err(file, h2.line, `robot ${id}: needs ${k}:`);
		if (m.concept && !REG.has(m.concept)) err(file, h2.metaLine.concept, `robot ${id}: unknown concept ${m.concept}`);
		if (m.concept) ctx.stopConceptRefs.push({ file, line: h2.line, id: m.concept });
		const payload = parseRange(m.payload_kg);
		const reach = parseRange(m.reach_mm);
		const height = parseRange(m.height_mm);
		if (payload === undefined) err(file, h2.metaLine.payload_kg, `robot ${id}: payload_kg must be a number or range`);
		if (reach === undefined) err(file, h2.metaLine.reach_mm, `robot ${id}: reach_mm must be a number or range`);
		if (height === undefined) err(file, h2.metaLine.height_mm, `robot ${id}: height_mm must be a number`);
		const srcNode = findH3(h2, "sources");
		const sources = parseSources(file, srcNode?.line ?? h2.line, bodyText(srcNode));
		if (!sources.length) err(file, h2.line, `robot ${id}: needs ### Sources with at least one URL`);
		out.push({
			id,
			title: m.title ?? id,
			concept: m.concept,
			payloadKg: payload ?? null,
			reachMm: reach ?? null,
			// Optional caption that replaces the numeric reach on screen (for robots whose reach_mm is a
			// drawing size, such as a mobile base's footprint).
			reachText: m.reach_text ? inline(m.reach_text) : null,
			heightMm: height ?? null,
			speed: inline(m.speed ?? ""),
			notes: md(secText(h2, "notes")),
			sources,
		});
	}
	return out;
}

// ---------------------------------------------------------------------------
// Dependency graph

function dependencyGraph(ctx, areas) {
	const concepts = ctx.concepts;
	const level = {};
	const visiting = new Set();
	const cycles = [];
	const lvl = (id, stack) => {
		if (level[id] !== undefined) return level[id];
		if (visiting.has(id)) {
			cycles.push([...stack, id].join(" -> "));
			return 0;
		}
		visiting.add(id);
		const reqs = (concepts[id]?.requires ?? []).filter((r) => concepts[r]);
		const v = reqs.length ? 1 + Math.max(...reqs.map((r) => lvl(r, [...stack, id]))) : 0;
		visiting.delete(id);
		level[id] = v;
		return v;
	};
	for (const id of Object.keys(concepts)) lvl(id, []);
	for (const cyc of [...new Set(cycles)]) err(join(K, "registry.md"), 0, `requires: cycle ${cyc}`);

	const nid = (id) => id.replace(/-/g, "_");
	const lines = [
		"# Concept dependency graph",
		"",
		"Generated by `tools/build-content.mjs` from the `requires:` line of each concept. Do not edit by hand.",
		"An arrow A --> B means: understand A before B.",
		"",
		"## Graph",
		"",
		"```mermaid",
		"flowchart LR",
	];
	for (const a of areas) {
		lines.push(`  subgraph area${a.area}["${a.area}. ${a.title}"]`);
		for (const id of a.concepts) lines.push(`    ${nid(id)}["${concepts[id].title.replace(/"/g, "'")}"]`);
		lines.push("  end");
	}
	for (const a of areas)
		for (const id of a.concepts)
			for (const r of concepts[id].requires) if (concepts[r]) lines.push(`  ${nid(r)} --> ${nid(id)}`);
	lines.push("```", "", "## Reading order by depth", "", "Depth 0 needs nothing else first. Each later depth builds only on earlier ones.", "");
	const maxLevel = Math.max(0, ...Object.values(level));
	for (let d = 0; d <= maxLevel; d++) {
		const ids = areas.flatMap((a) => a.concepts).filter((id) => level[id] === d);
		if (!ids.length) continue;
		lines.push(`### Depth ${d}`, "");
		for (const id of ids) {
			const reqs = concepts[id].requires;
			lines.push(`- **${concepts[id].title}** (\`${id}\`, area ${concepts[id].area})${reqs.length ? ` — after ${reqs.map((r) => `\`${r}\``).join(", ")}` : ""}`);
		}
		lines.push("");
	}
	lines.push("## Prerequisites by concept", "", "| Concept | Area | Requires | Required by |", "|---|---|---|---|");
	for (const a of areas)
		for (const id of a.concepts) {
			const by = Object.values(concepts)
				.filter((c) => c.requires.includes(id))
				.map((c) => `\`${c.id}\``);
			lines.push(`| ${concepts[id].title} | ${a.area} | ${concepts[id].requires.map((r) => `\`${r}\``).join(", ") || "none"} | ${by.join(", ") || "none"} |`);
		}
	lines.push("");
	return { markdown: lines.join("\n"), level };
}

// ---------------------------------------------------------------------------
// Main

function listFiles() {
	const conceptFiles = existsSync(K)
		? readdirSync(K)
				.filter((f) => /^\d\d-[a-z0-9-]+\.md$/.test(f))
				.sort()
				.map((f) => join(K, f))
		: [];
	const simFiles = existsSync(SIM)
		? readdirSync(SIM)
				.filter((f) => f.endsWith(".md"))
				.sort()
				.map((f) => join(SIM, f))
		: [];
	const glossary = join(K, "glossary.md");
	return { conceptFiles, simFiles, glossary: existsSync(glossary) ? glossary : null };
}

function main() {
	const all = listFiles();
	const pick = (files) => (fullMode ? files : files.filter((f) => fileArgs.includes(f)));
	if (!fullMode)
		for (const f of fileArgs) {
			if (!existsSync(f)) err(f, 0, "file not found");
		}
	// In --check FILE mode, accept concept files anywhere (for example knowledge/_parts/07b-*.md).
	const conceptFiles = fullMode
		? all.conceptFiles
		: fileArgs.filter((f) => /\/\d\d[a-z]?-[a-z0-9-]+\.md$/.test(f) && !f.includes("/sim/") && existsSync(f));
	const simFiles = pick(all.simFiles);
	const glossaryFile = all.glossary && (fullMode || fileArgs.includes(all.glossary)) ? all.glossary : null;

	const ctx = { concepts: {}, stopConceptRefs: [] };
	const areas = conceptFiles.map((f) => parseConceptFile(f, ctx)).sort((a, b) => a.area - b.area);

	const content = {
		version: 1,
		areas,
		concepts: ctx.concepts,
		conceptOrder: areas.flatMap((a) => a.concepts),
		glossary: glossaryFile ? parseGlossary(glossaryFile, ctx) : [],
		rides: [],
		workbenches: [],
		town: { districts: [], buildings: [] },
		showroom: [],
		stats: {},
	};

	for (const f of simFiles) {
		const name = f.split("/").pop();
		if (/^ride\d-[a-z0-9-]+\.md$/.test(name)) content.rides.push(parseRideFile(f, ctx));
		else if (name === "workbenches.md") content.workbenches = parseWorkbenches(f, ctx);
		else if (name === "town.md") content.town = parseTown(f, ctx);
		else if (name === "showroom.md") content.showroom = parseShowroom(f, ctx);
		else warn(f, 0, "unrecognized sim file name (expected rideN-*.md, workbenches.md, town.md, showroom.md)");
	}
	content.rides.sort((a, b) => a.order - b.order);

	// Cross-file checks that need everything parsed.
	if (fullMode) {
		const parsedFiles = new Set(conceptFiles.map((f) => f.split("/").pop()));
		const refCheck = (file, line, id, what) => {
			if (ctx.concepts[id]) return;
			const reg = REG.get(id);
			if (reg && parsedFiles.has(reg.file)) err(file, line, `${what} ${id} is registered but missing from ${reg.file}`);
			else if (reg) warn(file, line, `${what} ${id}: ${reg.file} does not exist yet`);
		};
		for (const c of Object.values(ctx.concepts)) {
			for (const r of c.requires) refCheck(join(ROOT, c.file), 0, r, `${c.id} requires`);
			for (const x of c.connects) refCheck(join(ROOT, c.file), 0, x.id, `${c.id} connects to`);
		}
		for (const r of ctx.stopConceptRefs) refCheck(r.file, r.line, r.id, "sim reference to concept");
		for (const r of INLINE_REFS) refCheck(r.file, r.line, r.id, "link [[id]] to");
		const rides = new Map(content.rides.map((r) => [r.id, r]));
		for (const wb of content.workbenches) {
			const ride = rides.get(wb.ride);
			if (!ride) warn(join(SIM, "workbenches.md"), 0, `${wb.id}: ride ${wb.ride} has no file yet`);
			else if (!ride.stops.some((s) => s.id === wb.stop)) err(join(SIM, "workbenches.md"), 0, `${wb.id}: ride ${wb.ride} has no stop ${wb.stop}`);
		}
		const wbIds = new Set(content.workbenches.map((w) => w.id));
		for (const r of content.rides)
			for (const s of r.stops)
				if (s.workbench && content.workbenches.length && !wbIds.has(s.workbench))
					err(join(ROOT, r.file), 0, `stop ${s.id}: workbench ${s.workbench} is not defined in sim/workbenches.md`);
	}

	let graph = null;
	if (areas.length) graph = dependencyGraph(ctx, areas);

	const concepts = Object.values(ctx.concepts);
	content.stats = {
		areas: areas.length,
		concepts: concepts.length,
		sources: concepts.reduce((a, c) => a + c.sources.length, 0),
		unverifiedFlags: concepts.reduce((a, c) => a + c.unverified, 0),
		glossaryTerms: content.glossary.length,
		rides: content.rides.length,
		stops: content.rides.reduce((a, r) => a + r.stops.length, 0),
		workbenches: content.workbenches.length,
	};

	if (!quiet || errors.length) {
		for (const w of warnings) console.log(`warning: ${w}`);
		for (const e of errors) console.log(`error: ${e}`);
	}
	const s = content.stats;
	console.log(
		`${s.areas} areas, ${s.concepts} concepts, ${s.sources} sources, ${s.unverifiedFlags} unverified flags, ${s.glossaryTerms} glossary terms, ${s.rides} rides, ${s.stops} stops, ${s.workbenches} workbenches | ${warnings.length} warnings, ${errors.length} errors`,
	);
	if (errors.length) {
		console.log(checkOnly ? "check failed" : "not writing outputs because of errors");
		process.exit(1);
	}
	if (checkOnly || !fullMode) return;

	const banner = "// GENERATED by tools/build-content.mjs from /knowledge. Do not edit by hand.\n";
	writeFileSync(OUT, `${banner}export const CONTENT = ${JSON.stringify(content, null, 1)};\nexport default CONTENT;\n`);
	if (graph) writeFileSync(join(K, "dependency-graph.md"), graph.markdown);
	console.log(`wrote ${rel(OUT)}${graph ? ` and ${rel(join(K, "dependency-graph.md"))}` : ""}`);
}

main();
