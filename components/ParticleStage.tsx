"use client";

import { useEffect, useRef, useState } from "react";
import Photo from "./Photo";
import { photos } from "@/content";

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Loads the particle portrait (three.js) only after first paint and when the
 * browser is idle, so it never blocks LCP. Reduced motion / no WebGL → a static
 * duotone portrait instead.
 */
export default function ParticleStage({ triggerId }: { triggerId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !webglOK() || !photos.hero.src) {
      setFallback(true);
      return;
    }
    let engine: { destroy: () => void } | null = null;
    let cancelled = false;
    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const handle = idle(async () => {
      const { startParticles } = await import("./particles/engine");
      if (cancelled || !ref.current) return;
      const trigger = document.getElementById(triggerId) ?? ref.current;
      engine = await startParticles(ref.current, { src: photos.hero.src!, trigger });
      if (cancelled) engine.destroy();
    });
    return () => {
      cancelled = true;
      if (typeof handle === "number" && !window.requestIdleCallback) clearTimeout(handle);
      engine?.destroy();
    };
  }, [triggerId]);

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden={!fallback}>
      {fallback && (
        <div className="absolute right-[8%] top-[12%] hidden w-[min(28vw,400px)] animate-[fadeUp_1s_var(--ease)] md:block">
          <Photo photo={photos.hero} sizes="28vw" className="w-full" />
        </div>
      )}
    </div>
  );
}
