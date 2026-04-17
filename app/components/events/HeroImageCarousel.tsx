"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";

const NOISE_BG =
  "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgbW9kZT0ib3ZlcmxheSIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=')]";

const ASPECT = "relative w-full aspect-[16/7] sm:aspect-[16/6] lg:aspect-[16/5]";

function BackLink() {
  return (
    <div className="absolute top-4 left-4 sm:left-6 z-20">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back
      </Link>
    </div>
  );
}

type Props = {
  images: string[];
  gradientClass: string;
};

export default function HeroImageCarousel({ images, gradientClass }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  function scrollTo(index: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  if (images.length === 0) {
    return (
      <div className={`${ASPECT} bg-gradient-to-br ${gradientClass}`}>
        <div className={`absolute inset-0 ${NOISE_BG} opacity-40`} />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950 to-transparent" />
        <BackLink />
      </div>
    );
  }

  const multi = images.length > 1;
  const atStart = activeIndex === 0;
  const atEnd = activeIndex === images.length - 1;

  return (
    <div className={`${ASPECT} overflow-hidden group/hero`}>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex h-full overflow-x-auto snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            draggable={false}
            className="shrink-0 w-full h-full object-cover snap-center select-none"
          />
        ))}
      </div>

      {/* Bottom scrim — fades into page background */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />

      <BackLink />

      {multi && (
        <>
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scrollTo(activeIndex - 1)}
            aria-label="Previous image"
            disabled={atStart}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover/hero:opacity-100 disabled:opacity-0 hover:bg-black/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scrollTo(activeIndex + 1)}
            aria-label="Next image"
            disabled={atEnd}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover/hero:opacity-100 disabled:opacity-0 hover:bg-black/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 010 .708L10.293 8l-5.647 5.646a.5.5 0 00.708.708l6-6a.5.5 0 000-.708l-6-6a.5.5 0 00-.708 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Centered dot indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === activeIndex
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
