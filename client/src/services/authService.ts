import { fetchFromAPI } from './api';
import type { LoginCredentials } from '../types/types';

// The server wraps responses as { success, message, data }
export const login = async (credentials: LoginCredentials) => {
  const res = await fetchFromAPI('/auth/login', 'POST', credentials);
  // res.data contains { msg, user, token }
  return res.data;
};

// Registration not used by client UI — removed

export const logout = async () => {
  // If backend has logout route later, call it; for now just clear token on client
  return { message: 'Logged out (client-side)' };
};