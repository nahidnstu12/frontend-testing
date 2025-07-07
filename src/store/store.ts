import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './services/baseApi';
import authReducer from './features/auth/authSlice';
import datatableReducer from './features/datatableSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    datatable: datatableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
