"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { projects, type Project } from "@/content";
import { T, isTodo } from "@/lib/todo";
import Magnetic from "../Magnetic";

function isDark(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
}

function Media({ p }: { p: Project }) {
  const m = p.media;
  if (m.video) {
    return (
      <video
        className="h-full w-full object-cover"
        src={m.video}
        poster={m.src ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-label={m.alt}
      />
    );
  }
  if (m.src) {
    return (
      <Image
        src={m.src}
        alt={m.alt}
        width={m.width}
        height={m.height}
        sizes="(min-width: 900px) 55vw, 92vw"
        className="h-full w-full object-cover object-top transition-[filter] duration-300 group-hover:[filter:url(#rgb-split)]"
      />
    );
  }
  if (p.logo) {
    const l = p.logo;
    return (
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{ background: l.bg }}
        role="img"
        aria-label={`${p.name} logo`}
      >
        {/* soft light behind the mark so the panel doesn't feel flat */}
        <div
          className="absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: "radial-gradient(60% 55% at 50% 50%, rgba(255,255,255,.12), transparent 70%)" }}
          aria-hidden
        />
        <Image
          src={l.src}
          alt=""
          width={l.width}
          height={l.height}
          unoptimized
          className="relative h-auto w-[min(62%,var(--logo-max))] transition-transform duration-700 ease-[var(--ease)] group-hover:scale-105"
          style={{ ["--logo-max" as string]: `${Math.round(l.width * 0.48)}px` }}
        />
        <span
          className="label absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-60"
          style={{ color: isDark(l.bg) ? "#edebe6" : "#07070b" }}
        >
          Live site ↗
        </span>
      </div>
    );
  }
  return (
    <div className="placeholder-frame flex h-full w-full items-center justify-center" role="img" aria-label={`Placeholder: ${m.label}`}>
      <div className="px-6 text-center">
        <p className="label text-ember">Screenshot needed</p>
        <p className="mt-2 font-mono text-sm text-mist">/public/images/projects/{p.id}.jpg</p>
        <p className="display mt-6 text-[clamp(40px,6vw,90px)] text-mist/30">{p.name}</p>
      </div>
    </div>
  );
}

function Scene({ p, i }: { p: Project; i: number }) {
  return (
    <article
      className="project-scene relative flex min-h-[100svh] items-center overflow-hidden px-[var(--gutter)] py-20 md:py-14 md:pr-[calc(var(--gutter)+48px)]"
      aria-labelledby={`p-${p.id}`}
    >
      {/* vertical name on the side rail */}
      <div
        className="p-rail display vertical-rail pointer-events-none absolute left-[calc(var(--gutter)-0.08em)] top-1/2 hidden -translate-y-1/2 text-[clamp(80px,9vw,150px)] text-transparent [-webkit-text-stroke:1px_color-mix(in_srgb,var(--mist)_45%,transparent)] lg:block"
        aria-hidden
      >
        {p.name}
      </div>

      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:pl-[clamp(90px,9vw,150px)]">
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="view"
          className="p-media group block aspect-[16/10] overflow-hidden rounded-xl border border-mist/15 bg-night"
          aria-label={`Open ${p.name} live (opens in a new tab)`}
        >
          <div className="p-media-inner h-full w-full">
            <Media p={p} />
          </div>
        </a>

        <div>
          <p className="p-item label text-mist">
            <span className="text-signal">0{i + 1}</span> / 0{projects.length} · Live project
          </p>
          <h3 id={`p-${p.id}`} className="p-item display mt-3 text-[clamp(52px,6vw,96px)]">
            {p.name}
          </h3>
          <p className="p-item mt-2 text-lg text-bone">{p.oneLiner}</p>

          <dl className="mt-6 space-y-4">
            {(
              [
                ["Problem", p.problem],
                ["What I built", p.built],
                ["What I learned", p.learned],
              ].filter(([, v]) => v && !isTodo(v)) as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="p-item grid gap-1 border-t border-mist/15 pt-4 sm:grid-cols-[130px_1fr] sm:gap-4">
                <dt className="label pt-1 text-signal">{k}</dt>
                <dd className="text-[0.95em] text-mist">
                  <T>{v}</T>
                </dd>
              </div>
            ))}
          </dl>

          <ul className="p-item mt-6 flex flex-wrap gap-2" aria-label="Tech and focus">
            {p.tags.map((t) => (
              <li key={t}>
                {t.startsWith("{{TODO") ? (
                  <T>{t}</T>
                ) : (
                  <span className="label rounded-full border border-ember/40 px-3 py-1.5 text-[11px] text-ember">{t}</span>
                )}
              </li>
            ))}
          </ul>

          <div className="p-item mt-7">
            <Magnetic>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn-signal">
                Visit live <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
                <span className="sr-only">: {p.name} (opens in a new tab)</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </article>
  );
}

/** 05/ SIGNAL — the one red moment, then each project as its own pinned scene. */
export default function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".work-word", {
          yPercent: 100,
          duration: 1.1,
          stagger: 0.08,
          scrollTrigger: { trigger: "#work-title", start: "top 65%" },
        });
      });

      mm.add(MQ.desktop, () => {
        gsap.utils.toArray<HTMLElement>(".project-scene").forEach((scene) => {
          const q = gsap.utils.selector(scene);
          // Reveal while the scene scrolls into view…
          gsap
            .timeline({ scrollTrigger: { trigger: scene, start: "top 85%", end: "top 5%", scrub: 0.8 } })
            .fromTo(q(".p-media"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0)
            .fromTo(q(".p-media-inner"), { scale: 1.15 }, { scale: 1, duration: 1.3 }, 0)
            .from(q(".p-item"), { opacity: 0, y: 40, stagger: 0.08, duration: 0.6 }, 0.2);
          // …then hold it on screen (pinned) while the side-rail name drifts.
          gsap.fromTo(
            q(".p-rail"),
            { yPercent: -35 },
            {
              yPercent: -65,
              ease: "none",
              scrollTrigger: { trigger: scene, start: "top top", end: "+=70%", scrub: true, pin: true },
            },
          );
        });
      });

      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".project-scene").forEach((scene) => {
          const q = gsap.utils.selector(scene);
          gsap.fromTo(
            q(".p-media"),
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, scrollTrigger: { trigger: scene, start: "top 75%" } },
          );
          gsap.from(q(".p-item"), {
            opacity: 0,
            y: 24,
            stagger: 0.06,
            duration: 0.8,
            scrollTrigger: { trigger: scene, start: "top 55%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} aria-labelledby="work-heading" className="relative bg-void">
      <div
        id="work-title"
        className="relative flex min-h-[100svh] flex-col justify-between bg-flare px-[var(--gutter)] pb-[var(--gutter)] pt-24 text-void"
      >
        <p className="label">05/ Signal</p>
        <h2 id="work-heading" className="display text-[clamp(96px,26vw,420px)] leading-[0.8]">
          <span className="block overflow-hidden"><span className="work-word inline-block">The</span></span>
          <span className="block overflow-hidden"><span className="work-word inline-block">Work</span></span>
        </h2>
        <p className="label max-w-md text-void">
          Real projects, live on the web. Click through and try them.
        </p>
      </div>

      <div className="sky-dusk-fade">
        {projects.map((p, i) => (
          <Scene key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
