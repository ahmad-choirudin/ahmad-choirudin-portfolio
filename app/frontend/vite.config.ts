import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { faq } from "./src/data/faq.ts";

// Menyisipkan JSON-LD FAQPage ke <head> saat build, dari data yang sama dengan yang tampil di halaman,
// sehingga crawler yang tidak menjalankan JavaScript tetap bisa membacanya.
const faqJsonLd = (): Plugin => ({
  name: "faq-jsonld",
  transformIndexHtml: () => [
    {
      tag: "script",
      attrs: { type: "application/ld+json" },
      injectTo: "head",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }).replace(/</g, "\\u003c"),
    },
  ],
});

export default defineConfig({
  plugins: [react(), faqJsonLd()],
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
