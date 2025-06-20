<script setup lang="ts">
import PWAInstallPrompt from '@/components/PWAInstallPrompt.vue'
import PWAUpdatePrompt from '@/components/PWAUpdatePrompt.vue'
</script>

<template>
  <router-view />
  <PWAInstallPrompt />
  <PWAUpdatePrompt />
</template>

<style>
/* 全局样式 */
</style>
