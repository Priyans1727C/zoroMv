import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { titleDetails } from "../../../mockData/cardDetail";
import heroMavka from "/assets/hero-mavka.jpg";

import {
  Play,
  Heart,
  ChevronDown,
  Clock,
  Share2,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Star, Tv, ThumbsUp
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

export function VideoFrame({ videoUrl, mediaType,mediaId }) {
  const movieId = mediaId;
  const isSeries = mediaType !== "movie";
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative flex h-[400px] flex-col overflow-hidden rounded-2xl border border-white/5 sm:h-[500px] sm:rounded-[2rem] lg:h-[515px] "        >
      <AnimatePresence mode="wait">
        <motion.div
          key="trailer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto"
        >



        <iframe
          id="player-iframe" 
          className="w-full h-full" 
          allowfullscreen="" 
          webkitallowfullscreen="" 
          mozallowfullscreen="" 
          allow="autoplay; fullscreen *; picture-in-picture *" 
          referrerpolicy="strict-origin-when-cross-origin" 
          data-request-id="4" 
          src="https://player.videasy.to/movie/299534?color=ff6b2c&amp;overlay=true&amp;autoPlay=true"
        />

        




        </motion.div>
       
      </AnimatePresence>
    </motion.section>
  );
}

// src={`https://peachify.top/embed/movie/${movieId}?color=ff6b2c&overlay=true&autoPlay=true`}
// src={`https://screenscape.me/embed?tmdb=${movieId}&type=movie?color=ff6b2c&overlay=true&autoPlay=true`}
                       

{/* <iframe id="player-iframe" className="w-full h-full" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen="" allow="autoplay; fullscreen *; picture-in-picture *" referrerpolicy="strict-origin-when-cross-origin" data-request-id="4" src="https://player.videasy.to/movie/299534?color=ff6b2c&amp;overlay=true&amp;autoPlay=true"></iframe> */}
{/* <iframe id="player-iframe" class="" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen="" allow="autoplay; fullscreen *; picture-in-picture *" referrerpolicy="no-referrer" data-request-id="8" src="/api/player?token=eyJzZXJ2ZXJLZXkiOiJ2aWR6ZWUiLCJ0eXBlIjoibW92aWUiLCJpZCI6MTMzOTcxMywic2Vhc29uIjoxLCJlcGlzb2RlIjoxLCJwcm9maWxlS2V5IjoiY2luZW1hIiwicmVzdW1lQXQiOjAsInRpdGxlIjoiT2JzZXNzaW9uIiwieWVhciI6IjIwMjYiLCJpbWRiSWQiOiJ0dDM3Mjg3MzM1IiwiZXhwIjoxNzg0NTIwNTIxLCJ2IjoxfQ.77cUR13_lfDdPpoxy6yFJR9UiObB3zw8Qhg4lLIzD9Y"></iframe> */}
{/* <iframe id="player-iframe" class="" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen="" allow="autoplay; fullscreen *; picture-in-picture *" referrerpolicy="no-referrer" data-request-id="9" src="/api/player?token=eyJzZXJ2ZXJLZXkiOiJwZWFjaGlmeSIsInR5cGUiOiJtb3ZpZSIsImlkIjoxMzM5NzEzLCJzZWFzb24iOjEsImVwaXNvZGUiOjEsInByb2ZpbGVLZXkiOiJjaW5lbWEiLCJyZXN1bWVBdCI6MCwidGl0bGUiOiJPYnNlc3Npb24iLCJ5ZWFyIjoiMjAyNiIsImltZGJJZCI6InR0MzcyODczMzUiLCJleHAiOjE3ODQ1MjA2ODcsInYiOjF9.hX2DT7cHEgYw9N_rrWph-lN4vEFCFYtneDWgkXAvtkU"></iframe> */}

{/* <iframe src="https://player.videasy.net/movie/299534"></iframe> */}


export function VideoIframePlayer({}){

  return(
    <div className="h-full overflow-hidden">
      <img
        className="w-full object-cover"
        src={heroMavka } 
        alt="Preview"
        loading="lazy"
      />
    </div>
  );
  
}










import { useState } from "react";
import { Server, Cloud, Zap, Globe, Shield } from "lucide-react";

const SERVERS = [
  { name: "VidCloud", icon: Cloud, ms: 32 },
  { name: "MegaPlay", icon: Zap, ms: 48 },
  { name: "StreamX", icon: Globe, ms: 61 },
  { name: "SafeCast", icon: Shield, ms: 74 },
  { name: "VidCloud2", icon: Cloud, ms: 32 },
  { name: "MegaPlay2", icon: Zap, ms: 48 },
  { name: "StreamX2", icon: Globe, ms: 61 },
  { name: "SafeCast2", icon: Shield, ms: 74 },
];

export const ServerSelector = () => {
  // Standard JS useState
  const [type, setType] = useState("sub");
  const [selectedServer, setSelectedServer] = useState(SERVERS[0].name);

  return (
    <div className="p-4 rounded-2xl glass-panel">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 grid place-items-center rounded-lg bg-primary/15 text-primary">
            <Server size={16} />
          </div>
          <div>
            <div className="text-sm font-semibold">Servers</div>
            <div className="hidden sm:block text-[11px] text-muted-foreground">
              If one server fails, try another
            </div>
          </div>
        </div>

        {/* Interactive Tabs */}
        <div className="flex p-0.5 rounded-full bg-secondary/60 border border-white/5">
          {["sub", "dub"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-1 text-[11px] uppercase font-bold rounded-full transition-all duration-200 
                ${type === t
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8  lg:grid-cols-8   gap-1">
        {SERVERS.map((s) => {
          const Icon = s.icon; // Get icon component
          const isSelected = selectedServer === s.name;

          return (
            <button
              key={s.name}
              onClick={() => setSelectedServer(s.name)}
              className={`group flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all duration-200 outline-none
                ${isSelected
                  ? "bg-primary/10 border-primary/50 ring-1 ring-primary/20"
                  : "bg-white/[0.02] border-white/5 hover:bg-white/[0.08] hover:border-white/10 focus-visible:ring-2 focus-visible:ring-primary/50"}`}
            >
              <Icon size={18} className={isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
              <div className="text-xs font-semibold truncate w-full text-center">
                {s.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};



const EpisodeRow = memo(function EpisodeRow({ episode, index }) {
  const watched = episode.progress === 100;
  const inProgress = episode.progress > 0 && episode.progress < 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: EASE }}
      className="group flex cursor-pointer gap-4 rounded-2xl border border-transparent p-3 transition-all hover:border-white/[0.06] hover:bg-white/[0.03] sm:items-center"
    >
      <span className="hidden w-8 shrink-0 text-center text-xl font-black text-muted-foreground/40 transition-colors group-hover:text-primary sm:block">
        {episode.ep}
      </span>

      <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl border border-white/[0.05] sm:w-44">
        <img
          src={episode.image}
          alt={episode.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Play className="h-4 w-4 fill-current" />
          </span>
        </div>
        {inProgress && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
            <div className="h-full bg-primary" style={{ width: `${episode.progress}%` }} />
          </div>
        )}
        {watched && (
          <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary/90 text-primary-foreground">
            <Check className="h-3 w-3" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate text-sm font-bold text-foreground sm:text-base">
            <span className="mr-2 text-muted-foreground sm:hidden">E{episode.ep}</span>
            {episode.title}
          </h4>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {episode.duration}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {episode.desc}
        </p>
      </div>
    </motion.div>
  );
});

export const EpisodesSection = memo(function EpisodesSection() {
  const [season, setSeason] = useState(1);
  const [open, setOpen] = useState(false);
  const { seasonsData } = titleDetails;

  const current = seasonsData.find((s) => s.season === season);
  if (!current) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: EASE }}
      // h-full here makes this stretch to the snap-section height
      className="glass-panel h-full w-full flex flex-col rounded-3xl p-5 sm:p-7 overflow-hidden"
    >
      {/* Header - Fixed height, prevents shrinking */}
      <div className="flex-shrink-0 mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold sm:text-xl">Episodes</h2>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold backdrop-blur-md transition-colors hover:border-primary/30"
          >
            Season {season}
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
          
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                className="glass-panel absolute right-0 top-12 z-20 w-40 overflow-hidden rounded-2xl p-1.5"
              >
                {seasonsData.map((s) => (
                  <button
                    key={s.season}
                    onClick={() => { setSeason(s.season); setOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${s.season === season ? "bg-primary/15 text-primary" : "hover:bg-white/5"}`}
                  >
                    Season {s.season}
                    <span className="text-[10px] opacity-70">{s.episodes.length} eps</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scrollable List - flex-1 + min-h-0 is the requirement for overflow to work */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={season}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3 }}
          >
            {current.episodes.map((ep, i) => (
              <EpisodeRow key={ep.id} episode={ep} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
});





/*


 {
          isSeries &&
          <div className=" p-3 h-15 overflow-hidden flex justify-between items-center">
            <div>Left</div>
            <div>Scroll  down to see the episodes</div>
            <div
              key={"jn"}
              className="h-10 w-10 grid place-items-center rounded-full glass-panel hover:bg-primary/10"
            >
              <ThumbsUp className="h-4 w-4" />

            </div>

          </div>
        }

*/