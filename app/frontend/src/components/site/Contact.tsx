import { useState, type FormEvent } from "react";
import Section from "./Section";
import LetterRise from "./LetterRise";
import TypewriterText from "./TypewriterText";
import { site } from "@/data/site";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined)?.trim() || "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Fields): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10) e.message = "Please write at least 10 characters.";
  return e;
}

const inputCls =
  "mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-3 text-base text-fg placeholder:text-subtle focus:border-accent focus:outline-none aria-[invalid=true]:border-danger";

export default function Contact() {
  const [values, setValues] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const viaEndpoint = Boolean(ENDPOINT);
  const viaWhatsApp = !viaEndpoint && Boolean(site.whatsapp);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const trap = new FormData(e.currentTarget).get("website");
    if (typeof trap === "string" && trap.length) { setStatus("sent"); return; }

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();

    if (viaEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setValues({ name: "", email: "", message: "" });
        setStatus("sent");
      } catch {
        setStatus("error");
      }
      return;
    }

    const text = `Hi Ahmad,\n\n${message}\n\n— ${name} (${email})`;
    if (viaWhatsApp) {
      window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Hello from ${name}`)}&body=${encodeURIComponent(text)}`;
    }
    setStatus("sent");
  };

  const statusText: Record<Status, string> = {
    idle: "",
    sending: "Sending…",
    sent: viaEndpoint
      ? "Thanks! Your message has been sent."
      : viaWhatsApp
        ? "Opening WhatsApp with your message…"
        : `Opening your email app… If nothing opens, write to ${site.email}.`,
    error: `Couldn’t send your message. Please try again or email ${site.email}.`,
  };

  const err = (k: keyof Fields) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});

  return (
    <Section id="contact">
      <div className="grid gap-12 md:grid-cols-12">
        <div data-reveal className="md:col-span-6">
          <p className="flex items-center gap-3 font-mono text-eyebrow font-medium uppercase text-accent">
            <span className="sec-index tabular-nums text-subtle" aria-hidden="true" />
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            <TypewriterText text="Get in touch" speed={45} />
          </p>
          <h2 className="mt-6 font-display text-display-lg font-semibold text-fg"><LetterRise text="Interested in working together? " accent="Let’s talk." delay={150} /></h2>
        </div>

        <form data-reveal onSubmit={onSubmit} noValidate className="md:col-span-6">
          <label className="block text-sm text-muted">
            Name
            <input type="text" name="name" autoComplete="name" value={values.name} onChange={set("name")} className={inputCls} {...err("name")} />
          </label>
          {errors.name && <p id="name-error" role="alert" className="mt-1 text-xs text-danger">{errors.name}</p>}

          <label className="mt-5 block text-sm text-muted">
            Email
            <input type="email" name="email" autoComplete="email" value={values.email} onChange={set("email")} className={inputCls} {...err("email")} />
          </label>
          {errors.email && <p id="email-error" role="alert" className="mt-1 text-xs text-danger">{errors.email}</p>}

          <label className="mt-5 block text-sm text-muted">
            Message
            <textarea name="message" rows={5} value={values.message} onChange={set("message")} className={inputCls} {...err("message")} />
          </label>
          {errors.message && <p id="message-error" role="alert" className="mt-1 text-xs text-danger">{errors.message}</p>}

          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <button
            type="submit"
            disabled={status === "sending"}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-medium text-bg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {status === "sending" ? "Sending…" : viaWhatsApp ? "Send via WhatsApp" : "Send message"}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
          </button>
          <p role="status" className={`mt-4 text-sm ${status === "error" ? "text-danger" : "text-muted"}`}>
            {statusText[status]}
          </p>
        </form>
      </div>

      <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {site.socials.map((s) => (
          <li key={s.label} data-reveal>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="group block border-t border-line pt-5 transition-colors hover:border-accent">
              <p className="flex items-center justify-between font-mono text-eyebrow uppercase text-muted transition-colors group-hover:text-accent">
                {s.label}
                <span aria-hidden="true">↗</span>
              </p>
              <p className="mt-2 text-base text-fg">{s.handle}</p>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
