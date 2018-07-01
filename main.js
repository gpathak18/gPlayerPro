'use strict';

const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')

const url = require('url')
const remote = require('electron').remote;

let win
// let splashScreen

function createWindow() {

  win = new BrowserWindow({
    webPreferences: {

      webSecurity: false
    },
    titleBarStyle: 'hiddenInset',
    // vibrancy: 'dark',
        // titleBarStyle: 'hidden',
    width: 1120,
    height: 780,
    minHeight: 600,
    minWidth: 900,
    icon: 'file:///' + __dirname + '/dist/gPlayerPro/assets/icon.png'
    
  })
  win.loadURL('http://localhost:4200')
  // win.loadURL('file:///' + __dirname + '/dist/gPlayerPro/index.html')
  // win.setMaximumSize(1024, 768)

  win.on('closed', () => {
    win = null
  })

  win.once('ready-to-show', () => {
    setTimeout(function () {
      // displayNow(splashScreen, win);
      win.show()
    }, 1000);
  })

  win.webContents.on('will-navigate', ev => {
    ev.preventDefault();
  })

  win.ondragover = function(e) {
    // $('body').addClass('file-hover');
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    return false;
  };
  
  win.ondrop = function(e) {
    console.log(e);
    e.preventDefault();
    // $('body').removeClass('file-hover');
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

  // splashScreen = new BrowserWindow({
  //   width: 800,
  //   height: 400,
  //   frame: false,
  //   transparent: true,
  //   show: true,
  //   radii: [5, 5, 5, 5],
  //   backgroundColor: '#EFEFEF'
  // })
  
  // splashScreen.loadURL('http://localhost:4200/splash.html')
  
  // splashScreen.once('ready-to-show', () => {
  //   splashScreen.show();
  // })

  createWindow();
})

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
    // setListeners()
    
  }
})

function setListeners(){
  win.ondragover = function(e) {
    // $('body').addClass('file-hover');
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    return false;
  };
  
  win.ondrop = function(e) {
    e.preventDefault();
    // $('body').removeClass('file-hover');
    for (var i = 0; i < e.dataTransfer.files.length; ++i) {
      console.log(e.dataTransfer.files[i].path);
    }
    return false;
  };
}
