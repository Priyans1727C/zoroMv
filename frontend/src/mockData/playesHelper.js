import { Gauge, Globe, Layers, Radio, Rocket, Sparkles, Tv, Waves } from "lucide-react";

const THEME = "2dd4bf";

/* ─────────────────────────────────────────────────────────────────
   Media catalogues. The page morphs between these two via the
   toolbar toggle; everything downstream (player URL, episodes list,
   comment thread) reads from whichever is active.
   ───────────────────────────────────────────────────────────────── */

export const MOVIE = {
  id: 299534,
  kind: "movie",
  title: "Avengers: Endgame",
  meta: [
    { kind: "badge", text: "4K HDR", accent: true },
    { kind: "badge", text: "PG-13" },
    { kind: "plain", text: "2019" },
    { kind: "plain", text: "3h 01m" },
    { kind: "star", text: "8.4" },
  ],
};

export const SERIES = {
  id: 94605,
  kind: "series",
  title: "Arcane",
  meta: [
    { kind: "badge", text: "4K HDR", accent: true },
    { kind: "badge", text: "TV-14" },
    { kind: "plain", text: "2021" },
    { kind: "plain", text: "2 Seasons" },
    { kind: "star", text: "9.0" },
  ],
  seasons: [
    {
      number: 1,
      episodes: [
        { n: 1, title: "Welcome to the Playground", runtime: "41m", air: "Nov 6, 2021", watched: true,
          synopsis: "Vi and Powder sneak across the bridge into Piltover for a heist that goes sideways, setting both sisters' fates in motion." },
        { n: 2, title: "Some Mysteries Are Better Left Unsolved", runtime: "40m", air: "Nov 6, 2021", watched: true,
          synopsis: "Vander confronts the fallout of the girls' raid while Silco's grip on the Lanes tightens one block at a time." },
        { n: 3, title: "The Base Violence Necessary for Change", runtime: "44m", air: "Nov 6, 2021", watched: true,
          synopsis: "A desperate rescue collapses into tragedy on the bridge, splitting the sisters apart and reshaping Zaun forever." },
        { n: 4, title: "Happy Progress Day!", runtime: "40m", air: "Nov 13, 2021", watched: false,
          synopsis: "Years on, Piltover celebrates its centennial while Jinx's fragile mind spirals in the dark beneath Silco's care." },
        { n: 5, title: "Everybody Wants to Be My Enemy", runtime: "41m", air: "Nov 13, 2021", watched: false,
          synopsis: "Caitlyn recruits a reluctant Vi to chase a string of shimmer-fueled crimes through the undercity's neon guts." },
        { n: 6, title: "When These Walls Come Tumbling Down", runtime: "42m", air: "Nov 13, 2021", watched: false,
          synopsis: "Old loyalties fracture as Ekko's Firelights clash with Silco's enforcers in the beating heart of Zaun." },
        { n: 7, title: "The Boy Savior", runtime: "39m", air: "Nov 20, 2021", watched: false,
          synopsis: "Ekko and Vi reunite on a painted rooftop, and a long-buried friendship sparks back to life against impossible odds." },
        { n: 8, title: "Oil and Water", runtime: "43m", air: "Nov 20, 2021", watched: false,
          synopsis: "The council votes on Hextech warfare while Jinx's jealousy reaches a quiet, terrible breaking point at Silco's table." },
        { n: 9, title: "The Monster You Created", runtime: "44m", air: "Nov 20, 2021", watched: false,
          synopsis: "A dinner of reckoning ends in fire; Zaun's future is declared in blood, grief, and a single rocket arcing over the council." },
      ],
    },
    {
      number: 2,
      episodes: [
        { n: 1, title: "Heavy Is the Crown", runtime: "42m", air: "Nov 9, 2024", watched: false,
          synopsis: "Caitlyn bears the weight of command as a grieving Piltover demands retribution against the undercity." },
        { n: 2, title: "Watch It All Burn", runtime: "40m", air: "Nov 9, 2024", watched: false,
          synopsis: "Jinx drifts through the wreckage of her own choices while a new threat rises in the chem-barons' absence." },
        { n: 3, title: "Finally Got the Name Right", runtime: "41m", air: "Nov 9, 2024", watched: false,
          synopsis: "Vi and Caitlyn's partnership deepens on a long road into the lawless borders beyond the twin cities." },
        { n: 4, title: "The Prettiest Woman in the World", runtime: "43m", air: "Nov 16, 2024", watched: false,
          synopsis: "A heist at a Noxian gala pulls the sisters' orbits back toward each other across a room full of enemies." },
        { n: 5, title: "I Can't Hear the Music Anymore", runtime: "40m", air: "Nov 16, 2024", watched: false,
          synopsis: "Ekko stumbles onto a shimmering anomaly that could rewrite everything the war tore apart." },
        { n: 6, title: "The Message Hidden in the Pattern", runtime: "42m", air: "Nov 16, 2024", watched: false,
          synopsis: "Warwick prowls the grey districts, and a ghost the undercity tried to bury refuses to stay dead." },
        { n: 7, title: "Like Water Through a Broken Vase", runtime: "41m", air: "Nov 23, 2024", watched: false,
          synopsis: "Piltover's council fractures in public as Ambessa's patience finally, fatally, runs out." },
        { n: 8, title: "Killing Is a Cycle", runtime: "44m", air: "Nov 23, 2024", watched: false,
          synopsis: "Alliances collapse on every front at once as the long convergence the season has been building toward begins." },
        { n: 9, title: "The Dirt Under Your Nails", runtime: "45m", air: "Nov 23, 2024", watched: false,
          synopsis: "Zaun and Piltover collide one last time; whatever survives the night will define both cities for a generation." },
      ],
    },
  ],
};

/* Arcane-flavoured comment thread — swaps in when the toggle is on Series. */
export const SERIES_COMMENTS = [
  {
    id: 201, name: "Mara V.", time: "1 day ago",
    text: "The way S1E3 handles the bridge scene still wrecks me. No dialogue, just consequences landing one after another.",
    likes: 72, liked: false,
    replies: [
      { id: 2011, name: "Dev R.", time: "22 hours ago", text: "The silence is the point. Score drops out and you just hear breathing.", likes: 18, liked: false },
    ],
  },
  {
    id: 202, name: "Theo K.", time: "2 days ago",
    text: "People skip how much of Vi's toughness is just unprocessed grief wearing a leather jacket. Rewatch her face in E5.",
    likes: 54, liked: false, replies: [],
  },
  {
    id: 203, name: "Priya M.", time: "3 days ago",
    text: "Piltover vs Zaun is the sharpest class allegory in animation this decade, and it trusts you to read it without a lecture.",
    likes: 96, liked: false,
    replies: [
      { id: 2031, name: "Rafael O.", time: "2 days ago", text: "The verticality of the framing does half the argument before a single line is spoken.", likes: 31, liked: false },
      { id: 2032, name: "Amara N.", time: "2 days ago", text: "And the shimmer economy is such a clean metaphor for who gets to profit from addiction.", likes: 27, liked: false },
      { id: 2033, name: "Theo K.", time: "1 day ago", text: "Right? It's political without ever feeling like a PSA. Rare trick.", likes: 12, liked: false },
    ],
  },
  {
    id: 204, name: "Liang W.", time: "4 days ago",
    text: "\"Enemy\" could have been cheesy in any other show. Here it's permanently welded to the rooftop fight in my brain.",
    likes: 41, liked: false, replies: [],
  },
  {
    id: 205, name: "Noor A.", time: "5 days ago",
    text: "The Firelights' tree base is the only place in either city that feels like taking a full breath. I want to live there.",
    likes: 63, liked: false,
    replies: [
      { id: 2051, name: "Mara V.", time: "4 days ago", text: "The lantern light on the leaves at night — I paused so many times.", likes: 14, liked: false },
    ],
  },
  {
    id: 206, name: "Sofia L.", time: "6 days ago",
    text: "Fortiche's 2D/3D hybrid painterly look makes every single frame feel like a concept painting that decided to move.",
    likes: 88, liked: false, replies: [],
  },
  {
    id: 207, name: "James K.", time: "1 week ago",
    text: "S2's pacing risks absolutely paid off. The parallel editing across the finale is graduate-level television.",
    likes: 119, liked: false,
    replies: [
      { id: 2071, name: "Elena V.", time: "6 days ago", text: "The way it cuts between three timelines on a single emotional beat — chef's kiss.", likes: 35, liked: false },
      { id: 2072, name: "Liang W.", time: "5 days ago", text: "I had to sit through the credits in silence. Twice.", likes: 22, liked: false },
    ],
  },
  {
    id: 208, name: "Chris B.", time: "1 week ago",
    text: "The Warwick reveal is the rare adaptation choice that improves on the source by actually giving the monster a soul.",
    likes: 47, liked: false, replies: [],
  },
  {
    id: 209, name: "Hana S.", time: "2 weeks ago",
    text: "The hexgate scene is doing an enormous amount of heavy lifting for two characters who barely say a word out loud.",
    likes: 70, liked: false,
    replies: [
      { id: 2091, name: "Noor A.", time: "12 days ago", text: "Every glance is a paragraph. The animators earned that silence.", likes: 19, liked: false },
    ],
  },
  {
    id: 210, name: "Daniel W.", time: "3 weeks ago",
    text: "Only gripe: a couple of the S2 chem-baron threads deserved one more episode to fully land. Still a masterpiece though.",
    likes: 33, liked: false, replies: [],
  },
];

/* ─────────────────────────────────────────────────────────────────
   Eight curated embed providers. `build` takes an opts object so the
   same provider list serves both movies and TV without duplication.
   Latency values are display estimates only.
   ───────────────────────────────────────────────────────────────── */

  export const SERVERS = [
    {
      name: "Videasy", icon: Sparkles, ms: 31, category: "sub",
      build: ({ id, mediaType, season, episode }) =>
        mediaType === "tv"
          ? `https://player.videasy.net/tv/${id}/${season}/${episode}?color=${THEME}&autoPlay=true`
          : `https://player.videasy.net/movie/${id}?color=${THEME}&overlay=true&autoPlay=true`,
    },

    {
      name: "Vidking", 
      icon: Sparkles, 
      ms: 28,   category: "sub",
      build: ({ id, mediaType, season, episode }) =>
        mediaType === "tv"
          ? `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=${THEME}&autoPlay=true&nextEpisode=true&episodeSelector=true`
          : `https://www.vidking.net/embed/movie/${id}?color=${THEME}&autoPlay=true`,
    },




  {
      name: "VidFast", 
      icon: Sparkles, 
      ms: 35,  category: "sub",
      build: ({ id, mediaType, season, episode }) =>
        mediaType === "tv"
          ? `https://vidfast.vc/tv/${id}/${season}/${episode}?theme=${THEME}&autoPlay=true&nextButton=true&autoNext=true`
          : `https://vidfast.vc/movie/${id}?theme=${THEME}&autoPlay=true`,
    },



    {
      name: "111movies", 
      icon: Sparkles, 
      ms: 50,  category: "sub",
      build: ({ id, mediaType, season, episode }) =>
        mediaType === "tv"
          ? `https://111movies.net/tv/${id}/${season}/${episode}`
          : `https://111movies.net/movie/${id}`,
    },
      {
      name: "peachify", icon: Tv, ms: 70,  category: "sub",
      build: ({ id, mediaType, season, episode }) =>
        mediaType === "tv"
          ? `https://peachify.pro/embed/tv/${id}/${season}/${episode}`
          : `https://peachify.pro/embed/movie/${id}`,
    },


    {name: "StreamVault", 
      icon: Sparkles, 
      ms: 42,  category: "sub",
      build: ({ id, mediaType, season, episode }) =>
        mediaType === "tv"
          ? `https://streamvaultsrc.click/embed/tv/${id}/${season}/${episode}`
          : `https://streamvaultsrc.click/embed/movie/${id}`,
    },
    {
      name: "SCREENSCAPE", 
      icon: Sparkles, 
      ms: 45,  category: "all",
      build: ({ id, mediaType, season, episode }) =>
        mediaType === "tv"
          ? `https://screenscape.me//embed?tmdb=${id}&type=tv&s=${season}&e=${episode}&lan=hindi`
          : `https://screenscape.me//embed?tmdb=${id}&type=movie&lan=hindi`,
    },
  

  ];

  export function getServer(name) {
    return SERVERS.find((s) => s.name === name) ?? SERVERS[0];
  }

  export function buildSource(serverName, opts) {
    return getServer(serverName).build(opts);
  }
