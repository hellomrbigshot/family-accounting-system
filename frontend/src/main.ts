import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './main.css'

// 注册推送通知
// async function registerPushNotification() {
//   try {
//     const registration = await navigator.serviceWorker.ready;
//     const permission = await Notification.requestPermission();
    
//     if (permission === 'granted') {
//       const subscription = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY' // 需要替换为实际的 VAPID 公钥
//       });
      
//       // 将订阅信息发送到服务器
//       await fetch('/api/push/subscribe', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(subscription)
//       });
//     }
//   } catch (error) {
//     console.error('推送通知注册失败:', error);
//   }
// }

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('ServiceWorker registration successful with scope:', registration.scope);
      
      // 注册推送通知
      // await registerPushNotification();
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  });
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 等待路由准备就绪
router.isReady().then(() => {
  app.mount('#app')
})
