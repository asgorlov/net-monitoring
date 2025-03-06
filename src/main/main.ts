import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";
import url from "url";

const createWindow = (): void => {
  const options = {
    webPreferences: {
      preload: path.join(__dirname, "preloader.js"),
      contextIsolation: true,
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
};

app.whenReady().then(() => {
  createWindow();

  app.on(
    "activate",
    () => BrowserWindow.getAllWindows().length === 0 && createWindow(),
  );
});

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

ipcMain.handle(
  "toMain",
  async (event: IpcMainInvokeEvent, data: any): Promise<any> => {
    console.log(data);
    return "Received your message!";
  },
);
