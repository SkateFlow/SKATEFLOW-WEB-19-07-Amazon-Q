import { useState, useEffect } from 'react';

export const useEventosPendentes = () => {
  const [eventosPendentes, setEventosPendentes] = useState([]);

  useEffect(() => {
    const loadEventosPendentes = () => {
      const stored = localStorage.getItem('eventosPendentes');
      if (stored) {
        setEventosPendentes(JSON.parse(stored));
      }
    };

    loadEventosPendentes();
    
    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      loadEventosPendentes();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const adicionarEventoPendente = (evento) => {
    const novosEventos = [...eventosPendentes, evento];
    setEventosPendentes(novosEventos);
    localStorage.setItem('eventosPendentes', JSON.stringify(novosEventos));
  };

  const removerEventoPendente = (eventoId) => {
    const eventosAtualizados = eventosPendentes.filter(e => e.id !== eventoId);
    setEventosPendentes(eventosAtualizados);
    localStorage.setItem('eventosPendentes', JSON.stringify(eventosAtualizados));
  };

  const aprovarEvento = async (eventoId) => {
    const evento = eventosPendentes.find(e => e.id === eventoId);
    if (evento) {
      try {
        // Salvar no backend com status Publicado
        const eventoParaAprovar = { ...evento, statusEvento: 'Publicado' };
        const { eventoService } = await import('../services/eventService');
        const response = await eventoService.criar(eventoParaAprovar);
        
        // Se tem fotos, salvar
        if (evento.fotos && evento.fotos.some(foto => foto)) {
          const eventoIdBackend = response.id || eventoId;
          
          for (let i = 0; i < evento.fotos.length; i++) {
            if (evento.fotos[i]) {
              const fotoBase64 = evento.fotos[i].split(',')[1];
              try {
                await eventoService[`salvarFoto${i + 1}`](eventoIdBackend, fotoBase64);
              } catch (error) {
                console.error(`Erro ao salvar foto ${i + 1}:`, error);
              }
            }
          }
        }

        // Remover da lista de pendentes
        removerEventoPendente(eventoId);
        return true;
      } catch (error) {
        console.error('Erro ao aprovar evento:', error);
        return false;
      }
    }
  };

  const rejeitarEvento = (eventoId) => {
    const evento = eventosPendentes.find(e => e.id === eventoId);
    if (evento) {
      // Adicionar à lista de eventos rejeitados
      const eventosRejeitados = JSON.parse(localStorage.getItem('eventosRejeitados') || '[]');
      eventosRejeitados.push({
        ...evento,
        status: 'rejeitado',
        dataRejeicao: new Date().toISOString()
      });
      localStorage.setItem('eventosRejeitados', JSON.stringify(eventosRejeitados));
      
      // Remover da lista de pendentes
      removerEventoPendente(eventoId);
    }
  };

  return {
    eventosPendentes,
    adicionarEventoPendente,
    removerEventoPendente,
    aprovarEvento,
    rejeitarEvento
  };
};