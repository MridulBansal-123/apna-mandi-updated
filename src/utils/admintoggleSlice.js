// src/store/adminToggleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const adminToggleSlice = createSlice({
  name: 'adminToggle',
  initialState: {
    isAdminOpen: false,
  },
  reducers: {
    toggleAdminOpen: (state) => {
      state.isAdminOpen = !state.isAdminOpen;
    },
    setAdminOpenTrue: (state) => {
      state.isAdminOpen = true;
    },
    setAdminOpenFalse: (state) => {
      state.isAdminOpen = false;
    },
  },
});

export const { toggleAdminOpen, setAdminOpenTrue, setAdminOpenFalse } = adminToggleSlice.actions;
export default adminToggleSlice.reducer;
