import axios from 'axios';

export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

const tmdbApi = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'en-US',
  },
});

export default tmdbApi;