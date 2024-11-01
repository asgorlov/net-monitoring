import { LoggerLevel, LoggerType } from "../constants/logger.constants";
import { HostType } from "../constants/common.constants";

export type uuid = string;

export interface HostBase {
  id: uuid;
  host: string;
}

export interface HostStatus extends HostBase {
  isAlive: boolean | null;
}

export interface HostResponseBody {
  hostStatuses: HostStatus[];
}

export interface PingHost extends HostBase {
  name: string;
  type: HostType;
  children: PingHost[];
}

export interface HostViewModel extends HostStatus {
  pinging: boolean;
}

export interface ConfigRequest {
  interval: number;
  timeout: number;
}

export interface ConfigLogger {
  level: LoggerLevel;
  type: LoggerType;
  numberOfLogFiles: number;
  logFileSizeInBytes: number;
}

export interface Config {
  port: number;
  logger: ConfigLogger;
  request: ConfigRequest;
  pingHosts: PingHost[];
}

export interface ConfigError {
  message: string;
}

export interface UpdatingConfig extends Partial<ConfigError> {
  isUpdated: boolean;
}

export interface ClearingLogFiles extends Partial<ConfigError> {
  isCleared: boolean;
}

export interface SettingsForm
  extends ConfigRequest,
    Omit<ConfigLogger, "logFileSizeInBytes"> {
  port: number;
  logFileSize: number;
}
