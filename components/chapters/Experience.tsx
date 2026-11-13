"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { education, experience, profile } from "@/content";
import { isTodo } from "@/lib/todo";
import Magnetic from "../Magnetic";

/** 04/ EXPERIENCE & EDUCATION — where Hammad works and studied, as a clean professional timeline. */
export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".xp-intro", {
          opacity: 0,
          y: 40,
          duration: 1.2,
          stagger: 0.12,
          scrollTrigger: { trigger: ".xp-intro", start: "top 80%" },
        });
        gsap.from(".xp-stat", {
          opacity: 0,
          y: 36,
          stagger: 0.12,
          duration: 1,
          scrollTrigger: { trigger: ".xp-stats", start: "top 80%" },
        });
        gsap.utils.toArray<HTMLElement>(".xp-role").forEach((row) => {
          const q = gsap.utils.selector(row);
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 78%" } })
            .from(q(".xp-line"), { scaleX: 0, transformOrigin: "left", duration: 1.1, ease: "power3.inOut" })
            .from(q(".xp-item"), { opacity: 0, y: 28, stagger: 0.07, duration: 0.8 }, 0.25);
        });
      });
    },
    { scope: root },
  );

  const linkedin = profile.socials.linkedin;

  return (
    <section
      id="experience"
      ref={root}
      aria-labelledby="experience-title"
      className="sky-dusk-fade relative px-[var(--gutter)] py-32 md:pr-[calc(var(--gutter)+48px)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="label text-signal">04/ Experience &amp; Education</p>
        <h2 id="experience-title" className="display mt-4 text-[clamp(56px,10vw,150px)]">
          Where I <span className="text-signal">work</span>
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-16">
          <p className="xp-intro text-[clamp(22px,2.6vw,38px)] font-semibold leading-snug text-bone">
            {experience.intro}
          </p>
          <p className="xp-intro text-mist">{experience.lead}</p>
        </div>

        <ol className="mt-24 flex flex-col gap-20 md:gap-24" aria-label="Work experience, newest first">
          {experience.roles.map((r) => (
            <li key={`${r.title}-${r.org}`} className="xp-role">
              <div className="xp-line h-px w-full bg-gradient-to-r from-signal/70 via-mist/25 to-transparent" aria-hidden />

              <div className="mt-8 grid gap-6 md:grid-cols-[240px_1fr] md:gap-14">
                {/* when & where */}
                <div className="xp-item">
                  <p className="label text-bone">
                    {r.start} — {r.end}
                  </p>
                  {r.end === "Present" && (
                    <p className="label mt-3 inline-flex items-center gap-2 rounded-full border border-signal/40 px-3 py-1.5 text-[11px] text-signal">
                      <span className="relative flex h-2 w-2" aria-hidden>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                      </span>
                      Current
                    </p>
                  )}
                  <p className="label mt-4 text-mist">{r.location}</p>
                </div>

                {/* what */}
                <div>
                  <h3 className="xp-item text-[clamp(30px,3.6vw,54px)] font-semibold leading-[1.05] tracking-tight">
                    {r.title}
                  </h3>
                  <p className="xp-item label mt-3 text-ember">
                    {r.org} · {r.type}
                  </p>
                  <p className="xp-item mt-6 max-w-3xl text-[1.05em] text-bone/90">{r.summary}</p>
                  <ul className="mt-6 grid max-w-4xl gap-x-10 gap-y-3 lg:grid-cols-2">
                    {r.points.map((pt) => (
                      <li key={pt} className="xp-item flex gap-3 text-mist">
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* ── Education ── */}
        <div id="education" className="mt-40 scroll-mt-24">
          <p className="label text-ember">Education</p>
          <h3 className="display mt-4 text-[clamp(48px,8vw,120px)]">
            Where I <span className="text-ember">studied</span>
          </h3>

          <ul className="xp-stats mt-12 grid gap-4 sm:grid-cols-3" aria-label="Highlights">
            {education.highlights.map((h) => (
              <li
                key={h.label}
                className="xp-stat rounded-2xl border border-mist/15 bg-night/60 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-ember/50"
              >
                <p className="display text-[clamp(48px,5vw,84px)] leading-none text-ember">{h.value}</p>
                <p className="mt-4 text-mist">{h.label}</p>
              </li>
            ))}
          </ul>

          <ol className="mt-20 flex flex-col gap-20 md:gap-24" aria-label="Education, newest first">
            {education.studies.map((e) => (
              <li key={e.school} className="xp-role">
                <div className="xp-line h-px w-full bg-gradient-to-r from-ember/70 via-mist/25 to-transparent" aria-hidden />
                <div className="mt-8 grid gap-6 md:grid-cols-[240px_1fr] md:gap-14">
                  <div className="xp-item">
                    <p className="label text-bone">
                      {e.start} — {e.end}
                    </p>
                    <p className="label mt-3 inline-flex items-center gap-2 rounded-full border border-ember/50 px-3 py-1.5 text-[11px] text-ember">
                      Grade {e.grade}
                    </p>
                  </div>
                  <div>
                    <h4 className="xp-item text-[clamp(30px,3.6vw,54px)] font-semibold leading-[1.05] tracking-tight">
                      {e.field}
                    </h4>
                    <p className="xp-item label mt-3 text-ember">
                      {e.level} · {e.school}
                    </p>
                    <p className="xp-item mt-6 max-w-3xl text-[1.05em] text-bone/90">{e.summary}</p>
                    <ul className="mt-6 grid max-w-4xl gap-x-10 gap-y-3 lg:grid-cols-2">
                      {e.points.map((pt) => (
                        <li key={pt} className="xp-item flex gap-3 text-mist">
                          <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {!isTodo(linkedin) && (
          <div className="mt-24 flex flex-wrap items-center gap-6">
            <Magnetic>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn-signal">
                Full profile on LinkedIn <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Magnetic>
          </div>
        )}
      </div>
    </section>
  );
}
