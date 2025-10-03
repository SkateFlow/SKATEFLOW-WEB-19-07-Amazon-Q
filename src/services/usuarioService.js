import api from '../utils/api';

export const usuarioService = {
  // Cadastrar usuário
  cadastrar: async (userData) => {
    try {
      const response = await api.post('/usuario/save', {
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        nivelAcesso: 'USER',
        dataCadastro: new Date().toISOString(),
        statusUsuario: 'ATIVO'
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw 'Email já cadastrado';
      }
      throw error.response?.data || 'Erro ao cadastrar usuário';
    }
  },

  // Login
  login: async (email, senha) => {
    try {
      const response = await api.post('/usuario/login', {
        email,
        senha
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw 'Email ou senha incorretos';
      }
      throw error.response?.data || 'Erro ao fazer login';
    }
  },

  // Listar usuários
  listar: async () => {
    try {
      const response = await api.get('/usuario/listar');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw 'Servidor não disponível. Verifique se o backend está rodando.';
      }
      throw error.response?.data || 'Erro ao listar usuários';
    }
  },

  // Buscar por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/usuario/findById/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Usuário não encontrado';
    }
  },

  // Deletar usuário
  deletar: async (id) => {
    try {
      const response = await api.delete(`/usuario/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error.response?.data || 'Erro ao deletar usuário';
    }
  }
};