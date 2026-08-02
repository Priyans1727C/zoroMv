import { Star, Tv, Clock } from "lucide-react";
import { GENRES } from "../constants/helper";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const BANNER_IMAGE = "https://image.tmdb.org/t/p/w1920";
const EPISODE_POSTER= "https://image.tmdb.org/t/p/w227_and_h127_face"





export const cardDetailMapper = (item,media_type="movie") => ({
    id: item.id,
    type: item.media_type ??media_type ,
    title: item.title ?? item.name,
    originalTitle: item.original_title ?? item.original_name,
    overview: item.overview,
    posterUrl: item.poster_path ? `${IMAGE_BASE}${item.poster_path}`: null,
    backdropUrl: item.backdrop_path? `${BANNER_IMAGE}${item.backdrop_path}`: null,
    releaseDate: item.release_date ?? item.first_air_date,
    year: (item.release_date ?? item.first_air_date)?.slice(0, 4),
    rating: item.vote_average?.toFixed(1),
    voteCount: item.vote_count,
    popularity: item.popularity,
    genresIds: item.genres?.map((genre) => genre.id) ?? [],
    genres:  item.genres?.map((genre) => genre.name) ??item.genre_ids?.map((id) => GENRES[id] ?? id) ??[],
    language: item.original_language, 
    adult: item.adult,
    country: item.origin_country ?? [],
    runtime: item.runtime ?? 0 , //  `${Math.floor(item.runtime / 60)}h ${(item.runtime % 60).toString().padStart(2, "0")}m`: "N/A",
    userScore: Math.round(item.vote_average * 10),

     seasonList: (item.seasons ?? []).sort((a, b) => a.season_number - b.season_number).filter((season) => season.season_number > 0)
                                                .map((season) => ({
                                                id: season.id,
                                                seasonNumber: season.season_number,
                                                name: season.name,
                                                posterUrl: season.poster_path
                                                    ? `${IMAGE_BASE}${season.poster_path}`
                                                    : null,
                                                episodeCount: season.episode_count,
                                                })),

                                                
    stats: [
        { k: "Budget", v: item.budget ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(item.budget) : "N/A" },
        { k: "Revenue", v: item.revenue ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(item.revenue) : "N/A" },
        { k: "Language", v: new Intl.DisplayNames(["en"], { type: "language" }).of(item.original_language) ?? item.original_language,},
        { k: "Released", v: (item.release_date ?? item.first_air_date)? new Date(item.release_date ?? item.first_air_date).toLocaleDateString("en-US", {month: "short",year: "numeric",}): "N/A", },
    ],

    movieMeta: [
        { icon: Star, label: item.vote_average?.toFixed(1), primary: true },
        { icon: Tv, label: (item.media_type ?? media_type).replace(/^./, c => c.toUpperCase())},
        { icon: Clock, label: item.runtime?`${Math.floor(item.runtime / 60)}h ${(item.runtime % 60).toString().padStart(2, "0")}m`: "N/A",},
    ],
    
    scoreBreakdown: [
        { k: "Source", v: "tmdb" },
        { k: "Voters", v: item.vote_count },
        { k: "TMDB_ID", v: item.id},
    ],



});


export const episodeMapper = (item) => ({
    id: item.id,
    episodeNumber: item.episode_number,
    name: item.name,
    overview: item.overview,
    runtime: item.runtime,
    episodePosterUrl: item.still_path ? `${EPISODE_POSTER}${item.still_path}`: null,   
    watched: false,
});



export const castMapper = (cast) => ({
    id: cast.id,
    name: cast.name,
    gender: cast.gender,
    role: cast.known_for_department,
    character: cast.character,
    profileImageUrl: cast.profile_path? `${IMAGE_BASE}${cast.profile_path}`: null,
});



