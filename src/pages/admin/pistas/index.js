import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash, FiEye, FiEyeOff } from 'react-icons/fi';
import SidebarAdmin from '../../../components/SidebarAdmin';
import SearchBar from '../../../components/SearchBar';

const AdminContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  margin-left: 250px;
  padding: 40px;
`;

const Header = styled.div`
  margin-bottom: 30px;
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

const PistaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
  min-width: 80px;
  color: #475569;
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
  const [pistas, setPistas] = useState([
    {
      id: 1,
      nome: 'Skate Park Central',
      localizacao: 'Centro da Cidade',
      descricao: 'Pista completa com bowls e street',
      active: true
    },
    {
      id: 2,
      nome: 'Pista da Praça',
      localizacao: 'Praça da Sé',
      descricao: 'Pista de street skating',
      active: false
    }
  ]);

  const handleDelete = (pistaId) => {
    setPistas(pistas.filter(pista => pista.id !== pistaId));
  };

  const handleEdit = (pistaId) => {
    console.log('Editar pista:', pistaId);
  };

  const toggleStatus = (pistaId) => {
    setPistas(pistas.map(pista => 
      pista.id === pistaId 
        ? { ...pista, active: !pista.active }
        : pista
    ));
  };

  const filteredPistas = useMemo(() => {
    return pistas.filter(pista =>
      pista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pista.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pista.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pistas, searchTerm]);

  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <Header>
          <Title>Gerenciar Pistas</Title>
          <Subtitle>Gerencie todas as pistas de skate da plataforma</Subtitle>
        </Header>

        <SearchContainer>
          <SearchBar
            placeholder="Pesquisar pistas por nome, localização ou descrição..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </SearchContainer>

        {filteredPistas.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🛹</EmptyIcon>
            <EmptyText>{searchTerm ? 'Nenhuma pista encontrada' : 'Nenhuma pista cadastrada'}</EmptyText>
            <EmptySubtext>{searchTerm ? 'Tente pesquisar com outros termos' : 'As pistas adicionadas aparecerão aqui'}</EmptySubtext>
          </EmptyState>
        ) : (
          <PistaGrid>
            {filteredPistas.map((pista) => (
              <PistaCard key={pista.id}>
                <StatusBadge active={pista.active}>
                  {pista.active ? 'Ativa' : 'Inativa'}
                </StatusBadge>
                
                <PistaTitle>{pista.nome}</PistaTitle>
                
                <PistaInfo>
                  <InfoRow>
                    <InfoLabel>Localização:</InfoLabel>
                    <span>{pista.localizacao}</span>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Descrição:</InfoLabel>
                    <span>{pista.descricao}</span>
                  </InfoRow>
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
    </AdminContainer>
  );
};

export default Pistas;