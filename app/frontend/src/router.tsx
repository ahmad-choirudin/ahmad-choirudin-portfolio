import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { BrowserRouter, useLocation, useNavigate as useRouterNavigate } from "react-router-dom";

// Lapisan tipis di atas react-router-dom v7. API lama (usePath, useNavigate, useSetGate)
// dipertahankan supaya komponen yang sudah ada — termasuk PageTransition — tidak perlu diubah.

export type Gate = (to: string, go: () => void) => void;

type GateValue = {
  setGate: (gate: Gate | null) => void;
  gateRef: RefObject<Gate | null>;
};

const GateContext = createContext<GateValue>({
  setGate: () => {},
  gateRef: { current: null },
});

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";
const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

// Semua <a href="/..."> internal berpindah halaman tanpa reload dan melewati "gate"
// (tirai transisi) lebih dulu, sama seperti perilaku router sebelumnya.
function LinkInterceptor() {
  const navigate = useRouterNavigate();
  const { gateRef } = useContext(GateContext);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;

      if (url.pathname === window.location.pathname) {
        if (url.hash) return;
        e.preventDefault();
        toTop();
        return;
      }

      e.preventDefault();
      const to = url.pathname + url.search + url.hash;
      const gate = gateRef.current;
      if (gate) gate(to, () => navigate(to));
      else navigate(to);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate, gateRef]);

  return null;
}

// Scroll ke atas setiap kali halaman berganti (termasuk tombol back/forward).
function ScrollReset() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    toTop();
  }, [pathname]);
  return null;
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const gateRef = useRef<Gate | null>(null);
  const setGate = useCallback((gate: Gate | null) => {
    gateRef.current = gate;
  }, []);
  const value = useMemo(() => ({ setGate, gateRef }), [setGate]);

  return (
    <BrowserRouter>
      <GateContext.Provider value={value}>
        <LinkInterceptor />
        <ScrollReset />
        {children}
      </GateContext.Provider>
    </BrowserRouter>
  );
}

export const usePath = () => normalize(useLocation().pathname);
export const useNavigate = () => {
  const navigate = useRouterNavigate();
  return useCallback((to: string) => navigate(to), [navigate]);
};
export const useSetGate = () => useContext(GateContext).setGate;
