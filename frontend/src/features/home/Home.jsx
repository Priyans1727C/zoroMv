import HeroCarousel from "./components/HeroCarousel";
import CardRail from "../shared/components/CardRail";
import { useTrendingHome,useMoviesHome,useSeriesHome } from "./hooks/useHome";
import { useEffect } from "react";
import { HERO_SLIDES, continueWatching, trendingNow } from "../../mockData/allHomeData";


import { Clock, TrendingUp,Trophy,Star,Tv,Sparkles } from "lucide-react";

export default function Home() {
  const {data: trending, isLoading, isSuccess, error,} = useTrendingHome();
  const {data: popularMovie, isLoading:isLoadingPopularMovie, isSuccess:isSuccessPopularMovie,} = useMoviesHome();
  const {data: topRatedMovie, isLoading:isLoadingTopRatedMovie, isSuccess:isSuccessTopRatedMovie,} = useMoviesHome("top_rated");
  const {data: popularSeries, isLoading:isLoadingPopularSeries, isSuccess:isSuccessPopularSeries,} = useSeriesHome("popular");
  const {data: topRatedSeries, isLoading:isLoadingTopRatedSeries, isSuccess:isSuccessTopRatedSeries,} = useSeriesHome("top_rated");
  useEffect(() => {
    if (isSuccess) {
      // console.log("mockdata:",HERO_SLIDES)
      console.log("Trending:", trending);
    }
    if(isSuccessTopRatedMovie){
      console.log("TopRatedMovie", topRatedMovie)
    }
  }, [trending,topRatedMovie,isSuccess,isSuccessTopRatedMovie]);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Carousel */}
      {isSuccess && <HeroCarousel slides={trending?.slice(0, 12) } />}
      {isSuccess &&  <CardRail title="Continue Watching" icon={Clock} items={continueWatching} cardVariant="continue" delay={0}/>}
      {isSuccess &&  <CardRail title="Top 10 Today" icon={Trophy} items={trending} cardVariant="numbered" delay={0.05}/>}
      {isSuccess &&  <CardRail title="Trending Now" icon={TrendingUp} items={trending} cardVariant="poster" />}
      {isSuccessPopularMovie &&  <CardRail title="Popular Movies" icon={Sparkles} items={popularMovie} cardVariant="poster" />}
      {isSuccessTopRatedMovie &&  <CardRail title="Top Rated Movies" icon={Star} items={topRatedMovie} cardVariant="poster" />}
      {isSuccessPopularSeries &&  <CardRail title="Popular Series" icon={Sparkles} items={popularSeries} cardVariant="poster" />}
      {isSuccessTopRatedSeries &&  <CardRail title="Top Rated Series" icon={Tv} items={topRatedSeries} cardVariant="poster" />}

    </div>
  );
}


