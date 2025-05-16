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
import { PingHostParams, uuid } from "../shared/models/host.models";

const api: API = {
  openLogsFolder: () => ipcRenderer.invoke(ChannelName.OPEN_LOGS_FOLDER),
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
  createDefaultConfig: (): Promise<GettingConfigResult> =>
    ipcRenderer.invoke(ChannelName.CREATE_DEFAULT_CONFIG),
  pingHost: (params: PingHostParams): Promise<boolean | null> =>
    ipcRenderer.invoke(ChannelName.PING_HOST, params),
  abortPingHost: (id: uuid) =>
    ipcRenderer.invoke(ChannelName.ABORT_PING_HOST, id),
};

contextBridge.exposeInMainWorld("api", api);
