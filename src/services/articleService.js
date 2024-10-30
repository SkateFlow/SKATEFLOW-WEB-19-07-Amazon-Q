import axios from 'axios';

const API_URL = 'http://localhost:8080/artigos'; // ajuste para a URL correta

export const getArtigos = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createArtigo = async (artigo) => {
    const response = await axios.post(API_URL, artigo);
    return response.data;
};

export const updateArtigo = async (artigo) => {
    const response = await axios.put(`${API_URL}/${artigo.id}`, artigo);
    return response.data;
};

export const deleteArtigo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const getArtigoById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
