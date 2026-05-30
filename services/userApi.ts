import { apiClient } from './apiClient';
import { commentApi } from './commentApi';
import { postApi } from './postApi';
import type { User, UserWithStats, CreateUserData, UpdateUserData } from '@/types/user';

export const userApi = {
  // Получить ВСЕХ пользователей (без фильтрации по роли)
  getAllUsers: async (limit: number = 100, skip: number = 0) => {
    const result = await apiClient.get<{ users: User[]; total: number }>(
      `/users?limit=${limit}&skip=${skip}`
    );
    return {
      users: result.users,
      total: result.total,
    };
  },

  // ПОЛЬЗОВАТЕЛИ СО СТАТИСТИКОЙ (без фильтрации по роли)
  getUsersWithStats: async (limit: number = 100, skip: number = 0): Promise<{ users: UserWithStats[]; total: number }> => {
    // 1. Получаем всех пользователей
    const { users, total } = await userApi.getAllUsers(limit, skip);
    
    // 2. Получаем статистику для этих пользователей
    const usersWithStats = await Promise.all(
      users.map(async (user): Promise<UserWithStats> => {
        try {
          const [postsCount, commentsCount] = await Promise.all([
            postApi.getUserPostsCount(user.id),
            commentApi.getUserCommentsCount(user.id),
          ]);
          
          return {
            ...user,
            postsCount,
            commentsCount,
            likesCount: 0, // API DummyJSON не возвращает лайки
          };
        } catch (error) {
          console.error(`Error fetching stats for user ${user.id}:`, error);
          return {
            ...user,
            postsCount: 0,
            commentsCount: 0,
            likesCount: 0,
          };
        }
      })
    );
    
    return {
      users: usersWithStats,
      total,
    };
  },

  // Получить пользователя по ID
  getUserById: async (id: number) => {
    return apiClient.get<User>(`/users/${id}`);
  },

  // Создать пользователя
  createUser: (data: CreateUserData) =>
    apiClient.post<User>('/users/add', data),

  // Обновить пользователя
  updateUser: (id: number, data: UpdateUserData) =>
    apiClient.put<User>(`/users/${id}`, data),

  // Удалить пользователя
  deleteUser: (id: number) =>
    apiClient.delete<{ id: number; isDeleted: boolean }>(`/users/${id}`),
};