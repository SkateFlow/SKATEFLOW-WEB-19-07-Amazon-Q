import React from 'react';
import styled from 'styled-components';
import { createEvent, updateEvent } from '../../services/eventService';
import { Form } from '../../LoginPage/LoginElements';

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

const EventForm = ({ fetchEvents, event, setEvent, isEditing, setIsEditing }) => {
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

  const resetForm = () => {
    setEvent({ id: null, nomeEvento: '', dataEvento: '', localEvento: '', descricao: '' });
    setIsEditing(false);
  };

  return (
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
  );
};

export default EventForm;
