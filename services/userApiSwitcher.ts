import { mockUserApi } from './mockUserApi';
import { userApi as realUserApi } from './userApi';

const USE_MOCK = true; // 👈 true - мок, false - реальный API

export const userApi = USE_MOCK ? mockUserApi : realUserApi;