import { useQuery } from "@tanstack/react-query";
import { fetchTrendingSeries, fetchCategoriesSeries,fetchSeriesDetails,fetchSeriesRecommendations,fetchSearchSeries } from "../api/tmdbService";


export const useTrendingSeries = (page=1,time_window="day") => {
    return useQuery({
        queryKey: ['trendingSeries',page],
        queryFn: () => fetchTrendingSeries(page,time_window),
        staleTime: 1000 * 60 * 3,
        gcTime: 1000 * 10 * 3,
    })
};

export const useCategoriesSeries = (category="popular",page=1) =>{
    return useQuery({
        queryKey: ['Series',category,page],
        queryFn: () => fetchCategoriesSeries(category,page),
        staleTime: 1000 * 60 * 3,
        gcTime: 1000 * 10 * 3,
    })
};

export const useSeriesDetails = (seriesId) => {
    return useQuery({
        queryKey: ['seriesDetails', seriesId],
        queryFn: () => fetchSeriesDetails(seriesId),
        enabled: !!seriesId, 
        staleTime: 1000 * 60 * 10,
    });
};

export const useSeriesRecommendations = (seriesId, page = 1) => {
    return useQuery({
        queryKey: ['seriesRecommendations', seriesId, page],
        queryFn: () => fetchSeriesRecommendations(seriesId, page),
        enabled: !!seriesId,
        staleTime: 1000 * 60 * 5,
    });
};

export const useSearchSeries = (query, page = 1) => {
    return useQuery({
        queryKey: ['searchSeries', query, page],
        queryFn: () => fetchSearchSeries(query, page),
        enabled: !!query,
        staleTime: 1000 * 30,
    });
};