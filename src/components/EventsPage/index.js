// EventsPage.js
import React from 'react';
import styled from 'styled-components';
import NavbarEvents from '../NavbarEvent';

const EventsContainer = styled.div`
   min-height: 120vh;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   background: rgb(0,41,79);
   background: linear-gradient(90deg, rgba(0,41,79,1) 0%, rgba(0,20,38,1) 35%, rgba(0,20,38,1) 100%);
   padding: 50px 0;
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
  background-color: #f8f9fa;
  color: black;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 40px);
  }

  @media (max-width: 480px) {
    flex: 1 1 100%;
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

const EventsPage = ({ events, deleteEvent, editEvent }) => {
  return (
    <>
      <NavbarEvents />
      <EventsContainer>
        <EventCardsContainer>
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.id}>
                <h2>{event.nomeEvento}</h2>
                <p>Data: {event.dataEvento}</p>
                <p>Local: {event.localEvento}</p>
                <p>Descrição: {event.descricao}</p>
                <button onClick={() => editEvent(event)}>Editar</button>
                <button onClick={() => deleteEvent(event.id)} className="delete">Excluir</button>
              </EventCard>
            ))
          ) : (
            <p>Nenhum evento encontrado.</p> // Mensagem quando não há eventos
          )}
        </EventCardsContainer>
      </EventsContainer>
    </>
  );
};

export default EventsPage;
