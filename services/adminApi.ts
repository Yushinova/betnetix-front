import { apiClient } from './apiClient';
import type { Admin, CreateAdminData, UpdateAdminData } from '@/types/admin';

export const adminApi = {
  // Получить всех админов (role === 'admin')
  getAdmins: async (limit: number = 10, skip: number = 0) => {
    // Получаем всех пользователей
    const result = await apiClient.get<{ users: any[]; total: number }>(
      `/users?limit=100&skip=0`
    );
    
    // Фильтруем только админов
    const admins = result.users
      .filter(user => user.role === 'admin')
      .map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate || '',
        gender: user.gender || 'female',
        role: user.role,
        image: user.image,
        phone: user.phone,
      }));
    
    // Пагинация
    const paginated = admins.slice(skip, skip + limit);
    
    return {
      users: paginated,
      total: admins.length,
    };
  },

  // Создать админа
  createAdmin: async (data: CreateAdminData) => {
    const response = await apiClient.post<any>('/users/add', {
      ...data,
      role: 'admin',
    });
    
    // Приводим к типу Admin
    const newAdmin: Admin = {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      birthDate: response.birthDate || '',
      gender: response.gender || 'female',
      role: 'admin',
      image: response.image,
      phone: response.phone,
    };
    
    return newAdmin;
  },

  // Обновить админа
  updateAdmin: async (id: number, data: UpdateAdminData) => {
    const response = await apiClient.put<any>(`/users/${id}`, data);
    
    const updatedAdmin: Admin = {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      birthDate: response.birthDate || '',
      gender: response.gender || 'female',
      role: 'admin',
      image: response.image,
      phone: response.phone,
    };
    
    return updatedAdmin;
  },

  // Удалить админа
  deleteAdmin: async (id: number) => {
    return apiClient.delete<{ id: number; isDeleted: boolean }>(`/users/${id}`);
  },
};