<template>
  <div class="bg-white">
    <van-pull-refresh v-if="showRefresh" v-model="refreshing" @refresh="onRefresh">
      <ExpenseListContent
        :expenses="displayExpenses"
        :list-loading="listLoading"
        :show-delete="showDelete"
        :empty-text="emptyText"
        :finished-text="listFinishedText"
        :finished="finished"
        :loading-more="loadingMore"
        :virtual="virtual"
        @edit="handleEdit"
        @delete="handleDelete"
        @load-more="onLoadMore"
      />
    </van-pull-refresh>

    <!-- 无刷新功能的简单列表 -->
    <div v-else>
      <ExpenseListContent
        :expenses="displayExpenses"
        :list-loading="listLoading"
        :show-delete="showDelete"
        :empty-text="emptyText"
        :finished-text="listFinishedText"
        :finished="true"
        :loading-more="false"
        :virtual="false"
        @edit="handleEdit"
        @delete="handleDelete"
      />
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
import ExpenseListContent from '@/components/ExpenseListContent.vue'

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

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'load-more'): void
  (e: 'delete', expense: ExpenseWithCategory): void
  (e: 'edit', expense: ExpenseWithCategory): void
}>()

const props = defineProps<{
  expenses: ExpenseWithCategory[]
  showRefresh?: boolean
  showDelete?: boolean
  maxItems?: number
  emptyText?: string
  finishedText?: string
  /** 为 true 时展示骨架屏，不渲染列表项（数据就绪后由父组件置为 false） */
  listLoading?: boolean
  /** 是否启用虚拟滚动（支出页长列表）；滚动宿主为整页，便于下拉刷新 */
  virtual?: boolean
  /** 是否还有下一页 */
  hasMore?: boolean
  /** 正在加载下一页 */
  loadingMore?: boolean
  /** 下拉刷新时调用；支持 Promise，完成后才会结束刷新动画 */
  refreshHandler?: () => void | Promise<void>
}>()

const showRefresh = computed(() => props.showRefresh ?? true)
const maxItems = computed(() => props.maxItems ?? 0)
const emptyText = computed(() => props.emptyText ?? '还没有支出，先记一笔吧。')
const finishedText = computed(() => props.finishedText ?? '已显示全部')
const showDelete = computed(() => props.showDelete ?? false)
const listLoading = computed(() => props.listLoading ?? false)
const virtual = computed(() => props.virtual ?? false)
const loadingMore = computed(() => props.loadingMore ?? false)
const finished = computed(() => !(props.hasMore ?? false))
const listFinishedText = computed(() => displayExpenses.value.length === 0 ? '' : finishedText.value)

const expenseStore = useExpenseStore()
const refreshing = ref(false)
const showDeleteDialog = ref(false)
const expenseToDelete = ref<{ id: string } | null>(null)

const displayExpenses = computed(() => {
  if (maxItems.value > 0) {
    return props.expenses.slice(0, maxItems.value)
  }
  return props.expenses
})

const runRefresh = async () => {
  if (props.refreshHandler) {
    await props.refreshHandler()
  } else {
    emit('refresh')
  }
}

const onRefresh = async () => {
  try {
    await runRefresh()
  } finally {
    refreshing.value = false
  }
}

const onLoadMore = () => {
  if (finished.value || loadingMore.value || listLoading.value) return
  emit('load-more')
}

const handleDelete = (expense: ExpenseWithCategory) => {
  expenseToDelete.value = expense
  showDeleteDialog.value = true
}

const handleEdit = (expense: ExpenseWithCategory) => {
  emit('edit', expense)
}

const confirmDelete = async () => {
  if (!expenseToDelete.value) return

  try {
    const ok = await expenseStore.deleteExpense(expenseToDelete.value.id)
    if (!ok) return
    showToast('删除成功')
    // 约定：删除后必须重新拉首屏，避免分页空洞
    await runRefresh()
  } catch (error) {
    console.error('删除支出记录失败:', error)
    showToast('删除失败')
  } finally {
    expenseToDelete.value = null
    showDeleteDialog.value = false
  }
}
</script>
