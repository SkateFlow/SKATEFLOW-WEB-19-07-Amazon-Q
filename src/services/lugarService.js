import api from '../utils/api';

export const lugarService = {
  // Buscar pistas ativadas (para usuários)
  listar: async () => {
    try {
      const response = await api.get('/lugar/listar');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao buscar pistas';
    }
  },

  // Buscar todas as pistas (para admin)
  listarTodas: async () => {
    try {
      const response = await api.get('/lugar/admin/todas');
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

  // Solicitar nova pista
  solicitar: async (lugar) => {
    try {
      const response = await api.post('/lugar/solicitar', lugar);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao solicitar pista';
    }
  },

  // Criar nova pista (admin)
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
  },

  // Buscar foto1 em base64
  buscarFoto1: async (id) => {
    try {
      const response = await api.get(`/lugar/foto1/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Buscar foto2 em base64
  buscarFoto2: async (id) => {
    try {
      const response = await api.get(`/lugar/foto2/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Buscar foto3 em base64
  buscarFoto3: async (id) => {
    try {
      const response = await api.get(`/lugar/foto3/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Salvar foto1 em base64
  salvarFoto1: async (id, fotoBase64) => {
    try {
      const response = await api.put(`/lugar/foto1/${id}`, fotoBase64, {
        headers: { 'Content-Type': 'text/plain' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao salvar foto 1';
    }
  },

  // Salvar foto2 em base64
  salvarFoto2: async (id, fotoBase64) => {
    try {
      const response = await api.put(`/lugar/foto2/${id}`, fotoBase64, {
        headers: { 'Content-Type': 'text/plain' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao salvar foto 2';
    }
  },

  // Salvar foto3 em base64
  salvarFoto3: async (id, fotoBase64) => {
    try {
      const response = await api.put(`/lugar/foto3/${id}`, fotoBase64, {
        headers: { 'Content-Type': 'text/plain' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao salvar foto 3';
    }
  }
};