import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@site": path.resolve(__dirname, "./src/site-package/kellogg"),
      // "@site": path.resolve(__dirname, "./src/site-package/lilian"),
      "@Management": path.resolve(__dirname, "./src/core-adminApp/ui/Management"),
      
    },
  },
  server: {
    port: 3000,
    // open: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8787',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },

})