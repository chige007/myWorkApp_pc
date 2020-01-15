import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
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
    // fullscreen: true,
    height: 650,
    width: 1200,
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
// 初始化事件
function init() {
  // 获取所有网站信息
  ipcMain.on('get-websites', (event, websiteClass) => {
    let websites = store.get('websites')
    event.sender.send('get-websites', websites);
  })
  // 保存网站分类
  ipcMain.on('save-website-class', (event, websiteClass) => {
    let websites = store.get('websites')
    if (!websites) {
      websites = [websiteClass]
    } else { // 新增第一个类
      let index = websites.findIndex(item => {
        return item.id === websiteClass.id;
      })
      if (index != -1) {// 修改类名
        websites[index]['name'] = websiteClass.name;
      } else { // 新增类
        websites.push(websiteClass)
      }
    }
    store.set('websites', websites)
    event.sender.send('save-website-class-success', websites);
  })
  // 删除网站分类事件
  ipcMain.on('remove-website-class', (event, id) => {
    let websites = store.get('websites')
    let index = websites.findIndex(item => {
      return item.id === id;
    })
    if (index != -1) { // 删除网站分类
      websites.splice(index, 1);
      store.set('websites', websites)
      event.sender.send('remove-website-class-success', websites);
    }
  });
  // 上传网站图标
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
  // 保存网站信息
  ipcMain.on('save-website', (event, classId, website) => {
    let websites = store.get('websites')
    let myWebsiteClass = websites.find(item => {
      return item.id === classId
    })
    let index = myWebsiteClass.websites.findIndex(item => item.id == website.id)
    if (index == -1) { // 新增网站
      myWebsiteClass.websites.push(website)
    } else { // 修改网站
      myWebsiteClass.websites[index] = website
    }
    store.set('websites', websites)
    event.sender.send('save-website-success', websites)
  })
  // 删除网站信息
  ipcMain.on('remove-website', (event, classId, websiteId) => {
    let websites = store.get('websites')
    let removeWebsiteClassIndex = websites.findIndex(item => item.id == classId);
    if (removeWebsiteClassIndex != -1) { // 找到所属分类的索引
      let removeWebsiteIndex = websites[removeWebsiteClassIndex]['websites'].findIndex(item => item.id == websiteId);
      if (removeWebsiteIndex != -1) { // 找到要删除的网站索引
        websites[removeWebsiteClassIndex]['websites'].splice(removeWebsiteIndex, 1);
        store.set('websites', websites)
        event.sender.send('remove-website-success', websites)
      }
    }
  })
  // 打开网页
  ipcMain.on('open-web', (event, url) => {
    shell.openExternal(url);
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
