import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.getTokenFromCookie();
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
    if (error.response) {
      const { status } = error.response;
      const { message } = error.response?.data || {}
      const authStore = useAuthStore();

      if (status === 401) {
        try {
          await authStore.refreshToken();
          const config = error.config;
          config.headers.Authorization = `Bearer ${authStore.token}`;
          return instance(config);
        } catch (refreshError) {
          authStore.logout();
          showToast('登录已过期，请重新登录');
          return Promise.reject(refreshError);
        }
      }
      if (message) {
        showToast(message)
        return
      }
      if (status === 403) {
        showToast('没有权限执行此操作');
      }

      if (status === 404) {
        showToast('请求的资源不存在');
      }

      if (status === 500) {
        showToast('服务器错误，请稍后重试');
      }
    } else if (error.request) {
      showToast('网络错误，请检查网络连接');
    } else {
      showToast('请求配置错误');
    }

    return Promise.reject(error);
  }
);

export default instance; 