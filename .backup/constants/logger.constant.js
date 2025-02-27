const path = require('path')

const pathToLogDir = path.join(process.cwd(), '/logs');

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
  loggerLevels: loggerLevels,
  loggerTypes: loggerTypes
};
