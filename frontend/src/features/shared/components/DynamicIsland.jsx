import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Bell,
  ChevronRight,
  X,
  LogOut,
  Home,
  Film,
  Tv,
  Sparkles,
  Bookmark,
} from "lucide-react";
// import { allTitles, trendingSearches } from "../data/movies";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const allTitles =[]
const trendingSearches=[]

const SEARCH_AUTOFOCUS_DELAY = 120;
const MAX_SEARCH_RESULTS = 8;
const STAGGER_DELAY_MS = 35;

/** Width used by both the island and its panels so they align horizontally. */
const PANEL_WIDTH = "w-[min(88vw,360px)]";

/** Concave-notch geometry — mirrors the island's own foot positions. */
const PANEL_WAIST_LEFT = 60 / 360;
const PANEL_WAIST_RIGHT = 300 / 360;
const PANEL_NOTCH_DEPTH = 34;
const PANEL_BOTTOM_RADIUS = 28;
const PANEL_TOP_OFFSET_PX = 37;
const PANEL_CONTENT_INSET_PX = PANEL_NOTCH_DEPTH + 10;

const PANEL_DROP_SHADOW = "drop-shadow(0 22px 45px rgba(0,0,0,0.6))";

/** Island's own SVG path (the bump hanging from the top edge). */
const ISLAND_PATH = `
  M 0 0 L 360 0 L 360 6
  C 360 40, 336 66, 300 66
  L 60 66
  C 24 66, 0 40, 0 6
  Z
`;

export const NAV_LINKS = [
  { label: "Home", href: "#home", icon: "home" },
  { label: "Movies", href: "#movies", icon: "film" },
  { label: "TV Shows", href: "#tv", icon: "tv" },
  { label: "New & Popular", href: "#new", icon: "sparkle" },
  { label: "My List", href: "#list", icon: "bookmark" },
];

const SEARCH_SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 };

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

function buildPanelPath(width, height) {
  if (!width || !height) return "";
  const nd = Math.min(PANEL_NOTCH_DEPTH, height * 0.4);
  const r = Math.min(PANEL_BOTTOM_RADIUS, height / 2, width / 2);
  const waistL = width * PANEL_WAIST_LEFT;
  const waistR = width * PANEL_WAIST_RIGHT;
  return `
    M 0 0
    C 0 ${nd * 0.567}, ${waistL * 0.4} ${nd}, ${waistL} ${nd}
    L ${waistR} ${nd}
    C ${waistR + (width - waistR) * 0.6} ${nd}, ${width} ${nd * 0.567}, ${width} 0
    L ${width} ${height - r}
    Q ${width} ${height}, ${width - r} ${height}
    L ${r} ${height}
    Q 0 ${height}, 0 ${height - r}
    Z
  `.trim();
}

/** Converts a panel path into a CSS `clip-path: path(...)` value. */
function clipPathStyle(path) {
  if (!path) return {};
  const d = `path('${path.replace(/\n/g, " ")}')`;
  return { clipPath: d, WebkitClipPath: d };
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icon Components (Lucide Wrappers)
// ─────────────────────────────────────────────────────────────────────────────

function NavIconGlyph({ icon, className = "" }) {
  const props = { className: `h-4 w-4 ${className}`, strokeWidth: 2 };
  switch (icon) {
    case "home": return <Home {...props} />;
    case "film": return <Film {...props} />;
    case "tv": return <Tv {...props} />;
    case "sparkle": return <Sparkles {...props} />;
    case "bookmark": return <Bookmark {...props} />;
    default: return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────────────────────

function PanelBorder({ size, path }) {
  if (size.width <= 0 || !path) return null;
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none" fill="none">
      <path d={path} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function NotchSpacer() {
  return <div className="pointer-events-none shrink-0" style={{ height: `${PANEL_CONTENT_INSET_PX}px` }} />;
}

function IconButton({ label, onClick, className = "", children }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center rounded-full transition-colors ${className}`} aria-label={label}>
      {children}
    </button>
  );
}

function SearchResultItem({ item, index }) {
  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: (index * STAGGER_DELAY_MS) / 1000 }}
      className="group/result flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/10"
    >
      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-800 ring-1 ring-white/10">
        <img src={item.poster} alt={item.title} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-300 group-hover/result:scale-110" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{item.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-white/50">
          <span>{item.year}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
          <span>{item.rating}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
          <span className={`font-medium ${item.type === "Series" ? "text-indigo-400" : "text-teal-300"}`}>{item.type ?? "Movie"}</span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-white/20 transition-colors group-hover/result:text-white/60" />
    </motion.a>
  );
}

function MenuNavItem({ link, index, isOpen, onClose }) {
  return (
    <a
      href={link.href}
      onClick={onClose}
      style={{ transitionDelay: isOpen ? `${index * STAGGER_DELAY_MS}ms` : "0ms" }}
      className={`group/item flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-white/80 transition-all duration-300 ease-out hover:bg-white/10 hover:text-white ${
        isOpen ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
      }`}
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors duration-300 group-hover/item:bg-teal-400/15 group-hover/item:text-teal-300">
        <NavIconGlyph icon={link.icon} />
      </span>
      <span className="flex-1 truncate">{link.label}</span>
      <span className="h-1.5 w-1.5 shrink-0 scale-0 rounded-full bg-teal-400 transition-transform duration-300 group-hover/item:scale-100" />
    </a>
  );
}

function MenuPanel({ open, panelRef, size, path, onClose }) {
  return (
    <div
      className={`${PANEL_WIDTH} origin-top overflow-hidden transition-all duration-300 ease-out ${
        open ? "max-h-[560px] translate-y-0 scale-100 opacity-100" : "pointer-events-none mt-0 max-h-0 -translate-y-2 scale-95 opacity-0"
      }`}
      style={{ filter: PANEL_DROP_SHADOW, marginTop: open ? `-${PANEL_TOP_OFFSET_PX}px` : undefined }}
    >
      <div ref={panelRef} className="relative bg-neutral-950/95 backdrop-blur-2xl" style={clipPathStyle(path)}>
        <PanelBorder size={size} path={path} />
        <NotchSpacer />
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20">JD</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">John Doe</p>
            <p className="truncate text-xs text-white/50">Premium Member</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/40" />
        </div>
        <nav className="flex flex-col gap-0.5 p-2.5">
          {NAV_LINKS.map((link, i) => (
            <MenuNavItem key={link.label} link={link} index={i} isOpen={open} onClose={onClose} />
          ))}
        </nav>
        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <IconButton label="Search" className="h-9 w-9 text-white/70 hover:bg-white/10 hover:text-white"><Search className="h-4 w-4" /></IconButton>
            <IconButton label="Notifications" className="h-9 w-9 text-white/70 hover:bg-white/10 hover:text-white"><Bell className="h-4 w-4" /></IconButton>
          </div>
          <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10">
            Sign Out <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchPanel({ open, panelRef, inputRef, size, path, query, results, onQueryChange }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -8 }}
          transition={SEARCH_SPRING}
          style={{ transformOrigin: "top center", filter: PANEL_DROP_SHADOW, marginTop: `-${PANEL_TOP_OFFSET_PX}px` }}
          className={PANEL_WIDTH}
        >
          <div ref={panelRef} className="relative overflow-hidden bg-neutral-950/95 backdrop-blur-2xl" style={clipPathStyle(path)}>
            <PanelBorder size={size} path={path} />
            <NotchSpacer />
            <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-white/40" />
              <input ref={inputRef} type="text" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search movies, series..." className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
              {query && (
                <IconButton label="Clear search" onClick={() => onQueryChange("")} className="h-5 w-5 text-white/40 hover:bg-white/10 hover:text-white">
                  <X className="h-3 w-3" strokeWidth={2.5} />
                </IconButton>
              )}
            </div>
            <div className="max-h-[320px] overflow-y-auto p-2.5">
              <AnimatePresence mode="wait">
                <motion.div key={query ? "results" : "trending"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
                  <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">{query ? `Results for "${query}"` : "Trending Searches"}</p>
                  {results.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-center"><span className="text-2xl">🔍</span><p className="text-sm text-white/50">No matches found</p></div>
                  ) : (
                    <div className="flex flex-col gap-1">{results.map((item, i) => <SearchResultItem key={item.id} item={item} index={i} />)}</div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IslandContent({ searchOpen, menuOpen, onToggleSearch, onToggleMenu }) {
  return (
    <div className="absolute left-1/2 top-0 z-10 flex w-[85%] max-w-[300px] -translate-x-1/2 items-center justify-between px-1 sm:px-2" style={{ height: "91.6%" }}>
      <button onClick={onToggleSearch} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-teal-950 shadow-lg shadow-teal-400/30 transition-all duration-300 hover:scale-110 hover:shadow-teal-400/50 sm:h-7 sm:w-7" aria-label="Toggle search">
        <motion.div animate={{ rotate: searchOpen ? 90 : 0, scale: searchOpen ? 0.9 : 1 }} transition={{ duration: 0.3 }}>
          {searchOpen ? <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} /> : <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />}
        </motion.div>
      </button>
      <span className="mx-1 truncate bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-center text-sm font-black tracking-wider text-transparent drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] sm:text-base sm:tracking-widest">zoroMv</span>
      <button onClick={onToggleMenu} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:scale-110 hover:bg-white/20 sm:h-7 sm:w-7" aria-label="Toggle menu">
        <motion.div animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronRight className="h-3 w-3 rotate-90" strokeWidth={3} />
        </motion.div>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function DynamicIsland({ visible }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPanelSize, setSearchPanelSize] = useState({ width: 320, height: 180 });
  const [menuPanelSize, setMenuPanelSize] = useState({ width: 320, height: 180 });

  const islandAreaRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchPanelRef = useRef(null);
  const menuPanelRef = useRef(null);

  // Close panels whenever the island hides.
  useEffect(() => {
    if (!visible) { setMenuOpen(false); setSearchOpen(false); }
  }, [visible]);

  // Outside-click and Escape to close search panel.
  useEffect(() => {
    if (!searchOpen && !menuOpen) return;
    const onPointer = (e) => {
      if (islandAreaRef.current && !islandAreaRef.current.contains(e.target)) {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
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
  }, [searchOpen, menuOpen]);

  // Autofocus search input on open; reset query on close.
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), SEARCH_AUTOFOCUS_DELAY);
      return () => clearTimeout(t);
    }
    setSearchQuery("");
  }, [searchOpen]);

  // Measure search panel size for clip-path geometry.
  useEffect(() => {
    if (!searchOpen) return;
    const el = searchPanelRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r && r.width > 0 && r.height > 0) setSearchPanelSize({ width: r.width, height: r.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [searchOpen]);

  // Measure menu panel size for clip-path geometry.
  useEffect(() => {
    const el = menuPanelRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r && r.width > 0 && r.height > 0) setMenuPanelSize({ width: r.width, height: r.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return trendingSearches;
    return allTitles.filter((m) => m.title.toLowerCase().includes(q)).slice(0, MAX_SEARCH_RESULTS);
  }, [searchQuery]);

  const searchPanelPath = useMemo(() => buildPanelPath(searchPanelSize.width, searchPanelSize.height), [searchPanelSize]);
  const menuPanelPath = useMemo(() => buildPanelPath(menuPanelSize.width, menuPanelSize.height), [menuPanelSize]);

  return (
    <div ref={islandAreaRef} className={`absolute inset-x-0 top-0 flex flex-col items-center transition-all duration-[600ms] ${
      visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-8 opacity-0"
    }`}>
      <div className="relative w-[min(88vw,360px)] z-20" style={{ height: "clamp(56px, 16vw, 72px)" }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 72" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d={ISLAND_PATH} fill="#0a0a0a" /></svg>
        <IslandContent searchOpen={searchOpen} menuOpen={menuOpen} onToggleSearch={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }} onToggleMenu={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }} />
      </div>
      <MenuPanel open={menuOpen} panelRef={menuPanelRef} size={menuPanelSize} path={menuPanelPath} onClose={() => setMenuOpen(false)} />
      <SearchPanel open={searchOpen} panelRef={searchPanelRef} inputRef={searchInputRef} size={searchPanelSize} path={searchPanelPath} query={searchQuery} results={searchResults} onQueryChange={setSearchQuery} />
    </div>
  );
}