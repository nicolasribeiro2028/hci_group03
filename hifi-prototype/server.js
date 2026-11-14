// Local server for the prototype. Serves the files and, for the optional "Real replies" toggle, keeps a question log.
// No model is called here. A terminal agent reads agent/log.md and writes the replies (see agent/PROMPT.md).
// Run: node server.js   (PORT=8765 by default)
const fs = require("fs");
const http = require("http");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 8765;
const logPath = path.join(root, "agent", "log.md");
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".pdf": "application/pdf",
};

function send(res, status, body, type, extra) {
  res.writeHead(status, Object.assign({ "Content-Type": type, "Cache-Control": "no-store" }, extra || {}));
  res.end(body);
}
function sendJson(res, status, data) { send(res, status, JSON.stringify(data), "application/json; charset=utf-8"); }

function isBlocked(rel) {
  const normal = path.posix.normalize(rel);
  return normal.startsWith("/agent/") || normal.startsWith("/optimization-test/") || normal.endsWith(".local.json") || normal.split("/").includes("..");
}
function serveStatic(req, res) {
  const url = new URL(req.url, "http://127.0.0.1");
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/index.html";
  if (isBlocked(rel)) return send(res, 404, "Not found", "text/plain; charset=utf-8");
  const file = path.resolve(root, `.${rel}`);
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return send(res, 404, "Not found", "text/plain; charset=utf-8");
  fs.readFile(file, (err, body) => {
    if (err) return send(res, 404, "Not found", "text/plain; charset=utf-8");
    // Last-Modified lets the page reload itself on localhost when you rebuild (see src/dev.html).
    const mtime = fs.statSync(file).mtime.toUTCString();
    send(res, 200, req.method === "HEAD" ? "" : body, types[path.extname(file)] || "application/octet-stream", { "Last-Modified": mtime });
  });
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
function nextQuestionId(text) {
  let max = 0;
  for (const m of text.matchAll(/^## q-(\d+)\s*$/gm)) max = Math.max(max, Number(m[1]));
  return `q-${max + 1}`;
}
const clean = (v) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "");

function appendQuestion(req, res) {
  readBody(req).then((raw) => {
    let data;
    try { data = JSON.parse(raw); } catch { return sendJson(res, 400, { error: "Bad request" }); }
    const question = clean(data.question), context = clean(data.context);
    if (!question) return sendJson(res, 400, { error: "Missing question" });
    const notes = Array.isArray(data.notes) ? data.notes : [];
    const lines = notes.map((n) => `- ${clean(n && n.name)}: ${clean(n && n.note)}`.trimEnd());
    let existing = "";
    try { existing = fs.readFileSync(logPath, "utf8"); } catch { existing = ""; }
    const id = nextQuestionId(existing);
    const block = [`## ${id}`, `question: ${question}`, `context: ${context}`, "notes:", ...(lines.length ? lines : ["-"]), ""].join("\n");
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, `${existing && !existing.endsWith("\n") ? "\n" : ""}${block}`);
    sendJson(res, 200, { id });
  }).catch(() => sendJson(res, 500, { error: "Could not write the log" }));
}

http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (req.method === "GET" && url.pathname === "/log") {
    return fs.readFile(logPath, "utf8", (err, text) => sendJson(res, 200, { text: err ? "" : text }));
  }
  if (req.method === "POST" && url.pathname === "/ask") return appendQuestion(req, res);
  if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res);
  send(res, 405, "Method not allowed", "text/plain; charset=utf-8");
}).listen(port, "127.0.0.1", () => console.log(`http://127.0.0.1:${port}`));
