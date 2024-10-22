import axios from 'axios';

const API_URL = 'http://localhost:8080/admin'; // ajuste para a URL correta

export const getAdmins = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createAdmin = async (admin) => {
    const response = await axios.post(API_URL, admin);
    return response.data;
};

export const updateAdmin = async (admin) => {
    const response = await axios.put(`${API_URL}/${admin.id}`, admin);
    return response.data;
};

export const deleteAdmin = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
