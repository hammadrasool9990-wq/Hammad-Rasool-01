"use client";

import { useEffect, useState } from "react";
import { chapters, profile } from "@/content";
import { scrollToId } from "@/lib/scroll";

/**
 * The pinned chapter label (top-left), the brand mark (top-right)
 * and the side progress rail. One IntersectionObserver, no scroll listeners.
 */
export default function ChapterHUD() {
  const [active, setActive] = useState(0);
  const [onFlare, setOnFlare] = useState(false);

  useEffect(() => {
    const els = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = chapters.findIndex((c) => c.id === e.target.id);
            if (i >= 0) setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));

    // Flip the HUD to dark ink while the red "THE WORK" card fills the screen.
    const flare = document.getElementById("work-title");
    const io2 = new IntersectionObserver(
      ([e]) => setOnFlare(e.isIntersecting),
      { rootMargin: "0px 0px -92% 0px" },
    );
    if (flare) io2.observe(flare);
    return () => {
      io.disconnect();
      io2.disconnect();
    };
  }, []);

  const c = chapters[active];
  const ink = onFlare ? "text-void" : "text-bone";

  return (
    <>
      <div
        className={`pointer-events-none fixed left-[var(--gutter)] top-5 z-50 label transition-colors duration-300 ${ink}`}
        aria-hidden
      >
        <span className={onFlare ? "text-void" : "text-signal"}>{c.num}/</span>{" "}
        <span key={c.id} className="inline-block animate-[fadeUp_.5s_var(--ease)]">
          {c.label}
        </span>
      </div>

      <a
        href="#noise"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("top");
        }}
        className={`fixed right-[var(--gutter)] top-5 z-50 label transition-colors duration-300 ${ink} hover:text-signal`}
      >
        {profile.brand}
        <span className="sr-only"> — back to top</span>
      </a>

      <nav
        aria-label="Chapters"
        className="fixed right-[calc(var(--gutter)-6px)] top-1/2 z-50 hidden -translate-y-1/2 md:block"
      >
        <ol className="flex flex-col gap-3">
          {chapters.map((ch, i) => {
            const on = i === active;
            return (
              <li key={ch.id}>
                <a
                  href={`#${ch.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(ch.id);
                  }}
                  aria-current={on ? "true" : undefined}
                  className="group flex items-center justify-end gap-3 py-0.5"
                >
                  <span
                    className={`label text-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${ink}`}
                  >
                    {ch.num}/ {ch.label}
                  </span>
                  <span
                    className={`block h-px transition-all duration-500 ${
                      on ? "w-8" : "w-3.5"
                    } ${onFlare ? "bg-void" : on ? "bg-signal shadow-[0_0_10px_var(--signal)]" : "bg-mist"}`}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
