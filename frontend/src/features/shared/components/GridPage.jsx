import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { PosterCard } from "./MediaCards";
import { GENRES } from "../constants/helper";

export default function GridPage({
  title,
  subtitle,
  items = [],
  page = 1,
  totalPages = 1,
  loading = false,
  onLoadMore,
  genreFilter,
  setGenreFilter,

}) {
  const hasMore = page < totalPages;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-panel relative overflow-hidden rounded-3xl p-7 sm:p-9"
      >
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />

        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          ZoroMv
        </p>

        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h2>

        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          {subtitle}
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto scroll-hide">
        <button className="glass-panel flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters
        </button>

        {Object.entries(GENRES).map(([id, name], i) => (
          <button
            key={id}
            onClick={() => setGenreFilter(Number(id))}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              genreFilter == id
                ? "bg-primary text-primary-foreground"
                : "glass-panel text-foreground/80 hover:text-primary"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <div className="grid w-full grid-cols-2 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-5">
        {items.map((item, i) => (
          <div key={`${item.id }-pg${i}`} className="w-full max-w-[220px]">
            <PosterCard item={item} index={i} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          No items found.
        </div>
      )}

      {/* Load More */}
      {items.length > 0 && (
        <div className="flex flex-col items-center gap-3 pb-4">
          {/* <AnimatePresence mode="wait"> */}
            {hasMore ? (
              <motion.button
                key="load-more"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                whileHover={{ scale: loading ? 1 : 1.04 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                onClick={onLoadMore}
                disabled={!hasMore}
                className="glass-panel flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground/90 transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            ) : (
              <motion.p
                key="end"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
              >
                <span className="h-px w-8 bg-border" />
                No more items to load
                <span className="h-px w-8 bg-border" />
              </motion.p>
            )}
          {/* </AnimatePresence> */}

          <p className="text-[11px] text-muted-foreground/60">
            Loaded {items.length} items • Page {page} of {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}