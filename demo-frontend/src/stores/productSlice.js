import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  data: [],
  modal:{
    isOpen: false,
    type: null,
    product: null,
    count: 0
  },
  loading: false,
  error: null
}



export const productSlice = createSlice({
  name: 'products',
  initialState: initialState,
  reducers: {
    openProductModal: (state, action) => {
      state.modal.product = action.payload.product;
      state.modal.type = action.payload.type;
      state.modal.isOpen = true;
    },
    closeProductModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.product = null;
    },
     closeProductModalRefresh: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.product = null;
      state.modal.count += 1;
    },
    setProducts: (state, action) => {
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
    clearProducts: (state) => {
      state.data = initialState.data;
      state.loading = false;
      state.error = null;
    }
  }
})

// Action creators are generated for each case reducer function
export const { setLoading, setProducts, setError, clearProducts, openProductModal, closeProductModal, closeProductModalRefresh  } = productSlice.actions

export default productSlice.reducer