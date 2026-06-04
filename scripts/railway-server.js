import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

import handler from "../dist/server/server.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const clientDir = path.join(rootDir, "dist/client");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function appendHeaders(target, headers) {
  headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie" && typeof headers.getSetCookie === "function") {
      target.setHeader("set-cookie", headers.getSetCookie());
      return;
    }

    target.setHeader(key, value);
  });
}

function createRequestUrl(request) {
  const protocol = request.headers["x-forwarded-proto"] || "http";
  const hostHeader = request.headers["x-forwarded-host"] || request.headers.host || "localhost";
  return `${protocol}://${hostHeader}${request.url}`;
}

function createWebHeaders(headers) {
  const webHeaders = new Headers();

  Object.entries(headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => webHeaders.append(key, item));
    } else if (value !== undefined) {
      webHeaders.set(key, value);
    }
  });

  return webHeaders;
}

function resolveStaticPath(pathname) {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const normalizedPath = path.normalize(decodedPath).replace(/^[/\\]+/, "");
  const filePath = path.resolve(clientDir, normalizedPath);

  if (!filePath.startsWith(`${clientDir}${path.sep}`)) return null;
  return filePath;
}

async function serveStatic(request, response, pathname) {
  if (pathname === "/" || pathname.endsWith("/")) return false;

  const filePath = resolveStaticPath(pathname);
  if (!filePath) return false;

  let fileStat;

  try {
    fileStat = await stat(filePath);
  } catch {
    return false;
  }

  if (!fileStat.isFile()) return false;

  const extension = path.extname(filePath).toLowerCase();

  response.statusCode = 200;
  response.setHeader("content-type", mimeTypes[extension] || "application/octet-stream");
  response.setHeader("content-length", fileStat.size);

  if (pathname.startsWith("/assets/")) {
    response.setHeader("cache-control", "public, max-age=31536000, immutable");
  } else {
    response.setHeader("cache-control", "public, max-age=0, must-revalidate");
  }

  if (request.method === "HEAD") {
    response.end();
    return true;
  }

  createReadStream(filePath).pipe(response);
  return true;
}

async function handleSsr(request, response) {
  const hasBody = !["GET", "HEAD"].includes(request.method || "GET");
  const webRequest = new Request(createRequestUrl(request), {
    method: request.method,
    headers: createWebHeaders(request.headers),
    body: hasBody ? Readable.toWeb(request) : undefined,
    duplex: hasBody ? "half" : undefined,
  });

  const webResponse = await handler.fetch(webRequest);

  response.statusCode = webResponse.status;
  response.statusMessage = webResponse.statusText;
  appendHeaders(response, webResponse.headers);

  if (request.method === "HEAD" || !webResponse.body) {
    response.end();
    return;
  }

  Readable.fromWeb(webResponse.body).pipe(response);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(createRequestUrl(request));

    if (await serveStatic(request, response, url.pathname)) return;
    await handleSsr(request, response);
  } catch (error) {
    console.error(error);
    if (!response.headersSent) {
      response.statusCode = 500;
      response.setHeader("content-type", "text/plain; charset=utf-8");
    }
    response.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`FARIKS Railway server listening on ${host}:${port}`);
});
