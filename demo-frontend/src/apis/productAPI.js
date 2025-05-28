import axios from '../configs/axios';



export const getProducts = async () =>{
    return await axios.get('/product');
}