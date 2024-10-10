const path = require('path')

const pathToLogDir = path.join(process.cwd(), '/logs');
const pathToLogFile = path.join(pathToLogDir, `/log-${Date.now()}ms.log`);

const loggerLevels = Object.freeze({
  ALL: "ALL",
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
  pathToLogFile: pathToLogFile,
  loggerLevels: loggerLevels,
  loggerTypes: loggerTypes
};
