import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './main.css'
// 桌面端将 mouse 转为 touch，使 NumberKeyboard 等仅监听 touch 的组件可正常使用（见 Vant 进阶用法-桌面端适配）
import '@vant/touch-emulator'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 等待路由准备就绪
router.isReady().then(() => {
  app.mount('#app')
})