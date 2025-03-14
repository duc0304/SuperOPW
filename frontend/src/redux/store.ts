import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import contractReducer from './slices/contractSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    contracts: contractReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 