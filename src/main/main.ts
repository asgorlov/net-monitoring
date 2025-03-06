import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";
import url from "url";

let mainWindow: BrowserWindow | null;

function createWindow(): void {
  const options = {
    webPreferences: {
      preload: path.join(__dirname, "preloader.js"),
      contextIsolation: true,
    },
    show: false,
  };
  mainWindow = new BrowserWindow(options);
  mainWindow.maximize();
  mainWindow.show();

  const filePath =
    process.env.RENDERER_URL ||
    url.format({
      pathname: path.join(__dirname, "..", "renderer", "index.html"),
      protocol: "file:",
      slashes: true,
    });
  mainWindow.loadURL(filePath);

  mainWindow.on("closed", () => (mainWindow = null));

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
}

app.on("ready", createWindow);
app.on("activate", () => mainWindow && mainWindow.show());
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

ipcMain.handle(
  "toMain",
  async (event: IpcMainInvokeEvent, data: any): Promise<any> => {
    console.log(data);
    return "Received your message!";
  },
);
