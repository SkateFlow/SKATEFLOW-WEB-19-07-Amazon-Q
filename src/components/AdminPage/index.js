// EventsPage.js
import React from 'react';
import styled from 'styled-components';

const EventsList = styled.div`
  margin: 20px auto;
  width: 80%;
`;

const EventItem = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
`;

const Button = styled.button`
  margin: 5px;
`;

const EventsPage = ({ events, deleteEvent, editEvent }) => {
  return (
    <EventsList>
      {events.map((event) => (
        <EventItem key={event.id}>
          <h3>{event.nomeEvento}</h3>
          <p>Data: {event.dataEvento}</p>
          <p>Local: {event.localEvento}</p>
          <p>Descrição: {event.descricao}</p>
          <Button onClick={() => editEvent(event)}>Editar</Button>
          <Button onClick={() => deleteEvent(event.id)}>Excluir</Button>
        </EventItem>
      ))}
    </EventsList>
  );
};

export default EventsPage;
