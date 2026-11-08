"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { origin, photos, profile } from "@/content";
import { T } from "@/lib/todo";
import Photo from "../Photo";

/** 02/ ORIGIN — the paragraph lights up word by word as you scroll. */
export default function Origin() {
  const root = useRef<HTMLElement>(null);
  const words = origin.paragraph.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", scrub: 0.6, pin: true },
        });
        tl.to(".ow", { color: "var(--bone)", stagger: 0.05, ease: "none", duration: 0.3 }, 0)
          .fromTo(
            ".origin-photo",
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "film", duration: 1.4 },
            0,
          )
          .fromTo(".origin-photo img", { scale: 1.15 }, { scale: 1, ease: "film", duration: 1.6 }, 0);
      });

      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(".ow", {
          color: "var(--bone)",
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".origin-text", start: "top 75%", end: "bottom 45%", scrub: 0.5 },
        });
        gsap.fromTo(
          ".origin-photo",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            scrollTrigger: { trigger: ".origin-photo", start: "top 85%" },
          },
        );
      });

      mm.add(MQ.reduced, () => {
        gsap.set(".ow", { color: "var(--bone)" });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="origin"
      ref={root}
      aria-labelledby="origin-title"
      className="sky-dusk-fade relative flex min-h-[100svh] items-center px-[var(--gutter)] py-28 md:pr-[calc(var(--gutter)+48px)]"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 md:grid-cols-[1.35fr_1fr] md:gap-16">
        <div>
          <h2 id="origin-title" className="label mb-8 text-signal">
            02/ Origin — who I am
          </h2>
          <p className="origin-text text-[clamp(24px,3.1vw,48px)] font-semibold leading-[1.22] tracking-[-0.01em]">
            {words.map((w, i) => (
              <span key={i} className="ow text-mist">
                {w}{" "}
              </span>
            ))}
          </p>
          <p className="mt-10 max-w-xl text-mist">{origin.aside}</p>
          <p className="mt-3 max-w-xl text-mist">
            <T>{origin.story}</T>
          </p>
        </div>

        <figure className="relative mx-auto w-full max-w-[440px]">
          <div className="origin-photo" style={{ clipPath: "inset(0 0 0 0)" }}>
            <Photo photo={photos.origin} sizes="(min-width: 900px) 32vw, 90vw" className="w-full" />
          </div>
          <figcaption className="label mt-4 flex justify-between text-mist">
            <span>{profile.name}</span>
            <span className="text-signal">{profile.location}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
