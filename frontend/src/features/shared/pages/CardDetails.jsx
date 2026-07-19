import { useMemo,useEffect } from "react";
import { useParams } from "react-router";
import { HeroSection, DetailInfoSections, EpisodesSection, CastSection,CastSectionTest } from "../components/DetailSectionCard";
import { SLIDES } from "../../../mockData/cardDetail";
import { useFetchById,useFetchCasts } from "../../home/hooks/useHome";
import CommunitySection from "../components/CommunitySection";



export default function MovieDetails() {
    const { id } = useParams();
    const { data, isSuccess,error } = useFetchById("movie", id);
    const {data:casts, isSuccess:isSuccessCasts } = useFetchCasts("movie",id); 

useEffect(() => {
   if (!casts) return;
}, [isSuccessCasts]);
  
  const slide = SLIDES[0];

  if(!isSuccess) return(<>Loading</>)
  return (
    <div className="flex flex-col gap-5 pb-10 sm:gap-6">
      <HeroSection slide={data} />
      <DetailInfoSections slide={data} />
      {/* <EpisodesSection /> */}
      <CommunitySection/>
     {casts&& <CastSectionTest casts={casts}/>}
      {/* {casts&&<CastSection casts={casts}/>} */}
    </div>
  );
}
