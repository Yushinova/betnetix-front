import { create } from 'zustand';
import { userApi } from '@/services/apiSwitcher';
import type { User, UserWithStats, CreateUserData, UpdateUserData } from '@/types/user';

interface UserStore {
  users: UserWithStats[];
  total: number;
  isLoading: boolean;
  error: string | null;
  itemsPerPage: number;
  
  setItemsPerPage: (itemsPerPage: number) => void;
  fetchUsers: () => Promise<void>; // 👈 Убираем параметры, загружаем всех
  createUser: (data: CreateUserData) => Promise<boolean>;
  updateUser: (id: number, data: UpdateUserData) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  total: 0,
  isLoading: false,
  error: null,
  itemsPerPage: 10,

  setItemsPerPage: (itemsPerPage: number) => {
    set({ itemsPerPage });
    // Не перезагружаем данные, только меняем количество на странице
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      // Загружаем ВСЕХ пользователей (большой лимит)
      const result = await userApi.getUsersWithStats(100, 0);
      set({
        users: result.users,
        total: result.total,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка загрузки пользователей',
        isLoading: false,
      });
    }
  },

  createUser: async (data: CreateUserData) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await userApi.createUser(data);
      // Обновляем список после создания
      await get().fetchUsers();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка создания пользователя',
        isLoading: false,
      });
      return false;
    }
  },

  updateUser: async (id: number, data: UpdateUserData) => {
    set({ isLoading: true, error: null });
    try {
      await userApi.updateUser(id, data);
      await get().fetchUsers();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка обновления пользователя',
        isLoading: false,
      });
      return false;
    }
  },

  deleteUser: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await userApi.deleteUser(id);
      // Обновляем список после удаления
      await get().fetchUsers();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка удаления пользователя',
        isLoading: false,
      });
      return false;
    }
  },
}));