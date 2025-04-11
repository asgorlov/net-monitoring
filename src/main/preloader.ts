import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import ChannelName from "./constants/channel-name.constants";
import {
  ConsoleLoggerRow,
  MainLogsHandlerType,
} from "../shared/models/logger.models";
import { API } from "../global";
import { LoggerLevel } from "../shared/constants/logger.constants";
import {
  Config,
  ActionResult,
  GettingConfigResult,
} from "../shared/models/config.models";

const api: API = {
  openTab: (url: string) => ipcRenderer.invoke(ChannelName.OPEN_TAB, url),
  listenMainLogs: (handler: MainLogsHandlerType) => {
    ipcRenderer.on(
      ChannelName.SEND_MAIN_LOGS,
      (_e: IpcRendererEvent, row: ConsoleLoggerRow) => handler(row),
    );
  },
  writeRendererLogs: (level: LoggerLevel, logObj: Error | string) =>
    ipcRenderer.invoke(ChannelName.SEND_RENDERER_LOGS, level, logObj),
  clearLogFiles: (): Promise<ActionResult> =>
    ipcRenderer.invoke(ChannelName.CLEAR_LOG_FILES),
  getConfig: (): Promise<GettingConfigResult> =>
    ipcRenderer.invoke(ChannelName.GET_CONFIG),
  updateConfig: (config: Config): Promise<ActionResult> =>
    ipcRenderer.invoke(ChannelName.UPDATE_CONFIG, config),
  createDefaultConfig: (): Promise<ActionResult> =>
    ipcRenderer.invoke(ChannelName.CREATE_DEFAULT_CONFIG),
};

contextBridge.exposeInMainWorld("api", api);
