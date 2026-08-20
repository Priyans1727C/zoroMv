import HeroCarousel from "./components/HeroCarousel";
import CardRail from "../shared/components/CardRail";
import { useTrendingHome,useMoviesHome,useSeriesHome } from "./hooks/useHome";
import { useEffect,useMemo } from "react";
import { HERO_SLIDES, continueWatching, trendingNow } from "../../mockData/allHomeData";
import CommunitySection from "../shared/components/CommunitySection";

import { HeroSkeleton } from "../shared/components/LazyLoading";
import useContinueWatching from "../shared/hooks/usePlayer";


import { Clock, TrendingUp,Trophy,Star,Tv,Sparkles } from "lucide-react";

export default function Home() {
   const { getSorted } = useContinueWatching();
  const continueItems = useMemo(() => getSorted(), [getSorted]);
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


  if(continueItems) console.log(continueItems);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Carousel */}
      {isSuccess? <HeroCarousel slides={trending?.slice(0, 12) } />:<HeroSkeleton/>}
      {isSuccess && continueItems.length>3 &&  <CardRail title="Continue Watching" icon={Clock} items={continueItems} cardVariant="continue" delay={0} seeAllHref="/browse/trending" />}
      {isSuccess &&  <CardRail title="Top 10 Today" icon={Trophy} items={trending} cardVariant="numbered" delay={0.05} seeAllHref="/browse/trending" />}
      <CommunitySection/>
      {isSuccess &&  <CardRail title="Trending Now" icon={TrendingUp} items={trending} cardVariant="poster" seeAllHref="/browse/trending" seeAllHref="/browse/trending" />}
      {isSuccessPopularMovie &&  <CardRail title="Popular Movies" icon={Sparkles} items={popularMovie} cardVariant="poster" seeAllHref="/browse/popular_movies" />}
      {isSuccessTopRatedMovie &&  <CardRail title="Top Rated Movies" icon={Star} items={topRatedMovie} cardVariant="poster" seeAllHref="/browse/top_rated_movies" />}
      {isSuccessPopularSeries &&  <CardRail title="Popular Series" icon={Sparkles} items={popularSeries} cardVariant="poster" seeAllHref="/browse/popular_series" />}
      {isSuccessTopRatedSeries &&  <CardRail title="Top Rated Series" icon={Tv} items={topRatedSeries} cardVariant="poster" seeAllHref="/browse/top_rated_series" />}

    </div>
  );
}


