import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";
const current = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(current);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f4f4f4" : "#080808");
    document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", theme);
    try { localStorage.setItem("theme", theme); } catch { /* storage blocked */ }
    window.dispatchEvent(new Event("themechange"));
  }, [theme]);

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className="grid h-10 w-10 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent"
    >
      {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
