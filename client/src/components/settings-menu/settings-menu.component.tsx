import "./settings-menu.scss";
import React, { FC } from "react";
import clsx from "clsx";
import { Form, InputNumber, Select, theme } from "antd";
import SkeletonNode from "antd/es/skeleton/Node";
import { LoggerLevel, LoggerType } from "../../constants/logger.constants";
import settingsUtil from "../../utils/settings.util";
import { FormInstance } from "antd/es/form/hooks/useForm";
import { SettingsForm } from "../../models/common.models";

export interface MenuProps {
  open: boolean;
  form: FormInstance<SettingsForm>;
  configLoading: boolean;
  port: number;
  loggerLevel: LoggerLevel;
  loggerType: LoggerType;
  numberOfLogFiles: number;
  logFileSizeInBytes: number;
  interval: number;
  timeout: number;
}

const SettingsMenuComponent: FC<MenuProps> = ({
  open,
  form,
  configLoading,
  port,
  loggerLevel,
  loggerType,
  numberOfLogFiles,
  logFileSizeInBytes,
  interval,
  timeout
}) => {
  const { token } = theme.useToken();

  return (
    <Form
      form={form}
      name="settings"
      className={clsx("settings-menu", { _opened: open })}
      style={{
        background: token.colorBgLayout,
        borderColor: token.colorBorder
      }}
      layout="vertical"
      initialValues={{
        port: port,
        level: loggerLevel,
        type: loggerType,
        numberOfLogFiles: numberOfLogFiles,
        logFileSize: settingsUtil.convertToMb(logFileSizeInBytes),
        interval: settingsUtil.convertToSeconds(interval),
        timeout: settingsUtil.convertToSeconds(timeout)
      }}
      disabled={!open || configLoading}
    >
      <div
        className="settings-menu__row"
        style={{ borderColor: token.colorBorder }}
      >
        <Form.Item
          label="Порт"
          name="port"
          className="settings-menu__row__item"
        >
          {configLoading ? (
            <SkeletonNode
              className={`settings-menu__row__item__skeleton-input-number`}
              children={<div />}
              active
            />
          ) : (
            <InputNumber min={0} max={65535} />
          )}
        </Form.Item>
      </div>
      <div className="settings-menu__row">
        <h6 style={{ borderColor: token.colorBorder }}>Логирование</h6>
        <Form.Item
          label="Уровень"
          name="level"
          className="settings-menu__row__item"
        >
          {configLoading ? (
            <SkeletonNode
              className={`settings-menu__row__item__skeleton-select`}
              children={<div />}
              active
            />
          ) : (
            <Select
              options={[
                { value: LoggerLevel.DEBUG, label: LoggerLevel.DEBUG },
                { value: LoggerLevel.INFO, label: LoggerLevel.INFO },
                { value: LoggerLevel.ERROR, label: LoggerLevel.ERROR },
                { value: LoggerLevel.OFF, label: LoggerLevel.OFF }
              ]}
            />
          )}
        </Form.Item>
        <Form.Item label="Тип" name="type" className="settings-menu__row__item">
          {configLoading ? (
            <SkeletonNode
              className={`settings-menu__row__item__skeleton-select`}
              children={<div />}
              active
            />
          ) : (
            <Select
              options={[
                { value: LoggerType.CONSOLE, label: LoggerType.CONSOLE },
                { value: LoggerType.FILE, label: LoggerType.FILE },
                { value: LoggerType.BOTH, label: LoggerType.BOTH }
              ]}
            />
          )}
        </Form.Item>
        <Form.Item
          label="Максимальное количество файлов"
          name="numberOfLogFiles"
          className="settings-menu__row__item"
        >
          {configLoading ? (
            <SkeletonNode
              className={`settings-menu__row__item__skeleton-input-number`}
              children={<div />}
              active
            />
          ) : (
            <InputNumber min={0} />
          )}
        </Form.Item>
        <Form.Item
          label="Максимальный размер файла"
          name="logFileSize"
          className="settings-menu__row__item"
        >
          {configLoading ? (
            <SkeletonNode
              className={`settings-menu__row__item__skeleton-input-number`}
              children={<div />}
              active
            />
          ) : (
            <InputNumber min={0} suffix="Мб" />
          )}
        </Form.Item>
      </div>
      <div className="settings-menu__row">
        <h6 style={{ borderColor: token.colorBorder }}>Запросы</h6>
        <Form.Item
          label="Период между запросами"
          name="interval"
          className="settings-menu__row__item"
        >
          {configLoading ? (
            <SkeletonNode
              className={`settings-menu__row__item__skeleton-input-number`}
              children={<div />}
              active
            />
          ) : (
            <InputNumber min={1} suffix="сек." />
          )}
        </Form.Item>
        <Form.Item
          label="Таймаут"
          name="timeout"
          className="settings-menu__row__item"
        >
          {configLoading ? (
            <SkeletonNode
              className={`settings-menu__row__item__skeleton-input-number`}
              children={<div />}
              active
            />
          ) : (
            <InputNumber min={1} suffix="сек." />
          )}
        </Form.Item>
      </div>
    </Form>
  );
};

export default SettingsMenuComponent;
