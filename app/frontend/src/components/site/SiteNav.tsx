import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { usePath } from "@/router";
import ScrambleText from "./ScrambleText";
import Magnetic from "./Magnetic";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Container } from "./Section";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const path = usePath();
  const isActive = (to: string) => (to === "/" ? path === "/" : path === to || path.startsWith(`${to}/`));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <a href="/" className="flex items-center gap-2 font-medium" onClick={() => setOpen(false)}>
          <Logo className="h-7 w-7" />
          <ScrambleText text={site.name} />
        </a>

        <nav aria-label="Primary" className="hidden gap-8 text-sm md:flex">
          {site.nav.map((n) => (
            <a
              key={n.to}
              href={n.to}
              aria-current={isActive(n.to) ? "page" : undefined}
              className={`transition-colors hover:text-accent ${isActive(n.to) ? "text-accent" : "text-muted"}`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:block">
            <Magnetic>
              <a
                href="/contact"
                className="rounded-full border border-accent px-4 py-2 text-xs text-accent transition-colors hover:bg-accent hover:text-bg"
              >
                Let’s Connect
              </a>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 block h-px w-5 bg-fg transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-5 bg-fg transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full h-[calc(100dvh-100%)] border-t border-line bg-bg md:hidden">
          <Container className="flex h-full flex-col justify-between py-8">
            <nav aria-label="Mobile" className="flex flex-col">
              {site.nav.map((n, i) => (
                <a
                  key={n.to}
                  href={n.to}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(n.to) ? "page" : undefined}
                  className={`flex items-baseline gap-4 border-b border-line py-4 font-display text-4xl font-semibold tracking-tight ${
                    isActive(n.to) ? "text-accent" : "text-fg"
                  }`}
                >
                  <span className="font-sans text-xs tabular-nums text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              ))}
            </nav>
            <a
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-full bg-accent px-5 py-4 text-center text-sm font-medium text-bg"
            >
              Let’s Connect
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
