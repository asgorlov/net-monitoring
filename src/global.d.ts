import { MainLogsHandlerType } from "./shared/models/logger.models";
import { LoggerLevel } from "./shared/constants/logger.constants";
import {
  Config,
  ActionResult,
  GettingConfigResult,
} from "./shared/models/config.models";
import { PingHostParams, uuid } from "./shared/models/host.models";

export interface API {
  openTab: (url: string) => Promise<void>;
  listenMainLogs: (handler: MainLogsHandlerType) => void;
  writeRendererLogs: (level: LoggerLevel, logObj: Error | string) => void;
  clearLogFiles: () => Promise<ActionResult>;
  getConfig: () => Promise<GettingConfigResult>;
  updateConfig: (config: Config) => Promise<ActionResult>;
  createDefaultConfig: () => Promise<GettingConfigResult>;
  pingHost: (params: PingHostParams) => Promise<boolean | null>;
  abortPingHost: (id: uuid) => Promise<void>;
}

declare global {
  interface Window {
    api: API;
  }

  var global: typeof globalThis & {
    sendToRenderer(channel: string, ...args: any[]): void;
  };
}
