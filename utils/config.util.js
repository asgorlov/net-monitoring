const fs = require('fs');
const { configPath, defaultConfig, freeze } = require('../constants/config.constant')
const logger = require('./logger.util')
const { loggerLevels, loggerTypes } = require('../constants/logger.constant')

const init = () => {
  try {
    global.config = get();
  } catch (e) {
    logger.info('Config file is missing. Creating the config file')
    try {
      global.config = createDefault();
    } catch (e) {
      logger.error('Can\'t create config file. Please close all applications using the file or delete it');
      process.exit(1);
    }
  }
};

const get = () => {
  return require(configPath);
};

const patchConfig = (source, target) => {
  Object.keys(source)
    .filter(k => target.hasOwnProperty(k))
    .forEach(k => {
      const sourceValue = source[k];
      if (typeof sourceValue === 'object') {
        patchConfig(sourceValue, target[k]);
      } else {
        target[k] = sourceValue;
      }
    });
};

const update = (configData, isPatch) => {
  let config = configData;

  if (isPatch) {
    config = {...get()};
    patchConfig(configData, config);
  }

  fs.writeFileSync(configPath, JSON.stringify(config));

  return freeze(config);
};

const createDefault = () => {
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig));
  return defaultConfig;
};

const validate = (config, isPatch) => {
  if (!config) {
    logger.error(`Config can't be empty`);
    return false;
  }

  const isPortValid = isFinite(config.port) || (isPatch && config.port === undefined);
  if (!isPortValid) {
    logger.error(`Incorrect config field \'port\' = ${config.port}`);
    return false;
  }

  const isLevelValid = Object.values(loggerLevels).includes(config.logger?.level) || (isPatch && config.logger?.level === undefined);
  if (!isLevelValid) {
    logger.error(`Incorrect config field \'logger.level\' = ${config.logger?.level}`);
    return false;
  }

  const isTypeValid = Object.values(loggerTypes).includes(config.logger?.type) || (isPatch && config.logger?.type === undefined);
  if (!isTypeValid) {
    logger.error(`Incorrect config field \'logger.type\' = ${config.logger?.type}`);
    return false;
  }

  const isIntervalValid = isFinite(config.request?.interval) || (isPatch && config.request?.interval === undefined);
  if (!isIntervalValid) {
    logger.error(`Incorrect config field \'request.interval\' = ${config.request?.interval}`);
    return false;
  }

  const isTimeoutValid = isFinite(config.request?.timeout) || (isPatch && config.request?.timeout === undefined);
  if (!isTimeoutValid) {
    logger.error(`Incorrect config field \'request.timeout\' = ${config.request?.timeout}`);
    return false;
  }

  const isPingHostsValid = Array.isArray(config.pingHosts) || (isPatch && config.pingHosts === undefined);
  if (!isPingHostsValid) {
    logger.error(`Incorrect config field \'pingHosts\' = ${config.pingHosts}`);
    return false;
  }

  return true;
};

module.exports = {
  init: init,
  get: get,
  update: update,
  createDefault: createDefault,
  validate: validate
};
