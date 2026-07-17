import HeroCarousel from "./components/HeroCarousel";
import { useTrendingHome } from "./hooks/useHome";
import { useEffect } from "react";
import { HERO_SLIDES } from "../../mockData/allHomeData";

export default function Home() {
  const {data: trending, isLoading, isSuccess, error,} = useTrendingHome();

  useEffect(() => {
    if (isSuccess) {
      console.log("mockdata:",HERO_SLIDES)
      console.log("Trending:", trending);
    }
  }, [isSuccess, trending]);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Carousel */}
      {
        isSuccess &&
        <HeroCarousel slides={trending?.slice(0, 12) } />
      }

      {/* <HeroCarousel slides={HERO_SLIDES.slice(0, 7) } /> */}


    </div>
  );
}


