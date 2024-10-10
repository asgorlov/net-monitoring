const ping = require('ping');
const configUtil = require('../utils/config.util')

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
const getConfig = async (req, res) => {
  let data = configUtil.get();
  if (!data) {
    data = await configUtil.createDefault();
  }

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(500).json({ message: 'Файл настроек отсутствует'});
  }
};

/**
 * @desc Обновить конфиг приложения
 * @route PATCH /config
 * @access Public
 */
const changeConfig = async (req, res) => {

};

/**
 * @desc Сбросить конфиг приложения до значений по умолчанию
 * @route DELETE /config
 * @access Public
 */
const clearConfig = async (req, res) => {
  const data = await configUtil.createDefault();
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(500).json({ message: 'Не удалось сбросить настройки'});
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
    res.status(400).json({ message: 'Поле hosts не является массивом'});
  } else {
    const hostStatuses = [];
    for (const host of hosts) {
      try {
        const response = await ping.promise.probe(host);
        hostStatuses.push({
          host,
          isAlive: response.alive
        });
      } catch (e) {
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
  pingHosts: pingHosts
};
