"use client";

import { ArrowUp } from "lucide-react";
import { profile } from "@/content";
import { bus } from "@/lib/bus";
import { scrollToId } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer className="relative border-t border-signal/15 bg-[#061114] px-[var(--gutter)] py-10 md:pr-[calc(var(--gutter)+48px)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="display text-[clamp(40px,6vw,72px)]">{profile.name}</p>
          <p className="label mt-3 text-mist">
            © 2026 {profile.name} · {profile.brand} · {profile.location}
          </p>
          <p className="label mt-2 text-mist/80">
            Press <kbd className="rounded border border-mist/40 px-1.5 text-signal">/</kbd> for the terminal
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            scrollToId("top");
            bus.emit("particles:reassemble");
          }}
          className="label group inline-flex items-center gap-3 self-start text-bone transition-colors hover:text-signal md:self-auto"
        >
          Back to top
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-mist/40 transition-all group-hover:border-signal group-hover:shadow-[0_0_24px_-4px_var(--signal)]">
            <ArrowUp size={16} strokeWidth={1.5} aria-hidden />
          </span>
        </button>
      </div>
    </footer>
  );
}
