import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NavbarEvents from '../NavbarEvent';
import { getEvents } from '../../services/eventService';
import EventDetails from '../../components/EventsPage/EventsDetails';
import placeholderImage from '../../assets/images/ph.svg';

// Estilização do container principal da página de eventos
const EventsContainer = styled.div`
  min-height: 120vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(0, 41, 79);
  background: linear-gradient(90deg, rgba(0, 41, 79, 1) 0%, rgba(0, 20, 38, 1) 35%, rgba(0, 20, 38, 1) 100%);
  padding: 50px 0;
  color: white;
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
  border-radius: 10px;
  background-color: #00274d;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;

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
    border-radius: 8px; /* Arredondando as bordas da imagem */
  }

  &:hover {
    transform: translateY(-5px); /* Levanta o cartão ao passar o mouse */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5); /* Sombra mais intensa */
  }

  button {
    margin-top: 10px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px; /* Arredondando as bordas do botão */
    cursor: pointer;
    margin-right: 10px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3; /* Escurecendo a cor ao passar o mouse */
    }
  }

  button.delete {
    background-color: #ff0000;

    &:hover {
      background-color: #cc0000; /* Escurecendo a cor ao passar o mouse */
    }
  }
`;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Efeito para buscar eventos ao carregar o componente
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  // Função para lidar com a exclusão de eventos
  // const handleDelete = async (id) => {
  //   await deleteEvent(id);
  //   fetchEvents();
  // };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <NavbarEvents />
      <EventsContainer>
        <h1>Eventos</h1>
        <EventCardsContainer>
          {events.map((event) => (
            <EventCard key={event.id}>
              <h2>{event.nomeEvento}</h2>
              <p><strong>Data:</strong> {event.dataEvento}</p>
              <p><strong>Local:</strong> {event.localEvento}</p>
              <p><strong>Descrição:</strong> {event.descricao}</p>
              <img src={event.imagemEvento || placeholderImage} alt={event.nomeEvento} />
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