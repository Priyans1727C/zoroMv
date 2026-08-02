import { BadgeCheck, Bell, Check, CheckCheck, ChevronDown, ChevronRight, Clock, Film, Loader2, Search, SlidersHorizontal, Users, X } from "lucide-react";


export const FILTER_OPTIONS = {
  genres: [{ id: 28, name: "Action" }, { id: 878, name: "Sci-Fi" }, { id: 18, name: "Drama" }, { id: 53, name: "Thriller" }, { id: 35, name: "Comedy" }, { id: 99, name: "Documentary" }, { id: 27, name: "Horror" }, { id: 16, name: "Animation" }],
  sort: [{ value: "none", label: "None" },{ value: "popularity.desc", label: "Most popular" }, { value: "vote_average.desc", label: "Highest rated" }, { value: "primary_release_date.desc", label: "Newest first" }, { value: "primary_release_date.asc", label: "Oldest first" }],
  type: [{ value: "all", label: "All" }, { value: "movie", label: "Movie" }, { value: "tv", label: "Series" }],
  year: [{ value: "all", label: "Any year" }, { value: "2026", label: "2026" }, { value: "2025", label: "2025" }, { value: "2024", label: "2024" }, { value: "2023", label: "2023" }, { value: "2022", label: "2022" }],
  rating: [{ value: 0, label: "Any" }, { value: 6, label: "6+" }, { value: 7, label: "7+" }, { value: 8, label: "8+" }],
  language: [{ code: "all", label: "Any" }, { code: "en", label: "English" }, { code: "ja", label: "Japanese" }, { code: "ko", label: "Korean" }, { code: "fr", label: "French" }, { code: "es", label: "Spanish" }]
};

export const DEFAULT_FILTERS = { type: "all", rating: 0, year: "all", sort: "none", lang: "all", genre: null,adult: false,};

export function countActiveFilters(f){
    return (
    (f.genre ? 1 : 0) + (f.sort !== "none" ? 1 : 0) +
    (f.type !== "all" ? 1 : 0) +
    (f.rating > 0 ? 1 : 0) + (f.year !== "all" ? 1 : 0) +
    (f.lang !== "all" ? 1 : 0) + (f.adult ? 1 : 0)
  );
}


export function applyFilter(cF,items){
    console.log("filter: is called");
    items = items.filter((i) => i.type !== "person")
    if (cF.genre) items = items.filter((i) => i.genresIds?.includes(cF.genre));
    if (cF.type !== "all") items = items.filter((i) => i.type === cF.type);
    if (cF.year !== "all") items = items.filter((i) => Number(i.year) === Number(cF.year));
    if (cF.rating > 0) items = items.filter( (i) => Number(i.rating) >= Number(cF.rating));
    return items;
    
}


export function applyPersonFilter(items, genre = null) {
  return items
    .filter(item => item.type !== "person")
    .filter(item => genre == null || item.genresIds?.includes(genre));
}






//notification logic


export const NOTIFICATION_TYPE_CONFIG = {
  release: { icon: Film, iconClassName: "bg-primary/15 text-primary" },
  reminder: { icon: Clock, iconClassName: "bg-amber-400/15 text-amber-300" },
  social: { icon: Users, iconClassName: "bg-indigo-400/15 text-indigo-300" },
  system: { icon: BadgeCheck, iconClassName: "bg-emerald-400/15 text-emerald-300" },
};
export const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "release", title: "Severance · S2 E8", message: "Mid-season finale just landed.", time: "2m", isUnread: true, hasPoster: true },
  { id: 2, type: "reminder", title: "Chernobyl · Ep 3", message: "36 min left.", time: "1h", isUnread: true, hasPoster: true },
  { id: 3, type: "social", title: "nova_reels replied", message: "That third act reframes everything.", time: "3h", isUnread: true, hasPoster: false },
  { id: 4, type: "release", title: "The Long Dark · S2", message: "New season streaming in 4K.", time: "1d", isUnread: false, hasPoster: true },
  { id: 5, type: "system", title: "Premium 4K on", message: "Dolby Atmos enabled.", time: "2d", isUnread: false, hasPoster: false },
];