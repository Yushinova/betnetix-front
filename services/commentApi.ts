import { apiClient } from './apiClient';
import type { Comment, CommentsResponse } from '@/types/comment';

export const commentApi = {
  // Получить комментарии поста
  getPostComments: async (postId: number, limit: number = 10, skip: number = 0) => {
    const result = await apiClient.get<CommentsResponse>(
      `/posts/${postId}/comments?limit=${limit}&skip=${skip}`
    );
    return result;
  },

  // Получить количество комментариев поста
  getPostCommentsCount: async (postId: number): Promise<number> => {
    const result = await apiClient.get<CommentsResponse>(
      `/posts/${postId}/comments?limit=1`
    );
    return result.total;
  },

  // Получить все комментарии (с пагинацией)
  getAllComments: async (limit: number = 10, skip: number = 0) => {
    const result = await apiClient.get<CommentsResponse>(
      `/comments?limit=${limit}&skip=${skip}`
    );
    return result;
  },

  // Получить комментарии пользователя
  getUserComments: async (userId: number, limit: number = 10, skip: number = 0) => {
    const result = await apiClient.get<CommentsResponse>(
      `/users/${userId}/comments?limit=${limit}&skip=${skip}`
    );
    return result;
  },

  // Получить количество комментариев пользователя
  getUserCommentsCount: async (userId: number): Promise<number> => {
    const result = await apiClient.get<CommentsResponse>(
      `/users/${userId}/comments?limit=1`
    );
    return result.total;
  }
};