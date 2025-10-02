import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash, FiEye, FiEyeOff } from 'react-icons/fi';
import SidebarAdmin from '../../../components/SidebarAdmin';
import SearchBar from '../../../components/SearchBar';
import ConfirmModal from '../../../components/ConfirmModal';
import EditEventModal from '../../../components/EditEventModal';

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

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const EventCard = styled.div`
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

const EventTitle = styled.h3`
  color: #1a237e;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const EventInfo = styled.div`
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

const Eventos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      nomeEvento: 'Campeonato de Street',
      dataEvento: '2024-02-15',
      localEvento: 'Praça da Sé',
      descricao: 'Competição de street skating',
      dataInicio: '2024-02-15T10:00',
      dataFim: '2024-02-15T18:00',
      cep: '01001000',
      rua: 'Praça da Sé',
      bairro: 'Sé',
      numero: 's/n',
      ativo: true,
      fotos: ['', '', ''],
      dataCadastro: '10/01/2024',
      publicadoPor: 'Admin',
      active: true
    },
    {
      id: 2,
      nomeEvento: 'Workshop de Manobras',
      dataEvento: '2024-02-20',
      localEvento: 'Skate Park Central',
      descricao: 'Aulas para iniciantes',
      dataInicio: '2024-02-20T14:00',
      dataFim: '2024-02-20T17:00',
      cep: '01305100',
      rua: 'Rua Augusta',
      bairro: 'Centro',
      numero: '1000',
      ativo: false,
      fotos: ['', '', ''],
      dataCadastro: '12/01/2024',
      publicadoPor: 'Admin',
      active: false
    }
  ]);

  const handleDelete = (eventId) => {
    const event = events.find(e => e.id === eventId);
    setEventToDelete(event);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setEvents(events.filter(event => event.id !== eventToDelete.id));
    setShowConfirmModal(false);
    setEventToDelete(null);
  };

  const handleEdit = (eventId) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleSaveEvent = (updatedEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const toggleStatus = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, active: !event.active }
        : event
    ));
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      event.nomeEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.localEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <Header>
          <Title>Gerenciar Eventos</Title>
          <Subtitle>Gerencie todos os eventos da plataforma</Subtitle>
        </Header>

        <SearchContainer>
          <SearchBar
            placeholder="Pesquisar eventos por nome, local ou descrição..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </SearchContainer>

        {filteredEvents.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📅</EmptyIcon>
            <EmptyText>{searchTerm ? 'Nenhum evento encontrado' : 'Nenhum evento cadastrado'}</EmptyText>
            <EmptySubtext>{searchTerm ? 'Tente pesquisar com outros termos' : 'Os eventos adicionados aparecerão aqui'}</EmptySubtext>
          </EmptyState>
        ) : (
          <EventGrid>
            {filteredEvents.map((event) => (
              <EventCard key={event.id}>
                <StatusBadge active={event.active}>
                  {event.active ? 'Ativo' : 'Inativo'}
                </StatusBadge>
                
                <EventTitle>{event.nomeEvento}</EventTitle>
                
                <EventInfo>
                  <InfoRow>
                    <InfoLabel>Data:</InfoLabel>
                    <span>{event.dataEvento}</span>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Local:</InfoLabel>
                    <span>{event.localEvento}</span>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Descrição:</InfoLabel>
                    <span>{event.descricao}</span>
                  </InfoRow>
                </EventInfo>

                <ActionButtons>
                  <ActionButton className="edit" onClick={() => handleEdit(event.id)}>
                    <FiEdit size={16} />
                    Editar
                  </ActionButton>
                  
                  <ActionButton 
                    className="status" 
                    active={event.active}
                    onClick={() => toggleStatus(event.id)}
                  >
                    {event.active ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    {event.active ? 'Ocultar' : 'Publicar'}
                  </ActionButton>
                  
                  <ActionButton className="delete" onClick={() => handleDelete(event.id)}>
                    <FiTrash size={16} />
                    Excluir
                  </ActionButton>
                </ActionButtons>
              </EventCard>
            ))}
          </EventGrid>
        )}
        
        <EditEventModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          event={selectedEvent}
          onSave={handleSaveEvent}
        />
        
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
          title="Excluir evento?"
          message={`Tem certeza que deseja excluir o evento "${eventToDelete?.nomeEvento}"? Esta ação não pode ser desfeita.`}
        />
      </ContentContainer>
    </AdminContainer>
  );
};

export default Eventos;