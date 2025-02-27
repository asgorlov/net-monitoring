const ping = require("ping");
const logger = require("../utils/logger.util");
const configUtil = require("../utils/config.util");
const {
  minEchoReply,
  defaultTimeoutEchoReplyInSec,
} = require("../constants/config.constant");

/**
 * @desc Домашняя страница
 * @route GET /
 * @access Public
 */
const homePage = (req, res) => {
  res.render("index");
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
    logger.info(`[${req.id}] - Can't get config file. It is probably missing`);
  }

  if (!data) {
    try {
      data = configUtil.createDefault();
    } catch (e) {
      logger.error(
        `[${req.id}] - Can't create config file. Please close all applications using the file or delete it`
      );
    }
  }

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(500).json({
      message:
        "Файл настроек отсутствует. Попробуйте удалить файл настроек вручную и перезагрузить приложение",
    });
  }
};

/**
 * @desc Заменить конфиг приложения
 * @route PUT /config
 * @access Public
 */
const replaceConfig = (req, res) => {
  const config = req.body;
  if (!configUtil.validate(config)) {
    res.status(400).json({
      isUpdated: false,
      message:
        "Некорректные данные. Пожалуйста, убедитесь, что поля заполнены правильно",
    });
  } else {
    let data;
    try {
      data = configUtil.update(config);
    } catch (e) {
      logger.error(
        `[${req.id}] - Can't update config file. Please close all applications using the file or delete it`
      );
    }

    if (data) {
      res.status(200).json({ isUpdated: true });
    } else {
      res.status(500).json({
        isUpdated: false,
        message:
          "Не удалось сбросить настройки. Попробуйте удалить файл вручную и повторить запрос",
      });
    }
  }
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
    logger.error(
      `[${req.id}] - Can't create config file. Please close all applications using the file or delete it`
    );
  }

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(500).json({
      message:
        "Не удалось сбросить настройки. Попробуйте удалить файл вручную и повторить запрос",
    });
  }
};

/**
 * @desc Очистка папки с логами
 * @route DELETE /log
 * @access Public
 */
const clearLogFiles = (req, res) => {
  try {
    logger.clearLogDir();
    res.status(200).json({ isCleared: true });
  } catch (e) {
    logger.error(
      `[${req.id}] - Can't clear the log folder. Please close all applications using the log files or delete log folder manually`
    );
    res.status(500).json({
      isCleared: false,
      message:
        "Не удалось очистить папку с логами. Попробуйте удалить папку вручную или закрыть все приложения, использующие файлы логов, и повторить попытку",
    });
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
    logger.error(`[${req.id}] - Field hosts is not array`);
    res.status(400).json({ message: "Поле hosts не является массивом" });
  } else {
    const hostStatuses = [];
    for (const host of hosts) {
      try {
        const timeout = global.config?.request?.timeout
          ? global.config.request.timeout / minEchoReply
          : defaultTimeoutEchoReplyInSec;
        const response = await ping.promise.probe(host.host, {
          min_reply: minEchoReply,
          timeout,
        });
        hostStatuses.push({
          ...host,
          isAlive: response.alive,
        });
        logger.debug(
          `[${req.id}] - Ping response: ${JSON.stringify(response)}`
        );
      } catch (e) {
        logger.info(`[${req.id}] - Can\'t ping host = ${host.host}`);
        hostStatuses.push({
          ...host,
          isAlive: null,
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
  replaceConfig: replaceConfig,
  clearLogFiles: clearLogFiles,
  pingHosts: pingHosts,
};
