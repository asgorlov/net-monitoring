import { contextBridge, ipcRenderer } from "electron";
import ChannelName from "./constants/channel-name.constant";

contextBridge.exposeInMainWorld("api", {
  openTab: (url: string) => ipcRenderer.invoke(ChannelName.OPEN_TAB, url),
});
