"use strict";
const { app, BrowserWindow } = require("electron");
const path = require("node:path");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    fullscreen: true,
    // 设置窗口全屏
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
      // webSecurity: false,
      // contextIsolation: true,
      // enableRemoteModule: false,
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  win.webContents.on("did-finish-load", () => {
    process.argv;
    const args = {};
    if (process.env.NODE_ENV === "development") ;
    console.log("process.env.NODE_ENV", process.env.NODE_ENV, args);
    win.webContents.send("set-folder-path", args);
  });
};
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
