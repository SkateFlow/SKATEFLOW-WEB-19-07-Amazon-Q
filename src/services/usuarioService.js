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
  },

  cadastrar: async (usuario) => {
    try {
      const response = await api.post('/usuario/save', usuario);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao cadastrar usuário';
    }
  },

  atualizar: async (id, usuario) => {
    try {
      const formData = new FormData();
      if (usuario.nome) formData.append('nome', usuario.nome);
      if (usuario.email) formData.append('email', usuario.email);
      if (usuario.isAdmin !== undefined) formData.append('nivelAcesso', usuario.isAdmin ? 'ADMIN' : 'USER');
      if (usuario.isActive !== undefined) formData.append('statusUsuario', usuario.isActive ? 'ATIVO' : 'INATIVO');
      
      const response = await api.put(`/usuario/atualizar/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao atualizar usuário';
    }
  },

  buscarFoto: async (id) => {
    try {
      const response = await api.get(`/usuario/foto/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  salvarFoto: async (id, fotoBase64) => {
    try {
      const response = await api.put(`/usuario/foto/${id}`, fotoBase64, {
        headers: { 'Content-Type': 'text/plain' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao salvar foto';
    }
  },

  alterarSenha: async (id, senhaData) => {
    try {
      const response = await api.put(`/usuario/alterarSenha/${id}`, senhaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao alterar senha';
    }
  },

  deletar: async (id) => {
    try {
      // Primeiro tenta excluir organizador se existir
      try {
        const organizadores = await api.get('/organizador/listar');
        const organizador = organizadores.data.find(org => org.usuario_id?.id === id);
        if (organizador) {
          await api.delete(`/organizador/delete/${organizador.id}`);
        }
      } catch (orgError) {
        // Ignora erro se não for organizador
      }
      
      // Depois exclui o usuário
      const response = await api.delete(`/usuario/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao deletar usuário';
    }
  },

  esqueceuSenha: async (email) => {
    try {
      const response = await api.post('/usuario/esqueceuSenha', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao enviar código de recuperação';
    }
  },

  validarCodigo: async (email, codigo) => {
    try {
      const response = await api.post('/usuario/validarCodigo', { email, codigo });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Código inválido ou expirado';
    }
  },

  redefinirSenha: async (email, codigo, novaSenha) => {
    try {
      const response = await api.post('/usuario/redefinirSenha', { email, codigo, novaSenha });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao redefinir senha';
    }
  }
};