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
  },

  login: async (email, senha) => {
    try {
      const response = await api.post('/usuario/login', { email, senha });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao fazer login';
    }
  },

  criar: async (usuario) => {
    try {
      const response = await api.post('/usuario/save', usuario);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao criar usuário';
    }
  }
};