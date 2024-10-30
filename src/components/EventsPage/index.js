import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NavbarEvents from '../NavbarEvent'; // Importe o NavbarEvents
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService';
import EventDetails from '../../components/EventsPage/EventsDetails';


// Estilização do container principal da página de eventos
const EventsContainer = styled.div`
  padding: 50px;
  text-align: center;
  background-color: black;
  color: white;
  min-height: 100vh;
`;

// Estilização do container de cartões de eventos
const EventCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
`;

// Estilização de cada cartão de evento
const EventCard = styled.div`
  flex: 1 1 calc(33.333% - 40px); 
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #001426;
  color: white;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 40px); 
  }

  @media (max-width: 480px) {
    flex: 1 1 100%; 
  }

  img {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
  }

  button {
    margin-top: 10px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    margin-right: 10px;
  }

  button.delete {
    background-color: #ff0000;
  }
`;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({ id: null, nomeEvento: '', dataEvento: '', localEvento: '', descricao: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); 

  // Efeito para buscar eventos ao carregar o componente
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateEvent(event);
    } else {
      await createEvent(event);
    }
    // Limpa o formulário e atualiza a lista de eventos
    setEvent({ id: null, nomeEvento: '', dataEvento: '', localEvento: '', descricao: '' });
    setIsEditing(false);
    fetchEvents();
  };

  const handleEdit = (eventToEdit) => {
    setEvent(eventToEdit);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    fetchEvents();
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <>
     

      <EventsContainer>
      <NavbarEvents /> 
       

        <EventCardsContainer>
          {events.map((event) => (
            <EventCard key={event.id}>
              <h2>{event.nomeEvento}</h2>
              <p>Data: {event.dataEvento}</p>
              <p>Local: {event.localEvento}</p>
              <p>Descrição: {event.descricao}</p>
              <img src={event.imagemEvento || require('../../images/ph.svg').default} alt={event.nomeEvento} />
              <button onClick={() => handleViewDetails(event)}>Visualizar</button>
            </EventCard>
          ))}
        </EventCardsContainer>

        {selectedEvent && <EventDetails event={selectedEvent} onClose={closeDetails} />}
      </EventsContainer>
    </>
  );
};

export default EventsPage;
