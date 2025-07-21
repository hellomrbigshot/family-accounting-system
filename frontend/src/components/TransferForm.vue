<template>
  <van-form @submit="onSubmit">
    <van-field
      v-model="fromAccount"
      name="fromAccount"
      label="转出账户"
      placeholder="请选择转出账户"
      readonly
      :rules="[{ required: true, message: '请选择转出账户' }]"
      @click="showFromAccountPicker = true"
    />
    <van-field
      v-model="toAccount"
      name="toAccount"
      label="转入账户"
      placeholder="请选择转入账户"
      readonly
      :rules="[{ required: true, message: '请选择转入账户' }]"
      @click="showToAccountPicker = true"
    />
    <van-field
      v-model="amount"
      type="number"
      name="amount"
      label="金额"
      placeholder="请输入金额"
      :rules="[
        { required: true, message: '请输入金额' },
        { validator: validateAmount, message: '金额必须大于0且最多保留两位小数' }
      ]"
    />
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit" :loading="loading">
        提交
      </van-button>
    </div>
  </van-form>

  <van-popup v-model:show="showFromAccountPicker" position="bottom">
    <van-picker
      :columns="accountNames"
      @confirm="onFromAccountConfirm"
      @cancel="showFromAccountPicker = false"
      show-toolbar
      title="选择转出账户"
    />
  </van-popup>

  <van-popup v-model:show="showToAccountPicker" position="bottom">
    <van-picker
      :columns="accountNames"
      @confirm="onToAccountConfirm"
      @cancel="showToAccountPicker = false"
      show-toolbar
      title="选择转入账户"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/stores/account'


const emit = defineEmits<{
  (e: 'success'): void
}>()

const accountStore = useAccountStore()

const fromAccount = ref('')
const toAccount = ref('')
const amount = ref('')
const loading = ref(false)
const showFromAccountPicker = ref(false)
const showToAccountPicker = ref(false)

const accountNames = computed(() => accountStore.accounts.map(a => a.name))

const validateAmount = (value: string) => {
  if (!value) return false
  const num = parseFloat(value)
  if (isNaN(num) || num <= 0) return false
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return false
  return true
}

const onFromAccountConfirm = (value: string) => {
  fromAccount.value = value
  showFromAccountPicker.value = false
}

const onToAccountConfirm = (value: string) => {
  toAccount.value = value
  showToAccountPicker.value = false
}

const onSubmit = async () => {
  try {
    loading.value = true
    const fromAccountId = accountStore.accounts.find(a => a.name === fromAccount.value)?.id
    const toAccountId = accountStore.accounts.find(a => a.name === toAccount.value)?.id
    if (!fromAccountId || !toAccountId) {
      showToast('账户不存在')
      return
    }
    const success = await accountStore.transfer({
      fromAccountId,
      toAccountId,
      amount: parseFloat(amount.value)
    })
    if (success) {
      showToast('转账成功')
      emit('success')
    }
  } catch (error) {
    console.error('转账失败:', error)
    showToast('转账失败')
  } finally {
    loading.value = false
  }
}
</script> 