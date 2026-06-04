import { createFileRoute } from "@tanstack/react-router";
import { readPublicContent } from "@/lib/site-content.server";

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });
}

export const Route = createFileRoute("/api/site-content")({
  server: {
    handlers: {
      GET: async () => json({ ok: true, content: await readPublicContent() }),
    },
  },
});
