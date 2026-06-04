import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/admin-auth.server";
import { saveImageUpload } from "@/lib/uploads.server";

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });
}

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const admin = await requireAdmin(request);
        if (!admin.ok) return admin.response;

        const formData = await request.formData().catch(() => null);
        const file = formData?.get("file");

        try {
          const url = await saveImageUpload(file);
          return json({ ok: true, url });
        } catch (error) {
          return json({ ok: false, error: error.message || "Rasm yuklanmadi." }, { status: 400 });
        }
      },
    },
  },
});
