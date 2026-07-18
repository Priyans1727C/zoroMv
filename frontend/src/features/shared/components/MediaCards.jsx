import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Star, Play, Plus } from "lucide-react";

function getPlaceholderGradient(title) {
  const hues = [175, 200, 240, 280, 320, 40, 80, 120, 160, 200, 220, 260];
  const hue = hues[(title?.length || 0) % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 50%, 12%), hsl(${(hue + 40) % 360}, 40%, 6%))`;
}

function CardImage({ src, alt, aspectRatio, className = "" }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`w-full flex items-center justify-center ${className}`}
        style={{ aspectRatio, background: getPlaceholderGradient(alt) }}
      >
        <Film className="h-8 w-8 text-white/20" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full object-cover ${className}`}
      style={{ aspectRatio }}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}


/* ─── Continue Watching Card ─── */
export function ContinueCard({ item, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative w-[200px] shrink-0 cursor-pointer sm:w-[260px] lg:w-[300px]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-surface shadow-lg shadow-black/20">
        <CardImage
          src={item.backdropUrl}
          alt={item.title}
          aspectRatio="16/9"
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Center play */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl"
          >
            <Play className="h-5 w-5 fill-current" />
          </motion.button>
        </div>

        {/* Progress bar - always visible */}
        <div className="absolute bottom-0 inset-x-0">
          <div className="h-1 bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${item.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-full bg-primary shadow-[0_0_8px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-2.5">
        <h4 className="truncate text-sm font-semibold text-foreground/90">{item.title}</h4>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.episode}</p>
      </div>
    </motion.div>
  );
}

/* ─── Poster Card ─── */
export function PosterCard({ item, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10 }}
      className="group relative w-[150px] shrink-0 cursor-pointer sm:w-[180px] lg:w-[220px]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-surface shadow-lg shadow-black/20">
        <CardImage
          src={item.posterUrl}
          alt={item.title}
          aspectRatio="2/3"
          className="transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {item.isNew && (
            <span className="rounded-md bg-red-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              New
            </span>
          )}
          {item.rating && (
            <span className="flex items-center gap-0.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-sm">
              <Star className="h-2.5 w-2.5 fill-amber-400" />
              {item.rating}
            </span>
          )}
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25"
          >
            <Play className="h-5 w-5 fill-current" />
          </motion.button>
        </div>

        {/* Bottom action bar */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
            <Play className="h-3 w-3 fill-current" />
            Play
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info below card */}
      <div className="mt-3 px-2.5">
        <h4 className="truncate text-sm font-semibold text-foreground/90">{item.title}</h4>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{item.year}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
          <span className="truncate">{item.genres.slice(0, 2).join(" /")}</span>
        </div>
      </div>
    </motion.div>
  );
}










/* ─── Numbered Card (Top-10 style with bottom-left corner notch + badge) ─── */
export function NumberedCard({ item, index = 0 }) {
  // Sizing constants used by the notch geometry — the corner radius that
  // makes the whole notch/badge look like one continuous shape is derived
  // from the badge diameter, exactly like the original component.
  const gap = 6;
  const badgeSize = 58;
  const roundCard = badgeSize / 2 + gap / 2; // 32px
  const roundCardPx = `${roundCard}px`;

  // The two seam corner-caps are painted with a radial-gradient that leaves
  // a quarter-disk transparent so the card's own background image shows
  // through naturally — no need to duplicate the image on the seams.
  // The gradient color is a CSS variable so it stays in sync with the theme.
  const seamStyle = {
    position: "absolute",
    width: roundCardPx,
    height: roundCardPx,
    zIndex: 2,
    display: "block",
    pointerEvents: "none",
    border: "none",
    outline: "none",
    boxShadow: "none",
    background: `radial-gradient(circle at top right, transparent ${
      roundCard - 1
    }px, var(--color-surface) ${roundCard}px)`,
    WebkitBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10 }}
      className="group relative w-[180px] shrink-0 cursor-pointer sm:w-[220px] lg:w-[260px]"
    >
      <div
        className="relative overflow-hidden bg-surface shadow-lg shadow-black/20 border border-white/[0.04]"
        style={{ borderRadius: roundCardPx }}
      >
        <CardImage
          src={item.posterUrl}
          alt={item.title}
          aspectRatio="2/3"
          className="transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Base bottom-fade so title/badge always read clearly */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Top badges — identical vocabulary to PosterCard */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
          {item.isNew && (
            <span className="rounded-md bg-red-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              New
            </span>
          )}
          {item.rating && (
            <span className="flex items-center gap-0.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-sm">
              <Star className="h-2.5 w-2.5 fill-amber-400" />
              {item.rating}
            </span>
          )}
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25"
          >
            <Play className="h-5 w-5 fill-current" />
          </motion.button>
        </div>

        {/* Title strip pinned above the notch (right side) */}
       <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-end p-3 pl-[76px]">
  <div className="min-w-0 text-right">
    <h4
      title={item.title}
      className="truncate text-[13px] font-bold leading-tight text-foreground drop-shadow-md sm:text-sm"
    >
      {item.title}
    </h4>

    {/* {item.year && (
      <p className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground">
        {item.year}
      </p>
    )} */}
  </div>
</div>

        {/* ── BOTTOM-LEFT CORNER NOTCH ── */}
        <div
          className="absolute left-0 bottom-0 z-20 flex flex-row items-center justify-center bg-surface"
          style={{
            borderTopRightRadius: roundCardPx,
            paddingTop: gap,
            paddingRight: gap,
            border: "none",
            outline: "none",
            boxShadow: "none",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        >
          {/* Top-left seam corner-cap */}
          <span
            style={{
              ...seamStyle,
              bottom: "100%",
              left: 0,
              transform: "translateY(1px) translateZ(0)",
            }}
          />

          {/* Bottom-right seam corner-cap */}
          <span
            style={{
              ...seamStyle,
              left: "100%",
              bottom: 0,
              transform: "translateX(-1px) translateZ(0)",
            }}
          />

          {/* Number badge */}
          <div
            className="grid place-items-center rounded-full bg-white/[0.06] text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
            style={{
              width: badgeSize,
              minWidth: badgeSize,
              maxWidth: badgeSize,
              height: badgeSize,
              minHeight: badgeSize,
              maxHeight: badgeSize,
              fontSize: Math.round(badgeSize * 0.42),
              fontWeight: 800,
              letterSpacing: "-0.02em",
              border: "none",
              outline: "none",
              userSelect: "none",
              boxShadow:
                "rgba(0,0,0,0.02) 0px 1px 3px 0px, rgba(255,255,255,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.35) 0px 4px 10px 0px",
            }}
          >
            {item.rank ?? index + 1}
          </div>
        </div>
      </div>

      {/* Info below card — identical layout to PosterCard */}
      {/* <div className="mt-3 px-2.5">
        <h4 className="truncate text-sm font-semibold text-foreground/90">{item.title}</h4>
        {item.genres && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {item.year && <span>{item.year}</span>}
            {item.year && (
              <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
            )}
            <span className="truncate">{item.genres.slice(0, 2).join(" / ")}</span>
          </div>
        )}
      </div> */}
    </motion.div>
  );
}
