import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// 总是使用根路径 "/"，不再根据仓库名称设置
const basePath = "/";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  base: basePath,
});
