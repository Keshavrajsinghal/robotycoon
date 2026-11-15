#!/usr/bin/env node
// Zero-dependency static file server for local use and tests.
//   node tools/serve.mjs [port]      (default 8080; 0 picks a free port)
// Prints "serving http://localhost:<port>/" once listening.

import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2] ?? process.env.PORT ?? 8080);

const TYPES = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".svg": "image/svg+xml",
	".json": "application/json; charset=utf-8",
	".md": "text/markdown; charset=utf-8",
	".txt": "text/plain; charset=utf-8",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
};

const server = createServer((req, res) => {
	let path;
	try {
		path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
	} catch {
		res.writeHead(400).end("bad request");
		return;
	}
	let file = normalize(join(ROOT, path));
	if (file !== ROOT && !file.startsWith(ROOT + sep)) {
		res.writeHead(403).end("forbidden");
		return;
	}
	let st;
	try {
		st = statSync(file);
		if (st.isDirectory()) {
			file = join(file, "index.html");
			st = statSync(file);
		}
	} catch {
		res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("not found");
		return;
	}
	res.writeHead(200, {
		"content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
		"content-length": st.size,
		"cache-control": "no-cache",
	});
	if (req.method === "HEAD") {
		res.end();
		return;
	}
	createReadStream(file).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
	console.log(`serving http://localhost:${server.address().port}/`);
});
