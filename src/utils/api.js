import axios from 'axios';

// Configuração base para todas as requisições axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://projeto-spring-4avufeyvl-skateflows-projects.vercel.app/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para traatamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;

//local