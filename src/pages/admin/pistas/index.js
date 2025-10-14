import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash, FiEye, FiEyeOff, FiPlus, FiRefreshCw } from 'react-icons/fi';
import SidebarAdmin from '../../../components/SidebarAdmin';
import SearchBar from '../../../components/SearchBar';
import EditPistaModal from '../../../components/EditPistaModal';
import CreatePistaModal from '../../../components/CreatePistaModal';
import ConfirmModal from '../../../components/ConfirmModal';
import { usePistasPendentes } from '../../../hooks/usePistasPendentes';

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

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #1a237e 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 30px;
`;

const RefreshContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #1a237e;
  color: white;
  
  &:hover {
    background: #303f9f;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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

const PistaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const PistaCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
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

const PistaTitle = styled.h3`
  color: #1a237e;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const PistaInfo = styled.div`
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
  margin-right: 8px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.active ? '#dcfce7' : '#fef3c7'};
  color: ${props => props.active ? '#166534' : '#92400e'};
  margin-bottom: 16px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
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

  &.edit {
    background: #e0f2fe;
    color: #0277bd;
    
    &:hover {
      background: #b3e5fc;
    }
  }

  &.status {
    background: ${props => props.active ? '#fef3c7' : '#dcfce7'};
    color: ${props => props.active ? '#92400e' : '#166534'};
    
    &:hover {
      background: ${props => props.active ? '#fde68a' : '#bbf7d0'};
    }
  }

  &.delete {
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

const Pistas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPista, setEditingPista] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pistaToDelete, setPistaToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todas');
  const [loading, setLoading] = useState(true);
  const { pistasPendentes, aprovarPista, rejeitarPista } = usePistasPendentes();

  const truncateDescription = (text) => {
    if (text.length <= 25) return text;
    return text.substring(0, 25) + '...';
  };
  const [pistasBase, setPistasBase] = useState([]);

  const [pistas, setPistas] = useState([]);
  const [pistasBackend, setPistasBackend] = useState([]);

  useEffect(() => {
    const pistasAprovadas = JSON.parse(localStorage.getItem('pistasAprovadas') || '[]');
    const pistasRejeitadas = JSON.parse(localStorage.getItem('pistasRejeitadas') || '[]');
    
    const todasPistas = [
      ...pistasBackend,
      ...pistasAprovadas,
      ...pistasRejeitadas
    ];
    
    setPistas(todasPistas);
  }, [pistasPendentes, pistasBackend]);

  const getLocationFromCep = async (cep) => {
    if (!cep || cep.length !== 8) return 'Não informado';
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        return `${data.localidade || ''} - ${data.uf || ''}`.replace(/^\s*-\s*|\s*-\s*$/g, '') || 'Não informado';
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
    
    return 'Não informado';
  };

  const loadPistasBackend = async () => {
    try {
      setLoading(true);
      const { lugarService } = await import('../../../services/lugarService');
      const lugares = await lugarService.listar();
      
      const pistasFormatadas = await Promise.all(
        lugares.map(async (lugar) => {
          const localizacao = await getLocationFromCep(lugar.cep);
          
          return {
            id: lugar.id,
            nome: lugar.nome,
            descricao: lugar.descricao,
            localizacao,
            rua: lugar.rua,
            bairro: lugar.bairro,
            cep: lugar.cep,
            latitude: lugar.latitude,
            longitude: lugar.longitude,
            active: lugar.statusPista === 'ativada',
            status: 'backend',
            tipo: lugar.tipo,
            valor: lugar.valor,
            fotos: lugar.foto ? [`data:image/jpeg;base64,${lugar.foto}`] : []
          };
        })
      );
      
      setPistasBackend(pistasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar pistas do backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPistasBackend();
  }, []);

  const handleDelete = (pistaId) => {
    const pista = pistas.find(p => p.id === pistaId);
    if (pista) {
      setPistaToDelete(pista);
      setShowConfirmModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!pistaToDelete) return;
    
    try {
      if (pistaToDelete.status === 'backend') {
        // Excluir do backend
        const { lugarService } = await import('../../../services/lugarService');
        await lugarService.deletar(pistaToDelete.id);
        
        // Recarregar lista do backend
        await loadPistasBackend();
      } else {
        // Remover do localStorage para pistas aprovadas/rejeitadas
        const storageKey = pistaToDelete.status === 'aprovada' ? 'pistasAprovadas' : 'pistasRejeitadas';
        const pistasStorage = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const pistasAtualizadas = pistasStorage.filter(p => p.id !== pistaToDelete.id);
        localStorage.setItem(storageKey, JSON.stringify(pistasAtualizadas));
      }
      
    } catch (error) {
      console.error('Erro ao excluir pista:', error);
      const errorMessage = typeof error === 'string' ? error : 'Erro ao excluir pista. Tente novamente.';
      alert(errorMessage);
    } finally {
      setShowConfirmModal(false);
      setPistaToDelete(null);
    }
  };

  const handleEdit = (pistaId) => {
    const pista = pistas.find(p => p.id === pistaId);
    setEditingPista(pista);
    setIsModalOpen(true);
  };

  const handleSavePista = async (updatedPista) => {
    try {
      if (updatedPista.status === 'backend') {
        // Atualizar no backend
        const { lugarService } = await import('../../../services/lugarService');
        await lugarService.atualizar(updatedPista.id, updatedPista);
        
        // Recarregar lista do backend
        await loadPistasBackend();
      } else {
        // Atualizar no localStorage
        const storageKey = updatedPista.status === 'aprovada' ? 'pistasAprovadas' : 'pistasRejeitadas';
        const pistasStorage = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const pistasAtualizadas = pistasStorage.map(p => p.id === updatedPista.id ? updatedPista : p);
        localStorage.setItem(storageKey, JSON.stringify(pistasAtualizadas));
      }
    } catch (error) {
      console.error('Erro ao salvar pista:', error);
      alert('Erro ao salvar pista. Tente novamente.');
    } finally {
      setIsModalOpen(false);
      setEditingPista(null);
    }
  };

  const handleCreatePista = (newPista) => {
    setPistas([...pistas, newPista]);
  };

  const toggleStatus = (pistaId) => {
    setPistas(pistas.map(pista => 
      pista.id === pistaId 
        ? { ...pista, active: !pista.active }
        : pista
    ));
  };

  const handleApprove = (pistaId) => {
    aprovarPista(pistaId);
  };

  const handleReject = (pistaId) => {
    rejeitarPista(pistaId);
  };

  const filteredPistas = useMemo(() => {
    return pistas.filter(pista => {
      const matchesSearch = pista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pista.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pista.rua.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pista.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pista.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'todas' || pista.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [pistas, searchTerm, filterStatus]);

  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <Header>
          <HeaderContent>
            <Title>Gerenciar Pistas</Title>
            <Subtitle>Gerencie todas as pistas de skate da plataforma</Subtitle>
          </HeaderContent>
        </Header>

        <SearchContainer>
          <SearchBar
            placeholder="Pesquisar pistas por nome, localização ou descrição..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </SearchContainer>

        <RefreshContainer>
          <RefreshButton onClick={loadPistasBackend} disabled={loading}>
            <FiRefreshCw size={16} />
            Atualizar
          </RefreshButton>
        </RefreshContainer>
        


        {loading ? (
          <EmptyState>
            <EmptyIcon>⏳</EmptyIcon>
            <EmptyText>Atualizando lista de pistas...</EmptyText>
            <EmptySubtext>Carregando dados do sistema</EmptySubtext>
          </EmptyState>
        ) : filteredPistas.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🛹</EmptyIcon>
            <EmptyText>{searchTerm ? 'Nenhuma pista encontrada' : 'Nenhuma pista cadastrada'}</EmptyText>
            <EmptySubtext>{searchTerm ? 'Tente pesquisar com outros termos' : 'As pistas aprovadas aparecerão aqui'}</EmptySubtext>
          </EmptyState>
        ) : (
          <PistaGrid>
            {filteredPistas.map((pista) => (
              <PistaCard key={pista.id}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <StatusBadge active={pista.active}>
                    {pista.active ? 'Ativa' : 'Inativa'}
                  </StatusBadge>
                  <StatusBadge 
                    style={{
                      background: pista.status === 'backend' ? '#e0f2fe' :
                                 pista.status === 'aprovada' ? '#dcfce7' : '#fee2e2',
                      color: pista.status === 'backend' ? '#0277bd' :
                             pista.status === 'aprovada' ? '#166534' : '#dc2626'
                    }}
                  >
                    {pista.status === 'backend' ? 'Aprovada' :
                     pista.status === 'aprovada' ? 'Aprovada' : 'Rejeitada'}
                  </StatusBadge>
                </div>
                
                <PistaTitle>{pista.nome}</PistaTitle>
                
                <PistaInfo>
                  <InfoRow>
                    <InfoLabel>Localização:</InfoLabel>
                    <span>{pista.localizacao || `${pista.rua || ''}, ${pista.bairro || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Não informado'}</span>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Descrição:</InfoLabel>
                    <span>{truncateDescription(pista.descricao)}</span>
                  </InfoRow>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                    {pista.tipo && (
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        <strong>Tipo: </strong>{pista.tipo}
                      </div>
                    )}
                    {pista.valor > 0 && (
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        <strong>Valor: </strong>R$ {pista.valor}
                      </div>
                    )}
                  </div>
                </PistaInfo>

                <ActionButtons>
                  <ActionButton className="edit" onClick={() => handleEdit(pista.id)}>
                    <FiEdit size={16} />
                    Editar
                  </ActionButton>
                  
                  <ActionButton 
                    className="status" 
                    active={pista.active}
                    onClick={() => toggleStatus(pista.id)}
                  >
                    {pista.active ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    {pista.active ? 'Ocultar' : 'Publicar'}
                  </ActionButton>
                  
                  <ActionButton className="delete" onClick={() => handleDelete(pista.id)}>
                    <FiTrash size={16} />
                    Excluir
                  </ActionButton>
                </ActionButtons>
              </PistaCard>
            ))}
          </PistaGrid>
        )}
      </ContentContainer>
      
      <EditPistaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPista(null);
        }}
        pista={editingPista}
        onSave={handleSavePista}
      />
      

      
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Excluir pista?"
        message={`Tem certeza que deseja excluir a pista "${pistaToDelete?.nome}"? Esta ação não pode ser desfeita.`}
      />
    </AdminContainer>
  );
};

export default Pistas;