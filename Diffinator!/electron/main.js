const { app, BrowserWindow } = require('electron');
const path = require('path');

// Global reference to prevent garbage collection
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Apex Diff-Vision Protocol",
    backgroundColor: '#0a0a0c', // Matches app theme to prevent white flash
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true, // Security: High
      preload: path.join(__dirname, 'preload.js')
    },
    // Hide default menu for a cleaner look (can be re-enabled if needed)
    autoHideMenuBar: true
  });

  // Determine if we are in Development or Production
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // In Dev: Load from Vite Dev Server
    // We wait a bit to ensure Vite is up, or just retry.
    // Usually concurrently runs them together.
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools in dev mode
    mainWindow.webContents.openDevTools();
  } else {
    // In Prod: Load the built index.html
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// App Lifecycle
app.on('ready', createWindow);

app.on('window-all-closed', function () {
  // On macOS, it's common for apps to stay open until the user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS, re-create a window in the app when the dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  }
});
