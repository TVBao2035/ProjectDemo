import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  data: [],
  loading: false,
  error: null
}



export const orderSlice = createSlice({
  name: 'orders',
  initialState: initialState,
  reducers: {
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
export const { setLoading, setOrders, setError, clearOrders  } = orderSlice.actions

export default orderSlice.reducer