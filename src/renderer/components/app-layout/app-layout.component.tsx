import "./app-layout.scss";
import React, { FC, memo } from "react";
import clsx from "clsx";
import { Button, Layout, theme } from "antd";
import {
  DeleteOutlined,
  MenuOutlined,
  SaveOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import packageJson from "../../../../package.json";
import NetSchemeContainer from "../net-scheme/net-scheme.container";
import SettingsMenuContainer from "../settings-menu/settings-menu.container";

export interface AppLayoutComponentProps {
  open: boolean;
  configLoading: boolean;
  showManualPingBtn: boolean;
  isFormsTouched: boolean;
  saveSettings: () => void;
  toggleOpenMenu: () => void;
  pingManually: () => void;
  onLinkClick: () => void;
}

const AppLayoutComponent: FC<AppLayoutComponentProps> = ({
  open,
  configLoading,
  showManualPingBtn,
  isFormsTouched,
  saveSettings,
  toggleOpenMenu,
  pingManually,
  onLinkClick,
}) => {
  const { token } = theme.useToken();

  return (
    <Layout className="app-layout">
      <Layout.Header
        style={{
          background: token.colorBgLayout,
          borderColor: token.colorBorder,
        }}
        className="app-layout__header"
      >
        <div className="app-layout__header__btns-block">
          <Button size="small" onClick={toggleOpenMenu} title="Меню настроек">
            <MenuOutlined />
          </Button>
          {showManualPingBtn && (
            <Button
              size="small"
              disabled={configLoading}
              onClick={pingManually}
              title="Ручной пинг"
            >
              <SyncOutlined />
            </Button>
          )}
          <div
            className={clsx("app-layout__header__btns-block__settings", {
              _touched: open && isFormsTouched,
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
        <span>Net Monitoring v{packageJson.version}</span>
        <span>
          ©2024-{new Date().getFullYear()} Created by{" "}
          <a onClick={onLinkClick} target="_blank" rel="noreferrer">
            asgorlov
          </a>
        </span>
      </Layout.Footer>
    </Layout>
  );
};

export default memo(AppLayoutComponent);
