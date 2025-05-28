import axios from '../configs/axios';



export const getOrders = async () => {
    return await axios.get('/order');
}