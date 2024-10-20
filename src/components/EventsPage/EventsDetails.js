// src/components/EventDetails.js
import React from 'react';

const EventDetails = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div style={{ backgroundColor: '#001426', color: 'white', padding: '20px', position: 'fixed', top: '10%', left: '20%', right: '20%', borderRadius: '10px' }}>
      <h2>{event.nomeEvento}</h2>
      <p><strong>Data:</strong> {event.dataEvento}</p>
      <p><strong>Local:</strong> {event.localEvento}</p>
      <img src={event.imagemEvento || require('../../images/ph.svg').default} alt={event.nomeEvento} style={{ maxWidth: '100%', height: 'auto' }} />
      <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff0000', color: 'white', border: 'none', cursor: 'pointer' }}>Fechar</button>
    </div>
  );
};

export default EventDetails;
