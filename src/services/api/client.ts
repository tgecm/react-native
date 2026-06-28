import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getApiBase } from './config';
import { useAuthStore } from '../../store/authStore';
import { getStorage } from '../../store/storage';

const client = axios.create({
  baseURL: getApiBase(),
  timeout: 30000,
});

let consecutiveErrors = 0;
let lastBackendErrorTime = 0;

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const storage = getStorage();
  const token = useAuthStore.getState().token || storage.getString('telegram_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    consecutiveErrors = 0;
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      consecutiveErrors++;
      const now = Date.now();
      if (consecutiveErrors >= 3 && now - lastBackendErrorTime > 30000) {
        lastBackendErrorTime = now;
        consecutiveErrors = 0;
      }
    }

    if (error.response?.status === 401) {
      const url = (error.config?.url || '') as string;
      if (url.includes('/auth/login') || url.includes('/auth/staff-login')) {
        return Promise.reject(error);
      }
      const storage = getStorage();
      const hasTelegramToken = !!storage.getString('telegram_token');
      const hasFirebaseToken = !!useAuthStore.getState().token;
      if (hasTelegramToken && !hasFirebaseToken) {
        storage.delete('telegram_token');
        storage.delete('telegram_user');
      } else {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);

export default client;
