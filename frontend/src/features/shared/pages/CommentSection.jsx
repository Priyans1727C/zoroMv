import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const EASE = [0.22, 1, 0.36, 1];

export const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

/* ─── 10 seed comments ───────────────────────────────────────────── */
const SEED = [
  {
    id: 1,
    name: "Marcus R.",
    time: "2 days ago",
    text: "The time-travel logic was genuinely clever — the way they avoided the typical butterfly-effect cliché and made their own rules felt respectful to the audience's intelligence.",
    likes: 84,
    liked: false,
  },
  {
    id: 2,
    name: "Sofia L.",
    time: "3 days ago",
    text: "Tony's sacrifice hits different every rewatch. The \"I am Iron Man\" callback to the very first film is perfect screenwriting. Russo brothers knew exactly what they were doing.",
    likes: 61,
    liked: false,
  },
  {
    id: 3,
    name: "James K.",
    time: "5 days ago",
    text: "Seeing Cap finally wield Mjolnir after the tease in Age of Ultron was the biggest crowd reaction I have ever witnessed in a cinema. The whole theatre erupted.",
    likes: 113,
    liked: false,
  },
  {
    id: 4,
    name: "Priya M.",
    time: "6 days ago",
    text: "The score during the portals scene is absolutely haunting. Alan Silvestri deserved every award. When the Avengers theme swells as everyone assembles — chills every single time.",
    likes: 97,
    liked: false,
  },
  {
    id: 5,
    name: "Daniel W.",
    time: "1 week ago",
    text: "Nebula's arc across both Infinity War and Endgame might be the most underrated character journey in the entire MCU. Karen Gillan absolutely nailed it.",
    likes: 52,
    liked: false,
  },
  {
    id: 6,
    name: "Yuki T.",
    time: "1 week ago",
    text: "The Ancient One and Banner scene in New York explained the time stone mechanics so cleanly. Tilda Swinton in that brief cameo carried more gravitas than most leads.",
    likes: 44,
    liked: false,
  },
  {
    id: 7,
    name: "Rafael O.",
    time: "2 weeks ago",
    text: "\"Whatever it takes\" hits like a truck because by the end of the film every single character who said it paid a real price. That is what cohesive storytelling over 11 years looks like.",
    likes: 130,
    liked: false,
  },
  {
    id: 8,
    name: "Amara N.",
    time: "2 weeks ago",
    text: "The final Cap moment with the shield passing to Sam is so quietly earned. No fanfare, no explosion — just two people who trust each other completely. Beautiful ending.",
    likes: 78,
    liked: false,
  },
  {
    id: 9,
    name: "Chris B.",
    time: "3 weeks ago",
    text: "Thanos destroying his own timeline's past self before the final battle was such a bold move. It robbed the heroes of any undo button and made every fight feel real.",
    likes: 66,
    liked: false,
  },
  {
    id: 10,
    name: "Elena V.",
    time: "1 month ago",
    text: "Watched it opening night and again yesterday. It holds up completely. The pacing of the first act — quiet, broken heroes, five years later — is braver than any action sequence.",
    likes: 89,
    liked: false,
  },
];

/* ─── helpers ────────────────────────────────────────────────────── */
function getInitials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const COLORS = [
  "from-primary/60 to-primary/30",
  "from-violet-500/60 to-violet-500/30",
  "from-amber-500/60 to-amber-500/30",
  "from-rose-500/60 to-rose-500/30",
  "from-sky-500/60 to-sky-500/30",
];
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ name }) {
  return (
    <div
      className={`h-9 w-9 shrink-0 grid place-items-center rounded-full bg-gradient-to-br ${avatarColor(name)} text-xs font-bold text-white ring-1 ring-white/10`}
    >
      {getInitials(name)}
    </div>
  );
}

/* ─── CommentCard ─────────────────────────────────────────────────── */
function CommentCard({ comment, onLike, isNew }) {
  return (
    <motion.article
      layout
      initial={isNew ? { opacity: 0, y: -10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="flex gap-3 py-4 border-b border-white/[0.04] last:border-0"
    >
      <Avatar name={comment.name} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1.5">
          <span className="text-xs font-bold">{comment.name}</span>
          <span className="text-[10px] text-muted-foreground/50">{comment.time}</span>
        </div>
        <p className="text-[13px] leading-relaxed text-foreground/80">{comment.text}</p>
        <div className="mt-2.5 flex items-center gap-4">
          <button
            onClick={() => onLike(comment.id)}
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
              comment.liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24"
              fill={comment.liked ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
            </svg>
            {comment.likes}
          </button>
          <button className="text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground">
            Reply
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── main export ────────────────────────────────────────────────── */
export function CommentsSection() {
  const [comments, setComments] = useState(SEED);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newIds, setNewIds] = useState(new Set());
  const textareaRef = useRef(null);
  const feedRef = useRef(null);

  /* auto-resize textarea */
  function handleTextChange(e) {
    setText(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }

  /* submit → prepend + scroll feed to top */
  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setTimeout(() => {
      const id = Date.now();
      const newComment = {
        id,
        name: name.trim() || "Anonymous",
        time: "Just now",
        text: trimmed,
        likes: 0,
        liked: false,
      };
      setComments((prev) => [newComment, ...prev]);
      setNewIds((prev) => new Set(prev).add(id));
      setText("");
      setName("");
      setFocused(false);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setSubmitting(false);
      /* scroll feed to top so new comment is visible */
      setTimeout(() => {
        if (feedRef.current) feedRef.current.scrollTop = 0;
      }, 50);
    }, 450);
  }

  /* like toggle */
  function handleLike(id) {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  }

  const canSubmit = text.trim().length > 0;

  return (
    <motion.div
      {...fade(0.18)}
      className="glass-panel rounded-2xl p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">

        {/* ══════════════ LEFT — unified comment panel ══════════════ */}
        <div className="flex w-full flex-col sm:w-[78%]">
          <div className="flex flex-col rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">

            {/* ── A: Leave Your Comment ── */}
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold tracking-tight">Leave Your Comment</h3>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* name — slides in on focus */}
                <AnimatePresence>
                  {(focused || name) && (
                    <motion.input
                      key="name-input"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      maxLength={40}
                      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/15 transition-colors"
                    />
                  )}
                </AnimatePresence>

                {/* textarea */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    rows={3}
                    value={text}
                    onChange={handleTextChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => { if (!text) setFocused(false); }}
                    placeholder="Share your thoughts about this movie…"
                    className="w-full resize-none overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/15 transition-colors"
                  />
                  {text.length > 200 && (
                    <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/40">
                      {text.length}
                    </span>
                  )}
                </div>

                {/* actions row — slides in on focus */}
                <AnimatePresence>
                  {(focused || text) && (
                    <motion.div
                      key="action-row"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-[11px] text-muted-foreground/50 leading-tight">
                        Be respectful · No spoilers in first lines
                      </span>
                      <button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 12a9 9 0 11-6.219-8.56" />
                            </svg>
                            Posting…
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                            Post
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* ── divider with inline label ── */}
            <div className="flex items-center gap-3 px-4 sm:px-5">
              <div className="h-px flex-1 bg-white/5" />
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="grid h-6 w-6 place-items-center rounded-md bg-primary/10 text-primary">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Comments Feed
                  {comments.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                      {comments.length}
                    </span>
                  )}
                </span>
              </div>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            {/* ── B: Comments Feed — fixed-height scrollable area ── */}
            <div className="flex flex-col">

              {/* meta row */}
              {comments.length > 0 && (
                <div className="flex items-center justify-between px-4 pt-3 pb-1 sm:px-5">
                  <span className="text-[11px] text-muted-foreground/50">
                    {comments.length} comment{comments.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground/50">
                    Newest first
                  </span>
                </div>
              )}

              {/* scrollable feed — fixed height, custom slim scrollbar */}
              <div
                ref={feedRef}
                className="scroll-hide h-[420px] overflow-y-auto px-4 sm:px-5"
                style={{ scrollBehavior: "smooth" }}
              >
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 h-full text-muted-foreground">
                    <div className="grid h-12 w-12 place-items-center rounded-full border border-dashed border-white/10 bg-white/[0.02]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium">No comments yet</span>
                    <span className="text-[11px] text-muted-foreground/50">Be the first to share your thoughts</span>
                  </div>
                ) : (
                  <motion.div layout className="flex flex-col">
                    <AnimatePresence initial={false}>
                      {comments.map((c) => (
                        <CommentCard
                          key={c.id}
                          comment={c}
                          onLike={handleLike}
                          isNew={newIds.has(c.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>

              {/* bottom fade-out gradient to hint at scrollable content */}
              <div className="pointer-events-none h-6 -mt-6 rounded-b-xl bg-gradient-to-t from-[oklch(0.22_0.006_240/0.9)] to-transparent" />
            </div>

          </div>
        </div>

        {/* ══════════════ RIGHT COLUMN (unchanged) ══════════════ */}
        <div className="hidden w-full flex-col sm:flex sm:w-[22%]">

          {/* Future Section */}
          <section className="flex flex-1 flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] p-4 mb-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Future Section
            </h3>
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="grid h-8 w-8 place-items-center rounded-full border border-dashed border-white/10 bg-white/[0.02]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <span className="text-[11px] font-medium">Coming Soon</span>
            </div>
          </section>

          {/* Character / Artwork — strict 1:1 square, shrink-0, image overlay */}
          <section
            className="relative w-full shrink-0"
            style={{ aspectRatio: "1 / 1" }}
          >
            <img
              src="https://plain-eeur-prod-public.komododecks.com/202607/22/VHE3woxN7LfFXoXHSLSb/image.png"
              alt="Character Artwork"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </section>

        </div>
      </div>
    </motion.div>
  );
}
