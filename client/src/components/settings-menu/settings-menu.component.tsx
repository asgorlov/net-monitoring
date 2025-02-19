import "./settings-menu.scss";
import React, { FC, memo } from "react";
import clsx from "clsx";
import { UploadChangeParam } from "antd/es/upload/interface";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { Button, InputNumber, Select, Switch, theme, Upload } from "antd";
import { LoggerLevel, LoggerType } from "../../constants/logger.constants";
import { SettingsForm } from "../../models/settings-form.models";
import Skeleton from "../skeleton/skeleton";
import {
  ClearOutlined,
  DownloadOutlined,
  LoadingOutlined,
  RollbackOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { CONFIG_FILE_TYPE } from "../../constants/common.constants";

export interface MenuProps {
  open: boolean;
  configLoading: boolean;
  formValues: SettingsForm;
  onChangeFormValues: (values: SettingsForm) => void;
  resetPingTrigger: (value: boolean) => void;
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
  onClickClearLogs,
  validateUploading,
  importConfig,
  exportConfig,
  resetConfig,
  clearLogsLoading
}) => {
  const { token } = theme.useToken();

  const disableActions = !open || configLoading;

  const onPortChange = (port: number | null) => {
    if (port !== null) {
      onChangeFormValues({ ...formValues, port });
    }
  };

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
    let timeout = formValues.timeout;

    if (formValues.autoPing) {
      let interval = formValues.interval;
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
        borderColor: token.colorBorder
      }}
    >
      <div
        className="settings-menu__row"
        style={{ borderColor: token.colorBorder }}
      >
        <h6 style={{ borderColor: token.colorBorder }}>Общие</h6>
        <div className="settings-menu__row__item">
          <label htmlFor="port">Порт:</label>
          {configLoading ? (
            <Skeleton className="settings-menu__row__item__skeleton-input-number" />
          ) : (
            <InputNumber
              id="port"
              disabled={disableActions}
              value={formValues.port}
              onChange={onPortChange}
              min={0}
              max={65535}
            />
          )}
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
              id="level"
              disabled={disableActions}
              value={formValues.level}
              onChange={onLevelChange}
              options={[
                { value: LoggerLevel.DEBUG, label: LoggerLevel.DEBUG },
                { value: LoggerLevel.INFO, label: LoggerLevel.INFO },
                { value: LoggerLevel.ERROR, label: LoggerLevel.ERROR },
                { value: LoggerLevel.OFF, label: LoggerLevel.OFF }
              ]}
            />
          )}
        </div>
        <div className="settings-menu__row__item">
          <label htmlFor="type">Тип:</label>
          {configLoading ? (
            <Skeleton className="settings-menu__row__item__skeleton-select" />
          ) : (
            <Select
              id="type"
              disabled={disableActions || formValues.level === LoggerLevel.OFF}
              value={formValues.type}
              onChange={onTypeChange}
              options={[
                { value: LoggerType.CONSOLE, label: LoggerType.CONSOLE },
                { value: LoggerType.FILE, label: LoggerType.FILE },
                { value: LoggerType.BOTH, label: LoggerType.BOTH }
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
          <label htmlFor="logFileSize">
            Очистить папку с файлами логирования:
          </label>
          <Button
            className="settings-menu__row__item__clear-logs-btn"
            onClick={onClickClearLogs}
            disabled={!open || clearLogsLoading}
          >
            {clearLogsLoading ? <LoadingOutlined /> : <ClearOutlined />}
            Очистить
          </Button>
        </div>
      </div>
      <div className="settings-menu__row">
        <h6 style={{ borderColor: token.colorBorder }}>Запросы</h6>
        <div className="settings-menu__row__item">
          <label htmlFor="autoPing">Периодическая автоотправка запросов:</label>
          {configLoading ? (
            <Skeleton className="settings-menu__row__item__skeleton-switch" />
          ) : (
            <Switch
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
      <div className="settings-menu__row">
        <h6 style={{ borderColor: token.colorBorder }}>Настройки</h6>
        <div className="settings-menu__row__item">
          <label htmlFor="import-config">Импорт файла настроек:</label>
          <Upload
            id="import-config"
            customRequest={validateUploading}
            onChange={importConfig}
            itemRender={() => null}
            disabled={disableActions}
            accept={CONFIG_FILE_TYPE}
          >
            <Button
              disabled={disableActions}
              className="settings-menu__row__item__cofig-btn"
            >
              <UploadOutlined />
              <span>Импорт</span>
            </Button>
          </Upload>
        </div>
        <div className="settings-menu__row__item">
          <label>Экспорт файла настроек:</label>
          <Button
            onClick={exportConfig}
            disabled={disableActions}
            className="settings-menu__row__item__cofig-btn"
          >
            <DownloadOutlined />
            <span>Экспорт</span>
          </Button>
        </div>
        <div className="settings-menu__row__item">
          <label>Сброс настроек по умолчанию:</label>
          <Button
            onClick={resetConfig}
            disabled={disableActions}
            className="settings-menu__row__item__cofig-btn"
          >
            <RollbackOutlined />
            <span>Сброс</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(SettingsMenuComponent);
