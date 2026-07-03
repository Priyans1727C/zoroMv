import tmdbApi from "../../../api/axios";

export const fetchTrendingSeries = async (page=1,time_window="day") => {
    const {data} = await tmdbApi.get(`/trending/tv/${time_window}`,{params:{page:page}});
    return data.results;
};

export const fetchCategoriesSeries = async (category="popular",page=1) => {
    const {data} = await tmdbApi.get(`/tv/${category}`,{parms:{page:page}});
    return data.results;
};

export const fetchSeriesDetails = async (seriesId) => {
    const { data } = await tmdbApi.get(`/tv/${seriesId}`);
    return data;
};

export const fetchSeriesRecommendations = async (seriesId, page = 1) => {
    const { data } = await tmdbApi.get(`/tv/${seriesId}/recommendations`, { params: { page } });
    return data.results;
};

export const fetchSearchSeries = async (query, page = 1) => {
    const { data } = await tmdbApi.get(`/search/tv`, { params: { query, page } });
    return data.results;
};
