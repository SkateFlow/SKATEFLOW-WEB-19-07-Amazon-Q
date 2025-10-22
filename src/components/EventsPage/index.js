import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { getEvents } from '../../services/eventService';
import { eventoService } from '../../services/eventService';
import EventPopup from '../EventPopupDescriptopn';
import CreateEventModal from '../CreateEventModal';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import placeholderImage from '../../assets/images/ph.svg';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Estilização do container principal da página de eventos
const EventsContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #bbdefb 100%);
  padding: 100px 0 20px;
  color: #1a237e;
  overflow-y: auto;

  h1 {
    margin-top: 20px;
    margin-bottom: 30px;
    color: #1a237e;
    font-weight: 700;
    font-size: 2.5rem;
  }
`;

const GridWrapper = styled.div`
  width: 100%;
  padding: 0 160px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 350px);
  column-gap: 0.5px;
  row-gap: 24px;
  padding: 24px 0;
  justify-content: center;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 300px);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    column-gap: 0.5px;
    row-gap: 20px;
    padding: 20px 0;
    justify-items: center;
  }
`;

const EventCard = styled.div`
  width: 100%;
  max-width: 300px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #1a237e 100%);
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(26, 35, 126, 0.15);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 16px;
  color: #000000ff;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a237e;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Badge = styled.span`
  background: #1a237e;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 8px;
`;

const CardDescription = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const BadgeOutline = styled.span`
  border: 1px solid #1a237e;
  color: #1a237e;
  background: rgba(26, 35, 126, 0.05);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const SearchAndButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
  max-width: 700px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const CreateEventButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1a237e;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  &:hover {
    background: #303f9f;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 45px 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  background: #ffffff;
  color: #374151;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #667eea;
  }

  &::placeholder {
    color: #64748b;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #4a5568;
  pointer-events: none;
`;

const ViewMoreButton = styled.button`
  background: #1a237e;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 30px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #303f9f;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const PopupContent = styled.div`
  background: #1D1E21;
  border-radius: 12px;
  padding: 20px;
  width: 95vw;
  height: 90vh;
  overflow-y: auto;
  position: relative;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: white;
`;

const CloseButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 20px;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: #ff6666;
  }
`;

const NotificationMessage = styled.div`
  position: fixed;
  top: 84px;
  left: 50%;
  transform: translateX(-50%) translateY(${props => props.show ? '0' : '-100%'});
  background: #11406dff;
  color: white;
  padding: 16px 32px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  display: inline-block;
  width: auto;
  min-width: fit-content;
  opacity: ${props => props.show ? 1 : 0};
  transition: all 0.3s ease;
`;

const PopupGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
`;

const SectionLabel = styled.h3`
  color: #64748b;
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 20px 0;
  text-align: left;
  width: 100%;
  padding-left: calc(50% - 525px);
  
  @media (max-width: 768px) {
    padding-left: 20px;
  }
`;



const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  
  const [events, setEvents] = useState([]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchEvents();
    window.scrollTo(0, 0);
    
    // Função para mostrar notificação quando já estiver na tela de eventos
    window.showEventsNotification = () => {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    };
    
    return () => {
      delete window.showEventsNotification;
    };
  }, []);



  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      console.log('Eventos carregados:', data);
      console.log('Status dos eventos:', data.map(e => ({ id: e.id, nome: e.nome, status: e.statusEvento })));
      if (data && data.length > 0) {
        // Filtrar apenas eventos ativados
        const eventosAtivos = data.filter(evento => evento.statusEvento === 'ativado');
        
        // Processar eventos para carregar fotos
        const eventosProcessados = eventosAtivos.map((evento) => {
          return {
            ...evento,
            nomeEvento: evento.nome,
            descricao: evento.info,
            dataEvento: evento.dataInicio ? new Date(evento.dataInicio).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit', 
              year: 'numeric'
            }) : 'Data não informada',
            horaEvento: evento.dataInicio ? new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            }) : '18:00',
            dataFim: evento.dataFim ? new Date(evento.dataFim).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit', 
              year: 'numeric'
            }) : null,
            horaFim: evento.dataFim ? new Date(evento.dataFim).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            }) : null,
            localEvento: evento.lugar_id?.nome || 'Local não informado',
            imagemEvento: evento.foto1 ? `data:image/jpeg;base64,${evento.foto1}` : placeholderImage,
            fotosEvento: [evento.foto1, evento.foto2, evento.foto3].filter(f => f).map(f => `data:image/jpeg;base64,${f}`),
            criadoPor: evento.usuario_id?.nome || 'Usuário não informado',
            statusEvento: evento.statusEvento,
            linkSite: evento.linkSite
          };
        });
        console.log('Eventos processados:', eventosProcessados);
        setEvents(eventosProcessados);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  const handleViewDetails = (event) => {
    console.log('Abrindo modal para evento:', encodeURIComponent(JSON.stringify(event)));
    setSelectedEvent(event);
  };

  const closeDetails = () => {
    setSelectedEvent(null);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const filteredEvents = events.filter(event =>
    event.nomeEvento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.localEvento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(b.dataEvento) - new Date(a.dataEvento));
  const displayedEvents = window.innerWidth <= 768 ? sortedEvents.slice(0, 3) : filteredEvents;
  
  const handleShowAllEvents = () => {
    setShowAllEvents(true);
  };
  
  const handleClosePopup = () => {
    setShowAllEvents(false);
  };

  const handleCreateEvent = () => {
    console.log('handleCreateEvent - isAuthenticated:', isAuthenticated);
    console.log('handleCreateEvent - user:', user);
    if (isAuthenticated && user) {
      setShowCreateModal(true);
    } else {
      localStorage.setItem('login_message', 'Você precisa estar logado para cadastrar um evento.');
      navigate('/login');
    }
  };

  const handleSaveEvent = (eventData) => {
    console.log('Evento criado:', eventData);
    // Recarregar eventos após criar
    fetchEvents();
    setShowCreateModal(false);
    
    // Mostrar notificação de sucesso
    if (user?.isOrganizador || user?.nivelAcesso === 'ADMIN') {
      setSuccessMessage('Evento cadastrado com sucesso!');
    } else {
      setSuccessMessage('Solicitação de evento enviada com sucesso!');
    }
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  return (
    <>

      <Sidebar isOpen={isOpen} toggle={toggle}/>
      <Navbar toggle={toggle} scrollNav={true}/>
      <NotificationMessage show={showNotification}>
        Você já está nessa página!
      </NotificationMessage>
      <NotificationMessage show={showSuccessNotification} style={{ background: '#10b981' }}>
        {successMessage}
      </NotificationMessage>
      <EventsContainer>
        <h1>Eventos</h1>
        <SearchAndButtonContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Pesquisar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
          </SearchContainer>
          <CreateEventButton onClick={handleCreateEvent}>
            <FaPlus />
            {(user?.isOrganizador || user?.nivelAcesso === 'ADMIN') ? 'Criar Evento' : 'Solicitar Evento'}
          </CreateEventButton>
        </SearchAndButtonContainer>
        <SectionLabel>Recentes</SectionLabel>
        <GridWrapper>
          <GridContainer>
            {displayedEvents.map((event) => (
              <EventCard key={event.id} onClick={() => handleViewDetails(event)}>
                <CardImage 
                  src={event.imagemEvento || placeholderImage} 
                  alt={event.nomeEvento}
                />
                <CardContent>
                  <CardHeader>
                    <CardTitle>{event.nomeEvento}</CardTitle>
                    <Badge>NOVO</Badge>
                  </CardHeader>
                  <CardDescription>{truncateText(event.descricao, 50)}</CardDescription>
                  <CardActions>
                    <BadgeOutline>{event.dataEvento}</BadgeOutline>
                    <BadgeOutline>{event.localEvento}</BadgeOutline>
                  </CardActions>
                </CardContent>
              </EventCard>
            ))}
          </GridContainer>
        </GridWrapper>
        
        <ViewMoreButton onClick={handleShowAllEvents}>
          Ver mais eventos
        </ViewMoreButton>

        {showAllEvents && (
          <PopupOverlay onClick={handleClosePopup}>
            <PopupContent onClick={(e) => e.stopPropagation()}>
              <PopupHeader>
                <h2>Todos os Eventos</h2>
                <CloseButton onClick={handleClosePopup}>×</CloseButton>
              </PopupHeader>
              <PopupGrid>
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} onClick={() => handleViewDetails(event)}>
                    <CardImage 
                      src={event.imagemEvento || placeholderImage} 
                      alt={event.nomeEvento}
                    />
                    <CardContent>
                      <CardHeader>
                        <CardTitle>{event.nomeEvento}</CardTitle>
                        <Badge>NOVO</Badge>
                      </CardHeader>
                      <CardDescription>{event.descricao}</CardDescription>
                      <CardActions>
                        <BadgeOutline>{event.dataEvento}</BadgeOutline>
                        <BadgeOutline>{event.localEvento}</BadgeOutline>
                      </CardActions>
                    </CardContent>
                  </EventCard>
                ))}
              </PopupGrid>
            </PopupContent>
          </PopupOverlay>
        )}

        {selectedEvent && (
          <EventPopup event={selectedEvent} onClose={closeDetails} />
        )}

        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveEvent}
        />
      </EventsContainer>
    </>
  );
};

export default EventsPage;