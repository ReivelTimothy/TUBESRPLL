import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // Nama 'auth' di sini akan menjadi kunci saat kita memanggil data
    // Contoh: state.auth.user
    auth: authReducer,
  },
});

// Inferensi tipe untuk TypeScript agar kodingan kamu ada auto-complete-nya
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;