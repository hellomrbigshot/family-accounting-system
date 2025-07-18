import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 等待路由准备就绪
router.isReady().then(() => {
  app.mount('#app')
}) 