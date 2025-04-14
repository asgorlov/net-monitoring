import { LoggerLevel, LoggerType } from "./logger.constants";
import { Config } from "../models/config.models";

export const freeze = (obj) => {
  Object.keys(obj)
    .filter((k) => typeof obj[k] === "object")
    .forEach((k) => (obj[k] = freeze(obj[k])));

  return Object.freeze(obj);
};

export const defaultConfig: Config = freeze({
  port: 8008,
  logger: {
    level: LoggerLevel.DEBUG,
    type: LoggerType.CONSOLE,
    numberOfLogFiles: 5, // if it < 0 - infinite number of files
    logFileSizeInBytes: 52428800, // 50Mb, if it < 0 - infinite size
  },
  request: {
    autoPing: true,
    interval: 30, // can't be less 1
    timeout: 29, // can't be less 1 and more interval
  },
  pingHosts: [],
});

export const MIN_ECHO_REPLY = 1;
export const DEFAULT_TIMEOUT_ECHO_REPLY_IN_MS = 1000; // for Win ping.exe by default

export const CONFIG_FILE_NAME: string = "config.json";
export const CONFIG_FILE_TYPE: string = "application/json";
