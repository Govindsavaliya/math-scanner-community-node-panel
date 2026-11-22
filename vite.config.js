import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const vendorChunk = (id) => {
  if (!id.includes("node_modules")) return undefined;
  if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
    return "react";
  }
  if (id.includes("@tanstack")) return "query";
  if (id.includes("@ckeditor")) return "editor";
  return undefined;
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  server: { port: 3000, open: false },
  build: {
    outDir: "build",
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: { output: { manualChunks: vendorChunk } },
  },
});
