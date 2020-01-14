import { app, BrowserWindow, ipcMain, dialog } from 'electron'
const Store = require('electron-store');
const store = new Store();

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

console.log(app.getPath('userData'));

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 1000,
    useContentSize: true,
    minWidth: 750,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  init();
}

function init () {
  ipcMain.on('get-websites', (event, websiteClass) => {
    let websites = store.get('websites')
    event.sender.send('get-websites', websites);
  })

  ipcMain.on('save-website-class', (event, websiteClass) => {
    let websites = store.get('websites')
    if (!websites) {
      websites = [websiteClass]
    } else {
      websites.push(websiteClass)
    }
    store.set('websites', websites)
    event.sender.send('save-website-class-success', websites);
  })

  ipcMain.on('upload-website-icon', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{
        name: 'Images',
        extensions: ['jpg', 'png', 'gif', 'jpeg']
      }]
    }, path => {
      event.sender.send('upload-website-icon-success', path);
    })
  })

  ipcMain.on('save-website', (event, classId, website) => {
    let websites = store.get('websites')
    let myWebsiteClass = websites.find(item => {
      return item.id === classId
    })
    myWebsiteClass.websites.push(website)
    store.set('websites', websites)
    event.sender.send('save-website-success', websites)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
