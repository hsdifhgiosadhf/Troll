import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // Dùng "./" mặc định để tương thích mọi đường dẫn con trên GitHub Pages,
  // hoặc ghi đè bằng VITE_BASE_URL (ví dụ "/webbanthan/") khi đóng gói phát hành.
  base: process.env["VITE_BASE_URL"] || "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
