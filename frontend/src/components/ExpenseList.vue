<template>
  <div class="bg-white">
    <van-pull-refresh v-if="showRefresh" v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
      >
        <ExpenseListItem
          v-for="expense in displayExpenses"
          :key="expense.id"
          :expense="expense"
          :show-delete="showDelete"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </van-list>
    </van-pull-refresh>
    
    <!-- 无刷新功能的简单列表 -->
    <div v-else>
      <div v-if="displayExpenses.length === 0" class="text-center text-gray-500 py-8">
        {{ emptyText }}
      </div>
      <div v-else>
        <ExpenseListItem
          v-for="expense in displayExpenses"
          :key="expense.id"
          :expense="expense"
          :show-delete="showDelete"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="确认删除"
      show-cancel-button
      @confirm="confirmDelete"
    >
      <div class="p-4 text-center">
        确定要删除这条支出记录吗？
      </div>
    </van-dialog>
  </div> 
</template>
<script setup lang="ts">
import { useExpenseStore } from '@/stores/expense'
import ExpenseListItem from '@/components/ExpenseListItem.vue'

interface ExpenseWithCategory {
  id: string
  date: string
  category: string
  amount: number
  description: string
  tags: string[]
  isExtra: boolean
  createdAt: string
}

const props = defineProps<{
  expenses: ExpenseWithCategory[]
  showRefresh?: boolean
  showDelete?: boolean
  maxItems?: number
  emptyText?: string
  finishedText?: string
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'delete', expense: ExpenseWithCategory): void
  (e: 'edit', expense: ExpenseWithCategory): void
}>()

// 设置默认值
const showRefresh = computed(() => props.showRefresh ?? true)
const maxItems = computed(() => props.maxItems ?? 0)
const emptyText = computed(() => props.emptyText ?? '暂无支出记录')
const finishedText = computed(() => props.finishedText ?? '没有更多了')
const showDelete = computed(() => props.showDelete ?? false)

const expenseStore = useExpenseStore()
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const showDeleteDialog = ref(false)
const expenseToDelete = ref<{ id: string } | null>(null)

// 显示的支出列表（可能被限制数量）
const displayExpenses = computed(() => {
  if (maxItems.value > 0) {
    return props.expenses.slice(0, maxItems.value)
  }
  return props.expenses
})

// 处理刷新
const onRefresh = () => {
  finished.value = false
  emit('refresh')
  refreshing.value = false
}

// 处理加载更多
const onLoad = () => {
  if (maxItems.value > 0 && props.expenses.length >= maxItems.value) {
    finished.value = true
  }
  loading.value = false
}

// 处理删除
const handleDelete = (expense: ExpenseWithCategory) => {
  expenseToDelete.value = expense;
  showDeleteDialog.value = true;
}

// 处理编辑
const handleEdit = (expense: ExpenseWithCategory) => {
  emit('edit', expense)
}

// 确认删除
const confirmDelete = async () => {
  if (!expenseToDelete.value) return
  
  try {
    await expenseStore.deleteExpense(expenseToDelete.value.id)
    showToast('删除成功')
    emit('refresh')
  } catch (error) {
    console.error('删除支出记录失败:', error)
    showToast('删除失败')
  } finally {
    expenseToDelete.value = null
    showDeleteDialog.value = false;
  }
}
</script>

<style scoped>
/* 样式已移至 ExpenseListItem 组件 */
</style> 