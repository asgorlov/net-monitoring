import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import ChannelName from "./constants/channel-name.constant";
import {
  ConsoleLoggerRow,
  MainLogsHandlerType,
} from "../shared/models/logger.models";
import { API } from "../global";
import { LoggerLevel } from "../shared/constants/logger.constants";

const api: API = {
  openTab: (url: string) => ipcRenderer.invoke(ChannelName.OPEN_TAB, url),
  listenMainLogs: (handler: MainLogsHandlerType) =>
    ipcRenderer.on(
      ChannelName.SEND_MAIN_LOGS,
      (_e: IpcRendererEvent, row: ConsoleLoggerRow) => handler(row),
    ),
  writeRendererLogs: (level: LoggerLevel, logObj: Error | string) =>
    ipcRenderer.invoke(ChannelName.SEND_RENDERER_LOGS, level, logObj),
};

contextBridge.exposeInMainWorld("api", api);
