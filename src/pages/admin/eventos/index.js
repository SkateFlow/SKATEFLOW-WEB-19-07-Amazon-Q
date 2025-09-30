import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getEvents, deleteEvent } from '../../../services/eventService';
import SidebarAdmin from '../../../components/SidebarAdmin';

const AdminContainer = styled.div`
  background-color: white;
  color: black;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  margin-left: 250px;
  padding: 50px;
  text-align: center;
`;



const EventList = styled.div`
  margin-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledTh = styled.th`
  padding: 15px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const StyledTd = styled.td`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  background-color: ${({ index }) => (index % 2 === 0 ? '#f3f3f3' : '#ffffff')};

  &:hover {
    background-color: #e0f7fa;
  }
`;

const ActionButton = styled.button`
  margin: 0 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &.delete {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const Eventos = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const handleDelete = async (eventId) => {
    await deleteEvent(eventId);
    fetchEvents();
  };

  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <EventList>
          <StyledTable>
            <thead>
              <tr>
                <StyledTh>Nome</StyledTh>
                <StyledTh>Data</StyledTh>
                <StyledTh>Local</StyledTh>
                <StyledTh>Descrição</StyledTh>
                <StyledTh>Ações</StyledTh>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event.id}>
                  <StyledTd index={index}>{event.nomeEvento}</StyledTd>
                  <StyledTd index={index}>{event.dataEvento}</StyledTd>
                  <StyledTd index={index}>{event.localEvento}</StyledTd>
                  <StyledTd index={index}>{event.descricao}</StyledTd>
                  <StyledTd index={index}>
                    <ActionButton onClick={() => handleDelete(event.id)} className="delete">
                      Excluir
                    </ActionButton>
                  </StyledTd>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </EventList>


      </ContentContainer>
    </AdminContainer>
  );
};

export default Eventos;