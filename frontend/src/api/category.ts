import axios from '@/utils/axios'

export interface CategoryData {
  id: string
  name: string
  type: 'expense' | 'income'
  icon?: string
  color?: string
  isSystem: boolean
  createdAt: string
}

export interface CategoryQuery {
  type?: 'expense' | 'income'
}

class CategoryApi {
  private baseUrl = '/categories'

  async getList(query?: CategoryQuery) {
    const response = await axios.get(this.baseUrl, { params: query })
    return response.data
  }

  async create(category: Omit<CategoryData, 'id' | 'createdAt'>) {
    const response = await axios.post(this.baseUrl, category)
    return response.data
  }

  async update(id: string, category: Partial<Omit<CategoryData, 'id' | 'createdAt'>>) {
    const response = await axios.put(`${this.baseUrl}/${id}`, category)
    return response.data
  }

  async delete(id: string) {
    await axios.delete(`${this.baseUrl}/${id}`)
  }
}

export const categoryApi = new CategoryApi() 