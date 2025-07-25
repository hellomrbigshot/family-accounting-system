import { defineStore } from 'pinia'
import { ref } from 'vue'
import { filterApi } from '@/api/filter'
import type { FilterData, CreateFilterData, UpdateFilterData } from '@/api/filter'

export const useFilterStore = defineStore('filter', () => {
  const filters = ref<FilterData[]>([])
  const currentFilter = ref<FilterData | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // 获取筛选器列表
  const fetchFilters = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await filterApi.getList()
      filters.value = response
      return true
    } catch (error) {
      console.error('获取筛选器列表失败:', error)
      showToast('获取筛选器列表失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 创建筛选器
  const createFilter = async (filter: CreateFilterData) => {
    loading.value = true
    error.value = null
    try {
      const response = await filterApi.create(filter)
      await fetchFilters() // 重新获取列表
      showToast('筛选器创建成功')
      return response.filter
    } catch (error) {
      console.error('创建筛选器失败:', error)
      showToast('创建筛选器失败')
      return null
    } finally {
      loading.value = false
    }
  }

  // 更新筛选器
  const updateFilter = async (id: string, filter: UpdateFilterData) => {
    loading.value = true
    error.value = null
    try {
      const response = await filterApi.update(id, filter)
      await fetchFilters() // 重新获取列表
      showToast('筛选器更新成功')
      return response.filter
    } catch (error) {
      console.error('更新筛选器失败:', error)
      showToast('更新筛选器失败')
      return null
    } finally {
      loading.value = false
    }
  }

  // 删除筛选器
  const deleteFilter = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await filterApi.delete(id)
      await fetchFilters() // 重新获取列表
      showToast('筛选器删除成功')
      return true
    } catch (error) {
      console.error('删除筛选器失败:', error)
      showToast('删除筛选器失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 设置当前筛选器
  const setCurrentFilter = (filter: FilterData | null) => {
    currentFilter.value = filter
  }

  // 清除当前筛选器
  const clearCurrentFilter = () => {
    currentFilter.value = null
  }

  // 应用筛选器
  const applyFilter = (filter: FilterData) => {
    currentFilter.value = filter
  }

  return {
    filters,
    currentFilter,
    loading,
    error,
    fetchFilters,
    createFilter,
    updateFilter,
    deleteFilter,
    setCurrentFilter,
    clearCurrentFilter,
    applyFilter
  }
}) 