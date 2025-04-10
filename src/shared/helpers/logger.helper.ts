import { LoggerLevel } from "../constants/logger.constants";
import { ConsoleLoggerRow } from "../models/logger.models";

const getConsoleColor = (level: LoggerLevel): string => {
  let colorName: string;
  switch (level) {
    case LoggerLevel.ERROR:
      colorName = "red";
      break;
    case LoggerLevel.INFO:
      colorName = "green";
      break;
    case LoggerLevel.DEBUG:
      colorName = "yellow";
      break;
    default:
      colorName = "grey";
  }

  return `color:${colorName};`;
};

const createConsoleRow = (
  level: LoggerLevel,
  message: string,
): ConsoleLoggerRow => {
  const color = getConsoleColor(level);
  const settings = [`${color}font-weight:bold;`, color];
  const row = `%c[${level}] %c- ${new Date().toISOString()} - ${message}`;

  return { row, settings };
};

const isLogWritable = (
  level: LoggerLevel,
  settingsLevel: LoggerLevel,
): boolean => {
  switch (settingsLevel) {
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

const LoggerHelper = {
  createConsoleRow: createConsoleRow,
  isLogWritable: isLogWritable,
};

export default LoggerHelper;
