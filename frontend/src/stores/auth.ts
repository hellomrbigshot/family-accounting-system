import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const user = ref<any>(null);

  // 从 cookie 中获取 token
  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        return value;
      }
    }
    return null;
  };

  // 从 cookie 中获取 refresh token
  const getRefreshTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'refresh_token') {
        return value;
      }
    }
    return null;
  };

  // 设置 token 到 cookie
  const setTokenToCookie = (newToken: string, expiresIn: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + expiresIn * 1000);
    document.cookie = `access_token=${newToken};expires=${expires.toUTCString()};path=/`;
  };

  // 设置 refresh token 到 cookie
  const setRefreshTokenToCookie = (newRefreshToken: string) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    document.cookie = `refresh_token=${newRefreshToken};expires=${expires.toUTCString()};path=/`;
  };

  // 清除所有认证相关的 cookie
  const clearAuthCookies = () => {
    document.cookie = 'access_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    document.cookie = 'refresh_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  };

  // 登录
  const login = async (roomNumber: string, password: string) => {
    try {
      console.log('Attempting login with:', { roomNumber });
      const response = await axios.post('/api/auth/login', {
        roomNumber,
        password
      });

      console.log('Login response:', response.data);
      const { token } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // 设置 token 到 cookie，默认过期时间为 15 天
      setTokenToCookie(token, 15 * 24 * 60 * 60);
      
      token.value = token;
      
      // 获取用户信息
      await fetchUserInfo();
      
      showToast({
        type: 'success',
        message: '登录成功'
      });
      
      // 获取重定向地址
      const redirect = router.currentRoute.value.query.redirect as string;
      router.push(redirect || '/');
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      showToast({
        type: 'fail',
        message: error.response?.data?.message || '登录失败'
      });
      throw error;
    }
  };

  // 刷新 token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = getRefreshTokenFromCookie();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await axios.post('/api/auth/refresh', {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      });

      const { access_token, expires_in } = response.data;
      setTokenToCookie(access_token, expires_in);
      token.value = access_token;
      return access_token;
    } catch (error) {
      logout();
      throw error;
    }
  };

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/auth/user');
      user.value = response.data;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  // 登出
  const logout = () => {
    clearAuthCookies();
    token.value = null;
    refreshToken.value = null;
    user.value = null;
    router.push('/login');
  };

  // 检查是否已登录
  const isAuthenticated = () => {
    return !!getTokenFromCookie();
  };

  return {
    token,
    refreshToken,
    user,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated,
    fetchUserInfo,
    getTokenFromCookie
  };
}); 