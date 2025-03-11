import { defineConfig } from "vite";

export default defineConfig({
  base: "/Todo-sobre-tu-perro/",
  root: "./src/frontend",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
