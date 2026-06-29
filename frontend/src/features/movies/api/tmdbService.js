import tmdbApi from "../../../api/axios";

export const fetchTrendingMovies = async (page=1) => {
  const {data} = await tmdbApi.get(`/trending/movie/day`,{params:{page:page}});
  return data.results;
};

export const fetchCategoriesMovies = async (category="popular",page=1) => {
  const {data} = await tmdbApi.get(`/movie/${category}`,{params:{page:page}});
  return data.results;
};

export const featchSearchMovies = async (input,page=1) => {
  const {data} = await tmdbApi.get(`/search/movie`,{params:{ query:input,page:page}});
  return data.results;
}
