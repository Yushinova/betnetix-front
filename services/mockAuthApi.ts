import type { Admin } from '@/types/admin';
import type { AuthResponse } from '@/types/auth';

// Моковые данные админов
const mockAdminsForAuth = [
  {
    id: 1,
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com',
    birthDate: '1990-01-15',
    gender: 'male' as const,
    role: 'admin' as const,
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    phone: '+7 (999) 123-45-67',
    username: 'ivan',
    password: 'admin123'
  },
  {
    id: 2,
    firstName: 'Анна',
    lastName: 'Сидорова',
    email: 'anna@example.com',
    birthDate: '1988-05-20',
    gender: 'female' as const,
    role: 'admin' as const,
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    phone: '+7 (999) 765-43-21',
    username: 'anna',
    password: 'admin456'
  }
];

export const mockAuthApi = {
  // Возвращаем тот же формат, что и реальный API
  login: async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
    console.log('🎭 Mock login attempt:', credentials.username);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const admin = mockAdminsForAuth.find(
      a => a.username === credentials.username || a.email === credentials.username
    );
    
    if (admin && admin.password === credentials.password) {
      const adminData: Admin = {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        birthDate: admin.birthDate,
        gender: admin.gender,
        role: admin.role,
        image: admin.image,
        phone: admin.phone,
      };
      
      // Генерируем токен
      const token = btoa(JSON.stringify({
        id: admin.id,
        username: admin.username,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000
      }));
      
      console.log('🎭 Mock login success, token generated');
      
      // Возвращаем в том же формате, что и реальный API
      return {
        token: token,
        admin: adminData
      };
    }
    
    console.log('🎭 Mock login failed');
    throw new Error('Неверное имя пользователя или пароль');
  },
  
  logout: () => {
    console.log('🎭 Mock logout');
    return Promise.resolve();
  }
};