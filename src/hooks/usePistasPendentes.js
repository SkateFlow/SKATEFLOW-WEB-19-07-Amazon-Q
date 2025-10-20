import { useState, useEffect } from 'react';

export const usePistasPendentes = () => {
  const [pistasPendentes, setPistasPendentes] = useState([]);

  useEffect(() => {
    const loadPistasPendentes = () => {
      const stored = localStorage.getItem('pistasPendentes');
      if (stored) {
        setPistasPendentes(JSON.parse(stored));
      }
    };

    loadPistasPendentes();
    
    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      loadPistasPendentes();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const adicionarPistaPendente = (pista) => {
    try {
      // Remover imagens base64 para economizar espaço
      const pistaLimpa = {
        ...pista,
        fotos: [] // Limpar fotos para evitar quota exceeded
      };
      const novasPistas = [...pistasPendentes, pistaLimpa];
      setPistasPendentes(novasPistas);
      localStorage.setItem('pistasPendentes', JSON.stringify(novasPistas));
    } catch (error) {
      console.error('Erro ao salvar pista pendente:', error);
      // Tentar limpar localStorage se estiver cheio
      if (error.name === 'QuotaExceededError') {
        localStorage.removeItem('pistasPendentes');
        setPistasPendentes([]);
      }
    }
  };

  const removerPistaPendente = (pistaId) => {
    const pistasAtualizadas = pistasPendentes.filter(p => p.id !== pistaId);
    setPistasPendentes(pistasAtualizadas);
    localStorage.setItem('pistasPendentes', JSON.stringify(pistasAtualizadas));
  };

  const aprovarPista = (pistaId) => {
    const pista = pistasPendentes.find(p => p.id === pistaId);
    if (pista) {
            // Adicionar à lista de pistas aprovadas
      const pistasAprovadas = JSON.parse(localStorage.getItem('pistasAprovadas') || '[]');
      pistasAprovadas.push({
        ...pista,
        status: 'aprovada',
        active: true,
        dataAprovacao: new Date().toISOString()
      });
      localStorage.setItem('pistasAprovadas', JSON.stringify(pistasAprovadas));

      // Remover da lista de pendentes
      removerPistaPendente(pistaId);
    }
  };

  const rejeitarPista = (pistaId) => {
    const pista = pistasPendentes.find(p => p.id === pistaId);
    if (pista) {
      // Adicionar à lista de pistas rejeitadas
      const pistasRejeitadas = JSON.parse(localStorage.getItem('pistasRejeitadas') || '[]');
      pistasRejeitadas.push({
        ...pista,
        status: 'rejeitada',
        dataRejeicao: new Date().toISOString()
      });
      localStorage.setItem('pistasRejeitadas', JSON.stringify(pistasRejeitadas));
      
      // Remover da lista de pendentes
      removerPistaPendente(pistaId);
    }
  };

  return {
    pistasPendentes,
    adicionarPistaPendente,
    removerPistaPendente,
    aprovarPista,
    rejeitarPista
  };
};