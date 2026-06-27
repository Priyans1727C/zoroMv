// src/features/movies/hooks/useMovies.js
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingMovies } from '../api/tmdbService';

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ['trendingMovies'],
    queryFn: fetchTrendingMovies,
    staleTime: 1000 * 60 * 60 , // Data stays fresh for 10 sec
  });
};


