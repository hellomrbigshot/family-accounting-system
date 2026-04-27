<template>
  <div>
    <div class="mx-auto px-4 pb-6 pt-2">
      <div class="mb-4">
        <PageHeader title="更多" />
      </div>

      <div class="space-y-3">
        <button
          type="button"
          class="group w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-warm overflow-hidden"
          @click="router.push('/categories')"
        >
          <div class="px-4 py-4 flex items-start justify-between gap-4">
            <div class="flex items-start gap-3.5 min-w-0">
              <div
                class="w-11 h-11 rounded-2xl bg-[color:var(--color-warm-50)] border border-warm-200 flex items-center justify-center text-warm-600 flex-shrink-0"
              >
                <van-icon name="apps-o" size="18" />
              </div>
              <div class="min-w-0 text-left">
                <div class="text-sm font-semibold text-slate-900 leading-snug">分类管理</div>
                <div class="mt-1 text-xs text-slate-500 leading-snug break-words">分类与标签</div>
              </div>
            </div>
            <van-icon name="arrow" class="text-slate-400 group-active:text-slate-500 mt-1" />
          </div>
        </button>

        <button
          type="button"
          class="group w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-warm overflow-hidden"
          @click="router.push('/reports')"
        >
          <div class="px-4 py-4 flex items-start justify-between gap-4">
            <div class="flex items-start gap-3.5 min-w-0">
              <div
                class="w-11 h-11 rounded-2xl bg-[color:var(--color-warm-50)] border border-warm-200 flex items-center justify-center text-warm-600 flex-shrink-0"
              >
                <van-icon name="chart-trending-o" size="18" />
              </div>
              <div class="min-w-0 text-left">
                <div class="text-sm font-semibold text-slate-900 leading-snug">支出分析</div>
                <div class="mt-1 text-xs text-slate-500 leading-snug break-words">趋势与分类</div>
              </div>
            </div>
            <van-icon name="arrow" class="text-slate-400 group-active:text-slate-500 mt-1" />
          </div>
        </button>
      </div>

      <div class="mt-4">
        <button
          type="button"
          class="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-warm overflow-hidden"
          @click="handleLogout"
        >
          <div class="px-4 py-3.5 flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600"
              >
                <van-icon name="warning-o" size="18" />
              </div>
              <div class="min-w-0 text-left">
                <div class="text-sm font-semibold text-red-600">退出登录</div>
              </div>
            </div>
            <van-icon name="arrow" class="text-slate-400" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await showConfirmDialog({
      title: '退出登录',
      message: '确定要退出登录吗'
    })
  } catch {
    return
  }

  await authStore.logout()
}
</script>

