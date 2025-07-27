
// src/store/store.js or wherever your store2 is
import { configureStore } from '@reduxjs/toolkit';
import toggleReducer from './toggleSlice';
import adminToggleReducer from './admintoggleSlice'; // 👈 import new slice

export const store2 = configureStore({
  reducer: {
    toggle: toggleReducer,
    adminToggle: adminToggleReducer, // 👈 add to reducer object
  },
});

