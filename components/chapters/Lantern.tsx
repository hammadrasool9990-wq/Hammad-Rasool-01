"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { lantern, photos, profile } from "@/content";
import Photo from "../Photo";

/** 03/ THE LANTERN — one light travels down the path, lighting each stop. */
export default function Lantern() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const path = root.current!.querySelector<HTMLElement>(".lantern-path")!;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: path, start: "top 62%", end: "bottom 62%", scrub: 0.8, invalidateOnRefresh: true },
        });
        tl.fromTo(".lantern-light", { y: 0 }, { y: () => path.offsetHeight, ease: "none" }, 0)
          .fromTo(".lantern-trail", { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0);

        gsap.utils.toArray<HTMLElement>(".lantern-stop").forEach((stop) => {
          ScrollTrigger.create({
            trigger: stop,
            start: "top 62%",
            onEnter: () => stop.classList.add("is-lit"),
            onLeaveBack: () => stop.classList.remove("is-lit"),
          });
        });

        gsap.from(".lantern-quote", {
          opacity: 0,
          y: 30,
          duration: 1.2,
          scrollTrigger: { trigger: ".lantern-quote", start: "top 85%" },
        });
      });
      mm.add(MQ.reduced, () => {
        root.current!.querySelectorAll(".lantern-stop").forEach((s) => s.classList.add("is-lit"));
      });
    },
    { scope: root },
  );

  return (
    <section
      id="lantern"
      ref={root}
      aria-labelledby="lantern-title"
      className="relative bg-void px-[var(--gutter)] py-32 md:pr-[calc(var(--gutter)+48px)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="label text-signal">03/ The Lantern</p>
        <h2 id="lantern-title" className="display mt-4 text-[clamp(56px,10vw,150px)]">
          Learning &amp; <span className="text-signal">mentorship</span>
        </h2>
        <p className="mt-6 max-w-xl text-mist">{lantern.intro}</p>

        <div className="mt-20 grid gap-16 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <div className="md:sticky md:top-24 md:self-start">
            <Photo photo={photos.learning} sizes="(min-width: 900px) 34vw, 90vw" className="w-full max-w-[460px]" />
            <p className="label mt-4 text-mist">Always studying · {profile.location}</p>
          </div>

          <div className="lantern-path relative pl-12 md:pl-16">
            {/* the path */}
            <div className="absolute bottom-0 left-[7px] top-0 w-px bg-mist/25" aria-hidden />
            <div
              className="lantern-trail absolute bottom-0 left-[7px] top-0 w-px origin-top bg-gradient-to-b from-signal/80 to-signal/30"
              aria-hidden
            />
            {/* the light */}
            <div className="lantern-light absolute -top-2 left-0 h-4 w-4 rounded-full" aria-hidden />

            <ol className="flex flex-col gap-[28vh] py-4">
              {lantern.stops.map((s, i) => (
                <li
                  key={s.title}
                  className="lantern-stop group relative opacity-30 transition-all duration-700 ease-[var(--ease)] [&.is-lit]:opacity-100"
                >
                  <span
                    className="absolute -left-12 top-2 h-[15px] w-[15px] rounded-full border border-mist/60 bg-void transition-all duration-500 group-[.is-lit]:border-signal group-[.is-lit]:shadow-[0_0_14px_var(--signal)] md:-left-16"
                    aria-hidden
                  />
                  <div className="rounded-2xl border border-mist/15 bg-night/70 p-7 backdrop-blur-sm transition-all duration-700 group-[.is-lit]:translate-x-0 group-[.is-lit]:border-signal/40 group-[.is-lit]:shadow-[0_0_60px_-20px_var(--signal)] md:translate-x-4 md:p-9">
                    <p className="label text-ember">
                      0{i + 1} — {s.kicker}
                    </p>
                    <h3 className="mt-3 text-[clamp(24px,2.4vw,34px)] font-semibold leading-tight">{s.title}</h3>
                    <p className="mt-3 text-mist">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <blockquote className="lantern-quote mx-auto mt-40 max-w-4xl text-center">
          <p className="text-[clamp(24px,3vw,42px)] font-semibold leading-snug">
            “{profile.philosophy}”
          </p>
          <footer className="label mt-6 text-mist">— my working philosophy</footer>
        </blockquote>
      </div>
    </section>
  );
}
