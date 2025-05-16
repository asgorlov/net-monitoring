import { LoggerLevel } from "../../shared/constants/logger.constants";
import { ConsoleLoggerRow } from "../../shared/models/logger.models";

const debug = (logObj: Error | string) => {
  window.api.writeRendererLogs(LoggerLevel.DEBUG, logObj);
};

const info = (logObj: Error | string) => {
  window.api.writeRendererLogs(LoggerLevel.INFO, logObj);
};

const error = (logObj: Error | string) => {
  window.api.writeRendererLogs(LoggerLevel.ERROR, logObj);
};

const log = (loggerRow: ConsoleLoggerRow) => {
  console.log(loggerRow.row, ...loggerRow.settings);
};

const Logger = {
  debug: debug,
  info: info,
  error: error,
  log: log,
};

export default Logger;
