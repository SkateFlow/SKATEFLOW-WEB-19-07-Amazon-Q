import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Importação de useNavigate para navegação
import SidebarAdmin from '../SidebarAdmin';
import EventForm from '../EventsPage/EventForm';

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const AdminPage = () => {
  const navigate = useNavigate(); // Hook para redirecionamento
  const [event, setEvent] = useState({ id: null, nomeEvento: '', dataEvento: '', localEvento: '', descricao: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleForm = () => {
    setIsEditing(false);
    setEvent({ id: null, nomeEvento: '', dataEvento: '', localEvento: '', descricao: '' });
  };

  const navigateToList = () => {
    navigate('/event-list'); // Redireciona para a rota da lista de eventos
  };

  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <ButtonContainer>
          <ToggleButton onClick={handleToggleForm}>Novo Evento</ToggleButton>
          <ToggleButton onClick={navigateToList}>Listar Eventos</ToggleButton>
        </ButtonContainer>

        <EventForm
          fetchEvents={() => {}}
          event={event}
          setEvent={setEvent}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </ContentContainer>
    </AdminContainer>
  );
};

export default AdminPage;
