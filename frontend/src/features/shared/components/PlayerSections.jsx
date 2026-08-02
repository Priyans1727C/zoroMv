import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useState,  } from "react";
import { Loader2, MonitorPlay, Server } from "lucide-react";

import { Check, ChevronDown, Clock, ListVideo, Play } from "lucide-react";
import { useMemo } from "react";



export const EASE = [0.22, 1, 0.36, 1];

export const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});



/* ------------------------------------------------------------------ */
/*  VideoFrame — the embed player shell                                */
/* ------------------------------------------------------------------ */

export function VideoFrame({ src, serverName, latency, mediaType, contextLabel, fill = false }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 8000);
    return () => window.clearTimeout(t);
  }, [src]);

  /* `fill` is the Series-mode contract: the parent layout hands us a bounded
     height via flex-1, and we grow/shrink to fill it (so the Servers panel
     always has room on a locked 100vh panel). Movie mode passes fill=false
     and we keep the classic fixed tier heights. */
  const heightCls = fill
    ? "h-[400px] sm:h-[500px] lg:h-full lg:min-h-0"
    : "h-[400px] sm:h-[500px] lg:h-[515px]";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-black/70 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] sm:rounded-[2rem] ${heightCls}`}
    >
      {/* floating stream status pill */}
      {/* floating stream status pill */}
      <div className="pointer-events-none absolute left-4 top-4 z-30 hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-background/60 px-3 py-1.5 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
          {contextLabel ?? (mediaType === "movie" ? "Movie" : "Series")} · {serverName}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto"
        >
          <iframe
            id="player-iframe"
            title="Video player"
            className="h-full w-full"
            allowFullScreen
            allow="autoplay; fullscreen *; picture-in-picture *"
            referrerPolicy="strict-origin-when-cross-origin"
            src={src}
            onLoad={() => setLoading(false)}
          />
        </motion.div>
      </AnimatePresence>

      {/* connecting overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-background/90 backdrop-blur-md"
          >
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-primary/25 bg-primary/10">
              <MonitorPlay size={26} className="text-primary" />
              <motion.span
                className="absolute inset-0 rounded-2xl border border-primary/40"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Loader2 size={14} className="animate-spin text-primary" />
              Connecting to
              <span className="font-semibold text-foreground">{serverName}</span>
              {latency ? (
                <span className="text-xs text-muted-foreground/70">· ~{latency}ms</span>
              ) : null}
            </div>
            {contextLabel ? (
              <div className="-mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/70">
                {contextLabel}
              </div>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-white/5">
              <div className="shimmer absolute inset-y-0 left-0 w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  ServerSelector — SUB/DUB tabs + provider grid                      */
/* ------------------------------------------------------------------ */

export function ServerSelector({
  servers,
  value,
  onChange,
}) {
  const [category, setCategory] = useState("sub");

  // Only show servers of the selected category
  const filteredServers = useMemo(
    () => servers.filter((server) => server.category === category || server.category==="all"),
    [servers, category]
  );

  return (
    <motion.div
      {...fade(0.12)}
      className="glass-panel rounded-2xl p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
            <Server size={16} />
          </div>

          <div>
            <div className="text-sm font-semibold">
              Servers
            </div>

            <div className="hidden text-[11px] text-muted-foreground sm:block">
              If one server fails, try another
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex rounded-full border border-white/5 bg-secondary/60 p-0.5">
          {["sub", "dub"].map((tab) => {
            const active = category === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setCategory(tab)}
                className={`relative rounded-full px-4 py-1 text-[11px] font-bold uppercase transition-colors duration-200 ${
                  active
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="audio-pill"
                    className="absolute inset-0 rounded-full bg-primary shadow-sm"
                    transition={{
                      type: "spring",
                      bounce: 0.25,
                      duration: 0.45,
                    }}
                  />
                )}

                <span className="relative z-10">
                  {tab}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-3 gap-1 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
        {filteredServers.map((server) => {
          const Icon = server.icon;

          // Highlight only if this server is actually selected
          const isSelected = value === server.name;

          return (
            <button
              key={server.name}
              type="button"
              onClick={() => onChange(server.name)}
              className={`group flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                isSelected
                  ? "border-primary/50 bg-primary/10 ring-1 ring-primary/20"
                  : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              <Icon
                size={18}
                className={
                  isSelected
                    ? "text-primary"
                    : "text-muted-foreground transition-colors group-hover:text-foreground"
                }
              />

              <div className="w-full truncate text-center text-xs font-semibold">
                {server.name}
              </div>

              <div
                className={`text-[9px] font-semibold uppercase tracking-widest ${
                  isSelected
                    ? "text-primary"
                    : "text-muted-foreground/60"
                }`}
              >
                {isSelected ? "ONLINE" : `${server.ms}ms`}
              </div>
            </button>
          );
        })}
      </div>

      {filteredServers.length === 0 && (
        <div className="py-6 text-center text-sm text-muted-foreground">
          No {category.toUpperCase()} servers available.
        </div>
      )}
    </motion.div>
  );
}



/* ─── small helpers ─────────────────────────────────────────────── */
function hueFrom(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % 360;
}

function thumbStyle(title) {
  const h = hueFrom(title);
  return {
    backgroundImage: `
      radial-gradient(120% 80% at 80% 10%, hsl(${h} 70% 28% / 0.55), transparent 60%),
      radial-gradient(100% 100% at 10% 100%, hsl(${(h + 40) % 360} 80% 18% / 0.7), transparent 70%),
      linear-gradient(135deg, hsl(${h} 55% 16%), hsl(${(h + 30) % 360} 60% 9%))
    `,
  };
}

/* three pulsing bars — the only "alive" indicator on an active card */
function EqBars() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-[2.5px] origin-bottom rounded-full bg-primary-foreground"
          style={{
            height: "100%",
            animation: "eq 900ms ease-in-out infinite",
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </span>
  );
}

/* stable partial-progress value for an unwatched episode */
function episodeProgress(ep) {
  if (ep.watched) return 100;
  const slot = ep.episodeNumber % 3;
  if (slot !== 2) return 0;
  return 28 + ((ep.episodeNumber * 13) % 52);
}

/* ─── one episode row ───────────────────────────────────────────── */
function EpisodeCard({ ep, season, active, index = 0, onPlay }) {
  const progress = episodeProgress(ep);
  const inProgress = progress > 0 && progress < 100;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 12) * 0.05, duration: 0.45, ease: EASE }}
    >
      <button
        type="button"
        onClick={() => onPlay(season, ep.episodeNumber)}
        aria-current={active ? "true" : undefined}
        aria-label={`Play season ${season} episode ${ep.episodeNumber}: ${ep.name}`}
        className={`group relative flex w-full cursor-pointer gap-3 rounded-2xl border p-2 text-left transition-all duration-200 sm:items-center sm:gap-4 sm:p-3 lg:gap-2.5 lg:rounded-xl lg:p-2 ${
          active
            ? "border-primary/30 bg-primary/[0.06]"
            : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.03]"
        }`}
      >
        {/* active accent bar */}
        {active && (
          <motion.span
            layoutId="ep-accent"
            className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-primary lg:top-2 lg:bottom-2"
            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
          />
        )}

        {/* big episode index — desktop only */}
        <span
          className={`hidden w-7 shrink-0 text-center text-xl font-black tabular-nums transition-colors sm:block lg:w-5 lg:text-base ${
            active
              ? "text-primary"
              : "text-muted-foreground/40 group-hover:text-primary"
          }`}
        >
          {ep.episodeNumber}
        </span>

        {/* thumbnail */}
        <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl border border-white/[0.05] sm:w-44 lg:w-32 lg:rounded-lg">
          {ep.episodePosterUrl ? (
            <img 
              src={ep.episodePosterUrl} 
              alt={ep.name} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              style={thumbStyle(ep.name)}
            />
          )}

          {/* now-playing pill */}
          {active && (
            <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-primary-foreground shadow">
              <EqBars />
              Live
            </span>
          )}

          {/* watched check */}
          {ep.watched && !active && (
            <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-sm">
              <Check size={12} strokeWidth={3} />
            </span>
          )}

          {/* in-progress bar */}
          {inProgress && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
              <div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* hover play overlay */}
          <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <motion.span
              initial={false}
              whileHover={{ scale: 1.08 }}
              className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg lg:h-8 lg:w-8"
            >
              <Play size={14} fill="currentColor" className="ml-0.5" />
            </motion.span>
          </span>
        </div>

        {/* text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`truncate text-sm font-bold sm:text-base lg:text-[13px] ${
                active
                  ? "text-foreground"
                  : "text-foreground group-hover:text-foreground"
              }`}
            >
              <span className="mr-2 font-bold text-muted-foreground sm:hidden">
                E{ep.episodeNumber}
              </span>
              {ep.name}
            </h4>
            <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground lg:text-[11px]">
              <Clock size={12} className="lg:h-3 lg:w-3" />
              {ep.runtime}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm lg:mt-0.5 lg:text-[11px] lg:leading-snug">
            {ep.overview}
          </p>
        </div>
      </button>
    </motion.li>
  );
}

/* ─── main export ───────────────────────────────────────────────── */
/* ─── main export ───────────────────────────────────────────────── */
// Update props to accept the split states
export function EpisodesSection({ series, listSeason, playingSeason, playingEpisode, onSeasonChange, onPlay }) {
  const seasons = series?.seasons ?? [];
  
  // The current UI list resolves around the listSeason
  const current = seasons.find((s) => s.number === listSeason) ?? seasons[0];
  const eps = current?.episodes ?? [];

  /* watched count for the current season */
  const watchedCount = useMemo(() => eps.filter((e) => e.watched).length, [eps]);

  /* first unwatched episode that is NOT the one currently playing */
  const continueEp = useMemo(() => {
    const first = eps.find((e) => !e.watched);
    // Ensure we don't suggest an episode that is actively playing
    const isCurrentlyPlaying = playingSeason === current.number && first?.episodeNumber === playingEpisode;
    return first && !isCurrentlyPlaying ? first : null;
  }, [eps, playingSeason, playingEpisode, current?.number]);

  const allWatched = eps.length > 0 && watchedCount === eps.length;

  return (
    <motion.section
      {...fade(0.16)}
      className="glass-panel rounded-2xl p-3 sm:p-5 lg:flex lg:h-full lg:flex-col lg:p-4"
    >
      <div className="space-y-4 sm:space-y-5 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:space-y-3">
        {/* header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 lg:mb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary lg:h-7 lg:w-7">
              <ListVideo size={16} className="lg:h-3.5 lg:w-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Episodes</h2>
              <p className="hidden text-[11px] text-muted-foreground sm:block">
                Select an episode to start watching
              </p>
            </div>
          </div>

          <label className="relative inline-block shrink-0">
            <span className="sr-only">Select season</span>
            <select
              value={current?.number ?? 1}
              onChange={(e) => onSeasonChange(Number(e.target.value))}
              className="appearance-none rounded-xl border border-white/10 bg-secondary/60 py-2 pl-3 pr-8 text-xs font-semibold text-foreground outline-none transition-colors hover:border-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
            >
              {seasons.map((s) => (
                <option key={s.number} value={s.number}>
                  Season {s.number}
                </option>
              ))}
            </select>
            {/* SVG hidden for brevity */}
             <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </label>
        </div>

        {/* continue watching banner code unchanged... */}

        {/* episode list */}
        <div
          className="scroll-hide h-[420px] overflow-y-auto lg:h-auto lg:flex-1 lg:min-h-0"
          style={{ scrollBehavior: "smooth" }}
        >
          <motion.ol layout className="flex flex-col gap-1.5 lg:gap-1">
            <AnimatePresence initial={false}>
              {eps.map((ep, i) => {
                // Strict check: Only active if BOTH season AND episode match
                const isActiveEpisode = playingSeason === current.number && ep.episodeNumber === playingEpisode;

                return (
                  <EpisodeCard
                    key={`${current.number}-${ep.episodeNumber}`}
                    ep={ep}
                    season={current.number}
                    active={isActiveEpisode}
                    index={i}
                    onPlay={onPlay}
                  />
                );
              })}
            </AnimatePresence>
          </motion.ol>
        </div>
      </div>
    </motion.section>
  );
}