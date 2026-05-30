export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: 'male' | 'female';
  role: 'admin' | 'user';
  image?: string;
  phone?: string;
}

// Расширенный тип со статистикой
export interface UserWithStats extends User {
  postsCount: number;
  likesCount: number; 
  commentsCount: number;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  gender?: 'male' | 'female';
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: number;
  role?: 'admin' | 'user';
}