import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  // Fail fast in dev if API base URL is not provided
  // eslint-disable-next-line no-console
  console.error('VITE_API_URL is not set. Please configure it in Frontend/frontend/.env');
}

export const api = axios.create({
  baseURL: API_BASE_URL
});
