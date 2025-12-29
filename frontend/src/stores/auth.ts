import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/utils/axios';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';

// 加密密钥（实际项目中应该从环境变量或配置中获取）
const ENCRYPTION_KEY = 'your-secure-encryption-key-32-chars-long!!';

// 生成随机数
const generateNonce = () => {
  return CryptoJS.lib.WordArray.random(16).toString();
};

// 高级密码加密函数
const encryptPassword = (password: string): { encrypted: string; timestamp: number; nonce: string } => {
  // 生成时间戳和随机数
  const timestamp = Date.now();
  const nonce = generateNonce();
  
  // 创建加密数据对象
  const data = {
    password,
    timestamp,
    nonce
  };
  
  // 使用 AES 加密
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    ENCRYPTION_KEY,
    {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Utf8.parse(nonce)
    }
  ).toString();
  
  return {
    encrypted,
    timestamp,
    nonce
  };
};

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
      const { encrypted, timestamp, nonce } = encryptPassword(password);
      const response = await axios.post('/auth/login', {
        roomNumber,
        password: encrypted,
        timestamp,
        nonce
      });

      console.log('Login response:', response.data);
      const { token: newToken, refreshToken: newRefreshToken, user: newUser } = response.data;
      
      if (!newToken) {
        throw new Error('No token received from server');
      }
      
      // 设置 token 到 cookie，默认过期时间为 15 天
      setTokenToCookie(newToken, 15 * 24 * 60 * 60);
      setRefreshTokenToCookie(newRefreshToken);
      
      token.value = newToken;
      refreshToken.value = newRefreshToken;
      user.value = newUser;
      
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

      const response = await axios.post('/auth/token/refresh', {
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
      const token = getTokenFromCookie();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      user.value = response.data;
      return true;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // 如果获取用户信息失败，清除认证状态
      clearAuthCookies();
      token.value = null;
      refreshToken.value = null;
      user.value = null;
      return false;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthCookies();
      token.value = null;
      refreshToken.value = null;
      user.value = null;
      router.push('/login');
    }
  };

  // 检查是否已登录
  const isAuthenticated = async () => {
    const token = getTokenFromCookie();
    if (!token) {
      return false;
    }

    // 如果已经有用户信息，直接返回 true
    if (user.value) {
      return true;
    }

    // 否则尝试获取用户信息
    try {
      const success = await fetchUserInfo();
      if (!success) {
        // 如果获取用户信息失败，尝试刷新 token
        try {
          await refreshAccessToken();
          // 刷新 token 成功后再次尝试获取用户信息
          return await fetchUserInfo();
        } catch (error) {
          return false;
        }
      }
      return success;
    } catch (error) {
      return false;
    }
  };

  return {
    token,
    refreshToken,
    user,
    login,
    logout,
    refreshAccessToken,
    fetchUserInfo,
    isAuthenticated,
    getTokenFromCookie
  };
}); 