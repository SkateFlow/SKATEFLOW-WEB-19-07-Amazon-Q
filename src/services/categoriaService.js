import api from '../utils/api';

export const categoriaService = {
  listar: async () => {
    try {
      const response = await api.get('/categoria/listar');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao buscar categorias';
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/categoria/findById/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Categoria não encontrada';
    }
  },

  criar: async (categoria) => {
    try {
      const response = await api.post('/categoria/save', categoria);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao criar categoria';
    }
  },

  deletar: async (id) => {
    try {
      const response = await api.delete(`/categoria/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao deletar categoria';
    }
  }
};