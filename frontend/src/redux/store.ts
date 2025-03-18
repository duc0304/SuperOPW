import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientReducer from './slices/clientSlice';
import contractReducer from './slices/contractSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientReducer,
    contracts: contractReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 