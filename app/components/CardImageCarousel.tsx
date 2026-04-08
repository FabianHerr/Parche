"use client";

import { useRef, useState, useCallback } from "react";

const NOISE_BG =
  "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgbW9kZT0ib3ZlcmxheSIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=')]";

type Props = {
  images: string[];
  gradientClass: string;
  tagBadge: React.ReactNode;
};

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 010 .708L10.293 8l-5.647 5.646a.5.5 0 00.708.708l6-6a.5.5 0 000-.708l-6-6a.5.5 0 00-.708 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function CardImageCarousel({ images, gradientClass, tagBadge }: Props) {
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

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    scrollTo(Math.max(0, activeIndex - 1));
  }

  function next(e: React.MouseEvent) {
    e.preventDefault();
    scrollTo(Math.min(images.length - 1, activeIndex + 1));
  }

  // Gradient fallback
  if (images.length === 0) {
    return (
      <div className={`relative aspect-[3/2] bg-gradient-to-br ${gradientClass} flex items-end p-3 sm:p-4`}>
        <div className={`absolute inset-0 ${NOISE_BG} opacity-40`} />
        <span className="relative z-10">{tagBadge}</span>
      </div>
    );
  }

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === images.length - 1;
  const multi = images.length > 1;

  return (
    <div className="relative aspect-[3/2] overflow-hidden group/carousel">

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

      {/* Bottom gradient scrim */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Tag badge */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
        {tagBadge}
      </div>

      {multi && (
        <>
          {/* Left arrow */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            disabled={atStart}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 hover:bg-black/70"
          >
            <ChevronLeft />
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            disabled={atEnd}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 hover:bg-black/70"
          >
            <ChevronRight />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3.5 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.preventDefault(); scrollTo(i); }}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === activeIndex
                    ? "w-3 h-1.5 bg-white"
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
