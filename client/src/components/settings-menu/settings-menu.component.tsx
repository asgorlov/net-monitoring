import "./settings-menu.scss";
import React, { FC, memo } from "react";
import clsx from "clsx";
import { Button, InputNumber, Select, Switch, theme } from "antd";
import { LoggerLevel, LoggerType } from "../../constants/logger.constants";
import { SettingsForm } from "../../models/settings-form.models";
import Skeleton from "../skeleton/skeleton";
import { ClearOutlined, LoadingOutlined } from "@ant-design/icons";

export interface MenuProps {
  open: boolean;
  configLoading: boolean;
  formValues: SettingsForm;
  onChangeFormValues: (values: SettingsForm) => void;
  resetPingTrigger: (value: boolean) => void;
  onClickClearLogs: () => void;
  clearLogsLoading: boolean;
}

const SettingsMenuComponent: FC<MenuProps> = ({
  open,
  configLoading,
  formValues,
  onChangeFormValues,
  resetPingTrigger,
  onClickClearLogs,
  clearLogsLoading
}) => {
  const { token } = theme.useToken();

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
    let interval = formValues.interval;
    if (timeout > interval) {
      onTimeoutChange(interval);
      return interval;
    }

    return timeout;
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
              disabled={!open || configLoading}
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
              disabled={!open || configLoading}
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
              disabled={
                !open || configLoading || formValues.level === LoggerLevel.OFF
              }
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
              disabled={!open || configLoading || !formValues.autoPing}
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
              disabled={!open || configLoading || !formValues.autoPing}
              value={getCorrectedTimeout()}
              onChange={onTimeoutChange}
              min={1}
              max={formValues.interval}
              suffix="сек."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(SettingsMenuComponent);
