import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

import { getDb } from "@/lib/db.server";
import { defaultContent } from "@/data/site-content";

const storePath =
  process.env.CONTENT_STORE_PATH || path.join(process.cwd(), ".data", "site-content.json");
const documentId = "main";

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

function normalizeResults(results, fallback) {
  const stories = Array.isArray(results?.stories)
    ? normalizeList(results?.stories, (story) => ({
        quote: cleanText(story?.quote),
        name: cleanText(story?.name),
        where: cleanText(story?.where),
      }))
    : fallback.stories;

  return {
    eyebrow: cleanText(results?.eyebrow, fallback.eyebrow),
    title: cleanText(results?.title, fallback.title),
    emphasis: cleanText(results?.emphasis, fallback.emphasis),
    suffix: cleanText(results?.suffix, fallback.suffix),
    stories,
  };
}

function normalizeContact(contact, fallback) {
  return {
    eyebrow: cleanText(contact?.eyebrow, fallback.eyebrow),
    title: cleanText(contact?.title, fallback.title),
    emphasis: cleanText(contact?.emphasis, fallback.emphasis),
    suffix: cleanText(contact?.suffix, fallback.suffix),
    leadLabel: cleanText(contact?.leadLabel, fallback.leadLabel),
    leadText: cleanText(contact?.leadText, fallback.leadText),
    addressLabel: cleanText(contact?.addressLabel, fallback.addressLabel),
    address: cleanText(contact?.address, fallback.address),
    mapLabel: cleanText(contact?.mapLabel, fallback.mapLabel),
    mapUrl: cleanText(contact?.mapUrl, fallback.mapUrl),
    hoursLabel: cleanText(contact?.hoursLabel, fallback.hoursLabel),
    hours: cleanText(contact?.hours, fallback.hours),
    formEyebrow: cleanText(contact?.formEyebrow, fallback.formEyebrow),
    formTitle: cleanText(contact?.formTitle, fallback.formTitle),
    nameLabel: cleanText(contact?.nameLabel, fallback.nameLabel),
    namePlaceholder: cleanText(contact?.namePlaceholder, fallback.namePlaceholder),
    phoneLabel: cleanText(contact?.phoneLabel, fallback.phoneLabel),
    phonePlaceholder: cleanText(contact?.phonePlaceholder, fallback.phonePlaceholder),
    courseLabel: cleanText(contact?.courseLabel, fallback.courseLabel),
    detailsLabel: cleanText(contact?.detailsLabel, fallback.detailsLabel),
    detailsPlaceholder: cleanText(contact?.detailsPlaceholder, fallback.detailsPlaceholder),
    submitText: cleanText(contact?.submitText, fallback.submitText),
    sendingText: cleanText(contact?.sendingText, fallback.sendingText),
    sentText: cleanText(contact?.sentText, fallback.sentText),
  };
}

function normalizeMarquee(marquee, fallback) {
  return {
    items: Array.isArray(marquee?.items)
      ? normalizeList(marquee.items, (item) => cleanText(item))
      : fallback.items,
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
    marquee: normalizeMarquee(content?.marquee, fallback.marquee),
    results: normalizeResults(content?.results, fallback.results),
    contact: normalizeContact(content?.contact, fallback.contact),
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

// One-time seed source: if the SQLite row does not exist yet, migrate the
// legacy JSON file (if present) so existing content is preserved.
async function readSeedStore() {
  try {
    const text = await fs.readFile(storePath, "utf8");
    return normalizeStore(JSON.parse(text));
  } catch (error) {
    if (error?.code !== "ENOENT") console.error("Site content seed read failed:", error);
    return defaultStore();
  }
}

function writeStore(store) {
  const normalized = normalizeStore(store);
  const db = getDb();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO site_content (id, content, auth_username, auth_password_hash, created_at, updated_at)
     VALUES (@id, @content, @username, @passwordHash, @now, @now)
     ON CONFLICT(id) DO UPDATE SET
       content = excluded.content,
       auth_username = excluded.auth_username,
       auth_password_hash = excluded.auth_password_hash,
       updated_at = excluded.updated_at`,
  ).run({
    id: documentId,
    content: JSON.stringify(normalized.content),
    username: normalized.auth.username,
    passwordHash: normalized.auth.passwordHash,
    now,
  });

  return normalized;
}

async function readStore() {
  const db = getDb();
  const row = db.prepare(`SELECT content, auth_username, auth_password_hash FROM site_content WHERE id = ?`).get(
    documentId,
  );

  if (row) {
    let content;
    try {
      content = JSON.parse(row.content);
    } catch {
      content = {};
    }

    return normalizeStore({
      content,
      auth: {
        username: row.auth_username,
        passwordHash: row.auth_password_hash,
      },
    });
  }

  const seed = await readSeedStore();
  return writeStore(seed);
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
