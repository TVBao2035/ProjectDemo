import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  data: [],
  modal:{
    count: 0,
    isOpen: false,
    type: null,
    user: null
  },
  loading: false,
  error: null
}



export const userSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    openUserModal: (state, action) => {
      state.modal.user = action.payload.user;
      state.modal.type = action.payload.type;
      state.modal.isOpen = true;
    },
    closeUserModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.user = null;
    },
    closeUserModalRefresh: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.user = null;
      state.modal.count += 1;
    },
    setUsers: (state, action) => {
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
    clearUsers: (state) => {
      state.data = initialState.data;
      state.loading = false;
      state.error = null;
    }
  }
})

export const { setLoading, setUsers, setError, clearUsers, openUserModal, closeUserModal, closeUserModalRefresh  } = userSlice.actions

export default userSlice.reducer