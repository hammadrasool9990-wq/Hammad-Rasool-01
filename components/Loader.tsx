"use client";

import { useEffect, useRef, useState } from "react";
import { bus } from "@/lib/bus";
import { gsap } from "@/lib/gsap";

const WORDS = ["LOADING", "PLEASE", "WAIT"];

/**
 * 00/ LOADING — a short (~1.6s) intro. The page is already rendered underneath,
 * so it never delays the real content; repeat visits and reduced-motion skip it.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("intro-skip")) {
      setGone(true);
      bus.emit("intro:done");
      return;
    }
    html.style.overflow = "hidden";

    const counter = { v: 0 };
    const wordTimer = window.setInterval(() => setWord((w) => (w + 1) % WORDS.length), 380);
    const fonts = (document.fonts?.ready ?? Promise.resolve()).catch(() => {});
    const minTime = new Promise((r) => setTimeout(r, 900));

    const tl = gsap.timeline({ paused: true });
    tl.to(counter, {
      v: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counter.v)),
    })
      .to(".loader-inner", { yPercent: -40, opacity: 0, duration: 0.6, ease: "power3.in" }, "+=0.1")
      .add(() => bus.emit("intro:done"), "-=0.2")
      .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "film" }, "-=0.25")
      .add(() => {
        html.style.overflow = "";
        try {
          sessionStorage.setItem("av-intro", "1");
        } catch {}
        setGone(true);
      });

    Promise.all([fonts, minTime]).then(() => tl.play());

    return () => {
      window.clearInterval(wordTimer);
      tl.kill();
      html.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="loader fixed inset-0 z-[80] flex items-end justify-between bg-void p-[var(--gutter)]"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      role="status"
      aria-label="Loading"
    >
      <div className="loader-inner flex w-full items-end justify-between gap-6">
        <div className="label text-mist">
          <span className="text-signal">00/</span> {WORDS[word]}
          <span className="ml-1 inline-block animate-pulse">_</span>
        </div>
        <div className="display text-[clamp(72px,18vw,220px)] tabular-nums text-bone" aria-hidden>
          {String(count).padStart(3, "0")}
        </div>
      </div>
    </div>
  );
}
