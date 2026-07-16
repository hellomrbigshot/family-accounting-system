<template>
  <div ref="listAnchorEl">
    <div v-if="listLoading" class="px-2 py-3 space-y-3" aria-busy="true">
      <van-skeleton
        v-for="n in 6"
        :key="n"
        title
        :row="1"
        class="rounded-xl overflow-hidden"
      />
    </div>
    <div v-else-if="expenses.length === 0" class="text-center text-gray-500 py-8 leading-relaxed">
      {{ emptyText }}
    </div>
    <template v-else-if="virtual">
      <div
        :style="{ height: `${totalSize}px`, width: '100%', position: 'relative' }"
        data-testid="expense-virtual-list"
      >
        <div
          v-for="item in virtualItems"
          :key="item.key"
          :ref="measureElement"
          :data-index="item.index"
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${item.start - scrollMargin}px)`
          }"
        >
          <ExpenseListItem
            :expense="expenses[item.index]"
            :show-delete="showDelete"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </div>
      </div>
      <div ref="sentinelEl" class="h-1" aria-hidden="true" />
      <div v-if="loadingMore" class="text-center text-gray-400 text-sm py-3">加载中...</div>
      <div v-else-if="finished && finishedText" class="text-center text-gray-400 text-sm py-3">
        {{ finishedText }}
      </div>
    </template>
    <template v-else>
      <ExpenseListItem
        v-for="expense in expenses"
        :key="expense.id"
        :expense="expense"
        :show-delete="showDelete"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
      <div v-if="loadingMore" class="text-center text-gray-400 text-sm py-3">加载中...</div>
      <div v-else-if="!finished && expenses.length > 0" ref="sentinelEl" class="h-1" aria-hidden="true" />
      <div v-else-if="finished && finishedText && expenses.length > 0" class="text-center text-gray-400 text-sm py-3">
        {{ finishedText }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useWindowVirtualizer } from '@tanstack/vue-virtual'
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
  listLoading: boolean
  showDelete: boolean
  emptyText: string
  finishedText: string
  finished: boolean
  loadingMore: boolean
  virtual: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', expense: ExpenseWithCategory): void
  (e: 'delete', expense: ExpenseWithCategory): void
  (e: 'load-more'): void
}>()

const listAnchorEl = ref<HTMLElement | null>(null)
const sentinelEl = ref<HTMLElement | null>(null)
const scrollMargin = ref(0)

const updateScrollMargin = () => {
  if (!listAnchorEl.value) {
    scrollMargin.value = 0
    return
  }
  scrollMargin.value = listAnchorEl.value.getBoundingClientRect().top + window.scrollY
}

const rowVirtualizer = useWindowVirtualizer(
  computed(() => ({
    count: props.expenses.length,
    estimateSize: () => 104,
    overscan: 6,
    scrollMargin: scrollMargin.value,
    enabled: props.virtual
  }))
)

const virtualItems = computed(() => rowVirtualizer.value.getVirtualItems())
const totalSize = computed(() => rowVirtualizer.value.getTotalSize())

const measureElement = (el: Element | null) => {
  if (!el) return
  rowVirtualizer.value.measureElement(el)
}

let observer: IntersectionObserver | null = null

const setupObserver = () => {
  observer?.disconnect()
  observer = null

  if (!sentinelEl.value || props.finished || props.listLoading) return

  // 整页滚动：root 为视口
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        emit('load-more')
      }
    },
    {
      root: null,
      rootMargin: '160px',
      threshold: 0
    }
  )
  observer.observe(sentinelEl.value)
}

watch(
  [sentinelEl, () => props.finished, () => props.listLoading, () => props.expenses.length],
  () => {
    nextTick(() => {
      updateScrollMargin()
      setupObserver()
    })
  },
  { immediate: true }
)

onMounted(() => {
  updateScrollMargin()
  window.addEventListener('resize', updateScrollMargin)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', updateScrollMargin)
})
</script>
