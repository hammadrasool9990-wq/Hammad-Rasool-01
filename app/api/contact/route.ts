import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Contact form endpoint.
 *
 * Delivery (first one that is configured wins):
 *  1. Gmail: set GMAIL_USER + GMAIL_APP_PASSWORD in Vercel → Settings →
 *     Environment Variables. Sends from your own Gmail, free, no domain needed,
 *     and can deliver to any number of inboxes.
 *  2. Resend: set RESEND_API_KEY (needs a verified domain to reach more than
 *     the address you signed up to Resend with).
 *
 * Recipients come from CONTACT_TO_EMAIL (comma-separated), or the defaults below.
 * If nothing is configured it returns 501 and the form offers the visitor's
 * own email app instead.
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DEFAULT_TO = ["AureVon9990@gmail.com", "hammadrasool0009@gmail.com"];

function recipients(): string[] {
  const list = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => EMAIL_RE.test(s));
  return list.length ? list : DEFAULT_TO;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  // Strip line breaks from single-line fields so they can't inject email headers.
  const name = String(body.name ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 120);
  const email = String(body.email ?? "").replace(/[\r\n]+/g, "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);
  const trap = String(body.company ?? ""); // honeypot

  if (trap) return NextResponse.json({ ok: true }); // quietly drop bots
  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 422 });
  }

  const to = recipients();
  const subject = `New message from ${name} (portfolio)`;
  const text = `Name: ${name}\nEmail: ${email}\n\n${message}\n\n— Sent from your portfolio contact form. Hit reply to answer ${name}.`;

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  const resendKey = process.env.RESEND_API_KEY;

  try {
    if (gmailUser && gmailPass) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: gmailPass },
      });
      await transporter.sendMail({
        from: { name: "Portfolio Contact", address: gmailUser },
        to,
        replyTo: { name, address: email },
        subject,
        text,
      });
      return NextResponse.json({ ok: true });
    }

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
          to,
          reply_to: email,
          subject,
          text,
        }),
      });
      if (!res.ok) {
        console.error("[contact] Resend error", res.status, await res.text());
        return NextResponse.json({ error: "Could not send right now." }, { status: 502 });
      }
      return NextResponse.json({ ok: true });
    }
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json({ error: "Could not send right now." }, { status: 502 });
  }

  console.error("[contact] No email service configured: set GMAIL_USER and GMAIL_APP_PASSWORD.");
  return NextResponse.json({ error: "Email service not configured" }, { status: 501 });
}
