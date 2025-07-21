import axios from '@/utils/axios'

export interface UserCategoryPermission {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryType: 'expense' | 'income'
  isDisabled: boolean
}

export interface UpdatePermissionRequest {
  isDisabled: boolean
}

export interface BatchUpdatePermissionRequest {
  permissions: Array<{
    categoryId: string
    isDisabled: boolean
  }>
}

class UserCategoryApi {
  private baseUrl = '/user-categories'

  async getPermissions() {
    const response = await axios.get(`${this.baseUrl}/permissions`)
    return response.data
  }

  async updatePermission(categoryId: string, permission: UpdatePermissionRequest) {
    const response = await axios.put(`${this.baseUrl}/permissions/${categoryId}`, permission)
    return response.data
  }

  async batchUpdatePermissions(permissions: BatchUpdatePermissionRequest) {
    const response = await axios.put(`${this.baseUrl}/permissions`, permissions)
    return response.data
  }
}

export const userCategoryApi = new UserCategoryApi() 