import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { getDb } from "@/lib/db.server";

const maxUploadBytes = 5 * 1024 * 1024;
const uploadDir =
  process.env.CONTENT_UPLOAD_DIR ||
  process.env.UPLOAD_DIR ||
  path.join(process.cwd(), ".data", "uploads");

const contentTypeByExt = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const extByContentType = {
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

function getUploadDir() {
  return uploadDir;
}

function getContentType(filename) {
  return contentTypeByExt[path.extname(filename).toLowerCase()] || "application/octet-stream";
}

function safeUploadName(value) {
  const filename = path.basename(String(value || ""));

  if (!filename || filename !== String(value || "") || filename.includes("..")) {
    return "";
  }

  return filename;
}

function getUploadPath(filename) {
  const safeName = safeUploadName(filename);
  if (!safeName) return "";

  const resolved = path.resolve(uploadDir, safeName);
  const root = path.resolve(uploadDir);

  if (resolved !== root && resolved.startsWith(`${root}${path.sep}`)) {
    return resolved;
  }

  return "";
}

function toBuffer(value) {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (value?.buffer) return Buffer.from(value.buffer);
  return null;
}

function saveSqliteImage({ buffer, contentType, filename }) {
  const db = getDb();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO uploads (filename, content_type, data, size, created_at, updated_at)
     VALUES (@filename, @contentType, @data, @size, @now, @now)
     ON CONFLICT(filename) DO UPDATE SET
       content_type = excluded.content_type,
       data = excluded.data,
       size = excluded.size,
       updated_at = excluded.updated_at`,
  ).run({
    filename,
    contentType,
    data: buffer,
    size: buffer.byteLength,
    now,
  });

  return true;
}

async function saveImageUpload(file) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("Rasm fayli topilmadi.");
  }

  const contentType = String(file.type || "").toLowerCase();
  const fileExt = path.extname(String(file.name || "")).toLowerCase();
  const ext = contentTypeByExt[fileExt] ? fileExt : extByContentType[contentType];

  if (!ext) {
    throw new Error("Faqat PNG, JPG, WEBP yoki GIF rasm yuklang.");
  }

  if (Number(file.size || 0) > maxUploadBytes) {
    throw new Error("Rasm hajmi 5 MB dan oshmasin.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.byteLength > maxUploadBytes) {
    throw new Error("Rasm hajmi 5 MB dan oshmasin.");
  }

  const filename = `${Date.now()}-${randomUUID()}${ext}`;
  saveSqliteImage({
    buffer,
    contentType: getContentType(filename),
    filename,
  });

  return `/uploads/${filename}`;
}

async function readImageUpload(filename) {
  const safeName = safeUploadName(filename);
  if (!safeName) return null;

  const db = getDb();
  const row = db.prepare(`SELECT content_type, data FROM uploads WHERE filename = ?`).get(safeName);
  const data = toBuffer(row?.data);

  if (data) {
    return {
      contentType: row.content_type || getContentType(safeName),
      data,
    };
  }

  // Fallback to legacy filesystem uploads (pre-migration files).
  const filePath = getUploadPath(safeName);
  if (!filePath) return null;

  try {
    return {
      contentType: getContentType(safeName),
      data: await fs.readFile(filePath),
    };
  } catch (error) {
    if (error?.code !== "ENOENT") console.error("Upload read failed:", error);
    return null;
  }
}

export { getContentType, getUploadDir, getUploadPath, readImageUpload, saveImageUpload };
