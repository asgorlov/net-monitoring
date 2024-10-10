const fs = require('fs');
const { configPath, defaultConfig, freeze } = require('../constants/config.constant')
const logger = require('./logger.util')

const get = () => {
  const config = require(configPath);
  return freeze(config);
};

const update = async (configData) => {
  const config = require(configPath);
  // toDo разработать парсер для пут запроса + парсер для расшифровки на клиенте
};

const createDefault = () => {
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig));
  return defaultConfig;
};

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
}

module.exports = {
  init: init,
  get: get,
  update: update,
  createDefault: createDefault
};
