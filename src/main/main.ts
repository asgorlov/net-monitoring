import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preloader.js"),
      contextIsolation: true,
    },
    show: false,
  });
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
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
