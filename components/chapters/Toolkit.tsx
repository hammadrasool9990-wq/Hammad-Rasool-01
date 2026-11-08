"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { toolkit } from "@/content";

function Orbit({ title, items, ember, ccw }: { title: string; items: string[]; ember?: boolean; ccw?: boolean }) {
  return (
    <div className="tk-orbit">
      {/* Desktop: chips orbit a glowing core */}
      <div
        className="relative mx-auto hidden aspect-square w-[min(34vw,440px)] lg:block"
        style={{ ["--r" as string]: "min(13.5vw, 175px)" }}
      >
        <div className="absolute inset-[10%] rounded-full border border-mist/15" aria-hidden />
        <div className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--signal)_22%,transparent),transparent_70%)]" aria-hidden />
        <h3 className="display absolute inset-0 flex items-center justify-center text-[clamp(48px,5vw,84px)]">
          <span className={ember ? "text-ember" : "text-signal"}>{title}</span>
        </h3>
        <ul
          className={`orbit absolute inset-0 ${ccw ? "ccw" : ""}`}
          style={{ ["--dur" as string]: ccw ? "80s" : "64s" }}
        >
          {items.map((t, i) => {
            const a = (360 / items.length) * i;
            return (
              <li
                key={t}
                className="absolute left-1/2 top-1/2 h-0 w-0"
                style={{ transform: `rotate(${a}deg) translateX(var(--r)) rotate(${-a}deg)` }}
              >
                <span className={`chip absolute -translate-x-1/2 -translate-y-1/2 ${ember ? "chip--ember" : ""}`}>{t}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile / tablet: a calm chip cloud */}
      <div className="lg:hidden">
        <h3 className={`display text-[clamp(48px,14vw,96px)] ${ember ? "text-ember" : "text-signal"}`}>{title}</h3>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {items.map((t) => (
            <li key={t} className={`chip ${ember ? "chip--ember" : ""}`}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** 05/ TOOLKIT — BUILD and GROW. No percentage bars. */
export default function Toolkit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".tk-orbit", {
          opacity: 0,
          scale: 0.92,
          stagger: 0.15,
          duration: 1.2,
          scrollTrigger: { trigger: ".tk-grid", start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  const marquee = Array.from({ length: 4 }, () => toolkit.marquee).join(" ");

  return (
    <section
      id="toolkit"
      ref={root}
      aria-labelledby="toolkit-title"
      className="relative overflow-hidden bg-void py-32"
    >
      <div className="px-[var(--gutter)] md:pr-[calc(var(--gutter)+48px)]">
        <div className="mx-auto max-w-[1400px]">
          <p className="label text-signal">05/ Toolkit</p>
          <h2 id="toolkit-title" className="display mt-4 text-[clamp(56px,10vw,150px)]">
            What I work with
          </h2>
          <p className="mt-6 max-w-xl text-mist">
            Two sides of one skill set: building the page, and getting the right people to it.
          </p>

          <div className="tk-grid mt-16 grid gap-16 lg:mt-10 lg:grid-cols-2 lg:gap-6">
            <Orbit title="Build" items={toolkit.build} />
            <Orbit title="Grow" items={toolkit.grow} ember ccw />
          </div>
        </div>
      </div>

      <div className="mt-24 border-y border-mist/15 py-6" aria-hidden>
        <div className="marquee display whitespace-nowrap text-[clamp(48px,8vw,120px)] text-transparent [-webkit-text-stroke:1px_var(--mist)]">
          <span className="pr-8">{marquee}</span>
          <span className="pr-8">{marquee}</span>
        </div>
      </div>
      <p className="sr-only">Developer. Marketer. Learner.</p>
    </section>
  );
}
