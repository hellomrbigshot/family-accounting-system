<template>
  <div>
    <div class="mx-auto px-4 pb-6 pt-2">
      <div class="mb-4">
        <PageHeader title="更多" />
      </div>

      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-warm overflow-hidden p-3">
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="group w-full rounded-2xl border border-warm-200 bg-[color:var(--color-warm-50)] px-3.5 py-3 active:bg-white"
            @click="router.push('/categories')"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-10 h-10 rounded-2xl bg-white border border-warm-200 flex items-center justify-center text-warm-600"
                >
                  <van-icon name="apps-o" size="18" />
                </div>
                <div class="min-w-0 text-left">
                  <div class="text-sm font-semibold text-slate-900 truncate">分类管理</div>
                  <div class="text-xs text-slate-500 truncate">分类与标签</div>
                </div>
              </div>
              <van-icon name="arrow" class="text-slate-400 group-active:text-slate-500" />
            </div>
          </button>

          <button
            type="button"
            class="group w-full rounded-2xl border border-warm-200 bg-[color:var(--color-warm-50)] px-3.5 py-3 active:bg-white"
            @click="router.push('/reports')"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-10 h-10 rounded-2xl bg-white border border-warm-200 flex items-center justify-center text-warm-600"
                >
                  <van-icon name="chart-trending-o" size="18" />
                </div>
                <div class="min-w-0 text-left">
                  <div class="text-sm font-semibold text-slate-900 truncate">支出分析</div>
                  <div class="text-xs text-slate-500 truncate">趋势与分类</div>
                </div>
              </div>
              <van-icon name="arrow" class="text-slate-400 group-active:text-slate-500" />
            </div>
          </button>
        </div>
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
                <div class="text-xs text-slate-500">将返回登录页</div>
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

