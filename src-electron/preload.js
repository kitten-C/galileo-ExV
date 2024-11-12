const { contextBridge, ipcRenderer, remote, shell } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  // 提供一个函数，监听主进程发送的命令行参数
  onSetFolderPath: (callback) => ipcRenderer.on('set-folder-path', (event, args) => callback(args)),
})

contextBridge.exposeInMainWorld('device', (device, fun, data) => {
  ipcRenderer.send('device', { device: device, function: fun, data: data })
})