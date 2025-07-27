import { createSlice } from '@reduxjs/toolkit';

const toggleSlice = createSlice({
  name: 'toggle',
  initialState: {
    isOpen: false, // starts as false
  },
  reducers: {
    toggleOpen: (state) => {
      state.isOpen = !state.isOpen; // toggle true/false
    },
    setOpenTrue: (state) => {
      state.isOpen = true;
    },
    setOpenFalse: (state) => {
      state.isOpen = false;
    },
  },
});

export const { toggleOpen, setOpenTrue, setOpenFalse } = toggleSlice.actions;
export default toggleSlice.reducer;
