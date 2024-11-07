import "./app-layout.scss";
import React, { FC, memo } from "react";
import { Button, Layout, theme } from "antd";
import SettingsMenuContainer from "../settings-menu/settings-menu.container";

import { DeleteOutlined, MenuOutlined, SaveOutlined } from "@ant-design/icons";
import clsx from "clsx";
import NetSchemeContainer from "../net-scheme/net-scheme.container";

export interface AppLayoutComponentProps {
  open: boolean;
  isFormsTouched: boolean;
  saveSettings: () => void;
  toggleOpenMenu: () => void;
}

const AppLayoutComponent: FC<AppLayoutComponentProps> = ({
  open,
  isFormsTouched,
  saveSettings,
  toggleOpenMenu
}) => {
  const { token } = theme.useToken();

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
              onClick={saveSettings}
              disabled={!open || !isFormsTouched}
            >
              <SaveOutlined />
              Сохранить
            </Button>
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
