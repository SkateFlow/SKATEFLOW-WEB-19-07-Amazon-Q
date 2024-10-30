import React, { useEffect, useState } from 'react';
import { getEvents } from '../../services/eventService';
import EventList from '../EventsPage/EventList'; // Importação do componente de exibição

const EventListComponent = () => {  // Renomeado para evitar conflito
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  return <EventList events={events} />;
};

export default EventListComponent;
