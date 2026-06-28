import tmdbApi from "../../../api/axios";

export const fetchTrendingHome = async (mediaType, time_window = "day") => {
  const { data } = await tmdbApi.get(`/trending/${mediaType}/${time_window}`);
  return data.results;
};


export const fetchMoviesHome = async (category="popular") => {
  const {data} = await tmdbApi.get(`/movie/${category}`);
  return data.results;
}

export const fetchSeriesHome = async (category="popular") => {
  const {data} = await tmdbApi.get(`/tv/${category}`);
  return data.results;
}

