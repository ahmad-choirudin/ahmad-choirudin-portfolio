import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type Gate = (to: string, go: () => void) => void;

type RouterValue = {
  path: string;
  navigate: (to: string) => void;
  setGate: (gate: Gate | null) => void;
};

const RouterContext = createContext<RouterValue>({ path: "/", navigate: () => {}, setGate: () => {} });

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";
const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalize(window.location.pathname));
  const gateRef = useRef<Gate | null>(null);

  const setGate = useCallback((gate: Gate | null) => {
    gateRef.current = gate;
  }, []);

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.href);
    window.history.pushState(null, "", url.pathname + url.search + url.hash);
    setPath(normalize(url.pathname));
    toTop();
  }, []);

  useEffect(() => {
    const onPop = () => {
      setPath(normalize(window.location.pathname));
      toTop();
    };

    // Semua <a href="/..."> internal otomatis berpindah halaman tanpa reload.
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

    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
    };
  }, [navigate]);

  const value = useMemo(() => ({ path, navigate, setGate }), [path, navigate, setGate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export const usePath = () => useContext(RouterContext).path;
export const useNavigate = () => useContext(RouterContext).navigate;
export const useSetGate = () => useContext(RouterContext).setGate;
