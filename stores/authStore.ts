import { create } from 'zustand';
import { authApi } from '@/services/apiSwitcher';
import { setCookie, deleteCookie, getCookie } from '@/utils/cookie';
import type { Admin, LoginCredentials } from '@/types/auth';

interface AuthState {
  token: string | null;
  admin: Admin | null;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  updateAdmin: (updatedData: Partial<Admin>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  admin: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    console.log('🔐 Login started for:', credentials.username);
    set({ isLoading: true, error: null });
    
    try {
      const response = await authApi.login(credentials);
      console.log('📡 Login response:', response);
      
      const token = response.token; 
      const admin = response.admin;
      
      if (!token) {
        console.error('❌ No token in response!');
        throw new Error('Токен не получен от сервера');
      }
      
      setCookie('jwt', token, 7);
      localStorage.setItem('admin', JSON.stringify(admin));
      localStorage.setItem('token', token);
      console.log('✅ Token saved to cookie, admin saved to localStorage');
      
      set({
        token: token,
        admin: admin,
        isLoading: false,
        error: null,
      });
      
      console.log('✅ Store updated with admin:', admin);
      return true;
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка входа';
      set({ 
        error: errorMessage, 
        isLoading: false,
        token: null,
        admin: null,
      });
      return false;
    }
  },

  logout: () => {
    console.log('🚪 Logout called');
    deleteCookie('jwt');
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
    set({ token: null, admin: null, error: null });
  },

  checkAuth: () => {
    const tokenFromCookie = getCookie('jwt');
    const savedAdmin = localStorage.getItem('admin');
    const savedToken = localStorage.getItem('token');
    
    console.log('🔍 checkAuth - token from cookie:', tokenFromCookie ? 'present' : 'missing');
    console.log('🔍 checkAuth - savedAdmin from localStorage:', savedAdmin ? 'present' : 'missing');
    
    const token = tokenFromCookie || savedToken;
    
    if (token && savedAdmin) {
      try {
        const admin = JSON.parse(savedAdmin);
        console.log('✅ Restoring admin from localStorage:', admin);
        set({ 
          token: token, 
          admin: admin 
        });
        console.log('✅ State restored successfully');
      } catch (error) {
        console.error('❌ Failed to parse admin from localStorage:', error);
        set({ token, admin: null });
      }
    } else if (token) {
      console.log('⚠️ Token exists but no admin in localStorage');
      set({ token });
    } else {
      console.log('❌ No token found');
      set({ token: null, admin: null });
    }
  },

  updateAdmin: (updatedData) => {
    set((state) => {
      if (!state.admin) return state;
      
      const updatedAdmin = { ...state.admin, ...updatedData };
      
      // Обновляем localStorage
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      
      console.log('🔄 Admin data updated:', updatedAdmin);
      
      return {
        admin: updatedAdmin,
      };
    });
  },
}));