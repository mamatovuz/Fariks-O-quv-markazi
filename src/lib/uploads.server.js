import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

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
  const targetPath = path.join(uploadDir, filename);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(targetPath, buffer);

  return `/uploads/${filename}`;
}

export { getContentType, getUploadDir, getUploadPath, saveImageUpload };
