import axios from '../configs/axios';



export const getProducts = async () =>{
    return await axios.get('/product');
}


export const searchProducts = async (search) => {
    return await axios.post('/product/search', search);
}

export const createProduct = async (product) => {
    return await axios.post(`/product`, product);
}

export const updateProduct = async (product) => {
    return await axios.put(`/product`, product);
}

export const deleteProduct = async (id) => {
    return await axios.delete(`/product/${id}` );
}