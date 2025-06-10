import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dts: 'src/auto-imports.d.ts',
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          from: 'pinia',
          imports: ['defineStore', 'storeToRefs'],
          type: true,
        },
        {
          from: 'vue-router',
          imports: ['RouteLocationRaw', 'RouteRecordRaw', 'useRouter', 'useRoute'],
          type: true,
        },
        {
          'js-cookie': [
            ['default', 'Cookies']
          ]
        },
        {
          'dayjs': [
            ['default', 'dayjs']
          ]
        },
        {
          'localforage': [
            ['default', 'localForage']
          ]
        },
        {
          'axios': [
            ['default', 'axios']
          ]
        }
      ],
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'vant-vendor': ['vant'],
          'echarts-vendor': ['echarts'],
        },
      },
    },
  },
})
