import { fetchFromAPI } from '../api/api';

export const loginAPI = async (credentials: { email: string; password: any }) => {
  return await fetchFromAPI('/auth/login', 'POST', credentials);
};