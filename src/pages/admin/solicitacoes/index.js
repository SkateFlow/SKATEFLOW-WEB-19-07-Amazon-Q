import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FiTrash } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarAdmin from '../../../components/SidebarAdmin';
import SearchBar from '../../../components/SearchBar';
import ConfirmModal from '../../../components/ConfirmModal';
import SolicitacaoPistDetalsModal from '../../../components/SolicitacaoPistDetalsModal';
import SolicitacaoEventoDetailsModal from '../../../components/SolicitacaoEventoDetailsModal';
import { usePistasPendentes } from '../../../hooks/usePistasPendentes';
import { solicitacaoPistaService } from '../../../services/solicitacaoPistaService';

const AdminContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
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
  gap: 16px;
  margin-top: 24px;
`;

const SolicitacaoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #1a237e 100%);
  }
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SolicitacaoTitle = styled.h3`
  color: #1a237e;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const SolicitacaoInfo = styled.div`
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 14px;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  min-width: 60px;
  color: #475569;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #fef3c7;
  color: #92400e;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

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

const Solicitacoes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [solicitacaoToDelete, setSolicitacaoToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const [aprovandoPista, setAprovandoPista] = useState(null);
  const [showMessage, setShowMessage] = useState('');
  const { pistasPendentes, removerPistaPendente } = usePistasPendentes();
  const [todasSolicitacoes, setTodasSolicitacoes] = useState([]);
  const [eventosPendentes, setEventosPendentes] = useState([]);
  const [solicitacoesPistaBackend, setSolicitacoesPistaBackend] = useState([]);

  React.useEffect(() => {
    const carregarSolicitacoes = async () => {
      try {
        console.log('Carregando solicitações do backend...');
        const solicitacoesBackend = await solicitacaoPistaService.listarPendentes();
        console.log('Solicitações encontradas:', solicitacoesBackend);
        
        const solicitacoesFormatadas = solicitacoesBackend.map(s => ({ 
          ...s, 
          tipo: 'pista', 
          origem: 'backend',
          categoria: s.categoria?.nome || 'street',
          localizacao: `${s.rua || ''}, ${s.bairro || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado',
          publica: s.tipo === 'Pública'
        }));
        
        setTodasSolicitacoes(solicitacoesFormatadas);
      } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
        setTodasSolicitacoes([]);
      }
    };
    
    carregarSolicitacoes();
  }, []);

  const truncateDescription = (text) => {
    if (!text) return 'Sem descrição';
    if (text.length <= 25) return text;
    return text.substring(0, 25) + '...';
  };

  const handleCardClick = (solicitacao) => {
    setSelectedSolicitacao(solicitacao);
    setShowDetailsModal(true);
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
      await solicitacaoPistaService.aprovar(solicitacao.id);
      
      // Recarregar solicitações
      const solicitacoesAtualizadas = await solicitacaoPistaService.listarPendentes();
      const solicitacoesFormatadas = solicitacoesAtualizadas.map(s => ({ 
        ...s, 
        tipo: 'pista', 
        origem: 'backend',
        categoria: s.categoria?.nome || 'street',
        localizacao: `${s.rua || ''}, ${s.bairro || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado',
        publica: s.tipo === 'Pública'
      }));
      setTodasSolicitacoes(solicitacoesFormatadas);
      
      setShowDetailsModal(false);
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
      await solicitacaoPistaService.rejeitar(solicitacao.id);
      
      // Recarregar solicitações
      const solicitacoesAtualizadas = await solicitacaoPistaService.listarPendentes();
      const solicitacoesFormatadas = solicitacoesAtualizadas.map(s => ({ 
        ...s, 
        tipo: 'pista', 
        origem: 'backend',
        categoria: s.categoria?.nome || 'street',
        localizacao: `${s.rua || ''}, ${s.bairro || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado',
        publica: s.tipo === 'Pública'
      }));
      setTodasSolicitacoes(solicitacoesFormatadas);
      
      setShowDetailsModal(false);
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

        {filteredSolicitacoes.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyText>{searchTerm ? 'Nenhuma solicitação encontrada' : 'Nenhuma solicitação pendente'}</EmptyText>
            <EmptySubtext>{searchTerm ? 'Tente pesquisar com outros termos' : 'As solicitações de pistas e eventos aparecerão aqui'}</EmptySubtext>
          </EmptyState>
        ) : (
          <SolicitacaoGrid>
            {filteredSolicitacoes.map((solicitacao) => (
              <SolicitacaoCard key={`${solicitacao.tipo}-${solicitacao.id}`}>
                <div onClick={() => handleCardClick(solicitacao)} style={{ flex: 1, cursor: 'pointer' }}>
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
                  <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                    {solicitacao.tipo === 'pista' 
                      ? (solicitacao.localizacao || `${solicitacao.rua || ''}, ${solicitacao.bairro || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado')
                      : (solicitacao.dataEvento ? new Date(solicitacao.dataEvento).toLocaleDateString('pt-BR') : 'Não informado')
                    }
                  </div>
                  {solicitacao.tipo === 'pista' && solicitacao.categoria && (
                    <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '500' }}>
                      🛹 {solicitacao.categoria}
                    </div>
                  )}
                </div>
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
        
        {selectedSolicitacao?.tipo === 'pista' ? (
          <SolicitacaoPistDetalsModal 
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            solicitacao={selectedSolicitacao}
            onApprove={handleApprove}
            onReject={AhandleReject}
          />
        ) : (
          <SolicitacaoEventoDetailsModal 
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            solicitacao={selectedSolicitacao}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </ContentContainer>
    </AdminContainer>
  );
};

export default Solicitacoes;