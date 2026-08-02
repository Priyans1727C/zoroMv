import { useEffect, useState } from "react";
import { useParams,useSearchParams } from "react-router";
import GridPage from "../components/GridPage";
import { applyPersonFilter } from "../../../layouts/components/topbarHelper";

import { useTrendingByPage, useMoviesByPage, useSeriesByPage, useSearchByPage} from "../../home/hooks/useHome";

const CONFIG = {
  trending_now: {
    title: "Trending Now",
    subtitle:
      "The most watched movies and series across ZoroMv this week — updated in real time.",
    query: (page) => useTrendingByPage("all", "week", page),
  },

  popular_movies: {
    title: "Popular Movies",
    subtitle:
      "Blockbuster films and fan favorites that are trending with movie lovers.",
    query: (page) => useMoviesByPage("popular", page),
  },

  top_rated_movies: {
    title: "Top Rated Movies",
    subtitle:
      "Critically acclaimed movies with outstanding ratings and unforgettable stories.",
    query: (page) => useMoviesByPage("top_rated", page),
  },

  popular_series: {
    title: "Popular Series",
    subtitle:
      "Binge-worthy TV shows everyone is talking about.",
    query: (page) => useSeriesByPage("popular", page),
  },

  top_rated_series: {
    title: "Top Rated Series",
    subtitle:
      "Award-winning and fan-favorite series.",
    query: (page) => useSeriesByPage("top_rated", page),
  },

  search_all: {
    title: "Search Result for ",
    subtitle:
      "Try correct movie/series title spelling for getting accurate results ",
    query: (searchQuery,page) => useSearchByPage(searchQuery, page),
    // query: (searchQuery,page) => useSeriesByPage("top_rated", page),
  }


};

export default function Browse() {
  const { category} = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search_query");
  const [genreFilter, setGenreFilter] = useState(null);

  const config = CONFIG[category] ?? CONFIG.trending_now;

  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPage, setTotalPage] = useState(1);

  const query = searchQuery?config.query(searchQuery,page):config.query(page); 

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [category,searchQuery]);

  useEffect(() => {
    if (!query.data?.results) return;

    const filter_data  = searchQuery&&query.data? applyPersonFilter(query.data.results,genreFilter):query.data.results;
    if (page === 1) {
      setItems(filter_data);
      setTotalPage(query.data?.total_pages);
    } else {
      setItems((prev) => [...prev, ...filter_data]);
    }
  }, [query.data, page,genreFilter]);


  return (
    <GridPage
      title={config.title + (searchQuery?`"${searchQuery}"`:"")}
      subtitle={config.subtitle}
      items={items}
      page={page}
      totalPages={totalPage}
      loading={query.isFetching}
      onLoadMore={() => setPage((p) => p + 1)}
      setGenreFilter= {setGenreFilter}
      genreFilter={genreFilter}
    />
  );
}