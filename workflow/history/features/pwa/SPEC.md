# SPEC — 验收标准 [追溯]

> source: retroactive | 全局 PWA

## 验收标准

### AC-1：安装提示

- **Given**：浏览器支持 PWA 且未安装
- **When**：满足展示条件
- **Then**：出现安装引导组件，用户可 dismiss

### AC-2：更新提示

- **Given**：Service Worker 有新版本
- **When**：检测到更新
- **Then**：提示用户刷新应用

## 实现记录

`PWAInstallPrompt.vue` `PWAUpdatePrompt.vue` `vite-plugin-pwa`

## 备注

E2E 依赖浏览器 PWA 环境，可标记为手动 VERIFY 或 skip。
