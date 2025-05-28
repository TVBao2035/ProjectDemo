import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  data: [],
  loading: false,
  error: null
}



export const productSlice = createSlice({
  name: 'products',
  initialState: initialState,
  reducers: {
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
export const { setLoading, setProducts, setError, clearProducts  } = productSlice.actions

export default productSlice.reducer