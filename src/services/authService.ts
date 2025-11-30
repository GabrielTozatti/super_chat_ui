import type { LoginCredentials, RegisterCredentials } from '../types';
import { api } from "../api/api";

export const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/login', credentials)
  return response.data
}

export const register = async (credentials: RegisterCredentials) => {
  const response = await api.post('/register', credentials)
  return response.data
}

export const refresh = async () => {
  const response = await api.post('/refresh');
  return response.data;
}

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
}