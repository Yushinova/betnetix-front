import { Comment, CommentWithUser } from '@/types/comment';
import { User } from '@/types/user';

// Мок пользователей (используем структуру из вашего User типа)
export const mockUsers: User[] = [
  { 
    id: 1, 
    firstName: 'Иван', 
    lastName: 'Иванов', 
    email: 'ivan@example.com', 
    image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg',
    role: 'user',
    birthDate: '1990-01-01',
    gender: 'male'
  },
  { 
    id: 2, 
    firstName: 'Мария', 
    lastName: 'Петрова', 
    email: 'maria@example.com', 
    image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/pink.jpg',
    role: 'user',
    birthDate: '1992-03-15',
    gender: 'female'
  },
  { 
    id: 3, 
    firstName: 'Алексей', 
    lastName: 'Сидоров', 
    email: 'alex@example.com', 
    image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg',
    role: 'admin',
    birthDate: '1988-07-20',
    gender: 'male'
  },
  // ... добавьте остальных пользователей с необходимыми полями
];

// Мок комментариев
export const mockComments: Comment[] = [
  { id: 1, postId: 1, userId: 1, body: 'Отличный пост! Очень полезная информация.', createdAt: '2024-01-15T10:30:00Z' },
  { id: 2, postId: 1, userId: 2, body: 'Спасибо автору за интересный материал.', createdAt: '2024-01-15T11:45:00Z' },
  { id: 3, postId: 1, userId: 3, body: 'Жду продолжения!', createdAt: '2024-01-15T14:20:00Z' },
  { id: 4, postId: 2, userId: 1, body: 'Полностью согласен с автором.', createdAt: '2024-01-16T09:15:00Z' },
  { id: 5, postId: 2, userId: 2, body: 'Отличная статья, добавил в избранное.', createdAt: '2024-01-16T12:30:00Z' },
  { id: 6, postId: 3, userId: 3, body: 'А можно подробнее про это место?', createdAt: '2024-01-17T08:45:00Z' },
  { id: 7, postId: 3, userId: 1, body: 'Очень красивые фотографии!', createdAt: '2024-01-17T10:00:00Z' },
  { id: 8, postId: 3, userId: 2, body: 'Спасибо за экскурсию.', createdAt: '2024-01-17T15:30:00Z' },
  { id: 9, postId: 4, userId: 2, body: 'Интересная мысль, никогда не думал об этом так.', createdAt: '2024-01-18T11:20:00Z' },
  { id: 10, postId: 5, userId: 3, body: 'С нетерпением жду следующую часть!', createdAt: '2024-01-19T09:45:00Z' },
  { id: 11, postId: 5, userId: 1, body: 'Полезный совет, спасибо!', createdAt: '2024-01-19T14:10:00Z' },
  { id: 12, postId: 6, userId: 2, body: 'Лучшее, что я читал сегодня.', createdAt: '2024-01-20T16:25:00Z' },
  { id: 13, postId: 6, userId: 3, body: 'Очень познавательно!', createdAt: '2024-01-21T11:00:00Z' },
];

// Функция для получения комментариев с данными пользователя
export function getCommentsWithUsers(postId?: number): CommentWithUser[] {
  let comments = [...mockComments];
  
  if (postId) {
    comments = comments.filter(comment => comment.postId === postId);
  }
  
  return comments.map(comment => ({
    ...comment,
    user: mockUsers.find(user => user.id === comment.userId) || mockUsers[0]
  }));
}

// Функция для получения комментариев с пагинацией
export function getPaginatedComments(postId: number, page: number, limit: number = 10) {
  const allComments = getCommentsWithUsers(postId);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedComments = allComments.slice(startIndex, endIndex);
  
  return {
    comments: paginatedComments,
    total: allComments.length,
    page,
    totalPages: Math.ceil(allComments.length / limit)
  };
}