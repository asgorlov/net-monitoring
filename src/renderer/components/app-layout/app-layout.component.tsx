import "./app-layout.scss";
import React, { FC } from "react";
import clsx from "clsx";
import { Button, Layout, theme } from "antd";
import {
  DeleteOutlined,
  LoadingOutlined,
  MenuOutlined,
  SaveOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import packageJson from "../../../../package.json";
import NetSchemeContainer from "../net-scheme/net-scheme.container";
import SettingsMenuContainer from "../settings-menu/settings-menu.container";
import { SchemeForm, SettingsForm } from "../../models/settings.models";

export interface AppLayoutComponentProps {
  open: boolean;
  configLoading: boolean;
  isAppInitialized: boolean;
  showManualPingBtn: boolean;
  isFormsTouched: boolean;
  saveSettings: () => void;
  toggleOpenMenu: () => void;
  pingManually: () => void;
  onLinkClick: () => void;
  setSettingsForm: (form: SettingsForm) => void;
  setSchemeForm: (form: SchemeForm) => void;
}

const AppLayoutComponent: FC<AppLayoutComponentProps> = ({
  open,
  configLoading,
  isAppInitialized,
  showManualPingBtn,
  isFormsTouched,
  saveSettings,
  toggleOpenMenu,
  pingManually,
  onLinkClick,
  setSettingsForm,
  setSchemeForm,
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
          <Button
            size="small"
            onClick={toggleOpenMenu}
            title="Меню настроек приложения"
            disabled={!isAppInitialized}
          >
            <MenuOutlined />
          </Button>
          {showManualPingBtn && (
            <Button
              size="small"
              disabled={configLoading || !isAppInitialized}
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
        {isAppInitialized ? (
          <>
            <SettingsMenuContainer ref={setSettingsForm} />
            <NetSchemeContainer ref={setSchemeForm} />
          </>
        ) : (
          <div className="app-layout__content__loading">
            <LoadingOutlined />
            Загрузка приложения
          </div>
        )}
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

export default AppLayoutComponent;
