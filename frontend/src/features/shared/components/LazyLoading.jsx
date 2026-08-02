// LazyImage.jsx

import { memo, useEffect, useRef, useState } from "react";

/*
|--------------------------------------------------------------------------
| Shared IntersectionObserver
|--------------------------------------------------------------------------
| All LazyImage components use ONE observer instead of creating
| hundreds of separate IntersectionObserver instances.
|
| 300 images -> 1 observer
|--------------------------------------------------------------------------
*/

const callbacks = new WeakMap();

let observer = null;

function getObserver() {
  if (typeof window === "undefined") return null;

  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const callback = callbacks.get(entry.target);

          if (callback) {
            callback();
          }

          callbacks.delete(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        /*
         * Vertical: 300px
         * Horizontal: 700px
         *
         * Upcoming horizontal cards start loading before
         * the user reaches them.
         */
        rootMargin: "300px 700px",
        threshold: 0,
      }
    );
  }

  return observer;
}

/*
|--------------------------------------------------------------------------
| LazyImage
|--------------------------------------------------------------------------
*/

export const LazyImage = memo(function LazyImage({
  src,
  alt = "",
  aspectRatio,
  className = "",
  imgClassName = "",
  eager = false,
  draggable = false,
  onLoaded
}) {
  const containerRef = useRef(null);

  const [shouldLoad, setShouldLoad] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (eager || shouldLoad) return;

    const element = containerRef.current;

    if (!element) return;

    const sharedObserver = getObserver();

    if (!sharedObserver) {
      setShouldLoad(true);
      return;
    }

    callbacks.set(element, () => {
      setShouldLoad(true);
    });

    sharedObserver.observe(element);

    return () => {
      callbacks.delete(element);
      sharedObserver.unobserve(element);
    };
  }, [eager, shouldLoad]);

  return (
    <div
      ref={containerRef}
      className={`
        relative
        h-full
        w-full
        overflow-hidden
        bg-surface-2/40
        ${className}
      `}
    >
      {/* Lightweight placeholder */}
      {!loaded && (
       <div className="absolute inset-0 overflow-hidden bg-surface-2/40">
          <div className="shimmer absolute inset-0" />
        </div>
      )}

      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          draggable={draggable}
          style={{ aspectRatio }}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          onLoad={() => {
            setLoaded(true);
            onLoaded?.(); 
          }}
          className={`w-full object-cover ${loaded ? "opacity-100" : "opacity-0"}  ${imgClassName} `}
        />
      )}
    </div>
  );
});





export function HeroSkeleton() {
  return (
    <div className="relative h-[440px] overflow-hidden rounded-2xl border border-white/5 sm:h-[500px] sm:rounded-[2rem] lg:h-[560px]">
      <div className="absolute inset-0 bg-surface-2/60">
        <span className="shimmer absolute inset-0 block" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent sm:bg-gradient-to-r sm:from-background sm:via-background/70 sm:to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-between p-4 pb-10 sm:p-8 sm:pb-10 lg:p-10">
        <Skeleton className="h-7 w-32 rounded-full sm:h-8 sm:w-40" />

        <div className="max-w-xl">
          <div className="mb-2 flex gap-1.5 sm:mb-3 sm:gap-2">
            <Skeleton className="h-5 w-16 rounded-full sm:h-6 sm:w-20" />
            <Skeleton className="h-5 w-20 rounded-full sm:h-6 sm:w-24" />
            <Skeleton className="h-5 w-14 rounded-full sm:h-6 sm:w-16" />
          </div>

          <Skeleton className="h-9 w-3/4 rounded-xl sm:h-14 lg:h-16" />

          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-full rounded-full sm:h-3.5" />
            <Skeleton className="h-3 w-11/12 rounded-full sm:h-3.5" />
            <Skeleton className="hidden h-3 w-2/3 rounded-full sm:block sm:h-3.5" />
          </div>

          <div className="mt-4 flex items-center gap-2 sm:mt-6 sm:gap-3">
            <Skeleton className="h-10 w-32 rounded-full sm:h-12 sm:w-40" />
            <Skeleton className="h-10 w-24 rounded-full sm:h-12 sm:w-36" />
            <Skeleton className="h-11 w-11 rounded-full" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-5 sm:left-auto sm:right-6 sm:translate-x-0 sm:gap-2">
        {[28, 8, 8, 8, 8].map((w, i) => (
          <span
            key={i}
            className="h-1.5 rounded-full bg-white/20 sm:h-2"
            style={{ width: w }}
          />
        ))}
      </div>
    </div>
  );
}






export function Skeleton({ className = "", rounded = "rounded-xl" }) {
  return (
    <div
      className={`relative overflow-hidden bg-surface-2/70 ${rounded} ${className}`}
    >
      <div className="shimmer absolute inset-0" />
    </div>
  );
}

/**
 * A poster placeholder that stands in for artwork.
 * Uses gradients + shimmer only — no images anywhere.
 */
export function PosterSkeleton({ className = "", rounded = "rounded-2xl", label, tone = 0 }) {
  const tones = [
    "from-primary/25 via-surface-2 to-surface",
    "from-sky-400/20 via-surface-2 to-surface",
    "from-fuchsia-400/20 via-surface-2 to-surface",
    "from-amber-400/20 via-surface-2 to-surface",
    "from-emerald-400/20 via-surface-2 to-surface",
    "from-rose-400/20 via-surface-2 to-surface",
  ];
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${tones[tone % tones.length]} ${rounded} ${className}`}
    >
      <div className="shimmer absolute inset-0" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="select-none text-[10px] font-semibold uppercase tracking-[0.25em] text-foreground/25">
          {label ?? ""}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
    </div>
  );
}


