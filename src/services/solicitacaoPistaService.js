import api from '../utils/api';

export const solicitacaoPistaService = {
  // Buscar solicitações pendentes com imagens
  listarPendentes: async () => {
    try {
      const response = await api.get('/lugar/pendentes');
      const solicitacoes = response.data;
      
      // Processar cada solicitação para incluir imagens e dados do usuário
      const solicitacoesComImagens = await Promise.all(
        solicitacoes.map(async (solicitacao) => {
          const fotos = [];
          
          // Buscar fotos se existirem
          try {
            const foto1Response = await api.get(`/lugar/foto1/${solicitacao.id}`);
            if (foto1Response.data) {
              fotos.push(`data:image/png;base64,${foto1Response.data}`);
            }
          } catch (e) { /* Foto não existe */ }
          
          try {
            const foto2Response = await api.get(`/lugar/foto2/${solicitacao.id}`);
            if (foto2Response.data) {
              fotos.push(`data:image/png;base64,${foto2Response.data}`);
            }
          } catch (e) { /* Foto não existe */ }
          
          try {
            const foto3Response = await api.get(`/lugar/foto3/${solicitacao.id}`);
            if (foto3Response.data) {
              fotos.push(`data:image/png;base64,${foto3Response.data}`);
            }
          } catch (e) { /* Foto não existe */ }
          
          return {
            ...solicitacao,
            fotos,
            criadoPor: solicitacao.usuario?.nome || 'Usuário não informado'
          };
        })
      );
      
      return solicitacoesComImagens;
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