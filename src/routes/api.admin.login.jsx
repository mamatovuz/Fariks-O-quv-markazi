import { createFileRoute } from "@tanstack/react-router";
import { createSessionCookie, verifyAdminLogin } from "@/lib/admin-auth.server";

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });
}

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({}));
        const username = String(body.username || "").trim();
        const password = String(body.password || "");

        if (!(await verifyAdminLogin(username, password))) {
          return json({ ok: false, error: "Login yoki parol noto'g'ri." }, { status: 401 });
        }

        return json(
          { ok: true },
          {
            headers: {
              "Set-Cookie": createSessionCookie(username),
            },
          },
        );
      },
    },
  },
});
