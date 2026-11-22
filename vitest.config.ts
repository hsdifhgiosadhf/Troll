import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const SO_LUONG_TOI_DA = 10;

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/kiemthu/*.kiemthu.ts"],
    pool: "threads",
    maxWorkers: SO_LUONG_TOI_DA,
  },
});
