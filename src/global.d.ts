import { MainLogsHandlerType } from "./shared/models/logger.models";
import { LoggerLevel } from "./shared/constants/logger.constants";

export interface API {
  openTab: (url: string) => Promise<void>;
  listenMainLogs: (handler: MainLogsHandlerType) => void;
  writeRendererLogs: (level: LoggerLevel, logObj: Error | string) => void;
}

declare global {
  interface Window {
    api: API;
  }

  var sendToRenderer: (channel: string, ...args: any[]) => void;
}
