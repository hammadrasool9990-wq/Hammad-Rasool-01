"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { bus } from "@/lib/bus";
import { hero, profile } from "@/content";
import ParticleStage from "../ParticleStage";
import ShuffleWords from "../ShuffleWords";

/** 01/ NOISE — particles assemble into the portrait; the name lands. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const play = () => {
          gsap.from(".hero-char", { yPercent: 110, duration: 1.2, stagger: 0.035, ease: "film" });
          gsap.from(".hero-fade", { opacity: 0, y: 16, duration: 1, stagger: 0.12, delay: 0.6, ease: "power3.out" });
        };
        // Only animate in when the intro actually played (not on skipped/repeat visits).
        const played = !document.documentElement.classList.contains("intro-skip");
        const off = played ? bus.on("intro:done", play) : () => {};

        // Name drifts up & fades as you scroll away.
        gsap.to(".hero-name", {
          yPercent: -18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        return off;
      });
    },
    { scope: root },
  );

  const split = (word: string) =>
    word.split("").map((ch, i) => (
      <span key={i} className="hero-char inline-block">
        {ch}
      </span>
    ));

  return (
    <section
      id="noise"
      ref={root}
      aria-labelledby="hero-title"
      className="sky-dusk relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-[var(--gutter)] pb-[clamp(28px,6vh,64px)] pt-28"
    >
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" />
      <ParticleStage triggerId="noise" />

      <div className="relative z-10 max-w-full">
        <p className="hero-fade label mb-5 text-mist">
          {profile.roles.join(" · ")} <span className="text-signal">/</span> {profile.location}
        </p>

        <h1 id="hero-title" className="hero-name display text-[clamp(64px,15.5vw,220px)] text-bone">
          <span className="sr-only">{profile.name}</span>
          <span aria-hidden className="block overflow-hidden pb-[0.04em]">{split(profile.firstName)}</span>
          <span aria-hidden className="block overflow-hidden pb-[0.04em]">{split(profile.lastName)}</span>
        </h1>

        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade font-mono text-[clamp(15px,1.6vw,22px)] text-bone">
            <span className="sr-only">
              I build, market, learn and ship digital experiences.
            </span>
            <span aria-hidden>
              {hero.lineBefore} <ShuffleWords words={hero.shuffleWords} /> {hero.lineAfter}
            </span>
          </p>
          <a
            href="#origin"
            className="hero-fade label inline-flex items-center gap-2 text-mist transition-colors hover:text-signal"
          >
            {hero.scrollHint}
            <ArrowDown size={14} strokeWidth={1.5} className="animate-bounce" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
