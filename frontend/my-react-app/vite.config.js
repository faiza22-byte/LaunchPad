// vite.config.js
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@shared": path.resolve(__dirname, "src/shared")
    },
  },
  root: __dirname, // <- serve from project root
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});