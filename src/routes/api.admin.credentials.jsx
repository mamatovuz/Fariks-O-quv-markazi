import { createFileRoute } from "@tanstack/react-router";
import { createSessionCookie, requireAdmin, verifyAdminLogin } from "@/lib/admin-auth.server";
import { readAuthSettings, updateAuthSettings } from "@/lib/site-content.server";

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });
}

export const Route = createFileRoute("/api/admin/credentials")({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        const admin = await requireAdmin(request);
        if (!admin.ok) return admin.response;

        const body = await request.json().catch(() => ({}));
        const currentPassword = String(body.currentPassword || "");
        const nextUsername = String(body.username || "").trim();
        const nextPassword = String(body.password || "");
        const auth = await readAuthSettings();

        if (!(await verifyAdminLogin(auth.username, currentPassword))) {
          return json({ ok: false, error: "Hozirgi parol noto'g'ri." }, { status: 400 });
        }

        if (nextUsername.length < 3) {
          return json(
            { ok: false, error: "Login kamida 3 ta belgi bo'lishi kerak." },
            { status: 400 },
          );
        }

        if (nextPassword && nextPassword.length < 8) {
          return json(
            { ok: false, error: "Yangi parol kamida 8 ta belgi bo'lishi kerak." },
            { status: 400 },
          );
        }

        const nextAuth = await updateAuthSettings({
          username: nextUsername,
          password: nextPassword,
        });

        return json(
          { ok: true, username: nextAuth.username },
          {
            headers: {
              "Set-Cookie": createSessionCookie(nextAuth.username),
            },
          },
        );
      },
    },
  },
});
