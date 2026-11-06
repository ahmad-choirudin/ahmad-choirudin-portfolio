import { useState, type FormEvent } from "react";
import Section from "./Section";
import { site } from "@/data/site";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Fields): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10) e.message = "Please write at least 10 characters.";
  return e;
}

const inputCls =
  "mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-3 text-base text-fg placeholder:text-subtle focus:border-accent focus:outline-none aria-[invalid=true]:border-red-400";

export default function Contact() {
  const [values, setValues] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const viaWhatsApp = Boolean(site.whatsapp);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Honeypot: kolom tersembunyi yang hanya diisi bot.
    if ((new FormData(e.currentTarget).get("website") as string)?.length) { setSent(true); return; }

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    const text = `Hi Ahmad,\n\n${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
    const url = viaWhatsApp
      ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
      : `mailto:${site.email}?subject=${encodeURIComponent(`Hello from ${values.name.trim()}`)}&body=${encodeURIComponent(text)}`;
    if (viaWhatsApp) window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
    setSent(true);
  };

  const err = (k: keyof Fields) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});

  return (
    <Section id="contact">
      <div className="grid gap-12 md:grid-cols-12">
        <div data-reveal className="md:col-span-6">
          <p className="flex items-center gap-3 font-mono text-eyebrow font-medium uppercase text-accent">
            <span className="tabular-nums text-subtle">08</span>
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            Get in touch
          </p>
          <h2 className="mt-6 font-display text-display-lg font-semibold text-fg">
            Interested in working together? <span className="text-accent">Let’s talk.</span>
          </h2>
        </div>

        <form data-reveal onSubmit={onSubmit} noValidate className="md:col-span-6">
          <label className="block text-sm text-muted">
            Name
            <input type="text" name="name" autoComplete="name" value={values.name} onChange={set("name")} className={inputCls} {...err("name")} />
          </label>
          {errors.name && <p id="name-error" role="alert" className="mt-1 text-xs text-red-400">{errors.name}</p>}

          <label className="mt-5 block text-sm text-muted">
            Email
            <input type="email" name="email" autoComplete="email" value={values.email} onChange={set("email")} className={inputCls} {...err("email")} />
          </label>
          {errors.email && <p id="email-error" role="alert" className="mt-1 text-xs text-red-400">{errors.email}</p>}

          <label className="mt-5 block text-sm text-muted">
            Message
            <textarea name="message" rows={5} value={values.message} onChange={set("message")} className={inputCls} {...err("message")} />
          </label>
          {errors.message && <p id="message-error" role="alert" className="mt-1 text-xs text-red-400">{errors.message}</p>}

          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <button
            type="submit"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-medium text-bg transition hover:-translate-y-0.5"
          >
            {viaWhatsApp ? "Send via WhatsApp" : "Send message"}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
          </button>
          <p role="status" className="mt-4 text-sm text-muted">
            {sent ? (viaWhatsApp ? "Opening WhatsApp with your message…" : "Opening your email app with your message…") : ""}
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
