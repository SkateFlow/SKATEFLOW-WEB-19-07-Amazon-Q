import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #001426;
  color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
  position: relative;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  background-color: #ff0000;
  color: white;
  border: none;
  cursor: pointer;
`;

const EventDetails = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>Fechar</CloseButton>
        <h2>{event.nomeEvento}</h2>
        <p><strong>Data:</strong> {event.dataEvento}</p>
        <p><strong>Local:</strong> {event.localEvento}</p>
        <p><strong>Descrição:</strong> {event.descricao}</p>
        <img src={event.imagemEvento || require('../../images/ph.svg').default} alt={event.nomeEvento} style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default EventDetails;
