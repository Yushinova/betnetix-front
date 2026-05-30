export interface Admin {
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

export interface CreateAdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  gender?: 'male' | 'female';
}

export interface UpdateAdminData extends Partial<CreateAdminData> {
  id: number;
  role: 'admin' | 'user'; 
}