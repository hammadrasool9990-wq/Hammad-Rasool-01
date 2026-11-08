"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor: a small signal dot + a ring that grows over links
 * and reads "VIEW" over projects. Desktop pointers only; off for reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, scale = 1, target = 1;
    let visible = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        dot.current!.style.opacity = "1";
        ring.current!.style.opacity = "1";
      }
      const el = (e.target as Element)?.closest?.("a, button, [data-cursor], input, textarea, label");
      const mode = el?.getAttribute("data-cursor");
      target = mode === "view" ? 3.2 : el ? 1.9 : 1;
      ring.current!.classList.toggle("is-view", mode === "view");
      text.current!.style.opacity = mode === "view" ? "1" : "0";
    };
    const leave = () => {
      visible = false;
      dot.current!.style.opacity = "0";
      ring.current!.style.opacity = "0";
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      scale += (target - scale) * 0.18;
      dot.current!.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      ring.current!.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${scale})`;
      text.current!.style.transform = `translate(-50%,-50%) scale(${1 / scale})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      html.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-signal opacity-0 shadow-[0_0_10px_var(--signal)]"
      />
      <div
        ref={ring}
        className="cursor-ring absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-signal/60 opacity-0 transition-[background-color,border-color] duration-300 [&.is-view]:border-signal [&.is-view]:bg-signal"
      >
        <span ref={text} className="label absolute left-1/2 top-1/2 text-[9px] text-void opacity-0 transition-opacity duration-200">
          View
        </span>
      </div>
    </div>
  );
}
