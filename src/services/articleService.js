import api from '../utils/api';

const ENDPOINT = '/artigos';

export const getArtigos = async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
};

export const createArtigo = async (artigo) => {
    const response = await api.post(ENDPOINT, artigo);
    return response.data;
};

export const updateArtigo = async (artigo) => {
    const response = await api.put(`${ENDPOINT}/${artigo.id}`, artigo);
    return response.data;
};

export const deleteArtigo = async (id) => {
    await api.delete(`${ENDPOINT}/${id}`);
};

export const getArtigoById = async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
};
