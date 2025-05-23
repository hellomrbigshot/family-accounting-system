import axios from '@/utils/axios';

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  roomNumber: string;
  password: string;
}

export const userApi = {
  async login(roomNumber: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>('/auth/login', {
      roomNumber,
      password,
    });
    return response.data;
  },

  async register(roomNumber: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>('/auth/register', {
      roomNumber,
      password,
    });
    return response.data;
  },
}; 