<template>
  <div class="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
    <!-- 顶部导航栏 -->
    <nav class="z-10 bg-white shadow-sm border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <router-link to="/" class="text-xl font-bold text-gray-900">家庭记账</router-link>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="handleLogout" 
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 中间内容区域 -->
    <main class="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
      <div class="container mx-auto pt-4">
        <router-view></router-view>
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <van-tabbar v-model="active" class="md:hidden" @change="handleTabChange">
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

const active = computed(() => {
  const index = navItems.findIndex(item => item.path === route.path);
  return index !== -1 ? index : 0;
});

const navItems = [
  { name: '首页', path: '/', icon: 'home-o' },
  { name: '支出', path: '/expenses', icon: 'balance-o' },
  { name: '分类', path: '/categories', icon: 'apps-o' },
  { name: '报表', path: '/reports', icon: 'chart-trending-o' }
];

const handleTabChange = (index: number) => {
  router.push(navItems[index].path);
};

const handleLogout = async () => {
  await authStore.logout();
};
</script>

<style>
.van-tabbar {
  @apply border-t border-gray-200;
}

.van-tabbar-item {
  @apply text-gray-600;
}

.van-tabbar-item--active {
  @apply text-indigo-600;
}
</style> 