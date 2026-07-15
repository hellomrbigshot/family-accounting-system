import { defineStore } from 'pinia'
import { ref } from 'vue'
import { expenseApi, isExpensePaginatedResponse } from '@/api/expense'
import type {
  ExpenseData,
  ExpenseListPagination,
  ExpenseListSummary,
  ExpenseQuery,
  ExpenseStats
} from '@/api/expense'
import dayjs from '@/utils/dayjs'

export const DEFAULT_EXPENSE_PAGE_SIZE = 20

const emptyPagination = (): ExpenseListPagination => ({
  page: 0,
  pageSize: DEFAULT_EXPENSE_PAGE_SIZE,
  total: 0,
  hasMore: false
})

const emptySummary = (): ExpenseListSummary => ({
  count: 0,
  totalAmount: 0
})

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref<ExpenseData[]>([])
  const monthlyExpenses = ref<ExpenseData[]>([])
  const recentExpenses = ref<ExpenseData[]>([])
  const expensesPagination = ref<ExpenseListPagination>(emptyPagination())
  const expensesSummary = ref<ExpenseListSummary>(emptySummary())
  const stats = ref<ExpenseStats | null>(null)
  const loading = ref(false)
  const expensesListLoading = ref(false)
  const expensesLoadingMore = ref(false)
  const recentExpensesListLoading = ref(false)
  const error = ref<string | null>(null)

  /** 递增以丢弃过期的列表请求（刷新 vs 加载更多竞态） */
  let listFetchId = 0

  const totalExpense = () => expenses.value.reduce((sum, expense) => sum + expense.amount, 0)

  const applyUnpagedList = (list: ExpenseData[]) => {
    expenses.value = list
    expensesPagination.value = {
      page: 1,
      pageSize: list.length,
      total: list.length,
      hasMore: false
    }
    expensesSummary.value = {
      count: list.length,
      totalAmount: list.reduce((sum, item) => sum + item.amount, 0)
    }
  }

  const fetchExpenses = async (
    query?: ExpenseQuery,
    options?: { append?: boolean; pageSize?: number; unpaged?: boolean }
  ) => {
    const append = options?.append === true
    const unpaged = options?.unpaged === true
    const pageSize = options?.pageSize ?? query?.pageSize ?? DEFAULT_EXPENSE_PAGE_SIZE

    if (append) {
      if (
        unpaged ||
        !expensesPagination.value.hasMore ||
        expensesLoadingMore.value ||
        expensesListLoading.value
      ) {
        return false
      }
      expensesLoadingMore.value = true
    } else {
      listFetchId += 1
      expensesLoadingMore.value = false
      expensesListLoading.value = true
      // 成功前保留上一份 summary / pagination，避免徽章闪 0、「已显示全部」误显
    }

    const fetchId = listFetchId
    error.value = null

    try {
      if (unpaged) {
        const { page: _page, pageSize: _pageSize, ...rest } = query ?? {}
        const response = await expenseApi.getList(rest)
        if (fetchId !== listFetchId) return false

        const list = Array.isArray(response) ? response : response.list
        applyUnpagedList(list)
        return true
      }

      const page = append ? expensesPagination.value.page + 1 : 1
      const response = await expenseApi.getList({
        ...query,
        page,
        pageSize
      })

      if (fetchId !== listFetchId) return false

      if (!isExpensePaginatedResponse(response)) {
        applyUnpagedList(response)
        return true
      }

      expenses.value = append
        ? [...expenses.value, ...response.list]
        : response.list
      expensesPagination.value = response.pagination
      expensesSummary.value = response.summary
      return true
    } catch (err) {
      if (fetchId !== listFetchId) return false
      console.error('获取支出列表失败:', err)
      showToast('获取支出列表失败')
      return false
    } finally {
      if (fetchId === listFetchId) {
        if (append) {
          expensesLoadingMore.value = false
        } else {
          expensesListLoading.value = false
        }
      }
    }
  }

  const fetchMonthlyExpenses = async () => {
    loading.value = true
    error.value = null
    try {
      const now = dayjs()
      const startOfMonth = now.startOf('month').format('YYYY-MM-DD')
      const endOfMonth = now.endOf('month').format('YYYY-MM-DD')

      const response = await expenseApi.getList({
        startDate: startOfMonth,
        endDate: endOfMonth
      })
      monthlyExpenses.value = Array.isArray(response) ? response : response.list
      return true
    } catch (err) {
      console.error('获取本月支出失败:', err)
      showToast('获取本月支出失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchRecentExpenses = async () => {
    recentExpensesListLoading.value = true
    error.value = null
    try {
      const now = dayjs()
      const sevenDaysAgo = now.subtract(7, 'day')

      const response = await expenseApi.getList({
        startDate: sevenDaysAgo.format('YYYY-MM-DD'),
        endDate: now.format('YYYY-MM-DD')
      })
      recentExpenses.value = Array.isArray(response) ? response : response.list
      return true
    } catch (err) {
      console.error('获取最近支出失败:', err)
      showToast('获取最近支出失败')
      return false
    } finally {
      recentExpensesListLoading.value = false
    }
  }

  const createExpense = async (expense: Omit<ExpenseData, 'id' | 'createdAt'>) => {
    loading.value = true
    error.value = null
    try {
      if (expense.amount <= 0) {
        showToast('支出金额必须大于0')
        return false
      }

      await expenseApi.create(expense)
      showToast('添加支出成功')
      return true
    } catch (err) {
      console.error('添加支出失败:', err)
      showToast('添加支出失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const updateExpense = async (id: string, expense: Omit<ExpenseData, 'id' | 'createdAt'>) => {
    loading.value = true
    error.value = null
    try {
      if (expense.amount <= 0) {
        showToast('支出金额必须大于0')
        return false
      }

      await expenseApi.update(id, expense)
      showToast('更新支出成功')
      return true
    } catch (err) {
      console.error('更新支出失败:', err)
      showToast('更新支出失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async (query?: Pick<ExpenseQuery, 'startDate' | 'endDate'>) => {
    loading.value = true
    error.value = null
    try {
      const response = await expenseApi.getStats(query)
      stats.value = response
      return true
    } catch (err) {
      console.error('获取支出统计失败:', err)
      showToast('获取支出统计失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteExpense = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await expenseApi.delete(id)
      // 列表 / summary 由调用方强制首屏 refresh 对齐，避免本地扣减与 refresh 双写不一致
      return true
    } catch (err) {
      console.error('删除支出记录失败:', err)
      showToast('删除支出记录失败')
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    expenses,
    monthlyExpenses,
    recentExpenses,
    expensesPagination,
    expensesSummary,
    stats,
    loading,
    expensesListLoading,
    expensesLoadingMore,
    recentExpensesListLoading,
    error,
    totalExpense,
    fetchExpenses,
    fetchMonthlyExpenses,
    fetchRecentExpenses,
    createExpense,
    updateExpense,
    fetchStats,
    deleteExpense
  }
})
