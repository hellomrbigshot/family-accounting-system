/**
 * DEV VERIFY 用共享 UI 状态（仅 PWA 弹窗等无法经 store 驱动的可见性）。
 * 业务组件只允许读取/绑定此状态，禁止在此目录外注册 handler。
 */
import { reactive } from 'vue'

export const e2ePwaState = reactive({
  showInstall: false,
  showUpdate: false,
  updateNewVersion: '9.9.9-e2e',
})
