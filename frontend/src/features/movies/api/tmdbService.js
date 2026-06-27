import tmdbApi from "../../../api/axios";

export const fetchTrendingMovies = async () => {
  const { data } = await tmdbApi.get('/trending/movie/day');
  return data.results;
};

