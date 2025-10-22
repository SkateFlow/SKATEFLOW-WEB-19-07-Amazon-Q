import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FiTrash } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarAdmin from '../../../components/SidebarAdmin';
import SearchBar from '../../../components/SearchBar';
import ConfirmModal from '../../../components/ConfirmModal';
import SolicitacaoPistaDetailsModal from '../../../components/SolicitacaoPistaDetailsModal';
import SolicitacaoEventoDetailsModal from '../../../components/SolicitacaoEventoDetailsModal';
import { usePistasPendentes } from '../../../hooks/usePistasPendentes';
import { useEventosPendentes } from '../../../hooks/useEventosPendentes';
import { solicitacaoPistaService } from '../../../services/solicitacaoPistaService';

const AdminContainer = styled.div`
  background: 
    radial-gradient(circle at 20% 80%, #d0e6ffff 0%, transparent 25%),
    radial-gradient(circle at 80% 20%, #c4e0ffff 0%, transparent 25%),
    radial-gradient(circle at 40% 40%, #ffffff 0%, transparent 25%),
    #f8fafc;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  margin-left: 250px;
  padding: 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #1a237e;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 16px;
  margin: 0;
`;

const SolicitacaoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  margin-top: 32px;
`;

const SolicitacaoCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  gap: 20px;
  min-height: 140px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }


`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 120px;
  flex-shrink: 0;
  justify-content: center;
`;

const SolicitacaoTitle = styled.h3`
  color: #1a237e;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
`;

const SolicitacaoInfo = styled.div`
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 16px;
  line-height: 1.4;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  min-width: 60px;
  color: #475569;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: #fef3c7;
  color: #92400e;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &.approve {
    background: #dcfce7;
    color: #166534;
    
    &:hover {
      background: #bbf7d0;
    }
  }

  &.reject {
    background: #fee2e2;
    color: #dc2626;
    
    &:hover {
      background: #fecaca;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 18px;
  margin-bottom: 8px;
  color: #475569;
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  margin: 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 14px;
  margin: 0;
`;

const Solicitacoes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [solicitacaoToDelete, setSolicitacaoToDelete] = useState(null);
    const [aprovandoPista, setAprovandoPista] = useState(null);
  const [showMessage, setShowMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPistaModal, setShowPistaModal] = useState(false);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const { pistasPendentes, removerPistaPendente } = usePistasPendentes();
  const { eventosPendentes, aprovarEvento, rejeitarEvento } = useEventosPendentes();
  const [todasSolicitacoes, setTodasSolicitacoes] = useState([]);

  React.useEffect(() => {
    const carregarSolicitacoes = async () => {
      try {
        setLoading(true);
        console.log('Carregando solicitações do backend...');
        
        // Carregar pistas pendentes
        const solicitacoesBackend = await solicitacaoPistaService.listarPendentes();
        console.log('Solicitações de pistas encontradas:', solicitacoesBackend);
        
        const solicitacoesPistas = solicitacoesBackend.map(s => ({ 
          ...s, 
          tipo: 'pista', 
          origem: 'backend',
          categoria: s.categoria?.nome || 'street',
          localizacao: `${s.rua || ''}, ${s.bairro || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado',
          publica: s.tipo === 'Pública'
        }));
        
        // Carregar eventos pendentes do backend
        const { eventoService } = await import('../../../services/eventService');
        const eventosPendentesBackend = await eventoService.listarPendentes();
        console.log('Eventos pendentes encontrados:', eventosPendentesBackend);
        
        const eventosFormatados = eventosPendentesBackend.map(e => ({
          ...e,
          tipo: 'evento',
          origem: 'backend',
          dataEvento: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : 'Não informado',
          localEvento: e.lugar_id?.nome || 'Local não informado'
        }));
        
        // Adicionar eventos pendentes do localStorage (para compatibilidade)
        const eventosLocalStorage = eventosPendentes.map(e => ({
          ...e,
          tipo: 'evento',
          origem: 'localStorage',
          dataEvento: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : 'Não informado',
          localEvento: e.lugar_id?.nome || 'Local não informado'
        }));
        
        setTodasSolicitacoes([...solicitacoesPistas, ...eventosFormatados, ...eventosLocalStorage]);
      } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
        setTodasSolicitacoes([]);
      } finally {
        setLoading(false);
      }
    };
    
    carregarSolicitacoes();
  }, [eventosPendentes]);

  const truncateDescription = (text) => {
    if (!text) return 'Sem descrição';
    if (text.length <= 25) return text;
    return text.substring(0, 25) + '...';
  };

  
  const handleApprove = async (solicitacao) => {
    if (aprovandoPista === solicitacao.id) {
      setShowMessage('Aprovação em andamento...');
      setTimeout(() => setShowMessage(''), 2000);
      return;
    }
    
    setAprovandoPista(solicitacao.id);
    try {
      console.log('Aprovando solicitação:', solicitacao.id);
      
      if (solicitacao.tipo === 'pista') {
        await solicitacaoPistaService.aprovar(solicitacao.id);
      } else if (solicitacao.tipo === 'evento') {
        if (solicitacao.origem === 'backend') {
          const { eventoService } = await import('../../../services/eventService');
          await eventoService.aprovar(solicitacao.id);
        } else {
          aprovarEvento(solicitacao.id);
        }
      }
      
      // Recarregar solicitações
      const solicitacoesBackend = await solicitacaoPistaService.listarPendentes();
      const solicitacoesPistas = solicitacoesBackend.map(s => ({ 
        ...s, 
        tipo: 'pista', 
        origem: 'backend',
        categoria: s.categoria?.nome || 'street',
        localizacao: `${s.rua || ''}, ${s.bairro || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado',
        publica: s.tipo === 'Pública'
      }));
      
      // Recarregar eventos do backend
      const { eventoService } = await import('../../../services/eventService');
      const eventosPendentesBackend = await eventoService.listarPendentes();
      const eventosBackendFormatados = eventosPendentesBackend.map(e => ({
        ...e,
        tipo: 'evento',
        origem: 'backend',
        dataEvento: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : 'Não informado',
        localEvento: e.lugar_id?.nome || 'Local não informado'
      }));
      
      const eventosLocalStorage = eventosPendentes.map(e => ({
        ...e,
        tipo: 'evento',
        origem: 'localStorage',
        dataEvento: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : 'Não informado',
        localEvento: e.lugar_id?.nome || 'Local não informado'
      }));
      
      setTodasSolicitacoes([...solicitacoesPistas, ...eventosBackendFormatados, ...eventosLocalStorage]);
      
      setShowMessage('Aprovação concluída');
      setTimeout(() => setShowMessage(''), 2500);
    } catch (error) {
      console.error('Erro ao aprovar solicitação:', error);
      setShowMessage(`Erro ao aprovar solicitação: ${error.message}`);
      setTimeout(() => setShowMessage(''), 3000);
    } finally {
      setAprovandoPista(null);
    }
  };

  const handleReject = async (solicitacao) => {
    try {
      console.log('Rejeitando solicitação:', solicitacao.id);
      
      if (solicitacao.tipo === 'pista') {
        await solicitacaoPistaService.rejeitar(solicitacao.id);
      } else if (solicitacao.tipo === 'evento') {
        if (solicitacao.origem === 'backend') {
          const { eventoService } = await import('../../../services/eventService');
          await eventoService.rejeitar(solicitacao.id);
        } else {
          rejeitarEvento(solicitacao.id);
        }
      }
      
      // Recarregar solicitações
      const solicitacoesBackend = await solicitacaoPistaService.listarPendentes();
      const solicitacoesPistas = solicitacoesBackend.map(s => ({ 
        ...s, 
        tipo: 'pista', 
        origem: 'backend',
        categoria: s.categoria?.nome || 'street',
        localizacao: `${s.rua || ''}, ${s.bairro || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado',
        publica: s.tipo === 'Pública'
      }));
      
      // Recarregar eventos do backend
      const { eventoService } = await import('../../../services/eventService');
      const eventosPendentesBackend = await eventoService.listarPendentes();
      const eventosBackendFormatados = eventosPendentesBackend.map(e => ({
        ...e,
        tipo: 'evento',
        origem: 'backend',
        dataEvento: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : 'Não informado',
        localEvento: e.lugar_id?.nome || 'Local não informado'
      }));
      
      const eventosLocalStorage = eventosPendentes.map(e => ({
        ...e,
        tipo: 'evento',
        origem: 'localStorage',
        dataEvento: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : 'Não informado',
        localEvento: e.lugar_id?.nome || 'Local não informado'
      }));
      
      setTodasSolicitacoes([...solicitacoesPistas, ...eventosBackendFormatados, ...eventosLocalStorage]);
      
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      setShowMessage(`Erro ao rejeitar solicitação: ${error.message}`);
      setTimeout(() => setShowMessage(''), 3000);
    }
  };

  const filteredSolicitacoes = useMemo(() => {
    return todasSolicitacoes.filter(solicitacao => {
      const matchesSearch = !searchTerm || 
        (solicitacao.nome && solicitacao.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (solicitacao.localizacao && solicitacao.localizacao.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (solicitacao.rua && solicitacao.rua.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (solicitacao.bairro && solicitacao.bairro.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (solicitacao.descricao && solicitacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterStatus === 'todas' || solicitacao.tipo === filterStatus;
      
      return matchesSearch && matchesType;
    });
  }, [todasSolicitacoes, searchTerm, filterStatus]);

  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <Header>
          <HeaderContent>
            <Title>Solicitações</Title>
            <Subtitle>Gerencie as solicitações de pistas e eventos enviadas pelos usuários</Subtitle>
          </HeaderContent>
          <ActionButton
            onClick={() => {
              setLoading(true);
              const carregarSolicitacoes = async () => {
                try {
                  // Carregar pistas pendentes
                  const solicitacoesBackend = await solicitacaoPistaService.listarPendentes();
                  const solicitacoesPistas = solicitacoesBackend.map(s => ({ 
                    ...s, 
                    tipo: 'pista', 
                    origem: 'backend',
                    categoria: s.categoria?.nome || 'street',
                    localizacao: `${s.rua || ''}, ${s.bairro || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado',
                    publica: s.tipo === 'Pública'
                  }));
                  
                  // Carregar eventos pendentes do backend
                  const { eventoService } = await import('../../../services/eventService');
                  const eventosPendentesBackend = await eventoService.listarPendentes();
                  const eventosBackendFormatados = eventosPendentesBackend.map(e => ({
                    ...e,
                    tipo: 'evento',
                    origem: 'backend',
                    dataEvento: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : 'Não informado',
                    localEvento: e.lugar_id?.nome || 'Local não informado'
                  }));
                  
                  const eventosLocalStorage = eventosPendentes.map(e => ({
                    ...e,
                    tipo: 'evento',
                    origem: 'localStorage',
                    dataEvento: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : 'Não informado',
                    localEvento: e.lugar_id?.nome || 'Local não informado'
                  }));
                  
                  setTodasSolicitacoes([...solicitacoesPistas, ...eventosBackendFormatados, ...eventosLocalStorage]);
                } catch (error) {
                  console.error('Erro ao carregar solicitações:', error);
                } finally {
                  setLoading(false);
                }
              };
              carregarSolicitacoes();
            }}
            style={{
              background: '#e0f2fe',
              color: '#0277bd',
              alignSelf: 'flex-start'
            }}
          >
            🔄 Atualizar
          </ActionButton>
        </Header>
        
        <AnimatePresence>
          {showMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: showMessage.includes('concluída') ? '#10b981' : showMessage.includes('andamento') ? '#f59e0b' : '#ef4444',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              {showMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <SearchContainer>
          <SearchBar
            placeholder="Pesquisar solicitações de pistas e eventos..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </SearchContainer>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
          {['todas', 'pista', 'evento'].map(tipo => (
            <button
              key={tipo}
              onClick={() => setFilterStatus(tipo)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                background: filterStatus === tipo ? '#667eea' : 'white',
                color: filterStatus === tipo ? 'white' : '#64748b',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tipo === 'todas' ? 'Todas' : tipo === 'pista' ? 'Pistas' : 'Eventos'}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Carregando solicitações...</LoadingText>
          </LoadingContainer>
        ) : filteredSolicitacoes.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyText>{searchTerm ? 'Nenhuma solicitação encontrada' : 'Nenhuma solicitação pendente'}</EmptyText>
            <EmptySubtext>{searchTerm ? 'Tente pesquisar com outros termos' : 'As solicitações de pistas e eventos aparecerão aqui'}</EmptySubtext>
          </EmptyState>
        ) : (
          <SolicitacaoGrid>
            {filteredSolicitacoes.map((solicitacao) => (
              <SolicitacaoCard 
                key={`${solicitacao.tipo}-${solicitacao.id}`}
                onClick={() => {
                  console.log('Card clicado:', solicitacao);
                  setSelectedSolicitacao(solicitacao);
                  if (solicitacao.tipo === 'pista') {
                    setShowPistaModal(true);
                  } else {
                    setShowEventoModal(true);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <StatusBadge 
                    style={{
                      background: solicitacao.tipo === 'pista' ? '#e0f2fe' : '#f3e8ff',
                      color: solicitacao.tipo === 'pista' ? '#0277bd' : '#7c3aed',
                      marginBottom: '8px'
                    }}
                  >
                    {solicitacao.tipo === 'pista' ? '🛹 Pista' : '🎆 Evento'}
                  </StatusBadge>
                  <SolicitacaoTitle style={{ marginBottom: '4px' }}>{solicitacao.nome}</SolicitacaoTitle>
                  <div style={{ color: '#64748b', fontSize: '16px', marginBottom: '6px' }}>
                    {solicitacao.tipo === 'pista' 
                      ? (solicitacao.localizacao || `${solicitacao.rua || ''}, ${solicitacao.bairro || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado')
                      : `${solicitacao.dataEvento} - ${solicitacao.localEvento}`
                    }
                  </div>

                </CardContent>
                <CardActions>
                  <ActionButton 
                    className="approve"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(solicitacao);
                    }}
                    disabled={aprovandoPista === solicitacao.id}
                    style={{
                      opacity: aprovandoPista === solicitacao.id ? 0.6 : 1,
                      cursor: aprovandoPista === solicitacao.id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {aprovandoPista === solicitacao.id ? '⏳ Aprovando...' : '✓ Aprovar'}
                  </ActionButton>
                  <ActionButton 
                    className="reject"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(solicitacao);
                    }}
                  >
                    ✗ Reprovar
                  </ActionButton>
                </CardActions>
              </SolicitacaoCard>
            ))}
          </SolicitacaoGrid>
        )}
        
        {console.log('Estados do modal:', { showPistaModal, selectedSolicitacao: !!selectedSolicitacao })}
        <SolicitacaoPistaDetailsModal
          isOpen={showPistaModal}
          onClose={() => {
            console.log('Fechando modal');
            setShowPistaModal(false);
            setTimeout(() => {
              setSelectedSolicitacao(null);
            }, 100);
          }}
          solicitacao={selectedSolicitacao}
          onApprove={async (solicitacao) => {
            await handleApprove(solicitacao);
            setShowPistaModal(false);
            setSelectedSolicitacao(null);
          }}
          onReject={async (solicitacao) => {
            await handleReject(solicitacao);
            setShowPistaModal(false);
            setSelectedSolicitacao(null);
          }}
        />
        
        <SolicitacaoEventoDetailsModal
          isOpen={showEventoModal}
          onClose={() => {
            setShowEventoModal(false);
            setTimeout(() => {
              setSelectedSolicitacao(null);
            }, 100);
          }}
          solicitacao={selectedSolicitacao}
          onApprove={async (solicitacao) => {
            await handleApprove(solicitacao);
            setShowEventoModal(false);
            setSelectedSolicitacao(null);
          }}
          onReject={async (solicitacao) => {
            await handleReject(solicitacao);
            setShowEventoModal(false);
            setSelectedSolicitacao(null);
          }}
        />
        
      </ContentContainer>
    </AdminContainer>
  );
};

export default Solicitacoes;