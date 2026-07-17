import { GENRES } from "../constants/helper";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const BANNER_IMAGE = "https://image.tmdb.org/t/p/w1920";
export const trendingMapper = (item) => ({
    id: item.id,
    type: item.media_type,
    title: item.title ?? item.name,
    originalTitle: item.original_title ?? item.original_name,
    overview: item.overview,
    posterUrl: item.poster_path ? `${IMAGE_BASE}${item.poster_path}`: null,
    backdropUrl: item.backdrop_path? `${BANNER_IMAGE}${item.backdrop_path}`: null,
    releaseDate: item.release_date ?? item.first_air_date,
    year: (item.release_date ?? item.first_air_date)?.slice(0, 4),
    rating: item.vote_average,
    voteCount: item.vote_count,
    popularity: item.popularity,
    genresIds: item.genre_ids,
    genres: item.genre_ids.map((id) => GENRES[id] ?? id),
    language: item.original_language, 
    adult: item.adult,
    country: item.origin_country ?? []
});