import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { stripRouteTreeCode, stripRouteTreeFooter } from "./scripts/strip-route-tree-footer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routeTreePath = path.resolve(__dirname, "src/routeTree.gen.js");

function stripRouteTreeTypeFooter() {
  return {
    name: "strip-route-tree-type-footer",
    enforce: "pre",
    configureServer(server) {
      const stripSoon = () => {
        setTimeout(() => stripRouteTreeFooter(), 0);
      };

      server.watcher.on("add", (file) => {
        if (path.normalize(file) === path.normalize(routeTreePath)) stripSoon();
      });
      server.watcher.on("change", (file) => {
        if (path.normalize(file) === path.normalize(routeTreePath)) stripSoon();
      });
    },
    transform(code, id) {
      if (path.normalize(id.split("?")[0]) !== path.normalize(routeTreePath)) return null;

      const stripped = stripRouteTreeCode(code);
      if (stripped === code) return null;

      return {
        code: stripped,
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [
    tanstackStart({
      router: {
        generatedRouteTree: "routeTree.gen.js",
        disableTypes: true,
      },
    }),
    stripRouteTreeTypeFooter(),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
