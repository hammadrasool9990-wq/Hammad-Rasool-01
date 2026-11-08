"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/content";
import { scrollToId } from "@/lib/scroll";
import { bus } from "@/lib/bus";

type Line = { kind: "in" | "out" | "err"; text: string };

const HELP = [
  "home       → back to the start",
  "about      → 02/ origin",
  "work       → 04/ the projects",
  "contact    → 06/ transmission",
  "grain-off  → toggle film grain",
  "mono       → toggle black-and-white mode",
  "clear      → clear the screen",
  "exit       → close (or press Esc)",
];

/** Easter egg: press "/" anywhere (outside a text field) to open. */
export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: `${profile.brand.toLowerCase()} shell — type "help"` },
  ]);
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const history = useRef<string[]>([]);
  const hIdx = useRef(-1);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest("input, textarea, [contenteditable='true']");
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        lastFocus.current = document.activeElement as HTMLElement;
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 20);
  }, [open]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out: Line[] = [{ kind: "in", text: raw }];
    const html = document.documentElement;
    const go = (id: string, msg: string) => {
      out.push({ kind: "out", text: msg });
      setTimeout(() => {
        close();
        scrollToId(id);
        if (id === "top") bus.emit("particles:reassemble");
      }, 250);
    };
    switch (cmd) {
      case "":
        break;
      case "help":
        HELP.forEach((h) => out.push({ kind: "out", text: h }));
        break;
      case "home":
        go("top", "returning to the noise…");
        break;
      case "about":
        go("origin", "→ 02/ origin");
        break;
      case "work":
        go("work", "→ 04/ signal");
        break;
      case "contact":
        go("contact", "→ 06/ transmission");
        break;
      case "grain-off":
      case "grain-on":
      case "grain": {
        const off = cmd === "grain-on" ? false : cmd === "grain-off" ? !html.classList.contains("grain-off") : !html.classList.contains("grain-off");
        html.classList.toggle("grain-off", off);
        out.push({ kind: "out", text: off ? "grain: off" : "grain: on" });
        break;
      }
      case "mono":
        out.push({ kind: "out", text: html.classList.toggle("mono-mode") ? "mono: on" : "mono: off" });
        break;
      case "clear":
        setLines([]);
        setValue("");
        return;
      case "exit":
      case "quit":
        close();
        break;
      case "whoami":
        out.push({ kind: "out", text: `${profile.name} — ${profile.roles.join(" · ")}` });
        break;
      default:
        out.push({ kind: "err", text: `command not found: ${cmd}. try "help"` });
    }
    if (cmd) history.current.unshift(raw);
    hIdx.current = -1;
    setLines((l) => [...l, ...out].slice(-60));
    setValue("");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-void/60 p-4 backdrop-blur-sm md:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command terminal"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-signal/30 bg-[#05080a]/95 font-mono text-sm shadow-[0_0_80px_-20px_var(--signal)]"
      >
        <div className="flex items-center justify-between border-b border-signal/15 px-4 py-2.5">
          <span className="label text-mist">~/aurevon</span>
          <button onClick={close} className="label text-mist hover:text-signal">esc</button>
        </div>
        <div className="max-h-72 overflow-y-auto px-4 py-3" aria-live="polite">
          {lines.map((l, i) => (
            <p
              key={i}
              className={l.kind === "in" ? "text-bone" : l.kind === "err" ? "text-flare" : "text-mist"}
            >
              {l.kind === "in" ? <span className="text-signal">❯ </span> : null}
              {l.text}
            </p>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
          }}
          className="flex items-center gap-2 border-t border-signal/15 px-4 py-3"
        >
          <span className="text-signal" aria-hidden>❯</span>
          <label htmlFor="term-in" className="sr-only">Command</label>
          <input
            id="term-in"
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                hIdx.current = Math.min(hIdx.current + 1, history.current.length - 1);
                setValue(history.current[hIdx.current] ?? value);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                hIdx.current = Math.max(hIdx.current - 1, -1);
                setValue(hIdx.current < 0 ? "" : history.current[hIdx.current]);
              }
            }}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-bone caret-signal outline-none"
            placeholder="type a command…"
          />
        </form>
      </div>
    </div>
  );
}
