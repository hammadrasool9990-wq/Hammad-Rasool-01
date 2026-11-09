"use client";

import { useRef, useState, type FormEvent } from "react";
import { Check, Copy, Send } from "lucide-react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { contact, photos, profile } from "@/content";
import { isTodo } from "@/lib/todo";
import Magnetic from "../Magnetic";
import Photo from "../Photo";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "../BrandIcons";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(d: { name: string; email: string; message: string }): Errors {
  const e: Errors = {};
  if (d.name.trim().length < 2) e.name = "Please tell me your name.";
  if (!EMAIL_RE.test(d.email.trim())) e.email = "That email doesn't look right.";
  if (d.message.trim().length < 10) e.message = "A little more detail, please (10+ characters).";
  return e;
}

/** 06/ TRANSMISSION — the moonlit end of the night. */
export default function Transmission() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "handoff">("idle");
  const [mailto, setMailto] = useState("");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".tx-char", {
          yPercent: 110,
          stagger: 0.04,
          duration: 1.1,
          scrollTrigger: { trigger: ".tx-head", start: "top 80%" },
        });
        gsap.from(".tx-fade", {
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 1,
          scrollTrigger: { trigger: ".tx-head", start: "top 60%" },
        });
      });
    },
    { scope: root },
  );

  const copy = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopied(addr);
      setTimeout(() => setCopied((c) => (c === addr ? null : c)), 2200);
    } catch {
      window.location.href = `mailto:${addr}`;
    }
  };

  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
    };
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      (ev.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      throw new Error(String(res.status));
    } catch {
      // Server couldn't send (not configured, or offline). Be honest about it and
      // offer the visitor's own mail app with the message pre-filled.
      const subject = encodeURIComponent(`Hello from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      setMailto(`mailto:${profile.email}?subject=${subject}&body=${body}`);
      setStatus("handoff");
    }
  };

  const socials = [
    { href: profile.socials.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: profile.socials.github, label: "GitHub", Icon: GithubIcon },
    { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  ].filter((s) => !isTodo(s.href));

  const fieldErr = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-2 text-sm text-flare" role="alert">
        {errors[k]}
      </p>
    ) : null;

  return (
    <section
      id="contact"
      ref={root}
      aria-labelledby="contact-title"
      className="sky-moon relative overflow-hidden px-[var(--gutter)] pb-24 pt-32 md:pr-[calc(var(--gutter)+48px)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="label text-signal">06/ Transmission</p>
        <h2 id="contact-title" className="tx-head display mt-4 text-[clamp(80px,17vw,260px)]">
          <span className="sr-only">{contact.headline}</span>
          <span aria-hidden className="block overflow-hidden">
            {contact.headline.split("").map((c, i) => (
              <span key={i} className="tx-char inline-block whitespace-pre">
                {c}
              </span>
            ))}
          </span>
        </h2>

        <div className="mt-10 grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="tx-fade max-w-lg text-lg text-mist">{contact.lead}</p>

            <div className="tx-fade mt-10">
              <p className="label text-mist">Email</p>
              <ul className="mt-2 space-y-3">
                {profile.emails.map((addr) => (
                  <li key={addr} className="flex flex-wrap items-center gap-4">
                    <a
                      href={`mailto:${addr}`}
                      className="break-all text-[clamp(16px,2.2vw,32px)] font-semibold text-bone underline decoration-signal/40 decoration-1 underline-offset-8 transition-colors hover:text-signal"
                    >
                      {addr}
                    </a>
                    <button
                      type="button"
                      onClick={() => copy(addr)}
                      aria-label={`Copy ${addr}`}
                      className="label inline-flex items-center gap-2 rounded-full border border-mist/40 px-3 py-2 text-mist transition-colors hover:border-signal hover:text-signal"
                    >
                      {copied === addr ? <Check size={14} strokeWidth={1.5} aria-hidden /> : <Copy size={14} strokeWidth={1.5} aria-hidden />}
                      {copied === addr ? "Copied" : "Copy"}
                    </button>
                  </li>
                ))}
              </ul>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>

            <ul className="tx-fade mt-10 flex flex-wrap gap-3">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label inline-flex items-center gap-2 rounded-full border border-mist/30 px-4 py-2.5 text-bone transition-colors hover:border-signal hover:text-signal"
                  >
                    <Icon size={16} /> {label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="tx-fade mt-14 hidden w-48 lg:block">
              <Photo photo={photos.candid} sizes="192px" className="w-full rounded-lg" />
            </div>
          </div>

          <div className="tx-fade rounded-2xl border border-signal/20 bg-void/60 p-7 shadow-[0_0_80px_-30px_var(--signal)] backdrop-blur-md md:p-10">
            {status === "handoff" ? (
              <div className="flex min-h-[340px] flex-col justify-center" role="alert">
                <p className="display text-[clamp(40px,5vw,68px)] text-ember">Not sent yet</p>
                <p className="mt-4 text-mist">
                  The form couldn&apos;t deliver your message right now. Send it from your own email app
                  instead, it&apos;s already written for you.
                </p>
                <a href={mailto} className="btn-signal mt-8 self-start">
                  Open email app <Send size={15} strokeWidth={1.5} aria-hidden />
                </a>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="label mt-6 self-start text-mist underline underline-offset-4 hover:text-signal"
                >
                  Back to the form
                </button>
              </div>
            ) : status === "sent" ? (
              <div className="flex min-h-[340px] flex-col justify-center" role="status" aria-live="polite">
                <p className="display text-[clamp(48px,6vw,84px)] text-signal">{contact.success}</p>
                <p className="mt-4 text-mist">{contact.successBody}</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="label mt-8 self-start text-mist underline underline-offset-4 hover:text-signal"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-7" aria-label="Contact form">
                <div>
                  <label htmlFor="name" className="label text-mist">Name</label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    className="field"
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-err" : undefined}
                  />
                  {fieldErr("name")}
                </div>
                <div>
                  <label htmlFor="email" className="label text-mist">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="field"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-err" : undefined}
                  />
                  {fieldErr("email")}
                </div>
                <div>
                  <label htmlFor="message" className="label text-mist">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="field resize-none"
                    placeholder="What are we making?"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-err" : undefined}
                  />
                  {fieldErr("message")}
                </div>
                {/* honeypot */}
                <div className="absolute -left-[9999px]" aria-hidden>
                  <label>
                    Company <input name="company" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <Magnetic strength={0.25}>
                  <button type="submit" className="btn-signal" disabled={status === "sending"}>
                    {status === "sending" ? "Transmitting…" : "Send signal"}
                    <Send size={15} strokeWidth={1.5} aria-hidden />
                  </button>
                </Magnetic>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
