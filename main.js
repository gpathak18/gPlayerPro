'use strict';

const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const path = require('path')

const url = require('url')
const remote = require('electron').remote;

let win
let cWin 
// let splashScreen

function createWindow() {

  win = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      experimentalFeatures: true
    },
    titleBarStyle: 'hiddenInset',
    // vibrancy: 'dark',
    // titleBarStyle: 'hidden',
    width: 1120,
    height: 769,
    minHeight: 769,
    minWidth: 900,
    icon: 'file:///' + __dirname + '/dist/gPlayerPro/assets/icon.png'

  })
  win.loadURL('http://localhost:4200')
  // win.loadURL('file:///' + __dirname + '/dist/gPlayerPro/index.html')
  // win.setMaximumSize(1024, 768)

  win.on('closed', () => {
    win = null
  })
  win.toggleDevTools();
  win.once('ready-to-show', () => {
    win.show()
  })

  win.webContents.on('will-navigate', ev => {
    ev.preventDefault();
  })

  win.ondragover = function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    return false;
  };

  win.ondrop = function (e) {
    e.preventDefault();
    for (var i = 0; i < e.dataTransfer.files.length; ++i) {
      console.log(e.dataTransfer.files[i].path);
    }
    return false;
  };

}

function displayNow(splashScreen, win) {
  splashScreen.close()
  win.show()
}
app.on('ready', function () {
  createWindow();
  getBackgroundWindow()
})

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function setListeners() {
  win.ondragover = function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    return false;
  };

  win.ondrop = function (e) {
    e.preventDefault();
    for (var i = 0; i < e.dataTransfer.files.length; ++i) {
      console.log(e.dataTransfer.files[i].path);
    }
    return false;
  };
}

function getBackgroundWindow() {
  cWin = new BrowserWindow({ parent: win, show: false })
  cWin.loadURL('http://localhost:4200/index.html#files')
  // cWin.loadURL('file:///' + __dirname + '/dist/gPlayerPro/index.html#files')

}

ipcMain.on('OpenFileDialog', (event, arg) => {
  // event.sender.send('got-window', 'pong')
  cWin.webContents.send('OpenFile',arg)
})

ipcMain.on('got-files', (event, arg) => {
  console.log('b', arg)
})