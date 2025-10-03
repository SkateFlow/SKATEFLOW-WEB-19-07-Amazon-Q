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
      const response = await api.post('/evento/save', evento);
      return response.data;
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
  }
};

export const getEvents = eventoService.listar;
export const createEvent = eventoService.criar;
export const updateEvent = eventoService.atualizar;
export const deleteEvent = eventoService.deletar;
