import axios from '@/utils/axios'

export interface LoginResponse {
  token: string
  refreshToken: string
  user: {
    id: string
    roomNumber: string
  }
}

export interface RegisterRequest {
  roomNumber: string
  password: string
}

class UserApi {
  private baseUrl = '/users'

  async login(roomNumber: string, password: string) {
    const response = await axios.post(`${this.baseUrl}/login`, {
      roomNumber,
      password
    })
    return response.data
  }

  async register(data: RegisterRequest) {
    const response = await axios.post(`${this.baseUrl}/register`, data)
    return response.data
  }
}

export const userApi = new UserApi() 