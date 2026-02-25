import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://192.168.1.3:3000",
        changeOrigin: false,
        secure: false,
        ws: true,
      },
      "/socket.io": {
        target: "http://192.168.1.3:3000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
