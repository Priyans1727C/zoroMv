import { motion } from "framer-motion";
import { fade } from "./PlayerCards";

export function CommentsSection() {
  const placeholder = (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-dashed border-white/10 bg-white/[0.02]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </div>
      <span className="text-xs font-medium">Comments will appear here</span>
    </div>
  );

  return (
    <motion.div
      {...fade(0.18)}
      className="glass-panel rounded-2xl p-5"
    >
      {/*
        Outer flex row:
        - items-stretch so both columns share the same height
        - height is driven by the right column (artwork square + future flex-1)
      */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">

        {/* ============ LEFT COLUMN (78% desktop) ============
            flex-col + stretch → fills whatever height the right column sets  */}
        <div className="flex w-full flex-col gap-4 sm:w-[78%]">

          {/* ── Leave Your Comment ── */}
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <h3 className="mb-3 text-sm font-semibold tracking-tight">
              Leave Your Comment
            </h3>
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-dashed border-white/10 bg-white/[0.02]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-50"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Comment form placeholder</span>
            </div>
          </section>

          {/* ── Comments Feed — flex-1 so it absorbs all remaining height ── */}
          <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <h3 className="mb-3 text-sm font-semibold tracking-tight">
              Comments Feed
            </h3>
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1">{placeholder}</div>
              <div className="flex justify-center pt-4">
                <button className="rounded-full border border-primary/30 bg-primary/10 px-6 py-2 text-xs font-bold uppercase tracking-widest text-primary transition-all duration-200 hover:border-primary/60 hover:bg-primary/20 active:scale-[0.97]">
                  See More
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ============ RIGHT COLUMN (22% desktop, hidden < sm) ============
            flex-col with NO gap between children so we can control spacing manually.
            Total height = (artwork width, i.e. 22% of container) + future flex-1.
            The artwork section uses aspect-square + w-full + shrink-0.           */}
        <div className="hidden w-full flex-col sm:flex sm:w-[22%]">

          {/* ── Future Section — grows to fill space above the artwork ── */}
          <section className="flex flex-1 flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] p-4 mb-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Future Section
            </h3>
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="grid h-8 w-8 place-items-center rounded-full border border-dashed border-white/10 bg-white/[0.02]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-40"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <span className="text-[11px] font-medium">Coming Soon</span>
            </div>
          </section>

          {/*
            ── Character / Artwork ── 
            aspect-square + w-full → always a perfect 1:1 square whose side
            equals the column width (22% of the container).
            shrink-0 → never compressed vertically.
            The left column's "Comments Feed" grows/shrinks around this fixed size.
          */}
          <section className="relative w-full shrink-0 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]"
            style={{ aspectRatio: "1 / 1" }}
          >
            {/* inner content centred inside the square */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-muted-foreground">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Character / Artwork
              </h3>
              <div className="grid h-8 w-8 place-items-center rounded-full border border-dashed border-white/10 bg-white/[0.02]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-40"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <span className="text-[11px] font-medium">No artwork yet</span>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
}