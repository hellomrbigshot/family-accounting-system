<template>
  <div class="h-screen bg-gradient-warm-subtle flex flex-col">
    <!-- 顶部导航栏 -->
    <nav class="z-10 bg-white/80 backdrop-blur-md shadow-md border-b border-warm-100 sticky top-0">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-xl font-display font-bold bg-gradient-to-r from-warm-600 to-warm-500 bg-clip-text text-transparent hover:from-warm-700 hover:to-warm-600 transition-all duration-300"
            >
              家庭账本
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="handleLogout" 
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-warm-600 hover:bg-warm-50 rounded-lg transition-all duration-200 hover:shadow-sm"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 中间内容区域 -->
    <main class="flex-1 overflow-y-auto">
      <div class="container mx-auto pt-4 pb-14">
        <transition name="page" mode="out-in">
          <router-view class="animate-fade-in"></router-view>
        </transition>
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <van-tabbar v-model="active" class="md:hidden border-t border-warm-200 bg-white/90 backdrop-blur-md" @change="handleTabChange">
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
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const navItems = [
  { name: '首页', path: '/', icon: 'home-o' },
  { name: '支出', path: '/expenses', icon: 'balance-o' },
  { name: '分类', path: '/categories', icon: 'apps-o' },
  { name: '报表', path: '/reports', icon: 'chart-trending-o' }
];

// 将 active 改为 ref，初始值根据当前路由计算
const active = ref(0);

// 监听路由变化，自动更新 active 值
watch(() => route.path, (newPath) => {
  const index = navItems.findIndex(item => item.path === newPath);
  active.value = index !== -1 ? index : 0;
}, { immediate: true });

const handleTabChange = (index: number) => {
  router.push(navItems[index].path);
};

const handleLogout = async () => {
  await authStore.logout();
};
</script>

<style scoped>
/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Tabbar 样式优化 */
:deep(.van-tabbar) {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

:deep(.van-tabbar-item) {
  @apply text-gray-500 transition-colors duration-200;
}

:deep(.van-tabbar-item--active) {
  @apply text-warm-600;
}

:deep(.van-tabbar-item__icon) {
  transition: transform 0.2s ease;
}

:deep(.van-tabbar-item--active .van-tabbar-item__icon) {
  transform: scale(1.1);
}
</style>
