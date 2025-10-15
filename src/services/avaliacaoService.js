import api from '../utils/api';

export const avaliacaoService = {
  // Criar nova avaliação
  criar: async (avaliacao) => {
    try {
      const response = await api.post('/avaliacao/save', avaliacao);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao criar avaliação';
    }
  },

  // Buscar avaliações por lugar
  buscarPorLugar: async (lugarId) => {
    try {
      const response = await api.get(`/avaliacao/lugar/${lugarId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao buscar avaliações';
    }
  },

  // Buscar média de avaliações
  buscarMedia: async (lugarId) => {
    try {
      const response = await api.get(`/avaliacao/media/${lugarId}`);
      return response.data;
    } catch (error) {
      return 0;
    }
  },

  // Atualizar avaliação
  atualizar: async (id, avaliacao) => {
    try {
      const response = await api.put(`/avaliacao/update/${id}`, avaliacao);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao atualizar avaliação';
    }
  },

  // Deletar avaliação
  deletar: async (id, usuarioId) => {
    try {
      const response = await api.delete(`/avaliacao/delete/${id}`, {
        data: { usuarioId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao deletar avaliação';
    }
  }
};