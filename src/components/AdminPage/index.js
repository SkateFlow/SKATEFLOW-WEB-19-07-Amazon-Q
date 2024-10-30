
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService';
import { Form } from '../../LoginPage/LoginElements';
import SidebarAdmin from '../SidebarAdmin';

const AdminContainer = styled.div`
  display: flex; /* Utiliza flexbox para alinhar a barra lateral e o conteúdo */
  background-color: black;
  color: white;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 50px;
  padding-left: 300px; /* Ajusta o padding esquerdo para dar espaço ao sidebar */
  flex-grow: 1; /* Permite que o conteúdo ocupe o espaço restante */
  text-align: center;
`;

const EventList = styled.div`
  margin-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate; /* Permite o espaçamento entre as células */
  border-spacing: 0 10px; /* Define o espaçamento entre as linhas */
`;

const StyledTh = styled.th`
  padding: 15px; /* Adiciona padding nas células do cabeçalho */
  border: 1px solid #fff; /* Adiciona borda nas células do cabeçalho */
`;

const StyledTd = styled.td`
  padding: 15px; /* Adiciona padding nas células */
  border: 1px solid #fff; /* Adiciona borda nas células */
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
      <SidebarAdmin /> {/* Adiciona a barra lateral */}
      <ContentContainer>
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

        <EventList>
          <StyledTable className="table table-striped table-hover">
            <thead>
              <tr>
                <StyledTh scope="col">Nome</StyledTh>
                <StyledTh scope="col">Data</StyledTh>
                <StyledTh scope="col">Local</StyledTh>
                <StyledTh scope="col">Descrição</StyledTh>
                <StyledTh scope="col">Ações</StyledTh>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <StyledTd>{event.nomeEvento}</StyledTd>
                  <StyledTd>{event.dataEvento}</StyledTd>
                  <StyledTd>{event.localEvento}</StyledTd>
                  <StyledTd>{event.descricao}</StyledTd>
                  <StyledTd>
                    <button onClick={() => handleEdit(event)} className="btn btn-sm btn-warning rounded">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="btn btn-sm btn-danger rounded">
                      Excluir
                    </button>
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

export default AdminPage;
