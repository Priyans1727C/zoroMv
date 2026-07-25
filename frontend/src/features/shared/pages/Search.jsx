import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Rows3, RotateCcw } from "lucide-react";
import { MediaCard } from "../components/MediaRow";
import { Skeleton, PosterSkeleton } from "../components/Skeleton";
import { TRENDING, NEW_RELEASES, TOP_RATED } from "../../../mockData/allHomeData";;

/* ─── Filter data (same matrix values) ─── */
const GENRES = [
  { id: 28, name: "Action" }, { id: 878, name: "Sci-Fi" }, { id: 18, name: "Drama" },
  { id: 53, name: "Thriller" }, { id: 35, name: "Comedy" }, { id: 99, name: "Documentary" },
  { id: 27, name: "Horror" }, { id: 16, name: "Animation" },
];
const GENRE_NAME = Object.fromEntries(GENRES.map((g) => [g.id, g.name]));

const CATALOGUE = [
  ...TRENDING.map((m, i) => ({ ...m, id: `tr-${i}`, type: m.meta.includes("Series") ? "tv" : "movie",
    genreIds: m.meta.includes("Drama") ? [18, 53] : [878, 18], year: Number(m.meta.split("·")[1]?.trim()) || 2024,
    lang: "en", adult: false, popularity: 98.4 - i * 4 })),
  ...NEW_RELEASES.map((m, i) => ({ ...m, id: `nr-${i}`, type: m.meta.includes("Series") ? "tv" : "movie",
    genreIds: m.title.includes("Orbit") ? [878, 28] : [18, 99], year: Number(m.meta.split("·")[1]?.trim()) || 2026,
    lang: i % 3 === 0 ? "ja" : i % 4 === 0 ? "ko" : "en", adult: false, popularity: 92.1 - i * 3 })),
  ...TOP_RATED.map((m, i) => ({ ...m, id: `tp-${i}`, type: m.meta.includes("Series") ? "tv" : "movie",
    genreIds: m.meta.includes("Drama") ? [18] : [28, 53], year: Number(m.meta.split("·")[1]?.trim()) || 2023,
    lang: i % 4 === 0 ? "fr" : "en", adult: false, popularity: 88.7 - i * 2.5 })),
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const mediaType = (searchParams.get("mediaType") === "movie" || searchParams.get("mediaType") === "tv")
    ? searchParams.get("mediaType") : "all";
  const sortOptions = [{ value: "popularity.desc", label: "Most popular" }, { value: "vote_average.desc", label: "Highest rated" }, { value: "primary_release_date.desc", label: "Newest first" }];
  const sortBy = sortOptions.find((s) => s.value === searchParams.get("sort")) ? searchParams.get("sort") : "popularity.desc";
  const yearOptions = [{ value: "all", label: "Any" }, { value: "2026", label: "2026" }, { value: "2025", label: "2025" }, { value: "2024", label: "2024" }, { value: "2023", label: "2023" }, { value: "2022", label: "2022" }];
  const releaseYear = yearOptions.find((y) => y.value === searchParams.get("year")) ? searchParams.get("year") : "all";
  const voteAverageGte = ["0", "6", "7", "8"].includes(searchParams.get("rating") ?? "") ? Number(searchParams.get("rating")) : 0;
  const originalLanguage = searchParams.get("lang") ?? "all";
  const includeAdult = searchParams.get("adult") === "true";
  const selectedGenres = (searchParams.get("genres") ?? "").split(",").filter(Boolean).map(Number);

  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 420);
    return () => clearTimeout(t);
  }, [query, mediaType, sortBy, selectedGenres.length, releaseYear, voteAverageGte, originalLanguage, includeAdult]);

  const results = useMemo(() => {
    let pool = CATALOGUE;
    if (mediaType !== "all") pool = pool.filter((m) => m.type === mediaType);
    const q = query.trim().toLowerCase();
    if (q) pool = pool.filter((m) =>
      m.title.toLowerCase().includes(q) || m.meta.toLowerCase().includes(q) || (m.tag ?? "").toLowerCase().includes(q)
    );
    if (selectedGenres.length > 0) pool = pool.filter((m) => m.genreIds?.some((g) => selectedGenres.includes(g)));
    if (releaseYear !== "all") pool = pool.filter((m) => m.year === Number(releaseYear));
    if (voteAverageGte > 0) pool = pool.filter((m) => Number(m.rating) >= voteAverageGte);
    if (originalLanguage !== "all") pool = pool.filter((m) => m.lang === originalLanguage);
    const s = [...pool];
    if (sortBy === "popularity.desc") s.sort((a, b) => b.popularity - a.popularity);
    else if (sortBy === "vote_average.desc") s.sort((a, b) => Number(b.rating) - Number(a.rating));
    else if (sortBy === "primary_release_date.desc") s.sort((a, b) => b.year - a.year);
    return s;
  }, [query, mediaType, sortBy, selectedGenres, releaseYear, voteAverageGte, originalLanguage, includeAdult]);

  const activeFilters = useMemo(() => {
    const list = [];
    if (mediaType !== "all") list.push({ key: "type", label: "Type: " + (mediaType === "movie" ? "Movie" : "Series") });
    selectedGenres.forEach((g) => list.push({ key: `g-${g}`, label: "Genre: " + GENRE_NAME[g] }));
    if (releaseYear !== "all") list.push({ key: "year", label: "Year: " + releaseYear });
    if (voteAverageGte > 0) list.push({ key: "rate", label: `Rating: ${voteAverageGte}+` });
    if (originalLanguage !== "all") list.push({ key: "lang", label: `Lang: ${originalLanguage}` });
    if (includeAdult) list.push({ key: "adult", label: "Mature" });
    return list;
  }, [mediaType, selectedGenres, releaseYear, voteAverageGte, originalLanguage, includeAdult]);

  return (
    <div className="min-w-0 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm">
          <span className="font-bold">{loading ? "—" : results.length}</span>
          <span className="text-muted-foreground"> titles</span>
        </p>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex gap-1 rounded-xl bg-surface-2/40 p-1 ring-1 ring-white/5">
            {[
              { k: "grid", Icon: LayoutGrid },
              { k: "list", Icon: Rows3 },
            ].map(({ k, Icon }) => (
              <button
                key={k}
                onClick={() => setView(k)}
                className={`grid h-7 w-7 place-items-center rounded-lg transition-colors ${
                  view === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active applied filter tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Applied:</span>
          {activeFilters.map((f) => (
            <span key={f.key} className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/20">
              {f.label}
            </span>
          ))}
        </div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={view === "grid" ? "grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4" : "space-y-3"}
          >
            {Array.from({ length: view === "grid" ? 8 : 5 }).map((_, i) =>
              view === "grid" ? (
                <div key={i} className="space-y-2.5">
                  <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
                  <Skeleton className="h-3.5 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-1/2 rounded-full" />
                </div>
              ) : (
                <div key={i} className="glass-panel flex items-center gap-4 rounded-2xl p-3">
                  <Skeleton className="h-24 w-16 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2.5">
                    <Skeleton className="h-4 w-1/3 rounded-full" />
                    <Skeleton className="h-3 w-1/2 rounded-full" />
                    <Skeleton className="h-3 w-2/3 rounded-full" />
                  </div>
                </div>
              )
            )}
          </motion.div>
        ) : results.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-panel flex flex-col items-center gap-3 rounded-3xl py-20 text-center"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-2xl">🔍</span>
            <p className="text-lg font-bold">Nothing matched</p>
            <p className="max-w-sm text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </motion.div>
        ) : view === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4"
          >
            {results.map((item, i) => (
              <div key={item.id} className="[&>div]:!w-full">
                <MediaCard item={item} index={i} />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {results.map((item, i) => (
              <ListRow key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
