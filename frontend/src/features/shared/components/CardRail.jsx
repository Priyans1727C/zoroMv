import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import {ContinueCard,PosterCard,NumberedCard} from "./MediaCards";

const CARD_VARIANT_MAP = {
  continue: ContinueCard,
  poster: PosterCard,
  numbered: NumberedCard,
};

export default function CardRail({
  title,
  icon: Icon,
  items,
  cardVariant,
  seeAllHref = "#",
  delay = 0,
}) {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const CardComponent = CARD_VARIANT_MAP[cardVariant] || PosterCard;

  const checkScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [items, checkScroll]);

  const scroll = useCallback((dir) => {
    const el = railRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl lg:text-2xl">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 md:flex">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll(-1)}
              className={`grid h-8 w-8 place-items-center rounded-full border transition-all ${
                canScrollLeft
                  ? "border-white/15 bg-white/5 text-foreground hover:bg-white/10"
                  : "border-white/5 bg-transparent text-white/20 cursor-default"
              }`}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll(1)}
              className={`grid h-8 w-8 place-items-center rounded-full border transition-all ${
                canScrollRight
                  ? "border-white/15 bg-white/5 text-foreground hover:bg-white/10"
                  : "border-white/5 bg-transparent text-white/20 cursor-default"
              }`}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>

          <a
            href={seeAllHref}
            className="group/link hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary sm:flex"
          >
            See all
            <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
          </a>
        </div>
      </div>

      <div className="relative">
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent transition-opacity duration-300 sm:w-12 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent transition-opacity duration-300 sm:w-12 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={railRef}
          className="scroll-hide -mx-3 -mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-3 pt-4 pb-3 [-webkit-overflow-scrolling:touch] sm:-mx-2 sm:gap-5 sm:px-2 lg:snap-none"
          style={{ scrollPaddingLeft: "12px", scrollPaddingRight: "12px" }}
        >
          {items.map((item, i) => (
            <div key={item.id ?? i} className="snap-start">
              <CardComponent item={item} index={i} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
