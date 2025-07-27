import axios from 'axios';
import useStore from '../store';

// API URL Configuration with debugging
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://apna-mandi-updated-server.onrender.com/api' : '/api');

// Debug logging for development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log('- Environment:', import.meta.env.PROD ? 'Production' : 'Development');
  console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('- Final API_URL:', API_URL);
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Debug logging for all requests in development
if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
  });
  
  api.interceptors.response.use(
    (response) => {
      console.log('✅ API Response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error('❌ API Error:', error.response?.status, error.config?.url, error.response?.data);
      return Promise.reject(error);
    }
  );
}

api.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
