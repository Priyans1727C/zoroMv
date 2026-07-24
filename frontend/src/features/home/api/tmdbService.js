import tmdbApi from "../../../api/axios";

export const fetchTrendingHome = async (mediaType, time_window = "day") => {
  const { data } = await tmdbApi.get(`/trending/${mediaType}/${time_window}`);
  return data;
};


export const fetchMoviesHome = async (category="popular") => {
  const {data} = await tmdbApi.get(`/movie/${category}`);
  return data;
}

export const fetchSeriesHome = async (category="popular") => {
  const {data} = await tmdbApi.get(`/tv/${category}`);
  return data;
}

export const featchSearchHome = async (input,page=1) => {
  const {data} = await tmdbApi.get(`search/multi`,{params:{query:input,page:page}});
  return data;
}

export const fetchById = async (mediaType,id) => {
  const {data} = await tmdbApi.get(`/${mediaType}/${id}`);
  return data;
}


export const fetchCasts = async (mediaType,id) => {
  const {data} = await tmdbApi.get(`/${mediaType}/${id}/credits`);
  return data;
}


export const fetchSeasonEpisodes= async (id,s=1) => {
  const {data} = await tmdbApi.get(`/tv/${id}/season/${s}`);
  return data;
}