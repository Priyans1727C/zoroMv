import tmdbApi from "../../../api/axios";

export const fetchTrendingMovies = async (page=1) => {
  const {data} = await tmdbApi.get(`/trending/movie/day`,{params:{page:page}});
  return data.results;
};

export const fetchCategoriesMovies = async (category="popular",page=1) => {
  const {data} = await tmdbApi.get(`/movie/${category}`,{params:{page:page}});
  return data.results;
};

export const fetchMovieDetails = async (movieId) => {
  const {data} = await tmdbApi.get(`/movie/${movieId}`);
  return data.results;
};

export const fetchMoviesRecommendations = async (movieId,page=1) => {
  const {data} = await tmdbApi.get(`/movie/${movieId}/recommendations`,{params:{page:page}});
  return data.results;
};


export const fetchSearchMovies = async (input,page=1) => {
  const {data} = await tmdbApi.get(`/search/movie`,{params:{ query:input,page:page}});
  return data.results;
};
