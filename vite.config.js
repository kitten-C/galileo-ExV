import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import path from 'path'
import fs from 'fs'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      // 主进程入口文件
      entry: './src-electron/main.js'
    })
  ],
  /*开发服务器选项*/
  server: {
    // 端口
    port: 3000,
  },
  // publicDir: 'D:\\assets\\galile-Exv',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
})