import { createFileRoute } from "@tanstack/react-router";
import { readImageUpload } from "@/lib/uploads.server";

export const Route = createFileRoute("/uploads/$file")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const upload = await readImageUpload(params.file);

        if (!upload) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(upload.data, {
          headers: {
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Type": upload.contentType,
          },
        });
      },
    },
  },
});
