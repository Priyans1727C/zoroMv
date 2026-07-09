import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Loader2,
  X,
  CheckCheck,
  Film,
  Clock,
  Users,
  BadgeCheck,
} from "lucide-react";


const CATEGORIES = ["All", "Movies", "Series", "Anime", "Documentary"];
const PANEL_SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 };
const STAGGER_DELAY_MS = 35;

const KIND_META = {
  release: { icon: Film, className: "bg-primary/15 text-primary" },
  reminder: { icon: Clock, className: "bg-amber-400/15 text-amber-300" },
  social: { icon: Users, className: "bg-indigo-400/15 text-indigo-300" },
  system: { icon: BadgeCheck, className: "bg-emerald-400/15 text-emerald-300" },
};

export default function TopBar({ category, setCategory, catOpen, setCatOpen }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const searchAreaRef = useRef(null);
  const inputRef = useRef(null);
  const { results, loading } = { results: [], loading: false, error: false } ;


  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifAreaRef = useRef(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const panelOpen = focused && query.trim().length > 0;

  const clearSearch = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  // Outside-click and Escape dismissal for search panel.
  useEffect(() => {
    if (!panelOpen) return;
    const onPointer = (e) => {
      if (searchAreaRef.current && !searchAreaRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setFocused(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [panelOpen]);

  // Outside-click and Escape dismissal for notification panel.
  useEffect(() => {
    if (!notifOpen) return;
    const onPointer = (e) => {
      if (notifAreaRef.current && !notifAreaRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [notifOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 -mx-3 -mt-3 hidden items-center gap-3 bg-background/80 px-3 pt-3 pb-3 backdrop-blur-xl sm:-mx-4 sm:-mt-4 sm:px-4 sm:pt-4 lg:-mx-6 lg:-mt-6 lg:flex lg:px-6 lg:pt-6"
    >
      <div className="relative">
        <button
          onClick={() => setCatOpen(!catOpen)}
          className="glass-panel flex h-12 items-center gap-2 rounded-full px-5 text-sm font-medium"
        >
          {category}
          <motion.span animate={{ rotate: catOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>
        <AnimatePresence>
          {catOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="glass-panel absolute left-0 top-14 z-30 w-44 overflow-hidden rounded-2xl p-2"
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCategory(c);
                    setCatOpen(false);
                  }}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    c === category ? "bg-primary/15 text-primary" : "hover:bg-white/5"
                  }`}
                >
                  {c}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search input + floating suggestion panel */}
      <div ref={searchAreaRef} className="relative min-w-0 flex-1">
        <div
          className={`glass-panel flex h-12 min-w-0 items-center gap-3 rounded-full px-5 transition-shadow ${
            panelOpen ? "ring-1 ring-primary/30" : ""
          }`}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search movies, series, anime…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={clearSearch}
              aria-label="Clear search"
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-3 w-3" strokeWidth={2.5} />
            </button>
          )}
          {loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
          ) : (
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </div>

        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={PANEL_SPRING}
              style={{ transformOrigin: "top center" }}
              className="glass-panel absolute inset-x-0 top-14 z-50 overflow-hidden rounded-3xl shadow-[0_22px_45px_rgba(0,0,0,0.55)]"
            >
              <div className="scroll-hide max-h-[min(420px,60vh)] overflow-y-auto p-2.5">
                <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {loading ? "Searching…" : `Results for "${query.trim()}"`}
                </p>

                {loading && results.length === 0 ? (
                  <SearchSkeleton />
                ) : results.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <span className="text-2xl">🔍</span>
                    <p className="text-sm text-muted-foreground">
                      No matches found for “{query.trim()}”
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {results.map((item, i) => (
                      <SearchResultRow
                        key={item.id}
                        item={item}
                        index={i}
                        onSelect={() => setFocused(false)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notification bell + floating panel */}
      <div ref={notifAreaRef} className="relative shrink-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setNotifOpen(!notifOpen)}
          aria-label="Notifications"
          className={`glass-panel relative grid h-12 w-12 place-items-center rounded-full transition-shadow ${
            notifOpen ? "ring-1 ring-primary/30" : ""
          }`}
        >
          <motion.span animate={{ rotate: notifOpen ? [0, -12, 10, 0] : 0 }} transition={{ duration: 0.4 }}>
            <Bell className="h-4 w-4" />
          </motion.span>
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">
              {unreadCount}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={PANEL_SPRING}
              style={{ transformOrigin: "top right" }}
              className="glass-panel absolute right-0 top-14 z-50 w-[min(90vw,400px)] overflow-hidden rounded-3xl shadow-[0_22px_45px_rgba(0,0,0,0.55)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary ring-1 ring-primary/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-default disabled:text-muted-foreground disabled:hover:bg-transparent"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              </div>

              <div className="scroll-hide max-h-[min(420px,60vh)] overflow-y-auto p-2.5">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <span className="text-2xl">🔔</span>
                    <p className="text-sm text-muted-foreground">You're all caught up</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {notifications.map((item) => (
                      <NotificationRow
                        key={item.id}
                        item={item}
                        onSelect={() => markRead(item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 p-2">
                <button
                  onClick={() => setNotifOpen(false)}
                  className="w-full rounded-2xl py-2 text-center text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  View all notifications
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="glass-panel relative grid h-12 w-12 shrink-0 place-items-center rounded-full"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        className="glass-panel hidden h-12 shrink-0 items-center gap-3 rounded-full pl-1 pr-4 sm:flex"
      >
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary/60 to-primary/20 text-sm font-bold text-primary-foreground">
          AX
        </div>
        <span className="text-sm font-medium">Alex</span>
      </motion.button>
    </motion.div>
  );
}

function SearchResultRow({ item, index, onSelect }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: (index * STAGGER_DELAY_MS) / 1000 }}
      onClick={onSelect}
      className="group/result flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-white/10"
    >
      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2 ring-1 ring-white/10">
        <img
          src={item.poster}
          alt={item.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover/result:scale-110"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{item.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>{item.year || "—"}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
          <span>★ {item.rating}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
          <span className={`font-medium ${item.type === "Series" ? "text-indigo-400" : "text-primary"}`}>
            {item.type ?? "Movie"}
          </span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-white/20 transition-colors group-hover/result:text-white/60" />
    </motion.button>
  );
}

function NotificationRow({ item, onSelect }) {
  const meta = KIND_META[item.kind];
  const KindIcon = meta.icon;
  return (
    <motion.button
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className={`group/notif flex w-full items-start gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-white/10 ${
        item.unread ? "bg-primary/5" : ""
      }`}
    >
      {item.poster ? (
        <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2 ring-1 ring-white/10">
          <img
            src={item.poster}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover/notif:scale-110"
          />
        </div>
      ) : (
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.className}`}>
          <KindIcon className="h-4 w-4" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{item.title}</p>
          {item.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {item.message}
        </p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          {item.time}
        </p>
      </div>
      <span className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full ${meta.className} ${item.poster ? "" : "opacity-0"}`}>
        {item.poster && <KindIcon className="h-3 w-3" />}
      </span>
    </motion.button>
  );
}

function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl p-2">
          <div className="shimmer h-14 w-10 shrink-0 rounded-lg bg-surface-2" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="shimmer h-3.5 w-2/3 rounded-full bg-surface-2" />
            <div className="shimmer h-2.5 w-1/3 rounded-full bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
