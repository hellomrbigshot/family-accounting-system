<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <nav class="bg-white shadow-sm border-b border-gray-100">
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
    <main class="py-6">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const navItems = [
  { name: '首页', path: '/' },
  { name: '支出', path: '/expenses' },
  { name: '分类', path: '/categories' }
];

const isActive = (path: string) => {
  return router.currentRoute.value.path === path;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script> 