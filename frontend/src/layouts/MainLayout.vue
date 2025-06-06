<template>
  <div class="h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- 顶部导航栏 -->
    <nav class="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <router-link to="/" class="text-xl font-bold text-gray-900">家庭记账</router-link>
            <div class="hidden md:flex space-x-4">
              <router-link 
                v-for="item in navItems" 
                :key="item.path" 
                :to="item.path"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.path) 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                ]"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">{{ currentPageTitle }}</span>
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
    <main class="h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] mt-16 overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
      <div class="container mx-auto pt-4">
        <router-view></router-view>
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <div class="fixed bottom-0 left-0 right-0 z-10 md:hidden bg-white border-t border-gray-200">
      <div class="grid grid-cols-4 h-16">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex flex-col items-center justify-center text-sm',
            isActive(item.path)
              ? 'text-indigo-600'
              : 'text-gray-600'
          ]"
        >
          <span class="text-lg mb-1">
            {{ item.icon }}
          </span>
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

const navItems = [
  { name: '首页', path: '/', icon: '🏠' },
  { name: '支出', path: '/expenses', icon: '💰' },
  { name: '分类', path: '/categories', icon: '📋' },
  { name: '报表', path: '/reports', icon: '📊' }
];

const currentPageTitle = computed(() => {
  const currentRoute = router.currentRoute.value;
  const currentNavItem = navItems.find(item => item.path === currentRoute.path);
  return currentNavItem?.name || '';
});

const isActive = (path: string) => {
  return router.currentRoute.value.path === path;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script> 