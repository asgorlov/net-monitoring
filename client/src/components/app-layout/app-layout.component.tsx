import "./app-layout.scss";
import React, { FC, memo } from "react";
import { Button, Layout, Modal, theme } from "antd";
import SettingsMenuContainer from "../settings-menu/settings-menu.container";

import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  MenuOutlined,
  SaveOutlined
} from "@ant-design/icons";
import clsx from "clsx";
import NetSchemeContainer from "../net-scheme/net-scheme.container";

export interface AppLayoutComponentProps {
  open: boolean;
  isFormsTouched: boolean;
  saveSettings: (hasErrors?: boolean) => void;
  isInvalidSettings: () => boolean;
  toggleOpenMenu: () => void;
}

const AppLayoutComponent: FC<AppLayoutComponentProps> = ({
  open,
  isInvalidSettings,
  isFormsTouched,
  saveSettings,
  toggleOpenMenu
}) => {
  const { token } = theme.useToken();
  const [modal, contextHolder] = Modal.useModal();

  const confirmSaving = () => {
    const haveFormsErrors = isInvalidSettings();
    if (haveFormsErrors) {
      const title = "Продолжить операцию сохранения?";
      const content =
        "В данной конфигурации имеются незаполненные хосты, которые будут автоматически удалены. Вы можете отменить операцию, чтобы проверить какие поля не заполнены.";

      modal.confirm({
        title,
        icon: <ExclamationCircleOutlined />,
        centered: true,
        content,
        okText: "Продолжить",
        cancelText: "Отменить",
        onOk: () => saveSettings(true)
      });
    } else {
      saveSettings();
    }
  };

  return (
    <Layout className="app-layout">
      <Layout.Header
        style={{
          background: token.colorBgLayout,
          borderColor: token.colorBorder
        }}
        className="app-layout__header"
      >
        <div className="app-layout__header__btns-block">
          <Button size="small" onClick={toggleOpenMenu}>
            <MenuOutlined />
          </Button>
          <div
            className={clsx("app-layout__header__btns-block__settings", {
              _touched: open && isFormsTouched
            })}
          >
            <Button
              size="small"
              onClick={toggleOpenMenu}
              disabled={!open || !isFormsTouched}
            >
              <DeleteOutlined />
              Отменить
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={confirmSaving}
              disabled={!open || !isFormsTouched}
            >
              <SaveOutlined />
              Сохранить
            </Button>
            {contextHolder}
          </div>
        </div>
      </Layout.Header>
      <Layout.Content className="app-layout__content">
        <SettingsMenuContainer />
        <NetSchemeContainer />
      </Layout.Content>
      <Layout.Footer
        className="app-layout__footer"
        style={{ borderColor: token.colorBorder }}
      >
        Net Monitoring ©{new Date().getFullYear()} Created by{" "}
        <a href="https://github.com/asgorlov" target="_blank" rel="noreferrer">
          asgorlov
        </a>
      </Layout.Footer>
    </Layout>
  );
};

export default memo(AppLayoutComponent);
