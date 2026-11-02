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
import { useVirtualizer } from '@tanstack/vue-virtual'
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
const scrollElement = ref<HTMLElement | null>(null)

const updateScrollMargin = () => {
  if (!listAnchorEl.value) {
    scrollMargin.value = 0
    return
  }
  const host = scrollElement.value
  if (!host) return
  scrollMargin.value = listAnchorEl.value.getBoundingClientRect().top
    - host.getBoundingClientRect().top - host.clientTop + host.scrollTop
}

const rowVirtualizer = useVirtualizer(
  computed(() => ({
    count: props.expenses.length,
    getScrollElement: () => scrollElement.value,
    getItemKey: (index: number) => props.expenses[index].id,
    estimateSize: () => 104,
    overscan: 6,
    // 不同行高的测量在下一帧执行，避免 ResizeObserver 回调内反复修改布局。
    useAnimationFrameWithResizeObserver: true,
    scrollMargin: scrollMargin.value,
    enabled: props.virtual && !!scrollElement.value
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

  // 与虚拟列表共用实际滚动容器，底部导航不属于可见区域。
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        emit('load-more')
      }
    },
    {
      root: scrollElement.value,
      rootMargin: '160px',
      threshold: 0
    }
  )
  observer.observe(sentinelEl.value)
}

watch(
  [sentinelEl, scrollElement, () => props.finished, () => props.listLoading, () => props.expenses.length],
  () => {
    nextTick(() => {
      updateScrollMargin()
      setupObserver()
    })
  },
  { immediate: true }
)

let resizeObserver: ResizeObserver | null = null
let resizeFrame = 0

const scheduleScrollMarginUpdate = () => {
  cancelAnimationFrame(resizeFrame)
  resizeFrame = requestAnimationFrame(updateScrollMargin)
}

onMounted(() => {
  let parent = listAnchorEl.value?.parentElement
  while (parent) {
    if (/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) {
      scrollElement.value = parent
      break
    }
    parent = parent.parentElement
  }
  resizeObserver = new ResizeObserver(scheduleScrollMarginUpdate)
  if (scrollElement.value) resizeObserver.observe(scrollElement.value)
  if (listAnchorEl.value?.parentElement) resizeObserver.observe(listAnchorEl.value.parentElement)
  updateScrollMargin()
  window.addEventListener('resize', updateScrollMargin)
})

onUpdated(updateScrollMargin)

onBeforeUnmount(() => {
  cancelAnimationFrame(resizeFrame)
  resizeObserver?.disconnect()
  observer?.disconnect()
  window.removeEventListener('resize', updateScrollMargin)
})
</script>
