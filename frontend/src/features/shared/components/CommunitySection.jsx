import { useState } from "react";
import { motion } from "framer-motion";
import { Clapperboard } from "lucide-react";
import { communityReviews } from "../../../mockData/allHomeData";
import Cute from "/assets/cute.png"

const TABS = [
  { key: "newest", label: "Newest" },
  { key: "top", label: "Top" },
];

// 1. Keep your ReviewCard exactly as is
export function ReviewCard({ review, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="snap-start flex h-[185px] w-[78%] shrink-0 flex-col justify-between rounded-2xl border border-white/[0.06] bg-surface/70 px-5 py-4 backdrop-blur-md transition-colors hover:border-primary/30 sm:w-[52%] sm:h-[185px] md:w-[36%] lg:w-[28%] xl:w-[23%]"
    >
      {/* Top: user info + quote */}
      <div>
        <div className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white shadow-md ring-1 ring-white/10"
            style={{
              background: `linear-gradient(135deg, ${review.avatarColor}, oklch(0.2 0.01 240))`,
            }}
          >
            {review.initials}
          </div>
          <div className="min-w-0 leading-5">
            <h4 className="truncate text-sm font-semibold text-foreground">{review.user}</h4>
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="text-[11px] font-bold uppercase text-primary">User</span>
              <span aria-hidden>·</span>
              <span>{review.time}</span>
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-xs italic leading-relaxed text-foreground/75">
          "{review.text}"
        </p>
      </div>

      {/* Bottom: linked show */}
      <button className="group/link mt-4 flex items-center gap-2 text-left text-xs text-primary transition-colors hover:text-primary/80">
        <Clapperboard className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate group-hover/link:underline">{review.show}</span>
      </button>
    </motion.article>
  );
}

// 2. Extracted Toggle Component for reusability
function HideToggle({ hideComments, setHideComments }) {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-2.5">
      <span className="text-xs font-medium text-foreground sm:text-sm">Hide</span>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={hideComments}
          onChange={(e) => setHideComments(e.target.checked)}
        />
        <div className="h-6 w-11 rounded-full bg-white/10 transition-colors after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-primary after:shadow-md after:transition-all after:content-[''] peer-checked:bg-primary/25 peer-checked:after:translate-x-5" />
      </label>
    </div>
  );
}

// 3. Main Section
export default function CommunitySection() {
  const [activeTab, setActiveTab] = useState("newest");
  const [hideComments, setHideComments] = useState(false);

  const sorted =
    activeTab === "top"
      ? [...communityReviews].sort((a, b) => b.liked - a.liked)
      : communityReviews;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      {hideComments ? (
        /* =========================================
           COLLAPSED STATE (Matches image_bf1a8a.png)
           ========================================= */
        <div className="flex w-full items-center justify-between rounded-3xl border border-white/[0.05] bg-gradient-to-br from-surface/70 via-surface-2/30 to-surface/70 px-6 py-5 backdrop-blur-md">
          <h2 className="text-lg font-bold sm:text-xl">Community Reviews</h2>
          <HideToggle hideComments={hideComments} setHideComments={setHideComments} />
        </div>
      ) : (
        /* =========================================
           EXPANDED STATE (Whole Community Code)
           ========================================= */
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.05] bg-gradient-to-br from-surface/70 via-surface-2/30 to-surface/70 backdrop-blur-md">
          <div className="relative flex min-h-0">
            
            {/* Left illustration - desktop only, bottom-anchored */}
            <div className="hidden w-[26%] shrink-0 justify-end lg:flex lg:flex-col">
              <img
                // src="https://animeit.net/images/comments-mascot.png"
                src={Cute}
                alt="Community Mascot"
                className="object-contain"
              />
            </div>

            {/* Right content */}
            <div className="flex w-full flex-col gap-5  px-4 pb-2 pt-5 sm:gap-6 sm:px-6 lg:w-[74%] lg:px-0 lg:pr-6 lg:pt-5">
              
              {/* Controls row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {TABS.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <HideToggle hideComments={hideComments} setHideComments={setHideComments} />
              </div>

              {/* Comments row */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-auto overflow-hidden"
              >
                <div className="scroll-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-4 pb-2 sm:-mx-6 sm:gap-4 sm:px-6 lg:mx-0 lg:px-0">
                  {sorted.map((review, i) => (
                    <ReviewCard key={review.id} review={review} index={i} />
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}