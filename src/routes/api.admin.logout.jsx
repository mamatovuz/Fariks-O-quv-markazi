import { createFileRoute } from "@tanstack/react-router";
import { clearSessionCookie } from "@/lib/admin-auth.server";

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });
}

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async () =>
        json(
          { ok: true },
          {
            headers: {
              "Set-Cookie": clearSessionCookie(),
            },
          },
        ),
    },
  },
});
