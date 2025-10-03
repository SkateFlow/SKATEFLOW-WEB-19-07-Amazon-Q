import api from '../utils/api';

export const lugarService = {
  // Buscar todas as pistas
  listar: async () => {
    try {
      const response = await api.get('/lugar/listar');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao buscar pistas';
    }
  },

  // Buscar pista por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/lugar/findById/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Pista não encontrada';
    }
  },

  // Criar nova pista
  criar: async (lugar) => {
    try {
      const response = await api.post('/lugar/save', lugar);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao criar pista';
    }
  },

  // Atualizar pista
  atualizar: async (id, lugar) => {
    try {
      const response = await api.put(`/lugar/update/${id}`, lugar);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao atualizar pista';
    }
  },

  // Deletar pista
  deletar: async (id) => {
    try {
      const response = await api.delete(`/lugar/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao deletar pista';
    }
  }
};