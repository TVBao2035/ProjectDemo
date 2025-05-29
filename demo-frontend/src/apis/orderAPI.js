import axios from '../configs/axios';



export const getOrders = async () => {
    return await axios.get('/order');
}

export const searchOrders = async (search) => {
    return await axios.post('/order/search', search);
}


export const createOrder = async (order) => {
    return await axios.post(`/order`, order);
}

export const updateOrder = async (order)=>{
    return await axios.put(`/order`, order);
}

export const deleteOrder = async (id) => {
    return await axios.delete(`/order/${id}`);
}