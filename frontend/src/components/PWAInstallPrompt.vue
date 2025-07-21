<template>
  <van-popup
    v-model:show="showInstallPrompt"
    position="bottom"
    :style="{ height: 'auto' }"
    round
  >
    <div class="p-6">
      <div class="text-center mb-4">
        <div class="w-16 h-16 mx-auto mb-3 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-2xl">📱</span>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">安装家庭账本</h3>
        <p class="text-sm text-gray-600">
          将应用添加到主屏幕，享受更快的访问速度和离线使用体验
        </p>
      </div>
      
      <div class="flex space-x-3">
        <van-button
          type="default"
          size="large"
          block
          @click="dismissPrompt"
        >
          稍后再说
        </van-button>
        <van-button
          type="primary"
          size="large"
          block
          @click="installApp"
        >
          立即安装
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">

const showInstallPrompt = ref(false)

const installApp = async () => {
  const deferredPrompt = (window as any).deferredPrompt
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('用户接受了安装提示')
    }
    (window as any).deferredPrompt = null
    showInstallPrompt.value = false
  }
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  // 可以设置一个标记，避免频繁显示
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}

onMounted(() => {
  // 检查是否应该显示安装提示
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  const dismissedTime = dismissed ? parseInt(dismissed) : 0
  const now = Date.now()
  
  // 如果用户在过去24小时内没有拒绝过，则显示提示
  if (now - dismissedTime > 24 * 60 * 60 * 1000) {
    // 延迟显示，避免与页面加载冲突
    setTimeout(() => {
      if ((window as any).deferredPrompt) {
        showInstallPrompt.value = true
      }
    }, 3000)
  }
})
</script> 