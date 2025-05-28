import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  data: null,
  loading: false,
  error: null
}



export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setAuth: (state, action) => {
      state.data = action.payload.data;
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
    clearAuth: (state) => {
      state.data = null;
      state.accessToken = "";
      state.loading = false;
      state.error = null;
    }
  }
})

// Action creators are generated for each case reducer function
export const { setLoading, setAuth, setError, clearAuth  } = authSlice.actions

export default authSlice.reducer