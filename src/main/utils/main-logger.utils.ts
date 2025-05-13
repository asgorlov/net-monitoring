import fs, { Dirent, Stats, WriteStream } from "fs";
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

interface LoggerFile {
  stream: WriteStream;
  stats: Stats;
}

let currentLogFile: LoggerFile | null = null;

const clearLoggerData = () => {
  currentLogFile?.stream.end();
  currentLogFile = null;
};

const getSettings = (): ConfigLogger => {
  try {
    return ConfigUtils.get().logger;
  } catch (_e) {
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
    const date = new Date().toISOString();
    logToConsole(LoggerLevel.ERROR, e, date);
    return false;
  }
};

const clearRedundantOldLogFiles = () => {
  try {
    const numberOfLogFiles = getSettings().numberOfLogFiles;
    if (numberOfLogFiles > 0) {
      const files = fs
        .readdirSync(Path.logDir, { withFileTypes: true })
        .filter((d) => !d.isDirectory());
      if (files.length >= numberOfLogFiles) {
        const removeFile = (f: Dirent) => {
          const pathToFile = path.join(Path.logDir, `/${f.name}`);
          fs.unlinkSync(pathToFile);
        };

        files
          .sort((f1, f2) => f2.name.localeCompare(f1.name))
          .slice(numberOfLogFiles - 1)
          .forEach(removeFile);
      }
    }
  } catch (e) {
    const date = new Date().toISOString();
    logToConsole(LoggerLevel.ERROR, e, date);
  }
};

const recordRowToFile = (row: string) => {
  try {
    currentLogFile.stream.write(row);
  } catch (e) {
    const date = new Date().toISOString();
    logToConsole(LoggerLevel.ERROR, e, date);
    clearLoggerData();
  }
};

const createFile = (row: string) => {
  clearRedundantOldLogFiles();

  try {
    const pathToLogFile = path.join(Path.logDir, `/log-${Date.now()}.log`);
    fs.writeFileSync(pathToLogFile, "");

    clearLoggerData();
    currentLogFile = {
      stream: fs.createWriteStream(pathToLogFile, { flags: "a" }),
      stats: fs.statSync(pathToLogFile),
    };
  } catch (e) {
    const date = new Date().toISOString();
    logToConsole(LoggerLevel.ERROR, e, date);
    clearLoggerData();
  }

  recordRowToFile(row);
};

const createRow = (
  level: LoggerLevel,
  message: string,
  date: string,
  isFileCase: boolean = false,
) => {
  const consoleChar = isFileCase ? "" : "%c";
  const tempData = [
    consoleChar,
    `[${level}]`,
    consoleChar,
    " - ",
    date,
    " - ",
    message,
    isFileCase ? "\n" : "",
  ];

  // [DEBUG] - 2025-04-11T06:47:35.452Z - Something wrong
  return tempData.join("");
};

const logToFile = (level: LoggerLevel, message: string, date: string) => {
  if (show(level, LoggerType.FILE)) {
    const isFileExisted =
      currentLogFile && fs.existsSync(currentLogFile.stream.path);
    if (isFileExisted) {
      const row = createRow(level, message, date, true);

      const isSameFile = () => {
        const stats = fs.statSync(currentLogFile.stream.path);
        return stats.ino === currentLogFile.stats.ino;
      };

      const isOverflow = () => {
        const logFileSizeInBytes = getSettings().logFileSizeInBytes;
        return (
          logFileSizeInBytes > 0 &&
          currentLogFile.stream.bytesWritten >= logFileSizeInBytes
        );
      };

      if (isSameFile() && !isOverflow()) {
        recordRowToFile(row);
      } else {
        createFile(row);
      }
    } else if (isDirExisted()) {
      const row = createRow(level, message, date, true);
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
  date: string,
): ConsoleLoggerRow => {
  const color = getConsoleColor(level);
  const settings = [`${color}font-weight:bold;`, color];
  const row = createRow(level, message, date);

  return { row, settings };
};

const logToConsole = (level: LoggerLevel, message: string, date: string) => {
  if (show(level, LoggerType.CONSOLE)) {
    const loggerRow = createConsoleLoggerRow(level, message, date);
    console.log(loggerRow.row, ...loggerRow.settings);
    global.sendToRenderer(ChannelName.SEND_MAIN_LOGS, loggerRow);
  }
};

const log = (level: LoggerLevel, logObj: Error | string) => {
  const date = new Date().toISOString();
  const message = logObj instanceof Error ? logObj.message : logObj;
  logToConsole(level, message, date);
  logToFile(level, message, date);
};

const debug = (logObj: Error | string) => {
  log(LoggerLevel.DEBUG, logObj);
};

const info = (logObj: Error | string) => {
  log(LoggerLevel.INFO, logObj);
};

const error = (logObj: Error | string) => {
  log(LoggerLevel.ERROR, logObj);
};

const clearLogDir = () => {
  if (isDirExisted()) {
    clearLoggerData();

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
