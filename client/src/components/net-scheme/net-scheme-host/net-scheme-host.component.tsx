import "./net-scheme-host.scss";
import React, { ChangeEvent, forwardRef, memo, ReactNode } from "react";
import { Button, Input, Modal, Select } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  StopOutlined
} from "@ant-design/icons";
import { DefaultOptionType } from "rc-select/lib/Select";
import clsx from "clsx";
import Skeleton from "../../skeleton/skeleton";
import { HostType } from "../../../constants/common.constants";
import { PingHost } from "../../../models/host.models";

export interface NetSchemeHostComponentProps {
  configLoading: boolean;
  isEditable: boolean;
  pinging: boolean;
  isAlive: boolean | null;
  formValue: PingHost;
  onFormValueChange: (value: PingHost) => void;
  onAddHost: () => void;
  onRemoveHost: () => void;
}

const typeOptions: DefaultOptionType[] = Object.values(HostType).map(v => ({
  value: v,
  label: v
}));

const NetSchemeHostComponent = forwardRef<
  HTMLDivElement,
  NetSchemeHostComponentProps
>(
  (
    {
      configLoading,
      isEditable,
      pinging,
      isAlive,
      formValue,
      onFormValueChange,
      onAddHost,
      onRemoveHost
    },
    ref
  ) => {
    const [modal, contextHolder] = Modal.useModal();

    const isController = formValue.type === HostType.PLC;

    const confirm = () => {
      const title =
        "Удалить " +
        (formValue.name ? `\"${formValue.name}\"` : "выбранный хост") +
        (formValue.host ? ` с адресом \"${formValue.host}\"` : "") +
        "?";
      const content =
        !isController && formValue.children.length
          ? "Данное действие приведет к удалению всех дочерних подключений выбранного хоста."
          : "";

      modal.confirm({
        title,
        icon: <ExclamationCircleOutlined />,
        centered: true,
        content,
        okText: "Да",
        cancelText: "Нет",
        onOk: onRemoveHost
      });
    };

    const onTypeChange = (type: HostType) => {
      onFormValueChange({ ...formValue, type });
    };

    const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
      onFormValueChange({ ...formValue, name: e.target.value });
    };

    const onAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
      onFormValueChange({ ...formValue, host: e.target.value });
    };

    const renderStatus = (): ReactNode => {
      if (pinging) {
        return <LoadingOutlined title="Пингуется" className="pinging" />;
      }

      if (isAlive) {
        return <CheckCircleOutlined title="Доступен" className="pinged-ok" />;
      }

      if (isAlive === null) {
        return (
          <MinusCircleOutlined title="Не пинговался" className="no-ping" />
        );
      }

      return <StopOutlined title="Не доступен" className="pinged-fail" />;
    };

    return (
      <div
        className={clsx("net-scheme-host", `_${formValue.type.toLowerCase()}`)}
        ref={ref}
      >
        <div className="net-scheme-host__item">
          {configLoading ? (
            <Skeleton className="net-scheme-host__item__skeleton-select" />
          ) : (
            <>
              {isEditable ? (
                <Select
                  id="type"
                  value={formValue.type}
                  onChange={onTypeChange}
                  options={typeOptions}
                  className="net-scheme-host__item__select"
                  popupClassName="net-scheme-host__item__select__popup"
                  size="small"
                  variant="filled"
                  title="Тип"
                />
              ) : (
                <span className="net-scheme-host__item__text">
                  {formValue.type}
                </span>
              )}
            </>
          )}
        </div>
        <div className="net-scheme-host__item">
          {configLoading ? (
            <Skeleton className="net-scheme-host__item__skeleton-input" />
          ) : (
            <>
              {isEditable ? (
                <Input
                  id="name"
                  value={formValue.name}
                  onChange={onNameChange}
                  size="small"
                  variant="filled"
                  title="Имя"
                />
              ) : (
                <span className="net-scheme-host__item__text">
                  {formValue.name}
                </span>
              )}
            </>
          )}
        </div>
        <div className="net-scheme-host__item">
          {configLoading ? (
            <Skeleton className="net-scheme-host__item__skeleton-input" />
          ) : (
            <>
              {isEditable ? (
                <Input
                  id="address"
                  value={formValue.host}
                  onChange={onAddressChange}
                  size="small"
                  variant="filled"
                  title="Адрес"
                />
              ) : (
                <span className="net-scheme-host__item__text">
                  {formValue.host}
                </span>
              )}
            </>
          )}
        </div>
        <div className="net-scheme-host__footer">
          {isEditable ? (
            <div className="net-scheme-host__footer__btns">
              <Button
                title="Добавить дочерний объект"
                disabled={isController}
                onClick={onAddHost}
              >
                <PlusOutlined />
              </Button>
              <Button title="Удалить текущий объект" onClick={confirm}>
                <MinusOutlined />
              </Button>
              {contextHolder}
            </div>
          ) : (
            <>{renderStatus()}</>
          )}
        </div>
      </div>
    );
  }
);

export default memo(NetSchemeHostComponent);
