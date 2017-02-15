global.electron = require('electron');
global.app = electron.app;
const BrowserWindow = electron.BrowserWindow;

global.debug = !~process.argv.indexOf('--debug');

let mainWindow;
require('coffee-script/register');
require('./interceptor');

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 500 + 58,
    height: 630,
    resizable: !debug
  });

  mainWindow.loadURL(`file://${__dirname}/gui/index.pug`);

  !debug && mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  app.quit();
});
