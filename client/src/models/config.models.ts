import { LoggerLevel, LoggerType } from "../constants/logger.constants";
import { PingHost } from "./host.models";

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
