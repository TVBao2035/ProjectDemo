import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  data: [],
   modal:{
    isOpen: false,
    type: null,
    order: null,
    count: 0
  },
  loading: false,
  error: null
}



export const orderSlice = createSlice({
  name: 'orders',
  initialState: initialState,
  reducers: {
     openOrderModal: (state, action) => {
      state.modal.order = action.payload.order;
      state.modal.type = action.payload.type;
      state.modal.isOpen = true;
    },
    closeOrderModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.order = null;
    },
     closeOrderModalRefresh: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.order = null;
      state.modal.count += 1;
    },
    setOrders: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearOrders: (state) => {
      state.data = initialState.data;
      state.loading = false;
      state.error = null;
    }
  }
})

// Action creators are generated for each case reducer function
export const { setLoading, setOrders, setError, clearOrders, openOrderModal, closeOrderModal, closeOrderModalRefresh  } = orderSlice.actions

export default orderSlice.reducer