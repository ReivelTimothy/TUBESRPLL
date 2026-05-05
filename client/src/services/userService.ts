import { fetchFromAPI } from './api';
import type { UpdateProfileRequest, UserAttributes, UpdateUserRequest } from '../types/types';

export const getAllUsers = async (): Promise<UserAttributes[]> => {
  const res = await fetchFromAPI('/user', 'GET');
  return res.data?.result || res.data || [];
};

export const getUserTree = async (): Promise<any> => {
  const res = await fetchFromAPI('/user/tree', 'GET');
  return res.data?.result || res.data || [];
};

export const updateUser = async (id: string, data: Partial<UpdateUserRequest>) => {
  const res = await fetchFromAPI(`/user/${id}`, 'PUT', data);
  return res.data || res;
};

export const deleteUser = async (id: string) => {
  const res = await fetchFromAPI(`/user/${id}`, 'DELETE');
  return res.data || res;
};

export const updateProfile = async (id: string, data: UpdateProfileRequest) => {
  const res = await fetchFromAPI(`/user/${id}/profile`, 'PUT', data);
  return res.data?.result || res.data || res;
};

export default {
  getAllUsers,
  getUserTree,
  updateUser,
  deleteUser,
  updateProfile,
};
