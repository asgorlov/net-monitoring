import fs, { Dirent } from "fs";
import path from "path";
import Path from "../constants/path.constants";
import {
  LoggerLevel,
  LoggerType,
} from "../../shared/constants/logger.constants";
import { defaultConfig } from "../../shared/constants/config.constants";
import { ConfigLogger } from "../../shared/models/config.models";
import LoggerHelper from "../../shared/helpers/logger.helper";

let logFileStream = null;

const getSettings = (): ConfigLogger => {
  return global.config?.logger || defaultConfig.logger;
};

const show = (level: LoggerLevel, type: LoggerType): boolean => {
  const settings = getSettings();
  if (settings.type !== LoggerType.BOTH && settings.type !== type) {
    return false;
  }

  return LoggerHelper.isLogWritable(level, settings.level);
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

const logToFile = (level: LoggerLevel, message: string) => {
  if (show(level, LoggerType.FILE)) {
    const row = `[${level}] - ${new Date().toISOString()} - ${message}\n`;

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

const logToConsole = (level: LoggerLevel, message: string) => {
  if (show(level, LoggerType.CONSOLE)) {
    const { row, settings } = LoggerHelper.createConsoleRow(level, message);
    console.log(row, ...settings);
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
