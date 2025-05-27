import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  data: {
    name: "",
    accessToken: "",
  },
  loading: false,
  error: null
}



export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload.data;
      state.accessToken = action.payload.accessToken;
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
    clearUser: (state) => {
      state.data = initialState.data;
      state.accessToken = "";
      state.loading = false;
      state.error = null;
    }
  }
})

// Action creators are generated for each case reducer function
export const { setLoading, setUser, setError, clearUser  } = userSlice.actions

export default userSlice.reducer