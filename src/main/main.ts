import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import url from "url";
import ChannelName from "./constants/channel-name.constants";
import IpcMainHandlerUtils from "./utils/ipc-main-handler.utils";

/**
 * Init Electron
 */
const createWindow = (): void => {
  const options = {
    webPreferences: {
      preload: path.join(__dirname, "preloader.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  };
  const mainWindow = new BrowserWindow(options);
  const filePath =
    process.env.RENDERER_URL ||
    url.format({
      pathname: path.join(__dirname, "..", "renderer", "index.html"),
      protocol: "file:",
      slashes: true,
    });
  mainWindow.loadURL(filePath).finally(() => {
    mainWindow.maximize();
    mainWindow.show();

    if (process.env.RENDERER_URL) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  global.sendToRenderer = (channel: string, ...args: any[]) => {
    mainWindow.webContents.send(channel, ...args);
  };
};

app.whenReady().then(() => {
  createWindow();

  app.on(
    "activate",
    () => BrowserWindow.getAllWindows().length === 0 && createWindow(),
  );
});

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

/**
 * IPC Main Handlers
 */
ipcMain.handle(ChannelName.OPEN_TAB, IpcMainHandlerUtils.openTab);

ipcMain.handle(
  ChannelName.SEND_RENDERER_LOGS,
  IpcMainHandlerUtils.sendRendererLogs,
);

ipcMain.handle(ChannelName.CLEAR_LOG_FILES, IpcMainHandlerUtils.clearLogFiles);

ipcMain.handle(ChannelName.GET_CONFIG, IpcMainHandlerUtils.getConfig);

ipcMain.handle(ChannelName.UPDATE_CONFIG, IpcMainHandlerUtils.updateConfig);

ipcMain.handle(
  ChannelName.CREATE_DEFAULT_CONFIG,
  IpcMainHandlerUtils.createDefaultConfig,
);

ipcMain.handle(ChannelName.PING_HOST, IpcMainHandlerUtils.pingHost);

ipcMain.handle(ChannelName.ABORT_PING_HOST, IpcMainHandlerUtils.abortPingHost);
