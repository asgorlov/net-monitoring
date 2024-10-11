const ping = require('ping');
const logger = require('../utils/logger.util');
const configUtil = require('../utils/config.util');

/**
 * @desc Домашняя страница
 * @route GET /
 * @access Public
 */
const homePage = (req, res, next) => {
  res.render('index', { title: 'Express' });
};

/**
 * @desc Получить конфиг приложения
 * @route GET /config
 * @access Public
 */
const getConfig = (req, res) => {
  let data;
  try {
    data = configUtil.get();
  } catch (e) {
    logger.info('Can\'t get config file. It is probably missing');
  }

  if (!data) {
    try {
      data = configUtil.createDefault();
    } catch (e) {
      logger.error('Can\'t create config file. Please close all applications using the file or delete it');
    }
  }

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(500).json({ message: 'Файл настроек отсутствует. Попробуйте удалить файл настроек вручную и перезагрузить приложение'});
  }
};

const updateConfig = (req, res, isPatch) => {
  const config = req.body;
  if (!configUtil.validate(config, isPatch)) {
    res.status(400).json({
      isUpdated: false,
      message: 'Некорректные данные. Пожалуйста, убедитесь, что поля заполнены правильно'
    });
  } else {
    let data;
    try {
      data = configUtil.update(config, isPatch);
    } catch (e) {
      logger.error('Can\'t update config file. Please close all applications using the file or delete it');
    }

    if (data) {
      res.status(200).json({ isUpdated: true });
    } else {
      res.status(500).json({
        isUpdated: false,
        message: 'Не удалось сбросить настройки. Попробуйте удалить файл вручную и повторить запрос'
      });
    }
  }
}

/**
 * @desc Обновить конфиг приложения
 * @route PATCH /config
 * @access Public
 */
const changeConfig = (req, res) => {
  updateConfig(req, res, true);
};

/**
 * @desc Заменить конфиг приложения
 * @route PUT /config
 * @access Public
 */
const replaceConfig = (req, res) => {
  updateConfig(req, res);
};

/**
 * @desc Сбросить конфиг приложения до значений по умолчанию
 * @route DELETE /config
 * @access Public
 */
const clearConfig = (req, res) => {
  let data;
  try {
    data = configUtil.createDefault();
  } catch (e) {
    logger.error('Can\'t create config file. Please close all applications using the file or delete it');
  }

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(500).json({ message: 'Не удалось сбросить настройки. Попробуйте удалить файл вручную и повторить запрос'});
  }
};

/**
 * @desc Пинг списка IP-адресов
 * @route POST /ping
 * @access Public
 */
const pingHosts = async (req, res) => {
  const { hosts } = req.body;
  if (!Array.isArray(hosts)) {
    logger.error('Field hosts is not array');
    res.status(400).json({ message: 'Поле hosts не является массивом'});
  } else {
    const hostStatuses = [];
    for (const host of hosts) {
      try {
        const response = await ping.promise.probe(host, {
          timeout: global.config?.request?.timeout
        });
        hostStatuses.push({
          host,
          isAlive: response.alive
        });
      } catch (e) {
        logger.info(`Can\'t ping host = ${host}`);
        hostStatuses.push({
          host,
          isAlive: null
        });
      }
    }

    res.status(200).json({ hostStatuses });
  }
};

module.exports = {
  homePage: homePage,
  getConfig: getConfig,
  clearConfig: clearConfig,
  changeConfig: changeConfig,
  replaceConfig: replaceConfig,
  pingHosts: pingHosts
};