const fs = require("fs");
const {
  configPath,
  defaultConfig,
  freeze,
} = require("../constants/config.constant");
const logger = require("./logger.util");
const { loggerLevels, loggerTypes } = require("../constants/logger.constant");

const init = () => {
  try {
    global.config = get();
  } catch (e) {
    logger.info("Config file is missing. Creating the config file");
    try {
      global.config = createDefault();
    } catch (e) {
      logger.error(
        "Can't create config file. Please close all applications using the file or delete it"
      );
      process.exit(1);
    }
  }
};

const get = () => {
  return require(configPath);
};

const update = (config) => {
  fs.writeFileSync(configPath, JSON.stringify(config));
  return freeze(config);
};

const createDefault = () => {
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig));
  return defaultConfig;
};

const validate = (config) => {
  if (!config) {
    logger.error(`Config can't be empty`);
    return false;
  }

  const isPortValid = isFinite(config.port);
  if (!isPortValid) {
    logger.error(`Incorrect config field \'port\' = ${config.port}`);
    return false;
  }

  if (config.logger) {
    const isLevelValid = Object.values(loggerLevels).includes(
      config.logger.level
    );
    if (!isLevelValid) {
      logger.error(
        `Incorrect config field \'logger.level\' = ${config.logger.level}`
      );
      return false;
    }

    const isTypeValid = Object.values(loggerTypes).includes(config.logger.type);
    if (!isTypeValid) {
      logger.error(
        `Incorrect config field \'logger.type\' = ${config.logger.type}`
      );
      return false;
    }

    const isNumberOfLogFilesValid = isFinite(config.logger.numberOfLogFiles);
    if (!isNumberOfLogFilesValid) {
      logger.error(
        `Incorrect config field \'logger.numberOfLogFiles\' = ${config.logger.numberOfLogFiles}`
      );
      return false;
    }
  } else {
    logger.error(`Incorrect config field \'logger\' = ${config.logger}`);
    return false;
  }

  if (config.request) {
    const isIntervalValid = isFinite(config.request.interval);
    if (!isIntervalValid) {
      logger.error(
        `Incorrect config field \'request.interval\' = ${config.request.interval}`
      );
      return false;
    }

    const isTimeoutValid = isFinite(config.request.timeout);
    if (!isTimeoutValid) {
      logger.error(
        `Incorrect config field \'request.timeout\' = ${config.request.timeout}`
      );
      return false;
    }
  } else {
    logger.error(`Incorrect config field \'request\' = ${config.request}`);
    return false;
  }

  const isPingHostsValid =
    Array.isArray(config.pingHosts) && config.pingHosts.every((h) => h.id);
  if (!isPingHostsValid) {
    logger.error(
      `Incorrect config field \'pingHosts\' = ${config.pingHosts}. It is not array or some host has empty id`
    );
    return false;
  }

  return true;
};

module.exports = {
  init: init,
  get: get,
  update: update,
  createDefault: createDefault,
  validate: validate,
};
