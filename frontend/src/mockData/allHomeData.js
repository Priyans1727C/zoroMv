import heroMavka from "/assets/hero-mavka.jpg";
import posterJoker from "/assets/poster-joker.jpg";
import posterDune from "/assets/poster-dune.jpg";
import posterWarrior from "/assets/poster-warrior.jpg";
import posterAnime1 from "/assets/poster-anime1.jpg";

export const HERO_SLIDES = [
  { title: "Mavka", backdropUrl: heroMavka,img: heroMavka, genres: ["Drama", "Fantasy","Magic", "Thriller"], overview: "The tumultuous lives of villagers in a misty Carpathian forest are turned upside down when a forest spirit crosses paths with a young musician." },
  { title: "Dune", backdropUrl: posterDune, img: posterDune, genres: ["Sci-Fi", "Adventure"], overview: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset on the desert planet Arrakis." },
  { title: "Joker", backdropUrl: posterDune, img: posterJoker, genres: ["Drama", "Thriller"], overview: "A failed comedian descends into madness and revolution against the wealthy elite of a decaying Gotham City." },
  { title: "The Wanderer", backdropUrl: posterWarrior, img: posterWarrior, genres: ["Action", "Fantasy"], overview: "A lone warrior crosses war-torn kingdoms in search of redemption — and the truth behind a vanished bloodline." },
  { title: "Neon Blade", backdropUrl: posterAnime1, img: posterAnime1, genres: ["Anime", "Action"], overview: "In a neon-lit metropolis, a young swordsman uncovers a conspiracy that blurs the line between human and machine." },
  { title: "Mavka", backdropUrl: heroMavka,img: heroMavka, genres: ["Drama", "Fantasy","Magic", "Thriller"], overview: "The tumultuous lives of villagers in a misty Carpathian forest are turned upside down when a forest spirit crosses paths with a young musician." },
  { title: "Dune", backdropUrl: posterDune, img: posterDune, genres: ["Sci-Fi", "Adventure"], overview: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset on the desert planet Arrakis." },
  { title: "Joker", backdropUrl: posterDune, img: posterJoker, genres: ["Drama", "Thriller"], overview: "A failed comedian descends into madness and revolution against the wealthy elite of a decaying Gotham City." },
  { title: "The Wanderer", backdropUrl: posterWarrior, img: posterWarrior, genres: ["Action", "Fantasy"], overview: "A lone warrior crosses war-torn kingdoms in search of redemption — and the truth behind a vanished bloodline." },
  
];

// Rails Cards
export const continueWatching = [
  { id: 1, title: "The Last of Us", episode: "S1 E5 – Endure and Survive", backdropUrl: "/assets/thumb-chernobyl.jpg", progress: 72, duration: "48 min left", genre: "Drama / Horror" },
  { id: 2, title: "Breaking Bad", episode: "S3 E7 – One Minute", backdropUrl: "/assets/poster-joker.jpg", progress: 45, duration: "32 min left", genre: "Crime / Drama" },
  { id: 3, title: "Stranger Things", episode: "S4 E3 – The Monster and the Superhero", backdropUrl: "/assets/thumb-platform.jpg", progress: 88, duration: "8 min left", genre: "Sci-Fi / Horror" },
  { id: 4, title: "The Witcher", episode: "S2 E4 – Redanian Intelligence", backdropUrl: "/assets/poster-warrior.jpg", progress: 30, duration: "42 min left", genre: "Fantasy / Action" },
  { id: 5, title: "House of the Dragon", episode: "S1 E8 – The Lord of the Tides", backdropUrl: "/assets/poster-dune.jpg", progress: 55, duration: "28 min left", genre: "Fantasy / Drama" },
];

export const trendingNow = [
  { id: 1, title: "Dune: Part Two", backdropUrl: "/assets/poster-dune.jpg", rating: "8.9", year: "2024", genres: ["Sci-Fi", "Adventure"], duration: "2h 46m" },
  { id: 2, title: "Oppenheimer", backdropUrl: "/assets/thumb-chernobyl.jpg", rating: "8.6", year: "2023", genres: ["Biography", "Drama"], duration: "3h 0m" },
  { id: 3, title: "The Batman", backdropUrl: "/assets/poster-joker.jpg", rating: "7.8", year: "2022", genres: ["Action", "Crime"], duration: "2h 56m" },
  { id: 4, title: "Spider-Verse", backdropUrl: "/assets/poster-anime1.jpg", rating: "8.7", year: "2023", genres: ["Animation", "Action"], duration: "2h 20m" },
  { id: 5, title: "Avatar: The Way of Water", backdropUrl: "/assets/thumb-snow.jpg", rating: "7.6", year: "2022", genres: ["Sci-Fi", "Adventure"], duration: "3h 12m" },
  { id: 6, title: "John Wick 4", backdropUrl: "/assets/poster-warrior.jpg", rating: "7.7", year: "2023", genres: ["Action", "Thriller"], duration: "2h 49m" },
  { id: 7, title: "Guardians Vol. 3", backdropUrl: "/assets/poster-mecha.jpg", rating: "7.9", year: "2023", genres: ["Action", "Comedy"], duration: "2h 30m" },
  { id: 8, title: "Mission: Impossible", backdropUrl: "/assets/thumb-platform.jpg", rating: "7.8", year: "2023", genres: ["Action", "Thriller"], duration: "2h 43m" },
];