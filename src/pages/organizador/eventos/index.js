import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import SidebarOrganizador from '../../../components/SidebarOrganizador';
import CreateEventModal from '../../../components/CreateEventModal';
import EditEventModal from '../../../components/EditEventModal';
import { useAuth } from '../../../context/AuthContext';
import { eventoService } from '../../../services/eventService';
import api from '../../../utils/api';

const Container = styled.div`
  background: 
    radial-gradient(circle at 20% 80%, #d0e6ffff 0%, transparent 25%),
    radial-gradient(circle at 80% 20%, #c4e0ffff 0%, transparent 25%),
    radial-gradient(circle at 40% 40%, #ffffff 0%, transparent 25%),
    #f8fafc;
  min-height: 100vh;
`;

const Content = styled.div`
  margin-left: 250px;
  padding: 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const HeaderContent = styled.div``;

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

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #1a237e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #303f9f;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const EventCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const EventImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #1a237e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
`;

const EventContent = styled.div`
  padding: 20px;
`;

const EventTitle = styled.h3`
  color: #1a237e;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const EventDescription = styled.p`
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const EventMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const EventDate = styled.span`
  color: #374151;
  font-size: 14px;
  font-weight: 500;
`;

const EventStatus = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.status === 'ativado' ? '#dcfce7' : '#fef3c7'};
  color: ${props => props.status === 'ativado' ? '#166534' : '#92400e'};
`;

const EventActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    if (props.variant === 'view') return `
      background: #e0f2fe;
      color: #0277bd;
      &:hover { background: #b3e5fc; }
    `;
    if (props.variant === 'edit') return `
      background: #f3e8ff;
      color: #7c3aed;
      &:hover { background: #e9d5ff; }
    `;
    if (props.variant === 'delete') return `
      background: #fee2e2;
      color: #dc2626;
      &:hover { background: #fecaca; }
    `;
  }}
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

const EventosOrganizador = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventImages, setEventImages] = useState({});

  useEffect(() => {
    loadEventos();
  }, [user]);

  const loadEventos = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/evento/usuario/${user.id}`);
      setEventos(response.data);
      
      // Carregar imagens dos eventos
      const images = {};
      for (const evento of response.data) {
        try {
          const foto1 = await eventoService.buscarFoto1(evento.id);
          if (foto1) {
            images[evento.id] = `data:image/jpeg;base64,${foto1}`;
          }
        } catch (error) {
          console.error(`Erro ao carregar foto do evento ${evento.id}:`, error);
        }
      }
      setEventImages(images);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    await loadEventos(); // Recarrega a lista após criar
  };

  const handleDeleteEvent = async (eventoId) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await eventoService.deletar(eventoId);
        await loadEventos();
      } catch (error) {
        alert('Erro ao excluir evento: ' + error);
      }
    }
  };

  const handleEditEvent = async (evento) => {
    try {
      // Buscar fotos do evento
      const foto1 = await eventoService.buscarFoto1(evento.id);
      const foto2 = await eventoService.buscarFoto2(evento.id);
      const foto3 = await eventoService.buscarFoto3(evento.id);
      
      setSelectedEvent({
        ...evento,
        nomeEvento: evento.nome,
        descricao: evento.info,
        dataInicio: evento.dataInicio,
        dataFim: evento.dataFim,
        ativo: evento.statusEvento === 'ativado',
        fotos: [
          foto1 ? `data:image/jpeg;base64,${foto1}` : '',
          foto2 ? `data:image/jpeg;base64,${foto2}` : '',
          foto3 ? `data:image/jpeg;base64,${foto3}` : ''
        ]
      });
      setShowEditModal(true);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      setSelectedEvent({
        ...evento,
        nomeEvento: evento.nome,
        descricao: evento.info,
        dataInicio: evento.dataInicio,
        dataFim: evento.dataFim,
        ativo: evento.statusEvento === 'ativado',
        fotos: ['', '', '']
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async (eventData) => {
    try {
      const updateData = {
        nome: eventData.nomeEvento,
        info: eventData.descricao,
        dataInicio: eventData.dataInicio,
        dataFim: eventData.dataFim,
        statusEvento: eventData.ativo ? 'ativado' : 'pendente',
        usuario_id: selectedEvent.usuario_id
      };
      await eventoService.atualizar(eventData.id, updateData);
      
      // Atualizar fotos se foram alteradas
      if (eventData.fotos) {
        if (eventData.fotos[0]) {
          const base64_1 = eventData.fotos[0].split(',')[1] || eventData.fotos[0];
          await eventoService.salvarFoto1(eventData.id, base64_1);
        }
        if (eventData.fotos[1]) {
          const base64_2 = eventData.fotos[1].split(',')[1] || eventData.fotos[1];
          await eventoService.salvarFoto2(eventData.id, base64_2);
        }
        if (eventData.fotos[2]) {
          const base64_3 = eventData.fotos[2].split(',')[1] || eventData.fotos[2];
          await eventoService.salvarFoto3(eventData.id, base64_3);
        }
      }
      
      await loadEventos();
      alert('Evento atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar evento: ' + error);
    }
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Container>
      <SidebarOrganizador />
      <Content>
        <Header>
          <HeaderContent>
            <Title>Meus Eventos</Title>
            <Subtitle>Gerencie todos os seus eventos</Subtitle>
          </HeaderContent>
          <CreateButton onClick={() => setShowCreateModal(true)}>
            <FiPlus size={16} />
            Criar Evento
          </CreateButton>
        </Header>

        {loading ? (
          <EmptyState>
            <EmptyIcon>⏳</EmptyIcon>
            <EmptyText>Carregando eventos...</EmptyText>
          </EmptyState>
        ) : eventos.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📅</EmptyIcon>
            <EmptyText>Nenhum evento criado</EmptyText>
            <p>Crie seu primeiro evento clicando no botão acima</p>
          </EmptyState>
        ) : (
          <EventsGrid>
            {eventos.map((evento) => (
              <EventCard key={evento.id}>
                <EventImage>
                  {eventImages[evento.id] ? (
                    <img 
                      src={eventImages[evento.id]} 
                      alt={evento.nome}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    '📅'
                  )}
                </EventImage>
                <EventContent>
                  <EventTitle>{evento.nome}</EventTitle>
                  <EventDescription>
                    {evento.info?.substring(0, 100)}
                    {evento.info?.length > 100 ? '...' : ''}
                  </EventDescription>
                  <EventMeta>
                    <EventDate>
                      {formatDate(evento.dataInicio)}
                    </EventDate>
                    <EventStatus status={evento.statusEvento}>
                      {evento.statusEvento === 'ativado' ? 'Ativo' : 'Pendente'}
                    </EventStatus>
                  </EventMeta>
                  <EventActions>
                    <ActionButton 
                      variant="edit"
                      onClick={() => handleEditEvent(evento)}
                    >
                      <FiEdit size={14} />
                      Editar
                    </ActionButton>
                    <ActionButton 
                      variant="delete"
                      onClick={() => handleDeleteEvent(evento.id)}
                    >
                      <FiTrash2 size={14} />
                      Excluir
                    </ActionButton>
                  </EventActions>
                </EventContent>
              </EventCard>
            ))}
          </EventsGrid>
        )}

        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateEvent}
        />

        <EditEventModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          event={selectedEvent}
          onSave={handleSaveEdit}
        />
      </Content>
    </Container>
  );
};

export default EventosOrganizador;