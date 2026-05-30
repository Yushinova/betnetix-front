import type { Post, PostWithAuthor, PostsResponse } from '@/types/post';
import type { User } from '@/types/user';

// Моковые данные постов
const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Управление пагинацией и поиском в React/Zustand',
    body: 'Это содержимое первого поста. Здесь много интересного текста.',
    userId: 1,
    tags: ['новости', 'важное'],
    reactions: { likes: 10, dislikes: 2 },
    views: 150,
  },
  {
    id: 2,
    title: 'Пагинацию и поиск в таблицах нужно реализовывать на клиенте',
    body: 'Рассказываем о последних обновлениях и нововведениях.',
    userId: 2,
    tags: ['новости', 'обновления'],
    reactions: { likes: 25, dislikes: 1 },
    views: 320,
  },
  {
    id: 3,
    title: 'Как пользоваться системой',
    body: 'Пошаговая инструкция по использованию платформы.',
    userId: 1,
    tags: ['инструкция', 'помощь'],
    reactions: { likes: 45, dislikes: 3 },
    views: 580,
  },
  {
    id: 4,
    title: 'При реализации пагинации и поиска в React + Zustand важно разделить ответственность',
    body: 'Изменения в работе системы с следующего месяца.',
    userId: 3,
    tags: ['объявление', 'важное'],
    reactions: { likes: 67, dislikes: 5 },
    views: 890,
  },
  {
    id: 5,
    title: 'Советы по оптимизации',
    body: 'Полезные советы для эффективной работы.',
    userId: 2,
    tags: ['советы', 'оптимизация'],
    reactions: { likes: 34, dislikes: 2 },
    views: 420,
  },
  {
    id: 6,
    title: 'Новые возможности',
    body: 'Рассказываем о новых функциях и фичах.',
    userId: 1,
    tags: ['новости', 'фичи'],
    reactions: { likes: 89, dislikes: 4 },
    views: 1100,
  },
  {
    id: 7,
    title: 'Поздравляем с обновлением!',
    body: 'Вышла новая версия платформы с улучшениями.',
    userId: 3,
    tags: ['поздравление', 'обновление'],
    reactions: { likes: 123, dislikes: 8 },
    views: 1500,
  },
  {
    id: 8,
    title: 'FAQ - Часто задаваемые вопросы',
    body: 'Ответы на популярные вопросы пользователей.',
    userId: 2,
    tags: ['faq', 'помощь'],
    reactions: { likes: 56, dislikes: 3 },
    views: 720,
  },
];

// Моковые данные пользователей для авторов
const mockUsersForPosts = [
  { id: 1, firstName: 'Иван', lastName: 'Петров', email: 'ivan@example.com', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, firstName: 'Анна', lastName: 'Сидорова', email: 'anna@example.com', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, firstName: 'Мария', lastName: 'Козлова', email: 'maria@example.com', image: 'https://randomuser.me/api/portraits/women/3.jpg' },
];

// Моковые данные количества комментариев
const mockCommentsCount: Record<number, number> = {
  1: 5,
  2: 12,
  3: 8,
  4: 23,
  5: 15,
  6: 42,
  7: 31,
  8: 19,
};

export const mockPostApi = {
  // Получить все посты с пагинацией
  getPosts: async (limit: number = 10, skip: number = 0): Promise<PostsResponse> => {
    console.log('🎭 Mock getPosts called', { limit, skip });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const paginated = mockPosts.slice(skip, skip + limit);
    
    return {
      posts: paginated,
      total: mockPosts.length,
      skip,
      limit,
    };
  },

  // Поиск постов
  searchPosts: async (query: string, limit: number = 10, skip: number = 0): Promise<PostsResponse> => {
    console.log('🎭 Mock searchPosts called', { query, limit, skip });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filtered = mockPosts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.body.toLowerCase().includes(query.toLowerCase())
    );
    
    const paginated = filtered.slice(skip, skip + limit);
    
    return {
      posts: paginated,
      total: filtered.length,
      skip,
      limit,
    };
  },

  // Получить пост по ID
  getPostById: async (id: number): Promise<Post> => {
    console.log('🎭 Mock getPostById called', id);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const post = mockPosts.find(p => p.id === id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  },

  // Получить посты пользователя
  getUserPosts: async (userId: number): Promise<PostsResponse> => {
    console.log('🎭 Mock getUserPosts called', userId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userPosts = mockPosts.filter(post => post.userId === userId);
    
    return {
      posts: userPosts,
      total: userPosts.length,
      skip: 0,
      limit: userPosts.length,
    };
  },

  // Получить количество постов пользователя
  getUserPostsCount: async (userId: number): Promise<number> => {
    console.log('🎭 Mock getUserPostsCount called', userId);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const count = mockPosts.filter(post => post.userId === userId).length;
    return count;
  },

  // Получить посты с информацией об авторе и комментариями
  getPostsWithDetails: async (limit: number = 10, skip: number = 0): Promise<{ posts: PostWithAuthor[]; total: number }> => {
    console.log('🎭 Mock getPostsWithDetails called', { limit, skip });
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const paginated = mockPosts.slice(skip, skip + limit);
    const usersMap = new Map(mockUsersForPosts.map(user => [user.id, user]));
    
    const postsWithDetails: PostWithAuthor[] = paginated.map(post => {
        const author = usersMap.get(post.userId);
        return {
            ...post,
            authorName: author ? `${author.firstName} ${author.lastName}` : 'Unknown',
            authorEmail: author?.email || 'unknown@example.com',
            authorImage: author?.image, // 👈 Добавить
            commentsCount: mockCommentsCount[post.id] || 0,
        };
    });
    
    return {
      posts: postsWithDetails,
      total: mockPosts.length,
    };
  },

};