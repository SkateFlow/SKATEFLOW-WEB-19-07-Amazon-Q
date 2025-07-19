// src/services/eventService.js
import api from '../utils/api';

const ENDPOINT = '/eventos';

export const getEvents = async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
};

export const createEvent = async (event) => {
    const response = await api.post(ENDPOINT, event);
    return response.data;
};

export const updateEvent = async (event) => {
    const response = await api.put(`${ENDPOINT}/${event.id}`, event);
    return response.data;
};

export const deleteEvent = async (id) => {
    await api.delete(`${ENDPOINT}/${id}`);
};
