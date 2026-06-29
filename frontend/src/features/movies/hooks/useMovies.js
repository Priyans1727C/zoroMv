// src/features/movies/hooks/useMovies.js
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingMovies,fetchCategoriesMovies,featchSearchMovies } from '../api/tmdbService';

export const useTrendingMovies = (page=1) =>{
  return useQuery({
    queryKey: ['trendingMovies',page],
    queryFn: () => fetchTrendingMovies(page),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 ,
  })
};

export const useCategoriesMovies = (category="popular",page=1) => {
  return useQuery({
    queryKey: ['movies',category,page],
    queryFn: () => fetchCategoriesMovies(category,page),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 ,

  })
};

export const useSearchMovies = (input,page=1) => {
  return useQuery({
    queryKey: ['search',input],
    queryFn: () => featchSearchMovies(input,page),
    gcTime: 1000 *10 ,
  })
};


