import { defineStore } from 'pinia';
import { userApi } from '@/api/user';

interface UserState {
  token: string | null;
  roomNumber: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token'),
    roomNumber: localStorage.getItem('roomNumber'),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(roomNumber: string, password: string) {
      try {
        const { token } = await userApi.login(roomNumber, password);
        this.token = token;
        this.roomNumber = roomNumber;
        localStorage.setItem('token', token);
        localStorage.setItem('roomNumber', roomNumber);
      } catch (error) {
        throw error;
      }
    },

    async register(roomNumber: string, password: string) {
      try {
        const { token } = await userApi.register(roomNumber, password);
        this.token = token;
        this.roomNumber = roomNumber;
        localStorage.setItem('token', token);
        localStorage.setItem('roomNumber', roomNumber);
      } catch (error) {
        throw error;
      }
    },

    logout() {
      this.token = null;
      this.roomNumber = null;
      localStorage.removeItem('token');
      localStorage.removeItem('roomNumber');
    },
  },
}); 