import axios from '../configs/axios.js';



export const getUsers = async() => {
    return await axios.get('/user');
}

export const searchUsers = async (query) => {
    return await axios.post(`/user/search`,  query );
}