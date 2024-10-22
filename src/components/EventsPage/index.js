import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../Navbar';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService';
import EventDetails from '../../components/EventsPage/EventsDetails';
import { Form } from '../../LoginPage/LoginElements';

const EventsContainer = styled.div`
  padding: 50px;
  text-align: center;
  background-color: black;
  color: white;
  min-height: 100vh;
`;

const EventCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
`;

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
  const [selectedEvent, setSelectedEvent] = useState(null); // Para armazenar o evento selecionado

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
    setSelectedEvent(event); // Quando um evento é clicado, exibir seus detalhes
  };

  const closeDetails = () => {
    setSelectedEvent(null); // Fechar a exibição de detalhes
  };

  return (
    <>
      <Navbar />
      <EventsContainer>
        <h1>Eventos de Skate</h1>
        <Form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nomeEvento"
            value={event.nomeEvento}
            onChange={handleInputChange}
            placeholder="Nome do Evento"
            required
          />
          <input
            type="date"
            name="dataEvento"
            value={event.dataEvento}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="localEvento"
            value={event.localEvento}
            onChange={handleInputChange}
            placeholder="Local do Evento"
            required
          />
          <textarea
            name="descricao"
            value={event.descricao}
            onChange={handleInputChange}
            placeholder="Descrição do Evento"
            required
          />
          <button type="submit">{isEditing ? 'Atualizar' : 'Criar'} Evento</button>
        </Form>

        <EventCardsContainer>
          {events.map((event) => (
            <EventCard key={event.id}>
              <h2>{event.nomeEvento}</h2>
              <p>Data: {event.dataEvento}</p>
              <p>Local: {event.localEvento}</p>
              <p>Descrição: {event.descricao}</p>
              <img src={event.imagemEvento || require('../../images/ph.svg').default} alt={event.nomeEvento} />
              <button onClick={() => handleViewDetails(event)}>Visualizar</button>
              <button onClick={() => handleEdit(event)}>Editar</button>
              <button className="delete" onClick={() => handleDelete(event.id)}>Deletar</button>
            </EventCard>
          ))}
        </EventCardsContainer>

        {selectedEvent && <EventDetails event={selectedEvent} onClose={closeDetails} />} {/* Exibir detalhes se um evento estiver selecionado */}
      </EventsContainer>
    </>
  );
};

export default EventsPage;
