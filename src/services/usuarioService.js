import api from '../utils/api';

export const usuarioService = {
  listar: async () => {
    try {
      const response = await api.get('/usuario/listar');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao buscar usuários';
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/usuario/findById/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Usuário não encontrado';
    }
  }
};