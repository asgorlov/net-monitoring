const chalk = require('chalk');
const fs = require('fs');
const { loggerLevels, pathToLogDir, loggerTypes } = require('../constants/logger.constant');
const { defaultConfig } = require('../constants/config.constant')
const path = require('path')

let logFileStream = null;

const getSettings = () => {
  return global.config?.logger || defaultConfig.logger;
};

const show = (level, type) => {
  const settings = getSettings();
  if (settings.type !== loggerTypes.BOTH && settings.type !== type) {
    return false;
  }

  switch (settings.level) {
    case loggerLevels.DEBUG:
      return level === settings.level || level === loggerLevels.INFO || level === loggerLevels.ERROR;
    case loggerLevels.INFO:
      return level === settings.level || level === loggerLevels.ERROR;
    case loggerLevels.ERROR:
      return level === settings.level;
    default:
      return false;
  }
};

const isDirExisted = () => {
  try {
    fs.mkdirSync(pathToLogDir, { recursive: true });
    return true;
  } catch (e) {
    logToConsole(loggerLevels.ERROR, e);
    return false;
  }
};

const removeFile = (file) => {
  try {
    fs.unlinkSync(pathToLogDir + `/${file.name}`);
  } catch (e) {
    logToConsole(loggerLevels.ERROR, e);
  }
}

const createFile = (row) => {
  try {
    const files = fs.readdirSync(pathToLogDir, { withFileTypes: true })
      .filter(d => !d.isDirectory());
    const numberOfLogFiles = getSettings().numberOfLogFiles;
    if (numberOfLogFiles > 0 && files.length >= numberOfLogFiles) {
      files
        .slice(0, (files.length - 4))
        .forEach(removeFile);
    }

    const pathToLogFile = path.join(pathToLogDir, `/log-${Date.now()}.log`);
    logFileStream = fs.createWriteStream(pathToLogFile, { flags: 'a' });
    logFileStream.write(row);
  } catch (e) {
    logToConsole(loggerLevels.ERROR, e);
    logFileStream?.end();
    logFileStream = null;
  }
};

const recordRowToFile = (row) => {
  try {
    logFileStream.write(row);
  } catch (e) {
    logToConsole(loggerLevels.ERROR, e);
    logFileStream?.end();
    logFileStream = null;
  }
};

const logToFile = (level, message) => {
  if (show(level, loggerTypes.FILE)) {
    const row = `[${level}] - ${new Date().toISOString()} - ${message}\n`;

    if (logFileStream) {
      const logFileSizeInBytes = getSettings().logFileSizeInBytes;
      if (logFileSizeInBytes > 0 && logFileStream.bytesWritten >= logFileSizeInBytes) {
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

const getConsoleColor = (level) => {
  switch (level) {
    case loggerLevels.ERROR:
      return chalk.red;
    case loggerLevels.INFO:
      return chalk.green;
    case loggerLevels.DEBUG:
      return chalk.yellow;
    default:
      return chalk.grey;
  }
};

const logToConsole = (level, message) => {
  if (show(level, loggerTypes.CONSOLE)) {
    const color = getConsoleColor(level);
    const stdout = color(chalk.bold(`[${level}]`) + ` - ${new Date().toISOString()}`) + ' - ' + message;
    console.log(stdout);
  }
};

const debug = (message) => {
  logToConsole(loggerLevels.DEBUG, message);
  logToFile(loggerLevels.DEBUG, message);
};

const info = (message) => {
  logToConsole(loggerLevels.INFO, message);
  logToFile(loggerLevels.INFO, message);
};

const error = (message) => {
  logToConsole(loggerLevels.ERROR, message);
  logToFile(loggerLevels.ERROR, message);
}

const getUrl = (req) => {
  return `${req.protocol}://${req.headers.host}${req.url}`
};

const getMethodColor = (method) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return chalk.hex('#006400');
    case 'PUT':
      return chalk.hex('#1E90FF');
    case 'POST':
      return chalk.hex('#FF7F50');
    case 'PATCH':
      return chalk.hex('#483D8B');
    case 'DELETE':
      return chalk.hex('#8B0000');
    default:
      return chalk.grey;
  }
};

const getStringifiedBody = (req) => {
  if (req.method.toUpperCase() !== 'GET') {
    const body = req.body || {};
    return `body: ${JSON.stringify(body)}`;
  }

  return '';
};

const apiMiddleware = (req, res, next) => {
  const level = getSettings().level;
  if (level === loggerLevels.DEBUG) {
    const url = getUrl(req);
    const method = req.method;
    const color = getMethodColor(method);
    const body = getStringifiedBody(req);
    logToConsole(loggerLevels.DEBUG, color(method) + ' ' + url + ' ' + body);
    logToFile(loggerLevels.DEBUG, method + ' ' + url + ' ' + body);
  } else if (level === loggerLevels.INFO) {
    const url = getUrl(req);
    const method = req.method;
    const color = getMethodColor(method);
    logToConsole(loggerLevels.INFO, url + ' ' + color(method));
    logToFile(loggerLevels.INFO, url + ' ' + method);
  }

  next();
};

const clearLogDir = () => {
  if (isDirExisted()) {
    fs.readdirSync(pathToLogDir).forEach(f => fs.unlinkSync(path.join(pathToLogDir, f)));
  }
};

module.exports = {
  debug: debug,
  info: info,
  error: error,
  apiMiddleware: apiMiddleware,
  clearLogDir: clearLogDir
};
