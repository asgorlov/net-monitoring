import {
  app,
  BrowserWindow,
  IpcMainInvokeEvent,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from "electron";
import Logger from "./main-logger.utils";
import PingUtils from "./ping.utils";
import ConfigUtils from "./config.utils";
import { LoggerLevel } from "../../shared/constants/logger.constants";
import {
  ActionResult,
  Config,
  GettingConfigResult,
} from "../../shared/models/config.models";
import { ConfigValidationError } from "../constants/config-validation-error.constants";
import { PingHostParams, uuid } from "../../shared/models/host.models";

const openTabExternal = async (
  _e: IpcMainInvokeEvent,
  url: string,
): Promise<void> => {
  try {
    await shell.openExternal(url);
    Logger.debug(`The '${url}' was opened in the browser`);
  } catch (e) {
    Logger.error(e);
    throw e;
  }
};

const sendRendererLogs = (
  _e: IpcMainInvokeEvent,
  level: LoggerLevel,
  logObj: Error | string,
): void => {
  switch (level) {
    case LoggerLevel.DEBUG:
      Logger.debug(logObj);
      break;
    case LoggerLevel.INFO:
      Logger.info(logObj);
      break;
    case LoggerLevel.ERROR:
      Logger.error(logObj);
  }
};

const getConfig = (): GettingConfigResult => {
  const result: GettingConfigResult = {};

  try {
    result.config = ConfigUtils.get();
    Logger.debug("Config was got");
  } catch (e) {
    Logger.info("Can't get config file. It's, probably, missing");

    try {
      result.config = ConfigUtils.createDefault();
      Logger.debug("Default config file was created");
    } catch (e) {
      Logger.error(
        "Can't create config file. Please close all applications using the file or delete it",
      );
      result.errorMessage =
        "Не удалось получить настройки. Попробуйте удалить файл вручную и повторить запрос";
    }
  }

  return result;
};

const updateConfig = (_e: IpcMainInvokeEvent, config: Config): ActionResult => {
  const result: ActionResult = {};

  try {
    ConfigUtils.update(config);
    Logger.debug("Config file was updated");
  } catch (e) {
    switch (e.message) {
      case ConfigValidationError.EmptyConfig:
        Logger.error(`Config can't be empty`);
        result.errorMessage =
          "Некорректные данные. Отсутствуют данные конфигурации";
        break;
      case ConfigValidationError.InvalidLoggerConfig:
        Logger.error(`Incorrect config field \'logger\' = ${config.logger}`);
        result.errorMessage =
          "Некорректные данные. Отсутствует конфигурация логирования";
        break;
      case ConfigValidationError.InvalidLoggerLevel:
        Logger.error(
          `Incorrect config field \'logger.level\' = ${config.logger.level}`,
        );
        result.errorMessage =
          "Некорректные данные. Неверно указан уровень логирования";
        break;
      case ConfigValidationError.InvalidLoggerType:
        Logger.error(
          `Incorrect config field \'logger.type\' = ${config.logger.type}`,
        );
        result.errorMessage =
          "Некорректные данные. Неверно указан тип логирования";
        break;
      case ConfigValidationError.InvalidNumberOfLogFiles:
        Logger.error(
          `Incorrect config field \'logger.numberOfLogFiles\' = ${config.logger.numberOfLogFiles}`,
        );
        result.errorMessage =
          "Некорректные данные. Неверно указано максимальное количество файлов логирования";
        break;
      case ConfigValidationError.InvalidRequestConfig:
        Logger.error(`Incorrect config field \'request\' = ${config.request}`);
        result.errorMessage =
          "Некорректные данные. Отсутствует конфигурация запросов на пинг";
        break;
      case ConfigValidationError.InvalidRequestInterval:
        Logger.error(
          `Incorrect config field \'request.interval\' = ${config.request.interval}`,
        );
        result.errorMessage =
          "Некорректные данные. Неверно указан интервал отправки запроса на пинг";
        break;
      case ConfigValidationError.InvalidRequestTimeout:
        Logger.error(
          `Incorrect config field \'request.timeout\' = ${config.request.timeout}`,
        );
        result.errorMessage =
          "Некорректные данные. Неверно указано время таймаута запроса на пинг";
        break;
      case ConfigValidationError.InvalidPingHosts:
        Logger.error(
          `Incorrect config field \'pingHosts\' = ${config.pingHosts}. It is not array or some host has empty id`,
        );
        result.errorMessage =
          "Некорректные данные. Неверно указан массив пингуемых хостов";
        break;
      case ConfigValidationError.ConfigUpdatingFailed:
        Logger.error(
          "Can't update config file. Please close all applications using the file or delete it",
        );
        result.errorMessage =
          "Не удалось обновить настройки. Попробуйте удалить файл вручную и повторить запрос";
        break;
    }
  }

  return result;
};

const createDefaultConfig = (): GettingConfigResult => {
  const result: GettingConfigResult = {};

  try {
    result.config = ConfigUtils.createDefault();
    Logger.debug("Default config file was created");
  } catch (e) {
    Logger.error(
      "Can't create default config file. Please close all applications using the file or delete it",
    );
    result.errorMessage =
      "Не удалось сбросить настройки. Попробуйте удалить файл вручную и повторить запрос";
  }

  return result;
};

const clearLogFiles = (): ActionResult => {
  const result: ActionResult = {};

  try {
    Logger.clearLogDir();
    Logger.debug("The log folder was cleaned");
  } catch (e) {
    Logger.error(
      "Can't clear the log folder. Please close all applications using the log files or delete log folder manually",
    );
    result.errorMessage =
      "Не удалось очистить папку с логами. Попробуйте удалить папку вручную или закрыть все приложения, использующие файлы логов, и повторить попытку";
  }

  return result;
};

const pingHost = (
  _e: IpcMainInvokeEvent,
  params: PingHostParams,
): Promise<boolean | null> => PingUtils.ping(params);

const abortPingHost = (_e: IpcMainInvokeEvent, id: uuid) => PingUtils.abort(id);

const showContextMenu = (e: IpcMainInvokeEvent) => {
  const sender = e.sender;
  const browserWindow = BrowserWindow.fromWebContents(sender);
  const zoomStep = 0.2;
  const template: MenuItemConstructorOptions[] = [
    {
      id: "0",
      label: "Обновить",
      accelerator: "F5",
      click: () => {
        sender.reload();
        Logger.debug("The window was reloaded");
      },
    },
    {
      id: "1",
      label: "Инструменты разработчика",
      accelerator: "F11",
      click: () => {
        sender.toggleDevTools();
        Logger.debug(
          `The dev tools were ${sender.isDevToolsOpened() ? "opened" : "closed"}`,
        );
      },
    },
    {
      id: "2",
      label: "Вид",
      submenu: [
        {
          id: "2.1",
          label: "Уменьшить",
          accelerator: "F2",
          click: () => {
            const zoomFactor =
              Math.round((sender.getZoomFactor() - zoomStep) * 100) / 100;
            if (zoomFactor > 0) {
              sender.setZoomFactor(zoomFactor);
              Logger.debug(
                `The window size was reduced to ${zoomFactor * 100}%`,
              );
            }
          },
        },
        {
          id: "2.2",
          label: "Увеличить",
          accelerator: "F3",
          click: () => {
            const zoomFactor = sender.getZoomFactor() + zoomStep;
            sender.setZoomFactor(zoomFactor);
            Logger.debug(
              `The window size was increased to ${zoomFactor * 100}%`,
            );
          },
        },
        {
          id: "2.3",
          label: "Фактический размер",
          accelerator: "F4",
          click: () => {
            sender.setZoomFactor(1);
            Logger.debug("The window size was changed to 100%");
          },
        },
      ],
    },
    { type: "separator" },
    {
      id: "3",
      label: "Выход",
      click: () => {
        Logger.debug("The app was closed");
        app.quit();
      },
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  menu.popup({ window: browserWindow });
};

const IpcMainHandlerUtils = {
  openTab: openTabExternal,
  sendRendererLogs: sendRendererLogs,
  getConfig: getConfig,
  updateConfig: updateConfig,
  createDefaultConfig: createDefaultConfig,
  clearLogFiles: clearLogFiles,
  pingHost: pingHost,
  abortPingHost: abortPingHost,
  showContextMenu: showContextMenu,
};

export default IpcMainHandlerUtils;
