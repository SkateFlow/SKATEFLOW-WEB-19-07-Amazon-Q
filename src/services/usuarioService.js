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
      if (error.response?.status === 404) {
        throw 'Usuário não encontrado';
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw 'Servidor não disponível';
      }
      throw error.response?.data?.message || error.response?.data || 'Usuário não encontrado';
    }
  },

  // Deletar usuário
  deletar: async (id) => {
    try {
      console.log('Chamando API para deletar usuário:', id);
      const response = await api.delete(`/usuario/delete/${id}`);
      console.log('Resposta da API:', response);
      return response.data;
    } catch (error) {
      console.error('Erro completo na API:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      
      if (error.response?.status === 404) {
        throw 'Usuário não encontrado';
      }
      
      // Verifica se é erro de constraint de referência
      const errorData = error.response?.data;
      const errorMessage = typeof errorData === 'string' ? errorData : errorData?.message || '';
      
      if (error.response?.status === 500 || 
          errorMessage.includes('REFERENCE constraint') ||
          errorMessage.includes('FK__Evento__usuario') ||
          errorMessage.includes('DELETE statement conflicted') ||
          errorMessage.includes('constraint')) {
        throw 'Não é possível excluir este usuário pois ele possui eventos cadastrados no sistema';
      }
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw 'Servidor não disponível. Verifique se o backend está rodando.';
      }
      
      throw errorMessage || 'Erro ao excluir usuário';
    }
  },

  // Contar usuários ativos
  contarAtivos: async () => {
    try {
      const response = await api.get('/usuario/contar-ativos');
      return response.data;
    } catch (error) {
      console.error('Erro ao contar usuários ativos:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw 'Servidor não disponível. Verifique se o backend está rodando.';
      }
      throw error.response?.data || 'Erro ao contar usuários ativos';
    }
  },

  // Listar usuários ativos
  listarAtivos: async () => {
    try {
      const response = await api.get('/usuario/listar-ativos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários ativos:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw 'Servidor não disponível. Verifique se o backend está rodando.';
      }
      throw error.response?.data || 'Erro ao listar usuários ativos';
    }
  },

  // Atualizar usuário
  atualizar: async (id, userData) => {
    try {
      const formData = new FormData();
      formData.append('nome', userData.nome);
      formData.append('nivelAcesso', userData.isAdmin ? 'ADMIN' : 'USER');
      formData.append('statusUsuario', userData.isActive ? 'ATIVO' : 'INATIVO');
      
      if (userData.foto && userData.foto instanceof File) {
        formData.append('foto', userData.foto);
      }
      
      const response = await api.put(`/usuario/atualizar/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      if (error.response?.status === 404) {
        throw 'Usuário não encontrado';
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw 'Servidor não disponível. Verifique se o backend está rodando.';
      }
      throw error.response?.data || 'Erro ao atualizar usuário';
    }
  },

  // Atualizar perfil do usuário
  atualizarPerfil: async (id, userData) => {
    try {
      const response = await api.put(`/usuario/perfil/${id}`, {
        nome: userData.nome,
        foto: userData.foto
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      if (error.response?.status === 404) {
        throw 'Usuário não encontrado';
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw 'Servidor não disponível. Verifique se o backend está rodando.';
      }
      throw error.response?.data || 'Erro ao atualizar perfil';
    }
  },

  // Alterar senha do usuário
  alterarSenha: async (id, senhaData) => {
    try {
      const response = await api.put(`/usuario/alterarSenha/${id}`, {
        senha: senhaData.senha
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      if (error.response?.status === 404) {
        throw 'Usuário não encontrado';
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw 'Servidor não disponível. Verifique se o backend está rodando.';
      }
      throw error.response?.data || 'Erro ao alterar senha';
    }
  }
};