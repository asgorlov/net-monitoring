import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";
import url from "url";
import ChannelName from "./constants/channel-name.constant";
import CommonUtil from "./utils/common.util";
import { LoggerLevel } from "../shared/constants/logger.constants";
import Logger from "./utils/main-logger.utils";

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
ipcMain.handle(
  ChannelName.OPEN_TAB,
  (_e: IpcMainInvokeEvent, url: string): Promise<void> =>
    CommonUtil.openTabExternal(url),
);

ipcMain.handle(
  ChannelName.SEND_RENDERER_LOGS,
  (
    _e: IpcMainInvokeEvent,
    level: LoggerLevel,
    logObj: Error | string,
  ): void => {
    switch (level) {
      case LoggerLevel.DEBUG:
        Logger.debug(logObj);
        break;
      case LoggerLevel.INFO:
        Logger.info(logObj);
        break;
      case LoggerLevel.ERROR:
        Logger.error(logObj);
    }
  },
);
