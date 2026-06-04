import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";

const maxUploadBytes = 5 * 1024 * 1024;
const uploadDir =
  process.env.CONTENT_UPLOAD_DIR ||
  process.env.UPLOAD_DIR ||
  path.join(process.cwd(), ".data", "uploads");
const mongoDbName = process.env.MONGODB_DB || "fariks";
const mongoUploadsCollectionName = process.env.MONGODB_UPLOADS_COLLECTION || "uploads";
let mongoClientPromise;

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

function getMongoUri() {
  return String(
    process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL || "",
  ).trim();
}

async function getMongoUploadCollection() {
  const uri = getMongoUri();
  if (!uri) return null;

  if (!mongoClientPromise) {
    const client = new MongoClient(uri, {
      connectTimeoutMS: 8_000,
      serverSelectionTimeoutMS: 8_000,
    });
    mongoClientPromise = client.connect().catch((error) => {
      mongoClientPromise = undefined;
      throw error;
    });
  }

  const client = await mongoClientPromise;
  return client.db(mongoDbName).collection(mongoUploadsCollectionName);
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

async function saveMongoImage({ buffer, contentType, filename }) {
  const collection = await getMongoUploadCollection();
  if (!collection) return false;

  const now = new Date();

  await collection.updateOne(
    { _id: filename },
    {
      $set: {
        contentType,
        data: buffer,
        size: buffer.byteLength,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

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
  const savedToMongo = await saveMongoImage({
    buffer,
    contentType: getContentType(filename),
    filename,
  });

  if (!savedToMongo) {
    const targetPath = path.join(uploadDir, filename);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(targetPath, buffer);
  }

  return `/uploads/${filename}`;
}

async function readImageUpload(filename) {
  const safeName = safeUploadName(filename);
  if (!safeName) return null;

  const collection = await getMongoUploadCollection();

  if (collection) {
    const document = await collection.findOne({ _id: safeName });
    const data = toBuffer(document?.data);

    if (data) {
      return {
        contentType: document.contentType || getContentType(safeName),
        data,
      };
    }
  }

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
