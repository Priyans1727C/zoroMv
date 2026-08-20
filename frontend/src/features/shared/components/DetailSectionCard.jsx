import { memo, useCallback, useState,useRef,useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  ChevronDown,
  Clock,
  Share2,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Star, Tv,
} from "lucide-react";
import { titleDetails } from "../../../mockData/cardDetail";

const EASE = [0.22, 1, 0.36, 1];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});


const CIRCLE_RADIUS = 42;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const TRAILER_BASE_URL = "https://www.youtube.com/embed/";

/* ─────────────────────────── Hero ─────────────────────────── */

export const HeroCard = memo(function HeroCard({ slide, onTrailerOpen }) {
  const { movieMeta } = slide;

  return (
    <>
      <div className="pointer-events-none absolute inset-0">
        <img
          src={slide.backdropUrl}
          alt={slide.title}
          className="select-none h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent sm:bg-gradient-to-r sm:from-background sm:via-background/70 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent sm:from-background/90 sm:via-transparent" />

      <div className="absolute inset-0 flex flex-col justify-between p-4 pb-7 sm:p-8 sm:pb-10 lg:p-10">
        <div className="inline-flex w-fit" />

        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-2 flex flex-wrap gap-1.5 sm:mb-3 sm:gap-2"
          >
            {slide.genres.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] backdrop-blur-md sm:px-3 sm:py-1 sm:text-xs"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            {slide.title}
          </motion.h2>

          <motion.div
            {...fade(0.5)}
            className="mt-1 flex max-w-md flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:mb-1 sm:text-sm"
          >
            {movieMeta.map((meta) => (
              <span key={meta.label} className="flex items-center gap-1.5">
                <meta.icon
                  className={`h-4 w-4 ${meta.primary ? "fill-primary text-primary" : ""}`}
                />
                {meta.label}
              </span>
            ))}

       
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-2 line-clamp-2 max-w-md text-xs leading-relaxed text-foreground/80 sm:mt-3  sm:text-sm  lg:text-base"
          >
            {slide.overview}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3"
          >
            <Link to={`/watch/${slide.type}/${slide.id}`}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-black shadow-lg shadow-white/10 sm:px-6 sm:py-3 sm:text-sm"
              >
                <Play className="h-4 w-4 fill-current" /> Watch Now
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onTrailerOpen}
              className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold sm:px-6 sm:py-3 sm:text-sm"
            >
              <Play className="h-4 w-4" /> Trailer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="glass-panel grid h-10 w-10 place-items-center rounded-full sm:h-11 sm:w-11"
              aria-label="Add to list"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="glass-panel hidden h-11 w-11 place-items-center rounded-full sm:grid"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
});

/* ─────────────────── Inline Trailer Player ─────────────────── */

const TrailerPlayer = memo(function TrailerPlayer({ title, videoKey, onClose }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 sm:py-4">
        <h2 className="truncate text-sm font-semibold text-foreground sm:text-lg">
          {title} — Official Trailer
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          aria-label="Close trailer"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </motion.button>
      </div>
      <div className="flex-1">
        <iframe
          src={TRAILER_BASE_URL+videoKey}
          title="Official Trailer"
          className="h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
});

/* ─────────────────── Hero Section (owner) ─────────────────── */

export function HeroSection({ slide ,trailer}) {
  const [trailerOpen, setTrailerOpen] = useState(false);

  const openTrailer = useCallback(() => setTrailerOpen(true), []);
  const closeTrailer = useCallback(() => setTrailerOpen(false), []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative h-[440px] overflow-hidden rounded-2xl border border-white/5 sm:h-[500px] sm:rounded-[2rem] lg:h-[560px]"
    >
      <AnimatePresence mode="wait">
        {trailerOpen ? (
          <motion.div
            key="trailer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <TrailerPlayer title={slide.title} videoKey={trailer.key} onClose={closeTrailer} />
          </motion.div>
        ) : (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <HeroCard slide={slide} onTrailerOpen={openTrailer} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ─────────────────────── Synopsis + Score ─────────────────────── */

export const DetailInfoSections = memo(function DetailInfoSections({ slide }) {
  // const { synopsis, stats, audienceScore, reviewCount, scoreBreakdown } = titleDetails;
  const { overview, stats, userScore, voteCount, scoreBreakdown } = slide;
  const scoreOffset = CIRCLE_CIRCUMFERENCE * (1 - userScore / 100);

  return (
    <section className="grid gap-5 sm:gap-6 lg:grid-cols-3">
      <motion.div {...fade(0.1)} className="glass-panel rounded-3xl p-6 sm:p-8 lg:col-span-2">
        <h2 className="mb-3 text-lg font-bold sm:text-xl">Synopsis</h2>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {overview}
        </p>
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-5 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.k}>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                {stat.k}
              </p>
              <p className="text-sm font-semibold">{stat.v}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...fade(0.2)} className="glass-panel flex flex-col gap-5 rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-bold sm:text-xl">Audience Score</h2>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r={CIRCLE_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-surface-2"
              />
              <motion.circle
                cx="50"
                cy="50"
                r={CIRCLE_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-primary"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCLE_CIRCUMFERENCE }}
                animate={{ strokeDashoffset: scoreOffset }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-xl font-bold">
              {userScore}%
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Based on reviews and ratings shared by TMDb users, reflecting the opinions and experiences of the community.

          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
          {scoreBreakdown.map((item) => (
            <div key={item.k}>
              <p className="mb-1 text-xs text-muted-foreground">{item.k}</p>
              <p className="text-lg font-bold text-primary">{item.v}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
});

/* ─────────────────────────── Episodes ─────────────────────────── */

const EpisodeRow = memo(function EpisodeRow({ episode, index }) {
  const watched = episode.progress === 100;
  const inProgress = episode.progress > 0 && episode.progress < 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: EASE }}
      className="group flex cursor-pointer gap-4 rounded-2xl border border-transparent p-3 transition-all hover:border-white/[0.06] hover:bg-white/[0.03] sm:items-center"
    >
      <span className="hidden w-8 shrink-0 text-center text-xl font-black text-muted-foreground/40 transition-colors group-hover:text-primary sm:block">
        {episode.ep}
      </span>

      <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl border border-white/[0.05] sm:w-44">
        <img
          src={episode.image}
          alt={episode.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Play className="h-4 w-4 fill-current" />
          </span>
        </div>
        {inProgress && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
            <div className="h-full bg-primary" style={{ width: `${episode.progress}%` }} />
          </div>
        )}
        {watched && (
          <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary/90 text-primary-foreground">
            <Check className="h-3 w-3" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate text-sm font-bold text-foreground sm:text-base">
            <span className="mr-2 text-muted-foreground sm:hidden">E{episode.ep}</span>
            {episode.title}
          </h4>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {episode.duration}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {episode.desc}
        </p>
      </div>
    </motion.div>
  );
});

export const EpisodesSection = memo(function EpisodesSection() {
  const [season, setSeason] = useState(1);
  const [open, setOpen] = useState(false);
  const { seasonsData } = titleDetails;

  const current = seasonsData.find((s) => s.season === season);
  if (!current) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="glass-panel rounded-3xl p-5 sm:p-7"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold sm:text-xl">Episodes</h2>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold backdrop-blur-md transition-colors hover:border-primary/30"
          >
            Season {season}
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="glass-panel absolute right-0 top-12 z-20 w-40 overflow-hidden rounded-2xl p-1.5"
              >
                {seasonsData.map((s) => (
                  <button
                    key={s.season}
                    onClick={() => {
                      setSeason(s.season);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${s.season === season ? "bg-primary/15 text-primary" : "hover:bg-white/5"
                      }`}
                  >
                    Season {s.season}
                    <span className="text-[10px] text-muted-foreground">
                      {s.episodes.length} eps
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={season}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-1"
        >
          {current.episodes.map((ep, i) => (
            <EpisodeRow key={ep.id} episode={ep} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
});

/* ─────────────────────────── Cast ─────────────────────────── */

export const CastSection = memo(function CastSection({ casts }) {
  const { cast } = titleDetails;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="px-5 sm:px-7"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold sm:text-xl">Top Cast</h2>

        <div className="hidden items-center gap-1.5 md:flex">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous cast"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/5 text-foreground transition-all hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next cast"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/5 text-foreground transition-all hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <div className="scroll-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 lg:grid lg:grid-cols-6 lg:gap-5 lg:overflow-visible">
        {casts.map((member, i) => (
          <motion.div
            key={`${member.name}-${i}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
            whileHover={{ y: -6 }}
            className="group flex w-[112px] shrink-0 cursor-pointer snap-start flex-col items-center sm:w-[132px] lg:w-auto"
          >
            <div className="relative z-10 aspect-square w-[72%] overflow-hidden rounded-full ring-2 ring-white/10 transition-all duration-300 group-hover:ring-primary/50">
              <motion.img
                src={member.profileImageUrl}
                alt={member.name}
                loading="lazy"
                width={512}
                height={512}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6 }}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="glass-panel -mt-3 flex w-full flex-col items-center justify-end rounded-t-[1.75rem] rounded-b-xl px-2 pb-2.5 pt-5 text-center sm:pb-3 sm:pt-6">
              <p className="w-full truncate text-[11px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-xs">
                {member.name}
              </p>
              <p className="w-full truncate text-[10px] text-muted-foreground">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
});





// Cast testing
export const CastSectionTest = memo(function CastSectionTest({ casts }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 2);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [casts]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.section {...fade(0.1)} className="glass-panel rounded-3xl p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold sm:text-xl">Top Cast</h2>
        
        {/* CHANGED HERE: Removed 'hidden' and 'md:flex', replaced with 'flex' */}
        <div className="flex items-center gap-1.5">
          <AnimatePresence mode="popLayout">
            {canScrollLeft && (
              <motion.button
                key="left-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scroll('left')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous cast"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/5 text-foreground transition-all hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
            )}

            {canScrollRight && (
              <motion.button
                key="right-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scroll('right')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next cast"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/5 text-foreground transition-all hover:bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

     <div 
  ref={scrollRef} 
  onScroll={checkScrollability} 
  className="scroll-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 pt-3 -mt-3 lg:gap-5"
>
  {casts.map((member, i) => (
    <motion.div
      key={`${member.name}-${i}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
      whileHover={{ y: -6 }}
      className="group flex w-[112px] shrink-0 cursor-pointer snap-start flex-col items-center sm:w-[132px]"
    >
      <div className="relative z-10 aspect-square w-[72%] overflow-hidden rounded-full ring-2 ring-white/10 transition-all duration-300 group-hover:ring-primary/50">
        <img
          src={member.profileImageUrl}
          alt={member.name}
          loading="lazy"
          className="h-32 w-32 object-cover"
        />
      </div>

      <div className="glass-panel -mt-3 flex w-full flex-col items-center justify-end rounded-t-[1.75rem] rounded-b-xl px-2 pb-2.5 pt-5 text-center sm:pb-3 sm:pt-6">
        <p className="w-full truncate text-[11px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-xs">
          {member.name}
        </p>
        <p className="w-full truncate text-[10px] text-muted-foreground">{member.role}</p>
      </div>
    </motion.div>
  ))}
</div>
    </motion.section>
  );
});