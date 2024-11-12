import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import path from 'path'
import fs from 'fs'

const largeFilesDir = 'D:\\assets\\galile-Exv'
const externalFiles = fs.readdirSync(largeFilesDir).map(file => path.join(largeFilesDir, file))
console.log('externalFiles', externalFiles)


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
  // resolve: {
  //   alias: {
  //     '@assets': path.resolve('D:\\assets\\galile-Exv'), // 设置 @ 指向 src 目录
  //   },
  // },
  // define: {
  //   GLOBAL_SRC_PATH: JSON.stringify(path.resolve('D:\\assets\\galile-Exv')),
  // },
  // build: {
  //   rollupOptions: {
  //     external: 'D:\\assets\\galile-Exv\\video_111013.mp4'
  //   }
  // }
})