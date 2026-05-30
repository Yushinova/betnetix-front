import type { Admin, CreateAdminData, UpdateAdminData } from '@/types/admin';

// Моковые данные - 5 админов
const mockAdmins: Admin[] = [
  {
    id: 1,
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan.petrov@example.com',
    birthDate: '1990-01-15',
    gender: 'male',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    phone: '+7 (999) 111-22-33',
  },
  {
    id: 2,
    firstName: 'Анна',
    lastName: 'Сидорова',
    email: 'anna.sidorova@example.com',
    birthDate: '1988-05-20',
    gender: 'female',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    phone: '+7 (999) 444-55-66',
  },
  {
    id: 3,
    firstName: 'Сергей',
    lastName: 'Козлов',
    email: 'sergey.kozlov@example.com',
    birthDate: '1985-10-10',
    gender: 'male',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    phone: '+7 (999) 777-88-99',
  },
  {
    id: 4,
    firstName: 'Елена',
    lastName: 'Морозова',
    email: 'elena.morozova@example.com',
    birthDate: '1992-03-25',
    gender: 'female',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    phone: '+7 (999) 000-11-22',
  },
  {
    id: 5,
    firstName: 'Дмитрий',
    lastName: 'Волков',
    email: 'dmitry.volkov@example.com',
    birthDate: '1987-07-30',
    gender: 'male',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
    phone: '+7 (999) 333-44-55',
  },
];

export const mockAdminApi = {
  // Получить всех админов
  getAdmins: async (limit: number = 10, skip: number = 0) => {
    console.log('🎭 Mock getAdmins called', { limit, skip });
    await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
    
    const paginated = mockAdmins.slice(skip, skip + limit);
    
    return {
      users: paginated,
      total: mockAdmins.length,
    };
  },

  // Создать админа
  createAdmin: async (data: CreateAdminData) => {
    console.log('🎭 Mock createAdmin called', data);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAdmin: Admin = {
      id: mockAdmins.length + 1,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthDate: data.birthDate || '',
      gender: data.gender || 'male',
      role: 'admin'
    };
    
    mockAdmins.push(newAdmin);
    console.log('🎭 Admin created:', newAdmin);
    
    return newAdmin;
  },

  // Обновить админа
  updateAdmin: async (id: number, data: UpdateAdminData) => {
    console.log('🎭 Mock updateAdmin called', { id, data });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockAdmins.findIndex(admin => admin.id === id);
    if (index === -1) {
      throw new Error('Admin not found');
    }
    
    const updatedAdmin = {
      ...mockAdmins[index],
      ...data,
    };
    
    mockAdmins[index] = updatedAdmin;
    console.log('🎭 Admin updated:', updatedAdmin);
    
    return updatedAdmin;
  },

  // Удалить админа
  deleteAdmin: async (id: number) => {
    console.log('🎭 Mock deleteAdmin called', id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockAdmins.findIndex(admin => admin.id === id);
    if (index === -1) {
      throw new Error('Admin not found');
    }
    
    mockAdmins.splice(index, 1);
    console.log('🎭 Admin deleted, remaining:', mockAdmins.length);
    
    return { id, isDeleted: true };
  },
};