import { Star, Tv, Clock } from "lucide-react";
import heroMavka from "/assets/hero-mavka.jpg";
export const SLIDES = [
  {
    title: "Mavka",
    backdropUrl: heroMavka,
    genres: ["Drama", "Fantasy"],
    overview:"The tumultuous lives of villagers in a misty Carpathian forest are turned upside down when a forest spirit crosses paths with a young musician.",
    type: "Movie",
  },
];

const CAST_IMAGES = [
  "https://images.pexels.com/photos/17685932/pexels-photo-17685932.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700",
  "https://images.pexels.com/photos/5725371/pexels-photo-5725371.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700",
  "https://images.pexels.com/photos/10856197/pexels-photo-10856197.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700",
];

const EPISODE_IMAGES = [
  "/assets/thumb-chernobyl.jpg",
  "/assets/thumb-snow.jpg",
  "/assets/thumb-platform.jpg",
];

function buildSeason(season, count) {
  return {
    season,
    episodes: Array.from({ length: count }, (_, i) => ({
      id: `s${season}e${i + 1}`,
      ep: i + 1,
      title: `Episode ${i + 1}`,
      image: EPISODE_IMAGES[i % EPISODE_IMAGES.length],
      progress: i === 0 ? 100 : i === 1 ? 45 : 0,
      duration: `${45 + (i % 3) * 5}m`,
      desc: "A pivotal chapter unfolds as the story deepens, revealing new secrets and testing the bonds between the characters in unexpected ways.",
    })),
  };
}

export const titleDetails = {
  synopsis:
    "Arthur Fleck, a struggling stand-up comedian battling mental illness, finds himself disregarded by society. As his daily torments compound, he descends into a nihilistic spiral that births a notorious criminal icon: the Joker. A slow-burn psychological portrait painted in neon greens and shadow.",
  audienceScore: 84,
  reviewCount: "128,492",
  movieMeta: [
    { icon: Star, label: "8.4", primary: true },
    { icon: Tv, label: "Movie" },
    { icon: Clock, label: "2h 02m" },
  ],
  stats: [
    { k: "Director", v: "Todd Phillips" },
    { k: "Studio", v: "Warner Bros." },
    { k: "Language", v: "English" },
    { k: "Released", v: "Oct 2019" },
  ],
  scoreBreakdown: [
    { k: "Story", v: 92 },
    { k: "Acting", v: 96 },
    { k: "Visual", v: 88 },
  ],
  cast: [
    { name: "Arthur Fleck", role: "Lead", profileImageUrl: CAST_IMAGES[0] },
    { name: "Sophie Dumond", role: "Supporting", profileImageUrl: CAST_IMAGES[1] },
    { name: "Murray Franklin", role: "Supporting", profileImageUrl: CAST_IMAGES[2] },
    { name: "Arthur Fleck", role: "Lead", profileImageUrl: CAST_IMAGES[0] },
    { name: "Sophie Dumond", role: "Supporting", profileImageUrl: CAST_IMAGES[1] },
    { name: "Murray Franklin", role: "Supporting", profileImageUrl: CAST_IMAGES[2] },
  ],
  seasonsData: [buildSeason(1, 12), buildSeason(2, 5), buildSeason(3, 4)],
};
