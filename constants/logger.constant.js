const path = require('path')

const pathToLogDir = path.join(process.cwd(), '/logs');

const numberOfLogFiles = 5;
const logFileSizeInBytes = 52428800; // 50Mb

const loggerLevels = Object.freeze({
  DEBUG: "DEBUG",
  INFO: "INFO",
  ERROR: "ERROR",
  OFF: "OFF"
});

const loggerTypes = Object.freeze({
  CONSOLE: "CONSOLE",
  FILE: "FILE",
  BOTH: "BOTH"
})

module.exports = {
  pathToLogDir: pathToLogDir,
  numberOfLogFiles: numberOfLogFiles,
  logFileSizeInBytes: logFileSizeInBytes,
  loggerLevels: loggerLevels,
  loggerTypes: loggerTypes
};
