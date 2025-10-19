import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash, FiEye, FiEyeOff } from 'react-icons/fi';
import SidebarAdmin from '../../../components/SidebarAdmin';
import SearchBar from '../../../components/SearchBar';
import ConfirmModal from '../../../components/ConfirmModal';
import EditEventModal from '../../../components/EditEventModal';

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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      setLoading(true);
      const { eventoService } = await import('../../../services/eventService');
      const data = await eventoService.listar();
      
      const eventosFormatados = data.map(evento => ({
        id: evento.id,
        nomeEvento: evento.nome,
        dataEvento: evento.dataInicio ? new Date(evento.dataInicio).toLocaleDateString('pt-BR') : 'Não informado',
        localEvento: evento.lugar_id?.nome || 'Local não informado',
        descricao: evento.info,
        dataInicio: evento.dataInicio,
        dataFim: evento.dataFim,
        active: evento.statusEvento === 'ativado'
      }));
      
      setEvents(eventosFormatados);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (eventId) => {
    const event = events.find(e => e.id === eventId);
    setEventToDelete(event);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const { eventoService } = await import('../../../services/eventService');
      await eventoService.deletar(eventToDelete.id);
      
      setEvents(events.filter(event => event.id !== eventToDelete.id));
      setShowConfirmModal(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      alert('Erro ao deletar evento');
    }
  };

  const handleEdit = async (eventId) => {
    try {
      const { eventoService } = await import('../../../services/eventService');
      
      // Buscar dados completos do evento
      const eventoCompleto = await eventoService.buscarPorId(eventId);
      
      // Carregar fotos
      const [foto1, foto2, foto3] = await Promise.all([
        eventoService.buscarFoto1(eventId).catch(() => null),
        eventoService.buscarFoto2(eventId).catch(() => null),
        eventoService.buscarFoto3(eventId).catch(() => null)
      ]);
      
      const fotos = [
        foto1 ? `data:image/jpeg;base64,${foto1}` : '',
        foto2 ? `data:image/jpeg;base64,${foto2}` : '',
        foto3 ? `data:image/jpeg;base64,${foto3}` : ''
      ];
      
      // Formatar dados para o modal
      const eventoFormatado = {
        id: eventoCompleto.id,
        nomeEvento: eventoCompleto.nome,
        descricao: eventoCompleto.info,
        dataInicio: eventoCompleto.dataInicio,
        dataFim: eventoCompleto.dataFim,
        ativo: eventoCompleto.statusEvento === 'ativado',
        fotos: fotos,
        publicadoPor: eventoCompleto.usuario_id?.nome || 'Usuário não informado',
        dataCadastro: eventoCompleto.dataCadastro ? new Date(eventoCompleto.dataCadastro).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')
      };
      
      setSelectedEvent(eventoFormatado);
      setShowEditModal(true);
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
      alert('Erro ao carregar dados do evento');
    }
  };

  const handleSaveEvent = async (updatedEvent) => {
    try {
      const { eventoService } = await import('../../../services/eventService');
      
      // Preparar dados para o backend
      const eventoData = {
        nome: updatedEvent.nomeEvento,
        info: updatedEvent.descricao,
        dataInicio: updatedEvent.dataInicio,
        dataFim: updatedEvent.dataFim,
        statusEvento: updatedEvent.ativo ? 'ativado' : 'inativo'
      };
      
      await eventoService.atualizar(updatedEvent.id, eventoData);
      
      // Salvar fotos se foram alteradas
      if (updatedEvent.fotos) {
        for (let i = 0; i < updatedEvent.fotos.length; i++) {
          if (updatedEvent.fotos[i] && updatedEvent.fotos[i].startsWith('data:image/')) {
            const fotoBase64 = updatedEvent.fotos[i].split(',')[1];
            try {
              await eventoService[`salvarFoto${i + 1}`](updatedEvent.id, fotoBase64);
            } catch (error) {
              console.error(`Erro ao salvar foto ${i + 1}:`, error);
            }
          }
        }
      }
      
      // Atualizar lista local
      setEvents(events.map(event => 
        event.id === updatedEvent.id ? {
          ...event,
          nomeEvento: updatedEvent.nomeEvento,
          descricao: updatedEvent.descricao,
          dataInicio: updatedEvent.dataInicio,
          dataFim: updatedEvent.dataFim,
          active: updatedEvent.ativo
        } : event
      ));
      
      alert('Evento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      alert('Erro ao atualizar evento');
    }
  };

  const toggleStatus = async (eventId) => {
    try {
      const event = events.find(e => e.id === eventId);
      const { eventoService } = await import('../../../services/eventService');
      
      // Buscar dados completos do evento
      const eventoCompleto = await eventoService.buscarPorId(eventId);
      
      await eventoService.atualizar(eventId, {
        ...eventoCompleto,
        statusEvento: event.active ? 'inativo' : 'ativado'
      });
      
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, active: !event.active }
          : event
      ));
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status do evento');
    }
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