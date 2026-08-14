import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  app,
  BrowserWindow,
  dialog,
  Menu,
  nativeImage,
  nativeTheme,
  shell,
  Tray,
} from 'electron'
import { startDshService } from './dsh-service.js'
import {
  isManagedAdvisorProvision,
  provisionAdvisorPreset,
  resolveBundledAdvisorSkillDir,
  resolveOfficialCordisPresetDir,
} from './advisor-preset-provisioner.js'
import { applyMacTitleBarStyle } from './mac-titlebar.js'
import {
  provisionBundledFeatures,
  resolveBundledSkinsDirectory,
} from './plugin-provisioner.js'
import { createWindowOptions } from './window-options.js'
import { createTrayMenuTemplate, shouldHideWindowOnClose } from './window-lifecycle.js'

const APP_NAME = 'DeepSeek Harness Whale Desktop'
const STARTUP_PAGE = fileURLToPath(new URL('./startup.html', import.meta.url))
const EXTENSIONS_PAGE = fileURLToPath(new URL('./extensions.html', import.meta.url))
const TRAY_ICON = fileURLToPath(new URL('../assets/tray.png', import.meta.url))
const TRAY_TEMPLATE_ICON = fileURLToPath(new URL('../assets/trayTemplate.png', import.meta.url))

let mainWindow
let extensionsWindow
let service
let serviceUrl
let tray
let trayAvailable = false
let isQuitting = false

app.setName(APP_NAME)

async function showMainWindow() {
  if (!mainWindow) {
    await createWindow()
    if (serviceUrl) await mainWindow?.loadURL(serviceUrl)
  }
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
  mainWindow.focus()
}

async function showExtensionAcademy() {
  if (!extensionsWindow) {
    extensionsWindow = new BrowserWindow({
      width: 920,
      height: 720,
      minWidth: 680,
      minHeight: 520,
      show: false,
      title: 'Whale Desktop — Extensions & Tutorials',
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    })
    extensionsWindow.webContents.setWindowOpenHandler(({ url }) => {
      void shell.openExternal(url)
      return { action: 'deny' }
    })
    extensionsWindow.webContents.on('will-navigate', (event) => event.preventDefault())
    extensionsWindow.once('ready-to-show', () => extensionsWindow?.show())
    extensionsWindow.on('closed', () => { extensionsWindow = undefined })
    await extensionsWindow.loadFile(EXTENSIONS_PAGE)
  } else {
    extensionsWindow.show()
    extensionsWindow.focus()
  }
}

function createWindow() {
  if (process.platform === 'win32') Menu.setApplicationMenu(null)

  mainWindow = new BrowserWindow(createWindowOptions(process.platform, nativeTheme.shouldUseDarkColors))

  if (process.platform === 'win32') {
    mainWindow.setMenu(null)
    mainWindow.setMenuBarVisibility(false)
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const currentUrl = mainWindow?.webContents.getURL()
    if (currentUrl && new URL(url).origin !== new URL(currentUrl).origin) {
      event.preventDefault()
      void shell.openExternal(url)
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    if (process.platform === 'darwin') void applyMacTitleBarStyle(mainWindow.webContents)
  })

  mainWindow.once('ready-to-show', () => mainWindow?.show())
  mainWindow.on('close', (event) => {
    if (!shouldHideWindowOnClose(isQuitting, trayAvailable)) return
    event.preventDefault()
    mainWindow?.hide()
  })
  mainWindow.on('closed', () => {
    mainWindow = undefined
  })

  return mainWindow.loadFile(STARTUP_PAGE)
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(
    process.platform === 'darwin' ? TRAY_TEMPLATE_ICON : TRAY_ICON,
  )
  if (process.platform === 'darwin') trayIcon.setTemplateImage(true)
  tray = new Tray(trayIcon)
  tray.setToolTip(APP_NAME)
  tray.setContextMenu(Menu.buildFromTemplate(createTrayMenuTemplate({
    locale: app.getLocale(),
    showWindow: () => void showMainWindow(),
    hideWindow: () => mainWindow?.hide(),
    openExtensions: () => void showExtensionAcademy(),
    quit: () => {
      isQuitting = true
      app.quit()
    },
  })))
  tray.on('click', () => void showMainWindow())
  trayAvailable = true
}

async function launch() {
  const startupReady = createWindow()
  try {
    createTray()
  } catch (error) {
    console.warn(`System tray is unavailable: ${error instanceof Error ? error.message : String(error)}`)
  }

  const environment = {
    ...process.env,
    DSH_DESKTOP: '1',
    DSH_HOME: path.join(app.getPath('userData'), 'dsh'),
    DSH_SKINS_DIR: resolveBundledSkinsDirectory(),
    NODE_OPTIONS: '',
  }
  const featureProvisions = await provisionBundledFeatures({
    electronExecutable: process.execPath,
    environment,
  })
  for (const [packageName, result] of Object.entries(featureProvisions)) {
    if (result.status === 'failed') {
      console.warn(`${packageName} is unavailable: ${result.error}`)
    }
  }

  const advisorProvision = await provisionAdvisorPreset({
    dshHome: environment.DSH_HOME,
    sourcePresetDir: resolveOfficialCordisPresetDir(),
    advisorSkillDir: resolveBundledAdvisorSkillDir(),
  })
  environment.WHALE_ADVISOR_MANAGED = isManagedAdvisorProvision(advisorProvision) ? '1' : '0'
  if (advisorProvision.status === 'conflict') {
    console.warn('AI Extension Advisor preset id is already owned by the user; Creator Center will use its safe fallback.')
  } else if (advisorProvision.status === 'failed') {
    console.warn(`AI Extension Advisor is unavailable: ${advisorProvision.error}`)
  }

  service = startDshService({
    electronExecutable: process.execPath,
    environment,
  })

  try {
    serviceUrl = await service.ready
    await startupReady
    await mainWindow?.loadURL(serviceUrl)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await dialog.showMessageBox({
      type: 'error',
      title: `${APP_NAME} failed to start`,
      message: 'DeepSeek Harness could not start.',
      detail: message,
    })
    app.quit()
  }
}

const hasSingleInstanceLock = app.requestSingleInstanceLock()

if (!hasSingleInstanceLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    void showMainWindow()
  })

  app.whenReady().then(launch)
}

app.on('activate', () => {
  void showMainWindow()
})

app.on('window-all-closed', () => {
  if (isQuitting || (!trayAvailable && process.platform !== 'darwin')) app.quit()
})

app.on('before-quit', () => {
  isQuitting = true
  service?.stop()
})
