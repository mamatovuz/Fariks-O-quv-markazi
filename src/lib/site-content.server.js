import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { MongoClient } from "mongodb";

import { defaultContent } from "@/data/site-content";

const storePath =
  process.env.CONTENT_STORE_PATH || path.join(process.cwd(), ".data", "site-content.json");
const mongoDbName = process.env.MONGODB_DB || "fariks";
const mongoCollectionName = process.env.MONGODB_COLLECTION || "site_content";
const mongoDocumentId = "main";
let mongoClientPromise;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hashPassword(password) {
  return createHash("sha256").update(String(password)).digest("hex");
}

function defaultStore() {
  return {
    content: clone(defaultContent),
    auth: {
      username: "fariks",
      passwordHash: hashPassword("12345678"),
    },
  };
}

function cleanText(value, fallback = "") {
  return String(value ?? fallback).trim();
}

function normalizeList(value, mapper) {
  return Array.isArray(value) ? value.map(mapper).filter(Boolean) : [];
}

function normalizeCourse(course, index) {
  const title = cleanText(course?.title, `Yangi kurs ${index + 1}`);
  const slug =
    cleanText(course?.slug) ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return {
    slug,
    no: cleanText(course?.no, String(index + 1).padStart(2, "0")),
    title,
    tagline: cleanText(course?.tagline),
    blurb: cleanText(course?.blurb),
    level: cleanText(course?.level),
    duration: cleanText(course?.duration),
    schedule: cleanText(course?.schedule),
    groupSize: cleanText(course?.groupSize),
    price: cleanText(course?.price),
    priceNote: cleanText(course?.priceNote),
    program: normalizeList(course?.program, (item) => ({
      week: cleanText(item?.week),
      title: cleanText(item?.title),
      body: cleanText(item?.body),
    })),
    outcomes: normalizeList(course?.outcomes, (item) => cleanText(item)).filter(Boolean),
    faqs: normalizeList(course?.faqs, (item) => ({
      q: cleanText(item?.q),
      a: cleanText(item?.a),
    })),
  };
}

function normalizeContent(content) {
  const fallback = defaultStore().content;

  return {
    stats: normalizeList(content?.stats, (item) => ({
      number: cleanText(item?.number),
      label: cleanText(item?.label),
    })).length
      ? normalizeList(content?.stats, (item) => ({
          number: cleanText(item?.number),
          label: cleanText(item?.label),
        }))
      : fallback.stats,
    coursesIntro: {
      eyebrow: cleanText(content?.coursesIntro?.eyebrow, fallback.coursesIntro.eyebrow),
      title: cleanText(content?.coursesIntro?.title, fallback.coursesIntro.title),
      emphasis: cleanText(content?.coursesIntro?.emphasis, fallback.coursesIntro.emphasis),
      body: cleanText(content?.coursesIntro?.body, fallback.coursesIntro.body),
    },
    courses: normalizeList(content?.courses, normalizeCourse),
    teachers: normalizeList(content?.teachers, (teacher) => ({
      img: cleanText(teacher?.img),
      name: cleanText(teacher?.name),
      role: cleanText(teacher?.role),
      note: cleanText(teacher?.note),
    })),
  };
}

function normalizeStore(store) {
  const fallback = defaultStore();
  const username = cleanText(store?.auth?.username, fallback.auth.username);
  const passwordHash = cleanText(store?.auth?.passwordHash, fallback.auth.passwordHash);

  return {
    content: normalizeContent(store?.content || fallback.content),
    auth: {
      username,
      passwordHash,
    },
  };
}

function getMongoUri() {
  return String(
    process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL || "",
  ).trim();
}

async function getMongoCollection() {
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
  return client.db(mongoDbName).collection(mongoCollectionName);
}

async function readFileStore() {
  try {
    const text = await fs.readFile(storePath, "utf8");
    return normalizeStore(JSON.parse(text));
  } catch (error) {
    if (error?.code !== "ENOENT") console.error("Site content store read failed:", error);
    return defaultStore();
  }
}

async function writeFileStore(store) {
  const normalized = normalizeStore(store);
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

async function readMongoStore(collection) {
  const document = await collection.findOne({ _id: mongoDocumentId });

  if (document) {
    return normalizeStore(document);
  }

  const seed = await readFileStore();
  await writeMongoStore(collection, seed);
  return seed;
}

async function writeMongoStore(collection, store) {
  const normalized = normalizeStore(store);
  const now = new Date();

  await collection.updateOne(
    { _id: mongoDocumentId },
    {
      $set: {
        auth: normalized.auth,
        content: normalized.content,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  return normalized;
}

async function readStore() {
  const collection = await getMongoCollection();
  if (collection) return readMongoStore(collection);
  return readFileStore();
}

async function writeStore(store) {
  const collection = await getMongoCollection();
  if (collection) return writeMongoStore(collection, store);
  return writeFileStore(store);
}

async function readPublicContent() {
  const store = await readStore();
  return store.content;
}

async function savePublicContent(content) {
  const store = await readStore();
  const next = await writeStore({
    ...store,
    content,
  });
  return next.content;
}

async function readAuthSettings() {
  const store = await readStore();
  return store.auth;
}

async function updateAuthSettings({ username, password }) {
  const store = await readStore();
  const nextAuth = {
    username: cleanText(username, store.auth.username),
    passwordHash: password ? hashPassword(password) : store.auth.passwordHash,
  };
  const next = await writeStore({
    ...store,
    auth: nextAuth,
  });
  return next.auth;
}

export {
  hashPassword,
  normalizeContent,
  readAuthSettings,
  readPublicContent,
  savePublicContent,
  updateAuthSettings,
};
