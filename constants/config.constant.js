const path = require("path");
const { loggerLevels, loggerTypes } = require("./logger.constant");

const freeze = (obj) => {
  Object.keys(obj)
    .filter((k) => typeof obj[k] === "object")
    .forEach((k) => (obj[k] = freeze(obj[k])));

  return Object.freeze(obj);
};

const configPath = path.join(process.cwd(), "/config.json");

const minEchoReply = 1; // for Win ping.exe by default
const defaultTimeoutEchoReplyInSec = 1; // for Win ping.exe by default

const defaultConfig = freeze({
  port: 8008,
  logger: {
    level: loggerLevels.DEBUG,
    type: loggerTypes.CONSOLE,
    numberOfLogFiles: 5, // if it < 0 - infinite number of files
    logFileSizeInBytes: 52428800, // 50Mb, if it < 0 - infinite size
  },
  request: {
    autoPing: true,
    interval: 30, // can't be less 1
    timeout: 29, // can't be less 1 and more interval
  },
  pingHosts: [],
});

module.exports = {
  freeze: freeze,
  configPath: configPath,
  minEchoReply: minEchoReply,
  defaultConfig: defaultConfig,
  defaultTimeoutEchoReplyInSec: defaultTimeoutEchoReplyInSec,
};
