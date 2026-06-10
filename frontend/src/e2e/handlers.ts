/**
 * DEV VERIFY 专用 handler 注册表（集中维护，禁止散落到 Vue 组件）。
 * 优先走 Pinia store / API，与 verify-history.sh 对齐。
 */
import type { Pinia } from 'pinia'
import axios from '@/utils/axios'
import router from '@/router'
import { categoryApi } from '@/api/category'
import { expenseApi } from '@/api/expense'
import { useAuthStore } from '@/stores/auth'
import { useBudgetStore } from '@/stores/budget'
import { useCategoryStore } from '@/stores/category'
import { useExpenseStore } from '@/stores/expense'
import { useFilterStore } from '@/stores/filter'
import { useTagStore } from '@/stores/tag'
import { e2ePwaState } from './state'
import { e2eRegister } from './bridge'

function firstExpenseCategoryId(pinia: Pinia) {
  const categoryStore = useCategoryStore(pinia)
  const cat = categoryStore.availableCategories.find((c) => c.type === 'expense')
  return cat?.id ?? ''
}

async function ensureCategories(pinia: Pinia) {
  const categoryStore = useCategoryStore(pinia)
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchCategories()
  }
}

async function ensureTodayExpenses(pinia: Pinia) {
  const expenseStore = useExpenseStore(pinia)
  const today = dayjs().format('YYYY-MM-DD')
  if (expenseStore.expenses.length === 0) {
    await expenseStore.fetchExpenses({ startDate: today, endDate: today })
  }
}

export function registerE2EHandlers(pinia: Pinia) {
  if (!import.meta.env.DEV) return

  e2eRegister('auth.register', async (room: unknown, password: unknown) => {
    const roomNumber = String(room)
    const pwd = String(password)
    await axios.post('/auth/register', { roomNumber, password: pwd })
    const authStore = useAuthStore(pinia)
    await authStore.login(roomNumber, pwd)
  })

  e2eRegister('meta.firstExpenseCategoryId', () => firstExpenseCategoryId(pinia))

  e2eRegister('budget.save', async (amount: unknown) => {
    const budgetStore = useBudgetStore(pinia)
    const now = dayjs()
    const value = parseFloat(String(amount))
    const ok = await budgetStore.updateBudget(value, now.year(), now.month() + 1)
    if (!ok) throw new Error('budget save failed')
  })

  e2eRegister('home.createExpense', async (payload: Record<string, unknown>) => {
    await ensureCategories(pinia)
    const expenseStore = useExpenseStore(pinia)
    const category =
      typeof payload.category === 'string' && payload.category
        ? payload.category
        : firstExpenseCategoryId(pinia)
    if (!category) throw new Error('no expense category')

    const amount = parseFloat(String(payload.amount ?? '12.34'))
    const description = String(payload.description ?? '')
    const date = String(payload.date ?? dayjs().format('YYYY-MM-DD'))

    const ok = await expenseStore.createExpense({
      category,
      amount,
      description,
      date,
      tags: [],
      isExtra: false,
    })
    if (!ok) throw new Error('create expense failed')

    await Promise.all([
      expenseStore.fetchMonthlyExpenses(),
      expenseStore.fetchRecentExpenses(),
    ])
    return category
  })

  e2eRegister('expenses.editByDescription', async (from: unknown, to: unknown) => {
    const expenseStore = useExpenseStore(pinia)
    await ensureTodayExpenses(pinia)
    const fromDesc = String(from)
    const toDesc = String(to)
    const expense = expenseStore.expenses.find((e) => e.description === fromDesc)
    if (!expense) throw new Error(`expense not found: ${fromDesc}`)

    const ok = await expenseStore.updateExpense(expense.id, {
      category: expense.category,
      amount: expense.amount,
      description: toDesc,
      date: expense.date,
      tags: expense.tags ?? [],
      isExtra: expense.isExtra ?? false,
    })
    if (!ok) throw new Error('update expense failed')

    const today = dayjs().format('YYYY-MM-DD')
    await expenseStore.fetchExpenses({ startDate: today, endDate: today })
  })

  e2eRegister('expenses.deleteByDescription', async (desc: unknown) => {
    const expenseStore = useExpenseStore(pinia)
    await ensureTodayExpenses(pinia)
    const expense = expenseStore.expenses.find((e) => e.description === String(desc))
    if (!expense) throw new Error(`expense not found: ${String(desc)}`)
    await expenseStore.deleteExpense(expense.id)
    const today = dayjs().format('YYYY-MM-DD')
    await expenseStore.fetchExpenses({ startDate: today, endDate: today })
  })

  e2eRegister('filters.create', async (name: unknown, categoryId: unknown) => {
    const filterStore = useFilterStore(pinia)
    const ok = await filterStore.createFilter({
      name: String(name),
      conditions: {
        timeRange: { type: 'preset', preset: 'month' },
        categories: [String(categoryId)],
      },
    })
    if (!ok) throw new Error('create filter failed')
  })

  e2eRegister('filters.applyByName', async (name: unknown) => {
    const filterStore = useFilterStore(pinia)
    await filterStore.fetchFilters()
    const filter = filterStore.filters.find((f) => f.name === String(name))
    if (!filter) throw new Error(`filter not found: ${String(name)}`)
    filterStore.applyFilter(filter)
  })

  e2eRegister('filters.clearCurrent', () => {
    useFilterStore(pinia).clearCurrentFilter()
  })

  e2eRegister('filters.deleteByName', async (name: unknown) => {
    const filterStore = useFilterStore(pinia)
    await filterStore.fetchFilters()
    const filter = filterStore.filters.find((f) => f.name === String(name))
    if (!filter) throw new Error(`filter not found: ${String(name)}`)
    await filterStore.deleteFilter(filter.id)
  })

  e2eRegister('calendar.selectDateWithExpense', async (date: unknown) => {
    const key = date ? String(date) : dayjs().format('YYYY-MM-DD')
    const data = await expenseApi.getStats({ startDate: key, endDate: key })
    const row = (data.dateStats ?? []).find((r) => r._id === key)
    const total = row?.total ?? 0
    if (total <= 0) throw new Error(`no expense stats on ${key}`)
    await router.push({ path: '/expenses', query: { startDate: key, endDate: key } })
  })

  e2eRegister('categories.create', async (name: unknown, icon: unknown) => {
    await categoryApi.create({
      name: String(name),
      icon: String(icon || '📁'),
      type: 'expense',
    })
    await useCategoryStore(pinia).fetchCategories()
  })

  e2eRegister('categories.rename', async (from: unknown, to: unknown) => {
    const list = await categoryApi.getList({ type: 'expense' })
    const cat = list.find((c) => c.name === String(from))
    if (!cat) throw new Error(`category not found: ${String(from)}`)
    await categoryApi.update(cat.id, {
      name: String(to),
      icon: cat.icon,
      type: 'expense',
    })
    await useCategoryStore(pinia).fetchCategories()
  })

  e2eRegister('categories.deleteByName', async (name: unknown) => {
    const list = await categoryApi.getList({ type: 'expense' })
    const cat = list.find((c) => c.name === String(name))
    if (!cat) throw new Error(`category not found: ${String(name)}`)
    await categoryApi.delete(cat.id)
    await useCategoryStore(pinia).fetchCategories()
  })

  e2eRegister('tags.create', async (payload: Record<string, unknown>) => {
    const tagStore = useTagStore(pinia)
    const type = payload.type === 'temporary' ? 'temporary' : 'normal'
    await tagStore.createTag({
      name: String(payload.name ?? ''),
      color: String(payload.color ?? '#F97316'),
      type,
      startDate: typeof payload.startDate === 'string' ? payload.startDate : undefined,
      endDate: typeof payload.endDate === 'string' ? payload.endDate : undefined,
    })
  })

  e2eRegister('tag.archiveByName', async (name: unknown) => {
    const tagStore = useTagStore(pinia)
    const tag = tagStore.tags.find((t) => t.name === String(name))
    if (!tag) throw new Error(`tag not found: ${String(name)}`)
    await tagStore.deleteTag(tag.id)
  })

  e2eRegister('pwa.showInstall', () => {
    e2ePwaState.showInstall = true
  })

  e2eRegister('pwa.dismissInstall', () => {
    e2ePwaState.showInstall = false
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  })

  e2eRegister('pwa.showUpdate', () => {
    e2ePwaState.showUpdate = true
    e2ePwaState.updateNewVersion = '9.9.9-e2e'
  })

  e2eRegister('pwa.dismissUpdate', () => {
    e2ePwaState.showUpdate = false
    localStorage.setItem('pwa-update-dismissed', Date.now().toString())
  })
}
