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
  },

  solicitar: async (evento) => {
    try {
      const response = await api.post('/evento/solicitar', evento);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao solicitar evento';
    }
  },

  listarPendentes: async () => {
    try {
      const response = await api.get('/evento/pendentes');
      const eventos = response.data;
      
      // Processar cada evento para incluir imagens e dados do usuário
      const eventosComImagens = await Promise.all(
        eventos.map(async (evento) => {
          const fotos = [];
          
          // Buscar fotos se existirem
          try {
            const foto1Response = await api.get(`/evento/foto1/${evento.id}`);
            if (foto1Response.data) {
              fotos.push(`data:image/png;base64,${foto1Response.data}`);
            }
          } catch (e) { /* Foto não existe */ }
          
          try {
            const foto2Response = await api.get(`/evento/foto2/${evento.id}`);
            if (foto2Response.data) {
              fotos.push(`data:image/png;base64,${foto2Response.data}`);
            }
          } catch (e) { /* Foto não existe */ }
          
          try {
            const foto3Response = await api.get(`/evento/foto3/${evento.id}`);
            if (foto3Response.data) {
              fotos.push(`data:image/png;base64,${foto3Response.data}`);
            }
          } catch (e) { /* Foto não existe */ }
          
          return {
            ...evento,
            fotos,
            criadoPor: evento.usuario_id?.nome || 'Usuário não informado'
          };
        })
      );
      
      return eventosComImagens;
    } catch (error) {
      throw error.response?.data || 'Erro ao buscar eventos pendentes';
    }
  },

  aprovar: async (id) => {
    try {
      const response = await api.post(`/evento/aprovar/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao aprovar evento';
    }
  },

  rejeitar: async (id) => {
    try {
      const response = await api.post(`/evento/rejeitar/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao rejeitar evento';
    }
  },

  listarTodosParaAdmin: async () => {
    try {
      const response = await api.get('/evento/admin/todos');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao buscar eventos para admin';
    }
  }
};

export const getEvents = eventoService.listar;
export const createEvent = eventoService.criar;
export const updateEvent = eventoService.atualizar;
export const deleteEvent = eventoService.deletar;
export const solicitarEvento = eventoService.solicitar;
export const listarTodosParaAdmin = eventoService.listarTodosParaAdmin;
