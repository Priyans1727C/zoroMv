// src/features/movies/hooks/useMovies.js
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingMovies,fetchCategoriesMovies,fetchSearchMovies, fetchMovieDetails,fetchMoviesRecommendations } from '../api/tmdbService';

export const useTrendingMovies = (page=1) =>{
  return useQuery({
    queryKey: ['trendingMovies',page],
    queryFn: () => fetchTrendingMovies(page),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 10 * 3,
  })
};

export const useCategoriesMovies = (category="popular",page=1) => {
  return useQuery({
    queryKey: ['movies',category,page],
    queryFn: () => fetchCategoriesMovies(category,page),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 10 * 3,

  })
};

export const useMoviesDetails = (movieId) => {
  return useQuery({
    queryKey: ['movieDetails',movieId],
    queryFn: () => fetchMovieDetails(movieId),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 10 * 3,
  })
};

export const useMoviesRecommendations = (movieId,page=1) => {
  return useQuery({
    queryKey: ['movieRecommendations',page],
    queryFn: () => fetchMoviesRecommendations(movieId,page),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 10 * 3,
  })
};


export const useSearchMovies = (input,page=1) => {
  return useQuery({
    queryKey: ['search',input],
    queryFn: () => featchSearchMovies(input,page),
    staleTime: 1000 * 60,
    gcTime: 1000 *10 ,
  })
};


