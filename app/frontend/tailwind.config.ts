import type { Config } from "tailwindcss";
const token = (name: string) => `rgb(var(--${name}-rgb) / <alpha-value>)`;
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        card: token("card"),
        accent: token("accent"),
        fg: token("fg"),
        muted: token("muted"),
        subtle: token("subtle"),
        line: "rgb(var(--line-rgb) / 0.1)",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        eyebrow: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.22em" }],
        "display-md": ["clamp(2.25rem, 4vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "display-xl": ["clamp(3.25rem, 9vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
      },
      maxWidth: {
        page: "1200px",
      },
    },
  },
  plugins: [],
} satisfies Config;
