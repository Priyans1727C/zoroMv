import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Film, Tv } from "lucide-react";

import { CommentsSection } from "../components/CommentSection";
import {
    VideoFrame,
    ServerSelector,
    EpisodesSection,
    EASE,
} from "../components/PlayerSections";

import {
    SERVERS,
    buildSource,
    getServer,
} from "../../../mockData/playesHelper";

import {
    useFetchById,
    useFetchSeasonEpisodes,
} from "../../home/hooks/useHome";

import useContinueWatching from "../hooks/usePlayer";

const MIN_WATCH_TIME = 2 * 60 * 1000;

export default function Player() {
    const { mediaType, slug: streamId } = useParams();
    const isSeries = mediaType === "tv";

    // 1. Separate the "Playing" state from the "List/UI" state
    const [playingSeason, setPlayingSeason] = useState(1);
    const [playingEpisode, setPlayingEpisode] = useState(1);
    const [listSeason, setListSeason] = useState(1);
    
    const [server, setServer] = useState(SERVERS[0].name);

    const { data: mediaDetails, isSuccess: isDetailsSuccess } = useFetchById(mediaType, streamId);
    
    // 2. Fetch episodes based on the dropdown list selection, NOT what is currently playing
    const { data: episodeList = [], isSuccess: isEpisodesSuccess } = useFetchSeasonEpisodes(streamId, listSeason, isSeries); 
    
    const playerRef = useRef(null);
    const timerRef = useRef(null);
    const hasSavedRef = useRef(false);

    const active = useMemo(() => getServer(server), [server]);
    const { save } = useContinueWatching();

    // 3. The video source relies entirely on the playing state
    const src = useMemo(
        () =>
            buildSource(server, {
                id: streamId,
                mediaType,
                season: playingSeason,
                episode: playingEpisode,
            }),
        [server, streamId, mediaType, playingSeason, playingEpisode]
    );

    const contextLabel = isSeries ? `S${playingSeason} · E${playingEpisode}` : "Movie";

    // 4. Update handlers to manage the states independently
    const handleSeasonChange = useCallback((seasonNumber) => {
        // Only change the UI list. Do NOT touch the playing episode.
        setListSeason(seasonNumber);
    }, []);

    const handlePlay = useCallback((seasonNumber, episodeNumber) => {
        // When a user actually clicks an episode, update both the player and the list
        setPlayingSeason(seasonNumber);
        setPlayingEpisode(episodeNumber);
        setListSeason(seasonNumber);

        if (typeof window !== "undefined" && window.innerWidth < 768) {
            playerRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, []);

    const seriesData = useMemo(
        () => ({
            seasons:
                mediaDetails?.seasonList?.map((seasonData) => ({
                    id: seasonData.id,
                    number: seasonData.seasonNumber,
                    name: seasonData.name,
                    posterUrl: seasonData.posterUrl,
                    episodeCount: seasonData.episodeCount,
                    episodes:
                        seasonData.seasonNumber === listSeason // Populate episodes for the viewed list
                            ? episodeList
                            : [],
                })) ?? [],
        }),
        [mediaDetails, listSeason, episodeList]
    );

    // 5. Update save effect to use playing tracking
    useEffect(() => {
        if (!isDetailsSuccess || !mediaDetails) return;

        hasSavedRef.current = false;
        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            if (hasSavedRef.current) return;

            save({
                id: mediaDetails.id,
                title: mediaDetails.title || mediaDetails.name,
                posterUrl: mediaDetails.posterUrl,
                mediaType,
                year: mediaDetails.year,
                genres: mediaDetails.genres ?? [],
                ...(isSeries && { season: playingSeason, episode: playingEpisode }),
            });

            hasSavedRef.current = true;
        }, MIN_WATCH_TIME);

        return () => clearTimeout(timerRef.current);
    }, [streamId, playingSeason, playingEpisode, isDetailsSuccess, isSeries, mediaType]);

    const shellCls = "mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-3 py-0 sm:gap-5 sm:px-5 sm:py-0 lg:h-[calc(100vh-130px)] lg:gap-4 lg:overflow-hidden lg:px-6 lg:py-0";
    const rowCls = `flex flex-col gap-4 lg:min-h-0 ${isSeries ? "lg:flex-1 lg:flex-row lg:gap-5" : "lg:flex-1"}`;
    const leftCls = `flex w-full flex-col gap-4 ${isSeries ? "lg:w-[70%] lg:min-w-[520px] lg:shrink-0" : "lg:min-h-0 lg:flex-1"}`;
    const rightCls = "scroll-hide w-full lg:min-w-[280px] lg:flex-1 lg:overflow-y-auto";

    if (!isDetailsSuccess) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-foreground">
                <span className="animate-pulse">Loading details...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className={shellCls}>
                <div className={rowCls}>
                    <div className={leftCls}>
                        <div
                            ref={playerRef}
                            className="scroll-mt-4 lg:flex-1 lg:min-h-0"
                        >
                            <VideoFrame
                                src={src}
                                serverName={active.name}
                                latency={active.ms}
                                mediaType={mediaType}
                                contextLabel={contextLabel}
                                fill
                            />
                        </div>

                        <div className="lg:shrink-0">
                            <ServerSelector
                                servers={SERVERS}
                                value={server}
                                onChange={setServer}
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {isSeries && (
                            <motion.div
                                key="episodes-col"
                                initial={{ opacity: 0, x: 18 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 18 }}
                                transition={{ duration: 0.4, ease: EASE }}
                                className={rightCls}
                            >
                                <EpisodesSection
                                    series={seriesData}
                                    listSeason={listSeason}
                                    playingSeason={playingSeason}
                                    playingEpisode={playingEpisode}
                                    onSeasonChange={handleSeasonChange}
                                    onPlay={handlePlay}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="mx-auto w-full max-w-[1440px] px-3 pb-12 pt-2 sm:px-5 lg:px-6 lg:pt-6">
                <CommentsSection
                    key={streamId}
                    seed={undefined}
                />
            </div>
        </div>
    );
}