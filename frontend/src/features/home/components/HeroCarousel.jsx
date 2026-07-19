import { useCallback, useEffect, useState,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Play, Flame, Info, MoreHorizontal } from "lucide-react";

const AUTO_ADVANCE_MS = 6000;
const DRAG_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 600;

export default function HeroCarousel({slides}) {
  const [[index, direction], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const paginate = useCallback(
    (dir) => {
      setState(([i]) => [(i + dir + count) % count, dir]);
    },
    [count]
  );

  const goTo = useCallback((i) => {
    setState(([cur]) => [i, i > cur ? 1 : -1]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => paginate(1), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, paginate]);

  const slide = slides[index];
  const slug = slide.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[440px] overflow-hidden rounded-2xl border border-white/5 sm:h-[500px] sm:rounded-[2rem] lg:h-[560px]"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          drag="x"
          dragElastic={0.18}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            const threshold = 60;
            if (info.offset.x < -threshold || info.velocity.x < -400) paginate(1);
            else if (info.offset.x > threshold || info.velocity.x > 400) paginate(-1);
          }}
          initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0.4 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
        >
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 4, ease: "linear" }}
            className="pointer-events-none absolute inset-0"
          >
            <LazyImage
              src={slide.backdropUrl}
              alt={slide.title}
              eager={index === 0}
              draggable={false}
              imgClassName="select-none object-cover object-center"
            />
          </motion.div>

          {/* Gradients — stronger on mobile (bottom) for legibility, side gradient on larger screens */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent sm:bg-gradient-to-r sm:from-background sm:via-background/70 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent sm:from-background/90 sm:via-transparent" />

          <div className="absolute inset-0 flex flex-col justify-between p-4 pb-10 sm:p-8 sm:pb-10 lg:p-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md sm:px-4 sm:text-xs"
            >
              <Flame className="h-3.5 w-3.5 text-primary" />
              {slide.type}
            </motion.div>

            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-2 flex flex-wrap gap-1.5 sm:mb-3 sm:gap-2"
              >
                {slide.genres.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] backdrop-blur-md sm:px-3 sm:py-1 sm:text-xs">
                    {t}
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
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="mt-2 line-clamp-2 max-w-md text-xs leading-relaxed text-foreground/80 sm:mt-3 sm:line-clamp-3 sm:text-sm lg:line-clamp-4 lg:text-base"
              >
                {slide.overview}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3"
              >
                <Link to={`/watch/${slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black shadow-lg shadow-white/10 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Watch Now
                  </motion.button>
                </Link>
                <Link to={`/movies/${slide.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium backdrop-blur-md sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">More Info</span>
                    <span className="sm:hidden">Info</span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  aria-label="More options"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur-md"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots + progress */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-5 sm:left-auto sm:right-6 sm:translate-x-0 sm:gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className="group relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all sm:h-2"
            style={{ width: i === index ? 28 : 8 }}
          >
            {i === index && !paused && (
              <motion.span
                key={index}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="absolute inset-y-0 left-0 bg-primary"
              />
            )}
            {i === index && paused && <span className="absolute inset-0 bg-primary" />}
          </button>
        ))}
      </div>
    </motion.section>
  );
}


export  function LazyImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  eager = false,
  draggable,
  onLoaded,
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (eager || inView) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [eager, inView]);

  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 overflow-hidden bg-surface-2/40">
          <div className="shimmer absolute inset-0" />
        </div>
      )}
      {inView && (
        <motion.img
          src={src}
          alt={alt}
          draggable={draggable}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => {
            setLoaded(true);
            onLoaded?.();
          }}
          initial={{ opacity: 0, scale: 7 }}
          animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.04 }}
          transition={{ duration: 1, }}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}


