import fs, { Dirent } from "fs";
import path from "path";
import Path from "../constants/path.constants";
import {
  LoggerLevel,
  LoggerType,
} from "../../shared/constants/logger.constants";
import { defaultConfig } from "../../shared/constants/config.constants";
import { ConfigLogger } from "../../shared/models/config.models";
import ChannelName from "../constants/channel-name.constants";
import { ConsoleLoggerRow } from "../../shared/models/logger.models";
import ConfigUtils from "./config.utils";

let logFileStream = null;

const getSettings = (): ConfigLogger => {
  try {
    return ConfigUtils.get().logger;
  } catch (e) {
    return defaultConfig.logger;
  }
};

const show = (level: LoggerLevel, type: LoggerType): boolean => {
  const settings = getSettings();
  if (settings.type !== LoggerType.BOTH && settings.type !== type) {
    return false;
  }

  switch (settings.level) {
    case LoggerLevel.DEBUG:
      return level !== LoggerLevel.OFF;
    case LoggerLevel.INFO:
      return level === LoggerLevel.INFO || level === LoggerLevel.ERROR;
    case LoggerLevel.ERROR:
      return level === LoggerLevel.ERROR;
    default:
      return false;
  }
};

const isDirExisted = (): boolean => {
  try {
    fs.mkdirSync(Path.logDir, { recursive: true });
    return true;
  } catch (e) {
    logToConsole(LoggerLevel.ERROR, e);
    return false;
  }
};

const removeFile = (file: Dirent) => {
  try {
    const pathToFile = path.join(Path.logDir, `/${file.name}`);
    fs.unlinkSync(pathToFile);
  } catch (e) {
    logToConsole(LoggerLevel.ERROR, e);
  }
};

const createFile = (row: string) => {
  try {
    const files = fs
      .readdirSync(Path.logDir, { withFileTypes: true })
      .filter((d) => !d.isDirectory());
    const numberOfLogFiles = getSettings().numberOfLogFiles;
    if (numberOfLogFiles > 0 && files.length >= numberOfLogFiles) {
      files.slice(0, files.length - 4).forEach(removeFile);
    }

    const pathToLogFile = path.join(Path.logDir, `/log-${Date.now()}.log`);
    logFileStream = fs.createWriteStream(pathToLogFile, { flags: "a" });
    logFileStream.write(row);
  } catch (e) {
    logToConsole(LoggerLevel.ERROR, e);
    logFileStream?.end();
    logFileStream = null;
  }
};

const recordRowToFile = (row: string) => {
  try {
    logFileStream.write(row);
  } catch (e) {
    logToConsole(LoggerLevel.ERROR, e);
    logFileStream?.end();
    logFileStream = null;
  }
};

const createRow = (
  level: LoggerLevel,
  message: string,
  isFileCase: boolean = false,
) => {
  const consoleChar = isFileCase ? "" : "%c";
  const tempData = [
    consoleChar,
    `[${level}]`,
    consoleChar,
    " - ",
    new Date().toISOString(),
    " - ",
    message,
    isFileCase ? "\n" : "",
  ];

  // [DEBUG] - 2025-04-11T06:47:35.452Z - Something wrong
  return tempData.join("");
};

const logToFile = (level: LoggerLevel, message: string) => {
  if (show(level, LoggerType.FILE)) {
    const row = createRow(level, message, true);

    if (logFileStream) {
      const logFileSizeInBytes = getSettings().logFileSizeInBytes;
      const isOverflow =
        logFileSizeInBytes > 0 &&
        logFileStream.bytesWritten >= logFileSizeInBytes;
      if (isOverflow) {
        logFileStream.end();
        logFileStream = null;
        createFile(row);
      }

      recordRowToFile(row);
    } else if (isDirExisted()) {
      createFile(row);
    }
  }
};

const getConsoleColor = (level: LoggerLevel): string => {
  let colorName: string;
  switch (level) {
    case LoggerLevel.ERROR:
      colorName = "red";
      break;
    case LoggerLevel.INFO:
      colorName = "orange";
      break;
    case LoggerLevel.DEBUG:
      colorName = "gray";
      break;
    default:
      colorName = "black";
  }

  return `color:${colorName};`;
};

const createConsoleLoggerRow = (
  level: LoggerLevel,
  message: string,
): ConsoleLoggerRow => {
  const color = getConsoleColor(level);
  const settings = [`${color}font-weight:bold;`, color];
  const row = createRow(level, message);

  return { row, settings };
};

const logToConsole = (level: LoggerLevel, message: string) => {
  if (show(level, LoggerType.CONSOLE)) {
    const loggerRow = createConsoleLoggerRow(level, message);
    console.log(loggerRow.row, ...loggerRow.settings);
    global.sendToRenderer(ChannelName.SEND_MAIN_LOGS, loggerRow);
  }
};

const debug = (logObj: Error | string) => {
  const message = logObj instanceof Error ? logObj.message : logObj;
  logToConsole(LoggerLevel.DEBUG, message);
  logToFile(LoggerLevel.DEBUG, message);
};

const info = (logObj: Error | string) => {
  const message = logObj instanceof Error ? logObj.message : logObj;
  logToConsole(LoggerLevel.INFO, message);
  logToFile(LoggerLevel.INFO, message);
};

const error = (logObj: Error | string) => {
  const message = logObj instanceof Error ? logObj.message : logObj;
  logToConsole(LoggerLevel.ERROR, message);
  logToFile(LoggerLevel.ERROR, message);
};

const clearLogDir = () => {
  if (isDirExisted()) {
    fs.readdirSync(Path.logDir).forEach((f) =>
      fs.unlinkSync(path.join(Path.logDir, f)),
    );
  }
};

const Logger = {
  debug: debug,
  info: info,
  error: error,
  clearLogDir: clearLogDir,
};

export default Logger;
