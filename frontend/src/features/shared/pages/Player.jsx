import { useState } from "react";
import { useParams } from "react-router";
import { VideoFrame, ServerSelector, EpisodesSection } from "../components/PlayerCards";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";


export default function Player() {
    const { mediaType, slug } = useParams();
    const containerRef = useRef(null);

    // Track scroll progress within the container
    const { scrollYProgress } = useScroll({
        container: containerRef,
    });
    return (
        <>


        <div className="relative h-[400px] sm:h-[500px] lg:h-[515px] flex flex-col overflow-y-auto rounded-2xl border border-white/5 sm:rounded-[2rem] snap-y snap-mandatory">

                {/* Video Section */}
                <section className="h-full w-full flex-none snap-start">
                    <VideoFrame source={slug} mediaType={mediaType} />
                </section>

                {/* Episodes Section */}
                {/* Add h-full to ensure it matches the container height when snapped */}
                <section className="h-full w-full flex-none snap-start overflow-hidden">
                    <EpisodesSection />
                </section>

                </div>

            <ServerSelector />
            <div className="top-0">
                <EpisodesSection />
            </div>


        </>
    );
}





// import { useState } from "react";
// import { useParams } from "react-router";
// import { VideoFrame, ServerSelector, EpisodesSection,VideoIframePlayer } from "../components/PlayerCards";
// import CommunitySection from "../components/CommunitySection";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef } from "react";


// export default function Player() {
//     const { mediaType, slug } = useParams();
//     const source = "https://player.videasy.to/movie/299534?color=ff6b2c&amp;overlay=true&amp;autoPlay=true"
//     return (
//         <>
//             <VideoFrame videoUrl={source} mediaType={mediaType} mediaId={slug} />  
//             <ServerSelector/>
//             <CommunitySection/>
//         </>
//     );
// }



/*

<VideoFrame source={slug} mediaType={mediaType} />
 <EpisodesSection />
 <ServerSelector/>



 */