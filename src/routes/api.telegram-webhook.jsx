import { createFileRoute } from "@tanstack/react-router";

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });
}

export const Route = createFileRoute("/api/telegram-webhook")({
  server: {
    handlers: {
      GET: async () => json({ ok: true }),
      POST: async () => {
        // This endpoint intentionally swallows Telegram updates.
        // The site only sends lead messages; it should never auto-reply in the channel.
        return json({ ok: true });
      },
    },
  },
});
