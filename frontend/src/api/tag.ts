import axios from '@/utils/axios'

export interface TagData {
  id: string
  name: string
  color?: string
  createdAt: string
}

class TagApi {
  private baseUrl = '/tags'

  async getList() {
    const response = await axios.get(this.baseUrl)
    return response.data
  }

  async create(tag: Omit<TagData, 'id' | 'createdAt'>) {
    const response = await axios.post(this.baseUrl, tag)
    return response.data
  }

  async update(id: string, tag: Partial<TagData>) {
    const response = await axios.put(`${this.baseUrl}/${id}`, tag)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`)
  }
}

export const tagApi = new TagApi() 