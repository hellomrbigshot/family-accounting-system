<template>
  <van-popup
    v-model:show="showUpdatePrompt"
    position="bottom"
    :style="{ height: 'auto' }"
    round
  >
    <div class="p-6">
      <div class="text-center mb-4">
        <div class="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
          <span class="text-2xl">🔄</span>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">发现新版本</h3>
        <p class="text-sm text-gray-600">
          应用已更新到新版本，点击更新以获取最新功能
        </p>
        <p class="text-xs text-gray-500 mt-2">
          当前版本: {{ currentVersion }} → 新版本: {{ newVersion }}
        </p>
      </div>
      
      <div class="flex space-x-3">
        <van-button
          type="default"
          size="large"
          block
          @click="dismissUpdate"
        >
          稍后更新
        </van-button>
        <van-button
          type="primary"
          size="large"
          block
          @click="updateApp"
          :loading="updating"
        >
          {{ updating ? '更新中...' : '立即更新' }}
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { registerSW } from 'virtual:pwa-register'

const showUpdatePrompt = ref(false)
const updating = ref(false)
const currentVersion = ref('')
const newVersion = ref('')

// 注册 Service Worker 更新检查
const updateSW = registerSW({
  onNeedRefresh() {
    showUpdatePrompt.value = true
    // 获取版本信息
    fetch('/src/version.json')
      .then(res => res.json())
      .then(data => {
        newVersion.value = data.version
      })
      .catch(() => {
        newVersion.value = '最新版本'
      })
  },
  onOfflineReady() {
    // showToast({
    //   type: 'success',
    //   message: '应用已准备就绪，可离线使用'
    // })
    console.log('应用已准备就绪，可离线使用')
  },
  onRegistered(swRegistration: ServiceWorkerRegistration) {
    console.log('Service Worker 已注册:', swRegistration)
  },
  onRegisterError(error: Error) {
    console.error('Service Worker 注册失败:', error)
  }
})

const updateApp = async () => {
  try {
    updating.value = true
    await updateSW()
    showUpdatePrompt.value = false
    showToast({
      type: 'success',
      message: '应用更新成功，即将刷新页面'
    })
    // 延迟刷新页面
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    console.error('更新失败:', error)
    showToast({
      type: 'fail',
      message: '更新失败，请稍后重试'
    })
  } finally {
    updating.value = false
  }
}

const dismissUpdate = () => {
  showUpdatePrompt.value = false
  // 可以设置一个标记，避免频繁显示
  localStorage.setItem('pwa-update-dismissed', Date.now().toString())
}

onMounted(async () => {
  // 获取当前版本信息
  try {
    const response = await fetch('/src/version.json')
    const data = await response.json()
    currentVersion.value = data.version
  } catch (error) {
    currentVersion.value = '未知版本'
  }
})
</script> 