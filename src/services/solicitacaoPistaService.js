import api from '../utils/api';

export const solicitacaoPistaService = {
  // Buscar solicitações pendentes
  listarPendentes: async () => {
    try {
      const response = await api.get('/lugar/listar');
      // Filtrar apenas pistas com status pendente
      const todasPistas = response.data;
      const pistasPendentes = todasPistas.filter(pista => 
        pista.statusPista === 'pendente' || pista.statusPista === 'solicitada'
      );
      return pistasPendentes;
    } catch (error) {
      throw error.response?.data || 'Erro ao buscar solicitações pendentes';
    }
  },

  // Aprovar solicitação
  aprovar: async (id) => {
    try {
      const response = await api.post(`/lugar/aprovar/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao aprovar solicitação';
    }
  },

  // Rejeitar solicitação
  rejeitar: async (id) => {
    try {
      const response = await api.post(`/lugar/rejeitar/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Erro ao rejeitar solicitação';
    }
  }
};