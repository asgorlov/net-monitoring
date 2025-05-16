import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
} from "electron";
import path from "path";
import url from "url";
import ChannelName from "./constants/channel-name.constants";
import IpcMainHandlerUtils from "./utils/ipc-main-handler.utils";

/**
 * Init Electron
 */
const createMainWindow = (): BrowserWindow => {
  const options = {
    webPreferences: {
      preload: path.join(__dirname, "preloader.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  };

  return new BrowserWindow(options);
};

const configureMainWindow = (mainWindow: BrowserWindow) => {
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
};

const configureApplicationMenu = (mainWindow: BrowserWindow) => {
  const webContents = mainWindow.webContents;
  const contextTemplate: MenuItemConstructorOptions[] = [
    {
      label: "Обновить",
      accelerator: "F5",
      role: "reload",
    },
    { type: "separator" },
    {
      label: "Отменить действие",
      accelerator: "CommandOrControl+Z",
      role: "undo",
    },
    {
      label: "Повторить действие",
      accelerator: "CommandOrControl+Y",
      role: "redo",
    },
    { type: "separator" },
    {
      label: "Вырезать",
      accelerator: "CommandOrControl+X",
      role: "cut",
    },
    {
      label: "Копировать",
      accelerator: "CommandOrControl+C",
      role: "copy",
    },
    {
      label: "Вставить",
      accelerator: "CommandOrControl+V",
      role: "paste",
    },
    {
      label: "Удалить",
      role: "delete",
    },
    { type: "separator" },
    {
      label: "Выделить все",
      accelerator: "CommandOrControl+A",
      role: "selectAll",
    },
  ];
  const contextMenu = Menu.buildFromTemplate(contextTemplate);
  webContents.on("context-menu", (e: Event) => {
    e.preventDefault();
    contextMenu.popup({ window: mainWindow });
  });

  const menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: "Меню",
      submenu: [
        {
          label: "Инструменты разработчика",
          accelerator: "F12",
          role: "toggleDevTools",
        },
        {
          label: "Обновить",
          accelerator: "F5",
          role: "reload",
        },
        {
          label: "Вид",
          submenu: [
            {
              label: "Уменьшить",
              accelerator: "F2",
              role: "zoomOut",
            },
            {
              label: "Увеличить",
              accelerator: "F3",
              role: "zoomIn",
            },
            {
              label: "Фактический размер",
              accelerator: "F4",
              role: "resetZoom",
            },
            {
              label: "Полноэкранный режим",
              accelerator: "F11",
              role: "togglefullscreen",
            },
          ],
        },
        { type: "separator" },
        {
          label: "Выход",
          role: "quit",
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

const configureGlobalVariables = (mainWindow: BrowserWindow) => {
  mainGlobal.sendToRenderer = (channel: string, ...args: any[]) => {
    mainWindow.webContents.send(channel, ...args);
  };
};

const initWindow = (): void => {
  const mainWindow = createMainWindow();
  configureGlobalVariables(mainWindow);
  configureApplicationMenu(mainWindow);
  configureMainWindow(mainWindow);
};

app.whenReady().then(() => {
  initWindow();

  app.on(
    "activate",
    () => BrowserWindow.getAllWindows().length === 0 && initWindow(),
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
