import { LoggerLevel, LoggerType } from "../constants/logger.constants";
import { PingHost } from "./host.models";

export interface ConfigRequest {
  interval: number;
  timeout: number;
  autoPing: boolean;
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

export interface ActionResult {
  errorMessage?: string;
}

export interface GettingConfigResult extends ActionResult {
  config?: Config;
}
