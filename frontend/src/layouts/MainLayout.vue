<template>
  <div class="h-[100dvh] overflow-hidden bg-gradient-warm-subtle flex flex-col">
    <!-- 中间内容区域 -->
    <main class="flex-1 min-h-0 overflow-y-auto">
      <div class="container mx-auto pt-2 pb-2">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <van-tabbar
      v-model="active"
      :fixed="false"
      safe-area-inset-bottom
      :border="false"
      class="md:hidden bg-transparent flex-shrink-0"
      @change="handleTabChange"
    >
      <van-tabbar-item
        v-for="item in navItems"
        :key="item.path"
        :icon="item.icon"
      >
        {{ item.name }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const navItems = [
  { name: '首页', path: '/', icon: 'home-o' },
  { name: '支出', path: '/expenses', icon: 'balance-o' },
  { name: '日历', path: '/calendar', icon: 'calendar-o' },
  { name: '更多', path: '/more', icon: 'more-o' }
]

// 将 active 改为 ref，初始值根据当前路由计算
const active = ref(0)

// 监听路由变化，自动更新 active 值
watch(() => route.path, (newPath) => {
  const index = navItems.findIndex(item => item.path === newPath)

  if (index !== -1) {
    active.value = index
    return
  }

  // 从“更多”进入的页面，保持底部高亮为“更多”
  if (newPath === '/reports' || newPath === '/categories') {
    const moreIndex = navItems.findIndex(item => item.path === '/more')
    active.value = moreIndex === -1 ? 0 : moreIndex
    return
  }

  active.value = 0
}, { immediate: true })

const handleTabChange = (index: number) => {
  router.push(navItems[index].path)
}
</script>

<style scoped>
/* Tabbar 样式优化 */
:deep(.van-tabbar) {
  --van-tabbar-background: transparent;
  box-shadow: none;
  background: transparent;
  border: 0;
  backdrop-filter: none;
}

:deep(.van-tabbar::before),
:deep(.van-tabbar::after) {
  display: none;
  content: none;
}

:deep(.van-tabbar-item) {
  --van-tabbar-item-active-background: transparent;
  background: transparent;
  border: 0;
  @apply text-gray-500 transition-colors duration-200;
}

:deep(.van-tabbar-item--active) {
  background: transparent;
  @apply text-warm-600;
}

:deep(.van-tabbar-item::before),
:deep(.van-tabbar-item::after) {
  display: none;
  content: none;
}

:deep(.van-tabbar-item__icon) {
  transition: transform 0.2s ease;
}

:deep(.van-tabbar-item--active .van-tabbar-item__icon) {
  transform: scale(1.1);
}
</style>
