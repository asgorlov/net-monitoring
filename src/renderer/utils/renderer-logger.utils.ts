import {
  LoggerLevel,
  LoggerType,
} from "../../shared/constants/logger.constants";
import LoggerHelper from "../../shared/helpers/logger.helper";
import { ConfigLogger } from "../../shared/models/config.models";
import { defaultConfig } from "../../shared/constants/config.constants";

const getSettings = (): ConfigLogger => {
  return window.logger || defaultConfig.logger;
};

const show = (level: LoggerLevel): boolean => {
  const settings = getSettings();
  return (
    settings.type !== LoggerType.FILE &&
    LoggerHelper.isLogWritable(level, settings.level)
  );
};

const logToConsole = (level: LoggerLevel, logObj: Error | string) => {
  if (show(level)) {
    const isErrorInstance = logObj instanceof Error;
    const message = isErrorInstance ? logObj.message : logObj;
    const { row, settings } = LoggerHelper.createConsoleRow(level, message);
    console.log(row, ...settings);
  }
};

const debug = (logObj: Error | string) => {
  logToConsole(LoggerLevel.DEBUG, logObj);
};

const info = (logObj: Error | string) => {
  logToConsole(LoggerLevel.INFO, logObj);
};

const error = (logObj: Error | string) => {
  logToConsole(LoggerLevel.ERROR, logObj);
};

const Logger = {
  debug: debug,
  info: info,
  error: error,
};

export default Logger;
