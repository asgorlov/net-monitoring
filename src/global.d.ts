import { MainLogsHandlerType } from "./shared/models/logger.models";
import { LoggerLevel } from "./shared/constants/logger.constants";
import {
  Config,
  ActionResult,
  GettingConfigResult,
} from "./shared/models/config.models";

export interface API {
  openTab: (url: string) => Promise<void>;
  listenMainLogs: (handler: MainLogsHandlerType) => void;
  writeRendererLogs: (
    level: LoggerLevel,
    logObj: Error | string,
  ) => Promise<void>;
  clearLogFiles: () => Promise<ActionResult>;
  getConfig: () => Promise<GettingConfigResult>;
  updateConfig: (config: Config) => Promise<ActionResult>;
  createDefaultConfig: () => Promise<GettingConfigResult>;
}

declare global {
  interface Window {
    api: API;
  }

  var sendToRenderer: (channel: string, ...args: any[]) => void;
}
