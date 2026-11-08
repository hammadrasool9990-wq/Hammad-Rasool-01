"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Photo as PhotoT } from "@/content";

type Props = {
  photo: PhotoT;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Duotone (void → signal) by default; true colour on hover / when scrolled into focus on touch. */
  duotone?: boolean;
  innerClassName?: string;
};

/**
 * One of Hammad's photos. If `src` is null, renders a labelled placeholder
 * frame so it's obvious which photo belongs there.
 */
export default function Photo({
  photo,
  className = "",
  sizes = "(min-width: 900px) 40vw, 90vw",
  priority,
  duotone = true,
  innerClassName = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Touch screens have no hover: reveal colour while the photo sits mid-screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || !duotone || !photo.src || matchMedia("(hover: hover)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle("is-revealed", e.isIntersecting),
      { rootMargin: "-38% 0px -38% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [duotone, photo.src]);

  if (!photo.src) {
    return (
      <div
        className={`placeholder-frame relative flex items-center justify-center ${className}`}
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        role="img"
        aria-label={`Placeholder: ${photo.label}`}
      >
        <div className="px-6 text-center">
          <div className="label text-ember">Photo needed</div>
          <div className="mt-2 font-mono text-sm text-mist">{photo.label}</div>
        </div>
      </div>
    );
  }

  const img = (extra = "") => (
    <Image
      src={photo.src!}
      alt={extra ? "" : photo.alt}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      priority={priority}
      className={`h-full w-full object-cover ${innerClassName}`}
    />
  );

  if (!duotone) {
    return (
      <div ref={ref} className={`relative overflow-hidden ${className}`}>
        {img()}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`duo ${className}`}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      data-cursor="photo"
    >
      <div className="duo__color">{img()}</div>
      <div className="duo__tone" aria-hidden>
        {img("tone")}
      </div>
    </div>
  );
}
