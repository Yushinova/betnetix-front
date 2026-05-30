import { apiClient } from './apiClient';
import { commentApi } from './commentApi';
import type { Post, PostWithAuthor, PostsResponse } from '@/types/post';
import type { User } from '@/types/user';

export const postApi = {
  // Получить все посты с пагинацией
  getPosts: async (limit: number = 10, skip: number = 0) => {
    const result = await apiClient.get<PostsResponse>(
      `/posts?limit=${limit}&skip=${skip}`
    );
    return result;
  },

  // Поиск постов
  searchPosts: async (query: string, limit: number = 10, skip: number = 0) => {
    const result = await apiClient.get<PostsResponse>(
      `/posts/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
    );
    return result;
  },

  // Получить пост по ID
  getPostById: (id: number) =>
    apiClient.get<Post>(`/posts/${id}`),

  // Получить посты пользователя
  getUserPosts: (userId: number) =>
    apiClient.get<PostsResponse>(`/users/${userId}/posts`),

   // Получить количество постов пользователя
  getUserPostsCount: async (userId: number): Promise<number> => {
    const result = await apiClient.get<PostsResponse>(`/users/${userId}/posts?limit=1`);
    return result.total;
  },

  // Получить посты с информацией об авторе и комментариями
  getPostsWithDetails: async (limit: number = 10, skip: number = 0): Promise<{ posts: PostWithAuthor[]; total: number }> => {
    // Получаем посты
    const postsData = await postApi.getPosts(limit, skip);
    
    // Получаем всех пользователей для поиска авторов
    const usersData = await apiClient.get<{ users: User[] }>('/users?limit=100&skip=0');
    const usersMap = new Map(usersData.users.map(user => [user.id, user]));
    
    // Для каждого поста получаем количество комментариев и данные автора
    const postsWithDetails = await Promise.all(
      postsData.posts.map(async (post): Promise<PostWithAuthor> => {
        const author = usersMap.get(post.userId);
        const commentsCount = await commentApi.getPostCommentsCount(post.id);
        
        return {
          ...post,
          authorName: author ? `${author.firstName} ${author.lastName}` : 'Unknown',
          authorEmail: author?.email || 'unknown@example.com',
          commentsCount,
        };
      })
    );
    
    return {
      posts: postsWithDetails,
      total: postsData.total,
    };
  },

  // ========== CRUD для постов (если понадобятся) ==========
  
  // Создать пост
  createPost: (data: { title: string; body: string; userId: number }) =>
    apiClient.post<Post>('/posts/add', data),

  // Обновить пост
  updatePost: (id: number, data: { title?: string; body?: string }) =>
    apiClient.put<Post>(`/posts/${id}`, data),

  // Удалить пост
  deletePost: (id: number) =>
    apiClient.delete<{ id: number; isDeleted: boolean }>(`/posts/${id}`),
};