import api from '../utils/api';

const ENDPOINT = '/admin';

export const getAdmins = async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
};

export const createAdmin = async (admin) => {
    const response = await api.post(ENDPOINT, admin);
    return response.data;
};

export const updateAdmin = async (admin) => {
    const response = await api.put(`${ENDPOINT}/${admin.id}`, admin);
    return response.data;
};

export const deleteAdmin = async (id) => {
    await api.delete(`${ENDPOINT}/${id}`);
};
