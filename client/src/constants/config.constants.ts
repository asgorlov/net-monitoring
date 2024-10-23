import { LoggerLevel, LoggerType } from "./logger.constants";
import { Config } from "../models/config.models";

export const defaultConfig: Config = {
  port: 8008,
  logger: {
    level: LoggerLevel.DEBUG,
    type: LoggerType.CONSOLE,
    numberOfLogFiles: 5, // if it < 0 - infinite number of files
    logFileSizeInBytes: 52428800 // 50Mb, if it < 0 - infinite size
  },
  request: {
    interval: 30000, // can't be less 1
    timeout: 30000 // can't be less 1 and more interval
  },
  pingHosts: []
};
