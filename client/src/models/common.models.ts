import { LoggerLevel, LoggerType } from "../constants/logger.constants";
import { HostType } from "../constants/common.constants";

export interface HostBase {
  host: string;
}

export interface HostStatus extends HostBase {
  isAlive: boolean | null;
}

export interface HostResponseBody {
  hostStatuses: HostStatus[];
}

export interface PingHosts extends HostBase {
  name: string;
  type: HostType;
  children: PingHosts[];
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
  pingHosts: PingHosts[];
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
