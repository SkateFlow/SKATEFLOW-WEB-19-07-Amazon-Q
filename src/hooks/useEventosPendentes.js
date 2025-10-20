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

  const aprovarEvento = (eventoId) => {
    const evento = eventosPendentes.find(e => e.id === eventoId);
    if (evento) {
      // Adicionar à lista de eventos aprovados
      const eventosAprovados = JSON.parse(localStorage.getItem('eventosAprovados') || '[]');
      eventosAprovados.push({
        ...evento,
        statusEvento: 'ativado',
        dataAprovacao: new Date().toISOString()
      });
      localStorage.setItem('eventosAprovados', JSON.stringify(eventosAprovados));

      // Remover da lista de pendentes
      removerEventoPendente(eventoId);
    }
  };

  const rejeitarEvento = (eventoId) => {
    const evento = eventosPendentes.find(e => e.id === eventoId);
    if (evento) {
      // Adicionar à lista de eventos rejeitados
      const eventosRejeitados = JSON.parse(localStorage.getItem('eventosRejeitados') || '[]');
      eventosRejeitados.push({
        ...evento,
        statusEvento: 'rejeitado',
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