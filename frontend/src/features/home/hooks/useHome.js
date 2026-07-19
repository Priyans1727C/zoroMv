import { useQuery } from "@tanstack/react-query";
import { fetchTrendingHome ,fetchMoviesHome, fetchSeriesHome, featchSearchHome,fetchById, fetchCasts } from "../api/tmdbService";
import { trendingMapper } from "../../shared/mapper/home";
import { cardDetailMapper,castMapper } from "../../shared/mapper/shared";

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
    select: (response) => response.results.map(trendingMapper),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  })
};

export const useSeriesHome = (category="popular") => {
  return useQuery({
    queryKey: ['series',category],
    queryFn: () => fetchSeriesHome(category),
    select: (response) => response.results.map(trendingMapper),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  })
};

export const useSearchHome = (input,page=1) => {
  return useQuery({
    queryKey:['search',page],
    queryFn: () => featchSearchHome(input,page),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60,
  })
}

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


