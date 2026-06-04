import { createHmac, timingSafeEqual } from "node:crypto";

import { hashPassword, readAuthSettings } from "./site-content.server";

const cookieName = "fariks_admin_session";
const sessionMaxAge = 60 * 60 * 24 * 7;
const secret =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.TELEGRAM_BOT_TOKEN ||
  "fariks-local-admin-session-secret";

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function parseCookie(header) {
  return Object.fromEntries(
    String(header || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return index === -1
          ? [part, ""]
          : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function createSessionCookie(username) {
  const payload = base64UrlEncode(
    JSON.stringify({
      username,
      exp: Date.now() + sessionMaxAge * 1000,
    }),
  );
  const token = `${payload}.${sign(payload)}`;

  return `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionMaxAge}`;
}

function clearSessionCookie() {
  return `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

async function getAdminSession(request) {
  const cookies = parseCookie(request.headers.get("cookie"));
  const token = cookies[cookieName];
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(sign(payload), signature)) return null;

  try {
    const session = JSON.parse(base64UrlDecode(payload));
    if (!session?.username || Date.now() > Number(session.exp || 0)) return null;
    return { username: session.username };
  } catch {
    return null;
  }
}

async function verifyAdminLogin(username, password) {
  const auth = await readAuthSettings();
  return safeEqual(username, auth.username) && safeEqual(hashPassword(password), auth.passwordHash);
}

async function requireAdmin(request) {
  const session = await getAdminSession(request);
  if (!session) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ ok: false, error: "Login talab qilinadi." }), {
        status: 401,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }),
    };
  }

  return { ok: true, session };
}

export { clearSessionCookie, createSessionCookie, getAdminSession, requireAdmin, verifyAdminLogin };
