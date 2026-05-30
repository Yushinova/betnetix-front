import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getCookie, deleteCookie } from '@/utils/cookie';

const API_BASE_URL = 'https://test-api.live-server.xyz';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor — добавляем токен
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getCookie('jwt');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor — обрабатываем 401
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          deleteCookie('jwt');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // GET запрос
  async get<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    const response = await this.instance.get<T>(endpoint);
    return response.data;
  }

  // POST запрос
  async post<T>(endpoint: string, data?: unknown, requiresAuth: boolean = true): Promise<T> {
    const response = await this.instance.post<T>(endpoint, data);
    return response.data;
  }

  // PUT запрос
  async put<T>(endpoint: string, data?: unknown, requiresAuth: boolean = true): Promise<T> {
    const response = await this.instance.put<T>(endpoint, data);
    return response.data;
  }

  // PATCH запрос
  async patch<T>(endpoint: string, data?: unknown, requiresAuth: boolean = true): Promise<T> {
    const response = await this.instance.patch<T>(endpoint, data);
    return response.data;
  }

  // DELETE запрос
  async delete<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    const response = await this.instance.delete<T>(endpoint);
    return response.data;
  }
}

export const apiClient = new ApiClient();