export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: 'male' | 'female';
  role: 'admin' | 'user';  // 👈 ИЗМЕНИТЬ ЗДЕСЬ на 'admin' | 'user'
  image?: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}