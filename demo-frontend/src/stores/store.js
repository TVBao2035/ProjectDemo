import { configureStore } from '@reduxjs/toolkit'
import autReducer from './authSlice';
import userReducer from './userSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';

export default configureStore({
  reducer: {
    auth: autReducer,
    users: userReducer,
    products : productReducer,
    orders: orderReducer
  }
})