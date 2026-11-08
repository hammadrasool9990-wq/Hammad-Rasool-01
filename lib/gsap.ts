"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Page-wide easing: cubic-bezier(0.77, 0, 0.175, 1)
gsap.registerEase("film", (p: number) => cubicBezier(0.77, 0, 0.175, 1, p));

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "film", duration: 1 });
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number, x: number) {
  // Newton–Raphson solve for t, then return y(t).
  let t = x;
  for (let i = 0; i < 8; i++) {
    const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t ** 2 * (1 - t) + t ** 3 - x;
    const dx = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t ** 2;
    if (Math.abs(cx) < 1e-5 || dx === 0) break;
    t = Math.min(1, Math.max(0, t - cx / dx));
  }
  return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t ** 2 * (1 - t) + t ** 3;
}

/** Media queries used by every chapter. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
};

export { gsap, ScrollTrigger, useGSAP };
