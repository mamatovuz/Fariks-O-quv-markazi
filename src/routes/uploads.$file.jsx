import fs from "node:fs/promises";
import { createFileRoute } from "@tanstack/react-router";
import { getContentType, getUploadPath } from "@/lib/uploads.server";

export const Route = createFileRoute("/uploads/$file")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const filePath = getUploadPath(params.file);

        if (!filePath) {
          return new Response("Not found", { status: 404 });
        }

        try {
          const data = await fs.readFile(filePath);

          return new Response(data, {
            headers: {
              "Cache-Control": "public, max-age=31536000, immutable",
              "Content-Type": getContentType(params.file),
            },
          });
        } catch (error) {
          if (error?.code !== "ENOENT") console.error("Upload read failed:", error);
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
