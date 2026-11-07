import type { ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useTilt } from "@/hooks/useTilt";
import { usePath } from "@/router";
import SiteNav from "./SiteNav";
import CursorLayer from "./CursorLayer";
import PageTransition from "./PageTransition";
import SiteFooter from "./SiteFooter";

export default function Layout({ children }: { children: ReactNode }) {
  const path = usePath();
  useReveal();
  useTilt();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>
      <CursorLayer />
      <PageTransition />
      <SiteNav />
      <main id="main" key={path} tabIndex={-1} className="min-h-[70svh] focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
