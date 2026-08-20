import { useMemo,useEffect } from "react";
import { useParams } from "react-router";
import { HeroSection, DetailInfoSections, EpisodesSection, CastSection,CastSectionTest } from "../components/DetailSectionCard";
import { SLIDES } from "../../../mockData/cardDetail";
import { useFetchById,useFetchCasts, useFetchTrailer } from "../../home/hooks/useHome";
import CommunitySection from "../components/CommunitySection";



export default function MovieDetails() {
    const { mediaType,  slug } = useParams();
    const id = slug.slice(slug.lastIndexOf("-") + 1);
    const { data, isSuccess,error } = useFetchById(mediaType, id);
    const {data:casts, isSuccess:isSuccessCasts } = useFetchCasts( mediaType,id); 
    const {data:trailer, isSuccess:isSuccessTrailer } = useFetchTrailer( mediaType,id); 

useEffect(() => {
   if (!casts) return;
}, [isSuccessCasts]);
  
  const slide = SLIDES[0];

  if(!isSuccess) return(<>Loading</>)
  if(isSuccess) console.log(data);
  
  return (
    <div className="flex flex-col gap-5 pb-10 sm:gap-6">
      <HeroSection slide={data}  trailer={trailer} />
      <DetailInfoSections slide={data}/>
      {/* <EpisodesSection /> */}
      <CommunitySection/>
     {casts&& <CastSectionTest casts={casts}/>}
      {/* {casts&&<CastSection casts={casts}/>} */}
    </div>
  );
}
