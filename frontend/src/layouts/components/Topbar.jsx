import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router";
import { BadgeCheck, Bell, Check, CheckCheck, ChevronDown, ChevronRight, Clock, Film, Loader2, Search, SlidersHorizontal, Users, X } from "lucide-react";
import { PosterSkeleton } from "./Skeleton";
// import { useSearchResults } from "../hooks/useSearch";

import { FILTER_OPTIONS, DEFAULT_FILTERS, countActiveFilters, applyFilter, NOTIFICATION_TYPE_CONFIG, INITIAL_NOTIFICATIONS } from "./topbarHelper";
import { useSearchHome } from "../../features/home/hooks/useHome";




/* ── Constants ── */
const CATEGORIES_ITEMS = ["All", "Movies", "Series", "Anime", "Documentary"];
const SPRING_TRANSITION = { type: "spring", stiffness: 420, damping: 32, mass: 0.7 };
const STAGGER_DELAY_MS = 35;








/* ── Hooks ── */
function useDismissOnOutsideClick(elementRef, onDismiss, isActive) {
  useEffect(() => {
    if (!isActive) return;
    const handlePointerDown = (event) => { if (elementRef.current && !elementRef.current.contains(event.target)) onDismiss(); };
    const handleKeyDown = (event) => { if (event.key === "Escape") onDismiss(); };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("mousedown", handlePointerDown); document.removeEventListener("touchstart", handlePointerDown); document.removeEventListener("keydown", handleKeyDown); };
  }, [elementRef, onDismiss, isActive]);
}








export default function TopBar() {
  const navigate = useNavigate();
  const [currentCategoryValue, setCurrentCategoryValue] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isSearchResultsOpen = isInputFocused && searchQuery.trim().length > 0;
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilterMatrix, setCurrentFilterMatrix] = useState(DEFAULT_FILTERS);
  
  
  // const { filters, updateFilters, resetFilters, toggleGenreFilter, activeFilterCount } = useCatalogFilters(searchParams);
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const unreadCount = notifications.filter((notification) => notification.isUnread).length;
  
  const searchContainerRef = useRef(null), filterContainerRef = useRef(null), notificationContainerRef = useRef(null), searchInputRef = useRef(null);




  //setting query with prams
  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
  }, [searchParams]);


  //DebouncedSearch logic
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setDebouncedSearchQuery("");
      setIsDebouncing(false);
      return;
    }
    setIsDebouncing(true);
    const timeoutId = setTimeout(() => { setDebouncedSearchQuery(trimmedQuery); setIsDebouncing(false); }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useDismissOnOutsideClick(searchContainerRef, () => setIsInputFocused(false), isSearchResultsOpen);
  useDismissOnOutsideClick(filterContainerRef, () => setIsFilterOpen(false), isFilterOpen);
  useDismissOnOutsideClick(notificationContainerRef, () => setIsNotificationOpen(false), isNotificationOpen);









  //-----------------------------------  Api Data feactching ---------------------------------------------------------------------------------------------------------------------//
  // const { results, isFetching } = useSearchResults(debouncedSearchQuery, 1, { filters, category, limit: 8, enabled: Boolean(debouncedSearchQuery) });
  // const isLoading = isDebouncing || isFetching;

  const { data: rawSearchData, isFetching, isPending, } = useSearchHome(debouncedSearchQuery);
  const results = useMemo(() => rawSearchData ?applyFilter(currentFilterMatrix, rawSearchData):[], [rawSearchData, currentFilterMatrix]);
  const isLoading = isDebouncing || (Boolean(debouncedSearchQuery) && (isPending || isFetching));


  const handleSearchSubmit = useCallback((event) => {
    event?.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) { searchInputRef.current?.focus(); return; }
    setIsInputFocused(false); searchInputRef.current?.blur();
    // navigate(buildSearchPath(trimmedQuery, filters));
    navigate(`browse/search_all?search_query=${searchQuery}`);
  }, [searchQuery, navigate]);
  // [searchQuery, filters, navigate]


  // const handleApplyFilters = () => { navigate(buildSearchPath(searchQuery.trim(), filters)); setIsFilterOpen(false); };
  // const handleResetAllFilters = () => { resetFilters(); navigate(buildSearchPath(searchQuery.trim(), DEFAULT_FILTERS)); };





  useEffect(()=>{
    console.log(currentFilterMatrix);
  },[currentFilterMatrix])




  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 -mx-3 -mt-3 hidden items-center gap-3 bg-background/80 px-3 pt-3 pb-3 backdrop-blur-xl sm:-mx-4 sm:-mt-4 sm:px-4 sm:pt-4 lg:-mx-6 lg:-mt-6 lg:flex lg:px-6 lg:pt-6">


      {/* Category */}
      <CategoryDropdown categoryItems={CATEGORIES_ITEMS} currentCategoryValue={currentCategoryValue} setCurrentCategoryValue={(selectedCategory) => { setCurrentCategoryValue(selectedCategory); setIsCategoryOpen(false); }} isCategoryOpen={isCategoryOpen} setIsCategoryOpen={setIsCategoryOpen} />

      {/* Search */}
      <div ref={searchContainerRef} className="relative min-w-0 flex-1">
        <form onSubmit={handleSearchSubmit} className={`glass-panel flex h-12 min-w-0 items-center gap-3 rounded-full px-5 transition-shadow ${isSearchResultsOpen ? "ring-1 ring-primary/30" : ""}`}>
          <input ref={searchInputRef} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onFocus={() => setIsInputFocused(true)} placeholder="Search movies, series, anime..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          {searchQuery && <button type="button" onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }} aria-label="Clear" className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"><X className="h-3 w-3" strokeWidth={2.5} /></button>}
          {isLoading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" /> : <button type="submit" aria-label="Search" className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-primary"><Search className="h-4 w-4" /></button>}
        </form>

        <AnimatePresence>
          {isSearchResultsOpen && (
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={SPRING_TRANSITION} style={{ transformOrigin: "top center" }} className="glass-panel absolute inset-x-0 top-14 z-50 overflow-hidden rounded-3xl shadow-[0_22px_45px_rgba(0,0,0,0.55)]">
              <div className="scroll-hide max-h-[min(420px,60vh)] overflow-y-auto p-2.5">
                <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{isLoading ? "Searching..." : `Results for "${searchQuery.trim()}"`}</p>
                {isLoading ? <SearchResultsSkeleton /> : results.length === 0 ? <SearchEmptyState /> : <div className="flex flex-col gap-1">{results.map((result, index) => <SearchResultRow key={result.id} result={result} index={index} setPannel={setIsInputFocused} />)}</div>}
              </div>
              {!isLoading && searchQuery.trim() && <div className="border-t border-white/10 p-2"><button onClick={handleSearchSubmit} className="flex w-full items-center justify-center gap-1.5 rounded-2xl py-2 text-xs font-semibold text-primary hover:bg-primary/10">View all results<ChevronRight className="h-3.5 w-3.5" /></button></div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter */}
      <div ref={filterContainerRef} className="relative shrink-0">
        <IconButtonPill onClick={() => { setIsFilterOpen(!isFilterOpen); }} isActive={isFilterOpen} label="Filters">
          <SlidersHorizontal className={`h-4 w-4 ${countActiveFilters(currentFilterMatrix) > 0 ? "text-primary" : "text-muted-foreground"}`} />
          {countActiveFilters(currentFilterMatrix) > 0 && <Badge count={countActiveFilters(currentFilterMatrix)} />}
        </IconButtonPill>
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={SPRING_TRANSITION} style={{ transformOrigin: "top right" }} className="glass-panel absolute right-0 top-14 z-50 w-[min(92vw,420px)] overflow-visible rounded-3xl shadow-[0_22px_45px_rgba(0,0,0,0.55)]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold">Filters</h3>
                  {countActiveFilters(currentFilterMatrix) > 0 && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary ring-1 ring-primary/30">{countActiveFilters(currentFilterMatrix)}</span>}
                </div>
                <button onClick={() => setCurrentFilterMatrix(DEFAULT_FILTERS)} disabled={!countActiveFilters(currentFilterMatrix)} className="text-xs font-semibold text-muted-foreground hover:text-primary disabled:opacity-40">Reset</button>
              </div>
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {FILTER_OPTIONS.genres.map((genre) => (
                    <button key={genre.id} type="button" onClick={() => setCurrentFilterMatrix((prev) => ({ ...prev, genre: prev.genre === genre.id ? null : genre.id }))}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${currentFilterMatrix.genre === genre.id ? "bg-primary text-primary-foreground shadow-md" : "bg-surface-2/50 text-muted-foreground ring-1 ring-white/5 hover:text-foreground"}`}>{genre.name}</button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <FilterSelect value={currentFilterMatrix.type} options={FILTER_OPTIONS.type} onChange={(value) => setCurrentFilterMatrix((prev) => ({ ...prev, type: value }))} label="Type" />
                  <FilterSelect value={currentFilterMatrix.rating} options={FILTER_OPTIONS.rating} onChange={(value) => setCurrentFilterMatrix((prev) => ({ ...prev, rating: value, }))} label="Rating" />
                  <FilterSelect value={currentFilterMatrix.year} options={FILTER_OPTIONS.year} onChange={(value) => setCurrentFilterMatrix((prev) => ({ ...prev, year: value }))} label="Year" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <FilterSelect value={currentFilterMatrix.sort} options={FILTER_OPTIONS.sort} onChange={(value) => setCurrentFilterMatrix((prev) => ({ ...prev, sort: value }))} label="Sort" />
                  <FilterSelect value={currentFilterMatrix.lang} options={FILTER_OPTIONS.language} valueKey="code" onChange={(value) => setCurrentFilterMatrix((prev) => ({ ...prev, lang: value }))} label="Lang" />
                  <button type="button" onClick={() => setCurrentFilterMatrix((prev) => ({ ...prev, adult: !prev.adult }))} className={`h-9 rounded-xl px-3 text-xs font-semibold ring-1 ring-white/5 transition-colors ${currentFilterMatrix.adult ? "bg-primary text-primary-foreground" : "bg-surface-2/50 text-muted-foreground hover:text-foreground"}`}>{currentFilterMatrix.adult ? "18+ On" : "18+ Off"}</button>
                </div>
                <div className="flex justify-end border-t border-white/10 pt-2">
                  {/* <button onClick={handleApplyFilters} className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">Apply</button> */}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      {/* Notifications */}
      <div ref={notificationContainerRef} className="relative shrink-0">
        <IconButtonPill onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsFilterOpen(false); }} isActive={isNotificationOpen} label="Notifications">
          <motion.span animate={{ rotate: isNotificationOpen ? [0, -12, 10, 0] : 0 }} transition={{ duration: 0.4 }}><Bell className="h-4 w-4" /></motion.span>
          {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">{unreadCount}</span>}
        </IconButtonPill>
        <AnimatePresence>
          {isNotificationOpen && (
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={SPRING_TRANSITION} style={{ transformOrigin: "top right" }} className="glass-panel absolute right-0 top-14 z-50 w-[min(90vw,400px)] overflow-hidden rounded-3xl shadow-[0_22px_45px_rgba(0,0,0,0.55)]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2"><p className="text-sm font-semibold">Notifications</p>{unreadCount > 0 && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary ring-1 ring-primary/30">{unreadCount} new</span>}</div>
                <button onClick={() => setNotifications((prevNotifications) => prevNotifications.map((notif) => ({ ...notif, isUnread: false })))} disabled={!unreadCount} className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 disabled:text-muted-foreground"><CheckCheck className="h-3.5 w-3.5" />Read all</button>
              </div>
              <div className="scroll-hide max-h-[min(420px,60vh)] overflow-y-auto p-2.5"><div className="flex flex-col gap-1">{notifications.map((notification) => <NotificationRow key={notification.id} notification={notification} onMarkAsRead={() => setNotifications((prevNotifications) => prevNotifications.map((item) => item.id === notification.id ? { ...item, isUnread: false } : item))} />)}</div></div>
              <div className="border-t border-white/10 p-2"><button onClick={() => setIsNotificationOpen(false)} className="w-full rounded-2xl py-2 text-center text-xs font-semibold text-muted-foreground hover:bg-white/5 hover:text-foreground">View all</button></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Profile */}
      <motion.button whileHover={{ scale: 1.05 }} className="glass-panel hidden h-12 shrink-0 items-center gap-3 rounded-full pl-1 pr-4 sm:flex">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary/60 to-primary/20 text-sm font-bold text-primary-foreground">AX</div>
        <span className="text-sm font-medium">Alex</span>
      </motion.button>

    </motion.div>
  );
}








//components

function CategoryDropdown({ categoryItems, currentCategoryValue, setCurrentCategoryValue, isCategoryOpen, setIsCategoryOpen }) {
  return (
    <div className="relative shrink-0">
      <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="glass-panel flex h-12 items-center gap-2 rounded-full px-5 text-sm font-medium">
        {currentCategoryValue}<motion.span animate={{ rotate: isCategoryOpen ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown className="h-4 w-4" /></motion.span>
      </button>
      <AnimatePresence>
        {isCategoryOpen && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.2 }} className="glass-panel absolute left-0 top-14 z-50 w-44 overflow-hidden rounded-2xl p-2">
            {categoryItems.map((item) => <button key={item} onClick={() => setCurrentCategoryValue(item)} className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${item === currentCategoryValue ? "bg-primary/15 text-primary" : "hover:bg-white/5"}`}>{item}</button>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



function SearchResultRow({ result, index, setPannel }) {
  const navigateTO = useNavigate();
  return (
    <motion.button initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: (index * STAGGER_DELAY_MS) / 1000 }} onClick={()=> {navigateTO(`/find/${result.type}/${result.id}`); setPannel(false)}} className="group/r flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-white/10">
      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2 ring-1 ring-white/10"><img src={result.posterUrl} /></div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{result.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>{result.year ?? "TBA"}</span><span className="h-0.5 w-0.5 rounded-full bg-white/30" />
          <span>★ {result.rating}</span><span className="h-0.5 w-0.5 rounded-full bg-white/30" />
          <span className={`font-medium ${result.type === "tv" ? "text-indigo-400" : "text-primary"}`}>{result.type === "tv" ? "Series" : "Movie"}</span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-white/20 group-hover/r:text-white/60" />
    </motion.button>
  );
}

function SearchEmptyState() {
  return <div className="flex flex-col items-center gap-2 py-10 text-center"><Search className="h-6 w-6 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">No matches</p></div>;
}

function SearchResultsSkeleton() {
  return <div className="flex flex-col gap-1">{[0, 1, 2, 3].map((index) => <div key={index} className="flex items-center gap-3 rounded-2xl p-2"><PosterSkeleton className="h-14 w-10 shrink-0 rounded-lg" /><div className="flex min-w-0 flex-1 flex-col gap-2"><span className="shimmer h-3.5 w-2/3 rounded-full bg-surface-2" /><span className="shimmer h-2.5 w-1/3 rounded-full bg-surface-2" /></div></div>)}</div>;
}




function IconButtonPill({ onClick, isActive, label, children }) {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick} aria-label={label}
      className={`glass-panel relative grid h-12 w-12 place-items-center rounded-full transition-shadow ${isActive ? "ring-1 ring-primary/30" : ""}`}>
      {children}
    </motion.button>
  );
}

function Badge({ count }) {
  return <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-background">{count}</span>;
}

function FilterSelect({ value, options, onChange, label, valueKey = "value" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useDismissOnOutsideClick(dropdownRef, () => setIsOpen(false), isOpen);
  const selectedOption = options.find((option) => String(option[valueKey]) === String(value));
  return (
    <div ref={dropdownRef} className="relative min-w-0">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`flex h-9 w-full items-center justify-between gap-1.5 rounded-xl bg-surface-2/50 px-2.5 text-left text-[11px] font-medium ring-1 ring-white/5 hover:bg-surface-2 ${isOpen ? "ring-primary/40" : ""}`}>
        <span className="min-w-0 truncate"><span className="mr-1 text-muted-foreground/80">{label}:</span>{selectedOption?.label ?? "—"}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /></motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.16 }} className="glass-panel absolute left-0 right-0 top-[calc(100%+6px)] z-[60] max-h-52 overflow-y-auto rounded-2xl bg-neutral-950/98 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.7)]">
            {options.map((option) => {
              const optionValue = option[valueKey]; const isSelected = String(optionValue) === String(value); return (
                <button key={String(optionValue)} type="button" onClick={() => { onChange(optionValue); setIsOpen(false); }} className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-[11px] font-medium transition-colors ${isSelected ? "bg-primary/15 text-primary" : "hover:bg-white/10"}`}>
                  <span className="truncate">{option.label}</span>{isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationRow({ notification, onMarkAsRead }) {
  const config = NOTIFICATION_TYPE_CONFIG[notification.type] ?? NOTIFICATION_TYPE_CONFIG.system;
  const NotificationIcon = config.icon;
  return (
    <motion.button initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} onClick={onMarkAsRead}
      className={`group/n flex w-full items-start gap-3 rounded-2xl p-2.5 text-left hover:bg-white/10 ${notification.isUnread ? "bg-primary/5" : ""}`}>
     <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${config.iconClassName}`}><NotificationIcon className="h-4 w-4" /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><p className="truncate text-sm font-semibold">{notification.title}</p>{notification.isUnread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}</div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">{notification.time}</p>
      </div>
    </motion.button>
  );
}

