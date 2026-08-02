import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, X, ChevronRight, Menu, Sparkles } from "lucide-react";
import { NAV_MAIN, NAV_ACCOUNT } from "./Sidebar";
import { PosterSkeleton } from "./Skeleton";
import { TRENDING, NEW_RELEASES, TOP_RATED} from "../../mockData/allHomeData";
import { useSearchHome } from "../../features/home/hooks/useHome";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ALL_TITLES = [...TRENDING, ...NEW_RELEASES, ...TOP_RATED].map((m, i) => ({
  id: `${m.title}-${i}`,
  ...m,
}));
const TRENDING_SEARCHES = ALL_TITLES.slice(0, 6);

const SEARCH_AUTOFOCUS_DELAY = 120;
const MAX_SEARCH_RESULTS = 8;
const STAGGER_DELAY_MS = 35;

/** Width used by both the island and its panel so they align horizontally. */
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
// Helper Components
// ─────────────────────────────────────────────────────────────────────────────

function PanelBorder({ size, path }) {
  if (size.width <= 0 || !path) return null;
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${size.width} ${size.height}`}
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function NotchSpacer() {
  return (
    <div
      className="pointer-events-none shrink-0"
      style={{ height: `${PANEL_CONTENT_INSET_PX}px` }}
    />
  );
}

function IconButton({ label, onClick, className = "", children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full transition-colors ${className}`}
      aria-label={label}
    >
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
      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
        <PosterSkeleton className="h-full w-full" rounded="rounded-lg" tone={index} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{item.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-white/50">
          <span>{item.meta}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
          <span className="font-medium text-primary">★ {item.rating}</span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-white/20 transition-colors group-hover/result:text-white/60" />
    </motion.a>
  );
}

const SEARCH_DEBOUNCE_MS = 350;


function SearchPanel({
  open,
  panelRef,
  inputRef,
  size,
  path,
  query,
  results,
  loading,
  error,
  onQueryChange,
  onSubmit,
}) {
  const hasQuery = Boolean(query.trim());

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-8 text-center text-sm text-white/50">
          Unable to search right now.
        </div>
      );
    }

    if (!results.length) {
      return (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <span className="text-2xl">🔍</span>
          <p className="text-sm text-white/50">No matches found</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        {results.slice(0, MAX_SEARCH_RESULTS).map((item, index) => (
          <SearchResultItem
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -8 }}
          transition={SEARCH_SPRING}
          style={{
            transformOrigin: "top center",
            filter: PANEL_DROP_SHADOW,
            marginTop: `-${PANEL_TOP_OFFSET_PX}px`,
          }}
          className={PANEL_WIDTH}
        >
          <div
            ref={panelRef}
            className="relative overflow-hidden bg-neutral-950/95 backdrop-blur-2xl"
            style={clipPathStyle(path)}
          >
            <PanelBorder size={size} path={path} />
            <NotchSpacer />

            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3"
            >
              <button
                type="submit"
                aria-label="Search"
                className="shrink-0 text-white/40 transition-colors hover:text-primary"
              >
                <Search className="h-4 w-4" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search movies, series..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />

              {query && (
                <IconButton
                  label="Clear search"
                  onClick={() => onQueryChange("")}
                  className="h-5 w-5 text-white/40 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3 w-3" strokeWidth={2.5} />
                </IconButton>
              )}
            </form>

            <div className="scroll-hide max-h-[320px] overflow-y-auto p-2.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={hasQuery ? "results" : "trending"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                >
                  <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                    {hasQuery ? `Results for "${query}"` : "Trending Searches"}
                  </p>

                  {hasQuery ? renderContent() : (
                    <div className="flex flex-col gap-1">
                      {TRENDING_SEARCHES.map((item, index) => (
                        <SearchResultItem
                          key={item.id}
                          item={item}
                          index={index}
                        />
                      ))}
                    </div>
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
    <div
      className="absolute left-1/2 top-0 z-10 flex w-[85%] max-w-[300px] -translate-x-1/2 items-center justify-between px-1 sm:px-2"
      style={{ height: "91.6%" }}
    >
      {/* LEFT — hamburger toggles the sidebar drawer */}
      <button
        onClick={onToggleMenu}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:scale-110 hover:bg-white/20 sm:h-7 sm:w-7"
        aria-label="Toggle sidebar"
      >
        <motion.div animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
          {menuOpen ? (
            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
          ) : (
            <Menu className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
          )}
        </motion.div>
      </button>

      {/* CENTER — brand */}
      <span className="mx-1 truncate bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-center text-sm font-black tracking-wider text-transparent drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] sm:text-base sm:tracking-widest">
        zoroMv
      </span>

      {/* RIGHT — search */}
      <button
        onClick={onToggleSearch}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-teal-950 shadow-lg shadow-teal-400/30 transition-all duration-300 hover:scale-110 hover:shadow-teal-400/50 sm:h-7 sm:w-7"
        aria-label="Toggle search"
      >
        <motion.div
          animate={{ rotate: searchOpen ? 90 : 0, scale: searchOpen ? 0.9 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {searchOpen ? (
            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
          ) : (
            <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
          )}
        </motion.div>
      </button>
    </div>
  );
}

function SidebarDrawer({ open, onClose }) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="glass-panel fixed inset-y-0 left-0 z-[70] flex w-[270px] flex-col rounded-r-3xl p-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">
                  <span className="text-primary">Zoro</span>
                  <span>Mv</span>
                </h1>
              </div>
              <button onClick={onClose} className="rounded-xl p-2 hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-1">
              {[...NAV_MAIN, "divider", ...NAV_ACCOUNT].map((item, i) =>
                item === "divider" ? (
                  <div key={i} className="mx-2 my-4 h-px bg-border" />
                ) : (
                  <Link key={item.key} to={item.path} onClick={onClose}>
                    <div
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                        location.pathname === item.path
                          ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                          : "text-foreground/80"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </div>
                  </Link>
                )
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component — Dynamic Island navbar (mobile / tablet)
// ─────────────────────────────────────────────────────────────────────────────

export default function MobileNav({ open, onToggle, onClose }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchPanelSize, setSearchPanelSize] = useState({
    width: 320,
    height: 180,
  });

  const islandAreaRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchPanelRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  /*
   * Debounce the user's input before sending it to React Query.
   * No API request happens while the user is actively typing.
   */
  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setDebouncedQuery("");
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /*
   * React Query handles:
   * - request lifecycle
   * - caching
   * - stale data
   * - errors
   */
  const {
    data: searchResults = [],
    isFetching,
    isError,
  } = useSearchHome(debouncedQuery);

  const submitSearch = (event) => {
    event?.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    setSearchOpen(false);

    navigate(
      `browse/search_all?search_query=${encodeURIComponent(query)}`
    );
  };

  // Close search/menu when route changes.
  useEffect(() => {
    setSearchOpen(false);
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close search when clicking outside or pressing Escape.
  useEffect(() => {
    if (!searchOpen) return;

    const handlePointerDown = (event) => {
      if (!islandAreaRef.current?.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  // Autofocus when search opens and reset when it closes.
  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery("");
      setDebouncedQuery("");
      return;
    }

    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, SEARCH_AUTOFOCUS_DELAY);

    return () => clearTimeout(timer);
  }, [searchOpen]);

  // Measure search panel for clip-path geometry.
  useEffect(() => {
    if (!searchOpen || !searchPanelRef.current) return;

    const element = searchPanelRef.current;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      if (width && height) {
        setSearchPanelSize({ width, height });
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [searchOpen]);

  const searchPanelPath = buildPanelPath(
    searchPanelSize.width,
    searchPanelSize.height
  );

  const hasQuery = Boolean(searchQuery.trim());

  return (
    <>
      <div
        ref={islandAreaRef}
        className="fixed inset-x-0 top-0 z-50 flex flex-col items-center lg:hidden"
      >
        <div
          className={`relative z-20 ${PANEL_WIDTH}`}
          style={{
            height: "clamp(56px, 16vw, 72px)",
          }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 360 72"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={ISLAND_PATH} fill="#0a0a0a" />
          </svg>

          <IslandContent
            searchOpen={searchOpen}
            menuOpen={open}
            onToggleSearch={() => {
              setSearchOpen((value) => !value);
              onClose?.();
            }}
            onToggleMenu={() => {
              setSearchOpen(false);
              onToggle?.();
            }}
          />
        </div>

        <SearchPanel
          open={searchOpen}
          panelRef={searchPanelRef}
          inputRef={searchInputRef}
          size={searchPanelSize}
          path={searchPanelPath}
          query={searchQuery}
          results={searchResults}
          loading={hasQuery && (isFetching || debouncedQuery !== searchQuery.trim())}
          error={hasQuery && isError}
          onQueryChange={setSearchQuery}
          onSubmit={submitSearch}
        />
      </div>

      <SidebarDrawer open={open} onClose={onClose} />
    </>
  );
}