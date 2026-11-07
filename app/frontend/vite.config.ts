import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { seoPlugin } from "./plugins/seo.ts";

export default defineConfig({
  plugins: [react(), seoPlugin()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: {
    target: "es2022",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Pisahkan library pihak ketiga dari chunk utama supaya cache browser lebih awet.
        codeSplitting: {
          groups: [
            { name: "vendor-react", test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: "vendor-router", test: /[\\/]node_modules[\\/](react-router|react-router-dom)[\\/]/ },
            { name: "vendor-icons", test: /[\\/]node_modules[\\/]lucide-react[\\/]/ },
          ],
        },
      },
    },
  },
});
