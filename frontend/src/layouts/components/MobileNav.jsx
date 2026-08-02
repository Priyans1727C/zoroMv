import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, X, ChevronRight, Menu, Sparkles, Loader2 } from "lucide-react";
import { NAV_MAIN, NAV_ACCOUNT } from "./Sidebar";
import { PosterSkeleton } from "./Skeleton";

import { useSearchHome } from "../../features/home/hooks/useHome";
import { applyPersonFilter } from "./topbarHelper";

const W = "w-[min(88vw,360px)]";
const ISLAND = "M 0 0 L 360 0 L 360 6 C 360 40, 336 66, 300 66 L 60 66 C 24 66, 0 40, 0 6 Z";
const SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 };

function panelPath(w, h) {
  if (!w || !h) return "";
  const n = Math.min(34, h * 0.4), r = Math.min(28, h / 2, w / 2);
  const a = w * (60 / 360), b = w * (300 / 360);
  return `M 0 0 C 0 ${n * 0.567}, ${a * 0.4} ${n}, ${a} ${n} L ${b} ${n} C ${b + (w - b) * 0.6} ${n}, ${w} ${n * 0.567}, ${w} 0 L ${w} ${h - r} Q ${w} ${h}, ${w - r} ${h} L ${r} ${h} Q 0 ${h}, 0 ${h - r} Z`;
}

/* ── Debounce Hook ── */
function useDebounce(value, ms = 300) {
  const [d, set] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => set(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return d;
}

/* ── Main ── */
export default function MobileNav({ open, onToggle, onClose }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [size, setSize] = useState({ w: 320, h: 180 });

  const islandRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const debounced = useDebounce(raw, 650);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /* Route change → close */
  useEffect(() => {
    setSearchOpen(false);
    onCloseRef.current?.();
  }, [location.pathname]);

  /* Outside click + Escape */
  useEffect(() => {
    if (!searchOpen) return;
    const ptr = (e) => { if (islandRef.current && !islandRef.current.contains(e.target)) setSearchOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setSearchOpen(false); };
    document.addEventListener("mousedown", ptr);
    document.addEventListener("touchstart", ptr);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", ptr); document.removeEventListener("touchstart", ptr); document.removeEventListener("keydown", esc); };
  }, [searchOpen]);

  /* Autofocus + clear on open/close */
  useEffect(() => {
    if (searchOpen) { const t = setTimeout(() => inputRef.current?.focus(), 120); return () => clearTimeout(t); }
    setRaw("");
  }, [searchOpen]);

  /* Resize observer */
  useEffect(() => {
    if (!searchOpen || !panelRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      const r = e?.contentRect;
      if (r?.width > 0 && r?.height > 0) setSize({ w: r.width, h: r.height });
    });
    ro.observe(panelRef.current);
    return () => ro.disconnect();
  }, [searchOpen]);

  /* Search hook — extract data as results and default to empty array */
  const { data: rawData = [], isFetching, isError } = useSearchHome(debounced, 1);
  const results = applyPersonFilter(rawData);

  const submit = (e) => {
    e?.preventDefault();
    const q = raw.trim();
    if (!q) return;
    setSearchOpen(false);
    // Updated routing logic to use standard encodeURIComponent
    navigate(`browse/search_all?search_query=${encodeURIComponent(q)}`);
  };

  const clip = useMemo(() => panelPath(size.w, size.h), [size]);

  return (
    <>
      {/* Dynamic Island */}
      <div ref={islandRef} className="fixed inset-x-0 top-0 z-50 flex flex-col items-center lg:hidden">
        <div className={`relative z-20 ${W}`} style={{ height: "clamp(56px, 16vw, 72px)" }}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 72" preserveAspectRatio="none" fill="none">
            <path d={ISLAND} fill="#0a0a0a" />
          </svg>
          <div className="absolute left-1/2 top-0 z-10 flex w-[85%] max-w-[300px] -translate-x-1/2 items-center justify-between px-1 sm:px-2" style={{ height: "91.6%" }}>
            <button onClick={() => { setSearchOpen(false); onToggle?.(); }} aria-label="Menu" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:scale-110 hover:bg-white/20 sm:h-7 sm:w-7">
              <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3 }}>
                {open ? <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} /> : <Menu className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />}
              </motion.div>
            </button>
            <Link key="brandName" to="/">
            <span className="mx-1 truncate bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-center text-sm font-black tracking-wider text-transparent drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] sm:text-base sm:tracking-widest">zoroMv</span>
            </Link>
            <button onClick={() => { setSearchOpen((v) => !v); onClose?.(); }} aria-label="Search" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-teal-950 shadow-lg shadow-teal-400/30 transition-all duration-300 hover:scale-110 hover:shadow-teal-400/50 sm:h-7 sm:w-7">
              <motion.div animate={{ rotate: searchOpen ? 90 : 0, scale: searchOpen ? 0.9 : 1 }} transition={{ duration: 0.3 }}>
                {searchOpen ? <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} /> : <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Search Panel */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.92, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: -8 }} transition={SPRING}
              style={{ transformOrigin: "top center", filter: "drop-shadow(0 22px 45px rgba(0,0,0,0.6))", marginTop: "-37px" }} className={W}>
              <div ref={panelRef} className="relative overflow-hidden bg-neutral-950/95 backdrop-blur-2xl"
                style={{ clipPath: `path('${clip.replace(/\n/g, " ")}')`, WebkitClipPath: `path('${clip.replace(/\n/g, " ")}')` }}>
                {size.w > 0 && clip && (
                  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none" fill="none">
                    <path d={clip} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                  </svg>
                )}
                <div className="pointer-events-none shrink-0" style={{ height: "44px" }} />

                <form onSubmit={submit} className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
                  <button type="submit" aria-label="Search" className="shrink-0 text-white/40 transition-colors hover:text-primary"><Search className="h-4 w-4" /></button>
                  <input ref={inputRef} value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="Search movies, series..." className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
                  {raw && <button type="button" onClick={() => setRaw("")} aria-label="Clear" className="grid h-5 w-5 place-items-center rounded-full text-white/40 hover:bg-white/10 hover:text-white"><X className="h-3 w-3" strokeWidth={2.5} /></button>}
                </form>

                <div className="scroll-hide max-h-[320px] overflow-y-auto p-2.5">
                  <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                    {raw ? `Results for "${raw}"` : "Start typing to search"}
                  </p>

                  {
                    isFetching ? (
                      <div className="grid place-items-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    ) : isError ? (
                      <p className="py-8 text-center text-sm text-white/50">Search is unavailable</p>
                    ) : !raw.trim() ? (
                      <p className="py-8 text-center text-sm text-white/50">Search movies and series</p>
                    ) : results.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8 text-center">
                        <Search className="h-6 w-6 text-white/30" />
                        <p className="text-sm text-white/50">No matches found</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {results.map((item, i) => (
                          <motion.a
                            key={item.id}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              submit();
                            }}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: (i * 35) / 1000 }}
                            className="group/result flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/10"
                          >
                            <div className="h-10 w-15 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 relative bg-neutral-900">
                              {item.posterUrl ? (
                                <img
                                  src={item.posterUrl}
                                  alt={item.title}
                                  loading="lazy"
                                  className="h-full w-full object-cover rounded-lg"
                                />
                              ) : (
                                <PosterSkeleton className="h-full w-full rounded-lg" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-white">
                                {item.title}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-white/50 uppercase tracking-wide">
                                {/* Show Year */}
                                <span>{item.year || "N/A"}</span>

                                {/* Show Type (Movie/TV) if it's not "NA" */}
                                {item.type && item.type !== "NA" && (
                                  <>
                                    <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
                                    <span>{item.type === "movie" ? "Movie" : item.type === "tv" ? "TV" : item.type}</span>
                                  </>
                                )}

                                <span className="h-0.5 w-0.5 rounded-full bg-white/30" />

                                {/* Show 1-decimal rating or "NR" for Not Rated */}
                                <span className="font-medium text-primary">
                                  ★ {item.rating ? Number(item.rating).toFixed(1) : "NR"}
                                </span>
                              </div>
                            </div>

                            <ChevronRight className="h-4 w-4 text-white/20 transition-colors group-hover/result:text-white/60" />
                          </motion.a>
                        ))}
                      </div>
                    )
                  }
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="glass-panel fixed inset-y-0 left-0 z-[70] flex w-[270px] flex-col rounded-r-3xl p-6 lg:hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15"><Sparkles className="h-5 w-5 text-primary" /></div>
                  <h1 className="text-xl font-bold tracking-tight"><span className="text-primary">Zoro</span><span>Mv</span></h1>
                </div>
                <button onClick={onClose} aria-label="Close" className="rounded-xl p-2 hover:bg-white/5"><X className="h-5 w-5" /></button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {[...NAV_MAIN, "divider", ...NAV_ACCOUNT].map((item, i) =>
                  item === "divider" ? <div key={i} className="mx-2 my-4 h-px bg-border" />
                    : <Link key={item.key} to={item.path} onClick={onClose}>
                      <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${location.pathname === item.path ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "text-foreground/80 hover:bg-white/5 hover:text-foreground"}`}>
                        <item.icon className="h-5 w-5" />{item.label}
                      </div>
                    </Link>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}