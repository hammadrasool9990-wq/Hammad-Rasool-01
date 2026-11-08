"use client";

import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Smooth-scroll to a chapter id (or the very top with "top"). */
export function scrollToId(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (id === "top") {
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  // Move keyboard focus to the chapter for screen-reader / keyboard users.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
