import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fade, EASE } from "./PlayerSections";

/* ─────────────────────────────────────────────────────────────────
   Seed data — 10 comments, several with threaded replies so the
   reply / view-more / hide-replies behaviour is visible on load.
   ───────────────────────────────────────────────────────────────── */
const SEED = [
  {
    id: 1,
    name: "Marcus R.",
    time: "2 days ago",
    text: "The time-travel logic was genuinely clever — the way they avoided the typical butterfly-effect cliché and made their own rules felt respectful to the audience's intelligence.",
    likes: 84,
    liked: false,
    replies: [
      {
        id: 1001,
        name: "Hana S.",
        time: "1 day ago",
        text: "Agreed. The \"you can't change your own past\" rule was such a clean way to dodge paradoxes.",
        likes: 22,
        liked: false,
      },
    ],
  },
  {
    id: 2,
    name: "Sofia L.",
    time: "3 days ago",
    text: "Tony's sacrifice hits different every rewatch. The \"I am Iron Man\" callback to the very first film is perfect screenwriting. Russo brothers knew exactly what they were doing.",
    likes: 61,
    liked: false,
    replies: [],
  },
  {
    id: 3,
    name: "James K.",
    time: "5 days ago",
    text: "Seeing Cap finally wield Mjolnir after the tease in Age of Ultron was the biggest crowd reaction I have ever witnessed in a cinema. The whole theatre erupted.",
    likes: 113,
    liked: false,
    replies: [
      {
        id: 3001,
        name: "Olivia P.",
        time: "4 days ago",
        text: "I was in an IMAX screening and the popcorn literally went airborne when he lifted it.",
        likes: 41,
        liked: false,
      },
      {
        id: 3002,
        name: "Dev R.",
        time: "4 days ago",
        text: "The lightning call from the hammer to the broken shield — chef's kiss.",
        likes: 33,
        liked: false,
      },
      {
        id: 3003,
        name: "Marcus R.",
        time: "3 days ago",
        text: "Worth noting the payoff was set up four years earlier. That's patience most studios don't have.",
        likes: 57,
        liked: false,
      },
      {
        id: 3004,
        name: "Yuki T.",
        time: "2 days ago",
        text: "Thor's \"I knew it!\" line in the middle of the chaos still makes me laugh out loud.",
        likes: 28,
        liked: false,
      },
    ],
  },
  {
    id: 4,
    name: "Priya M.",
    time: "6 days ago",
    text: "The score during the portals scene is absolutely haunting. Alan Silvestri deserved every award. When the Avengers theme swells as everyone assembles — chills every single time.",
    likes: 97,
    liked: false,
    replies: [],
  },
  {
    id: 5,
    name: "Daniel W.",
    time: "1 week ago",
    text: "Nebula's arc across both Infinity War and Endgame might be the most underrated character journey in the entire MCU. Karen Gillan absolutely nailed it.",
    likes: 52,
    liked: false,
    replies: [
      {
        id: 5001,
        name: "Amara N.",
        time: "6 days ago",
        text: "Her scene with Gamora-from-the-past had me in pieces. So much unspoken grief.",
        likes: 19,
        liked: false,
      },
    ],
  },
  {
    id: 6,
    name: "Yuki T.",
    time: "1 week ago",
    text: "The Ancient One and Banner scene in New York explained the time stone mechanics so cleanly. Tilda Swinton in that brief cameo carried more gravitas than most leads.",
    likes: 44,
    liked: false,
    replies: [],
  },
  {
    id: 7,
    name: "Rafael O.",
    time: "2 weeks ago",
    text: "\"Whatever it takes\" hits like a truck because by the end of the film every single character who said it paid a real price. That is what cohesive storytelling over 11 years looks like.",
    likes: 130,
    liked: false,
    replies: [
      {
        id: 7001,
        name: "Elena V.",
        time: "12 days ago",
        text: "The price is what makes the line land. Empty heroics would have made it a slogan.",
        likes: 24,
        liked: false,
      },
      {
        id: 7002,
        name: "Chris B.",
        time: "10 days ago",
        text: "Nat and Tony both paying it, in completely different ways, is what wrecks me.",
        likes: 38,
        liked: false,
      },
      {
        id: 7003,
        name: "Sofia L.",
        time: "9 days ago",
        text: "And the film doesn't flinch from showing the cost. No easy reset button.",
        likes: 15,
        liked: false,
      },
    ],
  },
  {
    id: 8,
    name: "Amara N.",
    time: "2 weeks ago",
    text: "The final Cap moment with the shield passing to Sam is so quietly earned. No fanfare, no explosion — just two people who trust each other completely. Beautiful ending.",
    likes: 78,
    liked: false,
    replies: [],
  },
  {
    id: 9,
    name: "Chris B.",
    time: "3 weeks ago",
    text: "Thanos destroying his own timeline's past self before the final battle was such a bold move. It robbed the heroes of any undo button and made every fight feel real.",
    likes: 66,
    liked: false,
    replies: [],
  },
  {
    id: 10,
    name: "Elena V.",
    time: "1 month ago",
    text: "Watched it opening night and again yesterday. It holds up completely. The pacing of the first act — quiet, broken heroes, five years later — is braver than any action sequence.",
    likes: 89,
    liked: false,
    replies: [
      {
        id: 10001,
        name: "Rafael O.",
        time: "28 days ago",
        text: "The support group scene with Steve is such a quiet masterclass. No score, no cuts to action.",
        likes: 31,
        liked: false,
      },
      {
        id: 10002,
        name: "Daniel W.",
        time: "26 days ago",
        text: "That first act dared to be slow in a 3-hour blockbuster. Huge respect.",
        likes: 27,
        liked: false,
      },
    ],
  },
];

/* default number of replies visible before "View more" kicks in */
const REPLY_PREVIEW = 2;

/* ─── helpers ────────────────────────────────────────────────────── */
function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

/* ─── small inline icons (kept inline to match the rest of file) ── */
const IconThumb = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
    <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
  </svg>
);
const IconChevron = ({ open }) => (
  <motion.svg
    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
    strokeLinecap="round" strokeLinejoin="round"
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.25, ease: EASE }}
  >
    <polyline points="6 9 12 15 18 9" />
  </motion.svg>
);
const IconSend = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ name, size = "md" }) {
  const sz = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";
  return (
    <div className={`${sz} shrink-0 grid place-items-center rounded-full bg-gradient-to-br ${avatarColor(name)} font-bold text-white ring-1 ring-white/10`}>
      {getInitials(name)}
    </div>
  );
}

/* ─── Like button (shared) ───────────────────────────────────────── */
function LikeButton({ liked, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
        liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <IconThumb filled={liked} />
      {count}
    </button>
  );
}

/* ─── Reply row (one level deep) ─────────────────────────────────── */
function ReplyRow({ reply, isNew, onLike, onReply }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundColor: isNew
          ? ["oklch(0.78 0.15 175 / 0.14)", "oklch(0.78 0.15 175 / 0)"]
          : "oklch(0 0 0 / 0)",
      }}
      transition={{ duration: 0.35, ease: EASE, backgroundColor: { duration: 1.4 } }}
      className="flex gap-2.5 py-2.5"
    >
      <Avatar name={reply.name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
          <span className="text-[11px] font-bold">{reply.name}</span>
          <span className="text-[10px] text-muted-foreground/50">{reply.time}</span>
        </div>
        <p className="text-xs leading-relaxed text-foreground/80 break-words [overflow-wrap:anywhere] sm:text-[13px]">{reply.text}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <LikeButton liked={reply.liked} count={reply.likes} onClick={() => onLike(reply.id)} />
          <button
            onClick={() => onReply(reply.name)}
            className="text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Reply
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Inline reply composer ──────────────────────────────────────── */
function ReplyComposer({ target, currentUser, onSubmit, onCancel }) {
  const [text, setText] = useState(target ? `@${target} ` : "");
  const [submitting, setSubmitting] = useState(false);
  const taRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.focus();
      /* place caret at end */
      const len = taRef.current.value.length;
      taRef.current.setSelectionRange(len, len);
    }
    if (wrapRef.current) {
      wrapRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  function resize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }

  function submit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || trimmed === `@${target}`) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(trimmed);
      setSubmitting(false);
    }, 320);
  }

  return (
    <motion.form
      ref={wrapRef}
      onSubmit={submit}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="flex gap-2.5">
        <Avatar name={currentUser || "You"} size="sm" />
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {target && (
            <span className="text-[10px] font-medium text-muted-foreground/60">
              Replying to <span className="text-primary/80">@{target}</span>
            </span>
          )}
          <textarea
            ref={taRef}
            rows={2}
            value={text}
            onChange={(e) => { setText(e.target.value); resize(); }}
            placeholder={target ? `Reply to ${target}…` : "Write a reply…"}
            className="w-full resize-none overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/15 transition-colors sm:text-[13px]"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-3 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !text.trim() || text.trim() === `@${target}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-1 text-[11px] font-bold text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
              ) : (
                <IconSend />
              )}
              Reply
            </button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}

/* ─── Comment card (parent + thread) ─────────────────────────────── */
function CommentCard({
  comment,
  isNew,
  currentUser,
  onLikeComment,
  onLikeReply,
  onAddReply,
}) {
  /* threadOpen  = outer disclosure: are the replies rendered at all?
     innerExpanded = progressive disclosure *within* an open thread, for
     threads longer than REPLY_PREVIEW (the "show N more" pill).        */
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null); // name or null
  const [threadOpen, setThreadOpen] = useState(false);
  const [innerExpanded, setInnerExpanded] = useState(false);

  const replies = comment.replies || [];
  const hasMore = replies.length > REPLY_PREVIEW;
  const visibleReplies = innerExpanded || !hasMore ? replies : replies.slice(0, REPLY_PREVIEW);
  const hiddenCount = replies.length - visibleReplies.length;

  function openReplyTo(target) {
    setReplyTarget(target);
    setReplyOpen(true);
    /* when replying to a specific reply, make sure that reply is visible:
       open the thread and, if needed, expand the inner preview too.    */
    if (target) {
      setThreadOpen(true);
      if (hasMore) setInnerExpanded(true);
    }
  }

  function closeReply() {
    setReplyOpen(false);
    setReplyTarget(null);
  }

  function submitReply(text) {
    onAddReply(comment.id, text);
    closeReply();
    /* after posting, reveal the thread and expand the inner preview so
       the just-posted reply (appended at the end) is always visible.   */
    setThreadOpen(true);
    setInnerExpanded(true);
  }

  function toggleThread() {
    setThreadOpen((open) => {
      const next = !open;
      /* collapsing the thread also dismisses any open composer that was
         targeting a reply inside it, so we never dangle a reply box
         pointing at a hidden row.                                      */
      if (!next) {
        setReplyOpen(false);
        setReplyTarget(null);
      }
      return next;
    });
  }

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
        {/* header */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1.5">
          <span className="text-xs font-bold">{comment.name}</span>
          <span className="text-[10px] text-muted-foreground/50">{comment.time}</span>
        </div>

        {/* body */}
        <p className="text-[13px] leading-relaxed text-foreground/80 break-words [overflow-wrap:anywhere]">{comment.text}</p>

        {/* actions */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <LikeButton liked={comment.liked} count={comment.likes} onClick={() => onLikeComment(comment.id)} />
          <button
            onClick={() => (replyOpen && !replyTarget ? closeReply() : openReplyTo(null))}
            className={`text-[11px] font-semibold transition-colors ${
              replyOpen && !replyTarget ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Reply
          </button>

          {/* outer thread disclosure — only when the comment has replies.
              Sits *after* Reply, per spec. Tapping it slides the thread
              open or shut; the chevron and count badge animate so the
              control always tells you what will happen next.             */}
          {replies.length > 0 && (
            <motion.button
              type="button"
              onClick={toggleThread}
              aria-expanded={threadOpen}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={`group/thread inline-flex items-center gap-1.5 rounded-full border py-1 pl-1.5 pr-3 text-[11px] font-semibold transition-all duration-200 ${
                threadOpen
                  ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_0_1px_oklch(0.78_0.15_175_/_0.15)]"
                  : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full transition-colors ${
                  threadOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                }`}
              >
                <IconChevron open={threadOpen} />
              </span>
              <span className="tracking-tight">
                {threadOpen ? "Hide replies" : "View replies"}
              </span>
              {!threadOpen && (
                <motion.span
                  key="count"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="grid h-4 min-w-4 place-items-center rounded-full bg-primary/15 px-1 text-[10px] font-bold tabular-nums text-primary"
                >
                  {replies.length}
                </motion.span>
              )}
            </motion.button>
          )}
        </div>

        {/* inline composer — sits between parent actions and thread */}
        <AnimatePresence initial={false}>
          {replyOpen && (
            <div key="composer" className="mt-3">
              <ReplyComposer
                target={replyTarget}
                currentUser={currentUser}
                onSubmit={submitReply}
                onCancel={closeReply}
              />
            </div>
          )}
        </AnimatePresence>

        {/* threaded replies — collapsed by default; slides open when the
            outer "View replies" pill is tapped. The height animation runs
            on an overflow-hidden wrapper so the gradient thread line and
            the rows grow/shrink together without layout pop.             */}
        <AnimatePresence initial={false}>
          {threadOpen && replies.length > 0 && (
            <motion.div
              key="thread"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="relative mt-3 ml-[14px] pl-4 sm:ml-[17px] sm:pl-5">
                {/* thread line — gradient, fades at the bottom */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-primary/35 via-primary/15 to-transparent"
                />

                <motion.div layout className="flex flex-col">
                  <AnimatePresence initial={false}>
                    {visibleReplies.map((r) => (
                      <ReplyRow
                        key={r.id}
                        reply={r}
                        isNew={false}
                        onLike={(rid) => onLikeReply(comment.id, rid)}
                        onReply={(name) => openReplyTo(name)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* inner progressive disclosure — only for threads longer
                    than the preview window, and only while the thread is
                    already open. Different verb ("show more / fewer")
                    keeps it from being confused with the outer toggle.  */}
                {hasMore && (
                  <button
                    onClick={() => setInnerExpanded((v) => !v)}
                    className="group mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] py-1 pl-2.5 pr-3 text-[11px] font-semibold text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-primary/10 text-primary">
                      <IconChevron open={innerExpanded} />
                    </span>
                    {innerExpanded ? "Show fewer" : `Show ${hiddenCount} more`}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

/* ─── main export ────────────────────────────────────────────────── */
export function CommentsSection({ seed } = {}) {
  const [comments, setComments] = useState(seed ?? SEED);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newCommentIds, setNewCommentIds] = useState(new Set());
  const textareaRef = useRef(null);
  const feedRef = useRef(null);

  function handleTextChange(e) {
    setText(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setTimeout(() => {
      const id = Date.now();
      setComments((prev) => [
        {
          id,
          name: name.trim() || "Anonymous",
          time: "Just now",
          text: trimmed,
          likes: 0,
          liked: false,
          replies: [],
        },
        ...prev,
      ]);
      setNewCommentIds((prev) => new Set(prev).add(id));
      setText("");
      setName("");
      setFocused(false);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setSubmitting(false);
      setTimeout(() => { if (feedRef.current) feedRef.current.scrollTop = 0; }, 50);
    }, 450);
  }

  function handleLikeComment(id) {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c
      )
    );
  }

  function handleLikeReply(commentId, replyId) {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: (c.replies || []).map((r) =>
                r.id === replyId
                  ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
                  : r
              ),
            }
          : c
      )
    );
  }

  function handleAddReply(commentId, replyText) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...(c.replies || []),
                {
                  id,
                  name: name.trim() || "You",
                  time: "Just now",
                  text: replyText,
                  likes: 0,
                  liked: false,
                },
              ],
            }
          : c
      )
    );
  }

  const canSubmit = text.trim().length > 0;

  return (
    <motion.div {...fade(0.18)} className="glass-panel rounded-2xl p-3 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">

        {/* ════════════ LEFT — unified comment panel (transparent, no card) ════════════ */}
        <div className="flex w-full flex-col sm:w-[78%]">
          <div className="flex flex-col bg-transparent">

            {/* ── A: Leave Your Comment ── */}
            <div className="pb-4 sm:pb-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold tracking-tight">Leave Your Comment</h3>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                    <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/40">{text.length}</span>
                  )}
                </div>

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
                            <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                            Posting…
                          </>
                        ) : (
                          <><IconSend />Post</>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* ── divider with inline label ── */}
            <div className="flex items-center gap-3">
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

            {/* ── B: Comments Feed — fixed-height scrollable ── */}
            <div className="flex flex-col">
              {comments.length > 0 && (
                <div className="flex items-center justify-between pt-3 pb-1">
                  <span className="text-[11px] text-muted-foreground/50">
                    {comments.length} comment{comments.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground/50">Newest first</span>
                </div>
              )}

              <div
                ref={feedRef}
                className="scroll-hide h-[420px] overflow-y-auto"
                style={{ scrollBehavior: "smooth" }}
              >
                {comments.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
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
                          isNew={newCommentIds.has(c.id)}
                          currentUser={name}
                          onLikeComment={handleLikeComment}
                          onLikeReply={handleLikeReply}
                          onAddReply={handleAddReply}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>

              <div className="pointer-events-none -mt-6 h-6 rounded-b-xl bg-gradient-to-t from-[oklch(0.22_0.006_240/0.9)] to-transparent" />
            </div>
          </div>
        </div>

        {/* ════════════ RIGHT COLUMN (unchanged) ════════════ */}
        <div className="hidden w-full flex-col sm:flex sm:w-[22%]">
          <section className="mb-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Future Section</h3>
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="grid h-8 w-8 place-items-center rounded-full border border-dashed border-white/10 bg-white/[0.02]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <span className="text-[11px] font-medium">Coming Soon</span>
            </div>
          </section>

          <section className="relative w-full shrink-0" style={{ aspectRatio: "1 / 1" }}>
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
