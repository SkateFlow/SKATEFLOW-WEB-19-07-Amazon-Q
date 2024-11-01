import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService';
import { Form } from '../../LoginPage/LoginElements';
import SidebarAdmin from '../SidebarAdmin';

const AdminContainer = styled.div`
  display: flex;
  background-color: white;
  color: black;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 50px;
  padding-left: 300px;
  flex-grow: 1;
  text-align: center;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const StyledTextarea = styled.textarea`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const EventList = styled.div`
  margin-top: 20px; // Espaçamento acima
  margin-bottom: 30px; // Espaçamento entre a lista e o formulário
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

  &.edit {
    background-color: #ffc107;

    &:hover {
      background-color: #e0a800;
    }
  }

  &.delete {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const AdminPage = () => {
  const [event, setEvent] = useState({ id: null, nomeEvento: '', dataEvento: '', localEvento: '', descricao: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [events, setEvents] = useState([]);

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
    resetForm();
    fetchEvents();
  };

  const handleEdit = (eventToEdit) => {
    setEvent(eventToEdit);
    setIsEditing(true);
  };

  const handleDelete = async (eventId) => {
    await deleteEvent(eventId);
    fetchEvents();
  };

  const resetForm = () => {
    setEvent({ id: null, nomeEvento: '', dataEvento: '', localEvento: '', descricao: '' });
    setIsEditing(false);
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
                    <ActionButton onClick={() => handleEdit(event)} className="edit">
                      Editar
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(event.id)} className="delete">
                      Excluir
                    </ActionButton>
                  </StyledTd>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </EventList>

        <StyledForm onSubmit={handleSubmit}>
          <StyledInput
            type="text"
            name="nomeEvento"
            value={event.nomeEvento}
            onChange={handleInputChange}
            placeholder="Nome do Evento"
            required
          />
          <StyledInput
            type="date"
            name="dataEvento"
            value={event.dataEvento}
            onChange={handleInputChange}
            required
          />
          <StyledInput
            type="text"
            name="localEvento"
            value={event.localEvento}
            onChange={handleInputChange}
            placeholder="Local do Evento"
            required
          />
          <StyledTextarea
            name="descricao"
            value={event.descricao}
            onChange={handleInputChange}
            placeholder="Descrição do Evento"
            required
            rows="4"
          />
          <SubmitButton type="submit">{isEditing ? 'Atualizar' : 'Criar'} Evento</SubmitButton>
        </StyledForm>
      </ContentContainer>
    </AdminContainer>
  );
};

export default AdminPage;
