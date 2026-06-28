import { useQuery } from "@tanstack/react-query";
import { fetchTrendingHome ,fetchMoviesHome, fetchSeriesHome } from "../api/tmdbService";


// type: "all|movie|"tv"   ,       time_window: "day|week"
export const useTrendingHome = (mediaType="movie",time_window="day") => {
  return useQuery({
    queryKey: ['trending',mediaType],  
    queryFn: () =>  fetchTrendingHome(mediaType,time_window),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });
};


export const useMoviesHome = (type="popular") => {
  return useQuery({
    queryKey: ['movies', type],
    queryFn: () => fetchMoviesHome(type),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  })
};

export const useSeriesHome = (type="popular") => {
  return useQuery({
    queryKey: ['series',type],
    queryFn: () => fetchSeriesHome(type),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  })
};


