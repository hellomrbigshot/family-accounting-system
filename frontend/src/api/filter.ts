import axios from '@/utils/axios'

export interface FilterConditions {
  timeRange?: {
    type: 'preset' | 'custom'
    preset?: 'week' | 'month' | 'quarter' | 'year' | 'lastWeek' | 'lastMonth' | 'lastYear'
    custom?: {
      startDate: string
      endDate: string
    }
  }
  amountRange?: {
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
    value: number
  }
  categories?: string[]
  tags?: string[]
  isExtra?: boolean
  description?: string
}

export interface FilterData {
  id: string
  name: string
  conditions: FilterConditions
  createdAt: string
}

export interface CreateFilterData {
  name: string
  conditions: FilterConditions
}

export interface UpdateFilterData {
  name: string
  conditions: FilterConditions
}

class FilterApi {
  private baseUrl = '/filters'

  async getList() {
    const response = await axios.get(this.baseUrl)
    return response.data
  }

  async getById(id: string) {
    const response = await axios.get(`${this.baseUrl}/${id}`)
    return response.data
  }

  async create(filter: CreateFilterData) {
    const response = await axios.post(this.baseUrl, filter)
    return response.data
  }

  async update(id: string, filter: UpdateFilterData) {
    const response = await axios.put(`${this.baseUrl}/${id}`, filter)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`)
  }
}

export const filterApi = new FilterApi() 