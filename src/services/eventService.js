import api from '../utils/api';

export const eventoService = {
  listar: async () => {
    try {
      const response = await api.get('/evento/listar');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao buscar eventos';
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/evento/findById/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Evento não encontrado';
    }
  },

  criar: async (evento) => {
    try {
      // Se o evento tem fotos, usar o endpoint com fotos
      if (evento.foto1 || evento.foto2 || evento.foto3 || (evento.fotos && evento.fotos.length > 0)) {
        const response = await api.post('/evento/saveWithPhotos', evento);
        return response.data;
      } else {
        const response = await api.post('/evento/save', evento);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || 'Erro ao criar evento';
    }
  },

  atualizar: async (id, evento) => {
    try {
      const response = await api.put(`/evento/update/${id}`, evento);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao atualizar evento';
    }
  },

  deletar: async (id) => {
    try {
      const response = await api.delete(`/evento/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao deletar evento';
    }
  },

  buscarFoto1: async (id) => {
    try {
      const response = await api.get(`/evento/foto1/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  buscarFoto2: async (id) => {
    try {
      const response = await api.get(`/evento/foto2/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  buscarFoto3: async (id) => {
    try {
      const response = await api.get(`/evento/foto3/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  salvarFoto1: async (id, fotoBase64) => {
    try {
      const response = await api.put(`/evento/foto1/${id}`, fotoBase64, {
        headers: { 'Content-Type': 'text/plain' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao salvar foto';
    }
  },

  salvarFoto2: async (id, fotoBase64) => {
    try {
      const response = await api.put(`/evento/foto2/${id}`, fotoBase64, {
        headers: { 'Content-Type': 'text/plain' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao salvar foto';
    }
  },

  salvarFoto3: async (id, fotoBase64) => {
    try {
      const response = await api.put(`/evento/foto3/${id}`, fotoBase64, {
        headers: { 'Content-Type': 'text/plain' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao salvar foto';
    }
  }
};

export const getEvents = eventoService.listar;
export const createEvent = eventoService.criar;
export const updateEvent = eventoService.atualizar;
export const deleteEvent = eventoService.deletar;
