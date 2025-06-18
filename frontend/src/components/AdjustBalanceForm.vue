<template>
  <van-form @submit="onSubmit">
    <van-field
      v-model="amount"
      type="number"
      name="amount"
      label="调整金额"
      placeholder="请输入调整金额"
      :rules="[
        { required: true, message: '请输入调整金额' },
        { validator: validateAmount, message: '金额必须大于0且最多保留两位小数' }
      ]"
    />
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit" :loading="loading">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/stores/account'


const props = defineProps<{
  accountId: number
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const accountStore = useAccountStore()

const amount = ref('')
const loading = ref(false)

const validateAmount = (value: string) => {
  if (!value) return false
  const num = parseFloat(value)
  if (isNaN(num) || num <= 0) return false
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return false
  return true
}

const onSubmit = async () => {
  try {
    loading.value = true
    const success = await accountStore.adjustBalance({
      accountId: props.accountId,
      amount: parseFloat(amount.value)
    })
    if (success) {
      showToast('调整成功')
      emit('success')
    }
  } catch (error) {
    console.error('调整余额失败:', error)
    showToast('调整余额失败')
  } finally {
    loading.value = false
  }
}
</script> 