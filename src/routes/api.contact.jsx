import { createFileRoute } from "@tanstack/react-router";

function clean(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
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

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body;

        try {
          body = await request.json();
        } catch {
          return json({ error: "Ma'lumot formati noto'g'ri." }, { status: 400 });
        }

        const name = clean(body.name);
        const phone = clean(body.phone);
        const course = clean(body.course);
        const details = clean(body.details);

        if (!name || !phone || !course || !details) {
          return json({ error: "Barcha maydonlarni to'ldiring." }, { status: 400 });
        }

        const token = "8924834686:AAFTHgsdbB4um6AUtzG__MtchBXxs40HBzY";
        const chatId = -1003994819171;

        if (!token || !chatId) {
          return json(
            { error: "Telegram bot sozlamalari serverda kiritilmagan." },
            { status: 500 },
          );
        }

        const submittedAt = new Intl.DateTimeFormat("uz-UZ", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Tashkent",
        }).format(new Date());

        const text = [
          "Yangi ariza - FARIKS",
          "",
          `Ism: ${name}`,
          `Telefon: ${phone}`,
          `Yo'nalish: ${course}`,
          `Batafsil so'rov: ${details}`,
          `Vaqt: ${submittedAt}`,
        ].join("\n");

        const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            disable_web_page_preview: true,
          }),
        });

        if (!telegramResponse.ok) {
          const errorText = await telegramResponse.text().catch(() => "");
          console.error("Telegram sendMessage failed:", errorText);
          return json({ error: "Telegram kanalga yuborib bo'lmadi." }, { status: 502 });
        }

        return json({ ok: true });
      },
    },
  },
});
