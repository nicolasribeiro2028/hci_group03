const fs = require("fs");
const http = require("http");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function send(res, status, body, type) {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function sendJson(res, status, data) {
  send(res, status, JSON.stringify(data), "application/json; charset=utf-8");
}

function readMaster(res) {
  fs.readFile(path.join(root, "master.local.json"), "utf8", (err, text) => {
    if (err) {
      sendJson(res, 404, { error: "Master login is not set" });
      return;
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      sendJson(res, 404, { error: "Master login is not set" });
      return;
    }
    if (!data || typeof data.email !== "string" || data.email.trim() === "") {
      sendJson(res, 404, { error: "Master login is not set" });
      return;
    }
    sendJson(res, 200, { email: data.email });
  });
}

function isBlocked(rel) {
  const normal = path.posix.normalize(rel);
  return (
    normal === "/master.local.json" ||
    normal === "/agent/log.md" ||
    normal.startsWith("/agent/") ||
    normal.split("/").includes("..")
  );
}

function serveStatic(req, res) {
  const url = new URL(req.url, "http://127.0.0.1");
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/index.html";
  if (isBlocked(rel)) {
    send(res, 404, "Not found", "text/plain; charset=utf-8");
    return;
  }
  const file = path.resolve(root, `.${rel}`);
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    send(res, 404, "Not found", "text/plain; charset=utf-8");
    return;
  }
  fs.readFile(file, (err, body) => {
    if (err) {
      send(res, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }
    send(res, 200, body, types[path.extname(file)] || "application/octet-stream");
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (req.method === "GET" && url.pathname === "/master") {
    readMaster(res);
    return;
  }
  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }
  send(res, 405, "Method not allowed", "text/plain; charset=utf-8");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}`);
});
