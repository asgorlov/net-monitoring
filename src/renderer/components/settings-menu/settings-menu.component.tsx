import "./settings-menu.scss";
import React, { FC } from "react";
import clsx from "clsx";
import { UploadChangeParam } from "antd/es/upload/interface";
import { Button, InputNumber, Select, Switch, theme, Upload } from "antd";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import {
  ClearOutlined,
  DownloadOutlined,
  FolderOpenOutlined,
  LoadingOutlined,
  RollbackOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  LoggerLevel,
  LoggerType,
} from "../../../shared/constants/logger.constants";
import { SettingsFormData } from "../../models/settings.models";
import Skeleton from "../skeleton/skeleton";
import { CONFIG_FILE_TYPE } from "../../../shared/constants/config.constants";

export interface MenuProps {
  open: boolean;
  configLoading?: boolean;
  formValues: SettingsFormData;
  onChangeFormValues: (values: SettingsFormData) => void;
  resetPingTrigger: (value: boolean) => void;
  onClickOpenLogsFolder: () => void;
  onClickClearLogs: () => void;
  validateUploading: (option: RcCustomRequestOptions) => void;
  importConfig: (info: UploadChangeParam) => void;
  exportConfig: () => void;
  resetConfig: () => void;
  clearLogsLoading: boolean;
}

const SettingsMenuComponent: FC<MenuProps> = ({
  open,
  configLoading,
  formValues,
  onChangeFormValues,
  resetPingTrigger,
  onClickOpenLogsFolder,
  onClickClearLogs,
  validateUploading,
  importConfig,
  exportConfig,
  resetConfig,
  clearLogsLoading,
}) => {
  const { token } = theme.useToken();

  const disableActions = !open || configLoading;

  const onLevelChange = (level: LoggerLevel) => {
    onChangeFormValues({ ...formValues, level });
  };

  const onTypeChange = (type: LoggerType) => {
    onChangeFormValues({ ...formValues, type });
  };

  const onNumberOfLogFilesChange = (numberOfLogFiles: number | null) => {
    if (numberOfLogFiles !== null) {
      onChangeFormValues({ ...formValues, numberOfLogFiles });
    }
  };

  const onLogFileSizeChange = (logFileSize: number | null) => {
    if (logFileSize !== null) {
      onChangeFormValues({ ...formValues, logFileSize });
    }
  };

  const onTimeoutChange = (timeout: number | null) => {
    if (timeout !== null) {
      onChangeFormValues({ ...formValues, timeout });
    }
  };

  const getCorrectedTimeout = () => {
    const timeout = formValues.timeout;

    if (formValues.autoPing) {
      const interval = formValues.interval;
      if (timeout > interval) {
        onTimeoutChange(interval);
        return interval;
      }
    }

    return timeout;
  };

  const getMaxTimeout = (): number | undefined => {
    return formValues.autoPing ? formValues.interval : undefined;
  };

  const onIntervalChange = (interval: number | null) => {
    if (interval !== null) {
      onChangeFormValues({ ...formValues, interval });
    }
  };

  const onAutoPingChange = (autoPing: boolean) => {
    onChangeFormValues({ ...formValues, autoPing });
    resetPingTrigger(autoPing);
  };

  return (
    <div
      className={clsx("settings-menu", { _opened: open })}
      style={{
        background: token.colorBgLayout,
        borderColor: token.colorBorder,
      }}
    >
      <div className="settings-menu__row">
        <h6 style={{ borderColor: token.colorBorder }}>Общие</h6>
        <div className="settings-menu__row__item">
          <label>Конфигурация:</label>
          <div className="settings-menu__row__item__config-btn-group">
            <Upload
              id="import-config"
              customRequest={validateUploading}
              onChange={importConfig}
              itemRender={() => null}
              disabled={disableActions}
              accept={CONFIG_FILE_TYPE}
            >
              <Button
                title="Импорт файла конфигурации"
                disabled={disableActions}
                className="settings-menu__row__item__config-btn"
              >
                <UploadOutlined />
                <span>Импорт</span>
              </Button>
            </Upload>
            <Button
              title="Экспорт файла конфигурации"
              onClick={exportConfig}
              disabled={disableActions}
              className="settings-menu__row__item__config-btn"
            >
              <DownloadOutlined />
              <span>Экспорт</span>
            </Button>
            <Button
              title="Сброс настроек по умолчанию"
              onClick={resetConfig}
              disabled={disableActions}
              className="settings-menu__row__item__config-btn"
            >
              <RollbackOutlined />
              <span>Сброс</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="settings-menu__row">
        <h6 style={{ borderColor: token.colorBorder }}>Логирование</h6>
        <div className="settings-menu__row__item">
          <label htmlFor="level">Уровень:</label>
          {configLoading ? (
            <Skeleton className="settings-menu__row__item__skeleton-select" />
          ) : (
            <Select
              title="Уровень логирования"
              id="level"
              disabled={disableActions}
              value={formValues.level}
              onChange={onLevelChange}
              options={[
                {
                  value: LoggerLevel.DEBUG,
                  label: `[${LoggerLevel.DEBUG}] - Всё включено`,
                },
                {
                  value: LoggerLevel.INFO,
                  label: `[${LoggerLevel.INFO}] - Важная информация и ошибки`,
                },
                {
                  value: LoggerLevel.ERROR,
                  label: `[${LoggerLevel.ERROR}] - Только ошибки`,
                },
                {
                  value: LoggerLevel.OFF,
                  label: `[${LoggerLevel.OFF}] - Отключено`,
                },
              ]}
            />
          )}
        </div>
        <div className="settings-menu__row__item">
          <label htmlFor="type">Запись в:</label>
          {configLoading ? (
            <Skeleton className="settings-menu__row__item__skeleton-select" />
          ) : (
            <Select
              title="Место вывода логов"
              id="type"
              disabled={disableActions || formValues.level === LoggerLevel.OFF}
              value={formValues.type}
              onChange={onTypeChange}
              options={[
                { value: LoggerType.CONSOLE, label: "Консоль" },
                { value: LoggerType.FILE, label: "Файл" },
                { value: LoggerType.BOTH, label: "Файл и консоль" },
              ]}
            />
          )}
        </div>
        <div className="settings-menu__row__item">
          <label htmlFor="numberOfLogFiles">
            Максимальное количество файлов:
          </label>
          {configLoading ? (
            <Skeleton className="settings-menu__row__item__skeleton-input-number" />
          ) : (
            <InputNumber
              title="Максимальное количество файлов c логами"
              id="numberOfLogFiles"
              disabled={
                !open ||
                configLoading ||
                formValues.type === LoggerType.CONSOLE ||
                formValues.level === LoggerLevel.OFF
              }
              value={formValues.numberOfLogFiles}
              onChange={onNumberOfLogFilesChange}
              min={0}
            />
          )}
        </div>
        <div className="settings-menu__row__item">
          <label htmlFor="logFileSize">Максимальный размер файла:</label>
          {configLoading ? (
            <Skeleton className="settings-menu__row__item__skeleton-input-number" />
          ) : (
            <InputNumber
              title="Максимальный размер файлов c логами"
              id="logFileSize"
              disabled={
                !open ||
                configLoading ||
                formValues.type === LoggerType.CONSOLE ||
                formValues.level === LoggerLevel.OFF
              }
              value={formValues.logFileSize}
              onChange={onLogFileSizeChange}
              min={0}
              suffix="Мб"
            />
          )}
        </div>
        <div className="settings-menu__row__item">
          <label htmlFor="logFileSize">Папка логирования:</label>
          <div className="settings-menu__row__item__config-btn-group">
            <Button
              title="Открыть папку с логами"
              className="settings-menu__row__item__logs-folder-btn"
              onClick={onClickOpenLogsFolder}
              disabled={!open}
            >
              <FolderOpenOutlined />
              Открыть
            </Button>
            <Button
              title="Очистить папку с логами"
              className="settings-menu__row__item__logs-folder-btn"
              onClick={onClickClearLogs}
              disabled={!open || clearLogsLoading}
            >
              {clearLogsLoading ? <LoadingOutlined /> : <ClearOutlined />}
              Очистить
            </Button>
          </div>
        </div>
      </div>
      <div className="settings-menu__row">
        <h6 style={{ borderColor: token.colorBorder }}>Пинг-запросы</h6>
        <div className="settings-menu__row__item">
          <label htmlFor="autoPing">Автопинг-запросы:</label>
          {configLoading ? (
            <Skeleton className="settings-menu__row__item__skeleton-switch" />
          ) : (
            <Switch
              title="Ручной или автоматический пинг"
              id="autoPing"
              checked={formValues.autoPing}
              onChange={onAutoPingChange}
              className="settings-menu__row__item__auto-ping"
            />
          )}
        </div>
        <div className="settings-menu__row__item">
          <label htmlFor="interval">Период между запросами:</label>
          {configLoading ? (
            <Skeleton className="settings-menu__row__item__skeleton-input-number" />
          ) : (
            <InputNumber
              title="Период между автоматическими пинг-запросами"
              id="interval"
              disabled={disableActions || !formValues.autoPing}
              value={formValues.interval}
              onChange={onIntervalChange}
              min={1}
              suffix="сек."
            />
          )}
        </div>
        <div className="settings-menu__row__item">
          <label htmlFor="timeout">Таймаут:</label>
          {configLoading ? (
            <Skeleton className="settings-menu__row__item__skeleton-input-number" />
          ) : (
            <InputNumber
              title="Время ожидания ответа на пинг-запрос"
              id="timeout"
              disabled={disableActions}
              value={getCorrectedTimeout()}
              onChange={onTimeoutChange}
              min={1}
              max={getMaxTimeout()}
              suffix="сек."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsMenuComponent;
