<template>
  <div class="min-h-screen bg-gradient-warm-subtle flex items-center justify-center p-4 animate-fade-in">
    <div class="max-w-md w-full">
      <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-warm-lg p-8 space-y-6 transform transition-all duration-300 hover:shadow-warm-lg card-hover animate-scale-in">
        <div class="text-center space-y-4">
          <div class="flex justify-center">
            <div class="w-20 h-20 gradient-warm rounded-2xl flex items-center justify-center shadow-warm transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              <svg class="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
          </div>
          <h2 class="text-3xl font-display font-bold bg-gradient-to-r from-warm-600 to-warm-500 bg-clip-text text-transparent">
            家庭账本
          </h2>
          <p class="text-gray-600 font-medium">
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
              class="login-field"
            />
            <van-field
              v-model="form.password"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
              class="login-field"
            />
          </van-cell-group>

          <div class="pt-4">
            <van-button
              type="primary"
              native-type="submit"
              block
              :loading="loading"
              class="gradient-warm text-white font-medium py-3 px-4 rounded-xl shadow-warm hover:shadow-warm-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
import { useAuthStore } from '@/stores/auth'

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
/* 自定义 Vant 组件样式 */
:deep(.van-cell-group--inset) {
  border-radius: 1rem;
  overflow: hidden;
  background: transparent;
  border: 1px solid var(--color-warm-200);
}

.login-field :deep(.van-field__label) {
  color: var(--color-gray-700);
  font-weight: 600;
  font-family: var(--font-body);
}

.login-field :deep(.van-field__control) {
  color: var(--color-gray-900);
  font-family: var(--font-body);
}

.login-field :deep(.van-field__control:focus) {
  color: var(--color-warm-700);
}

.login-field :deep(.van-field) {
  background: var(--color-warm-50);
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.login-field :deep(.van-field:focus-within) {
  background: white;
  border-color: var(--color-warm-400);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

:deep(.van-button--primary) {
  border: none;
  background: linear-gradient(135deg, var(--color-warm-500) 0%, var(--color-warm-600) 100%);
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, var(--color-warm-600) 0%, var(--color-warm-700) 100%);
}
</style> 