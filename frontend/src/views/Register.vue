<template>
  <div class="min-h-screen bg-gradient-warm-subtle flex items-center justify-center p-4 animate-fade-in">
    <div class="max-w-md w-full">
      <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-warm-lg p-8 space-y-6 transform transition-all duration-300 hover:shadow-warm-lg card-hover animate-scale-in">
        <div class="text-center space-y-4">
          <div class="flex justify-center">
            <div class="w-20 h-20 gradient-warm rounded-2xl flex items-center justify-center shadow-warm transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              <svg class="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
          </div>
          <h2 class="text-3xl font-display font-bold bg-gradient-to-r from-warm-600 to-warm-500 bg-clip-text text-transparent">
            注册账号
          </h2>
          <p class="text-gray-600 font-medium">
            创建您的家庭账本账号
          </p>
        </div>

        <van-form @submit="onSubmit" class="space-y-6">
          <van-cell-group inset class="space-y-4">
            <van-field
              v-model="roomNumber"
              name="roomNumber"
              label="房间号"
              placeholder="请输入房间号"
              :rules="[{ required: true, message: '请输入房间号' }]"
              class="register-field"
            />
            <van-field
              v-model="password"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请输入密码' }]"
              class="register-field"
            />
            <van-field
              v-model="confirmPassword"
              type="password"
              name="confirmPassword"
              label="确认密码"
              placeholder="请再次输入密码"
              :rules="[
                { required: true, message: '请再次输入密码' },
                { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
              ]"
              class="register-field"
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
              {{ loading ? '注册中...' : '注册' }}
            </van-button>
          </div>
          
          <div class="text-center pt-2">
            <router-link to="/login" class="text-warm-600 hover:text-warm-700 font-medium transition-colors">
              已有账号？去登录
            </router-link>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const roomNumber = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const validateConfirmPassword = (value: string) => {
  return value === password.value
}

const onSubmit = async () => {
  loading.value = true
  try {
    await userStore.register(roomNumber.value, password.value)
    router.push('/')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 自定义 Vant 组件样式 */
:deep(.van-cell-group--inset) {
  border-radius: 1rem;
  overflow: hidden;
  background: transparent;
  border: 1px solid var(--color-warm-200);
}

.register-field :deep(.van-field__label) {
  color: var(--color-gray-700);
  font-weight: 600;
  font-family: var(--font-body);
}

.register-field :deep(.van-field__control) {
  color: var(--color-gray-900);
  font-family: var(--font-body);
}

.register-field :deep(.van-field__control:focus) {
  color: var(--color-warm-700);
}

.register-field :deep(.van-field) {
  background: var(--color-warm-50);
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.register-field :deep(.van-field:focus-within) {
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