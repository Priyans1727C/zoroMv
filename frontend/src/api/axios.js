import axios from 'axios';

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY, // Always use .env
    language: 'en-US',
  },
});

export default tmdbApi;