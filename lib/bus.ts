"use client";

/**
 * Tiny event bus so the loader, the particle portrait and the footer
 * can talk without prop-drilling.
 */
type Events = "intro:done" | "particles:reassemble";

const target = typeof window !== "undefined" ? new EventTarget() : null;
const fired = new Set<Events>();

export const bus = {
  emit(name: Events) {
    fired.add(name);
    target?.dispatchEvent(new Event(name));
  },
  on(name: Events, fn: () => void) {
    target?.addEventListener(name, fn);
    return () => target?.removeEventListener(name, fn);
  },
  /** True if a one-off event (like intro:done) has already happened. */
  has(name: Events) {
    return fired.has(name);
  },
};
