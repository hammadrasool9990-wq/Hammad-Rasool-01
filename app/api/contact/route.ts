import { NextResponse } from "next/server";

/**
 * Contact form endpoint.
 * - If RESEND_API_KEY is set (Vercel → Settings → Environment Variables),
 *   the message is emailed via Resend's REST API. No extra npm package needed.
 * - Otherwise it returns 501 and the form falls back to opening the
 *   visitor's email app with the message pre-filled.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);
  const trap = String(body.company ?? ""); // honeypot

  if (trap) return NextResponse.json({ ok: true }); // quietly drop bots
  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Email service not configured" }, { status: 501 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || "AureVon9990@gmail.com"],
      reply_to: email,
      subject: `New message from ${name} (portfolio)`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "Could not send right now." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
