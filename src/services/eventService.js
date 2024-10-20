// src/services/eventService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/eventos'; // ajuste para a URL correta

export const getEvents = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createEvent = async (event) => {
    const response = await axios.post(API_URL, event);
    return response.data;
};

export const updateEvent = async (event) => {
    const response = await axios.put(`${API_URL}/${event.id}`, event);
    return response.data;
};

export const deleteEvent = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
