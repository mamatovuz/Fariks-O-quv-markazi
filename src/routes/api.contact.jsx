import { createFileRoute } from "@tanstack/react-router";

const telegramTimeoutMs = 12_000;
const telegramMaxAttempts = 3;
const telegramChunkSize = 3_400;
const retryableTelegramStatuses = new Set([408, 429, 500, 502, 503, 504]);
const swallowedTelegramUpdates = ["message", "channel_post", "callback_query"];

class TelegramError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "TelegramError";
    this.status = options.status;
    this.description = options.description || message;
    this.retryAfter = options.retryAfter || 0;
  }
}

function clean(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function limit(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
}

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });
}

function getTelegramConfig() {
  const siteUrl = clean(process.env.PUBLIC_SITE_URL || "https://fariksuz.up.railway.app").replace(
    /\/+$/,
    "",
  );

  return {
    token: clean(process.env.TELEGRAM_BOT_TOKEN),
    chatId: clean(process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHANNEL_ID),
    webhookUrl: clean(process.env.TELEGRAM_WEBHOOK_URL || `${siteUrl}/api/telegram-webhook`),
  };
}

function splitTelegramText(text) {
  if (text.length <= telegramChunkSize) return [text];

  const chunks = [];
  let rest = text;

  while (rest.length > telegramChunkSize) {
    const slice = rest.slice(0, telegramChunkSize);
    const breakAt = Math.max(slice.lastIndexOf("\n"), slice.lastIndexOf(" "));
    const cutAt = breakAt > 500 ? breakAt : telegramChunkSize;
    chunks.push(rest.slice(0, cutAt).trim());
    rest = rest.slice(cutAt).trim();
  }

  if (rest) chunks.push(rest);
  return chunks;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readTelegramResponse(response) {
  const rawText = await response.text().catch(() => "");

  if (!rawText) return {};

  try {
    return JSON.parse(rawText);
  } catch {
    return {
      ok: false,
      description: rawText,
    };
  }
}

function getTelegramErrorMessage(error) {
  const description = String(error?.description || error?.message || "").toLowerCase();

  if (error?.status === 401 || description.includes("unauthorized")) {
    return "Telegram bot token noto'g'ri yoki eskirgan. Yangi tokenni server sozlamalariga kiriting.";
  }

  if (error?.status === 403 || description.includes("forbidden")) {
    return "Bot kanalga admin qilib qo'shilmagan yoki xabar yozish huquqi berilmagan.";
  }

  if (
    error?.status === 400 &&
    (description.includes("chat not found") || description.includes("bad request"))
  ) {
    return "Telegram kanal ID noto'g'ri yoki bot shu kanalga qo'shilmagan.";
  }

  if (error?.status === 429) {
    return "Telegram vaqtincha cheklov berdi. Iltimos, bir necha soniyadan keyin qayta urinib ko'ring.";
  }

  return "Telegram kanalga yuborib bo'lmadi. Iltimos, qayta urinib ko'ring.";
}

async function fetchTelegram(url, payload) {
  let lastError;

  for (let attempt = 1; attempt <= telegramMaxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), telegramTimeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const result = await readTelegramResponse(response);

      if (response.ok && result.ok !== false) {
        return result;
      }

      const retryAfter = Number(result?.parameters?.retry_after || 0);
      lastError = new TelegramError(result?.description || `Telegram HTTP ${response.status}`, {
        status: response.status,
        description: result?.description,
        retryAfter,
      });

      if (!retryableTelegramStatuses.has(response.status) || attempt === telegramMaxAttempts) {
        break;
      }

      await wait(retryAfter > 0 ? retryAfter * 1000 : attempt * 750);
    } catch (error) {
      lastError =
        error?.name === "AbortError"
          ? new TelegramError("Telegram timeout", { status: 408 })
          : error;
      if (attempt === telegramMaxAttempts) break;
      await wait(attempt * 750);
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error("Telegramga yuborib bo'lmadi.");
}

async function sendTelegramMessage({ token, chatId, text }) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const chunks = splitTelegramText(text);

  for (const [index, chunk] of chunks.entries()) {
    await fetchTelegram(url, {
      chat_id: chatId,
      text: chunks.length > 1 ? `${chunk}\n\n(${index + 1}/${chunks.length})` : chunk,
      disable_web_page_preview: true,
    });
  }
}

async function ensureTelegramWebhook({ token, webhookUrl }) {
  if (!token || !webhookUrl) return;

  await fetchTelegram(`https://api.telegram.org/bot${token}/setWebhook`, {
    url: webhookUrl,
    drop_pending_updates: true,
    allowed_updates: swallowedTelegramUpdates,
  });
}

function buildMessage({ name, phone, course, details }) {
  const submittedAt = new Intl.DateTimeFormat("uz-UZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tashkent",
  }).format(new Date());

  return [
    "Yangi ariza - FARIKS",
    "",
    `Ism: ${limit(name, 120)}`,
    `Telefon: ${limit(phone, 80)}`,
    `Yo'nalish: ${limit(course, 120)}`,
    "",
    "Batafsil so'rov:",
    limit(details, 7_000),
    "",
    `Vaqt: ${submittedAt}`,
  ].join("\n");
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body;

        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "Ma'lumot formati noto'g'ri." }, { status: 400 });
        }

        const name = clean(body.name);
        const phone = clean(body.phone);
        const course = clean(body.course);
        const details = clean(body.details);

        if (!name || !phone || !course || !details) {
          return json({ ok: false, error: "Barcha maydonlarni to'ldiring." }, { status: 400 });
        }

        const { token, chatId, webhookUrl } = getTelegramConfig();

        if (!token || !chatId) {
          console.error("Telegram config is missing.");
          return json(
            { ok: false, error: "Telegram bot sozlamalari serverda kiritilmagan." },
            { status: 500 },
          );
        }

        try {
          await ensureTelegramWebhook({ token, webhookUrl });
          await sendTelegramMessage({
            token,
            chatId,
            text: buildMessage({ name, phone, course, details }),
          });
          await ensureTelegramWebhook({ token, webhookUrl }).catch((error) => {
            console.error("Telegram webhook refresh after send failed:", error);
          });
        } catch (error) {
          console.error("Telegram sendMessage failed:", error);
          return json({
            ok: true,
            warning: getTelegramErrorMessage(error),
          });
        }

        return json({ ok: true });
      },
    },
  },
});
