const path = require('path');
const { loggerLevels, loggerTypes } = require('./logger.constant')

const freeze = (obj) => {
  Object.keys(obj)
    .filter(k => typeof obj[k] === 'object')
    .forEach(k => obj[k] = freeze(obj[k]));

  return Object.freeze(obj);
};

const configPath = path.join(process.cwd(), '/config.json');

const defaultConfig = freeze({
  port: 8008,
  logger: {
    level: loggerLevels.DEBUG,
    type: loggerTypes.CONSOLE
  },
  request: {
    interval: 30000,
    timeout: 29000
  },
  pingHosts: []
});

module.exports = {
  freeze: freeze,
  configPath: configPath,
  defaultConfig: defaultConfig
}
