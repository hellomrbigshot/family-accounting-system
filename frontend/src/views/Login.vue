<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-2xl">
        <div class="text-center space-y-4">
          <div class="flex justify-center">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-105">
              <svg class="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">
            家庭记账系统
          </h2>
          <p class="text-gray-500">
            您的家庭财务管理助手
          </p>
        </div>

        <van-form @submit="handleSubmit" class="space-y-6">
          <van-cell-group inset class="space-y-4">
            <van-field
              v-model="form.roomNumber"
              name="roomNumber"
              label="房间号"
              placeholder="请输入房间号"
              :rules="[{ required: true, message: '请填写房间号' }]"
              class="rounded-lg"
            />
            <van-field
              v-model="form.password"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
              class="rounded-lg"
            />
          </van-cell-group>

          <div class="pt-4">
            <van-button
              type="primary"
              native-type="submit"
              block
              :loading="loading"
              class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
            >
              {{ loading ? '登录中...' : '登录' }}
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const loading = ref(false);

const form = reactive({
  roomNumber: '',
  password: ''
});

const handleSubmit = async () => {
  try {
    loading.value = true;
    await authStore.login(form.roomNumber, form.password);
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 添加一些微妙的动画效果 */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 自定义 Vant 组件样式 */
:deep(.van-cell-group--inset) {
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.van-field__label) {
  color: #4b5563;
  font-weight: 500;
}

:deep(.van-field__control) {
  color: #1f2937;
}

:deep(.van-button--primary) {
  border: none;
}
</style> 