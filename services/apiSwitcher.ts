import { adminApi as realAdminApi } from './adminApi';
import { authApi as realAuthApi } from './authApi';
import { postApi as realPostApi } from './postApi';
import { userApi as realUserApi } from './userApi';
import { mockAdminApi } from './mockAdminApi';
import { mockAuthApi } from './mockAuthApi';
import { mockPostApi } from './mockPostApi';
import { mockUserApi } from './mockUserApi';

// ============================================
const USE_MOCK = true; // 👈 true - мок, false - реальный API

export const adminApi = USE_MOCK ? mockAdminApi : realAdminApi;
export const authApi = USE_MOCK ? mockAuthApi : realAuthApi;
export const postApi = USE_MOCK ? mockPostApi : realPostApi;
export const userApi = USE_MOCK ? mockUserApi : realUserApi;