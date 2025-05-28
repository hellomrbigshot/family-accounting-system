import { defineStore } from 'pinia'
import { ref } from 'vue'
import { accountApi } from '@/api/account'
import { showToast } from 'vant'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Array<{
    id: string
    name: string
    type: 'cash' | 'bank' | 'credit'
    balance: number
    currency: string
    createdAt: string
  }>>([])

  const fetchAccounts = async () => {
    try {
      const response = await accountApi.getAll()
      accounts.value = response
      return true
    } catch (error) {
      console.error('获取账户列表失败:', error)
      showToast('获取账户列表失败')
      return false
    }
  }

  const createAccount = async (account: {
    name: string
    type: 'cash' | 'bank' | 'credit'
    balance: number
    currency: string
  }) => {
    try {
      if (account.balance < 0) {
        showToast('初始余额不能为负数')
        return false
      }

      const response = await accountApi.create(account)
      accounts.value.push(response)
      showToast('添加账户成功')
      return true
    } catch (error) {
      console.error('添加账户失败:', error)
      showToast('添加账户失败')
      return false
    }
  }

  const updateAccount = async (
    id: string,
    account: {
      name?: string
      type?: 'cash' | 'bank' | 'credit'
      currency?: string
    }
  ) => {
    try {
      const response = await accountApi.update(id, account)
      const index = accounts.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        accounts.value[index] = response
      }
      showToast('更新账户成功')
      return true
    } catch (error) {
      console.error('更新账户失败:', error)
      showToast('更新账户失败')
      return false
    }
  }

  const deleteAccount = async (id: string) => {
    try {
      await accountApi.delete(id)
      accounts.value = accounts.value.filter((a) => a.id !== id)
      showToast('删除账户成功')
      return true
    } catch (error) {
      console.error('删除账户失败:', error)
      showToast('删除账户失败')
      return false
    }
  }

  const transfer = async (data: {
    fromAccountId: string
    toAccountId: string
    amount: number
    description?: string
  }) => {
    try {
      if (data.amount <= 0) {
        showToast('转账金额必须大于0')
        return false
      }

      const response = await accountApi.transfer(data)
      await fetchAccounts()
      showToast('转账成功')
      return true
    } catch (error) {
      console.error('转账失败:', error)
      showToast('转账失败')
      return false
    }
  }

  const adjustBalance = async (id: string, data: {
    amount: number
    description?: string
  }) => {
    try {
      const response = await accountApi.adjustBalance(id, data)
      const index = accounts.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        accounts.value[index] = response
      }
      showToast('调整余额成功')
      return true
    } catch (error) {
      console.error('调整余额失败:', error)
      showToast('调整余额失败')
      return false
    }
  }

  return {
    accounts,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    transfer,
    adjustBalance
  }
}) 