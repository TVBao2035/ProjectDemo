import axios from '../configs/axios.js';



export const getUsers = async() => {
    return await axios.get('/user');
}

export const searchUsers = async (query) => {
    return await axios.post(`/user/search`,  query );
}

export const createUser = async (user) => {
    return await axios.post('/user', user);
}

export const updateUser = async (user) => {
    return await axios.put(`/user`, user);
}

export const deleteUser = async (id) => {
    return await axios.delete(`/user/${id}`);
}