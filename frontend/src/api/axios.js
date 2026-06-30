import axios from 'axios';

export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY, // Always use .env
    language: 'en-US',
  },
});

export default tmdbApi;