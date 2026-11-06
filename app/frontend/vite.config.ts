import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { faq } from "./src/data/faq";

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
});
