import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 告诉 Vue 这是一个第三方 3D 组件标签，不要抛出警告
          isCustomElement: (tag) => tag === 'spline-viewer'
        }
      }
    })
  ],
})
