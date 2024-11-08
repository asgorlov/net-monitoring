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
import { HostViewModel } from "../../../models/host.models";
import { HostFieldError } from "../../../constants/form.constants";

export interface NetSchemeHostComponentProps {
  configLoading: boolean;
  isEditable: boolean;
  hostViewModel: HostViewModel;
  changeHostViewModel: (value: HostViewModel, remove?: boolean) => void;
  addChildHostViewModel: () => void;
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
      hostViewModel,
      changeHostViewModel,
      addChildHostViewModel
    },
    ref
  ) => {
    const [modal, contextHolder] = Modal.useModal();

    const isController = hostViewModel.type === HostType.PLC;

    const confirmToRemove = () => {
      const title =
        "Удалить " +
        (hostViewModel.name ? `"${hostViewModel.name}"` : "выбранный хост") +
        (hostViewModel.host ? ` с адресом "${hostViewModel.host}"` : "") +
        "?";
      const content =
        !isController && hostViewModel.childIds.length
          ? "Данное действие приведет к удалению всех дочерних подключений выбранного хоста."
          : "";

      modal.confirm({
        title,
        icon: <ExclamationCircleOutlined />,
        centered: true,
        content,
        okText: "Да",
        cancelText: "Нет",
        onOk: () => changeHostViewModel(hostViewModel, true)
      });
    };

    const onTypeChange = (type: HostType) => {
      changeHostViewModel({ ...hostViewModel, type });
    };

    const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      const errors = hostViewModel.errors.filter(
        err => err !== HostFieldError.NAME
      );
      changeHostViewModel({ ...hostViewModel, name, errors });
    };

    const onAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
      const host = e.target.value;
      const errors = hostViewModel.errors.filter(
        err => err !== HostFieldError.HOST
      );
      changeHostViewModel({ ...hostViewModel, host, errors });
    };

    const validateInput = (type: HostFieldError): "error" | undefined => {
      return hostViewModel.errors.some(err => err === type)
        ? "error"
        : undefined;
    };

    const renderStatus = (): ReactNode => {
      if (hostViewModel.pinging) {
        return <LoadingOutlined title="Пингуется" className="pinging" />;
      }

      if (hostViewModel.isAlive) {
        return <CheckCircleOutlined title="Доступен" className="pinged-ok" />;
      }

      if (hostViewModel.isAlive === null) {
        return (
          <MinusCircleOutlined title="Не пинговался" className="no-ping" />
        );
      }

      return <StopOutlined title="Не доступен" className="pinged-fail" />;
    };

    return (
      <div
        className={clsx(
          "net-scheme-host",
          `_${hostViewModel.type.toLowerCase()}`
        )}
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
                  value={hostViewModel.type}
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
                  {hostViewModel.type}
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
                  value={hostViewModel.name}
                  onChange={onNameChange}
                  size="small"
                  variant="filled"
                  title="Имя"
                  status={validateInput(HostFieldError.NAME)}
                  autoComplete="off"
                />
              ) : (
                <span className="net-scheme-host__item__text">
                  {hostViewModel.name}
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
                  value={hostViewModel.host}
                  onChange={onAddressChange}
                  size="small"
                  variant="filled"
                  title="Адрес"
                  status={validateInput(HostFieldError.HOST)}
                  autoComplete="off"
                />
              ) : (
                <span className="net-scheme-host__item__text">
                  {hostViewModel.host}
                </span>
              )}
            </>
          )}
        </div>
        <div className="net-scheme-host__footer">
          {isEditable ? (
            <div className="net-scheme-host__footer__btns">
              <Button
                title="Добавить дочернее подключение"
                disabled={isController}
                onClick={addChildHostViewModel}
              >
                <PlusOutlined />
              </Button>
              <Button
                title="Удалить текущее подключение"
                onClick={confirmToRemove}
              >
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
