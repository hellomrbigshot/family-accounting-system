import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dts: true,
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
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
