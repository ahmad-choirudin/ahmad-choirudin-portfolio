import { useEffect, useRef, useState } from "react";
import { usePath } from "@/router";

export default function RouteAnnouncer() {
  const path = usePath();
  const previous = useRef(path);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (previous.current === path) return;
    previous.current = path;
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
