import { useQuery } from "@tanstack/react-query";
import { fetchTrendingHome ,fetchMoviesHome, fetchSeriesHome, featchSearchHome,fetchById, fetchCasts, fetchSeasonEpisodes, fetchTrailer } from "../api/tmdbService";
import { fetchTrendingByPage, fetchMoviesByPage, fetchSeriesByPage } from "../api/tmdbService";
import { trendingMapper,searchMapper } from "../../shared/mapper/home";
import { cardDetailMapper,castMapper,episodeMapper } from "../../shared/mapper/shared";

// type: "all|movie|"tv"   ,       time_window: "day|week"
export const useTrendingHome = (mediaType="movie",time_window="day") => {
  return useQuery({
    queryKey: ['trending',mediaType],  
    queryFn: () =>  fetchTrendingHome(mediaType,time_window),
    select: (response) => response.results.map(trendingMapper),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });
};

//
export const useMoviesHome = (category="popular") => {
  return useQuery({
    queryKey: ['movies', category],
    queryFn: () => fetchMoviesHome(category),
    select: (response) => (response?.results ?? []).map((item) => trendingMapper(item, "movie")),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  })
};

export const useSeriesHome = (category="popular") => {
  return useQuery({
    queryKey: ['series',category],
    queryFn: () => fetchSeriesHome(category),
    select: (response) => (response?.results ?? []).map((item) => trendingMapper(item, "tv")),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  })
};

export const useSearchHome = (input, page = 1) => {
  return useQuery({
    queryKey: ["search", input, page],

    queryFn: () => featchSearchHome(input, page),

    enabled: Boolean(input?.trim()),

    select: (response) =>
      (response?.results ?? []).map(searchMapper),

    staleTime: 60_000,
    gcTime: 60_000,
  });
};

// mediaType: "movie"|"tv"   
export const useFetchById = (mediaType,id) => {
  return useQuery({
    queryKey:['search',mediaType,id],
    queryFn: () => fetchById(mediaType,id),
    select: (response) => cardDetailMapper(response, mediaType),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60,
  })
}


export const useFetchCasts = (mediaType,id) => {
  return useQuery({
    queryKey:['casts',mediaType,id],
    queryFn: () => fetchCasts(mediaType,id),
    select: (response) => response.cast.map(castMapper),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60,
  })
}


export const useFetchSeasonEpisodes = (id,season,isSeries = true) => {
  return useQuery({
    queryKey:['Episodes',id,season],
    queryFn: () => fetchSeasonEpisodes(id,season),
    select: (response) => response.episodes.map(episodeMapper),
    enabled: !!season && isSeries,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60,
  })
}







//by pa
export const useTrendingByPage = (mediaType = "movie", time_window = "day",page = 1) => {
  return useQuery({
    queryKey: ["trending", mediaType, time_window, page],
    queryFn: () => fetchTrendingByPage(mediaType, time_window, page),
    // placeholderData: (previousData) => previousData, // keep previous page while loading
    select: (response) => ({
      ...response,
      results: response.results.map(trendingMapper),
    }),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });
};

// Movies
export const useMoviesByPage = ( category = "popular", page = 1
) => {
  return useQuery({
    queryKey: ["movies", category, page],
    queryFn: () => fetchMoviesByPage(category, page),
    placeholderData: (previousData) => previousData,
    select: (response) => ({
      ...response,
      results: (response.results ?? []).map((item) =>
        trendingMapper(item, "movie")
      ),
    }),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });
};

// TV Series
export const useSeriesByPage = ( category = "popular", page = 1
) => {
  return useQuery({
    queryKey: ["series", category, page],
    queryFn: () => fetchSeriesByPage(category, page),
    placeholderData: (previousData) => previousData,
    select: (response) => ({
      ...response,
      results: (response.results ?? []).map((item) =>
        trendingMapper(item, "tv")
      ),
    }),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });
};


export const useSearchByPage = (input, page = 1) => {
  return useQuery({
    queryKey: ["search", input, page],

    queryFn: () => featchSearchHome(input, page),

    enabled: Boolean(input?.trim()),

    select: (response) => ({
      ...response,
      results: (response.results ?? []).map((item) =>
        searchMapper(item)
      ),
    }),
    // select: (response) =>
    //   (response?.results ?? []).map(searchMapper),

    staleTime: 60_000,
    gcTime: 60_000,
  });
};



export const useFetchTrailer = (mediaType,id) => {
  return useQuery({
    queryKey:['trailer',mediaType,id],
    queryFn: () => fetchTrailer(mediaType,id),
    select: (response) => response.results.find(
                                              (video) =>
                                                video.type === 'Trailer' &&
                                                video.official === true &&
                                                video.site === 'YouTube'
                          ) ?? null,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60,
  })
}