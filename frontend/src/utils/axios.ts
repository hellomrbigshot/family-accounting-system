import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const cookies = document.cookie.split(';');
    let token = null;
    
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        token = value;
        break;
      }
    }
    
    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 如果是 401 错误
    if (error.response?.status === 401) {
      // 清除认证相关的 cookie
      document.cookie = 'access_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = 'refresh_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      
      // 如果不是登录请求，重定向到登录页
      if (!originalRequest.url.includes('/login')) {
        window.location.href = '/login';
      }
      
      showToast({
        type: 'fail',
        message: '登录已过期，请重新登录'
      });
    }
    
    return Promise.reject(error);
  }
);

export default instance; 