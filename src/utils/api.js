import axios from 'axios';
import useStore from '../store';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://apna-mandi-updated-server.onrender.com' : '/api');

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
