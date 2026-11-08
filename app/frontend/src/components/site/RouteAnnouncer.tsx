import { useEffect, useRef, useState } from "react";
import { usePath } from "@/router";

// Pembaca layar tidak tahu halaman berganti pada SPA. Komponen ini mengumumkan judul halaman
// baru lewat live region dan memindahkan fokus ke <main> (kecuali pada muat pertama).
export default function RouteAnnouncer() {
  const path = usePath();
  const first = useRef(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // Tunggu usePageMeta memperbarui document.title.
    const id = window.setTimeout(() => {
      setMessage(document.title);
      document.getElementById("main")?.focus({ preventScroll: true });
    }, 100);
    return () => window.clearTimeout(id);
  }, [path]);

  return (
    <p role="status" aria-live="polite" className="sr-only">
      {message}
    </p>
  );
}
