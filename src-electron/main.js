const { app, BrowserWindow } = require('electron')
const path = require('node:path')

// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建浏览器窗口时，调用这个函数。
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    fullscreen: true, // 设置窗口全屏
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // webSecurity: false,
      // contextIsolation: true,
      // enableRemoteModule: false,
    }
  })

  // win.loadURL('http://localhost:3000')
  // development模式
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    // 开启调试台
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.webContents.on('did-finish-load', () => {
    let folderPath = process.argv
    const args = {}
    if (process.env.NODE_ENV === 'development') {
      folderPath = 'D:\\assets\\galile-Exv' // 替换为实际文件夹路径
    }
    console.log('process.env.NODE_ENV', process.env.NODE_ENV, args)
    win.webContents.send('set-folder-path', args)
  })
}



// Electron 会在初始化后并准备
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
