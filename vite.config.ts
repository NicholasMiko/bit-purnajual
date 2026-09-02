import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['vee-validate', 'yup'],
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    modulePreload: { polyfill: false },
  },
  esbuild: {
    target: 'es2022',
    supported: { 'top-level-await': true },
  },
  server: {
    watch: {
      ignored: (filePath) => filePath.endsWith('.md'),
    },
  },
})
