import { useEffect, useRef, useState } from "react";
import type {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

type Status = "idle" | "sending" | "sent" | "error";

type ContactPayload = {
  name: string;
  email: string;
  company: string;
  website?: string;
  revenue: string;
  message: string;
  hp?: string;
};

type ServerError = { error?: string; field?: string };

// Turn a server error code (or a network failure) into something a human
// can act on. Falls back to a generic message when we don't recognise it.
function friendlyError(body: ServerError, status: number): string {
  if (body.error === "invalid_email") {
    return "That email address doesn't look right — mind double-checking it?";
  }
  if (body.error === "missing_field" && body.field) {
    return `Please fill in the ${body.field} field.`;
  }
  if (status >= 500) {
    return "Our server hiccuped. Try again in a moment, or email us directly.";
  }
  return `Something went wrong (HTTP ${status}). Please try again or email us directly.`;
}

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = "Contact — Fintagic";
    return () => {
      document.title = prev;
    };
  }, []);

  const resetForm = () => {
    setStatus("idle");
    setErrorMessage(null);
    formRef.current?.reset();
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    // Production endpoint baked in as the fallback so a fresh deploy works
    // even if VITE_CONTACT_ENDPOINT wasn't set on the build host. Local dev
    // still overrides via .env.local to point at http://localhost:3001/...
    const endpoint =
      import.meta.env.VITE_CONTACT_ENDPOINT ??
      "https://api.lumelogics.com/v1/fintagic/contact";

    const fd = new FormData(e.currentTarget);
    const payload: ContactPayload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      website: String(fd.get("website") ?? "").trim() || undefined,
      revenue: String(fd.get("revenue") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      hp: String(fd.get("hp") ?? ""),
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body: ServerError = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMessage(friendlyError(body, res.status));
        return;
      }

      setStatus("sent");
      formRef.current?.reset();
    } catch {
      // Network failure, CORS block, endpoint unreachable, etc.
      setStatus("error");
      setErrorMessage(
        "Couldn't reach the server. Check your connection or email us directly.",
      );
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-paper pt-40 pb-24 sm:pt-48">
      {/* Soft brand-hex backdrop */}
      <div
        className="pointer-events-none absolute top-32 -right-24 -z-0 h-96 w-96 opacity-40 blur-3xl sm:right-0"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,223,127,0.35), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1180px] px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold tracking-[0.2em] text-green uppercase">
            Contact
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] font-bold tracking-tight text-ink">
            Let&rsquo;s talk{" "}
            <span className="relative inline-block">
              <span
                aria-hidden
                className="absolute -inset-x-2 inset-y-0.5 -z-0 -skew-x-6 -rotate-[1.5deg] bg-green"
              />
              <span className="relative z-10 px-2">numbers.</span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-teal/75">
            Tell us about your DTC brand and where the books hurt. If we&rsquo;re
            the right fit we&rsquo;ll say so, and if not we&rsquo;ll point you at
            someone better.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10">
          {/* Form card */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-teal/10 bg-white p-6 shadow-[0_20px_60px_rgba(1,20,24,0.05)] sm:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Your name"
                name="name"
                autoComplete="name"
                required
                placeholder="Jamie Rivera"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@brand.com"
              />
              <Field
                label="Brand / company"
                name="company"
                autoComplete="organization"
                required
                placeholder="Northbound Skincare"
              />
              <Field
                label="Website"
                name="website"
                autoComplete="url"
                placeholder="https://"
              />
            </div>

            <div className="mt-5">
              <Select
                label="Monthly revenue"
                name="revenue"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Pick a range
                </option>
                <option>Under $50K</option>
                <option>$50K – $250K</option>
                <option>$250K – $1M</option>
                <option>$1M – $5M</option>
                <option>$5M+</option>
              </Select>
            </div>

            <div className="mt-5">
              <Textarea
                label="What&rsquo;s on your mind?"
                name="message"
                required
                rows={5}
                placeholder="Where the books hurt, what you're trying to fix, anything else useful."
              />
            </div>

            {/* Honeypot: real users don't see or fill this. Bots that scan
                the DOM and blindly fill every input trip it and get silently
                200'd on the server (no email, no DB row). Positioned off-
                screen rather than `hidden` since many bots skip [hidden]. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
            >
              <label>
                Leave this field empty
                <input
                  type="text"
                  name="hp"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-base font-semibold text-white shadow-[0_10px_30px_rgba(1,20,24,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "sending"
                  ? "Sending…"
                  : status === "sent"
                    ? "Sent ✓"
                    : "Send it"}
                {status === "idle" && (
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>

              {status === "sent" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="text-sm font-medium text-teal">
                    Thanks — we&rsquo;ll be back within one business day.
                  </span>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm font-semibold text-green underline underline-offset-4 hover:text-teal"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="text-sm font-medium text-[#c04a4a]">
                    {errorMessage ??
                      "Something went wrong. Please email us directly."}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setErrorMessage(null);
                    }}
                    className="text-sm font-semibold text-teal underline underline-offset-4 hover:text-ink"
                  >
                    Try again
                  </button>
                </motion.div>
              )}
            </div>
          </motion.form>

          {/* Details column */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            <InfoCard
              title="Email"
              body="hello@fintagic.com"
              href="mailto:hello@fintagic.com"
            />
            <InfoCard
              title="Response time"
              body="Within one business day. No auto-reply gauntlet."
            />
            <InfoCard
              title="Prefer to keep browsing?"
              body="See what we do →"
              to="/#capabilities"
            />
            <div className="rounded-3xl bg-ink p-6 text-white">
              <p className="text-xs font-bold tracking-widest text-green uppercase">
                Not sure yet?
              </p>
              <p className="mt-3 text-lg leading-snug font-semibold">
                Skim the case studies — we build our pitch out of receipts, not
                buzzwords.
              </p>
              <Link
                to="/#work"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green hover:text-white"
              >
                Case studies
                <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

// ───────── Form primitives ─────────

function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-teal">{label}</span>
      <input
        {...props}
        className="mt-2 block w-full rounded-xl border border-teal/15 bg-paper/60 px-4 py-3 text-base text-ink placeholder:text-teal/40 focus:border-green focus:bg-white focus:outline-none"
      />
    </label>
  );
}

function Select({
  label,
  children,
  ...props
}: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-teal">{label}</span>
      <select
        {...props}
        className="mt-2 block w-full rounded-xl border border-teal/15 bg-paper/60 px-4 py-3 text-base text-ink focus:border-green focus:bg-white focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}

function Textarea({
  label,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-teal">{label}</span>
      <textarea
        {...props}
        className="mt-2 block w-full rounded-xl border border-teal/15 bg-paper/60 px-4 py-3 text-base text-ink placeholder:text-teal/40 focus:border-green focus:bg-white focus:outline-none"
      />
    </label>
  );
}

function InfoCard({
  title,
  body,
  href,
  to,
}: {
  title: string;
  body: string;
  href?: string;
  to?: string;
}) {
  const content = (
    <div className="group rounded-3xl border border-teal/10 bg-white p-6 transition-colors duration-200 hover:border-green">
      <p className="text-xs font-bold tracking-widest text-teal/55 uppercase">
        {title}
      </p>
      <p className="mt-3 text-lg leading-snug font-semibold text-ink group-hover:text-teal">
        {body}
      </p>
    </div>
  );
  if (to) return <Link to={to}>{content}</Link>;
  if (href) return <a href={href}>{content}</a>;
  return content;
}
