import type { User, UserWithStats, CreateUserData, UpdateUserData } from '@/types/user';

// Моковые данные пользователей (все, без фильтрации по роли)
const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'Анна',
    lastName: 'Иванова',
    email: 'anna@example.com',
    birthDate: '1992-05-15',
    gender: 'female',
    role: 'user',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    phone: '+7 (999) 111-22-33',
  },
  {
    id: 2,
    firstName: 'Петр',
    lastName: 'Сидоров',
    email: 'petr@example.com',
    birthDate: '1988-10-20',
    gender: 'male',
    role: 'user',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    phone: '+7 (999) 444-55-66',
  },
  {
    id: 3,
    firstName: 'Мария',
    lastName: 'Козлова',
    email: 'maria@example.com',
    birthDate: '1995-03-10',
    gender: 'female',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    phone: '+7 (999) 777-88-99',
  },
  {
    id: 4,
    firstName: 'Дмитрий',
    lastName: 'Морозов',
    email: 'dmitry@example.com',
    birthDate: '1990-07-25',
    gender: 'male',
    role: 'user',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    phone: '+7 (999) 000-11-22',
  },
  {
    id: 5,
    firstName: 'Елена',
    lastName: 'Волкова',
    email: 'elena@example.com',
    birthDate: '1985-12-05',
    gender: 'female',
    role: 'user',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    phone: '+7 (999) 333-44-55',
  },
];

// Моковые данные постов (для статистики)
const mockPostsCount: Record<number, number> = {
  1: 12,
  2: 5,
  3: 8,
  4: 15,
  5: 3,
};

const mockCommentsCount: Record<number, number> = {
  1: 45,
  2: 23,
  3: 67,
  4: 34,
  5: 12,
};

const mockLikesCount: Record<number, number> = {
  1: 89,
  2: 34,
  3: 56,
  4: 78,
  5: 23,
};

export const mockUserApi = {
  // Получить ВСЕХ пользователей (без фильтрации по роли)
  getAllUsers: async (limit: number = 100, skip: number = 0) => {
    console.log('🎭 Mock getAllUsers called', { limit, skip });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const paginated = mockUsers.slice(skip, skip + limit);
    
    return {
      users: paginated,
      total: mockUsers.length,
    };
  },

  // ПОЛЬЗОВАТЕЛИ СО СТАТИСТИКОЙ (все, без фильтрации)
  getUsersWithStats: async (limit: number = 100, skip: number = 0) => {
    console.log('🎭 Mock getUsersWithStats called', { limit, skip });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const paginated = mockUsers.slice(skip, skip + limit);
    
    const usersWithStats: UserWithStats[] = paginated.map(user => ({
      ...user,
      postsCount: mockPostsCount[user.id] || 0,
      commentsCount: mockCommentsCount[user.id] || 0,
      likesCount: mockLikesCount[user.id] || 0,
    }));
    
    return {
      users: usersWithStats,
      total: mockUsers.length,
    };
  },

  // Получить пользователя по ID
  getUserById: async (id: number) => {
    console.log('🎭 Mock getUserById called', id);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  },

  // Создать пользователя
  createUser: async (data: CreateUserData) => {
    console.log('🎭 Mock createUser called', data);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: mockUsers.length + 1,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthDate: data.birthDate || '',
      gender: data.gender || 'female',
      role: 'user', // по умолчанию user
      image: 'https://randomuser.me/api/portraits/default.jpg',
      phone: '',
    };
    
    mockUsers.push(newUser);
    console.log('🎭 User created:', newUser);
    
    return newUser;
  },

  // Обновить пользователя
  updateUser: async (id: number, data: UpdateUserData) => {
    console.log('🎭 Mock updateUser called', { id, data });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockUsers.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...mockUsers[index],
      ...data,
    };
    
    mockUsers[index] = updatedUser;
    console.log('🎭 User updated:', updatedUser);
    
    return updatedUser;
  },

  // Удалить пользователя
  deleteUser: async (id: number) => {
    console.log('🎭 Mock deleteUser called', id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockUsers.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    mockUsers.splice(index, 1);
    console.log('🎭 User deleted, remaining:', mockUsers.length);
    
    return { id, isDeleted: true };
  },
};