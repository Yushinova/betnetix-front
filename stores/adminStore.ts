import { create } from 'zustand';
//import { adminApi } from '@/services/adminApi';
import { adminApi } from '@/services/apiSwitcher';
import type { Admin, CreateAdminData, UpdateAdminData } from '@/types/admin';

interface AdminStore {
  admins: Admin[];
  total: number;
  isLoading: boolean;
  error: string | null;
  itemsPerPage: number; // 👈 Добавить
  
  setItemsPerPage: (itemsPerPage: number) => void; // 👈 Добавить
  fetchAdmins: (limit?: number, skip?: number) => Promise<void>;
  createAdmin: (data: CreateAdminData) => Promise<boolean>;
  updateAdmin: (id: number, data: UpdateAdminData) => Promise<boolean>;
  deleteAdmin: (id: number) => Promise<boolean>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  admins: [],
  total: 0,
  isLoading: false,
  error: null,
  itemsPerPage: 5, // 👈 Добавить

  setItemsPerPage: (itemsPerPage: number) => {
    set({ itemsPerPage });
  },

  fetchAdmins: async (limit = 30, skip = 0) => {
    set({ isLoading: true, error: null });
    try {
      const result = await adminApi.getAdmins(limit, skip);
      set({
        admins: result.users,
        total: result.total,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка загрузки админов',
        isLoading: false,
      });
    }
  },

  createAdmin: async (data: CreateAdminData) => {
    set({ isLoading: true, error: null });
    try {
      const newAdmin = await adminApi.createAdmin(data);
      set(state => ({
        admins: [...state.admins, newAdmin],
        total: state.total + 1,
        isLoading: false,
      }));
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка создания админа',
        isLoading: false,
      });
      return false;
    }
  },

  updateAdmin: async (id: number, data: UpdateAdminData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAdmin = await adminApi.updateAdmin(id, data);
      set(state => ({
        admins: state.admins.map(admin => 
          admin.id === id ? updatedAdmin : admin
        ),
        isLoading: false,
      }));
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка обновления админа',
        isLoading: false,
      });
      return false;
    }
  },

  deleteAdmin: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteAdmin(id);
      set(state => ({
        admins: state.admins.filter(admin => admin.id !== id),
        total: state.total - 1,
        isLoading: false,
      }));
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка удаления админа',
        isLoading: false,
      });
      return false;
    }
  },
}));