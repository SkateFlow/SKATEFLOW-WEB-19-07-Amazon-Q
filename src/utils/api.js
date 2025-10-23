import axios from 'axios';

// Configuração base para todas as requisições axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log apenas erros que não sejam 404 de imagens
    if (!(error.response?.status === 404 && error.config?.url?.includes('/foto'))) {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;