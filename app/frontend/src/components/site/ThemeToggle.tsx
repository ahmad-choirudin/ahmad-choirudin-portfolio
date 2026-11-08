import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";
const current = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

const apply = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f4f4f4" : "#080808");
  document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", theme);
  window.dispatchEvent(new Event("themechange"));
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(current);

  // Sinkronkan meta tag dan canvas dengan tema awal (hasil theme-init.js / preferensi sistem).
  useEffect(() => apply(theme), []); // eslint-disable-line

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    apply(next);
    // Hanya disimpan saat pengunjung memilih sendiri, supaya preferensi sistem tetap dihormati.
    try { localStorage.setItem("theme", next); } catch { /* storage blocked */ }
  };

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className="grid h-10 w-10 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent"
    >
      {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
