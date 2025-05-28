<template>
  <div class="register">
    <van-nav-bar
      title="注册"
      left-arrow
      @click-left="router.back()"
    />
    <div class="p-4">
      <van-form @submit="onSubmit">
        <van-field
          v-model="roomNumber"
          name="roomNumber"
          label="房间号"
          placeholder="请输入房间号"
          :rules="[{ required: true, message: '请输入房间号' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
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
        />
        <div class="mt-4">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            注册
          </van-button>
        </div>
        <div class="mt-4 text-center">
          <router-link to="/login" class="text-blue-500">
            已有账号？去登录
          </router-link>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
    const success = await userStore.register(roomNumber.value, password.value)
    if (success) {
      router.push('/')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register {
  min-height: 100vh
}
</style> 