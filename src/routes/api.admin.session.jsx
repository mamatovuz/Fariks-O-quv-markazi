import { createFileRoute } from "@tanstack/react-router";
import { getAdminSession } from "@/lib/admin-auth.server";
import { readAuthSettings } from "@/lib/site-content.server";

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });
}

export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await getAdminSession(request);
        const auth = await readAuthSettings();

        return json({
          ok: true,
          authenticated: Boolean(session),
          username: session ? auth.username : "",
        });
      },
    },
  },
});
