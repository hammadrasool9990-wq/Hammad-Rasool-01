"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

/** Cycles words with a quick scramble. Screen readers get a static sentence instead. */
export default function ShuffleWords({ words, interval = 2200 }: { words: string[]; interval?: number }) {
  const [text, setText] = useState(words[0]);
  const idx = useRef(0);
  const cur = useRef(words[0]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setInterval(() => {
        idx.current = (idx.current + 1) % words.length;
        setText(words[idx.current]);
      }, interval);
      return () => clearInterval(t);
    }
    let raf = 0;
    const scramble = (to: string) => {
      const from = cur.current;
      cur.current = to;
      const len = Math.max(from.length, to.length);
      const queue = Array.from({ length: len }, (_, i) => ({
        to: to[i] ?? "",
        start: Math.floor(Math.random() * 8),
        end: 8 + Math.floor(Math.random() * 12),
      }));
      let frame = 0;
      const step = () => {
        let out = "";
        let done = 0;
        for (const q of queue) {
          if (frame >= q.end) {
            done++;
            out += q.to;
          } else if (frame >= q.start) {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else out += q.to ? " " : "";
        }
        setText(out);
        frame++;
        if (done < queue.length) raf = requestAnimationFrame(step);
      };
      step();
    };
    const t = setInterval(() => {
      idx.current = (idx.current + 1) % words.length;
      cancelAnimationFrame(raf);
      scramble(words[idx.current]);
    }, interval);
    return () => {
      clearInterval(t);
      cancelAnimationFrame(raf);
    };
  }, [words, interval]);

  return (
    <span className="inline-block min-w-[6.2ch] text-signal" aria-hidden>
      [{text}]
    </span>
  );
}
