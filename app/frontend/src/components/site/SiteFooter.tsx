import { site } from "@/data/site";
import Logo from "./Logo";
import { Container } from "./Section";

const YEAR = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="border-t border-line text-xs text-subtle">
      <Container className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-2 text-muted">
          <Logo className="h-4 w-4" />
          {site.name}
          <span className="text-subtle">© {YEAR}</span>
        </span>
        <span>Web3 / Frontend / Community / AI</span>
        <a href="#" className="transition-colors hover:text-accent">
          Back to top ↑
        </a>
      </Container>
    </footer>
  );
}
