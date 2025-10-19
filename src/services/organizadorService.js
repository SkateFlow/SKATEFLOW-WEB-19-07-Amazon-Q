import api from '../utils/api';

export const organizadorService = {
  criar: async (organizador) => {
    try {
      const response = await api.post('/organizador/save', organizador);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao cadastrar organizador';
    }
  },

  listar: async () => {
    try {
      const response = await api.get('/organizador/listar');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao buscar organizadores';
    }
  }
};