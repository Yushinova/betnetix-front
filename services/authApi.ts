import { apiClient } from './apiClient';
import { deleteCookie } from '@/utils/cookie';
import type { LoginCredentials, AuthResponse } from '@/types/auth';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>('/auth/login', credentials, false),

  logout: () => {
    deleteCookie('jwt');
    return Promise.resolve();
  },
};